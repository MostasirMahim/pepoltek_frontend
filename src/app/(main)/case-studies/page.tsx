import React from "react";
import CaseStudiesClient from "./CaseStudiesClient";
import { getPublicSiteContentAction } from "@/actions/content.actions";
import type { PageHeaderData, CaseStudyItemData } from "@/components/admin/content/AdminCollectionEditor";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Technical Case Studies & Engineering Blueprints | Pepoltek Limited",
  description:
    "Real enterprise architectures designed, deployed, and benchmarked by Pepoltek delivery pods. Inspect microservices, data schemas, and live audit logs.",
};

const DEFAULT_HEADER: PageHeaderData = {
  eyebrow: "Verified Production Deployments",
  title: "Technical Case Studies &",
  highlightedText: "Architecture Blueprints",
  description:
    "Inspect microservices blueprints, data schemas, and hard-coded audit benchmarks across enterprise FinTech, Health-Tech, and BioTech deployments.",
  stats: [
    { value: "100%", label: "Code Audit Transparency" },
    { value: "< 45ms", label: "Vector Matching SLA" },
    { value: "92%", label: "First-Year Retention Rate" },
  ],
  specs: [
    "Zero Fluff Architecture",
    "Live Telemetry Validation",
    "Multi-Tenant Microservices",
    "HIPAA & PCI-DSS Verified",
  ],
  primaryCta: { label: "Schedule Technical Briefing", href: "/contact" },
  secondaryCta: { label: "Explore Workforce Models", href: "/services" },
};

const DEFAULT_STUDIES: CaseStudyItemData[] = [
  {
    slug: "fintech-cloud-platform-acceleration",
    title: "Scaling Cloud Platform Engineering for Tier-1 FinTech",
    category: "Enterprise Web Apps",
    sector: "tech",
    sectorLabel: "Technology and Cloud",
    client: "Global NeoBank Enterprise",
    timeline: "3 Months",
    summary:
      "Reduced time-to-hire from 48 days to 11 days while placing 14 high-throughput Python and Kubernetes engineers with zero post-onboarding attrition.",
    challenge:
      "The client faced severe sprint bottlenecks launching cross-border payment rails due to a shortage of vetted distributed systems engineers with PCI-DSS compliance backgrounds.",
    solution:
      "Pepoltek deployed our AI semantic matching pipeline combined with peer-level architectural vetting to shortlist candidates within 72 hours, orchestrating synchronous technical panel assessments.",
    techStack: ["Next.js", "Python / Django", "PostgreSQL", "Redis", "Docker", "Kubernetes"],
    metrics: [
      { label: "Time to Hire", value: "11 Days" },
      { label: "Engineers Placed", value: "14 Senior Devs" },
      { label: "Retention Rate", value: "100% Zero Churn" },
    ],
  },
  {
    slug: "regional-health-system-icu-nursing",
    title: "Emergency Staffing and Primary Credentialing for Acute Care Network",
    category: "Health-Tech & EMR",
    sector: "healthcare",
    sectorLabel: "Healthcare and Clinical",
    client: "Multi-State Regional Hospital Network",
    timeline: "6 Weeks",
    summary:
      "Mobilized 28 ICU and telemetry travel nurses with 100% credential compliance pass rate on day 1, averting unit closures across 3 regional facilities.",
    challenge:
      "Seasonal patient surges and unexpected nursing vacancies left 4 acute care facilities dangerously below required staff-to-patient ratios, threatening patient safety.",
    solution:
      "Pepoltek healthcare credentialing team executed automated primary source license verifications, immunization reviews, and drug screening within a 5-day cycle.",
    techStack: ["Epic Systems", "Cerner EMR", "FHIR API", "HIPAA Vault"],
    metrics: [
      { label: "Clinical Staff Deployed", value: "28 Nurses" },
      { label: "Turnaround Time", value: "5 Days" },
      { label: "Compliance Rate", value: "100% Audited" },
    ],
  },
  {
    slug: "ai-biotech-nlp-data-pipeline",
    title: "BioTech Genomic NLP Model Training Pipeline Staffing",
    category: "SaaS",
    sector: "tech",
    sectorLabel: "Technology and Cloud",
    client: "Next-Gen Oncology BioTech",
    timeline: "2 Months",
    summary:
      "Supplied 6 specialized PyTorch and Bioinformatics machine learning researchers to accelerate oncology publication timelines by 4 months.",
    challenge:
      "Candidate pool for researchers possessing both deep biomedical context and advanced transformer model training capabilities was virtually non-existent through standard job boards.",
    solution:
      "Pepoltek leveraged our reverse search algorithms and academic talent networks to engage passive PhD-level research engineers.",
    techStack: ["PyTorch", "Hugging Face", "CUDA", "AWS SageMaker", "Python"],
    metrics: [
      { label: "PhD Researchers Placed", value: "6 Specialists" },
      { label: "Timeline Accelerated", value: "4 Months" },
      { label: "Pipeline Throughput", value: "10x Data Velocity" },
    ],
  },
];

export default async function CaseStudiesPage() {
  let header = DEFAULT_HEADER;
  let studies = DEFAULT_STUDIES;

  try {
    const detail = await getPublicSiteContentAction<{
      header?: PageHeaderData;
      studies?: CaseStudyItemData[];
    }>("case_studies");
    const liveData = (detail.data ?? {}) as {
      header?: PageHeaderData;
      studies?: CaseStudyItemData[];
    };

    if (liveData.header) {
      header = {
        ...DEFAULT_HEADER,
        ...liveData.header,
      };
    }

    if (liveData.studies && Array.isArray(liveData.studies) && liveData.studies.length > 0) {
      studies = liveData.studies;
    }
  } catch {
    // Gracefully fallback to default case studies data
  }

  return <CaseStudiesClient initialHeader={header} initialCmsStudies={studies} />;
}
