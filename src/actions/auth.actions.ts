"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { apiGet, apiPost } from "@/lib/api";

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: string;
  roles?: string[];
  referralCode?: string;
  mfaEnabled?: boolean;
}

export interface AuthActionResult {
  success: boolean;
  user?: AuthUser;
  error?: {
    code: string;
    message: string;
    fields?: Record<string, string[]>;
  };
}

function resolvePrimaryRole(u: any): string {
  const roles: string[] = (u?.roles || (u?.role ? [u.role] : [])).map((r: any) => String(r).toUpperCase());
  if (roles.includes("SUPER_ADMIN")) return "SUPER_ADMIN";
  if (roles.includes("ADMIN")) return "ADMIN";
  if (roles.includes("TECH_VALIDATOR")) return "TECH_VALIDATOR";
  if (roles.includes("CREDENTIAL_OFFICER")) return "CREDENTIAL_OFFICER";
  if (roles.includes("RECRUITER")) return "RECRUITER";
  if (roles.includes("BUSINESS_ANALYST")) return "BUSINESS_ANALYST";
  if (roles.includes("CANDIDATE")) return "CANDIDATE";
  if (roles.includes("REFERRER")) return "REFERRER";
  if (roles.includes("LEARNER")) return "LEARNER";
  return (u?.role || roles[0] || "CANDIDATE").toUpperCase();
}

function formatAuthUser(u: any): AuthUser {
  const roles = Array.isArray(u?.roles) ? u.roles : (u?.role ? [u.role] : ["CANDIDATE"]);
  return {
    id: u?.id || "",
    email: u?.email || "",
    fullName: u?.full_name || u?.fullName || u?.email?.split("@")[0] || "Candidate",
    role: resolvePrimaryRole(u),
    roles: roles,
    referralCode: u?.referral_code,
    mfaEnabled: u?.mfa_enabled,
  };
}

/**
 * Log in candidate, recruiter, or admin and set httpOnly session cookies.
 */
export async function loginAction(formData: FormData | Record<string, any>): Promise<AuthActionResult> {
  try {
    const email = formData instanceof FormData ? (formData.get("email") as string) : formData.email;
    const password = formData instanceof FormData ? (formData.get("password") as string) : formData.password;

    if (!email || !password) {
      return {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Email and password are required.",
        },
      };
    }

    const response = await apiPost<{ user: AuthUser; access_token?: string; refresh_token?: string }>(
      "auth/login",
      { email, password }
    );

    if (response.error) {
      return { success: false, error: response.error };
    }

    const data = response.data;
    if (data?.access_token) {
      const cookieStore = await cookies();
      cookieStore.set("access_token", data.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      if (data.refresh_token) {
        cookieStore.set("refresh_token", data.refresh_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24 * 30, // 30 days
        });
      }

      const roleStr = resolvePrimaryRole(data.user);

      cookieStore.set("user_role", roleStr, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    revalidatePath("/");
    return { success: true, user: data?.user ? formatAuthUser(data.user) : undefined };
  } catch (err: any) {
    return {
      success: false,
      error: {
        code: "SERVER_EXCEPTION",
        message: err.message || "An unexpected error occurred during login.",
      },
    };
  }
}

/**
 * Register a new account.
 */
export async function registerAction(payload: Record<string, any>): Promise<AuthActionResult> {
  try {
    const response = await apiPost<{ user: any; access_token?: string; refresh_token?: string }>(
      "auth/register",
      payload
    );

    if (response.error) {
      return { success: false, error: response.error };
    }

    const data = response.data;
    if (data?.access_token) {
      const cookieStore = await cookies();
      cookieStore.set("access_token", data.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });

      if (data.refresh_token) {
        cookieStore.set("refresh_token", data.refresh_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24 * 30,
        });
      }

      const roleStr = resolvePrimaryRole(data.user);

      cookieStore.set("user_role", roleStr, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    revalidatePath("/");
    return { success: true, user: data?.user ? formatAuthUser(data.user) : undefined };
  } catch (err: any) {
    return {
      success: false,
      error: {
        code: "SERVER_EXCEPTION",
        message: err.message || "An unexpected error occurred during registration.",
      },
    };
  }
}

/**
 * Log out and clear session cookies.
 */
export async function logoutAction(): Promise<{ success: boolean }> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();
    const refreshToken = cookieStore.get("refresh_token")?.value;

    await apiPost("auth/logout", { refresh_token: refreshToken }, { cookieHeader });
    cookieStore.delete("access_token");
    cookieStore.delete("refresh_token");
    cookieStore.delete("user_role");

    revalidatePath("/");
    return { success: true };
  } catch {
    const cookieStore = await cookies();
    cookieStore.delete("access_token");
    cookieStore.delete("refresh_token");
    cookieStore.delete("user_role");
    return { success: true };
  }
}

