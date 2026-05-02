import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Boxes, Search } from "lucide-react";
import { ToolCard } from "@/features/tools/tool-card";
import {
  getCategoryBySlug,
  getCategorySummaryBySlug
} from "@/server/categories/queries";
import { listPublishedTools } from "@/server/tools/queries";

export const dynamic = "force-dynamic";

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
    description: category.description ?? `Browse ${category.name} AI tools.`
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
    <main className="mx-auto max-w-6xl px-5 py-10">
      <section className="rounded-md border border-line bg-white p-6">
        <Link className="text-sm font-medium text-accent" href="/categories">
          Categories
        </Link>
        <div className="mt-3 grid gap-6 md:grid-cols-[1fr_260px] md:items-end">
          <div>
            <h1 className="text-4xl font-semibold">
              {category.name} AI tools
            </h1>
            {category.description ? (
              <p className="mt-3 max-w-2xl leading-7 text-ink/65">
                {category.description}
              </p>
            ) : null}
          </div>
          <div className="rounded-md border border-line p-4">
            <div className="flex items-center gap-2">
              <Boxes aria-hidden="true" className="text-accent" size={18} />
              <span className="text-2xl font-semibold">
                {category.toolCount}
              </span>
            </div>
            <p className="mt-1 text-sm text-ink/55">Published tools</p>
          </div>
        </div>
      </section>

      <section className="mt-6">
        {tools.length > 0 ? (
          <>
            <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <h2 className="text-xl font-semibold">Recommended tools</h2>
              <Link
                className="inline-flex items-center gap-2 text-sm font-medium text-accent"
                href={`/tools?category=${category.slug}`}
              >
                Search this category
                <ArrowRight aria-hidden="true" size={16} />
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {tools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </>
        ) : (
          <div className="rounded-md border border-line bg-white p-8 text-center">
            <Search
              aria-hidden="true"
              className="mx-auto mb-4 text-accent"
              size={24}
            />
            <h2 className="font-semibold">No published tools yet</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-ink/60">
              This category is ready for curated listings.
            </p>
            <Link
              className="mt-5 inline-flex min-h-11 items-center justify-center rounded-md bg-ink px-5 font-medium text-paper"
              href="/submit"
            >
              Submit a tool
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
