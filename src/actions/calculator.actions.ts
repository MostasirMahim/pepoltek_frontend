"use server";

import { apiGet, apiPost } from "@/lib/api";

export interface CalculatorEstimateInput {
  seniority?: string;
  region?: string;
  tech_stack?: string;
  headcount?: number;
  roles?: Array<{
    stack_id: string;
    seniority: string;
    region: string;
    headcount: number;
    technologies: string[];
  }>;
}

export interface CalculatorEstimateResult {
  success: boolean;
  data?: {
    estimated_savings_usd?: number;
    hours_reclaimed?: number;
    legacy_days?: number;
    sprint_days?: number;
    ruleset_version?: string;
    inputs?: any;
    [key: string]: any;
  };
  error?: {
    code: string;
    message: string;
  };
}

/**
 * Fetch active configuration parameters for the RPO and hiring velocity calculator.
 */
export async function getCalculatorConfigAction() {
  try {
    const response = await apiGet("config/calculator/");
    if (response.error) {
      return { success: false, error: response.error };
    }
    return { success: true, data: response.data };
  } catch (err: any) {
    return {
      success: false,
      error: {
        code: "SERVER_EXCEPTION",
        message: err.message || "Failed to fetch calculator configuration.",
      },
    };
  }
}

/**
 * Perform server-side validation and computation of the RPO squad savings estimate.
 */
export async function estimateCalculatorAction(
  inputs: CalculatorEstimateInput
): Promise<CalculatorEstimateResult> {
  try {
    const response = await apiPost("config/calculator/estimate/", inputs);
    if (response.error) {
      return { success: false, error: response.error };
    }
    return { success: true, data: response.data };
  } catch (err: any) {
    return {
      success: false,
      error: {
        code: "SERVER_EXCEPTION",
        message: err.message || "Failed to calculate squad estimate.",
      },
    };
  }
}
