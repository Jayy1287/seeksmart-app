import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { NotFoundGlyph } from "@/features/content/not-found-glyph";

export const metadata: Metadata = {
  title: "Page not found",
  robots: {
    index: false,
    follow: false
  }
};

const suggestions = [
  { href: "/tools", label: "Tools" },
  { href: "/use-cases", label: "Use cases" },
  { href: "/industries", label: "Industries" },
  { href: "/audit", label: "AI audit" }
] as const;

export default function NotFound() {
  return (
    <main className="relative overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="grid-lines absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_65%)]" />
        <div className="glow-orb left-1/2 top-24 h-[26rem] w-[26rem] -translate-x-1/2 opacity-20" />
      </div>
      <div className="app-container relative flex flex-col items-center pb-24 pt-10 text-center md:pb-32 md:pt-16">
        <p className="eyebrow">Error 404</p>
        <div className="mt-4 w-full">
          <NotFoundGlyph />
        </div>
        <Reveal delay={0.35} y={16}>
          <h1 className="h2">
            Not on the map. <span className="ghost-word">Yet.</span>
          </h1>
        </Reveal>
        <Reveal className="mt-10 w-full max-w-xl" delay={0.45} y={16}>
          <form action="/tools" className="search-field" role="search">
            <Search aria-hidden="true" size={18} />
            <label className="sr-only" htmlFor="not-found-search">
              Search tools
            </label>
            <input
              className="field pr-32"
              id="not-found-search"
              name="q"
              placeholder="Search tools"
              type="search"
            />
            <button className="btn btn-primary btn-sm absolute right-2" type="submit">
              Search
            </button>
          </form>
        </Reveal>
        <Stagger as="ul" className="mt-8 flex flex-wrap justify-center gap-2" delay={0.6}>
          <StaggerItem as="li">
            <Link className="chip" data-active="true" href="/">
              Home
            </Link>
          </StaggerItem>
          {suggestions.map((item) => (
            <StaggerItem as="li" key={item.href}>
              <Link className="chip group" href={item.href}>
                {item.label}
                <ArrowRight
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-0.5"
                  size={13}
                />
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </main>
  );
}
