"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatedChevrons } from "@/components/ui/AnimatedChevrons";

/* ========================================================================= */
/* 1. Live UI Micro-Mockups matching Target Design (Image 2)                 */
/* ========================================================================= */

/** Card 01: Resume Intake Dual-Panel Mockup */
function ResumeIntakeGraphic() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 h-full w-full p-2.5">
      {/* Left Panel: Uploaded Resume Card */}
      <div className="flex flex-col justify-between rounded-xl border border-[#bcd6fa]/50 bg-white/95 p-3 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-electric/10 text-electric">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <line x1="10" y1="9" x2="8" y2="9" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-display text-[12px] font-bold text-[#0a1428] truncate">Resume.pdf</div>
            <div className="text-[10px] text-[#6b7a95]">2.4 MB</div>
          </div>
        </div>

        <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold text-emerald-600 border border-emerald-500/20 w-fit">
          <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Parsed Successfully
        </div>
      </div>

      {/* Right Panel: Structured Parsed Profile */}
      <div className="flex flex-col justify-between rounded-xl border border-[#bcd6fa]/50 bg-white/95 p-3 shadow-xs">
        <div className="flex items-center justify-between border-b border-[#bcd6fa]/30 pb-1.5">
          <span className="font-display text-[11px] font-bold text-[#0a1428]">Parsed Profile</span>
          <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 font-mono text-[8.5px] font-bold text-emerald-600 border border-emerald-500/20">
            ✦ ATS Ready
          </span>
        </div>

        <div className="space-y-1.5 py-1">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-[#6b7a95] flex items-center gap-1">
              <svg className="h-3 w-3 text-electric" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 1 0-16 0"/></svg>
              Role Target
            </span>
            <span className="font-semibold text-[#0a1428]">Full Stack Developer</span>
          </div>
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-[#6b7a95] flex items-center gap-1">
              <svg className="h-3 w-3 text-electric" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
              Tech Stack
            </span>
            <span className="font-semibold text-[#0a1428]">React, Node.js, AWS...</span>
          </div>
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-[#6b7a95] flex items-center gap-1">
              <svg className="h-3 w-3 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
              ATS Compatibility
            </span>
            <span className="font-bold text-emerald-600">98%</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-emerald-500/15">
          <div className="h-full rounded-full bg-emerald-500" style={{ width: "98%" }} />
        </div>
      </div>
    </div>
  );
}

/** Card 02: Reverse Search Dual-Panel Mockup */
function ReverseSearchGraphic() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 h-full w-full p-2.5">
      {/* Left Panel: Skills & Metrics */}
      <div className="flex flex-col justify-between rounded-xl border border-[#bcd6fa]/50 bg-white/95 p-3 shadow-xs">
        <div>
          <div className="font-display text-[11px] font-bold text-[#0a1428] mb-1.5">Your Skills</div>
          <div className="flex flex-wrap gap-1">
            {["React", "Node.js", "AWS", "TypeScript"].map((skill) => (
              <span key={skill} className="rounded-md border border-sky-200 bg-sky-50 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-sky-700">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-2 pt-2 border-t border-[#bcd6fa]/30 grid grid-cols-3 gap-1 text-center">
          <div>
            <div className="font-display text-[11.5px] font-extrabold text-[#0a1428]">+1,200 ↗</div>
            <div className="text-[8px] text-[#6b7a95] leading-tight">Live Pipelines</div>
          </div>
          <div>
            <div className="font-display text-[11.5px] font-extrabold text-purple-600">92%</div>
            <div className="text-[8px] text-[#6b7a95] leading-tight">Best Match</div>
          </div>
          <div>
            <div className="font-display text-[11.5px] font-extrabold text-electric">78 ↗</div>
            <div className="text-[8px] text-[#6b7a95] leading-tight">Opportunities</div>
          </div>
        </div>
      </div>

      {/* Right Panel: Role Match Cards List */}
      <div className="flex flex-col justify-between rounded-xl border border-[#bcd6fa]/50 bg-white/95 p-2.5 shadow-xs space-y-1.5">
        {[
          { title: "Senior Frontend Engineer", match: "95% Match", color: "text-emerald-600" },
          { title: "Full Stack Developer", match: "88% Match", color: "text-purple-600" },
          { title: "Backend Engineer", match: "82% Match", color: "text-electric" },
        ].map((job) => (
          <div key={job.title} className="flex items-center justify-between rounded-lg border border-[#bcd6fa]/35 bg-[#f8fbff] px-2 py-1.5 transition-all hover:bg-white hover:shadow-2xs">
            <div className="flex items-center gap-1.5 min-w-0">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-purple-500/10 text-purple-600">
                <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
              </div>
              <span className="font-display text-[10px] font-bold text-[#0a1428] truncate">{job.title}</span>
            </div>
            <span className={`font-mono text-[9px] font-bold ${job.color} shrink-0 ml-1.5`}>{job.match} &gt;</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Card 03: Talent Academy Dual-Panel Mockup */
function TalentAcademyGraphic() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 h-full w-full p-2.5">
      {/* Left Panel: Assessment Card (Dark Teal Gradient) */}
      <div className="flex flex-col justify-between rounded-xl border border-teal-500/30 bg-gradient-to-br from-[#022c2b] via-[#064e3b] to-[#042f2e] p-3 shadow-xs text-white">
        <div className="flex items-center justify-between">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/20 text-teal-300 ring-1 ring-teal-400/30">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
          </div>
          <span className="rounded bg-emerald-400/20 px-1.5 py-0.5 font-mono text-[8.5px] font-bold text-emerald-300 border border-emerald-400/30">
            ✓ PASS
          </span>
        </div>

        <div>
          <div className="font-display text-[13px] font-bold text-white">System Design</div>
          <div className="text-[9.5px] text-teal-200/80">Enterprise Vetting Diagnostic</div>
        </div>
      </div>

      {/* Right Panel: Skills Diagnostic Checklist with Radial Score */}
      <div className="flex items-center gap-3 rounded-xl border border-[#bcd6fa]/50 bg-white/95 p-3 shadow-xs">
        {/* Radial Score Gauge */}
        <div className="relative flex h-14 w-14 shrink-0 items-center justify-center">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-teal-100"
              strokeWidth="3.5"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-teal-600"
              strokeDasharray="85, 100"
              strokeWidth="3.5"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute text-center">
            <span className="font-display text-[12px] font-extrabold text-[#0a1428]">85%</span>
          </div>
        </div>

        {/* Diagnostic Checks */}
        <div className="min-w-0 flex-1 space-y-1">
          <div className="font-display text-[10.5px] font-bold text-[#0a1428] mb-0.5">Skills Diagnostic</div>
          {[
            "Technical Readiness",
            "System Design Pass",
            "Tier 1 Unlocked",
          ].map((check) => (
            <div key={check} className="flex items-center gap-1.5 text-[9.5px] text-[#3d4c68]">
              <svg className="h-3 w-3 text-teal-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              <span className="truncate">{check}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Card 04: Referral Bounty Dual-Panel Mockup */
function ReferralBountyGraphic() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 h-full w-full p-2.5">
      {/* Left Panel: Bounty Payout Ledger */}
      <div className="flex flex-col justify-between rounded-xl border border-[#bcd6fa]/50 bg-white/95 p-3 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
          </div>
          <span className="font-display text-[10.5px] font-bold text-[#0a1428]">Bounty Payout Ledger</span>
        </div>

        <div className="my-1">
          <div className="flex items-center gap-2">
            <span className="font-display text-lg sm:text-xl font-extrabold text-[#0a1428]">$500.00</span>
            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 font-mono text-[8.5px] font-bold text-emerald-600 border border-emerald-500/20">
              ✓ Confirmed
            </span>
          </div>
          <div className="text-[9px] text-[#6b7a95] mt-0.5">Payout #RB-2457 • Apr 28, 2025</div>
        </div>
      </div>

      {/* Right Panel: Referral Activity Feed */}
      <div className="flex flex-col justify-between rounded-xl border border-[#bcd6fa]/50 bg-white/95 p-2.5 shadow-xs space-y-1">
        <div className="font-display text-[10px] font-bold text-[#0a1428] mb-0.5">Referral Activity</div>
        {[
          { name: "Devon Carter", reward: "+$250.00", color: "bg-blue-100 text-blue-700" },
          { name: "Sarah Kim", reward: "+$150.00", color: "bg-purple-100 text-purple-700" },
          { name: "Ali Raza", reward: "+$100.00", color: "bg-teal-100 text-teal-700" },
        ].map((item) => (
          <div key={item.name} className="flex items-center justify-between text-[9.5px] py-0.5 border-b border-[#bcd6fa]/25 last:border-none">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className={`flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full font-bold text-[8px] ${item.color}`}>
                {item.name[0]}
              </span>
              <span className="font-medium text-[#0a1428] truncate">{item.name}</span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="font-mono font-bold text-emerald-600">{item.reward}</span>
              <span className="text-[8px] text-[#6b7a95]">Confirmed</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ========================================================================= */
/* 2. Stages Data Definition                                                 */
/* ========================================================================= */

interface Stage {
  n: string;
  badge: string;
  rightBadge: string;
  title: string;
  description: string;
  route: string;
  accent: string;
  accent2: string;
  renderGraphic: () => React.ReactNode;
}

const STAGES: Stage[] = [
  {
    n: "01",
    badge: "RESUME INTAKE",
    rightBadge: "✦ AI POWERED",
    title: "AI Resume Intake & Parsing",
    description: "Upload your resume and let AI extract key details, structure your profile, and match it with enterprise ATS requirements.",
    route: "/talent/intake",
    accent: "#0a84ff",
    accent2: "#38bdf8",
    renderGraphic: () => <ResumeIntakeGraphic />,
  },
  {
    n: "02",
    badge: "REVERSE SEARCH",
    rightBadge: "• LIVE",
    title: "Reverse Job Search Engine",
    description: "Discover the right opportunities from real client pipelines. Get matched with roles that fit your skills, experience and preferences.",
    route: "/talent/pipeline",
    accent: "#8b5cf6",
    accent2: "#a78bfa",
    renderGraphic: () => <ReverseSearchGraphic />,
  },
  {
    n: "03",
    badge: "TALENT ACADEMY",
    rightBadge: "✦ SKILLS • CAREER",
    title: "Talent Academy & Technical Vetting",
    description: "Build your skills with expert-led learning paths and get vetted through real-world assessments to earn enterprise-ready credentials.",
    route: "/talent/academy",
    accent: "#0d9488",
    accent2: "#2dd4bf",
    renderGraphic: () => <TalentAcademyGraphic />,
  },
  {
    n: "04",
    badge: "REFERRAL BOUNTY",
    rightBadge: "✦ EARN",
    title: "Referral Bounty Network",
    description: "Refer top talent and get rewarded. Track your referrals, confirm payouts, and grow your earnings with our transparent bounty system.",
    route: "/talent/bounty",
    accent: "#6366f1",
    accent2: "#818cf8",
    renderGraphic: () => <ReferralBountyGraphic />,
  },
];

/* ========================================================================= */
/* 3. Individual Ecosystem Card Component                                    */
/* ========================================================================= */

function EcosystemCard({ stage, index }: { stage: Stage; index: number }) {
  return (
    <Link
      href={stage.route}
      className="cursor-target group relative flex flex-col justify-between w-full overflow-hidden rounded-2xl border border-[#bcd6fa]/80 bg-white/95 p-4 sm:p-5 shadow-[0_10px_28px_-16px_rgba(10,132,255,0.16)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-electric hover:shadow-[0_20px_45px_-12px_rgba(10,132,255,0.25)]"
      style={
        {
          "--ac": stage.accent,
          "--ac2": stage.accent2,
        } as CSSProperties
      }
    >
      {/* Top Header inside Card */}
      <div className="relative z-10 flex items-center justify-between gap-2 border-b border-[#bcd6fa]/40 pb-2.5">
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-xs font-bold text-electric">
            {stage.n}
          </span>
          <span
            className="inline-flex items-center rounded-md px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider"
            style={{ background: `${stage.accent}14`, color: stage.accent, border: `1px solid ${stage.accent}28` }}
          >
            {stage.badge}
          </span>
        </div>
        <span
          className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider"
          style={{
            background: stage.n === "02" ? "rgba(16,185,129,0.1)" : `${stage.accent}12`,
            color: stage.n === "02" ? "#059669" : stage.accent,
            border: stage.n === "02" ? "1px solid rgba(16,185,129,0.25)" : `1px solid ${stage.accent}25`,
          }}
        >
          {stage.rightBadge}
        </span>
      </div>

      {/* Title & Description inside Card */}
      <div className="relative z-10 mt-2.5">
        <h3 className="font-display text-[15px] sm:text-[16px] font-bold text-[#0a1428] leading-snug transition-colors duration-200 group-hover:text-[var(--ac)]">
          {stage.title}
        </h3>
        <p className="mt-1 text-[11px] sm:text-[11.5px] leading-relaxed text-[#4b5b78]">
          {stage.description}
        </p>
      </div>

      {/* Middle: Embedded Live UI Micro-Mockup Window */}
      <div className="relative z-10 mt-3 h-[135px] w-full overflow-hidden rounded-xl border border-[#bcd6fa]/50 bg-gradient-to-b from-[#f9fbfe] to-[#edf4fc] shadow-inner">
        {stage.renderGraphic()}
      </div>
    </Link>
  );
}

/* ========================================================================= */
/* 4. Main Section Component with 3D Globe & 4 Orbital Action Nodes          */
/* ========================================================================= */

export interface TalentEcosystemContent {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
}

export default function TalentEcosystem({ content }: { content?: TalentEcosystemContent } = {}) {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const eyebrow = content?.eyebrow ?? "The Global Talent Ecosystem";
  const title = content?.title ?? "The Global Talent Ecosystem";
  const subtitle = content?.subtitle ?? "Upload your resume, leverage AI to build an ATS-ready profile, and let enterprise opportunities find you.";

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="talent-ecosystem"
      className="relative w-full overflow-hidden bg-canvas-alt border-y border-[#bcd6fa]/35 px-4 py-14 sm:px-6 sm:py-18 lg:px-8 lg:py-20"
    >
      {/* Ambient background lighting */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(10,132,255,0.1),transparent_65%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:linear-gradient(rgba(188,214,250,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(188,214,250,0.18)_1px,transparent_1px)] [background-size:48px_48px]" />

      <div className="relative mx-auto max-w-[1240px]">
        {/* Section Header matching Image 2 */}
        <div
          className={`mx-auto flex max-w-3xl flex-col items-center text-center transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-electric/25 bg-electric/[0.08] px-4 py-1 font-mono text-[10.5px] font-semibold tracking-[0.16em] uppercase text-electric shadow-sm backdrop-blur-sm">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-electric shadow-[0_0_6px_rgba(10,132,255,0.6)]" />
            {eyebrow}
          </div>
          <h2 className="mt-3 font-display text-2xl font-extrabold tracking-tight text-[#0a1428] sm:text-3xl lg:text-[36px] leading-[1.15]">
            {title}
          </h2>
          <p className="mt-2.5 max-w-[62ch] text-xs sm:text-[14px] leading-relaxed text-[#4b5b78]">
            {subtitle}
          </p>
        </div>

        {/* ==================== DESKTOP VIEW (>= lg) ==================== */}
        <div className="relative mx-auto mt-12 hidden lg:block">
          {/* 2x2 Grid with wide gap for central globe and conduits */}
          <div className="grid grid-cols-2 gap-x-64 xl:gap-x-72 gap-y-12">
            <EcosystemCard stage={STAGES[0]} index={0} />
            <EcosystemCard stage={STAGES[1]} index={1} />
            <EcosystemCard stage={STAGES[2]} index={2} />
            <EcosystemCard stage={STAGES[3]} index={3} />
          </div>

          {/* Central 3D Digital Globe & 4 Orbital Action Nodes System */}
          <div
            className={`pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 transition-all duration-700 ease-out ${
              isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
            }`}
            style={{ width: "420px", height: "420px" }}
          >
            {/* SVG Laser Conduit Tracks Connecting 4 Nodes directly to Card Corners */}
            <svg viewBox="0 0 420 420" className="absolute inset-0 h-full w-full overflow-visible" fill="none">
              <defs>
                {/* Flow gradients */}
                <linearGradient id="nexus-tl" x1="150" y1="150" x2="30" y2="40" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#0a84ff" />
                  <stop offset="100%" stopColor="#38bdf8" />
                </linearGradient>
                <linearGradient id="nexus-tr" x1="270" y1="150" x2="390" y2="40" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#a78bfa" />
                </linearGradient>
                <linearGradient id="nexus-bl" x1="150" y1="270" x2="30" y2="380" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#0d9488" />
                  <stop offset="100%" stopColor="#2dd4bf" />
                </linearGradient>
                <linearGradient id="nexus-br" x1="270" y1="270" x2="390" y2="380" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#34d399" />
                </linearGradient>
              </defs>

              {/* Large Dashed Circular Orbit Track passing through the 4 nodes */}
              <circle
                cx="210"
                cy="210"
                r="110"
                stroke="#38bdf8"
                strokeWidth="1.2"
                strokeDasharray="4 6"
                opacity="0.55"
                className="animate-[spin_60s_linear_infinite]"
                style={{ transformOrigin: "210px 210px" }}
              />

              {/* Conduit 1: Upload (Top-Left 115, 115) -> Card 1 Bottom-Right (-15, 15) */}
              <line x1="132" y1="132" x2="-20" y2="20" stroke="url(#nexus-tl)" strokeWidth="1.8" strokeDasharray="3 4" className="te-flow-fast" />
              <circle cx="-20" cy="20" r="3.5" fill="#0a84ff" />

              {/* Conduit 2: Discover (Top-Right 305, 115) -> Card 2 Bottom-Left (440, 20) */}
              <line x1="288" y1="132" x2="440" y2="20" stroke="url(#nexus-tr)" strokeWidth="1.8" strokeDasharray="3 4" className="te-flow-fast" />
              <circle cx="440" cy="20" r="3.5" fill="#8b5cf6" />

              {/* Conduit 3: Refer (Bottom-Left 115, 305) -> Card 3 Top-Right (-20, 400) */}
              <line x1="132" y1="288" x2="-20" y2="400" stroke="url(#nexus-bl)" strokeWidth="1.8" strokeDasharray="3 4" className="te-flow-fast" />
              <circle cx="-20" cy="400" r="3.5" fill="#0d9488" />

              {/* Conduit 4: Upskill (Bottom-Right 305, 305) -> Card 4 Top-Left (440, 400) */}
              <line x1="288" y1="288" x2="440" y2="400" stroke="url(#nexus-br)" strokeWidth="1.8" strokeDasharray="3 4" className="te-flow-fast" />
              <circle cx="440" cy="400" r="3.5" fill="#10b981" />
            </svg>

            {/* Central 3D Glowing Globe */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center">
              {/* Globe Wrapper with Glowing Ambient Aura */}
              <div className="relative flex h-[190px] w-[190px] xl:h-[205px] xl:w-[205px] items-center justify-center">
                {/* Radial cyan glow backdrop */}
                <div className="pointer-events-none absolute inset-[-18px] rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.45)_0%,rgba(10,132,255,0.18)_50%,transparent_75%)] blur-md" />

                {/* 3D Digital Globe Image */}
                <Image
                  src="/icons/globe.png"
                  alt="Global Talent Network"
                  width={205}
                  height={205}
                  className="relative z-10 h-full w-full object-contain drop-shadow-[0_0_24px_rgba(56,189,248,0.6)] select-none"
                  priority
                />

                {/* Central Pepoltek Hexagon Logo Emblem Core */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-[0_0_18px_rgba(56,189,248,0.8)] border border-sky-300 p-2">
                  <Image
                    src="/assets/pepoltek/pepoltek_icon.png"
                    alt="Pepoltek Icon"
                    width={26}
                    height={26}
                    className="h-auto w-auto object-contain"
                  />
                </div>
              </div>


            </div>

            {/* 4 Orbital Action Nodes situated snug along the Dashed Orbit Circle (Cleanly Clear of Cards) */}
            {/* Node 1: Upload (Top-Left: 132, 132) */}
            <div className="absolute top-[132px] left-[132px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-auto">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0a84ff] text-white shadow-[0_3px_12px_rgba(10,132,255,0.45)] border-2 border-white transition-transform hover:scale-110">
                <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </div>
              <span className="font-display text-[10.5px] font-bold text-[#0a1428] mt-0.5 select-none">
                Upload
              </span>
            </div>

            {/* Node 2: Discover (Top-Right: 288, 132) */}
            <div className="absolute top-[132px] left-[288px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-auto">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#8b5cf6] text-white shadow-[0_3px_12px_rgba(139,92,246,0.45)] border-2 border-white transition-transform hover:scale-110">
                <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
              <span className="font-display text-[10.5px] font-bold text-[#0a1428] mt-0.5 select-none">
                Discover
              </span>
            </div>

            {/* Node 3: Refer (Bottom-Left: 132, 288) */}
            <div className="absolute top-[288px] left-[132px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-auto">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0d9488] text-white shadow-[0_3px_12px_rgba(13,148,136,0.45)] border-2 border-white transition-transform hover:scale-110">
                <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <span className="font-display text-[10.5px] font-bold text-[#0a1428] mt-0.5 select-none">
                Refer
              </span>
            </div>

            {/* Node 4: Upskill (Bottom-Right: 288, 288) */}
            <div className="absolute top-[288px] left-[288px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-auto">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#10b981] text-white shadow-[0_3px_12px_rgba(16,185,129,0.45)] border-2 border-white transition-transform hover:scale-110">
                <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                  <path d="M6 12v5c3 3 9 3 12 0v-5" />
                </svg>
              </div>
              <span className="font-display text-[10.5px] font-bold text-[#0a1428] mt-0.5 select-none">
                Upskill
              </span>
            </div>
          </div>
        </div>

        {/* ==================== MOBILE / TABLET VIEW (< lg) ==================== */}
        <div className="relative mx-auto mt-10 flex flex-col gap-6 lg:hidden">
          {/* Compact Mobile Globe Header */}
          <div className="flex flex-col items-center justify-center py-2">
            <div className="relative flex h-[140px] w-[140px] items-center justify-center">
              <Image
                src="/icons/globe.png"
                alt="Global Talent Network"
                width={140}
                height={140}
                className="object-contain drop-shadow-[0_0_16px_rgba(56,189,248,0.5)] select-none"
              />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-md border border-sky-300 p-1.5">
                <Image
                  src="/assets/pepoltek/pepoltek_icon.png"
                  alt="Pepoltek Icon"
                  width={22}
                  height={22}
                  className="object-contain"
                />
              </div>
            </div>
            <div className="font-display text-sm font-bold text-[#0a1428] mt-1">
              Global Talent Ecosystem
            </div>
          </div>

          {/* 4 Feature Cards stacked */}
          {STAGES.map((stage, idx) => (
            <EcosystemCard key={stage.n} stage={stage} index={idx} />
          ))}
        </div>

        {/* Bottom Dual Action Buttons matching Screenshot 5 */}
        <div className="mt-12 sm:mt-14 flex flex-wrap items-center justify-center gap-3.5">
          <Link
            href="/talent/intake"
            className="group inline-flex items-center justify-center gap-2.5 rounded-xl bg-[#0a1428] px-6 py-3 font-display text-sm font-bold text-white shadow-[0_8px_20px_-4px_rgba(10,20,40,0.45)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-electric hover:shadow-[0_12px_28px_-6px_rgba(10,132,255,0.5)] cursor-pointer"
          >
            <span>Upload CV &amp; Parse Profile</span>
            <AnimatedChevrons size={13} count={3} />
          </Link>

          <Link
            href="/talent/pipeline"
            className="inline-flex items-center gap-2 rounded-xl border border-[#bcd6fa] bg-white px-5 py-3 font-display text-sm font-semibold text-ink transition-all duration-200 hover:-translate-y-0.5 hover:border-electric/50 hover:text-electric cursor-pointer"
          >
            Explore Live Pipelines
          </Link>
        </div>
      </div>

      {/* Scoped CSS animations */}
      <style>{`
        @keyframes teFlowFast {
          to { stroke-dashoffset: -16; }
        }
        .te-flow-fast {
          animation: teFlowFast 1.2s linear infinite;
        }
      `}</style>
    </section>
  );
}
