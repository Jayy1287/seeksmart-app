import Link from "next/link";
import type { PublicCategory, PublicCategorySummary } from "@/shared/domain";

type CategoryListProps = {
  categories: Array<PublicCategory | PublicCategorySummary>;
};

export function CategoryList({ categories }: CategoryListProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {categories.map((category) => (
        <Link
          className="rounded-md border border-line px-4 py-3 text-sm font-medium transition hover:border-accent hover:text-accent"
          href={`/categories/${category.slug}`}
          key={category.id}
        >
          <span>{category.name}</span>
          {"toolCount" in category ? (
            <span className="mt-1 block text-xs font-normal text-ink/50">
              {category.toolCount} tools
            </span>
          ) : null}
        </Link>
      ))}
    </div>
  );
}
