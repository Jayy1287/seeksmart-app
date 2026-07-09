import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  CheckCircle2,
  Compass,
  Gauge,
  Layers3,
  Route,
  Target
} from "lucide-react";
import { UseCaseList } from "@/features/use-cases/use-case-list";
import { listUseCaseSummaries } from "@/server/use-cases/queries";
import { AnimatedNumber } from "@/components/motion/animated-number";
import { Reveal } from "@/components/motion/reveal";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "AI Use Cases",
  description:
    "Browse AI use cases by business outcome before comparing individual tools.",
  alternates: {
    canonical: "/use-cases"
  },
  openGraph: {
    title: "AI Tool Use Cases",
    description: "Browse AI tools by the job you need done.",
    url: "/use-cases",
    type: "website"
  }
};

export default async function UseCasesPage() {
  const useCases = await listUseCaseSummaries();
  const totalMappedTools = useCases.reduce(
    (total, useCase) => total + useCase.toolCount,
    0
  );

  return (
    <main className="page-shell">
      <div className="app-container">
        <Reveal className="hero-panel rounded-[2rem] p-5 sm:p-7 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
            <div>
              <p className="eyebrow">
                <Target aria-hidden="true" size={14} />
                Use cases
              </p>
              <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-[1.04] text-ink sm:text-5xl md:text-6xl">
                Start with a workflow, then shortlist the right tools.
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-ink/68">
                Use cases turn a broad AI goal into a practical workflow: what
                changes, what it takes to launch, and which tools deserve a
                closer look.
              </p>
              <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-3">
                <HeroSignal icon={Compass} label="Workflow-first" />
                <HeroSignal icon={BarChart3} label="Outcome-scored" />
                <HeroSignal icon={CheckCircle2} label="Tool-ready" />
              </div>
            </div>

            <div className="metric-tile rounded-[1.55rem] p-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-white/72 p-4">
                  <div className="text-4xl font-semibold text-accent">
                    <AnimatedNumber value={useCases.length} />
                  </div>
                  <div className="mt-1 text-xs font-bold uppercase text-ink/48">
                    Use cases
                  </div>
                </div>
                <div className="rounded-2xl bg-white/72 p-4">
                  <div className="text-4xl font-semibold text-accent">
                    <AnimatedNumber value={totalMappedTools} />
                  </div>
                  <div className="mt-1 text-xs font-bold uppercase text-ink/48">
                    Tool mappings
                  </div>
                </div>
              </div>
              <div className="mt-5 rounded-2xl border border-line/60 bg-white/70 p-4">
                <p className="text-sm font-semibold leading-6 text-ink/70">
                  Start from business value, filter by delivery risk, then open
                  the mapped shortlist once the workflow is clear.
                </p>
              </div>
              <Link className="primary-button mt-5 w-full" href="/audit">
                Preview audit
                <ArrowRight aria-hidden="true" size={16} />
              </Link>
            </div>
          </div>
        </Reveal>

        <Reveal className="section-band -mx-4 mt-8 px-4 py-10 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            <DecisionTile
              icon={BriefcaseBusiness}
              title="Business outcome"
              description="Start by naming the workflow result the business actually needs."
              details={[
                {
                  label: "Workflow change",
                  body: "Identify what should improve, such as response time, content output, reporting speed, handoff quality, or error reduction."
                },
                {
                  label: "Success signal",
                  body: "Pick one measurable before-and-after metric so the pilot can prove whether the workflow is getting better."
                }
              ]}
            />
            <DecisionTile
              icon={Gauge}
              title="Effort and risk"
              description="Estimate the work to launch and the safeguards needed before scaling."
              details={[
                {
                  label: "Launch effort",
                  body: "Check the process changes, data access, integrations, training, and review steps needed to move from idea to working pilot."
                },
                {
                  label: "Control points",
                  body: "Favor use cases where teams can review outputs quickly and catch mistakes before they affect customers, finances, or compliance."
                }
              ]}
            />
            <DecisionTile
              icon={Layers3}
              title="Tool fit"
              description="Compare tools only after the workflow, inputs, and review needs are clear."
              details={[
                {
                  label: "Fit criteria",
                  body: "Look at workflow coverage, integrations, data handling, collaboration, approval controls, and how easily the team can adopt it."
                },
                {
                  label: "Decision scope",
                  body: "A good shortlist should support the next practical step without forcing a large platform decision before the use case is specific."
                }
              ]}
            />
          </div>
        </Reveal>

        <Reveal className="mt-12">
          <div className="mb-6 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <p className="inline-flex items-center gap-2 text-sm font-extrabold uppercase text-accent">
                <Route aria-hidden="true" size={16} />
                Use-case library
              </p>
              <h2 className="mt-2 max-w-3xl text-3xl font-semibold md:text-4xl">
                Compare workflows by outcome, effort, and risk.
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/58">
                Each card is a starting point for a better decision. Open one
                to see fit notes, tool options, and next-step guidance.
              </p>
            </div>
            <Link
              className="secondary-button min-h-12 px-5 text-[0.95rem] md:self-end"
              href="/tools"
            >
              Browse tools
              <ArrowRight aria-hidden="true" size={16} />
            </Link>
          </div>

          <UseCaseList useCases={useCases} />
        </Reveal>
      </div>
    </main>
  );
}

function HeroSignal({
  icon: Icon,
  label
}: {
  icon: typeof Compass;
  label: string;
}) {
  return (
    <div className="flex min-h-12 flex-col justify-center gap-1 rounded-2xl border border-line/60 bg-white/72 px-3 py-2 text-xs font-bold leading-4 text-ink/68 shadow-[0_14px_34px_rgb(8_126_139/0.08)] sm:min-h-14 sm:flex-row sm:items-center sm:justify-start sm:gap-3 sm:text-sm">
      <Icon aria-hidden="true" className="shrink-0 text-accent" size={18} />
      {label}
    </div>
  );
}

function DecisionTile({
  description,
  details,
  icon: Icon,
  title
}: {
  description: string;
  details: Array<{
    body: string;
    label: string;
  }>;
  icon: typeof BriefcaseBusiness;
  title: string;
}) {
  return (
    <article className="flex h-full flex-col rounded-[1.35rem] border border-line/70 bg-white/90 p-6 shadow-[0_18px_54px_rgb(8_126_139/0.08)] backdrop-blur">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-line/70 bg-accent/10 text-accent">
        <Icon aria-hidden="true" size={22} />
      </div>
      <h2 className="mt-4 font-semibold">{title}</h2>
      <p className="mt-2 text-sm font-medium leading-6 text-ink/72">
        {description}
      </p>
      <div className="mt-4 space-y-3 border-t border-line/60 pt-4">
        {details.map((detail) => (
          <div key={detail.label}>
            <h3 className="text-xs font-extrabold uppercase text-accent/82">
              {detail.label}
            </h3>
            <p className="mt-1 text-sm leading-6 text-ink/60">{detail.body}</p>
          </div>
        ))}
      </div>
    </article>
  );
}
