import { notFound } from "next/navigation";
import {
  getAssessmentTemplate,
  listApplicationVettings,
} from "@/actions/recruiter.actions";
import { getTaxonomiesAction } from "@/actions/taxonomy.actions";
import { getAdminUsersAction } from "@/actions/admin.actions";
import AssessmentDetailView from "@/components/recruiter/assessments/AssessmentDetailView";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const res = await getAssessmentTemplate(id);
  const template = res?.data as any;

  return {
    title: template?.title
      ? `${template.title} | Assessments | Pepoltek AdminOS`
      : "Assessment Details | Pepoltek AdminOS",
    description: "Detailed scoring rubric, validators, and candidate vetting submissions.",
  };
}

export default async function AdminAssessmentDetailPage({ params }: PageProps) {
  const { id } = await params;

  const [templateRes, vettingsRes, taxonomiesRes, usersRes] = await Promise.all([
    getAssessmentTemplate(id),
    listApplicationVettings({ template: id }),
    getTaxonomiesAction(),
    getAdminUsersAction(),
  ]);

  if (templateRes?.error || !templateRes?.data) {
    notFound();
  }

  const template = templateRes.data as any;
  const vettings = (vettingsRes?.data as any)?.results || vettingsRes?.data || [];
  const categories = taxonomiesRes?.data?.assessmentCategories || [];
  const staffUsers = Array.isArray(usersRes) ? usersRes : [];

  return (
    <AssessmentDetailView
      template={template}
      vettings={vettings}
      categories={categories}
      staffUsers={staffUsers}
      basePath="/admin/assessments"
    />
  );
}
