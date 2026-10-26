"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { apiGet, apiPatch, apiPost, apiDelete, apiUpload } from "@/lib/api";
import {
  CandidateProfile,
  CandidateDashboardTelemetry,
  CandidateCredentialItem,
  CandidateDocumentItem,
} from "@/types/candidate.types";

export interface CandidateProfilePayload {
  full_name?: string;
  phone?: string;
  sector?: "technology" | "healthcare";
  domain?: string;
  level?: string;
  location?: string;
  timezone?: string;
  work_auth?: string;
  engagement_prefs?: string[];
  desired_hourly_rate?: string;
  expected_comp_min?: number;
  expected_comp_max?: number;
  open_to_work?: boolean;
  portfolio_url?: string;
  github_url?: string;
  linkedin_url?: string;
  bio?: string;
  skills?: string[];
}

export interface CandidateIntakePayload {
  email: string;
  password?: string;
  full_name: string;
  phone?: string;
  sector: "technology" | "healthcare";
  domain?: string;
  level: string;
  location?: string;
  timezone?: string;
  work_auth?: string;
  engagement_prefs?: string[];
  skills?: string[];
  portfolio_url?: string;
  github_url?: string;
  linkedin_url?: string;
  linkedin_profile?: string;
  current_job_title?: string;
  current_location?: string;
  target_compensation?: string;
  resume_text?: string;
}

export interface CandidateCredentialPayload {
  kind?: "license" | "certification" | string;
  name: string;
  license_number?: string;
  jurisdiction?: string;
  issuing_authority?: string;
  issued_on?: string | null;
  expires_on?: string | null;
  expires_at?: string | null;
}

export interface CandidateActionResult<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    fields?: Record<string, string[]>;
  };
}

/**
 * Fetch aggregated dashboard telemetry, scores, and next action (SRS CAN-08).
 */
export async function getCandidateDashboardAction(): Promise<CandidateActionResult<CandidateDashboardTelemetry>> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await apiGet<CandidateDashboardTelemetry>("candidates/me/dashboard/", { cookieHeader });
    if (response.error) {
      return { success: false, error: response.error };
    }
    return { success: true, data: response.data };
  } catch (err: any) {
    return {
      success: false,
      error: {
        code: "SERVER_EXCEPTION",
        message: err.message || "Failed to load candidate dashboard.",
      },
    };
  }
}

/**
 * Fetch authenticated candidate profile and readiness stats.
 */
export async function getCandidateProfileAction(): Promise<CandidateActionResult<any>> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await apiGet("candidates/me/", { cookieHeader });
    if (response.error) {
      return { success: false, error: response.error };
    }
    return { success: true, data: response.data };
  } catch (err: any) {
    return {
      success: false,
      error: {
        code: "SERVER_EXCEPTION",
        message: err.message || "Failed to load candidate profile.",
      },
    };
  }
}

/**
 * Update candidate profile preferences and verified skills (SRS CAN-09).
 */
export async function updateCandidateProfileAction(
  payload: CandidateProfilePayload
): Promise<CandidateActionResult<any>> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await apiPatch("candidates/me/", payload, { cookieHeader });
    if (response.error) {
      return { success: false, error: response.error };
    }

    revalidatePath("/candidate/profile");
    revalidatePath("/candidate/dashboard");
    return { success: true, data: response.data };
  } catch (err: any) {
    return {
      success: false,
      error: {
        code: "SERVER_EXCEPTION",
        message: err.message || "Failed to update profile.",
      },
    };
  }
}

/**
 * Fast toggle candidate open_to_work / pitch authorization status.
 */
export async function toggleCandidateOpenToWorkAction(
  openToWork: boolean
): Promise<CandidateActionResult<{ open_to_work: boolean }>> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await apiPatch<any>("candidates/pitch/", { authorized: openToWork }, { cookieHeader });
    if (response.error) {
      return { success: false, error: response.error };
    }

    revalidatePath("/candidate/dashboard");
    revalidatePath("/candidate/profile");
    return { success: true, data: response.data };
  } catch (err: any) {
    return {
      success: false,
      error: {
        code: "SERVER_EXCEPTION",
        message: err.message || "Failed to toggle pitch authorization.",
      },
    };
  }
}

