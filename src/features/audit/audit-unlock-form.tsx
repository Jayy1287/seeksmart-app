"use client";

import { useActionState, useEffect } from "react";
import { Loader2, LockKeyhole, Mail } from "lucide-react";
import { trackAuditEvent } from "@/features/audit/audit-analytics";
import {
  unlockAuditAction,
  type UnlockAuditState
} from "@/server/audit-runs/actions";

const initialState: UnlockAuditState = {};

export function AuditUnlockForm({
  auditRunId,
  items
}: {
  auditRunId: string;
  items: string[];
}) {
  const [state, formAction, isPending] = useActionState(
    unlockAuditAction,
    initialState
  );

  useEffect(() => {
    trackAuditEvent("audit_unlock_viewed", { audit_run_id: auditRunId });
  }, [auditRunId]);

  return (
    <section className="unlock-panel" id="unlock">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <p className="eyebrow">
            <LockKeyhole aria-hidden="true" size={14} />
            Full brief
          </p>
          <h2 className="mt-4 text-2xl font-semibold leading-tight md:text-3xl">
            Get the complete pilot plan and tool shortlist.
          </h2>
          <p className="mt-3 text-sm leading-6 text-ink/62">
            The ranking above is free. Enter your email to unlock the rest of
            this brief, keep the link alive, and get a printable version. No
            account needed, no newsletter unless you ask.
          </p>
          <ul className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
            {items.map((item) => (
              <li className="flex items-start gap-2 leading-6" key={item}>
                <span
                  aria-hidden="true"
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-signal"
                />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <form action={formAction} className="unlock-form">
          <input name="id" type="hidden" value={auditRunId} />
          <label className="block text-sm font-semibold text-ink/72">
            Work email
            <span className="relative mt-2 block">
              <Mail
                aria-hidden="true"
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40"
                size={18}
              />
              <input
                autoComplete="email"
                className="control-field min-h-12 w-full pl-11"
                name="email"
                placeholder="you@company.com"
                required
                type="email"
              />
            </span>
          </label>
          <button
            className="primary-button mt-3 min-h-12 w-full"
            disabled={isPending}
            type="submit"
          >
            {isPending ? (
              <>
                <Loader2 aria-hidden="true" className="animate-spin" size={18} />
                Unlocking
              </>
            ) : (
              "Unlock the full brief"
            )}
          </button>
          {state.error ? (
            <p className="mt-3 text-sm font-medium text-secondary" role="alert">
              {state.error}
            </p>
          ) : null}
          <p className="mt-3 text-xs leading-5 text-ink/45">
            We use the email to keep this brief available and, if you sign in
            later with it, to attach the brief to your account.
          </p>
        </form>
      </div>
    </section>
  );
}
