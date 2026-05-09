"use client";

import type { ReactNode } from "react";
import { AnimatePresence } from "motion/react";

export function MotionPresence({ children }: { children: ReactNode }) {
  return (
    <AnimatePresence initial={false} mode="popLayout">
      {children}
    </AnimatePresence>
  );
}
