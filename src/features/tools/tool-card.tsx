import type { PublicToolCard } from "@/shared/domain";

type ToolCardProps = {
  tool: PublicToolCard;
};

export function ToolCard({ tool }: ToolCardProps) {
  return (
    <article className="rounded-md border border-line bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-semibold">{tool.name}</h2>
          <p className="mt-1 text-sm text-ink/60">{tool.category.name}</p>
        </div>
        <span className="rounded-md border border-line px-2 py-1 text-xs font-medium">
          {tool.pricingType.toLowerCase()}
        </span>
      </div>
      <p className="mt-4 text-sm leading-6 text-ink/70">
        {tool.shortDescription}
      </p>
      <a
        className="mt-5 inline-flex text-sm font-medium text-accent"
        href={`/tools/${tool.slug}`}
      >
        View details
      </a>
    </article>
  );
}

