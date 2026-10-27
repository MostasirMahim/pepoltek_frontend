"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { apiGet, apiPost, apiPatch, apiDelete } from "@/lib/api";
import {
  RecruiterPod,
  RecruiterCandidate,
  RecruiterInterview,
  RecruiterInterviewDetail,
  AICandidateSearchResult,
} from "@/types/recruiter.types";


export interface RecruiterAnalyticsData {
  activePodsCount: number;
  totalCandidates: number;
  interviewCount: number;
  closedCount: number;
  avgDeploymentTime: string;
  compliancePassRate: string;
  reclaimedHiringHours: string;
}

export interface CreatePodInput {
  title: string;
  client_name?: string;
  sector?: string;
  level?: string;
  headcount?: number;
  skills?: string[];
  engagement?: string;
  location?: string;
  budget_min?: number;
  budget_max?: number;
  visibility?: string;
  bounty_enabled?: boolean;
  bounty_type_id?: string | null;
  bounty_amount?: number;
  description?: string;
  status?: string;
  responsibilities?: string[];
  requirements?: string[];
  nice_to_haves?: string[];
  benefits?: string[];
}

export interface UpdatePodInput {
  title?: string;
  client_name?: string;
  sector?: string;
  level?: string;
  headcount?: number;
  skills?: string[];
  engagement?: string;
  location?: string;
  budget_min?: number;
  budget_max?: number;
  visibility?: string;
  bounty_enabled?: boolean;
  bounty_type_id?: string | null;
  bounty_amount?: number;
  description?: string;
  status?: string;
  responsibilities?: string[];
  requirements?: string[];
  nice_to_haves?: string[];
  benefits?: string[];
  discovery?: Record<string, any>;
}

export interface PublicJobDetail {
  id: string;
  client_name?: string;
  title: string;
  sector: string;
  level?: string;
  headcount?: number;
  skills: string[];
  budget_min?: number;
  budget_max?: number;
  location?: string;
  engagement?: string;
  visibility?: string;
  bounty_enabled?: boolean;
  bounty_type_id?: string;
  bounty_type_name?: string;
  bounty_amount?: number;
  status: string;
  priority?: number;
  description?: string;
  responsibilities?: string[];
  requirements?: string[];
  nice_to_haves?: string[];
  benefits?: string[];
  interview_process?: { step: string; title: string; duration: string; desc: string }[];
  created_at?: string;
}

export interface ScheduleInterviewInput {
  application_id?: string;
  candidate_name?: string;
  candidate_email?: string;
  role?: string;
  title?: string;
  interview_type?: string;
  round_number?: number;
  scheduled_start?: string;
  scheduled_end?: string;
  scheduled_time?: string;
  timezone?: string;
  meeting_link?: string;
  lead_interviewer_id?: string;
  panel_member_ids?: string[];
  panel?: string;
  candidate_notes?: string;
  internal_brief?: string;
}

/**
 * Fetch recruiter pods from backend ATS requisitions
 */
export async function getRecruiterPodsAction(): Promise<RecruiterPod[]> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await apiGet<any>("ats/requisitions/", { cookieHeader });
    if (response.error) {
      console.error("[getRecruiterPodsAction] API error:", response.error);
    }

    const rawList: any[] = Array.isArray(response.data)
      ? response.data
      : Array.isArray((response.data as any)?.results)
      ? (response.data as any).results
      : Array.isArray((response.data as any)?.data)
      ? (response.data as any).data
      : [];

    if (rawList.length === 0) {
      return [];
    }

    return rawList.map((req: any, idx: number) => {
      const isHealth = (req.sector || "").toLowerCase().includes("health");
      const cleanId = req.id ? String(req.id).replace(/-/g, "") : "";
      const shortId = cleanId ? cleanId.slice(-6).toUpperCase() : String(idx + 1).padStart(3, "0");
      const maxRate = req.budget_max || 120;
      const count = req.headcount || 1;
      const weekly = maxRate * 40 * count;

      return {
        id: `REQ-${shortId}`,
        rawId: req.id,
        name: req.title || "Enterprise Requisition",
        type: isHealth ? "Healthcare" : "Software Tech",
        lead: isHealth ? "Dr. Lead Clinician" : "Senior Lead Architect",
        size: `${count} Specialist${count > 1 ? "s" : ""}`,
        stage: req.status === "open" ? "Active Sprint" : "Sprint Assembly",
        velocity: "100% On-Track",
        members: Array.isArray(req.skills) && req.skills.length > 0 ? req.skills : ["Core Specialist"],
        status: req.status || "open",
        sprintProgress: "70%",
        deploymentDate: req.created_at
          ? new Date(req.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : "Active",
        weeklyBudget: `$${weekly.toLocaleString()}`,
        burnRate: "Normal",
        clientName: req.client_name || "Enterprise Workspace Partner",
        sector: req.sector || (isHealth ? "Healthcare" : "Technology & SDLC"),
        level: req.level || "Senior",
        headcount: count,
        budgetMin: req.budget_min || 85,
        budgetMax: maxRate,
        visibility: req.visibility || "published_job",
        bountyAmount: Number(req.bounty_amount) || 0,
        bountyEnabled: !!req.bounty_enabled,
        bountyTypeId: req.bounty_type_id || null,
        bountyTypeName: req.bounty_type_name || null,
        description: req.description || "",
        responsibilities: req.responsibilities || [],
        requirements: req.requirements || [],
        nice_to_haves: req.nice_to_haves || [],
        candidatesCount: req.candidates_count || 0,
        location: req.location || "100% Remote (US/EU)",
        engagement: req.engagement || "Full Requisition (W2/C2C)",
      };
    });
  } catch {
    return [];
  }
}

