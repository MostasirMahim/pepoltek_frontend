"use server";

import { cookies } from "next/headers";
import { apiGet, apiPost } from "@/lib/api";

export interface ValidatorProfile {
  email: string;
  full_name: string;
  roles: string[];
  sector: string;
  sector_display: string;
  specialization: string;
  clearance_level: string;
  clearance_display: string;
  max_active_assignments: number;
  total_evaluations_completed: number;
  average_scoring_turnaround_hours: number;
  bio: string;
}

export interface ValidatorTelemetry {
  pending_evaluations: number;
  completed_evaluations: number;
  pending_credentials: number;
  verified_credentials: number;
  average_score: number | null;
  clearance_level: string;
  sector: string;
}

export interface TechnicalQueueItem {
  id: string;
  status: string;
  status_display: string;
  pass_threshold: number;
  final_score: number | null;
  decision_notes: string;
  recruiter_notes: string;
  scheduled_start: string | null;
  started_at: string | null;
  completed_at: string | null;
  is_primary_validator: boolean;
  template: {
    id: string;
    title: string;
    name: string;
    sector: string;
    category: string;
    total_marks: number;
    marks_distribution: Array<{ criterion?: string; name?: string; max_points: number; description?: string }>;
    instructions: string;
    description: string;
  };
  candidate: {
    id: string;
    name: string;
    email: string;
    sector: string;
    level: string;
    domain: string;
    readiness_tier: string;
    portfolio_url: string;
    github_url: string;
    linkedin_url: string;
  };
  requisition: {
    id: string;
    title: string;
    sector: string;
    target_level: string;
  };
  answers: Array<{
    id: string;
    candidate_submission_url: string;
    candidate_notes: string;
    notes: string;
    subtotal_score: number;
    criterion_scores: any[];
    is_final: boolean;
    submitted_at: string;
  }>;
}

export interface CredentialQueueItem {
  id: string;
  name: string;
  kind: string;
  kind_display: string;
  license_number: string;
  jurisdiction: string;
  issued_on: string | null;
  expires_on: string | null;
  status: string;
  status_display: string;
  verification_method: string;
  rejection_reason: string;
  verified_at: string | null;
  verified_by: string | null;
  candidate: {
    id: string;
    name: string;
    email: string;
    sector: string;
    level: string;
    readiness_tier: string;
  };
}

export interface ValidatorDashboardPayload {
  profile: ValidatorProfile;
  telemetry: ValidatorTelemetry;
  technical_queue: TechnicalQueueItem[];
  credential_queue: CredentialQueueItem[];
}

export async function getValidatorDashboardAction(): Promise<{
  success: boolean;
  data?: ValidatorDashboardPayload;
  error?: string;
}> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await apiGet<ValidatorDashboardPayload>("vetting/validator/dashboard/", {
      cookieHeader,
    });
    if (response.error) {
      return { success: false, error: response.error.message || "Failed to load validator dashboard." };
    }
    return { success: true, data: response.data };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to load validator dashboard." };
  }
}

export async function gradeAssessmentAction(payload: {
  vetting_id: string;
  score: number;
  verdict?: "pass" | "fail";
  feedback?: string;
  readiness_tier?: "emerging" | "ready" | "elite";
  criterion_scores?: Array<{ criterion: string; awarded_points: number; max_points: number }>;
}): Promise<{
  success: boolean;
  data?: any;
  error?: string;
}> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await apiPost("vetting/validator/grade/", payload, { cookieHeader });
    if (response.error) {
      return { success: false, error: response.error.message || "Failed to submit assessment grade." };
    }
    return { success: true, data: response.data };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to submit assessment grade." };
  }
}

export async function verifyCredentialAction(payload: {
  credential_id: string;
  status: "verified" | "rejected";
  verification_method?: string;
  rejection_reason?: string;
}): Promise<{
  success: boolean;
  data?: any;
  error?: string;
}> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await apiPost("vetting/validator/verify-credential/", payload, { cookieHeader });
    if (response.error) {
      return { success: false, error: response.error.message || "Failed to verify credential." };
    }
    return { success: true, data: response.data };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to verify credential." };
  }
}
