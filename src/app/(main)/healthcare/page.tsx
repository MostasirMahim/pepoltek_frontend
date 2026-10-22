import React from "react";
import Link from "next/link";
import PageHero from "@/components/main/PageHero";
import {
  Stethoscope,
  Users,
  Cpu,
  ShieldCheck,
  Check,
  Clock,
  Globe,
  Award,
  ArrowRight,
  Database,
  Lock,
  FileText,
  Activity,
} from "@/components/ui/Icons";
import { getContentBlockDetailAction } from "@/actions/content.actions";
import { renderDynamicIcon } from "@/components/ui/DynamicIcon";
import type { PageHeaderData, ServiceItemData } from "@/components/admin/content/AdminCollectionEditor";

export const metadata = {
  title: "Healthcare & Compliance Practice | Pepoltek Regulated Workforce",
  description:
    "Pre-vetted clinical medical staffing, healthcare operations, and health-tech interoperability engineering governed by 100% HIPAA compliance frameworks.",
};

const DEFAULT_HEADER: PageHeaderData = {
  eyebrow: "Regulated Clinical & Med-Tech Practice",
  title: "Healthcare Workforce &",
  highlightedText: "Compliance Ready",
  description:
    "Pre-vetted clinical medical staffing, non-clinical healthcare administration, and health-tech interoperability engineering governed by 100% HIPAA compliance frameworks.",
  stats: [
    { value: "100%", label: "HIPAA & BAA Compliance" },
    { value: "48h", label: "Clinical Credential SLA" },
    { value: "10k+", label: "Verified Specialists" },
  ],
  specs: [
    "GMC & State Board Verified",
    "DBS Enhanced Cleared",
    "FHIR & HL7 Interoperability",
    "Epic & Cerner Specialists",
  ],
  primaryCta: { label: "Deploy Clinical Talent", href: "/contact" },
  secondaryCta: { label: "Inspect Compliance Vault", href: "/case-studies" },
};

const FALLBACK_SERVICES: ServiceItemData[] = [
  {
    id: "clinical-staffing",
    title: "Clinical Medical Staffing",
    badge: "Clinical Practice",
    iconName: "Stethoscope",
    desc: "Licensed physicians, registered nurses, and specialist clinicians for emergency, outpatient, and ICU wards.",
    guarantee: "100% primary source license verification prior to start date.",
    features: [
      "Physicians (Attending, Hospitalists, Emergency Medicine)",
      "Registered Nurses (ICU, Telemetry, ER, Travel Nursing)",
      "Allied Health Professionals (Radiology, Lab Techs, Physical Therapy)",
      "Continuous automated primary source license monitoring",
    ],
  },
  {
    id: "non-clinical-operations",
    title: "Non-Clinical Healthcare Operations",
    badge: "Healthcare Ops",
    iconName: "Users",
    desc: "Healthcare administrators, EMR directors, and medical coding professionals optimizing hospital revenue cycles.",
    guarantee: "HIPAA Title II trained and compliance certified staff.",
    features: [
      "Medical billing, coding, and denial management specialists",
      "Health system administrators and practice managers",
      "Patient intake and telehealth customer experience pods",
      "Compliance and credentialing audit coordinators",
    ],
  },
  {
    id: "health-tech-engineering",
    title: "Health-Tech & EMR Engineering",
    badge: "Health IT",
    iconName: "Cpu",
    desc: "Specialized software engineers and systems architects building, migrating, and maintaining clinical data pipelines.",
    guarantee: "FHIR and HL7 interoperability standards guaranteed.",
    features: [
      "Certified Epic and Cerner interface integration engineers",
      "FHIR / HL7 v2/v3 data pipelines and telemetry gateways",
      "Cloud HIPAA-compliant data lakes on AWS HealthLake and GCP",
      "Medical device and IoT telemetry integration specialists",
    ],
  },
  {
    id: "hipaa-governance",
    title: "HIPAA & PCI DSS Governance Vault",
    badge: "Audited Security",
    iconName: "ShieldCheck",
    desc: "Institutional security frameworks, Business Associate Agreements (BAAs), and end-to-end encrypted remote setups.",
    guarantee: "Zero compliance breach guarantee backed by contractual indemnification.",
    features: [
      "Signed Business Associate Agreements (BAAs) on all engagements",
      "Zero-trust hardware provisioning and mobile device management",
      "SOC 2 Type II and HIPAA Title II verified audit trails",
      "Real-time session logging and data loss prevention (DLP)",
    ],
  },
];

