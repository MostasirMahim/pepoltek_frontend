"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { apiGet, apiPost, apiPatch } from "@/lib/api";

export interface LeadPayload {
  contact_name: string;
  work_email: string;
  company: string;
  phone?: string;
  sector?: string;
  roles_needed?: string;
  headcount?: number;
  engagement_model?: string;
  timeline?: string;
  estimated_budget?: string;
  preferred_delivery_channel?: string;
  start_date?: string;
  notes?: string;
  calculator_snapshot?: any;
  booking_slot?: string;
  booking_data?: any;
  utm?: Record<string, any>;
  source?: "hire_form" | "contact_form" | "calculator" | "referral" | "direct";
}

export interface ContactInquiryPayload {
  name: string;
  email: string;
  phone?: string;
  category: "general" | "partnership" | "talent_support" | "press_media" | "feedback";
  subject: string;
  message: string;
}

export interface LeadActionResult<T = any> {
  success: boolean;
  leadId?: string;
  data?: T;
  metrics?: any;
  error?: {
    code: string;
    message: string;
    fields?: Record<string, string[]>;
  };
}

/**
 * Public action: Submit commercial hire fast lead or calculator inquiry.
 */
export async function submitLeadAction(payload: LeadPayload): Promise<LeadActionResult> {
  try {
    if (!payload.contact_name || !payload.work_email || !payload.company) {
      return {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Name, work email, and company are required fields.",
        },
      };
    }

    const response = await apiPost<{ id: string; status: string }>("leads/", payload);

    if (response.error) {
      return { success: false, error: response.error };
    }

    const leadId = response.data?.id;
    revalidatePath("/admin/leads");
    return { success: true, leadId, data: response.data };
  } catch (err: any) {
    return {
      success: false,
      error: {
        code: "SERVER_EXCEPTION",
        message: err.message || "Failed to submit consultation request.",
      },
    };
  }
}

/**
 * Public action: Submit general contact inquiry.
 */
export async function submitContactInquiryAction(payload: ContactInquiryPayload): Promise<LeadActionResult> {
  try {
    if (!payload.name || !payload.email || !payload.subject || !payload.message) {
      return {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Name, email, subject, and message are required.",
        },
      };
    }

    const response = await apiPost<{ id: string; status: string }>("leads/contacts/", payload);

    if (response.error) {
      return { success: false, error: response.error };
    }

    revalidatePath("/admin/leads");
    return { success: true, data: response.data };
  } catch (err: any) {
    return {
      success: false,
      error: {
        code: "SERVER_EXCEPTION",
        message: err.message || "Failed to submit inquiry.",
      },
    };
  }
}

/**
 * Public action: Attach consultation booking slot to lead.
 */
export async function bookConsultationAction(
  leadId: string,
  slot: string,
  notes?: string
): Promise<LeadActionResult> {
  try {
    const response = await apiPost(`leads/${leadId}/book/`, { slot, notes });

    if (response.error) {
      return { success: false, error: response.error };
    }

    revalidatePath(`/admin/leads/${leadId}`);
    return { success: true, leadId, data: response.data };
  } catch (err: any) {
    return {
      success: false,
      error: {
        code: "SERVER_EXCEPTION",
        message: err.message || "Failed to record consultation booking.",
      },
    };
  }
}

/**
 * Admin action: Get employer leads list and metrics.
 */
export async function getAdminLeadsAction(params?: {
  status?: string;
  sector?: string;
  search?: string;
}): Promise<{ data: any[]; metrics: any }> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await apiGet<any>("leads/", {
      cookieHeader,
      params,
    });

    if (response.data) {
      return {
        data: Array.isArray(response.data.data) ? response.data.data : [],
        metrics: response.data.metrics || {},
      };
    }
    return { data: [], metrics: {} };
  } catch {
    return { data: [], metrics: {} };
  }
}

/**
 * Admin action: Get single lead detail with activity logs.
 */
