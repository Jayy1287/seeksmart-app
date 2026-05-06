import {
  EffortLevel,
  PrismaClient,
  PricingType,
  PublishStatus,
  RiskLevel
} from "@prisma/client";
import { slugify } from "../src/lib/slug";

const prisma = new PrismaClient();

const categories = [
  {
    name: "Writing",
    description:
      "AI tools for drafting, editing, rewriting, and content workflows."
  },
  {
    name: "Productivity",
    description:
      "AI tools for notes, task management, calendars, and work automation."
  },
  {
    name: "Developer tools",
    description:
      "AI tools for coding, debugging, documentation, and engineering work."
  },
  {
    name: "Image generation",
    description:
      "AI tools for generating, editing, and improving visual assets."
  },
  {
    name: "Video",
    description:
      "AI tools for video creation, editing, avatars, clips, and production."
  },
  {
    name: "Audio",
    description:
      "AI tools for voice generation, transcription, dubbing, and audio editing."
  },
  {
    name: "Marketing",
    description: "AI tools for campaigns, SEO, analytics, and growth work."
  },
  {
    name: "Research",
    description:
      "AI tools for web research, citations, analysis, and knowledge discovery."
  },
  {
    name: "Design",
    description:
      "AI tools for brand assets, presentations, UI mockups, and creative work."
  },
  {
    name: "Meetings",
    description:
      "AI tools for meeting notes, summaries, transcription, and follow-ups."
  },
  {
    name: "Automation",
    description:
      "AI tools for workflows, integrations, agents, and business operations."
  },
  {
    name: "Presentations",
    description:
      "AI tools for decks, documents, storytelling, and visual communication."
  },
  {
    name: "Customer Support",
    description:
      "AI tools for help desks, support agents, ticket triage, and customer self-service."
  },
  {
    name: "Sales",
    description:
      "AI tools for prospecting, enrichment, outbound, CRM workflows, and revenue teams."
  },
  {
    name: "Knowledge Management",
    description:
      "AI tools for internal search, source-grounded answers, documentation, and organizational memory."
  },
  {
    name: "Data Analysis",
    description:
      "AI tools for spreadsheets, dashboards, reports, extraction, and business analysis."
  },
  {
    name: "App Builders",
    description:
      "AI tools for prototyping, generating, and shipping apps or user interfaces."
  }
];

const useCases = [
  "General assistant",
  "Web research",
  "Writing assistant",
  "Copywriting",
  "SEO content",
  "Code generation",
  "Code review",
  "Image creation",
  "Video generation",
  "Audio transcription",
  "Voice generation",
  "Meeting summaries",
  "Presentation creation",
  "Workflow automation",
  "Design assets",
  "Knowledge management",
  "Sales outreach",
  "Customer support",
  "Help desk automation",
  "Lead enrichment",
  "Sales email personalization",
  "CRM update automation",
  "Internal knowledge search",
  "Data analysis",
  "Spreadsheet automation",
  "Document extraction",
  "Customer feedback analysis",
  "Training content",
  "Recruiting support",
  "Social media content",
  "App prototyping"
];

const features = [
  "Chat interface",
  "Web browsing",
  "Citations",
  "Document upload",
  "Templates",
  "Team workspace",
  "Browser extension",
  "API access",
  "Code completion",
  "Repo awareness",
  "Image generation",
  "Video editing",
  "Text to speech",
  "Transcription",
  "Meeting notes",
  "Workflow builder",
  "SEO scoring",
  "Brand kit",
  "Export options",
  "Integrations",
  "Data enrichment",
  "Lead scoring",
  "CRM sync",
  "AI agents",
  "Internal search",
  "Source grounding",
  "Spreadsheet analysis",
  "Document extraction",
  "App generation",
  "UI generation",
  "No-code builder",
  "Human handoff",
  "Ticket routing"
];

const businessFunctions = [
  {
    name: "Marketing",
    description:
      "Campaigns, content, SEO, brand, local marketing, and demand generation."
  },
  {
    name: "Sales",
    description:
      "Outreach, qualification, proposals, CRM hygiene, and follow-up workflows."
  },
  {
    name: "Customer Support",
    description:
      "Ticket response, help content, routing, escalation, and service quality."
  },
  {
    name: "Operations",
    description:
      "Internal processes, reporting, handoffs, intake, and workflow automation."
  },
  {
    name: "Finance",
    description:
      "Reporting, invoice handling, categorization, document review, and analysis."
  },
  {
    name: "Human Resources",
    description:
      "Recruiting, onboarding, policies, employee support, and training workflows."
  },
  {
    name: "Product and Engineering",
    description:
      "Product research, documentation, coding, QA, release work, and technical delivery."
  },
  {
    name: "Knowledge Management",
    description:
      "Meeting notes, internal answers, documentation, training, and organizational memory."
  },
  {
    name: "Data and Analytics",
    description:
      "Spreadsheets, dashboards, reporting, extraction, insight summaries, and data quality workflows."
  },
  {
    name: "Legal and Compliance",
    description:
      "Policy review, contract support, audit preparation, regulated content, and risk controls."
  }
];

const useCaseMetadata: Record<
  string,
  {
    businessFunction: string;
    outcome: string;
    painPoints: string[];
    requiredInputs: string[];
    successMetrics: string[];
    implementationSteps: string[];
    effortLevel: EffortLevel;
    riskLevel: RiskLevel;
    timeToValue: string;
  }
