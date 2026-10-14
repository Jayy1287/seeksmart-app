import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { listIndustrySummaries } from "@/server/intelligence/queries";
import { AnimatedNumber } from "@/components/motion/animated-number";
import { Reveal } from "@/components/motion/reveal";
import { SplitReveal } from "@/components/motion/split-reveal";
import { Stagger, StaggerItem } from "@/components/motion/stagger";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "AI by Industry",
  description:
    "Explore practical AI opportunities, starting points, and cautions by industry.",
  alternates: {
    canonical: "/industries"
  },
  openGraph: {
    title: "AI by Industry",
    description:
      "Explore practical AI opportunities, starting points, and cautions by industry.",
    url: "/industries",
    type: "website"
  }
};

// The three verticals SeekSmart goes deep on, with a hand-written guide each.
const featured = [
  {
    slug: "ecommerce",
    label: "Online stores",
    firstWin: "Support replies and product copy, reviewed before they ship."
  },
  {
    slug: "retail-and-hospitality",
    label: "Shops, cafes & venues",
    firstWin: "Reviews answered, posts drafted, the week summarized."
  },
  {
    slug: "local-services",
    label: "Local services",
    firstWin: "Enquiries answered with a quote in minutes, not days."
  }
];

export default async function IndustriesPage() {
  const industries = await listIndustrySummaries();
  const featuredSlugs = new Set(featured.map((item) => item.slug));
  const bySlug = new Map(industries.map((industry) => [industry.slug, industry]));
  const featuredRows = featured.filter((item) => bySlug.has(item.slug));
  const others = industries.filter((industry) => !featuredSlugs.has(industry.slug));
  const totalPaths = industries.reduce((total, industry) => total + industry.opportunityCount, 0);

  return (
    <main>
      <section className="app-container page-hero">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            <Reveal>
              <p className="eyebrow">Industries</p>
            </Reveal>
            <SplitReveal
              className="h1 mt-6 max-w-4xl"
              lines={[["Where AI pays back"], [{ text: "in your trade.", className: "ghost-word" }]]}
            />
            <Reveal delay={0.4}>
              <p className="lead mt-6">Starting points, first workflows and cautions for {industries.length} business types.</p>
            </Reveal>
          </div>
          <Stagger className="grid grid-cols-2 gap-8 lg:gap-12" delay={0.3}>
            {[
              { value: industries.length, label: "Industries" },
              { value: totalPaths, label: "Mapped paths" }
            ].map((stat) => (
              <StaggerItem className="border-t border-ink/15 pt-3 lg:min-w-40" key={stat.label}>
                <span className="stat-number block text-[clamp(2.6rem,5vw,4rem)]">
                  <AnimatedNumber value={stat.value} />
                </span>
                <span className="mt-1 block text-sm text-ink/55">{stat.label}</span>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ---------- Featured verticals ---------- */}
      {featuredRows.length > 0 ? (
        <section className="app-container pb-20 md:pb-28">
          <Reveal className="mb-6 flex items-baseline justify-between gap-4">
            <p className="eyebrow">In depth</p>
            <p className="font-mono text-xs text-ink/40">Full guides</p>
          </Reveal>
          <Stagger as="ul" className="row-list" inView>
            {featuredRows.map((item, index) => {
              const industry = bySlug.get(item.slug)!;
              return (
                <StaggerItem as="li" key={item.slug}>
                  <Link
                    className="row-item group grid-cols-[auto_minmax(0,1fr)_auto] gap-x-5 gap-y-3 py-8 md:grid-cols-[4rem_minmax(0,1.2fr)_minmax(0,1fr)_6rem_auto] md:gap-8 md:py-11"
                    href={`/industries/${item.slug}`}
                  >
                    <span className="self-start pt-2 font-mono text-sm text-signal md:self-center md:pt-0">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="font-display text-[2rem] font-bold leading-[0.95] tracking-[-0.045em] transition-transform duration-500 ease-out group-hover:translate-x-2 md:text-[3.4rem]">
                      {item.label}
                    </span>
                    <span className="col-span-2 col-start-2 row-start-2 text-ink/55 md:col-span-1 md:col-start-3 md:row-start-1 md:text-lg">
                      {item.firstWin}
                    </span>
                    <span className="col-span-2 col-start-2 row-start-3 font-mono text-sm text-ink/45 md:col-span-1 md:col-start-4 md:row-start-1 md:text-right">
                      <span className="text-ink md:block md:text-2xl">{industry.opportunityCount}</span>
                      <span> paths</span>
                    </span>
                    <span className="row-arrow col-start-3 row-start-1 self-start md:col-start-5 md:self-center">
                      <ArrowRight aria-hidden="true" size={16} />
                    </span>
                  </Link>
                </StaggerItem>
              );
            })}
          </Stagger>
        </section>
      ) : null}

      {/* ---------- All other industries ---------- */}
      <section className="app-container pb-24 md:pb-32">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <SplitReveal
            as="h2"
            className="h2"
            inView
            lines={[["Every other"], [{ text: "business type.", className: "ghost-word" }]]}
          />
          <Reveal>
            <p className="font-mono text-sm text-ink/45">{String(others.length).padStart(2, "0")} maps</p>
          </Reveal>
        </div>
        <Stagger as="ul" className="grid border-t border-ink/[0.12] md:grid-cols-2 md:gap-x-12" gap={0.03} inView>
          {others.map((industry) => (
            <StaggerItem as="li" key={industry.slug}>
              <Link
                className="row-item group h-full grid-cols-[minmax(0,1fr)_auto] gap-x-4 py-5"
                href={`/industries/${industry.slug}`}
                id={industry.slug}
              >
                <span className="min-w-0">
                  <span className="block font-display text-[1.3rem] font-semibold tracking-[-0.025em] transition-transform duration-500 ease-out group-hover:translate-x-1.5">
                    {industry.name}
                  </span>
                  {industry.startingPoint ?? industry.description ? (
                    <span className="mt-1 text-sm text-ink/50 line-clamp-1">
                      {industry.startingPoint ?? industry.description}
                    </span>
                  ) : null}
                </span>
                <span className="flex items-center gap-4">
                  <span className="font-mono text-sm text-ink/45">{industry.opportunityCount}</span>
                  <span className="row-arrow">
                    <ArrowRight aria-hidden="true" size={15} />
                  </span>
                </span>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </section>
    </main>
  );
}
