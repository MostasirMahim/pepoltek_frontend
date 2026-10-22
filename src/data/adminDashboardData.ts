/**
 * Pepoltek Admin Dashboard Mock Data & Typed Interfaces
 * Master dataset driving the entire Internal Back-Office / Admin Portal.
 * 
 * Rules:
 * - Zero emojis (use prominent Lucide icons in UI components)
 * - Zero em dashes or en dashes throughout copy
 * - Enterprise-grade precision terminology
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
  transactionType: "Client Escrow Deposit" | "Pod Milestone Release" | "Referral Bounty Payout" | "Platform Placement Fee";
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

/* ==========================================================================
   MOCK DATASET INSTANCES
   ========================================================================== */

export const ADMIN_TELEMETRY: AdminTelemetryMetrics = {
  grossPlatformVolume: "$2,480,000",
  grossVolumeGrowth: "+18.4% this quarter",
  activePodsCount: 48,
  activePodsCapacity: "94% Capacity Allocated",
  vettedTalentCount: 1420,
  vettedTalentGrowth: "+124 vetted this month",
  platformUptimeScore: "99.98%",
  escrowVaultBalance: "$485,000.00",
  escrowDisbursedThisMonth: "$310,000.00",
  pendingComplianceAudits: 3,
};

export const ADMIN_USERS: AdminUserRecord[] = [
  {
    id: "USR-101",
    fullName: "Alex Morgan",
    email: "alex.morgan@engineer.com",
    role: "Candidate",
    sector: "Technology & SDLC",
    status: "Active",
    vettingScore: 94,
    joinedDate: "Aug 12, 2026",
    lastActive: "Just now",
    assignedPodsCount: 1,
    dossier: {
      title: "Senior Distributed Systems & Next.js Architect",
      summary: "High-velocity systems architect with 8+ years building sub-millisecond trading pipelines and modern enterprise web frontends.",
      yearsExperience: 8,
      skills: ["Next.js 15", "TypeScript", "Go", "PostgreSQL", "Kafka", "Kubernetes", "Tailwind CSS", "Redis"],
      hourlyRate: "$95 / hr",
      readinessIndex: 88,
      atsScore: 98,
      vettingSubscores: {
        codeQuality: 96,
        systemDesign: 93,
        testCoverage: 91,
        behavioral: 95,
      },
      validatorNotes: "Validated by Marcus Vance: Superb mastery of concurrent Go pipelines and Next.js 15 App Router. Verified top 2% global talent.",
      workHistory: [
        {
          company: "Apex Capital Tech",
          role: "Principal Frontend Architect",
          period: "2023 to Present",
          highlights: [
            "Architected sub-second real-time telemetry dashboard using Next.js 15 and WebSockets.",
            "Reduced client bundle size by 42% and implemented zero-layout-shift UI standards.",
          ],
        },
        {
          company: "CloudScale Systems",
          role: "Senior Backend Engineer",
          period: "2020 to 2023",
          highlights: [
            "Scaled microservices cluster to 250k daily active institutional traders.",
            "Built distributed event sourcing engine using Apache Kafka and PostgreSQL.",
          ],
        },
      ],
      education: "B.Sc. Computer Science, University of Manchester (First Class Honours)",
      complianceCertifications: [
        { name: "UK Right to Work Digital ShareCode", status: "Verified", date: "Aug 2026" },
        { name: "Enterprise IP & Proprietary Assignment", status: "Verified", date: "Aug 2026" },
        { name: "Non-Disclosure Agreement (NDA)", status: "Verified", date: "Aug 2026" },
      ],
      currentPod: "POD-842: FinTech High-Frequency Ledger Pod",
      podRole: "Lead Architect",
    },
  },
  {
    id: "USR-102",
    fullName: "Dr. Rachel Higgins",
    email: "rachel.higgins@clinical.co.uk",
    role: "Candidate",
    sector: "Healthcare & Clinical",
    status: "Active",
    vettingScore: 98,
    joinedDate: "Aug 18, 2026",
    lastActive: "15 mins ago",
    assignedPodsCount: 1,
    dossier: {
      title: "Consultant Critical Care Physician & Clinical Informaticist",
      summary: "NHS-accredited Consultant with 12 years clinical acute medicine and emergency rota management experience across major UK NHS Trusts.",
      yearsExperience: 12,
      skills: ["Acute Medicine", "ICU Triage", "EHR Interoperability", "FHIR Standards", "Clinical Governance", "Safeguarding Level 3"],
      hourlyRate: "£78 / hr",
      readinessIndex: 96,
      atsScore: 99,
      vettingSubscores: {
        codeQuality: 98,
        systemDesign: 97,
        testCoverage: 98,
        behavioral: 99,
      },
      validatorNotes: "Validated by NHS Digital Gateway: Full GMC active specialist registration verified. Flawless 12-year clinical audit record.",
      workHistory: [
        {
          company: "Royal London NHS Trust",
          role: "Consultant in Intensive Care",
          period: "2021 to Present",
          highlights: [
            "Clinical lead for 24-bed critical care unit with 99.4% patient recovery index.",
            "Pioneered clinical digital triage protocol reducing patient admission latency by 35 minutes.",
          ],
        },
      ],
      education: "MBBS Medicine (King's College London), MRCP(UK), FRCA",
      complianceCertifications: [
        { name: "GMC Specialist Registration (Full Licence)", status: "Verified", date: "Aug 2026" },
        { name: "Enhanced DBS Disclosure (Child & Adult)", status: "Verified", date: "Aug 2026" },
        { name: "Medical Indemnity Insurance MDU", status: "Verified", date: "Aug 2026" },
      ],
      currentPod: "POD-719: CarePulse Emergency ICU Specialist Rota",
      podRole: "Clinical Director",
    },
  },
  {
    id: "USR-103",
    fullName: "Marcus Vance",
    email: "marcus.vance@pepoltek.com",
    role: "Technical Validator",
    sector: "Technology & SDLC",
    status: "Active",
    vettingScore: 99,
    joinedDate: "Jun 14, 2026",
    lastActive: "2 mins ago",
    assignedPodsCount: 12,
  },
  {
    id: "USR-104",
    fullName: "Elena Rostova",
    email: "elena.rostova@pepoltek.com",
    role: "Recruiter",
    sector: "Platform Operations",
    status: "Active",
    joinedDate: "Jul 29, 2026",
    lastActive: "1 hour ago",
    assignedPodsCount: 8,
  },
  {
    id: "USR-105",
    fullName: "David Sterling",
    email: "david.sterling@pepoltek.com",
    role: "Technical Validator",
    sector: "Technology & SDLC",
    status: "Active",
    joinedDate: "May 10, 2026",
    lastActive: "3 hours ago",
    assignedPodsCount: 9,
  },
  {
    id: "USR-106",
    fullName: "Sarah Jenkins",
    email: "sarah.jenkins@pepoltek.com",
    role: "Super Admin",
    sector: "Platform Operations",
    status: "Active",
    joinedDate: "Jan 04, 2026",
    lastActive: "Active now",
    assignedPodsCount: 48,
  },
  {
    id: "USR-107",
    fullName: "Carlos Mendez",
    email: "carlos.mendez@cloud.io",
    role: "Candidate",
    sector: "Technology & SDLC",
    status: "Pending Vetting",
    vettingScore: 82,
    joinedDate: "Sep 22, 2026",
    lastActive: "Yesterday",
    assignedPodsCount: 0,
    dossier: {
      title: "Cloud Infrastructure & DevOps Engineer",
      summary: "DevOps engineer specializing in Terraform automation, AWS multi-region setups, and CI/CD pipelines.",
      yearsExperience: 5,
      skills: ["AWS", "Terraform", "Kubernetes", "Docker", "Python", "GitHub Actions"],
      hourlyRate: "$80 / hr",
      readinessIndex: 78,
      atsScore: 85,
      vettingSubscores: {
        codeQuality: 82,
        systemDesign: 80,
        testCoverage: 84,
        behavioral: 82,
      },
      validatorNotes: "Initial screen passed. Awaiting final system design evaluation by David Sterling.",
      workHistory: [
        {
          company: "SaaS Matrix",
          role: "DevOps Engineer",
          period: "2022 to 2026",
          highlights: [
            "Automated infrastructure provisioning across 4 AWS regions with Terraform.",
          ],
        },
      ],
      education: "B.Sc. Software Engineering, Madrid Polytechnic",
      complianceCertifications: [
        { name: "EU Right to Work", status: "Verified", date: "Sep 2026" },
        { name: "AWS Certified DevOps Engineer Pro", status: "Verified", date: "Sep 2026" },
      ],
    },
  },
  {
    id: "USR-108",
    fullName: "Julian Ward",
    email: "julian.ward@financegroup.com",
    role: "Candidate",
    sector: "Technology & SDLC",
    status: "Suspended",
    vettingScore: 61,
    joinedDate: "Jul 11, 2026",
    lastActive: "12 days ago",
    assignedPodsCount: 0,
    dossier: {
      title: "Junior Backend Developer",
      summary: "Backend developer with 2 years building basic REST APIs in Node.js and MongoDB.",
      yearsExperience: 2,
      skills: ["Node.js", "Express", "MongoDB", "JavaScript"],
      hourlyRate: "$45 / hr",
      readinessIndex: 55,
      atsScore: 62,
      vettingSubscores: {
        codeQuality: 60,
        systemDesign: 58,
        testCoverage: 62,
        behavioral: 64,
      },
      validatorNotes: "Failed technical screening threshold (minimum 70 required). Account suspended pending re-application in 90 days.",
      workHistory: [
        {
          company: "Digital Agency",
          role: "Junior Web Developer",
          period: "2024 to 2026",
          highlights: ["Built basic CRUD endpoints."],
        },
      ],
      education: "Full Stack Coding Bootcamp",
      complianceCertifications: [
        { name: "UK Right to Work", status: "Verified", date: "Jul 2026" },
      ],
    },
  },
];

