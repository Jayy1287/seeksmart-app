import { ogContentType, ogSize, renderOgImage } from "@/lib/og";
import { getOpportunityBySlug } from "@/server/intelligence/queries";

export const alt = "SeekSmart AI opportunity";
export const size = ogSize;
export const contentType = ogContentType;

export default async function OpenGraphImage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const opportunity = await getOpportunityBySlug(slug);

  return renderOgImage({
    eyebrow: "AI opportunity",
    title: opportunity?.name ?? "AI opportunity",
    description: opportunity?.expectedBenefit ?? opportunity?.description
  });
}
