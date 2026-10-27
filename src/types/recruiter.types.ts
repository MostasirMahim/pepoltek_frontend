/**
 * Recruiter Workspace Types
 * Pure TypeScript interfaces representing recruiter pods, candidates,
 * interviews, and shortlists. Zero mock data.
 */

export interface RecruiterPod {
  id: string;
  rawId?: string;
  name: string;
  type: "Software Tech" | "Healthcare" | "Dual Sector";
  lead: string;
  size?: string;
  stage?: string;
  velocity?: string;
  members: string[];
  status:
    | "Active Sprint"
    | "Deployed On-Site"
    | "Sprint Assembly"
    | "Client Review"
    | "open"
    | "on_hold"
    | "filled"
    | "cancelled"
    | string;
  sprintProgress: string;
  deploymentDate: string;
  weeklyBudget: string;
  burnRate?: "Optimal" | "Normal" | "Elevated";
  clientName?: string;
  sector?: string;
  level?: string;
  headcount?: number;
  budgetMin?: number;
  budgetMax?: number;
  visibility?: string;
  bountyAmount?: number;
  bountyEnabled?: boolean;
  bountyTypeId?: string;
  bountyTypeName?: string;
  description?: string;
  candidatesCount?: number;
  location?: string;
  engagement?: string;
}

export interface RecruiterCandidate {
  id: string;
  display_id?: string;
  name: string;
  title: string;
  sector: "Software Tech" | "Healthcare";
  skills: string[];
  experience: string;
  matchScore: string;
  rate: string;
  availability: string;
  verified: boolean;
  vetting_status?: string;
  email?: string;
  phone?: string;
  location?: string;
  workAuth?: string;
  engagement?: string;
  summary?: string;
  notes?: string;
  profileStrength?: number;
  readinessIndex?: number;
  cvScore?: number;
  vettingScore?: number;
  readinessTier?: string;
  positive_factors?: string[];
  gap_factors?: string[];
  semantic_score?: number;
  skill_score?: number;
  level_score?: number;
  matched_skills?: string[];
}

export interface AICandidateSearchFilters {
  role?: string;
  skills?: string[];
  level?: string;
  sector?: string;
  engagement?: string[];
  must_haves?: string[];
}

export interface AICandidateSearchResult {
  query: string;
  extracted_filters: AICandidateSearchFilters;
  candidates: RecruiterCandidate[];
  total_evaluated: number;
  provider: string;
  latency_seconds: number;
}


export interface InterviewPanelAssignmentItem {
  id: string;
  staff_user_id: string;
  staff_user_name: string;
  staff_user_email: string;
  role: "lead_interviewer" | "technical_assessor" | "clinical_validator" | "client_observer" | string;
  has_confirmed: boolean;
  notes?: string;
  created_at?: string;
}

export interface InterviewEvaluationItem {
  id: string;
  evaluator_id: string;
  evaluator_name: string;
  evaluator_email: string;
  score: number;
  recommendation: "strong_hire" | "hire" | "neutral" | "do_not_hire" | string;
  competency_scores: {
    competency: string;
    score: number;
    max_score: number;
    notes?: string;
  }[];
  feedback: string;
  submitted_at: string;
}

export interface RecruiterInterview {
  id: string;
  application_id?: string;
  candidate: string;
  candidate_id?: string;
  candidate_email?: string;
  candidate_headline?: string;
  role: string;
  requisition_id?: string;
  requisition_title?: string;
  client_name?: string;
  pod?: string;
  title?: string;
  time: string;
  scheduled_start?: string;
  scheduled_end?: string;
  timezone?: string;
  meeting_link?: string;
  type: string;
  interview_type?: string;
  round_number?: number;
  panel: string;
  lead_interviewer_id?: string;
  lead_interviewer_name?: string;
  assignments?: InterviewPanelAssignmentItem[];
  evaluations_count?: number;
  average_score?: number | null;
  reminder_24h_dispatched?: boolean;
  status: "Upcoming" | "Confirmed" | "Scheduled" | "Completed" | "Rescheduled" | "Cancelled" | "No Show" | string;
  raw_status?: string;
  created_at?: string;
}

export interface RecruiterInterviewDetail extends RecruiterInterview {
  candidate_notes?: string;
  internal_brief?: string;
  reminder_24h_dispatched_at?: string | null;
  evaluations: InterviewEvaluationItem[];
}

export interface RecruiterShortlist {
  name: string;
  role: string;
  skills: string[];
  match: string;
  status: string;
  action: string;
}

export type RecruiterRequisition = RecruiterPod;
