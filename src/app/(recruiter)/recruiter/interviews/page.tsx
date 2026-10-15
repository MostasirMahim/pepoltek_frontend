"use client";

import { useState } from "react";

const INTERVIEW_SCHEDULE = [
  {
    id: "INT-102",
    candidate: "Alex Morgan",
    role: "Lead React & TypeScript Architect",
    pod: "FinTech Ledger Pod",
    time: "Today, 3:30 PM BST",
    type: "Pod Technical Sprint Review",
    panel: "Marcus Vance (Pod Lead), Elena Rostova (Hiring VP)",
    status: "Upcoming",
  },
  {
    id: "INT-103",
    candidate: "Dr. Rachel Higgins",
    role: "Clinical ICU Specialist",
    pod: "CarePulse NHS Trust",
    time: "Tomorrow, 11:00 AM BST",
    type: "Clinical Governance & Compliance Check",
    panel: "Dr. Ethan Wright (Medical Director)",
    status: "Confirmed",
  },
  {
    id: "INT-104",
    candidate: "Carlos Mendez",
    role: "Cloud Platform SRE",
    pod: "AeroTech Kubernetes Pod",
    time: "Oct 4, 2:00 PM BST",
    type: "Terraform & EKS Live Architecture Pitch",
    panel: "Devon Reed (DevOps Lead)",
    status: "Scheduled",
  },
];

export default function RecruiterInterviewsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Sprint Technical Interviews</h1>
          <p className="text-xs sm:text-sm text-ink-soft">
            Live technical evaluations, clinical rota assessments, and client pod pitch sessions.
          </p>
        </div>
        <button className="rounded-xl bg-ink px-4 py-2 font-display text-xs font-semibold text-white hover:bg-electric transition-colors shadow-xs">
          + Schedule Sprint Interview
        </button>
      </div>

      <div className="space-y-4">
        {INTERVIEW_SCHEDULE.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-[#bcd6fa] bg-white p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-electric transition-all"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-electric">{item.id}</span>
                <span className="rounded-full bg-signal/10 px-2.5 py-0.5 font-mono text-[10px] font-bold text-signal">
                  {item.status}
                </span>
                <span className="font-mono text-xs text-ink font-semibold">{item.time}</span>
              </div>
              <h2 className="font-display text-base font-bold text-ink">{item.candidate}</h2>
              <p className="text-xs text-ink-soft">
                Role: <strong className="text-ink">{item.role}</strong> • Target: <span className="text-electric font-semibold">{item.pod}</span>
              </p>
              <div className="text-[11px] font-mono text-mist">
                Type: {item.type} | Panel: {item.panel}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="rounded-xl border border-[#bcd6fa] bg-canvas/30 px-3.5 py-2 font-display text-xs font-semibold text-ink hover:bg-canvas">
                Review Scorecard
              </button>
              <button className="rounded-xl bg-electric px-4 py-2 font-display text-xs font-semibold text-white hover:bg-electric-bright shadow-xs">
                Launch Pod Room →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
