import type { Category, Tool } from "@prisma/client";
import type { PublicToolCard } from "@/shared/domain";

type ToolWithCategory = Tool & {
  category: Category;
};

export function toPublicToolCard(tool: ToolWithCategory): PublicToolCard {
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
    category: {
      id: tool.category.id,
      name: tool.category.name,
      slug: tool.category.slug,
      description: tool.category.description
    }
  };
}

