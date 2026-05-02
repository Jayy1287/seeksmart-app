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
      className="grid gap-5 rounded-md border border-line bg-white p-5"
      onSubmit={handleSubmit}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm font-medium">Tool name</span>
          <input
            className="min-h-11 rounded-md border border-line px-3 outline-none focus:border-accent"
            defaultValue={tool.name}
            maxLength={120}
            name="name"
            required
          />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-medium">Slug</span>
          <input
            className="min-h-11 rounded-md border border-line px-3 outline-none focus:border-accent"
            defaultValue={tool.slug}
            maxLength={120}
            name="slug"
            required
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm font-medium">Website URL</span>
          <input
            className="min-h-11 rounded-md border border-line px-3 outline-none focus:border-accent"
            defaultValue={tool.websiteUrl}
            name="websiteUrl"
            required
            type="url"
          />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-medium">Logo URL</span>
          <input
            className="min-h-11 rounded-md border border-line px-3 outline-none focus:border-accent"
            defaultValue={tool.logoUrl ?? ""}
            name="logoUrl"
            type="url"
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="grid gap-2">
          <span className="text-sm font-medium">Category</span>
          <select
            className="min-h-11 rounded-md border border-line bg-white px-3 outline-none focus:border-accent"
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
        <label className="grid gap-2">
          <span className="text-sm font-medium">Pricing</span>
          <select
            className="min-h-11 rounded-md border border-line bg-white px-3 outline-none focus:border-accent"
            defaultValue={tool.pricingType}
            name="pricingType"
          >
            <option value="FREE">Free</option>
            <option value="FREEMIUM">Freemium</option>
            <option value="PAID">Paid</option>
          </select>
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-medium">Status</span>
          <select
            className="min-h-11 rounded-md border border-line bg-white px-3 outline-none focus:border-accent"
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

      <label className="grid gap-2">
        <span className="text-sm font-medium">Short description</span>
        <textarea
          className="min-h-24 rounded-md border border-line px-3 py-3 outline-none focus:border-accent"
          defaultValue={tool.shortDescription}
          maxLength={220}
          minLength={20}
          name="shortDescription"
          required
        />
      </label>
      <label className="grid gap-2">
        <span className="text-sm font-medium">Long description</span>
        <textarea
          className="min-h-32 rounded-md border border-line px-3 py-3 outline-none focus:border-accent"
          defaultValue={tool.longDescription ?? ""}
          maxLength={2000}
          name="longDescription"
        />
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm font-medium">Meta title</span>
          <input
            className="min-h-11 rounded-md border border-line px-3 outline-none focus:border-accent"
            defaultValue={tool.metaTitle ?? ""}
            maxLength={120}
            name="metaTitle"
          />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-medium">Popularity score</span>
          <input
            className="min-h-11 rounded-md border border-line px-3 outline-none focus:border-accent"
            defaultValue={tool.popularityScore}
            max={100}
            min={0}
            name="popularityScore"
            type="number"
          />
        </label>
      </div>
      <label className="grid gap-2">
        <span className="text-sm font-medium">Meta description</span>
        <textarea
          className="min-h-20 rounded-md border border-line px-3 py-3 outline-none focus:border-accent"
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

      <div className="flex flex-col gap-3 border-t border-line pt-4 sm:flex-row sm:justify-between">
        <button
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-ink px-5 font-medium text-paper disabled:opacity-60"
          disabled={isSubmitting}
        >
          <Save aria-hidden="true" size={17} />
          {isSubmitting ? "Saving" : "Save tool"}
        </button>
        <button
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-signal px-5 font-medium text-signal disabled:opacity-60"
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
            state === "success" ? "text-sm text-accent" : "text-sm text-signal"
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
    <fieldset className="grid gap-3 rounded-md border border-line p-4">
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
