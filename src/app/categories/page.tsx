import type { Metadata } from "next";
import { CategoryList } from "@/features/categories/category-list";
import { listCategorySummaries } from "@/server/categories/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "AI Tool Categories",
  description: "Browse AI tools by category."
};

export default async function CategoriesPage() {
  const categories = await listCategorySummaries();
  const toolCount = categories.reduce(
    (total, category) => total + category.toolCount,
    0
  );

  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
      <section className="rounded-md border border-line bg-white p-6">
        <p className="text-sm font-medium uppercase text-accent">Browse</p>
        <div className="mt-2 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-4xl font-semibold">AI tool categories</h1>
            <p className="mt-3 max-w-2xl text-ink/65">
              Start with the type of work you want to improve, then compare
              tools inside that category.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-md border border-line px-4 py-3">
              <div className="text-2xl font-semibold">{categories.length}</div>
              <div className="text-ink/55">Categories</div>
            </div>
            <div className="rounded-md border border-line px-4 py-3">
              <div className="text-2xl font-semibold">{toolCount}</div>
              <div className="text-ink/55">Published tools</div>
            </div>
          </div>
        </div>
      </section>
      <section className="mt-6 rounded-md border border-line bg-white p-5">
        <CategoryList categories={categories} />
      </section>
    </main>
  );
}
