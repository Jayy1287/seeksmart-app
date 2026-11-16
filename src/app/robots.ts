import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

const disallow = [
  "/api/",
  "/admin/",
  "/dashboard/",
  "/login",
  "/audit/results",
  "/audit/questions",
  "/submit",
  "/tools?*",
  "/*?*page="
];

// Crawlers that bring no visitors or citations but re-crawl every page and
// trigger server renders. Search engines and the AI assistants people use to
// find tools stay allowed.
const blockedCrawlers = [
  "AhrefsBot",
  "SemrushBot",
  "MJ12bot",
  "DotBot",
  "DataForSeoBot",
  "Bytespider",
  "PetalBot",
  "BLEXBot",
  "SeekportBot",
  "serpstatbot"
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow,
        crawlDelay: 5
      },
      ...blockedCrawlers.map((userAgent) => ({ userAgent, disallow: "/" }))
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`
  };
}
