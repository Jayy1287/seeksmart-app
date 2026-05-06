import {
  auditGoalOptions,
  auditIntegrationNeeds,
  auditPainPointOptions,
  type AuditInput,
  type AuditOpportunityRecommendation,
  type AuditPilotPlan,
  type AuditReadinessAssessment,
  type AuditResult,
  type AuditToolRecommendation,
  type AuditUseCaseRecommendation
} from "@/shared/recommendations/audit";

export const AUDIT_RULE_VERSION = "audit-rules-v2.1";

export type AuditDataset = {
  industries: Array<{
    id: string;
    name: string;
    slug: string;
    cautions: string | null;
  }>;
  businessFunctions: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  opportunities: Array<{
    id: string;
    name: string;
    slug: string;
    description: string | null;
    painPoint: string | null;
    expectedBenefit: string | null;
    startingPoint: string | null;
    effortLevel: string;
    riskLevel: string;
    timeToValue: string | null;
    successMetrics: string[];
    businessFunction: {
      id: string;
      name: string;
      slug: string;
    } | null;
    industries: Array<{
      id: string;
      name: string;
      slug: string;
      priority: number;
    }>;
    useCases: Array<
      AuditUseCaseRecommendation & {
        toolFits: AuditDatasetToolFit[];
      }
    >;
  }>;
};

export type AuditDatasetToolFit = {
  fitScore: number;
  recommendationNote: string | null;
  bestFor: string | null;
  limitations: string | null;
  pricingSuitability: string | null;
  tool: {
    id: string;
    name: string;
    slug: string;
    logoUrl: string | null;
    pricingType: string;
    hasFreePlan: boolean;
    popularityScore: number;
    isVerified: boolean;
    category: {
      name: string;
    };
  };
};

const effortWeights: Record<string, number> = {
  LOW: 92,
  MEDIUM: 72,
  HIGH: 46
};

const riskWeights: Record<string, number> = {
  LOW: 92,
  MEDIUM: 70,
  HIGH: 38
};

export function scoreAudit(
  input: AuditInput,
  dataset: AuditDataset
): AuditResult {
  const industry = dataset.industries.find(
    (item) => item.slug === input.industrySlug
  );
  const businessFunction = dataset.businessFunctions.find(
    (item) => item.slug === input.businessFunctionSlug
  );

  const scoredOpportunities = dataset.opportunities
    .map((opportunity) =>
      scoreOpportunity({
        opportunity,
        input,
        selectedIndustrySlug: industry?.slug,
        selectedFunctionSlug: businessFunction?.slug
      })
    )
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const firstOpportunity = scoredOpportunities[0];
  const firstUseCase = firstOpportunity?.useCases[0];
  const firstWorkflow = firstUseCase
    ? `${firstOpportunity.name}: start with ${firstUseCase.name.toLowerCase()}.`
    : firstOpportunity?.name ?? "Complete the audit questions to get a plan.";
  const pilotPlan = buildPilotPlan(firstOpportunity, input);
  const readiness = buildReadinessAssessment(input, firstOpportunity);

  return {
    version: AUDIT_RULE_VERSION,
    input,
    summary: {
      industryName: industry?.name ?? "Selected industry",
      businessFunctionName: businessFunction?.name ?? "Selected function",
      firstWorkflow,
      executiveBrief: buildExecutiveBrief(firstOpportunity, input),
      automationPosture: buildAutomationPosture(input, firstOpportunity),
      overallCaution: buildOverallCaution(input, industry?.cautions ?? null)
    },
    readiness,
    topOpportunities: scoredOpportunities,
    pilotPlan,
    nextStepChecklist: buildChecklist(scoredOpportunities[0], input)
  };
}

