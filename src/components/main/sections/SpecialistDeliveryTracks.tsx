"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { MagicBento, ParticleCard } from "@/components/ui/MagicBento";

/* ---------- in-view hook ---------- */
function useInView<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, seen };
}

/* ---------- animated number counter ---------- */
function Counter({
  to,
  seen,
  prefix = "",
  suffix = "",
}: {
  to: number;
  seen: boolean;
  prefix?: string;
  suffix?: string;
}) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!seen) return;
    let raf = 0;
    const start = performance.now();
    const dur = 1200;
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

/* ---------- 7 global sourcing regions ---------- */
interface PodRegion {
  id: string;
  country: string;
  label: string;
  tz: string;
  x: number;
  y: number;
  arcPath: string;
  labelY: number;
  tzY: number;
  isTop: boolean;
}

const POD_REGIONS: PodRegion[] = [
  {
    id: "usa",
    country: "USA",
    label: "N. America",
    tz: "EST (UTC-5)",
    x: 14,
    y: 14,
    arcPath: "M14 14 Q30 20 50 31",
    labelY: 6.5,
    tzY: 8.8,
    isTop: true,
  },
  {
    id: "eu",
    country: "Europe",
    label: "Europe",
    tz: "CET (UTC+1)",
    x: 38,
    y: 11,
    arcPath: "M38 11 Q44 20 50 31",
    labelY: 4,
    tzY: 6.2,
    isTop: true,
  },
  {
    id: "gcc",
    country: "GCC",
    label: "GCC",
    tz: "GST (UTC+4)",
    x: 62,
    y: 11,
    arcPath: "M62 11 Q56 20 50 31",
    labelY: 4,
    tzY: 6.2,
    isTop: true,
  },
  {
    id: "apac",
    country: "APAC",
    label: "APAC",
    tz: "JST (UTC+9)",
    x: 86,
    y: 14,
    arcPath: "M86 14 Q70 20 50 31",
    labelY: 6.5,
    tzY: 8.8,
    isTop: true,
  },
  {
    id: "latam",
    country: "LATAM",
    label: "LATAM",
    tz: "BRT (UTC-3)",
    x: 22,
    y: 49,
    arcPath: "M22 49 Q34 40 50 31",
    labelY: 57,
    tzY: 59.2,
    isTop: false,
  },
  {
    id: "india",
    country: "India",
    label: "India",
    tz: "IST (UTC+5:30)",
    x: 50,
    y: 53,
    arcPath: "M50 53 Q50 42 50 31",
    labelY: 61,
    tzY: 63.2,
    isTop: false,
  },
  {
    id: "singapore",
    country: "Singapore",
    label: "Singapore",
    tz: "SGT (UTC+8)",
    x: 78,
    y: 49,
    arcPath: "M78 49 Q66 40 50 31",
    labelY: 57,
    tzY: 59.2,
    isTop: false,
  },
];

