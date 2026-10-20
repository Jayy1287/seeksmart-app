import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { AdminLogoutButton } from "@/features/admin/admin-logout-button";
import {
  AdminEmpty,
  AdminHeader,
  AdminNav,
  AdminSearch,
  StatusFilter
} from "@/features/admin/admin-shell";
import { isAdminAuthenticated } from "@/server/admin/auth";
import {
  getAdminToolCounts,
  listAdminTools,
  type AdminToolStatus
} from "@/server/admin/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Tools",
  robots: {
    index: false,
    follow: false
  }
};

const statuses: AdminToolStatus[] = [
  "PUBLISHED",
  "DRAFT",
  "PENDING_REVIEW",
  "REJECTED",
  "ARCHIVED"
];

type AdminToolsPageProps = {
  searchParams: Promise<{
    status?: string;
    q?: string;
  }>;
};

function parseStatus(value?: string): AdminToolStatus {
  return statuses.includes(value as AdminToolStatus)
    ? (value as AdminToolStatus)
    : "PUBLISHED";
}

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(value);
}

export default async function AdminToolsPage({
  searchParams
}: AdminToolsPageProps) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const { status: rawStatus, q } = await searchParams;
  const activeStatus = parseStatus(rawStatus);
  const query = q?.trim() || undefined;
  const [counts, tools] = await Promise.all([
    getAdminToolCounts(),
    listAdminTools(activeStatus, query)
  ]);

  return (
    <main className="app-container page-hero grid grid-cols-[minmax(0,1fr)] gap-8 pb-24">
      <AdminHeader
        actions={
          <>
            <AdminNav current="tools" />
            <AdminLogoutButton />
          </>
        }
        eyebrow="Admin"
        title={
          <>
            Tool catalog. <span className="ghost-word">{counts.PUBLISHED} live.</span>
          </>
        }
      />

      <div className="grid gap-4">
        <StatusFilter
          active={activeStatus}
          counts={counts}
          hrefFor={(status) => `/admin/tools?status=${status}`}
          statuses={statuses}
        />
        <AdminSearch action="/admin/tools" label="Search tools" query={query} status={activeStatus} />
      </div>

      <section>
        <p className="eyebrow eyebrow-plain mb-4">
          {tools.length} {activeStatus.replace(/_/g, " ").toLowerCase()}
        </p>
        <div className="row-list">
          {tools.length > 0 ? (
            tools.map((tool) => (
              <Link
                className="row-item group grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-3 py-5 md:grid-cols-[minmax(0,1fr)_14rem_10rem_auto] md:gap-x-8"
                href={`/admin/tools/${tool.id}`}
                key={tool.id}
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-display text-xl font-bold tracking-[-0.03em]">{tool.name}</span>
                    {tool.isFeatured ? <span className="tag tag-signal">Featured</span> : null}
                    {tool.isVerified ? <span className="tag tag-success">Verified</span> : null}
                  </div>
                  <p className="mt-1 truncate font-mono text-xs text-ink/40">{tool.websiteUrl}</p>
                </div>
                <div className="col-span-2 row-start-2 flex flex-wrap gap-1.5 md:col-span-1 md:col-start-2 md:row-start-1">
                  <span className="tag">{tool.categoryName}</span>
                  <span className="tag">{tool.pricingType}</span>
                </div>
                <div className="col-span-2 row-start-3 font-mono text-xs text-ink/45 md:col-span-1 md:col-start-3 md:row-start-1 md:text-right">
                  <div>Score {tool.popularityScore}</div>
                  <div className="mt-1">{formatDate(tool.updatedAt)}</div>
                </div>
                <span className="row-arrow col-start-2 row-start-1 md:col-start-4">
                  <ArrowRight aria-hidden="true" size={16} />
                </span>
              </Link>
            ))
          ) : (
            <AdminEmpty
              body="Change the filter, or approve a submission to create a listing."
              title="No tools in this view."
            />
          )}
        </div>
      </section>
    </main>
  );
}
