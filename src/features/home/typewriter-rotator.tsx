"use client";

import { useEffect, useMemo, useState } from "react";
import { useReducedMotion } from "motion/react";

const phrases = [
  "tool shortlists",
  "use cases",
  "opportunities",
  "playbooks"
];

const typeDelayMs = 58;
const deleteDelayMs = 34;
const holdDelayMs = 1500;

export function TypewriterRotator() {
  const shouldReduceMotion = useReducedMotion();
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [characterCount, setCharacterCount] = useState(phrases[0].length);
  const [mode, setMode] = useState<"typing" | "holding" | "deleting">(
    "holding"
  );

  const phrase = phrases[phraseIndex];
  const visibleText = useMemo(
    () => phrase.slice(0, characterCount),
    [characterCount, phrase]
  );

  useEffect(() => {
    if (shouldReduceMotion) {
      setPhraseIndex(0);
      setCharacterCount(phrases[0].length);
      setMode("holding");
      return;
    }

    const timeout = window.setTimeout(
      () => {
        if (mode === "holding") {
          setMode("deleting");
          return;
        }

        if (mode === "deleting") {
          if (characterCount > 0) {
            setCharacterCount((count) => count - 1);
            return;
          }

          setPhraseIndex((index) => (index + 1) % phrases.length);
          setMode("typing");
          return;
        }

        if (characterCount < phrase.length) {
          setCharacterCount((count) => count + 1);
          return;
        }

        setMode("holding");
      },
      mode === "holding"
        ? holdDelayMs
        : mode === "deleting"
          ? deleteDelayMs
          : typeDelayMs
    );

    return () => window.clearTimeout(timeout);
  }, [characterCount, mode, phrase.length, shouldReduceMotion]);

  return (
    <p className="hero-typewriter" aria-label="Decision engine for AI with tool shortlists, use cases, opportunities, and playbooks.">
      <span>Decision engine for AI with</span>
      <span aria-hidden="true" className="hero-typewriter-text">
        {visibleText}
      </span>
    </p>
  );
}