function scoreOpportunity({
  opportunity,
  input,
  selectedIndustrySlug,
  selectedFunctionSlug
}: {
  opportunity: AuditDataset["opportunities"][number];
  input: AuditInput;
  selectedIndustrySlug?: string;
  selectedFunctionSlug?: string;
}): AuditOpportunityRecommendation {
  const reasons: string[] = [];
  const cautions: string[] = [];
  const opportunityText = normalize(
    [
      opportunity.name,
      opportunity.description,
      opportunity.painPoint,
      opportunity.expectedBenefit,
      opportunity.startingPoint,
      opportunity.businessFunction?.name,
      opportunity.useCases.map((useCase) => useCase.name).join(" "),
      opportunity.useCases.map((useCase) => useCase.outcome ?? "").join(" ")
    ].join(" ")
  );
  const requestedIntegrationText = normalize(
    auditIntegrationNeeds
      .filter((need) => input.integrationNeeds.includes(need.id))
      .flatMap((need) => [need.label, ...need.keywords])
      .join(" ")
  );
  const functionMismatch =
    Boolean(selectedFunctionSlug) &&
    Boolean(opportunity.businessFunction?.slug) &&
    opportunity.businessFunction?.slug !== selectedFunctionSlug;

  let impactScore = 42;
  const industryMatch = opportunity.industries.find(
    (industry) => industry.slug === selectedIndustrySlug
  );
  if (industryMatch) {
    impactScore += Math.max(12, 24 - industryMatch.priority * 3);
    reasons.push("Matches your selected industry.");
  }

  if (opportunity.businessFunction?.slug === selectedFunctionSlug) {
    impactScore += 18;
    reasons.push("Matches the team function you want to improve.");
  } else if (functionMismatch) {
    impactScore -= 14;
  }

  const goalHits = auditGoalOptions.filter((goal) =>
    input.goals.includes(goal.id)
      ? goal.keywords.some((keyword) => opportunityText.includes(keyword))
      : false
  );
  if (goalHits.length > 0) {
    impactScore += Math.min(goalHits.length * 8, 18);
    reasons.push(
      `Aligned to your goal: ${goalHits.map((goal) => goal.label).join(", ")}.`
    );
  }

  const painHits = auditPainPointOptions.filter((painPoint) =>
    input.painPoints.includes(painPoint.id)
      ? painPoint.keywords.some((keyword) => opportunityText.includes(keyword))
      : false
  );
  if (painHits.length > 0) {
    impactScore += Math.min(painHits.length * 9, 20);
    reasons.push(
      `Directly addresses: ${painHits
        .map((painPoint) => painPoint.label.toLowerCase())
        .join(", ")}.`
    );
  }

  const integrationHits = auditIntegrationNeeds.filter((need) =>
    input.integrationNeeds.includes(need.id)
      ? need.keywords.some((keyword) => opportunityText.includes(keyword))
      : false
  );
  if (integrationHits.length > 0) {
    impactScore += Math.min(integrationHits.length * 7, 16);
    reasons.push(
      `Fits requested systems: ${integrationHits
        .map((need) => need.label.toLowerCase())
        .join(", ")}.`
    );
  } else if (requestedIntegrationText && opportunityText.includes("workflow")) {
    impactScore += 3;
  }

  if (input.urgency === "urgent") {
    impactScore += opportunity.timeToValue?.includes("1") ? 8 : 3;
  } else if (input.urgency === "soon") {
    impactScore += 4;
  }
  if (input.workflowVolume === "daily") {
    impactScore += 6;
    reasons.push("High workflow volume improves the likely business return.");
  } else if (input.workflowVolume === "weekly") {
    impactScore += 4;
  } else {
    impactScore -= 3;
    cautions.push("Because volume is occasional, validate that the workflow is worth automating before expanding.");
  }

  let effortScore = effortWeights[opportunity.effortLevel] ?? 62;
  if (input.technicalComfort === "low" && opportunity.effortLevel === "HIGH") {
    effortScore -= 18;
    cautions.push("High-effort work may need outside implementation support.");
  }
  if (
    input.companySize === "solo" &&
    ["MEDIUM", "HIGH"].includes(opportunity.effortLevel)
  ) {
    effortScore -= 8;
    cautions.push("Keep the first pilot narrow so it does not overload the team.");
  }
  if (input.technicalComfort === "high") {
    effortScore += 5;
  }
  if (input.workflowMaturity === "undefined") {
    effortScore -= opportunity.effortLevel === "LOW" ? 3 : 12;
    cautions.push(
      "Document the current workflow before selecting tools so the pilot has a stable baseline."
    );
  } else if (input.workflowMaturity === "measured") {
    effortScore += 6;
    reasons.push("Your measured workflow maturity improves pilot readiness.");
  }
  if (
    input.approvalMode === "team-review" &&
    opportunity.effortLevel !== "LOW"
  ) {
    effortScore -= 4;
  }
  if (input.dataReadiness === "trusted") {
    effortScore += 6;
    reasons.push("Trusted source data should make the pilot easier to set up.");
  } else if (input.dataReadiness === "scattered") {
    effortScore -= 12;
    cautions.push("Consolidate examples and source data before judging tool performance.");
  }
  if (input.decisionOwner === "cross-functional") {
    effortScore -= 7;
    cautions.push("Cross-functional approval can slow rollout unless decision rights are explicit.");
  } else if (input.decisionOwner === "single-owner") {
    effortScore += 4;
  }

  let riskScore = riskWeights[opportunity.riskLevel] ?? 64;
  if (input.dataSensitivity === "high") {
    riskScore -= opportunity.riskLevel === "HIGH" ? 24 : 12;
    cautions.push(
      "Use approved data, access controls, and human review before handling sensitive information."
    );
  } else if (
    input.dataSensitivity === "moderate" &&
    opportunity.riskLevel === "HIGH"
  ) {
    riskScore -= 10;
    cautions.push("Add a review checkpoint before using this with live data.");
  }
  if (input.approvalMode === "automated") {
    riskScore -= opportunity.riskLevel === "LOW" ? 4 : 12;
    cautions.push(
      "Do not fully automate until the pilot has proven accuracy and exception handling."
    );
  } else {
    riskScore += 3;
  }
  if (input.integrationNeeds.includes("helpdesk") && opportunity.riskLevel !== "LOW") {
    cautions.push(
      "Use human handoff rules for customer-facing responses during the pilot."
    );
  }
  if (input.dataReadiness === "scattered") {
    riskScore -= 6;
  } else if (input.dataReadiness === "trusted") {
    riskScore += 4;
  }
  if (input.decisionOwner === "cross-functional") {
    riskScore -= 3;
  }

  const confidenceScore = calculateConfidenceScore(
    opportunity,
    industryMatch ? 1 : 0,
    goalHits.length + painHits.length + integrationHits.length,
    input
  );
  let score = clamp(
    Math.round(
      impactScore * 0.42 +
        effortScore * 0.2 +
        riskScore * 0.18 +
        confidenceScore * 0.2
    ),
    94
  );
  if (functionMismatch) {
    score = Math.min(score, 82);
  }

  if (reasons.length === 0) {
    reasons.push("Included as a general business opportunity from the taxonomy.");
  }

  return {
    id: opportunity.id,
    name: opportunity.name,
    slug: opportunity.slug,
    businessFunctionName: opportunity.businessFunction?.name ?? null,
    score,
    impactScore: clamp(Math.round(impactScore), 96),
    effortScore: clamp(Math.round(effortScore), 96),
    riskScore: clamp(Math.round(riskScore), 96),
    confidenceScore: clamp(confidenceScore, 96),
    fitLabel: getFitLabel(score, riskScore),
    description: opportunity.description,
    painPoint: opportunity.painPoint,
    expectedBenefit: opportunity.expectedBenefit,
    startingPoint: opportunity.startingPoint,
    effortLevel: opportunity.effortLevel,
    riskLevel: opportunity.riskLevel,
    timeToValue: opportunity.timeToValue,
    reasons,
    cautions,
    successMetrics: opportunity.successMetrics,
    useCases: opportunity.useCases.slice(0, 3).map(toAuditUseCase),
    tools: recommendTools(opportunity, input)
  };
}

