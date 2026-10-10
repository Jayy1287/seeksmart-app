import { ogContentType, ogSize, renderOgImage } from "@/lib/og";
import { getPublishedToolBySlug } from "@/server/tools/queries";

export const alt = "SeekSmart tool review";
export const size = ogSize;
export const contentType = ogContentType;

export default async function OpenGraphImage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = await getPublishedToolBySlug(slug);

  return renderOgImage({
    eyebrow: tool ? `${tool.category.name} tool review` : "Tool review",
    title: tool
      ? `${tool.name}: review, use cases, and alternatives`
      : "AI tool review",
    description: tool?.shortDescription
  });
}
