import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getIndustryGuide } from "@/lib/industry-guides";
import { playbooks } from "@/lib/platform-content";
import {
  GuideAnswer,
  GuideFaq,
  GuideRules,
  GuideWorkflows,
  guideNavItems
} from "@/features/industries/industry-guide";
import { SectionNav } from "@/features/industries/section-nav";
import { easeScore } from "@/features/opportunities/ease";
import { OpportunityRow } from "@/features/opportunities/opportunity-row";
import { getIndustryBySlug, listIndustrySummaries } from "@/server/intelligence/queries";
import { AnimatedNumber } from "@/components/motion/animated-number";
import { Reveal } from "@/components/motion/reveal";
import { SplitReveal } from "@/components/motion/split-reveal";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { JsonLd, breadcrumbJsonLd } from "@/lib/structured-data";

export const revalidate = 3600;

// Pre-render every published industry at build time; new ones render on demand.
export async function generateStaticParams() {
  try {
    const industries = await listIndustrySummaries();
    return industries.map((industry) => ({ slug: industry.slug }));
  } catch {
    return [];
  }
}

type IndustryPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: IndustryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const industry = await getIndustryBySlug(slug);

  if (!industry) {
    return {
      title: "Industry not found"
    };
  }

  const guide = getIndustryGuide(industry.slug);
  const title = guide?.headline ?? `${industry.name} AI Roadmap`;
  const description = guide
    ? `${guide.answerFirst.split(". ").slice(0, 2).join(". ")}.`
    : industry.description ?? `AI roadmap for ${industry.name}.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/industries/${industry.slug}`
    },
    openGraph: {
      title,
      description,
      url: `/industries/${industry.slug}`,
      type: "website"
    }
  };
}

