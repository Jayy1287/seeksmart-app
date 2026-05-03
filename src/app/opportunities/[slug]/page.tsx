import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, Gauge, ShieldAlert, Target } from "lucide-react";
import { getOpportunityBySlug } from "@/server/intelligence/queries";

export const dynamic = "force-dynamic";

type OpportunityPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params
}: OpportunityPageProps): Promise<Metadata> {
  const { slug } = await params;
  const opportunity = await getOpportunityBySlug(slug);

  if (!opportunity) {
    return {
      title: "Opportunity not found"
    };
  }

  return {
    title: opportunity.name,
    description:
      opportunity.description ?? `AI opportunity plan for ${opportunity.name}.`,
    alternates: {
      canonical: `/opportunities/${opportunity.slug}`
    },
    openGraph: {
      title: opportunity.name,
      description:
        opportunity.description ?? `AI opportunity plan for ${opportunity.name}.`,
      url: `/opportunities/${opportunity.slug}`,
      type: "website"
    }
  };
}

export default async function OpportunityPage({
  params
}: OpportunityPageProps) {
  const { slug } = await params;
  const opportunity = await getOpportunityBySlug(slug);

  if (!opportunity) {
    notFound();
  }

  return (
    <main className="page-shell">
      <div className="app-container">
        <section className="surface-strong rounded-2xl p-6">
          <Link
            className="text-sm font-medium text-accent"
            href="/opportunities"
          >
            Opportunities
          </Link>
          <div className="mt-4 grid gap-6 md:grid-cols-[1fr_320px] md:items-end">
            <div>
              <p className="text-sm font-medium uppercase text-accent">
                {opportunity.businessFunction?.name ?? "Business opportunity"}
              </p>
              <h1 className="mt-2 text-4xl font-semibold">
                {opportunity.name}
              </h1>
              <p className="mt-3 max-w-2xl leading-7 text-ink/65">
                {opportunity.description}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Metric
                icon={Gauge}
                label="Effort"
                value={formatLevel(opportunity.effortLevel)}
              />
              <Metric
                icon={ShieldAlert}
                label="Risk"
                value={formatLevel(opportunity.riskLevel)}
              />
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <div className="surface-panel rounded-xl p-5">
            <h2 className="text-xl font-semibold">Decision brief</h2>
            <div className="mt-5 grid gap-4">
              <Brief label="Pain point" value={opportunity.painPoint} />
              <Brief
                label="Expected benefit"
                value={opportunity.expectedBenefit}
              />
              <Brief label="Starting point" value={opportunity.startingPoint} />
              <Brief label="Time to value" value={opportunity.timeToValue} />
            </div>
          </div>

          <aside className="surface-strong rounded-xl p-5">
            <h2 className="text-xl font-semibold">Success metrics</h2>
            <div className="mt-4 grid gap-2">
              {opportunity.successMetrics.map((metric) => (
                <div
                  className="flex items-start gap-2 text-sm leading-6 text-ink/62"
                  key={metric}
                >
                  <CheckCircle2
                    aria-hidden="true"
                    className="mt-0.5 shrink-0 text-accent"
                    size={15}
                  />
                  <span>{metric}</span>
                </div>
              ))}
            </div>
          </aside>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="surface-panel rounded-xl p-5">
            <h2 className="text-xl font-semibold">Mapped use cases</h2>
            <div className="mt-4 grid gap-3">
              {opportunity.useCases.map((useCase) => (
                <Link
                  className="rounded-xl border border-line bg-surface/70 p-4 transition hover:border-accent"
                  href={`/use-cases/${useCase.slug}`}
                  key={useCase.id}
                >
                  <div className="flex items-start gap-3">
                    <Target
                      aria-hidden="true"
                      className="mt-0.5 shrink-0 text-accent"
                      size={18}
                    />
                    <div>
                      <h3 className="font-semibold">{useCase.name}</h3>
                      <p className="mt-1 text-sm leading-6 text-ink/58">
                        {useCase.outcome ?? useCase.description}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="surface-panel rounded-xl p-5">
            <h2 className="text-xl font-semibold">Industry fit</h2>
            <div className="mt-4 grid gap-3">
              {opportunity.industries.map((industry) => (
                <Link
                  className="rounded-xl border border-line bg-surface/70 p-4 transition hover:border-accent"
                  href={`/industries/${industry.slug}`}
                  key={industry.id}
                >
                  <h3 className="font-semibold">{industry.name}</h3>
                  <p className="mt-1 text-sm leading-6 text-ink/58">
                    {industry.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="surface-strong mt-8 rounded-2xl p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold">
                Continue from opportunity to tools
              </h2>
              <p className="mt-2 text-sm leading-6 text-ink/60">
                Use the mapped use cases to choose a workflow, then compare
                tools by fit.
              </p>
            </div>
            <Link className="primary-button" href="/use-cases">
              Browse use cases
              <ArrowRight aria-hidden="true" size={16} />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

function Brief({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="rounded-xl border border-line bg-surface/70 p-4">
      <p className="text-xs font-semibold uppercase text-accent">{label}</p>
      <p className="mt-2 text-sm leading-6 text-ink/65">
        {value ?? "Needs curation."}
      </p>
    </div>
  );
}

function Metric({
  icon: Icon,
  label,
  value
}: {
  icon: typeof Gauge;
  label: string;
  value: string;
}) {
  return (
    <div className="metric-tile rounded-xl p-4">
      <Icon aria-hidden="true" className="text-accent" size={18} />
      <div className="mt-2 text-lg font-semibold">{value}</div>
      <p className="mt-1 text-sm text-ink/55">{label}</p>
    </div>
  );
}

function formatLevel(value: string) {
  return value.charAt(0) + value.slice(1).toLowerCase();
}
