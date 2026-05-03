"use client";

import { FormEvent, useState } from "react";
import type { ReactNode } from "react";
import { Plus, Save } from "lucide-react";
import type { AdminIntelligenceWorkspace } from "@/server/admin/queries";
import type { ApiResponse } from "@/shared/api";

type AdminIntelligenceWorkspaceProps = {
  workspace: AdminIntelligenceWorkspace;
};

type SaveState = "idle" | "submitting" | "success" | "error";

export function AdminIntelligenceWorkspace({
  workspace
}: AdminIntelligenceWorkspaceProps) {
  return (
    <div className="grid gap-6">
      <Section
        count={workspace.businessFunctions.length}
        description="Business functions group use cases and opportunities by operating area."
        title="Business functions"
      >
        <BusinessFunctionForm mode="create" />
        {workspace.businessFunctions.map((businessFunction) => (
          <BusinessFunctionForm
            businessFunction={businessFunction}
            key={businessFunction.id}
            mode="update"
          />
        ))}
      </Section>

      <Section
        count={workspace.industries.length}
        description="Industries provide business-specific starting points, cautions, and opportunity maps."
        title="Industries"
      >
        <IndustryForm mode="create" />
        {workspace.industries.map((industry) => (
          <IndustryForm industry={industry} key={industry.id} mode="update" />
        ))}
      </Section>

      <Section
        count={workspace.opportunities.length}
        description="Opportunities connect business pain points to use cases, industries, and measurable outcomes."
        title="Opportunities"
      >
        <OpportunityForm
          businessFunctions={workspace.businessFunctions}
          industries={workspace.industries}
          mode="create"
          useCases={workspace.useCases}
        />
        {workspace.opportunities.map((opportunity) => (
          <OpportunityForm
            businessFunctions={workspace.businessFunctions}
            industries={workspace.industries}
            key={opportunity.id}
            mode="update"
            opportunity={opportunity}
            useCases={workspace.useCases}
          />
        ))}
      </Section>

      <Section
        count={workspace.useCases.length}
        description="Use-case intelligence is the bridge between business opportunities and tool fit."
        title="Use-case metadata"
      >
        {workspace.useCases.map((useCase) => (
          <UseCaseForm
            businessFunctions={workspace.businessFunctions}
            key={useCase.id}
            useCase={useCase}
          />
        ))}
      </Section>
    </div>
  );
}

function Section({
  children,
  count,
  description,
  title
}: {
  children: ReactNode;
  count: number;
  description: string;
  title: string;
}) {
  return (
    <section className="surface-panel rounded-xl p-5">
      <div className="flex flex-col gap-3 border-b border-line pb-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-ink/60">
            {description}
          </p>
        </div>
        <div className="metric-tile w-fit rounded-xl px-4 py-3 text-sm">
          <span className="font-semibold">{count}</span> records
        </div>
      </div>
      <div className="mt-5 grid gap-4">{children}</div>
    </section>
  );
}

function BusinessFunctionForm({
  businessFunction,
  mode
}: {
  businessFunction?: AdminIntelligenceWorkspace["businessFunctions"][number];
  mode: "create" | "update";
}) {
  return (
    <RecordForm
      endpoint={
        mode === "create"
          ? "/api/admin/intelligence/business-functions"
          : `/api/admin/intelligence/business-functions/${businessFunction?.id}`
      }
      method={mode === "create" ? "POST" : "PATCH"}
      title={mode === "create" ? "Create business function" : businessFunction?.name ?? ""}
    >
      <TextInput defaultValue={businessFunction?.name} label="Name" name="name" required />
      <TextInput defaultValue={businessFunction?.slug} label="Slug" name="slug" />
      <TextArea
        defaultValue={businessFunction?.description}
        label="Description"
        name="description"
      />
      <Select defaultValue={businessFunction?.status} label="Status" name="status" />
      <NumberInput
        defaultValue={businessFunction?.sortOrder ?? 0}
        label="Sort order"
        name="sortOrder"
      />
    </RecordForm>
  );
}

function IndustryForm({
  industry,
  mode
}: {
  industry?: AdminIntelligenceWorkspace["industries"][number];
  mode: "create" | "update";
}) {
  return (
    <RecordForm
      endpoint={
        mode === "create"
          ? "/api/admin/intelligence/industries"
          : `/api/admin/intelligence/industries/${industry?.id}`
      }
      method={mode === "create" ? "POST" : "PATCH"}
      title={mode === "create" ? "Create industry" : industry?.name ?? ""}
    >
      <TextInput defaultValue={industry?.name} label="Name" name="name" required />
      <TextInput defaultValue={industry?.slug} label="Slug" name="slug" />
      <TextArea defaultValue={industry?.description} label="Description" name="description" />
      <TextArea
        defaultValue={industry?.startingPoint}
        label="Starting point"
        name="startingPoint"
      />
      <TextArea defaultValue={industry?.cautions} label="Cautions" name="cautions" />
      <Select defaultValue={industry?.status} label="Status" name="status" />
      <NumberInput defaultValue={industry?.sortOrder ?? 0} label="Sort order" name="sortOrder" />
      <TextInput defaultValue={industry?.metaTitle} label="Meta title" name="metaTitle" />
      <TextArea
        defaultValue={industry?.metaDescription}
        label="Meta description"
        name="metaDescription"
      />
    </RecordForm>
  );
}

