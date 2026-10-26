import { notFound } from "next/navigation";
import { getRecruiterApplicationDetailAction, getClientsAction } from "@/actions/recruiter.actions";
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

  const [appRes, clientsRes] = await Promise.all([
    getRecruiterApplicationDetailAction(id),
    getClientsAction(),
  ]);

  if (!appRes.success || !appRes.data) {
    notFound();
  }

  const application = appRes.data;
  const clients = clientsRes.success && clientsRes.data ? clientsRes.data : [];

  return (
    <RecruiterApplicationDetailView
      initialApplication={application}
      clients={clients}
    />
  );
}
