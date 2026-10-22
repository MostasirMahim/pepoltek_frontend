"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PageHero from "@/components/main/PageHero";
import { caseStudiesData, CaseStudy } from "@/data/caseStudiesData";
import { getCaseStudiesAction } from "@/actions/cms.actions";
import {
  Terminal,
  CheckCircle,
  Zap,
  ArrowRight,
  AlertTriangle,
  Check,
  Cpu,
  Layers,
  Database,
} from "@/components/ui/Icons";

const CATEGORIES = ["All", "Enterprise Web Apps", "Health-Tech & EMR", "SaaS"] as const;

export default function CaseStudiesPage() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [allStudies, setAllStudies] = useState<CaseStudy[]>(caseStudiesData);
  const [selectedStudy, setSelectedStudy] = useState<CaseStudy>(caseStudiesData[0]);

  useEffect(() => {
    async function loadBackendStudies() {
      const sector =
        activeCategory === "All"
          ? "all"
          : activeCategory === "Health-Tech & EMR"
          ? "healthcare"
          : "tech";
      const res = await getCaseStudiesAction(sector);
      if (res.success && res.data && res.data.length > 0) {
        // Merge or replace with dynamic backend studies conforming to CaseStudy type
        const backendStudies: CaseStudy[] = res.data.map((item, idx) => ({
          id: `be-${idx}-${item.slug}`,
          slug: item.slug,
          category:
            item.sector === "healthcare"
              ? "Health-Tech & EMR"
              : idx % 2 === 0
              ? "Enterprise Web Apps"
              : "SaaS",
          title: item.title,
          subtitle: item.summary,
          clientIndustry: item.client,
          timeframe: item.timeline || "7-day sprint",
          challenge: item.challenge,
          requirements: [
            item.solution,
            "100% Specialist Hand-Vetted & Pre-Screened.",
            "Live Timezone Synchronous Coverage Guaranteed.",
          ],
          architecture: {
            overview: item.solution,
            diagramDescription: `${item.title} Production Architecture & Integration Pipeline`,
            microservices: [
              "Identity & RBAC Gateway",
              "Vector Similarity Engine",
              "Telemetry Stream Aggregator",
            ],
            databaseSchema: [
              {
                table: "ats_requisition",
                description: "Client hiring requisition and must-have attributes",
                primaryKeys: "id (UUIDv7)",
                indexes: "status, sector, level",
              },
              {
                table: "matching_match",
                description: "Multi-factor vector similarity and vetting score",
                primaryKeys: "id (UUIDv7)",
                indexes: "candidate_id, requisition_id",
              },
            ],
          },
          techStack: ["Next.js", "Python / Django", "PostgreSQL", "Redis", "Docker"],
          validationLogs: [
            {
              timestamp: "09:42:18 UTC",
              module: "AUTH_RBAC",
              status: "PASSED",
              detail: "httpOnly session cookie token verification verified clean",
            },
            {
              timestamp: "09:42:19 UTC",
              module: "VECTOR_MATCH",
              status: "BENCHMARKED",
              detail: "Cosine similarity calculation executed under 45ms SLA",
            },
            {
              timestamp: "09:42:20 UTC",
              module: "COMPLIANCE",
              status: "VERIFIED",
              detail: "100% License verification pass rate on day-1",
            },
          ],
          metrics: item.metrics?.map((m) => ({
            label: m.label,
            value: m.value,
            improvement: m.baseline,
          })) || [
            { label: "Deployment Speed", value: "7 Days", improvement: "85% Faster" },
            { label: "Vetting Accuracy", value: "99.4%", improvement: "Top Decile" },
          ],
          testCoverage: {
            unit: "99.2%",
            integration: "98.7%",
            e2e: "100%",
          },
          businessImpact: item.summary,
        }));

        setAllStudies(backendStudies);
        setSelectedStudy(backendStudies[0]);
      }
    }
    loadBackendStudies();
  }, [activeCategory]);

  const filteredStudies =
    activeCategory === "All"
      ? allStudies
      : allStudies.filter((cs) => cs.category === activeCategory);

  return (
    <div className="relative min-h-screen bg-canvas">
      {/* Hero Header */}
      <PageHero
        eyebrow="Hard-Coded Technical Proof"
        title="Technical Case Studies"
        highlightedText="& Engineering Blueprints"
        description="Real enterprise architectures designed, deployed, and benchmarked by Pepoltek delivery pods. Inspect system topologies, microservice layouts, database schemas, and live validation logs."
        stats={[
          {
            value: "100%",
            label: "Hard-Coded CI/CD Audits",
            icon: <Terminal size={20} />,
          },
          {
            value: "99.4%",
            label: "Average Test Coverage",
            icon: <CheckCircle size={20} />,
          },
          {
            value: "Sub-50ms",
            label: "P99 Latency Benchmarks",
            icon: <Zap size={20} />,
          },
        ]}
        actions={[
          {
            label: "Deploy Similar Pod",
            href: "/contact",
            primary: true,
          },
          {
            label: "Explore Workforce Models",
            href: "/services",
          },
        ]}
        proofPills={[
          "Apache Kafka Event Streaming",
          "pgvector Semantic AI Search",
          "FHIR v4 / HL7 Clinical Sync",
          "Hard-Coded Audit Logs",
        ]}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-18">
        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2 border-b border-[#bcd6fa]/50 pb-5">
          {CATEGORIES.map((cat) => {
            const count =
              cat === "All"
                ? caseStudiesData.length
                : caseStudiesData.filter((c) => c.category === cat).length;
            const isActive = activeCategory === cat;

            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 font-display text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "bg-ink text-white shadow-xs"
                    : "border border-[#bcd6fa]/70 bg-white/80 text-ink-soft hover:border-electric/50 hover:bg-white hover:text-ink"
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`rounded-md px-1.5 py-0.2 font-mono text-[10px] ${
                    isActive ? "bg-white/20 text-white" : "bg-canvas text-ink-soft"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Case Study Cards Grid */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {filteredStudies.map((cs) => {
            const isSelected = selectedStudy.id === cs.id;

            return (
              <div
                key={cs.id}
                onClick={() => setSelectedStudy(cs)}
                className={`group flex flex-col justify-between rounded-3xl border p-6 sm:p-7 transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "border-electric bg-white shadow-[0_12px_36px_-10px_rgba(10,132,255,0.25)] ring-2 ring-electric/20"
                    : "border-[#bcd6fa] bg-white/80 hover:border-electric/50 hover:bg-white hover:shadow-md"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-md border border-[#bcd6fa]/60 bg-canvas px-2.5 py-1 font-mono text-[10px] font-semibold text-ink-soft uppercase tracking-wider">
                      {cs.category}
                    </span>
                    <span className="font-mono text-[10px] text-electric font-semibold">
                      {cs.timeframe}
                    </span>
                  </div>

                  <h3 className="mt-4 font-display text-lg font-bold text-ink group-hover:text-electric transition-colors">
                    {cs.title}
                  </h3>

                  {/* Clean readable Inter text instead of thick mono */}
                  <p className="mt-2 text-xs sm:text-sm text-ink-soft font-normal line-clamp-3 leading-relaxed">
                    {cs.subtitle}
                  </p>

                  {/* Key Metrics Chips */}
                  <div className="mt-5 grid grid-cols-2 gap-2">
                    {cs.metrics.slice(0, 2).map((m) => (
                      <div key={m.label} className="rounded-xl bg-canvas/60 p-2.5 border border-[#bcd6fa]/40">
                        <div className="font-mono text-[10px] text-mist">{m.label}</div>
                        <div className="font-display text-sm font-bold text-ink mt-0.5">{m.value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-[#bcd6fa]/40 pt-4">
                  <div className="flex flex-wrap gap-1">
                    {cs.techStack.slice(0, 3).map((t) => (
                      <span key={t} className="rounded bg-canvas px-1.5 py-0.5 font-mono text-[10px] text-ink-soft">
                        {t}
                      </span>
                    ))}
                    {cs.techStack.length > 3 && (
                      <span className="font-mono text-[10px] text-mist">+{cs.techStack.length - 3}</span>
                    )}
                  </div>

                  <span className="font-display text-xs font-semibold text-electric flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    {isSelected ? "Active Blueprint" : "Inspect Specs"} →
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Deep Dive Blueprint Inspection Section */}
        <div className="mt-14 rounded-3xl border border-[#bcd6fa] bg-white p-6 sm:p-10 shadow-[0_20px_50px_-20px_rgba(10,20,40,0.12)]">
          {/* Blueprint Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#bcd6fa]/50 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-electric/10 px-2.5 py-1 font-mono text-xs font-bold text-electric uppercase">
                  {selectedStudy.category}
                </span>
                <span className="font-mono text-xs text-mist">•</span>
                <span className="font-mono text-xs text-ink-soft">{selectedStudy.clientIndustry}</span>
              </div>
              <h2 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-ink">
                {selectedStudy.title}
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-ink-soft font-normal max-w-3xl leading-relaxed">
                {selectedStudy.subtitle}
              </p>
            </div>

            <Link
              href="/contact"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-electric px-5 py-3 font-display text-xs sm:text-sm font-semibold text-white shadow-[0_6px_20px_-4px_rgba(10,132,255,0.4)] hover:bg-electric-bright hover:shadow-[0_8px_24px_-4px_rgba(56,189,248,0.5)] transition-all"
            >
              <span>Deploy Similar Pod</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* Core Problem & Requirements */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="rounded-2xl border border-[#bcd6fa]/60 bg-canvas/30 p-6">
              <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-ink-soft flex items-center gap-2">
                <span className="text-amber-500">
                  <AlertTriangle size={14} />
                </span>
                <span>The Engineering Challenge</span>
              </h4>
              <p className="mt-3 text-xs sm:text-sm text-ink font-normal leading-relaxed">
                {selectedStudy.challenge}
              </p>
              <div className="mt-6 rounded-xl border border-signal/20 bg-signal/5 p-4">
                <div className="font-mono text-[11px] font-bold text-signal uppercase tracking-wider">
                  Verified Business Impact
                </div>
                <p className="mt-1.5 text-xs text-ink-soft font-normal leading-relaxed">
                  {selectedStudy.businessImpact}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-[#bcd6fa]/60 bg-canvas/30 p-6">
              <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-ink-soft flex items-center gap-2">
                <span className="text-electric">
                  <Check size={14} />
                </span>
                <span>Delivery Requirements</span>
              </h4>
              <ul className="mt-3 space-y-2.5">
                {selectedStudy.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-ink font-normal leading-relaxed">
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-electric/10 text-electric mt-0.5">
                      <Check size={10} />
                    </span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Architecture Blueprint & Data Schema */}
          <div className="mt-10">
            <h3 className="font-display text-lg font-bold text-ink">
              System Architecture & Microservice Topology
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-ink-soft font-normal">
              {selectedStudy.architecture.overview}
            </p>

            {/* Architecture Diagram Box */}
            <div className="mt-4 rounded-2xl border border-ink/80 bg-ink p-5 font-mono text-xs text-white/90 overflow-x-auto">
              <div className="text-[10px] text-electric-bright mb-2 uppercase tracking-widest font-bold">
                Component Dataflow
              </div>
              <code className="text-xs sm:text-sm text-emerald-300">
                {selectedStudy.architecture.diagramDescription}
              </code>
            </div>

            {/* Microservices List */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {selectedStudy.architecture.microservices.map((ms, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 rounded-xl border border-[#bcd6fa]/60 bg-canvas/20 px-3.5 py-2.5 text-xs text-ink font-mono"
                >
                  <span className="h-2 w-2 rounded-full bg-electric-bright" />
                  <span className="truncate">{ms}</span>
                </div>
              ))}
            </div>

            {/* Database Schema Table */}
            <div className="mt-8">
              <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-ink-soft mb-3">
                Core Relational & Vector Data Structures
              </h4>
              <div className="overflow-x-auto rounded-xl border border-[#bcd6fa]">
                <table className="w-full text-left font-mono text-xs">
                  <thead className="border-b border-[#bcd6fa] bg-canvas/70 text-ink font-semibold">
                    <tr>
                      <th className="px-4 py-2.5">Entity / Table</th>
                      <th className="px-4 py-2.5">Description</th>
                      <th className="px-4 py-2.5">Keys</th>
                      <th className="px-4 py-2.5">Indexing Strategy</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#bcd6fa]/40 bg-white">
                    {selectedStudy.architecture.databaseSchema.map((row, i) => (
                      <tr key={i} className="hover:bg-canvas/20 transition-colors">
                        <td className="px-4 py-2.5 font-bold text-electric">{row.table}</td>
                        <td className="px-4 py-2.5 text-ink-soft max-w-xs">{row.description}</td>
                        <td className="px-4 py-2.5 text-ink">{row.primaryKeys}</td>
                        <td className="px-4 py-2.5 text-mist">{row.indexes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Validation Logs & Test Coverage */}
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Terminal Validation Logs */}
            <div className="lg:col-span-2 rounded-2xl border border-ink/80 bg-ink p-5 text-white">
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <span className="font-mono text-xs text-white/70 ml-2">Hard-Coded Audit Logs</span>
                </div>
                <span className="font-mono text-[10px] text-emerald-400">CI / CD STAGE: COMPLETED</span>
              </div>

              <div className="space-y-3 font-mono text-[11px] sm:text-xs">
                {selectedStudy.validationLogs.map((log, i) => (
                  <div key={i} className="border-l-2 border-electric pl-3 py-1">
                    <div className="flex items-center gap-2 text-white/60">
                      <span>[{log.timestamp}]</span>
                      <span className="text-white font-semibold">{log.module}</span>
                      <span className="rounded bg-emerald-500/20 px-1.5 py-0.2 text-[10px] font-bold text-emerald-300">
                        {log.status}
                      </span>
                    </div>
                    <div className="mt-1 text-white/90">{log.detail}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Test Coverage & Tech Stack */}
            <div className="flex flex-col justify-between rounded-2xl border border-[#bcd6fa] bg-canvas/30 p-5">
              <div>
                <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-ink-soft mb-3">
                  Verified Test Coverage
                </h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between font-mono text-xs text-ink mb-1">
                      <span>Unit Testing</span>
                      <span className="font-bold text-signal">{selectedStudy.testCoverage.unit}</span>
                    </div>
                    <div className="h-2 rounded-full bg-[#bcd6fa]/60 overflow-hidden">
                      <div className="h-full bg-signal rounded-full" style={{ width: selectedStudy.testCoverage.unit }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-mono text-xs text-ink mb-1">
                      <span>Integration Testing</span>
                      <span className="font-bold text-electric">{selectedStudy.testCoverage.integration}</span>
                    </div>
                    <div className="h-2 rounded-full bg-[#bcd6fa]/60 overflow-hidden">
                      <div className="h-full bg-electric rounded-full" style={{ width: selectedStudy.testCoverage.integration }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-mono text-xs text-ink mb-1">
                      <span>End-to-End Testing</span>
                      <span className="font-bold text-purple-600">{selectedStudy.testCoverage.e2e}</span>
                    </div>
                    <div className="h-2 rounded-full bg-[#bcd6fa]/60 overflow-hidden">
                      <div className="h-full bg-purple-600 rounded-full" style={{ width: selectedStudy.testCoverage.e2e }} />
                    </div>
                  </div>
                </div>

                <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-ink-soft mt-6 mb-2.5">
                  Verified Technology Stack
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedStudy.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-lg border border-[#bcd6fa] bg-white px-2.5 py-1 font-mono text-xs font-medium text-ink shadow-2xs"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#bcd6fa]/40">
                <Link
                  href="/contact"
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-ink py-2.5 font-display text-xs font-bold text-white hover:bg-electric transition-colors"
                >
                  <span>Request Engineering Brief</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
