import { Metadata } from "next";
import { RecruiterInterviewsView } from "@/components/recruiter/interviews/RecruiterInterviewsView";
import { getRecruiterInterviewsAction } from "@/actions/recruiter.actions";

export const metadata: Metadata = {
  title: "Sprint Technical Interviews | Pepoltek Recruiter",
  description: "Live technical evaluations and panel assessments for pod candidates.",
};

export default async function RecruiterInterviewsPage() {
  const interviews = await getRecruiterInterviewsAction();
  return <RecruiterInterviewsView interviews={interviews} />;
}
