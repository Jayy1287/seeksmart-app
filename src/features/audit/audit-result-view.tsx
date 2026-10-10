import type { ReactNode } from "react";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ClipboardList,
  Gauge,
  Lightbulb,
  ShieldAlert,
  Target
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { AnimatedBar } from "@/components/motion/animated-bar";
import { AnimatedNumber } from "@/components/motion/animated-number";
import { MotionLink } from "@/components/motion/motion-link";
import { Reveal } from "@/components/motion/reveal";
import { ToolLogo } from "@/features/tools/tool-logo";
import {
  budgetRangeLabel,
  companySizeLabel,
  dataReadinessLabel,
  dataSensitivityLabel,
  decisionOwnerLabel,
  goalLabel,
  integrationNeedLabel,
  painPointLabel,
  technicalComfortLabel,
  urgencyLabel,
  workflowVolumeLabel,
  workflowMaturityLabel
} from "@/server/recommendations/input";
import type {
  AuditInput,
  AuditOpportunityRecommendation,
  AuditResult
} from "@/shared/recommendations/audit";

type AuditResultViewProps = {
  analytics?: ReactNode;
  /** Rendered under the hero: save status, share bar, etc. */
  actions?: ReactNode;
  input: AuditInput;
  /** When true, only the free summary is rendered and `unlockPanel` is shown. */
  locked?: boolean;
  result: AuditResult;
  unlockPanel?: ReactNode;
};

export const lockedBriefItems = [
  "Two-week pilot plan with owner, baseline question, and target",
  "Week-one actions and guardrails",
  "Tool shortlist for each opportunity, with reasons and pricing",
  "Full readiness assessment: strengths and watch-outs",
  "Industry cautions and the decision checklist",
  "A printable, shareable version of this brief"
];

export function AuditResultView({
  actions,
  analytics,
  input,
  locked = false,
  result,
  unlockPanel
}: AuditResultViewProps) {
  const first = result.topOpportunities[0];

  return (
    <main className="page-shell audit-brief">
      {analytics}
      <div className="app-container">
        <Reveal className="border-b border-line/50 pb-8">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
            <div>
              <p className="eyebrow">
                <BarChart3 aria-hidden="true" size={14} />
                Your AI pilot brief
              </p>
              <p className="mt-5 text-sm font-bold uppercase tracking-wide text-accent">
                Start here
              </p>
              <h1 className="mt-2 max-w-4xl text-4xl font-semibold leading-[1.02] md:text-5xl">
                {first ? first.name : "Complete the audit to get a plan."}
              </h1>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-ink/68">
                {result.summary.executiveBrief}
              </p>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/55">
                {result.summary.firstWorkflow}
              </p>
              {actions ? <div className="mt-6">{actions}</div> : null}
            </div>
            <ReadinessDial readiness={result.readiness} />
          </div>
        </Reveal>

        <Reveal className="mt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-4">
          <ContextTile label="Business" value={result.summary.industryName} />
          <ContextTile label="Area" value={result.summary.businessFunctionName} />
          <ContextTile label="Team" value={companySizeLabel(input.companySize)} />
          <ContextTile label="Urgency" value={urgencyLabel(input.urgency)} />
        </Reveal>

        <Reveal className="mt-10">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-accent">
                Ranked opportunities
              </p>
              <h2 className="mt-1 text-2xl font-semibold md:text-3xl">
                Where AI pays back first for you
              </h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-ink/55">
              Scores are directional. They weigh business fit, effort, risk,
              and how specific your answers were.
            </p>
          </div>
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {result.topOpportunities.map((opportunity, index) => (
              <OpportunitySummaryCard
                index={index + 1}
                key={opportunity.id}
                opportunity={opportunity}
              />
            ))}
          </div>
        </Reveal>

        {locked ? (
          <>
            <Reveal className="mt-10">{unlockPanel}</Reveal>
            <Reveal className="mt-8 grid gap-4 md:grid-cols-2">
              <AsideCard title="Automation posture">
                <p className="text-sm leading-6 text-ink/65">
                  {result.summary.automationPosture}
                </p>
              </AsideCard>
              <AsideCard title="One caution before you start">
                <p className="text-sm leading-6 text-ink/65">
                  {result.summary.overallCaution}
                </p>
              </AsideCard>
            </Reveal>
          </>
        ) : (
          <UnlockedSections input={input} result={result} />
        )}
      </div>
    </main>
  );
}

