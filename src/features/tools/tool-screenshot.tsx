"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring
} from "motion/react";

type ToolScreenshotProps = {
  caption?: string;
  name: string;
  src: string;
  websiteUrl: string;
};

// Browser-frame mockup with a gentle scroll parallax. Motion values start at
// rest on both server and client, so there is no hydration mismatch; reduced
// motion simply never feeds them. If the image fails, the whole frame removes
// itself instead of leaving an empty box.
export function ToolScreenshot({ caption, name, src, websiteUrl }: ToolScreenshotProps) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [failed, setFailed] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const rawY = useMotionValue(0);
  const rawTilt = useMotionValue(0);
  const y = useSpring(rawY, { stiffness: 120, damping: 24, mass: 0.4 });
  const rotateX = useSpring(rawTilt, { stiffness: 120, damping: 24, mass: 0.4 });

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    if (reduce) return;
    // Image drifts up through the frame; the frame un-tilts as it arrives.
    rawY.set((0.5 - progress) * 36);
    rawTilt.set(Math.max(0, 0.45 - progress) * 18);
  });

  if (failed) {
    return null;
  }

  const host = hostFor(websiteUrl);

  return (
    <figure className="[perspective:1600px]" ref={ref}>
      <motion.div
        className="origin-bottom overflow-hidden rounded-[1.25rem] bg-night p-1.5 shadow-[0_50px_100px_-50px_rgb(14_14_16/0.65)] ring-1 ring-ink/10 md:rounded-[1.75rem] md:p-2"
        initial={{ opacity: 0, y: 48 }}
        style={{ rotateX }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ once: true, margin: "100000px 0px -48px 0px" }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 px-2 pb-2 pt-1 md:px-3 md:pb-2.5 md:pt-1.5">
          <span aria-hidden="true" className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-signal" />
          </span>
          <span className="mx-auto flex min-w-0 max-w-sm flex-1 items-center justify-center truncate rounded-full bg-white/[0.07] px-3 py-1 font-mono text-[0.7rem] text-white/55">
            {host}
          </span>
          <span aria-hidden="true" className="hidden w-[2.6rem] md:block" />
        </div>
        <div className="relative aspect-[16/10] overflow-hidden rounded-[0.9rem] bg-white md:rounded-[1.2rem]">
          <motion.div className="absolute inset-0" style={{ y, scale: 1.08 }}>
            <Image
              alt={`${name} website`}
              className="object-cover object-top"
              fill
              onError={() => setFailed(true)}
              sizes="(min-width: 1344px) 1280px, 100vw"
              src={src}
            />
          </motion.div>
        </div>
      </motion.div>
      {caption ? (
        <figcaption className="mt-4 text-center font-mono text-[0.72rem] uppercase tracking-[0.12em] text-ink/40">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

function hostFor(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}
