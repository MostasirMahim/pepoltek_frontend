"use client";

import { useState } from "react";
import { RecruiterCandidate } from "@/data/mock";

interface RecruiterCandidatesViewProps {
  candidates: RecruiterCandidate[];
}

export function RecruiterCandidatesView({
  candidates,
}: RecruiterCandidatesViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sectorFilter, setSectorFilter] = useState("All");

  const filteredCandidates = candidates.filter((c) => {
    const matchesSector = sectorFilter === "All" || c.sector === sectorFilter;
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.skills.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSector && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Pre-Vetted Talent Directory</h1>
          <p className="text-xs sm:text-sm text-ink-soft">
            Top 2% vetted software engineers and compliance-cleared healthcare professionals ready for rapid pod deployment.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-mist">Available Talent:</span>
          <span className="rounded-full bg-signal/10 px-3 py-1 font-mono text-xs font-bold text-signal">
            1,240 Specialists
          </span>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, skill (Next.js, Go, ICU, NHS), or title..."
            className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3.5 py-2 pl-9 text-xs text-ink placeholder-mist focus:border-electric focus:outline-hidden"
          />
          <svg className="absolute left-3 top-2.5 h-4 w-4 text-mist" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div className="flex gap-2">
          {["All", "Software Tech", "Healthcare"].map((s) => (
            <button
              key={s}
              onClick={() => setSectorFilter(s)}
              className={`rounded-xl px-3.5 py-2 font-display text-xs font-semibold transition-all cursor-pointer ${
                sectorFilter === s
                  ? "bg-ink text-white shadow-xs"
                  : "bg-white border border-[#bcd6fa]/60 text-ink-soft hover:text-ink"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Talent Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCandidates.map((cand) => (
          <div
            key={cand.id}
            className="rounded-2xl border border-[#bcd6fa] bg-white p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-electric transition-all"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-electric">{cand.id}</span>
                  {cand.verified && (
                    <span className="flex items-center gap-1 rounded-full bg-signal/10 px-2.5 py-0.5 font-mono text-[10px] font-bold text-signal">
                      <span>✓</span> Verified Pod Ready
                    </span>
                  )}
                </div>
                <span className="rounded-md bg-electric/10 px-2 py-0.5 font-mono text-xs font-bold text-electric">
                  Match {cand.matchScore}
                </span>
              </div>

              <h2 className="mt-2 font-display text-base font-bold text-ink">{cand.name}</h2>
              <p className="text-xs text-ink-soft">{cand.title}</p>

              <div className="mt-2 flex items-center gap-4 text-xs font-mono text-mist">
                <span>Exp: {cand.experience}</span>
                <span>Rate: <strong className="text-ink">{cand.rate}</strong></span>
                <span>Avail: {cand.availability}</span>
              </div>

              {/* Skills */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {cand.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-md bg-canvas px-2 py-0.5 font-mono text-[11px] font-medium text-ink border border-[#bcd6fa]/40"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="border-t border-[#bcd6fa]/30 pt-3 flex items-center justify-between gap-2">
              <button className="rounded-xl border border-[#bcd6fa] bg-white px-3.5 py-1.5 font-display text-xs font-semibold text-ink hover:bg-canvas">
                View Dossier
              </button>
              <button className="rounded-xl bg-ink px-4 py-1.5 font-display text-xs font-semibold text-white hover:bg-electric shadow-xs">
                + Add to Active Pod
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
