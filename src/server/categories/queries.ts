import { prisma } from "@/lib/prisma";
import type { PublicCategory } from "@/shared/domain";

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
