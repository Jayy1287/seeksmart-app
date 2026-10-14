"use client";

import { useEffect } from "react";
import Link from "next/link";
import type { Route } from "next";
import { ArrowRight, LockKeyhole } from "lucide-react";
import { motion } from "motion/react";
import { trackAuditEvent } from "@/features/audit/audit-analytics";

// Shown on a locked brief. Signed-out viewers sign in (and claim the brief if
// they created it in this browser); signed-in viewers of someone else's
// locked brief are pointed at their own audit instead.
export function AuditSignInPanel({
  auditRunId,
  isSignedIn,
  items
}: {
  auditRunId: string;
  isSignedIn: boolean;
  items: string[];
}) {
  useEffect(() => {
    trackAuditEvent("audit_unlock_viewed", {
      audit_run_id: auditRunId,
      signed_in: isSignedIn
    });
  }, [auditRunId, isSignedIn]);

  const href = (
    isSignedIn
      ? "/audit/questions"
      : `/login?callbackUrl=${encodeURIComponent(`/audit/r/${auditRunId}`)}`
  ) as Route;

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
      <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-14">
        <div>
          <p className="eyebrow eyebrow-plain">
            <LockKeyhole aria-hidden="true" size={13} />
            Full brief
          </p>
          <h2 className="h2 mt-5">
            {isSignedIn ? "This brief is private." : "Sign in for the plan."}
            <br />
            <span className="ghost-word">
              {isSignedIn ? "Run your own." : "Free with an account."}
            </span>
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
        <Link className="btn btn-primary btn-lg self-start lg:self-end" href={href}>
          {isSignedIn ? "Start your audit" : "Sign in to unlock"}
          <ArrowRight aria-hidden="true" size={18} />
        </Link>
      </div>
    </motion.section>
  );
}
