"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { AnimatedChevrons } from "@/components/ui/AnimatedChevrons";
import { submitLeadAction } from "@/actions/leads.actions";

/* ==========================================================================
   WIDGET 2: EXHAUSTIVE STACK & TECHNOLOGY MASTER LIST
   Directly from Audit Spec Section 3.C
   ========================================================================== */
export interface StackCategory {
  id: string;
  name: string;
  shortName: string;
  tags: string[];
}

export const ALL_STACK_CATEGORIES: StackCategory[] = [
  {
    id: "fullstack",
    name: "Full Stack Systems",
    shortName: "Full Stack",
    tags: ["Next.js 15", "TypeScript", "React.js", "Node.js", "Vue.js / Nuxt", "Laravel + Vue", "Python + React"],
  },
  {
    id: "backend",
    name: "Distributed Backend",
    shortName: "Backend",
    tags: ["Go (Golang)", "Python (FastAPI/Django)", "PHP / Laravel", "Java / Spring Boot", "Rust", "C# / .NET", "Microservices", "Kafka", "WebSockets"],
  },
  {
    id: "frontend",
    name: "Frontend Architecture",
    shortName: "Frontend",
    tags: ["React.js", "Next.js 15", "Vue.js", "TypeScript", "Angular", "Tailwind CSS", "Web Performance Optimization"],
  },
  {
    id: "devops",
    name: "Cloud, DevOps & Security",
    shortName: "Cloud & DevOps",
    tags: ["AWS", "Cloud Native Kubernetes (K8s)", "Docker", "Terraform (IaC)", "CI/CD Pipelines", "Zero-Trust Architecture", "SOC 2 Compliance"],
  },
  {
    id: "data_ai",
    name: "Database & AI/Data Eng",
    shortName: "Database & AI",
    tags: ["PostgreSQL", "Redis", "pgvector / Vector DBs (RAG Architecture)", "GraphQL", "MongoDB", "MySQL", "Data Engineering"],
  },
  {
    id: "qa",
    name: "Quality Assurance (QA)",
    shortName: "Quality Assurance",
    tags: ["Automation QA (Cypress/Playwright/Selenium)", "Manual Triage", "Performance & Load Testing"],
  },
  {
    id: "health_it",
    name: "Healthcare IT & Clinical",
    shortName: "Healthcare IT",
    tags: ["NHS Clinical Interoperability", "FHIR v4 / HL7", "HIPAA Title II", "PCI DSS", "EMR/EHR (Epic/Cerner)", "Acute Triage"],
  },
  {
    id: "sales_ops",
    name: "Sales, Admin & HR Ops",
    shortName: "Sales & HR Ops",
    tags: ["B2B Field Sales", "Revenue Ops", "Admin Leadership", "Fractional HR", "Employee SOPs", "KPI Frameworks"],
  },
];

/* ==========================================================================
   SENIORITY TIERS & RATE PARAMETERS
   Hardcoded Rates from Audit Spec Section 5.A
   ========================================================================== */
export interface SeniorityOption {
  id: string;
  name: string;
  shortName: string;
  marketSalary: number;
  experience: string;
}

export const ALL_SENIORITY_TIERS: SeniorityOption[] = [
  { id: "Junior", name: "Junior Specialist", shortName: "Junior", marketSalary: 60000, experience: "1 to 2 yrs exp" },
  { id: "Mid-Level", name: "Mid-Level Engineer", shortName: "Mid-Level", marketSalary: 80000, experience: "3 to 5 yrs exp" },
  { id: "Senior", name: "Senior Specialist", shortName: "Senior", marketSalary: 120000, experience: "5 to 8 yrs exp" },
  { id: "Lead / Architect", name: "Lead / Systems Architect", shortName: "Lead", marketSalary: 160000, experience: "8+ yrs exp" },
  { id: "Staff Engineer", name: "Staff Engineer", shortName: "Staff Eng", marketSalary: 175000, experience: "10+ yrs exp" },
  { id: "Principal Architect", name: "Principal Architect", shortName: "Principal", marketSalary: 200000, experience: "Enterprise Architecture" },
  { id: "Engineering Director", name: "Engineering Director", shortName: "Director", marketSalary: 225000, experience: "Org Tech Leadership" },
  { id: "Fractional CTO", name: "Fractional CTO / Advisor", shortName: "Frac. CTO", marketSalary: 250000, experience: "Executive Technical Strategy" },
];

/* 6 Standardized Client & Delivery Sourcing Regions from Audit Spec Section 2.B */
export interface SourcingRegion {
  id: string;
  label: string;
  shortLabel: string;
  tierTag: string;
  pricingTier: "offshore" | "nearshore" | "onshore";
}

