import type { ReactNode } from "react";
import "@/styles/audit.css";
import Link from "next/link";
import { ArrowUpRight, Plus } from "lucide-react";
import { AnimatedNumber } from "@/components/motion/animated-number";
import { Reveal } from "@/components/motion/reveal";
import { SplitReveal } from "@/components/motion/split-reveal";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { ScoreDial } from "@/components/ui/score-dial";
import { AuditOpportunityRows } from "@/features/audit/audit-opportunity-rows";
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
  AuditResult,
  AuditToolRecommendation
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
  "Two-week pilot plan",
  "Tool shortlist with pricing",
  "Guardrails and watch-outs",
  "Printable, shareable brief"
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
  const readiness = result.readiness;
  const context = [
    result.summary.industryName,
    result.summary.businessFunctionName,
    companySizeLabel(input.companySize),
    urgencyLabel(input.urgency)
  ].filter(Boolean);

  return (
    <main className="audit-brief">
      {analytics}

      {/* ---------- Night report hero ---------- */}
      <section className="app-container pt-4 md:pt-8">
        <Reveal y={32}>
          <div
            className="night spotlight spotlight-strong rounded-[2rem] px-5 py-8 sm:px-8 md:rounded-[2.5rem] md:px-12 md:py-14"
            data-spotlight
          >
            <div
              aria-hidden="true"
              className="dot-grid absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_85%_15%,black,transparent_60%)]"
            />
            <div className="relative grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-16">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <p className="eyebrow">AI pilot brief</p>
                  <p className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-white/40">
                    {context.join(" / ")}
                  </p>
                </div>
                <p className="mt-10 font-mono text-[0.72rem] uppercase tracking-[0.16em] text-signal">
                  First move
                </p>
                <SplitReveal
                  className="mt-4 max-w-4xl font-display text-[clamp(2.3rem,5.4vw,4.75rem)] font-bold leading-[0.95] tracking-[-0.045em] text-white"
                  delay={0.2}
                  lines={[[first ? first.name : "Complete the audit to get a plan."]]}
                  stagger={0.045}
                />
                <p className="mt-6 max-w-2xl text-[1.05rem] leading-relaxed text-white/60 md:text-lg">
                  {first?.startingPoint ? (
                    <>
                      <span className="text-white">Start by: </span>
                      {first.startingPoint}
                    </>
                  ) : (
                    result.summary.firstWorkflow
                  )}
                </p>
              </div>

              <div className="flex items-center gap-6 rounded-[1.6rem] bg-white/[0.04] p-5 sm:p-6 lg:flex-col lg:gap-5 lg:px-10 lg:py-9">
                <div className="relative shrink-0">
                  <ScoreDial
                    className="hidden sm:inline-flex"
                    label="Readiness"
                    showValue={false}
                    size={188}
                    stroke={11}
                    tone="light"
                    value={readiness.score}
                  />
                  <ScoreDial
                    className="sm:hidden"
                    label="Readiness"
                    showValue={false}
                    size={128}
                    stroke={9}
                    tone="light"
                    value={readiness.score}
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="stat-number text-[2.6rem] text-white sm:text-[3.75rem]">
                      <AnimatedNumber value={readiness.score} />
                    </span>
                    <span className="mt-1 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-white/45 sm:text-[0.65rem]">
                      Readiness
                    </span>
                  </div>
                </div>
                <div className="min-w-0 lg:text-center">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      readiness.level === "Pilot-ready"
                        ? "bg-signal text-white"
                        : readiness.level === "Prepare first"
                          ? "bg-white text-ink"
                          : "border border-white/25 text-white/85"
                    }`}
                  >
                    {readiness.level}
                  </span>
                  <p className="mt-3 max-w-[16rem] text-sm leading-relaxed text-white/50">
                    {readiness.summary}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
        {actions ? <Reveal className="mt-5" delay={0.15}>{actions}</Reveal> : null}
      </section>

      {/* ---------- Ranked opportunities ---------- */}
      <section className="app-container pb-16 pt-20 md:pb-24 md:pt-28">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <Reveal>
              <p className="eyebrow">Ranked</p>
            </Reveal>
            <SplitReveal
              as="h2"
              className="h2 mt-5"
              inView
              lines={[["Where AI pays back"], [{ text: "first, for you.", className: "ghost-word" }]]}
            />
          </div>
          <Reveal>
            <p className="max-w-xs text-sm text-ink/50">
              Directional scores. Open a row to see why.
            </p>
          </Reveal>
        </div>
        <div className="mt-10 md:mt-14">
          <AuditOpportunityRows detailed={!locked} opportunities={result.topOpportunities} />
        </div>
      </section>

      {locked ? (
        <section className="app-container pb-24 md:pb-32">
          {unlockPanel}
          <Reveal className="mt-14 grid gap-8 md:grid-cols-2 md:gap-12">
            <Note label="Automation posture">{result.summary.automationPosture}</Note>
            <Note label="One caution">{result.summary.overallCaution}</Note>
          </Reveal>
        </section>
      ) : (
        <UnlockedSections input={input} result={result} />
      )}
    </main>
  );
}

function UnlockedSections({ input, result }: { input: AuditInput; result: AuditResult }) {
  const plan = result.pilotPlan;
  const [firstAction, secondAction, ...restActions] = plan.weekOneActions;
  const timeline = [
    {
      when: "Day 1",
      title: "Set the baseline",
      items: [plan.baselineQuestion, firstAction].filter(Boolean) as string[]
    },
    {
      when: "Week 1",
      title: "Run it on real work",
      items: [secondAction, ...restActions].filter(Boolean) as string[]
    },
    {
      when: "Week 2",
      title: "Measure and decide",
      items: [plan.target],
      expandIf: plan.expansionCriteria
    }
  ];
  const tools = shortlist(result);

  return (
    <>
      {/* ---------- Pilot plan ---------- */}
      <section className="app-container pb-20 md:pb-28">
        <div className="border-t border-ink/[0.12] pt-14 md:pt-20">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
            <div className="lg:sticky lg:top-28 lg:h-fit">
              <Reveal>
                <p className="eyebrow">Pilot plan</p>
              </Reveal>
              <SplitReveal
                as="h2"
                className="h2 mt-5"
                inView
                lines={[[plan.title]]}
              />
              <Stagger as="div" className="mt-10 grid grid-cols-2 gap-x-6 gap-y-7" inView>
                {[
                  { label: "Owner", value: plan.owner },
                  { label: "Timeline", value: plan.timeline },
                  { label: "Measure", value: plan.successMetric }
                ].map((item) => (
                  <StaggerItem className="border-t border-ink/15 pt-3" key={item.label}>
                    <p className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-ink/45">
                      {item.label}
                    </p>
                    <p className="mt-2 font-medium leading-snug first-letter:uppercase">{item.value}</p>
                  </StaggerItem>
                ))}
              </Stagger>
              {plan.guardrails.length > 0 ? (
                <Reveal className="mt-10">
                  <p className="eyebrow eyebrow-plain">Guardrails</p>
                  <ul className="mt-4 grid gap-2.5">
                    {plan.guardrails.map((item) => (
                      <li className="flex gap-3 text-[0.95rem] leading-relaxed text-ink/70" key={item}>
                        <span aria-hidden="true" className="mt-[0.6rem] h-1.5 w-1.5 shrink-0 rounded-full bg-ink/30" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              ) : null}
            </div>

            <Stagger as="ol" className="relative" gap={0.12} inView>
              <span aria-hidden="true" className="absolute bottom-6 left-[0.6rem] top-3 w-px bg-ink/15" />
              {timeline.map((stage, index) => (
                <StaggerItem as="li" className="relative pb-12 pl-12 last:pb-0 md:pl-16" key={stage.when}>
                  <span
                    aria-hidden="true"
                    className={`absolute left-0 top-1.5 flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                      index === 0 ? "border-signal bg-signal" : "border-ink/25 bg-paper"
                    }`}
                  >
                    {index === 0 ? <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-white" /> : null}
                  </span>
                  <p className="font-mono text-[0.72rem] uppercase tracking-[0.16em] text-accent">
                    {stage.when}
                  </p>
                  <h3 className="mt-2 font-display text-[1.6rem] font-bold leading-tight tracking-[-0.035em] md:text-[2rem]">
                    {stage.title}
                  </h3>
                  <ul className="mt-5 grid gap-3">
                    {stage.items.map((item) => (
                      <li className="text-[0.97rem] leading-relaxed text-ink/70" key={item}>
                        {item}
                      </li>
                    ))}
                  </ul>
                  {"expandIf" in stage && stage.expandIf && stage.expandIf.length > 0 ? (
                    <div className="mt-6">
                      <p className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-ink/45">
                        Expand only if
                      </p>
                      <ul className="mt-3 grid gap-2">
                        {stage.expandIf.map((item) => (
                          <li className="flex gap-3 text-[0.97rem] leading-relaxed text-ink/70" key={item}>
                            <span aria-hidden="true" className="mt-[0.6rem] h-1.5 w-1.5 shrink-0 rounded-full bg-success" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      {/* ---------- Tools to compare ---------- */}
      <section className="app-container pb-20 md:pb-28">
        <div className="border-t border-ink/[0.12] pt-14 md:pt-20">
          <Reveal>
            <p className="eyebrow">Shortlist</p>
          </Reveal>
          <SplitReveal
            as="h2"
            className="h2 mt-5"
            inView
            lines={[["Tools to compare"], [{ text: "on the same examples.", className: "ghost-word" }]]}
          />
          {tools.length > 0 ? (
            <Stagger as="div" className="row-list mt-12" inView>
              {tools.map(({ tool, ranks }) => (
                <StaggerItem key={tool.id}>
                  <Link
                    className="row-item group grid-cols-[auto_minmax(0,1fr)_auto] gap-4 py-5 md:grid-cols-[auto_minmax(0,14rem)_minmax(0,1fr)_auto_auto] md:gap-8 md:py-6"
                    href={`/tools/${tool.slug}`}
                  >
                    <ToolLogo logoUrl={tool.logoUrl} name={tool.name} size="md" />
                    <span className="min-w-0">
                      <span className="block truncate text-lg font-semibold tracking-[-0.01em]">{tool.name}</span>
                      <span className="block truncate text-sm text-ink/45">
                        {tool.categoryName} · {formatPricing(tool.pricingType)}
                        {tool.hasFreePlan ? " · Free plan" : ""}
                      </span>
                    </span>
                    <span className="col-span-3 row-start-2 md:col-span-1 md:col-start-3 md:row-start-1">
                      <span className="block text-[0.95rem] leading-relaxed text-ink/60">{tool.reason}</span>
                      <span className="mt-2 flex flex-wrap gap-1.5">
                        {ranks.map((rank) => (
                          <span
                            className={`rounded-full px-2 py-0.5 font-mono text-[0.65rem] uppercase tracking-[0.1em] ${
                              rank === 1 ? "bg-signal/15 text-accent" : "bg-ink/[0.06] text-ink/50"
                            }`}
                            key={rank}
                          >
                            Fits 0{rank}
                          </span>
                        ))}
                      </span>
                    </span>
                    <span className="hidden md:block">
                      <ScoreDial label={`${tool.name} fit`} size={48} tone={ranks[0] === 1 ? "signal" : "ink"} value={tool.fitScore} />
                    </span>
                    <span className="row-arrow col-start-3 row-start-1 md:col-start-5">
                      <ArrowUpRight aria-hidden="true" size={16} />
                    </span>
                  </Link>
                </StaggerItem>
              ))}
            </Stagger>
          ) : (
            <p className="mt-8 max-w-xl text-ink/55">
              No verified shortlist yet. Use the use-case paths above to compare options.
            </p>
          )}
        </div>
      </section>

      {/* ---------- Readiness + checklist ---------- */}
      <section className="app-container pb-24 md:pb-32">
        <div className="grid gap-14 border-t border-ink/[0.12] pt-14 md:grid-cols-2 md:gap-16 md:pt-20">
          <Reveal>
            <p className="eyebrow">Readiness</p>
            <div className="mt-8 grid gap-10 sm:grid-cols-2">
              <BulletList items={result.readiness.strengths} title="Strengths" tone="success" />
              <BulletList items={result.readiness.risks} title="Watch-outs" tone="signal" />
            </div>
            <Note className="mt-10" label="Caution">{result.summary.overallCaution}</Note>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="eyebrow">Before you decide</p>
            <ol className="row-list mt-8">
              {result.nextStepChecklist.map((item, index) => (
                <li className="row-item grid-cols-[2.5rem_minmax(0,1fr)] items-start py-4" key={item}>
                  <span className="font-mono text-sm text-ink/35">0{index + 1}</span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>

        <Reveal className="mt-16">
          <details className="group border-y border-ink/[0.12] [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-lg font-medium">
              Your answers
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ink/[0.12] transition-all duration-300 group-open:rotate-45 group-open:border-ink group-open:bg-ink group-open:text-paper">
                <Plus aria-hidden="true" size={16} />
              </span>
            </summary>
            <dl className="grid gap-x-10 gap-y-5 pb-8 pt-2 sm:grid-cols-2 lg:grid-cols-3">
              <Fact label="Goals" value={input.goals.map(goalLabel).join(", ")} />
              <Fact label="Pain points" value={input.painPoints.map(painPointLabel).join(", ")} />
              <Fact label="Budget" value={budgetRangeLabel(input.budgetRange)} />
              <Fact label="Technical comfort" value={technicalComfortLabel(input.technicalComfort)} />
              <Fact label="Data sensitivity" value={dataSensitivityLabel(input.dataSensitivity)} />
              <Fact label="Workflow volume" value={workflowVolumeLabel(input.workflowVolume)} />
              <Fact
                label="Process clarity"
                value={`${workflowMaturityLabel(input.workflowMaturity)}; ${dataReadinessLabel(input.dataReadiness).toLowerCase()}`}
              />
              <Fact label="Sign-off" value={decisionOwnerLabel(input.decisionOwner)} />
              <Fact
                label="Systems"
                value={
                  input.integrationNeeds.length > 0
                    ? input.integrationNeeds.map(integrationNeedLabel).join(", ")
                    : "None selected"
                }
              />
            </dl>
          </details>
        </Reveal>
      </section>
    </>
  );
}

function Note({
  children,
  className,
  label
}: {
  children: ReactNode;
  className?: string;
  label: string;
}) {
  return (
    <div className={className}>
      <p className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-ink/45">{label}</p>
      <p className="mt-3 max-w-xl text-[1.05rem] leading-relaxed text-ink/70">{children}</p>
    </div>
  );
}

function BulletList({
  items,
  title,
  tone
}: {
  items: string[];
  title: string;
  tone: "success" | "signal";
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div>
      <p className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-ink/45">{title}</p>
      <ul className="mt-4 grid gap-3">
        {items.map((item) => (
          <li className="flex gap-3 leading-relaxed text-ink/75" key={item}>
            <span
              aria-hidden="true"
              className={`mt-[0.6rem] h-1.5 w-1.5 shrink-0 rounded-full ${
                tone === "success" ? "bg-success" : "bg-signal"
              }`}
            />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-ink/45">{label}</dt>
      <dd className="mt-1.5 font-medium leading-snug">{value}</dd>
    </div>
  );
}

// One row per tool, even when several opportunities recommend it.
function shortlist(result: AuditResult) {
  const byId = new Map<string, { tool: AuditToolRecommendation; ranks: number[] }>();
  result.topOpportunities.forEach((opportunity, index) => {
    for (const tool of opportunity.tools) {
      const entry = byId.get(tool.id);
      if (entry) {
        entry.ranks.push(index + 1);
        if (tool.fitScore > entry.tool.fitScore) {
          entry.tool = { ...tool, reason: entry.tool.reason };
        }
      } else {
        byId.set(tool.id, { tool, ranks: [index + 1] });
      }
    }
  });
  return [...byId.values()].sort(
    (a, b) => a.ranks[0] - b.ranks[0] || b.tool.fitScore - a.tool.fitScore
  );
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
