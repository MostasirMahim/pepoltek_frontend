"use client";

import React, { useState, useMemo, useTransition } from "react";
import Link from "next/link";
import {
  DollarSign,
  Users,
  Briefcase,
  CheckCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  Zap,
  Search,
} from "@/components/ui/Icons";
import {
  RecruiterReferralsData,
  RecruiterReferralRecord,
  updateRecruiterReferralAction,
} from "@/actions/recruiter.actions";

interface RecruiterReferralsViewProps {
  initialData: RecruiterReferralsData | null;
}

export function RecruiterReferralsView({ initialData }: RecruiterReferralsViewProps) {
  const [data, setData] = useState<RecruiterReferralsData | null>(initialData);
  const [searchQuery, setSearchQuery] = useState("");
  const [stageFilter, setStageFilter] = useState("all");
  const [sectorFilter, setSectorFilter] = useState("all");

  // Selected referral for Right-Side Slide-Over Sheet Drawer
  const [selectedReferral, setSelectedReferral] = useState<RecruiterReferralRecord | null>(null);
  const [selectedReqId, setSelectedReqId] = useState<string>("");
  const [customBounty, setCustomBounty] = useState<string>("");
  const [evaluationNote, setEvaluationNote] = useState<string>("");

  const [isPending, startTransition] = useTransition();
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // Telemetry values
  const telemetry = data?.telemetry || {
    total_referrals: 0,
    active_in_pipeline: 0,
    placed_specialists: 0,
    total_bounties_usd: 0,
    stage_counts: {},
  };

  const records = data?.records || [];
  const availableRequisitions: Array<{
    id: string;
    title: string;
    client_name: string;
    sector?: string;
    bounty_enabled?: boolean;
    bounty_type_id?: string | null;
    bounty_type_name?: string | null;
    bounty_amount?: number;
    headcount?: number;
  }> = data?.available_requisitions || data?.available_pods || [];

  // Filtered records
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      // Stage match
      if (stageFilter !== "all" && r.stage.toLowerCase() !== stageFilter.toLowerCase()) {
        return false;
      }
      // Sector match
      if (sectorFilter !== "all" && r.sector.toLowerCase() !== sectorFilter.toLowerCase()) {
        return false;
      }
      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const candMatch = r.candidate_name.toLowerCase().includes(q) || r.candidate_email.toLowerCase().includes(q);
        const refMatch = r.referrer.name.toLowerCase().includes(q) || r.referrer.email.toLowerCase().includes(q) || r.referrer.referral_code.toLowerCase().includes(q);
        const reqMatch = r.requisition_title.toLowerCase().includes(q);
        if (!candMatch && !refMatch && !reqMatch) return false;
      }
      return true;
    });
  }, [records, stageFilter, sectorFilter, searchQuery]);

  const handleOpenDrawer = (ref: RecruiterReferralRecord) => {
    setSelectedReferral(ref);
    setSelectedReqId(ref.requisition_id || "");
    setCustomBounty(String(ref.bounty_amount || 1500));
    setEvaluationNote("");
    setActionSuccess(null);
    setActionError(null);
  };

  const handleCloseDrawer = () => {
    setSelectedReferral(null);
    setActionSuccess(null);
    setActionError(null);
  };

  const handleUpdateStage = (targetStage: string) => {
    if (!selectedReferral) return;

    setActionError(null);
    setActionSuccess(null);

    const bountyNum = parseFloat(customBounty) || selectedReferral.bounty_amount || 1500;

    startTransition(async () => {
      const res = await updateRecruiterReferralAction({
        referralId: selectedReferral.raw_id,
        stage: targetStage,
        requisitionId: selectedReqId || undefined,
        bountyAmount: targetStage === "placed" ? bountyNum : undefined,
        note: evaluationNote.trim() || undefined,
      });

      if (res.success && res.data) {
        setActionSuccess(`Referral successfully transitioned to ${targetStage.toUpperCase()}.`);

        // Optimistically update local state
        const updatedReqTitle = availableRequisitions.find((p) => p.id === selectedReqId)?.title || selectedReferral.requisition_title;
        const updatedRecord: RecruiterReferralRecord = {
          ...selectedReferral,
          stage: targetStage,
          stage_display: targetStage === "placed" ? "Placed & Integrated" : targetStage.charAt(0).toUpperCase() + targetStage.slice(1),
          requisition_id: selectedReqId || selectedReferral.requisition_id,
          requisition_title: updatedReqTitle,
          bounty_amount: bountyNum,
          bounty_status: targetStage === "placed" ? "pending" : selectedReferral.bounty_status,
          bounty_status_display: targetStage === "placed" ? "Pending Escrow Approval" : selectedReferral.bounty_status_display,
        };

        setSelectedReferral(updatedRecord);
        setData((prev) => {
          if (!prev) return prev;
          const nextRecords = prev.records.map((r) => (r.raw_id === updatedRecord.raw_id ? updatedRecord : r));
          return {
            ...prev,
            records: nextRecords,
          };
        });
      } else {
        setActionError(res.error || "Failed to update referral stage.");
      }
    });
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Top Header & Overview */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-3xl border border-[#bcd6fa] bg-white p-6 sm:p-8 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-electric/30 bg-electric/10 px-3 py-0.5 text-[11px] font-mono font-semibold text-electric uppercase tracking-widest">
            <span className="h-2 w-2 rounded-full bg-signal animate-pulse" />
            <span>COMMUNITY SOURCING • REFERRAL MANAGEMENT</span>
          </div>
          <h1 className="mt-2 font-display text-2xl sm:text-3xl font-bold tracking-tight text-ink">
            Referral &amp; Bounty Network Operations
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-ink-soft">
            Review community-referred talent, fast-track high-signal candidates into active requisitions, and verify placement milestone bounties.
          </p>
        </div>

        <div className="flex shrink-0 gap-2.5">
          <Link
            href="/recruiter/requisitions"
            className="rounded-xl border border-[#bcd6fa] bg-canvas/40 px-4 py-2.5 font-display text-xs font-semibold text-ink hover:bg-white transition-colors"
          >
            Manage Requisitions
          </Link>
          <Link
            href="/recruiter/candidates"
            className="rounded-xl bg-ink px-4 py-2.5 font-display text-xs font-semibold text-white shadow-xs hover:bg-electric transition-colors"
          >
            Vetted Talent Pool
          </Link>
        </div>
      </div>

      {/* Telemetry Metrics Bar */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <div className="rounded-2xl border border-[#bcd6fa] bg-white p-5 shadow-xs">
          <div className="font-mono text-[11px] text-mist uppercase tracking-wider">Total Referred Specialists</div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-display text-3xl font-bold text-ink">{telemetry.total_referrals}</span>
            <span className="text-[11px] font-semibold text-electric">Candidates</span>
          </div>
          <div className="mt-2 text-[10px] text-ink-soft">Tracked across all sectors</div>
        </div>

        <div className="rounded-2xl border border-[#bcd6fa] bg-white p-5 shadow-xs">
          <div className="font-mono text-[11px] text-mist uppercase tracking-wider">Active In Pipeline</div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-display text-3xl font-bold text-cyan-600">{telemetry.active_in_pipeline}</span>
            <span className="text-[11px] font-semibold text-cyan-600">In Review</span>
          </div>
          <div className="mt-2 text-[10px] text-ink-soft">Screening &amp; Technical Interview</div>
        </div>

        <div className="rounded-2xl border border-[#bcd6fa] bg-white p-5 shadow-xs">
          <div className="font-mono text-[11px] text-mist uppercase tracking-wider">Placed &amp; Integrated</div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-display text-3xl font-bold text-signal">{telemetry.placed_specialists}</span>
            <span className="text-[11px] font-semibold text-signal">Successful</span>
          </div>
          <div className="mt-2 text-[10px] text-signal font-semibold">90-Day Guarantee Active</div>
        </div>

        <div className="rounded-2xl border border-[#bcd6fa] bg-white p-5 shadow-xs">
          <div className="font-mono text-[11px] text-mist uppercase tracking-wider">Bounties Unlocked</div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-display text-3xl font-bold text-ink">${telemetry.total_bounties_usd.toLocaleString()}</span>
            <span className="text-xs font-mono text-mist">USD</span>
          </div>
          <div className="mt-2 text-[10px] text-ink-soft">Escrow-backed community rewards</div>
        </div>

        <div className="col-span-2 lg:col-span-1 rounded-2xl border border-electric/40 bg-gradient-to-br from-[#0c1a33] to-[#081224] p-5 text-white shadow-xs">
          <div className="font-mono text-[11px] text-electric-bright uppercase tracking-wider flex items-center gap-1.5">
            <Zap size={13} className="text-signal" />
            <span>Open Requisition Bounties</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-display text-3xl font-bold text-white">{availableRequisitions.length}</span>
            <span className="text-[11px] font-mono text-cyan-300">Ready Requisitions</span>
          </div>
          <div className="mt-2 text-[10px] text-gray-300 font-mono">Up to $1,500 bounty per placement</div>
        </div>
      </div>

      {/* Search & Filtering Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-[#bcd6fa] bg-white p-4 shadow-xs">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mist" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search candidate, referrer name, email, or code..."
            className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/40 pl-9 pr-4 py-2 text-xs text-ink placeholder:text-mist focus:border-electric focus:bg-white focus:outline-hidden transition-all"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Stage Tabs */}
          <div className="flex items-center rounded-xl bg-canvas p-1 border border-[#bcd6fa]/50 font-medium">
            {[
              { id: "all", label: "All" },
              { id: "submitted", label: "Submitted" },
              { id: "screened", label: "Screened" },
              { id: "interviewed", label: "Interviewed" },
              { id: "placed", label: "Placed" },
              { id: "rejected", label: "Rejected" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStageFilter(tab.id)}
                className={`rounded-lg px-2.5 py-1 transition-all cursor-pointer ${
                  stageFilter === tab.id
                    ? "bg-white text-ink font-bold shadow-xs border border-[#bcd6fa]/50"
                    : "text-ink-soft hover:text-ink"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Sector Selector */}
          <select
            value={sectorFilter}
            onChange={(e) => setSectorFilter(e.target.value)}
            className="rounded-xl border border-[#bcd6fa] bg-white px-3 py-1.5 font-medium text-ink text-xs focus:border-electric focus:outline-hidden"
          >
            <option value="all">All Sectors</option>
            <option value="technology">Technology</option>
            <option value="healthcare">Healthcare</option>
          </select>
        </div>
      </div>

      {/* Referral Records List */}
      <div className="rounded-3xl border border-[#bcd6fa] bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#bcd6fa]/40 pb-4">
          <div>
            <h2 className="font-display text-lg font-bold text-ink">Referred Specialist Candidates</h2>
            <p className="text-xs text-ink-soft">
              Showing {filteredRecords.length} of {records.length} total referrals
            </p>
          </div>
          <span className="font-mono text-xs text-mist">
            Attribution Window: 90-Day Cookie
          </span>
        </div>

        {filteredRecords.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#bcd6fa] bg-canvas/30 p-12 text-center text-ink-soft">
            <div className="font-display text-base font-bold text-ink">No Candidate Referrals Found</div>
            <p className="text-xs text-mist mt-1 max-w-sm mx-auto">
              No referrals match the current stage and search criteria. Try adjusting your filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredRecords.map((ref) => {
              const isPlaced = ref.stage.toLowerCase() === "placed";
              const isInterview = ref.stage.toLowerCase() === "interviewed";
              const isScreened = ref.stage.toLowerCase() === "screened";

              return (
                <div
                  key={ref.raw_id}
                  className="group relative overflow-hidden rounded-2xl border border-[#bcd6fa] bg-white p-5 shadow-xs hover:border-electric hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Top Badges */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold text-electric bg-electric/10 px-2 py-0.5 rounded-md border border-electric/20">
                          {ref.id}
                        </span>
                        <span
                          className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider ${
                            isPlaced
                              ? "bg-signal/15 text-signal border border-signal/30"
                              : isInterview
                              ? "bg-cyan-50 text-cyan-700 border border-cyan-200"
                              : isScreened
                              ? "bg-blue-50 text-blue-700 border border-blue-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}
                        >
                          {ref.stage_display}
                        </span>
                        <span className="font-mono text-[9.5px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                          {ref.referral_scope === "specific_job" ? "Specific Job" : "General Invite"}
                        </span>
                        {ref.bounty_locked && (
                          <span className="font-mono text-[9.5px] px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                            Bounty Locked
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1 text-[11px] font-mono font-bold text-emerald-800 border border-emerald-200">
                        <DollarSign size={12} className="text-emerald-600" />
                        <span>{ref.bounty_type_name ? `${ref.bounty_type_name}: ` : ""}${ref.bounty_amount.toLocaleString()} Bounty</span>
                      </div>
                    </div>

                    {/* Candidate Name & Contact */}
                    <div className="mb-3">
                      <h3 className="font-display text-base font-bold text-ink group-hover:text-electric transition-colors">
                        {ref.candidate_name}
                      </h3>
                      <div className="font-mono text-xs text-ink-soft mt-0.5">{ref.candidate_email}</div>
                      {ref.candidate_phone && (
                        <div className="font-mono text-[11px] text-mist">{ref.candidate_phone}</div>
                      )}
                    </div>

                    {/* Requisition Target */}
                    <div className="rounded-xl border border-[#bcd6fa]/50 bg-canvas/40 p-3 mb-3">
                      <div className="text-[10px] font-mono text-mist uppercase tracking-wider">Target Requisition</div>
                      <div className="font-display text-xs font-bold text-ink mt-0.5">{ref.requisition_title}</div>
                      <div className="text-[11px] text-ink-soft">{ref.client_name}</div>
                    </div>

                    {/* Referrer Attribution */}
                    <div className="flex items-center justify-between text-xs text-ink-soft pt-1">
                      <div>
                        <span className="font-mono text-[10px] text-mist">Referred by: </span>
                        <span className="font-semibold text-ink">{ref.referrer.name}</span>
                      </div>
                      <span className="font-mono text-[10px] bg-canvas px-1.5 py-0.5 rounded border border-[#bcd6fa]/40 text-mist">
                        {ref.referrer.referral_code}
                      </span>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="mt-4 pt-3 border-t border-[#bcd6fa]/30 flex items-center justify-between">
                    <span className="font-mono text-[10px] text-mist">{ref.date}</span>
                    <button
                      type="button"
                      onClick={() => handleOpenDrawer(ref)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-ink px-3 py-1.5 font-display text-xs font-bold text-white hover:bg-electric transition-colors cursor-pointer shadow-xs"
                    >
                      <span>Review &amp; Fast-Track</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* =========================================================================
          RIGHT-SIDE SHEET DRAWER: Referral Dossier & Stage Fast-Track Console
          (Strict Invariant: Slide-Over Right Sheet, No Center Popups)
      ========================================================================= */}
      {selectedReferral && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-fadeIn">
          {/* Drawer backdrop dismiss */}
          <div className="flex-1 cursor-pointer" onClick={handleCloseDrawer} />

          {/* Right Sheet Body: Half Screen (50vw) for Big Content */}
          <div className="relative w-full md:w-1/2 lg:w-1/2 md:max-w-[50vw] bg-white h-full shadow-2xl flex flex-col justify-between border-l border-[#bcd6fa] overflow-y-auto animate-slideLeft">
            <div>
              {/* Drawer Header */}
              <div className="sticky top-0 z-10 bg-white border-b border-[#bcd6fa] p-6 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold text-electric bg-electric/10 px-2 py-0.5 rounded border border-electric/30">
                      {selectedReferral.id}
                    </span>
                    <span className="rounded-full bg-signal/15 px-2.5 py-0.5 font-mono text-[10px] font-bold text-signal border border-signal/30 uppercase">
                      {selectedReferral.stage_display}
                    </span>
                  </div>
                  <h2 className="mt-1.5 font-display text-xl font-bold text-ink">
                    {selectedReferral.candidate_name}
                  </h2>
                  <div className="text-xs font-mono text-ink-soft">{selectedReferral.candidate_email}</div>
                </div>

                <button
                  type="button"
                  onClick={handleCloseDrawer}
                  className="rounded-xl border border-[#bcd6fa] bg-canvas/40 p-2 text-ink-soft hover:bg-white hover:text-ink transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Drawer Content */}
              <div className="p-6 space-y-6">
                {/* Notifications */}
                {actionSuccess && (
                  <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-3 text-xs text-emerald-800 font-medium flex items-center gap-2">
                    <CheckCircle size={15} className="text-emerald-600 shrink-0" />
                    <span>{actionSuccess}</span>
                  </div>
                )}

                {actionError && (
                  <div className="rounded-xl border border-rose-300 bg-rose-50 p-3 text-xs text-rose-700 font-medium">
                    {actionError}
                  </div>
                )}

                {/* Candidate Overview Card */}
                <div className="rounded-2xl border border-[#bcd6fa] bg-canvas/20 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-ink uppercase tracking-wider">
                      Referred Specialist Details
                    </span>
                    <span className="text-[10px] font-mono text-mist">
                      Referred: {selectedReferral.date}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <div className="text-[10px] font-mono text-mist">Email Address</div>
                      <div className="font-mono font-medium text-ink">{selectedReferral.candidate_email}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-mist">Phone Number</div>
                      <div className="font-mono font-medium text-ink">
                        {selectedReferral.candidate_phone || "Not provided"}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-mist">Current Pipeline Stage</div>
                      <div className="font-bold text-ink">{selectedReferral.stage_display}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-mist">Referral Scope</div>
                      <div className="font-semibold text-ink">
                        {selectedReferral.referral_scope === "specific_job"
                          ? "Specific Job Referral"
                          : "General Candidate Invite (1st Job Only)"}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-mist">Bounty Lock Status</div>
                      <div className={`font-semibold ${selectedReferral.bounty_locked ? "text-amber-700" : "text-emerald-700"}`}>
                        {selectedReferral.bounty_locked ? "Locked (1st Job Paid)" : "Eligible"}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-mist">Bounty Payout Status</div>
                      <div className="font-semibold text-emerald-700">
                        {selectedReferral.bounty_status_display}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Referrer Attribution Safeguard */}
                <div className="rounded-2xl border border-[#bcd6fa] bg-white p-4 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-ink uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldCheck size={14} className="text-electric" />
                      <span>Referrer Attribution Safeguard</span>
                    </span>
                    <span className="rounded bg-signal/15 px-2 py-0.5 font-mono text-[9px] font-bold text-signal">
                      Active 90d Window
                    </span>
                  </div>

                  <div className="text-xs text-ink-soft leading-relaxed">
                    Attributed to <strong className="text-ink">{selectedReferral.referrer.name}</strong> (
                    <span className="font-mono">{selectedReferral.referrer.email}</span>) under code{" "}
                    <span className="font-mono font-bold text-electric">
                      {selectedReferral.referrer.referral_code}
                    </span>
                    . Protected against self-referral.
                  </div>
                </div>

                {/* Requisition Assignment */}
                <div className="space-y-2">
                  <label className="block font-mono text-xs font-bold uppercase tracking-wider text-ink">
                    Assign or Match to Open Requisition
                  </label>
                  <p className="text-[11px] text-ink-soft">
                    Link this referred candidate directly to an active client opening to inherit SLA and bounty targets.
                  </p>
                  <select
                    value={selectedReqId}
                    onChange={(e) => {
                      const newId = e.target.value;
                      setSelectedReqId(newId);
                      const req = availableRequisitions.find((p) => p.id === newId);
                      if (req && req.bounty_amount) {
                        setCustomBounty(String(req.bounty_amount));
                      }
                    }}
                    className="w-full rounded-xl border border-[#bcd6fa] bg-white p-3 text-xs text-ink focus:border-electric focus:outline-hidden font-medium"
                  >
                    <option value="">Unassigned Requisition (General Talent Pool)</option>
                    {availableRequisitions.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title} ({p.client_name}) {p.bounty_enabled ? `| Bounty: ${p.bounty_type_name || "Active"} ($${p.bounty_amount})` : "| No Bounty"}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Placement Bounty Amount Input */}
                <div className="space-y-2">
                  <label className="block font-mono text-xs font-bold uppercase tracking-wider text-ink">
                    Placement Bounty Escrow (USD)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-mist font-bold">$</span>
                    <input
                      type="number"
                      step="50"
                      value={customBounty}
                      onChange={(e) => setCustomBounty(e.target.value)}
                      placeholder="1500"
                      className="w-full rounded-xl border border-[#bcd6fa] bg-white pl-8 pr-4 py-2.5 text-xs text-ink font-mono font-bold focus:border-electric focus:outline-hidden"
                    />
                  </div>
                  <div className="text-[10px] font-mono text-mist">
                    Upon candidate placement, this amount is automatically minted in the immutable payout ledger for admin disbursement.
                  </div>
                </div>

                {/* Recruiter Evaluation Note */}
                <div className="space-y-2">
                  <label className="block font-mono text-xs font-bold uppercase tracking-wider text-ink">
                    Recruiter Evaluation &amp; Fast-Track Notes
                  </label>
                  <textarea
                    rows={3}
                    value={evaluationNote}
                    onChange={(e) => setEvaluationNote(e.target.value)}
                    placeholder="E.g., Specialist verified against system architecture rubric. Recommending immediate placement in Distributed Golang requisition."
                    className="w-full rounded-xl border border-[#bcd6fa] bg-white p-3 text-xs text-ink placeholder:text-mist focus:border-electric focus:outline-hidden"
                  />
                </div>

                {/* Stage Progression Action Buttons */}
                <div className="space-y-3 pt-2">
                  <div className="font-mono text-xs font-bold uppercase tracking-wider text-ink">
                    Fast-Track Stage Advancement
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      disabled={isPending || selectedReferral.stage === "screened"}
                      onClick={() => handleUpdateStage("screened")}
                      className="flex items-center justify-center gap-1.5 rounded-xl border border-blue-400 bg-blue-50 py-2.5 px-3 font-display text-xs font-bold text-blue-900 hover:bg-blue-100 transition-colors cursor-pointer disabled:opacity-40"
                    >
                      <CheckCircle size={14} className="text-blue-700" />
                      <span>Mark Screened</span>
                    </button>

                    <button
                      type="button"
                      disabled={isPending || selectedReferral.stage === "interviewed"}
                      onClick={() => handleUpdateStage("interviewed")}
                      className="flex items-center justify-center gap-1.5 rounded-xl border border-cyan-400 bg-cyan-50 py-2.5 px-3 font-display text-xs font-bold text-cyan-900 hover:bg-cyan-100 transition-colors cursor-pointer disabled:opacity-40"
                    >
                      <Clock size={14} className="text-cyan-700" />
                      <span>Sprint Interview</span>
                    </button>

                    <button
                      type="button"
                      disabled={isPending || selectedReferral.stage === "placed"}
                      onClick={() => handleUpdateStage("placed")}
                      className="col-span-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-signal to-emerald-500 py-3 px-4 font-display text-xs font-bold text-ink shadow-md hover:opacity-95 transition-all cursor-pointer disabled:opacity-40"
                    >
                      <Zap size={15} className="text-ink" />
                      <span>Place Candidate &amp; Mint Placement Bounty</span>
                    </button>

                    <button
                      type="button"
                      disabled={isPending || selectedReferral.stage === "rejected"}
                      onClick={() => handleUpdateStage("rejected")}
                      className="col-span-2 rounded-xl border border-rose-300 py-2 font-display text-xs font-semibold text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer disabled:opacity-40"
                    >
                      Mark Ineligible / Reject Referral
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="sticky bottom-0 bg-white border-t border-[#bcd6fa] p-4 flex items-center justify-between">
              <span className="font-mono text-[10px] text-mist">
                Audit Trail Recorded
              </span>
              <button
                type="button"
                onClick={handleCloseDrawer}
                className="rounded-xl border border-[#bcd6fa] bg-canvas/40 px-4 py-2 font-display text-xs font-semibold text-ink hover:bg-white transition-colors cursor-pointer"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