/**
 * Create/publish a new pod requisition to ATS and public job board
 */
export async function createRecruiterPodAction(input: CreatePodInput) {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const payload = {
      title: input.title,
      client_name: input.client_name || "Enterprise Workspace Partner",
      sector: input.sector || "Technology & SDLC",
      level: input.level || "Senior",
      headcount: 1, // Enforce single-role requisition: one job post to hire one tier
      skills: input.skills || [],
      engagement: input.engagement || "Direct Placement",
      location: input.location || "100% Remote (US/EU)",
      budget_min: input.budget_min || 85,
      budget_max: input.budget_max || 125,
      visibility: input.visibility || "published_job",
      bounty_enabled: !!input.bounty_enabled,
      bounty_type_id: input.bounty_type_id || null,
      bounty_amount: input.bounty_amount || 0.0,
      description: input.description || "",
      responsibilities: input.responsibilities || [],
      requirements: input.requirements || [],
      nice_to_haves: input.nice_to_haves || [],
      status: input.status || "open",
    };

    const response = await apiPost("ats/requisitions/", payload, { cookieHeader });
    if (response.error) {
      return { success: false, error: response.error.message };
    }

    return { success: true, data: response.data };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to create requisition." };
  }
}

/**
 * Update requisition / pod details
 */
export async function updateRecruiterPodAction(id: string, input: UpdatePodInput) {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await apiPatch(`ats/requisitions/${id}/`, input, { cookieHeader });
    if (response.error) {
      return { success: false, error: response.error.message };
    }

    return { success: true, data: response.data };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update requisition." };
  }
}

/**
 * Update pod status
 */
export async function updatePodStatusAction(id: string, status: string) {
  return updateRecruiterPodAction(id, { status });
}

/**
 * Cancel / archive a pod requisition
 */
export async function deleteRecruiterPodAction(id: string) {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await apiDelete(`ats/requisitions/${id}/`, { cookieHeader });
    if (response.error) {
      return { success: false, error: response.error.message };
    }

    return { success: true, data: response.data };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to cancel requisition." };
  }
}

export interface RequisitionApplicant {
  id: string;
  candidate_id: string;
  full_name: string;
  email: string;
  phone: string;
  sector: string;
  level: string;
  skills: string[];
  rate: string;
  match_score: string;
  stage: string;
  sub_stage: string;
  source: string;
  applied_at: string;
  note?: string;
}

/**
 * Fetch all applied candidates for a specific pod requisition
 */
export async function getRequisitionApplicantsAction(requisitionId: string): Promise<{
  requisition_id: string;
  requisition_title: string;
  client_name: string;
  total_applicants: number;
  applicants: RequisitionApplicant[];
} | null> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await apiGet<any>(`ats/requisitions/${requisitionId}/applications/`, {
      cookieHeader,
    });
    if (response.data) {
      return response.data;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Move candidate application stage
 */
export async function updateApplicationStageAction(
  applicationId: string,
  toStage: string,
  subStage?: string,
  note?: string
) {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const payload = {
      application_id: applicationId,
      to_stage: toStage,
      sub_stage: subStage || "",
      note: note || "",
    };

    const response = await apiPost("ats/pipeline/", payload, { cookieHeader });
    if (response.error) {
      return { success: false, error: response.error.message };
    }

    return { success: true, data: response.data };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update candidate application stage." };
  }
}


/**
 * Fetch vetted candidates directory for recruiters
 */
export async function getRecruiterCandidatesAction(
  search?: string,
  sector?: string
): Promise<RecruiterCandidate[]> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await apiGet<any[]>("ats/candidates/", {
      cookieHeader,
      params: { search, sector },
    });

    const rawList = Array.isArray(response.data) ? response.data : [];
    return rawList.map((c: any) => ({
      id: c.id ? String(c.id) : `CAND-${Math.random().toString(36).slice(2, 9)}`,
      display_id: c.display_id || (c.id ? `CAND-${String(c.id).replace(/-/g, "").slice(-6).toUpperCase()}` : "CAND-LIVE"),
      name: c.name || "Candidate",
      title: c.title || "Specialist",
      sector: c.sector === "Healthcare" ? "Healthcare" : "Software Tech",
      skills: Array.isArray(c.skills) ? c.skills : [],
      experience: c.experience || "Specialist",
      matchScore: c.matchScore || (c.match_score ? `${c.match_score}%` : "80%"),
      profileStrength: typeof c.profileStrength === "number" ? c.profileStrength : (typeof c.profile_strength === "number" ? c.profile_strength : 0),
      readinessIndex: typeof c.readinessIndex === "number" ? c.readinessIndex : (typeof c.profile_strength === "number" ? c.profile_strength : 0),
      cvScore: typeof c.cvScore === "number" ? c.cvScore : (typeof c.cv_score === "number" ? c.cv_score : 0),
      vettingScore: typeof c.vettingScore === "number" ? c.vettingScore : (typeof c.vetting_score === "number" ? c.vetting_score : 0),
      readinessTier: c.readinessTier || c.readiness_tier || "unrated",
      rate: c.rate || "Negotiable",
      availability: c.availability || "Immediate",
      verified: Boolean(c.verified),
      vetting_status: c.vetting_status || "not_started",
      email: c.email || "",
      phone: c.phone || "",
      location: c.location || "Remote",
      workAuth: c.workAuth || "Authorized",
      engagement: c.engagement || "Direct / Contract",
      summary: c.summary || "",
    }));
  } catch {
    return [];
  }
}

/**
 * Natural-language semantic candidate search powered by DeepSeek AI API.
 * Converts query into structured filter chips, computes composite vector match scores,
 * and returns ranked candidate records with explainability factors.
 */
