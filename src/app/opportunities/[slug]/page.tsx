import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getOpportunityBySlug, listOpportunitySummaries } from "@/server/intelligence/queries";
import { easeScore, formatLevel, levelRank } from "@/features/opportunities/ease";
import { LevelTag } from "@/features/use-cases/level-tag";
import { Reveal } from "@/components/motion/reveal";
import { SplitReveal } from "@/components/motion/split-reveal";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { ScoreDial } from "@/components/ui/score-dial";
import { JsonLd, breadcrumbJsonLd } from "@/lib/structured-data";

export const revalidate = 3600;

// Pre-render every published opportunity at build time; new ones render on demand.
export async function generateStaticParams() {
  try {
    const opportunities = await listOpportunitySummaries();
    return opportunities.map((opportunity) => ({ slug: opportunity.slug }));
  } catch {
    return [];
  }
}

type OpportunityPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: OpportunityPageProps): Promise<Metadata> {
  const { slug } = await params;
  const opportunity = await getOpportunityBySlug(slug);

  if (!opportunity) {
    return {
      title: "Opportunity not found"
    };
  }

  return {
    title: opportunity.name,
    description: opportunity.description ?? `AI opportunity plan for ${opportunity.name}.`,
    alternates: {
      canonical: `/opportunities/${opportunity.slug}`
    },
    openGraph: {
      title: opportunity.name,
      description: opportunity.description ?? `AI opportunity plan for ${opportunity.name}.`,
      url: `/opportunities/${opportunity.slug}`,
      type: "website"
    }
  };
}