/* ---------- vector country flag badge renderer ---------- */
function CountryBadge({ r }: { r: PodRegion; i: number }) {
  const clipId = `flag-clip-${r.id}`;
  return (
    <g key={r.id}>
      <circle cx={r.x} cy={r.y} r="4.2" fill="#ffffff" filter="drop-shadow(0 2px 5px rgba(10,132,255,0.22))" />

      <g clipPath={`url(#${clipId})`}>
        {r.id === "usa" && (
          <g transform={`translate(${r.x}, ${r.y})`}>
            <rect x="-3.8" y="-3.8" width="7.6" height="7.6" fill="#dc2626" />
            <rect x="-3.8" y="-2.6" width="7.6" height="1.1" fill="#ffffff" />
            <rect x="-3.8" y="-0.4" width="7.6" height="1.1" fill="#ffffff" />
            <rect x="-3.8" y="1.8" width="7.6" height="1.1" fill="#ffffff" />
            <rect x="-3.8" y="-3.8" width="4" height="4" fill="#1e3a8a" />
            <circle cx="-2.6" cy="-2.6" r="0.45" fill="#ffffff" />
            <circle cx="-1.2" cy="-2.6" r="0.45" fill="#ffffff" />
            <circle cx="-1.9" cy="-1.3" r="0.45" fill="#ffffff" />
            <circle cx="-3.2" cy="-1.3" r="0.45" fill="#ffffff" />
          </g>
        )}

        {r.id === "eu" && (
          <g transform={`translate(${r.x}, ${r.y})`}>
            <rect x="-3.8" y="-3.8" width="7.6" height="7.6" fill="#003399" />
            <circle cx="0" cy="-2.1" r="0.38" fill="#fbbf24" />
            <circle cx="1.5" cy="-1.5" r="0.38" fill="#fbbf24" />
            <circle cx="2.1" cy="0" r="0.38" fill="#fbbf24" />
            <circle cx="1.5" cy="1.5" r="0.38" fill="#fbbf24" />
            <circle cx="0" cy="2.1" r="0.38" fill="#fbbf24" />
            <circle cx="-1.5" cy="1.5" r="0.38" fill="#fbbf24" />
            <circle cx="-2.1" cy="0" r="0.38" fill="#fbbf24" />
            <circle cx="-1.5" cy="-1.5" r="0.38" fill="#fbbf24" />
          </g>
        )}

        {r.id === "gcc" && (
          <g transform={`translate(${r.x}, ${r.y})`}>
            <rect x="-3.8" y="-3.8" width="7.6" height="2.6" fill="#15803d" />
            <rect x="-3.8" y="-1.2" width="7.6" height="2.5" fill="#ffffff" />
            <rect x="-3.8" y="1.3" width="7.6" height="2.6" fill="#0f172a" />
            <rect x="-3.8" y="-3.8" width="2.4" height="7.6" fill="#dc2626" />
          </g>
        )}

        {r.id === "apac" && (
          <g transform={`translate(${r.x}, ${r.y})`}>
            <rect x="-3.8" y="-3.8" width="7.6" height="7.6" fill="#ffffff" />
            <circle cx="0" cy="0" r="1.8" fill="#dc2626" />
          </g>
        )}

        {r.id === "latam" && (
          <g transform={`translate(${r.x}, ${r.y})`}>
            <rect x="-3.8" y="-3.8" width="7.6" height="7.6" fill="#16a34a" />
            <polygon points="0,-2.6 2.8,0 0,2.6 -2.8,0" fill="#eab308" />
            <circle cx="0" cy="0" r="1.3" fill="#1e40af" />
            <path d="M-1.1 0.2 Q0 -0.4 1.1 -0.1" stroke="#ffffff" strokeWidth="0.35" fill="none" />
          </g>
        )}

        {r.id === "india" && (
          <g transform={`translate(${r.x}, ${r.y})`}>
            <rect x="-3.8" y="-3.8" width="7.6" height="2.6" fill="#ea580c" />
            <rect x="-3.8" y="-1.2" width="7.6" height="2.5" fill="#ffffff" />
            <rect x="-3.8" y="1.3" width="7.6" height="2.6" fill="#15803d" />
            <circle cx="0" cy="0" r="1.0" fill="none" stroke="#1e3a8a" strokeWidth="0.3" />
            <circle cx="0" cy="0" r="0.3" fill="#1e3a8a" />
          </g>
        )}

        {r.id === "singapore" && (
          <g transform={`translate(${r.x}, ${r.y})`}>
            <rect x="-3.8" y="-3.8" width="7.6" height="3.8" fill="#dc2626" />
            <rect x="-3.8" y="0" width="7.6" height="3.8" fill="#ffffff" />
            <circle cx="-1.5" cy="-1.8" r="1.1" fill="#ffffff" />
            <circle cx="-1.1" cy="-1.8" r="0.95" fill="#dc2626" />
            <circle cx="-0.2" cy="-2.3" r="0.2" fill="#ffffff" />
            <circle cx="0.4" cy="-1.9" r="0.2" fill="#ffffff" />
            <circle cx="0.2" cy="-1.2" r="0.2" fill="#ffffff" />
            <circle cx="-0.4" cy="-1.3" r="0.2" fill="#ffffff" />
          </g>
        )}
      </g>

      {/* Front glass rim */}
      <circle cx={r.x} cy={r.y} r="3.6" fill="none" stroke="#0a84ff" strokeWidth="0.35" opacity="0.6" />

      {/* Region label */}
      <text
        x={r.x}
        y={r.labelY}
        textAnchor="middle"
        fontSize="2.4"
        fill="#0a1428"
        fontFamily="var(--font-sora), sans-serif"
        fontWeight="700"
      >
        {r.label}
      </text>
      {/* Timezone sub-label */}
      <text
        x={r.x}
        y={r.tzY}
        textAnchor="middle"
        fontSize="1.7"
        fill="#0a84ff"
        fontFamily="var(--font-jetbrains-mono), monospace"
        fontWeight="600"
        opacity="0.9"
      >
        {r.tz}
      </text>
    </g>
  );
}

