/**
 * Admin Workspace Types
 * Pure TypeScript interfaces representing administration platform entities,
 * telemetry, user records, compliance frameworks, audit logs, and settings.
 * Zero mock data.
 */

export interface AdminTelemetryMetrics {
  grossPlatformVolume: string;
  grossVolumeGrowth: string;
  activePodsCount: number;
  activePodsCapacity: string;
  vettedTalentCount: number;
  vettedTalentGrowth: string;
  platformUptimeScore: string;
  escrowVaultBalance: string;
  escrowDisbursedThisMonth: string;
  pendingComplianceAudits: number;
}

export type AdminRole =
  | "Candidate"
  | "Recruiter"
  | "Technical Validator"
  | "Business Analyst"
  | "Credential Officer"
  | "Super Admin"
  | "Platform Administrator";

export interface CandidateDossierDetails {
  title: string;
  summary: string;
  yearsExperience: number;
  skills: string[];
  hourlyRate: string;
  readinessIndex: number;
  atsScore: number;
  vettingSubscores: {
    codeQuality: number;
    systemDesign: number;
    testCoverage: number;
    behavioral: number;
  };
  validatorNotes: string;
  workHistory: {
    company: string;
    role: string;
    period: string;
    highlights: string[];
  }[];
  education: string;
  complianceCertifications: {
    name: string;
    status: "Verified" | "Pending";
    date: string;
  }[];
  currentPod?: string;
  podRole?: string;
}

export interface AdminUserRecord {
  id: string;
  raw_id?: string;
  fullName: string;
  email: string;
  role: AdminRole;
  roles?: string[];
  sector: "Technology & SDLC" | "Healthcare & Clinical" | "Platform Operations";
  status: "Active" | "Pending Vetting" | "Suspended";
  vettingScore?: number;
  joinedDate: string;
  lastActive: string;
  assignedPodsCount: number;
  dossier?: CandidateDossierDetails;
}

export interface AdminPodMember {
  userId: string;
  name: string;
  role: string;
  hourlyRate: string;
  weeklyHours: number;
  avatarInitials: string;
  isLead: boolean;
  status: "Active on Sprint" | "Standby" | "Replaced";
}

export interface AdminPodMilestone {
  milestoneNumber: number;
  title: string;
  targetDate: string;
  deliverables: string[];
  status: "Completed" | "In Progress" | "Upcoming";
}

export interface AdminPodClientSponsor {
  name: string;
  role: string;
  email: string;
  monthlyContractValue: string;
  channel: string;
}

export interface AdminPodRecord {
  id: string;
  podName: string;
  clientName: string;
  clientIndustry: string;
  podLeadName: string;
  headcount: string;
  sector: "Technology" | "Healthcare";
  slaScore: string;
  stage: "Sprint 1 Assembly" | "Active Sprint 2" | "Active Sprint 3" | "Client Review" | "Live Deployed";
  stageIndex: number; // 1 to 5
  hourlyRate: string;
  timezoneOverlap: string;
  contractStatus: "Escrow Funded" | "Under Contract" | "In Review";
  squadMembers?: AdminPodMember[];
  milestones?: AdminPodMilestone[];
  clientSponsor?: AdminPodClientSponsor;
}

export interface AdminJobRequisition {
  id: string;
  title: string;
  clientName: string;
  clientIndustry: string;
  sector: "Technology" | "Healthcare";
  requiredHeadcount: number;
  requiredSkills: string[];
  budgetHourlyRate: string;
  timezoneRequirement: string;
  matchedCandidatesCount: number;
  authorizedPitchesCount: number;
  status: "Open for Matching" | "Panel Review" | "Pod Assembled";
  description: string;
  postedDate: string;
  suggestedCandidateNames: string[];
}

export interface ComplianceControlItem {
  code: string;
  title: string;
  status: "Verified & Enforced" | "Scheduled Audit";
  detail: string;
}

export interface AdminComplianceFramework {
  id: string;
  name: string;
  governingBody: string;
  status: "Audited & Fully Compliant" | "Annual Refresh Scheduled" | "Under Review";
  auditScore: string;
  lastAuditDate: string;
  nextRenewalDate: string;
  scope: string;
  auditorOrg: string;
  sha256Fingerprint: string;
  certificateId: string;
  controls: ComplianceControlItem[];
}

export interface AuditLogForensicData {
  sessionId: string;
  userAgent: string;
  geoIpCity: string;
  rawPayload: Record<string, unknown>;
  beforeState?: Record<string, unknown>;
  afterState?: Record<string, unknown>;
}

export interface AdminAuditLogRecord {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: string;
  action: string;
  targetEntity: string;
  ipAddress: string;
  severity: "P0 Critical" | "P1 Security" | "P2 Operational";
  status: "Success" | "Flagged" | "Blocked";
  forensicData?: AuditLogForensicData;
}

export interface InvoiceReceiptBreakdown {
  invoiceNumber: string;
  clientBillingEntity: string;
  clientBillingAddress: string;
  grossDepositAmount: string;
  contractorNetDisbursement: string;
  pepoltekPlatformMargin: string;
  escrowHoldbackDays: number;
  wireReferenceNumber: string;
  clearingBank: string;
}

export interface AdminFinanceRecord {
  id: string;
  transactionType:
    | "Client Escrow Deposit"
    | "Pod Milestone Release"
    | "Referral Bounty Payout"
    | "Platform Placement Fee";
  counterparty: string;
  amount: string;
  date: string;
  status: "Cleared and Settled" | "Escrow Locked" | "Pending Approval";
  associatedPod?: string;
  feeMargin?: string;
  invoiceReceipt?: InvoiceReceiptBreakdown;
}

export interface AdminSystemSettings {
  directHirePlacementFeePercent: number;
  riskFreeTrialDurationWeeks: number;
  guaranteedSprintLatencyDaysMin: number;
  guaranteedSprintLatencyDaysMax: number;
  minimumTimezoneOverlapHours: number;
  referralBountyRewardAmount: number;
  escrowHoldbackDays: number;
  autoVettingPassingScore: number;
}

export interface RecentPlatformEvent {
  id: string;
  timeAgo: string;
  type: "POD_DEPLOYMENT" | "COMPLIANCE_CLEARANCE" | "ESCROW_FUNDING" | "TALENT_VETTING";
  summary: string;
  tag: string;
  actor: string;
}
