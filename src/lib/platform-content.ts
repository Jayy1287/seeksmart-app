import {
  BarChart3,
  Bot,
  Building2,
  ClipboardCheck,
  FileText,
  Headphones,
  LineChart,
  LucideIcon,
  Megaphone,
  MessageSquareText,
  PackageCheck,
  ShieldCheck,
  Store,
  Users,
  Workflow
} from "lucide-react";

export type PlatformItem = {
  title: string;
  slug: string;
  description: string;
  icon: LucideIcon;
};

type ResourceLink = {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
};

export type Industry = PlatformItem & {
  opportunities: string[];
  startingPoint: string;
  cautions: string;
};

export type Playbook = PlatformItem & {
  audience: string;
  steps: string[];
  outcome: string;
};

export const businessGoals: Array<{
  title: string;
  description: string;
  href: string;
  signal: string;
}> = [
  {
    title: "Save team time",
    description:
      "Find repeatable admin, research, documentation, and handoff work that can be streamlined first.",
    href: "/use-cases/workflow-automation",
    signal: "High time-return"
  },
  {
    title: "Improve customer support",
    description:
      "Map support volume, knowledge gaps, and response workflows before choosing chatbot or helpdesk tooling.",
    href: "/use-cases/customer-support",
    signal: "Operational fit"
  },
  {
    title: "Create better content",
    description:
      "Turn content goals into use cases for briefs, drafting, repurposing, SEO, and brand-safe production.",
    href: "/use-cases/seo-content",
    signal: "Growth workflow"
  },
  {
    title: "Automate operations",
    description:
      "Identify intake, routing, reporting, and workflow gaps that can be improved without adding complexity.",
    href: "/use-cases/workflow-automation",
    signal: "Process first"
  }
];

export const industries: Industry[] = [
  {
    title: "Consulting and agencies",
    slug: "consulting-agencies",
    description:
      "Client-facing teams that need faster research, proposals, reporting, and campaign production.",
    icon: Users,
    opportunities: [
      "Proposal and brief generation",
      "Client reporting summaries",
      "Campaign content production"
    ],
    startingPoint: "Start with repeatable client deliverables before automating client communication.",
    cautions: "Protect client data and keep final recommendations human-reviewed."
  },
  {
    title: "Ecommerce",
    slug: "ecommerce",
    description:
      "Online stores that need better product content, support triage, merchandising, and retention workflows.",
    icon: Store,
    opportunities: [
      "Product description generation",
      "Support ticket routing",
      "Review and feedback analysis"
    ],
    startingPoint: "Start with product and support workflows because they are easy to measure.",
    cautions: "Review generated product claims before publishing."
  },
  {
    title: "SaaS teams",
    slug: "saas-teams",
    description:
      "Software teams balancing support, sales enablement, product documentation, and engineering workflows.",
    icon: Building2,
    opportunities: [
      "Knowledge base improvement",
      "Support deflection",
      "Engineering documentation"
    ],
    startingPoint: "Start where support questions repeat and documentation is already available.",
    cautions: "Avoid exposing private customer data to tools without clear controls."
  },
  {
    title: "Local services",
    slug: "local-services",
    description:
      "Service businesses that need faster lead response, scheduling support, reviews, and marketing output.",
    icon: Headphones,
    opportunities: [
      "Lead intake response",
      "Review response drafting",
      "Local marketing content"
    ],
    startingPoint: "Start with inbound lead and review workflows because speed directly affects revenue.",
    cautions: "Keep customer-facing messages accurate, local, and brand-safe."
  },
  {
    title: "Insurance operations",
    slug: "insurance-operations",
    description:
      "Claims, brokerage, renewal, support, and compliance teams handling document-heavy regulated work.",
    icon: ShieldCheck,
    opportunities: [
      "Claims and policy document summaries",
      "Compliance evidence collection",
      "Supervised customer-service agents"
    ],
    startingPoint: "Start with reviewed internal summaries before using AI in decisions or customer messaging.",
    cautions: "Keep underwriting, claims, and regulated communication under expert review."
  },
  {
    title: "Pharmaceutical and life sciences",
    slug: "pharmaceutical-and-life-sciences",
    description:
      "Research, medical affairs, regulatory, and commercial teams synthesizing scientific and operational knowledge.",
    icon: FileText,
    opportunities: [
      "Evidence-backed literature reviews",
      "Medical and regulatory knowledge search",
      "Training and enablement content"
    ],
    startingPoint: "Start with literature synthesis and internal enablement before regulated external claims.",
    cautions: "Review scientific accuracy, approved claims, privacy, and regulatory requirements."
  },
  {
    title: "Professional services",
    slug: "professional-services",
    description:
      "Advisory, accounting, consulting, and legal-adjacent teams producing research, reports, and client deliverables.",
    icon: Users,
    opportunities: [
      "Client research and proposal drafts",
      "Diligence document analysis",
      "Reusable firm knowledge assistants"
    ],
    startingPoint: "Start with reviewed deliverables and reusable internal knowledge assets.",
    cautions: "Protect client confidentiality and keep professional judgment accountable to a reviewer."
  },
  {
    title: "Public sector",
    slug: "public-sector",
    description:
      "Government and civic teams improving public information, research, reporting, and internal knowledge access.",
    icon: Building2,
    opportunities: [
      "Constituent support knowledge",
      "Policy and research synthesis",
      "Operational reporting summaries"
    ],
    startingPoint: "Start with low-risk public information and internal research workflows.",
    cautions: "Review procurement, accessibility, privacy, public-records, and oversight requirements."
  }
];

