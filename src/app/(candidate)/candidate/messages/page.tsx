import { Metadata } from "next";
import { CandidateMessagesView } from "@/components/candidate/messages/CandidateMessagesView";

export const metadata: Metadata = {
  title: "Sprint Messages & Briefings | Pepoltek",
  description: "Direct communications with your assigned Pod Lead, Recruiter, and Technical Evaluators.",
};

export default function CandidateMessagesPage() {
  return <CandidateMessagesView />;
}
