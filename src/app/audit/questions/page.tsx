import type { Metadata } from "next";
import { AuditAnalyticsEvent } from "@/features/audit/audit-analytics";
import { AuditWizard } from "@/features/audit/audit-wizard";
import { getAuditOptions } from "@/server/recommendations/queries";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "AI Audit Questions",
  description:
    "Answer eleven short questions and get a ranked list of AI opportunities for your business, free and without an account.",
  robots: {
    index: false,
    follow: false
  },
  alternates: {
    canonical: "/audit/questions"
  }
};

type AuditQuestionsPageProps = {
  searchParams: Promise<{
    industry?: string | string[];
    function?: string | string[];
  }>;
};

export default async function AuditQuestionsPage({
  searchParams
}: AuditQuestionsPageProps) {
  const [params, options] = await Promise.all([searchParams, getAuditOptions()]);
  const requestedIndustry = single(params.industry);
  const requestedFunction = single(params.function);
  const initialIndustrySlug = options.industries.some(
    (industry) => industry.slug === requestedIndustry
  )
    ? requestedIndustry
    : undefined;
  const initialFunctionSlug = options.businessFunctions.some(
    (businessFunction) => businessFunction.slug === requestedFunction
  )
    ? requestedFunction
    : undefined;

  return (
    <main>
      <AuditAnalyticsEvent event="audit_questions_viewed" />
      <AuditWizard
        businessFunctions={options.businessFunctions}
        industries={options.industries}
        initialFunctionSlug={initialFunctionSlug}
        initialIndustrySlug={initialIndustrySlug}
      />
    </main>
  );
}

function single(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
