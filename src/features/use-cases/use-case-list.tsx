import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { PublicUseCaseSummary } from "@/server/use-cases/queries";

type UseCaseListProps = {
  useCases: PublicUseCaseSummary[];
};

export function UseCaseList({ useCases }: UseCaseListProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {useCases.map((useCase) => (
        <Link
          className="group flex min-h-[16rem] flex-col rounded-[1.35rem] border border-line/70 bg-white/90 p-5 shadow-[0_18px_54px_rgb(13_48_92/0.07)] backdrop-blur transition hover:-translate-y-0.5 hover:border-accent hover:bg-white/95"
          href={`/use-cases/${useCase.slug}`}
          key={useCase.id}
        >
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-lg font-semibold leading-6 transition group-hover:text-accent">
              {useCase.name}
            </h2>
            <span className="shrink-0 rounded-full border border-line/60 bg-white/54 px-2.5 py-1 text-xs font-bold text-accent">
              {useCase.toolCount} tools
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
          <p className="mt-4 flex-1 text-sm leading-6 text-ink/62">
            {useCase.outcome ??
              useCase.description ??
              `Browse AI tools for ${useCase.name.toLowerCase()}.`}
          </p>
          <span className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-accent transition group-hover:translate-x-0.5">
            View workflow
            <ArrowRight aria-hidden="true" size={14} />
          </span>
        </Link>
      ))}
    </div>
  );
}

function formatLevel(value: string) {
  return value.charAt(0) + value.slice(1).toLowerCase();
}
