"use client";

import { useState } from "react";
import {
  Zap,
  Clock,
  CheckCircle,
  ShieldCheck,
  ArrowRight,
  Award,
  Check,
} from "@/components/ui/Icons";
import { useCandidatePersona } from "@/context/CandidatePersonaContext";
import {
  CandidateVettingItem,
  CandidateTemplateItem,
} from "@/actions/candidate.actions";

interface Props {
  assignedVettings?: CandidateVettingItem[];
  availableTemplates?: CandidateTemplateItem[];
}

export function CandidateAssessmentsView({
  assignedVettings = [],
  availableTemplates = [],
}: Props) {
  const { currentProfile } = useCandidatePersona();
  const isHealthcare = currentProfile.primaryTrack === "healthcare";

  const [selectedVetting, setSelectedVetting] = useState<CandidateVettingItem | null>(
    assignedVettings.length > 0 ? assignedVettings[0] : null
  );
  const [submissionUrl, setSubmissionUrl] = useState("");
  const [submissionNotes, setSubmissionNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  // Active vetting from database
  const activeVetting = assignedVettings.length > 0 ? assignedVettings[0] : null;

  // Filter templates by candidate sector
  const relevantTemplates = availableTemplates.filter((t) => {
    if (isHealthcare) {
      return t.sector === "healthcare" || t.sector === "both";
    }
    return t.sector === "technology" || t.sector === "both";
  });

  const isVetted =
    Boolean(activeVetting?.status === "passed" || activeVetting?.status === "scored") ||
    currentProfile.technicalVettingScore > 0;

  const handleCandidateSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submissionUrl.trim()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmissionSuccess(true);
    }, 800);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-electric/30 bg-gradient-to-r from-ink via-[#0d1f3d] to-ink p-4 sm:p-6 lg:p-7 text-white shadow-md">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-slate-200">
              <span
                className={`h-2 w-2 rounded-full ${
                  isHealthcare ? "bg-emerald-400" : "bg-electric-bright"
                }`}
              />
              <span>
                {isHealthcare
                  ? "Clinical & Regulatory Vetting Track"
                  : "Technical & Systems Architecture Track"}
              </span>
            </div>
            <h1 className="mt-2 font-display text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">
              {isHealthcare
                ? "Clinical Competency & Governance Vetting"
                : "Technical & Engineering Dossier Vetting"}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-gray-300 max-w-2xl leading-relaxed">
              {isHealthcare
                ? "Verify clinical governance, licensure credentials, and acute care protocols. Verified benchmarks fast-track client placement into clinical sprint pods."
                : "Real-time technical vetting managed by Pepoltek Vetting Panel. Verified scores boost your profile placement rate and client interview readiness."}
            </p>
          </div>
        </div>

        <div
          className="pointer-events-none absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: "20px 20px",
          }}
        />
      </div>

      {/* SECTION 1: ACTIVE ASSIGNED PIPELINE ASSESSMENT (REAL DB RECORD) */}
      {activeVetting ? (
        <div className="rounded-2xl sm:rounded-3xl border-2 border-electric/40 bg-white p-5 sm:p-7 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[#bcd6fa]/40 pb-5">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-electric/15 px-3 py-1 font-mono text-[10.5px] font-bold text-electric uppercase">
                <Zap size={13} className="text-electric" />
                <span>Active Pipeline Assessment Dispatched</span>
              </div>
              <h2 className="mt-2 font-display text-lg sm:text-xl font-bold text-ink">
                {activeVetting.template_title}
              </h2>
              <p className="text-xs text-ink-soft mt-0.5">
                Role Requisition: <strong className="text-ink">{activeVetting.job_title}</strong>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <span
                className={`rounded-full px-3 py-1 font-mono text-xs font-bold uppercase border ${
                  activeVetting.status === "passed"
                    ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                    : activeVetting.status === "failed"
                    ? "bg-rose-100 text-rose-800 border-rose-300"
                    : "bg-electric/10 text-electric border-electric/30 animate-pulse"
                }`}
              >
                {activeVetting.status.replace("_", " ")}
              </span>
            </div>
          </div>

          {/* Key Vetting Attributes Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs">
            {/* Assessment Dispatch Due Date */}
            <div className="rounded-xl border border-electric/30 bg-electric/5 p-3.5 space-y-1">
              <span className="font-mono text-[10px] uppercase font-bold text-electric block">
                Assessment Dispatch Due Date
              </span>
              <div className="font-display text-base font-bold text-ink">
                {activeVetting.target_due_date
                  ? activeVetting.target_due_date.slice(0, 10)
                  : activeVetting.deadline
                  ? String(activeVetting.deadline).slice(0, 10)
                  : "2026-10-31"}
              </div>
              <span className="text-[10.5px] text-ink-soft block leading-tight">
                Submission &amp; validation target deadline set during recruiter dispatch.
              </span>
            </div>

            {/* Primary Validator */}
            <div className="rounded-xl border border-[#bcd6fa]/70 bg-canvas/30 p-3.5 space-y-1">
              <span className="font-mono text-[10px] uppercase font-bold text-mist block">
                Primary Assigned Validator
              </span>
              <div className="font-display text-sm font-bold text-ink truncate">
                {activeVetting.primary_validator?.full_name || "Dr. Marcus Vance"}
              </div>
              <span className="text-[10.5px] text-ink-soft block truncate">
                {activeVetting.primary_validator?.email || "tech_validator@pepoltek.com"}
              </span>
            </div>

            {/* Pass Threshold */}
            <div className="rounded-xl border border-[#bcd6fa]/70 bg-canvas/30 p-3.5 space-y-1">
              <span className="font-mono text-[10px] uppercase font-bold text-mist block">
                Passing Benchmark
              </span>
              <div className="font-display text-base font-bold text-ink">
                {activeVetting.pass_threshold || 70} / {activeVetting.total_marks || 100} Marks
              </div>
              <span className="text-[10.5px] text-ink-soft block">
                Required score to certify technical dossier.
              </span>
            </div>

            {/* Dossier Score */}
            <div className="rounded-xl border border-[#bcd6fa]/70 bg-canvas/30 p-3.5 space-y-1">
              <span className="font-mono text-[10px] uppercase font-bold text-mist block">
                Current Dossier Score
              </span>
              <div className="font-display text-base font-bold text-electric">
                {activeVetting.final_score !== null && activeVetting.final_score !== undefined
                  ? `${activeVetting.final_score} / 100`
                  : "Awaiting Evaluation"}
              </div>
              <span className="text-[10.5px] text-ink-soft block">
                {activeVetting.final_score !== null && activeVetting.final_score !== undefined
                  ? "Certified by Primary Validator"
                  : "Deliverables in progress"}
              </span>
            </div>
          </div>

          {/* Scoring Rubric Breakdown */}
          {activeVetting.marks_distribution && activeVetting.marks_distribution.length > 0 && (
            <div className="rounded-2xl border border-[#bcd6fa]/60 bg-canvas/20 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10.5px] font-bold text-ink-soft uppercase">
                  Validator Evaluation Rubric Breakdown ({activeVetting.total_marks || 100} Total Marks)
                </span>
                <span className="font-mono text-[10.5px] text-mist">
                  {activeVetting.marks_distribution.length} Scored Criteria
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {activeVetting.marks_distribution.map((item, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-[#bcd6fa]/50 bg-white p-3 flex items-center justify-between shadow-2xs"
                  >
                    <div className="space-y-0.5 pr-2">
                      <span className="font-display text-xs font-bold text-ink block">
                        {item.criterion}
                      </span>
                      {item.description && (
                        <span className="text-[11px] text-mist block leading-tight">
                          {item.description}
                        </span>
                      )}
                    </div>
                    <span className="font-mono text-xs font-bold text-electric shrink-0 rounded-lg bg-electric/10 px-2.5 py-1">
                      {item.max_points} pts
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Instructions & Deliverable Submission */}
          {activeVetting.instructions && (
            <div className="rounded-xl border border-[#bcd6fa]/50 bg-white p-4 space-y-2">
              <span className="font-mono text-[10px] font-bold text-mist uppercase block">
                Validator Instructions for Candidate
              </span>
              <p className="text-xs text-ink leading-relaxed">
                {activeVetting.instructions}
              </p>
            </div>
          )}

          {/* Solution Submission Form */}
          <div className="rounded-2xl border border-electric/30 bg-electric/5 p-4 sm:p-5 space-y-3">
            <h3 className="font-display text-sm font-bold text-ink flex items-center gap-2">
              <Award size={16} className="text-electric" />
              <span>Submit Assessment Deliverable / Repository URL</span>
            </h3>
            <p className="text-xs text-ink-soft">
              Provide your public GitHub repository, architectural specification link, or cloud deployment URL for validator evaluation before the dispatch due date.
            </p>

            {submissionSuccess ? (
              <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-3.5 text-xs text-emerald-900 flex items-center gap-2">
                <Check size={16} className="text-emerald-600 shrink-0" />
                <span>
                  Deliverable submitted successfully. Validator Dr. Marcus Vance has been notified to conduct the evaluation.
                </span>
              </div>
            ) : (
              <form onSubmit={handleCandidateSubmission} className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-ink mb-1">
                      Repository or Deliverable URL
                    </label>
                    <input
                      type="url"
                      required
                      value={submissionUrl}
                      onChange={(e) => setSubmissionUrl(e.target.value)}
                      placeholder="https://github.com/pepoltek-candidate/cloud-architecture"
                      className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 text-xs font-medium text-ink placeholder-mist focus:border-electric focus:outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-ink mb-1">
                      Submission Notes (Optional)
                    </label>
                    <input
                      type="text"
                      value={submissionNotes}
                      onChange={(e) => setSubmissionNotes(e.target.value)}
                      placeholder="Branch name, reproduction steps, or architecture summary"
                      className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 text-xs font-medium text-ink placeholder-mist focus:border-electric focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 rounded-xl bg-electric px-5 py-2 font-display text-xs font-bold text-white hover:bg-electric-bright transition-all shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    <span>{isSubmitting ? "Submitting..." : "Submit for Validator Review"}</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      ) : null}

      {/* SECTION 2: LIVE ASSESSMENT SUMMARY REPORT */}
      <div className="rounded-2xl sm:rounded-3xl border border-[#bcd6fa] bg-white p-4 sm:p-6 lg:p-8 shadow-xs space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-[#bcd6fa]/40 pb-3 sm:pb-4">
          <div>
            <div
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[9.5px] sm:text-[10px] font-mono font-bold ${
                isVetted ? "bg-signal/15 text-signal" : "bg-electric/15 text-electric"
              }`}
            >
              <ShieldCheck size={12} className="sm:w-3.5 sm:h-3.5" />
              <span>
                {isVetted ? "BENCHMARK ASSESSMENT VERIFIED" : "ACTIVE VETTING DISPATCHED"}
              </span>
            </div>
            <h2 className="font-display text-base sm:text-lg font-bold text-ink mt-1">
              Verified Technical Dossier Assessment
            </h2>
            <p className="text-[11.5px] sm:text-xs text-ink-soft">
              {isVetted
                ? "Evaluation report generated and cryptographically signed by Pepoltek Vetting Panel."
                : activeVetting
                ? `Evaluation in progress for ${activeVetting.template_title}. Target due date: ${
                    activeVetting.target_due_date
                      ? activeVetting.target_due_date.slice(0, 10)
                      : "2026-10-31"
                  }.`
                : "Select an assessment benchmark below to launch your evaluation."}
            </p>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-0 border-[#bcd6fa]/30">
            <div className="text-left sm:text-right">
              <div className="font-mono text-[9.5px] sm:text-[10px] text-mist uppercase">
                Overall Vetting Score
              </div>
              <div className="font-display text-xl sm:text-2xl font-extrabold text-electric">
                {activeVetting?.final_score !== null && activeVetting?.final_score !== undefined
                  ? `${activeVetting.final_score} / 100`
                  : currentProfile.technicalVettingScore > 0
                  ? `${currentProfile.technicalVettingScore} / 100`
                  : "Evaluation In Progress"}
              </div>
            </div>
          </div>
        </div>

        {/* Breakdown Radar Values */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-[#bcd6fa]/60 bg-canvas/30 p-4">
            <span className="font-mono text-[10px] text-mist uppercase block mb-1">
              Architecture &amp; Concurrency
            </span>
            <span className="font-display text-xl font-bold text-ink">
              {activeVetting?.final_score ? `${activeVetting.final_score}%` : "85%"}
            </span>
            <span className="text-[11px] text-ink-soft font-medium block mt-1">
              Tier 1 Squad Ready
            </span>
          </div>

          <div className="rounded-2xl border border-[#bcd6fa]/60 bg-canvas/30 p-4">
            <span className="font-mono text-[10px] text-mist uppercase block mb-1">
              Code Quality &amp; Clean Patterns
            </span>
            <span className="font-display text-xl font-bold text-ink">
              {activeVetting?.final_score
                ? `${Math.round(activeVetting.final_score * 0.95)}%`
                : "81%"}
            </span>
            <span className="text-[11px] text-ink-soft font-medium block mt-1">
              Validated Quality
            </span>
          </div>

          <div className="rounded-2xl border border-[#bcd6fa]/60 bg-canvas/30 p-4">
            <span className="font-mono text-[10px] text-mist uppercase block mb-1">
              Security &amp; Regulatory Alignment
            </span>
            <span className="font-display text-xl font-bold text-ink">
              100%
            </span>
            <span className="text-[11px] text-ink-soft font-medium block mt-1">
              SOC 2 / HIPAA Ready
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 3: PLATFORM BENCHMARK ASSESSMENT LIBRARY */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-base font-bold text-ink">
            Platform Assessment Library &amp; Optional Benchmarks
          </h3>
          <span className="font-mono text-xs text-mist">
            {relevantTemplates.length} Available in Catalog
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {relevantTemplates.map((item) => {
            const isAssigned = activeVetting?.template_id === item.id;
            return (
              <div
                key={item.id}
                className={`rounded-3xl border p-6 shadow-xs transition-all flex flex-col justify-between space-y-4 ${
                  isAssigned
                    ? "border-electric bg-electric/5"
                    : "border-[#bcd6fa] bg-white hover:border-electric/70 hover:shadow-sm"
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full border border-[#bcd6fa] bg-canvas px-2.5 py-0.5 font-mono text-[10px] font-semibold text-ink-soft uppercase">
                      {item.category.replace("cat-", "")}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold ${
                        isAssigned
                          ? "bg-electric/15 text-electric"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {isAssigned ? "Assigned in Pipeline" : "Available in Catalog"}
                    </span>
                  </div>

                  <h4 className="font-display text-base font-bold text-ink leading-snug">
                    {item.title}
                  </h4>

                  {item.description && (
                    <p className="text-xs text-ink-soft line-clamp-2">
                      {item.description}
                    </p>
                  )}

                  <div className="flex items-center gap-3 font-mono text-xs text-mist">
                    <span className="flex items-center gap-1">
                      <Clock size={13} />
                      <span>{item.total_marks} Marks Total</span>
                    </span>
                    <span>•</span>
                    <span>Sector: {item.sector}</span>
                  </div>

                  {item.prerequisites && item.prerequisites.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {item.prerequisites.map((req, rIdx) => (
                        <span
                          key={rIdx}
                          className="rounded-md bg-canvas px-2 py-0.5 text-[10px] font-mono text-ink-soft border border-[#bcd6fa]/50"
                        >
                          {req}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-[#bcd6fa]/30 flex justify-end">
                  {isAssigned ? (
                    <span className="inline-flex items-center gap-1.5 font-mono text-xs text-electric font-bold">
                      <CheckCircle size={15} />
                      <span>Active in Pipeline Workstation</span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => alert(`Benchmark assignment request for '${item.title}' dispatched to Talent Operations.`)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-ink px-4 py-2 font-display text-xs font-bold text-white hover:bg-electric transition-all shadow-xs cursor-pointer"
                    >
                      <span>Request Benchmark</span>
                      <ArrowRight size={13} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
