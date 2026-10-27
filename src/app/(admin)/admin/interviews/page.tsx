import { Metadata } from "next";
import { RecruiterInterviewsView } from "@/components/recruiter/interviews/RecruiterInterviewsView";
import { getRecruiterInterviewsAction } from "@/actions/recruiter.actions";

export const metadata: Metadata = {
  title: "Candidate Interviews & Evaluations | Admin Mission Control",
  description: "Enterprise overview of candidate interviews, panel allocations, and scorecard evaluations across all roles.",
};


export default async function AdminInterviewsPage() {
  const { interviews, metrics } = await getRecruiterInterviewsAction();
  return (
    <RecruiterInterviewsView
      initialInterviews={interviews}
      initialMetrics={metrics}
      basePath="/admin/interviews"
    />
  );
}
