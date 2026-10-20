import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Minus, Plus } from "lucide-react";
import { methodologySignals } from "@/lib/platform-content";
import { Magnetic } from "@/components/motion/magnetic";
import { Reveal } from "@/components/motion/reveal";
import { SplitReveal } from "@/components/motion/split-reveal";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { ScoreDial } from "@/components/ui/score-dial";
import { ContentHero } from "@/features/content/content-hero";
import { pad } from "@/features/content/slug";
import { WeightMeters } from "@/features/content/weight-meters";

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

const weights = [
  { label: "Business impact", note: "Time, money or quality it moves", value: 42 },
  { label: "Effort fit", note: "Team size and process clarity", value: 20 },
  { label: "Confidence", note: "How specific your answers were", value: 20 },
  { label: "Risk fit", note: "Data sensitivity and review style", value: 18 }
];

const modifiers = [
  { label: "Fast payback", sign: "plus" as const },
  { label: "Specific keywords", sign: "plus" as const },
  { label: "Other-industry only", sign: "minus" as const }
];

const flow = [
  { title: "Context", body: "Industry, size, pain, budget, risk" },
  { title: "Use case", body: "Rules map the problem to workflows" },
  { title: "Tool fit", body: "Tools ranked after the job is clear" },
  { title: "Next move", body: "What to try, measure and avoid" }
];

const rules = [
  { title: "Rules, not a chatbot", body: "Same answers, same ranking. Every pick lists its reasons." },
  { title: "Free with an account", body: "Score, ranking and pilot plan, saved to your dashboard." },
  { title: "Industry-aware", body: "Stores, venues and local services get their own questions first." },
  ...methodologySignals.slice(0, 2).map((signal) => ({
    title: signal.title,
    body: signal.description
  }))
];

export default function MethodologyPage() {
  return (
    <main>
      <ContentHero
        aside={
          <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.14em] text-ink/50">
            <span className="pulse-dot h-2 w-2 rounded-full bg-success" />
            audit-rules-v3.0
          </div>
        }
        eyebrow="Methodology"
        lead="Every audit runs on the same published rules. This is the whole recipe."
        lines={[["Same rules."], [{ text: "Every time.", className: "ghost-word" }]]}
      >
        <div className="flex flex-wrap gap-3">
          <Magnetic>
            <Link className="btn btn-primary btn-lg" href="/audit/questions">
              Start the audit
              <ArrowRight aria-hidden="true" size={18} />
            </Link>
          </Magnetic>
        </div>
      </ContentHero>

      {/* ---------- Weights ---------- */}
      <section className="app-container section-tight">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:gap-20">
          <div>
            <Reveal>
              <p className="eyebrow">The score</p>
            </Reveal>
            <SplitReveal
              as="h2"
              className="h2 mt-5"
              inView
              lines={[["What it"], [{ text: "weighs.", className: "ghost-word" }]]}
            />
            <Reveal delay={0.15}>
              <ul className="mt-10 flex flex-wrap gap-2">
                {modifiers.map((modifier) => (
                  <li
                    className={`tag ${modifier.sign === "plus" ? "tag-success" : "tag-danger"}`}
                    key={modifier.label}
                  >
                    {modifier.sign === "plus" ? (
                      <Plus aria-label="Bonus" size={12} />
                    ) : (
                      <Minus aria-label="Penalty" size={12} />
                    )}
                    {modifier.label}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
          <WeightMeters weights={weights} />
        </div>
      </section>

      {/* ---------- Flow ---------- */}
      <section className="app-container section-tight">
        <SplitReveal
          as="h2"
          className="h2"
          inView
          lines={[["Problem first."], [{ text: "Tools last.", className: "ghost-word" }]]}
        />
        <Stagger as="ol" className="mt-12 grid gap-px overflow-hidden rounded-[1.75rem] bg-ink/10 grid-cols-2 lg:grid-cols-4" inView>
          {flow.map((step, index) => (
            <StaggerItem
              as="li"
              className="group relative bg-paper p-5 transition-colors duration-500 hover:bg-surface md:p-8"
              key={step.title}
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm text-signal tabular">{pad(index)}</span>
                <span className="h-px flex-1 bg-ink/10" />
                {index < flow.length - 1 ? (
                  <ArrowRight
                    aria-hidden="true"
                    className="text-ink/25 transition-transform duration-500 group-hover:translate-x-1 group-hover:text-ink"
                    size={16}
                  />
                ) : (
                  <span className="h-2 w-2 rounded-full bg-signal" />
                )}
              </div>
              <p className="mt-8 font-display text-[1.45rem] font-bold leading-none tracking-[-0.04em] md:mt-16 md:text-[2.3rem]">
                {step.title}
              </p>
              <p className="mt-3 text-sm text-ink/55">{step.body}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* ---------- Rules ---------- */}
      <section className="app-container section-tight">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:gap-20">
          <div>
            <Reveal>
              <p className="eyebrow">Ground rules</p>
            </Reveal>
            <SplitReveal
              as="h2"
              className="h2 mt-5"
              inView
              lines={[["No black"], [{ text: "box.", className: "ghost-word" }]]}
            />
          </div>
          <Stagger as="ol" className="row-list" inView>
            {rules.map((rule, index) => (
              <StaggerItem
                as="li"
                className="row-item grid-cols-[2.5rem_minmax(0,1fr)] items-start gap-y-2 py-6 md:grid-cols-[3.5rem_minmax(0,0.9fr)_minmax(0,1.1fr)] md:gap-x-8 md:py-8"
                key={rule.title}
              >
                <span className="pt-1 font-mono text-sm text-ink/40 tabular">{pad(index)}</span>
                <span className="font-display text-[1.35rem] font-bold leading-[1.1] tracking-[-0.03em] md:text-[1.6rem]">
                  {rule.title}
                </span>
                <span className="col-start-2 text-ink/55 md:col-start-3 md:pt-1">{rule.body}</span>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ---------- Night: scores are directional ---------- */}
      <section className="app-container pb-24 pt-10 md:pb-32">
        <div
          className="night spotlight spotlight-strong rounded-[2rem] px-6 py-14 sm:px-10 md:rounded-[2.5rem] md:px-16 md:py-20"
          data-spotlight
        >
          <div
            aria-hidden="true"
            className="dot-grid absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_80%_30%,black,transparent_60%)]"
          />
          <div className="relative grid gap-14 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div>
              <p className="eyebrow">Read it right</p>
              <SplitReveal
                as="h2"
                className="mt-6 font-display text-[clamp(2.8rem,7vw,6rem)] font-bold leading-[0.92] tracking-[-0.05em] text-white"
                inView
                lines={[["93 is not"], [{ text: "better than 91.", className: "text-signal" }]]}
              />
              <p className="mt-7 max-w-md text-white/55">
                Scores are directional. Pilot the top two on your own examples.
              </p>
            </div>
            <Reveal className="flex items-end gap-6 sm:gap-10" delay={0.2}>
              <div className="text-center">
                <ScoreDial size={148} stroke={8} tone="light" value={93} />
                <p className="mt-4 font-mono text-xs uppercase tracking-[0.14em] text-white/45">Pick A</p>
              </div>
              <div className="text-center">
                <ScoreDial size={148} stroke={8} tone="light" value={91} />
                <p className="mt-4 font-mono text-xs uppercase tracking-[0.14em] text-white/45">Pick B</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </main>
  );
}
