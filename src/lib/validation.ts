import { z } from "zod";

export const pricingTypeSchema = z.enum(["FREE", "PAID", "FREEMIUM"]);
export const statusSchema = z.enum([
  "DRAFT",
  "PENDING_REVIEW",
  "PUBLISHED",
  "REJECTED",
  "ARCHIVED"
]);

export const toolSubmissionSchema = z.object({
  toolName: z.string().trim().min(2).max(120),
  websiteUrl: z.string().trim().url(),
  description: z.string().trim().min(20).max(1200),
  category: z.string().trim().min(2).max(80),
  pricingType: pricingTypeSchema,
  submitterEmail: z.string().trim().toLowerCase().email(),
  companyName: z.string().max(0).optional()
});

const optionalTrimmedString = (maxLength: number) =>
  z.preprocess(
    (value) => {
      if (typeof value !== "string") {
        return value;
      }

      const trimmed = value.trim();
      return trimmed.length > 0 ? trimmed : undefined;
    },
    z.string().max(maxLength).optional()
  );

export const listToolsQuerySchema = z.object({
  q: optionalTrimmedString(120),
  category: optionalTrimmedString(80),
  pricing: z.preprocess(
    (value) => (value === "" ? undefined : value),
    pricingTypeSchema.optional()
  ),
  page: z.coerce.number().int().min(1).max(100).catch(1),
  limit: z.coerce.number().int().min(1).max(48).catch(24)
});

export const adminLoginSchema = z.object({
  password: z.string().min(1)
});

export const adminSubmissionStatusSchema = z
  .enum(["PENDING", "APPROVED", "REJECTED", "SPAM"])
  .optional();

export const approveSubmissionSchema = z.object({
  name: z.string().trim().min(2).max(120),
  slug: optionalTrimmedString(120),
  shortDescription: z.string().trim().min(20).max(220),
  longDescription: optionalTrimmedString(2000),
  websiteUrl: z.string().trim().url(),
  categoryName: z.string().trim().min(2).max(80),
  pricingType: pricingTypeSchema,
  hasFreePlan: z.coerce.boolean().default(false),
  isVerified: z.coerce.boolean().default(false),
  reviewNote: optionalTrimmedString(500)
});

export const rejectSubmissionSchema = z.object({
  reason: z.string().trim().min(5).max(500)
});