> = {
  "General assistant": {
    businessFunction: "Knowledge Management",
    outcome: "Faster drafting, analysis, and everyday decision support.",
    painPoints: ["Scattered work", "Slow first drafts", "Manual research"],
    requiredInputs: ["Prompt guidelines", "Review standards"],
    successMetrics: ["Time saved", "Draft quality", "Review time"],
    implementationSteps: [
      "Choose approved use cases",
      "Create prompt templates",
      "Set human review rules"
    ],
    effortLevel: EffortLevel.LOW,
    riskLevel: RiskLevel.MEDIUM,
    timeToValue: "1-2 weeks"
  },
  "Web research": {
    businessFunction: "Knowledge Management",
    outcome: "Faster source gathering and market understanding.",
    painPoints: ["Slow research", "Unclear source quality"],
    requiredInputs: ["Research question", "Source criteria"],
    successMetrics: ["Research time", "Source quality", "Decision speed"],
    implementationSteps: [
      "Define source standards",
      "Compare answer quality",
      "Document citations"
    ],
    effortLevel: EffortLevel.LOW,
    riskLevel: RiskLevel.MEDIUM,
    timeToValue: "1 week"
  },
  "Writing assistant": {
    businessFunction: "Marketing",
    outcome: "Clearer drafts, rewrites, and everyday business writing.",
    painPoints: ["Blank-page friction", "Inconsistent tone"],
    requiredInputs: ["Brand voice", "Example content"],
    successMetrics: ["Draft turnaround", "Edit cycles", "Consistency"],
    implementationSteps: [
      "Create writing briefs",
      "Define review rubric",
      "Track edit time"
    ],
    effortLevel: EffortLevel.LOW,
    riskLevel: RiskLevel.LOW,
    timeToValue: "1 week"
  },
  Copywriting: {
    businessFunction: "Marketing",
    outcome: "More consistent conversion copy across channels.",
    painPoints: ["Slow campaign copy", "Inconsistent messaging"],
    requiredInputs: ["Audience", "Offer", "Brand guidance"],
    successMetrics: ["Copy output", "Campaign velocity", "Conversion lift"],
    implementationSteps: [
      "Create campaign templates",
      "Generate variants",
      "Review against brand rules"
    ],
    effortLevel: EffortLevel.LOW,
    riskLevel: RiskLevel.MEDIUM,
    timeToValue: "1-2 weeks"
  },
  "SEO content": {
    businessFunction: "Marketing",
    outcome: "Repeatable search content briefs and drafts.",
    painPoints: ["Slow briefs", "Thin content planning", "Inconsistent SEO structure"],
    requiredInputs: ["Keyword theme", "Audience", "Source material"],
    successMetrics: ["Brief time", "Content shipped", "Organic traffic"],
    implementationSteps: [
      "Define content template",
      "Create briefs",
      "Review claims and sources"
    ],
    effortLevel: EffortLevel.MEDIUM,
    riskLevel: RiskLevel.MEDIUM,
    timeToValue: "2-4 weeks"
  },
  "Code generation": {
    businessFunction: "Product and Engineering",
    outcome: "Faster implementation support and code scaffolding.",
    painPoints: ["Slow boilerplate", "Context switching"],
    requiredInputs: ["Repo context", "Coding standards", "Review process"],
    successMetrics: ["Cycle time", "Review defects", "Developer throughput"],
    implementationSteps: [
      "Define accepted tasks",
      "Pilot on low-risk changes",
      "Review generated code"
    ],
    effortLevel: EffortLevel.MEDIUM,
    riskLevel: RiskLevel.MEDIUM,
    timeToValue: "1-3 weeks"
  },
  "Code review": {
    businessFunction: "Product and Engineering",
    outcome: "Better review preparation and test ideas.",
    painPoints: ["Slow reviews", "Missed edge cases"],
    requiredInputs: ["Diffs", "Review checklist", "Security standards"],
    successMetrics: ["Review time", "Defect discovery", "Test coverage"],
    implementationSteps: [
      "Create review prompts",
      "Compare against human review",
      "Document limits"
    ],
    effortLevel: EffortLevel.MEDIUM,
    riskLevel: RiskLevel.MEDIUM,
    timeToValue: "2-4 weeks"
  },
  "Image creation": {
    businessFunction: "Marketing",
    outcome: "Faster visual exploration and campaign assets.",
    painPoints: ["Slow design iteration", "Asset bottlenecks"],
    requiredInputs: ["Brand style", "Image brief"],
    successMetrics: ["Asset turnaround", "Approval rate"],
    implementationSteps: [
      "Define image guidelines",
      "Generate concepts",
      "Review brand fit"
    ],
    effortLevel: EffortLevel.LOW,
    riskLevel: RiskLevel.MEDIUM,
    timeToValue: "1-2 weeks"
  },
  "Video generation": {
    businessFunction: "Marketing",
    outcome: "Faster short-form and explainer video production.",
    painPoints: ["High video production effort", "Limited content reuse"],
    requiredInputs: ["Script", "Brand guidance", "Review workflow"],
    successMetrics: ["Videos shipped", "Production time"],
    implementationSteps: [
      "Start with internal videos",
      "Create review checklist",
      "Publish controlled pilots"
    ],
    effortLevel: EffortLevel.MEDIUM,
    riskLevel: RiskLevel.MEDIUM,
    timeToValue: "2-4 weeks"
  },
  "Audio transcription": {
    businessFunction: "Knowledge Management",
    outcome: "Searchable calls, interviews, and source material.",
    painPoints: ["Lost conversation detail", "Manual note taking"],
    requiredInputs: ["Recording consent", "Storage policy"],
    successMetrics: ["Transcription coverage", "Note time saved"],
    implementationSteps: [
      "Define recording policy",
      "Pilot on internal calls",
      "Review transcript quality"
    ],
    effortLevel: EffortLevel.LOW,
    riskLevel: RiskLevel.MEDIUM,
    timeToValue: "1 week"
  },
  "Voice generation": {
    businessFunction: "Marketing",
    outcome: "Faster narration, demos, and audio assets.",
    painPoints: ["Slow voice production", "Limited localization"],
    requiredInputs: ["Script", "Voice policy", "Usage rights"],
    successMetrics: ["Audio output", "Production time"],
    implementationSteps: [
      "Approve voice style",
      "Generate drafts",
      "Review usage rights"
    ],
    effortLevel: EffortLevel.LOW,
    riskLevel: RiskLevel.MEDIUM,
    timeToValue: "1-2 weeks"
  },
  "Meeting summaries": {
    businessFunction: "Knowledge Management",
    outcome: "Cleaner notes, decisions, and action items.",
    painPoints: ["Missed follow-ups", "Manual notes"],
    requiredInputs: ["Meeting recordings or notes", "Action-item format"],
    successMetrics: ["Follow-up time", "Missed actions", "Note quality"],
    implementationSteps: [
      "Define summary format",
      "Pilot on recurring meetings",
      "Review action accuracy"
    ],
    effortLevel: EffortLevel.LOW,
    riskLevel: RiskLevel.LOW,
    timeToValue: "1 week"
  },
  "Presentation creation": {
    businessFunction: "Marketing",
    outcome: "Faster decks, proposals, and business storytelling.",
    painPoints: ["Slow deck creation", "Inconsistent structure"],
    requiredInputs: ["Narrative outline", "Brand kit"],
    successMetrics: ["Deck turnaround", "Review cycles"],
    implementationSteps: [
      "Create deck templates",
      "Draft from outline",
      "Review brand and facts"
    ],
    effortLevel: EffortLevel.LOW,
    riskLevel: RiskLevel.LOW,
    timeToValue: "1 week"
  },
  "Workflow automation": {
    businessFunction: "Operations",
    outcome: "Less repetitive manual routing and handoff work.",
    painPoints: ["Manual handoffs", "Copy-paste work", "Status gaps"],
    requiredInputs: ["Workflow map", "Trigger events", "Approval rules"],
    successMetrics: ["Manual steps removed", "Error rate", "Cycle time"],
    implementationSteps: [
      "Map the workflow",
      "Automate one low-risk step",
      "Measure time saved"
    ],
    effortLevel: EffortLevel.MEDIUM,
    riskLevel: RiskLevel.MEDIUM,
    timeToValue: "2-4 weeks"
  },
  "Design assets": {
    businessFunction: "Marketing",
    outcome: "Faster brand-safe visuals and creative drafts.",
    painPoints: ["Design bottlenecks", "Inconsistent assets"],
    requiredInputs: ["Brand kit", "Asset brief"],
    successMetrics: ["Asset volume", "Approval rate"],
    implementationSteps: [
      "Document brand rules",
      "Generate draft assets",
      "Review before publishing"
    ],
    effortLevel: EffortLevel.LOW,
    riskLevel: RiskLevel.MEDIUM,
    timeToValue: "1-2 weeks"
  },
  "Knowledge management": {
    businessFunction: "Knowledge Management",
    outcome: "Faster internal answers and better documentation reuse.",
    painPoints: ["Scattered docs", "Repeated questions", "Slow onboarding"],
    requiredInputs: ["Document sources", "Access policy"],
    successMetrics: ["Question resolution time", "Doc usage", "Onboarding speed"],
    implementationSteps: [
      "Choose source documents",
      "Set permissions",
      "Pilot common questions"
    ],
    effortLevel: EffortLevel.MEDIUM,
    riskLevel: RiskLevel.MEDIUM,
    timeToValue: "3-6 weeks"
  },
  "Sales outreach": {
    businessFunction: "Sales",
    outcome: "Faster lead follow-up and more consistent outreach.",
    painPoints: ["Slow follow-up", "Generic messages", "CRM friction"],
    requiredInputs: ["Ideal customer profile", "Offer", "CRM fields"],
    successMetrics: ["Response time", "Reply rate", "Meetings booked"],
    implementationSteps: [
      "Define outreach templates",
      "Personalize with review",
      "Track replies"
    ],
    effortLevel: EffortLevel.MEDIUM,
    riskLevel: RiskLevel.MEDIUM,
    timeToValue: "2-3 weeks"
  },
  "Customer support": {
    businessFunction: "Customer Support",
    outcome: "Faster, more consistent customer replies.",
    painPoints: ["Repeated questions", "Slow response", "Inconsistent answers"],
    requiredInputs: ["Support history", "Approved answers", "Escalation rules"],
    successMetrics: ["Response time", "Resolution rate", "Support hours saved"],
    implementationSteps: [
      "Group recent tickets",
      "Draft approved answers",
      "Pilot with human review"
    ],
    effortLevel: EffortLevel.MEDIUM,
    riskLevel: RiskLevel.MEDIUM,
    timeToValue: "2-4 weeks"
  },
  "Help desk automation": {
    businessFunction: "Customer Support",
    outcome: "Deflect repeated tickets and route complex issues to the right human.",
    painPoints: ["Ticket backlog", "Repeated questions", "Slow triage"],
    requiredInputs: ["Help center content", "Escalation rules", "Ticket taxonomy"],
    successMetrics: ["Resolution time", "Deflection rate", "Escalation quality"],
    implementationSteps: [
      "Approve source answers",
      "Pilot on low-risk ticket types",
      "Measure handoff quality"
    ],
    effortLevel: EffortLevel.MEDIUM,
    riskLevel: RiskLevel.MEDIUM,
    timeToValue: "3-6 weeks"
  },
  "Lead enrichment": {
    businessFunction: "Sales",
    outcome: "Richer prospect records and better prioritization before outreach.",
    painPoints: ["Manual prospect research", "Incomplete CRM records"],
    requiredInputs: ["Target account criteria", "Approved data sources", "CRM fields"],
    successMetrics: ["Research time", "Data completeness", "Qualified meetings"],
    implementationSteps: [
      "Define ideal customer profile",
      "Enrich a small account list",
      "Review data quality before automation"
    ],
    effortLevel: EffortLevel.MEDIUM,
    riskLevel: RiskLevel.MEDIUM,
    timeToValue: "2-4 weeks"
  },
  "Sales email personalization": {
    businessFunction: "Sales",
    outcome: "More relevant outbound messages with less manual drafting.",
    painPoints: ["Generic emails", "Slow account research", "Low reply rates"],
    requiredInputs: ["Buyer persona", "Offer", "Approved messaging rules"],
    successMetrics: ["Reply rate", "Personalization time", "Meeting conversion"],
    implementationSteps: [
      "Create message guardrails",
      "Personalize one segment",
      "Review every message before sending"
    ],
    effortLevel: EffortLevel.MEDIUM,
    riskLevel: RiskLevel.MEDIUM,
    timeToValue: "2-3 weeks"
  },
  "CRM update automation": {
    businessFunction: "Sales",
    outcome: "Cleaner CRM records from calls, emails, forms, and handoffs.",
    painPoints: ["Incomplete CRM notes", "Manual data entry", "Lost follow-ups"],
    requiredInputs: ["CRM schema", "Update rules", "Review workflow"],
    successMetrics: ["CRM completeness", "Follow-up speed", "Manual entry time"],
    implementationSteps: [
      "Map required fields",
      "Automate draft updates",
      "Review before writing to CRM"
    ],
    effortLevel: EffortLevel.MEDIUM,
    riskLevel: RiskLevel.MEDIUM,
    timeToValue: "2-5 weeks"
  },
  "Internal knowledge search": {
    businessFunction: "Knowledge Management",
    outcome: "Source-grounded answers from approved company knowledge.",
    painPoints: ["Scattered documents", "Repeated internal questions"],
    requiredInputs: ["Approved sources", "Permissions", "Answer review policy"],
    successMetrics: ["Answer time", "Search success", "Repeated questions"],
    implementationSteps: [
      "Choose trusted source collections",
      "Set permissions and exclusions",
      "Pilot with frequent internal questions"
    ],
    effortLevel: EffortLevel.MEDIUM,
    riskLevel: RiskLevel.MEDIUM,
    timeToValue: "3-6 weeks"
  },
  "Data analysis": {
    businessFunction: "Data and Analytics",
    outcome: "Faster summaries, charts, and explanations from business data.",
    painPoints: ["Slow spreadsheet analysis", "Manual charting", "Hard-to-read reports"],
    requiredInputs: ["Clean data export", "Metric definitions", "Review owner"],
    successMetrics: ["Analysis time", "Insight quality", "Decision speed"],
    implementationSteps: [
      "Pick one recurring report",
      "Validate calculations manually",
      "Turn repeat questions into templates"
    ],
    effortLevel: EffortLevel.MEDIUM,
    riskLevel: RiskLevel.MEDIUM,
    timeToValue: "1-3 weeks"
  },
  "Spreadsheet automation": {
    businessFunction: "Data and Analytics",
    outcome: "Automated spreadsheet cleanup, formulas, summaries, and repeat analysis.",
    painPoints: ["Manual spreadsheet work", "Formula errors", "Slow reporting"],
    requiredInputs: ["Spreadsheet template", "Column definitions", "Validation rules"],
    successMetrics: ["Manual steps removed", "Error rate", "Report turnaround"],
    implementationSteps: [
      "Standardize the input sheet",
      "Automate one repeat calculation",
      "Compare output against manual results"
    ],
    effortLevel: EffortLevel.MEDIUM,
    riskLevel: RiskLevel.MEDIUM,
    timeToValue: "2-4 weeks"
  },
  "Document extraction": {
    businessFunction: "Operations",
    outcome: "Extract fields, summaries, and routing signals from structured documents.",
    painPoints: ["Manual document processing", "Slow intake", "Copy-paste errors"],
    requiredInputs: ["Document samples", "Field list", "Exception handling rules"],
    successMetrics: ["Processing time", "Extraction accuracy", "Manual corrections"],
    implementationSteps: [
      "Choose one document type",
      "Define target fields",
      "Review extraction accuracy before scaling"
    ],
    effortLevel: EffortLevel.MEDIUM,
    riskLevel: RiskLevel.HIGH,
    timeToValue: "3-6 weeks"
  },
  "Customer feedback analysis": {
    businessFunction: "Operations",
    outcome: "Recurring themes and prioritized issues from reviews, calls, and tickets.",
    painPoints: ["Feedback is scattered", "Themes are hard to quantify"],
    requiredInputs: ["Feedback export", "Theme taxonomy", "Decision owner"],
    successMetrics: ["Themes identified", "Issues prioritized", "Decision speed"],
    implementationSteps: [
      "Collect one feedback source",
      "Group themes manually once",
      "Automate repeat summaries"
    ],
    effortLevel: EffortLevel.MEDIUM,
    riskLevel: RiskLevel.MEDIUM,
    timeToValue: "2-4 weeks"
  },
  "Training content": {
    businessFunction: "Human Resources",
    outcome: "Reusable lessons, onboarding modules, scripts, and internal guides.",
    painPoints: ["Slow training material creation", "Outdated internal guides"],
    requiredInputs: ["Source expertise", "Learner profile", "Review criteria"],
    successMetrics: ["Assets created", "Update time", "Learner feedback"],
    implementationSteps: [
      "Define one learner outcome",
      "Draft lesson assets",
      "Review for accuracy and tone"
    ],
    effortLevel: EffortLevel.MEDIUM,
    riskLevel: RiskLevel.MEDIUM,
    timeToValue: "2-4 weeks"
  },
  "Recruiting support": {
    businessFunction: "Human Resources",
    outcome: "Structured recruiting summaries, scorecards, and interview notes.",
    painPoints: ["Manual screening notes", "Inconsistent interview writeups"],
    requiredInputs: ["Role criteria", "Fair evaluation rubric", "Interview format"],
    successMetrics: ["Review time", "Criteria consistency", "Hiring team feedback"],
    implementationSteps: [
      "Define review criteria first",
      "Use AI for administrative summaries",
      "Keep hiring decisions human-led"
    ],
    effortLevel: EffortLevel.MEDIUM,
    riskLevel: RiskLevel.HIGH,
    timeToValue: "3-5 weeks"
  },
  "Social media content": {
    businessFunction: "Marketing",
    outcome: "More consistent social posts, repurposed assets, and campaign calendars.",
    painPoints: ["Inconsistent posting", "Slow repurposing", "Brand drift"],
    requiredInputs: ["Brand voice", "Source asset", "Channel rules"],
    successMetrics: ["Posts shipped", "Review time", "Engagement quality"],
    implementationSteps: [
      "Create channel templates",
      "Repurpose approved source content",
      "Review before publishing"
    ],
    effortLevel: EffortLevel.LOW,
    riskLevel: RiskLevel.MEDIUM,
    timeToValue: "1-2 weeks"
  },
  "App prototyping": {
    businessFunction: "Product and Engineering",
    outcome: "Faster prototypes, landing pages, dashboards, and internal tools.",
    painPoints: ["Slow prototype setup", "Design-to-code handoff friction"],
    requiredInputs: ["User story", "Design constraints", "Review owner"],
    successMetrics: ["Prototype turnaround", "Iteration speed", "Handoff quality"],
    implementationSteps: [
      "Define one narrow workflow",
      "Generate a clickable prototype",
      "Review code and UX before reuse"
    ],
    effortLevel: EffortLevel.MEDIUM,
    riskLevel: RiskLevel.MEDIUM,
    timeToValue: "1-3 weeks"
  }
};

