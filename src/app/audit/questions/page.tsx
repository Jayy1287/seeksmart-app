import type { Metadata } from "next";
import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import {
  AuditAnalyticsEvent,
  AuditSubmitButton
} from "@/features/audit/audit-analytics";
import {
  auditApprovalModes,
  auditBudgetRanges,
  auditCompanySizes,
  auditDataReadinessLevels,
  auditDataSensitivityLevels,
  auditDecisionOwnerTypes,
  auditGoalOptions,
  auditIntegrationNeeds,
  auditPainPointOptions,
  auditTechnicalComfortLevels,
  auditUrgencyLevels,
  auditWorkflowVolumes,
  auditWorkflowMaturityLevels
} from "@/shared/recommendations/audit";
import {
  approvalModeLabel,
  budgetRangeLabel,
  companySizeLabel,
  dataReadinessLabel,
  dataSensitivityLabel,
  decisionOwnerLabel,
  technicalComfortLabel,
  urgencyLabel,
  workflowMaturityLabel,
  workflowVolumeLabel
} from "@/server/recommendations/input";
import { getAuditOptions } from "@/server/recommendations/queries";
import { MotionLabel } from "@/components/motion/motion-label";
import { Reveal } from "@/components/motion/reveal";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "AI Audit Questions",
  description:
    "Answer a short guided intake for a practical AI recommendation brief.",
  alternates: {
    canonical: "/audit/questions"
  }
};

