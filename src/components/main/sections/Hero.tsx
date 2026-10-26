"use client";

import { useState, useEffect } from "react";
import GlobeScrollBridge from "@/components/main/GlobeScrollBridge";
import CursorGrid from "@/components/CursorGrid";


// Sub-headline rendered word-by-word so a wave of motion/tint travels across the text
function WaveText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <p className={className}>
      {text.split(" ").map((word, i) => (
        <span
          key={i}
          className="inline-block"
          style={{
            marginRight: "0.28em",
            animation: `word-wave 4.5s ease-in-out ${(i * 0.11).toFixed(2)}s infinite`,
          }}
        >
          {word}
        </span>
      ))}
    </p>
  );
}

function StatCardSprint({ delay }: { delay: string }) {
  return (
    <div
      className="hero-stat-card pointer-events-auto absolute z-10 hidden -translate-x-1/2 lg:block"
      style={{
        top: "6%",
        left: "18%",
      }}
    >
      <div
        className="w-fit whitespace-nowrap rounded-xl border border-[#bcd6fa] bg-white/95 px-3 py-1.5 shadow-[0_6px_20px_-6px_rgba(10,132,255,0.25)] backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:border-electric hover:shadow-[0_10px_24px_-4px_rgba(10,132,255,0.35)]"
        style={{
          animation: "float-node 7s ease-in-out infinite",
          animationDelay: delay,
        }}
      >
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-electric/10 text-electric">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="16 18 22 12 16 6" />
              <polyline points="8 6 2 12 8 18" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display text-[13.5px] font-extrabold tracking-tight text-[#0a1428]">
                Tech &amp; SDLC Teams
              </span>
            </div>
            <div className="font-mono text-[8.5px] font-bold uppercase tracking-wider text-electric">
              Full-Stack Dev
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCardHealthcare({ delay }: { delay: string }) {
  return (
    <div
      className="hero-stat-card pointer-events-auto absolute z-10 hidden -translate-x-1/2 lg:block"
      style={{
        top: "6%",
        left: "82%",
      }}
    >
      <div
        className="w-fit whitespace-nowrap rounded-xl border border-[#bcd6fa] bg-white/95 px-3 py-1.5 shadow-[0_6px_20px_-6px_rgba(10,132,255,0.25)] backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:border-electric hover:shadow-[0_10px_24px_-4px_rgba(10,132,255,0.35)]"
        style={{
          animation: "float-node 7s ease-in-out infinite",
          animationDelay: delay,
        }}
      >
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-sky-500/10 text-sky-600">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
          </div>
          <div>
            <div className="font-display text-[13.5px] font-extrabold tracking-tight text-[#0a1428]">
              Healthcare IT
            </div>
            <div className="font-mono text-[8.5px] font-bold uppercase tracking-wider text-sky-600">
              EMR &amp; HIPAA
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCardPods({ delay }: { delay: string }) {
  return (
    <div
      className="hero-stat-card pointer-events-auto absolute z-10 hidden -translate-x-1/2 lg:block"
      style={{
        top: "83%",
        left: "18%",
      }}
    >
      <div
        className="w-fit whitespace-nowrap rounded-xl border border-[#bcd6fa] bg-white/95 px-3 py-1.5 shadow-[0_6px_20px_-6px_rgba(10,132,255,0.25)] backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:border-electric hover:shadow-[0_10px_24px_-4px_rgba(10,132,255,0.35)]"
        style={{
          animation: "float-node 7s ease-in-out infinite",
          animationDelay: delay,
        }}
      >
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-electric/10 text-electric">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <div>
            <div className="font-display text-[13.5px] font-extrabold tracking-tight text-[#0a1428]">
              AI HRMS Portal
            </div>
            <div className="font-mono text-[8.5px] font-bold uppercase tracking-wider text-[#3d4c68]">
              Global Workforce
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HeroTypingHeadline({ textToType = "Hire Faster" }: { textToType?: string }) {
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const [isComplete, setIsComplete] = useState(false);
  const fullText = textToType;

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);
    return () => clearInterval(cursorInterval);
  }, []);

  useEffect(() => {
    setText("");
    setIsDeleting(false);
    setIsComplete(false);
  }, [textToType]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!isDeleting && text === fullText) {
      // Pause at complete text before starting backspace
      setIsComplete(true);
      timer = setTimeout(() => {
        setIsDeleting(true);
      }, 3800);
    } else if (isDeleting && text === "") {
      // Completed backspacing: pause 600ms before re-typing
      setIsComplete(false);
      timer = setTimeout(() => {
        setIsDeleting(false);
      }, 600);
    } else if (isDeleting) {
      // Fast backspace deletion
      setIsComplete(false);
      timer = setTimeout(() => {
        setText((prev) => prev.slice(0, -1));
      }, 45);
    } else {
      // Typing character by character
      setIsComplete(false);
      const nextChar = fullText[text.length];
      const delay = nextChar === " " ? 130 : 80 + (text.length % 3) * 15;
      timer = setTimeout(() => {
        setText(fullText.slice(0, text.length + 1));
      }, delay);
    }

    return () => clearTimeout(timer);
  }, [text, isDeleting, fullText]);

  return (
    <span className="relative inline-block pb-0.5">
      {/* Invisible phantom text locks typographic dimensions with 0 layout shift */}
      <span className="invisible select-none pointer-events-none opacity-0" aria-hidden="true">
        {fullText}
      </span>

      {/* Foreground typed text and glowing cursor beam */}
      <span className="absolute inset-0 flex items-baseline whitespace-nowrap">
        <span className="bg-gradient-to-r from-electric via-[#2563eb] to-electric-bright bg-clip-text text-transparent">
          {text}
        </span>
        <span
          className={`inline-block w-[3px] sm:w-[3.5px] lg:w-[4px] h-[0.78em] bg-electric-bright rounded-full ml-1 align-baseline shadow-[0_0_8px_rgba(56,189,248,0.9)] transition-opacity duration-150 ${
            showCursor ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden="true"
        />
      </span>

      {/* Hand-drawn Pen Highlight Curve strictly under Hire Faster with low-profile curve */}
      <svg
        className={`pointer-events-none absolute -bottom-2 sm:-bottom-2.5 lg:-bottom-3 left-0 w-full overflow-visible transition-opacity duration-300 ${
          isComplete ? "opacity-100" : "opacity-0"
        }`}
        viewBox="0 0 240 10"
        fill="none"
      >
        <path
          d="M 2 7 C 45 3, 100 8.5, 150 4.5 C 185 1.5, 215 6, 238 3.5"
          stroke="url(#hero-pen-underline)"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            strokeDasharray: 245,
            strokeDashoffset: isComplete ? 0 : 245,
            transition: "stroke-dashoffset 0.55s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        />
        <defs>
          <linearGradient id="hero-pen-underline" x1="0" y1="0" x2="240" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0a84ff" />
            <stop offset="50%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0a84ff" />
          </linearGradient>
        </defs>
      </svg>
    </span>
  );
}

export interface HeroContent {
  eyebrow?: string;
  typedHeadline?: string;
  headlineSuffix?: string;
  description?: string;
  descriptionMobile?: string;
  pills?: string[];
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  cards?: Array<{ id: string; title: string; subtitle: string }>;
}

export default function Hero({ content }: { content?: HeroContent } = {}) {
  const eyebrow = content?.eyebrow ?? "Enterprise RPO & Strategic HR Solutions";
  const typedHeadline = content?.typedHeadline ?? "Hire Faster";
  const headlineSuffix = content?.headlineSuffix ?? "than your competition";
  const description =
    content?.description ??
    "Pepoltek is an enterprise Recruitment Process Outsourcing (RPO) and strategic HR partner. We combine AI-driven candidate screening, automated technical assessments, and dedicated HR operations teams to deliver pre-vetted IT and compliance-ready healthcare talent within 2 to 7 days.";
  const descriptionMobile =
    content?.descriptionMobile ??
    "Enterprise RPO deploying pre-screened IT engineers and compliance-ready healthcare specialists in 2 to 7 days with guaranteed global timezone overlap.";
  const pills = content?.pills ?? [
    "Enterprise RPO",
    "AI-Powered HRMS",
    "Healthcare Compliance",
    "Tech & SDLC Staffing",
  ];
  const primaryCta = content?.primaryCta ?? {
    label: "Explore RPO Solutions",
    href: "#specialist-tracks",
  };
  const secondaryCta = content?.secondaryCta ?? {
    label: "View Pre-Screened Talent",
    href: "#calculator-section",
  };

  return (
    <div id="hero-section" className="relative z-10 min-h-full w-full bg-canvas">
      {/* Volumetric Radiant Light Aurora Layer (Right Globe Area) */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {/* Deep blue atmospheric aura behind globe on the right */}
        <div className="absolute right-[-5%] top-[10%] h-[550px] w-[550px] rounded-full bg-[radial-gradient(circle,rgba(10,132,255,0.18)_0%,rgba(56,189,248,0.08)_45%,transparent_70%)] blur-3xl" />
      </div>

      {/* Interactive Cyber Matrix Grid Background */}
      <div className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-hidden opacity-100">
        <CursorGrid
          cellSize={56}
          color="#0a84ff"
          radius={180}
          falloff="smooth"
          holdTime={400}
          fadeDuration={700}
          lineWidth={1.25}
          maxOpacity={0.78}
          fillOpacity={0.07}
          gridOpacity={0.05}
          cellRadius={6}
          clickPulse
          pulseSpeed={600}
          ambient={true}
          ambientDensity={0.26}
          ambientMaxAlpha={0.4}
        />
      </div>

      {/* Foreground content */}
      <div className="relative z-10 mx-auto flex max-w-7xl 2xl:max-w-[1360px] flex-col px-6 pt-0 pb-8 lg:px-10 xl:px-12">

        {/* Hero body */}
        <div className="grid flex-1 items-center gap-8 pt-2 pb-6 sm:pt-3 sm:pb-8 lg:grid-cols-[1.08fr_0.92fr] lg:gap-10 xl:gap-14 lg:pt-3 lg:pb-10">
          {/* Left: copy */}
          <div className="max-w-[640px] xl:max-w-[680px]">
            {/* Eyebrow */}
            <div className="flex items-center gap-2.5">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-electric shadow-[0_0_8px_2px_rgba(10,132,255,0.6)]" />
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-[#3d4c68]">
                {eyebrow}
              </span>
            </div>

            {/* Headline */}
            <h1 className="mt-3 sm:mt-5 font-display text-3xl sm:text-[46px] lg:text-[54px] xl:text-[58px] font-extrabold leading-[1.15] tracking-tight text-[#0a1428]">
              <HeroTypingHeadline textToType={typedHeadline} />
              <span className="block mt-2.5 sm:mt-3.5 lg:mt-4 text-[#0a1428]">
                {headlineSuffix}
              </span>
            </h1>

            {/* Sub-headline: responsive length to ensure 100vh viewport fit on mobile */}
            <p className="mt-4 sm:mt-6 max-w-2xl text-sm sm:text-base lg:text-[17px] leading-relaxed text-[#3d4c68]">
              <span className="hidden sm:inline">
                {description}
              </span>
              <span className="inline sm:hidden">
                {descriptionMobile}
              </span>
            </p>

            {/* Sticky Capability Pills */}
            <div className="mt-5 flex flex-wrap items-center gap-2">
              {pills.map((pill) => (
                <span
                  key={pill}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#bcd6fa] bg-white/90 px-3 py-1 font-mono text-[10.5px] font-semibold tracking-tight text-[#0a1428] shadow-[0_2px_8px_rgba(10,132,255,0.06)] backdrop-blur-sm"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-electric" />
                  {pill}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div className="mt-7 sm:mt-8 flex flex-wrap items-center gap-3.5">
              <a
                href={primaryCta.href}
                className="group inline-flex items-center justify-center whitespace-nowrap rounded-xl bg-[#0a1428] px-6 py-3.5 font-display text-sm font-semibold text-white shadow-[0_8px_20px_-4px_rgba(10,20,40,0.5)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-electric hover:shadow-[0_12px_28px_-6px_rgba(10,132,255,0.5)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric cursor-pointer"
              >
                {primaryCta.label}
              </a>
              <a
                href={secondaryCta.href}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-xl border border-[#bcd6fa] bg-white/80 px-6 py-3.5 font-display text-sm font-semibold text-[#0a1428] shadow-[0_4px_14px_-2px_rgba(10,20,40,0.04)] backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-electric/50 hover:bg-white hover:text-electric focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric cursor-pointer"
              >
                {secondaryCta.label}
              </a>
            </div>
          </div>

          {/* Right: globe visual anchor & static achievement telemetry */}
          <div id="hero-globe-anchor" className="relative h-[380px] sm:h-[420px] lg:h-[460px] w-full">
            <GlobeScrollBridge />

            {/* Modern connector lines from stat cards into the Pepoltek core */}
            <svg
              id="hero-connector-lines"
              className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="hero-circuit-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
                  <stop offset="60%" stopColor="#0a84ff" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#0a84ff" stopOpacity="0.2" />
                </linearGradient>
              </defs>
              {[
                [18, 14],
                [82, 14],
                [18, 83],
              ].map(([x, y], i) => (
                <g key={i}>
                  {/* Subtle static guide track */}
                  <line
                    x1={x}
                    y1={y}
                    x2="50"
                    y2="50"
                    stroke="#bcd6fa"
                    strokeOpacity="0.35"
                    strokeWidth="1"
                    strokeDasharray="2 3"
                    vectorEffect="non-scaling-stroke"
                  />
                  {/* Animated laser pulse beam */}
                  <line
                    x1={x}
                    y1={y}
                    x2="50"
                    y2="50"
                    stroke="url(#hero-circuit-gradient)"
                    strokeWidth="1.4"
                    strokeDasharray="4 6"
                    vectorEffect="non-scaling-stroke"
                    style={{ animation: "line-dash 2.4s linear infinite" }}
                  />
                </g>
              ))}
              {/* Central convergence node at the core */}
              <circle
                cx="50"
                cy="50"
                r="3.5"
                stroke="#0a84ff"
                strokeWidth="0.8"
                strokeDasharray="2 3"
                opacity="0.5"
                fill="none"
                vectorEffect="non-scaling-stroke"
              />
            </svg>

            <StatCardSprint delay="0s" />
            <StatCardHealthcare delay="2s" />
            <StatCardPods delay="1s" />
          </div>
        </div>
      </div>
    </div>
  );
}
