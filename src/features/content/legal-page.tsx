import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import { SplitReveal, type RevealSegment } from "@/components/motion/split-reveal";
import { headingId, pad } from "@/features/content/slug";
import { TableOfContents } from "@/features/content/table-of-contents";

export type LegalSection = {
  body: string[];
  title: string;
};

type LegalPageProps = {
  eyebrow: string;
  lead: string;
  lines: RevealSegment[][];
  sections: LegalSection[];
  sibling: { href: "/privacy" | "/terms"; label: string };
  updated: string;
};

// Long-form legal reading layout: big title, mono meta, sticky contents on
// desktop and numbered prose sections.
export function LegalPage({ eyebrow, lead, lines, sections, sibling, updated }: LegalPageProps) {
  const toc = sections.map((section) => ({
    id: headingId(section.title),
    label: section.title
  }));

  return (
    <main>
      <section className="app-container page-hero">
        <Reveal y={10}>
          <p className="eyebrow">{eyebrow}</p>
        </Reveal>
        <SplitReveal className="h1 mt-6 max-w-4xl" delay={0.05} lines={lines} />
        <Reveal delay={0.35} y={14}>
          <p className="lead mt-6">{lead}</p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-ink/10 pt-5 font-mono text-xs uppercase tracking-[0.12em] text-ink/50">
            <span>Updated {updated}</span>
            <span aria-hidden="true" className="h-1 w-1 rounded-full bg-ink/25" />
            <span>{sections.length} sections</span>
            <span aria-hidden="true" className="hidden h-1 w-1 rounded-full bg-ink/25 sm:block" />
            <a className="normal-case tracking-normal text-ink/70 underline decoration-signal underline-offset-4 hover:text-ink" href="mailto:seeksmartapp@gmail.com">
              seeksmartapp@gmail.com
            </a>
          </div>
        </Reveal>
      </section>

      <div className="app-container grid gap-12 pb-24 md:pb-32 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-20">
        <aside className="hidden lg:block">
          <div className="sticky top-32 max-h-[calc(100vh-10rem)] overflow-y-auto pb-6">
            <TableOfContents items={toc} title="Contents" />
            <Link
              className="link-underline mt-8 text-sm text-ink/60 hover:text-ink"
              href={sibling.href}
            >
              {sibling.label}
            </Link>
          </div>
        </aside>

        <article className="prose-ss min-w-0">
          {sections.map((section, index) => (
            <section className="scroll-mt-32 [&:first-child>h2]:mt-0" id={headingId(section.title)} key={section.title}>
              <h2>
                <span className="mb-3 block font-mono text-xs font-normal tracking-[0.14em] text-signal">
                  {pad(index)}
                </span>
                {section.title}
              </h2>
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>
          ))}
          <p className="!mt-16 border-t border-ink/10 pt-6 text-sm text-ink/50 lg:hidden">
            See also{" "}
            <Link href={sibling.href}>{sibling.label}</Link>
          </p>
        </article>
      </div>
    </main>
  );
}
