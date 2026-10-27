import { notFound } from "next/navigation";
import {
  getRecruiterApplicationDetailAction,
  getClientsAction,
  listAssessmentTemplates,
  getStaffValidatorsAction,
} from "@/actions/recruiter.actions";
import { RecruiterApplicationDetailView } from "@/components/recruiter/applications/RecruiterApplicationDetailView";

interface Props {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function RecruiterApplicationDetailPage({ params }: Props) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  const [appRes, clientsRes, templatesRes, validatorsRes] = await Promise.all([
    getRecruiterApplicationDetailAction(id),
    getClientsAction(),
    listAssessmentTemplates(),
    getStaffValidatorsAction(),
  ]);

  if (!appRes.success || !appRes.data) {
    notFound();
  }

  const application = appRes.data;
  const clients = clientsRes.success && clientsRes.data ? clientsRes.data : [];
  const assessmentTemplates = (templatesRes?.data as any)?.results || templatesRes?.data || [];
  const validators = validatorsRes.success && validatorsRes.data ? validatorsRes.data : [];

  return (
    <RecruiterApplicationDetailView
      initialApplication={application}
      clients={clients}
      assessmentTemplates={assessmentTemplates}
      validators={validators}
    />
  );
}
