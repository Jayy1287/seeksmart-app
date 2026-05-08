import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms",
  description: "SeekSmart public beta terms and usage expectations.",
  alternates: {
    canonical: "/terms"
  }
};

const termsSections = [
  {
    title: "Public beta",
    body: [
      "SeekSmart is a public beta product. Features, scoring rules, pages, datasets, admin tools, and saved-audit behavior may change as the product improves.",
      "The service may be unavailable, incomplete, or modified while beta work is in progress."
    ]
  },
  {
    title: "Decision support only",
    body: [
      "SeekSmart provides decision support for evaluating AI workflows and tools. It does not replace professional, legal, financial, medical, security, procurement, or compliance advice.",
      "You are responsible for validating recommendations against your workflow, policies, budget, risk tolerance, data sensitivity, and applicable obligations before adopting any tool."
    ]
  },
  {
    title: "Accounts, sign-in, and cookies",
    body: [
      "Running an AI audit requires Google sign-in so audit briefs can be saved to a specific account and reopened from the dashboard.",
      "Essential cookies are required for sign-in, OAuth security, session handling, admin access, and saved audit functionality. If these cookies are blocked, login, audit history, dashboard access, or admin features may not work.",
      "The temporary legacy admin password fallback may set the seeksmart_admin_session cookie for admin access. This fallback can be removed after Google admin access is fully trusted."
    ]
  },
  {
    title: "Saved audits",
    body: [
      "Signed-in audit results are stored as structured snapshots. A saved snapshot may remain viewable even if future scoring logic, tool data, or taxonomy entries change.",
      "Audit results are generated from the information you provide and the current SeekSmart rules and dataset. They should be treated as planning guidance, not as a guarantee of business outcome."
    ]
  },
  {
    title: "User responsibilities",
    body: [
      "Do not submit credentials, confidential customer records, regulated health or financial information, confidential contracts, trade secrets, or other sensitive records unless SeekSmart has an approved process for that data.",
      "Do not misuse the service, attempt to bypass authentication or admin controls, scrape private areas, interfere with availability, or submit unlawful, misleading, or harmful content."
    ]
  },
  {
    title: "Vendor information",
    body: [
      "Tool names, descriptions, pricing type, free-plan status, website URLs, logos, use cases, and alternatives may change. Verify pricing, terms, security posture, data handling, and features on the vendor website before adopting a tool.",
      "Logos and favicon-style marks are used to help users identify products. Product names and marks belong to their respective owners."
    ]
  },
  {
    title: "Submissions and feedback",
    body: [
      "Submitted tools, feedback, and related contact details may be reviewed, edited, rejected, archived, deduplicated, enriched, or used to improve the directory and recommendation system.",
      "Do not submit content that you do not have permission to share."
    ]
  },
  {
    title: "Contact",
    body: [
      "For questions about these terms, privacy, cookies, account access, or deletion requests, contact seeksmartapp@gmail.com."
    ]
  }
];

export default function TermsPage() {
  return (
    <main className="page-shell">
      <div className="app-container">
        <section className="surface-strong rounded-2xl p-6">
          <p className="eyebrow">Terms</p>
          <h1 className="mt-3 text-4xl font-semibold">Public beta terms</h1>
          <p className="mt-3 max-w-2xl leading-7 text-ink/65">
            These terms describe how SeekSmart should be used during the public
            beta, including signed-in audit history, essential cookies, tool
            information, and recommendation limits.
          </p>
          <p className="mt-4 text-sm font-medium text-ink/55">
            Last updated: May 2026
          </p>
        </section>

        <section className="surface-panel mt-6 grid gap-6 rounded-xl p-6">
          {termsSections.map((section) => (
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
