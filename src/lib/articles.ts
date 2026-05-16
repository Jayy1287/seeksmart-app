export type ArticleBlock =
  | {
      body: string[];
      heading: string;
      kind: "section";
    }
  | {
      heading: string;
      items: string[];
      kind: "checklist";
    };

export type Article = {
  audience: string;
  blocks: ArticleBlock[];
  description: string;
  intro: string[];
  keywords: string[];
  publishedAt: string;
  readingTime: string;
  related: Array<{
    href: string;
    label: string;
  }>;
  slug: string;
  title: string;
  updatedAt: string;
};

const articleDates = {
  automation: "2026-05-02",
  checklist: "2026-05-16",
  choosing: "2026-04-18",
  generalVsSpecialized: "2026-05-09",
  smallBusiness: "2026-04-25"
};

export const articles: Article[] = [
  {
    audience: "Buyers comparing AI software",
    description:
      "A practical checklist for choosing AI tools for business without overbuying, ignoring workflow fit, or missing security and adoption risks.",
    intro: [
      "Most AI tool purchases go wrong before anyone sees a demo. The team starts with a product name instead of a business problem, then compares features that sound impressive but do not change the work.",
      "A better buying process starts with the workflow. What is slow, repetitive, risky, expensive, or inconsistent today? Which person owns the result? What data will the tool need? The answers make it much easier to separate a useful AI product from a nice demo.",
      "Use this guide when you are building a shortlist, reviewing a vendor page, or trying to explain why one tool is a better first pilot than another."
    ],
    keywords: [
      "how to choose AI tools for business",
      "AI software buying guide",
      "AI tool checklist",
      "business AI tools"
    ],
    publishedAt: articleDates.choosing,
    readingTime: "9 min read",
    related: [
      { href: "/audit/start", label: "Run the AI audit" },
      { href: "/tools", label: "Browse AI tools" },
      { href: "/methodology", label: "See the recommendation method" }
    ],
    slug: "how-to-choose-ai-tools-for-business",
    title: "How to Choose AI Tools for Your Business Without Buying the Wrong Thing",
    updatedAt: articleDates.choosing,
    blocks: [
      {
        body: [
          "Start with one workflow, not a department-wide transformation. A workflow is specific enough to test: qualify inbound leads, summarize support tickets, draft product descriptions, review contracts, prepare meeting notes, or turn raw call notes into CRM updates.",
          "The best first workflow usually has three traits. It happens often, it has a visible owner, and a better result would be easy to measure. If the workflow happens once a quarter or depends on five teams agreeing on a new process, it is probably not the first place to start.",
          "Write the current workflow in plain language before you open vendor tabs. Who starts it? What information comes in? What does the finished output look like? Where does a human review it? That short map will make vendor claims much easier to test."
        ],
        heading: "Start with the workflow, not the category",
        kind: "section"
      },
      {
        body: [
          "AI tools often fail because the user is unclear. A founder, support manager, sales rep, recruiter, and analyst may all want speed, but they need different controls and outputs.",
          "For each shortlisted tool, name the daily user, the decision owner, and the person who approves risk. In a small company those may be the same person. In a larger company, they rarely are.",
          "This matters because a tool that delights one user can still create trouble for another team. A sales automation tool may help reps send more messages, while compliance worries about claims, data retention, and review steps. Naming the stakeholders early prevents late-stage surprises."
        ],
        heading: "Separate the user from the buyer",
        kind: "section"
      },
      {
        items: [
          "What exact output should the tool produce?",
          "How often does this workflow happen?",
          "Which human reviews the output before it reaches a customer?",
          "What systems does the tool need to read from or write to?",
          "Can the tool work with sample data before it touches real customer data?",
          "What would count as a successful pilot after 30 days?",
          "What would make the team stop using it?"
        ],
        heading: "Questions to answer before a demo",
        kind: "checklist"
      },
      {
        body: [
          "A long feature list is not the same as fit. The features that matter most are usually boring: permissions, exports, review queues, integrations, audit trails, data controls, and predictable pricing.",
          "If two tools look similar, compare the workflow around the AI, not only the model output. Can a teammate correct the result? Can the manager see what changed? Can the user recover when the tool is wrong? Can you turn the feature off without losing your data?",
          "In practice, the tool with a slightly less magical demo but better workflow controls often wins after three weeks of real use."
        ],
        heading: "Compare operating fit, not just AI quality",
        kind: "section"
      },
      {
        body: [
          "Pricing deserves more attention than the headline plan. Many AI products charge by seat, credits, output volume, transcription hours, automations, contacts, or data rows. A cheap plan can become expensive once the workflow is used daily.",
          "Estimate usage in the units the vendor actually bills. If a meeting assistant charges per seat, count the people who need recordings. If a support tool charges by conversation volume, use last month's ticket count. If a writing tool charges by output credits, test the number of drafts a normal week requires.",
          "A useful pilot budget includes the subscription, setup time, data cleanup, review time, and the cost of changing tools if the first choice does not work."
        ],
        heading: "Price the real workflow",
        kind: "section"
      },
      {
        body: [
          "Do not treat security as a final procurement hurdle. The data question belongs at the start. A tool that only sees public marketing copy is different from a tool that reads customer tickets, contracts, patient notes, payroll data, or source code.",
          "Ask what data the tool stores, where it is processed, whether customer data is used for training, how long data is retained, who can access it, and how exports or deletions work. If the vendor cannot answer plainly, keep looking or keep the pilot away from sensitive data.",
          "The safest first AI pilot is often one where the value is visible but the data risk is contained."
        ],
        heading: "Match the tool to your data risk",
        kind: "section"
      },
      {
        items: [
          "Pick one workflow and one accountable owner.",
          "Test with real examples, not polished demo prompts.",
          "Measure one outcome: time saved, response speed, quality, conversion, or error reduction.",
          "Keep a manual fallback during the pilot.",
          "Document where human review is required.",
          "Decide in advance whether you will expand, pause, or replace the tool."
        ],
        heading: "A simple first-pilot plan",
        kind: "checklist"
      }
    ]
  },
  {
    audience: "Small business owners and operators",
    description:
      "A grounded guide to the best AI tools for small business workflows, including where to start, what to avoid, and how to build a practical AI stack.",
    intro: [
      "Small businesses do not need a giant AI strategy deck. They need fewer repetitive tasks, faster customer follow-up, cleaner operations, and a way to try new software without creating another job for the team.",
      "The useful question is not which AI tool is best overall. It is which part of the business has enough repetition, enough pain, and low enough risk to make a first AI pilot worth it.",
      "This guide breaks down the most practical places for small teams to use AI first, plus the tool categories that usually make sense at each stage."
    ],
    keywords: [
      "best AI tools for small business",
      "AI tools for small businesses",
      "small business AI stack",
      "AI for small business"
    ],
    publishedAt: articleDates.smallBusiness,
    readingTime: "10 min read",
    related: [
      { href: "/tools", label: "Search AI tools" },
      { href: "/use-cases", label: "Explore use cases" },
      { href: "/audit/start", label: "Find your first workflow" }
    ],
    slug: "best-ai-tools-for-small-business",
    title: "Best AI Tools for Small Business: Where to Use AI First",
    updatedAt: articleDates.smallBusiness,
    blocks: [
      {
        body: [
          "The best first AI project is usually close to revenue, customer experience, or a task the owner already hates doing. Do not start with a complex back-office transformation if a customer-facing workflow is obviously slow.",
          "A local service business might start with intake forms, follow-up messages, quote drafts, or review responses. An ecommerce business might start with product descriptions, support macros, return analysis, or ad creative variants. A consulting firm might start with proposal outlines, meeting summaries, research briefs, or knowledge base search.",
          "The pattern is simple: choose work that already happens every week and has a human who can judge whether the AI output is good enough."
        ],
        heading: "Start where repetition meets judgment",
        kind: "section"
      },
      {
        body: [
          "Customer support is one of the safest places to start because the pain is visible and the workflow is already written down in tickets, emails, chats, and call notes.",
          "AI can summarize long threads, draft replies, categorize requests, spot recurring issues, and help turn solved tickets into help-center content. The goal is not to remove people from support. The goal is to help them answer faster and keep the tone consistent.",
          "A good support pilot keeps a human approval step. Let AI prepare the answer, not send it automatically on day one."
        ],
        heading: "Customer support: faster answers without losing judgment",
        kind: "section"
      },
      {
        body: [
          "Small teams often need more marketing output than they have time to produce. AI writing and design tools can help with drafts, outlines, repurposing, product copy, ad variants, and newsletter ideas.",
          "The risk is sameness. If every post sounds like a template, the tool is not helping the brand. Use AI to get from blank page to workable draft, then add the specifics: customer language, product details, proof, opinion, and local context.",
          "The best marketing tools for small businesses make editing easy. Avoid workflows where the team accepts first drafts because the interface makes revision annoying."
        ],
        heading: "Marketing: draft faster, but keep the voice human",
        kind: "section"
      },
      {
        body: [
          "Sales teams can use AI to research accounts, summarize calls, draft follow-ups, score lead fit, and keep the CRM cleaner. The biggest win is usually not sending more cold emails. It is remembering what happened, following up on time, and personalizing outreach from real context.",
          "Be careful with volume-first tools. More messages can hurt if the data is weak or the copy feels generic. A better first sales pilot is one that improves the quality and timing of follow-up.",
          "If a tool touches your CRM, test data hygiene early. Bad field updates create distrust quickly."
        ],
        heading: "Sales: better follow-up beats louder outreach",
        kind: "section"
      },
      {
        body: [
          "Operations work is full of small frictions: invoices, handoffs, vendor emails, spreadsheets, meeting notes, inventory updates, appointment reminders, and recurring reports.",
          "AI can help summarize, classify, extract, and route information. The trick is to avoid automating a messy process before you understand it. If three people disagree on what should happen after a form is submitted, AI will not fix that.",
          "Start by documenting the current steps. Then use AI on one step where the input and desired output are clear."
        ],
        heading: "Operations: automate one clear handoff at a time",
        kind: "section"
      },
      {
        items: [
          "General assistant for drafting, brainstorming, and quick analysis.",
          "Meeting assistant for summaries, action items, and searchable call history.",
          "Support assistant for reply drafts, triage, and help-center suggestions.",
          "Content tool for product copy, ads, email drafts, and repurposing.",
          "Automation tool for connecting forms, spreadsheets, CRM, and notifications.",
          "Knowledge tool for searching internal documents and standard answers."
        ],
        heading: "A practical small business AI stack",
        kind: "checklist"
      },
      {
        body: [
          "The easiest way to waste money is to buy five tools at once. Each tool adds setup, training, permissions, billing, and another place where work can get lost.",
          "Pick one workflow, one tool category, one owner, and one metric. If the pilot works, expand. If it does not, the lesson is cheap."
        ],
        heading: "What to avoid",
        kind: "section"
      }
    ]
  },
  {
    audience: "Managers looking for AI automation ideas",
    description:
      "Useful AI automation ideas by department, with examples for sales, support, marketing, operations, finance, HR, and leadership teams.",
    intro: [
      "Good AI automation ideas usually sound less dramatic than bad ones. They are not about replacing an entire team. They are about removing the drag around a specific decision, document, message, or handoff.",
      "If you are trying to find a useful first project, look for work that has repeated inputs, repeated decisions, and a clear review point. That combination is where AI can help without turning the business into an experiment.",
      "Use the department examples below as a menu. Pick one idea, test it with real work, and measure whether the team would miss it if it disappeared."
    ],
    keywords: [
      "AI automation ideas",
      "AI automation for business",
      "AI use cases by department",
      "business automation ideas"
    ],
    publishedAt: articleDates.automation,
    readingTime: "11 min read",
    related: [
      { href: "/use-cases", label: "Browse AI use cases" },
      { href: "/business-functions", label: "View business functions" },
      { href: "/opportunities", label: "Explore AI opportunities" }
    ],
    slug: "ai-automation-ideas-by-department",
    title: "AI Automation Ideas by Department: Practical Projects That Do Not Need a Giant Budget",
    updatedAt: articleDates.automation,
    blocks: [
      {
        body: [
          "For sales, the first automation should usually improve preparation or follow-up, not blast more prospects. AI can summarize account research, draft a call plan, turn meeting notes into CRM updates, and prepare follow-up emails based on what was actually discussed.",
          "One useful pilot is a post-call workflow. The rep records or writes notes, AI turns them into a summary, next steps, open questions, and a CRM update, and the rep approves before anything is saved. The metric is simple: fewer stale opportunities and faster follow-up.",
          "Another good idea is lead-fit explanation. Instead of just scoring leads, have AI explain why a lead looks promising or risky based on industry, company size, timing, and stated needs."
        ],
        heading: "Sales: prepare better and follow up faster",
        kind: "section"
      },
      {
        body: [
          "Support teams are full of repeatable language and recurring problems, which makes them strong candidates for AI assistance. Start with triage, summaries, suggested replies, and recurring issue detection.",
          "A practical workflow is ticket summarization before escalation. AI reads the thread, extracts the customer problem, what has already been tried, account details, and the next question. The senior support rep gets context without reading every message.",
          "Another high-value workflow is turning solved tickets into help articles. The support person approves the answer, AI drafts the article, and the team edits before publishing."
        ],
        heading: "Support: reduce reading time and repeat answers",
        kind: "section"
      },
      {
        body: [
          "Marketing AI works best when it has raw material. Customer calls, product notes, sales objections, support tickets, and founder opinions all make better inputs than a vague prompt.",
          "Useful automations include turning webinars into short posts, converting customer interviews into case study outlines, generating ad variants from approved messaging, and creating SEO briefs from real customer questions.",
          "The review step matters. A human should check claims, examples, voice, and whether the content says anything a competitor would not say."
        ],
        heading: "Marketing: repurpose real insight, not generic prompts",
        kind: "section"
      },
      {
        body: [
          "Operations teams can use AI to classify requests, extract information from forms, summarize vendor emails, draft internal updates, and route work to the right person.",
          "The safest operational automations are assistive. AI prepares the summary or recommendation; a human confirms the routing, approval, or customer-facing action.",
          "If an operations workflow has unclear ownership, solve that first. AI should speed up a process, not hide confusion inside a black box."
        ],
        heading: "Operations: clean up the handoff",
        kind: "section"
      },
      {
        body: [
          "Finance AI projects should be conservative because errors are expensive. Start with extraction, categorization, variance explanations, and draft commentary rather than unsupervised approvals.",
          "For example, AI can summarize why spend changed from last month, flag invoices that need review, categorize expense descriptions, or draft a plain-English explanation of a report for department heads.",
          "Keep approval rights with humans. The win is faster analysis and fewer manual summaries, not invisible financial decisions."
        ],
        heading: "Finance: explain and classify before approving",
        kind: "section"
      },
      {
        body: [
          "HR and recruiting teams can use AI to draft job descriptions, summarize candidate notes, prepare interview guides, organize feedback, and answer common policy questions.",
          "The highest-risk area is automated screening. Be careful with any workflow that ranks or rejects people without clear human review and documented criteria.",
          "A safer starting point is interview preparation. AI turns a role profile into structured questions, the hiring manager edits them, and the team uses a consistent rubric."
        ],
        heading: "HR: standardize the process, keep people in control",
        kind: "section"
      },
      {
        items: [
          "Choose a workflow that happens weekly or daily.",
          "Use data the team is allowed to share with the tool.",
          "Keep a visible human review step.",
          "Measure one business outcome.",
          "Write down when the AI should not be used.",
          "Check whether the workflow still works when the AI is wrong."
        ],
        heading: "How to choose the first automation",
        kind: "checklist"
      }
    ]
  },
  {
    audience: "Teams deciding between general and specialized AI tools",
    description:
      "A practical comparison of ChatGPT-style general assistants and specialized AI tools for business workflows, with guidance on when to use each.",
    intro: [
      "A general AI assistant can feel like the answer to everything. It can draft, summarize, brainstorm, analyze, explain, and transform text in seconds. For many teams, that is enough to start.",
      "But general assistants are not always the best tool for a repeated business workflow. Specialized AI products often add the parts that matter after the first prompt: permissions, templates, integrations, review queues, analytics, exports, and workflow history.",
      "The choice is not ChatGPT or specialized tools. Most teams need both. The question is where each one belongs."
    ],
    keywords: [
      "ChatGPT vs AI tools",
      "ChatGPT alternatives for business",
      "specialized AI tools",
      "AI assistant vs AI software"
    ],
    publishedAt: articleDates.generalVsSpecialized,
    readingTime: "8 min read",
    related: [
      { href: "/tools", label: "Compare AI tools" },
      { href: "/use-cases", label: "Map tools to use cases" },
      { href: "/audit/start", label: "Find the right starting point" }
    ],
    slug: "chatgpt-vs-ai-tools-for-business",
    title: "ChatGPT vs Specialized AI Tools: Which Should Your Team Use?",
    updatedAt: articleDates.generalVsSpecialized,
    blocks: [
      {
        body: [
          "Use a general assistant when the task is exploratory, occasional, or hard to define. Brainstorming, rewriting, summarizing, learning a topic, drafting an outline, and analyzing a small batch of text are all good fits.",
          "General assistants are also useful before buying anything else. They help a team learn what kind of AI output is useful, what prompts are repeatable, and where the real workflow friction lives.",
          "If the work still depends on a human copying text in, checking the answer, and moving the output somewhere else, a general assistant may be enough."
        ],
        heading: "When a general assistant is enough",
        kind: "section"
      },
      {
        body: [
          "Specialized tools make sense when the workflow repeats, touches a system of record, or needs team controls. A meeting assistant records calls and stores summaries. A support tool reads tickets and suggests replies in the help desk. A sales tool updates CRM fields. A design tool manages brand assets and approvals.",
          "The specialized product is not only selling model quality. It is selling the surrounding workflow: where the data comes from, where the output goes, who reviews it, and how the team tracks what happened.",
          "That surrounding workflow is often what makes the difference between a clever experiment and daily adoption."
        ],
        heading: "When specialized AI software is better",
        kind: "section"
      },
      {
        items: [
          "If the task happens less than once a week, start with a general assistant.",
          "If the task needs an integration, consider specialized software.",
          "If multiple teammates need the same workflow, consider specialized software.",
          "If the output needs approvals, history, or audit trails, consider specialized software.",
          "If you are still learning what good output looks like, start with a general assistant.",
          "If sensitive data is involved, compare data controls before choosing either option."
        ],
        heading: "A simple decision rule",
        kind: "checklist"
      },
      {
        body: [
          "Many teams start with a general assistant because it is flexible, then move repeated work into specialized tools after patterns become clear. That is a sensible path.",
          "For example, a founder might use a general assistant to draft customer follow-up emails. After a month, the team realizes every follow-up needs call notes, CRM context, next steps, and a reminder. At that point a sales or meeting workflow tool may be better.",
          "The general assistant helped discover the workflow. The specialized tool helps run it."
        ],
        heading: "Use general tools to discover repeated workflows",
        kind: "section"
      },
      {
        body: [
          "A general assistant can be cheap at first, but hidden costs appear when the team repeats the same task manually. People copy data, rewrite prompts, paste outputs, check formatting, and move results into another tool.",
          "Specialized software can look expensive, but it may save time if it removes handoffs and review friction. Compare the total time to finish the workflow, not only the monthly subscription.",
          "The fair comparison is not prompt cost versus seat price. It is finished work versus finished work."
        ],
        heading: "Compare the full cost of finished work",
        kind: "section"
      },
      {
        body: [
          "For sensitive workflows, ask the same hard questions either way. What data is sent to the provider? Is it used for training? Can admins control retention? Can users delete data? Are permissions clear? Can the company export or audit activity?",
          "A specialized tool may have stronger business controls, but that is not guaranteed. A general assistant may offer enterprise controls, but only if your plan and settings are configured correctly.",
          "Do not assume. Check the plan, settings, and vendor documentation before using either option with sensitive data."
        ],
        heading: "Security depends on configuration, not category",
        kind: "section"
      }
    ]
  },
  {
    audience: "Teams evaluating vendors and AI procurement",
    description:
      "A detailed AI tool evaluation checklist covering security, data privacy, pricing, ROI, integrations, rollout, and vendor risk.",
    intro: [
      "AI tool evaluation is harder than normal software evaluation because the demo can be impressive even when the workflow is weak. A tool may write a beautiful answer in a demo and still fail on permissions, data handling, pricing, or adoption.",
      "This checklist is designed for practical buyers: founders, operators, managers, and small teams who need enough rigor to avoid obvious mistakes without turning every tool review into a six-month procurement project.",
      "Use it before a demo, during a pilot, and again before you expand access."
    ],
    keywords: [
      "AI tool evaluation checklist",
      "AI software procurement checklist",
      "AI vendor evaluation",
      "AI security checklist"
    ],
    publishedAt: articleDates.checklist,
    readingTime: "12 min read",
    related: [
      { href: "/methodology", label: "Review the scoring method" },
      { href: "/audit/start", label: "Run a structured audit" },
      { href: "/tools", label: "Browse tools by category" }
    ],
    slug: "ai-tool-evaluation-checklist",
    title: "AI Tool Evaluation Checklist: Security, Pricing, ROI, and Rollout Questions",
    updatedAt: articleDates.checklist,
    blocks: [
      {
        body: [
          "Start by writing the job the tool is supposed to do. Not the category. Not the feature list. The job.",
          "A useful job statement sounds like this: help support reps draft accurate replies to refund questions, help sales reps turn call notes into follow-up emails, help operations classify inbound requests, or help marketers turn product notes into publishable drafts.",
          "If you cannot write the job in one sentence, the evaluation is probably too broad."
        ],
        heading: "Define the job before reviewing the tool",
        kind: "section"
      },
      {
        items: [
          "What business problem does this tool solve?",
          "Who will use it every week?",
          "What input data does it need?",
          "What output should it produce?",
          "Where does the output go?",
          "Who reviews or approves it?",
          "What metric will prove the pilot worked?"
        ],
        heading: "Workflow fit questions",
        kind: "checklist"
      },
      {
        body: [
          "Security evaluation should start with data type. Public marketing copy, internal meeting notes, customer messages, contracts, source code, payroll data, and medical information all carry different levels of risk.",
          "Ask whether your data is stored, used for training, shared with subprocessors, encrypted in transit and at rest, retained after deletion, and available for export. Ask whether admins can manage users, roles, and access. If the tool integrates with a system of record, check what permissions it requests.",
          "For early pilots, use the least sensitive data that still proves the workflow."
        ],
        heading: "Security and privacy questions",
        kind: "section"
      },
      {
        items: [
          "Does the vendor explain whether customer data is used for training?",
          "Can admins control retention or deletion?",
          "Can access be limited by role or workspace?",
          "Does the integration ask for more permissions than the workflow needs?",
          "Can the team export data if it leaves the tool?",
          "Is there an audit trail for important actions?",
          "What happens if a user leaves the company?"
        ],
        heading: "Data controls to verify",
        kind: "checklist"
      },
      {
        body: [
          "AI pricing is often difficult because usage units vary. One vendor charges seats, another charges credits, another charges tasks, another charges minutes, and another charges contacts or documents.",
          "Convert pricing into your workflow volume. If the team handles 1,000 tickets a month, estimate cost per ticket. If the tool summarizes meetings, estimate cost per recorded hour or participant. If it writes drafts, estimate cost per finished piece of work.",
          "Also include rollout costs: setup, training, data cleanup, integration work, and manager review time."
        ],
        heading: "Pricing and ROI questions",
        kind: "section"
      },
      {
        body: [
          "Integrations are where many AI tools become either valuable or painful. A tool that works beautifully in isolation may still add manual copying if it cannot connect to the systems your team uses.",
          "Ask what data flows in, what data flows out, whether sync is automatic or manual, how errors are handled, and whether users can review changes before they update a system of record.",
          "For the first pilot, a manual export may be acceptable. For daily use, the workflow needs to fit the places where people already work."
        ],
        heading: "Integration questions",
        kind: "section"
      },
      {
        body: [
          "A rollout plan should be small enough to finish. Choose a pilot group, define sample work, set review rules, and decide what success looks like.",
          "During the pilot, collect examples where the tool helped, where it failed, and where it created extra work. The failures are not only bugs. They are clues about training, prompt templates, permissions, data quality, and whether the workflow is a good fit.",
          "At the end, make a clear decision: expand, adjust, replace, or stop."
        ],
        heading: "Rollout questions",
        kind: "section"
      },
      {
        items: [
          "The vendor cannot explain data use in plain language.",
          "The demo depends on perfect inputs your team rarely has.",
          "Pricing changes sharply once normal usage is estimated.",
          "The tool requires broad permissions for a narrow task.",
          "There is no clear human review step for high-risk output.",
          "The workflow saves time for one person but creates work for another team.",
          "The team cannot name a metric that would prove value."
        ],
        heading: "Red flags",
        kind: "checklist"
      }
    ]
  }
];

export function getArticleBySlug(slug: string) {
  return articles.find((article) => article.slug === slug) ?? null;
}
