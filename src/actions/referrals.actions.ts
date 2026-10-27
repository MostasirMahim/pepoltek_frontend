"use server";

import { cookies } from "next/headers";
import { apiGet, apiPost } from "@/lib/api";

export interface ReferredCandidateItem {
  id: string;
  candidate_name: string;
  candidate_email: string;
  referral_type: string;
  source: string;
  source_display: string;
  stage: string;
  stage_display: string;
  scope: string;
  requisition_title: string;
  created_at: string;
}

export interface ActiveBountyItem {
  id: string;
  name: string;
  description: string;
  amount_usd: number;
  amount_display: string;
  currency: string;
  validity_days: number;
}

export interface ReferrerLedgerRow {
  id: string;
  raw_id: number;
  candidate: string;
  track: string;
  status: string;
  amount_usd: number;
  bountyEarned: string;
  payoutStatus: string;
  date: string;
  paidReference: string | null;
  note: string;
}

export interface ReferrerDashboardPayload {
  referral_code: string;
  total_earnings_usd: number;
  available_balance_usd: number;
  total_paid_usd: number;
  pending_bounties_usd: number;
  total_referrals_count: number;
  referrals_list: ReferredCandidateItem[];
  active_bounties: ActiveBountyItem[];
  ledger: ReferrerLedgerRow[];
}

export async function getReferralSummaryAction(): Promise<{
  success: boolean;
  data?: ReferrerDashboardPayload;
  error?: string;
}> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await apiGet<ReferrerDashboardPayload>("referrals/summary/", { cookieHeader });
    if (response.error) {
      return { success: false, error: response.error.message || "Failed to load referral dashboard." };
    }
    return { success: true, data: response.data };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to load referral dashboard." };
  }
}

export async function submitDirectReferralAction(payload: {
  referred_name: string;
  referred_email: string;
  target_role: string;
  notes?: string;
  requisition_id?: string;
}): Promise<{
  success: boolean;
  data?: any;
  error?: string;
}> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await apiPost("referrals/submit/", payload, { cookieHeader });
    if (response.error) {
      return { success: false, error: response.error.message || "Failed to submit referral." };
    }
    return { success: true, data: response.data };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to submit referral." };
  }
}

export async function requestReferralPayoutAction(payload: {
  payout_method: string;
  recipient_details: string;
}): Promise<{
  success: boolean;
  data?: any;
  error?: string;
}> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await apiPost("referrals/request-payout/", payload, { cookieHeader });
    if (response.error) {
      return { success: false, error: response.error.message || "Failed to request payout disbursement." };
    }
    return { success: true, data: response.data };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to request payout disbursement." };
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
