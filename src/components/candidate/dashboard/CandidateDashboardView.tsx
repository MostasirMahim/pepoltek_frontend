"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Activity,
  Zap,
  ShieldCheck,
  Award,
  Compass,
  FileText,
  Clock,
  ArrowRight,
  Briefcase,
  Users,
  CheckCircle,
  Edit,
  Upload,
  AlertTriangle,
} from "@/components/ui/Icons";
import { useCandidatePersona } from "@/context/CandidatePersonaContext";
import { CandidateProfileDrawer } from "./drawers/CandidateProfileDrawer";
import { CandidateCredentialsDrawer } from "./drawers/CandidateCredentialsDrawer";
import { CandidateDocumentsDrawer } from "./drawers/CandidateDocumentsDrawer";
import { CandidateDataRightsDrawer } from "./drawers/CandidateDataRightsDrawer";
import { CandidateBenchmarkScores } from "@/components/candidate/common/CandidateBenchmarkScores";

export function CandidateDashboardView() {
  const {
    currentProfile,
    pipelines,
    interviews,
    telemetry,
    credentials,
    documents,
    isOpenToPods,
    toggleOpenToWork,
    isLoading,
  } = useCandidatePersona();

  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);
  const [isCredentialsDrawerOpen, setIsCredentialsDrawerOpen] = useState(false);
  const [isDocumentsDrawerOpen, setIsDocumentsDrawerOpen] = useState(false);
  const [isDataRightsDrawerOpen, setIsDataRightsDrawerOpen] = useState(false);
  const [isTogglingAvailability, setIsTogglingAvailability] = useState(false);

  const filteredPipelines = pipelines;

  const nextAction = telemetry?.next_best_action;

  const handleNextActionClick = () => {
    if (!nextAction) return;
    const url = nextAction.cta_url || nextAction.action_url || "";
    if (url.includes("credentials")) {
      setIsCredentialsDrawerOpen(true);
    } else if (url.includes("resume") || url.includes("documents")) {
      setIsDocumentsDrawerOpen(true);
    } else if (url.includes("skills") || url.includes("profile")) {
      setIsProfileDrawerOpen(true);
    }
  };

  const handleToggleAvailability = async () => {
    try {
      setIsTogglingAvailability(true);
      await toggleOpenToWork(!isOpenToPods);
    } finally {
      setIsTogglingAvailability(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Top Welcome & Velocity Status Banner - Responsive Mobile & Desktop */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-electric/30 bg-gradient-to-r from-ink via-[#0d1f3d] to-ink p-4 sm:p-6 lg:p-7 text-white shadow-md">
        <div className="relative z-10 flex flex-col justify-between gap-4 sm:gap-6 md:flex-row md:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-slate-200">
                <span className={`h-2 w-2 rounded-full ${currentProfile.primaryTrack === "healthcare" ? "bg-emerald-400" : "bg-electric-bright"}`} />
                <span>
                  {currentProfile.primaryTrack === "healthcare" ? "Healthcare & Clinical Path" : "Technology & Engineering Path"}
                </span>
              </div>
              <span className="rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-xs text-slate-300 font-medium">
                {currentProfile.vettingTier}
              </span>
            </div>

            <h1 className="font-display text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
              Welcome back, {currentProfile.fullName}
            </h1>
            <p className="mt-1 text-[11.5px] sm:text-xs md:text-sm text-gray-300 max-w-xl leading-normal sm:leading-relaxed line-clamp-2 sm:line-clamp-none">
              Your candidate profile is active in the Pepoltek talent network. Track your application status, vetting benchmarks, and matched roles.
            </p>

            {/* Quick Profile Drawer Trigger Buttons - Smooth Scrollable on Mobile */}
            <div className="mt-3 sm:mt-4 flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
              <button
                type="button"
                onClick={() => setIsProfileDrawerOpen(true)}
                className="shrink-0 inline-flex items-center gap-1.5 rounded-lg sm:rounded-xl bg-white/10 border border-white/20 px-2.5 py-1 sm:px-3 sm:py-1.5 text-[11px] sm:text-xs font-semibold text-white hover:bg-white/20 transition-all cursor-pointer backdrop-blur-xs"
              >
                <Edit size={12} className="sm:w-3.5 sm:h-3.5" />
                <span>Quick Edit</span>
              </button>

              <button
                type="button"
                onClick={() => setIsCredentialsDrawerOpen(true)}
                className="shrink-0 inline-flex items-center gap-1.5 rounded-lg sm:rounded-xl bg-white/10 border border-white/20 px-2.5 py-1 sm:px-3 sm:py-1.5 text-[11px] sm:text-xs font-semibold text-white hover:bg-white/20 transition-all cursor-pointer backdrop-blur-xs"
              >
                <ShieldCheck size={12} className="sm:w-3.5 sm:h-3.5 text-signal" />
                <span>Licenses ({credentials.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setIsDocumentsDrawerOpen(true)}
                className="shrink-0 inline-flex items-center gap-1.5 rounded-lg sm:rounded-xl bg-white/10 border border-white/20 px-2.5 py-1 sm:px-3 sm:py-1.5 text-[11px] sm:text-xs font-semibold text-white hover:bg-white/20 transition-all cursor-pointer backdrop-blur-xs"
              >
                <FileText size={12} className="sm:w-3.5 sm:h-3.5 text-electric-bright" />
                <span>Docs ({documents.length})</span>
              </button>
            </div>
          </div>

          <div className="flex shrink-0 flex-col sm:flex-row md:flex-col items-start md:items-end gap-2.5 sm:gap-3.5 pt-2 sm:pt-0 border-t sm:border-0 border-white/10">
            {/* Open to Work Switch (SRS CAN-09) */}
            <div className="flex w-full sm:w-auto items-center justify-between sm:justify-start gap-3 rounded-xl sm:rounded-2xl border border-white/15 bg-white/5 px-3 py-2 sm:px-4 sm:py-2.5 backdrop-blur-xs">
              <div className="text-left">
                <div className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-gray-300">
                  Open to Opportunities
                </div>
                <div className="text-[11px] sm:text-xs font-bold text-white">
                  {isOpenToPods ? "Active in Match Pool" : "Hidden from Search"}
                </div>
              </div>
              <button
                type="button"
                disabled={isTogglingAvailability}
                onClick={handleToggleAvailability}
                className={`relative inline-flex h-5 sm:h-6 w-9 sm:w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-50 ${
                  isOpenToPods ? "bg-signal" : "bg-gray-600"
                }`}
                aria-label="Toggle Open to Work"
              >
                <span
                  className={`pointer-events-none inline-block h-4 sm:h-5 w-4 sm:w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    isOpenToPods ? "translate-x-4 sm:translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <div className="flex w-full sm:w-auto items-center gap-2">
              <Link
                href="/candidate/applications"
                className="flex-1 sm:flex-initial inline-flex items-center gap-1.5 justify-center rounded-lg sm:rounded-xl bg-electric px-3 py-1.5 sm:px-4 sm:py-2 font-display text-xs sm:text-sm font-semibold text-white shadow-xs transition-all hover:bg-electric-bright active:scale-95 text-center"
              >
                <span>Pipelines</span>
                <ArrowRight size={13} />
              </Link>
              <Link
                href="/candidate/reverse-search"
                className="flex-1 sm:flex-initial inline-flex items-center gap-1.5 justify-center rounded-lg sm:rounded-xl border border-white/25 bg-white/10 px-3 py-1.5 sm:px-3.5 sm:py-2 font-display text-xs sm:text-sm font-semibold text-white backdrop-blur-xs transition-all hover:bg-white/20 active:scale-95 text-center"
              >
                <Compass size={13} />
                <span>Reverse Search</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative Grid Mesh */}
        <div
          className="pointer-events-none absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: "20px 20px",
          }}
        />
      </div>

      {/* Next Best Action Banner (SRS CAN-08) */}
      {nextAction && (
        <div className="rounded-2xl sm:rounded-3xl border border-electric/40 bg-gradient-to-r from-electric/10 via-electric/5 to-white p-3.5 sm:p-5 lg:p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-electric px-2 py-0.5 font-mono text-[9px] sm:text-[10px] font-bold text-white uppercase tracking-wider">
                {nextAction.urgency === "HIGH" || nextAction.priority === "high" ? "Priority Recommendation" : "Profile Boost"}
              </span>
              {nextAction.target_metric && (
                <span className="font-mono text-[11px] sm:text-xs font-bold text-electric">
                  Target Gain: {nextAction.target_metric}
                </span>
              )}
            </div>
            <h3 className="font-display text-sm sm:text-base font-bold text-ink">
              {nextAction.title}
            </h3>
            <p className="text-[11.5px] sm:text-xs text-ink-soft max-w-2xl leading-normal sm:leading-relaxed line-clamp-2 sm:line-clamp-none">
              {nextAction.description}
            </p>
          </div>

          <div className="shrink-0 w-full sm:w-auto pt-1 sm:pt-0">
            {(nextAction.cta_url || nextAction.action_url || "").startsWith("/") ? (
              <Link
                href={nextAction.cta_url || nextAction.action_url || "/candidate/profile"}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-lg sm:rounded-xl bg-ink px-3.5 py-1.5 sm:px-4 sm:py-2 font-display text-xs font-semibold text-white shadow-xs hover:bg-electric transition-colors"
              >
                <span>{nextAction.cta_label || nextAction.action_label || "Take Action"}</span>
                <ArrowRight size={13} />
              </Link>
            ) : (
              <button
                type="button"
                onClick={handleNextActionClick}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-lg sm:rounded-xl bg-ink px-3.5 py-1.5 sm:px-4 sm:py-2 font-display text-xs font-semibold text-white shadow-xs hover:bg-electric transition-colors cursor-pointer"
              >
                <span>{nextAction.cta_label || nextAction.action_label || "Take Action"}</span>
                <ArrowRight size={13} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* 5 Core Benchmarks of Candidate Value (CAN-08 & Business SRS 4.2) */}
      <CandidateBenchmarkScores
        readinessIndex={currentProfile.readinessIndex}
        atsCompatibilityScore={currentProfile.atsCompatibilityScore}
        technicalVettingScore={currentProfile.technicalVettingScore}
        readinessTier={currentProfile.vettingTier}
        requisitionFitScore={currentProfile.requisitionFitScore || (telemetry?.match_score ?? 94)}
        track={currentProfile.primaryTrack}
        variant="dashboard"
      />

      {/* Main Split: Active Applications & Right Intelligence Panel */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
        {/* Left 8 Cols: Active Applications */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-lg font-bold text-ink">Application Pipeline</h2>
              <p className="text-xs text-ink-soft">Live progress across candidate vetting and client introduction stages.</p>
            </div>

            {/* Track Application Count */}
            {pipelines.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                  <span className={`h-1.5 w-1.5 rounded-full ${currentProfile.primaryTrack === "healthcare" ? "bg-emerald-500" : "bg-electric"}`} />
                  <span>{currentProfile.primaryTrack === "healthcare" ? "Clinical Applications" : "Technology Applications"} ({pipelines.length})</span>
                </span>
              </div>
            )}
          </div>

          {filteredPipelines.length === 0 ? (
            <div className="rounded-3xl border border-[#bcd6fa] bg-white p-8 sm:p-10 text-center shadow-xs">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-electric/10 text-electric">
                <Briefcase size={22} />
              </div>
              <h3 className="font-display text-base font-bold text-ink">No Active Applications</h3>
              <p className="mt-1 text-xs text-ink-soft max-w-md mx-auto leading-relaxed">
                You have not submitted any applications yet. Explore reverse search matches or browse open roles to connect with top enterprise teams.
              </p>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/candidate/applications"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-ink px-4 py-2 font-display text-xs font-semibold text-white shadow-xs hover:bg-electric transition-colors"
                >
                  <span>Browse Open Roles</span>
                  <ArrowRight size={13} />
                </Link>
                <Link
                  href="/candidate/reverse-search"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[#bcd6fa] bg-canvas px-4 py-2 font-display text-xs font-semibold text-ink hover:bg-white transition-colors"
                >
                  <Compass size={13} />
                  <span>Explore Reverse Matches</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPipelines.map((pod) => (
                <div
                  key={pod.id}
                  className="rounded-3xl border border-[#bcd6fa] bg-white p-5 sm:p-6 shadow-xs transition-all hover:border-electric/70 hover:shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#bcd6fa]/30 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-electric">{pod.id}</span>
                        {pod.tag && (
                          <span className="rounded-full bg-signal/10 px-2.5 py-0.5 font-mono text-[10px] font-bold text-signal">
                            {pod.tag}
                          </span>
                        )}
                        <span className="rounded-full border border-[#bcd6fa] bg-canvas px-2.5 py-0.5 font-mono text-[10px] text-ink-soft">
                          {pod.sector}
                        </span>
                      </div>
                      <h3 className="mt-1 font-display text-base sm:text-lg font-bold text-ink">
                        {pod.podName}
                      </h3>
                      <div className="text-xs text-ink-soft mt-0.5">
                        Client: <strong className="text-ink font-semibold">{pod.clientName}</strong> ({pod.clientIndustry})
                      </div>
                    </div>
                    <div className="sm:text-right">
                      <div className="font-display text-base font-extrabold text-ink">{pod.rate}</div>
                      <div className="font-mono text-[10.5px] text-mist">{pod.duration}</div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="text-ink-soft">
                      Target Role: <span className="font-semibold text-ink">{pod.role}</span>
                    </div>
                    <div className="font-mono text-[11px] text-mist">
                      Deployment: <span className="font-semibold text-ink">{pod.startDate}</span>
                    </div>
                  </div>

                  {/* 5-Stage Stepper */}
                  <div className="mt-4 pt-2">
                    <div className="flex items-center justify-between text-[11px] font-mono mb-2">
                      <span className="text-ink-soft">
                        Current Stage: <strong className="text-electric font-bold">{pod.currentStage}</strong>
                      </span>
                      <span className="text-mist">Step {pod.stageIndex} of {pod.totalStages}</span>
                    </div>
                    <div className="grid grid-cols-5 gap-1.5 h-2 bg-canvas rounded-full overflow-hidden">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <div
                          key={s}
                          className={`h-full rounded-full transition-all duration-300 ${
                            s <= pod.stageIndex ? "bg-electric" : "bg-[#bcd6fa]/35"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="mt-2 flex items-center justify-between font-mono text-[9.5px] text-mist uppercase tracking-wider">
                      <span>1. Submitted</span>
                      <span>2. Screened</span>
                      <span className="text-electric font-semibold">3. Technical Vetting</span>
                      <span>4. Client Panel</span>
                      <span>5. Deployed</span>
                    </div>
                  </div>

                  {/* Action Strip */}
                  <div className="mt-4 pt-3 border-t border-[#bcd6fa]/30 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap gap-1.5">
                      {pod.requiredSkills?.map((sk) => (
                        <span key={sk} className="rounded-md border border-[#bcd6fa]/50 bg-canvas px-2 py-0.5 font-mono text-[10px] text-ink-soft">
                          {sk}
                        </span>
                      ))}
                    </div>

                    <Link
                      href="/candidate/applications"
                      className="inline-flex items-center gap-1 font-display text-xs font-semibold text-electric hover:underline"
                    >
                      <span>View Pipeline Details</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right 4 Cols: Live Schedule & Interactive Management Hub */}
        <div className="lg:col-span-4 space-y-6">
          {/* Upcoming Schedule */}
          <div className="rounded-3xl border border-[#bcd6fa] bg-white p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-electric" />
                <h3 className="font-display text-sm font-bold text-ink">Upcoming Interviews</h3>
              </div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-mist">Interviews</span>
            </div>

            {interviews.length === 0 ? (
              <div className="rounded-2xl border border-[#bcd6fa]/60 bg-canvas/40 p-6 text-center text-xs space-y-2">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-canvas text-mist">
                  <Clock size={20} />
                </div>
                <div className="font-display font-bold text-ink">No Scheduled Interviews</div>
                <p className="text-ink-soft text-[11px] leading-relaxed">
                  When a recruiter or client schedules a screening or technical interview, your meeting details and link will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {interviews.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-[#bcd6fa]/60 bg-canvas/40 p-4 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-display font-bold text-ink truncate pr-2">{item.role || item.podName}</span>
                      <span className="rounded-full bg-signal/10 px-2 py-0.5 text-[10px] font-mono font-bold text-signal shrink-0">
                        {item.status}
                      </span>
                    </div>
                    <div className="font-mono text-[11.5px] text-electric font-semibold">
                      {item.dateString} at {item.timeString}
                    </div>
                    <div className="text-ink-soft leading-snug">{item.type}</div>
                    <div className="text-[11px] text-mist">Interviewer: {item.interviewerName} ({item.interviewerTitle})</div>
                    <a
                      href={item.meetingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 block w-full rounded-xl bg-ink py-2 text-center font-display text-xs font-semibold text-white hover:bg-electric transition-colors shadow-2xs"
                    >
                      Join Video Meeting Room &rarr;
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Interactive Management Drawers Hub */}
          <div className="rounded-3xl border border-[#bcd6fa] bg-white p-5 sm:p-6 shadow-xs space-y-3">
            <h3 className="font-display text-sm font-bold text-ink">Profile &amp; Record Management</h3>
            
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setIsCredentialsDrawerOpen(true)}
                className="w-full text-left group flex items-center justify-between rounded-xl border border-[#bcd6fa]/60 bg-canvas/30 p-3 text-xs font-semibold text-ink hover:border-electric hover:bg-white transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-signal/10 text-signal">
                    <ShieldCheck size={16} />
                  </div>
                  <div>
                    <div className="font-display font-bold">Licenses &amp; Certifications</div>
                    <div className="text-[10.5px] text-mist">{credentials.length} credentials recorded</div>
                  </div>
                </div>
                <ArrowRight size={14} className="text-mist group-hover:text-signal transition-colors" />
              </button>

              <button
                type="button"
                onClick={() => setIsDocumentsDrawerOpen(true)}
                className="w-full text-left group flex items-center justify-between rounded-xl border border-[#bcd6fa]/60 bg-canvas/30 p-3 text-xs font-semibold text-ink hover:border-electric hover:bg-white transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-electric/10 text-electric">
                    <FileText size={16} />
                  </div>
                  <div>
                    <div className="font-display font-bold">CV Versions &amp; Uploads</div>
                    <div className="text-[10.5px] text-mist">{documents.length} documents on file</div>
                  </div>
                </div>
                <ArrowRight size={14} className="text-mist group-hover:text-electric transition-colors" />
              </button>

              <button
                type="button"
                onClick={() => setIsDataRightsDrawerOpen(true)}
                className="w-full text-left group flex items-center justify-between rounded-xl border border-[#bcd6fa]/60 bg-canvas/30 p-3 text-xs font-semibold text-ink hover:border-electric hover:bg-white transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                    <ShieldCheck size={16} />
                  </div>
                  <div>
                    <div className="font-display font-bold">Data Rights &amp; Privacy</div>
                    <div className="text-[10.5px] text-mist">GDPR export &amp; erasure controls</div>
                  </div>
                </div>
                <ArrowRight size={14} className="text-mist group-hover:text-indigo-600 transition-colors" />
              </button>

              <Link
                href="/referrals/dashboard"
                className="group flex items-center justify-between rounded-xl border border-[#bcd6fa]/60 bg-canvas/30 p-3 text-xs font-semibold text-ink hover:border-electric hover:bg-white transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-signal/10 text-signal">
                    <Users size={16} />
                  </div>
                  <div>
                    <div className="font-display font-bold">Referral Partner Portal</div>
                    <div className="text-[10.5px] text-mist">Up to $2,500 per placement</div>
                  </div>
                </div>
                <ArrowRight size={14} className="text-mist group-hover:text-signal transition-colors" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Slide-Over Drawers (UX Invariant: Right-Side Sheets) */}
      <CandidateProfileDrawer
        isOpen={isProfileDrawerOpen}
        onClose={() => setIsProfileDrawerOpen(false)}
      />

      <CandidateCredentialsDrawer
        isOpen={isCredentialsDrawerOpen}
        onClose={() => setIsCredentialsDrawerOpen(false)}
      />

      <CandidateDocumentsDrawer
        isOpen={isDocumentsDrawerOpen}
        onClose={() => setIsDocumentsDrawerOpen(false)}
      />

      <CandidateDataRightsDrawer
        isOpen={isDataRightsDrawerOpen}
        onClose={() => setIsDataRightsDrawerOpen(false)}
      />
    </div>
  );
}
