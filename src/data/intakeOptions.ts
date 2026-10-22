/**
 * Pepoltek Intake & Onboarding Configuration Schema
 * Centralized dataset providing unique ID-driven options for Candidate Onboarding.
 *
 * Design Invariant:
 * - Every single item has an immutable unique string `id`.
 * - In the future, Admin CRUD will update labels and metadata without breaking
 *   stored references in candidate profiles.
 * - Zero em dashes or en dashes throughout copy.
 */

export interface BaseOption {
  id: string;
  label: string;
  description?: string;
}

export interface SectorOption extends BaseOption {
  code: "technology" | "healthcare";
  badge: string;
  iconName: string;
  headline: string;
}

export interface DomainOption extends BaseOption {
  sectorId: "technology" | "healthcare";
  recommendedSkills: string[];
}

export interface SkillOption extends BaseOption {
  sectorId: "technology" | "healthcare";
  domainId?: string;
  category?: string;
  isPopular?: boolean;
}

export interface SeniorityOption extends BaseOption {
  sectorId: "technology" | "healthcare";
  yearsRange: string;
  canonicalLevel: "junior" | "mid" | "senior" | "lead" | "director" | "c_level";
}

export interface WorkAuthOption extends BaseOption {
  canonicalAuth: "us_citizen" | "green_card" | "h1b" | "opt" | "international_remote";
  region: "US" | "UK" | "EU" | "Global";
}

export interface EngagementOption extends BaseOption {
  canonicalEngagement: "w2" | "c2c" | "1099" | "direct_hire";
  badge: string;
}

// --------------------------------------------------------------------------
// 1. SECTORS
// --------------------------------------------------------------------------
export const INTAKE_SECTORS: SectorOption[] = [
  {
    id: "sec-technology",
    code: "technology",
    label: "Technology & Software Engineering",
    headline: "Full-Stack, Cloud Architecture, AI/MLOps & Distributed Systems",
    badge: "Enterprise Pods",
    iconName: "Zap",
    description: "Deployment to high-frequency engineering squads with verified timezone overlap and 7-day velocity.",
  },
  {
    id: "sec-healthcare",
    code: "healthcare",
    label: "Healthcare & Clinical Specialists",
    headline: "Acute Care, Tele-health, ICU Specialties & EHR Systems",
    badge: "Clinical Rotas",
    iconName: "ShieldCheck",
    description: "Deployment to NHS trusts and private health networks with verified credentials, GMC/NMC and DBS audit clearance.",
  },
];

// --------------------------------------------------------------------------
// 2. DOMAINS (Scoped by Sector)
// --------------------------------------------------------------------------
export const INTAKE_DOMAINS: DomainOption[] = [
  // Technology Domains
  {
    id: "dom-tech-fullstack",
    sectorId: "technology",
    label: "Full-Stack Systems & Applications",
    description: "Modern end-to-end web architecture, micro-frontends, and distributed backends.",
    recommendedSkills: ["sk-react", "sk-nextjs", "sk-nodejs", "sk-typescript", "sk-postgres"],
  },
  {
    id: "dom-tech-backend",
    sectorId: "technology",
    label: "Backend & Distributed Systems",
    description: "High-throughput APIs, event streaming, caching, and database architecture.",
    recommendedSkills: ["sk-go", "sk-python", "sk-django", "sk-kafka", "sk-redis"],
  },
  {
    id: "dom-tech-frontend",
    sectorId: "technology",
    label: "Frontend Engineering & Design Systems",
    description: "Performance-optimized web applications, accessible design systems, and state management.",
    recommendedSkills: ["sk-react", "sk-nextjs", "sk-typescript", "sk-tailwind"],
  },
  {
    id: "dom-tech-cloud-devops",
    sectorId: "technology",
    label: "Cloud Architecture, DevOps & SRE",
    description: "Infrastructure as Code, Kubernetes orchestration, CI/CD, and platform reliability.",
    recommendedSkills: ["sk-aws", "sk-kubernetes", "sk-terraform", "sk-docker"],
  },
  {
    id: "dom-tech-data-ai",
    sectorId: "technology",
    label: "Data Engineering & AI / MLOps",
    description: "LLM integration, data pipelines, vector search embeddings, and analytics lakes.",
    recommendedSkills: ["sk-python", "sk-pytorch", "sk-postgresql-vector", "sk-fastapi"],
  },
  {
    id: "dom-tech-cybersecurity",
    sectorId: "technology",
    label: "Cybersecurity & DevSecOps",
    description: "SOC 2 Type II compliance, vulnerability assessment, cryptography, and secure pipelines.",
    recommendedSkills: ["sk-soc2", "sk-cryptography", "sk-owasp", "sk-aws-security"],
  },

  // Healthcare Domains
  {
    id: "dom-health-physicians",
    sectorId: "healthcare",
    label: "Physicians & Medical Consultants",
    description: "Specialist medical practitioners, diagnostic physicians, and acute trauma consultants.",
    recommendedSkills: ["sk-gmc-reg", "sk-atls", "sk-clinical-triage"],
  },
  {
    id: "dom-health-nursing-icu",
    sectorId: "healthcare",
    label: "Intensive Care & Emergency Nursing",
    description: "NHS Band 7/8 critical care nurse specialists and acute telemetry leads.",
    recommendedSkills: ["sk-nmc-reg", "sk-icu-critical", "sk-bls-acls", "sk-dbs-enhanced"],
  },
  {
    id: "dom-health-ehr-operations",
    sectorId: "healthcare",
    label: "EMR / EHR Clinical Operations",
    description: "Hospital workflow modernization, clinical documentation, and health record governance.",
    recommendedSkills: ["sk-epic-systems", "sk-cerner", "sk-hl7-fhir"],
  },
  {
    id: "dom-health-admin-gov",
    sectorId: "healthcare",
    label: "Clinical Governance & Hospital Administration",
    description: "Healthcare compliance, CQC audit readiness, and hospital staffing operations.",
    recommendedSkills: ["sk-clinical-audit", "sk-cqc-compliance", "sk-dbs-enhanced"],
  },
];

