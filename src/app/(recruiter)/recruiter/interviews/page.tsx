import { Metadata } from "next";
import { RecruiterInterviewsView } from "@/components/recruiter/interviews/RecruiterInterviewsView";
import { RECRUITER_INTERVIEWS } from "@/data/mock";

export const metadata: Metadata = {
  title: "Sprint Technical Interviews | Pepoltek Recruiter",
  description: "Live technical evaluations and panel assessments for pod candidates.",
};

export default function RecruiterInterviewsPage() {
  return <RecruiterInterviewsView interviews={RECRUITER_INTERVIEWS} />;
}
