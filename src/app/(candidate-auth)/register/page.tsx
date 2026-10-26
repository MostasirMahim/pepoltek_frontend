import { Metadata } from "next";
import { Suspense } from "react";
import { CandidateIntakeRegisterView } from "@/components/auth/CandidateIntakeRegisterView";

export const metadata: Metadata = {
  title: "Candidate Registration & Talent Intake | Pepoltek RPO",
  description:
    "Join the vetted global talent network. Enterprise RPO candidate registration for technology and healthcare professionals.",
};

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] text-slate-500 text-sm font-sans">
          Loading Candidate Registration...
        </div>
      }
    >
      <CandidateIntakeRegisterView />
    </Suspense>
  );
}
