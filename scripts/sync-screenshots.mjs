// Points tools.screenshot_url at public/screenshots/<slug>.jpg when the file
// exists (and clears it when it does not).
//
//   node scripts/sync-screenshots.mjs

import { existsSync } from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const tools = await prisma.tool.findMany({ select: { id: true, slug: true, screenshotUrl: true } });
  let set = 0;
  let cleared = 0;
  for (const tool of tools) {
    const file = path.join(process.cwd(), "public", "screenshots", `${tool.slug}.jpg`);
    const url = existsSync(file) ? `/screenshots/${tool.slug}.jpg` : null;
    if (url !== tool.screenshotUrl) {
      await prisma.tool.update({ where: { id: tool.id }, data: { screenshotUrl: url } });
      if (url) set += 1;
      else cleared += 1;
    }
  }
  console.log(`Screenshots: ${set} set, ${cleared} cleared.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
