"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logoutAction } from "@/actions/auth.actions";
import {
  Layout,
  Zap,
  Briefcase,
  Users,
  Clock,
  BarChart2,
  DollarSign,
  Search,
  LogOut,
  ChevronDown,
  Building2,
  Kanban,
  ShieldCheck,
} from "@/components/ui/Icons";

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
    icon: <Layout size={18} />,
  },
  {
    label: "AI-HRMS Search & Audits",
    href: "/recruiter/ai-search",
    icon: <Zap size={18} />,
  },
  {
    label: "Requisitions & Jobs",
    href: "/recruiter/requisitions",
    icon: <Briefcase size={18} />,
  },
  {
    label: "Candidate Applications & Kanban",
    href: "/recruiter/applications",
    badge: "KANBAN",
    icon: <Kanban size={18} />,
  },
  {
    label: "Client Organizations",
    href: "/recruiter/clients",
    icon: <Building2 size={18} />,
  },
  {
    label: "Talent Pool (Candidates)",
    href: "/recruiter/candidates",
    icon: <Users size={18} />,
  },
  {
    label: "Sprint Interviews",
    href: "/recruiter/interviews",
    icon: <Clock size={18} />,
  },
  {
    label: "Assessments & Vetting",
    href: "/recruiter/assessments",
    badge: "NEW",
    icon: <ShieldCheck size={18} />,
  },
  {
    label: "Referral Network",
    href: "/recruiter/referrals",
    icon: <DollarSign size={18} />,
  },
  {
    label: "Hiring Analytics",
    href: "/recruiter/analytics",
    icon: <BarChart2 size={18} />,
  },
];

