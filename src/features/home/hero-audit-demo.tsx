"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { AnimatedNumber } from "@/components/motion/animated-number";

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
      { id: "kb", name: "Turn repeated questions into help content", score: 90 },
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

const cycleMs = 4200;
const ease = [0.22, 1, 0.36, 1] as const;

export function HeroAuditDemo() {
  const shouldReduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const interacted = useRef(false);
  const scenario = scenarios[index];

  useEffect(() => {
    if (shouldReduceMotion || isPaused || interacted.current) {
      return;
    }
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % scenarios.length);
    }, cycleMs);
    return () => window.clearInterval(timer);
  }, [isPaused, shouldReduceMotion]);

  function choose(nextIndex: number) {
    interacted.current = true;
    setIndex(nextIndex);
  }

  return (
    <div
      className="demo-card"
      onBlur={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="demo-tabs" role="tablist" aria-label="Business type">
        {scenarios.map((item, itemIndex) => {
          const active = itemIndex === index;
          return (
            <button
              aria-selected={active}
              className="demo-tab"
              data-active={active ? "true" : undefined}
              key={item.id}
              onClick={() => choose(itemIndex)}
              role="tab"
              type="button"
            >
              {active && !shouldReduceMotion ? (
                <motion.span
                  className="demo-tab-pill"
                  layoutId="demo-tab-pill"
                  transition={{ duration: 0.3, ease }}
                />
              ) : active ? (
                <span className="demo-tab-pill" />
              ) : null}
              <span className="relative">{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="demo-body">
        <div className="demo-readiness" data-level={scenario.level}>
          <p className="demo-label">Readiness</p>
          <p className="demo-score">
            <AnimatedNumber value={scenario.readiness} />
            <span className="demo-score-max">/100</span>
          </p>
          <div className="demo-bar" aria-hidden="true">
            <motion.span
              animate={{ width: `${scenario.readiness}%` }}
              initial={false}
              transition={{ duration: 0.7, ease }}
            />
          </div>
          <p className="demo-level">{scenario.level}</p>
        </div>

        <div className="demo-list">
          <p className="demo-label">Where AI pays back first</p>
          <ul>
            <AnimatePresence initial={false} mode="popLayout">
              {scenario.opportunities.map((opportunity, rank) => (
                <motion.li
                  animate={{ opacity: 1, x: 0 }}
                  className="demo-row"
                  data-rank={rank + 1}
                  exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: 12 }}
                  initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -12 }}
                  key={opportunity.id}
                  layout
                  transition={{ duration: 0.4, ease, delay: rank * 0.05 }}
                >
                  <span className="demo-rank">{rank + 1}</span>
                  <span className="demo-row-name">{opportunity.name}</span>
                  <span className="demo-row-score">
                    <AnimatedNumber value={opportunity.score} />
                  </span>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </div>
      </div>

      <div className="demo-footer">
        <AnimatePresence initial={false} mode="wait">
          <motion.p
            animate={{ opacity: 1, y: 0 }}
            className="demo-first-move"
            exit={{ opacity: 0, y: -4 }}
            initial={{ opacity: 0, y: 4 }}
            key={scenario.id}
            transition={{ duration: 0.3, ease }}
          >
            <span>First move:</span> {scenario.firstMove}
          </motion.p>
        </AnimatePresence>
        <Link
          className="demo-cta"
          href={`/audit/questions?industry=${scenario.id}`}
        >
          Run it for real
          <ArrowRight aria-hidden="true" size={15} />
        </Link>
      </div>
    </div>
  );
}
