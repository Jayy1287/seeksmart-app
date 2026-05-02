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
  toolName: z.string().min(2).max(120),
  websiteUrl: z.string().url(),
  description: z.string().min(20).max(1200),
  category: z.string().min(2).max(80),
  pricingType: pricingTypeSchema,
  submitterEmail: z.string().email()
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
  pricing: pricingTypeSchema.optional()
});
