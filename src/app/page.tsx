import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { HeroAuditDemo } from "@/features/home/hero-audit-demo";
import { HowItWorks } from "@/features/home/how-it-works";
import { playbooks } from "@/lib/platform-content";
import { listCategorySummaries } from "@/server/categories/queries";
import { listIndustrySummaries } from "@/server/intelligence/queries";
import { listToolLogos } from "@/server/tools/queries";
import { listUseCaseSummaries } from "@/server/use-cases/queries";
import { AnimatedNumber } from "@/components/motion/animated-number";
import { Magnetic } from "@/components/motion/magnetic";
import { Marquee } from "@/components/motion/marquee";
import { Reveal } from "@/components/motion/reveal";
import { RotatingWords } from "@/components/motion/rotating-words";
import { SplitReveal } from "@/components/motion/split-reveal";
import { Stagger, StaggerItem } from "@/components/motion/stagger";

// Home is content-driven; refresh every 10 minutes instead of on every request.
export const revalidate = 600;

const verticals = [
  {
    slug: "ecommerce",
    name: "Online stores",
    firstWin: "Support replies and product copy, reviewed before they ship."
  },
  {
    slug: "retail-and-hospitality",
    name: "Shops, cafes & venues",
    firstWin: "Reviews answered, posts drafted, the week summarized."
  },
  {
    slug: "local-services",
    name: "Local services",
    firstWin: "Enquiries answered with a quote in minutes, not days."
  }
];

const principles = [
  { title: "Readable rules", body: "Same scoring for everyone. No black box." },
  { title: "A reason for every pick", body: "Each recommendation says why it ranked." },
  { title: "A person signs off", body: "Nothing reaches a customer unreviewed." }
];