function OpportunityForm({
  businessFunctions,
  industries,
  mode,
  opportunity,
  useCases
}: {
  businessFunctions: AdminIntelligenceWorkspace["businessFunctions"];
  industries: AdminIntelligenceWorkspace["industries"];
  mode: "create" | "update";
  opportunity?: AdminIntelligenceWorkspace["opportunities"][number];
  useCases: AdminIntelligenceWorkspace["useCases"];
}) {
  return (
    <RecordForm
      endpoint={
        mode === "create"
          ? "/api/admin/intelligence/opportunities"
          : `/api/admin/intelligence/opportunities/${opportunity?.id}`
      }
      method={mode === "create" ? "POST" : "PATCH"}
      title={mode === "create" ? "Create opportunity" : opportunity?.name ?? ""}
    >
      <TextInput defaultValue={opportunity?.name} label="Name" name="name" required />
      <TextInput defaultValue={opportunity?.slug} label="Slug" name="slug" />
      <SelectOptions
        defaultValue={opportunity?.businessFunctionId ?? ""}
        items={businessFunctions}
        label="Business function"
        name="businessFunctionId"
      />
      <TextArea defaultValue={opportunity?.description} label="Description" name="description" />
      <TextArea defaultValue={opportunity?.painPoint} label="Pain point" name="painPoint" />
      <TextArea
        defaultValue={opportunity?.expectedBenefit}
        label="Expected benefit"
        name="expectedBenefit"
      />
      <TextArea
        defaultValue={opportunity?.startingPoint}
        label="Starting point"
        name="startingPoint"
      />
      <Select defaultValue={opportunity?.status} label="Status" name="status" />
      <LevelSelect
        defaultValue={opportunity?.effortLevel}
        label="Effort"
        name="effortLevel"
      />
      <LevelSelect defaultValue={opportunity?.riskLevel} label="Risk" name="riskLevel" />
      <TextInput
        defaultValue={opportunity?.timeToValue}
        label="Time to value"
        name="timeToValue"
      />
      <NumberInput defaultValue={opportunity?.sortOrder ?? 0} label="Sort order" name="sortOrder" />
      <TextArea
        defaultValue={opportunity?.successMetrics.join("\n")}
        label="Success metrics"
        name="successMetrics"
      />
      <CheckboxGroup
        checkedIds={opportunity?.industryIds ?? []}
        items={industries}
        name="industryIds"
        title="Industries"
      />
      <CheckboxGroup
        checkedIds={opportunity?.useCaseIds ?? []}
        items={useCases}
        name="useCaseIds"
        title="Use cases"
      />
    </RecordForm>
  );
}

function UseCaseForm({
  businessFunctions,
  useCase
}: {
  businessFunctions: AdminIntelligenceWorkspace["businessFunctions"];
  useCase: AdminIntelligenceWorkspace["useCases"][number];
}) {
  return (
    <RecordForm
      endpoint={`/api/admin/intelligence/use-cases/${useCase.id}`}
      method="PATCH"
      title={useCase.name}
    >
      <SelectOptions
        defaultValue={useCase.businessFunctionId ?? ""}
        items={businessFunctions}
        label="Business function"
        name="businessFunctionId"
      />
      <TextArea defaultValue={useCase.description} label="Description" name="description" />
      <TextArea defaultValue={useCase.outcome} label="Outcome" name="outcome" />
      <LevelSelect defaultValue={useCase.effortLevel} label="Effort" name="effortLevel" />
      <LevelSelect defaultValue={useCase.riskLevel} label="Risk" name="riskLevel" />
      <TextInput defaultValue={useCase.timeToValue} label="Time to value" name="timeToValue" />
      <TextArea
        defaultValue={useCase.painPoints.join("\n")}
        label="Pain points"
        name="painPoints"
      />
      <TextArea
        defaultValue={useCase.requiredInputs.join("\n")}
        label="Required inputs"
        name="requiredInputs"
      />
      <TextArea
        defaultValue={useCase.successMetrics.join("\n")}
        label="Success metrics"
        name="successMetrics"
      />
      <TextArea
        defaultValue={useCase.implementationSteps.join("\n")}
        label="Implementation steps"
        name="implementationSteps"
      />
    </RecordForm>
  );
}