/**
 * Get currently authenticated user from backend.
 */
export async function getCurrentUserAction(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;
    if (!token) {
      return null;
    }

    const cookieHeader = cookieStore.toString();
    const response = await apiGet<any>("auth/me", { cookieHeader });
    if (response.data) {
      const u = response.data.user || response.data;
      if (u && (u.id || u.email)) {
        return formatAuthUser(u);
      }
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Dispatch verification OTP to email address via SMTP.
 */
export async function resendOtpAction(payload: { email: string; previous_email?: string; full_name?: string }): Promise<{ success: boolean; message?: string }> {
  try {
    const response = await apiPost<{ dispatched: boolean; message: string }>("auth/resend-otp", payload);
    if (response.data) {
      return { success: true, message: response.data.message };
    }
    return { success: false, message: response.error?.message || "Failed to dispatch verification email." };
  } catch (err: any) {
    return { success: false, message: err.message || "Failed to dispatch verification email." };
  }
}

/**
 * Verify 6-digit OTP code and activate candidate profile.
 */
export async function verifyOtpAction(payload: { email: string; otp: string }): Promise<{ success: boolean; message?: string }> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();
    const response = await apiPost<{ user?: any; access_token?: string; refresh_token?: string; message?: string }>(
      "auth/verify-otp",
      payload,
      { cookieHeader }
    );

    if (response.error) {
      return { success: false, message: response.error.message || "Invalid or expired verification PIN." };
    }

    const data = response.data;
    if (data?.access_token) {
      cookieStore.set("access_token", data.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });

      if (data.refresh_token) {
        cookieStore.set("refresh_token", data.refresh_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24 * 30,
        });
      }

      const roleStr = resolvePrimaryRole(data.user);

      cookieStore.set("user_role", roleStr, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    revalidatePath("/");
    return { success: true, message: data?.message || "Identity confirmed successfully." };
  } catch (err: any) {
    return { success: false, message: err.message || "Failed to authenticate verification PIN." };
  }
}

/**
 * Update candidate email address prior to OTP verification.
 */
export async function changeVerificationEmailAction(payload: { currentEmail: string; newEmail: string }): Promise<{ success: boolean; email?: string; message?: string }> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();
    const response = await apiPost<{ email: string; message: string }>(
      "auth/change-email",
      { current_email: payload.currentEmail, new_email: payload.newEmail },
      { cookieHeader }
    );

    if (response.error) {
      return { success: false, message: response.error.message || "Failed to update email address." };
    }

    return {
      success: true,
      email: response.data?.email || payload.newEmail,
      message: response.data?.message || "Email address updated successfully.",
    };
  } catch (err: any) {
    return { success: false, message: err.message || "Failed to update email address." };
  }
}

/**
 * Refresh access token using refresh_token cookie.
 */
export async function refreshTokenAction(): Promise<{ success: boolean; access_token?: string }> {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refresh_token")?.value;
    if (!refreshToken) {
      return { success: false };
    }

    const cookieHeader = cookieStore.toString();
    const response = await apiPost<{ access_token?: string; refresh_token?: string }>(
      "auth/refresh",
      { refresh: refreshToken },
      { cookieHeader }
    );

    if (response.error || !response.data?.access_token) {
      return { success: false };
    }

    const { access_token, refresh_token } = response.data;
    cookieStore.set("access_token", access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    if (refresh_token) {
      cookieStore.set("refresh_token", refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });
    }

    return { success: true, access_token };
  } catch {
    return { success: false };
  }
}

