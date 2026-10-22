import { Metadata } from "next";
import { AdminAuditLogsView } from "@/components/admin/audit-logs/AdminAuditLogsView";

export const metadata: Metadata = {
  title: "System Action & Audit Logs | Pepoltek Admin",
  description: "Cryptographically verified, tamper-proof audit trail for SOC 2 Type II attestation.",
};

export default function AdminAuditLogsPage() {
  return <AdminAuditLogsView initialLogs={[]} />;
}
