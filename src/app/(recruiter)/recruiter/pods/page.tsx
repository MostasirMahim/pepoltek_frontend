"use client";

import { useState } from "react";

const PODS_LIST = [
  {
    id: "POD-842",
    name: "Web3 High-Frequency Ledger Pod",
    type: "Software Tech",
    lead: "Alex Morgan (Lead Architect)",
    members: ["Sarah Chen (Frontend)", "David Kim (Backend Go)", "Priya Patel (QA Automation)"],
    status: "Active Sprint",
    sprintProgress: "75%",
    deploymentDate: "Sep 15, 2026",
    weeklyBudget: "$14,200",
  },
  {
    id: "POD-719",
    name: "CarePulse Emergency ICU Specialist Rota",
    type: "Healthcare",
    lead: "Dr. Rachel Higgins (Clinical Lead)",
    members: ["Nurse S. Lindqvist", "Nurse J. Thompson", "Dr. A. Miller", "Paramedic K. Rowe"],
    status: "Deployed On-Site",
    sprintProgress: "100%",
    deploymentDate: "Sep 01, 2026",
    weeklyBudget: "£18,500",
  },
  {
    id: "POD-904",
    name: "Cloud Native Kubernetes Migration Pod",
    type: "Software Tech",
    lead: "Devon Reed (DevOps Lead)",
    members: ["Carlos Mendez (Terraform)", "Lin Zhao (Site Reliability)"],
    status: "Sprint Assembly",
    sprintProgress: "40%",
    deploymentDate: "Deploying Oct 5, 2026",
    weeklyBudget: "$9,800",
  },
  {
    id: "POD-611",
    name: "AI Patient Triage Pipeline Pod",
    type: "Dual Sector",
    lead: "Dr. Ethan Wright",
    members: ["Vikram Singh (ML Engineer)", "Elena Gomez (Clinical Data)"],
    status: "Client Review",
    sprintProgress: "90%",
    deploymentDate: "Deploying Oct 8, 2026",
    weeklyBudget: "$16,000",
  },
];

export default function RecruiterPodsPage() {
  const [showBuilder, setShowBuilder] = useState(false);
  const [filterType, setFilterType] = useState("all");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Enterprise Pod Management</h1>
          <p className="text-xs sm:text-sm text-ink-soft">
            Configure custom software engineering pods or compliance-ready clinical rotas with 7-day deployment sprints.
          </p>
        </div>

        <button
          onClick={() => setShowBuilder(!showBuilder)}
          className="rounded-xl bg-ink px-4 py-2 font-display text-xs font-semibold text-white shadow-xs hover:bg-electric transition-all cursor-pointer"
        >
          {showBuilder ? "Close Pod Builder" : "+ Assemble New Pod"}
        </button>
      </div>

      {/* Pod Builder Interactive Drawer / Preview */}
      {showBuilder && (
        <div className="rounded-2xl border border-electric/40 bg-gradient-to-br from-white to-canvas p-6 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-electric text-white text-xs font-bold">
                ⚙
              </span>
              <h2 className="font-display text-base font-bold text-ink">Assemble Custom Delivery Pod</h2>
            </div>
            <span className="font-mono text-xs text-electric font-semibold">SLA: 7 Days to Deployment</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-mono text-[11px] uppercase tracking-wider text-mist mb-1">Pod Sector</label>
              <select className="w-full rounded-xl border border-[#bcd6fa] bg-white p-2.5 font-medium text-ink focus:border-electric">
                <option>Enterprise Software Engineering</option>
                <option>NHS & Private Healthcare Specialist</option>
                <option>Dual Sector / HealthTech AI</option>
              </select>
            </div>
            <div>
              <label className="block font-mono text-[11px] uppercase tracking-wider text-mist mb-1">Pod Composition</label>
              <select className="w-full rounded-xl border border-[#bcd6fa] bg-white p-2.5 font-medium text-ink focus:border-electric">
                <option>1 Lead Architect + 2 Senior Devs + 1 QA</option>
                <option>2 Senior DevOps / SRE + 1 Cloud Architect</option>
                <option>1 Clinical Lead + 4 ICU Band 7 Nurses</option>
              </select>
            </div>
            <div>
              <label className="block font-mono text-[11px] uppercase tracking-wider text-mist mb-1">Sprint Timeline</label>
              <select className="w-full rounded-xl border border-[#bcd6fa] bg-white p-2.5 font-medium text-ink focus:border-electric">
                <option>7-Day Sprint Kickoff (Standard)</option>
                <option>48-Hour Emergency Surge Rota</option>
                <option>30-Day Managed Pod Pilot</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setShowBuilder(false)}
              className="rounded-xl border border-[#bcd6fa] bg-white px-3.5 py-1.5 font-display text-xs font-semibold text-ink hover:bg-canvas"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                alert("Pod configuration submitted for pre-vetting allocation!");
                setShowBuilder(false);
              }}
              className="rounded-xl bg-electric px-4 py-1.5 font-display text-xs font-semibold text-white hover:bg-electric-bright shadow-xs"
            >
              Confirm & Request Pod Allocation →
            </button>
          </div>
        </div>
      )}

      {/* Pod Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PODS_LIST.map((pod) => (
          <div
            key={pod.id}
            className="rounded-2xl border border-[#bcd6fa] bg-white p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-electric transition-all"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-electric">{pod.id}</span>
                <span className="rounded-full bg-signal/10 px-2.5 py-0.5 font-mono text-[10px] font-bold text-signal">
                  {pod.status}
                </span>
              </div>

              <h3 className="mt-2 font-display text-base font-bold text-ink">{pod.name}</h3>
              <p className="text-xs text-ink-soft mt-0.5">
                Lead: <strong className="text-ink">{pod.lead}</strong>
              </p>

              {/* Members */}
              <div className="mt-3 space-y-1 rounded-xl border border-[#bcd6fa]/40 bg-canvas/30 p-3 text-xs">
                <div className="font-mono text-[10px] uppercase tracking-wider text-mist">Assigned Specialists:</div>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {pod.members.map((m) => (
                    <span
                      key={m}
                      className="rounded-md bg-white border border-[#bcd6fa]/50 px-2 py-0.5 text-[11px] font-medium text-ink"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-[#bcd6fa]/30 pt-3 flex items-center justify-between text-xs">
              <div>
                <span className="font-mono text-mist text-[10px]">Weekly Escrow: </span>
                <strong className="font-mono font-bold text-ink">{pod.weeklyBudget}</strong>
              </div>

              <div className="flex items-center gap-2">
                <button className="rounded-xl border border-[#bcd6fa] bg-canvas/30 px-3 py-1 font-display text-xs font-semibold text-ink hover:bg-canvas">
                  Pod Telemetry
                </button>
                <button className="rounded-xl bg-ink px-3 py-1 font-display text-xs font-semibold text-white hover:bg-electric shadow-xs">
                  Sprint Chat
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
