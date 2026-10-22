"use client";

import React from "react";

/* ==========================================================================
   WIDGET 1: 24/7 GLOBAL DELIVERY & TIMEZONE OVERLAP ENGINE
   Standardized 6 Client & Delivery Regions per Audit Spec
   With Vector Flag Badges and Visual Overlap Timeline from Image 1 & 2
   ========================================================================== */

interface RegionZone {
  id: string;
  name: string;
  subtext: string;
  flag: string;
  start: number;
  end: number;
  hours: string;
  coverage: string;
  rightDetail: string;
}

const REGION_ZONES: RegionZone[] = [
  {
    id: "na",
    name: "N. America",
    subtext: "EST / CST / MST / PST",
    flag: "na",
    start: 13,
    end: 21,
    hours: "8h live",
    coverage: "4 to 6h Guaranteed Overlap",
    rightDetail: "PST / MST / CST / EST",
  },
  {
    id: "latam",
    name: "LATAM",
    subtext: "BRT / ART",
    flag: "latam",
    start: 12,
    end: 20,
    hours: "8h live",
    coverage: "5 to 7h Synchronous Overlap",
    rightDetail: "8h live window",
  },
  {
    id: "europe",
    name: "Europe",
    subtext: "CET / CEST",
    flag: "europe",
    start: 8,
    end: 17,
    hours: "9h live",
    coverage: "5 to 8h Guaranteed Overlap",
    rightDetail: "CET / CEST",
  },
  {
    id: "gcc",
    name: "GCC",
    subtext: "GST",
    flag: "gcc",
    start: 5,
    end: 14,
    hours: "9h live",
    coverage: "6 to 8h Guaranteed Overlap",
    rightDetail: "GST",
  },
  {
    id: "india",
    name: "India",
    subtext: "IST",
    flag: "india",
    start: 4,
    end: 13,
    hours: "9h live",
    coverage: "6 to 8h Guaranteed Overlap",
    rightDetail: "IST",
  },
  {
    id: "bangladesh",
    name: "Bangladesh",
    subtext: "BST",
    flag: "bangladesh",
    start: 3,
    end: 19,
    hours: "16h live",
    coverage: "24/7 Follow-the-Sun Core",
    rightDetail: "BST, India IST, & APAC Delivery Hub",
  },
];

const EU_FLAG_STARS = [
  { deg: 0, cx: 12, cy: 5.5 },
  { deg: 30, cx: 15.25, cy: 6.37 },
  { deg: 60, cx: 17.63, cy: 8.75 },
  { deg: 90, cx: 18.5, cy: 12 },
  { deg: 120, cx: 17.63, cy: 15.25 },
  { deg: 150, cx: 15.25, cy: 17.63 },
  { deg: 180, cx: 12, cy: 18.5 },
  { deg: 210, cx: 8.75, cy: 17.63 },
  { deg: 240, cx: 6.37, cy: 15.25 },
  { deg: 270, cx: 5.5, cy: 12 },
  { deg: 300, cx: 6.37, cy: 8.75 },
  { deg: 330, cx: 8.75, cy: 6.37 },
];