export const playbooks: Playbook[] = [
  {
    title: "First AI workflow audit",
    slug: "first-ai-workflow-audit",
    description:
      "A practical way to find the first workflow worth improving before comparing tools.",
    icon: ClipboardCheck,
    audience: "Operators and founders",
    steps: [
      "List the workflows that repeat every week.",
      "Score each workflow by time spent, error rate, and business value.",
      "Pick one workflow where output quality can be checked by a human.",
      "Match the workflow to a use case and shortlist tools only after that."
    ],
    outcome: "A ranked shortlist of AI opportunities with one clear first move."
  },
  {
    title: "Small business support upgrade",
    slug: "small-business-support-upgrade",
    description:
      "Turn repeated customer questions into a support knowledge and response system.",
    icon: MessageSquareText,
    audience: "Small teams with recurring customer questions",
    steps: [
      "Collect the last 50-100 support questions.",
      "Group them into repeatable topics and urgency levels.",
      "Create answer drafts and escalation rules.",
      "Choose tools that support review, handoff, and measurement."
    ],
    outcome: "Faster response times without losing control of customer experience."
  },
  {
    title: "Content engine for lean teams",
    slug: "content-engine-for-lean-teams",
    description:
      "Build a repeatable content workflow for briefs, drafts, repurposing, and review.",
    icon: Megaphone,
    audience: "Founders, marketers, and agency teams",
    steps: [
      "Define the content outcomes that matter most.",
      "Build reusable briefs and brand guidance.",
      "Separate ideation, drafting, editing, and publishing.",
      "Select tools for the weakest stage instead of buying a broad suite first."
    ],
    outcome: "More consistent content output with clearer review checkpoints."
  },
  {
    title: "Contract review pilot",
    slug: "contract-review-pilot",
    description:
      "Evaluate legal and contract AI tools without skipping expert review or confidentiality controls.",
    icon: ShieldCheck,
    audience: "Legal, finance, procurement, and professional-services teams",
    steps: [
      "Choose one repeat contract type and collect reviewed examples.",
      "Write a clause checklist with must-escalate issues.",
      "Run each tool against the same sample set.",
      "Compare findings to expert review before using live agreements."
    ],
    outcome: "A defensible contract AI pilot with clear review gates and measurable accuracy."
  },
  {
    title: "Market intelligence brief",
    slug: "market-intelligence-brief",
    description:
      "Turn scattered company, competitor, and industry sources into decision-ready briefs.",
    icon: LineChart,
    audience: "Strategy, sales, product, and investing teams",
    steps: [
      "Define the decision the research should support.",
      "List approved source types and freshness requirements.",
      "Create a reusable brief format with citations.",
      "Review one brief against known facts before expanding."
    ],
    outcome: "A repeatable research workflow that improves decision confidence."
  },
  {
    title: "Enterprise knowledge assistant",
    slug: "enterprise-knowledge-assistant",
    description:
      "Create a permission-aware internal answer assistant from trusted company knowledge.",
    icon: Building2,
    audience: "Operations, enablement, support, and IT owners",
    steps: [
      "Pick one source collection and one audience.",
      "Define permission, citation, and freshness rules.",
      "Test the top 25 repeated questions.",
      "Expand only after answer quality and escalation rules are proven."
    ],
    outcome: "Faster internal answers with source traceability and governance."
  },
  {
    title: "AI service agent rollout",
    slug: "ai-service-agent-rollout",
    description:
      "Launch a supervised customer-service AI agent for approved topics and clean handoff.",
    icon: Bot,
    audience: "Support and customer-experience teams",
    steps: [
      "Select low-risk support intents with strong help content.",
      "Define fallback, escalation, and blocked-topic rules.",
      "Measure resolution, CSAT, and handoff quality.",
      "Review conversation samples before increasing coverage."
    ],
    outcome: "Customer-service automation that scales without hiding risk."
  },
  {
    title: "BI insight narrative",
    slug: "bi-insight-narrative",
    description:
      "Use AI to explain dashboards and KPIs while preserving trusted definitions.",
    icon: BarChart3,
    audience: "Data, finance, operations, and leadership teams",
    steps: [
      "Choose one recurring dashboard with trusted metrics.",
      "Document metric definitions and known caveats.",
      "Generate draft commentary from the same reporting period.",
      "Have an analyst validate the narrative before publishing."
    ],
    outcome: "Faster executive reporting with clearer metric explanations."
  }
];

export const methodologySignals = [
  {
    title: "Business problem first",
    description:
      "Recommendations begin with the workflow, pain point, and outcome instead of a popular tool name.",
    icon: Workflow
  },
  {
    title: "Explainable scoring",
    description:
      "Fit is based on transparent signals like effort, risk, cost, team size, and time to value.",
    icon: BarChart3
  },
  {
    title: "Editorial review",
    description:
      "Listings and recommendations should be reviewed, updated, and marked with clear trust signals.",
    icon: ShieldCheck
  },
  {
    title: "No model dependency",
    description:
      "The first recommendation system is rules-based and structured, not a chatbot wrapped around a model.",
    icon: Bot
  }
];

export const resourceLinks: ResourceLink[] = [
  {
    title: "AI opportunity checklist",
    description: "A lightweight checklist for deciding whether a workflow is worth automating.",
    href: "/playbooks/first-ai-workflow-audit",
    icon: PackageCheck
  },
  {
    title: "Use-case library",
    description: "Browse practical jobs to be done before looking at individual tools.",
    href: "/use-cases",
    icon: FileText
  },
  {
    title: "Opportunity maps",
    description: "Browse business problems before choosing workflows or tools.",
    href: "/opportunities",
    icon: Workflow
  },
  {
    title: "Business functions",
    description: "Explore AI opportunities by marketing, sales, support, operations, and more.",
    href: "/business-functions",
    icon: Building2
  },
  {
    title: "Tool discovery",
    description: "Use the directory once you know the business outcome you want.",
    href: "/tools",
    icon: LineChart
  }
];
