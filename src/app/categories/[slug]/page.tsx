import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ToolCard } from "@/features/tools/tool-card";
import { getCategoryBySlug } from "@/server/categories/queries";
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
    getCategoryBySlug(slug),
    listPublishedTools({ categorySlug: slug })
  ]);

  if (!category) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
      <Link className="text-sm font-medium text-accent" href="/categories">
        Categories
      </Link>
      <h1 className="mt-3 text-4xl font-semibold">{category.name} AI tools</h1>
      {category.description ? (
        <p className="mt-3 max-w-2xl text-ink/65">{category.description}</p>
      ) : null}

      <section className="mt-8">
        {tools.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        ) : (
          <div className="rounded-md border border-line bg-white p-8 text-center">
            <h2 className="font-semibold">No published tools yet</h2>
            <p className="mt-2 text-sm text-ink/60">
              This category is ready for curated listings.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
