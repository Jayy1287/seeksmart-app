export const auditCompanySizes = [
  "solo",
  "small-team",
  "growing-company",
  "mid-market"
] as const;

export const auditBudgetRanges = [
  "low",
  "moderate",
  "flexible"
] as const;

export const auditTechnicalComfortLevels = [
  "low",
  "moderate",
  "high"
] as const;

export const auditDataSensitivityLevels = [
  "low",
  "moderate",
  "high"
] as const;

export const auditUrgencyLevels = [
  "exploring",
  "soon",
  "urgent"
] as const;

export const auditGoalOptions = [
  {
    id: "save-time",
    label: "Save team time",
    keywords: ["faster", "less manual", "time", "turnaround", "speed"]
  },
  {
    id: "increase-revenue",
    label: "Increase revenue",
    keywords: ["lead", "sales", "booking", "conversion", "win rate"]
  },
  {
    id: "improve-quality",
    label: "Improve quality",
    keywords: ["consistent", "quality", "review", "accuracy", "clarity"]
  },
  {
    id: "reduce-risk",
    label: "Reduce operational risk",
    keywords: ["risk", "errors", "policy", "review", "compliance"]
  },
  {
    id: "scale-output",
    label: "Scale content or output",
    keywords: ["content", "assets", "publishing", "production", "output"]
  }
] as const;

export const auditPainPointOptions = [
  {
    id: "manual-work",
    label: "Too much repetitive manual work",
    keywords: ["manual", "repetitive", "copy-paste", "handoff", "routing"]
  },
  {
    id: "slow-response",
    label: "Slow response or turnaround time",
    keywords: ["slow", "response", "follow-up", "turnaround", "speed"]
  },
  {
    id: "inconsistent-output",
    label: "Inconsistent quality or messaging",
    keywords: ["inconsistent", "quality", "messaging", "brand", "structure"]
  },
  {
    id: "scattered-knowledge",
    label: "Knowledge is scattered",
    keywords: ["knowledge", "documents", "questions", "onboarding", "notes"]
  },
  {
    id: "hard-to-prioritize",
    label: "Hard to know what to improve first",
    keywords: ["prioritize", "decision", "opportunity", "workflow", "starting"]
  }
] as const;

export type AuditCompanySize = (typeof auditCompanySizes)[number];
export type AuditBudgetRange = (typeof auditBudgetRanges)[number];
export type AuditTechnicalComfort =
  (typeof auditTechnicalComfortLevels)[number];
export type AuditDataSensitivity =
  (typeof auditDataSensitivityLevels)[number];
export type AuditUrgency = (typeof auditUrgencyLevels)[number];
export type AuditGoalId = (typeof auditGoalOptions)[number]["id"];
export type AuditPainPointId = (typeof auditPainPointOptions)[number]["id"];

export type AuditInput = {
  industrySlug: string;
  companySize: AuditCompanySize;
  businessFunctionSlug: string;
  goals: AuditGoalId[];
  painPoints: AuditPainPointId[];
  budgetRange: AuditBudgetRange;
  technicalComfort: AuditTechnicalComfort;
  dataSensitivity: AuditDataSensitivity;
  urgency: AuditUrgency;
  existingTools?: string;
};

export type AuditToolRecommendation = {
  id: string;
  name: string;
  slug: string;
  categoryName: string;
  pricingType: string;
  hasFreePlan: boolean;
  fitScore: number;
  reason: string;
  bestFor: string | null;
  limitation: string | null;
};

export type AuditUseCaseRecommendation = {
  id: string;
  name: string;
  slug: string;
  outcome: string | null;
  effortLevel: string;
  riskLevel: string;
  timeToValue: string | null;
};

export type AuditOpportunityRecommendation = {
  id: string;
  name: string;
  slug: string;
  businessFunctionName: string | null;
  score: number;
  impactScore: number;
  effortScore: number;
  riskScore: number;
  confidenceScore: number;
  fitLabel: "Best fit" | "Strong fit" | "Good fit" | "Use with caution";
  description: string | null;
  painPoint: string | null;
  expectedBenefit: string | null;
  startingPoint: string | null;
  effortLevel: string;
  riskLevel: string;
  timeToValue: string | null;
  reasons: string[];
  cautions: string[];
  successMetrics: string[];
  useCases: AuditUseCaseRecommendation[];
  tools: AuditToolRecommendation[];
};

export type AuditResult = {
  version: string;
  input: AuditInput;
  summary: {
    industryName: string;
    businessFunctionName: string;
    firstWorkflow: string;
    overallCaution: string;
  };
  topOpportunities: AuditOpportunityRecommendation[];
  nextStepChecklist: string[];
};
