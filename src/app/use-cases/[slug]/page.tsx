import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight, SearchX } from "lucide-react";
import {
  getUseCaseBySlug,
  listToolsForUseCase,
  listUseCaseSummaries,
  type PublicUseCaseToolFit
} from "@/server/use-cases/queries";
import { TrackedExternalLink } from "@/features/analytics/tracked-link";
import { ToolLikeButton } from "@/features/tools/tool-like-button";
import { ToolLogo } from "@/features/tools/tool-logo";
import { easeScore, formatLevel, levelRank } from "@/features/opportunities/ease";
import { FitMeter } from "@/features/use-cases/fit-meter";
import { AnimatedNumber } from "@/components/motion/animated-number";
import { Reveal } from "@/components/motion/reveal";
import { SplitReveal } from "@/components/motion/split-reveal";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { ScoreDial } from "@/components/ui/score-dial";
import { JsonLd, breadcrumbJsonLd } from "@/lib/structured-data";

export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const useCases = await listUseCaseSummaries();
    return useCases.map((useCase) => ({ slug: useCase.slug }));
  } catch {
    return [];
  }
}

type UseCasePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: UseCasePageProps): Promise<Metadata> {
  const { slug } = await params;
  const useCase = await getUseCaseBySlug(slug);

  if (!useCase) {
    return {
      title: "Use case not found"
    };
  }

  const description =
    useCase.outcome ??
    useCase.description ??
    `Decision guide and AI tools for ${useCase.name.toLowerCase()}.`;

  return {
    title: `${useCase.name} AI Decision Guide`,
    description,
    alternates: {
      canonical: `/use-cases/${useCase.slug}`
    },
    openGraph: {
      title: `${useCase.name} AI Decision Guide`,
      description,
      url: `/use-cases/${useCase.slug}`,
      type: "website"
    }
  };
}

const riskNotes: Record<string, string> = {
  LOW: "Low stakes. Still give it an owner and a simple standard for good enough.",
  MEDIUM: "Use approved examples and a review checkpoint before anything ships.",
  HIGH: "Run a tightly scoped pilot. A person approves every output that reaches a customer, an employee or the books."
};

const fallbackSteps = [
  "Document the current workflow and owner.",
  "Define the review point and success metric.",
  "Pilot one tool against recent real examples.",
  "Review quality before expanding usage."
];

const fallbackInputs = ["Workflow owner", "Current example work", "Human review criteria"];

