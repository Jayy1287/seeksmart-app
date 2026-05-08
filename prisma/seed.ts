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
  },
  {
    name: "Legal",
    description:
      "AI tools for legal research, contract review, diligence, compliance, and professional-services workflows."
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
  "App prototyping",
  "Contract review",
  "Legal research",
  "Market intelligence",
  "Research synthesis",
  "Enterprise knowledge search",
  "Learning and enablement",
  "Internal tool generation",
  "BI dashboard analysis",
  "Executive reporting",
  "AI customer service agents",
  "Governed brand content",
  "Sales and service agents",
  "Compliance evidence collection",
  "Diligence document analysis"
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
  "Ticket routing",
  "Contract analysis",
  "Legal research",
  "Clause detection",
  "Market intelligence",
  "Literature review",
  "Evidence synthesis",
  "Enterprise search",
  "Learning paths",
  "Data warehouse connection",
  "BI dashboards",
  "Semantic layer",
  "Brand governance",
  "Customer service agents",
  "Voice support",
  "Governance controls",
  "Agent builder",
  "Diligence workflows"
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
  },
  "Contract review": {
    businessFunction: "Legal and Compliance",
    outcome: "Faster contract review, clause comparison, and obligation tracking.",
    painPoints: ["Contract bottlenecks", "Manual clause review", "Missed obligations"],
    requiredInputs: ["Contract samples", "Playbook clauses", "Escalation rules"],
    successMetrics: ["Review turnaround", "Issues caught", "Attorney review time"],
    implementationSteps: [
      "Define approved clause positions",
      "Review a small contract sample",
      "Compare AI findings with expert review"
    ],
    effortLevel: EffortLevel.MEDIUM,
    riskLevel: RiskLevel.HIGH,
    timeToValue: "3-6 weeks"
  },
  "Legal research": {
    businessFunction: "Legal and Compliance",
    outcome: "Faster issue spotting and source-grounded legal research preparation.",
    painPoints: ["Slow legal research", "Scattered precedent", "Manual source review"],
    requiredInputs: ["Research question", "Jurisdiction", "Citation standards"],
    successMetrics: ["Research turnaround", "Source quality", "Review corrections"],
    implementationSteps: [
      "Start with non-client research questions",
      "Validate sources and citations",
      "Require qualified legal review"
    ],
    effortLevel: EffortLevel.MEDIUM,
    riskLevel: RiskLevel.HIGH,
    timeToValue: "3-6 weeks"
  },
  "Market intelligence": {
    businessFunction: "Data and Analytics",
    outcome: "Clearer market, competitor, company, and industry intelligence.",
    painPoints: ["Slow research", "Fragmented market signals", "Hard-to-compare sources"],
    requiredInputs: ["Research scope", "Trusted source list", "Decision question"],
    successMetrics: ["Research time", "Insight reuse", "Decision confidence"],
    implementationSteps: [
      "Define the decision the research should support",
      "Set source quality rules",
      "Turn recurring research into a template"
    ],
    effortLevel: EffortLevel.MEDIUM,
    riskLevel: RiskLevel.MEDIUM,
    timeToValue: "2-4 weeks"
  },
  "Research synthesis": {
    businessFunction: "Knowledge Management",
    outcome: "Evidence-backed summaries from papers, reports, interviews, and documents.",
    painPoints: ["Slow literature review", "Too many documents", "Unclear evidence quality"],
    requiredInputs: ["Research question", "Document set", "Inclusion criteria"],
    successMetrics: ["Synthesis time", "Source coverage", "Review confidence"],
    implementationSteps: [
      "Define the question and source criteria",
      "Compare outputs against manually reviewed sources",
      "Document confidence and evidence gaps"
    ],
    effortLevel: EffortLevel.MEDIUM,
    riskLevel: RiskLevel.MEDIUM,
    timeToValue: "2-5 weeks"
  },
  "Enterprise knowledge search": {
    businessFunction: "Knowledge Management",
    outcome: "Permission-aware answers across company documents, apps, and workflows.",
    painPoints: ["Data silos", "Repeated internal questions", "Hard-to-find policies"],
    requiredInputs: ["Source systems", "Access model", "Answer quality rubric"],
    successMetrics: ["Answer time", "Search success", "Deflected questions"],
    implementationSteps: [
      "Choose high-value source systems",
      "Validate permissions and citations",
      "Pilot frequent internal questions"
    ],
    effortLevel: EffortLevel.MEDIUM,
    riskLevel: RiskLevel.MEDIUM,
    timeToValue: "4-8 weeks"
  },
  "Learning and enablement": {
    businessFunction: "Human Resources",
    outcome: "Faster employee training, enablement, onboarding, and knowledge checks.",
    painPoints: ["Outdated training", "Slow enablement", "Repeated onboarding questions"],
    requiredInputs: ["Source material", "Audience profile", "Learning outcomes"],
    successMetrics: ["Ramp time", "Course completion", "Learner feedback"],
    implementationSteps: [
      "Define one enablement outcome",
      "Create a small lesson or assistant",
      "Review accuracy with subject-matter experts"
    ],
    effortLevel: EffortLevel.MEDIUM,
    riskLevel: RiskLevel.MEDIUM,
    timeToValue: "3-6 weeks"
  },
  "Internal tool generation": {
    businessFunction: "Product and Engineering",
    outcome: "Faster internal apps, admin panels, and workflow tools.",
    painPoints: ["Manual operations", "Backlog delays", "Spreadsheet workarounds"],
    requiredInputs: ["Workflow map", "Data model", "Permissions"],
    successMetrics: ["App delivery time", "Manual steps removed", "User adoption"],
    implementationSteps: [
      "Pick a low-risk internal workflow",
      "Generate or configure the first version",
      "Review access and data writes before rollout"
    ],
    effortLevel: EffortLevel.MEDIUM,
    riskLevel: RiskLevel.MEDIUM,
    timeToValue: "2-5 weeks"
  },
  "BI dashboard analysis": {
    businessFunction: "Data and Analytics",
    outcome: "Faster dashboard exploration, metric explanation, and data storytelling.",
    painPoints: ["Manual reporting", "Slow dashboard interpretation", "Metric confusion"],
    requiredInputs: ["Metric definitions", "Dashboard access", "Trusted data model"],
    successMetrics: ["Analysis time", "Question resolution", "Report adoption"],
    implementationSteps: [
      "Choose one recurring dashboard",
      "Validate metric definitions",
      "Compare AI explanations with analyst review"
    ],
    effortLevel: EffortLevel.MEDIUM,
    riskLevel: RiskLevel.MEDIUM,
    timeToValue: "2-4 weeks"
  },
  "Executive reporting": {
    businessFunction: "Data and Analytics",
    outcome: "Clearer narratives from operating metrics, KPIs, and leadership updates.",
    painPoints: ["Manual reporting", "Slow executive updates", "Inconsistent narratives"],
    requiredInputs: ["KPI definitions", "Report template", "Narrative owner"],
    successMetrics: ["Reporting time", "Stakeholder clarity", "Decision speed"],
    implementationSteps: [
      "Standardize one report format",
      "Generate draft commentary",
      "Validate numbers and recommendations"
    ],
    effortLevel: EffortLevel.LOW,
    riskLevel: RiskLevel.MEDIUM,
    timeToValue: "1-3 weeks"
  },
  "AI customer service agents": {
    businessFunction: "Customer Support",
    outcome: "Automated customer answers with escalation, policy, and quality controls.",
    painPoints: ["Ticket backlog", "Slow response", "Repeated customer questions"],
    requiredInputs: ["Help content", "Conversation history", "Escalation policy"],
    successMetrics: ["Resolution rate", "Deflection rate", "CSAT"],
    implementationSteps: [
      "Start with low-risk topics",
      "Define handoff and fallback rules",
      "Audit conversations before expanding"
    ],
    effortLevel: EffortLevel.HIGH,
    riskLevel: RiskLevel.HIGH,
    timeToValue: "4-8 weeks"
  },
  "Governed brand content": {
    businessFunction: "Marketing",
    outcome: "Brand-safe campaign, product, and lifecycle content at enterprise scale.",
    painPoints: ["Brand drift", "Slow campaign production", "Approval bottlenecks"],
    requiredInputs: ["Brand guidelines", "Approved claims", "Review workflow"],
    successMetrics: ["Campaign turnaround", "Approval rate", "Brand compliance"],
    implementationSteps: [
      "Codify voice, claims, and exclusions",
      "Generate content for one campaign",
      "Review against brand and legal standards"
    ],
    effortLevel: EffortLevel.MEDIUM,
    riskLevel: RiskLevel.MEDIUM,
    timeToValue: "2-5 weeks"
  },
  "Sales and service agents": {
    businessFunction: "Sales",
    outcome: "Agent-assisted CRM, account planning, support handoffs, and revenue workflows.",
    painPoints: ["Manual CRM work", "Slow follow-up", "Disconnected customer context"],
    requiredInputs: ["CRM schema", "Account rules", "Approval policy"],
    successMetrics: ["Follow-up speed", "CRM completeness", "Pipeline progress"],
    implementationSteps: [
      "Choose one sales or service job",
      "Connect only approved CRM fields",
      "Review agent recommendations before writes"
    ],
    effortLevel: EffortLevel.HIGH,
    riskLevel: RiskLevel.HIGH,
    timeToValue: "4-8 weeks"
  },
  "Compliance evidence collection": {
    businessFunction: "Legal and Compliance",
    outcome: "Faster collection, summarization, and review of audit and control evidence.",
    painPoints: ["Compliance evidence gaps", "Manual audit prep", "Scattered policies"],
    requiredInputs: ["Control list", "Evidence sources", "Review owner"],
    successMetrics: ["Evidence collection time", "Control coverage", "Review corrections"],
    implementationSteps: [
      "Map one control family",
      "Collect representative evidence",
      "Review outputs with compliance owners"
    ],
    effortLevel: EffortLevel.HIGH,
    riskLevel: RiskLevel.HIGH,
    timeToValue: "4-8 weeks"
  },
  "Diligence document analysis": {
    businessFunction: "Finance",
    outcome: "Faster review and synthesis of data rooms, filings, contracts, and reports.",
    painPoints: ["Large document sets", "Slow diligence review", "Missed risk signals"],
    requiredInputs: ["Document collection", "Issue checklist", "Source citation rules"],
    successMetrics: ["Review time", "Issues found", "Source traceability"],
    implementationSteps: [
      "Define a narrow diligence question",
      "Upload a reviewed document subset",
      "Compare findings against expert review"
    ],
    effortLevel: EffortLevel.HIGH,
    riskLevel: RiskLevel.HIGH,
    timeToValue: "4-8 weeks"
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
  },
  {
    name: "Insurance operations",
    description:
      "Carriers, brokers, and claims teams improving document review, support, compliance evidence, and renewal workflows.",
    startingPoint:
      "Start with internal document summaries, policy FAQs, or claims-support workflows before automating decisions.",
    cautions:
      "Keep underwriting, claim decisions, and regulated customer communication under expert review."
  },
  {
    name: "Pharmaceutical and life sciences",
    description:
      "Research, medical affairs, regulatory, and commercial teams synthesizing evidence, documents, and training content.",
    startingPoint:
      "Start with literature synthesis, internal enablement, or evidence organization before regulated external claims.",
    cautions:
      "Review scientific accuracy, approved claims, patient data boundaries, and regulatory requirements."
  },
  {
    name: "Professional services",
    description:
      "Accounting, advisory, consulting, and legal-adjacent teams handling client research, reports, diligence, and knowledge reuse.",
    startingPoint:
      "Start with reviewed client deliverables, market scans, and reusable knowledge assets.",
    cautions:
      "Protect client confidentiality and keep professional judgment accountable to a named reviewer."
  },
  {
    name: "Public sector",
    description:
      "Government and civic teams improving constituent support, policy research, documents, reporting, and internal knowledge access.",
    startingPoint:
      "Start with low-risk public information workflows and internal research support.",
    cautions:
      "Review procurement, accessibility, privacy, public-records, and human oversight requirements before rollout."
  },
  {
    name: "Private equity and investing",
    description:
      "Investment teams speeding market research, company diligence, data-room review, portfolio reporting, and thesis development.",
    startingPoint:
      "Start with diligence document synthesis and market-intelligence briefs that analysts can verify.",
    cautions:
      "Treat non-public company data and investment recommendations as high-risk and review every output."
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
  },
  {
    name: "Automate prospect research",
    businessFunction: "Sales",
    description:
      "Research accounts, enrich contacts, and draft relevant outbound messages from approved signals.",
    painPoint: "Sales teams spend too much time researching accounts before outreach.",
    expectedBenefit: "Better account context, faster prospecting, and more relevant messages.",
    startingPoint: "Define one ideal customer segment and the signals that qualify an account.",
    effortLevel: EffortLevel.MEDIUM,
    riskLevel: RiskLevel.MEDIUM,
    timeToValue: "2-4 weeks",
    successMetrics: ["Research time", "Data completeness", "Reply rate"],
    industries: ["SaaS teams", "Consulting and agencies", "Nonprofits"],
    useCases: ["Lead enrichment", "Sales email personalization", "CRM update automation"]
  },
  {
    name: "Create an internal answer assistant",
    businessFunction: "Knowledge Management",
    description:
      "Use approved company documents and apps to answer repeated internal questions with sources.",
    painPoint: "Employees waste time searching across docs, chat, tickets, and project tools.",
    expectedBenefit: "Faster internal answers and less repeated interruption across teams.",
    startingPoint: "Start with a narrow document collection and frequent internal questions.",
    effortLevel: EffortLevel.MEDIUM,
    riskLevel: RiskLevel.MEDIUM,
    timeToValue: "3-6 weeks",
    successMetrics: ["Answer time", "Search success", "Repeated questions"],
    industries: ["SaaS teams", "Consulting and agencies", "Manufacturing and logistics"],
    useCases: ["Internal knowledge search", "Knowledge management", "General assistant"]
  },
  {
    name: "Analyze recurring business reports",
    businessFunction: "Data and Analytics",
    description:
      "Turn spreadsheets, exports, and recurring reports into summaries, charts, and decision notes.",
    painPoint: "Teams spend too long interpreting spreadsheets and rewriting weekly updates.",
    expectedBenefit: "Faster analysis and more consistent operational decisions.",
    startingPoint: "Choose one recurring spreadsheet or export with known definitions.",
    effortLevel: EffortLevel.MEDIUM,
    riskLevel: RiskLevel.MEDIUM,
    timeToValue: "1-3 weeks",
    successMetrics: ["Analysis time", "Report turnaround", "Decision speed"],
    industries: ["Finance and accounting", "Manufacturing and logistics", "Retail and hospitality"],
    useCases: ["Data analysis", "Spreadsheet automation", "Document extraction"]
  },
  {
    name: "Automate document intake",
    businessFunction: "Operations",
    description:
      "Extract fields from forms, invoices, contracts, and PDFs before routing them to the right workflow.",
    painPoint: "Manual document intake creates delays, rekeying, and routing mistakes.",
    expectedBenefit: "Faster processing with clearer exception handling.",
    startingPoint: "Pilot one document type with a field checklist and human verification.",
    effortLevel: EffortLevel.MEDIUM,
    riskLevel: RiskLevel.HIGH,
    timeToValue: "3-6 weeks",
    successMetrics: ["Processing time", "Extraction accuracy", "Manual corrections"],
    industries: ["Finance and accounting", "Legal services", "Healthcare operations"],
    useCases: ["Document extraction", "Workflow automation", "Data analysis"]
  },
  {
    name: "Prototype apps and internal tools faster",
    businessFunction: "Product and Engineering",
    description:
      "Generate early UI, dashboards, landing pages, and internal tools for faster validation.",
    painPoint: "Teams wait too long to see and test a working prototype.",
    expectedBenefit: "Faster idea validation and better product conversations.",
    startingPoint: "Start with one low-risk internal workflow or landing-page concept.",
    effortLevel: EffortLevel.MEDIUM,
    riskLevel: RiskLevel.MEDIUM,
    timeToValue: "1-3 weeks",
    successMetrics: ["Prototype turnaround", "Iteration speed", "Stakeholder feedback"],
    industries: ["SaaS teams", "Consulting and agencies", "Media and creators"],
    useCases: ["App prototyping", "Code generation", "Design assets"]
  },
  {
    name: "Build a content repurposing engine",
    businessFunction: "Marketing",
    description:
      "Turn long-form source material into social posts, clips, visuals, newsletters, and summaries.",
    painPoint: "Teams create one asset at a time and fail to reuse valuable source material.",
    expectedBenefit: "More consistent publishing from the same expert input.",
    startingPoint: "Pick one finished webinar, article, podcast, or report as a source asset.",
    effortLevel: EffortLevel.LOW,
    riskLevel: RiskLevel.MEDIUM,
    timeToValue: "1-2 weeks",
    successMetrics: ["Assets repurposed", "Publishing frequency", "Review time"],
    industries: ["Media and creators", "Consulting and agencies", "Nonprofits"],
    useCases: ["Social media content", "Video generation", "Copywriting"]
  },
  {
    name: "Review contracts and obligations",
    businessFunction: "Legal and Compliance",
    description:
      "Use AI to summarize agreements, compare clauses against playbooks, and flag obligations for expert review.",
    painPoint: "Contract review and obligation tracking often depend on slow manual reading.",
    expectedBenefit: "Faster review cycles, clearer risk triage, and fewer missed obligations.",
    startingPoint: "Choose one repeat contract type and create an approved clause checklist.",
    effortLevel: EffortLevel.MEDIUM,
    riskLevel: RiskLevel.HIGH,
    timeToValue: "3-6 weeks",
    successMetrics: ["Review turnaround", "Issues flagged", "Review corrections"],
    industries: ["Legal services", "Professional services", "Insurance operations"],
    useCases: ["Contract review", "Legal research", "Compliance evidence collection"]
  },
  {
    name: "Accelerate legal research preparation",
    businessFunction: "Legal and Compliance",
    description:
      "Create source-grounded legal research drafts, issue summaries, and review packets for qualified legal teams.",
    painPoint: "Legal research takes time to scope, source, and summarize before attorney review.",
    expectedBenefit: "Faster issue preparation while preserving expert accountability.",
    startingPoint: "Pilot with non-client research questions and citation review.",
    effortLevel: EffortLevel.MEDIUM,
    riskLevel: RiskLevel.HIGH,
    timeToValue: "3-6 weeks",
    successMetrics: ["Research turnaround", "Source quality", "Attorney review time"],
    industries: ["Legal services", "Professional services", "Public sector"],
    useCases: ["Legal research", "Research synthesis", "Contract review"]
  },
  {
    name: "Synthesize market and competitor intelligence",
    businessFunction: "Data and Analytics",
    description:
      "Turn company, competitor, industry, and market sources into decision-ready briefs.",
    painPoint: "Market research is scattered across reports, calls, filings, web sources, and internal notes.",
    expectedBenefit: "Faster strategy, sales, investment, and product decisions.",
    startingPoint: "Define one market question and the sources that count as trusted.",
    effortLevel: EffortLevel.MEDIUM,
    riskLevel: RiskLevel.MEDIUM,
    timeToValue: "2-4 weeks",
    successMetrics: ["Research cycle time", "Source coverage", "Decision confidence"],
    industries: ["Private equity and investing", "SaaS teams", "Professional services"],
    useCases: ["Market intelligence", "Web research", "Research synthesis"]
  },
  {
    name: "Run evidence-backed literature reviews",
    businessFunction: "Knowledge Management",
    description:
      "Screen, summarize, and compare research papers or evidence sources against a clear review question.",
    painPoint: "Literature reviews and evidence checks are slow, repetitive, and hard to keep current.",
    expectedBenefit: "Faster synthesis with clearer evidence gaps and source traceability.",
    startingPoint: "Define inclusion criteria and review a small paper set manually first.",
    effortLevel: EffortLevel.MEDIUM,
    riskLevel: RiskLevel.MEDIUM,
    timeToValue: "2-5 weeks",
    successMetrics: ["Papers screened", "Synthesis time", "Reviewer confidence"],
    industries: ["Pharmaceutical and life sciences", "Education and training", "Healthcare operations"],
    useCases: ["Research synthesis", "Legal research", "Market intelligence"]
  },
  {
    name: "Create a permission-aware knowledge assistant",
    businessFunction: "Knowledge Management",
    description:
      "Answer employee questions across company apps, docs, tickets, and policies while respecting source permissions.",
    painPoint: "Important knowledge is spread across tools and repeated questions interrupt specialists.",
    expectedBenefit: "Faster answers, better onboarding, and less repeated internal support.",
    startingPoint: "Connect a narrow set of trusted sources and test the top 25 internal questions.",
    effortLevel: EffortLevel.MEDIUM,
    riskLevel: RiskLevel.MEDIUM,
    timeToValue: "4-8 weeks",
    successMetrics: ["Answer time", "Search success", "Repeated questions reduced"],
    industries: ["SaaS teams", "Professional services", "Public sector"],
    useCases: ["Enterprise knowledge search", "Internal knowledge search", "Knowledge management"]
  },
  {
    name: "Improve employee learning and enablement",
    businessFunction: "Human Resources",
    description:
      "Turn internal expertise into role-based learning, onboarding, sales enablement, and knowledge checks.",
    painPoint: "Training content falls behind the business and new hires rely on repeated explanations.",
    expectedBenefit: "Shorter ramp time and more consistent internal knowledge transfer.",
    startingPoint: "Choose one role or team journey and define the learner outcome.",
    effortLevel: EffortLevel.MEDIUM,
    riskLevel: RiskLevel.MEDIUM,
    timeToValue: "3-6 weeks",
    successMetrics: ["Ramp time", "Completion rate", "Learner feedback"],
    industries: ["Education and training", "SaaS teams", "Pharmaceutical and life sciences"],
    useCases: ["Learning and enablement", "Training content", "Enterprise knowledge search"]
  },
  {
    name: "Build internal operational apps",
    businessFunction: "Product and Engineering",
    description:
      "Create internal tools, admin workflows, dashboards, and approval apps from structured workflow requirements.",
    painPoint: "Internal teams rely on spreadsheets and manual work because engineering capacity is limited.",
    expectedBenefit: "Faster internal tooling and fewer manual handoffs.",
    startingPoint: "Pick one internal workflow with clear permissions and low customer impact.",
    effortLevel: EffortLevel.MEDIUM,
    riskLevel: RiskLevel.MEDIUM,
    timeToValue: "2-5 weeks",
    successMetrics: ["Manual steps removed", "App delivery time", "User adoption"],
    industries: ["SaaS teams", "Manufacturing and logistics", "Professional services"],
    useCases: ["Internal tool generation", "App prototyping", "Workflow automation"]
  },
  {
    name: "Create executive BI narratives",
    businessFunction: "Data and Analytics",
    description:
      "Explain dashboard movement, metric drivers, and business performance in clear executive-ready language.",
    painPoint: "Analysts spend too much time rewriting dashboard insights and leadership updates.",
    expectedBenefit: "Faster reporting with more consistent metric interpretation.",
    startingPoint: "Choose one recurring KPI report with trusted definitions.",
    effortLevel: EffortLevel.MEDIUM,
    riskLevel: RiskLevel.MEDIUM,
    timeToValue: "2-4 weeks",
    successMetrics: ["Reporting time", "Questions resolved", "Decision speed"],
    industries: ["Finance and accounting", "Private equity and investing", "Retail and hospitality"],
    useCases: ["BI dashboard analysis", "Executive reporting", "Data analysis"]
  },
  {
    name: "Launch a supervised AI service agent",
    businessFunction: "Customer Support",
    description:
      "Deploy an AI customer service agent for approved topics with escalation, QA, and human handoff rules.",
    painPoint: "Support teams cannot keep up with repeated customer conversations at consistent quality.",
    expectedBenefit: "Higher resolution coverage, faster replies, and better support scalability.",
    startingPoint: "Select low-risk intents with strong help content and human fallback.",
    effortLevel: EffortLevel.HIGH,
    riskLevel: RiskLevel.HIGH,
    timeToValue: "4-8 weeks",
    successMetrics: ["Resolution rate", "Deflection rate", "CSAT"],
    industries: ["Ecommerce", "SaaS teams", "Insurance operations"],
    useCases: ["AI customer service agents", "Help desk automation", "Customer support"]
  },
  {
    name: "Generate governed brand content",
    businessFunction: "Marketing",
    description:
      "Scale campaign, product, and lifecycle content while enforcing voice, claims, audience, and approval rules.",
    painPoint: "Content teams need more output but cannot afford brand drift or unapproved claims.",
    expectedBenefit: "Faster campaign production with clearer governance.",
    startingPoint: "Codify voice, approved claims, banned claims, and review owners.",
    effortLevel: EffortLevel.MEDIUM,
    riskLevel: RiskLevel.MEDIUM,
    timeToValue: "2-5 weeks",
    successMetrics: ["Campaign turnaround", "Approval rate", "Brand corrections"],
    industries: ["SaaS teams", "Retail and hospitality", "Pharmaceutical and life sciences"],
    useCases: ["Governed brand content", "Copywriting", "Social media content"]
  },
  {
    name: "Improve sales and service agent workflows",
    businessFunction: "Sales",
    description:
      "Use AI agents to summarize account context, update CRM fields, recommend next actions, and coordinate service handoffs.",
    painPoint: "Revenue teams lose time to CRM administration and disconnected customer context.",
    expectedBenefit: "Cleaner CRM data, faster follow-up, and more consistent account execution.",
    startingPoint: "Start with one supervised account-planning or CRM update workflow.",
    effortLevel: EffortLevel.HIGH,
    riskLevel: RiskLevel.HIGH,
    timeToValue: "4-8 weeks",
    successMetrics: ["CRM completeness", "Follow-up speed", "Pipeline movement"],
    industries: ["SaaS teams", "Professional services", "Insurance operations"],
    useCases: ["Sales and service agents", "CRM update automation", "Sales outreach"]
  },
  {
    name: "Analyze diligence document sets",
    businessFunction: "Finance",
    description:
      "Summarize data rooms, contracts, filings, interviews, and research material with citations and issue checklists.",
    painPoint: "Diligence teams must read large document sets quickly without missing important issues.",
    expectedBenefit: "Faster review, better source traceability, and earlier issue spotting.",
    startingPoint: "Define one diligence checklist and test on a reviewed document subset.",
    effortLevel: EffortLevel.HIGH,
    riskLevel: RiskLevel.HIGH,
    timeToValue: "4-8 weeks",
    successMetrics: ["Review time", "Issues identified", "Source traceability"],
    industries: ["Private equity and investing", "Finance and accounting", "Legal services"],
    useCases: ["Diligence document analysis", "Research synthesis", "Document extraction"]
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
  },
  {
    name: "Microsoft 365 Copilot",
    category: "Productivity",
    shortDescription:
      "AI assistant embedded across Microsoft 365 apps for documents, email, meetings, and work data.",
    longDescription:
      "Microsoft 365 Copilot is best for organizations already working in Word, Excel, PowerPoint, Outlook, Teams, and Microsoft Graph-connected data. It supports drafting, summarizing, meeting follow-up, spreadsheet help, and enterprise productivity workflows.",
    websiteUrl: "https://www.microsoft.com/en-us/microsoft-365/copilot",
    pricingType: PricingType.PAID,
    hasFreePlan: false,
    isVerified: true,
    isFeatured: true,
    popularityScore: 93,
    useCases: ["General assistant", "Meeting summaries", "Spreadsheet automation"],
    features: ["Chat interface", "Document upload", "Team workspace", "Integrations"],
    alternatives: ["ChatGPT", "Gemini", "Notion AI"]
  },
  {
    name: "NotebookLM",
    category: "Research",
    shortDescription:
      "Google source-grounded research and note assistant for uploaded documents and links.",
    longDescription:
      "NotebookLM helps users explore a defined set of sources, ask questions, create summaries, and turn notes into study or research outputs. It is useful when teams need grounded synthesis from selected documents rather than open-ended web search.",
    websiteUrl: "https://notebooklm.google.com",
    pricingType: PricingType.FREEMIUM,
    hasFreePlan: true,
    isVerified: true,
    isFeatured: true,
    popularityScore: 87,
    useCases: ["Web research", "Internal knowledge search", "Training content"],
    features: ["Source grounding", "Document upload", "Citations", "Export options"],
    alternatives: ["Perplexity", "Glean", "Notion AI"]
  },
  {
    name: "Glean",
    category: "Knowledge Management",
    shortDescription:
      "Enterprise AI search and workplace assistant across company apps and knowledge.",
    longDescription:
      "Glean is built for enterprise knowledge discovery across connected workplace systems. It is a strong fit for teams that need permission-aware internal search, source-grounded answers, and company-wide knowledge assistance.",
    websiteUrl: "https://www.glean.com",
    pricingType: PricingType.PAID,
    hasFreePlan: false,
    isVerified: true,
    isFeatured: true,
    popularityScore: 86,
    useCases: ["Internal knowledge search", "Knowledge management", "Customer support"],
    features: ["Internal search", "Source grounding", "Integrations", "Team workspace"],
    alternatives: ["Notion AI", "NotebookLM", "Guru"]
  },
  {
    name: "Granola",
    category: "Meetings",
    shortDescription:
      "AI meeting notebook that turns personal notes and transcripts into polished summaries.",
    longDescription:
      "Granola is useful for people who want lightweight meeting notes without a heavy bot experience. It combines user notes with transcript context to create structured summaries and follow-ups.",
    websiteUrl: "https://www.granola.ai",
    pricingType: PricingType.FREEMIUM,
    hasFreePlan: true,
    isVerified: false,
    isFeatured: true,
    popularityScore: 78,
    useCases: ["Meeting summaries", "Knowledge management", "CRM update automation"],
    features: ["Meeting notes", "Transcription", "Export options"],
    alternatives: ["Fathom", "Otter.ai", "Fireflies.ai"]
  },
  {
    name: "tl;dv",
    category: "Meetings",
    shortDescription:
      "AI meeting recorder for summaries, highlights, coaching, and searchable calls.",
    longDescription:
      "tl;dv records and summarizes meetings, helping sales, customer, recruiting, and product teams review calls and extract follow-ups. It is a practical choice for teams that need meeting libraries and structured call insights.",
    websiteUrl: "https://tldv.io",
    pricingType: PricingType.FREEMIUM,
    hasFreePlan: true,
    isVerified: false,
    isFeatured: false,
    popularityScore: 70,
    useCases: ["Meeting summaries", "Sales outreach", "Customer feedback analysis"],
    features: ["Meeting notes", "Transcription", "Integrations", "Team workspace"],
    alternatives: ["Fireflies.ai", "Fathom", "Otter.ai"]
  },
  {
    name: "Intercom Fin",
    category: "Customer Support",
    shortDescription:
      "AI customer service agent for answering support questions and handing off to teams.",
    longDescription:
      "Intercom Fin is designed for customer support teams that want an AI agent connected to help content and support workflows. It is best for companies with a clear help center, escalation rules, and a human support process.",
    websiteUrl: "https://www.intercom.com/fin",
    pricingType: PricingType.PAID,
    hasFreePlan: false,
    isVerified: true,
    isFeatured: true,
    popularityScore: 88,
    useCases: ["Help desk automation", "Customer support", "Knowledge management"],
    features: ["AI agents", "Human handoff", "Ticket routing", "Integrations"],
    alternatives: ["Zendesk AI", "Gorgias AI Agent", "Ada"]
  },
  {
    name: "Zendesk AI",
    category: "Customer Support",
    shortDescription:
      "AI capabilities for Zendesk service workflows, agents, bots, and support operations.",
    longDescription:
      "Zendesk AI is useful for teams already operating in Zendesk or evaluating an AI-enabled service platform. It supports support-agent productivity, automation, ticket intelligence, and customer-service workflows.",
    websiteUrl: "https://www.zendesk.com/service/ai/",
    pricingType: PricingType.PAID,
    hasFreePlan: false,
    isVerified: true,
    isFeatured: true,
    popularityScore: 84,
    useCases: ["Help desk automation", "Customer support", "Customer feedback analysis"],
    features: ["AI agents", "Ticket routing", "Human handoff", "Integrations"],
    alternatives: ["Intercom Fin", "Gorgias AI Agent", "Ada"]
  },
  {
    name: "Gorgias AI Agent",
    category: "Customer Support",
    shortDescription:
      "Ecommerce-focused AI support agent for automating customer conversations.",
    longDescription:
      "Gorgias AI Agent is built for ecommerce support teams that need to answer order, return, product, and policy questions. It is strongest when connected to a well-maintained ecommerce help desk and store data.",
    websiteUrl: "https://www.gorgias.com",
    pricingType: PricingType.PAID,
    hasFreePlan: false,
    isVerified: true,
    isFeatured: false,
    popularityScore: 77,
    useCases: ["Help desk automation", "Customer support", "Workflow automation"],
    features: ["AI agents", "Human handoff", "Ticket routing", "Integrations"],
    alternatives: ["Intercom Fin", "Zendesk AI", "Ada"]
  },
  {
    name: "HubSpot Breeze",
    category: "Marketing",
    shortDescription:
      "HubSpot AI for marketing, sales, service, content, and CRM productivity.",
    longDescription:
      "HubSpot Breeze brings AI assistance and agents into HubSpot workflows. It is most useful for teams using HubSpot CRM who want AI support for content, prospecting, customer data, and revenue operations.",
    websiteUrl: "https://www.hubspot.com/products/artificial-intelligence",
    pricingType: PricingType.FREEMIUM,
    hasFreePlan: true,
    isVerified: true,
    isFeatured: true,
    popularityScore: 82,
    useCases: ["CRM update automation", "Sales outreach", "Social media content"],
    features: ["CRM sync", "AI agents", "Templates", "Integrations"],
    alternatives: ["Clay", "Apollo", "Copy.ai"]
  },
  {
    name: "Clay",
    category: "Sales",
    shortDescription:
      "AI-powered sales prospecting, enrichment, research, and outbound workflow platform.",
    longDescription:
      "Clay helps go-to-market teams combine data providers, AI research, enrichment, and workflow logic to build targeted prospecting systems. It is best for teams that can define clear ICP and messaging rules.",
    websiteUrl: "https://www.clay.com",
    pricingType: PricingType.FREEMIUM,
    hasFreePlan: true,
    isVerified: true,
    isFeatured: true,
    popularityScore: 85,
    useCases: ["Lead enrichment", "Sales email personalization", "CRM update automation"],
    features: ["Data enrichment", "Workflow builder", "CRM sync", "Integrations"],
    alternatives: ["Apollo", "Lavender", "HubSpot Breeze"]
  },
  {
    name: "Apollo",
    category: "Sales",
    shortDescription:
      "Sales intelligence and engagement platform with AI-assisted prospecting and outreach.",
    longDescription:
      "Apollo combines contact data, prospecting, sequences, and sales workflow tools. It is useful for revenue teams that want an integrated prospecting and outbound system.",
    websiteUrl: "https://www.apollo.io",
    pricingType: PricingType.FREEMIUM,
    hasFreePlan: true,
    isVerified: true,
    isFeatured: false,
    popularityScore: 79,
    useCases: ["Lead enrichment", "Sales outreach", "Sales email personalization"],
    features: ["Data enrichment", "Lead scoring", "CRM sync", "Templates"],
    alternatives: ["Clay", "Lavender", "HubSpot Breeze"]
  },
  {
    name: "Lavender",
    category: "Sales",
    shortDescription:
      "AI sales email coach for improving outbound messages and personalization.",
    longDescription:
      "Lavender helps sales teams write, score, and improve outbound emails. It is best for teams focused on email quality, buyer relevance, and coaching rather than full CRM automation.",
    websiteUrl: "https://www.lavender.ai",
    pricingType: PricingType.FREEMIUM,
    hasFreePlan: true,
    isVerified: false,
    isFeatured: false,
    popularityScore: 68,
    useCases: ["Sales email personalization", "Sales outreach", "Copywriting"],
    features: ["Templates", "Lead scoring", "Browser extension", "CRM sync"],
    alternatives: ["Clay", "Apollo", "Copy.ai"]
  },
  {
    name: "n8n",
    category: "Automation",
    shortDescription:
      "Workflow automation platform with AI nodes, integrations, and self-hosting options.",
    longDescription:
      "n8n is useful for technical and operations teams that want flexible workflow automation, AI steps, and control over deployment. It fits teams that need more customization than basic app-to-app automations.",
    websiteUrl: "https://n8n.io",
    pricingType: PricingType.FREEMIUM,
    hasFreePlan: true,
    isVerified: true,
    isFeatured: true,
    popularityScore: 80,
    useCases: ["Workflow automation", "Document extraction", "CRM update automation"],
    features: ["Workflow builder", "AI agents", "Integrations", "API access"],
    alternatives: ["Zapier", "Make", "Gumloop"]
  },
  {
    name: "Lindy",
    category: "Automation",
    shortDescription:
      "AI agent platform for automating inbox, meeting, CRM, support, and operations work.",
    longDescription:
      "Lindy helps teams build AI assistants and agents for recurring business workflows. It is a good fit for automating administrative tasks when users can define clear goals, tools, and human approval points.",
    websiteUrl: "https://www.lindy.ai",
    pricingType: PricingType.FREEMIUM,
    hasFreePlan: true,
    isVerified: false,
    isFeatured: true,
    popularityScore: 76,
    useCases: ["Workflow automation", "CRM update automation", "Meeting summaries"],
    features: ["AI agents", "Workflow builder", "Integrations", "Human handoff"],
    alternatives: ["Zapier", "n8n", "Gumloop"]
  },
  {
    name: "Gumloop",
    category: "Automation",
    shortDescription:
      "No-code AI automation builder for documents, web tasks, enrichment, and operations.",
    longDescription:
      "Gumloop is designed for building AI workflows without heavy engineering. It is useful for teams that need repeatable automations across research, extraction, enrichment, and operational handoffs.",
    websiteUrl: "https://www.gumloop.com",
    pricingType: PricingType.FREEMIUM,
    hasFreePlan: true,
    isVerified: false,
    isFeatured: false,
    popularityScore: 72,
    useCases: ["Workflow automation", "Document extraction", "Lead enrichment"],
    features: ["Workflow builder", "Document extraction", "Data enrichment", "No-code builder"],
    alternatives: ["Zapier", "n8n", "Lindy"]
  },
  {
    name: "Julius AI",
    category: "Data Analysis",
    shortDescription:
      "AI data analyst for spreadsheets, charts, statistical analysis, and reports.",
    longDescription:
      "Julius AI helps users analyze spreadsheets and data files through a conversational interface. It is useful for teams that need fast exploratory analysis without building a full BI workflow.",
    websiteUrl: "https://julius.ai",
    pricingType: PricingType.FREEMIUM,
    hasFreePlan: true,
    isVerified: false,
    isFeatured: true,
    popularityScore: 74,
    useCases: ["Data analysis", "Spreadsheet automation", "Document extraction"],
    features: ["Spreadsheet analysis", "Document upload", "Export options", "Chat interface"],
    alternatives: ["ChatGPT", "Microsoft 365 Copilot", "Airtable AI"]
  },
  {
    name: "Airtable AI",
    category: "Data Analysis",
    shortDescription:
      "AI features inside Airtable for structured data, workflows, summaries, and app building.",
    longDescription:
      "Airtable AI is useful for teams already organizing work in Airtable bases. It supports structured data workflows, summaries, categorization, and AI-assisted operations across custom business apps.",
    websiteUrl: "https://www.airtable.com/platform/ai",
    pricingType: PricingType.PAID,
    hasFreePlan: false,
    isVerified: true,
    isFeatured: false,
    popularityScore: 73,
    useCases: ["Spreadsheet automation", "Data analysis", "Workflow automation"],
    features: ["Spreadsheet analysis", "Workflow builder", "Integrations", "Team workspace"],
    alternatives: ["Julius AI", "Notion AI", "Zapier"]
  },
  {
    name: "Lovable",
    category: "App Builders",
    shortDescription:
      "AI app builder for creating web apps from prompts with editable code and fast iteration.",
    longDescription:
      "Lovable helps users generate and iterate on web app prototypes from natural language. It is useful for founders, product teams, and operators who want to validate software ideas quickly before deeper engineering investment.",
    websiteUrl: "https://lovable.dev",
    pricingType: PricingType.FREEMIUM,
    hasFreePlan: true,
    isVerified: false,
    isFeatured: true,
    popularityScore: 81,
    useCases: ["App prototyping", "Code generation", "Design assets"],
    features: ["App generation", "UI generation", "No-code builder", "Export options"],
    alternatives: ["v0", "Bolt.new", "Replit"]
  },
  {
    name: "v0",
    category: "App Builders",
    shortDescription:
      "Vercel AI tool for generating React interfaces, components, and app UI from prompts.",
    longDescription:
      "v0 is focused on generating UI and frontend code for modern web apps. It is useful for product teams and developers who want to move quickly from interface idea to editable implementation.",
    websiteUrl: "https://v0.dev",
    pricingType: PricingType.FREEMIUM,
    hasFreePlan: true,
    isVerified: true,
    isFeatured: true,
    popularityScore: 83,
    useCases: ["App prototyping", "Code generation", "Design assets"],
    features: ["UI generation", "Code completion", "Export options", "Chat interface"],
    alternatives: ["Lovable", "Bolt.new", "Cursor"]
  },
  {
    name: "Bolt.new",
    category: "App Builders",
    shortDescription:
      "AI app-building workspace for prompting, editing, running, and deploying full-stack apps.",
    longDescription:
      "Bolt.new helps users generate and modify web applications inside a browser-based development environment. It is useful for prototypes, demos, internal tools, and early product exploration.",
    websiteUrl: "https://bolt.new",
    pricingType: PricingType.FREEMIUM,
    hasFreePlan: true,
    isVerified: false,
    isFeatured: true,
    popularityScore: 82,
    useCases: ["App prototyping", "Code generation", "Workflow automation"],
    features: ["App generation", "Code completion", "Export options", "Integrations"],
    alternatives: ["Lovable", "v0", "Replit"]
  },
  {
    name: "Harvey",
    category: "Legal",
    shortDescription:
      "AI platform for legal and professional-services research, drafting, and document workflows.",
    longDescription:
      "Harvey is built for law firms, in-house legal teams, and professional-services organizations that need domain-specific AI support for complex document, research, drafting, and diligence work. It is best suited for teams with expert review, strong confidentiality controls, and enough recurring legal work to justify an enterprise rollout.",
    websiteUrl: "https://www.harvey.ai",
    pricingType: PricingType.PAID,
    hasFreePlan: false,
    isVerified: true,
    isFeatured: true,
    popularityScore: 87,
    useCases: ["Legal research", "Contract review", "Diligence document analysis"],
    features: ["Legal research", "Document upload", "Source grounding", "Diligence workflows"],
    alternatives: ["CoCounsel", "Ironclad AI", "Hebbia"]
  },
  {
    name: "CoCounsel",
    category: "Legal",
    shortDescription:
      "Thomson Reuters professional-grade AI assistant for legal research, analysis, and drafting.",
    longDescription:
      "CoCounsel is a legal AI assistant grounded in Thomson Reuters legal content and workflows. It is a strong fit for legal professionals who want research, drafting, document review, and matter support connected to established legal research and professional content systems.",
    websiteUrl: "https://www.thomsonreuters.com/cocounsel",
    pricingType: PricingType.PAID,
    hasFreePlan: false,
    isVerified: true,
    isFeatured: true,
    popularityScore: 86,
    useCases: ["Legal research", "Contract review", "Compliance evidence collection"],
    features: ["Legal research", "Citations", "Source grounding", "Governance controls"],
    alternatives: ["Harvey", "Ironclad AI", "Perplexity"]
  },
  {
    name: "Ironclad AI",
    category: "Legal",
    shortDescription:
      "AI capabilities inside Ironclad CLM for contract review, playbooks, and contract insights.",
    longDescription:
      "Ironclad AI supports contract lifecycle management by helping teams review agreements, apply playbooks, find contract data, and speed up negotiation workflows. It is strongest for legal and business teams already managing contracts inside a structured CLM process.",
    websiteUrl: "https://ironcladapp.com/product/ironclad-ai/",
    pricingType: PricingType.PAID,
    hasFreePlan: false,
    isVerified: true,
    isFeatured: true,
    popularityScore: 82,
    useCases: ["Contract review", "Compliance evidence collection", "Document extraction"],
    features: ["Contract analysis", "Clause detection", "Workflow builder", "Governance controls"],
    alternatives: ["Harvey", "CoCounsel", "Airtable AI"]
  },
  {
    name: "Hebbia",
    category: "Research",
    shortDescription:
      "Enterprise AI for analyzing large document collections, filings, transcripts, and diligence materials.",
    longDescription:
      "Hebbia helps finance, legal, consulting, and investing teams analyze private documents, public filings, transcripts, and research sources. It is useful when users need structured answers, repeatable research workflows, and source traceability across high-stakes document sets.",
    websiteUrl: "https://www.hebbia.com",
    pricingType: PricingType.PAID,
    hasFreePlan: false,
    isVerified: true,
    isFeatured: true,
    popularityScore: 84,
    useCases: ["Diligence document analysis", "Market intelligence", "Research synthesis"],
    features: ["Diligence workflows", "Document upload", "Source grounding", "Market intelligence"],
    alternatives: ["AlphaSense", "Harvey", "Elicit"]
  },
  {
    name: "AlphaSense",
    category: "Research",
    shortDescription:
      "AI-powered market intelligence platform for company, industry, expert, and financial research.",
    longDescription:
      "AlphaSense is built for teams that need trusted market, competitor, company, and financial intelligence from premium external sources and internal content. It is a strong fit for strategy, investing, corporate development, and market research teams with recurring research needs.",
    websiteUrl: "https://www.alpha-sense.com",
    pricingType: PricingType.PAID,
    hasFreePlan: false,
    isVerified: true,
    isFeatured: true,
    popularityScore: 85,
    useCases: ["Market intelligence", "Diligence document analysis", "Web research"],
    features: ["Market intelligence", "Citations", "Source grounding", "Enterprise search"],
    alternatives: ["Hebbia", "Perplexity", "Consensus"]
  },
  {
    name: "Elicit",
    category: "Research",
    shortDescription:
      "AI research assistant for scientific search, reports, data extraction, and literature reviews.",
    longDescription:
      "Elicit helps researchers search scientific papers, generate research reports, organize evidence, and support systematic-review workflows. It is especially useful for research teams that need source-level transparency rather than a generic chat answer.",
    websiteUrl: "https://elicit.com",
    pricingType: PricingType.FREEMIUM,
    hasFreePlan: true,
    isVerified: true,
    isFeatured: true,
    popularityScore: 79,
    useCases: ["Research synthesis", "Market intelligence", "Legal research"],
    features: ["Literature review", "Evidence synthesis", "Citations", "Source grounding"],
    alternatives: ["Consensus", "Perplexity", "NotebookLM"]
  },
  {
    name: "Consensus",
    category: "Research",
    shortDescription:
      "AI academic search engine for evidence-backed answers from peer-reviewed research.",
    longDescription:
      "Consensus helps users ask natural-language research questions and get answers grounded in academic papers. It is a practical option for evidence-backed exploration, early literature discovery, and teams that need citations before deciding what to read deeply.",
    websiteUrl: "https://consensus.app",
    pricingType: PricingType.FREEMIUM,
    hasFreePlan: true,
    isVerified: true,
    isFeatured: true,
    popularityScore: 78,
    useCases: ["Research synthesis", "Web research", "Market intelligence"],
    features: ["Evidence synthesis", "Literature review", "Citations", "Web browsing"],
    alternatives: ["Elicit", "Perplexity", "NotebookLM"]
  },
  {
    name: "Sana",
    category: "Knowledge Management",
    shortDescription:
      "AI knowledge and learning platform for enterprise search, assistants, and enablement.",
    longDescription:
      "Sana combines workplace knowledge, learning, and AI assistant workflows. It is useful for organizations that want to connect company knowledge with onboarding, training, enablement, and employee self-service.",
    websiteUrl: "https://sana.ai",
    pricingType: PricingType.PAID,
    hasFreePlan: false,
    isVerified: true,
    isFeatured: false,
    popularityScore: 77,
    useCases: ["Learning and enablement", "Enterprise knowledge search", "Training content"],
    features: ["Enterprise search", "Learning paths", "AI agents", "Team workspace"],
    alternatives: ["Glean", "Guru", "Notion AI"]
  },
  {
    name: "Guru",
    category: "Knowledge Management",
    shortDescription:
      "Enterprise AI search and verified knowledge platform with permission-aware answers.",
    longDescription:
      "Guru helps teams search across workplace systems, surface cited answers, and keep knowledge verified by subject-matter experts. It is a good fit for support, sales, operations, and enablement teams that need governed internal answers.",
    websiteUrl: "https://www.getguru.com/solutions/enterprise-search",
    pricingType: PricingType.PAID,
    hasFreePlan: false,
    isVerified: true,
    isFeatured: false,
    popularityScore: 76,
    useCases: ["Enterprise knowledge search", "Internal knowledge search", "Learning and enablement"],
    features: ["Enterprise search", "Source grounding", "Governance controls", "Integrations"],
    alternatives: ["Glean", "Sana", "Notion AI"]
  },
  {
    name: "Coda AI",
    category: "Productivity",
    shortDescription:
      "AI work assistant inside Coda docs for drafting, summarizing, tables, and workflow actions.",
    longDescription:
      "Coda AI brings AI assistance into collaborative docs, tables, and lightweight workflow apps. It is useful for teams that already use Coda to run projects, operations, knowledge bases, and team processes.",
    websiteUrl: "https://coda.io/product/ai",
    pricingType: PricingType.FREEMIUM,
    hasFreePlan: true,
    isVerified: true,
    isFeatured: false,
    popularityScore: 73,
    useCases: ["Workflow automation", "Knowledge management", "Executive reporting"],
    features: ["Templates", "Workflow builder", "Team workspace", "AI agents"],
    alternatives: ["Notion AI", "Airtable AI", "Retool AI"]
  },
  {
    name: "Retool AI",
    category: "App Builders",
    shortDescription:
      "AI app and workflow platform for building internal tools, agents, and operational apps.",
    longDescription:
      "Retool AI helps technical and operations teams build AI-powered internal apps, workflows, and business processes on top of databases, APIs, and enterprise systems. It is best when teams need production internal tooling rather than a one-off prototype.",
    websiteUrl: "https://retool.com/products/ai",
    pricingType: PricingType.FREEMIUM,
    hasFreePlan: true,
    isVerified: true,
    isFeatured: true,
    popularityScore: 81,
    useCases: ["Internal tool generation", "Workflow automation", "AI customer service agents"],
    features: ["App generation", "Workflow builder", "Data warehouse connection", "Governance controls"],
    alternatives: ["Airtable AI", "Zapier", "n8n"]
  },
  {
    name: "Hex",
    category: "Data Analysis",
    shortDescription:
      "Collaborative data workspace with AI assist for notebooks, reports, apps, and analytics workflows.",
    longDescription:
      "Hex combines notebooks, SQL, Python, data apps, reports, and AI assistance for data teams and business stakeholders. It is a strong fit for organizations that need reproducible analysis with collaboration and lightweight publishing.",
    websiteUrl: "https://hex.tech",
    pricingType: PricingType.FREEMIUM,
    hasFreePlan: true,
    isVerified: true,
    isFeatured: false,
    popularityScore: 75,
    useCases: ["BI dashboard analysis", "Data analysis", "Executive reporting"],
    features: ["Data warehouse connection", "BI dashboards", "Source grounding", "Team workspace"],
    alternatives: ["Julius AI", "Power BI Copilot", "ThoughtSpot Spotter"]
  },
  {
    name: "ThoughtSpot Spotter",
    category: "Data Analysis",
    shortDescription:
      "AI analyst for conversational BI, trusted answers, dashboards, and semantic-model workflows.",
    longDescription:
      "ThoughtSpot Spotter gives business teams an AI analyst experience for asking questions, exploring governed data, and generating insights. It is strongest for organizations that already invest in semantic models and self-service analytics.",
    websiteUrl: "https://www.thoughtspot.com/product/agents/spotter",
    pricingType: PricingType.PAID,
    hasFreePlan: false,
    isVerified: true,
    isFeatured: true,
    popularityScore: 80,
    useCases: ["BI dashboard analysis", "Executive reporting", "Data analysis"],
    features: ["BI dashboards", "Semantic layer", "Source grounding", "Data warehouse connection"],
    alternatives: ["Power BI Copilot", "Hex", "Julius AI"]
  },
  {
    name: "Power BI Copilot",
    category: "Data Analysis",
    shortDescription:
      "Microsoft Copilot capabilities for Power BI reports, semantic models, insights, and DAX assistance.",
    longDescription:
      "Power BI Copilot helps users ask questions about reports, summarize insights, create report pages, and support data-modeling tasks inside Microsoft's BI ecosystem. It is best for teams already standardized on Microsoft Fabric and Power BI.",
    websiteUrl: "https://www.microsoft.com/en-us/power-platform/products/power-bi",
    pricingType: PricingType.PAID,
    hasFreePlan: false,
    isVerified: true,
    isFeatured: true,
    popularityScore: 82,
    useCases: ["BI dashboard analysis", "Executive reporting", "Spreadsheet automation"],
    features: ["BI dashboards", "Semantic layer", "Integrations", "Team workspace"],
    alternatives: ["ThoughtSpot Spotter", "Microsoft 365 Copilot", "Julius AI"]
  },
  {
    name: "Salesforce Agentforce",
    category: "Sales",
    shortDescription:
      "Salesforce AI agent platform for CRM-connected sales, service, marketing, and commerce workflows.",
    longDescription:
      "Salesforce Agentforce helps organizations build and deploy AI agents connected to Salesforce data and Customer 360 workflows. It is a strong fit for companies already running sales, service, marketing, or commerce operations in Salesforce.",
    websiteUrl: "https://www.salesforce.com/agentforce/",
    pricingType: PricingType.PAID,
    hasFreePlan: false,
    isVerified: true,
    isFeatured: true,
    popularityScore: 88,
    useCases: ["Sales and service agents", "CRM update automation", "AI customer service agents"],
    features: ["AI agents", "CRM sync", "Agent builder", "Governance controls"],
    alternatives: ["HubSpot Breeze", "Ada", "Decagon"]
  },
  {
    name: "Ada",
    category: "Customer Support",
    shortDescription:
      "AI customer service platform for deploying agents across chat and digital support channels.",
    longDescription:
      "Ada is built for customer experience teams that want AI agents to resolve routine customer conversations and escalate when needed. It is best for teams with strong help content, clear support policies, and enough conversation volume to measure automation quality.",
    websiteUrl: "https://www.ada.cx",
    pricingType: PricingType.PAID,
    hasFreePlan: false,
    isVerified: true,
    isFeatured: true,
    popularityScore: 83,
    useCases: ["AI customer service agents", "Help desk automation", "Customer support"],
    features: ["Customer service agents", "Human handoff", "Ticket routing", "Integrations"],
    alternatives: ["Intercom Fin", "Zendesk AI", "Sierra"]
  },
  {
    name: "Sierra",
    category: "Customer Support",
    shortDescription:
      "AI agent platform for building branded customer experience agents across service channels.",
    longDescription:
      "Sierra helps companies build AI agents for personalized customer experiences across channels such as chat, SMS, email, voice, and ChatGPT. It is most appropriate for larger customer-facing teams that need branded agent behavior, guardrails, and operational visibility.",
    websiteUrl: "https://sierra.ai",
    pricingType: PricingType.PAID,
    hasFreePlan: false,
    isVerified: true,
    isFeatured: true,
    popularityScore: 84,
    useCases: ["AI customer service agents", "Sales and service agents", "Customer support"],
    features: ["Customer service agents", "Agent builder", "Voice support", "Governance controls"],
    alternatives: ["Ada", "Decagon", "Intercom Fin"]
  },
  {
    name: "Decagon",
    category: "Customer Support",
    shortDescription:
      "Conversational AI platform for enterprise customer support across chat, email, SMS, and voice.",
    longDescription:
      "Decagon helps enterprises deploy AI agents that resolve customer support conversations across channels and connect to customer systems. It is well suited for support teams that need automation, visibility, and controlled customer experience workflows.",
    websiteUrl: "https://decagon.ai",
    pricingType: PricingType.PAID,
    hasFreePlan: false,
    isVerified: true,
    isFeatured: true,
    popularityScore: 82,
    useCases: ["AI customer service agents", "Help desk automation", "Customer feedback analysis"],
    features: ["Customer service agents", "Voice support", "Human handoff", "Integrations"],
    alternatives: ["Sierra", "Ada", "Zendesk AI"]
  },
  {
    name: "Typeface",
    category: "Marketing",
    shortDescription:
      "Enterprise marketing AI platform for brand-governed content, personalization, and agentic workflows.",
    longDescription:
      "Typeface helps enterprise marketing and ecommerce teams create on-brand content from product, audience, and campaign inputs. It is useful when content velocity needs to improve without losing brand control, approved claims, or workflow governance.",
    websiteUrl: "https://www.typeface.ai",
    pricingType: PricingType.PAID,
    hasFreePlan: false,
    isVerified: true,
    isFeatured: true,
    popularityScore: 79,
    useCases: ["Governed brand content", "Copywriting", "Social media content"],
    features: ["Brand governance", "Brand kit", "Templates", "Team workspace"],
    alternatives: ["Writer", "Jasper", "Canva"]
  },
  {
    name: "Writer",
    category: "Marketing",
    shortDescription:
      "Enterprise generative AI platform for governed content, knowledge, apps, and agents.",
    longDescription:
      "Writer is a full-stack enterprise AI platform for teams that need governed generative AI across content, knowledge, apps, and agent workflows. It is best for organizations with brand, security, compliance, and workflow requirements that go beyond simple drafting tools.",
    websiteUrl: "https://writer.com",
    pricingType: PricingType.FREEMIUM,
    hasFreePlan: true,
    isVerified: true,
    isFeatured: true,
    popularityScore: 81,
    useCases: ["Governed brand content", "Enterprise knowledge search", "Workflow automation"],
    features: ["Brand governance", "AI agents", "Governance controls", "Team workspace"],
    alternatives: ["Typeface", "Jasper", "Copy.ai"]
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
  const logoUrl = faviconUrl(tool.websiteUrl);

  return prisma.tool.upsert({
    where: { slug },
    update: {
      name: tool.name,
      shortDescription: tool.shortDescription,
      longDescription: tool.longDescription,
      websiteUrl: tool.websiteUrl,
      logoUrl,
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
      logoUrl,
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

function faviconUrl(websiteUrl: string) {
  const domain = new URL(websiteUrl).hostname.replace(/^www\./, "");
  const overrides: Record<string, string> = {
    "tome.app": "https://logotyp.us/file/tome.svg"
  };

  if (overrides[domain]) {
    return overrides[domain];
  }

  return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
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
