"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ApplicationDetailData,
  updateRecruiterApplicationStageAction,
  addRecruiterApplicationNoteAction,
  scheduleInterviewAction,
  createShortlistSubmissionAction,
  ClientItem,
  ShortlistSubmissionItemInput,
  ValidatorItem,
} from "@/actions/recruiter.actions";
import {
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Clock,
  Users,
  Briefcase,
  Building2,
  ShieldCheck,
  Share2,
  FileText,
  Mail,
  Phone,
  Calendar,
  ExternalLink,
  ChevronRight,
  Plus,
  X,
  Zap,
  Check,
  Globe,
  Award,
} from "@/components/ui/Icons";

export interface AssessmentTemplateItem {
  id: string;
  title: string;
  category: string;
  sector: string;
  description?: string;
  instructions?: string;
  total_marks: number;
  marks_distribution?: Array<{ criterion: string; max_points: number; description?: string }>;
  prerequisites?: string[];
  allowed_validator_roles?: string[];
  is_active?: boolean;
}

interface Props {
  initialApplication: ApplicationDetailData;
  clients: ClientItem[];
  assessmentTemplates?: AssessmentTemplateItem[];
  validators?: ValidatorItem[];
}

type StageKey = "discovery" | "market_mapping" | "technical_vetting" | "interview" | "closed" | "rejected" | "withdrawn";

interface StageStep {
  key: StageKey;
  label: string;
  stepNum: number;
  subTitle: string;
  description: string;
}

const ATS_STAGES: StageStep[] = [
  { key: "discovery", label: "Discovery", stepNum: 1, subTitle: "Intake & Profiling", description: "CV parsing, work authorization, initial qualification" },
  { key: "market_mapping", label: "Market Mapping", stepNum: 2, subTitle: "Sourced & Screened", description: "Rate alignment, recruiter screening, requisition fit" },
  { key: "technical_vetting", label: "Technical Vetting", stepNum: 3, subTitle: "Assessment & Audit", description: "Code test, architecture review, clinical audit" },
  { key: "interview", label: "Client Interview", stepNum: 4, subTitle: "Live Panel Meeting", description: "Shortlist submission, panel interviews, client review" },
  { key: "closed", label: "Closed / Placed", stepNum: 5, subTitle: "Placement & Agreement", description: "Offer accepted, start date, 90-day guarantee" },
];

