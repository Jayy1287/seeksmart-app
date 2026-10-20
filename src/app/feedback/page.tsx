import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FeedbackComposer } from "@/features/content/feedback-composer";
import { FormSplit } from "@/features/content/form-split";

export const metadata: Metadata = {
  title: "Feedback",
  description:
    "Share feedback on SeekSmart audit results, tool pages, and public beta quality.",
  alternates: {
    canonical: "/feedback"
  }
};

const feedbackPrompts = [
  "Was the first workflow realistic?",
  "Which page felt thin or unclear?",
  "Which business should we support next?",
  "Would you share it with your team?"
];

export default function FeedbackPage() {
  return (
    <FormSplit
      eyebrow="Feedback"
      footer={
        <Link className="link-underline text-sm text-ink/60 hover:text-ink" href="/audit/questions">
          Fastest test: run the audit, open the top pick
          <ArrowRight aria-hidden="true" size={14} />
        </Link>
      }
      lead="Honest notes make the beta better. Two minutes is plenty."
      lines={[["Tell us"], [{ text: "what broke.", className: "ghost-word" }]]}
      points={feedbackPrompts}
    >
      <FeedbackComposer />
    </FormSplit>
  );
}
