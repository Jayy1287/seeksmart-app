import { ogContentType, ogSize, renderOgImage } from "@/lib/og";

export const alt = "SeekSmart - Find the right AI workflow first";
export const size = ogSize;
export const contentType = ogContentType;

export default function OpenGraphImage() {
  return renderOgImage({
    eyebrow: "AI decision engine",
    title: "Decide where AI belongs before you buy another tool.",
    description:
      "Rank the opportunities, pick a first workflow, then compare a tool shortlist."
  });
}