export const ADMIN_PODS: AdminPodRecord[] = [
  {
    id: "POD-842",
    podName: "FinTech High-Frequency Ledger Pod",
    clientName: "Global Capital Markets Ltd",
    clientIndustry: "Financial Services & Asset Custody",
    podLeadName: "Alex Morgan (Lead Architect)",
    headcount: "4 Senior Engineers",
    sector: "Technology",
    slaScore: "99.9%",
    stage: "Active Sprint 3",
    stageIndex: 3,
    hourlyRate: "$95 / hr",
    timezoneOverlap: "6 Hours Live Overlap (US East / UK)",
    contractStatus: "Escrow Funded",
    squadMembers: [
      {
        userId: "USR-101",
        name: "Alex Morgan",
        role: "Lead Architect",
        hourlyRate: "$95 / hr",
        weeklyHours: 40,
        avatarInitials: "AM",
        isLead: true,
        status: "Active on Sprint",
      },
      {
        userId: "USR-201",
        name: "David Chen",
        role: "Senior Go & Concurrency Engineer",
        hourlyRate: "$90 / hr",
        weeklyHours: 40,
        avatarInitials: "DC",
        isLead: false,
        status: "Active on Sprint",
      },
      {
        userId: "USR-202",
        name: "Samantha Reed",
        role: "Database & Kafka Specialist",
        hourlyRate: "$88 / hr",
        weeklyHours: 40,
        avatarInitials: "SR",
        isLead: false,
        status: "Active on Sprint",
      },
      {
        userId: "USR-203",
        name: "Liam O'Connor",
        role: "DevOps & Kubernetes Lead",
        hourlyRate: "$92 / hr",
        weeklyHours: 40,
        avatarInitials: "LO",
        isLead: false,
        status: "Active on Sprint",
      },
    ],
    milestones: [
      {
        milestoneNumber: 1,
        title: "Sub-millisecond WebSocket Order Feed Architecture",
        targetDate: "Sep 14, 2026",
        deliverables: ["Benchmark report under 250 microsecond latency", "Zero-loss failover cluster"],
        status: "Completed",
      },
      {
        milestoneNumber: 2,
        title: "Kafka Event Sourcing & Audit Vault Pipeline",
        targetDate: "Sep 28, 2026",
        deliverables: ["PCI-compliant ledger hashing", "End-to-end load tests at 50,000 tx/sec"],
        status: "Completed",
      },
      {
        milestoneNumber: 3,
        title: "Disaster Recovery Testing & Production Shadow Deployment",
        targetDate: "Oct 12, 2026",
        deliverables: ["Zero-downtime hot swap rehearsal", "Client security compliance audit signoff"],
        status: "In Progress",
      },
    ],
    clientSponsor: {
      name: "Jonathan Vance",
      role: "Chief Technology Officer",
      email: "j.vance@globalcapital.co.uk",
      monthlyContractValue: "$57,000.00 / month",
      channel: "#pepoltek-gcm-sprint-ledger",
    },
  },
  {
    id: "POD-719",
    podName: "CarePulse Emergency ICU Specialist Rota",
    clientName: "CarePulse NHS Foundation Trust",
    clientIndustry: "Healthcare Systems & Hospitals",
    podLeadName: "Dr. Rachel Higgins (Clinical Lead)",
    headcount: "6 Clinical Specialists",
    sector: "Healthcare",
    slaScore: "100%",
    stage: "Live Deployed",
    stageIndex: 5,
    hourlyRate: "£78 / hr",
    timezoneOverlap: "Full UK Core Working Hours",
    contractStatus: "Escrow Funded",
    squadMembers: [
      {
        userId: "USR-102",
        name: "Dr. Rachel Higgins",
        role: "Consultant Physician & Clinical Lead",
        hourlyRate: "£78 / hr",
        weeklyHours: 48,
        avatarInitials: "RH",
        isLead: true,
        status: "Active on Sprint",
      },
      {
        userId: "USR-301",
        name: "Nurse Claire Bennett",
        role: "Senior ICU Staff Nurse Band 7",
        hourlyRate: "£42 / hr",
        weeklyHours: 40,
        avatarInitials: "CB",
        isLead: false,
        status: "Active on Sprint",
      },
      {
        userId: "USR-302",
        name: "Dr. Tariq Al-Mansoor",
        role: "Specialist Registrar Acute Care",
        hourlyRate: "£65 / hr",
        weeklyHours: 48,
        avatarInitials: "TA",
        isLead: false,
        status: "Active on Sprint",
      },
    ],
    milestones: [
      {
        milestoneNumber: 1,
        title: "24-Bed ICU Intensive Care Shift Allocation",
        targetDate: "Sep 01, 2026",
        deliverables: ["100% rota compliance", "Zero unfilled emergency shifts"],
        status: "Completed",
      },
      {
        milestoneNumber: 2,
        title: "Clinical Triage Protocol Digital Integration",
        targetDate: "Sep 20, 2026",
        deliverables: ["EHR FHIR connector verification", "CQC safeguarding signoff"],
        status: "Completed",
      },
    ],
    clientSponsor: {
      name: "Dame Eleanor Cross",
      role: "Director of Clinical Operations",
      email: "e.cross@carepulse.nhs.uk",
      monthlyContractValue: "£46,800.00 / month",
      channel: "#nhs-carepulse-emergency-icu",
    },
  },
  {
    id: "POD-904",
    podName: "Cloud Native Kubernetes Migration Pod",
    clientName: "AeroTech SaaS Systems",
    clientIndustry: "Enterprise Cloud Infrastructure",
    podLeadName: "David Sterling (DevOps Lead)",
    headcount: "3 Platform Devs",
    sector: "Technology",
    slaScore: "98.8%",
    stage: "Active Sprint 2",
    stageIndex: 2,
    hourlyRate: "$88 / hr",
    timezoneOverlap: "5 Hours Live Overlap",
    contractStatus: "Escrow Funded",
  },
  {
    id: "POD-611",
    podName: "AI Patient Triage and FHIR Pipeline Pod",
    clientName: "MedNexus Global Hospital Network",
    clientIndustry: "Healthcare Technology & Med-Tech",
    podLeadName: "Marcus Vance (Engineering Director)",
    headcount: "4 Distributed Engineers",
    sector: "Healthcare",
    slaScore: "99.4%",
    stage: "Sprint 1 Assembly",
    stageIndex: 1,
    hourlyRate: "$92 / hr",
    timezoneOverlap: "4 Hours Live US Central Overlap",
    contractStatus: "Under Contract",
  },
  {
    id: "POD-520",
    podName: "Retail E-Commerce Core Order Engine Pod",
    clientName: "Nordic Commerce Direct",
    clientIndustry: "Retail Enterprise & Logistics",
    podLeadName: "Sarah Lindqvist (Systems Lead)",
    headcount: "5 Full Stack Engineers",
    sector: "Technology",
    slaScore: "99.6%",
    stage: "Client Review",
    stageIndex: 4,
    hourlyRate: "€82 / hr",
    timezoneOverlap: "Full Central European Time Overlap",
    contractStatus: "Escrow Funded",
  },
];