export async function searchCandidatesWithAIAction(
  query: string,
  sector?: string,
  requisitionId?: string
): Promise<{ success: boolean; data?: AICandidateSearchResult; error?: string }> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await apiPost<any>("ai/candidate-search/", {
      query,
      sector: sector && sector !== "All" ? sector : undefined,
      requisition_id: requisitionId,
    }, {
      cookieHeader,
    });

    if (response.data && Array.isArray(response.data.results)) {
      const rawList = response.data.results;
      const candidates: RecruiterCandidate[] = rawList.map((c: any) => ({
        id: c.id ? String(c.id) : `CAND-${Math.random().toString(36).slice(2, 9)}`,
        display_id: c.display_id || (c.id ? `CAND-${String(c.id).replace(/-/g, "").slice(-6).toUpperCase()}` : "CAND-LIVE"),
        name: c.name || "Candidate",
        title: c.title || "Specialist",
        sector: c.sector === "Healthcare" ? "Healthcare" : "Software Tech",
        skills: Array.isArray(c.skills) ? c.skills : [],
        experience: c.experience || "Specialist",
        matchScore: c.matchScore || `${c.match_score || 80}%`,
        profileStrength: typeof c.profileStrength === "number" ? c.profileStrength : (typeof c.profile_strength === "number" ? c.profile_strength : 0),
        readinessIndex: typeof c.readinessIndex === "number" ? c.readinessIndex : (typeof c.profile_strength === "number" ? c.profile_strength : 0),
        cvScore: typeof c.cvScore === "number" ? c.cvScore : (typeof c.cv_score === "number" ? c.cv_score : 0),
        vettingScore: typeof c.vettingScore === "number" ? c.vettingScore : (typeof c.vetting_score === "number" ? c.vetting_score : 0),
        readinessTier: c.readinessTier || c.readiness_tier || "unrated",
        rate: c.rate || "Negotiable",
        availability: c.availability || "Immediate",
        verified: Boolean(c.verified),
        vetting_status: c.vetting_status || "not_started",
        email: c.email || "",
        phone: c.phone || "",
        location: c.location || "Remote",
        workAuth: c.workAuth || "Authorized",
        engagement: c.engagement || "Direct / Contract",
        summary: c.summary || "",
        positive_factors: c.positive_factors || [],
        gap_factors: c.gap_factors || [],
        semantic_score: c.semantic_score,
        skill_score: c.skill_score,
        level_score: c.level_score,
        matched_skills: c.matched_skills || [],
      }));

      return {
        success: true,
        data: {
          query: response.data.query || query,
          extracted_filters: response.data.extracted_filters || {},
          candidates,
          total_evaluated: response.data.total_evaluated || candidates.length,
          provider: response.data.provider || "deepseek:deepseek-chat",
          latency_seconds: response.data.latency_seconds || 1.2,
        },
      };
    }

    return {
      success: false,
      error: response.error?.message || "Failed to execute AI candidate search.",
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || "Network exception during AI search.",
    };
  }
}

/**
 * Fetch scheduled sprint interviews with filters
 */

export async function getRecruiterInterviewsAction(params?: {
  status?: string;
  type?: string;
  search?: string;
}): Promise<{ interviews: RecruiterInterview[]; metrics?: { total: number; scheduled: number; completed: number } }> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await apiGet<any>("ats/interviews/", {
      cookieHeader,
      params,
    });

    const resData = response.data;
    const rawList: any[] = Array.isArray(resData?.data)
      ? resData.data
      : Array.isArray(resData)
      ? resData
      : [];

    const metrics = resData?.metrics || {
      total: rawList.length,
      scheduled: rawList.filter((i: any) => i.status === "scheduled").length,
      completed: rawList.filter((i: any) => i.status === "completed").length,
    };

    const interviews: RecruiterInterview[] = rawList.map((item: any) => {
      const panelNames = (item.assignments || [])
        .map((a: any) => a.staff_user_name)
        .filter(Boolean);

      const panelStr = panelNames.length > 0
        ? panelNames.join(", ")
        : (item.lead_interviewer_name || "Technical Panel");

      // Format human-readable scheduled time
      let formattedTime = "Scheduled This Sprint";
      if (item.scheduled_start) {
        try {
          const d = new Date(item.scheduled_start);
          formattedTime = d.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });
        } catch {
          formattedTime = item.scheduled_start;
        }
      }

      // Format status title
      const statusTitle =
        item.status === "scheduled"
          ? "Scheduled"
          : item.status === "confirmed"
          ? "Confirmed"
          : item.status === "completed"
          ? "Completed"
          : item.status === "rescheduled"
          ? "Rescheduled"
          : item.status === "cancelled"
          ? "Cancelled"
          : item.status || "Scheduled";

      const typeTitle =
        item.interview_type === "technical_coding"
          ? "Technical Coding"
          : item.interview_type === "system_design"
          ? "System Design"
          : item.interview_type === "clinical_board"
          ? "Clinical Board"
          : item.interview_type === "behavioral_leadership"
          ? "Behavioral & Leadership"
          : item.interview_type === "client_final"
          ? "Client Final Round"
          : item.interview_type || "Technical Panel";

      return {
        id: item.id,
        application_id: item.application_id,
        candidate: item.candidate_name || item.candidate || "Talent Candidate",
        candidate_id: item.candidate_id,
        candidate_email: item.candidate_email,
        candidate_headline: item.candidate_headline,
        role: item.requisition_title || item.role || "Specialist Role",
        requisition_id: item.requisition_id,
        requisition_title: item.requisition_title,
        client_name: item.client_name || "Pepoltek Client Partner",
        pod: item.requisition_title || "Engineering Squad",
        title: item.title,
        time: formattedTime,
        scheduled_start: item.scheduled_start,
        scheduled_end: item.scheduled_end,
        timezone: item.timezone || "UTC",
        meeting_link: item.meeting_link || "https://meet.google.com/pepoltek-sprint",
        type: typeTitle,
        interview_type: item.interview_type,
        round_number: item.round_number || 1,
        panel: panelStr,
        lead_interviewer_id: item.lead_interviewer_id,
        lead_interviewer_name: item.lead_interviewer_name,
        assignments: item.assignments || [],
        evaluations_count: item.evaluations_count || 0,
        average_score: item.average_score,
        reminder_24h_dispatched: item.reminder_24h_dispatched,
        status: statusTitle,
        raw_status: item.status,
        created_at: item.created_at,
      };
    });

    return { interviews, metrics };
  } catch {
    return { interviews: [], metrics: { total: 0, scheduled: 0, completed: 0 } };
  }
}

