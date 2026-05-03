import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BriefcaseBusiness } from "lucide-react";
import { listBusinessFunctions } from "@/server/intelligence/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "AI by Business Function",
  description:
    "Browse AI opportunities and use cases by business function.",
  alternates: {
    canonical: "/business-functions"
  },
  openGraph: {
    title: "AI by Business Function",
    description:
      "Browse AI opportunities and use cases by business function.",
    url: "/business-functions",
    type: "website"
  }
};

export default async function BusinessFunctionsPage() {
  const functions = await listBusinessFunctions();

  return (
    <main className="page-shell">
      <div className="app-container">
        <section className="surface-strong rounded-2xl p-6">
          <p className="eyebrow">
            <BriefcaseBusiness aria-hidden="true" size={14} />
            Business functions
          </p>
          <h1 className="mt-3 text-4xl font-semibold">
            AI opportunities by team function
          </h1>
          <p className="mt-3 max-w-2xl leading-7 text-ink/65">
            Functions keep recommendations practical by connecting work areas to
            opportunities, use cases, and tool-fit decisions.
          </p>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {functions.map((businessFunction) => (
            <article
              className="surface-panel rounded-xl p-5"
              key={businessFunction.id}
            >
              <BriefcaseBusiness
                aria-hidden="true"
                className="text-accent"
                size={22}
              />
              <h2 className="mt-4 font-semibold">{businessFunction.name}</h2>
              <p className="mt-2 text-sm leading-6 text-ink/62">
                {businessFunction.description}
              </p>
              <div className="mt-5 grid grid-cols-2 gap-2">
                <div className="metric-tile rounded-lg p-3">
                  <div className="font-semibold">
                    {businessFunction.useCaseCount}
                  </div>
                  <div className="mt-1 text-xs text-ink/50">Use cases</div>
                </div>
                <div className="metric-tile rounded-lg p-3">
                  <div className="font-semibold">
                    {businessFunction.opportunityCount}
                  </div>
                  <div className="mt-1 text-xs text-ink/50">Opportunities</div>
                </div>
              </div>
            </article>
          ))}
        </section>

        <section className="surface-strong mt-8 rounded-2xl p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold">
                Move from function to opportunity
              </h2>
              <p className="mt-2 text-sm leading-6 text-ink/60">
                Opportunities are the next decision layer between a business
                function and a tool shortlist.
              </p>
            </div>
            <Link className="primary-button" href="/opportunities">
              Browse opportunities
              <ArrowRight aria-hidden="true" size={16} />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
