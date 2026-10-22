/**
 * Pepoltek Recruiter Mock Data & Typed Interfaces
 * Centralized dataset driving Recruiter Workspace.
 *
 * Rules:
 * - Zero em dashes or en dashes throughout copy
 * - Enterprise-grade precision terminology
 */

export interface RecruiterPod {
  id: string;
  name: string;
  type: "Software Tech" | "Healthcare" | "Dual Sector";
  lead: string;
  size?: string;
  stage?: string;
  velocity?: string;
  members: string[];
  status: "Active Sprint" | "Deployed On-Site" | "Sprint Assembly" | "Client Review";
  sprintProgress: string;
  deploymentDate: string;
  weeklyBudget: string;
  burnRate?: "Optimal" | "Normal" | "Elevated";
}

export interface RecruiterCandidate {
  id: string;
  name: string;
  title: string;
  sector: "Software Tech" | "Healthcare";
  skills: string[];
  experience: string;
  matchScore: string;
  rate: string;
  availability: string;
  verified: boolean;
}

export interface RecruiterInterview {
  id: string;
  candidate: string;
  role: string;
  pod: string;
  time: string;
  type: string;
  panel: string;
  status: "Upcoming" | "Confirmed" | "Scheduled" | "Completed";
}

export interface RecruiterShortlist {
  name: string;
  role: string;
  skills: string[];
  match: string;
  status: string;
  action: string;
}

export const RECRUITER_ACTIVE_PODS: RecruiterPod[] = [
  {
    id: "POD-842",
    name: "Full-Stack High-Frequency Web3 Pod",
    type: "Software Tech",
    lead: "Alex Morgan",
    size: "4 Engineers",
    stage: "Sprint 3 in Progress",
    velocity: "100% On-Track",
    members: ["Sarah Chen (Frontend)", "David Kim (Backend Go)", "Priya Patel (QA Automation)"],
    status: "Active Sprint",
    sprintProgress: "75%",
    deploymentDate: "Sep 15, 2026",
    weeklyBudget: "$14,200",
    burnRate: "Normal",
  },
  {
    id: "POD-719",
    name: "CarePulse Emergency ICU Specialist Rota",
    type: "Healthcare",
    lead: "Dr. Rachel Higgins",
    size: "6 Specialists",
    stage: "Compliance Cleared",
    velocity: "Live Deployed",
    members: ["Nurse S. Lindqvist", "Nurse J. Thompson", "Dr. A. Miller", "Paramedic K. Rowe"],
    status: "Deployed On-Site",
    sprintProgress: "100%",
    deploymentDate: "Sep 01, 2026",
    weeklyBudget: "£18,500",
    burnRate: "Optimal",
  },
  {
    id: "POD-904",
    name: "Cloud Native Kubernetes Migration Pod",
    type: "Software Tech",
    lead: "Devon Reed",
    size: "3 Platform Devs",
    stage: "Architecture Validation",
    velocity: "98% Velocity",
    members: ["Carlos Mendez (Terraform)", "Lin Zhao (Site Reliability)"],
    status: "Sprint Assembly",
    sprintProgress: "40%",
    deploymentDate: "Deploying Oct 5, 2026",
    weeklyBudget: "$9,800",
    burnRate: "Normal",
  },
  {
    id: "POD-611",
    name: "AI Patient Triage Pipeline Pod",
    type: "Dual Sector",
    lead: "Dr. Ethan Wright",
    size: "4 Specialists",
    stage: "Client Review",
    velocity: "95% Velocity",
    members: ["Vikram Singh (ML Engineer)", "Elena Gomez (Clinical Data)"],
    status: "Client Review",
    sprintProgress: "90%",
    deploymentDate: "Deploying Oct 8, 2026",
    weeklyBudget: "$16,000",
    burnRate: "Optimal",
  },
];

