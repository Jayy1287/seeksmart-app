import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { listCategories } from "@/server/categories/queries";
import { listPublishedTools } from "@/server/tools/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, tools] = await Promise.all([
    listCategories(),
    listPublishedTools({ limit: 100 })
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

  return [...staticRoutes, ...categoryRoutes, ...toolRoutes];
}
