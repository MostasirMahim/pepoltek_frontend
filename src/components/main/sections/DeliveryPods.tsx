"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { MagicBento, ParticleCard } from "@/components/ui/MagicBento";

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
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once]);
  return { ref, seen };
}

function Counter({ to, seen, prefix = "", suffix = "" }: { to: number; seen: boolean; prefix?: string; suffix?: string }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!seen) return;
    let raf = 0;
    const start = performance.now();
    const dur = 1100;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(to * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen, to]);
  return (
    <span>
      {prefix}
      {val.toLocaleString("en-US")}
      {suffix}
    </span>
  );
}

/* ---------- icons (40x40, electric stroke) ---------- */

const iconProps = {
  width: 40,
  height: 40,
  viewBox: "0 0 40 40",
  fill: "none",
  stroke: "#0a84ff",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const Icons = {
  specialists: (
    <svg {...iconProps}>
      <circle cx="15" cy="14" r="5" />
      <path d="M6 33c0-5 4-9 9-9s9 4 9 9" />
      <circle cx="29" cy="11" r="3.2" />
      <path d="M25 22c4-1 9 2 9 8" />
      <path d="M31.5 30l1.6 1.6L37 28" stroke="#38bdf8" />
    </svg>
  ),
  analyst: (
    <svg {...iconProps}>
      <rect x="6" y="7" width="28" height="26" rx="3" />
      <path d="M12 26l5-6 4 4 7-9" />
      <circle cx="12" cy="26" r="1.2" fill="#0a84ff" />
      <circle cx="28" cy="15" r="1.2" fill="#38bdf8" />
      <path d="M6 13h28" />
    </svg>
  ),
  engineer: (
    <svg {...iconProps}>
      <path d="M15 12l-7 8 7 8" />
      <path d="M25 12l7 8-7 8" />
      <path d="M22 9l-4 22" stroke="#38bdf8" />
    </svg>
  ),
};

/* ---------- capability cards ---------- */

const CAPS = [
  {
    icon: Icons.specialists,
    title: "Technical & Healthcare Specialists",
    body: "Technical and clinical sourcing teams maintaining active talent pipelines across North America, Europe, GCC, and Asia Pacific.",
  },
  {
    icon: Icons.analyst,
    title: "Business Analysts",
    body: "Structures client tech stack mappings, workflow requirements, and operational SLAs prior to candidate deployment.",
  },
  {
    icon: Icons.engineer,
    title: "In House Software Engineers",
    body: "Conduct hard coded technical validation, system design reviews, and repository evaluations before any profile reaches a hiring manager panel.",
  },
];

const REGIONS = [
  { x: 14, label: "N. America" },
  { x: 38, label: "Europe" },
  { x: 62, label: "GCC" },
  { x: 86, label: "APAC" },
];

/* ---------- graphic: global pod network ---------- */

function PodNetwork() {
  return (
    <ParticleCard
      glowColor="10, 132, 255"
      particleCount={12}
      enableStars={true}
      enableBorderGlow={true}
      clickEffect={true}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#bcd6fa]/60 bg-white/80 p-6 shadow-[0_24px_60px_-30px_rgba(10,132,255,0.35)] backdrop-blur-md transition-all duration-300 hover:border-electric/40 sm:p-8"
    >
      <div className="pointer-events-none absolute inset-0 opacity-60 [background-image:radial-gradient(rgba(10,132,255,0.12)_1px,transparent_1.4px)] [background-size:20px_20px]" />
      <div className="pointer-events-none absolute -top-20 left-1/2 h-56 w-[560px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.18),transparent_65%)] blur-2xl" />

      <div className="relative mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#6b7a95]">
            Active talent pipeline
          </div>
          <div className="mt-1 font-display text-lg font-bold text-[#0a1428]">
            Four longitudes, one delivery core
          </div>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-electric/20 bg-electric/[0.08] px-3 py-1 font-mono text-[10px] tracking-[0.14em] uppercase text-electric">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-electric" />
          Streaming
        </span>
      </div>

      {/* svg map */}
      <svg viewBox="0 0 100 46" className="relative w-full" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="dp-line" x1="0" x2="1">
            <stop offset="0" stopColor="#0a84ff" stopOpacity="0" />
            <stop offset="0.5" stopColor="#38bdf8" stopOpacity="0.9" />
            <stop offset="1" stopColor="#0a84ff" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="dp-core" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#38bdf8" />
            <stop offset="1" stopColor="#0a84ff" />
          </radialGradient>
        </defs>

        {/* connectors from each region to the core */}
        {REGIONS.map((r, i) => (
          <path
            key={i}
            d={`M${r.x} 10 Q${(r.x + 50) / 2} ${i % 2 ? 2 : 26} 50 30`}
            fill="none"
            stroke="url(#dp-line)"
            strokeWidth="0.5"
            strokeDasharray="2 2"
            className="dp-dash"
            style={{ animationDelay: `${i * 0.4}s` }}
          />
        ))}

        {/* region nodes */}
        {REGIONS.map((r, i) => (
          <g key={r.label}>
            <circle cx={r.x} cy="10" r="2.4" fill="#fff" stroke="#0a84ff" strokeWidth="0.6" />
            <circle cx={r.x} cy="10" r="1" fill="#0a84ff" className="dp-pulse" style={{ animationDelay: `${i * 0.5}s` }} />
            <text x={r.x} y="5" textAnchor="middle" fontSize="2.6" fill="#3d4c68" fontFamily="Inter, sans-serif" fontWeight="500">
              {r.label}
            </text>
          </g>
        ))}

        {/* core hub */}
        <circle cx="50" cy="30" r="6" fill="url(#dp-core)" />
        <circle cx="50" cy="30" r="6" fill="none" stroke="#38bdf8" strokeWidth="0.5" className="dp-ring" />
        <text x="50" y="31.2" textAnchor="middle" fontSize="2.4" fill="#fff" fontFamily="'JetBrains Mono', monospace" fontWeight="600">
          HUB
        </text>
      </svg>

      <div className="relative mt-5 grid grid-cols-3 gap-3 border-t border-[#bcd6fa]/50 pt-5">
        {[
          { k: "12", l: "Active teams" },
          { k: "4", l: "Regions covered" },
          { k: "24/7", l: "Live sourcing" },
        ].map((s) => (
          <div key={s.l} className="text-center">
            <div className="font-display text-xl font-extrabold text-electric">{s.k}</div>
            <div className="mt-0.5 font-mono text-[9.5px] tracking-[0.1em] uppercase text-[#6b7a95]">{s.l}</div>
          </div>
        ))}
      </div>
    </ParticleCard>
  );
}

/* ---------- leadership stat cards ---------- */

function Leadership() {
  const scale = useInView<HTMLDivElement>();
  const comm = useInView<HTMLDivElement>();
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {/* scaling */}
      <ParticleCard
        glowColor="10, 132, 255"
        particleCount={10}
        enableStars={true}
        enableBorderGlow={true}
        clickEffect={true}
        className="group relative overflow-hidden rounded-2xl border border-[#bcd6fa]/60 bg-white/80 p-6 shadow-[0_20px_50px_-30px_rgba(10,132,255,0.3)] backdrop-blur-md transition-all duration-300 hover:border-electric/40"
      >
        <div ref={scale.ref}>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-electric/[0.06] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <span className="inline-flex rounded-full border border-electric/20 bg-electric/[0.08] px-3 py-1 font-mono text-[10px] tracking-[0.14em] uppercase text-electric">
            Scaling milestone
          </span>
          <div className="mt-5 flex items-end gap-1 font-display text-[#0a1428]">
            <span className="text-2xl font-bold text-[#6b7a95]">0</span>
            <span className="pb-1 text-lg text-[#6b7a95]">→</span>
            <span className="text-[42px] font-extrabold leading-none text-electric">
              <Counter to={1000} seen={scale.seen} />
            </span>
          </div>
          <div className="mt-1 font-mono text-[10px] tracking-[0.12em] uppercase text-[#6b7a95]">employees scaled</div>
          <div className="mt-5 flex gap-6 border-t border-[#bcd6fa]/50 pt-4">
            <Mini value={<Counter to={98} seen={scale.seen} suffix="%" />} label="Founding team retention" />
            <Mini value={<Counter to={36} seen={scale.seen} />} label="Months sustained" />
          </div>
        </div>
      </ParticleCard>

      {/* commercialization */}
      <ParticleCard
        glowColor="10, 132, 255"
        particleCount={10}
        enableStars={true}
        enableBorderGlow={true}
        clickEffect={true}
        className="group relative overflow-hidden rounded-2xl border border-[#bcd6fa]/60 bg-white/80 p-6 shadow-[0_20px_50px_-30px_rgba(10,132,255,0.3)] backdrop-blur-md transition-all duration-300 hover:border-electric/40"
      >
        <div ref={comm.ref}>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-electric/[0.06] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <span className="inline-flex rounded-full border border-electric/20 bg-electric/[0.08] px-3 py-1 font-mono text-[10px] tracking-[0.14em] uppercase text-electric">
            Commercialization
          </span>
          <div className="mt-5 font-display text-[42px] font-extrabold leading-none text-electric">
            <Counter to={10} seen={comm.seen} prefix="$" suffix="M" />
          </div>
          <div className="mt-1 font-mono text-[10px] tracking-[0.12em] uppercase text-[#6b7a95]">annual revenue driven</div>
          <p className="mt-4 text-[13px] leading-relaxed text-[#3d4c68]">
            Executive background driving enterprise brand expansion across a broad distribution footprint.
          </p>
          <div className="mt-4 flex gap-6 border-t border-[#bcd6fa]/50 pt-4">
            <Mini value={<Counter to={60} seen={comm.seen} suffix="+" />} label="Distribution channels" />
            <Mini value="Enterprise" label="Brand tier" />
          </div>
        </div>
      </ParticleCard>
    </div>
  );
}

