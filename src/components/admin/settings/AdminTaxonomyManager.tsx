"use client";

import React, { useState, useTransition } from "react";
import {
  Settings,
  CheckCircle,
  X,
  Search,
  AlertTriangle,
  Zap,
  ShieldCheck,
  Clock,
  Briefcase,
  Users,
  FileText,
} from "@/components/ui/Icons";
import { ChevronDown, Layers } from "lucide-react";
import {
  TaxonomyMatrix,
  updateTaxonomiesAction,
  rollbackTaxonomyAction,
} from "@/actions/taxonomy.actions";
import {
  SectorOption,
  DomainOption,
  SkillOption,
  SeniorityOption,
  WorkAuthOption,
  EngagementOption,
  AssessmentCategoryOption,
  ValidatorSpecializationOption,
  InterviewFormatOption,
} from "@/types/taxonomy.types";

interface AdminTaxonomyManagerProps {
  initialVersion: number;
  initialMatrix: TaxonomyMatrix;
  initialHistory?: any[];
  publishedAt?: string | null;
  author?: string;
}

type TaxonomyTab =
  | "skills"
  | "domains"
  | "seniorities"
  | "sectors"
  | "workAuths"
  | "engagements"
  | "assessmentCategories"
  | "validatorSpecializations"
  | "interviewFormats";

