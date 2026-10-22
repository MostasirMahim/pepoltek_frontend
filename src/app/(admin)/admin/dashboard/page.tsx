import { Metadata } from "next";
import { AdminDashboardView } from "@/components/admin/dashboard/AdminDashboardView";
import { getAdminTelemetryAction } from "@/actions/admin.actions";

export const metadata: Metadata = {
  title: "Platform Mission Control | Pepoltek Executive Admin",
  description: "Real-time executive command center across candidate vetting, recruiter pipeline SLAs, and compliance escrow.",
};

export default async function AdminDashboardPage() {
  const telemetryData = await getAdminTelemetryAction();

  return (
    <AdminDashboardView
      telemetry={telemetryData}
      recentEvents={telemetryData.recentEvents}
      pods={telemetryData.pods}
    />
  );
}
