import assert from "node:assert/strict";
import { scoreAudit, type AuditDataset } from "./scoring";
import type { AuditInput } from "@/shared/recommendations/audit";

const dataset: AuditDataset = {
  industries: [
    {
      id: "industry-ecommerce",
      name: "Ecommerce",
      slug: "ecommerce",
      cautions: "Review generated product and support claims before publishing."
    },
    {
      id: "industry-saas",
      name: "SaaS teams",
      slug: "saas-teams",
      cautions: null
    }
  ],
  businessFunctions: [
    {
      id: "function-support",
      name: "Customer Support",
      slug: "customer-support"
    },
    {
      id: "function-marketing",
      name: "Marketing",
      slug: "marketing"
    }
  ],
  opportunities: [
    {
      id: "opp-support",
      name: "Reduce support response time",
      slug: "reduce-support-response-time",
      description: "Answer repeated support questions faster.",
      painPoint: "Support teams lose time answering the same questions.",
      expectedBenefit: "Faster replies and fewer repeated manual answers.",
      startingPoint: "Group the last 50 support questions by topic.",
      effortLevel: "MEDIUM",
      riskLevel: "MEDIUM",
      timeToValue: "2-4 weeks",
      successMetrics: ["Response time", "Resolution rate"],
      businessFunction: {
        id: "function-support",
        name: "Customer Support",
        slug: "customer-support"
      },
      industries: [
        {
          id: "industry-ecommerce",
          name: "Ecommerce",
          slug: "ecommerce",
          priority: 0
        }
      ],
      useCases: [
        {
          id: "usecase-support",
          name: "Customer support",
          slug: "customer-support",
          outcome: "Faster, more consistent replies.",
          effortLevel: "MEDIUM",
          riskLevel: "MEDIUM",
          timeToValue: "2-4 weeks",
          toolFits: [
            {
              fitScore: 84,
              recommendationNote: "Best mapped fit for support drafting.",
              bestFor: "Support reply drafting",
              limitations: null,
              pricingSuitability: "moderate",
              tool: {
                id: "tool-helpdesk",
                name: "Helpdesk AI",
                slug: "helpdesk-ai",
                pricingType: "FREEMIUM",
                hasFreePlan: true,
                popularityScore: 70,
                isVerified: true,
                category: {
                  name: "Customer Support"
                }
              }
            }
          ]
        }
      ]
    },
    {
      id: "opp-content",
      name: "Create SEO content briefs",
      slug: "create-seo-content-briefs",
      description: "Generate repeatable SEO briefs and article outlines.",
      painPoint: "Content planning takes too long.",
      expectedBenefit: "Faster briefs and more consistent article planning.",
      startingPoint: "Define one content template.",
      effortLevel: "LOW",
      riskLevel: "LOW",
      timeToValue: "1-2 weeks",
      successMetrics: ["Brief creation time"],
      businessFunction: {
        id: "function-marketing",
        name: "Marketing",
        slug: "marketing"
      },
      industries: [
        {
          id: "industry-saas",
          name: "SaaS teams",
          slug: "saas-teams",
          priority: 0
        }
      ],
      useCases: []
    }
  ]
};

const supportInput: AuditInput = {
  industrySlug: "ecommerce",
  businessFunctionSlug: "customer-support",
  companySize: "small-team",
  goals: ["save-time", "improve-quality"],
  painPoints: ["manual-work", "slow-response"],
  budgetRange: "low",
  technicalComfort: "moderate",
  dataSensitivity: "moderate",
  urgency: "soon"
};

const supportResult = scoreAudit(supportInput, dataset);
assert.equal(
  supportResult.topOpportunities[0]?.slug,
  "reduce-support-response-time"
);
assert.equal(supportResult.topOpportunities[0]?.tools[0]?.slug, "helpdesk-ai");
assert.ok(
  supportResult.topOpportunities[0]?.reasons.some((reason) =>
    reason.includes("selected industry")
  )
);

const sensitiveInput: AuditInput = {
  ...supportInput,
  dataSensitivity: "high"
};
const sensitiveResult = scoreAudit(sensitiveInput, dataset);
assert.ok(
  sensitiveResult.topOpportunities[0]?.cautions.some((caution) =>
    caution.includes("sensitive information")
  )
);
assert.ok(
  sensitiveResult.nextStepChecklist.some((item) =>
    item.includes("what data can and cannot be used")
  )
);

console.log("Recommendation scoring tests passed.");