const industries = [
  {
    name: "Consulting and agencies",
    description:
      "Client-facing teams that need faster research, proposals, reporting, and campaign production.",
    startingPoint:
      "Start with repeatable client deliverables before automating client communication.",
    cautions: "Protect client data and keep final recommendations human-reviewed."
  },
  {
    name: "Ecommerce",
    description:
      "Online stores that need better product content, support triage, merchandising, and retention workflows.",
    startingPoint:
      "Start with product and support workflows because they are easy to measure.",
    cautions: "Review generated product claims before publishing."
  },
  {
    name: "SaaS teams",
    description:
      "Software teams balancing support, sales enablement, product documentation, and engineering workflows.",
    startingPoint:
      "Start where support questions repeat and documentation is already available.",
    cautions: "Avoid exposing private customer data to tools without clear controls."
  },
  {
    name: "Local services",
    description:
      "Service businesses that need faster lead response, scheduling support, reviews, and marketing output.",
    startingPoint:
      "Start with inbound lead and review workflows because speed directly affects revenue.",
    cautions: "Keep customer-facing messages accurate, local, and brand-safe."
  },
  {
    name: "Real estate",
    description:
      "Brokerages and agents improving listing content, lead follow-up, local research, and client communication.",
    startingPoint:
      "Start with listing content and lead follow-up workflows that can be reviewed before publishing.",
    cautions: "Review fair-housing-sensitive language and local legal claims."
  },
  {
    name: "Education and training",
    description:
      "Teams creating lessons, training content, feedback, and administrative support material.",
    startingPoint:
      "Start with internal training content and lesson planning before student-facing automation.",
    cautions: "Protect student data and keep learning feedback human-supervised."
  },
  {
    name: "Finance and accounting",
    description:
      "Teams improving reporting, invoice handling, categorization, and document review workflows.",
    startingPoint:
      "Start with summaries and categorization where human review is already part of the workflow.",
    cautions: "Treat financial records, compliance, and sensitive data as high risk."
  },
  {
    name: "Healthcare operations",
    description:
      "Non-clinical teams improving intake, scheduling, documentation, and administrative workflows.",
    startingPoint:
      "Start with non-clinical admin workflows and strict data handling boundaries.",
    cautions: "Avoid clinical claims and protect health data."
  },
  {
    name: "Legal services",
    description:
      "Law firms and legal operations teams improving intake, document review, research support, and client updates.",
    startingPoint:
      "Start with non-confidential templates, intake summaries, and internal research organization.",
    cautions:
      "Do not treat generated output as legal advice; require attorney review and strict confidentiality controls."
  },
  {
    name: "Manufacturing and logistics",
    description:
      "Operations teams improving SOPs, quality notes, inventory communication, maintenance logs, and reporting.",
    startingPoint:
      "Start with internal SOP summaries and exception reporting before automating operational decisions.",
    cautions:
      "Review safety, quality, and operational instructions before use in production workflows."
  },
  {
    name: "Retail and hospitality",
    description:
      "Customer-facing teams improving local marketing, reviews, staff training, support, and scheduling communication.",
    startingPoint:
      "Start with review responses, staff FAQs, and repeat guest or customer messages.",
    cautions:
      "Keep public-facing claims accurate and maintain human review for sensitive customer situations."
  },
  {
    name: "Media and creators",
    description:
      "Creators and production teams improving scripts, editing, repurposing, thumbnails, narration, and publishing workflows.",
    startingPoint:
      "Start by repurposing one finished source asset into multiple reviewed outputs.",
    cautions:
      "Check usage rights, likeness permissions, and disclosure requirements for generated media."
  },
  {
    name: "Nonprofits",
    description:
      "Lean teams improving grant drafts, donor communication, volunteer coordination, reporting, and program content.",
    startingPoint:
      "Start with reusable donor, grant, and program-report templates that staff can review.",
    cautions:
      "Protect beneficiary data and review impact claims before publishing or submitting."
  }
];