// --------------------------------------------------------------------------
// 3. SKILLS & SPECIALTIES
// --------------------------------------------------------------------------
export const INTAKE_SKILLS: SkillOption[] = [
  // Tech Skills
  { id: "sk-react", label: "React", sectorId: "technology", isPopular: true },
  { id: "sk-nextjs", label: "Next.js 15", sectorId: "technology", isPopular: true },
  { id: "sk-typescript", label: "TypeScript", sectorId: "technology", isPopular: true },
  { id: "sk-nodejs", label: "Node.js", sectorId: "technology", isPopular: true },
  { id: "sk-python", label: "Python", sectorId: "technology", isPopular: true },
  { id: "sk-django", label: "Django REST Framework", sectorId: "technology", isPopular: true },
  { id: "sk-go", label: "Go (Golang)", sectorId: "technology", isPopular: true },
  { id: "sk-postgres", label: "PostgreSQL", sectorId: "technology", isPopular: true },
  { id: "sk-redis", label: "Redis", sectorId: "technology", isPopular: true },
  { id: "sk-kafka", label: "Apache Kafka", sectorId: "technology" },
  { id: "sk-aws", label: "AWS Cloud", sectorId: "technology", isPopular: true },
  { id: "sk-kubernetes", label: "Kubernetes (EKS/GKE)", sectorId: "technology", isPopular: true },
  { id: "sk-docker", label: "Docker Containers", sectorId: "technology", isPopular: true },
  { id: "sk-terraform", label: "Terraform (IaC)", sectorId: "technology" },
  { id: "sk-rust", label: "Rust", sectorId: "technology" },
  { id: "sk-graphql", label: "GraphQL", sectorId: "technology" },
  { id: "sk-tailwind", label: "Tailwind CSS", sectorId: "technology" },
  { id: "sk-fastapi", label: "FastAPI", sectorId: "technology" },
  { id: "sk-postgresql-vector", label: "pgvector & Embeddings", sectorId: "technology" },

  // Healthcare Skills
  { id: "sk-gmc-reg", label: "GMC Registered (UK)", sectorId: "healthcare", isPopular: true },
  { id: "sk-nmc-reg", label: "NMC Registered (Band 7/8)", sectorId: "healthcare", isPopular: true },
  { id: "sk-dbs-enhanced", label: "Enhanced DBS Clearance", sectorId: "healthcare", isPopular: true },
  { id: "sk-bls-acls", label: "BLS & ACLS Certified", sectorId: "healthcare", isPopular: true },
  { id: "sk-icu-critical", label: "Intensive Care Unit (ICU)", sectorId: "healthcare", isPopular: true },
  { id: "sk-clinical-triage", label: "Acute Clinical Triage", sectorId: "healthcare" },
  { id: "sk-epic-systems", label: "Epic Systems EHR", sectorId: "healthcare", isPopular: true },
  { id: "sk-cerner", label: "Cerner Millennium", sectorId: "healthcare" },
  { id: "sk-hl7-fhir", label: "HL7 & FHIR Standards", sectorId: "healthcare" },
  { id: "sk-atls", label: "ATLS Trauma Care", sectorId: "healthcare" },
  { id: "sk-cqc-compliance", label: "CQC Quality Governance", sectorId: "healthcare" },
];

