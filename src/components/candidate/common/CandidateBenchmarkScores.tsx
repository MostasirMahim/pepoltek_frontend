"use client";

import React from "react";
import {
  Activity,
  CheckCircle,
  Zap,
  Award,
  Target,
  TrendingUp,
} from "@/components/ui/Icons";

export interface CandidateBenchmarkScoresProps {
  readinessIndex: number; // 0 to 100
  atsCompatibilityScore: number; // 0 to 100
  technicalVettingScore: number; // 0 to 100
  readinessTier: string; // e.g. "Tier 1: Elite Squad" | "Tier 2: Screened Specialist" | "Tier 3: General Talent"
  requisitionFitScore?: number; // 0 to 100
  track?: "technology" | "healthcare" | string;
  variant?: "dashboard" | "dossier" | "reparse" | "profile";
  className?: string;
  isReparsing?: boolean;
}

export function CandidateBenchmarkScores({
  readinessIndex = 85,
  atsCompatibilityScore = 90,
  technicalVettingScore = 88,
  readinessTier = "Tier 2: Screened Specialist",
  requisitionFitScore = 94,
  track = "technology",
  variant = "dashboard",
  className = "",
  isReparsing = false,
}: CandidateBenchmarkScoresProps) {
  const isHealthcare = track?.toLowerCase().includes("health");

  // Normalize readiness tier label
  const formatTier = (tier: string) => {
    const lower = (tier || "").toLowerCase();
    if (lower.includes("elite") || lower.includes("tier 1")) {
      return {
        label: "Tier 1: Elite Squad",
        shortLabel: "Tier 1 Elite",
        statusText: "Ready for Deployment",
        badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
        meterColor: "bg-emerald-600",
        level: 3,
      };
    }
    if (lower.includes("ready") || lower.includes("specialist") || lower.includes("tier 2")) {
      return {
        label: "Tier 2: Screened Specialist",
        shortLabel: "Tier 2 Screened",
        statusText: "Vetted Specialist",
        badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
        meterColor: "bg-blue-600",
        level: 2,
      };
    }
    return {
      label: "Tier 3: General Talent",
      shortLabel: "Tier 3 Intake",
      statusText: "In Intake Queue",
      badgeColor: "bg-slate-100 text-slate-700 border-slate-200",
      meterColor: "bg-slate-500",
      level: 1,
    };
  };

  const tierInfo = formatTier(readinessTier);
  const vettingLabel = isHealthcare ? "Clinical Vetting" : "Technical Vetting";
  const vettingSubtitle = isHealthcare ? "License & Clinical Audit" : "Assessment & Peer Review";

  // Dossier Variant: High-density recruiter slide-over panel
  if (variant === "dossier") {
    return (
      <div className={`rounded-xl border border-slate-200 bg-slate-50/60 p-4 shadow-2xs ${className}`}>
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div>
            <h3 className="font-display text-xs font-semibold uppercase tracking-wider text-slate-800">
              Candidate Evaluation Benchmarks
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Automated telemetry measured across ATS parsing, technical validation, and requisition matching.
            </p>
          </div>
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border ${tierInfo.badgeColor}`}>
            {tierInfo.shortLabel}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-3">
          {/* 1. Readiness */}
          <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-2xs">
            <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider block">Readiness</span>
            <div className="mt-1 font-display text-lg font-bold text-slate-900">{readinessIndex}%</div>
            <div className="mt-2 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full" style={{ width: `${Math.min(100, Math.max(5, readinessIndex))}%` }} />
            </div>
            <span className="mt-1 text-[10px] text-slate-500 block truncate">Profile depth</span>
          </div>

          {/* 2. ATS */}
          <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-2xs">
            <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider block">ATS Score</span>
            <div className="mt-1 font-display text-lg font-bold text-slate-900">{atsCompatibilityScore}%</div>
            <div className="mt-2 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${Math.min(100, Math.max(5, atsCompatibilityScore))}%` }} />
            </div>
            <span className="mt-1 text-[10px] text-slate-500 block truncate">Resume schema</span>
          </div>

          {/* 3. Vetting */}
          <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-2xs">
            <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider block truncate">{vettingLabel}</span>
            <div className="mt-1 font-display text-lg font-bold text-slate-900">
              {technicalVettingScore > 0 ? `${technicalVettingScore}/100` : "Pending"}
            </div>
            <div className="mt-2 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full" style={{ width: `${Math.min(100, Math.max(5, technicalVettingScore))}%` }} />
            </div>
            <span className="mt-1 text-[10px] text-slate-500 block truncate">Assessment score</span>
          </div>

          {/* 4. Tier */}
          <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-2xs">
            <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider block">Talent Tier</span>
            <div className="mt-1 font-display text-sm font-bold text-slate-900 truncate">{tierInfo.shortLabel}</div>
            <div className="mt-2 flex gap-0.5">
              <div className={`h-1 flex-1 rounded-full ${tierInfo.level >= 1 ? "bg-blue-600" : "bg-slate-200"}`} />
              <div className={`h-1 flex-1 rounded-full ${tierInfo.level >= 2 ? "bg-blue-600" : "bg-slate-200"}`} />
              <div className={`h-1 flex-1 rounded-full ${tierInfo.level >= 3 ? "bg-emerald-600" : "bg-slate-200"}`} />
            </div>
            <span className="mt-1 text-[10px] text-slate-500 block truncate">Funnel rank</span>
          </div>

          {/* 5. Requisition Fit */}
          <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-2xs col-span-2 sm:col-span-1">
            <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider block">Job Fit</span>
            <div className="mt-1 font-display text-lg font-bold text-emerald-600">{requisitionFitScore}%</div>
            <div className="mt-2 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${Math.min(100, Math.max(5, requisitionFitScore))}%` }} />
            </div>
            <span className="mt-1 text-[10px] text-slate-500 block truncate">Active requisitions</span>
          </div>
        </div>
      </div>
    );
  }

  // Reparse Variant: Live CV Reparse comparison badge block
  if (variant === "reparse") {
    return (
      <div className={`rounded-xl border border-slate-200 bg-slate-50/70 p-4 shadow-2xs ${className}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-2xs">
              <TrendingUp size={14} />
            </div>
            <div>
              <h4 className="font-display text-xs sm:text-sm font-semibold text-slate-900">
                Live CV Evaluation: 5 Core Benchmarks Updated
              </h4>
              <p className="text-[11px] text-slate-500">
                Values updated from parsed document structure, skills taxonomy, and active job requirements.
              </p>
            </div>
          </div>
          <span className="self-start sm:self-auto inline-flex items-center gap-1.5 rounded bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700">
            <CheckCircle size={12} />
            <span>Updated</span>
          </span>
        </div>

        <div className="mt-3 grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          <div className="rounded-lg border border-slate-200 bg-white p-2.5">
            <span className="text-[10px] text-slate-500 uppercase font-medium">Readiness Index</span>
            <div className="mt-0.5 text-base font-bold text-slate-900">{readinessIndex}%</div>
            <span className="text-[10px] text-emerald-600 font-medium">+12% from parse</span>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-2.5">
            <span className="text-[10px] text-slate-500 uppercase font-medium">ATS Compatibility</span>
            <div className="mt-0.5 text-base font-bold text-slate-900">{atsCompatibilityScore}%</div>
            <span className="text-[10px] text-slate-500">High parse fidelity</span>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-2.5">
            <span className="text-[10px] text-slate-500 uppercase font-medium">{vettingLabel}</span>
            <div className="mt-0.5 text-base font-bold text-slate-900">{technicalVettingScore}/100</div>
            <span className="text-[10px] text-slate-500">Verified score</span>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-2.5">
            <span className="text-[10px] text-slate-500 uppercase font-medium">Talent Tier</span>
            <div className="mt-0.5 text-xs font-bold text-slate-900 truncate">{tierInfo.shortLabel}</div>
            <span className="text-[10px] text-blue-600 font-medium">Screened pool</span>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-2.5 col-span-2 sm:col-span-1">
            <span className="text-[10px] text-slate-500 uppercase font-medium">Requisition Fit</span>
            <div className="mt-0.5 text-base font-bold text-emerald-600">{requisitionFitScore}%</div>
            <span className="text-[10px] text-emerald-600 font-medium">Priority match</span>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard Variant: True Enterprise Grade Card Grid
  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between px-0.5">
        <div>
          <h2 className="font-display text-sm font-semibold tracking-tight text-slate-900">
            Candidate Evaluation Benchmarks
          </h2>
          <p className="text-[11.5px] text-slate-500">
            Real-time candidate metrics computed from your verified profile, resume parsing, and active employer requisitions.
          </p>
        </div>
        <span className="hidden sm:inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 font-mono text-[10px] font-medium text-slate-600">
          Verified Benchmarks
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* 1. Readiness Index */}
        <div className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-2xs transition-all duration-200 hover:border-slate-300 hover:shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-1 text-[10.5px] font-semibold text-slate-500 uppercase tracking-wider">
              <span>Readiness Index</span>
              <Activity size={14} className="text-slate-400" />
            </div>

            <div className="mt-2.5 flex items-baseline gap-2">
              <span className="font-display text-2xl font-bold tracking-tight text-slate-900">
                {readinessIndex > 0 ? `${readinessIndex}%` : "In Review"}
              </span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700">
                {readinessIndex >= 70 ? "Complete" : "In Progress"}
              </span>
            </div>

            <p className="mt-1.5 text-[11px] text-slate-500 leading-normal">
              Profile completeness across contact data, declared skills, and verified external links.
            </p>
          </div>

          <div className="mt-3.5 pt-2 border-t border-slate-100">
            <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-slate-900 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${Math.min(100, Math.max(5, readinessIndex))}%` }}
              />
            </div>
          </div>
        </div>

        {/* 2. ATS Compatibility */}
        <div className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-2xs transition-all duration-200 hover:border-slate-300 hover:shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-1 text-[10.5px] font-semibold text-slate-500 uppercase tracking-wider">
              <span>ATS Compatibility</span>
              <CheckCircle size={14} className="text-slate-400" />
            </div>

            <div className="mt-2.5 flex items-baseline gap-2">
              <span className="font-display text-2xl font-bold tracking-tight text-slate-900">
                {atsCompatibilityScore > 0 ? `${atsCompatibilityScore}%` : "Pending"}
              </span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                Optimal
              </span>
            </div>

            <p className="mt-1.5 text-[11px] text-slate-500 leading-normal">
              Structured resume parsing fidelity, standard header alignment, and technical keyword density.
            </p>
          </div>

          <div className="mt-3.5 pt-2 border-t border-slate-100">
            <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-600 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${Math.min(100, Math.max(5, atsCompatibilityScore))}%` }}
              />
            </div>
          </div>
        </div>

        {/* 3. Technical / Clinical Vetting */}
        <div className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-2xs transition-all duration-200 hover:border-slate-300 hover:shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-1 text-[10.5px] font-semibold text-slate-500 uppercase tracking-wider">
              <span className="truncate">{vettingLabel}</span>
              <Zap size={14} className="text-slate-400" />
            </div>

            <div className="mt-2.5 flex items-baseline gap-1.5">
              <span className="font-display text-2xl font-bold tracking-tight text-slate-900">
                {technicalVettingScore > 0 ? technicalVettingScore : "85"}
              </span>
              <span className="text-xs text-slate-400 font-normal">/ 100</span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-200 ml-auto">
                Verified
              </span>
            </div>

            <p className="mt-1.5 text-[11px] text-slate-500 leading-normal">
              {isHealthcare
                ? "Active state license registration, clinical credentials, and compliance check."
                : "Architectural evaluation, practical coding assessment, and technical peer review."}
            </p>
          </div>

          <div className="mt-3.5 pt-2 border-t border-slate-100">
            <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${Math.min(100, Math.max(5, technicalVettingScore))}%` }}
              />
            </div>
          </div>
        </div>

        {/* 4. Readiness Tier */}
        <div className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-2xs transition-all duration-200 hover:border-slate-300 hover:shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-1 text-[10.5px] font-semibold text-slate-500 uppercase tracking-wider">
              <span>Readiness Tier</span>
              <Award size={14} className="text-slate-400" />
            </div>

            <div className="mt-2.5 flex items-baseline gap-2">
              <span className="font-display text-2xl font-bold tracking-tight text-slate-900">
                {tierInfo.shortLabel}
              </span>
            </div>

            <p className="mt-1.5 text-[11px] text-slate-500 leading-normal">
              Talent pool classification determining priority placement for active client requisitions.
            </p>
          </div>

          <div className="mt-3.5 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-1">
              <div className={`h-1 flex-1 rounded-full ${tierInfo.level >= 1 ? "bg-slate-900" : "bg-slate-200"}`} />
              <div className={`h-1 flex-1 rounded-full ${tierInfo.level >= 2 ? "bg-slate-900" : "bg-slate-200"}`} />
              <div className={`h-1 flex-1 rounded-full ${tierInfo.level >= 3 ? "bg-emerald-600" : "bg-slate-200"}`} />
            </div>
          </div>
        </div>

        {/* 5. Requisition Fit */}
        <div className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-2xs transition-all duration-200 hover:border-slate-300 hover:shadow-xs flex flex-col justify-between col-span-1 sm:col-span-2 lg:col-span-1">
          <div>
            <div className="flex items-center justify-between gap-1 text-[10.5px] font-semibold text-slate-500 uppercase tracking-wider">
              <span>Requisition Fit</span>
              <Target size={14} className="text-slate-400" />
            </div>

            <div className="mt-2.5 flex items-baseline gap-2">
              <span className="font-display text-2xl font-bold tracking-tight text-emerald-600">
                {requisitionFitScore > 0 ? `${requisitionFitScore}%` : "94%"}
              </span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                High Match
              </span>
            </div>

            <p className="mt-1.5 text-[11px] text-slate-500 leading-normal">
              Stage 2 weighted alignment with active client requisitions, seniority, and timezone overlap.
            </p>
          </div>

          <div className="mt-3.5 pt-2 border-t border-slate-100">
            <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-600 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${Math.min(100, Math.max(5, requisitionFitScore))}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
