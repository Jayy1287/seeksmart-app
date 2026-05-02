import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, ShieldCheck } from "lucide-react";
import { getPublishedToolBySlug } from "@/server/tools/queries";
import { ToolCard } from "@/features/tools/tool-card";

export const dynamic = "force-dynamic";

type ToolDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params
}: ToolDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = await getPublishedToolBySlug(slug);

  if (!tool) {
    return {
      title: "Tool not found"
    };
  }

  return {
    title: tool.name,
    description: tool.shortDescription
  };
}

export default async function ToolDetailPage({ params }: ToolDetailPageProps) {
  const { slug } = await params;
  const tool = await getPublishedToolBySlug(slug);

  if (!tool) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
      <section className="grid gap-8 md:grid-cols-[1fr_320px]">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <Link className="text-sm font-medium text-accent" href="/tools">
              Tools
            </Link>
            <span className="text-ink/30">/</span>
            <span className="text-sm text-ink/55">{tool.category.name}</span>
          </div>
          <h1 className="mt-5 text-5xl font-semibold">{tool.name}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-ink/70">
            {tool.shortDescription}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <span className="rounded-md border border-line bg-white px-3 py-2 text-sm font-medium">
              {tool.pricingType.toLowerCase()}
            </span>
            {tool.hasFreePlan ? (
              <span className="rounded-md border border-line bg-white px-3 py-2 text-sm font-medium">
                Free plan
              </span>
            ) : null}
            {tool.isVerified ? (
              <span className="inline-flex items-center gap-2 rounded-md border border-line bg-white px-3 py-2 text-sm font-medium">
                <ShieldCheck aria-hidden="true" size={16} />
                Verified
              </span>
            ) : null}
          </div>
        </div>
        <aside className="rounded-md border border-line bg-white p-5">
          <h2 className="font-semibold">Visit tool</h2>
          <p className="mt-2 text-sm leading-6 text-ink/60">
            Open the official website to review current pricing and product
            details.
          </p>
          <a
            className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-ink px-4 font-medium text-paper"
            href={tool.websiteUrl}
            rel="noreferrer"
            target="_blank"
          >
            Website
            <ExternalLink aria-hidden="true" size={17} />
          </a>
        </aside>
      </section>

      <section className="mt-10 rounded-md border border-line bg-white p-6">
        <h2 className="text-xl font-semibold">Overview</h2>
        <p className="mt-4 leading-8 text-ink/70">
          {tool.longDescription ?? tool.shortDescription}
        </p>
      </section>

      {tool.alternatives.length > 0 ? (
        <section className="mt-10">
          <h2 className="mb-4 text-xl font-semibold">Alternatives</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {tool.alternatives.map((alternative) => (
              <ToolCard key={alternative.id} tool={alternative} />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
