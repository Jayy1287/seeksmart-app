import type { Metadata } from "next";
import type { Route } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { articles } from "@/lib/articles";
import { absoluteUrl } from "@/lib/site";
import { ContentHero } from "@/features/content/content-hero";
import { formatShortDate, pad } from "@/features/content/slug";

export const metadata: Metadata = {
  title: "AI Articles and Practical Buying Guides",
  description:
    "Useful, plain-English articles for choosing AI tools, planning business automation, and evaluating AI software without overbuying.",
  alternates: {
    canonical: "/articles"
  },
  openGraph: {
    title: "AI Articles and Practical Buying Guides",
    description:
      "Useful, plain-English articles for choosing AI tools, planning business automation, and evaluating AI software without overbuying.",
    url: "/articles",
    type: "website"
  }
};

export default function ArticlesPage() {
  const [featuredArticle, ...restArticles] = articles;
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: articles.map((article, index) => ({
      "@type": "ListItem",
      item: absoluteUrl(`/articles/${article.slug}`),
      name: article.title,
      position: index + 1
    }))
  };

  return (
    <main>
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
        type="application/ld+json"
      />
      <ContentHero
        eyebrow="Articles"
        lead="Plain-English buying guides. Fit, risk, price and payback."
        lines={[["Read before"], [{ text: "you buy.", className: "ghost-word" }]]}
      />

      <section className="app-container pb-24 md:pb-32">
        <Reveal>
          <Link
            className="group relative block overflow-hidden rounded-[2rem] bg-surface px-6 py-10 transition-shadow duration-500 hover:shadow-[0_30px_60px_-30px_rgb(14_14_16/0.35)] sm:px-10 md:rounded-[2.5rem] md:px-14 md:py-16"
            href={`/articles/${featuredArticle.slug}` as Route}
          >
            <div
              aria-hidden="true"
              className="grid-lines absolute inset-0 opacity-70 [mask-image:radial-gradient(ellipse_at_100%_0%,black,transparent_65%)]"
            />
            <div
              aria-hidden="true"
              className="glow-orb -right-32 -top-32 h-80 w-80 opacity-0 transition-opacity duration-700 group-hover:opacity-40"
            />
            <div className="relative grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="tag tag-signal">Start here</span>
                  <span className="font-mono text-xs uppercase tracking-[0.12em] text-ink/45">
                    {formatShortDate(featuredArticle.updatedAt)} · {featuredArticle.readingTime}
                  </span>
                </div>
                <h2 className="mt-7 max-w-4xl font-display text-[clamp(2.2rem,5vw,4.4rem)] font-bold leading-[0.98] tracking-[-0.045em]">
                  {featuredArticle.title}
                </h2>
                <p className="mt-6 max-w-2xl text-lg text-ink/60">{featuredArticle.description}</p>
              </div>
              <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-ink text-paper transition-transform duration-500 ease-out group-hover:-rotate-45 md:h-20 md:w-20">
                <ArrowRight aria-hidden="true" size={24} />
              </span>
            </div>
          </Link>
        </Reveal>

        <Stagger as="ol" className="row-list mt-14 md:mt-20" gap={0.05} inView>
          {restArticles.map((article, index) => (
            <StaggerItem as="li" key={article.slug}>
              <Link
                className="row-item group grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-3 py-7 md:grid-cols-[10.5rem_minmax(0,1fr)_7rem_auto] md:gap-x-8 md:py-9"
                href={`/articles/${article.slug}` as Route}
              >
                <span className="col-span-2 whitespace-nowrap font-mono text-xs uppercase tracking-[0.12em] text-ink/45 tabular md:col-span-1">
                  <span className="text-ink/30">{pad(index + 1)}</span>
                  <span className="mx-2 text-ink/20">/</span>
                  {formatShortDate(article.updatedAt)}
                </span>
                <span className="min-w-0">
                  <span className="block font-display text-[1.55rem] font-bold leading-[1.04] tracking-[-0.04em] transition-transform duration-500 ease-out group-hover:translate-x-2 md:text-[2.2rem]">
                    {article.title}
                  </span>
                  <span className="mt-3 line-clamp-2 block max-w-2xl text-[0.95rem] leading-relaxed text-ink/55">
                    {article.description}
                  </span>
                </span>
                <span className="hidden font-mono text-xs uppercase tracking-[0.12em] text-ink/45 md:block">
                  {article.readingTime}
                </span>
                <span className="row-arrow self-start md:self-center">
                  <ArrowRight aria-hidden="true" size={16} />
                </span>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </section>
    </main>
  );
}
