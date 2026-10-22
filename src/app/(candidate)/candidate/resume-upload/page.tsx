import { Metadata } from "next";
import { CandidateResumeUploadView } from "@/components/candidate/resume-upload/CandidateResumeUploadView";

export const metadata: Metadata = {
  title: "AI Resume & Credential Parser | Pepoltek",
  description: "Upload your resume or clinical credentials for automated skills extraction and instant ATS scoring.",
};

export default function CandidateResumeUploadPage() {
  return <CandidateResumeUploadView />;
}
