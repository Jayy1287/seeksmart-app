import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { auth } from "@/auth";
import { AuditAnalyticsEvent } from "@/features/audit/audit-analytics";
import { AuditResultView } from "@/features/audit/audit-result-view";
import { parseAuditInput } from "@/server/recommendations/input";
import { getAuditDataset } from "@/server/recommendations/queries";
import { scoreAudit } from "@/server/recommendations/scoring";
import { saveAuditRun } from "@/server/audit-runs/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "AI Audit Results",
  description:
    "View your rules-based AI audit result with ranked opportunities and tool shortlists.",
  alternates: {
    canonical: "/audit/results"
  }
};

type AuditResultsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AuditResultsPage({
  searchParams
}: AuditResultsPageProps) {
  const params = await searchParams;
  const input = parseAuditInput(params);

  if (!input) {
    redirect("/audit/questions");
  }

  const session = await auth();

  if (!session?.user.id) {
    redirect(
      `/login?callbackUrl=${encodeURIComponent(buildResultsPath(params))}`
    );
  }

  const dataset = await getAuditDataset();
  const result = scoreAudit(input, dataset);
  const savedAuditRun = await saveAuditRun({
    result,
    userId: session.user.id
  });

  return (
    <AuditResultView
      analytics={
        <AuditAnalyticsEvent
          event="audit_results_viewed"
          properties={{
            budgetRange: input.budgetRange,
            companySize: input.companySize,
            dataSensitivity: input.dataSensitivity,
            topOpportunity: result.topOpportunities[0]?.slug ?? "none"
          }}
        />
      }
      input={input}
      result={result}
      saveStatus={<SavedAuditNotice auditRunId={savedAuditRun.id} />}
    />
  );
}

function SavedAuditNotice({ auditRunId }: { auditRunId: string }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-accent/25 bg-white/78 p-4 text-sm shadow-[0_18px_54px_rgb(13_48_92/0.06)] backdrop-blur sm:flex-row sm:items-center sm:justify-between">
      <div className="flex gap-3 leading-6 text-ink/68">
        <CheckCircle2
          aria-hidden="true"
          className="mt-0.5 shrink-0 text-accent"
          size={18}
        />
        <span>This audit is saved to your SeekSmart dashboard.</span>
      </div>
      <Link className="secondary-button min-h-10" href={`/dashboard/audits/${auditRunId}`}>
        Open saved audit
      </Link>
    </div>
  );
}

function buildResultsPath(params: Record<string, string | string[] | undefined>) {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (Array.isArray(value)) {
      value.forEach((item) => searchParams.append(key, item));
      continue;
    }

    if (value) {
      searchParams.append(key, value);
    }
  }

  const queryString = searchParams.toString();

  return queryString ? `/audit/results?${queryString}` : "/audit/results";
}
