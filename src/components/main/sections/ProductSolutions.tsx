"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ProjectOverviewModal } from "./ProjectOverviewModal";
import { ProjectModal } from "./ProjectModal";
import { CardTopRightShape } from "@/components/ui/CardCornerShapes";
import { AnimatedChevrons } from "@/components/ui/AnimatedChevrons";
import { projectsData } from "@/data/projectsData";
import { Project } from "@/types/portfolio";
import { getCaseStudiesAction } from "@/actions/cms.actions";

interface CaseStudyCard {
  id: string;
  projectSlug: string;
  category: "enterprise" | "healthtech" | "saas";
  indexStr: string;
  badge: string;
  title: string;
  type: string;
  endpoint: string;
  status: string;
  image: string;
  description: string;
  techStack: string[];
  impact: string;
  metric: string;
  metricLabel: string;
}

const FILTER_TABS = [
  { id: "all", label: "All Builds" },
  { id: "enterprise", label: "Enterprise Web Apps" },
  { id: "healthtech", label: "Health-Tech & EMR" },
  { id: "saas", label: "SaaS Platforms" },
] as const;

const CASE_STUDIES: CaseStudyCard[] = [
  {
    id: "hrms",
    projectSlug: "pepoltek-hrm",
    category: "saas",
    indexStr: "01",
    badge: "Enterprise HR-Tech",
    title: "AI-HRMS Candidate Screening & Matching Engine",
    type: "Enterprise SaaS & Internal Platform",
    endpoint: "portal.pepoltek.ai / audit",
    status: "Production Live",
    image: "/project_images/pepoltek-hrm.png",
    description:
      "A high-throughput talent intelligence portal translating natural language hiring queries into ranked, pre-vetted developer and clinical shortlists within seconds.",
    techStack: ["Node.js", "React.js", "Python / NLP", "Redis", "AWS Cloud"],
    impact: "Reclaimed 40+ engineering hours per hire while cutting sourcing latency by 90%.",
    metric: "40+ hrs",
    metricLabel: "Reclaimed / Hire",
  },
  {
    id: "healthtech",
    projectSlug: "erp-suite",
    category: "healthtech",
    indexStr: "02",
    badge: "Health-Tech Compliance",
    title: "Compliant Clinical EMR & FHIR Interoperability Hub",
    type: "Healthcare Distributed Infrastructure",
    endpoint: "fhir.pepoltek.health / v4",
    status: "HIPAA Validated",
    image: "/project_images/erp-suite.png",
    description:
      "Secure clinical data bridge synchronizing hospital EHR and EMR records across Epic, Cerner, and remote telehealth rotas with automated BAA and HIPAA clearance.",
    techStack: ["PHP / Laravel", "PostgreSQL", "FHIR v4 / HL7", "Docker", "HIPAA Vault"],
    impact: "Zero compliance failures with 100% data encryption and audit trail validation.",
    metric: "100%",
    metricLabel: "Audit Clearance",
  },
  {
    id: "aggregator",
    projectSlug: "bidyatek",
    category: "enterprise",
    indexStr: "03",
    badge: "Distributed Systems",
    title: "High-Throughput Global Telemetry Aggregator",
    type: "Real-Time Cloud Architecture",
    endpoint: "stream.pepoltek.net / kafka",
    status: "99.99% Uptime",
    image: "/project_images/Autonomous_AI_Software_Engineer1.png",
    description:
      "Low-latency streaming backbone processing millions of synchronous event logs across 4 global regions with zero message drops and strict backpressure safety.",
    techStack: ["Go (Golang)", "Apache Kafka", "Kubernetes", "Redis", "TypeScript"],
    impact: "99.99% system uptime sustained under peak loads with sub-10ms response latency.",
    metric: "99.99%",
    metricLabel: "System Uptime",
  },
  {
    id: "edtech-saas",
    projectSlug: "bidyatek",
    category: "saas",
    indexStr: "04",
    badge: "Cloud-Native EdTech",
    title: "BIDYATek Multi-Tenant Campus Management ERP",
    type: "Scalable Educational Infrastructure",
    endpoint: "app.bidyatek.com / core",
    status: "Cluster Deployed",
    image: "/project_images/bidyatek.png",
    description:
      "Comprehensive multi-tenant campus ERP automating student enrollment, real-time fee ledgers, automated attendance verification, and grade reporting.",
    techStack: ["Next.js", "TypeScript", "Node.js", "PostgreSQL", "Tailwind CSS"],
    impact: "Automated 40+ weekly admin hours with zero ledger reconciliation discrepancies.",
    metric: "38%",
    metricLabel: "Efficiency Gain",
  },
];

