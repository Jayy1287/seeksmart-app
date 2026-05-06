import { PublishStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { AuditDataset } from "./scoring";

export async function getAuditOptions() {
  const [industries, businessFunctions] = await Promise.all([
    prisma.industry.findMany({
      where: {
        status: PublishStatus.PUBLISHED
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true
      },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }]
    }),
    prisma.businessFunction.findMany({
      where: {
        status: PublishStatus.PUBLISHED
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true
      },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }]
    })
  ]);

  return {
    industries,
    businessFunctions
  };
}

export async function getAuditDataset(): Promise<AuditDataset> {
  const [industries, businessFunctions, opportunities] = await Promise.all([
    prisma.industry.findMany({
      where: {
        status: PublishStatus.PUBLISHED
      },
      select: {
        id: true,
        name: true,
        slug: true,
        cautions: true
      },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }]
    }),
    prisma.businessFunction.findMany({
      where: {
        status: PublishStatus.PUBLISHED
      },
      select: {
        id: true,
        name: true,
        slug: true
      },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }]
    }),
    prisma.opportunity.findMany({
      where: {
        status: PublishStatus.PUBLISHED
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        painPoint: true,
        expectedBenefit: true,
        startingPoint: true,
        effortLevel: true,
        riskLevel: true,
        timeToValue: true,
        successMetrics: true,
        businessFunction: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        industryOpportunities: {
          select: {
            priority: true,
            industry: {
              select: {
                id: true,
                name: true,
                slug: true
              }
            }
          },
          orderBy: {
            priority: "asc"
          }
        },
        opportunityUseCases: {
          select: {
            priority: true,
            useCase: {
              select: {
                id: true,
                name: true,
                slug: true,
                outcome: true,
                effortLevel: true,
                riskLevel: true,
                timeToValue: true,
                toolUseCases: {
                  where: {
                    tool: {
                      status: PublishStatus.PUBLISHED
                    }
                  },
                  select: {
                    fitScore: true,
                    recommendationNote: true,
                    bestFor: true,
                    limitations: true,
                    pricingSuitability: true,
                    tool: {
                      select: {
                        id: true,
                        name: true,
                        slug: true,
                        logoUrl: true,
                        pricingType: true,
                        hasFreePlan: true,
                        popularityScore: true,
                        isVerified: true,
                        category: {
                          select: {
                            name: true
                          }
                        }
                      }
                    }
                  },
                  orderBy: {
                    fitScore: "desc"
                  }
                }
              }
            }
          },
          orderBy: {
            priority: "asc"
          }
        }
      },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }]
    })
  ]);

  return {
    industries,
    businessFunctions,
    opportunities: opportunities.map((opportunity) => ({
      id: opportunity.id,
      name: opportunity.name,
      slug: opportunity.slug,
      description: opportunity.description,
      painPoint: opportunity.painPoint,
      expectedBenefit: opportunity.expectedBenefit,
      startingPoint: opportunity.startingPoint,
      effortLevel: opportunity.effortLevel,
      riskLevel: opportunity.riskLevel,
      timeToValue: opportunity.timeToValue,
      successMetrics: opportunity.successMetrics,
      businessFunction: opportunity.businessFunction,
      industries: opportunity.industryOpportunities.map(
        ({ industry, priority }) => ({
          ...industry,
          priority
        })
      ),
      useCases: opportunity.opportunityUseCases.map(({ useCase }) => ({
        id: useCase.id,
        name: useCase.name,
        slug: useCase.slug,
        outcome: useCase.outcome,
        effortLevel: useCase.effortLevel,
        riskLevel: useCase.riskLevel,
        timeToValue: useCase.timeToValue,
        toolFits: useCase.toolUseCases.map((toolUseCase) => ({
          ...toolUseCase,
          tool: {
            ...toolUseCase.tool,
            pricingType: toolUseCase.tool.pricingType
          }
        }))
      }))
    }))
  };
}
