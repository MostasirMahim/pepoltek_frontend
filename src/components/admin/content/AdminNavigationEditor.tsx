"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Copy,
  Check,
  Search,
  ExternalLink,
  Eye,
  Save,
  Send,
  History,
  Layers,
  Sparkles,
  Link2,
  Compass,
  FileText,
  Badge,
  Globe,
  Briefcase,
  Activity,
  Zap,
  ShieldCheck,
  Users,
  Code,
  DollarSign,
  FileCheck,
  Clock,
  CheckCircle2,
  User,
  Building2,
} from "lucide-react";
import {
  publishContentBlockAction,
  saveDraftContentBlockAction,
  rollbackContentBlockAction,
  ContentBlockDetail,
  ContentVersion,
} from "@/actions/content.actions";

// Available Lucide icons for navigation items
const ICON_OPTIONS = [
  { id: "Code", label: "Code / Engineering", icon: Code },
  { id: "Users", label: "Users / Teams", icon: Users },
  { id: "Globe", label: "Globe / International", icon: Globe },
  { id: "Briefcase", label: "Briefcase / Jobs", icon: Briefcase },
  { id: "Sparkles", label: "Sparkles / Academy", icon: Sparkles },
  { id: "ShieldCheck", label: "Shield / Compliance", icon: ShieldCheck },
  { id: "Activity", label: "Activity / Clinical", icon: Activity },
  { id: "Building2", label: "Building / Corporate", icon: Building2 },
  { id: "Zap", label: "Zap / Velocity", icon: Zap },
  { id: "DollarSign", label: "Dollar / Bounty", icon: DollarSign },
  { id: "FileCheck", label: "File / Resume", icon: FileCheck },
  { id: "Clock", label: "Clock / Timezone", icon: Clock },
  { id: "CheckCircle2", label: "Check / Excellence", icon: CheckCircle2 },
  { id: "Search", label: "Search / Sourcing", icon: Search },
  { id: "User", label: "User / Profile", icon: User },
];

// Static Directory of all built public system pages
export interface PublicPageEntry {
  path: string;
  title: string;
  category: "Marketing" | "Solutions" | "Tools" | "Talent & Careers" | "Portals";
  description: string;
}

export const SYSTEM_PUBLIC_PAGES: PublicPageEntry[] = [
  {
    path: "/",
    title: "Homepage",
    category: "Marketing",
    description: "Enterprise hero, velocity proof, interactive calculator, bento features, compliance and CTA banner.",
  },
  {
    path: "/about",
    title: "About Us",
    category: "Marketing",
    description: "Company overview, in-house delivery engine, 4 longitudes chasing-the-sun matrix, and SOC 2 governance.",
  },
  {
    path: "/contact",
    title: "Contact & Inquiries Gateway",
    category: "Marketing",
    description: "Dual workforce hire fast form, general communications triage, and talent network links.",
  },
  {
    path: "/services",
    title: "Services & Solutions Suite",
    category: "Solutions",
    description: "IT Staff Augmentation, Multi-Seat Engineering Pods, Employer of Record (EOR), and Direct Hire.",
  },
  {
    path: "/healthcare",
    title: "Healthcare & Compliance Practice",
    category: "Solutions",
    description: "Regulated clinical staffing, healthcare operations, EHR/EMR integrations, and HIPAA framework.",
  },
  {
    path: "/case-studies",
    title: "Technical Case Studies",
    category: "Solutions",
    description: "Engineering microservices blueprints, HIPAA audit pipelines, and telemetry benchmarks.",
  },
  {
    path: "/calculator",
    title: "RPO Hiring & Velocity Calculator",
    category: "Tools",
    description: "Interactive cost savings, team velocity, and 7-day deployment model calculator.",
  },
  {
    path: "/jobs",
    title: "Live Requisitions & Gigs Board",
    category: "Talent & Careers",
    description: "Filterable public job board, salary transparency, referral bounties, and 1-click apply drawer.",
  },
  {
    path: "/career",
    title: "Careers Overview & Culture",
    category: "Talent & Careers",
    description: "Remote-first engineering culture, pre-screened standards, and guaranteed client placement rates.",
  },
  {
    path: "/career/upload_cv",
    title: "Instant CV Intake & AI Parse",
    category: "Talent & Careers",
    description: "Automated PDF/DOCX resume ingestion, skills extraction, and profile initialization.",
  },
  {
    path: "/talents/reverse-search",
    title: "Reverse Job Sourcing Search",
    category: "Talent & Careers",
    description: "Zero-exposure reverse recruiting where enterprise employers apply to hire verified candidates.",
  },
  {
    path: "/ecosystem/referrals",
    title: "Referral Bounty Program",
    category: "Talent & Careers",
    description: "Community referral network with transparent cash payouts up to $3,500 per successful hire.",
  },
  {
    path: "/ecosystem/academy",
    title: "Talent Academy Bootcamps",
    category: "Talent & Careers",
    description: "Pre-deployment skill bootcamps, architectural vetting, and candidate readiness scorecards.",
  },
  {
    path: "/login",
    title: "Candidate & Recruiter Login",
    category: "Portals",
    description: "Authentication gateway for candidates, recruiters, and administrative operators.",
  },
  {
    path: "/register",
    title: "Enterprise Candidate Registration",
    category: "Portals",
    description: "Multi-stage intake, CV parsing, skills benchmark selection, and account initialization.",
  },
  {
    path: "/verify",
    title: "Email & OTP Verification",
    category: "Portals",
    description: "Dual-choice verification with in-line email correction and Google OAuth synchronization.",
  },
];

