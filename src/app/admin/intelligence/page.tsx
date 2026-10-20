import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { AdminIntelligenceWorkspace } from "@/features/admin/admin-intelligence-workspace";
import { AdminHeader, AdminNav } from "@/features/admin/admin-shell";
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
    <main className="app-container page-hero grid grid-cols-[minmax(0,1fr)] gap-10 pb-24">
      <AdminHeader
        actions={
          <>
            <AdminNav current="intelligence" />
            <Link className="link-underline ml-2 text-sm" href="/opportunities">
              Public opportunities
              <ArrowUpRight aria-hidden="true" size={14} />
            </Link>
          </>
        }
        eyebrow="Intelligence"
        lead="The structured data behind every recommendation."
        title={
          <>
            Business <span className="ghost-word">taxonomy.</span>
          </>
        }
      />

      <AdminIntelligenceWorkspace workspace={workspace} />
    </main>
  );
}
