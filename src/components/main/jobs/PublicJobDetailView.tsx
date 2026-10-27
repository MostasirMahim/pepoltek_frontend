"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PublicJobDetail, applyPublicJobAction } from "@/actions/recruiter.actions";
import {
  Briefcase,
  Users,
  Zap,
  ShieldCheck,
  CheckCircle,
  X,
  ExternalLink,
  DollarSign,
  ArrowRight,
  Clock,
  MapPin,
  Share2,
  Calendar,
  Award,
  ChevronRight,
  FileText,
  Send,
  Building,
} from "@/components/ui/Icons";
import { cleanJobTitle } from "@/lib/title-utils";

interface PublicJobDetailViewProps {
  job: PublicJobDetail;
}

export function PublicJobDetailView({ job }: PublicJobDetailViewProps) {
  const router = useRouter();
  const [isApplyDrawerOpen, setIsApplyDrawerOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Application form state
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applyResult, setApplyResult] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [currentUser, setCurrentUser] = useState<{
    fullName: string;
    role: string;
    email?: string;
  } | null>(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        const { getCurrentUserAction } = await import("@/actions/auth.actions");
        const user = await getCurrentUserAction();
        if (user) {
          setCurrentUser({
            fullName: user.fullName || "Candidate",
            role: user.role || "CANDIDATE",
            email: user.email,
          });
        }
      } catch {
        // Guest user
      }
    }
    checkAuth();
  }, []);

  const isHealth = (job.sector || "").toLowerCase().includes("health");
  const isGig = job.visibility === "published_gig";
  const isBounty = job.bounty_enabled || job.visibility === "bounty" || Number(job.bounty_amount) > 0;
  const bountyVal = Number(job.bounty_amount || 1500);

  const cleanId = String(job.id).replace(/-/g, "");
  const shortId = cleanId.slice(-6).toUpperCase();

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleApplyClick = () => {
    if (!currentUser) {
      router.push(`/login?callbackUrl=/jobs/${job.id}`);
      return;
    }
    setIsApplyDrawerOpen(true);
    setApplyResult(null);
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      router.push(`/login?callbackUrl=/jobs/${job.id}`);
      return;
    }

    setIsSubmitting(true);
    setApplyResult(null);

    const res = await applyPublicJobAction(job.id, {
      full_name: currentUser.fullName || "Verified Candidate",
      email: currentUser.email || "",
      notes: notes.trim(),
    });

    setIsSubmitting(false);

    if (res.success) {
      setApplyResult({
        type: "success",
        text: `Application submitted successfully! Your application reference is REF-${shortId}. Our technical team will review your profile within 24 hours under our 7-day sprint SLA.`,
      });
      setNotes("");
    } else {
      setApplyResult({
        type: "error",
        text: res.error || "Failed to submit application. Please verify your connection and try again.",
      });
    }
  };

  return (
    <div className="relative min-h-screen bg-canvas pb-20 pt-6">
      {/* Ambient background blur */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[450px] w-full max-w-7xl -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_top,rgba(10,132,255,0.08),transparent_70%)] blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 space-y-8">
        {/* Top Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 font-enterprise text-[11px] text-ink-soft">
          <Link href="/" className="hover:text-electric transition-colors">
            Home
          </Link>
          <ChevronRight size={12} className="text-mist" />
          <Link href="/jobs" className="hover:text-electric transition-colors">
            Open Jobs & Gigs
          </Link>
          <ChevronRight size={12} className="text-mist" />
          <span className="text-ink font-semibold truncate max-w-xs sm:max-w-md">
            {cleanJobTitle(job.title)}
          </span>
        </nav>

        {/* Hero Header Card */}
        <div className="rounded-3xl border border-[#bcd6fa] bg-white p-6 sm:p-8 lg:p-10 shadow-xs relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8">
            <div className="space-y-4 flex-1">
              {/* Badges Ribbon */}
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full px-3 py-1 font-enterprise text-[10.5px] font-bold ${
                    isHealth
                      ? "bg-teal-50 text-teal-700 border border-teal-200"
                      : "bg-electric/10 text-electric border border-electric/30"
                  }`}
                >
                  {isHealth ? "Healthcare Rota" : "Software Tech"}
                </span>

                <span className="rounded-full bg-slate-100 text-slate-700 border border-slate-200 px-3 py-1 font-enterprise text-[10.5px] font-bold">
                  {job.level || "Senior Tier"} (Single Hire)
                </span>

                {isGig ? (
                  <span className="rounded-full bg-purple-50 text-purple-700 border border-purple-200 px-3 py-1 font-enterprise text-[10.5px] font-bold inline-flex items-center gap-1.5">
                    <Zap size={12} />
                    <span>Contract Sprint</span>
                  </span>
                ) : isBounty ? (
                  <span className="rounded-full bg-amber-50 text-amber-800 border border-amber-300 px-3 py-1 font-enterprise text-[10.5px] font-bold inline-flex items-center gap-1.5 shadow-2xs">
                    <DollarSign size={12} className="text-amber-600" />
                    <span>Referral Bounty: ${bountyVal.toLocaleString()}</span>
                  </span>
                ) : (
                  <span className="rounded-full bg-canvas text-ink-soft border border-[#bcd6fa]/60 px-3 py-1 font-enterprise text-[10.5px] font-bold inline-flex items-center gap-1.5">
                    <Briefcase size={12} />
                    <span>Specialist Role</span>
                  </span>
                )}

                <span className="rounded-full bg-signal/10 text-signal border border-signal/30 px-3 py-1 font-enterprise text-[10.5px] font-bold inline-flex items-center gap-1.5">
                  <ShieldCheck size={12} />
                  <span>Verified Requisition</span>
                </span>

                <span className="rounded-full bg-sky-50 text-sky-700 border border-sky-200 px-3 py-1 font-enterprise text-[10.5px] font-bold inline-flex items-center gap-1.5">
                  <Clock size={12} />
                  <span>7-Day Deployment SLA</span>
                </span>
              </div>

              {/* Title & Organization */}
              <div>
                <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0a1428] tracking-tight leading-tight">
                  {cleanJobTitle(job.title)}
                </h1>
                <div className="mt-2.5 flex flex-wrap items-center gap-y-2 gap-x-4 font-enterprise text-xs text-ink-soft">
                  <span className="inline-flex items-center gap-1 text-ink font-semibold">
                    <Building size={14} className="text-electric" />
                    <span>{job.client_name || "Enterprise Workspace Partner"}</span>
                  </span>
                  <span className="inline-flex items-center gap-1 text-mist">
                    <MapPin size={14} />
                    <span>{job.location || "100% Remote (US/EU)"}</span>
                  </span>
                  <span className="text-mist">·</span>
                  <span className="text-mist">Requisition ID: REQ-{shortId}</span>
                </div>
              </div>

              {/* Core Skill Chips */}
              <div className="flex flex-wrap gap-2 pt-1">
                {(job.skills || []).map((skill) => (
                  <span
                    key={skill}
                    className="rounded-lg bg-canvas border border-[#bcd6fa]/70 px-3 py-1 font-enterprise text-xs font-semibold text-ink"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Compensation & Action Card */}
            <div className="flex flex-col justify-between rounded-2xl border border-[#bcd6fa]/80 bg-[#f8fbff] p-6 lg:min-w-[320px] shrink-0 space-y-6">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-enterprise text-[11px] font-bold uppercase tracking-wider text-mist">
                    Compensation Rate
                  </span>
                  <span className="rounded bg-signal/10 px-2 py-0.5 font-enterprise text-[10px] font-bold text-signal">
                    FDIC Escrow
                  </span>
                </div>
                <div className="mt-1 font-display text-2xl sm:text-3xl font-extrabold text-[#0a1428]">
                  ${job.budget_min || 95} - ${job.budget_max || 135}
                  <span className="text-sm font-enterprise font-normal text-mist"> /hr</span>
                </div>
                <div className="mt-1 font-enterprise text-xs font-semibold text-signal">
                  {job.engagement || (isGig ? "Contract Sprint" : "Direct Hire Specialist")}
                </div>
                <p className="mt-2 text-[11.5px] leading-relaxed text-ink-soft">
                  Transparent compensation with guaranteed bi-weekly payouts and zero hidden agency deductions.
                </p>
              </div>

              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={handleApplyClick}
                  className="w-full rounded-xl bg-electric px-6 py-3.5 font-display text-sm font-bold text-white shadow-[0_6px_20px_-4px_rgba(10,132,255,0.4)] hover:bg-electric-bright hover:-translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Apply for Position</span>
                  <ArrowRight size={15} />
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleShare}
                    className="flex-1 rounded-xl border border-[#bcd6fa] bg-white px-4 py-2.5 font-display text-xs font-semibold text-ink hover:border-electric transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Share2 size={13} />
                    <span>{copiedLink ? "Link Copied!" : "Share Role"}</span>
                  </button>

                  <Link
                    href="/ecosystem/referrals"
                    className="flex-1 rounded-xl border border-amber-300 bg-amber-50/60 px-4 py-2.5 font-display text-xs font-semibold text-amber-900 hover:bg-amber-100 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <DollarSign size={13} />
                    <span>Refer a Peer</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Two-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (8 cols): Structured Job Content */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* 1. Role Overview & Sprint Mission */}
            <section className="rounded-3xl border border-[#bcd6fa] bg-white p-6 sm:p-8 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5 border-b border-[#bcd6fa]/40 pb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-electric/10 text-electric">
                  <Briefcase size={16} />
                </div>
                <h2 className="font-display text-lg sm:text-xl font-bold text-[#0a1428]">
                  Role Overview &amp; Sprint Mission
                </h2>
              </div>
              <p className="text-sm leading-relaxed text-[#3d4c68]">
                {job.description ||
                  "Pepoltek is deploying a dedicated senior specialist to join our client's high-velocity engineering squad. In this role, you will lead critical architectural initiatives with guaranteed live overlap, working directly with senior stakeholders to deliver production-grade features under our structured 7-day deployment cadence."}
              </p>
              <div className="rounded-2xl border border-electric/20 bg-electric/[0.04] p-4 flex items-start gap-3">
                <ShieldCheck size={20} className="text-electric shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed text-ink-soft">
                  <span className="font-bold text-ink">Zero-Risk 2-Week Trial:</span> All client deployments include a 14-day performance guarantee. Candidates receive full compensation from Day 1 backed by verified escrow vaults.
                </div>
              </div>
            </section>

            {/* 2. Key Responsibilities & Deliverables */}
            <section className="rounded-3xl border border-[#bcd6fa] bg-white p-6 sm:p-8 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5 border-b border-[#bcd6fa]/40 pb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-signal/10 text-signal">
                  <CheckCircle size={16} />
                </div>
                <h2 className="font-display text-lg sm:text-xl font-bold text-[#0a1428]">
                  Key Responsibilities &amp; Deliverables
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {(job.responsibilities && job.responsibilities.length > 0
                  ? job.responsibilities
                  : [
                      `Architect, deliver, and maintain mission-critical cloud services utilizing ${job.skills.slice(0, 3).join(", ") || "core technologies"}.`,
                      "Collaborate actively in daily standups and engineering RFC design reviews under a structured 7-day sprint SLA.",
                      "Implement automated unit, integration, and load test suites to maintain high system reliability.",
                      "Participate in live architectural demos and cross-functional technical planning with client engineering leads.",
                    ]
                ).map((resp, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 rounded-2xl border border-[#bcd6fa]/50 bg-canvas/60 p-4 transition-all hover:bg-white hover:border-electric/50"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-signal/10 text-signal font-enterprise text-xs font-bold mt-0.5">
                      ✓
                    </span>
                    <p className="text-xs sm:text-sm leading-relaxed text-[#3d4c68]">
                      {resp}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* 3. Core Qualifications & Technical Standards */}
            <section className="rounded-3xl border border-[#bcd6fa] bg-white p-6 sm:p-8 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5 border-b border-[#bcd6fa]/40 pb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
                  <Award size={16} />
                </div>
                <h2 className="font-display text-lg sm:text-xl font-bold text-[#0a1428]">
                  Core Qualifications &amp; Technical Standards
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {(job.requirements && job.requirements.length > 0
                  ? job.requirements
                  : [
                      `5+ years of verified production experience operating complex systems as a ${job.level || "Senior"} Specialist.`,
                      `Deep mastery of modern fullstack or distributed architectures including ${job.skills.slice(0, 4).join(", ") || "enterprise tooling"}.`,
                      "Strong understanding of database schema design, indexing, caching strategies, and telemetry.",
                      "Track record of writing clean, maintainable code with clear documentation and self-managing initiative.",
                    ]
                ).map((req, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 rounded-2xl border border-[#bcd6fa]/50 bg-canvas/60 p-4 transition-all hover:bg-white hover:border-electric/50"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-electric/10 text-electric font-enterprise text-xs font-bold mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-xs sm:text-sm leading-relaxed text-[#3d4c68]">
                      {req}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* 4. Nice-to-Have / Preferred Qualifications */}
            <section className="rounded-3xl border border-[#bcd6fa] bg-white p-6 sm:p-8 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5 border-b border-[#bcd6fa]/40 pb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
                  <Zap size={16} />
                </div>
                <h2 className="font-display text-lg sm:text-xl font-bold text-[#0a1428]">
                  Nice-to-Have / Preferred Experience
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {(job.nice_to_haves && job.nice_to_haves.length > 0
                  ? job.nice_to_haves
                  : [
                      "Experience operating within regulated environments (SOC 2 Type II or HIPAA Title II compliance).",
                      "Familiarity with cloud-native deployment patterns (Docker, Kubernetes, Terraform, AWS/GCP).",
                      "Active open-source contributions or technical leadership experience.",
                    ]
                ).map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 rounded-2xl border border-[#bcd6fa]/40 bg-canvas/40 p-3.5"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-electric shrink-0 mt-2" />
                    <p className="text-xs sm:text-sm leading-relaxed text-[#4f6485]">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* 5. 7-Day Sprint Hiring Roadmap */}
            <section className="rounded-3xl border border-[#bcd6fa] bg-white p-6 sm:p-8 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-[#bcd6fa]/40 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-electric/10 text-electric">
                    <Calendar size={16} />
                  </div>
                  <h2 className="font-display text-lg sm:text-xl font-bold text-[#0a1428]">
                    7-Day Sprint Hiring Roadmap
                  </h2>
                </div>
                <span className="rounded-full bg-electric/10 px-3 py-1 font-enterprise text-[10px] font-bold text-electric">
                  Guaranteed SLA
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {(job.interview_process && job.interview_process.length > 0
                  ? job.interview_process
                  : [
                      {
                        step: "1",
                        title: "Application Intake",
                        duration: "Day 1",
                        desc: "Submit CV and verified telemetry profile for automated matching.",
                      },
                      {
                        step: "2",
                        title: "Technical Vetting",
                        duration: "Day 2-3",
                        desc: "Practical architecture and competency review with senior engineers.",
                      },
                      {
                        step: "3",
                        title: "Client Panel",
                        duration: "Day 4-5",
                        desc: "Direct conversational alignment with client engineering leadership.",
                      },
                      {
                        step: "4",
                        title: "Sprint Deploy",
                        duration: "Day 6-7",
                        desc: "Compliance onboarding, escrow funding, and workspace launch.",
                      },
                    ]
                ).map((step) => (
                  <div
                    key={step.step}
                    className="rounded-2xl border border-[#bcd6fa]/60 bg-canvas/50 p-4 space-y-2 relative"
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-electric text-white font-enterprise text-xs font-bold">
                        {step.step}
                      </span>
                      <span className="font-enterprise text-[10.5px] font-bold text-electric">
                        {step.duration}
                      </span>
                    </div>
                    <div className="font-display text-sm font-bold text-[#0a1428]">
                      {step.title}
                    </div>
                    <p className="text-[11.5px] leading-snug text-ink-soft">
                      {step.desc}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column (4 cols): Sticky Requisition Details & Bounties */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            
            {/* Requisition Snapshot Card */}
            <div className="rounded-3xl border border-[#bcd6fa] bg-white p-6 shadow-xs space-y-5">
              <h3 className="font-display text-base font-bold text-[#0a1428] border-b border-[#bcd6fa]/40 pb-3">
                Requisition Snapshot
              </h3>

              <div className="space-y-3.5 text-xs font-enterprise">
                <div className="flex items-center justify-between py-1 border-b border-[#bcd6fa]/30">
                  <span className="text-ink-soft">Compensation</span>
                  <span className="font-enterprise font-bold text-ink">
                    ${job.budget_min || 95} - ${job.budget_max || 135} /hr
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-[#bcd6fa]/30">
                  <span className="text-ink-soft">Headcount</span>
                  <span className="font-enterprise font-bold text-ink">
                    1 Specialist (Strict Single Role)
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-[#bcd6fa]/30">
                  <span className="text-ink-soft">Engagement Model</span>
                  <span className="font-enterprise font-semibold text-ink">
                    {job.engagement || "Direct Hire Specialist"}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-[#bcd6fa]/30">
                  <span className="text-ink-soft">Workplace Location</span>
                  <span className="font-enterprise font-semibold text-ink">
                    {job.location || "100% Remote"}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-[#bcd6fa]/30">
                  <span className="text-ink-soft">Live Timezone Overlap</span>
                  <span className="font-enterprise font-semibold text-ink">
                    4 to 8 Hours (US/EU)
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-[#bcd6fa]/30">
                  <span className="text-ink-soft">Client Escrow</span>
                  <span className="font-enterprise font-bold text-signal">
                    Verified FDIC Insured
                  </span>
                </div>

                <div className="flex items-center justify-between py-1">
                  <span className="text-ink-soft">Deployment SLA</span>
                  <span className="font-enterprise font-bold text-electric">
                    7 Days Guaranteed
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleApplyClick}
                className="w-full rounded-xl bg-ink py-3 font-display text-xs font-bold text-white hover:bg-electric transition-colors cursor-pointer text-center"
              >
                Apply for Position Now →
              </button>
            </div>

            {/* Referral Bounty Card (if active) */}
            {isBounty && (
              <div className="rounded-3xl border border-amber-300 bg-gradient-to-b from-amber-50/80 to-amber-100/40 p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-amber-500 text-white font-bold text-xs">
                    $
                  </span>
                  <div>
                    <span className="font-enterprise text-[10px] font-bold uppercase tracking-wider text-amber-800">
                      Referral Network Bounty
                    </span>
                    <h4 className="font-display text-sm font-bold text-amber-950">
                      Earn ${bountyVal.toLocaleString()} Cash
                    </h4>
                  </div>
                </div>

                <p className="text-xs leading-relaxed text-amber-900">
                  Know a qualified specialist for this requisition? Introduce them to Pepoltek and receive a verified cash bounty upon successful client placement.
                </p>

                <Link
                  href={`/ecosystem/referrals?requisition_id=${job.id}`}
                  className="block w-full rounded-xl border border-amber-400 bg-white py-2.5 font-display text-xs font-bold text-amber-950 hover:bg-amber-50 transition-colors text-center shadow-xs cursor-pointer"
                >
                  Refer Candidate for Bounty →
                </Link>
              </div>
            )}

            {/* Enterprise Assurance Card */}
            <div className="rounded-3xl border border-[#bcd6fa]/60 bg-white p-6 shadow-xs space-y-3">
              <h4 className="font-display text-xs font-bold uppercase tracking-wider text-mist">
                The Pepoltek Standard
              </h4>
              <ul className="space-y-2 text-xs text-ink-soft">
                <li className="flex items-start gap-2">
                  <span className="text-signal font-bold">✓</span>
                  <span>Direct client hiring without multi-tier broker markups.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-signal font-bold">✓</span>
                  <span>Proctor-free assessment: evaluated on architecture and delivery.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-signal font-bold">✓</span>
                  <span>Prompt bi-weekly escrow payments direct to your account.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Slide-Over Application Drawer */}
      {isApplyDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-ink/50 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col justify-between border-l border-[#bcd6fa] animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-[#bcd6fa]/50 p-6 bg-canvas/40">
              <div>
                <span className="font-enterprise text-[10px] font-bold uppercase tracking-wider text-electric">
                  Candidate Application
                </span>
                <h2 className="font-display text-lg font-bold text-[#0a1428] truncate max-w-sm sm:max-w-md">
                  {cleanJobTitle(job.title)}
                </h2>
                <p className="font-enterprise text-xs text-ink-soft">
                  REQ-{shortId} · ${job.budget_min || 95} - ${job.budget_max || 135}/hr
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsApplyDrawerOpen(false)}
                className="h-8 w-8 rounded-full border border-[#bcd6fa] flex items-center justify-center text-mist hover:text-ink hover:bg-canvas transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Drawer Body Form */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {applyResult ? (
                <div
                  className={`rounded-2xl p-5 border ${
                    applyResult.type === "success"
                      ? "border-signal/30 bg-signal/10 text-signal"
                      : "border-red-200 bg-red-50 text-red-700"
                  }`}
                >
                  <div className="font-display font-bold text-sm">
                    {applyResult.type === "success" ? "Application Confirmed!" : "Submission Note"}
                  </div>
                  <p className="mt-1 text-xs leading-relaxed">{applyResult.text}</p>
                  {applyResult.type === "success" && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Link
                        href="/candidate/applications"
                        className="rounded-xl bg-electric px-4 py-2 font-display text-xs font-bold text-white shadow-xs hover:bg-ink transition-colors"
                      >
                        Open Applications Dashboard →
                      </Link>
                      <button
                        type="button"
                        onClick={() => setIsApplyDrawerOpen(false)}
                        className="rounded-xl border border-[#bcd6fa] bg-white px-4 py-2 font-display text-xs font-semibold text-ink hover:bg-canvas transition-colors cursor-pointer"
                      >
                        Close Drawer
                      </button>
                    </div>
                  )}
                </div>
              ) : currentUser ? (
                <form id="public-job-apply-form" onSubmit={handleApply} className="space-y-4 text-xs font-enterprise">
                  {/* Authenticated Candidate Card */}
                  <div className="rounded-2xl border border-electric/30 bg-electric/5 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-[#0066FF] to-[#00D4FF] text-white font-bold flex items-center justify-center font-display text-sm shadow-xs">
                        {currentUser.fullName.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-display font-bold text-ink text-sm">{currentUser.fullName}</h4>
                          <span className="rounded bg-signal/10 px-2 py-0.5 font-enterprise text-[10px] font-bold text-signal">Verified Dossier</span>
                        </div>
                        <p className="font-enterprise text-xs text-ink-soft">{currentUser.email}</p>
                      </div>
                    </div>
                    <Link href="/candidate/profile" target="_blank" className="text-xs font-enterprise text-electric hover:underline font-semibold">
                      View Profile ↗
                    </Link>
                  </div>

                  {/* Requisition Card */}
                  <div className="rounded-2xl border border-[#bcd6fa]/60 bg-canvas/40 p-3.5 space-y-1">
                    <div className="text-[10px] uppercase font-bold text-mist tracking-wider">
                      Position Overview
                    </div>
                    <div className="font-bold text-sm text-ink">{cleanJobTitle(job.title)}</div>
                    <div className="text-xs text-ink-soft flex items-center gap-2 flex-wrap">
                      <span>{job.client_name || "Enterprise Partner"}</span>
                      <span>·</span>
                      <span>${job.budget_min || 95} - ${job.budget_max || 135}/hr</span>
                      <span>·</span>
                      <span>{job.location || "100% Remote"}</span>
                    </div>
                  </div>

                  {/* Candidate Note / Pitch */}
                  <div className="space-y-1">
                    <label className="font-enterprise text-xs font-bold text-ink">
                      Candidate Notes &amp; Core Strengths (Optional)
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Highlight relevant production accomplishments, core tools, and availability..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/30 px-3.5 py-2.5 text-xs text-ink focus:border-electric focus:bg-white focus:outline-none"
                    />
                  </div>
                </form>
              ) : (
                <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 space-y-3 font-enterprise">
                  <div className="font-display font-bold text-sm text-amber-900">
                    Authentication Required
                  </div>
                  <p className="text-xs text-amber-800 leading-relaxed">
                    Please sign in with your verified candidate profile to submit an application with your dossier.
                  </p>
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => router.push(`/login?callbackUrl=/jobs/${job.id}`)}
                      className="rounded-xl bg-ink px-4 py-2 font-display text-xs font-bold text-white hover:bg-electric transition-colors"
                    >
                      Sign In to Apply →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Drawer Footer Actions */}
            {!applyResult && currentUser && (
              <div className="border-t border-[#bcd6fa]/50 p-6 bg-canvas/40 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setIsApplyDrawerOpen(false)}
                  className="rounded-xl border border-[#bcd6fa] px-4 py-2.5 font-display text-xs font-semibold text-ink-soft hover:bg-canvas transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  form="public-job-apply-form"
                  disabled={isSubmitting}
                  className="rounded-xl bg-electric px-6 py-2.5 font-display text-xs font-bold text-white shadow-xs hover:bg-electric-bright disabled:opacity-50 transition-all flex items-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>Submitting Application...</span>
                  ) : (
                    <>
                      <span>Submit Candidate Application</span>
                      <Send size={13} />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
