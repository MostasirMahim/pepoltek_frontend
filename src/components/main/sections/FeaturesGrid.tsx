"use client";

import React from "react";
import Link from "next/link";

export interface PodFeatureCard {
  title: string;
  description: string;
  category?: string;
  icon: React.ReactNode;
}

const podCardsData: PodFeatureCard[] = [
  {
    category: "Delivery Teams",
    title: "Technical & Healthcare Specialists",
    description:
      "Technical and clinical sourcing teams maintaining active talent pipelines across North America, Europe, GCC, and Asia-Pacific.",
    icon: (
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mx-auto mb-4 max-lg:mx-0"
      >
        {/* User / Talent Pod + Cross Healthcare badge */}
        <circle
          cx="20"
          cy="13"
          r="6"
          fill="url(#pod_g1)"
          fillOpacity="0.16"
          stroke="#0a84ff"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10 32C10 26.4772 14.4772 22 20 22C25.5228 22 30 26.4772 30 32"
          stroke="#0a84ff"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Healthcare / Tech cross badge */}
        <circle cx="29" cy="11" r="5" fill="#eef4fd" stroke="#0a84ff" />
        <path
          d="M29 8.5V13.5M26.5 11H31.5"
          stroke="#0a84ff"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <defs>
          <linearGradient
            id="pod_g1"
            x1="20"
            y1="7"
            x2="20"
            y2="19"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#0a84ff" stopOpacity="0" />
            <stop offset="1" stopColor="#0a84ff" />
          </linearGradient>
        </defs>
      </svg>
    ),
  },
  {
    category: "Delivery Teams",
    title: "Business Analysts",
    description:
      "Structures client tech stack mappings, workflow requirements, and operational SLAs prior to candidate deployment.",
    icon: (
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mx-auto mb-4 max-lg:mx-0"
      >
        {/* Tech Stack Blueprint / Architecture Node mapping */}
        <rect
          x="7"
          y="7"
          width="26"
          height="26"
          rx="5"
          fill="url(#pod_g2)"
          fillOpacity="0.14"
          stroke="#0a84ff"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M13 14H27M13 20H21M13 26H18"
          stroke="#0a84ff"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="26" cy="24" r="3" fill="#eef4fd" stroke="#0a84ff" />
        <path
          d="M25 24L25.8 24.8L27.2 23.2"
          stroke="#0a84ff"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <defs>
          <linearGradient
            id="pod_g2"
            x1="20"
            y1="7"
            x2="20"
            y2="33"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#0a84ff" stopOpacity="0" />
            <stop offset="1" stopColor="#0a84ff" />
          </linearGradient>
        </defs>
      </svg>
    ),
  },
  {
    category: "Delivery Teams",
    title: "In-House Software Engineers",
    description:
      "Conduct hard-coded technical validation, system design reviews, and repository evaluations before any profile reaches a hiring manager panel.",
    icon: (
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mx-auto mb-4 max-lg:mx-0"
      >
        {/* Terminal / Code validation brackets & shield */}
        <rect
          x="6"
          y="8"
          width="28"
          height="24"
          rx="4"
          fill="url(#pod_g3)"
          fillOpacity="0.14"
          stroke="#0a84ff"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 18L16 21L12 24"
          stroke="#0a84ff"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M19 24H25"
          stroke="#0a84ff"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="10" cy="12" r="1" fill="#0a84ff" />
        <circle cx="14" cy="12" r="1" fill="#0a84ff" />
        <circle cx="18" cy="12" r="1" fill="#0a84ff" />
        <defs>
          <linearGradient
            id="pod_g3"
            x1="20"
            y1="8"
            x2="20"
            y2="32"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#0a84ff" stopOpacity="0" />
            <stop offset="1" stopColor="#0a84ff" />
          </linearGradient>
        </defs>
      </svg>
    ),
  },
  {
    category: "Leadership Highlights",
    title: "Scaling Milestone",
    description:
      "Scaled technology companies from 0 to 1,000 employees with 98% founding-team retention through 36 months.",
    icon: (
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mx-auto mb-4 max-lg:mx-0"
      >
        {/* Scaling Growth Vector & 1k Milestone */}
        <path
          d="M7 32H33"
          stroke="#0a84ff"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8 26L16 19L22 24L32 10"
          stroke="#0a84ff"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M26 10H32V16"
          stroke="#0a84ff"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8 26L16 19L22 24L32 10V32H8V26Z"
          fill="url(#pod_g4)"
          fillOpacity="0.14"
        />
        <defs>
          <linearGradient
            id="pod_g4"
            x1="20"
            y1="10"
            x2="20"
            y2="32"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#0a84ff" stopOpacity="0.3" />
            <stop offset="1" stopColor="#0a84ff" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    ),
  },
  {
    category: "Leadership Highlights",
    title: "Commercialization",
    description:
      "Executive background driving enterprise brand expansion up to $10M annual revenue across 60 distribution channels.",
    icon: (
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mx-auto mb-4 max-lg:mx-0"
      >
        {/* Global Enterprise Expansion & Distribution Channels */}
        <circle
          cx="20"
          cy="20"
          r="13"
          fill="url(#pod_g5)"
          fillOpacity="0.14"
          stroke="#0a84ff"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <ellipse
          cx="20"
          cy="20"
          rx="6"
          ry="13"
          stroke="#0a84ff"
          strokeLinecap="round"
        />
        <path d="M7 20H33" stroke="#0a84ff" strokeLinecap="round" />
        <path d="M9 13H31" stroke="#0a84ff" strokeOpacity="0.5" />
        <path d="M9 27H31" stroke="#0a84ff" strokeOpacity="0.5" />
        <defs>
          <linearGradient
            id="pod_g5"
            x1="20"
            y1="7"
            x2="20"
            y2="33"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#0a84ff" stopOpacity="0" />
            <stop offset="1" stopColor="#0a84ff" />
          </linearGradient>
        </defs>
      </svg>
    ),
  },
];

