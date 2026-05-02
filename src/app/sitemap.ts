import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { listCategories } from "@/server/categories/queries";
import { listPublishedTools } from "@/server/tools/queries";
import { listUseCaseSummaries } from "@/server/use-cases/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, tools, useCases] = await Promise.all([
    listCategories(),
    listPublishedTools({ limit: 100 }),
    listUseCaseSummaries()
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

  return [...staticRoutes, ...categoryRoutes, ...useCaseRoutes, ...toolRoutes];
}