export const ADMIN_JOB_REQUISITIONS: AdminJobRequisition[] = [
  {
    id: "REQ-401",
    title: "Senior Distributed Rust & Next.js Quantitative Pod Lead",
    clientName: "Apex Global Arbitrage LLC",
    clientIndustry: "Quantitative Finance & Trading",
    sector: "Technology",
    requiredHeadcount: 4,
    requiredSkills: ["Rust", "Next.js 15", "WebSockets", "Kafka", "PostgreSQL"],
    budgetHourlyRate: "$105 / hr",
    timezoneRequirement: "US East / London 5 Hours Overlap",
    matchedCandidatesCount: 6,
    authorizedPitchesCount: 3,
    status: "Open for Matching",
    description: "Seeking a 4-person elite squad to construct sub-millisecond market feed visualization and order execution interfaces.",
    postedDate: "Sep 01, 2026",
    suggestedCandidateNames: ["Alex Morgan (94 Vetting)", "Carlos Mendez (82 Vetting)"],
  },
  {
    id: "REQ-402",
    title: "NHS Band 8a Advanced Clinical Practitioner ICU Emergency Team",
    clientName: "St. Thomas & Guy's Hospital NHS Foundation Trust",
    clientIndustry: "Acute Healthcare & Emergency Care",
    sector: "Healthcare",
    requiredHeadcount: 3,
    requiredSkills: ["Critical Care", "GMC Registered", "DBS Enhanced", "FHIR Clinical Triage"],
    budgetHourlyRate: "£82 / hr",
    timezoneRequirement: "UK Core On-Site & Tele-ICU",
    matchedCandidatesCount: 4,
    authorizedPitchesCount: 2,
    status: "Panel Review",
    description: "Urgent winter rota squad required for high-dependency unit triage and telemedicine clinical handovers.",
    postedDate: "Aug 29, 2026",
    suggestedCandidateNames: ["Dr. Rachel Higgins (98 Vetting)"],
  },
  {
    id: "REQ-403",
    title: "AWS Multi-Region Terraform Infrastructure Migration Squad",
    clientName: "LogiMatrix Global Supply Chain",
    clientIndustry: "Logistics & Enterprise Cloud",
    sector: "Technology",
    requiredHeadcount: 3,
    requiredSkills: ["AWS Pro", "Terraform", "Kubernetes", "Datadog"],
    budgetHourlyRate: "$90 / hr",
    timezoneRequirement: "US Pacific & US Central Overlap",
    matchedCandidatesCount: 8,
    authorizedPitchesCount: 4,
    status: "Open for Matching",
    description: "Full cloud modernization program to migrate legacy VMware hypervisors to multi-region AWS EKS clusters.",
    postedDate: "Sep 02, 2026",
    suggestedCandidateNames: ["Carlos Mendez (82 Vetting)", "David Sterling (99 Vetting)"],
  },
  {
    id: "REQ-404",
    title: "FHIR Interoperability & Medical Device Data Connector Pod",
    clientName: "BioNexus Diagnostics Europe",
    clientIndustry: "Medical Devices & Diagnostic Tech",
    sector: "Healthcare",
    requiredHeadcount: 4,
    requiredSkills: ["FHIR v4", "HL7", "Python", "HIPAA Compliance", "PostgreSQL"],
    budgetHourlyRate: "€95 / hr",
    timezoneRequirement: "Central European Time Overlap",
    matchedCandidatesCount: 5,
    authorizedPitchesCount: 2,
    status: "Pod Assembled",
    description: "Connecting bedside monitoring telemetry directly to enterprise hospital Electronic Health Records via secure FHIR protocols.",
    postedDate: "Aug 20, 2026",
    suggestedCandidateNames: ["Marcus Vance (99 Vetting)", "Dr. Rachel Higgins (98 Vetting)"],
  },
];

