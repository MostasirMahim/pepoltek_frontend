import { Metadata } from "next";
import { getContentBlocksOverviewAction } from "@/actions/content.actions";
import { AdminContentOverview } from "@/components/admin/content/AdminContentOverview";

export const metadata: Metadata = {
  title: "Content Management Hub | Pepoltek Admin",
  description:
    "Manage all public website content -- homepage sections, services, case studies, navigation, and more -- from one admin panel.",
};

export default async function AdminContentPage() {
  const result = await getContentBlocksOverviewAction();
  return <AdminContentOverview blocks={result.data} />;
}