function UnlockedSections({
  input,
  result
}: {
  input: AuditInput;
  result: AuditResult;
}) {
  return (
    <>
      <Reveal className="section-band -mx-4 mt-10 px-4 py-8 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-accent">
              Pilot plan
            </p>
            <h2 className="mt-2 text-3xl font-semibold">{result.pilotPlan.title}</h2>
            <p className="mt-3 leading-7 text-ink/62">
              {result.summary.automationPosture}
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            <PlanTile label="Owner" value={result.pilotPlan.owner} />
            <PlanTile label="Timeline" value={result.pilotPlan.timeline} />
            <PlanTile label="Success metric" value={result.pilotPlan.successMetric} />
          </div>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <PlanTile label="Baseline question" value={result.pilotPlan.baselineQuestion} />
          <PlanTile label="Pilot target" value={result.pilotPlan.target} />
        </div>
        <div className="mt-7 grid gap-6 lg:grid-cols-3">
          <PlanList
            icon={ClipboardList}
            items={result.pilotPlan.weekOneActions}
            title="Week-one actions"
          />
          <PlanList
            icon={ShieldAlert}
            items={result.pilotPlan.guardrails}
            title="Guardrails"
          />
          <PlanList
            icon={Lightbulb}
            items={result.pilotPlan.expansionCriteria}
            title="Expand only if"
          />
        </div>
      </Reveal>

      <Reveal className="mt-10 grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="grid gap-5">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-accent">
              Opportunity detail
            </p>
            <h2 className="mt-1 text-2xl font-semibold md:text-3xl">
              Use cases, tools, and cautions for each
            </h2>
          </div>
          {result.topOpportunities.map((opportunity, index) => (
            <OpportunityResult
              index={index + 1}
              key={opportunity.id}
              opportunity={opportunity}
            />
          ))}
        </div>

        <aside className="grid h-fit gap-5 lg:sticky lg:top-24">
          <AsideCard title="Readiness detail">
            <p className="text-sm leading-6 text-ink/62">{result.readiness.summary}</p>
            <ReadinessList items={result.readiness.strengths} title="Strengths" />
            <ReadinessList items={result.readiness.risks} title="Watch-outs" />
          </AsideCard>

          <AsideCard title="Caution">
            <p className="text-sm leading-6 text-ink/62">
              {result.summary.overallCaution}
            </p>
          </AsideCard>

          <AsideCard title="Decision checklist">
            <div className="grid gap-3">
              {result.nextStepChecklist.map((item) => (
                <div className="flex gap-3 text-sm leading-6" key={item}>
                  <CheckCircle2
                    aria-hidden="true"
                    className="mt-0.5 shrink-0 text-accent"
                    size={16}
                  />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </AsideCard>

          <AsideCard title="Your answers">
            <div className="grid gap-2 text-sm">
              <AuditFact label="Goals" value={input.goals.map(goalLabel).join(", ")} />
              <AuditFact
                label="Pain points"
                value={input.painPoints.map(painPointLabel).join(", ")}
              />
              <AuditFact label="Budget" value={budgetRangeLabel(input.budgetRange)} />
              <AuditFact
                label="Technical comfort"
                value={technicalComfortLabel(input.technicalComfort)}
              />
              <AuditFact
                label="Data sensitivity"
                value={dataSensitivityLabel(input.dataSensitivity)}
              />
              <AuditFact
                label="Workflow volume"
                value={workflowVolumeLabel(input.workflowVolume)}
              />
              <AuditFact
                label="Process clarity"
                value={`${workflowMaturityLabel(input.workflowMaturity)}; ${dataReadinessLabel(input.dataReadiness).toLowerCase()}`}
              />
              <AuditFact
                label="Sign-off"
                value={decisionOwnerLabel(input.decisionOwner)}
              />
              <AuditFact
                label="Systems"
                value={
                  input.integrationNeeds.length > 0
                    ? input.integrationNeeds.map(integrationNeedLabel).join(", ")
                    : "No specific systems selected"
                }
              />
            </div>
          </AsideCard>
        </aside>
      </Reveal>
    </>
  );
}

function ReadinessDial({
  readiness
}: {
  readiness: AuditResult["readiness"];
}) {
  const tone =
    readiness.level === "Pilot-ready"
      ? "success"
      : readiness.level === "Prepare first"
        ? "signal"
        : "secondary";

  return (
    <div className="readiness-dial" data-tone={tone}>
      <p className="text-xs font-bold uppercase tracking-wide text-ink/50">
        Readiness
      </p>
      <div className="mt-2 flex items-end gap-2">
        <span className="text-5xl font-semibold leading-none">
          <AnimatedNumber value={readiness.score} />
        </span>
        <span className="pb-1 text-sm font-semibold text-ink/45">/ 100</span>
      </div>
      <p className="readiness-dial-level mt-3">{readiness.level}</p>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">
        <AnimatedBar className="readiness-dial-bar h-full rounded-full" value={readiness.score} />
      </div>
      <p className="mt-3 text-sm leading-6 text-ink/62">{readiness.summary}</p>
    </div>
  );
}

function OpportunitySummaryCard({
  index,
  opportunity
}: {
  index: number;
  opportunity: AuditOpportunityRecommendation;
}) {
  return (
    <article className="opportunity-card" data-rank={index}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="opportunity-rank">#{index}</span>
          <span className="status-pill">{opportunity.fitLabel}</span>
        </div>
        <div className="text-right">
          <p className="text-2xl font-semibold leading-none">
            <AnimatedNumber value={opportunity.score} />
          </p>
          <p className="mt-1 text-[0.68rem] font-bold uppercase text-ink/45">Fit</p>
        </div>
      </div>
      <h3 className="mt-4 text-xl font-semibold leading-tight">{opportunity.name}</h3>
      <p className="mt-2 text-sm leading-6 text-ink/62">
        {opportunity.expectedBenefit ?? opportunity.description}
      </p>
      <div className="mt-4 grid gap-2">
        {opportunity.reasons.slice(0, 3).map((reason) => (
          <div className="flex gap-2 text-sm leading-6 text-ink/72" key={reason}>
            <CheckCircle2
              aria-hidden="true"
              className="mt-1 shrink-0 text-accent"
              size={14}
            />
            <span>{reason}</span>
          </div>
        ))}
      </div>
      <dl className="mt-4 grid grid-cols-3 gap-2 border-t border-line/60 pt-4 text-xs">
        <MiniStat label="Effort" value={formatLevel(opportunity.effortLevel)} />
        <MiniStat label="Risk" value={formatLevel(opportunity.riskLevel)} />
        <MiniStat label="Payback" value={opportunity.timeToValue ?? "Varies"} />
      </dl>
    </article>
  );
}

function OpportunityResult({
  index,
  opportunity
}: {
  index: number;
  opportunity: AuditOpportunityRecommendation;
}) {
  return (
    <article className="surface-panel overflow-hidden rounded-2xl">
      <div className="border-b border-line bg-white/72 p-5 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="status-pill">#{index}</span>
              <span className="status-pill">{opportunity.fitLabel}</span>
              {opportunity.businessFunctionName ? (
                <span className="status-pill">{opportunity.businessFunctionName}</span>
              ) : null}
            </div>
            <h3 className="mt-4 text-2xl font-semibold">{opportunity.name}</h3>
            <p className="mt-3 max-w-3xl leading-7 text-ink/65">
              {opportunity.expectedBenefit ??
                opportunity.description ??
                "A curated opportunity that fits the context you provided."}
            </p>
            {opportunity.startingPoint ? (
              <p className="mt-3 max-w-3xl text-sm leading-6 text-ink/62">
                <span className="font-semibold text-ink">Start by:</span>{" "}
                {opportunity.startingPoint}
              </p>
            ) : null}
          </div>
          <div className="metric-tile min-w-32 rounded-xl p-4 text-center">
            <p className="text-sm font-semibold text-accent">Fit score</p>
            <p className="mt-1 text-4xl font-semibold">
              <AnimatedNumber value={opportunity.score} />
            </p>
            <p className="mt-1 text-xs font-medium text-ink/45">Directional</p>
          </div>
        </div>
      </div>

      <div className="grid gap-3 p-5 md:grid-cols-4 md:p-6">
        <ScoreTile icon={Target} label="Impact" value={opportunity.impactScore} />
        <ScoreTile icon={Gauge} label="Effort fit" value={opportunity.effortScore} />
        <ScoreTile icon={ShieldAlert} label="Risk fit" value={opportunity.riskScore} />
        <ScoreTile icon={BarChart3} label="Confidence" value={opportunity.confidenceScore} />
      </div>

      <div className="grid gap-5 border-t border-line p-5 md:p-6 lg:grid-cols-2">
        <section>
          <h4 className="font-semibold">Why this ranked here</h4>
          <div className="mt-3 grid gap-2">
            {opportunity.reasons.map((reason) => (
              <ReasonItem key={reason}>{reason}</ReasonItem>
            ))}
          </div>
        </section>
        <section>
          <h4 className="font-semibold">Use-case path</h4>
          <div className="mt-3 grid gap-2">
            {opportunity.useCases.map((useCase) => (
              <MotionLink
                className="rounded-lg border border-line bg-surface/72 p-3 transition hover:border-accent"
                href={`/use-cases/${useCase.slug}`}
                key={useCase.id}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-medium">{useCase.name}</span>
                  <ArrowRight aria-hidden="true" size={14} />
                </div>
                <p className="mt-1 text-xs leading-5 text-ink/55">
                  {useCase.timeToValue ?? "Time to value depends on setup"} ·{" "}
                  {formatLevel(useCase.effortLevel)} effort ·{" "}
                  {formatLevel(useCase.riskLevel)} risk
                </p>
              </MotionLink>
            ))}
          </div>
        </section>
      </div>

      {opportunity.cautions.length > 0 ? (
        <div className="mx-5 rounded-xl border border-signal/30 bg-signal/10 p-4 text-sm leading-6 text-ink/70 md:mx-6">
          <p className="font-semibold text-secondary">Review before piloting</p>
          <ul className="mt-2 grid gap-1">
            {opportunity.cautions.map((caution) => (
              <li key={caution}>{caution}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <section className="border-t border-line p-5 md:p-6">
        <h4 className="font-semibold">Tool shortlist</h4>
        {opportunity.tools.length > 0 ? (
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            {opportunity.tools.map((tool) => (
              <MotionLink
                className="rounded-xl border border-line bg-surface/72 p-4 transition hover:-translate-y-0.5 hover:border-accent"
                href={`/tools/${tool.slug}`}
                key={tool.id}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-start gap-3">
                    <ToolLogo logoUrl={tool.logoUrl} name={tool.name} size="sm" />
                    <div className="min-w-0">
                      <h5 className="truncate font-semibold">{tool.name}</h5>
                      <p className="mt-1 text-xs text-ink/50">{tool.categoryName}</p>
                    </div>
                  </div>
                  <span className="rounded-lg bg-ink px-2 py-1 text-xs font-semibold text-paper">
                    <AnimatedNumber value={tool.fitScore} />
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-ink/62">{tool.reason}</p>
                {tool.limitation ? (
                  <p className="mt-2 text-xs leading-5 text-ink/50">
                    Watch: {tool.limitation}
                  </p>
                ) : null}
                <p className="mt-3 text-xs font-semibold uppercase text-accent">
                  {formatPricing(tool.pricingType)}
                  {tool.hasFreePlan ? " · Free plan" : ""}
                </p>
              </MotionLink>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm leading-6 text-ink/60">
            No verified shortlist yet for this opportunity. Use the use-case
            pages above to compare options against your pilot examples.
          </p>
        )}
      </section>
    </article>
  );
}

function AsideCard({ children, title }: { children: ReactNode; title: string }) {
  return (
    <section className="surface-panel rounded-xl p-5">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function ContextTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="metric-tile rounded-xl p-4">
      <p className="text-xs font-semibold uppercase text-ink/48">{label}</p>
      <p className="mt-2 font-semibold">{value}</p>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-bold uppercase text-ink/45">{label}</dt>
      <dd className="mt-0.5 font-semibold text-ink/80">{value}</dd>
    </div>
  );
}

function PlanTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-line/55 bg-white/42 p-4 shadow-[0_18px_54px_rgb(13_48_92/0.055)] backdrop-blur">
      <p className="text-xs font-semibold uppercase text-ink/48">{label}</p>
      <p className="mt-2 font-semibold leading-6">{value}</p>
    </div>
  );
}

function PlanList({
  icon: Icon,
  items,
  title
}: {
  icon: LucideIcon;
  items: string[];
  title: string;
}) {
  return (
    <section className="rounded-2xl border border-line/55 bg-white/42 p-5 shadow-[0_18px_54px_rgb(13_48_92/0.055)] backdrop-blur">
      <div className="flex items-center gap-2">
        <Icon aria-hidden="true" className="text-accent" size={19} />
        <h3 className="font-semibold">{title}</h3>
      </div>
      <div className="mt-4 grid gap-3">
        {items.map((item) => (
          <div className="flex gap-3 text-sm leading-6" key={item}>
            <CheckCircle2
              aria-hidden="true"
              className="mt-0.5 shrink-0 text-accent"
              size={15}
            />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function ReadinessList({ items, title }: { items: string[]; title: string }) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="mt-4">
      <p className="text-xs font-semibold uppercase text-ink/45">{title}</p>
      <div className="mt-2 grid gap-2">
        {items.map((item) => (
          <div className="flex gap-2 text-sm leading-6" key={item}>
            <CheckCircle2
              aria-hidden="true"
              className="mt-0.5 shrink-0 text-accent"
              size={14}
            />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AuditFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-line bg-surface/70 p-3">
      <p className="text-xs font-semibold uppercase text-ink/45">{label}</p>
      <p className="mt-1 font-medium leading-6">{value}</p>
    </div>
  );
}

function ScoreTile({
  icon: Icon,
  label,
  value
}: {
  icon: LucideIcon;
  label: string;
  value: number;
}) {
  return (
    <div className="metric-tile rounded-xl p-4">
      <div className="flex items-center justify-between gap-2">
        <Icon aria-hidden="true" className="text-accent" size={18} />
        <span className="font-semibold">
          <AnimatedNumber value={value} />
        </span>
      </div>
      <p className="mt-2 text-xs font-semibold uppercase text-ink/48">{label}</p>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white">
        <AnimatedBar className="h-full rounded-full bg-signal" value={value} />
      </div>
    </div>
  );
}

function formatLevel(value: string) {
  return value.charAt(0) + value.slice(1).toLowerCase();
}

function formatPricing(value: string) {
  if (value === "FREEMIUM") {
    return "Freemium";
  }

  if (value === "FREE") {
    return "Free";
  }

  return "Paid";
}

function ReasonItem({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-3 rounded-lg border border-line bg-surface/72 p-3 text-sm leading-6">
      <CheckCircle2
        aria-hidden="true"
        className="mt-0.5 shrink-0 text-accent"
        size={15}
      />
      <span>{children}</span>
    </div>
  );
}
