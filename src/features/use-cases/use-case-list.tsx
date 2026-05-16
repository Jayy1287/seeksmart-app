import { ArrowRight, Clock3, Gauge, ShieldAlert, Workflow } from "lucide-react";
import { MotionLink } from "@/components/motion/motion-link";
import type { PublicUseCaseSummary } from "@/server/use-cases/queries";

type UseCaseListProps = {
  useCases: PublicUseCaseSummary[];
};

export function UseCaseList({ useCases }: UseCaseListProps) {
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {useCases.map((useCase, index) => (
        <MotionLink
          className="decision-card group flex min-h-[18rem] flex-col p-5 pl-6"
          href={`/use-cases/${useCase.slug}`}
          key={useCase.id}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="decision-card-icon">
                <Workflow aria-hidden="true" size={18} />
              </div>
              <p className="decision-card-kicker mt-4">
                Workflow {String(index + 1).padStart(2, "0")}
              </p>
              <h2 className="decision-card-title mt-2 text-xl transition group-hover:text-accent">
                {useCase.name}
              </h2>
            </div>
            <div className="decision-card-stat shrink-0">
              <strong>{useCase.toolCount}</strong>
              <span>Tools</span>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {useCase.businessFunction ? (
              <span className="status-pill">
                {useCase.businessFunction.name}
              </span>
            ) : null}
            {useCase.timeToValue ? (
              <span className="status-pill">
                <Clock3 aria-hidden="true" size={13} />
                {useCase.timeToValue}
              </span>
            ) : null}
          </div>
          <p className="decision-card-copy mt-4 flex-1 text-sm">
            {useCase.outcome ??
              useCase.description ??
              `Browse AI tools for ${useCase.name.toLowerCase()}.`}
          </p>
          <div className="decision-card-footer">
            <div className="grid grid-cols-2 gap-2 text-xs font-bold uppercase text-ink/54">
              <span className="inline-flex items-center gap-1.5">
                <Gauge aria-hidden="true" className="text-accent" size={14} />
                {formatLevel(useCase.effortLevel)} effort
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldAlert
                  aria-hidden="true"
                  className="text-signal"
                  size={14}
                />
                {formatLevel(useCase.riskLevel)} risk
              </span>
            </div>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-accent transition group-hover:translate-x-0.5">
              View workflow
              <ArrowRight aria-hidden="true" size={14} />
            </span>
          </div>
        </MotionLink>
      ))}
    </div>
  );
}

function formatLevel(value: string) {
  return value.charAt(0) + value.slice(1).toLowerCase();
}
