"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import type { AdminSubmissionDetail } from "@/server/admin/queries";
import type { ApiResponse } from "@/shared/api";

type ReviewState = "idle" | "submitting" | "success" | "error";

type SubmissionReviewActionsProps = {
  submission: AdminSubmissionDetail;
};

export function SubmissionReviewActions({
  submission
}: SubmissionReviewActionsProps) {
  const [state, setState] = useState<ReviewState>("idle");
  const [message, setMessage] = useState("");

  async function postReview(endpoint: string, payload: Record<string, unknown>) {
    setState("submitting");
    setMessage("");

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      const result = (await response.json()) as ApiResponse<unknown>;

      if (!response.ok || !result.ok) {
        setState("error");
        setMessage(result.ok ? "Review failed." : result.error.message);
        return;
      }

      setState("success");
      setMessage("Review saved.");
      window.location.assign("/admin");
    } catch {
      setState("error");
      setMessage("Unable to save review right now.");
    }
  }

  async function handleApprove(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    await postReview(`/api/admin/submissions/${submission.id}/approve`, {
      name: String(formData.get("name") ?? ""),
      slug: String(formData.get("slug") ?? ""),
      shortDescription: String(formData.get("shortDescription") ?? ""),
      longDescription: String(formData.get("longDescription") ?? ""),
      websiteUrl: String(formData.get("websiteUrl") ?? ""),
      categoryName: String(formData.get("categoryName") ?? ""),
      pricingType: String(formData.get("pricingType") ?? ""),
      hasFreePlan: formData.get("hasFreePlan") === "on",
      isVerified: formData.get("isVerified") === "on",
      reviewNote: String(formData.get("reviewNote") ?? "")
    });
  }

  async function handleReject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    await postReview(`/api/admin/submissions/${submission.id}/reject`, {
      reason: String(formData.get("reason") ?? "")
    });
  }

  const isDisabled = state === "submitting" || submission.status !== "PENDING";

  return (
    <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
      <form
        className="grid gap-4 rounded-md border border-line bg-white p-5"
        onSubmit={handleApprove}
      >
        <div>
          <h2 className="text-xl font-semibold">Approve as published tool</h2>
          <p className="mt-1 text-sm leading-6 text-ink/60">
            Edit the public fields before publishing. The tool becomes visible
            immediately after approval.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-sm font-medium">Tool name</span>
            <input
              className="min-h-11 rounded-md border border-line px-3 outline-none focus:border-accent"
              defaultValue={submission.toolName}
              maxLength={120}
              name="name"
              required
            />
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-medium">Slug</span>
            <input
              className="min-h-11 rounded-md border border-line px-3 outline-none focus:border-accent"
              defaultValue={submission.suggestedSlug}
              maxLength={120}
              name="slug"
            />
          </label>
        </div>
        <label className="grid gap-2">
          <span className="text-sm font-medium">Website URL</span>
          <input
            className="min-h-11 rounded-md border border-line px-3 outline-none focus:border-accent"
            defaultValue={submission.websiteUrl}
            name="websiteUrl"
            required
            type="url"
          />
        </label>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-sm font-medium">Category</span>
            <input
              className="min-h-11 rounded-md border border-line px-3 outline-none focus:border-accent"
              defaultValue={submission.category}
              maxLength={80}
              name="categoryName"
              required
            />
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-medium">Pricing</span>
            <select
              className="min-h-11 rounded-md border border-line bg-white px-3 outline-none focus:border-accent"
              defaultValue={submission.pricingType}
              name="pricingType"
            >
              <option value="FREE">Free</option>
              <option value="FREEMIUM">Freemium</option>
              <option value="PAID">Paid</option>
            </select>
          </label>
        </div>
        <label className="grid gap-2">
          <span className="text-sm font-medium">Short description</span>
          <textarea
            className="min-h-24 rounded-md border border-line px-3 py-3 outline-none focus:border-accent"
            defaultValue={submission.description}
            maxLength={220}
            minLength={20}
            name="shortDescription"
            required
          />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-medium">Long description</span>
          <textarea
            className="min-h-32 rounded-md border border-line px-3 py-3 outline-none focus:border-accent"
            defaultValue={submission.description}
            maxLength={2000}
            name="longDescription"
          />
        </label>
        <div className="flex flex-wrap gap-4 text-sm">
          <label className="inline-flex items-center gap-2">
            <input
              className="h-4 w-4 accent-accent"
              defaultChecked={submission.pricingType !== "PAID"}
              name="hasFreePlan"
              type="checkbox"
            />
            Free plan
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              className="h-4 w-4 accent-accent"
              name="isVerified"
              type="checkbox"
            />
            Verified
          </label>
        </div>
        <label className="grid gap-2">
          <span className="text-sm font-medium">Review note</span>
          <input
            className="min-h-11 rounded-md border border-line px-3 outline-none focus:border-accent"
            maxLength={500}
            name="reviewNote"
          />
        </label>
        <button
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-accent px-5 font-medium text-white disabled:opacity-60"
          disabled={isDisabled}
        >
          <CheckCircle2 aria-hidden="true" size={17} />
          {state === "submitting" ? "Saving" : "Approve and publish"}
        </button>
      </form>

      <form
        className="grid content-start gap-4 rounded-md border border-line bg-white p-5"
        onSubmit={handleReject}
      >
        <div>
          <h2 className="text-xl font-semibold">Reject submission</h2>
          <p className="mt-1 text-sm leading-6 text-ink/60">
            Keep a short reason so future review history is understandable.
          </p>
        </div>
        <label className="grid gap-2">
          <span className="text-sm font-medium">Reason</span>
          <textarea
            className="min-h-32 rounded-md border border-line px-3 py-3 outline-none focus:border-accent"
            maxLength={500}
            minLength={5}
            name="reason"
            required
          />
        </label>
        <button
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-signal px-5 font-medium text-signal disabled:opacity-60"
          disabled={isDisabled}
        >
          <XCircle aria-hidden="true" size={17} />
          Reject
        </button>
        {message ? (
          <p
            className={
              state === "success"
                ? "text-sm text-accent"
                : "text-sm text-signal"
            }
          >
            {message}
          </p>
        ) : null}
      </form>
    </div>
  );
}
