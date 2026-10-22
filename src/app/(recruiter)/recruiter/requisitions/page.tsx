import { Metadata } from "next";
import { RecruiterPodsView } from "@/components/recruiter/pods/RecruiterPodsView";
import { getRecruiterPodsAction } from "@/actions/recruiter.actions";

export const metadata: Metadata = {
  title: "Requisitions & Pipeline Management | Pepoltek Recruiter",
  description: "Configure and manage active job and gig requisitions and candidate pipeline.",
};

export default async function RecruiterRequisitionsPage() {
  const pods = await getRecruiterPodsAction();
  return <RecruiterPodsView pods={pods} />;
}
