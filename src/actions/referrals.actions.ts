"use server";

import { cookies } from "next/headers";
import { apiGet } from "@/lib/api";

export interface ReferralSummaryData {
  referral_code: string;
  referral_link: string;
  total_clicks: number;
  total_referred_candidates: number;
  total_bounties_earned: string;
  pending_payouts: string;
  ledger: Array<{
    id: string;
    date: string;
    candidate_name: string;
    role: string;
    stage: string;
    bounty: string;
    status: "Pending" | "Approved" | "Paid" | "Cancelled";
  }>;
}

export async function getReferralSummaryAction() {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await apiGet<ReferralSummaryData>("referrals/summary/", { cookieHeader });
    if (response.error) {
      return { success: false, error: response.error };
    }
    return { success: true, data: response.data };
  } catch (err: any) {
    return {
      success: false,
      error: {
        code: "SERVER_EXCEPTION",
        message: err.message || "Failed to load referral summary.",
      },
    };
  }
}

export async function trackReferralAction(code: string) {
  try {
    const response = await apiGet(`referrals/track/${code}/`);
    return { success: !response.error, data: response.data };
  } catch {
    return { success: false };
  }
}
