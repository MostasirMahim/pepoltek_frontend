"use client";

import React from "react";
import Link from "next/link";
import {
  Activity,
  Users,
  Briefcase,
  ShieldCheck,
  CheckCircle,
  DollarSign,
  Zap,
} from "@/components/ui/Icons";
import {
  ADMIN_TELEMETRY,
  RECENT_PLATFORM_EVENTS,
  ADMIN_PODS,
} from "@/data/adminDashboardData";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Top Welcome & Mission Control Banner */}
      <div className="rounded-3xl border border-[#bcd6fa] bg-gradient-to-br from-white via-canvas to-white p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-electric/30 bg-electric/10 px-3 py-0.5 text-xs font-semibold text-electric">
              <span className="h-2 w-2 rounded-full bg-signal animate-pulse" />
              <span>PEPOLTEK GLOBAL PLATFORM MISSION CONTROL</span>
            </div>
            <h1 className="mt-2.5 font-display text-2xl sm:text-3xl font-bold tracking-tight text-ink">
              Executive Platform Command
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-ink-soft">
              Real-time oversight across candidate vetting pipelines, recruiter requisitions, active pod SLAs, and compliance escrow balances.
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap gap-2.5">
            <Link
              href="/admin/users"
              className="rounded-xl bg-ink px-4 py-2.5 font-display text-xs font-semibold text-white shadow-xs hover:bg-electric transition-colors"
            >
              User & Role RBAC
            </Link>
            <Link
              href="/admin/pods-management"
              className="rounded-xl border border-[#bcd6fa] bg-white px-4 py-2.5 font-display text-xs font-semibold text-ink-soft hover:text-ink hover:border-electric transition-colors"
            >
              Global Pod Registry
            </Link>
          </div>
        </div>
      </div>

      {/* Global Platform KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Gross Volume */}
        <div className="rounded-2xl border border-[#bcd6fa] bg-white p-5 shadow-xs flex flex-col justify-between hover:border-electric/40 transition-colors">
          <div className="flex items-start justify-between gap-2">
            <span className="text-[11px] font-semibold text-mist uppercase tracking-wider">
              Gross Platform Volume
            </span>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-electric/10 text-electric border border-electric/20 shadow-2xs">
              <DollarSign size={18} />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight">
              {ADMIN_TELEMETRY.grossPlatformVolume}
            </div>
            <div className="mt-1 text-[11px] text-signal font-semibold">
              {ADMIN_TELEMETRY.grossVolumeGrowth}
            </div>
          </div>
        </div>

        {/* Active Pods */}
        <div className="rounded-2xl border border-[#bcd6fa] bg-white p-5 shadow-xs flex flex-col justify-between hover:border-electric/40 transition-colors">
          <div className="flex items-start justify-between gap-2">
            <span className="text-[11px] font-semibold text-mist uppercase tracking-wider">
              Active Deployed Pods
            </span>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-signal/10 text-signal border border-signal/20 shadow-2xs">
              <Briefcase size={18} />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="font-display text-2xl sm:text-3xl font-bold text-electric tracking-tight">
              {ADMIN_TELEMETRY.activePodsCount} <span className="text-base font-normal text-mist">Pods</span>
            </div>
            <div className="mt-1 text-[11px] text-signal font-semibold">
              {ADMIN_TELEMETRY.activePodsCapacity}
            </div>
          </div>
        </div>

        {/* Vetted Talent Network */}
        <div className="rounded-2xl border border-[#bcd6fa] bg-white p-5 shadow-xs flex flex-col justify-between hover:border-electric/40 transition-colors">
          <div className="flex items-start justify-between gap-2">
            <span className="text-[11px] font-semibold text-mist uppercase tracking-wider">
              Vetted Talent Network
            </span>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-electric/10 text-electric border border-electric/20 shadow-2xs">
              <Users size={18} />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight">
              {ADMIN_TELEMETRY.vettedTalentCount}
            </div>
            <div className="mt-1 text-[11px] text-ink-soft font-medium">
              {ADMIN_TELEMETRY.vettedTalentGrowth}
            </div>
          </div>
        </div>

        {/* Escrow Vault Balance */}
        <div className="rounded-2xl border border-[#bcd6fa] bg-white p-5 shadow-xs flex flex-col justify-between hover:border-electric/40 transition-colors">
          <div className="flex items-start justify-between gap-2">
            <span className="text-[11px] font-semibold text-mist uppercase tracking-wider">
              Escrow Vault Funds
            </span>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-signal/10 text-signal border border-signal/20 shadow-2xs">
              <ShieldCheck size={18} />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight">
              {ADMIN_TELEMETRY.escrowVaultBalance}
            </div>
            <div className="mt-1 text-[11px] text-signal font-semibold">
              100% Protected Escrow
            </div>
          </div>
        </div>
      </div>

      {/* Main Split: Sector Distribution & Live Event Feed */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
        {/* Left 8 Cols: Sector Balance & Pod Health */}
        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-2xl border border-[#bcd6fa] bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-base font-bold text-ink">Sector Allocation & Active Sprints</h2>
                <p className="text-xs text-ink-soft">Dual-sector distribution across software engineering and clinical healthcare.</p>
              </div>
              <span className="rounded-full bg-electric/10 px-3 py-0.5 text-xs font-semibold text-electric">
                {ADMIN_TELEMETRY.activePodsCount} Total Pods
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="rounded-xl border border-[#bcd6fa]/60 bg-canvas/40 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-display text-sm font-bold text-ink">Enterprise Software Tech</span>
                  <span className="text-xs font-bold text-electric">58%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-canvas border border-[#bcd6fa]/40 overflow-hidden">
                  <div className="h-full rounded-full bg-electric w-[58%]" />
                </div>
                <div className="flex items-center justify-between text-[11px] text-ink-soft pt-1 font-medium">
                  <span>28 Active Pods</span>
                  <span>Avg Latency: 48 Hours</span>
                </div>
              </div>

              <div className="rounded-xl border border-[#bcd6fa]/60 bg-canvas/40 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-display text-sm font-bold text-ink">Healthcare & Clinical Rotas</span>
                  <span className="text-xs font-bold text-signal">42%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-canvas border border-[#bcd6fa]/40 overflow-hidden">
                  <div className="h-full rounded-full bg-signal w-[42%]" />
                </div>
                <div className="flex items-center justify-between text-[11px] text-ink-soft pt-1 font-medium">
                  <span>20 Active Pods</span>
                  <span>100% GMC & DBS Verified</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Active Pods Snapshot */}
          <div className="rounded-2xl border border-[#bcd6fa] bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-base font-bold text-ink">Live Sprint Pods In Flight</h3>
                <p className="text-xs text-ink-soft">Recent high-priority pod allocations and delivery metrics.</p>
              </div>
              <Link
                href="/admin/pods-management"
                className="text-xs font-semibold text-electric hover:underline"
              >
                View All Pods →
              </Link>
            </div>

            <div className="divide-y divide-[#bcd6fa]/40">
              {ADMIN_PODS.slice(0, 3).map((pod) => (
                <div key={pod.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-electric">{pod.id}</span>
                      <span className="text-xs font-bold text-ink">{pod.podName}</span>
                      <span className="rounded-full bg-signal/10 px-2 py-0.5 text-[10px] font-semibold text-signal">
                        {pod.slaScore} SLA
                      </span>
                    </div>
                    <div className="text-xs text-ink-soft mt-0.5">
                      Client: <span className="font-medium text-ink">{pod.clientName}</span> • Lead: {pod.podLeadName}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-ink">{pod.hourlyRate}</span>
                    <span className="rounded-lg bg-canvas px-2.5 py-1 text-xs font-semibold text-ink-soft border border-[#bcd6fa]/60">
                      {pod.stage}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Live Platform Activity Stream & Audit Alerts */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-2xl border border-[#bcd6fa] bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-sm font-bold text-ink">Live Telemetry Events</h3>
              <span className="h-2 w-2 rounded-full bg-signal animate-ping" />
            </div>

            <div className="space-y-3">
              {RECENT_PLATFORM_EVENTS.map((event) => (
                <div key={event.id} className="rounded-xl border border-[#bcd6fa]/50 bg-canvas/40 p-3.5 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-electric">{event.tag}</span>
                    <span className="text-mist">{event.timeAgo}</span>
                  </div>
                  <p className="text-xs text-ink leading-snug">{event.summary}</p>
                  <div className="text-[10.5px] text-ink-soft">
                    Triggered by: <span className="font-medium text-ink">{event.actor}</span>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/admin/audit-logs"
              className="mt-2 block w-full text-center rounded-xl border border-[#bcd6fa] bg-white py-2 text-xs font-semibold text-ink-soft hover:text-ink hover:border-electric transition-colors"
            >
              Open Immutable Audit Logs
            </Link>
          </div>

          {/* Quick System Action Grid */}
          <div className="rounded-2xl border border-[#bcd6fa] bg-gradient-to-br from-electric/5 to-white p-5 shadow-xs space-y-3">
            <h4 className="font-display text-xs font-bold text-ink">Administrative Quick Actions</h4>
            <div className="space-y-2">
              <Link
                href="/admin/users"
                className="flex items-center justify-between rounded-xl bg-white border border-[#bcd6fa]/60 px-3 py-2 text-xs font-medium text-ink hover:border-electric transition-colors"
              >
                <span>Provision Internal Recruiter</span>
                <span className="text-electric font-bold">+</span>
              </Link>
              <Link
                href="/admin/finance"
                className="flex items-center justify-between rounded-xl bg-white border border-[#bcd6fa]/60 px-3 py-2 text-xs font-medium text-ink hover:border-electric transition-colors"
              >
                <span>Release Sprint Milestone Escrow</span>
                <span className="text-electric font-bold">→</span>
              </Link>
              <Link
                href="/admin/compliance"
                className="flex items-center justify-between rounded-xl bg-white border border-[#bcd6fa]/60 px-3 py-2 text-xs font-medium text-ink hover:border-electric transition-colors"
              >
                <span>Export SOC 2 Audit Vault</span>
                <span className="text-electric font-bold">↓</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
