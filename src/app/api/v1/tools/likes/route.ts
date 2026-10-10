import type { NextRequest } from "next/server";
import { auth } from "@/auth";
import { apiError, apiInternalError, apiOk } from "@/server/http/responses";
import {
  assertRateLimit,
  getClientIp,
  RateLimitError
} from "@/server/http/rate-limit";
import { getToolLikeStates } from "@/server/tools/likes";

const maxIds = 60;

/**
 * Viewer-specific like state for a batch of tools. Pages are cached, so this
 * is the only per-user call a tool listing makes, and only when signed in.
 */
export async function GET(request: NextRequest) {
  try {
    assertRateLimit({
      key: `tool-likes:${getClientIp(request)}`,
      limit: 120,
      windowMs: 60 * 1000
    });

    const ids = (request.nextUrl.searchParams.get("ids") ?? "")
      .split(",")
      .map((id) => id.trim())
      .filter((id) => /^[a-z0-9]{10,40}$/i.test(id))
      .slice(0, maxIds);

    if (ids.length === 0) {
      return apiError("BAD_REQUEST", "Provide up to 60 tool ids.", 400);
    }

    const session = await auth();
    const states = await getToolLikeStates(ids, session?.user?.id);

    return apiOk(
      { states: Object.fromEntries(states) },
      { headers: { "Cache-Control": "private, no-store" } }
    );
  } catch (error) {
    if (error instanceof RateLimitError) {
      return apiError("RATE_LIMITED", error.message, 429);
    }

    console.error("Tool likes lookup failed.", error);
    return apiInternalError();
  }
}
