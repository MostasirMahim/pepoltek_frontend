"use client";

import Link from "next/link";
import { Briefcase, Users, ShieldCheck, Clock, ArrowRight, Zap } from "@/components/ui/Icons";

export function ClientDashboardView() {
  return (
    <div className="space-y-8">
      {/* Top Banner - Responsive Mobile & Desktop */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-electric/30 bg-gradient-to-r from-ink via-[#0d1f3d] to-ink p-4 sm:p-6 lg:p-7 text-white shadow-md">
        <div className="relative z-10 flex flex-col justify-between gap-3 sm:gap-5 md:flex-row md:items-center">
          <div>
            <div className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-electric/40 bg-electric/20 px-2.5 py-0.5 text-[9.5px] sm:text-[11px] font-mono text-electric-bright">
              <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-signal animate-pulse" />
              <span>ENTERPRISE CLIENT WORKSPACE</span>
            </div>
            <h1 className="mt-1.5 sm:mt-2.5 font-display text-lg sm:text-2xl lg:text-3xl font-extrabold tracking-tight">
              Enterprise Requisitions &amp; Workforce Cockpit
            </h1>
            <p className="mt-1 text-[11.5px] sm:text-xs md:text-sm text-gray-300 max-w-xl leading-normal sm:leading-relaxed line-clamp-2 sm:line-clamp-none">
              Autonomous engineering teams and clinical staffing squads deployed to your enterprise with guaranteed timezone overlap and weekly SLA billing.
            </p>
          </div>

          <div className="flex shrink-0 w-full sm:w-auto">
            <Link
              href="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg sm:rounded-xl bg-signal px-3.5 py-2 sm:px-5 sm:py-3 font-display text-xs font-bold text-ink hover:bg-emerald-400 active:scale-95 transition-all shadow-xs text-center"
            >
              Request New Requisition
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-[#bcd6fa] bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-ink-soft">Active Enterprise Teams</span>
            <Briefcase className="h-4 w-4 text-electric" />
          </div>
          <div className="mt-2 text-2xl font-bold text-ink">2 Teams</div>
          <p className="mt-1 text-[11px] text-ink-soft">1 Tech Team + 1 Healthcare Squad</p>
        </div>

        <div className="rounded-2xl border border-[#bcd6fa] bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-ink-soft">Deployed Specialists</span>
            <Users className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-600">8 Specialists</div>
          <p className="mt-1 text-[11px] text-ink-soft">100% SLA uptime and sprint delivery</p>
        </div>

        <div className="rounded-2xl border border-[#bcd6fa] bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-ink-soft">Weekly Spend Escrow</span>
            <Clock className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-ink">$24,000 / wk</div>
          <p className="mt-1 text-[11px] text-ink-soft">Settled bi-weekly via Stripe corporate ACH</p>
        </div>
      </div>

      {/* Requisitions Summary Card */}
      <div className="rounded-2xl border border-[#bcd6fa] bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display text-base font-bold text-ink">Active Contracted Teams</h2>
            <p className="text-xs text-ink-soft">Live teams deployed in your production repos and clinical rotas</p>
          </div>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
            All SLAs Optimal
          </span>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-[#bcd6fa] bg-canvas p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-electric">REQ-842</span>
                <span className="font-display text-sm font-bold text-ink">
                  Full-Stack High-Frequency Web3 Team
                </span>
              </div>
              <p className="mt-1 text-xs text-ink-soft">
                Lead: Alex Morgan | 4 Engineers | Next.js 15, Go, Kafka, Kubernetes
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold text-ink">$14,200/wk</span>
              <span className="rounded-lg bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-800">
                Live Sprinting
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-[#bcd6fa] bg-canvas p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-emerald-600">REQ-719</span>
                <span className="font-display text-sm font-bold text-ink">
                  CarePulse Emergency ICU Specialist Rota
                </span>
              </div>
              <p className="mt-1 text-xs text-ink-soft">
                Lead: Dr. Rachel Higgins | 6 Specialists | Acute NHS Band 8 Clinical Triage
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold text-ink">£18,500/wk</span>
              <span className="rounded-lg bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-800">
                Live On-Site
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
