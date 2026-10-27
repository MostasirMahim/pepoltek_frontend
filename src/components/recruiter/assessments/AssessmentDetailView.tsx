"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  archiveAssessmentTemplate,
  MarksDistributionItem,
} from "@/actions/recruiter.actions";
import { AssessmentCategoryOption } from "@/types/taxonomy.types";
import {
  TemplateSheet,
  AssessmentTemplate,
  ApplicationVetting,
  getCategoryLabel,
  getCategoryBadge,
  SECTOR_LABELS,
  DEFAULT_CATEGORIES,
} from "./AssessmentsView";
import {
  ArrowLeft,
  ShieldCheck,
  Pencil,
  Archive,
  UserCheck,
  Calendar,
  Award,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Users,
  Check,
  Zap,
} from "lucide-react";

interface AssessmentDetailViewProps {
  template: AssessmentTemplate & {
    marks_distribution?: MarksDistributionItem[];
    prerequisites?: string[];
    allowed_validator_roles?: string[];
    vettings?: ApplicationVetting[];
    instructions?: string;
  };
  vettings: ApplicationVetting[];
  categories?: AssessmentCategoryOption[];
  staffUsers?: Array<{
    id: string;
    fullName?: string;
    full_name?: string;
    email: string;
    role?: string;
  }>;
  basePath?: string;
}

const STATUS_CONFIG: Record<
  string,
  { label: string; badgeClass: string; dotClass: string }
> = {
  pending: {
    label: "Pending Start",
    badgeClass: "bg-sky-50 text-sky-800 border-sky-200",
    dotClass: "bg-sky-500",
  },
  in_progress: {
    label: "In Progress",
    badgeClass: "bg-amber-50 text-amber-800 border-amber-200",
    dotClass: "bg-amber-500",
  },
  submitted: {
    label: "Submitted",
    badgeClass: "bg-blue-50 text-blue-800 border-blue-200",
    dotClass: "bg-blue-500",
  },
  scored: {
    label: "Scored",
    badgeClass: "bg-cyan-50 text-cyan-800 border-cyan-200",
    dotClass: "bg-cyan-500",
  },
  passed: {
    label: "Passed",
    badgeClass: "bg-emerald-50 text-emerald-800 border-emerald-200",
    dotClass: "bg-emerald-500",
  },
  failed: {
    label: "Failed",
    badgeClass: "bg-rose-50 text-rose-800 border-rose-200",
    dotClass: "bg-rose-500",
  },
  expired: {
    label: "Expired",
    badgeClass: "bg-slate-100 text-slate-700 border-slate-300",
    dotClass: "bg-slate-400",
  },
};

