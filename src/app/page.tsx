import Link from "next/link";
import { ArrowRight, Filter, Gauge, ShieldCheck, Sparkles } from "lucide-react";
import { CategoryList } from "@/features/categories/category-list";
import { ToolCard } from "@/features/tools/tool-card";
import { listCategorySummaries } from "@/server/categories/queries";
import {
  listRecentlyAddedTools,
  listTrendingTools
} from "@/server/tools/queries";

export const dynamic = "force-dynamic";

const principles = [
  {
    icon: Gauge,
    title: "Fast discovery",
    description: "Search, filter, and compare tools without wading through noise."
  },
  {
    icon: Filter,
    title: "Structured data",
    description: "Categories, use cases, pricing, and alternatives are modeled cleanly."
  },
  {
    icon: ShieldCheck,
    title: "Moderated listings",
    description: "Submitted tools go through review before they become public."
  }
];

export default async function Home() {
  const [categories, trendingTools, recentTools] = await Promise.all([
    listCategorySummaries(),
    listTrendingTools(6),
    listRecentlyAddedTools(5)
  ]);
  const toolCount = categories.reduce(
    (total, category) => total + category.toolCount,
    0
  );

  return (
    <main>
      <section className="border-b border-line">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-[1.2fr_0.8fr] md:items-center">
          <div>
            <p className="mb-4 text-sm font-medium uppercase text-accent">
              AI tool discovery
            </p>
            <h1 className="max-w-3xl text-5xl font-semibold leading-tight text-ink md:text-6xl">
              Find the right AI tool in seconds.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-ink/70">
              Browse curated AI tools by category, pricing, and fit. Start
              with a search or jump into a focused category.
            </p>
            <form action="/tools" className="mt-8 flex max-w-2xl gap-3">
              <input
                className="min-h-12 flex-1 rounded-md border border-line bg-white px-4 text-base outline-none transition focus:border-accent"
                name="q"
                placeholder="Search for writing, video, coding..."
                type="search"
              />
              <button
                className="inline-flex min-h-12 items-center gap-2 rounded-md bg-ink px-5 font-medium text-paper"
                type="submit"
              >
                Search
                <ArrowRight aria-hidden="true" size={18} />
              </button>
            </form>
            <div className="mt-8 grid max-w-xl grid-cols-3 gap-3">
              <Stat label="Published tools" value={toolCount} />
              <Stat label="Categories" value={categories.length} />
              <Stat label="Trending picks" value={trendingTools.length} />
            </div>
          </div>
          <div className="rounded-md border border-line bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-semibold">Real categories</h2>
              <Link className="text-sm font-medium text-accent" href="/categories">
                View all
              </Link>
            </div>
            <CategoryList categories={categories.slice(0, 6)} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-10">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase text-accent">
              Trending
            </p>
            <h2 className="mt-2 text-2xl font-semibold">Trending tools</h2>
          </div>
          <Link
            className="inline-flex items-center gap-2 text-sm font-medium text-accent"
            href="/tools"
          >
            Browse tools
            <ArrowRight aria-hidden="true" size={16} />
          </Link>
        </div>
        {trendingTools.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {trendingTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        ) : (
          <EmptyPanel message="Seed the database to start showing trending tools." />
        )}
      </section>

      <section className="border-y border-line bg-white/45">
        <div className="mx-auto grid max-w-6xl gap-6 px-5 py-10 md:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-medium uppercase text-accent">Recent</p>
            <h2 className="mt-2 text-2xl font-semibold">Recently added</h2>
            <p className="mt-3 text-sm leading-6 text-ink/60">
              New published listings appear here first, giving returning users a
              quick way to scan what changed.
            </p>
          </div>
          <div className="grid gap-3">
            {recentTools.length > 0 ? (
              recentTools.map((tool) => (
                <Link
                  className="flex items-center justify-between gap-4 rounded-md border border-line bg-white p-4 transition hover:border-accent"
                  href={`/tools/${tool.slug}`}
                  key={tool.id}
                >
                  <div>
                    <h3 className="font-medium">{tool.name}</h3>
                    <p className="mt-1 text-sm text-ink/60">
                      {tool.category.name}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-accent">View</span>
                </Link>
              ))
            ) : (
              <EmptyPanel message="Recently added tools will show up after seeding." />
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-5 py-10 md:grid-cols-3">
        {principles.map((principle) => {
          const Icon = principle.icon;

          return (
            <article
              className="rounded-md border border-line bg-white p-5"
              key={principle.title}
            >
              <Icon aria-hidden="true" className="mb-4 text-accent" size={22} />
              <h2 className="font-semibold">{principle.title}</h2>
              <p className="mt-2 text-sm leading-6 text-ink/65">
                {principle.description}
              </p>
            </article>
          );
        })}
      </section>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-line bg-white p-3">
      <div className="flex items-center gap-2">
        <Sparkles aria-hidden="true" className="text-accent" size={15} />
        <span className="text-xl font-semibold">{value}</span>
      </div>
      <p className="mt-1 text-xs text-ink/55">{label}</p>
    </div>
  );
}

function EmptyPanel({ message }: { message: string }) {
  return (
    <div className="rounded-md border border-line bg-white p-6 text-sm text-ink/60">
      {message}
    </div>
  );
}
