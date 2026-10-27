import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getAdminLeadDetailAction } from "@/actions/leads.actions";
import AdminLeadDetailView from "@/components/admin/leads/AdminLeadDetailView";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const lead = await getAdminLeadDetailAction(id);
  return {
    title: lead ? `${lead.company} | Lead Dossier | Pepoltek Admin` : "Lead Dossier | Pepoltek Admin",
    description: "Detailed employer requirement brief, discovery schedule, and ATS conversion controls.",
  };
}

export default async function AdminLeadDetailPage({ params }: PageProps) {
  const { id } = await params;
  const lead = await getAdminLeadDetailAction(id);

  if (!lead) {
    notFound();
  }

  return <AdminLeadDetailView initialLead={lead} />;
}
