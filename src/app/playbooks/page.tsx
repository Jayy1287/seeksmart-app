import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { playbooks } from "@/lib/platform-content";
import { AnimatedNumber } from "@/components/motion/animated-number";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { ContentHero } from "@/features/content/content-hero";
import { pad } from "@/features/content/slug";

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
  const totalSteps = playbooks.reduce((sum, playbook) => sum + playbook.steps.length, 0);

  return (
    <main>
      <ContentHero
        aside={
          <div className="flex gap-10 lg:gap-14">
            <div>
              <p className="stat-number text-[clamp(3.5rem,7vw,5.5rem)]">
                <AnimatedNumber value={playbooks.length} />
              </p>
              <p className="mt-2 font-mono text-xs uppercase tracking-[0.14em] text-ink/50">
                Playbooks
              </p>
            </div>
            <div>
              <p className="stat-number text-[clamp(3.5rem,7vw,5.5rem)] text-ink/25">
                <AnimatedNumber value={totalSteps} />
              </p>
              <p className="mt-2 font-mono text-xs uppercase tracking-[0.14em] text-ink/50">
                Steps
              </p>
            </div>
          </div>
        }
        eyebrow="Playbooks"
        lead="Short, ordered plans for your first AI rollout. Workflow first, tools last."
        lines={[["Start small."], [{ text: "Ship the first one.", className: "ghost-word" }]]}
      />

      <section className="app-container pb-24 md:pb-32">
        <Stagger as="ol" className="row-list" gap={0.05} inView>
          {playbooks.map((playbook, index) => (
            <StaggerItem as="li" key={playbook.slug}>
              <Link
                className="row-item group grid-cols-[2.25rem_minmax(0,1fr)_auto] gap-x-4 gap-y-2 py-7 md:grid-cols-[4.5rem_minmax(0,1.1fr)_minmax(0,0.9fr)_6rem_auto] md:gap-x-8 md:py-9"
                href={`/playbooks/${playbook.slug}`}
              >
                <span className="self-start pt-1.5 font-mono text-sm text-ink/40 tabular md:self-center md:pt-0">
                  {pad(index)}
                </span>
                <span className="min-w-0">
                  <span className="block font-display text-[1.6rem] font-bold leading-[1.02] tracking-[-0.04em] transition-transform duration-500 ease-out group-hover:translate-x-2 md:text-[2.35rem]">
                    {playbook.title}
                  </span>
                  <span className="mt-2 block font-mono text-[0.7rem] uppercase tracking-[0.14em] text-ink/40">
                    {playbook.audience}
                  </span>
                </span>
                <span className="col-start-2 row-start-2 text-[0.95rem] leading-relaxed text-ink/55 md:col-start-3 md:row-start-1">
                  {playbook.description}
                </span>
                <span className="hidden font-mono text-sm text-ink/45 tabular md:block">
                  {playbook.steps.length} steps
                </span>
                <span className="row-arrow col-start-3 row-start-1 md:col-start-5">
                  <ArrowRight aria-hidden="true" size={16} />
                </span>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </section>
    </main>
  );
}
