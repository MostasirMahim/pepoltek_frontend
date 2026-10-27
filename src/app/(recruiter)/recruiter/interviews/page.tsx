import { Metadata } from "next";
import { RecruiterInterviewsView } from "@/components/recruiter/interviews/RecruiterInterviewsView";
import { getRecruiterInterviewsAction } from "@/actions/recruiter.actions";

export const metadata: Metadata = {
  title: "Candidate Interviews & Evaluations | Pepoltek Recruiter",
  description: "Enterprise interview directory, panel briefing coordinates, and scorecard evaluations across all roles.",
};


export default async function RecruiterInterviewsPage() {
  const { interviews, metrics } = await getRecruiterInterviewsAction();
  return (
    <RecruiterInterviewsView
      initialInterviews={interviews}
      initialMetrics={metrics}
      basePath="/recruiter/interviews"
    />
  );
}
