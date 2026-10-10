import { ogContentType, ogSize, renderOgImage } from "@/lib/og";
import { getIndustryBySlug } from "@/server/intelligence/queries";

export const alt = "SeekSmart industry AI roadmap";
export const size = ogSize;
export const contentType = ogContentType;

export default async function OpenGraphImage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const industry = await getIndustryBySlug(slug);

  return renderOgImage({
    eyebrow: "Industry AI roadmap",
    title: industry
      ? `AI for ${industry.name}: where to start`
      : "Industry AI roadmap",
    description: industry?.description
  });
}
