"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";

export type SectionNavItem = { id: string; label: string };

// Sticky table of contents for long guide pages. The active section is the
// last one whose top has passed the upper third of the viewport.
export function SectionNav({ items }: { items: SectionNavItem[] }) {
  const [active, setActive] = useState(items[0]?.id ?? "");

  useEffect(() => {
    function update() {
      const line = window.innerHeight * 0.35;
      let current = items[0]?.id ?? "";
      for (const item of items) {
        const element = document.getElementById(item.id);
        if (element && element.getBoundingClientRect().top <= line) {
          current = item.id;
        }
      }
      setActive(current);
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [items]);

  return (
    <nav aria-label="On this page">
      <p className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-ink/40">On this page</p>
      <ol className="mt-5 grid gap-1 border-l border-ink/10">
        {items.map((item, index) => {
          const isActive = item.id === active;
          return (
            <li className="relative" key={item.id}>
              {isActive ? (
                <motion.span
                  aria-hidden="true"
                  className="absolute -left-px top-0 h-full w-[2px] rounded-full bg-signal"
                  layoutId="section-nav-indicator"
                  transition={{ type: "spring", stiffness: 380, damping: 34 }}
                />
              ) : null}
              <a
                aria-current={isActive ? "true" : undefined}
                className={`flex gap-3 py-1.5 pl-4 text-sm transition-colors duration-300 ${
                  isActive ? "text-ink" : "text-ink/45 hover:text-ink"
                }`}
                href={`#${item.id}`}
              >
                <span className="font-mono text-xs leading-5 opacity-60">{String(index + 1).padStart(2, "0")}</span>
                {item.label}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
