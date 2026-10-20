import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { playbooks } from "@/lib/platform-content";
import { Magnetic } from "@/components/motion/magnetic";
import { Reveal } from "@/components/motion/reveal";
import { SplitReveal } from "@/components/motion/split-reveal";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { ReadingProgress } from "@/features/content/reading-progress";
import { pad } from "@/features/content/slug";
import { StepTimeline } from "@/features/content/step-timeline";
import { TableOfContents } from "@/features/content/table-of-contents";

type PlaybookPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const preflightChecks = [
  "Does the workflow repeat often enough?",
  "Can a person review the output quickly?",
  "Is the data safe for a third-party tool?",
  "Can you measure success within 30 days?"
];

const toc = [
  { id: "steps", label: "Steps" },
  { id: "outcome", label: "Outcome" },
  { id: "before-tools", label: "Before tools" },
  { id: "next", label: "Next playbook" }
];

export function generateStaticParams() {
  return playbooks.map((playbook) => ({
    slug: playbook.slug
  }));
}

export async function generateMetadata({
  params
}: PlaybookPageProps): Promise<Metadata> {
  const { slug } = await params;
  const playbook = playbooks.find((item) => item.slug === slug);

  if (!playbook) {
    return {
      title: "Playbook not found"
    };
  }

  return {
    title: playbook.title,
    description: playbook.description,
    alternates: {
      canonical: `/playbooks/${playbook.slug}`
    },
    openGraph: {
      title: playbook.title,
      description: playbook.description,
      url: `/playbooks/${playbook.slug}`,
      type: "website"
    }
  };
}

export default async function PlaybookPage({ params }: PlaybookPageProps) {
  const { slug } = await params;
  const index = playbooks.findIndex((item) => item.slug === slug);
  const playbook = playbooks[index];

  if (!playbook) {
    notFound();
  }

  const next = playbooks[(index + 1) % playbooks.length];

  return (
    <main>
      <ReadingProgress />

      <section className="app-container page-hero">
        <Reveal y={10}>
          <Link
            className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-ink/50 transition-colors hover:text-ink"
            href="/playbooks"
          >
            <ArrowLeft
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:-translate-x-1"
              size={14}
            />
            Playbooks
          </Link>
        </Reveal>
        <Reveal delay={0.05} y={10}>
          <p className="eyebrow mt-10">Playbook {pad(index)}</p>
        </Reveal>
        <SplitReveal
          className="h1 mt-6 max-w-5xl"
          delay={0.1}
          lines={[[playbook.title]]}
        />
        <Reveal delay={0.35} y={14}>
          <p className="lead mt-6">{playbook.description}</p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-ink/10 pt-5 font-mono text-xs uppercase tracking-[0.12em] text-ink/50">
            <span>{playbook.steps.length} steps</span>
            <span aria-hidden="true" className="h-1 w-1 rounded-full bg-ink/25" />
            <span>{playbook.audience}</span>
            <span aria-hidden="true" className="h-1 w-1 rounded-full bg-ink/25" />
            <span>30-day pilot</span>
          </div>
        </Reveal>
      </section>

      <div className="app-container grid gap-16 pb-24 md:pb-32 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-20">
        <aside className="hidden lg:block">
          <div className="sticky top-32">
            <TableOfContents items={toc} />
          </div>
        </aside>

        <div className="min-w-0 max-w-4xl">
          <section className="scroll-mt-32" id="steps">
            <StepTimeline steps={playbook.steps} />
          </section>

          <section className="mt-24 scroll-mt-32 md:mt-32" id="outcome">
            <div
              className="night spotlight rounded-[2rem] px-6 py-12 sm:px-10 md:rounded-[2.5rem] md:px-14 md:py-16"
              data-spotlight
            >
              <div
                aria-hidden="true"
                className="dot-grid absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_85%_15%,black,transparent_60%)]"
              />
              <div className="relative">
                <p className="eyebrow">Outcome</p>
                <SplitReveal
                  as="p"
                  className="mt-6 max-w-3xl font-display text-[clamp(1.9rem,4.2vw,3.4rem)] font-bold leading-[1.02] tracking-[-0.04em] text-white"
                  inView
                  lines={[[playbook.outcome]]}
                />
              </div>
            </div>
          </section>

          <section className="mt-24 scroll-mt-32 md:mt-32" id="before-tools">
            <SplitReveal
              as="h2"
              className="h2"
              inView
              lines={[["Before tools,"], [{ text: "check four things.", className: "ghost-word" }]]}
            />
            <Stagger as="ol" className="row-list mt-10" inView>
              {preflightChecks.map((check, checkIndex) => (
                <StaggerItem
                  as="li"
                  className="row-item grid-cols-[2.5rem_minmax(0,1fr)] py-5 md:grid-cols-[4rem_minmax(0,1fr)] md:py-6"
                  key={check}
                >
                  <span className="font-mono text-sm text-signal tabular">{pad(checkIndex)}</span>
                  <span className="text-lg font-medium tracking-[-0.01em] md:text-xl">{check}</span>
                </StaggerItem>
              ))}
            </Stagger>
            <Reveal className="mt-10 flex flex-wrap items-center gap-3">
              <Magnetic>
                <Link className="btn btn-primary btn-lg" href="/use-cases">
                  Match it to use cases
                  <ArrowRight aria-hidden="true" size={18} />
                </Link>
              </Magnetic>
              <Link className="btn btn-ghost btn-lg" href="/audit/questions">
                Run the audit
              </Link>
            </Reveal>
          </section>

          <section className="mt-24 scroll-mt-32 md:mt-32" id="next">
            <Reveal>
              <p className="eyebrow eyebrow-plain">Next playbook</p>
            </Reveal>
            <Reveal className="row-list mt-6">
              <Link
                className="row-item group grid-cols-[minmax(0,1fr)_auto] gap-6 py-8"
                href={`/playbooks/${next.slug}`}
              >
                <span className="min-w-0">
                  <span className="block font-display text-[1.8rem] font-bold leading-[1.02] tracking-[-0.04em] transition-transform duration-500 ease-out group-hover:translate-x-2 md:text-[2.8rem]">
                    {next.title}
                  </span>
                  <span className="mt-3 block text-ink/55">{next.description}</span>
                </span>
                <span className="row-arrow">
                  <ArrowRight aria-hidden="true" size={16} />
                </span>
              </Link>
            </Reveal>
          </section>
        </div>
      </div>
    </main>
  );
}
