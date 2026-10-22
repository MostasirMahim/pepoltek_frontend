import { Metadata } from "next";
import { AdminReferralsView } from "@/components/admin/referrals/AdminReferralsView";
import { getAdminReferralsPipelineAction } from "@/actions/referral.actions";

export const metadata: Metadata = {
  title: "Referral Pipeline & Scout Bounties | Pepoltek Admin",
  description: "Talent scout referral pipeline, candidate qualification stages, and escrow bounty administration.",
};

export default async function AdminReferralsPage() {
  const result = await getAdminReferralsPipelineAction("all");

  return (
    <AdminReferralsView
      initialRecords={result.data?.records || []}
      initialTelemetry={result.data?.telemetry}
    />
  );
}
