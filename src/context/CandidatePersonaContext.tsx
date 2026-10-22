"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  CandidateProfile,
  SprintPipelineItem,
  UpcomingInterview,
} from "@/data/talentDashboardData";
import {
  getCandidateProfileAction,
  getCandidateApplicationsAction,
  updateCandidateProfileAction,
} from "@/actions/candidate.actions";
import { getCurrentUserAction } from "@/actions/auth.actions";

export type PersonaType = "alex" | "rachel";

interface CandidatePersonaContextType {
  activePersona: PersonaType;
  setActivePersona: (persona: PersonaType) => void;
  currentProfile: CandidateProfile;
  updateCurrentProfile: (data: Partial<CandidateProfile>) => void;
  isOpenToPods: boolean;
  setIsOpenToPods: (val: boolean) => void;
  pipelines: SprintPipelineItem[];
  interviews: UpcomingInterview[];
  isLoading: boolean;
}

const CLEAN_CANDIDATE_PROFILE: CandidateProfile = {
  id: "CAND-VERIFIED",
  fullName: "Talent Candidate",
  avatarUrl: "",
  email: "",
  phone: "",
  location: "Remote / Hybrid",
  primaryTrack: "technology",
  title: "Candidate Specialist",
  seniority: "Intake Pending",
  primaryDomain: "Full-Stack & Cloud Systems",
  yearsExperience: 0,
  skills: [],
  visaStatus: "Verified at Intake",
  engagementPreference: "Sprint Contracting / Direct",
  desiredHourlyRate: "Specified in Intake",
  readinessIndex: 0,
  atsCompatibilityScore: 0,
  technicalVettingScore: 0,
  vettingTier: "Tier 3: General Talent",
  isOpenToPods: true,
  sprintAvailability: "Immediate Availability",
  timezoneOverlapHours: 5,
  bio: "Candidate profile registered on the Pepoltek talent network. Vetting and assessment in progress.",
};

const CandidatePersonaContext = createContext<CandidatePersonaContextType | undefined>(undefined);

export function CandidatePersonaProvider({ children }: { children: React.ReactNode }) {
  const [activePersona, setActivePersona] = useState<PersonaType>("alex");
  const [currentProfile, setCurrentProfile] = useState<CandidateProfile>(CLEAN_CANDIDATE_PROFILE);
  const [isOpenToPods, setIsOpenToPods] = useState(true);
  const [pipelines, setPipelines] = useState<SprintPipelineItem[]>([]);
  const [interviews, setInterviews] = useState<UpcomingInterview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Synchronize with live backend profile and authenticated user
  useEffect(() => {
    let isMounted = true;

    async function loadBackendData() {
      try {
        setIsLoading(true);
        const [user, profileRes, appRes] = await Promise.all([
          getCurrentUserAction(),
          getCandidateProfileAction(),
          getCandidateApplicationsAction(),
        ]);

        if (!isMounted) return;

        if (user) {
          setCurrentProfile((prev) => ({
            ...prev,
            fullName: user.fullName || prev.fullName,
            email: user.email || prev.email,
          }));
        }

        if (profileRes.success && profileRes.data) {
          const be = profileRes.data;
          setCurrentProfile((prev) => ({
            ...prev,
            fullName: be.full_name || prev.fullName,
            primaryTrack: (be.sector as "technology" | "healthcare") || prev.primaryTrack,
            skills: Array.isArray(be.skills) && be.skills.length > 0 ? be.skills : prev.skills,
            readinessIndex: typeof be.profile_strength === "number" ? be.profile_strength : prev.readinessIndex,
            isOpenToPods: be.open_to_work ?? prev.isOpenToPods,
            desiredHourlyRate: be.desired_hourly_rate || prev.desiredHourlyRate,
            title: be.domain || prev.title,
            seniority: be.level || prev.seniority,
          }));
          if (typeof be.open_to_work === "boolean") {
            setIsOpenToPods(be.open_to_work);
          }
        }

        if (appRes.success && Array.isArray(appRes.data) && appRes.data.length > 0) {
          setPipelines(appRes.data);
        } else {
          setPipelines([]);
        }

        // Live candidate starts with empty interviews until scheduled
        setInterviews([]);
      } catch {
        // Fallback gracefully
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadBackendData();

    return () => {
      isMounted = false;
    };
  }, []);

  const updateCurrentProfile = (updated: Partial<CandidateProfile>) => {
    setCurrentProfile((prev) => ({ ...prev, ...updated }));

    // Fire background mutation to live backend
    updateCandidateProfileAction({
      full_name: updated.fullName,
      sector: updated.primaryTrack,
      skills: updated.skills,
      open_to_work: updated.isOpenToPods,
    }).catch(() => {});
  };

  return (
    <CandidatePersonaContext.Provider
      value={{
        activePersona,
        setActivePersona,
        currentProfile,
        updateCurrentProfile,
        isOpenToPods,
        setIsOpenToPods,
        pipelines,
        interviews,
        isLoading,
      }}
    >
      {children}
    </CandidatePersonaContext.Provider>
  );
}

export function useCandidatePersona() {
  const context = useContext(CandidatePersonaContext);
  if (!context) {
    throw new Error("useCandidatePersona must be used within a CandidatePersonaProvider");
  }
  return context;
}
