"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { apiGet, apiPost, apiPatch, apiDelete } from "@/lib/api";
import {
  RecruiterPod,
  RecruiterCandidate,
  RecruiterInterview,
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
  candidate_name: string;
  candidate_email: string;
  role: string;
  interview_type?: string;
  scheduled_time?: string;
  panel?: string;
  meeting_link?: string;
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
      id: c.id || "CAND-001",
      name: c.name || "Talent Candidate",
      title: c.title || "Specialist",
      sector: c.sector === "Healthcare" ? "Healthcare" : "Software Tech",
      skills: Array.isArray(c.skills) ? c.skills : ["Engineering"],
      experience: c.experience || "Senior Specialist",
      matchScore: c.matchScore || "95%",
      profileStrength: typeof c.profileStrength === "number" ? c.profileStrength : (typeof c.profile_strength === "number" ? c.profile_strength : 88),
      readinessIndex: typeof c.readinessIndex === "number" ? c.readinessIndex : (typeof c.profile_strength === "number" ? c.profile_strength : 88),
      cvScore: typeof c.cvScore === "number" ? c.cvScore : (typeof c.cv_score === "number" ? c.cv_score : 90),
      vettingScore: typeof c.vettingScore === "number" ? c.vettingScore : (typeof c.vetting_score === "number" ? c.vetting_score : 92),
      readinessTier: c.readinessTier || c.readiness_tier || "ready",
      rate: c.rate || "$95/hr",
      availability: c.availability || "Immediate",
      verified: true,
      email: c.email || `${(c.name || "specialist").toLowerCase().replace(/[^a-z0-9]/g, ".")}@talent.pepoltek.com`,
      phone: c.phone || "+1 (555) 382-9104",
      location: c.location || "100% Remote (US/EU)",
      workAuth: c.workAuth || "US Citizen / Green Card",
      engagement: c.engagement || "W2 / C2C / 1099",
      summary: c.summary || `${c.title || "Specialist"} with enterprise deployment experience.`,
    }));
  } catch {
    return [];
  }
}

/**
 * Fetch scheduled sprint interviews
 */
export async function getRecruiterInterviewsAction(): Promise<RecruiterInterview[]> {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await apiGet<any[]>("ats/interviews/", { cookieHeader });
    const rawList = Array.isArray(response.data) ? response.data : [];

    return rawList.map((item: any, idx: number) => ({
      id: item.id || `INT-2026-${String(idx + 1).padStart(3, "0")}`,
      candidate: item.candidate || "Candidate",
      role: item.role || "Specialist Role",
      pod: item.pod || item.role || "Engineering Team",
      time: item.time || "Scheduled This Sprint",
      type: item.type || "Technical Panel Review",
      panel: item.panel || "Lead Architect & Tech Validator",
      status: (item.status as any) || "Confirmed",
    }));
  } catch {
    return [];
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

    return { success: true, data: response.data };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to schedule interview." };
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
 * Update application stage and log note
 */
export async function updateRecruiterApplicationStageAction(
  id: string,
  payload: { stage: string; sub_stage?: string; note?: string }
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



