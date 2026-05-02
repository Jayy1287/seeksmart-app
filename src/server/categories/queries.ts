import { prisma } from "@/lib/prisma";
import type { PublicCategory, PublicCategorySummary } from "@/shared/domain";

export async function listCategories(): Promise<PublicCategory[]> {
  return prisma.category.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      description: true
    },
    orderBy: {
      name: "asc"
    }
  });
}

export async function getCategoryBySlug(
  slug: string
): Promise<PublicCategory | null> {
  return prisma.category.findUnique({
    where: {
      slug
    },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true
    }
  });
}

export async function listCategorySummaries(): Promise<PublicCategorySummary[]> {
  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      _count: {
        select: {
          tools: {
            where: {
              status: "PUBLISHED"
            }
          }
        }
      }
    },
    orderBy: {
      name: "asc"
    }
  });

  return categories
    .map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      toolCount: category._count.tools
    }))
    .sort((categoryA, categoryB) => categoryB.toolCount - categoryA.toolCount);
}

export async function getCategorySummaryBySlug(
  slug: string
): Promise<PublicCategorySummary | null> {
  const category = await prisma.category.findUnique({
    where: {
      slug
    },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      _count: {
        select: {
          tools: {
            where: {
              status: "PUBLISHED"
            }
          }
        }
      }
    }
  });

  if (!category) {
    return null;
  }

  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    toolCount: category._count.tools
  };
}