function toAuditUseCase(
  useCase: AuditDataset["opportunities"][number]["useCases"][number]
): AuditUseCaseRecommendation {
  return {
    id: useCase.id,
    name: useCase.name,
    slug: useCase.slug,
    outcome: useCase.outcome,
    effortLevel: useCase.effortLevel,
    riskLevel: useCase.riskLevel,
    timeToValue: useCase.timeToValue
  };
}

function calculateConfidenceScore(
  opportunity: AuditDataset["opportunities"][number],
  industryMatchCount: number,
  inputSignalCount: number,
  input: AuditInput
) {
  const useCaseSignal = Math.min(opportunity.useCases.length * 7, 18);
  const toolSignal = Math.min(
    opportunity.useCases.reduce(
      (total, useCase) => total + useCase.toolFits.length,
      0
    ) * 3,
    18
  );

  let score =
    44 +
    industryMatchCount * 14 +
    Math.min(inputSignalCount * 5, 14) +
    useCaseSignal +
    toolSignal;

  if (input.successMetric?.trim()) {
    score += 5;
  }
  if (input.dataReadiness === "trusted") {
    score += 4;
  } else if (input.dataReadiness === "scattered") {
    score -= 5;
  }
  if (input.workflowMaturity === "undefined") {
    score -= 4;
  }

  return clamp(score, 96);
}

