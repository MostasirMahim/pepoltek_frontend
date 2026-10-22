import { Metadata } from "next";
import { ReferralDashboardView } from "@/components/referrals/ReferralDashboardView";
import { BOUNTY_SUMMARY, REFERRAL_RECORDS } from "@/data/mock";

export const metadata: Metadata = {
  title: "Candidate Referral Program | Pepoltek",
  description: "Refer software engineers and healthcare specialists to earn sprint placement bounties.",
};

export default function CandidateReferralsPage() {
  return (
    <ReferralDashboardView
      initialSummary={BOUNTY_SUMMARY}
      initialRecords={REFERRAL_RECORDS}
    />
  );
}
