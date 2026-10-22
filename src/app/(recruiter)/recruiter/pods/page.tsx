import { Metadata } from "next";
import { RecruiterPodsView } from "@/components/recruiter/pods/RecruiterPodsView";
import { RECRUITER_ACTIVE_PODS } from "@/data/mock";

export const metadata: Metadata = {
  title: "Enterprise Pod Management | Pepoltek Recruiter",
  description: "Configure and manage active engineering pods and clinical staffing squads.",
};

export default function RecruiterPodsPage() {
  return <RecruiterPodsView pods={RECRUITER_ACTIVE_PODS} />;
}
