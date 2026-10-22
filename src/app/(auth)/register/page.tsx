import { Metadata } from "next";
import { RegisterWizardView } from "@/components/auth/RegisterWizardView";

export const metadata: Metadata = {
  title: "Candidate Intake & Onboarding | Pepoltek Talent Network",
  description: "Join the top 2% vetted engineering pods and clinical staffing squads. 5-step automated intake.",
};

export default function RegisterPage() {
  return <RegisterWizardView />;
}
