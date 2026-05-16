import { PublishStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";
import {
  adminBusinessFunctionSchema,
  adminIndustrySchema,
  adminOpportunitySchema,
  adminUseCaseIntelligenceSchema,
  updateAdminToolSchema
} from "@/lib/validation";

export class AdminToolConflictError extends Error {
  constructor(message = "Another tool already uses this slug or website URL.") {
    super(message);
    this.name = "AdminToolConflictError";
  }
}

function normalizeUrl(value: string) {
  const url = new URL(value);

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new TypeError("URL must use http or https.");
  }

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

export async function upsertAdminBusinessFunction(id: string | null, input: unknown) {
  const data = adminBusinessFunctionSchema.parse(input);
  const slug = slugify(data.slug ?? data.name);

  const record = id
    ? await prisma.businessFunction.update({
        where: { id },
        data: {
          name: data.name,
          slug,
          description: data.description,
          status: data.status,
          sortOrder: data.sortOrder
        }
      })
    : await prisma.businessFunction.create({
        data: {
          name: data.name,
          slug,
          description: data.description,
          status: data.status,
          sortOrder: data.sortOrder
        }
      });

  await prisma.adminAction.create({
    data: {
      action: id ? "UPDATE_BUSINESS_FUNCTION" : "CREATE_BUSINESS_FUNCTION",
      entityType: "BusinessFunction",
      entityId: record.id,
      metadata: {
        slug,
        status: data.status
      }
    }
  });

  return record;
}

export async function upsertAdminIndustry(id: string | null, input: unknown) {
  const data = adminIndustrySchema.parse(input);
  const slug = slugify(data.slug ?? data.name);

  const record = id
    ? await prisma.industry.update({
        where: { id },
        data: {
          name: data.name,
          slug,
          description: data.description,
          startingPoint: data.startingPoint,
          cautions: data.cautions,
          status: data.status,
          sortOrder: data.sortOrder,
          metaTitle: data.metaTitle,
          metaDescription: data.metaDescription
        }
      })
    : await prisma.industry.create({
        data: {
          name: data.name,
          slug,
          description: data.description,
          startingPoint: data.startingPoint,
          cautions: data.cautions,
          status: data.status,
          sortOrder: data.sortOrder,
          metaTitle: data.metaTitle,
          metaDescription: data.metaDescription
        }
      });

  await prisma.adminAction.create({
    data: {
      action: id ? "UPDATE_INDUSTRY" : "CREATE_INDUSTRY",
      entityType: "Industry",
      entityId: record.id,
      metadata: {
        slug,
        status: data.status
      }
    }
  });

  return record;
}

export async function upsertAdminOpportunity(id: string | null, input: unknown) {
  const data = adminOpportunitySchema.parse(input);
  const slug = slugify(data.slug ?? data.name);

  return prisma.$transaction(async (tx) => {
    const record = id
      ? await tx.opportunity.update({
          where: { id },
          data: {
            name: data.name,
            slug,
            description: data.description,
            painPoint: data.painPoint,
            expectedBenefit: data.expectedBenefit,
            startingPoint: data.startingPoint,
            effortLevel: data.effortLevel,
            riskLevel: data.riskLevel,
            timeToValue: data.timeToValue,
            successMetrics: data.successMetrics,
            status: data.status,
            sortOrder: data.sortOrder,
            businessFunctionId: data.businessFunctionId,
            metaTitle: data.metaTitle,
            metaDescription: data.metaDescription
          }
        })
      : await tx.opportunity.create({
          data: {
            name: data.name,
            slug,
            description: data.description,
            painPoint: data.painPoint,
            expectedBenefit: data.expectedBenefit,
            startingPoint: data.startingPoint,
            effortLevel: data.effortLevel,
            riskLevel: data.riskLevel,
            timeToValue: data.timeToValue,
            successMetrics: data.successMetrics,
            status: data.status,
            sortOrder: data.sortOrder,
            businessFunctionId: data.businessFunctionId,
            metaTitle: data.metaTitle,
            metaDescription: data.metaDescription
          }
        });

    await tx.industryOpportunity.deleteMany({
      where: {
        opportunityId: record.id
      }
    });

    if (data.industryIds.length > 0) {
      await tx.industryOpportunity.createMany({
        data: data.industryIds.map((industryId, priority) => ({
          opportunityId: record.id,
          industryId,
          priority
        })),
        skipDuplicates: true
      });
    }

    await tx.opportunityUseCase.deleteMany({
      where: {
        opportunityId: record.id
      }
    });

    if (data.useCaseIds.length > 0) {
      await tx.opportunityUseCase.createMany({
        data: data.useCaseIds.map((useCaseId, priority) => ({
          opportunityId: record.id,
          useCaseId,
          priority
        })),
        skipDuplicates: true
      });
    }

    await tx.adminAction.create({
      data: {
        action: id ? "UPDATE_OPPORTUNITY" : "CREATE_OPPORTUNITY",
        entityType: "Opportunity",
        entityId: record.id,
        metadata: {
          slug,
          status: data.status,
          industryIds: data.industryIds,
          useCaseIds: data.useCaseIds
        }
      }
    });

    return record;
  });
}

export async function updateAdminUseCaseIntelligence(
  id: string,
  input: unknown
) {
  const data = adminUseCaseIntelligenceSchema.parse(input);
  const record = await prisma.useCase.update({
    where: { id },
    data: {
      description: data.description,
      outcome: data.outcome,
      painPoints: data.painPoints,
      requiredInputs: data.requiredInputs,
      successMetrics: data.successMetrics,
      implementationSteps: data.implementationSteps,
      effortLevel: data.effortLevel,
      riskLevel: data.riskLevel,
      timeToValue: data.timeToValue,
      businessFunctionId: data.businessFunctionId
    }
  });

  await prisma.adminAction.create({
    data: {
      action: "UPDATE_USE_CASE_INTELLIGENCE",
      entityType: "UseCase",
      entityId: id,
      metadata: {
        effortLevel: data.effortLevel,
        riskLevel: data.riskLevel
      }
    }
  });

  return record;
}
