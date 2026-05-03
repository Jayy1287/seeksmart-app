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
  Sparkles,
  Target
} from "lucide-react";
import { ToolCard } from "@/features/tools/tool-card";
import {
  businessGoals,
  methodologySignals,
  playbooks
} from "@/lib/platform-content";
import {
  listIndustrySummaries,
  listOpportunitySummaries
} from "@/server/intelligence/queries";
import { listCategorySummaries } from "@/server/categories/queries";
import {
  listRecentlyAddedTools,
  listTrendingTools
} from "@/server/tools/queries";

export const dynamic = "force-dynamic";

const decisionPath = [
  {
    title: "Describe the business goal",
    description: "Start with time, revenue, support, content, or operations."
  },
  {
    title: "Map it to a practical use case",
    description: "Translate the goal into workflows that can be improved."
  },
  {
    title: "Shortlist tools with reasons",
    description: "Compare fit, effort, cost, risk, and time to value."
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
    <main className="page-shell">
      <section className="app-container">
        <div className="hero-panel relative grid gap-8 rounded-2xl p-5 md:grid-cols-[1.03fr_0.97fr] md:items-center md:p-8 lg:p-10">
          <div className="relative z-10">
            <p className="eyebrow mb-5">
              <Sparkles aria-hidden="true" size={15} />
              AI decision platform
            </p>
            <h1 className="max-w-3xl text-4xl font-semibold leading-[1.02] text-ink md:text-6xl">
              Know where AI can help before you choose a tool.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-ink/70">
              SeekSmart helps practical teams turn business goals into AI use
              cases, playbooks, and tool shortlists with clear reasoning.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link className="primary-button min-h-12" href="/audit">
                Start AI audit
                <ArrowRight aria-hidden="true" size={18} />
              </Link>
              <Link className="secondary-button min-h-12" href="/playbooks">
                View playbooks
              </Link>
            </div>
            <form
              action="/tools"
              className="surface-strong mt-6 grid max-w-2xl gap-3 rounded-xl p-2 sm:grid-cols-[1fr_auto]"
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
                  placeholder="Search tools"
                  type="search"
                />
              </label>
              <button className="primary-button min-h-12" type="submit">
                Search
              </button>
            </form>
            <div className="mt-8 grid max-w-2xl grid-cols-3 gap-3">
              <Stat label="Published tools" value={toolCount} />
              <Stat label="Opportunities" value={opportunities.length} />
              <Stat label="Model calls" value="0" />
            </div>
          </div>
          <div className="data-panel relative rounded-2xl p-5">
            <div className="relative z-10 mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase text-accent">
                  Decision path
                </p>
                <h2 className="mt-1 text-lg font-semibold">
                  Problem before product
                </h2>
              </div>
              <Link className="secondary-button" href="/methodology">
                Methodology
              </Link>
            </div>
            <div className="relative z-10 grid gap-3">
              {decisionPath.map((step, index) => (
                <div
                  className="rounded-xl border border-line bg-surface/72 p-4"
                  key={step.title}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-sm font-semibold text-paper">
                      {index + 1}
                    </span>
                    <h3 className="font-semibold">{step.title}</h3>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-ink/60">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
            <div className="relative z-10 mt-5 grid grid-cols-3 gap-2">
              {["Impact", "Effort", "Risk"].map((label) => (
                <MiniSignal key={label} label={label} value="Scored" />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="app-container py-10">
        <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">
              <Target aria-hidden="true" size={14} />
              Start with your goal
            </p>
            <h2 className="mt-3 text-2xl font-semibold">
              Pick the outcome before the software
            </h2>
          </div>
          <Link className="secondary-button" href="/use-cases">
            Browse use cases
            <ArrowRight aria-hidden="true" size={16} />
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {businessGoals.map((goal) => (
            <Link
              className="surface-panel group flex h-full flex-col rounded-xl p-5 transition hover:-translate-y-1 hover:border-accent"
              href={goal.href as Route}
              key={goal.title}
            >
              <span className="status-pill w-fit">{goal.signal}</span>
              <h3 className="mt-4 font-semibold">{goal.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-6 text-ink/65">
                {goal.description}
              </p>
              <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-accent transition group-hover:translate-x-0.5">
                Explore path
                <ArrowRight aria-hidden="true" size={14} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-muted/35">
        <div className="app-container grid gap-6 py-10 lg:grid-cols-[0.82fr_1.18fr]">
          <div>
            <p className="eyebrow">
              <Layers3 aria-hidden="true" size={14} />
              Platform layers
            </p>
            <h2 className="mt-3 text-2xl font-semibold">
              Directory data becomes decision intelligence
            </h2>
            <p className="mt-3 leading-7 text-ink/65">
              The current catalog remains useful, but the business platform is
              built around explainable mappings: business goal to use case, use
              case to tool fit, and tool fit to implementation next steps.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            <LayerCard
              icon={ClipboardList}
              label="Business context"
              title="Goals and constraints"
              value="Input"
            />
            <LayerCard
              icon={BarChart3}
              label="Rules and taxonomy"
              title="Use-case matching"
              value="Logic"
            />
            <LayerCard
              icon={CheckCircle2}
              label="Recommended path"
              title="Tools with reasons"
              value="Output"
            />
          </div>
        </div>
      </section>

      <section className="app-container py-10">
        <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">Industries</p>
            <h2 className="mt-3 text-2xl font-semibold">
              Starter maps for practical teams
            </h2>
          </div>
          <Link className="secondary-button" href="/industries">
            View industries
            <ArrowRight aria-hidden="true" size={16} />
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {industries.map((industry) => {
            return (
              <Link
                className="surface-panel rounded-xl p-5 transition hover:-translate-y-1 hover:border-accent"
                href={`/industries/${industry.slug}`}
                key={industry.slug}
              >
                <Layers3 aria-hidden="true" className="text-accent" size={22} />
                <h3 className="mt-4 font-semibold">{industry.name}</h3>
                <p className="mt-2 text-sm leading-6 text-ink/65">
                  {industry.description}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="app-container grid gap-8 py-10 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="eyebrow">
                <Gauge aria-hidden="true" size={14} />
                Tool proof points
              </p>
              <h2 className="mt-3 text-2xl font-semibold">
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
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          ) : (
            <EmptyPanel message="Seed the database to start showing recommended tools." />
          )}
        </div>
        <div>
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="eyebrow">Playbooks</p>
              <h2 className="mt-3 text-2xl font-semibold">
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
                  className="surface-panel rounded-xl p-5 transition hover:-translate-y-0.5 hover:border-accent"
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
                      <p className="mt-2 text-sm leading-6 text-ink/65">
                        {playbook.description}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
          <div className="surface-strong mt-4 rounded-xl p-5">
            <p className="text-sm font-semibold text-accent">
              Recently added intelligence
            </p>
            <div className="mt-3 grid gap-3">
              {recentTools.map((tool) => (
                <Link
                  className="flex items-center justify-between gap-3 rounded-lg border border-line bg-surface/70 px-3 py-2 text-sm transition hover:border-accent"
                  href={`/tools/${tool.slug}`}
                  key={tool.id}
                >
                  <span className="font-medium">{tool.name}</span>
                  <span className="text-ink/50">{tool.category.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="app-container py-10">
        <div className="surface-strong grid gap-6 rounded-2xl p-6 md:grid-cols-[0.85fr_1.15fr] md:items-center">
          <div>
            <p className="eyebrow">Trust model</p>
            <h2 className="mt-3 text-2xl font-semibold">
              Clear reasoning, no hidden chatbot dependency
            </h2>
            <p className="mt-3 leading-7 text-ink/65">
              The first version of SeekSmart&apos;s intelligence layer should be
              structured, editorial, and explainable. AI models can be added
              later only where they improve the product.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {methodologySignals.map((signal) => {
              const Icon = signal.icon;

              return (
                <Link
                  className="rounded-xl border border-line bg-surface/72 p-4 transition hover:-translate-y-0.5 hover:border-accent"
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
    </main>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="metric-tile rounded-xl px-4 py-3">
      <div className="text-2xl font-semibold">{value}</div>
      <div className="mt-1 text-xs font-medium text-ink/55">{label}</div>
    </div>
  );
}

function MiniSignal({ label, value }: { label: string; value: string }) {
  return (
    <div className="metric-tile rounded-xl px-3 py-3">
      <div className="text-sm font-semibold">{value}</div>
      <div className="mt-1 text-xs text-ink/50">{label}</div>
    </div>
  );
}

function LayerCard({
  icon: Icon,
  label,
  title,
  value
}: {
  icon: typeof ClipboardList;
  label: string;
  title: string;
  value: string;
}) {
  return (
    <div className="surface-panel rounded-xl p-5">
      <div className="flex items-center justify-between gap-3">
        <Icon aria-hidden="true" className="text-accent" size={22} />
        <span className="status-pill">{value}</span>
      </div>
      <h3 className="mt-4 font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-ink/55">{label}</p>
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