function RecordForm({
  children,
  endpoint,
  method,
  title
}: {
  children: ReactNode;
  endpoint: string;
  method: "POST" | "PATCH";
  title: string;
}) {
  const [state, setState] = useState<SaveState>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries()) as Record<
      string,
      string
    >;

    for (const key of [
      "successMetrics",
      "painPoints",
      "requiredInputs",
      "implementationSteps"
    ]) {
      if (key in payload) {
        payload[key] = JSON.stringify(toList(payload[key]));
      }
    }

    const body = {
      ...payload,
      successMetrics: toList(payload.successMetrics),
      painPoints: toList(payload.painPoints),
      requiredInputs: toList(payload.requiredInputs),
      implementationSteps: toList(payload.implementationSteps),
      industryIds: formData.getAll("industryIds").map(String),
      useCaseIds: formData.getAll("useCaseIds").map(String)
    };

    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });
      const result = (await response.json()) as ApiResponse<unknown>;

      if (!response.ok || !result.ok) {
        setState("error");
        setMessage(result.ok ? "Unable to save record." : result.error.message);
        return;
      }

      setState("success");
      setMessage("Saved.");
      window.location.reload();
    } catch {
      setState("error");
      setMessage("Unable to save record right now.");
    }
  }

  return (
    <details className="metric-tile rounded-xl p-4" open={method === "POST" ? false : undefined}>
      <summary className="cursor-pointer font-semibold">{title}</summary>
      <form className="mt-4 grid gap-4" onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2">{children}</div>
        <div className="flex items-center gap-3">
          <button className="primary-button" disabled={state === "submitting"}>
            {method === "POST" ? <Plus aria-hidden="true" size={17} /> : <Save aria-hidden="true" size={17} />}
            {state === "submitting" ? "Saving" : method === "POST" ? "Create" : "Save"}
          </button>
          {message ? (
            <p className={state === "error" ? "text-sm text-signal" : "text-sm text-accent"}>
              {message}
            </p>
          ) : null}
        </div>
      </form>
    </details>
  );
}

function TextInput({
  defaultValue,
  label,
  name,
  required
}: {
  defaultValue?: string | null;
  label: string;
  name: string;
  required?: boolean;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium">{label}</span>
      <input
        className="control-field"
        defaultValue={defaultValue ?? ""}
        name={name}
        required={required}
      />
    </label>
  );
}

function NumberInput({
  defaultValue,
  label,
  name
}: {
  defaultValue: number;
  label: string;
  name: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium">{label}</span>
      <input
        className="control-field"
        defaultValue={defaultValue}
        min={0}
        name={name}
        type="number"
      />
    </label>
  );
}

function TextArea({
  defaultValue,
  label,
  name
}: {
  defaultValue?: string | null;
  label: string;
  name: string;
}) {
  return (
    <label className="grid gap-2 md:col-span-2">
      <span className="text-sm font-medium">{label}</span>
      <textarea
        className="control-field min-h-24 py-3"
        defaultValue={defaultValue ?? ""}
        name={name}
      />
    </label>
  );
}

function Select({
  defaultValue = "PUBLISHED",
  label,
  name
}: {
  defaultValue?: string;
  label: string;
  name: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium">{label}</span>
      <select className="control-field" defaultValue={defaultValue} name={name}>
        <option value="PUBLISHED">Published</option>
        <option value="DRAFT">Draft</option>
        <option value="PENDING_REVIEW">Pending review</option>
        <option value="REJECTED">Rejected</option>
        <option value="ARCHIVED">Archived</option>
      </select>
    </label>
  );
}

function LevelSelect({
  defaultValue = "MEDIUM",
  label,
  name
}: {
  defaultValue?: string;
  label: string;
  name: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium">{label}</span>
      <select className="control-field" defaultValue={defaultValue} name={name}>
        <option value="LOW">Low</option>
        <option value="MEDIUM">Medium</option>
        <option value="HIGH">High</option>
      </select>
    </label>
  );
}

function SelectOptions({
  defaultValue,
  items,
  label,
  name
}: {
  defaultValue: string;
  items: Array<{ id: string; name: string }>;
  label: string;
  name: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium">{label}</span>
      <select className="control-field" defaultValue={defaultValue} name={name}>
        <option value="">None</option>
        {items.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </select>
    </label>
  );
}

function CheckboxGroup({
  checkedIds,
  items,
  name,
  title
}: {
  checkedIds: string[];
  items: Array<{ id: string; name: string }>;
  name: string;
  title: string;
}) {
  return (
    <fieldset className="grid gap-2 md:col-span-2">
      <legend className="text-sm font-medium">{title}</legend>
      <div className="grid max-h-56 gap-2 overflow-auto rounded-lg border border-line bg-surface/70 p-3 md:grid-cols-2">
        {items.map((item) => (
          <label className="inline-flex items-start gap-2 text-sm" key={item.id}>
            <input
              className="mt-1 h-4 w-4 accent-accent"
              defaultChecked={checkedIds.includes(item.id)}
              name={name}
              type="checkbox"
              value={item.id}
            />
            {item.name}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function toList(value?: string) {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed.map(String).filter(Boolean);
    }
  } catch {}

  return value
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}