export default function FeaturesGrid({
  badge = "Delivery Teams & Leadership",
  title = "In-House Delivery Team Breakdown",
  subtitle = "High-velocity talent engineering teams, strict technical vetting, and proven executive scaling execution.",
  cards = podCardsData,
}: {
  badge?: string;
  title?: string;
  subtitle?: string;
  cards?: PodFeatureCard[];
}) {
  return (
    <section id="delivery-pods" className="relative w-full bg-canvas py-20 lg:py-28">
      {/* Background ambient lighting */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[800px] rounded-full bg-electric/[0.035] blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 text-center lg:px-10">
        {/* Section Header */}
        <div className="mx-auto flex max-w-3xl flex-col items-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-electric/20 bg-electric/[0.08] px-4 py-1 text-xs font-mono font-medium tracking-[0.14em] uppercase text-electric">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-electric shadow-[0_0_6px_rgba(10,132,255,0.6)]" />
            {badge}
          </div>

          <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-[#0a1428] sm:text-4xl lg:text-[38px] leading-tight">
            {title}
          </h2>

          <p className="mt-3 text-base leading-relaxed text-[#3d4c68] sm:text-lg">
            {subtitle}
          </p>
        </div>

        {/* 5-Card Grid with Seamless Custom Dividers & Hover Effects */}
        <div className="relative mx-auto mt-12 flex max-w-[960px] flex-wrap justify-center max-lg:w-full max-lg:max-w-[420px] max-lg:flex-col">
          {/* Horizontal middle divider (Desktop) */}
          <div
            className="pointer-events-none absolute top-[210px] left-[-24px] hidden h-[1px] w-[1008px] bg-gradient-to-r from-transparent via-[#bcd6fa]/80 to-transparent lg:block"
            aria-hidden="true"
          />

          {/* Left vertical border (Mobile) */}
          <div
            className="pointer-events-none absolute top-0 bottom-0 left-0 hidden w-[1px] bg-[#bcd6fa]/70 max-lg:block"
            aria-hidden="true"
          />

          {cards.map((card, idx) => {
            const isTopRow = idx < 3;

            return (
              <div
                key={idx}
                className={`group relative flex h-auto min-h-[210px] w-full flex-col justify-start px-6 py-7 text-left max-lg:border-b max-lg:border-[#bcd6fa]/50 max-lg:last:border-b-0 lg:h-[210px] lg:w-[320px] lg:px-4 lg:py-6 lg:text-center`}
              >
                {/* Desktop vertical divider */}
                {hasBorderVertical(idx)}

                {/* Mobile active indicator bar on hover/left */}
                <div
                  className="pointer-events-none absolute top-[86px] -left-[1px] hidden h-4 w-[2px] bg-electric opacity-0 transition-opacity duration-300 group-hover:opacity-100 max-lg:block"
                  aria-hidden="true"
                />

                {/* Hover gradient tint */}
                <div
                  className={`pointer-events-none absolute inset-0 h-full w-full opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
                    isTopRow
                      ? "bg-gradient-to-b from-transparent to-electric/[0.04]"
                      : "bg-gradient-to-t from-transparent to-electric/[0.04]"
                  }`}
                  aria-hidden="true"
                />

                {/* Card Icon */}
                <div className="relative z-10 transition-transform duration-300 group-hover:scale-105">
                  {card.icon}
                </div>

                {/* Card Title */}
                <h3 className="relative z-10 font-display text-[16px] font-bold text-[#0a1428] transition-colors duration-200 group-hover:text-electric">
                  {card.title}
                </h3>

                {/* Card Description */}
                <p className="relative z-10 mt-2 text-[13.5px] leading-relaxed text-[#3d4c68]">
                  {card.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Learn more / About us CTA */}
        <div className="mt-14 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/about"
            className="group relative inline-flex items-center justify-center gap-2 rounded-xl bg-electric px-7 py-3.5 text-sm font-semibold text-white shadow-[0_10px_25px_-5px_rgba(10,132,255,0.4)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-electric-bright hover:shadow-[0_14px_30px_-5px_rgba(56,189,248,0.5)] focus:outline-none focus:ring-2 focus:ring-electric focus:ring-offset-2"
          >
            <span>Learn More About Us</span>
            <svg
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </Link>

          <Link
            href="/solutions"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#bcd6fa] bg-white/80 px-6 py-3.5 text-sm font-semibold text-[#0a1428] backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-electric/50 hover:bg-white hover:text-electric focus:outline-none"
          >
            <span>Explore Solutions</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

function hasBorderVertical(idx: number) {
  if (idx === 0 || idx === 3) {
    return (
      <div
        className="pointer-events-none absolute top-0 right-0 hidden h-full w-[1px] bg-gradient-to-b from-[#bcd6fa]/80 to-transparent lg:block"
        aria-hidden="true"
      />
    );
  }
  if (idx === 1) {
    return (
      <div
        className="pointer-events-none absolute top-0 right-0 hidden h-full w-[1px] bg-gradient-to-t from-[#bcd6fa]/80 to-transparent lg:block"
        aria-hidden="true"
      />
    );
  }
  return null;
}
