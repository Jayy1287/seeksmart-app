import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AnimatedBar } from "@/components/motion/animated-bar";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import type { PublicCategory, PublicCategorySummary } from "@/shared/domain";

type CategoryListProps = {
  categories: Array<PublicCategory | PublicCategorySummary>;
};

// Big-type index: number, name, one-line description, tool count with a
// relative meter, arrow. Every row is a link with the house hover sweep.
export function CategoryList({ categories }: CategoryListProps) {
  const maxCount = Math.max(
    1,
    ...categories.map((category) => ("toolCount" in category ? category.toolCount : 0))
  );

  return (
    <Stagger as="ul" className="row-list" gap={0.04} inView>
      {categories.map((category, index) => {
        const count = "toolCount" in category ? category.toolCount : null;
        return (
          <StaggerItem as="li" key={category.id}>
            <Link
              className="row-item group grid-cols-[2rem_minmax(0,1fr)_auto] gap-x-4 gap-y-1.5 py-6 md:grid-cols-[4rem_minmax(0,1.1fr)_minmax(0,1fr)_8rem_2.25rem] md:gap-x-8 md:py-8"
              href={`/categories/${category.slug}`}
            >
              <span className="self-start pt-2 font-mono text-[0.78rem] text-ink/35 tabular md:self-center md:pt-0 md:text-sm">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0 font-display text-[1.65rem] font-bold leading-[1.02] tracking-[-0.04em] transition-[transform,color] duration-500 ease-out group-hover:translate-x-2 md:text-[clamp(2rem,3.4vw,2.9rem)]">
                {category.name}
              </span>
              {category.description ? (
                <span className="col-start-2 row-start-2 line-clamp-2 text-[0.92rem] leading-snug text-ink/50 md:col-start-3 md:row-start-1">
                  {category.description}
                </span>
              ) : null}
              {count !== null ? (
                <span className="col-start-2 row-start-3 flex items-center gap-3 md:col-start-4 md:row-start-1 md:block">
                  <span className="font-mono text-sm text-ink/70 tabular">
                    {count} {count === 1 ? "tool" : "tools"}
                  </span>
                  <span className="meter block w-20 md:mt-2 md:w-full">
                    <AnimatedBar className="group-hover:bg-signal" value={(count / maxCount) * 100} />
                  </span>
                </span>
              ) : null}
              <span aria-hidden="true" className="row-arrow col-start-3 row-start-1 md:col-start-5">
                <ArrowRight size={16} />
              </span>
            </Link>
          </StaggerItem>
        );
      })}
    </Stagger>
  );
}
