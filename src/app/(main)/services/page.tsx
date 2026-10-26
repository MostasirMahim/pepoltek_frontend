import React from "react";
import Link from "next/link";
import PageHero from "@/components/main/PageHero";
import {
  Zap,
  Cpu,
  Globe,
  Users,
  Stethoscope,
  Award,
  Check,
  Clock,
  ShieldCheck,
  ArrowRight,
} from "@/components/ui/Icons";
import { renderDynamicIcon } from "@/components/ui/DynamicIcon";
import { getPublicSiteContentAction } from "@/actions/content.actions";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Services & Solutions | Pepoltek Limited Workforce",
  description:
    "Explore IT staff augmentation, dedicated engineering pods, Employer of Record (EOR), direct hire, and clinical healthcare staffing from Pepoltek.",
};

const DEFAULT_HEADER = {
  eyebrow: "Commercial Solutions Suite",
  title: "Workforce Solutions Tailored",
  highlightedText: "for Speed and Precision",
  description:
    "From flexible contractor bandwidth to fully autonomous engineering squads and clinical rotas, Pepoltek provides transparent commercial models backed by performance guarantees.",
  stats: [
    { value: "2 to 7 Days", label: "Sprint Shortlist Velocity" },
    { value: "2 Weeks", label: "Risk-Free Trial Period" },
    { value: "15+ Countries", label: "Global EOR & Payroll Hubs" },
  ],
  specs: [
    "W2 & C2C Compliant",
    "4 to 8 Hrs Live Overlap",
    "90-Day Placement Guarantee",
    "HIPAA Title II Certified",
  ],
  primaryCta: { label: "Request Workforce Quote", href: "/contact" },
  secondaryCta: { label: "Launch Velocity Calculator", href: "/#hiring" },
};

const FALLBACK_SERVICES = [
  {
    id: "staff-augmentation",
    title: "IT Staff Augmentation",
    badge: "Elastic Bandwidth",
    iconName: "Zap",
    desc: "Seamlessly embed senior software engineers into your sprint cycles. Billed hourly or monthly with complete flexibility.",
    guarantee: "2-week risk-free trial + 10% rate discount on 6-month squad commitments.",
    features: [
      "W2 Contract and Corp-to-Corp (C2C) compliant structures",
      "Overlapping workdays (4 to 8 hours live synchronous collaboration)",
      "Senior developers across Frontend, Backend, Cloud, and AI",
      "Immediate deployment in 2 to 7 business days",
    ],
  },
  {
    id: "offshore-pods",
    title: "Dedicated Engineering Pods",
    badge: "Turnkey Squads",
    iconName: "Cpu",
    desc: "Autonomous, cross-functional software pods managed by in-house architects and agile project managers.",
    guarantee: "SLA-governed sprint velocity and weekly delivery burn-down charts.",
    features: [
      "Tripartite pod composition (Lead Architect, Engineers, QA & DevOps)",
      "Daily live standup attendance and synchronized sprint cadence",
      "Hard-coded repository reviews and microservices architecture",
      "Zero management overhead for enterprise clients",
    ],
  },
  {
    id: "eor-services",
    title: "Employer of Record (EOR)",
    badge: "Global Compliance",
    iconName: "Globe",
    desc: "Hire international talent anywhere without incorporating local entities. We handle global payroll, taxes, and legal labor laws.",
    guarantee: "Compliant payroll distribution across 15+ countries.",
    features: [
      "Local labor law compliance and employment contracts",
      "Statutory benefits administration and IP protection clauses",
      "Single consolidated monthly invoicing in USD, GBP, or EUR",
      "Zero risk of contractor misclassification",
    ],
  },
  {
    id: "direct-hire",
    title: "Direct Hire & Executive Search",
    badge: "Permanent Placement",
    iconName: "Users",
    desc: "Contingent and retained search for full-time staff, specialized engineering leads, and C-level technology executives.",
    guarantee: "90-day replacement guarantee + competitive market-entry rates.",
    features: [
      "Transparent fee structure (15% to 20% first-year compensation)",
      "Introductory 12% placement rate on initial three hires",
      "Rigorous behavioral vetting (HEXACO and BEI scorecards)",
      "Full background checks and credential verification",
    ],
  },
  {
    id: "healthcare-staffing",
    title: "Healthcare & Clinical Staffing",
    badge: "HIPAA Compliant",
    iconName: "Stethoscope",
    desc: "Vetted healthcare professionals and health-tech engineers ready for hospital rotas, clinics, and digital health platforms.",
    guarantee: "Clinical credentialing audits with continuous license verification.",
    features: [
      "Physicians and Registered Nurses (ICU, Emergency, Outpatient)",
      "EMR / EHR implementation specialists (Epic, Cerner, FHIR)",
      "HIPAA-aware remote hiring and compliance frameworks",
      "DBS, GMC, and state medical board credentialing checks",
    ],
  },
  {
    id: "workforce-readiness",
    title: "Workforce Readiness & Academy",
    badge: "Talent Upskilling",
    iconName: "Award",
    desc: "Targeted pre-deployment training for candidates to eliminate skill gaps and ensure instant productivity on day one.",
    guarantee: "Verified competency badges and enterprise communication alignment.",
    features: [
      "US Enterprise Readiness and daily standup etiquette",
      "HIPAA and PCI DSS data security bootcamps",
      "Distributed Systems and modern RAG AI architectures",
      "Tailored client onboarding modules available on request",
    ],
  },
];

