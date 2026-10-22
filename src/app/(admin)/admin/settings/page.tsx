import { Metadata } from "next";
import { AdminSettingsView } from "@/components/admin/settings/AdminSettingsView";

export const metadata: Metadata = {
  title: "System Configuration & Pricing Policy | Pepoltek Admin",
  description: "Global engine parameters, direct-hire placement fee percentages, and SLA guarantees.",
};

export default function AdminSettingsPage() {
  return <AdminSettingsView />;
}
