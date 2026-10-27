"use client";

import React, { useState, useTransition, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  createAssessmentTemplate,
  updateAssessmentTemplate,
  archiveAssessmentTemplate,
  AssessmentTemplateInput,
  MarksDistributionItem,
} from "@/actions/recruiter.actions";
import { AssessmentCategoryOption } from "@/types/taxonomy.types";
import {
  ShieldCheck,
  Plus,
  X,
  Search,
  Filter,
  FileText,
  Zap,
  CheckCircle2,
  Clock,
  Pencil,
  Archive,
  ChevronRight,
  AlertCircle,
  ClipboardList,
  Layers,
  Award,
  RotateCcw,
} from "lucide-react";

// Types
export interface AssessmentTemplate {
  id: string;
  title: string;
  category: string;
  sector: string;
  description?: string;
  instructions?: string;
  total_marks: number;
  is_active: boolean;
  version: number;
  created_by_name?: string;
  created_at: string;
  marks_distribution?: MarksDistributionItem[];
  prerequisites?: string[];
  allowed_validator_roles?: string[];
  vettings_count?: number;
  criteria_count?: number;
}

export interface ApplicationVetting {
  id: string;
  application_id: string;
  candidate_name?: string;
  job_title?: string;
  template_id?: string;
  template_title: string;
  template_category: string;
  status: string;
  final_score?: number;
  pass_threshold: number;
  scheduled_start?: string;
  deadline?: string;
  primary_validator?: { id: string; full_name: string; email: string };
  is_overdue: boolean;
  created_at: string;
}

export interface AssessmentsViewProps {
  templates: AssessmentTemplate[];
  vettings: ApplicationVetting[];
  categories?: AssessmentCategoryOption[];
  basePath?: string;
}

// Category and Sector Baseline Mappings
export const DEFAULT_CATEGORIES: AssessmentCategoryOption[] = [
  { id: "cat-technical", label: "Technical Assessment", sectorId: "technology" },
  { id: "cat-behavioural", label: "Behavioural & Leadership", sectorId: "both" },
  { id: "cat-portfolio", label: "Portfolio / Code Review", sectorId: "technology" },
  { id: "cat-clinical", label: "Clinical & Diagnostic Review", sectorId: "healthcare" },
  { id: "cat-culture-fit", label: "Culture & Values Alignment", sectorId: "both" },
  { id: "cat-custom", label: "Custom Specialized Evaluation", sectorId: "both" },
];

export const CATEGORY_LABELS: Record<string, string> = {
  technical: "Technical Assessment",
  behavioural: "Behavioural & Leadership",
  portfolio: "Portfolio / Code Review",
  clinical: "Clinical & Diagnostic Review",
  culture_fit: "Culture & Values Alignment",
  custom: "Custom Specialized Evaluation",
  "cat-technical": "Technical Assessment",
  "cat-behavioural": "Behavioural & Leadership",
  "cat-portfolio": "Portfolio / Code Review",
  "cat-clinical": "Clinical & Diagnostic Review",
  "cat-culture-fit": "Culture & Values Alignment",
  "cat-custom": "Custom Specialized Evaluation",
};

export const getCategoryLabel = (
  catId: string,
  categoryList?: AssessmentCategoryOption[]
): string => {
  const pool = categoryList && categoryList.length > 0 ? categoryList : DEFAULT_CATEGORIES;
  const match = pool.find(
    (c) => c.id === catId || c.id.replace("cat-", "") === catId.replace("cat-", "")
  );
  if (match) return match.label;
  return CATEGORY_LABELS[catId] || catId;
};

export const SECTOR_LABELS: Record<string, string> = {
  technology: "Technology",
  healthcare: "Healthcare",
  both: "Both Sectors",
};

export const CATEGORY_BADGES: Record<string, string> = {
  technical: "bg-electric/10 text-electric border-electric/30",
  behavioural: "bg-amber-50 text-amber-800 border-amber-200",
  portfolio: "bg-sky-50 text-sky-800 border-sky-200",
  clinical: "bg-emerald-50 text-emerald-800 border-emerald-200",
  culture_fit: "bg-purple-50 text-purple-800 border-purple-200",
  custom: "bg-slate-100 text-slate-700 border-slate-300",
};

