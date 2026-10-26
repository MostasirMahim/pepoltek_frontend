"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Video,
  Users,
  ExternalLink,
  CheckCircle,
  ShieldCheck,
  ArrowRight,
  Briefcase,
  Copy,
  Check,
} from "@/components/ui/Icons";
import { CandidateInterviewItem } from "@/actions/candidate.actions";

interface CandidateInterviewsViewProps {
  initialInterviews: CandidateInterviewItem[];
}

export function CandidateInterviewsView({
  initialInterviews,
}: CandidateInterviewsViewProps) {
  const [interviews] = useState<CandidateInterviewItem[]>(initialInterviews);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | "confirmed" | "completed">("all");

  const handleCopyLink = (id: string, link: string) => {
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const filteredInterviews = interviews.filter((item) => {
    if (statusFilter === "confirmed") return item.status.toLowerCase() === "confirmed";
    if (statusFilter === "completed") return item.status.toLowerCase() === "completed";
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-[#bcd6fa] bg-gradient-to-r from-ink via-ink/95 to-electric/90 p-6 sm:p-8 text-white shadow-lg">
        <div className="absolute right-0 top-0 -mt-8 -mr-8 h-64 w-64 rounded-full bg-electric/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 font-mono text-xs text-white/90 backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-signal animate-pulse" />
            <span>Sprint Interview Cadence Active</span>
          </div>

          <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
            Sprint &amp; Client Interviews
          </h1>

          <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-sans">
            Direct access to scheduled technical vetting panels, system design sessions, and client interviews. Join live video meetings and review preparation dossiers.
          </p>

          <div className="grid grid-cols-3 gap-3 pt-2 font-mono text-xs max-w-md">
            <div className="rounded-xl border border-white/10 bg-white/5 p-2.5">
              <span className="text-[10px] text-white/60 block uppercase">Scheduled</span>
              <span className="text-base font-bold text-white">{interviews.length}</span>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-2.5">
              <span className="text-[10px] text-white/60 block uppercase">Status</span>
              <span className="text-base font-bold text-signal">Ready</span>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-2.5">
              <span className="text-[10px] text-white/60 block uppercase">Format</span>
              <span className="text-base font-bold text-white">Google Meet</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 pb-3">
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setStatusFilter("all")}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              statusFilter === "all"
                ? "bg-white text-ink shadow-xs"
                : "text-slate-500 hover:text-ink"
            }`}
          >
            All Interviews ({interviews.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("confirmed")}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              statusFilter === "confirmed"
                ? "bg-white text-ink shadow-xs"
                : "text-slate-500 hover:text-ink"
            }`}
          >
            Confirmed Upcoming
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("completed")}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              statusFilter === "completed"
                ? "bg-white text-ink shadow-xs"
                : "text-slate-500 hover:text-ink"
            }`}
          >
            Completed
          </button>
        </div>

        <Link
          href="/candidate/applications"
          className="inline-flex items-center gap-1 text-xs font-semibold text-electric hover:underline"
        >
          <span>View All Application Pipelines</span>
          <ArrowRight size={13} />
        </Link>
      </div>

      {/* Interviews List */}
      {filteredInterviews.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-[#bcd6fa] bg-white p-12 text-center shadow-xs">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-canvas border border-[#bcd6fa]/60 text-mist">
            <Calendar size={28} />
          </div>
          <h3 className="mt-4 font-display text-base font-bold text-ink">
            No Scheduled Interviews in Pipeline
          </h3>
          <p className="mt-1.5 max-w-md mx-auto text-xs text-ink-soft leading-relaxed">
            When recruiters advance your applications to Stage 4 (Client Interview), your confirmed video conference invites, panel evaluators, and Google Meet links will appear right here.
          </p>
          <div className="mt-5">
            <Link
              href="/candidate/applications"
              className="rounded-xl bg-ink px-4 py-2 font-display text-xs font-semibold text-white hover:bg-electric transition-colors inline-flex items-center gap-1.5 shadow-xs"
            >
              <Briefcase size={14} />
              <span>Explore Active Applications</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredInterviews.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-2xs hover:shadow-xs transition-shadow"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[11px] font-bold text-electric">
                      {item.id}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 font-mono text-[10px] font-semibold">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>{item.status.toUpperCase()}</span>
                    </span>
                    <span className="rounded-full bg-slate-100 text-slate-700 px-2 py-0.5 font-mono text-[10px]">
                      {item.sector === "healthcare" ? "Healthcare" : "Software Tech"}
                    </span>
                  </div>

                  <h3 className="font-display text-base sm:text-lg font-bold text-ink">
                    {item.role}
                  </h3>

                  <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-500">
                    <span>
                      Client: <strong className="text-slate-800 font-semibold">{item.client_name}</strong>
                    </span>
                    <span>·</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock size={12} className="text-slate-400" />
                      <span>{item.time}</span>
                    </span>
                    <span>·</span>
                    <span>{item.location}</span>
                  </div>

                  <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3 text-xs space-y-1 max-w-xl">
                    <div className="font-mono text-[10.5px] uppercase font-bold text-slate-500 tracking-wider">
                      Panel Evaluator &amp; Format
                    </div>
                    <div className="flex items-center gap-2 text-slate-700 font-medium">
                      <Users size={14} className="text-slate-400 shrink-0" />
                      <span>{item.panel}</span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {item.type}
                    </div>
                  </div>
                </div>

                {/* Action CTAs */}
                <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-2.5 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                  <a
                    href={item.meeting_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl bg-electric px-5 py-2.5 font-display text-xs font-bold text-white hover:bg-electric-bright transition-all shadow-xs inline-flex items-center justify-center gap-2 text-center"
                  >
                    <Video size={15} />
                    <span>Join Google Meet</span>
                    <ExternalLink size={12} />
                  </a>

                  <button
                    type="button"
                    onClick={() => handleCopyLink(item.id, item.meeting_link)}
                    className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 font-mono text-[11px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check size={13} className="text-emerald-600" />
                        <span className="text-emerald-700">Link Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy size={13} className="text-slate-400" />
                        <span>Copy Meeting Link</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Prep Checklist */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-y-1 gap-x-4 text-[11px] text-slate-500">
                <span className="font-semibold text-slate-700">Sprint Prep:</span>
                <span className="inline-flex items-center gap-1">
                  <CheckCircle size={12} className="text-emerald-600" /> Test camera &amp; mic
                </span>
                <span className="inline-flex items-center gap-1">
                  <CheckCircle size={12} className="text-emerald-600" /> Have code portfolio ready
                </span>
                <span className="inline-flex items-center gap-1">
                  <CheckCircle size={12} className="text-emerald-600" /> Join 3 minutes prior
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
