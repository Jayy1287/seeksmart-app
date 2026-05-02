import { PublishStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  toPublicToolCard,
  toPublicToolDetail,
  toolCardInclude,
  toolDetailInclude
} from "./mappers";
import type { PublicToolCard, PublicToolDetail } from "@/shared/domain";

type ListToolsInput = {
  query?: string;
  categorySlug?: string;
  pricingType?: "FREE" | "PAID" | "FREEMIUM";
  limit?: number;
};

export async function listPublishedTools({
  query,
  categorySlug,
  pricingType,
  limit = 24
}: ListToolsInput = {}): Promise<PublicToolCard[]> {
  const tools = await prisma.tool.findMany({
    where: {
      status: PublishStatus.PUBLISHED,
      ...(pricingType ? { pricingType } : {}),
      ...(categorySlug ? { category: { slug: categorySlug } } : {}),
      ...(query
        ? {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { shortDescription: { contains: query, mode: "insensitive" } },
              { longDescription: { contains: query, mode: "insensitive" } }
            ]
          }
        : {})
    },
    include: toolCardInclude,
    orderBy: [
      { isFeatured: "desc" },
      { popularityScore: "desc" },
      { isVerified: "desc" },
      { publishedAt: "desc" }
    ],
    take: Math.min(limit, 100)
  });

  return tools.map(toPublicToolCard);
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
