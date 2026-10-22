"use server";

import { revalidatePath } from "next/cache";
import { apiPost } from "@/lib/api";

export interface LeadPayload {
  contact_name: string;
  work_email: string;
  company: string;
  phone?: string;
  sector?: string;
  roles_needed?: string;
  headcount?: number;
  engagement_model?: string;
  start_date?: string;
  notes?: string;
  calculator_snapshot?: any;
  utm?: Record<string, any>;
  source?: "hire_form" | "contact_form" | "calculator" | "referral" | "direct";
}

export interface LeadActionResult {
  success: boolean;
  leadId?: string;
  data?: any;
  error?: {
    code: string;
    message: string;
    fields?: Record<string, string[]>;
  };
}

/**
 * Submit a lead inquiry from Hire form, Contact form, or RPO Calculator Proposal.
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
    revalidatePath("/contact");
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
 * Attach appointment or calendar booking data to an existing lead.
 */
export async function bookConsultationAction(
  leadId: string,
  bookingData: Record<string, any>
): Promise<LeadActionResult> {
  try {
    const response = await apiPost(`leads/${leadId}/book/`, { booking_data: bookingData });

    if (response.error) {
      return { success: false, error: response.error };
    }

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
