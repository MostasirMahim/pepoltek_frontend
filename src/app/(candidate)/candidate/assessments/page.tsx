import { Metadata } from "next";
import { CandidateAssessmentsView } from "@/components/candidate/assessments/CandidateAssessmentsView";
import {
  getCandidateVettingsAction,
  getCandidateAssessmentTemplatesAction,
  CandidateVettingItem,
  CandidateTemplateItem,
} from "@/actions/candidate.actions";

export const metadata: Metadata = {
  title: "Candidate Assessments & Vetting | Pepoltek",
  description: "Objective proctor-free technical evaluations and clinical competency benchmarks.",
};

export const dynamic = "force-dynamic";

export default async function CandidateAssessmentsPage() {
  const [vettingsRes, templatesRes] = await Promise.all([
    getCandidateVettingsAction(),
    getCandidateAssessmentTemplatesAction(),
  ]);

  const assignedVettings: CandidateVettingItem[] =
    vettingsRes.success && vettingsRes.data ? vettingsRes.data : [];
  const templates: CandidateTemplateItem[] =
    templatesRes.success && templatesRes.data ? templatesRes.data : [];

  return (
    <CandidateAssessmentsView
      assignedVettings={assignedVettings}
      availableTemplates={templates}
    />
  );
}
