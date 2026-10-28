"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  CheckCircle,
  Clock,
  Briefcase,
  Award,
  ChevronRight,
  X,
  CreditCard,
  AlertCircle,
  DollarSign,
  ShieldCheck,
  FileText,
} from "@/components/ui/Icons";
import { ReferralRecord, BountySummary } from "@/types/referral.types";
import {
  submitDirectReferralAction,
  requestReferralPayoutAction,
} from "@/actions/referral.actions";

interface ReferralNetworkViewProps {
  initialRecords: ReferralRecord[];
  summary: BountySummary;
  availableBalanceUsd?: number;
}

export function ReferralNetworkView({
  initialRecords,
  summary,
  availableBalanceUsd = 0,
}: ReferralNetworkViewProps) {
  const [records, setRecords] = useState<ReferralRecord[]>(initialRecords);
  const [searchQuery, setSearchQuery] = useState("");
  const [stageFilter, setStageFilter] = useState<string>("all");
  const [clearedBalance, setClearedBalance] = useState<number>(availableBalanceUsd);

  // Slide-over Drawers state
  const [isSubmitDrawerOpen, setIsSubmitDrawerOpen] = useState(false);
  const [isPayoutDrawerOpen, setIsPayoutDrawerOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<ReferralRecord | null>(null);

  // Form submission states
  const [refName, setRefName] = useState("");
  const [refEmail, setRefEmail] = useState("");
  const [refRole, setRefRole] = useState("");
  const [refSector, setRefSector] = useState<"Technology" | "Healthcare">("Technology");
  const [refNotes, setRefNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Payout Drawer states
  const [payoutMethod, setPayoutMethod] = useState<"bank_wire" | "ach" | "faster_payments" | "paypal">("bank_wire");
  const [recipientDetails, setRecipientDetails] = useState("");
  const [isDisbursing, setIsDisbursing] = useState(false);
  const [payoutReceipt, setPayoutReceipt] = useState<{
    amount: string;
    method: string;
    message: string;
  } | null>(null);

  // Feedback toast
  const [toast, setToast] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 5000);
  };

  const handleManualReferralSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refName || !refEmail || !refRole) return;
    setIsSubmitting(true);

    try {
      const res = await submitDirectReferralAction({
        referred_name: refName.trim(),
        referred_email: refEmail.trim(),
        target_role: refRole.trim(),
        notes: `Sector: ${refSector}. Notes: ${refNotes.trim()}`,
      });

      if (res.success) {
        const newRecord: ReferralRecord = {
          id: `REF-${res.data?.id ? String(res.data.id).slice(0, 6) : "00" + (records.length + 1)}`,
          candidateName: refName,
          candidateEmail: refEmail,
          role: refRole,
          sector: refSector,
          submittedDate: "Just now",
          stage: "Submitted",
          stageIndex: 1,
          bountyAmount: "$1,500.00",
          payoutStatus: "Pending Placement",
          notes: refNotes,
        };

        setRecords([newRecord, ...records]);
        showToast(`Referral invitation dispatched to ${refName} (${refEmail}).`);
        setRefName("");
        setRefEmail("");
        setRefRole("");
        setRefNotes("");
        setIsSubmitDrawerOpen(false);
      } else {
        showToast(res.error || "Failed to submit referral invitation.", "error");
      }
    } catch {
      showToast("Network exception submitting candidate referral.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDisbursement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientDetails.trim()) {
      showToast("Please enter receiving banking or payout coordinates.", "error");
      return;
    }
    setIsDisbursing(true);

    try {
      const res = await requestReferralPayoutAction({
        payout_method: payoutMethod,
        recipient_details: recipientDetails.trim(),
      });

      if (res.success) {
        const amountDisplay = `$${clearedBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        setPayoutReceipt({
          amount: amountDisplay,
          method: payoutMethod.toUpperCase().replace("_", " "),
          message: res.data?.message || "Disbursement submitted to Treasury desk.",
        });
        showToast("Payout wire instruction registered with treasury vault.");
        setClearedBalance(0);
      } else {
        showToast(res.error || "Failed to submit payout instruction.", "error");
      }
    } catch {
      showToast("Network exception submitting payout instruction.", "error");
    } finally {
      setIsDisbursing(false);
    }
  };

  // Filter records
  const filteredRecords = records.filter((r) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      r.candidateName.toLowerCase().includes(q) ||
      (r.candidateEmail || "").toLowerCase().includes(q) ||
      r.role.toLowerCase().includes(q);

    const matchesStage =
      stageFilter === "all" ||
      (stageFilter === "placed" && r.stage.toLowerCase().includes("placed")) ||
      (stageFilter === "interviewed" && r.stage.toLowerCase().includes("interview")) ||
      (stageFilter === "screened" && r.stage.toLowerCase().includes("screen")) ||
      (stageFilter === "submitted" && r.stage.toLowerCase().includes("submit"));

    return matchesSearch && matchesStage;
  });

  const placedCount = records.filter((r) => r.stage.toLowerCase().includes("placed")).length;
  const interviewCount = records.filter((r) => r.stage.toLowerCase().includes("interview")).length;
  const screenedCount = records.filter((r) => r.stage.toLowerCase().includes("screen")).length;
  const submittedCount = records.filter((r) => r.stage.toLowerCase().includes("submit")).length;

  return (
    <div className="space-y-6 sm:space-y-8 font-sans">
      {/* Toast Feedback */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-2.5 rounded-2xl border px-4 py-3 shadow-xl backdrop-blur-md text-xs font-semibold animate-in slide-in-from-top-4 duration-200 ${
            toast.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-900"
              : "border-red-200 bg-red-50 text-red-900"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
          )}
          <span>{toast.text}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-electric/30 bg-gradient-to-r from-ink via-[#0d1f3d] to-ink p-5 sm:p-7 text-white shadow-xl">
        <div className="relative z-10 flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-electric/40 bg-electric/20 px-3 py-0.5 text-xs font-mono text-electric-bright">
              <span className="h-2 w-2 rounded-full bg-signal animate-pulse" />
              <span>SCOUT PIPELINE &amp; CANDIDATE NETWORK</span>
            </div>
            <h1 className="mt-2.5 font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
              Submitted Candidate Network
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-gray-300 max-w-2xl leading-relaxed">
              Track your referred engineering talent and clinical specialists across each recruitment milestone. Monitor real-time placement status and release verified bounty payouts.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/referrals/dashboard"
              className="rounded-2xl border border-white/20 bg-white/10 px-4 py-2.5 font-display text-xs font-bold text-white hover:bg-white/20 transition-all shadow-xs"
            >
              ← Overview Cockpit
            </Link>
            <button
              type="button"
              onClick={() => setIsSubmitDrawerOpen(true)}
              className="rounded-2xl bg-electric px-5 py-2.5 font-display text-xs font-bold text-white hover:bg-electric-bright transition-all shadow-xs cursor-pointer flex items-center gap-2"
            >
              <span>+ Refer New Candidate</span>
            </button>
          </div>
        </div>
      </div>

      {/* Pipeline Telemetry Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-[#bcd6fa] bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-ink-soft">
            <span className="text-xs font-semibold">Total Referred</span>
            <Users className="h-4 w-4 text-electric" />
          </div>
          <div className="mt-2 font-display text-2xl font-black text-ink">{records.length}</div>
          <div className="mt-1 text-[11px] text-ink-soft">In candidate directory</div>
        </div>

        <div className="rounded-2xl border border-[#bcd6fa] bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-ink-soft">
            <span className="text-xs font-semibold">Placed &amp; Deployed</span>
            <CheckCircle className="h-4 w-4 text-signal" />
          </div>
          <div className="mt-2 font-display text-2xl font-black text-signal">{placedCount}</div>
          <div className="mt-1 text-[11px] text-signal font-semibold">Milestone achieved</div>
        </div>

        <div className="rounded-2xl border border-[#bcd6fa] bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-ink-soft">
            <span className="text-xs font-semibold">Client Interviews</span>
            <Clock className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-2 font-display text-2xl font-black text-amber-600">{interviewCount}</div>
          <div className="mt-1 text-[11px] text-ink-soft">Active sprint panels</div>
        </div>

        <div className="rounded-2xl border border-[#bcd6fa] bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-ink-soft">
            <span className="text-xs font-semibold">Cleared Payouts</span>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-2 font-display text-2xl font-black text-emerald-700">
            ${clearedBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="mt-1 text-[11px] text-emerald-700 font-semibold">Approved for escrow wire</div>
        </div>
      </div>

      {/* Control Bar: Search & Stage Filter Pills */}
      <div className="rounded-2xl border border-[#bcd6fa] bg-white p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-mist" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search candidate name, email, or target role..."
              className="w-full rounded-xl border border-[#bcd6fa] bg-canvas pl-9 pr-4 py-2 text-xs text-ink focus:border-electric focus:bg-white outline-hidden"
            />
          </div>

          {/* Quick Stage Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => setStageFilter("all")}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                stageFilter === "all"
                  ? "bg-ink text-white font-bold"
                  : "bg-canvas text-ink-soft hover:text-ink"
              }`}
            >
              All ({records.length})
            </button>
            <button
              type="button"
              onClick={() => setStageFilter("placed")}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                stageFilter === "placed"
                  ? "bg-signal text-white font-bold"
                  : "bg-canvas text-ink-soft hover:text-signal"
              }`}
            >
              Placed ({placedCount})
            </button>
            <button
              type="button"
              onClick={() => setStageFilter("interviewed")}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                stageFilter === "interviewed"
                  ? "bg-amber-500 text-white font-bold"
                  : "bg-canvas text-ink-soft hover:text-amber-600"
              }`}
            >
              Interviews ({interviewCount})
            </button>
            <button
              type="button"
              onClick={() => setStageFilter("screened")}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                stageFilter === "screened"
                  ? "bg-electric text-white font-bold"
                  : "bg-canvas text-ink-soft hover:text-electric"
              }`}
            >
              Screened ({screenedCount})
            </button>
            <button
              type="button"
              onClick={() => setStageFilter("submitted")}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                stageFilter === "submitted"
                  ? "bg-slate-700 text-white font-bold"
                  : "bg-canvas text-ink-soft hover:text-ink"
              }`}
            >
              Submitted ({submittedCount})
            </button>
          </div>
        </div>
      </div>

      {/* High-Density Candidates Table */}
      <div className="rounded-2xl border border-[#bcd6fa] bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#bcd6fa] bg-slate-50/80 text-ink-soft font-mono uppercase text-[10.5px]">
              <tr>
                <th className="py-3 px-4 font-semibold">Referred Candidate</th>
                <th className="py-3 px-4 font-semibold">Target Requisition &amp; Sector</th>
                <th className="py-3 px-4 font-semibold">Recruitment Progress</th>
                <th className="py-3 px-4 font-semibold">Bounty Reward</th>
                <th className="py-3 px-4 font-semibold">Payout Status</th>
                <th className="py-3 px-4 font-semibold">Date Submitted</th>
                <th className="py-3 px-4 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#bcd6fa]/40">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-ink-soft">
                    <Users className="mx-auto h-8 w-8 text-mist mb-2" />
                    <div className="font-display text-sm font-bold text-ink">No Matching Candidates Found</div>
                    <p className="text-xs text-mist mt-1 max-w-sm mx-auto">
                      Adjust your search or stage filters, or invite new candidates using your referral link.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredRecords.map((item) => (
                  <tr key={item.id} className="hover:bg-canvas/40 transition-colors">
                    {/* Candidate Info */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-ink text-white font-bold text-[11px]">
                          {item.candidateName.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-ink">{item.candidateName}</div>
                          {item.candidateEmail && (
                            <div className="text-[10.5px] text-mist font-mono">{item.candidateEmail}</div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Role & Sector */}
                    <td className="py-3 px-4">
                      <div className="font-medium text-ink truncate max-w-[200px]">{item.role}</div>
                      <span
                        className={`inline-block mt-0.5 rounded-full px-2 py-0.2 text-[9.5px] font-semibold ${
                          item.sector === "Technology"
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        }`}
                      >
                        {item.sector}
                      </span>
                    </td>

                    {/* 4-Step Stepper & Current Stage */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 mb-1">
                        {[1, 2, 3, 4].map((step) => {
                          const isComplete = item.stageIndex >= step;
                          return (
                            <div
                              key={step}
                              className={`h-1.5 w-6 rounded-full transition-colors ${
                                isComplete
                                  ? step === 4
                                    ? "bg-signal"
                                    : "bg-electric"
                                  : "bg-slate-200"
                              }`}
                            />
                          );
                        })}
                      </div>
                      <span className="font-display text-[11px] font-bold text-ink">
                        {item.stage}
                      </span>
                    </td>

                    {/* Bounty Amount */}
                    <td className="py-3 px-4">
                      <span className="font-display font-black text-ink text-sm">
                        {item.bountyAmount}
                      </span>
                      <span className="block text-[10px] font-mono text-mist">Placement Escrow</span>
                    </td>

                    {/* Payout Status */}
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                          item.payoutStatus === "Cleared for Payout"
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                            : item.payoutStatus === "Paid"
                            ? "bg-signal/15 text-signal border border-signal/30 font-bold"
                            : "bg-blue-50 text-blue-700 border border-blue-200"
                        }`}
                      >
                        {item.payoutStatus}
                      </span>
                    </td>

                    {/* Submission Date */}
                    <td className="py-3 px-4 text-mist font-mono text-[11px]">
                      {item.submittedDate}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {item.payoutStatus === "Cleared for Payout" && (
                          <button
                            type="button"
                            onClick={() => {
                              setPayoutReceipt(null);
                              setIsPayoutDrawerOpen(true);
                            }}
                            className="rounded-lg bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-emerald-700 transition-colors shadow-2xs cursor-pointer"
                          >
                            Claim Wire
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setSelectedCandidate(item)}
                          className="rounded-lg border border-[#bcd6fa] bg-canvas px-2.5 py-1 text-[11px] font-bold text-ink hover:border-electric transition-colors cursor-pointer"
                        >
                          Dossier
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-Over Right-Side Sheet Drawer: Candidate Dossier Detail */}
      {selectedCandidate && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in-0 duration-200"
          onClick={() => setSelectedCandidate(null)}
        >
          <div
            className="relative h-full w-full max-w-lg bg-white shadow-2xl flex flex-col border-l border-[#bcd6fa] animate-in slide-in-from-right duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#bcd6fa] px-6 py-4 bg-canvas">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-electric/10 px-2.5 py-0.5 text-[10px] font-bold text-electric">
                  <ShieldCheck size={11} />
                  <span>CANDIDATE SCOUT RECORD</span>
                </div>
                <h3 className="font-display text-lg font-bold text-ink mt-1">
                  {selectedCandidate.candidateName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCandidate(null)}
                className="rounded-xl border border-[#bcd6fa] p-2 text-ink-soft hover:bg-white hover:text-ink transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Dossier Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 thin-scrollbar text-xs">
              {/* Stepper Card */}
              <div className="rounded-2xl border border-electric/30 bg-electric/5 p-4">
                <div className="font-mono text-[10px] font-bold text-electric uppercase tracking-wider mb-2">
                  ATS Recruitment Milestones
                </div>
                <div className="space-y-3">
                  {[
                    { step: 1, name: "Stage 1: Intake & Sourcing", desc: "Candidate registered via scout attribution" },
                    { step: 2, name: "Stage 2: Technical / Clinical Screening", desc: "Automated CV benchmarks and qualification audit" },
                    { step: 3, name: "Stage 3: Client Panel Interviews", desc: "Sprint evaluation and client stakeholder meetings" },
                    { step: 4, name: "Stage 4: Placed & Deployed", desc: "Contract executed with 7-day velocity SLA" },
                  ].map((s) => {
                    const active = selectedCandidate.stageIndex >= s.step;
                    const isCurrent = selectedCandidate.stageIndex === s.step;
                    return (
                      <div key={s.step} className="flex items-start gap-2.5">
                        <div
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                            active
                              ? "bg-signal text-white"
                              : "bg-slate-200 text-mist"
                          }`}
                        >
                          {active ? "✓" : s.step}
                        </div>
                        <div>
                          <div className={`font-bold ${isCurrent ? "text-electric" : active ? "text-ink" : "text-mist"}`}>
                            {s.name}
                          </div>
                          <div className="text-[10.5px] text-ink-soft">{s.desc}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Candidate Metadata */}
              <div className="rounded-2xl border border-[#bcd6fa] bg-canvas p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-mist">Role / Track:</span>
                  <span className="font-bold text-ink">{selectedCandidate.role}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-mist">Sector:</span>
                  <span className="font-bold text-ink">{selectedCandidate.sector}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-mist">Email Coordinate:</span>
                  <span className="font-mono text-ink">{selectedCandidate.candidateEmail || "On file in ATS"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-mist">Date Sourced:</span>
                  <span className="font-mono text-ink">{selectedCandidate.submittedDate}</span>
                </div>
              </div>

              {/* Financial Bounty Breakdown */}
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-900">Placement Escrow Bounty:</span>
                  <span className="font-display text-base font-black text-emerald-700">
                    {selectedCandidate.bountyAmount}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-emerald-800">
                  <span>Payout Clearance Status:</span>
                  <span className="font-bold">{selectedCandidate.payoutStatus}</span>
                </div>
                {selectedCandidate.paidReference && (
                  <div className="flex justify-between text-[11px] text-emerald-800">
                    <span>Disbursement Reference:</span>
                    <span className="font-mono font-bold">{selectedCandidate.paidReference}</span>
                  </div>
                )}
              </div>

              {selectedCandidate.payoutStatus === "Cleared for Payout" && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCandidate(null);
                    setPayoutReceipt(null);
                    setIsPayoutDrawerOpen(true);
                  }}
                  className="w-full rounded-xl bg-emerald-600 py-2.5 font-display text-xs font-bold text-white hover:bg-emerald-700 transition-colors cursor-pointer shadow-xs"
                >
                  Request Wire Disbursement for this Bounty
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Slide-Over Right-Side Sheet Drawer: Direct Candidate Referral Submission */}
      {isSubmitDrawerOpen && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in-0 duration-200"
          onClick={() => setIsSubmitDrawerOpen(false)}
        >
          <div
            className="relative h-full w-full max-w-lg bg-white shadow-2xl flex flex-col border-l border-[#bcd6fa] animate-in slide-in-from-right duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#bcd6fa] px-6 py-4 bg-canvas">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-electric/10 px-2.5 py-0.5 text-[10px] font-bold text-electric">
                  <span>TALENT SCOUT INVITATION</span>
                </div>
                <h3 className="font-display text-lg font-bold text-ink mt-1">
                  Submit Candidate Referral
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsSubmitDrawerOpen(false)}
                className="rounded-xl border border-[#bcd6fa] p-2 text-ink-soft hover:bg-white hover:text-ink transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleManualReferralSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 thin-scrollbar">
              <div>
                <label className="block text-xs font-semibold text-ink mb-1">Candidate Full Name</label>
                <input
                  type="text"
                  required
                  value={refName}
                  onChange={(e) => setRefName(e.target.value)}
                  placeholder="e.g. Maya Chen"
                  className="w-full rounded-xl border border-[#bcd6fa] bg-canvas px-3.5 py-2.5 text-xs text-ink focus:border-electric focus:bg-white outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink mb-1">Candidate Email Address</label>
                <input
                  type="email"
                  required
                  value={refEmail}
                  onChange={(e) => setRefEmail(e.target.value)}
                  placeholder="e.g. maya.chen@example.com"
                  className="w-full rounded-xl border border-[#bcd6fa] bg-canvas px-3.5 py-2.5 text-xs text-ink focus:border-electric focus:bg-white outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink mb-1">Target Specialization / Role</label>
                <input
                  type="text"
                  required
                  value={refRole}
                  onChange={(e) => setRefRole(e.target.value)}
                  placeholder="e.g. Principal Distributed Systems Engineer"
                  className="w-full rounded-xl border border-[#bcd6fa] bg-canvas px-3.5 py-2.5 text-xs text-ink focus:border-electric focus:bg-white outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink mb-1">Sector Domain</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRefSector("Technology")}
                    className={`rounded-xl border p-3 text-left transition-all cursor-pointer ${
                      refSector === "Technology"
                        ? "border-electric bg-electric/10 text-electric font-bold"
                        : "border-[#bcd6fa] bg-canvas text-ink-soft hover:bg-white"
                    }`}
                  >
                    <span className="block text-xs">Technology Track</span>
                    <span className="block text-[10px] text-ink-soft mt-0.5">Software, Cloud &amp; AI</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRefSector("Healthcare")}
                    className={`rounded-xl border p-3 text-left transition-all cursor-pointer ${
                      refSector === "Healthcare"
                        ? "border-emerald-600 bg-emerald-50 text-emerald-800 font-bold"
                        : "border-[#bcd6fa] bg-canvas text-ink-soft hover:bg-white"
                    }`}
                  >
                    <span className="block text-xs">Healthcare Track</span>
                    <span className="block text-[10px] text-ink-soft mt-0.5">Clinicians &amp; Nurses</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink mb-1">Referral Notes / Endorsement (Optional)</label>
                <textarea
                  rows={3}
                  value={refNotes}
                  onChange={(e) => setRefNotes(e.target.value)}
                  placeholder="Provide context regarding their background, availability, or portfolio links..."
                  className="w-full rounded-xl border border-[#bcd6fa] bg-canvas p-3 text-xs text-ink focus:border-electric focus:bg-white outline-hidden resize-none"
                />
              </div>

              <div className="pt-4 border-t border-[#bcd6fa]">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-xl bg-electric py-3 font-display text-xs font-bold text-white hover:bg-electric-bright transition-all shadow-xs disabled:opacity-60 cursor-pointer"
                >
                  {isSubmitting ? "Dispatching Invitation..." : "Submit Referral & Lock 90d Attribution"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Slide-Over Right-Side Sheet Drawer: Escrow Wire Disbursement */}
      {isPayoutDrawerOpen && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in-0 duration-200"
          onClick={() => setIsPayoutDrawerOpen(false)}
        >
          <div
            className="relative h-full w-full max-w-lg bg-white shadow-2xl flex flex-col border-l border-[#bcd6fa] animate-in slide-in-from-right duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#bcd6fa] px-6 py-4 bg-canvas">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-signal/15 px-2.5 py-0.5 text-[10px] font-bold text-signal">
                  <span>BANK TREASURY VAULT</span>
                </div>
                <h3 className="font-display text-lg font-bold text-ink mt-1">
                  Disburse Escrow Wire
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsPayoutDrawerOpen(false)}
                className="rounded-xl border border-[#bcd6fa] p-2 text-ink-soft hover:bg-white hover:text-ink transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {payoutReceipt ? (
              <div className="flex-1 p-6 flex flex-col items-center justify-center text-center space-y-4">
                <div className="h-14 w-14 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <h4 className="font-display text-lg font-bold text-ink">Disbursement Instruction Registered</h4>
                <p className="text-xs text-ink-soft max-w-xs">{payoutReceipt.message}</p>
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 w-full text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-emerald-800">Wire Amount:</span>
                    <span className="font-black font-display text-emerald-950">{payoutReceipt.amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-emerald-800">Method:</span>
                    <span className="font-bold text-emerald-950">{payoutReceipt.method}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-emerald-800">SLA:</span>
                    <span className="font-bold text-emerald-950">1-2 Business Days</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPayoutDrawerOpen(false)}
                  className="rounded-xl bg-ink px-6 py-2.5 text-xs font-bold text-white hover:bg-electric transition-colors cursor-pointer"
                >
                  Close Receipt
                </button>
              </div>
            ) : (
              <form onSubmit={handleConfirmDisbursement} className="flex-1 overflow-y-auto p-6 space-y-5 thin-scrollbar">
                <div className="rounded-2xl border border-[#bcd6fa] bg-canvas p-4 text-xs">
                  <div className="text-ink-soft">Available Escrow Balance</div>
                  <div className="font-display text-2xl font-black text-emerald-700 mt-1">
                    ${clearedBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <p className="text-[11px] text-ink-soft mt-1">
                    Funds released from completed candidate guarantees. Zero platform disbursement fees.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink mb-1.5">Disbursement Channel</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: "bank_wire", label: "Direct Bank Wire", sub: "Global SWIFT/BIC" },
                      { id: "ach", label: "US ACH Transfer", sub: "1-2 Business Days" },
                      { id: "faster_payments", label: "UK Faster Payments", sub: "Near Instant" },
                      { id: "paypal", label: "PayPal Business", sub: "Direct Account" },
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setPayoutMethod(m.id as any)}
                        className={`rounded-xl border p-2.5 text-left transition-all cursor-pointer ${
                          payoutMethod === m.id
                            ? "border-signal bg-signal/10 font-bold text-ink"
                            : "border-[#bcd6fa] bg-canvas text-ink-soft hover:bg-white"
                        }`}
                      >
                        <span className="block text-xs">{m.label}</span>
                        <span className="block text-[10px] text-mist">{m.sub}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink mb-1">
                    Receiving Bank Account / Routing Coordinates
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={recipientDetails}
                    onChange={(e) => setRecipientDetails(e.target.value)}
                    placeholder="Enter Beneficiary Name, Account Number / IBAN, Routing / SWIFT code, and Bank Name..."
                    className="w-full rounded-xl border border-[#bcd6fa] bg-canvas p-3 text-xs text-ink focus:border-electric focus:bg-white outline-hidden resize-none"
                  />
                </div>

                <div className="pt-2 border-t border-[#bcd6fa]">
                  <button
                    type="submit"
                    disabled={isDisbursing || clearedBalance <= 0}
                    className="w-full rounded-xl bg-signal py-3 font-display text-xs font-bold text-white hover:bg-signal/90 transition-all shadow-xs disabled:opacity-50 cursor-pointer"
                  >
                    {isDisbursing
                      ? "Submitting Wire Instruction..."
                      : clearedBalance <= 0
                      ? "Zero Cleared Balance to Disburse"
                      : "Confirm & Execute Escrow Wire"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
