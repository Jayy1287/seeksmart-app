import type { MetadataRoute } from "next";
import { playbooks } from "@/lib/platform-content";
import { siteConfig } from "@/lib/site";
import { listCategories } from "@/server/categories/queries";
import {
  listBusinessFunctions,
  listIndustrySummaries,
  listOpportunitySummaries
} from "@/server/intelligence/queries";
import { listPublishedTools } from "@/server/tools/queries";
import { listUseCaseSummaries } from "@/server/use-cases/queries";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, tools, useCases, industries, opportunities, functions] =
    await Promise.all([
    listCategories(),
    listPublishedTools({ limit: 100 }),
    listUseCaseSummaries(),
    listIndustrySummaries(),
    listOpportunitySummaries(),
    listBusinessFunctions()
  ]);
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteConfig.url,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1
    },
    {
      url: `${siteConfig.url}/tools`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9
    },
    {
      url: `${siteConfig.url}/categories`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8
    },
    {
      url: `${siteConfig.url}/use-cases`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8
    },
    {
      url: `${siteConfig.url}/industries`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.75
    },
    {
      url: `${siteConfig.url}/playbooks`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.75
    },
    {
      url: `${siteConfig.url}/methodology`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.65
    },
    {
      url: `${siteConfig.url}/audit`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.65
    },
    {
      url: `${siteConfig.url}/audit/start`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6
    },
    {
      url: `${siteConfig.url}/audit/questions`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5
    },
    {
      url: `${siteConfig.url}/resources`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.65
    },
    {
      url: `${siteConfig.url}/opportunities`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.75
    },
    {
      url: `${siteConfig.url}/business-functions`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.65
    },
    {
      url: `${siteConfig.url}/submit`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4
    }
  ];
  const categoryRoutes = categories.map((category) => ({
    url: `${siteConfig.url}/categories/${category.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7
  }));
  const toolRoutes = tools.map((tool) => ({
    url: `${siteConfig.url}/tools/${tool.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8
  }));
  const useCaseRoutes = useCases.map((useCase) => ({
    url: `${siteConfig.url}/use-cases/${useCase.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7
  }));
  const industryRoutes = industries.map((industry) => ({
    url: `${siteConfig.url}/industries/${industry.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7
  }));
  const playbookRoutes = playbooks.map((playbook) => ({
    url: `${siteConfig.url}/playbooks/${playbook.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7
  }));
  const opportunityRoutes = opportunities.map((opportunity) => ({
    url: `${siteConfig.url}/opportunities/${opportunity.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7
  }));
  const functionRoutes = functions.map((businessFunction) => ({
    url: `${siteConfig.url}/business-functions#${businessFunction.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.5
  }));

  return [
    ...staticRoutes,
    ...categoryRoutes,
    ...useCaseRoutes,
    ...industryRoutes,
    ...opportunityRoutes,
    ...functionRoutes,
    ...playbookRoutes,
    ...toolRoutes
  ];
}
