import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, ArrowUpRight, BarChart3, Heart, Plus } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { listSavedAuditRuns } from "@/server/audit-runs/queries";
import { listLikedToolsForUser, type LikedTool } from "@/server/tools/likes";
import { ToolLikeButton } from "@/features/tools/tool-like-button";
import { ToolLogo } from "@/features/tools/tool-logo";
import { AnimatedNumber } from "@/components/motion/animated-number";
import { Magnetic } from "@/components/motion/magnetic";
import { Reveal } from "@/components/motion/reveal";
import { SplitReveal } from "@/components/motion/split-reveal";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { ScoreDial } from "@/components/ui/score-dial";
import { EmptyState } from "@/components/state-surfaces";
import { getFeaturedIndustry } from "@/shared/recommendations/wizard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "View your saved SeekSmart audit briefs.",
  robots: {
    index: false,
    follow: false
  }
};

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/dashboard");
  }

  const [auditRuns, likedTools] = await Promise.all([
    listSavedAuditRuns(session.user.id),
    listLikedToolsForUser(session.user.id)
  ]);
  const industries = await loadIndustryNames(auditRuns.map((run) => run.id));
  const firstName = session.user.name?.split(" ")[0];

  return (
    <main>
      {/* ---------- Hero ---------- */}
      <section className="app-container page-hero">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <Reveal>
              <p className="eyebrow">Workspace</p>
            </Reveal>
            <SplitReveal
              className="h1 mt-6"
              delay={0.1}
              lines={[
                [firstName ? `Welcome back, ${firstName}.` : "Welcome back."],
                [{ text: "Pick up where you left off.", className: "ghost-word" }]
              ]}
            />
            <Reveal delay={0.4}>
              <p className="mt-6 break-all font-mono text-xs uppercase tracking-[0.14em] text-ink/45">
                {session.user.email ?? "Signed in"}
                {session.user.role === "ADMIN" ? " / Admin" : ""}
              </p>
            </Reveal>
          </div>
          <Reveal className="flex flex-wrap items-center gap-3" delay={0.3}>
            <Magnetic>
              <Link className="btn btn-primary btn-lg" href="/audit/questions">
                <Plus aria-hidden="true" size={18} />
                New audit
              </Link>
            </Magnetic>
            <Link className="btn btn-ghost btn-lg" href="/tools">
              Browse tools
            </Link>
          </Reveal>
        </div>

        <Stagger className="mt-14 grid grid-cols-2 gap-6 md:max-w-xl" delay={0.35}>
          {[
            { label: "Saved briefs", value: auditRuns.length },
            { label: "Liked tools", value: likedTools.length }
          ].map((item) => (
            <StaggerItem className="border-t border-ink/15 pt-4" key={item.label}>
              <span className="stat-number block text-[clamp(3rem,6vw,4.5rem)]">
                <AnimatedNumber value={item.value} />
              </span>
              <span className="mt-2 block text-ink/55">{item.label}</span>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* ---------- Saved briefs ---------- */}
      <section className="app-container pb-20 md:pb-28">
        <SectionHead count={auditRuns.length} title="Saved briefs" />
        {auditRuns.length > 0 ? (
          <Stagger as="div" className="row-list mt-8" inView>
            {auditRuns.map((auditRun) => (
              <StaggerItem key={auditRun.id}>
                <Link
                  className="row-item group grid-cols-[auto_minmax(0,1fr)_auto] gap-4 py-5 md:grid-cols-[auto_minmax(0,1fr)_12rem_9rem_auto] md:gap-8 md:py-6"
                  href={`/audit/r/${auditRun.id}`}
                >
                  <ScoreDial
                    label="Readiness"
                    size={56}
                    tone={auditRun.readinessLevel === "Pilot-ready" ? "signal" : "ink"}
                    value={auditRun.readinessScore ?? 0}
                  />
                  <span className="min-w-0">
                    <span className="line-clamp-2 block font-display text-[1.2rem] leading-tight md:truncate font-bold tracking-[-0.03em] transition-transform duration-500 ease-out group-hover:translate-x-1 md:text-[1.5rem]">
                      {auditRun.topOpportunityName ?? "AI pilot brief"}
                    </span>
                    <span className="mt-0.5 block truncate text-sm text-ink/50">
                      {auditRun.readinessLevel ?? "Readiness saved"}
                      <span className="md:hidden">
                        {industries.get(auditRun.id) ? ` · ${industries.get(auditRun.id)}` : ""}
                        {` · ${formatDate(auditRun.createdAt)}`}
                      </span>
                    </span>
                  </span>
                  <span className="hidden truncate text-ink/60 md:block">
                    {industries.get(auditRun.id) ?? "Industry not set"}
                  </span>
                  <span className="hidden font-mono text-xs uppercase tracking-[0.12em] text-ink/45 md:block">
                    {formatDate(auditRun.createdAt)}
                  </span>
                  <span className="row-arrow">
                    <ArrowRight aria-hidden="true" size={16} />
                  </span>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        ) : (
          <EmptyState
            action={{ href: "/audit/questions", label: "Start your first audit" }}
            className="mt-8"
            description="Run an audit while signed in and the brief is saved here."
            icon={BarChart3}
            title="No saved briefs yet."
          />
        )}
      </section>

      {/* ---------- Liked tools ---------- */}
      <section className="app-container pb-24 md:pb-32">
        <SectionHead count={likedTools.length} title="Liked tools" />
        {likedTools.length > 0 ? (
          <Stagger as="div" className="row-list mt-8" inView>
            {likedTools.map((tool) => (
              <StaggerItem key={tool.id}>
                <LikedToolRow tool={tool} />
              </StaggerItem>
            ))}
          </Stagger>
        ) : (
          <EmptyState
            action={{ href: "/tools", label: "Find tools" }}
            className="mt-8"
            description="Like tools while browsing to build a shortlist."
            icon={Heart}
            title="No liked tools yet."
          />
        )}
      </section>
    </main>
  );
}

function SectionHead({ count, title }: { count: number; title: string }) {
  return (
    <Reveal className="flex items-baseline justify-between gap-4">
      <h2 className="h2">{title}</h2>
      <span className="font-mono text-sm text-ink/40 tabular">{String(count).padStart(2, "0")}</span>
    </Reveal>
  );
}

function LikedToolRow({ tool }: { tool: LikedTool }) {
  return (
    <div className="row-item row-link grid-cols-[minmax(0,1fr)_auto] gap-4 py-5">
      <Link className="group flex min-w-0 items-center gap-4" href={`/tools/${tool.slug}`}>
        <ToolLogo logoUrl={tool.logoUrl} name={tool.name} />
        <span className="min-w-0">
          <span className="flex items-center gap-2">
            <span className="truncate text-lg font-semibold tracking-[-0.01em]">{tool.name}</span>
            <ArrowUpRight
              aria-hidden="true"
              className="shrink-0 text-ink/30 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink"
              size={16}
            />
          </span>
          <span className="block truncate text-sm text-ink/50">
            {tool.category.name} · {formatPricing(tool.pricingType)}
            <span className="hidden sm:inline"> · {tool.shortDescription}</span>
          </span>
        </span>
      </Link>
      <ToolLikeButton
        initialState={tool.like}
        toolId={tool.id}
        toolName={tool.name}
        toolSlug={tool.slug}
        variant="icon"
      />
    </div>
  );
}

// Saved-run summaries do not carry the industry; read it from the stored
// answers for the handful of runs on screen.
async function loadIndustryNames(ids: string[]) {
  const names = new Map<string, string>();
  if (ids.length === 0) {
    return names;
  }

  const runs = await prisma.auditRun.findMany({
    select: { id: true, input: true },
    where: { id: { in: ids } }
  });
  const slugs = new Map<string, string>();
  for (const run of runs) {
    const slug = (run.input as { industrySlug?: unknown } | null)?.industrySlug;
    if (typeof slug === "string") {
      slugs.set(run.id, slug);
    }
  }
  const industries = await prisma.industry.findMany({
    select: { name: true, slug: true },
    where: { slug: { in: [...new Set(slugs.values())] } }
  });
  const bySlug = new Map(industries.map((industry) => [industry.slug, industry.name]));

  for (const [id, slug] of slugs) {
    names.set(id, getFeaturedIndustry(slug)?.label ?? bySlug.get(slug) ?? slug);
  }

  return names;
}

function formatPricing(pricingType: LikedTool["pricingType"]) {
  if (pricingType === "FREEMIUM") {
    return "Freemium";
  }

  if (pricingType === "FREE") {
    return "Free";
  }

  return "Paid";
}

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium"
  }).format(value);
}
