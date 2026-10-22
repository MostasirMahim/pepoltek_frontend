import { Metadata } from "next";
import { CandidateReverseSearchView } from "@/components/candidate/reverse-search/CandidateReverseSearchView";
import { getReverseSearchMatchesAction } from "@/actions/matching.actions";
import { REVERSE_SEARCH_MATCHES, ReverseSearchMatch } from "@/data/talentDashboardData";

export const metadata: Metadata = {
  title: "Reverse Job Search Engine | Pepoltek",
  description: "AI reverse requisition matching with zero public profile exposure and 1-Click Pitch authorization.",
};

export default async function CandidateReverseSearchPage() {
  let initialMatches: ReverseSearchMatch[] = [];

  try {
    const res = await getReverseSearchMatchesAction();
    if (res.success && res.data && res.data.length > 0) {
      initialMatches = res.data.map((item, idx) => ({
        id: item.id || `MATCH-BE-${idx}`,
        clientOrgAnonymized: item.company_masked || "Enterprise Client (Confidential)",
        role: item.title,
        sector: item.sector === "healthcare" ? "Healthcare & Med-Tech" : "Enterprise IT",
        matchScore: item.match_score || 95,
        skillOverlap: item.skills || ["Next.js", "TypeScript", "Node.js"],
        timezoneOverlap: item.timezone_overlap || "4h guaranteed live overlap",
        compensation: item.rate_range || "$85 - $110 / hr",
        engagement: "C2C",
        sprintVelocity: "7-Day Sprint Ready",
        authorized: item.pitch_status === "authorized",
        authorizedAt: item.pitch_status === "authorized" ? "Verified" : undefined,
        description: "Matched based on verified skills, timezone alignment, and work authorization.",
      }));
    }
  } catch {
    // Fallback gracefully
  }

  return <CandidateReverseSearchView initialMatches={initialMatches} />;
}
