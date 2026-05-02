"use client";

import { FormEvent, useState } from "react";
import { Send } from "lucide-react";

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
      submitterEmail: String(formData.get("submitterEmail") ?? "")
    };

    const response = await fetch("/api/v1/submissions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      setState("error");
      setMessage("Please check the form and try again.");
      return;
    }

    event.currentTarget.reset();
    setState("success");
    setMessage("Submission received. It will appear after review.");
  }

  return (
    <form
      className="grid gap-4 rounded-md border border-line bg-white p-5"
      onSubmit={handleSubmit}
    >
      <label className="grid gap-2">
        <span className="text-sm font-medium">Tool name</span>
        <input
          className="min-h-11 rounded-md border border-line px-3 outline-none focus:border-accent"
          name="toolName"
          required
        />
      </label>
      <label className="grid gap-2">
        <span className="text-sm font-medium">Website URL</span>
        <input
          className="min-h-11 rounded-md border border-line px-3 outline-none focus:border-accent"
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
            name="category"
            required
          />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-medium">Pricing</span>
          <select
            className="min-h-11 rounded-md border border-line bg-white px-3 outline-none focus:border-accent"
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
          className="min-h-32 rounded-md border border-line px-3 py-3 outline-none focus:border-accent"
          name="description"
          required
        />
      </label>
      <label className="grid gap-2">
        <span className="text-sm font-medium">Your email</span>
        <input
          className="min-h-11 rounded-md border border-line px-3 outline-none focus:border-accent"
          name="submitterEmail"
          required
          type="email"
        />
      </label>
      <button
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-ink px-5 font-medium text-paper disabled:opacity-60"
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
