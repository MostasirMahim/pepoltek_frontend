import { Metadata } from "next";
import { CandidateDashboardView } from "@/components/candidate/dashboard/CandidateDashboardView";

export const metadata: Metadata = {
  title: "Candidate Talent Cockpit | Pepoltek",
  description: "Live progress across sprint application pipelines, reverse search pod matches, and vetting status.",
};

export default function CandidateDashboardPage() {
  return <CandidateDashboardView />;
}
