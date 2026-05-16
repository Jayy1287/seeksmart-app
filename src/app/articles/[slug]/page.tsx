import type { Metadata } from "next";
import type { Route } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  SearchCheck
} from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { articles, getArticleBySlug, type ArticleBlock } from "@/lib/articles";
import { absoluteUrl, siteConfig } from "@/lib/site";

type ArticlePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.slug
  }));
}

export async function generateMetadata({
  params
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return {};
  }

  return {
    title: article.title,
    description: article.description,
    keywords: article.keywords,
    alternates: {
      canonical: `/articles/${article.slug}`
    },
    openGraph: {
      title: article.title,
      description: article.description,
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      type: "article",
      url: `/articles/${article.slug}`
    }
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const articleUrl = absoluteUrl(`/articles/${article.slug}`);
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    author: {
      "@type": "Organization",
      name: "SeekSmart"
    },
    dateModified: article.updatedAt,
    datePublished: article.publishedAt,
    description: article.description,
    headline: article.title,
    image: absoluteUrl("/brand/seeksmart-logo-v3.png"),
    inLanguage: "en",
    mainEntityOfPage: articleUrl,
    publisher: {
      "@type": "Organization",
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/brand/seeksmart-logo-v3.png")
      },
      name: siteConfig.name
    }
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        item: absoluteUrl("/"),
        name: "Home",
        position: 1
      },
      {
        "@type": "ListItem",
        item: absoluteUrl("/articles"),
        name: "Articles",
        position: 2
      },
      {
        "@type": "ListItem",
        item: articleUrl,
        name: article.title,
        position: 3
      }
    ]
  };

  return (
    <main className="page-shell">
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
        type="application/ld+json"
      />
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        type="application/ld+json"
      />
      <div className="app-container">
        <Reveal className="surface-strong rounded-2xl p-6 md:p-8">
          <Link
            className="inline-flex items-center gap-2 text-sm font-medium text-accent"
            href="/articles"
          >
            <ArrowLeft aria-hidden="true" size={15} />
            Articles
          </Link>
          <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_280px] lg:items-end">
            <div>
              <p className="eyebrow">
                <SearchCheck aria-hidden="true" size={14} />
                {article.audience}
              </p>
              <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight md:text-5xl">
                {article.title}
              </h1>
              <p className="mt-4 max-w-3xl text-lg leading-8 text-ink/68">
                {article.description}
              </p>
            </div>
            <div className="metric-tile rounded-xl p-4">
              <p className="text-xs font-semibold uppercase text-ink/45">
                Updated
              </p>
              <p className="mt-2 font-semibold">{formatDate(article.updatedAt)}</p>
              <p className="mt-2 inline-flex items-center gap-1 text-sm text-ink/58">
                <Clock3 aria-hidden="true" size={14} />
                {article.readingTime}
              </p>
            </div>
          </div>
        </Reveal>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_290px] lg:items-start">
          <article className="surface-panel rounded-2xl p-5 md:p-8">
            <div className="grid gap-5 text-lg leading-8 text-ink/70">
              {article.intro.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-8 grid gap-8">
              {article.blocks.map((block) => (
                <ArticleBlockView block={block} key={block.heading} />
              ))}
            </div>
          </article>

          <aside className="grid gap-4 lg:sticky lg:top-28">
            <div className="surface-panel rounded-xl p-5">
              <p className="text-xs font-semibold uppercase text-accent">
                Related paths
              </p>
              <div className="mt-4 grid gap-2">
                {article.related.map((item) => (
                  <Link
                    className="group flex items-center justify-between gap-3 rounded-lg border border-line bg-surface/70 px-3 py-2 text-sm font-medium transition hover:border-accent hover:text-accent"
                    href={item.href as Route}
                    key={item.href}
                  >
                    {item.label}
                    <ArrowRight
                      aria-hidden="true"
                      className="transition group-hover:translate-x-0.5"
                      size={14}
                    />
                  </Link>
                ))}
              </div>
            </div>

            <div className="metric-tile rounded-xl p-5">
              <p className="text-xs font-semibold uppercase text-ink/45">
                Topics
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {article.keywords.map((keyword) => (
                  <span
                    className="rounded-full border border-line bg-surface/70 px-2.5 py-1 text-xs font-medium text-ink/58"
                    key={keyword}
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function ArticleBlockView({ block }: { block: ArticleBlock }) {
  if (block.kind === "checklist") {
    return (
      <section className="rounded-2xl border border-accent/20 bg-accent/[0.035] p-5">
        <h2 className="text-2xl font-semibold leading-tight text-ink">
          {block.heading}
        </h2>
        <ul className="mt-4 grid gap-3">
          {block.items.map((item) => (
            <li className="flex gap-3 text-sm leading-6 text-ink/68" key={item}>
              <CheckCircle2
                aria-hidden="true"
                className="mt-0.5 shrink-0 text-accent"
                size={17}
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>
    );
  }

  return (
    <section>
      <h2 className="text-2xl font-semibold leading-tight text-ink md:text-3xl">
        {block.heading}
      </h2>
      <div className="mt-4 grid gap-4 text-base leading-8 text-ink/68 md:text-[1.05rem]">
        {block.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(new Date(value));
}