function recommendTools(
  opportunity: AuditDataset["opportunities"][number],
  input: AuditInput
): AuditToolRecommendation[] {
  const fits = opportunity.useCases
    .flatMap((useCase) => useCase.toolFits)
    .map((fit) => ({
      ...fit,
      adjustedScore: adjustToolFitScore(fit, input)
    }))
    .sort((a, b) => {
      if (b.adjustedScore !== a.adjustedScore) {
        return b.adjustedScore - a.adjustedScore;
      }
      return b.tool.popularityScore - a.tool.popularityScore;
    });

  const seen = new Set<string>();
  const recommendations: AuditToolRecommendation[] = [];

  for (const fit of fits) {
    if (seen.has(fit.tool.id)) {
      continue;
    }
    seen.add(fit.tool.id);
    recommendations.push({
      id: fit.tool.id,
      name: fit.tool.name,
      slug: fit.tool.slug,
      logoUrl: fit.tool.logoUrl,
      categoryName: fit.tool.category.name,
      pricingType: fit.tool.pricingType,
      hasFreePlan: fit.tool.hasFreePlan,
      fitScore: clamp(fit.adjustedScore),
      reason: buildToolReason(fit, opportunity),
      bestFor: fit.bestFor,
      limitation: fit.limitations
    });
    if (recommendations.length === 3) {
      break;
    }
  }

  return recommendations;
}

function adjustToolFitScore(fit: AuditDatasetToolFit, input: AuditInput) {
  let score = fit.fitScore;
  if (input.budgetRange === "low") {
    score += fit.tool.hasFreePlan || fit.tool.pricingType === "FREE" ? 8 : -10;
  }
  if (input.budgetRange === "flexible" && fit.tool.isVerified) {
    score += 4;
  }
  if (input.technicalComfort === "low" && fit.tool.category.name === "Automation") {
    score -= 6;
  }
  if (
    input.technicalComfort === "low" &&
    ["App Builders", "Developer tools"].includes(fit.tool.category.name)
  ) {
    score -= 5;
  }
  if (
    input.integrationNeeds.includes("crm") &&
    ["Sales", "Marketing", "Automation"].includes(fit.tool.category.name)
  ) {
    score += 6;
  }
  if (
    input.integrationNeeds.includes("helpdesk") &&
    fit.tool.category.name === "Customer Support"
  ) {
    score += 8;
  }
  if (
    input.integrationNeeds.includes("spreadsheets") &&
    fit.tool.category.name === "Data Analysis"
  ) {
    score += 8;
  }
  if (
    input.integrationNeeds.includes("code") &&
    ["App Builders", "Developer tools"].includes(fit.tool.category.name)
  ) {
    score += 8;
  }
  if (
    input.integrationNeeds.includes("docs") &&
    ["Knowledge Management", "Research", "Productivity"].includes(
      fit.tool.category.name
    )
  ) {
    score += 6;
  }
  if (fit.pricingSuitability?.toLowerCase().includes(input.budgetRange)) {
    score += 5;
  }
  return score;
}

function buildToolReason(
  fit: AuditDatasetToolFit & { adjustedScore: number },
  opportunity: AuditDataset["opportunities"][number]
) {
  if (fit.bestFor) {
    return fit.bestFor;
  }

  if (
    fit.recommendationNote &&
    !fit.recommendationNote.includes("current curated use-case data")
  ) {
    return fit.recommendationNote;
  }

  const category = fit.tool.category.name.toLowerCase();
  return `Use ${fit.tool.name} as the ${category} layer for ${opportunity.name.toLowerCase()}, then compare output quality against the pilot examples.`;
}

function buildExecutiveBrief(
  opportunity: AuditOpportunityRecommendation | undefined,
  input: AuditInput
) {
  if (!opportunity) {
    return "The audit needs enough context to rank a first workflow.";
  }

  const metric = input.successMetric?.trim() || opportunity.successMetrics[0];
  const horizon = input.pilotTimeline || opportunity.timeToValue || "2 weeks";

  return `${opportunity.name} is the strongest first pilot because it balances business fit, implementation effort, and review risk. Run it as a ${horizon} pilot and judge success by ${metric.toLowerCase()}.`;
}

