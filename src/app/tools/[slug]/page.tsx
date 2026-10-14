import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight, Check, ExternalLink, GitCompareArrows, X } from "lucide-react";
import { TrackedExternalLink } from "@/features/analytics/tracked-link";
import { ToolLikeButton } from "@/features/tools/tool-like-button";
import { ToolLogo } from "@/features/tools/tool-logo";
import { ToolList, formatPricing } from "@/features/tools/tool-row";
import { ToolScreenshot } from "@/features/tools/tool-screenshot";
import {
  getPublishedToolBySlug,
  listPublishedTools
} from "@/server/tools/queries";
import type { PublicToolDetail } from "@/shared/domain";
import { hasRichToolContent } from "@/server/tools/content-quality";
import { AnimatedBar } from "@/components/motion/animated-bar";
import { AnimatedNumber } from "@/components/motion/animated-number";
import { Magnetic } from "@/components/motion/magnetic";
import { Reveal } from "@/components/motion/reveal";
import { SplitReveal } from "@/components/motion/split-reveal";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { ScoreDial } from "@/components/ui/score-dial";
import {
  JsonLd,
  breadcrumbJsonLd,
  softwareApplicationJsonLd
} from "@/lib/structured-data";

export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const tools = await listPublishedTools({ limit: 100 });
    return tools.map((tool) => ({ slug: tool.slug }));
  } catch {
    return [];
  }
}

type ToolDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params
}: ToolDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = await getPublishedToolBySlug(slug);

  if (!tool) {
    return {
      title: "Tool not found"
    };
  }

  return {
    title: tool.metaTitle ?? `${tool.name} Review, Use Cases, and Alternatives`,
    description: tool.metaDescription ?? tool.shortDescription,
    // Only editorially featured tools carry enough original content to be
    // worth indexing; the rest stay crawlable but out of the index until
    // their write-ups are enriched (see docs/REVAMP_PLAN.md, Phase 2).
    robots: hasRichToolContent(tool) ? undefined : { index: false, follow: true },
    alternates: {
      canonical: `/tools/${tool.slug}`
    },
    openGraph: {
      title: tool.metaTitle ?? `${tool.name} Review, Use Cases, and Alternatives`,
      description: tool.metaDescription ?? tool.shortDescription,
      url: `/tools/${tool.slug}`,
      type: "website"
    }
  };
}

