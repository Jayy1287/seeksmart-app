import type { Metadata } from "next";
import { CategoryList } from "@/features/categories/category-list";
import { listCategorySummaries } from "@/server/categories/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "AI Tool Categories",
  description: "Browse AI tools by category.",
  alternates: {
    canonical: "/categories"
  },
  openGraph: {
    title: "AI Tool Categories",
    description: "Browse AI tools by category.",
    url: "/categories",
    type: "website"
  }
};

export default async function CategoriesPage() {
  const categories = await listCategorySummaries();
  const toolCount = categories.reduce(
    (total, category) => total + category.toolCount,
    0
  );

  return (
    <main className="page-shell">
      <div className="app-container">
      <section className="surface-strong rounded-2xl p-6">
        <p className="eyebrow">Browse</p>
        <div className="mt-2 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-4xl font-semibold">AI tool categories</h1>
            <p className="mt-3 max-w-2xl text-ink/65">
              Start with the type of work you want to improve, then compare
              tools inside that category.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="metric-tile rounded-xl px-4 py-3">
              <div className="text-2xl font-semibold">{categories.length}</div>
              <div className="text-ink/55">Categories</div>
            </div>
            <div className="metric-tile rounded-xl px-4 py-3">
              <div className="text-2xl font-semibold">{toolCount}</div>
              <div className="text-ink/55">Published tools</div>
            </div>
          </div>
        </div>
      </section>
      <section className="surface-panel mt-6 rounded-xl p-5">
        <CategoryList categories={categories} />
      </section>
      </div>
    </main>
  );
}
