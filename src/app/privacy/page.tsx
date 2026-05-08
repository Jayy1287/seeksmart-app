import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy",
  description: "SeekSmart privacy and cookie notice for the public beta.",
  alternates: {
    canonical: "/privacy"
  }
};

const privacySections = [
  {
    title: "Information we collect",
    body: [
      "When you sign in with Google, SeekSmart receives the account information needed to create and secure your account, such as your name, email address, profile image when provided, and Google account identifier.",
      "When you run an AI audit, SeekSmart stores your audit answers, generated recommendation brief, readiness score, top opportunity, and timestamps so the audit can be shown in your dashboard.",
      "When you submit a tool or send feedback, SeekSmart stores the submitted content and contact details needed for review, follow-up, and abuse prevention."
    ]
  },
  {
    title: "How we use information",
    body: [
      "We use account and session information to authenticate users, protect signed-in pages, save audit history, and control admin access.",
      "We use audit data to generate deterministic recommendations, show saved audit snapshots, improve the structured taxonomy, and debug product quality issues.",
      "We use submissions and feedback to review tool listings, improve product coverage, and respond when follow-up is appropriate."
    ]
  },
  {
    title: "Cookie notice",
    body: [
      "SeekSmart uses essential cookies for sign-in, OAuth security, session protection, admin access, and saved audit functionality. These cookies are required for the signed-in service to work.",
      "Auth.js / NextAuth sets authentication and security cookies for Google sign-in, session handling, callback protection, and CSRF/state checks.",
      "The temporary legacy admin password flow uses an httpOnly cookie named seeksmart_admin_session. It is sameSite=lax, secure in production, scoped to the site path, and expires after 8 hours.",
      "SeekSmart does not currently use advertising, retargeting, heatmap, session replay, or third-party marketing cookies. If non-essential analytics or marketing cookies are added later, the notice and consent controls should be updated before those cookies are used."
    ]
  },
  {
    title: "Analytics",
    body: [
      "The app currently emits provider-neutral browser events for page views, audit flow usage, and submissions. These events are designed so a production analytics provider can be connected later.",
      "No advertising or cross-site tracking cookies are currently described as part of the production behavior."
    ]
  },
  {
    title: "Sensitive data",
    body: [
      "Do not submit private customer records, credentials, financial account data, health information, trade secrets, confidential contracts, or other sensitive documents unless SeekSmart has an approved process for that data.",
      "Audit answers should describe workflows and constraints at a business level rather than exposing confidential records."
    ]
  },
  {
    title: "Sharing and service providers",
    body: [
      "SeekSmart may use service providers for hosting, database storage, authentication, email, monitoring, and product operations. These providers should only process information as needed to operate the service.",
      "Google is used for OAuth sign-in. Your use of Google sign-in is also subject to Google's own account and privacy terms."
    ]
  },
  {
    title: "Retention and deletion",
    body: [
      "Saved audits remain attached to the signed-in account so users can return to their decision history. Tool submissions, feedback, and admin records may be retained for editorial review, security, and operational history.",
      "For account, deletion, or privacy requests, contact seeksmartapp@gmail.com from the email address associated with the account."
    ]
  }
];

export default function PrivacyPage() {
  return (
    <main className="page-shell">
      <div className="app-container">
        <section className="surface-strong rounded-2xl p-6">
          <p className="eyebrow">Privacy</p>
          <h1 className="mt-3 text-4xl font-semibold">Privacy and cookies</h1>
          <p className="mt-3 max-w-2xl leading-7 text-ink/65">
            SeekSmart is in public beta. This notice explains what the app
            currently collects, how essential cookies are used, and how signed-in
            audit history is handled.
          </p>
          <p className="mt-4 text-sm font-medium text-ink/55">
            Last updated: May 2026
          </p>
        </section>

        <section className="surface-panel mt-6 grid gap-6 rounded-xl p-6">
          {privacySections.map((section) => (
            <div
              className="border-b border-line pb-6 last:border-b-0 last:pb-0"
              key={section.title}
            >
              <h2 className="text-xl font-semibold">{section.title}</h2>
              <div className="mt-3 grid gap-3 leading-7 text-ink/65">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