// --------------------------------------------------------------------------
// 4. SENIORITY & EXPERIENCE LEVELS
// --------------------------------------------------------------------------
export const INTAKE_SENIORITIES: SeniorityOption[] = [
  // Technology Levels
  {
    id: "lvl-tech-junior",
    sectorId: "technology",
    label: "Junior Software Engineer",
    yearsRange: "1 to 2 Years",
    canonicalLevel: "junior",
    description: "Foundational software delivery and peer-reviewed code sprints.",
  },
  {
    id: "lvl-tech-mid",
    sectorId: "technology",
    label: "Mid-Level Software Engineer",
    yearsRange: "3 to 5 Years",
    canonicalLevel: "mid",
    description: "Independent feature implementation and robust modular architecture.",
  },
  {
    id: "lvl-tech-senior",
    sectorId: "technology",
    label: "Senior Engineer & Specialist",
    yearsRange: "5 to 8 Years",
    canonicalLevel: "senior",
    description: "Deep technical ownership, system design, and benchmark test coverage.",
  },
  {
    id: "lvl-tech-lead",
    sectorId: "technology",
    label: "Lead Architect & Pod Delivery Lead",
    yearsRange: "8+ Years",
    canonicalLevel: "lead",
    description: "Pod sprint leadership, technical roadmap governance, and cross-timezone sync.",
  },

  // Healthcare Levels
  {
    id: "lvl-health-practice",
    sectorId: "healthcare",
    label: "Clinical Practitioner / Staff Nurse",
    yearsRange: "1 to 3 Years",
    canonicalLevel: "junior",
    description: "Direct patient care, vital assessments, and bedside protocol execution.",
  },
  {
    id: "lvl-health-specialist",
    sectorId: "healthcare",
    label: "Advanced Specialist / NHS Band 7",
    yearsRange: "4 to 7 Years",
    canonicalLevel: "senior",
    description: "Specialized clinical decision making, acute ICU triage, and department shift coordination.",
  },
  {
    id: "lvl-health-lead",
    sectorId: "healthcare",
    label: "Clinical Consultant / Department Lead (Band 8+)",
    yearsRange: "8+ Years",
    canonicalLevel: "lead",
    description: "Clinical governance, senior panel reviews, and hospital department oversight.",
  },
];

// --------------------------------------------------------------------------
// 5. WORK AUTHORIZATION
// --------------------------------------------------------------------------
export const INTAKE_WORK_AUTH: WorkAuthOption[] = [
  {
    id: "auth-us-citizen",
    label: "US Citizen",
    canonicalAuth: "us_citizen",
    region: "US",
    description: "Unrestricted authorization for any US-based sprint pod.",
  },
  {
    id: "auth-green-card",
    label: "Permanent Resident (Green Card)",
    canonicalAuth: "green_card",
    region: "US",
    description: "Permanent US resident authorization.",
  },
  {
    id: "auth-h1b",
    label: "H-1B Specialty Occupation",
    canonicalAuth: "h1b",
    region: "US",
    description: "Available for H-1B transfer or cap-exempt enterprise allocation.",
  },
  {
    id: "auth-opt-stem",
    label: "OPT / STEM OPT Extension",
    canonicalAuth: "opt",
    region: "US",
    description: "Valid EAD work authorization with dedicated STEM extension.",
  },
  {
    id: "auth-intl-remote",
    label: "International Remote Specialist",
    canonicalAuth: "international_remote",
    region: "Global",
    description: "Autonomous cross-border B2B contractor with guaranteed timezone overlap.",
  },
];

// --------------------------------------------------------------------------
// 6. ENGAGEMENT PREFERENCES
// --------------------------------------------------------------------------
export const INTAKE_ENGAGEMENT_PREFS: EngagementOption[] = [
  {
    id: "eng-w2",
    label: "W2 Contract",
    canonicalEngagement: "w2",
    badge: "US Payroll",
    description: "Employee contract with hourly billing and employer payroll benefits.",
  },
  {
    id: "eng-c2c",
    label: "Corp-to-Corp (C2C)",
    canonicalEngagement: "c2c",
    badge: "B2B Vendor",
    description: "Invoicing through candidate incorporated legal business entity.",
  },
  {
    id: "eng-1099",
    label: "1099 Independent Contractor",
    canonicalEngagement: "1099",
    badge: "Direct Contract",
    description: "Direct contractual agreement for US independent specialists.",
  },
  {
    id: "eng-direct-hire",
    label: "Direct Hire / Full-Time Placement",
    canonicalEngagement: "direct_hire",
    badge: "Permanent FTE",
    description: "Direct permanent placement on client internal executive payroll.",
  },
];

// --------------------------------------------------------------------------
// HELPER SELECTORS (Ready for Frontend UI & Future API Ingestion)
// --------------------------------------------------------------------------
export function getDomainsForSector(sectorCode: "technology" | "healthcare"): DomainOption[] {
  return INTAKE_DOMAINS.filter((d) => d.sectorId === sectorCode);
}

export function getSkillsForSector(sectorCode: "technology" | "healthcare"): SkillOption[] {
  return INTAKE_SKILLS.filter((s) => s.sectorId === sectorCode);
}

export function getSenioritiesForSector(sectorCode: "technology" | "healthcare"): SeniorityOption[] {
  return INTAKE_SENIORITIES.filter((s) => s.sectorId === sectorCode);
}
