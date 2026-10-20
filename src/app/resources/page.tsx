import type { Metadata } from "next";
import type { Route } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { resourceLinks } from "@/lib/platform-content";
import { articles } from "@/lib/articles";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { ContentHero } from "@/features/content/content-hero";
import { pad } from "@/features/content/slug";

export const metadata: Metadata = {
  title: "AI Resources",
  description:
    "Guides, checklists, and practical starting points for business AI decisions.",
  alternates: {
    canonical: "/resources"
  },
  openGraph: {
    title: "AI Resources",
    description:
      "Guides, checklists, and practical starting points for business AI decisions.",
    url: "/resources",
    type: "website"
  }
};

export default function ResourcesPage() {
  const items = [
    ...resourceLinks.map((resource) => ({
      description: resource.description,
      href: resource.href,
      icon: resource.icon,
      title: resource.title
    })),
    {
      description: `${articles.length} plain-English buying guides.`,
      href: "/articles",
      icon: null,
      title: "Articles"
    }
  ];

  return (
    <main>
      <ContentHero
        eyebrow="Resources"
        lead="Checklists, maps and guides. Problem first, software second."
        lines={[["Everything"], [{ text: "in one place.", className: "ghost-word" }]]}
      />

      <section className="app-container pb-24 md:pb-32">
        <Stagger as="ol" className="row-list" gap={0.05} inView>
          {items.map((item, index) => {
            const Icon = item.icon;

            return (
              <StaggerItem as="li" key={item.href}>
                <Link
                  className="row-item group grid-cols-[2.25rem_minmax(0,1fr)_auto] gap-x-4 gap-y-2 py-7 md:grid-cols-[4.5rem_3rem_minmax(0,1fr)_minmax(0,1fr)_auto] md:gap-x-8 md:py-9"
                  href={item.href as Route}
                >
                  <span className="font-mono text-sm text-ink/40 tabular">{pad(index)}</span>
                  <span className="hidden h-11 w-11 items-center justify-center rounded-full border border-ink/10 text-ink/60 transition-colors duration-300 group-hover:border-signal group-hover:text-signal md:inline-flex">
                    {Icon ? <Icon aria-hidden="true" size={18} /> : <span className="h-2 w-2 rounded-full bg-current" />}
                  </span>
                  <span className="min-w-0 font-display text-[1.6rem] font-bold leading-[1.02] tracking-[-0.04em] transition-transform duration-500 ease-out group-hover:translate-x-2 md:text-[2.35rem]">
                    {item.title}
                  </span>
                  <span className="col-start-2 row-start-2 text-[0.95rem] text-ink/55 md:col-start-4 md:row-start-1">
                    {item.description}
                  </span>
                  <span className="row-arrow col-start-3 row-start-1 md:col-start-5">
                    <ArrowRight aria-hidden="true" size={16} />
                  </span>
                </Link>
              </StaggerItem>
            );
          })}
        </Stagger>
      </section>
    </main>
  );
}
