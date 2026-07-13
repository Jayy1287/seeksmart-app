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
    title: "Agreement to these terms",
    body: [
      "By accessing or using SeekSmart, you agree to these public beta terms and to the Privacy and Cookies notice.",
      "If you use SeekSmart for a company or other organization, you represent that you have authority to use the service for that organization and to submit information on its behalf.",
      "If you do not agree to these terms, do not use the service."
    ]
  },
  {
    title: "Public beta",
    body: [
      "SeekSmart is a public beta product. Features, scoring rules, pages, datasets, admin tools, and saved-audit behavior may change as the product improves.",
      "The service may be unavailable, incomplete, inaccurate, delayed, suspended, or modified while beta work is in progress.",
      "SeekSmart may add, remove, archive, edit, or reorganize content, features, accounts, submissions, analytics events, or product workflows at any time during the beta."
    ]
  },
  {
    title: "Decision support only",
    body: [
      "SeekSmart provides decision support for evaluating AI workflows and tools. It does not replace professional, legal, financial, medical, security, procurement, or compliance advice.",
      "Recommendations, scores, tool shortlists, playbooks, articles, and audit results are informational planning aids only. They are not guarantees of cost savings, revenue, compliance, performance, security, procurement approval, or business outcome.",
      "You are responsible for validating recommendations against your workflow, policies, budget, risk tolerance, data sensitivity, security requirements, vendor contracts, and applicable obligations before adopting any tool."
    ]
  },
  {
    title: "Accounts, sign-in, and cookies",
    body: [
      "Running an AI audit requires a signed-in account so audit briefs can be saved to a specific workspace and reopened from the dashboard.",
      "Essential cookies are required for sign-in, OAuth security, session handling, admin access, and saved audit functionality. If these cookies are blocked, login, audit history, dashboard access, or admin features may not work.",
      "The temporary legacy admin password fallback may set the seeksmart_admin_session cookie for admin access. This fallback can be removed after Google admin access is fully trusted.",
      "You are responsible for keeping your email account, Google account when used, devices, browser, and network secure and for promptly reporting suspected unauthorized access."
    ]
  },
  {
    title: "Saved audits",
    body: [
      "Signed-in audit results are stored as structured snapshots. A saved snapshot may remain viewable even if future scoring logic, tool data, or taxonomy entries change.",
      "Audit results are generated from the information you provide and the current SeekSmart rules and dataset. They should be treated as planning guidance, not as a guarantee of business outcome.",
      "Do not include secrets, credentials, regulated data, confidential customer records, private documents, or other sensitive records in audit answers unless SeekSmart has expressly approved a process for that data."
    ]
  },
  {
    title: "User responsibilities",
    body: [
      "Do not submit credentials, confidential customer records, regulated health or financial information, confidential contracts, trade secrets, or other sensitive records unless SeekSmart has an approved process for that data.",
      "Do not misuse the service, attempt to bypass authentication or admin controls, scrape private areas, probe or attack security controls, interfere with availability, overload the service, reverse engineer restricted systems, or submit unlawful, misleading, infringing, malicious, or harmful content.",
      "Do not use SeekSmart to make automated decisions with legal, employment, credit, housing, insurance, healthcare, or similarly significant effects on people.",
      "You are responsible for ensuring that your use of AI tools discovered through SeekSmart complies with your contracts, policies, security requirements, privacy obligations, industry rules, and applicable laws."
    ]
  },
  {
    title: "Vendor information",
    body: [
      "Tool names, descriptions, pricing type, free-plan status, website URLs, logos, use cases, alternatives, features, integrations, and availability may change.",
      "Verify pricing, terms, security posture, privacy practices, data handling, regulatory fit, integrations, export rights, support obligations, and features directly with the vendor before adopting a tool.",
      "Logos and favicon-style marks are used to help users identify products. Product names and marks belong to their respective owners. SeekSmart is not affiliated with or endorsed by those owners unless expressly stated."
    ]
  },
  {
    title: "Submissions and feedback",
    body: [
      "Submitted tools, feedback, and related contact details may be reviewed, edited, rejected, archived, deduplicated, enriched, published, unpublished, or used to improve the directory, taxonomy, recommendation system, support processes, and product quality.",
      "Do not submit content that you do not have permission to share.",
      "By submitting content, you give SeekSmart a non-exclusive, worldwide, royalty-free license to host, copy, edit, display, publish, analyze, and use that content for operating, improving, promoting, and securing the service.",
      "SeekSmart does not guarantee that a submitted tool will be listed, ranked, recommended, verified, retained, or displayed in any particular way."
    ]
  },
  {
    title: "Analytics and privacy",
    body: [
      "SeekSmart uses product analytics and diagnostic events to understand usage, improve the public beta, detect errors, and prioritize roadmap decisions.",
      "Use of SeekSmart is also subject to the Privacy and Cookies notice, which describes account data, audit data, cookies, analytics events, service providers, retention, and privacy request options.",
      "Do not attempt to use the service to collect personal data from other users, identify anonymous visitors, or bypass privacy or security controls."
    ]
  },
  {
    title: "Third-party services and links",
    body: [
      "SeekSmart may link to third-party AI tools, vendor websites, sign-in providers, analytics providers, hosting providers, and other services.",
      "Third-party services are controlled by their own operators and may have separate terms, privacy notices, pricing, security practices, data processing practices, and availability.",
      "SeekSmart is not responsible for third-party websites, products, contracts, data processing, security incidents, support, billing, or changes."
    ]
  },
  {
    title: "Intellectual property",
    body: [
      "SeekSmart's design, copy, scoring approach, taxonomies, code, pages, layout, and original content are owned by SeekSmart or its licensors except where third-party materials are identified.",
      "You may use the public beta for ordinary evaluation and planning. You may not copy, resell, frame, mirror, or commercially exploit substantial parts of the service without permission.",
      "Vendor names, logos, marks, and third-party content remain the property of their respective owners."
    ]
  },
  {
    title: "Availability, suspension, and termination",
    body: [
      "SeekSmart may limit, suspend, or terminate access, remove content, reject submissions, disable accounts, or block traffic if needed to protect the service, users, data, infrastructure, or legal interests.",
      "The service may experience downtime, maintenance, bugs, data errors, provider outages, or feature changes.",
      "You may stop using the service at any time and may request account or data deletion as described in the Privacy and Cookies notice."
    ]
  },
  {
    title: "Disclaimers",
    body: [
      "SeekSmart is provided on an as-is and as-available basis during the public beta.",
      "To the maximum extent allowed by law, SeekSmart disclaims warranties of accuracy, availability, merchantability, fitness for a particular purpose, non-infringement, error-free operation, security, and uninterrupted access.",
      "SeekSmart does not warrant that recommendations, tool listings, audit results, analytics, or vendor information will be complete, current, accurate, secure, or suitable for your specific use."
    ]
  },
  {
    title: "Limitation of liability",
    body: [
      "To the maximum extent allowed by law, SeekSmart will not be liable for indirect, incidental, special, consequential, exemplary, or punitive damages; lost profits; lost revenue; lost savings; lost data; business interruption; procurement decisions; vendor failures; or reliance on recommendations.",
      "To the maximum extent allowed by law, SeekSmart's total liability for any claim related to the service will be limited to the greater of the amount you paid to SeekSmart for the service in the three months before the claim or 100 US dollars.",
      "Some jurisdictions do not allow certain limitations, so parts of this section may not apply where prohibited by law."
    ]
  },
  {
    title: "Indemnity",
    body: [
      "To the extent allowed by law, you agree to defend, indemnify, and hold SeekSmart harmless from claims, losses, liabilities, damages, costs, and expenses arising from your misuse of the service, your submissions, your violation of these terms, your violation of law, or your infringement of third-party rights."
    ]
  },
  {
    title: "Changes to terms",
    body: [
      "SeekSmart may update these terms as the public beta, features, data practices, provider stack, or legal requirements change.",
      "The last-updated date will be changed when these terms are updated. Continued use of the service after changes means you accept the updated terms."
    ]
  },
  {
    title: "Contact",
    body: [
      "For questions about these terms, privacy, cookies, analytics, account access, or deletion requests, contact seeksmartapp@gmail.com."
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
            information, product analytics, submissions, and recommendation
            limits.
          </p>
          <p className="mt-4 text-sm font-medium text-ink/55">
            Last updated: June 17, 2026
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
