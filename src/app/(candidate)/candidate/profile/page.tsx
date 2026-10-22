import { Metadata } from "next";
import { CandidateProfileView } from "@/components/candidate/profile/CandidateProfileView";
import { getCandidateProfileAction } from "@/actions/candidate.actions";
import { getCurrentUserAction } from "@/actions/auth.actions";
import { CandidateProfile } from "@/data/talentDashboardData";

export const metadata: Metadata = {
  title: "Candidate Master Profile | Pepoltek",
  description: "Manage candidate skills, credentials, work authorization, and pod engagement preferences.",
};

const DEFAULT_CLEAN_PROFILE: CandidateProfile = {
  id: "CAND-VERIFIED",
  fullName: "Candidate",
  avatarUrl: "",
  email: "",
  phone: "",
  location: "Remote / Hybrid",
  primaryTrack: "technology",
  title: "Full Stack Engineer",
  seniority: "Lead / Senior",
  primaryDomain: "Cloud & Distributed Systems",
  yearsExperience: 5,
  skills: ["TypeScript", "Next.js", "Python", "Docker"],
  visaStatus: "Verified Work Authorization",
  engagementPreference: "Sprint Contracting / Direct",
  desiredHourlyRate: "$85 to $110 / hr",
  readinessIndex: 85,
  atsCompatibilityScore: 92,
  technicalVettingScore: 88,
  vettingTier: "Tier 2: Screened Specialist",
  isOpenToPods: true,
  sprintAvailability: "Immediate Availability",
  timezoneOverlapHours: 5,
  bio: "Candidate profile registered on the Pepoltek talent network.",
};

export default async function CandidateProfilePage() {
  const [user, res] = await Promise.all([
    getCurrentUserAction(),
    getCandidateProfileAction().catch(() => ({ success: false, data: null })),
  ]);

  const initialProfile: CandidateProfile = {
    ...DEFAULT_CLEAN_PROFILE,
    fullName: res?.data?.full_name || user?.fullName || "Candidate",
    email: res?.data?.email || user?.email || "",
    phone: res?.data?.phone || "",
    location: res?.data?.location || "Remote / Hybrid",
    seniority: res?.data?.level || "Lead / Senior",
    primaryDomain: res?.data?.domain || "Cloud & Distributed Systems",
    skills: res?.data?.skills || ["TypeScript", "Next.js", "Python"],
    isOpenToPods: res?.data?.open_to_work ?? true,
  };

  return <CandidateProfileView initialProfile={initialProfile} />;
}
