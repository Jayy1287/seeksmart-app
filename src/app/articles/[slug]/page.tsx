import type { Metadata } from "next";
import type { Route } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { SplitReveal } from "@/components/motion/split-reveal";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { articles, getArticleBySlug, type ArticleBlock } from "@/lib/articles";
import { absoluteUrl, siteConfig } from "@/lib/site";
import { ReadingProgress } from "@/features/content/reading-progress";
import { formatShortDate, headingId, pad } from "@/features/content/slug";
import { TableOfContents } from "@/features/content/table-of-contents";

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

  const toc = article.blocks.map((block) => ({
    id: headingId(block.heading),
    label: block.heading
  }));
  const currentIndex = articles.findIndex((item) => item.slug === article.slug);
  const nextArticle = articles[(currentIndex + 1) % articles.length];
  const [firstIntro, ...restIntro] = article.intro;

  return (
    <main>
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
        type="application/ld+json"
      />
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        type="application/ld+json"
      />
      <ReadingProgress />

      <header className="app-container page-hero">
        <Reveal y={10}>
          <Link
            className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-ink/50 transition-colors hover:text-ink"
            href="/articles"
          >
            <ArrowLeft
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:-translate-x-1"
              size={14}
            />
            Articles
          </Link>
        </Reveal>
        <Reveal delay={0.05} y={10}>
          <p className="eyebrow mt-10">{article.audience}</p>
        </Reveal>
        <SplitReveal
          className="h1 mt-6 max-w-5xl"
          delay={0.1}
          lines={[[article.title]]}
          stagger={0.04}
        />
        <Reveal delay={0.4} y={14}>
          <p className="lead mt-6 max-w-2xl">{article.description}</p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-ink/10 pt-5 font-mono text-xs uppercase tracking-[0.12em] text-ink/50">
            <span>
              Updated{" "}
              <time dateTime={article.updatedAt}>{formatShortDate(article.updatedAt)}</time>
            </span>
            <span aria-hidden="true" className="h-1 w-1 rounded-full bg-ink/25" />
            <span>{article.readingTime}</span>
            <span aria-hidden="true" className="h-1 w-1 rounded-full bg-ink/25" />
            <span>{article.blocks.length} sections</span>
          </div>
        </Reveal>
      </header>

      <div className="app-container grid gap-12 pb-24 md:pb-32 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-20">
        <aside className="hidden lg:block">
          <div className="sticky top-32">
            <TableOfContents items={toc} />
          </div>
        </aside>

        <div className="min-w-0">
          <article className="prose-ss">
            {firstIntro ? (
              <p className="!text-[1.3rem] !leading-[1.6] !text-ink md:!text-[1.45rem]">{firstIntro}</p>
            ) : null}
            {restIntro.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}

            {article.blocks.map((block, index) => (
              <ArticleBlockView block={block} index={index} key={block.heading} />
            ))}
          </article>

          <Reveal className="mt-16 max-w-[44rem] border-t border-ink/10 pt-8">
            <p className="eyebrow eyebrow-plain">Topics</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {article.keywords.map((keyword) => (
                <span className="tag" key={keyword}>
                  {keyword}
                </span>
              ))}
            </div>
          </Reveal>

          <section className="mt-16 max-w-[44rem]">
            <Reveal>
              <p className="eyebrow eyebrow-plain">Keep going</p>
            </Reveal>
            <Stagger as="ul" className="row-list mt-6" inView>
              {article.related.map((item) => (
                <StaggerItem as="li" key={item.href}>
                  <Link
                    className="row-item group grid-cols-[minmax(0,1fr)_auto] py-5"
                    href={item.href as Route}
                  >
                    <span className="text-lg font-medium tracking-[-0.01em] transition-transform duration-500 ease-out group-hover:translate-x-1.5">
                      {item.label}
                    </span>
                    <span className="row-arrow">
                      <ArrowRight aria-hidden="true" size={16} />
                    </span>
                  </Link>
                </StaggerItem>
              ))}
            </Stagger>
          </section>

          {nextArticle && nextArticle.slug !== article.slug ? (
            <Reveal className="mt-16">
              <Link
                className="night group relative block overflow-hidden rounded-[2rem] px-6 py-10 sm:px-10 md:px-12 md:py-14"
                href={`/articles/${nextArticle.slug}` as Route}
              >
                <div
                  aria-hidden="true"
                  className="dot-grid absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_90%_10%,black,transparent_60%)]"
                />
                <div className="relative flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
                  <div className="min-w-0">
                    <p className="eyebrow">Next article</p>
                    <p className="mt-5 max-w-2xl font-display text-[clamp(1.8rem,3.6vw,3rem)] font-bold leading-[1.02] tracking-[-0.04em] text-white">
                      {nextArticle.title}
                    </p>
                    <p className="mt-4 font-mono text-xs uppercase tracking-[0.12em] text-white/45">
                      {nextArticle.readingTime}
                    </p>
                  </div>
                  <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white text-ink transition-all duration-500 ease-out group-hover:-rotate-45 group-hover:bg-signal group-hover:text-white">
                    <ArrowRight aria-hidden="true" size={20} />
                  </span>
                </div>
              </Link>
            </Reveal>
          ) : null}
        </div>
      </div>
    </main>
  );
}

function ArticleBlockView({ block, index }: { block: ArticleBlock; index: number }) {
  const id = headingId(block.heading);

  if (block.kind === "checklist") {
    return (
      <section className="scroll-mt-32" id={id}>
        <h2>
          <span className="mb-3 block font-mono text-xs font-normal tracking-[0.14em] text-signal">
            {pad(index)}
          </span>
          {block.heading}
        </h2>
        <ol className="!my-6 !list-none !pl-0">
          {block.items.map((item, itemIndex) => (
            <li
              className="!mb-0 flex gap-4 border-t border-ink/10 py-4 last:border-b"
              key={item}
            >
              <span className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink text-paper">
                <Check aria-hidden="true" size={13} strokeWidth={2.5} />
                <span className="sr-only">{itemIndex + 1}.</span>
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      </section>
    );
  }

  return (
    <section className="scroll-mt-32" id={id}>
      <h2>
        <span className="mb-3 block font-mono text-xs font-normal tracking-[0.14em] text-signal">
          {pad(index)}
        </span>
        {block.heading}
      </h2>
      {block.body.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </section>
  );
}
