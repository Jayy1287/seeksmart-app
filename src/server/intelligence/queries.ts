import { PublishStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type PublicBusinessFunction = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  useCaseCount: number;
  opportunityCount: number;
};

export type PublicOpportunitySummary = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  painPoint: string | null;
  expectedBenefit: string | null;
  startingPoint: string | null;
  effortLevel: string;
  riskLevel: string;
  timeToValue: string | null;
  successMetrics: string[];
  businessFunction: {
    name: string;
    slug: string;
  } | null;
};

export type PublicIndustrySummary = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  startingPoint: string | null;
  cautions: string | null;
  opportunityCount: number;
};

export type PublicIndustryDetail = PublicIndustrySummary & {
  opportunities: PublicOpportunitySummary[];
};

export type PublicOpportunityDetail = PublicOpportunitySummary & {
  industries: PublicIndustrySummary[];
  useCases: Array<{
    id: string;
    name: string;
    slug: string;
    description: string | null;
    outcome: string | null;
    effortLevel: string;
    riskLevel: string;
    timeToValue: string | null;
  }>;
};

export async function listBusinessFunctions(): Promise<
  PublicBusinessFunction[]
> {
  const records = await prisma.businessFunction.findMany({
    where: {
      status: PublishStatus.PUBLISHED
    },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      _count: {
        select: {
          useCases: true,
          opportunities: {
            where: {
              status: PublishStatus.PUBLISHED
            }
          }
        }
      }
    },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }]
  });

  return records.map((record) => ({
    id: record.id,
    name: record.name,
    slug: record.slug,
    description: record.description,
    useCaseCount: record._count.useCases,
    opportunityCount: record._count.opportunities
  }));
}

export async function listIndustrySummaries(): Promise<
  PublicIndustrySummary[]
> {
  const records = await prisma.industry.findMany({
    where: {
      status: PublishStatus.PUBLISHED
    },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      startingPoint: true,
      cautions: true,
      _count: {
        select: {
          industryOpportunities: true
        }
      }
    },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }]
  });

  return records.map((record) => ({
    id: record.id,
    name: record.name,
    slug: record.slug,
    description: record.description,
    startingPoint: record.startingPoint,
    cautions: record.cautions,
    opportunityCount: record._count.industryOpportunities
  }));
}

export async function getIndustryBySlug(
  slug: string
): Promise<PublicIndustryDetail | null> {
  const record = await prisma.industry.findFirst({
    where: {
      slug,
      status: PublishStatus.PUBLISHED
    },
    include: {
      industryOpportunities: {
        where: {
          opportunity: {
            status: PublishStatus.PUBLISHED
          }
        },
        include: {
          opportunity: {
            include: {
              businessFunction: {
                select: {
                  name: true,
                  slug: true
                }
              }
            }
          }
        },
        orderBy: {
          priority: "asc"
        }
      },
      _count: {
        select: {
          industryOpportunities: true
        }
      }
    }
  });

  if (!record) {
    return null;
  }

  return {
    id: record.id,
    name: record.name,
    slug: record.slug,
    description: record.description,
    startingPoint: record.startingPoint,
    cautions: record.cautions,
    opportunityCount: record._count.industryOpportunities,
    opportunities: record.industryOpportunities.map(({ opportunity }) =>
      toOpportunitySummary(opportunity)
    )
  };
}

export async function listOpportunitySummaries(): Promise<
  PublicOpportunitySummary[]
> {
  const records = await prisma.opportunity.findMany({
    where: {
      status: PublishStatus.PUBLISHED
    },
    include: {
      businessFunction: {
        select: {
          name: true,
          slug: true
        }
      }
    },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }]
  });

  return records.map(toOpportunitySummary);
}

export async function getOpportunityBySlug(
  slug: string
): Promise<PublicOpportunityDetail | null> {
  const record = await prisma.opportunity.findFirst({
    where: {
      slug,
      status: PublishStatus.PUBLISHED
    },
    include: {
      businessFunction: {
        select: {
          name: true,
          slug: true
        }
      },
      industryOpportunities: {
        include: {
          industry: {
            select: {
              id: true,
              name: true,
              slug: true,
              description: true,
              startingPoint: true,
              cautions: true,
              _count: {
                select: {
                  industryOpportunities: true
                }
              }
            }
          }
        },
        orderBy: {
          priority: "asc"
        }
      },
      opportunityUseCases: {
        include: {
          useCase: {
            select: {
              id: true,
              name: true,
              slug: true,
              description: true,
              outcome: true,
              effortLevel: true,
              riskLevel: true,
              timeToValue: true
            }
          }
        },
        orderBy: {
          priority: "asc"
        }
      }
    }
  });

  if (!record) {
    return null;
  }

  return {
    ...toOpportunitySummary(record),
    industries: record.industryOpportunities.map(({ industry }) => ({
      id: industry.id,
      name: industry.name,
      slug: industry.slug,
      description: industry.description,
      startingPoint: industry.startingPoint,
      cautions: industry.cautions,
      opportunityCount: industry._count.industryOpportunities
    })),
    useCases: record.opportunityUseCases.map(({ useCase }) => ({
      id: useCase.id,
      name: useCase.name,
      slug: useCase.slug,
      description: useCase.description,
      outcome: useCase.outcome,
      effortLevel: useCase.effortLevel,
      riskLevel: useCase.riskLevel,
      timeToValue: useCase.timeToValue
    }))
  };
}

function toOpportunitySummary(record: {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  painPoint: string | null;
  expectedBenefit: string | null;
  startingPoint: string | null;
  effortLevel: string;
  riskLevel: string;
  timeToValue: string | null;
  successMetrics: string[];
  businessFunction: {
    name: string;
    slug: string;
  } | null;
}): PublicOpportunitySummary {
  return {
    id: record.id,
    name: record.name,
    slug: record.slug,
    description: record.description,
    painPoint: record.painPoint,
    expectedBenefit: record.expectedBenefit,
    startingPoint: record.startingPoint,
    effortLevel: record.effortLevel,
    riskLevel: record.riskLevel,
    timeToValue: record.timeToValue,
    successMetrics: record.successMetrics,
    businessFunction: record.businessFunction
  };
}
