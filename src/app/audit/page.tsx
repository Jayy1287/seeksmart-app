import type { Metadata } from "next";
import {
  ArrowRight,
  ClipboardCheck,
  Gauge,
  ListChecks,
  ShieldCheck,
  Store,
  Target
} from "lucide-react";
import { MotionLink } from "@/components/motion/motion-link";
import { Reveal } from "@/components/motion/reveal";
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

const outcomes = [
  {
    icon: Gauge,
    title: "Readiness score",
    description:
      "A 0 to 100 score that says whether to pilot now, prepare first, or do discovery."
  },
  {
    icon: Target,
    title: "Ranked opportunities",
    description:
      "The three places AI pays back first for your business, with the reasons."
  },
  {
    icon: ListChecks,
    title: "Two-week pilot plan",
    description:
      "Owner, baseline question, target, week-one actions, and guardrails."
  },
  {
    icon: ShieldCheck,
    title: "Tool shortlist",
    description:
      "Three tools per opportunity, filtered by your budget and data sensitivity."
  }
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
    <main className="page-shell">
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
      <div className="app-container">
        <Reveal className="border-b border-line/50 pb-10">
          <div className="grid gap-10 lg:grid-cols-[1fr_0.82fr] lg:items-center">
            <div>
              <p className="eyebrow">
                <ClipboardCheck aria-hidden="true" size={14} />
                Free AI audit
              </p>
              <h1 className="mt-5 max-w-3xl text-5xl font-semibold leading-[0.98] md:text-6xl">
                Find the first AI workflow your business should improve.
              </h1>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-ink/68">
                Eleven questions, three minutes, no account. You get a readiness
                score, the three opportunities that pay back first, and a plan
                for a two-week pilot.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <MotionLink className="primary-button min-h-12" href="/audit/questions">
                  Start the audit
                  <ArrowRight aria-hidden="true" size={18} />
                </MotionLink>
                <MotionLink className="secondary-button min-h-12" href="/methodology">
                  How scoring works
                </MotionLink>
              </div>
            </div>

            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-accent">
                Built for businesses like these
              </p>
              <div className="mt-4 grid gap-3">
                {featuredIndustries.map((industry) => (
                  <MotionLink
                    className="group flex items-center gap-4 rounded-2xl border border-line/60 bg-white/70 p-4 transition hover:border-accent"
                    href={`/audit/questions?industry=${industry.slug}`}
                    key={industry.slug}
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                      <Store aria-hidden="true" size={20} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold">{industry.label}</span>
                      <span className="mt-0.5 block text-sm leading-5 text-ink/58">
                        {industry.examplePrompt}
                      </span>
                    </span>
                    <ArrowRight
                      aria-hidden="true"
                      className="shrink-0 text-accent transition group-hover:translate-x-0.5"
                      size={16}
                    />
                  </MotionLink>
                ))}
              </div>
              <p className="mt-3 text-xs text-ink/50">
                Other industries work too; these three have the most specific
                guidance.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal className="mt-10 grid gap-x-8 gap-y-6 md:grid-cols-2 lg:grid-cols-4">
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
        </Reveal>

        <Reveal className="section-band -mx-4 mt-10 px-4 py-8 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <h2 className="text-2xl font-semibold">Questions people ask first</h2>
          <div className="mt-5 grid gap-x-8 gap-y-5 md:grid-cols-2">
            {faq.map((item) => (
              <div className="border-t border-line/70 pt-4" key={item.question}>
                <h3 className="font-semibold">{item.question}</h3>
                <p className="mt-2 text-sm leading-6 text-ink/62">{item.answer}</p>
              </div>
            ))}
          </div>
          <MotionLink className="primary-button mt-7" href="/audit/questions">
            Start the audit
            <ArrowRight aria-hidden="true" size={16} />
          </MotionLink>
        </Reveal>
      </div>
    </main>
  );
}
