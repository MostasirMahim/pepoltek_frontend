import { Metadata } from "next";
import { AdminPodsView } from "@/components/admin/pods/AdminPodsView";
import { ADMIN_PODS, ADMIN_JOB_REQUISITIONS } from "@/data/adminDashboardData";

export const metadata: Metadata = {
  title: "Global Requisition Registry & SLAs | Pepoltek Admin",
  description: "Enterprise requisitions, multi-seat teams, weekly burn, and SLA health monitoring.",
};

export default function AdminPodsManagementPage() {
  return (
    <AdminPodsView
      initialPods={[]}
      initialRequisitions={[]}
    />
  );
}
