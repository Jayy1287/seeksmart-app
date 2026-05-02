import { SubmissionStatus } from "@prisma/client";
import type { Prisma, PricingType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";

export type AdminSubmissionStatus = keyof typeof SubmissionStatus;

export type AdminSubmissionSummary = {
  id: string;
  toolName: string;
  websiteUrl: string;
  submitterEmail: string;
  status: AdminSubmissionStatus;
  category: string;
  pricingType: PricingType;
  description: string;
  createdAt: Date;
  reviewedAt: Date | null;
};

export type AdminSubmissionDetail = AdminSubmissionSummary & {
  payload: Prisma.JsonValue;
  suggestedSlug: string;
};

type SubmissionPayload = {
  category?: unknown;
  pricingType?: unknown;
  description?: unknown;
};

function getPayloadObject(payload: Prisma.JsonValue): SubmissionPayload {
  if (payload && typeof payload === "object" && !Array.isArray(payload)) {
    return payload;
  }

  return {};
}

function getPayloadString(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim().length > 0
    ? value
    : fallback;
}

function getPayloadPricing(value: unknown): PricingType {
  return value === "FREE" || value === "PAID" || value === "FREEMIUM"
    ? value
    : "FREEMIUM";
}

function toAdminSubmissionSummary(
  submission: {
    id: string;
    toolName: string;
    websiteUrl: string;
    submitterEmail: string;
    status: SubmissionStatus;
    payload: Prisma.JsonValue;
    createdAt: Date;
    reviewedAt: Date | null;
  }
): AdminSubmissionSummary {
  const payload = getPayloadObject(submission.payload);

  return {
    id: submission.id,
    toolName: submission.toolName,
    websiteUrl: submission.websiteUrl,
    submitterEmail: submission.submitterEmail,
    status: submission.status,
    category: getPayloadString(payload.category, "Uncategorized"),
    pricingType: getPayloadPricing(payload.pricingType),
    description: getPayloadString(payload.description, ""),
    createdAt: submission.createdAt,
    reviewedAt: submission.reviewedAt
  };
}

export async function getAdminSubmissionCounts() {
  const groupedCounts = await prisma.submission.groupBy({
    by: ["status"],
    _count: {
      status: true
    }
  });

  return Object.fromEntries(
    Object.values(SubmissionStatus).map((status) => [
      status,
      groupedCounts.find((count) => count.status === status)?._count.status ?? 0
    ])
  ) as Record<AdminSubmissionStatus, number>;
}

export async function listAdminSubmissions(
  status: AdminSubmissionStatus = "PENDING"
): Promise<AdminSubmissionSummary[]> {
  const submissions = await prisma.submission.findMany({
    where: {
      status
    },
    orderBy: {
      createdAt: "desc"
    },
    take: 50
  });

  return submissions.map(toAdminSubmissionSummary);
}

export async function getAdminSubmissionById(
  id: string
): Promise<AdminSubmissionDetail | null> {
  const submission = await prisma.submission.findUnique({
    where: {
      id
    }
  });

  if (!submission) {
    return null;
  }

  return {
    ...toAdminSubmissionSummary(submission),
    payload: submission.payload,
    suggestedSlug: slugify(submission.toolName)
  };
}
