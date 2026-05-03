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
