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
  Table as TableIcon,
  Search,
  Users,
  Briefcase,
  CheckCircle,
  Clock,
  ArrowRight,
  ExternalLink,
  X,
  FileText,
  Calendar,
  AlertCircle,
  Download,
  Share2,
  CheckSquare,
  Sparkles,
  FileSpreadsheet,
  Building2,
  MapPin,
  Mail,
  Phone,
  Layers,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";

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
    badge: "1: Discovery",
    color: "text-sky-800",
    bgLight: "bg-sky-50/70",
    border: "border-sky-200",
    headerBg: "bg-sky-100/80 text-sky-900",
    dotColor: "bg-sky-500",
  },
  {
    key: "market_mapping",
    label: "Market Mapping",
    badge: "2: Market Mapping",
    color: "text-blue-800",
    bgLight: "bg-blue-50/70",
    border: "border-blue-200",
    headerBg: "bg-blue-100/80 text-blue-900",
    dotColor: "bg-blue-600",
  },
  {
    key: "technical_vetting",
    label: "Technical Vetting",
    badge: "3: Technical Vetting",
    color: "text-indigo-800",
    bgLight: "bg-indigo-50/70",
    border: "border-indigo-200",
    headerBg: "bg-indigo-100/80 text-indigo-900",
    dotColor: "bg-indigo-600",
  },
  {
    key: "interview",
    label: "Client Interview",
    badge: "4: Client Interview",
    color: "text-amber-800",
    bgLight: "bg-amber-50/70",
    border: "border-amber-200",
    headerBg: "bg-amber-100/80 text-amber-900",
    dotColor: "bg-amber-500",
  },
  {
    key: "closed",
    label: "Closed / Placed",
    badge: "5: Closed / Placed",
    color: "text-emerald-800",
    bgLight: "bg-emerald-50/70",
    border: "border-emerald-200",
    headerBg: "bg-emerald-100/80 text-emerald-900",
    dotColor: "bg-emerald-600",
  },
];

// Sequential Stage Progression Map
const NEXT_STAGE_MAP: Record<StageKey, { key: StageKey; label: string; step: string } | null> = {
  discovery: { key: "market_mapping", label: "Market Mapping", step: "Stage 2" },
  market_mapping: { key: "technical_vetting", label: "Technical Vetting", step: "Stage 3" },
  technical_vetting: { key: "interview", label: "Client Interview", step: "Stage 4" },
  interview: { key: "closed", label: "Closed / Placed", step: "Stage 5" },
  closed: null,
};

