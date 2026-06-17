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
import { assertRateLimit } from "@/server/http/rate-limit";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "AI Audit Results",
  description:
    "View your AI audit result with ranked opportunities, a pilot plan, and a tool shortlist.",
  alternates: {
    canonical: "/audit/results"
  }
};

type AuditResultsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const allowedResultParamKeys = new Set([
  "approval",
  "budget",
  "data",
  "function",
  "goals",
  "industry",
  "integrations",
  "maturity",
  "metric",
  "owner",
  "pain",
  "readiness",
  "size",
  "technical",
  "timeline",
  "tools",
  "urgency",
  "volume"
]);

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

  assertRateLimit({
    key: `audit-results:${session.user.id}`,
    limit: 30,
    windowMs: 10 * 60 * 1000
  });

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
        Open in dashboard
      </Link>
    </div>
  );
}

function buildResultsPath(params: Record<string, string | string[] | undefined>) {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (!allowedResultParamKeys.has(key) || searchParams.toString().length > 1900) {
      continue;
    }

    if (Array.isArray(value)) {
      value
        .slice(0, 20)
        .forEach((item) => searchParams.append(key, item.slice(0, 1200)));
      continue;
    }

    if (value) {
      searchParams.append(key, value.slice(0, 1200));
    }
  }

  const queryString = searchParams.toString();

  return queryString ? `/audit/results?${queryString}` : "/audit/results";
}
