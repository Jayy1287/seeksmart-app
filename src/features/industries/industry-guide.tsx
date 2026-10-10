import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldAlert, XCircle } from "lucide-react";
import { MotionLink } from "@/components/motion/motion-link";
import { Reveal } from "@/components/motion/reveal";
import type { IndustryGuide } from "@/lib/industry-guides";

export function IndustryGuideSections({ guide }: { guide: IndustryGuide }) {
  return (
    <>
      <Reveal className="mt-6 rounded-2xl border border-accent/25 bg-white/75 p-6 shadow-[0_18px_54px_rgb(22_28_36/0.08)]">
        <p className="text-xs font-extrabold uppercase tracking-wide text-accent">
          Short answer
        </p>
        <p className="mt-3 max-w-3xl text-lg leading-8 text-ink/80">
          {guide.answerFirst}
        </p>
        <p className="mt-4 max-w-3xl text-sm leading-6 text-ink/60">
          <span className="font-semibold text-ink">Who this is for:</span>{" "}
          {guide.whoThisIsFor}
        </p>
        <p className="mt-3 text-xs text-ink/45">Updated {formatDate(guide.updatedAt)}</p>
      </Reveal>

      <Reveal className="mt-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-accent">
              The first five workflows
            </p>
            <h2 className="mt-1 text-2xl font-semibold md:text-3xl">
              In the order most businesses should try them
            </h2>
          </div>
          <MotionLink
            className="primary-button min-h-11"
            href={`/audit/questions?industry=${guide.slug}`}
          >
            Rank these for my business
            <ArrowRight aria-hidden="true" size={16} />
          </MotionLink>
        </div>
        <div className="comparison-table-shell mt-5 hidden md:block">
          <table className="decision-table">
            <thead>
              <tr>
                <th scope="col">Workflow</th>
                <th scope="col">What changes</th>
                <th scope="col">Measure</th>
                <th scope="col">Effort</th>
                <th scope="col">Risk</th>
              </tr>
            </thead>
            <tbody>
              {guide.workflows.map((workflow, index) => (
                <tr key={workflow.name}>
                  <td>
                    <span className="text-xs font-bold text-ink/45">{index + 1}.</span>{" "}
                    <Link
                      className="font-semibold text-ink hover:text-accent"
                      href={`/use-cases/${workflow.useCaseSlug}`}
                    >
                      {workflow.name}
                    </Link>
                  </td>
                  <td className="text-sm leading-6 text-ink/65">{workflow.whatChanges}</td>
                  <td className="text-sm leading-6 text-ink/65">{workflow.measure}</td>
                  <td>
                    <LevelBadge level={workflow.effort} />
                  </td>
                  <td>
                    <LevelBadge level={workflow.risk} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-5 grid gap-3 md:hidden">
          {guide.workflows.map((workflow, index) => (
            <article className="comparison-mobile-card" key={workflow.name}>
              <p className="text-xs font-bold text-ink/45">Workflow {index + 1}</p>
              <Link
                className="mt-1 block font-semibold text-ink"
                href={`/use-cases/${workflow.useCaseSlug}`}
              >
                {workflow.name}
              </Link>
              <p className="mt-2 text-sm leading-6 text-ink/65">{workflow.whatChanges}</p>
              <p className="mt-2 text-sm leading-6 text-ink/65">
                <span className="font-semibold text-ink">Measure:</span> {workflow.measure}
              </p>
              <div className="mt-3 flex gap-2">
                <LevelBadge label="effort" level={workflow.effort} />
                <LevelBadge label="risk" level={workflow.risk} />
              </div>
            </article>
          ))}
        </div>
        <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {guide.workflows.map((workflow, index) => (
            <div
              className="rounded-xl border border-line/60 bg-white/60 p-4"
              key={`${workflow.name}-week`}
            >
              <p className="text-xs font-bold uppercase tracking-wide text-accent">
                Week one · {index + 1}. {workflow.name}
              </p>
              <p className="mt-2 text-sm leading-6 text-ink/68">{workflow.firstWeek}</p>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal className="mt-8 grid gap-4 md:grid-cols-2">
        <section className="surface-panel rounded-xl p-5">
          <div className="flex items-center gap-2">
            <XCircle aria-hidden="true" className="text-secondary" size={20} />
            <h2 className="text-xl font-semibold">Skip for now</h2>
          </div>
          <ul className="mt-4 grid gap-3">
            {guide.skipFor.map((item) => (
              <li className="flex gap-3 text-sm leading-6 text-ink/70" key={item}>
                <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" />
                {item}
              </li>
            ))}
          </ul>
        </section>
        <section className="surface-panel rounded-xl p-5">
          <div className="flex items-center gap-2">
            <ShieldAlert aria-hidden="true" className="text-accent" size={20} />
            <h2 className="text-xl font-semibold">Data rules for the pilot</h2>
          </div>
          <ul className="mt-4 grid gap-3">
            {guide.dataRules.map((item) => (
              <li className="flex gap-3 text-sm leading-6 text-ink/70" key={item}>
                <CheckCircle2 aria-hidden="true" className="mt-1 shrink-0 text-accent" size={15} />
                {item}
              </li>
            ))}
          </ul>
        </section>
      </Reveal>

      <Reveal className="section-band -mx-4 mt-8 px-4 py-8 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <h2 className="text-2xl font-semibold">Questions owners ask</h2>
        <div className="mt-5 grid gap-x-8 gap-y-5 md:grid-cols-3">
          {guide.faq.map((item) => (
            <div className="border-t border-line/70 pt-4" key={item.question}>
              <h3 className="font-semibold">{item.question}</h3>
              <p className="mt-2 text-sm leading-6 text-ink/62">{item.answer}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </>
  );
}

function LevelBadge({ label, level }: { label?: string; level: string }) {
  const tone =
    level === "Low" ? "text-success" : level === "High" ? "text-secondary" : "text-ink/70";

  return (
    <span className={`status-pill ${tone}`}>
      {level}
      {label ? ` ${label}` : ""}
    </span>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", { dateStyle: "long" }).format(new Date(value));
}
