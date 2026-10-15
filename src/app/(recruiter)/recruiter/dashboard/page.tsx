"use client";

import { useState } from "react";
import Link from "next/link";

const ACTIVE_PODS = [
  {
    id: "POD-842",
    name: "Full-Stack High-Frequency Web3 Pod",
    lead: "Alex Morgan",
    size: "4 Engineers",
    stage: "Sprint 3 in Progress",
    velocity: "100% On-Track",
    weeklySpend: "$14,200",
    burnRate: "Normal",
  },
  {
    id: "POD-719",
    name: "CarePulse Emergency ICU Specialist Rota",
    lead: "Dr. Rachel Higgins",
    size: "6 Specialists",
    stage: "Compliance Cleared",
    velocity: "Live Deployed",
    weeklySpend: "£18,500",
    burnRate: "Optimal",
  },
  {
    id: "POD-904",
    name: "Cloud Native Kubernetes Migration Pod",
    lead: "Devon Reed",
    size: "3 Platform Devs",
    stage: "Architecture Validation",
    velocity: "98% Velocity",
    weeklySpend: "$9,800",
    burnRate: "Normal",
  },
];

const RECENT_SHORTLISTS = [
  {
    name: "David Kim",
    role: "Senior Distributed Backend Engineer",
    skills: ["Go", "Kafka", "Kubernetes", "gRPC"],
    match: "99%",
    status: "Technical Sprint Passed",
    action: "Schedule Pod Presentation",
  },
  {
    name: "Sarah Lindqvist",
    role: "Clinical ICU Specialist Nurse",
    skills: ["NHS Band 7", "NMC Registered", "DBS Enhanced"],
    match: "98%",
    status: "Compliance Verified",
    action: "Add to Hospital Rota",
  },
  {
    name: "Tariq Mansour",
    role: "Principal React / Next.js Architect",
    skills: ["Next.js 15", "TypeScript", "Performance"],
    match: "97%",
    status: "Code Benchmark 99%",
    action: "Assign to Web Pod",
  },
];

