"use client";

import type { ReactNode } from "react";
import type { HTMLMotionProps } from "motion/react";
import { motion, useReducedMotion } from "motion/react";

type MotionButtonProps = HTMLMotionProps<"button"> & {
  children: ReactNode;
};

export function MotionButton({ children, ...props }: MotionButtonProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.button
      transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
      whileHover={shouldReduceMotion ? undefined : { y: -1 }}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.985 }}
      {...props}
    >
      {children}
    </motion.button>
  );
}
