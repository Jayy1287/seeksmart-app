import Link from "next/link";
import {
  ArrowRight,
  Boxes,
  CheckCircle2,
  Filter,
  Gauge,
  Layers3,
  Search,
  ShieldCheck,
  Sparkles,
  Target
} from "lucide-react";
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
    <main className="page-shell">
      <section className="app-container">
        <div className="hero-panel relative grid gap-10 rounded-2xl p-5 md:grid-cols-[1.08fr_0.92fr] md:items-center md:p-8 lg:p-10">
          <div>
            <p className="eyebrow mb-5">
              <Sparkles aria-hidden="true" size={15} />
              AI tool discovery
            </p>
            <h1 className="max-w-3xl text-4xl font-semibold leading-[1.02] text-ink md:text-6xl">
              Find the right AI tool with less guessing.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-ink/70">
              SeekSmart turns a noisy AI market into a structured directory of
              tools, categories, use cases, and signals you can actually scan.
            </p>
            <form
              action="/tools"
              className="surface-strong mt-8 grid max-w-2xl gap-3 rounded-xl p-2 sm:grid-cols-[1fr_auto]"
            >
              <label className="relative w-full">
                <span className="sr-only">Search AI tools</span>
                <Search
                  aria-hidden="true"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/38"
                  size={18}
                />
                <input
                  className="min-h-12 w-full min-w-0 rounded-lg border border-transparent bg-transparent pl-11 pr-4 text-base outline-none transition focus:border-accent"
                  name="q"
                  placeholder="Search writing, video, coding"
                  type="search"
                />
              </label>
              <button
                className="primary-button min-h-12"
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
          <div className="data-panel relative rounded-2xl p-5">
            <div className="relative z-10 mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase text-accent">
                  Live taxonomy
                </p>
                <h2 className="mt-1 text-lg font-semibold">Real categories</h2>
              </div>
              <Link
                className="secondary-button"
                href="/categories"
              >
                View all
              </Link>
            </div>
            <div className="relative z-10">
              <CategoryList categories={categories.slice(0, 6)} />
            </div>
            <div className="relative z-10 mt-5 grid grid-cols-2 gap-3">
              <MiniSignal label="Use-case ready" value="18" />
              <MiniSignal label="Moderated" value="100%" />
            </div>
            <div className="relative z-10 mt-5 rounded-xl border border-line bg-surface/70 p-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Layers3 aria-hidden="true" className="text-brand" size={17} />
                Discovery signal map
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {["Category", "Pricing", "Use case"].map((label) => (
                  <div
                    className="rounded-lg border border-line bg-muted/45 px-3 py-2 text-xs font-medium text-ink/65"
                    key={label}
                  >
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="app-container py-10">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <p className="eyebrow">
              <Target aria-hidden="true" size={14} />
              Trending
            </p>
            <h2 className="mt-2 text-2xl font-semibold">Trending tools</h2>
          </div>
          <Link
            className="secondary-button"
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

      <section className="border-y border-line bg-muted/35">
        <div className="app-container grid gap-6 py-10 md:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="eyebrow">Recent</p>
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
                  className="surface-panel flex items-center justify-between gap-4 rounded-xl p-4 transition hover:-translate-y-0.5 hover:border-accent"
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

      <section className="app-container grid gap-4 py-10 md:grid-cols-3">
        {principles.map((principle) => {
          const Icon = principle.icon;

          return (
            <article
              className="surface-panel rounded-xl p-5"
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
    <div className="metric-tile rounded-xl p-3">
      <div className="flex items-center gap-2">
        <CheckCircle2 aria-hidden="true" className="text-accent" size={15} />
        <span className="text-xl font-semibold">{value}</span>
      </div>
      <p className="mt-1 text-xs text-ink/55">{label}</p>
    </div>
  );
}

function MiniSignal({ label, value }: { label: string; value: string }) {
  return (
    <div className="metric-tile rounded-xl p-3">
      <div className="flex items-center gap-2">
        <Boxes aria-hidden="true" className="text-brand" size={15} />
        <span className="font-semibold">{value}</span>
      </div>
      <p className="mt-1 text-xs text-ink/55">{label}</p>
    </div>
  );
}

function EmptyPanel({ message }: { message: string }) {
  return (
    <div className="surface-panel rounded-xl p-6 text-sm text-ink/60">
      {message}
    </div>
  );
}
