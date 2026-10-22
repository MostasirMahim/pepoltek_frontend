"use client";

import React, { useState, useTransition, useCallback, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  Clock,
  Save,
  Upload,
  Plus,
  Trash2,
  Edit2,
  X,
  Search,
  Layout,
  Layers,
  Zap,
  Cpu,
  Globe,
  Users,
  Stethoscope,
  Award,
  ShieldCheck,
  BarChart2,
  Database,
  CheckCircle,
  ArrowRight,
  Monitor,
} from "@/components/ui/Icons";
import {
  publishContentBlockAction,
  saveDraftContentBlockAction,
  type ContentBlockDetail,
  type ContentVersion,
} from "@/actions/content.actions";
import { renderDynamicIcon } from "@/components/ui/DynamicIcon";

// Available icons for services / solutions
const AVAILABLE_ICONS = [
  { name: "Zap", label: "Lightning (Speed/Bandwidth)", icon: <Zap size={18} /> },
  { name: "Cpu", label: "CPU / Architecture", icon: <Cpu size={18} /> },
  { name: "Globe", label: "Globe (Global/EOR)", icon: <Globe size={18} /> },
  { name: "Users", label: "Team / Direct Hire", icon: <Users size={18} /> },
  { name: "Stethoscope", label: "Clinical / Medical", icon: <Stethoscope size={18} /> },
  { name: "Award", label: "Award / Academy", icon: <Award size={18} /> },
  { name: "ShieldCheck", label: "Shield (Security/HIPAA)", icon: <ShieldCheck size={18} /> },
  { name: "BarChart2", label: "Analytics / Metrics", icon: <BarChart2 size={18} /> },
  { name: "Database", label: "Data / EMR", icon: <Database size={18} /> },
  { name: "Layers", label: "Layers / Squads", icon: <Layers size={18} /> },
];

export { renderDynamicIcon };

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PageHeaderData {
  eyebrow: string;
  title: string;
  highlightedText: string;
  description: string;
  stats: Array<{ value: string; label: string }>;
  specs: string[];
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
}

export interface ServiceItemData {
  id: string;
  title: string;
  badge: string;
  iconName?: string;
  desc: string;
  guarantee: string;
  features: string[];
}

export interface CaseStudyItemData {
  slug: string;
  title: string;
  category?: string;
  sector?: string;
  sectorLabel?: string;
  client?: string;
  timeline?: string;
  summary: string;
  challenge: string;
  solution: string;
  techStack?: string[];
  metrics?: Array<{ label: string; value: string }>;
}

export interface CollectionBlockData {
  header: PageHeaderData;
  services?: ServiceItemData[];
  studies?: CaseStudyItemData[];
}

interface AdminCollectionEditorProps {
  contentKey: string;
  keyLabel: string;
  blockDetail: ContentBlockDetail;
  history: ContentVersion[];
}

