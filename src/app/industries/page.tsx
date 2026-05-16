import type { Metadata } from "next";
import {
  ArrowRight,
  AlertTriangle,
  Building2,
  CheckCircle2,
  MapPinned
} from "lucide-react";
import { listIndustrySummaries } from "@/server/intelligence/queries";
import { AnimatedNumber } from "@/components/motion/animated-number";
import { MotionLink } from "@/components/motion/motion-link";
import { Reveal } from "@/components/motion/reveal";

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
        <Reveal className="surface-strong rounded-2xl p-6">
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
              <div className="text-2xl font-semibold">
                <AnimatedNumber value={industries.length} />
              </div>
              <p className="mt-1 text-sm text-ink/55">Starter industries</p>
            </div>
          </div>
        </Reveal>

        <Reveal className="mt-6 grid gap-5 md:grid-cols-2">
          {industries.map((industry) => {
            return (
              <article
                className="decision-card flex h-full flex-col p-5 pl-6"
                id={industry.slug}
                key={industry.slug}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="decision-card-icon">
                      <Building2 aria-hidden="true" size={18} />
                    </div>
                    <p className="decision-card-kicker mt-4">Industry map</p>
                    <h2 className="decision-card-title mt-2 text-2xl">
                      {industry.name}
                    </h2>
                  </div>
                  <div className="decision-card-stat shrink-0">
                    <strong>{industry.opportunityCount}</strong>
                    <span>Paths</span>
                  </div>
                </div>
                <p className="decision-card-copy mt-4 text-sm">
                  {industry.description}
                </p>
                <div className="mt-5 grid gap-3 border-y border-line/45 py-4">
                  {[
                    `${industry.opportunityCount} mapped opportunities`,
                    industry.startingPoint ?? "Starting point needs curation.",
                    "Tool recommendations come after workflow fit"
                  ].map((opportunity) => (
                    <div
                      className="flex items-start gap-2 text-sm leading-6 text-ink/66"
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
                <div className="mt-4 flex items-start gap-2 text-sm leading-6 text-ink/58">
                  <AlertTriangle
                    aria-hidden="true"
                    className="mt-0.5 shrink-0 text-signal"
                    size={16}
                  />
                  <span>{industry.cautions ?? "Cautions need curation."}</span>
                </div>
                <div className="decision-card-footer flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2 text-xs font-bold uppercase text-ink/46">
                    <MapPinned aria-hidden="true" size={14} />
                    Starter map
                  </span>
                  <MotionLink
                    className="inline-flex items-center gap-1 text-sm font-bold text-accent transition hover:translate-x-0.5"
                    href={`/industries/${industry.slug}`}
                  >
                    View map
                    <ArrowRight aria-hidden="true" size={14} />
                  </MotionLink>
                </div>
              </article>
            );
          })}
        </Reveal>

        <Reveal className="surface-strong mt-8 rounded-2xl p-6">
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
            <MotionLink className="primary-button" href="/audit">
              Start AI audit
              <ArrowRight aria-hidden="true" size={16} />
            </MotionLink>
          </div>
        </Reveal>
      </div>
    </main>
  );
}
