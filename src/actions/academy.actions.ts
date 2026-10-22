"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { apiGet, apiPost } from "@/lib/api";

export interface AcademyCourseItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  sector: string;
  estimated_hours: number;
  modules_count: number;
  progress_pct: number;
  is_enrolled: boolean;
  badge_unlocked?: boolean;
}

export async function getAcademyCoursesAction() {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await apiGet<AcademyCourseItem[]>("academy/courses/", { cookieHeader });
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
        message: err.message || "Failed to load Academy courses.",
      },
    };
  }
}

export async function enrollCourseAction(courseId: string) {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await apiPost(`academy/courses/${courseId}/enroll/`, {}, { cookieHeader });
    if (response.error) {
      return { success: false, error: response.error };
    }

    revalidatePath("/candidate/academy");
    return { success: true, data: response.data };
  } catch (err: any) {
    return {
      success: false,
      error: {
        code: "SERVER_EXCEPTION",
        message: err.message || "Failed to enroll in course.",
      },
    };
  }
}
