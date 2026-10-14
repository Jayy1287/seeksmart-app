import type { Metadata } from "next";
import { AuditAnalyticsEvent } from "@/features/audit/audit-analytics";
import { AuditWizard } from "@/features/audit/audit-wizard";
import { requireUser } from "@/server/auth/require-user";
import { getAuditOptions } from "@/server/recommendations/queries";

// Running the audit needs an account, so this page renders per request.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "AI Audit Questions",
  description:
    "Answer eleven short questions and get a ranked list of AI opportunities for your business. Free with a SeekSmart account.",
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
  const params = await searchParams;
  const requestedIndustry = single(params.industry);
  const requestedFunction = single(params.function);
  await requireUser(questionsPath(requestedIndustry, requestedFunction));
  const options = await getAuditOptions();
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

function questionsPath(industry?: string, businessFunction?: string) {
  const query = new URLSearchParams();
  if (industry) query.set("industry", industry);
  if (businessFunction) query.set("function", businessFunction);
  const search = query.toString();
  return search ? `/audit/questions?${search}` : "/audit/questions";
}

function single(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
