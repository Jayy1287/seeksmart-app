"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { AnimatedNumber } from "@/components/motion/animated-number";
import type { AuditOpportunityRecommendation } from "@/shared/recommendations/audit";

const ease = [0.22, 1, 0.36, 1] as const;

// Ranked opportunities as rows. Each row opens to show why it ranked, and in
// the unlocked brief also the sub-scores, cautions and use-case paths.
export function AuditOpportunityRows({
  detailed,
  opportunities
}: {
  detailed: boolean;
  opportunities: AuditOpportunityRecommendation[];
}) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <ol className="row-list">
      {opportunities.map((opportunity, index) => {
        const isOpen = open === opportunity.id;
        const panelId = `opportunity-${opportunity.id}`;
        const top = index === 0;

        return (
          <motion.li
            className="border-b border-ink/[0.12]"
            initial={{ opacity: 0, y: 24 }}
            key={opportunity.id}
            transition={{ delay: index * 0.08, duration: 0.75, ease }}
            viewport={{ once: true, margin: "100000px 0px -48px 0px" }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <button
              aria-controls={panelId}
              aria-expanded={isOpen}
              className="group relative grid w-full grid-cols-[2.75rem_minmax(0,1fr)_auto] items-start gap-x-4 gap-y-4 py-6 text-left md:grid-cols-[5rem_minmax(0,1fr)_13rem_auto] md:items-center md:gap-x-8 md:py-8"
              onClick={() => setOpen(isOpen ? null : opportunity.id)}
              type="button"
            >
              <span
                className={`stat-number pt-1 text-[2.25rem] md:pt-0 md:text-[3.5rem] ${
                  top ? "text-signal" : "text-ink/20"
                }`}
              >
                0{index + 1}
              </span>
              <span className="min-w-0">
                <span className="flex flex-wrap items-center gap-2">
                  <span className={`tag ${top ? "tag-signal" : ""}`}>{opportunity.fitLabel}</span>
                  {opportunity.businessFunctionName ? (
                    <span className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-ink/40">
                      {opportunity.businessFunctionName}
                    </span>
                  ) : null}
                </span>
                <span className="mt-3 block font-display text-[1.45rem] font-bold leading-[1.05] tracking-[-0.035em] transition-transform duration-500 ease-out group-hover:translate-x-1 md:text-[2.1rem]">
                  {opportunity.name}
                </span>
                {opportunity.expectedBenefit ?? opportunity.description ? (
                  <span className="mt-2 block max-w-2xl text-ink/55">
                    {opportunity.expectedBenefit ?? opportunity.description}
                  </span>
                ) : null}
              </span>
              <span className="col-span-2 col-start-2 row-start-2 flex items-center gap-4 md:col-span-1 md:col-start-3 md:row-start-1 md:block">
                <span className="flex items-baseline gap-1.5 md:justify-end">
                  <span className="font-mono text-2xl font-medium tabular md:text-3xl">
                    <AnimatedNumber value={opportunity.score} />
                  </span>
                  <span className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-ink/40">
                    fit
                  </span>
                </span>
                <Meter className="flex-1 md:mt-3" signal={top} value={opportunity.score} />
              </span>
              <span
                aria-hidden="true"
                className={`row-arrow col-start-3 row-start-1 transition-all duration-300 md:col-start-4 ${
                  isOpen ? "rotate-180 border-ink bg-ink text-paper" : "group-hover:border-ink/40"
                }`}
              >
                <ChevronDown size={16} />
              </span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  animate={{ height: "auto", opacity: 1 }}
                  className="overflow-hidden"
                  exit={{ height: 0, opacity: 0 }}
                  id={panelId}
                  initial={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.45, ease }}
                >
                  <OpportunityDetail detailed={detailed} opportunity={opportunity} />
                </motion.div>
              ) : null}
            </AnimatePresence>
          </motion.li>
        );
      })}
    </ol>
  );
}

