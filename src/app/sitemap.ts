import type { MetadataRoute } from "next";
import { articles } from "@/lib/articles";
import { playbooks } from "@/lib/platform-content";
import { siteConfig } from "@/lib/site";
import { latestDate, listSitemapEntries } from "@/server/seo/queries";

export const revalidate = 3600;

// Static editorial pages use a fixed "last meaningful change" date rather than
// the request time, so crawlers are not told everything changed every day.
const editorialLastModified = new Date("2026-10-10");

type Entry = { slug: string; updatedAt: Date };

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries = await listSitemapEntries();
  const toolsLastModified = latestDate(entries.tools, editorialLastModified);
  const useCasesLastModified = latestDate(entries.useCases, editorialLastModified);
  const industriesLastModified = latestDate(entries.industries, editorialLastModified);
  const opportunitiesLastModified = latestDate(entries.opportunities, editorialLastModified);
  const categoriesLastModified = latestDate(entries.categories, editorialLastModified);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteConfig.url, lastModified: toolsLastModified, changeFrequency: "daily", priority: 1 },
    { url: `${siteConfig.url}/tools`, lastModified: toolsLastModified, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteConfig.url}/categories`, lastModified: categoriesLastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteConfig.url}/use-cases`, lastModified: useCasesLastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteConfig.url}/industries`, lastModified: industriesLastModified, changeFrequency: "weekly", priority: 0.75 },
    { url: `${siteConfig.url}/opportunities`, lastModified: opportunitiesLastModified, changeFrequency: "weekly", priority: 0.75 },
    { url: `${siteConfig.url}/business-functions`, lastModified: opportunitiesLastModified, changeFrequency: "weekly", priority: 0.6 },
    { url: `${siteConfig.url}/playbooks`, lastModified: editorialLastModified, changeFrequency: "monthly", priority: 0.75 },
    { url: `${siteConfig.url}/articles`, lastModified: editorialLastModified, changeFrequency: "weekly", priority: 0.7 },
    { url: `${siteConfig.url}/methodology`, lastModified: editorialLastModified, changeFrequency: "monthly", priority: 0.65 },
    { url: `${siteConfig.url}/audit`, lastModified: editorialLastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteConfig.url}/resources`, lastModified: editorialLastModified, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteConfig.url}/feedback`, lastModified: editorialLastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteConfig.url}/privacy`, lastModified: editorialLastModified, changeFrequency: "yearly", priority: 0.2 },
    { url: `${siteConfig.url}/terms`, lastModified: editorialLastModified, changeFrequency: "yearly", priority: 0.2 }
  ];

  const mapEntries = (
    path: string,
    items: Entry[],
    priority: number
  ): MetadataRoute.Sitemap =>
    items.map((item) => ({
      url: `${siteConfig.url}/${path}/${item.slug}`,
      lastModified: item.updatedAt,
      changeFrequency: "weekly" as const,
      priority
    }));

  const playbookRoutes: MetadataRoute.Sitemap = playbooks.map((playbook) => ({
    url: `${siteConfig.url}/playbooks/${playbook.slug}`,
    lastModified: editorialLastModified,
    changeFrequency: "monthly",
    priority: 0.7
  }));
  const articleRoutes: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${siteConfig.url}/articles/${article.slug}`,
    lastModified: new Date(article.updatedAt),
    changeFrequency: "monthly",
    priority: 0.75
  }));

  return [
    ...staticRoutes,
    ...articleRoutes,
    ...mapEntries("tools", entries.tools, 0.8),
    ...mapEntries("use-cases", entries.useCases, 0.7),
    ...mapEntries("industries", entries.industries, 0.7),
    ...mapEntries("opportunities", entries.opportunities, 0.7),
    ...mapEntries("categories", entries.categories, 0.65),
    ...playbookRoutes
  ];
}
