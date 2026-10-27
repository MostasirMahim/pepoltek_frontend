import {
  listAssessmentTemplates,
  listApplicationVettings,
} from "@/actions/recruiter.actions";
import { getTaxonomiesAction } from "@/actions/taxonomy.actions";
import AssessmentsView from "@/components/recruiter/assessments/AssessmentsView";

export const metadata = {
  title: "Assessments & Vetting | Pepoltek AdminOS",
  description:
    "Manage platform assessment templates, candidate evaluations, and scoring rubrics across technology and healthcare sectors.",
};

export default async function AdminAssessmentsPage() {
  const [templatesRes, vettingsRes, taxonomiesRes] = await Promise.all([
    listAssessmentTemplates(),
    listApplicationVettings(),
    getTaxonomiesAction(),
  ]);

  const templates =
    (templatesRes?.data as any)?.results || templatesRes?.data || [];
  const vettings =
    (vettingsRes?.data as any)?.results || vettingsRes?.data || [];
  const categories = taxonomiesRes?.data?.assessmentCategories || [];

  return (
    <AssessmentsView
      templates={templates}
      vettings={vettings}
      categories={categories}
      basePath="/admin/assessments"
    />
  );
}
