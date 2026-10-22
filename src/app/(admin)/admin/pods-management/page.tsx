import { Metadata } from "next";
import { AdminPodsView } from "@/components/admin/pods/AdminPodsView";

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
