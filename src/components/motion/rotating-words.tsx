"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

// Cycles through words in place with a blur-and-rise swap.

type RotatingWordsProps = {
  className?: string;
  interval?: number;
  words: string[];
};

export function RotatingWords({ className, interval = 2400, words }: RotatingWordsProps) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const timer = window.setInterval(
      () => setIndex((current) => (current + 1) % words.length),
      interval
    );
    return () => window.clearInterval(timer);
  }, [interval, reduce, words.length]);

  return (
    <span className={["relative inline-grid", className].filter(Boolean).join(" ")}>
      <span className="sr-only">{words.join(", ")}</span>
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          animate={{ opacity: 1, y: "0%", filter: "blur(0px)" }}
          aria-hidden="true"
          className="col-start-1 row-start-1 whitespace-nowrap"
          exit={{ opacity: 0, y: "-55%", filter: "blur(10px)" }}
          initial={{ opacity: 0, y: "55%", filter: "blur(10px)" }}
          key={words[index]}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
