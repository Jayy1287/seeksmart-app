import { createHash } from "crypto";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { AuditInput, AuditResult } from "@/shared/recommendations/audit";

export type SavedAuditRunSummary = Awaited<
  ReturnType<typeof listSavedAuditRuns>
>[number];

export type StoredAuditRun = NonNullable<
  Awaited<ReturnType<typeof getAuditRunById>>
>;

const ANONYMOUS_RUN_TTL_DAYS = 30;

/**
 * Store a scored audit. Signed-in users get one row per distinct input
 * (upsert); anonymous runs are always new rows that expire after 30 days
 * unless they are unlocked with an email or claimed by an account.
 */
export async function createAuditRun({
  email,
  result,
  userId
}: {
  email?: string | null;
  result: AuditResult;
  userId?: string | null;
}) {
  const inputHash = hashAuditInput(result.input);
  const topOpportunity = result.topOpportunities[0];
  const baseData = {
    input: toJsonValue(result.input),
    inputHash,
    readinessLevel: result.readiness.level,
    readinessScore: result.readiness.score,
    result: toJsonValue(result),
    ruleVersion: result.version,
    title: result.summary.firstWorkflow,
    topOpportunityName: topOpportunity?.name,
    topOpportunitySlug: topOpportunity?.slug
  };

  if (userId) {
    return prisma.auditRun.upsert({
      create: {
        ...baseData,
        email: email ?? undefined,
        unlockedAt: new Date(),
        userId
      },
      select: auditRunSummarySelect,
      update: {
        readinessLevel: baseData.readinessLevel,
        readinessScore: baseData.readinessScore,
        result: baseData.result,
        title: baseData.title,
        topOpportunityName: baseData.topOpportunityName,
        topOpportunitySlug: baseData.topOpportunitySlug,
        unlockedAt: new Date()
      },
      where: {
        userId_ruleVersion_inputHash: {
          inputHash,
          ruleVersion: result.version,
          userId
        }
      }
    });
  }

  const normalizedEmail = email ? normalizeAuditEmail(email) : null;

  return prisma.auditRun.create({
    data: {
      ...baseData,
      email: normalizedEmail ?? undefined,
      expiresAt: normalizedEmail ? null : addDays(new Date(), ANONYMOUS_RUN_TTL_DAYS),
      unlockedAt: normalizedEmail ? new Date() : null
    },
    select: auditRunSummarySelect
  });
}

export async function getAuditRunById(id: string) {
  const run = await prisma.auditRun.findUnique({
    where: { id }
  });

  if (!run) {
    return null;
  }

  if (run.expiresAt && run.expiresAt < new Date()) {
    return null;
  }

  return run;
}

export async function unlockAuditRun({
  email,
  id
}: {
  email: string;
  id: string;
}) {
  const normalizedEmail = normalizeAuditEmail(email);

  return prisma.auditRun.update({
    data: {
      email: normalizedEmail,
      expiresAt: null,
      unlockedAt: new Date()
    },
    select: { id: true, email: true, unlockedAt: true },
    where: { id }
  });
}

/** Attach an anonymous run to a signed-in account and unlock it. */
export async function claimAuditRun({
  id,
  userId
}: {
  id: string;
  userId: string;
}) {
  try {
    return await prisma.auditRun.update({
      data: {
        expiresAt: null,
        unlockedAt: new Date(),
        userId
      },
      select: { id: true },
      where: { id, userId: null }
    });
  } catch {
    // Either already claimed or the (userId, ruleVersion, inputHash) pair
    // already exists for this user. Both are fine to ignore.
    return null;
  }
}

/** On sign-in, adopt any anonymous runs that were unlocked with this email. */
export async function claimAuditRunsByEmail({
  email,
  userId
}: {
  email: string;
  userId: string;
}) {
  const normalizedEmail = normalizeAuditEmail(email);
  const candidates = await prisma.auditRun.findMany({
    select: { id: true },
    where: { email: normalizedEmail, userId: null }
  });

  for (const candidate of candidates) {
    await claimAuditRun({ id: candidate.id, userId });
  }

  return candidates.length;
}

export async function listSavedAuditRuns(userId: string, take = 8) {
  return prisma.auditRun.findMany({
    orderBy: {
      createdAt: "desc"
    },
    select: auditRunSummarySelect,
    take,
    where: {
      userId
    }
  });
}

export async function getSavedAuditRun({
  id,
  userId
}: {
  id: string;
  userId: string;
}) {
  return prisma.auditRun.findFirst({
    where: {
      id,
      userId
    }
  });
}

export function hashAuditInput(input: AuditInput) {
  return createHash("sha256").update(stableStringify(input)).digest("hex");
}

export function normalizeAuditEmail(email: string) {
  return email.trim().toLowerCase();
}

const auditRunSummarySelect = {
  createdAt: true,
  id: true,
  readinessLevel: true,
  readinessScore: true,
  title: true,
  topOpportunityName: true,
  topOpportunitySlug: true,
  unlockedAt: true,
  updatedAt: true
} satisfies Prisma.AuditRunSelect;

function addDays(date: Date, days: number) {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}

function toJsonValue(value: unknown) {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

function stableStringify(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(",")}]`;
  }

  if (value && typeof value === "object") {
    return `{${Object.entries(value)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, nestedValue]) => {
        return `${JSON.stringify(key)}:${stableStringify(nestedValue)}`;
      })
      .join(",")}}`;
  }

  return JSON.stringify(value);
}
