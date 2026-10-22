"use client";

import React, { useState, useTransition, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  Clock,
  History,
  Save,
  Upload,
  RotateCcw,
  Plus,
  Trash2,
  ChevronRight,
  Globe,
  Zap,
  BarChart2,
  FileText,
  ShieldCheck,
  CheckCircle,
  Eye,
  Monitor,
  Tablet,
  Smartphone,
  Maximize2,
  Minimize2,
} from "@/components/ui/Icons";
import {
  publishContentBlockAction,
  saveDraftContentBlockAction,
  type ContentBlockDetail,
  type ContentVersion,
} from "@/actions/content.actions";
import Header from "@/components/main/Header";
import Footer from "@/components/main/Footer";
import Hero from "@/components/main/sections/Hero";
import SpecialistDeliveryTracks from "@/components/main/sections/SpecialistDeliveryTracks";
import SprintExecutionMatrix from "@/components/main/sections/SprintExecutionMatrix";
import HiringVelocity from "@/components/main/sections/HiringVelocity";
import CommercialTerms from "@/components/main/sections/CommercialTerms";
import AiHrmsPortal from "@/components/main/sections/AiHrmsPortal";
import ProductSolutions from "@/components/main/sections/ProductSolutions";
import TalentEcosystem from "@/components/main/sections/TalentEcosystem";
import CtaBanner from "@/components/main/sections/CtaBanner";

// ============================================================================
// Types
// ============================================================================

export interface HomepageMasterData {
  hero: {
    eyebrow: string;
    typedHeadline: string;
    headlineSuffix: string;
    description: string;
    descriptionMobile?: string;
    pills: string[];
    primaryCta: { label: string; href: string };
    secondaryCta: { label: string; href: string };
    cards: Array<{ id: string; title: string; subtitle: string }>;
  };
  specialist_tracks: {
    eyebrow: string;
    title: string;
    subtitle: string;
    stats: Array<{ label: string; value: string; description: string }>;
    regions?: Array<{ id: string; country: string; label: string; tz: string }>;
  };
  sprint_matrix: {
    eyebrow: string;
    title: string;
    subtitle: string;
    steps: Array<{
      num: string;
      days: string;
      title: string;
      sub: string;
      sla: string;
      deliverables: string[];
    }>;
  };
  hiring_velocity: {
    eyebrow: string;
    title: string;
    subtitle: string;
    defaultSquadSize?: number;
    defaultLocation?: string;
    disclaimer?: string;
  };
  commercial_terms: {
    eyebrow: string;
    title: string;
    subtitle: string;
    models: Array<{
      tag: string;
      name: string;
      category: string;
      desc: string;
      metric: string;
      metricLabel: string;
      rateTerms?: string;
      guarantee: string;
      featured?: boolean;
      bullets: string[];
    }>;
  };
  ai_hrms_portal: {
    eyebrow: string;
    title: string;
    subtitle: string;
    features: Array<{ id: number; title: string; body: string }>;
  };
  product_solutions: {
    eyebrow: string;
    title: string;
    subtitle: string;
    featuredBadge?: string;
  };
  talent_ecosystem: {
    eyebrow: string;
    title: string;
    subtitle: string;
    stages: Array<{
      n: string;
      badge: string;
      rightBadge: string;
      title: string;
      description: string;
      route: string;
    }>;
  };
  cta_banner: {
    badge: string;
    title: string;
    description: string;
    pills: string[];
    primaryCta: { label: string; href: string };
    secondaryCta: { label: string; href: string };
  };
}

interface AdminHomepageSplitEditorProps {
  blockDetail: ContentBlockDetail;
  history: ContentVersion[];
}

// 9 Visual Sections Metadata
const HOMEPAGE_SECTIONS_LIST = [
  { id: "hero", label: "Hero Section", icon: "⚡", desc: "Headline, description, capability badges & CTAs" },
  { id: "specialist_tracks", label: "Specialist Delivery Tracks", icon: "🎯", desc: "Domain vetting, metrics counters & talent pods" },
  { id: "sprint_matrix", label: "Sprint Execution Matrix", icon: "⏱️", desc: "Day 1 to Day 7 agile deployment roadmap" },
  { id: "hiring_velocity", label: "Velocity & RPO Calculator", icon: "🧮", desc: "Timezone overlap engine & savings calculator" },
  { id: "commercial_terms", label: "Commercial Terms & Models", icon: "📜", desc: "Direct hire, staff aug & EOR guarantee models" },
  { id: "ai_hrms_portal", label: "AI HRMS Technology", icon: "🤖", desc: "Natural language query & code audit platform" },
  { id: "product_solutions", label: "Product Solutions", icon: "🏗️", desc: "Verified technical systems built & scaled" },
  { id: "talent_ecosystem", label: "Talent Ecosystem", icon: "🌐", desc: "Resume intake, reverse search, academy & bounty" },
  { id: "cta_banner", label: "Final CTA Banner", icon: "🚀", desc: "48-hour shortlist deployment banner & guarantees" },
] as const;

type SectionId = (typeof HOMEPAGE_SECTIONS_LIST)[number]["id"];

