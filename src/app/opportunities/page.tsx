import type { Metadata } from "next";
import { ArrowRight, BriefcaseBusiness, Gauge, ShieldAlert } from "lucide-react";
import { listOpportunitySummaries } from "@/server/intelligence/queries";
import { AnimatedNumber } from "@/components/motion/animated-number";
import { MotionLink } from "@/components/motion/motion-link";
import { Reveal } from "@/components/motion/reveal";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "AI Opportunities",
  description:
    "Browse business AI opportunities before choosing use cases and tools.",
  alternates: {
    canonical: "/opportunities"
  },
  openGraph: {
    title: "AI Opportunities",
    description:
      "Browse business AI opportunities before choosing use cases and tools.",
    url: "/opportunities",
    type: "website"
  }
};

export default async function OpportunitiesPage() {
  const opportunities = await listOpportunitySummaries();
  const opportunityGroups = groupOpportunitiesByFunction(opportunities);

  return (
    <main className="page-shell">
      <div className="app-container">
        <Reveal className="surface-strong rounded-2xl p-6">
          <p className="eyebrow">
            <BriefcaseBusiness aria-hidden="true" size={14} />
            Opportunities
          </p>
          <div className="mt-3 grid gap-5 md:grid-cols-[1fr_260px] md:items-end">
            <div>
              <h1 className="text-4xl font-semibold">
                Business problems worth improving with AI
              </h1>
              <p className="mt-3 max-w-2xl leading-7 text-ink/65">
                Start with the problem that matters, then review the likely
                effort, risk, and outcomes before you chase tools.
              </p>
            </div>
            <div className="metric-tile rounded-xl p-4">
              <div className="text-2xl font-semibold">
                <AnimatedNumber value={opportunities.length} />
              </div>
              <p className="mt-1 text-sm text-ink/55">Mapped opportunities</p>
            </div>
          </div>
        </Reveal>

        <Reveal className="mt-6 rounded-2xl border border-line bg-surface/70 p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold text-ink">Teams</p>
              <p className="mt-1 text-sm text-ink/55">
                {opportunityGroups.length} sections
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {opportunityGroups.map((group) => (
                <a
                  className="status-pill transition hover:border-accent hover:text-accent"
                  href={`#${group.id}`}
                  key={group.id}
                >
                  {group.name}
                </a>
              ))}
            </div>
          </div>
        </Reveal>

        <div className="mt-8 space-y-10">
          {opportunityGroups.map((group) => (
            <section id={group.id} key={group.id} className="scroll-mt-24">
              <Reveal>
                <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="eyebrow">
                      <BriefcaseBusiness aria-hidden="true" size={14} />
                      {group.name}
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold">
                      {group.name} opportunities
                    </h2>
                  </div>
                  <p className="text-sm text-ink/55">
                    {group.opportunities.length}{" "}
                    {group.opportunities.length === 1
                      ? "mapped opportunity"
                      : "mapped opportunities"}
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {group.opportunities.map((opportunity) => (
                    <MotionLink
                      className="surface-panel group flex h-full flex-col rounded-xl p-5 transition hover:-translate-y-1 hover:border-accent"
                      href={`/opportunities/${opportunity.slug}`}
                      key={opportunity.id}
                    >
                      <span className="status-pill w-fit">{group.name}</span>
                      <h3 className="mt-4 text-xl font-semibold">
                        {opportunity.name}
                      </h3>
                      <p className="mt-3 flex-1 text-sm leading-6 text-ink/65">
                        {opportunity.description}
                      </p>
                      <div className="mt-5 grid grid-cols-2 gap-2">
                        <Signal
                          icon={Gauge}
                          label="Effort"
                          value={formatLevel(opportunity.effortLevel)}
                        />
                        <Signal
                          icon={ShieldAlert}
                          label="Risk"
                          value={formatLevel(opportunity.riskLevel)}
                        />
                      </div>
                      <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-accent transition group-hover:translate-x-0.5">
                        View decision path
                        <ArrowRight aria-hidden="true" size={14} />
                      </span>
                    </MotionLink>
                  ))}
                </div>
              </Reveal>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}

function groupOpportunitiesByFunction(
  opportunities: Awaited<ReturnType<typeof listOpportunitySummaries>>
) {
  const groups = new Map<
    string,
    {
      id: string;
      name: string;
      opportunities: typeof opportunities;
    }
  >();

  for (const opportunity of opportunities) {
    const name = opportunity.businessFunction?.name ?? "Other";
    const id = `team-${opportunity.businessFunction?.slug ?? "other"}`;
    const group = groups.get(id);

    if (group) {
      group.opportunities.push(opportunity);
    } else {
      groups.set(id, {
        id,
        name,
        opportunities: [opportunity]
      });
    }
  }

  return Array.from(groups.values());
}

function Signal({
  icon: Icon,
  label,
  value
}: {
  icon: typeof Gauge;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-line bg-surface/70 p-3">
      <div className="flex items-center gap-2 text-xs text-ink/50">
        <Icon aria-hidden="true" size={14} />
        {label}
      </div>
      <div className="mt-1 text-sm font-semibold">{value}</div>
    </div>
  );
}

function formatLevel(value: string) {
  return value.charAt(0) + value.slice(1).toLowerCase();
}