/**
 * Fetch full interview details including panel members and evaluation scorecards
 */
export async function getInterviewDetailAction(id: string): Promise<RecruiterInterviewDetail | null> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await apiGet<any>(`ats/interviews/${id}/`, { cookieHeader });
    const item = response.data?.data || response.data;
    if (!item || !item.id) {
      return null;
    }

    const panelNames = (item.assignments || [])
      .map((a: any) => a.staff_user_name)
      .filter(Boolean);

    const panelStr = panelNames.length > 0
      ? panelNames.join(", ")
      : (item.lead_interviewer_name || "Technical Panel");

    let formattedTime = "Scheduled This Sprint";
    if (item.scheduled_start) {
      try {
        const d = new Date(item.scheduled_start);
        formattedTime = d.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      } catch {
        formattedTime = item.scheduled_start;
      }
    }

    const statusTitle =
      item.status === "scheduled"
        ? "Scheduled"
        : item.status === "confirmed"
        ? "Confirmed"
        : item.status === "completed"
        ? "Completed"
        : item.status === "rescheduled"
        ? "Rescheduled"
        : item.status === "cancelled"
        ? "Cancelled"
        : item.status || "Scheduled";

    const typeTitle =
      item.interview_type === "technical_coding"
        ? "Technical Coding"
        : item.interview_type === "system_design"
        ? "System Design"
        : item.interview_type === "clinical_board"
        ? "Clinical Board"
        : item.interview_type === "behavioral_leadership"
        ? "Behavioral & Leadership"
        : item.interview_type === "client_final"
        ? "Client Final Round"
        : item.interview_type || "Technical Panel";

    return {
      id: item.id,
      application_id: item.application_id,
      candidate: item.candidate_name || item.candidate || "Talent Candidate",
      candidate_id: item.candidate_id,
      candidate_email: item.candidate_email,
      candidate_headline: item.candidate_headline,
      role: item.requisition_title || item.role || "Specialist Role",
      requisition_id: item.requisition_id,
      requisition_title: item.requisition_title,
      client_name: item.client_name || "Pepoltek Client Partner",
      pod: item.requisition_title || "Engineering Squad",
      title: item.title,
      time: formattedTime,
      scheduled_start: item.scheduled_start,
      scheduled_end: item.scheduled_end,
      timezone: item.timezone || "UTC",
      meeting_link: item.meeting_link || "https://meet.google.com/pepoltek-sprint",
      type: typeTitle,
      interview_type: item.interview_type,
      round_number: item.round_number || 1,
      panel: panelStr,
      lead_interviewer_id: item.lead_interviewer_id,
      lead_interviewer_name: item.lead_interviewer_name,
      assignments: item.assignments || [],
      evaluations_count: item.evaluations_count || 0,
      average_score: item.average_score,
      reminder_24h_dispatched: item.reminder_24h_dispatched,
      reminder_24h_dispatched_at: item.reminder_24h_dispatched_at,
      status: statusTitle,
      raw_status: item.status,
      candidate_notes: item.candidate_notes || "",
      internal_brief: item.internal_brief || "",
      evaluations: item.evaluations || [],
      created_at: item.created_at,
    };
  } catch (err) {
    console.error("[getInterviewDetailAction] Error:", err);
    return null;
  }
}

/**
 * Schedule sprint interview with candidate and trigger live email invitation
 */
export async function scheduleInterviewAction(input: ScheduleInterviewInput) {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await apiPost("ats/interviews/", input, { cookieHeader });
    if (response.error) {
      return { success: false, error: response.error.message };
    }

    revalidatePath("/recruiter/interviews");
    revalidatePath("/admin/interviews");
    return { success: true, data: response.data };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to schedule interview." };
  }
}

/**
 * Update or reschedule interview session
 */
export async function updateInterviewAction(id: string, input: any) {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await apiPatch(`ats/interviews/${id}/`, input, { cookieHeader });
    if (response.error) {
      return { success: false, error: response.error.message };
    }

    revalidatePath(`/recruiter/interviews/${id}`);
    revalidatePath("/recruiter/interviews");
    revalidatePath(`/admin/interviews/${id}`);
    return { success: true, data: response.data };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update interview." };
  }
}

/**
 * Submit or update interview evaluation scorecard
 */
export async function submitInterviewEvaluationAction(
  interviewId: string,
  input: {
    score: number;
    recommendation: string;
    competency_scores?: any[];
    feedback: string;
  }
) {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await apiPost(`ats/interviews/${interviewId}/evaluations/`, input, { cookieHeader });
    if (response.error) {
      return { success: false, error: response.error.message };
    }

    revalidatePath(`/recruiter/interviews/${interviewId}`);
    revalidatePath("/recruiter/interviews");
    revalidatePath(`/admin/interviews/${interviewId}`);
    return { success: true, data: response.data };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to submit evaluation." };
  }
}

