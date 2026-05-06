import Link from "next/link";
import type { PublicCategory, PublicCategorySummary } from "@/shared/domain";

type CategoryListProps = {
  categories: Array<PublicCategory | PublicCategorySummary>;
};

export function CategoryList({ categories }: CategoryListProps) {
  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-1 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => (
        <Link
          className="group flex min-h-16 flex-col justify-center border-t border-line/70 py-4 text-sm font-medium transition hover:border-accent hover:text-accent"
          href={`/categories/${category.slug}`}
          key={category.id}
        >
          <span>{category.name}</span>
          {"toolCount" in category ? (
            <span className="mt-1 block text-xs font-normal text-ink/50 transition group-hover:text-accent/70">
              {category.toolCount} tools
            </span>
          ) : null}
        </Link>
      ))}
    </div>
  );
}
