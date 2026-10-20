"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { AnimatedNumber } from "@/components/motion/animated-number";
import { ScoreDial } from "@/components/ui/score-dial";

// A live, zero-backend preview of what the audit returns. Switching the
// business type re-ranks the list with layout animation so the hero shows the
// product doing its job instead of describing it.

type Scenario = {
  id: "ecommerce" | "retail-and-hospitality" | "local-services";
  label: string;
  readiness: number;
  level: "Pilot-ready" | "Prepare first";
  firstMove: string;
  opportunities: Array<{ id: string; name: string; score: number }>;
};

const scenarios: Scenario[] = [
  {
    id: "ecommerce",
    label: "Online store",
    readiness: 82,
    level: "Pilot-ready",
    firstMove: "Draft support replies, review before sending.",
    opportunities: [
      { id: "support", name: "Reduce support response time", score: 93 },
      { id: "kb", name: "Turn repeat questions into help content", score: 90 },
      { id: "listings", name: "Draft product descriptions faster", score: 84 }
    ]
  },
  {
    id: "retail-and-hospitality",
    label: "Shop or venue",
    readiness: 67,
    level: "Prepare first",
    firstMove: "Answer every review within a day, drafted for you.",
    opportunities: [
      { id: "reviews", name: "Reply to reviews faster", score: 91 },
      { id: "content", name: "Weekly posts and promotions", score: 86 },
      { id: "report", name: "Turn till data into a weekly summary", score: 79 }
    ]
  },
  {
    id: "local-services",
    label: "Local service",
    readiness: 74,
    level: "Prepare first",
    firstMove: "Reply to new enquiries with a quote in minutes.",
    opportunities: [
      { id: "leads", name: "Improve lead follow-up speed", score: 94 },
      { id: "proposals", name: "Generate first-draft proposals", score: 85 },
      { id: "invoices", name: "Categorize invoices and receipts", score: 76 }
    ]
  }
];

const cycleMs = 4600;
const ease = [0.22, 1, 0.36, 1] as const;

export function HeroAuditDemo() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const interacted = useRef(false);
  const scenario = scenarios[index];

  useEffect(() => {
    if (reduce || isPaused || interacted.current) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % scenarios.length);
    }, cycleMs);
    return () => window.clearInterval(timer);
  }, [isPaused, reduce]);

  function choose(nextIndex: number) {
    interacted.current = true;
    setIndex(nextIndex);
  }

  return (
    <div
      className="night night-panel spotlight relative p-2 shadow-[0_40px_80px_-40px_rgb(14_14_16/0.7)]"
      data-spotlight
      onBlur={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative z-[1] flex flex-wrap items-center justify-between gap-3 px-3 pb-2 pt-3 sm:px-4">
        <span className="flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-white/50">
          <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-signal" />
          Live preview
        </span>
        <div
          aria-label="Business type"
          className="flex rounded-full bg-white/[0.06] p-1"
          role="tablist"
        >
          {scenarios.map((item, itemIndex) => {
            const active = itemIndex === index;
            return (
              <button
                aria-selected={active}
                className={`relative rounded-full px-3 py-1.5 text-[0.78rem] font-medium transition-colors ${
                  active ? "text-ink" : "text-white/55 hover:text-white"
                }`}
                key={item.id}
                onClick={() => choose(itemIndex)}
                role="tab"
                type="button"
              >
                {active ? (
                  <motion.span
                    className="absolute inset-0 rounded-full bg-paper"
                    layoutId="demo-tab"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                ) : null}
                <span className="relative">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="relative z-[1] grid gap-2 sm:grid-cols-[10.5rem_minmax(0,1fr)]">
        <div className="flex flex-col items-center justify-center gap-4 rounded-[1.4rem] bg-white/[0.04] px-4 py-7">
          <div className="relative">
            <ScoreDial showValue={false} size={132} stroke={9} tone="light" value={scenario.readiness} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="stat-number text-5xl text-white">
                <AnimatedNumber value={scenario.readiness} />
              </span>
              <span className="mt-1 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-white/45">
                Readiness
              </span>
            </div>
          </div>
          <AnimatePresence initial={false} mode="wait">
            <motion.span
              animate={{ opacity: 1, scale: 1 }}
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                scenario.level === "Pilot-ready"
                  ? "bg-signal text-white"
                  : "bg-white/10 text-white/80"
              }`}
              exit={{ opacity: 0, scale: 0.9 }}
              initial={{ opacity: 0, scale: 0.9 }}
              key={scenario.level}
              transition={{ duration: 0.3, ease }}
            >
              {scenario.level}
            </motion.span>
          </AnimatePresence>
        </div>

        <div className="min-w-0 rounded-[1.4rem] bg-white/[0.04] p-4 sm:p-5">
          <p className="font-mono text-[0.66rem] uppercase tracking-[0.16em] text-white/45">
            Where AI pays back first
          </p>
          <ul className="mt-4 grid gap-2">
            <AnimatePresence initial={false} mode="popLayout">
              {scenario.opportunities.map((opportunity, rank) => (
                <motion.li
                  animate={{ opacity: 1, x: 0 }}
                  className="min-w-0 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-3"
                  exit={{ opacity: 0, x: 24 }}
                  initial={{ opacity: 0, x: -24 }}
                  key={opportunity.id}
                  layout
                  transition={{ duration: 0.5, ease, delay: rank * 0.06 }}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-mono text-[0.7rem] ${
                        rank === 0 ? "bg-signal text-white" : "bg-white/10 text-white/70"
                      }`}
                    >
                      {rank + 1}
                    </span>
                    <span className="min-w-0 flex-1 text-[0.88rem] leading-snug text-white/90">
                      {opportunity.name}
                    </span>
                    <span className="font-mono text-sm text-white tabular">
                      <AnimatedNumber value={opportunity.score} />
                    </span>
                  </div>
                  <div className="ml-9 mt-2 h-[3px] overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      animate={{ width: `${opportunity.score}%` }}
                      className={`h-full rounded-full ${rank === 0 ? "bg-signal" : "bg-white/50"}`}
                      initial={{ width: "0%" }}
                      transition={{ duration: 0.9, ease, delay: 0.15 + rank * 0.08 }}
                    />
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </div>
      </div>

      <div className="relative z-[1] flex flex-col gap-3 px-3 pb-3 pt-4 sm:flex-row sm:items-center sm:justify-between sm:px-4">
        <AnimatePresence initial={false} mode="wait">
          <motion.p
            animate={{ opacity: 1, y: 0 }}
            className="text-[0.85rem] text-white/60"
            exit={{ opacity: 0, y: -6 }}
            initial={{ opacity: 0, y: 6 }}
            key={scenario.id}
            transition={{ duration: 0.35, ease }}
          >
            <span className="text-white">First move:</span> {scenario.firstMove}
          </motion.p>
        </AnimatePresence>
        <Link
          className="btn btn-light btn-sm shrink-0 self-start sm:self-auto"
          href={`/audit/questions?industry=${scenario.id}`}
        >
          Run it for real
          <ArrowRight aria-hidden="true" size={14} />
        </Link>
      </div>
    </div>
  );
}