const opportunities = [
  {
    name: "Reduce support response time",
    businessFunction: "Customer Support",
    description:
      "Use AI-assisted drafting, routing, and knowledge snippets to answer repeated customer questions faster.",
    painPoint: "Support teams lose time answering the same questions repeatedly.",
    expectedBenefit: "Faster replies, better consistency, and fewer repeated manual answers.",
    startingPoint: "Group the last 50-100 support questions by topic.",
    effortLevel: EffortLevel.MEDIUM,
    riskLevel: RiskLevel.MEDIUM,
    timeToValue: "2-4 weeks",
    successMetrics: ["Response time", "First-contact resolution", "Support hours saved"],
    industries: ["Ecommerce", "SaaS teams", "Local services"],
    useCases: ["Customer support", "Knowledge management", "Workflow automation"]
  },
  {
    name: "Turn repeated questions into a knowledge base",
    businessFunction: "Customer Support",
    description:
      "Convert recurring support and sales questions into reusable help content.",
    painPoint: "Knowledge is trapped in tickets, calls, and individual team members.",
    expectedBenefit: "Better self-service and lower support load.",
    startingPoint: "Identify the top recurring questions and draft approved answers.",
    effortLevel: EffortLevel.MEDIUM,
    riskLevel: RiskLevel.MEDIUM,
    timeToValue: "2-3 weeks",
    successMetrics: ["Article coverage", "Ticket deflection", "Answer quality"],
    industries: ["Ecommerce", "SaaS teams", "Education and training"],
    useCases: ["Knowledge management", "Customer support", "Writing assistant"]
  },
  {
    name: "Draft product descriptions faster",
    businessFunction: "Marketing",
    description:
      "Create product descriptions, feature copy, and marketplace content from structured product inputs.",
    painPoint: "Product content slows launches and is often inconsistent.",
    expectedBenefit: "Faster product publishing with clearer review checkpoints.",
    startingPoint: "Create a reusable product brief with claims that must be verified.",
    effortLevel: EffortLevel.LOW,
    riskLevel: RiskLevel.MEDIUM,
    timeToValue: "1-2 weeks",
    successMetrics: ["Descriptions shipped", "Editing time", "Launch speed"],
    industries: ["Ecommerce", "Real estate"],
    useCases: ["Copywriting", "SEO content", "Writing assistant"]
  },
  {
    name: "Repurpose content across channels",
    businessFunction: "Marketing",
    description:
      "Turn one source asset into posts, emails, summaries, and short-form creative.",
    painPoint: "Teams create good source material but struggle to reuse it consistently.",
    expectedBenefit: "More output from existing expertise and assets.",
    startingPoint: "Choose one source format and define channel-specific templates.",
    effortLevel: EffortLevel.LOW,
    riskLevel: RiskLevel.LOW,
    timeToValue: "1-2 weeks",
    successMetrics: ["Assets repurposed", "Publishing frequency", "Review cycles"],
    industries: ["Consulting and agencies", "SaaS teams", "Education and training"],
    useCases: ["Copywriting", "Design assets", "Video generation"]
  },
  {
    name: "Create SEO content briefs",
    businessFunction: "Marketing",
    description:
      "Generate repeatable SEO briefs with audience, structure, terms, and source guidance.",
    painPoint: "SEO content planning takes too long and often starts from scratch.",
    expectedBenefit: "Faster briefs and more consistent article planning.",
    startingPoint: "Define one content template and review criteria.",
    effortLevel: EffortLevel.MEDIUM,
    riskLevel: RiskLevel.MEDIUM,
    timeToValue: "2-4 weeks",
    successMetrics: ["Brief creation time", "Content shipped", "Organic visits"],
    industries: ["Consulting and agencies", "Ecommerce", "Local services"],
    useCases: ["SEO content", "Web research", "Writing assistant"]
  },
  {
    name: "Improve lead follow-up speed",
    businessFunction: "Sales",
    description:
      "Use templates, routing, and automated reminders to respond to leads faster.",
    painPoint: "Slow lead response causes missed revenue opportunities.",
    expectedBenefit: "Faster response times and more booked conversations.",
    startingPoint: "Map every inbound channel and current response time.",
    effortLevel: EffortLevel.MEDIUM,
    riskLevel: RiskLevel.MEDIUM,
    timeToValue: "2-3 weeks",
    successMetrics: ["Lead response time", "Booking rate", "Follow-up coverage"],
    industries: ["Local services", "Real estate", "Consulting and agencies"],
    useCases: ["Sales outreach", "Workflow automation", "Customer support"]
  },
  {
    name: "Generate first-draft proposals",
    businessFunction: "Sales",
    description:
      "Create first drafts of proposals from reusable service descriptions, discovery notes, and scope templates.",
    painPoint: "Proposal creation is repetitive but still requires expert review.",
    expectedBenefit: "Faster proposal turnaround with consistent structure.",
    startingPoint: "Create a proposal template and approved service library.",
    effortLevel: EffortLevel.MEDIUM,
    riskLevel: RiskLevel.MEDIUM,
    timeToValue: "2-4 weeks",
    successMetrics: ["Proposal turnaround", "Win rate", "Review cycles"],
    industries: ["Consulting and agencies", "Local services", "SaaS teams"],
    useCases: ["Writing assistant", "Presentation creation", "Sales outreach"]
  },
  {
    name: "Summarize sales and client calls",
    businessFunction: "Sales",
    description:
      "Capture decisions, objections, action items, and follow-ups from calls.",
    painPoint: "Important next steps are missed or manually rewritten after calls.",
    expectedBenefit: "Cleaner handoffs and faster follow-up.",
    startingPoint: "Define an action-item and summary format.",
    effortLevel: EffortLevel.LOW,
    riskLevel: RiskLevel.LOW,
    timeToValue: "1 week",
    successMetrics: ["Follow-up time", "Missed actions", "CRM completeness"],
    industries: ["Consulting and agencies", "SaaS teams", "Real estate"],
    useCases: ["Meeting summaries", "Audio transcription", "Knowledge management"]
  },
  {
    name: "Automate intake and routing",
    businessFunction: "Operations",
    description:
      "Route requests, forms, leads, and internal tasks to the right destination.",
    painPoint: "Manual routing creates delays and dropped handoffs.",
    expectedBenefit: "Faster processing and fewer missed tasks.",
    startingPoint: "Map one intake workflow and define routing rules.",
    effortLevel: EffortLevel.MEDIUM,
    riskLevel: RiskLevel.MEDIUM,
    timeToValue: "2-4 weeks",
    successMetrics: ["Cycle time", "Manual steps removed", "Routing errors"],
    industries: ["Local services", "Healthcare operations", "Finance and accounting"],
    useCases: ["Workflow automation", "Customer support", "Sales outreach"]
  },
  {
    name: "Summarize operational reports",
    businessFunction: "Operations",
    description:
      "Turn recurring data exports, updates, and notes into concise operational summaries.",
    painPoint: "Leaders spend time reading scattered updates and reports.",
    expectedBenefit: "Faster awareness and clearer operating decisions.",
    startingPoint: "Choose one recurring report and define summary fields.",
    effortLevel: EffortLevel.LOW,
    riskLevel: RiskLevel.LOW,
    timeToValue: "1-2 weeks",
    successMetrics: ["Summary time", "Decision speed", "Report readership"],
    industries: ["SaaS teams", "Finance and accounting", "Healthcare operations"],
    useCases: ["General assistant", "Knowledge management", "Web research"]
  },
  {
    name: "Build reusable workflow templates",
    businessFunction: "Operations",
    description:
      "Document and templatize repeated workflows so automation and delegation become easier.",
    painPoint: "Teams repeat work without a documented process.",
    expectedBenefit: "Better consistency and easier automation later.",
    startingPoint: "Choose one repeated workflow and document the current process.",
    effortLevel: EffortLevel.MEDIUM,
    riskLevel: RiskLevel.MEDIUM,
    timeToValue: "3-5 weeks",
    successMetrics: ["Templates created", "Error reduction", "Training time"],
    industries: ["Consulting and agencies", "Local services", "Education and training"],
    useCases: ["Workflow automation", "Knowledge management", "Writing assistant"]
  },
  {
    name: "Create meeting notes and action items",
    businessFunction: "Knowledge Management",
    description:
      "Automatically create structured notes, decisions, and action items from recurring meetings.",
    painPoint: "Meetings create work that is not captured cleanly.",
    expectedBenefit: "Faster follow-up and clearer accountability.",
    startingPoint: "Pilot on internal recurring meetings first.",
    effortLevel: EffortLevel.LOW,
    riskLevel: RiskLevel.LOW,
    timeToValue: "1 week",
    successMetrics: ["Note completion", "Action-item closure", "Follow-up time"],
    industries: ["Consulting and agencies", "SaaS teams", "Education and training"],
    useCases: ["Meeting summaries", "Audio transcription", "Knowledge management"]
  },
  {
    name: "Make internal knowledge searchable",
    businessFunction: "Knowledge Management",
    description:
      "Improve access to internal documents, policies, past work, and answers.",
    painPoint: "People waste time finding information or asking repeated questions.",
    expectedBenefit: "Faster onboarding and better self-service.",
    startingPoint: "Choose approved source documents and define access rules.",
    effortLevel: EffortLevel.MEDIUM,
    riskLevel: RiskLevel.MEDIUM,
    timeToValue: "3-6 weeks",
    successMetrics: ["Answer time", "Repeated questions", "Document usage"],
    industries: ["SaaS teams", "Education and training", "Healthcare operations"],
    useCases: ["Knowledge management", "General assistant", "Web research"]
  },
  {
    name: "Improve onboarding documentation",
    businessFunction: "Human Resources",
    description:
      "Create clearer onboarding guides, FAQs, and training content from existing materials.",
    painPoint: "New team members repeatedly need the same explanations.",
    expectedBenefit: "Faster onboarding and fewer repeated admin questions.",
    startingPoint: "List the top repeated onboarding questions.",
    effortLevel: EffortLevel.MEDIUM,
    riskLevel: RiskLevel.MEDIUM,
    timeToValue: "2-4 weeks",
    successMetrics: ["Onboarding time", "FAQ coverage", "Manager questions"],
    industries: ["Education and training", "SaaS teams", "Healthcare operations"],
    useCases: ["Knowledge management", "Writing assistant", "Presentation creation"]
  },
  {
    name: "Screen resumes and draft interview notes",
    businessFunction: "Human Resources",
    description:
      "Support recruiting workflows with structured summaries and interview-note drafts.",
    painPoint: "Recruiting creates repetitive review and note-taking work.",
    expectedBenefit: "Faster recruiting administration with structured review.",
    startingPoint: "Define fair evaluation criteria before using any tool.",
    effortLevel: EffortLevel.MEDIUM,
    riskLevel: RiskLevel.HIGH,
    timeToValue: "3-5 weeks",
    successMetrics: ["Review time", "Criteria consistency", "Hiring team feedback"],
    industries: ["SaaS teams", "Healthcare operations", "Education and training"],
    useCases: ["Writing assistant", "Knowledge management", "Meeting summaries"]
  },
  {
    name: "Draft finance summaries",
    businessFunction: "Finance",
    description:
      "Summarize financial reports, budget notes, and recurring business updates.",
    painPoint: "Finance information is hard for non-finance stakeholders to scan.",
    expectedBenefit: "Clearer financial communication and faster review.",
    startingPoint: "Start with non-sensitive summary templates and human review.",
    effortLevel: EffortLevel.MEDIUM,
    riskLevel: RiskLevel.HIGH,
    timeToValue: "2-4 weeks",
    successMetrics: ["Summary time", "Review accuracy", "Stakeholder clarity"],
    industries: ["Finance and accounting", "Consulting and agencies"],
    useCases: ["General assistant", "Writing assistant", "Knowledge management"]
  },
  {
    name: "Categorize invoices and receipts",
    businessFunction: "Finance",
    description:
      "Use AI-assisted extraction and categorization to reduce finance admin.",
    painPoint: "Manual finance document processing is slow and error-prone.",
    expectedBenefit: "Less manual categorization and faster bookkeeping support.",
    startingPoint: "Pilot on low-risk documents with manual verification.",
    effortLevel: EffortLevel.MEDIUM,
    riskLevel: RiskLevel.HIGH,
    timeToValue: "3-6 weeks",
    successMetrics: ["Processing time", "Error rate", "Manual corrections"],
    industries: ["Finance and accounting", "Local services", "Ecommerce"],
    useCases: ["Workflow automation", "Knowledge management"]
  },
  {
    name: "Speed up code scaffolding",
    businessFunction: "Product and Engineering",
    description:
      "Use coding assistants for boilerplate, prototypes, and repetitive implementation support.",
    painPoint: "Engineering teams spend time on repetitive setup and examples.",
    expectedBenefit: "Faster implementation starts and better developer flow.",
    startingPoint: "Pilot on low-risk internal tasks with code review.",
    effortLevel: EffortLevel.MEDIUM,
    riskLevel: RiskLevel.MEDIUM,
    timeToValue: "1-3 weeks",
    successMetrics: ["Cycle time", "Review quality", "Developer satisfaction"],
    industries: ["SaaS teams"],
    useCases: ["Code generation", "Code review"]
  },
  {
    name: "Improve code review preparation",
    businessFunction: "Product and Engineering",
    description:
      "Generate review summaries, test ideas, and risk prompts before human review.",
    painPoint: "Code reviews can miss context or edge cases.",
    expectedBenefit: "Better review readiness and clearer handoffs.",
    startingPoint: "Create an accepted checklist for AI-assisted review prep.",
    effortLevel: EffortLevel.MEDIUM,
    riskLevel: RiskLevel.MEDIUM,
    timeToValue: "2-4 weeks",
    successMetrics: ["Review time", "Defects caught", "Test ideas adopted"],
    industries: ["SaaS teams"],
    useCases: ["Code review", "Code generation", "Knowledge management"]
  },
  {
    name: "Draft product release notes",
    businessFunction: "Product and Engineering",
    description:
      "Turn product changes into release notes, customer updates, and internal summaries.",
    painPoint: "Release communication is often rushed or inconsistent.",
    expectedBenefit: "Clearer product communication with less manual drafting.",
    startingPoint: "Standardize release-note inputs from product and engineering.",
    effortLevel: EffortLevel.LOW,
    riskLevel: RiskLevel.LOW,
    timeToValue: "1 week",
    successMetrics: ["Draft time", "Release note coverage", "Review cycles"],
    industries: ["SaaS teams"],
    useCases: ["Writing assistant", "Knowledge management"]
  },
  {
    name: "Create training content",
    businessFunction: "Knowledge Management",
    description:
      "Turn expertise and process notes into lessons, guides, scripts, and slides.",
    painPoint: "Training material takes time to create and update.",
    expectedBenefit: "Faster training content production with reviewable outputs.",
    startingPoint: "Choose one training topic and define the learner outcome.",
    effortLevel: EffortLevel.MEDIUM,
    riskLevel: RiskLevel.MEDIUM,
    timeToValue: "2-4 weeks",
    successMetrics: ["Training assets created", "Learner feedback", "Update time"],
    industries: ["Education and training", "Consulting and agencies", "Healthcare operations"],
    useCases: ["Presentation creation", "Video generation", "Writing assistant"]
  },
  {
    name: "Improve local review responses",
    businessFunction: "Marketing",
    description:
      "Draft thoughtful responses to local reviews while preserving human judgment.",
    painPoint: "Public reviews need fast, consistent, and sensitive replies.",
    expectedBenefit: "Better public trust and faster review handling.",
    startingPoint: "Create templates for positive, neutral, and negative reviews.",
    effortLevel: EffortLevel.LOW,
    riskLevel: RiskLevel.MEDIUM,
    timeToValue: "1-2 weeks",
    successMetrics: ["Response coverage", "Response time", "Review rating trend"],
    industries: ["Local services", "Real estate", "Healthcare operations"],
    useCases: ["Copywriting", "Customer support", "Writing assistant"]
  },
  {
    name: "Draft listing and property content",
    businessFunction: "Marketing",
    description:
      "Create reviewed drafts for listings, descriptions, social posts, and local market updates.",
    painPoint: "Listing and property content is repetitive but brand-sensitive.",
    expectedBenefit: "Faster publishing with consistent structure.",
    startingPoint: "Create an approved listing brief and compliance checklist.",
    effortLevel: EffortLevel.LOW,
    riskLevel: RiskLevel.MEDIUM,
    timeToValue: "1-2 weeks",
    successMetrics: ["Draft time", "Listings published", "Review corrections"],
    industries: ["Real estate"],
    useCases: ["Copywriting", "SEO content", "Design assets"]
  },
  {
    name: "Summarize customer feedback",
    businessFunction: "Operations",
    description:
      "Analyze support notes, reviews, and survey responses to identify repeated issues.",
    painPoint: "Feedback arrives in many places and is hard to synthesize.",
    expectedBenefit: "Better product, support, and operations decisions.",
    startingPoint: "Collect feedback from one channel for the last 30 days.",
    effortLevel: EffortLevel.MEDIUM,
    riskLevel: RiskLevel.MEDIUM,
    timeToValue: "2-4 weeks",
    successMetrics: ["Themes found", "Issues prioritized", "Decision speed"],
    industries: ["Ecommerce", "SaaS teams", "Local services"],
    useCases: ["Web research", "Knowledge management", "Workflow automation"]
  }
];

