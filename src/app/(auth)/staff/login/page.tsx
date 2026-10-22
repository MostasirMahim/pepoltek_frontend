import { Metadata } from "next";
import { StaffLoginView } from "@/components/auth/StaffLoginView";

export const metadata: Metadata = {
  title: "Staff & Recruiter Operations Login | Pepoltek",
  description: "Secure two-factor authentication gateway for recruiters and platform administrators.",
};

export default function StaffLoginPage() {
  return <StaffLoginView />;
}
