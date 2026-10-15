"use client";

import React, { useState } from "react";
import {
  DollarSign,
  ShieldCheck,
  CheckCircle,
  Activity,
  FileText,
  X,
} from "@/components/ui/Icons";
import {
  ADMIN_FINANCE_RECORDS,
  AdminFinanceRecord,
  ADMIN_TELEMETRY,
} from "@/data/adminDashboardData";

export default function AdminFinancePage() {
  const [records, setRecords] = useState<AdminFinanceRecord[]>(ADMIN_FINANCE_RECORDS);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [selectedRecord, setSelectedRecord] = useState<AdminFinanceRecord | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const filteredRecords = records.filter((r) => {
    if (typeFilter === "escrow") return r.transactionType.includes("Escrow");
    if (typeFilter === "payout") return r.transactionType.includes("Milestone");
    if (typeFilter === "bounty") return r.transactionType.includes("Bounty");
    return true;
  });

  const handleApproveTransaction = (recordId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setRecords((prev) =>
      prev.map((r) => {
        if (r.id === recordId) {
          setNotification(`Transaction ${recordId} (${r.amount}) approved and funds disbursed.`);
          setTimeout(() => setNotification(null), 3500);
          const updated = {
            ...r,
            status: "Cleared and Settled" as const,
          };
          if (selectedRecord && selectedRecord.id === recordId) {
            setSelectedRecord(updated);
          }
          return updated;
        }
        return r;
      })
    );
  };

  const handleExportCSV = () => {
    setNotification("Financial ledger exported as audited CSV report.");
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-electric/30 bg-electric/10 px-3 py-0.5 text-xs font-semibold text-electric">
            <DollarSign size={13} />
            <span>SPRINT ESCROW & CONTRACTOR SETTLEMENT</span>
          </div>
          <h1 className="mt-2 font-display text-2xl font-bold text-ink">Escrow & Financial Ledger</h1>
          <p className="text-xs text-ink-soft">
            Direct visibility over enterprise sprint deposits, contractor milestone disbursements, and $500 referral bounties.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportCSV}
          className="rounded-xl bg-ink px-4 py-2.5 font-display text-xs font-semibold text-white shadow-xs hover:bg-electric transition-colors cursor-pointer"
        >
          Export Financial Report
        </button>
      </div>

      {/* Notification Banner */}
      {notification && (
        <div className="rounded-xl border border-signal/30 bg-signal/10 px-4 py-2.5 text-xs font-semibold text-signal flex items-center gap-2 animate-in fade-in-0 duration-200">
          <CheckCircle size={16} />
          <span>{notification}</span>
        </div>
      )}

      {/* Financial KPIs with Top-Right Icons */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-[#bcd6fa] bg-white p-5 shadow-xs flex flex-col justify-between hover:border-electric/40 transition-colors">
          <div className="flex items-start justify-between gap-2">
            <span className="text-[11px] font-semibold text-mist uppercase tracking-wider">Escrow in Vault</span>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-signal/10 text-signal border border-signal/20 shadow-2xs">
              <ShieldCheck size={18} />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight">
              {ADMIN_TELEMETRY.escrowVaultBalance}
            </div>
            <div className="mt-1 text-[11px] text-signal font-semibold">100% Protected Funds</div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#bcd6fa] bg-white p-5 shadow-xs flex flex-col justify-between hover:border-electric/40 transition-colors">
          <div className="flex items-start justify-between gap-2">
            <span className="text-[11px] font-semibold text-mist uppercase tracking-wider">Gross Platform Volume</span>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-electric/10 text-electric border border-electric/20 shadow-2xs">
              <DollarSign size={18} />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight">
              {ADMIN_TELEMETRY.grossPlatformVolume}
            </div>
            <div className="mt-1 text-[11px] text-signal font-semibold">{ADMIN_TELEMETRY.grossVolumeGrowth}</div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#bcd6fa] bg-white p-5 shadow-xs flex flex-col justify-between hover:border-electric/40 transition-colors">
          <div className="flex items-start justify-between gap-2">
            <span className="text-[11px] font-semibold text-mist uppercase tracking-wider">Disbursed This Month</span>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-electric/10 text-electric border border-electric/20 shadow-2xs">
              <Activity size={18} />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="font-display text-2xl sm:text-3xl font-bold text-ink tracking-tight">
              {ADMIN_TELEMETRY.escrowDisbursedThisMonth}
            </div>
            <div className="mt-1 text-[11px] text-ink-soft font-medium">To Contractors & Pods</div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#bcd6fa] bg-white p-5 shadow-xs flex flex-col justify-between hover:border-electric/40 transition-colors">
          <div className="flex items-start justify-between gap-2">
            <span className="text-[11px] font-semibold text-mist uppercase tracking-wider">Placement Fee Margin</span>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-signal/10 text-signal border border-signal/20 shadow-2xs">
              <DollarSign size={18} />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="font-display text-2xl sm:text-3xl font-bold text-signal tracking-tight">
              18.0%
            </div>
            <div className="mt-1 text-[11px] text-ink-soft font-medium">Platform Net Take-Rate</div>
          </div>
        </div>
      </div>

      {/* Transactions Master Ledger */}
      <div className="rounded-2xl border border-[#bcd6fa] bg-white shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#bcd6fa]/50 bg-canvas/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-display text-sm font-bold text-ink">Master Transaction & Settlement Ledger</h3>
            <p className="text-xs text-ink-soft">Real-time ledger events covering escrow locks, milestone releases, and referral bounties.</p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1 rounded-xl border border-[#bcd6fa] bg-white p-1 text-xs">
            <button
              type="button"
              onClick={() => setTypeFilter("all")}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer ${
                typeFilter === "all" ? "bg-ink text-white shadow-2xs" : "text-ink-soft hover:text-ink"
              }`}
            >
              All Records ({records.length})
            </button>
            <button
              type="button"
              onClick={() => setTypeFilter("escrow")}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer ${
                typeFilter === "escrow" ? "bg-ink text-white shadow-2xs" : "text-ink-soft hover:text-ink"
              }`}
            >
              Client Deposits
            </button>
            <button
              type="button"
              onClick={() => setTypeFilter("payout")}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer ${
                typeFilter === "payout" ? "bg-ink text-white shadow-2xs" : "text-ink-soft hover:text-ink"
              }`}
            >
              Pod Releases
            </button>
            <button
              type="button"
              onClick={() => setTypeFilter("bounty")}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer ${
                typeFilter === "bounty" ? "bg-ink text-white shadow-2xs" : "text-ink-soft hover:text-ink"
              }`}
            >
              $500 Bounties
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#bcd6fa]/60 bg-canvas/60 text-ink-soft">
              <tr>
                <th className="py-3 px-4 font-semibold">Tx ID</th>
                <th className="py-3 px-4 font-semibold">Transaction Type</th>
                <th className="py-3 px-4 font-semibold">Counterparty</th>
                <th className="py-3 px-4 font-semibold">Amount</th>
                <th className="py-3 px-4 font-semibold">Associated Pod</th>
                <th className="py-3 px-4 font-semibold">Settlement Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#bcd6fa]/40">
              {filteredRecords.map((r) => (
                <tr
                  key={r.id}
                  onClick={() => setSelectedRecord(r)}
                  className="hover:bg-canvas/40 transition-colors group cursor-pointer"
                >
                  <td className="py-3 px-4 font-mono text-xs font-bold text-electric">
                    {r.id}
                  </td>
                  <td className="py-3 px-4 font-medium text-ink group-hover:text-electric transition-colors">
                    {r.transactionType}
                  </td>
                  <td className="py-3 px-4 text-ink-soft">
                    {r.counterparty}
                  </td>
                  <td className="py-3 px-4 font-display font-bold text-ink">
                    {r.amount}
                  </td>
                  <td className="py-3 px-4">
                    {r.associatedPod ? (
                      <span className="font-mono text-xs font-semibold text-electric bg-electric/10 px-2 py-0.5 rounded-md">
                        {r.associatedPod}
                      </span>
                    ) : (
                      <span className="text-[11px] text-mist">General Platform</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10.5px] font-semibold ${
                        r.status === "Cleared and Settled"
                          ? "bg-signal/15 text-signal"
                          : r.status === "Escrow Locked"
                          ? "bg-electric/10 text-electric"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedRecord(r)}
                        className="rounded-lg bg-electric/10 text-electric hover:bg-electric hover:text-white px-2.5 py-1 text-xs font-semibold transition-colors cursor-pointer"
                      >
                        Inspect Invoice
                      </button>
                      {r.status === "Pending Approval" && (
                        <button
                          type="button"
                          onClick={(e) => handleApproveTransaction(r.id, e)}
                          className="rounded-lg bg-signal text-white px-2.5 py-1 text-xs font-semibold hover:bg-emerald-600 transition-colors cursor-pointer shadow-2xs"
                        >
                          Approve Payout
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audited Invoice & Escrow Receipt Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-xs p-4 animate-in fade-in-0 duration-150">
          <div
            className="w-full max-w-xl rounded-2xl border border-[#bcd6fa] bg-white p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto thin-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between border-b border-[#bcd6fa]/40 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-electric bg-electric/10 px-2 py-0.5 rounded-md">
                    {selectedRecord.id}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                      selectedRecord.status === "Cleared and Settled"
                        ? "bg-signal/15 text-signal"
                        : selectedRecord.status === "Escrow Locked"
                        ? "bg-electric/10 text-electric"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {selectedRecord.status}
                  </span>
                </div>
                <h2 className="font-display text-lg font-bold text-ink mt-1.5">{selectedRecord.transactionType}</h2>
                <p className="text-xs text-ink-soft">Counterparty: <span className="font-bold text-ink">{selectedRecord.counterparty}</span></p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="rounded-xl p-1.5 text-ink-soft hover:bg-canvas cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Total Amount Card */}
            <div className="rounded-xl bg-canvas/50 p-4 border border-[#bcd6fa]/50 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-mist font-semibold uppercase">Total Transaction Value</div>
                <div className="font-display text-2xl font-bold text-ink mt-0.5">{selectedRecord.amount}</div>
                <div className="text-[11px] text-mist">Recorded on {selectedRecord.date}</div>
              </div>
              {selectedRecord.feeMargin && (
                <span className="rounded-full bg-signal/15 px-3 py-1 text-xs font-bold text-signal">
                  {selectedRecord.feeMargin}
                </span>
              )}
            </div>

            {/* Itemized Invoice Receipt Breakdown */}
            {selectedRecord.invoiceReceipt && (
              <div className="space-y-3 text-xs">
                <div className="font-bold text-ink">Official Accounting Breakdown</div>
                
                <div className="p-3.5 rounded-xl border border-[#bcd6fa]/60 bg-white space-y-2">
                  <div className="flex justify-between border-b border-[#bcd6fa]/30 pb-2">
                    <span className="text-ink-soft">Official Invoice Reference:</span>
                    <span className="font-mono font-bold text-ink">{selectedRecord.invoiceReceipt.invoiceNumber}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#bcd6fa]/30 pb-2">
                    <span className="text-ink-soft">Client Billing Entity:</span>
                    <span className="font-semibold text-ink text-right">{selectedRecord.invoiceReceipt.clientBillingEntity}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#bcd6fa]/30 pb-2">
                    <span className="text-ink-soft">Gross Client Escrow Deposit:</span>
                    <span className="font-bold text-ink">{selectedRecord.invoiceReceipt.grossDepositAmount}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#bcd6fa]/30 pb-2">
                    <span className="text-ink-soft">Contractor Net Disbursement:</span>
                    <span className="font-semibold text-signal">{selectedRecord.invoiceReceipt.contractorNetDisbursement}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#bcd6fa]/30 pb-2">
                    <span className="text-ink-soft">Pepoltek Net Take-Rate Margin:</span>
                    <span className="font-bold text-electric">{selectedRecord.invoiceReceipt.pepoltekPlatformMargin}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-soft">Escrow Holdback Period:</span>
                    <span className="font-semibold text-ink">{selectedRecord.invoiceReceipt.escrowHoldbackDays} Days Standard Hold</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-canvas/40 border border-[#bcd6fa]/40 space-y-1">
                  <div className="text-[10px] text-mist font-semibold uppercase">Banking Wire Confirmation</div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-ink-soft">Settlement Channel:</span>
                    <span className="font-semibold text-ink">{selectedRecord.invoiceReceipt.clearingBank}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-ink-soft">Wire Reference:</span>
                    <span className="font-mono text-electric">{selectedRecord.invoiceReceipt.wireReferenceNumber}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-[#bcd6fa]/40">
              {selectedRecord.status === "Pending Approval" ? (
                <button
                  type="button"
                  onClick={() => handleApproveTransaction(selectedRecord.id)}
                  className="rounded-xl bg-signal px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-600 transition-colors cursor-pointer shadow-xs"
                >
                  Confirm & Disburse Funds
                </button>
              ) : (
                <span className="text-xs text-mist">Verified through Escrow Custody Vault</span>
              )}
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="rounded-xl bg-ink px-4 py-2 text-xs font-semibold text-white hover:bg-electric transition-colors cursor-pointer shadow-xs"
              >
                Close Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
