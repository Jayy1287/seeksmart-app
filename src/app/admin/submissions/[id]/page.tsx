import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { SubmissionReviewActions } from "@/features/admin/submission-review-actions";
import { isAdminAuthenticated } from "@/server/admin/auth";
import { getAdminSubmissionById } from "@/server/admin/queries";

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

  return (
    <main className="mx-auto grid max-w-6xl gap-6 px-5 py-10">
      <section className="rounded-md border border-line bg-white p-5">
        <Link
          className="inline-flex items-center gap-2 text-sm font-medium text-accent"
          href="/admin"
        >
          <ArrowLeft aria-hidden="true" size={16} />
          Review queue
        </Link>
        <div className="mt-5 grid gap-5 md:grid-cols-[1fr_260px] md:items-start">
          <div>
            <p className="text-sm font-medium uppercase text-accent">
              {submission.status}
            </p>
            <h1 className="mt-2 text-4xl font-semibold">
              {submission.toolName}
            </h1>
            <p className="mt-3 max-w-3xl leading-7 text-ink/65">
              {submission.description || "No description provided."}
            </p>
            <a
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-accent"
              href={submission.websiteUrl}
              rel="noreferrer"
              target="_blank"
            >
              Visit website
              <ExternalLink aria-hidden="true" size={15} />
            </a>
          </div>
          <div className="grid gap-3 rounded-md border border-line p-4 text-sm">
            <div>
              <div className="text-ink/50">Submitted</div>
              <div className="font-medium">{formatDate(submission.createdAt)}</div>
            </div>
            <div>
              <div className="text-ink/50">Reviewed</div>
              <div className="font-medium">{formatDate(submission.reviewedAt)}</div>
            </div>
            <div>
              <div className="text-ink/50">Submitter</div>
              <div className="break-words font-medium">
                {submission.submitterEmail}
              </div>
            </div>
          </div>
        </div>
      </section>

      {submission.status === "PENDING" ? (
        <SubmissionReviewActions submission={submission} />
      ) : (
        <section className="rounded-md border border-line bg-white p-8 text-center">
          <h2 className="font-semibold">Review complete</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-ink/60">
            This submission has already been reviewed and cannot be changed from
            this screen.
          </p>
        </section>
      )}
    </main>
  );
}
