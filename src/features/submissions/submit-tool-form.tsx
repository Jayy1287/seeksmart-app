"use client";

import { FormEvent, useState } from "react";
import { Send } from "lucide-react";
import { trackEvent } from "@/features/analytics/site-analytics";
import type { ApiResponse } from "@/shared/api";

type SubmitState = "idle" | "submitting" | "success" | "error";

type SubmitToolFormProps = {
  submitterEmail: string;
};

export function SubmitToolForm({ submitterEmail }: SubmitToolFormProps) {
  const [state, setState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      toolName: String(formData.get("toolName") ?? ""),
      websiteUrl: String(formData.get("websiteUrl") ?? ""),
      description: String(formData.get("description") ?? ""),
      category: String(formData.get("category") ?? ""),
      pricingType: String(formData.get("pricingType") ?? ""),
      companyName: String(formData.get("companyName") ?? "")
    };

    try {
      const response = await fetch("/api/v1/submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      const result = (await response.json()) as ApiResponse<unknown>;

      if (!result.ok) {
        setState("error");
        setMessage(result.error.message);
        trackEvent("submission_failed", {
          reason: result.error.code
        });
        return;
      }

      form.reset();
      setState("success");
      setMessage("Submission received. It will appear after review.");
      trackEvent("submission_completed");
    } catch {
      setState("error");
      setMessage("Unable to submit right now. Please try again.");
      trackEvent("submission_failed", {
        reason: "NETWORK_ERROR"
      });
    }
  }

  return (
    <form
      className="surface grid gap-6 p-6 shadow-[0_30px_70px_-40px_rgb(14_14_16/0.35)] md:p-10"
      onSubmit={handleSubmit}
    >
      <label className="hidden">
        Company name
        <input autoComplete="off" name="companyName" tabIndex={-1} />
      </label>
      <div className="flex items-center justify-between gap-4 border-b border-ink/10 pb-5">
        <p className="font-display text-2xl font-bold tracking-[-0.03em]">New listing</p>
        <span className="tag max-w-[55%] truncate" title={submitterEmail}>
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-success" />
          <span className="truncate">{submitterEmail}</span>
        </span>
      </div>
      <label className="block">
        <span className="field-label">Tool name</span>
        <input
          className="field"
          maxLength={120}
          name="toolName"
          placeholder="e.g. Tidio"
          required
        />
      </label>
      <label className="block">
        <span className="field-label">Website URL</span>
        <input
          className="field"
          maxLength={300}
          name="websiteUrl"
          placeholder="https://"
          required
          type="url"
        />
      </label>
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block">
          <span className="field-label">Category</span>
          <input
            className="field"
            maxLength={80}
            name="category"
            placeholder="e.g. Customer support"
            required
          />
        </label>
        <label className="block">
          <span className="field-label">Pricing</span>
          <select
            className="field"
            defaultValue="FREEMIUM"
            name="pricingType"
          >
            <option value="FREE">Free</option>
            <option value="FREEMIUM">Freemium</option>
            <option value="PAID">Paid</option>
          </select>
        </label>
      </div>
      <label className="block">
        <span className="field-label">Description</span>
        <textarea
          className="field min-h-36"
          maxLength={1200}
          minLength={20}
          name="description"
          placeholder="What it does and who it is for."
          required
        />
      </label>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          className="btn btn-primary btn-lg"
          disabled={state === "submitting"}
        >
          {state === "submitting" ? "Submitting" : "Submit tool"}
          <Send aria-hidden="true" size={17} />
        </button>
        {message ? (
          <p
            aria-live="polite"
            className={
              state === "success"
                ? "flex items-center gap-2 text-sm font-medium text-success"
                : "flex items-center gap-2 text-sm font-medium text-danger"
            }
            role="status"
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${state === "success" ? "bg-success" : "bg-danger"}`}
            />
            {message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
