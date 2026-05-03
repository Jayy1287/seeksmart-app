import type { Metadata } from "next";
import { UseCaseList } from "@/features/use-cases/use-case-list";
import { listUseCaseSummaries } from "@/server/use-cases/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "AI Tool Use Cases",
  description: "Browse AI tools by the job you need done.",
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
      <section className="surface-strong rounded-2xl p-6">
        <p className="eyebrow">Use cases</p>
        <div className="mt-2 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-4xl font-semibold">Browse by job to be done</h1>
            <p className="mt-3 max-w-2xl leading-7 text-ink/65">
              Start with the outcome you want, then compare tools that fit that
              workflow.
            </p>
          </div>
          <div className="metric-tile rounded-xl px-4 py-3 text-sm">
            <div className="text-2xl font-semibold">{useCases.length}</div>
            <div className="text-ink/55">Use cases</div>
          </div>
        </div>
        <p className="mt-4 text-sm text-ink/50">
          {totalMappedTools} tool mappings across curated use cases.
        </p>
      </section>

      <section className="mt-6">
        <UseCaseList useCases={useCases} />
      </section>
      </div>
    </main>
  );
}
