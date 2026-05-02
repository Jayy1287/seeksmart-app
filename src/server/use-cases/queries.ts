import { PublishStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { toPublicToolCard, toolCardInclude } from "@/server/tools/mappers";
import type { PublicTaxonomyItem, PublicToolCard } from "@/shared/domain";

export type PublicUseCaseSummary = PublicTaxonomyItem & {
  toolCount: number;
};

export async function listUseCaseSummaries(): Promise<PublicUseCaseSummary[]> {
  const useCases = await prisma.useCase.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      _count: {
        select: {
          toolUseCases: {
            where: {
              tool: {
                status: PublishStatus.PUBLISHED
              }
            }
          }
        }
      }
    },
    orderBy: {
      name: "asc"
    }
  });

  return useCases
    .map((useCase) => ({
      id: useCase.id,
      name: useCase.name,
      slug: useCase.slug,
      description: useCase.description,
      toolCount: useCase._count.toolUseCases
    }))
    .sort((useCaseA, useCaseB) => useCaseB.toolCount - useCaseA.toolCount);
}

export async function getUseCaseBySlug(
  slug: string
): Promise<PublicUseCaseSummary | null> {
  const useCase = await prisma.useCase.findUnique({
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
          toolUseCases: {
            where: {
              tool: {
                status: PublishStatus.PUBLISHED
              }
            }
          }
        }
      }
    }
  });

  if (!useCase) {
    return null;
  }

  return {
    id: useCase.id,
    name: useCase.name,
    slug: useCase.slug,
    description: useCase.description,
    toolCount: useCase._count.toolUseCases
  };
}

export async function listToolsForUseCase(
  slug: string
): Promise<PublicToolCard[]> {
  const toolUseCases = await prisma.toolUseCase.findMany({
    where: {
      useCase: {
        slug
      },
      tool: {
        status: PublishStatus.PUBLISHED
      }
    },
    include: {
      tool: {
        include: toolCardInclude
      }
    },
    orderBy: [
      {
        tool: {
          isFeatured: "desc"
        }
      },
      {
        tool: {
          popularityScore: "desc"
        }
      }
    ]
  });

  return toolUseCases.map((toolUseCase) => toPublicToolCard(toolUseCase.tool));
}
