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
      useCase: true
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
    useCases: tool.toolUseCases.map(({ useCase }) => ({
      id: useCase.id,
      name: useCase.name,
      slug: useCase.slug,
      description: useCase.description
    })),
    alternatives: tool.sourceTools.map(toPublicAlternativeTool)
  };
}

function toPublicAlternativeTool(
  alternative: ToolAlternativePayload
): PublicToolCard {
  return toPublicToolCard(alternative.alternativeTool);
}