export const ALL_REGIONS: SourcingRegion[] = [
  {
    id: "south_asia",
    label: "South Asia & APAC (Bangladesh, India)",
    shortLabel: "South Asia / APAC",
    tierTag: "Delivery Hub",
    pricingTier: "offshore",
  },
  {
    id: "latam",
    label: "LATAM Nearshore (Mexico, Brazil, Colombia)",
    shortLabel: "LATAM Nearshore",
    tierTag: "Nearshore",
    pricingTier: "nearshore",
  },
  {
    id: "cee",
    label: "CEE & Eastern Europe (Poland, Romania)",
    shortLabel: "CEE & Eastern Europe",
    tierTag: "Nearshore",
    pricingTier: "nearshore",
  },
  {
    id: "north_america",
    label: "North America (United States & Canada)",
    shortLabel: "North America (US/CA)",
    tierTag: "Onshore",
    pricingTier: "onshore",
  },
  {
    id: "uk_europe",
    label: "UK & Western Europe (UK, Germany, France)",
    shortLabel: "UK & Western Europe",
    tierTag: "Onshore",
    pricingTier: "onshore",
  },
  {
    id: "middle_east",
    label: "Middle East & GCC (UAE, Saudi, Qatar)",
    shortLabel: "Middle East & GCC",
    tierTag: "Onshore",
    pricingTier: "onshore",
  },
];

/* Pricing rates from Section 5.A */
export const PRICING_TIER_RATES: Record<string, Record<string, number>> = {
  offshore: {
    Junior: 1920,             // $12/hr | $1,920/mo
    "Mid-Level": 4000,        // $25/hr | $4,000/mo
    Senior: 7200,             // $45/hr | $7,200/mo
    "Lead / Architect": 10400,// $65/hr | $10,400/mo
  },
  nearshore: {
    Junior: 3200,             // $20/hr | $3,200/mo
    "Mid-Level": 5600,        // $35/hr | $5,600/mo
    Senior: 9600,             // $60/hr | $9,600/mo
    "Lead / Architect": 13600,// $85/hr | $13,600/mo
  },
  onshore: {
    Junior: 5600,             // $35/hr | $5,600/mo
    "Mid-Level": 8800,        // $55/hr | $8,800/mo
    Senior: 15200,            // $95/hr | $15,200/mo
    "Lead / Architect": 17600,// $110/hr | $17,600/mo
  },
};

export function getRegionalRate(regionId: string, tierId: string): number {
  if (!regionId || !tierId) return 0;
  const reg = ALL_REGIONS.find((r) => r.id === regionId);
  if (!reg) return 0;
  const rates = PRICING_TIER_RATES[reg.pricingTier] || PRICING_TIER_RATES.offshore;
  return rates[tierId] || 0;
}

/* Dedicated Virtual Recruiter / Sourcer Add-On from Section 5.A */
export const DEDICATED_SOURCER_FEE = 1280; // $8/hr | $1,280/mo

export function formatMoney(n: number) {
  return "$" + Math.round(n).toLocaleString("en-US");
}

/* ==========================================================================
   COMPACT HARDWARE CALCULATOR FRAME (Clean Titanium Bezel)
   ========================================================================== */
