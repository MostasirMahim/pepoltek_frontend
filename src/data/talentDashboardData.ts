/**
 * Pepoltek Talent Dashboard Mock Data & Typed Interfaces
 * Master dataset driving the entire Candidate / Talent Workspace.
 * 
 * Rules:
 * - Zero emojis (use prominent Lucide icons in UI components)
 * - Zero em dashes or en dashes throughout copy
 * - Enterprise-grade precision terminology
 */

export interface CandidateProfile {
  id: string;
  fullName: string;
  avatarUrl: string;
  email: string;
  phone: string;
  location: string;
  primaryTrack: "technology" | "healthcare";
  title: string;
  seniority: string;
  primaryDomain: string;
  yearsExperience: number;
  skills: string[];
  visaStatus: string;
  engagementPreference: string;
  desiredHourlyRate: string;
  readinessIndex: number; // 0 to 100
  atsCompatibilityScore: number; // 0 to 100
  technicalVettingScore: number; // 0 to 100
  vettingTier: "Tier 1: Elite Squad" | "Tier 2: Screened Specialist" | "Tier 3: General Talent";
  isOpenToPods: boolean;
  sprintAvailability: string;
  timezoneOverlapHours: number;
  githubUrl?: string;
  linkedinUrl?: string;
  clinicalRegistration?: string;
  bio?: string;
}

export interface SprintPipelineItem {
  id: string;
  podName: string;
  clientName: string;
  clientIndustry: string;
  role: string;
  sector: "Technology" | "Healthcare";
  appliedDate: string;
  currentStage: "Submitted" | "Screened" | "Technical Vetting" | "Client Panel" | "Deployed";
  stageIndex: number; // 1 to 5
  totalStages: number;
  rate: string;
  duration: string;
  startDate: string;
  matchScore: number;
  tag: string;
  timezone: string;
  requiredSkills: string[];
  podLeadName: string;
  stageHistory?: PipelineStageHistory[];
  interviewBrief?: PipelineInterviewBrief;
  contractDetails?: PipelineContractDetails;
}

export interface PipelineStageHistory {
  stageName: string;
  date: string;
  completedBy: string;
  notes: string;
}

export interface PipelineInterviewBrief {
  scheduledAt: string;
  meetingUrl: string;
  interviewerName: string;
  interviewerTitle: string;
  agenda: string;
  preparationTips: string[];
}

export interface PipelineContractDetails {
  rate: string;
  escrowStatus: string;
  guaranteedWeeklyHours: number;
  startDate: string;
  timezoneCoverage: string;
}

export interface UpcomingInterview {
  id: string;
  podName: string;
  dateString: string;
  timeString: string;
  type: string;
  interviewerName: string;
  interviewerTitle: string;
  status: "Confirmed" | "Link Ready" | "Under Review";
  meetingUrl: string;
}

export interface AnonymizedPitchPreview {
  maskedCandidateId: string;
  headline: string;
  yearsExperience: number;
  verifiedPercentile: string;
  vettedSkillsRadar: { skill: string; proficiency: number }[];
  anonymizedProjectImpacts: string[];
}

export interface ReverseSearchMatch {
  id: string;
  clientOrgAnonymized: string;
  sector: "Enterprise IT" | "Healthcare & Med-Tech";
  role: string;
  matchScore: number;
  skillOverlap: string[];
  timezoneOverlap: string;
  compensation: string;
  engagement: "C2C" | "W2 Contract" | "Direct Hire";
  sprintVelocity: string;
  authorized: boolean;
  authorizedAt?: string;
  description: string;
  anonymizedPreview?: AnonymizedPitchPreview;
}

