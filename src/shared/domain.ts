export type PricingType = "FREE" | "PAID" | "FREEMIUM";

export type PublishStatus =
  | "DRAFT"
  | "PENDING_REVIEW"
  | "PUBLISHED"
  | "REJECTED"
  | "ARCHIVED";

export type PublicCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
};

export type PublicCategorySummary = PublicCategory & {
  toolCount: number;
};

export type PublicTaxonomyItem = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
};

export type PublicToolCard = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  websiteUrl: string;
  logoUrl: string | null;
  pricingType: PricingType;
  hasFreePlan: boolean;
  isVerified: boolean;
  isFeatured: boolean;
  popularityScore: number;
  category: PublicCategory;
};

export type PublicToolDetail = PublicToolCard & {
  longDescription: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  features: PublicTaxonomyItem[];
  useCases: PublicTaxonomyItem[];
  alternatives: PublicToolCard[];
};

export type PublicToolSearchResult = {
  tools: PublicToolCard[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};
