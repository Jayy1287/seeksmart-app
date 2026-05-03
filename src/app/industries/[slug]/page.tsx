import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Building2, CheckCircle2, ShieldAlert } from "lucide-react";
import { playbooks } from "@/lib/platform-content";
import { getIndustryBySlug } from "@/server/intelligence/queries";

export const dynamic = "force-dynamic";

type IndustryPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params
}: IndustryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const industry = await getIndustryBySlug(slug);

  if (!industry) {
    return {
      title: "Industry not found"
    };
  }

  return {
    title: `${industry.name} AI Roadmap`,
    description: industry.description ?? `AI roadmap for ${industry.name}.`,
    alternates: {
      canonical: `/industries/${industry.slug}`
    },
    openGraph: {
      title: `${industry.name} AI Roadmap`,
      description: industry.description ?? `AI roadmap for ${industry.name}.`,
      url: `/industries/${industry.slug}`,
      type: "website"
    }
  };
}

export default async function IndustryPage({ params }: IndustryPageProps) {
  const { slug } = await params;
  const industry = await getIndustryBySlug(slug);

  if (!industry) {
    notFound();
  }

  return (
    <main className="page-shell">
      <div className="app-container">
        <section className="surface-strong rounded-2xl p-6">
          <Link className="text-sm font-medium text-accent" href="/industries">
            Industries
          </Link>
          <div className="mt-4 grid gap-6 md:grid-cols-[1fr_280px] md:items-end">
            <div>
              <Building2 aria-hidden="true" className="text-accent" size={28} />
              <h1 className="mt-4 text-4xl font-semibold">
                {industry.name} AI roadmap
              </h1>
              <p className="mt-3 max-w-2xl leading-7 text-ink/65">
                {industry.description}
              </p>
            </div>
            <div className="metric-tile rounded-xl p-4">
              <div className="text-2xl font-semibold">
                {industry.opportunities.length}
              </div>
              <p className="mt-1 text-sm text-ink/55">
                Priority opportunities
              </p>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="surface-panel rounded-xl p-5">
            <h2 className="text-xl font-semibold">Where to start</h2>
            <p className="mt-3 leading-7 text-ink/65">
              {industry.startingPoint}
            </p>
            <div className="mt-5 grid gap-3">
              {industry.opportunities.map((opportunity) => (
                <div
                  className="flex items-start gap-3 rounded-xl border border-line bg-surface/70 p-4"
                  key={opportunity.id}
                >
                  <CheckCircle2
                    aria-hidden="true"
                    className="mt-0.5 shrink-0 text-accent"
                    size={18}
                  />
                  <div>
                    <Link
                      className="font-semibold hover:text-accent"
                      href={`/opportunities/${opportunity.slug}`}
                    >
                      {opportunity.name}
                    </Link>
                    <p className="mt-1 text-sm leading-6 text-ink/58">
                      {opportunity.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside className="grid gap-4">
            <div className="surface-panel rounded-xl p-5">
              <div className="flex items-start gap-3">
                <ShieldAlert
                  aria-hidden="true"
                  className="mt-0.5 shrink-0 text-signal"
                  size={20}
                />
                <div>
                  <h2 className="font-semibold">Caution</h2>
                  <p className="mt-2 text-sm leading-6 text-ink/62">
                    {industry.cautions}
                  </p>
                </div>
              </div>
            </div>
            <div className="surface-strong rounded-xl p-5">
              <h2 className="font-semibold">Recommended next playbooks</h2>
              <div className="mt-4 grid gap-3">
                {playbooks.slice(0, 2).map((playbook) => (
                  <Link
                    className="rounded-lg border border-line bg-surface/70 p-3 text-sm transition hover:border-accent"
                    href={`/playbooks/${playbook.slug}`}
                    key={playbook.slug}
                  >
                    <span className="font-medium">{playbook.title}</span>
                    <span className="mt-1 block leading-6 text-ink/55">
                      {playbook.outcome}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </section>

        <section className="surface-strong mt-8 rounded-2xl p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold">
                Turn this into a business-specific audit
              </h2>
              <p className="mt-2 text-sm leading-6 text-ink/60">
                The first audit version will use structured rules and taxonomy,
                not a model call, to recommend where to start.
              </p>
            </div>
            <Link className="primary-button" href="/audit">
              Open audit preview
              <ArrowRight aria-hidden="true" size={16} />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
