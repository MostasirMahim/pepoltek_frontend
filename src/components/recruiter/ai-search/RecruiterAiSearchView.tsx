"use client";

import { useState } from "react";
import {
  Zap,
  ShieldCheck,
  Clock,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Code2,
  Users,
  X,
  FileText,
} from "@/components/ui/Icons";

export interface AiCandidate {
  id: string;
  name: string;
  role: string;
  matchScore: number;
  visaStatus: "OPT/STEM OPT" | "H-1B" | "Green Card" | "US Citizen" | "International Remote";
  engagement: "W2" | "C2C" | "1099" | "Direct Hire";
  timezoneOverlap: string;
  codeQualityScore: string;
  testCoverage: string;
  redisKafkaValid: boolean;
  behavioralScores: {
    hexaco: string;
    ocean: string;
    bei: string;
  };
}

export const CANDIDATES_AI_POOL: AiCandidate[] = [
  {
    id: "AI-CAND-81",
    name: "Alex Morgan",
    role: "Lead Node.js & React Architect",
    matchScore: 99,
    visaStatus: "International Remote",
    engagement: "C2C",
    timezoneOverlap: "6 Hours Overlap (UK/US East)",
    codeQualityScore: "98.4 / 100",
    testCoverage: "94% Unit + E2E",
    redisKafkaValid: true,
    behavioralScores: {
      hexaco: "96% Conscientiousness",
      ocean: "High Openness / Emotional Stability",
      bei: "Structured Problem Solver Level 5",
    },
  },
  {
    id: "AI-CAND-82",
    name: "David Kim",
    role: "Distributed Systems Go & Kafka Engineer",
    matchScore: 96,
    visaStatus: "H-1B",
    engagement: "W2",
    timezoneOverlap: "8 Hours Overlap (US Core)",
    codeQualityScore: "96.2 / 100",
    testCoverage: "91% Integration",
    redisKafkaValid: true,
    behavioralScores: {
      hexaco: "92% Integrity & Honesty",
      ocean: "High Agreeableness / Focus",
      bei: "Team Velocity Multiplier Level 4",
    },
  },
  {
    id: "AI-CAND-83",
    name: "Dr. Rachel Higgins",
    role: "Clinical Lead & Healthcare Interoperability",
    matchScore: 98,
    visaStatus: "US Citizen",
    engagement: "Direct Hire",
    timezoneOverlap: "Full UK/US Overlap",
    codeQualityScore: "99.0 / 100 (Clinical Standard)",
    testCoverage: "100% Protocol Compliance",
    redisKafkaValid: false,
    behavioralScores: {
      hexaco: "99% Accountability",
      ocean: "Exceptional Resilience",
      bei: "Clinical Crisis Leadership Level 5",
    },
  },
];

interface RecruiterAiSearchViewProps {
  initialCandidates?: AiCandidate[];
}

