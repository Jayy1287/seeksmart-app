"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import { trackEvent } from "./site-analytics";

type TrackedExternalLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  event: string;
  properties?: Record<string, string | number | boolean | string[]>;
};

export function TrackedExternalLink({
  children,
  event,
  onClick,
  properties,
  ...props
}: TrackedExternalLinkProps) {
  return (
    <a
      {...props}
      onClick={(clickEvent) => {
        trackEvent(event, properties);
        onClick?.(clickEvent);
      }}
    >
      {children}
    </a>
  );
}
