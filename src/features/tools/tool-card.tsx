import Link from "next/link";
import type { ComponentType } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Flame,
  Gauge,
  Sparkles
} from "lucide-react";
import { ToolLikeButton } from "@/features/tools/tool-like-button";
import { ToolLogo } from "@/features/tools/tool-logo";
import type { PublicToolCard, ToolLikeState } from "@/shared/domain";

type ToolCardProps = {
  isSignedIn?: boolean;
  tool: PublicToolCard & {
    like?: ToolLikeState;
  };
};

export function ToolCard({ isSignedIn = false, tool }: ToolCardProps) {
  const titleParts = splitFinalWord(tool.name);

  return (
    <article className="decision-card group flex h-full min-h-[19rem] flex-col p-5 pl-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <ToolLogo logoUrl={tool.logoUrl} name={tool.name} />
          <div className="min-w-0">
            <p className="decision-card-kicker">Tool signal</p>
            <h2 className="decision-card-title mt-1 text-lg">
              {titleParts.leading ? `${titleParts.leading} ` : null}
              <span className="inline-flex items-center gap-1 whitespace-nowrap">
                {titleParts.final}
                {tool.isVerified ? (
                  <CheckCircle2
                    aria-label="Verified"
                    className="text-accent"
                    size={16}
                  />
                ) : null}
              </span>
            </h2>
            <Link
              className="mt-1 block text-sm font-medium text-ink/58 hover:text-accent"
              href={`/categories/${tool.category.slug}`}
            >
              {tool.category.name}
            </Link>
          </div>
        </div>
        <div className="decision-card-stat shrink-0">
          <strong>{tool.popularityScore}</strong>
          <span>Score</span>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="status-pill">
          <Gauge aria-hidden="true" size={13} />
          {formatPricing(tool.pricingType)}
        </span>
        {tool.isFeatured ? (
          <Badge icon={Sparkles} label="Featured" />
        ) : null}
        {tool.popularityScore >= 80 ? <Badge icon={Flame} label="Trending" /> : null}
        {tool.hasFreePlan ? <Badge label="Free plan" /> : null}
      </div>
      <p className="decision-card-copy mt-4 flex-1 text-sm">
        {tool.shortDescription}
      </p>
      <div aria-hidden="true" className="decision-meter mt-5">
        <span style={{ width: `${clampScore(tool.popularityScore)}%` }} />
      </div>
      <div className="decision-card-footer flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase text-ink/42">
            Decision fit
          </span>
          {tool.like ? (
            <ToolLikeButton
              isSignedIn={isSignedIn}
              state={tool.like}
              toolId={tool.id}
              toolName={tool.name}
              toolSlug={tool.slug}
            />
          ) : null}
        </div>
        <Link
          className="inline-flex items-center gap-1 text-sm font-bold text-accent transition group-hover:translate-x-0.5"
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

function clampScore(score: number) {
  return Math.max(4, Math.min(score, 100));
}

function splitFinalWord(value: string) {
  const trimmed = value.trim();
  const lastSpace = trimmed.lastIndexOf(" ");

  if (lastSpace === -1) {
    return {
      leading: "",
      final: trimmed
    };
  }

  return {
    leading: trimmed.slice(0, lastSpace),
    final: trimmed.slice(lastSpace + 1)
  };
}
