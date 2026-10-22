"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  Clock,
  ArrowRight,
  Users,
  CheckCircle,
  Video,
  ShieldCheck,
  FileText,
  X,
  Zap,
} from "@/components/ui/Icons";
import { SprintPipelineItem } from "@/types/candidate.types";
import { getCandidateApplicationsAction } from "@/actions/candidate.actions";

interface CandidateApplicationsViewProps {
  initialApplications?: SprintPipelineItem[];
}

export function CandidateApplicationsView({
  initialApplications = [],
}: CandidateApplicationsViewProps) {
  const [filter, setFilter] = useState<string>("All");
  const [appsList, setAppsList] = useState<SprintPipelineItem[]>(initialApplications);
  const [selectedApp, setSelectedApp] = useState<SprintPipelineItem | null>(null);
  const [isVirtualRoomOpen, setIsVirtualRoomOpen] = useState(false);
  const [callActive, setCallActive] = useState(false);

  const filteredApps = appsList.filter((app) => {
    if (filter === "All") return true;
    if (filter === "Technology") return app.sector === "Technology";
    if (filter === "Healthcare") return app.sector === "Healthcare";
    return app.currentStage === filter;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-electric/30 bg-gradient-to-r from-ink via-[#0e2142] to-ink p-6 sm:p-8 text-white shadow-md">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-signal/40 bg-signal/10 px-3 py-0.5 text-[11px] font-mono text-signal">
              <span className="h-2 w-2 rounded-full bg-signal animate-pulse" />
              <span>TRANSPARENT 5-STAGE SPRINT AUDIT TRAIL</span>
            </div>
            <h1 className="mt-2.5 font-display text-2xl sm:text-3xl font-bold tracking-tight">
              Application Pipelines &amp; Status
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-gray-300 max-w-2xl leading-relaxed">
              Real-time telemetry across all your active enterprise job applications. Track every stage from initial discovery through technical vetting to placement.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <Link
              href="/candidate/reverse-search"
              className="inline-flex items-center gap-2 rounded-xl bg-electric px-4 py-2.5 font-display text-xs font-semibold text-white shadow-xs transition-all hover:bg-electric-bright cursor-pointer"
            >
              <Zap size={14} />
              <span>Explore Reverse Matches</span>
            </Link>
          </div>
        </div>

        {/* Status Metrics Strip */}
        <div className="relative z-10 mt-6 pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div>
            <span className="text-gray-400 block text-[10px]">TOTAL ACTIVE PIPELINES</span>
            <span className="text-lg font-bold text-white">{appsList.length} Active</span>
          </div>
          <div>
            <span className="text-gray-400 block text-[10px]">IN CLIENT PANEL</span>
            <span className="text-lg font-bold text-electric-bright">
              {appsList.filter((a) => a.currentStage === "Client Panel").length} Roles
            </span>
          </div>
          <div>
            <span className="text-gray-400 block text-[10px]">TECHNICAL VETTING</span>
            <span className="text-lg font-bold text-signal">
              {appsList.filter((a) => a.currentStage === "Technical Vetting").length} Active
            </span>
          </div>
          <div>
            <span className="text-gray-400 block text-[10px]">AVERAGE KICKOFF VELOCITY</span>
            <span className="text-lg font-bold text-white">4.8 Days</span>
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

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#bcd6fa] bg-white p-3 shadow-xs">
        <div className="flex items-center gap-1.5 flex-wrap">
          {["All", "Technology", "Healthcare", "Technical Vetting", "Client Panel"].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={`rounded-xl px-3.5 py-1.5 font-mono text-xs font-semibold transition-all cursor-pointer ${
                filter === tab
                  ? "bg-ink text-white shadow-xs"
                  : "text-ink-soft hover:bg-canvas hover:text-ink"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <span className="font-mono text-[11px] text-mist pr-2">
          Showing {filteredApps.length} of {appsList.length} applications
        </span>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApps.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[#bcd6fa] bg-white p-12 text-center shadow-xs">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-canvas border border-[#bcd6fa]/60 text-mist">
              <Briefcase size={28} />
            </div>
            <h3 className="mt-4 font-display text-base font-bold text-ink">No Active Applications</h3>
            <p className="mt-1.5 max-w-md mx-auto text-xs text-ink-soft leading-relaxed">
              You have not submitted applications to any client engineering or clinical requisitions yet. Authorize requisitions via Reverse Search to launch your submission pipelines.
            </p>
          </div>
        ) : (
          filteredApps.map((app) => (
          <div
            key={app.id}
            onClick={() => setSelectedApp(app)}
            className="rounded-3xl border border-[#bcd6fa] bg-white p-6 shadow-xs hover:border-electric/70 hover:shadow-sm transition-all cursor-pointer group"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#bcd6fa]/30 pb-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-electric">{app.id}</span>
                  <span className="rounded-full bg-signal/15 px-2.5 py-0.5 font-mono text-[10px] font-bold text-signal">
                    {app.matchScore}% Match
                  </span>
                  <span className="rounded-full border border-[#bcd6fa] bg-canvas px-2.5 py-0.5 font-mono text-[10px] text-ink-soft">
                    {app.sector}
                  </span>
                  <span className="rounded-full bg-canvas px-2.5 py-0.5 font-mono text-[10px] text-mist">
                    Applied {app.appliedDate}
                  </span>
                </div>

                <h3 className="mt-2 font-display text-lg sm:text-xl font-bold text-ink group-hover:text-electric transition-colors">
                  {app.podName}
                </h3>
                <div className="text-xs text-ink-soft mt-0.5">
                  Client: <strong className="text-ink font-semibold">{app.clientName}</strong> ({app.clientIndustry})
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
                <div className="text-right">
                  <div className="font-display text-base font-bold text-ink">{app.rate}</div>
                  <div className="text-mist text-[11px]">{app.duration}</div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedApp(app);
                  }}
                  className="rounded-xl border border-[#bcd6fa] bg-canvas/40 px-3.5 py-2 font-display text-xs font-semibold text-ink group-hover:bg-electric group-hover:text-white transition-all cursor-pointer"
                >
                  View Pipeline Details
                </button>
              </div>
            </div>

            {/* 5-Stage Stepper Ribbon */}
            <div className="mt-5 pt-2">
              <div className="flex items-center justify-between text-xs font-mono mb-2">
                <span className="text-ink-soft">
                  Stage {app.stageIndex} of 5: <strong className="text-ink font-bold">{app.currentStage}</strong>
                </span>
                <span className="text-electric font-semibold">
                  Hiring Lead: {app.podLeadName}
                </span>
              </div>

              {/* Progress Bar with Steps */}
              <div className="grid grid-cols-5 gap-2">
                {["Discovery", "Screened", "Technical Vetting", "Client Panel", "Deployed"].map((stage, idx) => {
                  const stepNumber = idx + 1;
                  const isCompleted = stepNumber < app.stageIndex;
                  const isCurrent = stepNumber === app.stageIndex;

                  return (
                    <div key={stage} className="space-y-1">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          isCompleted
                            ? "bg-signal"
                            : isCurrent
                            ? "bg-electric animate-pulse"
                            : "bg-canvas border border-[#bcd6fa]/40"
                        }`}
                      />
                      <span
                        className={`block text-[10px] font-mono truncate ${
                          isCompleted
                            ? "text-signal font-semibold"
                            : isCurrent
                            ? "text-electric font-bold"
                            : "text-mist"
                        }`}
                      >
                        {stage}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Brief / Action Callout */}
            {app.interviewBrief && (
              <div className="mt-4 rounded-2xl border border-electric/30 bg-electric/5 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-electric text-white">
                    <Video size={16} />
                  </div>
                  <div>
                    <span className="font-bold text-ink block">Upcoming Client Panel Interview</span>
                    <span className="text-ink-soft text-[11px]">{app.interviewBrief.scheduledAt} with {app.interviewBrief.interviewerName}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedApp(app);
                    setIsVirtualRoomOpen(true);
                  }}
                  className="rounded-xl bg-electric px-3.5 py-1.5 font-display text-xs font-bold text-white hover:bg-electric-bright transition-all cursor-pointer shadow-xs"
                >
                  Enter Virtual Room
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>

      {/* Slide-over Detail Drawer */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex justify-end bg-ink/40 backdrop-blur-xs animate-in fade-in-0 duration-150">
          <div
            className="w-full max-w-xl bg-white h-full shadow-2xl p-6 sm:p-8 flex flex-col justify-between overflow-y-auto thin-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-start justify-between border-b border-[#bcd6fa]/40 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-electric">{selectedApp.id}</span>
                    <span className="rounded-full bg-signal/15 px-2.5 py-0.5 font-mono text-[10px] font-bold text-signal">
                      {selectedApp.currentStage}
                    </span>
                  </div>
                  <h2 className="font-display text-xl font-bold text-ink mt-1.5">
                    {selectedApp.podName}
                  </h2>
                  <p className="text-xs text-ink-soft">
                    {selectedApp.clientName} • {selectedApp.clientIndustry}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedApp(null)}
                  className="rounded-xl p-2 text-ink-soft hover:bg-canvas cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Sprint Telemetry Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-2xl border border-[#bcd6fa]/60 bg-canvas/40 p-3.5">
                  <span className="font-mono text-[10px] text-mist uppercase block mb-1">COMPENSATION RATE</span>
                  <span className="font-display text-base font-bold text-ink">{selectedApp.rate}</span>
                  <span className="text-[11px] text-ink-soft block mt-0.5">{selectedApp.duration}</span>
                </div>
                <div className="rounded-2xl border border-[#bcd6fa]/60 bg-canvas/40 p-3.5">
                  <span className="font-mono text-[10px] text-mist uppercase block mb-1">TIMEZONE OVERLAP</span>
                  <span className="font-display text-base font-bold text-ink">{selectedApp.timezone}</span>
                  <span className="text-[11px] text-ink-soft block mt-0.5">Hiring Lead: {selectedApp.podLeadName}</span>
                </div>
              </div>

              {/* Skills Overlap */}
              <div>
                <h4 className="font-display text-xs font-bold text-ink uppercase tracking-wider mb-2">
                  Verified Technical Requirements
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedApp.requiredSkills.map((sk) => (
                    <span
                      key={sk}
                      className="rounded-lg border border-[#bcd6fa]/70 bg-canvas px-2.5 py-1 font-mono text-xs font-medium text-ink"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              {/* Timeline Stage History */}
              <div>
                <h4 className="font-display text-xs font-bold text-ink uppercase tracking-wider mb-3">
                  Pipeline Audit History
                </h4>
                <div className="space-y-3 border-l-2 border-[#bcd6fa] pl-4 ml-2">
                  {selectedApp.stageHistory?.map((hist, idx) => (
                    <div key={idx} className="relative text-xs space-y-0.5">
                      <div className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-electric border-2 border-white" />
                      <div className="flex items-center justify-between font-mono text-[11px]">
                        <span className="font-bold text-ink">{hist.stageName}</span>
                        <span className="text-mist">{hist.date}</span>
                      </div>
                      <p className="text-ink-soft text-[11px]">{hist.notes}</p>
                      <span className="text-mist text-[10px] block">Verified by {hist.completedBy}</span>
                    </div>
                  )) || (
                    <p className="text-xs text-mist">Historical stage audit telemetry active.</p>
                  )}
                </div>
              </div>

              {/* Interview Briefing Box */}
              {selectedApp.interviewBrief && (
                <div className="rounded-2xl border border-electric/40 bg-gradient-to-br from-electric/5 to-white p-4 space-y-3">
                  <div className="flex items-center gap-2 text-electric font-bold text-xs">
                    <Video size={16} />
                    <span>Technical Evaluation Details</span>
                  </div>
                  <div className="text-xs space-y-1">
                    <div>
                      <strong className="text-ink">Interviewer:</strong> {selectedApp.interviewBrief.interviewerName} ({selectedApp.interviewBrief.interviewerTitle})
                    </div>
                    <div>
                      <strong className="text-ink">Scheduled:</strong> {selectedApp.interviewBrief.scheduledAt}
                    </div>
                    <div>
                      <strong className="text-ink">Agenda:</strong> {selectedApp.interviewBrief.agenda}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsVirtualRoomOpen(true)}
                    className="w-full rounded-xl bg-electric py-2.5 font-display text-xs font-bold text-white hover:bg-electric-bright transition-all cursor-pointer shadow-xs text-center block"
                  >
                    Open Virtual Interview Space
                  </button>
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-[#bcd6fa]/40 flex items-center justify-between text-xs">
              <span className="text-mist font-mono text-[11px]">Ref: {selectedApp.id}</span>
              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="rounded-xl px-4 py-2 font-display text-xs font-semibold text-ink-soft hover:bg-canvas cursor-pointer"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Virtual Room Simulator Modal */}
      {isVirtualRoomOpen && selectedApp?.interviewBrief && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 backdrop-blur-xs p-4 animate-in fade-in-0 duration-150">
          <div
            className="w-full max-w-2xl rounded-3xl border border-electric/40 bg-ink p-6 sm:p-7 shadow-2xl text-white space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-signal/20 text-signal">
                  <Video size={18} />
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-white">
                    Virtual Technical Evaluation Room
                  </h3>
                  <p className="text-xs text-gray-300 font-mono">
                    {selectedApp.podName} • {selectedApp.interviewBrief.interviewerName}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsVirtualRoomOpen(false);
                  setCallActive(false);
                }}
                className="rounded-xl p-1.5 text-gray-400 hover:bg-white/10 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Video Canvas Simulation */}
            <div className="relative aspect-video rounded-2xl bg-black/60 border border-white/10 overflow-hidden flex items-center justify-center">
              {callActive ? (
                <div className="text-center space-y-2">
                  <div className="h-16 w-16 mx-auto rounded-full bg-electric/20 border-2 border-electric flex items-center justify-center animate-pulse">
                    <Users size={28} className="text-electric" />
                  </div>
                  <div className="font-display text-sm font-bold text-white">Connected to Secure Evaluator Panel</div>
                  <div className="font-mono text-xs text-signal">WebRTC Low-Latency Stream Active • 1080p 60fps</div>
                </div>
              ) : (
                <div className="text-center space-y-3 p-6">
                  <div className="font-display text-base font-bold text-white">Pre-Flight Audio & Video Check</div>
                  <p className="text-xs text-gray-300 max-w-md">
                    Verify your camera, microphone, and screen share permissions before joining {selectedApp.interviewBrief.interviewerName}.
                  </p>
                  <button
                    type="button"
                    onClick={() => setCallActive(true)}
                    className="inline-flex items-center gap-2 rounded-xl bg-signal px-5 py-2.5 font-display text-xs font-bold text-ink hover:bg-emerald-400 transition-all cursor-pointer shadow-xs"
                  >
                    <span>Connect to Panel</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              )}

              <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-xs px-2.5 py-1 rounded-lg font-mono text-[10px] text-gray-300">
                Candidate: Alex Morgan (Screen Verified)
              </div>
            </div>

            {/* Controls Bar */}
            <div className="flex items-center justify-between text-xs pt-2">
              <span className="font-mono text-[11px] text-gray-400">
                Meeting Link: <code className="text-electric-bright">{selectedApp.interviewBrief.meetingUrl}</code>
              </span>

              <button
                type="button"
                onClick={() => {
                  setIsVirtualRoomOpen(false);
                  setCallActive(false);
                }}
                className="rounded-xl border border-white/20 bg-white/5 px-4 py-2 font-display text-xs font-semibold text-white hover:bg-white/10 cursor-pointer"
              >
                Exit Room
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