export default function AssessmentDetailView({
  template,
  vettings,
  categories = [],
  staffUsers = [],
  basePath = "/recruiter/assessments",
}: AssessmentDetailViewProps) {
  const router = useRouter();
  const effectiveCategories =
    categories && categories.length > 0 ? categories : DEFAULT_CATEGORIES;

  const [sheetOpen, setSheetOpen] = useState(false);
  const [archiving, setArchiving] = useState(false);
  const [expandedVettingId, setExpandedVettingId] = useState<string | null>(null);

  const handleArchive = async () => {
    if (!confirm("Archive this assessment template? It will be deactivated from future vetting assignments.")) {
      return;
    }
    setArchiving(true);
    await archiveAssessmentTemplate(template.id);
    setArchiving(false);
    router.refresh();
  };

  // Metrics
  const totalPoints =
    template.marks_distribution?.reduce((s, c) => s + (c.max_points || 0), 0) ||
    template.total_marks;
  const criteriaList = template.marks_distribution || [];
  const assignedVettings = vettings;
  const passedVettings = assignedVettings.filter((v) => v.status === "passed");
  const inProgressVettings = assignedVettings.filter(
    (v) => !["passed", "failed", "expired"].includes(v.status)
  );
  const pendingScoreVettings = assignedVettings.filter((v) => v.status === "submitted");

  const badgeStyle = getCategoryBadge(template.category);

  // Eligible validators (based on allowed_validator_roles or assigned vettings)
  const allowedRoles = template.allowed_validator_roles || ["TECH_VALIDATOR", "SUPER_ADMIN", "RECRUITER"];
  const eligibleStaff = staffUsers.filter((u) => {
    const role = (u.role || "").toUpperCase();
    return (
      allowedRoles.some((ar) => role.includes(ar.replace("_", ""))) ||
      assignedVettings.some((v) => v.primary_validator?.id === u.id)
    );
  });

  return (
    <div className="space-y-6 pb-20 text-ink font-enterprise">
      {/* Navigation Breadcrumb Bar */}
      <div className="flex items-center justify-between border-b border-[#bcd6fa]/40 pb-3">
        <Link
          href={basePath}
          className="inline-flex items-center gap-1.5 text-xs font-enterprise font-semibold text-ink-soft hover:text-electric transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Assessment Library</span>
        </Link>
        <span className="text-[11px] text-mist font-enterprise">
          Assessment Template ID: <strong className="text-ink">{template.id.slice(0, 18)}...</strong>
        </span>
      </div>

      {/* Header Cockpit Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-[#bcd6fa] bg-white p-5 shadow-2xs">
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`rounded-full px-2.5 py-0.5 text-[11px] font-enterprise font-bold border ${badgeStyle}`}
            >
              {getCategoryLabel(template.category, effectiveCategories)}
            </span>
            <span className="rounded-full bg-canvas px-2.5 py-0.5 text-[11px] font-enterprise font-semibold text-ink-soft border border-[#bcd6fa]/60">
              {SECTOR_LABELS[template.sector] || template.sector}
            </span>
            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-enterprise font-bold text-slate-600 border border-slate-200">
              Version {template.version}
            </span>
            {!template.is_active && (
              <span className="rounded-md bg-rose-50 px-2 py-0.5 text-[10px] font-enterprise font-bold text-rose-600 border border-rose-200">
                Archived
              </span>
            )}
          </div>

          <h1 className="font-display text-2xl font-bold text-ink leading-tight">
            {template.title}
          </h1>

          <div className="flex items-center gap-4 text-xs text-mist font-enterprise pt-0.5">
            <span>Author: <strong className="text-ink">{template.created_by_name || "Staff Recruiter"}</strong></span>
            <span>Created: <strong className="text-ink">{new Date(template.created_at).toLocaleDateString()}</strong></span>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-electric bg-electric/10 px-4 py-2 text-xs font-enterprise font-bold text-electric hover:bg-electric hover:text-white transition-all cursor-pointer shadow-2xs"
          >
            <Pencil size={14} />
            <span>Edit Template</span>
          </button>
          <button
            type="button"
            onClick={handleArchive}
            disabled={archiving}
            className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2 text-xs font-enterprise font-semibold text-rose-600 hover:bg-rose-100 disabled:opacity-40 transition-colors cursor-pointer shadow-2xs"
          >
            <Archive size={14} />
            <span>{archiving ? "..." : "Archive"}</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Summary Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        <div className="rounded-2xl border border-[#bcd6fa] bg-white p-4 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-enterprise text-mist font-semibold uppercase tracking-wider">
              Total Marks
            </span>
            <Award size={16} className="text-electric" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="font-display text-2xl font-bold text-ink">{totalPoints}</span>
            <span className="text-[11px] font-enterprise font-semibold text-electric">Points Rubric</span>
          </div>
        </div>

        <div className="rounded-2xl border border-[#bcd6fa] bg-white p-4 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-enterprise text-mist font-semibold uppercase tracking-wider">
              Rubric Criteria
            </span>
            <FileText size={16} className="text-ink-soft" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="font-display text-2xl font-bold text-ink">{criteriaList.length}</span>
            <span className="text-[11px] font-enterprise font-semibold text-ink-soft">Evaluation Rules</span>
          </div>
        </div>

        <div className="rounded-2xl border border-[#bcd6fa] bg-white p-4 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-enterprise text-mist font-semibold uppercase tracking-wider">
              Assigned Vettings
            </span>
            <Zap size={16} className="text-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="font-display text-2xl font-bold text-ink">{assignedVettings.length}</span>
            <span className="text-[11px] font-enterprise font-semibold text-amber-600">
              {inProgressVettings.length} Active
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-[#bcd6fa] bg-white p-4 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-enterprise text-mist font-semibold uppercase tracking-wider">
              Qualified Pool
            </span>
            <CheckCircle2 size={16} className="text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="font-display text-2xl font-bold text-ink">{passedVettings.length}</span>
            <span className="text-[11px] font-enterprise font-semibold text-emerald-600">Passed Candidates</span>
          </div>
        </div>
      </div>

      {/* Grid: Left Column (Rubric & Criteria) + Right Column (Validators & Overview) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Scoring Rubric & Instructions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card: Scoring Criteria Rubric Table */}
          <div className="rounded-2xl border border-[#bcd6fa] bg-white p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#bcd6fa]/40 pb-3">
              <div>
                <h3 className="font-display text-base font-bold text-ink">
                  Scoring Criteria Rubric
                </h3>
                <p className="text-xs text-ink-soft mt-0.5">
                  Standardized criteria and point weightings used by validators during candidate review.
                </p>
              </div>
              <span className="rounded-full bg-electric/10 text-electric border border-electric/30 px-3 py-0.5 text-xs font-enterprise font-bold">
                {totalPoints} / 100 Points Total
              </span>
            </div>

            <div className="rounded-xl border border-[#bcd6fa]/60 overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-slate-50/90 text-[10.5px] uppercase font-bold text-slate-500 border-b border-[#bcd6fa]/60">
                  <tr>
                    <th className="px-4 py-2.5 font-semibold text-slate-600">Criterion</th>
                    <th className="px-4 py-2.5 font-semibold text-slate-600">Evaluation Instructions &amp; Expectation</th>
                    <th className="px-4 py-2.5 font-semibold text-slate-600 text-right whitespace-nowrap">Max Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#bcd6fa]/30">
                  {criteriaList.map((crit, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-4 py-3 align-top font-display font-bold text-ink text-xs min-w-[180px]">
                        {crit.criterion}
                      </td>
                      <td className="px-4 py-3 align-top text-xs text-ink-soft leading-relaxed">
                        {crit.description || "Evaluation per standard architectural specifications."}
                      </td>
                      <td className="px-4 py-3 align-top text-right font-display font-bold text-electric text-xs whitespace-nowrap">
                        {crit.max_points} pts
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Card: Candidate Instructions & Objectives */}
          <div className="rounded-2xl border border-[#bcd6fa] bg-white p-5 shadow-2xs space-y-4">
            <h3 className="font-display text-base font-bold text-ink border-b border-[#bcd6fa]/40 pb-3">
              Candidate Instructions &amp; Briefing
            </h3>

            <div className="space-y-3 text-xs leading-relaxed">
              <div>
                <span className="font-enterprise font-bold text-ink block mb-1">
                  Candidate-Facing Submission Brief:
                </span>
                <div className="rounded-xl border border-[#bcd6fa]/60 bg-canvas/30 p-3.5 text-ink text-xs font-enterprise leading-relaxed whitespace-pre-line">
                  {template.instructions || "Candidate must implement the specifications in their repository and submit code links and architectural rationale for evaluation."}
                </div>
              </div>

              {template.description && (
                <div>
                  <span className="font-enterprise font-bold text-ink block mb-1">
                    Internal Objectives &amp; Scope:
                  </span>
                  <p className="text-ink-soft text-xs leading-relaxed">
                    {template.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Prerequisites & Authorized Validators */}
        <div className="space-y-6">
          {/* Card: Prerequisites */}
          <div className="rounded-2xl border border-[#bcd6fa] bg-white p-5 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 border-b border-[#bcd6fa]/40 pb-3">
              <CheckCircle2 size={16} className="text-emerald-600" />
              <h3 className="font-display text-base font-bold text-ink">
                Prerequisites &amp; Clearances
              </h3>
            </div>

            {template.prerequisites && template.prerequisites.length > 0 ? (
              <ul className="space-y-2 text-xs">
                {template.prerequisites.map((req, i) => (
                  <li key={i} className="flex items-start gap-2 text-ink-soft">
                    <Check size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                    <span className="leading-tight">{req}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-mist italic">
                No strict prerequisites configured. Open to all qualified candidates in this sector.
              </p>
            )}

            <div className="pt-3 border-t border-[#bcd6fa]/40 space-y-1.5">
              <span className="text-[11px] font-enterprise font-bold text-ink block uppercase tracking-wider">
                Authorized Validator Roles:
              </span>
              <div className="flex flex-wrap gap-1">
                {allowedRoles.map((role) => (
                  <span
                    key={role}
                    className="rounded-md bg-canvas px-2 py-0.5 text-[10.5px] font-enterprise font-semibold text-ink-soft border border-[#bcd6fa]/60"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Card: Authorized Staff Validators */}
          <div className="rounded-2xl border border-[#bcd6fa] bg-white p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-[#bcd6fa]/40 pb-3">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-electric" />
                <h3 className="font-display text-base font-bold text-ink">
                  Staff Validators
                </h3>
              </div>
              <span className="text-[11px] text-mist font-enterprise">
                {eligibleStaff.length} available
              </span>
            </div>

            <div className="space-y-2.5">
              {eligibleStaff.length === 0 ? (
                <div className="text-xs text-mist italic text-center py-2">
                  No specific staff validators assigned yet.
                </div>
              ) : (
                eligibleStaff.slice(0, 5).map((staff) => {
                  const name = staff.fullName || staff.full_name || staff.email;
                  const assignedCount = assignedVettings.filter(
                    (v) => v.primary_validator?.id === staff.id
                  ).length;

                  return (
                    <div
                      key={staff.id}
                      className="flex items-center justify-between rounded-xl border border-[#bcd6fa]/60 bg-canvas/20 p-2.5 text-xs"
                    >
                      <div className="min-w-0 pr-2">
                        <div className="font-display font-semibold text-ink truncate text-[12px]">
                          {name}
                        </div>
                        <div className="text-[10.5px] text-mist truncate">
                          {staff.email}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="rounded-md bg-white px-2 py-0.5 text-[10px] font-enterprise font-bold text-electric border border-electric/30">
                          {assignedCount} {assignedCount === 1 ? "vetting" : "vettings"}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Related Candidate Application Vettings & Submissions */}
      <div className="rounded-2xl border border-[#bcd6fa] bg-white p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#bcd6fa]/40 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-electric" />
              <h3 className="font-display text-base font-bold text-ink">
                Related Candidate Application Vettings
              </h3>
            </div>
            <p className="text-xs text-ink-soft mt-0.5">
              Candidates currently evaluated against this assessment template in the ATS pipeline.
            </p>
          </div>
          <span className="rounded-full bg-slate-100 text-slate-700 px-3 py-1 text-xs font-enterprise font-bold border border-slate-200">
            {assignedVettings.length} Assigned Candidates
          </span>
        </div>

        {/* Enterprise Vettings Table */}
        <div className="rounded-xl border border-[#bcd6fa]/70 overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-50/90 text-[10.5px] uppercase font-bold text-slate-500 border-b border-[#bcd6fa]/60 select-none">
              <tr>
                <th className="px-4 py-3 align-middle font-semibold text-slate-600 min-w-[200px]">Candidate &amp; Job Position</th>
                <th className="px-3.5 py-3 align-middle font-semibold text-slate-600 whitespace-nowrap">Status</th>
                <th className="px-3.5 py-3 align-middle font-semibold text-slate-600 whitespace-nowrap min-w-[140px]">Primary Validator</th>
                <th className="px-3.5 py-3 align-middle font-semibold text-slate-600 whitespace-nowrap">Timing &amp; Deadline</th>
                <th className="px-3.5 py-3 align-middle font-semibold text-slate-600 text-center whitespace-nowrap">Score / Verdict</th>
                <th className="px-4 py-3 align-middle font-semibold text-slate-600 text-right whitespace-nowrap">Submission</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#bcd6fa]/40">
              {assignedVettings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-ink-soft">
                    <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-canvas border border-[#bcd6fa]/50 text-mist mb-2">
                      <ShieldCheck size={18} />
                    </div>
                    <div className="font-display text-xs font-bold text-ink">
                      No Candidates Currently Assigned
                    </div>
                    <p className="text-[11px] text-mist mt-0.5 max-w-sm mx-auto font-enterprise">
                      Vettings are assigned when candidate applications move to the Technical Vetting stage in ATS.
                    </p>
                  </td>
                </tr>
              ) : (
                assignedVettings.map((vetting) => {
                  const cfg = STATUS_CONFIG[vetting.status] || {
                    label: vetting.status,
                    badgeClass: "bg-slate-100 text-slate-700 border-slate-300",
                    dotClass: "bg-slate-400",
                  };
                  const deadline = vetting.deadline ? new Date(vetting.deadline) : null;
                  const isExpanded = expandedVettingId === vetting.id;

                  return (
                    <React.Fragment key={vetting.id}>
                      <tr className="hover:bg-slate-50/70 transition-colors">
                        {/* Col 1: Candidate & Job */}
                        <td className="px-4 py-3 align-middle">
                          <div className="font-display font-bold text-[12.5px] text-ink">
                            {vetting.candidate_name || "Candidate Specialist"}
                          </div>
                          <div className="text-[11px] text-ink-soft truncate max-w-[240px]">
                            {vetting.job_title || vetting.template_title}
                          </div>
                        </td>

                        {/* Col 2: Status */}
                        <td className="px-3.5 py-3 align-middle">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10.5px] font-enterprise font-bold border ${cfg.badgeClass}`}
                          >
                            <span className={`h-1.5 w-1.5 rounded-full ${cfg.dotClass}`} />
                            <span>{cfg.label}</span>
                          </span>
                        </td>

                        {/* Col 3: Primary Validator */}
                        <td className="px-3.5 py-3 align-middle">
                          <div className="flex items-center gap-1.5 text-ink-soft font-enterprise">
                            <UserCheck size={13} className="text-mist shrink-0" />
                            <span className="font-semibold truncate max-w-[140px]">
                              {vetting.primary_validator?.full_name || "Unassigned"}
                            </span>
                          </div>
                        </td>

                        {/* Col 4: Timing & Deadline */}
                        <td className="px-3.5 py-3 align-middle">
                          <div className="flex items-center gap-1.5 text-[11px] font-enterprise">
                            <Calendar size={13} className={vetting.is_overdue ? "text-rose-600" : "text-mist"} />
                            <span className={vetting.is_overdue ? "text-rose-600 font-bold" : "text-ink-soft"}>
                              {deadline ? deadline.toLocaleDateString() : "No deadline set"}
                            </span>
                          </div>
                        </td>

                        {/* Col 5: Score / Verdict */}
                        <td className="px-3.5 py-3 align-middle text-center">
                          {vetting.final_score != null ? (
                            <div className="inline-flex flex-col items-center">
                              <span className="font-display text-sm font-bold text-electric">
                                {vetting.final_score} / 100
                              </span>
                              <span
                                className={`text-[9.5px] font-enterprise font-bold uppercase ${
                                  vetting.final_score >= vetting.pass_threshold
                                    ? "text-emerald-700"
                                    : "text-rose-600"
                                }`}
                              >
                                {vetting.final_score >= vetting.pass_threshold ? "Passed" : "Failed"}
                              </span>
                            </div>
                          ) : (
                            <span className="text-[11px] text-mist italic font-enterprise">
                              Pending Verdict
                            </span>
                          )}
                        </td>

                        {/* Col 6: Actions */}
                        <td className="px-4 py-3 align-middle text-right">
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedVettingId(isExpanded ? null : vetting.id)
                            }
                            className="inline-flex items-center gap-1 rounded-lg border border-[#bcd6fa] bg-white px-2.5 py-1 text-[11px] font-enterprise font-semibold text-ink-soft hover:bg-canvas hover:text-electric transition-colors cursor-pointer"
                          >
                            <span>{isExpanded ? "Hide" : "Details"}</span>
                            {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                          </button>
                        </td>
                      </tr>

                      {/* Expandable Vetting Submissions & Details Drawer */}
                      {isExpanded && (
                        <tr className="bg-canvas/30">
                          <td colSpan={6} className="p-4 space-y-3 border-t border-[#bcd6fa]/40">
                            <div className="rounded-xl border border-[#bcd6fa]/60 bg-white p-3.5 space-y-3">
                              <div className="flex items-center justify-between border-b border-[#bcd6fa]/30 pb-2">
                                <span className="font-enterprise text-xs font-bold text-ink">
                                  Vetting Evaluation Dossier &amp; Submission
                                </span>
                                <span className="text-[11px] font-enterprise text-mist">
                                  Application ID: {vetting.application_id}
                                </span>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                                <div>
                                  <span className="text-mist text-[10.5px] block">Passing Threshold:</span>
                                  <strong className="text-ink">{vetting.pass_threshold}% required</strong>
                                </div>
                                <div>
                                  <span className="text-mist text-[10.5px] block">Scheduled Start:</span>
                                  <strong className="text-ink">
                                    {vetting.scheduled_start
                                      ? new Date(vetting.scheduled_start).toLocaleDateString()
                                      : "Immediate"}
                                  </strong>
                                </div>
                                <div>
                                  <span className="text-mist text-[10.5px] block">Current Status:</span>
                                  <strong className="text-ink capitalize">{vetting.status.replace("_", " ")}</strong>
                                </div>
                              </div>

                              {vetting.status === "passed" && (
                                <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 flex items-start gap-2">
                                  <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-emerald-600" />
                                  <div>
                                    <strong>Candidate Passed Verification.</strong> Candidate achieved {vetting.final_score}/100, exceeding the {vetting.pass_threshold}% minimum threshold. Advanced for final client interview.
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-over Sheet for Edit */}
      <TemplateSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        editing={template}
        onSaved={() => router.refresh()}
        categories={categories}
      />
    </div>
  );
}
