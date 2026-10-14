import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ScoreDial } from "@/components/ui/score-dial";
import { easeScore } from "@/features/opportunities/ease";
import { LevelTag } from "@/features/use-cases/level-tag";

type OpportunityRowData = {
  name: string;
  slug: string;
  description: string | null;
  effortLevel: string;
  riskLevel: string;
  timeToValue: string | null;
};

// One opportunity as a list row: ease dial, name, one line, effort/risk tags.
export function OpportunityRow({
  highlight = false,
  opportunity
}: {
  highlight?: boolean;
  opportunity: OpportunityRowData;
}) {
  const score = easeScore(opportunity.effortLevel, opportunity.riskLevel);

  return (
    <Link
      className="row-item group grid-cols-[auto_minmax(0,1fr)_auto] gap-x-4 gap-y-3 py-5 md:grid-cols-[auto_minmax(0,1fr)_14.5rem_5.5rem_auto] md:gap-x-6 md:py-6"
      href={`/opportunities/${opportunity.slug}`}
    >
      <ScoreDial label="Ease to start" size={48} tone={highlight ? "signal" : "ink"} value={score} />
      <span className="min-w-0">
        <span className="block font-display text-[1.2rem] font-semibold leading-tight tracking-[-0.025em] transition-transform duration-500 ease-out group-hover:translate-x-1.5 md:text-[1.4rem]">
          {opportunity.name}
        </span>
        {opportunity.description ? (
          <span className="mt-1 block text-[0.95rem] text-ink/55 md:line-clamp-2">{opportunity.description}</span>
        ) : null}
      </span>
      <span className="col-span-3 row-start-2 flex flex-wrap items-center gap-1.5 md:col-span-1 md:col-start-3 md:row-start-1">
        <LevelTag label="effort" level={opportunity.effortLevel} />
        <LevelTag label="risk" level={opportunity.riskLevel} />
        {opportunity.timeToValue ? (
          <span className="ml-1 font-mono text-xs text-ink/50 md:hidden">{opportunity.timeToValue}</span>
        ) : null}
      </span>
      <span className="hidden text-right font-mono text-sm text-ink/55 md:block">
        {opportunity.timeToValue ?? "-"}
      </span>
      <span className="row-arrow col-start-3 row-start-1 md:col-start-5">
        <ArrowRight aria-hidden="true" size={16} />
      </span>
    </Link>
  );
}
