"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";

// Pulls its child a few pixels toward the pointer. Use on primary CTAs only.
export function Magnetic({
  children,
  className,
  strength = 0.22
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 240, damping: 15, mass: 0.4 });
  const y = useSpring(rawY, { stiffness: 240, damping: 15, mass: 0.4 });

  return (
    <motion.div
      className={["inline-flex", className].filter(Boolean).join(" ")}
      onPointerLeave={() => {
        rawX.set(0);
        rawY.set(0);
      }}
      onPointerMove={(event) => {
        if (reduce || event.pointerType !== "mouse" || !ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        rawX.set((event.clientX - rect.left - rect.width / 2) * strength);
        rawY.set((event.clientY - rect.top - rect.height / 2) * strength);
      }}
      ref={ref}
      style={{ x, y }}
    >
      {children}
    </motion.div>
  );
}