function getTechDotColor(tech: string): string {
  const lower = tech.toLowerCase();
  if (lower.includes("react")) return "bg-cyan-400";
  if (lower.includes("node")) return "bg-emerald-500";
  if (lower.includes("python")) return "bg-amber-500";
  if (lower.includes("redis")) return "bg-rose-500";
  if (lower.includes("php") || lower.includes("laravel")) return "bg-red-500";
  if (lower.includes("postgres")) return "bg-blue-500";
  if (lower.includes("go")) return "bg-sky-400";
  if (lower.includes("kafka")) return "bg-purple-500";
  if (lower.includes("kuber")) return "bg-indigo-500";
  if (lower.includes("type")) return "bg-blue-600";
  if (lower.includes("docker")) return "bg-sky-500";
  if (lower.includes("fhir") || lower.includes("hipaa")) return "bg-teal-500";
  return "bg-sky-400";
}

export default function ProductSolutions() {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [overviewProject, setOverviewProject] = useState<Project | null>(null);
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<Project | null>(null);
  const [dynamicStudies, setDynamicStudies] = useState<CaseStudyCard[]>(CASE_STUDIES);

  useEffect(() => {
    async function loadCaseStudies() {
      const sectorParam =
        activeFilter === "all"
          ? "all"
          : activeFilter === "healthtech"
          ? "healthcare"
          : "tech";
      const res = await getCaseStudiesAction(sectorParam);
      if (res.success && res.data && res.data.length > 0) {
        const mapped: CaseStudyCard[] = res.data.map((item, idx) => ({
          id: item.slug,
          projectSlug: item.slug,
          category: item.sector === "healthcare" ? "healthtech" : "enterprise",
          indexStr: `0${idx + 1}`,
          badge: item.sectorLabel,
          title: item.title,
          type: item.client,
          endpoint: `pepoltek.com / ${item.slug}`,
          status: "Verified",
          image:
            idx === 0
              ? "/project_images/pepoltek-hrm.png"
              : idx === 1
              ? "/project_images/erp-suite.png"
              : "/project_images/Autonomous_AI_Software_Engineer1.png",
          description: item.summary,
          techStack: ["Next.js", "Python", "Kubernetes", "Redis"],
          impact: item.metrics?.[0]
            ? `${item.metrics[0].label}: ${item.metrics[0].value}`
            : "Verified enterprise deployment.",
          metric: item.metrics?.[0]?.value || "100%",
          metricLabel: item.metrics?.[0]?.label || "Clearance",
        }));
        setDynamicStudies(mapped);
      }
    }
    loadCaseStudies();
  }, [activeFilter]);

  const displayedStudies =
    activeFilter === "all"
      ? dynamicStudies.slice(0, 3)
      : dynamicStudies.filter((s) => s.category === activeFilter);

  return (
    <section
      id="case-studies-section"
      className="relative w-full bg-canvas px-4 py-16 sm:px-6 sm:py-20 lg:px-10 lg:py-24"
    >
      {/* Background Ambience */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[480px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(10,132,255,0.08),transparent_65%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(rgba(10,132,255,0.06)_1px,transparent_1.4px)] [background-size:24px_24px]" />

      <div className="relative mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-electric/25 bg-electric/[0.08] px-4 py-1 font-mono text-[10.5px] font-semibold tracking-[0.16em] uppercase text-electric shadow-sm backdrop-blur-sm">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-electric shadow-[0_0_6px_rgba(10,132,255,0.6)]" />
            Verified Technical Footprint · Pepoltek Limited
          </div>

          <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-[40px] leading-[1.12] line-clamp-2 text-balance">
            Systems Built, Deployed &amp; Scaled
          </h2>

          <p className="mt-3.5 text-base sm:text-lg leading-relaxed text-ink-soft max-w-2xl">
            We do not just recruit talent; our in-house engineering team designs, builds, and maintains enterprise-grade platforms. This deep technical foundation guarantees authentic vetting for your open roles.
          </p>

          {/* Interactive Category Filter Toggles */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
            {FILTER_TABS.map((tab) => {
              const active = activeFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveFilter(tab.id)}
                  className={`rounded-xl border px-3.5 py-1.5 font-mono text-[11px] sm:text-xs font-semibold tracking-wider transition-all duration-200 cursor-pointer ${
                    active
                      ? "border-electric bg-electric text-white shadow-sm shadow-electric/30"
                      : "border-[#bcd6fa]/70 bg-white/80 text-ink-soft hover:border-electric hover:text-electric"
                  }`}
                >
                  [ {tab.label} ]
                </button>
              );
            })}
          </div>
        </div>

        {/* Crafted Technical Case Study Cards */}
        <div className="mt-12 grid grid-cols-1 gap-7 lg:grid-cols-3">
          {displayedStudies.map((study, idx) => {
            const matchingProject =
              projectsData.find((p) => p.slug === study.projectSlug) ||
              projectsData[idx] ||
              projectsData[0];

            return (
              <div
                key={study.id}
                role="button"
                tabIndex={0}
                onMouseEnter={() => setHoveredCardId(study.id)}
                onMouseLeave={() => setHoveredCardId(null)}
                onClick={() => setOverviewProject(matchingProject)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setOverviewProject(matchingProject);
                  }
                }}
                className="cursor-target group relative flex flex-col justify-between overflow-hidden rounded-[28px] border border-white/80 bg-white/50 p-5 sm:p-6 shadow-[0_20px_50px_-20px_rgba(0,102,255,0.08)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:bg-white/70 hover:border-sky-300/80 hover:shadow-[0_28px_60px_-15px_rgba(10,132,255,0.2)] cursor-pointer"
              >
                <div className="relative z-10 flex flex-1 flex-col justify-between">
                  <div>
                    {/* Card Top Header: Raw Text Serial, Category & Live Status */}
                    <div className="mb-3.5 flex items-center justify-between font-mono text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-electric tracking-wider text-[12.5px]">
                          {study.indexStr}
                        </span>
                        <span className="text-slate-300 font-light">/</span>
                        <span className="font-semibold uppercase tracking-wider text-ink-soft text-[11px]">
                          {study.badge}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 font-semibold uppercase tracking-wider text-emerald-600 text-[11px]">
                        <span className="relative flex h-2 w-2">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                        </span>
                        <span>LIVE</span>
                      </div>
                    </div>

                    {/* Visual Interface Preview Window */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-white/90 bg-gradient-to-br from-white/70 via-sky-50/40 to-blue-50/30 p-2 shadow-sm backdrop-blur-md">
                      {/* Screenshot Container with Interactive Zoom */}
                      <div className="relative h-full w-full overflow-hidden rounded-xl bg-slate-950">
                        <img
                          src={study.image}
                          alt={study.title}
                          className="h-full w-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a1428]/60 via-transparent to-transparent opacity-30 transition-opacity group-hover:opacity-10" />

                        {/* Hover Reticle Action Badge */}
                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[#0a1428]/35 opacity-0 backdrop-blur-[1px] transition-opacity duration-300 group-hover:opacity-100">
                          <div className="inline-flex items-center gap-2 rounded-lg border border-white/40 bg-white/20 px-3 py-1 font-mono text-[11px] font-bold text-white shadow-lg backdrop-blur-md">
                            <span>Inspect System Brief</span>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                              <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Title & Description */}
                    <div className="mt-4 sm:mt-5">
                      <h3 className="font-display text-lg sm:text-xl font-bold text-ink leading-snug transition-colors group-hover:text-electric">
                        {study.title}
                      </h3>
                      <span className="mt-1 block font-body text-xs sm:text-[13px] font-semibold text-[#0080ff]">
                        {study.type}
                      </span>
                      <p className="mt-2 text-xs sm:text-[13px] leading-relaxed text-ink-soft line-clamp-2">
                        {study.description}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Row: Tech Stack Chips + Circular Action Arrow Button */}
                  <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-100/80 pt-3">
                    <div className="flex flex-1 flex-wrap gap-1.5 min-w-0">
                      {study.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="inline-flex items-center gap-1 rounded-full border border-sky-100/90 bg-white/80 px-2.5 py-0.5 font-mono text-[10.5px] font-medium text-slate-700 shadow-sm backdrop-blur-sm transition-colors group-hover:border-sky-300 group-hover:bg-white"
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${getTechDotColor(tech)}`} />
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Circular Action Arrow Button */}
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-100/90 text-sky-600 shadow-sm transition-all duration-200 group-hover:bg-sky-500 group-hover:text-white group-hover:translate-x-0.5">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Section Footer CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/case-studies"
            className="group inline-flex items-center justify-center gap-2.5 rounded-xl bg-ink px-7 py-3.5 font-display text-sm font-bold text-white shadow-[0_8px_22px_-4px_rgba(10,20,40,0.45)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-electric hover:shadow-[0_12px_28px_-6px_rgba(10,132,255,0.5)] active:translate-y-0 cursor-pointer"
          >
            <span>Browse All Case Studies</span>
            <AnimatedChevrons size={14} count={3} />
          </Link>
        </div>
      </div>

      {/* Phase 2: Morphing Detail / Overview Modal */}
      {overviewProject && (
        <ProjectOverviewModal
          project={overviewProject}
          index={projectsData.findIndex((p) => p.slug === overviewProject.slug)}
          onClose={() => setOverviewProject(null)}
          onOpenCaseStudy={(proj) => {
            setOverviewProject(null);
            setSelectedCaseStudy(proj);
          }}
        />
      )}

      {/* Phase 3: Full Deep-Dive Case Study Page Modal */}
      {selectedCaseStudy && (
        <ProjectModal
          project={selectedCaseStudy}
          onClose={() => setSelectedCaseStudy(null)}
        />
      )}
    </section>
  );
}