const tools = [
  {
    name: "ChatGPT",
    category: "Productivity",
    shortDescription:
      "General-purpose AI assistant for writing, analysis, coding, and research.",
    longDescription:
      "ChatGPT is a flexible AI assistant for everyday work, from drafting and summarizing to analysis, planning, and code help. It is a useful starting point when users need a broad assistant rather than a specialized workflow tool.",
    websiteUrl: "https://chatgpt.com",
    pricingType: PricingType.FREEMIUM,
    hasFreePlan: true,
    isVerified: true,
    isFeatured: true,
    popularityScore: 98,
    useCases: ["General assistant", "Writing assistant", "Code generation"],
    features: ["Chat interface", "Document upload", "Web browsing", "API access"],
    alternatives: ["Claude", "Gemini", "Perplexity"]
  },
  {
    name: "Claude",
    category: "Productivity",
    shortDescription:
      "AI assistant focused on writing, analysis, reasoning, and long-form work.",
    longDescription:
      "Claude is well suited for thoughtful writing, document analysis, brainstorming, and structured reasoning. It works best for users who want a conversational assistant with strong long-form support.",
    websiteUrl: "https://claude.ai",
    pricingType: PricingType.FREEMIUM,
    hasFreePlan: true,
    isVerified: true,
    isFeatured: true,
    popularityScore: 94,
    useCases: ["General assistant", "Writing assistant", "Knowledge management"],
    features: ["Chat interface", "Document upload", "Team workspace"],
    alternatives: ["ChatGPT", "Gemini", "Perplexity"]
  },
  {
    name: "Gemini",
    category: "Productivity",
    shortDescription:
      "Google's AI assistant for search, productivity, and multimodal tasks.",
    longDescription:
      "Gemini connects general assistant workflows with Google's broader product ecosystem. It is useful for users who want writing, research, planning, and multimodal help in one assistant.",
    websiteUrl: "https://gemini.google.com",
    pricingType: PricingType.FREEMIUM,
    hasFreePlan: true,
    isVerified: true,
    isFeatured: true,
    popularityScore: 90,
    useCases: ["General assistant", "Web research", "Writing assistant"],
    features: ["Chat interface", "Web browsing", "Document upload"],
    alternatives: ["ChatGPT", "Claude", "Perplexity"]
  },
  {
    name: "Perplexity",
    category: "Research",
    shortDescription:
      "AI answer engine for web research with citations and follow-up questions.",
    longDescription:
      "Perplexity is built for research-oriented search. It helps users explore topics, compare sources, and get concise answers with citations, making it useful for discovery and fact-finding workflows.",
    websiteUrl: "https://www.perplexity.ai",
    pricingType: PricingType.FREEMIUM,
    hasFreePlan: true,
    isVerified: true,
    isFeatured: true,
    popularityScore: 92,
    useCases: ["Web research", "General assistant"],
    features: ["Citations", "Web browsing", "Chat interface"],
    alternatives: ["ChatGPT", "Gemini", "Claude"]
  },
  {
    name: "Notion AI",
    category: "Productivity",
    shortDescription:
      "AI writing, summarization, and knowledge management inside Notion.",
    longDescription:
      "Notion AI brings AI assistance into notes, docs, and team knowledge bases. It is most useful for teams that already organize work and documentation in Notion.",
    websiteUrl: "https://www.notion.so/product/ai",
    pricingType: PricingType.PAID,
    hasFreePlan: false,
    isVerified: true,
    isFeatured: false,
    popularityScore: 78,
    useCases: ["Knowledge management", "Writing assistant", "Meeting summaries"],
    features: ["Document upload", "Team workspace", "Templates"],
    alternatives: ["ChatGPT", "Claude", "Mem"]
  },
  {
    name: "Grammarly",
    category: "Writing",
    shortDescription:
      "AI writing assistant for grammar, tone, clarity, and rewrites.",
    longDescription:
      "Grammarly helps improve everyday writing across emails, documents, and browser-based workflows. It is a practical choice for clarity, tone adjustments, and writing polish.",
    websiteUrl: "https://www.grammarly.com",
    pricingType: PricingType.FREEMIUM,
    hasFreePlan: true,
    isVerified: true,
    isFeatured: true,
    popularityScore: 86,
    useCases: ["Writing assistant", "Copywriting"],
    features: ["Browser extension", "Team workspace", "Integrations"],
    alternatives: ["QuillBot", "Jasper", "Copy.ai"]
  },
  {
    name: "Jasper",
    category: "Marketing",
    shortDescription:
      "AI marketing platform for brand-aware copy, campaigns, and content.",
    longDescription:
      "Jasper focuses on marketing teams that need repeatable brand-aware content workflows. It supports campaign assets, long-form content, and collaborative marketing production.",
    websiteUrl: "https://www.jasper.ai",
    pricingType: PricingType.PAID,
    hasFreePlan: false,
    isVerified: true,
    isFeatured: true,
    popularityScore: 82,
    useCases: ["Copywriting", "SEO content", "Sales outreach"],
    features: ["Templates", "Brand kit", "Team workspace"],
    alternatives: ["Copy.ai", "Writesonic", "Grammarly"]
  },
  {
    name: "Copy.ai",
    category: "Marketing",
    shortDescription:
      "AI platform for go-to-market content, sales copy, and workflows.",
    longDescription:
      "Copy.ai helps teams create marketing and sales content while also supporting repeatable GTM workflows. It is useful for teams that want more than a single writing prompt box.",
    websiteUrl: "https://www.copy.ai",
    pricingType: PricingType.FREEMIUM,
    hasFreePlan: true,
    isVerified: true,
    isFeatured: false,
    popularityScore: 74,
    useCases: ["Copywriting", "Sales outreach", "Workflow automation"],
    features: ["Templates", "Workflow builder", "Team workspace"],
    alternatives: ["Jasper", "Writesonic", "Grammarly"]
  },
  {
    name: "Writesonic",
    category: "Writing",
    shortDescription:
      "AI writing platform for articles, landing pages, ads, and SEO content.",
    longDescription:
      "Writesonic supports content teams creating articles, ads, and marketing copy. It is a useful option for users who want structured writing templates and SEO-oriented content workflows.",
    websiteUrl: "https://writesonic.com",
    pricingType: PricingType.FREEMIUM,
    hasFreePlan: true,
    isVerified: false,
    isFeatured: false,
    popularityScore: 67,
    useCases: ["Writing assistant", "SEO content", "Copywriting"],
    features: ["Templates", "SEO scoring", "Export options"],
    alternatives: ["Jasper", "Copy.ai", "Grammarly"]
  },
  {
    name: "Surfer",
    category: "Marketing",
    shortDescription:
      "SEO content optimization platform for briefs, writing, and scoring.",
    longDescription:
      "Surfer helps content teams plan and optimize SEO articles using briefs, structure guidance, and scoring. It is best for users focused on organic search content.",
    websiteUrl: "https://surferseo.com",
    pricingType: PricingType.PAID,
    hasFreePlan: false,
    isVerified: false,
    isFeatured: false,
    popularityScore: 70,
    useCases: ["SEO content", "Writing assistant"],
    features: ["SEO scoring", "Templates", "Team workspace"],
    alternatives: ["Writesonic", "Jasper", "Copy.ai"]
  },
  {
    name: "Canva",
    category: "Design",
    shortDescription:
      "Design platform with AI-assisted image, copy, and presentation tools.",
    longDescription:
      "Canva combines accessible design tooling with AI-powered creation features. It is useful for teams creating social graphics, presentations, brand assets, and lightweight marketing visuals.",
    websiteUrl: "https://www.canva.com",
    pricingType: PricingType.FREEMIUM,
    hasFreePlan: true,
    isVerified: true,
    isFeatured: true,
    popularityScore: 89,
    useCases: ["Design assets", "Presentation creation", "Image creation"],
    features: ["Brand kit", "Templates", "Export options"],
    alternatives: ["Adobe Firefly", "Gamma", "Midjourney"]
  },
  {
    name: "Midjourney",
    category: "Image generation",
    shortDescription:
      "AI image generation tool for expressive visual exploration and concepts.",
    longDescription:
      "Midjourney is used for generating stylized images, concept art, moodboards, and creative visual directions. It is strong for exploratory creative work.",
    websiteUrl: "https://www.midjourney.com",
    pricingType: PricingType.PAID,
    hasFreePlan: false,
    isVerified: false,
    isFeatured: true,
    popularityScore: 87,
    useCases: ["Image creation", "Design assets"],
    features: ["Image generation", "Export options"],
    alternatives: ["Adobe Firefly", "Canva", "Leonardo AI"]
  },
  {
    name: "Adobe Firefly",
    category: "Image generation",
    shortDescription:
      "Adobe's generative AI tools for images, effects, and creative workflows.",
    longDescription:
      "Adobe Firefly supports image generation and creative editing workflows inside Adobe's ecosystem. It is useful for creators who want AI features connected to familiar design tools.",
    websiteUrl: "https://firefly.adobe.com",
    pricingType: PricingType.FREEMIUM,
    hasFreePlan: true,
    isVerified: true,
    isFeatured: false,
    popularityScore: 79,
    useCases: ["Image creation", "Design assets"],
    features: ["Image generation", "Brand kit", "Export options"],
    alternatives: ["Midjourney", "Canva", "Leonardo AI"]
  },
  {
    name: "Leonardo AI",
    category: "Image generation",
    shortDescription:
      "AI image and asset generation platform for creative production.",
    longDescription:
      "Leonardo AI is used for generating images, game assets, and creative visuals. It is a good fit for users who want production-oriented image generation workflows.",
    websiteUrl: "https://leonardo.ai",
    pricingType: PricingType.FREEMIUM,
    hasFreePlan: true,
    isVerified: false,
    isFeatured: false,
    popularityScore: 71,
    useCases: ["Image creation", "Design assets"],
    features: ["Image generation", "Export options"],
    alternatives: ["Midjourney", "Adobe Firefly", "Canva"]
  },
  {
    name: "Runway",
    category: "Video",
    shortDescription:
      "AI video creation and editing platform for generative video workflows.",
    longDescription:
      "Runway helps creators generate, edit, and transform video with AI. It is useful for concept videos, creative clips, and production experiments.",
    websiteUrl: "https://runwayml.com",
    pricingType: PricingType.FREEMIUM,
    hasFreePlan: true,
    isVerified: true,
    isFeatured: true,
    popularityScore: 84,
    useCases: ["Video generation", "Design assets"],
    features: ["Video editing", "Export options", "Templates"],
    alternatives: ["Synthesia", "Descript", "Canva"]
  },
  {
    name: "Synthesia",
    category: "Video",
    shortDescription:
      "AI video platform for avatar-led training, sales, and explainer videos.",
    longDescription:
      "Synthesia focuses on creating polished avatar-led videos from scripts. It is often used for training, internal communication, product explainers, and localized video content.",
    websiteUrl: "https://www.synthesia.io",
    pricingType: PricingType.PAID,
    hasFreePlan: false,
    isVerified: true,
    isFeatured: false,
    popularityScore: 76,
    useCases: ["Video generation", "Presentation creation", "Customer support"],
    features: ["Video editing", "Templates", "Export options"],
    alternatives: ["Runway", "Descript", "Canva"]
  },
  {
    name: "Descript",
    category: "Video",
    shortDescription:
      "AI-powered video and podcast editor with transcription-first workflows.",
    longDescription:
      "Descript lets creators edit audio and video through a transcript-based workflow. It is useful for podcasts, interviews, clips, and collaborative media editing.",
    websiteUrl: "https://www.descript.com",
    pricingType: PricingType.FREEMIUM,
    hasFreePlan: true,
    isVerified: true,
    isFeatured: true,
    popularityScore: 81,
    useCases: ["Video generation", "Audio transcription", "Meeting summaries"],
    features: ["Transcription", "Video editing", "Export options"],
    alternatives: ["Runway", "Synthesia", "ElevenLabs"]
  },
  {
    name: "ElevenLabs",
    category: "Audio",
    shortDescription:
      "AI voice platform for text-to-speech, voice generation, and dubbing.",
    longDescription:
      "ElevenLabs provides realistic voice generation and speech tools for creators, publishers, and product teams. It is useful for narration, dubbing, and voice-enabled experiences.",
    websiteUrl: "https://elevenlabs.io",
    pricingType: PricingType.FREEMIUM,
    hasFreePlan: true,
    isVerified: true,
    isFeatured: true,
    popularityScore: 83,
    useCases: ["Voice generation", "Video generation"],
    features: ["Text to speech", "API access", "Export options"],
    alternatives: ["Descript", "Otter.ai", "Fireflies.ai"]
  },
  {
    name: "Otter.ai",
    category: "Meetings",
    shortDescription:
      "AI meeting transcription and notes for calls, interviews, and teams.",
    longDescription:
      "Otter.ai helps teams capture meeting transcripts, notes, and summaries. It is useful for interviews, recurring meetings, and follow-up workflows.",
    websiteUrl: "https://otter.ai",
    pricingType: PricingType.FREEMIUM,
    hasFreePlan: true,
    isVerified: true,
    isFeatured: false,
    popularityScore: 72,
    useCases: ["Meeting summaries", "Audio transcription"],
    features: ["Transcription", "Meeting notes", "Integrations"],
    alternatives: ["Fireflies.ai", "Descript", "Fathom"]
  },
  {
    name: "Fireflies.ai",
    category: "Meetings",
    shortDescription:
      "AI meeting assistant for recording, transcription, summaries, and search.",
    longDescription:
      "Fireflies.ai captures and summarizes meetings, then makes conversations searchable. It is useful for sales, recruiting, customer calls, and internal team meetings.",
    websiteUrl: "https://fireflies.ai",
    pricingType: PricingType.FREEMIUM,
    hasFreePlan: true,
    isVerified: false,
    isFeatured: false,
    popularityScore: 69,
    useCases: ["Meeting summaries", "Sales outreach", "Audio transcription"],
    features: ["Meeting notes", "Transcription", "Integrations"],
    alternatives: ["Otter.ai", "Fathom", "Descript"]
  },
  {
    name: "Fathom",
    category: "Meetings",
    shortDescription:
      "AI meeting recorder for summaries, highlights, and follow-up notes.",
    longDescription:
      "Fathom records meetings and creates summaries, highlights, and notes. It is a focused option for users who want simple meeting capture and follow-up support.",
    websiteUrl: "https://fathom.video",
    pricingType: PricingType.FREEMIUM,
    hasFreePlan: true,
    isVerified: false,
    isFeatured: false,
    popularityScore: 66,
    useCases: ["Meeting summaries", "Audio transcription"],
    features: ["Meeting notes", "Transcription", "Integrations"],
    alternatives: ["Otter.ai", "Fireflies.ai", "Descript"]
  },
  {
    name: "Cursor",
    category: "Developer tools",
    shortDescription:
      "AI code editor for pair programming, refactoring, and codebase navigation.",
    longDescription:
      "Cursor brings AI assistance directly into the coding environment. It helps developers understand codebases, generate changes, refactor, and move faster through implementation work.",
    websiteUrl: "https://www.cursor.com",
    pricingType: PricingType.FREEMIUM,
    hasFreePlan: true,
    isVerified: true,
    isFeatured: true,
    popularityScore: 91,
    useCases: ["Code generation", "Code review"],
    features: ["Code completion", "Repo awareness", "Chat interface"],
    alternatives: ["GitHub Copilot", "Replit", "Tabnine"]
  },
  {
    name: "GitHub Copilot",
    category: "Developer tools",
    shortDescription:
      "AI coding assistant for suggestions, chat, and developer workflows.",
    longDescription:
      "GitHub Copilot supports coding workflows with inline suggestions, chat, and assistance across common development tasks. It is useful for developers working inside supported editors and GitHub workflows.",
    websiteUrl: "https://github.com/features/copilot",
    pricingType: PricingType.PAID,
    hasFreePlan: false,
    isVerified: true,
    isFeatured: true,
    popularityScore: 88,
    useCases: ["Code generation", "Code review"],
    features: ["Code completion", "Chat interface", "Integrations"],
    alternatives: ["Cursor", "Replit", "Tabnine"]
  },
  {
    name: "Replit",
    category: "Developer tools",
    shortDescription:
      "Browser-based development platform with AI coding and app-building tools.",
    longDescription:
      "Replit combines cloud development environments with AI-powered coding support. It is useful for quick prototypes, learning, small apps, and collaborative coding.",
    websiteUrl: "https://replit.com",
    pricingType: PricingType.FREEMIUM,
    hasFreePlan: true,
    isVerified: true,
    isFeatured: false,
    popularityScore: 73,
    useCases: ["Code generation", "Workflow automation"],
    features: ["Code completion", "Team workspace", "Integrations"],
    alternatives: ["Cursor", "GitHub Copilot", "Tabnine"]
  },
  {
    name: "Tabnine",
    category: "Developer tools",
    shortDescription:
      "AI code assistant focused on code completion and team development.",
    longDescription:
      "Tabnine provides AI code completion and developer assistance with a focus on team workflows. It is useful for organizations evaluating coding assistants across engineering teams.",
    websiteUrl: "https://www.tabnine.com",
    pricingType: PricingType.FREEMIUM,
    hasFreePlan: true,
    isVerified: false,
    isFeatured: false,
    popularityScore: 62,
    useCases: ["Code generation", "Code review"],
    features: ["Code completion", "Team workspace", "Integrations"],
    alternatives: ["Cursor", "GitHub Copilot", "Replit"]
  },
  {
    name: "Zapier",
    category: "Automation",
    shortDescription:
      "Automation platform with AI-assisted workflows across business apps.",
    longDescription:
      "Zapier connects apps and automates repetitive workflows. Its AI features help users build and improve automations across sales, marketing, support, and operations.",
    websiteUrl: "https://zapier.com",
    pricingType: PricingType.FREEMIUM,
    hasFreePlan: true,
    isVerified: true,
    isFeatured: true,
    popularityScore: 85,
    useCases: ["Workflow automation", "Sales outreach", "Customer support"],
    features: ["Workflow builder", "Integrations", "Templates"],
    alternatives: ["Make", "Copy.ai", "Notion AI"]
  },
  {
    name: "Make",
    category: "Automation",
    shortDescription:
      "Visual automation platform for complex workflows and integrations.",
    longDescription:
      "Make helps users build visual automations across apps and services. It is useful when workflows need branching, transformations, and more control than simple one-step automations.",
    websiteUrl: "https://www.make.com",
    pricingType: PricingType.FREEMIUM,
    hasFreePlan: true,
    isVerified: false,
    isFeatured: false,
    popularityScore: 68,
    useCases: ["Workflow automation", "Customer support"],
    features: ["Workflow builder", "Integrations", "Templates"],
    alternatives: ["Zapier", "Copy.ai", "Replit"]
  },
  {
    name: "Gamma",
    category: "Presentations",
    shortDescription:
      "AI presentation and document creator for polished visual storytelling.",
    longDescription:
      "Gamma helps users create decks, documents, and visual pages from prompts. It is useful for business storytelling, internal docs, and quick polished presentations.",
    websiteUrl: "https://gamma.app",
    pricingType: PricingType.FREEMIUM,
    hasFreePlan: true,
    isVerified: true,
    isFeatured: true,
    popularityScore: 80,
    useCases: ["Presentation creation", "Design assets"],
    features: ["Templates", "Export options", "Brand kit"],
    alternatives: ["Canva", "Tome", "Beautiful.ai"]
  },
  {
    name: "Tome",
    category: "Presentations",
    shortDescription:
      "AI-native storytelling tool for decks, narratives, and visual pages.",
    longDescription:
      "Tome helps create narrative presentations and visual documents. It is useful for early-stage storytelling, pitch drafts, and quickly exploring presentation structure.",
    websiteUrl: "https://tome.app",
    pricingType: PricingType.FREEMIUM,
    hasFreePlan: true,
    isVerified: false,
    isFeatured: false,
    popularityScore: 60,
    useCases: ["Presentation creation", "Design assets"],
    features: ["Templates", "Export options"],
    alternatives: ["Gamma", "Canva", "Beautiful.ai"]
  },
  {
    name: "Beautiful.ai",
    category: "Presentations",
    shortDescription:
      "Presentation software with AI-assisted layouts and design automation.",
    longDescription:
      "Beautiful.ai helps teams create consistent presentations with guided layouts and design automation. It is useful for business decks and repeatable presentation workflows.",
    websiteUrl: "https://www.beautiful.ai",
    pricingType: PricingType.PAID,
    hasFreePlan: false,
    isVerified: false,
    isFeatured: false,
    popularityScore: 58,
    useCases: ["Presentation creation", "Design assets"],
    features: ["Templates", "Brand kit", "Team workspace"],
    alternatives: ["Gamma", "Canva", "Tome"]
  }
];

