"use client";

import { useEffect, useRef, useState } from "react";
import {
  animate,
  useInView,
  useReducedMotion
} from "motion/react";

type AnimatedNumberProps = {
  className?: string;
  locale?: string;
  prefix?: string;
  suffix?: string;
  value: number;
};

export function AnimatedNumber({
  className,
  locale = "en-IN",
  prefix = "",
  suffix = "",
  value
}: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const shouldReduceMotion = useReducedMotion();
  const displayValueRef = useRef(value);
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    if (!isInView) {
      return;
    }

    if (shouldReduceMotion) {
      displayValueRef.current = value;
      setDisplayValue(value);
      return;
    }

    const controls = animate(displayValueRef.current, value, {
      duration: 0.75,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => {
        const nextValue = Math.round(latest);
        displayValueRef.current = nextValue;
        setDisplayValue(nextValue);
      }
    });

    return () => controls.stop();
  }, [isInView, shouldReduceMotion, value]);

  return (
    <span className={className} ref={ref}>
      {prefix}
      {new Intl.NumberFormat(locale).format(displayValue)}
      {suffix}
    </span>
  );
}