export const RECRUITER_SHORTLISTS: RecruiterShortlist[] = [
  {
    name: "David Kim",
    role: "Senior Distributed Backend Engineer",
    skills: ["Go", "Kafka", "Kubernetes", "gRPC"],
    match: "99%",
    status: "Technical Sprint Passed",
    action: "Schedule Pod Presentation",
  },
  {
    name: "Sarah Lindqvist",
    role: "Clinical ICU Specialist Nurse",
    skills: ["NHS Band 7", "NMC Registered", "DBS Enhanced"],
    match: "98%",
    status: "Compliance Verified",
    action: "Add to Hospital Rota",
  },
  {
    name: "Tariq Mansour",
    role: "Principal React / Next.js Architect",
    skills: ["Next.js 15", "TypeScript", "Performance"],
    match: "97%",
    status: "Vetting Tier 1 Cleared",
    action: "Review Pod Availability",
  },
  {
    name: "Dr. Ethan Wright",
    role: "Emergency Medicine Consultant",
    skills: ["FRCA", "ATLS Certified", "Clinical Lead"],
    match: "95%",
    status: "Credentials Confirmed",
    action: "Deploy to NHS Trust",
  },
];

export const RECRUITER_TALENT_POOL: RecruiterCandidate[] = [
  {
    id: "TAL-501",
    name: "Alex Morgan",
    title: "Senior Full-Stack & Pod Delivery Lead",
    sector: "Software Tech",
    skills: ["Next.js 15", "TypeScript", "Node.js", "GraphQL", "Redis"],
    experience: "9 Years",
    matchScore: "99%",
    rate: "$95/hr",
    availability: "Immediate (7-Day Sprint)",
    verified: true,
  },
  {
    id: "TAL-502",
    name: "Dr. Rachel Higgins",
    title: "NHS Band 8 Clinical Specialist Lead",
    sector: "Healthcare",
    skills: ["Critical Care", "GMC Registered", "Clinical Triage", "EHR Systems"],
    experience: "12 Years",
    matchScore: "98%",
    rate: "£85/hr",
    availability: "Immediate",
    verified: true,
  },
  {
    id: "TAL-503",
    name: "David Kim",
    title: "Distributed Systems Go & Rust Engineer",
    sector: "Software Tech",
    skills: ["Go", "Kafka", "Kubernetes", "gRPC", "PostgreSQL"],
    experience: "7 Years",
    matchScore: "96%",
    rate: "$90/hr",
    availability: "Within 5 Days",
    verified: true,
  },
  {
    id: "TAL-504",
    name: "Sarah Lindqvist",
    title: "Specialist Intensive Care Nurse (ICU)",
    sector: "Healthcare",
    skills: ["NHS Band 7", "NMC Registered", "DBS Enhanced", "Emergency Care"],
    experience: "6 Years",
    matchScore: "95%",
    rate: "£55/hr",
    availability: "Immediate",
    verified: true,
  },
  {
    id: "TAL-505",
    name: "Carlos Mendez",
    title: "Cloud Infrastructure & SRE Engineer",
    sector: "Software Tech",
    skills: ["AWS", "Terraform", "Kubernetes", "Docker", "Prometheus"],
    experience: "8 Years",
    matchScore: "94%",
    rate: "$85/hr",
    availability: "2 Weeks Notice",
    verified: true,
  },
  {
    id: "TAL-506",
    name: "Dr. Ethan Wright",
    title: "Emergency Medicine Consultant",
    sector: "Healthcare",
    skills: ["GMC Full Reg", "FRCEM", "ATLS Lead", "Acute Trauma Care"],
    experience: "15 Years",
    matchScore: "97%",
    rate: "£110/hr",
    availability: "Part-Time (Rotas)",
    verified: true,
  },
];

export const RECRUITER_INTERVIEWS: RecruiterInterview[] = [
  {
    id: "INT-102",
    candidate: "Alex Morgan",
    role: "Lead React & TypeScript Architect",
    pod: "FinTech Ledger Pod",
    time: "Today, 3:30 PM BST",
    type: "Pod Technical Sprint Review",
    panel: "Marcus Vance (Pod Lead), Elena Rostova (Hiring VP)",
    status: "Upcoming",
  },
  {
    id: "INT-103",
    candidate: "Dr. Rachel Higgins",
    role: "Clinical ICU Specialist",
    pod: "CarePulse NHS Trust",
    time: "Tomorrow, 11:00 AM BST",
    type: "Clinical Governance & Compliance Check",
    panel: "Dr. Ethan Wright (Medical Director)",
    status: "Confirmed",
  },
  {
    id: "INT-104",
    candidate: "Carlos Mendez",
    role: "Cloud Platform SRE",
    pod: "AeroTech Kubernetes Pod",
    time: "Oct 4, 2:00 PM BST",
    type: "Terraform & EKS Live Architecture Pitch",
    panel: "Devon Reed (DevOps Lead)",
    status: "Scheduled",
  },
];
