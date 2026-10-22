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
} from "@/types/taxonomy.types";

interface AdminTaxonomyManagerProps {
  initialVersion: number;
  initialMatrix: TaxonomyMatrix;
  initialHistory?: any[];
  publishedAt?: string | null;
  author?: string;
}

type TaxonomyTab = "sectors" | "domains" | "skills" | "seniorities" | "workAuths" | "engagements";

export function AdminTaxonomyManager({
  initialVersion,
  initialMatrix,
  initialHistory = [],
  publishedAt,
  author,
}: AdminTaxonomyManagerProps) {
  const [matrix, setMatrix] = useState<TaxonomyMatrix>(initialMatrix);
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
  const [formSectorId, setFormSectorId] = useState<"technology" | "healthcare">("technology");
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
      sectors: "sec-",
      domains: "dom-tech-",
      skills: "sk-",
      seniorities: "lvl-tech-",
      workAuths: "auth-",
      engagements: "eng-",
    };
    setFormId(prefixMap[activeTab] || "");
    setFormLabel("");
    setFormDescription("");
    setFormSectorId("technology");
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
        code: formSectorId,
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
        sectorId: formSectorId,
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
        sectorId: formSectorId,
        label: formLabel.trim(),
        isPopular: formIsPopular,
      };
      updated.skills = isCreateMode
        ? [...updated.skills, item]
        : updated.skills.map((s) => (s.id === editingItem.id ? item : s));
    } else if (activeTab === "seniorities") {
      const item: SeniorityOption = {
        id: cleanId,
        sectorId: formSectorId,
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

    setMatrix(updated);
    setHasUnsavedChanges(true);
    showToast(`Removed "${id}" from draft matrix.`);
  };

  const handlePublishMatrix = () => {
    startTransition(async () => {
      const note = `Admin published version containing ${matrix.skills.length} skills, ${matrix.domains.length} domains, ${matrix.seniorities.length} levels.`;
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

    return items.filter((item) => {
      // Sector filter (where applicable)
      if (sectorFilter !== "all") {
        if ("sectorId" in item && item.sectorId !== sectorFilter) return false;
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
    sectors: matrix.sectors.length,
    domains: matrix.domains.length,
    skills: matrix.skills.length,
    seniorities: matrix.seniorities.length,
    workAuths: matrix.workAuths.length,
    engagements: matrix.engagements.length,
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-electric/30 bg-electric/10 px-3 py-0.5 text-xs font-semibold text-electric">
            <Settings size={13} />
            <span>DYNAMIC CHOICE MATRIX &amp; TAXONOMY VERSIONING</span>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <h1 className="font-display text-2xl font-bold text-ink">Candidate Choice Matrix &amp; Taxonomies</h1>
            <span className="rounded-full bg-ink px-2.5 py-0.5 font-mono text-xs font-bold text-white shadow-xs">
              v{activeVersion}
            </span>
          </div>
          <p className="text-xs text-ink-soft">
            Manage sectors, domains, skills, seniorities, visas, and engagement models live across candidate registration and onboarding without code redeployments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsHistorySheetOpen(true)}
            className="rounded-xl border border-[#bcd6fa] bg-white px-3.5 py-2.5 font-display text-xs font-semibold text-ink-soft hover:bg-canvas transition-colors cursor-pointer"
          >
            History &amp; Rollback
          </button>
          <button
            type="button"
            onClick={openCreateSheet}
            className="rounded-xl border border-electric bg-electric/10 px-3.5 py-2.5 font-display text-xs font-semibold text-electric hover:bg-electric hover:text-white transition-all cursor-pointer"
          >
            + Add Choice
          </button>
          <button
            type="button"
            disabled={isPending || !hasUnsavedChanges}
            onClick={handlePublishMatrix}
            className={`rounded-xl px-4 py-2.5 font-display text-xs font-bold shadow-xs transition-all cursor-pointer ${
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
            className="rounded-xl bg-amber-700 px-3.5 py-1.5 font-display text-xs font-bold text-white hover:bg-amber-800 transition-colors cursor-pointer shadow-xs"
          >
            Publish Now (v{activeVersion + 1})
          </button>
        </div>
      )}

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#bcd6fa]/50 pb-3">
        {[
          { id: "skills", label: "Skills & Specialties", count: tabCounts.skills },
          { id: "domains", label: "Domains & Specialist Tracks", count: tabCounts.domains },
          { id: "seniorities", label: "Seniority Levels", count: tabCounts.seniorities },
          { id: "sectors", label: "Sectors", count: tabCounts.sectors },
          { id: "workAuths", label: "Work Authorizations", count: tabCounts.workAuths },
          { id: "engagements", label: "Engagement Models", count: tabCounts.engagements },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              setActiveTab(tab.id as TaxonomyTab);
              setSearchQuery("");
            }}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 font-display text-xs font-semibold transition-all cursor-pointer ${
              activeTab === tab.id
                ? "bg-ink text-white shadow-xs"
                : "bg-white border border-[#bcd6fa] text-ink-soft hover:bg-canvas hover:text-ink"
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`rounded-full px-2 py-0.2 font-mono text-[10px] ${
                activeTab === tab.id ? "bg-white/20 text-white" : "bg-canvas text-mist"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-[#bcd6fa] bg-white p-3 shadow-xs">
        <div className="flex items-center gap-2">
          {["skills", "domains", "seniorities", "sectors"].includes(activeTab) && (
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
                  className={`rounded-lg px-2.5 py-1 font-mono text-[11px] font-semibold transition-all cursor-pointer ${
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
              className="w-56 sm:w-64 rounded-xl border border-[#bcd6fa] bg-canvas/40 pl-8 pr-3 py-1.5 font-mono text-xs text-ink placeholder:text-mist focus:border-electric focus:bg-white focus:outline-hidden"
            />
          </div>
          <span className="font-mono text-[11px] text-mist pr-2 hidden sm:inline">
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
            <div className="font-display text-sm font-bold text-ink">No Choices Found</div>
            <p className="text-xs text-mist mt-1">
              Try adjusting your search query or add a new choice item using the button above.
            </p>
          </div>
        ) : (
          currentItems.map((item) => (
            <div
              key={item.id}
              onClick={() => openEditSheet(item)}
              className="group relative rounded-2xl border border-[#bcd6fa] bg-white p-5 shadow-xs hover:border-electric hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="font-mono text-[10px] font-bold text-electric bg-electric/10 px-2 py-0.5 rounded-md">
                    {item.id}
                  </span>
                  {"sectorId" in item && (
                    <span
                      className={`font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                        item.sectorId === "technology"
                          ? "bg-blue-50 text-blue-700"
                          : "bg-emerald-50 text-emerald-700"
                      }`}
                    >
                      {item.sectorId}
                    </span>
                  )}
                  {"code" in item && (
                    <span className="font-mono text-[10px] uppercase font-bold bg-ink/10 text-ink px-2 py-0.5 rounded-full">
                      {item.code}
                    </span>
                  )}
                  {"region" in item && (
                    <span className="font-mono text-[10px] uppercase font-bold bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full">
                      {item.region}
                    </span>
                  )}
                </div>

                <h3 className="font-display text-sm font-bold text-ink mt-2 group-hover:text-electric transition-colors">
                  {item.label}
                </h3>

                {item.headline && (
                  <p className="text-[11px] font-semibold text-ink-soft mt-0.5 line-clamp-1">
                    {item.headline}
                  </p>
                )}

                {item.description && (
                  <p className="text-xs text-mist mt-1 line-clamp-2">
                    {item.description}
                  </p>
                )}

                {item.yearsRange && (
                  <div className="mt-2 text-[11px] font-mono text-ink font-semibold">
                    Experience Range: <span className="text-electric">{item.yearsRange}</span>
                  </div>
                )}

                {item.recommendedSkills && item.recommendedSkills.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {item.recommendedSkills.slice(0, 4).map((sk: string) => (
                      <span
                        key={sk}
                        className="rounded-md bg-canvas px-1.5 py-0.5 font-mono text-[9px] text-ink-soft"
                      >
                        {sk}
                      </span>
                    ))}
                    {item.recommendedSkills.length > 4 && (
                      <span className="text-[9px] text-mist font-mono self-center">
                        +{item.recommendedSkills.length - 4} more
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 mt-3 border-t border-[#bcd6fa]/40">
                <span className="text-[11px] font-mono text-mist group-hover:text-electric transition-colors">
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
            className="w-full max-w-lg bg-white h-full shadow-2xl p-6 sm:p-8 flex flex-col justify-between overflow-y-auto thin-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-6">
              {/* Sheet Header */}
              <div className="flex items-start justify-between border-b border-[#bcd6fa]/40 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-electric uppercase">
                      {activeTab}
                    </span>
                    <span className="rounded-full bg-signal/15 px-2.5 py-0.5 font-mono text-[10px] font-bold text-signal">
                      {isCreateMode ? "New Choice Item" : "Editing Item"}
                    </span>
                  </div>
                  <h2 className="font-display text-xl font-bold text-ink mt-1.5">
                    {isCreateMode ? `Add ${activeTab.slice(0, -1)} Choice` : `Edit ${formLabel}`}
                  </h2>
                  <p className="text-xs text-ink-soft">
                    Changes take effect immediately across registration and onboarding once the matrix is published.
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
              <form id="taxonomy-item-form" onSubmit={handleSaveItem} className="space-y-4 text-xs">
                {/* ID */}
                <div className="space-y-1">
                  <label className="font-mono text-[11px] font-semibold text-ink block">
                    Unique Choice ID * {isCreateMode ? "(Immutable once referenced)" : "(Read-Only)"}
                  </label>
                  <input
                    type="text"
                    required
                    disabled={!isCreateMode}
                    value={formId}
                    onChange={(e) => setFormId(e.target.value)}
                    placeholder="e.g. sk-langchain or dom-tech-ai"
                    className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/30 px-3 py-2 font-mono text-xs text-ink focus:border-electric focus:bg-white focus:outline-hidden disabled:opacity-60"
                  />
                </div>

                {/* Label */}
                <div className="space-y-1">
                  <label className="font-mono text-[11px] font-semibold text-ink block">
                    Display Label *
                  </label>
                  <input
                    type="text"
                    required
                    value={formLabel}
                    onChange={(e) => setFormLabel(e.target.value)}
                    placeholder="e.g. Distributed Systems & MLOps"
                    className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 text-xs text-ink focus:border-electric focus:outline-hidden"
                  />
                </div>

                {/* Sector Scope (for Sectors, Domains, Skills, Seniorities) */}
                {["sectors", "domains", "skills", "seniorities"].includes(activeTab) && (
                  <div className="space-y-1">
                    <label className="font-mono text-[11px] font-semibold text-ink block">
                      Sector Track
                    </label>
                    <select
                      value={formSectorId}
                      onChange={(e) => setFormSectorId(e.target.value as any)}
                      className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 text-xs font-semibold text-ink focus:border-electric focus:outline-hidden"
                    >
                      <option value="technology">Technology &amp; Software Engineering</option>
                      <option value="healthcare">Healthcare &amp; Clinical Specialists</option>
                    </select>
                  </div>
                )}

                {/* Description */}
                <div className="space-y-1">
                  <label className="font-mono text-[11px] font-semibold text-ink block">
                    Description &amp; Onboarding Guidance
                  </label>
                  <textarea
                    rows={3}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Explain what qualifies a specialist for this choice..."
                    className="w-full rounded-xl border border-[#bcd6fa] bg-white p-2.5 text-xs text-ink focus:border-electric focus:outline-hidden"
                  />
                </div>

                {/* Tab Specific: Sectors */}
                {activeTab === "sectors" && (
                  <>
                    <div className="space-y-1">
                      <label className="font-mono text-[11px] font-semibold text-ink block">
                        Headline Subtitle
                      </label>
                      <input
                        type="text"
                        value={formHeadline}
                        onChange={(e) => setFormHeadline(e.target.value)}
                        placeholder="e.g. Full-Stack, Cloud Architecture &amp; MLOps"
                        className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 text-xs text-ink focus:border-electric focus:outline-hidden"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-mono text-[11px] font-semibold text-ink block">
                        Badge Pill
                      </label>
                      <input
                        type="text"
                        value={formBadge}
                        onChange={(e) => setFormBadge(e.target.value)}
                        placeholder="e.g. Enterprise Roles"
                        className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 text-xs text-ink focus:border-electric focus:outline-hidden"
                      />
                    </div>
                  </>
                )}

                {/* Tab Specific: Domains */}
                {activeTab === "domains" && (
                  <div className="space-y-1">
                    <label className="font-mono text-[11px] font-semibold text-ink block">
                      Recommended Skill IDs (Comma-Separated)
                    </label>
                    <input
                      type="text"
                      value={formRecommendedSkills}
                      onChange={(e) => setFormRecommendedSkills(e.target.value)}
                      placeholder="e.g. sk-react, sk-nextjs, sk-typescript"
                      className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 font-mono text-xs text-ink focus:border-electric focus:outline-hidden"
                    />
                    <span className="text-[10px] text-mist block">
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
                    <label htmlFor="skill-popular" className="font-mono text-xs font-semibold text-ink cursor-pointer">
                      Mark as Popular / Quick-Pick Skill
                    </label>
                  </div>
                )}

                {/* Tab Specific: Seniorities */}
                {activeTab === "seniorities" && (
                  <>
                    <div className="space-y-1">
                      <label className="font-mono text-[11px] font-semibold text-ink block">
                        Years Experience Range
                      </label>
                      <input
                        type="text"
                        value={formYearsRange}
                        onChange={(e) => setFormYearsRange(e.target.value)}
                        placeholder="e.g. 5 to 8 Years"
                        className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 text-xs text-ink focus:border-electric focus:outline-hidden"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-mono text-[11px] font-semibold text-ink block">
                        Canonical Level
                      </label>
                      <select
                        value={formCanonicalLevel}
                        onChange={(e) => setFormCanonicalLevel(e.target.value)}
                        className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 text-xs font-semibold text-ink focus:border-electric focus:outline-hidden"
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
                      <label className="font-mono text-[11px] font-semibold text-ink block">
                        Canonical Auth Key
                      </label>
                      <select
                        value={formCanonicalAuth}
                        onChange={(e) => setFormCanonicalAuth(e.target.value)}
                        className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 text-xs font-semibold text-ink focus:border-electric focus:outline-hidden"
                      >
                        <option value="us_citizen">US Citizen</option>
                        <option value="green_card">Green Card</option>
                        <option value="h1b">H-1B</option>
                        <option value="opt">OPT / STEM</option>
                        <option value="international_remote">International Remote</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="font-mono text-[11px] font-semibold text-ink block">
                        Jurisdiction / Region
                      </label>
                      <select
                        value={formRegion}
                        onChange={(e) => setFormRegion(e.target.value)}
                        className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 text-xs font-semibold text-ink focus:border-electric focus:outline-hidden"
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
                      <label className="font-mono text-[11px] font-semibold text-ink block">
                        Canonical Engagement Type
                      </label>
                      <select
                        value={formCanonicalEngagement}
                        onChange={(e) => setFormCanonicalEngagement(e.target.value)}
                        className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 text-xs font-semibold text-ink focus:border-electric focus:outline-hidden"
                      >
                        <option value="w2">W2 Contract</option>
                        <option value="c2c">Corp-to-Corp (C2C)</option>
                        <option value="1099">1099 Independent</option>
                        <option value="direct_hire">Direct Hire FTE</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="font-mono text-[11px] font-semibold text-ink block">
                        Badge Label
                      </label>
                      <input
                        type="text"
                        value={formBadge}
                        onChange={(e) => setFormBadge(e.target.value)}
                        placeholder="e.g. US Payroll"
                        className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 text-xs text-ink focus:border-electric focus:outline-hidden"
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
                className="rounded-xl px-4 py-2.5 font-display text-xs font-semibold text-ink-soft hover:bg-canvas cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="taxonomy-item-form"
                className="rounded-xl bg-electric px-5 py-2.5 font-display text-xs font-bold text-white hover:bg-electric-bright transition-all cursor-pointer shadow-xs"
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
            className="w-full max-w-md bg-white h-full shadow-2xl p-6 sm:p-8 flex flex-col justify-between overflow-y-auto thin-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-6">
              <div className="flex items-start justify-between border-b border-[#bcd6fa]/40 pb-4">
                <div>
                  <h2 className="font-display text-xl font-bold text-ink">Taxonomy Version History</h2>
                  <p className="text-xs text-ink-soft">
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
                  <p className="text-xs text-mist italic">
                    Currently operating on Version {activeVersion}. No previous versions recorded.
                  </p>
                ) : (
                  initialHistory.map((h) => (
                    <div
                      key={h.version}
                      className={`rounded-2xl border p-4 text-xs space-y-2 ${
                        h.is_active
                          ? "border-signal bg-signal/5"
                          : "border-[#bcd6fa]/60 bg-canvas/30"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-ink">v{h.version}</span>
                          {h.is_active && (
                            <span className="rounded-full bg-signal/15 px-2 py-0.2 font-mono text-[9px] font-bold text-signal">
                              Active
                            </span>
                          )}
                        </div>
                        <span className="font-mono text-[10px] text-mist">{h.created_at?.split("T")[0]}</span>
                      </div>

                      <p className="text-[11px] text-ink-soft">
                        Published by <span className="font-semibold text-ink">{h.author}</span>
                      </p>

                      {h.notes && <p className="text-[10px] text-mist italic">{h.notes}</p>}

                      {!h.is_active && (
                        <button
                          type="button"
                          disabled={isPending}
                          onClick={() => handleRollback(h.version)}
                          className="w-full rounded-xl border border-electric/40 bg-white py-1.5 font-display text-[11px] font-bold text-electric hover:bg-electric hover:text-white transition-all cursor-pointer mt-1"
                        >
                          Rollback to Version {h.version}
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="pt-6 border-t border-[#bcd6fa]/40 flex justify-end">
              <button
                type="button"
                onClick={() => setIsHistorySheetOpen(false)}
                className="rounded-xl px-4 py-2 font-display text-xs font-semibold text-ink-soft hover:bg-canvas cursor-pointer"
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
