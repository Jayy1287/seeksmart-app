// Merges researched tool batches (JSON arrays) into prisma/data/tools-v2.json.
// Validates every record against the live taxonomy, dedupes by name slug and
// website domain (including tools already in the database), clamps numbers,
// and writes a report of what was dropped and why.
//
//   node scripts/merge-tool-research.mjs <dir-with-batch-*.json>

import { readdirSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const inputDir = process.argv[2];
if (!inputDir) {
  console.error("Usage: node scripts/merge-tool-research.mjs <dir>");
  process.exit(1);
}

function slugify(value) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function domainOf(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return null;
  }
}

function clean(text, max) {
  return String(text ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

async function main() {
  const [categories, useCases, features, existing] = await Promise.all([
    prisma.category.findMany({ select: { slug: true } }),
    prisma.useCase.findMany({ select: { slug: true } }),
    prisma.feature.findMany({ select: { slug: true } }),
    // Only hand-seeded tools count as "already in the database"; researched
    // tools (sourceUrl set) are represented by the data file itself.
    prisma.tool.findMany({
      select: { slug: true, name: true, websiteUrl: true },
      where: { sourceUrl: null }
    })
  ]);
  const categorySlugs = new Set(categories.map((c) => c.slug));
  const useCaseSlugs = new Set(useCases.map((u) => u.slug));
  const featureSlugs = new Set(features.map((f) => f.slug));
  const existingSlugs = new Set(existing.map((t) => t.slug));
  const existingDomains = new Set(existing.map((t) => domainOf(t.websiteUrl)).filter(Boolean));

  const files = readdirSync(inputDir).filter((f) => /^batch-\d+\.json$/.test(f)).sort();
  const seenSlugs = new Set();
  const seenDomains = new Set();
  const accepted = [];
  const dropped = [];

  // Keep what earlier merges already accepted so the data file stays the
  // complete, reproducible catalogue (it is what production seeds from).
  const outFile = path.join(process.cwd(), "prisma", "data", "tools-v2.json");
  try {
    const previous = JSON.parse(readFileSync(outFile, "utf8"));
    for (const tool of previous) {
      const slug = slugify(tool.name);
      const domain = domainOf(tool.websiteUrl);
      seenSlugs.add(slug);
      if (domain) seenDomains.add(domain);
      existingSlugs.delete(slug);
      if (domain) existingDomains.delete(domain);
      accepted.push(tool);
    }
  } catch {
    // first run
  }

  for (const file of files) {
    let batch;
    try {
      batch = JSON.parse(readFileSync(path.join(inputDir, file), "utf8"));
    } catch (error) {
      dropped.push(`${file}: invalid JSON (${error.message})`);
      continue;
    }
    if (!Array.isArray(batch)) {
      dropped.push(`${file}: not an array`);
      continue;
    }
    for (const raw of batch) {
      const name = clean(raw.name, 120);
      const slug = slugify(name);
      const domain = domainOf(raw.websiteUrl);
      const label = `${file} ${name || "(unnamed)"}`;
      if (!name || !slug) { dropped.push(`${label}: missing name`); continue; }
      if (!domain) { dropped.push(`${label}: bad websiteUrl`); continue; }
      if (seenSlugs.has(slug) || seenDomains.has(domain)) { continue; }
      if (existingSlugs.has(slug) || existingDomains.has(domain)) { dropped.push(`${label}: already in database`); continue; }
      if (!categorySlugs.has(raw.categorySlug)) { dropped.push(`${label}: unknown category ${raw.categorySlug}`); continue; }
      const pricingType = String(raw.pricingType ?? "").toUpperCase();
      if (!["FREE", "PAID", "FREEMIUM"].includes(pricingType)) { dropped.push(`${label}: bad pricingType`); continue; }
      const longDescription = clean(raw.longDescription, 1800);
      if (longDescription.length < 300) { dropped.push(`${label}: longDescription too short (${longDescription.length})`); continue; }
      const useCaseFits = (Array.isArray(raw.useCases) ? raw.useCases : [])
        .filter((fit) => useCaseSlugs.has(fit?.slug))
        .map((fit) => ({
          slug: fit.slug,
          fitScore: Math.max(40, Math.min(98, Math.round(Number(fit.fitScore) || 70))),
          bestFor: clean(fit.bestFor, 240),
          limitations: clean(fit.limitations, 240),
          implementationNote: clean(fit.implementationNote, 240)
        }));
      if (useCaseFits.length === 0) { dropped.push(`${label}: no valid use cases`); continue; }
      const toolFeatures = [...new Set((raw.featureSlugs ?? []).filter((f) => featureSlugs.has(f)))].slice(0, 8);
      const startingPrice =
        raw.startingPrice === null || raw.startingPrice === undefined || raw.startingPrice === ""
          ? null
          : Number(raw.startingPrice);

      seenSlugs.add(slug);
      seenDomains.add(domain);
      accepted.push({
        name,
        websiteUrl: `https://${domain}${new URL(raw.websiteUrl).pathname.replace(/\/$/, "")}`,
        categorySlug: raw.categorySlug,
        pricingType,
        hasFreePlan: Boolean(raw.hasFreePlan) || pricingType !== "PAID",
        startingPrice: Number.isFinite(startingPrice) && startingPrice >= 0 ? Math.round(startingPrice * 100) / 100 : null,
        pricingNote: clean(raw.pricingNote, 300),
        shortDescription: clean(raw.shortDescription, 160),
        longDescription,
        bestFor: clean(raw.bestFor, 300),
        notFor: clean(raw.notFor, 300),
        integrations: [...new Set((raw.integrations ?? []).map((i) => clean(i, 40)).filter(Boolean))].slice(0, 8),
        featureSlugs: toolFeatures,
        useCases: useCaseFits.slice(0, 4),
        alternatives: [...new Set((raw.alternatives ?? []).map((a) => clean(a, 80)).filter(Boolean))].slice(0, 4),
        popularityScore: Math.max(30, Math.min(95, Math.round(Number(raw.popularityScore) || 55))),
        vendor: clean(raw.vendor, 120),
        sourceUrl: clean(raw.sourceUrl, 300)
      });
    }
  }

  mkdirSync(path.dirname(outFile), { recursive: true });
  writeFileSync(outFile, JSON.stringify(accepted, null, 2) + "\n");
  writeFileSync(path.join(inputDir, "merge-report.txt"), [`accepted ${accepted.length}`, `dropped ${dropped.length}`, ...dropped].join("\n") + "\n");
  const byCategory = {};
  for (const tool of accepted) byCategory[tool.categorySlug] = (byCategory[tool.categorySlug] ?? 0) + 1;
  console.log(`Accepted ${accepted.length}, dropped ${dropped.length}.`);
  console.log(Object.entries(byCategory).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k}=${v}`).join(", "));
  if (dropped.length) console.log("Dropped:\n" + dropped.join("\n"));
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
