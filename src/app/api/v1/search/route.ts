import { NextResponse } from "next/server";
import { PublishStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { playbooks } from "@/lib/platform-content";
import type {
  CommandSearchGroup,
  CommandSearchItem,
  CommandSearchResponse
} from "@/shared/command-search";

const maxItemsPerGroup = 5;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim() ?? "";

  if (query.length < 2) {
    return NextResponse.json({ groups: [] } satisfies CommandSearchResponse);
  }

  const textFilter = {
    contains: query,
    mode: "insensitive" as const
  };

  const [tools, useCases, industries, opportunities] = await Promise.all([
    prisma.tool.findMany({
      where: {
        status: PublishStatus.PUBLISHED,
        OR: [
          { name: textFilter },
          { shortDescription: textFilter },
          { longDescription: textFilter }
        ]
      },
      select: {
        id: true,
        name: true,
        shortDescription: true,
        slug: true
      },
      orderBy: [
        { isFeatured: "desc" },
        { popularityScore: "desc" },
        { isVerified: "desc" }
      ],
      take: maxItemsPerGroup
    }),
    prisma.useCase.findMany({
      where: {
        OR: [
          { name: textFilter },
          { description: textFilter },
          { outcome: textFilter }
        ]
      },
      select: {
        description: true,
        id: true,
        name: true,
        outcome: true,
        slug: true
      },
      orderBy: { name: "asc" },
      take: maxItemsPerGroup
    }),
    prisma.industry.findMany({
      where: {
        status: PublishStatus.PUBLISHED,
        OR: [
          { name: textFilter },
          { description: textFilter },
          { startingPoint: textFilter }
        ]
      },
      select: {
        description: true,
        id: true,
        name: true,
        slug: true
      },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      take: maxItemsPerGroup
    }),
    prisma.opportunity.findMany({
      where: {
        status: PublishStatus.PUBLISHED,
        OR: [
          { name: textFilter },
          { description: textFilter },
          { painPoint: textFilter },
          { expectedBenefit: textFilter }
        ]
      },
      select: {
        description: true,
        expectedBenefit: true,
        id: true,
        name: true,
        slug: true
      },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      take: maxItemsPerGroup
    })
  ]);

  const normalizedQuery = query.toLowerCase();
  const playbookItems = playbooks
    .filter((playbook) =>
      [playbook.title, playbook.description, playbook.outcome]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery)
    )
    .slice(0, maxItemsPerGroup)
    .map(
      (playbook): CommandSearchItem => ({
        description: playbook.description,
        href: `/playbooks/${playbook.slug}`,
        id: playbook.slug,
        label: playbook.title,
        type: "playbook"
      })
    );

  const groups: CommandSearchGroup[] = [
    {
      heading: "Tools",
      items: tools.map(
        (tool): CommandSearchItem => ({
          description: tool.shortDescription,
          href: `/tools/${tool.slug}`,
          id: tool.id,
          label: tool.name,
          type: "tool"
        })
      )
    },
    {
      heading: "Use Cases",
      items: useCases.map(
        (useCase): CommandSearchItem => ({
          description: useCase.outcome ?? useCase.description,
          href: `/use-cases/${useCase.slug}`,
          id: useCase.id,
          label: useCase.name,
          type: "use-case"
        })
      )
    },
    {
      heading: "Industries",
      items: industries.map(
        (industry): CommandSearchItem => ({
          description: industry.description,
          href: `/industries/${industry.slug}`,
          id: industry.id,
          label: industry.name,
          type: "industry"
        })
      )
    },
    {
      heading: "Opportunities",
      items: opportunities.map(
        (opportunity): CommandSearchItem => ({
          description: opportunity.expectedBenefit ?? opportunity.description,
          href: `/opportunities/${opportunity.slug}`,
          id: opportunity.id,
          label: opportunity.name,
          type: "opportunity"
        })
      )
    },
    {
      heading: "Playbooks",
      items: playbookItems
    }
  ].filter((group) => group.items.length > 0);

  return NextResponse.json({ groups } satisfies CommandSearchResponse);
}
