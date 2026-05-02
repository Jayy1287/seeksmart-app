export const siteConfig = {
  name: "SeekSmart",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  description:
    "Discover AI tools by category, use case, pricing, and alternatives."
};

export function absoluteUrl(path = "/") {
  return new URL(path, siteConfig.url).toString();
}
