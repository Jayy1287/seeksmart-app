import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, Gauge, Target } from "lucide-react";
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
      <section className="border-b border-line/50 pb-8">
        <p className="eyebrow">
          <Target aria-hidden="true" size={14} />
          Use cases
        </p>
        <div className="mt-2 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-4xl font-semibold">
              Start with the workflow, then choose tools
            </h1>
            <p className="mt-3 max-w-2xl leading-7 text-ink/65">
              Use cases are the bridge between business problems and software.
              Start here when you know the outcome you want but not the tool.
            </p>
          </div>
          <div className="metric-tile rounded-2xl px-4 py-3 text-sm">
            <div className="text-2xl font-semibold">{useCases.length}</div>
            <div className="text-ink/55">Use cases</div>
          </div>
        </div>
        <p className="mt-4 text-sm text-ink/50">
          {totalMappedTools} tool mappings across curated use cases.
        </p>
      </section>

      <section className="mt-8 grid gap-6 md:grid-cols-3">
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
          icon={Target}
          title="Tool fit"
          description="Compare products only after the use case is specific."
        />
      </section>

      <section className="mt-10">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-xl font-semibold">Use-case library</h2>
            <p className="mt-1 text-sm text-ink/55">
              Current mappings are live; richer business metadata comes next.
            </p>
          </div>
          <Link className="secondary-button" href="/audit">
            Preview audit
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
    <article className="border-t border-line/70 pt-5">
      <Icon aria-hidden="true" className="text-accent" size={22} />
      <h2 className="mt-4 font-semibold">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-ink/62">{description}</p>
    </article>
  );
}
