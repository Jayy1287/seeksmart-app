"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { withPostHogClient } from "@/lib/posthog-server";
import {
  AUDIT_EMAIL_COOKIE,
  AUDIT_RUNS_COOKIE
} from "@/server/audit-runs/cookies";
import {
  createAuditRun,
  getAuditRunById,
  normalizeAuditEmail,
  unlockAuditRun
} from "@/server/audit-runs/queries";
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


const cookieMaxAgeSeconds = 60 * 60 * 24 * 30;

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
};

export async function submitAuditAction(
  rawAnswers: unknown
): Promise<SubmitAuditState> {
  const parsed = wizardAnswersSchema.safeParse(rawAnswers);

  if (!parsed.success) {
    return { error: "Some answers are missing. Go back and check each step." };
  }

  const answers = parsed.data as AuditWizardAnswers;

  try {
    const requestHeaders = await headers();
    const ip =
      requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      requestHeaders.get("x-real-ip") ||
      "unknown";
    assertRateLimit({
      key: `audit-submit:${ip}`,
      limit: 20,
      windowMs: 10 * 60 * 1000
    });
  } catch (error) {
    if (error instanceof RateLimitError) {
      return { error: "Too many audits from this connection. Try again in a few minutes." };
    }
    throw error;
  }

  const [session, dataset, cookieStore] = await Promise.all([
    auth(),
    getAuditDataset(),
    cookies()
  ]);
  const input = toAuditInput(answers);
  const result = scoreAudit(input, dataset);
  const rememberedEmail = cookieStore.get(AUDIT_EMAIL_COOKIE)?.value;
  const run = await createAuditRun({
    email: session?.user?.email ?? rememberedEmail ?? null,
    result,
    userId: session?.user?.id ?? null
  });

  rememberAuditRun(cookieStore, run.id);

  await withPostHogClient((posthog) => {
    posthog.capture({
      distinctId: session?.user?.id ?? `audit-run:${run.id}`,
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
        signed_in: Boolean(session?.user)
      }
    });
  });

  redirect(`/audit/r/${run.id}`);
}

export type UnlockAuditState = {
  error?: string;
  success?: boolean;
};

const unlockSchema = z.object({
  id: z.string().trim().min(1).max(64),
  email: z.string().trim().toLowerCase().email().max(254)
});

export async function unlockAuditAction(
  _previousState: UnlockAuditState,
  formData: FormData
): Promise<UnlockAuditState> {
  const parsed = unlockSchema.safeParse({
    id: formData.get("id"),
    email: formData.get("email")
  });

  if (!parsed.success) {
    return { error: "Enter a valid email address to unlock the full brief." };
  }

  const run = await getAuditRunById(parsed.data.id);

  if (!run) {
    return { error: "This audit has expired. Run it again to get a fresh brief." };
  }

  try {
    assertRateLimit({
      key: `audit-unlock:${parsed.data.id}`,
      limit: 10,
      windowMs: 10 * 60 * 1000
    });
  } catch (error) {
    if (error instanceof RateLimitError) {
      return { error: "Too many attempts. Try again in a few minutes." };
    }
    throw error;
  }

  const email = normalizeAuditEmail(parsed.data.email);
  await unlockAuditRun({ email, id: run.id });

  const cookieStore = await cookies();
  cookieStore.set(AUDIT_EMAIL_COOKIE, email, {
    httpOnly: true,
    maxAge: cookieMaxAgeSeconds,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production"
  });
  rememberAuditRun(cookieStore, run.id);

  await withPostHogClient((posthog) => {
    posthog.capture({
      distinctId: `audit-run:${run.id}`,
      event: "audit_unlocked",
      properties: {
        audit_run_id: run.id,
        readiness_level: run.readinessLevel ?? "unknown",
        top_opportunity: run.topOpportunitySlug ?? "none"
      }
    });
  });

  revalidatePath(`/audit/r/${run.id}`);

  return { success: true };
}

type CookieStore = Awaited<ReturnType<typeof cookies>>;

function rememberAuditRun(cookieStore: CookieStore, id: string) {
  const existing = cookieStore.get(AUDIT_RUNS_COOKIE)?.value ?? "";
  const ids = [id, ...existing.split(",").filter((value) => value && value !== id)]
    .slice(0, 10)
    .join(",");

  cookieStore.set(AUDIT_RUNS_COOKIE, ids, {
    httpOnly: true,
    maxAge: cookieMaxAgeSeconds,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production"
  });
}
