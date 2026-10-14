import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { SplitReveal } from "@/components/motion/split-reveal";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { LevelTag } from "@/features/use-cases/level-tag";
import type { IndustryGuide } from "@/lib/industry-guides";

// Editorial sections for the hand-written industry guides. The page composes
// these with the database-driven sections and a sticky section nav.

export const guideNavItems = [
  { id: "short-answer", label: "Short answer" },
  { id: "workflows", label: "First five workflows" },
  { id: "rules", label: "Skip and data rules" }
];

export function GuideAnswer({ guide }: { guide: IndustryGuide }) {
  return (
    <section className="scroll-mt-28" id="short-answer">
      <Reveal>
        <div className="night spotlight spotlight-strong rounded-[2rem] px-6 py-10 sm:px-10 md:py-14" data-spotlight>
          <div aria-hidden="true" className="dot-grid absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_100%_0%,black,transparent_60%)]" />
          <div className="relative">
            <p className="eyebrow">Short answer</p>
            <p className="mt-6 font-display text-[1.45rem] font-medium leading-[1.3] tracking-[-0.02em] text-white md:text-[1.85rem]">
              {guide.answerFirst}
            </p>
            <div className="mt-8 grid gap-4 border-t border-white/10 pt-6 text-sm text-white/55 md:grid-cols-[auto_minmax(0,1fr)] md:gap-8">
              <p className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-white/40">For</p>
              <p>{guide.whoThisIsFor}</p>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export function GuideWorkflows({ guide }: { guide: IndustryGuide }) {
  return (
    <section className="scroll-mt-28" id="workflows">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <SplitReveal
          as="h2"
          className="h2"
          inView
          lines={[["The first five."], [{ text: "In this order.", className: "ghost-word" }]]}
        />
        <Reveal>
          <Link className="btn btn-primary btn-sm" href={`/audit/questions?industry=${guide.slug}`}>
            Rank for my business
            <ArrowRight aria-hidden="true" size={15} />
          </Link>
        </Reveal>
      </div>

      <Stagger as="ol" className="row-list mt-10" inView>
        {guide.workflows.map((workflow, index) => (
          <StaggerItem as="li" className="row-item grid-cols-[2.75rem_minmax(0,1fr)] items-start gap-x-4 py-7 md:grid-cols-[4rem_minmax(0,1fr)] md:py-9" key={workflow.name}>
            <span
              className={`font-display text-[1.9rem] font-bold leading-none tracking-[-0.05em] md:text-[2.6rem] ${
                index === 0 ? "text-signal" : "text-ink/20"
              }`}
            >
              {index + 1}
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <Link
                  className="group inline-flex items-baseline gap-2 font-display text-[1.35rem] font-semibold leading-tight tracking-[-0.025em] md:text-[1.6rem]"
                  href={`/use-cases/${workflow.useCaseSlug}`}
                >
                  <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1.5px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 group-hover:bg-[length:100%_1.5px]">
                    {workflow.name}
                  </span>
                  <ArrowRight
                    aria-hidden="true"
                    className="shrink-0 translate-y-0.5 text-ink/30 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-ink"
                    size={18}
                  />
                </Link>
                <span className="flex gap-1.5">
                  <LevelTag label="effort" level={workflow.effort} />
                  <LevelTag label="risk" level={workflow.risk} />
                </span>
              </div>
              <p className="mt-3 max-w-[62ch] text-ink/65">{workflow.whatChanges}</p>
              <p className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm">
                <span className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-ink/40">Measure</span>
                <span className="text-ink/80">{workflow.measure}</span>
              </p>
              <details className="group/week mt-4 max-w-[62ch]">
                <summary className="inline-flex cursor-pointer list-none items-center gap-2 text-sm font-medium text-ink/70 transition-colors hover:text-ink [&::-webkit-details-marker]:hidden">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-ink/15 transition-transform duration-300 group-open/week:rotate-45">
                    <Plus aria-hidden="true" size={13} />
                  </span>
                  Week one
                </summary>
                <p className="mt-3 border-l-2 border-signal pl-4 text-[0.95rem] text-ink/65">{workflow.firstWeek}</p>
              </details>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}

export function GuideRules({ guide }: { guide: IndustryGuide }) {
  return (
    <section className="scroll-mt-28" id="rules">
      <div className="grid gap-12 md:grid-cols-2 md:gap-10">
        <div>
          <SplitReveal as="h2" className="h3 md:text-[1.9rem]" inView lines={[["Skip for now"]]} />
          <Stagger as="ul" className="row-list mt-6" inView>
            {guide.skipFor.map((item) => (
              <StaggerItem as="li" className="row-item grid-cols-[1rem_minmax(0,1fr)] items-baseline gap-3 py-4" key={item}>
                <span aria-hidden="true" className="h-[2px] w-3 translate-y-[-3px] bg-ink/40" />
                <span className="text-[0.95rem] text-ink/70">{item}</span>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
        <div>
          <SplitReveal as="h2" className="h3 md:text-[1.9rem]" inView lines={[["Data rules"]]} />
          <Stagger as="ol" className="row-list mt-6" inView>
            {guide.dataRules.map((item, index) => (
              <StaggerItem as="li" className="row-item grid-cols-[1.75rem_minmax(0,1fr)] items-baseline gap-3 py-4" key={item}>
                <span className="font-mono text-xs text-signal">{String(index + 1).padStart(2, "0")}</span>
                <span className="text-[0.95rem] text-ink/70">{item}</span>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}

export function GuideFaq({ guide }: { guide: IndustryGuide }) {
  return (
    <section className="scroll-mt-28" id="faq">
      <SplitReveal
        as="h2"
        className="h2"
        inView
        lines={[["Questions"], [{ text: "owners ask.", className: "ghost-word" }]]}
      />
      <div className="row-list mt-10">
        {guide.faq.map((item) => (
          <details className="group border-b border-ink/[0.12]" key={item.question}>
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 [&::-webkit-details-marker]:hidden">
              <span className="font-display text-[1.15rem] font-semibold tracking-[-0.02em] md:text-[1.35rem]">
                {item.question}
              </span>
              <span className="row-arrow shrink-0 transition-transform duration-300 group-open:rotate-45 group-open:border-ink group-open:bg-ink group-open:text-paper">
                <Plus aria-hidden="true" size={16} />
              </span>
            </summary>
            <p className="max-w-[62ch] pb-7 text-ink/65">{item.answer}</p>
          </details>
        ))}
      </div>
      <Reveal>
        <p className="mt-6 font-mono text-xs text-ink/40">Updated {formatDate(guide.updatedAt)}</p>
      </Reveal>
    </section>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", { dateStyle: "long" }).format(new Date(value));
}