export default async function ServicesPage() {
  // Fetch live CMS published data
  let header = DEFAULT_HEADER;
  let servicesList = FALLBACK_SERVICES;

  try {
    const detail = await getPublicSiteContentAction<{
      header?: typeof DEFAULT_HEADER;
      services?: typeof FALLBACK_SERVICES;
    }>("services_list");
    const liveData = (detail.data ?? {}) as {
      header?: typeof DEFAULT_HEADER;
      services?: typeof FALLBACK_SERVICES;
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
      {/* Hero Header crafted in Homepage Hero style dynamically powered by CMS */}
      <PageHero
        eyebrow={header.eyebrow}
        title={header.title}
        highlightedText={header.highlightedText}
        description={header.description}
        stats={(header.stats || DEFAULT_HEADER.stats).map((s, idx) => ({
          value: s.value,
          label: s.label,
          icon: idx === 0 ? <Clock size={20} /> : idx === 1 ? <ShieldCheck size={20} /> : <Globe size={20} />,
        }))}
        actions={[
          {
            label: header.primaryCta?.label || "Request Workforce Quote",
            href: header.primaryCta?.href || "/contact",
            primary: true,
          },
          {
            label: header.secondaryCta?.label || "Launch Velocity Calculator",
            href: header.secondaryCta?.href || "/#hiring",
          },
        ]}
        proofPills={header.specs || DEFAULT_HEADER.specs}
      />

      {/* Main Content Area */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        {/* Services Grid dynamically rendered from CMS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {servicesList.map((srv) => (
            <div
              key={srv.id}
              className="group flex flex-col justify-between rounded-3xl border border-[#bcd6fa] bg-white p-7 sm:p-8 shadow-xs hover:border-electric/60 hover:shadow-lg transition-all duration-200"
            >
              <div>
                <div className="flex items-center justify-between">
                  {/* Dynamic Icon Container */}
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

                {/* Clean, readable body text */}
                <p className="mt-2.5 text-xs sm:text-sm text-ink-soft font-normal leading-relaxed">
                  {srv.desc}
                </p>

                {/* Guarantee Pill */}
                {srv.guarantee && (
                  <div className="mt-5 rounded-xl border border-signal/30 bg-signal/5 p-3.5">
                    <span className="font-mono text-[10px] font-bold text-signal uppercase tracking-wider block">
                      Performance Guarantee
                    </span>
                    <p className="mt-1 text-xs text-ink-soft font-medium leading-relaxed">
                      {srv.guarantee}
                    </p>
                  </div>
                )}

                {/* Feature Bullet Points */}
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
                  <span>Request Workforce Quote</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Calculator Callout Banner */}
        <div className="mt-16 rounded-3xl border border-[#bcd6fa] bg-gradient-to-r from-ink via-[#0d214a] to-ink text-white p-8 sm:p-12 shadow-xl">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-2">
              <div className="font-mono text-xs font-semibold text-electric-bright uppercase tracking-widest">
                Interactive Velocity Modeling
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-bold">
                Run Our Interactive Hiring Velocity Calculator
              </h3>
              <p className="text-xs sm:text-sm text-white/80 max-w-xl font-normal leading-relaxed">
                Simulate squad sizes, seniority premiums, timezone overlap, and monthly savings compared to legacy agency models.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3.5 shrink-0">
              <Link
                href="/#hiring"
                className="rounded-xl bg-electric px-6 py-3.5 font-display text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-electric-bright transition-all text-center"
              >
                Launch Calculator →
              </Link>
              <Link
                href="/contact"
                className="rounded-xl border border-white/20 bg-white/10 px-6 py-3.5 font-display text-xs sm:text-sm font-semibold text-white hover:bg-white/20 transition-all text-center"
              >
                Talk to a Specialist
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
