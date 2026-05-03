import {
  auditBudgetRanges,
  auditCompanySizes,
  auditDataSensitivityLevels,
  auditGoalOptions,
  auditPainPointOptions,
  auditTechnicalComfortLevels,
  auditUrgencyLevels,
  type AuditBudgetRange,
  type AuditCompanySize,
  type AuditDataSensitivity,
  type AuditGoalId,
  type AuditInput,
  type AuditPainPointId,
  type AuditTechnicalComfort,
  type AuditUrgency
} from "@/shared/recommendations/audit";

type SearchParams = Record<string, string | string[] | undefined>;

export function parseAuditInput(searchParams: SearchParams): AuditInput | null {
  const industrySlug = getSingle(searchParams.industry);
  const businessFunctionSlug = getSingle(searchParams.function);

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
    existingTools: getSingle(searchParams.tools)
  };
}

function getSingle(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
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

export function urgencyLabel(value: AuditUrgency) {
  return {
    exploring: "Exploring",
    soon: "Soon",
    urgent: "Urgent"
  }[value];
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
