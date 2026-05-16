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
import { TypewriterRotator } from "@/features/home/typewriter-rotator";
import { listCategorySummaries } from "@/server/categories/queries";
import {
  listIndustrySummaries,
  listOpportunitySummaries
} from "@/server/intelligence/queries";
import {
  listRecentlyAddedTools,
  listTrendingTools
} from "@/server/tools/queries";
import { ToolLogo } from "@/features/tools/tool-logo";
import { RecentToolsMarquee } from "@/features/home/recent-tools-marquee";
import { AnimatedBar } from "@/components/motion/animated-bar";
import { AnimatedNumber } from "@/components/motion/animated-number";
import { MotionLink } from "@/components/motion/motion-link";
import { Reveal } from "@/components/motion/reveal";
import { Stagger, StaggerItem } from "@/components/motion/stagger";

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
      listRecentlyAddedTools(10),
      listIndustrySummaries(),
      listOpportunitySummaries()
    ]);
  const toolCount = categories.reduce(
    (total, category) => total + category.toolCount,
    0
  );

  return (
    <main>
      <section className="relative overflow-hidden py-14 md:py-20">
        <div className="app-container grid gap-12 lg:grid-cols-[minmax(0,1fr)_440px] lg:items-center">
          <Stagger>
            <StaggerItem>
              <p className="eyebrow">
                <ShieldCheck aria-hidden="true" size={15} />
                Smarter AI Choices
              </p>
            </StaggerItem>
            <StaggerItem>
              <h1 className="mt-7 max-w-4xl text-5xl font-semibold leading-[0.98] text-ink md:text-7xl">
                Decide where AI belongs before you buy another tool.
              </h1>
            </StaggerItem>
            <StaggerItem>
              <TypewriterRotator />
            </StaggerItem>
            <StaggerItem>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-ink/68 md:text-xl md:leading-9">
                SeekSmart turns business goals into ranked AI opportunities,
                workflow playbooks, and tool shortlists with transparent
                reasoning. No chatbot dependency. No generic directory dump.
              </p>
            </StaggerItem>
            <StaggerItem>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <MotionLink className="primary-button min-h-12" href="/audit/start">
                  Start AI audit
                  <ArrowRight aria-hidden="true" size={18} />
                </MotionLink>
                <MotionLink className="secondary-button min-h-12" href="/opportunities">
                  Explore opportunities
                </MotionLink>
              </div>
            </StaggerItem>
            <StaggerItem>
              <form
                action="/tools"
                className="mt-9 grid max-w-2xl gap-3 rounded-full border border-line/60 bg-white/55 p-2 shadow-[0_18px_54px_rgb(13_48_92/0.08)] backdrop-blur sm:grid-cols-[1fr_auto]"
              >
                <label className="relative w-full">
                  <span className="sr-only">Search AI tools</span>
                  <Search
                    aria-hidden="true"
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/34"
                    size={18}
                  />
                  <input
                    className="min-h-12 w-full min-w-0 rounded-full border border-transparent bg-transparent pl-11 pr-4 text-base outline-none transition focus:border-accent"
                    name="q"
                    placeholder="Search AI tools"
                    type="search"
                  />
                </label>
                <button className="search-button min-h-12" type="submit">
                  Search
                </button>
              </form>
            </StaggerItem>
          </Stagger>

          <Reveal className="relative self-center" delay={0.16}>
            <HomepageLottieVisual />
          </Reveal>
        </div>
      </section>

      <Reveal className="app-container pb-12">
        <div className="grid gap-8 border-y border-line/50 py-8 lg:grid-cols-[1.35fr_0.65fr] lg:items-center">
          <div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
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
            <div className="mt-7 grid gap-6 md:grid-cols-3">
              {decisionPath.map((step, index) => (
                <div
                  className="relative border-t border-line/70 pt-5"
                  key={step.title}
                >
                  <span className="absolute -top-4 flex h-8 w-8 items-center justify-center rounded-full bg-ink text-sm font-semibold text-white shadow-lg shadow-ink/10">
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
      </Reveal>

      <Reveal className="section-band">
        <div className="app-container grid gap-8 py-12 lg:grid-cols-[0.72fr_1.28fr]">
          <div>
            <p className="eyebrow">
              <Target aria-hidden="true" size={14} />
              Start with the outcome
            </p>
            <h2 className="mt-4 text-3xl font-semibold">
              Pick the business result, then the workflow, then the tool.
            </h2>
            <p className="mt-4 leading-7 text-ink/62">
              The product is organized around decisions, not categories. That
              keeps the catalog useful without letting it become the whole
              experience.
            </p>
            <MotionLink className="secondary-button mt-6" href="/use-cases">
              Browse use cases
              <ArrowRight aria-hidden="true" size={16} />
            </MotionLink>
          </div>
          <div className="grid gap-x-8 gap-y-6 md:grid-cols-2">
            {businessGoals.map((goal) => (
              <MotionLink
                className="group border-t border-line/70 pt-5 transition hover:border-accent"
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
              </MotionLink>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal className="app-container py-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
          <div className="py-2">
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
              <MotionLink className="secondary-button" href="/industries">
                View all
              </MotionLink>
            </div>
            <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
              {industries.slice(0, 6).map((industry) => (
                <MotionLink
                  className="group border-t border-line/70 pt-4 transition hover:border-accent"
                  href={`/industries/${industry.slug}`}
                  key={industry.slug}
                >
                  <h3 className="font-semibold transition group-hover:text-accent">
                    {industry.name}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-ink/60">
                    {industry.description}
                  </p>
                </MotionLink>
              ))}
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal className="section-band">
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
              <MotionLink className="secondary-button" href="/tools">
                Browse tools
              </MotionLink>
            </div>
            {trendingTools.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-1">
                {trendingTools.map((tool) => (
                  <MotionLink
                    className="group grid gap-4 border-t border-line/70 pt-4 transition hover:border-accent md:grid-cols-[1fr_auto]"
                    href={`/tools/${tool.slug}`}
                    key={tool.id}
                  >
                    <div className="flex min-w-0 items-start gap-3">
                      <ToolLogo logoUrl={tool.logoUrl} name={tool.name} />
                      <div className="min-w-0">
                        <h3 className="font-semibold transition group-hover:text-accent">
                          {tool.name}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-ink/62">
                          {tool.shortDescription}
                        </p>
                      </div>
                    </div>
                    <div className="rounded-2xl border border-line/50 bg-white/42 px-3 py-2 backdrop-blur md:w-28">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-[0.68rem] font-extrabold uppercase text-muted-text/70">
                          Signal
                        </span>
                        <span className="text-lg font-semibold text-ink">
                          <AnimatedNumber value={tool.popularityScore} />
                        </span>
                      </div>
                      <div
                        aria-hidden="true"
                        className="mt-2 h-1.5 overflow-hidden rounded-full bg-white"
                      >
                        <AnimatedBar
                          className="h-full rounded-full bg-signal"
                          value={tool.popularityScore}
                        />
                      </div>
                    </div>
                  </MotionLink>
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
              <MotionLink className="secondary-button" href="/playbooks">
                View all
              </MotionLink>
            </div>
            <div className="grid gap-3">
              {playbooks.map((playbook) => {
                const Icon = playbook.icon;

                return (
                  <MotionLink
                    className="group border-t border-line/70 py-4 transition hover:border-accent"
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
                        <h3 className="font-semibold transition group-hover:text-accent">
                          {playbook.title}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-ink/62">
                          {playbook.description}
                        </p>
                      </div>
                    </div>
                  </MotionLink>
                );
              })}
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal className="app-container py-12">
        <div className="grid gap-8 border-y border-line/50 py-10 md:grid-cols-[0.85fr_1.15fr] md:items-center">
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
          <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
            {methodologySignals.map((signal) => {
              const Icon = signal.icon;

              return (
                <MotionLink
                  className="group border-t border-line/70 pt-4 transition hover:border-accent"
                  href="/methodology"
                  key={signal.title}
                >
                  <Icon aria-hidden="true" className="text-accent" size={20} />
                  <h3 className="mt-3 font-semibold transition group-hover:text-accent">
                    {signal.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-ink/60">
                    {signal.description}
                  </p>
                </MotionLink>
              );
            })}
          </div>
        </div>
      </Reveal>

      {recentTools.length > 0 ? (
        <Reveal className="app-container pb-12">
          <div className="flex flex-wrap items-center gap-3 border-t border-line pt-6 text-sm">
            <span className="font-bold text-accent">
              Recently added intelligence
            </span>
            <RecentToolsMarquee tools={recentTools} />
          </div>
        </Reveal>
      ) : null}
    </main>
  );
}

function Stat({ label, value }: { label: number | string; value: number | string }) {
  return (
    <div className="metric-tile rounded-2xl px-5 py-4">
      <div className="text-2xl font-semibold">
        {typeof value === "number" ? <AnimatedNumber value={value} /> : value}
      </div>
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
    <div className="grid grid-cols-[2.5rem_1fr_auto] items-center gap-3 border-t border-line/70 py-4">
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
