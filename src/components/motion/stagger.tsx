"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

type StaggerProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

type StaggerItemProps = {
  children: ReactNode;
  className?: string;
};

export function Stagger({ children, className, delay = 0 }: StaggerProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      animate="show"
      className={className}
      initial="hidden"
      variants={{
        hidden: {},
        show: {
          transition: {
            delayChildren: delay,
            staggerChildren: 0.07
          }
        }
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: StaggerItemProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 12 },
        show: {
          opacity: 1,
          transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] },
          y: 0
        }
      }}
    >
      {children}
    </motion.div>
  );
}
