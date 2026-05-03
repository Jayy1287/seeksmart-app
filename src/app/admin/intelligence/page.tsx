import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AdminIntelligenceWorkspace } from "@/features/admin/admin-intelligence-workspace";
import { isAdminAuthenticated } from "@/server/admin/auth";
import { getAdminIntelligenceWorkspace } from "@/server/admin/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Intelligence",
  robots: {
    index: false,
    follow: false
  }
};

export default async function AdminIntelligencePage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const workspace = await getAdminIntelligenceWorkspace();

  return (
    <main className="page-shell">
      <div className="app-container grid gap-6">
        <section className="surface-strong rounded-2xl p-6">
          <Link
            className="inline-flex items-center gap-2 text-sm font-medium text-accent"
            href="/admin"
          >
            <ArrowLeft aria-hidden="true" size={16} />
            Admin
          </Link>
          <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow">Intelligence</p>
              <h1 className="mt-3 text-4xl font-semibold">
                Business taxonomy workspace
              </h1>
              <p className="mt-3 max-w-3xl leading-7 text-ink/65">
                Manage the structured data that turns SeekSmart from a tool
                catalog into an explainable business decision platform.
              </p>
            </div>
            <Link className="secondary-button" href="/opportunities">
              Public opportunities
            </Link>
          </div>
        </section>

        <AdminIntelligenceWorkspace workspace={workspace} />
      </div>
    </main>
  );
}
