import { Metadata } from "next";
import { StaffLoginView } from "@/components/auth/StaffLoginView";

export const metadata: Metadata = {
  title: "Recruiter ATS Operations Login | Pepoltek",
  description: "Enterprise recruiter portal for high-velocity pod deployment, specialist pipeline review, and placement SLA tracking.",
};

export default function RecruiterLoginPage() {
  return <StaffLoginView initialWorkspace="recruiter" />;
}
