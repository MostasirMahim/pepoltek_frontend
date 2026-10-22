import { Metadata } from "next";
import { ClientDashboardView } from "@/components/client/ClientDashboardView";

export const metadata: Metadata = {
  title: "Enterprise Client Workspace | Pepoltek",
  description: "Enterprise oversight for active engineering pods and clinical staffing squads.",
};

export default function ClientDashboardPage() {
  return <ClientDashboardView />;
}