export function RecruiterApplicationsKanbanView({
  initialPipeline,
  requisitions,
  clients,
}: Props) {
  const [pipeline, setPipeline] = useState<PipelineStagesData>(initialPipeline);
  // Default view is Data Sheet per requirement
  const [viewMode, setViewMode] = useState<"table" | "kanban">("table");

  // Filters
  const [selectedReqId, setSelectedReqId] = useState<string>("all");
  const [selectedSector, setSelectedSector] = useState<string>("all");
  const [selectedSource, setSelectedSource] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Drag and drop state
  const [draggedApp, setDraggedApp] = useState<PipelineCandidateItem | null>(null);
  const [dragOverStage, setDragOverStage] = useState<StageKey | null>(null);

  // Instant Summary Right-Side Sheet Drawer
  const [summaryApp, setSummaryApp] = useState<PipelineCandidateItem | null>(null);

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

  // Upgrade Stage Sheet Drawer (Sequential)
  const [movingApp, setMovingApp] = useState<PipelineCandidateItem | null>(null);
  const [targetStage, setTargetStage] = useState<StageKey>("market_mapping");
  const [moveNote, setMoveNote] = useState("");
  const [isMoving, setIsMoving] = useState(false);

  // Schedule Interview Sheet Drawer (Only for technical_vetting or interview; no stage moving here)
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

  // Requisitions with Application Counts (Row 2 Filter)
  const requisitionsWithCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    const titleMap: Record<string, { name: string; clientName?: string }> = {};

    allApplications.forEach((app) => {
      if (app.requisition_id) {
        counts[app.requisition_id] = (counts[app.requisition_id] || 0) + 1;
        if (!titleMap[app.requisition_id]) {
          titleMap[app.requisition_id] = {
            name: app.requisition_title || "Requisition",
            clientName: app.client_name,
          };
        }
      }
    });

    const knownIds = new Set<string>();
    const list = requisitions.map((req) => {
      const rawId = req.rawId || req.id;
      knownIds.add(rawId);
      return {
        id: rawId,
        name: req.name,
        clientName: req.clientName,
        count: counts[rawId] || 0,
      };
    });

    // In case applications exist for requisitions not in the requisitions prop
    Object.keys(counts).forEach((reqId) => {
      if (!knownIds.has(reqId)) {
        list.push({
          id: reqId,
          name: titleMap[reqId]?.name || "Requisition",
          clientName: titleMap[reqId]?.clientName,
          count: counts[reqId],
        });
      }
    });

    // Sort: active requisitions with applications first (highest count first), then alphabetical
    return list.sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count;
      return a.name.localeCompare(b.name);
    });
  }, [allApplications, requisitions]);

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

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, app: PipelineCandidateItem) => {
    setDraggedApp(app);
    e.dataTransfer.setData("text/plain", app.id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = () => {
    setDraggedApp(null);
    setDragOverStage(null);
  };

  const handleDragOver = (e: React.DragEvent, stageKey: StageKey) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverStage !== stageKey) {
      setDragOverStage(stageKey);
    }
  };

  const handleDragLeave = (e: React.DragEvent, stageKey: StageKey) => {
    if (dragOverStage === stageKey) {
      setDragOverStage(null);
    }
  };

  const handleDrop = async (e: React.DragEvent, targetStageKey: StageKey) => {
    e.preventDefault();
    setDragOverStage(null);
    if (!draggedApp) return;

    const currentStage = draggedApp.stage;
    if (currentStage === targetStageKey) {
      setDraggedApp(null);
      return;
    }

    const appToMove = draggedApp;
    setDraggedApp(null);

    // Optimistic UI update
    setPipeline((prev) => {
      const next = { ...prev };
      const sourceKey = currentStage as StageKey;
      if (Array.isArray(next[sourceKey])) {
        next[sourceKey] = next[sourceKey].filter((item) => item.id !== appToMove.id);
      }
      const updatedItem = { ...appToMove, stage: targetStageKey };
      if (!Array.isArray(next[targetStageKey])) {
        next[targetStageKey] = [];
      }
      next[targetStageKey] = [updatedItem, ...next[targetStageKey]];
      return next;
    });

    const stageLabel = STAGES.find((s) => s.key === targetStageKey)?.label || targetStageKey;
    showToast(`${appToMove.candidate_name} upgraded to ${stageLabel}.`);

    const res = await moveCandidateStageAction(
      appToMove.id,
      targetStageKey,
      `Upgraded to ${stageLabel} via Kanban board.`
    );

    if (!res.success) {
      showToast(res.error || "Failed to update stage on server.", "error");
      const refreshed = await getRecruiterPipelineAction();
      setPipeline(refreshed);
    }
  };

  // Execute Sequential Stage Upgrade
  const handleExecuteMoveStage = async () => {
    if (!movingApp) return;
    setIsMoving(true);

    const res = await moveCandidateStageAction(movingApp.id, targetStage, moveNote.trim());
    setIsMoving(false);

    if (res.success) {
      const stageName = STAGES.find((s) => s.key === targetStage)?.label || targetStage;
      showToast(`${movingApp.candidate_name} upgraded to ${stageName}.`);
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

  // Execute Schedule Interview (Strictly schedules interview, NO stage move performed here)
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
      showToast(`Interview scheduled for ${schedulingApp.candidate_name}. Calendar invite logged.`);
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

  // Export to Excel / CSV with BOM
  const handleExportExcel = () => {
    const listToExport = filterList(allApplications);
    if (listToExport.length === 0) {
      showToast("No candidate applications found matching criteria.", "error");
      return;
    }

    const headers = [
      "Specialist Name",
      "Location",
      "Requisition Title",
      "Client Organization",
      "Sector",
      "Stage",
      "Match Score",
      "Intake Source",
      "Applied Date",
    ];

    const rows = listToExport.map((c) => [
      `"${(c.candidate_name || "").replace(/"/g, '""')}"`,
      `"${(c.candidate_location || "").replace(/"/g, '""')}"`,
      `"${(c.requisition_title || "").replace(/"/g, '""')}"`,
      `"${(c.client_name || "").replace(/"/g, '""')}"`,
      `"${(c.requisition_sector || "").replace(/"/g, '""')}"`,
      `"${c.stage || ""}"`,
      `"${c.match_score || ""}"`,
      `"${c.source || ""}"`,
      `"${c.applied_at || ""}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `Pepoltek_Candidate_Applications_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${listToExport.length} candidate applications to Excel.`);
  };

  // Helper for candidate avatar initials
  const getInitials = (name: string) => {
    if (!name) return "SP";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
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
          {toast.type === "success" ? (
            <CheckCircle size={16} className="text-emerald-300" />
          ) : (
            <AlertCircle size={16} className="text-rose-300" />
          )}
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

        {/* Top Right: ONLY TWO BUTTONS (Data Sheet, Kanban Board) */}
        <div className="flex items-center shrink-0">
          <div className="inline-flex items-center rounded-xl border border-[#bcd6fa] bg-canvas p-1 shadow-2xs">
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                viewMode === "table"
                  ? "bg-white text-electric font-bold shadow-2xs border border-[#bcd6fa]/50"
                  : "text-ink-soft hover:text-ink font-medium"
              }`}
            >
              <TableIcon size={14} className="shrink-0" />
              <span className="whitespace-nowrap">Data Sheet</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("kanban")}
              className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                viewMode === "kanban"
                  ? "bg-white text-electric font-bold shadow-2xs border border-[#bcd6fa]/50"
                  : "text-ink-soft hover:text-ink font-medium"
              }`}
            >
              <Kanban size={14} className="shrink-0" />
              <span className="whitespace-nowrap">Kanban Board</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metric KPI Cards (Fluid Wave Shape Background on Bottom Right Corner) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        {/* Card 1: Total Active Pipeline */}
        <div className="group relative overflow-hidden rounded-2xl border border-[#bcd6fa] bg-white p-4 shadow-2xs hover:shadow-md hover:border-electric/70 transition-all">
          <div
            className="pointer-events-none absolute -bottom-2 -right-2 h-24 w-36 opacity-30 group-hover:opacity-50 transition-opacity bg-contain bg-no-repeat bg-right-bottom"
            style={{ backgroundImage: "url('/assets/register/bg_card_bottom.png')" }}
          />
          <svg
            className="pointer-events-none absolute -bottom-1 -right-1 h-20 w-32 opacity-25 group-hover:opacity-40 transition-opacity"
            viewBox="0 0 160 90"
            fill="none"
          >
            <path
              d="M0 90C45 60 85 85 125 50C142 35 155 18 160 0V90H0Z"
              fill="#0284c7"
            />
            <circle cx="132" cy="28" r="9" fill="#0284c7" fillOpacity="0.6" />
            <circle cx="95" cy="58" r="5" fill="#0284c7" fillOpacity="0.4" />
          </svg>
          <div className="relative z-10 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-mist uppercase tracking-wider font-semibold">
                Total Active Pipeline
              </span>
              <span className="h-2 w-2 rounded-full bg-electric animate-pulse" />
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="font-display text-2xl font-bold text-ink">{totalCount}</span>
              <span className="text-[11px] font-mono font-semibold text-electric">Specialists</span>
            </div>
          </div>
        </div>

        {/* Card 2: Technical Vetting */}
        <div className="group relative overflow-hidden rounded-2xl border border-[#bcd6fa] bg-white p-4 shadow-2xs hover:shadow-md hover:border-indigo-400 transition-all">
          <div
            className="pointer-events-none absolute -bottom-2 -right-2 h-24 w-36 opacity-30 group-hover:opacity-50 transition-opacity bg-contain bg-no-repeat bg-right-bottom"
            style={{ backgroundImage: "url('/assets/register/bg_card_bottom.png')" }}
          />
          <svg
            className="pointer-events-none absolute -bottom-1 -right-1 h-20 w-32 opacity-25 group-hover:opacity-40 transition-opacity"
            viewBox="0 0 160 90"
            fill="none"
          >
            <path
              d="M0 90C45 60 85 85 125 50C142 35 155 18 160 0V90H0Z"
              fill="#6366f1"
            />
            <circle cx="132" cy="28" r="9" fill="#6366f1" fillOpacity="0.6" />
            <circle cx="95" cy="58" r="5" fill="#6366f1" fillOpacity="0.4" />
          </svg>
          <div className="relative z-10 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-mist uppercase tracking-wider font-semibold">
                Technical Vetting
              </span>
              <span className="h-2 w-2 rounded-full bg-indigo-500" />
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="font-display text-2xl font-bold text-ink">{vettingCount}</span>
              <span className="text-[11px] font-mono font-semibold text-indigo-600">Audits in Progress</span>
            </div>
          </div>
        </div>

        {/* Card 3: Client Interviews */}
        <div className="group relative overflow-hidden rounded-2xl border border-[#bcd6fa] bg-white p-4 shadow-2xs hover:shadow-md hover:border-amber-400 transition-all">
          <div
            className="pointer-events-none absolute -bottom-2 -right-2 h-24 w-36 opacity-30 group-hover:opacity-50 transition-opacity bg-contain bg-no-repeat bg-right-bottom"
            style={{ backgroundImage: "url('/assets/register/bg_card_bottom.png')" }}
          />
          <svg
            className="pointer-events-none absolute -bottom-1 -right-1 h-20 w-32 opacity-25 group-hover:opacity-40 transition-opacity"
            viewBox="0 0 160 90"
            fill="none"
          >
            <path
              d="M0 90C45 60 85 85 125 50C142 35 155 18 160 0V90H0Z"
              fill="#f59e0b"
            />
            <circle cx="132" cy="28" r="9" fill="#f59e0b" fillOpacity="0.6" />
            <circle cx="95" cy="58" r="5" fill="#f59e0b" fillOpacity="0.4" />
          </svg>
          <div className="relative z-10 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-mist uppercase tracking-wider font-semibold">
                Client Interviews
              </span>
              <span className="h-2 w-2 rounded-full bg-amber-500" />
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="font-display text-2xl font-bold text-ink">{interviewCount}</span>
              <span className="text-[11px] font-mono font-semibold text-amber-600">Scheduled Panels</span>
            </div>
          </div>
        </div>

        {/* Card 4: Closed / Integrated */}
        <div className="group relative overflow-hidden rounded-2xl border border-[#bcd6fa] bg-white p-4 shadow-2xs hover:shadow-md hover:border-emerald-400 transition-all">
          <div
            className="pointer-events-none absolute -bottom-2 -right-2 h-24 w-36 opacity-30 group-hover:opacity-50 transition-opacity bg-contain bg-no-repeat bg-right-bottom"
            style={{ backgroundImage: "url('/assets/register/bg_card_bottom.png')" }}
          />
          <svg
            className="pointer-events-none absolute -bottom-1 -right-1 h-20 w-32 opacity-25 group-hover:opacity-40 transition-opacity"
            viewBox="0 0 160 90"
            fill="none"
          >
            <path
              d="M0 90C45 60 85 85 125 50C142 35 155 18 160 0V90H0Z"
              fill="#10b981"
            />
            <circle cx="132" cy="28" r="9" fill="#10b981" fillOpacity="0.6" />
            <circle cx="95" cy="58" r="5" fill="#10b981" fillOpacity="0.4" />
          </svg>
          <div className="relative z-10 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-mist uppercase tracking-wider font-semibold">
                Closed / Integrated
              </span>
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="font-display text-2xl font-bold text-ink">{closedCount}</span>
              <span className="text-[11px] font-mono font-semibold text-emerald-600">Active Contracts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Search & Filtering System */}
      <div className="flex flex-col gap-3 rounded-2xl border border-[#bcd6fa] bg-white p-4 shadow-2xs">
        {/* ROW 1: Search, Sector, Intake on Left; Export to Excel on Right */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2.5 flex-1">
            {/* Search Input (Full width on mobile, w-72 on larger screens) */}
            <div className="relative w-full sm:w-72 shrink-0">
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

            {/* Line 2 on mobile: 2-column flex grid for Sector and Intake (perfect 50/50 alignment) */}
            <div className="grid grid-cols-2 gap-2 w-full sm:w-auto sm:flex sm:items-center">
              {/* Sector Filter */}
              <select
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="w-full sm:w-auto rounded-xl border border-[#bcd6fa]/80 bg-canvas/40 px-3 py-2 text-xs font-medium text-ink focus:border-electric focus:bg-white focus:outline-none transition-all cursor-pointer"
              >
                <option value="all">All Sectors</option>
                <option value="tech">Technology &amp; SDLC</option>
                <option value="health">Healthcare IT &amp; Clinical</option>
              </select>

              {/* Intake Source Filter */}
              <select
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value)}
                className="w-full sm:w-auto rounded-xl border border-[#bcd6fa]/80 bg-canvas/40 px-3 py-2 text-xs font-medium text-ink focus:border-electric focus:bg-white focus:outline-none transition-all cursor-pointer"
              >
                <option value="all">All Intake Sources</option>
                <option value="applied">Direct Applied</option>
                <option value="sourced">Recruiter Sourced</option>
                <option value="reverse">Reverse Search</option>
                <option value="referral">Referral Network</option>
              </select>
            </div>
          </div>

          {/* Right Side: Export to Excel Button (Full width on mobile, right-aligned on desktop) */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between sm:justify-end gap-2.5 shrink-0 pt-2 lg:pt-0 border-t border-[#bcd6fa]/30 lg:border-t-0 w-full lg:w-auto">
            {selectedAppIds.size > 0 && (
              <div className="flex items-center justify-between sm:justify-start gap-2 mr-1">
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

            <button
              type="button"
              onClick={handleExportExcel}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#bcd6fa] bg-canvas/60 px-3.5 py-2 text-xs font-semibold text-ink hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 transition-colors shadow-2xs cursor-pointer whitespace-nowrap"
              title="Download currently filtered candidate applications to Excel"
            >
              <FileSpreadsheet size={14} className="text-emerald-600" />
              <span>Export to Excel</span>
            </button>
          </div>
        </div>

        {/* ROW 2: Requisition Select Dropdown (Native select with counts within options, no horizontal scroll) */}
        <div className="pt-2.5 border-t border-[#bcd6fa]/40 flex flex-col sm:flex-row sm:items-center gap-2">
          <label htmlFor="requisition-select-filter" className="text-[11px] font-mono uppercase tracking-wider text-mist shrink-0 font-semibold flex items-center gap-1.5">
            <Briefcase size={12} className="text-electric" />
            <span>Requisition:</span>
          </label>
          <div className="w-full sm:max-w-md">
            <select
              id="requisition-select-filter"
              value={selectedReqId}
              onChange={(e) => setSelectedReqId(e.target.value)}
              className="w-full rounded-xl border border-[#bcd6fa]/80 bg-canvas/40 px-3 py-2 text-xs font-medium text-ink focus:border-electric focus:bg-white focus:outline-none transition-all cursor-pointer"
            >
              <option value="all">All Active Requisitions ({totalCount})</option>
              {requisitionsWithCounts.map((req) => (
                <option key={req.id} value={req.id}>
                  {req.name}{req.clientName ? ` (${req.clientName})` : ""} ({req.count})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Content: Kanban or Data Sheet Table */}
      {viewMode === "kanban" ? (
        /* KANBAN BOARD VIEW */
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5 items-start">
          {STAGES.map((col) => {
            const rawCandidates = pipeline[col.key] || [];
            const columnCandidates = filterList(rawCandidates);
            const isDropTarget = dragOverStage === col.key;

            return (
              <div
                key={col.key}
                onDragOver={(e) => handleDragOver(e, col.key)}
                onDragLeave={(e) => handleDragLeave(e, col.key)}
                onDrop={(e) => handleDrop(e, col.key)}
                className={`flex flex-col rounded-2xl border ${col.border} ${col.bgLight} p-3 shadow-2xs min-h-[480px] transition-all duration-200 ${
                  isDropTarget ? "ring-2 ring-electric/70 bg-electric/[0.08] shadow-md" : ""
                }`}
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-2.5 px-0.5 border-b border-[#bcd6fa]/40 mb-3">
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
                <div className="flex flex-1 flex-col gap-2.5">
                  {columnCandidates.length === 0 ? (
                    <div className="flex h-32 flex-col items-center justify-center rounded-xl border border-dashed border-[#bcd6fa] bg-white/50 p-4 text-center">
                      <Users size={16} className="text-mist opacity-60" />
                      <span className="mt-1 text-[11px] font-medium text-mist">
                        {isDropTarget ? "Drop candidate here" : "No candidates in stage"}
                      </span>
                    </div>
                  ) : (
                    columnCandidates.map((cand) => {
                      const isSelected = selectedAppIds.has(cand.id);
                      const nextStageInfo = NEXT_STAGE_MAP[cand.stage as StageKey];
                      const canScheduleInterview =
                        cand.stage === "technical_vetting" || cand.stage === "interview";

                      return (
                        <div
                          key={cand.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, cand)}
                          onDragEnd={handleDragEnd}
                          className={`group relative flex items-center justify-between rounded-xl border bg-white p-2.5 shadow-2xs transition-all hover:shadow-md cursor-grab active:cursor-grabbing ${
                            isSelected
                              ? "border-electric ring-2 ring-electric/20 bg-electric/[0.02]"
                              : "border-[#bcd6fa] hover:border-electric"
                          }`}
                        >
                          {/* Left: Circular Avatar & Two Lines Content */}
                          <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-1">
                            {/* Circle Profile Image / Initials */}
                            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-sky-400 via-blue-500 to-indigo-600 text-white font-display text-xs font-bold shadow-2xs select-none">
                              {getInitials(cand.candidate_name)}
                              {isSelected && (
                                <span className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-electric border-2 border-white" />
                              )}
                            </div>

                            {/* Two Lines Only */}
                            <div className="min-w-0 flex-1">
                              {/* Line 1: Candidate Name */}
                              <div
                                className="truncate font-display text-xs font-bold text-ink group-hover:text-electric transition-colors"
                                title={cand.candidate_name}
                              >
                                {cand.candidate_name}
                              </div>

                              {/* Line 2: Small Status Badge */}
                              <div className="mt-0.5 flex items-center gap-1.5">
                                <span className="inline-block truncate rounded-md bg-canvas border border-[#bcd6fa]/50 px-1.5 py-0.2 text-[9.5px] font-mono font-medium text-ink-soft uppercase tracking-wider">
                                  {cand.sub_stage || cand.stage.replace("_", " ")}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Top Right Corner: Stage-Based Score (if present) */}
                          {cand.match_score && cand.match_score !== "0%" && (
                            <div className="shrink-0 self-start">
                              <span className="rounded-full bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 font-mono text-[9.5px] font-bold text-emerald-700 shadow-2xs">
                                {cand.match_score}
                              </span>
                            </div>
                          )}

                          {/* On Hover: Impressive Micro-Animated Action Ribbon with Small Icons */}
                          <div className="pointer-events-none group-hover:pointer-events-auto absolute inset-0 rounded-xl bg-white/95 backdrop-blur-xs flex items-center justify-between px-2 opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 transition-all duration-200 shadow-md border border-electric/40 z-20 overflow-hidden">
                            <div className="min-w-0 max-w-[65px] sm:max-w-[75px] shrink pr-1">
                              <span
                                className="text-[11px] font-display font-bold text-ink truncate block"
                                title={cand.candidate_name}
                              >
                                {cand.candidate_name}
                              </span>
                            </div>

                            <div className="flex items-center gap-1 shrink-0 whitespace-nowrap">
                              {/* Select Button */}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleSelectCandidate(cand.id);
                                }}
                                className={`h-6.5 w-6.5 rounded-md border flex items-center justify-center transition-all cursor-pointer ${
                                  isSelected
                                    ? "bg-electric border-electric text-white"
                                    : "border-[#bcd6fa] bg-white text-ink-soft hover:border-electric hover:text-electric hover:bg-electric/10"
                                }`}
                                title={isSelected ? "Deselect candidate" : "Select for shortlist pitch"}
                              >
                                <CheckSquare size={12} />
                              </button>

                              {/* Summary Button (Instant Right-Side Sheet) */}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSummaryApp(cand);
                                }}
                                className="h-6.5 w-6.5 rounded-md border border-[#bcd6fa] bg-white text-ink-soft hover:border-electric hover:text-electric hover:bg-electric/10 flex items-center justify-center transition-all cursor-pointer"
                                title="Open instant candidate summary dossier"
                              >
                                <FileText size={12} />
                              </button>

                              {/* Upgrade Stage (Only if next stage exists) */}
                              {nextStageInfo && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setMovingApp(cand);
                                    setTargetStage(nextStageInfo.key);
                                  }}
                                  className="h-6.5 w-6.5 rounded-md border border-[#bcd6fa] bg-white text-ink-soft hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 flex items-center justify-center transition-all cursor-pointer"
                                  title={`Upgrade to ${nextStageInfo.label}`}
                                >
                                  <ArrowRight size={12} />
                                </button>
                              )}

                              {/* View Application */}
                              <Link
                                href={`/recruiter/applications/${cand.id}`}
                                onClick={(e) => e.stopPropagation()}
                                className="h-6.5 w-6.5 rounded-md border border-[#bcd6fa] bg-white text-ink-soft hover:border-electric hover:text-electric hover:bg-electric/10 flex items-center justify-center transition-all cursor-pointer"
                                title="View full application"
                              >
                                <ExternalLink size={12} />
                              </Link>
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
        /* DATA SHEET TABLE VIEW */
        <div className="overflow-hidden rounded-2xl border border-[#bcd6fa] bg-white shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs table-fixed">
              <colgroup>
                <col className="w-10" />
                <col className="w-[34%]" />
                <col className="w-[30%]" />
                <col className="w-[14%]" />
                <col className="w-[10%]" />
                <col className="w-[12%]" />
              </colgroup>
              <thead className="border-b border-[#bcd6fa]/60 bg-canvas/70 font-display text-[11px] font-semibold uppercase tracking-wider text-mist">
                <tr>
                  <th className="px-4 py-3">
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
                  <th className="px-4 py-3 text-center">Stage</th>
                  <th className="px-4 py-3 text-center">Match</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#bcd6fa]/30">
                {filterList(allApplications).length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-mist">
                      No candidate applications match the selected criteria.
                    </td>
                  </tr>
                ) : (
                  filterList(allApplications).map((cand) => {
                    const isSelected = selectedAppIds.has(cand.id);
                    const nextStageInfo = NEXT_STAGE_MAP[cand.stage as StageKey];
                    const canScheduleInterview =
                      cand.stage === "technical_vetting" || cand.stage === "interview";

                    return (
                      <tr
                        key={cand.id}
                        className={`h-14 transition-colors hover:bg-canvas/50 ${
                          isSelected ? "bg-electric/[0.04]" : ""
                        }`}
                      >
                        {/* Checkbox */}
                        <td className="px-4 py-2.5">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectCandidate(cand.id)}
                            className="h-4 w-4 rounded border-[#bcd6fa] text-electric focus:ring-electric cursor-pointer"
                          />
                        </td>

                        {/* Specialist (Max 2 lines: Name + Location) */}
                        <td className="px-4 py-2.5">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-sky-400 to-indigo-600 text-white font-display text-[11px] font-bold shadow-2xs select-none">
                              {getInitials(cand.candidate_name)}
                            </div>
                            <div className="min-w-0 flex-1">
                              <Link
                                href={`/recruiter/applications/${cand.id}`}
                                className="truncate block font-display text-xs font-bold text-ink hover:text-electric transition-colors cursor-pointer"
                                title={cand.candidate_name}
                              >
                                {cand.candidate_name}
                              </Link>
                              <div className="truncate text-[11px] text-mist" title={cand.candidate_location}>
                                {cand.candidate_location || "Remote Specialist"}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Requisition & Client (Max 2 lines: Title + Client) */}
                        <td className="px-4 py-2.5">
                          <div className="min-w-0">
                            <div
                              className="truncate font-medium text-xs text-ink"
                              title={cand.requisition_title}
                            >
                              {cand.requisition_title}
                            </div>
                            <div
                              className="truncate text-[11px] text-mist"
                              title={cand.client_name}
                            >
                              {cand.client_name}
                            </div>
                          </div>
                        </td>

                        {/* Stage (Centered) */}
                        <td className="px-4 py-2.5 text-center">
                          <span className="inline-block truncate rounded-full border border-electric/30 bg-electric/10 px-2.5 py-0.5 font-mono text-[10.5px] font-bold text-electric">
                            {cand.stage.replace("_", " ").toUpperCase()}
                          </span>
                        </td>

                        {/* Match Score (Centered on column per user request) */}
                        <td className="px-4 py-2.5 text-center">
                          <span className="font-mono font-bold text-emerald-600 inline-block">
                            {cand.match_score || "N/A"}
                          </span>
                        </td>

                        {/* Action Icons (Lucide Icons Only: View, Summary, Upgrade Stage, Interview) */}
                        <td className="px-4 py-2.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* View Application Link */}
                            <Link
                              href={`/recruiter/applications/${cand.id}`}
                              className="rounded-lg border border-[#bcd6fa] bg-white p-1.5 text-ink-soft hover:border-electric hover:bg-electric/10 hover:text-electric transition-colors"
                              title="View full application"
                            >
                              <ExternalLink size={14} />
                            </Link>

                            {/* Summary Sheet */}
                            <button
                              type="button"
                              onClick={() => setSummaryApp(cand)}
                              className="rounded-lg border border-[#bcd6fa] bg-white p-1.5 text-ink-soft hover:border-electric hover:bg-electric/10 hover:text-electric transition-colors cursor-pointer"
                              title="Instant candidate dossier summary"
                            >
                              <FileText size={14} />
                            </button>

                            {/* Upgrade Stage (Only if next stage exists) */}
                            {nextStageInfo && (
                              <button
                                type="button"
                                onClick={() => {
                                  setMovingApp(cand);
                                  setTargetStage(nextStageInfo.key);
                                }}
                                className="rounded-lg border border-[#bcd6fa] bg-white p-1.5 text-ink-soft hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-600 transition-colors cursor-pointer"
                                title={`Upgrade to ${nextStageInfo.label}`}
                              >
                                <ArrowRight size={14} />
                              </button>
                            )}

                            {/* Schedule Interview: ONLY for its previous active stage (technical_vetting or interview) */}
                            {canScheduleInterview && (
                              <button
                                type="button"
                                onClick={() => setSchedulingApp(cand)}
                                className="rounded-lg border border-[#bcd6fa] bg-white p-1.5 text-ink-soft hover:border-amber-400 hover:bg-amber-50 hover:text-amber-600 transition-colors cursor-pointer"
                                title="Schedule interview"
                              >
                                <Calendar size={14} />
                              </button>
                            )}
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

      {/* Floating Bottom Bar for Shortlist Pitch */}
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
                onClick={handleExportExcel}
                className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/20 transition-colors cursor-pointer"
              >
                <Download size={13} />
                <span className="hidden sm:inline">Export Excel</span>
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

      {/* RIGHT-SIDE SHEET: Instant Candidate Dossier Summary */}
      {summaryApp && (
        <div className="fixed inset-0 z-50 flex justify-end bg-ink/40 backdrop-blur-xs">
          <div className="flex h-full w-full max-w-lg flex-col border-l border-[#bcd6fa] bg-white shadow-2xl animate-in slide-in-from-right duration-200">
            {/* Sheet Header */}
            <div className="flex items-center justify-between border-b border-[#bcd6fa]/60 px-6 py-5 bg-white">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-sky-400 via-blue-500 to-indigo-600 text-white font-display text-sm font-bold shadow-2xs">
                  {getInitials(summaryApp.candidate_name)}
                </div>
                <div>
                  <h2 className="font-display text-base font-bold text-ink">
                    {summaryApp.candidate_name}
                  </h2>
                  <div className="flex items-center gap-2 text-xs text-mist">
                    <span className="flex items-center gap-1">
                      <MapPin size={11} />
                      {summaryApp.candidate_location || "Remote"}
                    </span>
                    <span>&bull;</span>
                    <span className="font-mono text-emerald-600 font-bold">
                      {summaryApp.match_score} Match
                    </span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSummaryApp(null)}
                className="rounded-xl p-1.5 text-mist hover:bg-canvas hover:text-ink transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Sheet Body */}
            <div className="flex-1 space-y-5 overflow-y-auto p-6 text-xs text-ink-soft">
              {/* Telemetry Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="rounded-xl border border-[#bcd6fa]/70 bg-canvas/50 p-3">
                  <span className="font-mono text-[10px] text-mist uppercase font-semibold">Current Pipeline Stage</span>
                  <div className="mt-1 font-display text-xs font-bold text-electric">
                    {summaryApp.stage.replace("_", " ").toUpperCase()}
                  </div>
                </div>
                <div className="rounded-xl border border-[#bcd6fa]/70 bg-canvas/50 p-3">
                  <span className="font-mono text-[10px] text-mist uppercase font-semibold">Intake Source</span>
                  <div className="mt-1 font-display text-xs font-bold text-ink uppercase">
                    {summaryApp.source}
                  </div>
                </div>
              </div>

              {/* Job Requisition Target */}
              <div className="rounded-2xl border border-[#bcd6fa]/70 bg-canvas/40 p-4">
                <div className="flex items-center gap-2 font-display text-xs font-bold text-ink mb-2">
                  <Building2 size={13} className="text-electric" />
                  <span>Target Requisition &amp; Client</span>
                </div>
                <div className="space-y-1">
                  <div className="font-semibold text-ink text-xs">{summaryApp.requisition_title}</div>
                  <div className="text-[11px] text-mist">
                    Client: <span className="font-medium text-ink-soft">{summaryApp.client_name}</span>
                  </div>
                  {summaryApp.requisition_sector && (
                    <div className="text-[11px] text-mist">
                      Sector: <span className="font-medium text-ink-soft">{summaryApp.requisition_sector}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Information */}
              <div className="rounded-2xl border border-[#bcd6fa]/70 bg-white p-4">
                <div className="font-display text-xs font-bold text-ink mb-2">
                  Contact &amp; Identity
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-mist flex items-center gap-1.5">
                      <Mail size={12} />
                      Email
                    </span>
                    <span className="font-mono font-medium text-ink">
                      {summaryApp.candidate_email || "Protected by Escrow"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-mist flex items-center gap-1.5">
                      <Phone size={12} />
                      Phone
                    </span>
                    <span className="font-mono font-medium text-ink">
                      {summaryApp.candidate_phone || "Protected by Escrow"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Skills Tags */}
              {summaryApp.skills && summaryApp.skills.length > 0 && (
                <div>
                  <div className="mb-2 font-semibold text-ink">Technical Competencies</div>
                  <div className="flex flex-wrap gap-1.5">
                    {summaryApp.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="rounded-lg border border-[#bcd6fa]/70 bg-canvas px-2 py-1 text-[11px] font-medium text-ink"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Recruiter Audit Notes */}
              {summaryApp.note && (
                <div>
                  <div className="mb-1.5 font-semibold text-ink">Recruiter Audit Note</div>
                  <div className="rounded-xl border border-[#bcd6fa]/70 bg-canvas/30 p-3 text-xs leading-relaxed text-ink-soft">
                    {summaryApp.note}
                  </div>
                </div>
              )}
            </div>

            {/* Sheet Footer Quick Actions */}
            <div className="border-t border-[#bcd6fa]/60 p-5 bg-white">
              <div className="flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    toggleSelectCandidate(summaryApp.id);
                  }}
                  className={`rounded-xl border px-3 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                    selectedAppIds.has(summaryApp.id)
                      ? "bg-electric border-electric text-white"
                      : "border-[#bcd6fa] bg-white text-ink hover:bg-canvas"
                  }`}
                >
                  {selectedAppIds.has(summaryApp.id) ? "Selected for Pitch" : "Add to Pitch"}
                </button>

                {/* Upgrade Stage Trigger */}
                {NEXT_STAGE_MAP[summaryApp.stage as StageKey] && (
                  <button
                    type="button"
                    onClick={() => {
                      const next = NEXT_STAGE_MAP[summaryApp.stage as StageKey];
                      if (next) {
                        setMovingApp(summaryApp);
                        setTargetStage(next.key);
                        setSummaryApp(null);
                      }
                    }}
                    className="rounded-xl border border-electric/40 bg-electric/10 px-3.5 py-2 text-xs font-bold text-electric hover:bg-electric hover:text-white transition-colors cursor-pointer"
                  >
                    Upgrade to {NEXT_STAGE_MAP[summaryApp.stage as StageKey]?.label}
                  </button>
                )}

                {/* Schedule Interview (Only if technical_vetting or interview) */}
                {(summaryApp.stage === "technical_vetting" || summaryApp.stage === "interview") && (
                  <button
                    type="button"
                    onClick={() => {
                      setSchedulingApp(summaryApp);
                      setSummaryApp(null);
                    }}
                    className="rounded-xl border border-amber-400 bg-amber-50 px-3.5 py-2 text-xs font-bold text-amber-700 hover:bg-amber-100 transition-colors cursor-pointer"
                  >
                    Schedule Interview
                  </button>
                )}

                <Link
                  href={`/recruiter/applications/${summaryApp.id}`}
                  className="rounded-xl bg-ink px-4 py-2 font-display text-xs font-bold text-white hover:bg-electric transition-colors"
                >
                  Full Application
                </Link>
              </div>
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
                  className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 text-xs font-medium text-ink focus:border-electric focus:outline-none transition-all cursor-pointer"
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
                    onClick={handleExportExcel}
                    className="font-semibold text-electric hover:underline cursor-pointer"
                  >
                    Export Excel Dossier
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
                          {c.requisition_title}
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

      {/* RIGHT-SIDE SHEET: Upgrade Candidate Stage (Sequential Progression) */}
      {movingApp && (
        <div className="fixed inset-0 z-50 flex justify-end bg-ink/40 backdrop-blur-xs">
          <div className="flex h-full w-full max-w-md flex-col border-l border-[#bcd6fa] bg-white shadow-2xl animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between border-b border-[#bcd6fa]/60 px-6 py-5 bg-white">
              <div>
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-electric">
                  Pipeline Progression
                </span>
                <h2 className="mt-1 font-display text-lg font-bold text-ink">
                  Upgrade Candidate Stage
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
              {/* Candidate Info Card */}
              <div className="rounded-2xl border border-[#bcd6fa]/70 bg-canvas/50 p-3.5">
                <span className="font-mono text-[10px] text-mist uppercase font-semibold">Specialist</span>
                <div className="font-display text-xs font-bold text-ink">{movingApp.candidate_name}</div>
                <div className="text-[11px] text-mist">{movingApp.requisition_title}</div>
              </div>

              {/* Sequential Stage Upgrade Banner */}
              <div className="rounded-2xl border border-[#bcd6fa] bg-white p-4 shadow-2xs space-y-3">
                <div className="font-display text-xs font-bold text-ink">
                  Milestone Transition
                </div>
                <div className="flex items-center justify-between gap-2 p-3 rounded-xl bg-canvas border border-[#bcd6fa]/50">
                  <div className="text-center flex-1">
                    <span className="text-[10px] font-mono text-mist uppercase block">Current Stage</span>
                    <span className="mt-0.5 inline-block rounded-md bg-white border border-[#bcd6fa]/70 px-2 py-0.5 font-mono text-[11px] font-bold text-ink">
                      {STAGES.find((s) => s.key === movingApp.stage)?.badge || movingApp.stage.toUpperCase()}
                    </span>
                  </div>
                  <ChevronRight size={18} className="text-electric shrink-0" />
                  <div className="text-center flex-1">
                    <span className="text-[10px] font-mono text-mist uppercase block">Next Stage</span>
                    <span className="mt-0.5 inline-block rounded-md bg-electric text-white px-2 py-0.5 font-mono text-[11px] font-bold shadow-2xs">
                      {STAGES.find((s) => s.key === targetStage)?.badge || targetStage.toUpperCase()}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-ink-soft leading-relaxed">
                  Advancing specialist sequentially along the sprint verification pipeline. Multi-party credential and interview gate validations will be required in later sprint milestones.
                </p>
              </div>

              <div>
                <label className="mb-1.5 block font-semibold text-ink">
                  Recruiter Audit Remarks
                </label>
                <textarea
                  rows={4}
                  value={moveNote}
                  onChange={(e) => setMoveNote(e.target.value)}
                  placeholder="e.g. Cleared technical algorithm round with 95% test coverage. Ready for sprint milestone."
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
                  {isMoving
                    ? "Upgrading Stage..."
                    : `Confirm Upgrade to ${STAGES.find((s) => s.key === targetStage)?.label || targetStage}`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RIGHT-SIDE SHEET: Schedule Interview (Pure Booking; No stage moving here) */}
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
                <span className="font-mono text-[10px] text-mist uppercase font-semibold">Candidate</span>
                <div className="font-display text-xs font-bold text-ink">{schedulingApp.candidate_name}</div>
                <div className="text-[11px] text-mist">{schedulingApp.requisition_title}</div>
                <div className="mt-1 inline-block rounded-md bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10.5px] font-mono font-semibold text-amber-800">
                  Active Stage: {schedulingApp.stage.replace("_", " ").toUpperCase()}
                </div>
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
