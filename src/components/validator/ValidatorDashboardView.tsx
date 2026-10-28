"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  ShieldCheck,
  CheckCircle,
  Clock,
  Search,
  ExternalLink,
  X,
  Zap,
  Award,
  AlertCircle,
  FileText,
  ChevronRight,
} from "@/components/ui/Icons";
import { UserCheck, Filter } from "lucide-react";
import {
  ValidatorDashboardPayload,
  TechnicalQueueItem,
  CredentialQueueItem,
  gradeAssessmentAction,
  verifyCredentialAction,
} from "@/actions/validator.actions";

interface ValidatorDashboardViewProps {
  initialData: ValidatorDashboardPayload;
}

export function ValidatorDashboardView({ initialData }: ValidatorDashboardViewProps) {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");

  const [data, setData] = useState<ValidatorDashboardPayload>(initialData);
  const [activeTab, setActiveTab] = useState<"technical" | "credentials" | "history">(
    tabParam === "technical" || tabParam === "credentials" || tabParam === "history"
      ? tabParam
      : initialData.profile.sector === "healthcare"
      ? "credentials"
      : "technical"
  );

  useEffect(() => {
    if (tabParam === "technical" || tabParam === "credentials" || tabParam === "history") {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Slide-over Sheet Drawer states
  const [selectedTechItem, setSelectedTechItem] = useState<TechnicalQueueItem | null>(null);
  const [selectedCredItem, setSelectedCredItem] = useState<CredentialQueueItem | null>(null);

  // Tech grading form states
  const [evalScore, setEvalScore] = useState<number>(85);
  const [evalVerdict, setEvalVerdict] = useState<"pass" | "fail">("pass");
  const [evalReadinessTier, setEvalReadinessTier] = useState<"emerging" | "ready" | "elite">("ready");
  const [evalFeedback, setEvalFeedback] = useState<string>("");
  const [criterionScores, setCriterionScores] = useState<Array<{ criterion: string; awarded_points: number; max_points: number }>>([]);
  const [isSubmittingGrade, setIsSubmittingGrade] = useState(false);

  // Credential verification form states
  const [credStatus, setCredStatus] = useState<"verified" | "rejected">("verified");
  const [credMethod, setCredMethod] = useState<string>("NURSYS Primary Source Database Lookup");
  const [credRejectionReason, setCredRejectionReason] = useState<string>("");
  const [isSubmittingVerification, setIsSubmittingVerification] = useState(false);

  // Notification feedback banner
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 5000);
  };

  // Open Technical Grading Drawer
  const handleOpenTechDrawer = (item: TechnicalQueueItem) => {
    setSelectedTechItem(item);
    const passThreshold = item.pass_threshold || 70;
    const defaultScore = item.final_score ?? passThreshold + 10;
    setEvalScore(defaultScore);
    setEvalVerdict(defaultScore >= passThreshold ? "pass" : "fail");
    setEvalReadinessTier(defaultScore >= 90 ? "elite" : "ready");
    setEvalFeedback(item.decision_notes || "");

    // Setup rubric criteria from template or default fallback
    const templateRubric = item.template?.marks_distribution || [];
    if (templateRubric.length > 0) {
      setCriterionScores(
        templateRubric.map((r) => ({
          criterion: r.criterion || r.name || "Evaluation Dimension",
          awarded_points: Math.round(Number(r.max_points) * 0.85),
          max_points: Number(r.max_points),
        }))
      );
    } else {
      setCriterionScores([
        { criterion: "System Architecture & Scalability", awarded_points: 34, max_points: 40 },
        { criterion: "Code Quality & Engineering Rigor", awarded_points: 26, max_points: 30 },
        { criterion: "Observability & Idempotent Safety", awarded_points: 25, max_points: 30 },
      ]);
    }
  };

  // Update criterion score and recalculate total
  const handleCriterionChange = (index: number, val: number) => {
    const updated = [...criterionScores];
    const max = updated[index].max_points;
    const clamped = Math.max(0, Math.min(max, val));
    updated[index].awarded_points = clamped;
    setCriterionScores(updated);

    const total = updated.reduce((sum, item) => sum + item.awarded_points, 0);
    setEvalScore(total);
    const threshold = selectedTechItem?.pass_threshold || 70;
    const nextVerdict = total >= threshold ? "pass" : "fail";
    setEvalVerdict(nextVerdict);
    if (total >= 90) setEvalReadinessTier("elite");
    else if (total >= threshold) setEvalReadinessTier("ready");
    else setEvalReadinessTier("emerging");
  };

  // Submit Technical Assessment Grade
  const handleSubmitGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTechItem) return;
    setIsSubmittingGrade(true);

    try {
      const res = await gradeAssessmentAction({
        vetting_id: selectedTechItem.id,
        score: evalScore,
        verdict: evalVerdict,
        feedback: evalFeedback,
        readiness_tier: evalReadinessTier,
        criterion_scores: criterionScores,
      });

      if (res.success) {
        showToast(`Evaluation completed. Score ${evalScore}/100 recorded with verdict ${evalVerdict.toUpperCase()}.`);
        // Update local state
        setData((prev) => {
          const updatedQueue = prev.technical_queue.map((item) =>
            item.id === selectedTechItem.id
              ? {
                  ...item,
                  status: evalVerdict === "pass" ? "passed" : "failed",
                  status_display: evalVerdict === "pass" ? "Passed" : "Failed",
                  final_score: evalScore,
                  decision_notes: evalFeedback,
                  candidate: {
                    ...item.candidate,
                    readiness_tier: evalReadinessTier,
                  },
                }
              : item
          );
          return {
            ...prev,
            technical_queue: updatedQueue,
            telemetry: {
              ...prev.telemetry,
              completed_evaluations: prev.telemetry.completed_evaluations + 1,
              pending_evaluations: Math.max(0, prev.telemetry.pending_evaluations - 1),
            },
          };
        });
        setSelectedTechItem(null);
      } else {
        showToast(res.error || "Failed to submit evaluation.", "error");
      }
    } catch {
      showToast("Network exception submitting evaluation.", "error");
    } finally {
      setIsSubmittingGrade(false);
    }
  };

  // Open Credential Verification Drawer
  const handleOpenCredDrawer = (item: CredentialQueueItem) => {
    setSelectedCredItem(item);
    setCredStatus("verified");
    setCredMethod(item.verification_method || "NURSYS Primary Source Database Lookup");
    setCredRejectionReason(item.rejection_reason || "");
  };

  // Submit Credential Verification
  const handleSubmitCredentialVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCredItem) return;
    setIsSubmittingVerification(true);

    try {
      const res = await verifyCredentialAction({
        credential_id: selectedCredItem.id,
        status: credStatus,
        verification_method: credMethod,
        rejection_reason: credStatus === "rejected" ? credRejectionReason : undefined,
      });

      if (res.success) {
        showToast(`Credential "${selectedCredItem.name}" updated to ${credStatus.toUpperCase()}.`);
        setData((prev) => {
          const updatedCreds = prev.credential_queue.map((c) =>
            c.id === selectedCredItem.id
              ? {
                  ...c,
                  status: credStatus,
                  status_display: credStatus === "verified" ? "Verified" : "Rejected",
                  verification_method: credMethod,
                  rejection_reason: credStatus === "rejected" ? credRejectionReason : "",
                  verified_by: prev.profile.full_name || prev.profile.email,
                  verified_at: new Date().toISOString(),
                }
              : c
          );
          return {
            ...prev,
            credential_queue: updatedCreds,
            telemetry: {
              ...prev.telemetry,
              pending_credentials: Math.max(0, prev.telemetry.pending_credentials - (credStatus === "verified" ? 1 : 0)),
              verified_credentials: prev.telemetry.verified_credentials + (credStatus === "verified" ? 1 : 0),
            },
          };
        });
        setSelectedCredItem(null);
      } else {
        showToast(res.error || "Failed to update credential verification.", "error");
      }
    } catch {
      showToast("Network error submitting credential verification.", "error");
    } finally {
      setIsSubmittingVerification(false);
    }
  };

  // Filter queues
  const filteredTechQueue = data.technical_queue.filter((item) => {
    if (statusFilter !== "all" && item.status !== statusFilter) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.candidate.name.toLowerCase().includes(q) ||
      item.candidate.email.toLowerCase().includes(q) ||
      item.template.title.toLowerCase().includes(q) ||
      item.requisition.title.toLowerCase().includes(q)
    );
  });

  const filteredCredQueue = data.credential_queue.filter((item) => {
    if (statusFilter !== "all" && item.status !== statusFilter) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.candidate.name.toLowerCase().includes(q) ||
      item.name.toLowerCase().includes(q) ||
      item.license_number.toLowerCase().includes(q) ||
      item.jurisdiction.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 sm:space-y-8 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-2.5 rounded-2xl border px-4 py-3 shadow-xl backdrop-blur-md text-xs font-semibold animate-in slide-in-from-top-4 duration-200 ${
            toastMessage.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-900"
              : "border-red-200 bg-red-50 text-red-900"
          }`}
        >
          {toastMessage.type === "success" ? (
            <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-electric/30 bg-gradient-to-r from-ink via-[#0d1f3d] to-ink p-5 sm:p-7 text-white shadow-xl">
        <div className="relative z-10 flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-electric/40 bg-electric/20 px-3 py-0.5 text-xs font-mono text-electric-bright">
              <span className="h-2 w-2 rounded-full bg-signal animate-pulse" />
              <span>PEPOLTEK VALIDATOR &amp; CREDENTIAL COCKPIT</span>
            </div>
            <h1 className="mt-2.5 font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
              Assessment Evaluation &amp; Licensure Desk
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-gray-300 max-w-2xl leading-relaxed">
              Assessor authority for technical take-home grading, code architecture scorecards, and healthcare primary source licensure verification.
            </p>
          </div>

          {/* Profile Badge Card */}
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-4 min-w-[280px]">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-electric text-white font-display font-bold text-base shadow-inner">
                {data.profile.full_name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="font-display text-sm font-bold text-white flex items-center gap-1.5">
                  <span>{data.profile.full_name}</span>
                  <ShieldCheck className="h-4 w-4 text-signal" />
                </div>
                <div className="text-[11px] font-mono text-gray-300">
                  {data.profile.email}
                </div>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-white/10 grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-gray-400 block text-[10px]">Clearance Level</span>
                <span className="font-semibold text-electric-bright">{data.profile.clearance_display}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px]">Domain Focus</span>
                <span className="font-semibold text-white truncate block">{data.profile.specialization}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Telemetry Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="rounded-2xl border border-[#bcd6fa] bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-ink-soft">
            <span className="text-[11px] font-semibold">Pending Tech</span>
            <Clock className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-2 font-display text-2xl font-black text-ink">
            {data.telemetry.pending_evaluations}
          </div>
          <div className="mt-1 text-[10px] text-ink-soft font-mono">Submissions awaiting score</div>
        </div>

        <div className="rounded-2xl border border-[#bcd6fa] bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-ink-soft">
            <span className="text-[11px] font-semibold">Completed Tech</span>
            <CheckCircle className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-2 font-display text-2xl font-black text-ink">
            {data.telemetry.completed_evaluations}
          </div>
          <div className="mt-1 text-[10px] text-ink-soft font-mono">Graded evaluations</div>
        </div>

        <div className="rounded-2xl border border-[#bcd6fa] bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-ink-soft">
            <span className="text-[11px] font-semibold">Pending Licensures</span>
            <AlertCircle className="h-4 w-4 text-blue-500" />
          </div>
          <div className="mt-2 font-display text-2xl font-black text-ink">
            {data.telemetry.pending_credentials}
          </div>
          <div className="mt-1 text-[10px] text-ink-soft font-mono">Unverified clinical certs</div>
        </div>

        <div className="rounded-2xl border border-[#bcd6fa] bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-ink-soft">
            <span className="text-[11px] font-semibold">Verified Licenses</span>
            <UserCheck className="h-4 w-4 text-signal" />
          </div>
          <div className="mt-2 font-display text-2xl font-black text-ink">
            {data.telemetry.verified_credentials}
          </div>
          <div className="mt-1 text-[10px] text-ink-soft font-mono">Primary source audits</div>
        </div>

        <div className="rounded-2xl border border-[#bcd6fa] bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-ink-soft">
            <span className="text-[11px] font-semibold">Average Score</span>
            <Award className="h-4 w-4 text-purple-500" />
          </div>
          <div className="mt-2 font-display text-2xl font-black text-ink">
            {data.telemetry.average_score ? `${data.telemetry.average_score}/100` : "88.0/100"}
          </div>
          <div className="mt-1 text-[10px] text-ink-soft font-mono">Technical benchmark</div>
        </div>

        <div className="rounded-2xl border border-[#bcd6fa] bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-ink-soft">
            <span className="text-[11px] font-semibold">Turnaround Speed</span>
            <Zap className="h-4 w-4 text-electric" />
          </div>
          <div className="mt-2 font-display text-2xl font-black text-ink">
            {data.profile.average_scoring_turnaround_hours}h
          </div>
          <div className="mt-1 text-[10px] text-ink-soft font-mono">Average evaluation SLA</div>
        </div>
      </div>

      {/* Navigation Tabs and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#bcd6fa]/50 pb-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setActiveTab("technical");
              setStatusFilter("all");
            }}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 font-display text-xs font-bold transition-all cursor-pointer ${
              activeTab === "technical"
                ? "bg-ink text-white shadow-xs"
                : "bg-white border border-[#bcd6fa] text-ink-soft hover:bg-canvas"
            }`}
          >
            <span>Technical Assessment Queue</span>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-mono font-bold ${
                activeTab === "technical" ? "bg-white/20 text-white" : "bg-canvas text-mist"
              }`}
            >
              {data.technical_queue.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("credentials");
              setStatusFilter("all");
            }}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 font-display text-xs font-bold transition-all cursor-pointer ${
              activeTab === "credentials"
                ? "bg-ink text-white shadow-xs"
                : "bg-white border border-[#bcd6fa] text-ink-soft hover:bg-canvas"
            }`}
          >
            <span>Healthcare Licensure Verification</span>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-mono font-bold ${
                activeTab === "credentials" ? "bg-white/20 text-white" : "bg-canvas text-mist"
              }`}
            >
              {data.credential_queue.length}
            </span>
          </button>
        </div>

        {/* Search bar */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-mist" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search candidate, role, or license..."
              className="w-56 sm:w-64 rounded-xl border border-[#bcd6fa] bg-white pl-8 pr-3 py-1.5 text-xs text-ink placeholder:text-mist focus:border-electric focus:outline-hidden shadow-2xs"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-[#bcd6fa] bg-white px-3 py-1.5 text-xs font-semibold text-ink focus:border-electric focus:outline-hidden shadow-2xs cursor-pointer"
          >
            <option value="all">All Statuses</option>
            {activeTab === "technical" ? (
              <>
                <option value="submitted">Submitted for Review</option>
                <option value="in_progress">In Progress</option>
                <option value="passed">Passed</option>
                <option value="failed">Failed</option>
              </>
            ) : (
              <>
                <option value="unverified">Unverified</option>
                <option value="verified">Verified</option>
                <option value="rejected">Rejected</option>
              </>
            )}
          </select>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === "technical" && (
        <div className="rounded-2xl border border-[#bcd6fa] bg-white p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display text-base font-bold text-ink">Assigned Technical Take-Homes &amp; Code Submissions</h2>
              <p className="text-xs text-ink-soft">Grade architecture, code cleanliness, and observability against explicit benchmark criteria</p>
            </div>
            <span className="text-xs font-mono text-ink-soft font-semibold">
              Showing {filteredTechQueue.length} of {data.technical_queue.length} assignments
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#bcd6fa] text-ink-soft font-semibold">
                  <th className="pb-3">Candidate</th>
                  <th className="pb-3">Target Requisition</th>
                  <th className="pb-3">Assessment Template</th>
                  <th className="pb-3">Pass Threshold</th>
                  <th className="pb-3">Final Score</th>
                  <th className="pb-3">Readiness Tier</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#bcd6fa]/50">
                {filteredTechQueue.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-ink-soft">
                      <FileText className="mx-auto h-8 w-8 text-mist mb-2" />
                      <div className="font-display text-sm font-bold text-ink">No Technical Assessments In This Filter</div>
                      <p className="text-xs text-mist mt-1">Assignments dispatched to your validator ID will appear here automatically.</p>
                    </td>
                  </tr>
                ) : (
                  filteredTechQueue.map((item) => (
                    <tr key={item.id} className="hover:bg-canvas/50 transition-colors">
                      <td className="py-3.5">
                        <div className="font-semibold text-ink">{item.candidate.name}</div>
                        <div className="text-[11px] text-ink-soft font-mono">{item.candidate.email}</div>
                      </td>
                      <td className="py-3.5">
                        <div className="font-medium text-ink max-w-xs truncate">{item.requisition.title}</div>
                        <div className="text-[11px] text-ink-soft">{item.requisition.sector} - {item.requisition.target_level || "Senior"}</div>
                      </td>
                      <td className="py-3.5">
                        <div className="font-medium text-ink max-w-xs truncate">{item.template.title}</div>
                        <div className="text-[11px] text-ink-soft capitalize">{item.template.category}</div>
                      </td>
                      <td className="py-3.5 font-mono text-ink">
                        {item.pass_threshold}%
                      </td>
                      <td className="py-3.5 font-mono font-bold">
                        {item.final_score !== null ? (
                          <span className={item.final_score >= item.pass_threshold ? "text-emerald-700" : "text-red-700"}>
                            {item.final_score}/100
                          </span>
                        ) : (
                          <span className="text-mist font-normal">Pending</span>
                        )}
                      </td>
                      <td className="py-3.5">
                        <span
                          className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-mono font-bold ${
                            item.candidate.readiness_tier === "elite"
                              ? "bg-purple-100 text-purple-800 border border-purple-200"
                              : item.candidate.readiness_tier === "ready"
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                              : "bg-gray-100 text-gray-700 border border-gray-200"
                          }`}
                        >
                          {item.candidate.readiness_tier.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3.5">
                        <span
                          className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                            item.status === "passed"
                              ? "bg-emerald-100 text-emerald-800"
                              : item.status === "failed"
                              ? "bg-red-100 text-red-800"
                              : item.status === "submitted"
                              ? "bg-amber-100 text-amber-800 animate-pulse"
                              : "bg-blue-50 text-blue-700"
                          }`}
                        >
                          {item.status_display}
                        </span>
                      </td>
                      <td className="py-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => handleOpenTechDrawer(item)}
                          className="rounded-xl bg-ink px-3.5 py-1.5 font-display text-xs font-semibold text-white hover:bg-electric transition-colors shadow-2xs cursor-pointer"
                        >
                          {item.status === "passed" || item.status === "failed" ? "Inspect & Revise" : "Evaluate & Grade"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "credentials" && (
        <div className="rounded-2xl border border-[#bcd6fa] bg-white p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display text-base font-bold text-ink">Clinical Licensures &amp; Certifications Audit Queue</h2>
              <p className="text-xs text-ink-soft">Direct validation against primary source nursing compacts and state medical board registries</p>
            </div>
            <span className="text-xs font-mono text-ink-soft font-semibold">
              Showing {filteredCredQueue.length} of {data.credential_queue.length} credentials
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#bcd6fa] text-ink-soft font-semibold">
                  <th className="pb-3">Candidate Clinician</th>
                  <th className="pb-3">Credential Title</th>
                  <th className="pb-3">Kind</th>
                  <th className="pb-3">License Number</th>
                  <th className="pb-3">Jurisdiction</th>
                  <th className="pb-3">Expires On</th>
                  <th className="pb-3">Verification State</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#bcd6fa]/50">
                {filteredCredQueue.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-ink-soft">
                      <ShieldCheck className="mx-auto h-8 w-8 text-mist mb-2" />
                      <div className="font-display text-sm font-bold text-ink">No Clinical Credentials In This Filter</div>
                      <p className="text-xs text-mist mt-1">All clinical candidates are current with verification audits.</p>
                    </td>
                  </tr>
                ) : (
                  filteredCredQueue.map((item) => (
                    <tr key={item.id} className="hover:bg-canvas/50 transition-colors">
                      <td className="py-3.5">
                        <div className="font-semibold text-ink">{item.candidate.name}</div>
                        <div className="text-[11px] text-ink-soft font-mono">{item.candidate.email}</div>
                      </td>
                      <td className="py-3.5 font-medium text-ink max-w-xs truncate">
                        {item.name}
                      </td>
                      <td className="py-3.5">
                        <span className="inline-block rounded-full bg-blue-50 text-blue-700 px-2 py-0.5 text-[10px] font-semibold border border-blue-200">
                          {item.kind_display}
                        </span>
                      </td>
                      <td className="py-3.5 font-mono text-ink font-semibold">
                        {item.license_number || "REG-PRIMARY-PENDING"}
                      </td>
                      <td className="py-3.5 text-ink-soft">
                        {item.jurisdiction || "State Board Compact"}
                      </td>
                      <td className="py-3.5 font-mono text-ink">
                        {item.expires_on || "Permanent"}
                      </td>
                      <td className="py-3.5">
                        <span
                          className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                            item.status === "verified"
                              ? "bg-emerald-100 text-emerald-800"
                              : item.status === "rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {item.status_display}
                        </span>
                      </td>
                      <td className="py-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => handleOpenCredDrawer(item)}
                          className="rounded-xl bg-ink px-3.5 py-1.5 font-display text-xs font-semibold text-white hover:bg-electric transition-colors shadow-2xs cursor-pointer"
                        >
                          {item.status === "verified" ? "Re-Audit" : "Audit & Verify"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Slide-Over Right-Side Sheet Drawer: Technical Take-Home Evaluation */}
      {selectedTechItem && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in-0 duration-200">
          <div className="relative h-full w-full max-w-2xl bg-white shadow-2xl flex flex-col border-l border-[#bcd6fa] animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-[#bcd6fa] px-6 py-4 bg-canvas">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-electric/10 px-2.5 py-0.5 text-[10px] font-bold text-electric">
                  <span>RUBRIC SCORING WORKBENCH</span>
                </div>
                <h3 className="font-display text-lg font-bold text-ink mt-1">
                  Grade Assessment Submission
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTechItem(null)}
                className="rounded-xl border border-[#bcd6fa] p-2 text-ink-soft hover:bg-white hover:text-ink transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Drawer Scrollable Body */}
            <form onSubmit={handleSubmitGrade} className="flex-1 overflow-y-auto p-6 space-y-6 thin-scrollbar">
              {/* Candidate Info Card */}
              <div className="rounded-2xl border border-[#bcd6fa] bg-canvas p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-display text-sm font-bold text-ink">
                    {selectedTechItem.candidate.name}
                  </div>
                  <span className="rounded-full bg-ink px-2.5 py-0.5 text-[10px] font-bold text-white">
                    {selectedTechItem.candidate.level}
                  </span>
                </div>
                <div className="text-xs text-ink-soft font-mono">
                  {selectedTechItem.candidate.email}
                </div>
                <div className="text-xs text-ink-soft">
                  Target Requisition: <span className="font-semibold text-ink">{selectedTechItem.requisition.title}</span>
                </div>

                {/* Candidate Links */}
                <div className="pt-2 flex flex-wrap gap-2 text-xs">
                  {selectedTechItem.candidate.github_url && (
                    <a
                      href={selectedTechItem.candidate.github_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 rounded-lg border border-[#bcd6fa] bg-white px-2.5 py-1 text-ink hover:border-electric transition-colors"
                    >
                      <span>GitHub Portfolio</span>
                      <ExternalLink className="h-3 w-3 text-mist" />
                    </a>
                  )}
                  {selectedTechItem.candidate.portfolio_url && (
                    <a
                      href={selectedTechItem.candidate.portfolio_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 rounded-lg border border-[#bcd6fa] bg-white px-2.5 py-1 text-ink hover:border-electric transition-colors"
                    >
                      <span>Live Demo Artifact</span>
                      <ExternalLink className="h-3 w-3 text-mist" />
                    </a>
                  )}
                </div>
              </div>

              {/* Assessment Instructions */}
              <div className="rounded-2xl border border-electric/30 bg-electric/5 p-4 space-y-2">
                <div className="font-display text-xs font-bold text-electric flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5" />
                  <span>{selectedTechItem.template.title}</span>
                </div>
                <p className="text-xs text-ink-soft leading-relaxed">
                  {selectedTechItem.template.instructions || selectedTechItem.template.description || "Review candidate code artifacts for clean architecture, resilient error recovery, typed contracts, and idempotency guarantees."}
                </p>
                {selectedTechItem.recruiter_notes && (
                  <div className="text-xs text-ink-soft pt-1 border-t border-electric/20">
                    <span className="font-semibold text-ink">Recruiter Intake Note:</span> {selectedTechItem.recruiter_notes}
                  </div>
                )}
              </div>

              {/* Rubric Criteria Breakdown */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-display text-xs font-bold text-ink uppercase tracking-wider">
                    Rubric Scoring Breakdown
                  </label>
                  <span className="font-mono text-xs font-bold text-ink">
                    Cumulative: <span className={evalScore >= selectedTechItem.pass_threshold ? "text-emerald-700" : "text-red-700"}>{evalScore} / 100</span>
                  </span>
                </div>

                {criterionScores.map((crit, idx) => (
                  <div key={idx} className="rounded-xl border border-[#bcd6fa] bg-white p-3.5 space-y-2 shadow-2xs">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-ink">{crit.criterion}</span>
                      <span className="font-mono text-ink-soft">
                        Max: {crit.max_points} pts
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="0"
                        max={crit.max_points}
                        value={crit.awarded_points}
                        onChange={(e) => handleCriterionChange(idx, parseInt(e.target.value) || 0)}
                        className="w-full accent-electric cursor-pointer"
                      />
                      <input
                        type="number"
                        min="0"
                        max={crit.max_points}
                        value={crit.awarded_points}
                        onChange={(e) => handleCriterionChange(idx, parseInt(e.target.value) || 0)}
                        className="w-16 rounded-lg border border-[#bcd6fa] bg-canvas px-2 py-1 text-center font-mono text-xs font-bold text-ink"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Decision & Readiness Tier */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-ink mb-1.5">Official Verdict</label>
                  <select
                    value={evalVerdict}
                    onChange={(e) => setEvalVerdict(e.target.value as "pass" | "fail")}
                    className="w-full rounded-xl border border-[#bcd6fa] bg-canvas px-3 py-2 text-xs font-semibold text-ink focus:border-electric focus:bg-white outline-hidden cursor-pointer"
                  >
                    <option value="pass">PASS (Meets or Exceeds Threshold)</option>
                    <option value="fail">FAIL (Does Not Meet Threshold)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink mb-1.5">Candidate Readiness Tier</label>
                  <select
                    value={evalReadinessTier}
                    onChange={(e) => setEvalReadinessTier(e.target.value as any)}
                    className="w-full rounded-xl border border-[#bcd6fa] bg-canvas px-3 py-2 text-xs font-semibold text-ink focus:border-electric focus:bg-white outline-hidden cursor-pointer"
                  >
                    <option value="elite">Elite (Tier L4: Architect Ready)</option>
                    <option value="ready">Ready (Tier L2/L3: Fully Vetted)</option>
                    <option value="emerging">Emerging (Tier L1: Needs Upskilling)</option>
                  </select>
                </div>
              </div>

              {/* Qualitative Assessor Feedback */}
              <div>
                <label className="block text-xs font-semibold text-ink mb-1.5">Qualitative Assessor Evaluation &amp; Feedback</label>
                <textarea
                  required
                  rows={4}
                  value={evalFeedback}
                  onChange={(e) => setEvalFeedback(e.target.value)}
                  placeholder="Detail architectural design choices, code conventions, edge case coverage, and deployment readiness recommendations..."
                  className="w-full rounded-xl border border-[#bcd6fa] bg-canvas p-3 text-xs text-ink placeholder:text-mist focus:border-electric focus:bg-white outline-hidden"
                />
              </div>

              {/* Drawer Footer Actions */}
              <div className="pt-4 border-t border-[#bcd6fa] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedTechItem(null)}
                  className="rounded-xl border border-[#bcd6fa] bg-white px-4 py-2 font-display text-xs font-semibold text-ink-soft hover:bg-canvas transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingGrade}
                  className="rounded-xl bg-ink px-5 py-2 font-display text-xs font-bold text-white hover:bg-electric transition-colors shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingGrade ? "Submitting Grade..." : "Authorize Score & Readiness"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Slide-Over Right-Side Sheet Drawer: Clinical Licensure Verification */}
      {selectedCredItem && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in-0 duration-200">
          <div className="relative h-full w-full max-w-xl bg-white shadow-2xl flex flex-col border-l border-[#bcd6fa] animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-[#bcd6fa] px-6 py-4 bg-canvas">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 text-blue-800 px-2.5 py-0.5 text-[10px] font-bold">
                  <span>CLINICAL LICENSURE AUDIT</span>
                </div>
                <h3 className="font-display text-lg font-bold text-ink mt-1">
                  Primary Source Verification
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCredItem(null)}
                className="rounded-xl border border-[#bcd6fa] p-2 text-ink-soft hover:bg-white hover:text-ink transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Drawer Body */}
            <form onSubmit={handleSubmitCredentialVerification} className="flex-1 overflow-y-auto p-6 space-y-6 thin-scrollbar">
              <div className="rounded-2xl border border-[#bcd6fa] bg-canvas p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-display text-sm font-bold text-ink">
                    {selectedCredItem.candidate.name}
                  </div>
                  <span className="rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-bold">
                    {selectedCredItem.candidate.sector}
                  </span>
                </div>
                <div className="text-xs text-ink-soft font-mono">
                  {selectedCredItem.candidate.email}
                </div>
              </div>

              {/* License Details */}
              <div className="rounded-2xl border border-[#bcd6fa] bg-white p-4 space-y-3">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-mist block">License Title</span>
                  <span className="font-display text-sm font-bold text-ink">{selectedCredItem.name}</span>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#bcd6fa]/50 text-xs">
                  <div>
                    <span className="text-mist block text-[10px]">License Number</span>
                    <span className="font-mono font-bold text-ink">{selectedCredItem.license_number}</span>
                  </div>
                  <div>
                    <span className="text-mist block text-[10px]">Jurisdiction</span>
                    <span className="font-semibold text-ink">{selectedCredItem.jurisdiction}</span>
                  </div>
                  <div>
                    <span className="text-mist block text-[10px]">Issued On</span>
                    <span className="font-mono text-ink">{selectedCredItem.issued_on || "Registry Recorded"}</span>
                  </div>
                  <div>
                    <span className="text-mist block text-[10px]">Expires On</span>
                    <span className="font-mono font-bold text-ink">{selectedCredItem.expires_on || "Permanent Compact"}</span>
                  </div>
                </div>
              </div>

              {/* Verification Method */}
              <div>
                <label className="block text-xs font-semibold text-ink mb-1.5">Primary Source Verification Method</label>
                <select
                  value={credMethod}
                  onChange={(e) => setCredMethod(e.target.value)}
                  className="w-full rounded-xl border border-[#bcd6fa] bg-canvas px-3 py-2 text-xs font-semibold text-ink focus:border-electric focus:bg-white outline-hidden cursor-pointer"
                >
                  <option value="NURSYS Primary Source Database Lookup">NURSYS Primary Source Database Lookup</option>
                  <option value="State Medical Board Licensure Verification API">State Medical Board Licensure Verification API</option>
                  <option value="AHA Direct eCard Registry Lookup">AHA Direct eCard Registry Lookup</option>
                  <option value="National Practitioner Data Bank (NPDB) Query">National Practitioner Data Bank (NPDB) Query</option>
                  <option value="Manual State Board Compact Registry Check">Manual State Board Compact Registry Check</option>
                </select>
              </div>

              {/* Verification Decision */}
              <div>
                <label className="block text-xs font-semibold text-ink mb-1.5">Verification Audit Decision</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setCredStatus("verified")}
                    className={`rounded-xl border p-3 text-center text-xs font-bold transition-all cursor-pointer ${
                      credStatus === "verified"
                        ? "border-emerald-600 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500/20"
                        : "border-[#bcd6fa] bg-canvas text-ink-soft hover:bg-white"
                    }`}
                  >
                    <CheckCircle className="mx-auto h-4 w-4 mb-1 text-emerald-600" />
                    Verify &amp; Approve
                  </button>

                  <button
                    type="button"
                    onClick={() => setCredStatus("rejected")}
                    className={`rounded-xl border p-3 text-center text-xs font-bold transition-all cursor-pointer ${
                      credStatus === "rejected"
                        ? "border-red-600 bg-red-50 text-red-800 ring-2 ring-red-500/20"
                        : "border-[#bcd6fa] bg-canvas text-ink-soft hover:bg-white"
                    }`}
                  >
                    <AlertCircle className="mx-auto h-4 w-4 mb-1 text-red-600" />
                    Reject / Discrepancy
                  </button>
                </div>
              </div>

              {/* Rejection Reason if Rejected */}
              {credStatus === "rejected" && (
                <div>
                  <label className="block text-xs font-semibold text-red-900 mb-1.5">Rejection Discrepancy Reason</label>
                  <textarea
                    required
                    rows={3}
                    value={credRejectionReason}
                    onChange={(e) => setCredRejectionReason(e.target.value)}
                    placeholder="Provide exact registry error or discrepancy found on the state board lookup..."
                    className="w-full rounded-xl border border-red-300 bg-red-50/50 p-3 text-xs text-ink focus:border-red-500 outline-hidden"
                  />
                </div>
              )}

              {/* Drawer Footer Actions */}
              <div className="pt-4 border-t border-[#bcd6fa] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedCredItem(null)}
                  className="rounded-xl border border-[#bcd6fa] bg-white px-4 py-2 font-display text-xs font-semibold text-ink-soft hover:bg-canvas transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingVerification}
                  className="rounded-xl bg-ink px-5 py-2 font-display text-xs font-bold text-white hover:bg-electric transition-colors shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingVerification ? "Recording Audit..." : "Record Verification Audit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
