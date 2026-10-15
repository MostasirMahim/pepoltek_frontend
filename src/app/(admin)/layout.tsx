"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Users,
  Briefcase,
  ShieldCheck,
  FileText,
  DollarSign,
  Settings,
  Search,
  ChevronDown,
  LogOut,
} from "@/components/ui/Icons";
import { ADMIN_TELEMETRY } from "@/data/adminDashboardData";

interface NavItem {
  label: string;
  href: string;
  badge?: string;
  icon: React.ReactNode;
}

const ADMIN_NAV: NavItem[] = [
  {
    label: "Mission Control",
    href: "/admin/dashboard",
    icon: <Activity size={18} />,
  },
  {
    label: "User & Role RBAC",
    href: "/admin/users",
    badge: "1,420",
    icon: <Users size={18} />,
  },
  {
    label: "Pod Allocations",
    href: "/admin/pods-management",
    badge: "48 Live",
    icon: <Briefcase size={18} />,
  },
  {
    label: "Compliance Vault",
    href: "/admin/compliance",
    badge: "99.9%",
    icon: <ShieldCheck size={18} />,
  },
  {
    label: "System Audit Logs",
    href: "/admin/audit-logs",
    badge: "P0 Live",
    icon: <FileText size={18} />,
  },
  {
    label: "Escrow & Payouts",
    href: "/admin/finance",
    icon: <DollarSign size={18} />,
  },
  {
    label: "System Settings",
    href: "/admin/settings",
    icon: <Settings size={18} />,
  },
];

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="h-screen overflow-hidden bg-canvas text-ink flex flex-col antialiased">
      {/* Top Navbar: Permanent Static Header (h-16 shrink-0) */}
      <header className="h-16 shrink-0 z-40 flex w-full items-center justify-between border-b border-[#bcd6fa]/50 bg-white/95 px-4 sm:px-6 lg:px-8 backdrop-blur-md shadow-xs">
        {/* Left: Mobile Toggle & Brand Logo */}
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

          <Link href="/" className="group flex items-center gap-2.5 transition-transform hover:opacity-90">
            <Image
              src="/assets/pepoltek/black_logo.png"
              alt="Pepoltek Limited"
              width={130}
              height={32}
              className="h-7 w-auto object-contain"
              priority
            />
            <span className="hidden sm:inline-block rounded-md border border-electric/30 bg-electric/10 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-electric">
              AdminOS
            </span>
          </Link>
        </div>

        {/* Center: Enhanced Professional Search Box */}
        <div className="relative hidden md:flex items-center w-72 lg:w-96">
          <Search size={15} className="absolute left-3.5 text-mist pointer-events-none transition-colors" />
          <input
            type="text"
            placeholder="Search audit logs, users, pods, escrow..."
            className="w-full rounded-full border border-[#bcd6fa] bg-canvas/40 py-2 pl-9.5 pr-14 text-xs text-ink placeholder-mist transition-all hover:bg-white hover:border-electric/50 focus:border-electric focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-electric/15"
          />
          <kbd className="absolute right-3 hidden sm:inline-flex items-center gap-0.5 rounded-md border border-[#bcd6fa]/70 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-mist shadow-2xs">
            Ctrl+K
          </kbd>
        </div>

        {/* Right: Platform Health Status & Super Admin Profile Dropdown */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Platform Health Status Indicator */}
          <div className="hidden sm:flex items-center gap-2 rounded-full border border-signal/30 bg-signal/10 px-3.5 py-1.5 text-xs shadow-2xs">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-signal" />
            </span>
            <span className="text-xs font-semibold text-signal">
              Health: {ADMIN_TELEMETRY.platformUptimeScore} Optimal
            </span>
          </div>

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
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-ink to-ink-soft font-display text-xs font-bold text-white shadow-xs">
                  SJ
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-signal" />
              </div>
              <div className="hidden text-left xl:block pr-1">
                <div className="font-display text-xs font-bold text-ink">Sarah Jenkins</div>
                <div className="text-[11px] text-mist font-medium">Super Administrator</div>
              </div>
              <ChevronDown
                size={14}
                className={`text-mist transition-transform duration-200 ${profileMenuOpen ? "rotate-180 text-ink" : "group-hover:text-ink"}`}
              />
            </button>

            {/* Elevated Profile Dropdown Menu Card */}
            {profileMenuOpen && (
              <div className="absolute right-0 top-12 z-50 w-80 rounded-2xl border border-[#bcd6fa] bg-white p-3.5 shadow-xl backdrop-blur-md animate-in fade-in-0 zoom-in-95 duration-150">
                {/* Header Profile Identity */}
                <div className="flex items-center gap-3 border-b border-[#bcd6fa]/40 pb-3.5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-ink to-ink-soft font-display text-sm font-bold text-white shadow-xs shrink-0">
                    SJ
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="font-display text-xs font-bold text-ink truncate">
                        Sarah Jenkins
                      </h4>
                      <span className="rounded-full bg-rose-50 border border-rose-200 px-2 py-0.5 text-[10px] font-semibold text-rose-700 shrink-0">
                        Root Privilege
                      </span>
                    </div>
                    <p className="text-[11px] text-ink-soft truncate font-medium">
                      sarah.jenkins@pepoltek.com
                    </p>
                    <span className="text-[10.5px] text-mist truncate block mt-0.5">
                      Platform Operations Director
                    </span>
                  </div>
                </div>

                {/* Telemetry Micro Summary */}
                <div className="my-3 grid grid-cols-3 gap-2 rounded-xl bg-canvas/60 p-2.5 text-center border border-[#bcd6fa]/40">
                  <div>
                    <div className="text-[10px] font-semibold text-mist uppercase tracking-wider">Uptime</div>
                    <div className="font-display text-xs font-bold text-signal">
                      {ADMIN_TELEMETRY.platformUptimeScore}
                    </div>
                  </div>
                  <div className="border-x border-[#bcd6fa]/40">
                    <div className="text-[10px] font-semibold text-mist uppercase tracking-wider">Live Pods</div>
                    <div className="font-display text-xs font-bold text-electric">
                      {ADMIN_TELEMETRY.activePodsCount}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-semibold text-mist uppercase tracking-wider">Escrow</div>
                    <div className="font-display text-xs font-bold text-ink">
                      $485k
                    </div>
                  </div>
                </div>

                {/* Direct Action Links */}
                <div className="space-y-0.5 text-xs font-medium text-ink-soft">
                  <Link
                    href="/admin/users"
                    onClick={() => setProfileMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 transition-colors hover:bg-canvas hover:text-ink"
                  >
                    <Users size={15} className="text-mist" />
                    <span>User & Role Governance</span>
                  </Link>
                  <Link
                    href="/admin/pods-management"
                    onClick={() => setProfileMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 transition-colors hover:bg-canvas hover:text-ink"
                  >
                    <Briefcase size={15} className="text-mist" />
                    <span>Global Pod Allocation Engine</span>
                  </Link>
                  <Link
                    href="/admin/compliance"
                    onClick={() => setProfileMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 transition-colors hover:bg-canvas hover:text-ink"
                  >
                    <ShieldCheck size={15} className="text-mist" />
                    <span>Compliance & Regulatory Vault</span>
                  </Link>
                  <Link
                    href="/admin/audit-logs"
                    onClick={() => setProfileMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 transition-colors hover:bg-canvas hover:text-ink"
                  >
                    <FileText size={15} className="text-mist" />
                    <span>Immutable Audit Log Vault</span>
                  </Link>
                  <Link
                    href="/admin/settings"
                    onClick={() => setProfileMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 transition-colors hover:bg-canvas hover:text-ink"
                  >
                    <Settings size={15} className="text-mist" />
                    <span>Platform Settings & Pricing</span>
                  </Link>
                </div>

                {/* Bottom Sign Out */}
                <div className="mt-2 pt-2 border-t border-[#bcd6fa]/40">
                  <Link
                    href="/login"
                    onClick={() => setProfileMenuOpen(false)}
                    className="flex items-center justify-between rounded-xl px-2.5 py-2 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-50"
                  >
                    <div className="flex items-center gap-2">
                      <LogOut size={14} />
                      <span>Sign Out of Admin Console</span>
                    </div>
                    <span className="font-mono text-[10px] text-mist">v2.4</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Shell: Sidebar Pinned to Left, Only Main Body Scrolls */}
      <div className="flex flex-1 min-h-0 overflow-hidden relative">
        {/* Desktop Left Sidebar: Static Top Card, Scrollable Middle Nav, Static Bottom Box */}
        <aside className="hidden lg:flex w-72 shrink-0 h-full border-r border-[#bcd6fa]/50 bg-white p-4 pb-5 flex-col overflow-hidden">
          {/* Top Static Platform Status Widget (shrink-0, NEVER scrolls) */}
          <div className="shrink-0 mb-3 rounded-2xl border border-signal/25 bg-gradient-to-br from-signal/5 to-canvas p-3.5 shadow-2xs">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-ink font-display">System Health</span>
              <span className="font-display text-sm font-bold text-signal">{ADMIN_TELEMETRY.platformUptimeScore}</span>
            </div>
            <div className="mt-2 h-1.5 w-full rounded-full bg-canvas overflow-hidden border border-[#bcd6fa]/40">
              <div
                className="h-full rounded-full bg-gradient-to-r from-signal to-emerald-400 transition-all duration-500 w-[99.98%]"
              />
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-ink-soft">
              <span>{ADMIN_TELEMETRY.activePodsCount} Live Pods Active</span>
              <span className="font-semibold text-signal">All Nodes Up</span>
            </div>
          </div>

          {/* Middle Nav Items: ONLY THIS CONTAINER SCROLLS with thin scrollbar */}
          <nav className="flex-1 min-h-0 overflow-y-auto space-y-0.5 pr-1 thin-scrollbar">
            {ADMIN_NAV.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
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

          {/* Bottom Static Help & Security Box (shrink-0, NEVER scrolls) */}
          <div className="shrink-0 pt-3 border-t border-[#bcd6fa]/40 mt-3">
            <div className="rounded-2xl border border-[#bcd6fa]/60 bg-canvas/60 p-3 text-xs">
              <div className="font-display font-bold text-ink">Root Access Clearance</div>
              <p className="mt-0.5 text-[11px] text-ink-soft leading-snug">
                Authorized for global RBAC changes and escrow disbursements.
              </p>
              <Link
                href="/admin/audit-logs"
                className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-electric hover:underline whitespace-nowrap"
              >
                <span>View Security Audit Logs →</span>
              </Link>
            </div>

            <div className="mt-2.5 flex items-center justify-between px-1 text-[11px] text-mist font-medium">
              <span>AdminOS v2.4</span>
              <Link href="/login" className="hover:text-ink transition-colors">
                Sign Out
              </Link>
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
              {/* Mobile Static Top Card */}
              <div className="shrink-0 mb-3 rounded-xl border border-signal/25 bg-gradient-to-br from-signal/5 to-canvas p-3">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-ink font-display">System Health</span>
                  <span className="font-display text-sm font-bold text-signal">{ADMIN_TELEMETRY.platformUptimeScore}</span>
                </div>
                <div className="mt-1.5 h-1.5 w-full rounded-full bg-canvas overflow-hidden border border-[#bcd6fa]/40">
                  <div className="h-full rounded-full bg-signal w-[99.98%]" />
                </div>
              </div>

              {/* Mobile Scrollable Middle Nav */}
              <nav className="flex-1 min-h-0 overflow-y-auto space-y-1 pr-1 thin-scrollbar">
                {ADMIN_NAV.map((item) => {
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
                        <span className={active ? "text-electric-bright shrink-0" : "text-mist shrink-0"}>
                          {item.icon}
                        </span>
                        <span className="whitespace-nowrap truncate">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="shrink-0 whitespace-nowrap ml-2 rounded-full bg-electric/10 px-2 py-0.5 text-[10px] font-semibold text-electric">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>

              {/* Mobile Static Bottom Footer */}
              <div className="shrink-0 pt-3 border-t border-[#bcd6fa]/40 mt-3">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between text-xs font-semibold text-ink-soft hover:text-ink"
                >
                  <span>Sign Out</span>
                  <LogOut size={14} />
                </Link>
              </div>
            </aside>
          </>
        )}

        {/* Main Content Area: Scrolls independently with thin scrollbar */}
        <main className="flex-1 min-w-0 h-full overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 thin-scrollbar">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
