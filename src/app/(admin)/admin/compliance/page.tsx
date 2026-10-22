import { Metadata } from "next";
import { AdminComplianceView } from "@/components/admin/compliance/AdminComplianceView";

export const metadata: Metadata = {
  title: "Compliance & Credential Vault | Pepoltek Admin",
  description: "SOC 2 Type II, HIPAA clinical data governance, and candidate right-to-work verification controls.",
};

export default function AdminCompliancePage() {
  return <AdminComplianceView />;
}
