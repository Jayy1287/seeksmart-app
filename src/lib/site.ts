export const siteConfig = {
  name: "SeekSmart",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  description:
    "Find the right AI workflow before you buy, with practical guidance, clear next steps, and curated tool shortlists."
};

export function absoluteUrl(path = "/") {
  return new URL(path, siteConfig.url).toString();
}
