import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AUDIT_EMAIL_COOKIE } from "@/server/audit-runs/cookies";
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

  const [session, dataset, cookieStore] = await Promise.all([
    auth(),
    getAuditDataset(),
    cookies()
  ]);
  const result = scoreAudit(input, dataset);
  const run = await createAuditRun({
    email:
      session?.user?.email ?? cookieStore.get(AUDIT_EMAIL_COOKIE)?.value ?? null,
    result,
    userId: session?.user?.id ?? null
  });

  redirect(`/audit/r/${run.id}`);
}
