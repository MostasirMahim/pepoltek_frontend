import { Metadata } from "next";
import { RecruiterDashboardView } from "@/components/recruiter/dashboard/RecruiterDashboardView";
import {
  getRecruiterPodsAction,
  getRecruiterCandidatesAction,
  getRecruiterAnalyticsAction,
} from "@/actions/recruiter.actions";
import { RecruiterShortlist } from "@/types/recruiter.types";

export const metadata: Metadata = {
  title: "Recruiter Cockpit & Pod Deployment Hub | Pepoltek",
  description: "Manage sprint engineering pods and clinical staffing squads with 7-day deployment SLA.",
};

export default async function RecruiterDashboardPage() {
  const [pods, candidates, analytics] = await Promise.all([
    getRecruiterPodsAction(),
    getRecruiterCandidatesAction(),
    getRecruiterAnalyticsAction(),
  ]);

  const shortlists: RecruiterShortlist[] = candidates.slice(0, 3).map((c) => ({
    name: c.name,
    role: c.title,
    skills: c.skills.slice(0, 3),
    match: c.matchScore,
    status: c.availability,
    action: "Review Profile",
  }));

  return (
    <RecruiterDashboardView
      pods={pods}
      shortlists={shortlists}
      analytics={analytics}
    />
  );
}