export default async function Home() {
  const [categories, useCases, industries, logos] = await Promise.all([
    listCategorySummaries(),
    listUseCaseSummaries(),
    listIndustrySummaries(),
    listToolLogos(36)
  ]);
  const toolCount = categories.reduce((total, category) => total + category.toolCount, 0);
  const half = Math.ceil(logos.length / 2);

  return (
    <main>
      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="grid-lines absolute inset-0 mask-fade-b opacity-60 [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]" />
          <div className="glow-orb -right-40 top-10 h-[34rem] w-[34rem] opacity-30" />
        </div>
        <div className="app-container relative grid items-center gap-14 pb-20 pt-12 md:pt-20 lg:grid-cols-2 lg:gap-12 lg:pb-28">
          <div>
            <Stagger>
              <StaggerItem>
                <span className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-surface/70 py-1 pl-1 pr-3 text-[0.8rem] text-ink/70 backdrop-blur">
                  <span className="rounded-full bg-ink px-2 py-0.5 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-paper">
                    Free
                  </span>
                  A three-minute AI audit
                </span>
              </StaggerItem>
            </Stagger>
            <SplitReveal
              className="display mt-7"
              delay={0.1}
              lines={[["Know where AI"], ["pays back", { text: ".", className: "accent-word" }]]}
            />
            <Stagger delay={0.55}>
              <StaggerItem>
                <p className="lead mt-7">
                  Ranked AI workflows for your
                  <br />
                  <RotatingWords
                    className="font-semibold text-ink"
                    words={["online store", "café", "salon", "clinic", "agency", "shop"]}
                  />
                  , before you spend a cent on tools.
                </p>
              </StaggerItem>
              <StaggerItem>
                <div className="mt-9 flex flex-wrap items-center gap-3">
                  <Magnetic>
                    <Link className="btn btn-primary btn-lg" href="/audit/questions">
                      Start the audit
                      <ArrowRight aria-hidden="true" size={18} />
                    </Link>
                  </Magnetic>
                  <Link className="btn btn-ghost btn-lg" href="/methodology">
                    How it scores
                  </Link>
                </div>
                <p className="mt-5 flex items-center gap-2 text-sm text-ink/50">
                  <span className="h-1.5 w-1.5 rounded-full bg-success" />
                  No account. Results on screen.
                </p>
              </StaggerItem>
            </Stagger>
          </div>
          <Reveal delay={0.35} y={40}>
            <HeroAuditDemo />
          </Reveal>
        </div>
      </section>

      {/* ---------- Logo marquee ---------- */}
      {logos.length > 0 ? (
        <section aria-label="Tools in the directory" className="border-y border-ink/[0.08] py-10">
          <div className="app-container mb-7 flex flex-wrap items-baseline justify-between gap-3">
            <p className="eyebrow eyebrow-plain">
              {toolCount} tools researched, priced and compared
            </p>
            <Link className="link-underline text-sm" href="/tools">
              Browse the directory
              <ArrowUpRight aria-hidden="true" size={14} />
            </Link>
          </div>
          <div className="grid gap-3">
            <Marquee duration={60} gap="0.75rem">
              {logos.slice(0, half).map((tool) => (
                <LogoPill key={tool.slug} {...tool} />
              ))}
            </Marquee>
            <Marquee duration={70} gap="0.75rem" reverse>
              {logos.slice(half).map((tool) => (
                <LogoPill key={tool.slug} {...tool} />
              ))}
            </Marquee>
          </div>
        </section>
      ) : null}

      {/* ---------- How it works ---------- */}
      <section className="app-container section">
        <HowItWorks />
      </section>

      {/* ---------- Industries ---------- */}
      <section className="app-container pb-24 md:pb-36">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Reveal>
              <p className="eyebrow">Built for</p>
            </Reveal>
            <SplitReveal
              as="h2"
              className="h2 mt-5 max-w-2xl"
              inView
              lines={[["Businesses that do"], [{ text: "the work themselves.", className: "ghost-word" }]]}
            />
          </div>
          <Reveal>
            <Link className="link-underline" href="/industries">
              All {industries.length} industries
              <ArrowUpRight aria-hidden="true" size={15} />
            </Link>
          </Reveal>
        </div>
        <Stagger as="div" className="row-list mt-12" inView>
          {verticals.map((vertical, index) => (
            <StaggerItem key={vertical.slug}>
              <Link
                className="row-item group grid-cols-[auto_1fr_auto] gap-5 py-7 md:grid-cols-[5rem_minmax(0,1fr)_minmax(0,1fr)_auto] md:gap-8 md:py-9"
                href={`/industries/${vertical.slug}`}
              >
                <span className="font-mono text-sm text-ink/40">0{index + 1}</span>
                <span className="font-display text-[1.7rem] font-bold leading-none tracking-[-0.04em] transition-transform duration-500 ease-out group-hover:translate-x-2 md:text-[2.6rem]">
                  {vertical.name}
                </span>
                <span className="col-span-3 col-start-2 row-start-2 text-ink/55 md:col-span-1 md:col-start-3 md:row-start-1">
                  {vertical.firstWin}
                </span>
                <span className="row-arrow col-start-3 row-start-1 md:col-start-4">
                  <ArrowRight aria-hidden="true" size={16} />
                </span>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* ---------- Principles (night) ---------- */}
      <section className="app-container pb-24 md:pb-36">
        <div className="night spotlight spotlight-strong rounded-[2rem] px-6 py-14 sm:px-10 md:rounded-[2.5rem] md:px-16 md:py-24" data-spotlight>
          <div aria-hidden="true" className="dot-grid absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_80%_20%,black,transparent_60%)]" />
          <div className="relative grid gap-14 lg:grid-cols-[1fr_1fr] lg:items-end">
            <div>
              <p className="eyebrow">Method</p>
              <SplitReveal
                as="h2"
                className="mt-6 font-display text-[clamp(3rem,8vw,6.5rem)] font-bold leading-[0.9] tracking-[-0.05em] text-white"
                inView
                lines={[["Not a"], [{ text: "chatbot.", className: "text-signal" }]]}
              />
            </div>
            <Stagger as="ol" className="grid gap-px overflow-hidden rounded-3xl bg-white/10" inView>
              {principles.map((principle, index) => (
                <StaggerItem as="li" className="flex gap-5 bg-night p-6 md:p-7" key={principle.title}>
                  <span className="font-mono text-sm text-signal">0{index + 1}</span>
                  <div>
                    <p className="text-lg font-medium text-white">{principle.title}</p>
                    <p className="mt-1 text-sm text-white/50">{principle.body}</p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
          <Link className="link-underline relative mt-12 text-white/80 hover:text-white" href="/methodology">
            Read the methodology
            <ArrowUpRight aria-hidden="true" size={15} />
          </Link>
        </div>
      </section>

      {/* ---------- Numbers ---------- */}
      <section className="app-container pb-24 md:pb-36">
        <Stagger className="grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4" inView>
          {[
            { count: toolCount, label: "Tools", href: "/tools" as const },
            { count: useCases.length, label: "Workflows", href: "/use-cases" as const },
            { count: industries.length, label: "Industries", href: "/industries" as const },
            { count: playbooks.length, label: "Playbooks", href: "/playbooks" as const }
          ].map((item) => (
            <StaggerItem key={item.label}>
              <Link className="group block border-t border-ink/15 pt-5" href={item.href}>
                <span className="stat-number block text-[clamp(3.5rem,8vw,6.5rem)] transition-colors duration-300 group-hover:text-signal">
                  <AnimatedNumber value={item.count} />
                </span>
                <span className="mt-3 flex items-center gap-1.5 text-ink/60 group-hover:text-ink">
                  {item.label}
                  <ArrowUpRight
                    aria-hidden="true"
                    className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    size={15}
                  />
                </span>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </section>
    </main>
  );
}

function LogoPill({ logoUrl, name, slug }: { logoUrl: string | null; name: string; slug: string }) {
  return (
    <Link
      className="flex shrink-0 items-center gap-2.5 rounded-full border border-ink/[0.08] bg-surface py-2 pl-2 pr-4 text-sm font-medium text-ink/75 transition-colors hover:border-ink/30 hover:text-ink"
      href={`/tools/${slug}`}
    >
      <span className="relative h-7 w-7 overflow-hidden rounded-full bg-white ring-1 ring-ink/5">
        {logoUrl ? (
          <Image alt="" className="object-contain p-1" fill sizes="28px" src={logoUrl} unoptimized />
        ) : null}
      </span>
      {name}
    </Link>
  );
}
