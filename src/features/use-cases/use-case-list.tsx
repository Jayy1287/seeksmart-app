"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Clock3,
  Gauge,
  Search,
  ShieldAlert,
  SlidersHorizontal,
  Workflow,
  X
} from "lucide-react";
import type { PublicUseCaseSummary } from "@/server/use-cases/queries";

type UseCaseListProps = {
  useCases: PublicUseCaseSummary[];
};

export function UseCaseList({ useCases }: UseCaseListProps) {
  const [query, setQuery] = useState("");
  const [functionSlug, setFunctionSlug] = useState("all");
  const [effortLevel, setEffortLevel] = useState("all");
  const [riskLevel, setRiskLevel] = useState("all");

  const businessFunctions = useMemo(() => {
    const uniqueFunctions = new Map<string, { name: string; slug: string }>();

    for (const useCase of useCases) {
      if (useCase.businessFunction) {
        uniqueFunctions.set(
          useCase.businessFunction.slug,
          useCase.businessFunction
        );
      }
    }

    return Array.from(uniqueFunctions.values()).sort((functionA, functionB) =>
      functionA.name.localeCompare(functionB.name)
    );
  }, [useCases]);

  const filteredUseCases = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return useCases.filter((useCase) => {
      const matchesFunction =
        functionSlug === "all" ||
        useCase.businessFunction?.slug === functionSlug;
      const matchesEffort =
        effortLevel === "all" || useCase.effortLevel === effortLevel;
      const matchesRisk = riskLevel === "all" || useCase.riskLevel === riskLevel;
      const searchableText = [
        useCase.name,
        useCase.description,
        useCase.outcome,
        useCase.timeToValue,
        useCase.businessFunction?.name,
        formatLevel(useCase.effortLevel),
        formatLevel(useCase.riskLevel)
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return (
        matchesFunction &&
        matchesEffort &&
        matchesRisk &&
        (!normalizedQuery || searchableText.includes(normalizedQuery))
      );
    });
  }, [effortLevel, functionSlug, query, riskLevel, useCases]);

  const hasActiveFilters = Boolean(
    query.trim() ||
      functionSlug !== "all" ||
      effortLevel !== "all" ||
      riskLevel !== "all"
  );

  function clearFilters() {
    setQuery("");
    setFunctionSlug("all");
    setEffortLevel("all");
    setRiskLevel("all");
  }

  return (
    <div className="space-y-5">
      <div className="rounded-[1.55rem] border border-line/60 bg-white/85 p-4 shadow-[0_22px_60px_rgb(8_126_139/0.1)] backdrop-blur">
        <div className="grid gap-3 lg:grid-cols-[minmax(16rem,1fr)_auto_auto_auto] lg:items-center">
          <label className="relative block">
            <Search
              aria-hidden="true"
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/42"
              size={18}
            />
            <input
              aria-label="Search workflows"
              className="control-field min-h-12 w-full pl-11 pr-11"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search workflows, outcomes, or teams"
              type="search"
              value={query}
            />
            {query ? (
              <button
                aria-label="Clear workflow search"
                className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-ink/45 transition hover:bg-accent/10 hover:text-accent"
                onClick={() => setQuery("")}
                type="button"
              >
                <X aria-hidden="true" size={16} />
              </button>
            ) : null}
          </label>

          <label className="relative block">
            <span className="sr-only">Filter by effort</span>
            <select
              className="control-field min-h-12 w-full min-w-36 lg:w-40"
              onChange={(event) => setEffortLevel(event.target.value)}
              value={effortLevel}
            >
              <option value="all">Any effort</option>
              <option value="LOW">Low effort</option>
              <option value="MEDIUM">Medium effort</option>
              <option value="HIGH">High effort</option>
            </select>
          </label>

          <label className="relative block">
            <span className="sr-only">Filter by risk</span>
            <select
              className="control-field min-h-12 w-full min-w-36 lg:w-40"
              onChange={(event) => setRiskLevel(event.target.value)}
              value={riskLevel}
            >
              <option value="all">Any risk</option>
              <option value="LOW">Low risk</option>
              <option value="MEDIUM">Medium risk</option>
              <option value="HIGH">High risk</option>
            </select>
          </label>

          <div className="flex min-h-12 items-center justify-between gap-3 rounded-2xl border border-line/60 bg-accent/10 px-4 text-sm font-semibold text-ink/68 lg:min-w-36">
            <span className="inline-flex items-center gap-2">
              <SlidersHorizontal aria-hidden="true" size={16} />
              {filteredUseCases.length} shown
            </span>
            {hasActiveFilters ? (
              <button
                aria-label="Clear workflow filters"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-ink/42 transition hover:bg-accent/10 hover:text-accent"
                onClick={clearFilters}
                type="button"
              >
                <X aria-hidden="true" size={16} />
              </button>
            ) : null}
          </div>
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto border-t border-line/50 pt-4">
          <button
            className="status-pill shrink-0 transition hover:border-accent hover:text-accent data-[active=true]:border-accent data-[active=true]:bg-accent/10 data-[active=true]:text-accent"
            data-active={functionSlug === "all"}
            onClick={() => setFunctionSlug("all")}
            type="button"
          >
            All teams
          </button>
          {businessFunctions.map((businessFunction) => (
            <button
              className="status-pill shrink-0 transition hover:border-accent hover:text-accent data-[active=true]:border-accent data-[active=true]:bg-accent/10 data-[active=true]:text-accent"
              data-active={functionSlug === businessFunction.slug}
              key={businessFunction.slug}
              onClick={() => setFunctionSlug(businessFunction.slug)}
              type="button"
            >
              {businessFunction.name}
            </button>
          ))}
        </div>
      </div>

      {filteredUseCases.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredUseCases.map((useCase, index) => (
            <article
              className="decision-card group flex min-h-[18rem] flex-col p-6"
              key={useCase.id}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="decision-card-icon">
                    <Workflow aria-hidden="true" size={18} />
                  </div>
                  <p className="decision-card-kicker mt-4">
                    Workflow {String(index + 1).padStart(2, "0")}
                  </p>
                  <h2 className="decision-card-title mt-2 text-xl transition group-hover:text-accent">
                    {useCase.name}
                  </h2>
                </div>
                <Link
                  aria-label={`View ${useCase.toolCount} mapped tools for ${useCase.name}`}
                  className="decision-card-stat shrink-0 transition hover:border-accent/45 hover:bg-accent/10 hover:text-accent focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-primary-light/25"
                  href={`/use-cases/${useCase.slug}#mapped-tools`}
                >
                  <strong>{useCase.toolCount}</strong>
                  <span>Tools</span>
                </Link>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {useCase.businessFunction ? (
                  <span className="status-pill">
                    {useCase.businessFunction.name}
                  </span>
                ) : null}
                {useCase.timeToValue ? (
                  <span className="status-pill">
                    <Clock3 aria-hidden="true" size={13} />
                    {useCase.timeToValue}
                  </span>
                ) : null}
              </div>
              <div className="decision-card-copy mt-4 flex-1 space-y-3 text-sm">
                <p>
                  {useCase.outcome ??
                    useCase.description ??
                    `Browse AI tools for ${useCase.name.toLowerCase()}.`}
                </p>
                <p className="rounded-r-xl border-l-2 border-signal/70 bg-signal/5 py-2 pl-3 pr-2 text-ink/62">
                  {buildSelectionCue(useCase)}
                </p>
              </div>
              <div className="decision-card-footer">
                <div className="grid grid-cols-2 gap-2 text-xs font-medium text-ink/55">
                  <span className="inline-flex items-center gap-1.5">
                    <Gauge
                      aria-hidden="true"
                      className="text-accent"
                      size={14}
                    />
                    {formatLevel(useCase.effortLevel)} effort
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <ShieldAlert
                      aria-hidden="true"
                      className="text-signal"
                      size={14}
                    />
                    {formatLevel(useCase.riskLevel)} risk
                  </span>
                </div>
                <Link
                  className="secondary-button mt-4 min-h-11 w-full justify-between border-accent/30 bg-accent/10 px-4 text-accent"
                  href={`/use-cases/${useCase.slug}`}
                >
                  View workflow
                  <ArrowRight aria-hidden="true" size={14} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-[1.35rem] border border-line/55 bg-white/85 p-8 text-center shadow-[0_18px_54px_rgb(8_126_139/0.08)]">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-line/60 bg-surface text-accent">
            <Search aria-hidden="true" size={20} />
          </div>
          <h3 className="mt-4 text-xl font-semibold">No workflows found</h3>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-ink/58">
            Try a broader search or clear one of the selected filters.
          </p>
          <button
            className="secondary-button mt-5"
            onClick={clearFilters}
            type="button"
          >
            Clear filters
            <X aria-hidden="true" size={15} />
          </button>
        </div>
      )}
    </div>
  );
}

function formatLevel(value: string) {
  return value.charAt(0) + value.slice(1).toLowerCase();
}

function buildSelectionCue(useCase: PublicUseCaseSummary) {
  const team = useCase.businessFunction?.name
    ? `the ${useCase.businessFunction.name} team`
    : "your team";
  const effort = formatLevel(useCase.effortLevel).toLowerCase();
  const risk = formatLevel(useCase.riskLevel).toLowerCase();
  const timing = useCase.timeToValue
    ? ` and you need a ${useCase.timeToValue} value window`
    : "";

  return `Choose this when ${team.toLowerCase()} needs a ${effort}-effort, ${risk}-risk workflow improvement${timing}.`;
}
