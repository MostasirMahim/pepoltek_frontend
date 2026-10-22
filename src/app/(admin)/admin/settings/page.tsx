import { Metadata } from "next";
import { AdminSettingsView } from "@/components/admin/settings/AdminSettingsView";
import { ADMIN_SYSTEM_SETTINGS } from "@/data/adminDashboardData";

export const metadata: Metadata = {
  title: "System Configuration & Pricing Policy | Pepoltek Admin",
  description: "Global engine parameters, direct-hire placement fee percentages, and SLA guarantees.",
};

export default function AdminSettingsPage() {
  return <AdminSettingsView initialSettings={ADMIN_SYSTEM_SETTINGS} />;
}