type ToolSeed = (typeof tools)[number];

async function main() {
  const categoryRecords = new Map<string, string>();
  const businessFunctionRecords = new Map<string, string>();
  const industryRecords = new Map<string, string>();
  const useCaseRecords = new Map<string, string>();
  const opportunityRecords = new Map<string, string>();
  const featureRecords = new Map<string, string>();
  const toolRecords = new Map<string, string>();

  for (const category of categories) {
    const record = await prisma.category.upsert({
      where: { slug: slugify(category.name) },
      update: {
        name: category.name,
        description: category.description,
        metaTitle: `${category.name} AI tools`,
        metaDescription: category.description
      },
      create: {
        name: category.name,
        slug: slugify(category.name),
        description: category.description,
        metaTitle: `${category.name} AI tools`,
        metaDescription: category.description
      }
    });

    categoryRecords.set(category.name, record.id);
  }

  for (const [index, businessFunction] of businessFunctions.entries()) {
    const record = await prisma.businessFunction.upsert({
      where: { slug: slugify(businessFunction.name) },
      update: {
        name: businessFunction.name,
        description: businessFunction.description,
        status: PublishStatus.PUBLISHED,
        sortOrder: index
      },
      create: {
        name: businessFunction.name,
        slug: slugify(businessFunction.name),
        description: businessFunction.description,
        status: PublishStatus.PUBLISHED,
        sortOrder: index
      }
    });

    businessFunctionRecords.set(businessFunction.name, record.id);
  }

  for (const [index, industry] of industries.entries()) {
    const record = await prisma.industry.upsert({
      where: { slug: slugify(industry.name) },
      update: {
        name: industry.name,
        description: industry.description,
        startingPoint: industry.startingPoint,
        cautions: industry.cautions,
        status: PublishStatus.PUBLISHED,
        sortOrder: index,
        metaTitle: `${industry.name} AI roadmap`,
        metaDescription: industry.description
      },
      create: {
        name: industry.name,
        slug: slugify(industry.name),
        description: industry.description,
        startingPoint: industry.startingPoint,
        cautions: industry.cautions,
        status: PublishStatus.PUBLISHED,
        sortOrder: index,
        metaTitle: `${industry.name} AI roadmap`,
        metaDescription: industry.description
      }
    });

    industryRecords.set(industry.name, record.id);
  }

  for (const useCase of useCases) {
    const metadata = useCaseMetadata[useCase];
    const businessFunctionId = metadata
      ? getRecordId(
          businessFunctionRecords,
          metadata.businessFunction,
          "business function"
        )
      : undefined;
    const record = await prisma.useCase.upsert({
      where: { slug: slugify(useCase) },
      update: {
        name: useCase,
        description: metadata?.outcome,
        outcome: metadata?.outcome,
        painPoints: metadata?.painPoints ?? [],
        requiredInputs: metadata?.requiredInputs ?? [],
        successMetrics: metadata?.successMetrics ?? [],
        implementationSteps: metadata?.implementationSteps ?? [],
        effortLevel: metadata?.effortLevel ?? EffortLevel.MEDIUM,
        riskLevel: metadata?.riskLevel ?? RiskLevel.MEDIUM,
        timeToValue: metadata?.timeToValue,
        businessFunctionId
      },
      create: {
        name: useCase,
        slug: slugify(useCase),
        description: metadata?.outcome,
        outcome: metadata?.outcome,
        painPoints: metadata?.painPoints ?? [],
        requiredInputs: metadata?.requiredInputs ?? [],
        successMetrics: metadata?.successMetrics ?? [],
        implementationSteps: metadata?.implementationSteps ?? [],
        effortLevel: metadata?.effortLevel ?? EffortLevel.MEDIUM,
        riskLevel: metadata?.riskLevel ?? RiskLevel.MEDIUM,
        timeToValue: metadata?.timeToValue,
        businessFunctionId
      }
    });

    useCaseRecords.set(useCase, record.id);
  }

  for (const [index, opportunity] of opportunities.entries()) {
    const record = await prisma.opportunity.upsert({
      where: { slug: slugify(opportunity.name) },
      update: {
        name: opportunity.name,
        description: opportunity.description,
        painPoint: opportunity.painPoint,
        expectedBenefit: opportunity.expectedBenefit,
        startingPoint: opportunity.startingPoint,
        effortLevel: opportunity.effortLevel,
        riskLevel: opportunity.riskLevel,
        timeToValue: opportunity.timeToValue,
        successMetrics: opportunity.successMetrics,
        status: PublishStatus.PUBLISHED,
        sortOrder: index,
        businessFunctionId: getRecordId(
          businessFunctionRecords,
          opportunity.businessFunction,
          "business function"
        ),
        metaTitle: `${opportunity.name} AI opportunity`,
        metaDescription: opportunity.description
      },
      create: {
        name: opportunity.name,
        slug: slugify(opportunity.name),
        description: opportunity.description,
        painPoint: opportunity.painPoint,
        expectedBenefit: opportunity.expectedBenefit,
        startingPoint: opportunity.startingPoint,
        effortLevel: opportunity.effortLevel,
        riskLevel: opportunity.riskLevel,
        timeToValue: opportunity.timeToValue,
        successMetrics: opportunity.successMetrics,
        status: PublishStatus.PUBLISHED,
        sortOrder: index,
        businessFunctionId: getRecordId(
          businessFunctionRecords,
          opportunity.businessFunction,
          "business function"
        ),
        metaTitle: `${opportunity.name} AI opportunity`,
        metaDescription: opportunity.description
      }
    });

    opportunityRecords.set(opportunity.name, record.id);

    await prisma.industryOpportunity.deleteMany({
      where: {
        opportunityId: record.id
      }
    });

    if (opportunity.industries.length > 0) {
      await prisma.industryOpportunity.createMany({
        data: opportunity.industries.map((industryName, priority) => ({
          industryId: getRecordId(industryRecords, industryName, "industry"),
          opportunityId: record.id,
          priority
        })),
        skipDuplicates: true
      });
    }

    await prisma.opportunityUseCase.deleteMany({
      where: {
        opportunityId: record.id
      }
    });

    if (opportunity.useCases.length > 0) {
      await prisma.opportunityUseCase.createMany({
        data: opportunity.useCases.map((useCase, priority) => ({
          opportunityId: record.id,
          useCaseId: getRecordId(useCaseRecords, useCase, "use case"),
          priority
        })),
        skipDuplicates: true
      });
    }
  }

  for (const feature of features) {
    const record = await prisma.feature.upsert({
      where: { slug: slugify(feature) },
      update: {
        name: feature
      },
      create: {
        name: feature,
        slug: slugify(feature)
      }
    });

    featureRecords.set(feature, record.id);
  }

  for (const tool of tools) {
    const record = await upsertTool(tool, categoryRecords);
    toolRecords.set(tool.name, record.id);

    await prisma.toolUseCase.deleteMany({
      where: {
        toolId: record.id
      }
    });

    await prisma.toolFeature.deleteMany({
      where: {
        toolId: record.id
      }
    });

    await prisma.toolUseCase.createMany({
      data: tool.useCases.map((useCase) => ({
        toolId: record.id,
        useCaseId: getRecordId(useCaseRecords, useCase, "use case"),
        fitScore: tool.isFeatured ? 86 : 74,
        recommendationNote: `${tool.name} is mapped to ${useCase.toLowerCase()} based on current curated use-case data.`,
        bestFor: tool.hasFreePlan
          ? "Teams that want to pilot this use case before committing budget."
          : "Teams with a clear workflow and budget for a paid tool.",
        limitations: tool.isVerified
          ? "Validate fit against your workflow before rollout."
          : "Needs additional editorial verification before high-confidence adoption.",
        implementationNote:
          "Start with one narrow workflow, define a review point, and measure time saved.",
        pricingSuitability: tool.hasFreePlan
          ? "Good fit for early experiments."
          : "Best after the workflow value is validated."
      })),
      skipDuplicates: true
    });

    await prisma.toolFeature.createMany({
      data: tool.features.map((feature) => ({
        toolId: record.id,
        featureId: getRecordId(featureRecords, feature, "feature")
      })),
      skipDuplicates: true
    });
  }

  for (const tool of tools) {
    const toolId = getRecordId(toolRecords, tool.name, "tool");

    await prisma.toolAlternative.deleteMany({
      where: {
        toolId
      }
    });

    await prisma.toolAlternative.createMany({
      data: tool.alternatives
        .filter((alternative) => toolRecords.has(alternative))
        .map((alternative) => ({
          toolId,
          alternativeToolId: getRecordId(toolRecords, alternative, "tool")
        })),
      skipDuplicates: true
    });
  }
}