const COMPLIANCE_PILLARS = [
  {
    title: "Primary Source Verification",
    badge: "State Boards & GMC",
    desc: "Direct integration with state licensing boards, the General Medical Council (GMC), and Nursing Registries. Zero self-reported credentials.",
  },
  {
    title: "Contractual BAA Enforcement",
    badge: "HIPAA Title II",
    desc: "Mandatory Business Associate Agreements executed prior to onboarding. Strict PHI data isolation protocols and encrypted remote setups.",
  },
  {
    title: "EMR / EHR Clinical Compatibility",
    badge: "Epic & Cerner Ready",
    desc: "Personnel and engineers credentialed in Epic Hyperspace, Cerner Millennium, AthenaHealth, and FHIR v4 interoperability standards.",
  },
  {
    title: "48-Hour Credentialing Velocity",
    badge: "Rapid Clearance SLA",
    desc: "Dedicated clinical credentialing coordinators executing 10-panel drug screens, background checks, and immunizations in record turnaround.",
  },
];

export default async function HealthcarePage() {
  let header = DEFAULT_HEADER;
  let servicesList = FALLBACK_SERVICES;

  try {
    const detail = await getContentBlockDetailAction("healthcare_page");
    const liveData = (detail.data?.published?.data ?? detail.data?.latest?.data ?? {}) as {
      header?: PageHeaderData;
      services?: ServiceItemData[];
    };

    if (liveData.header) {
      header = {
        ...DEFAULT_HEADER,
        ...liveData.header,
      };
    }

    if (liveData.services && Array.isArray(liveData.services) && liveData.services.length > 0) {
      servicesList = liveData.services;
    }
  } catch {
    // Fall back to defaults
  }

  return (
    <div className="relative min-h-screen bg-canvas">
      {/* Dynamic Page Hero Header from CMS */}
      <PageHero
        eyebrow={header.eyebrow}
        title={header.title}
        highlightedText={header.highlightedText}
        description={header.description}
        stats={header.stats.map((s, idx) => ({
          value: s.value,
          label: s.label,
          icon: idx === 0 ? <ShieldCheck size={20} /> : idx === 1 ? <Clock size={20} /> : <Stethoscope size={20} />,
        }))}
        actions={[
          {
            label: header.primaryCta?.label || "Deploy Clinical Talent",
            href: header.primaryCta?.href || "/contact",
            primary: true,
          },
          {
            label: header.secondaryCta?.label || "Inspect Compliance Vault",
            href: header.secondaryCta?.href || "/case-studies",
          },
        ]}
        proofPills={header.specs}
      />

      {/* Main Content Container */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 space-y-20">
        
        {/* Practice Offerings Grid dynamically rendered from CMS */}
        <div>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="rounded-full bg-electric/10 border border-electric/25 px-3 py-1 font-mono text-xs font-bold text-electric uppercase tracking-wider">
              Specialized Healthcare Tracks
            </span>
            <h2 className="mt-3 font-display text-2xl sm:text-3xl font-extrabold text-ink">
              Clinical & Health-Tech Practice Areas
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-ink-soft max-w-2xl mx-auto leading-relaxed">
              Every clinician, healthcare administrator, and med-tech engineer is vetted against stringent regulatory frameworks before day one.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-7">
            {servicesList.map((srv) => (
              <div
                key={srv.id}
                className="group flex flex-col justify-between rounded-3xl border border-[#bcd6fa] bg-white p-7 sm:p-8 shadow-xs hover:border-electric/60 hover:shadow-lg transition-all duration-200"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-electric/10 text-electric border border-electric/25 shadow-2xs group-hover:scale-105 group-hover:bg-electric group-hover:text-white transition-all duration-200">
                      {renderDynamicIcon(srv.iconName, 22)}
                    </div>
                    <span className="rounded-md border border-electric/30 bg-electric/10 px-2.5 py-1 font-mono text-[10px] font-bold text-electric uppercase tracking-wider">
                      {srv.badge}
                    </span>
                  </div>

                  <h3 className="mt-5 font-display text-xl font-bold text-ink group-hover:text-electric transition-colors">
                    {srv.title}
                  </h3>

                  <p className="mt-2.5 text-xs sm:text-sm text-ink-soft font-normal leading-relaxed">
                    {srv.desc}
                  </p>

                  {/* Performance Guarantee */}
                  {srv.guarantee && (
                    <div className="mt-5 rounded-xl border border-signal/30 bg-signal/5 p-3.5">
                      <span className="font-mono text-[10px] font-bold text-signal uppercase tracking-wider block">
                        Clinical & Regulatory Guarantee
                      </span>
                      <p className="mt-1 text-xs text-ink-soft font-medium leading-relaxed">
                        {srv.guarantee}
                      </p>
                    </div>
                  )}

                  {/* Feature Checklist */}
                  {srv.features && srv.features.length > 0 && (
                    <ul className="mt-5 space-y-2.5">
                      {srv.features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-ink-soft font-normal leading-relaxed">
                          <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-electric/10 text-electric mt-0.5">
                            <Check size={11} />
                          </span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="mt-8 pt-5 border-t border-[#bcd6fa]/50">
                  <Link
                    href="/contact"
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-ink py-3 font-display text-xs sm:text-sm font-bold text-white hover:bg-electric transition-colors cursor-pointer shadow-xs"
                  >
                    <span>Request Practice Brief</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Institutional Compliance & Credentialing Infrastructure */}
        <div className="rounded-3xl border border-[#bcd6fa] bg-gradient-to-b from-white to-[#f5f9ff] p-8 sm:p-12 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#bcd6fa]/50 pb-8">
            <div>
              <span className="font-mono text-xs font-bold text-electric uppercase tracking-wider">
                Institutional Security & Governance
              </span>
              <h2 className="mt-2 font-display text-2xl sm:text-3xl font-extrabold text-ink">
                Compliance Infrastructure Built for Regulated Healthcare
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-ink-soft max-w-2xl leading-relaxed">
                Hospital systems and digital health scaleups cannot afford compliance oversights. Our four-stage credentialing engine guarantees audit-ready peace of mind.
              </p>
            </div>

            <Link
              href="/contact"
              className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-electric/40 bg-electric/10 px-5 py-2.5 font-display text-xs font-bold text-electric hover:bg-electric hover:text-white transition-all"
            >
              <span>Download BAA & Compliance Packet</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {COMPLIANCE_PILLARS.map((pillar, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-[#bcd6fa]/70 bg-white p-5 shadow-2xs hover:border-electric/50 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-electric/10 text-electric font-mono text-xs font-bold">
                      0{idx + 1}
                    </span>
                    <span className="rounded bg-canvas px-2 py-0.5 font-mono text-[9.5px] font-bold text-ink-soft">
                      {pillar.badge}
                    </span>
                  </div>
                  <h3 className="font-display text-sm font-bold text-ink">
                    {pillar.title}
                  </h3>
                  <p className="mt-2 text-xs text-ink-soft font-normal leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Direct Clinical Deployment CTA Banner */}
        <div className="rounded-3xl border border-[#bcd6fa] bg-gradient-to-r from-ink via-[#0d214a] to-ink text-white p-8 sm:p-12 shadow-xl">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-2">
              <div className="font-mono text-xs font-semibold text-electric-bright uppercase tracking-widest">
                Rapid Clinical Intake
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-bold">
                Deploy Accredited Clinical Personnel or Health-Tech Engineers
              </h3>
              <p className="text-xs sm:text-sm text-white/80 max-w-xl font-normal leading-relaxed">
                Connect with our dedicated Healthcare Practice Directors. Receive verified dossiers with active primary source licenses within 48 hours.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3.5 shrink-0">
              <Link
                href="/contact"
                className="rounded-xl bg-electric px-6 py-3.5 font-display text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-electric-bright transition-all text-center"
              >
                Schedule Clinical Briefing →
              </Link>
              <Link
                href="/services"
                className="rounded-xl border border-white/20 bg-white/10 px-6 py-3.5 font-display text-xs sm:text-sm font-semibold text-white hover:bg-white/20 transition-all text-center"
              >
                Explore All Services
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
