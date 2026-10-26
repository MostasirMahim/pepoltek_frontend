"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  CandidateProfile,
  SprintPipelineItem,
  UpcomingInterview,
  CandidateDashboardTelemetry,
  CandidateCredentialItem,
  CandidateDocumentItem,
} from "@/types/candidate.types";
import {
  getCandidateProfileAction,
  getCandidateApplicationsAction,
  updateCandidateProfileAction,
  getCandidateDashboardAction,
  getCandidateCredentialsAction,
  createCandidateCredentialAction,
  deleteCandidateCredentialAction,
  getCandidateDocumentsAction,
  uploadCandidateDocumentAction,
  deleteCandidateDocumentAction,
  toggleCandidateOpenToWorkAction,
  exportCandidateDataAction,
  requestCandidateDeletionAction,
  CandidateCredentialPayload,
} from "@/actions/candidate.actions";
import { getCurrentUserAction } from "@/actions/auth.actions";

export type PersonaType = "alex" | "rachel";

interface CandidatePersonaContextType {
  activePersona: PersonaType;
  setActivePersona: (persona: PersonaType) => void;
  currentProfile: CandidateProfile;
  updateCurrentProfile: (data: Partial<CandidateProfile>) => Promise<boolean>;
  isOpenToPods: boolean;
  setIsOpenToPods: (val: boolean) => void;
  pipelines: SprintPipelineItem[];
  interviews: UpcomingInterview[];
  telemetry: CandidateDashboardTelemetry | null;
  credentials: CandidateCredentialItem[];
  documents: CandidateDocumentItem[];
  isLoading: boolean;
  refreshDashboard: () => Promise<void>;
  toggleOpenToWork: (val: boolean) => Promise<boolean>;
  createCredential: (payload: CandidateCredentialPayload) => Promise<boolean>;
  deleteCredential: (id: string) => Promise<boolean>;
  uploadDocument: (formData: FormData) => Promise<boolean>;
  deleteDocument: (id: string) => Promise<boolean>;
  exportData: () => Promise<any>;
  requestDeletion: (reason: string) => Promise<boolean>;
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
  const [telemetry, setTelemetry] = useState<CandidateDashboardTelemetry | null>(null);
  const [credentials, setCredentials] = useState<CandidateCredentialItem[]>([]);
  const [documents, setDocuments] = useState<CandidateDocumentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Synchronize with live backend profile, telemetry, and credentials
  const loadBackendData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [user, profileRes, dashRes, credsRes, docsRes, appRes] = await Promise.all([
        getCurrentUserAction(),
        getCandidateProfileAction(),
        getCandidateDashboardAction(),
        getCandidateCredentialsAction(),
        getCandidateDocumentsAction(),
        getCandidateApplicationsAction(),
      ]);

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
          phone: be.phone || prev.phone,
          location: be.location || prev.location,
          bio: be.bio || prev.bio,
          githubUrl: be.portfolio_url || prev.githubUrl,
          linkedinUrl: be.linkedin_url || prev.linkedinUrl,
        }));
        if (typeof be.open_to_work === "boolean") {
          setIsOpenToPods(be.open_to_work);
        }
      }

      if (dashRes.success && dashRes.data) {
        const dash = dashRes.data;
        setTelemetry(dash);
        if (typeof dash.open_to_work === "boolean") {
          setIsOpenToPods(dash.open_to_work);
        }
        if (typeof dash.profile_strength === "number") {
          setCurrentProfile((prev) => ({
            ...prev,
            readinessIndex: dash.profile_strength,
            atsCompatibilityScore: dash.cv_score ?? dash.ats_compatibility_score ?? prev.atsCompatibilityScore,
            technicalVettingScore: dash.technical_vetting_score ?? prev.technicalVettingScore,
            requisitionFitScore: dash.match_score ?? (prev.requisitionFitScore || 94),
            vettingTier: (dash.vetting_tier || dash.readiness_tier || prev.vettingTier) as CandidateProfile["vettingTier"],
          }));
        }
        if (Array.isArray(dash.sprint_pipelines) && dash.sprint_pipelines.length > 0) {
          setPipelines(dash.sprint_pipelines as SprintPipelineItem[]);
        }
        if (Array.isArray(dash.interviews) && dash.interviews.length > 0) {
          const mapped: UpcomingInterview[] = dash.interviews.map((item: any) => ({
            id: item.id,
            podName: item.requisition_title || item.role || "Client Sprint",
            role: item.requisition_title || item.role || "Specialist",
            dateString: item.date ? new Date(item.date).toLocaleDateString() : "Scheduled",
            timeString: item.date ? new Date(item.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "TBD",
            type: item.interview_type || "Technical Screening",
            interviewerName: item.interviewer || "Hiring Lead",
            interviewerTitle: "Sprint Reviewer",
            meetingUrl: item.meeting_url || item.meeting_link || "#",
            status: "Confirmed",
          }));
          setInterviews(mapped);
        }
      }

      if (credsRes.success && Array.isArray(credsRes.data)) {
        setCredentials(credsRes.data);
      }

      if (docsRes.success && Array.isArray(docsRes.data)) {
        setDocuments(docsRes.data);
      }

      if (appRes.success && Array.isArray(appRes.data) && appRes.data.length > 0) {
        setPipelines(appRes.data);
      }
    } catch {
      // Graceful fallback
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBackendData();
  }, [loadBackendData]);

  const updateCurrentProfile = async (updated: Partial<CandidateProfile>): Promise<boolean> => {
    setCurrentProfile((prev) => ({ ...prev, ...updated }));
    const res = await updateCandidateProfileAction({
      full_name: updated.fullName,
      phone: updated.phone,
      location: updated.location,
      sector: updated.primaryTrack,
      domain: updated.primaryDomain || updated.title,
      level: updated.seniority,
      work_auth: updated.visaStatus,
      skills: updated.skills,
      desired_hourly_rate: updated.desiredHourlyRate,
      open_to_work: updated.isOpenToPods,
      portfolio_url: updated.githubUrl,
      linkedin_url: updated.linkedinUrl,
      bio: updated.bio,
    });
    if (res.success) {
      loadBackendData();
      return true;
    }
    return false;
  };

  const toggleOpenToWork = async (val: boolean): Promise<boolean> => {
    setIsOpenToPods(val);
    setCurrentProfile((prev) => ({ ...prev, isOpenToPods: val }));
    const res = await toggleCandidateOpenToWorkAction(val);
    if (res.success) {
      if (telemetry) {
        setTelemetry({ ...telemetry, open_to_work: val });
      }
      return true;
    }
    return false;
  };

  const createCredential = async (payload: CandidateCredentialPayload): Promise<boolean> => {
    const res = await createCandidateCredentialAction(payload);
    if (res.success && res.data) {
      setCredentials((prev) => [res.data!, ...prev]);
      loadBackendData();
      return true;
    }
    return false;
  };

  const deleteCredential = async (id: string): Promise<boolean> => {
    const res = await deleteCandidateCredentialAction(id);
    if (res.success) {
      setCredentials((prev) => prev.filter((c) => c.id !== id));
      loadBackendData();
      return true;
    }
    return false;
  };

  const uploadDocument = async (formData: FormData): Promise<boolean> => {
    const res = await uploadCandidateDocumentAction(formData);
    if (res.success && res.data) {
      setDocuments((prev) => [res.data!, ...prev]);
      loadBackendData();
      return true;
    }
    return false;
  };

  const deleteDocument = async (id: string): Promise<boolean> => {
    const res = await deleteCandidateDocumentAction(id);
    if (res.success) {
      setDocuments((prev) => prev.filter((d) => d.id !== id));
      loadBackendData();
      return true;
    }
    return false;
  };

  const exportData = async (): Promise<any> => {
    const res = await exportCandidateDataAction();
    if (res.success) {
      return res.data;
    }
    return null;
  };

  const requestDeletion = async (reason: string): Promise<boolean> => {
    const res = await requestCandidateDeletionAction(reason);
    return res.success;
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
        telemetry,
        credentials,
        documents,
        isLoading,
        refreshDashboard: loadBackendData,
        toggleOpenToWork,
        createCredential,
        deleteCredential,
        uploadDocument,
        deleteDocument,
        exportData,
        requestDeletion,
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