export function AdminCollectionEditor({
  contentKey,
  keyLabel,
  blockDetail,
  history,
}: AdminCollectionEditorProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Active view tab: "header" or "items"
  const [activeTab, setActiveTab] = useState<"header" | "items">("items");

  // Search filter for collection items
  const [searchQuery, setSearchQuery] = useState("");

  // Slide-over Sheet states for editing or creating an item
  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);
  const [isCreatingNewItem, setIsCreatingNewItem] = useState(false);
  const [editingServiceDraft, setEditingServiceDraft] = useState<ServiceItemData | null>(null);
  const [editingStudyDraft, setEditingStudyDraft] = useState<CaseStudyItemData | null>(null);

  // New feature / metric / tech stack temporary input in slide-over sheet
  const [newFeatureText, setNewFeatureText] = useState("");
  const [newTechText, setNewTechText] = useState("");
  const [newMetricLabel, setNewMetricLabel] = useState("");
  const [newMetricValue, setNewMetricValue] = useState("");

  // Toast
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  // Notes
  const [notes, setNotes] = useState("");

  // Determine if editing services or case studies
  const isCaseStudies = contentKey === "case_studies";

  // Initialize data with fallbacks
  const rawData = (blockDetail.latest?.data ?? blockDetail.published?.data ?? {}) as Partial<CollectionBlockData>;

  const defaultHeader: PageHeaderData = {
    eyebrow:
      contentKey === "services_list"
        ? "Commercial Solutions Suite"
        : contentKey === "healthcare_page"
        ? "Regulated Clinical & Med-Tech Practice"
        : "Verified Production Deployments",
    title:
      contentKey === "services_list"
        ? "Workforce Solutions Tailored"
        : contentKey === "healthcare_page"
        ? "Healthcare Workforce &"
        : "Technical Case Studies &",
    highlightedText:
      contentKey === "services_list"
        ? "for Speed and Precision"
        : contentKey === "healthcare_page"
        ? "Compliance Ready"
        : "Architecture Blueprints",
    description:
      contentKey === "services_list"
        ? "From flexible contractor bandwidth to fully autonomous engineering squads and clinical rotas, Pepoltek provides transparent commercial models backed by performance guarantees."
        : contentKey === "healthcare_page"
        ? "Pre-vetted clinical medical staffing, non-clinical healthcare administration, and health-tech interoperability engineering governed by 100% HIPAA compliance frameworks."
        : "Inspect microservices blueprints, data schemas, and hard-coded audit benchmarks across enterprise FinTech, Health-Tech, and BioTech deployments.",
    stats: [
      { value: "2 to 7 Days", label: "Sprint Shortlist Velocity" },
      { value: "2 Weeks", label: "Risk-Free Trial Period" },
      { value: "15+ Countries", label: "Global EOR & Payroll Hubs" },
    ],
    specs: [
      "W2 & C2C Compliant",
      "4 to 8 Hrs Live Overlap",
      "90-Day Placement Guarantee",
      "HIPAA Title II Certified",
    ],
    primaryCta: { label: "Request Workforce Quote", href: "/contact" },
    secondaryCta: { label: "Launch Velocity Calculator", href: "#calculator-section" },
  };

  const [header, setHeader] = useState<PageHeaderData>({
    ...defaultHeader,
    ...(rawData.header ?? {}),
  });

  const [services, setServices] = useState<ServiceItemData[]>(
    rawData.services ?? [
      {
        id: "staff-augmentation",
        title: "IT Staff Augmentation",
        badge: "Elastic Bandwidth",
        iconName: "Zap",
        desc: "Seamlessly embed senior software engineers into your sprint cycles. Billed hourly or monthly with complete flexibility.",
        guarantee: "2-week risk-free trial + 10% rate discount on 6-month squad commitments.",
        features: [
          "W2 Contract and Corp-to-Corp (C2C) compliant structures",
          "Overlapping workdays (4 to 8 hours live synchronous collaboration)",
          "Senior developers across Frontend, Backend, Cloud, and AI",
          "Immediate deployment in 2 to 7 business days",
        ],
      },
    ]
  );

  const [studies, setStudies] = useState<CaseStudyItemData[]>(
    rawData.studies ?? [
      {
        slug: "fintech-cloud-platform-acceleration",
        title: "Scaling Cloud Platform Engineering for Tier-1 FinTech",
        category: "Enterprise Web Apps",
        sector: "tech",
        sectorLabel: "Technology and Cloud",
        client: "Global NeoBank Enterprise",
        timeline: "3 Months",
        summary: "Reduced time-to-hire from 48 days to 11 days while placing 14 high-throughput Python and Kubernetes engineers.",
        challenge: "The client faced severe sprint bottlenecks launching cross-border payment rails.",
        solution: "Pepoltek deployed our AI semantic matching pipeline combined with peer-level architectural vetting.",
        techStack: ["Next.js", "Python / Django", "PostgreSQL", "Redis"],
        metrics: [
          { label: "Time to Hire", value: "11 Days" },
          { label: "Retention Rate", value: "100%" },
        ],
      },
    ]
  );

  // Close slide-over sheet on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (editingServiceDraft) setEditingServiceDraft(null);
        if (editingStudyDraft) setEditingStudyDraft(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [editingServiceDraft, editingStudyDraft]);

  // Save changes as draft
  const handleSaveDraft = () => {
    startTransition(async () => {
      const payload: CollectionBlockData = {
        header,
        ...(isCaseStudies ? { studies } : { services }),
      };
      const res = await saveDraftContentBlockAction(
        contentKey,
        payload as unknown as Record<string, unknown>,
        notes || `Saved draft of ${keyLabel}`
      );
      if (res.success) {
        showToast("success", `Draft saved as v${res.version}.`);
        router.refresh();
      } else {
        showToast("error", res.error ?? "Failed to save draft.");
      }
    });
  };

  // Publish changes live to web
  const handlePublish = () => {
    startTransition(async () => {
      const payload: CollectionBlockData = {
        header,
        ...(isCaseStudies ? { studies } : { services }),
      };
      const res = await publishContentBlockAction(
        contentKey,
        payload as unknown as Record<string, unknown>,
        notes || `Published updated ${keyLabel} live to web`
      );
      if (res.success) {
        showToast("success", `${keyLabel} published as v${res.version}. All changes are live!`);
        router.refresh();
      } else {
        showToast("error", res.error ?? "Failed to publish.");
      }
    });
  };

  // Open right-side sheet for editing service
  const openEditService = (service: ServiceItemData, index: number) => {
    setEditingItemIndex(index);
    setIsCreatingNewItem(false);
    setEditingServiceDraft({ ...service, features: [...service.features] });
  };

  // Open right-side sheet for creating new service
  const openNewService = () => {
    setIsCreatingNewItem(true);
    setEditingItemIndex(null);
    setEditingServiceDraft({
      id: `service-${Date.now()}`,
      title: "New Service Offering",
      badge: "Commercial Model",
      iconName: "Zap",
      desc: "Provide a concise description of this workforce or technical delivery service.",
      guarantee: "100% satisfaction guarantee or risk-free trial period.",
      features: [
        "Guaranteed daily operational overlap",
        "Pre-screened domain specialists",
      ],
    });
  };

  // Save service item from slide-over sheet
  const saveServiceModal = () => {
    if (!editingServiceDraft) return;
    if (isCreatingNewItem) {
      setServices((prev) => [...prev, editingServiceDraft]);
      showToast("success", "Added new service to list.");
    } else if (editingItemIndex !== null) {
      setServices((prev) => {
        const copy = [...prev];
        copy[editingItemIndex] = editingServiceDraft;
        return copy;
      });
      showToast("success", "Updated service details.");
    }
    setEditingServiceDraft(null);
    setEditingItemIndex(null);
    setIsCreatingNewItem(false);
  };

  // Delete service item
  const deleteService = (index: number) => {
    if (confirm("Are you sure you want to delete this service?")) {
      setServices((prev) => prev.filter((_, i) => i !== index));
      showToast("success", "Service deleted from list.");
    }
  };

  // Open right-side sheet for editing case study
  const openEditStudy = (study: CaseStudyItemData, index: number) => {
    setEditingItemIndex(index);
    setIsCreatingNewItem(false);
    setEditingStudyDraft({
      ...study,
      techStack: study.techStack ? [...study.techStack] : [],
      metrics: study.metrics ? [...study.metrics] : [],
    });
  };

  // Open right-side sheet for creating new case study
  const openNewStudy = () => {
    setIsCreatingNewItem(true);
    setEditingItemIndex(null);
    setEditingStudyDraft({
      slug: `case-study-${Date.now()}`,
      title: "New Enterprise Case Study",
      category: "Enterprise Web Apps",
      sector: "tech",
      sectorLabel: "Technology & Cloud",
      client: "Enterprise Client",
      timeline: "6 Weeks",
      summary: "Executive summary of the technical outcome achieved.",
      challenge: "The technical bottleneck or regulatory hurdle faced by the client.",
      solution: "How Pepoltek deployed specialized squads and AI matching to solve it.",
      techStack: ["Next.js 15", "Python / Django", "PostgreSQL"],
      metrics: [{ label: "Turnaround Time", value: "7 Days" }],
    });
  };

  // Save case study item from slide-over sheet
  const saveStudyModal = () => {
    if (!editingStudyDraft) return;
    if (isCreatingNewItem) {
      setStudies((prev) => [...prev, editingStudyDraft]);
      showToast("success", "Added new case study.");
    } else if (editingItemIndex !== null) {
      setStudies((prev) => {
        const copy = [...prev];
        copy[editingItemIndex] = editingStudyDraft;
        return copy;
      });
      showToast("success", "Updated case study details.");
    }
    setEditingStudyDraft(null);
    setEditingItemIndex(null);
    setIsCreatingNewItem(false);
  };

  // Delete case study
  const deleteStudy = (index: number) => {
    if (confirm("Are you sure you want to delete this case study?")) {
      setStudies((prev) => prev.filter((_, i) => i !== index));
      showToast("success", "Case study deleted.");
    }
  };

  // Filtered lists
  const filteredServices = services.filter(
    (s) =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.badge.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredStudies = studies.filter(
    (s) =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.client?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full w-full overflow-hidden bg-[#070b16] text-slate-100 font-sans">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 flex items-center gap-2.5 rounded-2xl border px-5 py-3.5 shadow-2xl text-sm font-semibold transition-all ${
            toast.type === "success"
              ? "border-emerald-500/40 bg-emerald-950/90 text-emerald-300"
              : "border-rose-500/40 bg-rose-950/90 text-rose-300"
          }`}
        >
          {toast.type === "success" ? <Check size={16} /> : null}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Command Bar: Responsive & Compact */}
      <header className="flex flex-wrap items-center justify-between px-4 sm:px-6 py-2.5 border-b border-slate-800 bg-[#0c1326] shrink-0 z-30 gap-3">
        {/* Left Side: Back & Title */}
        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href="/admin/content"
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors shrink-0"
          >
            <ArrowLeft size={14} />
            <span className="hidden sm:inline">Content Hub</span>
          </Link>
          <div className="h-4 w-px bg-slate-800 shrink-0" />
          <div className="flex items-center gap-2 shrink-0">
            <h1 className="font-display text-xs sm:text-sm font-bold text-white whitespace-nowrap">
              {keyLabel}
            </h1>
            {blockDetail.published ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-400 shrink-0">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                v{blockDetail.published.version} LIVE
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-[10px] font-mono font-bold text-amber-400 shrink-0">
                <Clock size={10} />
                DRAFT
              </span>
            )}
          </div>
        </div>

        {/* Center: Tabs Switcher */}
        <div className="flex items-center rounded-xl border border-slate-800 bg-[#070c18] p-1 text-xs shrink-0 order-last md:order-none">
          <button
            type="button"
            onClick={() => setActiveTab("header")}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 sm:px-3 py-1 font-semibold transition-all cursor-pointer ${
              activeTab === "header"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-xs"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Layout size={13} />
            <span>Page Header & Hero</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("items")}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 sm:px-3 py-1 font-semibold transition-all cursor-pointer ${
              activeTab === "items"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-xs"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Layers size={13} />
            <span>
              {isCaseStudies ? "Case Studies" : "Services"} (
              {isCaseStudies ? studies.length : services.length})
            </span>
          </button>
        </div>

        {/* Right Side: Actions */}
        <div className="flex items-center gap-2 shrink-0 ml-auto md:ml-0">
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={isPending}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 disabled:opacity-50 transition-colors cursor-pointer shrink-0"
          >
            <Save size={13} />
            <span>Save Draft</span>
          </button>

          <button
            type="button"
            onClick={handlePublish}
            disabled={isPending}
            className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-3 sm:px-3.5 py-1.5 text-xs font-bold text-white shadow-sm shadow-cyan-500/20 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 transition-all cursor-pointer shrink-0"
          >
            <Upload size={13} />
            <span>{isPending ? "Publishing..." : "Publish Live"}</span>
          </button>
        </div>
      </header>

      {/* Main Tab Content */}
      <div className="flex-1 min-h-0 overflow-hidden">
        {/* =================================================================== */}
        {/* TAB 1: PAGE HEADER & HERO SECTION CONFIGURATION                    */}
        {/* =================================================================== */}
        {activeTab === "header" && (
          <div className="h-full grid grid-cols-1 lg:grid-cols-12 min-h-0 overflow-hidden divide-y lg:divide-y-0 lg:divide-x divide-slate-800/80">
            {/* Left: Input Form Controls - SCROLLS INDEPENDENTLY */}
            <div className="lg:col-span-5 h-full overflow-y-auto thin-scrollbar p-5 sm:p-6 space-y-5 bg-[#090f22]">
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-sm font-bold text-white flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs">
                      1
                    </span>
                    Page Hero Typography
                  </h2>
                  <span className="text-[11px] font-mono text-cyan-400">Section Header</span>
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  Configure the primary title, accented headline, and value proposition displayed at the top of the public page.
                </p>
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Eyebrow Badge Tag
                </label>
                <input
                  type="text"
                  value={header.eyebrow}
                  onChange={(e) => setHeader((prev) => ({ ...prev, eyebrow: e.target.value }))}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                  placeholder="e.g. Commercial Solutions Suite"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Main Headline
                  </label>
                  <input
                    type="text"
                    value={header.title}
                    onChange={(e) => setHeader((prev) => ({ ...prev, title: e.target.value }))}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                    placeholder="e.g. Workforce Solutions Tailored"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Highlighted Accent Text
                  </label>
                  <input
                    type="text"
                    value={header.highlightedText}
                    onChange={(e) => setHeader((prev) => ({ ...prev, highlightedText: e.target.value }))}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-3.5 py-2 text-xs text-cyan-300 placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                    placeholder="e.g. for Speed and Precision"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Hero Subtitle Description
                </label>
                <textarea
                  rows={3}
                  value={header.description}
                  onChange={(e) => setHeader((prev) => ({ ...prev, description: e.target.value }))}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none leading-relaxed"
                  placeholder="Provide high-impact introductory copy."
                />
              </div>

              {/* Stats Counters Manager */}
              <div className="pt-4 border-t border-slate-800/80 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider">
                    Hero Stats Cards ({header.stats.length})
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setHeader((prev) => ({
                        ...prev,
                        stats: [...prev.stats, { value: "100%", label: "New Metric" }],
                      }))
                    }
                    className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800/70 px-2 py-1 text-[11px] text-cyan-300 hover:text-white cursor-pointer"
                  >
                    <Plus size={11} />
                    <span>Add Stat</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {header.stats.map((stat, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={stat.value}
                        onChange={(e) => {
                          const val = e.target.value;
                          setHeader((prev) => {
                            const copy = [...prev.stats];
                            copy[idx] = { ...copy[idx], value: val };
                            return { ...prev, stats: copy };
                          });
                        }}
                        placeholder="Value (e.g. 2 to 7 Days)"
                        className="w-1/3 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white font-bold"
                      />
                      <input
                        type="text"
                        value={stat.label}
                        onChange={(e) => {
                          const lbl = e.target.value;
                          setHeader((prev) => {
                            const copy = [...prev.stats];
                            copy[idx] = { ...copy[idx], label: lbl };
                            return { ...prev, stats: copy };
                          });
                        }}
                        placeholder="Label (e.g. Sprint Velocity)"
                        className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setHeader((prev) => ({
                            ...prev,
                            stats: prev.stats.filter((_, i) => i !== idx),
                          }))
                        }
                        className="p-1.5 text-slate-500 hover:text-rose-400 cursor-pointer"
                        title="Delete Stat"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Verified Specs Pills */}
              <div className="pt-4 border-t border-slate-800/80 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider">
                    Verified Spec Pills ({header.specs.length})
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setHeader((prev) => ({
                        ...prev,
                        specs: [...prev.specs, "New Spec Pill"],
                      }))
                    }
                    className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800/70 px-2 py-1 text-[11px] text-cyan-300 hover:text-white cursor-pointer"
                  >
                    <Plus size={11} />
                    <span>Add Spec Pill</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {header.specs.map((spec, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-cyan-400 shrink-0" />
                      <input
                        type="text"
                        value={spec}
                        onChange={(e) => {
                          const val = e.target.value;
                          setHeader((prev) => {
                            const copy = [...prev.specs];
                            copy[idx] = val;
                            return { ...prev, specs: copy };
                          });
                        }}
                        className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white font-medium"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setHeader((prev) => ({
                            ...prev,
                            specs: prev.specs.filter((_, i) => i !== idx),
                          }))
                        }
                        className="p-1.5 text-slate-500 hover:text-rose-400 cursor-pointer"
                        title="Delete Spec"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Real-time Public PageHero Landscape Preview - COMPLETELY STATIC */}
            <div className="lg:col-span-7 h-full flex flex-col p-4 sm:p-6 bg-[#060a16] overflow-hidden select-none">
              {/* Preview Bar */}
              <div className="shrink-0 flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
                <div className="flex items-center gap-2">
                  <Monitor size={14} className="text-cyan-400" />
                  <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                    Live Desktop Landscape Preview
                  </span>
                  <span className="hidden sm:inline-flex rounded-full bg-slate-800 border border-slate-700 px-2 py-0.5 text-[10px] font-mono text-slate-400">
                    1440 × 900
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Synced with Form
                  </span>
                  <Link
                    href={
                      contentKey === "services_list"
                        ? "/services"
                        : contentKey === "healthcare_page"
                        ? "/healthcare"
                        : "/case-studies"
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="hidden md:flex items-center gap-1 text-[11px] font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    <span>Open Live Page</span>
                    <ArrowRight size={11} />
                  </Link>
                </div>
              </div>

              {/* Desktop Landscape Frame (Centered, Static, Aspect-Controlled) */}
              <div className="flex-1 min-h-0 flex items-center justify-center overflow-hidden">
                <div className="w-full max-w-[960px] rounded-2xl border border-slate-700/80 bg-[#0c1428] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col">
                  {/* Simulated Browser Chrome Top Bar */}
                  <div className="shrink-0 flex items-center justify-between px-3.5 py-2 border-b border-slate-800 bg-[#090f20]">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
                      <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                    </div>
                    <div className="flex items-center gap-1.5 rounded-md bg-slate-900/90 border border-slate-800 px-3 py-0.5 text-[10.5px] font-mono text-slate-400">
                      <span className="text-emerald-400">https://</span>
                      <span className="text-slate-300">pepoltek.com</span>
                      <span className="text-cyan-400">
                        {contentKey === "services_list"
                          ? "/services"
                          : contentKey === "healthcare_page"
                          ? "/healthcare"
                          : "/case-studies"}
                      </span>
                    </div>
                    <div className="text-[10px] font-mono text-slate-500 font-bold tracking-wider">
                      LANDSCAPE 16:9
                    </div>
                  </div>

                  {/* Browser Viewport: Authentic PageHero in 12-Column Landscape */}
                  <div className="p-5 sm:p-7 relative bg-gradient-to-b from-[#f0f6fe] to-[#e4eefc] text-ink overflow-hidden select-none">
                    {/* Background grid accent */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#0052cc08_1px,transparent_1px),linear-gradient(to_bottom,#0052cc08_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
                    <div className="pointer-events-none absolute right-[-5%] top-[5%] h-[240px] w-[260px] rounded-full bg-[radial-gradient(circle,rgba(10,132,255,0.12)_0%,rgba(56,189,248,0.05)_50%,transparent_70%)] blur-2xl" />

                    <div className="relative z-10 grid grid-cols-12 gap-5 items-center">
                      {/* Left 7 Columns: Hero Copy & Specs */}
                      <div className="col-span-7 space-y-3 pr-2">
                        {/* Eyebrow badge */}
                        <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-white/90 px-3 py-0.5 text-[10.5px] font-mono font-semibold text-blue-700 tracking-wider shadow-2xs">
                          <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse" />
                          <span>{header.eyebrow}</span>
                        </div>

                        {/* Main Title with Accented word & Pen Curve */}
                        <div className="font-display text-xl sm:text-2xl font-extrabold text-[#0a1428] tracking-tight leading-[1.2]">
                          <span>{header.title}</span>{" "}
                          {header.highlightedText && (
                            <span className="relative inline-block text-blue-600">
                              {header.highlightedText}
                              <svg
                                className="absolute -bottom-1 left-0 w-full text-blue-500/50 overflow-visible"
                                viewBox="0 0 100 12"
                                preserveAspectRatio="none"
                                height="5"
                              >
                                <path d="M0,8 Q50,0 100,8" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
                              </svg>
                            </span>
                          )}
                        </div>

                        {/* Description */}
                        <p className="text-xs text-slate-700 font-normal leading-relaxed line-clamp-3">
                          {header.description}
                        </p>

                        {/* Verified specs */}
                        {header.specs.length > 0 && (
                          <div className="pt-1 flex flex-wrap items-center gap-1.5">
                            <span className="text-[9.5px] font-mono font-bold text-slate-500 uppercase tracking-wider mr-1">
                              VERIFIED:
                            </span>
                            {header.specs.slice(0, 4).map((spec, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1 rounded-md border border-slate-300/80 bg-white/90 px-2 py-0.5 text-[10px] font-mono font-medium text-slate-700 shadow-2xs"
                              >
                                <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                                {spec}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Right 5 Columns: Stats Telemetry Cards */}
                      <div className="col-span-5 flex flex-col gap-2.5">
                        {header.stats.slice(0, 3).map((stat, idx) => (
                          <div
                            key={idx}
                            className="rounded-xl border border-white/90 bg-white/95 p-3 shadow-xs backdrop-blur-xs flex items-center justify-between"
                          >
                            <div>
                              <div className="font-display text-base font-extrabold text-[#0a1428] leading-none">
                                {stat.value}
                              </div>
                              <div className="text-[9.5px] font-mono text-slate-500 uppercase tracking-wide mt-1">
                                {stat.label}
                              </div>
                            </div>
                            <div className="h-7 w-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600">
                              <Zap size={13} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 2: CONTENT COLLECTION GRID & CRUD                              */}
        {/* =================================================================== */}
        {activeTab === "items" && (
          <div className="h-full overflow-y-auto thin-scrollbar p-4 sm:p-6 lg:p-8 space-y-6">
            <div className="max-w-7xl mx-auto space-y-6">
            {/* Header controls: Search & "+ Add New Item" */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-[#0c1428] p-4">
              <div className="flex items-center gap-3">
                <div className="relative w-72">
                  <Search size={14} className="absolute left-3 top-2.5 text-slate-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={
                      isCaseStudies
                        ? "Search case studies by title or client..."
                        : "Search services by title or badge..."
                    }
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 py-1.5 pl-8.5 pr-3 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  Showing {isCaseStudies ? filteredStudies.length : filteredServices.length} items
                </span>
              </div>

              <button
                type="button"
                onClick={isCaseStudies ? openNewStudy : openNewService}
                className="flex items-center gap-1.5 rounded-xl bg-cyan-500/15 border border-cyan-500/30 px-3.5 py-2 text-xs font-bold text-cyan-300 hover:bg-cyan-500/25 transition-colors cursor-pointer"
              >
                <Plus size={14} />
                <span>{isCaseStudies ? "Add New Case Study" : "Add New Service Offering"}</span>
              </button>
            </div>

            {/* SERVICES GRID */}
            {!isCaseStudies && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredServices.map((service, idx) => (
                  <div
                    key={service.id || idx}
                    className="group relative rounded-2xl border border-slate-800 bg-[#0c1428] p-5 hover:border-cyan-500/50 hover:bg-slate-900/80 transition-all shadow-md flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Row: Icon + Badge + Action buttons */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                          {renderDynamicIcon(service.iconName, 20)}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="rounded-full bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 text-[10px] font-mono font-bold text-cyan-400">
                            {service.badge}
                          </span>
                          <button
                            type="button"
                            onClick={() => openEditService(service, idx)}
                            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                            title="Edit Service (Opens Right Sheet)"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteService(idx)}
                            className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
                            title="Delete Service"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>

                      {/* Title & Description */}
                      <h3 className="mt-3.5 font-display text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {service.title}
                      </h3>
                      <p className="mt-1.5 text-xs text-slate-400 line-clamp-3 leading-relaxed">
                        {service.desc}
                      </p>

                      {/* Performance Guarantee */}
                      <div className="mt-3.5 rounded-xl border border-emerald-500/20 bg-emerald-950/30 p-2.5 text-[11px] text-emerald-300">
                        <div className="font-mono text-[9.5px] font-bold uppercase tracking-wider text-emerald-400">
                          Performance Guarantee
                        </div>
                        <div className="mt-0.5 font-medium">{service.guarantee}</div>
                      </div>

                      {/* Features preview */}
                      <div className="mt-3 pt-3 border-t border-slate-800/80">
                        <div className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                          Included Features ({service.features.length})
                        </div>
                        <ul className="space-y-1 text-xs text-slate-300">
                          {service.features.slice(0, 3).map((f, fIdx) => (
                            <li key={fIdx} className="flex items-center gap-1.5 truncate">
                              <CheckCircle size={11} className="text-cyan-400 shrink-0" />
                              <span className="truncate">{f}</span>
                            </li>
                          ))}
                          {service.features.length > 3 && (
                            <li className="text-[10.5px] text-slate-500 pl-4">
                              +{service.features.length - 3} more capabilities
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                      <span className="font-mono text-[10.5px] text-slate-500">
                        ID: {service.id}
                      </span>
                      <button
                        type="button"
                        onClick={() => openEditService(service, idx)}
                        className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <span>Edit in Sheet</span>
                        <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* CASE STUDIES GRID */}
            {isCaseStudies && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredStudies.map((study, idx) => (
                  <div
                    key={study.slug || idx}
                    className="group relative rounded-2xl border border-slate-800 bg-[#0c1428] p-5 hover:border-cyan-500/50 hover:bg-slate-900/80 transition-all shadow-md flex flex-col justify-between"
                  >
                    <div>
                      {/* Top: Sector + Client + Actions */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="rounded-full bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 text-[10px] font-mono font-bold text-cyan-400">
                            {study.sectorLabel || study.sector || "Tech"}
                          </span>
                          {study.timeline && (
                            <span className="rounded-full bg-slate-800 border border-slate-700 px-2 py-0.5 text-[10px] font-mono text-slate-300">
                              {study.timeline}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => openEditStudy(study, idx)}
                            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
                            title="Edit Study (Opens Right Sheet)"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteStudy(idx)}
                            className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 cursor-pointer"
                            title="Delete Study"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>

                      {/* Title & Client */}
                      <h3 className="mt-3 font-display text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {study.title}
                      </h3>
                      {study.client && (
                        <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                          Client: {study.client}
                        </div>
                      )}

                      {/* Summary */}
                      <p className="mt-2 text-xs text-slate-300 line-clamp-3 leading-relaxed">
                        {study.summary}
                      </p>

                      {/* Challenge & Solution Preview */}
                      <div className="mt-3.5 space-y-2 text-xs">
                        <div className="rounded-xl border border-amber-500/20 bg-amber-950/20 p-2 text-amber-200">
                          <span className="font-mono text-[9px] font-bold uppercase text-amber-400 block">
                            Challenge
                          </span>
                          <span className="line-clamp-2 text-[11px]">{study.challenge}</span>
                        </div>
                        <div className="rounded-xl border border-blue-500/20 bg-blue-950/20 p-2 text-blue-200">
                          <span className="font-mono text-[9px] font-bold uppercase text-blue-400 block">
                            Solution
                          </span>
                          <span className="line-clamp-2 text-[11px]">{study.solution}</span>
                        </div>
                      </div>

                      {/* Key Metrics */}
                      {study.metrics && study.metrics.length > 0 && (
                        <div className="mt-3.5 grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80">
                          {study.metrics.map((m, mIdx) => (
                            <div key={mIdx} className="rounded-lg bg-slate-900/80 p-2">
                              <div className="font-display text-xs font-bold text-white">{m.value}</div>
                              <div className="text-[9.5px] font-mono text-slate-400">{m.label}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                      <span className="font-mono text-[10px] text-slate-500 truncate max-w-[150px]">
                        /{study.slug}
                      </span>
                      <button
                        type="button"
                        onClick={() => openEditStudy(study, idx)}
                        className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <span>Edit in Sheet</span>
                        <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
              </div>
            </div>
          )}
        </div>

      {/* ===================================================================== */}
      {/* RIGHT-SIDE SHEET 1: EDIT / CREATE SERVICE OFFERING                    */}
      {/* ===================================================================== */}
      {editingServiceDraft && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Subtle darkened backdrop with click to close */}
          <div
            onClick={() => setEditingServiceDraft(null)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in-0 duration-200"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10 z-50">
            <div className="w-screen max-w-xl md:max-w-2xl bg-[#0c1428] border-l border-slate-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-250 ease-out">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-800 bg-[#0e1730] shrink-0">
                <div>
                  <h3 className="font-display text-base font-bold text-white flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-md bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 text-xs">
                      {isCreatingNewItem ? "+" : <Edit2 size={12} />}
                    </span>
                    <span>{isCreatingNewItem ? "Add New Service Offering" : "Edit Service Offering"}</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Configure title, badge, icon, descriptions, and feature deliverables.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingServiceDraft(null)}
                  className="rounded-xl p-2 text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer"
                  title="Close Sheet (Esc)"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Scrollable Form Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-5 thin-scrollbar">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Service Title
                    </label>
                    <input
                      type="text"
                      value={editingServiceDraft.title}
                      onChange={(e) =>
                        setEditingServiceDraft((prev) => prev && { ...prev, title: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Badge Tag
                    </label>
                    <input
                      type="text"
                      value={editingServiceDraft.badge}
                      onChange={(e) =>
                        setEditingServiceDraft((prev) => prev && { ...prev, badge: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                      placeholder="e.g. Elastic Bandwidth"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Unique ID / Slug
                    </label>
                    <input
                      type="text"
                      value={editingServiceDraft.id}
                      onChange={(e) =>
                        setEditingServiceDraft((prev) => prev && { ...prev, id: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs text-white font-mono focus:border-cyan-500 focus:outline-none"
                    />
                  </div>

                  {/* Icon Selector */}
                  <div>
                    <label className="block text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Select Icon
                    </label>
                    <select
                      value={editingServiceDraft.iconName || "Zap"}
                      onChange={(e) =>
                        setEditingServiceDraft((prev) => prev && { ...prev, iconName: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                    >
                      {AVAILABLE_ICONS.map((ico) => (
                        <option key={ico.name} value={ico.name}>
                          {ico.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Service Description
                  </label>
                  <textarea
                    rows={3}
                    value={editingServiceDraft.desc}
                    onChange={(e) =>
                      setEditingServiceDraft((prev) => prev && { ...prev, desc: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs text-white leading-relaxed focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Performance Guarantee / SLA
                  </label>
                  <input
                    type="text"
                    value={editingServiceDraft.guarantee}
                    onChange={(e) =>
                      setEditingServiceDraft((prev) => prev && { ...prev, guarantee: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs text-emerald-300 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                {/* Feature bullets checklist */}
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <label className="block text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider">
                    Features & Scope Deliverables ({editingServiceDraft.features.length})
                  </label>

                  <div className="space-y-2">
                    {editingServiceDraft.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-2">
                        <span className="text-cyan-400 text-xs">•</span>
                        <input
                          type="text"
                          value={feat}
                          onChange={(e) => {
                            const val = e.target.value;
                            setEditingServiceDraft((prev) => {
                              if (!prev) return null;
                              const copy = [...prev.features];
                              copy[fIdx] = val;
                              return { ...prev, features: copy };
                            });
                          }}
                          className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setEditingServiceDraft((prev) => {
                              if (!prev) return null;
                              return {
                                ...prev,
                                features: prev.features.filter((_, i) => i !== fIdx),
                              };
                            })
                          }
                          className="p-1.5 text-slate-500 hover:text-rose-400 cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add new feature input */}
                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="text"
                      value={newFeatureText}
                      onChange={(e) => setNewFeatureText(e.target.value)}
                      placeholder="Add a new feature bullet..."
                      className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!newFeatureText.trim()) return;
                        setEditingServiceDraft((prev) => {
                          if (!prev) return null;
                          return { ...prev, features: [...prev.features, newFeatureText.trim()] };
                        });
                        setNewFeatureText("");
                      }}
                      className="rounded-xl border border-cyan-500/30 bg-cyan-500/15 px-3 py-1.5 text-xs font-bold text-cyan-300 hover:bg-cyan-500/25 cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Sticky Action Footer */}
              <div className="shrink-0 border-t border-slate-800/90 bg-[#090f20]/95 px-6 py-4 flex items-center justify-between gap-3 backdrop-blur-md">
                <span className="text-[11px] font-mono text-slate-500 hidden sm:inline">
                  Press Esc to dismiss
                </span>
                <div className="flex items-center gap-3 ml-auto">
                  <button
                    type="button"
                    onClick={() => setEditingServiceDraft(null)}
                    className="rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={saveServiceModal}
                    className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2 text-xs font-bold text-white shadow-md shadow-cyan-500/20 hover:from-cyan-400 hover:to-blue-500 transition-all cursor-pointer"
                  >
                    Save Changes to Card
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* RIGHT-SIDE SHEET 2: EDIT / CREATE CASE STUDY                          */}
      {/* ===================================================================== */}
      {editingStudyDraft && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Subtle darkened backdrop with click to close */}
          <div
            onClick={() => setEditingStudyDraft(null)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in-0 duration-200"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10 z-50">
            <div className="w-screen max-w-xl md:max-w-2xl bg-[#0c1428] border-l border-slate-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-250 ease-out">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-800 bg-[#0e1730] shrink-0">
                <div>
                  <h3 className="font-display text-base font-bold text-white flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-md bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 text-xs">
                      {isCreatingNewItem ? "+" : <Edit2 size={12} />}
                    </span>
                    <span>{isCreatingNewItem ? "Add New Case Study" : "Edit Case Study"}</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Configure client, challenge, solution, stack, and benchmarked metrics.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingStudyDraft(null)}
                  className="rounded-xl p-2 text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer"
                  title="Close Sheet (Esc)"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Scrollable Form Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-5 thin-scrollbar">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Case Study Title
                    </label>
                    <input
                      type="text"
                      value={editingStudyDraft.title}
                      onChange={(e) =>
                        setEditingStudyDraft((prev) => prev && { ...prev, title: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider mb-1">
                      URL Slug
                    </label>
                    <input
                      type="text"
                      value={editingStudyDraft.slug}
                      onChange={(e) =>
                        setEditingStudyDraft((prev) => prev && { ...prev, slug: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs text-white font-mono focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Client Name
                    </label>
                    <input
                      type="text"
                      value={editingStudyDraft.client || ""}
                      onChange={(e) =>
                        setEditingStudyDraft((prev) => prev && { ...prev, client: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                      placeholder="e.g. NeoBank"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Sector Label
                    </label>
                    <input
                      type="text"
                      value={editingStudyDraft.sectorLabel || ""}
                      onChange={(e) =>
                        setEditingStudyDraft((prev) => prev && { ...prev, sectorLabel: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                      placeholder="e.g. FinTech & Cloud"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Timeline
                    </label>
                    <input
                      type="text"
                      value={editingStudyDraft.timeline || ""}
                      onChange={(e) =>
                        setEditingStudyDraft((prev) => prev && { ...prev, timeline: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                      placeholder="e.g. 3 Months"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Executive Summary
                  </label>
                  <textarea
                    rows={2}
                    value={editingStudyDraft.summary}
                    onChange={(e) =>
                      setEditingStudyDraft((prev) => prev && { ...prev, summary: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs text-white leading-relaxed focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider mb-1">
                    The Engineering Challenge
                  </label>
                  <textarea
                    rows={3}
                    value={editingStudyDraft.challenge}
                    onChange={(e) =>
                      setEditingStudyDraft((prev) => prev && { ...prev, challenge: e.target.value })
                    }
                    className="w-full rounded-xl border border-amber-500/30 bg-amber-950/20 px-3.5 py-2 text-xs text-amber-200 leading-relaxed focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider mb-1">
                    The Technical Solution
                  </label>
                  <textarea
                    rows={3}
                    value={editingStudyDraft.solution}
                    onChange={(e) =>
                      setEditingStudyDraft((prev) => prev && { ...prev, solution: e.target.value })
                    }
                    className="w-full rounded-xl border border-blue-500/30 bg-blue-950/20 px-3.5 py-2 text-xs text-blue-200 leading-relaxed focus:border-blue-400 focus:outline-none"
                  />
                </div>

                {/* Key Outcome Metrics */}
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <label className="block text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider">
                    Key Outcome Metrics ({(editingStudyDraft.metrics || []).length})
                  </label>

                  <div className="space-y-2">
                    {(editingStudyDraft.metrics || []).map((m, mIdx) => (
                      <div key={mIdx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={m.value}
                          onChange={(e) => {
                            const val = e.target.value;
                            setEditingStudyDraft((prev) => {
                              if (!prev) return null;
                              const copy = [...(prev.metrics || [])];
                              copy[mIdx] = { ...copy[mIdx], value: val };
                              return { ...prev, metrics: copy };
                            });
                          }}
                          className="w-1/3 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white font-bold focus:border-cyan-500 focus:outline-none"
                          placeholder="Value (e.g. 11 Days)"
                        />
                        <input
                          type="text"
                          value={m.label}
                          onChange={(e) => {
                            const lbl = e.target.value;
                            setEditingStudyDraft((prev) => {
                              if (!prev) return null;
                              const copy = [...(prev.metrics || [])];
                              copy[mIdx] = { ...copy[mIdx], label: lbl };
                              return { ...prev, metrics: copy };
                            });
                          }}
                          className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
                          placeholder="Metric Label"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setEditingStudyDraft((prev) => {
                              if (!prev) return null;
                              return {
                                ...prev,
                                metrics: (prev.metrics || []).filter((_, i) => i !== mIdx),
                              };
                            })
                          }
                          className="p-1.5 text-slate-500 hover:text-rose-400 cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      value={newMetricValue}
                      onChange={(e) => setNewMetricValue(e.target.value)}
                      placeholder="New value (e.g. 100%)"
                      className="w-1/3 rounded-xl border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
                    />
                    <input
                      type="text"
                      value={newMetricLabel}
                      onChange={(e) => setNewMetricLabel(e.target.value)}
                      placeholder="New metric label..."
                      className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!newMetricValue.trim()) return;
                        setEditingStudyDraft((prev) => {
                          if (!prev) return null;
                          return {
                            ...prev,
                            metrics: [
                              ...(prev.metrics || []),
                              { value: newMetricValue.trim(), label: newMetricLabel.trim() || "Metric" },
                            ],
                          };
                        });
                        setNewMetricValue("");
                        setNewMetricLabel("");
                      }}
                      className="rounded-xl border border-cyan-500/30 bg-cyan-500/15 px-3 py-1.5 text-xs font-bold text-cyan-300 hover:bg-cyan-500/25 cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Technology Stack Tags Manager */}
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <label className="block text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider">
                    Technology Stack ({(editingStudyDraft.techStack || []).length})
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {(editingStudyDraft.techStack || []).map((tech, tIdx) => (
                      <span
                        key={tIdx}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1 text-xs text-slate-200"
                      >
                        <span>{tech}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setEditingStudyDraft((prev) => {
                              if (!prev) return null;
                              return {
                                ...prev,
                                techStack: (prev.techStack || []).filter((_, i) => i !== tIdx),
                              };
                            })
                          }
                          className="text-slate-500 hover:text-rose-400 ml-1 cursor-pointer"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      value={newTechText}
                      onChange={(e) => setNewTechText(e.target.value)}
                      placeholder="Add tech stack item (e.g. Next.js, Kubernetes)..."
                      className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!newTechText.trim()) return;
                        setEditingStudyDraft((prev) => {
                          if (!prev) return null;
                          return {
                            ...prev,
                            techStack: [...(prev.techStack || []), newTechText.trim()],
                          };
                        });
                        setNewTechText("");
                      }}
                      className="rounded-xl border border-cyan-500/30 bg-cyan-500/15 px-3 py-1.5 text-xs font-bold text-cyan-300 hover:bg-cyan-500/25 cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Sticky Action Footer */}
              <div className="shrink-0 border-t border-slate-800/90 bg-[#090f20]/95 px-6 py-4 flex items-center justify-between gap-3 backdrop-blur-md">
                <span className="text-[11px] font-mono text-slate-500 hidden sm:inline">
                  Press Esc to dismiss
                </span>
                <div className="flex items-center gap-3 ml-auto">
                  <button
                    type="button"
                    onClick={() => setEditingStudyDraft(null)}
                    className="rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={saveStudyModal}
                    className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2 text-xs font-bold text-white shadow-md shadow-cyan-500/20 hover:from-cyan-400 hover:to-blue-500 transition-all cursor-pointer"
                  >
                    Save Changes to Case Study
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
