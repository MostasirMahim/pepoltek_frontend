import { Metadata } from "next";
import { LoginView } from "@/components/auth/LoginView";

export const metadata: Metadata = {
  title: "Sign In | Pepoltek Talent & Partner Portal",
  description: "Secure 256-bit authentication gateway for candidates and partners.",
};

export default function LoginPage() {
  return <LoginView />;
}
