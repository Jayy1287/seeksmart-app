import { PublishStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  toPublicToolCard,
  toPublicToolDetail,
  toolCardInclude,
  toolDetailInclude
} from "./mappers";
import type {
  PublicToolCard,
  PublicToolDetail,
  PublicToolSearchResult
} from "@/shared/domain";

type ListToolsInput = {
  query?: string;
  categorySlug?: string;
  pricingType?: "FREE" | "PAID" | "FREEMIUM";
  limit?: number;
  page?: number;
};

function buildPublishedToolsWhere({
  query,
  categorySlug,
  pricingType
}: Pick<ListToolsInput, "query" | "categorySlug" | "pricingType">) {
  return {
    status: PublishStatus.PUBLISHED,
    ...(pricingType ? { pricingType } : {}),
    ...(categorySlug ? { category: { slug: categorySlug } } : {}),
    ...(query
      ? {
          OR: [
            { name: { contains: query, mode: "insensitive" as const } },
            {
              shortDescription: {
                contains: query,
                mode: "insensitive" as const
              }
            },
            {
              longDescription: {
                contains: query,
                mode: "insensitive" as const
              }
            }
          ]
        }
      : {})
  };
}

export async function searchPublishedTools({
  query,
  categorySlug,
  pricingType,
  limit = 24,
  page = 1
}: ListToolsInput = {}): Promise<PublicToolSearchResult> {
  const take = Math.min(limit, 48);
  const currentPage = Math.max(page, 1);
  const where = buildPublishedToolsWhere({ query, categorySlug, pricingType });
  const [tools, total] = await Promise.all([
    prisma.tool.findMany({
      where,
      include: toolCardInclude,
      orderBy: [
        { isFeatured: "desc" },
        { popularityScore: "desc" },
        { isVerified: "desc" },
        { publishedAt: "desc" }
      ],
      skip: (currentPage - 1) * take,
      take
    }),
    prisma.tool.count({ where })
  ]);
  const totalPages = Math.max(Math.ceil(total / take), 1);

  return {
    tools: tools.map(toPublicToolCard),
    total,
    page: currentPage,
    limit: take,
    totalPages,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1
  };
}

export async function listPublishedTools(
  input: ListToolsInput = {}
): Promise<PublicToolCard[]> {
  const result = await searchPublishedTools(input);
  return result.tools;
}

export async function listFeaturedTools(
  limit = 6
): Promise<PublicToolCard[]> {
  const tools = await prisma.tool.findMany({
    where: {
      status: PublishStatus.PUBLISHED,
      isFeatured: true
    },
    include: toolCardInclude,
    orderBy: [
      { popularityScore: "desc" },
      { isVerified: "desc" },
      { publishedAt: "desc" }
    ],
    take: Math.min(limit, 12)
  });

  return tools.map(toPublicToolCard);
}

export async function listTrendingTools(
  limit = 6
): Promise<PublicToolCard[]> {
  const tools = await prisma.tool.findMany({
    where: {
      status: PublishStatus.PUBLISHED
    },
    include: toolCardInclude,
    orderBy: [
      { popularityScore: "desc" },
      { isFeatured: "desc" },
      { isVerified: "desc" }
    ],
    take: Math.min(limit, 12)
  });

  return tools.map(toPublicToolCard);
}

export async function listRecentlyAddedTools(
  limit = 4
): Promise<PublicToolCard[]> {
  const tools = await prisma.tool.findMany({
    where: {
      status: PublishStatus.PUBLISHED
    },
    include: toolCardInclude,
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    take: Math.min(limit, 12)
  });

  return tools.map(toPublicToolCard);
}

export async function getPublishedToolBySlug(
  slug: string
): Promise<PublicToolDetail | null> {
  const tool = await prisma.tool.findFirst({
    where: {
      slug,
      status: PublishStatus.PUBLISHED
    },
    include: toolDetailInclude
  });

  if (!tool) {
    return null;
  }

  return toPublicToolDetail(tool);
}
