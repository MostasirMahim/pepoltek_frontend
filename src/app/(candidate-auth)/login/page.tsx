import { Metadata } from "next";
import { CandidateLoginView } from "@/components/auth/CandidateLoginView";

export const metadata: Metadata = {
  title: "Candidate Sign In | Pepoltek Global Talent",
  description: "Sign in to access your candidate portal, track applications, and explore global opportunities.",
};

export default function CandidateLoginPage() {
  return <CandidateLoginView />;
}
