import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Search } from "lucide-react";
import { ToolList } from "@/features/tools/tool-row";
import {
  getCategoryBySlug,
  getCategorySummaryBySlug
} from "@/server/categories/queries";
import { listCategories } from "@/server/categories/queries";
import { listPublishedTools } from "@/server/tools/queries";
import { AnimatedNumber } from "@/components/motion/animated-number";
import { Reveal } from "@/components/motion/reveal";
import { SplitReveal } from "@/components/motion/split-reveal";

export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const categories = await listCategories();
    return categories.map((category) => ({ slug: category.slug }));
  } catch {
    return [];
  }
}

type CategoryPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return {
      title: "Category not found"
    };
  }

  return {
    title: `${category.name} AI Tools`,
    description: category.description ?? `Browse ${category.name} AI tools.`,
    alternates: {
      canonical: `/categories/${category.slug}`
    },
    openGraph: {
      title: `${category.name} AI Tools`,
      description: category.description ?? `Browse ${category.name} AI tools.`,
      url: `/categories/${category.slug}`,
      type: "website"
    }
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const [category, tools] = await Promise.all([
    getCategorySummaryBySlug(slug),
    listPublishedTools({ categorySlug: slug })
  ]);

  if (!category) {
    notFound();
  }

  return (
    <main>
      <section className="app-container page-hero">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div className="min-w-0">
            <Reveal y={10}>
              <nav
                aria-label="Breadcrumb"
                className="flex items-center gap-2 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-ink/45"
              >
                <Link className="transition-colors hover:text-ink" href="/categories">
                  Categories
                </Link>
                <span aria-hidden="true">/</span>
                <span className="truncate text-ink/70">{category.name}</span>
              </nav>
            </Reveal>
            <SplitReveal
              className="h1 mt-6 break-words"
              delay={0.05}
              lines={[[category.name], [{ text: "tools.", className: "ghost-word" }]]}
            />
            {category.description ? (
              <Reveal delay={0.35} y={16}>
                <p className="lead mt-6">{category.description}</p>
              </Reveal>
            ) : null}
          </div>
          <Reveal className="shrink-0 md:text-right" delay={0.3} y={16}>
            <p className="stat-number text-[clamp(3.5rem,8vw,6rem)]">
              <AnimatedNumber value={category.toolCount} />
            </p>
            <p className="mt-2 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-ink/50">
              Tools listed
            </p>
            <Link
              className="link-underline mt-5 text-sm"
              href={`/tools?category=${category.slug}`}
            >
              Filter in the directory
              <ArrowUpRight aria-hidden="true" size={14} />
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="app-container pb-24 md:pb-32">
        {tools.length > 0 ? (
          <ToolList tools={tools} />
        ) : (
          <Reveal className="empty-state" y={16}>
            <span className="empty-state-icon">
              <Search aria-hidden="true" size={22} />
            </span>
            <h2 className="empty-state-title">No tools here yet.</h2>
            <p className="empty-state-copy">Know a good one? Send it in.</p>
            <div className="empty-state-actions">
              <Link className="btn btn-primary" href="/submit">
                Submit a tool
              </Link>
              <Link className="btn btn-ghost" href="/categories">
                All categories
              </Link>
            </div>
          </Reveal>
        )}
      </section>
    </main>
  );
}
