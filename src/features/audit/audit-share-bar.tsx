"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Link2, Printer, RotateCcw } from "lucide-react";

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
      <button className="secondary-button min-h-10" onClick={copyLink} type="button">
        {copied ? (
          <Check aria-hidden="true" size={15} />
        ) : (
          <Link2 aria-hidden="true" size={15} />
        )}
        {copied ? "Link copied" : "Copy link"}
      </button>
      <button
        className="secondary-button min-h-10"
        onClick={() => window.print()}
        type="button"
      >
        <Printer aria-hidden="true" size={15} />
        Print or save PDF
      </button>
      <Link className="secondary-button min-h-10" href="/audit/questions">
        <RotateCcw aria-hidden="true" size={15} />
        Adjust answers
      </Link>
      {!isSignedIn ? (
        <Link
          className="secondary-button min-h-10"
          href={`/login?callbackUrl=${encodeURIComponent(new URL(shareUrl).pathname)}`}
        >
          Save to account
        </Link>
      ) : null}
    </div>
  );
}
