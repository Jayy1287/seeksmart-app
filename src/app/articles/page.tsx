import type { Metadata } from "next";
import type { Route } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Clock3, SearchCheck } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { articles } from "@/lib/articles";
import { absoluteUrl } from "@/lib/site";

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
    <main className="page-shell">
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
        type="application/ld+json"
      />
      <div className="app-container">
        <Reveal className="surface-strong rounded-2xl p-6 md:p-8">
          <p className="eyebrow">
            <BookOpen aria-hidden="true" size={14} />
            AI articles
          </p>
          <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_320px] lg:items-end">
            <div>
              <h1 className="max-w-4xl text-4xl font-semibold leading-tight md:text-5xl">
                Practical guides for choosing AI tools without the noise.
              </h1>
              <p className="mt-4 max-w-2xl leading-7 text-ink/65">
                Deep, useful articles for buyers who need to compare AI tools,
                plan a first automation, and avoid expensive software mistakes.
              </p>
            </div>
            <div className="metric-tile rounded-xl p-4">
              <SearchCheck aria-hidden="true" className="text-accent" size={22} />
              <p className="mt-3 text-sm leading-6 text-ink/60">
                Written around real buying questions: tool fit, workflow value,
                rollout risk, data controls, pricing, and ROI.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal className="mt-6 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <Link
            className="surface-panel group flex h-full flex-col rounded-2xl p-6 transition hover:-translate-y-1 hover:border-accent"
            href={`/articles/${featuredArticle.slug}` as Route}
          >
            <span className="text-xs font-semibold uppercase text-accent">
              Start here
            </span>
            <h2 className="mt-4 max-w-2xl text-3xl font-semibold leading-tight">
              {featuredArticle.title}
            </h2>
            <p className="mt-4 max-w-2xl leading-7 text-ink/65">
              {featuredArticle.description}
            </p>
            <ArticleMeta article={featuredArticle} />
            <span className="mt-8 inline-flex items-center gap-1 text-sm font-medium text-accent transition group-hover:translate-x-0.5">
              Read guide
              <ArrowRight aria-hidden="true" size={14} />
            </span>
          </Link>

          <div className="grid gap-3">
            {articles.slice(0, 3).map((article) => (
              <div className="metric-tile rounded-xl p-4" key={article.slug}>
                <p className="text-xs font-semibold uppercase text-ink/45">
                  {article.audience}
                </p>
                <p className="mt-2 text-sm leading-6 text-ink/62">
                  {article.keywords.slice(0, 2).join(" / ")}
                </p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal className="mt-6 grid gap-4 md:grid-cols-2">
          {restArticles.map((article) => (
            <ArticleCard article={article} key={article.slug} />
          ))}
        </Reveal>
      </div>
    </main>
  );
}

function ArticleCard({ article }: { article: (typeof articles)[number] }) {
  return (
    <Link
      className="surface-panel group flex h-full flex-col rounded-xl p-5 transition hover:-translate-y-1 hover:border-accent"
      href={`/articles/${article.slug}` as Route}
    >
      <p className="text-xs font-semibold uppercase text-accent">
        {article.audience}
      </p>
      <h2 className="mt-3 text-2xl font-semibold leading-tight">
        {article.title}
      </h2>
      <p className="mt-3 flex-1 leading-7 text-ink/65">
        {article.description}
      </p>
      <ArticleMeta article={article} />
      <span className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-accent transition group-hover:translate-x-0.5">
        Read article
        <ArrowRight aria-hidden="true" size={14} />
      </span>
    </Link>
  );
}

function ArticleMeta({ article }: { article: (typeof articles)[number] }) {
  return (
    <div className="mt-5 flex flex-wrap items-center gap-3 text-xs font-medium text-ink/45">
      <span>{formatDate(article.updatedAt)}</span>
      <span className="inline-flex items-center gap-1">
        <Clock3 aria-hidden="true" size={13} />
        {article.readingTime}
      </span>
    </div>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric"
  }).format(new Date(value));
}
