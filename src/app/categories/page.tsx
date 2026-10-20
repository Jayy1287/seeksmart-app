import type { Metadata } from "next";
import { CategoryList } from "@/features/categories/category-list";
import { listCategorySummaries } from "@/server/categories/queries";
import { AnimatedNumber } from "@/components/motion/animated-number";
import { Reveal } from "@/components/motion/reveal";
import { SplitReveal } from "@/components/motion/split-reveal";
import { Stagger, StaggerItem } from "@/components/motion/stagger";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "AI Tool Categories",
  description:
    "Browse AI tools by category once you know the kind of work you want to improve.",
  alternates: {
    canonical: "/categories"
  },
  openGraph: {
    title: "AI Tool Categories",
    description:
      "Browse AI tools by category once you know the kind of work you want to improve.",
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
    <main>
      <section className="app-container page-hero">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div>
            <Reveal y={12}>
              <p className="eyebrow">Categories</p>
            </Reveal>
            <SplitReveal
              className="h1 mt-6"
              delay={0.05}
              lines={[["Start with"], [{ text: "the job.", className: "ghost-word" }]]}
            />
            <Reveal delay={0.35} y={16}>
              <p className="lead mt-6">Pick the kind of work, then compare what fits.</p>
            </Reveal>
          </div>
          <Stagger className="grid shrink-0 grid-cols-2 gap-10 md:text-right" delay={0.3}>
            <StaggerItem>
              <p className="stat-number text-[clamp(3rem,6vw,5rem)]">
                <AnimatedNumber value={categories.length} />
              </p>
              <p className="mt-2 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-ink/50">
                Categories
              </p>
            </StaggerItem>
            <StaggerItem>
              <p className="stat-number text-[clamp(3rem,6vw,5rem)]">
                <AnimatedNumber value={toolCount} />
              </p>
              <p className="mt-2 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-ink/50">
                Tools
              </p>
            </StaggerItem>
          </Stagger>
        </div>
      </section>
      <section className="app-container pb-24 md:pb-32">
        <CategoryList categories={categories} />
      </section>
    </main>
  );
}
