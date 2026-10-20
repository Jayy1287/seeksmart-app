import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireUser } from "@/server/auth/require-user";
import { createAuditRun } from "@/server/audit-runs/queries";
import { parseAuditInput } from "@/server/recommendations/input";
import { getAuditDataset } from "@/server/recommendations/queries";
import { scoreAudit } from "@/server/recommendations/scoring";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "AI Audit Results",
  robots: {
    index: false,
    follow: false
  }
};

type AuditResultsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

/**
 * Compatibility route for links created by the old GET-based audit form.
 * It scores the parameters once, stores a run, and redirects to the
 * permanent results URL.
 */
export default async function LegacyAuditResultsPage({
  searchParams
}: AuditResultsPageProps) {
  const params = await searchParams;
  const input = parseAuditInput(params);

  if (!input) {
    redirect("/audit/questions");
  }

  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    for (const item of Array.isArray(value) ? value : value ? [value] : []) {
      query.append(key, item);
    }
  }
  const user = await requireUser(`/audit/results?${query.toString()}`);
  const dataset = await getAuditDataset();
  const result = scoreAudit(input, dataset);
  const run = await createAuditRun({
    email: user.email ?? null,
    result,
    userId: user.id
  });

  redirect(`/audit/r/${run.id}`);
}