export default function RecruiterDashboardPage() {
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-[#bcd6fa] bg-white p-6 sm:p-8 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-electric/30 bg-electric/10 px-3 py-0.5 text-[11px] font-mono font-semibold text-electric uppercase tracking-widest">
            <span>Enterprise Talent Ops</span>
          </div>
          <h1 className="mt-2 font-display text-2xl sm:text-3xl font-bold tracking-tight text-ink">
            Recruiter Cockpit & Pod Deployment Hub
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-ink-soft">
            Manage your engineering pods and healthcare specialists with zero operational overhead and guaranteed 7-day velocity.
          </p>
        </div>

        <div className="flex shrink-0 gap-2.5">
          <Link
            href="/recruiter/pods"
            className="rounded-xl bg-ink px-4 py-2.5 font-display text-xs font-semibold text-white shadow-xs hover:bg-electric transition-colors"
          >
            Assemble New Pod
          </Link>
          <Link
            href="/recruiter/candidates"
            className="rounded-xl border border-[#bcd6fa] bg-canvas/40 px-4 py-2.5 font-display text-xs font-semibold text-ink hover:bg-white transition-colors"
          >
            Search Talent Pool
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-2xl border border-[#bcd6fa] bg-white p-5 shadow-xs">
          <div className="font-mono text-xs text-mist uppercase tracking-wider">Active Deployed Pods</div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-display text-3xl font-bold text-ink">4</span>
            <span className="text-xs font-semibold text-signal">+1 this sprint</span>
          </div>
          <div className="mt-2 text-[11px] text-ink-soft">13 Specialists Deployed</div>
        </div>

        <div className="rounded-2xl border border-[#bcd6fa] bg-white p-5 shadow-xs">
          <div className="font-mono text-xs text-mist uppercase tracking-wider">Avg Deployment Time</div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-display text-3xl font-bold text-electric">6.8</span>
            <span className="text-xs font-mono text-mist">Days</span>
          </div>
          <div className="mt-2 text-[11px] text-signal font-semibold">Under 7-Day SLA Guarantee</div>
        </div>

        <div className="rounded-2xl border border-[#bcd6fa] bg-white p-5 shadow-xs">
          <div className="font-mono text-xs text-mist uppercase tracking-wider">Compliance Pass Rate</div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-display text-3xl font-bold text-signal">100%</span>
          </div>
          <div className="mt-2 text-[11px] text-ink-soft">Zero compliance delays</div>
        </div>

        <div className="rounded-2xl border border-[#bcd6fa] bg-white p-5 shadow-xs">
          <div className="font-mono text-xs text-mist uppercase tracking-wider">Reclaimed Hiring Time</div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-display text-3xl font-bold text-ink">44.5</span>
            <span className="text-xs font-mono text-mist">Hrs / Hire</span>
          </div>
          <div className="mt-2 text-[11px] text-ink-soft">Pre-vetted pod efficiency</div>
        </div>
      </div>

      {/* Active Pods Table & Pipeline */}
      <div className="rounded-2xl border border-[#bcd6fa] bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-bold text-ink">Active Pod Deployments</h2>
            <p className="text-xs text-ink-soft">Real-time sprint progress, pod size, and delivery telemetry.</p>
          </div>
          <Link
            href="/recruiter/pods"
            className="font-mono text-xs font-semibold text-electric hover:underline"
          >
            Manage All Pods →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#bcd6fa]/50 font-mono text-mist uppercase text-[11px]">
                <th className="pb-3 font-semibold">Pod Details</th>
                <th className="pb-3 font-semibold">Pod Lead</th>
                <th className="pb-3 font-semibold">Specialists</th>
                <th className="pb-3 font-semibold">Status & Stage</th>
                <th className="pb-3 font-semibold">Sprint Velocity</th>
                <th className="pb-3 font-semibold text-right">Weekly Burn</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#bcd6fa]/30">
              {ACTIVE_PODS.map((pod) => (
                <tr key={pod.id} className="hover:bg-canvas/40 transition-colors">
                  <td className="py-3.5 pr-3">
                    <div className="font-mono text-[10px] font-bold text-electric">{pod.id}</div>
                    <div className="font-display text-sm font-bold text-ink">{pod.name}</div>
                  </td>
                  <td className="py-3.5 font-medium text-ink">{pod.lead}</td>
                  <td className="py-3.5 font-mono text-ink-soft">{pod.size}</td>
                  <td className="py-3.5">
                    <span className="rounded-full bg-signal/10 px-2.5 py-1 font-mono text-[10px] font-bold text-signal">
                      {pod.stage}
                    </span>
                  </td>
                  <td className="py-3.5 font-mono font-semibold text-electric">{pod.velocity}</td>
                  <td className="py-3.5 font-mono text-right font-bold text-ink">{pod.weeklySpend}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Shortlisted Candidates Ready for Pod Assignment */}
      <div className="rounded-2xl border border-[#bcd6fa] bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-bold text-ink">Ready-to-Deploy Talent Shortlist</h2>
            <p className="text-xs text-ink-soft">Pre-screened and benchmark-tested candidates matching your active requisitions.</p>
          </div>
          <Link
            href="/recruiter/candidates"
            className="font-mono text-xs font-semibold text-electric hover:underline"
          >
            Explore Full Pool →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {RECENT_SHORTLISTS.map((cand, i) => (
            <div
              key={i}
              className="rounded-xl border border-[#bcd6fa] bg-canvas/30 p-4 space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-display font-bold text-ink">{cand.name}</span>
                  <span className="rounded-md bg-signal/10 px-2 py-0.5 font-mono text-[10px] font-bold text-signal">
                    Match {cand.match}
                  </span>
                </div>
                <p className="text-xs text-ink-soft mt-0.5">{cand.role}</p>

                <div className="mt-3 flex flex-wrap gap-1">
                  {cand.skills.map((s) => (
                    <span
                      key={s}
                      className="rounded-md bg-white border border-[#bcd6fa]/50 px-2 py-0.5 text-[10px] font-mono text-ink-soft"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-[#bcd6fa]/30">
                <div className="font-mono text-[10px] text-mist mb-2">Status: {cand.status}</div>
                <button className="w-full rounded-lg bg-ink py-1.5 font-display text-[11px] font-semibold text-white hover:bg-electric transition-colors cursor-pointer shadow-xs">
                  {cand.action} →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
