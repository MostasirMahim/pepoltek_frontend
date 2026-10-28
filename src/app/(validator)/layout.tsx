"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logoutAction, getCurrentUserAction } from "@/actions/auth.actions";
import {
  ShieldCheck,
  CheckCircle,
  Clock,
  Briefcase,
  Users,
  LogOut,
  ChevronDown,
  Layout,
  Zap,
} from "@/components/ui/Icons";

interface NavItem {
  label: string;
  href: string;
  badge?: string;
  badgeColor?: string;
  icon: React.ReactNode;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const VALIDATOR_NAV_SECTIONS: NavSection[] = [
  {
    title: "Validation & Auditing Desk",
    items: [
      {
        label: "Evaluation Cockpit",
        href: "/validator/dashboard",
        icon: <Layout size={17} />,
      },
      {
        label: "Technical Assessment Queue",
        href: "/validator/dashboard?tab=technical",
        badge: "Tech Vetting",
        badgeColor: "bg-electric/15 text-electric border-electric/30",
        icon: <ShieldCheck size={17} />,
      },
      {
        label: "Healthcare Licensure Desk",
        href: "/validator/dashboard?tab=credentials",
        badge: "Clinical",
        badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
        icon: <CheckCircle size={17} />,
      },
      {
        label: "Scoring & Audit History",
        href: "/validator/dashboard?tab=history",
        icon: <Clock size={17} />,
      },
    ],
  },
  {
    title: "Cross-Desk Workspaces",
    items: [
      {
        label: "Recruiter ATS Pipeline",
        href: "/recruiter/dashboard",
        icon: <Briefcase size={17} />,
      },
      {
        label: "Candidate Talent Pool",
        href: "/recruiter/candidates",
        icon: <Users size={17} />,
      },
      {
        label: "Admin Governance Portal",
        href: "/admin/dashboard",
        icon: <Zap size={17} />,
      },
    ],
  },
];

export default function ValidatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const [validatorUser, setValidatorUser] = useState({
    fullName: "Technical Validator",
    email: "validator@pepoltek.com",
    role: "Technical Validator",
  });

