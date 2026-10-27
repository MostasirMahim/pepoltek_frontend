"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  RecruiterInterviewDetail,
  InterviewEvaluationItem,
  InterviewPanelAssignmentItem,
} from "@/types/recruiter.types";
import {
  submitInterviewEvaluationAction,
  updateInterviewAction,
  updateInterviewPanelAction,
} from "@/actions/recruiter.actions";
import {
  Calendar,
  Clock,
  Video,
  ExternalLink,
  Copy,
  Check,
  CheckCircle2,
  AlertCircle,
  Award,
  Users,
  UserCheck,
  Send,
  ArrowLeft,
  Briefcase,
  FileText,
  Shield,
  Edit3,
  X,
  Star,
  ChevronRight,
} from "lucide-react";

interface InterviewDetailViewProps {
  interview: RecruiterInterviewDetail;
  basePath?: string; // "/recruiter/interviews" or "/admin/interviews"
}

export function InterviewDetailView({
  interview: initialInterview,
  basePath = "/recruiter/interviews",
}: InterviewDetailViewProps) {
  const router = useRouter();
  const [interview, setInterview] = useState<RecruiterInterviewDetail>(initialInterview);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showRescheduleDrawer, setShowRescheduleDrawer] = useState(false);
  const [showEvaluationDrawer, setShowEvaluationDrawer] = useState(false);
  const [showAddPanelistDrawer, setShowAddPanelistDrawer] = useState(false);

  // Reschedule Form State
  const [editDate, setEditDate] = useState(
    interview.scheduled_start ? interview.scheduled_start.slice(0, 10) : ""
  );
  const [editStartTime, setEditStartTime] = useState(
    interview.scheduled_start ? interview.scheduled_start.slice(11, 16) : "14:00"
  );
  const [editDuration, setEditDuration] = useState("60");
  const [editMeetingLink, setEditMeetingLink] = useState(interview.meeting_link || "");
  const [editStatus, setEditStatus] = useState(interview.raw_status || "scheduled");
  const [isRescheduling, setIsRescheduling] = useState(false);

  // Evaluation Form State
  const [score, setScore] = useState<number>(85);
  const [recommendation, setRecommendation] = useState<string>("hire");
  const [feedback, setFeedback] = useState<string>("");
  const isHealthcareRole = useMemo(() => {
    const text = `${initialInterview.role || ""} ${initialInterview.type || ""}`.toLowerCase();
    return (
      text.includes("health") ||
      text.includes("clinical") ||
      text.includes("nurse") ||
      text.includes("doctor") ||
      text.includes("physician")
    );
  }, [initialInterview]);

  const [competencies, setCompetencies] = useState<
    { competency: string; score: number; max_score: number; notes: string }[]
  >(() => {
    const text = `${initialInterview.role || ""} ${initialInterview.type || ""}`.toLowerCase();
    if (
      text.includes("health") ||
      text.includes("clinical") ||
      text.includes("nurse") ||
      text.includes("doctor") ||
      text.includes("physician")
    ) {
      return [
        {
          competency: "Clinical Protocol & Patient Safety",
          score: 23,
          max_score: 25,
          notes: "Thorough adherence to GMC/NMC guidelines, hygiene, and emergency intervention.",
        },
        {
          competency: "Diagnostic Triage & Decision Making",
          score: 22,
          max_score: 25,
          notes: "Sound clinical judgment under pressure and patient safety priority.",
        },
        {
          competency: "Governance, EHR & Clinical Records",
          score: 21,
          max_score: 25,
          notes: "Familiarity with hospital audit standards, EHR documentation, and compliance.",
        },
        {
          competency: "Bedside Manner & Team Handover",
          score: 22,
          max_score: 25,
          notes: "Clear multi-disciplinary team communication, empathetic rapport, and composure.",
        },
      ];
    }
    return [
      {
        competency: "Architecture & System Design",
        score: 22,
        max_score: 25,
        notes: "Demonstrates practical production experience and distributed systems awareness.",
      },
      {
        competency: "Execution & Problem Solving",
        score: 21,
        max_score: 25,
        notes: "Clean problem decomposition, algorithmic rigor, and edge-case handling.",
      },
      {
        competency: "Domain & Stack Expertise",
        score: 22,
        max_score: 25,
        notes: "Fluent grasp of relevant stack specifications and modern conventions.",
      },
      {
        competency: "Cross-Functional Collaboration & Delivery",
        score: 20,
        max_score: 25,
        notes: "Clear verbal walkthrough and receptive responses to challenge questions.",
      },
    ];
  });
  const [isSubmittingEval, setIsSubmittingEval] = useState(false);

  // Status message
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );

  const handleCopyLink = () => {
    if (interview.meeting_link) {
      navigator.clipboard.writeText(interview.meeting_link);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleRescheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRescheduling(true);
    setStatusMsg(null);

    const startDateTime = new Date(`${editDate}T${editStartTime}:00Z`);
    const endDateTime = new Date(startDateTime.getTime() + parseInt(editDuration, 10) * 60000);

    const res = await updateInterviewAction(interview.id, {
      scheduled_start: startDateTime.toISOString(),
      scheduled_end: endDateTime.toISOString(),
      meeting_link: editMeetingLink,
      status: editStatus,
    });

    setIsRescheduling(false);
    if (res.success && res.data) {
      setInterview({
        ...interview,
        scheduled_start: res.data.scheduled_start,
        scheduled_end: res.data.scheduled_end,
        time: res.data.time || new Date(res.data.scheduled_start).toLocaleString(),
        meeting_link: res.data.meeting_link,
        status: res.data.status,
        raw_status: res.data.status,
      });
      setShowRescheduleDrawer(false);
      setStatusMsg({ type: "success", text: "Interview schedule updated successfully." });
      router.refresh();
    } else {
      setStatusMsg({ type: "error", text: res.error || "Failed to update interview schedule." });
    }
  };

  const handleEvaluationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) {
      setStatusMsg({ type: "error", text: "Please enter detailed evaluation feedback." });
      return;
    }

    setIsSubmittingEval(true);
    setStatusMsg(null);

    const res = await submitInterviewEvaluationAction(interview.id, {
      score,
      recommendation,
      competency_scores: competencies,
      feedback: feedback.trim(),
    });

    setIsSubmittingEval(false);
    if (res.success && res.data) {
      setInterview({
        ...interview,
        evaluations: res.data.evaluations || [],
        evaluations_count: (res.data.evaluations || []).length,
        average_score: res.data.average_score,
        status: "Completed",
        raw_status: "completed",
      });
      setShowEvaluationDrawer(false);
      setFeedback("");
      setStatusMsg({
        type: "success",
        text: "Evaluation scorecard recorded successfully. Application telemetry updated.",
      });
      router.refresh();
    } else {
      setStatusMsg({ type: "error", text: res.error || "Failed to submit evaluation scorecard." });
    }
  };

  // Helper colors
  const getStatusBadge = (st: string) => {
    const s = (st || "").toLowerCase();
    if (s.includes("completed")) {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
    if (s.includes("confirmed")) {
      return "bg-blue-50 text-blue-700 border-blue-200";
    }
    if (s.includes("rescheduled")) {
      return "bg-amber-50 text-amber-700 border-amber-200";
    }
    if (s.includes("cancelled")) {
      return "bg-rose-50 text-rose-700 border-rose-200";
    }
    return "bg-indigo-50 text-indigo-700 border-indigo-200";
  };

  const getRecommendationBadge = (rec: string) => {
    const r = (rec || "").toLowerCase();
    if (r.includes("strong_hire")) {
      return { label: "Strong Hire", cls: "bg-emerald-500/10 text-emerald-700 border-emerald-300" };
    }
    if (r.includes("hire")) {
      return { label: "Hire", cls: "bg-blue-500/10 text-blue-700 border-blue-300" };
    }
    if (r.includes("neutral")) {
      return { label: "Neutral", cls: "bg-amber-500/10 text-amber-700 border-amber-300" };
    }
    return { label: "Do Not Hire", cls: "bg-rose-500/10 text-rose-700 border-rose-300" };
  };

  return (
    <div className="space-y-6 pb-12 font-enterprise text-[#0a0d12]">
      {/* Back button */}
      <div>
        <Link
          href={basePath}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Candidate Interviews</span>
        </Link>
      </div>

      {/* Status banner */}
      {statusMsg && (
        <div
          className={`flex items-center justify-between rounded-xl border p-4 text-xs font-medium ${
            statusMsg.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-rose-200 bg-rose-50 text-rose-800"
          }`}
        >
          <div className="flex items-center gap-2">
            {statusMsg.type === "success" ? (
              <CheckCircle2 size={16} className="text-emerald-600" />
            ) : (
              <AlertCircle size={16} className="text-rose-600" />
            )}
            <span>{statusMsg.text}</span>
          </div>
          <button
            onClick={() => setStatusMsg(null)}
            className="text-xs font-bold hover:opacity-75 cursor-pointer ml-3"
          >
            ✕
          </button>
        </div>
      )}

      {/* Header Bar */}
      <div className="rounded-2xl border border-[#bcd6fa]/60 bg-white p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-indigo-200 bg-indigo-50/80 px-2.5 py-0.5 text-[11px] font-bold text-indigo-700 uppercase tracking-wider">
                Round {interview.round_number || 1} · {interview.type}
              </span>
              <span
                className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${getStatusBadge(
                  interview.status
                )}`}
              >
                {interview.status}
              </span>
              {interview.average_score !== null && interview.average_score !== undefined && (
                <span className="rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">
                  Avg Score: {interview.average_score}/100
                </span>
              )}
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-[#0a0d12]">
              {interview.title || "Candidate Interview Session"}
            </h1>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
              <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                <Users size={14} className="text-slate-400" />
                <span>{interview.candidate}</span>
              </div>
              <span className="text-slate-300">•</span>
              <div className="flex items-center gap-1.5">
                <Briefcase size={14} className="text-slate-400" />
                <span>{interview.role}</span>
              </div>
              <span className="text-slate-300">•</span>
              <div className="flex items-center gap-1.5">
                <span className="font-medium text-slate-500">Client:</span>
                <span className="font-semibold text-slate-800">{interview.client_name}</span>
              </div>
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            {interview.meeting_link && (
              <a
                href={interview.meeting_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition-colors"
              >
                <Video size={14} />
                <span>Join Google Meet</span>
                <ExternalLink size={12} className="opacity-70" />
              </a>
            )}

            <button
              onClick={() => setShowEvaluationDrawer(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 transition-colors cursor-pointer"
            >
              <Award size={14} />
              <span>Submit Evaluation</span>
            </button>

            <button
              onClick={() => setShowRescheduleDrawer(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Edit3 size={13} />
              <span>Reschedule</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Left 2 Cols, Right 1 Col */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Logistics, Briefs, Scorecards */}
        <div className="lg:col-span-2 space-y-6">
          {/* Logistics and Reminder Queue Status */}
          <div className="rounded-2xl border border-[#bcd6fa]/60 bg-white p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Calendar size={16} className="text-blue-600" />
              <span>Session Timing and Automated Notification Telemetry</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Scheduled Start Time
                </span>
                <p className="font-semibold text-slate-900 text-sm">{interview.time}</p>
                <p className="text-[11px] text-slate-500">Timezone: {interview.timezone || "UTC"}</p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  24-Hour Automated Reminder Queue
                </span>
                {interview.reminder_24h_dispatched ? (
                  <div className="flex items-center gap-1.5 text-emerald-700 font-semibold mt-0.5">
                    <CheckCircle2 size={14} />
                    <span>Dispatched via SMTP 24h Prior</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-amber-700 font-semibold mt-0.5">
                    <Clock size={14} />
                    <span>Queued in Celery (Dispatches 24h Prior)</span>
                  </div>
                )}
                <p className="text-[10px] text-slate-500">
                  Sends personalized briefs with calendar coordinates to candidate and all panel members.
                </p>
              </div>
            </div>

            {/* Google Meet Room Card */}
            <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 font-bold text-blue-900">
                  <Video size={15} className="text-blue-600" />
                  <span>Google Meet Video Conference Room</span>
                </div>
                <p className="font-mono text-[11px] text-blue-700 break-all">
                  {interview.meeting_link || "Link will be assigned upon candidate confirmation"}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-1 rounded-lg border border-blue-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-blue-700 hover:bg-blue-50 transition-colors cursor-pointer"
                >
                  {copiedLink ? <Check size={12} /> : <Copy size={12} />}
                  <span>{copiedLink ? "Copied" : "Copy Link"}</span>
                </button>
                {interview.meeting_link && (
                  <a
                    href={interview.meeting_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-blue-700 transition-colors"
                  >
                    <span>Join</span>
                    <ExternalLink size={11} />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Candidate Preparation Brief & Internal Brief */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-[#bcd6fa]/60 bg-white p-5 shadow-xs space-y-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <FileText size={14} className="text-indigo-600" />
                <span>Candidate Preparation Brief</span>
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {interview.candidate_notes ||
                  "Candidate advised to test camera and microphone 5 minutes prior to the session, review role requirements, and be prepared for interactive evaluation questions."}
              </p>
            </div>

            <div className="rounded-2xl border border-[#bcd6fa]/60 bg-white p-5 shadow-xs space-y-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Shield size={14} className="text-amber-600" />
                <span>Internal Panel Strategy Brief</span>
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {interview.internal_brief ||
                  "Confidential to panel: assess candidate core competencies, situational decision-making, and communication alignment for this requisition."}
              </p>
            </div>
          </div>

          {/* Evaluations & Scorecards Section */}
          <div className="rounded-2xl border border-[#bcd6fa]/60 bg-white p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Award size={18} className="text-emerald-600" />
                  <span>Panel Evaluation Scorecards and Consensus</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Standardized competency rubric recorded by verified Pepoltek staff validators.
                </p>
              </div>

              <button
                onClick={() => setShowEvaluationDrawer(true)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 transition-colors cursor-pointer self-start sm:self-auto"
              >
                <Award size={13} />
                <span>Add Scorecard</span>
              </button>
            </div>

            {/* Scorecard Consensus Summary Banner */}
            {interview.evaluations && interview.evaluations.length > 0 ? (
              <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 font-bold text-white text-lg shadow-xs">
                    {interview.average_score ?? Math.round(
                      interview.evaluations.reduce((acc, curr) => acc + curr.score, 0) /
                        interview.evaluations.length
                    )}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                      Consensus Assessment
                    </span>
                    <h3 className="text-sm font-bold text-emerald-950">
                      {interview.evaluations.length} Panel{" "}
                      {interview.evaluations.length === 1 ? "Evaluation" : "Evaluations"} Submitted
                    </h3>
                  </div>
                </div>

                <div className="text-xs text-right sm:text-right">
                  <span className="font-medium text-emerald-800">
                    Recommended for Stage 5 Sprint Offer
                  </span>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-6 text-center space-y-2">
                <Award size={24} className="mx-auto text-slate-400" />
                <h4 className="text-xs font-bold text-slate-800">No Evaluation Scorecards Submitted Yet</h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Assigned panel members can evaluate this candidate using the standardized 0 to 100 competency scorecard.
                </p>
                <button
                  onClick={() => setShowEvaluationDrawer(true)}
                  className="mt-2 inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs"
                >
                  Submit First Scorecard
                </button>
              </div>
            )}

            {/* Existing Evaluation Cards */}
            {interview.evaluations && interview.evaluations.length > 0 && (
              <div className="space-y-4">
                {interview.evaluations.map((ev) => {
                  const rec = getRecommendationBadge(ev.recommendation);
                  return (
                    <div
                      key={ev.id}
                      className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 font-bold text-white text-xs">
                            {ev.evaluator_name?.charAt(0) || "E"}
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-900">{ev.evaluator_name}</h4>
                            <p className="text-[11px] text-slate-500">{ev.evaluator_email}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${rec.cls}`}
                          >
                            {rec.label}
                          </span>
                          <span className="rounded-full bg-slate-900 px-2.5 py-0.5 text-[11px] font-bold text-white">
                            {ev.score} / 100
                          </span>
                        </div>
                      </div>

                      {/* Competency Ratings breakdown */}
                      {ev.competency_scores && ev.competency_scores.length > 0 && (
                        <div className="space-y-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Competency Breakdown
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {ev.competency_scores.map((comp, cIdx) => (
                              <div
                                key={cIdx}
                                className="rounded-lg border border-slate-100 bg-slate-50/70 p-2.5 space-y-1 text-xs"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-semibold text-slate-800 text-[11px]">
                                    {comp.competency}
                                  </span>
                                  <span className="font-bold text-slate-900 text-[11px]">
                                    {comp.score} / {comp.max_score || 25}
                                  </span>
                                </div>
                                <div className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                                  <div
                                    className="h-full bg-emerald-600 rounded-full"
                                    style={{
                                      width: `${(comp.score / (comp.max_score || 25)) * 100}%`,
                                    }}
                                  />
                                </div>
                                {comp.notes && (
                                  <p className="text-[10px] text-slate-500 italic mt-0.5">
                                    {comp.notes}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Evaluator Notes / Feedback */}
                      {ev.feedback && (
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Detailed Commentary
                          </span>
                          <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                            {ev.feedback}
                          </p>
                        </div>
                      )}

                      <div className="text-[10px] text-slate-400 text-right">
                        Submitted:{" "}
                        {ev.submitted_at ? new Date(ev.submitted_at).toLocaleString() : "Recently"}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Panel Members Stack & Candidate Profile */}
        <div className="space-y-6">
          {/* Panel Members Card */}
          <div className="rounded-2xl border border-[#bcd6fa]/60 bg-white p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Users size={15} className="text-blue-600" />
                <span>Assigned Interview Panel</span>
              </h2>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                {(interview.assignments || []).length} Members
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {interview.assignments && interview.assignments.length > 0 ? (
                interview.assignments.map((assign) => (
                  <div key={assign.id} className="py-3 flex items-start justify-between gap-2 text-xs">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 font-bold text-slate-900">
                        <span>{assign.staff_user_name}</span>
                        {assign.has_confirmed && (
                          <CheckCircle2 size={12} className="text-emerald-600 shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500">{assign.staff_user_email}</p>
                      <span className="inline-block rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700 uppercase tracking-wider mt-1">
                        {assign.role.replace(/_/g, " ")}
                      </span>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        assign.has_confirmed
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-slate-50 text-slate-500 border border-slate-200"
                      }`}
                    >
                      {assign.has_confirmed ? "Confirmed" : "Invited"}
                    </span>
                  </div>
                ))
              ) : (
                <div className="py-3 text-xs text-slate-500 italic">
                  Lead Interviewer: {interview.lead_interviewer_name || "Assigned Delivery Lead"}
                </div>
              )}
            </div>
          </div>

          {/* Candidate Dossier Quick Card */}
          <div className="rounded-2xl border border-[#bcd6fa]/60 bg-white p-5 shadow-xs space-y-4">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <UserCheck size={15} className="text-emerald-600" />
              <span>Candidate Brief</span>
            </h2>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-slate-500">Full Name</span>
                <span className="font-bold text-slate-900">{interview.candidate}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-slate-500">Contact Email</span>
                <span className="font-mono text-[11px] text-slate-800">
                  {interview.candidate_email || "Verified Candidate"}
                </span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-slate-500">Target Role</span>
                <span className="font-medium text-slate-900 text-right">{interview.role}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-slate-500">Hiring Organization</span>
                <span className="font-semibold text-slate-900">{interview.client_name}</span>
              </div>
            </div>

            {interview.application_id && (
              <Link
                href={`/recruiter/applications/${interview.application_id}`}
                className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <span>View Full Application Dossier</span>
                <ChevronRight size={14} />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT-SIDE SHEET DRAWER: Submit Evaluation Scorecard */}
      {showEvaluationDrawer && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Award size={18} className="text-emerald-600" />
                    <span>Submit Interview Evaluation</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Official technical scorecard for {interview.candidate}
                  </p>
                </div>
                <button
                  onClick={() => setShowEvaluationDrawer(false)}
                  className="rounded-lg p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form id="eval-form" onSubmit={handleEvaluationSubmit} className="space-y-5 text-xs">
                {/* Overall Score */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-900">
                      Overall Technical Rating (0 to 100) *
                    </label>
                    <span className="font-bold text-sm text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                      {score} / 100
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={score}
                    onChange={(e) => setScore(parseInt(e.target.value, 10))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>0 (Unqualified)</span>
                    <span>50 (Borderline)</span>
                    <span>75 (Threshold)</span>
                    <span>100 (Exemplary)</span>
                  </div>
                </div>

                {/* Recommendation Choice */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-900">Stage 5 Recommendation *</label>
                  <select
                    value={recommendation}
                    onChange={(e) => setRecommendation(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 font-medium text-slate-800 focus:border-blue-500 focus:outline-hidden"
                  >
                    <option value="strong_hire">Strong Hire (Clear technical superiority)</option>
                    <option value="hire">Hire (Meets all required criteria)</option>
                    <option value="neutral">Neutral (Borderline / Second opinion recommended)</option>
                    <option value="do_not_hire">Do Not Hire (Does not meet required standards)</option>
                  </select>
                </div>

                {/* Competency Ratings */}
                <div className="space-y-3">
                  <label className="font-bold text-slate-900">Competency Breakdown (Max 25 pts each)</label>
                  {competencies.map((comp, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-800 text-[11px]">{comp.competency}</span>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            min="0"
                            max="25"
                            value={comp.score}
                            onChange={(e) => {
                              const val = Math.min(25, Math.max(0, parseInt(e.target.value, 10) || 0));
                              const updated = [...competencies];
                              updated[idx].score = val;
                              setCompetencies(updated);
                            }}
                            className="w-14 rounded-md border border-slate-300 bg-white px-2 py-1 text-center font-bold text-slate-900 text-xs"
                          />
                          <span className="text-slate-400 text-[11px]">/ 25</span>
                        </div>
                      </div>
                      <input
                        type="text"
                        value={comp.notes}
                        onChange={(e) => {
                          const updated = [...competencies];
                          updated[idx].notes = e.target.value;
                          setCompetencies(updated);
                        }}
                        placeholder="Evaluation note for this competency..."
                        className="w-full rounded-lg border border-slate-200 bg-white p-2 text-[11px] text-slate-700 focus:border-blue-500 focus:outline-hidden"
                      />
                    </div>
                  ))}
                </div>

                {/* Written Feedback / Justification */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-900">
                    Comprehensive Evaluator Notes and Justification *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Provide explicit architectural feedback, areas of strength, and potential risks identified during the session..."
                    className="w-full rounded-xl border border-slate-200 bg-white p-3 font-medium text-slate-800 focus:border-blue-500 focus:outline-hidden leading-relaxed"
                  />
                </div>
              </form>
            </div>

            <div className="border-t border-slate-100 p-4 bg-slate-50 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowEvaluationDrawer(false)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="eval-form"
                disabled={isSubmittingEval}
                className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-semibold text-white hover:bg-emerald-700 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
              >
                {isSubmittingEval ? "Recording Scorecard..." : "Submit Scorecard"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RIGHT-SIDE SHEET DRAWER: Reschedule Session */}
      {showRescheduleDrawer && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Calendar size={18} className="text-blue-600" />
                    <span>Reschedule Interview Session</span>
                  </h3>
                  <p className="text-xs text-slate-500">Update calendar coordinates and meeting room</p>
                </div>
                <button
                  onClick={() => setShowRescheduleDrawer(false)}
                  className="rounded-lg p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form id="reschedule-form" onSubmit={handleRescheduleSubmit} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-900">Scheduled Date *</label>
                  <input
                    type="date"
                    required
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 font-medium text-slate-800 focus:border-blue-500 focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-900">Start Time (UTC) *</label>
                    <input
                      type="time"
                      required
                      value={editStartTime}
                      onChange={(e) => setEditStartTime(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white p-2.5 font-medium text-slate-800 focus:border-blue-500 focus:outline-hidden"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-900">Duration (Minutes)</label>
                    <select
                      value={editDuration}
                      onChange={(e) => setEditDuration(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white p-2.5 font-medium text-slate-800 focus:border-blue-500 focus:outline-hidden"
                    >
                      <option value="30">30 Minutes</option>
                      <option value="45">45 Minutes</option>
                      <option value="60">60 Minutes</option>
                      <option value="90">90 Minutes</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-900">Google Meet Link</label>
                  <input
                    type="url"
                    value={editMeetingLink}
                    onChange={(e) => setEditMeetingLink(e.target.value)}
                    placeholder="https://meet.google.com/abc-defg-hij"
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 font-medium text-slate-800 focus:border-blue-500 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-900">Session Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 font-medium text-slate-800 focus:border-blue-500 focus:outline-hidden"
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="rescheduled">Rescheduled</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </form>
            </div>

            <div className="border-t border-slate-100 p-4 bg-slate-50 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowRescheduleDrawer(false)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="reschedule-form"
                disabled={isRescheduling}
                className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
              >
                {isRescheduling ? "Updating..." : "Save Schedule"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
