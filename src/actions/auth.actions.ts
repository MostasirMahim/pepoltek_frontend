"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { apiGet, apiPost } from "@/lib/api";

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: string;
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
    }

    revalidatePath("/");
    return { success: true, user: data?.user };
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
    const response = await apiPost<{ user: AuthUser; access_token?: string; refresh_token?: string }>(
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
    }

    revalidatePath("/");
    return { success: true, user: data?.user };
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

    await apiPost("auth/logout", {}, { cookieHeader });
    cookieStore.delete("access_token");
    cookieStore.delete("refresh_token");

    revalidatePath("/");
    return { success: true };
  } catch {
    const cookieStore = await cookies();
    cookieStore.delete("access_token");
    cookieStore.delete("refresh_token");
    return { success: true };
  }
}

/**
 * Get currently authenticated user from backend.
 */
export async function getCurrentUserAction(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await apiGet<{ user: AuthUser }>("auth/me", { cookieHeader });
    if (response.data?.user) {
      return response.data.user;
    }
    return null;
  } catch {
    return null;
  }
}
