import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms",
  description: "SeekSmart public beta terms and usage expectations.",
  alternates: {
    canonical: "/terms"
  }
};

export default function TermsPage() {
  return (
    <main className="page-shell">
      <div className="app-container">
        <section className="surface-strong rounded-2xl p-6">
          <p className="eyebrow">Terms</p>
          <h1 className="mt-3 text-4xl font-semibold">Public beta terms</h1>
          <p className="mt-3 max-w-2xl leading-7 text-ink/65">
            SeekSmart provides decision support for evaluating AI workflows and
            tools. It does not replace professional, legal, financial, medical,
            or security advice.
          </p>
        </section>

        <section className="surface-panel mt-6 grid gap-5 rounded-xl p-6">
          {[
            {
              title: "Recommendation limits",
              body: "Recommendations are based on curated taxonomy data and deterministic rules. They should be validated against your workflow, data sensitivity, budget, and internal policies."
            },
            {
              title: "Vendor information",
              body: "Tool details may change. Verify pricing, terms, security posture, and features on the vendor website before adopting a tool."
            },
            {
              title: "Submissions",
              body: "Submitted tools may be edited, rejected, archived, or enriched with editorial notes before publication."
            },
            {
              title: "Public beta",
              body: "Features, scoring rules, pages, and data fields may change as SeekSmart learns from real users."
            }
          ].map((section) => (
            <div className="border-b border-line pb-5 last:border-b-0 last:pb-0" key={section.title}>
              <h2 className="text-xl font-semibold">{section.title}</h2>
              <p className="mt-2 leading-7 text-ink/65">{section.body}</p>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