export const getCategoryBadge = (catId: string): string => {
  const clean = catId.replace("cat-", "").replace(/-/g, "_");
  return (
    CATEGORY_BADGES[clean] ||
    CATEGORY_BADGES[catId] ||
    "bg-electric/10 text-electric border-electric/30"
  );
};

// Slide-Over Sheet (Right-Side Drawer adhering to design.md)
export function TemplateSheet({
  open,
  onClose,
  editing,
  onSaved,
  categories = [],
}: {
  open: boolean;
  onClose: () => void;
  editing?: AssessmentTemplate | null;
  onSaved: () => void;
  categories?: AssessmentCategoryOption[];
}) {
  const [isPending, startTransition] = useTransition();
  const pool = categories && categories.length > 0 ? categories : DEFAULT_CATEGORIES;

  const [title, setTitle] = useState(editing?.title || "");
  const [category, setCategory] = useState(
    editing?.category || pool[0]?.id || "cat-technical"
  );
  const [sector, setSector] = useState(editing?.sector || "both");
  const [description, setDescription] = useState(editing?.description || "");
  const [instructions, setInstructions] = useState(editing?.instructions || "");
  const [criteria, setCriteria] = useState<MarksDistributionItem[]>(
    editing?.marks_distribution || [{ criterion: "", max_points: 25, description: "" }]
  );
  const [error, setError] = useState("");

  // Dismiss on Escape key per design.md
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (editing) {
      setTitle(editing.title);
      setCategory(editing.category);
      setSector(editing.sector);
      setDescription(editing.description || "");
      setInstructions(editing.instructions || "");
      setCriteria(
        editing.marks_distribution && editing.marks_distribution.length > 0
          ? editing.marks_distribution
          : [{ criterion: "", max_points: 25, description: "" }]
      );
    } else {
      setTitle("");
      setCategory(pool[0]?.id || "cat-technical");
      setSector("both");
      setDescription("");
      setInstructions("");
      setCriteria([{ criterion: "", max_points: 25, description: "" }]);
    }
    setError("");
  }, [editing, open, pool]);

  const relevantCategories = pool.filter(
    (c) => !c.sectorId || c.sectorId === "both" || c.sectorId === sector || sector === "both"
  );

  const handleSectorChange = (newSector: string) => {
    setSector(newSector);
    const validInNewSector = pool.filter(
      (c) => !c.sectorId || c.sectorId === "both" || c.sectorId === newSector || newSector === "both"
    );
    const isCurrentValid = validInNewSector.some(
      (c) => c.id === category || c.id.replace("cat-", "") === category.replace("cat-", "")
    );
    if (!isCurrentValid && validInNewSector.length > 0) {
      setCategory(validInNewSector[0].id);
    }
  };

  const totalPoints = criteria.reduce((s, c) => s + (c.max_points || 0), 0);

  const addCriterion = () =>
    setCriteria([...criteria, { criterion: "", max_points: 20, description: "" }]);

  const removeCriterion = (i: number) => {
    if (criteria.length <= 1) return;
    setCriteria(criteria.filter((_, idx) => idx !== i));
  };

  const updateCriterion = (
    i: number,
    field: keyof MarksDistributionItem,
    val: string | number
  ) => {
    const updated = [...criteria];
    (updated[i] as any)[field] = val;
    setCriteria(updated);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!title.trim()) {
      setError("Template title is required.");
      return;
    }
    if (totalPoints > 100) {
      setError(`Total criteria points (${totalPoints}) cannot exceed 100.`);
      return;
    }
    setError("");

    startTransition(async () => {
      const data: AssessmentTemplateInput = {
        title: title.trim(),
        category,
        sector,
        description: description.trim(),
        instructions: instructions.trim(),
        marks_distribution: criteria.filter((c) => c.criterion.trim()),
        total_marks: totalPoints || 100,
      };

      const res = editing
        ? await updateAssessmentTemplate(editing.id, data)
        : await createAssessmentTemplate(data);

      if (res?.error) {
        setError(
          typeof res.error === "string" ? res.error : "Failed to save assessment template."
        );
      } else {
        onSaved();
        onClose();
      }
    });
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-ink/40 backdrop-blur-xs animate-in fade-in-0 duration-150"
      onClick={onClose}
    >
      <div
        className="flex h-full w-full max-w-xl md:max-w-2xl lg:max-w-3xl flex-col border-l border-[#bcd6fa] bg-white shadow-2xl animate-in slide-in-from-right duration-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-[#bcd6fa]/40 bg-canvas/40 flex items-start justify-between shrink-0">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-electric/30 bg-electric/10 px-2.5 py-0.5 text-[10px] font-enterprise font-bold text-electric uppercase tracking-wider">
              <ShieldCheck size={11} />
              <span>DYNAMIC TEMPLATE BUILDER</span>
            </div>
            <h3 className="mt-1 font-display text-xl font-bold text-ink">
              {editing ? "Edit Assessment Template" : "Create Assessment Template"}
            </h3>
            <p className="text-xs text-ink-soft font-enterprise">
              Define scoring criteria, candidate requirements, and validator guidelines.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-mist hover:text-ink hover:bg-canvas transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between min-h-0">
          <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 space-y-4 text-xs thin-scrollbar font-enterprise">
            {error && (
              <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-3 text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Title */}
            <div className="space-y-1">
              <label className="font-enterprise text-xs font-semibold text-ink block">
                Template Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Senior Full-Stack Architecture Review"
                className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/20 px-3.5 py-2.5 text-xs font-enterprise text-ink placeholder:text-mist focus:border-electric focus:bg-white focus:outline-hidden"
              />
            </div>

            {/* Industry Sector & Category Track */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-enterprise text-xs font-semibold text-ink block">
                  Industry Sector Track
                </label>
                <select
                  value={sector}
                  onChange={(e) => handleSectorChange(e.target.value)}
                  className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/20 px-3.5 py-2.5 text-xs font-enterprise text-ink focus:border-electric focus:bg-white focus:outline-hidden cursor-pointer"
                >
                  {Object.entries(SECTOR_LABELS).map(([v, l]) => (
                    <option key={v} value={v}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-enterprise text-xs font-semibold text-ink block">
                  Category Track
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/20 px-3.5 py-2.5 text-xs font-enterprise text-ink focus:border-electric focus:bg-white focus:outline-hidden cursor-pointer"
                >
                  {relevantCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label} {c.sectorId && c.sectorId !== "both" ? `(${c.sectorId === "technology" ? "Technology" : "Healthcare"})` : "(Cross-Sector)"}
                    </option>
                  ))}
                  {relevantCategories.length === 0 && (
                    <option value={category}>{getCategoryLabel(category, pool)}</option>
                  )}
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="font-enterprise text-xs font-semibold text-ink block">
                Internal Objectives &amp; Evaluation Scope
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What competencies or architectural patterns does this template evaluate?"
                className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/20 p-3 text-xs font-enterprise text-ink placeholder:text-mist focus:border-electric focus:bg-white focus:outline-hidden"
              />
            </div>

            {/* Candidate Instructions */}
            <div className="space-y-1">
              <label className="font-enterprise text-xs font-semibold text-ink block">
                Candidate-Facing Instructions
              </label>
              <textarea
                rows={2}
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Clear instructions explaining what the candidate must submit..."
                className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/20 p-3 text-xs font-enterprise text-ink placeholder:text-mist focus:border-electric focus:bg-white focus:outline-hidden"
              />
            </div>

            {/* Scoring Rubric / Criteria */}
            <div className="space-y-3 pt-2 border-t border-[#bcd6fa]/40">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-enterprise text-xs font-bold text-ink">
                    Scoring Criteria Rubric
                  </h4>
                  <p className="text-[11px] text-ink-soft">
                    Must sum to 100 points maximum.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-enterprise font-bold border ${
                      totalPoints === 100
                        ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                        : totalPoints > 100
                        ? "bg-rose-50 text-rose-700 border-rose-300 animate-pulse"
                        : "bg-amber-50 text-amber-700 border-amber-300"
                    }`}
                  >
                    {totalPoints} / 100 pts
                  </span>
                  <button
                    type="button"
                    onClick={addCriterion}
                    className="inline-flex items-center gap-1 rounded-lg border border-electric/40 bg-electric/10 px-2 py-1 text-[11px] font-enterprise font-semibold text-electric hover:bg-electric hover:text-white transition-colors cursor-pointer"
                  >
                    <Plus size={12} />
                    <span>Add Criterion</span>
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                {criteria.map((c, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-[#bcd6fa] bg-canvas/30 p-3 space-y-2"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Criterion Name (e.g. Concurrency & Locking)"
                        value={c.criterion}
                        onChange={(e) => updateCriterion(i, "criterion", e.target.value)}
                        className="flex-1 rounded-lg border border-[#bcd6fa] bg-white px-2.5 py-1.5 text-xs font-enterprise text-ink focus:border-electric focus:outline-hidden"
                      />
                      <div className="flex items-center gap-1 shrink-0 w-24">
                        <input
                          type="number"
                          min={1}
                          max={100}
                          value={c.max_points}
                          onChange={(e) =>
                            updateCriterion(i, "max_points", parseInt(e.target.value) || 0)
                          }
                          className="w-16 rounded-lg border border-[#bcd6fa] bg-white px-2 py-1.5 text-xs font-enterprise text-center font-bold text-ink focus:border-electric focus:outline-hidden"
                        />
                        <span className="text-[11px] font-enterprise text-mist">pts</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeCriterion(i)}
                        disabled={criteria.length <= 1}
                        className="p-1.5 text-mist hover:text-rose-600 rounded-lg hover:bg-rose-50 disabled:opacity-30 cursor-pointer"
                      >
                        <X size={14} />
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="Optional scoring instructions / expectation..."
                      value={c.description || ""}
                      onChange={(e) => updateCriterion(i, "description", e.target.value)}
                      className="w-full rounded-lg border border-[#bcd6fa]/60 bg-white px-2.5 py-1 text-[11px] font-enterprise text-ink-soft placeholder:text-mist focus:border-electric focus:outline-hidden"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-[#bcd6fa]/40 bg-canvas/40 flex items-center justify-between shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[#bcd6fa] bg-white px-4 py-2 text-xs font-enterprise font-semibold text-ink-soft hover:bg-canvas transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending || totalPoints > 100}
              className="inline-flex items-center gap-1.5 rounded-xl bg-electric px-5 py-2 text-xs font-enterprise font-bold text-white shadow-2xs hover:bg-electric/90 disabled:opacity-50 transition-all cursor-pointer"
            >
              {isPending ? "Saving..." : editing ? "Update Template" : "Create Template"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Main View Component
export default function AssessmentsView({
  templates,
  vettings,
  categories = [],
  basePath = "/recruiter/assessments",
}: AssessmentsViewProps) {
  const router = useRouter();
  const effectiveCategories =
    categories && categories.length > 0 ? categories : DEFAULT_CATEGORIES;

  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<AssessmentTemplate | null>(null);
  const [search, setSearch] = useState("");
  const [sectorFilter, setSectorFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [archiving, setArchiving] = useState<string | null>(null);

  const handleArchive = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!confirm("Archive this assessment template? It will be deactivated from future vetting assignments.")) {
      return;
    }
    setArchiving(id);
    await archiveAssessmentTemplate(id);
    setArchiving(null);
    router.refresh();
  };

  const hasActiveFilters =
    search.trim() !== "" ||
    sectorFilter !== "all" ||
    categoryFilter !== "all" ||
    statusFilter !== "all";

  const resetFilters = () => {
    setSearch("");
    setSectorFilter("all");
    setCategoryFilter("all");
    setStatusFilter("all");
  };

  // Filter Templates
  const filteredTemplates = templates.filter((t) => {
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      t.title.toLowerCase().includes(q) ||
      (t.description || "").toLowerCase().includes(q) ||
      (t.instructions || "").toLowerCase().includes(q) ||
      (t.marks_distribution || []).some((m) =>
        m.criterion.toLowerCase().includes(q)
      );

    const matchesSector = sectorFilter === "all" || t.sector === sectorFilter;
    const matchesCategory =
      categoryFilter === "all" ||
      t.category === categoryFilter ||
      t.category.replace("cat-", "") === categoryFilter.replace("cat-", "");

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && t.is_active) ||
      (statusFilter === "archived" && !t.is_active);

    return matchesSearch && matchesSector && matchesCategory && matchesStatus;
  });

  // KPI Calculations
  const totalTemplates = templates.length;
  const activeVettings = vettings.filter(
    (v) => !["passed", "failed", "expired"].includes(v.status)
  ).length;
  const passedCount = vettings.filter((v) => v.status === "passed").length;
  const pendingScoreCount = vettings.filter((v) => v.status === "submitted").length;

  return (
    <div className="space-y-6 pb-20 text-ink font-enterprise">
      {/* Header Cockpit Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-electric/30 bg-electric/10 px-3 py-0.5 text-[11px] font-enterprise font-bold text-electric uppercase tracking-wider">
            <ShieldCheck size={12} />
            <span>DYNAMIC VETTING ARCHITECTURE</span>
          </div>
          <h1 className="mt-1 font-display text-2xl font-bold text-ink">
            Assessments &amp; Vetting
          </h1>
          <p className="text-xs sm:text-sm text-ink-soft font-enterprise">
            Build dynamic assessment templates and manage candidate vetting workflows across technology and healthcare sectors.
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={() => {
              setEditingTemplate(null);
              setSheetOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-electric px-4 py-2 text-xs font-enterprise font-bold text-white shadow-2xs hover:bg-electric/90 transition-all cursor-pointer"
          >
            <Plus size={16} />
            <span>New Template</span>
          </button>
        </div>
      </div>

      {/* Metric KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        {/* Card 1: Templates Library */}
        <div className="group relative overflow-hidden rounded-2xl border border-[#bcd6fa] bg-white p-4 shadow-2xs hover:shadow-md hover:border-electric/70 transition-all">
          <div
            className="pointer-events-none absolute -bottom-2 -right-2 h-20 w-32 opacity-20 group-hover:opacity-35 transition-opacity bg-contain bg-no-repeat bg-right-bottom"
            style={{ backgroundImage: "url('/assets/register/bg_card_bottom.png')" }}
          />
          <div className="relative z-10 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between">
              <span className="font-enterprise text-[10px] text-mist uppercase tracking-wider font-semibold">
                Active Library
              </span>
              <FileText size={16} className="text-electric" />
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="font-display text-2xl font-bold text-ink">
                {totalTemplates}
              </span>
              <span className="text-[11px] font-enterprise font-semibold text-electric">
                Templates
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Active Vettings */}
        <div className="group relative overflow-hidden rounded-2xl border border-[#bcd6fa] bg-white p-4 shadow-2xs hover:shadow-md hover:border-electric/70 transition-all">
          <div
            className="pointer-events-none absolute -bottom-2 -right-2 h-20 w-32 opacity-20 group-hover:opacity-35 transition-opacity bg-contain bg-no-repeat bg-right-bottom"
            style={{ backgroundImage: "url('/assets/register/bg_card_bottom.png')" }}
          />
          <div className="relative z-10 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between">
              <span className="font-enterprise text-[10px] text-mist uppercase tracking-wider font-semibold">
                In Evaluation
              </span>
              <Zap size={16} className="text-amber-500" />
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="font-display text-2xl font-bold text-ink">
                {activeVettings}
              </span>
              <span className="text-[11px] font-enterprise font-semibold text-amber-600">
                Active
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Passed Candidates */}
        <div className="group relative overflow-hidden rounded-2xl border border-[#bcd6fa] bg-white p-4 shadow-2xs hover:shadow-md hover:border-electric/70 transition-all">
          <div
            className="pointer-events-none absolute -bottom-2 -right-2 h-20 w-32 opacity-20 group-hover:opacity-35 transition-opacity bg-contain bg-no-repeat bg-right-bottom"
            style={{ backgroundImage: "url('/assets/register/bg_card_bottom.png')" }}
          />
          <div className="relative z-10 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between">
              <span className="font-enterprise text-[10px] text-mist uppercase tracking-wider font-semibold">
                Qualified Pool
              </span>
              <CheckCircle2 size={16} className="text-emerald-600" />
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="font-display text-2xl font-bold text-ink">
                {passedCount}
              </span>
              <span className="text-[11px] font-enterprise font-semibold text-emerald-600">
                Passed
              </span>
            </div>
          </div>
        </div>

        {/* Card 4: Pending Score */}
        <div className="group relative overflow-hidden rounded-2xl border border-[#bcd6fa] bg-white p-4 shadow-2xs hover:shadow-md hover:border-electric/70 transition-all">
          <div
            className="pointer-events-none absolute -bottom-2 -right-2 h-20 w-32 opacity-20 group-hover:opacity-35 transition-opacity bg-contain bg-no-repeat bg-right-bottom"
            style={{ backgroundImage: "url('/assets/register/bg_card_bottom.png')" }}
          />
          <div className="relative z-10 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between">
              <span className="font-enterprise text-[10px] text-mist uppercase tracking-wider font-semibold">
                Awaiting Score
              </span>
              <Clock size={16} className="text-sky-500" />
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="font-display text-2xl font-bold text-ink">
                {pendingScoreCount}
              </span>
              <span className="text-[11px] font-enterprise font-semibold text-sky-600">
                Pending
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Prominent Search and Filter Control Bar (No tabs!) */}
      <div className="rounded-2xl border border-[#bcd6fa] bg-white p-3.5 shadow-2xs space-y-3 font-enterprise">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Prominent Search Box */}
          <div className="relative flex-1">
            <Search
              size={15}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-mist"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search assessment templates by title, description, category, or criteria..."
              className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/30 pl-10 pr-9 py-2 text-xs font-enterprise text-ink placeholder:text-mist focus:border-electric focus:bg-white focus:outline-hidden"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-mist hover:text-ink cursor-pointer"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filter Dropdowns */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0">
            {/* Sector Filter */}
            <select
              value={sectorFilter}
              onChange={(e) => setSectorFilter(e.target.value)}
              className="rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 text-xs font-enterprise font-semibold text-ink focus:border-electric focus:outline-hidden cursor-pointer shadow-2xs"
            >
              <option value="all">All Sectors</option>
              {Object.entries(SECTOR_LABELS).map(([v, l]) => (
                <option key={v} value={v}>
                  {l}
                </option>
              ))}
            </select>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 text-xs font-enterprise font-semibold text-ink focus:border-electric focus:outline-hidden cursor-pointer shadow-2xs"
            >
              <option value="all">All Categories</option>
              {effectiveCategories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label} {c.sectorId && c.sectorId !== "both" ? `(${c.sectorId})` : ""}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 text-xs font-enterprise font-semibold text-ink focus:border-electric focus:outline-hidden cursor-pointer shadow-2xs"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="archived">Archived Only</option>
            </select>

            {/* Reset Button */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-1 rounded-xl border border-rose-200 bg-rose-50 px-2.5 py-2 text-xs font-enterprise font-semibold text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer shrink-0"
                title="Reset all filters"
              >
                <RotateCcw size={12} />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Counter Info Strip */}
        <div className="flex items-center justify-between text-[11px] text-mist border-t border-[#bcd6fa]/40 pt-2 px-1">
          <span>
            Showing <strong className="text-ink font-semibold">{filteredTemplates.length}</strong> of {templates.length} assessment templates
          </span>
          <span className="text-[10.5px]">
            Click any assessment title to view criteria, validators, and candidate submissions.
          </span>
        </div>
      </div>

      {/* Enterprise High-Density Table */}
      <div className="rounded-2xl border border-[#bcd6fa]/80 bg-white overflow-hidden shadow-2xs font-enterprise">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="border-b border-[#bcd6fa]/60 bg-slate-50/90 text-[10.5px] uppercase font-bold text-slate-500 tracking-wider select-none">
              <tr>
                <th className="px-4 py-3 align-middle font-semibold text-slate-600 min-w-[280px]">
                  Assessment Template &amp; Objectives
                </th>
                <th className="px-3.5 py-3 align-middle font-semibold text-slate-600 whitespace-nowrap min-w-[160px]">
                  Category &amp; Sector
                </th>
                <th className="px-3.5 py-3 align-middle font-semibold text-slate-600 whitespace-nowrap min-w-[140px]">
                  Scoring Rubric
                </th>
                <th className="px-3.5 py-3 align-middle font-semibold text-slate-600 whitespace-nowrap min-w-[150px]">
                  Candidate Vettings
                </th>
                <th className="px-3.5 py-3 align-middle font-semibold text-slate-600 whitespace-nowrap min-w-[130px]">
                  Version &amp; Author
                </th>
                <th className="px-4 py-3 align-middle font-semibold text-slate-600 text-right whitespace-nowrap min-w-[140px]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#bcd6fa]/40 text-xs text-ink">
              {filteredTemplates.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-ink-soft">
                    <ClipboardList size={36} className="mx-auto text-mist/60 mb-2" />
                    <div className="font-display text-sm font-bold text-ink">
                      No Assessment Templates Found
                    </div>
                    <p className="text-xs text-mist mt-1 max-w-sm mx-auto font-enterprise">
                      Try adjusting your search query or create a new template for evaluation.
                    </p>
                    {hasActiveFilters ? (
                      <button
                        type="button"
                        onClick={resetFilters}
                        className="mt-3 inline-flex items-center gap-1 rounded-xl border border-[#bcd6fa] bg-white px-3 py-1.5 text-xs font-enterprise font-semibold text-ink-soft hover:bg-canvas transition-colors cursor-pointer"
                      >
                        <RotateCcw size={12} />
                        <span>Clear Filters</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingTemplate(null);
                          setSheetOpen(true);
                        }}
                        className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-electric px-3.5 py-1.5 text-xs font-enterprise font-bold text-white shadow-2xs hover:bg-electric/90 transition-all cursor-pointer"
                      >
                        <Plus size={14} />
                        <span>Create First Template</span>
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                filteredTemplates.map((template) => {
                  const badgeStyle = getCategoryBadge(template.category);
                  const totalPts =
                    template.marks_distribution?.reduce(
                      (s, c) => s + c.max_points,
                      0
                    ) || template.total_marks;

                  const criteriaList = template.marks_distribution || [];

                  // Count related vettings
                  const relVettings = vettings.filter(
                    (v) =>
                      v.template_id === template.id ||
                      v.template_title === template.title
                  );
                  const passedRel = relVettings.filter((v) => v.status === "passed").length;
                  const inProgressRel = relVettings.filter(
                    (v) => !["passed", "failed", "expired"].includes(v.status)
                  ).length;

                  return (
                    <tr
                      key={template.id}
                      onClick={() => router.push(`${basePath}/${template.id}`)}
                      className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                    >
                      {/* Col 1: Template & Overview */}
                      <td className="px-4 py-3 align-top">
                        <div className="flex items-start gap-2">
                          <div className="min-w-0">
                            <Link
                              href={`${basePath}/${template.id}`}
                              onClick={(e) => e.stopPropagation()}
                              className="font-display text-[13px] font-bold text-ink hover:text-electric transition-colors block leading-snug"
                            >
                              {template.title}
                            </Link>
                            {template.description ? (
                              <p className="text-[11.5px] text-ink-soft line-clamp-2 leading-relaxed mt-1 font-enterprise">
                                {template.description}
                              </p>
                            ) : (
                              <p className="text-[11px] text-mist italic mt-0.5 font-enterprise">
                                No description provided.
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Col 2: Category & Sector */}
                      <td className="px-3.5 py-3 align-top">
                        <div className="flex flex-col gap-1 items-start">
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[10.5px] font-enterprise font-bold border ${badgeStyle}`}
                          >
                            {getCategoryLabel(template.category, effectiveCategories)}
                          </span>
                          <span className="rounded-full bg-canvas px-2 py-0.5 text-[10px] font-enterprise font-semibold text-ink-soft border border-[#bcd6fa]/60">
                            {SECTOR_LABELS[template.sector] || template.sector}
                          </span>
                        </div>
                      </td>

                      {/* Col 3: Scoring Rubric */}
                      <td className="px-3.5 py-3 align-top">
                        <div className="flex flex-col items-start gap-0.5">
                          <span className="inline-flex items-center gap-1 font-enterprise text-[12px] font-bold text-electric">
                            <Award size={13} className="text-electric" />
                            <span>{totalPts} Marks</span>
                          </span>
                          <span className="text-[11px] text-mist font-enterprise">
                            {criteriaList.length} {criteriaList.length === 1 ? "criterion" : "criteria"}
                          </span>
                        </div>
                      </td>

                      {/* Col 4: Candidate Vettings */}
                      <td className="px-3.5 py-3 align-top">
                        <div className="flex flex-col items-start gap-0.5">
                          <span className="font-enterprise text-[12px] font-bold text-ink">
                            {relVettings.length} {relVettings.length === 1 ? "Vetting" : "Vettings"}
                          </span>
                          <span className="text-[10.5px] font-enterprise text-ink-soft">
                            {passedRel > 0 && (
                              <strong className="text-emerald-700 font-semibold">{passedRel} passed · </strong>
                            )}
                            {inProgressRel} active
                          </span>
                        </div>
                      </td>

                      {/* Col 5: Version & Author */}
                      <td className="px-3.5 py-3 align-top">
                        <div className="flex flex-col items-start gap-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="rounded-md bg-slate-100 px-1.5 py-0.2 text-[10px] font-enterprise font-bold text-slate-600 border border-slate-200">
                              v{template.version}
                            </span>
                            {!template.is_active && (
                              <span className="rounded-md bg-rose-50 px-1.5 py-0.2 text-[10px] font-enterprise font-bold text-rose-600 border border-rose-200">
                                Archived
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-mist truncate max-w-[120px] font-enterprise">
                            {template.created_by_name || "Staff Recruiter"}
                          </span>
                        </div>
                      </td>

                      {/* Col 6: Actions */}
                      <td className="px-4 py-3 align-top text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`${basePath}/${template.id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 rounded-lg border border-[#bcd6fa] bg-white px-2.5 py-1 text-xs font-enterprise font-semibold text-ink-soft hover:bg-canvas hover:text-electric transition-colors"
                          >
                            <span>Details</span>
                            <ChevronRight size={13} />
                          </Link>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingTemplate(template);
                              setSheetOpen(true);
                            }}
                            className="rounded-lg border border-[#bcd6fa] bg-white p-1 text-mist hover:text-ink hover:bg-canvas transition-colors cursor-pointer"
                            title="Edit Template"
                          >
                            <Pencil size={13} />
                          </button>

                          <button
                            type="button"
                            onClick={(e) => handleArchive(template.id, e)}
                            disabled={archiving === template.id}
                            className="rounded-lg border border-rose-200 bg-rose-50/50 p-1 text-rose-600 hover:bg-rose-100 disabled:opacity-40 transition-colors cursor-pointer"
                            title="Archive Template"
                          >
                            <Archive size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-over Sheet for Create / Edit */}
      <TemplateSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        editing={editingTemplate}
        onSaved={() => router.refresh()}
        categories={categories}
      />
    </div>
  );
}