export const ADMIN_COMPLIANCE_FRAMEWORKS: AdminComplianceFramework[] = [
  {
    id: "COMP-01",
    name: "SOC 2 Type II Remote Governance",
    governingBody: "AICPA Framework",
    status: "Audited & Fully Compliant",
    auditScore: "100% Zero Findings",
    lastAuditDate: "Jul 15, 2026",
    nextRenewalDate: "Jul 14, 2027",
    scope: "Security, Confidentiality, and Availability of Remote Pod Infrastructure",
    auditorOrg: "Deloitte Risk & Assurance",
    sha256Fingerprint: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    certificateId: "AICPA-SOC2-PEPOLTEK-2026-902",
    controls: [
      { code: "CC6.1", title: "Logical Access Controls & Role-Based Scopes", status: "Verified & Enforced", detail: "Multi-factor authentication enforced on 100% internal staff." },
      { code: "CC6.6", title: "Boundary Protection & Zero Exposure Network", status: "Verified & Enforced", detail: "Talent candidate dossiers isolated behind anonymous tokenization." },
      { code: "CC7.1", title: "Vulnerability Scanning & Automated Dependency Audits", status: "Verified & Enforced", detail: "Daily automated CI vulnerability scanners with 0 high findings." },
    ],
  },
  {
    id: "COMP-02",
    name: "HIPAA Protected Health Information (PHI) Vault",
    governingBody: "US Health & Human Services",
    status: "Audited & Fully Compliant",
    auditScore: "99.9% Strict Isolation",
    lastAuditDate: "Aug 02, 2026",
    nextRenewalDate: "Aug 01, 2027",
    scope: "Business Associate Agreements (BAA) and Zero-Data-Leakage Telemetry",
    auditorOrg: "Coalfire Compliance Council",
    sha256Fingerprint: "8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4",
    certificateId: "HIPAA-BAA-PEPOLTEK-2026-118",
    controls: [
      { code: "HIP-01", title: "Business Associate Agreement Mutual Execution", status: "Verified & Enforced", detail: "Standardized BAAs executed with all healthcare client tenants." },
      { code: "HIP-02", title: "PHI Encryption at Rest & In Transit (AES-256)", status: "Verified & Enforced", detail: "Cryptographic envelope encryption on all medical telemetry records." },
      { code: "HIP-03", title: "Audit Trail Logging of PHI Access", status: "Verified & Enforced", detail: "Write-once immutable logging of all healthcare clinician profile views." },
    ],
  },
  {
    id: "COMP-03",
    name: "PCI DSS v4.0 Payment Card Data Tokenization",
    governingBody: "PCI Security Standards Council",
    status: "Audited & Fully Compliant",
    auditScore: "Level 1 Verified",
    lastAuditDate: "Jun 20, 2026",
    nextRenewalDate: "Jun 19, 2027",
    scope: "FinTech Pod Cardholder Data Environment and Encryption at Rest",
    auditorOrg: "Trustwave Security",
    sha256Fingerprint: "ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb",
    certificateId: "PCI-DSS-LEVEL1-PEPOLTEK-2026-440",
    controls: [
      { code: "PCI-3.4", title: "Render Primary Account Numbers (PAN) Unreadable", status: "Verified & Enforced", detail: "Strong one-way hashing and salted tokenization across all FinTech pods." },
      { code: "PCI-8.2", title: "Hardware Security Multi-Factor Authentication", status: "Verified & Enforced", detail: "FIDO2 WebAuthn keys required for all escrow disbursements." },
    ],
  },
  {
    id: "COMP-04",
    name: "UK GMC and NHS Registered Clinical Verification",
    governingBody: "General Medical Council & NHS England",
    status: "Annual Refresh Scheduled",
    auditScore: "100% Verified Practitioners",
    lastAuditDate: "Aug 28, 2026",
    nextRenewalDate: "Nov 30, 2026",
    scope: "Enhanced DBS Checks and Annual Practicing License Validations",
    auditorOrg: "NHS Digital Audit Registry",
    sha256Fingerprint: "fe2592a3913e47557da71af4dd4aacedb08e32125e2e1d161ecd06e50408ee60",
    certificateId: "NHS-GMC-FRAMEWORK-PEPOLTEK-2026-809",
    controls: [
      { code: "GMC-01", title: "Live Daily GMC Specialist Registry Verification", status: "Verified & Enforced", detail: "Automated API pings to GMC registry to verify active practicing licenses." },
      { code: "DBS-02", title: "Enhanced DBS Disclosure with Barred Lists", status: "Verified & Enforced", detail: "Adult and child workforce safeguarding clearance valid through 2027." },
    ],
  },
];

