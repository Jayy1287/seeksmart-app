import type { Metadata } from "next";
import type { ReactNode } from "react";
import {
  AuditAnalyticsEvent,
  AuditSubmitButton
} from "@/features/audit/audit-analytics";
import {
  auditBudgetRanges,
  auditCompanySizes,
  auditDataSensitivityLevels,
  auditGoalOptions,
  auditPainPointOptions,
  auditTechnicalComfortLevels,
  auditUrgencyLevels
} from "@/shared/recommendations/audit";
import {
  budgetRangeLabel,
  companySizeLabel,
  dataSensitivityLabel,
  technicalComfortLabel,
  urgencyLabel
} from "@/server/recommendations/input";
import { getAuditOptions } from "@/server/recommendations/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "AI Audit Questions",
  description:
    "Answer a short structured intake for a rules-based AI recommendation brief.",
  alternates: {
    canonical: "/audit/questions"
  }
};

export default async function AuditQuestionsPage() {
  const { industries, businessFunctions } = await getAuditOptions();

  return (
    <main className="page-shell">
      <AuditAnalyticsEvent event="audit_questions_viewed" />
      <div className="app-container">
        <section className="hero-panel rounded-2xl p-6 md:p-8">
          <p className="eyebrow">Audit questions</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight tracking-[-0.01em] md:text-5xl">
            Tell SeekSmart what business context to score.
          </h1>
          <p className="mt-3 max-w-2xl leading-7 text-ink/65">
            Keep answers high-level. V1 generates an anonymous rules-based
            report and does not save your audit.
          </p>
        </section>

        <form
          action="/audit/results"
          className="surface-panel mt-6 grid gap-7 rounded-2xl p-5 md:p-7"
          method="get"
        >
          <fieldset className="grid gap-4 md:grid-cols-2">
            <FieldLabel label="Industry">
              <select className="control-field w-full" name="industry" required>
                {industries.map((industry) => (
                  <option key={industry.id} value={industry.slug}>
                    {industry.name}
                  </option>
                ))}
              </select>
            </FieldLabel>
            <FieldLabel label="Business function">
              <select className="control-field w-full" name="function" required>
                {businessFunctions.map((businessFunction) => (
                  <option
                    key={businessFunction.id}
                    value={businessFunction.slug}
                  >
                    {businessFunction.name}
                  </option>
                ))}
              </select>
            </FieldLabel>
          </fieldset>

          <fieldset className="grid gap-4 md:grid-cols-2">
            <FieldLabel label="Company size">
              <select className="control-field w-full" name="size">
                {auditCompanySizes.map((size) => (
                  <option key={size} value={size}>
                    {companySizeLabel(size)}
                  </option>
                ))}
              </select>
            </FieldLabel>
            <FieldLabel label="Urgency">
              <select className="control-field w-full" name="urgency">
                {auditUrgencyLevels.map((urgency) => (
                  <option key={urgency} value={urgency}>
                    {urgencyLabel(urgency)}
                  </option>
                ))}
              </select>
            </FieldLabel>
          </fieldset>

          <fieldset>
            <legend className="text-sm font-semibold text-ink/72">
              Main goals
            </legend>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              {auditGoalOptions.map((goal, index) => (
                <CheckOption
                  defaultChecked={index === 0}
                  key={goal.id}
                  label={goal.label}
                  name="goals"
                  value={goal.id}
                />
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-sm font-semibold text-ink/72">
              Current pain points
            </legend>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              {auditPainPointOptions.map((painPoint, index) => (
                <CheckOption
                  defaultChecked={index === 0}
                  key={painPoint.id}
                  label={painPoint.label}
                  name="pain"
                  value={painPoint.id}
                />
              ))}
            </div>
          </fieldset>

          <fieldset className="grid gap-4 md:grid-cols-3">
            <FieldLabel label="Budget range">
              <select className="control-field w-full" name="budget">
                {auditBudgetRanges.map((budget) => (
                  <option key={budget} value={budget}>
                    {budgetRangeLabel(budget)}
                  </option>
                ))}
              </select>
            </FieldLabel>
            <FieldLabel label="Technical comfort">
              <select className="control-field w-full" name="technical">
                {auditTechnicalComfortLevels.map((comfort) => (
                  <option key={comfort} value={comfort}>
                    {technicalComfortLabel(comfort)}
                  </option>
                ))}
              </select>
            </FieldLabel>
            <FieldLabel label="Data sensitivity">
              <select className="control-field w-full" name="data">
                {auditDataSensitivityLevels.map((sensitivity) => (
                  <option key={sensitivity} value={sensitivity}>
                    {dataSensitivityLabel(sensitivity)}
                  </option>
                ))}
              </select>
            </FieldLabel>
          </fieldset>

          <FieldLabel label="Existing tools or systems">
            <textarea
              className="control-field min-h-28 w-full py-3"
              name="tools"
              placeholder="Optional: CRM, help desk, docs, ecommerce platform, spreadsheets..."
            />
          </FieldLabel>

          <div className="flex flex-col gap-3 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm leading-6 text-ink/55">
              Your answers are used only to generate this browser-based result.
            </p>
            <AuditSubmitButton />
          </div>
        </form>
      </div>
    </main>
  );
}

function FieldLabel({
  children,
  label
}: {
  children: ReactNode;
  label: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-ink/72">
      {label}
      {children}
    </label>
  );
}

function CheckOption({
  defaultChecked,
  label,
  name,
  value
}: {
  defaultChecked?: boolean;
  label: string;
  name: string;
  value: string;
}) {
  return (
    <label className="flex min-h-14 items-center gap-3 rounded-lg border border-line bg-white/72 px-3 py-2 text-sm font-medium transition hover:border-accent">
      <input
        className="h-4 w-4 accent-[rgb(var(--color-accent))]"
        defaultChecked={defaultChecked}
        name={name}
        type="checkbox"
        value={value}
      />
      {label}
    </label>
  );
}
