import { Metadata } from "next";
import { CandidateInterviewsView } from "@/components/candidate/interviews/CandidateInterviewsView";
import { getCandidateInterviewsAction, CandidateInterviewItem } from "@/actions/candidate.actions";

export const metadata: Metadata = {
  title: "Sprint Interviews | Pepoltek Candidate Ecosystem",
  description: "Direct access to scheduled technical coding reviews, system design panels, and client interview sessions.",
};

export default async function CandidateInterviewsPage() {
  let initialInterviews: CandidateInterviewItem[] = [];

  try {
    const res = await getCandidateInterviewsAction();
    if (res.success && Array.isArray(res.data)) {
      initialInterviews = res.data;
    }
  } catch {
    initialInterviews = [];
  }

  return <CandidateInterviewsView initialInterviews={initialInterviews} />;
}
