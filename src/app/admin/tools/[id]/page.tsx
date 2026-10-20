import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { AdminToolForm } from "@/features/admin/admin-tool-form";
import { AdminHeader } from "@/features/admin/admin-shell";
import { isAdminAuthenticated } from "@/server/admin/auth";
import {
  getAdminToolById,
  listAdminTaxonomyOptions
} from "@/server/admin/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Edit Tool",
  robots: {
    index: false,
    follow: false
  }
};

type AdminToolPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminToolPage({ params }: AdminToolPageProps) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const { id } = await params;
  const [tool, taxonomy] = await Promise.all([
    getAdminToolById(id),
    listAdminTaxonomyOptions()
  ]);

  if (!tool) {
    notFound();
  }

  return (
    <main className="app-container page-hero grid grid-cols-[minmax(0,1fr)] gap-8 pb-24">
      <AdminHeader
        actions={
          tool.status === "PUBLISHED" ? (
            <Link
              className="btn btn-ghost"
              href={`/tools/${tool.slug}`}
              target="_blank"
            >
              Public page
              <ExternalLink aria-hidden="true" size={15} />
            </Link>
          ) : null
        }
        back={{ href: "/admin/tools", label: "Tool catalog" }}
        eyebrow={tool.status.replace(/_/g, " ")}
        lead={tool.shortDescription}
        title={tool.name}
      />

      <AdminToolForm taxonomy={taxonomy} tool={tool} />
    </main>
  );
}
