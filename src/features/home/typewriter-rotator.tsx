"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

const phrases = [
  "tool shortlists",
  "use cases",
  "opportunities",
  "playbooks"
];

const typeDelayMs = 65;
const deleteDelayMs = 38;
const holdDelayMs = 1450;
const restartDelayMs = 260;

export function TypewriterRotator() {
  const shouldReduceMotion = useReducedMotion();
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [visibleText, setVisibleText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (shouldReduceMotion) {
      setPhraseIndex(0);
      setVisibleText(phrases[0]);
      setIsDeleting(false);
      return;
    }

    const currentPhrase = phrases[phraseIndex];

    if (!isDeleting && visibleText === currentPhrase) {
      const holdTimeout = window.setTimeout(() => {
        setIsDeleting(true);
      }, holdDelayMs);

      return () => window.clearTimeout(holdTimeout);
    }

    if (isDeleting && visibleText.length === 0) {
      const restartTimeout = window.setTimeout(() => {
        setIsDeleting(false);
        setPhraseIndex((index) => (index + 1) % phrases.length);
      }, restartDelayMs);

      return () => window.clearTimeout(restartTimeout);
    }

    const stepTimeout = window.setTimeout(() => {
      if (isDeleting) {
        setVisibleText(currentPhrase.slice(0, visibleText.length - 1));
        return;
      }

      setVisibleText(currentPhrase.slice(0, visibleText.length + 1));
    }, isDeleting ? deleteDelayMs : typeDelayMs);

    return () => window.clearTimeout(stepTimeout);
  }, [isDeleting, phraseIndex, shouldReduceMotion, visibleText]);

  return (
    <p
      aria-label="Decision engine for AI with tool shortlists, use cases, opportunities, and playbooks."
      className="hero-typewriter"
    >
      <span className="hero-typewriter-prefix">Decision engine for AI with</span>
      <span aria-hidden="true" className="hero-typewriter-text">
        {visibleText}
      </span>
    </p>
  );
}