export const ADMIN_AUDIT_LOGS: AdminAuditLogRecord[] = [
  {
    id: "LOG-9401",
    timestamp: "Today, 14:42:10 UTC",
    actorName: "Sarah Jenkins",
    actorRole: "Super Admin",
    action: "Released Milestone #2 Escrow Funds",
    targetEntity: "POD-842 (Global Capital Markets)",
    ipAddress: "192.168.10.45 (VPN Gateway)",
    severity: "P1 Security",
    status: "Success",
    forensicData: {
      sessionId: "sess_admin_9921_root",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AdminOS Shell v2.4",
      geoIpCity: "London, United Kingdom",
      rawPayload: {
        action: "ESCROW_DISBURSEMENT",
        amountCents: 2850000,
        currency: "USD",
        sourceVault: "vault_escrow_gcm_842",
        destinationAccount: "acct_talent_morgan_wire",
        signerId: "USR-106",
        approvalHash: "0x89f2a01bce45d911",
      },
      beforeState: { escrowStatus: "Escrow Locked", disbursedAmount: "$0.00" },
      afterState: { escrowStatus: "Milestone Cleared", disbursedAmount: "$28,500.00" },
    },
  },
  {
    id: "LOG-9400",
    timestamp: "Today, 14:15:22 UTC",
    actorName: "Marcus Vance",
    actorRole: "Technical Validator",
    action: "Updated Hard-Coded Technical Vetting Score (94/100)",
    targetEntity: "Candidate: Alex Morgan (USR-101)",
    ipAddress: "10.0.4.19 (Internal Mesh)",
    severity: "P2 Operational",
    status: "Success",
    forensicData: {
      sessionId: "sess_validator_8819",
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) AppleWebKit/537.36",
      geoIpCity: "Manchester, United Kingdom",
      rawPayload: {
        action: "VETTING_EVALUATION_PERSIST",
        candidateId: "USR-101",
        evaluatorId: "USR-103",
        codeQualityScore: 96,
        systemDesignScore: 93,
        testCoverageScore: 91,
        behavioralScore: 95,
        compositeScore: 94,
        tierUnlocked: "Tier 1: Elite Squad",
      },
    },
  },
  {
    id: "LOG-9399",
    timestamp: "Today, 13:20:05 UTC",
    actorName: "System Daemon",
    actorRole: "Automated Compliance Bot",
    action: "Renewed NHS England GMC Registry Token",
    targetEntity: "Candidate: Dr. Rachel Higgins (USR-102)",
    ipAddress: "127.0.0.1 (Local Daemon)",
    severity: "P2 Operational",
    status: "Success",
    forensicData: {
      sessionId: "daemon_cron_gmc_sync",
      userAgent: "Pepoltek-GMC-Ingress/2.4 (NHS-Digital-Framework)",
      geoIpCity: "Leeds, United Kingdom (NHS Digital Hub)",
      rawPayload: {
        action: "GMC_REGISTRY_PING",
        gmcReferenceNumber: "7402910",
        doctorName: "Dr. Rachel Higgins",
        status: "Registered with Licence to Practise",
        safeguardingCheck: "Clear",
      },
    },
  },
  {
    id: "LOG-9398",
    timestamp: "Yesterday, 22:11:40 UTC",
    actorName: "Elena Rostova",
    actorRole: "Recruiter",
    action: "Created Pod Allocation Brief",
    targetEntity: "POD-611 (MedNexus Global)",
    ipAddress: "172.16.8.12",
    severity: "P2 Operational",
    status: "Success",
  },
  {
    id: "LOG-9397",
    timestamp: "Yesterday, 18:04:19 UTC",
    actorName: "Unknown Attempt",
    actorRole: "Anonymous External",
    action: "Failed Root Administrative Login Attempt",
    targetEntity: "/admin/root-vault",
    ipAddress: "45.134.22.18 (External IP)",
    severity: "P0 Critical",
    status: "Blocked",
    forensicData: {
      sessionId: "unauth_bruteforce_attempt",
      userAgent: "curl/7.88.1 (Unauthorized Scraper Tool)",
      geoIpCity: "Frankfurt, Germany",
      rawPayload: {
        attemptedEndpoint: "/api/admin/root-vault",
        blockedReason: "WAF Rate Limit & Zero Root Public Exposure Policy",
        originIp: "45.134.22.18",
        firewallAction: "DROP_AND_BLACKLIST_24H",
      },
    },
  },
];

