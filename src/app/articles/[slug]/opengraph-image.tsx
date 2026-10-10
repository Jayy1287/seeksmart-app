import { getArticleBySlug } from "@/lib/articles";
import { ogContentType, ogSize, renderOgImage } from "@/lib/og";

export const alt = "SeekSmart article";
export const size = ogSize;
export const contentType = ogContentType;

export default async function OpenGraphImage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  return renderOgImage({
    eyebrow: "Buying guide",
    title: article?.title ?? "SeekSmart article",
    description: article?.description
  });
}
