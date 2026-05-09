import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  Gauge,
  Layers3,
  ShieldAlert,
  Target
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  getUseCaseBySlug,
  listToolsForUseCase,
  type PublicUseCaseToolFit
} from "@/server/use-cases/queries";
import { TrackedExternalLink } from "@/features/analytics/tracked-link";
import { ToolLogo } from "@/features/tools/tool-logo";
import { AnimatedNumber } from "@/components/motion/animated-number";
import { MotionLink } from "@/components/motion/motion-link";
import { Reveal } from "@/components/motion/reveal";

export const dynamic = "force-dynamic";

type UseCasePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params
}: UseCasePageProps): Promise<Metadata> {
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

export default async function UseCasePage({ params }: UseCasePageProps) {
  const { slug } = await params;
  const [useCase, tools] = await Promise.all([
    getUseCaseBySlug(slug),
    listToolsForUseCase(slug)
  ]);

  if (!useCase) {
    notFound();
  }

  const firstTool = tools[0];

  return (
    <main className="page-shell">
      <div className="app-container">
        <Reveal className="surface-strong rounded-2xl p-6">
          <Link className="text-sm font-medium text-accent" href="/use-cases">
            Use cases
          </Link>
          <div className="mt-3 grid gap-6 lg:grid-cols-[1fr_330px] lg:items-end">
            <div>
              <p className="eyebrow">
                <Target aria-hidden="true" size={14} />
                Workflow decision guide
              </p>
              <h1 className="mt-4 text-4xl font-semibold leading-tight md:text-5xl">
                {useCase.name}
              </h1>
              <p className="mt-4 max-w-3xl text-lg leading-8 text-ink/68">
                {useCase.outcome ??
                  useCase.description ??
                  `Use this guide to decide whether ${useCase.name.toLowerCase()} is the right AI workflow to pilot next.`}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {useCase.businessFunction ? (
                  <span className="status-pill">
                    {useCase.businessFunction.name}
                  </span>
                ) : null}
                <span className="status-pill">
                  {formatLevel(useCase.effortLevel)} effort
                </span>
                <span className="status-pill">
                  {formatLevel(useCase.riskLevel)} risk
                </span>
                {useCase.timeToValue ? (
                  <span className="status-pill">{useCase.timeToValue}</span>
                ) : null}
              </div>
            </div>
            <div className="metric-tile rounded-xl p-5">
              <div className="flex items-center gap-2">
                <Layers3 aria-hidden="true" className="text-accent" size={18} />
                <span className="text-3xl font-semibold">
                  <AnimatedNumber value={useCase.toolCount} />
                </span>
              </div>
              <p className="mt-1 text-sm text-ink/55">Mapped tools</p>
              <p className="mt-4 text-sm leading-6 text-ink/62">
                Start with workflow fit. Use tools only after the inputs,
                review point, and success metric are clear.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal className="mt-6 grid gap-4 md:grid-cols-3">
          <AdvisoryTile
            icon={Target}
            title="When to use this"
            body={
              useCase.painPoints.length > 0
                ? useCase.painPoints.join(", ")
                : `Use this when ${useCase.name.toLowerCase()} is repeated often enough to measure.`
            }
          />
          <AdvisoryTile
            icon={Gauge}
            title="Expected impact"
            body={
              useCase.successMetrics.length > 0
                ? useCase.successMetrics.join(", ")
                : "Track time saved, cycle time, consistency, and review quality."
            }
          />
          <AdvisoryTile
            icon={ShieldAlert}
            title="Risk check"
            body={buildRiskCopy(useCase.riskLevel)}
          />
        </Reveal>

        <Reveal className="mt-6 grid gap-6 lg:grid-cols-[1.06fr_0.94fr]">
          <div className="surface-strong rounded-xl p-6">
            <div className="flex items-center gap-2">
              <ClipboardCheck
                aria-hidden="true"
                className="text-accent"
                size={20}
              />
              <h2 className="text-xl font-semibold">Implementation checklist</h2>
            </div>
            <div className="mt-4 grid gap-3">
              {implementationSteps(useCase.implementationSteps).map((step) => (
                <ChecklistItem key={step}>{step}</ChecklistItem>
              ))}
            </div>
          </div>

          <div className="surface-panel rounded-xl p-6">
            <h2 className="text-xl font-semibold">Required inputs</h2>
            <p className="mt-2 text-sm leading-6 text-ink/60">
              These inputs make the pilot more measurable and reduce tool
              switching later.
            </p>
            <div className="mt-4 grid gap-2">
              {(useCase.requiredInputs.length > 0
                ? useCase.requiredInputs
                : [
                    "Workflow owner",
                    "Current example work",
                    "Human review criteria"
                  ]
              ).map((input) => (
                <div
                  className="rounded-lg border border-line bg-surface/70 px-3 py-2 text-sm font-medium"
                  key={input}
                >
                  {input}
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {useCase.opportunities.length > 0 ? (
          <Reveal className="surface-panel mt-6 rounded-xl p-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-xl font-semibold">Related opportunities</h2>
                <p className="mt-2 text-sm leading-6 text-ink/60">
                  These are the business problems this use case can support.
                </p>
              </div>
              <MotionLink className="secondary-button" href="/opportunities">
                View opportunities
                <ArrowRight aria-hidden="true" size={16} />
              </MotionLink>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {useCase.opportunities.slice(0, 3).map((opportunity) => (
                <Link
                  className="rounded-xl border border-line bg-surface/72 p-4 transition hover:-translate-y-0.5 hover:border-accent"
                  href={`/opportunities/${opportunity.slug}`}
                  key={opportunity.id}
                >
                  <h3 className="font-semibold">{opportunity.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-ink/62">
                    {opportunity.expectedBenefit ??
                      opportunity.startingPoint ??
                      "Review the opportunity before choosing tools."}
                  </p>
                </Link>
              ))}
            </div>
          </Reveal>
        ) : null}

        <Reveal className="mt-6">
          {tools.length > 0 ? (
            <>
              <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase text-accent">
                    Tool shortlist
                  </p>
                  <h2 className="mt-1 text-xl font-semibold">
                    Best mapped tools for this use case
                  </h2>
                </div>
                {firstTool ? (
                  <Link className="secondary-button" href={`/tools/${firstTool.slug}`}>
                    Open top tool
                    <ArrowRight aria-hidden="true" size={16} />
                  </Link>
                ) : null}
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {tools.slice(0, 6).map((tool) => (
                  <ToolFitCard key={tool.id} tool={tool} />
                ))}
              </div>
            </>
          ) : (
            <div className="surface-panel rounded-xl p-8 text-center">
              <h2 className="font-semibold">No mapped tools yet</h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-ink/60">
                This use case is ready for curated tool mappings.
              </p>
            </div>
          )}
        </Reveal>
      </div>
    </main>
  );
}

function ToolFitCard({ tool }: { tool: PublicUseCaseToolFit }) {
  return (
    <article className="surface-panel rounded-xl p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <ToolLogo logoUrl={tool.logoUrl} name={tool.name} />
          <div className="min-w-0">
            <h3 className="truncate text-lg font-semibold">{tool.name}</h3>
            <p className="mt-1 text-xs font-medium text-ink/50">
              {tool.category.name}
            </p>
          </div>
        </div>
        <span className="rounded-lg bg-ink px-2.5 py-1.5 text-sm font-semibold text-paper">
          <AnimatedNumber value={tool.fitScore} />
        </span>
      </div>
      <p className="mt-3 text-sm leading-6 text-ink/62">
        {tool.recommendationNote ??
          `Mapped to ${tool.category.name.toLowerCase()} workflows by editorial taxonomy.`}
      </p>
      {tool.bestFor ? (
        <p className="mt-3 text-xs leading-5 text-ink/50">{tool.bestFor}</p>
      ) : null}
      <div className="mt-4 flex flex-wrap gap-2">
        {tool.hasFreePlan ? <span className="status-pill">Free plan</span> : null}
        <span className="status-pill">{formatPricing(tool.pricingType)}</span>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-2">
        <Link className="secondary-button" href={`/tools/${tool.slug}`}>
          Details
        </Link>
        <TrackedExternalLink
          className="secondary-button"
          event="tool_website_clicked"
          href={tool.websiteUrl}
          properties={{
            source: "use_case_tool_fit",
            toolSlug: tool.slug
          }}
          rel="noreferrer"
          target="_blank"
        >
          Website
        </TrackedExternalLink>
      </div>
    </article>
  );
}

function implementationSteps(steps: string[]) {
  return steps.length > 0
    ? steps
    : [
        "Document the current workflow and owner.",
        "Define the review point and success metric.",
        "Pilot one tool against recent real examples.",
        "Review quality before expanding usage."
      ];
}

function buildRiskCopy(riskLevel: string) {
  if (riskLevel === "HIGH") {
    return "Use a strict pilot, avoid sensitive data, and require human approval before outputs affect customers or decisions.";
  }

  if (riskLevel === "MEDIUM") {
    return "Use approved examples, add a review checkpoint, and keep output quality measurable.";
  }

  return "Low-risk workflow, but still define ownership, data boundaries, and review standards.";
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

function AdvisoryTile({
  body,
  icon: Icon,
  title
}: {
  body: string;
  icon: LucideIcon;
  title: string;
}) {
  return (
    <article className="surface-panel rounded-xl p-5">
      <Icon aria-hidden="true" className="text-accent" size={21} />
      <h2 className="mt-4 font-semibold">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-ink/62">{body}</p>
    </article>
  );
}
