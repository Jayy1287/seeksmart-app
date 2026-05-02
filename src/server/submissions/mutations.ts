import { PublishStatus, SubmissionStatus } from "@prisma/client";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";
import {
  approveSubmissionSchema,
  rejectSubmissionSchema,
  toolSubmissionSchema
} from "@/lib/validation";

export class DuplicateSubmissionError extends Error {
  constructor(message = "This tool has already been submitted or published.") {
    super(message);
    this.name = "DuplicateSubmissionError";
  }
}

export class SubmissionNotReviewableError extends Error {
  constructor(message = "This submission is no longer pending review.") {
    super(message);
    this.name = "SubmissionNotReviewableError";
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

async function assertNoDuplicateSubmission(
  toolName: string,
  websiteUrl: string,
  excludeSubmissionId?: string
) {
  const normalizedWebsiteUrl = normalizeUrl(websiteUrl);
  const [existingTool, existingSubmission] = await Promise.all([
    prisma.tool.findFirst({
      where: {
        OR: [
          { name: { equals: toolName, mode: "insensitive" } },
          { websiteUrl: { equals: websiteUrl, mode: "insensitive" } },
          { websiteUrl: { equals: normalizedWebsiteUrl, mode: "insensitive" } }
        ]
      },
      select: {
        id: true
      }
    }),
    prisma.submission.findFirst({
      where: {
        ...(excludeSubmissionId ? { id: { not: excludeSubmissionId } } : {}),
        status: {
          in: [SubmissionStatus.PENDING, SubmissionStatus.APPROVED]
        },
        OR: [
          { toolName: { equals: toolName, mode: "insensitive" } },
          { websiteUrl: { equals: websiteUrl, mode: "insensitive" } },
          { websiteUrl: { equals: normalizedWebsiteUrl, mode: "insensitive" } }
        ]
      },
      select: {
        id: true
      }
    })
  ]);

  if (existingTool || existingSubmission) {
    throw new DuplicateSubmissionError();
  }
}

export async function createToolSubmission(input: unknown) {
  const submission = toolSubmissionSchema.parse(input);
  const websiteUrl = normalizeUrl(submission.websiteUrl);

  await assertNoDuplicateSubmission(submission.toolName, websiteUrl);

  return prisma.submission.create({
    data: {
      toolName: submission.toolName,
      websiteUrl,
      submitterEmail: submission.submitterEmail,
      payload: {
        toolName: submission.toolName,
        websiteUrl,
        description: submission.description,
        category: submission.category,
        pricingType: submission.pricingType,
        submitterEmail: submission.submitterEmail
      }
    },
    select: {
      id: true,
      status: true,
      createdAt: true
    }
  });
}

async function createUniqueToolSlug(name: string, requestedSlug?: string) {
  const baseSlug = slugify(requestedSlug || name) || slugify(name);
  let candidate = baseSlug;
  let suffix = 2;

  while (await prisma.tool.findUnique({ where: { slug: candidate } })) {
    candidate = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  return candidate;
}

function mergePayloadReviewMetadata(
  payload: Prisma.JsonValue,
  metadata: Prisma.JsonObject
): Prisma.InputJsonValue {
  const currentPayload =
    payload && typeof payload === "object" && !Array.isArray(payload)
      ? payload
      : {};

  return {
    ...currentPayload,
    review: metadata
  } as Prisma.InputJsonObject;
}

export async function approveSubmission(
  submissionId: string,
  input: unknown
) {
  const review = approveSubmissionSchema.parse(input);
  const submission = await prisma.submission.findUnique({
    where: {
      id: submissionId
    }
  });

  if (!submission) {
    return null;
  }

  if (submission.status !== SubmissionStatus.PENDING) {
    throw new SubmissionNotReviewableError();
  }

  await assertNoDuplicateSubmission(review.name, review.websiteUrl, submission.id);

  const categorySlug = slugify(review.categoryName);
  const toolSlug = await createUniqueToolSlug(review.name, review.slug);
  const now = new Date();

  return prisma.$transaction(async (tx) => {
    const category = await tx.category.upsert({
      where: {
        slug: categorySlug
      },
      update: {},
      create: {
        name: review.categoryName,
        slug: categorySlug,
        description: `AI tools for ${review.categoryName.toLowerCase()}.`
      }
    });

    const tool = await tx.tool.create({
      data: {
        name: review.name,
        slug: toolSlug,
        shortDescription: review.shortDescription,
        longDescription: review.longDescription,
        websiteUrl: normalizeUrl(review.websiteUrl),
        categoryId: category.id,
        pricingType: review.pricingType,
        hasFreePlan:
          review.hasFreePlan ||
          review.pricingType === "FREE" ||
          review.pricingType === "FREEMIUM",
        isVerified: review.isVerified,
        status: PublishStatus.PUBLISHED,
        popularityScore: 0,
        metaTitle: `${review.name} Review, Pricing, and Alternatives`,
        metaDescription: review.shortDescription,
        publishedAt: now
      },
      select: {
        id: true,
        name: true,
        slug: true
      }
    });

    const updatedSubmission = await tx.submission.update({
      where: {
        id: submission.id
      },
      data: {
        status: SubmissionStatus.APPROVED,
        reviewedAt: now,
        payload: mergePayloadReviewMetadata(submission.payload, {
          action: "APPROVED",
          note: review.reviewNote ?? null,
          toolId: tool.id,
          toolSlug: tool.slug,
          reviewedAt: now.toISOString()
        })
      },
      select: {
        id: true,
        status: true,
        reviewedAt: true
      }
    });

    await tx.adminAction.create({
      data: {
        action: "APPROVE_SUBMISSION",
        entityType: "Submission",
        entityId: submission.id,
        metadata: {
          toolId: tool.id,
          toolSlug: tool.slug
        }
      }
    });

    return {
      submission: updatedSubmission,
      tool
    };
  });
}

export async function rejectSubmission(
  submissionId: string,
  input: unknown
) {
  const review = rejectSubmissionSchema.parse(input);
  const submission = await prisma.submission.findUnique({
    where: {
      id: submissionId
    }
  });

  if (!submission) {
    return null;
  }

  if (submission.status !== SubmissionStatus.PENDING) {
    throw new SubmissionNotReviewableError();
  }

  const now = new Date();

  return prisma.$transaction(async (tx) => {
    const updatedSubmission = await tx.submission.update({
      where: {
        id: submission.id
      },
      data: {
        status: SubmissionStatus.REJECTED,
        reviewedAt: now,
        payload: mergePayloadReviewMetadata(submission.payload, {
          action: "REJECTED",
          reason: review.reason,
          reviewedAt: now.toISOString()
        })
      },
      select: {
        id: true,
        status: true,
        reviewedAt: true
      }
    });

    await tx.adminAction.create({
      data: {
        action: "REJECT_SUBMISSION",
        entityType: "Submission",
        entityId: submission.id,
        metadata: {
          reason: review.reason
        }
      }
    });

    return {
      submission: updatedSubmission
    };
  });
}
