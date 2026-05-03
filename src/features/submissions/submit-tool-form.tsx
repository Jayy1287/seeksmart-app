"use client";

import { FormEvent, useState } from "react";
import { Send } from "lucide-react";
import { trackEvent } from "@/features/analytics/site-analytics";
import type { ApiResponse } from "@/shared/api";

type SubmitState = "idle" | "submitting" | "success" | "error";

export function SubmitToolForm() {
  const [state, setState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const payload = {
      toolName: String(formData.get("toolName") ?? ""),
      websiteUrl: String(formData.get("websiteUrl") ?? ""),
      description: String(formData.get("description") ?? ""),
      category: String(formData.get("category") ?? ""),
      pricingType: String(formData.get("pricingType") ?? ""),
      submitterEmail: String(formData.get("submitterEmail") ?? ""),
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

      event.currentTarget.reset();
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
      className="surface-panel grid gap-4 rounded-xl p-5"
      onSubmit={handleSubmit}
    >
      <label className="hidden">
        Company name
        <input autoComplete="off" name="companyName" tabIndex={-1} />
      </label>
      <label className="grid gap-2">
        <span className="text-sm font-medium">Tool name</span>
        <input
          className="control-field"
          maxLength={120}
          name="toolName"
          required
        />
      </label>
      <label className="grid gap-2">
        <span className="text-sm font-medium">Website URL</span>
        <input
          className="control-field"
          maxLength={300}
          name="websiteUrl"
          required
          type="url"
        />
      </label>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm font-medium">Category</span>
          <input
            className="control-field"
            maxLength={80}
            name="category"
            required
          />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-medium">Pricing</span>
          <select
            className="control-field"
            defaultValue="FREEMIUM"
            name="pricingType"
          >
            <option value="FREE">Free</option>
            <option value="FREEMIUM">Freemium</option>
            <option value="PAID">Paid</option>
          </select>
        </label>
      </div>
      <label className="grid gap-2">
        <span className="text-sm font-medium">Description</span>
        <textarea
          className="control-field min-h-32 py-3"
          maxLength={1200}
          minLength={20}
          name="description"
          required
        />
      </label>
      <label className="grid gap-2">
        <span className="text-sm font-medium">Your email</span>
        <input
          className="control-field"
          maxLength={180}
          name="submitterEmail"
          required
          type="email"
        />
      </label>
      <button
        className="primary-button disabled:opacity-60"
        disabled={state === "submitting"}
      >
        {state === "submitting" ? "Submitting" : "Submit tool"}
        <Send aria-hidden="true" size={17} />
      </button>
      {message ? (
        <p
          className={
            state === "success" ? "text-sm text-accent" : "text-sm text-signal"
          }
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