/* ---------- animated AI microchip & 5 orbiting domain specialist graphic (Unified Blue Color Family) ---------- */
function AiSpecialistAnimation() {
  return (
    <div className="relative flex h-[95px] w-[95px] sm:h-[110px] sm:w-[110px] lg:h-[115px] lg:w-[115px] shrink-0 items-center justify-center">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(10,132,255,0.2)_0%,rgba(56,189,248,0.08)_50%,transparent_70%)] blur-md" />

      <svg viewBox="0 0 160 160" className="relative z-10 h-full w-full overflow-visible">
        <defs>
          <radialGradient id="ai-hub-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#0a84ff" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="ai-chip-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0a84ff" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
        </defs>

        {/* Orbit Ring 1 (Inner dashed) */}
        <circle
          cx="80"
          cy="80"
          r="42"
          fill="none"
          stroke="#38bdf8"
          strokeWidth="0.9"
          strokeDasharray="2.5 3.5"
          opacity="0.55"
          className="animate-[spin_28s_linear_infinite]"
          style={{ transformOrigin: "80px 80px" }}
        />

        {/* Orbit Ring 2 (Outer dashed) */}
        <circle
          cx="80"
          cy="80"
          r="62"
          fill="none"
          stroke="#0a84ff"
          strokeWidth="0.8"
          strokeDasharray="2 4"
          opacity="0.38"
          className="animate-[spin_42s_linear_infinite_reverse]"
          style={{ transformOrigin: "80px 80px" }}
        />

        {/* Connecting spokes in harmonious cyan / electric blue */}
        <line x1="80" y1="80" x2="80" y2="24" stroke="#38bdf8" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.45" />
        <line x1="80" y1="80" x2="132" y2="48" stroke="#38bdf8" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.45" />
        <line x1="80" y1="80" x2="124" y2="124" stroke="#38bdf8" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.45" />
        <line x1="80" y1="80" x2="36" y2="124" stroke="#0a84ff" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.45" />
        <line x1="80" y1="80" x2="28" y2="48" stroke="#38bdf8" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.45" />

        {/* Central Ambient Glow */}
        <circle cx="80" cy="80" r="32" fill="url(#ai-hub-glow)" />

        {/* Central AI Processor Microchip */}
        <g className="animate-[pulse_3.2s_ease-in-out_infinite]" style={{ transformOrigin: "80px 80px" }}>
          {/* CPU Connector Pins (16 total) */}
          <line x1="72" y1="63" x2="72" y2="67" stroke="#38bdf8" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="77" y1="63" x2="77" y2="67" stroke="#38bdf8" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="83" y1="63" x2="83" y2="67" stroke="#38bdf8" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="88" y1="63" x2="88" y2="67" stroke="#38bdf8" strokeWidth="1.2" strokeLinecap="round" />

          <line x1="72" y1="93" x2="72" y2="97" stroke="#38bdf8" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="77" y1="93" x2="77" y2="97" stroke="#38bdf8" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="83" y1="93" x2="83" y2="97" stroke="#38bdf8" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="88" y1="93" x2="88" y2="97" stroke="#38bdf8" strokeWidth="1.2" strokeLinecap="round" />

          <line x1="63" y1="72" x2="67" y2="72" stroke="#38bdf8" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="63" y1="77" x2="67" y2="77" stroke="#38bdf8" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="63" y1="83" x2="67" y2="83" stroke="#38bdf8" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="63" y1="88" x2="67" y2="88" stroke="#38bdf8" strokeWidth="1.2" strokeLinecap="round" />

          <line x1="93" y1="72" x2="97" y2="72" stroke="#38bdf8" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="93" y1="77" x2="97" y2="77" stroke="#38bdf8" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="93" y1="83" x2="97" y2="83" stroke="#38bdf8" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="93" y1="88" x2="97" y2="88" stroke="#38bdf8" strokeWidth="1.2" strokeLinecap="round" />

          {/* Chip Body */}
          <rect
            x="67"
            y="67"
            width="26"
            height="26"
            rx="5.5"
            fill="url(#ai-chip-grad)"
            stroke="#38bdf8"
            strokeWidth="1.2"
            filter="drop-shadow(0 0 8px rgba(56,189,248,0.7))"
          />
          <text
            x="80"
            y="84.5"
            textAnchor="middle"
            fill="#ffffff"
            fontSize="12.5"
            fontFamily="var(--font-sora), sans-serif"
            fontWeight="800"
            letterSpacing="-0.02em"
          >
            AI
          </text>
        </g>

        {/* 5 Orbiting Specialist Domain Nodes in Blue/Cyan Shades (Zero Purple/Mismatches) */}
        {/* 1. Niche Recruitment Specialists */}
        <g className="cursor-pointer transition-transform duration-300 hover:scale-110" style={{ transformOrigin: "80px 24px" }}>
          <circle cx="80" cy="24" r="11" fill="#0a84ff" stroke="#ffffff" strokeWidth="1.5" filter="drop-shadow(0 2px 6px rgba(10,132,255,0.4))" />
          <path d="M77 22 a3 3 0 1 0 6 0 a3 3 0 0 0 -6 0 M75 28 a5 3 0 0 1 10 0" stroke="#ffffff" strokeWidth="1.1" fill="none" strokeLinecap="round" />
        </g>

        {/* 2. Medical & Clinical Specialists */}
        <g className="cursor-pointer transition-transform duration-300 hover:scale-110" style={{ transformOrigin: "132px 48px" }}>
          <circle cx="132" cy="48" r="11" fill="#0284c7" stroke="#ffffff" strokeWidth="1.5" filter="drop-shadow(0 2px 6px rgba(2,132,199,0.4))" />
          <path d="M128 44 v3 a4 4 0 0 0 8 0 v-3 M132 51 v2 a2 2 0 0 0 2 2 h1" stroke="#ffffff" strokeWidth="1.1" fill="none" strokeLinecap="round" />
        </g>

        {/* 3. Psychology & Behavioral Specialists (Unified Blue instead of purple) */}
        <g className="cursor-pointer transition-transform duration-300 hover:scale-110" style={{ transformOrigin: "124px 124px" }}>
          <circle cx="124" cy="124" r="11" fill="#0369a1" stroke="#ffffff" strokeWidth="1.5" filter="drop-shadow(0 2px 6px rgba(3,105,161,0.4))" />
          <path d="M121 121 a2.5 2.5 0 0 1 5 0 c0 2 -1.5 3 -2.5 4 c-1 -1 -2.5 -2 -2.5 -4 M124 126 v1.5" stroke="#ffffff" strokeWidth="1.1" fill="none" strokeLinecap="round" />
        </g>

        {/* 4. Software & AI Systems Engineers */}
        <g className="cursor-pointer transition-transform duration-300 hover:scale-110" style={{ transformOrigin: "36px 124px" }}>
          <circle cx="36" cy="124" r="11" fill="#2563eb" stroke="#ffffff" strokeWidth="1.5" filter="drop-shadow(0 2px 6px rgba(37,99,235,0.4))" />
          <path d="M33 121 l-2.5 3 l2.5 3 M39 121 l2.5 3 l-2.5 3 M37 120 l-2 8" stroke="#ffffff" strokeWidth="1.1" fill="none" strokeLinecap="round" />
        </g>

        {/* 5. Business Analysts & HR Strategists (Unified Sky/Cyan instead of teal) */}
        <g className="cursor-pointer transition-transform duration-300 hover:scale-110" style={{ transformOrigin: "28px 48px" }}>
          <circle cx="28" cy="48" r="11" fill="#0284c7" stroke="#ffffff" strokeWidth="1.5" filter="drop-shadow(0 2px 6px rgba(2,132,199,0.4))" />
          <path d="M25 51 v-3 M28 51 v-5 M31 51 v-7" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
}

