import type { Metadata } from "next";
import { CategoryList } from "@/features/categories/category-list";
import { listCategories } from "@/server/categories/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "AI Tool Categories",
  description: "Browse AI tools by category."
};

export default async function CategoriesPage() {
  const categories = await listCategories();

  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
      <p className="text-sm font-medium uppercase text-accent">Browse</p>
      <h1 className="mt-2 text-4xl font-semibold">Categories</h1>
      <p className="mt-3 max-w-2xl text-ink/65">
        Start with the type of work you want to improve.
      </p>
      <section className="mt-8 rounded-md border border-line bg-white p-5">
        <CategoryList categories={categories} />
      </section>
    </main>
  );
}
