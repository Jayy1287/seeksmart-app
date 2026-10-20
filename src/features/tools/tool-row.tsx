import Link from "next/link";
import { ArrowRight, BadgeCheck, ExternalLink } from "lucide-react";
import { TrackedExternalLink } from "@/features/analytics/tracked-link";
import { ToolLikeButton } from "@/features/tools/tool-like-button";
import { ToolLogo } from "@/features/tools/tool-logo";
import { ScoreDial } from "@/components/ui/score-dial";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import type { PricingType, PublicToolCard } from "@/shared/domain";

// The directory's default unit: one scannable row per tool. The tool name is a
// stretched link so the whole row is clickable, while the like button (and the
// optional website link) sit above it on their own layer.

const columns =
  "grid-cols-[2.75rem_minmax(0,1fr)_auto] md:grid-cols-[3rem_minmax(0,1fr)_9.5rem_6.5rem_2.75rem_3.5rem_2.25rem]";

type ToolRowProps = {
  tool: PublicToolCard;
  /** When set, renders a tracked "visit website" icon with this analytics source. */
  websiteSource?: string;
};

export function ToolRow({ tool, websiteSource }: ToolRowProps) {
  const isTop = tool.popularityScore >= 90;

  return (
    <article
      className={`row-item row-link group ${columns} items-start gap-x-4 gap-y-2 py-5 md:items-center md:gap-x-6 md:py-6`}
    >
      <ToolLogo
        className="col-start-1 row-span-2 row-start-1 transition-transform duration-500 ease-out group-hover:scale-105 md:row-span-1"
        logoUrl={tool.logoUrl}
        name={tool.name}
      />

      <div className="col-start-2 row-start-1 min-w-0">
        <h3 className="flex items-center gap-1.5 font-display text-[1.2rem] font-bold leading-tight tracking-[-0.03em] transition-transform duration-500 ease-out group-hover:translate-x-1 md:text-[1.4rem]">
          <Link
            className="min-w-0 truncate after:absolute after:inset-0 after:z-[1] after:content-[''] focus-visible:outline-offset-4"
            href={`/tools/${tool.slug}`}
          >
            {tool.name}
          </Link>
          {tool.isVerified ? (
            <BadgeCheck aria-label="Verified" className="shrink-0 text-accent" size={17} />
          ) : null}
        </h3>
        <p className="mt-1 line-clamp-2 text-[0.92rem] leading-snug text-ink/55 md:line-clamp-1">
          {tool.shortDescription}
        </p>
      </div>

      <div className="col-start-2 row-start-2 flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1.5 md:contents">
        <span className="min-w-0 truncate text-[0.86rem] text-ink/55 md:col-start-3 md:row-start-1">
          {tool.category.name}
        </span>
        <span className="md:col-start-4 md:row-start-1">
          <span className="tag">{formatPricing(tool.pricingType)}</span>
        </span>
      </div>

      <div className="relative z-[2] col-start-3 row-start-2 flex items-center justify-center gap-1 md:col-start-5 md:row-start-1">
        <ToolLikeButton toolId={tool.id} toolName={tool.name} toolSlug={tool.slug} variant="icon" />
        {websiteSource ? (
          <TrackedExternalLink
            aria-label={`Visit ${tool.name} website`}
            className="hidden h-10 w-10 items-center justify-center rounded-full text-ink/40 transition-colors hover:bg-surface hover:text-ink sm:inline-flex"
            event="tool_website_clicked"
            href={tool.websiteUrl}
            properties={{ source: websiteSource, toolSlug: tool.slug }}
            rel="noreferrer"
            target="_blank"
          >
            <ExternalLink aria-hidden="true" size={15} />
          </TrackedExternalLink>
        ) : null}
      </div>

      <ScoreDial
        className="col-start-3 row-start-1 md:col-start-6"
        label={`${tool.name} score`}
        size={46}
        tone={isTop ? "signal" : "ink"}
        value={tool.popularityScore}
      />

      <span aria-hidden="true" className="row-arrow hidden group-hover:-rotate-45 group-hover:border-ink group-hover:bg-ink group-hover:text-paper md:col-start-7 md:inline-flex">
        <ArrowRight size={15} />
      </span>
    </article>
  );
}

type ToolListProps = {
  className?: string;
  /** Animate when scrolled into view instead of on mount. */
  inView?: boolean;
  showHeader?: boolean;
  tools: PublicToolCard[];
  websiteSource?: string;
};

export function ToolList({
  className,
  inView = false,
  showHeader = true,
  tools,
  websiteSource
}: ToolListProps) {
  return (
    <div className={className}>
      {showHeader ? (
        <div
          aria-hidden="true"
          className={`hidden ${columns} gap-x-6 pb-3 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-ink/40 md:grid`}
        >
          <span className="col-span-2">Tool</span>
          <span>Category</span>
          <span>Pricing</span>
          <span />
          <span className="text-center">Score</span>
          <span />
        </div>
      ) : null}
      <Stagger as="ul" className="row-list" gap={0.035} inView={inView}>
        {tools.map((tool) => (
          <StaggerItem as="li" key={tool.id}>
            <ToolRow tool={tool} websiteSource={websiteSource} />
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  );
}

export function formatPricing(pricingType: PricingType | string) {
  if (pricingType === "FREEMIUM") {
    return "Freemium";
  }

  if (pricingType === "FREE") {
    return "Free";
  }

  return "Paid";
}
