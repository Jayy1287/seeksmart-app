import type { Route } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Magnetic } from "@/components/motion/magnetic";

const groups: Array<{ heading: string; links: Array<{ href: Route; label: string }> }> = [
  {
    heading: "Explore",
    links: [
      { href: "/tools", label: "Tools" },
      { href: "/use-cases", label: "Use cases" },
      { href: "/industries", label: "Industries" },
      { href: "/categories", label: "Categories" },
      { href: "/playbooks", label: "Playbooks" }
    ]
  },
  {
    heading: "Decide",
    links: [
      { href: "/audit", label: "AI audit" },
      { href: "/opportunities", label: "Opportunities" },
      { href: "/methodology", label: "Methodology" },
      { href: "/resources", label: "Resources" },
      { href: "/articles", label: "Articles" }
    ]
  },
  {
    heading: "Company",
    links: [
      { href: "/submit", label: "Submit a tool" },
      { href: "/feedback", label: "Feedback" },
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" }
    ]
  }
];

export function SiteFooter() {
  return (
    <footer className="night mt-auto rounded-t-[2rem] md:rounded-t-[3rem]">
      <div aria-hidden="true" className="glow-orb -top-40 left-1/2 h-80 w-[40rem] -translate-x-1/2 opacity-40" />
      <div className="app-container relative pt-16 md:pt-24">
        <div className="flex flex-col gap-8 border-b border-white/10 pb-14 md:flex-row md:items-end md:justify-between md:pb-20">
          <h2 className="h2 max-w-xl text-white">
            Find where AI pays back <span className="text-white/35">before you buy.</span>
          </h2>
          <Magnetic>
            <Link className="btn btn-signal btn-lg" href="/audit/questions">
              Start the free audit
              <ArrowRight aria-hidden="true" size={18} />
            </Link>
          </Magnetic>
        </div>

        <div className="grid gap-10 py-14 sm:grid-cols-3 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <p className="hidden max-w-xs text-sm leading-6 text-white/50 md:block">
            Rules-based audits, researched tools, and pilot plans for small businesses.
          </p>
          {groups.map((group) => (
            <nav aria-label={group.heading} className="flex flex-col gap-3" key={group.heading}>
              <span className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-white/40">
                {group.heading}
              </span>
              {group.links.map((link) => (
                <Link
                  className="w-fit text-[0.95rem] text-white/75 transition-colors hover:text-white"
                  href={link.href}
                  key={link.href}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          ))}
        </div>
      </div>

      <div aria-hidden="true" className="relative select-none overflow-hidden">
        <p className="translate-y-[18%] whitespace-nowrap text-center font-display text-[23vw] font-bold leading-[0.8] tracking-[-0.06em] text-white/[0.06]">
          SeekSmart
        </p>
      </div>
      <div className="app-container relative flex flex-col gap-2 border-t border-white/10 py-6 text-xs text-white/40 sm:flex-row sm:justify-between">
        <span>&copy; 2026 SeekSmart</span>
        <span>Clear decisions before new software.</span>
      </div>
    </footer>
  );
}
