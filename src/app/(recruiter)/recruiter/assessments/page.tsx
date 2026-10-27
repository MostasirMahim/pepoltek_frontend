import { listAssessmentTemplates, listApplicationVettings } from "@/actions/recruiter.actions";
import { getTaxonomiesAction } from "@/actions/taxonomy.actions";
import AssessmentsView from "@/components/recruiter/assessments/AssessmentsView";

export const metadata = {
  title: "Assessments & Vetting | Pepoltek Recruiter",
  description:
    "Manage assessment templates, assign vettings to candidates, and track validator scores in the Pepoltek dynamic vetting system.",
};

export default async function AssessmentsPage() {
  const [templatesRes, vettingsRes, taxonomiesRes] = await Promise.all([
    listAssessmentTemplates(),
    listApplicationVettings(),
    getTaxonomiesAction(),
  ]);

  const templates = (templatesRes?.data as any)?.results || templatesRes?.data || [];
  const vettings = (vettingsRes?.data as any)?.results || vettingsRes?.data || [];
  const categories = taxonomiesRes?.data?.assessmentCategories || [];

  return (
    <AssessmentsView
      templates={templates}
      vettings={vettings}
      categories={categories}
      basePath="/recruiter/assessments"
    />
  );
}
