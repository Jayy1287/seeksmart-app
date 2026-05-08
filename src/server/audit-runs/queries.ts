import { createHash } from "crypto";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { AuditInput, AuditResult } from "@/shared/recommendations/audit";

export type SavedAuditRunSummary = Awaited<
  ReturnType<typeof listSavedAuditRuns>
>[number];

export async function saveAuditRun({
  result,
  userId
}: {
  result: AuditResult;
  userId: string;
}) {
  const inputHash = hashAuditInput(result.input);
  const topOpportunity = result.topOpportunities[0];

  return prisma.auditRun.upsert({
    create: {
      input: toJsonValue(result.input),
      inputHash,
      readinessLevel: result.readiness.level,
      readinessScore: result.readiness.score,
      result: toJsonValue(result),
      ruleVersion: result.version,
      title: result.summary.firstWorkflow,
      topOpportunityName: topOpportunity?.name,
      topOpportunitySlug: topOpportunity?.slug,
      userId
    },
    select: auditRunSummarySelect,
    update: {
      readinessLevel: result.readiness.level,
      readinessScore: result.readiness.score,
      result: toJsonValue(result),
      title: result.summary.firstWorkflow,
      topOpportunityName: topOpportunity?.name,
      topOpportunitySlug: topOpportunity?.slug
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

const auditRunSummarySelect = {
  createdAt: true,
  id: true,
  readinessLevel: true,
  readinessScore: true,
  title: true,
  topOpportunityName: true,
  topOpportunitySlug: true,
  updatedAt: true
} satisfies Prisma.AuditRunSelect;

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