export const ADMIN_FINANCE_RECORDS: AdminFinanceRecord[] = [
  {
    id: "FIN-8801",
    transactionType: "Client Escrow Deposit",
    counterparty: "Global Capital Markets Ltd",
    amount: "$57,000.00",
    date: "Sep 28, 2026",
    status: "Cleared and Settled",
    associatedPod: "POD-842",
    feeMargin: "18.5% Net Margin",
    invoiceReceipt: {
      invoiceNumber: "INV-PEPOLTEK-2026-0842",
      clientBillingEntity: "Global Capital Markets Ltd (UK Operations)",
      clientBillingAddress: "25 Bank Street, Canary Wharf, London E14 5JP",
      grossDepositAmount: "$57,000.00",
      contractorNetDisbursement: "$46,455.00",
      pepoltekPlatformMargin: "$10,545.00 (18.5%)",
      escrowHoldbackDays: 7,
      wireReferenceNumber: "CHAPS-WIRE-882190412",
      clearingBank: "Barclays Corporate Banking London",
    },
  },
  {
    id: "FIN-8802",
    transactionType: "Pod Milestone Release",
    counterparty: "Alex Morgan & Pod Engineers",
    amount: "$28,500.00",
    date: "Sep 29, 2026",
    status: "Cleared and Settled",
    associatedPod: "POD-842",
    invoiceReceipt: {
      invoiceNumber: "PAYOUT-POD842-SPRINT2",
      clientBillingEntity: "Pepoltek Escrow Vault Custody",
      clientBillingAddress: "Pepoltek Limited, 10 Fenchurch Avenue, London",
      grossDepositAmount: "$28,500.00",
      contractorNetDisbursement: "$28,500.00",
      pepoltekPlatformMargin: "$0.00 (Settled at Deposit)",
      escrowHoldbackDays: 0,
      wireReferenceNumber: "BACS-DIRECT-771920",
      clearingBank: "HSBC Commercial Settlement",
    },
  },
  {
    id: "FIN-8803",
    transactionType: "Client Escrow Deposit",
    counterparty: "CarePulse NHS Trust",
    amount: "£46,800.00",
    date: "Sep 24, 2026",
    status: "Escrow Locked",
    associatedPod: "POD-719",
    feeMargin: "16.0% Net Margin",
    invoiceReceipt: {
      invoiceNumber: "INV-NHS-CP-2026-719",
      clientBillingEntity: "CarePulse NHS Foundation Trust",
      clientBillingAddress: "NHS Trust Headquarters, Whitechapel Road, London",
      grossDepositAmount: "£46,800.00",
      contractorNetDisbursement: "£39,312.00",
      pepoltekPlatformMargin: "£7,488.00 (16.0%)",
      escrowHoldbackDays: 7,
      wireReferenceNumber: "NHS-PO-9912048",
      clearingBank: "Bank of England Government Banking Service",
    },
  },
  {
    id: "FIN-8804",
    transactionType: "Referral Bounty Payout",
    counterparty: "Alex Morgan (Referrer ID: REF-301)",
    amount: "$500.00",
    date: "Sep 28, 2026",
    status: "Cleared and Settled",
    invoiceReceipt: {
      invoiceNumber: "BOUNTY-REF-301-SETTLED",
      clientBillingEntity: "Pepoltek Growth Community Ledger",
      clientBillingAddress: "Pepoltek Limited, London",
      grossDepositAmount: "$500.00",
      contractorNetDisbursement: "$500.00",
      pepoltekPlatformMargin: "$0.00",
      escrowHoldbackDays: 0,
      wireReferenceNumber: "FAST-PAY-301-884",
      clearingBank: "Stripe Connect Direct Payout",
    },
  },
  {
    id: "FIN-8805",
    transactionType: "Referral Bounty Payout",
    counterparty: "Elena Rostova (Referrer ID: REF-303)",
    amount: "$500.00",
    date: "Sep 30, 2026",
    status: "Pending Approval",
    invoiceReceipt: {
      invoiceNumber: "BOUNTY-REF-303-PENDING",
      clientBillingEntity: "Pepoltek Growth Community Ledger",
      clientBillingAddress: "Pepoltek Limited, London",
      grossDepositAmount: "$500.00",
      contractorNetDisbursement: "$500.00",
      pepoltekPlatformMargin: "$0.00",
      escrowHoldbackDays: 0,
      wireReferenceNumber: "Awaiting Super Admin Approval",
      clearingBank: "Stripe Connect Direct Payout",
    },
  },
];

