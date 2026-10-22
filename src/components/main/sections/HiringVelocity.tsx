"use client";

import React from "react";
import GlobalDeliveryMatrix from "./GlobalDeliveryMatrix";
import RpoCalculator from "./RpoCalculator";

export interface HiringVelocityContent {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
}

export default function HiringVelocity({ content }: { content?: HiringVelocityContent } = {}) {
  const eyebrow = content?.eyebrow ?? "Flexible Global RPO & Staffing Calculator";
  const title = content?.title ?? "Deploy Locally, Source Globally: 24/7 Timezone Coverage & RPO Cost Engine";
  const subtitle = content?.subtitle ?? "Guaranteed daily operational overlap across global hubs. Configure your custom squad across stacks, seniority tiers, and regions to compare real-time savings against traditional recruiting agencies.";

  return (
    <section
      id="calculator-section"
      className="relative w-full bg-canvas-alt border-y border-[#bcd6fa]/35 px-3 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16"
    >
      {/* Background Ambience (Clean static grid) */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.25] [background-image:linear-gradient(rgba(188,214,250,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(188,214,250,0.18)_1px,transparent_1px)] [background-size:56px_56px]" />

      <div className="relative mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-electric/25 bg-electric/[0.08] px-4 py-1 font-mono text-[10.5px] font-semibold tracking-[0.16em] uppercase text-electric shadow-sm backdrop-blur-sm">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-electric shadow-[0_0_6px_rgba(10,132,255,0.6)]" />
            {eyebrow}
          </div>

          <h2 className="mt-3 font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl lg:text-[36px] leading-[1.15] text-balance">
            {title}
          </h2>

          <p className="mt-2 text-xs sm:text-sm leading-relaxed text-ink-soft max-w-2xl">
            {subtitle}
          </p>
        </div>

        {/* 2-Column Responsive Layout: Left 5 cols (Timezone), Right 7 cols (Calculator) */}
        <div className="mt-7 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-7 items-start">
          {/* LEFT: 24/7 Global Delivery & Timezone Overlap Engine (Imported Component) */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <GlobalDeliveryMatrix />
          </div>

          {/* RIGHT: Hardware Calculator Console (Imported Component) */}
          <div className="lg:col-span-7 flex justify-center w-full">
            <RpoCalculator />
          </div>
        </div>

      </div>
    </section>
  );
}
