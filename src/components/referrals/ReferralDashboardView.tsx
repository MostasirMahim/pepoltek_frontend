"use client";

import React, { useState } from "react";
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
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Briefcase,
} from "@/components/ui/Icons";
import { ReferralRecord, BountySummary } from "@/types/referral.types";
import {
  submitDirectReferralAction,
  requestReferralPayoutAction,
} from "@/actions/referral.actions";

interface ActiveBountyCatalogItem {
  id: string;
  name: string;
  description: string;
  amount_usd: number;
  amount_display: string;
  currency: string;
  validity_days: number;
}

interface ReferralDashboardViewProps {
  initialSummary?: BountySummary;
  initialRecords?: ReferralRecord[];
  activeBounties?: ActiveBountyCatalogItem[];
  availableBalanceUsd?: number;
}

const DEFAULT_BOUNTY_SUMMARY: BountySummary = {
  totalEarned: "$0.00",
  clearedPayout: "$0.00",
  escrowLocked: "$0.00",
  pendingPipeline: "$0.00",
  referralLink: "",
  totalReferrals: 0,
  placedCount: 0,
};

export function ReferralDashboardView({
  initialSummary = DEFAULT_BOUNTY_SUMMARY,
  initialRecords = [],
  activeBounties = [],
  availableBalanceUsd = 0,
}: ReferralDashboardViewProps) {
  const [referrals, setReferrals] = useState<ReferralRecord[]>(initialRecords);
  const [summaryData, setSummaryData] = useState<BountySummary>(initialSummary);
  const [clearedBalance, setClearedBalance] = useState<number>(availableBalanceUsd);
  const [copied, setCopied] = useState(false);

  // Slide-over Drawers state
  const [isSubmitDrawerOpen, setIsSubmitDrawerOpen] = useState(false);
  const [isPayoutDrawerOpen, setIsPayoutDrawerOpen] = useState(false);
  const [selectedBountyForReferral, setSelectedBountyForReferral] = useState<ActiveBountyCatalogItem | null>(null);

  // Form submission states
  const [refName, setRefName] = useState("");
  const [refEmail, setRefEmail] = useState("");
  const [refRole, setRefRole] = useState("");
  const [refSector, setRefSector] = useState<"Technology" | "Healthcare">("Technology");
  const [refNotes, setRefNotes] = useState("");
  const [isSubmittingReferral, setIsSubmittingReferral] = useState(false);

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

  const handleCopy = () => {
    if (!summaryData.referralLink) return;
    navigator.clipboard.writeText(summaryData.referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleManualReferralSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refName || !refEmail || !refRole) return;
    setIsSubmittingReferral(true);

    try {
      const res = await submitDirectReferralAction({
        referred_name: refName.trim(),
        referred_email: refEmail.trim(),
        target_role: refRole.trim(),
        notes: `Sector: ${refSector}. Notes: ${refNotes.trim()}`,
      });

      if (res.success) {
        const newRecord: ReferralRecord = {
          id: `REF-${res.data?.id ? String(res.data.id).slice(0, 6) : "00" + (referrals.length + 1)}`,
          candidateName: refName,
          role: refRole,
          sector: refSector,
          submittedDate: "Just now",
          stage: "Submitted",
          stageIndex: 1,
          bountyAmount: selectedBountyForReferral ? selectedBountyForReferral.amount_display : "$1,500.00",
          payoutStatus: "Pending Placement",
        };

        setReferrals([newRecord, ...referrals]);
        setSummaryData((prev) => ({
          ...prev,
          totalReferrals: prev.totalReferrals + 1,
        }));
        showToast(`Referral invitation dispatched to ${refName} (${refEmail}).`);
        setRefName("");
        setRefEmail("");
        setRefRole("");
        setRefNotes("");
        setSelectedBountyForReferral(null);
        setIsSubmitDrawerOpen(false);
      } else {
        showToast(res.error || "Failed to submit referral invitation.", "error");
      }
    } catch {
      showToast("Network exception submitting candidate referral.", "error");
    } finally {
      setIsSubmittingReferral(false);
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
        setSummaryData((prev) => ({
          ...prev,
          clearedPayout: "$0.00",
        }));
      } else {
        showToast(res.error || "Failed to submit payout instruction.", "error");
      }
    } catch {
      showToast("Network exception submitting payout instruction.", "error");
    } finally {
      setIsDisbursing(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 font-sans">
      {/* Toast Notification */}
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

      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-electric/30 bg-gradient-to-r from-ink via-[#0d1f3d] to-ink p-5 sm:p-7 text-white shadow-xl">
        <div className="relative z-10 flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-electric/40 bg-electric/20 px-3 py-0.5 text-xs font-mono text-electric-bright">
              <span className="h-2 w-2 rounded-full bg-signal animate-pulse" />
              <span>PEPOLTEK ECOSYSTEM REFERRAL NETWORK</span>
            </div>
            <h1 className="mt-2.5 font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
              Bounties, Pipeline &amp; Escrow Cockpit
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-gray-300 max-w-2xl leading-relaxed">
              Recommend elite engineering talent and licensed clinical specialists. Track real candidate milestones and request direct escrow disbursements.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setPayoutReceipt(null);
                setIsPayoutDrawerOpen(true);
              }}
              className="rounded-2xl border border-signal/40 bg-signal/20 px-4 py-2.5 font-display text-xs font-bold text-signal hover:bg-signal hover:text-white transition-all shadow-xs cursor-pointer flex items-center gap-2"
            >
              <CreditCard className="h-4 w-4" />
              <span>Disburse Escrow Wire</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedBountyForReferral(null);
                setIsSubmitDrawerOpen(true);
              }}
              className="rounded-2xl bg-electric px-5 py-2.5 font-display text-xs font-bold text-white hover:bg-electric-bright transition-all shadow-xs cursor-pointer flex items-center gap-2"
            >
              <span>+ Refer Talent</span>
            </button>
          </div>
        </div>
      </div>

      {/* Telemetry Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-[#bcd6fa] bg-white p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between text-ink-soft">
            <span className="text-xs font-semibold">Available for Wire</span>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-2 font-display text-2xl sm:text-3xl font-black text-emerald-700">
            ${clearedBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="mt-1 text-[11px] text-ink-soft">Approved escrow balance</div>
        </div>

        <div className="rounded-2xl border border-[#bcd6fa] bg-white p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between text-ink-soft">
            <span className="text-xs font-semibold">Total Earned</span>
            <Award className="h-4 w-4 text-purple-600" />
          </div>
          <div className="mt-2 font-display text-2xl sm:text-3xl font-black text-ink">
            {summaryData.totalEarned}
          </div>
          <div className="mt-1 text-[11px] text-ink-soft">Lifetime milestone earnings</div>
        </div>

        <div className="rounded-2xl border border-[#bcd6fa] bg-white p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between text-ink-soft">
            <span className="text-xs font-semibold">Referred Candidates</span>
            <Users className="h-4 w-4 text-electric" />
          </div>
          <div className="mt-2 font-display text-2xl sm:text-3xl font-black text-ink">
            {summaryData.totalReferrals}
          </div>
          <div className="mt-1 text-[11px] text-ink-soft">Active in assessment pipeline</div>
        </div>

        <div className="rounded-2xl border border-[#bcd6fa] bg-white p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between text-ink-soft">
            <span className="text-xs font-semibold">Placed Specialists</span>
            <CheckCircle className="h-4 w-4 text-signal" />
          </div>
          <div className="mt-2 font-display text-2xl sm:text-3xl font-black text-ink">
            {summaryData.placedCount}
          </div>
          <div className="mt-1 text-[11px] text-ink-soft">Deployed at enterprise clients</div>
        </div>
      </div>

      {/* Referral Link & Attribution Box */}
      <div className="rounded-2xl border border-electric/30 bg-gradient-to-r from-canvas via-white to-canvas p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-base font-bold text-ink flex items-center gap-2">
              <Zap className="h-4 w-4 text-electric" />
              <span>Your Personal Referral Link &amp; Code</span>
            </h2>
            <p className="text-xs text-ink-soft mt-0.5">
              Candidates who register using your link are attributed for 90 days. You earn bounties on placement.
            </p>
          </div>

          <div className="flex items-center gap-2 max-w-md w-full">
            <div className="relative flex-1">
              <input
                type="text"
                readOnly
                value={summaryData.referralLink || "https://pepoltek.com/register"}
                className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3.5 py-2 font-mono text-xs text-ink truncate select-all outline-hidden"
              />
            </div>
            <button
              type="button"
              onClick={handleCopy}
              className="rounded-xl bg-ink px-4 py-2 font-display text-xs font-bold text-white hover:bg-electric transition-colors shadow-xs cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-signal" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? "Copied" : "Copy Link"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Active Bounty Opportunities Catalog */}
      {activeBounties.length > 0 && (
        <div className="rounded-2xl border border-[#bcd6fa] bg-white p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display text-base font-bold text-ink">Active Bounty Opportunities</h2>
              <p className="text-xs text-ink-soft">Direct bounties available for high-demand engineering and clinical profiles</p>
            </div>
            <span className="text-xs font-mono font-semibold text-ink-soft">
              {activeBounties.length} Tiers Open
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {activeBounties.slice(0, 6).map((bounty) => (
              <div
                key={bounty.id}
                className="rounded-xl border border-[#bcd6fa] bg-canvas p-4 flex flex-col justify-between hover:border-electric transition-all"
              >
                <div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="rounded-full bg-electric/10 text-electric px-2.5 py-0.5 font-mono text-[10px] font-bold">
                      {bounty.validity_days} Days Window
                    </span>
                    <span className="font-display text-sm font-black text-emerald-700">
                      {bounty.amount_display}
                    </span>
                  </div>
                  <h3 className="font-display text-sm font-bold text-ink mt-2">
                    {bounty.name}
                  </h3>
                  <p className="text-xs text-ink-soft mt-1 leading-relaxed line-clamp-2">
                    {bounty.description || "Earn milestone rewards when your referred candidate completes intake and accepts client placement."}
                  </p>
                </div>

                <div className="mt-3 pt-3 border-t border-[#bcd6fa]/50 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-ink-soft">{bounty.currency} Escrow</span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedBountyForReferral(bounty);
                      setRefRole(bounty.name);
                      setIsSubmitDrawerOpen(true);
                    }}
                    className="text-xs font-bold text-electric hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Refer Talent</span>
                    <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Referrals Pipeline Table */}
      <div className="rounded-2xl border border-[#bcd6fa] bg-white p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display text-base font-bold text-ink">Referred Talent Pipeline</h2>
            <p className="text-xs text-ink-soft">Live tracking of your candidates through the 5-stage recruitment process</p>
          </div>
          <span className="text-xs font-mono font-semibold text-ink-soft">
            {referrals.length} Candidates Tracked
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#bcd6fa] text-ink-soft font-semibold">
                <th className="pb-3">Candidate</th>
                <th className="pb-3">Target Track</th>
                <th className="pb-3">Sector</th>
                <th className="pb-3">Stage</th>
                <th className="pb-3">Bounty Estimate</th>
                <th className="pb-3">Payout State</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#bcd6fa]/50">
              {referrals.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-ink-soft">
                    <Users className="mx-auto h-8 w-8 text-mist mb-2" />
                    <div className="font-display text-sm font-bold text-ink">No Referrals Registered Yet</div>
                    <p className="text-xs text-mist mt-1 max-w-sm mx-auto">
                      Share your unique referral link or directly invite engineers and clinicians to earn placement bounties.
                    </p>
                  </td>
                </tr>
              ) : (
                referrals.map((item) => (
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
                    <td className="py-3.5 font-bold text-ink font-mono">{item.bountyAmount}</td>
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
                        <span className="text-[11px] text-ink-soft font-mono">
                          {item.payoutStatus}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-Over Right-Side Sheet Drawer: Direct Candidate Referral Submission */}
      {isSubmitDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in-0 duration-200">
          <div className="relative h-full w-full max-w-lg bg-white shadow-2xl flex flex-col border-l border-[#bcd6fa] animate-in slide-in-from-right duration-300">
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
              {selectedBountyForReferral && (
                <div className="rounded-xl border border-electric/30 bg-electric/5 p-3 text-xs">
                  <span className="font-mono text-[10px] text-electric block uppercase tracking-wider font-bold">Selected Bounty Target</span>
                  <span className="font-display font-bold text-ink block">{selectedBountyForReferral.name}</span>
                  <span className="text-emerald-700 font-black font-mono">{selectedBountyForReferral.amount_display}</span>
                </div>
              )}

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
                <label className="block text-xs font-semibold text-ink mb-1">Industry Sector</label>
                <select
                  value={refSector}
                  onChange={(e) => setRefSector(e.target.value as "Technology" | "Healthcare")}
                  className="w-full rounded-xl border border-[#bcd6fa] bg-canvas px-3.5 py-2.5 text-xs font-semibold text-ink focus:border-electric focus:bg-white outline-hidden cursor-pointer"
                >
                  <option value="Technology">Technology (Tech Specialist Bounty)</option>
                  <option value="Healthcare">Healthcare (Clinical Licensure Bounty)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink mb-1">Candidate Background &amp; Notes</label>
                <textarea
                  rows={3}
                  value={refNotes}
                  onChange={(e) => setRefNotes(e.target.value)}
                  placeholder="Mention previous employers, key open source projects, or clinical board certifications..."
                  className="w-full rounded-xl border border-[#bcd6fa] bg-canvas p-3 text-xs text-ink focus:border-electric focus:bg-white outline-hidden"
                />
              </div>

              <div className="pt-4 border-t border-[#bcd6fa] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsSubmitDrawerOpen(false)}
                  className="rounded-xl border border-[#bcd6fa] bg-white px-4 py-2 font-display text-xs font-semibold text-ink-soft hover:bg-canvas transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReferral}
                  className="rounded-xl bg-ink px-5 py-2 font-display text-xs font-bold text-white hover:bg-electric transition-colors shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingReferral ? "Dispatching..." : "Dispatch Invitation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Slide-Over Right-Side Sheet Drawer: Escrow Wire Disbursement */}
      {isPayoutDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in-0 duration-200">
          <div className="relative h-full w-full max-w-lg bg-white shadow-2xl flex flex-col border-l border-[#bcd6fa] animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#bcd6fa] px-6 py-4 bg-canvas">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-[10px] font-bold">
                  <span>TREASURY VAULT DISBURSEMENT</span>
                </div>
                <h3 className="font-display text-lg font-bold text-ink mt-1">
                  Request Escrow Wire
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

            {/* Body */}
            {payoutReceipt ? (
              <div className="p-6 space-y-5 text-center flex-1 flex flex-col justify-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <div>
                  <h4 className="font-display text-lg font-bold text-ink">Disbursement Instruction Registered</h4>
                  <p className="text-xs text-ink-soft mt-1">{payoutReceipt.message}</p>
                </div>
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                  <div className="font-mono text-xs text-emerald-800">Transmitted Amount</div>
                  <div className="text-3xl font-black text-emerald-700 font-display mt-1">{payoutReceipt.amount}</div>
                  <div className="text-[11px] text-emerald-800 mt-1 font-mono">Method: {payoutReceipt.method}</div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPayoutDrawerOpen(false)}
                  className="w-full rounded-xl bg-ink py-2.5 font-display text-xs font-bold text-white hover:bg-electric transition-colors shadow-xs cursor-pointer"
                >
                  Close Workbench
                </button>
              </div>
            ) : (
              <form onSubmit={handleConfirmDisbursement} className="flex-1 overflow-y-auto p-6 space-y-5 thin-scrollbar">
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4">
                  <span className="font-mono text-[10px] text-emerald-800 font-bold block uppercase tracking-wider">
                    Cleared Escrow Balance
                  </span>
                  <div className="text-2xl font-black text-emerald-700 font-display mt-0.5">
                    ${clearedBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <p className="text-[11px] text-emerald-800 mt-1">
                    Funds verified through candidate placement guarantee window.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink mb-1.5">Select Payout Channel</label>
                  <select
                    value={payoutMethod}
                    onChange={(e) => setPayoutMethod(e.target.value as any)}
                    className="w-full rounded-xl border border-[#bcd6fa] bg-canvas px-3.5 py-2.5 text-xs font-semibold text-ink focus:border-electric focus:bg-white outline-hidden cursor-pointer"
                  >
                    <option value="bank_wire">Commercial Bank Wire (Global SWIFT / ABA)</option>
                    <option value="ach">US Domestic ACH Direct Deposit</option>
                    <option value="faster_payments">UK Faster Payments / BACS</option>
                    <option value="paypal">PayPal Premier Settlement</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink mb-1.5">
                    Recipient Coordinates &amp; Bank Account
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={recipientDetails}
                    onChange={(e) => setRecipientDetails(e.target.value)}
                    placeholder="Provide Bank Name, Routing / Sort Code, Account / IBAN Number, and Beneficiary Legal Name..."
                    className="w-full rounded-xl border border-[#bcd6fa] bg-canvas p-3 text-xs text-ink focus:border-electric focus:bg-white outline-hidden"
                  />
                  <span className="text-[11px] text-ink-soft mt-1 block">
                    Transmissions undergo secondary AML verification before automated release.
                  </span>
                </div>

                <div className="pt-4 border-t border-[#bcd6fa] flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsPayoutDrawerOpen(false)}
                    className="rounded-xl border border-[#bcd6fa] bg-white px-4 py-2 font-display text-xs font-semibold text-ink-soft hover:bg-canvas transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isDisbursing || clearedBalance <= 0}
                    className="rounded-xl bg-emerald-600 px-5 py-2 font-display text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-xs cursor-pointer disabled:opacity-40"
                  >
                    {isDisbursing ? "Authorizing Wire..." : "Authorize Escrow Release"}
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
