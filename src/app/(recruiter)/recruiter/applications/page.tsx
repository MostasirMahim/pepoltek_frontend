import { Metadata } from "next";
import { RecruiterApplicationsKanbanView } from "@/components/recruiter/applications/RecruiterApplicationsKanbanView";
import {
  getRecruiterPipelineAction,
  getRecruiterPodsAction,
  getClientsAction,
} from "@/actions/recruiter.actions";

export const metadata: Metadata = {
  title: "Candidate Applications & Kanban Pipeline | Pepoltek Recruiter",
  description:
    "Enterprise candidate pipeline tracking across Discovery, Market Mapping, Technical Vetting, and Client Interviews.",
};

export const dynamic = "force-dynamic";

export default async function RecruiterApplicationsPage() {
  const [pipeline, requisitions, clientsRes] = await Promise.all([
    getRecruiterPipelineAction(),
    getRecruiterPodsAction(),
    getClientsAction(),
  ]);

  const clients = clientsRes.success && clientsRes.data ? clientsRes.data : [];

  return (
    <RecruiterApplicationsKanbanView
      initialPipeline={pipeline}
      requisitions={requisitions}
      clients={clients}
    />
  );
}
