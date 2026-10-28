import { Metadata } from "next";
import { ReferralNetworkView } from "@/components/referrals/ReferralNetworkView";
import { getUserReferralSummaryAction } from "@/actions/referral.actions";
import { BountySummary, ReferralRecord } from "@/types/referral.types";

export const metadata: Metadata = {
  title: "Candidate Referral Network | Pepoltek",
  description: "Track candidate applications, stage progression, placement milestones, and bounty statuses.",
};

export default async function ReferralsNetworkPage() {
  const summaryRes = await getUserReferralSummaryAction();

  const referralCode = summaryRes?.referral_code || "REF-PARTNER";
  const referralLink = `https://pepoltek.com/register?ref=${referralCode}`;

  const totalEarnedUsd = (summaryRes?.total_paid_usd || 0) + (summaryRes?.available_balance_usd || 0);
  const clearedUsd = summaryRes?.available_balance_usd || 0;
  const pendingUsd = summaryRes?.pending_bounties_usd || 0;

  const summary: BountySummary = {
    totalEarned: `$${totalEarnedUsd.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    clearedPayout: `$${clearedUsd.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    escrowLocked: "$0.00",
    pendingPipeline: `$${pendingUsd.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    referralLink,
    totalReferrals: summaryRes?.total_referrals_count || 0,
    placedCount: (summaryRes?.referrals_list || []).filter((r: any) => r.stage === "placed").length,
  };

  const candidateRecords: ReferralRecord[] = (summaryRes?.referrals_list || []).map((r: any) => {
    const isHealthcare =
      (r.requisition_title || "").toLowerCase().includes("health") ||
      (r.requisition_title || "").toLowerCase().includes("clinical");

    return {
      id: r.id.slice(0, 8),
      candidateName: r.candidate_name,
      candidateEmail: r.candidate_email,
      role: r.requisition_title || "General Candidate Pool",
      sector: isHealthcare ? "Healthcare" : "Technology",
      stage: (r.stage === "placed"
        ? "Placed & Deployed"
        : r.stage === "interviewed"
        ? "Client Interviews"
        : r.stage === "screened"
        ? "Screened & Verified"
        : "Submitted") as ReferralRecord["stage"],
      stageIndex: r.stage === "placed" ? 4 : r.stage === "interviewed" ? 3 : r.stage === "screened" ? 2 : 1,
      bountyAmount: "$1,500.00",
      payoutStatus: (r.stage === "placed"
        ? "Cleared for Payout"
        : "Pending Placement") as ReferralRecord["payoutStatus"],
      submittedDate: r.created_at,
      referralType: r.source_display || "Direct Scout",
    };
  });

  const records = candidateRecords;

  return (
    <ReferralNetworkView
      initialRecords={records}
      summary={summary}
      availableBalanceUsd={clearedUsd}
    />
  );
}
