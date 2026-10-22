import { Metadata } from "next";
import { RecruiterAiSearchView } from "@/components/recruiter/ai-search/RecruiterAiSearchView";

export const metadata: Metadata = {
  title: "AI-HRMS Search Engine | Pepoltek Recruiter",
  description: "Natural language candidate queries matching against technical validation logs and behavioral scorecards.",
};

export default function RecruiterAiSearchPage() {
  return <RecruiterAiSearchView />;
}
