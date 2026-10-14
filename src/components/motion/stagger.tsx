"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";

type StaggerProps = {
  as?: "div" | "ul" | "ol" | "section";
  children: ReactNode;
  className?: string;
  delay?: number;
  gap?: number;
  /** Start when scrolled into view instead of on mount. */
  inView?: boolean;
};

type StaggerItemProps = {
  as?: "div" | "li" | "article";
  children: ReactNode;
  className?: string;
};

const ease = [0.22, 1, 0.36, 1] as const;

export function Stagger({
  as = "div",
  children,
  className,
  delay = 0,
  gap = 0.07,
  inView = false
}: StaggerProps) {
  const Tag = motion[as];
  const trigger = inView
    ? { whileInView: "show", viewport: { once: true, margin: "-60px 0px" } }
    : { animate: "show" };

  return (
    <Tag
      className={className}
      initial="hidden"
      variants={{
        hidden: {},
        show: { transition: { delayChildren: delay, staggerChildren: gap } }
      }}
      {...trigger}
    >
      {children}
    </Tag>
  );
}

export function StaggerItem({ as = "div", children, className }: StaggerItemProps) {
  const Tag = motion[as];

  return (
    <Tag
      className={className}
      variants={{
        hidden: { opacity: 0, y: 22 },
        show: { opacity: 1, y: 0, transition: { duration: 0.75, ease } }
      }}
    >
      {children}
    </Tag>
  );
}
