import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ClipboardCheck, MessageSquareText } from "lucide-react";

export const metadata: Metadata = {
  title: "Feedback",
  description:
    "Share feedback on SeekSmart audit results, tool pages, and public beta quality.",
  alternates: {
    canonical: "/feedback"
  }
};

const feedbackPrompts = [
  "Did the audit recommend a realistic first workflow?",
  "Which tool or use-case page felt thin or unclear?",
  "What business type should SeekSmart support next?",
  "Would you trust this enough to share with a client or team?"
];

export default function FeedbackPage() {
  const mailto =
    "mailto:seeksmartapp@gmail.com?subject=SeekSmart%20beta%20feedback&body=What%20I%20tested%3A%0A%0AWhat%20worked%3A%0A%0AWhat%20felt%20unclear%3A%0A%0AWhat%20I%20would%20change%3A";

  return (
    <main className="page-shell">
      <div className="app-container">
        <section className="surface-strong rounded-2xl p-6">
          <p className="eyebrow">
            <MessageSquareText aria-hidden="true" size={14} />
            Feedback
          </p>
          <div className="mt-3 grid gap-6 md:grid-cols-[1fr_260px] md:items-end">
            <div>
              <h1 className="text-4xl font-semibold">Help shape the beta</h1>
              <p className="mt-3 max-w-2xl leading-7 text-ink/65">
                SeekSmart should become more useful through real business
                questions, confusing recommendations, and honest page feedback.
              </p>
            </div>
            <a className="primary-button min-h-12" href={mailto}>
              Send feedback
              <ArrowRight aria-hidden="true" size={17} />
            </a>
          </div>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-2">
          {feedbackPrompts.map((prompt) => (
            <div className="surface-panel rounded-xl p-5" key={prompt}>
              <ClipboardCheck
                aria-hidden="true"
                className="text-accent"
                size={20}
              />
              <p className="mt-3 font-semibold leading-7">{prompt}</p>
            </div>
          ))}
        </section>

        <section className="surface-panel mt-6 rounded-xl p-6">
          <h2 className="text-xl font-semibold">Fast test path</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/60">
            Run an audit, open the top use case, then inspect the recommended
            tool page. That is the core beta journey.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Link className="primary-button" href="/audit/start">
              Start audit
            </Link>
            <Link className="secondary-button" href="/tools">
              Browse tools
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