/**
 * Add or remove interview panel assignment
 */
export async function updateInterviewPanelAction(
  interviewId: string,
  input: { staff_user_id: string; role?: string; action?: "add" | "remove" }
) {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await apiPost(`ats/interviews/${interviewId}/panel/`, input, { cookieHeader });
    if (response.error) {
      return { success: false, error: response.error.message };
    }

    revalidatePath(`/recruiter/interviews/${interviewId}`);
    return { success: true, data: response.data };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update panel assignment." };
  }
}

/**
 * Fetch recruiter dashboard cockpit telemetry
 */
export async function getRecruiterAnalyticsAction(): Promise<RecruiterAnalyticsData> {
  const fallback: RecruiterAnalyticsData = {
    activePodsCount: 0,
    totalCandidates: 0,
    interviewCount: 0,
    closedCount: 0,
    avgDeploymentTime: "7.0",
    compliancePassRate: "100%",
    reclaimedHiringHours: "0.0",
  };

  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await apiGet<any>("ats/analytics/", { cookieHeader });
    if (response.data) {
      const d = response.data;
      return {
        activePodsCount: typeof d.activePodsCount === "number" ? d.activePodsCount : 0,
        totalCandidates: typeof d.totalCandidates === "number" ? d.totalCandidates : 0,
        interviewCount: typeof d.interviewCount === "number" ? d.interviewCount : 0,
        closedCount: typeof d.closedCount === "number" ? d.closedCount : 0,
        avgDeploymentTime: d.avgDeploymentTime || fallback.avgDeploymentTime,
        compliancePassRate: d.compliancePassRate || fallback.compliancePassRate,
        reclaimedHiringHours: d.reclaimedHiringHours || fallback.reclaimedHiringHours,
      };
    }

    return fallback;
  } catch {
    return fallback;
  }
}

export interface PipelineCandidateItem {
  id: string;
  candidate_id: string;
  candidate_name: string;
  candidate_email: string;
  candidate_phone: string;
  candidate_location: string;
  requisition_id: string;
  requisition_title: string;
  requisition_sector: string;
  client_name: string;
  stage: string;
  sub_stage: string;
  source: string;
  skills: string[];
  rate: string;
  match_score: string;
  applied_at: string;
  updated_at: string;
  note: string;
}

export interface PipelineStagesData {
  discovery: PipelineCandidateItem[];
  market_mapping: PipelineCandidateItem[];
  technical_vetting: PipelineCandidateItem[];
  interview: PipelineCandidateItem[];
  closed: PipelineCandidateItem[];
  rejected?: PipelineCandidateItem[];
}

/**
 * Fetch 5-stage recruiter applicant pipeline with optional requisition and sector filters
 */
export async function getRecruiterPipelineAction(
  requisitionId?: string,
  sector?: string
): Promise<PipelineStagesData> {
  const emptyStages: PipelineStagesData = {
    discovery: [],
    market_mapping: [],
    technical_vetting: [],
    interview: [],
    closed: [],
    rejected: [],
  };

  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const params: Record<string, string | undefined> = {};
    if (requisitionId && requisitionId !== "all") params.requisition_id = requisitionId;
    if (sector && sector !== "all") params.sector = sector;

    const response = await apiGet<PipelineStagesData>("ats/pipeline/", {
      cookieHeader,
      params,
    });
    return response.data || emptyStages;
  } catch {
    return emptyStages;
  }
}

/**
 * Advance an application through the 5 Kanban stages with event audit log
 */
export async function moveCandidateStageAction(
  applicationId: string,
  toStage: string,
  note?: string
) {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await apiPost(
      "ats/pipeline/",
      {
        application_id: applicationId,
        to_stage: toStage,
        note: note || "",
      },
      { cookieHeader }
    );

    if (response.error) {
      return { success: false, error: response.error.message };
    }

    return { success: true, data: response.data };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to advance stage." };
  }
}

/**
 * Fetch published open requisitions for public job board
 */
export async function getPublicJobsAction(sector?: string, keyword?: string) {
  try {
    const params: Record<string, string | undefined> = {};
    if (sector && sector !== "all") params.sector = sector;
    if (keyword) params.keyword = keyword;

    const response = await apiGet<any[]>("ats/jobs/", { params });
    return Array.isArray(response.data) ? response.data : [];
  } catch {
    return [];
  }
}

/**
 * Fetch detail of a published job requisition
 */
export async function getPublicJobDetailAction(id: string): Promise<PublicJobDetail | null> {
  try {
    const response = await apiGet<PublicJobDetail>(`ats/jobs/${id}/`);
    return response.data || null;
  } catch {
    return null;
  }
}

/**
 * Submit candidate job application to open requisition
 */
export async function applyPublicJobAction(
  id: string,
  payload: {
    full_name: string;
    email: string;
    phone?: string;
    notes?: string;
    portfolio_url?: string;
  }
) {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await apiPost(`ats/jobs/${id}/apply/`, payload, { cookieHeader });
    if (response.error) {
      return { success: false, error: response.error.message };
    }
    return { success: true, data: response.data };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to submit application." };
  }
}

export interface ShortlistSubmissionItemInput {
  candidate_id: string;
  candidate_name: string;
  candidate_title: string;
  sector: string;
  experience: string;
  rate: string;
  match_score: string;
  skills: string[];
  revealed_fields: {
    show_contact: boolean;
    show_vetting: boolean;
    show_rates: boolean;
  };
  masked_contact?: {
    email?: string;
    phone?: string;
  };
  recruiter_notes?: string;
}

