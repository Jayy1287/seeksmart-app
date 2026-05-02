import { PublishStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";
import { updateAdminToolSchema } from "@/lib/validation";

export class AdminToolConflictError extends Error {
  constructor(message = "Another tool already uses this slug or website URL.") {
    super(message);
    this.name = "AdminToolConflictError";
  }
}

function normalizeUrl(value: string) {
  const url = new URL(value);
  url.hash = "";
  url.search = "";
  url.hostname = url.hostname.replace(/^www\./, "").toLowerCase();
  url.pathname = url.pathname.replace(/\/+$/, "");

  return url.toString().replace(/\/$/, "");
}

async function assertToolUniqueness(
  toolId: string,
  slug: string,
  websiteUrl: string
) {
  const normalizedWebsiteUrl = normalizeUrl(websiteUrl);
  const duplicate = await prisma.tool.findFirst({
    where: {
      id: {
        not: toolId
      },
      OR: [
        { slug },
        { websiteUrl: { equals: websiteUrl, mode: "insensitive" } },
        { websiteUrl: { equals: normalizedWebsiteUrl, mode: "insensitive" } }
      ]
    },
    select: {
      id: true
    }
  });

  if (duplicate) {
    throw new AdminToolConflictError();
  }
}

export async function updateAdminTool(toolId: string, input: unknown) {
  const tool = await prisma.tool.findUnique({
    where: {
      id: toolId
    },
    select: {
      id: true,
      status: true,
      publishedAt: true
    }
  });

  if (!tool) {
    return null;
  }

  const update = updateAdminToolSchema.parse(input);
  const slug = slugify(update.slug);
  const websiteUrl = normalizeUrl(update.websiteUrl);

  await assertToolUniqueness(toolId, slug, websiteUrl);

  const shouldSetPublishedAt =
    update.status === PublishStatus.PUBLISHED && !tool.publishedAt;

  return prisma.$transaction(async (tx) => {
    const updatedTool = await tx.tool.update({
      where: {
        id: toolId
      },
      data: {
        name: update.name,
        slug,
        shortDescription: update.shortDescription,
        longDescription: update.longDescription,
        websiteUrl,
        logoUrl: update.logoUrl,
        categoryId: update.categoryId,
        pricingType: update.pricingType,
        hasFreePlan:
          update.hasFreePlan ||
          update.pricingType === "FREE" ||
          update.pricingType === "FREEMIUM",
        isVerified: update.isVerified,
        isFeatured: update.isFeatured,
        popularityScore: update.popularityScore,
        status: update.status,
        metaTitle: update.metaTitle,
        metaDescription: update.metaDescription,
        publishedAt: shouldSetPublishedAt ? new Date() : undefined
      },
      select: {
        id: true,
        name: true,
        slug: true,
        status: true
      }
    });

    await tx.toolFeature.deleteMany({
      where: {
        toolId
      }
    });

    if (update.featureIds.length > 0) {
      await tx.toolFeature.createMany({
        data: update.featureIds.map((featureId) => ({
          toolId,
          featureId
        })),
        skipDuplicates: true
      });
    }

    await tx.toolUseCase.deleteMany({
      where: {
        toolId
      }
    });

    if (update.useCaseIds.length > 0) {
      await tx.toolUseCase.createMany({
        data: update.useCaseIds.map((useCaseId) => ({
          toolId,
          useCaseId
        })),
        skipDuplicates: true
      });
    }

    await tx.adminAction.create({
      data: {
        action: "UPDATE_TOOL",
        entityType: "Tool",
        entityId: toolId,
        metadata: {
          status: update.status,
          featureIds: update.featureIds,
          useCaseIds: update.useCaseIds
        }
      }
    });

    return {
      tool: updatedTool
    };
  });
}
