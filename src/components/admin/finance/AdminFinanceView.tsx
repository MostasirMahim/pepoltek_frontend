"use client";

import React, { useState, useTransition } from "react";
import {
  DollarSign,
  CheckCircle,
  X,
  Clock,
  Search,
  AlertTriangle,
  CreditCard,
  Eye,
} from "@/components/ui/Icons";

import {
  AdminLedgerRecord,
  AdminLedgerTelemetry,
  adminApprovePayoutAction,
  adminDisbursePayoutAction,
  adminCancelPayoutAction,
} from "@/actions/referral.actions";

interface AdminFinanceViewProps {
  initialRecords?: AdminLedgerRecord[];
  initialTelemetry?: AdminLedgerTelemetry;
}

export function AdminFinanceView({
  initialRecords = [],
  initialTelemetry,
}: AdminFinanceViewProps) {
  const [records, setRecords] = useState<AdminLedgerRecord[]>(initialRecords);
  const [telemetry, setTelemetry] = useState<AdminLedgerTelemetry | undefined>(initialTelemetry);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedRecord, setSelectedRecord] = useState<AdminLedgerRecord | null>(null);
  const [notification, setNotification] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Wire Disbursement Form State
  const [wireRef, setWireRef] = useState("");
  const [wireMethod, setWireMethod] = useState("Bank Wire / Fedwire");
  const [disburseNote, setDisburseNote] = useState("");

  // Cancel Payout Form State
  const [showCancelPrompt, setShowCancelPrompt] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const [isPending, startTransition] = useTransition();

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setNotification({ type, text });
    setTimeout(() => setNotification(null), 4500);
  };

  const filteredRecords = records.filter((r) => {
    const matchesFilter =
      statusFilter === "all" ? true : r.status.toLowerCase() === statusFilter.toLowerCase();
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      r.id.toLowerCase().includes(query) ||
      r.candidate_name.toLowerCase().includes(query) ||
      r.referrer_name.toLowerCase().includes(query) ||
      r.referrer_email.toLowerCase().includes(query) ||
      (r.paid_reference && r.paid_reference.toLowerCase().includes(query));
    return matchesFilter && matchesSearch;
  });

  const handleApprove = (record: AdminLedgerRecord, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    startTransition(async () => {
      const res = await adminApprovePayoutAction(record.raw_id);
      if (res.success) {
        setRecords((prev) =>
          prev.map((r) =>
            r.raw_id === record.raw_id
              ? {
                  ...r,
                  status: "approved",
                  status_display: "Approved (Ready for Wire)",
                  approved_at: new Date().toISOString(),
                }
              : r
          )
        );
        if (selectedRecord?.raw_id === record.raw_id) {
          setSelectedRecord((prev) =>
            prev ? { ...prev, status: "approved", status_display: "Approved (Ready for Wire)" } : null
          );
        }
        showToast(`Payout ${record.id} (${record.amount_display}) approved for disbursement.`);
      } else {
        showToast(res.error || "Failed to approve payout.", "error");
      }
    });
  };

  const handleDisburse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecord) return;
    if (!wireRef.trim()) {
      showToast("External wire or transaction reference is required.", "error");
      return;
    }

    startTransition(async () => {
      const res = await adminDisbursePayoutAction(selectedRecord.raw_id, {
        paid_reference: wireRef.trim(),
        payment_method: wireMethod,
        note: disburseNote.trim(),
      });

      if (res.success) {
        const refSaved = wireRef.trim();
        setRecords((prev) =>
          prev.map((r) =>
            r.raw_id === selectedRecord.raw_id
              ? {
                  ...r,
                  status: "paid",
                  status_display: "Cleared & Paid",
                  paid_reference: refSaved,
                  paid_at: new Date().toISOString(),
                }
              : r
          )
        );
        setSelectedRecord((prev) =>
          prev
            ? {
                ...prev,
                status: "paid",
                status_display: "Cleared & Paid",
                paid_reference: refSaved,
                paid_at: new Date().toISOString(),
              }
            : null
        );
        setWireRef("");
        setDisburseNote("");
        showToast(`Wire disbursement recorded (${refSaved}). Bounty marked settled.`);
      } else {
        showToast(res.error || "Failed to disburse payout.", "error");
      }
    });
  };

  const handleCancel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecord) return;
    if (!cancelReason.trim()) {
      showToast("Cancellation audit reason is required.", "error");
      return;
    }

    startTransition(async () => {
      const res = await adminCancelPayoutAction(selectedRecord.raw_id, cancelReason.trim());
      if (res.success) {
        setRecords((prev) =>
          prev.map((r) =>
            r.raw_id === selectedRecord.raw_id
              ? {
                  ...r,
                  status: "cancelled",
                  status_display: "Cancelled / Revoked",
                  note: `${r.note} | Cancelled: ${cancelReason}`.trim(),
                }
              : r
          )
        );
        setSelectedRecord((prev) =>
          prev
            ? {
                ...prev,
                status: "cancelled",
                status_display: "Cancelled / Revoked",
              }
            : null
        );
        setShowCancelPrompt(false);
        setCancelReason("");
        showToast(`Payout ${selectedRecord.id} revoked.`);
      } else {
        showToast(res.error || "Failed to cancel payout.", "error");
      }
    });
  };

  const handleExportCSV = () => {
    if (filteredRecords.length === 0) {
      showToast("No ledger records to export.", "error");
      return;
    }
    const headers = [
      "Entry ID",
      "Date",
      "Referrer Name",
      "Referrer Email",
      "Candidate Name",
      "Track",
      "Milestone",
      "Amount USD",
      "Status",
      "Wire Reference",
      "Paid At",
    ];
    const csvRows = [
      headers.join(","),
      ...filteredRecords.map((r) =>
        [
          `"${r.id}"`,
          `"${r.date}"`,
          `"${r.referrer_name}"`,
          `"${r.referrer_email}"`,
          `"${r.candidate_name}"`,
          `"${r.track}"`,
          `"${r.milestone}"`,
          r.amount_usd,
          `"${r.status}"`,
          `"${r.paid_reference || ""}"`,
          `"${r.paid_at || ""}"`,
        ].join(",")
      ),
    ];
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `pepoltek-escrow-ledger-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Audited escrow ledger exported as CSV.");
  };

  const pendingOrApprovedCount = records.filter(
    (r) => r.status === "pending" || r.status === "approved"
  ).length;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-signal/30 bg-signal/10 px-3 py-0.5 text-xs font-semibold text-signal">
            <DollarSign size={13} />
            <span>ESCROW LEDGER &amp; DOUBLE-ENTRY AUDIT</span>
          </div>
          <h1 className="mt-2 font-display text-2xl font-bold text-ink">Financial Escrow &amp; Payouts</h1>
          <p className="text-xs text-ink-soft">
            Manage client milestone deposits, specialist disbursements, and referral bounty payouts under full bank wire reconciliation.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportCSV}
          className="rounded-xl bg-ink px-4 py-2.5 font-display text-xs font-semibold text-white shadow-xs hover:bg-electric transition-colors cursor-pointer"
        >
          Export Audited Ledger (CSV)
        </button>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div
          className={`rounded-xl border px-4 py-2.5 text-xs font-semibold flex items-center gap-2 animate-in fade-in-0 duration-200 ${
            notification.type === "success"
              ? "border-signal/30 bg-signal/10 text-signal"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {notification.type === "success" ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
          <span>{notification.text}</span>
        </div>
      )}

      {/* Finance Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-3xl border border-[#bcd6fa] bg-white p-6 shadow-xs space-y-2">
          <span className="font-mono text-xs text-mist uppercase tracking-wider block">Escrow Vault Balance</span>
          <div className="font-display text-2xl sm:text-3xl font-extrabold text-ink">
            ${(telemetry?.escrow_vault_balance ?? 25000).toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
          <p className="text-[11px] text-signal font-semibold">100% FDIC &amp; Barred Account Backed</p>
        </div>

        <div className="rounded-3xl border border-[#bcd6fa] bg-white p-6 shadow-xs space-y-2">
          <span className="font-mono text-xs text-mist uppercase tracking-wider block">Referral Bounties Paid</span>
          <div className="font-display text-2xl sm:text-3xl font-extrabold text-ink">
            ${(telemetry?.total_paid_usd ?? 0).toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
          <p className="text-[11px] text-signal font-semibold">Zero chargebacks on vetted hires</p>
        </div>

        <div className="rounded-3xl border border-[#bcd6fa] bg-white p-6 shadow-xs space-y-2">
          <span className="font-mono text-xs text-mist uppercase tracking-wider block">Pending Releases</span>
          <div className="font-display text-2xl sm:text-3xl font-extrabold text-electric">
            ${((telemetry?.pending_payouts_usd ?? 0) + (telemetry?.approved_payouts_usd ?? 0)).toLocaleString(
              "en-US",
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }
            )}
          </div>
          <p className="text-[11px] text-ink-soft">
            {pendingOrApprovedCount} payout requests awaiting signoff or wire
          </p>
        </div>

        <div className="rounded-3xl border border-[#bcd6fa] bg-white p-6 shadow-xs space-y-2">
          <span className="font-mono text-xs text-mist uppercase tracking-wider block">Active Referrers</span>
          <div className="font-display text-2xl sm:text-3xl font-extrabold text-ink">
            {telemetry?.active_referrers_count ?? 0}
          </div>
          <p className="text-[11px] text-ink-soft">
            {telemetry?.total_referrals_count ?? records.length} total candidate nominations
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 rounded-2xl border border-[#bcd6fa]/70 bg-white p-2.5 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto thin-scrollbar pb-1 lg:pb-0">
          {[
            { id: "all", label: `All (${records.length})` },
            { id: "pending", label: `Pending (${records.filter((r) => r.status === "pending").length})` },
            { id: "approved", label: `Approved (${records.filter((r) => r.status === "approved").length})` },
            { id: "paid", label: `Cleared & Paid (${records.filter((r) => r.status === "paid").length})` },
            { id: "cancelled", label: `Cancelled (${records.filter((r) => r.status === "cancelled").length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              className={`rounded-lg px-2.5 py-1.5 font-mono text-[11px] font-medium whitespace-nowrap transition-all cursor-pointer ${
                statusFilter === tab.id
                  ? "bg-ink text-white shadow-xs"
                  : "text-ink-soft hover:bg-canvas hover:text-ink"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-mist" size={13} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search candidate, referrer, ref..."
              className="w-52 sm:w-64 rounded-lg border border-[#bcd6fa]/70 bg-slate-50/60 pl-8 pr-3 py-1.5 font-mono text-xs text-ink placeholder:text-mist focus:border-electric focus:bg-white focus:outline-hidden"
            />
          </div>
          <span className="font-mono text-[10.5px] text-slate-400 whitespace-nowrap hidden sm:inline">
            Showing {filteredRecords.length} entries
          </span>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="rounded-2xl border border-[#bcd6fa]/70 bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto thin-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="border-b border-[#bcd6fa]/60 bg-slate-50/80 font-mono text-[10px] text-slate-500 uppercase tracking-wider select-none">
              <tr>
                <th className="px-4 py-2.5 font-semibold text-slate-600 whitespace-nowrap w-[170px]">Entry ID &amp; Date</th>
                <th className="px-4 py-2.5 font-semibold text-slate-600 whitespace-nowrap">Beneficiary (Referrer)</th>
                <th className="px-4 py-2.5 font-semibold text-slate-600 whitespace-nowrap">Candidate &amp; Milestone</th>
                <th className="px-4 py-2.5 font-semibold text-slate-600 whitespace-nowrap w-[100px]">Amount</th>
                <th className="px-4 py-2.5 font-semibold text-slate-600 whitespace-nowrap w-[150px]">Settlement Reference</th>
                <th className="px-4 py-2.5 font-semibold text-slate-600 whitespace-nowrap w-[140px]">Status</th>
                <th className="px-4 py-2.5 font-semibold text-slate-600 text-right whitespace-nowrap w-[150px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#bcd6fa]/30 text-ink">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-ink-soft">
                    <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-canvas border border-[#bcd6fa]/50 text-mist mb-2">
                      <DollarSign size={18} />
                    </div>
                    <div className="font-display text-xs font-bold text-ink">No Ledger Records Found</div>
                    <p className="text-[11px] text-mist mt-0.5 max-w-sm mx-auto">
                      Referral bounties, specialist milestones, and escrow releases matching your filter will be listed here.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredRecords.map((r) => (
                  <tr
                    key={r.id}
                    onClick={() => {
                      setSelectedRecord(r);
                      setShowCancelPrompt(false);
                      setWireRef("");
                    }}
                    className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                  >
                    <td className="px-4 py-2.5 align-middle whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] text-slate-700 bg-slate-100/90 px-2 py-0.5 rounded border border-slate-200/80 font-medium">
                          {r.id}
                        </span>
                        <span className="font-mono text-[10.5px] text-slate-400">{r.date}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 align-middle whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[12.5px] font-semibold text-ink">{r.referrer_name}</span>
                        <span className="text-[10.5px] text-slate-400 font-mono">({r.referrer_email})</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 align-middle whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-[12.5px] font-semibold text-ink">{r.candidate_name}</span>
                        <span className="font-mono text-[9.5px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 uppercase font-medium">
                          {r.milestone.replace(/_/g, " ")} • {r.track}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 align-middle font-display text-xs font-bold text-ink whitespace-nowrap">
                      {r.amount_display}
                    </td>
                    <td className="px-4 py-2.5 align-middle font-mono text-[10.5px] text-slate-500 whitespace-nowrap">
                      {r.paid_reference || "PENDING-WIRE"}
                    </td>
                    <td className="px-4 py-2.5 align-middle whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 font-mono text-[10px] font-medium border ${
                          r.status === "paid"
                            ? "bg-emerald-50/80 text-emerald-700 border-emerald-200/80"
                            : r.status === "approved"
                            ? "bg-sky-50 text-sky-700 border-sky-200/80"
                            : r.status === "pending"
                            ? "bg-amber-50/80 text-amber-700 border-amber-200/80"
                            : "bg-rose-50/80 text-rose-700 border-rose-200/80"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            r.status === "paid"
                              ? "bg-emerald-500"
                              : r.status === "approved"
                              ? "bg-sky-500"
                              : r.status === "pending"
                              ? "bg-amber-500"
                              : "bg-rose-500"
                          }`}
                        />
                        <span>{r.status_display || r.status}</span>
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right align-middle whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* View Details on Right-Side Sheet */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRecord(r);
                            setShowCancelPrompt(false);
                            setWireRef("");
                          }}
                          title="View Payout Dossier & Wire Details on Right Sheet"
                          aria-label="View Details"
                          className="inline-flex h-7 items-center gap-1 px-2.5 rounded-md border border-slate-200 bg-white text-slate-600 hover:text-ink hover:border-slate-300 hover:bg-slate-50 active:scale-95 transition-all cursor-pointer shadow-2xs font-mono text-[10.5px] font-medium"
                        >
                          <Eye size={12} strokeWidth={1.8} />
                          <span>View</span>
                        </button>

                        {r.status === "pending" && (
                          <button
                            type="button"
                            onClick={(e) => handleApprove(r, e)}
                            disabled={isPending}
                            className="inline-flex h-7 items-center px-2.5 rounded-md bg-electric font-mono text-[10.5px] font-semibold text-white hover:bg-electric-bright transition-all cursor-pointer shadow-2xs disabled:opacity-50"
                          >
                            Approve
                          </button>
                        )}
                        {r.status === "approved" && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedRecord(r);
                              setShowCancelPrompt(false);
                              setWireRef("");
                            }}
                            className="inline-flex h-7 items-center px-2.5 rounded-md bg-ink font-mono text-[10.5px] font-semibold text-white hover:bg-electric transition-all cursor-pointer shadow-2xs"
                          >
                            Disburse Wire
                          </button>
                        )}
                        {r.status === "paid" && (
                          <span className="font-mono text-[10px] text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200/80 font-medium inline-flex items-center">
                            Settled
                          </span>
                        )}
                        {r.status === "cancelled" && (
                          <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-2 py-1 rounded border border-slate-200 font-medium inline-flex items-center">
                            Revoked
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction & Disbursement Detail Slide-Over Sheet (House Style & Design Rule: Right-Side Sheet) */}
      {selectedRecord && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-ink/40 backdrop-blur-xs animate-in fade-in-0 duration-150"
          onClick={() => setSelectedRecord(null)}
        >
          <div
            className="w-full max-w-lg bg-white h-full shadow-2xl p-6 sm:p-8 flex flex-col justify-between overflow-y-auto thin-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-6">
              {/* Sheet Header */}
              <div className="flex items-start justify-between border-b border-[#bcd6fa]/40 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-electric">{selectedRecord.id}</span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold ${
                        selectedRecord.status === "paid"
                          ? "bg-signal/15 text-signal"
                          : selectedRecord.status === "approved"
                          ? "bg-electric/15 text-electric"
                          : selectedRecord.status === "pending"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {selectedRecord.status_display}
                    </span>
                  </div>
                  <h2 className="font-display text-2xl font-bold text-ink mt-2">
                    {selectedRecord.amount_display}
                  </h2>
                  <p className="text-xs text-ink-soft">
                    Candidate Placement Bounty: {selectedRecord.candidate_name}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedRecord(null)}
                  className="rounded-xl p-2 text-ink-soft hover:bg-canvas cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Dossier Details */}
              <div className="rounded-2xl border border-[#bcd6fa]/60 bg-canvas/30 p-4 space-y-2.5 text-xs">
                <span className="font-mono text-[10px] text-mist uppercase tracking-wider block">
                  Placement &amp; Beneficiary Dossier
                </span>
                <div className="flex justify-between py-1 border-b border-[#bcd6fa]/30">
                  <span className="text-ink-soft">Candidate Name:</span>
                  <span className="font-bold text-ink">{selectedRecord.candidate_name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#bcd6fa]/30">
                  <span className="text-ink-soft">Requisition / Domain Track:</span>
                  <span className="font-mono text-ink">{selectedRecord.track}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#bcd6fa]/30">
                  <span className="text-ink-soft">Referrer (Beneficiary):</span>
                  <span className="font-semibold text-ink">
                    {selectedRecord.referrer_name} ({selectedRecord.referrer_email})
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#bcd6fa]/30">
                  <span className="text-ink-soft">Milestone Target:</span>
                  <span className="font-mono text-ink uppercase">
                    {selectedRecord.milestone.replace(/_/g, " ")}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-ink-soft">Creation Date:</span>
                  <span className="font-mono text-ink">{selectedRecord.date}</span>
                </div>
                {selectedRecord.note && (
                  <div className="pt-2 border-t border-[#bcd6fa]/30 text-[11px] text-mist italic">
                    Note: {selectedRecord.note}
                  </div>
                )}
              </div>

              {/* State 1: Pending Sign-Off */}
              {selectedRecord.status === "pending" && !showCancelPrompt && (
                <div className="space-y-3 rounded-2xl border border-amber-200 bg-amber-50/50 p-4">
                  <div className="flex items-center gap-2 text-amber-900 font-semibold text-xs">
                    <Clock size={16} />
                    <span>Awaiting Administrative Sign-Off</span>
                  </div>
                  <p className="text-xs text-amber-800">
                    Verify candidate retention in active placement before authorizing disbursement.
                  </p>
                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => handleApprove(selectedRecord)}
                      className="flex-1 rounded-xl bg-electric py-2.5 font-display text-xs font-bold text-white hover:bg-electric-bright transition-all cursor-pointer shadow-xs disabled:opacity-50"
                    >
                      {isPending ? "Approving..." : "Approve for Wire Release"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCancelPrompt(true)}
                      className="rounded-xl border border-red-200 bg-white px-3 py-2.5 font-display text-xs font-semibold text-red-600 hover:bg-red-50 cursor-pointer"
                    >
                      Cancel Payout
                    </button>
                  </div>
                </div>
              )}

              {/* State 2: Approved Awaiting Wire Disbursement */}
              {selectedRecord.status === "approved" && (
                <form
                  onSubmit={handleDisburse}
                  className="space-y-4 rounded-2xl border border-electric/30 bg-electric/5 p-4"
                >
                  <div className="flex items-center gap-2 text-electric font-bold text-xs">
                    <CreditCard size={16} />
                    <span>Bank Wire Disbursement &amp; Reconciliation</span>
                  </div>
                  <p className="text-xs text-ink-soft">
                    Enter the banking confirmation reference code to permanently reconcile this bounty payout in the audited ledger.
                  </p>

                  <div className="space-y-1.5">
                    <label className="font-mono text-[11px] font-semibold text-ink">
                      Disbursement Rail / Method
                    </label>
                    <select
                      value={wireMethod}
                      onChange={(e) => setWireMethod(e.target.value)}
                      className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 text-xs font-semibold text-ink focus:border-electric focus:outline-hidden"
                    >
                      <option value="Bank Wire / Fedwire">Fedwire / Bank Wire (Same Day)</option>
                      <option value="ACH Direct Deposit">ACH Direct Deposit (Next Day)</option>
                      <option value="SWIFT / Wise">SWIFT International / Wise</option>
                      <option value="Corporate Check">Corporate Check / Remittance</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-mono text-[11px] font-semibold text-ink">
                      Bank Wire / Transfer Reference Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={wireRef}
                      onChange={(e) => setWireRef(e.target.value)}
                      placeholder="e.g. WIRE-2026-CHASE-99214"
                      className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 font-mono text-xs text-ink placeholder:text-mist focus:border-electric focus:outline-hidden"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-mono text-[11px] font-semibold text-ink">
                      Settlement Audit Note (Optional)
                    </label>
                    <input
                      type="text"
                      value={disburseNote}
                      onChange={(e) => setDisburseNote(e.target.value)}
                      placeholder="e.g. Cleared via treasury account"
                      className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 text-xs text-ink placeholder:text-mist focus:border-electric focus:outline-hidden"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isPending}
                    className="w-full rounded-xl bg-ink py-2.5 font-display text-xs font-bold text-white hover:bg-electric transition-all cursor-pointer shadow-xs disabled:opacity-50"
                  >
                    {isPending ? "Settling Ledger..." : "Confirm Wire & Mark Settled"}
                  </button>
                </form>
              )}

              {/* State 3: Paid & Settled Audit Proof */}
              {selectedRecord.status === "paid" && (
                <div className="space-y-3 rounded-2xl border border-signal/30 bg-signal/5 p-4 text-xs">
                  <div className="flex items-center gap-2 text-signal font-bold">
                    <CheckCircle size={16} />
                    <span>Double-Entry Wire Settlement Confirmed</span>
                  </div>
                  <div className="space-y-1.5 font-mono text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-mist">Wire Reference:</span>
                      <span className="font-bold text-ink">{selectedRecord.paid_reference}</span>
                    </div>
                    {selectedRecord.paid_at && (
                      <div className="flex justify-between">
                        <span className="text-mist">Disbursement Timestamp:</span>
                        <span className="text-ink">{selectedRecord.paid_at}</span>
                      </div>
                    )}
                    {selectedRecord.approved_by && (
                      <div className="flex justify-between">
                        <span className="text-mist">Dual-Signoff By:</span>
                        <span className="text-ink">{selectedRecord.approved_by}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Cancel Prompt Form */}
              {showCancelPrompt && (
                <form
                  onSubmit={handleCancel}
                  className="space-y-3 rounded-2xl border border-red-200 bg-red-50/50 p-4 text-xs"
                >
                  <div className="flex items-center gap-2 text-red-700 font-bold">
                    <AlertTriangle size={16} />
                    <span>Revoke Payout Authorization</span>
                  </div>
                  <p className="text-xs text-red-600">
                    State the regulatory or operational reason for cancelling this bounty. This will be permanently written to the audit log.
                  </p>
                  <textarea
                    required
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    placeholder="e.g. Candidate departed placement prior to 90-day vesting milestone."
                    rows={2}
                    className="w-full rounded-xl border border-red-200 bg-white p-2.5 text-xs text-ink placeholder:text-mist focus:border-red-500 focus:outline-hidden"
                  />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={isPending}
                      className="flex-1 rounded-xl bg-red-600 py-2 font-display text-xs font-bold text-white hover:bg-red-700 cursor-pointer disabled:opacity-50"
                    >
                      {isPending ? "Revoking..." : "Confirm Revocation"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCancelPrompt(false)}
                      className="rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 font-display text-xs font-semibold text-ink-soft hover:bg-canvas cursor-pointer"
                    >
                      Back
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Sheet Footer */}
            <div className="pt-6 border-t border-[#bcd6fa]/40 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="rounded-xl px-4 py-2 font-display text-xs font-semibold text-ink-soft hover:bg-canvas cursor-pointer"
              >
                Close Sheet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
