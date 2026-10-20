import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Builds pre-render ~250 pages. Against a transaction-mode pooler that
// churns connections, so during `next build` prefer a dedicated URL (usually
// the session pooler or direct connection with a small connection_limit).
// Runtime keeps DATABASE_URL (transaction pooler, right for serverless).
const isBuildPhase = process.env.NEXT_PHASE === "phase-production-build";
const datasourceUrl =
  (isBuildPhase && (process.env.BUILD_DATABASE_URL || process.env.DIRECT_URL)) ||
  process.env.DATABASE_URL;

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    ...(datasourceUrl ? { datasourceUrl } : {}),
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"]
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
