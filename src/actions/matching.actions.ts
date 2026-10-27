"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { apiGet, apiPost } from "@/lib/api";

export interface ReverseSearchMatchItem {
  id: string;
  requisition_id: string;
  title: string;
  company_masked: string;
  sector: string;
  level: string;
  engagement?: string;
  skills: string[];
  timezone_overlap: string;
  work_auth_fit: string;
  rate_range: string;
  location?: string;
  description?: string;
  match_score: number;
  pitch_status: "not_requested" | "requested" | "authorized" | "declined";
  must_haves_met: boolean;
}

export interface PitchRequestItem {
  id: string;
  pitch_auth_id: string;
  requisition_id: string;
  title: string;
  company_masked: string;
  sector: string;
  level: string;
  engagement: string;
  rate_range: string;
  location: string;
  timezone_overlap: string;
  work_auth_fit: string;
  skills: string[];
  description: string;
  status: "requested" | "authorized" | "declined" | "revoked";
  requested_at: string;
  decided_at?: string | null;
  sourcing_note: string;
}

export async function getReverseSearchMatchesAction() {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await apiGet<ReverseSearchMatchItem[]>("matching/reverse-search/", { cookieHeader });
    if (response.error) {
      return { success: false, error: response.error, data: [] };
    }
    return { success: true, data: response.data || [] };
  } catch (err: any) {
    return {
      success: false,
      data: [],
      error: {
        code: "SERVER_EXCEPTION",
        message: err.message || "Failed to load reverse search matches.",
      },
    };
  }
}

export async function getCandidatePitchRequestsAction() {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await apiGet<PitchRequestItem[]>("matching/pitch-requests/", { cookieHeader });
    if (response.error) {
      return { success: false, error: response.error, data: [] };
    }
    return { success: true, data: response.data || [] };
  } catch (err: any) {
    return {
      success: false,
      data: [],
      error: {
        code: "SERVER_EXCEPTION",
        message: err.message || "Failed to load pitch authorization requests.",
      },
    };
  }
}

export async function authorizePitchAction(
  matchId: string,
  statusOrBool: boolean | "authorized" | "declined" | "revoked"
) {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const desiredStatus = typeof statusOrBool === "boolean"
      ? (statusOrBool ? "authorized" : "declined")
      : statusOrBool;

    const response = await apiPost(
      `matching/pitch/${matchId}/`,
      { status: desiredStatus },
      { cookieHeader }
    );

    if (response.error) {
      return { success: false, error: response.error };
    }

    revalidatePath("/candidate/reverse-search");
    revalidatePath("/candidate/dashboard");
    revalidatePath("/candidate/applications");
    revalidatePath("/recruiter/candidates");
    revalidatePath("/recruiter/pipeline");
    return { success: true, data: response.data };
  } catch (err: any) {
    return {
      success: false,
      error: {
        code: "SERVER_EXCEPTION",
        message: err.message || "Failed to update pitch authorization.",
      },
    };
  }
}
