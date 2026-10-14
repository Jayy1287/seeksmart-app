"use client";

import { motion } from "motion/react";

const ease = [0.22, 1, 0.36, 1] as const;

// Huge "404" where the zero is a slowly orbiting dial that never lands.
export function NotFoundGlyph() {
  return (
    <div
      aria-label="404"
      className="flex select-none items-center justify-center font-display font-bold leading-none tracking-[-0.06em] text-ink"
      role="img"
    >
      <motion.span
        animate={{ y: "0%", opacity: 1 }}
        aria-hidden="true"
        className="text-[clamp(8rem,30vw,22rem)]"
        initial={{ y: "30%", opacity: 0 }}
        transition={{ duration: 1, ease }}
      >
        4
      </motion.span>
      <motion.span
        animate={{ scale: 1, opacity: 1 }}
        aria-hidden="true"
        className="relative mx-[0.02em] inline-flex h-[clamp(6rem,23vw,17rem)] w-[clamp(6rem,23vw,17rem)] items-center justify-center"
        initial={{ scale: 0.6, opacity: 0 }}
        transition={{ delay: 0.15, duration: 1.1, ease }}
      >
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100">
          <circle cx="50" cy="50" fill="none" r="44" stroke="rgb(var(--color-ink))" strokeWidth="9" />
        </svg>
        <motion.svg
          animate={{ rotate: 360 }}
          className="absolute inset-0 h-full w-full"
          transition={{ duration: 14, ease: "linear", repeat: Infinity }}
          viewBox="0 0 100 100"
        >
          <circle
            cx="50"
            cy="50"
            fill="none"
            r="31"
            stroke="rgb(var(--color-ink) / 0.18)"
            strokeDasharray="2 5"
            strokeWidth="1.2"
          />
          <circle cx="50" cy="19" fill="rgb(var(--color-signal))" r="4.5" />
        </motion.svg>
        <motion.span
          animate={{ scale: [1, 1.35, 1], opacity: [0.9, 0.4, 0.9] }}
          className="h-[9%] w-[9%] rounded-full bg-signal"
          transition={{ duration: 2.4, ease: "easeInOut", repeat: Infinity }}
        />
      </motion.span>
      <motion.span
        animate={{ y: "0%", opacity: 1 }}
        aria-hidden="true"
        className="text-[clamp(8rem,30vw,22rem)]"
        initial={{ y: "30%", opacity: 0 }}
        transition={{ delay: 0.1, duration: 1, ease }}
      >
        4
      </motion.span>
    </div>
  );
}