async function upsertTool(
  tool: ToolSeed,
  categoryRecords: Map<string, string>
) {
  const categoryId = getRecordId(categoryRecords, tool.category, "category");
  const slug = slugify(tool.name);
  const metaTitle = `${tool.name} review, pricing, use cases, and alternatives`;

  return prisma.tool.upsert({
    where: { slug },
    update: {
      name: tool.name,
      shortDescription: tool.shortDescription,
      longDescription: tool.longDescription,
      websiteUrl: tool.websiteUrl,
      categoryId,
      pricingType: tool.pricingType,
      hasFreePlan: tool.hasFreePlan,
      isVerified: tool.isVerified,
      isFeatured: tool.isFeatured,
      popularityScore: tool.popularityScore,
      status: PublishStatus.PUBLISHED,
      publishedAt: new Date(),
      metaTitle,
      metaDescription: tool.shortDescription
    },
    create: {
      name: tool.name,
      slug,
      shortDescription: tool.shortDescription,
      longDescription: tool.longDescription,
      websiteUrl: tool.websiteUrl,
      categoryId,
      pricingType: tool.pricingType,
      hasFreePlan: tool.hasFreePlan,
      isVerified: tool.isVerified,
      isFeatured: tool.isFeatured,
      popularityScore: tool.popularityScore,
      status: PublishStatus.PUBLISHED,
      publishedAt: new Date(),
      metaTitle,
      metaDescription: tool.shortDescription
    }
  });
}

function getRecordId(
  records: Map<string, string>,
  key: string,
  recordType: string
) {
  const id = records.get(key);

  if (!id) {
    throw new Error(`Missing ${recordType}: ${key}`);
  }

  return id;
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
