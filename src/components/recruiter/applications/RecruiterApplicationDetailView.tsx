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
} from "@/actions/recruiter.actions";
import {
  ArrowLeft,
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
  Download,
  ExternalLink,
  ChevronRight,
  Plus,
  X,
  Zap,
  Check,
  Globe,
  Kanban,
  Award,
} from "@/components/ui/Icons";

interface Props {
  initialApplication: ApplicationDetailData;
  clients: ClientItem[];
}

type StageKey = "discovery" | "market_mapping" | "technical_vetting" | "interview" | "closed" | "rejected" | "withdrawn";

interface StageStep {
  key: StageKey;
  label: string;
  stepNum: number;
  description: string;
}

const ATS_STAGES: StageStep[] = [
  { key: "discovery", label: "Discovery", stepNum: 1, description: "Intake & Initial Profiling" },
  { key: "market_mapping", label: "Market Mapping", stepNum: 2, description: "Sourced & Screened" },
  { key: "technical_vetting", label: "Technical Vetting", stepNum: 3, description: "Assessment & Audit" },
  { key: "interview", label: "Client Interview", stepNum: 4, description: "Live Panel Meeting" },
  { key: "closed", label: "Closed / Placed", stepNum: 5, description: "Placement & Agreement" },
];

export function RecruiterApplicationDetailView({ initialApplication, clients }: Props) {
  const router = useRouter();
  const [app, setApp] = useState<ApplicationDetailData>(initialApplication);

  // Toast feedback
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Stage move state
  const [selectedStage, setSelectedStage] = useState<StageKey>(
    (app.stage.toLowerCase() as StageKey) || "market_mapping"
  );
  const [subStageInput, setSubStageInput] = useState<string>(app.sub_stage || "");
  const [stageNoteInput, setStageNoteInput] = useState<string>("");
  const [isUpdatingStage, setIsUpdatingStage] = useState(false);

  // Quick internal note state
  const [newNoteText, setNewNoteText] = useState("");
  const [isLoggingNote, setIsLoggingNote] = useState(false);

  // Schedule interview state
  const [isSchedulingOpen, setIsSchedulingOpen] = useState(false);
  const [interviewDate, setInterviewDate] = useState("Tomorrow at 2:00 PM EST");
  const [interviewType, setInterviewType] = useState("Technical System Design Panel");
  const [interviewPanel, setInterviewPanel] = useState("Lead Architect & Client Technical Validator");
  const [interviewLink, setInterviewLink] = useState("https://meet.google.com/pepoltek-sprint");
  const [isScheduling, setIsScheduling] = useState(false);

  // Client Shortlist Pitch state
  const [isShortlistOpen, setIsShortlistOpen] = useState(false);
  const [shortlistClient, setShortlistClient] = useState(
    app.requisition.client?.name || clients[0]?.name || "Enterprise Client"
  );
  const [shortlistChannel, setShortlistChannel] = useState<"email" | "im" | "client_ats" | "portal">("email");
  const [shortlistPitchNotes, setShortlistPitchNotes] = useState("");
  const [maskContact, setMaskContact] = useState(true);
  const [includeRates, setIncludeRates] = useState(true);
  const [includeVetting, setIncludeVetting] = useState(true);
  const [isSubmittingShortlist, setIsSubmittingShortlist] = useState(false);

  // Handle stage move execution
  const handleExecuteStageMove = async () => {
    setIsUpdatingStage(true);
    const res = await updateRecruiterApplicationStageAction(app.id, {
      stage: selectedStage,
      sub_stage: subStageInput.trim(),
      note: stageNoteInput.trim() || `Advanced candidate to ${selectedStage.toUpperCase()}.`,
    });
    setIsUpdatingStage(false);

    if (res.success) {
      showToast(`Application successfully advanced to ${selectedStage.replace("_", " ").toUpperCase()}.`);
      setApp((prev) => ({
        ...prev,
        stage: selectedStage,
        sub_stage: subStageInput.trim() || prev.sub_stage,
        events: [
          {
            id: String(Date.now()),
            from_stage: prev.stage,
            to_stage: selectedStage,
            sub_stage: subStageInput.trim() || prev.sub_stage,
            actor_name: "Recruiter Staff",
            note: stageNoteInput.trim() || `Stage changed from ${prev.stage} to ${selectedStage}.`,
            timestamp: "Just Now",
          },
          ...prev.events,
        ],
      }));
      setStageNoteInput("");
    } else {
      showToast(res.error || "Failed to update stage.", "error");
    }
  };

  // Handle logging internal recruiter note
  const handleAddInternalNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    setIsLoggingNote(true);
    const res = await addRecruiterApplicationNoteAction(app.id, newNoteText.trim());
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

  // Handle booking interview
  const handleScheduleInterviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsScheduling(true);

    const res = await scheduleInterviewAction({
      candidate_name: app.candidate.full_name,
      candidate_email: app.candidate.email,
      role: app.requisition.title,
      interview_type: interviewType,
      scheduled_time: interviewDate,
      panel: interviewPanel,
      meeting_link: interviewLink,
    });

    setIsScheduling(false);

    if (res.success) {
      if (app.stage !== "interview") {
        await updateRecruiterApplicationStageAction(app.id, {
          stage: "interview",
          sub_stage: "Panel Confirmed",
          note: `Sprint Interview scheduled for ${interviewDate} with ${interviewPanel}. Google Meet link: ${interviewLink}`,
        });
      }

      showToast(`Interview confirmed for ${app.candidate.full_name}. Calendar invite dispatched.`);
      setIsSchedulingOpen(false);
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
            actor_name: "Recruiter Staff",
            note: `Live sprint interview booked for ${interviewDate} (${interviewType}).`,
            timestamp: "Just Now",
          },
          ...prev.events,
        ],
      }));
    } else {
      showToast(res.error || "Failed to schedule interview.", "error");
    }
  };

  // Handle Shortlist Submission
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
      masked_contact: {
        email: maskContact ? "[Protected by Pepoltek Escrow]" : app.candidate.email,
        phone: maskContact ? "[Protected by Pepoltek Escrow]" : app.candidate.phone,
      },
      recruiter_notes: shortlistPitchNotes,
    };

    const res = await createShortlistSubmissionAction({
      requisition_id: app.requisition.id,
      client_name: shortlistClient,
      channel: shortlistChannel,
      pitch_notes: shortlistPitchNotes,
      items: [item],
    });

    setIsSubmittingShortlist(false);

    if (res.success) {
      showToast(`Candidate shortlist package dispatched to ${shortlistClient}.`);
      setIsShortlistOpen(false);
      setShortlistPitchNotes("");
    } else {
      showToast(res.error || "Failed to submit shortlist pitch.", "error");
    }
  };

  // Stepper calculations
  const currentStageIndex = ATS_STAGES.findIndex((s) => s.key === app.stage.toLowerCase());

  return (
    <div className="space-y-6 pb-24 text-ink">
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

      {/* Breadcrumb Navigation & Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/recruiter/applications"
            className="rounded-xl border border-[#bcd6fa] bg-white p-2 text-ink hover:bg-canvas transition-colors shadow-2xs inline-flex items-center gap-1.5"
            title="Back to Kanban Pipeline"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <div className="flex items-center gap-2 text-[11px] font-mono text-mist">
              <Link href="/recruiter/dashboard" className="hover:text-ink">
                Recruiter Cockpit
              </Link>
              <span>/</span>
              <Link href="/recruiter/applications" className="hover:text-ink">
                Applications &amp; Kanban
              </Link>
              <span>/</span>
              <span className="text-ink font-semibold">Application #{app.id.slice(-6).toUpperCase()}</span>
            </div>
            <h1 className="mt-1 font-display text-2xl font-bold text-ink">
              {app.candidate.full_name}
            </h1>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsSchedulingOpen(true)}
            className="rounded-xl border border-amber-300 bg-amber-50 px-3.5 py-2 font-display text-xs font-semibold text-amber-800 hover:bg-amber-100 transition-colors shadow-2xs inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Clock size={13} />
            <span>Schedule Interview</span>
          </button>

          <button
            type="button"
            onClick={() => setIsShortlistOpen(true)}
            className="rounded-xl border border-electric/40 bg-electric/10 px-3.5 py-2 font-display text-xs font-semibold text-electric hover:bg-electric/20 transition-colors shadow-2xs inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Share2 size={13} />
            <span>Pitch to Client</span>
          </button>

          <Link
            href="/recruiter/applications"
            className="rounded-xl bg-ink px-4 py-2 font-display text-xs font-bold text-white shadow-xs hover:bg-electric transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Kanban size={13} />
            <span>Return to Kanban</span>
          </Link>
        </div>
      </div>

      {/* Candidate Cockpit Hero Strip */}
      <div className="rounded-2xl border border-[#bcd6fa] bg-white p-5 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          {/* Candidate Bio & Target Requisition */}
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-ink to-ink-soft font-display text-lg font-bold text-white shadow-xs">
              {app.candidate.full_name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-display text-lg font-bold text-ink">
                  {app.candidate.full_name}
                </span>
                <span className="rounded-md border border-[#bcd6fa]/60 bg-canvas px-2 py-0.5 text-[10.5px] font-mono font-semibold uppercase text-ink">
                  {app.candidate.level || "Senior"}
                </span>
                <span className="rounded-md bg-electric/10 border border-electric/30 px-2 py-0.5 text-[10.5px] font-mono font-semibold text-electric uppercase">
                  {app.source}
                </span>
                <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10.5px] font-mono font-bold text-emerald-700">
                  AI Fit: {app.match_score}
                </span>
              </div>

              <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-soft">
                <div className="flex items-center gap-1.5">
                  <Briefcase size={13} className="text-mist" />
                  <span className="font-medium text-ink">{app.requisition.title}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Building2 size={13} className="text-mist" />
                  <span>{app.requisition.client?.name || "Enterprise Partner"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Globe size={13} className="text-mist" />
                  <span>{app.candidate.location}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Metrics & Financial Rate */}
          <div className="flex items-center gap-4 border-t lg:border-t-0 lg:border-l border-[#bcd6fa]/50 pt-4 lg:pt-0 lg:pl-6 text-xs">
            <div>
              <div className="font-mono text-[10.5px] uppercase text-mist font-semibold">Billing Rate</div>
              <div className="font-display text-xl font-bold text-ink">{app.rate}</div>
            </div>
            <div className="h-8 w-px bg-[#bcd6fa]/40" />
            <div>
              <div className="font-mono text-[10.5px] uppercase text-mist font-semibold">Profile Strength</div>
              <div className="font-display text-xl font-bold text-electric">
                {app.candidate.profile_strength}%
              </div>
            </div>
            <div className="h-8 w-px bg-[#bcd6fa]/40" />
            <div>
              <div className="font-mono text-[10.5px] uppercase text-mist font-semibold">Vetting Status</div>
              <div className="font-display text-xs font-bold text-emerald-700 uppercase">
                {app.candidate.vetting_status.replace("_", " ")}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive 5-Stage ATS Workflow Stepper */}
      <div className="rounded-2xl border border-[#bcd6fa] bg-white p-5 shadow-2xs">
        <div className="flex items-center justify-between pb-3 border-b border-[#bcd6fa]/40 mb-4">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-electric animate-pulse" />
            <h2 className="font-display text-xs font-bold uppercase tracking-wider text-ink">
              Pipeline Stage Progression Workflow
            </h2>
          </div>
          <span className="text-xs text-mist font-mono">
            Current Stage: <strong className="text-ink uppercase">{app.stage.replace("_", " ")}</strong>
            {app.sub_stage && ` (${app.sub_stage})`}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {ATS_STAGES.map((s, idx) => {
            const isCompleted = currentStageIndex > idx;
            const isCurrent = currentStageIndex === idx;

            return (
              <div
                key={s.key}
                className={`relative rounded-xl border p-3 transition-all ${
                  isCurrent
                    ? "border-electric bg-electric/[0.05] shadow-xs"
                    : isCompleted
                    ? "border-emerald-200 bg-emerald-50/50"
                    : "border-[#bcd6fa]/50 bg-canvas/40 opacity-75"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full text-[10.5px] font-bold font-mono ${
                      isCurrent
                        ? "bg-electric text-white"
                        : isCompleted
                        ? "bg-emerald-600 text-white"
                        : "bg-white border border-[#bcd6fa] text-mist"
                    }`}
                  >
                    {isCompleted ? <Check size={11} /> : s.stepNum}
                  </span>
                  {isCurrent && (
                    <span className="rounded-full bg-electric/20 px-2 py-0.5 text-[9.5px] font-mono font-bold text-electric uppercase">
                      Active
                    </span>
                  )}
                </div>
                <div className="mt-2">
                  <div className="font-display text-xs font-bold text-ink">{s.label}</div>
                  <div className="text-[10.5px] text-mist">{s.description}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content Grid: Dossier (Left) + Operations / Handling (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Dossier, Verified Profile, Skills, Docs (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Candidate Profile Details Card */}
          <div className="rounded-2xl border border-[#bcd6fa] bg-white p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#bcd6fa]/40 pb-3">
              <h3 className="font-display text-sm font-bold text-ink">
                Verified Candidate Profile &amp; Availability
              </h3>
              <span className="rounded-md bg-canvas border border-[#bcd6fa]/60 px-2 py-0.5 text-[10.5px] font-mono text-ink-soft">
                {app.candidate.work_auth ? app.candidate.work_auth.toUpperCase().replace("_", " ") : "US AUTHORIZED"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-[11px] font-mono text-mist uppercase font-semibold">Direct Email</span>
                <div className="flex items-center gap-2 text-ink font-medium">
                  <Mail size={13} className="text-mist" />
                  <a href={`mailto:${app.candidate.email}`} className="hover:text-electric underline truncate">
                    {app.candidate.email || "Confidential direct via portal"}
                  </a>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-mono text-mist uppercase font-semibold">Phone Contact</span>
                <div className="flex items-center gap-2 text-ink font-medium">
                  <Phone size={13} className="text-mist" />
                  <span>{app.candidate.phone || "Verified in platform"}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-mono text-mist uppercase font-semibold">Timezone / Location</span>
                <div className="text-ink font-medium">
                  {app.candidate.location} ({app.candidate.timezone || "EST"})
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-mono text-mist uppercase font-semibold">Deployment Availability</span>
                <div className="text-ink font-medium">
                  {app.candidate.availability_date || "Immediate Sprint Deployment"}
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
            </div>

            {/* Links Strip */}
            <div className="pt-2 border-t border-[#bcd6fa]/40 flex flex-wrap items-center gap-3">
              {app.candidate.portfolio_url && (
                <a
                  href={app.candidate.portfolio_url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg border border-[#bcd6fa] bg-white px-3 py-1.5 text-xs font-semibold text-ink hover:border-electric hover:text-electric transition-colors inline-flex items-center gap-1.5"
                >
                  <Globe size={13} />
                  <span>Portfolio Site</span>
                  <ExternalLink size={11} />
                </a>
              )}
              {app.candidate.github_url && (
                <a
                  href={app.candidate.github_url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg border border-[#bcd6fa] bg-white px-3 py-1.5 text-xs font-semibold text-ink hover:border-electric hover:text-electric transition-colors inline-flex items-center gap-1.5"
                >
                  <span>GitHub Repository</span>
                  <ExternalLink size={11} />
                </a>
              )}
              {app.candidate.linkedin_url && (
                <a
                  href={app.candidate.linkedin_url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg border border-[#bcd6fa] bg-white px-3 py-1.5 text-xs font-semibold text-ink hover:border-electric hover:text-electric transition-colors inline-flex items-center gap-1.5"
                >
                  <span>LinkedIn Profile</span>
                  <ExternalLink size={11} />
                </a>
              )}
            </div>

            {/* Bio / Executive Summary */}
            {app.candidate.bio && (
              <div className="pt-2 border-t border-[#bcd6fa]/40">
                <span className="text-[11px] font-mono text-mist uppercase font-semibold block mb-1">
                  Candidate Professional Bio
                </span>
                <p className="text-xs text-ink-soft leading-relaxed bg-canvas/40 p-3 rounded-xl border border-[#bcd6fa]/40">
                  {app.candidate.bio}
                </p>
              </div>
            )}
          </div>

          {/* Technical Competencies & Skill Matrix Card */}
          <div className="rounded-2xl border border-[#bcd6fa] bg-white p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-[#bcd6fa]/40 pb-3">
              <h3 className="font-display text-sm font-bold text-ink">
                Technical Competencies &amp; Skill Matrix
              </h3>
              <span className="text-xs font-mono text-electric font-semibold">
                {app.candidate.skills.length} Assessed Skills
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {app.candidate.skills.map((skill, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-xl border border-[#bcd6fa]/60 bg-canvas/40 px-3 py-2 text-xs"
                >
                  <div>
                    <div className="font-display text-xs font-bold text-ink">{skill.name}</div>
                    <div className="text-[10px] text-mist capitalize">
                      {skill.proficiency} &bull; {skill.years_experience} yrs exp
                    </div>
                  </div>
                  <span className="rounded-full bg-white border border-[#bcd6fa] px-2 py-0.5 text-[9.5px] font-mono font-semibold uppercase text-ink-soft">
                    {skill.source}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Documents & Resume Vault Card */}
          <div className="rounded-2xl border border-[#bcd6fa] bg-white p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-[#bcd6fa]/40 pb-3">
              <h3 className="font-display text-sm font-bold text-ink">
                Documents &amp; CV Vault
              </h3>
              <span className="text-xs font-mono text-mist font-semibold">
                {app.candidate.documents.length} Uploaded Files
              </span>
            </div>

            <div className="space-y-2">
              {app.candidate.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between rounded-xl border border-[#bcd6fa] bg-white p-3 text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileText size={16} className="text-electric shrink-0" />
                    <div className="min-w-0">
                      <div className="font-display text-xs font-bold text-ink truncate">
                        {doc.original_filename}
                      </div>
                      <div className="text-[10.5px] text-mist">
                        {doc.doc_type.toUpperCase()} &bull; {(doc.size_bytes / 1024).toFixed(0)} KB &bull; Uploaded {doc.uploaded_at}
                      </div>
                    </div>
                  </div>

                  <span className="shrink-0 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-700">
                    {doc.scan_status.toUpperCase()}
                  </span>
                </div>
              ))}

              {app.candidate.documents.length === 0 && (
                <div className="flex h-24 flex-col items-center justify-center rounded-xl border border-dashed border-[#bcd6fa] bg-canvas/30 p-4 text-center">
                  <FileText size={16} className="text-mist opacity-60" />
                  <span className="mt-1 text-xs text-mist">No external documents uploaded. CV profile parsed directly.</span>
                </div>
              )}
            </div>
          </div>

          {/* Target Requisition Context Card */}
          <div className="rounded-2xl border border-[#bcd6fa] bg-white p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-[#bcd6fa]/40 pb-3">
              <h3 className="font-display text-sm font-bold text-ink">
                Target Requisition Context &amp; Scope
              </h3>
              <Link
                href="/recruiter/requisitions"
                className="text-xs font-semibold text-electric hover:underline inline-flex items-center gap-1"
              >
                <span>Manage Requisition</span>
                <ChevronRight size={12} />
              </Link>
            </div>

            <div className="text-xs space-y-2">
              <div className="font-display text-sm font-bold text-ink">
                {app.requisition.title}
              </div>
              <p className="text-ink-soft leading-relaxed">
                {app.requisition.description || "Active requisition deployed under Pepoltek 7-day deployment SLA."}
              </p>

              {app.requisition.discovery?.responsibilities && (
                <div className="pt-2">
                  <span className="font-semibold text-ink block mb-1">Key Responsibilities:</span>
                  <ul className="list-disc pl-4 space-y-1 text-ink-soft">
                    {app.requisition.discovery.responsibilities.slice(0, 3).map((r: string, i: number) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Application Handling & Live Workflow Operations (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* 1. Stage Progression Control Card */}
          <div className="rounded-2xl border border-[#bcd6fa] bg-white p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#bcd6fa]/40 pb-3">
              <div className="flex items-center gap-2">
                <Zap size={15} className="text-electric" />
                <h3 className="font-display text-sm font-bold text-ink">
                  Pipeline Stage Transition
                </h3>
              </div>
              <span className="rounded-full bg-electric/10 border border-electric/30 px-2 py-0.5 text-[10px] font-mono font-bold text-electric">
                STAGE CONTROL
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="mb-1 block font-semibold text-ink">
                  Target Pipeline Stage
                </label>
                <select
                  value={selectedStage}
                  onChange={(e) => setSelectedStage(e.target.value as StageKey)}
                  className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 text-xs font-medium text-ink focus:border-electric focus:outline-none transition-all cursor-pointer"
                >
                  <option value="discovery">1 - Discovery (Intake &amp; Profiling)</option>
                  <option value="market_mapping">2 - Market Mapping (Screened &amp; Sourced)</option>
                  <option value="technical_vetting">3 - Technical Vetting (Assessments &amp; Audits)</option>
                  <option value="interview">4 - Client Interview (Panels &amp; Meetings)</option>
                  <option value="closed">5 - Closed / Placed (Offer Accepted)</option>
                  <option value="rejected">Rejected</option>
                  <option value="withdrawn">Withdrawn</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block font-semibold text-ink">
                  Sub-Stage Milestone (Optional)
                </label>
                <input
                  type="text"
                  value={subStageInput}
                  onChange={(e) => setSubStageInput(e.target.value)}
                  placeholder="e.g. 1st Round Passed, Code Test Submitted"
                  className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 text-xs font-medium text-ink placeholder-mist focus:border-electric focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="mb-1 block font-semibold text-ink">
                  Recruiter Transition Audit Note
                </label>
                <textarea
                  rows={3}
                  value={stageNoteInput}
                  onChange={(e) => setStageNoteInput(e.target.value)}
                  placeholder="e.g. Candidate scored 95% on technical architecture round. Advancing to client interview panel."
                  className="w-full rounded-xl border border-[#bcd6fa] bg-white p-3 text-xs font-medium text-ink placeholder-mist focus:border-electric focus:outline-none transition-all"
                />
              </div>

              <button
                type="button"
                disabled={isUpdatingStage}
                onClick={handleExecuteStageMove}
                className="w-full rounded-xl bg-ink py-2.5 font-display text-xs font-bold text-white shadow-xs hover:bg-electric transition-colors cursor-pointer disabled:opacity-50 inline-flex items-center justify-center gap-2"
              >
                {isUpdatingStage ? "Updating Stage..." : "Confirm Stage Transition"}
                <ArrowRight size={13} />
              </button>
            </div>
          </div>

          {/* 2. Chronological Audit History & Event Log */}
          <div className="rounded-2xl border border-[#bcd6fa] bg-white p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#bcd6fa]/40 pb-3">
              <h3 className="font-display text-sm font-bold text-ink">
                Chronological Audit History
              </h3>
              <span className="font-mono text-xs text-mist">
                {app.events.length} Events
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
                  <span>{isLoggingNote ? "Logging..." : "Log Note"}</span>
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
                    <span className="font-bold text-ink">{ev.actor_name}</span>
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
        </div>
      </div>

      {/* SCHEDULE INTERVIEW MODAL / DRAWER */}
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
                  onClick={() => setIsSchedulingOpen(false)}
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

      {/* SHORTLIST PITCH MODAL / DRAWER */}
      {isShortlistOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-ink/40 backdrop-blur-xs">
          <div className="flex h-full w-full max-w-xl flex-col border-l border-[#bcd6fa] bg-white shadow-2xl animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between border-b border-[#bcd6fa]/60 px-6 py-5 bg-white">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold uppercase tracking-wider text-electric">
                  <Share2 size={13} />
                  Shortlist Pitch to Enterprise Client
                </div>
                <h2 className="mt-1 font-display text-lg font-bold text-ink">
                  Submit Candidate Package
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

            <div className="flex-1 space-y-5 overflow-y-auto p-6 text-xs text-ink-soft">
              <div>
                <label className="mb-1.5 block font-semibold text-ink">
                  Target Enterprise Client Organization
                </label>
                <select
                  value={shortlistClient}
                  onChange={(e) => setShortlistClient(e.target.value)}
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

              <div>
                <label className="mb-1.5 block font-semibold text-ink">
                  Preferred Delivery Channel
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
                    <span className="text-xs text-ink-soft font-medium">Include Proposed Hourly Rates</span>
                    <input
                      type="checkbox"
                      checked={includeRates}
                      onChange={(e) => setIncludeRates(e.target.checked)}
                      className="h-4 w-4 rounded border-[#bcd6fa] text-electric focus:ring-electric cursor-pointer"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block font-semibold text-ink">
                  Recruiter Pitch Notes &amp; Highlights for Client
                </label>
                <textarea
                  rows={3}
                  value={shortlistPitchNotes}
                  onChange={(e) => setShortlistPitchNotes(e.target.value)}
                  placeholder="e.g. Vetted specialist with extensive production experience. Ready for client interview."
                  className="w-full rounded-xl border border-[#bcd6fa] bg-white p-3 text-xs font-medium text-ink placeholder-mist focus:border-electric focus:outline-none transition-all"
                />
              </div>
            </div>

            <div className="border-t border-[#bcd6fa]/60 p-5 bg-white">
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsShortlistOpen(false)}
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
    </div>
  );
}