export interface ShortlistSubmissionInput {
  requisition_id?: string;
  client_name?: string;
  channel: "email" | "im" | "client_ats" | "portal";
  pitch_notes?: string;
  items: ShortlistSubmissionItemInput[];
}

/**
 * Log and dispatch a candidate shortlist submission package to a client
 */
export async function createShortlistSubmissionAction(input: ShortlistSubmissionInput) {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await apiPost("ats/submissions/", input, { cookieHeader });
    if (response.error) {
      return { success: false, error: response.error.message };
    }
    return { success: true, data: response.data };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to log shortlist submission." };
  }
}

/**
 * Fetch past client shortlist submissions
 */
export async function getShortlistSubmissionsAction(requisitionId?: string) {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const endpoint = requisitionId ? `ats/submissions/?requisition_id=${requisitionId}` : "ats/submissions/";
    const response = await apiGet<any[]>(endpoint, { cookieHeader });
    const list = Array.isArray(response.data) ? response.data : [];
    return list;
  } catch {
    return [];
  }
}

/**
 * Export submission summary in CSV, Markdown text, or JSON
 */
export async function exportShortlistSummaryAction(
  submissionId: string,
  format: "csv" | "text" | "json" = "text"
) {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await apiGet<any>(`ats/submissions/${submissionId}/export/?format=${format}`, {
      cookieHeader,
    });
    if (response.error) {
      return { success: false, error: response.error.message };
    }
    return { success: true, data: response.data };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to export submission." };
  }
}

export interface RecruiterReferralRecord {
  id: string;
  raw_id: string;
  candidate_name: string;
  candidate_email: string;
  candidate_phone?: string;
  candidate_id?: string | null;
  referrer: {
    id: string;
    email: string;
    name: string;
    referral_code: string;
  };
  stage: string;
  stage_display: string;
  requisition_id?: string | null;
  requisition_title: string;
  client_name: string;
  sector: string;
  referral_scope?: string;
  bounty_locked?: boolean;
  bounty_enabled?: boolean;
  bounty_type_name?: string | null;
  bounty_amount: number;
  bounty_status: string;
  bounty_status_display: string;
  date: string;
  created_at: string;
}

export interface RecruiterReferralsData {
  telemetry: {
    total_referrals: number;
    active_in_pipeline: number;
    placed_specialists: number;
    total_bounties_usd: number;
    stage_counts: Record<string, number>;
  };
  records: RecruiterReferralRecord[];
  available_pods?: Array<{
    id: string;
    title: string;
    client_name: string;
    sector: string;
    bounty_enabled?: boolean;
    bounty_type_id?: string | null;
    bounty_type_name?: string | null;
    bounty_amount: number;
    headcount: number;
  }>;
  available_requisitions?: Array<{
    id: string;
    title: string;
    client_name: string;
    sector: string;
    bounty_enabled?: boolean;
    bounty_type_id?: string | null;
    bounty_type_name?: string | null;
    bounty_amount: number;
    headcount: number;
  }>;
}

/**
 * Fetch recruiter referral pipeline and metrics
 */
export async function getRecruiterReferralsAction(
  stage: string = "all",
  search: string = ""
): Promise<RecruiterReferralsData | null> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const params = new URLSearchParams();
    if (stage && stage !== "all") params.set("stage", stage);
    if (search) params.set("search", search);

    const qs = params.toString() ? `?${params.toString()}` : "";
    const response = await apiGet<RecruiterReferralsData>(`referrals/recruiter/${qs}`, {
      cookieHeader,
    });

    if (response.data) {
      return response.data;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Update candidate referral stage, assign to pod requisition, or record bounty note
 */
export async function updateRecruiterReferralAction(input: {
  referralId: string;
  stage: string;
  requisitionId?: string;
  bountyAmount?: number;
  note?: string;
}) {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const payload: Record<string, any> = {
      stage: input.stage,
    };
    if (input.requisitionId) payload.requisition_id = input.requisitionId;
    if (input.bountyAmount !== undefined) payload.bounty_amount = input.bountyAmount;
    if (input.note) payload.note = input.note;

    const response = await apiPatch<any>(
      `referrals/recruiter/${input.referralId}/`,
      payload,
      { cookieHeader }
    );

    if (response.error) {
      return { success: false, error: response.error.message };
    }
    return { success: true, data: response.data };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update referral." };
  }
}

export interface ClientContactItem {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  role_title?: string;
  is_primary?: boolean;
}

export interface ClientItem {
  id: string;
  name: string;
  sector: string;
  website?: string;
  terms?: Record<string, any>;
  delivery_channel: "email" | "im" | "client_ats" | "portal" | string;
  owner?: string;
  owner_name?: string;
  contacts: ClientContactItem[];
  active_requisitions_count: number;
  created_at: string;
  updated_at: string;
}

export interface ClientCreatePayload {
  name: string;
  sector?: string;
  website?: string;
  delivery_channel?: string;
  terms?: Record<string, any>;
  primary_contact_name?: string;
  primary_contact_email?: string;
  primary_contact_phone?: string;
  primary_contact_role?: string;
}

/**
 * Retrieve all Client records for recruiter workspace (ATS-01)
 */
export async function getClientsAction(params?: { sector?: string; search?: string }): Promise<{
  success: boolean;
  data?: ClientItem[];
  error?: string;
}> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    let url = "ats/clients/";
    const query = new URLSearchParams();
    if (params?.sector && params.sector !== "all") query.set("sector", params.sector);
    if (params?.search) query.set("search", params.search);
    const qs = query.toString();
    if (qs) url += `?${qs}`;

    const res = await apiGet<{ data: ClientItem[] } | ClientItem[]>(url, { cookieHeader });
    if (res.error) {
      return { success: false, error: res.error.message };
    }
    const list = Array.isArray(res.data) ? res.data : (res.data as any)?.data || [];
    return { success: true, data: list };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to load clients." };
  }
}