function RegionFlag({ region }: { region: string }) {
  switch (region) {
    case "na":
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 rounded-full shadow-sm shrink-0">
          <circle cx="12" cy="12" r="12" fill="#ffffff" />
          <g clipPath="url(#flag-us-gdm-clip)">
            <rect width="24" height="24" fill="#b91c1c" />
            <path d="M0 3.7h24v2.5H0zm0 4.9h24v2.5H0zm0 4.9h24v2.5H0zm0 4.9h24v2.5H0z" fill="#ffffff" />
            <rect width="11" height="11" fill="#1e3a8a" />
            <circle cx="2.5" cy="2.5" r="0.75" fill="#ffffff" />
            <circle cx="5.5" cy="2.5" r="0.75" fill="#ffffff" />
            <circle cx="8.5" cy="2.5" r="0.75" fill="#ffffff" />
            <circle cx="4" cy="5.5" r="0.75" fill="#ffffff" />
            <circle cx="7" cy="5.5" r="0.75" fill="#ffffff" />
            <circle cx="2.5" cy="8.5" r="0.75" fill="#ffffff" />
            <circle cx="5.5" cy="8.5" r="0.75" fill="#ffffff" />
            <circle cx="8.5" cy="8.5" r="0.75" fill="#ffffff" />
          </g>
          <defs>
            <clipPath id="flag-us-gdm-clip">
              <circle cx="12" cy="12" r="12" />
            </clipPath>
          </defs>
        </svg>
      );
    case "latam":
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 rounded-full shadow-sm shrink-0">
          <circle cx="12" cy="12" r="12" fill="#15803d" />
          <polygon points="12,3.5 20.5,12 12,20.5 3.5,12" fill="#facc15" />
          <circle cx="12" cy="12" r="5" fill="#1d4ed8" />
          <path d="M7.5 12.5 Q12 10.2 16.5 13" stroke="#ffffff" strokeWidth="0.9" fill="none" />
        </svg>
      );
    case "europe":
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 rounded-full shadow-sm shrink-0">
          <circle cx="12" cy="12" r="12" fill="#003399" />
          {EU_FLAG_STARS.map((star) => (
            <circle key={star.deg} cx={star.cx} cy={star.cy} r="0.75" fill="#ffcc00" />
          ))}
        </svg>
      );
    case "gcc":
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 rounded-full shadow-sm shrink-0">
          <g clipPath="url(#flag-gcc-gdm-clip)">
            <rect width="24" height="8" fill="#15803d" />
            <rect y="8" width="24" height="8" fill="#ffffff" />
            <rect y="16" width="24" height="8" fill="#0f172a" />
            <rect width="7.5" height="24" fill="#dc2626" />
          </g>
          <defs>
            <clipPath id="flag-gcc-gdm-clip">
              <circle cx="12" cy="12" r="12" />
            </clipPath>
          </defs>
        </svg>
      );
    case "india":
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 rounded-full shadow-sm shrink-0">
          <g clipPath="url(#flag-in-gdm-clip)">
            <rect width="24" height="8" fill="#ea580c" />
            <rect y="8" width="24" height="8" fill="#ffffff" />
            <rect y="16" width="24" height="8" fill="#15803d" />
            <circle cx="12" cy="12" r="2.8" fill="none" stroke="#1e3a8a" strokeWidth="0.8" />
            <circle cx="12" cy="12" r="0.7" fill="#1e3a8a" />
          </g>
          <defs>
            <clipPath id="flag-in-gdm-clip">
              <circle cx="12" cy="12" r="12" />
            </clipPath>
          </defs>
        </svg>
      );
    case "bangladesh":
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 rounded-full shadow-sm shrink-0">
          <circle cx="12" cy="12" r="12" fill="#006a4e" />
          <circle cx="10.8" cy="12" r="4.8" fill="#f42a41" />
        </svg>
      );
    default:
      return null;
  }
}

const hourTicks = [0, 4, 8, 12, 16, 20, 24];

