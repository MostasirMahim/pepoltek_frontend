"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logoutAction } from "@/actions/auth.actions";
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
  icon: React.ReactNode;
}

const VALIDATOR_NAV: NavItem[] = [
  {
    label: "Evaluation Cockpit",
    href: "/validator/dashboard",
    icon: <Layout size={18} />,
  },
  {
    label: "Recruiter Pipeline",
    href: "/recruiter/dashboard",
    icon: <Briefcase size={18} />,
  },
  {
    label: "Admin Portal",
    href: "/admin/dashboard",
    icon: <ShieldCheck size={18} />,
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

  const handleLogout = async () => {
    await logoutAction();
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen bg-canvas font-sans text-ink antialiased">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-[#bcd6fa] bg-white shrink-0">
        <div className="flex h-16 items-center px-6 border-b border-[#bcd6fa]/50">
          <Link href="/validator/dashboard" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-ink text-white font-bold text-sm shadow-xs">
              P
            </div>
            <div>
              <span className="font-display text-sm font-extrabold tracking-tight text-ink">PEPOLTEK</span>
              <span className="block font-mono text-[9px] font-bold text-electric uppercase tracking-widest">
                Validator Desk
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-5 space-y-1">
          {VALIDATOR_NAV.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-ink text-white shadow-xs font-bold"
                    : "text-ink-soft hover:bg-canvas hover:text-ink"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? "text-white" : "text-mist"}>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="rounded-full bg-electric/15 px-2 py-0.5 text-[10px] font-mono font-bold text-electric">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Staff Clearance Notice */}
        <div className="p-4 border-t border-[#bcd6fa]/50">
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
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="flex h-16 items-center justify-between border-b border-[#bcd6fa] bg-white px-4 sm:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden rounded-lg border border-[#bcd6fa] p-2 text-ink-soft hover:bg-canvas"
            >
              <Layout size={18} />
            </button>
            <span className="text-xs font-mono font-semibold text-ink-soft hidden sm:inline">
              WORKSPACE / VALIDATOR AUDITING COCKPIT
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/recruiter/dashboard"
              className="rounded-xl border border-[#bcd6fa] bg-canvas px-3 py-1.5 text-xs font-semibold text-ink hover:border-electric transition-colors"
            >
              Recruiter Mode
            </Link>
            <Link
              href="/admin/dashboard"
              className="rounded-xl border border-[#bcd6fa] bg-canvas px-3 py-1.5 text-xs font-semibold text-ink hover:border-electric transition-colors"
            >
              Admin Mode
            </Link>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-[#bcd6fa] bg-white px-4 py-3 space-y-1">
            {VALIDATOR_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold text-ink-soft hover:bg-canvas hover:text-ink"
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