export default function RecruiterDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const [recruiterUser, setRecruiterUser] = useState({
    fullName: "Talent Operations",
    email: "recruiter@pepoltek.com",
    role: "Senior Recruiter",
  });

  useEffect(() => {
    async function loadUser() {
      try {
        const { getCurrentUserAction } = await import("@/actions/auth.actions");
        const u = await getCurrentUserAction();
        if (u) {
          setRecruiterUser({
            fullName: u.fullName || "Talent Operations",
            email: u.email || "recruiter@pepoltek.com",
            role: u.role === "RECRUITER" ? "Senior Recruiter" : u.role || "Recruiter",
          });
        }
      } catch {
        // Fallback gracefully
      }
    }
    loadUser();
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const avatarInitials =
    recruiterUser.fullName
      .trim()
      .split(/\s+/)
      .map((w) => w[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "MI";

  return (
    <div className="h-screen overflow-hidden bg-canvas text-ink flex flex-col antialiased">
      {/* Permanent Static Top Navbar (h-16 shrink-0, Solid White, Proportional Spacing, Zero Overlap) */}
      <header className="h-16 shrink-0 z-40 flex w-full items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 sm:px-6 lg:px-8 backdrop-blur-md shadow-2xs select-none relative">
        {/* Left: Mobile Toggle, Brand Logo & Left-Aligned Search Bar */}
        <div className="flex items-center gap-3 sm:gap-5 min-w-0">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-ink lg:hidden cursor-pointer transition-colors shrink-0"
            aria-label="Toggle navigation"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <Link href="/" className="group flex items-center gap-2.5 transition-transform hover:opacity-95 shrink-0">
            <Image
              src="/assets/pepoltek/black_logo.png"
              alt="Pepoltek Limited"
              width={120}
              height={30}
              className="h-6.5 w-auto object-contain"
              priority
            />
            <div className="h-4 w-[1px] bg-slate-200 hidden sm:block" />
            <span className="hidden sm:inline-flex items-center gap-1 rounded-full border border-electric/25 bg-electric/10 px-2 py-0.5 text-[10px] font-mono font-semibold text-electric uppercase tracking-wider">
              Recruiter ATS
            </span>
          </Link>

          {/* Left-Aligned Search Bar */}
          <div className="relative hidden md:flex items-center w-64 lg:w-80 shrink-0">
            <Search size={14} className="absolute left-3 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search talent, requisitions, jobs..."
              className="w-full rounded-full border border-slate-200/80 bg-slate-50/70 hover:bg-white hover:border-slate-300 focus:bg-white focus:border-electric focus:ring-2 focus:ring-electric/15 py-1.5 pl-9 pr-14 text-xs text-ink placeholder-slate-400 transition-all font-mono outline-hidden"
            />
            <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[9.5px] font-mono text-slate-400 shadow-2xs font-semibold">
              Ctrl K
            </kbd>
          </div>
        </div>

        {/* Right: Refined Profile Menu */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Interactive Profile Dropdown Menu */}
          <div className="relative" ref={profileMenuRef}>
            <button
              type="button"
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="group flex items-center gap-2 rounded-2xl p-1 transition-all hover:bg-slate-50 cursor-pointer"
              aria-expanded={profileMenuOpen}
              aria-haspopup="true"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-ink to-ink-soft font-display text-xs font-bold text-white shadow-2xs">
                {avatarInitials}
              </div>
              <div className="hidden text-left xl:block pr-0.5">
                <div className="font-display text-xs font-bold text-ink truncate max-w-[110px]">
                  {recruiterUser.fullName}
                </div>
                <div className="font-mono text-[10px] text-slate-400 leading-tight">
                  {recruiterUser.role}
                </div>
              </div>
              <ChevronDown
                size={13}
                className={`text-slate-400 transition-transform duration-200 ${
                  profileMenuOpen ? "rotate-180 text-ink" : "group-hover:text-ink"
                }`}
              />
            </button>

            {/* Elevated Recruiter Profile Menu */}
            {profileMenuOpen && (
              <div className="absolute right-0 top-11 z-50 w-72 rounded-2xl border border-[#bcd6fa] bg-white p-3.5 shadow-xl backdrop-blur-md animate-in fade-in-0 zoom-in-95 duration-150">
                <div className="flex items-center gap-2.5 border-b border-[#bcd6fa]/40 pb-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink font-display text-xs font-bold text-white shadow-xs shrink-0">
                    {avatarInitials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-display text-xs font-bold text-ink truncate">
                      {recruiterUser.fullName}
                    </h4>
                    <p className="text-[11px] text-ink-soft truncate font-medium">
                      {recruiterUser.email}
                    </p>
                    <span className="text-[10px] text-electric font-mono font-semibold block mt-0.5">
                      Senior Staff Recruiter
                    </span>
                  </div>
                </div>

                {/* Quick Cockpit Shortcuts */}
                <div className="my-2 space-y-0.5 text-xs font-medium text-ink-soft">
                  <Link
                    href="/recruiter/requisitions"
                    onClick={() => setProfileMenuOpen(false)}
                    className="flex items-center gap-2 rounded-xl px-2.5 py-1.5 transition-colors hover:bg-canvas hover:text-ink"
                  >
                    <Briefcase size={14} className="text-mist" />
                    <span>Active Requisitions &amp; Gigs</span>
                  </Link>
                  <Link
                    href="/recruiter/candidates"
                    onClick={() => setProfileMenuOpen(false)}
                    className="flex items-center gap-2 rounded-xl px-2.5 py-1.5 transition-colors hover:bg-canvas hover:text-ink"
                  >
                    <Users size={14} className="text-mist" />
                    <span>Talent Pool (Candidates)</span>
                  </Link>
                  <Link
                    href="/recruiter/interviews"
                    onClick={() => setProfileMenuOpen(false)}
                    className="flex items-center gap-2 rounded-xl px-2.5 py-1.5 transition-colors hover:bg-canvas hover:text-ink"
                  >
                    <Clock size={14} className="text-mist" />
                    <span>Sprint Panel Interviews</span>
                  </Link>
                </div>

                {/* Sign Out Action */}
                <div className="pt-2 border-t border-[#bcd6fa]/40">
                  <button
                    type="button"
                    onClick={async () => {
                      setProfileMenuOpen(false);
                      await logoutAction();
                      router.push("/login");
                    }}
                    className="flex w-full items-center justify-between rounded-xl px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <LogOut size={13} />
                      <span>Sign Out</span>
                    </div>
                    <span className="font-enterprise text-[10px] text-mist font-medium">RecruiterOS</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Shell: Sidebar Pinned to Left, Only Main Body Scrolls */}
      <div className="flex flex-1 min-h-0 overflow-hidden relative">
        {/* Desktop Left Sidebar: Pinned and Scrollable */}
        <aside className="hidden lg:flex w-72 shrink-0 h-full border-r border-[#bcd6fa]/50 bg-white p-4 pb-5 flex-col overflow-hidden">
          {/* Top Platform Status Card (shrink-0) */}
          <div className="shrink-0 mb-4 rounded-2xl border border-electric/25 bg-gradient-to-br from-electric/5 to-canvas p-3.5 shadow-2xs">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-ink font-display">Sprint Capacity</span>
              <span className="font-enterprise text-xs font-bold text-electric">4 Active Requisitions</span>
            </div>
            <div className="mt-2 h-1.5 w-full rounded-full bg-canvas overflow-hidden border border-[#bcd6fa]/40">
              <div className="h-full rounded-full bg-gradient-to-r from-electric to-cyan-500 w-[75%]" />
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-ink-soft">
              <span>7-Day Deployment SLA</span>
              <span className="font-semibold text-signal">On-Track</span>
            </div>
          </div>

          {/* Middle Nav Items: Only this container scrolls if menu is long */}
          <nav className="flex-1 min-h-0 overflow-y-auto space-y-1 pr-1 thin-scrollbar">
            {RECRUITER_NAV.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-all select-none cursor-pointer ${
                    active
                      ? "bg-ink text-white shadow-xs"
                      : "text-ink-soft hover:bg-canvas hover:text-ink"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`shrink-0 transition-colors ${
                        active ? "text-electric-bright" : "text-mist group-hover:text-electric"
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span className="whitespace-nowrap truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-enterprise font-bold ${
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

          {/* Bottom Enterprise Talent Engine Card (Small Height, Sleek & Relatable) */}
          <div className="shrink-0 pt-3 border-t border-[#bcd6fa]/40 mt-3 font-enterprise">
            <div className="rounded-xl border border-[#bcd6fa]/70 bg-gradient-to-br from-white via-canvas/40 to-canvas/70 p-2.5 shadow-2xs hover:border-electric/40 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-ink-soft">
                    Talent Engine
                  </span>
                </div>
                <span className="rounded border border-emerald-200 bg-emerald-50 px-1.5 py-0.2 text-[9px] font-bold text-emerald-700">
                  AI Active
                </span>
              </div>

              <div className="mt-1 flex items-baseline justify-between">
                <div className="text-xs font-bold text-ink">
                  Candidate Directory
                </div>
                <span className="text-[10px] font-semibold text-electric">
                  Live DB Pool
                </span>
              </div>

              <div className="mt-1 flex items-center justify-between text-[10px] text-mist border-t border-[#bcd6fa]/30 pt-1">
                <span>ATS Connected</span>
                <span className="font-semibold text-signal">Database Live</span>
              </div>
            </div>

            <div className="mt-2 flex items-center justify-between px-1 text-[11px] text-mist font-medium">
              <span>RecruiterOS v2.4</span>
              <button
                type="button"
                onClick={async () => {
                  await logoutAction();
                  router.push("/login");
                }}
                className="hover:text-ink transition-colors cursor-pointer inline-flex items-center gap-1 font-semibold text-rose-600 hover:text-rose-700"
              >
                <LogOut size={12} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Mobile Slide-over Drawer & Backdrop */}
        {mobileMenuOpen && (
          <>
            <div
              className="fixed inset-0 top-16 z-40 bg-ink/30 backdrop-blur-xs lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <aside className="fixed inset-y-0 left-0 top-16 z-50 w-72 border-r border-[#bcd6fa]/50 bg-white p-4 flex flex-col justify-between overflow-hidden lg:hidden shadow-xl animate-in slide-in-from-left duration-200">
              <nav className="flex-1 min-h-0 overflow-y-auto space-y-1 thin-scrollbar">
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
                        <span className={active ? "text-electric-bright" : "text-mist"}>
                          {item.icon}
                        </span>
                        <span>{item.label}</span>
                      </div>
                    </Link>
                  );
                })}
              </nav>

              <div className="pt-3 border-t border-[#bcd6fa]/40">
                <button
                  type="button"
                  onClick={async () => {
                    await logoutAction();
                    router.push("/login");
                  }}
                  className="w-full flex items-center justify-center gap-2 rounded-xl py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                >
                  <LogOut size={14} />
                  <span>Sign Out</span>
                </button>
              </div>
            </aside>
          </>
        )}

        {/* Main Content: Only this container scrolls */}
        <main className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
