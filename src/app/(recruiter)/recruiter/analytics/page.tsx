import { Metadata } from "next";
import { RecruiterAnalyticsView } from "@/components/recruiter/analytics/RecruiterAnalyticsView";
import { getRecruiterAnalyticsAction } from "@/actions/recruiter.actions";

export const metadata: Metadata = {
  title: "Recruitment Telemetry & Analytics | Pepoltek",
  description: "Velocity tracking, time-to-deploy, ROI metrics, and specialist retention statistics.",
};

export default async function RecruiterAnalyticsPage() {
  const analytics = await getRecruiterAnalyticsAction();
  return <RecruiterAnalyticsView analytics={analytics} />;
}
