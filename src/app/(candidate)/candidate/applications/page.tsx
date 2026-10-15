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
import {
  ACTIVE_SPRINT_PIPELINES,
  SprintPipelineItem,
} from "@/data/talentDashboardData";

export default function CandidateApplicationsPage() {
  const [filter, setFilter] = useState<string>("All");
  const [selectedApp, setSelectedApp] = useState<SprintPipelineItem | null>(null);
  const [isVirtualRoomOpen, setIsVirtualRoomOpen] = useState(false);
  const [callActive, setCallActive] = useState(false);

  const filtered = filter === "All"
    ? ACTIVE_SPRINT_PIPELINES
    : ACTIVE_SPRINT_PIPELINES.filter((a) =>
        a.currentStage === filter || a.sector === filter
      );

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-electric/30 bg-electric/10 px-3 py-0.5 text-[11px] font-mono font-semibold text-electric uppercase tracking-widest">
            <span>Enterprise Pod Deployments</span>
          </div>
          <h1 className="mt-2 font-display text-2xl sm:text-3xl font-bold tracking-tight text-ink">
            Pod Application Pipeline
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-ink-soft max-w-2xl">
            Track your 7-day sprint evaluations, client panel introductions, and live deployment contracts with guaranteed standup overlap.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-2xl border border-[#bcd6fa] bg-white px-4 py-2 shadow-xs">
          <span className="font-mono text-xs text-mist">Active Requisitions:</span>
          <span className="rounded-full bg-signal/10 px-2.5 py-0.5 font-mono text-xs font-bold text-signal">
            {ACTIVE_SPRINT_PIPELINES.length} Live
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[#bcd6fa]/40 pb-3">
        {["All", "Technical Vetting", "Client Panel", "Screened", "Technology", "Healthcare"].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setFilter(tab)}
            className={`rounded-xl px-3.5 py-1.5 font-display text-xs font-semibold transition-all cursor-pointer ${
              filter === tab
                ? "bg-ink text-white shadow-xs"
                : "border border-[#bcd6fa]/60 bg-white text-ink-soft hover:bg-canvas hover:text-ink"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Applications Cards Grid */}
      <div className="space-y-4">
        {filtered.map((app: SprintPipelineItem) => (
          <div
            key={app.id}
            onClick={() => setSelectedApp(app)}
            className="rounded-3xl border border-[#bcd6fa] bg-white p-6 sm:p-7 shadow-xs hover:border-electric/70 transition-all space-y-4 cursor-pointer group"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#bcd6fa]/30 pb-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-electric bg-electric/10 px-2 py-0.5 rounded-md">
                    {app.id}
                  </span>
                  <span className="rounded-full bg-signal/10 px-2.5 py-0.5 font-mono text-[10px] font-bold text-signal">
                    {app.tag}
                  </span>
                  <span className="rounded-full border border-[#bcd6fa] bg-canvas px-2.5 py-0.5 font-mono text-[10px] text-ink-soft">
                    {app.sector}
                  </span>
                </div>
                <h3 className="mt-1 font-display text-lg sm:text-xl font-bold text-ink group-hover:text-electric transition-colors">
                  {app.podName}
                </h3>
                <div className="text-xs text-ink-soft mt-0.5">
                  Client: <strong className="text-ink font-semibold">{app.clientName}</strong> ({app.clientIndustry})
                </div>
              </div>

              <div className="sm:text-right">
                <div className="font-display text-lg font-extrabold text-ink">{app.rate}</div>
                <div className="font-mono text-[11px] text-mist">{app.duration}</div>
              </div>
            </div>

            {/* Stage Progress Bar (SRS 5-Stage Stepper) */}
            <div className="pt-1">
              <div className="flex items-center justify-between text-[11px] font-mono mb-2">
                <span className="text-ink-soft">
                  Stage Progress: <strong className="text-electric font-bold">{app.currentStage}</strong>
                </span>
                <span className="text-mist">Step {app.stageIndex} of {app.totalStages}</span>
              </div>
              <div className="grid grid-cols-5 gap-1.5 h-2 bg-canvas rounded-full overflow-hidden">
                {[1, 2, 3, 4, 5].map((s) => (
                  <div
                    key={s}
                    className={`h-full rounded-full transition-all duration-300 ${
                      s <= app.stageIndex ? "bg-electric" : "bg-[#bcd6fa]/35"
                    }`}
                  />
                ))}
              </div>
              <div className="mt-2 flex items-center justify-between font-mono text-[9.5px] text-mist uppercase tracking-wider">
                <span>1. Submitted</span>
                <span>2. Screened</span>
                <span className={app.stageIndex >= 3 ? "text-electric font-semibold" : ""}>3. Technical Vetting</span>
                <span className={app.stageIndex >= 4 ? "text-electric font-semibold" : ""}>4. Client Panel</span>
                <span>5. Deployed</span>
              </div>
            </div>

            {/* Application Telemetry Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-[#bcd6fa]/30 text-xs">
              <div>
                <span className="font-mono text-[10.5px] text-mist uppercase tracking-wider block mb-0.5">
                  Designated Pod Lead
                </span>
                <div className="font-semibold text-ink">{app.podLeadName}</div>
              </div>

              <div>
                <span className="font-mono text-[10.5px] text-mist uppercase tracking-wider block mb-0.5">
                  Standup Overlap
                </span>
                <div className="font-mono font-semibold text-ink flex items-center gap-1">
                  <Clock size={12} className="text-electric" />
                  <span>{app.timezone}</span>
                </div>
              </div>

              <div>
                <span className="font-mono text-[10.5px] text-mist uppercase tracking-wider block mb-0.5">
                  Target Kickoff Date
                </span>
                <div className="font-semibold text-signal flex items-center gap-1">
                  <CheckCircle size={12} />
                  <span>{app.startDate}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#bcd6fa]/30">
              <div className="flex flex-wrap gap-1.5">
                {app.requiredSkills.map((sk) => (
                  <span
                    key={sk}
                    className="rounded-md border border-[#bcd6fa]/60 bg-canvas px-2 py-0.5 font-mono text-[10px] text-ink-soft"
                  >
                    {sk}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={() => setSelectedApp(app)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-electric/10 text-electric hover:bg-electric hover:text-white px-3.5 py-2 font-display text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
                >
                  <FileText size={14} />
                  <span>Inspect Pipeline Dossier</span>
                </button>
                <Link
                  href="/candidate/messages"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[#bcd6fa] bg-canvas/40 px-3.5 py-2 font-display text-xs font-semibold text-ink hover:bg-white transition-all cursor-pointer"
                >
                  <Users size={14} />
                  <span>Message Pod Lead</span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Slide-Over Pipeline & Interview Inspection Drawer */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex justify-end bg-ink/40 backdrop-blur-xs animate-in fade-in-0 duration-150">
          <div
            className="w-full max-w-2xl bg-white h-full shadow-2xl overflow-y-auto thin-scrollbar flex flex-col justify-between border-l border-[#bcd6fa]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div>
              <div className="p-6 border-b border-[#bcd6fa]/50 bg-canvas/30 flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-electric bg-electric/10 px-2 py-0.5 rounded-md">
                      {selectedApp.id}
                    </span>
                    <span className="rounded-full bg-signal/15 px-2.5 py-0.5 text-[10px] font-semibold text-signal">
                      {selectedApp.currentStage}
                    </span>
                    <span className="rounded-full bg-canvas border border-[#bcd6fa] px-2.5 py-0.5 text-[10px] font-semibold text-ink-soft">
                      {selectedApp.sector}
                    </span>
                  </div>
                  <h2 className="font-display text-lg font-bold text-ink mt-1.5">{selectedApp.podName}</h2>
                  <p className="text-xs text-ink-soft">
                    Client: <strong className="text-ink">{selectedApp.clientName}</strong> ({selectedApp.clientIndustry})
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedApp(null)}
                  className="rounded-xl p-1.5 text-ink-soft hover:bg-canvas cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Rate & Escrow Quick Summary */}
              <div className="grid grid-cols-3 gap-2 p-4 bg-canvas/60 border-b border-[#bcd6fa]/40 text-center text-xs">
                <div>
                  <div className="text-[10px] text-mist font-semibold uppercase">Contract Rate</div>
                  <div className="font-display text-base font-bold text-ink">{selectedApp.rate}</div>
                  <div className="text-[10px] text-signal font-semibold">100% Escrow Funded</div>
                </div>
                <div className="border-x border-[#bcd6fa]/40">
                  <div className="text-[10px] text-mist font-semibold uppercase">Match Score</div>
                  <div className="font-display text-base font-bold text-electric">{selectedApp.matchScore}%</div>
                  <div className="text-[10px] text-ink-soft">Tier 1 Squad Ready</div>
                </div>
                <div>
                  <div className="text-[10px] text-mist font-semibold uppercase">Standup Overlap</div>
                  <div className="font-display text-xs font-bold text-ink mt-0.5">{selectedApp.timezone}</div>
                  <div className="text-[10px] text-mist">Guaranteed Live Sync</div>
                </div>
              </div>

              {/* Drawer Main Content */}
              <div className="p-6 space-y-6 text-xs">
                {/* 1. Client Panel Interview Briefing Card (if available) */}
                {selectedApp.interviewBrief && (
                  <div className="rounded-2xl border border-electric/40 bg-gradient-to-br from-electric/5 via-canvas/40 to-white p-5 space-y-3 shadow-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-electric text-white shadow-xs">
                          <Video size={16} />
                        </div>
                        <div>
                          <div className="font-bold text-ink text-sm">Upcoming Client Panel Interview</div>
                          <div className="text-[11px] text-electric font-semibold">{selectedApp.interviewBrief.scheduledAt}</div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsVirtualRoomOpen(true)}
                        className="rounded-xl bg-electric px-3.5 py-1.5 text-xs font-bold text-white hover:bg-electric-bright transition-colors cursor-pointer shadow-xs"
                      >
                        Join Virtual Room →
                      </button>
                    </div>

                    <div className="rounded-xl bg-white p-3 border border-[#bcd6fa]/50 space-y-1">
                      <div className="font-semibold text-ink">
                        Interviewer: {selectedApp.interviewBrief.interviewerName}
                      </div>
                      <div className="text-[11px] text-ink-soft">{selectedApp.interviewBrief.interviewerTitle}</div>
                      <p className="text-[11px] text-ink-soft pt-1 leading-relaxed">
                        <strong>Agenda:</strong> {selectedApp.interviewBrief.agenda}
                      </p>
                    </div>

                    <div>
                      <div className="text-[11px] font-bold text-ink mb-1">Tailored Preparation Brief:</div>
                      <ul className="list-disc list-inside space-y-1 text-[11px] text-ink-soft">
                        {selectedApp.interviewBrief.preparationTips.map((tip, idx) => (
                          <li key={idx}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* 2. 5-Stage Timeline Progression History */}
                <div>
                  <h3 className="font-display text-sm font-bold text-ink mb-3">
                    Sprint Pipeline Timeline History
                  </h3>
                  <div className="space-y-2.5">
                    {selectedApp.stageHistory?.map((hist, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-3 rounded-xl border border-[#bcd6fa]/50 bg-white shadow-2xs"
                      >
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-signal/15 text-signal mt-0.5">
                          <CheckCircle size={14} />
                        </div>
                        <div className="space-y-0.5 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-ink">{hist.stageName}</span>
                            <span className="text-[10.5px] text-mist">{hist.date}</span>
                          </div>
                          <div className="text-[11px] text-electric font-medium">Logged by: {hist.completedBy}</div>
                          <p className="text-[11px] text-ink-soft leading-relaxed pt-0.5">{hist.notes}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Contract & Escrow Guarantee Details */}
                {selectedApp.contractDetails && (
                  <div className="rounded-xl border border-[#bcd6fa] bg-canvas/30 p-4 space-y-2">
                    <div className="font-bold text-ink flex items-center gap-1.5">
                      <ShieldCheck size={16} className="text-signal" />
                      <span>Contract & Escrow Settlement Terms</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                      <div>
                        <span className="text-mist block">Rate Guarantee:</span>
                        <strong className="text-ink">{selectedApp.contractDetails.rate}</strong>
                      </div>
                      <div>
                        <span className="text-mist block">Escrow Status:</span>
                        <strong className="text-signal">{selectedApp.contractDetails.escrowStatus}</strong>
                      </div>
                      <div>
                        <span className="text-mist block">Weekly Allocation:</span>
                        <strong className="text-ink">{selectedApp.contractDetails.guaranteedWeeklyHours} Hours / Week</strong>
                      </div>
                      <div>
                        <span className="text-mist block">Timezone Live Overlap:</span>
                        <strong className="text-ink">{selectedApp.contractDetails.timezoneCoverage}</strong>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-6 border-t border-[#bcd6fa]/50 bg-canvas/30 flex items-center justify-between">
              <Link
                href="/candidate/messages"
                className="rounded-xl border border-[#bcd6fa] bg-white px-4 py-2 text-xs font-semibold text-ink hover:bg-canvas transition-colors cursor-pointer"
              >
                Message Pod Coordinator
              </Link>
              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="rounded-xl bg-ink px-4 py-2 text-xs font-semibold text-white hover:bg-electric transition-colors cursor-pointer shadow-xs"
              >
                Close Pipeline Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Virtual Interview Consultation Room Simulator Modal */}
      {isVirtualRoomOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 backdrop-blur-sm p-4 animate-in fade-in-0 duration-150">
          <div
            className="w-full max-w-2xl rounded-3xl border border-electric/40 bg-ink p-6 sm:p-8 text-white shadow-2xl space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/15 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500 animate-pulse" />
                <h3 className="font-display text-lg font-bold">Pepoltek Encrypted Virtual Interview Room</h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsVirtualRoomOpen(false);
                  setCallActive(false);
                }}
                className="rounded-xl p-1.5 text-gray-400 hover:text-white hover:bg-white/10 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Video Preview Canvas */}
            <div className="relative aspect-video rounded-2xl bg-[#0d1b2a] border border-white/10 flex items-center justify-center overflow-hidden shadow-inner">
              {!callActive ? (
                <div className="text-center p-6 space-y-3">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-electric/20 text-electric border border-electric/40">
                    <Video size={28} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base">Camera & Audio Ready</h4>
                    <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                      Connecting with Jonathan Vance (CTO, Global Capital Markets) for 30-minute system design panel.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCallActive(true)}
                    className="rounded-xl bg-signal hover:bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white transition-all shadow-md cursor-pointer"
                  >
                    Enter Live Panel Call Now
                  </button>
                </div>
              ) : (
                <div className="relative w-full h-full flex flex-col justify-between p-4 bg-gradient-to-b from-black/40 via-transparent to-black/80">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-signal px-2.5 py-0.5 text-[10.5px] font-bold text-white">
                      Live Call Connected • 04:18
                    </span>
                    <span className="font-mono text-xs text-gray-300">End-to-End Encrypted</span>
                  </div>

                  {/* Interlocutor Feed */}
                  <div className="absolute inset-0 flex items-center justify-center -z-1">
                    <div className="text-center space-y-2">
                      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-electric to-electric-bright font-display text-2xl font-bold text-white shadow-lg">
                        JV
                      </div>
                      <div className="font-bold text-white text-base">Jonathan Vance (CTO)</div>
                      <div className="text-xs text-emerald-400">Audio Stream Active (48kHz)</div>
                    </div>
                  </div>

                  {/* Candidate Self PiP */}
                  <div className="flex justify-end">
                    <div className="w-32 h-20 rounded-xl bg-white/10 border border-white/20 p-2 flex flex-col justify-between text-[10px] backdrop-blur-xs">
                      <span className="text-gray-300">You (Alex Morgan)</span>
                      <span className="text-signal text-right font-bold">1080p 60fps</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Controls */}
            <div className="flex items-center justify-between pt-2">
              <div className="text-xs text-gray-400">
                Pod Reference: <span className="font-mono text-electric-bright">POD-842</span>
              </div>
              <div className="flex items-center gap-2">
                {callActive && (
                  <button
                    type="button"
                    onClick={() => setCallActive(false)}
                    className="rounded-xl bg-rose-600 hover:bg-rose-700 px-4 py-2 text-xs font-bold text-white transition-colors cursor-pointer"
                  >
                    Disconnect Call
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setIsVirtualRoomOpen(false);
                    setCallActive(false);
                  }}
                  className="rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 px-4 py-2 text-xs font-semibold text-white transition-colors cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
