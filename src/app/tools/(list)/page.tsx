import type { Metadata } from "next";
import type { UrlObject } from "node:url";
import Link from "next/link";
import { ArrowLeft, ArrowRight, SearchX } from "lucide-react";
import { listToolsQuerySchema } from "@/lib/validation";
import { listCategories } from "@/server/categories/queries";
import { searchPublishedTools } from "@/server/tools/queries";
import { ToolFilterBar } from "@/features/tools/tool-filter-bar";
import { ToolList, formatPricing } from "@/features/tools/tool-row";
import { AnimatedNumber } from "@/components/motion/animated-number";
import { Reveal } from "@/components/motion/reveal";
import { SplitReveal } from "@/components/motion/split-reveal";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "AI Tool Directory",
  description:
    "Browse curated AI tools once you know the workflow you want to improve.",
  alternates: {
    canonical: "/tools"
  },
  openGraph: {
    title: "AI Tool Directory",
    description:
      "Browse curated AI tools once you know the workflow you want to improve.",
    url: "/tools",
    type: "website"
  }
};

type ToolsPageProps = {
  searchParams: Promise<{
    q?: string;
    category?: string;
    pricing?: "FREE" | "PAID" | "FREEMIUM";
    page?: string;
  }>;
};

export default async function ToolsPage({ searchParams }: ToolsPageProps) {
  const rawParams = await searchParams;
  const params = listToolsQuerySchema.parse(rawParams);
  const [result, categories] = await Promise.all([
    searchPublishedTools({
      query: params.q,
      categorySlug: params.category,
      pricingType: params.pricing,
      page: params.page,
      limit: params.limit
    }),
    listCategories()
  ]);
  const tools = result.tools;
  const activeCategory = categories.find(
    (category) => category.slug === params.category
  );
  const activeFilters = [
    params.q ? `“${params.q}”` : null,
    activeCategory?.name ?? null,
    params.pricing ? formatPricing(params.pricing) : null
  ].filter((value): value is string => Boolean(value));
  const startResult =
    result.total === 0 ? 0 : (result.page - 1) * result.limit + 1;
  const endResult = Math.min(result.page * result.limit, result.total);

  return (
    <main>
      <section className="app-container page-hero">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div>
            <Reveal y={12}>
              <p className="eyebrow">Tool directory</p>
            </Reveal>
            <SplitReveal
              className="h1 mt-6"
              delay={0.05}
              lines={[["Every tool,"], [{ text: "scored and priced.", className: "ghost-word" }]]}
            />
            <Reveal delay={0.35} y={16}>
              <p className="lead mt-6">Filter by the job, the budget, or the name.</p>
            </Reveal>
          </div>
          <Reveal className="shrink-0 md:text-right" delay={0.3} y={16}>
            <p className="stat-number text-[clamp(3.5rem,8vw,6rem)]">
              <AnimatedNumber value={result.total} />
            </p>
            <p className="mt-2 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-ink/50">
              {activeFilters.length > 0 ? "Matching tools" : "Tools listed"}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="app-container pb-24 md:pb-32">
        <Reveal delay={0.2} y={16}>
          <ToolFilterBar
            categories={categories}
            initialCategory={params.category}
            initialPricing={params.pricing}
            initialQuery={params.q}
          />
        </Reveal>

        <div className="mb-6 mt-10 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-sm md:mt-14">
          <p className="text-ink/55">
            {tools.length > 0 ? (
              <>
                <span className="font-mono tabular text-ink">
                  {startResult}&ndash;{endResult}
                </span>{" "}
                of <span className="font-mono tabular text-ink">{result.total}</span>
              </>
            ) : (
              "No results"
            )}
            {activeFilters.length > 0 ? (
              <span className="text-ink/45"> &middot; {activeFilters.join(" · ")}</span>
            ) : null}
          </p>
          {activeFilters.length > 0 ? (
            <Link className="link-underline text-ink/70 hover:text-ink" href="/tools">
              Clear filters
            </Link>
          ) : null}
        </div>

        {tools.length > 0 ? (
          <>
            <ToolList tools={tools} />
            <Pagination
              currentPage={result.page}
              hasNextPage={result.hasNextPage}
              hasPreviousPage={result.hasPreviousPage}
              params={params}
              totalPages={result.totalPages}
            />
          </>
        ) : (
          <Reveal className="empty-state" y={16}>
            <span className="empty-state-icon">
              <SearchX aria-hidden="true" size={22} />
            </span>
            <h2 className="empty-state-title">Nothing matches that.</h2>
            <p className="empty-state-copy">Drop a filter or try a broader word.</p>
            <div className="empty-state-actions">
              <Link className="btn btn-primary" href="/tools">
                Clear filters
              </Link>
              <Link className="btn btn-ghost" href="/audit/questions">
                Run the audit
              </Link>
            </div>
          </Reveal>
        )}
      </section>
    </main>
  );
}