function OpportunityDetail({
  detailed,
  opportunity
}: {
  detailed: boolean;
  opportunity: AuditOpportunityRecommendation;
}) {
  const reasons = detailed ? opportunity.reasons : opportunity.reasons.slice(0, 3);

  return (
    <div className="grid gap-10 pb-10 md:ml-[7rem] md:grid-cols-2 md:gap-12">
      <div>
        <p className="eyebrow eyebrow-plain">Why it ranked</p>
        <ul className="mt-4 grid gap-3">
          {reasons.map((reason) => (
            <li className="flex gap-3 text-[0.97rem] leading-relaxed text-ink/75" key={reason}>
              <span aria-hidden="true" className="mt-[0.6rem] h-1.5 w-1.5 shrink-0 rounded-full bg-signal" />
              {reason}
            </li>
          ))}
        </ul>
        {opportunity.startingPoint ? (
          <p className="mt-6 text-[0.97rem] leading-relaxed">
            <span className="font-medium">Start by: </span>
            <span className="text-ink/65">{opportunity.startingPoint}</span>
          </p>
        ) : null}
      </div>

      <div className="grid content-start gap-8">
        {detailed ? (
          <dl className="grid grid-cols-2 gap-x-6 gap-y-5">
            {[
              { label: "Impact", value: opportunity.impactScore },
              { label: "Effort fit", value: opportunity.effortScore },
              { label: "Risk fit", value: opportunity.riskScore },
              { label: "Confidence", value: opportunity.confidenceScore }
            ].map((item) => (
              <div key={item.label}>
                <div className="flex items-baseline justify-between gap-2">
                  <dt className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-ink/45">
                    {item.label}
                  </dt>
                  <dd className="font-mono text-sm tabular">{item.value}</dd>
                </div>
                <Meter className="mt-2" value={item.value} />
              </div>
            ))}
          </dl>
        ) : null}

        <dl className="grid grid-cols-3 gap-4 border-t border-ink/10 pt-5">
          {[
            { label: "Effort", value: formatLevel(opportunity.effortLevel) },
            { label: "Risk", value: formatLevel(opportunity.riskLevel) },
            { label: "Payback", value: opportunity.timeToValue ?? "Varies" }
          ].map((item) => (
            <div key={item.label}>
              <dt className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-ink/45">
                {item.label}
              </dt>
              <dd className="mt-1 font-medium">{item.value}</dd>
            </div>
          ))}
        </dl>

        {detailed && opportunity.cautions.length > 0 ? (
          <div className="border-l-2 border-signal pl-4">
            <p className="text-sm font-medium text-accent">Review before piloting</p>
            <ul className="mt-2 grid gap-1 text-sm leading-relaxed text-ink/65">
              {opportunity.cautions.map((caution) => (
                <li key={caution}>{caution}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {detailed && opportunity.useCases.length > 0 ? (
          <div>
            <p className="eyebrow eyebrow-plain">Use-case paths</p>
            <ul className="mt-3 grid gap-1">
              {opportunity.useCases.map((useCase) => (
                <li key={useCase.id}>
                  <Link
                    className="group/link flex items-center justify-between gap-3 rounded-xl py-2 text-[0.97rem] font-medium transition-colors hover:text-accent"
                    href={`/use-cases/${useCase.slug}`}
                  >
                    <span className="min-w-0 truncate">{useCase.name}</span>
                    <ArrowUpRight
                      aria-hidden="true"
                      className="shrink-0 transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
                      size={16}
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function Meter({
  className,
  light = false,
  signal = false,
  value
}: {
  className?: string;
  light?: boolean;
  signal?: boolean;
  value: number;
}) {
  return (
    <span
      aria-hidden="true"
      className={`relative block h-1 overflow-hidden rounded-full ${
        light ? "bg-white/10" : "bg-ink/[0.08]"
      } ${className ?? ""}`}
    >
      <motion.span
        className={`absolute inset-y-0 left-0 rounded-full ${
          signal ? "bg-signal" : light ? "bg-white/60" : "bg-ink"
        }`}
        initial={{ width: "0%" }}
        transition={{ duration: 1.1, ease, delay: 0.15 }}
        viewport={{ once: true, margin: "100000px 0px -48px 0px" }}
        whileInView={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </span>
  );
}

function formatLevel(value: string) {
  return value.charAt(0) + value.slice(1).toLowerCase();
}
