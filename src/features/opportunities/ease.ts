// "Ease to start": a readable 0-100 score from effort and risk, using the same
// weights the audit scorer applies. It is not personalised; it answers "how
// easy is this to pilot safely" for any business.

import { effortLevelWeights, riskLevelWeights } from "@/shared/recommendations/audit";

const effortWeights = effortLevelWeights;
const riskWeights = riskLevelWeights;

export function easeScore(effortLevel: string, riskLevel: string) {
  const effort = effortWeights[effortLevel.toUpperCase()] ?? 72;
  const risk = riskWeights[riskLevel.toUpperCase()] ?? 70;
  return Math.round(effort * 0.55 + risk * 0.45);
}

export function formatLevel(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

export function levelRank(value: string) {
  const upper = value.toUpperCase();
  return upper === "LOW" ? 0 : upper === "MEDIUM" ? 1 : 2;
}
