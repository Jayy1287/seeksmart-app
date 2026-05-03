"use client";

import { FormEvent, useState } from "react";
import { LockKeyhole } from "lucide-react";
import type { ApiResponse } from "@/shared/api";

type LoginState = "idle" | "submitting" | "error";

export function AdminLoginForm() {
  const [state, setState] = useState<LoginState>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("password") ?? "");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ password })
      });
      const result = (await response.json()) as ApiResponse<{
        authenticated: boolean;
      }>;

      if (!response.ok || !result.ok) {
        setState("error");
        setMessage(result.ok ? "Unable to sign in." : result.error.message);
        return;
      }

      window.location.assign("/admin");
    } catch {
      setState("error");
      setMessage("Unable to sign in right now.");
    }
  }

  return (
    <form
      className="surface-panel grid gap-4 rounded-xl p-5"
      onSubmit={handleSubmit}
    >
      <label className="grid gap-2">
        <span className="text-sm font-medium">Admin password</span>
        <input
          autoComplete="current-password"
          className="control-field"
          name="password"
          required
          type="password"
        />
      </label>
      <button
        className="primary-button disabled:opacity-60"
        disabled={state === "submitting"}
      >
        <LockKeyhole aria-hidden="true" size={17} />
        {state === "submitting" ? "Signing in" : "Sign in"}
      </button>
      {message ? <p className="text-sm text-signal">{message}</p> : null}
    </form>
  );
}
