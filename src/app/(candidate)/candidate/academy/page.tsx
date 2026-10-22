import { Metadata } from "next";
import { CandidateAcademyView } from "@/components/candidate/academy/CandidateAcademyView";
import { getAcademyCoursesAction } from "@/actions/academy.actions";
import { ACADEMY_COURSES, AcademyCourse } from "@/data/talentDashboardData";

export const metadata: Metadata = {
  title: "Talent Academy & Readiness | Pepoltek",
  description: "Enterprise-accredited courses, timed technical exams, and Tier 1 squad deployment badges.",
};

export default async function CandidateAcademyPage() {
  let initialCourses: AcademyCourse[] = [];

  try {
    const res = await getAcademyCoursesAction();
    if (res.success && res.data && res.data.length > 0) {
      initialCourses = res.data.map((item, idx) => ({
        id: item.id || `CRS-${idx}`,
        title: item.title,
        category: item.sector === "healthcare" ? "Healthcare Compliance" : "Software Architecture",
        duration: `${item.estimated_hours || 4} Hours`,
        modulesCount: item.modules_count || 6,
        completedModules: Math.round(((item.progress_pct || 0) / 100) * (item.modules_count || 6)),
        progressPercentage: item.progress_pct || 0,
        status: item.progress_pct === 100 ? "Completed" : item.is_enrolled ? "In Progress" : "Available",
        badgeName: item.badge_unlocked ? "Verified Specialist" : "Course Badge",
        tierUnlockText: "Unlocks Tier 1 Squad Rate & Direct Client Match Flags",
        instructor: "Pepoltek Technical Lead",
        syllabus: ["Architecture Foundations", "Security & Compliance", "Deployment Sprints"],
      }));
    }
  } catch {
    // Fallback to mock data
  }

  return <CandidateAcademyView initialCourses={initialCourses} />;
}
