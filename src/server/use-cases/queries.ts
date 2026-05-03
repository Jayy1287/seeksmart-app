import { PublishStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { toPublicToolCard, toolCardInclude } from "@/server/tools/mappers";
import type { PublicTaxonomyItem, PublicToolCard } from "@/shared/domain";

export type PublicUseCaseSummary = PublicTaxonomyItem & {
  businessFunction: {
    name: string;
    slug: string;
  } | null;
  effortLevel: string;
  riskLevel: string;
  timeToValue: string | null;
  outcome: string | null;
  toolCount: number;
};

export type PublicUseCaseDetail = PublicUseCaseSummary & {
  painPoints: string[];
  requiredInputs: string[];
  successMetrics: string[];
  implementationSteps: string[];
  opportunities: Array<{
    id: string;
    name: string;
    slug: string;
    expectedBenefit: string | null;
    startingPoint: string | null;
  }>;
};

export type PublicUseCaseToolFit = PublicToolCard & {
  fitScore: number;
  recommendationNote: string | null;
  bestFor: string | null;
  limitations: string | null;
  implementationNote: string | null;
  pricingSuitability: string | null;
};

export async function listUseCaseSummaries(): Promise<PublicUseCaseSummary[]> {
  const useCases = await prisma.useCase.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      outcome: true,
      effortLevel: true,
      riskLevel: true,
      timeToValue: true,
      businessFunction: {
        select: {
          name: true,
          slug: true
        }
      },
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
      businessFunction: useCase.businessFunction,
      effortLevel: useCase.effortLevel,
      riskLevel: useCase.riskLevel,
      timeToValue: useCase.timeToValue,
      outcome: useCase.outcome,
      toolCount: useCase._count.toolUseCases
    }))
    .sort((useCaseA, useCaseB) => useCaseB.toolCount - useCaseA.toolCount);
}

export async function getUseCaseBySlug(
  slug: string
): Promise<PublicUseCaseDetail | null> {
  const useCase = await prisma.useCase.findUnique({
    where: {
      slug
    },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      outcome: true,
      painPoints: true,
      requiredInputs: true,
      successMetrics: true,
      implementationSteps: true,
      effortLevel: true,
      riskLevel: true,
      timeToValue: true,
      businessFunction: {
        select: {
          name: true,
          slug: true
        }
      },
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
      },
      opportunityUseCases: {
        where: {
          opportunity: {
            status: PublishStatus.PUBLISHED
          }
        },
        select: {
          priority: true,
          opportunity: {
            select: {
              id: true,
              name: true,
              slug: true,
              expectedBenefit: true,
              startingPoint: true
            }
          }
        },
        orderBy: {
          priority: "asc"
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
    businessFunction: useCase.businessFunction,
    effortLevel: useCase.effortLevel,
    riskLevel: useCase.riskLevel,
    timeToValue: useCase.timeToValue,
    outcome: useCase.outcome,
    painPoints: useCase.painPoints,
    requiredInputs: useCase.requiredInputs,
    successMetrics: useCase.successMetrics,
    implementationSteps: useCase.implementationSteps,
    toolCount: useCase._count.toolUseCases,
    opportunities: useCase.opportunityUseCases.map(({ opportunity }) => opportunity)
  };
}

export async function listToolsForUseCase(
  slug: string
): Promise<PublicUseCaseToolFit[]> {
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

  return toolUseCases.map((toolUseCase) => ({
    ...toPublicToolCard(toolUseCase.tool),
    fitScore: toolUseCase.fitScore,
    recommendationNote: toolUseCase.recommendationNote,
    bestFor: toolUseCase.bestFor,
    limitations: toolUseCase.limitations,
    implementationNote: toolUseCase.implementationNote,
    pricingSuitability: toolUseCase.pricingSuitability
  }));
}
