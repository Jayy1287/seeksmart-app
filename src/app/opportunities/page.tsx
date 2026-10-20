import type { Metadata } from "next";
import { listOpportunitySummaries } from "@/server/intelligence/queries";
import { easeScore } from "@/features/opportunities/ease";
import { OpportunityRow } from "@/features/opportunities/opportunity-row";
import { AnimatedNumber } from "@/components/motion/animated-number";
import { Reveal } from "@/components/motion/reveal";
import { SplitReveal } from "@/components/motion/split-reveal";
import { Stagger, StaggerItem } from "@/components/motion/stagger";

export const revalidate = 3600;

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
  const quickWins = opportunities.filter(
    (opportunity) => easeScore(opportunity.effortLevel, opportunity.riskLevel) >= 80
  ).length;

  return (
    <main>
      <section className="app-container page-hero">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            <Reveal>
              <p className="eyebrow">Opportunities</p>
            </Reveal>
            <SplitReveal
              className="h1 mt-6 max-w-4xl"
              lines={[["Problems worth fixing."], [{ text: "Before any tool.", className: "ghost-word" }]]}
            />
            <Reveal delay={0.4}>
              <p className="lead mt-6">Each one scored for ease to start, from effort and risk.</p>
            </Reveal>
          </div>
          <Stagger className="grid grid-cols-3 gap-6 sm:gap-10" delay={0.3}>
            {[
              { value: opportunities.length, label: "Problems" },
              { value: quickWins, label: "Easy starts" },
              { value: opportunityGroups.length, label: "Teams" }
            ].map((stat) => (
              <StaggerItem className="border-t border-ink/15 pt-3 sm:min-w-28" key={stat.label}>
                <span className="stat-number block text-[clamp(2.4rem,5vw,3.6rem)]">
                  <AnimatedNumber value={stat.value} />
                </span>
                <span className="mt-1 block text-sm text-ink/55">{stat.label}</span>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="app-container pb-24 md:pb-32">
        <Reveal>
          <nav
            aria-label="Teams"
            className="-mx-4 flex gap-2 overflow-x-auto border-b border-ink/10 px-4 pb-5 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden"
          >
            {opportunityGroups.map((group) => (
              <a className="chip shrink-0" href={`#${group.id}`} key={group.id}>
                {group.name}
                <span className="font-mono text-[0.7rem] opacity-50">{group.opportunities.length}</span>
              </a>
            ))}
          </nav>
        </Reveal>

        <div className="mt-12 grid gap-16 md:mt-16 md:gap-24">
          {opportunityGroups.map((group) => (
            <section className="scroll-mt-28" id={group.id} key={group.id}>
              <div className="mb-4 flex items-end justify-between gap-4 md:mb-6">
                <SplitReveal
                  as="h2"
                  className="font-display text-[2rem] font-bold leading-none tracking-[-0.04em] md:text-[3rem]"
                  inView
                  lines={[[group.name]]}
                />
                <span className="pb-1 font-mono text-sm text-ink/40">
                  {String(group.opportunities.length).padStart(2, "0")}
                </span>
              </div>
              <Stagger as="ul" className="row-list" gap={0.05} inView>
                {group.opportunities.map((opportunity, index) => (
                  <StaggerItem as="li" key={opportunity.id}>
                    <OpportunityRow highlight={index === 0} opportunity={opportunity} />
                  </StaggerItem>
                ))}
              </Stagger>
            </section>
          ))}
        </div>
      </section>
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

  // Easiest to start first inside each team.
  for (const group of groups.values()) {
    group.opportunities.sort(
      (a, b) => easeScore(b.effortLevel, b.riskLevel) - easeScore(a.effortLevel, a.riskLevel)
    );
  }

  return Array.from(groups.values());
}
