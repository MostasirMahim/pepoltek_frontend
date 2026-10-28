import { Metadata } from "next";
import { getAdminLeadsAction, getAdminContactInquiriesAction } from "@/actions/leads.actions";
import AdminLeadsView from "@/components/admin/leads/AdminLeadsView";

export const metadata: Metadata = {
  title: "Inquiries & Employer Leads | Pepoltek Admin",
  description: "Manage inbound employer hiring requests, consultation schedules, client conversion, and general inquiries.",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminLeadsPage() {
  const [leadsRes, contactsRes] = await Promise.all([
    getAdminLeadsAction(),
    getAdminContactInquiriesAction(),
  ]);

  return (
    <AdminLeadsView
      initialLeads={leadsRes.data}
      leadsMetrics={leadsRes.metrics}
      initialContacts={contactsRes.data}
      contactsMetrics={contactsRes.metrics}
    />
  );
}
