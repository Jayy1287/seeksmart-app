"use client";

import { motion, useReducedMotion } from "motion/react";

type AnimatedBarProps = {
  className?: string;
  value: number;
};

export function AnimatedBar({ className, value }: AnimatedBarProps) {
  const shouldReduceMotion = useReducedMotion();
  const width = `${Math.max(0, Math.min(value, 100))}%`;

  return (
    <motion.div
      aria-hidden="true"
      className={className}
      initial={shouldReduceMotion ? { width } : { width: "0%" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true, margin: "-80px" }}
      whileInView={{ width }}
    />
  );
}
