import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { SubmissionReviewActions } from "@/features/admin/submission-review-actions";
import { AdminHeader } from "@/features/admin/admin-shell";
import { isAdminAuthenticated } from "@/server/admin/auth";
import {
  findSubmissionDuplicateCandidates,
  getAdminSubmissionById,
  listAdminTaxonomyOptions
} from "@/server/admin/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Review Submission",
  robots: {
    index: false,
    follow: false
  }
};

type AdminSubmissionPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function formatDate(value: Date | null) {
  if (!value) {
    return "Not reviewed";
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(value);
}

export default async function AdminSubmissionPage({
  params
}: AdminSubmissionPageProps) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const { id } = await params;
  const submission = await getAdminSubmissionById(id);

  if (!submission) {
    notFound();
  }

  const [taxonomy, duplicateCandidates] = await Promise.all([
    listAdminTaxonomyOptions(),
    findSubmissionDuplicateCandidates(submission)
  ]);

  return (
    <main className="app-container page-hero grid grid-cols-[minmax(0,1fr)] gap-10 pb-24">
      <AdminHeader
        actions={
          <a
            className="btn btn-ghost"
            href={submission.websiteUrl}
            rel="noreferrer"
            target="_blank"
          >
            Visit website
            <ExternalLink aria-hidden="true" size={15} />
          </a>
        }
        back={{ href: "/admin", label: "Review queue" }}
        eyebrow={submission.status}
        lead={submission.description || "No description provided."}
        title={submission.toolName}
      />

      <dl className="grid gap-px overflow-hidden rounded-2xl bg-ink/10 sm:grid-cols-3">
        {[
          { label: "Submitted", value: formatDate(submission.createdAt) },
          { label: "Reviewed", value: formatDate(submission.reviewedAt) },
          { label: "Submitter", value: submission.submitterEmail }
        ].map((item) => (
          <div className="min-w-0 bg-paper p-5" key={item.label}>
            <dt className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-ink/45">{item.label}</dt>
            <dd className="mt-2 break-words font-medium">{item.value}</dd>
          </div>
        ))}
      </dl>

      <section>
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="h3">Duplicate check</h2>
          <span className={duplicateCandidates.length > 0 ? "tag tag-warning" : "tag tag-success"}>
            {duplicateCandidates.length} matches
          </span>
        </div>
        {duplicateCandidates.length > 0 ? (
          <ul className="row-list mt-5">
            {duplicateCandidates.map((candidate) => (
              <li
                className="row-item grid-cols-[minmax(0,1fr)_auto] gap-x-4 py-4"
                key={`${candidate.type}-${candidate.id}`}
              >
                <div className="min-w-0">
                  <div className="font-medium">{candidate.label}</div>
                  <p className="mt-1 break-words text-sm text-ink/55">{candidate.detail}</p>
                </div>
                <span className="tag">
                  {candidate.type} · {candidate.status}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-ink/55">
            No existing tools or submissions match this name or website.
          </p>
        )}
      </section>

      {submission.status === "PENDING" ? (
        <SubmissionReviewActions submission={submission} taxonomy={taxonomy} />
      ) : (
        <div className="border-y border-ink/10 py-14 text-center">
          <p className="font-display text-2xl font-bold tracking-[-0.03em]">Review complete.</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-ink/55">
            This submission has already been reviewed.
          </p>
        </div>
      )}
    </main>
  );
}
