"use client";

import type { ReactNode } from "react";
import type { HTMLMotionProps } from "motion/react";
import { motion, useReducedMotion } from "motion/react";

type MotionLabelProps = HTMLMotionProps<"label"> & {
  children: ReactNode;
};

export function MotionLabel({ children, ...props }: MotionLabelProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.label
      transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
      whileHover={shouldReduceMotion ? undefined : { y: -1 }}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.992 }}
      {...props}
    >
      {children}
    </motion.label>
  );
}
