import { PublishStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { hasRichToolContent } from "@/server/tools/content-quality";

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
      prisma.tool
        .findMany({
          where: { status: PublishStatus.PUBLISHED },
          select: { ...select, longDescription: true, bestFor: true, notFor: true },
          orderBy: { updatedAt: "desc" }
        })
        .then((rows) =>
          rows
            .filter(hasRichToolContent)
            .map(({ slug, updatedAt }) => ({ slug, updatedAt }))
        ),
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