function buildReadinessAssessment(
  input: AuditInput,
  opportunity: AuditOpportunityRecommendation | undefined
): AuditReadinessAssessment {
  const strengths: string[] = [];
  const risks: string[] = [];
  let score = 52;

  if (input.workflowMaturity === "measured") {
    score += 14;
    strengths.push("Workflow is already measured and repeatable.");
  } else if (input.workflowMaturity === "documented") {
    score += 7;
    strengths.push("Workflow is documented enough to define a pilot.");
  } else {
    score -= 12;
    risks.push("Current process is not documented, so baseline measurement comes first.");
  }

  if (input.dataReadiness === "trusted") {
    score += 13;
    strengths.push("Source data is trusted and organized.");
  } else if (input.dataReadiness === "accessible") {
    score += 5;
  } else {
    score -= 13;
    risks.push("Data is scattered, which can make tool comparisons misleading.");
  }

  if (input.decisionOwner === "single-owner") {
    score += 9;
    strengths.push("A single owner can keep scope and review decisions clear.");
  } else if (input.decisionOwner === "small-group") {
    score += 3;
  } else {
    score -= 7;
    risks.push("Cross-functional approval needs explicit decision rights before rollout.");
  }

  if (input.successMetric?.trim()) {
    score += 7;
    strengths.push("Success metric is defined before tool selection.");
  } else {
    score -= 6;
    risks.push("Success metric is missing, so the pilot could become subjective.");
  }

  if (input.technicalComfort === "high") {
    score += 5;
  } else if (input.technicalComfort === "low") {
    score -= 5;
    risks.push("Low technical comfort means setup should stay no-code and narrow.");
  }

  if (input.dataSensitivity === "high" || opportunity?.riskLevel === "HIGH") {
    score -= 9;
    risks.push("Sensitive or high-risk work should stay assistive until controls are proven.");
  }

  if (input.workflowVolume === "daily") {
    score += 5;
    strengths.push("High volume gives the pilot enough repetition to measure quickly.");
  } else if (input.workflowVolume === "occasional") {
    score -= 5;
    risks.push("Low volume may make impact harder to prove in a short pilot.");
  }

  const readinessScore = clamp(Math.round(score), 96);
  const level =
    readinessScore >= 76
      ? "Pilot-ready"
      : readinessScore >= 58
        ? "Prepare first"
        : "Discovery first";

  return {
    score: readinessScore,
    level,
    summary: buildReadinessSummary(level, opportunity),
    strengths: strengths.slice(0, 3),
    risks: risks.slice(0, 3)
  };
}

function buildReadinessSummary(
  level: AuditReadinessAssessment["level"],
  opportunity: AuditOpportunityRecommendation | undefined
) {
  const workflow = opportunity?.name ?? "the selected workflow";

  if (level === "Pilot-ready") {
    return `${workflow} has enough operating clarity to start a narrow supervised pilot.`;
  }
  if (level === "Prepare first") {
    return `${workflow} is promising, but the team should tighten baseline, owner, or data quality before tool rollout.`;
  }
  return `${workflow} needs discovery before implementation so the team does not automate an unclear process.`;
}

function buildAutomationPosture(
  input: AuditInput,
  opportunity: AuditOpportunityRecommendation | undefined
) {
  if (input.dataSensitivity === "high" || opportunity?.riskLevel === "HIGH") {
    return "Assistive only: generate drafts, summaries, or recommendations, then require human approval before anything customer-facing or sensitive is used.";
  }

  if (input.approvalMode === "automated" && input.workflowMaturity === "measured") {
    return "Supervised automation candidate: automate narrow low-risk steps after a reviewed pilot proves quality and exceptions are clear.";
  }

  if (input.workflowMaturity === "undefined") {
    return "Readiness first: document the current workflow and measure the baseline before automating.";
  }

  return "Human-in-the-loop pilot: use AI for first drafts, routing, or summaries while one owner reviews output quality.";
}

function buildPilotPlan(
  opportunity: AuditOpportunityRecommendation | undefined,
  input: AuditInput
): AuditPilotPlan {
  const timeline = input.pilotTimeline || opportunity?.timeToValue || "2 weeks";
  const successMetric =
    input.successMetric?.trim() ||
    opportunity?.successMetrics[0] ||
    "time saved in the selected workflow";
  const title = opportunity
    ? `${opportunity.name} pilot`
    : "AI workflow pilot";

  return {
    title,
    owner: ownerForFunction(opportunity?.businessFunctionName),
    timeline,
    successMetric,
    baselineQuestion: buildBaselineQuestion(successMetric, opportunity),
    target: buildPilotTarget(successMetric, input),
    guardrails: buildGuardrails(opportunity, input),
    weekOneActions: [
      opportunity?.startingPoint ?? "Map the current workflow and owner.",
      buildDataPrepAction(input),
      `Record the current ${successMetric.toLowerCase()} before testing AI output.`,
      "Choose one review owner and define what good output looks like.",
      "Test the top two shortlisted tools on the same examples."
    ],
    expansionCriteria: [
      `The pilot improves ${successMetric.toLowerCase()} without lowering quality.`,
      "Reviewers trust the output on routine cases.",
      "Exceptions and escalation paths are clear.",
      "The team can explain when AI should not be used."
    ]
  };
}

