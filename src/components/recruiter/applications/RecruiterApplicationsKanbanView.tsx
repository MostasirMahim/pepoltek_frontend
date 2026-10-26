"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  PipelineCandidateItem,
  PipelineStagesData,
  moveCandidateStageAction,
  getRecruiterPipelineAction,
  scheduleInterviewAction,
  createShortlistSubmissionAction,
  ShortlistSubmissionItemInput,
  ClientItem,
} from "@/actions/recruiter.actions";
import { RecruiterPod } from "@/types/recruiter.types";
import {
  Kanban,
  Columns3,
  Search,
  Users,
  Briefcase,
  CheckCircle,
  Clock,
  ShieldCheck,
  Zap,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Plus,
  X,
  FileText,
  Mail,
  Phone,
  Calendar,
  Check,
  AlertCircle,
  Building2,
  Download,
  Share2,
} from "@/components/ui/Icons";

interface Props {
  initialPipeline: PipelineStagesData;
  requisitions: RecruiterPod[];
  clients: ClientItem[];
}

type StageKey = "discovery" | "market_mapping" | "technical_vetting" | "interview" | "closed";

interface StageDefinition {
  key: StageKey;
  label: string;
  badge: string;
  color: string;
  bgLight: string;
  border: string;
  headerBg: string;
  dotColor: string;
}

const STAGES: StageDefinition[] = [
  {
    key: "discovery",
    label: "Discovery",
    badge: "1 - Discovery",
    color: "text-sky-800",
    bgLight: "bg-sky-50/70",
    border: "border-sky-200",
    headerBg: "bg-sky-100/80 text-sky-900",
    dotColor: "bg-sky-500",
  },
  {
    key: "market_mapping",
    label: "Market Mapping",
    badge: "2 - Sourced",
    color: "text-blue-800",
    bgLight: "bg-blue-50/70",
    border: "border-blue-200",
    headerBg: "bg-blue-100/80 text-blue-900",
    dotColor: "bg-blue-600",
  },
  {
    key: "technical_vetting",
    label: "Technical Vetting",
    badge: "3 - Vetting",
    color: "text-indigo-800",
    bgLight: "bg-indigo-50/70",
    border: "border-indigo-200",
    headerBg: "bg-indigo-100/80 text-indigo-900",
    dotColor: "bg-indigo-600",
  },
  {
    key: "interview",
    label: "Client Interview",
    badge: "4 - Interview",
    color: "text-amber-800",
    bgLight: "bg-amber-50/70",
    border: "border-amber-200",
    headerBg: "bg-amber-100/80 text-amber-900",
    dotColor: "bg-amber-500",
  },
  {
    key: "closed",
    label: "Closed / Placed",
    badge: "5 - Placed",
    color: "text-emerald-800",
    bgLight: "bg-emerald-50/70",
    border: "border-emerald-200",
    headerBg: "bg-emerald-100/80 text-emerald-900",
    dotColor: "bg-emerald-600",
  },
];

