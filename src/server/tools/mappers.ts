import type { Prisma } from "@prisma/client";
import type { PublicToolCard, PublicToolDetail } from "@/shared/domain";

export const toolCardInclude = {
  category: true
} satisfies Prisma.ToolInclude;

export const toolDetailInclude = {
  category: true,
  toolFeatures: {
    include: {
      feature: true
    },
    orderBy: {
      feature: {
        name: "asc"
      }
    }
  },
  toolUseCases: {
    include: {
      useCase: {
        include: {
          opportunityUseCases: {
            include: {
              opportunity: {
                select: {
                  id: true,
                  name: true,
                  slug: true
                }
              }
            },
            orderBy: {
              priority: "asc"
            }
          }
        }
      }
    },
    orderBy: {
      useCase: {
        name: "asc"
      }
    }
  },
  sourceTools: {
    include: {
      alternativeTool: {
        include: toolCardInclude
      }
    }
  }
} satisfies Prisma.ToolInclude;

type ToolCardPayload = Prisma.ToolGetPayload<{
  include: typeof toolCardInclude;
}>;

type ToolDetailPayload = Prisma.ToolGetPayload<{
  include: typeof toolDetailInclude;
}>;

type ToolAlternativePayload = ToolDetailPayload["sourceTools"][number];

export function toPublicToolCard(tool: ToolCardPayload): PublicToolCard {
  return {
    id: tool.id,
    name: tool.name,
    slug: tool.slug,
    shortDescription: tool.shortDescription,
    websiteUrl: tool.websiteUrl,
    logoUrl: tool.logoUrl,
    pricingType: tool.pricingType,
    hasFreePlan: tool.hasFreePlan,
    isVerified: tool.isVerified,
    isFeatured: tool.isFeatured,
    popularityScore: tool.popularityScore,
    category: {
      id: tool.category.id,
      name: tool.category.name,
      slug: tool.category.slug,
      description: tool.category.description
    }
  };
}

export function toPublicToolDetail(tool: ToolDetailPayload): PublicToolDetail {
  return {
    ...toPublicToolCard(tool),
    longDescription: tool.longDescription,
    metaTitle: tool.metaTitle,
    metaDescription: tool.metaDescription,
    features: tool.toolFeatures.map(({ feature }) => ({
      id: feature.id,
      name: feature.name,
      slug: feature.slug,
      description: feature.description
    })),
    useCases: tool.toolUseCases.map((toolUseCase) => ({
      fitScore: toolUseCase.fitScore,
      recommendationNote: toolUseCase.recommendationNote,
      bestFor: toolUseCase.bestFor,
      limitations: toolUseCase.limitations,
      implementationNote: toolUseCase.implementationNote,
      pricingSuitability: toolUseCase.pricingSuitability,
      id: toolUseCase.useCase.id,
      name: toolUseCase.useCase.name,
      slug: toolUseCase.useCase.slug,
      description: toolUseCase.useCase.description,
      outcome: toolUseCase.useCase.outcome,
      effortLevel: toolUseCase.useCase.effortLevel,
      riskLevel: toolUseCase.useCase.riskLevel,
      timeToValue: toolUseCase.useCase.timeToValue,
      opportunities: toolUseCase.useCase.opportunityUseCases.map(
        ({ opportunity }) => opportunity
      )
    })),
    alternatives: tool.sourceTools.map(toPublicAlternativeTool)
  };
}

function toPublicAlternativeTool(
  alternative: ToolAlternativePayload
): PublicToolCard {
  return toPublicToolCard(alternative.alternativeTool);
}
