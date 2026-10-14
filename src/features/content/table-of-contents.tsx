"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";

export type TocItem = {
  id: string;
  label: string;
};

// Sticky on-page navigation. Highlights the section currently in view.
export function TableOfContents({
  items,
  title = "On this page"
}: {
  items: TocItem[];
  title?: string;
}) {
  const [active, setActive] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const targets = items
      .map((item) => document.getElementById(item.id))
      .filter((node): node is HTMLElement => Boolean(node));

    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible[0]) {
          setActive(visible[0].target.id);
        }
      },
      { rootMargin: "-20% 0px -65% 0px", threshold: 0 }
    );

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav aria-label={title} className="text-sm">
      <p className="eyebrow eyebrow-plain">{title}</p>
      <ol className="relative mt-5 grid gap-0.5 border-l border-ink/10">
        {items.map((item, index) => {
          const isActive = item.id === active;

          return (
            <li className="relative" key={item.id}>
              {isActive ? (
                <motion.span
                  aria-hidden="true"
                  className="absolute -left-px top-1 bottom-1 w-[2px] rounded-full bg-signal"
                  layoutId="toc-indicator"
                  transition={{ type: "spring", stiffness: 380, damping: 34 }}
                />
              ) : null}
              <a
                aria-current={isActive ? "true" : undefined}
                className={`flex gap-3 py-1.5 pl-4 leading-snug transition-colors duration-200 ${
                  isActive ? "text-ink" : "text-ink/45 hover:text-ink/80"
                }`}
                href={`#${item.id}`}
              >
                <span className="font-mono text-[0.7rem] leading-[1.35rem] text-ink/35 tabular">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>{item.label}</span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
