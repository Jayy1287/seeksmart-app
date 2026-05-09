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

  const marqueeTools = tools.length > 1 ? [...tools, ...tools] : tools;

  return (
    <div className="recent-marquee" tabIndex={0}>
      <div className="recent-marquee-track">
        {marqueeTools.map((tool, index) => (
          <Link
            className="recent-marquee-item"
            href={`/tools/${tool.slug}`}
            key={`${tool.id}-${index}`}
          >
            <ToolLogo logoUrl={tool.logoUrl} name={tool.name} size="sm" />
            {tool.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
