"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";

// Fit meter that fills when it scrolls into view. The in-view margin only
// trims the bottom edge so bars at the left gutter on mobile still trigger.
export function FitMeter({ signal = false, value }: { signal?: boolean; value: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "100000px 0px -40px 0px" });
  const width = `${Math.max(0, Math.min(value, 100))}%`;

  return (
    <div aria-hidden="true" className={`meter flex-1 ${signal ? "meter-signal" : ""}`} ref={ref}>
      <motion.div
        animate={{ width: inView ? width : "0%" }}
        initial={{ width: "0%" }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}
