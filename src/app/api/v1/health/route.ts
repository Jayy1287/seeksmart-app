import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiError, apiOk } from "@/server/http/responses";

/**
 * GET /api/v1/health            -> process is up (no database access)
 * GET /api/v1/health?db=1       -> also runs SELECT 1 against the database
 *
 * The db variant is what the daily keep-alive workflow calls, so a free-tier
 * database that pauses on inactivity keeps seeing traffic.
 */
export async function GET(request: NextRequest) {
  const checkDatabase = request.nextUrl.searchParams.get("db") === "1";

  if (!checkDatabase) {
    return apiOk({ service: "seeksmart-api", version: "v1", status: "healthy" });
  }

  try {
    await prisma.$queryRaw`SELECT 1`;
    return apiOk({
      service: "seeksmart-api",
      version: "v1",
      status: "healthy",
      database: "reachable"
    });
  } catch (error) {
    console.error("Health check: database unreachable.", error);
    return apiError("SERVICE_UNAVAILABLE", "Database unreachable.", 503, {
      database: "unreachable"
    });
  }
}
