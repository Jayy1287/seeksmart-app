"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
  type ReactNode,
  type RefObject
} from "react";
import { ArrowLeft, ArrowRight, Check, CornerDownLeft, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { trackAuditEvent } from "@/features/audit/audit-analytics";
import { submitAuditAction } from "@/server/audit-runs/actions";
import {
  auditGoalOptions,
  type AuditGoalId,
  type AuditIntegrationNeedId,
  type AuditPainPointId
} from "@/shared/recommendations/audit";
import {
  auditWizardLimits,
  budgetChoices,
  companySizeChoices,
  dataSensitivityChoices,
  featuredIndustries,
  getFeaturedIndustry,
  orderIntegrationsForIndustry,
  orderPainPointsForIndustry,
  processClarityChoices,
  signOffChoices,
  technicalComfortChoices,
  urgencyChoices,
  workflowVolumeChoices,
  type AuditWizardAnswers,
  type WizardChoice
} from "@/shared/recommendations/wizard";

type WizardOption = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
};

type AuditWizardProps = {
  businessFunctions: WizardOption[];
  industries: WizardOption[];
  initialFunctionSlug?: string;
  initialIndustrySlug?: string;
};

type Draft = Partial<AuditWizardAnswers>;

const draftStorageKey = "seeksmart-audit-draft-v3";

type StepId =
  | "industry"
  | "companySize"
  | "businessFunction"
  | "goals"
  | "painPoints"
  | "integrations"
  | "processClarity"
  | "signOff"
  | "constraints"
  | "rhythm"
  | "metric";

const stepOrder: StepId[] = [
  "industry",
  "companySize",
  "businessFunction",
  "goals",
  "painPoints",
  "integrations",
  "processClarity",
  "signOff",
  "constraints",
  "rhythm",
  "metric"
];

const stepSection: Record<StepId, string> = {
  industry: "Business",
  companySize: "Team",
  businessFunction: "Focus",
  goals: "Goals",
  painPoints: "Friction",
  integrations: "Systems",
  processClarity: "Process",
  signOff: "Review",
  constraints: "Constraints",
  rhythm: "Rhythm",
  metric: "Proof"
};

const ease = [0.22, 1, 0.36, 1] as const;

const slide = {
  enter: (direction: number) => ({ opacity: 0, x: direction >= 0 ? 72 : -72 }),
  center: { opacity: 1, x: 0 },
  exit: (direction: number) => ({ opacity: 0, x: direction >= 0 ? -72 : 72 })
};

type Shortcut = () => void;

