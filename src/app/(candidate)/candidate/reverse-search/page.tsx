import { Metadata } from "next";
import { CandidateReverseSearchView } from "@/components/candidate/reverse-search/CandidateReverseSearchView";
import {
  getReverseSearchMatchesAction,
  getCandidatePitchRequestsAction,
  PitchRequestItem,
} from "@/actions/matching.actions";
import { ReverseSearchMatch } from "@/types/candidate.types";

export const metadata: Metadata = {
  title: "Reverse Job Search Engine | Pepoltek",
  description: "AI reverse requisition matching with zero public profile exposure and 1-Click Pitch authorization.",
};

export default async function CandidateReverseSearchPage() {
  let initialMatches: ReverseSearchMatch[] = [];
  let initialPitchRequests: PitchRequestItem[] = [];

  try {
    const [matchesRes, pitchRes] = await Promise.all([
      getReverseSearchMatchesAction(),
      getCandidatePitchRequestsAction(),
    ]);

    if (matchesRes.success && matchesRes.data && matchesRes.data.length > 0) {
      initialMatches = matchesRes.data.map((item, idx) => ({
        id: item.id || `MATCH-BE-${idx}`,
        requisition_id: item.requisition_id || item.id,
        clientOrgAnonymized: item.company_masked || "Enterprise Client (Confidential)",
        role: item.title,
        level: item.level || "Senior",
        location: item.location || "100% Remote",
        sector: item.sector === "healthcare" ? "Healthcare & Med-Tech" : "Enterprise IT",
        matchScore: item.match_score || 95,
        skillOverlap: item.skills || ["Next.js", "TypeScript", "Node.js"],
        timezoneOverlap: item.timezone_overlap || "4h guaranteed live overlap",
        compensation: item.rate_range || "$85 - $110 / hr",
        engagement: item.engagement || "C2C Direct Sprint",
        sprintVelocity: "7-Day Sprint Ready",
        authorized: item.pitch_status === "authorized",
        authorizedAt: item.pitch_status === "authorized" ? "Verified" : undefined,
        pitch_status: item.pitch_status,
        description: item.description || "Matched based on verified skills, timezone alignment, and work authorization.",
      }));
    }

    if (pitchRes.success && pitchRes.data) {
      initialPitchRequests = pitchRes.data;
    }
  } catch {
    // Fallback gracefully
  }

  return (
    <CandidateReverseSearchView
      initialMatches={initialMatches}
      initialPitchRequests={initialPitchRequests}
    />
  );
}

