import {
  auditGoalOptions,
  auditPainPointOptions,
  type AuditInput,
  type AuditOpportunityRecommendation,
  type AuditResult,
  type AuditToolRecommendation,
  type AuditUseCaseRecommendation
} from "@/shared/recommendations/audit";

export const AUDIT_RULE_VERSION = "audit-rules-v1.0";

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

  return {
    version: AUDIT_RULE_VERSION,
    input,
    summary: {
      industryName: industry?.name ?? "Selected industry",
      businessFunctionName: businessFunction?.name ?? "Selected function",
      firstWorkflow,
      overallCaution: buildOverallCaution(input, industry?.cautions ?? null)
    },
    topOpportunities: scoredOpportunities,
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
      opportunity.useCases.map((useCase) => useCase.name).join(" ")
    ].join(" ")
  );

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

  if (input.urgency === "urgent") {
    impactScore += opportunity.timeToValue?.includes("1") ? 8 : 3;
  } else if (input.urgency === "soon") {
    impactScore += 4;
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

  const confidenceScore = calculateConfidenceScore(
    opportunity,
    industryMatch ? 1 : 0,
    goalHits.length + painHits.length
  );
  const score = clamp(
    Math.round(
      impactScore * 0.42 +
        effortScore * 0.2 +
        riskScore * 0.18 +
        confidenceScore * 0.2
    )
  );

  if (reasons.length === 0) {
    reasons.push("Included as a general business opportunity from the taxonomy.");
  }

  return {
    id: opportunity.id,
    name: opportunity.name,
    slug: opportunity.slug,
    businessFunctionName: opportunity.businessFunction?.name ?? null,
    score,
    impactScore: clamp(Math.round(impactScore)),
    effortScore: clamp(Math.round(effortScore)),
    riskScore: clamp(Math.round(riskScore)),
    confidenceScore,
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
  inputSignalCount: number
) {
  const useCaseSignal = Math.min(opportunity.useCases.length * 7, 18);
  const toolSignal = Math.min(
    opportunity.useCases.reduce(
      (total, useCase) => total + useCase.toolFits.length,
      0
    ) * 3,
    18
  );

  return clamp(
    44 + industryMatchCount * 14 + Math.min(inputSignalCount * 5, 14) + useCaseSignal + toolSignal
  );
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
      categoryName: fit.tool.category.name,
      pricingType: fit.tool.pricingType,
      hasFreePlan: fit.tool.hasFreePlan,
      fitScore: clamp(fit.adjustedScore),
      reason:
        fit.recommendationNote ??
        fit.bestFor ??
        `Strong mapped fit for ${opportunity.name.toLowerCase()}.`,
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
  if (fit.pricingSuitability?.toLowerCase().includes(input.budgetRange)) {
    score += 5;
  }
  return score;
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

function clamp(value: number) {
  return Math.max(0, Math.min(100, value));
}
