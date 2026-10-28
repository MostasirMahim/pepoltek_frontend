import { Metadata } from "next";
import { ReferralPayoutsView, LedgerRowItem } from "@/components/referrals/ReferralPayoutsView";
import { getUserReferralSummaryAction } from "@/actions/referral.actions";

export const metadata: Metadata = {
  title: "Escrow Disbursements & Payouts | Pepoltek",
  description: "Monitor cleared escrow wire disbursements, pending candidate milestones, and bank payout records.",
};

export default async function ReferralsPayoutsPage() {
  const summaryRes = await getUserReferralSummaryAction();

  const clearedUsd = summaryRes?.available_balance_usd || 0;
  const paidUsd = summaryRes?.total_paid_usd || 0;
  const pendingUsd = summaryRes?.pending_bounties_usd || 0;
  const ledger: LedgerRowItem[] = summaryRes?.ledger || [];

  return (
    <ReferralPayoutsView
      ledger={ledger}
      availableBalanceUsd={clearedUsd}
      totalPaidUsd={paidUsd}
      pendingBountiesUsd={pendingUsd}
    />
  );
}
