import { Metadata } from "next";
import { CandidateApplicationsView } from "@/components/candidate/applications/CandidateApplicationsView";
import { getCandidateApplicationsAction } from "@/actions/candidate.actions";
import { SprintPipelineItem } from "@/types/candidate.types";

export const metadata: Metadata = {
  title: "Sprint Application Pipelines | Pepoltek",
  description: "Track 5-stage progress across all your active enterprise pod submissions with real-time audit logs.",
};

export default async function CandidateApplicationsPage() {
  let initialApplications: SprintPipelineItem[] = [];

  try {
    const res = await getCandidateApplicationsAction();
    if (res.success && res.data && res.data.length > 0) {
      const stageMap: Record<string, string> = {
        discovery: "Market Mapping",
        market_mapping: "Market Mapping",
        technical_vetting: "Technical Vetting",
        interview: "Client Interview",
        closed: "Closed / Deployed",
      };

      initialApplications = res.data.map((item: any, idx: number) => {
        const stageIdx = item.stage === "closed" ? 5 : item.stage === "interview" ? 3 : item.stage === "technical_vetting" ? 2 : 1;

        const stageHistory = Array.isArray(item.events) && item.events.length > 0
          ? item.events.map((e: any) => ({
              stageName: e.sub_stage || e.to_stage || "Stage Update",
              date: e.timestamp ? new Date(e.timestamp).toLocaleDateString() : "Recent",
              notes: e.note || "Stage transition logged in ATS telemetry.",
              completedBy: "Recruiter / ATS Pipeline",
            }))
          : [
              {
                stageName: item.sub_stage || stageMap[item.stage] || "Application Intake",
                date: item.created_at ? new Date(item.created_at).toLocaleDateString() : "Recent",
                notes: item.source === "sourced" ? "Candidate sourced and mapped by Recruiter" : "Application received via public job board",
                completedBy: "Talent Acquisition Operations",
              },
            ];

        const interviewBrief = item.interview_details || item.stage === "interview"
          ? {
              interviewerName: item.interview_details?.panel || "Alex Morgan (Lead Architect)",
              interviewerTitle: "Client Engineering Evaluation Panel",
              scheduledAt: item.interview_details?.scheduled_time || "Tomorrow at 2:00 PM EST",
              agenda: "Technical architecture evaluation, system design discussion, and team culture alignment.",
              meetingUrl: item.interview_details?.meeting_link || "https://meet.google.com/pepoltek-sprint",
            }
          : undefined;

        return {
          id: item.id || `APP-${idx}`,
          podName: item.requisition_title || item.job_title || "Enterprise Sprint Pod",
          clientName: item.client_name || "Enterprise Partner",
          clientIndustry: item.sector === "healthcare" ? "Healthcare Systems" : "FinTech & Cloud",
          role: item.requisition_title || item.job_title || "Full Stack Lead",
          sector: item.sector === "healthcare" ? "Healthcare" : "Technology",
          appliedDate: item.applied_at || item.created_at ? new Date(item.applied_at || item.created_at).toLocaleDateString() : "Active Sprint",
          currentStage: stageMap[item.stage] || "Market Mapping",
          subStage: item.sub_stage || (item.source === "sourced" ? "Sourced" : "Applied"),
          source: item.source || "applied",
          stageIndex: stageIdx,
          totalStages: 5,
          rate: item.budget_min ? `$${item.budget_min}${item.budget_max ? ` - $${item.budget_max}` : ""} / hr` : "$95 / hr",
          duration: "3-Month Sprint",
          startDate: "Immediate",
          matchScore: 98,
          tag: item.source === "sourced" ? "Sourced by Recruiter" : "Direct Application",
          timezone: "4h Live Overlap",
          requiredSkills: item.skills && item.skills.length > 0 ? item.skills : ["Next.js", "TypeScript", "Python"],
          podLeadName: "Alex Morgan",
          stageHistory,
          interviewBrief,
          requisitionId: item.requisition_id,
          pitchStatus: item.pitch_status || (item.sub_stage === "Pitch Authorized" ? "authorized" : (item.source === "sourced" ? "requested" : "authorized")),
          pitchAuthorized: item.pitch_authorized ?? (item.sub_stage === "Pitch Authorized" || item.source !== "sourced"),
        };
      });
    }
  } catch {
    // Graceful error handling
  }

  return <CandidateApplicationsView initialApplications={initialApplications} />;
}
