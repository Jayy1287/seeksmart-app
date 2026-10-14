"use client";

import { motion } from "motion/react";

const ease = [0.22, 1, 0.36, 1] as const;

// Envelope that draws itself, then a signal check pops onto its corner.
export function MailSentMark() {
  return (
    <div aria-hidden="true" className="relative mx-auto h-32 w-40">
      <motion.div
        animate={{ y: [0, -8, 0] }}
        className="absolute inset-0"
        transition={{ delay: 1.6, duration: 4, ease: "easeInOut", repeat: Infinity }}
      >
        <svg className="h-full w-full" fill="none" viewBox="0 0 160 128">
          <motion.rect
            animate={{ pathLength: 1, opacity: 1 }}
            height="84"
            initial={{ pathLength: 0, opacity: 0 }}
            rx="14"
            stroke="rgb(var(--color-ink))"
            strokeWidth="3"
            transition={{ duration: 0.9, ease }}
            width="124"
            x="12"
            y="30"
          />
          <motion.path
            animate={{ pathLength: 1, opacity: 1 }}
            d="M16 38 L74 80 L132 38"
            initial={{ pathLength: 0, opacity: 0 }}
            stroke="rgb(var(--color-ink))"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="3"
            transition={{ delay: 0.6, duration: 0.7, ease }}
          />
        </svg>
        <motion.span
          animate={{ scale: 1, opacity: 1 }}
          className="absolute right-0 top-2 flex h-14 w-14 items-center justify-center rounded-full bg-signal shadow-[0_12px_30px_-8px_rgb(var(--color-signal)/0.7)]"
          initial={{ scale: 0, opacity: 0 }}
          transition={{ delay: 1.1, type: "spring", stiffness: 420, damping: 18 }}
        >
          <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24">
            <motion.path
              animate={{ pathLength: 1 }}
              d="M5 12.5 L10 17 L19 7"
              initial={{ pathLength: 0 }}
              stroke="white"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              transition={{ delay: 1.35, duration: 0.45, ease }}
            />
          </svg>
        </motion.span>
      </motion.div>
    </div>
  );
}
