"use client";

import { useState } from "react";
import {
  Zap,
  Code2,
  Clock,
  CheckCircle,
  ShieldCheck,
  ArrowRight,
  Award,
} from "@/components/ui/Icons";


import { useCandidatePersona } from "@/context/CandidatePersonaContext";

interface AssessmentItem {
  id: string;
  title: string;
  category: string;
  duration: string;
  status: "Completed" | "Available";
  score: string | null;
  badgeEarned: string;
  date: string;
}

const INITIAL_ASSESSMENTS: AssessmentItem[] = [
  {
    id: "ASM-881",
    title: "Next.js 15 App Router & Server Actions Concurrency",
    category: "Software Tech",
    duration: "45 Mins",
    status: "Available",
    score: null,
    badgeEarned: "App Router Tier 1 Lead",
    date: "Pending Start",
  },
  {
    id: "ASM-742",
    title: "Distributed Systems & Real-time WebSockets",
    category: "Architecture",
    duration: "60 Mins",
    status: "Available",
    score: null,
    badgeEarned: "System Reliability Pro",
    date: "Pending Start",
  },
  {
    id: "ASM-920",
    title: "NHS Healthcare Interoperability & FHIR v4",
    category: "Healthcare IT",
    duration: "35 Mins",
    status: "Available",
    score: null,
    badgeEarned: "NHS Clinical Tech Specialist",
    date: "Pending Start",
  },
  {
    id: "ASM-614",
    title: "HIPAA Security Controls & Patient Data Confidentiality",
    category: "Healthcare Compliance",
    duration: "30 Mins",
    status: "Available",
    score: null,
    badgeEarned: "HIPAA Certified Specialist",
    date: "Pending Start",
  },
];