export function AuditWizard({
  businessFunctions,
  industries,
  initialFunctionSlug,
  initialIndustrySlug
}: AuditWizardProps) {
  const [draft, setDraft] = useState<Draft>(() => ({
    industrySlug: initialIndustrySlug,
    businessFunctionSlug: initialFunctionSlug,
    goals: [],
    painPoints: [],
    integrationNeeds: []
  }));
  const [stepIndex, setStepIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [hydrated, setHydrated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorTick, setErrorTick] = useState(0);
  const [autoAdvance, setAutoAdvance] = useState(false);
  const [isPending, startTransition] = useTransition();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);

  // Restore an in-progress draft after a refresh. Explicit URL presets win.
  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(draftStorageKey);
      if (raw) {
        const saved = JSON.parse(raw) as { draft: Draft; stepIndex: number };
        setDraft((current) => ({
          ...saved.draft,
          ...(initialIndustrySlug ? { industrySlug: initialIndustrySlug } : {}),
          ...(initialFunctionSlug
            ? { businessFunctionSlug: initialFunctionSlug }
            : {}),
          goals: saved.draft.goals ?? current.goals ?? [],
          painPoints: saved.draft.painPoints ?? current.painPoints ?? [],
          integrationNeeds:
            saved.draft.integrationNeeds ?? current.integrationNeeds ?? []
        }));
        if (!initialIndustrySlug && typeof saved.stepIndex === "number") {
          setStepIndex(Math.min(saved.stepIndex, stepOrder.length - 1));
        }
      }
    } catch {
      // Ignore storage errors (private mode, blocked storage).
    }
    setHydrated(true);
  }, [initialFunctionSlug, initialIndustrySlug]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }
    try {
      window.sessionStorage.setItem(
        draftStorageKey,
        JSON.stringify({ draft, stepIndex })
      );
    } catch {
      // Ignore storage errors.
    }
  }, [draft, hydrated, stepIndex]);

  const stepId = stepOrder[stepIndex];
  const isLastStep = stepIndex === stepOrder.length - 1;

  const update = useCallback((patch: Draft) => {
    setDraft((current) => ({ ...current, ...patch }));
    setError(null);
  }, []);

  const canContinue = useMemo(
    () => isStepComplete(stepId, draft),
    [draft, stepId]
  );

  const fail = useCallback((message: string) => {
    setError(message);
    setErrorTick((tick) => tick + 1);
  }, []);

  const goNext = useCallback(() => {
    setAutoAdvance(false);
    if (!canContinue) {
      fail(stepValidationMessage(stepId));
      return;
    }
    trackAuditEvent("audit_step_completed", {
      step: stepId,
      step_index: stepIndex + 1
    });
    setError(null);
    setDirection(1);
    setStepIndex((index) => Math.min(index + 1, stepOrder.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [canContinue, fail, stepId, stepIndex]);

  const goBack = useCallback(() => {
    setAutoAdvance(false);
    setError(null);
    setDirection(-1);
    setStepIndex((index) => Math.max(index - 1, 0));
  }, []);

  const jumpTo = useCallback(
    (id: StepId) => {
      const target = stepOrder.indexOf(id);
      setAutoAdvance(false);
      setDirection(target >= stepIndex ? 1 : -1);
      setStepIndex(target);
    },
    [stepIndex]
  );

  const submit = useCallback(() => {
    const missing = stepOrder.find((id) => !isStepComplete(id, draft));
    if (missing) {
      setDirection(-1);
      setStepIndex(stepOrder.indexOf(missing));
      fail(stepValidationMessage(missing));
      return;
    }

    trackAuditEvent("audit_questions_submitted", {
      industry: draft.industrySlug ?? "",
      business_function: draft.businessFunctionSlug ?? ""
    });

    startTransition(async () => {
      const state = await submitAuditAction(draft);
      if (state?.needsSignIn) {
        // The draft stays in sessionStorage, so answers are restored after login.
        window.location.assign(
          `/login?callbackUrl=${encodeURIComponent("/audit/questions")}`
        );
        return;
      }
      if (state?.error) {
        fail(state.error);
        return;
      }
      try {
        window.sessionStorage.removeItem(draftStorageKey);
      } catch {
        // Ignore storage errors.
      }
    });
  }, [draft, fail]);

  // Single-choice questions advance on their own once an answer is picked.
  useEffect(() => {
    if (!autoAdvance || !canContinue) {
      return;
    }
    const timer = window.setTimeout(goNext, 320);
    return () => window.clearTimeout(timer);
  }, [autoAdvance, canContinue, goNext]);

  const choose = useCallback(
    (patch: Draft) => {
      update(patch);
      setAutoAdvance(true);
    },
    [update]
  );

  // Move focus to the new question so keyboard and screen-reader users land
  // on it after each transition.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const timer = window.setTimeout(
      () => headingRef.current?.focus({ preventScroll: true }),
      360
    );
    return () => window.clearTimeout(timer);
  }, [stepIndex]);

  const toggle = useCallback(
    (key: "goals" | "painPoints" | "integrationNeeds", value: string, max: number) => {
      setDraft((current) => {
        const selected = (current[key] ?? []) as string[];
        if (selected.includes(value)) {
          return { ...current, [key]: selected.filter((item) => item !== value) };
        }
        if (selected.length >= max) {
          return current;
        }
        return { ...current, [key]: [...selected, value] };
      });
      setError(null);
    },
    []
  );

  const painGroups = useMemo(
    () => painPointGroups(draft.industrySlug ?? ""),
    [draft.industrySlug]
  );
  const integrationGroupsList = useMemo(
    () => integrationGroups(draft.industrySlug ?? ""),
    [draft.industrySlug]
  );

  // Number keys pick the matching option on single-list questions.
  const shortcuts = useMemo<Shortcut[]>(() => {
    switch (stepId) {
      case "industry":
        return featuredIndustries.map(
          (industry) => () => choose({ industrySlug: industry.slug })
        );
      case "companySize":
        return companySizeChoices.map((choice) => () => choose({ companySize: choice.value }));
      case "businessFunction":
        return businessFunctions.map(
          (item) => () => choose({ businessFunctionSlug: item.slug })
        );
      case "goals":
        return auditGoalOptions.map(
          (goal) => () => toggle("goals", goal.id, auditWizardLimits.maxGoals)
        );
      case "painPoints":
        return painGroups
          .flatMap((group) => group.choices)
          .map(
            (choice) => () =>
              toggle("painPoints", choice.value, auditWizardLimits.maxPainPoints)
          );
      case "integrations":
        return integrationGroupsList
          .flatMap((group) => group.choices)
          .map(
            (choice) => () =>
              toggle("integrationNeeds", choice.value, auditWizardLimits.maxIntegrationNeeds)
          );
      case "processClarity":
        return processClarityChoices.map(
          (choice) => () => choose({ processClarity: choice.value })
        );
      case "signOff":
        return signOffChoices.map((choice) => () => choose({ signOff: choice.value }));
      default:
        return [];
    }
  }, [businessFunctions, choose, integrationGroupsList, painGroups, stepId, toggle]);

  // Enter advances the step unless the user is typing in a multi-line field.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (isPending || event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }
      const target = event.target as HTMLElement | null;
      const tag = target?.tagName;

      if (/^[1-9]$/.test(event.key)) {
        if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") {
          return;
        }
        const action = shortcuts[Number(event.key) - 1];
        if (action) {
          event.preventDefault();
          action();
        }
        return;
      }

      if (event.key !== "Enter" || event.shiftKey) {
        return;
      }
      if (tag === "TEXTAREA" || tag === "BUTTON" || tag === "A" || tag === "SELECT") {
        return;
      }
      event.preventDefault();
      if (isLastStep) {
        submit();
      } else {
        goNext();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goNext, isLastStep, isPending, shortcuts, submit]);

  const progress = ((stepIndex + 1) / stepOrder.length) * 100;
  const featuredIndustry = getFeaturedIndustry(draft.industrySlug ?? "");

  return (
    <div className="relative flex min-h-[calc(100svh-4.5rem)] flex-col">
      {/* ---------- Progress ---------- */}
      <div className="app-container pt-4 md:pt-8">
        <div
          aria-label="Audit progress"
          aria-valuemax={stepOrder.length}
          aria-valuemin={1}
          aria-valuenow={stepIndex + 1}
          className="h-[3px] overflow-hidden rounded-full bg-ink/[0.08]"
          role="progressbar"
        >
          <motion.div
            animate={{ width: `${progress}%` }}
            className="h-full rounded-full bg-signal"
            initial={false}
            transition={{ duration: 0.6, ease }}
          />
        </div>
        <div className="mt-4 flex items-center justify-between gap-4 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-ink/50">
          <span className="tabular">
            Question <span className="text-ink">{pad(stepIndex + 1)}</span> of {pad(stepOrder.length)}
          </span>
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-signal" />
            {isLastStep ? "Last one" : stepSection[stepId]}
          </span>
        </div>
      </div>

      {/* ---------- Question ---------- */}
      <div className="app-container flex-1 overflow-x-clip pb-10 pt-8 md:pb-16 md:pt-14">
        <div className="mx-auto w-full max-w-3xl">
          <AnimatePresence custom={direction} initial={false} mode="wait">
            <motion.div
              animate="center"
              custom={direction}
              exit="exit"
              initial="enter"
              key={stepId}
              transition={{ duration: 0.38, ease }}
              variants={slide}
            >
              {stepId === "industry" ? (
                <Step
                  headingRef={headingRef}
                  title="What kind of business is this?"
                  why="Decides which opportunities and cautions come first."
                >
                  <OptionList>
                    {featuredIndustries.map((industry, index) => (
                      <OptionRow
                        hint={industry.hint}
                        index={index}
                        key={industry.slug}
                        label={industry.label}
                        onSelect={() => choose({ industrySlug: industry.slug })}
                        selected={draft.industrySlug === industry.slug}
                      />
                    ))}
                  </OptionList>
                  <label className="mt-6 block">
                    <span className="field-label">Something else</span>
                    <select
                      className="field mt-2"
                      onChange={(event) =>
                        update({ industrySlug: event.target.value || undefined })
                      }
                      value={
                        draft.industrySlug && !featuredIndustry ? draft.industrySlug : ""
                      }
                    >
                      <option value="">Choose an industry</option>
                      {industries
                        .filter((industry) => !getFeaturedIndustry(industry.slug))
                        .map((industry) => (
                          <option key={industry.id} value={industry.slug}>
                            {industry.name}
                          </option>
                        ))}
                    </select>
                  </label>
                </Step>
              ) : null}

              {stepId === "companySize" ? (
                <Step
                  headingRef={headingRef}
                  title="How big is the team?"
                  why="Smaller teams get narrower, lower-effort pilots."
                >
                  <ChoiceList
                    choices={companySizeChoices}
                    columns={2}
                    onSelect={(value) => choose({ companySize: value })}
                    selected={draft.companySize}
                  />
                </Step>
              ) : null}

              {stepId === "businessFunction" ? (
                <Step
                  headingRef={headingRef}
                  title="Which part of the business should improve first?"
                  why="Opportunities in this area rank higher."
                >
                  <OptionList columns={2}>
                    {businessFunctions.map((businessFunction, index) => (
                      <OptionRow
                        index={index}
                        key={businessFunction.id}
                        label={businessFunction.name}
                        onSelect={() =>
                          choose({ businessFunctionSlug: businessFunction.slug })
                        }
                        selected={draft.businessFunctionSlug === businessFunction.slug}
                      />
                    ))}
                  </OptionList>
                </Step>
              ) : null}

              {stepId === "goals" ? (
                <Step
                  headingRef={headingRef}
                  meta={<SelectedCount count={draft.goals?.length ?? 0} max={auditWizardLimits.maxGoals} />}
                  title="What do you want AI to improve?"
                  why={`Pick up to ${auditWizardLimits.maxGoals}. The first one matters most.`}
                >
                  <OptionList columns={2}>
                    {auditGoalOptions.map((goal, index) => {
                      const selected = (draft.goals ?? []).includes(goal.id);
                      return (
                        <OptionRow
                          disabled={
                            !selected &&
                            (draft.goals?.length ?? 0) >= auditWizardLimits.maxGoals
                          }
                          index={index}
                          key={goal.id}
                          label={goal.label}
                          multi
                          onSelect={() =>
                            toggle("goals", goal.id as AuditGoalId, auditWizardLimits.maxGoals)
                          }
                          selected={selected}
                        />
                      );
                    })}
                  </OptionList>
                </Step>
              ) : null}

              {stepId === "painPoints" ? (
                <Step
                  headingRef={headingRef}
                  meta={
                    <SelectedCount
                      count={draft.painPoints?.length ?? 0}
                      max={auditWizardLimits.maxPainPoints}
                    />
                  }
                  title="What slows the team down today?"
                  why={`Pick up to ${auditWizardLimits.maxPainPoints}. This drives the ranking.`}
                >
                  <GroupedOptions
                    groups={painGroups}
                    max={auditWizardLimits.maxPainPoints}
                    onToggle={(value) =>
                      toggle(
                        "painPoints",
                        value as AuditPainPointId,
                        auditWizardLimits.maxPainPoints
                      )
                    }
                    selected={draft.painPoints ?? []}
                  />
                </Step>
              ) : null}

              {stepId === "integrations" ? (
                <Step
                  headingRef={headingRef}
                  meta={
                    <SelectedCount
                      count={draft.integrationNeeds?.length ?? 0}
                      max={auditWizardLimits.maxIntegrationNeeds}
                    />
                  }
                  title="Which systems does this work live in?"
                  why="Optional. Tools that connect to these rank higher."
                >
                  <GroupedOptions
                    groups={integrationGroupsList}
                    max={auditWizardLimits.maxIntegrationNeeds}
                    onToggle={(value) =>
                      toggle(
                        "integrationNeeds",
                        value as AuditIntegrationNeedId,
                        auditWizardLimits.maxIntegrationNeeds
                      )
                    }
                    selected={draft.integrationNeeds ?? []}
                  />
                </Step>
              ) : null}

              {stepId === "processClarity" ? (
                <Step
                  headingRef={headingRef}
                  title="How clear is the current process?"
                  why="Decides between pilot now and prepare first."
                >
                  <ChoiceList
                    choices={processClarityChoices}
                    onSelect={(value) => choose({ processClarity: value })}
                    selected={draft.processClarity}
                  />
                </Step>
              ) : null}

              {stepId === "signOff" ? (
                <Step
                  headingRef={headingRef}
                  title="Who checks AI output before it is used?"
                  why="Shapes the guardrails and how far automation goes."
                >
                  <ChoiceList
                    choices={signOffChoices}
                    onSelect={(value) => choose({ signOff: value })}
                    selected={draft.signOff}
                  />
                </Step>
              ) : null}

              {stepId === "constraints" ? (
                <Step
                  headingRef={headingRef}
                  title="A few constraints."
                  why="These filter the tool shortlist."
                >
                  <div className="grid gap-8">
                    <SegmentedRow
                      choices={budgetChoices}
                      label="Budget"
                      onSelect={(value) => update({ budgetRange: value })}
                      selected={draft.budgetRange}
                    />
                    <SegmentedRow
                      choices={technicalComfortChoices}
                      label="Technical comfort"
                      onSelect={(value) => update({ technicalComfort: value })}
                      selected={draft.technicalComfort}
                    />
                    <SegmentedRow
                      choices={dataSensitivityChoices}
                      label="Data involved"
                      onSelect={(value) => update({ dataSensitivity: value })}
                      selected={draft.dataSensitivity}
                    />
                  </div>
                </Step>
              ) : null}

              {stepId === "rhythm" ? (
                <Step
                  headingRef={headingRef}
                  title="How often, and how urgent?"
                  why="Frequent work pays back faster; urgency favours quick wins."
                >
                  <div className="grid gap-8">
                    <SegmentedRow
                      choices={workflowVolumeChoices}
                      label="How often"
                      onSelect={(value) => update({ workflowVolume: value })}
                      selected={draft.workflowVolume}
                    />
                    <SegmentedRow
                      choices={urgencyChoices}
                      label="How urgent"
                      onSelect={(value) => update({ urgency: value })}
                      selected={draft.urgency}
                    />
                  </div>
                </Step>
              ) : null}

              {stepId === "metric" ? (
                <Step
                  headingRef={headingRef}
                  title="What number would prove it worked?"
                  why="Optional. A named metric makes the pilot plan concrete."
                >
                  <input
                    aria-label="Success metric"
                    autoFocus
                    className="w-full border-0 border-b-2 border-ink/15 bg-transparent px-0 pb-3 pt-1 font-display text-[clamp(1.35rem,3vw,2rem)] font-semibold tracking-[-0.03em] text-ink outline-none transition-colors placeholder:text-ink/25 focus:border-signal focus-visible:outline-none"
                    maxLength={auditWizardLimits.maxSuccessMetricLength}
                    onChange={(event) => update({ successMetric: event.target.value })}
                    placeholder="e.g. first reply time"
                    value={draft.successMetric ?? ""}
                  />
                  <SummaryPanel
                    businessFunctions={businessFunctions}
                    draft={draft}
                    industries={industries}
                    onJump={jumpTo}
                  />
                </Step>
              ) : null}
            </motion.div>
          </AnimatePresence>

          <AnimatePresence>
            {error ? (
              <motion.p
                animate={{ opacity: 1, x: [0, -8, 8, -5, 5, 0] }}
                className="mt-6 flex items-center gap-2 text-sm font-medium text-danger"
                exit={{ opacity: 0 }}
                initial={{ opacity: 0 }}
                key={`${error}-${errorTick}`}
                role="alert"
                transition={{ duration: 0.45 }}
              >
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-danger" />
                {error}
              </motion.p>
            ) : null}
          </AnimatePresence>
        </div>
      </div>

      {/* ---------- Actions (sticky on mobile) ---------- */}
      <div className="sticky bottom-0 z-20 border-t border-ink/[0.08] bg-paper/85 backdrop-blur-xl md:static md:border-0 md:bg-transparent md:backdrop-blur-none">
        <div className="app-container py-3 md:pb-14 md:pt-0">
          <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-3">
            <button
              aria-label="Previous question"
              className="btn btn-ghost h-12 w-12 shrink-0 !px-0 sm:w-auto sm:!px-5"
              disabled={stepIndex === 0 || isPending}
              onClick={goBack}
              type="button"
            >
              <ArrowLeft aria-hidden="true" size={18} />
              <span className="hidden sm:inline">Back</span>
            </button>
            <span className="hidden items-center gap-2 text-xs text-ink/45 md:flex">
              <span className="kbd">
                <CornerDownLeft aria-hidden="true" size={12} />
              </span>
              to continue
              {shortcuts.length > 0 ? (
                <>
                  <span className="mx-1 text-ink/20">/</span>
                  <span className="kbd">1</span>
                  <span>to</span>
                  <span className="kbd">{Math.min(shortcuts.length, 9)}</span>
                  to pick
                </>
              ) : null}
            </span>
            {isLastStep ? (
              <button
                className="btn btn-primary btn-lg flex-1 sm:flex-none"
                disabled={isPending}
                onClick={submit}
                type="button"
              >
                {isPending ? (
                  <>
                    <Loader2 aria-hidden="true" className="animate-spin" size={18} />
                    Building your brief
                  </>
                ) : (
                  <>
                    Show my results
                    <ArrowRight aria-hidden="true" size={18} />
                  </>
                )}
              </button>
            ) : (
              <button
                className="btn btn-primary btn-lg flex-1 sm:flex-none"
                data-ready={canContinue ? "true" : undefined}
                onClick={goNext}
                type="button"
              >
                {stepId === "integrations" && (draft.integrationNeeds?.length ?? 0) === 0
                  ? "Skip"
                  : "Continue"}
                <ArrowRight aria-hidden="true" size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function isStepComplete(stepId: StepId, draft: Draft) {
  switch (stepId) {
    case "industry":
      return Boolean(draft.industrySlug);
    case "companySize":
      return Boolean(draft.companySize);
    case "businessFunction":
      return Boolean(draft.businessFunctionSlug);
    case "goals":
      return (draft.goals?.length ?? 0) > 0;
    case "painPoints":
      return (draft.painPoints?.length ?? 0) > 0;
    case "integrations":
      return true;
    case "processClarity":
      return Boolean(draft.processClarity);
    case "signOff":
      return Boolean(draft.signOff);
    case "constraints":
      return Boolean(
        draft.budgetRange && draft.technicalComfort && draft.dataSensitivity
      );
    case "rhythm":
      return Boolean(draft.workflowVolume && draft.urgency);
    case "metric":
      return true;
  }
}

function stepValidationMessage(stepId: StepId) {
  switch (stepId) {
    case "industry":
      return "Choose the closest industry to continue.";
    case "companySize":
      return "Pick a team size.";
    case "businessFunction":
      return "Choose the area to improve first.";
    case "goals":
      return "Pick at least one goal.";
    case "painPoints":
      return "Pick at least one thing that slows the team down.";
    case "processClarity":
      return "Choose how clear the current process is.";
    case "signOff":
      return "Choose who reviews AI output.";
    case "constraints":
      return "Answer all three: budget, technical comfort, and data.";
    case "rhythm":
      return "Answer both: how often and how urgent.";
    default:
      return "Complete this step to continue.";
  }
}

type ChoiceGroup = { label: string; choices: Array<{ value: string; label: string }> };

function painPointGroups(industrySlug: string): ChoiceGroup[] {
  const { common, other } = orderPainPointsForIndustry(industrySlug);
  const toChoices = (items: typeof common) =>
    items.map((item) => ({ value: item.id, label: item.label }));

  if (common.length === 0) {
    return [{ label: "", choices: toChoices(other) }];
  }

  return [
    { label: "Common for businesses like yours", choices: toChoices(common) },
    { label: "Other", choices: toChoices(other) }
  ];
}

function integrationGroups(industrySlug: string): ChoiceGroup[] {
  const { common, other } = orderIntegrationsForIndustry(industrySlug);
  const toChoices = (items: typeof common) =>
    items.map((item) => ({ value: item.id, label: item.label }));

  if (common.length === 0) {
    return [{ label: "", choices: toChoices(other) }];
  }

  return [
    { label: "Most likely for you", choices: toChoices(common) },
    { label: "Other systems", choices: toChoices(other) }
  ];
}

function Step({
  children,
  headingRef,
  meta,
  title,
  why
}: {
  children: ReactNode;
  headingRef: RefObject<HTMLHeadingElement | null>;
  meta?: ReactNode;
  title: string;
  why: string;
}) {
  return (
    <section>
      <h1
        className="font-display text-[clamp(2.1rem,5vw,3.75rem)] font-bold leading-[0.98] tracking-[-0.045em] text-ink outline-none [text-wrap:balance]"
        ref={headingRef}
        tabIndex={-1}
      >
        {title}
      </h1>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
        <p className="text-base text-ink/55 md:text-lg">{why}</p>
        {meta}
      </div>
      <div className="mt-8 md:mt-10">{children}</div>
    </section>
  );
}

function SelectedCount({ count, max }: { count: number; max: number }) {
  return (
    <span className="font-mono text-xs uppercase tracking-[0.14em] text-ink/45 tabular">
      <span className={count > 0 ? "text-ink" : undefined}>{count}</span> / {max} picked
    </span>
  );
}

function OptionList({
  children,
  columns = 1
}: {
  children: ReactNode;
  columns?: 1 | 2;
}) {
  return (
    <div className={`grid gap-2.5 ${columns === 2 ? "sm:grid-cols-2" : ""}`}>{children}</div>
  );
}

function OptionRow({
  compact = false,
  disabled = false,
  hint,
  index,
  label,
  multi = false,
  onSelect,
  selected
}: {
  compact?: boolean;
  disabled?: boolean;
  hint?: string;
  index?: number;
  label: string;
  multi?: boolean;
  onSelect: () => void;
  selected: boolean;
}) {
  const showKey = typeof index === "number" && index < 9;

  return (
    <motion.button
      aria-pressed={selected}
      className={`group relative flex w-full items-center gap-4 overflow-hidden rounded-2xl border text-left transition-[border-color,background-color,color,opacity] duration-300 ease-out disabled:cursor-not-allowed disabled:opacity-40 ${
        compact ? "min-h-[3.75rem] px-4 py-3" : "min-h-[4.25rem] px-4 py-4 md:px-5"
      } ${
        selected
          ? "border-ink bg-ink text-paper"
          : "border-ink/10 bg-surface text-ink hover:border-ink/35"
      }`}
      disabled={disabled}
      onClick={onSelect}
      type="button"
      whileTap={{ scale: 0.985 }}
    >
      {showKey ? (
        <span
          aria-hidden="true"
          className={`hidden h-7 w-7 shrink-0 items-center justify-center rounded-lg border font-mono text-xs transition-colors md:flex ${
            selected
              ? "border-white/20 text-white/70"
              : "border-ink/10 text-ink/45 group-hover:border-ink/30 group-hover:text-ink"
          }`}
        >
          {index + 1}
        </span>
      ) : null}
      <span className="min-w-0 flex-1">
        <span className={`block font-medium leading-snug ${compact ? "text-[0.97rem]" : "text-[1.05rem] md:text-lg"}`}>
          {label}
        </span>
        {hint ? (
          <span
            className={`mt-0.5 block text-sm leading-snug ${selected ? "text-white/60" : "text-ink/50"}`}
          >
            {hint}
          </span>
        ) : null}
      </span>
      <span
        aria-hidden="true"
        className={`flex h-7 w-7 shrink-0 items-center justify-center border transition-all duration-300 ${
          multi ? "rounded-lg" : "rounded-full"
        } ${
          selected
            ? "scale-100 border-signal bg-signal text-white"
            : "border-ink/15 text-transparent group-hover:border-ink/40"
        }`}
      >
        <AnimatePresence initial={false}>
          {selected ? (
            <motion.span
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.4, opacity: 0 }}
              initial={{ scale: 0.4, opacity: 0 }}
              transition={{ type: "spring", stiffness: 520, damping: 26 }}
            >
              <Check size={15} strokeWidth={3} />
            </motion.span>
          ) : null}
        </AnimatePresence>
      </span>
    </motion.button>
  );
}

function ChoiceList<T extends string>({
  choices,
  columns = 1,
  onSelect,
  selected
}: {
  choices: WizardChoice<T>[];
  columns?: 1 | 2;
  onSelect: (value: T) => void;
  selected?: T;
}) {
  return (
    <OptionList columns={columns}>
      {choices.map((choice, index) => (
        <OptionRow
          hint={choice.hint}
          index={index}
          key={choice.value}
          label={choice.label}
          onSelect={() => onSelect(choice.value)}
          selected={selected === choice.value}
        />
      ))}
    </OptionList>
  );
}

function GroupedOptions({
  groups,
  max,
  onToggle,
  selected
}: {
  groups: ChoiceGroup[];
  max: number;
  onToggle: (value: string) => void;
  selected: string[];
}) {
  const atLimit = selected.length >= max;
  let running = 0;

  return (
    <div className="grid gap-8">
      {groups.map((group) => (
        <div key={group.label || "all"}>
          {group.label ? (
            <p className="eyebrow eyebrow-plain mb-4">{group.label}</p>
          ) : null}
          <OptionList columns={2}>
            {group.choices.map((choice) => {
              const isSelected = selected.includes(choice.value);
              const index = running++;
              return (
                <OptionRow
                  compact
                  disabled={!isSelected && atLimit}
                  index={index}
                  key={choice.value}
                  label={choice.label}
                  multi
                  onSelect={() => onToggle(choice.value)}
                  selected={isSelected}
                />
              );
            })}
          </OptionList>
        </div>
      ))}
    </div>
  );
}

function SegmentedRow<T extends string>({
  choices,
  label,
  onSelect,
  selected
}: {
  choices: WizardChoice<T>[];
  label: string;
  onSelect: (value: T) => void;
  selected?: T;
}) {
  return (
    <div>
      <p className="eyebrow eyebrow-plain mb-4">{label}</p>
      <div aria-label={label} className="grid gap-2.5 sm:grid-cols-3" role="group">
        {choices.map((choice) => (
          <OptionRow
            compact
            hint={choice.hint}
            key={choice.value}
            label={choice.label}
            onSelect={() => onSelect(choice.value)}
            selected={selected === choice.value}
          />
        ))}
      </div>
    </div>
  );
}

function SummaryPanel({
  businessFunctions,
  draft,
  industries,
  onJump
}: {
  businessFunctions: WizardOption[];
  draft: Draft;
  industries: WizardOption[];
  onJump: (step: StepId) => void;
}) {
  const industryLabel =
    getFeaturedIndustry(draft.industrySlug ?? "")?.label ??
    industries.find((industry) => industry.slug === draft.industrySlug)?.name ??
    "Not set";
  const functionLabel =
    businessFunctions.find(
      (businessFunction) => businessFunction.slug === draft.businessFunctionSlug
    )?.name ?? "Not set";
  const goalsLabel = (draft.goals ?? [])
    .map((goal) => auditGoalOptions.find((option) => option.id === goal)?.label)
    .filter(Boolean)
    .join(", ");

  const rows: Array<{ label: string; value: string; step: StepId }> = [
    { label: "Business", value: industryLabel, step: "industry" },
    { label: "Area", value: functionLabel, step: "businessFunction" },
    { label: "Goals", value: goalsLabel || "Not set", step: "goals" },
    {
      label: "Friction",
      value: `${draft.painPoints?.length ?? 0} selected`,
      step: "painPoints"
    }
  ];

  return (
    <div className="mt-12">
      <p className="eyebrow eyebrow-plain">Your answers</p>
      <dl className="row-list mt-4">
        {rows.map((row) => (
          <div
            className="row-item grid-cols-[5.5rem_minmax(0,1fr)_auto] gap-3 py-3.5 md:grid-cols-[8rem_minmax(0,1fr)_auto]"
            key={row.label}
          >
            <dt className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-ink/45">
              {row.label}
            </dt>
            <dd className="truncate font-medium">{row.value}</dd>
            <button
              className="rounded-full px-3 py-1.5 text-sm font-medium text-accent transition-colors hover:bg-ink/[0.05]"
              onClick={() => onJump(row.step)}
              type="button"
            >
              Edit
            </button>
          </div>
        ))}
      </dl>
    </div>
  );
}
