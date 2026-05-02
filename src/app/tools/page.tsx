import type { Metadata } from "next";
import type { UrlObject } from "node:url";
import Link from "next/link";
import { Search } from "lucide-react";
import { listToolsQuerySchema } from "@/lib/validation";
import { listCategories } from "@/server/categories/queries";
import { searchPublishedTools } from "@/server/tools/queries";
import { ToolCard } from "@/features/tools/tool-card";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "AI Tools",
  description: "Browse AI tools by category, pricing, and use case.",
  alternates: {
    canonical: "/tools"
  },
  openGraph: {
    title: "AI Tools",
    description: "Browse AI tools by category, pricing, and use case.",
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
  const activeCategory = categories.find(
    (category) => category.slug === params.category
  );
  const activeFilterCount = [
    params.q,
    params.category,
    params.pricing
  ].filter(Boolean).length;
  const startResult =
    result.total === 0 ? 0 : (result.page - 1) * result.limit + 1;
  const endResult = Math.min(result.page * result.limit, result.total);

  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
      <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium uppercase text-accent">Directory</p>
          <h1 className="mt-2 text-4xl font-semibold">AI tools</h1>
          <p className="mt-3 max-w-2xl text-ink/65">
            Browse curated tools by category, pricing, and fit.
          </p>
        </div>
        <div className="rounded-md border border-line bg-white px-4 py-3 text-sm text-ink/60">
          <span className="font-semibold text-ink">{result.total}</span>{" "}
          matching tools
        </div>
      </div>

      <form className="grid gap-3 rounded-md border border-line bg-white p-4 md:grid-cols-[1fr_180px_160px_auto]">
        <label className="relative">
          <span className="sr-only">Search tools</span>
          <Search
            aria-hidden="true"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40"
            size={18}
          />
          <input
            className="min-h-11 w-full rounded-md border border-line pl-10 pr-3 outline-none focus:border-accent"
            defaultValue={params.q}
            name="q"
            placeholder="Search tools"
            type="search"
          />
        </label>
        <label>
          <span className="sr-only">Category</span>
          <select
            className="min-h-11 w-full rounded-md border border-line bg-white px-3 outline-none focus:border-accent"
            defaultValue={params.category ?? ""}
            name="category"
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="sr-only">Pricing</span>
          <select
            className="min-h-11 w-full rounded-md border border-line bg-white px-3 outline-none focus:border-accent"
            defaultValue={params.pricing ?? ""}
            name="pricing"
          >
            <option value="">Any pricing</option>
            <option value="FREE">Free</option>
            <option value="FREEMIUM">Freemium</option>
            <option value="PAID">Paid</option>
          </select>
        </label>
        <button className="min-h-11 rounded-md bg-ink px-5 font-medium text-paper">
          Apply
        </button>
      </form>

      <div className="my-5 flex flex-col gap-3 text-sm md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {params.q ? <FilterChip label={`Search: ${params.q}`} /> : null}
          {activeCategory ? (
            <FilterChip label={`Category: ${activeCategory.name}`} />
          ) : null}
          {params.pricing ? (
            <FilterChip label={`Pricing: ${formatPricing(params.pricing)}`} />
          ) : null}
          {activeFilterCount === 0 ? (
            <span className="text-ink/55">Showing all published tools</span>
          ) : null}
        </div>
        {activeFilterCount > 0 ? (
          <Link className="font-medium text-accent" href="/tools">
            Reset filters
          </Link>
        ) : null}
      </div>

      {result.tools.length > 0 ? (
        <>
          <div className="mb-4 text-sm text-ink/55">
            Showing {startResult}-{endResult} of {result.total}
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {result.tools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
          <Pagination
            currentPage={result.page}
            hasNextPage={result.hasNextPage}
            hasPreviousPage={result.hasPreviousPage}
            params={params}
            totalPages={result.totalPages}
          />
        </>
      ) : (
        <div className="rounded-md border border-line bg-white p-8 text-center">
          <h2 className="font-semibold">No tools found</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-ink/60">
            No published tools match the current filters. Try a broader search
            or reset the filters to scan the full directory.
          </p>
          <Link
            className="mt-5 inline-flex min-h-11 items-center rounded-md bg-ink px-5 font-medium text-paper"
            href="/tools"
          >
            Reset filters
          </Link>
        </div>
      )}
    </main>
  );
}

function FilterChip({ label }: { label: string }) {
  return (
    <span className="rounded-md bg-accent/10 px-3 py-1.5 font-medium text-accent">
      {label}
    </span>
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

  return (
    <nav
      aria-label="Tool results pagination"
      className="mt-8 flex items-center justify-between rounded-md border border-line bg-white p-4 text-sm"
    >
      {hasPreviousPage ? (
        <Link
          className="font-medium text-accent"
          href={buildToolsHref(params, currentPage - 1)}
        >
          Previous
        </Link>
      ) : (
        <span className="text-ink/35">Previous</span>
      )}
      <span className="text-ink/60">
        Page {currentPage} of {totalPages}
      </span>
      {hasNextPage ? (
        <Link
          className="font-medium text-accent"
          href={buildToolsHref(params, currentPage + 1)}
        >
          Next
        </Link>
      ) : (
        <span className="text-ink/35">Next</span>
      )}
    </nav>
  );
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

function formatPricing(pricingType: "FREE" | "PAID" | "FREEMIUM") {
  if (pricingType === "FREEMIUM") {
    return "Freemium";
  }

  if (pricingType === "FREE") {
    return "Free";
  }

  return "Paid";
}
