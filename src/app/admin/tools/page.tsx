import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Search } from "lucide-react";
import { AdminLogoutButton } from "@/features/admin/admin-logout-button";
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
    <main className="page-shell">
      <div className="app-container grid gap-6">
      <section className="surface-strong flex flex-col gap-4 rounded-2xl p-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow">Admin</p>
          <h1 className="mt-2 text-4xl font-semibold">Tool catalog</h1>
          <p className="mt-3 max-w-2xl leading-7 text-ink/65">
            Edit published tools, adjust taxonomy, and archive listings that
            should no longer appear publicly.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            className="secondary-button"
            href="/admin"
          >
            Review queue
          </Link>
          <AdminLogoutButton />
        </div>
      </section>

      <form className="surface-panel grid gap-3 rounded-xl p-4 md:grid-cols-[1fr_160px]">
        <input name="status" type="hidden" value={activeStatus} />
        <label className="relative">
          <span className="sr-only">Search tools</span>
          <Search
            aria-hidden="true"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40"
            size={18}
          />
          <input
            className="control-field w-full pl-10"
            defaultValue={query ?? ""}
            name="q"
            placeholder="Search tools"
          />
        </label>
        <button className="primary-button">
          Search
        </button>
      </form>

      <nav className="grid gap-3 md:grid-cols-5">
        {statuses.map((status) => {
          const isActive = status === activeStatus;

          return (
            <Link
              className={
                isActive
                  ? "rounded-xl border border-accent bg-accent px-4 py-3 text-white shadow-lg shadow-accent/15"
                  : "metric-tile rounded-xl px-4 py-3 transition hover:-translate-y-0.5 hover:border-accent"
              }
              href={`/admin/tools?status=${status}`}
              key={status}
            >
              <div className="text-sm font-medium">{status}</div>
              <div className="mt-1 text-2xl font-semibold">
                {counts[status]}
              </div>
            </Link>
          );
        })}
      </nav>

      <section className="admin-table-shell rounded-xl">
        <div className="border-b border-line px-5 py-4">
          <h2 className="font-semibold">{activeStatus} tools</h2>
        </div>
        {tools.length > 0 ? (
          <div className="divide-y divide-line">
            {tools.map((tool) => (
              <Link
                className="grid gap-3 px-5 py-4 transition hover:bg-muted/40 md:grid-cols-[1fr_180px_140px]"
                href={`/admin/tools/${tool.id}`}
                key={tool.id}
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold">{tool.name}</span>
                    {tool.isFeatured ? (
                      <span className="rounded-full bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent ring-1 ring-accent/15">
                        Featured
                      </span>
                    ) : null}
                    {tool.isVerified ? (
                      <span className="rounded-full bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent ring-1 ring-accent/15">
                        Verified
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-2 text-xs text-ink/45">{tool.websiteUrl}</p>
                </div>
                <div className="text-sm text-ink/60">
                  <div>{tool.categoryName}</div>
                  <div className="mt-1">{tool.pricingType}</div>
                </div>
                <div className="text-sm text-ink/60 md:text-right">
                  <div>Score {tool.popularityScore}</div>
                  <div className="mt-1">{formatDate(tool.updatedAt)}</div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="px-5 py-12 text-center">
            <h2 className="font-semibold">No tools in this view</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-ink/60">
              Change the status filter or approve a submission to create a new
              public listing.
            </p>
          </div>
        )}
      </section>
      </div>
    </main>
  );
}
