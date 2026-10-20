import { slugify } from "@/lib/slug";

export function headingId(value: string) {
  return slugify(value) || "section";
}

export function pad(index: number) {
  return String(index + 1).padStart(2, "0");
}

export function formatShortDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
    year: "numeric"
  }).format(new Date(value));
}
