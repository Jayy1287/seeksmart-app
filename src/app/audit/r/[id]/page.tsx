import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { UserRole } from "@prisma/client";
import { CheckCircle2 } from "lucide-react";
import { auth } from "@/auth";
import { AuditAnalyticsEvent } from "@/features/audit/audit-analytics";
import {
  AuditResultView,
  lockedBriefItems
} from "@/features/audit/audit-result-view";
import { AuditShareBar } from "@/features/audit/audit-share-bar";
import { AuditSignInPanel } from "@/features/audit/audit-sign-in-panel";
import { absoluteUrl } from "@/lib/site";
import { AUDIT_RUNS_COOKIE } from "@/server/audit-runs/cookies";
import { claimAuditRun, getAuditRunById } from "@/server/audit-runs/queries";
import type { AuditInput, AuditResult } from "@/shared/recommendations/audit";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Your AI pilot brief",
  description:
    "Ranked AI opportunities, a readiness score, and a pilot plan for your business.",
  robots: {
    index: false,
    follow: false
  }
};

type AuditRunPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AuditRunPage({ params }: AuditRunPageProps) {
  const { id } = await params;
  const [run, session, cookieStore] = await Promise.all([
    getAuditRunById(id),
    auth(),
    cookies()
  ]);

  if (!run) {
    notFound();
  }

  const userId = session?.user?.id ?? null;
  const isAdmin = session?.user?.role === UserRole.ADMIN;
  const rememberedIds = (cookieStore.get(AUDIT_RUNS_COOKIE)?.value ?? "").split(",");
  const createdInThisBrowser = rememberedIds.includes(run.id);
  const sameEmail =
    Boolean(session?.user?.email) &&
    run.email !== null &&
    run.email === session?.user?.email?.toLowerCase();

  let unlocked = Boolean(run.unlockedAt);
  let ownedByViewer = Boolean(userId) && run.userId === userId;

  if (userId && !run.userId && (createdInThisBrowser || sameEmail)) {
    const claimed = await claimAuditRun({ id: run.id, userId });
    if (claimed) {
      unlocked = true;
      ownedByViewer = true;
    }
  }

  if (ownedByViewer || isAdmin) {
    unlocked = true;
  }

  const result = run.result as unknown as AuditResult;
  const input = run.input as unknown as AuditInput;
  const shareUrl = absoluteUrl(`/audit/r/${run.id}`);

  return (
    <AuditResultView
      actions={
        ownedByViewer || unlocked ? (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {unlocked ? (
              <AuditShareBar isSignedIn={Boolean(userId)} shareUrl={shareUrl} />
            ) : (
              <span />
            )}
            {ownedByViewer ? (
              <p className="flex items-center gap-2 text-sm text-ink/55">
                <CheckCircle2 aria-hidden="true" className="text-success" size={16} />
                Saved to your dashboard
              </p>
            ) : null}
          </div>
        ) : null
      }
      analytics={
        <AuditAnalyticsEvent
          event="audit_results_viewed"
          properties={{
            budgetRange: input.budgetRange,
            companySize: input.companySize,
            dataSensitivity: input.dataSensitivity,
            topOpportunity: result.topOpportunities[0]?.slug ?? "none",
            unlocked
          }}
        />
      }
      input={input}
      locked={!unlocked}
      result={result}
      unlockPanel={
        <AuditSignInPanel
          auditRunId={run.id}
          isSignedIn={Boolean(userId)}
          items={lockedBriefItems}
        />
      }
    />
  );
}
