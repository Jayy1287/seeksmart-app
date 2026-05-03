import Link from "next/link";
import type { ComponentType } from "react";
import { ArrowRight, CheckCircle2, Flame, Sparkles } from "lucide-react";
import type { PublicToolCard } from "@/shared/domain";

type ToolCardProps = {
  tool: PublicToolCard;
};

export function ToolCard({ tool }: ToolCardProps) {
  return (
    <article className="surface-panel group flex h-full flex-col rounded-xl p-5 transition hover:-translate-y-1 hover:border-accent">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <div className="tool-mark flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-semibold ring-1 ring-line/40">
            {tool.name.slice(0, 1)}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="truncate font-semibold">{tool.name}</h2>
              {tool.isVerified ? (
                <CheckCircle2
                  aria-label="Verified"
                  className="shrink-0 text-accent"
                  size={16}
                />
              ) : null}
            </div>
            <Link
              className="mt-1 block text-sm text-ink/60 hover:text-accent"
              href={`/categories/${tool.category.slug}`}
            >
              {tool.category.name}
            </Link>
          </div>
        </div>
        <span className="status-pill shrink-0">
          {formatPricing(tool.pricingType)}
        </span>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {tool.isFeatured ? (
          <Badge icon={Sparkles} label="Featured" />
        ) : null}
        {tool.popularityScore >= 80 ? <Badge icon={Flame} label="Trending" /> : null}
        {tool.hasFreePlan ? <Badge label="Free plan" /> : null}
      </div>
      <p className="mt-4 flex-1 text-sm leading-6 text-ink/70">
        {tool.shortDescription}
      </p>
      <div className="mt-5 flex items-center justify-between gap-3">
        <span className="text-xs text-ink/45">Score {tool.popularityScore}</span>
        <Link
          className="inline-flex items-center gap-1 text-sm font-medium text-accent transition group-hover:translate-x-0.5"
          href={`/tools/${tool.slug}`}
        >
          View details
          <ArrowRight aria-hidden="true" size={14} />
        </Link>
      </div>
    </article>
  );
}

type BadgeProps = {
  label: string;
  icon?: ComponentType<{ "aria-hidden": true; size: number }>;
};

function Badge({ icon: Icon, label }: BadgeProps) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent ring-1 ring-accent/15">
      {Icon ? <Icon aria-hidden={true} size={13} /> : null}
      {label}
    </span>
  );
}

function formatPricing(pricingType: PublicToolCard["pricingType"]) {
  if (pricingType === "FREEMIUM") {
    return "Freemium";
  }

  if (pricingType === "FREE") {
    return "Free";
  }

  return "Paid";
}
