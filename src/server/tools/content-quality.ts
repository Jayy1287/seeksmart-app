// A tool page is worth indexing only when it carries original, specific
// content. Everything else stays crawlable but noindex until enriched.
export function hasRichToolContent(tool: {
  longDescription: string | null;
  bestFor: string | null;
  notFor: string | null;
}) {
  return (
    (tool.longDescription?.trim().length ?? 0) >= 400 &&
    Boolean(tool.bestFor?.trim()) &&
    Boolean(tool.notFor?.trim())
  );
}
