import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { listBusinessFunctions } from "@/server/intelligence/queries";
import { Reveal } from "@/components/motion/reveal";
import { SplitReveal } from "@/components/motion/split-reveal";
import { Stagger, StaggerItem } from "@/components/motion/stagger";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "AI by Business Function",
  description: "Browse AI opportunities and use cases by business function.",
  alternates: {
    canonical: "/business-functions"
  },
  openGraph: {
    title: "AI by Business Function",
    description: "Browse AI opportunities and use cases by business function.",
    url: "/business-functions",
    type: "website"
  }
};

export default async function BusinessFunctionsPage() {
  const functions = await listBusinessFunctions();

  return (
    <main>
      <section className="app-container page-hero">
        <Reveal>
          <p className="eyebrow">Business functions</p>
        </Reveal>
        <SplitReveal
          className="h1 mt-6 max-w-4xl"
          lines={[["Pick the team."], [{ text: "See the work AI takes.", className: "ghost-word" }]]}
        />
        <Reveal delay={0.4}>
          <p className="lead mt-6">{functions.length} functions, each mapped to workflows and the problems they fix.</p>
        </Reveal>
      </section>

      <section className="app-container pb-24 md:pb-32">
        <div className="hidden grid-cols-[3rem_minmax(0,1fr)_minmax(0,1fr)_6rem_7rem_auto] gap-6 pb-3 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-ink/40 md:grid">
          <span />
          <span>Function</span>
          <span />
          <span className="text-right">Workflows</span>
          <span className="text-right">Problems</span>
          <span className="w-9" />
        </div>
        <Stagger as="ul" className="row-list" gap={0.05} inView>
          {functions.map((businessFunction, index) => (
            <StaggerItem as="li" key={businessFunction.id}>
              <Link
                className="row-item group grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-2 py-6 md:grid-cols-[3rem_minmax(0,1fr)_minmax(0,1fr)_6rem_7rem_auto] md:gap-6 md:py-8"
                href={`/use-cases#${businessFunction.slug}`}
              >
                <span className="hidden font-mono text-sm text-ink/40 md:block">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="font-display text-[1.6rem] font-bold leading-none tracking-[-0.04em] transition-transform duration-500 ease-out group-hover:translate-x-2 md:text-[2.2rem]">
                  {businessFunction.name}
                </span>
                <span className="col-span-2 row-start-2 text-ink/55 md:col-span-1 md:col-start-3 md:row-start-1 md:line-clamp-2">
                  {businessFunction.description}
                </span>
                <span className="col-span-2 row-start-3 flex gap-4 font-mono text-sm md:contents">
                  <span className="md:text-right">
                    <span className="text-ink md:text-xl">{businessFunction.useCaseCount}</span>
                    <span className="text-ink/40 md:hidden"> workflows</span>
                  </span>
                  <span className="md:text-right">
                    <span className="text-ink md:text-xl">{businessFunction.opportunityCount}</span>
                    <span className="text-ink/40 md:hidden"> problems</span>
                  </span>
                </span>
                <span className="row-arrow col-start-2 row-start-1 md:col-start-6">
                  <ArrowRight aria-hidden="true" size={16} />
                </span>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
        <Reveal className="mt-10 flex flex-wrap gap-6">
          <Link className="link-underline" href="/opportunities">
            Browse opportunities
            <ArrowUpRight aria-hidden="true" size={15} />
          </Link>
          <Link className="link-underline" href="/use-cases">
            Browse all use cases
            <ArrowUpRight aria-hidden="true" size={15} />
          </Link>
        </Reveal>
      </section>
    </main>
  );
}
