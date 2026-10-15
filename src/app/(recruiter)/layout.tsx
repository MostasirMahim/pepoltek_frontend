"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  label: string;
  href: string;
  badge?: string;
  icon: React.ReactNode;
}

const RECRUITER_NAV: NavItem[] = [
  {
    label: "Hiring Cockpit",
    href: "/recruiter/dashboard",
    icon: (
      <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    label: "AI-HRMS Search & Audits",
    href: "/recruiter/ai-search",
    badge: "NLP Demo",
    icon: (
      <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    label: "Pod Management",
    href: "/recruiter/pods",
    badge: "4 Pods",
    icon: (
      <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
  },
  {
    label: "Vetted Talent Pool",
    href: "/recruiter/candidates",
    icon: (
      <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    label: "Sprint Interviews",
    href: "/recruiter/interviews",
    badge: "5 Today",
    icon: (
      <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    label: "Hiring Analytics",
    href: "/recruiter/analytics",
    icon: (
      <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
];

export default function RecruiterDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState("Apex Global Technologies");

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col antialiased">
      {/* Top Enterprise Bar */}
      <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-[#bcd6fa]/60 bg-white/95 px-4 sm:px-6 lg:px-8 backdrop-blur-md shadow-xs">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-1.5 text-ink-soft hover:bg-canvas lg:hidden"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <Link href="/" className="group flex items-center gap-2.5 transition-transform hover:opacity-90">
            <Image
              src="/assets/pepoltek/black_logo.png"
              alt="Pepoltek Limited"
              width={130}
              height={32}
              className="h-7 w-auto object-contain"
            />
            <span className="hidden sm:inline-block rounded-md bg-ink px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider text-white">
              Recruiter Cockpit
            </span>
          </Link>
        </div>

        {/* Center/Right Org Selector & Quick Deploy Action */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Org Selector */}
          <div className="hidden md:flex items-center gap-2 rounded-xl border border-[#bcd6fa] bg-canvas/40 px-3 py-1.5 text-xs">
            <span className="font-mono text-[10px] uppercase tracking-wider text-mist">Org:</span>
            <span className="font-display font-semibold text-ink">{selectedOrg}</span>
          </div>

          {/* Velocity Badge */}
          <div className="hidden xl:flex items-center gap-2 rounded-full border border-signal/30 bg-signal/10 px-3 py-1 text-xs font-mono text-signal font-semibold">
            <span className="h-2 w-2 rounded-full bg-signal animate-ping" />
            <span>Avg 7-Day Pod SLA: 6.8 Days</span>
          </div>

          {/* Deploy Pod CTA Button */}
          <Link
            href="/recruiter/pods"
            className="inline-flex items-center gap-1.5 rounded-xl bg-electric px-3.5 py-2 font-display text-xs font-semibold text-white shadow-xs transition-all hover:bg-electric-bright hover:shadow-sm"
          >
            <span>+ Deploy New Pod</span>
          </Link>

          {/* Recruiter Avatar */}
          <div className="flex items-center gap-2 border-l border-[#bcd6fa]/50 pl-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink font-display text-xs font-bold text-white shadow-xs">
              HR
            </div>
            <div className="hidden text-left xl:block">
              <div className="font-display text-xs font-bold text-ink">Elena Rostova</div>
              <div className="font-mono text-[10px] text-mist">VP Engineering Talent</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex flex-1">
        {/* Left Navigation */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white border-r border-[#bcd6fa]/50 p-4 transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
            mobileMenuOpen ? "translate-x-0 top-16" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          {/* Pod Deployment Velocity Card */}
          <div className="mb-5 rounded-xl border border-electric/30 bg-canvas p-3.5 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-mist">ACTIVE CAPACITY</span>
              <span className="text-electric font-bold">4 / 6 Pods</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-white overflow-hidden border border-[#bcd6fa]/50">
              <div className="h-full rounded-full bg-electric w-[66%]" />
            </div>
            <p className="text-[10px] text-ink-soft pt-1">
              Pod #5 ready for technical sprint validation.
            </p>
          </div>

          {/* Navigation */}
          <nav className="space-y-0.5">
            {RECRUITER_NAV.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`group flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                    active
                      ? "bg-ink text-white shadow-xs"
                      : "text-ink-soft hover:bg-canvas hover:text-ink"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={active ? "text-electric-bright" : "text-mist group-hover:text-electric transition-colors"}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-mono font-bold ${
                        active
                          ? "bg-electric text-white"
                          : "bg-canvas text-ink-soft border border-[#bcd6fa]/50"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Bottom Enterprise Escrow info */}
          <div className="mt-auto pt-4 border-t border-[#bcd6fa]/40">
            <div className="rounded-xl border border-[#bcd6fa]/60 bg-canvas/40 p-3 text-xs">
              <div className="font-mono text-[10px] uppercase tracking-wider text-mist">Escrow Balance</div>
              <div className="font-display text-sm font-bold text-ink mt-0.5">$48,500.00</div>
              <p className="text-[10px] text-ink-soft mt-1">
                4 Active Pod sprints covered by guarantee.
              </p>
            </div>

            <div className="mt-3 flex items-center justify-between px-1 text-[11px] text-mist font-mono">
              <span>Enterprise SLA 99.8%</span>
              <Link href="/login" className="hover:text-ink transition-colors">
                Sign Out
              </Link>
            </div>
          </div>
        </aside>

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
