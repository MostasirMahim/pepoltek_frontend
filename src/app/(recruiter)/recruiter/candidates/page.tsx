import { Metadata } from "next";
import { RecruiterCandidatesView } from "@/components/recruiter/candidates/RecruiterCandidatesView";
import {
  getRecruiterCandidatesAction,
  getRecruiterPodsAction,
} from "@/actions/recruiter.actions";

export const metadata: Metadata = {
  title: "Talent Pool (Candidates) | Pepoltek Recruiter",
  description: "Browse candidate talent pool across software engineering and healthcare sectors sourced directly from live database profiles.",
};

export default async function RecruiterCandidatesPage() {
  const [candidates, pods] = await Promise.all([
    getRecruiterCandidatesAction(),
    getRecruiterPodsAction(),
  ]);
  return <RecruiterCandidatesView candidates={candidates} pods={pods} />;
}

