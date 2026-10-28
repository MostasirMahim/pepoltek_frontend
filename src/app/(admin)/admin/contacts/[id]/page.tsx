import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getAdminContactInquiryDetailAction } from "@/actions/leads.actions";
import AdminContactDetailView from "@/components/admin/leads/AdminContactDetailView";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const inquiry = await getAdminContactInquiryDetailAction(id);
  return {
    title: inquiry ? `${inquiry.subject} | Contact Inquiry | Pepoltek Admin` : "Contact Inquiry | Pepoltek Admin",
    description: "Review inbound general inquiry, sender communications, and resolution workflow.",
  };
}

export default async function AdminContactDetailPage({ params }: PageProps) {
  const { id } = await params;
  const inquiry = await getAdminContactInquiryDetailAction(id);

  if (!inquiry) {
    notFound();
  }

  return <AdminContactDetailView initialInquiry={inquiry} />;
}