/**
 * Fetch candidate professional licenses and certifications (SRS CAN-04, VET-04).
 */
export async function getCandidateCredentialsAction(): Promise<CandidateActionResult<CandidateCredentialItem[]>> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await apiGet<CandidateCredentialItem[]>("candidates/me/credentials/", { cookieHeader });
    if (response.error) {
      return { success: false, error: response.error };
    }
    return { success: true, data: Array.isArray(response.data) ? response.data : [] };
  } catch (err: any) {
    return {
      success: false,
      error: {
        code: "SERVER_EXCEPTION",
        message: err.message || "Failed to load credentials.",
      },
    };
  }
}

/**
 * Add a new candidate license or certification (SRS CAN-04).
 */
export async function createCandidateCredentialAction(
  payload: CandidateCredentialPayload
): Promise<CandidateActionResult<CandidateCredentialItem>> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await apiPost<CandidateCredentialItem>("candidates/me/credentials/", payload, { cookieHeader });
    if (response.error) {
      return { success: false, error: response.error };
    }

    revalidatePath("/candidate/dashboard");
    revalidatePath("/candidate/profile");
    return { success: true, data: response.data };
  } catch (err: any) {
    return {
      success: false,
      error: {
        code: "SERVER_EXCEPTION",
        message: err.message || "Failed to record credential.",
      },
    };
  }
}

/**
 * Delete a candidate license or certification.
 */
export async function deleteCandidateCredentialAction(
  id: string
): Promise<CandidateActionResult> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await apiDelete(`candidates/me/credentials/${id}/`, { cookieHeader });
    if (response.error) {
      return { success: false, error: response.error };
    }

    revalidatePath("/candidate/dashboard");
    revalidatePath("/candidate/profile");
    return { success: true, data: response.data };
  } catch (err: any) {
    return {
      success: false,
      error: {
        code: "SERVER_EXCEPTION",
        message: err.message || "Failed to delete credential.",
      },
    };
  }
}

/**
 * Fetch candidate documents and CV uploads (SRS CAN-09).
 */
export async function getCandidateDocumentsAction(): Promise<CandidateActionResult<CandidateDocumentItem[]>> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await apiGet<CandidateDocumentItem[]>("candidates/me/documents/", { cookieHeader });
    if (response.error) {
      return { success: false, error: response.error };
    }
    return { success: true, data: Array.isArray(response.data) ? response.data : [] };
  } catch (err: any) {
    return {
      success: false,
      error: {
        code: "SERVER_EXCEPTION",
        message: err.message || "Failed to load documents.",
      },
    };
}
}

/**
 * Upload a candidate CV, resume, or certification document (SRS CAN-09, PAR-01).
 */
export async function uploadCandidateDocumentAction(
  formData: FormData
): Promise<CandidateActionResult<CandidateDocumentItem>> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await apiUpload<CandidateDocumentItem>("candidates/me/documents/", formData, { cookieHeader });
    if (response.error) {
      return { success: false, error: response.error };
    }

    revalidatePath("/candidate/dashboard");
    revalidatePath("/candidate/profile");
    return { success: true, data: response.data };
  } catch (err: any) {
    return {
      success: false,
      error: {
        code: "SERVER_EXCEPTION",
        message: err.message || "Failed to upload document.",
      },
    };
  }
}

/**
 * Delete a candidate document or old resume version.
 */
export async function deleteCandidateDocumentAction(
  id: string
): Promise<CandidateActionResult> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await apiDelete(`candidates/me/documents/${id}/`, { cookieHeader });
    if (response.error) {
      return { success: false, error: response.error };
    }

    revalidatePath("/candidate/dashboard");
    revalidatePath("/candidate/profile");
    return { success: true, data: response.data };
  } catch (err: any) {
    return {
      success: false,
      error: {
        code: "SERVER_EXCEPTION",
        message: err.message || "Failed to delete document.",
      },
    };
  }
}

