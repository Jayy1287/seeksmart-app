"use client";

import type { AnchorHTMLAttributes, ComponentType, ReactNode } from "react";
import type { UrlObject } from "node:url";
import Link, { type LinkProps } from "next/link";
import { motion, type MotionProps, useReducedMotion } from "motion/react";

type MotionLinkProps =
  Pick<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    | "aria-current"
    | "aria-label"
    | "children"
    | "className"
    | "id"
    | "rel"
    | "role"
    | "target"
    | "title"
  > & {
  href: LinkProps<unknown>["href"] | string | UrlObject;
  prefetch?: LinkProps<unknown>["prefetch"];
  replace?: LinkProps<unknown>["replace"];
  scroll?: LinkProps<unknown>["scroll"];
  children: ReactNode;
};

const AnimatedLink = motion.create(Link) as ComponentType<
  MotionLinkProps & MotionProps
>;

export function MotionLink({
  children,
  className,
  href,
  ...props
}: MotionLinkProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <AnimatedLink
      className={className}
      href={href as LinkProps<unknown>["href"]}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      whileHover={shouldReduceMotion ? undefined : { y: -2 }}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.985 }}
      {...props}
    >
      {children}
    </AnimatedLink>
  );
}
