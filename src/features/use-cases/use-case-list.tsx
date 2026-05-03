import Link from "next/link";
import type { PublicUseCaseSummary } from "@/server/use-cases/queries";

type UseCaseListProps = {
  useCases: PublicUseCaseSummary[];
};

export function UseCaseList({ useCases }: UseCaseListProps) {
  return (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
      {useCases.map((useCase) => (
        <Link
          className="surface-panel rounded-xl p-4 transition hover:-translate-y-0.5 hover:border-accent"
          href={`/use-cases/${useCase.slug}`}
          key={useCase.id}
        >
          <div className="flex items-start justify-between gap-3">
            <h2 className="font-semibold">{useCase.name}</h2>
            <span className="shrink-0 rounded-full bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent ring-1 ring-accent/15">
              {useCase.toolCount}
            </span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {useCase.businessFunction ? (
              <span className="status-pill">
                {useCase.businessFunction.name}
              </span>
            ) : null}
            <span className="status-pill">{formatLevel(useCase.effortLevel)} effort</span>
            <span className="status-pill">{formatLevel(useCase.riskLevel)} risk</span>
          </div>
          <p className="mt-2 text-sm leading-6 text-ink/60">
            {useCase.outcome ??
              useCase.description ??
              `Browse AI tools for ${useCase.name.toLowerCase()}.`}
          </p>
        </Link>
      ))}
    </div>
  );
}

function formatLevel(value: string) {
  return value.charAt(0) + value.slice(1).toLowerCase();
}
