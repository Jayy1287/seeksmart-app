import type { Metadata } from "next";
import type { UrlObject } from "node:url";
import Link from "next/link";
import { Filter, SlidersHorizontal } from "lucide-react";
import { auth } from "@/auth";
import { listToolsQuerySchema } from "@/lib/validation";
import { listCategories } from "@/server/categories/queries";
import { attachToolLikeStates } from "@/server/tools/likes";
import { searchPublishedTools } from "@/server/tools/queries";
import { ToolCard } from "@/features/tools/tool-card";
import { ToolFilterBar } from "@/features/tools/tool-filter-bar";
import { Reveal } from "@/components/motion/reveal";
import { Stagger, StaggerItem } from "@/components/motion/stagger";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "AI Tool Directory",
  description:
    "Browse curated AI tools after identifying the business workflow you want to improve.",
  alternates: {
    canonical: "/tools"
  },
  openGraph: {
    title: "AI Tool Directory",
    description:
      "Browse curated AI tools after identifying the business workflow you want to improve.",
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
  const [session, result, categories] = await Promise.all([
    auth(),
    searchPublishedTools({
      query: params.q,
      categorySlug: params.category,
      pricingType: params.pricing,
      page: params.page,
      limit: params.limit
    }),
    listCategories()
  ]);
  const tools = await attachToolLikeStates(result.tools, session?.user?.id);
  const isSignedIn = Boolean(session?.user);
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
    <main className="page-shell">
      <section className="app-container">
      <Reveal className="mb-8 flex flex-col gap-5 border-b border-line/50 pb-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow">
            <SlidersHorizontal aria-hidden="true" size={14} />
            Tool directory
          </p>
          <h1 className="mt-3 text-4xl font-semibold">
            AI tools for known workflows
          </h1>
          <p className="mt-3 max-w-2xl text-ink/65">
            Browse curated tools by category, pricing, and fit once the
            business use case is clear.
          </p>
        </div>
        <div className="metric-tile rounded-2xl px-4 py-3 text-sm text-ink/60">
          <span className="font-semibold text-ink">{result.total}</span>{" "}
          matching tools
        </div>
      </Reveal>

      <Reveal delay={0.05}>
        <ToolFilterBar
          categories={categories}
          initialCategory={params.category}
          initialPricing={params.pricing}
          initialQuery={params.q}
        />
      </Reveal>

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
            <span className="inline-flex items-center gap-2 text-ink/55">
              <Filter aria-hidden="true" size={15} />
              Showing all published tools
            </span>
          ) : null}
        </div>
        {activeFilterCount > 0 ? (
          <Link className="font-medium text-accent" href="/tools">
            Reset filters
          </Link>
        ) : null}
      </div>

      {tools.length > 0 ? (
        <>
          <div className="mb-4 text-sm text-ink/55">
            Showing {startResult}-{endResult} of {result.total}
          </div>
          <Stagger className="grid gap-x-8 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => (
              <StaggerItem key={tool.id}>
                <ToolCard isSignedIn={isSignedIn} tool={tool} />
              </StaggerItem>
            ))}
          </Stagger>
          <Pagination
            currentPage={result.page}
            hasNextPage={result.hasNextPage}
            hasPreviousPage={result.hasPreviousPage}
            params={params}
            totalPages={result.totalPages}
          />
        </>
      ) : (
        <div className="surface-panel rounded-xl p-8 text-center">
          <h2 className="font-semibold">No tools found</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-ink/60">
            No published tools match the current filters. Try a broader search
            or reset the filters to scan the full directory.
          </p>
          <Link
            className="primary-button mt-5"
            href="/tools"
          >
            Reset filters
          </Link>
        </div>
      )}
      </section>
    </main>
  );
}

function FilterChip({ label }: { label: string }) {
  return (
    <span className="rounded-full bg-accent/10 px-3 py-1.5 font-medium text-accent ring-1 ring-accent/15">
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
      className="surface-panel mt-8 flex items-center justify-between rounded-xl p-4 text-sm"
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
