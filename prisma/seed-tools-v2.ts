import { readFileSync } from "node:fs";
import path from "node:path";
import { PricingType, PrismaClient, PublishStatus } from "@prisma/client";
import { slugify } from "../src/lib/slug";

// Loads the researched tool catalogue (prisma/data/tools-v2.json) on top of
// the base seed. Idempotent: tools are matched by slug, mappings are replaced.

type ResearchedUseCase = {
  slug: string;
  fitScore: number;
  bestFor: string;
  limitations: string;
  implementationNote: string;
};

type ResearchedTool = {
  name: string;
  websiteUrl: string;
  categorySlug: string;
  pricingType: "FREE" | "PAID" | "FREEMIUM";
  hasFreePlan: boolean;
  startingPrice: number | null;
  pricingNote: string;
  shortDescription: string;
  longDescription: string;
  bestFor: string;
  notFor: string;
  integrations: string[];
  featureSlugs: string[];
  useCases: ResearchedUseCase[];
  alternatives: string[];
  popularityScore: number;
  vendor: string;
  sourceUrl: string;
  logoUrl?: string | null;
  screenshotUrl?: string | null;
};

const prisma = new PrismaClient();

async function main() {
  const file = path.join(process.cwd(), "prisma", "data", "tools-v2.json");
  const tools = JSON.parse(readFileSync(file, "utf8")) as ResearchedTool[];
  const [categories, useCases, features] = await Promise.all([
    prisma.category.findMany({ select: { id: true, slug: true } }),
    prisma.useCase.findMany({ select: { id: true, slug: true } }),
    prisma.feature.findMany({ select: { id: true, slug: true } })
  ]);
  const categoryBySlug = new Map(categories.map((item) => [item.slug, item.id]));
  const useCaseBySlug = new Map(useCases.map((item) => [item.slug, item.id]));
  const featureBySlug = new Map(features.map((item) => [item.slug, item.id]));
  const now = new Date();
  let created = 0;
  let updated = 0;

  for (const tool of tools) {
    const categoryId = categoryBySlug.get(tool.categorySlug);
    if (!categoryId) {
      console.warn(`Skipping ${tool.name}: unknown category ${tool.categorySlug}`);
      continue;
    }

    const slug = slugify(tool.name);
    const existing = await prisma.tool.findUnique({ where: { slug }, select: { id: true } });
    const data = {
      name: tool.name,
      shortDescription: tool.shortDescription.slice(0, 160),
      longDescription: tool.longDescription,
      websiteUrl: tool.websiteUrl,
      categoryId,
      pricingType: PricingType[tool.pricingType],
      startingPrice: tool.startingPrice,
      hasFreePlan: tool.hasFreePlan || tool.pricingType !== "PAID",
      pricingNote: tool.pricingNote,
      bestFor: tool.bestFor,
      notFor: tool.notFor,
      integrations: tool.integrations.slice(0, 8),
      vendor: tool.vendor,
      sourceUrl: tool.sourceUrl,
      popularityScore: Math.max(0, Math.min(100, tool.popularityScore)),
      metaTitle: `${tool.name} review, pricing, and alternatives (2026)`,
      metaDescription: tool.shortDescription.slice(0, 155),
      status: PublishStatus.PUBLISHED,
      contentUpdatedAt: now,
      ...(tool.logoUrl ? { logoUrl: tool.logoUrl } : {}),
      ...(tool.screenshotUrl ? { screenshotUrl: tool.screenshotUrl } : {})
    };

    const record = existing
      ? await prisma.tool.update({ where: { id: existing.id }, data })
      : await prisma.tool.create({
          data: { ...data, slug, publishedAt: now, logoUrl: tool.logoUrl ?? null }
        });
    if (existing) {
      updated += 1;
    } else {
      created += 1;
    }

    // Replace use-case fits and features for this tool.
    await prisma.toolUseCase.deleteMany({ where: { toolId: record.id } });
    for (const fit of tool.useCases) {
      const useCaseId = useCaseBySlug.get(fit.slug);
      if (!useCaseId) {
        console.warn(`  ${tool.name}: unknown use case ${fit.slug}`);
        continue;
      }
      await prisma.toolUseCase.create({
        data: {
          toolId: record.id,
          useCaseId,
          fitScore: Math.max(40, Math.min(98, Math.round(fit.fitScore))),
          bestFor: fit.bestFor,
          limitations: fit.limitations,
          implementationNote: fit.implementationNote,
          recommendationNote: fit.bestFor,
          pricingSuitability:
            tool.pricingType === "FREE" || tool.hasFreePlan
              ? "low"
              : (tool.startingPrice ?? 0) > 100
                ? "flexible"
                : "moderate"
        }
      });
    }

    await prisma.toolFeature.deleteMany({ where: { toolId: record.id } });
    for (const featureSlug of new Set(tool.featureSlugs)) {
      const featureId = featureBySlug.get(featureSlug);
      if (!featureId) {
        continue;
      }
      await prisma.toolFeature.create({ data: { toolId: record.id, featureId } });
    }
  }

  // Alternatives: resolved after every tool exists.
  const allTools = await prisma.tool.findMany({ select: { id: true, name: true, slug: true } });
  const idByName = new Map(allTools.map((item) => [item.name.toLowerCase(), item.id]));
  const idBySlug = new Map(allTools.map((item) => [item.slug, item.id]));
  let links = 0;
  for (const tool of tools) {
    const toolId = idBySlug.get(slugify(tool.name));
    if (!toolId) {
      continue;
    }
    for (const alternativeName of tool.alternatives) {
      const alternativeId =
        idByName.get(alternativeName.toLowerCase()) ?? idBySlug.get(slugify(alternativeName));
      if (!alternativeId || alternativeId === toolId) {
        continue;
      }
      await prisma.toolAlternative.upsert({
        create: { toolId, alternativeToolId: alternativeId },
        update: {},
        where: { toolId_alternativeToolId: { toolId, alternativeToolId: alternativeId } }
      });
      links += 1;
    }
  }

  console.log(`Tools v2: ${created} created, ${updated} updated, ${links} alternative links.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
