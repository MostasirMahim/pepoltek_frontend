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
  name: string;
  title: string;
  sector: "Software Tech" | "Healthcare";
  skills: string[];
  experience: string;
  matchScore: string;
  rate: string;
  availability: string;
  verified: boolean;
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
}

export interface RecruiterInterview {
  id: string;
  candidate: string;
  role: string;
  pod: string;
  time: string;
  type: string;
  panel: string;
  status: "Upcoming" | "Confirmed" | "Scheduled" | "Completed";
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
