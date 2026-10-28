"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Award,
  Zap,
  CheckCircle,
  Briefcase,
  ChevronRight,
  X,
  AlertCircle,
  ShieldCheck,
  DollarSign,
  Clock,
} from "@/components/ui/Icons";
import { submitDirectReferralAction } from "@/actions/referral.actions";

interface ActiveBountyCatalogItem {
  id: string;
  name: string;
  description: string;
  amount_usd: number;
  amount_display: string;
  currency: string;
  validity_days: number;
}

interface ReferralBountiesViewProps {
  activeBounties: ActiveBountyCatalogItem[];
  referralCode?: string;
  referralLink?: string;
}

export function ReferralBountiesView({
  activeBounties = [],
  referralCode = "REF-PARTNER",
  referralLink = "https://pepoltek.com/register",
}: ReferralBountiesViewProps) {
  const [selectedBounty, setSelectedBounty] = useState<ActiveBountyCatalogItem | null>(null);
  const [isSubmitDrawerOpen, setIsSubmitDrawerOpen] = useState(false);

  // Form states
  const [refName, setRefName] = useState("");
  const [refEmail, setRefEmail] = useState("");
  const [refRole, setRefRole] = useState("");
  const [refSector, setRefSector] = useState<"Technology" | "Healthcare">("Technology");
  const [refNotes, setRefNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Feedback toast
  const [toast, setToast] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 5000);
  };

  const handleOpenReferDrawer = (bounty: ActiveBountyCatalogItem) => {
    setSelectedBounty(bounty);
    setRefRole(bounty.name);
    if (bounty.name.toLowerCase().includes("clinical") || bounty.name.toLowerCase().includes("health")) {
      setRefSector("Healthcare");
    } else {
      setRefSector("Technology");
    }
    setIsSubmitDrawerOpen(true);
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
        notes: `Sector: ${refSector}. Bounty: ${selectedBounty?.name || "Standard"}. Notes: ${refNotes.trim()}`,
      });

      if (res.success) {
        showToast(`Candidate ${refName} successfully attributed to ${selectedBounty?.name || "bounty program"}.`);
        setRefName("");
        setRefEmail("");
        setRefRole("");
        setRefNotes("");
        setIsSubmitDrawerOpen(false);
      } else {
        showToast(res.error || "Failed to register candidate referral.", "error");
      }
    } catch {
      showToast("Network exception dispatching referral.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

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
              <span>ACTIVE BOUNTY TIERS &amp; REWARDS</span>
            </div>
            <h1 className="mt-2.5 font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
              Bounty Opportunities Catalog
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-gray-300 max-w-2xl leading-relaxed">
              Earn competitive cash rewards by connecting elite engineering leaders and licensed clinical specialists to active enterprise requisitions. All bounties backed by our automated escrow ledger.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/jobs"
              className="rounded-2xl border border-signal/40 bg-signal/20 px-4 py-2.5 font-display text-xs font-bold text-signal hover:bg-signal hover:text-white transition-all shadow-xs"
            >
              Browse Live Sprint Jobs →
            </Link>
            <Link
              href="/referrals/network"
              className="rounded-2xl bg-electric px-5 py-2.5 font-display text-xs font-bold text-white hover:bg-electric-bright transition-all shadow-xs"
            >
              View My Pipeline ({referralCode})
            </Link>
          </div>
        </div>
      </div>

      {/* Program Guarantees Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-[#bcd6fa] bg-white p-5 shadow-xs">
          <div className="flex items-center gap-2 font-display text-sm font-bold text-ink">
            <Clock className="h-4 w-4 text-electric shrink-0" />
            <span>90-Day Attribution Window</span>
          </div>
          <p className="mt-1.5 text-xs text-ink-soft leading-relaxed">
            When you refer talent or share your link, candidates are cryptographically attributed to your account for 90 days across all jobs.
          </p>
        </div>

        <div className="rounded-2xl border border-[#bcd6fa] bg-white p-5 shadow-xs">
          <div className="flex items-center gap-2 font-display text-sm font-bold text-ink">
            <ShieldCheck className="h-4 w-4 text-signal shrink-0" />
            <span>Automated Escrow Locking</span>
          </div>
          <p className="mt-1.5 text-xs text-ink-soft leading-relaxed">
            Upon candidate placement, bounties are minted into the double-entry escrow vault and cleared automatically post-guarantee.
          </p>
        </div>

        <div className="rounded-2xl border border-[#bcd6fa] bg-white p-5 shadow-xs">
          <div className="flex items-center gap-2 font-display text-sm font-bold text-ink">
            <DollarSign className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>Multi-Channel Wire Payouts</span>
          </div>
          <p className="mt-1.5 text-xs text-ink-soft leading-relaxed">
            Disburse approved funds via Direct SWIFT/BIC Bank Wire, US ACH, UK Faster Payments, or PayPal Business with zero platform fees.
          </p>
        </div>
      </div>

      {/* Active Bounty Opportunities Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-bold text-ink">Available Bounty Opportunities</h2>
            <p className="text-xs text-ink-soft">Current active rewards for specialized technical and healthcare hires</p>
          </div>
          <span className="font-mono text-xs font-bold text-electric bg-electric/10 px-3 py-1 rounded-full">
            {activeBounties.length} Tiers Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {activeBounties.map((bounty) => {
            const isHealthcare =
              bounty.name.toLowerCase().includes("health") ||
              bounty.name.toLowerCase().includes("clinical");

            return (
              <div
                key={bounty.id}
                className="rounded-3xl border border-[#bcd6fa] bg-white p-6 shadow-xs flex flex-col justify-between hover:border-electric hover:shadow-md transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-mono font-bold ${
                        isHealthcare
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-electric/10 text-electric border border-electric/20"
                      }`}
                    >
                      {isHealthcare ? "Healthcare Track" : "Technology Track"}
                    </span>
                    <span className="text-[11px] font-mono text-mist">
                      {bounty.validity_days} Days Lock
                    </span>
                  </div>

                  <h3 className="font-display text-lg font-bold text-ink mt-3 group-hover:text-electric transition-colors">
                    {bounty.name}
                  </h3>

                  <div className="mt-3 flex items-baseline gap-1.5">
                    <span className="font-display text-3xl font-black text-ink">
                      {bounty.amount_display}
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-700">
                      {bounty.currency}
                    </span>
                  </div>

                  <p className="mt-3 text-xs text-ink-soft leading-relaxed">
                    {bounty.description ||
                      "Earn placement milestone bounties when your recommended specialist completes technical vetting and enters client contract."}
                  </p>

                  <div className="mt-4 rounded-xl bg-canvas p-3 text-xs space-y-1.5 border border-[#bcd6fa]/40">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-mist">Milestone:</span>
                      <span className="font-bold text-ink">Placement Execution</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-mist">Escrow Type:</span>
                      <span className="font-bold text-ink">Treasury Backed</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-[#bcd6fa]/40">
                  <button
                    type="button"
                    onClick={() => handleOpenReferDrawer(bounty)}
                    className="w-full rounded-xl bg-ink py-2.5 font-display text-xs font-bold text-white hover:bg-electric transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>+ Refer Talent for this Bounty</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

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
                  <span>BOUNTY ATTRIBUTION INTAKE</span>
                </div>
                <h3 className="font-display text-lg font-bold text-ink mt-1">
                  Refer Candidate for {selectedBounty?.name || "Bounty"}
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
              {selectedBounty && (
                <div className="rounded-2xl border border-electric/30 bg-electric/5 p-4 text-xs">
                  <div className="font-mono text-[10px] text-electric uppercase font-bold">Selected Bounty Tier</div>
                  <div className="font-display text-base font-bold text-ink mt-0.5">{selectedBounty.name}</div>
                  <div className="font-display text-lg font-black text-emerald-700 mt-1">
                    {selectedBounty.amount_display} {selectedBounty.currency}
                  </div>
                  <p className="mt-1 text-[11px] text-ink-soft">{selectedBounty.description}</p>
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
                  placeholder="Add background context, GitHub profile, or clinical specialties..."
                  className="w-full rounded-xl border border-[#bcd6fa] bg-canvas p-3 text-xs text-ink focus:border-electric focus:bg-white outline-hidden resize-none"
                />
              </div>

              <div className="pt-4 border-t border-[#bcd6fa]">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-xl bg-electric py-3 font-display text-xs font-bold text-white hover:bg-electric-bright transition-all shadow-xs disabled:opacity-60 cursor-pointer"
                >
                  {isSubmitting ? "Locking Bounty & Dispatching..." : "Submit Referral & Lock 90d Attribution"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
