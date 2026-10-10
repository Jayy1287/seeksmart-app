"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
  type ReactNode
} from "react";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
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
  const [hydrated, setHydrated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

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
  const featuredIndustry = getFeaturedIndustry(draft.industrySlug ?? "");

  const update = useCallback((patch: Draft) => {
    setDraft((current) => ({ ...current, ...patch }));
    setError(null);
  }, []);

  const canContinue = useMemo(
    () => isStepComplete(stepId, draft),
    [draft, stepId]
  );

  const goNext = useCallback(() => {
    if (!canContinue) {
      setError(stepValidationMessage(stepId));
      return;
    }
    trackAuditEvent("audit_step_completed", {
      step: stepId,
      step_index: stepIndex + 1
    });
    setError(null);
    setStepIndex((index) => Math.min(index + 1, stepOrder.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [canContinue, stepId, stepIndex]);

  const goBack = useCallback(() => {
    setError(null);
    setStepIndex((index) => Math.max(index - 1, 0));
  }, []);

  const submit = useCallback(() => {
    const missing = stepOrder.find((id) => !isStepComplete(id, draft));
    if (missing) {
      setStepIndex(stepOrder.indexOf(missing));
      setError(stepValidationMessage(missing));
      return;
    }

    trackAuditEvent("audit_questions_submitted", {
      industry: draft.industrySlug ?? "",
      business_function: draft.businessFunctionSlug ?? ""
    });

    startTransition(async () => {
      const state = await submitAuditAction(draft);
      if (state?.error) {
        setError(state.error);
        return;
      }
      try {
        window.sessionStorage.removeItem(draftStorageKey);
      } catch {
        // Ignore storage errors.
      }
    });
  }, [draft]);

  // Enter advances the step unless the user is typing in a multi-line field.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Enter" || event.shiftKey || isPending) {
        return;
      }
      const target = event.target as HTMLElement | null;
      if (target?.tagName === "TEXTAREA") {
        return;
      }
      if (target?.tagName === "BUTTON" || target?.tagName === "A") {
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
  }, [goNext, isLastStep, isPending, submit]);

  const progress = Math.round(((stepIndex + 1) / stepOrder.length) * 100);

  return (
    <div className="wizard-shell">
      <div className="wizard-progress" aria-hidden="true">
        <span style={{ width: `${progress}%` }} />
      </div>
      <div className="flex items-center justify-between gap-3 text-xs font-bold uppercase tracking-wide text-ink/50">
        <span>
          Question {stepIndex + 1} of {stepOrder.length}
        </span>
        <span>{isLastStep ? "Last one" : "About 3 minutes"}</span>
      </div>

      <div className="mt-6 min-h-[22rem]" key={stepId}>
        {stepId === "industry" ? (
          <Step
            title="What kind of business is this?"
            why="Industry decides which opportunities and cautions we show first."
          >
            <div className="grid gap-3 sm:grid-cols-3">
              {featuredIndustries.map((industry) => (
                <ChoiceCard
                  hint={industry.hint}
                  key={industry.slug}
                  label={industry.label}
                  onSelect={() => update({ industrySlug: industry.slug })}
                  selected={draft.industrySlug === industry.slug}
                />
              ))}
            </div>
            <label className="mt-5 block">
              <span className="text-sm font-semibold text-ink/72">
                Something else
              </span>
              <select
                className="control-field mt-2 w-full"
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
            {featuredIndustry ? (
              <p className="wizard-note">{featuredIndustry.examplePrompt}</p>
            ) : null}
          </Step>
        ) : null}

        {stepId === "companySize" ? (
          <Step
            title="How big is the team?"
            why="Smaller teams get narrower, lower-effort pilots."
          >
            <ChoiceGrid
              choices={companySizeChoices}
              onSelect={(value) => update({ companySize: value })}
              selected={draft.companySize}
            />
          </Step>
        ) : null}

        {stepId === "businessFunction" ? (
          <Step
            title="Which part of the business should improve first?"
            why="We rank opportunities inside this area higher than the rest."
          >
            <div className="grid gap-3 sm:grid-cols-2">
              {businessFunctions.map((businessFunction) => (
                <ChoiceCard
                  hint={businessFunction.description ?? undefined}
                  key={businessFunction.id}
                  label={businessFunction.name}
                  onSelect={() =>
                    update({ businessFunctionSlug: businessFunction.slug })
                  }
                  selected={draft.businessFunctionSlug === businessFunction.slug}
                />
              ))}
            </div>
          </Step>
        ) : null}

        {stepId === "goals" ? (
          <Step
            title="What do you want AI to improve?"
            why={`Pick up to ${auditWizardLimits.maxGoals}. The first one matters most.`}
          >
            <MultiChoiceGrid
              choices={auditGoalOptions.map((goal) => ({
                value: goal.id,
                label: goal.label
              }))}
              max={auditWizardLimits.maxGoals}
              onChange={(values) => update({ goals: values as AuditGoalId[] })}
              selected={draft.goals ?? []}
            />
          </Step>
        ) : null}

        {stepId === "painPoints" ? (
          <Step
            title="What slows the team down today?"
            why={`Pick up to ${auditWizardLimits.maxPainPoints}. Be honest; this drives the ranking.`}
          >
            <GroupedMultiChoice
              groups={painPointGroups(draft.industrySlug ?? "")}
              max={auditWizardLimits.maxPainPoints}
              onChange={(values) =>
                update({ painPoints: values as AuditPainPointId[] })
              }
              selected={draft.painPoints ?? []}
            />
          </Step>
        ) : null}

        {stepId === "integrations" ? (
          <Step
            title="Which systems does this work live in?"
            why="Optional. Tools that connect to these systems rank higher."
          >
            <GroupedMultiChoice
              groups={integrationGroups(draft.industrySlug ?? "")}
              max={auditWizardLimits.maxIntegrationNeeds}
              onChange={(values) =>
                update({ integrationNeeds: values as AuditIntegrationNeedId[] })
              }
              selected={draft.integrationNeeds ?? []}
            />
          </Step>
        ) : null}

        {stepId === "processClarity" ? (
          <Step
            title="How clear is the current process?"
            why="This decides whether we say pilot now or prepare first."
          >
            <ChoiceGrid
              choices={processClarityChoices}
              onSelect={(value) => update({ processClarity: value })}
              selected={draft.processClarity}
            />
          </Step>
        ) : null}

        {stepId === "signOff" ? (
          <Step
            title="Who checks AI output before it is used?"
            why="Review style shapes the guardrails and how far automation can go."
          >
            <ChoiceGrid
              choices={signOffChoices}
              onSelect={(value) => update({ signOff: value })}
              selected={draft.signOff}
            />
          </Step>
        ) : null}

        {stepId === "constraints" ? (
          <Step
            title="A few constraints"
            why="Budget, technical comfort and data sensitivity filter the tool shortlist."
          >
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
          </Step>
        ) : null}

        {stepId === "rhythm" ? (
          <Step
            title="How often does this work happen, and how urgent is it?"
            why="Frequent work pays back faster; urgency favours quick wins."
          >
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
          </Step>
        ) : null}

        {stepId === "metric" ? (
          <Step
            title="What number would prove it worked?"
            why="Optional, but a named metric makes the pilot plan concrete."
          >
            <input
              autoFocus
              className="control-field w-full"
              maxLength={auditWizardLimits.maxSuccessMetricLength}
              onChange={(event) => update({ successMetric: event.target.value })}
              placeholder="Example: first reply time, product pages published per week, hours of admin saved"
              value={draft.successMetric ?? ""}
            />
            <SummaryPanel
              businessFunctions={businessFunctions}
              draft={draft}
              industries={industries}
              onJump={(id) => setStepIndex(stepOrder.indexOf(id))}
            />
          </Step>
        ) : null}
      </div>

      {error ? (
        <p className="wizard-error" role="alert">
          {error}
        </p>
      ) : null}

      <div className="mt-6 flex flex-col-reverse gap-3 border-t border-line/60 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <button
          className="secondary-button min-h-11"
          disabled={stepIndex === 0 || isPending}
          onClick={goBack}
          type="button"
        >
          <ArrowLeft aria-hidden="true" size={16} />
          Back
        </button>
        {isLastStep ? (
          <button
            className="primary-button min-h-12 px-6"
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
            className="primary-button min-h-12 px-6"
            onClick={goNext}
            type="button"
          >
            Continue
            <ArrowRight aria-hidden="true" size={18} />
          </button>
        )}
      </div>
      <p className="mt-3 text-xs text-ink/45">
        No account needed. Press Enter to continue. Your answers stay on this
        device until you see the results.
      </p>
    </div>
  );
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

function painPointGroups(industrySlug: string) {
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

function integrationGroups(industrySlug: string) {
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
  title,
  why
}: {
  children: ReactNode;
  title: string;
  why: string;
}) {
  return (
    <div>
      <h2 className="text-2xl font-semibold leading-tight text-ink md:text-3xl">
        {title}
      </h2>
      <p className="mt-2 text-sm leading-6 text-ink/58">{why}</p>
      <div className="mt-6">{children}</div>
    </div>
  );
}

function ChoiceCard({
  hint,
  label,
  onSelect,
  selected
}: {
  hint?: string;
  label: string;
  onSelect: () => void;
  selected: boolean;
}) {
  return (
    <button
      aria-pressed={selected}
      className="choice-card"
      data-selected={selected ? "true" : undefined}
      onClick={onSelect}
      type="button"
    >
      <span className="choice-card-check" aria-hidden="true">
        {selected ? <Check size={14} strokeWidth={3} /> : null}
      </span>
      <span className="min-w-0">
        <span className="block font-semibold leading-5">{label}</span>
        {hint ? (
          <span className="mt-1 block text-xs leading-5 text-ink/55">{hint}</span>
        ) : null}
      </span>
    </button>
  );
}

function ChoiceGrid<T extends string>({
  choices,
  onSelect,
  selected
}: {
  choices: WizardChoice<T>[];
  onSelect: (value: T) => void;
  selected?: T;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {choices.map((choice) => (
        <ChoiceCard
          hint={choice.hint}
          key={choice.value}
          label={choice.label}
          onSelect={() => onSelect(choice.value)}
          selected={selected === choice.value}
        />
      ))}
    </div>
  );
}

function MultiChoiceGrid({
  choices,
  max,
  onChange,
  selected
}: {
  choices: Array<{ value: string; label: string }>;
  max: number;
  onChange: (values: string[]) => void;
  selected: string[];
}) {
  const atLimit = selected.length >= max;

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {choices.map((choice) => {
        const isSelected = selected.includes(choice.value);
        const disabled = !isSelected && atLimit;

        return (
          <button
            aria-pressed={isSelected}
            className="choice-card"
            data-selected={isSelected ? "true" : undefined}
            disabled={disabled}
            key={choice.value}
            onClick={() =>
              onChange(
                isSelected
                  ? selected.filter((value) => value !== choice.value)
                  : [...selected, choice.value]
              )
            }
            type="button"
          >
            <span className="choice-card-check" aria-hidden="true">
              {isSelected ? <Check size={14} strokeWidth={3} /> : null}
            </span>
            <span className="font-semibold leading-5">{choice.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function GroupedMultiChoice({
  groups,
  max,
  onChange,
  selected
}: {
  groups: Array<{ label: string; choices: Array<{ value: string; label: string }> }>;
  max: number;
  onChange: (values: string[]) => void;
  selected: string[];
}) {
  return (
    <div className="grid gap-5">
      {groups.map((group) => (
        <div key={group.label || "all"}>
          {group.label ? (
            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-accent">
              {group.label}
            </p>
          ) : null}
          <MultiChoiceGrid
            choices={group.choices}
            max={max}
            onChange={onChange}
            selected={selected}
          />
        </div>
      ))}
      <p className="text-xs text-ink/45">
        {selected.length} of {max} selected
      </p>
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
    <div className="mb-5 last:mb-0">
      <p className="text-sm font-semibold text-ink/72">{label}</p>
      <div className="mt-2 grid gap-2 sm:grid-cols-3" role="group" aria-label={label}>
        {choices.map((choice) => (
          <button
            aria-pressed={selected === choice.value}
            className="choice-card choice-card-compact"
            data-selected={selected === choice.value ? "true" : undefined}
            key={choice.value}
            onClick={() => onSelect(choice.value)}
            type="button"
          >
            <span className="min-w-0">
              <span className="block font-semibold leading-5">{choice.label}</span>
              {choice.hint ? (
                <span className="mt-0.5 block text-xs leading-5 text-ink/55">
                  {choice.hint}
                </span>
              ) : null}
            </span>
          </button>
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
      label: "Pain points",
      value: `${draft.painPoints?.length ?? 0} selected`,
      step: "painPoints"
    }
  ];

  return (
    <div className="mt-6 rounded-2xl border border-line/60 bg-white/60 p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-ink/50">
        Quick check
      </p>
      <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
        {rows.map((row) => (
          <div
            className="flex items-start justify-between gap-3 rounded-lg border border-line/50 bg-white/70 px-3 py-2"
            key={row.label}
          >
            <div className="min-w-0">
              <dt className="text-xs font-semibold uppercase text-ink/45">
                {row.label}
              </dt>
              <dd className="truncate font-medium">{row.value}</dd>
            </div>
            <button
              className="shrink-0 text-xs font-bold text-accent"
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