export default async function ToolDetailPage({ params }: ToolDetailPageProps) {
  const { slug } = await params;
  const tool = await getPublishedToolBySlug(slug);

  if (!tool) {
    notFound();
  }

  const alternatives = tool.alternatives;
  const useCases = [...tool.useCases].sort((a, b) => b.fitScore - a.fitScore);
  const topUseCase = useCases[0];
  const averageFit =
    tool.useCases.length > 0
      ? Math.round(
          tool.useCases.reduce((total, useCase) => total + useCase.fitScore, 0) /
            tool.useCases.length
        )
      : null;
  const dialValue = averageFit ?? tool.popularityScore;
  const opportunities = uniqueOpportunities(tool);
  const pricingLine =
    tool.startingPrice !== null
      ? `${formatPricing(tool.pricingType)}, from $${tool.startingPrice}/mo`
      : formatPricing(tool.pricingType);

  return (
    <main>
      <JsonLd
        data={[
          softwareApplicationJsonLd(tool),
          breadcrumbJsonLd([
            { name: "Tools", path: "/tools" },
            { name: tool.category.name, path: `/categories/${tool.category.slug}` },
            { name: tool.name, path: `/tools/${tool.slug}` }
          ])
        ]}
      />

      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="grid-lines absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_top_left,black_10%,transparent_60%)]" />
        </div>
        <div className="app-container page-hero relative grid gap-12 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] lg:items-center lg:gap-16">
          <div className="min-w-0">
            <Reveal y={10}>
              <nav aria-label="Breadcrumb" className="flex items-center gap-2 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-ink/45">
                <Link className="transition-colors hover:text-ink" href="/tools">
                  Tools
                </Link>
                <span aria-hidden="true">/</span>
                <Link
                  className="truncate transition-colors hover:text-ink"
                  href={`/categories/${tool.category.slug}`}
                >
                  {tool.category.name}
                </Link>
              </nav>
            </Reveal>
            <Reveal delay={0.05} y={20}>
              <ToolLogo className="mt-8" logoUrl={tool.logoUrl} name={tool.name} size="xl" />
            </Reveal>
            <SplitReveal
              className="display mt-7 break-words"
              delay={0.1}
              lines={[[tool.name, { text: ".", className: "accent-word" }]]}
            />
            <Stagger delay={0.4}>
              <StaggerItem>
                <p className="lead mt-6 max-w-2xl">{tool.shortDescription}</p>
              </StaggerItem>
              <StaggerItem>
                <div className="mt-6 flex flex-wrap gap-2">
                  <span className="tag">{formatPricing(tool.pricingType)}</span>
                  {tool.hasFreePlan ? <span className="tag">Free plan</span> : null}
                  {tool.isVerified ? <span className="tag tag-success">Verified</span> : null}
                  {tool.isFeatured ? <span className="tag tag-signal">Featured</span> : null}
                  {tool.vendor ? <span className="tag">by {tool.vendor}</span> : null}
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="mt-9 flex flex-wrap items-center gap-3">
                  <Magnetic>
                    <TrackedExternalLink
                      className="btn btn-primary btn-lg"
                      event="tool_website_clicked"
                      href={tool.websiteUrl}
                      properties={{
                        toolSlug: tool.slug,
                        source: "tool_detail_hero"
                      }}
                      rel="noreferrer"
                      target="_blank"
                    >
                      Visit website
                      <ExternalLink aria-hidden="true" size={17} />
                    </TrackedExternalLink>
                  </Magnetic>
                  <ToolLikeButton
                    toolId={tool.id}
                    toolName={tool.name}
                    toolSlug={tool.slug}
                    variant="detail"
                  />
                  {alternatives.length > 0 ? (
                    <a className="btn btn-ghost btn-lg" href="#alternatives">
                      <GitCompareArrows aria-hidden="true" size={17} />
                      Compare
                    </a>
                  ) : null}
                </div>
              </StaggerItem>
            </Stagger>
          </div>

          <Reveal delay={0.3} y={40}>
            <aside
              className="night night-panel spotlight p-6 shadow-[0_40px_80px_-40px_rgb(14_14_16/0.7)] sm:p-8"
              data-spotlight
            >
              <div className="relative z-[1] flex items-center gap-6">
                <div className="relative">
                  <ScoreDial
                    label={averageFit !== null ? "Average fit" : "Score"}
                    showValue={false}
                    size={148}
                    stroke={9}
                    tone="light"
                    value={dialValue}
                  />
                  <div aria-hidden="true" className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="stat-number text-[3.4rem] text-white">
                      <AnimatedNumber value={dialValue} />
                    </span>
                    <span className="mt-1 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-white/45">
                      {averageFit !== null ? "Avg fit" : "Score"}
                    </span>
                  </div>
                </div>
                <div className="min-w-0">
                  <p className="font-mono text-[0.66rem] uppercase tracking-[0.16em] text-white/45">
                    {averageFit !== null ? "Best fit" : "Status"}
                  </p>
                  <p className="mt-2 font-display text-xl font-bold leading-tight tracking-[-0.02em] text-white">
                    {topUseCase ? topUseCase.name : "Not mapped to a workflow yet"}
                  </p>
                  {topUseCase ? (
                    <p className="mt-1 font-mono text-sm text-signal tabular">
                      {topUseCase.fitScore}/100
                    </p>
                  ) : null}
                </div>
              </div>
              <dl className="relative z-[1] mt-8 grid text-sm">
                <GlanceRow label="Category" value={tool.category.name} />
                <GlanceRow label="Pricing" value={pricingLine} />
                {averageFit !== null ? (
                  <GlanceRow label="Popularity" value={`${tool.popularityScore}/100`} />
                ) : null}
                <GlanceRow label="Setup" value={estimateSetupEffort(tool)} />
                <GlanceRow
                  label="Listing"
                  value={tool.isVerified ? "Verified" : "Needs verification"}
                />
              </dl>
            </aside>
          </Reveal>
        </div>
      </section>

      {/* ---------- Screenshot ---------- */}
      {tool.screenshotUrl ? (
        <section className="app-container pb-20 md:pb-28">
          <ToolScreenshot
            caption={
              tool.contentUpdatedAt
                ? `Homepage, captured ${formatMonth(tool.contentUpdatedAt)}`
                : undefined
            }
            name={tool.name}
            src={tool.screenshotUrl}
            websiteUrl={tool.websiteUrl}
          />
        </section>
      ) : null}

      {/* ---------- Overview ---------- */}
      <section className="app-container pb-20 md:pb-28">
        <SectionHeading eyebrow="Overview" lines={[["What it does."]]} />
        <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-20">
          <Reveal>
            <p className="max-w-[40rem] whitespace-pre-line text-[1.08rem] leading-[1.75] text-ink/75 md:text-[1.15rem]">
              {tool.longDescription ?? tool.shortDescription}
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <dl className="row-list">
              {tool.pricingNote ? (
                <FactRow label="Pricing">{tool.pricingNote}</FactRow>
              ) : (
                <FactRow label="Pricing">{pricingLine}</FactRow>
              )}
              {tool.integrations.length > 0 ? (
                <FactRow label="Works with">
                  <span className="flex flex-wrap gap-1.5">
                    {tool.integrations.map((integration) => (
                      <span className="tag" key={integration}>
                        {integration}
                      </span>
                    ))}
                  </span>
                </FactRow>
              ) : null}
              {tool.features.length > 0 ? (
                <FactRow label="Features">
                  <span className="flex flex-wrap gap-1.5">
                    {tool.features.slice(0, 8).map((feature) => (
                      <span className="tag" key={feature.id}>
                        {feature.name}
                      </span>
                    ))}
                  </span>
                </FactRow>
              ) : null}
              {tool.contentUpdatedAt ? (
                <FactRow label="Checked">
                  <span className="font-mono text-sm tabular">{formatMonth(tool.contentUpdatedAt)}</span>
                </FactRow>
              ) : null}
            </dl>
          </Reveal>
        </div>
      </section>

      {/* ---------- Fit matrix ---------- */}
      {useCases.length > 0 ? (
        <section className="app-container pb-20 md:pb-28">
          <SectionHeading
            action={
              topUseCase ? (
                <Link className="link-underline" href={`/use-cases/${topUseCase.slug}`}>
                  Open top use case
                  <ArrowUpRight aria-hidden="true" size={15} />
                </Link>
              ) : null
            }
            eyebrow="Fit"
            lines={[["Where it fits"], [{ text: "best.", className: "ghost-word" }]]}
          />
          <div className="mt-10">
            <div
              aria-hidden="true"
              className="hidden grid-cols-[minmax(0,1fr)_12rem_5.5rem_5.5rem_2.25rem] gap-x-8 pb-3 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-ink/40 md:grid"
            >
              <span>Use case</span>
              <span>Fit</span>
              <span>Effort</span>
              <span>Risk</span>
              <span />
            </div>
            <Stagger as="ul" className="row-list" gap={0.05} inView>
              {useCases.map((useCase, index) => {
                const note = useCase.recommendationNote && !isPlaceholderCopy(useCase.recommendationNote)
                  ? useCase.recommendationNote
                  : null;
                return (
                  <StaggerItem as="li" key={useCase.id}>
                    <Link
                      className="row-item group grid-cols-[minmax(0,1fr)_2.25rem] gap-x-5 gap-y-3 py-6 md:grid-cols-[minmax(0,1fr)_12rem_5.5rem_5.5rem_2.25rem] md:gap-x-8"
                      href={`/use-cases/${useCase.slug}`}
                    >
                      <div className="min-w-0">
                        <p className="font-display text-[1.25rem] font-bold leading-tight tracking-[-0.03em] transition-transform duration-500 ease-out group-hover:translate-x-1 md:text-[1.45rem]">
                          {useCase.name}
                        </p>
                        {note ? (
                          <p className="mt-1.5 line-clamp-2 max-w-2xl text-[0.92rem] leading-snug text-ink/55">
                            {note}
                          </p>
                        ) : null}
                        <p className="mt-2 text-[0.82rem] text-ink/45">
                          {useCase.timeToValue ? `${useCase.timeToValue} to value` : "Time to value varies"}
                          <span className="md:hidden">
                            {" "}
                            &middot; {formatLevel(useCase.effortLevel)} effort &middot;{" "}
                            {formatLevel(useCase.riskLevel)} risk
                          </span>
                          <span className="hidden lg:inline">
                            {" "}
                            &middot; {useCase.pricingSuitability ?? pricingSuitability(tool)}
                          </span>
                        </p>
                      </div>
                      <div className="col-span-2 row-start-2 md:col-span-1 md:col-start-2 md:row-start-1">
                        <div className="flex items-baseline justify-between gap-3">
                          <span className="font-mono text-lg font-medium tabular">
                            <AnimatedNumber value={useCase.fitScore} />
                          </span>
                          <span className={`text-[0.78rem] font-medium ${useCase.fitScore >= 85 ? "text-accent" : "text-ink/50"}`}>
                            {fitLabel(useCase.fitScore)}
                          </span>
                        </div>
                        <div className={`meter mt-2 ${index === 0 ? "meter-signal" : ""}`}>
                          <AnimatedBar value={useCase.fitScore} />
                        </div>
                      </div>
                      <span className="hidden text-sm text-ink/70 md:block">{formatLevel(useCase.effortLevel)}</span>
                      <span className="hidden text-sm text-ink/70 md:block">{formatLevel(useCase.riskLevel)}</span>
                      <span aria-hidden="true" className="row-arrow col-start-2 row-start-1 md:col-start-5">
                        <ArrowRight size={15} />
                      </span>
                    </Link>
                  </StaggerItem>
                );
              })}
            </Stagger>
          </div>
        </section>
      ) : null}

      {/* ---------- Best for / not for ---------- */}
      <section className="app-container pb-20 md:pb-28">
        <SectionHeading eyebrow="Verdict" lines={[["Who it suits."], [{ text: "Who it doesn’t.", className: "ghost-word" }]]} />
        <div className="mt-10 grid gap-12 md:grid-cols-2 md:gap-16">
          <VerdictList items={bestForSignals(tool)} kind="yes" title="Best for" />
          <VerdictList items={notIdealSignals(tool)} kind="no" title="Not ideal for" />
        </div>
      </section>

      {/* ---------- Opportunities ---------- */}
      {opportunities.length > 0 ? (
        <section className="app-container pb-20 md:pb-28">
          <SectionHeading
            action={
              <Link className="link-underline" href="/audit/questions">
                Run the audit
                <ArrowUpRight aria-hidden="true" size={15} />
              </Link>
            }
            eyebrow="Pays back on"
            lines={[["Related"], [{ text: "opportunities.", className: "ghost-word" }]]}
          />
          <Stagger as="ul" className="row-list mt-10" inView>
            {opportunities.slice(0, 6).map((opportunity, index) => (
              <StaggerItem as="li" key={opportunity.id}>
                <Link
                  className="row-item group grid-cols-[2.5rem_minmax(0,1fr)_auto] gap-4 py-5 md:grid-cols-[4rem_minmax(0,1fr)_auto]"
                  href={`/opportunities/${opportunity.slug}`}
                >
                  <span className="font-mono text-sm text-ink/40">{String(index + 1).padStart(2, "0")}</span>
                  <span className="font-display text-[1.2rem] font-bold leading-tight tracking-[-0.03em] transition-transform duration-500 ease-out group-hover:translate-x-1 md:text-[1.5rem]">
                    {opportunity.name}
                  </span>
                  <span aria-hidden="true" className="row-arrow">
                    <ArrowRight size={15} />
                  </span>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </section>
      ) : null}

      {/* ---------- Alternatives ---------- */}
      <section className="app-container scroll-mt-28 pb-24 md:pb-32" id="alternatives">
        <SectionHeading
          action={
            <Link className="link-underline" href={`/categories/${tool.category.slug}`}>
              All {tool.category.name.toLowerCase()} tools
              <ArrowUpRight aria-hidden="true" size={15} />
            </Link>
          }
          eyebrow="Compare"
          lines={[["Alternatives."]]}
        />
        {alternatives.length > 0 ? (
          <ToolList
            className="mt-10"
            inView
            tools={alternatives}
            websiteSource="tool_detail_comparison_mobile"
          />
        ) : (
          <Reveal className="mt-10 border-t border-ink/10 pt-6 text-ink/55">
            No curated alternatives yet.{" "}
            <Link className="link-underline text-ink" href="/tools">
              Browse the directory
              <ArrowUpRight aria-hidden="true" size={14} />
            </Link>
          </Reveal>
        )}
        <p className="mt-12 max-w-xl text-[0.82rem] leading-relaxed text-ink/45">
          Not paid placement. Verified means the listing passed our current editorial checks; it
          does not guarantee fit for every workflow.
        </p>
      </section>
    </main>
  );
}

function SectionHeading({
  action,
  eyebrow,
  lines
}: {
  action?: ReactNode;
  eyebrow: string;
  lines: Parameters<typeof SplitReveal>[0]["lines"];
}) {
  return (
    <div className="flex flex-col gap-6 border-t border-ink/10 pt-10 md:flex-row md:items-end md:justify-between md:pt-14">
      <div>
        <Reveal y={10}>
          <p className="eyebrow">{eyebrow}</p>
        </Reveal>
        <SplitReveal as="h2" className="h2 mt-5 max-w-3xl" inView lines={lines} />
      </div>
      {action ? <Reveal className="shrink-0">{action}</Reveal> : null}
    </div>
  );
}

function GlanceRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-6 border-t border-white/10 py-3">
      <dt className="text-white/45">{label}</dt>
      <dd className="text-right font-medium text-white/90">{value}</dd>
    </div>
  );
}

function FactRow({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div className="grid gap-2 border-b border-ink/10 py-5 sm:grid-cols-[7.5rem_minmax(0,1fr)] sm:gap-6">
      <dt className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-ink/45 sm:pt-1">{label}</dt>
      <dd className="min-w-0 text-[0.95rem] leading-relaxed text-ink/80">{children}</dd>
    </div>
  );
}

function VerdictList({
  items,
  kind,
  title
}: {
  items: string[];
  kind: "yes" | "no";
  title: string;
}) {
  const Icon = kind === "yes" ? Check : X;

  return (
    <div>
      <h3 className="h3 flex items-center gap-3">
        <span
          aria-hidden="true"
          className={`flex h-8 w-8 items-center justify-center rounded-full ${
            kind === "yes" ? "bg-ink text-paper" : "bg-ink/[0.07] text-ink/60"
          }`}
        >
          <Icon size={16} strokeWidth={2.4} />
        </span>
        {title}
      </h3>
      <Stagger as="ul" className="mt-6 border-t border-ink/10" inView>
        {items.map((item) => (
          <StaggerItem as="li" className="flex gap-3 border-b border-ink/10 py-4" key={item}>
            <Icon
              aria-hidden="true"
              className={`mt-1 shrink-0 ${kind === "yes" ? "text-signal" : "text-ink/35"}`}
              size={16}
              strokeWidth={2.4}
            />
            <span className="text-[1rem] leading-relaxed text-ink/80">{item}</span>
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  );
}

function bestForSignals(tool: PublicToolDetail) {
  const mappedSignals = uniqueStrings(
    [tool.bestFor, ...tool.useCases.map((useCase) => useCase.bestFor)]
      .filter((value): value is string => Boolean(value))
      .filter((value) => !isPlaceholderCopy(value))
  ).slice(0, 4);

  if (mappedSignals.length > 0) {
    return mappedSignals;
  }

  return [
    `Teams evaluating ${tool.category.name.toLowerCase()} workflows.`,
    "Pilots where a human can review outputs before rollout.",
    "Shortlists that need clear use-case ownership."
  ];
}

function notIdealSignals(tool: PublicToolDetail) {
  const mappedSignals = uniqueStrings(
    [tool.notFor, ...tool.useCases.map((useCase) => useCase.limitations)]
      .filter((value): value is string => Boolean(value))
      .filter((value) => !isPlaceholderCopy(value))
  ).slice(0, 4);

  if (mappedSignals.length > 0) {
    return mappedSignals;
  }

  return [
    "Workflows without a clear success metric.",
    "Teams that cannot review customer-facing output.",
    "Sensitive data workflows before privacy controls are defined."
  ];
}

function uniqueStrings(values: string[]) {
  return Array.from(new Set(values));
}

const placeholderFragments = [
  "current curated use-case data",
  "current curated use-case library",
  "teams that want to pilot this use case",
  "validate fit against your workflow"
];

function isPlaceholderCopy(value: string) {
  const normalized = value.toLowerCase();
  return placeholderFragments.some((fragment) => normalized.includes(fragment));
}

function formatMonth(value: string) {
  return new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" }).format(
    new Date(value)
  );
}

function uniqueOpportunities(tool: PublicToolDetail) {
  const records = new Map<string, PublicToolDetail["useCases"][number]["opportunities"][number]>();

  for (const useCase of tool.useCases) {
    for (const opportunity of useCase.opportunities) {
      records.set(opportunity.id, opportunity);
    }
  }

  return Array.from(records.values());
}

function estimateSetupEffort(tool: PublicToolDetail) {
  if (tool.useCases.some((useCase) => useCase.effortLevel === "HIGH")) {
    return "Moderate to high";
  }

  if (tool.useCases.some((useCase) => useCase.effortLevel === "MEDIUM")) {
    return "Moderate";
  }

  return "Low";
}

function pricingSuitability(tool: PublicToolDetail) {
  if (tool.hasFreePlan || tool.pricingType === "FREE") {
    return "Good for early pilots.";
  }

  if (tool.pricingType === "FREEMIUM") {
    return "Pilot free, budget for team usage.";
  }

  return "Validate workflow value before paid rollout.";
}

function fitLabel(score: number) {
  if (score >= 85) {
    return "Best fit";
  }

  if (score >= 75) {
    return "Strong";
  }

  return "Review";
}

function formatLevel(value: string) {
  return value.charAt(0) + value.slice(1).toLowerCase();
}
