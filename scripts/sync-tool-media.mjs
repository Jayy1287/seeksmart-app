// Points tools.logo_url and tools.screenshot_url at the files that exist in
// public/logos and public/screenshots. Safe to run on any environment that
// has the repo's public folder deployed.
//
//   node scripts/sync-tool-media.mjs          # logos only where none is set locally yet
//   node scripts/sync-tool-media.mjs --all    # also replace external logo URLs with local files

import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const replaceExternal = process.argv.includes("--all");
const logoDir = path.join(process.cwd(), "public", "logos");
const shotDir = path.join(process.cwd(), "public", "screenshots");

async function main() {
  const logoFiles = new Map();
  for (const file of readdirSync(logoDir)) {
    const slug = file.replace(/\.[a-z0-9]+$/i, "");
    logoFiles.set(slug, `/logos/${file}`);
  }

  const tools = await prisma.tool.findMany({
    select: { id: true, slug: true, logoUrl: true, screenshotUrl: true }
  });
  let logos = 0;
  let shots = 0;

  for (const tool of tools) {
    const data = {};
    const localLogo = logoFiles.get(tool.slug);
    const hasLocalLogo = tool.logoUrl?.startsWith("/logos/");
    if (localLogo && localLogo !== tool.logoUrl && (replaceExternal || !tool.logoUrl || hasLocalLogo)) {
      data.logoUrl = localLogo;
      logos += 1;
    }
    const shot = existsSync(path.join(shotDir, `${tool.slug}.jpg`)) ? `/screenshots/${tool.slug}.jpg` : null;
    if (shot !== tool.screenshotUrl && (shot || tool.screenshotUrl?.startsWith("/screenshots/"))) {
      data.screenshotUrl = shot;
      shots += 1;
    }
    if (Object.keys(data).length > 0) {
      await prisma.tool.update({ where: { id: tool.id }, data });
    }
  }

  console.log(`Media sync: ${logos} logo urls, ${shots} screenshot urls updated (${tools.length} tools).`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
