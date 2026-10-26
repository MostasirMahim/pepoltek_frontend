import { Metadata } from "next";
import { ClientManagementView } from "@/components/recruiter/clients/ClientManagementView";

export const metadata: Metadata = {
  title: "Client Organizations & Delivery Terms | Pepoltek Recruiter ATS",
  description: "Enterprise client directory, delivery channels (Email, IM, Client ATS), and hiring manager contacts.",
};

export default function RecruiterClientsPage() {
  return <ClientManagementView role="recruiter" />;
}
