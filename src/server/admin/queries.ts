import { PublishStatus, SubmissionStatus } from "@prisma/client";
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

export type AdminTaxonomyOption = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
};

export type AdminTaxonomyOptions = {
  categories: AdminTaxonomyOption[];
  features: AdminTaxonomyOption[];
  useCases: AdminTaxonomyOption[];
};

export type AdminDuplicateCandidate = {
  id: string;
  label: string;
  detail: string;
  type: "tool" | "submission";
  status: string;
};

export type AdminToolStatus = keyof typeof PublishStatus;

export type AdminToolSummary = {
  id: string;
  name: string;
  slug: string;
  websiteUrl: string;
  status: AdminToolStatus;
  pricingType: PricingType;
  isFeatured: boolean;
  isVerified: boolean;
  popularityScore: number;
  categoryName: string;
  updatedAt: Date;
};

export type AdminToolDetail = AdminToolSummary & {
  shortDescription: string;
  longDescription: string | null;
  logoUrl: string | null;
  categoryId: string;
  hasFreePlan: boolean;
  metaTitle: string | null;
  metaDescription: string | null;
  featureIds: string[];
  useCaseIds: string[];
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
  status: AdminSubmissionStatus = "PENDING",
  query?: string
): Promise<AdminSubmissionSummary[]> {
  const submissions = await prisma.submission.findMany({
    where: {
      status,
      ...(query
        ? {
            OR: [
              { toolName: { contains: query, mode: "insensitive" } },
              { websiteUrl: { contains: query, mode: "insensitive" } },
              { submitterEmail: { contains: query, mode: "insensitive" } }
            ]
          }
        : {})
    },
    orderBy: {
      createdAt: "desc"
    },
    take: 50
  });

  return submissions.map(toAdminSubmissionSummary);
}

export async function listAdminTaxonomyOptions(): Promise<AdminTaxonomyOptions> {
  const [categories, features, useCases] = await Promise.all([
    prisma.category.findMany({
      orderBy: {
        name: "asc"
      }
    }),
    prisma.feature.findMany({
      orderBy: {
        name: "asc"
      }
    }),
    prisma.useCase.findMany({
      orderBy: {
        name: "asc"
      }
    })
  ]);

  return {
    categories: categories.map(toTaxonomyOption),
    features: features.map(toTaxonomyOption),
    useCases: useCases.map(toTaxonomyOption)
  };
}

function toTaxonomyOption(item: AdminTaxonomyOption): AdminTaxonomyOption {
  return {
    id: item.id,
    name: item.name,
    slug: item.slug,
    description: item.description
  };
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

export async function findSubmissionDuplicateCandidates(
  submission: AdminSubmissionDetail
): Promise<AdminDuplicateCandidate[]> {
  const [tools, submissions] = await Promise.all([
    prisma.tool.findMany({
      where: {
        OR: [
          { name: { contains: submission.toolName, mode: "insensitive" } },
          { websiteUrl: { equals: submission.websiteUrl, mode: "insensitive" } }
        ]
      },
      select: {
        id: true,
        name: true,
        slug: true,
        websiteUrl: true,
        status: true
      },
      take: 8
    }),
    prisma.submission.findMany({
      where: {
        id: {
          not: submission.id
        },
        OR: [
          { toolName: { contains: submission.toolName, mode: "insensitive" } },
          { websiteUrl: { equals: submission.websiteUrl, mode: "insensitive" } }
        ]
      },
      select: {
        id: true,
        toolName: true,
        websiteUrl: true,
        status: true
      },
      take: 8
    })
  ]);

  return [
    ...tools.map((tool) => ({
      id: tool.id,
      label: tool.name,
      detail: tool.websiteUrl,
      type: "tool" as const,
      status: tool.status
    })),
    ...submissions.map((candidate) => ({
      id: candidate.id,
      label: candidate.toolName,
      detail: candidate.websiteUrl,
      type: "submission" as const,
      status: candidate.status
    }))
  ];
}

export async function getAdminToolCounts() {
  const groupedCounts = await prisma.tool.groupBy({
    by: ["status"],
    _count: {
      status: true
    }
  });

  return Object.fromEntries(
    Object.values(PublishStatus).map((status) => [
      status,
      groupedCounts.find((count) => count.status === status)?._count.status ?? 0
    ])
  ) as Record<AdminToolStatus, number>;
}

export async function listAdminTools(
  status: AdminToolStatus = "PUBLISHED",
  query?: string
): Promise<AdminToolSummary[]> {
  const tools = await prisma.tool.findMany({
    where: {
      status,
      ...(query
        ? {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { websiteUrl: { contains: query, mode: "insensitive" } },
              { shortDescription: { contains: query, mode: "insensitive" } }
            ]
          }
        : {})
    },
    include: {
      category: true
    },
    orderBy: {
      updatedAt: "desc"
    },
    take: 80
  });

  return tools.map((tool) => ({
    id: tool.id,
    name: tool.name,
    slug: tool.slug,
    websiteUrl: tool.websiteUrl,
    status: tool.status,
    pricingType: tool.pricingType,
    isFeatured: tool.isFeatured,
    isVerified: tool.isVerified,
    popularityScore: tool.popularityScore,
    categoryName: tool.category.name,
    updatedAt: tool.updatedAt
  }));
}

export async function getAdminToolById(
  id: string
): Promise<AdminToolDetail | null> {
  const tool = await prisma.tool.findUnique({
    where: {
      id
    },
    include: {
      category: true,
      toolFeatures: true,
      toolUseCases: true
    }
  });

  if (!tool) {
    return null;
  }

  return {
    id: tool.id,
    name: tool.name,
    slug: tool.slug,
    websiteUrl: tool.websiteUrl,
    status: tool.status,
    pricingType: tool.pricingType,
    isFeatured: tool.isFeatured,
    isVerified: tool.isVerified,
    popularityScore: tool.popularityScore,
    categoryName: tool.category.name,
    updatedAt: tool.updatedAt,
    shortDescription: tool.shortDescription,
    longDescription: tool.longDescription,
    logoUrl: tool.logoUrl,
    categoryId: tool.categoryId,
    hasFreePlan: tool.hasFreePlan,
    metaTitle: tool.metaTitle,
    metaDescription: tool.metaDescription,
    featureIds: tool.toolFeatures.map((toolFeature) => toolFeature.featureId),
    useCaseIds: tool.toolUseCases.map((toolUseCase) => toolUseCase.useCaseId)
  };
}
