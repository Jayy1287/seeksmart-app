import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Compass, SearchX } from "lucide-react";

export const metadata: Metadata = {
  title: "Page not found",
  robots: {
    index: false,
    follow: false
  }
};

const suggestions = [
  { href: "/tools", label: "Browse the tool directory" },
  { href: "/use-cases", label: "Explore AI use cases" },
  { href: "/industries", label: "See industry roadmaps" },
  { href: "/audit", label: "Run the AI audit" }
] as const;

export default function NotFound() {
  return (
    <main className="page-shell">
      <div className="app-container">
        <div className="empty-state mx-auto max-w-2xl">
          <span className="empty-state-icon">
            <SearchX aria-hidden="true" size={22} />
          </span>
          <p className="empty-state-eyebrow">404 - Page not found</p>
          <h1 className="empty-state-title">That page is not on the map.</h1>
          <p className="empty-state-copy">
            The link may be outdated, or the tool, use case, or page may have
            moved. Start from one of the main decision paths instead.
          </p>
          <div className="empty-state-actions">
            <Link className="primary-button" href="/">
              <Compass aria-hidden="true" size={16} />
              Back to home
            </Link>
            <Link className="secondary-button" href="/tools">
              Browse tools
              <ArrowRight aria-hidden="true" size={15} />
            </Link>
          </div>
          <ul className="mt-6 grid gap-2 border-t border-line/60 pt-5 text-sm sm:grid-cols-2">
            {suggestions.map((item) => (
              <li key={item.href}>
                <Link
                  className="editorial-link font-semibold text-accent"
                  href={item.href}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
