"use client";

import { useRef, useState } from "react";
import { Check } from "lucide-react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring
} from "motion/react";
import { ScoreDial } from "@/components/ui/score-dial";

// Sticky scroll story: the left column pins while three steps scroll past.
// A progress rail fills with scroll and the active step's number lights up.

const steps = [
  {
    title: "Answer eleven questions",
    body: "Business type, team size, the work that eats your week. No account.",
    visual: "questions"
  },
  {
    title: "See where AI pays back",
    body: "A readiness score and the three workflows worth piloting, each with a reason.",
    visual: "score"
  },
  {
    title: "Pilot it in two weeks",
    body: "An owner, a baseline, a target, and the tools to compare. Then decide.",
    visual: "plan"
  }
] as const;

const ease = [0.22, 1, 0.36, 1] as const;

export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 60%", "end 60%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    setActive(Math.min(steps.length - 1, Math.max(0, Math.floor(value * steps.length))));
  });

  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20" ref={ref}>
      <div className="lg:sticky lg:top-28 lg:h-fit">
        <p className="eyebrow">How it works</p>
        <h2 className="h2 mt-5">
          Three minutes.
          <br />
          <span className="ghost-word">Three answers.</span>
        </h2>
        <div className="mt-10 hidden gap-5 lg:flex">
          <div className="relative w-[2px] rounded-full bg-ink/10">
            <motion.div
              className="absolute inset-x-0 top-0 origin-top rounded-full bg-signal"
              style={{ height: "100%", scaleY: progress }}
            />
          </div>
          <ol className="grid gap-5">
            {steps.map((step, index) => (
              <li
                className={`flex items-baseline gap-4 transition-colors duration-500 ${
                  index === active ? "text-ink" : "text-ink/30"
                }`}
                key={step.title}
              >
                <span className="font-mono text-sm">0{index + 1}</span>
                <span className="text-lg font-medium">{step.title}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="grid gap-16 md:gap-24">
        {steps.map((step, index) => (
          <motion.article
            className="grid gap-6"
            initial={{ opacity: 0.25 }}
            key={step.title}
            transition={{ duration: 0.6, ease }}
            viewport={{ margin: "-35% 0px -35% 0px" }}
            whileInView={{ opacity: 1 }}
          >
            <div className="surface overflow-hidden p-6 sm:p-8">
              <StepVisual kind={step.visual} />
            </div>
            <div className="flex gap-5">
              <span className="font-mono text-sm text-signal">0{index + 1}</span>
              <div>
                <h3 className="h3">{step.title}</h3>
                <p className="mt-2 max-w-md text-ink/60">{step.body}</p>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}

function StepVisual({ kind }: { kind: (typeof steps)[number]["visual"] }) {
  const trigger = { viewport: { once: true, margin: "-20%" } };

  if (kind === "questions") {
    const options = ["Online store", "Shop or venue", "Local service", "Something else"];
    return (
      <div className="grid gap-4">
        <div className="flex items-center justify-between font-mono text-[0.7rem] uppercase tracking-[0.14em] text-ink/45">
          <span>Question 1 of 11</span>
          <span>~3 min</span>
        </div>
        <div className="meter">
          <motion.div
            initial={{ width: "0%" }}
            transition={{ duration: 1, ease }}
            whileInView={{ width: "9%" }}
            {...trigger}
          />
        </div>
        <p className="h3">What kind of business is this?</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {options.map((option, i) => (
            <motion.div
              className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm ${
                i === 0 ? "border-ink bg-ink text-paper" : "border-ink/10"
              }`}
              initial={{ opacity: 0, y: 12 }}
              key={option}
              transition={{ delay: 0.1 + i * 0.07, duration: 0.6, ease }}
              whileInView={{ opacity: 1, y: 0 }}
              {...trigger}
            >
              <span
                className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                  i === 0 ? "border-signal bg-signal" : "border-ink/25"
                }`}
              >
                {i === 0 ? <Check aria-hidden="true" className="text-white" size={10} strokeWidth={3} /> : null}
              </span>
              {option}
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (kind === "score") {
    const rows = [
      { name: "Support replies", score: 93 },
      { name: "Help content", score: 90 },
      { name: "Product copy", score: 84 }
    ];
    return (
      <div className="grid items-center gap-8 sm:grid-cols-[auto_1fr]">
        <div className="relative mx-auto">
          <ScoreDial showValue={false} size={140} stroke={10} tone="signal" value={82} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="stat-number text-5xl">82</span>
            <span className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-ink/45">
              Ready
            </span>
          </div>
        </div>
        <ul className="grid gap-4">
          {rows.map((row, i) => (
            <li key={row.name}>
              <div className="flex justify-between text-sm">
                <span>{row.name}</span>
                <span className="font-mono tabular">{row.score}</span>
              </div>
              <div className={`meter mt-2 ${i === 0 ? "meter-signal" : ""}`}>
                <motion.div
                  initial={{ width: "0%" }}
                  transition={{ delay: 0.2 + i * 0.12, duration: 1.1, ease }}
                  whileInView={{ width: `${row.score}%` }}
                  {...trigger}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  const plan = [
    { week: "Day 1", task: "Pick an owner and a baseline" },
    { week: "Week 1", task: "Draft replies with a person approving" },
    { week: "Week 2", task: "Compare against the baseline" }
  ];
  return (
    <div className="grid gap-3">
      {plan.map((item, i) => (
        <motion.div
          className="flex items-center gap-4 rounded-2xl bg-muted/60 px-4 py-3.5"
          initial={{ opacity: 0, x: -16 }}
          key={item.task}
          transition={{ delay: 0.1 + i * 0.12, duration: 0.6, ease }}
          whileInView={{ opacity: 1, x: 0 }}
          {...trigger}
        >
          <motion.span
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink text-paper"
            initial={{ scale: 0 }}
            transition={{ delay: 0.45 + i * 0.15, type: "spring", stiffness: 400, damping: 18 }}
            whileInView={{ scale: 1 }}
            {...trigger}
          >
            <Check aria-hidden="true" size={13} strokeWidth={3} />
          </motion.span>
          <span className="w-16 shrink-0 font-mono text-xs uppercase tracking-[0.1em] text-ink/45">
            {item.week}
          </span>
          <span className="text-sm sm:text-[0.95rem]">{item.task}</span>
        </motion.div>
      ))}
    </div>
  );
}