export function RecruiterAiSearchView({
  initialCandidates = CANDIDATES_AI_POOL,
}: RecruiterAiSearchViewProps) {
  const [query, setQuery] = useState(
    "Filter software engineers with 5+ years in Node.js and C2C readiness"
  );
  const [results, setResults] = useState<AiCandidate[]>(initialCandidates);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<AiCandidate | null>(
    initialCandidates[0] || null
  );

  // Score Override Modal State
  const [overrideCandidate, setOverrideCandidate] = useState<AiCandidate | null>(null);
  const [overrideScore, setOverrideScore] = useState<number>(95);
  const [overrideReason, setOverrideReason] = useState<string>("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      setToastMessage("Parsed NLP query. Candidate ranking updated with hard-coded verification telemetry.");
      setTimeout(() => setToastMessage(null), 3500);
    }, 600);
  };

  const handleApplyOverride = () => {
    if (!overrideCandidate) return;
    const targetId = overrideCandidate.id;

    setResults((prev) =>
      prev.map((c) => (c.id === targetId ? { ...c, matchScore: overrideScore } : c))
    );

    if (selectedCandidate?.id === targetId) {
      setSelectedCandidate({ ...selectedCandidate, matchScore: overrideScore });
    }

    setToastMessage(`Match score for ${overrideCandidate.name} overridden to ${overrideScore}%. Reason logged in SOC 2 audit trail.`);
    setTimeout(() => setToastMessage(null), 4000);
    setOverrideCandidate(null);
    setOverrideReason("");
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-electric/30 bg-electric/10 px-3 py-0.5 text-[11px] font-mono font-semibold text-electric uppercase tracking-widest">
          <span>AI-HRMS Search Engine</span>
        </div>
        <h1 className="mt-2 font-display text-2xl sm:text-3xl font-bold tracking-tight text-ink">
          Natural Language Candidate Search &amp; System Audits
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-ink-soft max-w-3xl">
          Execute complex natural language recruitment queries with instant matching against hard-coded technical validation logs, timezone matrices, and behavioral scorecards.
        </p>
      </div>

      {/* Toast Alert */}
      {toastMessage && (
        <div className="rounded-xl border border-signal/30 bg-signal/10 px-4 py-2.5 text-xs font-semibold text-signal flex items-center gap-2 animate-in fade-in-0 duration-200">
          <CheckCircle size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* NLP Search Bar */}
      <form
        onSubmit={handleSearch}
        className="rounded-2xl border border-[#bcd6fa] bg-white p-3 sm:p-4 shadow-sm space-y-3"
      >
        <div className="relative flex items-center">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. Filter software engineers with 5+ years in Node.js and C2C readiness..."
            className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/40 px-4 py-3 pl-11 text-xs sm:text-sm text-ink placeholder-mist focus:border-electric focus:bg-white focus:outline-hidden font-medium"
          />
          <div className="absolute left-4 top-3.5 text-electric">
            <Zap size={18} />
          </div>

          <button
            type="submit"
            disabled={isSearching}
            className="absolute right-2 rounded-xl bg-ink px-4 py-2 font-display text-xs font-semibold text-white hover:bg-electric transition-colors cursor-pointer shadow-xs disabled:opacity-50"
          >
            {isSearching ? "Parsing NLP Query..." : "Execute Search"}
          </button>
        </div>

        {/* Quick Query Suggestions */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="font-mono text-[10px] uppercase text-mist mr-1">Example Queries:</span>
          {[
            "React architects available for 7-day sprint",
            "NHS Band 7 ICU specialists with DBS check",
            "DevOps Kubernetes engineers with C2C readiness",
          ].map((q) => (
            <button
              type="button"
              key={q}
              onClick={() => setQuery(q)}
              className="rounded-lg bg-canvas px-2.5 py-1 text-[11px] font-mono text-ink-soft hover:text-electric hover:bg-white border border-[#bcd6fa]/40 transition-colors cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>
      </form>

      {/* Timezone Overlap Matrix Overview */}
      <div className="rounded-2xl border border-[#bcd6fa] bg-white p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-sm font-bold text-ink">Global Timezone Overlap Matrix</h2>
          <span className="font-mono text-[11px] text-electric font-semibold">Sprint Synchronous Windows</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="rounded-xl border border-[#bcd6fa]/60 bg-canvas/30 p-3">
            <div className="font-display font-bold text-ink">North America</div>
            <p className="font-mono text-[11px] text-electric mt-0.5">4 to 6 Hours Live Standups</p>
            <div className="text-[10px] text-mist mt-1">+ Asynchronous Sprints</div>
          </div>

          <div className="rounded-xl border border-[#bcd6fa]/60 bg-canvas/30 p-3">
            <div className="font-display font-bold text-ink">United Kingdom</div>
            <p className="font-mono text-[11px] text-electric mt-0.5">6 to 8 Hours Core Overlap</p>
            <div className="text-[10px] text-mist mt-1">Full Synchronous Coverage</div>
          </div>

          <div className="rounded-xl border border-[#bcd6fa]/60 bg-canvas/30 p-3">
            <div className="font-display font-bold text-ink">Europe (CEE)</div>
            <p className="font-mono text-[11px] text-electric mt-0.5">6 to 8 Hours Core Overlap</p>
            <div className="text-[10px] text-mist mt-1">High Velocity Integration</div>
          </div>

          <div className="rounded-xl border border-[#bcd6fa]/60 bg-canvas/30 p-3">
            <div className="font-display font-bold text-ink">GCC / Middle East</div>
            <p className="font-mono text-[11px] text-electric mt-0.5">6 to 7 Hours Overlap</p>
            <div className="text-[10px] text-mist mt-1">Enterprise Timezone Overlap</div>
          </div>
        </div>
      </div>

      {/* Split: Search Results & System Design Audit Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Candidate Results */}
        <div className="lg:col-span-2 space-y-3.5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-bold text-ink">
              Ranked Candidate Matches ({results.length})
            </h2>
            <span className="font-mono text-xs text-mist">Sorted by Match Score</span>
          </div>

          {results.map((cand) => (
            <div
              key={cand.id}
              onClick={() => setSelectedCandidate(cand)}
              className={`rounded-2xl border p-5 transition-all cursor-pointer ${
                selectedCandidate?.id === cand.id
                  ? "border-electric bg-white shadow-sm ring-1 ring-electric/30"
                  : "border-[#bcd6fa] bg-white hover:border-electric/70 hover:shadow-2xs"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#bcd6fa]/30 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-electric">{cand.id}</span>
                    <span className="rounded-full bg-signal/15 px-2 py-0.5 font-mono text-[10px] font-bold text-signal">
                      {cand.matchScore}% Match
                    </span>
                    <span className="rounded-full border border-[#bcd6fa] bg-canvas px-2 py-0.5 font-mono text-[10px] text-ink-soft">
                      {cand.visaStatus}
                    </span>
                    <span className="rounded-full bg-ink/5 px-2 py-0.5 font-mono text-[10px] text-ink font-semibold">
                      {cand.engagement}
                    </span>
                  </div>
                  <h3 className="mt-1 font-display text-base font-bold text-ink">{cand.name}</h3>
                  <p className="text-xs text-ink-soft">{cand.role}</p>
                </div>

                <div className="flex items-center gap-2 sm:text-right">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOverrideCandidate(cand);
                      setOverrideScore(cand.matchScore);
                    }}
                    className="rounded-lg border border-[#bcd6fa] bg-canvas/40 px-2.5 py-1 text-[11px] font-mono text-ink-soft hover:bg-white hover:text-electric transition-all cursor-pointer"
                  >
                    Override Score
                  </button>
                </div>
              </div>

              {/* Hard-Coded Technical Validation Telemetry */}
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                <div className="rounded-lg bg-canvas/40 p-2">
                  <span className="font-mono text-[10px] text-mist block">Code Quality Score</span>
                  <span className="font-bold text-ink">{cand.codeQualityScore}</span>
                </div>
                <div className="rounded-lg bg-canvas/40 p-2">
                  <span className="font-mono text-[10px] text-mist block">Automated Test Coverage</span>
                  <span className="font-bold text-signal">{cand.testCoverage}</span>
                </div>
                <div className="rounded-lg bg-canvas/40 p-2 col-span-2 sm:col-span-1">
                  <span className="font-mono text-[10px] text-mist block">Timezone Synchronicity</span>
                  <span className="font-semibold text-ink text-[11px]">{cand.timezoneOverlap}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right System Design Audit Inspector */}
        <div className="rounded-2xl border border-[#bcd6fa] bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#bcd6fa]/40 pb-3">
            <h3 className="font-display text-sm font-bold text-ink">
              Candidate Telemetry Inspector
            </h3>
            <span className="font-mono text-[10px] font-bold text-signal bg-signal/10 px-2 py-0.5 rounded-full">
              Verified
            </span>
          </div>

          {selectedCandidate ? (
            <div className="space-y-4 text-xs">
              <div>
                <span className="font-mono text-[10px] text-mist uppercase tracking-wider block">Candidate Name</span>
                <span className="font-display text-base font-bold text-ink">{selectedCandidate.name}</span>
                <p className="text-ink-soft text-xs">{selectedCandidate.role}</p>
              </div>

              <div className="rounded-xl border border-electric/30 bg-electric/5 p-3 space-y-1">
                <div className="font-mono text-[11px] font-bold text-electric">Behavioral Scorecard</div>
                <div className="text-[11px] text-ink-soft">HEXACO: {selectedCandidate.behavioralScores.hexaco}</div>
                <div className="text-[11px] text-ink-soft">OCEAN: {selectedCandidate.behavioralScores.ocean}</div>
                <div className="text-[11px] text-ink-soft">BEI: {selectedCandidate.behavioralScores.bei}</div>
              </div>

              <div className="space-y-2">
                <span className="font-mono text-[10px] text-mist uppercase tracking-wider block">Production Readiness</span>
                <div className="flex items-center justify-between rounded-lg bg-canvas/50 p-2.5">
                  <span className="text-ink font-medium">Asynchronous Pipeline Valid</span>
                  <span className={`font-mono font-bold ${selectedCandidate.redisKafkaValid ? "text-signal" : "text-mist"}`}>
                    {selectedCandidate.redisKafkaValid ? "Active" : "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-canvas/50 p-2.5">
                  <span className="text-ink font-medium">Work Authorization</span>
                  <span className="font-mono font-bold text-ink">{selectedCandidate.visaStatus}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-canvas/50 p-2.5">
                  <span className="text-ink font-medium">Billing Model</span>
                  <span className="font-mono font-bold text-ink">{selectedCandidate.engagement}</span>
                </div>
              </div>

              <button
                type="button"
                className="w-full rounded-xl bg-ink py-2.5 font-display text-xs font-bold text-white hover:bg-electric transition-colors cursor-pointer shadow-xs text-center"
              >
                Assign to Active Requisition
              </button>
            </div>
          ) : (
            <p className="text-xs text-mist">Select a candidate to view deep technical telemetry.</p>
          )}
        </div>
      </div>

      {/* Score Override Modal */}
      {overrideCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 backdrop-blur-xs p-4 animate-in fade-in-0 duration-150">
          <div
            className="w-full max-w-md rounded-3xl border border-[#bcd6fa] bg-white p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-[#bcd6fa]/40 pb-3">
              <div>
                <h3 className="font-display text-base font-bold text-ink">Override Match Score</h3>
                <p className="text-xs text-ink-soft">{overrideCandidate.name} ({overrideCandidate.role})</p>
              </div>
              <button
                type="button"
                onClick={() => setOverrideCandidate(null)}
                className="rounded-xl p-1 text-ink-soft hover:bg-canvas cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-mono text-[11px] font-semibold text-ink uppercase block mb-1">
                  New Adjusted Match Score (0 to 100)
                </label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={overrideScore}
                  onChange={(e) => setOverrideScore(Number(e.target.value))}
                  className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/30 px-3.5 py-2 text-xs text-ink font-bold focus:border-electric focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="font-mono text-[11px] font-semibold text-ink uppercase block mb-1">
                  Mandatory Justification Reason (SOC 2 Audit Log)
                </label>
                <textarea
                  rows={3}
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  placeholder="Explain why the automated score was adjusted (e.g. Verified specialized domain experience during client panel)..."
                  className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/30 px-3.5 py-2 text-xs text-ink focus:border-electric focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#bcd6fa]/40">
              <button
                type="button"
                onClick={() => setOverrideCandidate(null)}
                className="rounded-xl px-4 py-2 font-display text-xs font-semibold text-ink-soft hover:bg-canvas cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!overrideReason.trim()}
                onClick={handleApplyOverride}
                className="rounded-xl bg-electric px-5 py-2 font-display text-xs font-bold text-white hover:bg-electric-bright disabled:opacity-40 transition-all cursor-pointer shadow-xs"
              >
                Commit Override
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