  useEffect(() => {
    async function loadUser() {
      try {
        const u = await getCurrentUserAction();
        if (u) {
          setValidatorUser({
            fullName: u.fullName || "Technical Validator",
            email: u.email || "validator@pepoltek.com",
            role:
              u.role === "CREDENTIAL_OFFICER"
                ? "Credential Officer"
                : "Technical Validator",
          });
        }
      } catch {
        // Fallback gracefully
      }
    }
    loadUser();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logoutAction();
    router.push("/login");
  };

  const avatarInitials =
    validatorUser.fullName
      .trim()
      .split(/\s+/)
      .map((w) => w[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "TV";

  return (
    <div className="h-screen max-h-screen overflow-hidden bg-canvas font-sans text-ink antialiased flex select-none">
      {/* Desktop Static Sidebar (Fixed on Left, Max-H Screen, Never Scrolls Away) */}
      <aside className="hidden lg:flex w-68 shrink-0 h-screen max-h-screen flex-col border-r border-[#bcd6fa] bg-white overflow-hidden z-30">
        <div className="flex h-16 shrink-0 items-center px-5 border-b border-[#bcd6fa]/50">
          <Link href="/validator/dashboard" className="flex items-center gap-2.5 group">
            <Image
              src="/assets/pepoltek/black_logo.png"
              alt="Pepoltek Limited"
              width={124}
              height={28}
              className="h-6 w-auto object-contain transition-transform group-hover:scale-[1.02]"
              priority
            />
            <span className="rounded-full bg-electric/10 px-2 py-0.5 text-[9px] font-mono font-bold text-electric uppercase tracking-wider shrink-0">
              VALIDATOR DESK
            </span>
          </Link>
        </div>

        {/* Navigation Sections */}
        <nav className="flex-1 min-h-0 px-3 py-4 space-y-4 overflow-y-auto thin-scrollbar">
          {VALIDATOR_NAV_SECTIONS.map((section, sIdx) => (
            <div key={section.title || sIdx} className="space-y-1">
              <div className="px-3 pt-1 pb-1 text-[9.5px] font-mono font-bold tracking-wider text-mist uppercase">
                {section.title}
              </div>
              {section.items.map((item) => {
                const itemPath = item.href.split("?")[0];
                const isActive =
                  pathname === item.href ||
                  (itemPath !== "/validator/dashboard" && pathname === itemPath);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-ink text-white shadow-xs font-bold"
                        : "text-ink-soft hover:bg-canvas hover:text-ink"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={isActive ? "text-electric-bright" : "text-mist"}>
                        {item.icon}
                      </span>
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`rounded-full px-2 py-0.5 text-[9.5px] font-mono font-bold shrink-0 ${
                          isActive
                            ? "bg-white/20 text-white"
                            : item.badgeColor || "bg-canvas text-ink-soft border border-[#bcd6fa]/50"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Staff Clearance Notice */}
        <div className="shrink-0 p-4 border-t border-[#bcd6fa]/50 bg-white">
          <div className="rounded-2xl border border-electric/30 bg-electric/5 p-3 text-xs">
            <div className="flex items-center gap-1.5 font-display font-bold text-ink">
              <ShieldCheck className="h-4 w-4 text-signal shrink-0" />
              <span>Assessor Clearance</span>
            </div>
            <p className="mt-1 text-[11px] text-ink-soft leading-relaxed">
              All rubric evaluations and credential updates are cryptographically attributed to your staff audit trail.
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50/50 py-2 text-xs font-semibold text-red-700 hover:bg-red-100 transition-colors cursor-pointer"
          >
            <LogOut size={14} />
            <span>Sign Out Desk</span>
          </button>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <div className="flex-1 min-h-0 flex flex-col h-screen max-h-screen overflow-hidden">
        {/* Top Navbar */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-[#bcd6fa] bg-white px-4 sm:px-8 z-20">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden rounded-lg border border-[#bcd6fa] p-2 text-ink-soft hover:bg-canvas cursor-pointer"
              aria-label="Toggle Navigation"
            >
              <Layout size={18} />
            </button>
            <Link href="/validator/dashboard" className="lg:hidden flex items-center gap-2">
              <Image
                src="/assets/pepoltek/black_logo.png"
                alt="Pepoltek"
                width={110}
                height={26}
                className="h-5.5 w-auto object-contain"
                priority
              />
            </Link>
            <span className="text-xs font-mono font-semibold text-ink-soft hidden sm:inline">
              WORKSPACE / VALIDATOR AUDITING COCKPIT
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/recruiter/dashboard"
              className="hidden sm:inline-flex rounded-xl border border-[#bcd6fa] bg-canvas px-3 py-1.5 text-xs font-semibold text-ink hover:border-electric transition-colors"
            >
              Recruiter Mode
            </Link>
            <Link
              href="/admin/dashboard"
              className="hidden sm:inline-flex rounded-xl border border-[#bcd6fa] bg-canvas px-3 py-1.5 text-xs font-semibold text-ink hover:border-electric transition-colors"
            >
              Admin Mode
            </Link>

            {/* Validator User Avatar & Dropdown */}
            <div className="relative" ref={profileMenuRef}>
              <button
                type="button"
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-2.5 rounded-2xl border border-[#bcd6fa]/60 bg-canvas/50 p-1.5 sm:px-2.5 sm:py-1.5 transition-all hover:bg-canvas hover:border-electric cursor-pointer"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-tr from-electric to-electric-bright text-xs font-bold text-white shadow-xs">
                  {avatarInitials}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-bold text-ink leading-tight truncate max-w-[130px]">
                    {validatorUser.fullName}
                  </div>
                  <div className="font-mono text-[10px] text-electric font-semibold leading-tight">
                    {validatorUser.role}
                  </div>
                </div>
                <ChevronDown size={14} className="text-mist" />
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-[#bcd6fa] bg-white p-3 shadow-xl z-50 animate-in fade-in-0 zoom-in-95 duration-150">
                  <div className="border-b border-[#bcd6fa]/50 pb-2.5 mb-2 px-1">
                    <div className="font-display text-xs font-bold text-ink truncate">
                      {validatorUser.fullName}
                    </div>
                    <div className="text-[11px] text-mist truncate">
                      {validatorUser.email}
                    </div>
                    <div className="mt-1.5 inline-flex items-center gap-1 rounded-md bg-electric/10 px-2 py-0.5 font-mono text-[10px] font-bold text-electric">
                      <ShieldCheck size={11} />
                      {validatorUser.role}
                    </div>
                  </div>

                  <div className="space-y-0.5 text-xs font-medium text-ink-soft">
                    <Link
                      href="/validator/dashboard"
                      onClick={() => setProfileMenuOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 transition-colors hover:bg-canvas hover:text-ink"
                    >
                      <Layout size={15} className="text-mist" />
                      <span>Evaluation Cockpit</span>
                    </Link>
                    <Link
                      href="/recruiter/dashboard"
                      onClick={() => setProfileMenuOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 transition-colors hover:bg-canvas hover:text-ink"
                    >
                      <Briefcase size={15} className="text-mist" />
                      <span>Recruiter Pipeline</span>
                    </Link>
                  </div>

                  <div className="mt-2 pt-2 border-t border-[#bcd6fa]/40">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 cursor-pointer"
                    >
                      <LogOut size={15} />
                      <span>Sign Out Desk</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-[#bcd6fa] bg-white px-4 py-3 space-y-3">
            {VALIDATOR_NAV_SECTIONS.map((section, sIdx) => (
              <div key={section.title || sIdx} className="space-y-1">
                <div className="px-2 pt-1 pb-0.5 text-[9px] font-mono font-bold tracking-wider text-mist uppercase">
                  {section.title}
                </div>
                {section.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold text-ink-soft hover:bg-canvas hover:text-ink"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-mist">{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="rounded-full bg-electric/10 px-2 py-0.5 text-[9px] font-mono font-bold text-electric">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            ))}
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
