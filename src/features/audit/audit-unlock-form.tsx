"use client";

import { useActionState, useEffect } from "react";
import { ArrowRight, Loader2, LockKeyhole } from "lucide-react";
import { motion } from "motion/react";
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
    <motion.section
      className="no-print surface relative overflow-hidden px-5 py-8 sm:px-8 md:px-12 md:py-12"
      id="unlock"
      initial={{ opacity: 0, y: 28 }}
      transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true, margin: "100000px 0px -48px 0px" }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <div
        aria-hidden="true"
        className="glow-orb -right-32 -top-40 h-[22rem] w-[22rem] opacity-20"
      />
      <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-end lg:gap-14">
        <div>
          <p className="eyebrow eyebrow-plain">
            <LockKeyhole aria-hidden="true" size={13} />
            Full brief
          </p>
          <h2 className="h2 mt-5">
            Unlock the plan.
            <br />
            <span className="ghost-word">Free, by email.</span>
          </h2>
          <ul className="mt-6 flex flex-wrap gap-2">
            {items.map((item) => (
              <li
                className="inline-flex items-center gap-2 rounded-full bg-ink/[0.05] px-3 py-1.5 text-sm text-ink/70"
                key={item}
              >
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-signal" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <form action={formAction}>
          <input name="id" type="hidden" value={auditRunId} />
          <label className="sr-only" htmlFor="unlock-email">
            Work email
          </label>
          <div className="flex flex-col gap-2 rounded-[1.75rem] border border-ink/10 bg-paper p-2 transition-colors focus-within:border-ink/40 sm:flex-row sm:rounded-full">
            <input
              autoComplete="email"
              className="min-h-12 min-w-0 flex-1 rounded-full bg-transparent px-4 text-base outline-none placeholder:text-ink/40"
              id="unlock-email"
              inputMode="email"
              name="email"
              placeholder="you@company.com"
              required
              type="email"
            />
            <button className="btn btn-primary btn-lg shrink-0" disabled={isPending} type="submit">
              {isPending ? (
                <>
                  <Loader2 aria-hidden="true" className="animate-spin" size={18} />
                  Unlocking
                </>
              ) : (
                <>
                  Unlock
                  <ArrowRight aria-hidden="true" size={18} />
                </>
              )}
            </button>
          </div>
          {state.error ? (
            <p className="mt-3 px-2 text-sm font-medium text-danger" role="alert">
              {state.error}
            </p>
          ) : null}
          <p className="mt-3 px-2 text-xs text-ink/45">
            Keeps this brief alive. No newsletter unless you ask.
          </p>
        </form>
      </div>
    </motion.section>
  );
}
