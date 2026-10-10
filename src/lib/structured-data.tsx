import { absoluteUrl, siteConfig } from "@/lib/site";

type JsonLdValue = Record<string, unknown>;

export function JsonLd({ data }: { data: JsonLdValue | JsonLdValue[] }) {
  const items = Array.isArray(data) ? data : [data];

  return (
    <>
      {items.map((item, index) => (
        <script
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
          key={index}
          type="application/ld+json"
        />
      ))}
    </>
  );
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: absoluteUrl("/"),
    logo: absoluteUrl("/brand/seeksmart-logo-v3.png"),
    description: siteConfig.description
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: absoluteUrl("/"),
    inLanguage: "en"
  };
}

export function breadcrumbJsonLd(
  items: Array<{ name: string; path: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...items].map(
      (item, index) => ({
        "@type": "ListItem",
        item: absoluteUrl(item.path),
        name: item.name,
        position: index + 1
      })
    )
  };
}

export function softwareApplicationJsonLd(tool: {
  name: string;
  slug: string;
  shortDescription: string;
  longDescription: string | null;
  websiteUrl: string;
  logoUrl: string | null;
  pricingType: "FREE" | "PAID" | "FREEMIUM";
  hasFreePlan: boolean;
  category: { name: string };
}) {
  const isFreeEntry = tool.pricingType === "FREE" || tool.hasFreePlan;

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    url: absoluteUrl(`/tools/${tool.slug}`),
    sameAs: tool.websiteUrl,
    description: tool.longDescription ?? tool.shortDescription,
    applicationCategory: "BusinessApplication",
    applicationSubCategory: tool.category.name,
    operatingSystem: "Web",
    ...(tool.logoUrl ? { image: tool.logoUrl } : {}),
    offers: {
      "@type": "Offer",
      ...(isFreeEntry ? { price: "0" } : {}),
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      description:
        tool.pricingType === "FREE"
          ? "Free"
          : tool.pricingType === "FREEMIUM"
            ? "Free plan available, paid tiers for more usage"
            : "Paid plans"
    }
  };
}

export function itemListJsonLd(
  name: string,
  items: Array<{ name: string; path: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: absoluteUrl(item.path)
    }))
  };
}
