import { Metadata } from "next";
import { PublicJobsView } from "@/components/main/jobs/PublicJobsView";
import { getPublicJobsAction } from "@/actions/recruiter.actions";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Open Requisitions & Healthcare Rotas | Pepoltek Job Board",
  description:
    "Explore open high-velocity software engineering squads and clinical staffing squads. 7-day deployment SLA with transparent compensation.",
};

export default async function PublicJobsPage() {
  const jobs = await getPublicJobsAction();
  return <PublicJobsView initialJobs={jobs} />;
}
