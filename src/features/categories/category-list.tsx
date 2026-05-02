import type { PublicCategory } from "@/shared/domain";

type CategoryListProps = {
  categories: PublicCategory[];
};

export function CategoryList({ categories }: CategoryListProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {categories.map((category) => (
        <a
          className="rounded-md border border-line px-4 py-3 text-sm font-medium transition hover:border-accent hover:text-accent"
          href={`/categories/${category.slug}`}
          key={category.id}
        >
          {category.name}
        </a>
      ))}
    </div>
  );
}