export function AdminTaxonomyManager({
  initialVersion,
  initialMatrix,
  initialHistory = [],
  publishedAt,
  author,
}: AdminTaxonomyManagerProps) {
  const [matrix, setMatrix] = useState<TaxonomyMatrix>({
    ...initialMatrix,
    assessmentCategories: initialMatrix.assessmentCategories || [],
    validatorSpecializations: initialMatrix.validatorSpecializations || [],
    interviewFormats: initialMatrix.interviewFormats || [],
  });
  const [activeVersion, setActiveVersion] = useState<number>(initialVersion);
  const [activeTab, setActiveTab] = useState<TaxonomyTab>("skills");
  const [sectorFilter, setSectorFilter] = useState<"all" | "technology" | "healthcare">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Sheet States
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [isHistorySheetOpen, setIsHistorySheetOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [isCreateMode, setIsCreateMode] = useState(false);

  // Form Field State for Sheet
  const [formId, setFormId] = useState("");
  const [formLabel, setFormLabel] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formSectorId, setFormSectorId] = useState<string>("technology");
  const [formBadge, setFormBadge] = useState("");
  const [formHeadline, setFormHeadline] = useState("");
  const [formIconName, setFormIconName] = useState("Zap");
  const [formRecommendedSkills, setFormRecommendedSkills] = useState("");
  const [formIsPopular, setFormIsPopular] = useState(false);
  const [formYearsRange, setFormYearsRange] = useState("");
  const [formCanonicalLevel, setFormCanonicalLevel] = useState("mid");
  const [formCanonicalAuth, setFormCanonicalAuth] = useState("us_citizen");
  const [formRegion, setFormRegion] = useState("US");
  const [formCanonicalEngagement, setFormCanonicalEngagement] = useState("w2");
  const [formDurationMinutes, setFormDurationMinutes] = useState<number>(60);

  // Notification Toast
  const [notification, setNotification] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setNotification({ type, text });
    setTimeout(() => setNotification(null), 4500);
  };

  const openCreateSheet = () => {
    setIsCreateMode(true);
    setEditingItem(null);

    // Provide helpful ID prefix based on active tab
    const prefixMap: Record<TaxonomyTab, string> = {
      skills: "sk-",
      domains: "dom-tech-",
      seniorities: "lvl-tech-",
      sectors: "sec-",
      workAuths: "auth-",
      engagements: "eng-",
      assessmentCategories: "cat-",
      validatorSpecializations: "val-",
      interviewFormats: "fmt-",
    };
    setFormId(prefixMap[activeTab] || "");
    setFormLabel("");
    setFormDescription("");
    setFormSectorId(["assessmentCategories", "interviewFormats"].includes(activeTab) ? "both" : "technology");
    setFormBadge("");
    setFormHeadline("");
    setFormIconName("Zap");
    setFormRecommendedSkills("");
    setFormIsPopular(false);
    setFormYearsRange("3 to 5 Years");
    setFormCanonicalLevel("mid");
    setFormCanonicalAuth("us_citizen");
    setFormRegion("US");
    setFormCanonicalEngagement("w2");
    setFormDurationMinutes(60);

    setIsEditSheetOpen(true);
  };


  const openEditSheet = (item: any) => {
    setIsCreateMode(false);
    setEditingItem(item);

    setFormId(item.id || "");
    setFormLabel(item.label || "");
    setFormDescription(item.description || "");
    setFormSectorId(item.sectorId || (item.code === "healthcare" ? "healthcare" : "technology"));
    setFormBadge(item.badge || "");
    setFormHeadline(item.headline || "");
    setFormIconName(item.iconName || "Zap");
    setFormRecommendedSkills(item.recommendedSkills ? item.recommendedSkills.join(", ") : "");
    setFormIsPopular(Boolean(item.isPopular));
    setFormYearsRange(item.yearsRange || "");
    setFormCanonicalLevel(item.canonicalLevel || "mid");
    setFormCanonicalAuth(item.canonicalAuth || "us_citizen");
    setFormRegion(item.region || "US");
    setFormCanonicalEngagement(item.canonicalEngagement || "w2");
    setFormDurationMinutes(item.durationMinutes || 60);

    setIsEditSheetOpen(true);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formId.trim() || !formLabel.trim()) {
      showToast("ID and Label are required.", "error");
      return;
    }

    const cleanId = formId.trim().toLowerCase().replace(/\s+/g, "-");
    const updated = { ...matrix };

    if (activeTab === "sectors") {
      const item: SectorOption = {
        id: cleanId,
        code: formSectorId as any,
        label: formLabel.trim(),
        description: formDescription.trim(),
        badge: formBadge.trim() || "Enterprise Roles",
        iconName: formIconName.trim() || "Zap",
        headline: formHeadline.trim(),
      };
      updated.sectors = isCreateMode
        ? [...updated.sectors, item]
        : updated.sectors.map((s) => (s.id === editingItem.id ? item : s));
    } else if (activeTab === "domains") {
      const skillsArray = formRecommendedSkills
        ? formRecommendedSkills.split(",").map((s) => s.trim()).filter(Boolean)
        : [];
      const item: DomainOption = {
        id: cleanId,
        sectorId: formSectorId as any,
        label: formLabel.trim(),
        description: formDescription.trim(),
        recommendedSkills: skillsArray,
      };
      updated.domains = isCreateMode
        ? [...updated.domains, item]
        : updated.domains.map((d) => (d.id === editingItem.id ? item : d));
    } else if (activeTab === "skills") {
      const item: SkillOption = {
        id: cleanId,
        sectorId: formSectorId as any,
        label: formLabel.trim(),
        isPopular: formIsPopular,
      };
      updated.skills = isCreateMode
        ? [...updated.skills, item]
        : updated.skills.map((s) => (s.id === editingItem.id ? item : s));
    } else if (activeTab === "seniorities") {
      const item: SeniorityOption = {
        id: cleanId,
        sectorId: formSectorId as any,
        label: formLabel.trim(),
        yearsRange: formYearsRange.trim(),
        canonicalLevel: formCanonicalLevel as any,
        description: formDescription.trim(),
      };
      updated.seniorities = isCreateMode
        ? [...updated.seniorities, item]
        : updated.seniorities.map((s) => (s.id === editingItem.id ? item : s));
    } else if (activeTab === "workAuths") {
      const item: WorkAuthOption = {
        id: cleanId,
        label: formLabel.trim(),
        canonicalAuth: formCanonicalAuth as any,
        region: formRegion as any,
        description: formDescription.trim(),
      };
      updated.workAuths = isCreateMode
        ? [...updated.workAuths, item]
        : updated.workAuths.map((w) => (w.id === editingItem.id ? item : w));
    } else if (activeTab === "engagements") {
      const item: EngagementOption = {
        id: cleanId,
        label: formLabel.trim(),
        canonicalEngagement: formCanonicalEngagement as any,
        badge: formBadge.trim() || "Contract",
        description: formDescription.trim(),
      };
      updated.engagements = isCreateMode
        ? [...updated.engagements, item]
        : updated.engagements.map((e) => (e.id === editingItem.id ? item : e));
    } else if (activeTab === "assessmentCategories") {
      const item: AssessmentCategoryOption = {
        id: cleanId,
        label: formLabel.trim(),
        sectorId: formSectorId as any,
        badge: formBadge.trim() || "Assessment",
        description: formDescription.trim(),
      };
      const existing = updated.assessmentCategories || [];
      updated.assessmentCategories = isCreateMode
        ? [...existing, item]
        : existing.map((c) => (c.id === editingItem.id ? item : c));
    } else if (activeTab === "validatorSpecializations") {
      const item: ValidatorSpecializationOption = {
        id: cleanId,
        label: formLabel.trim(),
        sectorId: formSectorId as any,
        badge: formBadge.trim() || "Specialist",
        description: formDescription.trim(),
      };
      const existing = updated.validatorSpecializations || [];
      updated.validatorSpecializations = isCreateMode
        ? [...existing, item]
        : existing.map((v) => (v.id === editingItem.id ? item : v));
    } else if (activeTab === "interviewFormats") {
      const item: InterviewFormatOption = {
        id: cleanId,
        label: formLabel.trim(),
        sectorId: formSectorId as any,
        badge: formBadge.trim() || "Interview Round",
        durationMinutes: Number(formDurationMinutes) || 60,
        description: formDescription.trim(),
      };
      const existing = updated.interviewFormats || [];
      updated.interviewFormats = isCreateMode
        ? [...existing, item]
        : existing.map((v) => (v.id === editingItem.id ? item : v));
    }

    setMatrix(updated);
    setHasUnsavedChanges(true);
    setIsEditSheetOpen(false);
    showToast(`Choice "${formLabel}" updated in local draft. Remember to publish!`);
  };

  const handleDeleteItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(`Are you sure you want to remove item "${id}" from the taxonomy draft?`)) return;

    const updated = { ...matrix };
    if (activeTab === "sectors") updated.sectors = updated.sectors.filter((s) => s.id !== id);
    if (activeTab === "domains") updated.domains = updated.domains.filter((d) => d.id !== id);
    if (activeTab === "skills") updated.skills = updated.skills.filter((s) => s.id !== id);
    if (activeTab === "seniorities") updated.seniorities = updated.seniorities.filter((s) => s.id !== id);
    if (activeTab === "workAuths") updated.workAuths = updated.workAuths.filter((w) => w.id !== id);
    if (activeTab === "engagements") updated.engagements = updated.engagements.filter((e) => e.id !== id);
    if (activeTab === "assessmentCategories") {
      updated.assessmentCategories = (updated.assessmentCategories || []).filter((c) => c.id !== id);
    }
    if (activeTab === "validatorSpecializations") {
      updated.validatorSpecializations = (updated.validatorSpecializations || []).filter((v) => v.id !== id);
    }
    if (activeTab === "interviewFormats") {
      updated.interviewFormats = (updated.interviewFormats || []).filter((v) => v.id !== id);
    }

    setMatrix(updated);
    setHasUnsavedChanges(true);
    showToast(`Removed "${id}" from draft matrix.`);
  };

  const handlePublishMatrix = () => {
    startTransition(async () => {
      const note = `Admin published version containing ${matrix.skills.length} skills, ${matrix.domains.length} domains, ${(matrix.validatorSpecializations || []).length} validator specializations.`;
      const res = await updateTaxonomiesAction(matrix, note);

      if (res.success) {
        setActiveVersion(res.version ?? activeVersion + 1);
        setHasUnsavedChanges(false);
        showToast(`Taxonomy Matrix published as Version ${res.version}! Candidate intake choices updated live.`);
      } else {
        showToast(res.error || "Failed to publish taxonomy matrix.", "error");
      }
    });
  };

  const handleRollback = (targetVersion: number) => {
    if (!confirm(`Rollback candidate taxonomy matrix to historical Version ${targetVersion}?`)) return;

    startTransition(async () => {
      const res = await rollbackTaxonomyAction(targetVersion);
      if (res.success) {
        setActiveVersion(res.version ?? targetVersion);
        setHasUnsavedChanges(false);
        setIsHistorySheetOpen(false);
        showToast(`Rolled back to Version ${targetVersion}. Active version is now ${res.version}.`);
      } else {
        showToast(res.error || "Failed to rollback version.", "error");
      }
    });
  };

  // Filter current list
  const getFilteredItems = () => {
    let items: any[] = [];
    if (activeTab === "sectors") items = matrix.sectors;
    else if (activeTab === "domains") items = matrix.domains;
    else if (activeTab === "skills") items = matrix.skills;
    else if (activeTab === "seniorities") items = matrix.seniorities;
    else if (activeTab === "workAuths") items = matrix.workAuths;
    else if (activeTab === "engagements") items = matrix.engagements;
    else if (activeTab === "assessmentCategories") items = matrix.assessmentCategories || [];
    else if (activeTab === "validatorSpecializations") items = matrix.validatorSpecializations || [];
    else if (activeTab === "interviewFormats") items = matrix.interviewFormats || [];

    return items.filter((item) => {
      // Sector filter (where applicable)
      if (sectorFilter !== "all") {
        if ("sectorId" in item) {
          if (item.sectorId === "both" || item.sectorId === "all") {
            // matches both sectors
          } else if (item.sectorId !== sectorFilter) {
            return false;
          }
        }
        if ("code" in item && item.code !== sectorFilter) return false;
      }
      // Search query
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const matchLabel = item.label?.toLowerCase().includes(q);
      const matchId = item.id?.toLowerCase().includes(q);
      const matchDesc = item.description?.toLowerCase().includes(q);
      return matchLabel || matchId || matchDesc;
    });
  };

  const currentItems = getFilteredItems();

  const tabCounts = {
    skills: matrix.skills.length,
    domains: matrix.domains.length,
    seniorities: matrix.seniorities.length,
    sectors: matrix.sectors.length,
    workAuths: matrix.workAuths.length,
    engagements: matrix.engagements.length,
    assessmentCategories: (matrix.assessmentCategories || []).length,
    validatorSpecializations: (matrix.validatorSpecializations || []).length,
    interviewFormats: (matrix.interviewFormats || []).length,
  };

  const tabDefinitions: { id: TaxonomyTab; label: string; count: number }[] = [
    { id: "skills", label: "Skills & Specialties", count: tabCounts.skills },
    { id: "domains", label: "Domains & Specialist Tracks", count: tabCounts.domains },
    { id: "seniorities", label: "Seniority Levels", count: tabCounts.seniorities },
    { id: "sectors", label: "Sectors", count: tabCounts.sectors },
    { id: "workAuths", label: "Work Authorizations", count: tabCounts.workAuths },
    { id: "engagements", label: "Engagement Models", count: tabCounts.engagements },
    { id: "assessmentCategories", label: "Assessment Categories", count: tabCounts.assessmentCategories },
    { id: "validatorSpecializations", label: "Validator Specializations", count: tabCounts.validatorSpecializations },
    { id: "interviewFormats", label: "Interview Formats & Rounds", count: tabCounts.interviewFormats },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 font-enterprise">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-electric/30 bg-electric/10 px-3 py-0.5 text-xs font-semibold text-electric">
            <Settings size={13} />
            <span>DYNAMIC CHOICE MATRIX &amp; TAXONOMY VERSIONING</span>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <h1 className="font-display text-2xl font-bold text-ink">Candidate Choice Matrix &amp; Taxonomies</h1>
            <span className="rounded-full bg-ink px-2.5 py-0.5 font-enterprise text-xs font-bold text-white shadow-2xs">
              v{activeVersion}
            </span>
          </div>
          <p className="text-xs text-ink-soft">
            Manage sectors, domains, skills, seniorities, visas, engagement models, and vetting categories live without code redeployments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsHistorySheetOpen(true)}
            className="rounded-xl border border-[#bcd6fa] bg-white px-3.5 py-2.5 font-enterprise text-xs font-semibold text-ink-soft hover:bg-canvas transition-colors cursor-pointer shadow-2xs"
          >
            History &amp; Rollback
          </button>
          <button
            type="button"
            onClick={openCreateSheet}
            className="rounded-xl border border-electric bg-electric/10 px-3.5 py-2.5 font-enterprise text-xs font-semibold text-electric hover:bg-electric hover:text-white transition-all cursor-pointer shadow-2xs"
          >
            + Add Choice
          </button>
          <button
            type="button"
            disabled={isPending || !hasUnsavedChanges}
            onClick={handlePublishMatrix}
            className={`rounded-xl px-4 py-2.5 font-enterprise text-xs font-bold shadow-2xs transition-all cursor-pointer ${
              hasUnsavedChanges
                ? "bg-signal text-white hover:bg-emerald-600 animate-pulse"
                : "bg-ink text-white hover:bg-electric disabled:opacity-40"
            }`}
          >
            {isPending ? "Publishing..." : hasUnsavedChanges ? "Publish Pending Changes" : "Matrix Synced"}
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div
          className={`rounded-xl border px-4 py-2.5 text-xs font-semibold flex items-center gap-2 animate-in fade-in-0 duration-200 ${
            notification.type === "success"
              ? "border-signal/30 bg-signal/10 text-signal"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {notification.type === "success" ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
          <span>{notification.text}</span>
        </div>
      )}

      {/* Unsaved Changes Banner */}
      {hasUnsavedChanges && (
        <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-amber-900 font-semibold">
            <Clock size={16} />
            <span>You have draft changes not yet published to the live candidate onboarding cluster.</span>
          </div>
          <button
            type="button"
            disabled={isPending}
            onClick={handlePublishMatrix}
            className="rounded-xl bg-amber-700 px-3.5 py-1.5 font-enterprise text-xs font-bold text-white hover:bg-amber-800 transition-colors cursor-pointer shadow-2xs"
          >
            Publish Now (v{activeVersion + 1})
          </button>
        </div>
      )}

      {/* Choice Group Selector Bar: Prominent and high/wide dropdown, no horizontal scrollbar pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#bcd6fa]/50 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
          <label className="font-enterprise text-xs font-bold uppercase tracking-wider text-ink-soft shrink-0">
            Active Choice Group:
          </label>
          <div className="relative w-full sm:w-96">
            <select
              value={activeTab}
              onChange={(e) => {
                setActiveTab(e.target.value as TaxonomyTab);
                setSearchQuery("");
              }}
              className="w-full h-12 font-enterprise text-sm font-bold text-ink bg-white border-2 border-[#bcd6fa] rounded-xl pl-4 pr-10 focus:border-electric focus:outline-hidden cursor-pointer shadow-xs appearance-none transition-colors"
            >
              {tabDefinitions.map((tab) => (
                <option key={tab.id} value={tab.id} className="py-1">
                  {tab.label} ({tab.count} items)
                </option>
              ))}
            </select>
            <ChevronDown size={18} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-soft" />
          </div>
        </div>

        <div className="text-xs text-ink-soft">
          Showing <span className="font-bold text-ink">{currentItems.length}</span> of{" "}
          <span className="font-bold text-ink">{tabCounts[activeTab] || 0}</span> configured choices
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-[#bcd6fa] bg-white p-3 shadow-2xs">
        <div className="flex items-center gap-2">
          {["skills", "domains", "seniorities", "sectors", "assessmentCategories", "validatorSpecializations", "interviewFormats"].includes(activeTab) && (
            <div className="flex items-center gap-1">
              {[
                { id: "all", label: "All Sectors" },
                { id: "technology", label: "Technology" },
                { id: "healthcare", label: "Healthcare" },
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSectorFilter(s.id as any)}
                  className={`rounded-lg px-2.5 py-1 font-enterprise text-xs font-semibold transition-all cursor-pointer ${
                    sectorFilter === s.id
                      ? "bg-electric text-white"
                      : "text-ink-soft hover:bg-canvas"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-mist" size={14} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ID, label, description..."
              className="w-56 sm:w-64 rounded-xl border border-[#bcd6fa] bg-canvas/40 pl-8 pr-3 py-1.5 font-enterprise text-xs text-ink placeholder:text-mist focus:border-electric focus:bg-white focus:outline-hidden"
            />
          </div>
          <span className="font-enterprise text-xs text-mist pr-2 hidden sm:inline">
            Showing {currentItems.length} items
          </span>
        </div>
      </div>

      {/* Grid of Choices */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentItems.length === 0 ? (
          <div className="col-span-full rounded-3xl border border-[#bcd6fa] bg-white p-12 text-center text-ink-soft">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-canvas border border-[#bcd6fa]/50 text-mist mb-2">
              <Search size={20} />
            </div>
            <div className="font-enterprise text-sm font-bold text-ink">No Choices Found</div>
            <p className="text-xs text-mist mt-1 font-enterprise">
              Try adjusting your search query or add a new choice item using the button above.
            </p>
          </div>
        ) : (
          currentItems.map((item) => (
            <div
              key={item.id}
              onClick={() => openEditSheet(item)}
              className="group relative rounded-2xl border border-[#bcd6fa] bg-white p-5 shadow-2xs hover:border-electric hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="font-enterprise text-[11px] font-bold text-electric bg-electric/10 px-2.5 py-0.5 rounded-md">
                    {item.id}
                  </span>
                  {"sectorId" in item && (
                    <span
                      className={`font-enterprise text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                        item.sectorId === "technology"
                          ? "bg-blue-50 text-blue-700"
                          : item.sectorId === "healthcare"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-purple-50 text-purple-700"
                      }`}
                    >
                      {item.sectorId}
                    </span>
                  )}
                  {"code" in item && (
                    <span className="font-enterprise text-[10px] uppercase font-bold bg-ink/10 text-ink px-2 py-0.5 rounded-full">
                      {item.code}
                    </span>
                  )}
                  {"region" in item && (
                    <span className="font-enterprise text-[10px] uppercase font-bold bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full">
                      {item.region}
                    </span>
                  )}
                  {item.badge && (
                    <span className="font-enterprise text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full border border-slate-200">
                      {item.badge}
                    </span>
                  )}
                  {"durationMinutes" in item && (
                    <span className="font-enterprise text-[10px] font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200">
                      ⏱ {item.durationMinutes} Mins
                    </span>
                  )}
                </div>

                <h3 className="font-enterprise text-sm font-bold text-ink mt-2 group-hover:text-electric transition-colors">
                  {item.label}
                </h3>

                {item.headline && (
                  <p className="text-[11px] font-semibold text-ink-soft mt-0.5 line-clamp-1 font-enterprise">
                    {item.headline}
                  </p>
                )}

                {item.description && (
                  <p className="text-xs text-mist mt-1 line-clamp-2 font-enterprise">
                    {item.description}
                  </p>
                )}

                {item.yearsRange && (
                  <div className="mt-2 text-xs font-enterprise text-ink font-semibold">
                    Experience Range: <span className="text-electric">{item.yearsRange}</span>
                  </div>
                )}

                {item.recommendedSkills && item.recommendedSkills.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {item.recommendedSkills.slice(0, 4).map((sk: string) => (
                      <span
                        key={sk}
                        className="rounded-md bg-canvas px-1.5 py-0.5 font-enterprise text-[10px] text-ink-soft"
                      >
                        {sk}
                      </span>
                    ))}
                    {item.recommendedSkills.length > 4 && (
                      <span className="text-[10px] text-mist font-enterprise self-center">
                        +{item.recommendedSkills.length - 4} more
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 mt-3 border-t border-[#bcd6fa]/40">
                <span className="text-xs font-enterprise text-mist group-hover:text-electric transition-colors">
                  Click to edit
                </span>
                <button
                  type="button"
                  onClick={(e) => handleDeleteItem(item.id, e)}
                  className="rounded-lg p-1 text-mist hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                  title="Remove from draft"
                >
                  <X size={15} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit & Create Right-Side Sheet (House Style & Design Rule: Right-Side Sheet Drawer) */}
      {isEditSheetOpen && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-ink/40 backdrop-blur-xs animate-in fade-in-0 duration-150"
          onClick={() => setIsEditSheetOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-white h-full shadow-2xl p-6 sm:p-8 flex flex-col justify-between overflow-y-auto thin-scrollbar font-enterprise animate-in slide-in-from-right duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-6">
              {/* Sheet Header */}
              <div className="flex items-start justify-between border-b border-[#bcd6fa]/40 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-enterprise text-xs font-bold text-electric uppercase">
                      {activeTab === "assessmentCategories" ? "VETTING CATEGORY" : activeTab}
                    </span>
                    <span className="rounded-full bg-signal/15 px-2.5 py-0.5 font-enterprise text-[10px] font-bold text-signal">
                      {isCreateMode ? "New Choice Item" : "Editing Item"}
                    </span>
                  </div>
                  <h2 className="font-display text-xl font-bold text-ink mt-1.5">
                    {isCreateMode
                      ? `Add ${activeTab === "assessmentCategories" ? "Assessment Category" : activeTab.slice(0, -1)} Choice`
                      : `Edit ${formLabel}`}
                  </h2>
                  <p className="text-xs text-ink-soft font-enterprise">
                    Changes take effect immediately across registration, vetting templates, and onboarding once the matrix is published.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsEditSheetOpen(false)}
                  className="rounded-xl p-2 text-ink-soft hover:bg-canvas cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Form Body */}
              <form id="taxonomy-item-form" onSubmit={handleSaveItem} className="space-y-4 text-xs font-enterprise">
                {/* ID */}
                <div className="space-y-1">
                  <label className="font-enterprise text-xs font-semibold text-ink block">
                    Unique Choice ID * {isCreateMode ? "(Immutable once referenced)" : "(Read-Only)"}
                  </label>
                  <input
                    type="text"
                    required
                    disabled={!isCreateMode}
                    value={formId}
                    onChange={(e) => setFormId(e.target.value)}
                    placeholder="e.g. cat-system-design or sk-langchain"
                    className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/30 px-3 py-2 font-enterprise text-xs text-ink focus:border-electric focus:bg-white focus:outline-hidden disabled:opacity-60"
                  />
                </div>

                {/* Label */}
                <div className="space-y-1">
                  <label className="font-enterprise text-xs font-semibold text-ink block">
                    Display Label *
                  </label>
                  <input
                    type="text"
                    required
                    value={formLabel}
                    onChange={(e) => setFormLabel(e.target.value)}
                    placeholder="e.g. System Design & Distributed Architecture"
                    className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 font-enterprise text-xs text-ink focus:border-electric focus:outline-hidden"
                  />
                </div>

                {/* Sector Scope (for Sectors, Domains, Skills, Seniorities) */}
                {["sectors", "domains", "skills", "seniorities"].includes(activeTab) && (
                  <div className="space-y-1">
                    <label className="font-enterprise text-xs font-semibold text-ink block">
                      Sector Track
                    </label>
                    <select
                      value={formSectorId}
                      onChange={(e) => setFormSectorId(e.target.value)}
                      className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 font-enterprise text-xs font-semibold text-ink focus:border-electric focus:outline-hidden cursor-pointer"
                    >
                      <option value="technology">Technology &amp; Software Engineering</option>
                      <option value="healthcare">Healthcare &amp; Clinical Specialists</option>
                    </select>
                  </div>
                )}

                {/* Tab Specific: Assessment Categories */}
                {activeTab === "assessmentCategories" && (
                  <>
                    <div className="space-y-1">
                      <label className="font-enterprise text-xs font-semibold text-ink block">
                        Sector Scope (Applicable Industry)
                      </label>
                      <select
                        value={formSectorId}
                        onChange={(e) => setFormSectorId(e.target.value)}
                        className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 font-enterprise text-xs font-semibold text-ink focus:border-electric focus:outline-hidden cursor-pointer"
                      >
                        <option value="both">Both / Cross-Sector (All)</option>
                        <option value="technology">Technology &amp; Software Engineering</option>
                        <option value="healthcare">Healthcare &amp; Clinical Specialists</option>
                      </select>
                      <span className="text-[11px] text-mist font-enterprise block">
                        Determines whether this category appears in Technology templates, Healthcare templates, or both.
                      </span>
                    </div>

                    <div className="space-y-1">
                      <label className="font-enterprise text-xs font-semibold text-ink block">
                        Badge Pill
                      </label>
                      <input
                        type="text"
                        value={formBadge}
                        onChange={(e) => setFormBadge(e.target.value)}
                        placeholder="e.g. Architecture Review or Clinical Governance"
                        className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 font-enterprise text-xs text-ink focus:border-electric focus:outline-hidden"
                      />
                    </div>
                  </>
                )}

                {/* Tab Specific: Interview Formats & Rounds */}
                {activeTab === "interviewFormats" && (
                  <>
                    <div className="space-y-1">
                      <label className="font-enterprise text-xs font-semibold text-ink block">
                        Sector Scope (Applicable Industry)
                      </label>
                      <select
                        value={formSectorId}
                        onChange={(e) => setFormSectorId(e.target.value)}
                        className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 font-enterprise text-xs font-semibold text-ink focus:border-electric focus:outline-hidden cursor-pointer"
                      >
                        <option value="both">Both / Cross-Sector (All Roles)</option>
                        <option value="technology">Technology &amp; Software Engineering</option>
                        <option value="healthcare">Healthcare &amp; Clinical Specialists</option>
                      </select>
                      <span className="text-[11px] text-mist font-enterprise block">
                        Determines whether this interview format appears for Technology jobs, Healthcare jobs, or all roles.
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="font-enterprise text-xs font-semibold text-ink block">
                          Badge Pill
                        </label>
                        <input
                          type="text"
                          value={formBadge}
                          onChange={(e) => setFormBadge(e.target.value)}
                          placeholder="e.g. Hands-on Code or Clinical Panel"
                          className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 font-enterprise text-xs text-ink focus:border-electric focus:outline-hidden"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-enterprise text-xs font-semibold text-ink block">
                          Duration (Minutes)
                        </label>
                        <input
                          type="number"
                          min="15"
                          max="180"
                          step="15"
                          value={formDurationMinutes}
                          onChange={(e) => setFormDurationMinutes(parseInt(e.target.value, 10) || 60)}
                          placeholder="60"
                          className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 font-enterprise text-xs text-ink focus:border-electric focus:outline-hidden"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Description */}
                <div className="space-y-1">
                  <label className="font-enterprise text-xs font-semibold text-ink block">
                    Description &amp; Onboarding / Vetting Guidance
                  </label>
                  <textarea
                    rows={3}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Explain what competencies or skills this choice evaluates..."
                    className="w-full rounded-xl border border-[#bcd6fa] bg-white p-2.5 font-enterprise text-xs text-ink focus:border-electric focus:outline-hidden"
                  />
                </div>

                {/* Tab Specific: Sectors */}
                {activeTab === "sectors" && (
                  <>
                    <div className="space-y-1">
                      <label className="font-enterprise text-xs font-semibold text-ink block">
                        Headline Subtitle
                      </label>
                      <input
                        type="text"
                        value={formHeadline}
                        onChange={(e) => setFormHeadline(e.target.value)}
                        placeholder="e.g. Full-Stack, Cloud Architecture &amp; MLOps"
                        className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 font-enterprise text-xs text-ink focus:border-electric focus:outline-hidden"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-enterprise text-xs font-semibold text-ink block">
                        Badge Pill
                      </label>
                      <input
                        type="text"
                        value={formBadge}
                        onChange={(e) => setFormBadge(e.target.value)}
                        placeholder="e.g. Enterprise Roles"
                        className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 font-enterprise text-xs text-ink focus:border-electric focus:outline-hidden"
                      />
                    </div>
                  </>
                )}

                {/* Tab Specific: Domains */}
                {activeTab === "domains" && (
                  <div className="space-y-1">
                    <label className="font-enterprise text-xs font-semibold text-ink block">
                      Recommended Skill IDs (Comma-Separated)
                    </label>
                    <input
                      type="text"
                      value={formRecommendedSkills}
                      onChange={(e) => setFormRecommendedSkills(e.target.value)}
                      placeholder="e.g. sk-react, sk-nextjs, sk-typescript"
                      className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 font-enterprise text-xs text-ink focus:border-electric focus:outline-hidden"
                    />
                    <span className="text-[10px] text-mist font-enterprise block">
                      Referenced skills are highlighted during onboarding intake.
                    </span>
                  </div>
                )}

                {/* Tab Specific: Skills */}
                {activeTab === "skills" && (
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="skill-popular"
                      checked={formIsPopular}
                      onChange={(e) => setFormIsPopular(e.target.checked)}
                      className="rounded border-[#bcd6fa] text-electric focus:ring-electric"
                    />
                    <label htmlFor="skill-popular" className="font-enterprise text-xs font-semibold text-ink cursor-pointer">
                      Mark as Popular / Quick-Pick Skill
                    </label>
                  </div>
                )}

                {/* Tab Specific: Seniorities */}
                {activeTab === "seniorities" && (
                  <>
                    <div className="space-y-1">
                      <label className="font-enterprise text-xs font-semibold text-ink block">
                        Years Experience Range
                      </label>
                      <input
                        type="text"
                        value={formYearsRange}
                        onChange={(e) => setFormYearsRange(e.target.value)}
                        placeholder="e.g. 5 to 8 Years"
                        className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 font-enterprise text-xs text-ink focus:border-electric focus:outline-hidden"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-enterprise text-xs font-semibold text-ink block">
                        Canonical Level
                      </label>
                      <select
                        value={formCanonicalLevel}
                        onChange={(e) => setFormCanonicalLevel(e.target.value)}
                        className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 font-enterprise text-xs font-semibold text-ink focus:border-electric focus:outline-hidden"
                      >
                        <option value="junior">Junior (1-2 yrs)</option>
                        <option value="mid">Mid-Level (3-5 yrs)</option>
                        <option value="senior">Senior (5-8 yrs)</option>
                        <option value="lead">Lead / Architect (8+ yrs)</option>
                        <option value="director">Director / Head</option>
                        <option value="c_level">Executive / C-Level</option>
                      </select>
                    </div>
                  </>
                )}

                {/* Tab Specific: Work Authorization */}
                {activeTab === "workAuths" && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-enterprise text-xs font-semibold text-ink block">
                        Canonical Auth Key
                      </label>
                      <select
                        value={formCanonicalAuth}
                        onChange={(e) => setFormCanonicalAuth(e.target.value)}
                        className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 font-enterprise text-xs font-semibold text-ink focus:border-electric focus:outline-hidden"
                      >
                        <option value="us_citizen">US Citizen</option>
                        <option value="green_card">Green Card</option>
                        <option value="h1b">H-1B</option>
                        <option value="opt">OPT / STEM</option>
                        <option value="international_remote">International Remote</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="font-enterprise text-xs font-semibold text-ink block">
                        Jurisdiction / Region
                      </label>
                      <select
                        value={formRegion}
                        onChange={(e) => setFormRegion(e.target.value)}
                        className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 font-enterprise text-xs font-semibold text-ink focus:border-electric focus:outline-hidden"
                      >
                        <option value="US">United States</option>
                        <option value="UK">United Kingdom</option>
                        <option value="EU">European Union</option>
                        <option value="Global">Global / Cross-Border</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Tab Specific: Engagement */}
                {activeTab === "engagements" && (
                  <>
                    <div className="space-y-1">
                      <label className="font-enterprise text-xs font-semibold text-ink block">
                        Canonical Engagement Type
                      </label>
                      <select
                        value={formCanonicalEngagement}
                        onChange={(e) => setFormCanonicalEngagement(e.target.value)}
                        className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 font-enterprise text-xs font-semibold text-ink focus:border-electric focus:outline-hidden"
                      >
                        <option value="w2">W2 Contract</option>
                        <option value="c2c">Corp-to-Corp (C2C)</option>
                        <option value="1099">1099 Independent</option>
                        <option value="direct_hire">Direct Hire FTE</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="font-enterprise text-xs font-semibold text-ink block">
                        Badge Label
                      </label>
                      <input
                        type="text"
                        value={formBadge}
                        onChange={(e) => setFormBadge(e.target.value)}
                        placeholder="e.g. US Payroll"
                        className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 font-enterprise text-xs text-ink focus:border-electric focus:outline-hidden"
                      />
                    </div>
                  </>
                )}
              </form>
            </div>

            {/* Sheet Footer */}
            <div className="pt-6 border-t border-[#bcd6fa]/40 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setIsEditSheetOpen(false)}
                className="rounded-xl px-4 py-2.5 font-enterprise text-xs font-semibold text-ink-soft hover:bg-canvas cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="taxonomy-item-form"
                className="rounded-xl bg-electric px-5 py-2.5 font-enterprise text-xs font-bold text-white hover:bg-electric-bright transition-all cursor-pointer shadow-2xs"
              >
                Save to Matrix Draft
              </button>
            </div>
          </div>
        </div>
      )}

      {/* History & Rollback Right-Side Sheet */}
      {isHistorySheetOpen && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-ink/40 backdrop-blur-xs animate-in fade-in-0 duration-150"
          onClick={() => setIsHistorySheetOpen(false)}
        >
          <div
            className="w-full max-w-md bg-white h-full shadow-2xl p-6 sm:p-8 flex flex-col justify-between overflow-y-auto thin-scrollbar font-enterprise animate-in slide-in-from-right duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-6">
              <div className="flex items-start justify-between border-b border-[#bcd6fa]/40 pb-4">
                <div>
                  <h2 className="font-display text-xl font-bold text-ink">Taxonomy Version History</h2>
                  <p className="text-xs text-ink-soft font-enterprise">
                    All prior versions are immutable. You can roll back to any historical ruleset without data loss.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsHistorySheetOpen(false)}
                  className="rounded-xl p-2 text-ink-soft hover:bg-canvas cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-3">
                {initialHistory.length === 0 ? (
                  <p className="text-xs text-mist font-enterprise">No historical versions available.</p>
                ) : (
                  initialHistory.map((h: any) => (
                    <div
                      key={h.version}
                      className={`rounded-2xl border p-4 text-xs font-enterprise flex items-center justify-between gap-3 ${
                        h.is_active
                          ? "border-signal/50 bg-signal/5"
                          : "border-[#bcd6fa] bg-white hover:border-electric"
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-enterprise font-bold text-ink">Version {h.version}</span>
                          {h.is_active && (
                            <span className="rounded-full bg-signal/15 px-2 py-0.2 font-enterprise text-[10px] font-bold text-signal">
                              ACTIVE
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-mist mt-0.5 font-enterprise">
                          {new Date(h.created_at).toLocaleDateString()} by {h.author}
                        </p>
                        {h.notes && (
                          <p className="text-[11px] text-ink-soft mt-1 line-clamp-1 font-enterprise">
                            {h.notes}
                          </p>
                        )}
                      </div>

                      {!h.is_active && (
                        <button
                          type="button"
                          onClick={() => handleRollback(h.version)}
                          className="rounded-xl border border-[#bcd6fa] bg-white px-3 py-1.5 font-enterprise text-[11px] font-bold text-electric hover:bg-electric hover:text-white transition-all cursor-pointer shadow-2xs shrink-0"
                        >
                          Rollback
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="pt-6 border-t border-[#bcd6fa]/40">
              <button
                type="button"
                onClick={() => setIsHistorySheetOpen(false)}
                className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/40 py-2.5 font-enterprise text-xs font-semibold text-ink hover:bg-canvas transition-colors cursor-pointer"
              >
                Close History
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
