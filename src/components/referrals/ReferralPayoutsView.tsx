"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  DollarSign,
  CreditCard,
  CheckCircle,
  Clock,
  AlertCircle,
  X,
  ShieldCheck,
  Award,
  ChevronRight,
  FileText,
} from "@/components/ui/Icons";
import { requestReferralPayoutAction } from "@/actions/referral.actions";

export interface LedgerRowItem {
  id: string;
  raw_id: number;
  candidate: string;
  track: string;
  status: string;
  amount_usd: number;
  bountyEarned: string;
  payoutStatus: string;
  date: string;
  paidReference: string | null;
  note?: string;
}

interface ReferralPayoutsViewProps {
  ledger: LedgerRowItem[];
  availableBalanceUsd?: number;
  totalPaidUsd?: number;
  pendingBountiesUsd?: number;
}

export function ReferralPayoutsView({
  ledger = [],
  availableBalanceUsd = 0,
  totalPaidUsd = 0,
  pendingBountiesUsd = 0,
}: ReferralPayoutsViewProps) {
  const [activeTab, setActiveTab] = useState<"pending" | "received">("pending");
  const [clearedBalance, setClearedBalance] = useState<number>(availableBalanceUsd);

  // Disbursement Drawer state
  const [isPayoutDrawerOpen, setIsPayoutDrawerOpen] = useState(false);
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

  // Filter ledger rows by tab
  const pendingRows = ledger.filter(
    (row) => row.payoutStatus !== "Paid" && !row.paidReference
  );
  const receivedRows = ledger.filter(
    (row) => row.payoutStatus === "Paid" || Boolean(row.paidReference)
  );

  const totalEarnedUsd = totalPaidUsd + clearedBalance;

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
            <div className="inline-flex items-center gap-2 rounded-full border border-signal/40 bg-signal/20 px-3 py-0.5 text-xs font-mono text-signal">
              <span className="h-2 w-2 rounded-full bg-signal animate-pulse" />
              <span>ESCROW DISBURSEMENTS &amp; TREASURY VAULT</span>
            </div>
            <h1 className="mt-2.5 font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
              Payouts &amp; Escrow Ledger
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-gray-300 max-w-2xl leading-relaxed">
              Real-time audit of approved placement earnings, in-flight escrow milestones, and bank wire disbursement history. All disbursements reconciled against cryptographic ledger records.
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
              onClick={() => {
                setPayoutReceipt(null);
                setIsPayoutDrawerOpen(true);
              }}
              className="rounded-2xl bg-signal px-5 py-2.5 font-display text-xs font-bold text-white hover:bg-signal/90 transition-all shadow-xs cursor-pointer flex items-center gap-2"
            >
              <CreditCard className="h-4 w-4" />
              <span>Disburse Escrow Wire</span>
            </button>
          </div>
        </div>
      </div>

      {/* Financial Telemetry Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-[#bcd6fa] bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-ink-soft">
            <span className="text-xs font-semibold">Available for Wire</span>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-2 font-display text-2xl sm:text-3xl font-black text-emerald-700">
            ${clearedBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="mt-1 text-[11px] text-emerald-700 font-semibold">Approved escrow funds</div>
        </div>

        <div className="rounded-2xl border border-[#bcd6fa] bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-ink-soft">
            <span className="text-xs font-semibold">Escrow In-Flight</span>
            <Clock className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-2 font-display text-2xl sm:text-3xl font-black text-amber-600">
            ${pendingBountiesUsd.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="mt-1 text-[11px] text-ink-soft">Pending candidate milestones</div>
        </div>

        <div className="rounded-2xl border border-[#bcd6fa] bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-ink-soft">
            <span className="text-xs font-semibold">Total Disbursed</span>
            <CheckCircle className="h-4 w-4 text-signal" />
          </div>
          <div className="mt-2 font-display text-2xl sm:text-3xl font-black text-ink">
            ${totalPaidUsd.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="mt-1 text-[11px] text-ink-soft">Completed bank wire payouts</div>
        </div>

        <div className="rounded-2xl border border-[#bcd6fa] bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-ink-soft">
            <span className="text-xs font-semibold">Cumulative Earnings</span>
            <Award className="h-4 w-4 text-purple-600" />
          </div>
          <div className="mt-2 font-display text-2xl sm:text-3xl font-black text-ink">
            ${totalEarnedUsd.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="mt-1 text-[11px] text-ink-soft">Lifetime placement value</div>
        </div>
      </div>

      {/* Two Tab Selectors: Pending & Approved vs Received Disbursements */}
      <div className="rounded-2xl border border-[#bcd6fa] bg-white p-4 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#bcd6fa]/40 pb-3">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-canvas border border-[#bcd6fa]/50">
            <button
              type="button"
              onClick={() => setActiveTab("pending")}
              className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "pending"
                  ? "bg-white text-ink shadow-2xs font-bold"
                  : "text-ink-soft hover:text-ink"
              }`}
            >
              Pending &amp; Approved Payouts ({pendingRows.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("received")}
              className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "received"
                  ? "bg-white text-ink shadow-2xs font-bold"
                  : "text-ink-soft hover:text-ink"
              }`}
            >
              Received &amp; Reconciled ({receivedRows.length})
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-mist font-mono">
            <span>Treasury Double-Entry Reconciled</span>
          </div>
        </div>

        {/* Tab 1: Pending & Approved Table */}
        {activeTab === "pending" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#bcd6fa] bg-slate-50/80 text-ink-soft font-mono uppercase text-[10.5px]">
                <tr>
                  <th className="py-3 px-4 font-semibold">Ledger ID</th>
                  <th className="py-3 px-4 font-semibold">Referred Candidate</th>
                  <th className="py-3 px-4 font-semibold">Milestone / Requisition</th>
                  <th className="py-3 px-4 font-semibold">Bounty Amount</th>
                  <th className="py-3 px-4 font-semibold">Clearance Status</th>
                  <th className="py-3 px-4 font-semibold">Date Registered</th>
                  <th className="py-3 px-4 text-right font-semibold">Disbursement Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#bcd6fa]/40">
                {pendingRows.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-ink-soft">
                      <Clock className="mx-auto h-8 w-8 text-mist mb-2" />
                      <div className="font-display text-sm font-bold text-ink">Zero Pending Escrow Milestones</div>
                      <p className="text-xs text-mist mt-1">All qualified placement bounties have been cleared and disbursed.</p>
                    </td>
                  </tr>
                ) : (
                  pendingRows.map((row) => (
                    <tr key={row.id} className="hover:bg-canvas/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-ink">{row.id}</td>
                      <td className="py-3 px-4 font-bold text-ink">{row.candidate}</td>
                      <td className="py-3 px-4 text-ink-soft">{row.track}</td>
                      <td className="py-3 px-4 font-display font-black text-ink text-sm">
                        {row.bountyEarned}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                            row.payoutStatus === "Approved for Payout"
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                              : "bg-amber-50 text-amber-800 border border-amber-200"
                          }`}
                        >
                          {row.payoutStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-mist font-mono text-[11px]">{row.date}</td>
                      <td className="py-3 px-4 text-right">
                        {row.payoutStatus === "Approved for Payout" ? (
                          <button
                            type="button"
                            onClick={() => {
                              setPayoutReceipt(null);
                              setIsPayoutDrawerOpen(true);
                            }}
                            className="rounded-lg bg-emerald-600 px-3 py-1 font-semibold text-white hover:bg-emerald-700 transition-colors shadow-2xs cursor-pointer"
                          >
                            Claim Wire
                          </button>
                        ) : (
                          <span className="text-[11px] text-mist font-mono">Awaiting Milestone</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Received & Reconciled Table */}
        {activeTab === "received" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#bcd6fa] bg-slate-50/80 text-ink-soft font-mono uppercase text-[10.5px]">
                <tr>
                  <th className="py-3 px-4 font-semibold">Ledger ID</th>
                  <th className="py-3 px-4 font-semibold">Reconciled Wire Reference</th>
                  <th className="py-3 px-4 font-semibold">Referred Specialist</th>
                  <th className="py-3 px-4 font-semibold">Disbursed Amount</th>
                  <th className="py-3 px-4 font-semibold">Settlement Date</th>
                  <th className="py-3 px-4 font-semibold">Channel</th>
                  <th className="py-3 px-4 text-right font-semibold">Ledger State</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#bcd6fa]/40">
                {receivedRows.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-ink-soft">
                      <CreditCard className="mx-auto h-8 w-8 text-mist mb-2" />
                      <div className="font-display text-sm font-bold text-ink">Zero Completed Wire Disbursements</div>
                      <p className="text-xs text-mist mt-1">Disbursements appear here once cleared from escrow and processed by treasury.</p>
                    </td>
                  </tr>
                ) : (
                  receivedRows.map((row) => (
                    <tr key={row.id} className="hover:bg-canvas/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-ink">{row.id}</td>
                      <td className="py-3 px-4 font-mono font-bold text-signal">
                        {row.paidReference || "WIRE-CONFIRMED"}
                      </td>
                      <td className="py-3 px-4 font-bold text-ink">{row.candidate}</td>
                      <td className="py-3 px-4 font-display font-black text-emerald-700 text-sm">
                        {row.bountyEarned}
                      </td>
                      <td className="py-3 px-4 text-mist font-mono text-[11px]">{row.date}</td>
                      <td className="py-3 px-4 text-ink-soft">Chase Treasury Wire</td>
                      <td className="py-3 px-4 text-right">
                        <span className="inline-flex items-center gap-1 rounded-full bg-signal/15 px-2.5 py-0.5 text-[10px] font-bold text-signal border border-signal/30">
                          <CheckCircle className="h-3 w-3" />
                          <span>Paid &amp; Reconciled</span>
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

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
