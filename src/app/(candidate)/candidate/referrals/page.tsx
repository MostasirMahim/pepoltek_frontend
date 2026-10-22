import { Metadata } from "next";
import { ReferralDashboardView } from "@/components/referrals/ReferralDashboardView";
import { getUserReferralSummaryAction } from "@/actions/referral.actions";
import { BountySummary, ReferralRecord } from "@/types/referral.types";

export const metadata: Metadata = {
  title: "Candidate Referral Program | Pepoltek",
  description: "Refer software engineers and healthcare specialists to earn sprint placement bounties.",
};

export default async function CandidateReferralsPage() {
  const summaryRes = await getUserReferralSummaryAction();

  const referralCode = summaryRes?.referral_code || "REF-PEP-TALENT";
  const referralLink = `http://localhost:3000/register?ref=${referralCode}`;

  const summary: BountySummary = {
    totalEarned: `$${((summaryRes?.total_paid_usd || 0) + (summaryRes?.pending_bounties_usd || 0)).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    clearedPayout: `$${(summaryRes?.total_paid_usd || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    escrowLocked: "$0.00",
    pendingPipeline: `$${(summaryRes?.pending_bounties_usd || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    referralLink,
    totalReferrals: summaryRes?.total_referrals_count || 0,
    placedCount: summaryRes?.ledger?.filter((l: any) => l.payoutStatus === "Paid").length || 0,
  };

  const records: ReferralRecord[] = (summaryRes?.ledger || []).map((l: any) => ({
    id: l.id,
    candidateName: l.candidate,
    role: l.track,
    sector: "Technology" as const,
    stage: (l.status === "Placed" ? "Placed & Deployed" : "Submitted") as ReferralRecord["stage"],
    stageIndex: l.status === "Placed" ? 4 : 1,
    bountyAmount: l.bountyEarned,
    payoutStatus: (l.payoutStatus === "Paid" ? "Cleared for Payout" : "Pending Placement") as ReferralRecord["payoutStatus"],
    submittedDate: l.date,
    payoutDate: l.paidReference ? l.date : undefined,
  }));

  return (
    <ReferralDashboardView
      initialSummary={summary}
      initialRecords={records}
    />
  );
}

