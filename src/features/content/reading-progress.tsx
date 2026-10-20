"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, useScroll, useSpring } from "motion/react";

// Thin signal bar pinned to the top of the viewport that fills as the reader
// scrolls through the page. Portalled to <body> so transformed page wrappers
// cannot turn `position: fixed` into a local position.
export function ReadingProgress() {
  const [mounted, setMounted] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 26, mass: 0.3 });

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return createPortal(
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-[3px] origin-left bg-signal"
      style={{ scaleX }}
    />,
    document.body
  );
}
