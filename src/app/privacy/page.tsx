import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy",
  description: "SeekSmart privacy principles for the public beta.",
  alternates: {
    canonical: "/privacy"
  }
};

export default function PrivacyPage() {
  return (
    <main className="page-shell">
      <div className="app-container">
        <section className="surface-strong rounded-2xl p-6">
          <p className="eyebrow">Privacy</p>
          <h1 className="mt-3 text-4xl font-semibold">Privacy principles</h1>
          <p className="mt-3 max-w-2xl leading-7 text-ink/65">
            SeekSmart is in public beta. The product should collect only what
            is needed to operate submissions, analytics, and future saved
            reports.
          </p>
        </section>

        <section className="surface-panel mt-6 grid gap-5 rounded-xl p-6">
          {[
            {
              title: "Audit answers",
              body: "AI audits require sign-in before questions or results are shown. Audit briefs are saved to the signed-in account so users can return to their history."
            },
            {
              title: "Tool submissions",
              body: "Submitted tool data and submitter email are stored for editorial review, duplicate checks, and follow-up if needed."
            },
            {
              title: "Analytics",
              body: "The app emits provider-neutral analytics events for page views, audit flow usage, and submissions. A production analytics provider can be connected later."
            },
            {
              title: "Sensitive data",
              body: "Do not submit private customer records, credentials, financial records, health information, or confidential business documents."
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