type PaginationProps = {
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  params: {
    q?: string;
    category?: string;
    pricing?: "FREE" | "PAID" | "FREEMIUM";
    limit: number;
  };
  totalPages: number;
};

function Pagination({
  currentPage,
  hasNextPage,
  hasPreviousPage,
  params,
  totalPages
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = pageWindow(currentPage, totalPages);

  return (
    <nav
      aria-label="Tool results pagination"
      className="mt-12 flex items-center justify-between gap-4"
    >
      {hasPreviousPage ? (
        <Link
          aria-label="Previous page"
          className="btn btn-ghost"
          href={buildToolsHref(params, currentPage - 1)}
        >
          <ArrowLeft aria-hidden="true" size={16} />
          <span className="hidden sm:inline">Previous</span>
        </Link>
      ) : (
        <span aria-hidden="true" className="btn btn-ghost pointer-events-none opacity-35">
          <ArrowLeft size={16} />
          <span className="hidden sm:inline">Previous</span>
        </span>
      )}

      <ol className="flex items-center gap-1 font-mono text-sm tabular">
        {pages.map((page, index) =>
          page === null ? (
            <li aria-hidden="true" className="px-1 text-ink/35" key={`gap-${index}`}>
              &hellip;
            </li>
          ) : (
            <li key={page}>
              {page === currentPage ? (
                <span
                  aria-current="page"
                  className="flex h-10 min-w-10 items-center justify-center rounded-full bg-ink px-3 text-paper"
                >
                  {page}
                </span>
              ) : (
                <Link
                  aria-label={`Page ${page}`}
                  className="flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-ink/55 transition-colors hover:bg-ink/[0.06] hover:text-ink"
                  href={buildToolsHref(params, page)}
                >
                  {page}
                </Link>
              )}
            </li>
          )
        )}
      </ol>

      {hasNextPage ? (
        <Link
          aria-label="Next page"
          className="btn btn-primary"
          href={buildToolsHref(params, currentPage + 1)}
        >
          <span className="hidden sm:inline">Next</span>
          <ArrowRight aria-hidden="true" size={16} />
        </Link>
      ) : (
        <span aria-hidden="true" className="btn btn-ghost pointer-events-none opacity-35">
          <span className="hidden sm:inline">Next</span>
          <ArrowRight size={16} />
        </span>
      )}
    </nav>
  );
}

// First, last, and the pages around the current one; null marks a gap.
function pageWindow(current: number, total: number): Array<number | null> {
  const pages = new Set([1, total, current - 1, current, current + 1]);
  const sorted = [...pages].filter((page) => page >= 1 && page <= total).sort((a, b) => a - b);
  const result: Array<number | null> = [];

  for (const page of sorted) {
    const previous = result[result.length - 1];
    if (typeof previous === "number" && page - previous > 1) {
      result.push(null);
    }
    result.push(page);
  }

  return result;
}

function buildToolsHref(params: PaginationProps["params"], page: number) {
  const searchParams = new URLSearchParams();

  if (params.q) {
    searchParams.set("q", params.q);
  }

  if (params.category) {
    searchParams.set("category", params.category);
  }

  if (params.pricing) {
    searchParams.set("pricing", params.pricing);
  }

  if (page > 1) {
    searchParams.set("page", String(page));
  }

  return {
    pathname: "/tools",
    query: Object.fromEntries(searchParams)
  } satisfies UrlObject;
}
