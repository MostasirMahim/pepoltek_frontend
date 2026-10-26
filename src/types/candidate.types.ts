/**
 * Candidate and Talent Workspace Types
 * Pure TypeScript interfaces representing talent profiles, pipelines,
 * reverse searches, assessments, messages, courses, and badges.
 * Zero mock data.
 */

export interface CandidateProfile {
  id: string;
  fullName: string;
  avatarUrl: string;
  email: string;
  phone: string;
  location: string;
  primaryTrack: "technology" | "healthcare";
  title: string;
  seniority: string;
  primaryDomain: string;
  yearsExperience: number;
  skills: string[];
  visaStatus: string;
  engagementPreference: string;
  desiredHourlyRate: string;
  readinessIndex: number; // 0 to 100
  atsCompatibilityScore: number; // 0 to 100
  technicalVettingScore: number; // 0 to 100
  requisitionFitScore?: number; // 0 to 100
  vettingTier: "Tier 1: Elite Squad" | "Tier 2: Screened Specialist" | "Tier 3: General Talent";
  isOpenToPods: boolean;
  sprintAvailability: string;
  timezoneOverlapHours: number;
  githubUrl?: string;
  linkedinUrl?: string;
  clinicalRegistration?: string;
  bio?: string;
}

export interface PipelineStageHistory {
  stageName: string;
  date: string;
  completedBy: string;
  notes: string;
}

export interface PipelineInterviewBrief {
  scheduledAt: string;
  meetingUrl: string;
  interviewerName: string;
  interviewerTitle: string;
  agenda: string;
  preparationTips: string[];
}

export interface PipelineContractDetails {
  rate: string;
  escrowStatus: string;
  guaranteedWeeklyHours: number;
  startDate: string;
  timezoneCoverage: string;
}

export interface SprintPipelineItem {
  id: string;
  podName: string;
  clientName: string;
  clientIndustry: string;
  role: string;
  sector: "Technology" | "Healthcare";
  appliedDate: string;
  currentStage: "Market Mapping" | "Technical Vetting" | "Client Interview" | "Offer & Placement" | "Closed / Deployed" | string;
  subStage?: string;
  source?: string;
  stageIndex: number; // 1 to 5
  totalStages: number;
  rate: string;
  duration: string;
  startDate: string;
  matchScore: number;
  tag: string;
  timezone: string;
  requiredSkills: string[];
  podLeadName: string;
  stageHistory?: PipelineStageHistory[];
  interviewBrief?: PipelineInterviewBrief;
  contractDetails?: PipelineContractDetails;
}

export interface UpcomingInterview {
  id: string;
  podName: string;
  role?: string;
  dateString: string;
  timeString: string;
  type: string;
  interviewerName: string;
  interviewerTitle: string;
  status: "Confirmed" | "Link Ready" | "Under Review";
  meetingUrl: string;
}

export interface AnonymizedPitchPreview {
  maskedCandidateId: string;
  headline: string;
  yearsExperience: number;
  verifiedPercentile: string;
  vettedSkillsRadar: { skill: string; proficiency: number }[];
  anonymizedProjectImpacts: string[];
}

export interface ReverseSearchMatch {
  id: string;
  clientOrgAnonymized: string;
  sector: "Enterprise IT" | "Healthcare & Med-Tech";
  role: string;
  matchScore: number;
  skillOverlap: string[];
  timezoneOverlap: string;
  compensation: string;
  engagement: "C2C" | "W2 Contract" | "Direct Hire";
  sprintVelocity: string;
  authorized: boolean;
  authorizedAt?: string;
  description: string;
  anonymizedPreview?: AnonymizedPitchPreview;
}

export interface AcademyExamQuiz {
  questions: {
    questionText: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
}

export interface AcademyCourse {
  id: string;
  title: string;
  category: "Software Architecture" | "Healthcare Compliance" | "Enterprise Agile";
  duration: string;
  modulesCount: number;
  completedModules: number;
  progressPercentage: number;
  status: "Completed" | "In Progress" | "Available" | "Locked";
  badgeName: string;
  tierUnlockText: string;
  instructor: string;
  syllabus: string[];
  examQuiz?: AcademyExamQuiz;
}

export interface TalentBadge {
  id: string;
  name: string;
  category: string;
  status: "Active" | "In Progress" | "Locked";
  level: "Tier 1" | "Tier 2" | "Tier 3";
  earnedDate?: string;
  rateBoost: string;
  iconName: string;
}

export interface ParsedResumePayload {
  fullName: string;
  email: string;
  phone: string;
  sector: "technology" | "healthcare";
  primaryDomain: string;
  experienceLevel: string;
  skills: string;
  visaStatus: string;
  clinicalRegNumber?: string;
  hourlyExpectation: string;
  extractedYears: number;
  githubUrl?: string;
  missingFields: string[];
  warnings: string[];
}

export interface ChatMessage {
  id: string;
  senderName: string;
  senderRole: string;
  avatarUrl: string;
  isSelf: boolean;
  timestamp: string;
  content: string;
}

export interface AssessmentReport {
  id: string;
  title: string;
  overallScore: number;
  codeQualityScore: number;
  systemDesignScore: number;
  testCoveragePercentage: number;
  behavioralScore: number;
  tierRanking: string;
  evaluatedBy: string;
  evaluationDate: string;
  evaluatorNotes: string;
}

export interface CandidateNextBestAction {
  code?: string;
  title: string;
  description: string;
  action_url?: string;
  action_label?: string;
  cta_url?: string;
  cta_label?: string;
  priority?: "high" | "medium" | "normal" | string;
  urgency?: "HIGH" | "MEDIUM" | "LOW" | string;
  target_metric?: string;
}

export interface CandidateDashboardInterview {
  id: string;
  role: string;
  client_name?: string;
  requisition_title?: string;
  interviewer?: string;
  interview_type?: string;
  date?: string;
  scheduled_at?: string;
  meeting_url?: string;
  meeting_link?: string;
  status: string;
}

export interface CandidateDashboardTelemetry {
  profile_strength: number;
  ats_compatibility_score?: number;
  cv_score?: number;
  technical_vetting_score: number;
  vetting_tier?: string;
  readiness_tier?: string;
  readiness_index?: number;
  open_to_work: boolean;
  match_score?: number;
  active_applications_count?: number;
  total_applications_count?: number;
  matched_roles_count?: number;
  credentials_count: number;
  verified_credentials_count?: number;
  documents_count: number;
  latest_document?: {
    filename: string;
    doc_type: string;
    scan_status: string;
    uploaded_at: string;
  } | null;
  next_best_action?: CandidateNextBestAction;
  upcoming_interviews?: CandidateDashboardInterview[];
  sprint_pipelines?: any[];
  interviews?: any[];
  stats?: Record<string, any>;
}

export interface CandidateCredentialItem {
  id: string;
  kind?: "license" | "certification" | string;
  name: string;
  license_number?: string;
  jurisdiction?: string;
  issuing_authority?: string;
  issued_on?: string | null;
  expires_on?: string | null;
  expires_at?: string | null;
  status: "unverified" | "verified" | "rejected" | "expired" | string;
  verified_at?: string | null;
  created_at: string;
}

export interface CandidateDocumentItem {
  id: string;
  doc_type: string;
  original_filename?: string;
  file_url?: string;
  size_bytes?: number;
  file_size?: number;
  sha256_hash?: string;
  version: number;
  scan_status?: string;
  created_at: string;
}
