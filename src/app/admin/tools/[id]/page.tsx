import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { AdminToolForm } from "@/features/admin/admin-tool-form";
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
    <main className="mx-auto grid max-w-6xl gap-6 px-5 py-10">
      <section className="rounded-md border border-line bg-white p-5">
        <Link
          className="inline-flex items-center gap-2 text-sm font-medium text-accent"
          href="/admin/tools"
        >
          <ArrowLeft aria-hidden="true" size={16} />
          Tool catalog
        </Link>
        <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium uppercase text-accent">
              {tool.status}
            </p>
            <h1 className="mt-2 text-4xl font-semibold">{tool.name}</h1>
            <p className="mt-3 max-w-3xl leading-7 text-ink/65">
              {tool.shortDescription}
            </p>
          </div>
          {tool.status === "PUBLISHED" ? (
            <Link
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-line px-3 text-sm font-medium"
              href={`/tools/${tool.slug}`}
              target="_blank"
            >
              Public page
              <ExternalLink aria-hidden="true" size={15} />
            </Link>
          ) : null}
        </div>
      </section>

      <AdminToolForm taxonomy={taxonomy} tool={tool} />
    </main>
  );
}