export interface DropdownItemData {
  id: string;
  title: string;
  desc: string;
  href: string;
  badge?: string;
  icon?: string;
  serial: number;
}

export interface NavSectionData {
  id: string;
  label: string;
  href: string;
  eyebrow: string;
  layout: "single" | "dual";
  serial: number;
  items: DropdownItemData[];
  spotlight?: {
    headline: string;
    sub: string;
    cta: string;
    href: string;
  };
}

interface AdminNavigationEditorProps {
  blockDetail: ContentBlockDetail;
  history: ContentVersion[];
}

export function AdminNavigationEditor({
  blockDetail,
  history,
}: AdminNavigationEditorProps) {
  // Parse initial content
  const initialSections: NavSectionData[] = useMemo(() => {
    const rawData = (blockDetail.latest?.data || blockDetail.published?.data) as any;
    if (rawData && Array.isArray(rawData.sections) && rawData.sections.length > 0) {
      return rawData.sections;
    }
    return [];
  }, [blockDetail]);

  const [sections, setSections] = useState<NavSectionData[]>(initialSections);
  const [selectedSectionIdx, setSelectedSectionIdx] = useState<number>(0);
  const [selectedItemIdx, setSelectedItemIdx] = useState<number | null>(null);

  // Directory filter states
  const [dirSearch, setDirSearch] = useState("");
  const [dirCategory, setDirCategory] = useState<string>("All");
  const [copiedPath, setCopiedPath] = useState<string | null>(null);

  // Save / Publish states
  const [editorNotes, setEditorNotes] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);
  const [isDrafting, setIsDrafting] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Active section
  const currentSection = sections[selectedSectionIdx] || sections[0];

  // Filtered Public Pages Directory
  const filteredPages = useMemo(() => {
    return SYSTEM_PUBLIC_PAGES.filter((p) => {
      const matchesSearch =
        !dirSearch ||
        p.title.toLowerCase().includes(dirSearch.toLowerCase()) ||
        p.path.toLowerCase().includes(dirSearch.toLowerCase()) ||
        p.description.toLowerCase().includes(dirSearch.toLowerCase());
      const matchesCat = dirCategory === "All" || p.category === dirCategory;
      return matchesSearch && matchesCat;
    });
  }, [dirSearch, dirCategory]);

  const handleCopyPath = (path: string) => {
    navigator.clipboard.writeText(path);
    setCopiedPath(path);
    setTimeout(() => setCopiedPath(null), 2000);
  };

  const handleInsertPathToActive = (path: string) => {
    if (!currentSection) return;

    if (selectedItemIdx !== null && currentSection.items[selectedItemIdx]) {
      // Insert into active sub-menu item
      const updatedSections = [...sections];
      updatedSections[selectedSectionIdx].items[selectedItemIdx].href = path;
      setSections(updatedSections);
      setFeedbackMsg({
        type: "success",
        text: `Inserted path "${path}" into item: ${currentSection.items[selectedItemIdx].title}`,
      });
      setTimeout(() => setFeedbackMsg(null), 3000);
    } else {
      // Insert into top-level section href
      const updatedSections = [...sections];
      updatedSections[selectedSectionIdx].href = path;
      setSections(updatedSections);
      setFeedbackMsg({
        type: "success",
        text: `Inserted path "${path}" into section: ${currentSection.label}`,
      });
      setTimeout(() => setFeedbackMsg(null), 3000);
    }
  };

  // Section operations
  const handleAddSection = () => {
    const newSec: NavSectionData = {
      id: `section-${Date.now()}`,
      label: "New Navigation Menu",
      href: "/services",
      eyebrow: "00 · New Section Category",
      layout: "dual",
      serial: sections.length + 1,
      items: [],
      spotlight: {
        headline: "High Velocity Delivery",
        sub: "From requirement brief to candidate shortlist in 2 to 7 days.",
        cta: "Explore Now",
        href: "/services",
      },
    };
    const updated = [...sections, newSec];
    setSections(updated);
    setSelectedSectionIdx(updated.length - 1);
    setSelectedItemIdx(null);
  };

  const handleDeleteSection = (idx: number) => {
    if (sections.length <= 1) {
      alert("At least one navigation section is required.");
      return;
    }
    const updated = sections.filter((_, i) => i !== idx);
    setSections(updated);
    setSelectedSectionIdx(Math.max(0, idx - 1));
    setSelectedItemIdx(null);
  };

  const handleMoveSection = (idx: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= sections.length) return;

    const updated = [...sections];
    const [moved] = updated.splice(idx, 1);
    updated.splice(targetIdx, 0, moved);

    // Re-index serials
    updated.forEach((s, i) => {
      s.serial = i + 1;
    });

    setSections(updated);
    setSelectedSectionIdx(targetIdx);
  };

  // Submenu item operations
  const handleAddItem = () => {
    if (!currentSection) return;
    const newItem: DropdownItemData = {
      id: `item-${Date.now()}`,
      title: "New Submenu Item",
      desc: "Brief description of this destination solution or resource.",
      href: "/services",
      badge: "",
      icon: "Code",
      serial: currentSection.items.length + 1,
    };
    const updatedSections = [...sections];
    updatedSections[selectedSectionIdx].items.push(newItem);
    setSections(updatedSections);
    setSelectedItemIdx(updatedSections[selectedSectionIdx].items.length - 1);
  };

  const handleDeleteItem = (itemIdx: number) => {
    if (!currentSection) return;
    const updatedSections = [...sections];
    updatedSections[selectedSectionIdx].items = currentSection.items.filter((_, i) => i !== itemIdx);
    setSections(updatedSections);
    setSelectedItemIdx(null);
  };

  const handleMoveItem = (itemIdx: number, direction: "up" | "down") => {
    if (!currentSection) return;
    const targetIdx = direction === "up" ? itemIdx - 1 : itemIdx + 1;
    if (targetIdx < 0 || targetIdx >= currentSection.items.length) return;

    const updatedSections = [...sections];
    const items = [...currentSection.items];
    const [moved] = items.splice(itemIdx, 1);
    items.splice(targetIdx, 0, moved);

    // Re-index serials
    items.forEach((it, i) => {
      it.serial = i + 1;
    });

    updatedSections[selectedSectionIdx].items = items;
    setSections(updatedSections);
    setSelectedItemIdx(targetIdx);
  };

  // Save / Publish
  const handlePublish = async () => {
    setIsPublishing(true);
    setFeedbackMsg(null);

    const res = await publishContentBlockAction(
      "site_navigation",
      { sections },
      editorNotes || "Updated header navigation sections and sub-menu links."
    );

    setIsPublishing(false);
    if (res.success) {
      setFeedbackMsg({
        type: "success",
        text: `Published navigation version ${res.version} successfully. Public header cache revalidated.`,
      });
      setEditorNotes("");
    } else {
      setFeedbackMsg({
        type: "error",
        text: res.error || "Failed to publish navigation.",
      });
    }
  };

  const handleSaveDraft = async () => {
    setIsDrafting(true);
    setFeedbackMsg(null);

    const res = await saveDraftContentBlockAction(
      "site_navigation",
      { sections },
      editorNotes || "Draft navigation structure saved."
    );

    setIsDrafting(false);
    if (res.success) {
      setFeedbackMsg({
        type: "success",
        text: `Draft saved as version ${res.version}. Existing published navigation remains live.`,
      });
    } else {
      setFeedbackMsg({
        type: "error",
        text: res.error || "Failed to save draft.",
      });
    }
  };

  const handleRollback = async (targetVersion: number) => {
    if (!confirm(`Are you sure you want to restore navigation version ${targetVersion}?`)) return;

    const res = await rollbackContentBlockAction("site_navigation", targetVersion);
    if (res.success) {
      alert(`Navigation restored to version ${targetVersion} as new version ${res.version}.`);
      window.location.reload();
    } else {
      alert(res.error || "Failed to rollback.");
    }
  };

  return (
    <div className="h-full w-full overflow-y-auto thin-scrollbar p-4 sm:p-6 lg:p-8 font-enterprise">
      <div className="max-w-7xl mx-auto space-y-6 pb-20">
        {/* Top Header & Actions Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#bcd6fa]/50 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link
                href="/admin/content"
                className="inline-flex items-center gap-1 text-xs font-semibold text-mist hover:text-ink transition-colors"
              >
                <ArrowLeft size={13} />
                <span>Back to Content Hub</span>
              </Link>
              <span className="text-mist">·</span>
              <span className="rounded bg-electric/10 px-2 py-0.5 font-enterprise text-[10px] font-bold text-electric uppercase">
                CMS Navigation
              </span>
            </div>

          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-ink font-display">
            Dynamic Header Navigation & Menu Manager
          </h1>
          <p className="text-xs text-ink-soft">
            Configure header mega-menus, sub-menu destination links, order serials, and inspect verified public system routes.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setHistoryOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 text-xs font-semibold text-ink shadow-2xs hover:bg-canvas transition-colors cursor-pointer"
          >
            <History size={14} className="text-mist" />
            <span>Revision History ({history.length})</span>
          </button>

          <button
            type="button"
            disabled={isDrafting}
            onClick={handleSaveDraft}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#bcd6fa] bg-canvas px-3.5 py-2 text-xs font-semibold text-ink shadow-2xs hover:bg-white transition-colors cursor-pointer disabled:opacity-50"
          >
            <Save size={14} className="text-mist" />
            <span>{isDrafting ? "Saving Draft..." : "Save Draft"}</span>
          </button>

          <button
            type="button"
            disabled={isPublishing}
            onClick={handlePublish}
            className="inline-flex items-center gap-1.5 rounded-xl bg-ink px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-electric transition-colors cursor-pointer disabled:opacity-50"
          >
            <Send size={14} />
            <span>{isPublishing ? "Publishing Live..." : "Publish Navigation"}</span>
          </button>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedbackMsg && (
        <div
          className={`rounded-2xl p-3.5 text-xs font-medium border flex items-center gap-2.5 ${
            feedbackMsg.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-rose-50 border-rose-200 text-rose-800"
          }`}
        >
          {feedbackMsg.type === "success" ? <Check size={16} /> : <FileText size={16} />}
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* 2-Column Main Workspace */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left Column: Menu Structure & Submenu Editor (7 Cols) */}
        <div className="xl:col-span-7 space-y-6">
          {/* Top-Level Section Tabs / Accordion */}
          <div className="rounded-3xl border border-[#bcd6fa] bg-white p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#bcd6fa]/50 pb-3">
              <div className="flex items-center gap-2">
                <Compass size={16} className="text-electric" />
                <h2 className="text-sm font-bold text-ink font-display">
                  Top-Level Menu Sections ({sections.length})
                </h2>
              </div>

              <button
                type="button"
                onClick={handleAddSection}
                className="inline-flex items-center gap-1 rounded-lg bg-electric/10 hover:bg-electric/20 text-electric px-2.5 py-1 text-xs font-bold transition-colors cursor-pointer"
              >
                <Plus size={13} />
                <span>Add Section</span>
              </button>
            </div>

            {/* Horizontal Section Chips */}
            <div className="flex flex-wrap gap-2">
              {sections.map((sec, idx) => (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => {
                    setSelectedSectionIdx(idx);
                    setSelectedItemIdx(null);
                  }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    selectedSectionIdx === idx
                      ? "border-electric bg-electric text-white shadow-xs"
                      : "border-[#bcd6fa]/70 bg-canvas/40 text-ink-soft hover:bg-canvas hover:text-ink"
                  }`}
                >
                  <span className="font-enterprise text-[10px] font-bold opacity-75">{sec.serial}.</span>
                  <span>{sec.label}</span>
                </button>
              ))}
            </div>

            {/* Active Section Config Fields */}
            {currentSection && (
              <div className="pt-2 border-t border-[#bcd6fa]/40 space-y-3">
                <div className="flex items-center justify-between text-xs text-mist">
                  <span>Configuring Menu Section: <strong>{currentSection.label}</strong></span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={selectedSectionIdx === 0}
                      onClick={() => handleMoveSection(selectedSectionIdx, "up")}
                      className="p-1 rounded text-ink-soft hover:bg-canvas disabled:opacity-30 cursor-pointer"
                      title="Move Section Left / Up"
                    >
                      <ChevronUp size={15} />
                    </button>
                    <button
                      type="button"
                      disabled={selectedSectionIdx === sections.length - 1}
                      onClick={() => handleMoveSection(selectedSectionIdx, "down")}
                      className="p-1 rounded text-ink-soft hover:bg-canvas disabled:opacity-30 cursor-pointer"
                      title="Move Section Right / Down"
                    >
                      <ChevronDown size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteSection(selectedSectionIdx)}
                      className="p-1 rounded text-rose-500 hover:bg-rose-50 cursor-pointer ml-1"
                      title="Delete Section"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-semibold text-ink-soft mb-1">
                      Menu Label
                    </label>
                    <input
                      type="text"
                      value={currentSection.label}
                      onChange={(e) => {
                        const updated = [...sections];
                        updated[selectedSectionIdx].label = e.target.value;
                        setSections(updated);
                      }}
                      className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/30 px-3 py-2 text-ink focus:border-electric focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-ink-soft mb-1">
                      Primary Route Link (href)
                    </label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={currentSection.href}
                        onChange={(e) => {
                          const updated = [...sections];
                          updated[selectedSectionIdx].href = e.target.value;
                          setSections(updated);
                        }}
                        className="flex-1 rounded-xl border border-[#bcd6fa] bg-canvas/30 px-3 py-2 text-ink font-enterprise font-medium text-xs focus:border-electric focus:bg-white focus:outline-none"
                      />
                      <Link
                        href={currentSection.href || "#"}
                        target="_blank"
                        className="p-2 rounded-xl border border-[#bcd6fa] text-mist hover:text-ink hover:bg-canvas"
                        title="Open Route in New Tab"
                      >
                        <ExternalLink size={14} />
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-semibold text-ink-soft mb-1">
                      Eyebrow Header Label
                    </label>
                    <input
                      type="text"
                      value={currentSection.eyebrow}
                      onChange={(e) => {
                        const updated = [...sections];
                        updated[selectedSectionIdx].eyebrow = e.target.value;
                        setSections(updated);
                      }}
                      placeholder="e.g. 01 · Regulated Delivery Models"
                      className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/30 px-3 py-2 text-ink focus:border-electric focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-ink-soft mb-1">
                      Layout Columns
                    </label>
                    <select
                      value={currentSection.layout}
                      onChange={(e) => {
                        const updated = [...sections];
                        updated[selectedSectionIdx].layout = e.target.value as any;
                        setSections(updated);
                      }}
                      className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/30 px-3 py-2 text-ink focus:border-electric focus:bg-white focus:outline-none"
                    >
                      <option value="dual">Dual Columns (Grid of 2)</option>
                      <option value="single">Single Column (Stacked List)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sub-Menu Items Organizer */}
          {currentSection && (
            <div className="rounded-3xl border border-[#bcd6fa] bg-white p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#bcd6fa]/50 pb-3">
                <div className="flex items-center gap-2">
                  <Layers size={16} className="text-electric" />
                  <h3 className="text-sm font-bold text-ink font-display">
                    Submenu Items under &ldquo;{currentSection.label}&rdquo; ({currentSection.items.length})
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={handleAddItem}
                  className="inline-flex items-center gap-1 rounded-lg bg-ink hover:bg-electric text-white px-2.5 py-1 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Plus size={13} />
                  <span>Add Submenu Item</span>
                </button>
              </div>

              {currentSection.items.length === 0 ? (
                <div className="py-8 text-center text-xs text-mist border border-dashed border-[#bcd6fa] rounded-2xl">
                  No submenu items added yet. Click &ldquo;Add Submenu Item&rdquo; above.
                </div>
              ) : (
                <div className="space-y-3">
                  {currentSection.items.map((item, itemIdx) => {
                    const isSelected = selectedItemIdx === itemIdx;
                    return (
                      <div
                        key={item.id || itemIdx}
                        onClick={() => setSelectedItemIdx(itemIdx)}
                        className={`rounded-2xl border p-4 transition-all cursor-pointer ${
                          isSelected
                            ? "border-electric bg-electric/5 shadow-2xs"
                            : "border-[#bcd6fa]/60 bg-white hover:bg-canvas/30"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-enterprise text-xs font-bold text-electric">
                              #{item.serial || itemIdx + 1}
                            </span>
                            <span className="text-xs font-bold text-ink">
                              {item.title}
                            </span>
                            {item.badge && (
                              <span className="px-1.5 py-0.5 rounded bg-electric/10 text-[9px] font-enterprise font-bold text-electric">
                                {item.badge}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                            <button
                              type="button"
                              disabled={itemIdx === 0}
                              onClick={() => handleMoveItem(itemIdx, "up")}
                              className="p-1 rounded text-ink-soft hover:bg-canvas disabled:opacity-30 cursor-pointer"
                              title="Move Up"
                            >
                              <ChevronUp size={14} />
                            </button>
                            <button
                              type="button"
                              disabled={itemIdx === currentSection.items.length - 1}
                              onClick={() => handleMoveItem(itemIdx, "down")}
                              className="p-1 rounded text-ink-soft hover:bg-canvas disabled:opacity-30 cursor-pointer"
                              title="Move Down"
                            >
                              <ChevronDown size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteItem(itemIdx)}
                              className="p-1 rounded text-rose-500 hover:bg-rose-50 cursor-pointer ml-1"
                              title="Delete Item"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>

                        {/* Inline Item Edit Form */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                          <div>
                            <label className="block text-[10.5px] font-semibold text-mist mb-0.5">
                              Title
                            </label>
                            <input
                              type="text"
                              value={item.title}
                              onChange={(e) => {
                                const updatedSections = [...sections];
                                updatedSections[selectedSectionIdx].items[itemIdx].title = e.target.value;
                                setSections(updatedSections);
                              }}
                              className="w-full rounded-xl border border-[#bcd6fa] bg-white px-2.5 py-1.5 text-ink focus:border-electric focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[10.5px] font-semibold text-mist mb-0.5">
                              Destination Path (href)
                            </label>
                            <div className="flex items-center gap-1">
                              <input
                                type="text"
                                value={item.href}
                                onChange={(e) => {
                                  const updatedSections = [...sections];
                                  updatedSections[selectedSectionIdx].items[itemIdx].href = e.target.value;
                                  setSections(updatedSections);
                                }}
                                className="flex-1 rounded-xl border border-[#bcd6fa] bg-white px-2.5 py-1.5 text-ink font-enterprise font-medium text-xs focus:border-electric focus:outline-none"
                              />
                              <Link
                                href={item.href || "#"}
                                target="_blank"
                                className="p-1.5 rounded-lg border border-[#bcd6fa] text-mist hover:text-ink"
                                title="Open Path"
                              >
                                <ExternalLink size={12} />
                              </Link>
                            </div>
                          </div>
                        </div>

                        <div className="mt-2 text-xs">
                          <label className="block text-[10.5px] font-semibold text-mist mb-0.5">
                            Description
                          </label>
                          <input
                            type="text"
                            value={item.desc}
                            onChange={(e) => {
                              const updatedSections = [...sections];
                              updatedSections[selectedSectionIdx].items[itemIdx].desc = e.target.value;
                              setSections(updatedSections);
                            }}
                            className="w-full rounded-xl border border-[#bcd6fa] bg-white px-2.5 py-1.5 text-ink focus:border-electric focus:outline-none"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mt-2">
                          <div>
                            <label className="block text-[10.5px] font-semibold text-mist mb-0.5">
                              Badge Pill (Optional)
                            </label>
                            <input
                              type="text"
                              value={item.badge || ""}
                              onChange={(e) => {
                                const updatedSections = [...sections];
                                updatedSections[selectedSectionIdx].items[itemIdx].badge = e.target.value;
                                setSections(updatedSections);
                              }}
                              placeholder="e.g. Elastic, 15+ Countries, Proof"
                              className="w-full rounded-xl border border-[#bcd6fa] bg-white px-2.5 py-1.5 text-ink focus:border-electric focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[10.5px] font-semibold text-mist mb-0.5">
                              Icon Representation
                            </label>
                            <select
                              value={item.icon || "Code"}
                              onChange={(e) => {
                                const updatedSections = [...sections];
                                updatedSections[selectedSectionIdx].items[itemIdx].icon = e.target.value;
                                setSections(updatedSections);
                              }}
                              className="w-full rounded-xl border border-[#bcd6fa] bg-white px-2.5 py-1.5 text-ink focus:border-electric focus:outline-none"
                            >
                              {ICON_OPTIONS.map((opt) => (
                                <option key={opt.id} value={opt.id}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Spotlight Card Config */}
              {currentSection.spotlight && (
                <div className="mt-4 pt-3 border-t border-[#bcd6fa]/40 space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-ink">
                    <Sparkles size={14} className="text-electric" />
                    <span>Dropdown Spotlight Promo Card</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-[10.5px] font-semibold text-mist mb-0.5">Headline</label>
                      <input
                        type="text"
                        value={currentSection.spotlight.headline}
                        onChange={(e) => {
                          const updated = [...sections];
                          if (updated[selectedSectionIdx].spotlight) {
                            updated[selectedSectionIdx].spotlight!.headline = e.target.value;
                          }
                          setSections(updated);
                        }}
                        className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/30 px-2.5 py-1.5 text-ink focus:border-electric focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10.5px] font-semibold text-mist mb-0.5">CTA Text & Link</label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={currentSection.spotlight.cta}
                          onChange={(e) => {
                            const updated = [...sections];
                            if (updated[selectedSectionIdx].spotlight) {
                              updated[selectedSectionIdx].spotlight!.cta = e.target.value;
                            }
                            setSections(updated);
                          }}
                          placeholder="Button CTA"
                          className="w-1/2 rounded-xl border border-[#bcd6fa] bg-canvas/30 px-2.5 py-1.5 text-ink focus:border-electric focus:outline-none"
                        />
                        <input
                          type="text"
                          value={currentSection.spotlight.href}
                          onChange={(e) => {
                            const updated = [...sections];
                            if (updated[selectedSectionIdx].spotlight) {
                              updated[selectedSectionIdx].spotlight!.href = e.target.value;
                            }
                            setSections(updated);
                          }}
                          placeholder="/services"
                          className="w-1/2 rounded-xl border border-[#bcd6fa] bg-canvas/30 px-2.5 py-1.5 text-ink font-enterprise font-medium text-xs focus:border-electric focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="text-xs">
                    <label className="block text-[10.5px] font-semibold text-mist mb-0.5">Subtext</label>
                    <input
                      type="text"
                      value={currentSection.spotlight.sub}
                      onChange={(e) => {
                        const updated = [...sections];
                        if (updated[selectedSectionIdx].spotlight) {
                          updated[selectedSectionIdx].spotlight!.sub = e.target.value;
                        }
                        setSections(updated);
                      }}
                      className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/30 px-2.5 py-1.5 text-ink focus:border-electric focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Public Pages Reference Directory (5 Cols - Sticky on Desktop) */}
        <div className="xl:col-span-5 space-y-5 xl:sticky xl:top-6 self-start">
          <div className="rounded-3xl border border-[#bcd6fa] bg-white p-5 shadow-2xs space-y-4">
            <div className="border-b border-[#bcd6fa]/50 pb-3">
              <div className="flex items-center gap-2">
                <Globe size={16} className="text-electric" />
                <h3 className="text-sm font-bold text-ink font-display">
                  System Public Pages Directory
                </h3>
              </div>
              <p className="text-[11px] text-ink-soft mt-0.5">
                Verified list of built platform pages. Click &ldquo;Use Path&rdquo; to insert into the active menu link.
              </p>
            </div>

            {/* Directory Search & Filters */}
            <div className="space-y-2">
              <div className="relative">
                <Search size={13} className="absolute left-3 top-2.5 text-mist" />
                <input
                  type="text"
                  value={dirSearch}
                  onChange={(e) => setDirSearch(e.target.value)}
                  placeholder="Search pages by name, path or topic..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-[#bcd6fa] bg-canvas/30 text-xs text-ink placeholder-mist focus:border-electric focus:bg-white focus:outline-none"
                />
              </div>

              {/* Category Chips */}
              <div className="flex flex-wrap gap-1.5">
                {["All", "Marketing", "Solutions", "Tools", "Talent & Careers", "Portals"].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setDirCategory(cat)}
                    className={`px-2 py-0.5 rounded-md text-[10.5px] font-medium transition-colors cursor-pointer ${
                      dirCategory === cat
                        ? "bg-ink text-white"
                        : "bg-canvas text-ink-soft hover:bg-canvas-alt"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Selection Indicator */}
            <div className="rounded-xl border border-electric/30 bg-electric/5 p-2.5 text-[11px] text-ink-soft flex items-center justify-between">
              <div>
                <span className="text-mist">Target: </span>
                <strong className="text-ink">
                  {selectedItemIdx !== null && currentSection?.items[selectedItemIdx]
                    ? `Item: ${currentSection.items[selectedItemIdx].title}`
                    : `Section: ${currentSection?.label || "None"}`}
                </strong>
              </div>
              <span className="text-[10px] font-enterprise font-semibold text-electric">Click Use Path below</span>
            </div>

            {/* Pages List */}
            <div className="max-h-[calc(100vh-280px)] min-h-[300px] overflow-y-auto thin-scrollbar space-y-2.5 pr-1 divide-y divide-[#bcd6fa]/30">
              {filteredPages.map((page) => (
                <div key={page.path} className="pt-2.5 first:pt-0 group">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-ink truncate">
                          {page.title}
                        </span>
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-enterprise font-medium bg-canvas text-mist">
                          {page.category}
                        </span>
                      </div>
                      <div className="font-enterprise text-[11px] text-electric font-semibold truncate mt-0.5">
                        {page.path}
                      </div>
                      <p className="text-[10.5px] text-mist line-clamp-1 mt-0.5">
                        {page.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleCopyPath(page.path)}
                        className="p-1.5 rounded-lg border border-[#bcd6fa]/60 bg-white hover:bg-canvas text-ink-soft cursor-pointer"
                        title="Copy Path to Clipboard"
                      >
                        {copiedPath === page.path ? (
                          <Check size={12} className="text-signal" />
                        ) : (
                          <Copy size={12} />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleInsertPathToActive(page.path)}
                        className="px-2 py-1 rounded-lg bg-ink hover:bg-electric text-white text-[10px] font-bold transition-colors cursor-pointer"
                        title="Insert into Selected Menu Target"
                      >
                        Use Path
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Revision History Slide-Over Drawer */}
      {historyOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-[#0a1428]/50 backdrop-blur-xs transition-opacity"
            onClick={() => setHistoryOpen(false)}
          />
          <div className="relative w-full max-w-md h-full bg-white shadow-2xl p-6 overflow-y-auto z-10 flex flex-col justify-between font-enterprise">
            <div>
              <div className="flex items-center justify-between border-b border-[#bcd6fa]/50 pb-4 mb-5">
                <div>
                  <h3 className="text-base font-bold text-ink font-display">
                    Navigation Revision History
                  </h3>
                  <p className="text-xs text-ink-soft">
                    Linear audit history of all published and draft versions.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setHistoryOpen(false)}
                  className="rounded-lg p-1.5 text-mist hover:bg-canvas cursor-pointer"
                >
                  <ArrowLeft size={16} />
                </button>
              </div>

              <div className="space-y-3">
                {history.length === 0 ? (
                  <div className="text-xs text-mist py-8 text-center">
                    No historical revisions found.
                  </div>
                ) : (
                  history.map((ver) => (
                    <div
                      key={ver.id || ver.version}
                      className="rounded-2xl border border-[#bcd6fa]/60 p-3.5 space-y-1 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-ink">Version {ver.version}</span>
                          {ver.is_published && (
                            <span className="rounded bg-emerald-100 text-emerald-800 px-1.5 py-0.2 text-[9px] font-enterprise font-bold">
                              ACTIVE PUBLISHED
                            </span>
                          )}
                        </div>
                        <span className="font-enterprise font-medium text-[10px] text-mist">
                          {ver.created_at ? new Date(ver.created_at).toLocaleDateString() : ""}
                        </span>
                      </div>

                      <div className="text-[11px] text-ink-soft">
                        {ver.notes || "No editor notes recorded"}
                      </div>
                      <div className="text-[10px] text-mist font-enterprise">
                        Author: {ver.author_name || "Staff Administrator"}
                      </div>

                      {!ver.is_published && (
                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={() => handleRollback(ver.version)}
                            className="rounded-lg border border-[#bcd6fa] bg-canvas px-2.5 py-1 text-[10px] font-bold text-ink hover:bg-white transition-colors cursor-pointer"
                          >
                            Restore Version {ver.version}
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
