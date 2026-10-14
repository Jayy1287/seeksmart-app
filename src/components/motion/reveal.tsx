"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";

type RevealProps = {
  as?: "div" | "section" | "li" | "article" | "header";
  children: ReactNode;
  className?: string;
  delay?: number;
  id?: string;
  y?: number;
};

// Fades and lifts content in once it scrolls into view. Reduced motion is
// handled globally by MotionConfig (transforms are skipped, opacity stays).
// The huge top margin counts anything already scrolled past as "in view", so a
// fast fling or anchor jump never leaves content stuck invisible. The same
// margin is used by every in-view trigger in the app.
export function Reveal({ as = "div", children, className, delay = 0, id, y = 28 }: RevealProps) {
  const Tag = motion[as];

  return (
    <Tag
      className={className}
      id={id}
      initial={{ opacity: 0, y }}
      transition={{ delay, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true, margin: "100000px 0px -48px 0px" }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      {children}
    </Tag>
  );
}
