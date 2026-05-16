"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import type { Route } from "next";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { PricingType, PublicCategory } from "@/shared/domain";

type ToolFilterBarProps = {
  categories: PublicCategory[];
  initialCategory?: string;
  initialPricing?: PricingType;
  initialQuery?: string;
};

const searchDelayMs = 260;

export function ToolFilterBar({
  categories,
  initialCategory,
  initialPricing,
  initialQuery
}: ToolFilterBarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchParamString = searchParams.toString();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState(initialQuery ?? "");

  const categoryValue = initialCategory ?? "";
  const pricingValue = initialPricing ?? "";

  useEffect(() => {
    setQuery(initialQuery ?? "");
  }, [initialQuery]);

  const currentParams = useMemo(
    () => new URLSearchParams(searchParamString),
    [searchParamString]
  );

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      if ((currentParams.get("q") ?? "") === query.trim()) {
        return;
      }

      updateFilters(currentParams, pathname, router, startTransition, {
        q: query
      });
    }, searchDelayMs);

    return () => window.clearTimeout(timeout);
  }, [currentParams, pathname, query, router, startTransition]);

  return (
    <div className="tool-filter-shell">
      <div className="tool-filter-header">
        <span className="inline-flex items-center gap-2">
          <SlidersHorizontal aria-hidden="true" size={15} />
          Filters
        </span>
        <span aria-live="polite" className="min-h-5 text-xs text-ink/45">
          <AnimatePresence initial={false}>
            {isPending ? (
              <motion.span
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -3 }}
                initial={{ opacity: 0, y: 3 }}
                transition={{ duration: 0.16 }}
              >
                Updating results
              </motion.span>
            ) : null}
          </AnimatePresence>
        </span>
      </div>
      <div className="tool-filter-grid">
        <label className="filter-control filter-control-search">
          <span className="filter-label">Search</span>
          <span className="relative block">
            <Search
              aria-hidden="true"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40"
              size={18}
            />
            <input
              className="control-field w-full pl-10 pr-10"
              name="q"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Tool, category, workflow"
              type="search"
              value={query}
            />
            {query ? (
              <button
                aria-label="Clear search"
                className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-ink/45 transition hover:bg-accent/10 hover:text-accent"
                onClick={() => setQuery("")}
                type="button"
              >
                <X aria-hidden="true" size={16} />
              </button>
            ) : null}
          </span>
        </label>
        <label className="filter-control">
          <span className="filter-label">Category</span>
          <select
            className="control-field w-full"
            name="category"
            onChange={(event) =>
              updateFilters(currentParams, pathname, router, startTransition, {
                category: event.target.value,
                q: query
              })
            }
            value={categoryValue}
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <label className="filter-control">
          <span className="filter-label">Pricing</span>
          <select
            className="control-field w-full"
            name="pricing"
            onChange={(event) =>
              updateFilters(currentParams, pathname, router, startTransition, {
                pricing: event.target.value,
                q: query
              })
            }
            value={pricingValue}
          >
            <option value="">Any pricing</option>
            <option value="FREE">Free</option>
            <option value="FREEMIUM">Freemium</option>
            <option value="PAID">Paid</option>
          </select>
        </label>
      </div>
    </div>
  );
}

function updateFilters(
  currentParams: URLSearchParams,
  pathname: string,
  router: ReturnType<typeof useRouter>,
  startTransition: ReturnType<typeof useTransition>[1],
  updates: Record<string, string>
) {
  const nextParams = new URLSearchParams(currentParams);

  for (const [key, rawValue] of Object.entries(updates)) {
    const value = rawValue.trim();
    if (value) {
      nextParams.set(key, value);
    } else {
      nextParams.delete(key);
    }
  }

  nextParams.delete("page");
  const queryString = nextParams.toString();

  startTransition(() => {
    const href = (queryString ? `${pathname}?${queryString}` : pathname) as Route;
    router.replace(href, { scroll: false });
  });
}
