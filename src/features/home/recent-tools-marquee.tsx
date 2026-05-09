"use client";

import Link from "next/link";
import { ToolLogo } from "@/features/tools/tool-logo";
import type { PublicToolCard } from "@/shared/domain";

type RecentToolsMarqueeProps = {
  tools: PublicToolCard[];
};

export function RecentToolsMarquee({ tools }: RecentToolsMarqueeProps) {
  if (tools.length === 0) {
    return null;
  }

  return (
    <div className="recent-marquee" tabIndex={0}>
      <div className="recent-marquee-track">
        <MarqueeGroup tools={tools} />
        <MarqueeGroup ariaHidden tools={tools} />
      </div>
    </div>
  );
}

function MarqueeGroup({
  ariaHidden,
  tools
}: {
  ariaHidden?: boolean;
  tools: PublicToolCard[];
}) {
  return (
    <div aria-hidden={ariaHidden} className="recent-marquee-group">
      {tools.map((tool) => (
        <Link
          className="recent-marquee-item"
          href={`/tools/${tool.slug}`}
          key={tool.id}
          tabIndex={ariaHidden ? -1 : undefined}
        >
          <ToolLogo logoUrl={tool.logoUrl} name={tool.name} size="sm" />
          {tool.name}
        </Link>
      ))}
    </div>
  );
}
