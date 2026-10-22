"use server";

import { cookies } from "next/headers";
import { apiGet, apiPost } from "@/lib/api";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ContentBlockSummary {
  key: string;
  label: string;
  has_published: boolean;
  published_version: number | null;
  last_updated: string | null;
  last_author: string | null;
}

export interface ContentBlockDetail {
  published: {
    key: string;
    version: number;
    data: Record<string, unknown>;
    notes: string;
    updated_at: string;
    author: string | null;
  } | null;
  latest: {
    id: number;
    key: string;
    version: number;
    data: Record<string, unknown>;
    notes: string;
    is_published: boolean;
    author_name: string;
    created_at: string;
    updated_at: string;
  } | null;
}

export interface ContentVersion {
  id: number;
  key: string;
  key_display: string;
  version: number;
  data: Record<string, unknown>;
  notes: string;
  is_published: boolean;
  author_name: string;
  created_at: string;
  updated_at: string;
}

// ---------------------------------------------------------------------------
// Admin actions
// ---------------------------------------------------------------------------

export async function getContentBlocksOverviewAction(): Promise<{
  success: boolean;
  data: ContentBlockSummary[];
  error?: string;
}> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();
    const response = await apiGet<ContentBlockSummary[]>(
      "content/admin/blocks/",
      { cookieHeader }
    );
    if (response.error) {
      return { success: false, data: [], error: response.error.message };
    }
    return { success: true, data: response.data || [] };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to load content blocks.";
    return { success: false, data: [], error: msg };
  }
}

export async function getContentBlockDetailAction(key: string): Promise<{
  success: boolean;
  data?: ContentBlockDetail;
  error?: string;
}> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();
    const response = await apiGet<ContentBlockDetail>(
      `content/admin/blocks/${key}/`,
      { cookieHeader }
    );
    if (response.error) {
      return { success: false, error: response.error.message };
    }
    return { success: true, data: response.data };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to load block detail.";
    return { success: false, error: msg };
  }
}

export async function getContentBlockHistoryAction(key: string): Promise<{
  success: boolean;
  data: ContentVersion[];
  error?: string;
}> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();
    const response = await apiGet<ContentVersion[]>(
      `content/admin/blocks/${key}/history/`,
      { cookieHeader }
    );
    if (response.error) {
      return { success: false, data: [], error: response.error.message };
    }
    return { success: true, data: response.data || [] };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to load history.";
    return { success: false, data: [], error: msg };
  }
}

export async function publishContentBlockAction(
  key: string,
  data: Record<string, unknown>,
  notes: string = ""
): Promise<{ success: boolean; version?: number; error?: string }> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();
    const response = await apiPost<{ version: number; key: string; message: string }>(
      `content/admin/blocks/${key}/publish/`,
      { data, notes },
      { cookieHeader }
    );
    if (response.error) {
      return { success: false, error: response.error.message };
    }
    return { success: true, version: response.data?.version };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Publish failed.";
    return { success: false, error: msg };
  }
}

export async function saveDraftContentBlockAction(
  key: string,
  data: Record<string, unknown>,
  notes: string = ""
): Promise<{ success: boolean; version?: number; error?: string }> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();
    const response = await apiPost<{ version: number; key: string; message: string }>(
      `content/admin/blocks/${key}/draft/`,
      { data, notes },
      { cookieHeader }
    );
    if (response.error) {
      return { success: false, error: response.error.message };
    }
    return { success: true, version: response.data?.version };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Draft save failed.";
    return { success: false, error: msg };
  }
}

export async function rollbackContentBlockAction(
  key: string,
  targetVersion: number
): Promise<{ success: boolean; version?: number; error?: string }> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();
    const response = await apiPost<{ version: number; key: string; message: string }>(
      `content/admin/blocks/${key}/rollback/`,
      { target_version: targetVersion },
      { cookieHeader }
    );
    if (response.error) {
      return { success: false, error: response.error.message };
    }
    return { success: true, version: response.data?.version };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Rollback failed.";
    return { success: false, error: msg };
  }
}

export async function getPublicSiteContentAction<T = Record<string, unknown>>(
  key: string
): Promise<{ success: boolean; data?: T; version?: number; error?: string }> {
  try {
    const response = await apiGet<{
      key: string;
      version: number;
      data: T;
      updated_at: string;
    }>(`content/site/${key}/`);
    if (response.error) {
      return { success: false, error: response.error.message };
    }
    return {
      success: true,
      data: response.data?.data,
      version: response.data?.version,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to load public content.";
    return { success: false, error: msg };
  }
}
