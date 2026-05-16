import {
  auditBudgetRanges,
  auditCompanySizes,
  auditDataSensitivityLevels,
  auditDataReadinessLevels,
  auditDecisionOwnerTypes,
  auditApprovalModes,
  auditGoalOptions,
  auditIntegrationNeeds,
  auditPainPointOptions,
  auditTechnicalComfortLevels,
  auditUrgencyLevels,
  auditWorkflowVolumes,
  auditWorkflowMaturityLevels,
  type AuditApprovalMode,
  type AuditBudgetRange,
  type AuditCompanySize,
  type AuditDataSensitivity,
  type AuditDataReadiness,
  type AuditDecisionOwner,
  type AuditGoalId,
  type AuditInput,
  type AuditIntegrationNeedId,
  type AuditPainPointId,
  type AuditTechnicalComfort,
  type AuditUrgency,
  type AuditWorkflowVolume,
  type AuditWorkflowMaturity
} from "@/shared/recommendations/audit";

type SearchParams = Record<string, string | string[] | undefined>;

export function parseAuditInput(searchParams: SearchParams): AuditInput | null {
  const industrySlug = getBoundedText(getSingle(searchParams.industry), 120);
  const businessFunctionSlug = getBoundedText(
    getSingle(searchParams.function),
    120
  );

  if (!industrySlug || !businessFunctionSlug) {
    return null;
  }

  return {
    industrySlug,
    businessFunctionSlug,
    companySize: parseEnum(
      getSingle(searchParams.size),
      auditCompanySizes,
      "small-team"
    ),
    goals: parseMultiEnum(
      searchParams.goals,
      auditGoalOptions.map((option) => option.id),
      ["save-time"]
    ),
    painPoints: parseMultiEnum(
      searchParams.pain,
      auditPainPointOptions.map((option) => option.id),
      ["manual-work"]
    ),
    budgetRange: parseEnum(
      getSingle(searchParams.budget),
      auditBudgetRanges,
      "moderate"
    ),
    technicalComfort: parseEnum(
      getSingle(searchParams.technical),
      auditTechnicalComfortLevels,
      "moderate"
    ),
    dataSensitivity: parseEnum(
      getSingle(searchParams.data),
      auditDataSensitivityLevels,
      "moderate"
    ),
    urgency: parseEnum(getSingle(searchParams.urgency), auditUrgencyLevels, "soon"),
    workflowMaturity: parseEnum(
      getSingle(searchParams.maturity),
      auditWorkflowMaturityLevels,
      "documented"
    ),
    approvalMode: parseEnum(
      getSingle(searchParams.approval),
      auditApprovalModes,
      "owner-review"
    ),
    integrationNeeds: parseMultiEnum(
      searchParams.integrations,
      auditIntegrationNeeds.map((option) => option.id),
      []
    ),
    workflowVolume: parseEnum(
      getSingle(searchParams.volume),
      auditWorkflowVolumes,
      "weekly"
    ),
    dataReadiness: parseEnum(
      getSingle(searchParams.readiness),
      auditDataReadinessLevels,
      "accessible"
    ),
    decisionOwner: parseEnum(
      getSingle(searchParams.owner),
      auditDecisionOwnerTypes,
      "single-owner"
    ),
    pilotTimeline:
      getBoundedText(getSingle(searchParams.timeline), 80) || "2 weeks",
    successMetric: getBoundedText(getSingle(searchParams.metric), 160),
    existingTools: getBoundedText(getSingle(searchParams.tools), 1200)
  };
}

function getSingle(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function getBoundedText(value: string | undefined, maxLength: number) {
  const trimmed = value?.trim();

  if (!trimmed) {
    return undefined;
  }

  return trimmed.slice(0, maxLength);
}

function parseEnum<T extends string>(
  value: string | undefined,
  allowed: readonly T[],
  fallback: T
) {
  return allowed.includes(value as T) ? (value as T) : fallback;
}

function parseMultiEnum<T extends string>(
  value: string | string[] | undefined,
  allowed: readonly T[],
  fallback: T[]
) {
  const values = Array.isArray(value) ? value : value ? [value] : [];
  const parsed = values.filter((item): item is T => allowed.includes(item as T));
  return parsed.length > 0 ? parsed : fallback;
}

export function companySizeLabel(value: AuditCompanySize) {
  return {
    solo: "Solo operator",
    "small-team": "Small team",
    "growing-company": "Growing company",
    "mid-market": "Mid-market"
  }[value];
}

export function budgetRangeLabel(value: AuditBudgetRange) {
  return {
    low: "Low budget",
    moderate: "Moderate budget",
    flexible: "Flexible budget"
  }[value];
}

export function technicalComfortLabel(value: AuditTechnicalComfort) {
  return {
    low: "Low technical comfort",
    moderate: "Moderate technical comfort",
    high: "High technical comfort"
  }[value];
}

export function dataSensitivityLabel(value: AuditDataSensitivity) {
  return {
    low: "Low data sensitivity",
    moderate: "Moderate data sensitivity",
    high: "High data sensitivity"
  }[value];
}

export function workflowVolumeLabel(value: AuditWorkflowVolume) {
  return {
    occasional: "Occasional workflow",
    weekly: "Weekly recurring workflow",
    daily: "Daily or high-volume workflow"
  }[value];
}

export function dataReadinessLabel(value: AuditDataReadiness) {
  return {
    scattered: "Scattered or hard to access",
    accessible: "Available but needs cleanup",
    trusted: "Trusted and well organized"
  }[value];
}

export function decisionOwnerLabel(value: AuditDecisionOwner) {
  return {
    "single-owner": "One accountable owner",
    "small-group": "Small approval group",
    "cross-functional": "Cross-functional decision"
  }[value];
}

export function urgencyLabel(value: AuditUrgency) {
  return {
    exploring: "Exploring",
    soon: "Soon",
    urgent: "Urgent"
  }[value];
}

export function workflowMaturityLabel(value: AuditWorkflowMaturity) {
  return {
    undefined: "Not documented yet",
    documented: "Documented but inconsistent",
    measured: "Measured and repeatable"
  }[value];
}

export function approvalModeLabel(value: AuditApprovalMode) {
  return {
    "owner-review": "Single owner review",
    "team-review": "Team approval before rollout",
    automated: "Ready for supervised automation"
  }[value];
}

export function integrationNeedLabel(value: AuditIntegrationNeedId) {
  return (
    auditIntegrationNeeds.find((option) => option.id === value)?.label ?? value
  );
}

export function goalLabel(value: AuditGoalId) {
  return (
    auditGoalOptions.find((option) => option.id === value)?.label ?? value
  );
}

export function painPointLabel(value: AuditPainPointId) {
  return (
    auditPainPointOptions.find((option) => option.id === value)?.label ?? value
  );
}
