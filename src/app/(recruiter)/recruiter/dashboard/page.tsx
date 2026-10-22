import { Metadata } from "next";
import { RecruiterDashboardView } from "@/components/recruiter/dashboard/RecruiterDashboardView";
import { RECRUITER_ACTIVE_PODS, RECRUITER_SHORTLISTS } from "@/data/mock";

export const metadata: Metadata = {
  title: "Recruiter Cockpit & Pod Deployment Hub | Pepoltek",
  description: "Manage sprint engineering pods and clinical staffing squads with 7-day deployment SLA.",
};

export default function RecruiterDashboardPage() {
  return (
    <RecruiterDashboardView
      pods={RECRUITER_ACTIVE_PODS}
      shortlists={RECRUITER_SHORTLISTS}
    />
  );
}
