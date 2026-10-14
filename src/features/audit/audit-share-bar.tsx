"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Check, Link2, Printer, RotateCcw, UserPlus } from "lucide-react";

export function AuditShareBar({
  isSignedIn,
  shareUrl
}: {
  isSignedIn: boolean;
  shareUrl: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this link", shareUrl);
    }
  }

  return (
    <div className="no-print flex flex-wrap items-center gap-2">
      <button className="btn btn-primary btn-sm" onClick={copyLink} type="button">
        <AnimatePresence initial={false} mode="wait">
          <motion.span
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2"
            exit={{ opacity: 0, y: -6 }}
            initial={{ opacity: 0, y: 6 }}
            key={copied ? "copied" : "copy"}
            transition={{ duration: 0.2 }}
          >
            {copied ? (
              <Check aria-hidden="true" size={15} />
            ) : (
              <Link2 aria-hidden="true" size={15} />
            )}
            {copied ? "Copied" : "Copy link"}
          </motion.span>
        </AnimatePresence>
      </button>
      <button className="btn btn-ghost btn-sm" onClick={() => window.print()} type="button">
        <Printer aria-hidden="true" size={15} />
        Save PDF
      </button>
      <Link className="btn btn-ghost btn-sm" href="/audit/questions">
        <RotateCcw aria-hidden="true" size={15} />
        Adjust answers
      </Link>
      {!isSignedIn ? (
        <Link
          className="btn btn-ghost btn-sm"
          href={`/login?callbackUrl=${encodeURIComponent(new URL(shareUrl).pathname)}`}
        >
          <UserPlus aria-hidden="true" size={15} />
          Save to account
        </Link>
      ) : null}
    </div>
  );
}
