// Captures a homepage screenshot for every published tool into
// public/screenshots/<slug>.jpg (1280x800, JPEG quality 60), then run
// `node scripts/sync-tool-media.mjs` to point screenshot_url at the files.
//
// Needs Playwright, which is deliberately not a project dependency:
//   npm i -D playwright && npx playwright install chromium
//   node scripts/capture-screenshots.mjs            # only tools without a screenshot
//   node scripts/capture-screenshots.mjs --force    # recapture everything
//   node scripts/capture-screenshots.mjs --slug notion-ai
//
// Screenshots are third-party content. Keep them out of the repository (the
// folder is gitignored) and make sure your use complies with the site owners'
// terms. See NOTICE.md.
import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

const args = process.argv.slice(2);
const force = args.includes("--force");
const onlySlug = args.includes("--slug") ? args[args.indexOf("--slug") + 1] : null;
const outDir = path.join(process.cwd(), "public", "screenshots");
mkdirSync(outDir, { recursive: true });

async function loadPlaywright() {
  try {
    return await import("playwright");
  } catch {
    console.error("Playwright is not installed. Run: npm i -D playwright && npx playwright install chromium");
    process.exit(1);
  }
}

async function main() {
  const { chromium } = await loadPlaywright();
  const prisma = new PrismaClient();
  const tools = await prisma.tool.findMany({
    where: { status: "PUBLISHED", ...(onlySlug ? { slug: onlySlug } : {}) },
    select: { slug: true, name: true, websiteUrl: true },
    orderBy: { name: "asc" }
  });
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 1,
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36",
    locale: "en-US"
  });
  let captured = 0;
  let failed = 0;
  for (const tool of tools) {
    const file = path.join(outDir, `${tool.slug}.jpg`);
    if (!force && existsSync(file)) {
      continue;
    }
    const page = await context.newPage();
    try {
      await page.goto(tool.websiteUrl, { waitUntil: "domcontentloaded", timeout: 30000 });
      await page.waitForTimeout(2500);
      await page.screenshot({ path: file, type: "jpeg", quality: 60, fullPage: false });
      captured += 1;
      console.log(`captured ${tool.slug}`);
    } catch (error) {
      failed += 1;
      console.warn(`failed ${tool.slug}: ${error instanceof Error ? error.message.split("\n")[0] : error}`);
    } finally {
      await page.close();
    }
  }
  await browser.close();
  await prisma.$disconnect();
  console.log(`Screenshots: ${captured} captured, ${failed} failed, ${tools.length} tools.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
