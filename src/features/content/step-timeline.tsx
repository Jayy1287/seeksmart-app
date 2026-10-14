"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "motion/react";

// Numbered vertical timeline. The rail fills with signal as the reader scrolls
// through the steps.
export function StepTimeline({ steps }: { steps: string[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 75%", "end 55%"]
  });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.3 });

  return (
    <ol className="relative grid gap-12 md:gap-16" ref={ref}>
      <span
        aria-hidden="true"
        className="absolute bottom-6 left-[1.4rem] top-6 w-px bg-ink/10 md:left-[1.9rem]"
      />
      <motion.span
        aria-hidden="true"
        className="absolute bottom-6 left-[1.4rem] top-6 w-px origin-top bg-signal md:left-[1.9rem]"
        style={{ scaleY }}
      />
      {steps.map((step, index) => (
        <motion.li
          className="relative grid grid-cols-[2.8rem_minmax(0,1fr)] gap-5 md:grid-cols-[3.8rem_minmax(0,1fr)] md:gap-8"
          initial={{ opacity: 0, y: 24 }}
          key={step}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true, margin: "100000px 0px -48px 0px" }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <span className="relative z-[1] flex h-11 w-11 items-center justify-center rounded-full border border-ink/15 bg-paper font-mono text-sm tabular md:h-[3.8rem] md:w-[3.8rem] md:text-base">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div className="pt-1.5 md:pt-3">
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-ink/40">
              Step {index + 1}
            </p>
            <p className="mt-3 font-display text-[1.5rem] font-semibold leading-[1.12] tracking-[-0.03em] text-ink md:text-[2.1rem]">
              {step}
            </p>
          </div>
        </motion.li>
      ))}
    </ol>
  );
}
