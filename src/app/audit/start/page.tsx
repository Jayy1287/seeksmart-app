import type { Metadata } from "next";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  ClipboardList,
  Database,
  LockKeyhole,
  Split
} from "lucide-react";
import { auth } from "@/auth";
import { AuditAnalyticsEvent } from "@/features/audit/audit-analytics";
import { MotionLink } from "@/components/motion/motion-link";
import { Reveal } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "Start AI Audit",
  description:
    "Start a rules-based AI audit for your business context.",
  alternates: {
    canonical: "/audit/start"
  }
};

const principles = [
  {
    icon: Database,
    title: "Structured intelligence",
    description:
      "Recommendations come from curated industries, functions, opportunities, use cases, and tool-fit records."
  },
  {
    icon: Split,
    title: "Deterministic scoring",
    description:
      "The same answers produce the same result because the audit uses versioned rules, not model output."
  },
  {
    icon: LockKeyhole,
    title: "Saved by default",
    description:
      "Sign in before the audit so results can be saved to your account automatically."
  }
];

export default async function AuditStartPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/audit/start");
  }

  return (
    <main className="page-shell">
      <AuditAnalyticsEvent event="audit_start_viewed" />
      <div className="app-container">
        <Reveal className="border-b border-line/50 pb-10">
          <p className="eyebrow">
            <ClipboardList aria-hidden="true" size={14} />
            Audit start
          </p>
          <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_320px] lg:items-end">
            <div>
              <h1 className="max-w-3xl text-5xl font-semibold leading-[0.98] md:text-6xl">
                Answer business questions first. Compare tools second.
              </h1>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-ink/68">
                This audit is designed to help practical teams choose one clear
                workflow to pilot before committing to a tool stack.
              </p>
            </div>
            <MotionLink className="primary-button min-h-12" href="/audit/questions">
              Continue to questions
              <ArrowRight aria-hidden="true" size={18} />
            </MotionLink>
          </div>
        </Reveal>

        <Reveal className="mt-10 grid gap-x-8 gap-y-6 md:grid-cols-3">
          {principles.map((principle) => {
            const Icon = principle.icon;

            return (
              <article className="border-t border-line/70 pt-5" key={principle.title}>
                <Icon aria-hidden="true" className="text-accent" size={22} />
                <h2 className="mt-4 font-semibold">{principle.title}</h2>
                <p className="mt-2 text-sm leading-6 text-ink/62">
                  {principle.description}
                </p>
              </article>
            );
          })}
        </Reveal>

        <Reveal className="section-band -mx-4 mt-10 px-4 py-8 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <h2 className="text-xl font-semibold">What you will need</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {[
              "Your industry and team function",
              "The business outcome you care about",
              "Budget, urgency, technical comfort, and data sensitivity"
            ].map((item) => (
              <div className="border-t border-line/70 pt-4 text-sm font-medium" key={item}>
                {item}
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </main>
  );
}