export interface AcademyExamQuiz {
  questions: {
    questionText: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
}

export interface AcademyCourse {
  id: string;
  title: string;
  category: "Software Architecture" | "Healthcare Compliance" | "Enterprise Agile";
  duration: string;
  modulesCount: number;
  completedModules: number;
  progressPercentage: number;
  status: "Completed" | "In Progress" | "Available" | "Locked";
  badgeName: string;
  tierUnlockText: string;
  instructor: string;
  syllabus: string[];
  examQuiz?: AcademyExamQuiz;
}

export interface TalentBadge {
  id: string;
  name: string;
  category: string;
  status: "Active" | "In Progress" | "Locked";
  level: "Tier 1" | "Tier 2" | "Tier 3";
  earnedDate?: string;
  rateBoost: string;
  iconName: string; // references Lucide icon
}

export interface ReferralRecord {
  id: string;
  candidateName: string;
  role: string;
  sector: "Technology" | "Healthcare";
  stage: "Submitted" | "Screened" | "Interviewed" | "Placed & Deployed";
  stageIndex: number; // 1 to 4
  bountyAmount: string;
  payoutStatus: "Cleared for Payout" | "Escrow Locked" | "Pending Placement";
  submittedDate: string;
  payoutDate?: string;
}

export interface BountySummary {
  totalEarned: string;
  clearedPayout: string;
  escrowLocked: string;
  pendingPipeline: string;
  referralLink: string;
  totalReferrals: number;
  placedCount: number;
}

export interface ParsedResumePayload {
  fullName: string;
  email: string;
  phone: string;
  sector: "technology" | "healthcare";
  primaryDomain: string;
  experienceLevel: string;
  skills: string;
  visaStatus: string;
  clinicalRegNumber?: string;
  hourlyExpectation: string;
  extractedYears: number;
  githubUrl?: string;
  missingFields: string[];
  warnings: string[];
}

export interface ChatMessage {
  id: string;
  senderName: string;
  senderRole: string;
  avatarUrl: string;
  isSelf: boolean;
  timestamp: string;
  content: string;
}

export interface AssessmentReport {
  id: string;
  title: string;
  overallScore: number;
  codeQualityScore: number;
  systemDesignScore: number;
  testCoveragePercentage: number;
  behavioralScore: number;
  tierRanking: string;
  evaluatedBy: string;
  evaluationDate: string;
  evaluatorNotes: string;
}

/* ==========================================================================
   MOCK DATASET INSTANCES
   ========================================================================== */

export const CURRENT_TALENT_PROFILE: CandidateProfile = {
  id: "CAND-9042",
  fullName: "Alex Morgan",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  email: "alex.morgan@engineer.com",
  phone: "+1 (415) 890-2341",
  location: "San Francisco, CA (or US Remote)",
  primaryTrack: "technology",
  title: "Lead Distributed Systems & React Architect",
  seniority: "Lead / Architect",
  primaryDomain: "Full Stack Systems & Real-Time Data Pipelines",
  yearsExperience: 9,
  skills: [
    "TypeScript",
    "Next.js 15",
    "Node.js",
    "Go",
    "Kubernetes",
    "Redis",
    "Kafka",
    "PostgreSQL",
    "GraphQL",
    "Docker",
    "AWS",
  ],
  visaStatus: "US Citizen",
  engagementPreference: "Corp-to-Corp (C2C) or W2 Contract",
  desiredHourlyRate: "$95 to $110 / hr",
  readinessIndex: 88,
  atsCompatibilityScore: 98,
  technicalVettingScore: 94,
  vettingTier: "Tier 1: Elite Squad",
  isOpenToPods: true,
  sprintAvailability: "Ready for 7-Day Sprint Deployment",
  timezoneOverlapHours: 5,
  githubUrl: "https://github.com/alexmorgan-systems",
  linkedinUrl: "https://linkedin.com/in/alexmorgan-lead",
};

export const RACHEL_HIGGINS_PROFILE: CandidateProfile = {
  id: "CAND-9088",
  fullName: "Dr. Rachel Higgins",
  avatarUrl: "https://images.unsplash.com/photo-1594824813681-396327e4e138?w=150&auto=format&fit=crop&q=80",
  email: "rachel.higgins@clinical.co.uk",
  phone: "+44 7922 654321",
  location: "London, UK (NHS Framework)",
  primaryTrack: "healthcare",
  title: "Consultant Critical Care Physician & Clinical Director",
  seniority: "Department Lead / Director",
  primaryDomain: "Critical Care ICU Triage & Tele-Health Protocol",
  yearsExperience: 12,
  skills: [
    "Acute Care Medicine",
    "ICU Triage",
    "Clinical Governance",
    "Safeguarding Level 3",
    "EHR Systems",
    "FHIR Standards",
    "Emergency Rota",
    "Tele-ICU",
  ],
  visaStatus: "UK Citizen",
  clinicalRegistration: "GMC-7402910 (Full Licence)",
  engagementPreference: "NHS Framework Bank / Retained Sprintfleet",
  desiredHourlyRate: "£78 to £90 / hr",
  readinessIndex: 96,
  atsCompatibilityScore: 99,
  technicalVettingScore: 98,
  vettingTier: "Tier 1: Elite Squad",
  isOpenToPods: true,
  sprintAvailability: "Immediate NHS Clinical Rota",
  timezoneOverlapHours: 8,
  linkedinUrl: "https://linkedin.com/in/dr-rachel-higgins",
};

export const ACTIVE_SPRINT_PIPELINES: SprintPipelineItem[] = [
  {
    id: "REQ-842",
    podName: "FinTech High-Frequency Ledger Team",
    clientName: "Global Capital Markets Ltd",
    clientIndustry: "Financial Services & Asset Custody",
    role: "Lead React & Low-Latency Systems Architect",
    sector: "Technology",
    appliedDate: "Sep 28, 2026",
    currentStage: "Technical Vetting",
    stageIndex: 3,
    totalStages: 5,
    rate: "$95 / hr",
    duration: "6 Months Rolling",
    startDate: "Within 4 Days",
    matchScore: 99,
    tag: "99% High Compatibility",
    timezone: "4 Hours Live US Eastern Overlap",
    requiredSkills: ["Next.js 15", "TypeScript", "WebSocket", "Redis", "Kafka"],
    podLeadName: "Marcus Vance (Engineering Director)",
    stageHistory: [
      {
        stageName: "1. Submitted",
        date: "Sep 28, 2026, 09:15 UTC",
        completedBy: "System Ingress Match Engine",
        notes: "Automated candidate match score 99% via Skill Matrix Engine.",
      },
      {
        stageName: "2. Screened",
        date: "Sep 28, 2026, 11:30 UTC",
        completedBy: "Elena Rostova (Lead Recruiter)",
        notes: "Profile verified for 6-hour US East / London timezone overlap. Technical communication rated 5/5.",
      },
      {
        stageName: "3. Technical Vetting",
        date: "Sep 29, 2026, 14:00 UTC",
        completedBy: "Marcus Vance (Engineering Director)",
        notes: "Live code benchmark completed with 94/100 composite score. Next.js 15 App Router concurrency verified.",
      },
    ],
    interviewBrief: {
      scheduledAt: "Tomorrow at 3:30 PM EST (15:30 UTC)",
      meetingUrl: "https://meet.pepoltek.com/interview-842-audit",
      interviewerName: "Jonathan Vance",
      interviewerTitle: "Chief Technology Officer, Global Capital Markets",
      agenda: "30-minute architectural sync covering distributed ledger throughput and 7-day deployment onboarding.",
      preparationTips: [
        "Be ready to explain your low-latency WebSocket buffer handling architecture.",
        "Highlight your experience scaling microservices in financial or real-time domains.",
        "Review the client public API specifications on sub-second order routing.",
      ],
    },
    contractDetails: {
      rate: "$95.00 / hr Guaranteed",
      escrowStatus: "100% Escrow Funded in Vault ($57,000.00)",
      guaranteedWeeklyHours: 40,
      startDate: "Within 4 Days",
      timezoneCoverage: "13:00 to 19:00 UTC (Core US East / UK Live Overlap)",
    },
  },
  {
    id: "REQ-719",
    podName: "NHS Clinical Interoperability Team",
    clientName: "CarePulse NHS Foundation Trust",
    clientIndustry: "Healthcare Systems & Hospital Networks",
    role: "Senior Backend Node.js & FHIR v4 Specialist",
    sector: "Healthcare",
    appliedDate: "Sep 24, 2026",
    currentStage: "Client Panel",
    stageIndex: 4,
    totalStages: 5,
    rate: "£78 / hr",
    duration: "12 Months Fixed",
    startDate: "Next Monday",
    matchScore: 96,
    tag: "Priority Clinical Sprint",
    timezone: "Full UK Core Hours (8 Hours)",
    requiredSkills: ["Node.js", "FHIR API", "PostgreSQL", "Docker", "HIPAA / GMC Compliance"],
    podLeadName: "Dr. Rachel Higgins (Clinical Integration Director)",
    stageHistory: [
      {
        stageName: "1. Submitted",
        date: "Sep 24, 2026",
        completedBy: "System Ingress",
        notes: "Priority NHS ICU Clinical Vacancy matched.",
      },
      {
        stageName: "2. Screened",
        date: "Sep 24, 2026",
        completedBy: "David Sterling (Healthcare Recruiter)",
        notes: "GMC active registration and Enhanced DBS verified automatically.",
      },
      {
        stageName: "3. Technical Vetting",
        date: "Sep 25, 2026",
        completedBy: "Clinical Governance Board",
        notes: "Safeguarding Level 3 and acute resuscitation competencies cleared.",
      },
      {
        stageName: "4. Client Panel",
        date: "Sep 27, 2026",
        completedBy: "Dame Eleanor Cross (Clinical Operations)",
        notes: "Clinical triage protocol alignment call scheduled.",
      },
    ],
    interviewBrief: {
      scheduledAt: "Oct 01, 2026 at 11:00 AM BST",
      meetingUrl: "https://meet.pepoltek.com/nhs-carepulse-719",
      interviewerName: "Dame Eleanor Cross",
      interviewerTitle: "Director of Clinical Operations, CarePulse NHS Trust",
      agenda: "20-minute clinical rota walkthrough and emergency telemedicine triage protocol briefing.",
      preparationTips: [
        "Confirm your Enhanced DBS certificate number.",
        "Review the CarePulse 24-bed ICU emergency escalation protocol.",
      ],
    },
    contractDetails: {
      rate: "£78.00 / hr Guaranteed",
      escrowStatus: "100% NHS Framework PO Secured (£46,800.00)",
      guaranteedWeeklyHours: 48,
      startDate: "Next Monday",
      timezoneCoverage: "Full UK Core Working Hours",
    },
  },
  {
    id: "REQ-904",
    podName: "Cloud Migration & Kubernetes Team",
    clientName: "AeroTech Distributed Systems",
    clientIndustry: "Enterprise Cloud Infrastructure",
    role: "Cloud Native Kubernetes SRE",
    sector: "Technology",
    appliedDate: "Sep 20, 2026",
    currentStage: "Screened",
    stageIndex: 2,
    totalStages: 5,
    rate: "$88 / hr",
    duration: "3 Months Sprint",
    startDate: "Immediate",
    matchScore: 94,
    tag: "Instant Deploy",
    timezone: "5 Hours Live Overlap",
    requiredSkills: ["AWS EKS", "Terraform", "Kubernetes", "Prometheus", "CI/CD"],
    podLeadName: "David Sterling (DevOps Lead)",
  },
];

export const UPCOMING_INTERVIEWS: UpcomingInterview[] = [
  {
    id: "INT-101",
    podName: "FinTech High-Frequency Ledger Team",
    dateString: "Today, Sep 30",
    timeString: "3:30 PM EST",
    type: "Live System Design & Concurrency Audit (45 min)",
    interviewerName: "Marcus Vance",
    interviewerTitle: "In-House Engineering Director",
    status: "Confirmed",
    meetingUrl: "https://meet.pepoltek.com/interview-842-audit",
  },
  {
    id: "INT-102",
    podName: "NHS Clinical Interoperability Team",
    dateString: "Tomorrow, Oct 01",
    timeString: "11:00 AM BST",
    type: "HIPAA & FHIR Schema Integration Review (30 min)",
    interviewerName: "Dr. Rachel Higgins",
    interviewerTitle: "Clinical Operations Lead",
    status: "Link Ready",
    meetingUrl: "https://meet.pepoltek.com/nhs-carepulse-719",
  },
];

export const REVERSE_SEARCH_MATCHES: ReverseSearchMatch[] = [
  {
    id: "REV-881",
    clientOrgAnonymized: "Tier 1 Global Investment Bank",
    sector: "Enterprise IT",
    role: "Senior Distributed Trading Systems Architect",
    matchScore: 99,
    skillOverlap: ["Next.js 15", "TypeScript", "WebSocket", "Redis", "Kafka", "Docker"],
    timezoneOverlap: "6 Hours Live Standup Overlap (US East / UK)",
    compensation: "$95 to $115 / hr (or $140k to $170k / yr)",
    engagement: "C2C",
    sprintVelocity: "7-Day Sprint Kickoff",
    authorized: true,
    authorizedAt: "Sep 29, 2026, 14:15",
    description:
      "Enterprise digital trading platform modernizing their multi-asset order execution engine with reactive microservices and real-time streaming interfaces.",
    anonymizedPreview: {
      maskedCandidateId: "SPECIALIST #AM-94",
      headline: "Senior Distributed Systems & Next.js Architect (Top 2% Global)",
      yearsExperience: 9,
      verifiedPercentile: "98th Percentile in System Concurrency",
      vettedSkillsRadar: [
        { skill: "Next.js 15 & Server Actions", proficiency: 98 },
        { skill: "Go & Low-Latency Microservices", proficiency: 96 },
        { skill: "Distributed Event Sourcing (Kafka)", proficiency: 94 },
        { skill: "Kubernetes & Multi-Cloud SRE", proficiency: 92 },
      ],
      anonymizedProjectImpacts: [
        "Architected sub-millisecond market feed visualization handling 50k events/second.",
        "Cut client bundle size by 42% with zero layout shift enterprise standards.",
        "Guaranteed 6-hour daily live timezone overlap with client London and New York engineering teams.",
      ],
    },
  },
  {
    id: "REV-882",
    clientOrgAnonymized: "NHS Partner Hospital Trust",
    sector: "Healthcare & Med-Tech",
    role: "Health-Tech FHIR & EHR Interoperability Lead",
    matchScore: 96,
    skillOverlap: ["Node.js", "FHIR API", "PostgreSQL", "Docker", "HIPAA Data Standards"],
    timezoneOverlap: "Full UK Core Working Hours",
    compensation: "£78 to £90 / hr",
    engagement: "Direct Hire",
    sprintVelocity: "Immediate 2-Week Deployment",
    authorized: false,
    description:
      "Connecting regional hospital inpatient medical records with national triage registries through secure, zero-leakage FHIR v4 pipelines.",
    anonymizedPreview: {
      maskedCandidateId: "SPECIALIST #RH-98",
      headline: "Consultant Informaticist & Clinical Director (NHS Accredited)",
      yearsExperience: 12,
      verifiedPercentile: "99th Percentile in Acute Clinical Triage",
      vettedSkillsRadar: [
        { skill: "EHR Interoperability & FHIR v4", proficiency: 99 },
        { skill: "Acute Care ICU Governance", proficiency: 98 },
        { skill: "Safeguarding Level 3 Protocols", proficiency: 99 },
        { skill: "Tele-ICU Digital Workflow", proficiency: 95 },
      ],
      anonymizedProjectImpacts: [
        "Clinical lead for 24-bed ICU rota with 100% statutory compliance.",
        "Pioneered digital triage system cutting emergency admission latency by 35 minutes.",
        "Full GMC Specialist Register Licence and Enhanced DBS cleared.",
      ],
    },
  },
  {
    id: "REV-883",
    clientOrgAnonymized: "Series B Health-Tech Telemedicine Provider",
    sector: "Healthcare & Med-Tech",
    role: "WebRTC Audio/Video Streaming Lead",
    matchScore: 95,
    skillOverlap: ["TypeScript", "WebRTC", "Node.js", "AWS", "Security Best Practices"],
    timezoneOverlap: "4 Hours Live US Central Overlap",
    compensation: "$90 to $105 / hr",
    engagement: "W2 Contract",
    sprintVelocity: "14-Day Sprint",
    authorized: false,
    description:
      "Scaling encrypted clinical video consultations for over 50,000 daily active patient appointments across North America.",
  },
  {
    id: "REV-884",
    clientOrgAnonymized: "High-Growth FinTech Infrastructure Firm",
    sector: "Enterprise IT",
    role: "Platform Engineer & Kubernetes Specialist",
    matchScore: 92,
    skillOverlap: ["AWS EKS", "Terraform", "Kubernetes", "Prometheus", "Datadog"],
    timezoneOverlap: "5 Hours Live Overlap",
    compensation: "$85 to $100 / hr",
    engagement: "C2C",
    sprintVelocity: "7-Day Sprint Kickoff",
    authorized: true,
    authorizedAt: "Sep 28, 2026, 09:30",
    description:
      "Automating multi-cloud deployment clusters for real-time payment settlement engines operating under SOC 2 Type II controls.",
  },
];

export const ACADEMY_COURSES: AcademyCourse[] = [
  {
    id: "ACAD-101",
    title: "Distributed Systems & RAG Architecture",
    category: "Software Architecture",
    duration: "6 Modules (4.5 Hours)",
    modulesCount: 6,
    completedModules: 6,
    progressPercentage: 100,
    status: "Completed",
    badgeName: "RAG Delivery Lead Badge",
    tierUnlockText: "Unlocks Tier 1 $100+/hr Enterprise Requisitions",
    instructor: "Marcus Vance (Engineering Director)",
    syllabus: [
      "Microservice Orchestration with Go and Kafka",
      "Vector Search Indexing and Embeddings Optimization",
      "Low-Latency Event-Driven API Gateways",
      "Resilience Engineering and Chaos Testing in Kubernetes",
      "Live Concurrency Audits and Zero-Downtime Migration",
      "Production Deployment Blueprint Defense",
    ],
    examQuiz: {
      questions: [
        {
          questionText: "Which architecture pattern ensures zero-downtime hot swapping in distributed event-driven microservices?",
          options: [
            "Synchronous REST pooling with polling loops",
            "Event sourcing with append-only ledger and consumer group offset replay",
            "Single-instance database table locks",
            "In-memory local variables without persistence",
          ],
          correctIndex: 1,
          explanation: "Event sourcing with consumer group offsets allows standby nodes to replay events and achieve hot-standby failover with zero state loss.",
        },
        {
          questionText: "How does Next.js 15 App Router handle server action concurrency during rapid user interactions?",
          options: [
            "It drops previous requests and shows a browser error",
            "It queues and streams mutations via React 19 Server Actions with optimistic state rollbacks",
            "It reloads the entire HTML document on every action",
            "It blocks the main UI thread synchronously",
          ],
          correctIndex: 1,
          explanation: "React 19 and Next.js 15 utilize non-blocking streaming transitions with optimistic state transitions and automatic reconciliation.",
        },
        {
          questionText: "What is Pepoltek's core requirement for remote engineering teams delivering into US/UK enterprises?",
          options: [
            "Zero communication during the week",
            "Mandatory 4 to 6 hours daily synchronous standup overlap and asynchronous documentation",
            "Only weekend deployment windows",
            "Unmanaged individual billing without sprint milestones",
          ],
          correctIndex: 1,
          explanation: "Pepoltek guarantees a minimum 4 to 6 hours daily live timezone overlap for seamless pair programming and daily standup integration.",
        },
      ],
    },
  },
  {
    id: "ACAD-102",
    title: "HIPAA & PCI DSS Compliance for Engineers & Clinicians",
    category: "Healthcare Compliance",
    duration: "4 Modules (3.0 Hours)",
    modulesCount: 4,
    completedModules: 3,
    progressPercentage: 75,
    status: "In Progress",
    badgeName: "HIPAA Certified Healthcare Specialist",
    tierUnlockText: "Unlocks Hospital Network & EMR Integration Roles",
    instructor: "Dr. Rachel Higgins (Clinical Operations Lead)",
    syllabus: [
      "Protected Health Information (PHI) Encryption Standards",
      "Business Associate Agreement (BAA) Operational Protocols",
      "FHIR v4 and HL7 Interoperability Constraints",
      "Access Control Auditing and Breach Containment Protocols",
    ],
    examQuiz: {
      questions: [
        {
          questionText: "Under HIPAA and SOC 2 Type II, what is required when transmitting Protected Health Information (PHI)?",
          options: [
            "Plain text HTTP with no certificate validation",
            "Mandatory cryptographic TLS 1.3 encryption in transit and AES-256 encryption at rest",
            "Unauthenticated file sharing via public links",
            "Statically hardcoded master keys in source control",
          ],
          correctIndex: 1,
          explanation: "HIPAA Security Rule requires end-to-end encryption using robust cryptographic protocols both at rest and in transit.",
        },
        {
          questionText: "What is the function of a Business Associate Agreement (BAA)?",
          options: [
            "A personal social media contract",
            "A legally binding contract establishing mutual liability and strict safeguarding of PHI between Pepoltek and enterprise clients",
            "A marketing brochure for prospective candidates",
            "An invoice receipt for contractor expense reimbursements",
          ],
          correctIndex: 1,
          explanation: "A BAA binds vendors and contractors to statutory healthcare privacy compliance under HHS federal oversight.",
        },
      ],
    },
  },
  {
    id: "ACAD-103",
    title: "US Enterprise Sprints & High-Velocity Standups",
    category: "Enterprise Agile",
    duration: "3 Modules (2.0 Hours)",
    modulesCount: 3,
    completedModules: 1,
    progressPercentage: 33,
    status: "In Progress",
    badgeName: "US Enterprise Sprint Ready",
    tierUnlockText: "Unlocks Tier 1 Direct US Client Panels",
    instructor: "Sarah Sterling (Delivery Operations Director)",
    syllabus: [
      "Synchronous Live Standup Cadence Across 4 Longitudes",
      "Asynchronous Technical Documentation in High-Growth Squads",
      "Sprint Velocity Metrics and Code Review SLAs",
    ],
    examQuiz: {
      questions: [
        {
          questionText: "How are blockers communicated during high-velocity 7-day deployment sprints?",
          options: [
            "Wait until the end of the sprint review",
            "Escalate immediately on the dedicated Slack/Teams project channel with clear reproducer steps",
            "Ignore the blocker and work on another feature",
            "Email customer support anonymously",
          ],
          correctIndex: 1,
          explanation: "Rapid escalation on the sprint channel ensures the team lead and client sponsor can resolve dependencies with zero latency.",
        },
      ],
    },
  },
  {
    id: "ACAD-104",
    title: "Kubernetes Multi-Cloud Zero-Trust Architecture",
    category: "Software Architecture",
    duration: "5 Modules (4.0 Hours)",
    modulesCount: 5,
    completedModules: 0,
    progressPercentage: 0,
    status: "Available",
    badgeName: "Cloud Security Specialist",
    tierUnlockText: "Unlocks Fortune 500 Infrastructure Requisitions",
    instructor: "David Sterling (DevOps Lead)",
    syllabus: [
      "Zero-Trust Service Mesh with Istio",
      "Automated Secrets Rotation and Vault Integration",
      "Infrastructure as Code Auditing with Terraform",
      "Hardened Ingress Gateways and Mutual TLS",
      "Disaster Recovery and Multi-Region Failover",
    ],
  },
];

export const TALENT_BADGES: TalentBadge[] = [
  {
    id: "BADGE-01",
    name: "Verified Next.js 15 Architect",
    category: "Frontend & Full Stack",
    status: "Active",
    level: "Tier 1",
    earnedDate: "Aug 14, 2026",
    rateBoost: "+$15 / hr Billing Premium",
    iconName: "Code2",
  },
  {
    id: "BADGE-02",
    name: "RAG Delivery Lead",
    category: "AI & Distributed Systems",
    status: "Active",
    level: "Tier 1",
    earnedDate: "Sep 10, 2026",
    rateBoost: "+$20 / hr Billing Premium",
    iconName: "Cpu",
  },
  {
    id: "BADGE-03",
    name: "HIPAA Healthcare Specialist",
    category: "Healthcare Compliance",
    status: "In Progress",
    level: "Tier 2",
    rateBoost: "Unlocks Hospital Network Roles",
    iconName: "ShieldCheck",
  },
  {
    id: "BADGE-04",
    name: "US Enterprise Sprint Ready",
    category: "Agile Operations",
    status: "In Progress",
    level: "Tier 2",
    rateBoost: "Guaranteed Client Interview Scheduling",
    iconName: "Clock",
  },
  {
    id: "BADGE-05",
    name: "Cloud Security Specialist",
    category: "Cloud & DevSecOps",
    status: "Locked",
    level: "Tier 3",
    rateBoost: "Unlocks Enterprise Infrastructure Squads",
    iconName: "Lock",
  },
];

export const REFERRAL_RECORDS: ReferralRecord[] = [
  {
    id: "REF-301",
    candidateName: "David Kim",
    role: "Senior Go & Kafka Systems Engineer",
    sector: "Technology",
    stage: "Placed & Deployed",
    stageIndex: 4,
    bountyAmount: "$500.00",
    payoutStatus: "Cleared for Payout",
    submittedDate: "Sep 02, 2026",
    payoutDate: "Sep 28, 2026",
  },
  {
    id: "REF-302",
    candidateName: "Sarah Lindqvist",
    role: "NHS Band 7 ICU Clinical Specialist",
    sector: "Healthcare",
    stage: "Placed & Deployed",
    stageIndex: 4,
    bountyAmount: "$500.00",
    payoutStatus: "Cleared for Payout",
    submittedDate: "Aug 22, 2026",
    payoutDate: "Sep 15, 2026",
  },
  {
    id: "REF-303",
    candidateName: "Carlos Mendez",
    role: "Cloud DevOps & Platform Engineer",
    sector: "Technology",
    stage: "Interviewed",
    stageIndex: 3,
    bountyAmount: "$500.00",
    payoutStatus: "Escrow Locked",
    submittedDate: "Sep 18, 2026",
  },
  {
    id: "REF-304",
    candidateName: "Elena Rostova",
    role: "EHR Medical Billing & Coding Director",
    sector: "Healthcare",
    stage: "Screened",
    stageIndex: 2,
    bountyAmount: "$500.00",
    payoutStatus: "Pending Placement",
    submittedDate: "Sep 27, 2026",
  },
];

export const BOUNTY_SUMMARY: BountySummary = {
  totalEarned: "$1,500.00",
  clearedPayout: "$1,000.00",
  escrowLocked: "$500.00",
  pendingPipeline: "$500.00",
  referralLink: "https://pepoltek.com/join?ref=AMORGAN-882",
  totalReferrals: 4,
  placedCount: 2,
};

export const INITIAL_PARSED_RESUME: ParsedResumePayload = {
  fullName: "Alex Morgan",
  email: "alex.morgan@engineer.com",
  phone: "+1 (415) 890-2341",
  sector: "technology",
  primaryDomain: "Full Stack Systems & Real-Time Data Pipelines",
  experienceLevel: "Lead / Architect",
  skills: "Next.js 15, TypeScript, Node.js, Go, Redis, Kafka, Docker, Kubernetes, PostgreSQL",
  visaStatus: "US Citizen",
  hourlyExpectation: "$95 to $110 / hr",
  extractedYears: 9,
  missingFields: [
    "Government Identification or Right-to-Work Documentation Attachment",
  ],
  warnings: [
    "Optional: Add your GitHub profile link to boost technical vetting ranking from Tier 2 to Tier 1.",
  ],
};

export const CHAT_MESSAGES: ChatMessage[] = [
  {
    id: "MSG-01",
    senderName: "Marcus Vance",
    senderRole: "Engineering Director",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    isSelf: false,
    timestamp: "Yesterday, 14:20",
    content:
      "Hello Alex. Your code benchmark scores on the Next.js 15 and Kafka architectural audit were exemplary (94/100). Global Capital Markets is keen to finalize your squad allocation for Monday's sprint kickoff.",
  },
  {
    id: "MSG-02",
    senderName: "Alex Morgan",
    senderRole: "Lead Architect",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    isSelf: true,
    timestamp: "Yesterday, 14:35",
    content:
      "Thank you Marcus. I have reviewed their technical brief. The 4-hour live overlap window fits my schedule perfectly. I am ready to join the standup as scheduled.",
  },
  {
    id: "MSG-03",
    senderName: "Marcus Vance",
    senderRole: "Engineering Director",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    isSelf: false,
    timestamp: "Today, 10:15",
    content:
      "Excellent. The repository invite and temporary credentials have been generated and will be unlocked upon final confirmation today at 3:30 PM EST.",
  },
];

export const TALENT_ASSESSMENT_REPORT: AssessmentReport = {
  id: "ASSESS-881",
  title: "Hard-Coded Technical Vetting & Concurrency Audit",
  overallScore: 94,
  codeQualityScore: 96,
  systemDesignScore: 93,
  testCoveragePercentage: 91,
  behavioralScore: 95,
  tierRanking: "Tier 1: Elite Engineering Squad",
  evaluatedBy: "Marcus Vance & Pepoltek Technical Validation Council",
  evaluationDate: "Sep 26, 2026",
  evaluatorNotes:
    "Candidate demonstrates senior architectural command over asynchronous messaging (Kafka), event-driven microservices, and React Server Components. Clean documentation style and proactive communication.",
};
