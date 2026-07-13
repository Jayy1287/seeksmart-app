import type { Metadata } from "next";
import type { Route } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  BarChart3,
  Clock3,
  Heart,
  LayoutDashboard,
  ListChecks,
  Mail,
  Plus
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { auth } from "@/auth";
import { listSavedAuditRuns } from "@/server/audit-runs/queries";
import { listLikedToolsForUser, type LikedTool } from "@/server/tools/likes";
import { ToolLikeButton } from "@/features/tools/tool-like-button";
import { ToolLogo } from "@/features/tools/tool-logo";
import { AnimatedNumber } from "@/components/motion/animated-number";
import { MotionLink } from "@/components/motion/motion-link";
import { Reveal } from "@/components/motion/reveal";
import { EmptyState } from "@/components/state-surfaces";

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

  return (
    <main className="page-shell">
      <div className="app-container">
        <Reveal className="workspace-shell grid gap-6 lg:grid-cols-[270px_minmax(0,1fr)]">
          <aside className="workspace-sidebar rounded-2xl p-5">
            <p className="eyebrow">
              <LayoutDashboard aria-hidden="true" size={14} />
              Workspace
            </p>
            <h1 className="mt-4 text-3xl font-semibold leading-tight">
              {session.user.name ? session.user.name : "Decision desk"}
            </h1>
            <p className="mt-3 text-sm leading-6 text-ink/62">
              Your saved briefs and liked tools stay here so shortlists do not
              get lost between research sessions.
            </p>

            <div className="workspace-account mt-5">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Mail aria-hidden="true" size={15} />
                Account
              </div>
              <p className="mt-2 break-words text-sm text-ink/60">
                {session.user.email ?? "Signed-in account"}
              </p>
              <p className="mt-2 text-xs font-semibold uppercase text-accent/70">
                {formatRole(session.user.role)}
              </p>
            </div>

            <nav aria-label="Workspace actions" className="mt-5 grid gap-2">
              <MotionLink className="primary-button w-full" href="/audit/start">
                <Plus aria-hidden="true" size={16} />
                New audit
              </MotionLink>
              <Link className="secondary-button w-full" href="/tools">
                Browse tools
              </Link>
              <Link className="secondary-button w-full" href="/use-cases">
                Use cases
              </Link>
            </nav>
          </aside>

          <section className="grid gap-6">
            <div className="workspace-hero rounded-2xl p-6">
              <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-accent/70">
                    Decision workspace
                  </p>
                  <h2 className="mt-3 max-w-3xl text-4xl font-semibold leading-tight md:text-5xl">
                    Continue from the last AI buying decision.
                  </h2>
                  <p className="mt-3 max-w-2xl leading-7 text-ink/65">
                    Review liked tools, reopen saved audits, and start the next
                    pilot brief without returning to a blank page.
                  </p>
                </div>
                <MotionLink className="primary-button min-h-12" href="/audit/start">
                  Start new audit
                  <ArrowRight aria-hidden="true" size={16} />
                </MotionLink>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <DashboardMetric
                icon={BarChart3}
                label="Saved audits"
                value={<AnimatedNumber value={auditRuns.length} />}
              />
              <DashboardMetric
                icon={Heart}
                label="Liked tools"
                value={<AnimatedNumber value={likedTools.length} />}
              />
              <DashboardMetric
                icon={Clock3}
                label="Next action"
                value={auditRuns.length > 0 ? "Review brief" : "Run audit"}
              />
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.06fr_0.94fr]">
              <section className="workspace-panel rounded-2xl p-5 md:p-6">
                <PanelHeader
                  actionHref="/tools"
                  actionLabel="Browse"
                  eyebrow="Shortlist"
                  icon={Heart}
                  title="Liked tools"
                />
                {likedTools.length > 0 ? (
                  <div className="mt-5 grid gap-3">
                    {likedTools.map((tool) => (
                      <LikedToolItem key={tool.id} tool={tool} />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    action={{ href: "/tools", label: "Find tools" }}
                    className="mt-5"
                    description="Like tools while browsing and they will appear here as a working shortlist for later comparison."
                    eyebrow="Shortlist empty"
                    icon={Heart}
                    title="No liked tools yet."
                  />
                )}
              </section>

              <section className="workspace-panel rounded-2xl p-5 md:p-6">
                <PanelHeader
                  actionHref="/audit/questions"
                  actionLabel="Run audit"
                  eyebrow="History"
                  icon={ListChecks}
                  title="Saved briefs"
                />
                {auditRuns.length > 0 ? (
                  <div className="mt-4 divide-y divide-line/70">
                    {auditRuns.map((auditRun) => (
                      <AuditRunItem auditRun={auditRun} key={auditRun.id} />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    action={{ href: "/audit/questions", label: "Start first audit" }}
                    className="mt-5"
                    description="Run an audit while signed in and SeekSmart will save the brief, shortlist, and readiness context here."
                    eyebrow="No saved briefs"
                    icon={BarChart3}
                    title="Your audit history is empty."
                  />
                )}
              </section>
            </div>
          </section>
        </Reveal>
      </div>
    </main>
  );
}

type SavedAuditRun = Awaited<ReturnType<typeof listSavedAuditRuns>>[number];

function PanelHeader({
  actionHref,
  actionLabel,
  eyebrow,
  icon: Icon,
  title
}: {
  actionHref: Route;
  actionLabel: string;
  eyebrow: string;
  icon: LucideIcon;
  title: string;
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-line/60 pb-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-accent/75">
          <Icon aria-hidden="true" size={15} />
          {eyebrow}
        </p>
        <h2 className="mt-2 text-2xl font-semibold">{title}</h2>
      </div>
      <Link className="secondary-button" href={actionHref}>
        {actionLabel}
      </Link>
    </div>
  );
}

function AuditRunItem({ auditRun }: { auditRun: SavedAuditRun }) {
  return (
    <Link
      className="workspace-list-row grid gap-3 py-4 md:grid-cols-[1fr_150px]"
      href={`/dashboard/audits/${auditRun.id}`}
    >
      <div>
        <h3 className="font-semibold text-ink">{auditRun.title}</h3>
        <p className="mt-1 text-sm leading-6 text-ink/58">
          {auditRun.topOpportunityName ?? "Saved AI pilot recommendation"}
        </p>
      </div>
      <div className="text-sm text-ink/55 md:text-right">
        <p className="font-medium text-ink/70">
          {auditRun.readinessLevel
            ? `${auditRun.readinessLevel} (${auditRun.readinessScore ?? "-"})`
            : "Readiness saved"}
        </p>
        <p className="mt-1 text-xs">{formatDate(auditRun.createdAt)}</p>
      </div>
    </Link>
  );
}

function LikedToolItem({ tool }: { tool: LikedTool }) {
  return (
    <article className="workspace-list-card">
      <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
        <Link
          className="flex min-w-0 items-start gap-3"
          href={`/tools/${tool.slug}`}
        >
          <ToolLogo logoUrl={tool.logoUrl} name={tool.name} />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-semibold text-ink">{tool.name}</h3>
              <span className="status-pill">{formatPricing(tool.pricingType)}</span>
            </div>
            <p className="mt-1 text-sm leading-6 text-ink/60">
              {tool.shortDescription}
            </p>
            <p className="mt-2 text-xs font-medium text-ink/45">
              {tool.category.name} · Liked {formatDate(tool.likedAt)}
            </p>
          </div>
        </Link>
        <div className="flex items-center md:justify-end">
          <ToolLikeButton
            isSignedIn={true}
            state={tool.like}
            toolId={tool.id}
            toolName={tool.name}
            toolSlug={tool.slug}
            variant="dashboard"
          />
        </div>
      </div>
    </article>
  );
}

function DashboardMetric({
  icon: Icon,
  label,
  value
}: {
  icon: LucideIcon;
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="workspace-metric rounded-xl p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase text-ink/48">{label}</p>
        <Icon aria-hidden="true" className="text-accent" size={18} />
      </div>
      <p className="mt-2 truncate font-semibold">{value}</p>
    </div>
  );
}

function formatRole(role: string) {
  return role === "ADMIN" ? "Admin" : "User";
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
    dateStyle: "medium",
    timeStyle: "short"
  }).format(value);
}
