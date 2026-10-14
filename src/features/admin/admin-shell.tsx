import type { ReactNode } from "react";
import type { Route } from "next";
import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";

type AdminHeaderProps = {
  actions?: ReactNode;
  back?: { href: Route; label: string };
  eyebrow: string;
  lead?: ReactNode;
  title: ReactNode;
};

export function AdminHeader({ actions, back, eyebrow, lead, title }: AdminHeaderProps) {
  return (
    <header className="flex flex-col gap-6 border-b border-ink/10 pb-8 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0">
        {back ? (
          <Link
            className="group mb-8 flex w-fit items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-ink/50 transition-colors hover:text-ink"
            href={back.href}
          >
            <ArrowLeft
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:-translate-x-1"
              size={14}
            />
            {back.label}
          </Link>
        ) : null}
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="h2 mt-4 break-words">{title}</h1>
        {lead ? <p className="mt-4 max-w-2xl text-ink/60">{lead}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </header>
  );
}

export function AdminNav({ current }: { current: "queue" | "tools" | "intelligence" }) {
  const links = [
    { href: "/admin" as const, key: "queue", label: "Review queue" },
    { href: "/admin/tools" as const, key: "tools", label: "Tools" },
    { href: "/admin/intelligence" as const, key: "intelligence", label: "Intelligence" }
  ];

  return (
    <nav aria-label="Admin sections" className="flex flex-wrap gap-2">
      {links.map((link) => (
        <Link
          aria-current={link.key === current ? "page" : undefined}
          className="chip"
          data-active={link.key === current}
          href={link.href}
          key={link.key}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}

type StatusFilterProps<T extends string> = {
  active: T;
  counts: Record<T, number>;
  hrefFor: (status: T) => Route;
  statuses: T[];
};

export function StatusFilter<T extends string>({ active, counts, hrefFor, statuses }: StatusFilterProps<T>) {
  return (
    <nav aria-label="Filter by status" className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1">
      {statuses.map((status) => {
        const isActive = status === active;

        return (
          <Link
            aria-current={isActive ? "page" : undefined}
            className={`group flex min-w-[8.5rem] flex-1 flex-col gap-3 rounded-2xl px-4 py-4 transition-colors duration-300 ${
              isActive ? "bg-ink text-paper" : "bg-ink/[0.04] text-ink hover:bg-ink/[0.08]"
            }`}
            href={hrefFor(status)}
            key={status}
          >
            <span
              className={`font-mono text-[0.68rem] uppercase tracking-[0.14em] ${
                isActive ? "text-paper/60" : "text-ink/50"
              }`}
            >
              {status.replace(/_/g, " ")}
            </span>
            <span className="stat-number text-[2.2rem]">{counts[status]}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function AdminSearch({
  action,
  label,
  query,
  status
}: {
  action: Route;
  label: string;
  query?: string;
  status: string;
}) {
  return (
    <form action={action} className="search-field" role="search">
      <input name="status" type="hidden" value={status} />
      <Search aria-hidden="true" size={18} />
      <label className="sr-only" htmlFor="admin-search">
        {label}
      </label>
      <input
        className="field pr-28"
        defaultValue={query ?? ""}
        id="admin-search"
        name="q"
        placeholder={label}
        type="search"
      />
      <button className="btn btn-primary btn-sm absolute right-2" type="submit">
        Search
      </button>
    </form>
  );
}

export function AdminEmpty({ body, title }: { body: string; title: string }) {
  return (
    <div className="border-b border-ink/[0.12] py-16 text-center">
      <p className="font-display text-2xl font-bold tracking-[-0.03em]">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-ink/55">{body}</p>
    </div>
  );
}
