"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import type { Route } from "next";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Loader2, Search, X } from "lucide-react";
import { motion } from "motion/react";
import type { PricingType, PublicCategory } from "@/shared/domain";

type ToolFilterBarProps = {
  categories: PublicCategory[];
  initialCategory?: string;
  initialPricing?: PricingType;
  initialQuery?: string;
};

const searchDelayMs = 260;

const pricingOptions: Array<{ label: string; value: "" | PricingType }> = [
  { label: "All", value: "" },
  { label: "Free", value: "FREE" },
  { label: "Freemium", value: "FREEMIUM" },
  { label: "Paid", value: "PAID" }
];

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
  // Optimistic copies so chips and the segmented pill respond instantly while
  // the server re-renders the results.
  const [category, setCategory] = useState(initialCategory ?? "");
  const [pricing, setPricing] = useState<string>(initialPricing ?? "");
  const chipScroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(initialQuery ?? "");
  }, [initialQuery]);

  useEffect(() => {
    setCategory(initialCategory ?? "");
  }, [initialCategory]);

  useEffect(() => {
    setPricing(initialPricing ?? "");
  }, [initialPricing]);

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

  // Bring a pre-selected category chip into view without scrolling the page.
  useEffect(() => {
    const scroller = chipScroller.current;
    const active = scroller?.querySelector<HTMLElement>('[data-active="true"]');
    if (!scroller || !active) return;
    const offset = active.offsetLeft - scroller.clientWidth / 2 + active.clientWidth / 2;
    scroller.scrollLeft = Math.max(0, offset);
    // Only on mount: later selections are already in view.
  }, []);

  function chooseCategory(value: string) {
    setCategory(value);
    updateFilters(currentParams, pathname, router, startTransition, {
      category: value,
      q: query
    });
  }

  function choosePricing(value: string) {
    setPricing(value);
    updateFilters(currentParams, pathname, router, startTransition, {
      pricing: value,
      q: query
    });
  }

  return (
    <div className="grid gap-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <label className="search-field min-w-0 flex-1">
          <Search aria-hidden="true" size={19} />
          <input
            aria-label="Search tools"
            className="field pr-14"
            name="q"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search tools or workflows"
            type="search"
            value={query}
          />
          <span className="absolute right-2 flex h-10 w-10 items-center justify-center">
            {isPending ? (
              <Loader2 aria-hidden="true" className="animate-spin text-ink/45" size={17} />
            ) : query ? (
              <button
                aria-label="Clear search"
                className="flex h-10 w-10 items-center justify-center rounded-full text-ink/45 transition-colors hover:bg-ink/[0.06] hover:text-ink"
                onClick={() => setQuery("")}
                type="button"
              >
                <X aria-hidden="true" size={17} />
              </button>
            ) : null}
          </span>
        </label>

        <div aria-label="Pricing" className="segmented self-start md:self-auto" role="radiogroup">
          {pricingOptions.map((option) => {
            const active = pricing === option.value;
            return (
              <button
                aria-checked={active}
                className="segmented-item"
                data-active={active}
                key={option.label}
                onClick={() => choosePricing(option.value)}
                role="radio"
                type="button"
              >
                {active ? (
                  <motion.span
                    className="segmented-pill"
                    layoutId="tools-pricing-pill"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                ) : null}
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      <div
        className="-mx-[clamp(1rem,4vw,2.5rem)] overflow-x-auto px-[clamp(1rem,4vw,2.5rem)] pb-1 [mask-image:linear-gradient(90deg,transparent,black_1rem,black_calc(100%-3rem),transparent)] [scrollbar-width:none] lg:mx-0 lg:px-0 lg:[mask-image:linear-gradient(90deg,black_calc(100%-4rem),transparent)] [&::-webkit-scrollbar]:hidden"
        ref={chipScroller}
      >
        <div aria-label="Category" className="flex w-max gap-2 pr-10" role="group">
          <button
            aria-pressed={category === ""}
            className="chip"
            data-active={category === ""}
            onClick={() => chooseCategory("")}
            type="button"
          >
            All categories
          </button>
          {categories.map((item) => (
            <button
              aria-pressed={category === item.slug}
              className="chip"
              data-active={category === item.slug}
              key={item.id}
              onClick={() => chooseCategory(category === item.slug ? "" : item.slug)}
              type="button"
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>

      <span aria-live="polite" className="sr-only">
        {isPending ? "Updating results" : ""}
      </span>
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
