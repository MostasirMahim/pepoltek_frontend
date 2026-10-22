"use server";

import { cookies } from "next/headers";
import { apiGet, apiPost, apiPatch, apiDelete } from "@/lib/api";

export interface AdminTelemetryData {
  grossPlatformVolume: string;
  grossVolumeGrowth: string;
  activePodsCount: number;
  activePodsCapacity: string;
  vettedTalentCount: string | number;
  vettedTalentGrowth: string;
  escrowVaultBalance: string;
  platformUptimeScore: string;
  pods: any[];
  recentEvents: any[];
}

export async function getAdminTelemetryAction(): Promise<AdminTelemetryData> {
  const defaultTelemetry: AdminTelemetryData = {
    grossPlatformVolume: "$0.00",
    grossVolumeGrowth: "Platform Initialized",
    activePodsCount: 0,
    activePodsCapacity: "0 Active Requisitions",
    vettedTalentCount: "2 Active",
    vettedTalentGrowth: "Verified Staff & Talent",
    escrowVaultBalance: "$0.00",
    platformUptimeScore: "99.99%",
    pods: [],
    recentEvents: [],
  };

  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await apiGet<any>("auth/admin/telemetry", { cookieHeader });
    if (response.data) {
      const d = response.data;
      return {
        grossPlatformVolume: d.gross_platform_volume || defaultTelemetry.grossPlatformVolume,
        grossVolumeGrowth: d.gross_volume_growth || defaultTelemetry.grossVolumeGrowth,
        activePodsCount: typeof d.active_pods_count === "number" ? d.active_pods_count : 0,
        activePodsCapacity: d.active_pods_capacity || defaultTelemetry.activePodsCapacity,
        vettedTalentCount: d.vetted_talent_count ? String(d.vetted_talent_count) : defaultTelemetry.vettedTalentCount,
        vettedTalentGrowth: d.vetted_talent_growth || defaultTelemetry.vettedTalentGrowth,
        escrowVaultBalance: d.escrow_vault_balance || defaultTelemetry.escrowVaultBalance,
        platformUptimeScore: d.platform_uptime_score || defaultTelemetry.platformUptimeScore,
        pods: Array.isArray(d.pods) ? d.pods : [],
        recentEvents: Array.isArray(d.events) ? d.events : [],
      };
    }
    return defaultTelemetry;
  } catch {
    return defaultTelemetry;
  }
}

export async function getAdminUsersAction(): Promise<any[]> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await apiGet<any[]>("auth/admin/users", { cookieHeader });
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  } catch {
    return [];
  }
}

export async function inviteStaffAction(payload: {
  email: string;
  full_name: string;
  role: string;
  temporary_password?: string;
}): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await apiPost<any>("auth/admin/invite-staff", payload, { cookieHeader });
    if (response.data) {
      return { success: true, data: response.data };
    }
    return { success: false, error: response.error?.message || "Failed to dispatch staff invitation." };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to dispatch staff invitation." };
  }
}

export interface RoleCapabilityItem {
  code: string;
  name: string;
  category: string;
  description: string;
  scope: string;
  permissions: string[];
  is_system_role?: boolean;
  member_count: number;
}

export interface PermissionDomainItem {
  domain: string;
  permissions: { code: string; label: string }[];
}

export async function getRolesCatalogueAction(): Promise<RoleCapabilityItem[]> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await apiGet<RoleCapabilityItem[]>("auth/admin/roles", { cookieHeader });
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  } catch {
    return [];
  }
}

export async function createRoleAction(payload: {
  name: string;
  code?: string;
  category: string;
  description: string;
  scope: string;
  permissions: string[];
}): Promise<{ success: boolean; data?: RoleCapabilityItem; error?: string }> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await apiPost<RoleCapabilityItem>("auth/admin/roles", payload, { cookieHeader });
    if (response.data) {
      return { success: true, data: response.data };
    }
    return { success: false, error: response.error?.message || "Failed to create new role." };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to create new role." };
  }
}

export async function updateRoleAction(
  roleCode: string,
  payload: {
    name?: string;
    category?: string;
    description?: string;
    scope?: string;
    permissions?: string[];
  }
): Promise<{ success: boolean; data?: RoleCapabilityItem; error?: string }> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await apiPatch<RoleCapabilityItem>(`auth/admin/roles/${roleCode}`, payload, { cookieHeader });
    if (response.data) {
      return { success: true, data: response.data };
    }
    return { success: false, error: response.error?.message || "Failed to update role." };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update role." };
  }
}

export async function deleteRoleAction(
  roleCode: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await apiDelete<any>(`auth/admin/roles/${roleCode}`, { cookieHeader });
    if (!response.error) {
      return { success: true };
    }
    return { success: false, error: response.error.message || "Failed to delete role." };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to delete role." };
  }
}

export async function getPermissionsCatalogueAction(): Promise<PermissionDomainItem[]> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await apiGet<PermissionDomainItem[]>("auth/admin/permissions-catalogue", { cookieHeader });
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  } catch {
    return [];
  }
}

export async function updateUserRolesAction(
  userId: string,
  roles: string[]
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await apiPatch<any>(`auth/admin/users/${userId}/roles`, { roles }, { cookieHeader });
    if (response.data) {
      return { success: true, data: response.data };
    }
    return { success: false, error: response.error?.message || "Failed to update user roles." };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update user roles." };
  }
}

export async function updateUserStatusAction(
  userId: string,
  status: "active" | "suspended"
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await apiPatch<any>(
      `auth/admin/users/${userId}/status`,
      { status, is_active: status === "active" },
      { cookieHeader }
    );
    if (response.data) {
      return { success: true, data: response.data };
    }
    return { success: false, error: response.error?.message || "Failed to update user status." };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update user status." };
  }
}

export async function decommissionUserAction(
  userId: string,
  reason: string = "Administrative decommission"
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await apiDelete<any>(
      `auth/admin/users/${userId}`,
      { cookieHeader, body: JSON.stringify({ reason }) }
    );
    if (response.data) {
      return { success: true, data: response.data };
    }
    return { success: false, error: response.error?.message || "Failed to decommission user account." };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to decommission user account." };
  }
}