/**
 * Create a new Client record and optional primary contact (ATS-01)
 */
export async function createClientAction(payload: ClientCreatePayload): Promise<{
  success: boolean;
  data?: ClientItem;
  error?: string;
}> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const res = await apiPost<{ data: ClientItem } | ClientItem>("ats/clients/", payload, { cookieHeader });
    if (res.error) {
      return { success: false, error: res.error.message };
    }
    revalidatePath("/recruiter/requisitions");
    revalidatePath("/recruiter/clients");
    revalidatePath("/admin/clients");
    return { success: true, data: (res.data as any)?.data || res.data };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to create client." };
  }
}

/**
 * Update an existing Client record (ATS-01)
 */
export async function updateClientAction(id: string, payload: Partial<ClientCreatePayload>): Promise<{
  success: boolean;
  data?: ClientItem;
  error?: string;
}> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const res = await apiPatch<{ data: ClientItem } | ClientItem>(`ats/clients/${id}/`, payload, { cookieHeader });
    if (res.error) {
      return { success: false, error: res.error.message };
    }
    revalidatePath("/recruiter/requisitions");
    revalidatePath("/recruiter/clients");
    revalidatePath("/admin/clients");
    return { success: true, data: (res.data as any)?.data || res.data };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update client." };
  }
}

/**
 * Recruiter sources a candidate into a requisition pipeline (Stage 2: Market Mapping / Sourced)
 */
export async function sourceCandidateForRequisitionAction(payload: {
  candidate_id: string;
  requisition_id: string;
  note?: string;
}): Promise<{
  success: boolean;
  data?: any;
  error?: string;
}> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const res = await apiPost("ats/candidates/source/", payload, { cookieHeader });
    if (res.error) {
      return { success: false, error: res.error.message };
    }
    revalidatePath("/recruiter/requisitions");
    revalidatePath("/recruiter/candidates");
    return { success: true, data: (res.data as any)?.data || res.data };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to source candidate." };
  }
}

export interface ApplicationSkillItem {
  name: string;
  type: string;
  years_experience: number;
  proficiency: string;
  source: string;
}

export interface ApplicationDocumentItem {
  id: string;
  doc_type: string;
  original_filename: string;
  size_bytes: number;
  scan_status: string;
  uploaded_at: string;
}

export interface ApplicationEventItem {
  id: string;
  from_stage: string;
  to_stage: string;
  sub_stage: string;
  actor_name: string;
  note: string;
  timestamp: string;
}

export interface ApplicationVettingSummary {
  id: string;
  template_id: string;
  template_title: string;
  template_category: string;
  template_sector: string;
  total_marks: number;
  marks_distribution?: Array<{ criterion: string; max_points: number; description?: string }>;
  instructions?: string;
  status: string;
  status_display: string;
  primary_validator_id?: string | null;
  primary_validator_name?: string | null;
  primary_validator_email?: string | null;
  deadline?: string | null;
  scheduled_start?: string | null;
  final_score?: number | null;
  pass_threshold?: number;
  decision_notes?: string;
  recruiter_notes?: string;
  created_at: string;
}

export interface ApplicationDetailData {
  id: string;
  stage: string;
  sub_stage: string;
  source: string;
  applied_at: string;
  updated_at: string;
  candidate: {
    id: string;
    full_name: string;
    email: string;
    phone: string;
    location: string;
    timezone: string;
    sector: string;
    domain: string;
    level: string;
    work_auth: string;
    engagement_prefs: string[];
    expected_comp_min?: number;
    expected_comp_max?: number;
    desired_hourly_rate: string;
    availability_date: string;
    open_to_work: boolean;
    portfolio_url: string;
    github_url: string;
    linkedin_url: string;
    bio: string;
    profile_strength: number;
    cv_score: number;
    vetting_status: string;
    readiness_tier: string;
    skills: ApplicationSkillItem[];
    documents: ApplicationDocumentItem[];
  };
  requisition: {
    id: string;
    title: string;
    sector: string;
    level: string;
    headcount: number;
    budget_min: number;
    budget_max: number;
    location: string;
    engagement: string;
    status: string;
    skills: string[];
    description: string;
    discovery: Record<string, any>;
    client?: {
      id: string;
      name: string;
      sector: string;
      delivery_channel: string;
    } | null;
  };
  rate: string;
  match_score: string;
  events: ApplicationEventItem[];
  placement?: {
    start_date: string;
    rate: string;
    guarantee_until: string;
    checkins?: Record<string, any>;
  } | null;
  vettings?: ApplicationVettingSummary[];
  interviews?: Array<{
    id: string;
    title: string;
    interview_type: string;
    round_number: number;
    scheduled_start: string;
    scheduled_end: string;
    meeting_link: string;
    status: string;
    lead_interviewer: string;
  }>;
}

/**
 * Fetch complete application details for the dedicated inner handling page
 */
export async function getRecruiterApplicationDetailAction(id: string): Promise<{
  success: boolean;
  data?: ApplicationDetailData;
  error?: string;
}> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const res = await apiGet<{ data: ApplicationDetailData } | ApplicationDetailData>(
      `ats/applications/${id}/`,
      { cookieHeader }
    );

    if (res.error) {
      return { success: false, error: res.error.message };
    }

    const item = (res.data as any)?.data || res.data;
    return { success: true, data: item };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to load application details." };
  }
}

/**
 * Update application stage and log note with recruiter signature & stage work
 */
