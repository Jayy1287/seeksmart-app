"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import type {
  AdminSubmissionDetail,
  AdminTaxonomyOptions
} from "@/server/admin/queries";
import type { ApiResponse } from "@/shared/api";

type ReviewState = "idle" | "submitting" | "success" | "error";

type SubmissionReviewActionsProps = {
  submission: AdminSubmissionDetail;
  taxonomy: AdminTaxonomyOptions;
};

export function SubmissionReviewActions({
  submission,
  taxonomy
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
      categoryId: String(formData.get("categoryId") ?? ""),
      categoryName: String(formData.get("categoryName") ?? ""),
      pricingType: String(formData.get("pricingType") ?? ""),
      hasFreePlan: formData.get("hasFreePlan") === "on",
      isVerified: formData.get("isVerified") === "on",
      isFeatured: formData.get("isFeatured") === "on",
      popularityScore: Number(formData.get("popularityScore") ?? 0),
      metaTitle: String(formData.get("metaTitle") ?? ""),
      metaDescription: String(formData.get("metaDescription") ?? ""),
      featureIds: formData.getAll("featureIds").map(String),
      useCaseIds: formData.getAll("useCaseIds").map(String),
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
  const matchingCategory = taxonomy.categories.find(
    (category) =>
      category.name.toLowerCase() === submission.category.toLowerCase()
  );
  const defaultMetaTitle = `${submission.toolName} Review, Pricing, and Alternatives`;
  const defaultMetaDescription = submission.description.slice(0, 220);

  return (
    <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
      <form
        className="surface-panel grid gap-4 rounded-xl p-5"
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
              className="control-field"
              defaultValue={submission.toolName}
              maxLength={120}
              name="name"
              required
            />
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-medium">Slug</span>
            <input
              className="control-field"
              defaultValue={submission.suggestedSlug}
              maxLength={120}
              name="slug"
            />
          </label>
        </div>
        <label className="grid gap-2">
          <span className="text-sm font-medium">Website URL</span>
          <input
            className="control-field"
            defaultValue={submission.websiteUrl}
            name="websiteUrl"
            required
            type="url"
          />
        </label>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-sm font-medium">Existing category</span>
            <select
              className="control-field"
              defaultValue={matchingCategory?.id ?? ""}
              name="categoryId"
            >
              <option value="">Create from submitted category</option>
              {taxonomy.categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-medium">Pricing</span>
            <select
              className="control-field"
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
          <span className="text-sm font-medium">New category fallback</span>
          <input
            className="control-field"
            defaultValue={submission.category}
            maxLength={80}
            name="categoryName"
          />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-medium">Short description</span>
          <textarea
            className="control-field min-h-24 py-3"
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
            className="control-field min-h-32 py-3"
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
          <label className="inline-flex items-center gap-2">
            <input
              className="h-4 w-4 accent-accent"
              name="isFeatured"
              type="checkbox"
            />
            Featured
          </label>
        </div>
        <label className="grid gap-2">
          <span className="text-sm font-medium">Popularity score</span>
          <input
            className="control-field"
            defaultValue={0}
            max={100}
            min={0}
            name="popularityScore"
            type="number"
          />
        </label>
        <fieldset className="metric-tile grid gap-3 rounded-xl p-4">
          <legend className="px-1 text-sm font-medium">Use cases</legend>
          <div className="grid gap-2 md:grid-cols-2">
            {taxonomy.useCases.map((useCase) => (
              <label
                className="inline-flex items-center gap-2 text-sm"
                key={useCase.id}
              >
                <input
                  className="h-4 w-4 accent-accent"
                  name="useCaseIds"
                  type="checkbox"
                  value={useCase.id}
                />
                {useCase.name}
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset className="metric-tile grid gap-3 rounded-xl p-4">
          <legend className="px-1 text-sm font-medium">Features</legend>
          <div className="grid gap-2 md:grid-cols-2">
            {taxonomy.features.map((feature) => (
              <label
                className="inline-flex items-center gap-2 text-sm"
                key={feature.id}
              >
                <input
                  className="h-4 w-4 accent-accent"
                  name="featureIds"
                  type="checkbox"
                  value={feature.id}
                />
                {feature.name}
              </label>
            ))}
          </div>
        </fieldset>
        <section className="metric-tile grid gap-4 rounded-xl p-4">
          <div>
            <h3 className="font-semibold">Public preview</h3>
            <p className="mt-1 text-sm text-ink/60">
              Check the slug and search metadata before publishing.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm font-medium">Meta title</span>
              <input
                className="control-field"
                defaultValue={defaultMetaTitle}
                maxLength={120}
                name="metaTitle"
              />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-medium">Public path</span>
              <input
                className="control-field text-ink/60"
                defaultValue={`/tools/${submission.suggestedSlug}`}
                readOnly
              />
            </label>
          </div>
          <label className="grid gap-2">
            <span className="text-sm font-medium">Meta description</span>
            <textarea
              className="control-field min-h-20 py-3"
              defaultValue={defaultMetaDescription}
              maxLength={220}
              name="metaDescription"
            />
          </label>
        </section>
        <label className="grid gap-2">
          <span className="text-sm font-medium">Review note</span>
          <input
            className="control-field"
            maxLength={500}
            name="reviewNote"
          />
        </label>
        <button
          className="primary-button bg-accent text-paper disabled:opacity-60"
          disabled={isDisabled}
        >
          <CheckCircle2 aria-hidden="true" size={17} />
          {state === "submitting" ? "Saving" : "Approve and publish"}
        </button>
      </form>

      <form
        className="surface-panel grid content-start gap-4 rounded-xl p-5"
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
            className="control-field min-h-32 py-3"
            maxLength={500}
            minLength={5}
            name="reason"
            required
          />
        </label>
        <button
          className="secondary-button min-h-11 border-signal text-signal disabled:opacity-60"
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
