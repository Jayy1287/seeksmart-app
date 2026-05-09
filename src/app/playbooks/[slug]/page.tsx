import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, Target } from "lucide-react";
import { playbooks } from "@/lib/platform-content";
import { MotionLink } from "@/components/motion/motion-link";
import { Reveal } from "@/components/motion/reveal";

type PlaybookPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

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
  const playbook = playbooks.find((item) => item.slug === slug);

  if (!playbook) {
    notFound();
  }

  const Icon = playbook.icon;

  return (
    <main className="page-shell">
      <div className="app-container">
        <Reveal className="surface-strong rounded-2xl p-6">
          <Link className="text-sm font-medium text-accent" href="/playbooks">
            Playbooks
          </Link>
          <div className="mt-4 grid gap-6 md:grid-cols-[1fr_280px] md:items-end">
            <div>
              <Icon aria-hidden="true" className="text-accent" size={28} />
              <h1 className="mt-4 text-4xl font-semibold">
                {playbook.title}
              </h1>
              <p className="mt-3 max-w-2xl leading-7 text-ink/65">
                {playbook.description}
              </p>
            </div>
            <div className="metric-tile rounded-xl p-4">
              <p className="text-sm font-semibold text-accent">Audience</p>
              <p className="mt-2 text-lg font-semibold">{playbook.audience}</p>
            </div>
          </div>
        </Reveal>

        <Reveal className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="surface-panel rounded-xl p-5">
            <h2 className="text-xl font-semibold">Execution steps</h2>
            <div className="mt-5 grid gap-3">
              {playbook.steps.map((step, index) => (
                <div
                  className="rounded-xl border border-line bg-surface/72 p-4"
                  key={step}
                >
                  <div className="flex items-start gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent text-sm font-semibold text-paper">
                      {index + 1}
                    </span>
                    <p className="leading-7 text-ink/72">{step}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside className="grid gap-4">
            <div className="surface-panel rounded-xl p-5">
              <div className="flex items-start gap-3">
                <Target
                  aria-hidden="true"
                  className="mt-0.5 shrink-0 text-accent"
                  size={20}
                />
                <div>
                  <h2 className="font-semibold">Expected outcome</h2>
                  <p className="mt-2 text-sm leading-6 text-ink/62">
                    {playbook.outcome}
                  </p>
                </div>
              </div>
            </div>
            <div className="surface-strong rounded-xl p-5">
              <h2 className="font-semibold">What to check before tools</h2>
              <div className="mt-4 grid gap-2">
                {[
                  "Is the workflow repeated often enough?",
                  "Can a person review the output quickly?",
                  "Is the data safe to use with third-party tools?",
                  "Can success be measured within 30 days?"
                ].map((item) => (
                  <div
                    className="flex items-start gap-2 text-sm leading-6 text-ink/62"
                    key={item}
                  >
                    <CheckCircle2
                      aria-hidden="true"
                      className="mt-0.5 shrink-0 text-accent"
                      size={15}
                    />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </Reveal>

        <Reveal className="surface-strong mt-8 rounded-2xl p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold">
                Ready to match this to tools?
              </h2>
              <p className="mt-2 text-sm leading-6 text-ink/60">
                Browse use cases first, then compare tools by fit and effort.
              </p>
            </div>
            <MotionLink className="primary-button" href="/use-cases">
              Browse use cases
              <ArrowRight aria-hidden="true" size={16} />
            </MotionLink>
          </div>
        </Reveal>
      </div>
    </main>
  );
}
