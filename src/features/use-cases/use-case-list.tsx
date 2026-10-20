"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Search, X } from "lucide-react";
import type { PublicUseCaseSummary } from "@/server/use-cases/queries";
import { formatLevel, levelRank } from "@/features/opportunities/ease";
import { LevelTag } from "@/features/use-cases/level-tag";

type UseCaseListProps = {
  useCases: PublicUseCaseSummary[];
};

const levels = ["all", "LOW", "MEDIUM", "HIGH"] as const;
const ease = [0.22, 1, 0.36, 1] as const;

export function UseCaseList({ useCases }: UseCaseListProps) {
  const [query, setQuery] = useState("");
  const [functionSlug, setFunctionSlug] = useState("all");
  const [effortLevel, setEffortLevel] = useState("all");
  const [riskLevel, setRiskLevel] = useState("all");

  const businessFunctions = useMemo(() => {
    const uniqueFunctions = new Map<string, { name: string; slug: string; count: number }>();

    for (const useCase of useCases) {
      if (useCase.businessFunction) {
        const existing = uniqueFunctions.get(useCase.businessFunction.slug);
        uniqueFunctions.set(useCase.businessFunction.slug, {
          ...useCase.businessFunction,
          count: (existing?.count ?? 0) + 1
        });
      }
    }

    return Array.from(uniqueFunctions.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [useCases]);

  // /use-cases#sales (linked from /business-functions) preselects a team.
  useEffect(() => {
    const hash = decodeURIComponent(window.location.hash.replace(/^#/, ""));
    if (hash && businessFunctions.some((item) => item.slug === hash)) {
      setFunctionSlug(hash);
    }
  }, [businessFunctions]);

  const filteredUseCases = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return useCases.filter((useCase) => {
      const matchesFunction =
        functionSlug === "all" || useCase.businessFunction?.slug === functionSlug;
      const matchesEffort = effortLevel === "all" || useCase.effortLevel === effortLevel;
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

  // Group by team so a long list reads as short lists.
  const groups = useMemo(() => {
    const byFunction = new Map<string, { name: string; slug: string; items: PublicUseCaseSummary[] }>();

    for (const useCase of filteredUseCases) {
      const name = useCase.businessFunction?.name ?? "Other workflows";
      const slug = useCase.businessFunction?.slug ?? "other";
      const group = byFunction.get(slug) ?? { name, slug, items: [] };
      group.items.push(useCase);
      byFunction.set(slug, group);
    }

    return Array.from(byFunction.values())
      .sort((left, right) => left.name.localeCompare(right.name))
      .map((group) => ({
        ...group,
        items: [...group.items].sort(
          (a, b) =>
            levelRank(a.effortLevel) - levelRank(b.effortLevel) ||
            levelRank(a.riskLevel) - levelRank(b.riskLevel) ||
            a.name.localeCompare(b.name)
        )
      }));
  }, [filteredUseCases]);

  const hasActiveFilters = Boolean(
    query.trim() || functionSlug !== "all" || effortLevel !== "all" || riskLevel !== "all"
  );

  function clearFilters() {
    setQuery("");
    setFunctionSlug("all");
    setEffortLevel("all");
    setRiskLevel("all");
  }

  return (
    <div>
      {/* ---------- Toolbar ---------- */}
      <div className="grid gap-4">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto_auto] lg:items-center">
          <label className="search-field">
            <Search aria-hidden="true" size={18} />
            <input
              aria-label="Search workflows"
              className="field pr-12"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search workflows or outcomes"
              type="search"
              value={query}
            />
            {query ? (
              <button
                aria-label="Clear search"
                className="icon-button absolute right-2 h-10 w-10"
                onClick={() => setQuery("")}
                type="button"
              >
                <X aria-hidden="true" size={16} />
              </button>
            ) : null}
          </label>
          <LevelControl id="effort" label="Effort" onChange={setEffortLevel} value={effortLevel} />
          <LevelControl id="risk" label="Risk" onChange={setRiskLevel} value={riskLevel} />
        </div>

        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden">
          <button
            className="chip shrink-0"
            data-active={functionSlug === "all"}
            onClick={() => setFunctionSlug("all")}
            type="button"
          >
            All teams
          </button>
          {businessFunctions.map((businessFunction) => (
            <button
              className="chip shrink-0"
              data-active={functionSlug === businessFunction.slug}
              key={businessFunction.slug}
              onClick={() =>
                setFunctionSlug(functionSlug === businessFunction.slug ? "all" : businessFunction.slug)
              }
              type="button"
            >
              {businessFunction.name}
              <span className="font-mono text-[0.7rem] opacity-50">{businessFunction.count}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-ink/10 pt-4 text-sm">
          <p aria-live="polite" className="font-mono text-ink/55">
            <span className="text-ink">{filteredUseCases.length}</span> / {useCases.length} workflows
          </p>
          {hasActiveFilters ? (
            <button className="link-underline text-ink/70" onClick={clearFilters} type="button">
              Clear filters
              <X aria-hidden="true" size={14} />
            </button>
          ) : (
            <p className="hidden items-center gap-4 text-ink/45 sm:flex">
              <span>Effort: work to launch</span>
              <span>Risk: cost of a mistake</span>
            </p>
          )}
        </div>
      </div>

      {/* ---------- Groups ---------- */}
      <div className="mt-10 md:mt-14">
        <AnimatePresence initial={false} mode="popLayout">
          {groups.length > 0 ? (
            groups.map((group) => (
              <motion.section
                animate={{ opacity: 1 }}
                className="mb-14 scroll-mt-28 md:mb-20"
                exit={{ opacity: 0 }}
                id={group.slug}
                initial={{ opacity: 0 }}
                key={group.slug}
                layout="position"
                transition={{ duration: 0.4, ease }}
              >
                <div className="mb-4 flex items-end justify-between gap-4 md:mb-6">
                  <h2 className="font-display text-[2rem] font-bold leading-none tracking-[-0.04em] md:text-[3rem]">
                    {group.name}
                  </h2>
                  <span className="pb-1 font-mono text-sm text-ink/40">
                    {String(group.items.length).padStart(2, "0")}
                  </span>
                </div>
                <ul className="row-list">
                  <AnimatePresence initial={false}>
                    {group.items.map((useCase) => (
                      <motion.li
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        initial={{ opacity: 0, y: 12 }}
                        key={useCase.id}
                        layout="position"
                        transition={{ duration: 0.35, ease }}
                      >
                        <UseCaseRow useCase={useCase} />
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              </motion.section>
            ))
          ) : (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="border-y border-ink/10 py-16 text-center"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0, y: 12 }}
              key="empty"
            >
              <p className="h3">No workflows match.</p>
              <button className="btn btn-ghost mt-6" onClick={clearFilters} type="button">
                Clear filters
                <X aria-hidden="true" size={15} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function UseCaseRow({ useCase }: { useCase: PublicUseCaseSummary }) {
  const outcome =
    useCase.outcome ?? useCase.description ?? `AI tools and guidance for ${useCase.name.toLowerCase()}.`;

  return (
    <Link
      className="row-item group grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-3 py-5 md:grid-cols-[minmax(0,1fr)_14.5rem_6rem_5.5rem_auto] md:gap-x-6 md:py-6"
      href={`/use-cases/${useCase.slug}`}
    >
      <span className="min-w-0">
        <span className="block font-display text-[1.3rem] font-semibold leading-tight tracking-[-0.025em] transition-transform duration-500 ease-out group-hover:translate-x-1.5 md:text-[1.5rem]">
          {useCase.name}
        </span>
        <span className="mt-1 block text-[0.95rem] text-ink/55 md:line-clamp-1">{outcome}</span>
      </span>
      <span className="col-span-2 row-start-2 flex flex-wrap items-center gap-1.5 md:col-span-1 md:col-start-2 md:row-start-1">
        <LevelTag label="effort" level={useCase.effortLevel} />
        <LevelTag label="risk" level={useCase.riskLevel} />
        <span className="ml-1 font-mono text-xs text-ink/50 md:hidden">
          {useCase.timeToValue ? `${useCase.timeToValue} · ` : ""}
          {useCase.toolCount} tools
        </span>
      </span>
      <span className="hidden text-right font-mono text-sm text-ink/60 md:block">
        {useCase.timeToValue ?? "-"}
      </span>
      <span className="hidden text-right font-mono text-sm md:block">
        <span className="text-ink">{useCase.toolCount}</span>
        <span className="text-ink/40"> tools</span>
      </span>
      <span className="row-arrow col-start-2 row-start-1 md:col-start-5">
        <ArrowRight aria-hidden="true" size={16} />
      </span>
    </Link>
  );
}

function LevelControl({
  id,
  label,
  onChange,
  value
}: {
  id: string;
  label: string;
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-12 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-ink/45 lg:w-auto">
        {label}
      </span>
      <div aria-label={`Filter by ${label.toLowerCase()}`} className="segmented" role="group">
        {levels.map((level) => {
          const active = value === level;
          return (
            <button
              aria-pressed={active}
              className="segmented-item"
              data-active={active}
              key={level}
              onClick={() => onChange(level)}
              type="button"
            >
              {active ? (
                <motion.span
                  className="segmented-pill"
                  layoutId={`${id}-pill`}
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              ) : null}
              {level === "all" ? "Any" : formatLevel(level)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
