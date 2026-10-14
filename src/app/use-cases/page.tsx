import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { UseCaseList } from "@/features/use-cases/use-case-list";
import { listUseCaseSummaries } from "@/server/use-cases/queries";
import { AnimatedNumber } from "@/components/motion/animated-number";
import { Reveal } from "@/components/motion/reveal";
import { SplitReveal } from "@/components/motion/split-reveal";
import { Stagger, StaggerItem } from "@/components/motion/stagger";

export const revalidate = 3600;

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
  const totalMappedTools = useCases.reduce((total, useCase) => total + useCase.toolCount, 0);
  const teams = new Set(useCases.map((useCase) => useCase.businessFunction?.slug ?? "other")).size;

  return (
    <main>
      <section className="app-container page-hero">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            <Reveal>
              <p className="eyebrow">Use cases</p>
            </Reveal>
            <SplitReveal
              className="h1 mt-6 max-w-4xl"
              lines={[["Start with the job."], [{ text: "Then pick the tool.", className: "ghost-word" }]]}
            />
            <Reveal delay={0.4}>
              <p className="lead mt-6">
                {useCases.length} workflows, ranked by effort and risk, each with a tool shortlist.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link className="btn btn-primary" href="/audit/questions">
                  Rank them for my business
                  <ArrowRight aria-hidden="true" size={16} />
                </Link>
                <Link className="btn btn-ghost" href="/tools">
                  Browse tools
                </Link>
              </div>
            </Reveal>
          </div>
          <Stagger className="grid grid-cols-3 gap-6 sm:gap-10 lg:grid-cols-1 lg:gap-6" delay={0.3}>
            {[
              { value: useCases.length, label: "Workflows" },
              { value: teams, label: "Teams" },
              { value: totalMappedTools, label: "Tool fits" }
            ].map((stat) => (
              <StaggerItem className="border-t border-ink/15 pt-3 lg:min-w-48" key={stat.label}>
                <span className="stat-number block text-[clamp(2.4rem,5vw,3.6rem)]">
                  <AnimatedNumber value={stat.value} />
                </span>
                <span className="mt-1 block text-sm text-ink/55">{stat.label}</span>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section aria-label={`Use-case library across ${teams} teams`} className="app-container pb-24 md:pb-32">
        <Reveal y={20}>
          <UseCaseList useCases={useCases} />
        </Reveal>
      </section>
    </main>
  );
}
