// Hand-written depth for the industries SeekSmart goes deep on first.
// Rendered on /industries/[slug] when a guide exists for the slug; other
// industries keep the database-driven summary only.

export type IndustryGuideWorkflow = {
  name: string;
  useCaseSlug: string;
  whatChanges: string;
  measure: string;
  effort: "Low" | "Medium" | "High";
  risk: "Low" | "Medium" | "High";
  firstWeek: string;
};

export type IndustryGuide = {
  slug: string;
  headline: string;
  answerFirst: string;
  whoThisIsFor: string;
  workflows: IndustryGuideWorkflow[];
  skipFor: string[];
  dataRules: string[];
  faq: Array<{ question: string; answer: string }>;
  updatedAt: string;
};

export const industryGuides: IndustryGuide[] = [
  {
    slug: "ecommerce",
    headline: "AI for online stores: where it pays back first",
    answerFirst:
      "For most online stores the first AI win is not a chatbot. It is drafting: product descriptions, support replies, and the weekly numbers summary. Those three are high volume, easy to review, and measurable inside two weeks. Automated customer-facing agents come later, once a human-reviewed pilot has shown the answers are accurate.",
    whoThisIsFor:
      "Stores on Shopify, WooCommerce, Magento or a marketplace, with one to twenty people, where the owner or a small team handles listings, support and marketing themselves.",
    workflows: [
      {
        name: "Product descriptions and listing copy",
        useCaseSlug: "copywriting",
        whatChanges:
          "A writing assistant drafts titles, descriptions, bullet points and meta descriptions from your spec sheet or supplier data. A person edits and approves before publishing.",
        measure: "Listings published per week, and time per listing",
        effort: "Low",
        risk: "Low",
        firstWeek:
          "Pick 20 products with thin or missing copy. Write a one-page style guide (tone, banned claims, required facts). Draft, edit, publish, and time it."
      },
      {
        name: "Support reply drafting",
        useCaseSlug: "customer-support",
        whatChanges:
          "AI drafts replies to the common tickets (where is my order, returns, sizing, product questions) using your policies and order data. The agent reviews and sends.",
        measure: "First reply time and tickets handled per hour",
        effort: "Medium",
        risk: "Medium",
        firstWeek:
          "Export the last 100 tickets, group them by topic, and write the policy answer for the top ten. Test drafts on 20 real tickets before touching the live inbox."
      },
      {
        name: "Returns and feedback summaries",
        useCaseSlug: "customer-feedback-analysis",
        whatChanges:
          "Reviews, return reasons and support tags are summarized weekly into the top complaints and the products behind them.",
        measure: "Return rate for the top three flagged products",
        effort: "Low",
        risk: "Low",
        firstWeek:
          "Paste last month's reviews and return reasons into one document and ask for the top five issues with example quotes. Check them against what you already suspected."
      },
      {
        name: "Weekly performance narrative",
        useCaseSlug: "executive-reporting",
        whatChanges:
          "Sales, ad spend, conversion and stock numbers are turned into a short written summary with the three things that changed and why.",
        measure: "Hours spent on the weekly report",
        effort: "Low",
        risk: "Low",
        firstWeek:
          "Export one week of sales and ad data to a sheet. Ask for a 200-word summary and compare it with what you would have written."
      },
      {
        name: "Supervised support agent",
        useCaseSlug: "ai-customer-service-agents",
        whatChanges:
          "A bot answers order status, shipping and returns questions directly, with hard limits on what it may promise and an instant handoff to a person.",
        measure: "Share of tickets resolved without a human, and complaint rate",
        effort: "High",
        risk: "High",
        firstWeek:
          "Do not start here. Run the reply-drafting pilot first; its approved answers become the agent's knowledge base."
      }
    ],
    skipFor: [
      "Pricing and discount decisions. Keep these rule-based and reviewed; AI-written promotions create margin mistakes fast.",
      "Anything that publishes to customers without a person reading it, until a reviewed pilot has run for at least two weeks.",
      "Replacing your product photography with generated images for real products; it is a returns and trust problem."
    ],
    dataRules: [
      "Never paste full customer records or payment details into a general chat tool. Use order numbers and the facts needed for the reply.",
      "Keep one approved policy document (shipping, returns, warranties) as the only source for customer-facing answers.",
      "Log every AI-drafted message that was sent, so you can audit a complaint."
    ],
    faq: [
      {
        question: "Should an online store start with a chatbot?",
        answer:
          "Usually no. A chatbot that answers wrongly costs more than it saves. Start with AI-drafted replies that a person sends; after two weeks you will know which answers are safe to automate."
      },
      {
        question: "Which tools fit a small store budget?",
        answer:
          "A general assistant on a free or low plan covers descriptions, summaries and reply drafts. Pay for a help-desk AI only when ticket volume is daily and the free plan has proven the answers."
      },
      {
        question: "How do I measure whether it worked?",
        answer:
          "Record the baseline before you start: listings per week, first reply time, hours on reporting. Compare after two weeks with the same measure. The audit builds this into the pilot plan."
      }
    ],
    updatedAt: "2026-10-10"
  },
  {
    slug: "retail-and-hospitality",
    headline: "AI for shops, restaurants and venues: practical first steps",
    answerFirst:
      "For a local shop, cafe or venue, AI pays back first on the work that happens after closing: replying to reviews, writing the week's posts and emails, and turning till and booking data into a readable weekly summary. None of that touches a customer directly, which is why it is the safe place to start.",
    whoThisIsFor:
      "Independent retailers, restaurants, cafes, bars, salons, gyms and venues with a few staff, where the owner or manager still does marketing, admin and reporting in the evenings.",
    workflows: [
      {
        name: "Review and message replies",
        useCaseSlug: "customer-support",
        whatChanges:
          "Google, TripAdvisor and social reviews get a drafted, on-brand reply within a day. A manager edits and posts.",
        measure: "Share of reviews answered within 48 hours",
        effort: "Low",
        risk: "Low",
        firstWeek:
          "Collect your last 30 reviews and three replies you were proud of. Draft replies for the next ten reviews, edit, post, and note how long it took."
      },
      {
        name: "Weekly posts, menus and promotions",
        useCaseSlug: "social-media-content",
        whatChanges:
          "A month of social posts, a newsletter and seasonal menu or promo copy are drafted from a short brief, then edited to sound like you.",
        measure: "Posts published per week and time spent on them",
        effort: "Low",
        risk: "Low",
        firstWeek:
          "Write a half-page brand brief: who you are, what you never say, three example posts. Draft two weeks of posts and schedule them."
      },
      {
        name: "Weekly numbers summary",
        useCaseSlug: "executive-reporting",
        whatChanges:
          "Sales by day and category, bookings, labour hours and stock alerts are turned into a short summary with what changed and what to do about it.",
        measure: "Hours spent on the weekly review",
        effort: "Low",
        risk: "Low",
        firstWeek:
          "Export one week of till or booking data. Ask for a summary and a list of three questions it raises. See if the questions are the right ones."
      },
      {
        name: "Rota, hiring and admin drafts",
        useCaseSlug: "recruiting-support",
        whatChanges:
          "Job ads, interview questions, shift handover notes and supplier emails are drafted from templates and checked by the manager.",
        measure: "Time from vacancy to first interview",
        effort: "Low",
        risk: "Medium",
        firstWeek:
          "Take the last job ad you wrote and have it redrafted for three channels. Keep a human on every candidate reply."
      },
      {
        name: "Bookings and enquiries assistant",
        useCaseSlug: "ai-customer-service-agents",
        whatChanges:
          "A bot answers opening hours, availability and menu questions on your website and messaging channels, with a clear handoff for anything else.",
        measure: "Enquiries answered outside opening hours, and complaint rate",
        effort: "Medium",
        risk: "High",
        firstWeek:
          "Only after the review-reply pilot. Start with a fixed set of ten questions and refuse everything else politely."
      }
    ],
    skipFor: [
      "Food safety, allergen and licensing content. Write these yourself and check them with the source regulations.",
      "Automated replies to complaints. Draft with AI if you like, but a person must read and send every complaint response.",
      "Dynamic pricing or discount automation before you have clean sales data by hour and item."
    ],
    dataRules: [
      "Do not paste customer names, phone numbers or card details into a general assistant. Use first names and the facts of the booking only.",
      "Keep staff and payroll data out of any tool that is not already your HR or payroll system.",
      "Keep one source of truth for hours, prices and menus so AI-written content cannot drift from reality."
    ],
    faq: [
      {
        question: "We are small. Is AI even worth it for a single shop?",
        answer:
          "Yes, if you pick the two or three hours a week you hate most, usually reviews, posts and the weekly numbers. That is where a free or cheap assistant pays back within a month."
      },
      {
        question: "Do we need special restaurant or retail AI software?",
        answer:
          "Not to start. Your point-of-sale, booking and review platforms are adding AI features; a general assistant plus those built-in features covers the first pilots. Buy a dedicated tool only when a pilot shows daily volume."
      },
      {
        question: "What should we never automate?",
        answer:
          "Complaints, allergen and safety information, and anything about money owed. These stay human, with AI at most drafting for review."
      }
    ],
    updatedAt: "2026-10-10"
  },
  {
    slug: "local-services",
    headline: "AI for local service businesses: faster follow-up, fewer admin hours",
    answerFirst:
      "For trades, clinics, salons, agencies and other local services, the first AI win is speed to lead: drafting a reply and a quote within minutes of an enquiry, then chasing it. After that comes the admin that eats evenings: review replies, invoices, and proposal drafts. Automated booking agents come once the replies have been reviewed for a few weeks.",
    whoThisIsFor:
      "Owner-led service businesses with one to twenty people: trades, cleaning, clinics, salons, tutors, small agencies, accountants and consultants, where enquiries arrive by phone, form, email and WhatsApp.",
    workflows: [
      {
        name: "Enquiry replies and quote drafts",
        useCaseSlug: "lead-enrichment",
        whatChanges:
          "New enquiries get a drafted reply and a first quote or proposal within minutes, built from your price list and past jobs. You check and send.",
        measure: "Time from enquiry to first reply, and quotes sent per week",
        effort: "Medium",
        risk: "Medium",
        firstWeek:
          "Collect your last 20 enquiries and the replies that won work. Write a price and scope sheet. Draft replies for this week's enquiries and time each one."
      },
      {
        name: "Review responses and local content",
        useCaseSlug: "social-media-content",
        whatChanges:
          "Reviews get on-brand replies, and before-and-after posts, service pages and local area pages are drafted from your job notes.",
        measure: "Reviews answered within 48 hours; posts per week",
        effort: "Low",
        risk: "Low",
        firstWeek:
          "Draft replies to all unanswered reviews and two posts from recent jobs. Edit for accuracy; never invent details of a job."
      },
      {
        name: "Proposals and job summaries",
        useCaseSlug: "document-extraction",
        whatChanges:
          "Site notes, call recordings and emails are turned into a structured proposal or job summary for the client and for your own records.",
        measure: "Hours per proposal; proposals sent per month",
        effort: "Medium",
        risk: "Low",
        firstWeek:
          "Take three recent jobs and have the notes turned into summaries. Compare them with what you sent the client."
      },
      {
        name: "Invoices, receipts and chasing",
        useCaseSlug: "accounts-payable-automation",
        whatChanges:
          "Receipts are categorized, invoices drafted from job summaries, and polite payment reminders scheduled, all inside or next to your accounting tool.",
        measure: "Days from job complete to invoice sent; average days to paid",
        effort: "Low",
        risk: "Medium",
        firstWeek:
          "Use your accounting tool's built-in AI first. Draft reminders for overdue invoices and send the ones you approve."
      },
      {
        name: "Booking and enquiry assistant",
        useCaseSlug: "ai-customer-service-agents",
        whatChanges:
          "A bot or voice agent qualifies enquiries and books slots within rules you set, handing anything unusual to a person.",
        measure: "Enquiries captured out of hours; booking conversion",
        effort: "High",
        risk: "High",
        firstWeek:
          "Not week one. Run the reply-drafting pilot first; the approved replies and price sheet become the agent's rules."
      }
    ],
    skipFor: [
      "Clinical, legal or financial advice in replies. AI can draft logistics and pricing; the professional writes the advice.",
      "Letting an agent commit to prices or appointment times before your price sheet and calendar rules are written down.",
      "Mass outbound messages. Local reputation is the asset; one bad automated message costs more than the time saved."
    ],
    dataRules: [
      "Keep client health, legal and financial details out of general assistants. Use the enquiry facts only.",
      "Record consent before using call recordings for summaries.",
      "One price and scope sheet is the only source for any quote AI drafts."
    ],
    faq: [
      {
        question: "What is the single best first pilot for a service business?",
        answer:
          "Reply speed. Enquiries answered within minutes convert far better than the next day. Draft the reply and quote with AI, review, send, and measure time to first reply for two weeks."
      },
      {
        question: "Should I use an AI phone agent?",
        answer:
          "Later. First make sure your written replies, price sheet and booking rules are solid, because the agent will only be as good as those. Then pilot it on out-of-hours calls with a clear handoff."
      },
      {
        question: "Which tools should a small service business compare?",
        answer:
          "A general assistant for drafts, your CRM or booking tool's built-in AI for follow-ups, and your accounting tool's AI for invoices. Compare dedicated tools only when one workflow is daily and measured."
      }
    ],
    updatedAt: "2026-10-10"
  }
];

export function getIndustryGuide(slug: string) {
  return industryGuides.find((guide) => guide.slug === slug) ?? null;
}
