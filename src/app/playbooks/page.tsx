import type { Metadata } from "next";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { playbooks } from "@/lib/platform-content";
import { AnimatedNumber } from "@/components/motion/animated-number";
import { MotionLink } from "@/components/motion/motion-link";
import { Reveal } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "AI Playbooks",
  description:
    "Practical AI implementation playbooks for choosing workflows before tools.",
  alternates: {
    canonical: "/playbooks"
  },
  openGraph: {
    title: "AI Playbooks",
    description:
      "Practical AI implementation playbooks for choosing workflows before tools.",
    url: "/playbooks",
    type: "website"
  }
};

export default function PlaybooksPage() {
  return (
    <main className="page-shell">
      <div className="app-container">
        <Reveal className="surface-strong rounded-2xl p-6">
          <p className="eyebrow">Playbooks</p>
          <div className="mt-3 grid gap-5 md:grid-cols-[1fr_260px] md:items-end">
            <div>
              <h1 className="text-4xl font-semibold">
                Practical AI adoption guides
              </h1>
              <p className="mt-3 max-w-2xl leading-7 text-ink/65">
                Use playbooks to move from a business problem to a first
                workflow, measurement plan, and tool shortlist.
              </p>
            </div>
            <div className="metric-tile rounded-xl p-4">
              <div className="text-2xl font-semibold">
                <AnimatedNumber value={playbooks.length} />
              </div>
              <p className="mt-1 text-sm text-ink/55">Starter playbooks</p>
            </div>
          </div>
        </Reveal>

        <Reveal className="mt-6 grid gap-4 lg:grid-cols-3">
          {playbooks.map((playbook) => {
            const Icon = playbook.icon;

            return (
              <MotionLink
                className="surface-panel group flex h-full flex-col rounded-xl p-5 transition hover:-translate-y-1 hover:border-accent"
                href={`/playbooks/${playbook.slug}`}
                key={playbook.slug}
              >
                <div className="flex items-start justify-between gap-4">
                  <Icon aria-hidden="true" className="text-accent" size={24} />
                  <span className="status-pill">{playbook.audience}</span>
                </div>
                <h2 className="mt-5 text-xl font-semibold">
                  {playbook.title}
                </h2>
                <p className="mt-3 flex-1 leading-7 text-ink/65">
                  {playbook.description}
                </p>
                <div className="mt-5 grid gap-2">
                  {playbook.steps.slice(0, 2).map((step) => (
                    <div
                      className="flex items-start gap-2 text-sm leading-6 text-ink/60"
                      key={step}
                    >
                      <CheckCircle2
                        aria-hidden="true"
                        className="mt-0.5 shrink-0 text-accent"
                        size={15}
                      />
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
                <span className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-accent transition group-hover:translate-x-0.5">
                  Open playbook
                  <ArrowRight aria-hidden="true" size={14} />
                </span>
              </MotionLink>
            );
          })}
        </Reveal>
      </div>
    </main>
  );
}
