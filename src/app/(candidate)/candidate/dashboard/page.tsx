import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { CandidateDashboardView } from "@/components/candidate/dashboard/CandidateDashboardView";

export const metadata: Metadata = {
  title: "Candidate Talent Cockpit | Pepoltek",
  description: "Live progress across sprint application pipelines, reverse search pod matches, and vetting status.",
};

export default async function CandidateDashboardPage() {
  const cookieStore = await cookies();
  const role = cookieStore.get("user_role")?.value?.toUpperCase();

  if (role === "TECH_VALIDATOR" || role === "CREDENTIAL_OFFICER") {
    redirect("/validator/dashboard");
  } else if (role === "RECRUITER" || role === "BUSINESS_ANALYST") {
    redirect("/recruiter/dashboard");
  } else if (role === "SUPER_ADMIN" || role === "ADMIN") {
    redirect("/admin/dashboard");
  } else if (role === "REFERRER") {
    redirect("/referrals/dashboard");
  }

  return <CandidateDashboardView />;
}
