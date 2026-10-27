"use client";

import { useState } from "react";
import {
  Compass,
  ShieldCheck,
  Check,
  Lock,
  Clock,
  Briefcase,
  Zap,
  X,
  CheckCircle,
  AlertTriangle,
  Eye,
  Users,
  ChevronRight,
  Search,
} from "@/components/ui/Icons";
import { ReverseSearchMatch } from "@/types/candidate.types";
import {
  PitchRequestItem,
  getReverseSearchMatchesAction,
  getCandidatePitchRequestsAction,
  authorizePitchAction,
} from "@/actions/matching.actions";
import { useCandidatePersona } from "@/context/CandidatePersonaContext";

interface CandidateReverseSearchViewProps {
  initialMatches?: ReverseSearchMatch[];
  initialPitchRequests?: PitchRequestItem[];
}

export function CandidateReverseSearchView({
  initialMatches = [],
  initialPitchRequests = [],
}: CandidateReverseSearchViewProps) {
  const { currentProfile } = useCandidatePersona();
  const isHealthcare = currentProfile.primaryTrack === "healthcare";

  // Tab State
  const [activeTab, setActiveTab] = useState<"matches" | "pitch_requests">("matches");
  const [pitchFilter, setPitchFilter] = useState<"all" | "pending" | "authorized" | "declined">("all");

  // Data State
  const [matches, setMatches] = useState<ReverseSearchMatch[]>(initialMatches);
  const [pitchRequests, setPitchRequests] = useState<PitchRequestItem[]>(initialPitchRequests);

  // Modals & Drawers
  const [selectedRequisitionForDrawer, setSelectedRequisitionForDrawer] = useState<{
    id: string;
    title: string;
    clientOrg: string;
    sector: string;
    level: string;
    location: string;
    engagement: string;
    rateRange: string;
    skills: string[];
    description: string;
    timezoneOverlap: string;
    workAuthFit: string;
    authorized: boolean;
    authorizedAt?: string;
  } | null>(null);

  const [pitchConsentTarget, setPitchConsentTarget] = useState<{
    id: string;
    title: string;
    clientName: string;
    isRevoke?: boolean;
    isRecruiterRequest?: boolean;
  } | null>(null);

  const [declineTarget, setDeclineTarget] = useState<{
    id: string;
    title: string;
    clientName: string;
    isRecruiterRequest?: boolean;
  } | null>(null);
  const [declineReason, setDeclineReason] = useState<string>("rate_too_low");

  const [isScanning, setIsScanning] = useState(false);
  const [isSubmittingConsent, setIsSubmittingConsent] = useState(false);
  const [lastScanned, setLastScanned] = useState("Just now");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Counts
  const pendingRequestsCount = pitchRequests.filter((r) => r.status === "requested").length;
  const authorizedRequestsCount = pitchRequests.filter((r) => r.status === "authorized").length;
  const declinedRequestsCount = pitchRequests.filter((r) => r.status === "declined").length;

  // Filtered Pitch Requests
  const filteredPitchRequests = pitchRequests.filter((item) => {
    if (pitchFilter === "pending") return item.status === "requested";
    if (pitchFilter === "authorized") return item.status === "authorized";
    if (pitchFilter === "declined") return item.status === "declined";
    return true;
  });

  // Handle Authorize Pitch via Confirmation Modal
  const handleExecuteConsent = async () => {
    if (!pitchConsentTarget) return;

    setIsSubmittingConsent(true);
    const targetId = pitchConsentTarget.id;
    const isRevoke = !!pitchConsentTarget.isRevoke;
    const desiredStatus = isRevoke ? "revoked" : "authorized";

    try {
      const res = await authorizePitchAction(targetId, desiredStatus);

      if (res.success) {
        // Update AI matches
        setMatches((prev) =>
          prev.map((m) => {
            if (m.id === targetId || m.requisition_id === targetId) {
              return {
                ...m,
                authorized: !isRevoke,
                authorizedAt: !isRevoke ? "Just now" : undefined,
                pitch_status: desiredStatus,
              };
            }
            return m;
          })
        );

        // Update pitch requests
        setPitchRequests((prev) =>
          prev.map((r) => {
            if (r.id === targetId || r.requisition_id === targetId || r.pitch_auth_id === targetId) {
              return {
                ...r,
                status: desiredStatus,
                decided_at: !isRevoke ? "Just now" : undefined,
              };
            }
            return r;
          })
        );

        // Update drawer state if open
        if (selectedRequisitionForDrawer && selectedRequisitionForDrawer.id === targetId) {
          setSelectedRequisitionForDrawer((prev) =>
            prev ? { ...prev, authorized: !isRevoke, authorizedAt: !isRevoke ? "Just now" : undefined } : null
          );
        }

        setToastMessage(
          isRevoke
            ? `Revoked pitch authorization for ${pitchConsentTarget.title}.`
            : `Pitch authorization granted for ${pitchConsentTarget.title}. Verified dossier presented under Escrow.`
        );
      } else {
        setToastMessage("Unable to update pitch authorization. Please try again.");
      }
    } catch {
      setToastMessage("An error occurred while updating authorization.");
    } finally {
      setIsSubmittingConsent(false);
      setPitchConsentTarget(null);
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  // Handle Decline
  const handleConfirmDecline = async () => {
    if (!declineTarget) return;
    const targetId = declineTarget.id;
    const targetName = declineTarget.title;

    try {
      await authorizePitchAction(targetId, "declined");

      setMatches((prev) => prev.filter((m) => m.id !== targetId && m.requisition_id !== targetId));
      setPitchRequests((prev) =>
        prev.map((r) => {
          if (r.id === targetId || r.requisition_id === targetId || r.pitch_auth_id === targetId) {
            return { ...r, status: "declined" };
          }
          return r;
        })
      );

      if (selectedRequisitionForDrawer && selectedRequisitionForDrawer.id === targetId) {
        setSelectedRequisitionForDrawer(null);
      }

      setToastMessage(`Requisition ${targetName} declined and archived from your stream.`);
    } catch {
      setToastMessage("Failed to decline requisition.");
    } finally {
      setDeclineTarget(null);
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  // Trigger Live Rescan
  const handleTriggerRescan = async () => {
    setIsScanning(true);
    const [matchesRes, pitchRes] = await Promise.all([
      getReverseSearchMatchesAction(),
      getCandidatePitchRequestsAction(),
    ]);
    setIsScanning(false);
    setLastScanned("Just now");

    if (matchesRes.success && matchesRes.data && matchesRes.data.length > 0) {
      const mapped: ReverseSearchMatch[] = matchesRes.data.map((item, idx) => ({
        id: item.id || `MATCH-BE-${idx}`,
        requisition_id: item.requisition_id || item.id,
        clientOrgAnonymized: item.company_masked || "Enterprise Client (Confidential)",
        role: item.title,
        level: item.level || "Senior",
        location: item.location || "100% Remote",
        sector: item.sector === "healthcare" ? "Healthcare & Med-Tech" : "Enterprise IT",
        matchScore: item.match_score || 95,
        skillOverlap: item.skills || ["Next.js", "TypeScript", "Node.js"],
        timezoneOverlap: item.timezone_overlap || "4h guaranteed live overlap",
        compensation: item.rate_range || "$85 - $110 / hr",
        engagement: item.engagement || "C2C Direct Sprint",
        sprintVelocity: "7-Day Sprint Ready",
        authorized: item.pitch_status === "authorized",
        authorizedAt: item.pitch_status === "authorized" ? "Verified" : undefined,
        pitch_status: item.pitch_status,
        description: item.description || "Matched based on verified skills, timezone alignment, and work authorization.",
      }));
      setMatches(mapped);
    }

    if (pitchRes.success && pitchRes.data) {
      setPitchRequests(pitchRes.data);
    }

    setToastMessage("Reverse search pipeline rescan complete. Telemetry synchronized.");
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Header & Privacy Seal */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-electric/30 bg-gradient-to-r from-ink via-[#0d1f3d] to-ink p-5 sm:p-6 lg:p-7 text-white shadow-md">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-slate-200">
              <span className={`h-2 w-2 rounded-full ${isHealthcare ? "bg-emerald-400" : "bg-electric-bright"}`} />
              <span>{isHealthcare ? "Clinical Requisition Matching" : "Enterprise IT Requisition Matching"}</span>
            </div>
            <h1 className="mt-2 font-display text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">
              Reverse Job Search Engine
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-gray-300 max-w-2xl leading-relaxed">
              AI specialized requisition matching: live client requisitions are matched to your verified profile. You retain full control to authorize your anonymized dossier before any client receives your information.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={handleTriggerRescan}
              disabled={isScanning}
              className="inline-flex items-center gap-1.5 sm:gap-2 rounded-xl bg-electric px-3.5 py-2 sm:px-4 sm:py-2.5 font-display text-xs font-semibold text-white shadow-xs transition-all hover:bg-electric-bright disabled:opacity-50 active:scale-95 cursor-pointer"
            >
              <Zap size={14} className={isScanning ? "animate-spin" : ""} />
              <span>{isScanning ? "Scanning..." : "Rescan Active Gigs"}</span>
            </button>
          </div>
        </div>

        {/* Scan Status Ribbon */}
        <div className="relative z-10 mt-5 pt-3.5 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 font-mono text-gray-300 text-[11px]">
            <Clock size={12} className="text-electric-bright shrink-0" />
            <span>Telemetry Last Synced: <strong className="text-white">{lastScanned}</strong></span>
          </div>
          <div className="font-mono text-[11px] text-gray-300 flex items-center gap-3">
            <span>AI Matches: <strong className="text-signal font-bold">{matches.length}</strong></span>
            <span>•</span>
            <span>Recruiter Requests: <strong className="text-electric-bright font-bold">{pitchRequests.length}</strong></span>
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

      {/* Toast Notification */}
      {toastMessage && (
        <div className="rounded-xl border border-signal/30 bg-signal/10 px-4 py-2.5 text-xs font-semibold text-signal flex items-center gap-2 animate-in fade-in-0 duration-200">
          <CheckCircle size={15} className="shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Primary Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#bcd6fa]/50 pb-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("matches")}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 font-display text-xs font-bold transition-all cursor-pointer ${
              activeTab === "matches"
                ? "bg-ink text-white shadow-xs"
                : "border border-[#bcd6fa] bg-white text-ink-soft hover:bg-canvas/50 hover:text-ink"
            }`}
          >
            <Zap size={14} className={activeTab === "matches" ? "text-electric-bright" : "text-mist"} />
            <span>AI Matched Requisitions</span>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-mono ${
              activeTab === "matches" ? "bg-white/20 text-white" : "bg-canvas text-ink-soft"
            }`}>
              {matches.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("pitch_requests")}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 font-display text-xs font-bold transition-all cursor-pointer relative ${
              activeTab === "pitch_requests"
                ? "bg-ink text-white shadow-xs"
                : "border border-[#bcd6fa] bg-white text-ink-soft hover:bg-canvas/50 hover:text-ink"
            }`}
          >
            <Users size={14} className={activeTab === "pitch_requests" ? "text-electric-bright" : "text-mist"} />
            <span>Recruiter Pitch Requests</span>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-mono ${
              activeTab === "pitch_requests" ? "bg-white/20 text-white" : "bg-canvas text-ink-soft"
            }`}>
              {pitchRequests.length}
            </span>
            {pendingRequestsCount > 0 && (
              <span className="flex h-2 w-2 rounded-full bg-amber-400 ring-2 ring-white" />
            )}
          </button>
        </div>

        <div className="font-mono text-[11px] text-mist">
          {activeTab === "matches"
            ? `${matches.length} live public requisitions compatible`
            : `${pitchRequests.length} recruiter authorizations tracked`}
        </div>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: AI MATCHED REQUISITIONS */}
      {/* ============================================================== */}
      {activeTab === "matches" && (
        <div className="space-y-4">
          {matches.length === 0 ? (
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
            matches.map((match) => (
              <div
                key={match.id}
                className={`rounded-3xl border p-5 sm:p-6 shadow-xs transition-all ${
                  match.authorized
                    ? "border-signal/60 bg-white ring-1 ring-signal/20 shadow-xs"
                    : "border-[#bcd6fa] bg-white hover:border-electric/70 hover:shadow-xs"
                }`}
              >
                {/* Card Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#bcd6fa]/30 pb-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-electric">
                        {match.id.length > 16 ? match.id.slice(0, 8) : match.id}
                      </span>
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

                <p className="mt-3 text-xs sm:text-sm text-ink-soft leading-relaxed line-clamp-2">
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

                {/* Card Bottom Actions */}
                <div className="mt-5 pt-4 border-t border-[#bcd6fa]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border ${
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
                          ? "Permission granted. Client received your anonymized dossier."
                          : "Client cannot view your real name, GitHub, or contact details until authorized."}
                      </div>
                    </div>
                  </div>

                  {/* Clean, well-proportioned action buttons */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedRequisitionForDrawer({
                          id: match.id,
                          title: match.role,
                          clientOrg: match.clientOrgAnonymized,
                          sector: match.sector,
                          level: match.level || "Senior",
                          location: match.location || "100% Remote",
                          engagement: match.engagement,
                          rateRange: match.compensation,
                          skills: match.skillOverlap,
                          description: match.description,
                          timezoneOverlap: match.timezoneOverlap,
                          workAuthFit: "Eligible for C2C / W2 Direct placement",
                          authorized: match.authorized,
                          authorizedAt: match.authorizedAt,
                        })
                      }
                      className="inline-flex items-center gap-1.5 rounded-xl border border-[#bcd6fa] bg-canvas/40 px-3.5 py-2 font-display text-xs font-semibold text-ink hover:bg-white hover:border-electric/50 transition-all cursor-pointer"
                    >
                      <Eye size={14} className="text-electric" />
                      <span>View Requisition</span>
                    </button>

                    {!match.authorized && (
                      <button
                        type="button"
                        onClick={() =>
                          setDeclineTarget({
                            id: match.id,
                            title: match.role,
                            clientName: match.clientOrgAnonymized,
                          })
                        }
                        className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50/50 px-3 py-2 font-display text-xs font-semibold text-rose-600 hover:bg-rose-100 transition-all cursor-pointer"
                      >
                        <X size={13} />
                        <span>Decline</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        setPitchConsentTarget({
                          id: match.id,
                          title: match.role,
                          clientName: match.clientOrgAnonymized,
                          isRevoke: match.authorized,
                        })
                      }
                      className={`inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2 font-display text-xs font-bold transition-all cursor-pointer shadow-xs ${
                        match.authorized
                          ? "border border-signal text-signal bg-signal/10 hover:bg-signal/20"
                          : "bg-electric text-white hover:bg-electric-bright"
                      }`}
                    >
                      {match.authorized ? (
                        <>
                          <Check size={14} />
                          <span>Pitch Authorized</span>
                        </>
                      ) : (
                        <>
                          <Zap size={14} />
                          <span>Authorize & Apply</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: RECRUITER PITCH REQUESTS (DEDICATED SECTION) */}
      {/* ============================================================== */}
      {activeTab === "pitch_requests" && (
        <div className="space-y-5">
          {/* Section Introduction Banner */}
          <div className="rounded-2xl border border-electric/30 bg-gradient-to-r from-electric/5 via-canvas to-white p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-electric/15 text-electric">
                <Users size={20} />
              </div>
              <div>
                <h2 className="font-display text-sm sm:text-base font-bold text-ink">
                  Recruiter Pitch Authorizations
                </h2>
                <p className="mt-0.5 text-xs text-ink-soft leading-relaxed max-w-2xl">
                  Pepoltek executive recruiters hand-selected your verified profile for these client requisitions. Review the recruiter's note and requisition scope below. Authorize your pitch to present your dossier to the client, or decline if it does not fit your sprint schedule.
                </p>
              </div>
            </div>

            {/* Sub-Filters */}
            <div className="flex items-center gap-1.5 shrink-0 bg-white p-1 rounded-xl border border-[#bcd6fa]/60">
              <button
                type="button"
                onClick={() => setPitchFilter("all")}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer ${
                  pitchFilter === "all" ? "bg-ink text-white" : "text-ink-soft hover:text-ink"
                }`}
              >
                All ({pitchRequests.length})
              </button>
              <button
                type="button"
                onClick={() => setPitchFilter("pending")}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer ${
                  pitchFilter === "pending" ? "bg-amber-500 text-white" : "text-ink-soft hover:text-ink"
                }`}
              >
                Pending ({pendingRequestsCount})
              </button>
              <button
                type="button"
                onClick={() => setPitchFilter("authorized")}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer ${
                  pitchFilter === "authorized" ? "bg-signal text-white" : "text-ink-soft hover:text-ink"
                }`}
              >
                Authorized ({authorizedRequestsCount})
              </button>
              <button
                type="button"
                onClick={() => setPitchFilter("declined")}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer ${
                  pitchFilter === "declined" ? "bg-rose-500 text-white" : "text-ink-soft hover:text-ink"
                }`}
              >
                Declined ({declinedRequestsCount})
              </button>
            </div>
          </div>

          {/* List of Recruiter Sourced Requests */}
          {filteredPitchRequests.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-[#bcd6fa] bg-white p-12 text-center shadow-xs">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-canvas border border-[#bcd6fa]/60 text-mist">
                <Briefcase size={28} />
              </div>
              <h3 className="mt-4 font-display text-base font-bold text-ink">
                {pitchFilter === "all"
                  ? "No Recruiter Pitch Requests Yet"
                  : `No ${pitchFilter} pitch requests found`}
              </h3>
              <p className="mt-1.5 max-w-md mx-auto text-xs text-ink-soft leading-relaxed">
                When recruiters source your profile directly from the verified talent pool, their authorization requests and sourcing pitches will be displayed in this workstation.
              </p>
            </div>
          ) : (
            filteredPitchRequests.map((req) => {
              const isPending = req.status === "requested";
              const isAuthorized = req.status === "authorized";
              const isDeclined = req.status === "declined";

              return (
                <div
                  key={req.id}
                  className={`rounded-3xl border p-5 sm:p-6 shadow-xs transition-all ${
                    isPending
                      ? "border-amber-300 bg-white ring-1 ring-amber-200/50"
                      : isAuthorized
                      ? "border-signal/50 bg-white ring-1 ring-signal/15"
                      : "border-[#bcd6fa] bg-white/80"
                  }`}
                >
                  {/* Top Status Strip */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-[#bcd6fa]/30 pb-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-electric/10 px-2.5 py-0.5 font-display text-[11px] font-bold text-electric">
                        <Users size={12} />
                        <span>Recruiter Sourced Request</span>
                      </span>

                      {isPending && (
                        <span className="rounded-full bg-amber-100 border border-amber-300 px-2.5 py-0.5 font-mono text-[10px] font-bold text-amber-800 flex items-center gap-1">
                          <AlertTriangle size={11} />
                          <span>Action Required: Authorization Requested</span>
                        </span>
                      )}
                      {isAuthorized && (
                        <span className="rounded-full bg-signal/15 border border-signal/30 px-2.5 py-0.5 font-mono text-[10px] font-bold text-signal flex items-center gap-1">
                          <CheckCircle size={11} />
                          <span>Pitch Authorized</span>
                        </span>
                      )}
                      {isDeclined && (
                        <span className="rounded-full bg-rose-100 border border-rose-200 px-2.5 py-0.5 font-mono text-[10px] font-bold text-rose-700 flex items-center gap-1">
                          <X size={11} />
                          <span>Declined</span>
                        </span>
                      )}
                    </div>

                    <div className="font-mono text-[11px] text-mist">
                      Requested: <strong className="text-ink">{req.requested_at}</strong>
                    </div>
                  </div>

                  {/* Role Title & Compensation */}
                  <div className="mt-3 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div>
                      <h3 className="font-display text-lg sm:text-xl font-bold text-ink">
                        {req.title}
                      </h3>
                      <div className="text-xs text-ink-soft mt-0.5">
                        Client Partner: <strong className="text-ink font-semibold">{req.company_masked}</strong> • {req.sector}
                      </div>
                    </div>

                    <div className="sm:text-right shrink-0">
                      <div className="font-display text-lg font-extrabold text-ink">{req.rate_range}</div>
                      <div className="font-mono text-[11px] text-mist">{req.engagement} • {req.location}</div>
                    </div>
                  </div>

                  {/* Recruiter Sourcing Note Box */}
                  <div className="mt-3.5 rounded-2xl border border-electric/30 bg-canvas/50 p-3.5 text-xs">
                    <div className="font-display text-[11px] font-bold text-electric uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <Briefcase size={12} />
                      <span>Recruiter Pitch Note & Sourcing Rationale</span>
                    </div>
                    <p className="text-ink-soft italic leading-relaxed">
                      "{req.sourcing_note}"
                    </p>
                  </div>

                  {/* Skills tags */}
                  <div className="mt-3.5 flex flex-wrap items-center gap-1.5">
                    <span className="font-mono text-[11px] text-mist mr-1">Required Skills:</span>
                    {req.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-md border border-[#bcd6fa]/60 bg-white px-2 py-0.5 font-mono text-[10px] font-semibold text-ink"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="mt-5 pt-4 border-t border-[#bcd6fa]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="text-xs text-ink-soft flex items-center gap-1.5">
                      <ShieldCheck size={14} className="text-signal shrink-0" />
                      <span>Client receives zero personal contact details without your explicit consent.</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedRequisitionForDrawer({
                            id: req.requisition_id || req.id,
                            title: req.title,
                            clientOrg: req.company_masked,
                            sector: req.sector,
                            level: req.level,
                            location: req.location,
                            engagement: req.engagement,
                            rateRange: req.rate_range,
                            skills: req.skills,
                            description: req.description,
                            timezoneOverlap: req.timezone_overlap,
                            workAuthFit: req.work_auth_fit,
                            authorized: isAuthorized,
                            authorizedAt: req.decided_at || undefined,
                          })
                        }
                        className="inline-flex items-center gap-1.5 rounded-xl border border-[#bcd6fa] bg-canvas/40 px-3.5 py-2 font-display text-xs font-semibold text-ink hover:bg-white hover:border-electric/50 transition-all cursor-pointer"
                      >
                        <Eye size={14} className="text-electric" />
                        <span>View Requisition</span>
                      </button>

                      {isPending && (
                        <>
                          <button
                            type="button"
                            onClick={() =>
                              setDeclineTarget({
                                id: req.id,
                                title: req.title,
                                clientName: req.company_masked,
                                isRecruiterRequest: true,
                              })
                            }
                            className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50/50 px-3 py-2 font-display text-xs font-semibold text-rose-600 hover:bg-rose-100 transition-all cursor-pointer"
                          >
                            <X size={13} />
                            <span>Decline</span>
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              setPitchConsentTarget({
                                id: req.id,
                                title: req.title,
                                clientName: req.company_masked,
                                isRevoke: false,
                                isRecruiterRequest: true,
                              })
                            }
                            className="inline-flex items-center gap-1.5 rounded-xl bg-electric px-4 py-2 font-display text-xs font-bold text-white hover:bg-electric-bright transition-all cursor-pointer shadow-xs"
                          >
                            <Zap size={14} />
                            <span>Accept & Authorize</span>
                          </button>
                        </>
                      )}

                      {isAuthorized && (
                        <button
                          type="button"
                          onClick={() =>
                            setPitchConsentTarget({
                              id: req.id,
                              title: req.title,
                              clientName: req.company_masked,
                              isRevoke: true,
                              isRecruiterRequest: true,
                            })
                          }
                          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 font-display text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
                        >
                          <span>Revoke Authorization</span>
                        </button>
                      )}

                      {isDeclined && (
                        <button
                          type="button"
                          onClick={() =>
                            setPitchConsentTarget({
                              id: req.id,
                              title: req.title,
                              clientName: req.company_masked,
                              isRevoke: false,
                              isRecruiterRequest: true,
                            })
                          }
                          className="inline-flex items-center gap-1.5 rounded-xl border border-electric/40 bg-white px-3 py-2 font-display text-xs font-semibold text-electric hover:bg-canvas transition-all cursor-pointer"
                        >
                          <Zap size={13} />
                          <span>Re-Authorize Pitch</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* AUTHORIZE PITCH CONFIRMATION ALERT MODAL */}
      {/* ============================================================== */}
      {pitchConsentTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 backdrop-blur-xs p-4 animate-in fade-in-0 duration-150">
          <div
            className="w-full max-w-lg rounded-3xl border border-[#bcd6fa] bg-white p-6 sm:p-7 shadow-2xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[#bcd6fa]/40 pb-4">
              <div className="flex items-center gap-3">
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                  pitchConsentTarget.isRevoke
                    ? "bg-rose-100 text-rose-600"
                    : "bg-electric/15 text-electric"
                }`}>
                  {pitchConsentTarget.isRevoke ? <AlertTriangle size={22} /> : <ShieldCheck size={22} />}
                </div>
                <div>
                  <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-electric">
                    Pepoltek Verified Escrow Dispatch
                  </div>
                  <h3 className="font-display text-lg font-bold text-ink">
                    {pitchConsentTarget.isRevoke
                      ? "Revoke Pitch Authorization"
                      : "Authorize Client Pitch Submission"}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setPitchConsentTarget(null)}
                className="rounded-xl p-1.5 text-ink-soft hover:bg-canvas cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Target Requisition Context */}
            <div className="rounded-2xl border border-[#bcd6fa]/50 bg-canvas/40 p-3.5 space-y-1">
              <div className="text-xs font-bold text-ink">{pitchConsentTarget.title}</div>
              <div className="text-[11px] text-ink-soft">
                Target Enterprise Client: <strong className="text-ink">{pitchConsentTarget.clientName}</strong>
              </div>
            </div>

            {/* Professional Consent Statement */}
            {!pitchConsentTarget.isRevoke ? (
              <div className="space-y-3 text-xs leading-relaxed text-ink-soft">
                <p>
                  You authorize <strong>Pepoltek Limited</strong> to securely present your verified technical profile, vetting assessment scores, and credentials to <strong>{pitchConsentTarget.clientName}</strong> for this requisition.
                </p>

                <div className="rounded-2xl border border-signal/30 bg-signal/10 p-3.5 space-y-1 text-signal">
                  <div className="font-display text-xs font-bold flex items-center gap-1.5">
                    <ShieldCheck size={14} />
                    <span>Escrow Data Protection Active</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-signal/90">
                    Your personal contact credentials (phone number, private email, street address) remain strictly encrypted and withheld under Pepoltek Escrow until mutual interview confirmation.
                  </p>
                </div>

                <p className="text-[11px] text-mist">
                  Zero unsolicited outreach. You will be alerted instantly via sprint messages when the client requests an interview sprint.
                </p>
              </div>
            ) : (
              <div className="space-y-3 text-xs leading-relaxed text-ink-soft">
                <p>
                  Are you sure you want to revoke your pitch authorization for <strong>{pitchConsentTarget.clientName}</strong>?
                </p>
                <p className="text-rose-600 font-medium">
                  The client hiring team will no longer be able to advance your profile in this requisition pipeline.
                </p>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#bcd6fa]/40">
              <button
                type="button"
                onClick={() => setPitchConsentTarget(null)}
                disabled={isSubmittingConsent}
                className="rounded-xl px-4 py-2.5 font-display text-xs font-semibold text-ink-soft hover:bg-canvas cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleExecuteConsent}
                disabled={isSubmittingConsent}
                className={`inline-flex items-center gap-1.5 rounded-xl px-5 py-2.5 font-display text-xs font-bold text-white transition-all cursor-pointer shadow-xs ${
                  pitchConsentTarget.isRevoke
                    ? "bg-rose-600 hover:bg-rose-700"
                    : "bg-electric hover:bg-electric-bright"
                }`}
              >
                {isSubmittingConsent ? (
                  <span>Processing...</span>
                ) : pitchConsentTarget.isRevoke ? (
                  <span>Confirm Revocation</span>
                ) : (
                  <>
                    <Zap size={14} />
                    <span>Accept & Authorize Pitch</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* REQUISITION DETAILS SLIDE-OVER SHEET DRAWER (RIGHT-SIDE SHEET) */}
      {/* ============================================================== */}
      {selectedRequisitionForDrawer && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-ink/50 backdrop-blur-xs transition-opacity animate-in fade-in-0 duration-200"
            onClick={() => setSelectedRequisitionForDrawer(null)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-xl bg-white shadow-2xl border-l border-[#bcd6fa] flex flex-col animate-in slide-in-from-right duration-200">
              {/* Drawer Header */}
              <div className="p-6 border-b border-[#bcd6fa]/40 flex items-start justify-between bg-canvas/30">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-electric">
                      {selectedRequisitionForDrawer.id.length > 16
                        ? selectedRequisitionForDrawer.id.slice(0, 8)
                        : selectedRequisitionForDrawer.id}
                    </span>
                    <span className="rounded-full border border-[#bcd6fa] bg-white px-2.5 py-0.5 font-mono text-[10px] text-ink-soft">
                      {selectedRequisitionForDrawer.sector}
                    </span>
                    {selectedRequisitionForDrawer.authorized && (
                      <span className="rounded-full bg-signal/15 border border-signal/30 px-2 py-0.5 font-mono text-[10px] font-bold text-signal">
                        Pitch Authorized
                      </span>
                    )}
                  </div>
                  <h2 className="font-display text-xl font-bold text-ink mt-1.5">
                    {selectedRequisitionForDrawer.title}
                  </h2>
                  <div className="text-xs text-ink-soft mt-0.5">
                    Client: <strong className="text-ink font-semibold">{selectedRequisitionForDrawer.clientOrg}</strong>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedRequisitionForDrawer(null)}
                  className="rounded-xl p-2 text-ink-soft hover:bg-canvas cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto thin-scrollbar p-6 space-y-6">
                {/* Meta Highlights */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-[#bcd6fa]/50 bg-canvas/40 p-3.5">
                    <span className="font-mono text-[10px] text-mist uppercase tracking-wider block">Compensation:</span>
                    <span className="font-display text-base font-extrabold text-ink mt-0.5 block">
                      {selectedRequisitionForDrawer.rateRange}
                    </span>
                  </div>
                  <div className="rounded-2xl border border-[#bcd6fa]/50 bg-canvas/40 p-3.5">
                    <span className="font-mono text-[10px] text-mist uppercase tracking-wider block">Engagement:</span>
                    <span className="font-display text-xs font-bold text-ink mt-0.5 block">
                      {selectedRequisitionForDrawer.engagement}
                    </span>
                  </div>
                  <div className="rounded-2xl border border-[#bcd6fa]/50 bg-canvas/40 p-3.5">
                    <span className="font-mono text-[10px] text-mist uppercase tracking-wider block">Location:</span>
                    <span className="font-display text-xs font-bold text-ink mt-0.5 block">
                      {selectedRequisitionForDrawer.location}
                    </span>
                  </div>
                  <div className="rounded-2xl border border-[#bcd6fa]/50 bg-canvas/40 p-3.5">
                    <span className="font-mono text-[10px] text-mist uppercase tracking-wider block">Seniority:</span>
                    <span className="font-display text-xs font-bold text-ink mt-0.5 block">
                      {selectedRequisitionForDrawer.level}
                    </span>
                  </div>
                </div>

                {/* Scope & Description */}
                <div>
                  <h3 className="font-display text-xs font-bold uppercase tracking-wider text-ink mb-2">
                    Requisition Overview & Scope
                  </h3>
                  <div className="rounded-2xl border border-[#bcd6fa]/50 bg-white p-4 text-xs text-ink-soft leading-relaxed space-y-2">
                    <p>{selectedRequisitionForDrawer.description}</p>
                    <p>
                      This sprint engagement requires high technical ownership, proactive communication in standup cycles, and verified proficiency with enterprise continuous integration standards.
                    </p>
                  </div>
                </div>

                {/* Skills Radar */}
                <div>
                  <h3 className="font-display text-xs font-bold uppercase tracking-wider text-ink mb-2">
                    Required Core Competencies
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedRequisitionForDrawer.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-xl border border-[#bcd6fa] bg-canvas px-3 py-1 font-mono text-xs font-semibold text-ink"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Working Arrangement */}
                <div>
                  <h3 className="font-display text-xs font-bold uppercase tracking-wider text-ink mb-2">
                    Working Arrangement & Timezone
                  </h3>
                  <div className="space-y-2 text-xs text-ink-soft rounded-2xl border border-[#bcd6fa]/50 p-4 bg-canvas/20">
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-electric shrink-0" />
                      <span>Standup Overlap: <strong className="text-ink">{selectedRequisitionForDrawer.timezoneOverlap}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={14} className="text-signal shrink-0" />
                      <span>Authorization Fit: <strong className="text-ink">{selectedRequisitionForDrawer.workAuthFit}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Escrow Seal Box */}
                <div className="rounded-2xl border border-signal/30 bg-signal/10 p-4 text-xs text-signal space-y-1">
                  <div className="font-display font-bold flex items-center gap-1.5">
                    <ShieldCheck size={15} />
                    <span>Candidate Escrow Guarantee</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-signal/90">
                    Your contact details (phone, email, real location) remain confidential. The enterprise client only receives your anonymized dossier once you authorize a 1-Click Pitch.
                  </p>
                </div>
              </div>

              {/* Drawer Footer Actions */}
              <div className="p-4 sm:p-5 border-t border-[#bcd6fa]/40 bg-white flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedRequisitionForDrawer(null)}
                  className="rounded-xl px-4 py-2.5 font-display text-xs font-semibold text-ink-soft hover:bg-canvas cursor-pointer"
                >
                  Close
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const req = selectedRequisitionForDrawer;
                    setPitchConsentTarget({
                      id: req.id,
                      title: req.title,
                      clientName: req.clientOrg,
                      isRevoke: req.authorized,
                    });
                  }}
                  className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 font-display text-xs font-bold transition-all cursor-pointer shadow-xs ${
                    selectedRequisitionForDrawer.authorized
                      ? "border border-signal text-signal bg-signal/10 hover:bg-signal/20"
                      : "bg-electric text-white hover:bg-electric-bright"
                  }`}
                >
                  {selectedRequisitionForDrawer.authorized ? (
                    <>
                      <Check size={15} />
                      <span>Pitch Authorized</span>
                    </>
                  ) : (
                    <>
                      <Zap size={15} />
                      <span>Authorize & Apply</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* DECLINE FEEDBACK MODAL */}
      {/* ============================================================== */}
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
                  <h3 className="font-display text-base font-bold text-ink">Decline Requisition</h3>
                  <p className="text-xs text-ink-soft">{declineTarget.title}</p>
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
              Help us tune your Reverse Search algorithm. Why does this requisition not match your preferences?
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
                Confirm & Archive
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
