"use client";

import { createElement, type ReactNode } from "react";
import { motion } from "motion/react";

// Headline reveal: each word rises out of its own clipping mask. `lines` is a
// list of lines; each line is a list of segments. A segment can carry a class
// to colour part of the headline.

export type RevealSegment = string | { text: string; className?: string };

type SplitRevealProps = {
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  delay?: number;
  inView?: boolean;
  lines: RevealSegment[][];
  stagger?: number;
};

const ease = [0.22, 1, 0.36, 1] as const;

export function SplitReveal({
  as = "h1",
  className,
  delay = 0,
  inView = false,
  lines,
  stagger = 0.055
}: SplitRevealProps) {
  let wordIndex = 0;

  const label = lines
    .map((line) => line.map((s) => (typeof s === "string" ? s : s.text)).join(""))
    .join(" ");

  const children: ReactNode = lines.map((line, lineIndex) => (
    <span aria-hidden="true" className="block" key={lineIndex}>
      {line.map((segment, segmentIndex) => {
        const text = typeof segment === "string" ? segment : segment.text;
        const segClass = typeof segment === "string" ? undefined : segment.className;
        return text
          .split(/(\s+)/)
          .filter((part) => part.length > 0)
          .map((word, i) => {
            if (/^\s+$/.test(word)) {
              return <span key={`${segmentIndex}-${i}`}> </span>;
            }
            const index = wordIndex++;
            const animateProps = inView
              ? {
                  whileInView: { y: "0%", rotate: 0 },
                  viewport: { once: true, margin: "-60px 0px" }
                }
              : { animate: { y: "0%", rotate: 0 } };
            return (
              <span
                className="inline-block overflow-hidden pb-[0.1em] align-bottom"
                key={`${segmentIndex}-${i}`}
                style={{ marginBottom: "-0.1em" }}
              >
                <motion.span
                  className={["inline-block will-change-transform", segClass]
                    .filter(Boolean)
                    .join(" ")}
                  initial={{ y: "110%", rotate: 5 }}
                  {...animateProps}
                  transition={{ delay: delay + index * stagger, duration: 0.9, ease }}
                >
                  {word}
                </motion.span>
              </span>
            );
          });
      })}
    </span>
  ));

  return createElement(as, { "aria-label": label, className }, children);
}