export default async function IndustryPage({ params }: IndustryPageProps) {
  const { slug } = await params;
  const industry = await getIndustryBySlug(slug);

  if (!industry) {
    notFound();
  }

  const guide = getIndustryGuide(industry.slug);
  const [headlineLead, headlineRest] = splitHeadline(guide?.headline ?? `${industry.name}: an AI roadmap`);
  const topScore = Math.max(0, ...industry.opportunities.map((item) => easeScore(item.effortLevel, item.riskLevel)));

  const navItems = [
    ...(guide ? guideNavItems : [{ id: "start", label: "Where to start" }]),
    { id: "opportunities", label: "Opportunities" },
    ...(guide ? [{ id: "faq", label: "Questions" }] : []),
    { id: "next", label: "Before you start" }
  ];

  return (
    <main>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Industries", path: "/industries" },
            { name: industry.name, path: `/industries/${industry.slug}` }
          ]),
          ...(guide
            ? [
                {
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  mainEntity: guide.faq.map((item) => ({
                    "@type": "Question",
                    name: item.question,
                    acceptedAnswer: { "@type": "Answer", text: item.answer }
                  }))
                }
              ]
            : [])
        ]}
      />

      {/* ---------- Hero ---------- */}
      <section className="app-container page-hero">
        <Reveal>
          <Link className="link-underline text-sm text-ink/60" href="/industries">
            <ArrowLeft aria-hidden="true" size={14} />
            All industries
          </Link>
        </Reveal>
        <Reveal delay={0.05}>
          <p className="eyebrow mt-8">{industry.name}</p>
        </Reveal>
        <SplitReveal
          className="h1 mt-6 max-w-5xl"
          delay={0.1}
          lines={[[headlineLead], [{ text: headlineRest, className: "ghost-word" }]]}
        />
        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <Reveal delay={0.35}>
            {industry.description ? <p className="lead">{industry.description}</p> : null}
            <div className="mt-8 flex flex-wrap gap-3">
              <Link className="btn btn-primary" href={`/audit/questions?industry=${industry.slug}`}>
                Start the free audit
                <ArrowRight aria-hidden="true" size={16} />
              </Link>
            </div>
          </Reveal>
          <Stagger className="grid grid-cols-3 gap-6 sm:gap-10" delay={0.4}>
            {[
              { value: industry.opportunities.length, label: "Opportunities" },
              { value: guide?.workflows.length ?? 0, label: "Ranked workflows", hide: !guide },
              { value: topScore, label: "Best ease score" }
            ]
              .filter((stat) => !stat.hide)
              .map((stat) => (
                <StaggerItem className="border-t border-ink/15 pt-3 sm:min-w-32" key={stat.label}>
                  <span className="stat-number block text-[clamp(2.2rem,4.5vw,3.4rem)]">
                    <AnimatedNumber value={stat.value} />
                  </span>
                  <span className="mt-1 block text-sm text-ink/55">{stat.label}</span>
                </StaggerItem>
              ))}
          </Stagger>
        </div>
      </section>

      {/* ---------- Body with sticky nav ---------- */}
      <div className="app-container grid gap-12 pb-24 pt-6 md:pb-32 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-16 xl:gap-24">
        <aside className="hidden lg:block">
          <div className="sticky top-28">
            <SectionNav items={navItems} />
          </div>
        </aside>

        <div className="grid min-w-0 max-w-4xl gap-20 md:gap-28">
          {guide ? (
            <>
              <GuideAnswer guide={guide} />
              <GuideWorkflows guide={guide} />
              <GuideRules guide={guide} />
            </>
          ) : (
            <section className="scroll-mt-28" id="start">
              <Reveal>
                <div className="night spotlight spotlight-strong rounded-[2rem] px-6 py-10 sm:px-10 md:py-14" data-spotlight>
                  <div aria-hidden="true" className="dot-grid absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_100%_0%,black,transparent_60%)]" />
                  <div className="relative">
                    <p className="eyebrow">Where to start</p>
                    <p className="mt-6 font-display text-[1.45rem] font-medium leading-[1.3] tracking-[-0.02em] text-white md:text-[1.85rem]">
                      {industry.startingPoint ?? "Start with one repeated workflow a person can review."}
                    </p>
                  </div>
                </div>
              </Reveal>
            </section>
          )}

          <section className="scroll-mt-28" id="opportunities">
            <div className="flex items-end justify-between gap-4">
              <SplitReveal
                as="h2"
                className="h2"
                inView
                lines={[["Opportunities,"], [{ text: "easiest first.", className: "ghost-word" }]]}
              />
              <span className="pb-1 font-mono text-sm text-ink/40">
                {String(industry.opportunities.length).padStart(2, "0")}
              </span>
            </div>
            <Stagger as="ul" className="row-list mt-10" gap={0.05} inView>
              {[...industry.opportunities]
                .sort(
                  (a, b) => easeScore(b.effortLevel, b.riskLevel) - easeScore(a.effortLevel, a.riskLevel)
                )
                .map((opportunity, index) => (
                  <StaggerItem as="li" key={opportunity.id}>
                    <OpportunityRow highlight={index === 0} opportunity={opportunity} />
                  </StaggerItem>
                ))}
            </Stagger>
          </section>

          {guide ? <GuideFaq guide={guide} /> : null}

          <section className="scroll-mt-28" id="next">
            <div className="grid gap-12 md:grid-cols-2 md:gap-10">
              {industry.cautions ? (
                <Reveal>
                  <p className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-ink/40">Watch out</p>
                  <p className="mt-4 border-l-2 border-signal pl-5 font-display text-[1.25rem] font-medium leading-snug tracking-[-0.015em]">
                    {industry.cautions}
                  </p>
                </Reveal>
              ) : null}
              <div>
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-ink/40">Playbooks</p>
                <Stagger as="ul" className="row-list mt-4" inView>
                  {playbooks.slice(0, 2).map((playbook) => (
                    <StaggerItem as="li" key={playbook.slug}>
                      <Link
                        className="row-item group grid-cols-[minmax(0,1fr)_auto] py-5"
                        href={`/playbooks/${playbook.slug}`}
                      >
                        <span className="min-w-0">
                          <span className="block font-semibold transition-transform duration-500 group-hover:translate-x-1">
                            {playbook.title}
                          </span>
                          <span className="mt-1 text-sm text-ink/50 line-clamp-1">{playbook.outcome}</span>
                        </span>
                        <span className="row-arrow">
                          <ArrowRight aria-hidden="true" size={15} />
                        </span>
                      </Link>
                    </StaggerItem>
                  ))}
                </Stagger>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

// "AI for online stores: where it pays back first" -> lead + ghost clause.
function splitHeadline(headline: string): [string, string] {
  const index = headline.indexOf(":");
  if (index === -1) {
    return [headline, ""];
  }
  const rest = headline.slice(index + 1).trim();
  return [headline.slice(0, index), rest ? `${rest.charAt(0).toUpperCase()}${rest.slice(1)}.` : ""];
}
