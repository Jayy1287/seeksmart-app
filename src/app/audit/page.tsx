import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  ClipboardCheck,
  Gauge,
  ListChecks,
  ShieldCheck,
  Target
} from "lucide-react";

export const metadata: Metadata = {
  title: "Rules-Based AI Audit",
  description:
    "Run an anonymous, rules-based AI audit to identify business opportunities, recommended workflows, and tool shortlists.",
  alternates: {
    canonical: "/audit"
  },
  openGraph: {
    title: "Rules-Based AI Audit",
    description:
      "Run an anonymous, rules-based AI audit to identify business opportunities, recommended workflows, and tool shortlists.",
    url: "/audit",
    type: "website"
  }
};

const outcomes = [
  {
    icon: Target,
    title: "Top opportunities",
    description: "Ranked business opportunities based on your context."
  },
  {
    icon: Gauge,
    title: "Effort and risk",
    description: "Clear scores for impact, effort, risk, and confidence."
  },
  {
    icon: ListChecks,
    title: "First workflow",
    description: "A focused starting workflow and practical checklist."
  },
  {
    icon: ShieldCheck,
    title: "Explainable reasons",
    description: "Transparent rules and cautions behind each recommendation."
  }
];

export default function AuditPage() {
  return (
    <main className="page-shell">
      <div className="app-container">
        <section className="border-b border-line/50 pb-10">
          <div className="grid gap-10 lg:grid-cols-[1fr_0.82fr] lg:items-center">
            <div>
              <p className="eyebrow">
                <ClipboardCheck aria-hidden="true" size={14} />
                AI audit
              </p>
              <h1 className="mt-5 max-w-3xl text-5xl font-semibold leading-[0.98] md:text-6xl">
                Find the first AI workflow your business should improve.
              </h1>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-ink/68">
                Answer a short structured audit and get a deterministic
                recommendation brief. SeekSmart does not call an AI model or
                store your answers in this version.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link className="primary-button min-h-12" href="/audit/start">
                  Start audit
                  <ArrowRight aria-hidden="true" size={18} />
                </Link>
                <Link className="secondary-button min-h-12" href="/methodology">
                  How scoring works
                </Link>
              </div>
            </div>

            <div className="relative">
              <div>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-accent">
                      Audit output
                    </p>
                    <h2 className="mt-1 text-2xl font-semibold">
                      Business plan, not a tool dump
                    </h2>
                  </div>
                  <BarChart3 aria-hidden="true" className="text-accent" />
                </div>
                <div className="mt-5 grid gap-4">
                  {[
                    "Opportunity ranking",
                    "Recommended first workflow",
                    "Tool shortlist with reasons",
                    "Risk and privacy cautions"
                  ].map((item, index) => (
                    <div
                      className="border-t border-line/70 pt-4"
                      key={item}
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-sm font-semibold text-paper">
                          {index + 1}
                        </span>
                        <span className="font-semibold">{item}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-x-8 gap-y-6 md:grid-cols-2 lg:grid-cols-4">
          {outcomes.map((outcome) => {
            const Icon = outcome.icon;

            return (
              <article className="border-t border-line/70 pt-5" key={outcome.title}>
                <Icon aria-hidden="true" className="text-accent" size={22} />
                <h2 className="mt-4 text-lg font-semibold">{outcome.title}</h2>
                <p className="mt-2 text-sm leading-6 text-ink/62">
                  {outcome.description}
                </p>
              </article>
            );
          })}
        </section>

        <section className="section-band -mx-4 mt-10 px-4 py-8 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold">
                Built from SeekSmart taxonomy
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/60">
                The audit uses the structured intelligence layer: industries,
                functions, opportunities, use cases, and tool-fit notes.
              </p>
            </div>
            <Link className="primary-button" href="/audit/start">
              Begin
              <ArrowRight aria-hidden="true" size={16} />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
