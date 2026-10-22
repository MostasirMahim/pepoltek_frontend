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
      const stageMap: Record<string, "Submitted" | "Screened" | "Technical Vetting" | "Client Panel" | "Deployed"> = {
        discovery: "Submitted",
        market_mapping: "Screened",
        technical_vetting: "Technical Vetting",
        interview: "Client Panel",
        closed: "Deployed",
      };

      initialApplications = res.data.map((item: any, idx: number) => ({
        id: item.id || `APP-${idx}`,
        podName: item.requisition_title || item.job_title || "Enterprise Sprint Pod",
        clientName: item.client_name || "Enterprise Partner",
        clientIndustry: item.sector === "healthcare" ? "Healthcare Systems" : "FinTech & Cloud",
        role: item.requisition_title || item.job_title || "Full Stack Lead",
        sector: item.sector === "healthcare" ? "Healthcare" : "Technology",
        appliedDate: item.applied_at || item.created_at ? new Date(item.applied_at || item.created_at).toLocaleDateString() : "Active Sprint",
        currentStage: stageMap[item.stage] || "Submitted",
        stageIndex: item.stage === "closed" ? 5 : item.stage === "interview" ? 4 : item.stage === "technical_vetting" ? 3 : item.stage === "market_mapping" ? 2 : 1,
        totalStages: 5,
        rate: item.budget_min ? `$${item.budget_min}${item.budget_max ? ` - $${item.budget_max}` : ""} / hr` : "$95 / hr",
        duration: "3-Month Sprint",
        startDate: "Immediate",
        matchScore: 98,
        tag: "Active",
        timezone: "4h Live Overlap",
        requiredSkills: item.skills && item.skills.length > 0 ? item.skills : ["Next.js", "TypeScript", "Python"],
        podLeadName: "Alex Morgan",
      }));
    }
  } catch {
    // Graceful error handling
  }

  return <CandidateApplicationsView initialApplications={initialApplications} />;
}