export default async function AuditQuestionsPage() {
  const [session, options] = await Promise.all([auth(), getAuditOptions()]);

  if (!session?.user) {
    redirect("/login?callbackUrl=/audit/questions");
  }

  const { industries, businessFunctions } = options;

  return (
    <main className="page-shell">
      <AuditAnalyticsEvent event="audit_questions_viewed" />
      <div className="app-container">
        <Reveal className="border-b border-line/50 pb-8">
          <p className="eyebrow">Audit questions</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight md:text-5xl">
            Build a practical AI pilot brief.
          </h1>
          <p className="mt-3 max-w-2xl leading-7 text-ink/65">
            Share enough context for SeekSmart to rank opportunities, suggest a
            first workflow, and outline what to review before rollout.
          </p>
        </Reveal>

        <Reveal
          className="mt-8"
          delay={0.05}
        >
        <form
          action="/audit/results"
          className="grid gap-7 rounded-[1.75rem] border border-line/60 bg-white/45 p-5 shadow-[0_18px_60px_rgb(13_48_92/0.07)] backdrop-blur md:p-7"
          method="get"
        >
          <FormSection
            kicker="Step 1"
            title="Business context"
            description="Set the business context for the first pilot."
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

          <fieldset className="grid gap-4 md:grid-cols-3">
            <FieldLabel label="Company size">
              <select
                className="control-field w-full"
                defaultValue="small-team"
                name="size"
              >
                {auditCompanySizes.map((size) => (
                  <option key={size} value={size}>
                    {companySizeLabel(size)}
                  </option>
                ))}
              </select>
            </FieldLabel>
            <FieldLabel label="Workflow maturity">
              <select
                className="control-field w-full"
                defaultValue="documented"
                name="maturity"
              >
                {auditWorkflowMaturityLevels.map((maturity) => (
                  <option key={maturity} value={maturity}>
                    {workflowMaturityLabel(maturity)}
                  </option>
                ))}
              </select>
            </FieldLabel>
            <FieldLabel label="Urgency">
              <select
                className="control-field w-full"
                defaultValue="soon"
                name="urgency"
              >
                {auditUrgencyLevels.map((urgency) => (
                  <option key={urgency} value={urgency}>
                    {urgencyLabel(urgency)}
                  </option>
                ))}
              </select>
            </FieldLabel>
          </fieldset>
          </FormSection>

          <FormSection
            kicker="Step 2"
            title="Goals and friction"
            description="Choose what you want the pilot to improve first."
          >
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
          </FormSection>

          <FormSection
            kicker="Step 3"
            title="Constraints and systems"
            description="These answers shape the rollout risk, effort, and shortlist."
          >
          <fieldset className="grid gap-4 md:grid-cols-4">
            <FieldLabel label="Budget range">
              <select
                className="control-field w-full"
                defaultValue="moderate"
                name="budget"
              >
                {auditBudgetRanges.map((budget) => (
                  <option key={budget} value={budget}>
                    {budgetRangeLabel(budget)}
                  </option>
                ))}
              </select>
            </FieldLabel>
            <FieldLabel label="Technical comfort">
              <select
                className="control-field w-full"
                defaultValue="moderate"
                name="technical"
              >
                {auditTechnicalComfortLevels.map((comfort) => (
                  <option key={comfort} value={comfort}>
                    {technicalComfortLabel(comfort)}
                  </option>
                ))}
              </select>
            </FieldLabel>
            <FieldLabel label="Data sensitivity">
              <select
                className="control-field w-full"
                defaultValue="moderate"
                name="data"
              >
                {auditDataSensitivityLevels.map((sensitivity) => (
                  <option key={sensitivity} value={sensitivity}>
                    {dataSensitivityLabel(sensitivity)}
                  </option>
                ))}
              </select>
            </FieldLabel>
            <FieldLabel label="Approval mode">
              <select className="control-field w-full" name="approval">
                {auditApprovalModes.map((approval) => (
                  <option key={approval} value={approval}>
                    {approvalModeLabel(approval)}
                  </option>
                ))}
              </select>
            </FieldLabel>
          </fieldset>

          <fieldset>
            <legend className="text-sm font-semibold text-ink/72">
              Systems involved
            </legend>
            <div className="mt-3 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {auditIntegrationNeeds.map((need) => (
                <CheckOption
                  key={need.id}
                  label={need.label}
                  name="integrations"
                  value={need.id}
                />
              ))}
            </div>
          </fieldset>
          </FormSection>

          <FormSection
            kicker="Step 4"
            title="Pilot definition"
            description="Volume, data quality, ownership, timeline, and metric decide whether to pilot or prepare first."
          >
          <fieldset className="grid gap-4 md:grid-cols-3">
            <FieldLabel label="Workflow volume">
              <select
                className="control-field w-full"
                defaultValue="weekly"
                name="volume"
              >
                {auditWorkflowVolumes.map((volume) => (
                  <option key={volume} value={volume}>
                    {workflowVolumeLabel(volume)}
                  </option>
                ))}
              </select>
            </FieldLabel>
            <FieldLabel label="Data readiness">
              <select
                className="control-field w-full"
                defaultValue="accessible"
                name="readiness"
              >
                {auditDataReadinessLevels.map((readiness) => (
                  <option key={readiness} value={readiness}>
                    {dataReadinessLabel(readiness)}
                  </option>
                ))}
              </select>
            </FieldLabel>
            <FieldLabel label="Decision owner">
              <select className="control-field w-full" name="owner">
                {auditDecisionOwnerTypes.map((owner) => (
                  <option key={owner} value={owner}>
                    {decisionOwnerLabel(owner)}
                  </option>
                ))}
              </select>
            </FieldLabel>
          </fieldset>

          <fieldset className="grid gap-4 md:grid-cols-2">
            <FieldLabel label="Pilot timeline">
              <input
                className="control-field w-full"
                defaultValue="2 weeks"
                maxLength={80}
                name="timeline"
                placeholder="2 weeks"
              />
            </FieldLabel>
            <FieldLabel label="Success metric">
              <input
                className="control-field w-full"
                maxLength={160}
                name="metric"
                placeholder="Example: response time, draft turnaround, meetings booked"
              />
            </FieldLabel>
          </fieldset>

          <FieldLabel label="Existing tools or systems">
            <textarea
              className="control-field min-h-28 w-full py-3"
              maxLength={1200}
              name="tools"
              placeholder="Optional: CRM, help desk, docs, ecommerce platform, spreadsheets..."
            />
          </FieldLabel>
          </FormSection>

          <div className="flex flex-col gap-3 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm leading-6 text-ink/55">
              Signed-in results save automatically to your dashboard.
            </p>
            <AuditSubmitButton />
          </div>
        </form>
        </Reveal>
      </div>
    </main>
  );
}

function FormSection({
  children,
  description,
  kicker,
  title
}: {
  children: ReactNode;
  description: string;
  kicker: string;
  title: string;
}) {
  return (
    <Reveal className="grid gap-4 border-t border-line/60 pt-6 first:border-t-0 first:pt-0 lg:grid-cols-[240px_1fr]">
      <div>
        <p className="text-xs font-extrabold uppercase text-accent">{kicker}</p>
        <h2 className="mt-2 text-lg font-semibold">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-ink/55">{description}</p>
      </div>
      <div className="grid gap-5">{children}</div>
    </Reveal>
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
    <MotionLabel className="flex min-h-14 items-center gap-3 rounded-lg border border-line bg-white/72 px-3 py-2 text-sm font-medium transition hover:border-accent">
      <input
        className="h-4 w-4 accent-[rgb(var(--color-accent))]"
        defaultChecked={defaultChecked}
        name={name}
        type="checkbox"
        value={value}
      />
      {label}
    </MotionLabel>
  );
}
