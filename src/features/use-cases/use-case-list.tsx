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
          <p className="mt-2 text-sm leading-6 text-ink/60">
            {useCase.description ??
              `Browse AI tools for ${useCase.name.toLowerCase()}.`}
          </p>
        </Link>
      ))}
    </div>
  );
}
