import { Metadata } from "next";
import { PublicJobsView } from "@/components/main/jobs/PublicJobsView";
import { getPublicJobsAction } from "@/actions/recruiter.actions";

export const metadata: Metadata = {
  title: "Open Engineering Pods & Healthcare Rotas | Pepoltek Job Board",
  description:
    "Explore open high-velocity software engineering pods and clinical staffing squads. 7-day deployment SLA with transparent compensation.",
};

export default async function PublicJobsPage() {
  const jobs = await getPublicJobsAction();
  return <PublicJobsView initialJobs={jobs} />;
}
