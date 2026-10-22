"use client";

import { useState } from "react";
import {
  Compass,
  ShieldCheck,
  Check,
  Lock,
  ArrowRight,
  Clock,
  Briefcase,
  Zap,
  FileText,
  X,
  CheckCircle,
  AlertTriangle,
} from "@/components/ui/Icons";
import { ReverseSearchMatch } from "@/types/candidate.types";
import {
  getReverseSearchMatchesAction,
  authorizePitchAction,
} from "@/actions/matching.actions";

interface CandidateReverseSearchViewProps {
  initialMatches?: ReverseSearchMatch[];
}

export function CandidateReverseSearchView({
  initialMatches = [],
}: CandidateReverseSearchViewProps) {
  const [matches, setMatches] = useState<ReverseSearchMatch[]>(initialMatches);
  const [filterSector, setFilterSector] = useState<"all" | "it" | "health">("all");
  const [selectedMatchForPreview, setSelectedMatchForPreview] = useState<ReverseSearchMatch | null>(null);
  const [declineTarget, setDeclineTarget] = useState<ReverseSearchMatch | null>(null);
  const [declineReason, setDeclineReason] = useState<string>("rate_too_low");
  const [isScanning, setIsScanning] = useState(false);
  const [lastScanned, setLastScanned] = useState("Just now");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleAuthorizePitch = async (id: string) => {
    const current = matches.find((m) => m.id === id);
    const nextState = !current?.authorized;

    setMatches((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          return {
            ...m,
            authorized: nextState,
            authorizedAt: nextState ? "Just now" : undefined,
          };
        }
        return m;
      })
    );

    setToastMessage(
      nextState
        ? `Authorized 1-Click Pitch for ${current?.clientOrgAnonymized}. Dossier presented privately.`
        : `Revoked pitch authorization for ${current?.clientOrgAnonymized}.`
    );
    setTimeout(() => setToastMessage(null), 3500);

    // Call live server action
    await authorizePitchAction(id, nextState);
  };

  const handleConfirmDecline = async () => {
    if (!declineTarget) return;
    const targetId = declineTarget.id;
    const targetName = declineTarget.clientOrgAnonymized;

    setMatches((prev) => prev.filter((m) => m.id !== targetId));
    setDeclineTarget(null);

    setToastMessage(`Match declined for ${targetName}. Requisition archived from your stream.`);
    setTimeout(() => setToastMessage(null), 3500);

    await authorizePitchAction(targetId, false);
  };

  const handleTriggerRescan = async () => {
    setIsScanning(true);
    const res = await getReverseSearchMatchesAction();
    setIsScanning(false);
    setLastScanned("Just now");

    if (res.success && res.data && res.data.length > 0) {
      const mapped: ReverseSearchMatch[] = res.data.map((item, idx) => ({
        id: item.id || `MATCH-BE-${idx}`,
        clientOrgAnonymized: item.company_masked || "Enterprise Client (Confidential)",
        role: item.title,
        sector: item.sector === "healthcare" ? "Healthcare & Med-Tech" : "Enterprise IT",
        matchScore: item.match_score || 95,
        skillOverlap: item.skills || ["Next.js", "TypeScript", "Node.js"],
        timezoneOverlap: item.timezone_overlap || "4h guaranteed live overlap",
        compensation: item.rate_range || "$85 - $110 / hr",
        engagement: "C2C",
        sprintVelocity: "7-Day Sprint Ready",
        authorized: item.pitch_status === "authorized",
        authorizedAt: item.pitch_status === "authorized" ? "Verified" : undefined,
        description: "Matched based on verified skills, timezone alignment, and work authorization.",
      }));
      setMatches(mapped);
      setToastMessage("Reverse search pipeline rescan complete. Live client matches refreshed.");
    } else {
      setToastMessage("Reverse search pipeline rescan complete.");
    }
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredMatches = matches.filter((m) => {
    if (filterSector === "it") return m.sector === "Enterprise IT";
    if (filterSector === "health") return m.sector === "Healthcare & Med-Tech";
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header & Privacy Seal - Responsive Mobile & Desktop */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-electric/30 bg-gradient-to-r from-ink via-[#0d1f3d] to-ink p-4 sm:p-6 lg:p-7 text-white shadow-md">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-signal/40 bg-signal/10 px-2.5 py-0.5 text-[9.5px] sm:text-[11px] font-mono text-signal">
              <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-signal animate-pulse" />
              <span>ZERO PUBLIC PROFILE EXPOSURE GUARANTEE</span>
            </div>
            <h1 className="mt-1.5 sm:mt-2.5 font-display text-lg sm:text-2xl lg:text-3xl font-extrabold tracking-tight">
              Reverse Job Search Engine
            </h1>
            <p className="mt-1 text-[11.5px] sm:text-xs md:text-sm text-gray-300 max-w-2xl leading-normal sm:leading-relaxed line-clamp-2 sm:line-clamp-none">
              Your profile is continuously scanned against live client enterprise requisitions. Enterprise clients only receive your anonymized dossier once you authorize a <strong>One-Click Pitch</strong>.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={handleTriggerRescan}
              disabled={isScanning}
              className="inline-flex items-center gap-1.5 sm:gap-2 rounded-lg sm:rounded-xl bg-electric px-3 py-1.5 sm:px-4 sm:py-2.5 font-display text-xs font-semibold text-white shadow-xs transition-all hover:bg-electric-bright disabled:opacity-50 active:scale-95 cursor-pointer"
            >
              <Zap size={13} className={isScanning ? "animate-spin" : "sm:w-3.5 sm:h-3.5"} />
              <span>{isScanning ? "Scanning..." : "Rescan Active Gigs"}</span>
            </button>
          </div>
        </div>

        {/* Scan Status Ribbon - Compact on Mobile */}
        <div className="relative z-10 mt-3 sm:mt-6 pt-3 sm:pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-3 text-xs">
          <div className="flex items-center gap-1.5 font-mono text-gray-300 text-[10px] sm:text-[11px]">
            <Clock size={12} className="text-electric-bright shrink-0" />
            <span>Telemetry Last Synced: <strong className="text-white">{lastScanned}</strong></span>
          </div>
          <div className="font-mono text-[10px] sm:text-[11px] text-gray-300">
            Active Verified Pipelines: <strong className="text-signal font-bold">{matches.length} Enterprise Matches</strong>
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

      {/* Toast Banner */}
      {toastMessage && (
        <div className="rounded-xl border border-signal/30 bg-signal/10 px-3.5 py-2 text-xs font-semibold text-signal flex items-center gap-2 animate-in fade-in-0 duration-200">
          <CheckCircle size={15} className="shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Filter Strip - Horizontally Scrollable on Mobile */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 rounded-xl sm:rounded-2xl border border-[#bcd6fa] bg-white p-2.5 sm:p-3 shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 scroll-smooth">
          <span className="shrink-0 font-mono text-[10px] sm:text-[11px] font-semibold text-ink-soft uppercase tracking-wider pl-1">
            Sector:
          </span>
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => setFilterSector("all")}
              className={`rounded-lg sm:rounded-xl px-2.5 sm:px-3 py-1 sm:py-1.5 font-mono text-xs font-semibold transition-all cursor-pointer ${
                filterSector === "all" ? "bg-ink text-white" : "text-ink-soft hover:bg-canvas hover:text-ink"
              }`}
            >
              All Matches ({matches.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterSector("it")}
              className={`rounded-lg sm:rounded-xl px-2.5 sm:px-3 py-1 sm:py-1.5 font-mono text-xs font-semibold transition-all cursor-pointer ${
                filterSector === "it" ? "bg-ink text-white" : "text-ink-soft hover:bg-canvas hover:text-ink"
              }`}
            >
              Enterprise IT
            </button>
            <button
              type="button"
              onClick={() => setFilterSector("health")}
              className={`rounded-lg sm:rounded-xl px-2.5 sm:px-3 py-1 sm:py-1.5 font-mono text-xs font-semibold transition-all cursor-pointer ${
                filterSector === "health" ? "bg-ink text-white" : "text-ink-soft hover:bg-canvas hover:text-ink"
              }`}
            >
              Healthcare &amp; Med-Tech
            </button>
          </div>
        </div>

        <div className="font-mono text-[11px] text-mist pr-2">
          Showing {filteredMatches.length} of {matches.length} live requisitions
        </div>
      </div>

      {/* Matches Grid */}
      <div className="space-y-4">
        {filteredMatches.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[#bcd6fa] bg-white p-12 text-center shadow-xs">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-canvas border border-[#bcd6fa]/60 text-mist">
              <Compass size={28} />
            </div>
            <h3 className="mt-4 font-display text-base font-bold text-ink">No Matching Requisitions in Flight</h3>
            <p className="mt-1.5 max-w-md mx-auto text-xs text-ink-soft leading-relaxed">
              Your profile is active in the matching engine. When enterprise clients publish sprint requisitions aligned with your verified skill domain, they will appear here for your 1-Click Pitch authorization.
            </p>
          </div>
        ) : (
          filteredMatches.map((match) => (
          <div
            key={match.id}
            className={`rounded-3xl border p-6 sm:p-7 shadow-xs transition-all ${
              match.authorized
                ? "border-signal/60 bg-white shadow-sm ring-1 ring-signal/20"
                : "border-[#bcd6fa] bg-white hover:border-electric/70 hover:shadow-sm"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#bcd6fa]/30 pb-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-electric">{match.id}</span>
                  <span className="rounded-full bg-signal/10 px-2.5 py-0.5 font-mono text-[10px] font-bold text-signal">
                    {match.matchScore}% Telemetry Overlap
                  </span>
                  <span className="rounded-full border border-[#bcd6fa] bg-canvas px-2.5 py-0.5 font-mono text-[10px] text-ink-soft">
                    {match.sector}
                  </span>
                </div>
                <h3 className="mt-1.5 font-display text-lg sm:text-xl font-bold text-ink">
                  {match.role}
                </h3>
                <div className="text-xs text-ink-soft mt-0.5">
                  Client Profile: <strong className="text-ink font-semibold">{match.clientOrgAnonymized}</strong> (Anonymized)
                </div>
              </div>

              <div className="sm:text-right">
                <div className="font-display text-lg font-extrabold text-ink">{match.compensation}</div>
                <div className="font-mono text-[11px] text-mist">{match.engagement} • {match.sprintVelocity}</div>
              </div>
            </div>

            <p className="mt-3 text-xs sm:text-sm text-ink-soft leading-relaxed">
              {match.description}
            </p>

            {/* Telemetry Details */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-3 border-t border-[#bcd6fa]/30">
              <div>
                <span className="font-mono text-[11px] text-mist uppercase tracking-wider block mb-1">
                  Required Skill Overlap:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {match.skillOverlap.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-md border border-[#bcd6fa]/60 bg-canvas px-2 py-0.5 font-mono text-[10px] font-semibold text-ink"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="font-mono text-[11px] text-mist uppercase tracking-wider block mb-1">
                  Guaranteed Standup Overlap:
                </span>
                <div className="flex items-center gap-1.5 font-mono text-xs text-ink font-semibold">
                  <Clock size={14} className="text-electric" />
                  <span>{match.timezoneOverlap}</span>
                </div>
              </div>
            </div>

            {/* Bottom 1-Click Pitch Authorization (SRS FR-059) */}
            <div className="mt-5 pt-4 border-t border-[#bcd6fa]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className={`flex h-8 w-8 items-center justify-center rounded-xl border ${
                  match.authorized ? "border-signal bg-signal/15 text-signal" : "border-mist/40 bg-canvas text-mist"
                }`}>
                  {match.authorized ? <Check size={16} /> : <Lock size={15} />}
                </div>
                <div>
                  <div className="font-display text-xs font-bold text-ink">
                    {match.authorized ? "Pitch Authorized by Candidate" : "Pitch Locked (Requires Your Approval)"}
                  </div>
                  <div className="text-[11px] text-ink-soft">
                    {match.authorized
                      ? `Permission granted on ${match.authorizedAt || "Sep 29"}. Client received your anonymized dossier.`
                      : "Client cannot view your real name, GitHub, or contact details until authorized."}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedMatchForPreview(match)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[#bcd6fa] bg-canvas/40 px-3.5 py-2 font-display text-xs font-semibold text-ink hover:bg-white transition-all cursor-pointer"
                >
                  <FileText size={14} className="text-electric" />
                  <span>Preview What Client Sees</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDeclineTarget(match)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50/50 px-3 py-2 font-display text-xs font-semibold text-rose-600 hover:bg-rose-100 transition-all cursor-pointer"
                >
                  <span>Decline</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleAuthorizePitch(match.id)}
                  className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2 font-display text-xs font-bold transition-all cursor-pointer shadow-xs ${
                    match.authorized
                      ? "border border-signal text-signal bg-signal/10 hover:bg-signal/20"
                      : "bg-ink text-white hover:bg-electric"
                  }`}
                >
                  {match.authorized ? (
                    <>
                      <Check size={14} />
                      <span>Revoke Authorization</span>
                    </>
                  ) : (
                    <>
                      <span>Authorize 1-Click Pitch</span>
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>

      {/* Decline Feedback Modal */}
      {declineTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 backdrop-blur-xs p-4 animate-in fade-in-0 duration-150">
          <div
            className="w-full max-w-md rounded-3xl border border-rose-200 bg-white p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-[#bcd6fa]/40 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
                  <AlertTriangle size={18} />
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-ink">Decline Requisition Match</h3>
                  <p className="text-xs text-ink-soft">{declineTarget.role}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDeclineTarget(null)}
                className="rounded-xl p-1 text-ink-soft hover:bg-canvas cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <p className="text-xs text-ink-soft">
              Help us tune your Reverse Search algorithm. Why does this requisition not match your current preferences?
            </p>

            <div className="space-y-2 text-xs">
              {[
                { id: "rate_too_low", label: "Compensation rate is below my target" },
                { id: "tech_stack_mismatch", label: "Tech stack or tooling mismatch" },
                { id: "timezone_incompatible", label: "Standup or timezone overlap incompatible" },
                { id: "currently_unavailable", label: "Currently engaged in another sprint" },
              ].map((reason) => (
                <label
                  key={reason.id}
                  className={`flex items-center gap-2.5 rounded-xl border p-3 cursor-pointer transition-all ${
                    declineReason === reason.id
                      ? "border-rose-300 bg-rose-50 text-ink font-semibold"
                      : "border-[#bcd6fa]/60 bg-canvas/30 text-ink-soft hover:bg-white"
                  }`}
                >
                  <input
                    type="radio"
                    name="decline_reason"
                    value={reason.id}
                    checked={declineReason === reason.id}
                    onChange={(e) => setDeclineReason(e.target.value)}
                    className="accent-rose-600"
                  />
                  <span>{reason.label}</span>
                </label>
              ))}
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#bcd6fa]/40">
              <button
                type="button"
                onClick={() => setDeclineTarget(null)}
                className="rounded-xl px-4 py-2 font-display text-xs font-semibold text-ink-soft hover:bg-canvas cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDecline}
                className="rounded-xl bg-rose-600 px-4 py-2 font-display text-xs font-bold text-white hover:bg-rose-700 transition-all cursor-pointer shadow-xs"
              >
                Confirm & Archive Match
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Anonymized Pitch Dossier Modal */}
      {selectedMatchForPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 backdrop-blur-xs p-4 animate-in fade-in-0 duration-150">
          <div
            className="w-full max-w-xl rounded-3xl border border-[#bcd6fa] bg-white p-6 sm:p-7 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto thin-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[#bcd6fa]/40 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-signal/15 px-2.5 py-0.5 text-[10px] font-mono font-bold text-signal">
                  <ShieldCheck size={13} />
                  <span>ZERO EXPOSURE ANONYMIZED DOSSIER PREVIEW</span>
                </div>
                <h3 className="font-display text-lg font-bold text-ink mt-1.5">
                  Client View: {selectedMatchForPreview.clientOrgAnonymized}
                </h3>
                <p className="text-xs text-ink-soft">
                  This is the exact tokenized dossier submitted to the client hiring manager. Your identity remains 100% private.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedMatchForPreview(null)}
                className="rounded-xl p-1.5 text-ink-soft hover:bg-canvas cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Tokenized Identity Preview Box */}
            <div className="rounded-2xl border border-electric/40 bg-gradient-to-br from-electric/5 via-canvas/30 to-white p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ink font-display text-xs font-bold text-white shadow-xs">
                    {selectedMatchForPreview.anonymizedPreview?.maskedCandidateId || "SPEC-94"}
                  </div>
                  <div>
                    <div className="font-display text-sm font-bold text-ink">
                      {selectedMatchForPreview.anonymizedPreview?.maskedCandidateId || "Specialist #AM-94"}
                    </div>
                    <div className="text-[11px] text-signal font-semibold">
                      {selectedMatchForPreview.anonymizedPreview?.verifiedPercentile || "Top 2% Globally Vetted"}
                    </div>
                  </div>
                </div>

                <span className="rounded-full bg-signal/15 border border-signal/30 px-3 py-1 text-xs font-bold text-signal">
                  Tier 1 Verified
                </span>
              </div>

              <div className="text-xs font-medium text-ink bg-white p-3 rounded-xl border border-[#bcd6fa]/50">
                {selectedMatchForPreview.anonymizedPreview?.headline || selectedMatchForPreview.role}
              </div>
            </div>

            {/* Skills Radar & Proficiencies */}
            {selectedMatchForPreview.anonymizedPreview?.vettedSkillsRadar && (
              <div className="space-y-2">
                <div className="text-xs font-bold text-ink">Verified Competency Radar:</div>
                <div className="space-y-2">
                  {selectedMatchForPreview.anonymizedPreview.vettedSkillsRadar.map((radar) => (
                    <div key={radar.skill} className="space-y-1 text-xs">
                      <div className="flex justify-between text-[11px]">
                        <span className="font-semibold text-ink">{radar.skill}</span>
                        <span className="font-bold text-electric">{radar.proficiency}% Benchmarked</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-canvas overflow-hidden border border-[#bcd6fa]/40">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-electric to-electric-bright"
                          style={{ width: `${radar.proficiency}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Anonymized Project Impacts */}
            {selectedMatchForPreview.anonymizedPreview?.anonymizedProjectImpacts && (
              <div>
                <div className="text-xs font-bold text-ink mb-1.5">Anonymized Production Impacts:</div>
                <ul className="list-disc list-inside space-y-1 text-xs text-ink-soft bg-canvas/30 p-3 rounded-xl border border-[#bcd6fa]/40">
                  {selectedMatchForPreview.anonymizedPreview.anonymizedProjectImpacts.map((bullet, idx) => (
                    <li key={idx}>{bullet}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-[#bcd6fa]/40 text-xs">
              <span className="text-mist">
                Client: <strong className="text-ink">{selectedMatchForPreview.clientOrgAnonymized}</strong>
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    handleAuthorizePitch(selectedMatchForPreview.id);
                    setSelectedMatchForPreview(null);
                  }}
                  className={`rounded-xl px-4 py-2 font-display text-xs font-bold transition-all cursor-pointer shadow-xs ${
                    selectedMatchForPreview.authorized
                      ? "border border-rose-200 text-rose-600 bg-rose-50"
                      : "bg-electric text-white hover:bg-electric-bright"
                  }`}
                >
                  {selectedMatchForPreview.authorized ? "Revoke Authorization" : "Confirm & Authorize Pitch"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
