import Link from "next/link";
import { CheckCircle2, ExternalLink } from "lucide-react";
import type { PublicToolCard } from "@/shared/domain";

type ToolCardProps = {
  tool: PublicToolCard;
};

export function ToolCard({ tool }: ToolCardProps) {
  return (
    <article className="flex h-full flex-col rounded-md border border-line bg-white p-5 transition hover:border-accent">
      <div className="flex items-start justify-between gap-4">
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
          <p className="mt-1 text-sm text-ink/60">{tool.category.name}</p>
        </div>
        <span className="rounded-md border border-line px-2 py-1 text-xs font-medium">
          {formatPricing(tool.pricingType)}
        </span>
      </div>
      <p className="mt-4 flex-1 text-sm leading-6 text-ink/70">
        {tool.shortDescription}
      </p>
      <div className="mt-5 flex items-center justify-between gap-3">
        {tool.hasFreePlan ? (
          <span className="rounded-md bg-accent/10 px-2 py-1 text-xs font-medium text-accent">
            Free plan
          </span>
        ) : (
          <span />
        )}
        <Link
          className="inline-flex items-center gap-1 text-sm font-medium text-accent"
          href={`/tools/${tool.slug}`}
        >
          Details
          <ExternalLink aria-hidden="true" size={14} />
        </Link>
      </div>
    </article>
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
