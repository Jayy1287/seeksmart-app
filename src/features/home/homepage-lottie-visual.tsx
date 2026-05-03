"use client";

import { useEffect, useRef } from "react";
import type { AnimationItem } from "lottie-web";

export function HomepageLottieVisual() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    let isMounted = true;
    let animation: AnimationItem | null = null;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

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

    return () => {
      isMounted = false;
      animation?.destroy();
    };
  }, []);

  return (
    <div className="relative overflow-hidden rounded-xl border border-line bg-white">
      <div className="absolute left-0 top-0 h-1 w-full bg-accent" />
      <div
        aria-hidden="true"
        className="mx-auto aspect-[1002/632] w-full max-w-[34rem]"
        ref={containerRef}
      />
      <div className="border-t border-line bg-muted/36 px-4 py-3">
        <p className="text-xs font-bold uppercase text-accent">
          Collaborative decision mapping
        </p>
        <p className="mt-1 text-sm leading-6 text-ink/62">
          Align the team around opportunities, workflows, and feedback before
          selecting a tool.
        </p>
      </div>
    </div>
  );
}
