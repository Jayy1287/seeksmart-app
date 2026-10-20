"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { AnimatedNumber } from "@/components/motion/animated-number";

// Circular score gauge. Draws its arc when it enters the viewport and
// re-animates when the value changes.

type ScoreDialProps = {
  className?: string;
  label?: string;
  showValue?: boolean;
  size?: number;
  stroke?: number;
  tone?: "ink" | "signal" | "light";
  value: number;
};

export function ScoreDial({
  className,
  label,
  showValue = true,
  size = 56,
  stroke,
  tone = "ink",
  value
}: ScoreDialProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "100000px 0px -48px 0px" });
  const sw = stroke ?? Math.max(3, Math.round(size / 15));
  const r = (size - sw) / 2 - 0.5;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, value)) / 100;
  const palette = {
    ink: { track: "rgb(var(--color-ink) / 0.09)", bar: "rgb(var(--color-ink))" },
    signal: { track: "rgb(var(--color-ink) / 0.09)", bar: "rgb(var(--color-signal))" },
    light: { track: "rgb(255 255 255 / 0.12)", bar: "rgb(var(--color-signal))" }
  }[tone];

  return (
    <span
      aria-label={`${label ? `${label}: ` : ""}${value} out of 100`}
      className={["relative inline-flex shrink-0 items-center justify-center", className]
        .filter(Boolean)
        .join(" ")}
      ref={ref}
      role="img"
      style={{ height: size, width: size }}
    >
      <svg aria-hidden="true" className="-rotate-90" height={size} viewBox={`0 0 ${size} ${size}`} width={size}>
        <circle cx={size / 2} cy={size / 2} fill="none" r={r} stroke={palette.track} strokeWidth={sw} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          fill="none"
          initial={{ strokeDashoffset: c }}
          r={r}
          stroke={palette.bar}
          strokeDasharray={c}
          strokeLinecap="round"
          strokeWidth={sw}
          animate={{ strokeDashoffset: inView ? c * (1 - pct) : c }}
          transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      {showValue ? (
        <span
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center font-mono font-medium tabular"
          style={{ fontSize: Math.max(11, Math.round(size * 0.29)) }}
        >
          <AnimatedNumber value={value} />
        </span>
      ) : null}
    </span>
  );
}
