"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Activity,
  Briefcase,
  Compass,
  FileText,
  Users,
  Award,
  Zap,
  DollarSign,
  ShieldCheck,
  Search,
  ChevronDown,
  X,
  ArrowRight,
} from "@/components/ui/Icons";
import {
  CandidatePersonaProvider,
  useCandidatePersona,
} from "@/context/CandidatePersonaContext";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
}

const CANDIDATE_NAV: NavItem[] = [
  {
    label: "Telemetry Dashboard",
    href: "/candidate/dashboard",
    icon: <Activity size={18} />,
  },
  {
    label: "Pod Applications",
    href: "/candidate/applications",
    icon: <Briefcase size={18} />,
    badge: "3 Active",
  },
  {
    label: "Reverse Job Search",
    href: "/candidate/reverse-search",
    icon: <Compass size={18} />,
    badge: "4 Matches",
  },
  {
    label: "Resume Intake & Re-Parse",
    href: "/candidate/resume-upload",
    icon: <FileText size={18} />,
  },
  {
    label: "Verified Profile",
    href: "/candidate/profile",
    icon: <Users size={18} />,
  },
  {
    label: "Talent Academy",
    href: "/candidate/academy",
    icon: <Award size={18} />,
    badge: "2 Badges",
  },
  {
    label: "Technical Vetting",
    href: "/candidate/assessments",
    icon: <Zap size={18} />,
  },
  {
    label: "Referral Bounty ($500)",
    href: "/candidate/referrals",
    icon: <DollarSign size={18} />,
    badge: "$500 Earned",
  },
  {
    label: "Sprint Messages",
    href: "/candidate/messages",
    icon: <ShieldCheck size={18} />,
    badge: "2 New",
  },
];

const SEARCHABLE_ITEMS = [
  {
    category: "Sprint Pods",
    title: "POD-842: FinTech High-Frequency Ledger Pod",
    subtitle: "Lead: Alex Morgan · 4 Engineers · 100% Escrow Funded",
    href: "/candidate/applications",
    badge: "Active",
  },
  {
    category: "Sprint Pods",
    title: "POD-719: NHS Clinical Interoperability Pod",
    subtitle: "Lead: Dr. Rachel Higgins · 6 Specialists · Compliance Cleared",
    href: "/candidate/applications",
    badge: "Clinical",
  },
  {
    category: "Reverse Search",
    title: "Enterprise Requisitions Pipeline (4 Matches)",
    subtitle: "Zero Public Exposure Guarantee · 1-Click Client Pitches",
    href: "/candidate/reverse-search",
    badge: "Matches",
  },
  {
    category: "Talent Academy",
    title: "Take Skill Diagnostic Exam",
    subtitle: "Distributed Systems & RAG Architecture Quiz · Unlock Tier 1",
    href: "/candidate/academy",
    badge: "Quiz",
  },
  {
    category: "Talent Academy",
    title: "HIPAA Title II & Clinical Data Protection",
    subtitle: "Healthcare Regulatory Framework & NHS BAA Protocols",
    href: "/candidate/academy",
    badge: "Cert",
  },
  {
    category: "Referrals",
    title: "Referral Bounty Ledger ($500 Cleared Cash)",
    subtitle: "Direct Bank Wire Disbursement Modal & Referral Links",
    href: "/candidate/referrals",
    badge: "Bounty",
  },
  {
    category: "Profile",
    title: "Verified Profile Telemetry & Skills Matrix",
    subtitle: "ATS Compatibility 98% · Code Reviews & Clinical Registration",
    href: "/candidate/profile",
    badge: "Profile",
  },
  {
    category: "Direct Channels",
    title: "Sprint Message Channels (Marcus Vance & Elena Rostova)",
    subtitle: "Encrypted pod lead & technical validator communications",
    href: "/candidate/messages",
    badge: "Messages",
  },
];

function CandidateDashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { activePersona, setActivePersona, currentProfile, isOpenToPods, setIsOpenToPods } = useCandidatePersona();

  const avatarInitials = activePersona === "alex" ? "AM" : "RH";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Search Palette State
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
        setIsSearchOpen(true);
      }
      if (e.key === "Escape") {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close profile dropdown & search when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredSearchItems = SEARCHABLE_ITEMS.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.subtitle.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  });

  return (
    <div className="h-screen overflow-hidden bg-canvas text-ink flex flex-col antialiased">
      {/* Top Navbar: Permanent Static Header (h-16 shrink-0) */}
      <header className="h-16 shrink-0 z-40 flex w-full items-center justify-between border-b border-[#bcd6fa]/50 bg-white/95 px-4 sm:px-6 lg:px-8 backdrop-blur-md shadow-xs">
        {/* Left: Mobile Toggle & Clean Brand Logo */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-1.5 text-ink-soft hover:bg-canvas lg:hidden cursor-pointer"
            aria-label="Toggle mobile menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <Link href="/" className="group flex items-center transition-transform hover:opacity-90">
            <Image
              src="/assets/pepoltek/black_logo.png"
              alt="Pepoltek Limited"
              width={130}
              height={32}
              className="h-7 w-auto object-contain"
              priority
            />
          </Link>
        </div>

        {/* Center: Search Box & Dual-Persona Switcher */}
        <div className="hidden md:flex items-center gap-3">
          {/* Working Search Box with Dropdown Palette */}
          <div className="relative w-64 lg:w-80 flex items-center" ref={searchContainerRef}>
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mist pointer-events-none transition-colors"
            />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              placeholder="Search pods, contracts, telemetry..."
              className="w-full rounded-full border border-[#bcd6fa] bg-canvas/40 py-2 pl-9.5 pr-16 text-xs text-ink placeholder-mist transition-all hover:bg-white hover:border-electric/50 focus:border-electric focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-electric/15"
            />
            <button
              type="button"
              onClick={() => {
                searchInputRef.current?.focus();
                setIsSearchOpen(true);
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center gap-0.5 rounded-md border border-[#bcd6fa]/70 bg-white px-1.5 py-0.5 font-mono text-[10px] font-semibold text-mist shadow-2xs hover:border-electric hover:text-electric transition-colors cursor-pointer"
            >
              Ctrl+K
            </button>

            {/* Interactive Search Results Dropdown */}
            {isSearchOpen && (
              <div className="absolute top-full left-0 mt-2 w-96 max-h-[380px] overflow-y-auto rounded-2xl border border-[#bcd6fa] bg-white p-2 shadow-xl z-50 animate-in fade-in-0 zoom-in-95 duration-150 thin-scrollbar">
                <div className="flex items-center justify-between px-2.5 py-1.5 border-b border-[#bcd6fa]/40 mb-1 text-[11px] font-semibold text-mist">
                  <span>Quick Navigation & Telemetry</span>
                  <span className="text-[10px] font-mono">ESC to close</span>
                </div>

                <div className="space-y-1">
                  {filteredSearchItems.map((item) => (
                    <button
                      key={item.title}
                      type="button"
                      onClick={() => {
                        setIsSearchOpen(false);
                        setSearchQuery("");
                        router.push(item.href);
                      }}
                      className="w-full text-left flex items-start gap-2.5 p-2 rounded-xl hover:bg-canvas transition-colors cursor-pointer group"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-semibold text-electric uppercase px-1.5 py-0.2 rounded bg-electric/10">
                            {item.category}
                          </span>
                          <span className="text-xs font-bold text-ink truncate group-hover:text-electric transition-colors">
                            {item.title}
                          </span>
                        </div>
                        <p className="text-[11px] text-ink-soft truncate mt-0.5">
                          {item.subtitle}
                        </p>
                      </div>
                      <ArrowRight size={13} className="text-mist group-hover:text-electric group-hover:translate-x-0.5 transition-all mt-1 shrink-0" />
                    </button>
                  ))}
                  {filteredSearchItems.length === 0 && (
                    <div className="p-4 text-center text-xs text-mist">
                      No results matching &ldquo;{searchQuery}&rdquo;
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Persona Switcher Capsule */}
          <div className="flex items-center rounded-xl border border-[#bcd6fa] bg-canvas/50 p-1 text-xs shadow-2xs">
            <button
              type="button"
              onClick={() => setActivePersona("alex")}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all cursor-pointer ${
                activePersona === "alex" ? "bg-ink text-white shadow-xs" : "text-ink-soft hover:text-ink"
              }`}
            >
              Tech (Alex Morgan)
            </button>
            <button
              type="button"
              onClick={() => setActivePersona("rachel")}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all cursor-pointer ${
                activePersona === "rachel" ? "bg-signal text-white shadow-xs" : "text-ink-soft hover:text-ink"
              }`}
            >
              Clinical (Dr. Higgins)
            </button>
          </div>
        </div>

        {/* Right: Refined Pod Availability Toggle & Interactive Profile Dropdown */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Refined Sprint Availability Toggle Button */}
          <button
            type="button"
            onClick={() => setIsOpenToPods(!isOpenToPods)}
            className={`hidden sm:flex items-center gap-2.5 rounded-xl border px-3.5 py-1.5 transition-all cursor-pointer shadow-2xs ${
              isOpenToPods
                ? "border-signal/30 bg-signal/10 hover:bg-signal/15 text-ink"
                : "border-[#bcd6fa]/70 bg-canvas/60 hover:bg-canvas text-ink-soft"
            }`}
            title="Click to toggle sprint deployment status"
          >
            <span className="relative flex h-2 w-2">
              {isOpenToPods && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-75" />
              )}
              <span className={`relative inline-flex h-2 w-2 rounded-full ${isOpenToPods ? "bg-signal" : "bg-mist"}`} />
            </span>
            <span className="text-xs font-semibold tracking-normal text-ink">
              {isOpenToPods ? "Open to Pod Sprints" : "Unavailable"}
            </span>
            <span
              className={`relative inline-flex h-4 w-7.5 items-center rounded-full transition-colors duration-200 ${
                isOpenToPods ? "bg-signal" : "bg-mist/30"
              }`}
            >
              <span
                className={`inline-block h-3 w-3 transform rounded-full bg-white shadow-xs transition-transform duration-200 ${
                  isOpenToPods ? "translate-x-3.5" : "translate-x-0.5"
                }`}
              />
            </span>
          </button>

          {/* Interactive Profile Dropdown Menu */}
          <div className="relative" ref={profileMenuRef}>
            <button
              type="button"
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="group flex items-center gap-2.5 rounded-2xl border border-transparent p-1.5 transition-all hover:border-[#bcd6fa] hover:bg-canvas/50 cursor-pointer"
              aria-expanded={profileMenuOpen}
              aria-haspopup="true"
            >
              <div className="relative">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-xl font-display text-xs font-bold text-white shadow-xs ${
                    activePersona === "alex"
                      ? "bg-gradient-to-tr from-electric to-electric-bright"
                      : "bg-gradient-to-tr from-signal to-emerald-400"
                  }`}
                >
                  {avatarInitials}
                </div>
                <span
                  className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white ${
                    isOpenToPods ? "bg-signal" : "bg-mist"
                  }`}
                />
              </div>

              <div className="hidden text-left sm:block">
                <div className="flex items-center gap-1.5">
                  <span className="font-display text-xs font-bold text-ink group-hover:text-electric transition-colors">
                    {currentProfile.fullName}
                  </span>
                  <ChevronDown
                    size={14}
                    className={`text-mist transition-transform duration-200 ${profileMenuOpen ? "rotate-180 text-electric" : ""}`}
                  />
                </div>
                <div className="font-mono text-[10px] text-ink-soft">
                  {activePersona === "alex" ? "Lead / Architect" : "Consultant / Lead"}
                </div>
              </div>
            </button>

            {/* Profile Dropdown Panel */}
            {profileMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-[#bcd6fa] bg-white p-3 shadow-xl z-50 animate-in fade-in-0 zoom-in-95 duration-150">
                {/* User Info Header */}
                <div className="border-b border-[#bcd6fa]/50 pb-3 mb-2 px-1">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl font-display text-sm font-bold text-white ${
                        activePersona === "alex"
                          ? "bg-gradient-to-tr from-electric to-electric-bright"
                          : "bg-gradient-to-tr from-signal to-emerald-400"
                      }`}
                    >
                      {avatarInitials}
                    </div>
                    <div className="min-w-0">
                      <div className="font-display text-xs font-bold text-ink truncate">
                        {currentProfile.fullName}
                      </div>
                      <div className="text-[11px] text-mist truncate">
                        {currentProfile.email}
                      </div>
                    </div>
                  </div>

                  {/* Dual-Persona Switcher in Dropdown */}
                  <div className="mt-3 rounded-xl border border-[#bcd6fa]/70 bg-canvas/40 p-1.5 text-xs">
                    <div className="text-[10px] font-mono text-mist uppercase font-semibold mb-1 px-1">
                      Switch Active Persona
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setActivePersona("alex");
                          setProfileMenuOpen(false);
                        }}
                        className={`rounded-lg px-2 py-1 text-[11px] font-bold transition-all cursor-pointer ${
                          activePersona === "alex"
                            ? "bg-ink text-white shadow-xs"
                            : "bg-white text-ink-soft hover:bg-canvas border border-[#bcd6fa]/50"
                        }`}
                      >
                        Alex Morgan
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setActivePersona("rachel");
                          setProfileMenuOpen(false);
                        }}
                        className={`rounded-lg px-2 py-1 text-[11px] font-bold transition-all cursor-pointer ${
                          activePersona === "rachel"
                            ? "bg-signal text-white shadow-xs"
                            : "bg-white text-ink-soft hover:bg-canvas border border-[#bcd6fa]/50"
                        }`}
                      >
                        Dr. Rachel
                      </button>
                    </div>
                  </div>

                  {/* Sprint Status Badge */}
                  <div className="mt-2.5 flex items-center justify-between rounded-xl bg-canvas/60 px-2.5 py-1.5 text-[11px]">
                    <span className="font-mono text-mist">Sprint Status:</span>
                    <span className="font-semibold text-signal flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-signal" />
                      {currentProfile.vettingTier}
                    </span>
                  </div>

                  {/* Telemetry Readiness Indicator */}
                  <div className="mt-2 px-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-ink-soft">Readiness Score</span>
                      <span className="font-bold text-electric">{currentProfile.readinessIndex}%</span>
                    </div>
                    <div className="mt-1 h-1 w-full rounded-full bg-canvas overflow-hidden">
                      <div
                        className="h-full rounded-full bg-electric transition-all"
                        style={{ width: `${currentProfile.readinessIndex}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Direct Action Links */}
                <div className="space-y-0.5 text-xs font-medium text-ink-soft">
                  <Link
                    href="/candidate/profile"
                    onClick={() => setProfileMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 transition-colors hover:bg-canvas hover:text-ink"
                  >
                    <ShieldCheck size={15} className="text-mist" />
                    <span>Verified Profile & Telemetry</span>
                  </Link>
                  <Link
                    href="/candidate/resume-upload"
                    onClick={() => setProfileMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 transition-colors hover:bg-canvas hover:text-ink"
                  >
                    <FileText size={15} className="text-mist" />
                    <span>AI Resume Intake & Re-Parse</span>
                  </Link>
                  <Link
                    href="/candidate/reverse-search"
                    onClick={() => setProfileMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 transition-colors hover:bg-canvas hover:text-ink"
                  >
                    <Compass size={15} className="text-mist" />
                    <span>Reverse Match Pipelines</span>
                  </Link>
                  <Link
                    href="/candidate/referrals"
                    onClick={() => setProfileMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 transition-colors hover:bg-canvas hover:text-ink"
                  >
                    <DollarSign size={15} className="text-mist" />
                    <span>Refer & Earn ($500 Bounty)</span>
                  </Link>
                </div>

                {/* Bottom Sign Out */}
                <div className="mt-2 pt-2 border-t border-[#bcd6fa]/40">
                  <Link
                    href="/login"
                    onClick={() => setProfileMenuOpen(false)}
                    className="flex items-center gap-2 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <span>Sign Out</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Body (flex-1 min-h-0 flex overflow-hidden) */}
      <div className="flex-1 min-h-0 flex overflow-hidden relative">
        {/* Left Sidebar: Fixed Width (w-64) with Static Top + Scrollable Nav + Static Bottom */}
        <aside
          className={`fixed inset-y-0 left-0 top-16 z-30 w-64 border-r border-[#bcd6fa]/50 bg-white/95 backdrop-blur-md transition-transform duration-300 lg:static lg:top-0 lg:translate-x-0 ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          } flex flex-col h-full`}
        >
          {/* Top Static Readiness Box (shrink-0, NEVER scrolls) */}
          <div className="shrink-0 p-4 border-b border-[#bcd6fa]/40 bg-canvas/30">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-ink font-display">Profile Readiness</span>
              <span className="font-display text-sm font-bold text-electric">
                {currentProfile.readinessIndex}%
              </span>
            </div>
            <div className="mt-2 h-1.5 w-full rounded-full bg-canvas overflow-hidden border border-[#bcd6fa]/40">
              <div
                className="h-full rounded-full bg-gradient-to-r from-electric to-electric-bright transition-all duration-500"
                style={{ width: `${currentProfile.readinessIndex}%` }}
              />
            </div>
            <p className="mt-2 text-[10.5px] text-ink-soft leading-snug">
              {activePersona === "alex"
                ? "Tier 1 Elite Squad verified. Ready for 7-day client sprint deployment."
                : "Tier 1 Clinical Specialist (NHS Band 8). Cleared for acute ICU rota deployment."}
            </p>
          </div>

          {/* Middle Nav Items: ONLY THIS CONTAINER SCROLLS with thin scrollbar */}
          <nav className="flex-1 min-h-0 overflow-y-auto space-y-1 p-3 pr-2 thin-scrollbar">
            {CANDIDATE_NAV.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`group flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-all whitespace-nowrap ${
                    active
                      ? "bg-ink text-white shadow-xs"
                      : "text-ink-soft hover:bg-canvas hover:text-ink"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={active ? "text-electric-bright shrink-0" : "text-mist group-hover:text-electric transition-colors shrink-0"}>
                      {item.icon}
                    </span>
                    <span className="whitespace-nowrap truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`shrink-0 whitespace-nowrap ml-2 rounded-full px-2 py-0.5 text-[10.5px] font-semibold ${
                        active
                          ? "bg-electric text-white"
                          : "bg-electric/10 text-electric"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Bottom Static Help Box (shrink-0, NEVER scrolls) */}
          <div className="shrink-0 p-3 border-t border-[#bcd6fa]/40 bg-white">
            <div className="rounded-2xl border border-[#bcd6fa]/60 bg-canvas/60 p-3 text-xs">
              <div className="font-display font-bold text-ink">Need Pod Guidance?</div>
              <p className="mt-0.5 text-[11px] text-ink-soft leading-snug">
                Connect directly with Marcus Vance, In-House Pod Director.
              </p>
              <Link
                href="/candidate/messages"
                className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-electric hover:underline whitespace-nowrap"
              >
                <span>Open Sprint Channel →</span>
              </Link>
            </div>

            <div className="mt-2.5 flex items-center justify-between px-1 text-[11px] text-mist font-medium">
              <span>Talent v2.4</span>
              <span className="flex items-center gap-1 text-signal font-semibold">
                <span className="h-1.5 w-1.5 rounded-full bg-signal" />
                Live Sync
              </span>
            </div>
          </div>
        </aside>

        {/* Backdrop overlay for mobile drawer */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 top-16 z-20 bg-ink/30 backdrop-blur-xs lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Center Workspace Content Area: Independent Vertical Scroll */}
        <main className="flex-1 min-w-0 h-full overflow-y-auto p-4 sm:p-6 lg:p-8 bg-canvas">
          <div className="mx-auto max-w-7xl 2xl:max-w-[1360px] pb-12">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function CandidateDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CandidatePersonaProvider>
      <CandidateDashboardShell>{children}</CandidateDashboardShell>
    </CandidatePersonaProvider>
  );
}
