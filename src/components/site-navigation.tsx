import type { Route } from "next";

export const navigationLinks: Array<{ href: Route; label: string }> = [
  { href: "/tools", label: "Tools" },
  { href: "/use-cases", label: "Use cases" },
  { href: "/industries", label: "Industries" },
  { href: "/playbooks", label: "Playbooks" },
  { href: "/audit", label: "AI audit" },
  { href: "/resources", label: "Resources" }
];