export function RecruiterApplicationsKanbanView({
  initialPipeline,
  requisitions,
  clients,
}: Props) {
  const [pipeline, setPipeline] = useState<PipelineStagesData>(initialPipeline);
  const [viewMode, setViewMode] = useState<"kanban" | "table">("kanban");

  // Filters
  const [selectedReqId, setSelectedReqId] = useState<string>("all");
  const [selectedSector, setSelectedSector] = useState<string>("all");
  const [selectedSource, setSelectedSource] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Toast notification
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Shortlist Builder Selection State
  const [selectedAppIds, setSelectedAppIds] = useState<Set<string>>(new Set());
  const [isShortlistDrawerOpen, setIsShortlistDrawerOpen] = useState(false);
  const [shortlistClient, setShortlistClient] = useState(clients[0]?.name || "Enterprise Client");
  const [shortlistChannel, setShortlistChannel] = useState<"email" | "im" | "client_ats" | "portal">("email");
  const [shortlistPitchNotes, setShortlistPitchNotes] = useState("");
  const [maskContact, setMaskContact] = useState(true);
  const [includeRates, setIncludeRates] = useState(true);
  const [includeVetting, setIncludeVetting] = useState(true);
  const [isSubmittingShortlist, setIsSubmittingShortlist] = useState(false);

  // Move Stage Sheet Drawer
  const [movingApp, setMovingApp] = useState<PipelineCandidateItem | null>(null);
  const [targetStage, setTargetStage] = useState<StageKey>("market_mapping");
  const [moveNote, setMoveNote] = useState("");
  const [isMoving, setIsMoving] = useState(false);

  // Schedule Interview Sheet Drawer
  const [schedulingApp, setSchedulingApp] = useState<PipelineCandidateItem | null>(null);
  const [interviewDate, setInterviewDate] = useState("Tomorrow at 2:00 PM EST");
  const [interviewType, setInterviewType] = useState("Technical System Design Panel");
  const [interviewPanel, setInterviewPanel] = useState("Lead Architect & Client Technical Validator");
  const [interviewLink, setInterviewLink] = useState("https://meet.google.com/pepoltek-sprint");
  const [isScheduling, setIsScheduling] = useState(false);

  // Flattened active applications
  const allApplications = useMemo(() => {
    const list: PipelineCandidateItem[] = [];
    const keys: StageKey[] = ["discovery", "market_mapping", "technical_vetting", "interview", "closed"];
    keys.forEach((k) => {
      if (Array.isArray(pipeline[k])) {
        list.push(...pipeline[k]);
      }
    });
    return list;
  }, [pipeline]);

  // Selected Candidate Objects for Shortlist Builder
  const selectedCandidates = useMemo(() => {
    return allApplications.filter((app) => selectedAppIds.has(app.id));
  }, [allApplications, selectedAppIds]);

  // Toggle selection for Shortlist Builder
  const toggleSelectCandidate = (appId: string) => {
    setSelectedAppIds((prev) => {
      const next = new Set(prev);
      if (next.has(appId)) {
        next.delete(appId);
      } else {
        next.add(appId);
      }
      return next;
    });
  };

  const clearSelection = () => {
    setSelectedAppIds(new Set());
  };

  // Filter helper
  const filterList = (items: PipelineCandidateItem[]) => {
    return (items || []).filter((item) => {
      if (selectedReqId !== "all" && item.requisition_id !== selectedReqId) return false;
      if (selectedSector !== "all" && !item.requisition_sector?.toLowerCase().includes(selectedSector.toLowerCase())) return false;
      if (selectedSource !== "all" && item.source !== selectedSource) return false;
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesName = item.candidate_name?.toLowerCase().includes(query);
        const matchesRole = item.requisition_title?.toLowerCase().includes(query);
        const matchesClient = item.client_name?.toLowerCase().includes(query);
        const matchesSkills = item.skills?.some((s) => s.toLowerCase().includes(query));
        if (!matchesName && !matchesRole && !matchesClient && !matchesSkills) return false;
      }
      return true;
    });
  };

  // Execute Stage Advance
  const handleExecuteMoveStage = async () => {
    if (!movingApp) return;
    setIsMoving(true);

    const res = await moveCandidateStageAction(movingApp.id, targetStage, moveNote.trim());
    setIsMoving(false);

    if (res.success) {
      showToast(`${movingApp.candidate_name} advanced to ${targetStage.replace("_", " ").toUpperCase()}.`);
      // Update local state smoothly
      const refreshed = await getRecruiterPipelineAction(
        selectedReqId !== "all" ? selectedReqId : undefined,
        selectedSector !== "all" ? selectedSector : undefined
      );
      setPipeline(refreshed);
      setMovingApp(null);
      setMoveNote("");
    } else {
      showToast(res.error || "Failed to update stage.", "error");
    }
  };

  // Execute Schedule Interview
  const handleExecuteScheduleInterview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schedulingApp) return;
    setIsScheduling(true);

    const res = await scheduleInterviewAction({
      candidate_name: schedulingApp.candidate_name,
      candidate_email: schedulingApp.candidate_email,
      role: schedulingApp.requisition_title,
      interview_type: interviewType,
      scheduled_time: interviewDate,
      panel: interviewPanel,
      meeting_link: interviewLink,
    });

    setIsScheduling(false);
    if (res.success) {
      // Also advance to interview stage if not already there
      if (schedulingApp.stage !== "interview") {
        await moveCandidateStageAction(
          schedulingApp.id,
          "interview",
          `Sprint Interview scheduled for ${interviewDate} with ${interviewPanel}.`
        );
      }
      showToast(`Interview scheduled for ${schedulingApp.candidate_name}. Google Meet invite logged.`);
      const refreshed = await getRecruiterPipelineAction();
      setPipeline(refreshed);
      setSchedulingApp(null);
    } else {
      showToast(res.error || "Failed to schedule interview.", "error");
    }
  };

  // Execute Shortlist Pitch Submission
  const handleSubmitShortlist = async () => {
    if (selectedCandidates.length === 0) {
      showToast("Please select at least 1 candidate for the shortlist.", "error");
      return;
    }

    setIsSubmittingShortlist(true);

    const items: ShortlistSubmissionItemInput[] = selectedCandidates.map((c) => ({
      candidate_id: c.candidate_id,
      candidate_name: c.candidate_name,
      candidate_title: c.requisition_title,
      sector: c.requisition_sector,
      experience: "Senior Specialist (Vetted)",
      rate: includeRates ? c.rate : "Confidential",
      match_score: c.match_score,
      skills: c.skills,
      revealed_fields: {
        show_contact: !maskContact,
        show_vetting: includeVetting,
        show_rates: includeRates,
      },
      masked_contact: {
        email: maskContact ? "[Protected by Pepoltek Escrow]" : c.candidate_email || "direct@pepoltek.com",
        phone: maskContact ? "[Protected by Pepoltek Escrow]" : c.candidate_phone || "+1 (555) 019-2834",
      },
      recruiter_notes: c.note || shortlistPitchNotes,
    }));

    const primaryReqId = selectedCandidates[0]?.requisition_id;

    const res = await createShortlistSubmissionAction({
      requisition_id: primaryReqId,
      client_name: shortlistClient,
      channel: shortlistChannel,
      pitch_notes: shortlistPitchNotes,
      items,
    });

    setIsSubmittingShortlist(false);

    if (res.success) {
      showToast(`Shortlist package dispatched to ${shortlistClient}. Candidates logged in ATS.`);
      setIsShortlistDrawerOpen(false);
      clearSelection();
      setShortlistPitchNotes("");
    } else {
      showToast(res.error || "Failed to submit shortlist.", "error");
    }
  };

  // Export CSV of selected candidates
  const handleExportShortlistCsv = () => {
    if (selectedCandidates.length === 0) return;
    const headers = ["Candidate Name", "Requisition", "Client", "Stage", "Rate", "Match Score", "Skills", "Applied Date"];
    const rows = selectedCandidates.map((c) => [
      `"${c.candidate_name}"`,
      `"${c.requisition_title}"`,
      `"${c.client_name}"`,
      `"${c.stage}"`,
      `"${c.rate}"`,
      `"${c.match_score}"`,
      `"${c.skills.join(", ")}"`,
      `"${c.applied_at}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Pepoltek_Candidate_Shortlist_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Downloaded candidate shortlist dossier (CSV).");
  };

  // Counts
  const totalCount = allApplications.length;
  const vettingCount = (pipeline.technical_vetting || []).length;
  const interviewCount = (pipeline.interview || []).length;
  const closedCount = (pipeline.closed || []).length;

  return (
    <div className="space-y-6 pb-20 text-ink">
      {/* Toast Alert */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl border px-4 py-3 text-xs font-semibold shadow-2xl backdrop-blur-md transition-all ${
            toast.type === "success"
              ? "border-emerald-500/30 bg-emerald-900/90 text-white"
              : "border-rose-500/30 bg-rose-900/90 text-white"
          }`}
        >
          {toast.type === "success" ? <CheckCircle size={16} className="text-emerald-300" /> : <AlertCircle size={16} className="text-rose-300" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header Cockpit Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-electric/30 bg-electric/10 px-3 py-0.5 text-[11px] font-mono font-semibold text-electric uppercase tracking-widest">
            <Kanban size={12} />
            <span>ENTERPRISE ATS WORKFLOW</span>
          </div>
          <h1 className="mt-1 font-display text-2xl font-bold text-ink">
            Candidate Applications &amp; Kanban Pipeline
          </h1>
          <p className="text-xs sm:text-sm text-ink-soft">
            Track candidate progression across 5 stages from initial intake to technical vetting, interviews, and final placement.
          </p>
        </div>

        {/* Quick Actions & View Switcher */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Kanban vs Table Toggle */}
          <div className="inline-flex rounded-xl border border-[#bcd6fa] bg-canvas p-1 shadow-2xs">
            <button
              type="button"
              onClick={() => setViewMode("kanban")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                viewMode === "kanban"
                  ? "bg-white text-electric font-bold shadow-2xs"
                  : "text-ink-soft hover:text-ink font-medium"
              }`}
            >
              <Kanban size={13} />
              <span>Kanban Board</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                viewMode === "table"
                  ? "bg-white text-electric font-bold shadow-2xs"
                  : "text-ink-soft hover:text-ink font-medium"
              }`}
            >
              <Columns3 size={13} />
              <span>Data Sheet</span>
            </button>
          </div>

          {/* Link to Requisitions */}
          <Link
            href="/recruiter/requisitions"
            className="rounded-xl border border-[#bcd6fa] bg-white px-3.5 py-2 font-display text-xs font-semibold text-ink hover:bg-canvas transition-colors shadow-2xs inline-flex items-center gap-1.5"
          >
            <Briefcase size={14} className="text-mist" />
            <span>Manage Requisitions</span>
          </Link>
        </div>
      </div>

      {/* Enterprise Metric KPI Chips */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        <div className="rounded-2xl border border-[#bcd6fa] bg-white p-4 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-mist uppercase tracking-wider font-semibold">Total Active Pipeline</span>
            <span className="h-2 w-2 rounded-full bg-electric animate-pulse" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="font-display text-2xl font-bold text-ink">{totalCount}</span>
            <span className="text-[11px] font-mono font-semibold text-electric">Specialists</span>
          </div>
        </div>

        <div className="rounded-2xl border border-[#bcd6fa] bg-white p-4 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-mist uppercase tracking-wider font-semibold">Technical Vetting</span>
            <span className="h-2 w-2 rounded-full bg-indigo-500" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="font-display text-2xl font-bold text-ink">{vettingCount}</span>
            <span className="text-[11px] font-mono font-semibold text-indigo-600">Audits in Progress</span>
          </div>
        </div>

        <div className="rounded-2xl border border-[#bcd6fa] bg-white p-4 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-mist uppercase tracking-wider font-semibold">Client Interviews</span>
            <span className="h-2 w-2 rounded-full bg-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="font-display text-2xl font-bold text-ink">{interviewCount}</span>
            <span className="text-[11px] font-mono font-semibold text-amber-600">Scheduled Panels</span>
          </div>
        </div>

        <div className="rounded-2xl border border-[#bcd6fa] bg-white p-4 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-mist uppercase tracking-wider font-semibold">Closed / Integrated</span>
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="font-display text-2xl font-bold text-ink">{closedCount}</span>
            <span className="text-[11px] font-mono font-semibold text-emerald-600">Active Contracts</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-[#bcd6fa] bg-white p-3 shadow-2xs sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-2.5">
          {/* Search Input */}
          <div className="relative min-w-[220px] flex-1 sm:max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-mist" />
            <input
              type="text"
              placeholder="Search candidates, skills, clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-[#bcd6fa]/80 bg-canvas/40 pl-8 pr-7 py-2 text-xs font-medium text-ink placeholder-mist focus:border-electric focus:bg-white focus:outline-none transition-all"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-mist hover:text-ink cursor-pointer"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Requisition Filter */}
          <select
            value={selectedReqId}
            onChange={(e) => setSelectedReqId(e.target.value)}
            className="rounded-xl border border-[#bcd6fa]/80 bg-canvas/40 px-3 py-2 text-xs font-medium text-ink focus:border-electric focus:bg-white focus:outline-none transition-all"
          >
            <option value="all">All Requisitions ({requisitions.length})</option>
            {requisitions.map((req) => (
              <option key={req.id} value={req.rawId || req.id}>
                {req.name} ({req.clientName || "Client"})
              </option>
            ))}
          </select>

          {/* Sector Filter */}
          <select
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            className="rounded-xl border border-[#bcd6fa]/80 bg-canvas/40 px-3 py-2 text-xs font-medium text-ink focus:border-electric focus:bg-white focus:outline-none transition-all"
          >
            <option value="all">All Sectors</option>
            <option value="tech">Technology &amp; SDLC</option>
            <option value="health">Healthcare IT &amp; Clinical</option>
          </select>

          {/* Source Filter */}
          <select
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            className="rounded-xl border border-[#bcd6fa]/80 bg-canvas/40 px-3 py-2 text-xs font-medium text-ink focus:border-electric focus:bg-white focus:outline-none transition-all"
          >
            <option value="all">All Intake Sources</option>
            <option value="applied">Direct Applied</option>
            <option value="sourced">Recruiter Sourced</option>
            <option value="reverse">Reverse Search</option>
            <option value="referral">Referral Network</option>
          </select>
        </div>

        {/* Active selection counter */}
        {selectedAppIds.size > 0 && (
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-electric">
              {selectedAppIds.size} Selected
            </span>
            <button
              type="button"
              onClick={clearSelection}
              className="text-xs text-mist hover:text-ink cursor-pointer font-medium"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Main Content: Kanban or Table */}
      {viewMode === "kanban" ? (
        /* Kanban Board View */
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5 items-start">
          {STAGES.map((col) => {
            const rawCandidates = pipeline[col.key] || [];
            const columnCandidates = filterList(rawCandidates);

            return (
              <div
                key={col.key}
                className={`flex flex-col rounded-2xl border ${col.border} ${col.bgLight} p-3.5 shadow-2xs min-h-[460px]`}
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 px-0.5 border-b border-[#bcd6fa]/40 mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${col.dotColor}`} />
                    <h3 className="font-display text-xs font-bold uppercase tracking-wider text-ink">
                      {col.label}
                    </h3>
                  </div>
                  <span className="rounded-full bg-white border border-[#bcd6fa] px-2 py-0.5 font-mono text-[11px] font-bold text-ink shadow-2xs">
                    {columnCandidates.length}
                  </span>
                </div>

                {/* Cards Container */}
                <div className="flex flex-1 flex-col gap-3">
                  {columnCandidates.length === 0 ? (
                    <div className="flex h-36 flex-col items-center justify-center rounded-xl border border-dashed border-[#bcd6fa] bg-white/60 p-4 text-center">
                      <Users size={18} className="text-mist opacity-60" />
                      <span className="mt-1.5 text-xs font-medium text-mist">No candidates in this stage</span>
                    </div>
                  ) : (
                    columnCandidates.map((cand) => {
                      const isSelected = selectedAppIds.has(cand.id);

                      return (
                        <div
                          key={cand.id}
                          className={`group relative rounded-xl border bg-white p-3.5 shadow-2xs transition-all hover:shadow-md cursor-default ${
                            isSelected
                              ? "border-electric ring-2 ring-electric/20 bg-electric/[0.02]"
                              : "border-[#bcd6fa] hover:border-electric"
                          }`}
                        >
                          {/* Card Top Row: Checkbox, Name, Match Score */}
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-start gap-2.5 min-w-0">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleSelectCandidate(cand.id)}
                                className="mt-0.5 h-4 w-4 rounded border-[#bcd6fa] text-electric focus:ring-electric cursor-pointer shrink-0"
                                title="Select candidate for shortlist pitch"
                              />
                              <div className="min-w-0">
                                <Link
                                  href={`/recruiter/applications/${cand.id}`}
                                  className="text-left font-display text-xs font-bold text-ink hover:text-electric transition-colors truncate block max-w-[140px] cursor-pointer"
                                  title={`Open complete application handling for ${cand.candidate_name}`}
                                >
                                  {cand.candidate_name}
                                </Link>
                                <div className="text-[11px] text-mist truncate">
                                  {cand.candidate_location}
                                </div>
                              </div>
                            </div>

                            <span className="shrink-0 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-700">
                              {cand.match_score}
                            </span>
                          </div>

                          {/* Requisition & Client Tag */}
                          <div className="mt-2.5 rounded-lg border border-[#bcd6fa]/40 bg-canvas/60 px-2.5 py-1.5">
                            <div className="truncate font-medium text-xs text-ink" title={cand.requisition_title}>
                              {cand.requisition_title}
                            </div>
                            <div className="mt-0.5 flex items-center justify-between text-[10.5px] text-ink-soft">
                              <span className="truncate pr-1">{cand.client_name}</span>
                              <span className="font-semibold text-ink font-mono shrink-0">{cand.rate}</span>
                            </div>
                          </div>

                          {/* Skills Badges */}
                          {cand.skills && cand.skills.length > 0 && (
                            <div className="mt-2.5 flex flex-wrap gap-1">
                              {cand.skills.slice(0, 3).map((skill, idx) => (
                                <span
                                  key={idx}
                                  className="rounded-md border border-[#bcd6fa]/50 bg-white px-1.5 py-0.5 text-[9.5px] font-medium text-ink-soft"
                                >
                                  {skill}
                                </span>
                              ))}
                              {cand.skills.length > 3 && (
                                <span className="px-1 text-[9px] text-mist font-medium">+{cand.skills.length - 3}</span>
                              )}
                            </div>
                          )}

                          {/* Card Footer: Source Badge & Action Dropdowns */}
                          <div className="mt-3 flex items-center justify-between border-t border-[#bcd6fa]/30 pt-2.5 text-xs">
                            <span className="rounded-md bg-canvas border border-[#bcd6fa]/40 px-1.5 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-ink-soft">
                              {cand.source}
                            </span>

                            <div className="flex items-center gap-1.5">
                              {/* Open Details Link */}
                              <Link
                                href={`/recruiter/applications/${cand.id}`}
                                className="rounded-lg border border-[#bcd6fa] bg-white p-1 text-ink-soft hover:border-electric hover:text-electric hover:bg-electric/5 transition-colors cursor-pointer"
                                title="Open full application handling page"
                              >
                                <ExternalLink size={12} />
                              </Link>

                              {/* Schedule Interview Button (if in vetting or interview) */}
                              {(col.key === "technical_vetting" || col.key === "interview") && (
                                <button
                                  type="button"
                                  onClick={() => setSchedulingApp(cand)}
                                  className="rounded-lg border border-[#bcd6fa] bg-white p-1 text-ink-soft hover:border-amber-400 hover:text-amber-700 hover:bg-amber-50/50 transition-colors cursor-pointer"
                                  title="Schedule live interview"
                                >
                                  <Clock size={12} />
                                </button>
                              )}

                              {/* Move Stage Trigger */}
                              <button
                                type="button"
                                onClick={() => {
                                  setMovingApp(cand);
                                  const currIdx = STAGES.findIndex((s) => s.key === col.key);
                                  const nextIdx = Math.min(currIdx + 1, STAGES.length - 1);
                                  setTargetStage(STAGES[nextIdx].key);
                                }}
                                className="flex items-center gap-1 rounded-lg border border-[#bcd6fa] bg-white px-2 py-1 text-[11px] font-semibold text-ink hover:border-electric hover:bg-electric/5 hover:text-electric transition-colors cursor-pointer"
                                title="Move to another stage"
                              >
                                <span>Move</span>
                                <ArrowRight size={10} />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="overflow-hidden rounded-2xl border border-[#bcd6fa] bg-white shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#bcd6fa]/60 bg-canvas/70 font-display text-[11px] font-semibold uppercase tracking-wider text-mist">
                <tr>
                  <th className="w-10 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedAppIds.size === allApplications.length && allApplications.length > 0}
                      onChange={() => {
                        if (selectedAppIds.size === allApplications.length) {
                          clearSelection();
                        } else {
                          setSelectedAppIds(new Set(allApplications.map((a) => a.id)));
                        }
                      }}
                      className="h-4 w-4 rounded border-[#bcd6fa] text-electric focus:ring-electric cursor-pointer"
                    />
                  </th>
                  <th className="px-4 py-3">Specialist</th>
                  <th className="px-4 py-3">Requisition &amp; Client</th>
                  <th className="px-4 py-3">Stage</th>
                  <th className="px-4 py-3">Rate</th>
                  <th className="px-4 py-3">Match</th>
                  <th className="px-4 py-3">Skills</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#bcd6fa]/30">
                {filterList(allApplications).length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-mist">
                      No candidate applications match the selected criteria.
                    </td>
                  </tr>
                ) : (
                  filterList(allApplications).map((cand) => {
                    const isSelected = selectedAppIds.has(cand.id);
                    return (
                      <tr
                        key={cand.id}
                        className={`transition-colors hover:bg-canvas/50 ${
                          isSelected ? "bg-electric/[0.04]" : ""
                        }`}
                      >
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectCandidate(cand.id)}
                            className="h-4 w-4 rounded border-[#bcd6fa] text-electric focus:ring-electric cursor-pointer"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <Link
                            href={`/recruiter/applications/${cand.id}`}
                            className="font-display text-xs font-bold text-ink hover:text-electric transition-colors cursor-pointer"
                          >
                            {cand.candidate_name}
                          </Link>
                          <div className="text-[11px] text-mist">{cand.candidate_location}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-ink">{cand.requisition_title}</div>
                          <div className="text-[11px] text-mist">{cand.client_name}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="rounded-full border border-electric/30 bg-electric/10 px-2.5 py-0.5 font-mono text-[10.5px] font-bold text-electric">
                            {cand.stage.replace("_", " ").toUpperCase()}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-mono font-semibold text-ink">{cand.rate}</td>
                        <td className="px-4 py-3 font-mono font-bold text-emerald-600">{cand.match_score}</td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {cand.skills?.slice(0, 2).map((s, idx) => (
                              <span key={idx} className="rounded-md border border-[#bcd6fa]/50 bg-canvas px-1.5 py-0.5 text-[10px] text-ink-soft">
                                {s}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Link
                              href={`/recruiter/applications/${cand.id}`}
                              className="rounded-xl border border-electric/40 bg-electric/10 px-2.5 py-1 text-[11px] font-semibold text-electric hover:bg-electric hover:text-white transition-colors"
                            >
                              Handle
                            </Link>
                            <button
                              type="button"
                              onClick={() => {
                                setMovingApp(cand);
                                setTargetStage("technical_vetting");
                              }}
                              className="rounded-xl border border-[#bcd6fa] bg-white px-2.5 py-1 text-[11px] font-semibold text-ink hover:border-electric hover:bg-electric/5 hover:text-electric transition-colors cursor-pointer"
                            >
                              Move
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
      )}

      {/* Floating Bottom Bar for Shortlist Builder */}
      {selectedCandidates.length > 0 && (
        <div className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2 rounded-2xl border border-ink/80 bg-ink px-5 py-3.5 shadow-2xl backdrop-blur-md text-white">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-electric font-mono text-xs font-bold text-white">
                {selectedCandidates.length}
              </span>
              <span className="font-display text-xs font-semibold sm:text-sm text-white">
                Candidates Selected for Shortlist Pitch
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleExportShortlistCsv}
                className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/20 transition-colors cursor-pointer"
              >
                <Download size={13} />
                <span className="hidden sm:inline">Export CSV</span>
              </button>

              <button
                type="button"
                onClick={() => setIsShortlistDrawerOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-electric px-4 py-1.5 font-display text-xs font-bold text-white shadow-xs hover:bg-electric-bright hover:text-ink transition-colors cursor-pointer"
              >
                <Share2 size={13} />
                <span>Pitch Shortlist to Client</span>
              </button>

              <button
                type="button"
                onClick={clearSelection}
                className="text-white/60 hover:text-white p-1 transition-colors cursor-pointer"
                title="Deselect all"
              >
                <X size={15} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RIGHT-SIDE SHEET: Shortlist Builder & Client Submission */}
      {isShortlistDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-ink/40 backdrop-blur-xs">
          <div className="flex h-full w-full max-w-xl flex-col border-l border-[#bcd6fa] bg-white shadow-2xl animate-in slide-in-from-right duration-200">
            {/* Sheet Header */}
            <div className="flex items-center justify-between border-b border-[#bcd6fa]/60 px-6 py-5 bg-white">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold uppercase tracking-wider text-electric">
                  <Share2 size={13} />
                  Shortlist Builder &amp; Client Pitch
                </div>
                <h2 className="mt-1 font-display text-lg font-bold text-ink">
                  Submit Candidate Package
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsShortlistDrawerOpen(false)}
                className="rounded-xl p-1.5 text-mist hover:bg-canvas hover:text-ink transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Sheet Content */}
            <div className="flex-1 space-y-5 overflow-y-auto p-6 text-xs text-ink-soft">
              {/* Client Selection */}
              <div>
                <label className="mb-1.5 block font-semibold text-ink">
                  Target Enterprise Client Organization
                </label>
                <select
                  value={shortlistClient}
                  onChange={(e) => {
                    setShortlistClient(e.target.value);
                    const found = clients.find((c) => c.name === e.target.value);
                    if (found && found.delivery_channel) {
                      setShortlistChannel(found.delivery_channel as any);
                    }
                  }}
                  className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 text-xs font-medium text-ink focus:border-electric focus:outline-none transition-all"
                >
                  {clients.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name} ({c.sector})
                    </option>
                  ))}
                  {clients.length === 0 && <option value="Enterprise Client">Direct Enterprise Client</option>}
                </select>
              </div>

              {/* Delivery Channel */}
              <div>
                <label className="mb-1.5 block font-semibold text-ink">
                  Preferred Shortlist Delivery Channel
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: "email", label: "Email" },
                    { id: "im", label: "Slack / IM" },
                    { id: "client_ats", label: "Client ATS" },
                    { id: "portal", label: "Portal Link" },
                  ].map((ch) => (
                    <button
                      key={ch.id}
                      type="button"
                      onClick={() => setShortlistChannel(ch.id as any)}
                      className={`rounded-xl border px-2.5 py-2 text-center text-xs font-semibold transition-all cursor-pointer ${
                        shortlistChannel === ch.id
                          ? "border-electric bg-electric/10 text-electric font-bold"
                          : "border-[#bcd6fa] bg-white text-ink-soft hover:bg-canvas"
                      }`}
                    >
                      {ch.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Security & Masking Switches */}
              <div className="rounded-2xl border border-[#bcd6fa]/70 bg-canvas/50 p-4">
                <div className="mb-2 font-display text-xs font-bold text-ink">
                  Data Governance &amp; PII Protection
                </div>
                <div className="space-y-2.5">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-xs text-ink-soft font-medium">Mask Candidate Contact (Email &amp; Phone)</span>
                    <input
                      type="checkbox"
                      checked={maskContact}
                      onChange={(e) => setMaskContact(e.target.checked)}
                      className="h-4 w-4 rounded border-[#bcd6fa] text-electric focus:ring-electric cursor-pointer"
                    />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-xs text-ink-soft font-medium">Include Pre-Screening &amp; Technical Vetting Scores</span>
                    <input
                      type="checkbox"
                      checked={includeVetting}
                      onChange={(e) => setIncludeVetting(e.target.checked)}
                      className="h-4 w-4 rounded border-[#bcd6fa] text-electric focus:ring-electric cursor-pointer"
                    />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-xs text-ink-soft font-medium">Include Proposed Hourly / Placement Rates</span>
                    <input
                      type="checkbox"
                      checked={includeRates}
                      onChange={(e) => setIncludeRates(e.target.checked)}
                      className="h-4 w-4 rounded border-[#bcd6fa] text-electric focus:ring-electric cursor-pointer"
                    />
                  </label>
                </div>
              </div>

              {/* Pitch Notes */}
              <div>
                <label className="mb-1.5 block font-semibold text-ink">
                  Recruiter Pitch Notes &amp; Highlights for Client
                </label>
                <textarea
                  rows={3}
                  value={shortlistPitchNotes}
                  onChange={(e) => setShortlistPitchNotes(e.target.value)}
                  placeholder="e.g. Specialists vetted for Next.js and distributed Kafka streaming. Available for 14-day risk-free trial."
                  className="w-full rounded-xl border border-[#bcd6fa] bg-white p-3 text-xs font-medium text-ink placeholder-mist focus:border-electric focus:outline-none transition-all"
                />
              </div>

              {/* Roster of Selected Candidates */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-semibold text-ink">
                    Included Specialists ({selectedCandidates.length})
                  </span>
                  <button
                    type="button"
                    onClick={handleExportShortlistCsv}
                    className="font-semibold text-electric hover:underline cursor-pointer"
                  >
                    Export CSV Dossier
                  </button>
                </div>
                <div className="space-y-2">
                  {selectedCandidates.map((c) => (
                    <div
                      key={c.id}
                      className="flex items-center justify-between rounded-xl border border-[#bcd6fa] bg-white p-3 shadow-2xs"
                    >
                      <div>
                        <div className="font-display text-xs font-bold text-ink">{c.candidate_name}</div>
                        <div className="text-[11px] text-mist">
                          {c.requisition_title} &bull; {c.rate}
                        </div>
                      </div>
                      <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-700">
                        {c.match_score}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sheet Footer */}
            <div className="border-t border-[#bcd6fa]/60 p-5 bg-white">
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsShortlistDrawerOpen(false)}
                  className="rounded-xl border border-[#bcd6fa] bg-white px-4 py-2 text-xs font-semibold text-ink-soft hover:bg-canvas hover:text-ink transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isSubmittingShortlist}
                  onClick={handleSubmitShortlist}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-ink px-5 py-2 font-display text-xs font-bold text-white shadow-xs hover:bg-electric transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingShortlist ? "Logging & Dispatching..." : "Confirm & Dispatch Shortlist"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RIGHT-SIDE SHEET: Move Stage Modal */}
      {movingApp && (
        <div className="fixed inset-0 z-50 flex justify-end bg-ink/40 backdrop-blur-xs">
          <div className="flex h-full w-full max-w-md flex-col border-l border-[#bcd6fa] bg-white shadow-2xl animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between border-b border-[#bcd6fa]/60 px-6 py-5 bg-white">
              <div>
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-electric">
                  Pipeline Progression
                </span>
                <h2 className="mt-1 font-display text-lg font-bold text-ink">
                  Advance Candidate Stage
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setMovingApp(null)}
                className="rounded-xl p-1.5 text-mist hover:bg-canvas hover:text-ink transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 space-y-4 p-6 text-xs text-ink-soft">
              <div className="rounded-2xl border border-[#bcd6fa]/70 bg-canvas/50 p-3.5">
                <span className="font-mono text-[10px] text-mist uppercase">Candidate</span>
                <div className="font-display text-xs font-bold text-ink">{movingApp.candidate_name}</div>
                <div className="text-[11px] text-mist">{movingApp.requisition_title}</div>
              </div>

              <div>
                <label className="mb-1.5 block font-semibold text-ink">
                  Target Pipeline Stage
                </label>
                <select
                  value={targetStage}
                  onChange={(e) => setTargetStage(e.target.value as StageKey)}
                  className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 text-xs font-medium text-ink focus:border-electric focus:outline-none transition-all"
                >
                  {STAGES.map((s) => (
                    <option key={s.key} value={s.key}>
                      {s.badge} - {s.label}
                    </option>
                  ))}
                  <option value="rejected">Rejected</option>
                  <option value="withdrawn">Withdrawn</option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block font-semibold text-ink">
                  Recruiter Audit Note
                </label>
                <textarea
                  rows={4}
                  value={moveNote}
                  onChange={(e) => setMoveNote(e.target.value)}
                  placeholder="e.g. Cleared technical algorithm round with 95% test coverage. Ready for client interview."
                  className="w-full rounded-xl border border-[#bcd6fa] bg-white p-3 text-xs font-medium text-ink placeholder-mist focus:border-electric focus:outline-none transition-all"
                />
              </div>
            </div>

            <div className="border-t border-[#bcd6fa]/60 p-5 bg-white">
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setMovingApp(null)}
                  className="rounded-xl border border-[#bcd6fa] bg-white px-4 py-2 text-xs font-semibold text-ink-soft hover:bg-canvas hover:text-ink transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isMoving}
                  onClick={handleExecuteMoveStage}
                  className="rounded-xl bg-ink px-5 py-2 font-display text-xs font-bold text-white shadow-xs hover:bg-electric transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isMoving ? "Updating Stage..." : "Confirm Stage Move"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RIGHT-SIDE SHEET: Schedule Interview */}
      {schedulingApp && (
        <div className="fixed inset-0 z-50 flex justify-end bg-ink/40 backdrop-blur-xs">
          <form
            onSubmit={handleExecuteScheduleInterview}
            className="flex h-full w-full max-w-md flex-col border-l border-[#bcd6fa] bg-white shadow-2xl animate-in slide-in-from-right duration-200"
          >
            <div className="flex items-center justify-between border-b border-[#bcd6fa]/60 px-6 py-5 bg-white">
              <div>
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-amber-600">
                  Sprint Interview Booking
                </span>
                <h2 className="mt-1 font-display text-lg font-bold text-ink">
                  Schedule Live Meeting
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSchedulingApp(null)}
                className="rounded-xl p-1.5 text-mist hover:bg-canvas hover:text-ink transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 space-y-4 p-6 text-xs text-ink-soft">
              <div className="rounded-2xl border border-[#bcd6fa]/70 bg-canvas/50 p-3.5">
                <span className="font-mono text-[10px] text-mist uppercase">Candidate</span>
                <div className="font-display text-xs font-bold text-ink">{schedulingApp.candidate_name}</div>
                <div className="text-[11px] text-mist">{schedulingApp.requisition_title}</div>
              </div>

              <div>
                <label className="mb-1.5 block font-semibold text-ink">
                  Scheduled Time &amp; Date
                </label>
                <input
                  type="text"
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                  placeholder="e.g. Tomorrow at 2:00 PM EST"
                  className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 text-xs font-medium text-ink focus:border-electric focus:outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block font-semibold text-ink">
                  Interview Round / Type
                </label>
                <input
                  type="text"
                  value={interviewType}
                  onChange={(e) => setInterviewType(e.target.value)}
                  placeholder="e.g. Technical System Design Panel"
                  className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 text-xs font-medium text-ink focus:border-electric focus:outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block font-semibold text-ink">
                  Interview Panel Members
                </label>
                <input
                  type="text"
                  value={interviewPanel}
                  onChange={(e) => setInterviewPanel(e.target.value)}
                  placeholder="e.g. Lead Architect & Client Technical Validator"
                  className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 text-xs font-medium text-ink focus:border-electric focus:outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block font-semibold text-ink">
                  Google Meet / Video Conference URL
                </label>
                <input
                  type="url"
                  value={interviewLink}
                  onChange={(e) => setInterviewLink(e.target.value)}
                  placeholder="https://meet.google.com/..."
                  className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 text-xs font-medium text-ink focus:border-electric focus:outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div className="border-t border-[#bcd6fa]/60 p-5 bg-white">
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSchedulingApp(null)}
                  className="rounded-xl border border-[#bcd6fa] bg-white px-4 py-2 text-xs font-semibold text-ink-soft hover:bg-canvas hover:text-ink transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isScheduling}
                  className="rounded-xl bg-amber-600 px-5 py-2 font-display text-xs font-bold text-white shadow-xs hover:bg-amber-500 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isScheduling ? "Booking..." : "Confirm & Send Calendar Invite"}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
