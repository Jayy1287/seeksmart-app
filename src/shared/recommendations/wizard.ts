import {
  auditGoalOptions,
  auditIntegrationNeeds,
  auditPainPointOptions,
  type AuditBudgetRange,
  type AuditCompanySize,
  type AuditDataSensitivity,
  type AuditGoalId,
  type AuditInput,
  type AuditIntegrationNeedId,
  type AuditPainPointId,
  type AuditTechnicalComfort,
  type AuditUrgency,
  type AuditWorkflowVolume
} from "@/shared/recommendations/audit";

// The audit wizard asks fewer, plainer questions than the rules engine
// consumes. This module defines the wizard vocabulary and the mapping down to
// the engine's AuditInput so the scoring rules stay untouched.

export const auditProcessClarityLevels = [
  "undocumented",
  "documented",
  "measured"
] as const;

export const auditSignOffModes = [
  "single-owner",
  "small-group",
  "cross-functional",
  "single-owner-automated"
] as const;

export type AuditProcessClarity = (typeof auditProcessClarityLevels)[number];
export type AuditSignOffMode = (typeof auditSignOffModes)[number];

export type AuditWizardAnswers = {
  industrySlug: string;
  companySize: AuditCompanySize;
  businessFunctionSlug: string;
  goals: AuditGoalId[];
  painPoints: AuditPainPointId[];
  integrationNeeds: AuditIntegrationNeedId[];
  processClarity: AuditProcessClarity;
  signOff: AuditSignOffMode;
  budgetRange: AuditBudgetRange;
  technicalComfort: AuditTechnicalComfort;
  dataSensitivity: AuditDataSensitivity;
  workflowVolume: AuditWorkflowVolume;
  urgency: AuditUrgency;
  successMetric?: string;
};

export const auditWizardLimits = {
  maxGoals: 3,
  maxPainPoints: 4,
  maxIntegrationNeeds: 6,
  maxSuccessMetricLength: 160
} as const;

export type WizardChoice<T extends string> = {
  value: T;
  label: string;
  hint?: string;
};

export const companySizeChoices: WizardChoice<AuditCompanySize>[] = [
  { value: "solo", label: "Just me", hint: "Solo operator or founder" },
  { value: "small-team", label: "2 to 10 people", hint: "Small team, one or two functions" },
  { value: "growing-company", label: "11 to 50 people", hint: "Growing company with defined teams" },
  { value: "mid-market", label: "50+ people", hint: "Mid-market, several departments" }
];

export const processClarityChoices: WizardChoice<AuditProcessClarity>[] = [
  {
    value: "undocumented",
    label: "In people's heads",
    hint: "Nothing written down; examples are scattered across inboxes and chats"
  },
  {
    value: "documented",
    label: "Written down, a bit messy",
    hint: "There is a process doc and examples exist, but quality varies"
  },
  {
    value: "measured",
    label: "Documented and measured",
    hint: "Clear steps, clean examples, and a number we already track"
  }
];

export const signOffChoices: WizardChoice<AuditSignOffMode>[] = [
  {
    value: "single-owner",
    label: "One person checks the output",
    hint: "A single owner reviews what AI produces before it is used"
  },
  {
    value: "small-group",
    label: "A small team reviews first",
    hint: "Two or three people approve before rollout"
  },
  {
    value: "cross-functional",
    label: "Several teams must agree",
    hint: "Cross-functional sign-off, for example ops plus legal"
  },
  {
    value: "single-owner-automated",
    label: "One owner, ready to automate",
    hint: "Approved low-risk steps can run without a human each time"
  }
];

export const budgetChoices: WizardChoice<AuditBudgetRange>[] = [
  { value: "low", label: "Free or very low", hint: "Under about $50 a month" },
  { value: "moderate", label: "Moderate", hint: "A few hundred a month is fine if it works" },
  { value: "flexible", label: "Flexible", hint: "Budget follows the business case" }
];

export const technicalComfortChoices: WizardChoice<AuditTechnicalComfort>[] = [
  { value: "low", label: "Keep it no-code", hint: "We want settings, not scripts" },
  { value: "moderate", label: "Comfortable with setup", hint: "We can connect tools and follow docs" },
  { value: "high", label: "Technical team", hint: "APIs and scripts are fine" }
];

export const dataSensitivityChoices: WizardChoice<AuditDataSensitivity>[] = [
  { value: "low", label: "Mostly public or internal", hint: "Marketing copy, generic docs" },
  { value: "moderate", label: "Some customer data", hint: "Names, orders, support history" },
  { value: "high", label: "Sensitive or regulated", hint: "Payments, health, legal, HR records" }
];

