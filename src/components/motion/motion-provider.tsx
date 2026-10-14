"use client";

import type { ReactNode } from "react";
import { MotionConfig } from "motion/react";
import { SpotlightTracker } from "@/components/motion/spotlight-tracker";

export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <MotionConfig
      reducedMotion="user"
      transition={{
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1]
      }}
    >
      <SpotlightTracker />
      {children}
    </MotionConfig>
  );
}
