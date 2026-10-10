import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { HeroAuditDemo } from "@/features/home/hero-audit-demo";
import { playbooks } from "@/lib/platform-content";
import { listCategorySummaries } from "@/server/categories/queries";
import { listIndustrySummaries } from "@/server/intelligence/queries";
import { listUseCaseSummaries } from "@/server/use-cases/queries";
import { MotionLink } from "@/components/motion/motion-link";
import { Reveal } from "@/components/motion/reveal";
import { Stagger, StaggerItem } from "@/components/motion/stagger";

// Home is content-driven; refresh every 10 minutes instead of on every request.
export const revalidate = 600;

const answers = [
  {
    number: "01",
    title: "Where AI pays back first",
    body: "Three opportunities, ranked for your business, with the reason for each."
  },
  {
    number: "02",
    title: "Whether you are ready",
    body: "A readiness score that says pilot now, prepare first, or look closer."
  },
  {
    number: "03",
    title: "What to pilot in two weeks",
    body: "Owner, baseline, target, week-one actions, and the tools to compare."
  }
];

const verticals = [
  {
    slug: "ecommerce",
    name: "Online stores",
    firstWin: "Support replies and product copy, reviewed before they ship."
  },
  {
    slug: "retail-and-hospitality",
    name: "Shops, cafes and venues",
    firstWin: "Reviews answered, posts drafted, the week summarized."
  },
  {
    slug: "local-services",
    name: "Local service businesses",
    firstWin: "Enquiries answered with a quote in minutes, not days."
  }
];

export default async function Home() {
  const [categories, useCases, industries] = await Promise.all([
    listCategorySummaries(),
    listUseCaseSummaries(),
    listIndustrySummaries()
  ]);
  const toolCount = categories.reduce(
    (total, category) => total + category.toolCount,
    0
  );

  return (
    <main>
      <section className="home-hero">
        <div aria-hidden="true" className="home-hero-bg">
          <span />
          <span />
        </div>
        <div className="app-container grid grid-cols-1 items-center gap-14 py-16 md:py-24 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16">
          <Stagger>
            <StaggerItem>
              <h1 className="home-headline">
                Know where AI pays back
                <span className="home-headline-accent"> before you buy a tool.</span>
              </h1>
            </StaggerItem>
            <StaggerItem>
              <p className="home-sub">
                A free three-minute audit for online stores, shops, and local
                service businesses.
              </p>
            </StaggerItem>
            <StaggerItem>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <MotionLink className="primary-button home-cta" href="/audit/questions">
                  Start the audit
                  <ArrowRight aria-hidden="true" size={18} />
                </MotionLink>
                <Link className="home-quiet-link" href="/methodology">
                  How it scores
                  <ArrowUpRight aria-hidden="true" size={15} />
                </Link>
              </div>
              <p className="mt-4 text-sm text-ink/45">No account. Results on screen.</p>
            </StaggerItem>
          </Stagger>
          <Reveal delay={0.2} y={20}>
            <HeroAuditDemo />
          </Reveal>
        </div>
      </section>

      <section className="app-container py-20 md:py-28">
        <Reveal>
          <h2 className="home-h2">Three minutes. Three answers.</h2>
        </Reveal>
        <div className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
          {answers.map((answer, index) => (
            <Reveal className="answer-card" delay={index * 0.08} key={answer.number}>
              <span className="answer-number">{answer.number}</span>
              <h3 className="answer-title">{answer.title}</h3>
              <p className="answer-body">{answer.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="app-container pb-20 md:pb-28">
        <Reveal className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <h2 className="home-h2 max-w-xl">
            Built for the businesses that do the work themselves.
          </h2>
          <Link className="home-quiet-link" href="/industries">
            All industries
            <ArrowUpRight aria-hidden="true" size={15} />
          </Link>
        </Reveal>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {verticals.map((vertical, index) => (
            <Reveal delay={index * 0.08} key={vertical.slug}>
              <MotionLink
                className="vertical-tile"
                href={`/industries/${vertical.slug}`}
              >
                <span aria-hidden="true" className="vertical-ghost">
                  0{index + 1}
                </span>
                <span className="vertical-name">{vertical.name}</span>
                <span className="vertical-win">{vertical.firstWin}</span>
                <span className="vertical-link">
                  Read the guide
                  <ArrowRight aria-hidden="true" size={14} />
                </span>
              </MotionLink>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="app-container pb-20 md:pb-28">
        <Reveal className="ink-band">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <h2 className="ink-band-title">Not a chatbot.</h2>
            <ul className="ink-band-list">
              <li>Rules you can read, the same for everyone.</li>
              <li>A reason on every recommendation.</li>
              <li>Nothing reaches a customer without a person.</li>
            </ul>
          </div>
          <Link className="ink-band-link" href="/methodology">
            Read the methodology
            <ArrowUpRight aria-hidden="true" size={15} />
          </Link>
        </Reveal>
      </section>

      <section className="app-container pb-20 md:pb-28">
        <Reveal className="explore-strip">
          <ExploreLink count={toolCount} href="/tools" label="Tools" />
          <ExploreLink count={useCases.length} href="/use-cases" label="Workflows" />
          <ExploreLink count={industries.length} href="/industries" label="Industries" />
          <ExploreLink count={playbooks.length} href="/playbooks" label="Playbooks" />
        </Reveal>
      </section>

      <section className="app-container pb-24 md:pb-32">
        <Reveal className="text-center">
          <h2 className="home-closing">Find your first AI workflow.</h2>
          <MotionLink
            className="primary-button home-cta mt-8"
            href="/audit/questions"
          >
            Start the audit
            <ArrowRight aria-hidden="true" size={18} />
          </MotionLink>
          <p className="mt-4 text-sm text-ink/45">Three minutes. No account.</p>
        </Reveal>
      </section>
    </main>
  );
}

function ExploreLink({
  count,
  href,
  label
}: {
  count: number;
  href: "/tools" | "/use-cases" | "/industries" | "/playbooks";
  label: string;
}) {
  return (
    <Link className="explore-link" href={href}>
      <span className="explore-count">{count}</span>
      <span className="explore-label">
        {label}
        <ArrowUpRight aria-hidden="true" size={14} />
      </span>
    </Link>
  );
}
