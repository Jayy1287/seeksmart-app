import type { ReactNode } from "react";
import type { Route } from "next";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";

type StateAction = {
  href: Route;
  label: string;
};

type EmptyStateProps = {
  action?: StateAction;
  className?: string;
  description: string;
  eyebrow?: string;
  icon: LucideIcon;
  secondaryAction?: StateAction;
  title: string;
};

export function EmptyState({
  action,
  className = "",
  description,
  eyebrow,
  icon: Icon,
  secondaryAction,
  title
}: EmptyStateProps) {
  return (
    <section className={`empty-state ${className}`}>
      <div className="empty-state-icon">
        <Icon aria-hidden="true" size={22} />
      </div>
      {eyebrow ? <p className="empty-state-eyebrow">{eyebrow}</p> : null}
      <h2 className="empty-state-title">{title}</h2>
      <p className="empty-state-copy">{description}</p>
      {action || secondaryAction ? (
        <div className="empty-state-actions">
          {action ? (
            <Link className="primary-button" href={action.href}>
              {action.label}
            </Link>
          ) : null}
          {secondaryAction ? (
            <Link className="secondary-button" href={secondaryAction.href}>
              {secondaryAction.label}
            </Link>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

type LoadingFrameProps = {
  children: ReactNode;
  className?: string;
  label?: string;
};

export function LoadingFrame({
  children,
  className = "",
  label = "Loading"
}: LoadingFrameProps) {
  return (
    <section aria-busy="true" aria-label={label} className={className}>
      {children}
    </section>
  );
}

export function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`skeleton-block ${className}`} />;
}

export function SkeletonLine({ className = "" }: { className?: string }) {
  return <div className={`skeleton-line ${className}`} />;
}
