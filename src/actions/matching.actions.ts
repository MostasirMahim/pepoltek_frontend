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
  skills: string[];
  timezone_overlap: string;
  work_auth_fit: string;
  rate_range: string;
  match_score: number;
  pitch_status: "not_requested" | "requested" | "authorized" | "declined";
  must_haves_met: boolean;
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

export async function authorizePitchAction(matchId: string, authorized: boolean) {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await apiPost(
      `matching/pitch/${matchId}/`,
      { status: authorized ? "authorized" : "declined" },
      { cookieHeader }
    );

    if (response.error) {
      return { success: false, error: response.error };
    }

    revalidatePath("/candidate/reverse-search");
    revalidatePath("/candidate/dashboard");
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
