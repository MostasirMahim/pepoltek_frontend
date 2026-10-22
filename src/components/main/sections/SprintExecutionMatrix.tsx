"use client";

import React, { useState, useEffect, useRef } from "react";
import CardCornerShapes from "@/components/ui/CardCornerShapes";

/* ---------- in-view hook ---------- */
function useInView<T extends HTMLElement>(once = true) {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          if (once) io.disconnect();
        } else if (!once) setSeen(false);
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once]);
  return { ref, seen };
}

/* ---------- step icon SVGs ---------- */
function IconDiscovery() {
  return (
    <svg viewBox="0 0 40 40" fill="none" className="h-full w-full">
      <circle cx="17" cy="17" r="10" stroke="currentColor" strokeWidth="2.2" />
      <path d="M24.5 24.5L32 32" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M14 14l3 3 5-6" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconMapping() {
  return (
    <svg viewBox="0 0 40 40" fill="none" className="h-full w-full">
      <circle cx="20" cy="20" r="13" stroke="currentColor" strokeWidth="1.6" strokeDasharray="2 3" />
      <circle cx="20" cy="20" r="6" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="20" cy="20" r="2" fill="#38bdf8" />
      <circle cx="20" cy="7" r="2.5" fill="currentColor" />
      <circle cx="31" cy="25" r="2.5" fill="#38bdf8" />
      <circle cx="9" cy="25" r="2.5" fill="currentColor" />
    </svg>
  );
}
function IconVetting() {
  return (
    <svg viewBox="0 0 40 40" fill="none" className="h-full w-full">
      <path d="M20 5c-8-5-18-2-18 6 0 14 12 20 18 24 6-4 18-10 18-24 0-8-10-11-18-6z" stroke="currentColor" strokeWidth="2" />
      <path d="M14 20l4 4 8-10" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconOrchestration() {
  return (
    <svg viewBox="0 0 40 40" fill="none" className="h-full w-full">
      <rect x="4" y="8" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <rect x="22" y="8" width="14" height="12" rx="2" stroke="#38bdf8" strokeWidth="1.8" />
      <path d="M18 14h4" stroke="currentColor" strokeWidth="1.5" strokeDasharray="1.5 1.5" />
      <rect x="10" y="26" width="20" height="8" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="20" cy="30" r="2" fill="#38bdf8" />
    </svg>
  );
}
function IconDeploy() {
  return (
    <svg viewBox="0 0 40 40" fill="none" className="h-full w-full">
      <path d="M8 28l6-8 5 4 6-10 7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="8" cy="28" r="2.5" fill="currentColor" />
      <circle cx="32" cy="22" r="2.5" fill="#38bdf8" />
      <path d="M28 10l4-4 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M32 6v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

const ICONS = [IconDiscovery, IconMapping, IconVetting, IconOrchestration, IconDeploy];

/* ---------- step data ---------- */
interface MatrixStep {
  num: string;
  days: string;
  title: string;
  sub: string;
  sla: string;
  deliverables: string[];
  accent: string;
  accentBg: string;
}

const STEPS: MatrixStep[] = [
  {
    num: "01", days: "Day 1", title: "Discovery & Alignment",
    sub: "Technical stack mapping and role scoping", sla: "< 12h Turnaround",
    deliverables: ["Role Taxonomy Spec", "Search Strategy", "Profile Matrix"],
    accent: "#0a84ff", accentBg: "rgba(10,132,255,0.06)",
  },
  {
    num: "02", days: "Days 2 to 3", title: "AI Market Mapping",
    sub: "Boolean and X-Ray talent intelligence", sla: "50+ Curated Profiles",
    deliverables: ["ATS Tracking Sheet", "Pipeline Report", "TZ Verification"],
    accent: "#0a84ff", accentBg: "rgba(10,132,255,0.06)",
  },
  {
    num: "03", days: "Days 4 to 5", title: "Hard-Coded Vetting",
    sub: "AI video screening and code audits", sla: "Top 3.4% Pass Rate",
    deliverables: ["Evaluation Scorecards", "Code Audit Logs", "Behavioral Ratings"],
    accent: "#0a84ff", accentBg: "rgba(10,132,255,0.06)",
  },
  {
    num: "04", days: "Days 6 to 7", title: "Panel Orchestration",
    sub: "Interview coordination and briefings", sla: "< 4h Feedback SLA",
    deliverables: ["Scheduling Deck", "Candidate Dossiers", "Feedback Matrix"],
    accent: "#0a84ff", accentBg: "rgba(10,132,255,0.06)",
  },
  {
    num: "05", days: "Post-Sprint", title: "Deploy & Onboard",
    sub: "Contracts, setup, and 30/60/90 ramp", sla: "90-Day Guarantee",
    deliverables: ["Service Agreements", "Onboarding SOPs", "Milestone Reviews"],
    accent: "#0a84ff", accentBg: "rgba(10,132,255,0.06)",
  },
];

/* comet cycle duration in ms (must match CSS animation) */
const CYCLE_MS = 14000;
/* fraction of cycle when comet hits each box center (box 0 at rail start, box 4 at rail end) */
const HIT_FRACS = [0.07, 0.30, 0.53, 0.76, 0.97];

export interface SprintExecutionMatrixContent {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  steps?: Array<{
    num: string;
    days: string;
    title: string;
    sub: string;
    sla: string;
    deliverables: string[];
  }>;
}

export default function SprintExecutionMatrix({ content }: { content?: SprintExecutionMatrixContent } = {}) {
  const { ref: sectionRef, seen } = useInView<HTMLDivElement>();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [activeStep, setActiveStep] = useState(0);

  const eyebrow = content?.eyebrow ?? "7-Day RPO Deployment Sprint Workflow";
  const title = content?.title ?? "From Technical Brief to Deployed Specialist";
  const subtitle = content?.subtitle ?? "A transparent 5-stage orchestration workflow powered by AI video screening and domain specialist verification. Frictionless, interactive, and built for rapid enterprise execution.";

  const steps: MatrixStep[] =
    content?.steps && content.steps.length > 0
      ? content.steps.map((st, i) => ({
          ...STEPS[i % STEPS.length],
          ...st,
        }))
      : STEPS;

  /* Sync activeStep to comet position using rAF for perfect timing */
  useEffect(() => {
    if (!seen) return;
    let raf: number;
    const start = performance.now();
    let lastStep = -1;

    function tick(now: number) {
      const elapsed = (now - start) % CYCLE_MS;
      const frac = elapsed / CYCLE_MS;

      /* Find the last box the comet has reached */
      let step = 0;
      for (let i = HIT_FRACS.length - 1; i >= 0; i--) {
        if (frac >= HIT_FRACS[i]) { step = i; break; }
      }

      if (step !== lastStep) {
        lastStep = step;
        setActiveStep(step);
      }
      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen]);

  const isActive = (i: number) => hoveredIdx === i || activeStep === i;

  return (
    <section
      id="sprint-execution-matrix"
      className="relative w-full overflow-hidden bg-canvas px-4 py-14 sm:px-6 sm:py-18 lg:px-10 lg:py-22"
    >
      {/* Atmosphere Background Graphic Image */}
      <div className="pointer-events-none absolute inset-0 z-0 select-none">
        <img
          src="/backgrounds/worksprint_bg.png"
          alt=""
          className="h-full w-full object-cover object-center"
        />
      </div>

      <div className="pointer-events-none absolute left-1/2 top-0 h-[480px] w-[960px] -translate-x-1/2 rounded-full blur-3xl opacity-40 [background:radial-gradient(ellipse_at_center,rgba(10,132,255,0.08),transparent_65%)] z-0" />

      <div ref={sectionRef} className="relative z-10 mx-auto max-w-7xl 2xl:max-w-[1440px]">
        {/* Section Header */}
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-electric/25 bg-electric/[0.08] px-4 py-1 font-mono text-[10.5px] font-semibold tracking-[0.16em] uppercase text-electric shadow-sm backdrop-blur-sm">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-electric shadow-[0_0_6px_rgba(10,132,255,0.6)]" />
            {eyebrow}
          </div>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-[40px] leading-[1.14] line-clamp-2 text-balance">
            {title}
          </h2>
          <p className="mt-3 text-sm sm:text-base leading-relaxed text-ink-soft max-w-xl">
            {subtitle}
          </p>
        </div>

        {/* ============ CRAFTED TIMELINE (Desktop) ============ */}
        <div className="mt-14 hidden lg:block">
          <div className="relative mx-auto max-w-5xl">
            {/* ---- Rail (behind icon boxes, vertically centered at box midpoint 26px) ---- */}
            <div className="absolute left-[60px] right-[60px] top-[26px] h-[2px] z-0">
              <div className="absolute inset-0 rounded-full bg-[#d6e3f7]" />
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#0a84ff] via-[#38bdf8] to-[#0a84ff]"
                style={{ width: seen ? "100%" : "0%", transition: "width 1.8s cubic-bezier(0.22, 1, 0.36, 1)" }}
              />
              <div
                className="absolute inset-y-[-3px] left-0 rounded-full bg-gradient-to-r from-[#0a84ff]/30 via-[#38bdf8]/30 to-[#0a84ff]/30 blur-sm"
                style={{ width: seen ? "100%" : "0%", transition: "width 1.8s cubic-bezier(0.22, 1, 0.36, 1) 0.1s" }}
              />

              {/* ---- HALLEY'S COMET ---- */}
              {seen && (
                <div className="sem-comet absolute top-1/2 -translate-y-1/2 z-30 pointer-events-none h-0 w-0">
                  {/* Layer 1: Far outer dust tail */}
                  <div className="absolute right-[4px] top-1/2 -translate-y-1/2 h-[16px] w-[90px] rounded-full opacity-30 blur-[6px]"
                    style={{ background: "linear-gradient(to left, #0a84ff, #38bdf8 30%, rgba(10,132,255,0.2) 70%, transparent 100%)" }}
                  />
                  {/* Layer 2: Ion tail */}
                  <div className="absolute right-[4px] top-1/2 -translate-y-1/2 h-[10px] w-[70px] rounded-full opacity-50 blur-[3px]"
                    style={{ background: "linear-gradient(to left, #38bdf8, #0a84ff 60%, transparent 100%)" }}
                  />
                  {/* Layer 3: Core tail streak (tight, vibrant) */}
                  <div className="absolute right-[4px] top-1/2 -translate-y-1/2 h-[4px] w-[60px] rounded-full"
                    style={{ background: "linear-gradient(to left, #fff 0%, #38bdf8 15%, #0a84ff 40%, transparent 100%)" }}
                  />
                  {/* Layer 4: Inner tail glow */}
                  <div className="absolute right-[4px] top-1/2 -translate-y-1/2 h-[6px] w-[40px] rounded-full opacity-70 blur-[1px]"
                    style={{ background: "linear-gradient(to left, #fff, #38bdf8 30%, transparent 100%)" }}
                  />
                  {/* Sparkle particles scattered in the tail */}
                  <div className="absolute right-[20px] top-[calc(50%-4px)] h-[1.5px] w-[1.5px] rounded-full bg-white sem-sparkle" />
                  <div className="absolute right-[35px] top-[calc(50%+3px)] h-[1px] w-[1px] rounded-full bg-white/70 sem-sparkle" style={{ animationDelay: "0.2s" }} />
                  <div className="absolute right-[50px] top-[calc(50%-2px)] h-[1px] w-[1px] rounded-full bg-[#38bdf8]/80 sem-sparkle" style={{ animationDelay: "0.5s" }} />
                  <div className="absolute right-[28px] top-[calc(50%+1px)] h-[1px] w-[1px] rounded-full bg-white/60 sem-sparkle" style={{ animationDelay: "0.35s" }} />
                  {/* Coma (halo glow around the nucleus) */}
                  <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 h-[22px] w-[22px] rounded-full opacity-50 blur-[5px]"
                    style={{ background: "radial-gradient(circle, #38bdf8, #0a84ff 40%, transparent 70%)" }}
                  />
                  {/* Inner coma */}
                  <div className="absolute right-[-2px] top-1/2 -translate-y-1/2 h-[14px] w-[14px] rounded-full opacity-60 blur-[2px]"
                    style={{ background: "radial-gradient(circle, #fff, #38bdf8 50%, transparent 80%)" }}
                  />
                  {/* Nucleus (the core bright point) */}
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 h-[6px] w-[6px] rounded-full bg-white shadow-[0_0_6px_2px_rgba(56,189,248,0.9),0_0_14px_4px_rgba(10,132,255,0.6),0_0_24px_8px_rgba(10,132,255,0.3)]" />
                </div>
              )}
            </div>

            {/* ---- 5 Icon Box Nodes on the rail ---- */}
            <div className="relative z-10 flex items-start justify-between">
              {steps.map((step, i) => {
                const Ico = ICONS[i];
                const active = isActive(i);
                return (
                  <div
                    key={step.num}
                    onMouseEnter={() => setHoveredIdx(i)}
                    onMouseLeave={() => setHoveredIdx(null)}
                    className="flex w-[120px] flex-col items-center cursor-pointer"
                    style={{
                      opacity: seen ? 1 : 0,
                      transform: seen ? "translateY(0)" : "translateY(14px)",
                      transition: `opacity 0.5s ease-out ${0.4 + i * 0.12}s, transform 0.5s ease-out ${0.4 + i * 0.12}s`,
                    }}
                  >
                    {/* Icon Box = the node ON the rail */}
                    <div
                      className="sem-node relative flex h-[52px] w-[52px] items-center justify-center rounded-xl transition-all duration-300"
                      style={{
                        borderWidth: "2px",
                        borderStyle: "solid",
                        borderColor: active ? step.accent : "#bcd6fa",
                        backgroundColor: active ? step.accent : "rgba(255,255,255,0.97)",
                        color: active ? "#fff" : step.accent,
                        boxShadow: active
                          ? `0 0 20px ${step.accent}50, 0 6px 16px -4px ${step.accent}35`
                          : "0 2px 8px -2px rgba(10,20,40,0.06)",
                        transform: active ? "scale(1.08)" : "scale(1)",
                      }}
                    >
                      <div className="relative z-10 h-6 w-6">
                        <Ico />
                      </div>
                    </div>

                    <span
                      className="mt-2.5 font-mono text-[11px] font-bold transition-colors duration-200"
                      style={{ color: step.accent }}
                    >
                      {step.days}
                    </span>
                    <span
                      className={`font-display text-[11px] font-semibold max-w-[110px] text-center leading-tight transition-colors duration-200 ${
                        active ? "text-ink" : "text-ink-soft"
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mobile Timeline */}
        <div className="mt-8 flex lg:hidden overflow-x-auto no-scrollbar gap-3 px-1 pb-2">
          {STEPS.map((step, i) => {
            const Ico = ICONS[i];
            const active = isActive(i);
            return (
              <div key={step.num} onClick={() => setActiveStep(i)} className="flex shrink-0 flex-col items-center w-[90px] cursor-pointer">
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-xl border-2 p-2 transition-all duration-300"
                  style={{
                    borderColor: active ? step.accent : "#bcd6fa",
                    color: active ? "#fff" : step.accent,
                    backgroundColor: active ? step.accent : step.accentBg,
                    boxShadow: active ? `0 0 12px ${step.accent}40` : "none",
                  }}
                >
                  <Ico />
                </div>
                <span className="mt-1.5 font-mono text-[10px] font-bold" style={{ color: step.accent }}>{step.days}</span>
                <span className="font-display text-[10px] font-semibold text-ink-soft text-center leading-tight">{step.title}</span>
              </div>
            );
          })}
        </div>

        {/* 5-Column Card Grid */}
        <div className="mt-8 sm:mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 sm:gap-5">
          {steps.map((step, idx) => {
            const Ico = ICONS[idx];
            const active = isActive(idx);
            return (
              <div
                key={step.num}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className={`sem-card group relative flex flex-col overflow-hidden rounded-2xl border bg-white/95 backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 ${
                  active
                    ? "border-electric/70 shadow-[0_20px_45px_-12px_rgba(10,132,255,0.22)]"
                    : "border-[#bcd6fa]/70 shadow-[0_10px_28px_-18px_rgba(10,20,40,0.08)] hover:border-electric/40"
                }`}
                style={{
                  opacity: seen ? 1 : 0,
                  transform: seen ? "translateY(0)" : "translateY(20px)",
                  transition: `opacity 0.5s ease-out ${idx * 100}ms, transform 0.5s ease-out ${idx * 100}ms, box-shadow 0.3s, border-color 0.3s`,
                }}
              >
                <div
                  className="pointer-events-none absolute inset-x-0 top-0 h-16 transition-opacity duration-300"
                  style={{ background: "linear-gradient(to bottom, rgba(10,132,255,0.06), transparent)", opacity: active ? 1 : 0 }}
                />
                <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-full" />
                <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:radial-gradient(rgba(10,132,255,0.08)_1px,transparent_1.4px)] [background-size:18px_18px]" />

                {/* Abstract Corner Shapes (Nolok-style organic fluid vectors in brand blue) */}
                <CardCornerShapes
                  color="#0a84ff"
                  active={active}
                  variant={idx}
                  size={120}
                />

                <div className="relative z-10 flex items-center gap-3 p-4 pb-0 sm:p-5 sm:pb-0">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl p-2 transition-all duration-300"
                    style={{
                      backgroundColor: active ? "#0a84ff" : "rgba(10,132,255,0.07)",
                      color: active ? "#fff" : "#0a84ff",
                      boxShadow: active ? "0 4px 14px rgba(10,132,255,0.3)" : "none",
                    }}
                  >
                    <Ico />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-electric">Step {step.num}</span>
                      <span className="font-mono text-[9px] text-mist">{step.days}</span>
                    </div>
                    <h3 className="font-display text-[13px] sm:text-sm font-bold text-ink leading-snug">{step.title}</h3>
                  </div>
                </div>

                <p className="relative z-10 px-4 sm:px-5 mt-2 text-[11px] leading-relaxed text-ink-soft">{step.sub}</p>

                <div className="relative z-10 mt-3 flex-1 px-4 sm:px-5 space-y-1.5">
                  {step.deliverables.map((d, dIdx) => (
                    <div key={dIdx} className="flex items-center gap-2">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="shrink-0 text-electric">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span className="text-[10.5px] font-medium text-ink truncate">{d}</span>
                    </div>
                  ))}
                </div>

                <div
                  className="relative z-10 mt-4 mx-4 mb-4 sm:mx-5 sm:mb-5 rounded-lg border px-3 py-2 font-mono text-[10px] font-semibold flex items-center justify-between transition-colors duration-300"
                  style={{
                    borderColor: active ? "rgba(10,132,255,0.35)" : "rgba(188,214,250,0.6)",
                    backgroundColor: active ? "rgba(10,132,255,0.06)" : "rgba(238,244,253,0.7)",
                  }}
                >
                  <span className="text-mist">SLA</span>
                  <span className="text-electric font-bold">{step.sla}</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* ============ Scoped CSS ============ */}
      <style>{`
        .sem-card { will-change: transform, opacity; }

        /* Halley's Comet traveling across the rail */
        .sem-comet {
          animation: sem-comet-travel 14s linear infinite;
        }
        @keyframes sem-comet-travel {
          0%   { left: -80px; opacity: 0; }
          2%   { opacity: 1; }
          93%  { opacity: 1; }
          100% { left: calc(100% + 10px); opacity: 0; }
        }

        /* Sparkle twinkle in comet tail */
        .sem-sparkle {
          animation: sem-twinkle 0.8s ease-in-out infinite alternate;
        }
        @keyframes sem-twinkle {
          from { opacity: 0.2; transform: scale(0.6); }
          to   { opacity: 1; transform: scale(1.8); }
        }
      `}</style>
    </section>
  );
}
