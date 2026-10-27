"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RecruiterInterview } from "@/types/recruiter.types";
import {
  Calendar,
  Clock,
  Video,
  ExternalLink,
  Copy,
  Check,
  Search,
  Users,
  Award,
  ChevronRight,
  CheckCircle2,
  Briefcase,
  ArrowRight,
  Info,
} from "lucide-react";

interface RecruiterInterviewsViewProps {
  initialInterviews: RecruiterInterview[];
  initialMetrics?: {
    total: number;
    scheduled: number;
    completed: number;
  };
  basePath?: string; // default "/recruiter/interviews"
}

export function RecruiterInterviewsView({
  initialInterviews,
  initialMetrics,
  basePath = "/recruiter/interviews",
}: RecruiterInterviewsViewProps) {
  const router = useRouter();
  const [interviews] = useState<RecruiterInterview[]>(initialInterviews);
  const metrics = initialMetrics || {
    total: initialInterviews.length,
    scheduled: initialInterviews.filter((i) => (i.raw_status || i.status.toLowerCase()) === "scheduled").length,
    completed: initialInterviews.filter((i) => (i.raw_status || i.status.toLowerCase()) === "completed").length,
  };

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyLink = (e: React.MouseEvent, link: string, id: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filtered Interviews
  const filteredInterviews = useMemo(() => {
    return interviews.filter((item) => {
      // Status Filter
      if (statusFilter !== "all") {
        const itemStatus = (item.raw_status || item.status || "").toLowerCase();
        if (itemStatus !== statusFilter.toLowerCase()) return false;
      }

      // Format / Type Filter
      if (typeFilter !== "all") {
        const itemType = (item.type || "").toLowerCase();
        if (!itemType.includes(typeFilter.toLowerCase())) return false;
      }

      // Search Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const cand = (item.candidate || "").toLowerCase();
        const candEmail = (item.candidate_email || "").toLowerCase();
        const role = (item.role || "").toLowerCase();
        const client = (item.client_name || "").toLowerCase();
        const title = (item.title || "").toLowerCase();
        const id = (item.id || "").toLowerCase();

        return (
          cand.includes(q) ||
          candEmail.includes(q) ||
          role.includes(q) ||
          client.includes(q) ||
          title.includes(q) ||
          id.includes(q)
        );
      }

      return true;
    });
  }, [interviews, statusFilter, typeFilter, searchQuery]);

  const getStatusBadge = (status: string) => {
    const s = (status || "").toLowerCase();
    if (s.includes("scheduled")) {
      return "bg-blue-50 text-blue-700 border-blue-200";
    }
    if (s.includes("confirmed")) {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
    if (s.includes("completed")) {
      return "bg-slate-900 text-white border-slate-900";
    }
    if (s.includes("rescheduled")) {
      return "bg-amber-50 text-amber-700 border-amber-200";
    }
    if (s.includes("cancelled")) {
      return "bg-rose-50 text-rose-700 border-rose-200";
    }
    return "bg-indigo-50 text-indigo-700 border-indigo-200";
  };

  const pipelineUrl = basePath.startsWith("/admin") ? "/admin/ats" : "/recruiter/pipeline";

  return (
    <div className="space-y-6 pb-12 font-enterprise text-[#0a0d12]">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#bcd6fa]/50 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-2.5 py-0.5 text-[10px] font-bold text-blue-700 uppercase tracking-widest">
            <span>STAGE 4 INTERVIEW PIPELINE</span>
          </div>
          <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-[#0a0d12]">
            Candidate Interviews &amp; Panel Evaluations
          </h1>
          <p className="text-xs text-slate-500">
            Enterprise interview directory across Technology, Healthcare, Operations, and Leadership roles. Inspect session briefings, join video rooms, and record post-interview scorecards.
          </p>
        </div>

        <Link
          href={pipelineUrl}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-800 shadow-2xs hover:bg-slate-50 hover:text-blue-600 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <span>Open ATS Pipeline</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* Automated Provisioning Notice Banner */}
      <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-4 text-xs flex items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-2xs">
            <Info size={16} />
          </div>
          <div>
            <p className="font-bold text-blue-950">
              Automated Interview Lifecycle Coordination
            </p>
            <p className="text-blue-800/80 text-[11px] mt-0.5">
              Interviews are automatically provisioned with Google Meet coordinates and calendar invitations whenever a candidate is moved to the Interview stage in the recruitment pipeline.
            </p>
          </div>
        </div>

        <Link
          href={pipelineUrl}
          className="hidden md:inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 font-bold text-[11px] text-white hover:bg-blue-700 transition-colors shrink-0 shadow-2xs"
        >
          <span>Move Candidates</span>
          <ChevronRight size={12} />
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-[#bcd6fa]/60 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Total Sessions</span>
            <Calendar size={14} className="text-blue-600" />
          </div>
          <div className="mt-1 text-2xl font-bold text-slate-900">{metrics.total}</div>
          <p className="text-[11px] text-slate-500 mt-0.5">Across all candidate disciplines</p>
        </div>

        <div className="rounded-xl border border-[#bcd6fa]/60 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Upcoming / Scheduled</span>
            <Clock size={14} className="text-amber-600" />
          </div>
          <div className="mt-1 text-2xl font-bold text-slate-900">{metrics.scheduled}</div>
          <p className="text-[11px] text-slate-500 mt-0.5">Ready for briefing and panel attendance</p>
        </div>

        <div className="rounded-xl border border-[#bcd6fa]/60 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Completed &amp; Evaluated</span>
            <Award size={14} className="text-emerald-600" />
          </div>
          <div className="mt-1 text-2xl font-bold text-slate-900">{metrics.completed}</div>
          <p className="text-[11px] text-slate-500 mt-0.5">Scorecards and notes recorded</p>
        </div>
      </div>

      {/* Prominent Search and Filter Toolbar */}
      <div className="rounded-2xl border border-[#bcd6fa]/60 bg-white p-4 shadow-2xs">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search candidate name, requisition title, client, or interview title..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-9 pr-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-hidden transition-colors"
            />
          </div>

          {/* Filter: Status */}
          <div className="w-full md:w-44">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:border-blue-500 focus:outline-hidden cursor-pointer"
            >
              <option value="all">Status: All</option>
              <option value="scheduled">Scheduled</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="rescheduled">Rescheduled</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Filter: Evaluation Format */}
          <div className="w-full md:w-56">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:border-blue-500 focus:outline-hidden cursor-pointer"
            >
              <option value="all">Format: All Categories</option>
              <option value="coding">Technical Coding &amp; Algorithms</option>
              <option value="design">System Architecture &amp; Design</option>
              <option value="clinical">Clinical Competency Board</option>
              <option value="governance">Medical Governance Review</option>
              <option value="behavioral">Behavioral &amp; Leadership</option>
              <option value="client_final">Client Final Round</option>
            </select>
          </div>
        </div>
      </div>

      {/* Enterprise High-Density Table */}
      <div className="rounded-2xl border border-[#bcd6fa]/60 bg-white shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Candidate</th>
                <th className="py-3 px-4">Requisition &amp; Client</th>
                <th className="py-3 px-4">Format &amp; Round</th>
                <th className="py-3 px-4">Schedule</th>
                <th className="py-3 px-4">Panel</th>
                <th className="py-3 px-4">Meeting Room</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Scorecard</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInterviews.length > 0 ? (
                filteredInterviews.map((item) => {
                  const detailUrl = `${basePath}/${item.id}`;
                  return (
                    <tr
                      key={item.id}
                      onClick={() => router.push(detailUrl)}
                      className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                    >
                      {/* Candidate */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900 font-bold text-[11px] text-white">
                            {item.candidate?.charAt(0) || "C"}
                          </div>
                          <div className="max-w-[170px] truncate">
                            <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors block truncate">
                              {item.candidate}
                            </span>
                            <span className="text-[11px] text-slate-400 block truncate">
                              {item.candidate_email || item.candidate_headline || "Verified Talent"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Requisition & Client */}
                      <td className="py-3 px-4">
                        <div className="max-w-[200px]">
                          <span className="font-semibold text-slate-800 line-clamp-1 block">
                            {item.role}
                          </span>
                          <span className="text-[11px] text-slate-500 font-medium block truncate">
                            {item.client_name || "Pepoltek Client Partner"}
                          </span>
                        </div>
                      </td>

                      {/* Format & Round */}
                      <td className="py-3 px-4">
                        <div className="space-y-0.5">
                          <span className="font-medium text-slate-800 block">
                            {item.type}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                            Round {item.round_number || 1}
                          </span>
                        </div>
                      </td>

                      {/* Scheduled Timing */}
                      <td className="py-3 px-4">
                        <div className="space-y-0.5 text-slate-700 whitespace-nowrap">
                          <div className="flex items-center gap-1 font-semibold text-slate-900">
                            <Calendar size={12} className="text-slate-400 shrink-0" />
                            <span>{item.time}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 block">
                            {item.timezone || "UTC"}
                          </span>
                        </div>
                      </td>

                      {/* Panel */}
                      <td className="py-3 px-4">
                        <div className="max-w-[150px] truncate text-[11px] text-slate-600">
                          <span className="font-medium text-slate-800 block truncate">
                            {item.panel}
                          </span>
                          {item.assignments && item.assignments.length > 0 && (
                            <span className="text-[10px] text-slate-400 block">
                              {item.assignments.length} assigned panelists
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Meeting Room */}
                      <td className="py-3 px-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        {item.meeting_link ? (
                          <div className="flex items-center gap-1.5">
                            <a
                              href={item.meeting_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-2 py-1 text-[11px] font-semibold text-blue-700 hover:bg-blue-100 transition-colors"
                            >
                              <Video size={12} />
                              <span>Meet</span>
                              <ExternalLink size={10} className="opacity-70" />
                            </a>
                            <button
                              type="button"
                              onClick={(e) => handleCopyLink(e, item.meeting_link || "", item.id)}
                              title="Copy Google Meet Link"
                              className="rounded-lg p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                            >
                              {copiedId === item.id ? (
                                <Check size={12} className="text-emerald-600" />
                              ) : (
                                <Copy size={12} />
                              )}
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px] italic">Pending room</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <span
                          className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getStatusBadge(
                            item.status
                          )}`}
                        >
                          {item.status}
                        </span>
                      </td>

                      {/* Scorecard */}
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        {item.average_score !== null && item.average_score !== undefined ? (
                          <span className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 font-bold text-[11px]">
                            {item.average_score} / 100
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400 font-medium italic">
                            Pending
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <Link
                          href={detailUrl}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors shadow-2xs"
                        >
                          <span>Session &amp; Notes</span>
                          <ChevronRight size={12} />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500">
                    <Calendar size={28} className="mx-auto text-slate-300 mb-2" />
                    <p className="text-xs font-semibold text-slate-700">No scheduled interviews match current criteria.</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Advance candidates in the recruitment pipeline to create new sessions.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
