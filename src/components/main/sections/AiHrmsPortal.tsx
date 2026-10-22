"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatedChevrons } from "@/components/ui/AnimatedChevrons";

/* ---------- in-view trigger (replays animations per entry) ---------- */
function useInView<T extends HTMLElement>(threshold = 0.3) {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => setSeen(e.isIntersecting),
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, seen] as const;
}

/* ---------- count-up ---------- */
function CountUp({
  to,
  dur = 900,
  suffix = "",
  decimals = 0,
  play,
}: {
  to: number;
  dur?: number;
  suffix?: string;
  decimals?: number;
  play: boolean;
}) {
  const [v, setV] = useState(0);
  const raf = useRef(0);
  useEffect(() => {
    if (!play) {
      setV(0);
      return;
    }
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setV(to * eased);
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [play, to, dur]);
  return (
    <>
      {v.toFixed(decimals)}
      {suffix}
    </>
  );
}

/* ---------- radial gauge ---------- */
function Gauge({
  value,
  label,
  sub,
  play,
  delay = 0,
}: {
  value: number;
  label: string;
  sub: string;
  play: boolean;
  delay?: number;
}) {
  const r = 34;
  const circ = 2 * Math.PI * r;
  const off = circ * (1 - (play ? value / 100 : 0));
  return (
    <div className="flex flex-col items-center">
      <div className="relative h-[76px] w-[76px] sm:h-[88px] sm:w-[88px]">
        <svg viewBox="0 0 84 84" className="h-full w-full -rotate-90">
          <defs>
            <linearGradient id="hrms-g" x1="0" y1="0" x2="84" y2="84" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0a84ff" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
          </defs>
          <circle cx="42" cy="42" r={r} fill="none" stroke="#d6e3f7" strokeWidth="6.5" />
          <circle
            cx="42"
            cy="42"
            r={r}
            fill="none"
            stroke="url(#hrms-g)"
            strokeWidth="6.5"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={off}
            style={{ transition: `stroke-dashoffset 1.1s cubic-bezier(0.22,1,0.36,1) ${delay}ms` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-lg sm:text-xl font-extrabold text-ink">
            <CountUp to={value} play={play} dur={1100} />
          </span>
          <span className="font-mono text-[8px] text-mist">/100</span>
        </div>
      </div>
      <div className="mt-1.5 text-center">
        <div className="font-display text-[12px] sm:text-[13px] font-bold text-ink leading-tight">{label}</div>
        <div className="font-mono text-[8.5px] uppercase tracking-[0.1em] text-mist">{sub}</div>
      </div>
    </div>
  );
}

/* ---------- data ---------- */
const TABS = [
  { id: 0, k: "1", label: "Natural Query" },
  { id: 1, k: "2", label: "Audit Logs" },
  { id: 2, k: "3", label: "Scorecards" },
];

const CANDIDATES = [
  { init: "PN", name: "Priya Nair", role: "Senior Backend Engineer • 7y Node.js", score: 94, visa: "H-1B", visaTone: "el", tz: "GMT+5:30 • 4h overlap", model: "C2C ready" },
  { init: "MR", name: "Marco Ruiz", role: "Staff Node.js Engineer • 8y", score: 91, visa: "OPT / STEM", visaTone: "br", tz: "GMT-3 • 6h overlap", model: "W2" },
  { init: "LF", name: "Lena Fischer", role: "Backend Engineer • 6y Node.js", score: 88, visa: "EU Blue Card", visaTone: "gr", tz: "CET • 7h overlap", model: "EOR" },
];

const TERMINAL = [
  { t: "$ pepoltek audit --candidate PN-4471 --suite full", cls: "text-white/50" },
  { t: "✓ static analysis ........... clean", cls: "text-white/80" },
  { t: "✓ redis memory safety ....... [ PASS ]", cls: "text-signal" },
  { t: "✓ kafka backpressure ........ [ PASS ]", cls: "text-signal" },
  { t: "✓ system design review ...... 96 / 100", cls: "text-electric-bright" },
  { t: "✓ integration benchmarks .... 14/14 clean", cls: "text-signal" },
  { t: "[ PASSED ] audit sealed • hash 0xA1F89C", cls: "text-white" },
];

const PILL = {
  el: "border-electric/30 bg-electric/10 text-electric",
  br: "border-electric-bright/40 bg-electric-bright/10 text-[#0b74c9]",
  gr: "border-signal/30 bg-signal/10 text-signal",
} as const;

export interface AiHrmsPortalContent {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
}

export default function AiHrmsPortal({ content }: { content?: AiHrmsPortalContent } = {}) {
  const [tab, setTab] = useState(0);
  const [ref, inView] = useInView<HTMLDivElement>(0.25);
  const [typed, setTyped] = useState(0);
  const [visibleRows, setVisibleRows] = useState(0);
  const [termLines, setTermLines] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const eyebrow = content?.eyebrow ?? "Proprietary HR Technology";
  const title = content?.title ?? "Ask for the shortlist in plain language.";
  const subtitle = content?.subtitle ?? "Our AI-HRMS portal translates natural language queries into instant, verified talent pipelines with match score, work authorization, timezone overlap, and hard-coded engineering audits.";

  const QUERY = "Filter software engineers with 5+ years in Node.js and C2C readiness";

  // Auto-play timer to cycle through tabs every 7 seconds
  useEffect(() => {
    if (!inView || isPaused) return;
    const timer = setInterval(() => {
      setTab((prev) => (prev + 1) % TABS.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [inView, isPaused, tab]);

  // typing + staged reveal for tab 1
  useEffect(() => {
    if (tab !== 0 || !inView) return;
    setTyped(0);
    setVisibleRows(0);
    let i = 0;
    const type = setInterval(() => {
      i += 1;
      setTyped(i);
      if (i >= QUERY.length) {
        clearInterval(type);
        [0, 1, 2].forEach((n) => setTimeout(() => setVisibleRows(n + 1), 300 + n * 260));
      }
    }, 26);
    return () => clearInterval(type);
  }, [tab, inView]);

  // terminal streaming for tab 2
  useEffect(() => {
    if (tab !== 1 || !inView) return;
    setTermLines(0);
    let n = 0;
    const id = setInterval(() => {
      n += 1;
      setTermLines(n);
      if (n >= TERMINAL.length) clearInterval(id);
    }, 340);
    return () => clearInterval(id);
  }, [tab, inView]);

  return (
    <section ref={ref} id="ai-hrms" className="relative w-full overflow-hidden bg-canvas-alt border-y border-[#bcd6fa]/35 px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
      {/* Atmosphere Background Graphic Image */}
      <div className="pointer-events-none absolute inset-0 z-0 select-none">
        <img
          src="/backgrounds/worksprint_bg.png"
          alt=""
          className="h-full w-full object-cover object-center"
        />
      </div>

      {/* ambient */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-60 [background-image:radial-gradient(rgba(10,132,255,0.07)_1px,transparent_1.4px)] [background-size:28px_28px]" />
      <div className="pointer-events-none absolute left-1/2 top-24 z-0 h-[380px] w-[820px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.14),transparent_64%)] blur-2xl" />

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2 lg:gap-14">
        {/* left: copy + features */}
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-electric/20 bg-electric/[0.07] px-4 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-electric backdrop-blur-sm">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-electric" />
            {eyebrow}
          </div>
          <h2 className="mt-4 font-display text-3xl font-extrabold leading-[1.08] tracking-tight text-ink sm:text-4xl lg:text-[42px] line-clamp-2 text-balance">
            {title}
          </h2>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-ink-soft sm:text-lg">
            {subtitle}
          </p>

          {/* features */}
          <ul className="mt-8 space-y-3">
            {[
              {
                id: 0,
                title: "Natural Language Query",
                body: "Query in plain English to get ranked matches with match score, work authorization, timezone overlap, and engagement model.",
                icon: <path d="M12 3v2M5 8l1.4 1.4M19 8l-1.4 1.4M12 21a5 5 0 0 0 5-5c0-2.5-2-3.5-2-6a3 3 0 0 0-6 0c0 2.5-2 3.5-2 6a5 5 0 0 0 5 5Z" />,
              },
              {
                id: 1,
                title: "System Design Audit Logs",
                body: "Every ranking ships with code quality, test coverage, and Redis and Kafka memory safety validation you can inspect.",
                icon: (
                  <>
                    <path d="m7 8-4 4 4 4" />
                    <path d="m17 8 4 4-4 4" />
                    <path d="M14 4 10 20" />
                  </>
                ),
              },
              {
                id: 2,
                title: "Video Scorecards",
                body: "HEXACO, OCEAN, and BEI signals paired with a 90 second technical explainer clip for every finalist.",
                icon: (
                  <>
                    <rect x="3" y="5" width="14" height="14" rx="2" />
                    <path d="m17 9 4-2v10l-4-2" />
                  </>
                ),
              },
            ].map((f) => {
              const active = tab === f.id;
              return (
                <li
                  key={f.title}
                  role="button"
                  tabIndex={0}
                  onClick={() => setTab(f.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setTab(f.id);
                    }
                  }}
                  className={`cursor-target group flex cursor-pointer gap-3 rounded-xl border p-3 transition-all duration-200 sm:p-3.5 ${
                    active
                      ? "border-electric/50 bg-white shadow-[0_8px_20px_-10px_rgba(10,132,255,0.25)]"
                      : "border-[#bcd6fa]/50 bg-white/60 hover:border-border hover:bg-white/85"
                  }`}
                >
                  <span
                    className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-all duration-200 ${
                      active
                        ? "border-electric bg-electric text-white shadow-sm shadow-electric/25"
                        : "border-border bg-white text-electric shadow-sm group-hover:border-electric/40"
                    }`}
                  >
                    <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      {f.icon}
                    </svg>
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className={`font-display text-[14px] font-bold transition-colors ${active ? "text-electric" : "text-ink"}`}>
                      {f.title}
                    </div>
                    <p className="mt-0.5 text-[12.5px] leading-relaxed text-ink-soft">{f.body}</p>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* cta */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="#deploy"
              className="group inline-flex items-center justify-center gap-2.5 rounded-xl bg-ink px-6 py-3 font-display text-sm font-bold text-white shadow-[0_8px_20px_-4px_rgba(10,20,40,0.45)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-electric hover:shadow-[0_12px_28px_-6px_rgba(10,132,255,0.5)] active:translate-y-0 cursor-pointer"
            >
              <span>Open the AI HRMS demo</span>
              <AnimatedChevrons size={13} count={3} />
            </Link>
            <Link
              href="#contact"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-5 py-3 font-display text-sm font-600 text-ink transition-all duration-200 hover:-translate-y-0.5 hover:border-electric/50 hover:text-electric"
            >
              Book a guided tour
            </Link>
          </div>
        </div>

        {/* right: portal frame */}
        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* glow edge with reduced border radius */}
          <div className="ai-edge pointer-events-none absolute -inset-px rounded-xl" />
          <div className="relative overflow-hidden rounded-xl border border-border bg-surface shadow-[0_20px_60px_-25px_rgba(10,132,255,0.3)]">
            {/* browser chrome */}
            <div className="flex items-center gap-2.5 border-b border-border/70 bg-gradient-to-b from-[#f4f8ff] to-white px-3.5 py-2 sm:px-4 sm:py-2.5">
              <div className="flex gap-1.5 shrink-0">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              </div>
              <div className="mx-auto flex items-center gap-1.5 rounded-md border border-border bg-white px-3 py-0.5 font-mono text-[10px] sm:text-[10.5px] text-mist truncate">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-signal" />
                <span>portal.pepoltek.ai</span>
                <span className="text-ink-soft">/ shortlist</span>
              </div>
              <span className="hidden font-mono text-[9.5px] uppercase tracking-[0.12em] text-electric sm:inline shrink-0">Live</span>
            </div>

            {/* tab nav: guaranteed 1-row grid with reduced padding and text size */}
            <div className="grid grid-cols-3 gap-1.5 border-b border-border/70 bg-[#f7faff] p-1.5 sm:gap-2 sm:p-2">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`group relative flex items-center justify-center gap-1 rounded-lg border px-1.5 py-1.5 font-display text-[10px] font-semibold transition-all duration-200 sm:px-2.5 sm:py-1.5 sm:text-[11.5px] ${
                    tab === t.id
                      ? "border-electric bg-electric text-white shadow-sm shadow-electric/25"
                      : "border-border bg-white text-ink-soft hover:border-electric/40 hover:text-ink"
                  }`}
                >
                  <span className={`font-mono text-[9px] font-bold sm:text-[10px] shrink-0 ${tab === t.id ? "text-white/80" : "text-electric"}`}>
                    [{t.k}]
                  </span>
                  <span className="truncate">{t.label}</span>
                </button>
              ))}
            </div>

            {/* panels */}
            <div className="relative min-h-[400px] bg-gradient-to-br from-white via-[#f9fcff] to-[#eef4fd] p-3.5 sm:p-5">
              {/* ---------- TAB 1: NL query ---------- */}
              {tab === 0 && (
                <div key="t0" className="ai-fade">
                  {/* query bar */}
                  <div className="flex items-center gap-2 rounded-xl border border-border bg-white px-3 py-2.5 shadow-sm">
                    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-electric" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 3v2M5 8l1.4 1.4M19 8l-1.4 1.4M12 21a5 5 0 0 0 5-5c0-2.5-2-3.5-2-6a3 3 0 0 0-6 0c0 2.5-2 3.5-2 6a5 5 0 0 0 5 5Z" />
                    </svg>
                    <div className="min-w-0 flex-1 font-mono text-[11px] leading-snug text-ink sm:text-[12px] truncate">
                      {QUERY.slice(0, typed)}
                      <span className="ai-caret ml-0.5 inline-block h-[13px] w-[2px] translate-y-[2px] bg-electric" />
                    </div>
                    <button className="shrink-0 items-center gap-1 rounded-md bg-electric px-2.5 py-1 font-display text-[10.5px] font-semibold text-white transition-colors hover:bg-electric-bright inline-flex">
                      Run →
                    </button>
                  </div>
                  <div className="mt-2.5 flex flex-wrap items-center justify-between gap-1.5 font-mono text-[9px] uppercase tracking-[0.08em] text-mist">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="rounded border border-border bg-white px-2 py-0.5">Node.js</span>
                      <span className="rounded border border-border bg-white px-2 py-0.5">5+ yrs</span>
                      <span className="rounded border border-border bg-white px-2 py-0.5">C2C ready</span>
                    </div>
                    <span className="normal-case text-electric text-[9.5px] font-medium">3 ranked matches · audited</span>
                  </div>

                  {/* results */}
                  <div className="mt-3.5 space-y-2">
                    {CANDIDATES.map((c, i) => (
                      <div
                        key={c.init}
                        className={`cursor-target group grid grid-cols-[auto_1fr_auto] items-center gap-2.5 sm:gap-3 rounded-xl border border-border bg-white p-2.5 sm:p-3 transition-all duration-300 hover:border-electric/40 hover:shadow-sm ${
                          visibleRows > i ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                        }`}
                        style={{ transitionDelay: `${i * 40}ms` }}
                      >
                        <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-electric to-electric-bright font-display text-xs sm:text-sm font-700 text-white shadow-sm">
                          {c.init}
                        </div>
                        <div className="min-w-0">
                          <div className="truncate font-display text-[13px] sm:text-[13.5px] font-700 text-ink leading-tight">{c.name}</div>
                          <div className="truncate font-mono text-[10px] sm:text-[10.5px] text-ink-soft leading-tight mt-0.5">{c.role}</div>
                          <div className="mt-1 flex flex-wrap items-center gap-1">
                            <span className={`rounded border px-1.5 py-0.2 font-mono text-[8.5px] font-600 ${PILL[c.visaTone as keyof typeof PILL]}`}>{c.visa}</span>
                            <span className="rounded border border-border bg-canvas px-1.5 py-0.2 font-mono text-[8.5px] text-ink-soft truncate max-w-[120px]">{c.tz}</span>
                            <span className="rounded border border-border bg-canvas px-1.5 py-0.2 font-mono text-[8.5px] text-ink-soft">{c.model}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-0.5 shrink-0 pl-1">
                          <div className="font-display text-sm sm:text-base font-800 leading-none text-electric">
                            <CountUp to={c.score} play={visibleRows > i} suffix="%" dur={800} />
                          </div>
                          <div className="h-1 w-12 sm:w-14 overflow-hidden rounded-full bg-[#e3ecfa] mt-0.5">
                            <div className="h-full rounded-full bg-gradient-to-r from-electric to-electric-bright transition-[width] duration-[900ms] ease-out" style={{ width: visibleRows > i ? `${c.score}%` : "0%" }} />
                          </div>
                          <div className="font-mono text-[7.5px] sm:text-[8px] uppercase tracking-[0.06em] text-mist whitespace-nowrap">match score</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ---------- TAB 2: audit logs ---------- */}
              {tab === 1 && (
                <div key="t1" className="ai-fade flex flex-col gap-3">
                  {/* metric tiles in a 2-column grid with zero text overflow */}
                  <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                    <div className="rounded-xl border border-border bg-white p-2.5 sm:p-3 shadow-sm min-w-0">
                      <div className="font-display text-lg sm:text-xl font-extrabold text-ink leading-none">
                        <CountUp to={96} play={inView && tab === 1} suffix="/100" />
                      </div>
                      <div className="mt-1.5 font-mono text-[8.5px] sm:text-[9px] uppercase tracking-[0.06em] text-mist truncate">
                        Code Quality
                      </div>
                    </div>

                    <div className="rounded-xl border border-border bg-white p-2.5 sm:p-3 shadow-sm min-w-0">
                      <div className="font-display text-lg sm:text-xl font-extrabold text-ink leading-none">
                        <CountUp to={94} play={inView && tab === 1} suffix="%" />
                      </div>
                      <div className="mt-1.5 font-mono text-[8.5px] sm:text-[9px] uppercase tracking-[0.06em] text-mist truncate">
                        Test Coverage
                      </div>
                    </div>

                    <div className="flex items-center gap-2 rounded-xl border border-border bg-white p-2 sm:p-2.5 min-w-0 shadow-sm">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-signal/10 text-signal">
                        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="font-display text-[11px] sm:text-[12px] font-bold text-ink truncate leading-tight">
                          Redis memory
                        </div>
                        <div className="font-mono text-[8.5px] uppercase tracking-[0.06em] text-signal font-semibold leading-tight">
                          Validated
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 rounded-xl border border-border bg-white p-2 sm:p-2.5 min-w-0 shadow-sm">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-signal/10 text-signal">
                        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="font-display text-[11px] sm:text-[12px] font-bold text-ink truncate leading-tight">
                          Kafka backpressure
                        </div>
                        <div className="font-mono text-[8.5px] uppercase tracking-[0.06em] text-signal font-semibold leading-tight">
                          Validated
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* terminal with full width and overflow control */}
                  <div className="overflow-hidden rounded-xl border border-[#0b1d3a] bg-[#0a1428] shadow-[0_16px_40px_-20px_rgba(10,20,40,0.8)]">
                    <div className="flex items-center gap-2 border-b border-white/10 px-3 py-1.5">
                      <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
                      <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
                      <span className="h-2 w-2 rounded-full bg-[#28c840]" />
                      <span className="ml-2 font-mono text-[10px] text-white/40">candidate-PN-4471.log</span>
                    </div>
                    <div className="space-y-1 p-3 font-mono text-[10px] sm:text-[11px] leading-relaxed overflow-x-auto">
                      {TERMINAL.map((l, i) => (
                        <div key={i} className={`whitespace-nowrap transition-all duration-300 ${termLines > i ? "translate-x-0 opacity-100" : "translate-x-2 opacity-0"} ${l.cls}`}>
                          {l.t}
                        </div>
                      ))}
                      {termLines >= TERMINAL.length && (
                        <div className="mt-2 inline-flex items-center gap-1.5 rounded-md border border-signal/40 bg-signal/10 px-2.5 py-0.5 font-mono text-[9.5px] font-semibold text-signal">
                          <span className="h-1.5 w-1.5 rounded-full bg-signal" /> 14 / 14 benchmarks clean
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ---------- TAB 3: behavioral scorecards ---------- */}
              {tab === 2 && (
                <div key="t2" className="ai-fade flex flex-col gap-3">
                  {/* video preview */}
                  <div className="group relative overflow-hidden rounded-xl border border-border bg-[#0a1428] shadow-sm">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_30%,rgba(10,132,255,0.35),transparent_60%)]" />
                    <div className="pointer-events-none absolute inset-0 opacity-25 [background-image:radial-gradient(rgba(255,255,255,0.4)_1px,transparent_1.2px)] [background-size:18px_18px]" />
                    <div className="relative flex flex-col justify-between p-3.5 sm:p-4">
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.1em] text-white/80 backdrop-blur-sm">
                          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#ff5f57]" /> Technical explainer
                        </span>
                        <span className="font-mono text-[10px] text-white/70">01:30</span>
                      </div>
                      <div className="my-3 flex flex-col items-center justify-center gap-2">
                        <button className="group/play relative flex h-12 w-12 items-center justify-center rounded-full bg-white/95 shadow-md transition-transform duration-200 hover:scale-105">
                          <span className="ai-ring absolute inset-0 rounded-full border-2 border-white/50" />
                          <svg viewBox="0 0 24 24" className="ml-0.5 h-5 w-5 text-electric" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                        </button>
                        <span className="font-display text-xs font-semibold text-white">90 second whiteboard walkthrough</span>
                      </div>
                      {/* waveform */}
                      <div className="flex items-end justify-center gap-[2.5px]">
                        {Array.from({ length: 36 }).map((_, i) => (
                          <span key={i} className="ai-wave w-[2.5px] rounded-full bg-gradient-to-t from-electric to-electric-bright" style={{ height: `${6 + ((i * 7) % 20)}px`, animationDelay: `${(i % 10) * 0.09}s` }} />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* gauges */}
                  <div className="flex flex-col justify-center rounded-xl border border-border bg-white p-3.5 sm:p-4 shadow-sm">
                    <div className="font-mono text-[9.5px] uppercase tracking-[0.1em] text-mist truncate">Behavioral scorecard · candidate PN-4471</div>
                    <div className="mt-3 grid grid-cols-3 gap-2">
                      <Gauge value={92} label="HEXACO" sub="Integrity" play={inView && tab === 2} delay={0} />
                      <Gauge value={88} label="OCEAN" sub="Adaptability" play={inView && tab === 2} delay={140} />
                      <Gauge value={95} label="BEI" sub="Scenario" play={inView && tab === 2} delay={280} />
                    </div>
                    <div className="mt-3 space-y-1.5 border-t border-border pt-3">
                      {[
                        ["Structured competency interview", "Passed"],
                        ["Communication & clarity", "High"],
                        ["Culture-add alignment", "Strong"],
                      ].map(([k, v]) => (
                        <div key={k} className="flex items-center justify-between text-[11.5px]">
                          <span className="text-ink-soft truncate">{k}</span>
                          <span className="inline-flex shrink-0 items-center gap-1 font-mono text-[10px] font-semibold text-signal">
                            <span className="h-1.5 w-1.5 rounded-full bg-signal" />{v}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .ai-edge {
          background: conic-gradient(from var(--pt-ang, 0deg), transparent 0deg, rgba(56,189,248,0.55) 90deg, transparent 180deg, rgba(10,132,255,0.5) 300deg, transparent 360deg);
          animation: pt-spin 6s linear infinite;
          filter: blur(9px);
          opacity: 0.55;
        }
        .ai-fade { animation: ai-fade 0.5s cubic-bezier(0.22,1,0.36,1) both; }
        @keyframes ai-fade { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .ai-caret { animation: ai-caret 1s steps(2) infinite; }
        @keyframes ai-caret { 0%,100% { opacity: 1; } 50% { opacity: 0; } }
        .ai-ring { animation: ai-ring 2s ease-out infinite; }
        @keyframes ai-ring { 0% { transform: scale(1); opacity: 0.7; } 100% { transform: scale(1.7); opacity: 0; } }
        .ai-wave { animation: ai-wave 1.1s ease-in-out infinite; transform-origin: bottom; }
        @keyframes ai-wave { 0%,100% { transform: scaleY(0.4); } 50% { transform: scaleY(1); } }
        @media (prefers-reduced-motion: reduce) {
          .ai-edge, .ai-caret, .ai-ring, .ai-wave { animation: none !important; }
        }
      `}</style>
    </section>
  );
}
