import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { AdminLogoutButton } from "@/features/admin/admin-logout-button";
import {
  AdminEmpty,
  AdminHeader,
  AdminNav,
  AdminSearch,
  StatusFilter
} from "@/features/admin/admin-shell";
import { isAdminAuthenticated } from "@/server/admin/auth";
import {
  getAdminSubmissionCounts,
  listAdminSubmissions,
  type AdminSubmissionStatus
} from "@/server/admin/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Review Queue",
  robots: {
    index: false,
    follow: false
  }
};

const statuses: AdminSubmissionStatus[] = [
  "PENDING",
  "APPROVED",
  "REJECTED",
  "SPAM"
];

type AdminPageProps = {
  searchParams: Promise<{
    status?: string;
    q?: string;
  }>;
};

function parseStatus(value?: string): AdminSubmissionStatus {
  return statuses.includes(value as AdminSubmissionStatus)
    ? (value as AdminSubmissionStatus)
    : "PENDING";
}

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(value);
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const { status: rawStatus, q } = await searchParams;
  const activeStatus = parseStatus(rawStatus);
  const query = q?.trim() || undefined;
  const [counts, submissions] = await Promise.all([
    getAdminSubmissionCounts(),
    listAdminSubmissions(activeStatus, query)
  ]);

  return (
    <main className="app-container page-hero grid grid-cols-[minmax(0,1fr)] gap-8 pb-24">
      <AdminHeader
        actions={
          <>
            <AdminNav current="queue" />
            <AdminLogoutButton />
          </>
        }
        eyebrow="Admin"
        title={
          <>
            Review queue. <span className="ghost-word">{counts.PENDING} waiting.</span>
          </>
        }
      />

      <div className="grid gap-4">
        <StatusFilter
          active={activeStatus}
          counts={counts}
          hrefFor={(status) => `/admin?status=${status}`}
          statuses={statuses}
        />
        <AdminSearch action="/admin" label="Search submissions" query={query} status={activeStatus} />
      </div>

      <section>
        <p className="eyebrow eyebrow-plain mb-4">
          {submissions.length} {activeStatus.toLowerCase()}
        </p>
        <div className="row-list">
          {submissions.length > 0 ? (
            submissions.map((submission) => (
              <Link
                className="row-item group grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-3 py-5 md:grid-cols-[minmax(0,1fr)_12rem_12rem_auto] md:gap-x-8"
                href={`/admin/submissions/${submission.id}`}
                key={submission.id}
              >
                <div className="min-w-0">
                  <div className="font-display text-xl font-bold tracking-[-0.03em]">{submission.toolName}</div>
                  <p className="mt-1 line-clamp-2 text-sm text-ink/55">
                    {submission.description || "No description provided."}
                  </p>
                  <p className="mt-2 truncate font-mono text-xs text-ink/40">
                    {submission.websiteUrl}
                  </p>
                </div>
                <div className="col-span-2 row-start-2 flex flex-wrap gap-1.5 md:col-span-1 md:col-start-2 md:row-start-1">
                  <span className="tag">{submission.category}</span>
                  <span className="tag">{submission.pricingType}</span>
                </div>
                <div className="col-span-2 row-start-3 min-w-0 font-mono text-xs text-ink/45 md:col-span-1 md:col-start-3 md:row-start-1 md:text-right">
                  <div>{formatDate(submission.createdAt)}</div>
                  <div className="mt-1 truncate">{submission.submitterEmail}</div>
                </div>
                <span className="row-arrow col-start-2 row-start-1 md:col-start-4">
                  <ArrowRight aria-hidden="true" size={16} />
                </span>
              </Link>
            ))
          ) : (
            <AdminEmpty
              body="New public submissions land here for review."
              title="Nothing to review."
            />
          )}
        </div>
      </section>
    </main>
  );
}
