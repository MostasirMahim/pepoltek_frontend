"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { apiGet, apiPatch, apiPost } from "@/lib/api";

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
  expected_comp_min?: number;
  expected_comp_max?: number;
  open_to_work?: boolean;
  portfolio_url?: string;
  github_url?: string;
  linkedin_url?: string;
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
  resume_text?: string;
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
 * Fetch authenticated candidate profile and readiness stats.
 */
export async function getCandidateProfileAction(): Promise<CandidateActionResult> {
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
 * Update candidate profile preferences and verified skills.
 */
export async function updateCandidateProfileAction(
  payload: CandidateProfilePayload
): Promise<CandidateActionResult> {
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
