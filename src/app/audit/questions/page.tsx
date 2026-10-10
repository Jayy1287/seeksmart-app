import type { Metadata } from "next";
import { ClipboardCheck } from "lucide-react";
import { AuditAnalyticsEvent } from "@/features/audit/audit-analytics";
import { AuditWizard } from "@/features/audit/audit-wizard";
import { getAuditOptions } from "@/server/recommendations/queries";
import { Reveal } from "@/components/motion/reveal";

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
    <main className="page-shell">
      <AuditAnalyticsEvent event="audit_questions_viewed" />
      <div className="app-container">
        <Reveal className="mx-auto max-w-3xl">
          <p className="eyebrow">
            <ClipboardCheck aria-hidden="true" size={14} />
            AI audit
          </p>
          <h1 className="mt-4 text-3xl font-semibold leading-tight md:text-4xl">
            Find the first AI workflow worth piloting.
          </h1>
          <p className="mt-2 text-sm leading-6 text-ink/60">
            Eleven quick questions. You get a readiness score and ranked
            opportunities on screen, free.
          </p>
        </Reveal>
        <Reveal className="mx-auto mt-6 max-w-3xl" delay={0.05}>
          <AuditWizard
            businessFunctions={options.businessFunctions}
            industries={options.industries}
            initialFunctionSlug={initialFunctionSlug}
            initialIndustrySlug={initialIndustrySlug}
          />
        </Reveal>
      </div>
    </main>
  );
}

function single(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
