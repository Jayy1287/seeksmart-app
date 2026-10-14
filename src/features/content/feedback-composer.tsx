"use client";

import { useState, type FormEvent } from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

const areas = ["Audit", "Tool page", "Use case", "Other"] as const;
const email = "seeksmartapp@gmail.com";

// Composes a feedback email in the visitor's mail client. Nothing is sent to
// SeekSmart servers.
export function FeedbackComposer() {
  const [area, setArea] = useState<(typeof areas)[number]>("Audit");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const body = [
      `What I tested: ${area}`,
      "",
      `What worked:\n${String(data.get("worked") ?? "")}`,
      "",
      `What felt unclear:\n${String(data.get("unclear") ?? "")}`,
      "",
      `What I would change:\n${String(data.get("change") ?? "")}`
    ].join("\n");

    window.location.href = `mailto:${email}?subject=${encodeURIComponent(
      `SeekSmart beta feedback: ${area}`
    )}&body=${encodeURIComponent(body)}`;
  }

  return (
    <form
      className="surface grid gap-6 p-6 shadow-[0_30px_70px_-40px_rgb(14_14_16/0.35)] md:p-10"
      onSubmit={handleSubmit}
    >
      <div>
        <span className="field-label" id="feedback-area">
          What did you test?
        </span>
        <div aria-labelledby="feedback-area" className="segmented mt-1 flex w-full flex-wrap sm:w-auto" role="radiogroup">
          {areas.map((item) => {
            const isActive = item === area;

            return (
              <button
                aria-checked={isActive}
                className="segmented-item flex-1 sm:flex-none"
                data-active={isActive}
                key={item}
                onClick={() => setArea(item)}
                role="radio"
                type="button"
              >
                {isActive ? (
                  <motion.span
                    className="segmented-pill"
                    layoutId="feedback-area-pill"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                ) : null}
                {item}
              </button>
            );
          })}
        </div>
      </div>
      <label className="block">
        <span className="field-label">What worked</span>
        <textarea className="field min-h-24" name="worked" placeholder="Optional" />
      </label>
      <label className="block">
        <span className="field-label">What felt unclear</span>
        <textarea className="field min-h-24" name="unclear" required />
      </label>
      <label className="block">
        <span className="field-label">What you would change</span>
        <textarea className="field min-h-24" name="change" placeholder="Optional" />
      </label>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button className="btn btn-primary btn-lg" type="submit">
          Open in email
          <ArrowRight aria-hidden="true" size={18} />
        </button>
        <a className="text-sm text-ink/50 underline decoration-ink/20 underline-offset-4 hover:text-ink" href={`mailto:${email}`}>
          {email}
        </a>
      </div>
    </form>
  );
}
