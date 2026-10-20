"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ScoreDial } from "@/components/ui/score-dial";

// A quiet stack of "saved briefs" that rotates on the night panel of the
// sign-in page. Decorative only.

const briefs = [
  { id: "a", name: "Reply to reviews faster", meta: "Cafe / Pilot-ready", score: 82 },
  { id: "b", name: "Draft support replies", meta: "Online store / Prepare first", score: 74 },
  { id: "c", name: "Follow up new enquiries", meta: "Local service / Pilot-ready", score: 88 },
  { id: "d", name: "Weekly sales summary", meta: "Shop / Prepare first", score: 67 }
];

const ease = [0.22, 1, 0.36, 1] as const;

export function LoginVisual() {
  const reduce = useReducedMotion();
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const timer = window.setInterval(() => setOffset((value) => value + 1), 3200);
    return () => window.clearInterval(timer);
  }, [reduce]);

  const visible = [0, 1, 2].map((index) => briefs[(offset + index) % briefs.length]);

  return (
    <div aria-hidden="true" className="relative">
      <ul className="grid gap-2">
        <AnimatePresence initial={false} mode="popLayout">
          {visible.map((brief, index) => (
            <motion.li
              animate={{ opacity: 1 - index * 0.28, y: 0, scale: 1 - index * 0.02 }}
              className="flex items-center gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.04] p-3.5 pr-5"
              exit={{ opacity: 0, y: -24, scale: 0.96 }}
              initial={{ opacity: 0, y: 24 }}
              key={brief.id}
              layout
              transition={{ duration: 0.7, ease }}
            >
              <ScoreDial size={44} tone="light" value={brief.score} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[0.95rem] font-medium text-white">{brief.name}</span>
                <span className="block truncate font-mono text-[0.62rem] uppercase tracking-[0.14em] text-white/40">
                  {brief.meta}
                </span>
              </span>
              {index === 0 ? (
                <span className="flex items-center gap-1.5 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-signal">
                  <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-signal" />
                  Saved
                </span>
              ) : null}
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}
