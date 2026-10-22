"use client";

import { useState } from "react";
import {
  DollarSign,
  Users,
  Copy,
  Check,
  Clock,
  CheckCircle,
  X,
  CreditCard,
  Zap,
  Award,
} from "@/components/ui/Icons";
import {
  REFERRAL_RECORDS,
  BOUNTY_SUMMARY,
  REFERRAL_LEADERBOARD,
  ReferralRecord,
  BountySummary,
} from "@/data/mock";

interface ReferralDashboardViewProps {
  initialSummary?: BountySummary;
  initialRecords?: ReferralRecord[];
}

export function ReferralDashboardView({
  initialSummary = BOUNTY_SUMMARY,
  initialRecords = REFERRAL_RECORDS,
}: ReferralDashboardViewProps) {
  const [referrals, setReferrals] = useState<ReferralRecord[]>(initialRecords);
  const [summaryData, setSummaryData] = useState<BountySummary>(initialSummary);
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
    navigator.clipboard.writeText(summaryData.referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleManualReferralSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!refName || !refEmail || !refRole) return;

    const newRecord: ReferralRecord = {
      id: `REF-00${referrals.length + 1}`,
      candidateName: refName,
      role: refRole,
      sector: refSector,
      submittedDate: "Just now",
      stage: "Submitted",
      stageIndex: 1,
      bountyAmount: refSector === "Technology" ? "$500.00" : "$500.00",
      payoutStatus: "Pending Placement",
    };

    setReferrals([newRecord, ...referrals]);
    setSubmittedMessage(
      `Invitation sent to ${refName} (${refEmail}). Your referral tracking ID is ${newRecord.id}.`
    );
    setRefName("");
    setRefEmail("");
    setRefRole("");

    setTimeout(() => setSubmittedMessage(null), 6000);
  };

  const openPayoutModal = (record?: ReferralRecord) => {
    setSelectedRecordForPayout(record || null);
    setPayoutSuccessReceipt(null);
    setIsPayoutModalOpen(true);
  };

  const handleConfirmDisbursement = () => {
    setIsDisbursing(true);
    setTimeout(() => {
      setIsDisbursing(false);
      const amount = selectedRecordForPayout
        ? selectedRecordForPayout.bountyAmount
        : summaryData.clearedPayout;
      const refNum = `PEP-PAY-${Math.floor(100000 + Math.random() * 900000)}`;
      const accText =
        payoutAccount === "us_checking"
          ? "JPMorgan Chase (*8832) - ACH Transfer"
          : "Barclays Commercial (*4190) - Faster Payments";

      setPayoutSuccessReceipt({
        amount,
        refNumber: refNum,
        accountText: accText,
      });

      if (selectedRecordForPayout) {
        setReferrals((prev) =>
          prev.map((r) =>
            r.id === selectedRecordForPayout.id
              ? { ...r, payoutStatus: "Cleared for Payout", payoutDate: "Disbursed Today" }
              : r
          )
        );
      } else {
        setSummaryData((prev) => ({
          ...prev,
          clearedPayout: "$0.00",
        }));
      }
    }, 1400);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-electric/30 bg-gradient-to-r from-ink via-[#0d1f3d] to-ink p-6 sm:p-8 text-white shadow-md">
        <div className="relative z-10 flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-electric/40 bg-electric/20 px-3 py-0.5 text-[11px] font-mono text-electric-bright">
              <span className="h-2 w-2 rounded-full bg-signal animate-pulse" />
              <span>PEPOLTEK PARTNER & REFERRAL PORTAL</span>
            </div>
            <h1 className="mt-2.5 font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
              Referral Bounties & Partner Cockpit
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-gray-300 max-w-xl leading-relaxed">
              Earn bounties for Tech Pod placements and Clinical Specialist deployments.
              Track pipeline milestones and trigger direct bank disbursements.
            </p>
          </div>

          <button
            onClick={() => openPayoutModal()}
            className="inline-flex items-center gap-2 rounded-xl bg-signal px-5 py-3 font-display text-xs font-bold text-ink shadow-sm hover:bg-emerald-400 transition-colors"
          >
            <CreditCard className="h-4 w-4" />
            <span>Disburse Cleared Bounties</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-[#bcd6fa] bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-ink-soft">Total Bounties Earned</span>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-ink">{summaryData.totalEarned}</div>
          <p className="mt-1 text-[11px] text-ink-soft">Lifetime earnings across all pods</p>
        </div>

        <div className="rounded-2xl border border-[#bcd6fa] bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-ink-soft">Cleared for Payout</span>
            <CheckCircle className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-600">{summaryData.clearedPayout}</div>
          <p className="mt-1 text-[11px] text-ink-soft">Ready for instant ACH or BACS transfer</p>
        </div>

        <div className="rounded-2xl border border-[#bcd6fa] bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-ink-soft">Pending Escrow</span>
            <Clock className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-amber-500">{summaryData.escrowLocked}</div>
          <p className="mt-1 text-[11px] text-ink-soft">Releases at 30-day client deployment SLA</p>
        </div>

        <div className="rounded-2xl border border-[#bcd6fa] bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-ink-soft">Successful Deployments</span>
            <Users className="h-4 w-4 text-electric" />
          </div>
          <div className="mt-2 text-2xl font-bold text-ink">{summaryData.placedCount}</div>
          <p className="mt-1 text-[11px] text-ink-soft">Candidates placed in active squads</p>
        </div>
      </div>

      {/* Referral Link & Submission Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Referral Link Card */}
        <div className="rounded-2xl border border-[#bcd6fa] bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-electric" />
              <h2 className="font-display text-base font-bold text-ink">Your Dedicated Partner Link</h2>
            </div>
            <p className="mt-1 text-xs text-ink-soft">
              Share this link with engineers, clinical professionals, or clients. Registrations
              automatically tie to your partner account.
            </p>

            <div className="mt-4 flex items-center gap-2 rounded-xl border border-electric/30 bg-[#f4f8fe] p-2.5">
              <input
                type="text"
                readOnly
                value={summaryData.referralLink}
                className="w-full bg-transparent text-xs font-mono text-ink outline-hidden"
              />
              <button
                onClick={handleCopy}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-ink px-3 py-1.5 text-xs font-medium text-white hover:bg-electric transition-colors"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-signal" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-dashed border-[#bcd6fa] bg-canvas p-3.5">
            <div className="text-[11px] font-semibold text-ink">Bounty Release Terms:</div>
            <ul className="mt-1.5 space-y-1 text-[11px] text-ink-soft list-disc list-inside">
              <li>Candidate signs sprint contract and passes vetting</li>
              <li>Pod completes 30 calendar days of active sprint velocity</li>
              <li>Funds clear immediately to your chosen banking route</li>
            </ul>
          </div>
        </div>

        {/* Manual Referral Invitation Form */}
        <div className="lg:col-span-2 rounded-2xl border border-[#bcd6fa] bg-white p-6 shadow-xs">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-electric" />
            <h2 className="font-display text-base font-bold text-ink">Direct Candidate Referral</h2>
          </div>
          <p className="mt-1 text-xs text-ink-soft">
            Directly invite talent to Pepoltek. We will reach out on your behalf and link their candidate profile.
          </p>

          {submittedMessage && (
            <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800">
              {submittedMessage}
            </div>
          )}

          <form onSubmit={handleManualReferralSubmit} className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-ink mb-1">Candidate Full Name</label>
              <input
                type="text"
                required
                value={refName}
                onChange={(e) => setRefName(e.target.value)}
                placeholder="e.g. Maya Chen"
                className="w-full rounded-xl border border-[#bcd6fa] bg-canvas px-3.5 py-2 text-xs text-ink focus:border-electric focus:bg-white outline-hidden transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink mb-1">Candidate Email</label>
              <input
                type="email"
                required
                value={refEmail}
                onChange={(e) => setRefEmail(e.target.value)}
                placeholder="e.g. maya@example.com"
                className="w-full rounded-xl border border-[#bcd6fa] bg-canvas px-3.5 py-2 text-xs text-ink focus:border-electric focus:bg-white outline-hidden transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink mb-1">Target Role or Specialization</label>
              <input
                type="text"
                required
                value={refRole}
                onChange={(e) => setRefRole(e.target.value)}
                placeholder="e.g. Senior Rust Engineer or NHS Band 8"
                className="w-full rounded-xl border border-[#bcd6fa] bg-canvas px-3.5 py-2 text-xs text-ink focus:border-electric focus:bg-white outline-hidden transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink mb-1">Target Sector</label>
              <select
                value={refSector}
                onChange={(e) => setRefSector(e.target.value as "Technology" | "Healthcare")}
                className="w-full rounded-xl border border-[#bcd6fa] bg-canvas px-3.5 py-2 text-xs text-ink focus:border-electric focus:bg-white outline-hidden transition-all"
              >
                <option value="Technology">Technology (Tech Pod Bounty: $500)</option>
                <option value="Healthcare">Healthcare (Clinical Rota Bounty: $500)</option>
              </select>
            </div>

            <div className="sm:col-span-2 flex justify-end">
              <button
                type="submit"
                className="rounded-xl bg-ink px-5 py-2.5 font-display text-xs font-semibold text-white hover:bg-electric transition-colors shadow-xs"
              >
                Send Referral Invitation
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Referrals Pipeline Table */}
      <div className="rounded-2xl border border-[#bcd6fa] bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display text-base font-bold text-ink">Active Referral Network</h2>
            <p className="text-xs text-ink-soft">Real-time status of candidates registered under your link</p>
          </div>
          <span className="text-xs font-semibold text-ink-soft">
            {referrals.length} Total Candidates
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#bcd6fa] text-ink-soft">
                <th className="pb-3 font-semibold">Candidate</th>
                <th className="pb-3 font-semibold">Specialization</th>
                <th className="pb-3 font-semibold">Sector</th>
                <th className="pb-3 font-semibold">Stage</th>
                <th className="pb-3 font-semibold">Bounty Value</th>
                <th className="pb-3 font-semibold">Payout State</th>
                <th className="pb-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#bcd6fa]/50">
              {referrals.map((item) => (
                <tr key={item.id} className="hover:bg-canvas/50 transition-colors">
                  <td className="py-3.5 font-semibold text-ink">{item.candidateName}</td>
                  <td className="py-3.5 text-ink-soft">{item.role}</td>
                  <td className="py-3.5">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                        item.sector === "Technology"
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      }`}
                    >
                      {item.sector}
                    </span>
                  </td>
                  <td className="py-3.5">
                    <span className="font-medium text-ink">{item.stage}</span>
                  </td>
                  <td className="py-3.5 font-bold text-ink">{item.bountyAmount}</td>
                  <td className="py-3.5">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                        item.payoutStatus === "Cleared for Payout"
                          ? "bg-emerald-100 text-emerald-800"
                          : item.payoutStatus === "Escrow Locked"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-blue-50 text-blue-700"
                      }`}
                    >
                      {item.payoutStatus}
                    </span>
                  </td>
                  <td className="py-3.5 text-right">
                    {item.payoutStatus === "Cleared for Payout" ? (
                      <button
                        onClick={() => openPayoutModal(item)}
                        className="rounded-lg bg-emerald-600 px-3 py-1 font-semibold text-white hover:bg-emerald-700 transition-colors shadow-xs"
                      >
                        Claim Payout
                      </button>
                    ) : (
                      <span className="text-[11px] text-ink-soft font-mono">
                        {item.payoutStatus}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Partner Leaderboard */}
      <div className="rounded-2xl border border-[#bcd6fa] bg-white p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-4">
          <Award className="h-5 w-5 text-amber-500" />
          <div>
            <h2 className="font-display text-base font-bold text-ink">Partner Referral Leaderboard</h2>
            <p className="text-xs text-ink-soft">Top referrers across North America and Europe</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {REFERRAL_LEADERBOARD.map((leader) => (
            <div
              key={leader.rank}
              className="rounded-xl border border-[#bcd6fa] bg-canvas p-4 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-ink-soft">Rank #{leader.rank}</span>
                <span className="rounded-full bg-electric/10 px-2 py-0.5 text-[10px] font-semibold text-electric">
                  {leader.badge}
                </span>
              </div>
              <div className="mt-2">
                <div className="font-display text-sm font-bold text-ink">{leader.referrerName}</div>
                <div className="text-xs text-emerald-600 font-bold">{leader.totalBounties}</div>
              </div>
              <div className="mt-2 text-[11px] text-ink-soft">
                {leader.successfulDeployments} Placed Pod Engineers
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payout Modal */}
      {isPayoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-3xl border border-[#bcd6fa] bg-white p-6 sm:p-8 shadow-2xl">
            <button
              onClick={() => setIsPayoutModalOpen(false)}
              className="absolute right-5 top-5 text-ink-soft hover:text-ink"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="font-display text-lg font-bold text-ink">
              Disburse Referral Bounty
            </h3>
            <p className="text-xs text-ink-soft mt-1">
              Select your cleared banking channel for instant disbursement.
            </p>

            {payoutSuccessReceipt ? (
              <div className="mt-6 space-y-4">
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-center">
                  <CheckCircle className="mx-auto h-8 w-8 text-emerald-600" />
                  <div className="mt-2 font-display text-base font-bold text-emerald-900">
                    Disbursement Transmitted
                  </div>
                  <div className="text-2xl font-black text-emerald-600 mt-1">
                    {payoutSuccessReceipt.amount}
                  </div>
                  <div className="mt-2 font-mono text-[11px] text-emerald-800">
                    Reference: {payoutSuccessReceipt.refNumber}
                  </div>
                </div>

                <div className="text-xs text-ink-soft space-y-1">
                  <div>Account: {payoutSuccessReceipt.accountText}</div>
                  <div>Settlement ETA: Within 24 Hours</div>
                </div>

                <button
                  onClick={() => setIsPayoutModalOpen(false)}
                  className="w-full rounded-xl bg-ink py-2.5 font-display text-xs font-semibold text-white hover:bg-electric transition-colors"
                >
                  Close Receipt
                </button>
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                <div className="rounded-xl border border-electric/30 bg-[#f4f8fe] p-4 flex items-center justify-between">
                  <span className="text-xs font-semibold text-ink">Payout Amount</span>
                  <span className="font-mono text-lg font-extrabold text-ink">
                    {selectedRecordForPayout
                      ? selectedRecordForPayout.bountyAmount
                      : summaryData.clearedPayout}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink mb-2">
                    Settlement Account
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 rounded-xl border border-[#bcd6fa] p-3 cursor-pointer hover:border-electric">
                      <input
                        type="radio"
                        name="account"
                        checked={payoutAccount === "us_checking"}
                        onChange={() => setPayoutAccount("us_checking")}
                        className="text-electric"
                      />
                      <div className="text-xs">
                        <div className="font-semibold text-ink">JPMorgan Chase (*8832)</div>
                        <div className="text-ink-soft text-[11px]">ACH Direct Deposit (USD)</div>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 rounded-xl border border-[#bcd6fa] p-3 cursor-pointer hover:border-electric">
                      <input
                        type="radio"
                        name="account"
                        checked={payoutAccount === "uk_bacs"}
                        onChange={() => setPayoutAccount("uk_bacs")}
                        className="text-electric"
                      />
                      <div className="text-xs">
                        <div className="font-semibold text-ink">Barclays Commercial (*4190)</div>
                        <div className="text-ink-soft text-[11px]">Faster Payments (GBP)</div>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setIsPayoutModalOpen(false)}
                    className="flex-1 rounded-xl border border-[#bcd6fa] py-2.5 text-xs font-semibold text-ink-soft hover:bg-canvas"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmDisbursement}
                    disabled={isDisbursing}
                    className="flex-1 rounded-xl bg-signal py-2.5 text-xs font-bold text-ink hover:bg-emerald-400 disabled:opacity-50"
                  >
                    {isDisbursing ? "Transmitting..." : "Confirm Disbursement"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
