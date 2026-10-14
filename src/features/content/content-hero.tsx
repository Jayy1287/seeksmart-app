import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/reveal";
import { SplitReveal, type RevealSegment } from "@/components/motion/split-reveal";

type ContentHeroProps = {
  aside?: ReactNode;
  children?: ReactNode;
  eyebrow: string;
  lead?: ReactNode;
  lines: RevealSegment[][];
  size?: "display" | "h1";
  top?: ReactNode;
};

// Shared top-of-page block: eyebrow, split headline, one-line lead, actions and
// an optional aside (stats) on the right.
export function ContentHero({
  aside,
  children,
  eyebrow,
  lead,
  lines,
  size = "display",
  top
}: ContentHeroProps) {
  return (
    <section className="app-container page-hero">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div className="min-w-0">
          {top ? <Reveal y={12}>{top}</Reveal> : null}
          <Reveal y={12}>
            <p className={`eyebrow ${top ? "mt-8" : ""}`}>{eyebrow}</p>
          </Reveal>
          <SplitReveal className={`${size} mt-6 max-w-5xl`} delay={0.05} lines={lines} />
          {lead ? (
            <Reveal delay={0.35} y={16}>
              <p className="lead mt-6">{lead}</p>
            </Reveal>
          ) : null}
          {children ? (
            <Reveal delay={0.45} y={16}>
              <div className="mt-8">{children}</div>
            </Reveal>
          ) : null}
        </div>
        {aside ? (
          <Reveal delay={0.4} y={20}>
            {aside}
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
