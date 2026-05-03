import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, AlertTriangle, Building2, CheckCircle2 } from "lucide-react";
import { listIndustrySummaries } from "@/server/intelligence/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "AI by Industry",
  description:
    "Explore practical AI opportunities, starting points, and cautions by industry.",
  alternates: {
    canonical: "/industries"
  },
  openGraph: {
    title: "AI by Industry",
    description:
      "Explore practical AI opportunities, starting points, and cautions by industry.",
    url: "/industries",
    type: "website"
  }
};

export default async function IndustriesPage() {
  const industries = await listIndustrySummaries();

  return (
    <main className="page-shell">
      <div className="app-container">
        <section className="surface-strong rounded-2xl p-6">
          <p className="eyebrow">Industries</p>
          <div className="mt-3 grid gap-5 md:grid-cols-[1fr_260px] md:items-end">
            <div>
              <h1 className="text-4xl font-semibold">
                AI starting points by business type
              </h1>
              <p className="mt-3 max-w-2xl leading-7 text-ink/65">
                Each industry map starts with practical workflows, measurable
                opportunities, and cautions before recommending individual tools.
              </p>
            </div>
            <div className="metric-tile rounded-xl p-4">
              <div className="text-2xl font-semibold">{industries.length}</div>
              <p className="mt-1 text-sm text-ink/55">Starter industries</p>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-2">
          {industries.map((industry) => {
            return (
              <article
                className="surface-panel rounded-xl p-5"
                id={industry.slug}
                key={industry.slug}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Building2
                      aria-hidden="true"
                      className="text-accent"
                      size={24}
                    />
                    <h2 className="mt-4 text-xl font-semibold">
                      {industry.name}
                    </h2>
                  </div>
                  <Link
                    className="secondary-button"
                    href={`/industries/${industry.slug}`}
                  >
                    View map
                  </Link>
                </div>
                <p className="mt-3 leading-7 text-ink/65">
                  {industry.description}
                </p>
                <div className="mt-5 grid gap-3">
                  {[
                    `${industry.opportunityCount} mapped opportunities`,
                    industry.startingPoint ?? "Starting point needs curation.",
                    "Tool recommendations come after workflow fit"
                  ].map((opportunity) => (
                    <div
                      className="flex items-start gap-2 rounded-lg border border-line bg-surface/70 px-3 py-2 text-sm"
                      key={opportunity}
                    >
                      <CheckCircle2
                        aria-hidden="true"
                        className="mt-0.5 shrink-0 text-accent"
                        size={15}
                      />
                      <span>{opportunity}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-5 rounded-xl border border-line bg-muted/35 p-4">
                  <p className="text-sm font-semibold">Best first move</p>
                  <p className="mt-2 text-sm leading-6 text-ink/62">
                    {industry.startingPoint ?? "Starting point needs curation."}
                  </p>
                </div>
                <div className="mt-3 flex items-start gap-2 text-sm leading-6 text-ink/58">
                  <AlertTriangle
                    aria-hidden="true"
                    className="mt-0.5 shrink-0 text-signal"
                    size={16}
                  />
                  <span>{industry.cautions ?? "Cautions need curation."}</span>
                </div>
              </article>
            );
          })}
        </section>

        <section className="surface-strong mt-8 rounded-2xl p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold">
                Ready to turn an industry map into a plan?
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/60">
                Start with the audit preview, then use playbooks and use cases
                to choose a practical first workflow.
              </p>
            </div>
            <Link className="primary-button" href="/audit">
              Start AI audit
              <ArrowRight aria-hidden="true" size={16} />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
