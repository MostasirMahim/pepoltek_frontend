"use server";

import { cookies } from "next/headers";
import { apiGet, apiPost, apiPatch, apiDelete } from "@/lib/api";

export interface AdminLedgerRecord {
  id: string;
  raw_id: number;
  referrer_email: string;
  referrer_name: string;
  candidate_name: string;
  track: string;
  amount_usd: number;
  amount_display: string;
  currency: string;
  milestone: string;
  status: "pending" | "approved" | "paid" | "cancelled";
  status_display: string;
  approved_by: string | null;
  approved_at: string | null;
  paid_reference: string;
  paid_at: string | null;
  date: string;
  created_at: string;
  note: string;
}

export interface AdminLedgerTelemetry {
  escrow_vault_balance: number;
  total_paid_usd: number;
  pending_payouts_usd: number;
  approved_payouts_usd: number;
  total_referrals_count: number;
  active_referrers_count: number;
  placed_referrals_count: number;
}

export interface AdminLedgerResponse {
  telemetry: AdminLedgerTelemetry;
  records: AdminLedgerRecord[];
}

export async function getAdminLedgerAction(
  statusFilter: string = "all",
  searchQuery: string = ""
): Promise<{ success: boolean; data?: AdminLedgerResponse; error?: string }> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const params = new URLSearchParams();
    if (statusFilter && statusFilter !== "all") params.set("status", statusFilter);
    if (searchQuery) params.set("search", searchQuery);

    const queryStr = params.toString() ? `?${params.toString()}` : "";
    const response = await apiGet<AdminLedgerResponse>(`referrals/admin/summary/${queryStr}`, {
      cookieHeader,
    });

    if (response.data) {
      return { success: true, data: response.data };
    }
    return {
      success: false,
      error: response.error?.message || "Failed to load escrow ledger records.",
    };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to load escrow ledger records." };
  }
}

export async function adminApprovePayoutAction(
  entryId: number
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await apiPost<any>(
      `referrals/admin/payouts/${entryId}/approve/`,
      {},
      { cookieHeader }
    );

    if (response.data) {
      return { success: true, data: response.data };
    }
    return { success: false, error: response.error?.message || "Failed to approve payout." };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to approve payout." };
  }
}

export async function adminDisbursePayoutAction(
  entryId: number,
  payload: { paid_reference: string; payment_method?: string; note?: string }
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await apiPost<any>(
      `referrals/admin/payouts/${entryId}/disburse/`,
      payload,
      { cookieHeader }
    );

    if (response.data) {
      return { success: true, data: response.data };
    }
    return { success: false, error: response.error?.message || "Failed to disburse payout." };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to disburse payout." };
  }
}

export async function adminCancelPayoutAction(
  entryId: number,
  reason: string
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await apiPost<any>(
      `referrals/admin/payouts/${entryId}/cancel/`,
      { reason },
      { cookieHeader }
    );

    if (response.data) {
      return { success: true, data: response.data };
    }
    return { success: false, error: response.error?.message || "Failed to cancel payout." };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to cancel payout." };
  }
}

export async function getUserReferralSummaryAction(): Promise<any> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await apiGet<any>("referrals/summary/", { cookieHeader });
    if (response.data) {
      return response.data;
    }
    return null;
  } catch {
    return null;
  }
}

export async function submitDirectReferralAction(payload: {
  referred_name: string;
  referred_email: string;
  target_role?: string;
  notes?: string;
}): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await apiPost<any>("referrals/submit/", payload, { cookieHeader });
    if (response.data) {
      return { success: true, data: response.data };
    }
    return { success: false, error: response.error?.message || "Failed to submit referral." };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to submit referral." };
  }
}

export async function requestReferralPayoutAction(payload: {
  payout_method: string;
  recipient_details: string;
}): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await apiPost<any>("referrals/request-payout/", payload, { cookieHeader });
    if (response.data) {
      return { success: true, data: response.data };
    }
    return { success: false, error: response.error?.message || "Failed to request payout." };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to request payout." };
  }
}

export interface AdminReferralRecord {
  id: string; // REF-XXXXXXXX
  raw_id: string; // UUID
  referrer: {
    id: string;
    email: string;
    name: string;
    referral_code: string;
  };
  candidate_name: string;
  candidate_email: string;
  candidate_id: string | null;
  referral_type: "candidate" | "client_lead" | string;
  referral_type_display: string;
  source: "link" | "direct" | string;
  source_display: string;
  stage: "submitted" | "screened" | "interviewed" | "placed" | "rejected" | "duplicate" | string;
  stage_display: string;
  track: string;
  referral_scope?: string;
  bounty_locked?: boolean;
  bounty: {
    has_bounty: boolean;
    amount_usd: number;
    amount_display: string;
    status: "pending" | "approved" | "paid" | "cancelled" | null;
    status_display: string;
    ledger_id: string | null;
    raw_ledger_id: number | null;
    paid_reference: string | null;
    bounty_type?: string | null;
  };
  date: string;
  created_at: string;
}

