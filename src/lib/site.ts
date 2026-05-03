export const siteConfig = {
  name: "SeekSmart",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  description:
    "Make clearer AI decisions for your business with practical use cases, playbooks, and curated tool guidance."
};

export function absoluteUrl(path = "/") {
  return new URL(path, siteConfig.url).toString();
}