export function CandidateAssessmentsView() {
  const { currentProfile } = useCandidatePersona();
  const [assessments] = useState<AssessmentItem[]>(INITIAL_ASSESSMENTS);

  const completedCount = assessments.filter((a) => a.status === "Completed").length;
  const isVetted = currentProfile.technicalVettingScore > 0 || completedCount > 0;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-electric/30 bg-gradient-to-r from-ink via-[#0d1f3d] to-ink p-6 sm:p-8 text-white shadow-md">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-signal/40 bg-signal/10 px-3 py-0.5 text-[11px] font-mono text-signal">
              <span className="h-2 w-2 rounded-full bg-signal animate-pulse" />
              <span>OBJECTIVE PROCTOR-FREE EVALUATIONS</span>
            </div>
            <h1 className="mt-2.5 font-display text-2xl sm:text-3xl font-bold tracking-tight">
              Technical &amp; Clinical Assessments
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-gray-300 max-w-2xl leading-relaxed">
              Verify your architectural mastery and clinical safety knowledge. Successful evaluations directly increase your Reverse Search matching score and unlocked hourly rate.
            </p>
          </div>
        </div>

        <div
          className="pointer-events-none absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: "20px 20px",
          }}
        />
      </div>

      {/* Live Assessment Report Summary */}
      <div className="rounded-3xl border border-[#bcd6fa] bg-white p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#bcd6fa]/40 pb-4">
          <div>
            <div className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-mono font-bold ${
              isVetted ? "bg-signal/15 text-signal" : "bg-electric/15 text-electric"
            }`}>
              <ShieldCheck size={13} />
              <span>{isVetted ? "BENCHMARK ASSESSMENT VERIFIED" : "INITIAL ASSESSMENT PENDING"}</span>
            </div>
            <h2 className="font-display text-lg font-bold text-ink mt-1.5">
              Verified Technical Dossier Assessment
            </h2>
            <p className="text-xs text-ink-soft">
              {isVetted
                ? "Evaluation report generated and cryptographically signed by Pepoltek Vetting Panel."
                : "No assessments completed yet. Launch an assessment below to generate your cryptographically signed evaluation report."}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="font-mono text-[10px] text-mist uppercase">Overall Vetting Score</div>
              <div className="font-display text-2xl font-extrabold text-electric">
                {currentProfile.technicalVettingScore > 0 ? `${currentProfile.technicalVettingScore} / 100` : "Pending"}
              </div>
            </div>
          </div>
        </div>

        {/* Breakdown Radar Values */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-[#bcd6fa]/60 bg-canvas/30 p-4">
            <span className="font-mono text-[10px] text-mist uppercase block mb-1">Architecture &amp; Concurrency</span>
            <span className="font-display text-xl font-bold text-ink">
              {currentProfile.technicalVettingScore > 0 ? `${currentProfile.technicalVettingScore}%` : "Pending"}
            </span>
            <span className="text-[11px] text-ink-soft font-medium block mt-1">
              {currentProfile.technicalVettingScore > 0 ? "Tier 1 Squad Ready" : "Awaiting Evaluation"}
            </span>
          </div>

          <div className="rounded-2xl border border-[#bcd6fa]/60 bg-canvas/30 p-4">
            <span className="font-mono text-[10px] text-mist uppercase block mb-1">Code Quality &amp; Clean Patterns</span>
            <span className="font-display text-xl font-bold text-ink">
              {currentProfile.technicalVettingScore > 0 ? `${Math.round(currentProfile.technicalVettingScore * 0.95)}%` : "Pending"}
            </span>
            <span className="text-[11px] text-ink-soft font-medium block mt-1">
              {currentProfile.technicalVettingScore > 0 ? "Validated Quality" : "Awaiting Evaluation"}
            </span>
          </div>

          <div className="rounded-2xl border border-[#bcd6fa]/60 bg-canvas/30 p-4">
            <span className="font-mono text-[10px] text-mist uppercase block mb-1">Security &amp; Regulatory Alignment</span>
            <span className="font-display text-xl font-bold text-ink">
              {currentProfile.technicalVettingScore > 0 ? "100%" : "Pending"}
            </span>
            <span className="text-[11px] text-ink-soft font-medium block mt-1">
              {currentProfile.technicalVettingScore > 0 ? "SOC 2 / HIPAA Ready" : "Awaiting Evaluation"}
            </span>
          </div>
        </div>
      </div>

      {/* Available Assessments List */}
      <div className="space-y-4">
        <h3 className="font-display text-base font-bold text-ink">
          Available &amp; Completed Assessments
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assessments.map((item) => (
            <div
              key={item.id}
              className="rounded-3xl border border-[#bcd6fa] bg-white p-6 shadow-xs hover:border-electric/70 hover:shadow-sm transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="rounded-full border border-[#bcd6fa] bg-canvas px-2.5 py-0.5 font-mono text-[10px] font-semibold text-ink-soft">
                    {item.category}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold ${
                      item.status === "Completed"
                        ? "bg-signal/15 text-signal"
                        : "bg-electric/15 text-electric"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <h4 className="font-display text-base font-bold text-ink leading-snug">
                  {item.title}
                </h4>

                <div className="flex items-center gap-3 font-mono text-xs text-mist">
                  <span className="flex items-center gap-1">
                    <Clock size={13} />
                    <span>{item.duration}</span>
                  </span>
                  <span>•</span>
                  <span>{item.date}</span>
                </div>

                {item.score && (
                  <div className="rounded-xl border border-signal/30 bg-signal/5 p-2.5 text-xs text-ink flex items-center justify-between">
                    <span className="font-mono text-signal font-bold">Score: {item.score}</span>
                    <span className="font-display text-[11px] font-bold text-ink">{item.badgeEarned}</span>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-[#bcd6fa]/30 flex justify-end">
                {item.status === "Completed" ? (
                  <span className="inline-flex items-center gap-1.5 font-mono text-xs text-signal font-semibold">
                    <CheckCircle size={15} />
                    <span>Verified in Dossier</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-electric px-4 py-2 font-display text-xs font-bold text-white hover:bg-electric-bright transition-all shadow-xs cursor-pointer"
                  >
                    <span>Begin Assessment</span>
                    <ArrowRight size={13} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
