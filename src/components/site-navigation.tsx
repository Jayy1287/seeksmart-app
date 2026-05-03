"use client";

import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigationLinks: Array<{ href: Route; label: string }> = [
  { href: "/tools", label: "Tools" },
  { href: "/use-cases", label: "Use cases" },
  { href: "/industries", label: "Industries" },
  { href: "/playbooks", label: "Playbooks" },
  { href: "/audit", label: "AI audit" },
  { href: "/resources", label: "Resources" }
];

export function SiteNavigation() {
  const pathname = usePathname();

  return (
    <nav className="header-nav flex flex-wrap items-center justify-center gap-1 rounded-xl p-1.5 text-sm font-semibold md:ml-auto md:justify-start md:gap-1.5">
      {navigationLinks.map((link) => {
        const isActive =
          pathname === link.href || pathname.startsWith(`${link.href}/`);

        return (
          <Link
            aria-current={isActive ? "page" : undefined}
            className="header-nav-link"
            data-active={isActive ? "true" : undefined}
            href={link.href}
            key={link.href}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
