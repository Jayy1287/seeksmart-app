import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminLogoutButton } from "@/features/admin/admin-logout-button";
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

  const { status: rawStatus } = await searchParams;
  const activeStatus = parseStatus(rawStatus);
  const [counts, submissions] = await Promise.all([
    getAdminSubmissionCounts(),
    listAdminSubmissions(activeStatus)
  ]);

  return (
    <main className="mx-auto grid max-w-6xl gap-6 px-5 py-10">
      <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium uppercase text-accent">Admin</p>
          <h1 className="mt-2 text-4xl font-semibold">Review queue</h1>
          <p className="mt-3 max-w-2xl leading-7 text-ink/65">
            Review submitted tools, publish high-quality entries, and keep a
            simple audit trail for every decision.
          </p>
        </div>
        <AdminLogoutButton />
      </section>

      <nav className="grid gap-3 md:grid-cols-4">
        {statuses.map((status) => {
          const isActive = status === activeStatus;

          return (
            <Link
              className={
                isActive
                  ? "rounded-md border border-accent bg-accent px-4 py-3 text-white"
                  : "rounded-md border border-line bg-white px-4 py-3"
              }
              href={`/admin?status=${status}`}
              key={status}
            >
              <div className="text-sm font-medium">{status}</div>
              <div className="mt-1 text-2xl font-semibold">
                {counts[status]}
              </div>
            </Link>
          );
        })}
      </nav>

      <section className="rounded-md border border-line bg-white">
        <div className="border-b border-line px-5 py-4">
          <h2 className="font-semibold">{activeStatus} submissions</h2>
        </div>
        {submissions.length > 0 ? (
          <div className="divide-y divide-line">
            {submissions.map((submission) => (
              <Link
                className="grid gap-3 px-5 py-4 transition hover:bg-paper md:grid-cols-[1fr_180px_140px]"
                href={`/admin/submissions/${submission.id}`}
                key={submission.id}
              >
                <div>
                  <div className="font-semibold">{submission.toolName}</div>
                  <p className="mt-1 line-clamp-2 text-sm leading-6 text-ink/60">
                    {submission.description || "No description provided."}
                  </p>
                  <p className="mt-2 text-xs text-ink/45">
                    {submission.websiteUrl}
                  </p>
                </div>
                <div className="text-sm text-ink/60">
                  <div>{submission.category}</div>
                  <div className="mt-1">{submission.pricingType}</div>
                </div>
                <div className="text-sm text-ink/60 md:text-right">
                  <div>{formatDate(submission.createdAt)}</div>
                  <div className="mt-1">{submission.submitterEmail}</div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="px-5 py-12 text-center">
            <h2 className="font-semibold">Nothing to review here</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-ink/60">
              This queue is empty. New public submissions will appear here once
              users send tools for review.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