export const workflowVolumeChoices: WizardChoice<AuditWorkflowVolume>[] = [
  { value: "occasional", label: "A few times a month" },
  { value: "weekly", label: "Every week" },
  { value: "daily", label: "Every day, many times" }
];

export const urgencyChoices: WizardChoice<AuditUrgency>[] = [
  { value: "exploring", label: "Just exploring" },
  { value: "soon", label: "In the next few months" },
  { value: "urgent", label: "This quarter, it hurts now" }
];

// Industries where the questionnaire has specific guidance. These are shown
// first in the industry step, with their most relevant pain points and
// systems grouped at the top of later steps.
export const featuredIndustries: Array<{
  slug: string;
  label: string;
  hint: string;
  painPoints: AuditPainPointId[];
  integrationNeeds: AuditIntegrationNeedId[];
  examplePrompt: string;
}> = [
  {
    slug: "ecommerce",
    label: "Online store",
    hint: "Shopify, WooCommerce, marketplaces",
    painPoints: ["slow-response", "manual-work", "inconsistent-output", "manual-reporting", "scattered-knowledge"],
    integrationNeeds: ["helpdesk", "content", "spreadsheets", "crm", "docs"],
    examplePrompt: "Product descriptions, support replies, returns, and reporting are the usual first wins."
  },
  {
    slug: "retail-and-hospitality",
    label: "Shop, restaurant, or venue",
    hint: "Local retail, cafes, hospitality",
    painPoints: ["slow-response", "manual-work", "inconsistent-output", "manual-reporting", "hiring-admin"],
    integrationNeeds: ["helpdesk", "content", "spreadsheets", "finance", "crm"],
    examplePrompt: "Review replies, local marketing, rota and admin, and weekly reporting come up most."
  },
  {
    slug: "local-services",
    label: "Local service business",
    hint: "Trades, clinics, salons, agencies",
    painPoints: ["slow-response", "manual-work", "inconsistent-output", "hard-to-prioritize", "finance-admin"],
    integrationNeeds: ["crm", "helpdesk", "content", "spreadsheets", "finance"],
    examplePrompt: "Lead follow-up speed, quotes and proposals, review responses, and invoicing admin."
  }
];

export function getFeaturedIndustry(slug: string) {
  return featuredIndustries.find((industry) => industry.slug === slug) ?? null;
}

export function orderPainPointsForIndustry(industrySlug: string) {
  const featured = getFeaturedIndustry(industrySlug);
  const priority = featured ? new Set<string>(featured.painPoints) : new Set<string>();
  const common = auditPainPointOptions.filter((option) => priority.has(option.id));
  const other = auditPainPointOptions.filter((option) => !priority.has(option.id));

  return { common, other };
}

export function orderIntegrationsForIndustry(industrySlug: string) {
  const featured = getFeaturedIndustry(industrySlug);
  const priority = featured ? new Set<string>(featured.integrationNeeds) : new Set<string>();
  const common = auditIntegrationNeeds.filter((option) => priority.has(option.id));
  const other = auditIntegrationNeeds.filter((option) => !priority.has(option.id));

  return { common, other };
}

export const goalChoices = auditGoalOptions;

export function toAuditInput(answers: AuditWizardAnswers): AuditInput {
  const maturityByClarity = {
    undocumented: "undefined",
    documented: "documented",
    measured: "measured"
  } as const;
  const readinessByClarity = {
    undocumented: "scattered",
    documented: "accessible",
    measured: "trusted"
  } as const;
  const ownerBySignOff = {
    "single-owner": "single-owner",
    "small-group": "small-group",
    "cross-functional": "cross-functional",
    "single-owner-automated": "single-owner"
  } as const;
  const approvalBySignOff = {
    "single-owner": "owner-review",
    "small-group": "team-review",
    "cross-functional": "team-review",
    "single-owner-automated": "automated"
  } as const;

  return {
    industrySlug: answers.industrySlug,
    companySize: answers.companySize,
    businessFunctionSlug: answers.businessFunctionSlug,
    goals: answers.goals,
    painPoints: answers.painPoints,
    budgetRange: answers.budgetRange,
    technicalComfort: answers.technicalComfort,
    dataSensitivity: answers.dataSensitivity,
    urgency: answers.urgency,
    workflowMaturity: maturityByClarity[answers.processClarity],
    approvalMode: approvalBySignOff[answers.signOff],
    integrationNeeds: answers.integrationNeeds,
    workflowVolume: answers.workflowVolume,
    dataReadiness: readinessByClarity[answers.processClarity],
    decisionOwner: ownerBySignOff[answers.signOff],
    pilotTimeline: "2 weeks",
    successMetric: answers.successMetric?.trim() || undefined
  };
}
