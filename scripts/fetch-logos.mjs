// Downloads a logo for every published tool into public/logos/<slug>.png and
// points logo_url at the local file. Sources are tried in order; a result is
// accepted only if it is a real image of a sensible size.
//
//   node scripts/fetch-logos.mjs            # only tools without a local logo
//   node scripts/fetch-logos.mjs --force    # refetch everything

import { mkdir, writeFile, access } from "node:fs/promises";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const outDir = path.join(process.cwd(), "public", "logos");
const force = process.argv.includes("--force");

function domainOf(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

function sources(domain) {
  return [
    `https://logo.clearbit.com/${domain}?size=256`,
    `https://unavatar.io/${domain}?fallback=false`,
    `https://icon.horse/icon/${domain}`,
    `https://logo.uplead.com/${domain}`,
    `https://www.google.com/s2/favicons?domain=${domain}&sz=256`,
    `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
    `https://icons.duckduckgo.com/ip3/${domain}.ico`
  ];
}

function pngSize(buffer) {
  if (buffer.length < 24 || buffer.toString("ascii", 1, 4) !== "PNG") {
    return null;
  }
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

function extensionFor(contentType, buffer) {
  if (buffer.toString("ascii", 1, 4) === "PNG") return "png";
  if (buffer[0] === 0xff && buffer[1] === 0xd8) return "jpg";
  if (contentType.includes("svg")) return "svg";
  if (contentType.includes("webp") || buffer.toString("ascii", 8, 12) === "WEBP") return "webp";
  if (contentType.includes("icon") || buffer[0] === 0 && buffer[1] === 0 && buffer[2] === 1) return "ico";
  return null;
}

async function fetchImage(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { "user-agent": "Mozilla/5.0 (SeekSmart logo fetcher)" },
      redirect: "follow"
    });
    if (!response.ok) return null;
    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.startsWith("image/")) return null;
    const buffer = Buffer.from(await response.arrayBuffer());
    if (buffer.length < 1200) return null;
    const extension = extensionFor(contentType, buffer);
    if (!extension) return null;
    const size = pngSize(buffer);
    if (size && (size.width < 48 || size.height < 48)) return null;
    return { buffer, extension };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

async function exists(file) {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  await mkdir(outDir, { recursive: true });
  const tools = await prisma.tool.findMany({
    select: { id: true, slug: true, name: true, websiteUrl: true, logoUrl: true },
    orderBy: { name: "asc" }
  });
  let saved = 0;
  let kept = 0;
  let failed = [];

  for (const tool of tools) {
    const hasLocal = tool.logoUrl?.startsWith("/logos/");
    if (hasLocal && !force && (await exists(path.join(process.cwd(), "public", tool.logoUrl)))) {
      kept += 1;
      continue;
    }
    const domain = domainOf(tool.websiteUrl);
    if (!domain) {
      failed.push(tool.name);
      continue;
    }
    let result = null;
    for (const url of sources(domain)) {
      result = await fetchImage(url);
      if (result) break;
    }
    if (!result) {
      failed.push(tool.name);
      continue;
    }
    const fileName = `${tool.slug}.${result.extension}`;
    await writeFile(path.join(outDir, fileName), result.buffer);
    await prisma.tool.update({ where: { id: tool.id }, data: { logoUrl: `/logos/${fileName}` } });
    saved += 1;
    process.stdout.write(`\r${saved} saved, ${kept} kept, ${failed.length} failed`);
  }

  console.log(`\nLogos: ${saved} saved, ${kept} kept, ${failed.length} failed.`);
  if (failed.length) console.log("Failed:", failed.join(", "));
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