export const ADMIN_SYSTEM_SETTINGS: AdminSystemSettings = {
  directHirePlacementFeePercent: 18,
  riskFreeTrialDurationWeeks: 2,
  guaranteedSprintLatencyDaysMin: 2,
  guaranteedSprintLatencyDaysMax: 7,
  minimumTimezoneOverlapHours: 4,
  referralBountyRewardAmount: 500,
  escrowHoldbackDays: 7,
  autoVettingPassingScore: 85,
};

export const RECENT_PLATFORM_EVENTS: RecentPlatformEvent[] = [
  {
    id: "EV-01",
    timeAgo: "2 mins ago",
    type: "POD_DEPLOYMENT",
    summary: "Pod #842 (FinTech Ledger) advanced to Sprint 3 by Client: Global Capital Markets",
    tag: "Deployment",
    actor: "Marcus Vance",
  },
  {
    id: "EV-02",
    timeAgo: "14 mins ago",
    type: "COMPLIANCE_CLEARANCE",
    summary: "Dr. Rachel Higgins DBS & GMC enhanced registration re-verified automatically",
    tag: "Compliance",
    actor: "System Daemon",
  },
  {
    id: "EV-03",
    timeAgo: "45 mins ago",
    type: "ESCROW_FUNDING",
    summary: "Apex Health Systems deposited $48,500 into Sprint Escrow Vault",
    tag: "Finance",
    actor: "Sarah Jenkins",
  },
  {
    id: "EV-04",
    timeAgo: "1 hour ago",
    type: "TALENT_VETTING",
    summary: "Alex Morgan completed Next.js 15 Benchmark with 98% percentile score",
    tag: "Talent",
    actor: "Marcus Vance",
  },
];