export default function GlobalDeliveryMatrix() {
  return (
    <div className="rounded-2xl border border-[#bcd6fa]/70 bg-white/95 p-4 sm:p-5 shadow-[0_20px_50px_-24px_rgba(10,132,255,0.2)] backdrop-blur-md">
      {/* Header with Motive & Purpose */}
      <div className="border-b border-[#bcd6fa]/40 pb-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-electric shadow-[0_0_8px_2px_rgba(10,132,255,0.6)]" />
            <span className="font-mono text-[10.5px] sm:text-[11px] font-semibold uppercase tracking-[0.16em] text-electric">
              Operational Overlap Motive
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-full border border-electric/25 bg-electric/[0.08] px-2.5 py-0.5 font-sans text-[10.5px] font-semibold text-electric shadow-sm backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-signal shadow-[0_0_6px_rgba(16,185,129,0.7)]" />
            Guaranteed Live Collaboration
          </div>
        </div>

        <h3 className="mt-2 font-display text-base sm:text-lg font-bold text-ink">
          24/7 Global Delivery &amp; Timezone Overlap Engine
        </h3>
        <p className="mt-1.5 text-xs sm:text-[13px] leading-relaxed text-ink-soft">
          Guaranteed 4 to 6 hours of synchronous daily overlap inside your business hours for live standups, pairing, and same-day PR triage, backed by our 24/7 follow-the-sun delivery core.
        </p>
      </div>

      {/* Matrix Ruler & Rows with horizontal scroll protection on mobile */}
      <div className="mt-3.5 overflow-x-auto no-scrollbar">
        <div className="min-w-[460px] sm:min-w-0">
          {/* 24-Hour Timeline Bar Scale - Offset matches left label width */}
          <div className="mb-2 ml-[145px] sm:ml-[160px] flex justify-between font-sans text-[10px] font-medium text-mist">
            {hourTicks.map((t) => (
              <span key={t}>{String(t).padStart(2, "0")}h</span>
            ))}
          </div>

          {/* Region Rows: Left Flag + 2 Lines, Coverage Up on Bar Side */}
          <div className="flex flex-col gap-3">
            {REGION_ZONES.map((zone, i) => {
              const leftPct = (zone.start / 24) * 100;
              const widthPct = ((zone.end - zone.start) / 24) * 100;

              return (
                <div
                  key={zone.name}
                  className="flex items-center"
                  style={{ animation: "pt-rise .5s ease both", animationDelay: `${i * 60}ms` }}
                >
                  {/* Left Column: Flag + Region Name + Subtext */}
                  <div className="w-[145px] sm:w-[160px] shrink-0 pr-2 sm:pr-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <RegionFlag region={zone.flag} />
                      <div className="min-w-0">
                        <div className="font-sans text-[12.5px] sm:text-[13px] font-bold text-ink leading-tight truncate">
                          {zone.name}
                        </div>
                        <div className="font-sans text-[10.5px] sm:text-[11px] text-mist leading-tight mt-0.5 truncate">
                          {zone.subtext}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Coverage Upper, Timeline Bar Lower */}
                  <div className="flex-1 flex flex-col justify-center">
                    {/* Coverage condition above the bar */}
                    <div className="flex items-center justify-between font-sans text-[10.5px] sm:text-[11px] mb-1 leading-none">
                      <span className="font-semibold text-electric truncate">
                        {zone.coverage}
                      </span>
                      <span className="text-mist text-[10px] font-sans hidden xl:inline shrink-0 ml-1">
                        {zone.rightDetail}
                      </span>
                    </div>

                    {/* Timeline Bar Track */}
                    <div className="relative h-6 sm:h-7 w-full overflow-hidden rounded-md bg-[#eef4fd] ring-1 ring-inset ring-[#bcd6fa]/70">
                      {/* Hour marker guide lines */}
                      {hourTicks.slice(1, -1).map((t) => (
                        <span
                          key={t}
                          className="absolute top-0 h-full w-px bg-[#bcd6fa]/50"
                          style={{ left: `${(t / 24) * 100}%` }}
                        />
                      ))}

                      {/* Radiant Active Synchronous Overlap Bar */}
                      <div
                        className="absolute top-1/2 h-5 sm:h-5.5 -translate-y-1/2 rounded-[5px] shadow-[0_0_18px_-2px_rgba(10,132,255,0.45)] overflow-hidden transition-all duration-300"
                        style={{
                          left: `${leftPct}%`,
                          width: `${widthPct}%`,
                          background: "linear-gradient(90deg, var(--color-electric), var(--color-electric-bright))",
                        }}
                      >
                        <span className="pointer-events-none absolute inset-0 flex items-center justify-center font-sans text-[9.5px] sm:text-[10px] font-bold text-white tracking-wide">
                          {zone.hours}
                        </span>
                        <span
                          className="pointer-events-none absolute inset-y-0 w-1/3 bg-white/35 blur-[2px]"
                          style={{ animation: `pt-sweep 3.4s ${i * 0.4}s ease-in-out infinite` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