export async function getAdminLeadDetailAction(id: string): Promise<any | null> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await apiGet<any>(`leads/${id}/`, { cookieHeader });
    return response.data?.data || null;
  } catch {
    return null;
  }
}

/**
 * Admin action: Update lead status or assign owner.
 */
export async function updateAdminLeadAction(
  id: string,
  payload: { status?: string; owner_id?: string | null; note?: string }
): Promise<LeadActionResult> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await apiPatch<any>(`leads/${id}/`, payload, { cookieHeader });

    if (response.error) {
      return { success: false, error: response.error };
    }

    revalidatePath("/admin/leads");
    revalidatePath(`/admin/leads/${id}`);
    return { success: true, data: response.data?.data };
  } catch (err: any) {
    return {
      success: false,
      error: {
        code: "SERVER_EXCEPTION",
        message: err.message || "Failed to update lead.",
      },
    };
  }
}

/**
 * Admin action: Add internal note to lead activity log.
 */
export async function addAdminLeadNoteAction(id: string, note: string): Promise<LeadActionResult> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await apiPost<any>(`leads/${id}/notes/`, { note }, { cookieHeader });

    if (response.error) {
      return { success: false, error: response.error };
    }

    revalidatePath(`/admin/leads/${id}`);
    return { success: true, data: response.data?.data };
  } catch (err: any) {
    return {
      success: false,
      error: {
        code: "SERVER_EXCEPTION",
        message: err.message || "Failed to add activity note.",
      },
    };
  }
}

/**
 * Admin action: Convert qualified lead to authentic Client + Requisition in ATS.
 */
export async function convertAdminLeadAction(
  id: string,
  payload: {
    client_name?: string;
    requisition_title?: string;
    sector?: string;
    headcount?: number;
    delivery_channel?: string;
    note?: string;
  }
): Promise<LeadActionResult> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await apiPost<any>(`leads/${id}/convert/`, payload, { cookieHeader });

    if (response.error) {
      return { success: false, error: response.error };
    }

    revalidatePath("/admin/leads");
    revalidatePath(`/admin/leads/${id}`);
    revalidatePath("/recruiter/jobs");
    return { success: true, data: response.data?.data };
  } catch (err: any) {
    return {
      success: false,
      error: {
        code: "SERVER_EXCEPTION",
        message: err.message || "Failed to convert lead to client.",
      },
    };
  }
}

/**
 * Admin action: Get general contact inquiries list and metrics.
 */
export async function getAdminContactInquiriesAction(params?: {
  status?: string;
  category?: string;
  search?: string;
}): Promise<{ data: any[]; metrics: any }> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await apiGet<any>("leads/contacts/admin/", {
      cookieHeader,
      params,
    });

    if (response.data) {
      return {
        data: Array.isArray(response.data.data) ? response.data.data : [],
        metrics: response.data.metrics || {},
      };
    }
    return { data: [], metrics: {} };
  } catch {
    return { data: [], metrics: {} };
  }
}

/**
 * Admin action: Get single contact inquiry detail.
 */
export async function getAdminContactInquiryDetailAction(id: string): Promise<any | null> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await apiGet<any>(`leads/contacts/admin/${id}/`, { cookieHeader });
    return response.data?.data || null;
  } catch {
    return null;
  }
}

/**
 * Admin action: Update contact inquiry status and response notes.
 */
export async function updateAdminContactInquiryAction(
  id: string,
  payload: { status?: string; response_notes?: string; responder_id?: string | null }
): Promise<LeadActionResult> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await apiPatch<any>(`leads/contacts/admin/${id}/`, payload, { cookieHeader });

    if (response.error) {
      return { success: false, error: response.error };
    }

    revalidatePath("/admin/leads");
    revalidatePath(`/admin/contacts/${id}`);
    return { success: true, data: response.data?.data };
  } catch (err: any) {
    return {
      success: false,
      error: {
        code: "SERVER_EXCEPTION",
        message: err.message || "Failed to update inquiry.",
      },
    };
  }
}
