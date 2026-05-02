import { PrismaClient, PricingType, PublishStatus } from "@prisma/client";
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
  "Customer support"
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
  "Integrations"
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
  const useCaseRecords = new Map<string, string>();
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

  for (const useCase of useCases) {
    const record = await prisma.useCase.upsert({
      where: { slug: slugify(useCase) },
      update: {
        name: useCase
      },
      create: {
        name: useCase,
        slug: slugify(useCase)
      }
    });

    useCaseRecords.set(useCase, record.id);
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
        useCaseId: getRecordId(useCaseRecords, useCase, "use case")
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