export default async function OpportunityPage({ params }: OpportunityPageProps) {
  const { slug } = await params;
  const opportunity = await getOpportunityBySlug(slug);

  if (!opportunity) {
    notFound();
  }

  const score = easeScore(opportunity.effortLevel, opportunity.riskLevel);
  const brief = [
    { label: "The problem", value: opportunity.painPoint },
    { label: "The payoff", value: opportunity.expectedBenefit },
    { label: "Start here", value: opportunity.startingPoint }
  ].filter((item): item is { label: string; value: string } => Boolean(item.value));

  return (
    <main>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Opportunities", path: "/opportunities" },
          { name: opportunity.name, path: `/opportunities/${opportunity.slug}` }
        ])}
      />

      {/* ---------- Night hero ---------- */}
      <section className="app-container pt-6 md:pt-10">
        <div
          className="night spotlight spotlight-strong rounded-[2rem] px-6 pb-10 pt-8 sm:px-10 md:rounded-[2.5rem] md:px-14 md:pb-16 md:pt-12"
          data-spotlight
        >
          <div aria-hidden="true" className="dot-grid absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_85%_20%,black,transparent_60%)]" />
          <div aria-hidden="true" className="glow-orb -right-32 -top-32 h-[26rem] w-[26rem] opacity-25" />
          <div className="relative">
            <Link className="link-underline text-sm text-white/60 hover:text-white" href="/opportunities">
              <ArrowLeft aria-hidden="true" size={14} />
              All opportunities
            </Link>
            <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-16">
              <div>
                <p className="eyebrow">{opportunity.businessFunction?.name ?? "Opportunity"}</p>
                <SplitReveal
                  className="mt-6 font-display text-[clamp(2.4rem,5.6vw,4.6rem)] font-bold leading-[0.98] tracking-[-0.045em] text-white"
                  delay={0.1}
                  lines={[[opportunity.name]]}
                />
                {opportunity.description ? (
                  <Reveal delay={0.35}>
                    <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/60">{opportunity.description}</p>
                  </Reveal>
                ) : null}
              </div>
              <Reveal delay={0.25} y={30}>
                <div className="flex items-center gap-6 sm:gap-8">
                  <ScoreDial
                    className="hidden sm:inline-flex"
                    label="Ease to start"
                    size={168}
                    stroke={9}
                    tone="light"
                    value={score}
                  />
                  <ScoreDial className="sm:hidden" label="Ease to start" size={120} stroke={8} tone="light" value={score} />
                  <dl className="grid gap-4">
                    <div>
                      <dt className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-white/45">Ease to start</dt>
                      <dd className="mt-1 text-sm text-white/60">Out of 100</dd>
                    </div>
                    <HeroLevel label="Effort" level={opportunity.effortLevel} />
                    <HeroLevel label="Risk" level={opportunity.riskLevel} />
                    {opportunity.timeToValue ? (
                      <div>
                        <dt className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-white/45">Payback</dt>
                        <dd className="mt-1 font-mono text-white">{opportunity.timeToValue}</dd>
                      </div>
                    ) : null}
                  </dl>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Brief ---------- */}
      {brief.length > 0 ? (
        <section className="app-container section-tight">
          <Stagger as="div" className="row-list" inView>
            {brief.map((item, index) => (
              <StaggerItem
                className="row-item items-baseline gap-3 py-8 md:grid-cols-[3rem_14rem_minmax(0,1fr)] md:gap-8 md:py-10"
                key={item.label}
              >
                <span className="hidden font-mono text-sm text-signal md:block">{String(index + 1).padStart(2, "0")}</span>
                <span className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-ink/45">{item.label}</span>
                <p className="max-w-[60ch] font-display text-[1.3rem] font-medium leading-snug tracking-[-0.015em] md:text-[1.6rem]">
                  {item.value}
                </p>
              </StaggerItem>
            ))}
          </Stagger>
        </section>
      ) : null}

      {/* ---------- Use cases + measures ---------- */}
      <section className="app-container pb-20 md:pb-28">
        <div className="grid gap-16 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)] lg:gap-20">
          <div>
            <SplitReveal
              as="h2"
              className="h2"
              inView
              lines={[["Workflows"], [{ text: "that fix it.", className: "ghost-word" }]]}
            />
            {opportunity.useCases.length > 0 ? (
              <Stagger as="ul" className="row-list mt-10" inView>
                {opportunity.useCases.map((useCase) => (
                  <StaggerItem as="li" key={useCase.id}>
                    <Link
                      className="row-item group grid-cols-[minmax(0,1fr)_auto] gap-y-3 py-6"
                      href={`/use-cases/${useCase.slug}`}
                    >
                      <span className="min-w-0">
                        <span className="block font-display text-[1.25rem] font-semibold tracking-[-0.02em] transition-transform duration-500 group-hover:translate-x-1.5 md:text-[1.45rem]">
                          {useCase.name}
                        </span>
                        {useCase.outcome ?? useCase.description ? (
                          <span className="mt-1 block text-[0.95rem] text-ink/55 md:line-clamp-1">
                            {useCase.outcome ?? useCase.description}
                          </span>
                        ) : null}
                        <span className="mt-3 flex flex-wrap items-center gap-1.5">
                          <LevelTag label="effort" level={useCase.effortLevel} />
                          <LevelTag label="risk" level={useCase.riskLevel} />
                          {useCase.timeToValue ? (
                            <span className="ml-1 font-mono text-xs text-ink/50">{useCase.timeToValue}</span>
                          ) : null}
                        </span>
                      </span>
                      <span className="row-arrow">
                        <ArrowRight aria-hidden="true" size={16} />
                      </span>
                    </Link>
                  </StaggerItem>
                ))}
              </Stagger>
            ) : (
              <p className="mt-8 text-ink/55">No workflows mapped yet.</p>
            )}
          </div>

          <div className="grid h-fit gap-14 lg:sticky lg:top-28">
            {opportunity.successMetrics.length > 0 ? (
              <Reveal>
                <h2 className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-ink/45">Measure</h2>
                <ol className="row-list mt-4">
                  {opportunity.successMetrics.map((metric, index) => (
                    <li className="row-item grid-cols-[2rem_minmax(0,1fr)] items-baseline py-4" key={metric}>
                      <span className="font-mono text-xs text-signal">{String(index + 1).padStart(2, "0")}</span>
                      <span>{metric}</span>
                    </li>
                  ))}
                </ol>
              </Reveal>
            ) : null}
            {opportunity.industries.length > 0 ? (
              <Reveal delay={0.08}>
                <h2 className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-ink/45">Fits</h2>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {opportunity.industries.map((industry) => (
                    <li key={industry.id}>
                      <Link className="chip" href={`/industries/${industry.slug}`}>
                        {industry.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </Reveal>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
}

function HeroLevel({ label, level }: { label: string; level: string }) {
  const rank = levelRank(level);

  return (
    <div>
      <dt className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-white/45">{label}</dt>
      <dd className="mt-1 flex items-center gap-3 text-white">
        <span className="w-16">{formatLevel(level)}</span>
        <span aria-hidden="true" className="grid w-16 grid-cols-3 gap-1">
          {[0, 1, 2].map((pip) => (
            <span
              className={`h-1 rounded-full ${pip <= rank ? (rank === 2 ? "bg-signal" : "bg-white/85") : "bg-white/15"}`}
              key={pip}
            />
          ))}
        </span>
      </dd>
    </div>
  );
}
