"use server";

import { apiGet } from "@/lib/api";

export interface CaseStudyItem {
  slug: string;
  title: string;
  sector: "tech" | "healthcare";
  sectorLabel: string;
  client: string;
  timeline: string;
  summary: string;
  challenge: string;
  solution: string;
  metrics: Array<{
    label: string;
    value: string;
    baseline: string;
  }>;
  quote?: {
    text: string;
    author: string;
    title: string;
  };
}

export async function getCaseStudiesAction(sector: string = "all") {
  try {
    const params = sector && sector !== "all" ? { sector } : undefined;
    const response = await apiGet<CaseStudyItem[]>("content/case-studies/", { params });
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
        message: err.message || "Failed to load case studies.",
      },
    };
  }
}

export async function getCaseStudyBySlugAction(slug: string) {
  try {
    const response = await apiGet<CaseStudyItem>(`content/case-studies/${slug}/`);
    if (response.error) {
      return { success: false, error: response.error };
    }
    return { success: true, data: response.data };
  } catch (err: any) {
    return {
      success: false,
      error: {
        code: "SERVER_EXCEPTION",
        message: err.message || "Failed to load case study detail.",
      },
    };
  }
}