function Mini({ value, label }: { value: React.ReactNode; label: string }) {
  return (
    <div>
      <div className="font-display text-xl font-extrabold text-[#0a1428]">{value}</div>
      <div className="mt-0.5 font-mono text-[9.5px] tracking-[0.1em] uppercase text-[#6b7a95]">{label}</div>
    </div>
  );
}

/* ---------- section ---------- */

export default function DeliveryPods() {
  return (
    <section id="delivery-pods" className="relative w-full overflow-hidden bg-canvas px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
      <div className="pointer-events-none absolute right-1/2 top-10 h-[420px] w-[820px] translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(10,132,255,0.08),transparent_60%)]" />

      <div className="relative mx-auto max-w-[1240px]">
        {/* header */}
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-electric/20 bg-electric/[0.08] px-4 py-1 font-mono text-[11px] font-medium tracking-[0.14em] uppercase text-electric">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-electric shadow-[0_0_6px_rgba(10,132,255,0.6)]" />
            Delivery Teams & Leadership
          </div>
          <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-[#0a1428] sm:text-4xl lg:text-[38px]">
            In-House Delivery Team Breakdown
          </h2>
          <p className="mt-3 text-base leading-relaxed text-[#3d4c68] sm:text-lg">
            High velocity talent engineering teams, strict technical vetting, and proven executive scaling execution.
          </p>
        </div>

        {/* Unified MagicBento Grid for all cards (Left, Right, and Bottom) */}
        <MagicBento
          glowColor="10, 132, 255"
          spotlightRadius={480}
          enableBorderGlow={true}
          enableStars={true}
          enableSpotlight={true}
          clickEffect={true}
          enableTilt={false}
          enableMagnetism={false}
          className="mt-12"
        >
          {/* graphic + capability grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.15fr] lg:items-stretch">
            <PodNetwork />

            {/* capability cards */}
            <div className="flex flex-col justify-between gap-3.5 sm:gap-4">
              {CAPS.map((c) => (
                <ParticleCard
                  key={c.title}
                  glowColor="10, 132, 255"
                  particleCount={8}
                  enableStars={true}
                  enableBorderGlow={true}
                  clickEffect={true}
                  className="group flex flex-1 flex-col justify-center rounded-2xl border border-[#bcd6fa]/60 bg-white/80 p-6 shadow-[0_16px_40px_-20px_rgba(10,132,255,0.18)] backdrop-blur-md transition-all duration-300 hover:border-electric/40 sm:p-6"
                >
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-electric/[0.05] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="relative z-10 flex items-start gap-4">
                    <div className="relative shrink-0 rounded-xl bg-electric/[0.07] p-2.5 ring-1 ring-inset ring-electric/20 transition-transform duration-300 group-hover:scale-105">
                      {c.icon}
                    </div>
                    <div>
                      <h3 className="font-display text-[16px] font-bold text-[#0a1428] transition-colors duration-200 group-hover:text-electric">
                        {c.title}
                      </h3>
                      <p className="mt-1.5 text-[13.5px] leading-relaxed text-[#3d4c68]">{c.body}</p>
                    </div>
                  </div>
                </ParticleCard>
              ))}
            </div>
          </div>

          {/* leadership bottom cards */}
          <div className="mt-6">
            <Leadership />
          </div>
        </MagicBento>

        {/* CTAs */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/about"
            className="group inline-flex items-center gap-2 rounded-xl bg-electric px-7 py-3.5 font-display text-sm font-semibold text-white shadow-[0_10px_25px_-5px_rgba(10,132,255,0.4)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-electric-bright hover:shadow-[0_14px_30px_-5px_rgba(56,189,248,0.5)]"
          >
            Learn More About Us
            <svg className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
          <Link
            href="/solutions"
            className="inline-flex items-center gap-2 rounded-xl border border-[#bcd6fa] bg-white/80 px-6 py-3.5 font-display text-sm font-semibold text-[#0a1428] backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-electric/50 hover:bg-white hover:text-electric"
          >
            Explore Solutions
          </Link>
        </div>
      </div>

      {/* scoped animations: no global css */}
      <style>{`
        .dp-dash { animation: dpDash 1.6s linear infinite; }
        @keyframes dpDash { to { stroke-dashoffset: -8; } }
        .dp-pulse { transform-origin: center; animation: dpPulse 2.4s ease-in-out infinite; }
        @keyframes dpPulse { 0%,100% { opacity:.4; } 50% { opacity:1; } }
        .dp-ring { transform-origin: 50px 30px; animation: dpRing 3s ease-in-out infinite; }
        @keyframes dpRing { 0%,100% { opacity:.3; transform: scale(1); } 50% { opacity:.9; transform: scale(1.18); } }
      `}</style>
    </section>
  );
}
