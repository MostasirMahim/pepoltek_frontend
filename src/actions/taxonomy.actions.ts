"use server";

import { cookies } from "next/headers";
import { apiGet, apiPost } from "@/lib/api";
import {
  TaxonomyMatrix,
  SectorOption,
  DomainOption,
  SkillOption,
  SeniorityOption,
  WorkAuthOption,
  EngagementOption,
} from "@/types/taxonomy.types";

export type {
  TaxonomyMatrix,
  SectorOption,
  DomainOption,
  SkillOption,
  SeniorityOption,
  WorkAuthOption,
  EngagementOption,
};

export interface TaxonomyResponse {
  version: number;
  data: TaxonomyMatrix;
  published_at: string | null;
  author: string;
  notes: string;
}

const FALLBACK_TAXONOMY_MATRIX: TaxonomyMatrix = {
  sectors: [],
  domains: [],
  skills: [],
  seniorities: [],
  workAuths: [],
  engagements: [],
};

export async function getTaxonomiesAction(): Promise<{
  success: boolean;
  version: number;
  data: TaxonomyMatrix;
  published_at?: string | null;
  author?: string;
  notes?: string;
}> {
  try {
    const response = await apiGet<any>("config/taxonomies/");

    const top = response.data;
    if (top?.data?.sectors) {
      return {
        success: true,
        version: top.version ?? 1,
        data: top.data as TaxonomyMatrix,
        published_at: top.published_at,
        author: top.author,
        notes: top.notes,
      };
    }

    if (top?.sectors) {
      return {
        success: true,
        version: 1,
        data: top as TaxonomyMatrix,
      };
    }

    return {
      success: true,
      version: 0,
      data: FALLBACK_TAXONOMY_MATRIX,
      notes: "Using local baseline fallback",
    };
  } catch {
    return {
      success: true,
      version: 0,
      data: FALLBACK_TAXONOMY_MATRIX,
      notes: "Using local baseline fallback after network fault",
    };
  }
}

export async function updateTaxonomiesAction(
  data: TaxonomyMatrix,
  notes?: string
): Promise<{ success: boolean; version?: number; error?: string }> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await apiPost<{ version: number; message: string }>(
      "config/taxonomies/",
      { data, notes: notes || "Taxonomy matrix updated via Admin Choice Matrix console" },
      { cookieHeader }
    );

    if (response.data) {
      return {
        success: true,
        version: (response.data as any).version || (response.data as any).data?.version,
      };
    }

    return {
      success: false,
      error: response.error?.message || "Failed to publish updated taxonomy matrix.",
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "Failed to publish updated taxonomy matrix.",
    };
  }
}

export async function getTaxonomyHistoryAction(): Promise<{
  success: boolean;
  history?: any[];
  error?: string;
}> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await apiGet<any>("config/taxonomies/history/", { cookieHeader });
    if (response.data) {
      return {
        success: true,
        history: Array.isArray(response.data)
          ? response.data
          : (response.data as any).data || [],
      };
    }
    return { success: false, error: response.error?.message || "Failed to fetch version history." };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to fetch version history." };
  }
}

export async function rollbackTaxonomyAction(
  version: number
): Promise<{ success: boolean; version?: number; error?: string }> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await apiPost<any>(
      "config/taxonomies/rollback/",
      { version },
      { cookieHeader }
    );

    if (response.data) {
      return {
        success: true,
        version: (response.data as any).version || (response.data as any).data?.version,
      };
    }
    return { success: false, error: response.error?.message || "Failed to rollback taxonomy version." };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to rollback taxonomy version." };
  }
}
