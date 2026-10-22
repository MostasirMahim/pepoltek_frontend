import { Metadata } from "next";
import { RecruiterReferralsView } from "@/components/recruiter/referrals/RecruiterReferralsView";
import { getRecruiterReferralsAction } from "@/actions/recruiter.actions";

export const metadata: Metadata = {
  title: "Referral & Bounty Network Operations | Pepoltek Recruiter",
  description: "Review community-referred talent, fast-track high-signal candidates into active pods, and verify placement milestone bounties.",
};

export default async function RecruiterReferralsPage() {
  const referralsData = await getRecruiterReferralsAction();
  return <RecruiterReferralsView initialData={referralsData} />;
}
