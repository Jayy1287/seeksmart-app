import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/reveal";
import { SplitReveal, type RevealSegment } from "@/components/motion/split-reveal";
import { Stagger, StaggerItem } from "@/components/motion/stagger";

type FormSplitProps = {
  children: ReactNode;
  eyebrow: string;
  footer?: ReactNode;
  lead: string;
  lines: RevealSegment[][];
  points: string[];
};

// Focused form page: short statement on the left, the form panel on the right.
export function FormSplit({ children, eyebrow, footer, lead, lines, points }: FormSplitProps) {
  return (
    <main className="relative overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="grid-lines absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_0%_0%,black_10%,transparent_55%)]" />
      </div>
      <div className="app-container page-hero relative grid gap-12 pb-24 md:pb-32 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <Reveal y={10}>
            <p className="eyebrow">{eyebrow}</p>
          </Reveal>
          <SplitReveal className="h1 mt-6" delay={0.05} lines={lines} />
          <Reveal delay={0.35} y={14}>
            <p className="lead mt-6">{lead}</p>
          </Reveal>
          <Stagger as="ol" className="row-list mt-10 max-w-md" delay={0.45}>
            {points.map((point, index) => (
              <StaggerItem
                as="li"
                className="row-item grid-cols-[2.5rem_minmax(0,1fr)] py-4"
                key={point}
              >
                <span className="font-mono text-xs text-signal tabular">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="font-medium">{point}</span>
              </StaggerItem>
            ))}
          </Stagger>
          {footer ? (
            <Reveal className="mt-8" delay={0.6}>
              {footer}
            </Reveal>
          ) : null}
        </div>
        <Reveal delay={0.2} y={32}>
          {children}
        </Reveal>
      </div>
    </main>
  );
}
