"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

// Thin signal-coloured bar at the top of the viewport during client-side
// navigation. Starts on an internal link click, completes when the URL changes.
export function RouteProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as Element | null)?.closest?.("a");
      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return;
      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;
      const url = new URL(href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.search === window.location.search) return;
      setState("loading");
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  useEffect(() => {
    setState((current) => (current === "loading" ? "done" : current));
  }, [pathname, searchParams]);

  useEffect(() => {
    if (state !== "done") return;
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setState("idle"), 450);
    return () => window.clearTimeout(timer.current);
  }, [state]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-[2px]"
      style={{ opacity: state === "idle" ? 0 : 1, transition: "opacity 300ms ease 150ms" }}
    >
      <div
        className="h-full origin-left bg-signal shadow-[0_0_12px_rgb(255_92_38/0.8)]"
        style={{
          transform: `scaleX(${state === "idle" ? 0 : state === "loading" ? 0.75 : 1})`,
          transition:
            state === "loading"
              ? "transform 2.5s cubic-bezier(0.1, 0.8, 0.2, 1)"
              : state === "done"
                ? "transform 250ms ease-out"
                : "none"
        }}
      />
    </div>
  );
}
