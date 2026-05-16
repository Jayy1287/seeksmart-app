"use server";

import { Prisma, PublishStatus } from "@prisma/client";
import type { Route } from "next";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { assertRateLimit } from "@/server/http/rate-limit";
import { getToolLikeState } from "@/server/tools/likes";
import type { ToolLikeState } from "@/shared/domain";

type ToggleToolLikeInput = {
  redirectTo?: string;
  toolId: string;
  toolSlug: string;
};

type TogglePublishedToolLikeInput = {
  redirectTo: string;
  toolId: string;
  toolSlug: string;
};

export async function toggleToolLikeAction(formData: FormData) {
  const toolId = readFormValue(formData, "toolId");
  const toolSlug = readFormValue(formData, "toolSlug");
  const redirectTo = sanitizeRedirectPath(
    readFormValue(formData, "redirectTo") ?? `/tools/${toolSlug ?? ""}`
  );

  if (!toolId || !toolSlug) {
    throw new Error("Missing tool like target.");
  }

  await togglePublishedToolLike({
    redirectTo,
    toolId,
    toolSlug
  });
  redirect(redirectTo as Route);
}

export async function toggleToolLikeStateAction({
  redirectTo: rawRedirectTo,
  toolId: rawToolId,
  toolSlug: rawToolSlug
}: ToggleToolLikeInput): Promise<ToolLikeState> {
  const toolId = rawToolId.trim();
  const toolSlug = rawToolSlug.trim();
  const redirectTo = sanitizeRedirectPath(rawRedirectTo ?? `/tools/${toolSlug}`);
  const result = await togglePublishedToolLike({
    redirectTo,
    toolId,
    toolSlug
  });

  return getToolLikeState(result.toolId, result.userId);
}

async function togglePublishedToolLike({
  redirectTo,
  toolId,
  toolSlug
}: TogglePublishedToolLikeInput) {
  if (!toolId || !toolSlug) {
    throw new Error("Missing tool like target.");
  }

  const session = await auth();

  if (!session?.user?.id) {
    redirect(`/login?callbackUrl=${encodeURIComponent(redirectTo)}`);
  }

  assertRateLimit({
    key: `tool-like:${session.user.id}`,
    limit: 90,
    windowMs: 60 * 1000
  });

  const tool = await prisma.tool.findFirst({
    where: {
      id: toolId,
      slug: toolSlug,
      status: PublishStatus.PUBLISHED
    },
    select: {
      id: true,
      slug: true
    }
  });

  if (!tool) {
    throw new Error("Tool not found.");
  }

  const where = {
    userId_toolId: {
      userId: session.user.id,
      toolId: tool.id
    }
  };
  const existingLike = await prisma.toolLike.findUnique({ where });

  if (existingLike) {
    await prisma.toolLike.delete({ where });
  } else {
    try {
      await prisma.toolLike.create({
        data: {
          toolId: tool.id,
          userId: session.user.id
        }
      });
    } catch (error) {
      if (!isUniqueConstraintError(error)) {
        throw error;
      }
    }
  }

  revalidateLikeSurfaces(tool.slug, redirectTo);

  return {
    toolId: tool.id,
    toolSlug: tool.slug,
    userId: session.user.id
  };
}

function readFormValue(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : null;
}

function sanitizeRedirectPath(value: string | null) {
  if (
    value &&
    value.startsWith("/") &&
    !value.startsWith("//") &&
    !value.startsWith("/api/")
  ) {
    return value.slice(0, 500);
  }

  return "/dashboard";
}

function revalidateLikeSurfaces(toolSlug: string, redirectTo: string) {
  const currentPath = redirectTo.split("?")[0] || "/";
  const paths = new Set([
    currentPath,
    "/dashboard",
    "/tools",
    `/tools/${toolSlug}`
  ]);

  for (const path of paths) {
    revalidatePath(path);
  }
}

function isUniqueConstraintError(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  );
}
