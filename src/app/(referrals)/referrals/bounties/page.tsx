import { Metadata } from "next";
import { ReferralBountiesView } from "@/components/referrals/ReferralBountiesView";
import { getUserReferralSummaryAction } from "@/actions/referral.actions";

export const metadata: Metadata = {
  title: "Active Bounty Opportunities | Pepoltek Referral Network",
  description: "Browse high-reward referral bounties for engineering leadership and licensed clinical roles.",
};

export default async function ReferralsBountiesPage() {
  const summaryRes = await getUserReferralSummaryAction();

  const referralCode = summaryRes?.referral_code || "REF-PARTNER";
  const referralLink = `https://pepoltek.com/register?ref=${referralCode}`;
  const activeBounties = summaryRes?.active_bounties || [];

  return (
    <ReferralBountiesView
      activeBounties={activeBounties}
      referralCode={referralCode}
      referralLink={referralLink}
    />
  );
}
