import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BarChart3, Clock3, Heart, Sparkles, UserRound } from "lucide-react";
import { auth } from "@/auth";
import { listSavedAuditRuns } from "@/server/audit-runs/queries";
import { listLikedToolsForUser, type LikedTool } from "@/server/tools/likes";
import { ToolLikeButton } from "@/features/tools/tool-like-button";
import { ToolLogo } from "@/features/tools/tool-logo";
import { AnimatedNumber } from "@/components/motion/animated-number";
import { MotionLink } from "@/components/motion/motion-link";
import { Reveal } from "@/components/motion/reveal";

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
      <div className="app-container grid gap-6">
        <Reveal className="surface-strong rounded-2xl p-6">
          <p className="eyebrow">
            <UserRound aria-hidden="true" size={14} />
            Dashboard
          </p>
          <div className="mt-4 grid gap-5 lg:grid-cols-[1fr_320px] lg:items-end">
            <div>
              <h1 className="max-w-3xl text-4xl font-semibold leading-tight md:text-5xl">
                {session.user.name
                  ? `${session.user.name}'s AI decisions`
                  : "Your AI decisions"}
              </h1>
              <p className="mt-3 max-w-2xl leading-7 text-ink/65">
                Saved audit briefs stay attached to your account so you can
                revisit the context, shortlist, and pilot plan later.
              </p>
            </div>
            <MotionLink className="primary-button min-h-12" href="/audit/start">
              Start new audit
            </MotionLink>
          </div>
        </Reveal>

        <Reveal className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
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
            icon={Sparkles}
            label="Role"
            value={formatRole(session.user.role)}
          />
          <DashboardMetric
            icon={Clock3}
            label="Signed in as"
            value={session.user.email ?? "Google account"}
          />
        </Reveal>

        <Reveal className="surface-panel rounded-2xl p-5 md:p-6">
          <div className="flex flex-col gap-3 border-b border-line pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase text-accent">
                Profile
              </p>
              <h2 className="mt-2 text-2xl font-semibold">Liked tools</h2>
            </div>
            <Link className="secondary-button" href="/tools">
              Browse tools
            </Link>
          </div>

          {likedTools.length > 0 ? (
            <div className="mt-5 grid gap-3">
              {likedTools.map((tool) => (
                <LikedToolItem key={tool.id} tool={tool} />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <Heart
                aria-hidden="true"
                className="mx-auto text-accent"
                size={24}
              />
              <h3 className="mt-4 font-semibold">No liked tools yet</h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-ink/60">
                Like tools while browsing and they will appear here for quick
                comparison later.
              </p>
              <Link className="primary-button mt-5" href="/tools">
                Find tools to like
              </Link>
            </div>
          )}
        </Reveal>

        <Reveal className="surface-panel rounded-2xl p-5 md:p-6">
          <div className="flex flex-col gap-3 border-b border-line pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase text-accent">
                Audit history
              </p>
              <h2 className="mt-2 text-2xl font-semibold">
                Recent saved briefs
              </h2>
            </div>
            <Link className="secondary-button" href="/audit/questions">
              Run audit
            </Link>
          </div>

          {auditRuns.length > 0 ? (
            <div className="divide-y divide-line">
              {auditRuns.map((auditRun) => (
                <Link
                  className="grid gap-3 py-5 transition hover:text-accent md:grid-cols-[1fr_190px_150px]"
                  href={`/dashboard/audits/${auditRun.id}`}
                  key={auditRun.id}
                >
                  <div>
                    <h3 className="font-semibold text-ink">
                      {auditRun.title}
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-ink/58">
                      {auditRun.topOpportunityName ??
                        "Saved AI pilot recommendation"}
                    </p>
                  </div>
                  <div className="text-sm leading-6 text-ink/58">
                    {auditRun.readinessLevel
                      ? `${auditRun.readinessLevel} (${auditRun.readinessScore ?? "-"})`
                      : "Readiness captured"}
                  </div>
                  <div className="text-sm text-ink/50 md:text-right">
                    {formatDate(auditRun.createdAt)}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <h3 className="font-semibold">No saved audits yet</h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-ink/60">
                Run an audit while signed in and SeekSmart will save the brief
                here automatically.
              </p>
              <Link className="primary-button mt-5" href="/audit/questions">
                Start first audit
              </Link>
            </div>
          )}
        </Reveal>
      </div>
    </main>
  );
}

function LikedToolItem({ tool }: { tool: LikedTool }) {
  return (
    <article className="rounded-xl border border-line bg-surface/70 p-4 transition hover:border-accent/60 hover:bg-surface">
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
  icon: typeof BarChart3;
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="metric-tile rounded-xl p-4">
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
