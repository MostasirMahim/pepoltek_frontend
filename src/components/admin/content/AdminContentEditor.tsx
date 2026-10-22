"use client";

import React, { useState, useTransition, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  Clock,
  History,
  Save,
  Upload,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  AlertTriangle,
  Eye,
  EyeOff,
} from "@/components/ui/Icons";
import {
  publishContentBlockAction,
  saveDraftContentBlockAction,
  rollbackContentBlockAction,
  type ContentBlockDetail,
  type ContentVersion,
} from "@/actions/content.actions";

// ---------------------------------------------------------------------------
// Schema definitions per content key
// Each schema defines the structured form fields that appear in the editor.
// ---------------------------------------------------------------------------

type FieldType =
  | "text"
  | "textarea"
  | "richtext"
  | "number"
  | "url"
  | "array_of_objects"
  | "array_of_strings"
  | "boolean";

interface FieldSchema {
  key: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  hint?: string;
  objectFields?: FieldSchema[];
  maxItems?: number;
}

const SCHEMA_MAP: Record<string, FieldSchema[]> = {
  homepage_hero: [
    { key: "eyebrow", label: "Eyebrow Tag", type: "text", placeholder: "e.g. Global Workforce Engine", required: true },
    { key: "title", label: "Main Title", type: "text", placeholder: "e.g. Precision Talent Deployment", required: true },
    { key: "highlightedText", label: "Highlighted Word or Phrase", type: "text", placeholder: "e.g. at Enterprise Velocity", hint: "This text appears with accent colour highlight." },
    { key: "description", label: "Hero Description", type: "textarea", placeholder: "Two to three sentence value proposition.", required: true },
    {
      key: "proofPills",
      label: "Proof Pills",
      type: "array_of_strings",
      placeholder: "e.g. W2 & C2C Compliant",
      hint: "Short trust badges shown below the hero.",
      maxItems: 6,
    },
    {
      key: "stats",
      label: "Stats Counters",
      type: "array_of_objects",
      maxItems: 4,
      objectFields: [
        { key: "value", label: "Value", type: "text", placeholder: "e.g. 2 to 7 Days" },
        { key: "label", label: "Label", type: "text", placeholder: "e.g. Sprint Shortlist Velocity" },
      ],
    },
  ],
  homepage_stats: [
    {
      key: "stats",
      label: "Homepage Metrics",
      type: "array_of_objects",
      maxItems: 8,
      objectFields: [
        { key: "value", label: "Value", type: "text", placeholder: "e.g. 92%" },
        { key: "label", label: "Label", type: "text", placeholder: "e.g. First-Year Retention" },
        { key: "description", label: "Description", type: "text", placeholder: "e.g. Across all placements" },
      ],
    },
  ],
  homepage_sections: [
    {
      key: "sections",
      label: "Homepage Sections",
      type: "array_of_objects",
      maxItems: 10,
      objectFields: [
        { key: "id", label: "Section ID", type: "text", placeholder: "e.g. proof-ribbon" },
        { key: "title", label: "Section Title", type: "text", placeholder: "e.g. Enterprise Proof Ribbon" },
        { key: "visible", label: "Visible", type: "boolean" },
        { key: "badge", label: "Badge Tag", type: "text", placeholder: "e.g. Verified Metrics" },
        { key: "description", label: "Description", type: "textarea", placeholder: "Section overview copy." },
      ],
    },
  ],
  services_list: [
    {
      key: "services",
      label: "Service Cards",
      type: "array_of_objects",
      maxItems: 12,
      objectFields: [
        { key: "id", label: "ID (slug)", type: "text", placeholder: "e.g. staff-augmentation" },
        { key: "title", label: "Title", type: "text", placeholder: "e.g. IT Staff Augmentation" },
        { key: "badge", label: "Badge", type: "text", placeholder: "e.g. Elastic Bandwidth" },
        { key: "desc", label: "Description", type: "textarea", placeholder: "One to two sentence description." },
        { key: "guarantee", label: "Performance Guarantee", type: "text", placeholder: "e.g. 2-week risk-free trial." },
      ],
    },
  ],
  case_studies: [
    {
      key: "studies",
      label: "Case Studies",
      type: "array_of_objects",
      maxItems: 20,
      objectFields: [
        { key: "slug", label: "URL Slug", type: "text", placeholder: "e.g. fintech-cloud-acceleration", required: true },
        { key: "title", label: "Title", type: "text", placeholder: "e.g. Scaling Cloud Platform Engineering", required: true },
        { key: "sector", label: "Sector (tech / healthcare / finance)", type: "text", placeholder: "tech" },
        { key: "sectorLabel", label: "Sector Label", type: "text", placeholder: "e.g. Technology & Cloud" },
        { key: "client", label: "Client Name", type: "text", placeholder: "e.g. Global NeoBank Enterprise" },
        { key: "timeline", label: "Timeline", type: "text", placeholder: "e.g. 3 Months" },
        { key: "summary", label: "Summary", type: "textarea", placeholder: "One to two sentence summary of the outcome." },
        { key: "challenge", label: "Challenge", type: "textarea", placeholder: "What problem did the client face?" },
        { key: "solution", label: "Solution", type: "textarea", placeholder: "How did Pepoltek solve it?" },
      ],
    },
  ],
  about_page: [
    { key: "mission", label: "Mission Statement", type: "textarea", placeholder: "Core company mission." },
    {
      key: "pillars",
      label: "Delivery Pillars",
      type: "array_of_objects",
      maxItems: 8,
      objectFields: [
        { key: "role", label: "Role Title", type: "text", placeholder: "e.g. Niche Recruitment Specialists" },
        { key: "focus", label: "Focus Area", type: "text", placeholder: "e.g. Technology & Clinical Talent Sourcing" },
        { key: "desc", label: "Description", type: "textarea", placeholder: "What this pillar delivers." },
        { key: "badge", label: "Badge", type: "text", placeholder: "e.g. Sourcing & Culture" },
      ],
    },
  ],
  site_navigation: [
    {
      key: "links",
      label: "Navigation Links",
      type: "array_of_objects",
      maxItems: 10,
      objectFields: [
        { key: "label", label: "Link Label", type: "text", placeholder: "e.g. Services" },
        { key: "href", label: "URL Path", type: "url", placeholder: "e.g. /services" },
      ],
    },
  ],
  contact_info: [
    { key: "email", label: "Primary Email", type: "text", placeholder: "e.g. hello@pepoltek.com" },
    { key: "phone", label: "Phone Number", type: "text", placeholder: "e.g. +44 20 1234 5678" },
    { key: "address", label: "Office Address", type: "textarea", placeholder: "Full mailing address." },
    { key: "hours", label: "Business Hours", type: "text", placeholder: "e.g. Mon to Fri, 9am to 6pm GMT" },
  ],
  footer_content: [
    { key: "copyright", label: "Copyright Text", type: "text", placeholder: "e.g. 2025 Pepoltek Limited. All rights reserved." },
    {
      key: "columns",
      label: "Footer Columns",
      type: "array_of_objects",
      maxItems: 5,
      objectFields: [
        { key: "heading", label: "Column Heading", type: "text", placeholder: "e.g. Services" },
      ],
    },
  ],
  cta_banners: [
    {
      key: "banners",
      label: "CTA Banners",
      type: "array_of_objects",
      maxItems: 6,
      objectFields: [
        { key: "id", label: "Banner ID", type: "text", placeholder: "e.g. homepage-bottom" },
        { key: "heading", label: "Heading", type: "text", placeholder: "e.g. Ready to Scale Your Team?" },
        { key: "body", label: "Body Text", type: "textarea", placeholder: "Supporting copy." },
        { key: "primaryLabel", label: "Primary Button Label", type: "text", placeholder: "e.g. Request a Quote" },
        { key: "primaryHref", label: "Primary Button URL", type: "url", placeholder: "/contact" },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// Field Components
// ---------------------------------------------------------------------------

function FieldInput({
  schema,
  value,
  onChange,
}: {
  schema: FieldSchema;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  const strVal = (value as string) ?? "";

  if (schema.type === "textarea" || schema.type === "richtext") {
    return (
      <textarea
        rows={schema.type === "richtext" ? 6 : 3}
        value={strVal}
        onChange={(e) => onChange(e.target.value)}
        placeholder={schema.placeholder ?? ""}
        className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3.5 py-2.5 text-xs text-ink placeholder-ink-soft focus:border-electric focus:outline-none focus:ring-1 focus:ring-electric/30 resize-none"
      />
    );
  }

  if (schema.type === "boolean") {
    return (
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${
          value
            ? "border-signal/40 bg-signal/10 text-signal"
            : "border-[#bcd6fa] bg-white text-ink-soft"
        }`}
      >
        {value ? <Eye size={13} /> : <EyeOff size={13} />}
        {value ? "Visible" : "Hidden"}
      </button>
    );
  }

  return (
    <input
      type="text"
      value={strVal}
      onChange={(e) => onChange(e.target.value)}
      placeholder={schema.placeholder ?? ""}
      className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3.5 py-2.5 text-xs text-ink placeholder-ink-soft focus:border-electric focus:outline-none focus:ring-1 focus:ring-electric/30"
    />
  );
}

function ArrayOfStringsField({
  schema,
  value,
  onChange,
}: {
  schema: FieldSchema;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  const arr = Array.isArray(value) ? (value as string[]) : [];
  const maxItems = schema.maxItems ?? 10;

  const update = (i: number, v: string) => {
    const next = [...arr];
    next[i] = v;
    onChange(next);
  };
  const add = () => onChange([...arr, ""]);
  const remove = (i: number) => onChange(arr.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-2">
      {arr.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            type="text"
            value={item}
            onChange={(e) => update(i, e.target.value)}
            placeholder={schema.placeholder ?? ""}
            className="flex-1 rounded-xl border border-[#bcd6fa] bg-white px-3.5 py-2 text-xs text-ink placeholder-ink-soft focus:border-electric focus:outline-none focus:ring-1 focus:ring-electric/30"
          />
          <button
            type="button"
            onClick={() => remove(i)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-100 bg-red-50 text-red-400 hover:bg-red-100 transition-colors"
          >
            <Trash2 size={12} />
          </button>
        </div>
      ))}
      {arr.length < maxItems && (
        <button
          type="button"
          onClick={add}
          className="flex items-center gap-1.5 rounded-lg border border-dashed border-electric/40 px-3 py-2 text-xs text-electric hover:bg-electric/5 transition-colors"
        >
          <Plus size={12} />
          Add Item
        </button>
      )}
    </div>
  );
}

function ArrayOfObjectsField({
  schema,
  value,
  onChange,
}: {
  schema: FieldSchema;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  const arr = Array.isArray(value) ? (value as Record<string, unknown>[]) : [];
  const maxItems = schema.maxItems ?? 10;
  const [expanded, setExpanded] = useState<number[]>([0]);

  const updateItem = (i: number, fieldKey: string, v: unknown) => {
    const next = arr.map((item, idx) =>
      idx === i ? { ...item, [fieldKey]: v } : item
    );
    onChange(next);
  };

  const addItem = () => {
    const blank: Record<string, unknown> = {};
    schema.objectFields?.forEach((f) => (blank[f.key] = ""));
    const next = [...arr, blank];
    onChange(next);
    setExpanded((prev) => [...prev, next.length - 1]);
  };

  const removeItem = (i: number) => {
    onChange(arr.filter((_, idx) => idx !== i));
    setExpanded((prev) => prev.filter((x) => x !== i).map((x) => (x > i ? x - 1 : x)));
  };

  const toggleExpand = (i: number) => {
    setExpanded((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]
    );
  };

  return (
    <div className="space-y-3">
      {arr.map((item, i) => {
        const isOpen = expanded.includes(i);
        const preview =
          (item["title"] as string) ||
          (item["label"] as string) ||
          (item["heading"] as string) ||
          (item["slug"] as string) ||
          `Item ${i + 1}`;
        return (
          <div
            key={i}
            className="rounded-xl border border-[#bcd6fa] bg-[#f8fbff] overflow-hidden"
          >
            <div
              className="flex items-center justify-between gap-2 px-4 py-3 cursor-pointer hover:bg-[#f0f6ff] transition-colors"
              onClick={() => toggleExpand(i)}
            >
              <span className="font-display text-xs font-semibold text-ink truncate">
                {preview}
              </span>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeItem(i);
                  }}
                  className="flex h-6 w-6 items-center justify-center rounded-md border border-red-100 bg-red-50 text-red-400 hover:bg-red-100 transition-colors"
                >
                  <Trash2 size={10} />
                </button>
                {isOpen ? <ChevronUp size={14} className="text-ink-soft" /> : <ChevronDown size={14} className="text-ink-soft" />}
              </div>
            </div>
            {isOpen && (
              <div className="px-4 pb-4 space-y-3 border-t border-[#bcd6fa]/50">
                {schema.objectFields?.map((subField) => (
                  <div key={subField.key}>
                    <label className="block text-[10px] font-semibold text-ink-soft uppercase tracking-wide mb-1">
                      {subField.label}
                      {subField.required && <span className="text-red-400 ml-0.5">*</span>}
                    </label>
                    <FieldInput
                      schema={subField}
                      value={item[subField.key] ?? ""}
                      onChange={(v) => updateItem(i, subField.key, v)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
      {arr.length < maxItems && (
        <button
          type="button"
          onClick={addItem}
          className="flex items-center gap-1.5 rounded-xl border border-dashed border-electric/40 px-4 py-2.5 text-xs font-semibold text-electric hover:bg-electric/5 transition-colors w-full justify-center"
        >
          <Plus size={13} />
          Add {schema.label.replace(/s$/, "")}
        </button>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// History Panel
// ---------------------------------------------------------------------------

function HistoryPanel({
  history,
  currentKey,
  onRollback,
  isPending,
}: {
  history: ContentVersion[];
  currentKey: string;
  onRollback: (v: number) => void;
  isPending: boolean;
}) {
  return (
    <div className="rounded-2xl border border-[#bcd6fa] bg-white p-5">
      <div className="flex items-center gap-2 mb-4">
        <History size={16} className="text-electric" />
        <h3 className="font-display text-sm font-bold text-ink">Version History</h3>
      </div>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {history.map((ver) => (
          <div
            key={ver.id}
            className={`rounded-xl border p-3 ${
              ver.is_published
                ? "border-signal/30 bg-signal/5"
                : "border-[#bcd6fa] bg-[#f8fbff]"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-bold text-ink">
                  v{ver.version}
                </span>
                {ver.is_published && (
                  <span className="rounded-full bg-signal/15 px-2 py-0.5 font-mono text-[9px] font-bold text-signal">
                    LIVE
                  </span>
                )}
              </div>
              {!ver.is_published && (
                <button
                  type="button"
                  onClick={() => onRollback(ver.version)}
                  disabled={isPending}
                  className="flex items-center gap-1 rounded-lg border border-electric/30 bg-electric/5 px-2 py-1 text-[10px] font-semibold text-electric hover:bg-electric/10 disabled:opacity-50 transition-colors"
                >
                  <RotateCcw size={9} />
                  Restore
                </button>
              )}
            </div>
            <div className="mt-1 text-[10px] text-ink-soft">
              {ver.author_name} &middot;{" "}
              {new Date(ver.created_at).toLocaleString("en-GB", {
                dateStyle: "short",
                timeStyle: "short",
              })}
            </div>
            {ver.notes && (
              <div className="mt-1 text-[10px] text-ink-soft italic">{ver.notes}</div>
            )}
          </div>
        ))}
        {history.length === 0 && (
          <div className="py-6 text-center text-xs text-ink-soft">No versions yet.</div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Editor
// ---------------------------------------------------------------------------

interface AdminContentEditorProps {
  contentKey: string;
  keyLabel: string;
  blockDetail: ContentBlockDetail;
  history: ContentVersion[];
}

export function AdminContentEditor({
  contentKey,
  keyLabel,
  blockDetail,
  history,
}: AdminContentEditorProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Initialize form data from published or latest data
  const initialData =
    blockDetail.published?.data ??
    blockDetail.latest?.data ??
    {};

  const [formData, setFormData] = useState<Record<string, unknown>>(
    initialData as Record<string, unknown>
  );
  const [notes, setNotes] = useState("");
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  const schema = SCHEMA_MAP[contentKey] ?? [];
  const isPublished = blockDetail.published !== null;

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const handleFieldChange = useCallback((fieldKey: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [fieldKey]: value }));
  }, []);

  const handlePublish = () => {
    startTransition(async () => {
      const res = await publishContentBlockAction(contentKey, formData, notes);
      if (res.success) {
        showToast("success", `Published as v${res.version}. Changes are live.`);
        router.refresh();
      } else {
        showToast("error", res.error ?? "Publish failed.");
      }
    });
  };

  const handleSaveDraft = () => {
    startTransition(async () => {
      const res = await saveDraftContentBlockAction(contentKey, formData, notes);
      if (res.success) {
        showToast("success", `Draft saved as v${res.version}. Not published yet.`);
        router.refresh();
      } else {
        showToast("error", res.error ?? "Draft save failed.");
      }
    });
  };

  const handleRollback = (targetVersion: number) => {
    startTransition(async () => {
      const res = await rollbackContentBlockAction(contentKey, targetVersion);
      if (res.success) {
        showToast("success", `Rolled back to v${targetVersion}. Now live as v${res.version}.`);
        router.refresh();
      } else {
        showToast("error", res.error ?? "Rollback failed.");
      }
    });
  };

  return (
    <div className="h-full overflow-y-auto thin-scrollbar p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Toast */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 flex items-center gap-2.5 rounded-2xl border px-4 py-3 shadow-xl text-sm font-semibold transition-all ${
            toast.type === "success"
              ? "border-signal/30 bg-signal/10 text-signal"
              : "border-red-200 bg-red-50 text-red-600"
          }`}
        >
          {toast.type === "success" ? <Check size={15} /> : <AlertTriangle size={15} />}
          {toast.msg}
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <button
            onClick={() => router.push("/admin/content")}
            className="mb-3 flex items-center gap-1.5 text-xs text-ink-soft hover:text-electric transition-colors"
          >
            <ArrowLeft size={13} />
            Content Hub
          </button>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-bold text-ink">{keyLabel}</h1>
            {isPublished ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-signal/10 border border-signal/20 px-2.5 py-0.5 text-[10px] font-bold text-signal">
                <Check size={9} />
                LIVE v{blockDetail.published?.version}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-[10px] font-bold text-amber-600">
                <Clock size={9} />
                NOT PUBLISHED
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-ink-soft">
            Edit content below, then save a draft or publish immediately to make it live.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setShowHistory((v) => !v)}
            className="flex items-center gap-1.5 rounded-xl border border-[#bcd6fa] bg-white px-3.5 py-2.5 text-xs font-semibold text-ink hover:border-electric/40 transition-colors"
          >
            <History size={13} />
            History ({history.length})
          </button>
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={isPending}
            className="flex items-center gap-1.5 rounded-xl border border-electric/40 bg-electric/5 px-3.5 py-2.5 text-xs font-semibold text-electric hover:bg-electric/10 disabled:opacity-50 transition-colors"
          >
            <Save size={13} />
            Save Draft
          </button>
          <button
            type="button"
            onClick={handlePublish}
            disabled={isPending}
            className="flex items-center gap-1.5 rounded-xl bg-electric px-3.5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-electric-bright disabled:opacity-50 transition-colors"
          >
            <Upload size={13} />
            {isPending ? "Publishing..." : "Publish Now"}
          </button>
        </div>
      </div>

      <div className={`grid gap-6 ${showHistory ? "grid-cols-1 xl:grid-cols-3" : "grid-cols-1"}`}>
        {/* Editor Form */}
        <div className={`space-y-6 ${showHistory ? "xl:col-span-2" : ""}`}>
          {/* Notes field */}
          <div className="rounded-2xl border border-[#bcd6fa] bg-white p-5">
            <label className="block text-[10px] font-semibold text-ink-soft uppercase tracking-wide mb-2">
              Editor Notes (optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Updated Q4 hero copy for campaign launch."
              className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3.5 py-2.5 text-xs text-ink placeholder-ink-soft focus:border-electric focus:outline-none focus:ring-1 focus:ring-electric/30"
            />
          </div>

          {/* Schema-driven fields */}
          {schema.length > 0 ? (
            schema.map((field) => (
              <div key={field.key} className="rounded-2xl border border-[#bcd6fa] bg-white p-5">
                <div className="mb-3">
                  <label className="block font-display text-sm font-bold text-ink">
                    {field.label}
                    {field.required && <span className="text-red-400 ml-1">*</span>}
                  </label>
                  {field.hint && (
                    <p className="mt-0.5 text-[11px] text-ink-soft">{field.hint}</p>
                  )}
                  {field.type !== "array_of_objects" && field.type !== "array_of_strings" && (
                    <p className="mt-0.5 text-[10px] text-ink-soft/60 font-mono">{field.key}</p>
                  )}
                </div>

                {field.type === "array_of_strings" ? (
                  <ArrayOfStringsField
                    schema={field}
                    value={formData[field.key]}
                    onChange={(v) => handleFieldChange(field.key, v)}
                  />
                ) : field.type === "array_of_objects" ? (
                  <ArrayOfObjectsField
                    schema={field}
                    value={formData[field.key]}
                    onChange={(v) => handleFieldChange(field.key, v)}
                  />
                ) : (
                  <FieldInput
                    schema={field}
                    value={formData[field.key]}
                    onChange={(v) => handleFieldChange(field.key, v)}
                  />
                )}
              </div>
            ))
          ) : (
            /* Fallback: raw JSON editor for keys without a schema */
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle size={16} className="text-amber-500" />
                <span className="font-display text-sm font-bold text-amber-700">
                  JSON Editor (No structured form for this block)
                </span>
              </div>
              <textarea
                rows={20}
                value={JSON.stringify(formData, null, 2)}
                onChange={(e) => {
                  try {
                    setFormData(JSON.parse(e.target.value));
                  } catch {
                    // Keep last valid state while typing
                  }
                }}
                className="w-full rounded-xl border border-amber-200 bg-white px-3.5 py-2.5 font-mono text-xs text-ink focus:border-electric focus:outline-none focus:ring-1 focus:ring-electric/30 resize-none"
              />
            </div>
          )}
        </div>

        {/* History Panel */}
        {showHistory && (
          <div>
            <HistoryPanel
              history={history}
              currentKey={contentKey}
              onRollback={handleRollback}
              isPending={isPending}
            />
          </div>
        )}
      </div>
    </div>
  </div>
  );
}