/* ---------- 5 Execution Team Pillars with Inline Icons (Unified Blue Palette) ---------- */
const EXECUTION_PILLARS = [
  {
    title: "Niche Recruitment Specialists",
    desc: "Manage talent acquisition pipelines, direct sourcing outreach, and candidate engagement.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
        <circle cx="11" cy="8" r="2.5" />
        <path d="M7 14.5c0-1.8 1.8-2.5 4-2.5s4 .7 4 2.5" />
      </svg>
    ),
  },
  {
    title: "Business Analysts & HR Strategists",
    desc: "Translate client requisitions into SDLC stack specs, role profiles, and SLAs.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <line x1="10" y1="9" x2="8" y2="9" />
      </svg>
    ),
  },
  {
    title: "Software & AI Systems Engineers",
    desc: "Develop internal AI interview engines and evaluate developer repository architecture.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
        <line x1="14" y1="4" x2="10" y2="20" />
      </svg>
    ),
  },
  {
    title: "Medical & Clinical Specialists",
    desc: "Verify active state medical licenses, HIPAA/FHIR compliance, and facility readiness.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
  {
    title: "Psychology & Behavioral Specialists",
    desc: "Oversee AI video interview analytics, BEI frameworks, and behavioral scores.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a4.5 4.5 0 0 0-4.5 4.5c0 1.2.5 2.3 1.3 3.1-.3 1-.7 2.1-1.3 3.4C6.5 15 6 17 6 18.5A2.5 2.5 0 0 0 8.5 21h7a2.5 2.5 0 0 0 2.5-2.5c0-1.5-.5-3.5-1.5-5.5-.6-1.3-1-2.4-1.3-3.4.8-.8 1.3-1.9 1.3-3.1A4.5 4.5 0 0 0 12 2z" />
        <line x1="9.5" y1="8" x2="14.5" y2="8" />
        <line x1="10" y1="12" x2="14" y2="12" />
      </svg>
    ),
  },
];

/* ---------- dual sector track data ---------- */
interface CapabilityItem {
  title: string;
  body: string;
}

interface SectorTrack {
  id: "tech" | "health";
  label: string;
  badge: string;
  verifierText: string;
  bgImage: string;
  capabilities: CapabilityItem[];
  essentialTags: string[];
}

const TECH_TRACK: SectorTrack = {
  id: "tech",
  label: "Technology & SDLC RPO",
  badge: "SDLC RPO",
  verifierText: "Verified by: Software Engineers & HR Analysts",
  bgImage: "/backgrounds/tech_rpo_bg.png",
  capabilities: [
    {
      title: "AI Interview & Coding Evaluation",
      body: "Automated AI technical screening, interactive coding challenges, and repository audits.",
    },
    {
      title: "Frontend & Application Architecture",
      body: "React, Vue, Angular, Next.js 15, TypeScript, Mobile cross-platform frameworks.",
    },
    {
      title: "Backend & Distributed Systems",
      body: "Go, Node.js, Python, Java, PHP/Laravel, .NET, microservices, and gRPC endpoints.",
    },
    {
      title: "Cloud, DevOps & Cybersecurity",
      body: "AWS, Azure, Kubernetes, Docker, CI/CD automation, and Zero-Trust architecture.",
    },
    {
      title: "Engagement & Visa Contracting",
      body: "W2 Contract, Corp-to-Corp (C2C), 1099, Direct Hire, OPT/STEM, H-1B, and Green Card support.",
    },
  ],
  essentialTags: [
    "Next.js 15",
    "React",
    "TypeScript",
    "Go & Python",
    "AWS & K8s",
    "Zero-Trust",
    "W2 / C2C / 1099",
    "Visa Support",
  ],
};

const HEALTH_TRACK: SectorTrack = {
  id: "health",
  label: "Healthcare & Clinical RPO",
  badge: "CLINICAL RPO",
  verifierText: "Verified by: Medical Specialists & Clinical Ops",
  bgImage: "/backgrounds/health_rpo_bg.png",
  capabilities: [
    {
      title: "AI Clinical Screening & Verification",
      body: "AI video interview triage for clinical scenarios, background checks, and state license audits.",
    },
    {
      title: "Clinical Staffing & Facility Rotas",
      body: "Registered Nurses (RN / NP), Physicians, Emergency (ED), Outpatient (OPD), and ICU coverage.",
    },
    {
      title: "Health-Tech & EMR/EHR Integration",
      body: "Epic Systems, Cerner, FHIR v4, HL7 messaging, and secure telehealth workflows.",
    },
    {
      title: "Regulatory & Patient Data Compliance",
      body: "HIPAA Title II privacy safeguards, PCI DSS financial security, and BAA clearance protocols.",
    },
    {
      title: "Clinical Onboarding & Credentialing",
      body: "State board license validation, OIG/SAM exclusion screening, and facility credentialing logs.",
    },
  ],
  essentialTags: [
    "Physicians & RNs",
    "ICU & Emergency",
    "Telehealth Ops",
    "Epic & Cerner",
    "FHIR v4 / HL7",
    "HIPAA Title II",
    "BAA Clearance",
    "Pre-Credentialed",
  ],
};



