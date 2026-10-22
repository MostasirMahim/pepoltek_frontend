"use client";

import React from "react";
import Link from "next/link";
import { AnimatedChevrons } from "@/components/ui/AnimatedChevrons";

const COMMERCIAL_MODELS = [
  {
    tag: "01",
    name: "Direct Hire Placement",
    category: "Executive & Specialist",
    desc: "Contingency & retained hiring for senior engineering, product, and clinical leaders.",
    metric: "12%",
    metricLabel: "Entry Rate",
    rateTerms: "Standard 15% to 20% first-year compensation",
    guarantee: "90-Day Candidate Replacement Guarantee",
    bullets: [
      "Rigorous technical code audits and credentialing",
      "Executive panel interview orchestration",
      "Offer negotiation and compensation benchmarking",
    ],
  },
  {
    tag: "02",
    name: "Staff Augmentation",
    category: "Turnkey Dedicated Squads",
    desc: "Dedicated engineering and healthcare teams embedded in your sprint workflow.",
    metric: "2 wk",
    metricLabel: "Trial Period",
    rateTerms: "Transparent monthly or hourly sprint billing",
    guarantee: "2-Week Risk-Free Trial ($0 if benchmarks fail)",
    featured: true,
    bullets: [
      "Pre-vetted engineering and clinical specialists",
      "Guaranteed 4 to 6 hour daily operational overlap",
      "Immediate sprint deployment in 2 to 7 days",
    ],
  },
  {
    tag: "03",
    name: "Employer of Record (EOR)",
    category: "Global Payroll & Compliance",
    desc: "Hire across 15+ countries with complete payroll, tax, and labor compliance.",
    metric: "15+",
    metricLabel: "Countries",
    rateTerms: "Localized payroll, benefits, and tax withholding",
    guarantee: "100% Statutory Compliance Ownership",
    bullets: [
      "Localized employment contracts and IP protection",
      "Automated multi-currency salary disbursement",
      "Statutory health, pension, and local benefits",
    ],
  },
];

export interface CommercialTermsContent {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  models?: Array<{
    tag: string;
    name: string;
    category: string;
    desc: string;
    metric: string;
    metricLabel: string;
    rateTerms?: string;
    guarantee: string;
    featured?: boolean;
    bullets: string[];
  }>;
}

export default function CommercialTerms({ content }: { content?: CommercialTermsContent } = {}) {
  const eyebrow = content?.eyebrow ?? "Commercial Engagement Terms";
  const title = content?.title ?? "Flexible Commercial Models & Risk-Free Guarantees";
  const subtitle = content?.subtitle ?? "Terms engineered to de-risk every hire. Three transparent engagement models with backed replacement and trial guarantees.";
  const models = content?.models && content.models.length > 0 ? content.models : COMMERCIAL_MODELS;

  return (
    <section
      id="commercial-terms"
      className="relative w-full bg-canvas px-4 py-10 sm:px-6 sm:py-14 lg:px-10 lg:py-16"
    >
      <div className="mx-auto max-w-7xl">
        {/* Banner Shell */}
        <div className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-gradient-to-br from-[#0a1428] via-[#0d2247] to-[#0a4d9c] p-6 sm:p-8 lg:p-9">
          {/* Subtle Ambient Grid */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.14] [background-image:radial-gradient(rgba(255,255,255,0.6)_1px,transparent_1.4px)] [background-size:26px_26px]" />
          <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.25),transparent_65%)] blur-3xl" />
          <div className="pointer-events-none absolute -right-20 -bottom-20 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(10,132,255,0.3),transparent_65%)] blur-3xl" />

          {/* Header */}
          <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-white/90 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-electric-bright" />
              {eyebrow}
            </div>

            <h2 className="mt-2.5 font-display text-2xl sm:text-3xl lg:text-[34px] font-extrabold tracking-tight text-white leading-[1.15] line-clamp-2 text-balance">
              {title}
            </h2>

            <p className="mt-1.5 text-xs sm:text-sm text-white/80 leading-relaxed max-w-2xl">
              {subtitle}
            </p>
          </div>

          {/* 3-Column Compact Grid */}
          <div className="relative z-10 mt-6 sm:mt-7 grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-3 items-stretch">
            {models.map((model) => (
              <div
                key={model.tag}
                className={`relative flex flex-col justify-between rounded-2xl p-4 sm:p-5 backdrop-blur-md transition-all duration-300 ${
                  model.featured
                    ? "border-2 border-electric-bright bg-white/[0.12]"
                    : "border border-white/15 bg-white/[0.06] hover:border-white/30"
                }`}
              >
                <div>
                  {/* Top Row: Model Tag & Category */}
                  <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2">
                    <span className="font-mono text-xs font-bold text-electric-bright">
                      Model {model.tag}
                    </span>
                    <span className="font-mono text-[9px] uppercase tracking-wider text-white/60">
                      {model.category}
                    </span>
                  </div>

                  {/* Title & Short Description */}
                  <div className="mt-2.5">
                    <h3 className="font-display text-base sm:text-lg font-bold text-white leading-snug tracking-tight">
                      {model.name}
                    </h3>
                    <p className="mt-1 text-xs text-white/70 leading-relaxed min-h-[32px]">
                      {model.desc}
                    </p>
                  </div>

                  {/* Compact Commercial Rate Strip */}
                  <div className="mt-3 rounded-xl border border-electric-bright/20 bg-electric-bright/[0.04] p-2.5 sm:p-3 flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <span className="block font-mono text-[8.5px] uppercase tracking-wider text-white/50">
                        Commercial Terms
                      </span>
                      <p className="mt-0.5 text-[11.5px] sm:text-xs font-medium text-white/90 truncate">
                        {model.rateTerms}
                      </p>
                    </div>
                    <div className="text-right shrink-0 pl-2.5 border-l border-electric-bright/20">
                      <div className="font-display text-xl font-extrabold text-white leading-none">
                        {model.metric}
                      </div>
                      <div className="mt-0.5 font-mono text-[8px] uppercase tracking-wider text-electric-bright font-semibold">
                        {model.metricLabel}
                      </div>
                    </div>
                  </div>

                  {/* 1-Line Risk-Free Guarantee Row */}
                  <div className="mt-2 rounded-xl border border-electric-bright/30 bg-electric-bright/[0.09] px-3 py-1.5 sm:py-2 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-electric-bright shadow-[0_0_6px_rgba(56,189,248,0.8)] shrink-0" />
                    <span className="font-mono text-[9.5px] font-semibold text-electric-bright truncate">
                      {model.guarantee}
                    </span>
                  </div>

                  {/* Deliverables Checklist (Clean, compact 3 items) */}
                  <div className="mt-3 pt-2.5 border-t border-white/10 space-y-1.5">
                    {model.bullets.map((b) => (
                      <div key={b} className="flex items-center gap-2 text-[11px] sm:text-[11.5px] text-white/80 leading-tight">
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          className="text-electric-bright shrink-0"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span className="truncate">{b}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Action Row */}
          <div className="relative z-10 mt-6 sm:mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/contact"
              className="group inline-flex items-center justify-center gap-2.5 rounded-xl bg-white px-6 py-3 font-display text-sm font-bold text-ink shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/95 hover:shadow-lg cursor-pointer"
            >
              <span>Request Commercial Proposal</span>
              <AnimatedChevrons size={12} count={3} variant="dark" />
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-5 py-2.5 sm:px-6 sm:py-3 font-display text-xs sm:text-sm font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-white/50"
            >
              View Contract Frameworks
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
