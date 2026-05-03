import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CheckCircle2,
  ExternalLink,
  Layers3,
  ShieldCheck,
  Sparkles,
  Target
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
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
    title: tool.metaTitle ?? tool.name,
    description: tool.metaDescription ?? tool.shortDescription,
    alternates: {
      canonical: `/tools/${tool.slug}`
    },
    openGraph: {
      title: tool.metaTitle ?? tool.name,
      description: tool.metaDescription ?? tool.shortDescription,
      url: `/tools/${tool.slug}`,
      type: "website"
    }
  };
}

export default async function ToolDetailPage({ params }: ToolDetailPageProps) {
  const { slug } = await params;
  const tool = await getPublishedToolBySlug(slug);

  if (!tool) {
    notFound();
  }

  return (
    <main className="page-shell">
      <div className="app-container">
      <section className="surface-strong grid gap-8 rounded-2xl p-6 md:grid-cols-[1fr_340px]">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <Link className="text-sm font-medium text-accent" href="/tools">
              Tools
            </Link>
            <span className="text-ink/30">/</span>
            <Link
              className="text-sm text-ink/55 hover:text-accent"
              href={`/categories/${tool.category.slug}`}
            >
              {tool.category.name}
            </Link>
          </div>
          <h1 className="mt-5 text-5xl font-semibold">{tool.name}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-ink/70">
            {tool.shortDescription}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <span className="status-pill">
              {formatPricing(tool.pricingType)}
            </span>
            {tool.hasFreePlan ? (
              <span className="status-pill">
                Free plan
              </span>
            ) : null}
            {tool.isVerified ? (
              <span className="status-pill">
                <ShieldCheck aria-hidden="true" size={16} />
                Verified
              </span>
            ) : null}
            {tool.isFeatured ? (
              <span className="status-pill">
                <Sparkles aria-hidden="true" size={16} />
                Featured
              </span>
            ) : null}
          </div>
        </div>
        <aside className="surface-panel rounded-xl p-5">
          <h2 className="font-semibold">Decision snapshot</h2>
          <p className="mt-2 text-sm leading-6 text-ink/60">
            A quick scan of pricing, category, and popularity before opening
            the official site.
          </p>
          <dl className="mt-5 grid gap-3 text-sm">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <dt className="text-ink/55">Category</dt>
              <dd className="font-medium">{tool.category.name}</dd>
            </div>
            <div className="flex items-center justify-between border-b border-line pb-3">
              <dt className="text-ink/55">Pricing</dt>
              <dd className="font-medium">{formatPricing(tool.pricingType)}</dd>
            </div>
            <div className="flex items-center justify-between border-b border-line pb-3">
              <dt className="text-ink/55">Popularity</dt>
              <dd className="font-medium">{tool.popularityScore}/100</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-ink/55">Verified</dt>
              <dd className="font-medium">{tool.isVerified ? "Yes" : "No"}</dd>
            </div>
          </dl>
          <a
            className="primary-button mt-5 w-full"
            href={tool.websiteUrl}
            rel="noreferrer"
            target="_blank"
          >
            Website
            <ExternalLink aria-hidden="true" size={17} />
          </a>
        </aside>
      </section>

      <section className="surface-panel mt-10 rounded-xl p-6">
        <div className="flex items-center gap-2">
          <Layers3 aria-hidden="true" className="text-accent" size={20} />
          <h2 className="text-xl font-semibold">Overview</h2>
        </div>
        <p className="mt-4 leading-8 text-ink/70">
          {tool.longDescription ?? tool.shortDescription}
        </p>
      </section>

      <section className="mt-6 grid gap-6 md:grid-cols-2">
        <InfoPanel
          emptyLabel="Use cases will be added during curation."
          icon={Target}
          items={tool.useCases.map((useCase) => useCase.name)}
          title="Use cases"
        />
        <InfoPanel
          emptyLabel="Feature data will be added during curation."
          icon={CheckCircle2}
          items={tool.features.map((feature) => feature.name)}
          title="Features"
        />
      </section>

      <section className="mt-10">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase text-accent">
              Compare
            </p>
            <h2 className="mt-2 text-xl font-semibold">Alternatives</h2>
          </div>
          <Link className="text-sm font-medium text-accent" href="/tools">
            Browse all
          </Link>
        </div>
        {tool.alternatives.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-3">
            {tool.alternatives.map((alternative) => (
              <ToolCard key={alternative.id} tool={alternative} />
            ))}
          </div>
        ) : (
          <div className="surface-panel rounded-xl p-6 text-sm text-ink/60">
            Alternatives are not curated for this tool yet.
          </div>
        )}
      </section>
      </div>
    </main>
  );
}

type InfoPanelProps = {
  emptyLabel: string;
  icon: LucideIcon;
  items: string[];
  title: string;
};

function InfoPanel({ emptyLabel, icon: Icon, items, title }: InfoPanelProps) {
  return (
    <section className="surface-panel rounded-xl p-6">
      <div className="flex items-center gap-2">
        <Icon aria-hidden="true" className="text-accent" size={20} />
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      {items.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {items.map((item) => (
            <span
              className="status-pill"
              key={item}
            >
              {item}
            </span>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-sm text-ink/60">{emptyLabel}</p>
      )}
    </section>
  );
}

function formatPricing(pricingType: string) {
  if (pricingType === "FREEMIUM") {
    return "Freemium";
  }

  if (pricingType === "FREE") {
    return "Free";
  }

  return "Paid";
}
