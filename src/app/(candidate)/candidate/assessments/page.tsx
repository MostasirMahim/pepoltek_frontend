import { Metadata } from "next";
import { CandidateAssessmentsView } from "@/components/candidate/assessments/CandidateAssessmentsView";

export const metadata: Metadata = {
  title: "Candidate Assessments & Vetting | Pepoltek",
  description: "Objective proctor-free technical evaluations and clinical competency benchmarks.",
};

export default function CandidateAssessmentsPage() {
  return <CandidateAssessmentsView />;
}
