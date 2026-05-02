import { PrismaClient, PricingType, PublishStatus } from "@prisma/client";
import { slugify } from "../src/lib/slug";

const prisma = new PrismaClient();

const categories = [
  {
    name: "Writing",
    description: "AI tools for drafting, editing, rewriting, and content workflows."
  },
  {
    name: "Productivity",
    description: "AI tools for notes, task management, calendars, and work automation."
  },
  {
    name: "Developer tools",
    description: "AI tools for coding, debugging, documentation, and engineering work."
  },
  {
    name: "Image generation",
    description: "AI tools for generating, editing, and improving visual assets."
  },
  {
    name: "Marketing",
    description: "AI tools for campaigns, SEO, analytics, and growth work."
  }
];

const tools = [
  {
    name: "ChatGPT",
    category: "Productivity",
    shortDescription: "General-purpose AI assistant for writing, analysis, coding, and research.",
    websiteUrl: "https://chatgpt.com",
    pricingType: PricingType.FREEMIUM,
    hasFreePlan: true,
    isVerified: true
  },
  {
    name: "Perplexity",
    category: "Productivity",
    shortDescription: "AI search assistant for answers with citations and web research.",
    websiteUrl: "https://www.perplexity.ai",
    pricingType: PricingType.FREEMIUM,
    hasFreePlan: true,
    isVerified: true
  },
  {
    name: "Cursor",
    category: "Developer tools",
    shortDescription: "AI code editor for pair programming, refactoring, and codebase navigation.",
    websiteUrl: "https://www.cursor.com",
    pricingType: PricingType.FREEMIUM,
    hasFreePlan: true,
    isVerified: true
  },
  {
    name: "Midjourney",
    category: "Image generation",
    shortDescription: "AI image generation tool for creative visuals and concept exploration.",
    websiteUrl: "https://www.midjourney.com",
    pricingType: PricingType.PAID,
    hasFreePlan: false,
    isVerified: false
  }
];

async function main() {
  const categoryRecords = new Map<string, string>();

  for (const category of categories) {
    const record = await prisma.category.upsert({
      where: { slug: slugify(category.name) },
      update: {
        description: category.description
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

  for (const tool of tools) {
    const categoryId = categoryRecords.get(tool.category);

    if (!categoryId) {
      throw new Error(`Missing category for ${tool.name}`);
    }

    await prisma.tool.upsert({
      where: { slug: slugify(tool.name) },
      update: {
        shortDescription: tool.shortDescription,
        websiteUrl: tool.websiteUrl,
        categoryId,
        pricingType: tool.pricingType,
        hasFreePlan: tool.hasFreePlan,
        isVerified: tool.isVerified,
        status: PublishStatus.PUBLISHED,
        publishedAt: new Date()
      },
      create: {
        name: tool.name,
        slug: slugify(tool.name),
        shortDescription: tool.shortDescription,
        longDescription: tool.shortDescription,
        websiteUrl: tool.websiteUrl,
        categoryId,
        pricingType: tool.pricingType,
        hasFreePlan: tool.hasFreePlan,
        isVerified: tool.isVerified,
        status: PublishStatus.PUBLISHED,
        publishedAt: new Date(),
        metaTitle: `${tool.name} review, pricing, use cases, and alternatives`,
        metaDescription: tool.shortDescription
      }
    });
  }
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