export default async function UseCasePage({ params }: UseCasePageProps) {
  const { slug } = await params;
  const [useCase, tools] = await Promise.all([getUseCaseBySlug(slug), listToolsForUseCase(slug)]);

  if (!useCase) {
    notFound();
  }

  const ranked = [...tools].sort((a, b) => b.fitScore - a.fitScore).slice(0, 10);
  const score = easeScore(useCase.effortLevel, useCase.riskLevel);
  const steps = useCase.implementationSteps.length > 0 ? useCase.implementationSteps : fallbackSteps;
  const inputs = useCase.requiredInputs.length > 0 ? useCase.requiredInputs : fallbackInputs;
  const outcome =
    useCase.outcome ??
    useCase.description ??
    `Decide whether ${useCase.name.toLowerCase()} is the right AI workflow to pilot next.`;

  return (
    <main>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Use cases", path: "/use-cases" },
          { name: useCase.name, path: `/use-cases/${useCase.slug}` }
        ])}
      />

      {/* ---------- Hero ---------- */}
      <section className="app-container page-hero">
        <Reveal>
          <Link className="link-underline text-sm text-ink/60" href="/use-cases">
            <ArrowLeft aria-hidden="true" size={14} />
            All use cases
          </Link>
        </Reveal>
        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-end lg:gap-16">
          <div>
            <Reveal delay={0.05}>
              <p className="eyebrow">{useCase.businessFunction?.name ?? "Workflow"}</p>
            </Reveal>
            <SplitReveal className="h1 mt-6" delay={0.1} lines={[[useCase.name]]} />
            <Reveal delay={0.35}>
              <p className="lead mt-6">{outcome}</p>
              {useCase.painPoints.length > 0 ? (
                <ul aria-label="Fixes" className="mt-6 flex flex-wrap gap-2">
                  {useCase.painPoints.slice(0, 4).map((painPoint) => (
                    <li className="tag" key={painPoint}>
                      {painPoint}
                    </li>
                  ))}
                </ul>
              ) : null}
            </Reveal>
          </div>

          <Reveal delay={0.25} y={36}>
            <div
              className="night spotlight spotlight-strong rounded-[2rem] p-6 sm:p-8"
              data-spotlight
            >
              <div aria-hidden="true" className="dot-grid absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_90%_0%,black,transparent_65%)]" />
              <div className="relative flex items-center gap-5">
                <ScoreDial label="Ease to start" size={92} tone="light" value={score} />
                <div>
                  <p className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-white/50">
                    Ease to start
                  </p>
                  <p className="mt-1 text-sm text-white/70">From effort and risk. Higher is easier.</p>
                </div>
              </div>
              <dl className="relative mt-7 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-white/10">
                <HeroStat label="Effort" level={useCase.effortLevel} value={formatLevel(useCase.effortLevel)} />
                <HeroStat label="Risk" level={useCase.riskLevel} value={formatLevel(useCase.riskLevel)} />
                <HeroStat label="Time to value" value={useCase.timeToValue ?? "Varies"} />
                <HeroStat label="Tools mapped" value={<AnimatedNumber value={useCase.toolCount} />} />
              </dl>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- Tools ranked ---------- */}
      <section className="app-container scroll-mt-28 pb-20 pt-8 md:pb-28 md:pt-14" id="mapped-tools">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <Reveal>
              <p className="eyebrow">Tool shortlist</p>
            </Reveal>
            <SplitReveal
              as="h2"
              className="h2 mt-5"
              inView
              lines={[["Ranked by fit."], [{ text: "For this job only.", className: "ghost-word" }]]}
            />
          </div>
          <Reveal>
            <Link className="link-underline text-sm" href="/methodology">
              How fit is scored
              <ArrowUpRight aria-hidden="true" size={14} />
            </Link>
          </Reveal>
        </div>

        {ranked.length > 0 ? (
          <Stagger as="ol" className="row-list mt-10 md:mt-12" gap={0.05} inView>
            {ranked.map((tool, index) => (
              <StaggerItem as="li" key={tool.id}>
                <ToolFitRow index={index} tool={tool} />
              </StaggerItem>
            ))}
          </Stagger>
        ) : (
          <Reveal className="mt-10 flex flex-col items-start gap-5 border-y border-ink/10 py-12 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <SearchX aria-hidden="true" className="text-ink/40" size={22} />
              <p className="h3">No tools mapped yet.</p>
            </div>
            <Link className="btn btn-ghost" href="/tools">
              Browse tools
              <ArrowRight aria-hidden="true" size={16} />
            </Link>
          </Reveal>
        )}
      </section>

      {/* ---------- Playbook ---------- */}
      <section className="app-container pb-24 md:pb-32">
        <div className="grid gap-12 border-t border-ink/15 pt-14 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20 md:pt-20">
          <div className="lg:sticky lg:top-28 lg:h-fit">
            <Reveal>
              <p className="eyebrow">Pilot plan</p>
            </Reveal>
            <SplitReveal
              as="h2"
              className="h2 mt-5"
              inView
              lines={[["Two weeks."], [{ text: "One owner.", className: "ghost-word" }]]}
            />
            <Reveal>
              <p className="mt-6 max-w-sm text-ink/60">{riskNotes[useCase.riskLevel] ?? riskNotes.MEDIUM}</p>
            </Reveal>
          </div>

          <div className="grid gap-14">
            <div>
              <h3 className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-ink/45">Steps</h3>
              <Stagger as="ol" className="row-list mt-4" inView>
                {steps.map((step, index) => (
                  <StaggerItem
                    as="li"
                    className="row-item grid-cols-[2.5rem_minmax(0,1fr)] items-baseline py-5"
                    key={step}
                  >
                    <span className="font-mono text-sm text-signal">{String(index + 1).padStart(2, "0")}</span>
                    <span className="text-lg leading-snug">{step}</span>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>

            <div className="grid gap-12 sm:grid-cols-2 sm:gap-8">
              <Reveal>
                <h3 className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-ink/45">You need</h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {inputs.map((input) => (
                    <li className="chip" key={input}>
                      {input}
                    </li>
                  ))}
                </ul>
              </Reveal>
              {useCase.successMetrics.length > 0 ? (
                <Reveal delay={0.08}>
                  <h3 className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-ink/45">Measure</h3>
                  <ul className="mt-4 grid gap-3">
                    {useCase.successMetrics.map((metric) => (
                      <li className="flex items-baseline gap-3" key={metric}>
                        <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 translate-y-[-2px] rounded-full bg-signal" />
                        <span>{metric}</span>
                      </li>
                    ))}
                  </ul>
                </Reveal>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Related opportunities ---------- */}
      {useCase.opportunities.length > 0 ? (
        <section className="app-container pb-24 md:pb-32">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SplitReveal
              as="h2"
              className="h3 md:text-[2rem]"
              inView
              lines={[["Problems this solves"]]}
            />
            <Link className="link-underline text-sm" href="/opportunities">
              All opportunities
              <ArrowUpRight aria-hidden="true" size={14} />
            </Link>
          </div>
          <Stagger as="ul" className="row-list mt-8" inView>
            {useCase.opportunities.slice(0, 4).map((opportunity) => (
              <StaggerItem as="li" key={opportunity.id}>
                <Link
                  className="row-item group grid-cols-[minmax(0,1fr)_auto] py-6 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)_auto] md:gap-8"
                  href={`/opportunities/${opportunity.slug}`}
                >
                  <span className="font-display text-xl font-semibold tracking-[-0.02em] transition-transform duration-500 group-hover:translate-x-1.5 md:text-2xl">
                    {opportunity.name}
                  </span>
                  <span className="col-span-2 row-start-2 text-ink/55 md:col-span-1 md:col-start-2 md:row-start-1">
                    {opportunity.expectedBenefit ?? opportunity.startingPoint ?? ""}
                  </span>
                  <span className="row-arrow col-start-2 row-start-1 md:col-start-3">
                    <ArrowRight aria-hidden="true" size={16} />
                  </span>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </section>
      ) : null}
    </main>
  );
}

function HeroStat({
  label,
  level,
  value
}: {
  label: string;
  level?: string;
  value: ReactNode;
}) {
  const rank = level ? levelRank(level) : -1;

  return (
    <div className="bg-night p-4 sm:p-5">
      <dt className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-white/45">{label}</dt>
      <dd className="mt-2 font-mono text-[1.35rem] font-medium leading-none tracking-[-0.02em] text-white tabular sm:text-[1.6rem]">
        {value}
      </dd>
      {level ? (
        <div aria-hidden="true" className="mt-3 grid grid-cols-3 gap-1">
          {[0, 1, 2].map((pip) => (
            <span
              className={`h-1 rounded-full ${pip <= rank ? (rank === 2 ? "bg-signal" : "bg-white/80") : "bg-white/15"}`}
              key={pip}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function ToolFitRow({ index, tool }: { index: number; tool: PublicUseCaseToolFit }) {
  const top = index === 0;
  const note =
    tool.bestFor ?? tool.recommendationNote ?? `Mapped to ${tool.category.name.toLowerCase()} workflows.`;

  return (
    <div className="row-item row-link group grid-cols-[auto_minmax(0,1fr)_auto] gap-x-4 gap-y-3 py-5 md:grid-cols-[2.5rem_minmax(0,1.1fr)_minmax(0,1fr)_10rem_auto] md:gap-x-6 md:py-6">
      <span className={`hidden font-mono text-sm md:block ${top ? "text-signal" : "text-ink/40"}`}>
        {String(index + 1).padStart(2, "0")}
      </span>

      <div className="col-span-2 flex min-w-0 items-center gap-4 md:col-span-1">
        <ToolLogo logoUrl={tool.logoUrl} name={tool.name} />
        <div className="min-w-0">
          <Link
            className="block truncate font-display text-[1.25rem] font-semibold tracking-[-0.02em] after:absolute after:inset-0 after:content-[''] md:text-[1.4rem]"
            href={`/tools/${tool.slug}`}
          >
            {tool.name}
          </Link>
          <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-sm text-ink/50">
            <span>{tool.category.name}</span>
            <span aria-hidden="true">·</span>
            <span>{tool.hasFreePlan ? "Free plan" : formatPricing(tool.pricingType)}</span>
          </p>
        </div>
      </div>

      <p className="col-span-3 row-start-3 line-clamp-2 text-[0.95rem] text-ink/60 md:col-span-1 md:row-start-1 md:col-start-3">
        {note}
      </p>

      <div className="col-span-2 row-start-2 flex items-center gap-3 md:col-span-1 md:col-start-4 md:row-start-1">
        <FitMeter signal={top} value={tool.fitScore} />
        <span className="w-8 text-right font-mono text-lg font-medium tabular">
          <AnimatedNumber value={tool.fitScore} />
        </span>
      </div>

      <div className="relative z-10 col-start-3 row-start-1 flex items-center gap-2 md:col-start-5">
        <ToolLikeButton toolId={tool.id} toolName={tool.name} toolSlug={tool.slug} />
        <TrackedExternalLink
          aria-label={`Visit ${tool.name} website`}
          className="icon-button hidden sm:inline-flex"
          event="tool_website_clicked"
          href={tool.websiteUrl}
          properties={{ source: "use_case_tool_fit", toolSlug: tool.slug }}
          rel="noreferrer"
          target="_blank"
        >
          <ArrowUpRight aria-hidden="true" size={16} />
        </TrackedExternalLink>
      </div>
    </div>
  );
}

function formatPricing(pricingType: string) {
  if (pricingType === "FREEMIUM") {
    return "Freemium";
  }

  if (pricingType === "FREE") {
    return "Free";
  }

  return "Paid";
}