function buildBaselineQuestion(
  successMetric: string,
  opportunity: AuditOpportunityRecommendation | undefined
) {
  const workflow = opportunity?.name.toLowerCase() ?? "this workflow";
  return `What is today's ${successMetric.toLowerCase()} for ${workflow}, measured from 10-20 recent examples?`;
}

function buildPilotTarget(successMetric: string, input: AuditInput) {
  if (input.workflowVolume === "daily") {
    return `Improve ${successMetric.toLowerCase()} by 20-30% while maintaining review quality.`;
  }
  if (input.dataReadiness === "scattered" || input.workflowMaturity === "undefined") {
    return `Create a reliable baseline for ${successMetric.toLowerCase()} and prove repeatable quality on sample work.`;
  }
  return `Improve ${successMetric.toLowerCase()} by 10-20% with no increase in review corrections.`;
}

function buildDataPrepAction(input: AuditInput) {
  if (input.dataReadiness === "scattered") {
    return "Collect and clean 10-20 representative examples before testing tools.";
  }
  if (input.dataReadiness === "trusted") {
    return "Select 10-20 trusted examples that reflect routine and edge cases.";
  }
  return "Collect 10-20 representative examples from the current process.";
}

function buildGuardrails(
  opportunity: AuditOpportunityRecommendation | undefined,
  input: AuditInput
) {
  const guardrails = [
    "Keep a human owner accountable for final output.",
    "Use one narrow workflow before expanding to adjacent work."
  ];

  if (input.dataSensitivity !== "low") {
    guardrails.push("Exclude sensitive data until access, retention, and review rules are approved.");
  }

  if (input.approvalMode !== "automated") {
    guardrails.push("Require review before sending output to customers, candidates, or external partners.");
  } else {
    guardrails.push("Log automated outputs and sample them for quality during the pilot.");
  }

  if (opportunity?.cautions.length) {
    guardrails.push(opportunity.cautions[0]);
  }

  return guardrails;
}

function ownerForFunction(functionName: string | null | undefined) {
  if (!functionName) {
    return "Workflow owner";
  }

  return `${functionName} owner`;
}

function buildOverallCaution(input: AuditInput, industryCaution: string | null) {
  if (input.dataSensitivity === "high") {
    return (
      industryCaution ??
      "Treat this as a supervised pilot. Avoid sensitive data until privacy, access, and review rules are written."
    );
  }
  if (industryCaution) {
    return industryCaution;
  }
  return "Start with a narrow pilot, measure one workflow, and keep human review in place.";
}

function buildChecklist(
  opportunity: AuditOpportunityRecommendation | undefined,
  input: AuditInput
) {
  if (!opportunity) {
    return [
      "Complete the audit questions.",
      "Choose one measurable workflow.",
      "Review the recommended opportunity before selecting tools."
    ];
  }

  const checklist = [
    opportunity.startingPoint ?? "Write down the current workflow and owner.",
    "Define the success metric before trying tools.",
    "Choose one low-risk pilot with human review.",
    "Compare the shortlisted tools against budget, data, and team fit.",
    "Review results after two weeks and decide whether to expand."
  ];

  if (input.dataSensitivity !== "low") {
    checklist.splice(
      2,
      0,
      "Document what data can and cannot be used in the pilot."
    );
  }

  return checklist;
}

function getFitLabel(
  score: number,
  riskScore: number
): AuditOpportunityRecommendation["fitLabel"] {
  if (riskScore < 45) {
    return "Use with caution";
  }
  if (score >= 82) {
    return "Best fit";
  }
  if (score >= 72) {
    return "Strong fit";
  }
  return "Good fit";
}

function normalize(value: string) {
  return value.toLowerCase();
}

function clamp(value: number, max = 100) {
  return Math.max(0, Math.min(max, value));
}
