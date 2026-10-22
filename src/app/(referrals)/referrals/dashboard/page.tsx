import { Metadata } from "next";
import { ReferralDashboardView } from "@/components/referrals/ReferralDashboardView";
import { BOUNTY_SUMMARY, REFERRAL_RECORDS } from "@/data/mock";

export const metadata: Metadata = {
  title: "Partner & Referral Cockpit | Pepoltek",
  description: "Track candidate referrals, pod deployments, and live bounty disbursements.",
};

export default function ReferralsDashboardPage() {
  return (
    <ReferralDashboardView
      initialSummary={BOUNTY_SUMMARY}
      initialRecords={REFERRAL_RECORDS}
    />
  );
}
