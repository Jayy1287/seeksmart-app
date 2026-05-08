import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { auth } from "@/auth";
import { AuditResultView } from "@/features/audit/audit-result-view";
import { getSavedAuditRun } from "@/server/audit-runs/queries";
import type { AuditInput, AuditResult } from "@/shared/recommendations/audit";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Saved Audit",
  description: "View a saved SeekSmart audit brief.",
  robots: {
    index: false,
    follow: false
  }
};

type SavedAuditPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function SavedAuditPage({ params }: SavedAuditPageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/dashboard");
  }

  const { id } = await params;
  const auditRun = await getSavedAuditRun({
    id,
    userId: session.user.id
  });

  if (!auditRun) {
    notFound();
  }

  return (
    <AuditResultView
      input={auditRun.input as unknown as AuditInput}
      result={auditRun.result as unknown as AuditResult}
      saveStatus={
        <div className="flex flex-col gap-3 rounded-2xl border border-accent/25 bg-white/78 p-4 text-sm shadow-[0_18px_54px_rgb(38_78_162/0.06)] backdrop-blur sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-3 leading-6 text-ink/68">
            <CheckCircle2
              aria-hidden="true"
              className="mt-0.5 shrink-0 text-accent"
              size={18}
            />
            <span>Saved snapshot from {formatDate(auditRun.createdAt)}.</span>
          </div>
          <Link className="secondary-button min-h-10" href="/dashboard">
            Back to dashboard
          </Link>
        </div>
      }
    />
  );
}

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(value);
}
