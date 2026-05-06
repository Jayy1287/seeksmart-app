import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  Gauge,
  Layers3,
  Target
} from "lucide-react";
import { UseCaseList } from "@/features/use-cases/use-case-list";
import { listUseCaseSummaries } from "@/server/use-cases/queries";

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
        <section className="grid gap-8 border-b border-line/50 pb-10 lg:grid-cols-[minmax(0,1fr)_330px] lg:items-end">
          <div>
            <p className="eyebrow">
              <Target aria-hidden="true" size={14} />
              Use cases
            </p>
            <h1 className="mt-4 max-w-4xl text-5xl font-semibold leading-[1.02] md:text-6xl">
              Start with a workflow, then shortlist the right tools.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-ink/66">
              Use cases translate broad business goals into concrete AI work:
              what improves, how hard it is, what risk to manage, and which
              tools are worth comparing.
            </p>
          </div>
          <div className="metric-tile rounded-[1.35rem] p-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-3xl font-semibold">{useCases.length}</div>
                <div className="mt-1 text-xs font-bold uppercase text-ink/48">
                  Use cases
                </div>
              </div>
              <div>
                <div className="text-3xl font-semibold">{totalMappedTools}</div>
                <div className="mt-1 text-xs font-bold uppercase text-ink/48">
                  Tool mappings
                </div>
              </div>
            </div>
            <Link className="secondary-button mt-5 w-full" href="/audit">
              Preview audit
              <ArrowRight aria-hidden="true" size={16} />
            </Link>
          </div>
        </section>

        <section className="section-band -mx-4 mt-8 px-4 py-8 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            <DecisionTile
              icon={BriefcaseBusiness}
              title="Business outcome"
              description="Name the measurable workflow improvement first."
            />
            <DecisionTile
              icon={Gauge}
              title="Effort and risk"
              description="Favor use cases with clear review points and fast feedback."
            />
            <DecisionTile
              icon={Layers3}
              title="Tool fit"
              description="Compare products only after the use case is specific."
            />
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-5 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <p className="text-sm font-extrabold uppercase text-accent">
                Use-case library
              </p>
              <h2 className="mt-2 text-3xl font-semibold">
                Compare workflows by outcome, effort, and risk.
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/58">
                Each card is a decision starting point. Open one to see mapped
                tools, fit notes, and next-step guidance.
              </p>
            </div>
            <Link className="secondary-button" href="/tools">
              Browse tools
              <ArrowRight aria-hidden="true" size={16} />
            </Link>
          </div>

          <UseCaseList useCases={useCases} />
        </section>
      </div>
    </main>
  );
}

function DecisionTile({
  description,
  icon: Icon,
  title
}: {
  description: string;
  icon: typeof BriefcaseBusiness;
  title: string;
}) {
  return (
    <article className="rounded-2xl border border-line/55 bg-white/42 p-5 shadow-[0_18px_54px_rgb(38_78_162/0.055)] backdrop-blur">
      <Icon aria-hidden="true" className="text-accent" size={22} />
      <h2 className="mt-4 font-semibold">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-ink/62">{description}</p>
    </article>
  );
}
