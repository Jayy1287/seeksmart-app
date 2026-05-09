import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Gauge,
  GitCompareArrows,
  Layers3,
  ShieldAlert,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { TrackedExternalLink } from "@/features/analytics/tracked-link";
import { ToolCard } from "@/features/tools/tool-card";
import { ToolLogo } from "@/features/tools/tool-logo";
import { getPublishedToolBySlug } from "@/server/tools/queries";
import type { PublicToolDetail } from "@/shared/domain";
import { AnimatedBar } from "@/components/motion/animated-bar";
import { AnimatedNumber } from "@/components/motion/animated-number";
import { Reveal } from "@/components/motion/reveal";

export const dynamic = "force-dynamic";

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
    title: tool.metaTitle ?? `${tool.name} Fit, Use Cases, and Alternatives`,
    description: tool.metaDescription ?? tool.shortDescription,
    alternates: {
      canonical: `/tools/${tool.slug}`
    },
    openGraph: {
      title: tool.metaTitle ?? `${tool.name} Fit, Use Cases, and Alternatives`,
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

  const topUseCase = [...tool.useCases].sort(
    (a, b) => b.fitScore - a.fitScore
  )[0];
  const averageFit =
    tool.useCases.length > 0
      ? Math.round(
          tool.useCases.reduce((total, useCase) => total + useCase.fitScore, 0) /
            tool.useCases.length
        )
      : null;

  return (
    <main className="page-shell">
      <div className="app-container">
        <Reveal className="surface-strong grid gap-8 rounded-2xl p-6 lg:grid-cols-[1fr_360px]">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <Link className="text-sm font-medium text-accent" href="/tools">
                Tools
              </Link>
              <span className="text-ink/30">/</span>
              <Link
                className="text-sm text-ink/55 hover:text-accent"
                href={`/categories/${tool.category.slug}`}
              >
                {tool.category.name}
              </Link>
            </div>
            <div className="mt-5 flex items-center gap-4">
              <ToolLogo logoUrl={tool.logoUrl} name={tool.name} size="lg" />
              <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
                {tool.name}
              </h1>
            </div>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-ink/70">
              {tool.shortDescription}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="status-pill">{formatPricing(tool.pricingType)}</span>
              {tool.hasFreePlan ? <span className="status-pill">Free plan</span> : null}
              {tool.isVerified ? (
                <span className="status-pill">
                  <ShieldCheck aria-hidden="true" size={16} />
                  Verified
                </span>
              ) : null}
              {tool.isFeatured ? (
                <span className="status-pill">
                  <Sparkles aria-hidden="true" size={16} />
                  Featured
                </span>
              ) : null}
            </div>
          </div>

          <aside className="surface-panel rounded-xl p-5">
            <h2 className="font-semibold">Decision snapshot</h2>
            <p className="mt-2 text-sm leading-6 text-ink/60">
              Evaluate this tool by workflow fit, budget fit, and review needs
              before opening the vendor site.
            </p>
            <dl className="mt-5 grid gap-3 text-sm">
              <SnapshotRow label="Category" value={tool.category.name} />
              <SnapshotRow label="Pricing" value={formatPricing(tool.pricingType)} />
              <SnapshotRow
                label="Best mapped fit"
                value={topUseCase ? `${topUseCase.name} (${topUseCase.fitScore})` : "Needs curation"}
              />
              <SnapshotRow
                label="Editorial confidence"
                value={tool.isVerified ? "Verified listing" : "Needs verification"}
              />
            </dl>
            <TrackedExternalLink
              className="primary-button mt-5 w-full"
              event="tool_website_clicked"
              href={tool.websiteUrl}
              properties={{
                toolSlug: tool.slug,
                source: "tool_detail_snapshot"
              }}
              rel="noreferrer"
              target="_blank"
            >
              Visit website
              <ExternalLink aria-hidden="true" size={17} />
            </TrackedExternalLink>
          </aside>
        </Reveal>

        <Reveal className="mt-6 grid gap-4 md:grid-cols-4">
          <DecisionMetric
            label="Average fit"
            score={averageFit ?? undefined}
            value={
              averageFit ? (
                <>
                  <AnimatedNumber value={averageFit} />
                  /100
                </>
              ) : (
                "Unmapped"
              )
            }
          />
          <DecisionMetric label="Pricing" value={formatPricing(tool.pricingType)} />
          <DecisionMetric
            label="Setup effort"
            value={estimateSetupEffort(tool)}
          />
          <DecisionMetric
            label="Decision stage"
            value={tool.useCases.length > 0 ? "Shortlist" : "Research"}
          />
        </Reveal>

        <Reveal className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.86fr]">
          <div className="surface-panel rounded-xl p-6">
            <div className="flex items-center gap-2">
              <Layers3 aria-hidden="true" className="text-accent" size={20} />
              <h2 className="text-xl font-semibold">Overview</h2>
            </div>
            <p className="mt-4 leading-8 text-ink/70">
              {tool.longDescription ?? tool.shortDescription}
            </p>
          </div>
          <div className="surface-panel rounded-xl p-6">
            <h2 className="text-xl font-semibold">Best for</h2>
            <div className="mt-4 grid gap-3">
              {bestForSignals(tool).map((signal) => (
                <ChecklistItem key={signal}>{signal}</ChecklistItem>
              ))}
            </div>
          </div>
        </Reveal>

        {tool.useCases.length > 0 ? (
          <Reveal className="surface-strong mt-6 rounded-xl p-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase text-accent">
                  Fit matrix
                </p>
                <h2 className="mt-1 text-xl font-semibold">
                  Use-case, budget, and risk fit
                </h2>
              </div>
              {topUseCase ? (
                <Link
                  className="secondary-button"
                  href={`/use-cases/${topUseCase.slug}`}
                >
                  Open top use case
                  <ArrowRight aria-hidden="true" size={16} />
                </Link>
              ) : null}
            </div>

            <div className="mt-5 grid gap-3 md:hidden">
              {tool.useCases.map((useCase) => (
                <Link
                  className="rounded-xl border border-line bg-surface/72 p-4"
                  href={`/use-cases/${useCase.slug}`}
                  key={useCase.id}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold">{useCase.name}</h3>
                      <p className="mt-1 text-xs leading-5 text-ink/50">
                        {useCase.timeToValue ?? "Time to value varies"} ·{" "}
                        {formatLevel(useCase.effortLevel)} effort ·{" "}
                        {formatLevel(useCase.riskLevel)} risk
                      </p>
                    </div>
                    <span className="rounded-lg bg-ink px-2.5 py-1.5 text-xs font-semibold text-paper">
                      <AnimatedNumber value={useCase.fitScore} />
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-ink/62">
                    {useCase.recommendationNote ??
                      "Mapped by editorial taxonomy."}
                  </p>
                </Link>
              ))}
            </div>

            <div className="mt-5 hidden overflow-x-auto rounded-xl border border-line md:block">
              <table className="w-full min-w-[760px] border-collapse bg-surface/70 text-left text-sm">
                <thead className="border-b border-line text-xs uppercase text-ink/50">
                  <tr>
                    <th className="px-4 py-3">Use case</th>
                    <th className="px-4 py-3">Fit</th>
                    <th className="px-4 py-3">Effort</th>
                    <th className="px-4 py-3">Risk</th>
                    <th className="px-4 py-3">Budget note</th>
                    <th className="px-4 py-3">Why it fits</th>
                  </tr>
                </thead>
                <tbody>
                  {tool.useCases.map((useCase) => (
                    <tr className="border-b border-line last:border-b-0" key={useCase.id}>
                      <td className="px-4 py-4">
                        <Link
                          className="font-semibold text-accent hover:underline"
                          href={`/use-cases/${useCase.slug}`}
                        >
                          {useCase.name}
                        </Link>
                        <p className="mt-1 text-xs leading-5 text-ink/50">
                          {useCase.timeToValue ?? "Time to value varies"}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <span className="inline-flex whitespace-nowrap rounded-lg bg-ink px-2.5 py-1.5 text-xs font-semibold text-paper">
                          {fitLabel(useCase.fitScore)} {useCase.fitScore}
                        </span>
                      </td>
                      <td className="px-4 py-4">{formatLevel(useCase.effortLevel)}</td>
                      <td className="px-4 py-4">{formatLevel(useCase.riskLevel)}</td>
                      <td className="px-4 py-4">
                        {useCase.pricingSuitability ??
                          pricingSuitability(tool)}
                      </td>
                      <td className="px-4 py-4">
                        {useCase.recommendationNote ??
                          "Mapped by editorial taxonomy."}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        ) : null}

        <Reveal className="mt-6 grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="surface-panel rounded-xl p-6">
            <div className="flex items-center gap-2">
              <ShieldAlert aria-hidden="true" className="text-signal" size={20} />
              <h2 className="text-xl font-semibold">Not ideal for</h2>
            </div>
            <div className="mt-4 grid gap-3">
              {notIdealSignals(tool).map((signal) => (
                <ChecklistItem key={signal}>{signal}</ChecklistItem>
              ))}
            </div>
          </div>

          <div className="surface-strong rounded-xl p-6">
            <div className="flex items-center gap-2">
              <Gauge aria-hidden="true" className="text-accent" size={20} />
              <h2 className="text-xl font-semibold">Adoption checklist</h2>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {[
                "Pick one mapped use case and success metric.",
                "Test with recent real examples before rollout.",
                "Define who reviews outputs and when.",
                "Compare one alternative for price, fit, and risk."
              ].map((item) => (
                <ChecklistItem key={item}>{item}</ChecklistItem>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal className="surface-panel mt-6 rounded-xl p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase text-accent">
                Related paths
              </p>
              <h2 className="mt-1 text-xl font-semibold">
                Opportunities this tool may support
              </h2>
            </div>
            <Link className="secondary-button" href="/audit/start">
              Run audit first
              <ArrowRight aria-hidden="true" size={16} />
            </Link>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {uniqueOpportunities(tool).length > 0 ? (
              uniqueOpportunities(tool)
                .slice(0, 3)
                .map((opportunity) => (
                  <Link
                    className="rounded-xl border border-line bg-surface/72 p-4 transition hover:-translate-y-0.5 hover:border-accent"
                    href={`/opportunities/${opportunity.slug}`}
                    key={opportunity.id}
                  >
                    <h3 className="font-semibold">{opportunity.name}</h3>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent">
                      Review opportunity
                      <ArrowRight aria-hidden="true" size={14} />
                    </span>
                  </Link>
                ))
            ) : (
              <p className="text-sm leading-6 text-ink/60">
                Related opportunities are not mapped yet.
              </p>
            )}
          </div>
        </Reveal>

        <section className="mt-10">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium uppercase text-accent">
                Compare
              </p>
              <h2 className="mt-2 text-xl font-semibold">Comparable tools</h2>
            </div>
            <Link className="secondary-button" href="/tools">
              <GitCompareArrows aria-hidden="true" size={16} />
              Browse all
            </Link>
          </div>
          {tool.alternatives.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-3">
              {tool.alternatives.map((alternative) => (
                <ToolCard key={alternative.id} tool={alternative} />
              ))}
            </div>
          ) : (
            <div className="surface-panel rounded-xl p-6 text-sm text-ink/60">
              Alternatives are not curated for this tool yet.
            </div>
          )}
        </section>

        <section className="surface-panel mt-6 rounded-xl p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold">Editorial trust note</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/60">
                Tool pages are decision support, not paid placement. Verified
                means the listing has passed current editorial checks; it does
                not guarantee fit for every business workflow.
              </p>
            </div>
            <span className="status-pill">
              {tool.isVerified ? "Verified listing" : "Needs verification"}
            </span>
          </div>
        </section>
      </div>
    </main>
  );
}

function SnapshotRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-line pb-3 last:border-b-0 last:pb-0">
      <dt className="text-ink/55">{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  );
}

function DecisionMetric({
  label,
  score,
  value
}: {
  label: string;
  score?: number;
  value: ReactNode;
}) {
  return (
    <div className="metric-tile rounded-xl p-4">
      <p className="text-xs font-semibold uppercase text-ink/48">{label}</p>
      <p className="mt-2 font-semibold">{value}</p>
      {typeof score === "number" ? (
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white">
          <AnimatedBar className="h-full rounded-full bg-signal" value={score} />
        </div>
      ) : null}
    </div>
  );
}

function ChecklistItem({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-line bg-surface/70 p-3 text-sm leading-6">
      <CheckCircle2
        aria-hidden="true"
        className="mt-0.5 shrink-0 text-accent"
        size={16}
      />
      <span>{children}</span>
    </div>
  );
}

function bestForSignals(tool: PublicToolDetail) {
  const mappedSignals = uniqueStrings(
    tool.useCases
      .map((useCase) => useCase.bestFor)
      .filter((value): value is string => Boolean(value))
  ).slice(0, 3);

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
    tool.useCases
      .map((useCase) => useCase.limitations)
      .filter((value): value is string => Boolean(value))
  ).slice(0, 3);

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

function formatPricing(pricingType: string) {
  if (pricingType === "FREEMIUM") {
    return "Freemium";
  }

  if (pricingType === "FREE") {
    return "Free";
  }

  return "Paid";
}
