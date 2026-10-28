"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getCurrentUserAction, logoutAction } from "@/actions/auth.actions";
import {
  ChevronDown,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Briefcase,
  ExternalLink,
} from "@/components/ui/Icons";

interface NavItem {
  label: string;
  href: string;
  badge?: string;
  badgeColor?: string;
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
    href: "/referrals/network",
    icon: (
      <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    label: "Bounty Opportunities",
    href: "/referrals/bounties",
    badge: "Live Tiers",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    icon: (
      <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    label: "Payouts & Escrow",
    href: "/referrals/payouts",
    icon: (
      <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    label: "Browse Bounty Roles",
    href: "/jobs",
    badge: "Live Sprints",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    icon: (
      <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
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
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const [partnerUser, setPartnerUser] = useState({
    fullName: "",
    email: "",
    role: "Referral Partner",
    referralCode: "",
  });

  useEffect(() => {
    async function loadUser() {
      try {
        const u = await getCurrentUserAction();
        if (u) {
          const fName = u.fullName || u.email?.split("@")[0] || "Partner";
          setPartnerUser({
            fullName: fName,
            email: u.email || "",
            role: "Referral Partner",
            referralCode: u.referralCode || "REF-PARTNER",
          });
        }
      } catch {
        // Handle error
      }
    }
    loadUser();
  }, []);

  // Close profile dropdown on outside click or escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setProfileMenuOpen(false);
        setMobileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleLogout = async () => {
    await logoutAction();
    router.push("/login");
  };

  const avatarInitials =
    partnerUser.fullName
      .trim()
      .split(/\s+/)
      .map((w) => w[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "AM";

  return (
    <div className="h-screen max-h-screen overflow-hidden bg-canvas font-sans text-ink antialiased flex select-none">
      {/* Desktop Static Sidebar (Fixed on Left, Max-H Screen, Never Scrolls Away) */}
      <aside className="hidden lg:flex w-68 shrink-0 h-screen max-h-screen flex-col border-r border-[#bcd6fa] bg-white overflow-hidden z-30">
        {/* Brand Header */}
        <div className="flex h-16 shrink-0 items-center px-6 border-b border-[#bcd6fa]/60">
          <Link href="/referrals/dashboard" className="flex items-center gap-2.5 group">
            <div className="flex items-center">
              <Image
                src="/assets/pepoltek/black_logo.png"
                alt="Pepoltek Limited"
                width={124}
                height={28}
                className="h-6 w-auto object-contain transition-transform group-hover:scale-[1.02]"
                priority
              />
            </div>
            <span className="rounded-full bg-electric/10 px-2 py-0.5 text-[9.5px] font-mono font-bold text-electric uppercase tracking-wider">
              PARTNER
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex-1 min-h-0 space-y-1 p-4 overflow-y-auto thin-scrollbar">
          <div className="px-3 py-2 text-[10.5px] font-bold tracking-wider text-mist uppercase font-mono">
            Partner Navigation
          </div>
          {REFERRALS_NAV.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-ink text-white shadow-xs"
                    : "text-ink-soft hover:bg-canvas hover:text-ink"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? "text-signal" : "text-mist group-hover:text-ink transition-colors"}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[9.5px] font-mono border font-bold ${
                      isActive
                        ? "bg-white/20 text-white border-white/20"
                        : item.badgeColor || "bg-emerald-50 text-emerald-700 border-emerald-200"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Partner Account Footer Card */}
        <div className="shrink-0 border-t border-[#bcd6fa]/60 p-4 space-y-2.5 bg-white">
          <div className="flex items-center gap-3 rounded-2xl border border-[#bcd6fa]/70 bg-canvas/60 p-3">
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-ink font-mono text-xs font-bold text-signal shadow-2xs">
              {avatarInitials}
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-signal" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-xs font-bold text-ink">{partnerUser.fullName}</div>
              <div className="truncate text-[10px] font-mono text-electric font-semibold">
                {partnerUser.referralCode}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between px-1 text-[11px] text-mist font-medium">
            <span className="inline-flex items-center gap-1.5 text-emerald-600 font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Escrow Node Active</span>
            </span>
            <Link
              href="/"
              className="text-ink-soft hover:text-electric transition-colors"
            >
              Public Site
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 min-h-0 flex flex-col h-screen max-h-screen overflow-hidden">
        {/* Top Header */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-[#bcd6fa]/60 bg-white/95 px-4 sm:px-6 lg:px-8 backdrop-blur-md shadow-xs z-20">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-ink-soft hover:bg-canvas transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Mobile Brand Logo */}
            <div className="lg:hidden flex items-center gap-2">
              <Image
                src="/assets/pepoltek/black_logo.png"
                alt="Pepoltek Limited"
                width={110}
                height={26}
                className="h-5.5 w-auto object-contain"
                priority
              />
              <span className="rounded-full bg-electric/10 px-1.5 py-0.2 text-[9px] font-mono font-bold text-electric">
                PARTNER
              </span>
            </div>

            {/* Desktop Status Pill */}
            <div className="hidden sm:flex items-center gap-2 rounded-full border border-[#bcd6fa]/70 bg-canvas/60 px-3 py-1 text-xs font-medium text-slate-700">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-signal" />
              </span>
              <span className="font-semibold text-ink">Affiliate &amp; Referral Partner Network</span>
              <span className="border-l border-[#bcd6fa] pl-2 font-mono text-[10px] font-bold text-electric">
                Live Escrow Ledger
              </span>
            </div>
          </div>

          {/* Right Header Navigation & Interactive Profile Dropdown */}
          <div className="flex items-center gap-3">
            <Link
              href="/candidate/dashboard"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-[#bcd6fa] bg-white px-3 py-1.5 text-xs font-semibold text-ink-soft hover:text-ink hover:border-electric transition-colors shadow-2xs"
            >
              <span>Candidate Portal</span>
              <ArrowRight size={12} className="text-mist" />
            </Link>

            <Link
              href="/jobs"
              className="hidden md:inline-flex items-center gap-1.5 rounded-xl border border-[#bcd6fa] bg-white px-3 py-1.5 text-xs font-semibold text-ink-soft hover:text-ink hover:border-electric transition-colors shadow-2xs"
            >
              <span>Browse Bounty Roles</span>
            </Link>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileMenuRef}>
              <button
                type="button"
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-2 rounded-xl border border-[#bcd6fa]/70 bg-canvas/50 p-1.5 sm:px-3 sm:py-1.5 hover:border-electric hover:bg-canvas transition-all cursor-pointer shadow-2xs"
              >
                <div className="relative flex h-7 w-7 items-center justify-center rounded-lg bg-ink font-mono text-xs font-bold text-signal shadow-xs">
                  {avatarInitials}
                  <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border-2 border-white bg-signal" />
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-bold text-ink leading-tight">{partnerUser.fullName}</div>
                  <div className="text-[10px] font-mono text-ink-soft leading-tight">{partnerUser.role}</div>
                </div>
                <ChevronDown size={13} className={`text-mist transition-transform ${profileMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Profile Dropdown Panel */}
              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-[#bcd6fa] bg-white p-2 shadow-lg z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="p-3 border-b border-[#bcd6fa]/50">
                    <div className="font-display text-sm font-bold text-ink">{partnerUser.fullName}</div>
                    <div className="text-xs text-mist truncate">{partnerUser.email}</div>
                    <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-electric/10 px-2 py-0.5 font-mono text-[10px] font-bold text-electric">
                      <span>Referral Code:</span>
                      <span>{partnerUser.referralCode}</span>
                    </div>
                  </div>

                  <div className="p-1 space-y-0.5 text-xs">
                    <Link
                      href="/referrals/dashboard"
                      onClick={() => setProfileMenuOpen(false)}
                      className="flex items-center justify-between rounded-xl px-3 py-2 font-medium text-ink-soft hover:bg-canvas hover:text-ink transition-colors"
                    >
                      <span>Partner Cockpit</span>
                      <ArrowRight size={13} className="text-mist" />
                    </Link>
                    <Link
                      href="/candidate/dashboard"
                      onClick={() => setProfileMenuOpen(false)}
                      className="flex items-center justify-between rounded-xl px-3 py-2 font-medium text-ink-soft hover:bg-canvas hover:text-ink transition-colors"
                    >
                      <span>Candidate Portal</span>
                      <ArrowRight size={13} className="text-mist" />
                    </Link>
                    <Link
                      href="/jobs"
                      onClick={() => setProfileMenuOpen(false)}
                      className="flex items-center justify-between rounded-xl px-3 py-2 font-medium text-ink-soft hover:bg-canvas hover:text-ink transition-colors"
                    >
                      <span>Browse Open Bounties</span>
                      <ExternalLink size={13} className="text-mist" />
                    </Link>
                    <Link
                      href="/"
                      onClick={() => setProfileMenuOpen(false)}
                      className="flex items-center justify-between rounded-xl px-3 py-2 font-medium text-ink-soft hover:bg-canvas hover:text-ink transition-colors"
                    >
                      <span>Public Website</span>
                      <ExternalLink size={13} className="text-mist" />
                    </Link>
                  </div>

                  <div className="p-1 pt-1.5 border-t border-[#bcd6fa]/50">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full rounded-xl bg-ink/5 px-3 py-2 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-[#bcd6fa] bg-white p-4 space-y-2 shadow-sm animate-in slide-in-from-top-1">
            <div className="px-2 py-1 text-[10px] font-mono font-bold text-mist uppercase">
              Partner Navigation
            </div>
            {REFERRALS_NAV.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold text-ink hover:bg-canvas"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-mist">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="rounded-full px-2 py-0.5 text-[9.5px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}

            <div className="pt-2 border-t border-[#bcd6fa]/40 flex flex-col gap-1.5">
              <Link
                href="/candidate/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-xl border border-[#bcd6fa] px-3 py-2 text-xs font-semibold text-ink-soft text-center"
              >
                Switch to Candidate Portal
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-xl bg-ink px-3 py-2 text-xs font-semibold text-white text-center cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 lg:p-8 thin-scrollbar">
          <div className="max-w-7xl w-full mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
