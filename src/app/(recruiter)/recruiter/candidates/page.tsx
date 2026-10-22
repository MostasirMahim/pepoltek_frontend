import { Metadata } from "next";
import { RecruiterCandidatesView } from "@/components/recruiter/candidates/RecruiterCandidatesView";
import { RECRUITER_TALENT_POOL } from "@/data/mock";

export const metadata: Metadata = {
  title: "Pre-Vetted Talent Directory | Pepoltek Recruiter",
  description: "Browse pre-screened software engineering and healthcare talent ready for pod deployment.",
};

export default function RecruiterCandidatesPage() {
  return <RecruiterCandidatesView candidates={RECRUITER_TALENT_POOL} />;
}