export function DeviceFrame({ children }: { children: React.ReactNode }) {
  const edgeTicks = Array.from({ length: 9 });
  return (
    <div id="calculator-device-anchor" className="relative w-full">
      {/* Clean, static hardware bezel */}
      <div
        id="calculator-outer-bezel"
        className="relative rounded-[1.2rem] bg-[linear-gradient(150deg,#f9fbff,#e9f1fb_45%,#f2f6fe)] p-1.5 shadow-[0_12px_28px_-10px_rgba(10,20,40,0.12)] ring-1 ring-[#bcd6fa]/80 transition-all"
      >
        {/* Inner dark casing border */}
        <div className="relative rounded-[1rem] bg-[#0a1428] p-[2.5px] shadow-[inset_0_2px_6px_rgba(0,0,0,0.4)] border border-[#1b2a45]">
          {/* Top Titlebar / OS Header */}
          <div className="flex items-center justify-between px-2.5 py-1 bg-[#0a1428]">
            <div className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-signal" />
              <span className="h-1.5 w-1.5 rounded-full bg-electric-bright/80" />
              <span className="h-1.5 w-1.5 rounded-full bg-white/30" />
            </div>
            <span className="font-mono text-[8px] font-medium tracking-[0.24em] text-white uppercase opacity-90">
              PEPOLTEK · OS RPO CALCULATOR v2.4
            </span>
            <div className="flex items-center gap-1">
              <span className="h-1 w-3.5 rounded-full bg-white/20" />
              <span className="h-1.5 w-1.5 rounded-full bg-electric-bright shadow-[0_0_4px_rgba(56,189,248,0.8)]" />
            </div>
          </div>

          {/* Calculator Screen Surface */}
          <div className="relative overflow-visible rounded-[0.8rem] bg-[linear-gradient(165deg,#fcfdff_0%,#f4f8fe_100%)]">
            {children}
          </div>
        </div>

        {/* Calibrated Edge Ticks on sides */}
        <div className="pointer-events-none absolute -left-[1px] top-1/2 flex -translate-y-1/2 flex-col gap-1.5">
          {edgeTicks.map((_, i) => (
            <span
              key={i}
              className={`h-px ${i % 3 === 0 ? "w-1.5 bg-electric/60" : "w-1 bg-[#9ec1f0]"}`}
            />
          ))}
        </div>
        <div className="pointer-events-none absolute -right-[1px] top-1/2 flex -translate-y-1/2 flex-col items-end gap-1.5">
          {edgeTicks.map((_, i) => (
            <span
              key={i}
              className={`h-px ${i % 3 === 0 ? "w-1.5 bg-electric/60" : "w-1 bg-[#9ec1f0]"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   MAIN RPO CALCULATOR COMPONENT
   ========================================================================== */
export interface SquadRole {
  instanceId: string;
  categoryId: string;
  seniorityId: string;
  headcount: number;
  regionId: string;
  selectedTags: string[];
}

export default function RpoCalculator() {
  /* Active squad configuration state: Modular Role Cards - starts empty (0 cost) by default */
  const [activeRoles, setActiveRoles] = useState<SquadRole[]>([]);

  /* Billing commitment term: Monthly Sprint or 6-Month Commitment (-10%) per Section 4 */
  const [commitmentTerm, setCommitmentTerm] = useState<"monthly" | "semiAnnual">("monthly");

  /* Accordion state: only 1 role card is open at a time */
  const [openRoleId, setOpenRoleId] = useState<string | null>(null);

  const toggleRoleCollapse = (instanceId: string) => {
    setOpenRoleId((prev) => (prev === instanceId ? null : instanceId));
  };

  /* Proposal Modal state */
  const [isProposalOpen, setIsProposalOpen] = useState<boolean>(false);
  const [leadForm, setLeadForm] = useState({ name: "", email: "", company: "" });
  const [isSubmittingLead, setIsSubmittingLead] = useState<boolean>(false);
  const [leadSubmitSuccess, setLeadSubmitSuccess] = useState<string | null>(null);
  const [leadSubmitError, setLeadSubmitError] = useState<string | null>(null);

  const handleProposalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadForm.name || !leadForm.email || !leadForm.company) {
      setLeadSubmitError("Please provide your name, work email, and company.");
      return;
    }
    setIsSubmittingLead(true);
    setLeadSubmitError(null);
    const res = await submitLeadAction({
      contact_name: leadForm.name,
      work_email: leadForm.email,
      company: leadForm.company,
      source: "calculator",
      headcount: calc.totalHeadcount,
      calculator_snapshot: {
        monthlyDeploymentCost: calc.monthlyDeploymentCost,
        traditionalAgencyPlacementFee: calc.traditionalAgencyPlacementFee,
        netFirstMonthSavings: calc.netFirstMonthSavings,
        savingsPercent: calc.savingsPercent,
        commitmentTerm,
        roles: activeRoles,
      },
    });

    setIsSubmittingLead(false);
    if (res.success) {
      const cleanLeadId = res.leadId ? String(res.leadId).replace(/-/g, "").slice(-6).toUpperCase() : "";
      setLeadSubmitSuccess(
        `Proposal locked and requisition registered successfully! Requisition ID: ${cleanLeadId}`
      );
    } else {
      setLeadSubmitError(res.error?.message || "Failed to submit proposal request.");
    }
  };

  /* Close modal on ESC */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsProposalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  /* Wheel scroll interception to guarantee container scrolls on hover without scrolling the webpage */
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      e.stopPropagation();

      const { scrollTop, scrollHeight, clientHeight } = el;
      const canScrollDown = e.deltaY > 0 && scrollTop + clientHeight < scrollHeight;
      const canScrollUp = e.deltaY < 0 && scrollTop > 0;

      if (canScrollDown || canScrollUp) {
        el.scrollTop += e.deltaY;
        e.preventDefault();
      }
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", handleWheel);
    };
  }, []);

  const addRole = (categoryId: string) => {
    const category = ALL_STACK_CATEGORIES.find((c) => c.id === categoryId);
    if (!category) return;
    const newInstanceId = `role_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const newRole: SquadRole = {
      instanceId: newInstanceId,
      categoryId,
      seniorityId: "Senior",
      headcount: 1,
      regionId: "", // unselected by default, prompt user to select region
      selectedTags: category.tags.slice(0, 3),
    };
    setActiveRoles((prev) => [...prev, newRole]);
    // Automatically open newly added role and collapse any others
    setOpenRoleId(newInstanceId);
  };

  const removeRole = (instanceId: string) => {
    setActiveRoles((prev) => prev.filter((r) => r.instanceId !== instanceId));
    setOpenRoleId((prev) => (prev === instanceId ? null : prev));
  };

  const updateRole = (instanceId: string, updates: Partial<SquadRole>) => {
    setActiveRoles((prev) =>
      prev.map((role) => (role.instanceId === instanceId ? { ...role, ...updates } : role))
    );
  };

  const toggleRoleTag = (instanceId: string, tag: string) => {
    setActiveRoles((prev) =>
      prev.map((role) => {
        if (role.instanceId !== instanceId) return role;
        const exists = role.selectedTags.includes(tag);
        const updated = exists
          ? role.selectedTags.filter((t) => t !== tag)
          : [...role.selectedTags, tag];
        return { ...role, selectedTags: updated };
      })
    );
  };

  /* Mathematical calculation logic directly from Audit Spec Section 5.B */
  const calc = useMemo(() => {
    let totalHeadcount = 0;
    let totalRpoRolesCost = 0;
    let totalAgencyPlacementFee = 0;
    let configuredRolesCount = 0;

    activeRoles.forEach((role) => {
      if (role.headcount > 0) {
        totalHeadcount += role.headcount;

        if (role.regionId) {
          configuredRolesCount += 1;
          const monthlyRate = getRegionalRate(role.regionId, role.seniorityId);
          totalRpoRolesCost += monthlyRate * role.headcount;

          const tier = ALL_SENIORITY_TIERS.find((t) => t.id === role.seniorityId);
          const annualSalary = tier ? tier.marketSalary : 120000;
          totalAgencyPlacementFee += annualSalary * 0.20 * role.headcount;
        }
      }
    });
    const hasConfiguredRoles = configuredRolesCount > 0;
    const baseMonthlyCost =
      totalRpoRolesCost + (hasConfiguredRoles ? DEDICATED_SOURCER_FEE : 0);
    const discountFactor = commitmentTerm === "semiAnnual" ? 0.90 : 1.0;
    const monthlyDeploymentCost = Math.round(baseMonthlyCost * discountFactor);
    const netFirstMonthSavings = Math.max(
      0,
      totalAgencyPlacementFee - monthlyDeploymentCost
    );
    const savingsPercent =
      totalAgencyPlacementFee > 0
        ? Math.round((netFirstMonthSavings / totalAgencyPlacementFee) * 100)
        : 0;

    const uniqueStackIds = new Set(activeRoles.map((r) => r.categoryId));

    return {
      totalHeadcount,
      activeRolesCount: activeRoles.length,
      configuredRolesCount,
      activeStacksCount: uniqueStackIds.size,
      monthlyDeploymentCost,
      baseMonthlyCost,
      totalRpoRolesCost,
      traditionalAgencyPlacementFee: totalAgencyPlacementFee,
      netFirstMonthSavings,
      savingsPercent,
    };
  }, [activeRoles, commitmentTerm]);

  return (
    <div className="w-full">
      <DeviceFrame>
        <div className="p-3 sm:p-3.5 space-y-2.5">
          {/* 1. TOP DIGITAL LCD DISPLAY READOUT (Section 5.B Math Output) */}
          <div className="rounded-xl bg-[#0a1428] p-2.5 sm:p-3 text-white border border-[#1d2d48] shadow-inner">
            <div className="flex items-baseline justify-between gap-2">
              <div>
                <div className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-baseline gap-1">
                  {formatMoney(calc.monthlyDeploymentCost)}
                  <span className="font-sans text-xs sm:text-sm font-normal text-white/70">/ mo</span>
                </div>
                <div className="font-sans text-xs text-electric-bright/90 font-medium mt-0.5">
                  {calc.configuredRolesCount > 0 ? (
                    commitmentTerm === "semiAnnual" ? (
                      `Base: ${formatMoney(calc.totalRpoRolesCost)} + $1,280 sourcer (-10% applied)`
                    ) : (
                      `Base: ${formatMoney(calc.totalRpoRolesCost)} + $1,280 dedicated sourcer`
                    )
                  ) : (
                    "Base: $0 + $0 sourcer"
                  )}
                </div>
              </div>

              <div className="text-right">
                <div className="font-sans text-xs text-white/50 line-through">
                  Agency: {formatMoney(calc.traditionalAgencyPlacementFee)}
                </div>
                <div className="font-sans text-xs sm:text-sm font-bold text-signal flex items-center justify-end gap-1.5 mt-0.5">
                  <span>Saves: {formatMoney(calc.netFirstMonthSavings)}</span>
                  <span className="font-mono text-[9.5px] font-bold rounded bg-signal/20 px-1.5 py-0.5 text-signal">
                    {calc.savingsPercent}%
                  </span>
                </div>
              </div>
            </div>

            {/* Dynamic Output Copy directly from Section 5.B.3 */}
            <div className="mt-1.5 pt-1.5 border-t border-white/10 font-sans text-xs text-white/85 leading-normal flex items-center gap-1.5">
              {calc.configuredRolesCount > 0 ? (
                <>
                  <span className="text-signal font-bold">✓</span>
                  <span className="truncate">
                    Saves {formatMoney(calc.netFirstMonthSavings)} in upfront placement fees while cutting time-to-fill from 45 days to 7 days.
                  </span>
                </>
              ) : activeRoles.length > 0 ? (
                <>
                  <span className="text-amber-400 font-bold">!</span>
                  <span className="truncate text-amber-200">
                    Select a sourcing region above for each role to calculate exact monthly rates.
                  </span>
                </>
              ) : (
                <>
                  <span className="text-electric-bright font-bold">ℹ</span>
                  <span className="truncate">
                    Select specializations below to configure your squad and calculate real-time savings.
                  </span>
                </>
              )}
            </div>

            {/* Billing Commitment Term Toggle from Section 4 */}
            <div className="mt-1.5 pt-1.5 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="text-white/60 font-medium text-[11px]">Commitment Term:</span>
              <div className="inline-flex rounded-lg bg-white/10 p-0.5">
                <button
                  type="button"
                  onClick={() => setCommitmentTerm("monthly")}
                  className={`px-2 py-0.5 rounded-md font-sans text-[10.5px] font-semibold transition-all cursor-pointer ${
                    commitmentTerm === "monthly"
                      ? "bg-electric text-white shadow-2xs"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  Monthly Sprint
                </button>
                <button
                  type="button"
                  onClick={() => setCommitmentTerm("semiAnnual")}
                  className={`px-2 py-0.5 rounded-md font-sans text-[10.5px] font-semibold transition-all cursor-pointer ${
                    commitmentTerm === "semiAnnual"
                      ? "bg-electric text-white shadow-2xs"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  6-Month Squad (-10%)
                </button>
              </div>
            </div>
          </div>

          {/* 2. MODULAR ROLE & STACK CONFIGURATION CARDS */}
          <div
            ref={scrollContainerRef}
            data-lenis-prevent="true"
            className={`overflow-y-auto overscroll-contain space-y-2 pr-0.5 thin-scrollbar transition-all ${
              calc.monthlyDeploymentCost > 0
                ? "max-h-[260px] sm:max-h-[280px]"
                : "max-h-[310px] sm:max-h-[330px]"
            }`}
          >
            {/* Active Squad Roles List */}
            {activeRoles.map((role) => {
              const category =
                ALL_STACK_CATEGORIES.find((c) => c.id === role.categoryId) ||
                ALL_STACK_CATEGORIES[0];
              const isCollapsed = openRoleId !== role.instanceId;
              const currentRegion = ALL_REGIONS.find((r) => r.id === role.regionId);
              const rate = getRegionalRate(role.regionId, role.seniorityId);

              return (
                <div
                  key={role.instanceId}
                  className={`rounded-xl border border-[#bcd6fa]/70 bg-white shadow-xs transition-all hover:border-electric/50 ${
                    isCollapsed ? "p-3" : "p-3 sm:p-3.5 space-y-3"
                  }`}
                >
                  {/* Module Header with Active [✓], Name, Summary, Chevron and Cross */}
                  <div
                    onClick={() => toggleRoleCollapse(role.instanceId)}
                    className={`flex items-center justify-between gap-2 cursor-pointer select-none ${
                      isCollapsed ? "" : "border-b border-[#bcd6fa]/35 pb-2"
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-md bg-electric text-white text-[11px] font-bold">
                        ✓
                      </span>
                      <span className="font-display text-xs sm:text-[13px] font-bold uppercase tracking-tight text-ink truncate">
                        {category.name}
                      </span>
                      <span className="font-sans text-xs text-electric font-medium shrink-0">
                        ({role.headcount}x {role.seniorityId}{currentRegion ? ` · ${currentRegion.shortLabel}` : " · Select Region"})
                      </span>
                    </div>

                    <div
                      className="flex items-center gap-1 shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Down Chevron toggle button */}
                      <button
                        type="button"
                        onClick={() => toggleRoleCollapse(role.instanceId)}
                        className="flex h-6 w-6 items-center justify-center rounded-md text-slate-500 hover:text-ink hover:bg-canvas transition-all cursor-pointer"
                        title={isCollapsed ? "Expand role" : "Collapse role"}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className={`transition-transform duration-200 ${
                            isCollapsed ? "-rotate-90 text-slate-400" : "rotate-0 text-slate-700"
                          }`}
                        >
                          <path d="M6 9l6 6 6-6" />
                        </svg>
                      </button>

                      <button
                        type="button"
                        onClick={() => removeRole(role.instanceId)}
                        className="flex h-6 w-6 items-center justify-center rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 text-sm font-bold cursor-pointer transition-colors"
                        title="Remove role from squad"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  {!isCollapsed && (
                    <>
                      {/* 1. Seniority Level Selector */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-sans text-xs font-semibold text-slate-600">
                            Seniority Tier:
                          </span>
                          <span className="font-sans text-xs text-slate-400">
                            {ALL_SENIORITY_TIERS.find((t) => t.id === role.seniorityId)?.experience || "Select level"}
                          </span>
                        </div>
                        <div className="grid grid-cols-4 gap-1.5">
                          {ALL_SENIORITY_TIERS.slice(0, 4).map((tier) => {
                            const isTierSelected = role.seniorityId === tier.id;
                            const tierRate = role.regionId ? getRegionalRate(role.regionId, tier.id) : null;
                            return (
                              <button
                                key={tier.id}
                                type="button"
                                onClick={() => updateRole(role.instanceId, { seniorityId: tier.id })}
                                className={`py-1.5 px-1.5 rounded-lg text-center transition-all cursor-pointer font-sans text-xs font-semibold flex flex-col items-center justify-center ${
                                  isTierSelected
                                    ? "bg-electric text-white shadow-2xs"
                                    : "bg-canvas/70 text-slate-600 hover:bg-canvas hover:text-ink border border-[#bcd6fa]/40"
                                }`}
                              >
                                <span>{tier.shortName}</span>
                                {tierRate && (
                                  <span className={`text-[9.5px] font-normal mt-0.5 ${isTierSelected ? "text-white/85" : "text-slate-500"}`}>
                                    {formatMoney(tierRate)}/mo
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* 2. Headcount & Sourcing Region */}
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 pt-0.5">
                        {/* Headcount Stepper (4 cols) */}
                        <div className="sm:col-span-4 space-y-1">
                          <span className="font-sans text-xs font-semibold text-slate-600 block">
                            Headcount:
                          </span>
                          <div className="flex items-center rounded-lg border border-[#bcd6fa] bg-white p-0.5 h-[34px]">
                            <button
                              type="button"
                              onClick={() =>
                                updateRole(role.instanceId, {
                                  headcount: Math.max(1, role.headcount - 1),
                                })
                              }
                              className="h-full w-7 flex items-center justify-center rounded bg-canvas font-sans text-sm font-bold text-ink hover:bg-electric hover:text-white transition-colors cursor-pointer"
                              title="Decrease headcount"
                            >
                              -
                            </button>
                            <span className="font-display text-sm font-extrabold text-ink flex-1 text-center">
                              {role.headcount}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                updateRole(role.instanceId, {
                                  headcount: Math.min(20, role.headcount + 1),
                                })
                              }
                              className="h-full w-7 flex items-center justify-center rounded bg-canvas font-sans text-sm font-bold text-ink hover:bg-electric hover:text-white transition-colors cursor-pointer"
                              title="Increase headcount"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Sourcing Region Selector (8 cols) */}
                        <div className="sm:col-span-8 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-sans text-xs font-semibold text-slate-600">
                              Sourcing Region:
                            </span>
                            {role.regionId ? (
                              <span className="font-sans text-xs text-electric font-bold">
                                {formatMoney(rate * role.headcount)}/mo
                              </span>
                            ) : (
                              <span className="font-sans text-xs text-amber-600 font-medium">
                                Select to price
                              </span>
                            )}
                          </div>
                          <select
                            value={role.regionId}
                            onChange={(e) => updateRole(role.instanceId, { regionId: e.target.value })}
                            className={`w-full rounded-lg border px-2.5 font-sans text-xs sm:text-[13px] font-normal transition-colors cursor-pointer focus:outline-hidden h-[34px] ${
                              role.regionId
                                ? "border-[#bcd6fa] bg-white text-ink hover:border-electric"
                                : "border-amber-400/80 bg-amber-50/40 text-slate-700 hover:border-amber-500 font-medium"
                            }`}
                          >
                            <option value="">Select Sourcing Region...</option>
                            {ALL_REGIONS.map((reg) => {
                              const rateLabel =
                                reg.pricingTier === "offshore"
                                  ? "$12 to $65/hr"
                                  : reg.pricingTier === "nearshore"
                                  ? "$20 to $85/hr"
                                  : "$55 to $110/hr";
                              return (
                                <option key={reg.id} value={reg.id}>
                                  {reg.label} ({rateLabel})
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      </div>

                      {/* 3. Granular Technologies Specific to Category */}
                      <div className="space-y-1.5 pt-0.5">
                        <div className="flex items-center justify-between">
                          <span className="font-sans text-xs font-semibold text-slate-600">
                            Technologies:
                          </span>
                          <span className="font-sans text-xs text-slate-400">
                            Click to toggle
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {category.tags.map((tag) => {
                            const isSelected = role.selectedTags.includes(tag);
                            return (
                              <button
                                key={tag}
                                type="button"
                                onClick={() => toggleRoleTag(role.instanceId, tag)}
                                className={`rounded-md px-2 py-1 font-sans text-xs transition-all cursor-pointer ${
                                  isSelected
                                    ? "bg-electric/15 text-electric border border-electric/60 font-semibold shadow-2xs"
                                    : "bg-canvas text-slate-600 border border-[#bcd6fa]/50 hover:border-electric/50 hover:text-ink"
                                }`}
                              >
                                {isSelected ? "✓ " : "+ "}
                                {tag}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })}

            {/* Dedicated Sourcer Pod (Audit Spec Section 5.A & 5.B) */}
            {calc.configuredRolesCount > 0 && (
              <div className="rounded-xl border border-dashed border-electric/40 bg-electric/[0.04] p-2.5 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-electric text-white text-[10px] font-bold">
                    ✓
                  </span>
                  <div className="min-w-0">
                    <div className="font-display text-xs font-bold uppercase tracking-tight text-ink truncate">
                      Dedicated Virtual Sourcer
                    </div>
                    <div className="font-sans text-[11px] text-slate-500 truncate">
                      Full candidate pipeline, vetting, and HR operations ($8/hr)
                    </div>
                  </div>
                </div>
                <span className="shrink-0 font-sans text-xs font-bold text-electric bg-white border border-electric/30 px-2 py-0.5 rounded-md">
                  +$1,280 / mo
                </span>
              </div>
            )}

            {/* AVAILABLE SPECIALIZATIONS TO ADD */}
            <div className={`space-y-2 ${activeRoles.length > 0 ? "pt-2.5 border-t border-[#bcd6fa]/40" : ""}`}>
              <div className="flex items-center justify-between px-1">
                <span className="font-sans text-xs font-bold uppercase tracking-wide text-slate-600">
                  Available Specializations ({ALL_STACK_CATEGORIES.length} available)
                </span>
                <span className="font-sans text-xs text-electric font-medium">
                  Click to add role to squad
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
                {ALL_STACK_CATEGORIES.map((cat) => {
                  const existingCount = activeRoles.filter((r) => r.categoryId === cat.id).length;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => addRole(cat.id)}
                      className="group w-full text-left p-2 sm:p-2.5 rounded-xl border border-dashed border-[#bcd6fa] bg-canvas/40 hover:bg-white hover:border-electric transition-all cursor-pointer flex items-center justify-between gap-2 shadow-2xs hover:shadow-xs"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="font-display text-xs sm:text-[13px] font-bold uppercase tracking-tight text-ink group-hover:text-electric transition-colors">
                          {cat.name}
                        </div>
                        <div className="font-sans text-[11px] text-slate-500 truncate mt-0.5">
                          {cat.tags.slice(0, 3).join(" · ")}
                        </div>
                      </div>

                      <span className="shrink-0 font-sans text-[11px] font-semibold text-electric bg-white group-hover:bg-electric group-hover:text-white border border-[#bcd6fa] px-2 py-0.5 rounded-md transition-all">
                        {existingCount > 0 ? `+ (${existingCount})` : "+ Add"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 3. BOTTOM ACTION BUTTON - Hidden until squad team and cost are configured */}
          {calc.monthlyDeploymentCost > 0 && (
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setIsProposalOpen(true)}
                className="group w-full inline-flex items-center justify-center gap-2.5 rounded-xl bg-[#0a1428] py-2.5 px-4 font-display text-xs sm:text-sm font-bold text-white shadow-[0_8px_20px_-4px_rgba(10,20,40,0.45)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-electric hover:shadow-[0_12px_28px_-6px_rgba(10,132,255,0.5)] cursor-pointer"
              >
                <span>Generate RPO Proposal &amp; Schedule Review</span>
                <AnimatedChevrons size={12} count={3} />
              </button>
            </div>
          )}
        </div>
      </DeviceFrame>

      {/* =====================================================================
          INSTANT PROPOSAL REVIEW MODAL
          Pre-filled with configured roles, stack selections, time overlap
          guarantees, and side-by-side cost comparisons per Audit Spec Section 5.C
          ===================================================================== */}
      {isProposalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-2xl border border-electric/40 bg-white p-5 shadow-2xl animate-[ds-rise_0.2s_ease-out]">
            <button
              onClick={() => setIsProposalOpen(false)}
              className="absolute top-4 right-4 text-mist hover:text-ink font-bold text-base cursor-pointer"
            >
              ✕
            </button>

            <span className="font-mono text-[9.5px] font-bold uppercase tracking-wider text-electric">
              Pepoltek Instant Proposal
            </span>
            <h3 className="mt-0.5 font-display text-lg font-extrabold text-ink">
              Configured Squad &amp; RPO Breakdown
            </h3>

            {/* Configured Squad Details */}
            <div className="mt-3 rounded-xl border border-[#bcd6fa] bg-canvas p-3.5 text-xs space-y-2">
              <div className="font-sans text-xs font-bold uppercase tracking-wide text-slate-500 border-b border-[#bcd6fa]/40 pb-1">
                Configured Squad ({calc.totalHeadcount} Total Specialists)
              </div>
              <div className="max-h-44 overflow-y-auto space-y-2 pr-0.5 thin-scrollbar">
                {activeRoles.length === 0 ? (
                  <div className="text-center py-4 text-slate-400 font-sans text-xs">
                    No roles configured yet. Add roles from the calculator.
                  </div>
                ) : (
                  activeRoles.map((role) => {
                    const cat = ALL_STACK_CATEGORIES.find((c) => c.id === role.categoryId);
                    const reg = ALL_REGIONS.find((r) => r.id === role.regionId);
                    const rate = getRegionalRate(role.regionId, role.seniorityId);

                    return (
                      <div
                        key={role.instanceId}
                        className="rounded-lg bg-white border border-[#bcd6fa]/60 p-2.5 space-y-1"
                      >
                        <div className="flex justify-between items-center font-bold text-ink text-xs">
                          <span>{role.headcount}x {role.seniorityId} · {cat?.name}</span>
                          <span className="font-sans text-xs text-electric font-bold">
                            {role.regionId ? `${formatMoney(rate * role.headcount)}/mo` : "Pending Region"}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs text-slate-600">
                          <span>Sourcing Region:</span>
                          <span className="font-sans text-xs text-slate-800 font-medium">
                            {reg?.shortLabel || "Not selected"}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 truncate pt-0.5 font-sans">
                          Tech: {role.selectedTags.join(", ")}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="flex justify-between text-slate-500 pt-1">
                <span>Timezone Overlap:</span>
                <span className="font-bold text-electric">4 to 6 Hours Guaranteed Daily Overlap</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Deployment Velocity:</span>
                <span className="font-bold text-signal">2 to 7 Days Average Time-to-Deploy</span>
              </div>
              {calc.configuredRolesCount > 0 && (
                <div className="flex justify-between text-slate-500">
                  <span>Dedicated Sourcer:</span>
                  <span className="font-medium text-slate-700">$1,280 / mo included</span>
                </div>
              )}

              {/* Side-by-Side Cost Comparison */}
              <div className="border-t border-[#bcd6fa] pt-2 mt-2 space-y-1">
                <div className="flex justify-between text-mist">
                  <span>Traditional Agency Contingency (20%):</span>
                  <span className="line-through">{formatMoney(calc.traditionalAgencyPlacementFee)}</span>
                </div>
                <div className="flex justify-between font-bold text-sm">
                  <span>Pepoltek Dedicated RPO Cost:</span>
                  <span className="text-electric">{formatMoney(calc.monthlyDeploymentCost)} / mo</span>
                </div>
                <div className="flex justify-between font-bold text-xs text-signal pt-0.5">
                  <span>Net Upfront Placement Savings:</span>
                  <span>Saves {formatMoney(calc.netFirstMonthSavings)} ({calc.savingsPercent}% reduction)</span>
                </div>
                <div className="flex justify-between text-xs text-slate-500 pt-1">
                  <span>Billing Commitment:</span>
                  <span className="font-semibold text-slate-800">
                    {commitmentTerm === "semiAnnual"
                      ? "6-Month Commitment (10% squad discount applied)"
                      : "Monthly Sprint"}
                  </span>
                </div>
              </div>

              {/* Audit Spec Section 4: Commercial & Velocity Benchmark Grid */}
              <div className="border-t border-[#bcd6fa] pt-2 mt-2 space-y-1.5">
                <div className="flex justify-between items-center text-[10.5px] font-bold uppercase tracking-wider text-slate-500 pb-1 border-b border-[#bcd6fa]/40">
                  <span>Commercial &amp; Velocity SLA</span>
                  <span className="text-electric font-mono text-[9px]">Audit Spec Benchmark</span>
                </div>
                <div className="grid grid-cols-3 gap-1 text-[10.5px] text-slate-600">
                  <span className="font-medium text-slate-700">Time to Deploy:</span>
                  <span className="text-slate-400">45 to 60 Days</span>
                  <span className="font-bold text-signal">2 to 7 Days (85% Faster)</span>
                </div>
                <div className="grid grid-cols-3 gap-1 text-[10.5px] text-slate-600">
                  <span className="font-medium text-slate-700">Client HR Hours:</span>
                  <span className="text-slate-400">5 to 10h / hire</span>
                  <span className="font-bold text-electric">40+ Hours Saved / hire</span>
                </div>
                <div className="grid grid-cols-3 gap-1 text-[10.5px] text-slate-600">
                  <span className="font-medium text-slate-700">Placement Model:</span>
                  <span className="text-slate-400">20% to 25% Fee</span>
                  <span className="font-bold text-ink">Flat Monthly Sprint</span>
                </div>
                <div className="grid grid-cols-3 gap-1 text-[10.5px] text-slate-600">
                  <span className="font-medium text-slate-700">Candidate Vetting:</span>
                  <span className="text-slate-400">Resume Forwarding</span>
                  <span className="font-bold text-signal">100% Pre-Screened</span>
                </div>
              </div>
            </div>

            {leadSubmitSuccess ? (
              <div className="mt-4 rounded-xl border border-signal/40 bg-signal/10 p-4 text-center space-y-2">
                <div className="inline-flex items-center gap-1.5 text-signal font-bold text-sm">
                  <span>✓</span>
                  <span>{leadSubmitSuccess}</span>
                </div>
                <p className="text-xs text-slate-600">
                  Our Enterprise RPO Lead will reach out to schedule your executive discovery sprint.
                </p>
                <div className="pt-2 flex justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="rounded-xl bg-electric px-4 py-2 font-display text-xs font-semibold text-white shadow-sm hover:bg-electric-bright"
                  >
                    Print / Save Proposal SOW
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLeadSubmitSuccess(null);
                      setIsProposalOpen(false);
                    }}
                    className="rounded-xl border border-[#bcd6fa] px-4 py-2 font-display text-xs font-semibold text-ink hover:bg-canvas"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleProposalSubmit} className="mt-3.5 space-y-2.5">
                <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Register Requisition &amp; Request SOW
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Your Name *"
                    value={leadForm.name}
                    onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                    className="rounded-lg border border-[#bcd6fa] bg-canvas px-2.5 py-1.5 text-xs text-ink focus:border-electric focus:outline-none"
                  />
                  <input
                    type="email"
                    required
                    placeholder="Work Email *"
                    value={leadForm.email}
                    onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                    className="rounded-lg border border-[#bcd6fa] bg-canvas px-2.5 py-1.5 text-xs text-ink focus:border-electric focus:outline-none"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Company Name *"
                    value={leadForm.company}
                    onChange={(e) => setLeadForm({ ...leadForm, company: e.target.value })}
                    className="rounded-lg border border-[#bcd6fa] bg-canvas px-2.5 py-1.5 text-xs text-ink focus:border-electric focus:outline-none"
                  />
                </div>

                {leadSubmitError && (
                  <p className="text-xs text-rose-500 font-medium">{leadSubmitError}</p>
                )}

                <div className="flex flex-col gap-2 pt-1">
                  <button
                    type="submit"
                    disabled={isSubmittingLead}
                    className="w-full text-center rounded-xl bg-electric py-2.5 font-display text-xs sm:text-sm font-bold text-white shadow-md hover:bg-electric-bright transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmittingLead ? "Submitting Requisition..." : "Submit Proposal Requisition to BD Team"}
                  </button>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="rounded-xl border border-electric/40 bg-electric/[0.06] py-2 font-display text-xs font-semibold text-electric hover:bg-electric/15 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                      </svg>
                      <span>Export SOW (PDF)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsProposalOpen(false)}
                      className="rounded-xl border border-[#bcd6fa] py-2 font-display text-xs font-semibold text-ink hover:bg-canvas cursor-pointer transition-colors"
                    >
                      Modify Configuration
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
