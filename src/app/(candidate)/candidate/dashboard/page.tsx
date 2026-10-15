"use client";

import { useEffect, useState } from "react";
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
} from "@/components/ui/Icons";
import {
  REVERSE_SEARCH_MATCHES,
  TALENT_BADGES,
} from "@/data/talentDashboardData";
import { useCandidatePersona } from "@/context/CandidatePersonaContext";

export default function CandidateDashboardPage() {
  const { activePersona, currentProfile, pipelines, interviews } = useCandidatePersona();
  const [activeTab, setActiveTab] = useState<"all" | "tech" | "health">("all");

  // Synchronize sector filter tab with active persona
  useEffect(() => {
    if (activePersona === "alex") {
      setActiveTab("tech");
    } else {
      setActiveTab("health");
    }
  }, [activePersona]);

  const filteredPipelines = pipelines.filter((pod) => {
    if (activeTab === "tech") return pod.sector === "Technology";
    if (activeTab === "health") return pod.sector === "Healthcare";
    return true;
  });

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Top Welcome & Velocity Status */}
      <div className="relative overflow-hidden rounded-3xl border border-electric/30 bg-gradient-to-r from-ink via-[#0d1f3d] to-ink p-6 sm:p-8 text-white shadow-md">
        <div className="relative z-10 flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-electric/40 bg-electric/20 px-3 py-0.5 text-[11px] font-mono text-electric-bright">
              <span className="h-2 w-2 rounded-full bg-signal animate-pulse" />
              <span>SPRINT STATUS: {currentProfile.vettingTier.toUpperCase()}</span>
            </div>
            <h1 className="mt-2.5 font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
              Welcome back, {currentProfile.fullName}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-gray-300 max-w-xl leading-relaxed">
              {activePersona === "alex"
                ? "Shortlisted for 3 active enterprise pods with guaranteed live timezone overlap and 7-day deployment sprint velocity."
                : "Shortlisted for NHS Band 8 clinical rotas and acute ICU tele-health deployment squads."}
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap gap-2.5">
            <Link
              href="/candidate/applications"
              className="inline-flex items-center gap-2 justify-center rounded-xl bg-electric px-4.5 py-2.5 font-display text-xs sm:text-sm font-semibold text-white shadow-xs transition-all hover:bg-electric-bright"
            >
              <span>View Sprint Pipelines</span>
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/candidate/reverse-search"
              className="inline-flex items-center gap-2 justify-center rounded-xl border border-white/25 bg-white/10 px-4 py-2.5 font-display text-xs sm:text-sm font-semibold text-white backdrop-blur-xs transition-all hover:bg-white/20"
            >
              <Compass size={14} />
              <span>Reverse Search ({REVERSE_SEARCH_MATCHES.length})</span>
            </Link>
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

      {/* Metrics & Telemetry Row (SRS FR-052 to FR-055) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Profile Readiness */}
        <div className="rounded-2xl border border-[#bcd6fa] bg-white p-5 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-mist uppercase tracking-wider">Readiness Index</div>
            <div className="mt-1 font-display text-2xl sm:text-3xl font-bold text-ink">
              {currentProfile.readinessIndex}%
            </div>
            <div className="mt-1 text-[11px] text-signal font-semibold">Priority Match Ready</div>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-electric/10 text-electric border border-electric/25 shadow-2xs">
            <Activity size={24} />
          </div>
        </div>

        {/* ATS Compatibility */}
        <div className="rounded-2xl border border-[#bcd6fa] bg-white p-5 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-mist uppercase tracking-wider">ATS Compatibility</div>
            <div className="mt-1 font-display text-2xl sm:text-3xl font-bold text-ink">
              {currentProfile.atsCompatibilityScore}%
            </div>
            <div className="mt-1 text-[11px] text-ink-soft font-medium">Top 2% in {currentProfile.skills[0]}</div>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-signal/10 text-signal border border-signal/25 shadow-2xs">
            <CheckCircle size={24} />
          </div>
        </div>

        {/* Hard-Coded Technical / Clinical Vetting */}
        <div className="rounded-2xl border border-[#bcd6fa] bg-white p-5 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-mist uppercase tracking-wider">
              {activePersona === "alex" ? "Technical Vetting" : "Clinical Vetting"}
            </div>
            <div className="mt-1 font-display text-2xl sm:text-3xl font-bold text-ink">
              {currentProfile.technicalVettingScore} <span className="text-sm text-mist font-normal">/ 100</span>
            </div>
            <div className="mt-1 text-[11px] text-ink-soft font-medium">
              {activePersona === "alex" ? "Validated by Pod Leads" : "Validated by NHS Assessors"}
            </div>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-electric/10 text-electric border border-electric/25 shadow-2xs">
            <Zap size={24} />
          </div>
        </div>

        {/* Vetting Tier & Rate */}
        <div className="rounded-2xl border border-[#bcd6fa] bg-white p-5 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-mist uppercase tracking-wider">Target Rate Bracket</div>
            <div className="mt-1 font-display text-xl sm:text-2xl font-bold text-ink">
              {currentProfile.desiredHourlyRate}
            </div>
            <div className="mt-1 text-[11px] text-signal font-semibold">Tier 1 Rate Unlocked</div>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-signal/10 text-signal border border-signal/25 shadow-2xs">
            <ShieldCheck size={24} />
          </div>
        </div>
      </div>

      {/* Main Split: Active Pod Applications & Right Intelligence Panel */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
        {/* Left 8 Cols: Active Pod Applications */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-lg font-bold text-ink">Sprint Application Pipelines</h2>
              <p className="text-xs text-ink-soft">Live progress across candidate vetting and client introduction stages.</p>
            </div>

            {/* Quick Sector Filter */}
            <div className="flex items-center gap-1 rounded-xl border border-[#bcd6fa] bg-white p-1 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab("all")}
                className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === "all" ? "bg-ink text-white shadow-xs" : "text-ink-soft hover:text-ink"
                }`}
              >
                All ({pipelines.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("tech")}
                className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === "tech" ? "bg-ink text-white shadow-xs" : "text-ink-soft hover:text-ink"
                }`}
              >
                Tech
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("health")}
                className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === "health" ? "bg-ink text-white shadow-xs" : "text-ink-soft hover:text-ink"
                }`}
              >
                Health
              </button>
            </div>
          </div>

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
                      <span className="rounded-full bg-signal/10 px-2.5 py-0.5 font-mono text-[10px] font-bold text-signal">
                        {pod.tag}
                      </span>
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

                {/* 5-Stage Stepper (SRS FR-052) */}
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
                    {pod.requiredSkills.map((sk) => (
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
        </div>

        {/* Right 4 Cols: Live Schedule & Fast Navigation */}
        <div className="lg:col-span-4 space-y-6">
          {/* Upcoming Schedule */}
          <div className="rounded-3xl border border-[#bcd6fa] bg-white p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-electric" />
                <h3 className="font-display text-sm font-bold text-ink">Upcoming Sprints & Calls</h3>
              </div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-mist">Live Schedule</span>
            </div>

            <div className="space-y-3">
              {interviews.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-[#bcd6fa]/60 bg-canvas/40 p-4 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display font-bold text-ink truncate pr-2">{item.podName}</span>
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
                    Join Video Pod Room →
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Ecosystem Hub Links */}
          <div className="rounded-3xl border border-[#bcd6fa] bg-white p-5 sm:p-6 shadow-xs space-y-3">
            <h3 className="font-display text-sm font-bold text-ink">Talent Ecosystem Fast Access</h3>
            
            <div className="space-y-2">
              <Link
                href="/candidate/resume-upload"
                className="group flex items-center justify-between rounded-xl border border-[#bcd6fa]/60 bg-canvas/30 p-3 text-xs font-semibold text-ink hover:border-electric hover:bg-white transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-electric/10 text-electric">
                    <FileText size={16} />
                  </div>
                  <div>
                    <div className="font-display font-bold">AI Resume Parser</div>
                    <div className="text-[10.5px] text-mist">Update credentials & skills</div>
                  </div>
                </div>
                <ArrowRight size={14} className="text-mist group-hover:text-electric transition-colors" />
              </Link>

              <Link
                href="/candidate/academy"
                className="group flex items-center justify-between rounded-xl border border-[#bcd6fa]/60 bg-canvas/30 p-3 text-xs font-semibold text-ink hover:border-electric hover:bg-white transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-electric/10 text-electric">
                    <Award size={16} />
                  </div>
                  <div>
                    <div className="font-display font-bold">Talent Academy</div>
                    <div className="text-[10.5px] text-mist">Unlock Tier 1 billing badges</div>
                  </div>
                </div>
                <ArrowRight size={14} className="text-mist group-hover:text-electric transition-colors" />
              </Link>

              <Link
                href="/candidate/referrals"
                className="group flex items-center justify-between rounded-xl border border-[#bcd6fa]/60 bg-canvas/30 p-3 text-xs font-semibold text-ink hover:border-electric hover:bg-white transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-signal/10 text-signal">
                    <Users size={16} />
                  </div>
                  <div>
                    <div className="font-display font-bold">Refer & Earn Bounty</div>
                    <div className="text-[10.5px] text-mist">$500 per placement</div>
                  </div>
                </div>
                <ArrowRight size={14} className="text-mist group-hover:text-signal transition-colors" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
