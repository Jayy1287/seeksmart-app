"use client";

import { useEffect, useRef } from "react";
import type { AnimationItem } from "lottie-web";

// The Lottie player is ~250 KB of client JS. Load it only after the browser is
// idle and the hero visual is actually in view, so it never competes with the
// main thread during initial render (LCP/INP).
export function HomepageLottieVisual() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    let isMounted = true;
    let animation: AnimationItem | null = null;
    let idleHandle: number | null = null;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    function load() {
      void import("lottie-web").then(({ default: lottie }) => {
        if (!isMounted || !containerRef.current) {
          return;
        }

        animation = lottie.loadAnimation({
          autoplay: !prefersReducedMotion,
          container: containerRef.current,
          loop: !prefersReducedMotion,
          path: "/visuals/people-brainstorming-feedback.json",
          renderer: "svg",
          rendererSettings: {
            progressiveLoad: true,
            preserveAspectRatio: "xMidYMid meet"
          }
        });

        if (prefersReducedMotion) {
          animation.goToAndStop(36, true);
        }
      });
    }

    function scheduleLoad() {
      if (typeof window.requestIdleCallback === "function") {
        idleHandle = window.requestIdleCallback(load, { timeout: 2500 });
      } else {
        idleHandle = window.setTimeout(load, 600) as unknown as number;
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          scheduleLoad();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(container);

    return () => {
      isMounted = false;
      observer.disconnect();
      if (idleHandle !== null) {
        if (typeof window.cancelIdleCallback === "function") {
          window.cancelIdleCallback(idleHandle);
        } else {
          window.clearTimeout(idleHandle);
        }
      }
      animation?.destroy();
    };
  }, []);

  return (
    <div className="relative mx-auto w-full max-w-[34rem]">
      <div className="absolute inset-x-8 bottom-2 h-10 rounded-[50%] bg-accent/10 blur-xl" />
      <div
        aria-hidden="true"
        className="relative aspect-[1002/632] w-full"
        ref={containerRef}
      />
    </div>
  );
}