export async function updateRecruiterApplicationStageAction(
  id: string,
  payload: {
    stage: string;
    sub_stage?: string;
    note?: string;
    recruiter_signature?: string;
    vetting_score?: number;
    vetting_track?: string;
    assessment_type?: string;
    interview_format?: string;
    interview_date?: string;
    meeting_link?: string;
    candidate_notes?: string;
    candidate_rate?: string;
    placement_rate?: string;
    placement_start_date?: string;
    rejection_reason?: string;
    [key: string]: any;
  }
): Promise<{

  success: boolean;
  data?: any;
  error?: string;
}> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const res = await apiPatch(`ats/applications/${id}/`, payload, { cookieHeader });
    if (res.error) {
      return { success: false, error: res.error.message };
    }

    revalidatePath("/recruiter/applications");
    revalidatePath(`/recruiter/applications/${id}`);
    return { success: true, data: (res.data as any)?.data || res.data };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update application stage." };
  }
}

/**
 * Append internal recruiter audit note to application timeline
 */
export async function addRecruiterApplicationNoteAction(
  id: string,
  note: string
): Promise<{
  success: boolean;
  data?: ApplicationEventItem;
  error?: string;
}> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const res = await apiPost(`ats/applications/${id}/notes/`, { note }, { cookieHeader });
    if (res.error) {
      return { success: false, error: res.error.message };
    }

    revalidatePath(`/recruiter/applications/${id}`);
    return { success: true, data: (res.data as any)?.data || res.data };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to log note." };
  }
}




// =============================================================================
// VETTING SYSTEM ACTIONS
// =============================================================================

export interface MarksDistributionItem {
  criterion: string;
  max_points: number;
  description?: string;
}

export interface AssessmentTemplateInput {
  title: string;
  category: string;
  sector: string;
  description?: string;
  instructions?: string;
  marks_distribution: MarksDistributionItem[];
  total_marks?: number;
  prerequisites?: string[];
  allowed_validator_roles?: string[];
  is_active?: boolean;
}

export interface AssignVettingInput {
  application: string;
  template: string;
  primary_validator: string;
  secondary_validator_ids?: string[];
  scheduled_start?: string;
  deadline?: string;
  recruiter_notes?: string;
  pass_threshold?: number;
}

export interface CriterionScore {
  criterion: string;
  awarded_points: number;
  max_points: number;
  notes?: string;
}

export interface SubmitAnswerInput {
  vetting: string;
  criterion_scores: CriterionScore[];
  notes?: string;
  attachments?: { label: string; key: string; content_type?: string }[];
  candidate_submission_url?: string;
  candidate_notes?: string;
  is_final_submission?: boolean;
}

export interface SubmitScoreInput {
  score: number;
  verdict: "pass" | "fail";
  feedback?: string;
}

export interface ValidatorItem {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  roles: string[];
  sector: string;
  specialization: string;
  clearance_level: string;
  active_assignments: number;
}

export async function getStaffValidatorsAction(): Promise<{
  success: boolean;
  data?: ValidatorItem[];
  error?: string;
}> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();
    const res = await apiGet<{ data: ValidatorItem[] }>("vetting/validators/", { cookieHeader });
    if (res.error) {
      return { success: false, error: res.error.message };
    }
    const list = Array.isArray(res.data) ? res.data : (res.data as any)?.data || [];
    return { success: true, data: list };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to fetch staff validators." };
  }
}

export async function listAssessmentTemplates(params?: { sector?: string; category?: string }) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  return apiGet("vetting/templates/", { cookieHeader, params: params as Record<string, string> });
}

export async function getAssessmentTemplate(id: string) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  return apiGet(`vetting/templates/${id}/`, { cookieHeader });
}

export async function createAssessmentTemplate(data: AssessmentTemplateInput) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  const result = await apiPost("vetting/templates/", data, { cookieHeader });
  revalidatePath("/recruiter/assessments");
  return result;
}

export async function updateAssessmentTemplate(id: string, data: Partial<AssessmentTemplateInput>) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  const result = await apiPatch(`vetting/templates/${id}/`, data, { cookieHeader });
  revalidatePath("/recruiter/assessments");
  return result;
}

export async function archiveAssessmentTemplate(id: string) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  const result = await apiPost(`vetting/templates/${id}/archive/`, {}, { cookieHeader });
  revalidatePath("/recruiter/assessments");
  return result;
}

export async function listApplicationVettings(params?: { application?: string; template?: string }) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  return apiGet("vetting/vettings/", { cookieHeader, params: params as Record<string, string> });
}

export async function getApplicationVetting(id: string) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  return apiGet(`vetting/vettings/${id}/`, { cookieHeader });
}

export async function assignVetting(data: AssignVettingInput) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  const result = await apiPost("vetting/vettings/", data, { cookieHeader });
  revalidatePath("/recruiter/assessments");
  return result;
}

export async function updateVetting(id: string, data: Partial<AssignVettingInput>) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  return apiPatch(`vetting/vettings/${id}/`, data, { cookieHeader });
}

export async function getVettingAnswers(vettingId: string) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  return apiGet(`vetting/vettings/${vettingId}/answers/`, { cookieHeader });
}

export async function submitVettingAnswer(vettingId: string, data: SubmitAnswerInput) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  return apiPost(`vetting/vettings/${vettingId}/answers/`, data, { cookieHeader });
}

export async function getVettingScore(vettingId: string) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  return apiGet(`vetting/vettings/${vettingId}/score/`, { cookieHeader });
}

export async function submitFinalScore(vettingId: string, data: SubmitScoreInput) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  const result = await apiPost(`vetting/vettings/${vettingId}/score/`, data, { cookieHeader });
  revalidatePath("/recruiter/assessments");
  return result;
}

