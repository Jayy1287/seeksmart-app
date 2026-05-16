import type { Metadata } from "next";
import type { Route } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Clock3,
  Compass,
  FileCheck2,
  Layers3,
  SearchCheck,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { articles } from "@/lib/articles";
import { absoluteUrl } from "@/lib/site";

const articleVisuals = {
  "ai-automation-ideas-by-department": {
    accent: "bg-accent/10 text-accent ring-accent/15",
    icon: Layers3,
    label: "Automation map"
  },
  "ai-tool-evaluation-checklist": {
    accent: "bg-signal/10 text-signal ring-signal/15",
    icon: ShieldCheck,
    label: "Vendor checklist"
  },
  "best-ai-tools-for-small-business": {
    accent: "bg-ink/5 text-ink/70 ring-ink/10",
    icon: Sparkles,
    label: "Small business"
  },
  "chatgpt-vs-ai-tools-for-business": {
    accent: "bg-accent/10 text-accent ring-accent/15",
    icon: FileCheck2,
    label: "Tool decision"
  },
  "how-to-choose-ai-tools-for-business": {
    accent: "bg-signal/10 text-signal ring-signal/15",
    icon: Compass,
    label: "Buying guide"
  }
};

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

        <Reveal className="mt-6">
          <Link
            className="surface-panel group relative flex h-full overflow-hidden rounded-2xl p-6 transition hover:-translate-y-1 hover:border-accent md:p-7"
            href={`/articles/${featuredArticle.slug}` as Route}
          >
            <span className="absolute inset-y-0 left-0 w-1 bg-accent" />
            <div className="grid w-full gap-6 lg:grid-cols-[1fr_260px] lg:items-end">
              <div>
                <ArticleLabel article={featuredArticle} />
                <h2 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight md:text-4xl">
                  {featuredArticle.title}
                </h2>
                <p className="mt-4 max-w-2xl leading-7 text-ink/65">
                  {featuredArticle.description}
                </p>
                <ArticleMeta article={featuredArticle} />
              </div>
              <div className="rounded-xl border border-line bg-surface/70 p-4">
                <p className="text-xs font-semibold uppercase text-ink/45">
                  Best first read
                </p>
                <p className="mt-2 text-sm leading-6 text-ink/62">
                  A plain buying framework before users compare vendors,
                  pricing, demos, or AI feature claims.
                </p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-accent transition group-hover:translate-x-0.5">
                  Read guide
                  <ArrowRight aria-hidden="true" size={14} />
                </span>
              </div>
            </div>
          </Link>
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
      className="surface-panel group relative flex h-full flex-col overflow-hidden rounded-xl p-5 transition hover:-translate-y-1 hover:border-accent"
      href={`/articles/${article.slug}` as Route}
    >
      <span className="absolute inset-x-0 top-0 h-1 bg-accent/75" />
      <ArticleLabel article={article} />
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

function ArticleLabel({ article }: { article: (typeof articles)[number] }) {
  const visual =
    articleVisuals[article.slug as keyof typeof articleVisuals] ??
    articleVisuals["how-to-choose-ai-tools-for-business"];
  const Icon = visual.icon;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span
        className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ring-1 ${visual.accent}`}
      >
        <Icon aria-hidden="true" size={18} />
      </span>
      <span>
        <span className="block text-xs font-semibold uppercase text-accent">
          {visual.label}
        </span>
        <span className="mt-0.5 block text-xs font-medium text-ink/45">
          {article.audience}
        </span>
      </span>
    </div>
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