export function AdminHomepageSplitEditor({
  blockDetail,
  history,
}: AdminHomepageSplitEditorProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Active section to edit in left sidebar
  const [activeSection, setActiveSection] = useState<SectionId>("hero");

  // Device simulation mode for preview: desktop landscape, tablet landscape center, mobile vertical
  const [deviceMode, setDeviceMode] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [zoomMode, setZoomMode] = useState<"fit" | "75" | "100">("fit");
  const [isEditorCollapsed, setIsEditorCollapsed] = useState(false);
  const previewAreaRef = useRef<HTMLDivElement>(null);
  const [previewAreaWidth, setPreviewAreaWidth] = useState<number>(850);
  const contentFrameRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number>(0);

  // Measure preview container width for responsive scaling
  useEffect(() => {
    const updateSize = () => {
      if (previewAreaRef.current) {
        setPreviewAreaWidth(previewAreaRef.current.clientWidth);
      }
    };
    updateSize();
    if (typeof ResizeObserver !== "undefined" && previewAreaRef.current) {
      const ro = new ResizeObserver(updateSize);
      ro.observe(previewAreaRef.current);
      return () => ro.disconnect();
    }
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Compute target width and scaling
  const targetWidth =
    deviceMode === "desktop"
      ? 1366 // Widescreen desktop landscape monitor
      : deviceMode === "tablet"
      ? 1024 // iPad landscape centered (1024px)
      : 390;  // Mobile vertical (390px)

  let scale = 1;
  if (zoomMode === "75") {
    scale = 0.75;
  } else if (zoomMode === "100") {
    scale = 1.0;
  } else {
    // "fit" mode: scale down if device exceeds available width with side breathing room
    const availableWidth = Math.max(320, previewAreaWidth - 48);
    if (deviceMode === "mobile") {
      scale = Math.min(1, availableWidth / 390);
    } else {
      scale = Math.min(1, availableWidth / targetWidth);
    }
  }

  // Editorial Notes
  const [notes, setNotes] = useState("");

  // Toast notification
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  // Published vs Draft state initialization
  const initialData = (blockDetail.latest?.data ?? blockDetail.published?.data ?? {}) as Partial<HomepageMasterData>;

  const [data, setData] = useState<HomepageMasterData>({
    hero: {
      eyebrow: "Enterprise RPO & Strategic HR Solutions",
      typedHeadline: "Hire Faster",
      headlineSuffix: "than your competition",
      description: "Pepoltek is an enterprise Recruitment Process Outsourcing (RPO) and strategic HR partner. We combine AI-driven candidate screening, automated technical assessments, and dedicated HR operations teams to deliver pre-vetted IT and compliance-ready healthcare talent within 2 to 7 days.",
      descriptionMobile: "Enterprise RPO deploying pre-screened IT engineers and compliance-ready healthcare specialists in 2 to 7 days with guaranteed global timezone overlap.",
      pills: ["Enterprise RPO", "AI-Powered HRMS", "Healthcare Compliance", "Tech & SDLC Staffing"],
      primaryCta: { label: "Explore RPO Solutions", href: "#specialist-tracks" },
      secondaryCta: { label: "View Pre-Screened Talent", href: "#calculator-section" },
      cards: [
        { id: "tech-sdlc", title: "Tech & SDLC Pods", subtitle: "Full-Stack Dev" },
        { id: "healthcare-it", title: "Healthcare IT", subtitle: "EMR & HIPAA" },
        { id: "ai-hrms", title: "AI HRMS Portal", subtitle: "Global Workforce" },
      ],
      ...initialData.hero,
    },
    specialist_tracks: {
      eyebrow: "Specialist-Led RPO & AI-Driven Talent Acquisition",
      title: "Enterprise RPO Powered by AI Interviewing and Domain Specialists",
      subtitle: "Move beyond generalist recruiters. Pepoltek pairs AI-driven video interviewing and automated skill evaluation with dedicated teams of software engineers, medical specialists, and HR strategists to hand-vet every candidate.",
      stats: [
        { label: "Specialists Deployed", value: "500+", description: "High-impact placements across IT and clinical domains" },
        { label: "First-Year Retention", value: "92%", description: "Consistently exceeds the staffing industry benchmark" },
        { label: "Shortlist SLA", value: "72h", description: "First calibrated candidate presentation delivered fast" },
      ],
      ...initialData.specialist_tracks,
    },
    sprint_matrix: {
      eyebrow: "5-Stage Agile Sourcing Protocol",
      title: "Sprint Execution Matrix: Precision Hiring from Day 1 to Day 7",
      subtitle: "Deterministic hiring milestones designed to de-risk technical and clinical hiring through verified checkpoints.",
      steps: [
        { num: "01", days: "Day 1", title: "Discovery & Alignment", sub: "Technical stack mapping and role scoping", sla: "< 12h Turnaround", deliverables: ["Role Taxonomy Spec", "Search Strategy", "Profile Matrix"] },
        { num: "02", days: "Day 2", title: "Talent Mapping & Sourcing", sub: "AI sourcing across 500k+ global talent pool", sla: "24h Sourcing Sprint", deliverables: ["Calibrated Longlist", "Semantic Relevance Scoring", "Timezone Matching"] },
        { num: "03", days: "Day 3", title: "Deep Technical & Clinical Vetting", sub: "Senior architect coding reviews and primary license audits", sla: "48h Assessment SLA", deliverables: ["Code Architecture Evaluation", "Primary Source Verification", "Behavioral Calibration"] },
        { num: "04", days: "Day 4-5", title: "Synchronous Client Panels", sub: "Pre-briefed candidates in structured interview loops", sla: "Zero-Latency Scheduling", deliverables: ["Interview Scorecards", "Candidate Dossiers", "Compensation Pre-alignment"] },
        { num: "05", days: "Day 6-7", title: "Offer, Clearance & Onboarding", sub: "Contract execution, background checks, and Day-1 readiness", sla: "Guaranteed Day-1 Start", deliverables: ["Compliant W2/C2C Contracts", "Hardware & Access Provisioning", "90-Day Retention Guarantee"] },
      ],
      ...initialData.sprint_matrix,
    },
    hiring_velocity: {
      eyebrow: "Flexible Global RPO & Staffing Calculator",
      title: "Deploy Locally, Source Globally: 24/7 Timezone Coverage & RPO Cost Engine",
      subtitle: "Guaranteed daily operational overlap across global hubs. Configure your custom squad across stacks, seniority tiers, and regions to compare real-time savings against traditional recruiting agencies.",
      defaultSquadSize: 5,
      defaultLocation: "nearshore",
      disclaimer: "Calculated estimates reflect median market compensation, benefits, compliance overhead, and Pepoltek guaranteed performance margins.",
      ...initialData.hiring_velocity,
    },
    commercial_terms: {
      eyebrow: "Commercial Engagement Terms",
      title: "Flexible Commercial Models & Risk-Free Guarantees",
      subtitle: "Terms engineered to de-risk every hire. Three transparent engagement models with backed replacement and trial guarantees.",
      models: [
        {
          tag: "01",
          name: "Direct Hire Placement",
          category: "Executive & Specialist",
          desc: "Contingency & retained hiring for senior engineering, product, and clinical leaders.",
          metric: "12%",
          metricLabel: "Entry Rate",
          rateTerms: "Standard 15% to 20% first-year compensation",
          guarantee: "90-Day Candidate Replacement Guarantee",
          bullets: [
            "Rigorous technical code audits and credentialing",
            "Executive panel interview orchestration",
            "Offer negotiation and compensation benchmarking",
          ],
        },
        {
          tag: "02",
          name: "Staff Augmentation",
          category: "Turnkey Dedicated Squads",
          desc: "Dedicated engineering and healthcare pods embedded in your sprint workflow.",
          metric: "2 wk",
          metricLabel: "Trial Period",
          rateTerms: "Transparent monthly or hourly sprint billing",
          guarantee: "2-Week Risk-Free Trial ($0 if benchmarks fail)",
          featured: true,
          bullets: [
            "Pre-vetted engineering and clinical specialists",
            "Guaranteed 4 to 6 hour daily operational overlap",
            "Immediate sprint deployment in 2 to 7 days",
          ],
        },
        {
          tag: "03",
          name: "Employer of Record (EOR)",
          category: "Global Payroll & Compliance",
          desc: "Hire across 15+ countries with complete payroll, tax, and labor compliance.",
          metric: "15+",
          metricLabel: "Countries",
          rateTerms: "Localized payroll, benefits, and tax withholding",
          guarantee: "100% Statutory Compliance Ownership",
          bullets: [
            "Localized employment contracts and IP protection",
            "Automated multi-currency salary disbursement",
            "Statutory health, pension, and local benefits",
          ],
        },
      ],
      ...initialData.commercial_terms,
    },
    ai_hrms_portal: {
      eyebrow: "Proprietary HR Technology",
      title: "Ask for the shortlist in plain language.",
      subtitle: "Our AI-HRMS portal translates natural language queries into instant, verified talent pipelines with match score, work authorization, timezone overlap, and hard-coded engineering audits.",
      features: [
        {
          id: 0,
          title: "Natural Language Query",
          body: "Query in plain English to get ranked matches with match score, work authorization, timezone overlap, and engagement model.",
        },
        {
          id: 1,
          title: "System Design Audit Logs",
          body: "Every ranking ships with code quality, test coverage, and Redis and Kafka memory safety validation you can inspect.",
        },
        {
          id: 2,
          title: "Video Scorecards",
          body: "HEXACO, OCEAN, and BEI signals paired with a 90 second technical explainer clip for every finalist.",
        },
      ],
      ...initialData.ai_hrms_portal,
    },
    product_solutions: {
      eyebrow: "Verified Technical Footprint · Pepoltek Limited",
      title: "Systems Built, Deployed & Scaled",
      subtitle: "We do not just recruit talent; our in-house engineering team designs, builds, and maintains enterprise-grade platforms. This deep technical foundation guarantees authentic vetting for your open roles.",
      featuredBadge: "In-House Engineering Excellence",
      ...initialData.product_solutions,
    },
    talent_ecosystem: {
      eyebrow: "The Global Talent Ecosystem",
      title: "The Global Talent Ecosystem",
      subtitle: "Upload your resume, leverage AI to build an ATS-ready profile, and let enterprise opportunities find you.",
      stages: [
        {
          n: "01",
          badge: "RESUME INTAKE",
          rightBadge: "✦ INSTANT",
          title: "Smart Resume Intake",
          description: "Upload your resume and let our AI parser extract skills, experience, and certifications into a standardized ATS profile.",
          route: "/careers/upload-cv",
        },
        {
          n: "02",
          badge: "REVERSE SEARCH",
          rightBadge: "✦ MATCH",
          title: "AI-Powered Reverse Search",
          description: "Get discovered by verified enterprise employers seeking your exact tech stack and clinical domain expertise.",
          route: "/careers/reverse-search",
        },
        {
          n: "03",
          badge: "TALENT ACADEMY",
          rightBadge: "✦ CERTIFY",
          title: "Pepoltek Talent Academy",
          description: "Build your skills with expert-led learning paths and get vetted through real-world assessments to earn enterprise-ready credentials.",
          route: "/talent/academy",
        },
        {
          n: "04",
          badge: "REFERRAL BOUNTY",
          rightBadge: "✦ EARN",
          title: "Referral Bounty Network",
          description: "Refer top talent and get rewarded. Track your referrals, confirm payouts, and grow your earnings with our transparent bounty system.",
          route: "/talent/bounty",
        },
      ],
      ...initialData.talent_ecosystem,
    },
    cta_banner: {
      badge: "Zero Risk Hiring",
      title: "Submit your requisition. We deploy a verified shortlist in 48 hours.",
      description: "Enterprise pods and pre-screened specialists ready for immediate integration. Backed by guaranteed daily timezone overlap and zero billing until trial benchmarks pass.",
      pills: [
        "14-day risk-free trial on staff augmentation",
        "90-day placement replacement guarantee",
        "Zero generalist recruiters",
      ],
      primaryCta: {
        label: "Start 14-Day Risk-Free Trial",
        href: "/contact",
      },
      secondaryCta: {
        label: "Schedule RPO Consultation",
        href: "/contact",
      },
      ...initialData.cta_banner,
    },
  });

  // Generic updater for section fields
  const updateSectionField = useCallback(
    <S extends SectionId, K extends keyof HomepageMasterData[S]>(
      section: S,
      field: K,
      value: HomepageMasterData[S][K]
    ) => {
      setData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value,
        },
      }));
    },
    []
  );

  // Measure content frame height to eliminate extra blank space at the bottom of the scaled container
  useEffect(() => {
    const el = contentFrameRef.current;
    if (!el) return;
    const updateHeight = () => {
      if (el) {
        setContentHeight(el.offsetHeight);
      }
    };
    updateHeight();
    if (typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver(updateHeight);
      ro.observe(el);
      return () => ro.disconnect();
    }
  }, [deviceMode, data]);

  // Select active section and smooth scroll preview
  const selectSection = useCallback((id: SectionId) => {
    setActiveSection(id);
    const el = document.getElementById(`preview-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  // Publish changes live to DB
  const handlePublish = () => {
    startTransition(async () => {
      const res = await publishContentBlockAction(
        "homepage",
        data as unknown as Record<string, unknown>,
        notes || "Published updated homepage from visual editor"
      );
      if (res.success) {
        showToast("success", `Homepage published as v${res.version}. All changes are live!`);
        router.refresh();
      } else {
        showToast("error", res.error ?? "Failed to publish homepage changes.");
      }
    });
  };

  // Save changes as draft
  const handleSaveDraft = () => {
    startTransition(async () => {
      const res = await saveDraftContentBlockAction(
        "homepage",
        data as unknown as Record<string, unknown>,
        notes || "Saved draft of homepage in visual editor"
      );
      if (res.success) {
        showToast("success", `Draft saved as v${res.version}. Live site unaffected.`);
        router.refresh();
      } else {
        showToast("error", res.error ?? "Failed to save draft.");
      }
    });
  };

  // Render complete authentic homepage content for all device preview frames
  const renderHomepageContent = () => (
    <div className="w-full bg-canvas text-ink">
      {/* Public Header Simulation */}
      <div className="border-b border-[#bcd6fa]/40 bg-canvas/90 backdrop-blur-md">
        <Header />
      </div>

      {/* SECTION 1: HERO */}
      <div
        id="preview-hero"
        onClick={() => selectSection("hero")}
        className={`relative transition-all cursor-pointer group ${
          activeSection === "hero"
            ? "ring-4 ring-electric ring-inset shadow-2xl z-20"
            : "hover:outline hover:outline-2 hover:outline-electric/40"
        }`}
      >
        <div className="absolute top-4 right-4 z-40 flex items-center gap-1.5 rounded-full bg-[#0a1428]/90 text-white backdrop-blur-md px-3 py-1 font-mono text-[10.5px] font-bold shadow-md transition-opacity opacity-0 group-hover:opacity-100 pointer-events-none">
          <span className="h-2 w-2 rounded-full bg-electric animate-pulse" />
          {activeSection === "hero" ? "Active (Editing Hero)" : "Click to Edit Hero"}
        </div>
        <Hero content={data.hero} />
      </div>

      {/* SECTION 2: SPECIALIST DELIVERY TRACKS */}
      <div
        id="preview-specialist_tracks"
        onClick={() => selectSection("specialist_tracks")}
        className={`relative transition-all cursor-pointer group ${
          activeSection === "specialist_tracks"
            ? "ring-4 ring-electric ring-inset shadow-2xl z-20"
            : "hover:outline hover:outline-2 hover:outline-electric/40"
        }`}
      >
        <div className="absolute top-4 right-4 z-40 flex items-center gap-1.5 rounded-full bg-[#0a1428]/90 text-white backdrop-blur-md px-3 py-1 font-mono text-[10.5px] font-bold shadow-md transition-opacity opacity-0 group-hover:opacity-100 pointer-events-none">
          <span className="h-2 w-2 rounded-full bg-electric animate-pulse" />
          {activeSection === "specialist_tracks" ? "Active (Editing Tracks)" : "Click to Edit Specialist Tracks"}
        </div>
        <SpecialistDeliveryTracks content={data.specialist_tracks} />
      </div>

      {/* SECTION 3: SPRINT EXECUTION MATRIX */}
      <div
        id="preview-sprint_matrix"
        onClick={() => selectSection("sprint_matrix")}
        className={`relative transition-all cursor-pointer group ${
          activeSection === "sprint_matrix"
            ? "ring-4 ring-electric ring-inset shadow-2xl z-20"
            : "hover:outline hover:outline-2 hover:outline-electric/40"
        }`}
      >
        <div className="absolute top-4 right-4 z-40 flex items-center gap-1.5 rounded-full bg-[#0a1428]/90 text-white backdrop-blur-md px-3 py-1 font-mono text-[10.5px] font-bold shadow-md transition-opacity opacity-0 group-hover:opacity-100 pointer-events-none">
          <span className="h-2 w-2 rounded-full bg-electric animate-pulse" />
          {activeSection === "sprint_matrix" ? "Active (Editing Sprint Matrix)" : "Click to Edit Sprint Matrix"}
        </div>
        <SprintExecutionMatrix content={data.sprint_matrix} />
      </div>

      {/* SECTION 4: HIRING VELOCITY & CALCULATOR */}
      <div
        id="preview-hiring_velocity"
        onClick={() => selectSection("hiring_velocity")}
        className={`relative transition-all cursor-pointer group ${
          activeSection === "hiring_velocity"
            ? "ring-4 ring-electric ring-inset shadow-2xl z-20"
            : "hover:outline hover:outline-2 hover:outline-electric/40"
        }`}
      >
        <div className="absolute top-4 right-4 z-40 flex items-center gap-1.5 rounded-full bg-[#0a1428]/90 text-white backdrop-blur-md px-3 py-1 font-mono text-[10.5px] font-bold shadow-md transition-opacity opacity-0 group-hover:opacity-100 pointer-events-none">
          <span className="h-2 w-2 rounded-full bg-electric animate-pulse" />
          {activeSection === "hiring_velocity" ? "Active (Editing Velocity)" : "Click to Edit Hiring Velocity"}
        </div>
        <HiringVelocity content={data.hiring_velocity} />
      </div>

      {/* SECTION 5: COMMERCIAL TERMS */}
      <div
        id="preview-commercial_terms"
        onClick={() => selectSection("commercial_terms")}
        className={`relative transition-all cursor-pointer group ${
          activeSection === "commercial_terms"
            ? "ring-4 ring-electric ring-inset shadow-2xl z-20"
            : "hover:outline hover:outline-2 hover:outline-electric/40"
        }`}
      >
        <div className="absolute top-4 right-4 z-40 flex items-center gap-1.5 rounded-full bg-[#0a1428]/90 text-white backdrop-blur-md px-3 py-1 font-mono text-[10.5px] font-bold shadow-md transition-opacity opacity-0 group-hover:opacity-100 pointer-events-none">
          <span className="h-2 w-2 rounded-full bg-electric animate-pulse" />
          {activeSection === "commercial_terms" ? "Active (Editing Terms)" : "Click to Edit Commercial Terms"}
        </div>
        <CommercialTerms content={data.commercial_terms} />
      </div>

      {/* SECTION 6: AI HRMS PORTAL */}
      <div
        id="preview-ai_hrms_portal"
        onClick={() => selectSection("ai_hrms_portal")}
        className={`relative transition-all cursor-pointer group ${
          activeSection === "ai_hrms_portal"
            ? "ring-4 ring-electric ring-inset shadow-2xl z-20"
            : "hover:outline hover:outline-2 hover:outline-electric/40"
        }`}
      >
        <div className="absolute top-4 right-4 z-40 flex items-center gap-1.5 rounded-full bg-[#0a1428]/90 text-white backdrop-blur-md px-3 py-1 font-mono text-[10.5px] font-bold shadow-md transition-opacity opacity-0 group-hover:opacity-100 pointer-events-none">
          <span className="h-2 w-2 rounded-full bg-electric animate-pulse" />
          {activeSection === "ai_hrms_portal" ? "Active (Editing AI HRMS)" : "Click to Edit AI HRMS Portal"}
        </div>
        <AiHrmsPortal content={data.ai_hrms_portal} />
      </div>

      {/* SECTION 7: PRODUCT SOLUTIONS */}
      <div
        id="preview-product_solutions"
        onClick={() => selectSection("product_solutions")}
        className={`relative transition-all cursor-pointer group ${
          activeSection === "product_solutions"
            ? "ring-4 ring-electric ring-inset shadow-2xl z-20"
            : "hover:outline hover:outline-2 hover:outline-electric/40"
        }`}
      >
        <div className="absolute top-4 right-4 z-40 flex items-center gap-1.5 rounded-full bg-[#0a1428]/90 text-white backdrop-blur-md px-3 py-1 font-mono text-[10.5px] font-bold shadow-md transition-opacity opacity-0 group-hover:opacity-100 pointer-events-none">
          <span className="h-2 w-2 rounded-full bg-electric animate-pulse" />
          {activeSection === "product_solutions" ? "Active (Editing Product Solutions)" : "Click to Edit Product Solutions"}
        </div>
        <ProductSolutions content={data.product_solutions} />
      </div>

      {/* SECTION 8: TALENT ECOSYSTEM */}
      <div
        id="preview-talent_ecosystem"
        onClick={() => selectSection("talent_ecosystem")}
        className={`relative transition-all cursor-pointer group ${
          activeSection === "talent_ecosystem"
            ? "ring-4 ring-electric ring-inset shadow-2xl z-20"
            : "hover:outline hover:outline-2 hover:outline-electric/40"
        }`}
      >
        <div className="absolute top-4 right-4 z-40 flex items-center gap-1.5 rounded-full bg-[#0a1428]/90 text-white backdrop-blur-md px-3 py-1 font-mono text-[10.5px] font-bold shadow-md transition-opacity opacity-0 group-hover:opacity-100 pointer-events-none">
          <span className="h-2 w-2 rounded-full bg-electric animate-pulse" />
          {activeSection === "talent_ecosystem" ? "Active (Editing Talent Ecosystem)" : "Click to Edit Talent Ecosystem"}
        </div>
        <TalentEcosystem content={data.talent_ecosystem} />
      </div>

      {/* SECTION 9: CTA BANNER */}
      <div
        id="preview-cta_banner"
        onClick={() => selectSection("cta_banner")}
        className={`relative transition-all cursor-pointer group ${
          activeSection === "cta_banner"
            ? "ring-4 ring-electric ring-inset shadow-2xl z-20"
            : "hover:outline hover:outline-2 hover:outline-electric/40"
        }`}
      >
        <div className="absolute top-4 right-4 z-40 flex items-center gap-1.5 rounded-full bg-[#0a1428]/90 text-white backdrop-blur-md px-3 py-1 font-mono text-[10.5px] font-bold shadow-md transition-opacity opacity-0 group-hover:opacity-100 pointer-events-none">
          <span className="h-2 w-2 rounded-full bg-electric animate-pulse" />
          {activeSection === "cta_banner" ? "Active (Editing CTA Banner)" : "Click to Edit CTA Banner"}
        </div>
        <CtaBanner content={data.cta_banner} />
      </div>

      {/* Public Footer Simulation */}
      <div className="border-t border-[#bcd6fa]/40">
        <Footer />
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] w-full overflow-hidden bg-[#0A0F1D] text-slate-100 font-sans">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 flex items-center gap-2.5 rounded-2xl border px-5 py-3.5 shadow-2xl text-sm font-semibold transition-all ${
            toast.type === "success"
              ? "border-emerald-500/40 bg-emerald-950/90 text-emerald-300"
              : "border-rose-500/40 bg-rose-950/90 text-rose-300"
          }`}
        >
          {toast.type === "success" ? <Check size={16} /> : null}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Global Command Bar */}
      <header className="flex items-center justify-between px-3.5 py-2 border-b border-slate-800 bg-[#0c1326] shrink-0 z-30 gap-2 overflow-x-auto thin-scrollbar">
        {/* Left Section: Back link, title, status */}
        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href="/admin/content"
            className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-white transition-colors shrink-0"
          >
            <ArrowLeft size={13} />
            <span>Content Hub</span>
          </Link>
          <div className="h-3.5 w-px bg-slate-800 shrink-0" />
          <div className="flex items-center gap-2 shrink-0">
            <h1 className="font-display text-xs sm:text-sm font-bold text-white whitespace-nowrap">
              Homepage Editor
            </h1>
            {blockDetail.published ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-400 shrink-0">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                v{blockDetail.published.version} LIVE
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-[10px] font-mono font-bold text-amber-400 shrink-0">
                <Clock size={10} />
                DRAFT
              </span>
            )}
          </div>
        </div>

        {/* Right Section: Compact Viewport Switcher & Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Device Preview Switcher */}
          <div className="flex items-center rounded-lg border border-slate-800 bg-[#070b16] p-0.5 text-xs shrink-0">
            <button
              type="button"
              onClick={() => setDeviceMode("desktop")}
              className={`flex items-center gap-1 rounded-md px-2 py-1 font-mono text-[11px] font-medium transition-all cursor-pointer ${
                deviceMode === "desktop"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-xs font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
              title="Desktop (1366px)"
            >
              <Monitor size={12} />
              <span>Desktop</span>
            </button>
            <button
              type="button"
              onClick={() => setDeviceMode("tablet")}
              className={`flex items-center gap-1 rounded-md px-2 py-1 font-mono text-[11px] font-medium transition-all cursor-pointer ${
                deviceMode === "tablet"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-xs font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
              title="Tablet (1024px)"
            >
              <Tablet size={12} />
              <span>Tablet</span>
            </button>
            <button
              type="button"
              onClick={() => setDeviceMode("mobile")}
              className={`flex items-center gap-1 rounded-md px-2 py-1 font-mono text-[11px] font-medium transition-all cursor-pointer ${
                deviceMode === "mobile"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-xs font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
              title="Mobile (390px)"
            >
              <Smartphone size={12} />
              <span>Mobile</span>
            </button>
          </div>

          {/* Full / Split Preview Toggle */}
          <button
            type="button"
            onClick={() => setIsEditorCollapsed(!isEditorCollapsed)}
            className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800/80 px-2 py-1 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer shrink-0"
            title={isEditorCollapsed ? "Show Left Editor Panel" : "Expand Preview to Full Width"}
          >
            {isEditorCollapsed ? (
              <>
                <Minimize2 size={12} />
                <span className="hidden sm:inline">Split</span>
              </>
            ) : (
              <>
                <Maximize2 size={12} />
                <span className="hidden sm:inline">Full</span>
              </>
            )}
          </button>

          <div className="h-3.5 w-px bg-slate-800 shrink-0" />

          {/* Action buttons */}
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={isPending}
            className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-1 text-xs font-semibold text-slate-200 hover:bg-slate-700 disabled:opacity-50 transition-colors cursor-pointer shrink-0"
          >
            <Save size={12} />
            <span>Save Draft</span>
          </button>

          <button
            type="button"
            onClick={handlePublish}
            disabled={isPending}
            className="flex items-center gap-1 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-3 py-1 text-xs font-bold text-white shadow-sm shadow-cyan-500/20 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 transition-all cursor-pointer shrink-0"
          >
            <Upload size={12} />
            <span>{isPending ? "Publishing..." : "Publish Live"}</span>
          </button>
        </div>
      </header>

      {/* Split Body: Left Editor + Right Live Viewport */}
      <div className="grid grid-cols-12 flex-1 overflow-hidden">
        {/* ================================================================= */}
        {/* LEFT PANEL: Section Selector & Field Forms                        */}
        {/* ================================================================= */}
        <div
          className={`${
            isEditorCollapsed ? "hidden" : "col-span-12 lg:col-span-5"
          } border-r border-slate-800 flex flex-col h-full bg-[#0a1020] overflow-hidden`}
        >
          {/* Section Selector Tabstrip */}
          <div className="p-3 border-b border-slate-800 bg-[#070b16] overflow-x-auto no-scrollbar flex gap-1.5">
            {HOMEPAGE_SECTIONS_LIST.map((sec) => {
              const active = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => selectSection(sec.id)}
                  className={`flex items-center gap-1.5 shrink-0 rounded-xl px-3 py-2 text-xs font-bold transition-all cursor-pointer ${
                    active
                      ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-sm"
                      : "border border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-white"
                  }`}
                >
                  <span>{sec.icon}</span>
                  <span className="whitespace-nowrap">{sec.label}</span>
                </button>
              );
            })}
          </div>

          {/* Form Scroll Area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {/* Header info of active section */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
                  Editing Section
                </span>
                <span className="font-mono text-[10px] text-slate-500">
                  Instant live preview active
                </span>
              </div>
              <h2 className="mt-1 font-display text-base font-bold text-white">
                {HOMEPAGE_SECTIONS_LIST.find((s) => s.id === activeSection)?.label}
              </h2>
              <p className="mt-0.5 text-xs text-slate-400">
                {HOMEPAGE_SECTIONS_LIST.find((s) => s.id === activeSection)?.desc}
              </p>
            </div>

            {/* SECTION 1: HERO */}
            {activeSection === "hero" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Eyebrow Badge Tag
                  </label>
                  <input
                    type="text"
                    value={data.hero.eyebrow}
                    onChange={(e) => updateSectionField("hero", "eyebrow", e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Typed Text Animation
                    </label>
                    <input
                      type="text"
                      value={data.hero.typedHeadline}
                      onChange={(e) => updateSectionField("hero", "typedHeadline", e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-3.5 py-2.5 text-xs text-cyan-400 font-bold focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Headline Suffix
                    </label>
                    <input
                      type="text"
                      value={data.hero.headlineSuffix}
                      onChange={(e) => updateSectionField("hero", "headlineSuffix", e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-3.5 py-2.5 text-xs text-white font-bold focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Desktop Hero Description
                  </label>
                  <textarea
                    rows={4}
                    value={data.hero.description}
                    onChange={(e) => updateSectionField("hero", "description", e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-3.5 py-2.5 text-xs text-slate-200 leading-relaxed focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Mobile Short Description
                  </label>
                  <textarea
                    rows={2}
                    value={data.hero.descriptionMobile ?? ""}
                    onChange={(e) => updateSectionField("hero", "descriptionMobile", e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-3.5 py-2.5 text-xs text-slate-200 leading-relaxed focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                {/* Capability Pills */}
                <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Capability Badge Pills
                  </label>
                  <div className="space-y-2">
                    {data.hero.pills.map((pill, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={pill}
                          onChange={(e) => {
                            const next = [...data.hero.pills];
                            next[i] = e.target.value;
                            updateSectionField("hero", "pills", next);
                          }}
                          className="flex-1 rounded-xl border border-slate-700 bg-slate-900/90 px-3.5 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const next = data.hero.pills.filter((_, idx) => idx !== i);
                            updateSectionField("hero", "pills", next);
                          }}
                          className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        updateSectionField("hero", "pills", [...data.hero.pills, "New Pill"]);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-1.5 text-[11px] font-semibold text-slate-300 hover:text-white"
                    >
                      <Plus size={12} /> Add Capability Pill
                    </button>
                  </div>
                </div>

                {/* CTAs */}
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                  <div>
                    <label className="block text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Primary CTA Label
                    </label>
                    <input
                      type="text"
                      value={data.hero.primaryCta.label}
                      onChange={(e) =>
                        updateSectionField("hero", "primaryCta", {
                          ...data.hero.primaryCta,
                          label: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Secondary CTA Label
                    </label>
                    <input
                      type="text"
                      value={data.hero.secondaryCta.label}
                      onChange={(e) =>
                        updateSectionField("hero", "secondaryCta", {
                          ...data.hero.secondaryCta,
                          label: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 2: SPECIALIST TRACKS */}
            {activeSection === "specialist_tracks" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Eyebrow Badge
                  </label>
                  <input
                    type="text"
                    value={data.specialist_tracks.eyebrow}
                    onChange={(e) => updateSectionField("specialist_tracks", "eyebrow", e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-3.5 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Main Title
                  </label>
                  <input
                    type="text"
                    value={data.specialist_tracks.title}
                    onChange={(e) => updateSectionField("specialist_tracks", "title", e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-3.5 py-2.5 text-xs text-white font-bold focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Subtitle Description
                  </label>
                  <textarea
                    rows={3}
                    value={data.specialist_tracks.subtitle}
                    onChange={(e) => updateSectionField("specialist_tracks", "subtitle", e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-3.5 py-2.5 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                {/* 3 Metrics */}
                <div className="space-y-3 pt-2 border-t border-slate-800">
                  <span className="block text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-wider">
                    3 Core Benchmark Counters
                  </span>
                  {data.specialist_tracks.stats.map((st, i) => (
                    <div key={i} className="rounded-xl border border-slate-800 bg-slate-900/70 p-3 space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={st.value}
                          onChange={(e) => {
                            const next = [...data.specialist_tracks.stats];
                            next[i].value = e.target.value;
                            updateSectionField("specialist_tracks", "stats", next);
                          }}
                          placeholder="Value (e.g. 500+)"
                          className="rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1.5 text-xs font-bold text-cyan-400"
                        />
                        <input
                          type="text"
                          value={st.label}
                          onChange={(e) => {
                            const next = [...data.specialist_tracks.stats];
                            next[i].label = e.target.value;
                            updateSectionField("specialist_tracks", "stats", next);
                          }}
                          placeholder="Label (e.g. Specialists Deployed)"
                          className="rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1.5 text-xs text-white"
                        />
                      </div>
                      <input
                        type="text"
                        value={st.description}
                        onChange={(e) => {
                          const next = [...data.specialist_tracks.stats];
                          next[i].description = e.target.value;
                          updateSectionField("specialist_tracks", "stats", next);
                        }}
                        placeholder="Description note"
                        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1.5 text-[11px] text-slate-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECTION 3: SPRINT MATRIX */}
            {activeSection === "sprint_matrix" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Eyebrow Badge
                  </label>
                  <input
                    type="text"
                    value={data.sprint_matrix.eyebrow}
                    onChange={(e) => updateSectionField("sprint_matrix", "eyebrow", e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-3.5 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Section Title
                  </label>
                  <input
                    type="text"
                    value={data.sprint_matrix.title}
                    onChange={(e) => updateSectionField("sprint_matrix", "title", e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-3.5 py-2.5 text-xs text-white font-bold focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Subtitle
                  </label>
                  <textarea
                    rows={2}
                    value={data.sprint_matrix.subtitle}
                    onChange={(e) => updateSectionField("sprint_matrix", "subtitle", e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-3.5 py-2.5 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-3 pt-2 border-t border-slate-800">
                  <span className="block text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-wider">
                    5-Day Execution Stages
                  </span>
                  {data.sprint_matrix.steps.map((st, i) => (
                    <div key={i} className="rounded-xl border border-slate-800 bg-slate-900/70 p-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-cyan-400 px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                          {st.num}
                        </span>
                        <input
                          type="text"
                          value={st.days}
                          onChange={(e) => {
                            const next = [...data.sprint_matrix.steps];
                            next[i].days = e.target.value;
                            updateSectionField("sprint_matrix", "steps", next);
                          }}
                          className="w-24 rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-cyan-300 font-mono font-bold"
                        />
                        <input
                          type="text"
                          value={st.title}
                          onChange={(e) => {
                            const next = [...data.sprint_matrix.steps];
                            next[i].title = e.target.value;
                            updateSectionField("sprint_matrix", "steps", next);
                          }}
                          className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-white font-bold"
                        />
                      </div>
                      <input
                        type="text"
                        value={st.sub}
                        onChange={(e) => {
                          const next = [...data.sprint_matrix.steps];
                          next[i].sub = e.target.value;
                          updateSectionField("sprint_matrix", "steps", next);
                        }}
                        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-[11px] text-slate-300"
                        placeholder="Sub-focus summary"
                      />
                      <input
                        type="text"
                        value={st.sla}
                        onChange={(e) => {
                          const next = [...data.sprint_matrix.steps];
                          next[i].sla = e.target.value;
                          updateSectionField("sprint_matrix", "steps", next);
                        }}
                        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-[11px] text-amber-400 font-mono"
                        placeholder="SLA tag"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECTION 4: HIRING VELOCITY & CALCULATOR */}
            {activeSection === "hiring_velocity" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Eyebrow Badge
                  </label>
                  <input
                    type="text"
                    value={data.hiring_velocity.eyebrow}
                    onChange={(e) => updateSectionField("hiring_velocity", "eyebrow", e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-3.5 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Section Title
                  </label>
                  <input
                    type="text"
                    value={data.hiring_velocity.title}
                    onChange={(e) => updateSectionField("hiring_velocity", "title", e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-3.5 py-2.5 text-xs text-white font-bold focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Subtitle Copy
                  </label>
                  <textarea
                    rows={3}
                    value={data.hiring_velocity.subtitle}
                    onChange={(e) => updateSectionField("hiring_velocity", "subtitle", e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-3.5 py-2.5 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Calculator Disclaimer
                  </label>
                  <textarea
                    rows={2}
                    value={data.hiring_velocity.disclaimer ?? ""}
                    onChange={(e) => updateSectionField("hiring_velocity", "disclaimer", e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-3.5 py-2.5 text-xs text-slate-300 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* SECTION 5: COMMERCIAL TERMS */}
            {activeSection === "commercial_terms" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Eyebrow Tag
                  </label>
                  <input
                    type="text"
                    value={data.commercial_terms.eyebrow}
                    onChange={(e) => updateSectionField("commercial_terms", "eyebrow", e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-3.5 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Section Title
                  </label>
                  <input
                    type="text"
                    value={data.commercial_terms.title}
                    onChange={(e) => updateSectionField("commercial_terms", "title", e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-3.5 py-2.5 text-xs text-white font-bold focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Subtitle Copy
                  </label>
                  <textarea
                    rows={2}
                    value={data.commercial_terms.subtitle}
                    onChange={(e) => updateSectionField("commercial_terms", "subtitle", e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-3.5 py-2.5 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-3 pt-2 border-t border-slate-800">
                  <span className="block text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-wider">
                    3 Commercial Models
                  </span>
                  {data.commercial_terms.models.map((m, i) => (
                    <div key={i} className="rounded-xl border border-slate-800 bg-slate-900/70 p-3.5 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-cyan-400">{m.tag}</span>
                        <input
                          type="text"
                          value={m.name}
                          onChange={(e) => {
                            const next = [...data.commercial_terms.models];
                            next[i].name = e.target.value;
                            updateSectionField("commercial_terms", "models", next);
                          }}
                          className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1.5 text-xs text-white font-bold"
                        />
                      </div>
                      <input
                        type="text"
                        value={m.category}
                        onChange={(e) => {
                          const next = [...data.commercial_terms.models];
                          next[i].category = e.target.value;
                          updateSectionField("commercial_terms", "models", next);
                        }}
                        placeholder="Category pill"
                        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1.5 text-[11px] text-cyan-300"
                      />
                      <textarea
                        rows={2}
                        value={m.desc}
                        onChange={(e) => {
                          const next = [...data.commercial_terms.models];
                          next[i].desc = e.target.value;
                          updateSectionField("commercial_terms", "models", next);
                        }}
                        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1.5 text-[11px] text-slate-300"
                      />
                      <input
                        type="text"
                        value={m.guarantee}
                        onChange={(e) => {
                          const next = [...data.commercial_terms.models];
                          next[i].guarantee = e.target.value;
                          updateSectionField("commercial_terms", "models", next);
                        }}
                        placeholder="Guarantee badge"
                        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1.5 text-[11px] text-emerald-400 font-semibold"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECTION 6: AI HRMS PORTAL */}
            {activeSection === "ai_hrms_portal" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Eyebrow Tag
                  </label>
                  <input
                    type="text"
                    value={data.ai_hrms_portal.eyebrow}
                    onChange={(e) => updateSectionField("ai_hrms_portal", "eyebrow", e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-3.5 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Section Title
                  </label>
                  <input
                    type="text"
                    value={data.ai_hrms_portal.title}
                    onChange={(e) => updateSectionField("ai_hrms_portal", "title", e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-3.5 py-2.5 text-xs text-white font-bold focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Subtitle Description
                  </label>
                  <textarea
                    rows={3}
                    value={data.ai_hrms_portal.subtitle}
                    onChange={(e) => updateSectionField("ai_hrms_portal", "subtitle", e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-3.5 py-2.5 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-3 pt-2 border-t border-slate-800">
                  <span className="block text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-wider">
                    3 Platform Feature Pillars
                  </span>
                  {data.ai_hrms_portal.features.map((f, i) => (
                    <div key={i} className="rounded-xl border border-slate-800 bg-slate-900/70 p-3 space-y-2">
                      <input
                        type="text"
                        value={f.title}
                        onChange={(e) => {
                          const next = [...data.ai_hrms_portal.features];
                          next[i].title = e.target.value;
                          updateSectionField("ai_hrms_portal", "features", next);
                        }}
                        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1.5 text-xs text-white font-bold"
                      />
                      <textarea
                        rows={2}
                        value={f.body}
                        onChange={(e) => {
                          const next = [...data.ai_hrms_portal.features];
                          next[i].body = e.target.value;
                          updateSectionField("ai_hrms_portal", "features", next);
                        }}
                        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1.5 text-[11px] text-slate-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECTION 7: PRODUCT SOLUTIONS */}
            {activeSection === "product_solutions" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Eyebrow Badge
                  </label>
                  <input
                    type="text"
                    value={data.product_solutions.eyebrow}
                    onChange={(e) => updateSectionField("product_solutions", "eyebrow", e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-3.5 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Section Title
                  </label>
                  <input
                    type="text"
                    value={data.product_solutions.title}
                    onChange={(e) => updateSectionField("product_solutions", "title", e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-3.5 py-2.5 text-xs text-white font-bold focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Subtitle Description
                  </label>
                  <textarea
                    rows={3}
                    value={data.product_solutions.subtitle}
                    onChange={(e) => updateSectionField("product_solutions", "subtitle", e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-3.5 py-2.5 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* SECTION 8: TALENT ECOSYSTEM */}
            {activeSection === "talent_ecosystem" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Eyebrow Tag
                  </label>
                  <input
                    type="text"
                    value={data.talent_ecosystem.eyebrow}
                    onChange={(e) => updateSectionField("talent_ecosystem", "eyebrow", e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-3.5 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Section Title
                  </label>
                  <input
                    type="text"
                    value={data.talent_ecosystem.title}
                    onChange={(e) => updateSectionField("talent_ecosystem", "title", e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-3.5 py-2.5 text-xs text-white font-bold focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Subtitle Description
                  </label>
                  <textarea
                    rows={2}
                    value={data.talent_ecosystem.subtitle}
                    onChange={(e) => updateSectionField("talent_ecosystem", "subtitle", e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-3.5 py-2.5 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-3 pt-2 border-t border-slate-800">
                  <span className="block text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-wider">
                    4 Ecosystem Action Cards
                  </span>
                  {data.talent_ecosystem.stages.map((st, i) => (
                    <div key={i} className="rounded-xl border border-slate-800 bg-slate-900/70 p-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-cyan-400">{st.n}</span>
                        <input
                          type="text"
                          value={st.title}
                          onChange={(e) => {
                            const next = [...data.talent_ecosystem.stages];
                            next[i].title = e.target.value;
                            updateSectionField("talent_ecosystem", "stages", next);
                          }}
                          className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-white font-bold"
                        />
                      </div>
                      <textarea
                        rows={2}
                        value={st.description}
                        onChange={(e) => {
                          const next = [...data.talent_ecosystem.stages];
                          next[i].description = e.target.value;
                          updateSectionField("talent_ecosystem", "stages", next);
                        }}
                        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-[11px] text-slate-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECTION 9: CTA BANNER */}
            {activeSection === "cta_banner" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Trust Badge Tag
                  </label>
                  <input
                    type="text"
                    value={data.cta_banner.badge}
                    onChange={(e) => updateSectionField("cta_banner", "badge", e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-3.5 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Main Banner Title
                  </label>
                  <input
                    type="text"
                    value={data.cta_banner.title}
                    onChange={(e) => updateSectionField("cta_banner", "title", e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-3.5 py-2.5 text-xs text-white font-bold focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Supporting Copy
                  </label>
                  <textarea
                    rows={3}
                    value={data.cta_banner.description}
                    onChange={(e) => updateSectionField("cta_banner", "description", e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-3.5 py-2.5 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                  <div>
                    <label className="block text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Primary CTA Button
                    </label>
                    <input
                      type="text"
                      value={data.cta_banner.primaryCta.label}
                      onChange={(e) =>
                        updateSectionField("cta_banner", "primaryCta", {
                          ...data.cta_banner.primaryCta,
                          label: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Secondary CTA Button
                    </label>
                    <input
                      type="text"
                      value={data.cta_banner.secondaryCta.label}
                      onChange={(e) =>
                        updateSectionField("cta_banner", "secondaryCta", {
                          ...data.cta_banner.secondaryCta,
                          label: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ================================================================= */}
        {/* RIGHT PANEL: Live Interactive Preview Viewport                    */}
        {/* ================================================================= */}
        <div
          ref={previewAreaRef}
          className={`${
            isEditorCollapsed ? "col-span-12" : "col-span-12 lg:col-span-7"
          } bg-[#060a14] flex flex-col h-full overflow-hidden transition-all duration-300`}
        >
          {/* Compact Preview Subheader: No dots, no URL link, clean & compact */}
          <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-800 bg-[#0c1428] shrink-0 gap-2">
            <div className="flex items-center gap-2 shrink-0">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-medium text-slate-300 bg-slate-900/80 border border-slate-800 px-2.5 py-1 rounded-md">
                {deviceMode === "desktop" && <Monitor size={12} className="text-cyan-400" />}
                {deviceMode === "tablet" && <Tablet size={12} className="text-cyan-400" />}
                {deviceMode === "mobile" && <Smartphone size={12} className="text-cyan-400" />}
                <span>
                  {deviceMode === "desktop" && "Desktop · 1366px"}
                  {deviceMode === "tablet" && "Tablet · 1024px"}
                  {deviceMode === "mobile" && "Mobile · 390px"}
                </span>
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* Compact Zoom Selector */}
              <div className="flex items-center rounded-lg border border-slate-800 bg-[#070c18] p-0.5 text-[11px] font-mono">
                <button
                  type="button"
                  onClick={() => setZoomMode("fit")}
                  className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                    zoomMode === "fit" ? "bg-cyan-500/20 text-cyan-300 font-bold" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Fit ({Math.round(scale * 100)}%)
                </button>
                <button
                  type="button"
                  onClick={() => setZoomMode("75")}
                  className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                    zoomMode === "75" ? "bg-cyan-500/20 text-cyan-300 font-bold" : "text-slate-400 hover:text-white"
                  }`}
                >
                  75%
                </button>
                <button
                  type="button"
                  onClick={() => setZoomMode("100")}
                  className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                    zoomMode === "100" ? "bg-cyan-500/20 text-cyan-300 font-bold" : "text-slate-400 hover:text-white"
                  }`}
                >
                  100%
                </button>
              </div>

              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-md">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
                LIVE PREVIEW
              </span>
            </div>
          </div>

          {/* Device Mock Canvas: Height-bounded Viewport to eliminate bottom empty space */}
          <div className="flex-1 overflow-y-auto overflow-x-auto p-3 sm:p-4 pb-8 flex flex-col items-center justify-start bg-slate-950/80 thin-scrollbar">
            {/* Visual Footprint: matches targetWidth * scale and contentHeight * scale */}
            <div
              style={{
                width: `${Math.round(targetWidth * scale)}px`,
                height: contentHeight > 0 ? `${Math.round(contentHeight * scale)}px` : "auto",
              }}
              className="relative transition-all duration-200 mx-auto overflow-hidden shrink-0"
            >
              {/* DESKTOP MODE: Landscape widescreen 1366px */}
              {deviceMode === "desktop" && (
                <div
                  ref={contentFrameRef}
                  style={{
                    width: `${targetWidth}px`,
                    transform: `scale(${scale})`,
                    transformOrigin: "top left",
                  }}
                  className="rounded-xl border border-slate-700/80 bg-canvas text-ink shadow-[0_20px_50px_-15px_rgba(0,0,0,0.8)] overflow-hidden"
                >
                  {renderHomepageContent()}
                </div>
              )}

              {/* TABLET MODE: Landscape centered 1024px */}
              {deviceMode === "tablet" && (
                <div
                  ref={contentFrameRef}
                  style={{
                    width: `${targetWidth}px`,
                    transform: `scale(${scale})`,
                    transformOrigin: "top left",
                  }}
                  className="rounded-[2rem] border-[10px] border-[#0c1428] bg-canvas text-ink shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden"
                >
                  {renderHomepageContent()}
                </div>
              )}

              {/* MOBILE MODE: Vertical 390px */}
              {deviceMode === "mobile" && (
                <div
                  ref={contentFrameRef}
                  style={{
                    width: `${targetWidth}px`,
                    transform: `scale(${scale})`,
                    transformOrigin: "top left",
                  }}
                  className="rounded-[2.5rem] border-[10px] border-[#0c1428] bg-canvas text-ink shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden"
                >
                  {/* Mobile Dynamic Island / Camera Pill */}
                  <div className="bg-[#0c1428] pt-2 pb-1.5 flex flex-col items-center justify-center select-none">
                    <div className="w-20 h-4 rounded-full bg-black border border-slate-800 flex items-center justify-end pr-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-900 border border-slate-800" />
                    </div>
                  </div>
                  {renderHomepageContent()}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
