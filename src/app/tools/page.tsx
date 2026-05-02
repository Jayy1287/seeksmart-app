import type { Metadata } from "next";
import { Search } from "lucide-react";
import { listCategories } from "@/server/categories/queries";
import { listPublishedTools } from "@/server/tools/queries";
import { ToolCard } from "@/features/tools/tool-card";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "AI Tools",
  description: "Browse AI tools by category, pricing, and use case."
};

type ToolsPageProps = {
  searchParams: Promise<{
    q?: string;
    category?: string;
    pricing?: "FREE" | "PAID" | "FREEMIUM";
  }>;
};

export default async function ToolsPage({ searchParams }: ToolsPageProps) {
  const params = await searchParams;
  const [tools, categories] = await Promise.all([
    listPublishedTools({
      query: params.q,
      categorySlug: params.category,
      pricingType: params.pricing
    }),
    listCategories()
  ]);

  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
      <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium uppercase text-accent">Directory</p>
          <h1 className="mt-2 text-4xl font-semibold">AI tools</h1>
          <p className="mt-3 max-w-2xl text-ink/65">
            Browse curated tools by category and pricing.
          </p>
        </div>
      </div>

      <form className="mb-8 grid gap-3 rounded-md border border-line bg-white p-4 md:grid-cols-[1fr_180px_160px_auto]">
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

      {tools.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      ) : (
        <div className="rounded-md border border-line bg-white p-8 text-center">
          <h2 className="font-semibold">No tools found</h2>
          <p className="mt-2 text-sm text-ink/60">
            Try a different search or remove one of the filters.
          </p>
        </div>
      )}
    </main>
  );
}
