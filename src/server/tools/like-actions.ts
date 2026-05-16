"use server";

import { Prisma, PublishStatus } from "@prisma/client";
import type { Route } from "next";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function toggleToolLikeAction(formData: FormData) {
  const toolId = readFormValue(formData, "toolId");
  const toolSlug = readFormValue(formData, "toolSlug");
  const redirectTo = sanitizeRedirectPath(
    readFormValue(formData, "redirectTo") ?? `/tools/${toolSlug ?? ""}`
  );

  if (!toolId || !toolSlug) {
    throw new Error("Missing tool like target.");
  }

  const session = await auth();

  if (!session?.user?.id) {
    redirect(`/login?callbackUrl=${encodeURIComponent(redirectTo)}`);
  }

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
  redirect(redirectTo as Route);
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
    !value.startsWith("/api/auth")
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
