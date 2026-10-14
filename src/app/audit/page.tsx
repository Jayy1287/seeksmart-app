import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { HeroAuditDemo } from "@/features/home/hero-audit-demo";
import { Magnetic } from "@/components/motion/magnetic";
import { Reveal } from "@/components/motion/reveal";
import { SplitReveal } from "@/components/motion/split-reveal";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { JsonLd, breadcrumbJsonLd } from "@/lib/structured-data";
import { featuredIndustries } from "@/shared/recommendations/wizard";

export const metadata: Metadata = {
  title: "Free AI Audit for Small Business",
  description:
    "Answer eleven questions and get a readiness score, ranked AI opportunities, and a two-week pilot plan for your business. Free, no account needed.",
  alternates: {
    canonical: "/audit"
  },
  openGraph: {
    title: "Free AI Audit for Small Business",
    description:
      "Answer eleven questions and get a readiness score, ranked AI opportunities, and a two-week pilot plan. Free, no account needed.",
    url: "/audit",
    type: "website"
  }
};

const steps = [
  { title: "Answer eleven questions", body: "One per screen. About three minutes." },
  { title: "Get a readiness score", body: "Plus the three workflows that pay back first." },
  { title: "Pilot it in two weeks", body: "Owner, baseline, target and tools to compare." }
];

const faq = [
  {
    question: "Do I need an account?",
    answer:
      "No. The score and ranked opportunities show immediately. Enter an email if you want the full pilot plan, tool shortlist, and a link that stays alive."
  },
  {
    question: "How are the recommendations made?",
    answer:
      "A transparent rules engine, not a chatbot. It weighs business fit, effort, risk, and how specific your answers were. Every recommendation lists its reasons."
  },
  {
    question: "How long does it take?",
    answer: "About three minutes. Eleven questions, one per screen, multiple choice."
  },
  {
    question: "Is my data used for anything else?",
    answer:
      "Answers are stored with the brief so you can reopen it. Anonymous briefs expire after 30 days. Do not enter customer data or secrets; the questions do not ask for any."
  }
];

export default function AuditPage() {
  return (
    <main>
      <JsonLd
        data={[
          breadcrumbJsonLd([{ name: "AI audit", path: "/audit" }]),
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faq.map((item) => ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: { "@type": "Answer", text: item.answer }
            }))
          }
        ]}
      />

      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="grid-lines absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_top_left,black_15%,transparent_65%)]" />
          <div className="glow-orb -right-48 top-24 h-[30rem] w-[30rem] opacity-25" />
        </div>
        <div className="app-container page-hero relative grid items-center gap-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-12 lg:pb-24">
          <div>
            <Reveal>
              <p className="eyebrow">Free AI audit</p>
            </Reveal>
            <SplitReveal
              className="display mt-7"
              delay={0.1}
              lines={[["Find where AI"], ["pays back", { text: " first.", className: "ghost-word" }]]}
            />
            <Stagger delay={0.5}>
              <StaggerItem>
                <p className="lead mt-7">
                  Eleven questions. A score, three ranked workflows and a two-week pilot plan.
                </p>
              </StaggerItem>
              <StaggerItem>
                <div className="mt-9 flex flex-wrap items-center gap-3">
                  <Magnetic>
                    <Link className="btn btn-primary btn-lg" href="/audit/questions">
                      Start the audit
                      <ArrowRight aria-hidden="true" size={18} />
                    </Link>
                  </Magnetic>
                  <Link className="btn btn-ghost btn-lg" href="/methodology">
                    How it scores
                  </Link>
                </div>
                <p className="mt-5 flex items-center gap-2 text-sm text-ink/50">
                  <span className="h-1.5 w-1.5 rounded-full bg-success" />
                  No account. Results on screen.
                </p>
              </StaggerItem>
            </Stagger>
          </div>
          <Reveal delay={0.3} y={40}>
            <HeroAuditDemo />
          </Reveal>
        </div>
      </section>

      {/* ---------- Three steps ---------- */}
      <section aria-label="How the audit works" className="app-container pb-20 md:pb-28">
        <Stagger
          as="ol"
          className="grid gap-px overflow-hidden rounded-[1.75rem] bg-ink/10 md:grid-cols-3"
          inView
        >
          {steps.map((step, index) => (
            <StaggerItem
              as="li"
              className="group relative bg-paper p-6 transition-colors duration-500 hover:bg-surface md:p-8"
              key={step.title}
            >
              <span className="stat-number block text-[3.5rem] text-ink/10 transition-colors duration-500 group-hover:text-signal md:text-[4.5rem]">
                0{index + 1}
              </span>
              <p className="mt-6 font-display text-xl font-semibold tracking-[-0.02em] md:text-2xl">
                {step.title}
              </p>
              <p className="mt-2 text-ink/55">{step.body}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* ---------- Start with your business ---------- */}
      <section className="app-container pb-20 md:pb-28">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <SplitReveal
            as="h2"
            className="h2 max-w-2xl"
            inView
            lines={[["Start with"], [{ text: "your business.", className: "ghost-word" }]]}
          />
          <Reveal>
            <p className="text-ink/55">Any industry works. These get the most specific guidance.</p>
          </Reveal>
        </div>
        <Stagger as="div" className="row-list mt-10" inView>
          {featuredIndustries.map((industry, index) => (
            <StaggerItem key={industry.slug}>
              <Link
                className="row-item group grid-cols-[auto_minmax(0,1fr)_auto] gap-5 py-6 md:grid-cols-[4rem_minmax(0,1fr)_minmax(0,1fr)_auto] md:gap-8 md:py-8"
                href={`/audit/questions?industry=${industry.slug}`}
              >
                <span className="font-mono text-sm text-ink/40">0{index + 1}</span>
                <span className="font-display text-[1.5rem] font-bold leading-none tracking-[-0.04em] transition-transform duration-500 ease-out group-hover:translate-x-2 md:text-[2.25rem]">
                  {industry.label}
                </span>
                <span className="col-span-3 col-start-2 row-start-2 text-ink/55 md:col-span-1 md:col-start-3 md:row-start-1">
                  {industry.hint}
                </span>
                <span className="row-arrow col-start-3 row-start-1 md:col-start-4">
                  <ArrowRight aria-hidden="true" size={16} />
                </span>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className="app-container pb-24 md:pb-36">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <SplitReveal
            as="h2"
            className="h2"
            inView
            lines={[["Before"], [{ text: "you start.", className: "ghost-word" }]]}
          />
          <Reveal className="row-list">
            {faq.map((item) => (
              <details className="group border-b border-ink/[0.12] [&_summary::-webkit-details-marker]:hidden" key={item.question}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-lg font-medium md:py-6 md:text-xl">
                  {item.question}
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ink/[0.12] transition-all duration-300 group-open:rotate-45 group-open:border-ink group-open:bg-ink group-open:text-paper">
                    <Plus aria-hidden="true" size={16} />
                  </span>
                </summary>
                <p className="max-w-2xl pb-6 text-ink/60">{item.answer}</p>
              </details>
            ))}
          </Reveal>
        </div>
      </section>
    </main>
  );
}
