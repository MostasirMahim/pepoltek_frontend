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
import {
  TALENT_ASSESSMENT_REPORT,
  AssessmentReport,
} from "@/data/talentDashboardData";

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
    status: "Completed",
    score: "98%",
    badgeEarned: "App Router Tier 1 Lead",
    date: "Completed Aug 2026",
  },
  {
    id: "ASM-742",
    title: "Distributed Systems & Real-time WebSockets",
    category: "Architecture",
    duration: "60 Mins",
    status: "Completed",
    score: "96%",
    badgeEarned: "System Reliability Pro",
    date: "Completed Aug 2026",
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
    id: "ASM-955",
    title: "Cloud Native Kubernetes Pod Scaling & Zero-Trust",
    category: "DevOps",
    duration: "50 Mins",
    status: "Available",
    score: null,
    badgeEarned: "K8s Pod Lead Certified",
    date: "Pending Start",
  },
];

export default function CandidateAssessmentsPage() {
  const [assessments, setAssessments] = useState<AssessmentItem[]>(INITIAL_ASSESSMENTS);
  const [report] = useState<AssessmentReport>(TALENT_ASSESSMENT_REPORT);
  const [launchedId, setLaunchedId] = useState<string | null>(null);

  const handleLaunch = (id: string) => {
    setLaunchedId(id);
    setTimeout(() => {
      setAssessments((prev) =>
        prev.map((a) =>
          a.id === id
            ? {
                ...a,
                status: "Completed",
                score: "95%",
                date: "Completed Just now",
              }
            : a
        )
      );
      setLaunchedId(null);
    }, 1200);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-electric/30 bg-electric/10 px-3 py-0.5 text-[11px] font-mono font-semibold text-electric uppercase tracking-widest">
            <span>Hard-Coded Technical Vetting</span>
          </div>
          <h1 className="mt-2 font-display text-2xl sm:text-3xl font-bold tracking-tight text-ink">
            Benchmark Assessments and Scorecards
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-ink-soft max-w-2xl">
            Automated code audits, architecture challenges, and system design evaluations verified by Pepoltek Pod Leads.
          </p>
        </div>
        <div className="rounded-2xl border border-electric/30 bg-electric/10 px-4 py-2 font-mono text-xs font-bold text-electric">
          2 Badges Verified • Top 2% Percentile
        </div>
      </div>

      {/* Official Vetting Scorecard Dossier */}
      <div className="rounded-3xl border border-[#bcd6fa] bg-white p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#bcd6fa]/30 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-electric">{report.id}</span>
              <span className="rounded-full bg-signal/10 px-2.5 py-0.5 font-mono text-[10.5px] font-bold text-signal">
                {report.tierRanking}
              </span>
            </div>
            <h2 className="mt-1 font-display text-lg sm:text-xl font-bold text-ink">
              {report.title}
            </h2>
            <div className="text-xs text-ink-soft mt-0.5">
              Evaluated by: <strong className="text-ink font-semibold">{report.evaluatedBy}</strong> on {report.evaluationDate}
            </div>
          </div>

          <div className="flex items-center gap-4 bg-canvas/60 rounded-2xl border border-[#bcd6fa]/60 p-4">
            <div className="text-right">
              <div className="font-mono text-[10px] text-mist uppercase tracking-wider">Overall Score</div>
              <div className="font-display text-3xl font-extrabold text-electric">
                {report.overallScore}%
              </div>
            </div>
          </div>
        </div>

        {/* 4 Score Breakdown Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div className="rounded-2xl border border-[#bcd6fa]/60 bg-canvas/30 p-4">
            <span className="font-mono text-[10.5px] text-mist uppercase tracking-wider block">Code Quality</span>
            <div className="mt-1 font-display text-xl font-bold text-ink">{report.codeQualityScore}%</div>
            <span className="font-mono text-[10px] text-signal font-semibold">Tier 1 Clean Arch</span>
          </div>

          <div className="rounded-2xl border border-[#bcd6fa]/60 bg-canvas/30 p-4">
            <span className="font-mono text-[10.5px] text-mist uppercase tracking-wider block">System Design</span>
            <div className="mt-1 font-display text-xl font-bold text-ink">{report.systemDesignScore}%</div>
            <span className="font-mono text-[10px] text-signal font-semibold">High Concurrency</span>
          </div>

          <div className="rounded-2xl border border-[#bcd6fa]/60 bg-canvas/30 p-4">
            <span className="font-mono text-[10.5px] text-mist uppercase tracking-wider block">Unit Test Coverage</span>
            <div className="mt-1 font-display text-xl font-bold text-ink">{report.testCoveragePercentage}%</div>
            <span className="font-mono text-[10px] text-signal font-semibold">Zero Flaky Specs</span>
          </div>

          <div className="rounded-2xl border border-[#bcd6fa]/60 bg-canvas/30 p-4">
            <span className="font-mono text-[10.5px] text-mist uppercase tracking-wider block">Behavioral Rating</span>
            <div className="mt-1 font-display text-xl font-bold text-ink">{report.behavioralScore}%</div>
            <span className="font-mono text-[10px] text-signal font-semibold">Proactive Sync</span>
          </div>
        </div>

        {/* Evaluator Notes */}
        <div className="rounded-2xl border border-electric/25 bg-electric/5 p-4 text-xs text-ink-soft leading-relaxed">
          <strong className="font-display text-ink font-bold block mb-1">Evaluator Council Summary:</strong>
          {report.evaluatorNotes}
        </div>
      </div>

      {/* Grid of Individual Benchmark Assessments */}
      <div className="space-y-3">
        <h3 className="font-display text-base font-bold text-ink">Individual Benchmark Exams</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assessments.map((asm) => (
            <div
              key={asm.id}
              className="rounded-3xl border border-[#bcd6fa] bg-white p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-electric transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-electric">{asm.id}</span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-mono font-bold ${
                      asm.status === "Completed"
                        ? "bg-signal/10 text-signal border border-signal/20"
                        : "bg-canvas text-ink-soft border border-[#bcd6fa]/50"
                    }`}
                  >
                    {asm.status}
                  </span>
                </div>

                <h4 className="mt-2 font-display text-base font-bold text-ink">{asm.title}</h4>
                <div className="mt-2 flex items-center gap-3 text-xs text-mist font-mono">
                  <span className="flex items-center gap-1">
                    <Code2 size={13} className="text-electric" />
                    <span>{asm.category}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={13} className="text-mist" />
                    <span>{asm.duration}</span>
                  </span>
                </div>

                <div className="mt-3 rounded-xl border border-[#bcd6fa]/50 bg-canvas/30 p-3 text-xs">
                  <span className="font-mono text-[10px] uppercase text-mist">Badge Unlocked Upon Passing:</span>
                  <p className="font-display font-semibold text-ink mt-0.5">{asm.badgeEarned}</p>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-[#bcd6fa]/30 pt-3 text-xs">
                {asm.score ? (
                  <div>
                    <span className="font-mono text-mist">Score: </span>
                    <strong className="font-mono text-sm font-bold text-signal">{asm.score}</strong>
                  </div>
                ) : (
                  <span className="font-mono text-mist">Ready for Sprint Test</span>
                )}

                {asm.status === "Completed" ? (
                  <button
                    type="button"
                    className="rounded-xl border border-[#bcd6fa] bg-canvas/40 px-3.5 py-1.5 font-display text-xs font-semibold text-ink hover:bg-canvas transition-colors cursor-pointer"
                  >
                    View Verified Certificate
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleLaunch(asm.id)}
                    disabled={launchedId === asm.id}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-ink px-4 py-1.5 font-display text-xs font-semibold text-white hover:bg-electric transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                  >
                    <span>{launchedId === asm.id ? "Auditing Code..." : "Launch Assessment"}</span>
                    <ArrowRight size={12} />
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
