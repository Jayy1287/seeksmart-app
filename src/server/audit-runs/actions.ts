"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/auth";
import { withPostHogClient } from "@/lib/posthog-server";
import { createAuditRun } from "@/server/audit-runs/queries";
import { assertRateLimit, RateLimitError } from "@/server/http/rate-limit";
import { getAuditDataset } from "@/server/recommendations/queries";
import { scoreAudit } from "@/server/recommendations/scoring";
import {
  auditBudgetRanges,
  auditCompanySizes,
  auditDataSensitivityLevels,
  auditGoalOptions,
  auditIntegrationNeeds,
  auditPainPointOptions,
  auditTechnicalComfortLevels,
  auditUrgencyLevels,
  auditWorkflowVolumes
} from "@/shared/recommendations/audit";
import {
  auditProcessClarityLevels,
  auditSignOffModes,
  auditWizardLimits,
  toAuditInput,
  type AuditWizardAnswers
} from "@/shared/recommendations/wizard";


const slugSchema = z.string().trim().min(1).max(120);

const wizardAnswersSchema = z.object({
  industrySlug: slugSchema,
  companySize: z.enum(auditCompanySizes),
  businessFunctionSlug: slugSchema,
  goals: z
    .array(z.enum(auditGoalOptions.map((option) => option.id) as [string, ...string[]]))
    .min(1)
    .max(auditWizardLimits.maxGoals),
  painPoints: z
    .array(
      z.enum(auditPainPointOptions.map((option) => option.id) as [string, ...string[]])
    )
    .min(1)
    .max(auditWizardLimits.maxPainPoints),
  integrationNeeds: z
    .array(
      z.enum(auditIntegrationNeeds.map((option) => option.id) as [string, ...string[]])
    )
    .max(auditWizardLimits.maxIntegrationNeeds)
    .default([]),
  processClarity: z.enum(auditProcessClarityLevels),
  signOff: z.enum(auditSignOffModes),
  budgetRange: z.enum(auditBudgetRanges),
  technicalComfort: z.enum(auditTechnicalComfortLevels),
  dataSensitivity: z.enum(auditDataSensitivityLevels),
  workflowVolume: z.enum(auditWorkflowVolumes),
  urgency: z.enum(auditUrgencyLevels),
  successMetric: z
    .string()
    .trim()
    .max(auditWizardLimits.maxSuccessMetricLength)
    .optional()
    .transform((value) => (value ? value : undefined))
});

export type SubmitAuditState = {
  error?: string;
  /** Set when the session expired mid-audit; the wizard sends the user to sign in. */
  needsSignIn?: boolean;
};

export async function submitAuditAction(
  rawAnswers: unknown
): Promise<SubmitAuditState> {
  const parsed = wizardAnswersSchema.safeParse(rawAnswers);

  if (!parsed.success) {
    return { error: "Some answers are missing. Go back and check each step." };
  }

  const answers = parsed.data as AuditWizardAnswers;
  const session = await auth();
  const user = session?.user;

  if (!user?.id) {
    return { error: "Sign in to see your results.", needsSignIn: true };
  }

  try {
    const requestHeaders = await headers();
    const ip =
      requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      requestHeaders.get("x-real-ip") ||
      "unknown";
    assertRateLimit({
      key: `audit-submit:${user.id}:${ip}`,
      limit: 20,
      windowMs: 10 * 60 * 1000
    });
  } catch (error) {
    if (error instanceof RateLimitError) {
      return { error: "Too many audits from this connection. Try again in a few minutes." };
    }
    throw error;
  }

  const dataset = await getAuditDataset();
  const input = toAuditInput(answers);
  const result = scoreAudit(input, dataset);
  const run = await createAuditRun({
    email: user.email ?? null,
    result,
    userId: user.id
  });

  await withPostHogClient((posthog) => {
    posthog.capture({
      distinctId: user.id,
      event: "audit_completed",
      properties: {
        audit_run_id: run.id,
        audit_version: result.version,
        industry: input.industrySlug,
        business_function: input.businessFunctionSlug,
        company_size: input.companySize,
        readiness_level: result.readiness.level,
        readiness_score: result.readiness.score,
        top_opportunity: result.topOpportunities[0]?.slug ?? "none",
        signed_in: true
      }
    });
  });

  redirect(`/audit/r/${run.id}`);
}