export function RecruiterApplicationDetailView({
  initialApplication,
  clients,
  assessmentTemplates = [],
  validators = [],
}: Props) {
  const router = useRouter();
  const [app, setApp] = useState<ApplicationDetailData>(initialApplication);

  // Toast feedback
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Recruiter Work Signature
  const [recruiterSignature, setRecruiterSignature] = useState("Mahim II (Senior Recruiter)");

  // Workstation Tab: "stage_work" (Sequential) vs "multi_jump" (Direct Override)
  const [activeTab, setActiveTab] = useState<"stage_work" | "multi_jump">("stage_work");

  // ==========================================
  // STAGE WORKSTATION STATE: POST-INFO & PRE-INFO
  // ==========================================

  // STAGE 1 (DISCOVERY)
  // Post-Info (Completing Discovery)
  const [discoveryMilestone, setDiscoveryMilestone] = useState("Profile Qualified");
  const [confirmedWorkAuth, setConfirmedWorkAuth] = useState(
    app.candidate.work_auth ? app.candidate.work_auth.toUpperCase().replace("_", " ") : "US Citizen"
  );
  const [discoveryNotes, setDiscoveryNotes] = useState("");

  // Pre-Info (Setup for Advancing to Stage 2: Market Mapping)
  const [targetScreeningChannel, setTargetScreeningChannel] = useState("Inbound Application");
  const [screeningDeadline, setScreeningDeadline] = useState(
    new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [stage2SubStage, setStage2SubStage] = useState("Sourced & Screened");

  // STAGE 2 (MARKET MAPPING)
  // Post-Info (Completing Market Mapping)
  const [screeningMilestone, setScreeningMilestone] = useState("Screening Passed");
  const [confirmedRateExpectation, setConfirmedRateExpectation] = useState(app.rate || "$105/hr");
  const [candidateAvailabilityTimeline, setCandidateAvailabilityTimeline] = useState("Immediate");
  const [marketNotes, setMarketNotes] = useState("");

  // Initial Assessment Template & Validator selection matched by Requisition sector
  const initialTemplate =
    assessmentTemplates.find(
      (t) => t.sector === app.requisition.sector || t.sector === "both"
    ) || assessmentTemplates[0];

  const initialValidator =
    validators.find(
      (v) => v.sector === (initialTemplate?.sector || app.requisition.sector)
    ) || validators[0];

  // Pre-Info (Setup for Advancing to Stage 3: Technical Vetting)
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(
    initialTemplate?.id || ""
  );
  const [selectedValidatorId, setSelectedValidatorId] = useState<string>(
    initialValidator?.id || ""
  );
  const [designatedVettingTrack, setDesignatedVettingTrack] = useState(
    initialTemplate?.title || "Distributed Systems & Cloud Architecture Review"
  );
  const [assignedValidator, setAssignedValidator] = useState(
    initialValidator?.full_name || "Dr. Marcus Vance"
  );
  const [assessmentDueDate, setAssessmentDueDate] = useState(
    new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [stage3SubStage, setStage3SubStage] = useState("Assessment Dispatched");

  // STAGE 3 (TECHNICAL VETTING)
  // Post-Info (Completing Technical Vetting)
  const [assessmentType, setAssessmentType] = useState<"coding_test" | "system_design" | "repo_review" | "clinical" | "behavioral">("coding_test");
  const [vettingScore, setVettingScore] = useState<number>(85);
  const [vettingVerdict, setVettingVerdict] = useState<"passed" | "failed" | "conditional">("passed");
  const [vettingNotes, setVettingNotes] = useState("");

  // Pre-Info (Setup for Advancing to Stage 4: Client Interview)
  const [interviewFormat, setInterviewFormat] = useState("technical_coding");
  const [interviewDateTime, setInterviewDateTime] = useState(
    `${new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]} 14:00 UTC`
  );
  const compactId = app.id.replace(/-/g, "").slice(0, 6);
  const [interviewMeetingLink, setInterviewMeetingLink] = useState(`https://meet.google.com/pek-${compactId.slice(0, 3)}-${compactId.slice(3, 6)}`);
  const [interviewPanelMembers, setInterviewPanelMembers] = useState("Lead Systems Architect & Hiring Manager");
  const [candidatePrepNotes, setCandidatePrepNotes] = useState("Please ensure a quiet workspace and prepare your code repository 5 minutes before scheduled start.");
  const [stage4SubStage, setStage4SubStage] = useState("Interview Scheduled");

  // STAGE 4 (CLIENT INTERVIEW)
  // Post-Info (Completing Client Interview)
  const [interviewOutcome, setInterviewOutcome] = useState("Client Offer Extended");
  const [interviewConsensusScore, setInterviewConsensusScore] = useState<number>(90);
  const [confirmedPlacementRate, setConfirmedPlacementRate] = useState(app.rate || "$110/hr");
  const [interviewNotes, setInterviewNotes] = useState("");

  // Pre-Info (Setup for Advancing to Stage 5: Closed / Placed)
  const [confirmedStartDate, setConfirmedStartDate] = useState(
    new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [agreementReference, setAgreementReference] = useState(`SOW-PEK-${new Date().getFullYear()}-${compactId.toUpperCase()}`);
  const [stage5SubStage, setStage5SubStage] = useState("Offer Accepted");

  // ==========================================
  // TAB B: MULTI-STAGE DIRECT OVERRIDE STATE
  // ==========================================
  const [directStage, setDirectStage] = useState<StageKey>(
    (app.stage.toLowerCase() as StageKey) || "market_mapping"
  );
  const [directSubStage, setDirectSubStage] = useState(app.sub_stage || "");
  const [directNote, setDirectNote] = useState("");

  // Dynamic Pre-info fields for Multi-Stage Jump
  const [directSelectedTemplateId, setDirectSelectedTemplateId] = useState<string>(
    initialTemplate?.id || ""
  );
  const [directSelectedValidatorId, setDirectSelectedValidatorId] = useState<string>(
    initialValidator?.id || ""
  );
  const [directAssessmentDueDate, setDirectAssessmentDueDate] = useState(
    new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [directVettingTrack, setDirectVettingTrack] = useState(
    initialTemplate?.title || "Distributed Systems & Cloud Architecture Review"
  );
  const [directAssignedValidator, setDirectAssignedValidator] = useState(
    initialValidator?.full_name || "Dr. Marcus Vance"
  );
  const [directInterviewFormat, setDirectInterviewFormat] = useState("technical_coding");
  const [directInterviewDate, setDirectInterviewDate] = useState(`${new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]} 14:00 UTC`);
  const [directMeetingLink, setDirectMeetingLink] = useState(`https://meet.google.com/pek-${compactId.slice(0, 3)}-${compactId.slice(3, 6)}`);
  const [directStartDate, setDirectStartDate] = useState(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]);
  const [directPlacementRate, setDirectPlacementRate] = useState(app.rate || "$110/hr");
  const [rejectionReasonCategory, setRejectionReasonCategory] = useState("Technical Benchmark Not Met");
  const [withdrawalReasonCategory, setWithdrawalReasonCategory] = useState("Accepted Another Offer");

  // Computed helper references for active templates and validators
  const selectedTemplate = assessmentTemplates.find((t) => t.id === selectedTemplateId) || initialTemplate;
  const selectedValidator = validators.find((v) => v.id === selectedValidatorId) || initialValidator;

  const directSelectedTemplate = assessmentTemplates.find((t) => t.id === directSelectedTemplateId) || initialTemplate;
  const directSelectedValidator = validators.find((v) => v.id === directSelectedValidatorId) || initialValidator;

  // Active vetting record on this application if already assigned
  const activeVetting = app.vettings && app.vettings.length > 0 ? app.vettings[0] : null;

  // Loading states
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [isLoggingNote, setIsLoggingNote] = useState(false);
  const [newNoteText, setNewNoteText] = useState("");

  // Side Drawers
  const [isSchedulingOpen, setIsSchedulingOpen] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const [drawerInterviewDate, setDrawerInterviewDate] = useState("Tomorrow at 2:00 PM EST");
  const [drawerInterviewType, setDrawerInterviewType] = useState("Technical Coding");
  const [drawerInterviewPanel, setDrawerInterviewPanel] = useState("Lead Architect & Client Technical Validator");

  const [isShortlistOpen, setIsShortlistOpen] = useState(false);
  const [isSubmittingShortlist, setIsSubmittingShortlist] = useState(false);
  const [selectedClient, setSelectedClient] = useState(app.requisition.client?.name || (clients[0]?.name || "Apex Financial Cloud Systems"));
  const [deliveryChannel, setDeliveryChannel] = useState<"email" | "im" | "client_ats" | "portal">("email");
  const [maskContact, setMaskContact] = useState(true);
  const [includeVetting, setIncludeVetting] = useState(true);
  const [includeRates, setIncludeRates] = useState(true);

  // Active stage index in 5-step pipeline
  const currentStageIndex = ATS_STAGES.findIndex((s) => s.key === app.stage.toLowerCase());

  // ==========================================
  // HANDLERS
  // ==========================================

  // Advance Sequential Next Stage (Executing Post-Info + Next Pre-Info)
  const handleAdvanceNextStage = async () => {
    if (!recruiterSignature.trim()) {
      showToast("Please provide your recruiter work signature before advancing.", "error");
      return;
    }

    setIsAdvancing(true);

    let targetStage: StageKey = "market_mapping";
    let subStage = "";
    let note = "";
    const payloadExtra: Record<string, any> = {};

    if (app.stage === "discovery") {
      targetStage = "market_mapping";
      subStage = stage2SubStage || "Sourced & Screened";
      note = `[Milestone: ${discoveryMilestone}] ${discoveryNotes || "Intake qualification completed and verified."} | Next: Market Mapping [Channel: ${targetScreeningChannel}] [Deadline: ${screeningDeadline}]`;
      payloadExtra.candidate_rate = confirmedRateExpectation;
    } else if (app.stage === "market_mapping") {
      targetStage = "technical_vetting";
      subStage = stage3SubStage || "Assessment Dispatched";
      const tmplTitle = selectedTemplate?.title || designatedVettingTrack;
      const valName = selectedValidator?.full_name || assignedValidator;
      note = `[Milestone: ${screeningMilestone}] ${marketNotes || "Screening passed. Rate and availability confirmed."} | Next: Technical Vetting [Template: ${tmplTitle}] [Validator: ${valName}] [Due: ${assessmentDueDate}]`;
      payloadExtra.template_id = selectedTemplateId || undefined;
      payloadExtra.vetting_track = tmplTitle;
      payloadExtra.primary_validator_id = selectedValidatorId || undefined;
      payloadExtra.assigned_validator = valName;
      payloadExtra.assessment_due_date = assessmentDueDate;
      payloadExtra.candidate_rate = confirmedRateExpectation;
    } else if (app.stage === "technical_vetting") {
      targetStage = "interview";
      subStage = stage4SubStage || "Interview Scheduled";
      note = `[Vetting Score: ${vettingScore}/100 - ${vettingVerdict.toUpperCase()}] ${vettingNotes || "Technical assessment certified."} | Next: Client Interview [Format: ${interviewFormat}] [Scheduled: ${interviewDateTime}] [Meet: ${interviewMeetingLink}]`;
      payloadExtra.vetting_score = vettingScore;
      payloadExtra.vetting_notes = vettingNotes;
      payloadExtra.assessment_type = assessmentType;
      payloadExtra.interview_format = interviewFormat;
      payloadExtra.interview_date = interviewDateTime;
      payloadExtra.meeting_link = interviewMeetingLink;
      payloadExtra.candidate_notes = candidatePrepNotes;
    } else if (app.stage === "interview") {
      targetStage = "closed";
      subStage = stage5SubStage || "Offer Accepted";
      note = `[Outcome: ${interviewOutcome} - Consensus: ${interviewConsensusScore}%] ${interviewNotes || "Client interview passed and offer extended."} | Next: Deployment [Start Date: ${confirmedStartDate}] [Agreed Rate: ${confirmedPlacementRate}] [Reference: ${agreementReference}]`;
      payloadExtra.placement_rate = confirmedPlacementRate;
      payloadExtra.placement_start_date = confirmedStartDate;
    }

    const res = await updateRecruiterApplicationStageAction(app.id, {
      stage: targetStage,
      sub_stage: subStage,
      note,
      recruiter_signature: recruiterSignature,
      ...payloadExtra,
    });

    setIsAdvancing(false);

    if (res.success) {
      showToast(`Application advanced to Stage: ${targetStage.replace("_", " ").toUpperCase()}`);
      setApp((prev) => {
        let updatedVettings = prev.vettings || [];
        if (targetStage === "technical_vetting" && selectedTemplate) {
          const newVetting = {
            id: `vet-${Date.now()}`,
            template_id: selectedTemplate.id,
            template_title: selectedTemplate.title,
            template_category: selectedTemplate.category,
            template_sector: selectedTemplate.sector,
            total_marks: selectedTemplate.total_marks,
            marks_distribution: selectedTemplate.marks_distribution,
            status: "in_progress",
            status_display: "In Progress",
            primary_validator_id: selectedValidator?.id,
            primary_validator_name: selectedValidator?.full_name,
            primary_validator_email: selectedValidator?.email,
            deadline: assessmentDueDate,
            pass_threshold: 70,
            decision_notes: "",
            recruiter_notes: note,
            created_at: new Date().toISOString(),
          };
          updatedVettings = [newVetting, ...updatedVettings];
        }
        return {
          ...prev,
          stage: targetStage,
          sub_stage: subStage,
          vettings: updatedVettings,
          candidate: {
            ...prev.candidate,
            vetting_status: payloadExtra.vetting_score ? (payloadExtra.vetting_score >= 70 ? "vetted" : "in_progress") : prev.candidate.vetting_status,
            profile_strength: payloadExtra.vetting_score ? Math.max(prev.candidate.profile_strength || 0, payloadExtra.vetting_score) : prev.candidate.profile_strength,
          },
          events: [
            {
              id: String(Date.now()),
              from_stage: prev.stage,
              to_stage: targetStage,
              sub_stage: subStage,
              actor_name: recruiterSignature,
              note: `[Signed: ${recruiterSignature}] ${note}`,
              timestamp: "Just Now",
            },
            ...prev.events,
          ],
        };
      });
      router.refresh();
    } else {
      showToast(res.error || "Failed to advance stage.", "error");
    }
  };

  // Handle Direct Stage Move (Multi-Stage Jump Override)
  const handleExecuteDirectMove = async () => {
    if (!directNote.trim()) {
      showToast("Please provide a transition audit note.", "error");
      return;
    }
    if (!recruiterSignature.trim()) {
      showToast("Please provide your recruiter work signature.", "error");
      return;
    }

    setIsAdvancing(true);

    const payloadExtra: Record<string, any> = {};
    if (directStage === "technical_vetting") {
      const tmplTitle = directSelectedTemplate?.title || directVettingTrack;
      const valName = directSelectedValidator?.full_name || directAssignedValidator;
      payloadExtra.template_id = directSelectedTemplateId || undefined;
      payloadExtra.vetting_track = tmplTitle;
      payloadExtra.primary_validator_id = directSelectedValidatorId || undefined;
      payloadExtra.assigned_validator = valName;
      payloadExtra.assessment_due_date = directAssessmentDueDate;
    } else if (directStage === "interview") {
      payloadExtra.interview_format = directInterviewFormat;
      payloadExtra.interview_date = directInterviewDate;
      payloadExtra.meeting_link = directMeetingLink;
    } else if (directStage === "closed") {
      payloadExtra.placement_rate = directPlacementRate;
      payloadExtra.placement_start_date = directStartDate;
    } else if (directStage === "rejected") {
      payloadExtra.rejection_reason = rejectionReasonCategory;
    } else if (directStage === "withdrawn") {
      payloadExtra.withdrawal_reason = withdrawalReasonCategory;
    }

    const res = await updateRecruiterApplicationStageAction(app.id, {
      stage: directStage,
      sub_stage: directSubStage.trim() || undefined,
      note: directNote.trim(),
      recruiter_signature: recruiterSignature,
      ...payloadExtra,
    });

    setIsAdvancing(false);

    if (res.success) {
      showToast(`Stage relocated to ${directStage.replace("_", " ").toUpperCase()}.`);
      setApp((prev) => ({
        ...prev,
        stage: directStage,
        sub_stage: directSubStage.trim() || prev.sub_stage,
        events: [
          {
            id: String(Date.now()),
            from_stage: prev.stage,
            to_stage: directStage,
            sub_stage: directSubStage.trim() || prev.sub_stage,
            actor_name: recruiterSignature,
            note: `[Signed: ${recruiterSignature}] ${directNote.trim()}`,
            timestamp: "Just Now",
          },
          ...prev.events,
        ],
      }));
      setDirectNote("");
      router.refresh();
    } else {
      showToast(res.error || "Failed to update stage.", "error");
    }
  };

  // Handle Quick Note Submission
  const handleAddInternalNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    setIsLoggingNote(true);
    const signedNote = recruiterSignature ? `[Signed: ${recruiterSignature}] ${newNoteText.trim()}` : newNoteText.trim();
    const res = await addRecruiterApplicationNoteAction(app.id, signedNote);
    setIsLoggingNote(false);

    if (res.success && res.data) {
      showToast("Audit note recorded.");
      setApp((prev) => ({
        ...prev,
        events: [res.data!, ...prev.events],
      }));
      setNewNoteText("");
    } else {
      showToast(res.error || "Failed to log note.", "error");
    }
  };

  // Handle Drawer Interview Scheduling
  const handleScheduleInterviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsScheduling(true);

    const res = await scheduleInterviewAction({
      candidate_name: app.candidate.full_name,
      candidate_email: app.candidate.email,
      role: app.requisition.title,
      interview_type: drawerInterviewType,
      scheduled_time: drawerInterviewDate,
      panel: drawerInterviewPanel,
      meeting_link: interviewMeetingLink,
    });

    setIsScheduling(false);

    if (res.success) {
      showToast(`Interview confirmed for ${app.candidate.full_name}. Calendar invite dispatched.`);
      setIsSchedulingOpen(false);

      if (app.stage !== "interview") {
        await updateRecruiterApplicationStageAction(app.id, {
          stage: "interview",
          sub_stage: "Panel Confirmed",
          note: `Live sprint interview booked for ${drawerInterviewDate} (${drawerInterviewType}) with panel: ${drawerInterviewPanel}. URL: ${interviewMeetingLink}`,
          recruiter_signature: recruiterSignature,
        });

        setApp((prev) => ({
          ...prev,
          stage: "interview",
          sub_stage: "Panel Confirmed",
          events: [
            {
              id: String(Date.now()),
              from_stage: prev.stage,
              to_stage: "interview",
              sub_stage: "Panel Confirmed",
              actor_name: recruiterSignature,
              note: `[Signed: ${recruiterSignature}] Live sprint interview booked for ${drawerInterviewDate} (${drawerInterviewType}).`,
              timestamp: "Just Now",
            },
            ...prev.events,
          ],
        }));
      }
    } else {
      showToast(res.error || "Failed to schedule interview.", "error");
    }
  };

  // Handle Drawer Shortlist Submission
  const handleSubmitShortlist = async () => {
    setIsSubmittingShortlist(true);

    const item: ShortlistSubmissionItemInput = {
      candidate_id: app.candidate.id,
      candidate_name: app.candidate.full_name,
      candidate_title: app.requisition.title,
      sector: app.requisition.sector,
      experience: `${app.candidate.level || "Senior"} Specialist (Vetted)`,
      rate: includeRates ? app.rate : "Confidential",
      match_score: app.match_score,
      skills: app.candidate.skills.map((s) => s.name),
      revealed_fields: {
        show_contact: !maskContact,
        show_vetting: includeVetting,
        show_rates: includeRates,
      },
    };

    const res = await createShortlistSubmissionAction({
      requisition_id: app.requisition.id,
      client_name: selectedClient,
      channel: deliveryChannel,
      items: [item],
    });

    setIsSubmittingShortlist(false);

    if (res.success) {
      showToast(`Shortlist delivered to ${selectedClient} via ${deliveryChannel.toUpperCase()}.`);
      setIsShortlistOpen(false);
    } else {
      showToast(res.error || "Failed to deliver shortlist.", "error");
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Toast Feedback */}
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

      {/* ======================================================== */}
      {/* 1. CANDIDATE PROFILE & AVAILABILITY CARD (NO JOB INFO)     */}
      {/* Starts directly with candidate profile component          */}
      {/* ======================================================== */}
      <div className="rounded-2xl border border-[#bcd6fa] bg-white p-5 shadow-2xs space-y-5">
        {/* Top Header: Candidate Identity & Quick Metrics */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 border-b border-[#bcd6fa]/40 pb-5">
          <div className="flex items-start gap-4">
            <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-ink to-ink-soft font-display text-lg font-bold text-white shadow-xs">
              {app.candidate.full_name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-white text-[8px] font-bold text-white">
                ✓
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display text-xl font-bold text-ink">
                  {app.candidate.full_name}
                </h1>
                <span className="rounded-md border border-[#bcd6fa]/70 bg-canvas px-2 py-0.5 text-[10.5px] font-mono font-semibold uppercase text-ink">
                  {app.candidate.level || "Senior Specialist"}
                </span>
                <span className="rounded-md bg-electric/10 border border-electric/30 px-2 py-0.5 text-[10.5px] font-mono font-semibold text-electric uppercase">
                  {app.source}
                </span>
                <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10.5px] font-mono font-bold text-emerald-700">
                  AI Fit: {app.match_score}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-soft pt-0.5">
                <div className="flex items-center gap-1.5 font-mono text-[11px] text-mist">
                  <span>Application:</span>
                  <span className="font-bold text-ink font-mono">#{app.id.slice(-6).toUpperCase()}</span>
                </div>
                {app.applied_at && (
                  <div className="flex items-center gap-1.5 font-mono text-[11px] text-mist">
                    <span>Applied:</span>
                    <span className="text-ink-soft font-medium">{app.applied_at}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-xs text-ink-soft">
                  <Globe size={13} className="text-mist" />
                  <span>{app.candidate.location} ({app.candidate.timezone || "EST"})</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="flex items-center gap-5 border-t lg:border-t-0 lg:border-l border-[#bcd6fa]/50 pt-4 lg:pt-0 lg:pl-6 text-xs shrink-0">
            <div>
              <div className="font-mono text-[10px] uppercase text-mist font-semibold">Billing Rate</div>
              <div className="font-display text-lg font-bold text-ink">{app.rate}</div>
            </div>
            <div className="h-8 w-px bg-[#bcd6fa]/40" />
            <div>
              <div className="font-mono text-[10px] uppercase text-mist font-semibold">Profile Strength</div>
              <div className="font-display text-lg font-bold text-electric">
                {app.candidate.profile_strength}%
              </div>
            </div>
            <div className="h-8 w-px bg-[#bcd6fa]/40" />
            <div>
              <div className="font-mono text-[10px] uppercase text-mist font-semibold">Vetting Status</div>
              <div className={`font-display text-xs font-bold uppercase ${
                app.candidate.vetting_status === "vetted" ? "text-emerald-700" : "text-amber-600"
              }`}>
                {app.candidate.vetting_status.replace("_", " ")}
              </div>
            </div>
          </div>
        </div>

        {/* Candidate Contact, Availability & Preferences Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="space-y-1">
            <span className="text-[11px] font-mono text-mist uppercase font-semibold">Direct Email</span>
            <div className="flex items-center gap-2 text-ink font-medium">
              <Mail size={13} className="text-mist shrink-0" />
              <a href={`mailto:${app.candidate.email}`} className="hover:text-electric underline truncate">
                {app.candidate.email || "Confidential via platform"}
              </a>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-mono text-mist uppercase font-semibold">Phone Contact</span>
            <div className="flex items-center gap-2 text-ink font-medium">
              <Phone size={13} className="text-mist shrink-0" />
              <span>{app.candidate.phone || "Verified in platform"}</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-mono text-mist uppercase font-semibold">Deployment Availability</span>
            <div className="text-ink font-medium">
              {app.candidate.availability_date || "Immediate Sprint Deployment"}
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-mono text-mist uppercase font-semibold">Work Authorization</span>
            <div>
              <span className="rounded-md bg-canvas border border-[#bcd6fa]/70 px-2 py-0.5 text-[10.5px] font-mono font-semibold text-ink">
                {app.candidate.work_auth ? app.candidate.work_auth.toUpperCase().replace("_", " ") : "US AUTHORIZED"}
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-mono text-mist uppercase font-semibold">Engagement Preferences</span>
            <div className="flex flex-wrap gap-1 mt-0.5">
              {app.candidate.engagement_prefs?.map((pref, i) => (
                <span key={i} className="rounded bg-canvas border border-[#bcd6fa]/50 px-1.5 py-0.5 text-[10px] font-mono text-ink-soft">
                  {pref.toUpperCase()}
                </span>
              ))}
              {(!app.candidate.engagement_prefs || app.candidate.engagement_prefs.length === 0) && (
                <span className="text-ink font-medium">Full Requisition (W2/C2C)</span>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-mono text-mist uppercase font-semibold">Compensation Range</span>
            <div className="text-ink font-semibold font-mono">
              ${app.candidate.expected_comp_min || 95} - ${app.candidate.expected_comp_max || 140}/hr
            </div>
          </div>

          <div className="space-y-1 sm:col-span-2">
            <span className="text-[11px] font-mono text-mist uppercase font-semibold">External Profiles</span>
            <div className="flex flex-wrap items-center gap-2 mt-0.5">
              {app.candidate.portfolio_url && (
                <a
                  href={app.candidate.portfolio_url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg border border-[#bcd6fa] bg-white px-2.5 py-1 text-[11px] font-semibold text-ink hover:border-electric hover:text-electric transition-colors inline-flex items-center gap-1"
                >
                  <Globe size={11} />
                  <span>Portfolio</span>
                  <ExternalLink size={10} />
                </a>
              )}
              {app.candidate.github_url && (
                <a
                  href={app.candidate.github_url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg border border-[#bcd6fa] bg-white px-2.5 py-1 text-[11px] font-semibold text-ink hover:border-electric hover:text-electric transition-colors inline-flex items-center gap-1"
                >
                  <span>GitHub</span>
                  <ExternalLink size={10} />
                </a>
              )}
              {app.candidate.linkedin_url && (
                <a
                  href={app.candidate.linkedin_url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg border border-[#bcd6fa] bg-white px-2.5 py-1 text-[11px] font-semibold text-ink hover:border-electric hover:text-electric transition-colors inline-flex items-center gap-1"
                >
                  <span>LinkedIn</span>
                  <ExternalLink size={10} />
                </a>
              )}
              {!app.candidate.portfolio_url && !app.candidate.github_url && !app.candidate.linkedin_url && (
                <span className="text-mist text-xs">Direct platform application</span>
              )}
            </div>
          </div>
        </div>

        {/* Professional Bio */}
        {app.candidate.bio && (
          <div className="pt-3 border-t border-[#bcd6fa]/40">
            <span className="text-[11px] font-mono text-mist uppercase font-semibold block mb-1">
              Candidate Professional Bio
            </span>
            <p className="text-xs text-ink-soft leading-relaxed bg-canvas/40 p-3 rounded-xl border border-[#bcd6fa]/40">
              {app.candidate.bio}
            </p>
          </div>
        )}

        {/* Skills & Documents Sub-Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-[#bcd6fa]/40">
          {/* Assessed Skills */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-mist uppercase font-semibold">
                Assessed Skills ({app.candidate.skills.length})
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {app.candidate.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 rounded-lg border border-[#bcd6fa]/60 bg-canvas/40 px-2.5 py-1 text-[11px] text-ink font-medium"
                >
                  <span className="font-semibold">{skill.name}</span>
                  <span className="text-[10px] text-mist capitalize">({skill.years_experience}y)</span>
                </span>
              ))}
              {app.candidate.skills.length === 0 && (
                <span className="text-xs text-mist">Skills parsed directly from CV document.</span>
              )}
            </div>
          </div>

          {/* Uploaded Documents */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-mist uppercase font-semibold">
                CV &amp; Documents ({app.candidate.documents.length})
              </span>
            </div>
            <div className="space-y-1.5">
              {app.candidate.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between rounded-lg border border-[#bcd6fa]/60 bg-canvas/30 px-2.5 py-1.5 text-xs"
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileText size={13} className="text-electric shrink-0" />
                    <span className="font-semibold text-ink truncate">{doc.original_filename}</span>
                  </div>
                  <span className="rounded bg-emerald-50 text-emerald-700 font-mono text-[9.5px] font-bold px-1.5 py-0.5 border border-emerald-200 shrink-0">
                    {doc.scan_status.toUpperCase()}
                  </span>
                </div>
              ))}
              {app.candidate.documents.length === 0 && (
                <span className="text-xs text-mist">Profile parsed directly from intake form.</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. ROW 2: 2 CARDS IN A ROW (PIPELINE LEFT + JOB INFO RIGHT) */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* LEFT CARD: 5-Step Enterprise Delivery Pipeline */}
        <div className="rounded-2xl border border-[#bcd6fa] bg-white p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#bcd6fa]/40 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-electric animate-pulse" />
                <h2 className="font-display text-xs font-bold uppercase tracking-wider text-ink">
                  5-Step Enterprise Delivery Pipeline
                </h2>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-mono">
                <span className="text-mist">Active:</span>
                <span className="rounded-full bg-electric/10 border border-electric/30 px-2 py-0.5 font-bold text-electric uppercase text-[10px]">
                  {app.stage.replace("_", " ")}
                </span>
                {app.sub_stage && <span className="text-ink-soft text-[10px]">({app.sub_stage})</span>}
              </div>
            </div>

            {/* Stepper items in compact stacked layout */}
            <div className="space-y-2.5">
              {ATS_STAGES.map((s, idx) => {
                const isCompleted = currentStageIndex > idx;
                const isCurrent = currentStageIndex === idx;

                return (
                  <div
                    key={s.key}
                    className={`flex items-center justify-between rounded-xl border p-2.5 transition-all ${
                      isCurrent
                        ? "border-electric bg-electric/[0.06] shadow-2xs ring-1 ring-electric/30"
                        : isCompleted
                        ? "border-emerald-200 bg-emerald-50/40"
                        : "border-[#bcd6fa]/50 bg-canvas/30 opacity-70"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10.5px] font-bold font-mono ${
                          isCurrent
                            ? "bg-electric text-white"
                            : isCompleted
                            ? "bg-emerald-600 text-white"
                            : "bg-white border border-[#bcd6fa] text-mist"
                        }`}
                      >
                        {isCompleted ? <Check size={12} /> : s.stepNum}
                      </span>
                      <div>
                        <div className="font-display text-xs font-bold text-ink">{s.label}</div>
                        <div className="text-[10.5px] text-mist">{s.subTitle}</div>
                      </div>
                    </div>

                    <div>
                      {isCurrent && (
                        <span className="rounded-full bg-electric/20 px-2 py-0.5 text-[9.5px] font-mono font-bold text-electric uppercase">
                          ACTIVE
                        </span>
                      )}
                      {isCompleted && (
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9.5px] font-mono font-bold text-emerald-800 uppercase">
                          DONE
                        </span>
                      )}
                      {!isCurrent && !isCompleted && (
                        <span className="rounded-full bg-canvas border border-[#bcd6fa]/60 px-2 py-0.5 text-[9px] font-mono text-mist uppercase">
                          UPCOMING
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#bcd6fa]/40 flex items-center justify-between text-[11px] text-ink-soft">
            <span>Enterprise SLA Pipeline</span>
            <span className="font-mono text-mist">7-Day Sprint Delivery Standard</span>
          </div>
        </div>

        {/* RIGHT CARD: Target Requisition & Client Specification */}
        <div className="rounded-2xl border border-[#bcd6fa] bg-white p-5 shadow-2xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#bcd6fa]/40 pb-3">
              <div className="flex items-center gap-2">
                <Briefcase size={14} className="text-electric" />
                <h2 className="font-display text-xs font-bold uppercase tracking-wider text-ink">
                  Target Requisition &amp; Client Specification
                </h2>
              </div>
              <Link
                href="/recruiter/requisitions"
                className="text-xs font-semibold text-electric hover:underline inline-flex items-center gap-1"
              >
                <span>Requisitions</span>
                <ChevronRight size={12} />
              </Link>
            </div>

            <div>
              <h3 className="font-display text-base font-bold text-ink">
                {app.requisition.title}
              </h3>
              <div className="flex items-center gap-1.5 text-xs font-medium text-ink-soft mt-1">
                <Building2 size={13} className="text-mist shrink-0" />
                <span>{app.requisition.client?.name || "Enterprise Partner"}</span>
                <span>&bull;</span>
                <span className="capitalize">{app.requisition.sector}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs bg-canvas/40 p-3 rounded-xl border border-[#bcd6fa]/50">
              <div>
                <span className="text-[10px] font-mono text-mist uppercase block">Target Level</span>
                <span className="font-semibold text-ink capitalize">{app.requisition.level || "Senior"}</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-mist uppercase block">Engagement</span>
                <span className="font-semibold text-ink">{app.requisition.engagement || "Staff Augmentation"}</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-mist uppercase block">Headcount</span>
                <span className="font-semibold text-ink">{app.requisition.headcount} Specialist(s)</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-mist uppercase block">Budget Range</span>
                <span className="font-mono font-semibold text-ink">
                  ${app.requisition.budget_min || 95} - ${app.requisition.budget_max || 140}/hr
                </span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-[10px] font-mono text-mist uppercase block">Location / Work Mode</span>
                <span className="font-semibold text-ink truncate block">
                  {app.requisition.location || "100% Remote (US/EU)"}
                </span>
              </div>
            </div>

            <p className="text-xs text-ink-soft leading-relaxed line-clamp-2">
              {app.requisition.description || "Active enterprise requisition deployed under Pepoltek 7-day delivery SLA."}
            </p>

            {/* Requisition Required Skills */}
            {app.requisition.skills && app.requisition.skills.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono text-mist uppercase font-semibold block">
                  Requisition Required Skills
                </span>
                <div className="flex flex-wrap gap-1">
                  {app.requisition.skills.map((s, idx) => (
                    <span
                      key={idx}
                      className="rounded bg-white border border-[#bcd6fa] px-2 py-0.5 text-[10px] font-mono font-medium text-ink"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-[#bcd6fa]/40 flex items-center justify-between text-xs">
            <span className="text-mist font-mono text-[11px]">ID: #{app.requisition.id.slice(-6).toUpperCase()}</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsSchedulingOpen(true)}
                className="rounded-lg border border-amber-300 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-800 hover:bg-amber-100 transition-colors cursor-pointer"
              >
                Schedule Panel
              </button>
              <button
                type="button"
                onClick={() => setIsShortlistOpen(true)}
                className="rounded-lg border border-electric/30 bg-electric/10 px-2.5 py-1 text-[11px] font-semibold text-electric hover:bg-electric/20 transition-colors cursor-pointer"
              >
                Pitch Shortlist
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. ROW 3: FULL-WIDTH ATS STAGE WORKSTATION (2 TABS)       */}
      {/* ======================================================== */}
      <div className="rounded-2xl border border-[#bcd6fa] bg-white p-5 shadow-2xs space-y-5">
        {/* Workstation Top Navigation Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#bcd6fa]/40 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-electric/10 text-electric">
              <Zap size={16} />
            </div>
            <div>
              <h2 className="font-display text-base font-bold text-ink">
                ATS Stage Workstation
              </h2>
              <p className="text-[11px] text-mist">
                Current Pipeline Stage: <span className="font-semibold text-ink uppercase">{app.stage.replace("_", " ")}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* 2 Tabs */}
            <div className="inline-flex rounded-xl border border-[#bcd6fa] bg-canvas p-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab("stage_work")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === "stage_work"
                    ? "bg-white text-electric font-bold shadow-2xs"
                    : "text-ink-soft hover:text-ink"
                }`}
              >
                Stage Work (Sequential)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("multi_jump")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === "multi_jump"
                    ? "bg-white text-electric font-bold shadow-2xs"
                    : "text-ink-soft hover:text-ink"
                }`}
              >
                Multi-Stage Jump (Direct Override)
              </button>
            </div>
          </div>
        </div>

        {/* Staff Signature Strip */}
        <div className="flex items-center gap-2 rounded-xl border border-[#bcd6fa]/60 bg-canvas/40 px-3.5 py-2 text-xs">
          <span className="text-[10.5px] font-mono uppercase text-mist font-semibold shrink-0">
            Staff Signature:
          </span>
          <input
            type="text"
            value={recruiterSignature}
            onChange={(e) => setRecruiterSignature(e.target.value)}
            placeholder="e.g. Mahim II (Senior Recruiter)"
            className="w-full bg-transparent text-xs font-semibold text-ink focus:outline-none"
          />
        </div>

        {/* ==================================================== */}
        {/* TAB 1: STAGE WORK (SEQUENTIAL WORKFLOW)              */}
        {/* Left Side: Current Stage Required Info (Post-Info)   */}
        {/* Right Side: Next Step Selection & Setup (Pre-Info)   */}
        {/* ==================================================== */}
        {activeTab === "stage_work" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              {/* ---------------------------------------------- */}
              {/* LEFT COLUMN: CURRENT STAGE REQUIRED INFO       */}
              {/* ---------------------------------------------- */}
              <div className="rounded-xl border border-[#bcd6fa]/70 bg-canvas/20 p-4 space-y-4">
                <div className="border-b border-[#bcd6fa]/40 pb-2.5">
                  <span className="rounded bg-electric/10 text-electric font-mono text-[10px] font-bold px-2 py-0.5 border border-electric/30 uppercase">
                    Stage {currentStageIndex + 1} Current Work
                  </span>
                  <h3 className="mt-1 font-display text-sm font-bold text-ink">
                    Current Stage Completion Requirements
                  </h3>
                  <p className="text-[11px] text-ink-soft">
                    Verify and fulfill all deliverables required for Stage {currentStageIndex + 1} ({app.stage.replace("_", " ")}).
                  </p>
                </div>

                {/* STAGE 1 POST-INFO: DISCOVERY */}
                {app.stage === "discovery" && (
                  <div className="space-y-3 text-xs">
                    <div className="space-y-1.5 rounded-xl border border-blue-200 bg-blue-50/50 p-3">
                      <div className="font-semibold text-blue-900">Intake Checklist Verification:</div>
                      <div className="flex items-center gap-2 text-blue-800 text-[11px]">
                        <Check size={12} className="text-emerald-600 shrink-0" />
                        <span>CV Resume parsed &amp; verified</span>
                      </div>
                      <div className="flex items-center gap-2 text-blue-800 text-[11px]">
                        <Check size={12} className="text-emerald-600 shrink-0" />
                        <span>Work Authorization: {app.candidate.work_auth ? app.candidate.work_auth.toUpperCase().replace("_", " ") : "US Authorized"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-blue-800 text-[11px]">
                        <Check size={12} className="text-emerald-600 shrink-0" />
                        <span>Timezone Alignment: {app.candidate.timezone || "EST"}</span>
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 block font-semibold text-ink">
                        Initial Qualification Decision
                      </label>
                      <select
                        value={discoveryMilestone}
                        onChange={(e) => setDiscoveryMilestone(e.target.value)}
                        className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 text-xs font-medium text-ink focus:border-electric focus:outline-none transition-all cursor-pointer"
                      >
                        <option value="Profile Qualified">Profile Qualified</option>
                        <option value="In Review">In Review</option>
                        <option value="Fast-Tracked Specialist">Fast-Tracked Specialist</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-1 block font-semibold text-ink">
                        Confirmed Work Authorization
                      </label>
                      <select
                        value={confirmedWorkAuth}
                        onChange={(e) => setConfirmedWorkAuth(e.target.value)}
                        className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 text-xs font-medium text-ink focus:border-electric focus:outline-none transition-all cursor-pointer"
                      >
                        <option value="US Citizen">US Citizen</option>
                        <option value="Green Card">Green Card Holder</option>
                        <option value="OPT / STEM">OPT / STEM Extension</option>
                        <option value="H-1B">H-1B Visa (Transferable)</option>
                        <option value="International Remote">International Remote</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-1 block font-semibold text-ink">
                        Recruiter Qualification Notes
                      </label>
                      <textarea
                        rows={3}
                        value={discoveryNotes}
                        onChange={(e) => setDiscoveryNotes(e.target.value)}
                        placeholder="e.g. Candidate confirmed W2/C2C eligibility and availability. Skills align with requisition requirements."
                        className="w-full rounded-xl border border-[#bcd6fa] bg-white p-2.5 text-xs font-medium text-ink placeholder-mist focus:border-electric focus:outline-none transition-all"
                      />
                    </div>
                  </div>
                )}

                {/* STAGE 2 POST-INFO: MARKET MAPPING */}
                {app.stage === "market_mapping" && (
                  <div className="space-y-3 text-xs">
                    <div className="space-y-1.5 rounded-xl border border-indigo-200 bg-indigo-50/50 p-3">
                      <div className="font-semibold text-indigo-900">Sourcing &amp; Screening Checklist:</div>
                      <div className="flex items-center gap-2 text-indigo-800 text-[11px]">
                        <Check size={12} className="text-emerald-600 shrink-0" />
                        <span>Candidate interest verified for role</span>
                      </div>
                      <div className="flex items-center gap-2 text-indigo-800 text-[11px]">
                        <Check size={12} className="text-emerald-600 shrink-0" />
                        <span>Compensation expectation aligned to budget</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="mb-1 block font-semibold text-ink">
                          Confirmed Hourly Rate
                        </label>
                        <input
                          type="text"
                          value={confirmedRateExpectation}
                          onChange={(e) => setConfirmedRateExpectation(e.target.value)}
                          placeholder="e.g. $105/hr"
                          className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 text-xs font-bold text-ink focus:border-electric focus:outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block font-semibold text-ink">
                          Confirmed Availability
                        </label>
                        <select
                          value={candidateAvailabilityTimeline}
                          onChange={(e) => setCandidateAvailabilityTimeline(e.target.value)}
                          className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 text-xs font-medium text-ink focus:border-electric focus:outline-none transition-all cursor-pointer"
                        >
                          <option value="Immediate">Immediate</option>
                          <option value="2 Weeks Notice">2 Weeks Notice</option>
                          <option value="1 Month Notice">1 Month Notice</option>
                          <option value="Flexible">Flexible</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 block font-semibold text-ink">
                        Screening Milestone
                      </label>
                      <select
                        value={screeningMilestone}
                        onChange={(e) => setScreeningMilestone(e.target.value)}
                        className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 text-xs font-medium text-ink focus:border-electric focus:outline-none transition-all cursor-pointer"
                      >
                        <option value="Screening Passed">Screening Passed (Ready for Test)</option>
                        <option value="Rate Confirmed">Rate Confirmed &amp; Aligned</option>
                        <option value="Requisition Fit Confirmed">Requisition Fit Confirmed</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-1 block font-semibold text-ink">
                        Recruiter Screening Debrief Notes
                      </label>
                      <textarea
                        rows={3}
                        value={marketNotes}
                        onChange={(e) => setMarketNotes(e.target.value)}
                        placeholder="e.g. Spoke with candidate. Strong match on distributed systems. Target rate within budget."
                        className="w-full rounded-xl border border-[#bcd6fa] bg-white p-2.5 text-xs font-medium text-ink placeholder-mist focus:border-electric focus:outline-none transition-all"
                      />
                    </div>
                  </div>
                )}

                {/* STAGE 3 POST-INFO: TECHNICAL VETTING */}
                {app.stage === "technical_vetting" && (
                  <div className="space-y-3 text-xs">
                    {/* Active Vetting Live Dossier from DB */}
                    {activeVetting ? (
                      <div className="rounded-xl border border-electric/30 bg-electric/5 p-3.5 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Award size={15} className="text-electric" />
                            <span className="font-bold text-ink">{activeVetting.template_title}</span>
                          </div>
                          <span className={`rounded-full px-2 py-0.5 font-mono text-[10px] font-bold uppercase border ${
                            activeVetting.status === 'passed' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                            activeVetting.status === 'failed' ? 'bg-rose-100 text-rose-800 border-rose-300' :
                            'bg-electric/15 text-electric border-electric/30'
                          }`}>
                            {activeVetting.status_display || activeVetting.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[11px] text-mist pt-1">
                          <div>
                            <span className="text-ink-soft">Primary Validator:</span>{" "}
                            <span className="font-semibold text-ink">{activeVetting.primary_validator_name || "Assigned Assessor"}</span>
                          </div>
                          <div>
                            <span className="text-ink-soft">Target Due Date:</span>{" "}
                            <span className="font-mono text-ink">{activeVetting.deadline || "Within 4 Days"}</span>
                          </div>
                          <div>
                            <span className="text-ink-soft">Pass Threshold:</span>{" "}
                            <span className="font-mono font-bold text-ink">{activeVetting.pass_threshold || 70} / {activeVetting.total_marks || 100} Marks</span>
                          </div>
                          <div>
                            <span className="text-ink-soft">Sector:</span>{" "}
                            <span className="capitalize text-ink">{activeVetting.template_sector}</span>
                          </div>
                        </div>

                        {activeVetting.marks_distribution && activeVetting.marks_distribution.length > 0 && (
                          <div className="pt-2 border-t border-electric/15 space-y-1">
                            <div className="text-[10px] font-bold uppercase tracking-wider text-mist">Scoring Rubric Breakdown</div>
                            <div className="space-y-1">
                              {activeVetting.marks_distribution.map((crit, idx) => (
                                <div key={idx} className="flex items-center justify-between text-[11px] bg-white/70 rounded-lg px-2 py-1 border border-[#bcd6fa]/40">
                                  <span className="font-medium text-ink">{crit.criterion}</span>
                                  <span className="font-mono font-bold text-electric text-[10px]">{crit.max_points} pts</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="pt-1 flex items-center justify-between text-[11px]">
                          <Link
                            href={`/recruiter/assessments/${activeVetting.template_id}`}
                            className="text-electric hover:underline font-semibold flex items-center gap-1"
                          >
                            <span>Open Assessment Template in Library</span>
                            <ArrowRight size={11} />
                          </Link>
                          <span className="text-[10px] text-mist font-mono">
                            Assigned: {activeVetting.created_at ? activeVetting.created_at.slice(0, 10) : "Active"}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1.5 rounded-xl border border-purple-200 bg-purple-50/50 p-3">
                        <div className="font-semibold text-purple-900">Vetting Audit &amp; Rubric:</div>
                        <div className="flex items-center gap-2 text-purple-800 text-[11px]">
                          <Check size={12} className="text-emerald-600 shrink-0" />
                          <span>Hands-on assessment queued</span>
                        </div>
                        <div className="flex items-center gap-2 text-purple-800 text-[11px]">
                          <Check size={12} className="text-emerald-600 shrink-0" />
                          <span>Passing threshold: 70/100 points</span>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="mb-1 block font-semibold text-ink">
                          Assessment Format
                        </label>
                        <select
                          value={assessmentType}
                          onChange={(e) => setAssessmentType(e.target.value as any)}
                          className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 text-xs font-medium text-ink focus:border-electric focus:outline-none transition-all cursor-pointer"
                        >
                          <option value="coding_test">Coding Test</option>
                          <option value="system_design">System Design Review</option>
                          <option value="repo_review">Repo &amp; Architecture Audit</option>
                          <option value="behavioral">Behavioral (HEXACO/BEI)</option>
                          <option value="clinical">Clinical Credential Audit</option>
                        </select>
                      </div>

                      <div>
                        <label className="mb-1 block font-semibold text-ink">
                          Score (0-100)
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min={0}
                            max={100}
                            value={vettingScore}
                            onChange={(e) => setVettingScore(Math.max(0, Math.min(100, Number(e.target.value) || 0)))}
                            className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 text-xs font-bold text-ink focus:border-electric focus:outline-none transition-all"
                          />
                          <span className={`rounded-lg px-2 py-1 text-[10px] font-mono font-bold shrink-0 ${
                            vettingScore >= 70 ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                          }`}>
                            {vettingScore >= 70 ? "PASSED" : "REVIEW"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 block font-semibold text-ink">
                        Vetting Verdict
                      </label>
                      <select
                        value={vettingVerdict}
                        onChange={(e) => setVettingVerdict(e.target.value as any)}
                        className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 text-xs font-medium text-ink focus:border-electric focus:outline-none transition-all cursor-pointer"
                      >
                        <option value="passed">Passed (Score &gt;= 70)</option>
                        <option value="conditional">Conditional Pass (Requires Review)</option>
                        <option value="failed">Failed (Score &lt; 70)</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-1 block font-semibold text-ink">
                        Validator Evaluation &amp; Rubric Notes
                      </label>
                      <textarea
                        rows={3}
                        value={vettingNotes}
                        onChange={(e) => setVettingNotes(e.target.value)}
                        placeholder="e.g. Scored 88% on algorithm efficiency, 92% on microservice design. Strong error handling and clean architecture."
                        className="w-full rounded-xl border border-[#bcd6fa] bg-white p-2.5 text-xs font-medium text-ink placeholder-mist focus:border-electric focus:outline-none transition-all"
                      />
                    </div>
                  </div>
                )}

                {/* STAGE 4 POST-INFO: CLIENT INTERVIEW */}
                {app.stage === "interview" && (
                  <div className="space-y-3 text-xs">
                    <div className="space-y-1.5 rounded-xl border border-amber-200 bg-amber-50/50 p-3">
                      <div className="font-semibold text-amber-900">Panel Feedback &amp; Decision:</div>
                      <div className="flex items-center gap-2 text-amber-800 text-[11px]">
                        <Check size={12} className="text-emerald-600 shrink-0" />
                        <span>Live interview panel conducted</span>
                      </div>
                      <div className="flex items-center gap-2 text-amber-800 text-[11px]">
                        <Check size={12} className="text-emerald-600 shrink-0" />
                        <span>Interviewer evaluations recorded</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="mb-1 block font-semibold text-ink">
                          Panel Decision Outcome
                        </label>
                        <select
                          value={interviewOutcome}
                          onChange={(e) => setInterviewOutcome(e.target.value)}
                          className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 text-xs font-medium text-ink focus:border-electric focus:outline-none transition-all cursor-pointer"
                        >
                          <option value="Client Offer Extended">Client Offer Extended</option>
                          <option value="Passed - Final Debrief">Passed - Final Debrief</option>
                          <option value="Client Shortlisted">Client Shortlisted</option>
                          <option value="Follow-up Deep Dive">Follow-up Deep Dive</option>
                        </select>
                      </div>

                      <div>
                        <label className="mb-1 block font-semibold text-ink">
                          Consensus Rating (0-100)
                        </label>
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={interviewConsensusScore}
                          onChange={(e) => setInterviewConsensusScore(Math.max(0, Math.min(100, Number(e.target.value) || 0)))}
                          className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 text-xs font-bold text-ink focus:border-electric focus:outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 block font-semibold text-ink">
                        Agreed Hourly Placement Rate
                      </label>
                      <input
                        type="text"
                        value={confirmedPlacementRate}
                        onChange={(e) => setConfirmedPlacementRate(e.target.value)}
                        placeholder="e.g. $110/hr"
                        className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 text-xs font-bold text-ink focus:border-electric focus:outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block font-semibold text-ink">
                        Client Evaluation &amp; Debrief Notes
                      </label>
                      <textarea
                        rows={3}
                        value={interviewNotes}
                        onChange={(e) => setInterviewNotes(e.target.value)}
                        placeholder="e.g. Client CTO and engineering lead approved offer. Excellent technical depth and communication."
                        className="w-full rounded-xl border border-[#bcd6fa] bg-white p-2.5 text-xs font-medium text-ink placeholder-mist focus:border-electric focus:outline-none transition-all"
                      />
                    </div>
                  </div>
                )}

                {/* STAGE 5 POST-INFO: CLOSED / PLACED */}
                {app.stage === "closed" && (
                  <div className="space-y-3 text-xs">
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3 space-y-1">
                      <div className="flex items-center gap-1.5 font-display text-xs font-bold text-emerald-900">
                        <CheckCircle size={14} className="text-emerald-600" />
                        <span>Active Placement &amp; Guaranteed Deployment</span>
                      </div>
                      <p className="text-[11px] text-emerald-800 leading-snug">
                        Candidate has successfully onboarded with the client organization. Protected under Pepoltek 90-day replacement guarantee.
                      </p>
                    </div>

                    <div className="space-y-2 rounded-xl border border-[#bcd6fa]/60 p-3 bg-canvas/30 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-mist">Confirmed Rate:</span>
                        <span className="font-mono font-bold text-ink">{app.rate}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-mist">Engagement Model:</span>
                        <span className="font-semibold text-ink">W2 / C2C Staff Augmentation</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-mist">Placement Guarantee:</span>
                        <span className="font-mono font-bold text-emerald-700">90-Day SLA Active</span>
                      </div>
                    </div>

                    <div className="rounded-xl border border-[#bcd6fa]/60 p-3 space-y-1.5 bg-white text-[11px]">
                      <div className="font-semibold text-ink">SLA Check-In Milestones:</div>
                      <div className="flex items-center justify-between text-ink-soft">
                        <span>Day 30 Integration Check-in</span>
                        <span className="rounded bg-emerald-100 text-emerald-800 px-1.5 py-0.2 font-mono font-bold text-[10px]">SCHEDULED</span>
                      </div>
                      <div className="flex items-center justify-between text-ink-soft">
                        <span>Day 60 Performance Review</span>
                        <span className="rounded bg-canvas text-mist px-1.5 py-0.2 font-mono font-bold text-[10px]">PENDING</span>
                      </div>
                      <div className="flex items-center justify-between text-ink-soft">
                        <span>Day 90 Guarantee Completion</span>
                        <span className="rounded bg-canvas text-mist px-1.5 py-0.2 font-mono font-bold text-[10px]">PENDING</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* ---------------------------------------------- */}
              {/* RIGHT COLUMN: NEXT STAGE PREREQUISITE SETUP   */}
              {/* ---------------------------------------------- */}
              <div className="rounded-xl border border-[#bcd6fa]/70 bg-white p-4 space-y-4 shadow-2xs">
                <div className="border-b border-[#bcd6fa]/40 pb-2.5">
                  <span className="rounded bg-amber-50 text-amber-800 font-mono text-[10px] font-bold px-2 py-0.5 border border-amber-200 uppercase">
                    Stage {currentStageIndex < 4 ? currentStageIndex + 2 : 5} Prerequisites
                  </span>
                  <h3 className="mt-1 font-display text-sm font-bold text-ink">
                    {currentStageIndex < 4
                      ? `Prerequisites for ${ATS_STAGES[currentStageIndex + 1]?.label}`
                      : "Placement Lifecycle Complete"}
                  </h3>
                  <p className="text-[11px] text-ink-soft">
                    {currentStageIndex < 4
                      ? `Configure setup and assignments required to enter Stage ${currentStageIndex + 2}.`
                      : "Candidate has completed all 5 delivery pipeline stages."}
                  </p>
                </div>

                {/* ADVANCING FROM STAGE 1 -> STAGE 2 (MARKET MAPPING SETUP) */}
                {app.stage === "discovery" && (
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="mb-1 block font-semibold text-ink">
                        Target Sourcing / Screening Channel
                      </label>
                      <select
                        value={targetScreeningChannel}
                        onChange={(e) => setTargetScreeningChannel(e.target.value)}
                        className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 text-xs font-medium text-ink focus:border-electric focus:outline-none transition-all cursor-pointer"
                      >
                        <option value="Inbound Application">Inbound Application</option>
                        <option value="Direct Sourcing">Direct Recruiter Sourcing</option>
                        <option value="Platform Referral">Platform Bounty Referral</option>
                        <option value="Executive Search">Executive Headhunting</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-1 block font-semibold text-ink">
                        Target Screening Completion Deadline
                      </label>
                      <input
                        type="date"
                        value={screeningDeadline}
                        onChange={(e) => setScreeningDeadline(e.target.value)}
                        className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 text-xs font-medium text-ink focus:border-electric focus:outline-none transition-all cursor-pointer"
                      >
                      </input>
                    </div>

                    <div>
                      <label className="mb-1 block font-semibold text-ink">
                        Market Mapping Sub-Stage Tag
                      </label>
                      <input
                        type="text"
                        value={stage2SubStage}
                        onChange={(e) => setStage2SubStage(e.target.value)}
                        placeholder="e.g. Sourced & Screened"
                        className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 text-xs font-medium text-ink placeholder-mist focus:border-electric focus:outline-none transition-all"
                      />
                    </div>

                    <div className="rounded-xl border border-[#bcd6fa]/50 bg-canvas/30 p-3 text-[11px] text-ink-soft">
                      Advancing will transition this application to Market Mapping, log the intake verification, and queue the recruiter screening process.
                    </div>
                  </div>
                )}

                {/* ADVANCING FROM STAGE 2 -> STAGE 3 (TECHNICAL VETTING SETUP) */}
                {app.stage === "market_mapping" && (
                  <div className="space-y-3 text-xs">
                    <div>
                      <div className="mb-1 flex items-center justify-between">
                        <label className="font-semibold text-ink">
                          Designated Assessment Template
                        </label>
                        <span className="text-[10px] font-bold text-electric uppercase font-mono">
                          {assessmentTemplates.length} Library Templates
                        </span>
                      </div>
                      <select
                        value={selectedTemplateId}
                        onChange={(e) => {
                          const newId = e.target.value;
                          setSelectedTemplateId(newId);
                          const t = assessmentTemplates.find((item) => item.id === newId);
                          if (t) {
                            setDesignatedVettingTrack(t.title);
                            // Auto select appropriate validator for template sector
                            const matchingVal = validators.find((v) => v.sector === t.sector) || validators[0];
                            if (matchingVal) {
                              setSelectedValidatorId(matchingVal.id);
                              setAssignedValidator(matchingVal.full_name);
                            }
                          }
                        }}
                        className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 text-xs font-semibold text-ink focus:border-electric focus:outline-none transition-all cursor-pointer shadow-sm"
                      >
                        {assessmentTemplates.length > 0 ? (
                          assessmentTemplates.map((t) => (
                            <option key={t.id} value={t.id}>
                              {t.title} ({t.total_marks} Marks - {t.sector.toUpperCase()})
                            </option>
                          ))
                        ) : (
                          <option value="">No Active Templates in Library</option>
                        )}
                      </select>

                      {/* Live Template Summary Card */}
                      {selectedTemplate && (
                        <div className="mt-2 rounded-xl border border-electric/30 bg-electric/5 p-2.5 text-[11px] space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-ink">{selectedTemplate.title}</span>
                            <span className="rounded-full bg-electric/15 text-electric px-2 py-0.5 font-mono text-[10px] font-bold uppercase">
                              {selectedTemplate.category.replace("cat-", "")}
                            </span>
                          </div>
                          {selectedTemplate.description && (
                            <p className="text-mist text-[11px] line-clamp-2">{selectedTemplate.description}</p>
                          )}
                          <div className="flex items-center gap-3 text-[10px] text-ink-soft pt-1 border-t border-electric/20 font-mono">
                            <span>Rubric: {selectedTemplate.marks_distribution?.length || 0} criteria</span>
                            <span>•</span>
                            <span>Pass Threshold: 70/100</span>
                            <span>•</span>
                            <span className="capitalize">Sector: {selectedTemplate.sector}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="mb-1 flex items-center justify-between">
                        <label className="font-semibold text-ink">
                          Assigned Technical Validator
                        </label>
                        <span className="text-[10px] font-mono text-mist">
                          {validators.length} Staff Validators
                        </span>
                      </div>
                      <select
                        value={selectedValidatorId}
                        onChange={(e) => {
                          const newId = e.target.value;
                          setSelectedValidatorId(newId);
                          const v = validators.find((item) => item.id === newId);
                          if (v) setAssignedValidator(v.full_name);
                        }}
                        className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 text-xs font-semibold text-ink focus:border-electric focus:outline-none transition-all cursor-pointer shadow-sm"
                      >
                        {validators.length > 0 ? (
                          validators.map((v) => (
                            <option key={v.id} value={v.id}>
                              {v.full_name} ({v.specialization} - {v.sector.toUpperCase()})
                            </option>
                          ))
                        ) : (
                          <option value="">No Active Validators Found</option>
                        )}
                      </select>
                      {selectedValidator && (
                        <div className="mt-1 flex items-center justify-between text-[11px] text-mist px-1">
                          <span>{selectedValidator.email}</span>
                          <span className="font-mono text-[10px] text-ink-soft">
                            {selectedValidator.active_assignments} active assignments
                          </span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="mb-1 block font-semibold text-ink">
                        Assessment Dispatch Due Date
                      </label>
                      <input
                        type="date"
                        value={assessmentDueDate}
                        onChange={(e) => setAssessmentDueDate(e.target.value)}
                        className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 text-xs font-medium text-ink focus:border-electric focus:outline-none transition-all cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block font-semibold text-ink">
                        Vetting Sub-Stage Tag
                      </label>
                      <input
                        type="text"
                        value={stage3SubStage}
                        onChange={(e) => setStage3SubStage(e.target.value)}
                        placeholder="e.g. Assessment Dispatched"
                        className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 text-xs font-medium text-ink placeholder-mist focus:border-electric focus:outline-none transition-all"
                      />
                    </div>
                  </div>
                )}

                {/* ADVANCING FROM STAGE 3 -> STAGE 4 (CLIENT INTERVIEW SETUP) */}
                {app.stage === "technical_vetting" && (
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="mb-1 block font-semibold text-ink">
                        Interview Format / Type
                      </label>
                      <select
                        value={interviewFormat}
                        onChange={(e) => setInterviewFormat(e.target.value)}
                        className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 text-xs font-medium text-ink focus:border-electric focus:outline-none transition-all cursor-pointer"
                      >
                        <option value="technical_coding">Technical Coding Assessment</option>
                        <option value="system_design">System Design &amp; Architecture Review</option>
                        <option value="behavioral_leadership">Behavioral &amp; Leadership Panel</option>
                        <option value="clinical_board">Clinical Board &amp; Credential Review</option>
                        <option value="client_final">Client Final Round</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="mb-1 block font-semibold text-ink">
                          Scheduled Date &amp; Time
                        </label>
                        <input
                          type="text"
                          value={interviewDateTime}
                          onChange={(e) => setInterviewDateTime(e.target.value)}
                          placeholder="YYYY-MM-DD HH:MM UTC"
                          className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 text-xs font-medium text-ink focus:border-electric focus:outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block font-semibold text-ink">
                          Sub-Stage Tag
                        </label>
                        <input
                          type="text"
                          value={stage4SubStage}
                          onChange={(e) => setStage4SubStage(e.target.value)}
                          placeholder="e.g. Interview Scheduled"
                          className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 text-xs font-medium text-ink focus:border-electric focus:outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 block font-semibold text-ink">
                        Google Meet Link / Room URL
                      </label>
                      <input
                        type="url"
                        value={interviewMeetingLink}
                        onChange={(e) => setInterviewMeetingLink(e.target.value)}
                        placeholder="https://meet.google.com/..."
                        className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 text-xs font-medium text-ink focus:border-electric focus:outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block font-semibold text-ink">
                        Candidate Preparation Brief
                      </label>
                      <textarea
                        rows={2}
                        value={candidatePrepNotes}
                        onChange={(e) => setCandidatePrepNotes(e.target.value)}
                        placeholder="Candidate preparation brief notes..."
                        className="w-full rounded-xl border border-[#bcd6fa] bg-white p-2.5 text-xs font-medium text-ink placeholder-mist focus:border-electric focus:outline-none transition-all"
                      />
                    </div>
                  </div>
                )}

                {/* ADVANCING FROM STAGE 4 -> STAGE 5 (CLOSED / PLACED SETUP) */}
                {app.stage === "interview" && (
                  <div className="space-y-3 text-xs">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="mb-1 block font-semibold text-ink">
                          Confirmed Start Date
                        </label>
                        <input
                          type="date"
                          value={confirmedStartDate}
                          onChange={(e) => setConfirmedStartDate(e.target.value)}
                          className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 text-xs font-medium text-ink focus:border-electric focus:outline-none transition-all cursor-pointer"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block font-semibold text-ink">
                          Agreed Placement Rate
                        </label>
                        <input
                          type="text"
                          value={confirmedPlacementRate}
                          onChange={(e) => setConfirmedPlacementRate(e.target.value)}
                          placeholder="e.g. $110/hr"
                          className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 text-xs font-bold text-ink focus:border-electric focus:outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 block font-semibold text-ink">
                        Agreement / SOW Reference
                      </label>
                      <input
                        type="text"
                        value={agreementReference}
                        onChange={(e) => setAgreementReference(e.target.value)}
                        placeholder="e.g. SOW-PEK-2026-081"
                        className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 text-xs font-medium text-ink focus:border-electric focus:outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block font-semibold text-ink">
                        Placement Sub-Stage Tag
                      </label>
                      <input
                        type="text"
                        value={stage5SubStage}
                        onChange={(e) => setStage5SubStage(e.target.value)}
                        placeholder="e.g. Offer Accepted"
                        className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 text-xs font-medium text-ink focus:border-electric focus:outline-none transition-all"
                      />
                    </div>

                    <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-3 text-[11px] text-emerald-800">
                      Pepoltek 90-Day SLA Replacement Guarantee will automatically activate on start date with 30, 60, and 90-day tracking milestones.
                    </div>
                  </div>
                )}

                {/* STAGE 5 TERMINAL: ALREADY CLOSED */}
                {app.stage === "closed" && (
                  <div className="py-6 text-center text-xs text-mist space-y-2">
                    <CheckCircle size={28} className="mx-auto text-emerald-500" />
                    <p className="font-semibold text-ink">
                      Candidate is placed and deployed with {app.requisition.client?.name || "the client"}.
                    </p>
                    <p className="text-[11px] text-ink-soft">
                      No further sequential stages. You can monitor SLA retention milestones in the audit log.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Advance Button (Spans Full Width Below 2 Columns) */}
            {app.stage !== "closed" && (
              <div className="pt-2">
                <button
                  type="button"
                  disabled={isAdvancing}
                  onClick={handleAdvanceNextStage}
                  className="w-full rounded-xl bg-ink py-3 font-display text-xs font-bold text-white shadow-xs hover:bg-electric transition-colors cursor-pointer disabled:opacity-50 inline-flex items-center justify-center gap-2"
                >
                  {isAdvancing ? (
                    "Processing Stage Advance..."
                  ) : (
                    <>
                      <span>
                        Complete Stage {currentStageIndex + 1} &amp; Advance to {ATS_STAGES[currentStageIndex + 1]?.label} (Stage {currentStageIndex + 2})
                      </span>
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 2: MULTI-STAGE JUMP (DIRECT OVERRIDE)            */}
        {/* Dynamic Pre-Info rendered for selected target stage  */}
        {/* ==================================================== */}
        {activeTab === "multi_jump" && (
          <div className="space-y-4 text-xs">
            <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-3 text-[11px] text-amber-800 leading-snug">
              Direct stage override allows manual repositioning across any stage or terminal statuses (Rejected, Withdrawn). All changes are signed and logged to the audit trail.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block font-semibold text-ink">
                  Target Pipeline Stage
                </label>
                <select
                  value={directStage}
                  onChange={(e) => setDirectStage(e.target.value as StageKey)}
                  className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 text-xs font-semibold text-ink focus:border-electric focus:outline-none transition-all cursor-pointer"
                >
                  <option value="discovery">1 - Discovery (Intake &amp; Profiling)</option>
                  <option value="market_mapping">2 - Market Mapping (Screened &amp; Sourced)</option>
                  <option value="technical_vetting">3 - Technical Vetting (Assessments &amp; Audits)</option>
                  <option value="interview">4 - Client Interview (Panels &amp; Meetings)</option>
                  <option value="closed">5 - Closed / Placed (Offer Accepted)</option>
                  <option value="rejected">Rejected by Client / Recruiter</option>
                  <option value="withdrawn">Candidate Withdrawn</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block font-semibold text-ink">
                  Sub-Stage Tag (Optional)
                </label>
                <input
                  type="text"
                  value={directSubStage}
                  onChange={(e) => setDirectSubStage(e.target.value)}
                  placeholder="e.g. Fast-Track Move, Compensation Mismatch"
                  className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 text-xs font-medium text-ink placeholder-mist focus:border-electric focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* DYNAMIC PRE-INFO FOR SELECTED TARGET STAGE */}
            <div className="rounded-xl border border-[#bcd6fa]/70 bg-canvas/30 p-4 space-y-3">
              <span className="text-[10px] font-mono text-mist uppercase font-semibold block">
                Target Stage Prerequisites ({directStage.replace("_", " ").toUpperCase()})
              </span>

              {/* Target: Discovery */}
              {directStage === "discovery" && (
                <div className="text-[11px] text-ink-soft">
                  Resetting to intake discovery stage. Verification checklists will be re-opened for review.
                </div>
              )}

              {/* Target: Market Mapping */}
              {directStage === "market_mapping" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block font-semibold text-ink">
                      Sourcing Channel
                    </label>
                    <select
                      value={targetScreeningChannel}
                      onChange={(e) => setTargetScreeningChannel(e.target.value)}
                      className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 text-xs font-medium text-ink focus:border-electric focus:outline-none cursor-pointer"
                    >
                      <option value="Inbound Application">Inbound Application</option>
                      <option value="Direct Sourcing">Direct Recruiter Sourcing</option>
                      <option value="Platform Referral">Platform Bounty Referral</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block font-semibold text-ink">
                      Screening Deadline
                    </label>
                    <input
                      type="date"
                      value={screeningDeadline}
                      onChange={(e) => setScreeningDeadline(e.target.value)}
                      className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 text-xs font-medium text-ink focus:border-electric focus:outline-none cursor-pointer"
                    />
                  </div>
                </div>
              )}

              {/* Target: Technical Vetting */}
              {directStage === "technical_vetting" && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <div className="mb-1 flex items-center justify-between">
                        <label className="font-semibold text-ink">
                          Designated Assessment Template
                        </label>
                        <span className="text-[10px] font-bold text-electric uppercase font-mono">
                          {assessmentTemplates.length} Library Templates
                        </span>
                      </div>
                      <select
                        value={directSelectedTemplateId}
                        onChange={(e) => {
                          const newId = e.target.value;
                          setDirectSelectedTemplateId(newId);
                          const t = assessmentTemplates.find((item) => item.id === newId);
                          if (t) {
                            setDirectVettingTrack(t.title);
                            const matchingVal = validators.find((v) => v.sector === t.sector) || validators[0];
                            if (matchingVal) {
                              setDirectSelectedValidatorId(matchingVal.id);
                              setDirectAssignedValidator(matchingVal.full_name);
                            }
                          }
                        }}
                        className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 text-xs font-semibold text-ink focus:border-electric focus:outline-none cursor-pointer"
                      >
                        {assessmentTemplates.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.title} ({t.total_marks} Marks - {t.sector.toUpperCase()})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <div className="mb-1 flex items-center justify-between">
                        <label className="font-semibold text-ink">
                          Assigned Primary Validator
                        </label>
                        <span className="text-[10px] font-mono text-mist">
                          {validators.length} Staff Validators
                        </span>
                      </div>
                      <select
                        value={directSelectedValidatorId}
                        onChange={(e) => {
                          const newId = e.target.value;
                          setDirectSelectedValidatorId(newId);
                          const v = validators.find((item) => item.id === newId);
                          if (v) setDirectAssignedValidator(v.full_name);
                        }}
                        className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 text-xs font-semibold text-ink focus:border-electric focus:outline-none cursor-pointer"
                      >
                        {validators.map((v) => (
                          <option key={v.id} value={v.id}>
                            {v.full_name} ({v.specialization} - {v.sector.toUpperCase()})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block font-semibold text-ink">
                      Assessment Due Date
                    </label>
                    <input
                      type="date"
                      value={directAssessmentDueDate}
                      onChange={(e) => setDirectAssessmentDueDate(e.target.value)}
                      className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 text-xs font-medium text-ink focus:border-electric focus:outline-none cursor-pointer"
                    />
                  </div>
                </div>
              )}

              {/* Target: Client Interview */}
              {directStage === "interview" && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1 block font-semibold text-ink">
                        Interview Format
                      </label>
                      <select
                        value={directInterviewFormat}
                        onChange={(e) => setDirectInterviewFormat(e.target.value)}
                        className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 text-xs font-medium text-ink focus:border-electric focus:outline-none cursor-pointer"
                      >
                        <option value="technical_coding">Technical Coding Assessment</option>
                        <option value="system_design">System Design &amp; Architecture Review</option>
                        <option value="behavioral_leadership">Behavioral &amp; Leadership Panel</option>
                        <option value="clinical_board">Clinical Board &amp; Credential Review</option>
                        <option value="client_final">Client Final Round</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block font-semibold text-ink">
                        Scheduled Date &amp; Time
                      </label>
                      <input
                        type="text"
                        value={directInterviewDate}
                        onChange={(e) => setDirectInterviewDate(e.target.value)}
                        placeholder="YYYY-MM-DD HH:MM UTC"
                        className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 text-xs font-medium text-ink focus:border-electric focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block font-semibold text-ink">
                      Google Meet Room Link
                    </label>
                    <input
                      type="url"
                      value={directMeetingLink}
                      onChange={(e) => setDirectMeetingLink(e.target.value)}
                      placeholder="https://meet.google.com/..."
                      className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 text-xs font-medium text-ink focus:border-electric focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Target: Closed / Placed */}
              {directStage === "closed" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block font-semibold text-ink">
                      Confirmed Start Date
                    </label>
                    <input
                      type="date"
                      value={directStartDate}
                      onChange={(e) => setDirectStartDate(e.target.value)}
                      className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 text-xs font-medium text-ink focus:border-electric focus:outline-none cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block font-semibold text-ink">
                      Agreed Placement Billing Rate
                    </label>
                    <input
                      type="text"
                      value={directPlacementRate}
                      onChange={(e) => setDirectPlacementRate(e.target.value)}
                      placeholder="e.g. $110/hr"
                      className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 text-xs font-bold text-ink focus:border-electric focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Target: Rejected */}
              {directStage === "rejected" && (
                <div>
                  <label className="mb-1 block font-semibold text-ink">
                    Rejection Reason Category
                  </label>
                  <select
                    value={rejectionReasonCategory}
                    onChange={(e) => setRejectionReasonCategory(e.target.value)}
                    className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 text-xs font-medium text-ink focus:border-electric focus:outline-none cursor-pointer"
                  >
                    <option value="Technical Benchmark Not Met">Technical Benchmark Not Met (&lt;70)</option>
                    <option value="Rate Outside Requisition Budget">Rate Outside Requisition Budget</option>
                    <option value="Culture & Communication Mismatch">Culture &amp; Communication Mismatch</option>
                    <option value="Position Filled / Cancelled">Position Filled / Cancelled by Client</option>
                    <option value="Candidate Failed Background / Auth">Candidate Failed Work Auth / Verification</option>
                  </select>
                </div>
              )}

              {/* Target: Withdrawn */}
              {directStage === "withdrawn" && (
                <div>
                  <label className="mb-1 block font-semibold text-ink">
                    Withdrawal Reason Category
                  </label>
                  <select
                    value={withdrawalReasonCategory}
                    onChange={(e) => setWithdrawalReasonCategory(e.target.value)}
                    className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 text-xs font-medium text-ink focus:border-electric focus:outline-none cursor-pointer"
                  >
                    <option value="Accepted Another Offer">Candidate Accepted Another Offer</option>
                    <option value="Location / Commute Constraints">Location / Commute Constraints</option>
                    <option value="Compensation Expectation Increased">Compensation Expectation Increased</option>
                    <option value="Personal Circumstances">Personal / Family Circumstances</option>
                  </select>
                </div>
              )}
            </div>

            <div>
              <label className="mb-1 block font-semibold text-ink">
                Transition Rationale &amp; Audit Note
              </label>
              <textarea
                rows={3}
                value={directNote}
                onChange={(e) => setDirectNote(e.target.value)}
                placeholder="Provide detailed rationale for manual stage relocation..."
                className="w-full rounded-xl border border-[#bcd6fa] bg-white p-3 text-xs font-medium text-ink placeholder-mist focus:border-electric focus:outline-none transition-all"
              />
            </div>

            <button
              type="button"
              disabled={isAdvancing || !directNote.trim()}
              onClick={handleExecuteDirectMove}
              className="w-full rounded-xl bg-ink py-2.5 font-display text-xs font-bold text-white shadow-xs hover:bg-electric transition-colors cursor-pointer disabled:opacity-50 inline-flex items-center justify-center gap-2"
            >
              {isAdvancing ? "Executing Transition..." : "Execute Direct Stage Move"}
              <ArrowRight size={13} />
            </button>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* 4. ROW 4: CHRONOLOGICAL AUDIT HISTORY & QUICK NOTE LOG   */}
      {/* ======================================================== */}
      <div className="rounded-2xl border border-[#bcd6fa] bg-white p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#bcd6fa]/40 pb-3">
          <div className="flex items-center gap-2">
            <Clock size={15} className="text-electric" />
            <h3 className="font-display text-sm font-bold text-ink">
              Chronological Audit History &amp; Event Stream
            </h3>
          </div>
          <span className="font-mono text-xs text-mist">
            {app.events.length} Events Logged
          </span>
        </div>

        {/* Quick Add Note Form */}
        <form onSubmit={handleAddInternalNote} className="space-y-2">
          <input
            type="text"
            value={newNoteText}
            onChange={(e) => setNewNoteText(e.target.value)}
            placeholder="Log internal recruiter note or status check..."
            className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 text-xs font-medium text-ink placeholder-mist focus:border-electric focus:outline-none transition-all"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoggingNote || !newNoteText.trim()}
              className="rounded-xl border border-[#bcd6fa] bg-canvas px-3 py-1.5 text-xs font-semibold text-ink hover:bg-white hover:border-electric transition-colors cursor-pointer disabled:opacity-40 inline-flex items-center gap-1.5"
            >
              <Plus size={12} />
              <span>{isLoggingNote ? "Signing..." : "Sign & Log Note"}</span>
            </button>
          </div>
        </form>

        {/* Event Timeline Feed */}
        <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
          {app.events.map((ev) => (
            <div
              key={ev.id}
              className="rounded-xl border border-[#bcd6fa]/50 bg-canvas/30 p-3 text-xs space-y-1"
            >
              <div className="flex items-center justify-between text-[10.5px] text-mist font-mono">
                <span className="font-bold text-ink">{ev.actor_name || "Recruiter Staff"}</span>
                <span>{ev.timestamp}</span>
              </div>
              {ev.from_stage && ev.to_stage && (
                <div className="text-[11px] font-semibold text-electric">
                  {ev.from_stage.toUpperCase()} &rarr; {ev.to_stage.toUpperCase()}
                  {ev.sub_stage && ` (${ev.sub_stage})`}
                </div>
              )}
              {ev.note && <p className="text-ink-soft leading-snug">{ev.note}</p>}
            </div>
          ))}

          {app.events.length === 0 && (
            <div className="py-6 text-center text-xs text-mist">
              No stage transition events logged yet.
            </div>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 5. SCHEDULE INTERVIEW RIGHT-SIDE SHEET DRAWER            */}
      {/* ======================================================== */}
      {isSchedulingOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-ink/40 backdrop-blur-xs">
          <form
            onSubmit={handleScheduleInterviewSubmit}
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
                onClick={() => setIsSchedulingOpen(false)}
                className="rounded-xl p-1.5 text-mist hover:bg-canvas hover:text-ink transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 space-y-4 p-6 text-xs text-ink-soft overflow-y-auto">
              <div className="rounded-2xl border border-[#bcd6fa]/70 bg-canvas/50 p-3.5">
                <span className="font-mono text-[10px] text-mist uppercase">Candidate</span>
                <div className="font-display text-xs font-bold text-ink">{app.candidate.full_name}</div>
                <div className="text-[11px] text-mist">{app.requisition.title}</div>
              </div>

              <div>
                <label className="mb-1.5 block font-semibold text-ink">
                  Scheduled Time &amp; Date
                </label>
                <input
                  type="text"
                  value={drawerInterviewDate}
                  onChange={(e) => setDrawerInterviewDate(e.target.value)}
                  placeholder="e.g. Tomorrow at 2:00 PM EST"
                  className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 text-xs font-medium text-ink focus:border-electric focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="mb-1.5 block font-semibold text-ink">
                  Interview Format / Type
                </label>
                <select
                  value={drawerInterviewType}
                  onChange={(e) => setDrawerInterviewType(e.target.value)}
                  className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 text-xs font-medium text-ink focus:border-electric focus:outline-none transition-all cursor-pointer"
                >
                  <option value="Technical Coding">Technical Coding Assessment</option>
                  <option value="System Design Panel">System Design &amp; Architecture Review</option>
                  <option value="Behavioral Leadership">Behavioral &amp; Leadership Panel</option>
                  <option value="Clinical Board">Clinical Board &amp; Credential Review</option>
                  <option value="Client Final">Client Final Round</option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block font-semibold text-ink">
                  Panel Members &amp; Assessors
                </label>
                <input
                  type="text"
                  value={drawerInterviewPanel}
                  onChange={(e) => setDrawerInterviewPanel(e.target.value)}
                  placeholder="e.g. Lead Architect & Client Technical Validator"
                  className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 text-xs font-medium text-ink focus:border-electric focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="mb-1.5 block font-semibold text-ink">
                  Google Meet / Conference Room URL
                </label>
                <input
                  type="url"
                  value={interviewMeetingLink}
                  onChange={(e) => setInterviewMeetingLink(e.target.value)}
                  placeholder="https://meet.google.com/..."
                  className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 text-xs font-medium text-ink focus:border-electric focus:outline-none transition-all"
                />
              </div>
            </div>

            <div className="border-t border-[#bcd6fa]/60 p-6 bg-canvas/30 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsSchedulingOpen(false)}
                className="rounded-xl border border-[#bcd6fa] bg-white px-4 py-2 font-display text-xs font-semibold text-ink hover:bg-canvas transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isScheduling}
                className="rounded-xl bg-amber-600 px-5 py-2 font-display text-xs font-bold text-white hover:bg-amber-500 transition-colors shadow-xs cursor-pointer disabled:opacity-50"
              >
                {isScheduling ? "Booking Meeting..." : "Confirm & Send Calendar Invite"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ======================================================== */}
      {/* 6. SHORTLIST BUILDER RIGHT-SIDE SHEET DRAWER             */}
      {/* ======================================================== */}
      {isShortlistOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-ink/40 backdrop-blur-xs">
          <div className="flex h-full w-full max-w-md flex-col border-l border-[#bcd6fa] bg-white shadow-2xl animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between border-b border-[#bcd6fa]/60 px-6 py-5 bg-white">
              <div>
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-electric">
                  Escrow Delivery Engine
                </span>
                <h2 className="mt-1 font-display text-lg font-bold text-ink">
                  Pitch Candidate Shortlist
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsShortlistOpen(false)}
                className="rounded-xl p-1.5 text-mist hover:bg-canvas hover:text-ink transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 space-y-4 p-6 text-xs text-ink-soft overflow-y-auto">
              <div className="rounded-2xl border border-[#bcd6fa]/70 bg-canvas/50 p-3.5">
                <span className="font-mono text-[10px] text-mist uppercase">Candidate</span>
                <div className="font-display text-xs font-bold text-ink">{app.candidate.full_name}</div>
                <div className="text-[11px] text-mist">{app.requisition.title} &bull; {app.rate}</div>
              </div>

              <div>
                <label className="mb-1.5 block font-semibold text-ink">
                  Target Client Organization
                </label>
                <select
                  value={selectedClient}
                  onChange={(e) => setSelectedClient(e.target.value)}
                  className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 text-xs font-medium text-ink focus:border-electric focus:outline-none transition-all cursor-pointer"
                >
                  {clients.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name} ({c.sector || "General"})
                    </option>
                  ))}
                  {clients.length === 0 && (
                    <option value={app.requisition.client?.name || "Apex Financial Cloud Systems"}>
                      {app.requisition.client?.name || "Apex Financial Cloud Systems"}
                    </option>
                  )}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block font-semibold text-ink">
                  Delivery Channel
                </label>
                <select
                  value={deliveryChannel}
                  onChange={(e) => setDeliveryChannel(e.target.value as any)}
                  className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 text-xs font-medium text-ink focus:border-electric focus:outline-none transition-all cursor-pointer"
                >
                  <option value="email">Direct Email Pitch (PDF Shortlist)</option>
                  <option value="im">Instant Message / Slack Sync</option>
                  <option value="client_ats">Client ATS CSV Export</option>
                  <option value="portal">Enterprise Portal Link</option>
                </select>
              </div>

              {/* Masking and Redaction Rules */}
              <div className="space-y-3 rounded-2xl border border-[#bcd6fa]/60 bg-canvas/30 p-4">
                <span className="font-mono text-[10.5px] uppercase text-mist font-semibold block">
                  Shortlist Privacy &amp; Masking
                </span>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={maskContact}
                    onChange={(e) => setMaskContact(e.target.checked)}
                    className="h-4 w-4 rounded border-[#bcd6fa] text-electric focus:ring-electric"
                  />
                  <span>Mask Direct Contact (Protect Escrow)</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeVetting}
                    onChange={(e) => setIncludeVetting(e.target.checked)}
                    className="h-4 w-4 rounded border-[#bcd6fa] text-electric focus:ring-electric"
                  />
                  <span>Attach Verified Vetting Scorecard</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeRates}
                    onChange={(e) => setIncludeRates(e.target.checked)}
                    className="h-4 w-4 rounded border-[#bcd6fa] text-electric focus:ring-electric"
                  />
                  <span>Include Financial Rate Card</span>
                </label>
              </div>
            </div>

            <div className="border-t border-[#bcd6fa]/60 p-6 bg-canvas/30 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsShortlistOpen(false)}
                className="rounded-xl border border-[#bcd6fa] bg-white px-4 py-2 font-display text-xs font-semibold text-ink hover:bg-canvas transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSubmittingShortlist}
                onClick={handleSubmitShortlist}
                className="rounded-xl bg-electric px-5 py-2 font-display text-xs font-bold text-white hover:bg-electric-hover transition-colors shadow-xs cursor-pointer disabled:opacity-50"
              >
                {isSubmittingShortlist ? "Delivering..." : "Deliver Signed Pitch"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