export interface AdminReferralTelemetry {
  total_referrals: number;
  active_scouts: number;
  placed_count: number;
  conversion_rate: number;
  stage_counts: Record<string, number>;
}

export interface AdminReferralsPipelineResponse {
  telemetry: AdminReferralTelemetry;
  records: AdminReferralRecord[];
}

export async function getAdminReferralsPipelineAction(
  stageFilter: string = "all",
  referralType: string = "all",
  searchQuery: string = ""
): Promise<{ success: boolean; data?: AdminReferralsPipelineResponse; error?: string }> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const params = new URLSearchParams();
    if (stageFilter && stageFilter !== "all") params.set("stage", stageFilter);
    if (referralType && referralType !== "all") params.set("type", referralType);
    if (searchQuery) params.set("search", searchQuery);

    const queryStr = params.toString() ? `?${params.toString()}` : "";
    const response = await apiGet<AdminReferralsPipelineResponse>(
      `referrals/admin/pipeline/${queryStr}`,
      { cookieHeader }
    );

    if (response.data) {
      return { success: true, data: response.data };
    }
    return {
      success: false,
      error: response.error?.message || "Failed to load referral pipeline.",
    };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to load referral pipeline." };
  }
}

export async function updateReferralStageAction(
  referralId: string,
  payload: { stage: string; bounty_amount?: number; note?: string }
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await apiPatch<any>(
      `referrals/admin/${referralId}/stage/`,
      payload,
      { cookieHeader }
    );

    if (response.data) {
      return { success: true, data: response.data };
    }
    return {
      success: false,
      error: response.error?.message || "Failed to update referral stage.",
    };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update referral stage." };
  }
}

export interface BountyTypeItem {
  id: string;
  name: string;
  description: string;
  amount: number;
  amount_display: string;
  currency: string;
  validity_days: number;
  is_active: boolean;
  sort_order: number;
  created_at: string | null;
}

/**
 * Fetch all bounty types for admin management
 */
export async function getAdminBountyTypesAction(): Promise<{
  success: boolean;
  data?: BountyTypeItem[];
  error?: string;
}> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await apiGet<BountyTypeItem[]>("referrals/bounty-types/", { cookieHeader });
    if (response.data) {
      return { success: true, data: response.data };
    }
    return { success: false, error: response.error?.message || "Failed to load bounty types." };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to load bounty types." };
  }
}

/**
 * Fetch active bounty types for public/recruiter job dropdown
 */
export async function getPublicBountyTypesAction(): Promise<{
  success: boolean;
  data?: BountyTypeItem[];
  error?: string;
}> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await apiGet<BountyTypeItem[]>("referrals/bounty-types/public/", { cookieHeader });
    if (response.data) {
      return { success: true, data: response.data };
    }
    return { success: false, error: response.error?.message || "Failed to load bounty types." };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to load bounty types." };
  }
}

/**
 * Create a new bounty type catalog entry
 */
export async function createBountyTypeAction(payload: {
  name: string;
  amount: number;
  description?: string;
  currency?: string;
  validity_days?: number;
  sort_order?: number;
}): Promise<{ success: boolean; data?: BountyTypeItem; error?: string }> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await apiPost<BountyTypeItem>("referrals/bounty-types/", payload, {
      cookieHeader,
    });
    if (response.data) {
      return { success: true, data: response.data };
    }
    return { success: false, error: response.error?.message || "Failed to create bounty type." };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to create bounty type." };
  }
}

/**
 * Update an existing bounty type
 */
export async function updateBountyTypeAction(
  id: string,
  payload: Partial<BountyTypeItem>
): Promise<{ success: boolean; data?: BountyTypeItem; error?: string }> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await apiPatch<BountyTypeItem>(`referrals/bounty-types/${id}/`, payload, {
      cookieHeader,
    });
    if (response.data) {
      return { success: true, data: response.data };
    }
    return { success: false, error: response.error?.message || "Failed to update bounty type." };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update bounty type." };
  }
}

/**
 * Deactivate a bounty type
 */
export async function deleteBountyTypeAction(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await apiDelete(`referrals/bounty-types/${id}/`, { cookieHeader });
    if (response.error) {
      return { success: false, error: response.error.message || "Failed to deactivate bounty type." };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to deactivate bounty type." };
  }
}


