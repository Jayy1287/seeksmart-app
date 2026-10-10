"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Clock3,
  Search,
  SlidersHorizontal,
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

  // Group by team so a 59-item list reads as ten short lists.
  const groups = useMemo(() => {
    const byFunction = new Map<string, PublicUseCaseSummary[]>();

    for (const useCase of filteredUseCases) {
      const key = useCase.businessFunction?.name ?? "Other workflows";
      byFunction.set(key, [...(byFunction.get(key) ?? []), useCase]);
    }

    return Array.from(byFunction.entries())
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([name, items]) => ({
        name,
        items: [...items].sort(
          (a, b) =>
            levelRank(a.effortLevel) - levelRank(b.effortLevel) ||
            levelRank(a.riskLevel) - levelRank(b.riskLevel) ||
            a.name.localeCompare(b.name)
        )
      }));
  }, [filteredUseCases]);

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
    <div className="space-y-6">
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

      {groups.length > 0 ? (
        <div className="grid gap-8">
          {groups.map((group) => (
            <section key={group.name}>
              <div className="flex items-baseline justify-between gap-4 border-b border-line/60 pb-2">
                <h3 className="text-lg font-semibold">{group.name}</h3>
                <span className="text-xs font-bold uppercase text-ink/45">
                  {group.items.length} workflow{group.items.length === 1 ? "" : "s"}
                </span>
              </div>
              <ul className="divide-y divide-line/50">
                {group.items.map((useCase) => (
                  <li key={useCase.id}>
                    <Link
                      className="use-case-row group"
                      href={`/use-cases/${useCase.slug}`}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-ink transition group-hover:text-accent">
                          {useCase.name}
                        </p>
                        <p className="mt-1 line-clamp-2 text-sm leading-6 text-ink/60">
                          {useCase.outcome ??
                            useCase.description ??
                            `AI tools and guidance for ${useCase.name.toLowerCase()}.`}
                        </p>
                      </div>
                      <div className="use-case-row-meta">
                        <LevelPill label="effort" level={useCase.effortLevel} />
                        <LevelPill label="risk" level={useCase.riskLevel} />
                        {useCase.timeToValue ? (
                          <span className="status-pill">
                            <Clock3 aria-hidden="true" size={12} />
                            {useCase.timeToValue}
                          </span>
                        ) : null}
                        <span className="status-pill">{useCase.toolCount} tools</span>
                      </div>
                      <ArrowRight
                        aria-hidden="true"
                        className="hidden shrink-0 text-accent transition group-hover:translate-x-0.5 sm:block"
                        size={16}
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
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

function LevelPill({ label, level }: { label: string; level: string }) {
  return (
    <span className="status-pill" data-level={level.toLowerCase()}>
      {formatLevel(level)} {label}
    </span>
  );
}

function formatLevel(value: string) {
  return value.charAt(0) + value.slice(1).toLowerCase();
}

function levelRank(value: string) {
  return value === "LOW" ? 0 : value === "MEDIUM" ? 1 : 2;
}
