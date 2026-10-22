import { Metadata } from "next";
import { AdminDashboardView } from "@/components/admin/dashboard/AdminDashboardView";
import {
  ADMIN_TELEMETRY,
  RECENT_PLATFORM_EVENTS,
  ADMIN_PODS,
} from "@/data/mock";

export const metadata: Metadata = {
  title: "Platform Mission Control | Pepoltek Executive Admin",
  description: "Real-time executive command center across candidate vetting, recruiter pod SLAs, and compliance escrow.",
};

export default function AdminDashboardPage() {
  return (
    <AdminDashboardView
      telemetry={ADMIN_TELEMETRY}
      recentEvents={RECENT_PLATFORM_EVENTS}
      pods={ADMIN_PODS}
    />
  );
}
