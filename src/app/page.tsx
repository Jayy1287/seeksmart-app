import Link from "next/link";
import type { Route } from "next";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ClipboardList,
  Gauge,
  Layers3,
  Search,
  ShieldCheck,
  Target
} from "lucide-react";
import {
  businessGoals,
  methodologySignals,
  playbooks
} from "@/lib/platform-content";
import { HomepageLottieVisual } from "@/features/home/homepage-lottie-visual";
import { listCategorySummaries } from "@/server/categories/queries";
import {
  listIndustrySummaries,
  listOpportunitySummaries
} from "@/server/intelligence/queries";
import {
  listRecentlyAddedTools,
  listTrendingTools
} from "@/server/tools/queries";

export const dynamic = "force-dynamic";

const decisionPath = [
  {
    title: "Business context",
    description: "Industry, team, urgency, risk, and budget constraints."
  },
  {
    title: "Opportunity ranking",
    description: "Impact, effort, risk, confidence, and time to value."
  },
  {
    title: "Workflow plan",
    description: "Recommended first workflow, checklist, and tool shortlist."
  }
];

export default async function Home() {
  const [categories, trendingTools, recentTools, industries, opportunities] =
    await Promise.all([
      listCategorySummaries(),
      listTrendingTools(3),
      listRecentlyAddedTools(4),
      listIndustrySummaries(),
      listOpportunitySummaries()
    ]);
  const toolCount = categories.reduce(
    (total, category) => total + category.toolCount,
    0
  );

  return (
    <main>
      <section className="app-container py-8 md:py-12">
        <div className="hero-panel grid gap-10 rounded-2xl p-6 md:p-8 lg:grid-cols-[1fr_460px] lg:p-10">
          <div className="relative z-10">
            <p className="eyebrow">
              <ShieldCheck aria-hidden="true" size={15} />
              AI decision intelligence
            </p>
            <h1 className="mt-6 max-w-4xl text-5xl font-semibold leading-[0.98] tracking-[-0.02em] text-ink md:text-7xl">
              Decide where AI belongs before you buy another tool.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-ink/66">
              SeekSmart turns business goals into ranked AI opportunities,
              workflow playbooks, and tool shortlists with transparent
              reasoning. No chatbot dependency. No generic directory dump.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link className="primary-button min-h-12" href="/audit/start">
                Start AI audit
                <ArrowRight aria-hidden="true" size={18} />
              </Link>
              <Link className="secondary-button min-h-12" href="/opportunities">
                Explore opportunities
              </Link>
            </div>
            <form
              action="/tools"
              className="mt-8 grid max-w-2xl gap-3 rounded-xl border border-line bg-white/82 p-2 shadow-sm sm:grid-cols-[1fr_auto]"
            >
              <label className="relative w-full">
                <span className="sr-only">Search AI tools</span>
                <Search
                  aria-hidden="true"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/34"
                  size={18}
                />
                <input
                  className="min-h-12 w-full min-w-0 rounded-lg border border-transparent bg-transparent pl-11 pr-4 text-base outline-none transition focus:border-accent"
                  name="q"
                  placeholder="Search AI tools"
                  type="search"
                />
              </label>
              <button className="primary-button min-h-12" type="submit">
                Search
              </button>
            </form>
          </div>

          <div className="relative z-10 self-center">
            <HomepageLottieVisual />
          </div>
        </div>
      </section>

      <section className="app-container pb-8">
        <div className="grid gap-3 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="data-panel rounded-xl p-5">
            <div className="flex flex-col gap-2 border-b border-line pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-extrabold uppercase text-accent">
                  Audit output
                </p>
                <h2 className="mt-1 text-2xl font-semibold">
                  First workflow brief
                </h2>
              </div>
              <span className="status-pill w-fit">Rules-based V1</span>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {decisionPath.map((step, index) => (
                <div
                  className="rounded-lg border border-line bg-white/72 p-4"
                  key={step.title}
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink text-sm font-semibold text-white">
                    {index + 1}
                  </span>
                  <h3 className="mt-3 font-semibold">{step.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-ink/58">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <Stat label="Curated tools" value={toolCount} />
            <Stat label="Business opportunities" value={opportunities.length} />
            <Stat label="In-app model calls" value="0" />
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-white/62">
        <div className="app-container grid gap-8 py-12 lg:grid-cols-[0.72fr_1.28fr]">
          <div>
            <p className="eyebrow">
              <Target aria-hidden="true" size={14} />
              Start with the outcome
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.01em]">
              Pick the business result, then the workflow, then the tool.
            </h2>
            <p className="mt-4 leading-7 text-ink/62">
              The product is organized around decisions, not categories. That
              keeps the catalog useful without letting it become the whole
              experience.
            </p>
            <Link className="secondary-button mt-6" href="/use-cases">
              Browse use cases
              <ArrowRight aria-hidden="true" size={16} />
            </Link>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {businessGoals.map((goal) => (
              <Link
                className="group rounded-xl border border-line bg-surface p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-accent"
                href={goal.href as Route}
                key={goal.title}
              >
                <span className="status-pill">{goal.signal}</span>
                <h3 className="mt-4 text-lg font-semibold">{goal.title}</h3>
                <p className="mt-2 text-sm leading-6 text-ink/62">
                  {goal.description}
                </p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-accent transition group-hover:translate-x-0.5">
                  Explore path
                  <ArrowRight aria-hidden="true" size={14} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="app-container py-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
          <div className="surface-strong rounded-2xl p-6">
            <p className="eyebrow">
              <Layers3 aria-hidden="true" size={14} />
              Intelligence layer
            </p>
            <h2 className="mt-4 text-3xl font-semibold">
              Directory data, turned into advisory logic.
            </h2>
            <p className="mt-4 leading-7 text-ink/62">
              SeekSmart maps industries, functions, opportunities, use cases,
              and tool fit notes into one explainable recommendation path.
            </p>
            <div className="mt-6 grid gap-3">
              <LayerRow
                icon={ClipboardList}
                label="Input"
                title="Business context and constraints"
              />
              <LayerRow
                icon={BarChart3}
                label="Logic"
                title="Rules, taxonomy, and editorial scoring"
              />
              <LayerRow
                icon={CheckCircle2}
                label="Output"
                title="Plan, shortlist, checklist, and cautions"
              />
            </div>
          </div>

          <div>
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-extrabold uppercase text-accent">
                  Industries
                </p>
                <h2 className="mt-2 text-2xl font-semibold">
                  Starter maps for practical teams
                </h2>
              </div>
              <Link className="secondary-button" href="/industries">
                View all
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {industries.slice(0, 6).map((industry) => (
                <Link
                  className="rounded-xl border border-line bg-surface p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-accent"
                  href={`/industries/${industry.slug}`}
                  key={industry.slug}
                >
                  <h3 className="font-semibold">{industry.name}</h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-ink/60">
                    {industry.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-white/62">
        <div className="app-container grid gap-8 py-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-extrabold uppercase text-accent">
                  Tool proof points
                </p>
                <h2 className="mt-2 text-2xl font-semibold">
                  Curated tools still matter
                </h2>
              </div>
              <Link className="secondary-button" href="/tools">
                Browse tools
              </Link>
            </div>
            {trendingTools.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-1">
                {trendingTools.map((tool) => (
                  <Link
                    className="grid gap-4 rounded-xl border border-line bg-surface p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-accent md:grid-cols-[1fr_auto]"
                    href={`/tools/${tool.slug}`}
                    key={tool.id}
                  >
                    <div>
                      <h3 className="font-semibold">{tool.name}</h3>
                      <p className="mt-2 text-sm leading-6 text-ink/62">
                        {tool.shortDescription}
                      </p>
                    </div>
                    <div className="metric-tile rounded-lg px-4 py-3 text-sm md:text-right">
                      Score {tool.popularityScore}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyPanel message="Seed the database to start showing recommended tools." />
            )}
          </div>

          <div>
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-extrabold uppercase text-accent">
                  Playbooks
                </p>
                <h2 className="mt-2 text-2xl font-semibold">
                  Operational next steps
                </h2>
              </div>
              <Link className="secondary-button" href="/playbooks">
                View all
              </Link>
            </div>
            <div className="grid gap-3">
              {playbooks.map((playbook) => {
                const Icon = playbook.icon;

                return (
                  <Link
                    className="rounded-xl border border-line bg-surface p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-accent"
                    href={`/playbooks/${playbook.slug}`}
                    key={playbook.slug}
                  >
                    <div className="flex items-start gap-3">
                      <Icon
                        aria-hidden="true"
                        className="mt-0.5 shrink-0 text-accent"
                        size={20}
                      />
                      <div>
                        <h3 className="font-semibold">{playbook.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-ink/62">
                          {playbook.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="app-container py-12">
        <div className="surface-strong grid gap-6 rounded-2xl p-6 md:grid-cols-[0.85fr_1.15fr] md:items-center">
          <div>
            <p className="eyebrow">
              <Gauge aria-hidden="true" size={14} />
              Trust model
            </p>
            <h2 className="mt-4 text-3xl font-semibold">
              Clear reasoning, no hidden model wrapper.
            </h2>
            <p className="mt-4 leading-7 text-ink/62">
              Recommendations start with structured data, deterministic rules,
              and editorial judgment. Models can be added later only where they
              improve the product.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {methodologySignals.map((signal) => {
              const Icon = signal.icon;

              return (
                <Link
                  className="rounded-xl border border-line bg-surface p-4 transition hover:-translate-y-0.5 hover:border-accent"
                  href="/methodology"
                  key={signal.title}
                >
                  <Icon aria-hidden="true" className="text-accent" size={20} />
                  <h3 className="mt-3 font-semibold">{signal.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-ink/60">
                    {signal.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {recentTools.length > 0 ? (
        <section className="app-container pb-12">
          <div className="flex flex-wrap items-center gap-3 border-t border-line pt-6 text-sm">
            <span className="font-bold text-accent">
              Recently added intelligence
            </span>
            {recentTools.map((tool) => (
              <Link
                className="rounded-full border border-line bg-surface px-3 py-1.5 font-medium text-ink/62 transition hover:border-accent hover:text-accent"
                href={`/tools/${tool.slug}`}
                key={tool.id}
              >
                {tool.name}
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}

function Stat({ label, value }: { label: number | string; value: number | string }) {
  return (
    <div className="metric-tile rounded-xl px-5 py-4">
      <div className="text-2xl font-semibold">{value}</div>
      <div className="mt-1 text-xs font-bold uppercase text-ink/48">{label}</div>
    </div>
  );
}

function LayerRow({
  icon: Icon,
  label,
  title
}: {
  icon: typeof ClipboardList;
  label: string;
  title: string;
}) {
  return (
    <div className="grid grid-cols-[2.5rem_1fr_auto] items-center gap-3 rounded-xl border border-line bg-surface p-4">
      <Icon aria-hidden="true" className="text-accent" size={22} />
      <h3 className="font-semibold">{title}</h3>
      <span className="status-pill">{label}</span>
    </div>
  );
}

function EmptyPanel({ message }: { message: string }) {
  return (
    <div className="surface-panel rounded-xl p-8 text-center">
      <h2 className="font-semibold">Nothing to show yet</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-ink/60">
        {message}
      </p>
    </div>
  );
}
