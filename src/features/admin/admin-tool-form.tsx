"use client";

import { FormEvent, useState } from "react";
import { Archive, Save } from "lucide-react";
import type {
  AdminTaxonomyOptions,
  AdminToolDetail
} from "@/server/admin/queries";
import type { ApiResponse } from "@/shared/api";

type AdminToolFormProps = {
  tool: AdminToolDetail;
  taxonomy: AdminTaxonomyOptions;
};

type SaveState = "idle" | "submitting" | "success" | "error";

export function AdminToolForm({ tool, taxonomy }: AdminToolFormProps) {
  const [state, setState] = useState<SaveState>("idle");
  const [message, setMessage] = useState("");

  async function saveTool(form: HTMLFormElement, statusOverride?: string) {
    setState("submitting");
    setMessage("");

    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") ?? ""),
      slug: String(formData.get("slug") ?? ""),
      shortDescription: String(formData.get("shortDescription") ?? ""),
      longDescription: String(formData.get("longDescription") ?? ""),
      websiteUrl: String(formData.get("websiteUrl") ?? ""),
      logoUrl: String(formData.get("logoUrl") ?? ""),
      categoryId: String(formData.get("categoryId") ?? ""),
      pricingType: String(formData.get("pricingType") ?? ""),
      hasFreePlan: formData.get("hasFreePlan") === "on",
      isVerified: formData.get("isVerified") === "on",
      isFeatured: formData.get("isFeatured") === "on",
      popularityScore: Number(formData.get("popularityScore") ?? 0),
      status: statusOverride ?? String(formData.get("status") ?? ""),
      metaTitle: String(formData.get("metaTitle") ?? ""),
      metaDescription: String(formData.get("metaDescription") ?? ""),
      featureIds: formData.getAll("featureIds").map(String),
      useCaseIds: formData.getAll("useCaseIds").map(String)
    };

    try {
      const response = await fetch(`/api/admin/tools/${tool.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      const result = (await response.json()) as ApiResponse<unknown>;

      if (!response.ok || !result.ok) {
        setState("error");
        setMessage(result.ok ? "Unable to save tool." : result.error.message);
        return;
      }

      setState("success");
      setMessage("Tool saved.");
      window.location.assign("/admin/tools");
    } catch {
      setState("error");
      setMessage("Unable to save tool right now.");
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await saveTool(event.currentTarget);
  }

  const isSubmitting = state === "submitting";

  return (
    <form
      className="surface grid grid-cols-[minmax(0,1fr)] gap-6 p-6 md:p-8"
      onSubmit={handleSubmit}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="field-label">Tool name</span>
          <input
            className="field"
            defaultValue={tool.name}
            maxLength={120}
            name="name"
            required
          />
        </label>
        <label className="block">
          <span className="field-label">Slug</span>
          <input
            className="field"
            defaultValue={tool.slug}
            maxLength={120}
            name="slug"
            required
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="field-label">Website URL</span>
          <input
            className="field"
            defaultValue={tool.websiteUrl}
            name="websiteUrl"
            required
            type="url"
          />
        </label>
        <label className="block">
          <span className="field-label">Logo URL</span>
          <input
            className="field"
            defaultValue={tool.logoUrl ?? ""}
            name="logoUrl"
            type="url"
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="block">
          <span className="field-label">Category</span>
          <select
            className="field"
            defaultValue={tool.categoryId}
            name="categoryId"
            required
          >
            {taxonomy.categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="field-label">Pricing</span>
          <select
            className="field"
            defaultValue={tool.pricingType}
            name="pricingType"
          >
            <option value="FREE">Free</option>
            <option value="FREEMIUM">Freemium</option>
            <option value="PAID">Paid</option>
          </select>
        </label>
        <label className="block">
          <span className="field-label">Status</span>
          <select
            className="field"
            defaultValue={tool.status}
            name="status"
          >
            <option value="DRAFT">Draft</option>
            <option value="PENDING_REVIEW">Pending review</option>
            <option value="PUBLISHED">Published</option>
            <option value="REJECTED">Rejected</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </label>
      </div>

      <label className="block">
        <span className="field-label">Short description</span>
        <textarea
          className="field min-h-24 py-3"
          defaultValue={tool.shortDescription}
          maxLength={220}
          minLength={20}
          name="shortDescription"
          required
        />
      </label>
      <label className="block">
        <span className="field-label">Long description</span>
        <textarea
          className="field min-h-32 py-3"
          defaultValue={tool.longDescription ?? ""}
          maxLength={2000}
          name="longDescription"
        />
      </label>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="block">
          <span className="field-label">Pricing note</span>
          <textarea
            className="field min-h-24 py-3"
            defaultValue={tool.pricingNote ?? ""}
            maxLength={300}
            name="pricingNote"
          />
        </label>
        <label className="block">
          <span className="field-label">Best for</span>
          <textarea
            className="field min-h-24 py-3"
            defaultValue={tool.bestFor ?? ""}
            maxLength={300}
            name="bestFor"
          />
        </label>
        <label className="block">
          <span className="field-label">Not for</span>
          <textarea
            className="field min-h-24 py-3"
            defaultValue={tool.notFor ?? ""}
            maxLength={300}
            name="notFor"
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="field-label">Meta title</span>
          <input
            className="field"
            defaultValue={tool.metaTitle ?? ""}
            maxLength={120}
            name="metaTitle"
          />
        </label>
        <label className="block">
          <span className="field-label">Popularity score</span>
          <input
            className="field"
            defaultValue={tool.popularityScore}
            max={100}
            min={0}
            name="popularityScore"
            type="number"
          />
        </label>
      </div>
      <label className="block">
        <span className="field-label">Meta description</span>
        <textarea
          className="field min-h-20 py-3"
          defaultValue={tool.metaDescription ?? ""}
          maxLength={220}
          name="metaDescription"
        />
      </label>

      <div className="flex flex-wrap gap-4 text-sm">
        <label className="inline-flex items-center gap-2">
          <input
            className="h-4 w-4 accent-accent"
            defaultChecked={tool.hasFreePlan}
            name="hasFreePlan"
            type="checkbox"
          />
          Free plan
        </label>
        <label className="inline-flex items-center gap-2">
          <input
            className="h-4 w-4 accent-accent"
            defaultChecked={tool.isVerified}
            name="isVerified"
            type="checkbox"
          />
          Verified
        </label>
        <label className="inline-flex items-center gap-2">
          <input
            className="h-4 w-4 accent-accent"
            defaultChecked={tool.isFeatured}
            name="isFeatured"
            type="checkbox"
          />
          Featured
        </label>
      </div>

      <TaxonomyCheckboxes
        checkedIds={tool.useCaseIds}
        items={taxonomy.useCases}
        name="useCaseIds"
        title="Use cases"
      />
      <TaxonomyCheckboxes
        checkedIds={tool.featureIds}
        items={taxonomy.features}
        name="featureIds"
        title="Features"
      />

      <div className="flex flex-col gap-3 border-t border-ink/10 pt-4 sm:flex-row sm:justify-between">
        <button
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          <Save aria-hidden="true" size={17} />
          {isSubmitting ? "Saving" : "Save tool"}
        </button>
        <button
          className="btn btn-ghost text-danger hover:border-danger"
          disabled={isSubmitting}
          onClick={(event) => {
            const form = event.currentTarget.form;

            if (form) {
              void saveTool(form, "ARCHIVED");
            }
          }}
          type="button"
        >
          <Archive aria-hidden="true" size={17} />
          Archive
        </button>
      </div>
      {message ? (
        <p
          className={
            state === "success" ? "text-sm font-medium text-success" : "text-sm font-medium text-danger"
          }
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}

type TaxonomyCheckboxesProps = {
  checkedIds: string[];
  items: AdminTaxonomyOptions["features"];
  name: string;
  title: string;
};

function TaxonomyCheckboxes({
  checkedIds,
  items,
  name,
  title
}: TaxonomyCheckboxesProps) {
  return (
    <fieldset className="grid gap-3 rounded-2xl bg-ink/[0.04] p-4 md:p-5">
      <legend className="px-1 text-sm font-medium">{title}</legend>
      <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <label className="inline-flex items-center gap-2 text-sm" key={item.id}>
            <input
              className="h-4 w-4 accent-accent"
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
