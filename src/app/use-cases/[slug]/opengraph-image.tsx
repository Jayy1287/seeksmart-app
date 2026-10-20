import { ogContentType, ogSize, renderOgImage } from "@/lib/og";
import { getUseCaseBySlug } from "@/server/use-cases/queries";

export const alt = "SeekSmart AI use case";
export const size = ogSize;
export const contentType = ogContentType;

export default async function OpenGraphImage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const useCase = await getUseCaseBySlug(slug);

  return renderOgImage({
    eyebrow: "AI use case",
    title: useCase
      ? `${useCase.name}: how to use AI, and which tools fit`
      : "AI use case",
    description: useCase?.outcome ?? useCase?.description
  });
}
