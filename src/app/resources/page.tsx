import type { Metadata } from "next";
import type { Route } from "next";
import { ArrowRight } from "lucide-react";
import { resourceLinks } from "@/lib/platform-content";
import { MotionLink } from "@/components/motion/motion-link";
import { Reveal } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "AI Resources",
  description:
    "Guides, checklists, and practical starting points for business AI decisions.",
  alternates: {
    canonical: "/resources"
  },
  openGraph: {
    title: "AI Resources",
    description:
      "Guides, checklists, and practical starting points for business AI decisions.",
    url: "/resources",
    type: "website"
  }
};

export default function ResourcesPage() {
  return (
    <main className="page-shell">
      <div className="app-container">
        <Reveal className="surface-strong rounded-2xl p-6">
          <p className="eyebrow">Resources</p>
          <h1 className="mt-3 text-4xl font-semibold">
            Practical AI decision resources
          </h1>
          <p className="mt-3 max-w-2xl leading-7 text-ink/65">
            Start with checklists, playbooks, use cases, and tool guidance that
            keep the business problem ahead of the software choice.
          </p>
        </Reveal>

        <Reveal className="mt-6 grid gap-4 md:grid-cols-3">
          {resourceLinks.map((resource) => {
            const Icon = resource.icon;

            return (
              <MotionLink
                className="surface-panel group flex h-full flex-col rounded-xl p-5 transition hover:-translate-y-1 hover:border-accent"
                href={resource.href as Route}
                key={resource.title}
              >
                <Icon aria-hidden="true" className="text-accent" size={24} />
                <h2 className="mt-4 text-xl font-semibold">
                  {resource.title}
                </h2>
                <p className="mt-3 flex-1 leading-7 text-ink/65">
                  {resource.description}
                </p>
                <span className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-accent transition group-hover:translate-x-0.5">
                  Open resource
                  <ArrowRight aria-hidden="true" size={14} />
                </span>
              </MotionLink>
            );
          })}
        </Reveal>
      </div>
    </main>
  );
}
