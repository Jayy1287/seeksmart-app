import { NextRequest } from "next/server";
import { ZodError } from "zod";
import { listToolsQuerySchema } from "@/lib/validation";
import { apiError, apiInternalError, apiOk } from "@/server/http/responses";
import {
  assertRateLimit,
  getClientIp,
  RateLimitError
} from "@/server/http/rate-limit";
import { searchPublishedTools } from "@/server/tools/queries";

export async function GET(request: NextRequest) {
  try {
    assertRateLimit({
      key: `tools-list:${getClientIp(request)}`,
      limit: 120,
      windowMs: 60 * 1000
    });

    const searchParams = request.nextUrl.searchParams;
    const query = listToolsQuerySchema.parse({
      q: searchParams.get("q") ?? undefined,
      category: searchParams.get("category") ?? undefined,
      pricing: searchParams.get("pricing") ?? undefined,
      page: searchParams.get("page") ?? undefined,
      limit: searchParams.get("limit") ?? undefined
    });

    const result = await searchPublishedTools({
      query: query.q,
      categorySlug: query.category,
      pricingType: query.pricing,
      page: query.page,
      limit: query.limit
    });

    return apiOk({
      tools: result.tools,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
        hasNextPage: result.hasNextPage,
        hasPreviousPage: result.hasPreviousPage
      }
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return apiError(
        "BAD_REQUEST",
        "Tool query parameters are invalid.",
        400,
        error.flatten()
      );
    }

    if (error instanceof RateLimitError) {
      return apiError("RATE_LIMITED", error.message, 429, {
        retryAfterSeconds: error.retryAfterSeconds
      });
    }

    console.error(error);
    return apiInternalError();
  }
}
