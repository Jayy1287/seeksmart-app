import { NextRequest } from "next/server";
import { ZodError } from "zod";
import { listToolsQuerySchema } from "@/lib/validation";
import { apiError, apiInternalError, apiOk } from "@/server/http/responses";
import { listPublishedTools } from "@/server/tools/queries";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = listToolsQuerySchema.parse({
      q: searchParams.get("q") ?? undefined,
      category: searchParams.get("category") ?? undefined,
      pricing: searchParams.get("pricing") ?? undefined
    });

    const tools = await listPublishedTools({
      query: query.q,
      categorySlug: query.category,
      pricingType: query.pricing
    });

    return apiOk({ tools });
  } catch (error) {
    if (error instanceof ZodError) {
      return apiError(
        "BAD_REQUEST",
        "Tool query parameters are invalid.",
        400,
        error.flatten()
      );
    }

    console.error(error);
    return apiInternalError();
  }
}
