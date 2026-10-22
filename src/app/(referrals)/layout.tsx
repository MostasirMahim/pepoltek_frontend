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

const REFERRALS_NAV: NavItem[] = [
  {
    label: "Partner Cockpit",
    href: "/referrals/dashboard",
    icon: (
      <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    label: "Candidate Network",
    href: "/referrals/dashboard#network",
    badge: "4 Active",
    icon: (
      <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    label: "Payouts & Escrow",
    href: "/referrals/dashboard#payouts",
    badge: "$2.5k Cleared",
    icon: (
      <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

export default function ReferralsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-canvas font-sans text-ink antialiased">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-[#bcd6fa] bg-white">
        {/* Brand */}
        <div className="flex h-16 items-center justify-between border-b border-[#bcd6fa] px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="relative h-7 w-28">
              <Image
                src="/images/logo.png"
                alt="Pepoltek"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
            <span className="rounded-full bg-electric/10 px-2 py-0.5 text-[10px] font-mono font-semibold text-electric">
              PARTNER
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex-1 space-y-1 p-4 overflow-y-auto">
          <div className="px-3 py-2 text-[11px] font-semibold tracking-wider text-ink-soft uppercase font-mono">
            Partner Navigation
          </div>
          {REFERRALS_NAV.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-ink text-white shadow-xs"
                    : "text-ink-soft hover:bg-canvas hover:text-ink"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? "text-signal" : "text-ink-soft group-hover:text-ink"}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-mono ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Partner Account Footer */}
        <div className="border-t border-[#bcd6fa] p-4">
          <div className="flex items-center gap-3 rounded-2xl border border-[#bcd6fa] bg-canvas p-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-ink font-mono text-xs font-bold text-signal">
              AM
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-xs font-bold text-ink">Alex Morgan</div>
              <div className="truncate text-[10px] font-mono text-ink-soft">
                PEP-ALEX-9042
              </div>
            </div>
          </div>
          <Link
            href="/"
            className="mt-3 block text-center text-xs font-medium text-ink-soft hover:text-ink transition-colors"
          >
            Back to Public Website
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <header className="flex h-16 items-center justify-between border-b border-[#bcd6fa] bg-white px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-ink-soft hover:bg-canvas"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="hidden sm:block text-xs text-ink-soft">
              Affiliate & Referral Partner Network
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/candidate/dashboard"
              className="rounded-xl border border-[#bcd6fa] bg-white px-3 py-1.5 text-xs font-semibold text-ink-soft hover:text-ink transition-colors"
            >
              Candidate Portal
            </Link>
            <Link
              href="/login"
              className="rounded-xl bg-ink px-3 py-1.5 text-xs font-semibold text-white hover:bg-electric transition-colors"
            >
              Sign Out
            </Link>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-[#bcd6fa] bg-white p-4 space-y-2">
            {REFERRALS_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold text-ink-soft hover:bg-canvas"
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span className="text-[10px] font-mono text-emerald-600 font-bold">{item.badge}</span>
                )}
              </Link>
            ))}
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
