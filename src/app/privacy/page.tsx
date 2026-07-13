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
    title: "Who this notice covers",
    body: [
      "This notice applies to SeekSmart's website, public beta product, tool directory, AI audit workflow, dashboard, admin tools, submissions, feedback, and related product analytics.",
      "SeekSmart is responsible for the information it collects through the service. Third-party websites, AI tools, sign-in providers, and vendor websites have their own privacy practices and terms.",
      "For privacy, cookie, account, or deletion requests, contact seeksmartapp@gmail.com from the email address associated with the account when possible."
    ]
  },
  {
    title: "Information we collect",
    body: [
      "Account information: when you sign in with Google or passwordless email, SeekSmart receives the account information needed to create and secure your account, such as your email address, name when available, profile image when available, provider account identifier, and related authentication metadata.",
      "Audit information: when you run an AI audit, SeekSmart stores your structured audit answers, generated recommendation brief, readiness score, top opportunity, rules version, and timestamps so the audit can be shown in your dashboard.",
      "Submission and feedback information: when you submit a tool or send feedback, SeekSmart stores the submitted content and contact details needed for review, follow-up, quality improvement, and abuse prevention.",
      "Usage and device information: SeekSmart collects product analytics events, page paths, referral information, browser and device information, approximate technical location signals, timestamps, and diagnostic information needed to understand product usage, detect errors, protect the service, and improve the beta.",
      "Admin and operational information: admin actions, review decisions, authentication events, rate-limit signals, server logs, and security-relevant events may be kept to operate and protect the service."
    ]
  },
  {
    title: "How we use information",
    body: [
      "We use account and session information to authenticate users, protect signed-in pages, save audit history, and control admin access.",
      "We use audit data to generate deterministic recommendations, show saved audit snapshots, improve the structured taxonomy, and debug product quality issues.",
      "We use submissions and feedback to review tool listings, improve product coverage, respond when follow-up is appropriate, prevent abuse, and maintain editorial records.",
      "We use analytics and diagnostic information to understand which pages and workflows are useful, measure audit funnel completion, evaluate tool engagement, identify broken or confusing experiences, and prioritize product improvements.",
      "We use operational records to secure the service, enforce these terms, investigate abuse, comply with legal obligations, and maintain audit trails."
    ]
  },
  {
    title: "Cookies and browser storage",
    body: [
      "SeekSmart uses essential cookies for sign-in, OAuth security, session protection, admin access, and saved audit functionality. These cookies are required for the signed-in service to work.",
      "Auth.js / NextAuth sets authentication and security cookies for Google OAuth, passwordless email sign-in, session handling, callback protection, and CSRF/state checks.",
      "The temporary legacy admin password flow uses an httpOnly cookie named seeksmart_admin_session. It is sameSite=lax, secure in production, scoped to the site path, and expires after 8 hours.",
      "PostHog analytics may use first-party cookies or browser storage to recognize a browser across product events and measure usage. These analytics identifiers are used for product improvement, not advertising.",
      "SeekSmart does not currently use advertising cookies, retargeting cookies, third-party marketing cookies, heatmaps, or session replay. PostHog autocapture, automatic pageleave capture, automatic pageview capture, and session recording are disabled in the current implementation.",
      "You can limit cookies through your browser settings. Blocking essential cookies may prevent login, saved audits, dashboard access, admin access, or other signed-in features from working. Blocking analytics storage may reduce SeekSmart's ability to measure and improve product usage."
    ]
  },
  {
    title: "Analytics",
    body: [
      "SeekSmart uses PostHog product analytics. Browser events are also dispatched through a provider-neutral seeksmart:analytics event and dataLayer push so the analytics setup can remain auditable and replaceable.",
      "Current tracked events include page views, audit start, audit questions viewed, audit questions submitted, audit results viewed, outbound tool website clicks, tool likes and unlikes, public submission completion and failure, server-side tool submission creation, sign-in success by provider, command palette opens, and command palette result selections.",
      "Typical event properties include page path, audit budget range, company size, data sensitivity level, top recommended opportunity, tool slug, event source, tool id, tool name, submission category, pricing type, failure reason, sign-in provider, command trigger, selected command label, and selected command URL.",
      "SeekSmart does not intentionally send passwords, verification tokens, Google OAuth tokens, full free-text audit answers, private documents, submitter email addresses, user email addresses, user names, or payment information to PostHog analytics.",
      "PostHog may process technical metadata associated with events, such as browser, device, URL, referrer, timestamps, and IP-derived network information, depending on provider configuration and infrastructure.",
      "The current PostHog configuration is intended to use EU PostHog ingestion and UI hosts. If the analytics provider, region, or event list changes materially, this notice should be updated."
    ]
  },
  {
    title: "Sensitive data",
    body: [
      "Do not submit private customer records, credentials, financial account data, health information, trade secrets, confidential contracts, or other sensitive documents unless SeekSmart has an approved process for that data.",
      "Audit answers should describe workflows and constraints at a business level rather than exposing confidential records.",
      "SeekSmart is not designed to collect regulated health information, payment card data, financial account credentials, children's data, or highly sensitive personal data."
    ]
  },
  {
    title: "Legal bases and your choices",
    body: [
      "Depending on where you are located, SeekSmart's reasons for processing information may include providing the service you request, operating and securing the product, legitimate interests in improving a public beta, compliance with legal obligations, and consent where required.",
      "You may request access, correction, deletion, export, restriction, objection, or withdrawal of consent where those rights apply by contacting seeksmartapp@gmail.com.",
      "You may also use browser settings or extensions to limit cookies and analytics storage. Some product functionality may not work if required cookies are blocked."
    ]
  },
  {
    title: "Sharing and service providers",
    body: [
      "SeekSmart may share information with service providers that support hosting, database storage, authentication, analytics, diagnostics, email, monitoring, security, and product operations. These providers should only process information as needed to operate, secure, and improve the service.",
      "Google is used for OAuth sign-in, and Resend is used to deliver passwordless sign-in and welcome emails. Your use of those services is also subject to their own terms and privacy practices.",
      "PostHog is used for product analytics and diagnostic event capture.",
      "SeekSmart may disclose information if required to comply with law, enforce terms, protect rights or safety, investigate abuse, or complete a business transaction such as a merger, acquisition, financing, or asset transfer."
    ]
  },
  {
    title: "International transfers",
    body: [
      "SeekSmart and its service providers may process information in countries other than where you live. Privacy laws in those countries may differ from the laws in your location.",
      "Where required, SeekSmart should use appropriate safeguards for international transfers, such as provider data processing agreements, regional hosting options, and contractual protections."
    ]
  },
  {
    title: "Security",
    body: [
      "SeekSmart uses technical and organizational safeguards such as authentication, httpOnly session cookies where appropriate, input validation, rate limiting, short-lived verification links, security headers, admin access controls, and operational logs.",
      "No internet service can guarantee absolute security. You are responsible for keeping your email account, Google account when used, and devices secure and for avoiding the submission of secrets or sensitive records."
    ]
  },
  {
    title: "Retention and deletion",
    body: [
      "Saved audits remain attached to the signed-in account so users can return to their decision history. Tool submissions, feedback, analytics events, logs, and admin records may be retained for editorial review, product improvement, security, legal compliance, and operational history.",
      "Retention periods may vary by record type, operational need, legal requirement, backup cycle, and whether the record is needed to prevent abuse or preserve an audit trail.",
      "For account, deletion, or privacy requests, contact seeksmartapp@gmail.com from the email address associated with the account. Some records may be retained where required or permitted for security, compliance, dispute resolution, or backup integrity."
    ]
  },
  {
    title: "Changes to this notice",
    body: [
      "SeekSmart may update this notice as the public beta, analytics setup, service providers, data practices, or legal requirements change.",
      "Material changes should be reflected by updating the last-updated date and, where appropriate, providing additional notice."
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
            currently collects, how cookies and product analytics are used, how
            signed-in audit history is handled, and how to contact us about
            privacy requests.
          </p>
          <p className="mt-4 text-sm font-medium text-ink/55">
            Last updated: June 17, 2026
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
