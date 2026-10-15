"use client";

import { useState } from "react";
import {
  DollarSign,
  Users,
  Copy,
  Check,
  ArrowRight,
  Clock,
  ShieldCheck,
  CheckCircle,
  FileText,
  X,
  CreditCard,
} from "@/components/ui/Icons";
import {
  REFERRAL_RECORDS,
  BOUNTY_SUMMARY,
  ReferralRecord,
} from "@/data/talentDashboardData";

export default function CandidateReferralsPage() {
  const [referrals, setReferrals] = useState<ReferralRecord[]>(REFERRAL_RECORDS);
  const [referralLink] = useState(BOUNTY_SUMMARY.referralLink);
  const [copied, setCopied] = useState(false);

  // Form submission states
  const [refName, setRefName] = useState("");
  const [refEmail, setRefEmail] = useState("");
  const [refRole, setRefRole] = useState("");
  const [refSector, setRefSector] = useState<"Technology" | "Healthcare">("Technology");
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  // Payout Modal states
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const [selectedRecordForPayout, setSelectedRecordForPayout] = useState<ReferralRecord | null>(null);
  const [payoutAccount, setPayoutAccount] = useState<"us_checking" | "uk_bacs">("us_checking");
  const [isDisbursing, setIsDisbursing] = useState(false);
  const [payoutSuccessReceipt, setPayoutSuccessReceipt] = useState<{
    amount: string;
    refNumber: string;
    accountText: string;
  } | null>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!refName || !refEmail || !refRole) return;

    const newRecord: ReferralRecord = {
      id: `REF-${Math.floor(100 + Math.random() * 900)}`,
      candidateName: refName,
      role: refRole,
      sector: refSector,
      stage: "Submitted",
      stageIndex: 1,
      bountyAmount: "$500.00",
      payoutStatus: "Pending Placement",
      submittedDate: "Just now",
    };

    setReferrals([newRecord, ...referrals]);
    setSubmittedMessage(`Referral for ${refName} recorded. A tracking timestamp has been generated.`);
    setRefName("");
    setRefEmail("");
    setRefRole("");

    setTimeout(() => {
      setSubmittedMessage(null);
    }, 4000);
  };

  const handleConfirmDisbursement = () => {
    setIsDisbursing(true);
    setTimeout(() => {
      setIsDisbursing(false);
      const generatedRef = `BACS-REF-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const accountDesc = payoutAccount === "us_checking" ? "Chase Checking (**** 3901)" : "Barclays Commercial (**** 8492)";
      const amountClaimed = selectedRecordForPayout ? selectedRecordForPayout.bountyAmount : "$1,000.00";

      // Mark relevant records as Disbursed
      setReferrals((prev) =>
        prev.map((r) => {
          if (selectedRecordForPayout) {
            return r.id === selectedRecordForPayout.id ? { ...r, payoutStatus: "Cleared for Payout" } : r;
          } else {
            return r.payoutStatus === "Cleared for Payout" ? { ...r, payoutStatus: "Cleared for Payout" } : r;
          }
        })
      );

      setPayoutSuccessReceipt({
        amount: amountClaimed,
        refNumber: generatedRef,
        accountText: accountDesc,
      });
    }, 900);
  };

  const clearedRecords = referrals.filter((r) => r.payoutStatus === "Cleared for Payout");

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-electric/30 bg-gradient-to-r from-ink via-[#0d1f3d] to-ink p-6 sm:p-8 text-white shadow-md">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-electric/40 bg-electric/20 px-3 py-0.5 text-[11px] font-mono text-electric-bright">
              <span>PEPOLTEK BOUNTY LEDGER</span>
            </div>
            <h1 className="mt-2.5 font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
              Refer and Earn Bounty Marketplace
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-gray-300 max-w-xl leading-relaxed">
              Refer software architects or clinical specialists. Earn a flat <strong className="text-white">$500 cash bounty per placement</strong> on our escrow-backed ledger.
            </p>
          </div>

          {/* Quick Bounty Stats & Claim CTA */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="flex items-center gap-4 rounded-2xl border border-white/20 bg-white/10 p-4 sm:p-5 backdrop-blur-xs">
              <div>
                <div className="font-mono text-[10px] uppercase text-gray-300">Cleared Bounties</div>
                <div className="font-display text-2xl sm:text-3xl font-extrabold text-signal">
                  {BOUNTY_SUMMARY.clearedPayout}
                </div>
              </div>
              <div className="h-10 w-px bg-white/20" />
              <div>
                <div className="font-mono text-[10px] uppercase text-gray-300">In Pipeline</div>
                <div className="font-display text-2xl sm:text-3xl font-extrabold text-electric-bright">
                  {BOUNTY_SUMMARY.escrowLocked}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setSelectedRecordForPayout(null);
                setPayoutSuccessReceipt(null);
                setIsPayoutModalOpen(true);
              }}
              className="w-full sm:w-auto rounded-2xl bg-signal hover:bg-emerald-600 px-5 py-4 font-display text-xs sm:text-sm font-bold text-white shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <DollarSign size={16} />
              <span>Withdraw Cleared Cash</span>
            </button>
          </div>
        </div>

        {/* Unique Link Box */}
        <div className="relative z-10 mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex-1">
            <span className="font-mono text-[11px] text-gray-300">Your Shareable Tracking URL:</span>
            <div className="mt-1 font-mono text-xs text-electric-bright bg-[#060b14]/80 px-4 py-2.5 rounded-xl border border-white/15 truncate select-all">
              {referralLink}
            </div>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="self-start sm:self-end inline-flex items-center gap-1.5 rounded-xl bg-electric px-5 py-2.5 font-display text-xs font-bold text-white hover:bg-electric-bright transition-colors shadow-xs cursor-pointer"
          >
            {copied ? (
              <>
                <Check size={14} />
                <span>Copied Link</span>
              </>
            ) : (
              <>
                <Copy size={14} />
                <span>Copy Invite Link</span>
              </>
            )}
          </button>
        </div>

        <div
          className="pointer-events-none absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: "20px 20px",
          }}
        />
      </div>

      {submittedMessage && (
        <div className="rounded-2xl border border-signal/40 bg-signal/10 p-4 text-xs text-signal flex items-center gap-2.5 shadow-2xs">
          <CheckCircle size={18} />
          <span className="font-semibold">{submittedMessage}</span>
        </div>
      )}

      {/* Split: Direct Referral Form & Payout Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Form: Submit Candidate (4 cols) */}
        <div className="lg:col-span-4 rounded-3xl border border-[#bcd6fa] bg-white p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-electric/10 text-electric">
              <Users size={16} />
            </div>
            <h2 className="font-display text-base font-bold text-ink">Submit Candidate Directly</h2>
          </div>
          <p className="text-xs text-ink-soft leading-relaxed">
            Directly introduce a colleague to lock in your referral bounty timestamp before they apply elsewhere.
          </p>

          <form onSubmit={handleReferSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-mono text-[11px] font-semibold uppercase text-ink-soft mb-1">
                Candidate Full Name
              </label>
              <input
                type="text"
                required
                value={refName}
                onChange={(e) => setRefName(e.target.value)}
                placeholder="e.g. David Kim or Dr. Watson"
                className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/30 p-2.5 text-sm text-ink focus:border-electric focus:bg-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-mono text-[11px] font-semibold uppercase text-ink-soft mb-1">
                Work Email Address
              </label>
              <input
                type="email"
                required
                value={refEmail}
                onChange={(e) => setRefEmail(e.target.value)}
                placeholder="colleague@engineer.com"
                className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/30 p-2.5 text-sm text-ink focus:border-electric focus:bg-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-mono text-[11px] font-semibold uppercase text-ink-soft mb-1">
                Primary Specialty / Role
              </label>
              <input
                type="text"
                required
                value={refRole}
                onChange={(e) => setRefRole(e.target.value)}
                placeholder="e.g. Senior Kafka Architect or ICU Lead"
                className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/30 p-2.5 text-sm text-ink focus:border-electric focus:bg-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-mono text-[11px] font-semibold uppercase text-ink-soft mb-1">
                Sector
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRefSector("Technology")}
                  className={`rounded-xl py-2 font-display text-xs font-semibold border transition-all cursor-pointer ${
                    refSector === "Technology"
                      ? "border-electric bg-electric/10 text-electric"
                      : "border-[#bcd6fa]/60 bg-canvas/30 text-ink-soft"
                  }`}
                >
                  Technology
                </button>
                <button
                  type="button"
                  onClick={() => setRefSector("Healthcare")}
                  className={`rounded-xl py-2 font-display text-xs font-semibold border transition-all cursor-pointer ${
                    refSector === "Healthcare"
                      ? "border-signal bg-signal/10 text-signal"
                      : "border-[#bcd6fa]/60 bg-canvas/30 text-ink-soft"
                  }`}
                >
                  Healthcare
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-ink py-2.5 font-display text-xs font-bold text-white hover:bg-electric transition-colors shadow-xs cursor-pointer"
            >
              Submit Referral & Claim Timestamp
            </button>
          </form>
        </div>

        {/* Right Ledger: Referral Tracking Pipeline (8 cols) */}
        <div className="lg:col-span-8 rounded-3xl border border-[#bcd6fa] bg-white p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#bcd6fa]/30 pb-4">
            <div>
              <h2 className="font-display text-base font-bold text-ink">Bounty Payout Ledger</h2>
              <p className="text-xs text-ink-soft">Milestone progression following Submitted, Screened, Interviewed, and Placed.</p>
            </div>
            <span className="font-mono text-xs text-electric font-semibold">
              {referrals.length} Tracked Candidates
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#bcd6fa]/50 font-mono text-mist uppercase text-[11px]">
                  <th className="pb-3 font-semibold">Candidate</th>
                  <th className="pb-3 font-semibold">Specialty</th>
                  <th className="pb-3 font-semibold">Stage</th>
                  <th className="pb-3 font-semibold">Bounty</th>
                  <th className="pb-3 font-semibold text-right">Status & Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#bcd6fa]/30">
                {referrals.map((ref) => (
                  <tr key={ref.id} className="hover:bg-canvas/40 transition-colors">
                    <td className="py-3.5 pr-2">
                      <div className="font-display font-bold text-ink">{ref.candidateName}</div>
                      <div className="font-mono text-[10.5px] text-mist">{ref.id} • {ref.submittedDate}</div>
                    </td>
                    <td className="py-3.5 text-ink-soft">
                      <div>{ref.role}</div>
                      <span className="font-mono text-[10px] text-mist">{ref.sector}</span>
                    </td>
                    <td className="py-3.5">
                      <span className="rounded-lg bg-canvas border border-[#bcd6fa]/60 px-2.5 py-1 font-mono text-[10px] text-ink font-semibold">
                        {ref.stage}
                      </span>
                    </td>
                    <td className="py-3.5 font-mono font-bold text-ink">{ref.bountyAmount}</td>
                    <td className="py-3.5 text-right space-y-1">
                      <div>
                        <span
                          className={`inline-block rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold ${
                            ref.payoutStatus === "Cleared for Payout"
                              ? "bg-signal/15 text-signal border border-signal/30"
                              : ref.payoutStatus === "Escrow Locked"
                              ? "bg-electric/15 text-electric border border-electric/30"
                              : "bg-amber-100 text-amber-800 border border-amber-300"
                          }`}
                        >
                          {ref.payoutStatus}
                        </span>
                      </div>

                      {ref.payoutStatus === "Cleared for Payout" && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedRecordForPayout(ref);
                            setPayoutSuccessReceipt(null);
                            setIsPayoutModalOpen(true);
                          }}
                          className="inline-flex items-center gap-1 font-mono text-[10.5px] font-bold text-signal hover:underline cursor-pointer"
                        >
                          <span>Disburse $500 →</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Payout Claim & Bank Disbursement Modal */}
      {isPayoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 backdrop-blur-xs p-4 animate-in fade-in-0 duration-150">
          <div
            className="w-full max-w-lg rounded-3xl border border-[#bcd6fa] bg-white p-6 sm:p-7 shadow-2xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[#bcd6fa]/40 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-signal/15 px-2.5 py-0.5 text-[10px] font-mono font-bold text-signal">
                  <ShieldCheck size={13} />
                  <span>ESCROW BOUNTY DISBURSEMENT GATEWAY</span>
                </div>
                <h3 className="font-display text-lg font-bold text-ink mt-1.5">
                  Claim Cleared Cash Bounty
                </h3>
                <p className="text-xs text-ink-soft">
                  Funds will be disbursed via automated clearing house directly into your connected account.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsPayoutModalOpen(false)}
                className="rounded-xl p-1.5 text-ink-soft hover:bg-canvas cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {!payoutSuccessReceipt ? (
              <div className="space-y-4 text-xs">
                {/* Amount to Claim */}
                <div className="rounded-2xl border border-[#bcd6fa] bg-canvas/30 p-4 text-center">
                  <span className="font-mono text-[10.5px] uppercase tracking-wider text-mist">
                    Available Cleared Payout Balance
                  </span>
                  <div className="font-display text-3xl font-extrabold text-signal mt-0.5">
                    {selectedRecordForPayout ? selectedRecordForPayout.bountyAmount : "$1,000.00"}
                  </div>
                  <span className="text-[11px] text-ink-soft">
                    {selectedRecordForPayout
                      ? `Candidate Placement: ${selectedRecordForPayout.candidateName} (${selectedRecordForPayout.id})`
                      : "2 Placed Candidate Milestones Cleared"}
                  </span>
                </div>

                {/* Account Selection */}
                <div className="space-y-2">
                  <label className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-ink-soft">
                    Select Connected Banking Channel
                  </label>

                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => setPayoutAccount("us_checking")}
                      className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        payoutAccount === "us_checking"
                          ? "border-electric bg-electric/5 ring-1 ring-electric/30"
                          : "border-[#bcd6fa]/70 bg-white hover:bg-canvas/30"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink text-white">
                          <CreditCard size={18} />
                        </div>
                        <div>
                          <div className="font-bold text-ink text-xs">Chase Checking (US Direct Deposit)</div>
                          <div className="font-mono text-[11px] text-mist">Account ending in •••• 3901</div>
                        </div>
                      </div>
                      <span className="font-mono text-[10px] text-signal font-bold">VERIFIED</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPayoutAccount("uk_bacs")}
                      className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        payoutAccount === "uk_bacs"
                          ? "border-electric bg-electric/5 ring-1 ring-electric/30"
                          : "border-[#bcd6fa]/70 bg-white hover:bg-canvas/30"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink text-white">
                          <CreditCard size={18} />
                        </div>
                        <div>
                          <div className="font-bold text-ink text-xs">Barclays Corporate (UK Faster Payments)</div>
                          <div className="font-mono text-[11px] text-mist">Sort Code 20-00-00 •••• 8492</div>
                        </div>
                      </div>
                      <span className="font-mono text-[10px] text-signal font-bold">VERIFIED</span>
                    </button>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#bcd6fa]/40 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setIsPayoutModalOpen(false)}
                    className="rounded-xl border border-[#bcd6fa] px-4 py-2 font-display text-xs font-semibold text-ink-soft hover:bg-canvas cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    disabled={isDisbursing}
                    onClick={handleConfirmDisbursement}
                    className="inline-flex items-center gap-2 rounded-xl bg-signal hover:bg-emerald-600 px-6 py-2.5 font-display text-xs font-bold text-white transition-all shadow-xs disabled:opacity-50 cursor-pointer"
                  >
                    {isDisbursing ? (
                      <>
                        <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        <span>Processing Transfer...</span>
                      </>
                    ) : (
                      <>
                        <Check size={14} />
                        <span>Confirm Transfer Now</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              /* Receipt Success */
              <div className="text-center py-4 space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full mx-auto bg-signal/20 text-signal border-2 border-signal shadow-md">
                  <CheckCircle size={32} />
                </div>

                <div>
                  <h4 className="font-display text-xl font-extrabold text-ink">
                    Disbursement Executed Successfully!
                  </h4>
                  <p className="text-xs text-ink-soft mt-1 max-w-sm mx-auto">
                    {payoutSuccessReceipt.amount} has been initiated to your {payoutSuccessReceipt.accountText}.
                  </p>
                </div>

                <div className="rounded-2xl border border-[#bcd6fa] bg-canvas/30 p-4 text-xs font-mono space-y-1.5 max-w-sm mx-auto text-left">
                  <div className="flex justify-between">
                    <span className="text-mist">Wire Reference:</span>
                    <strong className="text-ink">{payoutSuccessReceipt.refNumber}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-mist">Settlement Latency:</span>
                    <span className="text-signal font-semibold">Immediate / Instant</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-mist">Fee Deducted:</span>
                    <span className="text-ink font-semibold">$0.00 (Zero Fee)</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsPayoutModalOpen(false)}
                  className="rounded-xl bg-ink px-6 py-2.5 font-display text-xs font-bold text-white hover:bg-electric transition-colors shadow-xs cursor-pointer"
                >
                  Return to Bounty Ledger
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