/* ---------- Unified Symmetrical Dual-Track Banner (Single Row Flex) ---------- */
function DualTrackUnifiedBanner() {
  return (
    <div className="group relative mt-4 sm:mt-5 overflow-hidden rounded-3xl border border-[#bcd6fa]/70 bg-white shadow-[0_20px_50px_-20px_rgba(2,37,93,0.12)] transition-all duration-300 font-enterprise">
      <div className="grid grid-cols-1 xl:grid-cols-2 divide-y xl:divide-y-0 xl:divide-x divide-[#bcd6fa]/50 items-stretch">
        {/* ========================================================= */}
        {/* LEFT COLUMN: Technology & SDLC RPO                        */}
        {/* ========================================================= */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#e0f0ff]/60 via-[#edf6ff]/35 to-white/70 p-4 sm:p-5 lg:p-6 flex flex-col justify-between">
          {/* Soft ambient corner glow */}
          <div className="pointer-events-none absolute -left-16 -bottom-16 h-64 w-64 rounded-full bg-cyan-400/15 blur-3xl" />

          <div className="relative z-10 flex flex-col justify-between h-full">
            {/* 1. HEADER: Badge, Title & Subtitle */}
            <div className="border-b border-[#bcd6fa]/30 pb-2.5 mb-3">
              <span className="inline-block rounded-full bg-[#0084ff] px-2.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-white shadow-xs">
                {TECH_TRACK.badge}
              </span>
              <h3 className="mt-1 font-display text-lg sm:text-xl xl:text-2xl font-extrabold tracking-tight text-[#0a1428] leading-tight">
                {TECH_TRACK.label}
              </h3>
              <p className="mt-0.5 text-[11px] sm:text-xs font-medium text-slate-500">
                {TECH_TRACK.verifierText}
              </p>
            </div>

            {/* 2. MAIN: Graphic (Left) + 5 Capability Pillars (Right) */}
            <div className="flex-1 flex flex-col md:flex-row items-center gap-4 sm:gap-5 xl:gap-6">
              {/* 3D Tech Graphic */}
              <div className="relative w-full md:w-[38%] lg:w-[34%] shrink-0 flex items-center justify-center">
                <div className="relative w-full max-w-[200px] sm:max-w-[220px] xl:max-w-[230px] aspect-[505/818] h-[220px] sm:h-[250px] xl:h-[270px]">
                  <Image
                    src="/assets/homepage/banner/tech.png"
                    alt="Technology & SDLC RPO - 3D Technical Evaluation Hub"
                    fill
                    sizes="(max-width: 768px) 200px, 230px"
                    className="object-contain object-center drop-shadow-[0_16px_32px_rgba(56,189,248,0.25)] transition-transform duration-500 group-hover:scale-[1.02]"
                    priority
                  />
                </div>
              </div>

              {/* 5 Capability Pillars */}
              <div className="flex-1 min-w-0 space-y-1.5 sm:space-y-2">
                {TECH_TRACK.capabilities.map((c, i) => (
                  <div key={c.title} className="flex items-start gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#bfdbfe]/70 border border-[#93c5fd] font-enterprise text-[10px] font-bold text-[#0066cc] shadow-2xs mt-0.5">
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-display text-[12px] sm:text-[12.5px] font-bold leading-snug text-[#0a1428]">
                        {c.title}
                      </h4>
                      <p className="text-[9.5px] sm:text-[10px] leading-snug text-slate-500 mt-0.5">
                        {c.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. FOOTER: Stack Tags across full card width */}
            <div className="pt-2.5 sm:pt-3 mt-3 sm:mt-4 border-t border-[#bcd6fa]/30">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[9.5px] sm:text-[10px] font-bold uppercase tracking-wider text-[#0084ff] shrink-0 mr-1 flex items-center gap-1">
                  STACK:
                </span>
                {TECH_TRACK.essentialTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-[#93c5fd]/70 bg-[#eff6ff] px-2.5 py-0.5 text-[9.5px] sm:text-[10px] font-semibold text-[#1e40af] shadow-2xs whitespace-nowrap hover:bg-[#dbeafe] transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: Healthcare & Clinical RPO                   */}
        {/* ========================================================= */}
        <div className="relative overflow-hidden bg-gradient-to-bl from-[#d1fae5]/50 via-[#f0fdf4]/35 to-white/70 p-4 sm:p-5 lg:p-6 flex flex-col justify-between">
          {/* Soft ambient corner glow */}
          <div className="pointer-events-none absolute -right-16 -bottom-16 h-64 w-64 rounded-full bg-emerald-400/15 blur-3xl" />

          <div className="relative z-10 flex flex-col justify-between h-full">
            {/* 1. HEADER: Badge, Title & Subtitle */}
            <div className="border-b border-[#a7f3d0]/40 pb-2.5 mb-3">
              <span className="inline-block rounded-full bg-[#10b981] px-2.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-white shadow-xs">
                {HEALTH_TRACK.badge}
              </span>
              <h3 className="mt-1 font-display text-lg sm:text-xl xl:text-2xl font-extrabold tracking-tight text-[#0a1428] leading-tight">
                {HEALTH_TRACK.label}
              </h3>
              <p className="mt-0.5 text-[11px] sm:text-xs font-medium text-slate-500">
                {HEALTH_TRACK.verifierText}
              </p>
            </div>

            {/* 2. MAIN: 5 Capability Pillars (Left) + Graphic (Right) */}
            <div className="flex-1 flex flex-col-reverse md:flex-row items-center gap-4 sm:gap-5 xl:gap-6">
              {/* 5 Capability Pillars */}
              <div className="flex-1 min-w-0 space-y-1.5 sm:space-y-2">
                {HEALTH_TRACK.capabilities.map((c, i) => (
                  <div key={c.title} className="flex items-start gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#a7f3d0]/70 border border-[#6ee7b7] font-enterprise text-[10px] font-bold text-[#047857] shadow-2xs mt-0.5">
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-display text-[12px] sm:text-[12.5px] font-bold leading-snug text-[#0a1428]">
                        {c.title}
                      </h4>
                      <p className="text-[9.5px] sm:text-[10px] leading-snug text-slate-500 mt-0.5">
                        {c.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* 3D Healthcare Graphic */}
              <div className="relative w-full md:w-[38%] lg:w-[34%] shrink-0 flex items-center justify-center">
                <div className="relative w-full max-w-[200px] sm:max-w-[220px] xl:max-w-[230px] aspect-[499/818] h-[220px] sm:h-[250px] xl:h-[270px]">
                  <Image
                    src="/assets/homepage/banner/health.png"
                    alt="Healthcare & Clinical RPO - 3D Hospital & Clinical Ops Hub"
                    fill
                    sizes="(max-width: 768px) 200px, 230px"
                    className="object-contain object-center drop-shadow-[0_16px_32px_rgba(16,185,129,0.25)] transition-transform duration-500 group-hover:scale-[1.02]"
                    priority
                  />
                </div>
              </div>
            </div>

            {/* 3. FOOTER: Stack Tags across full card width */}
            <div className="pt-2.5 sm:pt-3 mt-3 sm:mt-4 border-t border-[#a7f3d0]/40">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[9.5px] sm:text-[10px] font-bold uppercase tracking-wider text-[#10b981] shrink-0 mr-1 flex items-center gap-1">
                  STACK:
                </span>
                {HEALTH_TRACK.essentialTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-[#99f6e4]/70 bg-[#f0fdfa] px-2.5 py-0.5 text-[9.5px] sm:text-[10px] font-semibold text-[#0f766e] shadow-2xs whitespace-nowrap hover:bg-[#ccfbf1] transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export interface SpecialistDeliveryTracksContent {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
}

export default function SpecialistDeliveryTracks({ content }: { content?: SpecialistDeliveryTracksContent } = {}) {
  const statsView = useInView<HTMLDivElement>();
  const eyebrow = content?.eyebrow ?? "Specialist-Led RPO & AI-Driven Talent Acquisition";
  const title = content?.title ?? "Enterprise RPO Powered by AI Interviewing and Domain Specialists";
  const subtitle = content?.subtitle ?? "Move beyond generalist recruiters. Pepoltek pairs AI-driven video interviewing and automated skill evaluation with dedicated teams of software engineers, medical specialists, and HR strategists to hand-vet every candidate.";

  return (
    <section
      id="specialist-tracks"
      className="relative w-full overflow-hidden bg-canvas-alt px-4 py-10 sm:px-6 sm:py-14 lg:px-10 lg:py-16"
    >
      {/* Ambient background aura */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[900px] -translate-x-1/2 rounded-full blur-3xl opacity-60 [background:radial-gradient(ellipse_at_center,rgba(10,132,255,0.12),transparent_65%)]" />

      <div className="relative mx-auto max-w-7xl 2xl:max-w-[1440px]">
        {/* Section Header */}
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-electric/25 bg-electric/[0.08] px-4 py-1 font-mono text-[10.5px] font-semibold tracking-[0.16em] uppercase text-electric shadow-sm backdrop-blur-sm">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-electric shadow-[0_0_6px_rgba(10,132,255,0.6)]" />
            {eyebrow}
          </div>

          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-[40px] leading-[1.14] line-clamp-2 text-balance">
            {title}
          </h2>

          <p className="mt-3 text-sm sm:text-base leading-relaxed text-ink-soft max-w-2xl">
            {subtitle}
          </p>
        </div>

        {/* Master Bento Container */}
        <MagicBento
          className="mt-8 sm:mt-10"
          glowColor="10, 132, 255"
          spotlightRadius={480}
          enableBorderGlow={true}
          enableStars={true}
          enableSpotlight={true}
          clickEffect={true}
          enableTilt={false}
          enableMagnetism={false}
        >
          {/* ================================================================= */}
          {/* ROW 1: Symmetrical 2-Column Tier (50% / 50%)                       */}
          {/* Left: AI Heading & 5 Specialist Pillars | Right: Active Sourcing  */}
          {/* ================================================================= */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-5 xl:gap-6 items-stretch">
            {/* --------------------------------------------------------------- */}
            {/* ROW 1 LEFT: Component 1 (AI Interviewing & 5 Specialist Pillars) */}
            {/* --------------------------------------------------------------- */}
            <div className="flex flex-col">
              <ParticleCard
                glowColor="10, 132, 255"
                particleCount={10}
                enableStars={true}
                enableBorderGlow={true}
                clickEffect={true}
                className="group cursor-target relative flex flex-col justify-between h-full overflow-hidden rounded-2xl border border-[#bcd6fa]/65 bg-white/90 p-4 sm:p-5 lg:p-5 shadow-[0_10px_28px_-18px_rgba(10,132,255,0.2)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-electric/70 hover:shadow-[0_20px_45px_-12px_rgba(10,132,255,0.28)]"
              >
                {/* Top ambient glow bar on hover */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-electric/[0.08] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                {/* Diagonal shine sweep on hover */}
                <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-full" />
                {/* Dot matrix grid */}
                <div className="pointer-events-none absolute inset-0 opacity-35 [background-image:radial-gradient(rgba(10,132,255,0.12)_1px,transparent_1.4px)] [background-size:18px_18px]" />

                <div ref={statsView.ref} className="relative z-10 flex flex-col h-full justify-between gap-2.5 sm:gap-3">
                  {/* Top Block: Title, Subtitle, and the Animated AI Graphic */}
                  <div className="flex items-center justify-between gap-3 border-b border-[#bcd6fa]/40 pb-2.5 sm:pb-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-electric shadow-[0_0_8px_2px_rgba(10,132,255,0.6)]" />
                        <span className="font-mono text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.18em] text-[#3d4c68]">
                          Enterprise RPO
                        </span>
                      </div>
                      <h2 className="mt-1 font-display text-[16px] sm:text-[18px] lg:text-[19.5px] font-extrabold tracking-tight text-[#0a1428] leading-[1.2]">
                        Powered by <span className="text-electric">AI Interviewing</span> and Domain Specialists
                      </h2>
                      <p className="mt-1 text-[11px] sm:text-[11.5px] leading-snug text-[#4b5b78] line-clamp-2 sm:line-clamp-none">
                        Move beyond generalist recruiters. Pepoltek pairs AI-driven video interviewing and automated skill evaluation with dedicated teams of software engineers, medical specialists, and HR strategists to hand-vet every candidate.
                      </p>
                    </div>

                    {/* Compact Animated AI processor chip & 5 orbiting specialist nodes in unified blue/cyan */}
                    <div className="shrink-0 self-center">
                      <AiSpecialistAnimation />
                    </div>
                  </div>

                  {/* Mid Header: Specialist RPO Execution Team */}
                  <div className="flex items-center justify-between gap-2 pt-0.5">
                    <h3 className="font-display text-[12.5px] sm:text-[13.5px] font-bold text-[#0a1428]">
                      Specialist RPO Execution Team
                    </h3>
                    <span className="font-mono text-[8px] sm:text-[8.5px] font-semibold text-electric bg-electric/[0.08] px-2 py-0.5 rounded-full border border-electric/25">
                      100% Specialist Hand-Verified
                    </span>
                  </div>

                  {/* 5 Core Specialist Pillars: Vertically Centered Transparent Border Circles + Inline SVGs (No Text Badges) */}
                  <div className="flex flex-col gap-1.5">
                    {EXECUTION_PILLARS.map((p, i) => (
                      <div
                        key={p.title}
                        className="group/pillar flex items-center justify-between gap-3 rounded-lg border border-[#bcd6fa]/45 bg-white/95 px-2.5 py-1.5 transition-all duration-200 hover:border-electric/60 hover:bg-white hover:shadow-xs"
                      >
                        {/* Vertically centered transparent border circle with enlarged dimensions */}
                        <div className="flex h-6.5 w-6.5 sm:h-7 sm:w-7 shrink-0 items-center justify-center rounded-full border border-electric/45 bg-electric/[0.04] font-mono text-[10.5px] sm:text-[11px] font-bold text-electric transition-colors duration-200 group-hover/pillar:border-electric group-hover/pillar:bg-electric/[0.08]">
                          {i + 1}
                        </div>

                        {/* Centered textual details */}
                        <div className="min-w-0 flex-1">
                          <h4 className="font-display text-[11.5px] sm:text-[12px] font-bold text-[#0a1428] leading-tight">
                            {p.title}
                          </h4>
                          <p className="mt-0.5 text-[9.5px] sm:text-[10px] leading-tight text-[#4b5b78]">
                            {p.desc}
                          </p>
                        </div>

                        {/* Sleek inline icon on the right (replacing text badge, unified electric blue) */}
                        <div className="flex h-6.5 w-6.5 sm:h-7 sm:w-7 shrink-0 items-center justify-center rounded-md bg-electric/[0.08] text-electric transition-transform duration-200 group-hover/pillar:scale-105">
                          {p.icon}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Executive Scaling Milestones Strip with Icons */}
                  {/* <div className="mt-auto pt-2.5 border-t border-[#bcd6fa]/40 grid grid-cols-2 gap-2 sm:gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="flex h-8 w-8 sm:h-8.5 sm:w-8.5 shrink-0 items-center justify-center rounded-lg bg-electric/10 text-electric">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <div className="font-display text-lg sm:text-xl font-extrabold text-electric leading-none whitespace-nowrap">
                          <Counter to={1000} seen={statsView.seen} suffix="+" />
                        </div>
                        <div className="mt-0.5 font-mono text-[8px] sm:text-[8.5px] font-bold uppercase tracking-wider text-[#0a1428] truncate">
                          Employees Scaled
                        </div>
                        <div className="text-[9.5px] text-[#6b7a95] truncate">
                          98% retention / 36 mo
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="flex h-8 w-8 sm:h-8.5 sm:w-8.5 shrink-0 items-center justify-center rounded-lg bg-[#0a1428]/10 text-[#0a1428]">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                          <polyline points="17 6 23 6 23 12" />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <div className="font-display text-lg sm:text-xl font-extrabold text-[#0a1428] leading-none whitespace-nowrap">
                          <Counter to={10} seen={statsView.seen} prefix="$" suffix="M+" />
                        </div>
                        <div className="mt-0.5 font-mono text-[8px] sm:text-[8.5px] font-bold uppercase tracking-wider text-[#0a1428] truncate">
                          Revenue Driven
                        </div>
                        <div className="text-[9.5px] text-[#6b7a95] truncate">
                          Enterprise Brand Tier
                        </div>
                      </div>
                    </div>
                  </div> */}
                </div>
              </ParticleCard>
            </div>

            {/* --------------------------------------------------------------- */}
            {/* ROW 1 RIGHT: Active RPO Sourcing Teams (World Map Backdrop)     */}
            {/* --------------------------------------------------------------- */}
            <div className="flex flex-col">
              <ParticleCard
                glowColor="10, 132, 255"
                particleCount={10}
                enableStars={true}
                enableBorderGlow={true}
                clickEffect={true}
                className="group cursor-target relative flex flex-col justify-between h-full overflow-hidden rounded-2xl border border-[#bcd6fa]/65 bg-white/90 p-4 sm:p-5 lg:p-5 shadow-[0_10px_28px_-18px_rgba(10,132,255,0.2)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-electric/70 hover:shadow-[0_20px_45px_-12px_rgba(10,132,255,0.28)]"
              >
                {/* Top ambient glow bar on hover */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-electric/[0.08] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                {/* Diagonal shine sweep on hover */}
                <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-full" />
                {/* Dot matrix grid */}
                <div className="pointer-events-none absolute inset-0 opacity-35 [background-image:radial-gradient(rgba(10,132,255,0.12)_1px,transparent_1.4px)] [background-size:18px_18px]" />

                {/* Card Header */}
                <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 border-b border-[#bcd6fa]/40 pb-2.5 sm:pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-electric shadow-[0_0_8px_2px_rgba(10,132,255,0.6)]" />
                      <span className="font-mono text-[10px] sm:text-[10.5px] font-semibold uppercase tracking-[0.18em] text-[#3d4c68]">
                        Active RPO Sourcing Teams
                      </span>
                    </div>
                    <div className="mt-1 font-display text-[15px] sm:text-[17px] lg:text-[18px] font-bold text-[#0a1428]">
                      Global talent time zones, one RPO delivery core
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-electric/25 bg-electric/[0.08] px-2 py-0.5 font-mono text-[8.5px] font-semibold tracking-[0.12em] uppercase text-electric shadow-xs">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-electric shadow-[0_0_6px_rgba(10,132,255,0.6)]" />
                    LIVE
                  </span>
                </div>

                {/* Animated SVG Network Map with Transparent World Map PNG Backdrop */}
                <div className="relative z-10 flex items-center justify-center my-auto w-full py-1">
                  <svg viewBox="0 0 100 66" className="w-full max-h-[235px] sm:max-h-[250px] overflow-visible" preserveAspectRatio="xMidYMid meet">
                    <defs>
                      <linearGradient id="dp-line-v2" x1="0" x2="1">
                        <stop offset="0%" stopColor="#0a84ff" stopOpacity="0.1" />
                        <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.95" />
                        <stop offset="100%" stopColor="#0a84ff" stopOpacity="0.9" />
                      </linearGradient>
                      <radialGradient id="dp-core-v2" cx="0.5" cy="0.5" r="0.5">
                        <stop offset="0%" stopColor="#38bdf8" />
                        <stop offset="100%" stopColor="#0a84ff" />
                      </radialGradient>

                      {/* SVG circular clip paths for authentic country badges */}
                      {POD_REGIONS.map((r) => (
                        <clipPath key={r.id} id={`flag-clip-${r.id}`}>
                          <circle cx={r.x} cy={r.y} r="3.6" />
                        </clipPath>
                      ))}
                    </defs>

                    {/* 1. Transparent Background World Map PNG rendered crisp inside the SVG */}
                    <image
                      href="/assets/world-map.png"
                      xlinkHref="/assets/world-map.png"
                      x="0"
                      y="0"
                      width="100"
                      height="66"
                      preserveAspectRatio="none"
                      opacity="0.65"
                    />

                    {/* 2. Concentric Radar / Orbital Rings around central RPO */}
                    <circle
                      cx="50"
                      cy="31"
                      r="13"
                      fill="none"
                      stroke="#0a84ff"
                      strokeWidth="0.35"
                      strokeDasharray="1.5 2.5"
                      opacity="0.3"
                    />
                    <circle
                      cx="50"
                      cy="31"
                      r="24"
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="0.3"
                      strokeDasharray="1 3.5"
                      opacity="0.25"
                    />

                    {/* 3. Arced connector lines from each country node to the central RPO */}
                    {POD_REGIONS.map((r, i) => (
                      <path
                        key={r.id}
                        d={r.arcPath}
                        fill="none"
                        stroke="url(#dp-line-v2)"
                        strokeWidth="0.55"
                        strokeDasharray="2 2"
                        className="dp-dash"
                        style={{ animationDelay: `${i * 0.25}s` }}
                        opacity="0.9"
                      />
                    ))}

                    {/* 4. Central RPO Core at (50, 31) */}
                    <circle cx="50" cy="31" r="5.8" fill="url(#dp-core-v2)" filter="drop-shadow(0 0 7px rgba(10,132,255,0.6))" />
                    <circle cx="50" cy="31" r="5.8" fill="none" stroke="#38bdf8" strokeWidth="0.7" />
                    <text
                      x="50"
                      y="32.2"
                      textAnchor="middle"
                      fontSize="2.5"
                      fill="#ffffff"
                      fontFamily="var(--font-jetbrains-mono), monospace"
                      fontWeight="800"
                      letterSpacing="0.05em"
                    >
                      RPO
                    </text>

                    {/* 5. 7 Global Country Nodes with Authentic Flags & Labels */}
                    {POD_REGIONS.map((r, i) => (
                      <CountryBadge key={r.id} r={r} i={i} />
                    ))}
                  </svg>
                </div>

                {/* 3 Telemetry Metrics Strip with Icons */}
                <div className="relative z-10 mt-auto pt-2.5 border-t border-[#bcd6fa]/40 grid grid-cols-3 gap-2">
                  <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                    <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg bg-electric/10 text-electric">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <div className="font-display text-base sm:text-lg font-extrabold text-electric leading-none">
                        18+
                      </div>
                      <div className="mt-0.5 font-mono text-[7.5px] sm:text-[8px] font-bold uppercase tracking-wider text-[#0a1428] truncate">
                        Active RPO Teams
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 border-l border-[#bcd6fa]/40 pl-2 sm:pl-3">
                    <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg bg-electric/10 text-electric">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <div className="font-display text-base sm:text-lg font-extrabold text-electric leading-none">
                        7
                      </div>
                      <div className="mt-0.5 font-mono text-[7.5px] sm:text-[8px] font-bold uppercase tracking-wider text-[#0a1428] truncate">
                        Time Zones Covered
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 border-l border-[#bcd6fa]/40 pl-2 sm:pl-3">
                    <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg bg-electric/10 text-electric">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 6v6l4 2" />
                        <path d="M4 12a8 8 0 0 1 14.93-4" />
                        <polyline points="20 4 20 8 16 8" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <div className="font-display text-base sm:text-lg font-extrabold text-electric leading-none">
                        24/7
                      </div>
                      <div className="mt-0.5 font-mono text-[7.5px] sm:text-[8px] font-bold uppercase tracking-wider text-[#0a1428] truncate">
                        Live Sourcing
                      </div>
                    </div>
                  </div>
                </div>
              </ParticleCard>
            </div>
          </div>

          {/* ================================================================= */}
          {/* ROW 2: Dual Specialization Tracks in Single-Row Symmetrical Flex */}
          {/* Technology on Left (3D Laptop Wing) | Healthcare on Right (3D Hospital Wing) */}
          {/* ================================================================= */}
          <DualTrackUnifiedBanner />
        </MagicBento>
      </div>

      {/* Scoped CSS animations */}
      <style>{`
        @keyframes dpDash { to { stroke-dashoffset: -8; } }
        .dp-dash { animation: dpDash 1.6s linear infinite; }
        @keyframes float-node {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
      `}</style>
    </section>
  );
}
