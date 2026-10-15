"use client";

import { useState } from "react";

interface AiCandidate {
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

const CANDIDATES_AI_POOL: AiCandidate[] = [
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

export default function RecruiterAiSearchPage() {
  const [query, setQuery] = useState(
    "Filter software engineers with 5+ years in Node.js and C2C readiness"
  );
  const [results, setResults] = useState<AiCandidate[]>(CANDIDATES_AI_POOL);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<AiCandidate | null>(
    CANDIDATES_AI_POOL[0]
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
    }, 700);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-electric/30 bg-electric/10 px-3 py-0.5 text-[11px] font-mono font-semibold text-electric uppercase tracking-widest">
          <span>AI-HRMS Search Engine</span>
        </div>
        <h1 className="mt-2 font-display text-2xl sm:text-3xl font-bold tracking-tight text-ink">
          Natural Language Candidate Search & System Audits
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-ink-soft max-w-3xl">
          Execute complex natural language recruitment queries with instant matching against hard-coded technical validation logs, timezone matrices, and behavioral scorecards.
        </p>
      </div>

      {/* NLP Search Bar (FR-035) */}
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
          <svg className="absolute left-4 top-3.5 h-4 w-4 text-electric" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>

          <button
            type="submit"
            disabled={isSearching}
            className="absolute right-2 rounded-xl bg-ink px-4 py-2 font-display text-xs font-semibold text-white hover:bg-electric transition-colors cursor-pointer shadow-xs"
          >
            {isSearching ? "Parsing NLP Query..." : "Execute Search →"}
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
              className="rounded-lg bg-canvas px-2.5 py-1 text-[11px] font-mono text-ink-soft hover:text-electric hover:bg-white border border-[#bcd6fa]/40 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      </form>

      {/* Timezone Overlap Matrix Overview (FR-023) */}
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
            <div className="text-[10px] text-mist mt-1">Enterprise Pod Overlap</div>
          </div>
        </div>
      </div>

      {/* Split: Search Results & System Design Audit Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Candidate Results (2 cols) */}
        <div className="lg:col-span-2 space-y-3.5">
          <h2 className="font-display text-base font-bold text-ink">
            Ranked Candidate Matches ({results.length})
          </h2>

          {results.map((cand) => (
            <div
              key={cand.id}
              onClick={() => setSelectedCandidate(cand)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                selectedCandidate?.id === cand.id
                  ? "border-electric bg-electric/5 shadow-sm ring-2 ring-electric/20"
                  : "border-[#bcd6fa] bg-white hover:border-electric/70"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#bcd6fa]/30 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-electric">{cand.id}</span>
                    <span className="rounded-full bg-signal/10 px-2.5 py-0.5 font-mono text-[10px] font-bold text-signal">
                      Match {cand.matchScore}%
                    </span>
                    <span className="rounded-md bg-canvas px-2 py-0.5 font-mono text-[10px] text-ink-soft border border-[#bcd6fa]/40">
                      {cand.engagement}
                    </span>
                  </div>
                  <h3 className="font-display text-base font-bold text-ink mt-1">{cand.name}</h3>
                  <p className="text-xs text-ink-soft">{cand.role}</p>
                </div>

                <div className="text-right sm:text-right">
                  <div className="font-mono text-xs font-bold text-ink">{cand.visaStatus}</div>
                  <div className="font-mono text-[10px] text-mist">{cand.timezoneOverlap}</div>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="font-mono text-[11px] text-ink-soft">
                  Code Quality: <strong className="text-signal">{cand.codeQualityScore}</strong> • Test Coverage: <strong className="text-ink">{cand.testCoverage}</strong>
                </div>
                <button className="rounded-lg bg-ink px-3 py-1 font-display text-[11px] font-semibold text-white hover:bg-electric transition-colors">
                  Inspect System Audit →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right Audit Inspector & Behavioral Scorecards (1 col) */}
        {selectedCandidate && (
          <div className="rounded-2xl border border-[#bcd6fa] bg-white p-5 shadow-xs space-y-4">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-mist">Audit Dossier</span>
              <h3 className="font-display text-base font-bold text-ink">{selectedCandidate.name}</h3>
              <p className="text-xs text-ink-soft">{selectedCandidate.role}</p>
            </div>

            {/* System Design Audit (FR-037) */}
            <div className="rounded-xl border border-[#bcd6fa]/60 bg-canvas/30 p-3.5 space-y-2 text-xs">
              <div className="font-display font-bold text-ink">Hard-Coded Technical Validation</div>
              <div className="flex items-center justify-between font-mono text-[11px]">
                <span className="text-mist">Code Quality Score:</span>
                <span className="font-bold text-signal">{selectedCandidate.codeQualityScore}</span>
              </div>
              <div className="flex items-center justify-between font-mono text-[11px]">
                <span className="text-mist">Test Suite Coverage:</span>
                <span className="font-bold text-ink">{selectedCandidate.testCoverage}</span>
              </div>
              <div className="flex items-center justify-between font-mono text-[11px]">
                <span className="text-mist">Redis / Kafka Validation:</span>
                <span className="font-bold text-signal">
                  {selectedCandidate.redisKafkaValid ? "✓ Verified Clean" : "N/A Non-Distributed"}
                </span>
              </div>
            </div>

            {/* Behavioral Scorecards: HEXACO / OCEAN / BEI (FR-038) */}
            <div className="rounded-xl border border-[#bcd6fa]/60 bg-canvas/30 p-3.5 space-y-2 text-xs">
              <div className="font-display font-bold text-ink">Behavioral Scorecards</div>
              <div className="space-y-1.5 pt-1 text-[11px]">
                <div>
                  <span className="font-mono text-[10px] text-mist uppercase">HEXACO Model:</span>
                  <div className="font-medium text-ink">{selectedCandidate.behavioralScores.hexaco}</div>
                </div>
                <div>
                  <span className="font-mono text-[10px] text-mist uppercase">OCEAN Traits:</span>
                  <div className="font-medium text-ink">{selectedCandidate.behavioralScores.ocean}</div>
                </div>
                <div>
                  <span className="font-mono text-[10px] text-mist uppercase">BEI Behavioral Event:</span>
                  <div className="font-medium text-ink">{selectedCandidate.behavioralScores.bei}</div>
                </div>
              </div>
            </div>

            <button className="w-full rounded-xl bg-electric py-2.5 font-display text-xs font-semibold text-white hover:bg-electric-bright shadow-xs cursor-pointer">
              Deploy {selectedCandidate.name.split(" ")[0]} to Pod Sprints →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