/**
 * Export own candidate profile data under GDPR (SRS CAN-09).
 */
export async function exportCandidateDataAction(): Promise<CandidateActionResult<any>> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await apiPost("candidates/me/export/", {}, { cookieHeader });
    if (response.error) {
      return { success: false, error: response.error };
    }
    return { success: true, data: response.data };
  } catch (err: any) {
    return {
      success: false,
      error: {
        code: "SERVER_EXCEPTION",
        message: err.message || "Failed to export data.",
      },
    };
  }
}

/**
 * Submit candidate account erasure request under GDPR (SRS CAN-09).
 */
export async function requestCandidateDeletionAction(
  reason: string
): Promise<CandidateActionResult> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await apiPost("candidates/me/delete-request/", { reason }, { cookieHeader });
    if (response.error) {
      return { success: false, error: response.error };
    }
    return { success: true, data: response.data };
  } catch (err: any) {
    return {
      success: false,
      error: {
        code: "SERVER_EXCEPTION",
        message: err.message || "Failed to submit deletion request.",
      },
    };
  }
}

/**
 * Retrieve candidate application pipeline items.
 */
export async function getCandidateApplicationsAction(): Promise<CandidateActionResult> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await apiGet("candidates/applications/", { cookieHeader });
    if (response.error) {
      return { success: false, error: response.error };
    }
    return { success: true, data: response.data };
  } catch (err: any) {
    return {
      success: false,
      error: {
        code: "SERVER_EXCEPTION",
        message: err.message || "Failed to load candidate applications.",
      },
    };
  }
}

/**
 * Submit candidate intake wizard (creates User + Candidate profile).
 */
export async function submitCandidateIntakeAction(
  payload: CandidateIntakePayload
): Promise<CandidateActionResult> {
  try {
    const response = await apiPost("candidates/intake/", payload);
    if (response.error) {
      return { success: false, error: response.error };
    }

    revalidatePath("/candidate/dashboard");
    return { success: true, data: response.data };
  } catch (err: any) {
    return {
      success: false,
      error: {
        code: "SERVER_EXCEPTION",
        message: err.message || "Failed to complete candidate registration.",
      },
    };
  }
}

/**
 * Public/Intake CV extraction and AI parsing action.
 */
export async function parseCandidateCvAction(formData: FormData): Promise<{
  success: boolean;
  data?: any;
  error?: string;
  ai_available?: boolean;
  ai_warning?: string | null;
}> {
  try {
    const response = await apiUpload<any>("candidates/intake/parse-cv/", formData);
    if (response.error) {
      return {
        success: false,
        error: response.error.message || "Failed to parse CV.",
        ai_available: false,
        ai_warning: "AI credits out of quota or AI service unavailable.",
      };
    }

    const payload = response.data?.data || response.data;
    return {
      success: true,
      data: payload,
      ai_available: payload?.ai_available ?? true,
      ai_warning: payload?.ai_warning ?? null,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "Network error while parsing CV.",
      ai_available: false,
      ai_warning: "AI credits out of quota or AI service unavailable.",
    };
  }
}

export interface CandidateInterviewItem {
  id: string;
  application_id: string;
  role: string;
  client_name: string;
  sector: string;
  location: string;
  type: string;
  panel: string;
  time: string;
  meeting_link: string;
  status: string;
  stage: string;
  sub_stage: string;
}

/**
 * Fetch candidate scheduled sprint and client interviews (SRS ATS-08, CAN-08).
 */
export async function getCandidateInterviewsAction(): Promise<CandidateActionResult<CandidateInterviewItem[]>> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await apiGet<CandidateInterviewItem[]>("candidates/interviews/", { cookieHeader });
    if (response.error) {
      return { success: false, error: response.error };
    }
    return { success: true, data: Array.isArray(response.data) ? response.data : [] };
  } catch (err: any) {
    return {
      success: false,
      error: {
        code: "SERVER_EXCEPTION",
        message: err.message || "Failed to load interviews.",
      },
    };
  }
}

