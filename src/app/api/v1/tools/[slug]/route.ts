import { apiError, apiInternalError, apiOk } from "@/server/http/responses";
import { getPublishedToolBySlug } from "@/server/tools/queries";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { slug } = await context.params;
    const tool = await getPublishedToolBySlug(slug);

    if (!tool) {
      return apiError("NOT_FOUND", "Tool not found.", 404);
    }

    return apiOk({ tool });
  } catch (error) {
    console.error(error);
    return apiInternalError();
  }
}

