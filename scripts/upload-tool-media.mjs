// Uploads public/logos and public/screenshots to a public Supabase Storage
// bucket so production can serve them without the files being in the repo.
//
//   SUPABASE_URL=https://<ref>.supabase.co SUPABASE_SERVICE_ROLE_KEY=... \
//     node scripts/upload-tool-media.mjs            # upload new or changed files
//   node scripts/upload-tool-media.mjs --bucket media --force
//
// Afterwards set NEXT_PUBLIC_TOOL_MEDIA_BASE_URL to the printed base URL.
// Uses only fetch against the Storage REST API; no SDK required.
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const bucket = args.includes("--bucket") ? args[args.indexOf("--bucket") + 1] : "tool-media";
const force = args.includes("--force");
const supabaseUrl = (process.env.SUPABASE_URL ?? "").replace(/\/+$/, "");
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

if (!supabaseUrl || !serviceKey) {
  console.error("Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (Project Settings > API > service_role).");
  process.exit(1);
}

const headers = { Authorization: `Bearer ${serviceKey}`, apikey: serviceKey };
const contentTypes = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};

async function ensureBucket() {
  const res = await fetch(`${supabaseUrl}/storage/v1/bucket/${bucket}`, { headers });
  if (res.ok) {
    return;
  }
  const create = await fetch(`${supabaseUrl}/storage/v1/bucket`, {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({ id: bucket, name: bucket, public: true, file_size_limit: 5 * 1024 * 1024 })
  });
  if (!create.ok) {
    throw new Error(`Could not create bucket ${bucket}: ${create.status} ${await create.text()}`);
  }
  console.log(`Created public bucket ${bucket}.`);
}

async function listRemote(prefix) {
  const names = new Map();
  let offset = 0;
  for (;;) {
    const res = await fetch(`${supabaseUrl}/storage/v1/object/list/${bucket}`, {
      method: "POST",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ prefix, limit: 1000, offset })
    });
    if (!res.ok) {
      throw new Error(`List failed: ${res.status} ${await res.text()}`);
    }
    const items = await res.json();
    for (const item of items) {
      names.set(item.name, item.metadata?.eTag ?? null);
    }
    if (items.length < 1000) {
      return names;
    }
    offset += items.length;
  }
}

async function upload(localPath, remotePath) {
  const body = readFileSync(localPath);
  const res = await fetch(`${supabaseUrl}/storage/v1/object/${bucket}/${remotePath}`, {
    method: "POST",
    headers: {
      ...headers,
      "Content-Type": contentTypes[path.extname(localPath).toLowerCase()] ?? "application/octet-stream",
      "Cache-Control": "public, max-age=31536000, immutable",
      "x-upsert": "true"
    },
    body
  });
  if (!res.ok) {
    throw new Error(`Upload ${remotePath} failed: ${res.status} ${await res.text()}`);
  }
}

function md5(file) {
  return createHash("md5").update(readFileSync(file)).digest("hex");
}

async function main() {
  await ensureBucket();
  let uploaded = 0;
  let skipped = 0;
  for (const folder of ["logos", "screenshots"]) {
    const dir = path.join(process.cwd(), "public", folder);
    if (!existsSync(dir)) {
      console.warn(`No ${dir}, skipping.`);
      continue;
    }
    const remote = force ? new Map() : await listRemote(folder);
    for (const file of readdirSync(dir)) {
      const local = path.join(dir, file);
      if (!statSync(local).isFile()) {
        continue;
      }
      const etag = remote.get(file);
      if (etag && etag.replace(/"/g, "") === md5(local)) {
        skipped += 1;
        continue;
      }
      await upload(local, `${folder}/${file}`);
      uploaded += 1;
      if (uploaded % 50 === 0) {
        console.log(`  ${uploaded} uploaded...`);
      }
    }
  }
  console.log(`Done: ${uploaded} uploaded, ${skipped} unchanged.`);
  console.log(`NEXT_PUBLIC_TOOL_MEDIA_BASE_URL=${supabaseUrl}/storage/v1/object/public/${bucket}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
