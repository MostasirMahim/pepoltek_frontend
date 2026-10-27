"use client";

import { useState } from "react";
import Link from "next/link";
import {
  RecruiterCandidate,
  RecruiterPod,
  AICandidateSearchResult,
} from "@/types/recruiter.types";
import {
  createShortlistSubmissionAction,
  sourceCandidateForRequisitionAction,
  searchCandidatesWithAIAction,
  ShortlistSubmissionItemInput,
} from "@/actions/recruiter.actions";
import {
  UserPlus,
  Building2,
  Send,
  Check,
  Sparkles,
  Bot,
  Cpu,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  LayoutGrid,
  List,
  Download,
  Copy,
  Plus,
  Filter,
} from "lucide-react";

import { cleanJobTitle } from "@/lib/title-utils";
import {
  Users,
  Search,
  Eye,
  X,
  CheckCircle,
  Clock,
  ShieldCheck,
  Zap,
  Award,
  ExternalLink,
  DollarSign,
  FileText,
} from "@/components/ui/Icons";
import { CandidateBenchmarkScores } from "@/components/candidate/common/CandidateBenchmarkScores";

interface RecruiterCandidatesViewProps {
  candidates: RecruiterCandidate[];
  pods?: RecruiterPod[];
}

export function RecruiterCandidatesView({
  candidates,
  pods = [],
}: RecruiterCandidatesViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sectorFilter, setSectorFilter] = useState("All");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  // AI DeepSeek Semantic Search State
  const [isAiMode, setIsAiMode] = useState<boolean>(false);
  const [aiQuery, setAiQuery] = useState<string>("");
  const [isAiSearching, setIsAiSearching] = useState<boolean>(false);
  const [aiSearchResult, setAiSearchResult] = useState<AICandidateSearchResult | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  // Candidate dossier drawer state
  const [selectedCandidate, setSelectedCandidate] = useState<RecruiterCandidate | null>(null);
  const [dossierTab, setDossierTab] = useState<"profile" | "vetting" | "compliance" | "actions">("profile");

  // Multi-selection state for Shortlist Builder (ATS-06, D-01)
  const [selectedCandidateIds, setSelectedCandidateIds] = useState<string[]>([]);
  const [isShortlistDrawerOpen, setIsShortlistDrawerOpen] = useState(false);
  const [shortlistTab, setShortlistTab] = useState<"setup" | "roster" | "preview">("setup");

  // Shortlist configuration state
  const [targetRequisitionId, setTargetRequisitionId] = useState<string>(
    pods.length > 0 ? pods[0].id : "REQ-FINTECH-01"
  );
  const [clientName, setClientName] = useState<string>("Enterprise Client Partner");
  const [deliveryChannel, setDeliveryChannel] = useState<"email" | "im" | "client_ats" | "portal">("email");
  const [pitchNotes, setPitchNotes] = useState<string>(
    "Pre-vetted engineering specialists with 5+ yrs production experience. 7-day sprint start availability with verified technical vetting scores."
  );

  // Data masking controls (ATS-06, AC-06)
  const [maskContact, setMaskContact] = useState<boolean>(true);
  const [includeVetting, setIncludeVetting] = useState<boolean>(true);
  const [includeRates, setIncludeRates] = useState<boolean>(true);

  // Candidate Sourcing Drawer State (Stage 2: Market Mapping / Sourced)
  const [sourcingCandidate, setSourcingCandidate] = useState<RecruiterCandidate | null>(null);
  const [sourcingRequisitionId, setSourcingRequisitionId] = useState<string>(
    pods.length > 0 ? pods[0].id : ""
  );
  const [sourcingNote, setSourcingNote] = useState<string>("");
  const [isSourcingSubmitting, setIsSourcingSubmitting] = useState(false);
  const [sourcingResult, setSourcingResult] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleSourceCandidate = async () => {
    if (!sourcingCandidate || !sourcingRequisitionId) return;
    setIsSourcingSubmitting(true);
    setSourcingResult(null);

    const res = await sourceCandidateForRequisitionAction({
      candidate_id: sourcingCandidate.id,
      requisition_id: sourcingRequisitionId,
      note: sourcingNote.trim() || `Candidate sourced from talent directory by recruiter`,
    });

    setIsSourcingSubmitting(false);
    if (res.success) {
      setSourcingResult({
        type: "success",
        message: `${sourcingCandidate.name} has been successfully sourced into the Market Mapping pipeline!`,
      });
      setTimeout(() => {
        setSourcingCandidate(null);
        setSourcingResult(null);
        setSourcingNote("");
      }, 1800);
    } else {
      setSourcingResult({
        type: "error",
        message: res.error || "Failed to source candidate.",
      });
    }
  };

  // Submission execution state
  const [isSubmittingShortlist, setIsSubmittingShortlist] = useState<boolean>(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<{ id: string; timestamp: string } | null>(null);
  const [notification, setNotification] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setNotification({ type, text });
    setTimeout(() => setNotification(null), 4500);
  };

  const handleAiSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const q = aiQuery.trim();
    if (!q) {
      showToast("Please enter search criteria for DeepSeek AI.", "error");
      return;
    }

    setIsAiSearching(true);
    setAiError(null);

    const res = await searchCandidatesWithAIAction(q, sectorFilter);
    setIsAiSearching(false);

    if (res.success && res.data) {
      setAiSearchResult(res.data);
      showToast(
        `DeepSeek AI evaluated ${res.data.total_evaluated} specialists and matched ${res.data.candidates.length} candidates in ${res.data.latency_seconds}s.`,
        "success"
      );
    } else {
      setAiError(res.error || "DeepSeek AI search failed.");
      showToast(res.error || "AI search failed.", "error");
    }
  };

  const handleClearAiSearch = () => {
    setAiSearchResult(null);
    setAiQuery("");
    setAiError(null);
  };

  const filteredCandidates = candidates.filter((c) => {
    const matchesSector = sectorFilter === "All" || c.sector === sectorFilter;
    const q = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.title.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q) ||
      (c.display_id && c.display_id.toLowerCase().includes(q)) ||
      (c.location && c.location.toLowerCase().includes(q)) ||
      c.skills.some((s) => s.toLowerCase().includes(q));
    return matchesSector && matchesSearch;
  });

  const rawDisplayedPool = (isAiMode && aiSearchResult)
    ? aiSearchResult.candidates.filter(
        (c) => sectorFilter === "All" || c.sector === sectorFilter
      )
    : filteredCandidates;

  // De-duplicate candidates by unique id so that keys are guaranteed 100% unique
  const displayedCandidates = rawDisplayedPool.filter(
    (c, idx, arr) => arr.findIndex((item) => item.id === c.id) === idx
  );

  const rawCandidatePool = (isAiMode && aiSearchResult)
    ? [...candidates, ...aiSearchResult.candidates.filter(ac => !candidates.some(c => c.id === ac.id))]
    : candidates;

  const allCandidatePool = rawCandidatePool.filter(
    (c, idx, arr) => arr.findIndex((item) => item.id === c.id) === idx
  );

  const selectedCandidates = allCandidatePool.filter((c) => selectedCandidateIds.includes(c.id));

  // Multi-selection handlers
  const toggleSelectCandidate = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedCandidateIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectAllFiltered = () => {
    setSelectedCandidateIds(displayedCandidates.map((c) => c.id));
    showToast(`Selected all ${displayedCandidates.length} specialists.`);
  };

  const clearSelection = () => {
    setSelectedCandidateIds([]);
  };


  const handleAddToPod = (cand: RecruiterCandidate, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!selectedCandidateIds.includes(cand.id)) {
      setSelectedCandidateIds((prev) => [...prev, cand.id]);
    }
    showToast(`Added ${cand.name} (${cand.id}) to active shortlist.`);
  };

  // Generate shareable markdown text pitch (Zero em dashes house style)
  const generateShareablePitch = () => {
    const targetPodObj = pods.find((p) => p.id === targetRequisitionId);
    const targetTitle = targetPodObj ? targetPodObj.name : targetRequisitionId || "Direct Placement";

    const lines: string[] = [
      "# PEPOLTEK CANDIDATE SUBMISSION DOSSIER",
      `Target Requisition: ${targetTitle}`,
      `Client Partner: ${clientName}`,
      `Delivery Channel: ${deliveryChannel.toUpperCase()}`,
      `Generated: ${new Date().toUTCString()}`,
      "",
      `Executive Summary: ${pitchNotes}`,
      "",
      `## CANDIDATE SHORTLIST (${selectedCandidates.length} SPECIALISTS)`,
    ];

    selectedCandidates.forEach((c, idx) => {
      const skillsStr = c.skills.join(", ");
      const contactInfo = maskContact
        ? "[Contact details masked: Protected by Pepoltek Escrow]"
        : `${c.email || "specialist@pepoltek.com"} | ${c.phone || "+1 (555) 019-2834"}`;

      lines.push(
        `${idx + 1}. ${c.name} (${c.title})`,
        `   - Specialist ID: ${c.id}`,
        `   - Sector: ${c.sector}`,
        `   - Match Score: ${c.matchScore} (Verified Vetted)`,
        `   - Experience: ${c.experience}`,
        includeRates ? `   - Billing Rate: ${c.rate}` : "",
        `   - Core Skills: ${skillsStr}`,
        `   - Placement Contact: ${contactInfo}`,
        c.notes ? `   - Recruiter Notes: ${c.notes}` : "",
        ""
      );
    });

    lines.push(
      "---",
      "CONFIDENTIALITY NOTICE: This submission dossier contains proprietary vetted candidate assessments under Pepoltek staffing terms. Contact your Pepoltek staffing lead to schedule interviews."
    );

    return lines.filter(Boolean).join("\n");
  };

  const handleCopyPitch = async () => {
    const text = generateShareablePitch();
    try {
      await navigator.clipboard.writeText(text);
      showToast("Submission pitch copied to clipboard. Ready to paste into Email or Slack.");
    } catch {
      showToast("Unable to copy to clipboard automatically.", "error");
    }
  };

  const handleDownloadCsv = () => {
    const headers = [
      "Candidate_ID",
      "Full_Name",
      "Title",
      "Sector",
      "Experience",
      "Billing_Rate",
      "Match_Score",
      "Skills",
      "Contact_Protection",
      "Recruiter_Notes",
    ];

    const rows = selectedCandidates.map((c) => {
      const contactStr = maskContact
        ? "[Protected by Pepoltek Escrow]"
        : `${c.email || ""} ${c.phone || ""}`;
      return [
        `"${c.id}"`,
        `"${c.name}"`,
        `"${c.title}"`,
        `"${c.sector}"`,
        `"${c.experience}"`,
        includeRates ? `"${c.rate}"` : `"Confidential"`,
        `"${c.matchScore}"`,
        `"${c.skills.join(", ")}"`,
        `"${contactStr}"`,
        `"${c.notes || "Pre-vetted specialist"}"`,
      ].join(",");
    });

    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Pepoltek_Shortlist_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Downloaded standard ATS CSV for client import.");
  };

  const handleSubmitShortlist = async () => {
    if (selectedCandidates.length === 0) {
      showToast("Please select at least 1 specialist for the shortlist.", "error");
      return;
    }

    setIsSubmittingShortlist(true);

    const items: ShortlistSubmissionItemInput[] = selectedCandidates.map((c) => ({
      candidate_id: c.id,
      candidate_name: c.name,
      candidate_title: c.title,
      sector: c.sector,
      experience: c.experience,
      rate: includeRates ? c.rate : "Confidential",
      match_score: c.matchScore,
      skills: c.skills,
      revealed_fields: {
        show_contact: !maskContact,
        show_vetting: includeVetting,
        show_rates: includeRates,
      },
      masked_contact: {
        email: maskContact ? "[Protected by Pepoltek Escrow]" : c.email || "direct@pepoltek.com",
        phone: maskContact ? "[Protected by Pepoltek Escrow]" : c.phone || "+1 (555) 019-2834",
      },
      recruiter_notes: c.notes || pitchNotes,
    }));

    const res = await createShortlistSubmissionAction({
      requisition_id: targetRequisitionId || undefined,
      client_name: clientName,
      channel: deliveryChannel,
      pitch_notes: pitchNotes,
      items,
    });

    setIsSubmittingShortlist(false);

    if (res.success) {
      const cleanSubId = res.data?.id ? String(res.data.id).replace(/-/g, "") : "";
      const subId = cleanSubId ? cleanSubId.slice(-6).toUpperCase() : "SUB-LIVE";
      setSubmissionSuccess({
        id: subId,
        timestamp: new Date().toLocaleTimeString(),
      });
      showToast("Shortlist package logged to ATS. Candidates transitioned to Interview / Submitted to Client.");
    } else {
      showToast(res.error || "Failed to log submission package.", "error");
    }
  };

  const currentPool = isAiMode && aiSearchResult ? aiSearchResult.candidates : candidates;
  const allCount = currentPool.length;
  const techCount = currentPool.filter((c) => c.sector === "Software Tech").length;
  const healthCount = currentPool.filter((c) => c.sector === "Healthcare").length;

  return (
    <div className="space-y-6 pb-24 font-enterprise">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-electric/30 bg-electric/10 px-3 py-0.5 text-[11px] font-enterprise font-bold text-electric uppercase tracking-wider shadow-2xs">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-electric opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-electric" />
            </span>
            <span>TALENT POOL (CANDIDATES) • LIVE ATS DIRECTORY</span>
          </div>
          <h1 className="mt-2 font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Talent Pool (Candidates)
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 max-w-2xl font-medium">
            Active candidate directory across Software Tech and Healthcare sectors sourced directly from live database profiles.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {selectedCandidateIds.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setIsShortlistDrawerOpen(true);
                setSubmissionSuccess(null);
              }}
              className="rounded-xl bg-electric px-4 py-2.5 font-display text-xs font-bold text-white shadow-xs hover:bg-electric-bright transition-all inline-flex items-center gap-2 cursor-pointer animate-in fade-in-0"
            >
              <FileText size={14} />
              <span>Shortlist Submission ({selectedCandidateIds.length})</span>
            </button>
          )}

          <Link
            href="/recruiter/interviews"
            className="rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 font-display text-xs font-bold text-slate-800 shadow-2xs hover:bg-slate-50 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Clock size={13} className="text-electric" />
            <span>Sprint Interviews</span>
          </Link>

          <div className="rounded-xl bg-slate-900 px-4 py-2.5 font-enterprise text-xs font-bold text-white shadow-xs inline-flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span>{displayedCandidates.length} Candidates Live</span>
          </div>
        </div>
      </div>

      {/* Executive Stat Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Active Pool</span>
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 font-display">{displayedCandidates.length}</span>
            <span className="text-xs font-semibold text-slate-500">Candidates</span>
          </div>
          <p className="mt-1 text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <CheckCircle size={11} /> {displayedCandidates.filter(c => c.verified).length} Vetted Specialists
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Software Tech</span>
            <span className="rounded-md bg-blue-50 text-blue-700 font-bold px-1.5 py-0.5 text-[10px]">Track 01</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 font-display">
              {displayedCandidates.filter(c => c.sector === "Software Tech").length}
            </span>
            <span className="text-xs font-semibold text-slate-500">Engineers</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500 font-medium truncate">
            Full-Stack, Cloud &amp; Distributed
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Healthcare Track</span>
            <span className="rounded-md bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.5 text-[10px]">Track 02</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 font-display">
              {displayedCandidates.filter(c => c.sector === "Healthcare").length}
            </span>
            <span className="text-xs font-semibold text-slate-500">Clinicians</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500 font-medium truncate">
            Clinical Care &amp; Compliance
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Immediate Availability</span>
            <span className="rounded-md bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.5 text-[10px]">Ready</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 font-display">
              {displayedCandidates.filter(c => c.availability === "Immediate").length}
            </span>
            <span className="text-xs font-semibold text-slate-500">Immediate</span>
          </div>
          <p className="mt-1 text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <Zap size={11} className="text-signal" /> Ready for Sprint Dispatch
          </p>
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
          <CheckCircle size={16} />
          <span>{notification.text}</span>
        </div>
      )}

      {/* Search Mode Switcher, View Switcher & Filter Controls */}
      <div className="space-y-3.5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3.5">
          {/* Left: Mode Switcher (Standard Directory vs DeepSeek AI) */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100/90 border border-slate-200 shadow-2xs">
            <button
              type="button"
              onClick={() => {
                setIsAiMode(false);
                setAiSearchResult(null);
              }}
              className={`rounded-lg px-4 py-2 font-enterprise text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                !isAiMode
                  ? "bg-white text-slate-900 shadow-xs border border-slate-200"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Search size={13} className={!isAiMode ? "text-electric" : "text-slate-400"} />
              <span>Standard Directory</span>
            </button>

            <button
              type="button"
              onClick={() => setIsAiMode(true)}
              className={`rounded-lg px-4 py-2 font-enterprise text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                isAiMode
                  ? "bg-gradient-to-r from-electric to-[#0052cc] text-white shadow-xs"
                  : "text-electric hover:bg-white/70"
              }`}
            >
              <Sparkles size={13} className={isAiMode ? "animate-pulse text-amber-300" : "text-electric"} />
              <span>DeepSeek AI Semantic Search</span>
              <span className="rounded-full bg-white/20 px-1.5 py-0.5 font-enterprise text-[9px] uppercase tracking-wider text-white font-bold">
                API Active
              </span>
            </button>
          </div>

          {/* Right: View Mode Segmented Switcher + Multi-selection Controls */}
          <div className="flex items-center gap-2.5">
            {/* View Mode Toggle: Table vs Grid */}
            <div className="flex items-center rounded-xl bg-slate-100/90 p-1 border border-slate-200 shadow-2xs">
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 font-enterprise text-xs font-bold transition-all cursor-pointer ${
                  viewMode === "table"
                    ? "bg-white text-slate-900 shadow-xs border border-slate-200"
                    : "text-slate-500 hover:text-slate-900"
                }`}
                title="Enterprise Table View"
              >
                <List size={14} className={viewMode === "table" ? "text-electric" : "text-slate-400"} />
                <span>Table</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 font-enterprise text-xs font-bold transition-all cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-white text-slate-900 shadow-xs border border-slate-200"
                    : "text-slate-500 hover:text-slate-900"
                }`}
                title="Grid Card View"
              >
                <LayoutGrid size={14} className={viewMode === "grid" ? "text-electric" : "text-slate-400"} />
                <span>Grid</span>
              </button>
            </div>

            <div className="h-5 w-px bg-slate-300 hidden sm:block" />

            <button
              type="button"
              onClick={selectAllFiltered}
              className="rounded-xl border border-slate-300 bg-white px-3.5 py-2 font-enterprise text-xs font-bold text-slate-800 hover:border-electric hover:text-electric transition-colors cursor-pointer whitespace-nowrap shadow-2xs"
            >
              Select All ({displayedCandidates.length})
            </button>

            {selectedCandidateIds.length > 0 && (
              <button
                type="button"
                onClick={clearSelection}
                className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2 font-enterprise text-xs font-bold text-red-600 hover:bg-red-100 transition-colors cursor-pointer whitespace-nowrap shadow-2xs"
              >
                Deselect ({selectedCandidateIds.length})
              </button>
            )}
          </div>
        </div>

        {/* Filter Bar & Search Input Area */}
        {!isAiMode ? (
          /* Standard Search with Sector Tabs */
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Sector Tabs with Live Counts */}
            <div className="flex items-center gap-2 overflow-x-auto thin-scrollbar pb-1 sm:pb-0 shrink-0">
              {[
                { label: "All", count: allCount },
                { label: "Software Tech", count: techCount },
                { label: "Healthcare", count: healthCount },
              ].map((item) => {
                const isSelected = sectorFilter === item.label;
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => setSectorFilter(item.label)}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 font-enterprise text-xs font-bold transition-all cursor-pointer whitespace-nowrap shadow-2xs ${
                      isSelected
                        ? "bg-slate-900 text-white shadow-xs"
                        : "bg-white border border-slate-300 text-slate-700 hover:text-slate-900 hover:border-slate-400"
                    }`}
                  >
                    <span>{item.label}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        isSelected
                          ? "bg-white/20 text-white"
                          : "bg-slate-100 text-slate-600 border border-slate-200"
                      }`}
                    >
                      {item.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Prominent Keyword Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filter by name, skill (React, Go, Python, AWS), ID, or location..."
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 pl-10 pr-28 text-xs text-slate-900 placeholder-slate-400 focus:border-electric focus:ring-4 focus:ring-electric/15 focus:outline-hidden transition-all shadow-2xs font-enterprise"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-24 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 cursor-pointer transition-colors"
                  title="Clear search input"
                >
                  <X size={14} />
                </button>
              )}
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-md bg-slate-100 border border-slate-200 px-2 py-0.5 text-[10px] font-enterprise font-bold text-slate-600 pointer-events-none">
                {displayedCandidates.length} matches
              </div>
            </div>
          </div>
        ) : (
          /* DeepSeek AI Semantic Natural Language Search */
          <div className="rounded-2xl border-2 border-electric/40 bg-gradient-to-b from-electric/[0.03] to-white p-3.5 sm:p-4 shadow-xs space-y-3">
            <form onSubmit={handleAiSearch} className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <Bot className="absolute left-3.5 top-1/2 -translate-y-1/2 text-electric" size={16} />
                <input
                  type="text"
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  placeholder="Describe hiring needs in plain English (e.g. 'Senior Python developer with Django and AWS for healthcare C2C')..."
                  className="w-full rounded-xl border border-electric/50 bg-white px-3.5 py-2.5 pl-10 text-xs text-ink placeholder-ink-soft/70 focus:border-electric focus:ring-2 focus:ring-electric/20 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  disabled={isAiSearching || !aiQuery.trim()}
                  className="rounded-xl bg-gradient-to-r from-electric to-[#0052cc] px-4 py-2.5 font-display text-xs font-bold text-white shadow-xs hover:from-electric-bright hover:to-electric transition-all disabled:opacity-50 cursor-pointer inline-flex items-center gap-2 whitespace-nowrap"
                >
                  {isAiSearching ? (
                    <>
                      <RefreshCw size={13} className="animate-spin" />
                      <span>DeepSeek AI Matching...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={13} className="text-amber-300" />
                      <span>Search with DeepSeek AI</span>
                    </>
                  )}
                </button>

                {aiSearchResult && (
                  <button
                    type="button"
                    onClick={handleClearAiSearch}
                    className="rounded-xl border border-[#bcd6fa] bg-white px-3 py-2.5 font-display text-xs font-semibold text-ink-soft hover:text-ink hover:bg-canvas transition-colors cursor-pointer inline-flex items-center gap-1.5 whitespace-nowrap"
                  >
                    <X size={13} />
                    <span>Clear Filters</span>
                  </button>
                )}
              </div>
            </form>

            {/* Quick Suggestion Prompts */}
            {!aiSearchResult && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] text-ink-soft">
                <span className="font-enterprise font-medium text-mist">Try prompt:</span>
                {[
                  "Senior Python Django developer with Postgres and AWS",
                  "Critical Care ICU Nurse with BLS and patient care",
                  "Principal Distributed Systems Architect remote C2C",
                  "Lead Healthcare AI Engineer clinical systems",
                ].map((promptText) => (
                  <button
                    key={promptText}
                    type="button"
                    onClick={() => {
                      setAiQuery(promptText);
                    }}
                    className="rounded-lg bg-white border border-[#bcd6fa]/70 px-2.5 py-1 text-ink-soft hover:text-electric hover:border-electric transition-all cursor-pointer font-enterprise"
                  >
                    &ldquo;{promptText}&rdquo;
                  </button>
                ))}
              </div>
            )}

            {/* Extracted Criteria Chips Banner (Technical SRS Section 9.3) */}
            {aiSearchResult && (
              <div className="rounded-xl border border-electric/30 bg-white p-3 space-y-2 animate-in fade-in-0">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 font-enterprise text-[11px] font-bold text-electric">
                    <CheckCircle2 size={13} className="text-signal" />
                    <span>DeepSeek AI Extracted Criteria Chips</span>
                  </div>

                  <div className="flex items-center gap-2 font-enterprise text-[10px] text-mist">
                    <span className="rounded-full bg-electric/10 text-electric px-2 py-0.5 font-bold">
                      {aiSearchResult.provider}
                    </span>
                    <span>Latency: {aiSearchResult.latency_seconds}s</span>
                    <span>Pool: {aiSearchResult.total_evaluated} specialists</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  {aiSearchResult.extracted_filters.role && (
                    <span className="rounded-md bg-canvas px-2.5 py-1 font-enterprise text-xs font-semibold text-ink border border-[#bcd6fa]/60 flex items-center gap-1">
                      <span className="text-mist font-normal">Role:</span>
                      <span>{aiSearchResult.extracted_filters.role}</span>
                    </span>
                  )}

                  {aiSearchResult.extracted_filters.level && aiSearchResult.extracted_filters.level !== "all" && (
                    <span className="rounded-md bg-canvas px-2.5 py-1 font-enterprise text-xs font-semibold text-ink border border-[#bcd6fa]/60 flex items-center gap-1">
                      <span className="text-mist font-normal">Level:</span>
                      <span className="capitalize">{aiSearchResult.extracted_filters.level}</span>
                    </span>
                  )}

                  {aiSearchResult.extracted_filters.sector && aiSearchResult.extracted_filters.sector !== "all" && (
                    <span className="rounded-md bg-canvas px-2.5 py-1 font-enterprise text-xs font-semibold text-ink border border-[#bcd6fa]/60 flex items-center gap-1">
                      <span className="text-mist font-normal">Sector:</span>
                      <span className="capitalize">{aiSearchResult.extracted_filters.sector}</span>
                    </span>
                  )}

                  {Array.isArray(aiSearchResult.extracted_filters.skills) &&
                    aiSearchResult.extracted_filters.skills.map((sk) => (
                      <span
                        key={sk}
                        className="rounded-md bg-electric/10 text-electric px-2.5 py-1 font-enterprise text-xs font-bold border border-electric/30 flex items-center gap-1"
                      >
                        <span>{sk}</span>
                        <Check size={10} />
                      </span>
                    ))}

                  {Array.isArray(aiSearchResult.extracted_filters.engagement) &&
                    aiSearchResult.extracted_filters.engagement[0] !== "all" && (
                      <span className="rounded-md bg-canvas px-2.5 py-1 font-enterprise text-xs font-semibold text-ink border border-[#bcd6fa]/60 flex items-center gap-1">
                        <span className="text-mist font-normal">Engagement:</span>
                        <span>{aiSearchResult.extracted_filters.engagement.join(", ")}</span>
                      </span>
                    )}
                </div>
              </div>
            )}

            {aiError && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-2.5 text-xs text-red-700 flex items-center gap-2">
                <AlertCircle size={14} />
                <span>{aiError}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Talent Grid */}
      {displayedCandidates.length === 0 ? (
        <div className="rounded-3xl border border-[#bcd6fa] bg-white p-8 sm:p-12 text-center shadow-xs">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-electric/10 text-electric">
            <Users size={24} />
          </div>
          <h3 className="font-display text-base font-bold text-ink">No Candidates in Directory</h3>
          <p className="mt-1 text-xs text-ink-soft max-w-md mx-auto leading-relaxed">
            There are currently no pre-vetted specialists matching your filter parameters. As candidates complete technical intake and vetting, they will appear here.
          </p>
        </div>
      ) : viewMode === "table" ? (
        /* Enterprise-Grade Candidate Data Table */
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto thin-scrollbar">
            <table className="w-full border-collapse text-left text-xs font-enterprise">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/95 text-slate-700 font-bold text-[11px] uppercase tracking-wider">
                  <th className="w-12 px-3 py-3.5 text-center">
                    <button
                      type="button"
                      onClick={() => {
                        const allDisplayedSelected =
                          displayedCandidates.length > 0 &&
                          displayedCandidates.every((c) => selectedCandidateIds.includes(c.id));
                        if (allDisplayedSelected) {
                          clearSelection();
                        } else {
                          selectAllFiltered();
                        }
                      }}
                      className={`h-4.5 w-4.5 rounded-md border flex items-center justify-center transition-all cursor-pointer mx-auto ${
                        displayedCandidates.length > 0 &&
                        displayedCandidates.every((c) => selectedCandidateIds.includes(c.id))
                          ? "bg-electric border-electric text-white shadow-2xs"
                          : "bg-white border-slate-300 hover:border-electric text-transparent"
                      }`}
                      title="Select / Deselect all displayed specialists"
                    >
                      <Check size={12} className="stroke-[3]" />
                    </button>
                  </th>
                  <th className="w-[230px] min-w-[210px] px-4 py-3.5">Specialist &amp; Role</th>
                  <th className="w-[130px] min-w-[120px] px-3 py-3.5">Sector &amp; Track</th>
                  <th className="w-[120px] min-w-[110px] px-3 py-3.5">Experience &amp; Rate</th>
                  <th className="w-[120px] min-w-[110px] px-3 py-3.5">Availability</th>
                  <th className="min-w-[180px] px-3 py-3.5">Key Verified Skills</th>
                  <th className="w-[95px] min-w-[90px] px-3 py-3.5 text-center">ATS Match</th>
                  <th className="w-[220px] min-w-[210px] px-4 py-3.5 text-right sticky right-0 z-20 bg-slate-50 border-l border-slate-200/90 shadow-[-10px_0_12px_-4px_rgba(0,0,0,0.08)]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {displayedCandidates.map((cand) => {
                  const isSelected = selectedCandidateIds.includes(cand.id);
                  const isTech = cand.sector === "Software Tech";
                  const initials = cand.name
                    ? cand.name
                        .split(" ")
                        .map((n) => n[0])
                        .filter(Boolean)
                        .slice(0, 2)
                        .join("")
                        .toUpperCase()
                    : "SP";

                  return (
                    <tr
                      key={cand.id}
                      onClick={() => {
                        setSelectedCandidate(cand);
                        setDossierTab("profile");
                      }}
                      className={`group transition-colors cursor-pointer ${
                        isSelected
                          ? "bg-electric/[0.05] hover:bg-electric/[0.08]"
                          : "hover:bg-slate-50/80"
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="w-12 px-3 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={(e) => toggleSelectCandidate(cand.id, e)}
                          className={`h-4.5 w-4.5 rounded-md border flex items-center justify-center transition-all cursor-pointer mx-auto ${
                            isSelected
                              ? "bg-electric border-electric text-white shadow-2xs"
                              : "bg-white border-slate-300 hover:border-electric text-transparent"
                          }`}
                          title={isSelected ? "Deselect specialist" : "Select for shortlist"}
                        >
                          <Check size={12} className="stroke-[3]" />
                        </button>
                      </td>

                      {/* Specialist & Role */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`h-9 w-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs ${
                              isTech
                                ? "bg-gradient-to-br from-blue-600 to-indigo-700 text-white"
                                : "bg-gradient-to-br from-emerald-600 to-teal-700 text-white"
                            }`}
                          >
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-display font-bold text-slate-900 text-sm group-hover:text-electric transition-colors truncate">
                                {cand.name}
                              </span>
                              <span className="text-[10px] font-mono font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200/80 shrink-0">
                                {cand.display_id || (cand.id.length > 12 ? `CAND-${cand.id.replace(/-/g, "").slice(-6).toUpperCase()}` : cand.id)}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 truncate mt-0.5 font-medium">
                              {cleanJobTitle(cand.title)}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Sector & Track */}
                      <td className="px-3 py-3">
                        <div className="flex flex-col gap-1 items-start">
                          <span
                            className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-bold border ${
                              isTech
                                ? "bg-blue-50 text-blue-700 border-blue-200/90"
                                : "bg-emerald-50 text-emerald-800 border-emerald-200/90"
                            }`}
                          >
                            {cand.sector}
                          </span>
                          {cand.verified ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200/80 px-1.5 py-0.5 rounded">
                              <CheckCircle size={10} />
                              <span>Vetted</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200/80 px-1.5 py-0.5 rounded">
                              <Clock size={10} />
                              <span>Intake in Progress</span>
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Experience & Rate */}
                      <td className="px-3 py-3">
                        <div className="flex flex-col">
                          {cand.rate && cand.rate !== "Negotiable" ? (
                            <span className="text-sm font-extrabold text-slate-900 font-mono tracking-tight">{cand.rate}</span>
                          ) : (
                            <span className="text-xs font-semibold text-slate-500 italic">Negotiable / Open</span>
                          )}
                          <span className="text-[11px] text-slate-500 font-medium capitalize">
                            {cand.experience}
                          </span>
                        </div>
                      </td>

                      {/* Availability */}
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-1.5">
                          <span className="relative flex h-2 w-2 shrink-0">
                            <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${
                              cand.availability === "Immediate" ? "bg-emerald-400 animate-ping" : "bg-amber-400"
                            }`} />
                            <span className={`relative inline-flex h-2 w-2 rounded-full ${
                              cand.availability === "Immediate" ? "bg-emerald-500" : "bg-amber-500"
                            }`} />
                          </span>
                          <span
                            className={`text-xs font-bold ${
                              cand.availability === "Immediate" ? "text-emerald-700" : "text-slate-800"
                            }`}
                          >
                            {cand.availability}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium block mt-0.5 truncate">
                          {cand.location || "Remote"}
                        </span>
                      </td>

                      {/* Key Verified Skills */}
                      <td className="px-3 py-3">
                        {cand.skills && cand.skills.length > 0 ? (
                          <div className="flex flex-wrap gap-1 max-w-[260px]">
                            {cand.skills.slice(0, 3).map((skill) => (
                              <span
                                key={skill}
                                className="rounded-md bg-slate-100 border border-slate-200/80 px-2 py-0.5 text-[11px] font-semibold text-slate-700"
                              >
                                {skill}
                              </span>
                            ))}
                            {cand.skills.length > 3 && (
                              <span className="rounded-md bg-slate-200/70 border border-slate-300/80 px-1.5 py-0.5 text-[10px] font-bold text-slate-600">
                                +{cand.skills.length - 3}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">Profile intake in progress</span>
                        )}
                      </td>

                      {/* ATS Match */}
                      <td className="px-3 py-3 text-center">
                        <span className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 border border-indigo-200/80 px-2.5 py-1 text-xs font-extrabold text-indigo-700 shadow-2xs">
                          {cand.semantic_score ? (
                            <>
                              <Sparkles size={11} className="text-indigo-600" />
                              <span>{cand.matchScore}</span>
                            </>
                          ) : (
                            <span>{cand.matchScore}</span>
                          )}
                        </span>
                      </td>

                      {/* Actions: STICKY RIGHT */}
                      <td
                        className="px-4 py-3 text-right sticky right-0 z-10 bg-white group-hover:bg-slate-50/95 transition-colors border-l border-slate-200 shadow-[-10px_0_12px_-4px_rgba(0,0,0,0.08)]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedCandidate(cand);
                              setDossierTab("profile");
                            }}
                            className="rounded-lg border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-100 text-slate-800 px-2.5 py-1.5 font-enterprise text-xs font-bold transition-all shadow-2xs inline-flex items-center gap-1 cursor-pointer"
                            title="View full candidate dossier"
                          >
                            <Eye size={12} className="text-electric" />
                            <span>Dossier</span>
                          </button>

                          <button
                            type="button"
                            onClick={(e) => toggleSelectCandidate(cand.id, e)}
                            className={`rounded-lg px-2.5 py-1.5 font-enterprise text-xs font-bold transition-all cursor-pointer border shadow-2xs inline-flex items-center gap-1 ${
                              isSelected
                                ? "border-electric bg-electric text-white"
                                : "border-electric/30 bg-electric/[0.06] hover:bg-electric/15 text-electric"
                            }`}
                            title={isSelected ? "Remove from shortlist" : "Add to shortlist"}
                          >
                            {isSelected ? (
                              <>
                                <Check size={11} className="stroke-[3]" />
                                <span>Shortlisted</span>
                              </>
                            ) : (
                              <span>+ Shortlist</span>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSourcingCandidate(cand);
                              if (pods.length > 0) setSourcingRequisitionId(pods[0].id);
                              setSourcingResult(null);
                            }}
                            className="rounded-lg bg-slate-900 hover:bg-black text-white px-2.5 py-1.5 font-enterprise text-xs font-bold transition-all shadow-2xs cursor-pointer inline-flex items-center gap-1"
                            title="Source candidate into requisition pipeline"
                          >
                            <UserPlus size={12} />
                            <span>Source</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Table Footer Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-200 bg-slate-50/80 px-4 py-3 text-xs text-slate-600 gap-2">
            <div>
              Showing <span className="font-extrabold text-slate-900">{displayedCandidates.length}</span> of{" "}
              <span className="font-extrabold text-slate-900">{candidates.length}</span> verified specialists
            </div>
            <div className="flex items-center gap-3">
              {selectedCandidateIds.length > 0 ? (
                <span className="font-bold text-electric">
                  {selectedCandidateIds.length} specialist{selectedCandidateIds.length > 1 ? "s" : ""} selected for client shortlist
                </span>
              ) : (
                <span className="text-slate-400 font-medium">Click any row or &lsquo;Dossier&rsquo; to review complete technical vetting dossier</span>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Grid Cards View */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayedCandidates.map((cand) => {
            const isSelected = selectedCandidateIds.includes(cand.id);
            const isTech = cand.sector === "Software Tech";

            return (
              <div
                key={cand.id}
                onClick={() => {
                  setSelectedCandidate(cand);
                  setDossierTab("profile");
                }}
                className={`rounded-2xl border p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-4 transition-all cursor-pointer group ${
                  isSelected
                    ? "border-electric ring-2 ring-electric/30 bg-electric/[0.03]"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-md"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      {/* Selection Checkbox */}
                      <button
                        type="button"
                        onClick={(e) => toggleSelectCandidate(cand.id, e)}
                        title={isSelected ? "Deselect specialist" : "Select for shortlist"}
                        className={`h-5 w-5 rounded-md border flex items-center justify-center transition-all cursor-pointer ${
                          isSelected
                            ? "bg-electric border-electric text-white shadow-2xs"
                            : "bg-white border-slate-300 hover:border-electric text-transparent"
                        }`}
                      >
                        <svg className="h-3 w-3 fill-current" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>

                      <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {cand.display_id || (cand.id.length > 12 ? `CAND-${cand.id.replace(/-/g, "").slice(-6).toUpperCase()}` : cand.id)}
                      </span>
                      {cand.verified ? (
                        <span className="flex items-center gap-1 rounded-md bg-emerald-50 border border-emerald-200 px-2 py-0.5 font-enterprise text-[10px] font-bold text-emerald-700">
                          <CheckCircle size={10} />
                          <span>Vetted Specialist</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 rounded-md bg-amber-50 border border-amber-200 px-2 py-0.5 font-enterprise text-[10px] font-semibold text-amber-700">
                          <Clock size={10} />
                          <span>Intake in Progress</span>
                        </span>
                      )}
                    </div>
                    <span className="rounded-lg bg-indigo-50 border border-indigo-200 px-2.5 py-1 font-enterprise text-xs font-extrabold text-indigo-700 flex items-center gap-1 shadow-2xs">
                      {cand.semantic_score ? (
                        <>
                          <Sparkles size={11} className="text-indigo-600" />
                          <span>AI Match {cand.matchScore}</span>
                        </>
                      ) : (
                        <span>Match {cand.matchScore}</span>
                      )}
                    </span>
                  </div>

                  <h2 className="mt-2.5 font-display text-base font-bold text-slate-900 group-hover:text-electric transition-colors">
                    {cand.name}
                  </h2>
                  <p className="text-xs text-slate-600 font-medium">{cand.title}</p>

                  <div className="mt-2.5 flex flex-wrap items-center gap-3 text-xs font-enterprise text-slate-500">
                    <span>
                      Exp: <strong className="text-slate-800 font-bold">{cand.experience}</strong>
                    </span>
                    <span>
                      Rate: <strong className="text-slate-900 font-extrabold font-mono">{cand.rate && cand.rate !== "Negotiable" ? cand.rate : "Negotiable"}</strong>
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      Avail: <strong className="text-emerald-700 font-bold">{cand.availability}</strong>
                    </span>
                    {cand.semantic_score && (
                      <span className="text-electric font-bold">
                        Vector Fit: {cand.semantic_score}%
                      </span>
                    )}
                  </div>

                  {/* Skills */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {cand.skills && cand.skills.length > 0 ? (
                      cand.skills.map((skill) => {
                        const isMatched = Array.isArray(cand.matched_skills) &&
                          cand.matched_skills.some(ms => ms.toLowerCase() === skill.toLowerCase());
                        return (
                          <span
                            key={skill}
                            className={`rounded-md px-2 py-0.5 font-enterprise text-[11px] border transition-colors ${
                              isMatched
                                ? "bg-electric/15 text-electric border-electric/40 font-bold"
                                : "bg-slate-100 text-slate-700 border-slate-200 font-medium"
                            }`}
                          >
                            {skill} {isMatched && "✓"}
                          </span>
                        );
                      })
                    ) : (
                      <span className="text-[11px] text-slate-400 italic">Profile intake in progress</span>
                    )}
                  </div>

                  {/* Explainability Factors */}
                  {Array.isArray(cand.positive_factors) && cand.positive_factors.length > 0 && (
                    <div className="mt-3.5 pt-3 border-t border-slate-100 space-y-1.5">
                      <div className="font-enterprise text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                        AI Fit Rationale
                      </div>
                      <div className="space-y-1">
                        {cand.positive_factors.slice(0, 2).map((factor, fIdx) => (
                          <div
                            key={fIdx}
                            className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-medium bg-emerald-50/60 px-2 py-0.5 rounded-md border border-emerald-100"
                          >
                            <CheckCircle2 size={11} className="shrink-0" />
                            <span className="line-clamp-1">{factor}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div
                  className="border-t border-slate-100 pt-3 flex items-center justify-between gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCandidate(cand);
                      setDossierTab("profile");
                    }}
                    className="rounded-lg border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-100 px-3 py-1.5 font-enterprise text-xs font-bold text-slate-800 transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Eye size={12} className="text-electric" />
                    <span>View Dossier</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => toggleSelectCandidate(cand.id, e)}
                      className={`rounded-lg px-3 py-1.5 font-enterprise text-xs font-bold transition-colors cursor-pointer border shadow-2xs ${
                        isSelected
                          ? "border-electric bg-electric text-white"
                          : "border-electric/30 bg-electric/[0.06] hover:bg-electric/15 text-electric"
                      }`}
                    >
                      {isSelected ? "Shortlisted ✓" : "+ Shortlist"}
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSourcingCandidate(cand);
                        if (pods.length > 0) setSourcingRequisitionId(pods[0].id);
                        setSourcingResult(null);
                      }}
                      className="rounded-lg bg-slate-900 hover:bg-black text-white px-3 py-1.5 font-enterprise text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center gap-1.5"
                      title="Source candidate into requisition pipeline"
                    >
                      <UserPlus size={13} />
                      <span>Source</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Floating Sticky Shortlist Action Bar */}
      {selectedCandidateIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-2xl px-4 animate-in slide-in-from-bottom-4 duration-200">
          <div className="rounded-2xl border border-electric/40 bg-ink/95 backdrop-blur-md p-3.5 sm:p-4 text-white shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-electric text-white font-enterprise text-sm font-bold shadow-xs">
                {selectedCandidateIds.length}
              </div>
              <div>
                <p className="font-display text-sm font-bold text-white">
                  {selectedCandidateIds.length} Specialist{selectedCandidateIds.length > 1 ? "s" : ""} Selected
                </p>
                <p className="text-[11px] text-white/70">
                  Ready for client delivery package (Email, IM, or ATS CSV)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={clearSelection}
                className="rounded-xl border border-white/20 bg-white/5 px-3 py-2 font-display text-xs font-semibold text-white/80 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsShortlistDrawerOpen(true);
                  setSubmissionSuccess(null);
                }}
                className="rounded-xl bg-electric px-4 py-2 font-display text-xs font-bold text-white hover:bg-electric-bright shadow-xs transition-colors inline-flex items-center gap-2 cursor-pointer"
              >
                <FileText size={14} />
                <span>Build Client Submission →</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Shortlist Builder & Client Submission Sheet Drawer (Right-Side Drawer UX Invariant) */}
      {isShortlistDrawerOpen && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-ink/40 backdrop-blur-xs animate-in fade-in-0 duration-150"
          onClick={() => setIsShortlistDrawerOpen(false)}
        >
          <div
            className="w-full md:w-1/2 lg:w-1/2 md:max-w-[50vw] bg-white h-full shadow-2xl p-6 sm:p-8 flex flex-col justify-between overflow-y-auto thin-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-start justify-between border-b border-[#bcd6fa]/40 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-enterprise text-xs font-bold text-electric uppercase tracking-wider">
                      CLIENT SUBMISSION PACKAGE
                    </span>
                  </div>
                  <h2 className="mt-1 font-display text-xl font-bold text-ink">
                    Client Shortlist &amp; Submission Package
                  </h2>
                  <p className="text-xs text-ink-soft">
                    Assemble and export a branded dossier package for direct client transmission via Email, IM, or ATS upload.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsShortlistDrawerOpen(false)}
                  className="rounded-lg p-1.5 text-mist hover:text-ink hover:bg-canvas transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Submission Success Alert */}
              {submissionSuccess && (
                <div className="rounded-2xl border border-signal/30 bg-signal/10 p-4 text-xs text-signal space-y-1.5 animate-in fade-in-0">
                  <div className="flex items-center gap-2 font-bold font-display text-sm">
                    <CheckCircle size={16} />
                    <span>Submission Package Logged to ATS</span>
                  </div>
                  <p className="text-signal/90 leading-relaxed">
                    Submission package <strong>SUB-{submissionSuccess.id}</strong> recorded at {submissionSuccess.timestamp}. Candidates have been transitioned to <strong>Interview / Submitted to Client</strong> with audit logging.
                  </p>
                </div>
              )}

              {/* Navigation Tabs */}
              <div className="flex gap-2 border-b border-[#bcd6fa]/30 pb-2">
                {[
                  { id: "setup", label: "1. Package Setup & Privacy" },
                  { id: "roster", label: `2. Selected Roster (${selectedCandidates.length})` },
                  { id: "preview", label: "3. Live Client Preview" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setShortlistTab(tab.id as any)}
                    className={`rounded-xl px-3.5 py-1.5 font-display text-xs font-semibold transition-all cursor-pointer ${
                      shortlistTab === tab.id
                        ? "bg-ink text-white shadow-xs"
                        : "bg-white border border-[#bcd6fa]/60 text-ink-soft hover:text-ink hover:bg-canvas"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab 1: Package Setup & Privacy Masking */}
              {shortlistTab === "setup" && (
                <div className="space-y-5 text-xs">
                  {/* Requisition & Client */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-enterprise text-[11px] uppercase tracking-wider text-mist mb-1">
                        Target Requisition *
                      </label>
                      <select
                        value={targetRequisitionId}
                        onChange={(e) => setTargetRequisitionId(e.target.value)}
                        className="w-full rounded-xl border border-[#bcd6fa] bg-white p-2.5 font-medium text-ink focus:border-electric focus:outline-hidden"
                      >
                        {pods.length > 0 ? (
                          pods.map((p) => (
                            <option key={p.id} value={p.id}>
                              {cleanJobTitle(p.name)} ({p.clientName || "Enterprise Client"})
                            </option>
                          ))
                        ) : (
                          <option value="">No active requisitions found</option>
                        )}
                        <option value="custom">Custom Client Requisition</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-enterprise text-[11px] uppercase tracking-wider text-mist mb-1">
                        Client Organization Name *
                      </label>
                      <input
                        type="text"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="e.g. Apex Health Systems"
                        className="w-full rounded-xl border border-[#bcd6fa] bg-white p-2.5 font-medium text-ink focus:border-electric focus:outline-hidden"
                      />
                    </div>
                  </div>

                  {/* Delivery Channel */}
                  <div>
                    <label className="block font-enterprise text-[11px] uppercase tracking-wider text-mist mb-1.5">
                      Delivery Channel
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: "email", label: "Email Pitch", icon: "✉" },
                        { id: "im", label: "Instant Msg (Slack)", icon: "💬" },
                        { id: "client_ats", label: "Client ATS (CSV)", icon: "📊" },
                        { id: "portal", label: "PDF Brief", icon: "📄" },
                      ].map((ch) => (
                        <button
                          key={ch.id}
                          type="button"
                          onClick={() => setDeliveryChannel(ch.id as any)}
                          className={`rounded-xl border p-2.5 text-center transition-all cursor-pointer ${
                            deliveryChannel === ch.id
                              ? "border-electric bg-electric/10 text-electric font-bold shadow-2xs"
                              : "border-[#bcd6fa]/60 bg-white text-ink-soft hover:bg-canvas"
                          }`}
                        >
                          <div className="text-base mb-1">{ch.icon}</div>
                          <div className="font-display text-[11px]">{ch.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Data Masking & Escrow Protection Toggles (ATS-06, AC-06) */}
                  <div className="rounded-2xl border border-[#bcd6fa]/80 bg-canvas/50 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ShieldCheck size={16} className="text-electric" />
                        <span className="font-display font-bold text-ink">
                          Privacy &amp; Escrow Contact Masking
                        </span>
                      </div>
                      <span className="rounded-full bg-signal/10 px-2 py-0.5 font-enterprise text-[10px] font-bold text-signal">
                        Placement Safe
                      </span>
                    </div>

                    <p className="text-[11px] text-ink-soft leading-relaxed">
                      Mask direct candidate contact details (email and phone) to safeguard Pepoltek placement attribution and escrow terms until client approves interview slots.
                    </p>

                    <div className="space-y-2.5 pt-1">
                      <label className="flex items-center justify-between cursor-pointer rounded-xl bg-white p-2.5 border border-[#bcd6fa]/50">
                        <span className="font-medium text-ink">
                          Mask Direct Candidate Email &amp; Phone (Default ON)
                        </span>
                        <input
                          type="checkbox"
                          checked={maskContact}
                          onChange={(e) => setMaskContact(e.target.checked)}
                          className="h-4 w-4 rounded-sm border-mist text-electric focus:ring-electric cursor-pointer"
                        />
                      </label>

                      <label className="flex items-center justify-between cursor-pointer rounded-xl bg-white p-2.5 border border-[#bcd6fa]/50">
                        <span className="font-medium text-ink">
                          Include Verified Vetting Scores &amp; Rubrics
                        </span>
                        <input
                          type="checkbox"
                          checked={includeVetting}
                          onChange={(e) => setIncludeVetting(e.target.checked)}
                          className="h-4 w-4 rounded-sm border-mist text-electric focus:ring-electric cursor-pointer"
                        />
                      </label>

                      <label className="flex items-center justify-between cursor-pointer rounded-xl bg-white p-2.5 border border-[#bcd6fa]/50">
                        <span className="font-medium text-ink">
                          Include Hourly Billing Rates &amp; Sprint Budget
                        </span>
                        <input
                          type="checkbox"
                          checked={includeRates}
                          onChange={(e) => setIncludeRates(e.target.checked)}
                          className="h-4 w-4 rounded-sm border-mist text-electric focus:ring-electric cursor-pointer"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Pitch Notes */}
                  <div>
                    <label className="block font-enterprise text-[11px] uppercase tracking-wider text-mist mb-1">
                      Recruiter Executive Pitch Notes *
                    </label>
                    <textarea
                      rows={3}
                      value={pitchNotes}
                      onChange={(e) => setPitchNotes(e.target.value)}
                      placeholder="Add tailored pitch notes summarizing why this squad matches the client technical requirements..."
                      className="w-full rounded-xl border border-[#bcd6fa] bg-white p-2.5 font-medium text-ink focus:border-electric focus:outline-hidden"
                    />
                  </div>
                </div>
              )}

              {/* Tab 2: Selected Specialists Roster */}
              {shortlistTab === "roster" && (
                <div className="space-y-4 text-xs">
                  {/* Summary Bar */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-xl border border-[#bcd6fa]/60 bg-canvas/40 p-3">
                      <div className="font-enterprise text-[10px] text-mist uppercase">Headcount</div>
                      <div className="font-display text-lg font-bold text-ink">
                        {selectedCandidates.length} Specialists
                      </div>
                    </div>
                    <div className="rounded-xl border border-[#bcd6fa]/60 bg-canvas/40 p-3">
                      <div className="font-enterprise text-[10px] text-mist uppercase">Deployment SLA</div>
                      <div className="font-display text-lg font-bold text-signal">
                        7-Day Sprint
                      </div>
                    </div>
                    <div className="rounded-xl border border-[#bcd6fa]/60 bg-canvas/40 p-3">
                      <div className="font-enterprise text-[10px] text-mist uppercase">Guarantee</div>
                      <div className="font-display text-lg font-bold text-ink">
                        90 Days Replacement
                      </div>
                    </div>
                  </div>

                  {/* Candidate List */}
                  {selectedCandidates.length === 0 ? (
                    <div className="rounded-2xl border border-[#bcd6fa] bg-white p-8 text-center">
                      <p className="font-display font-semibold text-ink">No Specialists Selected</p>
                      <p className="text-mist text-xs mt-1">
                        Please check candidates from the directory to add them to this shortlist package.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {selectedCandidates.map((c) => (
                        <div
                          key={c.id}
                          className="rounded-xl border border-[#bcd6fa] bg-white p-3.5 shadow-2xs flex items-center justify-between gap-3"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-enterprise text-xs font-bold text-electric">
                                {c.id}
                              </span>
                              <span className="font-display font-bold text-ink text-sm">
                                {c.name}
                              </span>
                              <span className="rounded-md bg-electric/10 px-1.5 py-0.5 font-enterprise text-[10px] font-bold text-electric">
                                Match {c.matchScore}
                              </span>
                            </div>
                            <p className="text-xs text-ink-soft">
                              {c.title} • {c.experience} • {c.rate}
                            </p>
                            <div className="flex flex-wrap gap-1 pt-1">
                              {c.skills.slice(0, 4).map((s) => (
                                <span
                                  key={s}
                                  className="rounded-sm bg-canvas px-1.5 py-0.5 font-enterprise text-[10px] text-ink"
                                >
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => toggleSelectCandidate(c.id)}
                            className="rounded-lg p-1.5 text-mist hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            title="Remove from shortlist"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tab 3: Live Branded Client Preview */}
              {shortlistTab === "preview" && (
                <div className="space-y-4 text-xs">
                  <div className="rounded-2xl border border-[#bcd6fa] bg-canvas/30 p-5 space-y-4 font-sans">
                    {/* Branded Header */}
                    <div className="flex items-center justify-between border-b border-[#bcd6fa]/50 pb-3">
                      <div>
                        <div className="font-display text-sm font-bold tracking-tight text-ink">
                          PEPOLTEK LIMITED
                        </div>
                        <div className="font-enterprise text-[10px] text-mist">
                          Client Submission Package • Sprint SLA
                        </div>
                      </div>
                      <span className="rounded-md bg-ink px-2.5 py-1 font-enterprise text-[10px] font-bold text-white uppercase">
                        CONFIDENTIAL
                      </span>
                    </div>

                    {/* Metadata Summary */}
                    <div className="grid grid-cols-2 gap-3 text-xs bg-white p-3 rounded-xl border border-[#bcd6fa]/40">
                      <div>
                        <span className="text-mist block text-[10px] font-enterprise uppercase">
                          Target Requisition:
                        </span>
                        <span className="font-semibold text-ink">
                          {targetRequisitionId || "Sprint Requisition"}
                        </span>
                      </div>
                      <div>
                        <span className="text-mist block text-[10px] font-enterprise uppercase">
                          Client Organization:
                        </span>
                        <span className="font-semibold text-ink">{clientName}</span>
                      </div>
                    </div>

                    {/* Pitch Notes */}
                    <div className="bg-white p-3 rounded-xl border border-[#bcd6fa]/40 space-y-1">
                      <span className="text-mist block text-[10px] font-enterprise uppercase">
                        Recruiter Executive Pitch:
                      </span>
                      <p className="text-ink leading-relaxed font-medium">{pitchNotes}</p>
                    </div>

                    {/* Candidate Preview Cards */}
                    <div className="space-y-2">
                      <span className="text-mist block text-[10px] font-enterprise uppercase">
                        Shortlisted Specialists ({selectedCandidates.length}):
                      </span>

                      {selectedCandidates.map((c, idx) => (
                        <div
                          key={c.id}
                          className="bg-white p-3.5 rounded-xl border border-[#bcd6fa]/60 space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-display font-bold text-ink text-sm">
                                {idx + 1}. {c.name}
                              </span>
                              <span className="text-ink-soft text-xs ml-2">({c.title})</span>
                            </div>
                            {includeVetting && (
                              <span className="rounded-md bg-signal/10 px-2 py-0.5 font-enterprise text-[10px] font-bold text-signal">
                                Vetting: {c.matchScore} Pass
                              </span>
                            )}
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-mist font-enterprise">
                            <span>Exp: <strong className="text-ink">{c.experience}</strong></span>
                            {includeRates && (
                              <span>Rate: <strong className="text-ink">{c.rate}</strong></span>
                            )}
                            <span>Avail: <strong className="text-signal">{c.availability}</strong></span>
                          </div>

                          <div className="text-[11px]">
                            <span className="text-mist">Core Stack: </span>
                            <span className="font-medium text-ink">{c.skills.join(", ")}</span>
                          </div>

                          {/* Contact display */}
                          <div className="text-[11px] pt-1 border-t border-[#bcd6fa]/30">
                            <span className="text-mist">Contact: </span>
                            {maskContact ? (
                              <span className="font-enterprise text-electric font-semibold">
                                [Protected by Pepoltek Escrow • Schedule via Staffing Lead]
                              </span>
                            ) : (
                              <span className="font-enterprise text-ink">
                                {c.email || "direct@pepoltek.com"} • {c.phone || "+1 (555) 019-2834"}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Footer Guarantee */}
                    <div className="border-t border-[#bcd6fa]/40 pt-3 flex flex-wrap items-center justify-between text-[10px] font-enterprise text-mist">
                      <span>7-Day Sprint Deployment SLA</span>
                      <span>FDIC Insured Escrow</span>
                      <span>90-Day Replacement Guarantee</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Drawer Footer Actions */}
            <div className="pt-5 border-t border-[#bcd6fa]/40 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setIsShortlistDrawerOpen(false)}
                className="w-full sm:w-auto rounded-xl border border-[#bcd6fa] px-4 py-2 font-display text-xs font-semibold text-ink-soft hover:bg-canvas transition-colors cursor-pointer"
              >
                Close Drawer
              </button>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={handleCopyPitch}
                  className="rounded-xl border border-[#bcd6fa] bg-white px-3.5 py-2 font-display text-xs font-semibold text-ink hover:bg-canvas transition-colors cursor-pointer inline-flex items-center gap-1.5"
                >
                  <span>Copy IM / Text Pitch</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadCsv}
                  className="rounded-xl border border-[#bcd6fa] bg-white px-3.5 py-2 font-display text-xs font-semibold text-ink hover:bg-canvas transition-colors cursor-pointer inline-flex items-center gap-1.5"
                >
                  <span>Download ATS CSV</span>
                </button>

                <button
                  type="button"
                  disabled={isSubmittingShortlist || selectedCandidates.length === 0}
                  onClick={handleSubmitShortlist}
                  className="rounded-xl bg-electric px-5 py-2 font-display text-xs font-bold text-white shadow-xs hover:bg-electric-bright transition-colors cursor-pointer disabled:opacity-50 inline-flex items-center gap-2"
                >
                  {isSubmittingShortlist ? (
                    <span>Logging to ATS...</span>
                  ) : (
                    <span>Submit Shortlist to Client →</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Candidate Dossier Slide-Over Sheet (Right-Side Drawer UX Invariant) */}
      {selectedCandidate && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-ink/40 backdrop-blur-xs animate-in fade-in-0 duration-150"
          onClick={() => setSelectedCandidate(null)}
        >
          <div
            className="w-full md:w-1/2 lg:w-1/2 md:max-w-[50vw] bg-white h-full shadow-2xl p-6 sm:p-8 flex flex-col justify-between overflow-y-auto thin-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-6">
              {/* Dossier Header */}
              <div className="flex items-start justify-between border-b border-[#bcd6fa]/40 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-enterprise text-xs font-bold text-electric">
                      {selectedCandidate.id}
                    </span>
                    {selectedCandidate.verified && (
                      <span className="rounded-full bg-signal/10 px-2 py-0.5 font-enterprise text-[10px] font-bold text-signal">
                        Verified Vetted
                      </span>
                    )}
                  </div>
                  <h2 className="mt-1 font-display text-xl font-bold text-ink">
                    {selectedCandidate.name}
                  </h2>
                  <p className="text-xs text-ink-soft">
                    {selectedCandidate.title} • {selectedCandidate.sector}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedCandidate(null)}
                  className="rounded-lg p-1.5 text-mist hover:text-ink hover:bg-canvas transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* 5 Core Candidate Benchmarks (CAN-08 & Business SRS 4.2) */}
              <CandidateBenchmarkScores
                readinessIndex={selectedCandidate.readinessIndex || selectedCandidate.profileStrength || 88}
                atsCompatibilityScore={selectedCandidate.cvScore || 90}
                technicalVettingScore={selectedCandidate.vettingScore || 92}
                readinessTier={selectedCandidate.readinessTier || "Tier 2: Screened Specialist"}
                requisitionFitScore={parseInt(selectedCandidate.matchScore) || 95}
                track={selectedCandidate.sector === "Healthcare" ? "healthcare" : "technology"}
                variant="dossier"
              />

              {/* Dossier Tabs */}
              <div className="flex gap-2 border-b border-[#bcd6fa]/30 pb-2">
                {[
                  { id: "profile", label: "Profile & CV" },
                  { id: "vetting", label: "Technical Vetting" },
                  { id: "compliance", label: "Compliance Vault" },
                  { id: "actions", label: "Requisition Assignment" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setDossierTab(tab.id as any)}
                    className={`rounded-xl px-3.5 py-1.5 font-display text-xs font-semibold transition-all cursor-pointer ${
                      dossierTab === tab.id
                        ? "bg-ink text-white shadow-xs"
                        : "bg-white border border-[#bcd6fa]/60 text-ink-soft hover:text-ink hover:bg-canvas"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab 1: Profile & CV */}
              {dossierTab === "profile" && (
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="rounded-xl border border-[#bcd6fa]/60 bg-canvas/40 p-3">
                      <div className="font-enterprise text-[10px] text-mist uppercase">Experience</div>
                      <div className="font-display font-bold text-ink mt-0.5">{selectedCandidate.experience}</div>
                    </div>
                    <div className="rounded-xl border border-[#bcd6fa]/60 bg-canvas/40 p-3">
                      <div className="font-enterprise text-[10px] text-mist uppercase">Hourly Rate</div>
                      <div className="font-display font-bold text-ink mt-0.5">{selectedCandidate.rate}</div>
                    </div>
                    <div className="rounded-xl border border-[#bcd6fa]/60 bg-canvas/40 p-3">
                      <div className="font-enterprise text-[10px] text-mist uppercase">Availability</div>
                      <div className="font-display font-bold text-signal mt-0.5">{selectedCandidate.availability}</div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-[#bcd6fa]/60 p-4 space-y-2">
                    <div className="font-enterprise text-[10px] text-mist uppercase tracking-wider">
                      Engagement &amp; Location
                    </div>
                    <p className="font-medium text-ink">
                      Location: {selectedCandidate.location || "100% Remote (US/EU/Global)"}
                    </p>
                    <p className="text-ink-soft">
                      Work Auth: W2 Contract, C2C Corp-to-Corp, 1099 Specialist
                    </p>
                  </div>

                  <div className="rounded-xl border border-[#bcd6fa]/60 p-4 space-y-2.5">
                    <div className="font-enterprise text-[10px] text-mist uppercase tracking-wider">
                      Verified Technical Skills
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedCandidate.skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-md bg-canvas px-2.5 py-1 font-enterprise text-xs font-medium text-ink border border-[#bcd6fa]/50"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl border border-[#bcd6fa]/60 p-4 space-y-2">
                    <div className="font-enterprise text-[10px] text-mist uppercase tracking-wider">
                      Recruiter Assessment Summary
                    </div>
                    <p className="text-ink-soft leading-relaxed">
                      {selectedCandidate.notes ||
                        "Candidate passed Pepoltek standardized technical vetting with top scores in distributed systems, real-time concurrency, and enterprise compliance."}
                    </p>
                  </div>
                </div>
              )}

              {/* Tab 2: Technical Vetting */}
              {dossierTab === "vetting" && (
                <div className="space-y-4 text-xs">
                  <div className="rounded-xl border border-electric/30 bg-electric/5 p-4 flex items-center justify-between">
                    <div>
                      <span className="font-enterprise text-[10px] uppercase font-bold text-electric">
                        Comprehensive Match Fit
                      </span>
                      <div className="font-display text-2xl font-bold text-ink">
                        {selectedCandidate.matchScore} Fit Score
                      </div>
                    </div>
                    <div className="rounded-full bg-signal/10 px-3 py-1 font-enterprise text-xs font-bold text-signal">
                      Passed Technical Screen
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    {[
                      { rubric: "System Architecture & Scalability", score: "96 / 100", status: "Verified" },
                      { rubric: "Concurrency & Core Algorithms", score: "94 / 100", status: "Verified" },
                      { rubric: "Enterprise Security & HIPAA/PCI", score: "100 / 100", status: "Verified" },
                      { rubric: "Team Collaboration & Agile Velocity", score: "92 / 100", status: "Verified" },
                    ].map((item) => (
                      <div
                        key={item.rubric}
                        className="rounded-xl border border-[#bcd6fa]/60 bg-white p-3 flex items-center justify-between"
                      >
                        <div>
                          <p className="font-display font-semibold text-ink">{item.rubric}</p>
                          <p className="text-[11px] text-mist font-enterprise">Assessed by Senior Lead Architect</p>
                        </div>
                        <div className="text-right">
                          <span className="font-enterprise font-bold text-electric">{item.score}</span>
                          <span className="block text-[10px] font-enterprise text-signal">{item.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 3: Compliance Vault */}
              {dossierTab === "compliance" && (
                <div className="space-y-4 text-xs">
                  <div className="rounded-xl border border-[#bcd6fa]/60 bg-canvas/30 p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={16} className="text-signal" />
                      <span className="font-display font-bold text-ink">
                        Enterprise Clearance Status
                      </span>
                    </div>
                    <p className="text-ink-soft text-[11px] leading-relaxed">
                      All identity verification, right-to-work checks, and background screening are secured in the Pepoltek encrypted vault.
                    </p>
                  </div>

                  <div className="space-y-2">
                    {[
                      { doc: "Government Issued Photo ID", state: "Verified Active", date: "Oct 2026" },
                      { doc: "Right to Work Verification (I-9 / Visa)", state: "Compliant W2/C2C", date: "Oct 2026" },
                      { doc: "HIPAA / Security Safeguards Attestation", state: "Signed", date: "Oct 2026" },
                      { doc: "Criminal Background & Direct Reference", state: "Cleared (Tier 1)", date: "Oct 2026" },
                    ].map((row) => (
                      <div
                        key={row.doc}
                        className="rounded-xl border border-[#bcd6fa]/60 p-3 flex items-center justify-between"
                      >
                        <div>
                          <p className="font-display font-semibold text-ink">{row.doc}</p>
                          <p className="text-[11px] text-mist font-enterprise">Recorded: {row.date}</p>
                        </div>
                        <span className="rounded-full bg-signal/10 px-2.5 py-0.5 font-enterprise text-[10px] font-bold text-signal">
                          {row.state}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 4: Requisition Assignment Actions */}
              {dossierTab === "actions" && (
                <div className="space-y-4 text-xs">
                  <div className="rounded-xl border border-[#bcd6fa]/60 p-4 space-y-3">
                    <div className="font-display font-bold text-ink text-sm">
                      Immediate Sprint Actions
                    </div>
                    <p className="text-ink-soft leading-relaxed">
                      Assign this candidate directly to an active client requisition or schedule a client interview.
                    </p>

                    <div className="space-y-2 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSourcingCandidate(selectedCandidate);
                          if (pods.length > 0) setSourcingRequisitionId(pods[0].id);
                          setSourcingResult(null);
                        }}
                        className="w-full rounded-xl bg-electric py-2.5 font-display text-xs font-bold text-white shadow-xs hover:bg-electric-bright transition-colors cursor-pointer flex items-center justify-center gap-2"
                      >
                        <UserPlus size={14} />
                        <span>Source for Requisition Pipeline</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          handleAddToPod(selectedCandidate);
                          setSelectedCandidate(null);
                        }}
                        className="w-full rounded-xl bg-ink py-2.5 font-display text-xs font-bold text-white shadow-xs hover:bg-electric transition-colors cursor-pointer"
                      >
                        + Add to Active Shortlist
                      </button>

                      <Link
                        href="/recruiter/interviews"
                        className="block w-full text-center rounded-xl border border-[#bcd6fa] bg-white py-2.5 font-display text-xs font-semibold text-ink hover:bg-canvas transition-colors"
                      >
                        Schedule Client Interview Slot
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Dossier Footer */}
            <div className="pt-4 border-t border-[#bcd6fa]/40 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setSelectedCandidate(null)}
                className="rounded-xl border border-[#bcd6fa] px-4 py-2 font-display text-xs font-semibold text-ink-soft hover:bg-canvas transition-colors cursor-pointer"
              >
                Close
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    handleAddToPod(selectedCandidate);
                    setSelectedCandidate(null);
                  }}
                  className="rounded-xl bg-ink px-4 py-2 font-display text-xs font-semibold text-white shadow-xs hover:bg-electric transition-colors cursor-pointer"
                >
                  + Add to Shortlist
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Right-Side Sheet Drawer: Candidate Sourcing (Stage 2: Market Mapping) */}
      {sourcingCandidate && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-ink/50 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between border-l border-[#bcd6fa] animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="p-6 border-b border-[#bcd6fa]/40 bg-canvas/30 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-enterprise text-xs font-bold text-electric uppercase tracking-wider">
                    RECRUITER SOURCING
                  </span>
                  <span className="rounded-full bg-signal/10 px-2 py-0.5 font-enterprise text-[10px] font-bold text-signal">
                    STAGE 2: MARKET MAPPING
                  </span>
                </div>
                <h3 className="mt-1 font-display text-lg font-bold text-ink">
                  Source {sourcingCandidate.name}
                </h3>
                <p className="text-xs text-ink-soft">
                  {sourcingCandidate.title} · {sourcingCandidate.sector} · Match Fit: {sourcingCandidate.matchScore}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSourcingCandidate(null)}
                className="rounded-lg p-1.5 text-mist hover:text-ink hover:bg-canvas transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Drawer Content Form */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
              {sourcingResult ? (
                <div
                  className={`rounded-2xl p-4 border ${
                    sourcingResult.type === "success"
                      ? "border-signal/30 bg-signal/10 text-signal"
                      : "border-red-200 bg-red-50 text-red-700"
                  }`}
                >
                  <p className="font-display font-bold text-sm">
                    {sourcingResult.type === "success" ? "Candidate Successfully Sourced!" : "Sourcing Notice"}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed">{sourcingResult.message}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Target Requisition Selector */}
                  <div className="space-y-1">
                    <label className="font-enterprise text-[11px] font-bold text-ink block">
                      Target Client Requisition <span className="text-red-500">*</span>
                    </label>
                    {pods.length === 0 ? (
                      <div className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-amber-900 text-xs">
                        No active requisitions found. Please create an active requisition first.
                      </div>
                    ) : (
                      <select
                        value={sourcingRequisitionId}
                        onChange={(e) => setSourcingRequisitionId(e.target.value)}
                        className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/30 px-3.5 py-2.5 text-xs text-ink focus:border-electric focus:bg-white focus:outline-none"
                      >
                        {pods.map((p) => (
                          <option key={p.id} value={p.id}>
                            {cleanJobTitle(p.name)} ({p.clientName || "Enterprise Client"} · {p.budgetMin ? `$${p.budgetMin}-$${p.budgetMax}/hr` : "Market Rate"})
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  {/* Sourcing Notes */}
                  <div className="space-y-1">
                    <label className="font-enterprise text-[11px] font-bold text-ink block">
                      Recruiter Sourcing Evaluation Notes
                    </label>
                    <textarea
                      rows={4}
                      value={sourcingNote}
                      onChange={(e) => setSourcingNote(e.target.value)}
                      placeholder="Add recruiter rationale, relevant past accomplishments, and why this candidate fits the requisition requirements..."
                      className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/30 px-3.5 py-2.5 text-xs text-ink focus:border-electric focus:bg-white focus:outline-none"
                    />
                  </div>

                  {/* Pipeline Context Alert */}
                  <div className="rounded-2xl border border-electric/30 bg-electric/5 p-4 space-y-2">
                    <div className="flex items-center gap-2 text-electric font-display font-bold">
                      <ShieldCheck size={16} />
                      <span>Pipeline Stage Synchronization</span>
                    </div>
                    <p className="text-ink-soft leading-relaxed text-[11.5px]">
                      Sourcing attaches this candidate to the requisition under <strong>Market Mapping (Sourced)</strong>. The candidate will appear in the requisition pipeline Kanban, and their dashboard will reflect this assignment.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-6 border-t border-[#bcd6fa]/40 bg-canvas/30 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setSourcingCandidate(null)}
                className="rounded-xl border border-[#bcd6fa] px-4 py-2.5 font-display text-xs font-semibold text-ink-soft hover:bg-canvas transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSourceCandidate}
                disabled={isSourcingSubmitting || pods.length === 0 || !!sourcingResult}
                className="rounded-xl bg-electric px-5 py-2.5 font-display text-xs font-bold text-white shadow-xs hover:bg-electric-bright disabled:opacity-50 transition-all cursor-pointer flex items-center gap-2"
              >
                {isSourcingSubmitting ? (
                  <span>Sourcing Candidate...</span>
                ) : (
                  <>
                    <UserPlus size={14} />
                    <span>Attach to Pipeline</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
