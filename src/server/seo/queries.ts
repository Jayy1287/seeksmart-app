import { PublishStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type SitemapEntry = {
  slug: string;
  updatedAt: Date;
};

export async function listSitemapEntries(): Promise<{
  tools: SitemapEntry[];
  categories: SitemapEntry[];
  useCases: SitemapEntry[];
  industries: SitemapEntry[];
  opportunities: SitemapEntry[];
}> {
  const select = { slug: true, updatedAt: true } as const;
  const [tools, categories, useCases, industries, opportunities] =
    await Promise.all([
      prisma.tool.findMany({
        where: { status: PublishStatus.PUBLISHED, isFeatured: true },
        select,
        orderBy: { updatedAt: "desc" }
      }),
      prisma.category.findMany({ select }),
      prisma.useCase.findMany({ select }),
      prisma.industry.findMany({
        where: { status: PublishStatus.PUBLISHED },
        select
      }),
      prisma.opportunity.findMany({
        where: { status: PublishStatus.PUBLISHED },
        select
      })
    ]);

  return { tools, categories, useCases, industries, opportunities };
}

export function latestDate(entries: SitemapEntry[], fallback: Date) {
  return entries.reduce(
    (latest, entry) => (entry.updatedAt > latest ? entry.updatedAt : latest),
    fallback
  );
}
