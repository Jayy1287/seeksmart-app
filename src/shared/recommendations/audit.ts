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

export const auditWorkflowMaturityLevels = [
  "undefined",
  "documented",
  "measured"
] as const;

export const auditApprovalModes = [
  "owner-review",
  "team-review",
  "automated"
] as const;

export const auditIntegrationNeeds = [
  {
    id: "docs",
    label: "Docs or knowledge base",
    keywords: ["knowledge", "documents", "docs", "onboarding", "notes"]
  },
  {
    id: "crm",
    label: "CRM or sales tools",
    keywords: ["lead", "sales", "crm", "outreach", "pipeline"]
  },
  {
    id: "helpdesk",
    label: "Help desk or support inbox",
    keywords: ["support", "ticket", "customer", "response", "handoff"]
  },
  {
    id: "spreadsheets",
    label: "Spreadsheets or reports",
    keywords: ["spreadsheet", "report", "data", "analysis", "invoice"]
  },
  {
    id: "content",
    label: "Content or design tools",
    keywords: ["content", "brand", "video", "image", "publishing"]
  },
  {
    id: "code",
    label: "Code or product tools",
    keywords: ["code", "prototype", "app", "engineering", "release"]
  },
  {
    id: "contracts",
    label: "Contracts or legal docs",
    keywords: ["contract", "legal", "clause", "agreement", "obligation", "review"]
  },
  {
    id: "bi",
    label: "BI or analytics platform",
    keywords: ["dashboard", "bi", "metric", "analytics", "insight", "report"]
  },
  {
    id: "research",
    label: "Research databases or literature",
    keywords: ["research", "paper", "evidence", "market", "diligence", "source"]
  },
  {
    id: "learning",
    label: "Learning or enablement system",
    keywords: ["learning", "training", "enablement", "course", "onboarding"]
  },
  {
    id: "compliance",
    label: "Compliance or audit systems",
    keywords: ["compliance", "audit", "evidence", "policy", "risk", "control"]
  },
  {
    id: "warehouse",
    label: "Data warehouse or database",
    keywords: ["warehouse", "database", "sql", "data", "semantic", "model"]
  },
  {
    id: "ats",
    label: "ATS or recruiting platform",
    keywords: ["ats", "recruiting", "candidate", "interview", "job", "talent"]
  },
  {
    id: "finance",
    label: "Finance, AP, or ERP system",
    keywords: ["finance", "erp", "invoice", "spend", "ap", "budget", "forecast"]
  },
  {
    id: "security",
    label: "Security or developer workflow",
    keywords: ["security", "vulnerability", "code", "dependency", "scan", "review"]
  },
  {
    id: "localization",
    label: "Localization or media workflow",
    keywords: ["translation", "localization", "dubbing", "voice", "video", "language"]
  }
] as const;

export const auditWorkflowVolumes = [
  "occasional",
  "weekly",
  "daily"
] as const;

export const auditDataReadinessLevels = [
  "scattered",
  "accessible",
  "trusted"
] as const;

export const auditDecisionOwnerTypes = [
  "single-owner",
  "small-group",
  "cross-functional"
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
  },
  {
    id: "improve-decisions",
    label: "Improve decision quality",
    keywords: ["decision", "evidence", "research", "insight", "confidence"]
  },
  {
    id: "strengthen-governance",
    label: "Strengthen governance or compliance",
    keywords: ["governance", "compliance", "controls", "audit", "risk"]
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
  },
  {
    id: "slow-research",
    label: "Research takes too long",
    keywords: ["research", "market", "evidence", "sources", "diligence"]
  },
  {
    id: "manual-reporting",
    label: "Reporting and analysis are too manual",
    keywords: ["report", "dashboard", "manual", "analysis", "metric"]
  },
  {
    id: "contract-bottlenecks",
    label: "Contracts or approvals slow things down",
    keywords: ["contract", "legal", "approval", "clause", "obligation"]
  },
  {
    id: "data-silos",
    label: "Data and knowledge sit in too many systems",
    keywords: ["silo", "systems", "knowledge", "data", "search"]
  },
  {
    id: "compliance-evidence",
    label: "Compliance evidence is hard to collect",
    keywords: ["compliance", "audit", "evidence", "control", "policy"]
  },
  {
    id: "hiring-admin",
    label: "Hiring or HR admin is slow",
    keywords: ["hiring", "recruiting", "candidate", "interview", "talent"]
  },
  {
    id: "finance-admin",
    label: "Finance documents and reporting are too manual",
    keywords: ["finance", "invoice", "spend", "budget", "forecast"]
  },
  {
    id: "security-review-bottlenecks",
    label: "Security or compliance review slows delivery",
    keywords: ["security", "vulnerability", "compliance", "review", "control"]
  },
  {
    id: "localization-bottlenecks",
    label: "Localization and media production are bottlenecks",
    keywords: ["localization", "translation", "dubbing", "video", "voice"]
  }
] as const;

export type AuditCompanySize = (typeof auditCompanySizes)[number];
export type AuditBudgetRange = (typeof auditBudgetRanges)[number];
export type AuditTechnicalComfort =
  (typeof auditTechnicalComfortLevels)[number];
export type AuditDataSensitivity =
  (typeof auditDataSensitivityLevels)[number];
export type AuditUrgency = (typeof auditUrgencyLevels)[number];
export type AuditWorkflowMaturity =
  (typeof auditWorkflowMaturityLevels)[number];
export type AuditApprovalMode = (typeof auditApprovalModes)[number];
export type AuditIntegrationNeedId =
  (typeof auditIntegrationNeeds)[number]["id"];
export type AuditWorkflowVolume = (typeof auditWorkflowVolumes)[number];
export type AuditDataReadiness = (typeof auditDataReadinessLevels)[number];
export type AuditDecisionOwner = (typeof auditDecisionOwnerTypes)[number];
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
  workflowMaturity: AuditWorkflowMaturity;
  approvalMode: AuditApprovalMode;
  integrationNeeds: AuditIntegrationNeedId[];
  workflowVolume: AuditWorkflowVolume;
  dataReadiness: AuditDataReadiness;
  decisionOwner: AuditDecisionOwner;
  pilotTimeline: string;
  successMetric?: string;
  existingTools?: string;
};

export type AuditToolRecommendation = {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  categoryName: string;
  pricingType: string;
  hasFreePlan: boolean;
  fitScore: number;
  reason: string;
  bestFor: string | null;
  limitation: string | null;
};

export type AuditPilotPlan = {
  title: string;
  owner: string;
  timeline: string;
  successMetric: string;
  baselineQuestion: string;
  target: string;
  guardrails: string[];
  weekOneActions: string[];
  expansionCriteria: string[];
};

export type AuditReadinessAssessment = {
  score: number;
  level: "Pilot-ready" | "Prepare first" | "Discovery first";
  summary: string;
  strengths: string[];
  risks: string[];
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
    executiveBrief: string;
    automationPosture: string;
    overallCaution: string;
  };
  readiness: AuditReadinessAssessment;
  topOpportunities: AuditOpportunityRecommendation[];
  pilotPlan: AuditPilotPlan;
  nextStepChecklist: string[];
};
