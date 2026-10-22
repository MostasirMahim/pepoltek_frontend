"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle } from "@/components/ui/Icons";
import { AnimatedChevrons } from "@/components/ui/AnimatedChevrons";

export interface CtaBannerContent {
  badge?: string;
  title?: string;
  description?: string;
  pills?: string[];
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
}

export default function CtaBanner({ content }: { content?: CtaBannerContent } = {}) {
  const badge = content?.badge ?? "Zero Risk Hiring";
  const title = content?.title ?? "Submit your requisition. We deploy a verified shortlist in 48 hours.";
  const description =
    content?.description ??
    "Enterprise teams and pre-screened specialists ready for immediate integration. Backed by guaranteed daily timezone overlap and zero billing until trial benchmarks pass.";
  const pills = content?.pills ?? [
    "14-day risk-free trial on staff augmentation",
    "90-day placement replacement guarantee",
    "Zero generalist recruiters",
  ];
  const primaryCta = content?.primaryCta ?? {
    label: "Start 14-Day Risk-Free Trial",
    href: "/contact",
  };
  const secondaryCta = content?.secondaryCta ?? {
    label: "Schedule RPO Consultation",
    href: "/contact",
  };

  return (
    <section
      id="cta-banner"
      className="relative w-full bg-canvas px-4 py-12 sm:px-6 lg:px-10 lg:py-20"
    >
      <div className="mx-auto max-w-7xl 2xl:max-w-[1360px]">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/15 bg-gradient-to-br from-[#0a1428] via-[#0d2247] to-[#0a4d9c] p-7 sm:p-10 lg:p-14 shadow-[0_40px_100px_-35px_rgba(10,20,40,0.65)]">
          {/* Subtle Grid & Glow Textures */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.16] [background-image:radial-gradient(rgba(255,255,255,0.6)_1px,transparent_1.4px)] [background-size:24px_24px]" />
          <div className="pointer-events-none absolute -left-12 -top-16 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(10,132,255,0.35),transparent_65%)] blur-2xl" />
          <div className="pointer-events-none absolute -right-12 -bottom-16 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.28),transparent_65%)] blur-3xl" />

          {/* Two-Column Grid: Copy on Left, Executive B2B Shortlist Mockup on Right */}
          <div className="relative z-10 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12 items-center">
            {/* Left Column (7 cols): Copy & Primary CTAs */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 font-sans text-xs font-semibold uppercase tracking-wider text-white/90 backdrop-blur-sm shadow-sm">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-electric-bright" />
                <span>{badge}</span>
              </div>

              {/* Headline */}
              <h2 className="mt-4 font-display text-2xl sm:text-3xl lg:text-[40px] font-extrabold leading-[1.12] tracking-tight text-white line-clamp-2 text-balance">
                {title}
              </h2>

              <p className="mt-4 max-w-xl text-sm sm:text-base text-gray-300 leading-relaxed font-sans">
                {description}
              </p>

              {/* Guarantee Pills */}
              <div className="mt-6 flex flex-wrap gap-2.5">
                {pills.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.08] px-4 py-2 font-sans text-xs sm:text-[13px] font-medium text-white/90 backdrop-blur-sm shadow-sm"
                  >
                    <CheckCircle size={15} className="text-electric-bright shrink-0" />
                    <span>{t}</span>
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-3.5">
                <Link
                  href={primaryCta.href}
                  className="group inline-flex items-center gap-2.5 rounded-xl bg-white px-7 py-3.5 font-display text-sm font-bold text-ink shadow-[0_14px_34px_-10px_rgba(255,255,255,0.4)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/95 cursor-pointer"
                >
                  <span>{primaryCta.label}</span>
                  <AnimatedChevrons size={13} count={3} variant="dark" />
                </Link>
                <Link
                  href={secondaryCta.href}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-6 py-3.5 font-display text-sm font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-white/50 hover:bg-white/15 cursor-pointer"
                >
                  <span>{secondaryCta.label}</span>
                </Link>
              </div>
            </div>

            {/* Right Column (5 cols): Executive Deliverable / Shortlist Mockup */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="w-full max-w-md rounded-2xl border border-white/20 bg-white/10 p-5 sm:p-6 backdrop-blur-md shadow-2xl text-white">
                {/* Mockup Top Status */}
                <div className="flex items-center justify-between border-b border-white/15 pb-3.5">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-electric-bright animate-pulse shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
                    <span className="font-sans text-xs font-bold uppercase tracking-wider text-electric-bright">
                      Requisition Match Active
                    </span>
                  </div>
                  <span className="font-sans text-xs text-white/70 font-medium">
                    SLA: 48h
                  </span>
                </div>

                {/* Candidate Pre-Screened Preview 1 */}
                <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h4 className="font-display text-sm font-bold text-white leading-snug">
                        Sr. Distributed Systems Engineer
                      </h4>
                      <p className="mt-1 font-sans text-xs text-white/70 leading-normal">
                        Go, Kafka, K8s • 7y Exp • C2C Ready
                      </p>
                    </div>
                    <span className="shrink-0 whitespace-nowrap rounded-lg border border-electric-bright/30 bg-electric-bright/15 px-2.5 py-1 font-sans text-xs font-bold text-electric-bright">
                      96% Match
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-x-3.5 gap-y-1 font-sans text-xs text-white/80">
                    <span className="flex items-center gap-1.5"><span className="text-electric-bright font-bold">✓</span> Repo Audit Clean</span>
                    <span className="flex items-center gap-1.5"><span className="text-electric-bright font-bold">✓</span> 5h Live Overlap</span>
                    <span className="flex items-center gap-1.5"><span className="text-electric-bright font-bold">✓</span> Vetted</span>
                  </div>
                </div>

                {/* Candidate Pre-Screened Preview 2 */}
                <div className="mt-3 rounded-xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h4 className="font-display text-sm font-bold text-white leading-snug">
                        Clinical Informaticist &amp; EMR Lead
                      </h4>
                      <p className="mt-1 font-sans text-xs text-white/70 leading-normal">
                        Epic, FHIR v4, HIPAA • State RN License Active
                      </p>
                    </div>
                    <span className="shrink-0 whitespace-nowrap rounded-lg border border-electric-bright/30 bg-electric-bright/15 px-2.5 py-1 font-sans text-xs font-bold text-electric-bright">
                      94% Match
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-x-3.5 gap-y-1 font-sans text-xs text-white/80">
                    <span className="flex items-center gap-1.5"><span className="text-electric-bright font-bold">✓</span> License Verified</span>
                    <span className="flex items-center gap-1.5"><span className="text-electric-bright font-bold">✓</span> HIPAA Cleared</span>
                    <span className="flex items-center gap-1.5"><span className="text-electric-bright font-bold">✓</span> Vetted</span>
                  </div>
                </div>

                {/* Bottom Assurance */}
                <div className="mt-4 border-t border-white/15 pt-3.5 flex items-center justify-between font-sans text-xs text-white/75">
                  <span>Specialist Sourcing Team Assigned</span>
                  <span className="text-electric-bright font-medium">Zero Fee Trial Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
