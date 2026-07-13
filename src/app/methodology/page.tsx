import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { methodologySignals } from "@/lib/platform-content";

export const metadata: Metadata = {
  title: "Recommendation Methodology",
  description:
    "How SeekSmart turns business goals into practical AI recommendations and tool guidance.",
  alternates: {
    canonical: "/methodology"
  },
  openGraph: {
    title: "Recommendation Methodology",
    description:
      "How SeekSmart turns business goals into practical AI recommendations and tool guidance.",
    url: "/methodology",
    type: "website"
  }
};

const scoringDimensions = [
  "Business impact",
  "Implementation effort",
  "Budget fit",
  "Data and privacy risk",
  "Team size fit",
  "Time to first value",
  "Editorial confidence"
];

export default function MethodologyPage() {
  return (
    <main className="page-shell">
      <div className="app-container">
        <section className="surface-strong rounded-2xl p-6">
          <p className="eyebrow">Methodology</p>
          <div className="mt-3 grid gap-5 md:grid-cols-[1fr_280px] md:items-end">
            <div>
              <h1 className="text-4xl font-semibold">
                How SeekSmart recommends AI paths
              </h1>
              <p className="mt-3 max-w-2xl leading-7 text-ink/65">
                SeekSmart is designed to help teams move from a business problem
                to a practical next step, with logic that can be reviewed instead
                of guessed at.
              </p>
            </div>
            <div className="metric-tile rounded-xl p-4">
              <div className="text-2xl font-semibold">4</div>
              <p className="mt-1 text-sm text-ink/55">
                Core recommendation principles
              </p>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-2">
          {methodologySignals.map((signal) => {
            const Icon = signal.icon;

            return (
              <article className="surface-panel rounded-xl p-5" key={signal.title}>
                <Icon aria-hidden="true" className="text-accent" size={24} />
                <h2 className="mt-4 text-xl font-semibold">{signal.title}</h2>
                <p className="mt-3 leading-7 text-ink/65">
                  {signal.description}
                </p>
              </article>
            );
          })}
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="surface-panel rounded-xl p-5">
            <h2 className="text-xl font-semibold">Scoring dimensions</h2>
            <p className="mt-3 text-sm leading-6 text-ink/60">
              Recommendations are only useful when the tradeoffs are visible.
              These dimensions shape how opportunities and tools are prioritized.
            </p>
            <div className="mt-5 grid gap-2">
              {scoringDimensions.map((dimension) => (
                <div
                  className="flex items-center gap-2 rounded-lg border border-line bg-surface/70 px-3 py-2 text-sm"
                  key={dimension}
                >
                  <CheckCircle2
                    aria-hidden="true"
                    className="shrink-0 text-accent"
                    size={15}
                  />
                  <span>{dimension}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="surface-strong rounded-xl p-5">
            <h2 className="text-xl font-semibold">Decision flow</h2>
            <div className="mt-5 grid gap-3">
              {[
                {
                  title: "Business context",
                  body: "Industry, team size, workflow, pain point, budget, urgency, and risk tolerance."
                },
                {
                  title: "Use-case mapping",
                  body: "Structured rules connect the problem to practical use cases and implementation patterns."
                },
                {
                  title: "Tool fit",
                  body: "Tools are ranked after the use case is clear, with visible reasons and tradeoffs."
                },
                {
                  title: "Next action",
                  body: "The output should tell the user what to try first, what to measure, and what to avoid."
                }
              ].map((item, index) => (
                <div
                  className="rounded-xl border border-line bg-surface/72 p-4"
                  key={item.title}
                >
                  <div className="flex items-start gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent text-sm font-semibold text-paper">
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-ink/60">
                        {item.body}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="surface-strong mt-8 rounded-2xl p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold">
                See the method applied
              </h2>
              <p className="mt-2 text-sm leading-6 text-ink/60">
                Use the audit, industry maps, and playbooks to move from a
                broad AI idea to a concrete first pilot.
              </p>
            </div>
            <Link className="primary-button" href="/audit">
              Open audit preview
              <ArrowRight aria-hidden="true" size={16} />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
