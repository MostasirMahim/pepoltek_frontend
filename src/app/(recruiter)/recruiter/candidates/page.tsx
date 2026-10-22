import { Metadata } from "next";
import { RecruiterCandidatesView } from "@/components/recruiter/candidates/RecruiterCandidatesView";
import {
  getRecruiterCandidatesAction,
  getRecruiterPodsAction,
} from "@/actions/recruiter.actions";

export const metadata: Metadata = {
  title: "Pre-Vetted Talent Directory | Pepoltek Recruiter",
  description: "Browse pre-screened software engineering and healthcare talent ready for pod deployment.",
};

export default async function RecruiterCandidatesPage() {
  const [candidates, pods] = await Promise.all([
    getRecruiterCandidatesAction(),
    getRecruiterPodsAction(),
  ]);
  return <RecruiterCandidatesView candidates={candidates} pods={pods} />;
}

