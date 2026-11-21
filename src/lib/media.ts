/**
 * Tool logos and homepage screenshots are not part of the repository (they
 * are third-party marks and captures). They live in `public/logos` and
 * `public/screenshots` on a developer machine, or in an object store in
 * production. Database rows keep the repo-relative path (`/logos/<slug>.png`),
 * and this helper turns it into a URL the browser can load.
 *
 * Set `NEXT_PUBLIC_TOOL_MEDIA_BASE_URL` to the public root of the store, for
 * example `https://<project>.supabase.co/storage/v1/object/public/tool-media`.
 * Leave it empty to serve the files from `public/`.
 */
const MEDIA_PREFIXES = ["/logos/", "/screenshots/"];

export function getMediaBaseUrl(): string {
  return (process.env.NEXT_PUBLIC_TOOL_MEDIA_BASE_URL ?? "").replace(/\/+$/, "");
}

export function resolveMediaUrl(url: string | null | undefined): string | null {
  if (!url) {
    return null;
  }
  const base = getMediaBaseUrl();
  if (!base) {
    return url;
  }
  return MEDIA_PREFIXES.some((prefix) => url.startsWith(prefix)) ? `${base}${url}` : url;
}
