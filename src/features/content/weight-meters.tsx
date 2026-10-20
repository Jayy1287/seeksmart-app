"use client";

import { motion } from "motion/react";
import { AnimatedNumber } from "@/components/motion/animated-number";

export type Weight = {
  label: string;
  note: string;
  value: number;
};

const ease = [0.22, 1, 0.36, 1] as const;

// Horizontal meters whose fills grow to the weight share when scrolled into
// view. The largest weight is drawn in signal.
export function WeightMeters({ weights }: { weights: Weight[] }) {
  const max = Math.max(...weights.map((weight) => weight.value));

  return (
    <ol className="row-list">
      {weights.map((weight, index) => {
        const isTop = weight.value === max;

        return (
          <li
            className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-x-6 gap-y-4 border-b border-ink/[0.12] py-7 md:grid-cols-[minmax(0,16rem)_minmax(0,1fr)_7rem] md:items-center md:gap-x-10 md:py-9"
            key={weight.label}
          >
            <div className="min-w-0">
              <p className="font-display text-[1.45rem] font-bold leading-none tracking-[-0.035em] md:text-[1.8rem]">
                {weight.label}
              </p>
              <p className="mt-2 text-sm text-ink/50">{weight.note}</p>
            </div>
            <p
              className={`stat-number text-right text-[2.6rem] md:order-3 md:text-[3.4rem] ${
                isTop ? "text-signal" : ""
              }`}
            >
              <AnimatedNumber value={weight.value} />
              <span className="ml-0.5 text-[0.5em] text-ink/35">%</span>
            </p>
            <div className="relative col-span-2 h-3 overflow-hidden rounded-full bg-ink/[0.07] md:order-2 md:col-span-1 md:h-4">
              <motion.div
                className={`absolute inset-y-0 left-0 rounded-full ${isTop ? "bg-signal" : "bg-ink"}`}
                initial={{ width: "0%" }}
                transition={{ delay: 0.1 + index * 0.12, duration: 1.2, ease }}
                viewport={{ once: true, margin: "100000px 0px -48px 0px" }}
                whileInView={{ width: `${weight.value}%` }}
              />
            </div>
          </li>
        );
      })}
    </ol>
  );
}
