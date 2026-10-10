import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/admin/",
        "/dashboard/",
        "/login",
        "/audit/results",
        "/audit/questions",
        "/submit",
        "/tools?q=",
        "/*?*page="
      ]
    },
    sitemap: `${siteConfig.url}/sitemap.xml`
  };
}
