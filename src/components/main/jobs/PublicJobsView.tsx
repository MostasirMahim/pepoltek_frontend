"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PageHero from "@/components/main/PageHero";
import { applyPublicJobAction } from "@/actions/recruiter.actions";
import { getCurrentUserAction, AuthUser } from "@/actions/auth.actions";
import {
  Search,
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
} from "@/components/ui/Icons";
import { cleanJobTitle } from "@/lib/title-utils";

export interface PublicJob {
  id: string;
  client_name?: string;
  title: string;
  sector: string;
  level?: string;
  headcount?: number;
  skills: string[];
  budget_min?: number;
  budget_max?: number;
  location?: string;
  engagement?: string;
  visibility?: string;
  bounty_enabled?: boolean;
  bounty_type_id?: string;
  bounty_type_name?: string;
  bounty_amount?: number;
  status: string;
  priority?: number;
  description?: string;
  created_at?: string;
}

interface PublicJobsViewProps {
  initialJobs: PublicJob[];
}

export function PublicJobsView({ initialJobs }: PublicJobsViewProps) {
  const router = useRouter();
  const [jobs] = useState<PublicJob[]>(initialJobs);
  const [searchTerm, setSearchTerm] = useState("");
  const [sectorFilter, setSectorFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedJob, setSelectedJob] = useState<PublicJob | null>(null);

  // Authenticated user state
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const u = await getCurrentUserAction();
        if (u) {
          setCurrentUser(u);
        }
      } catch {
        // Guest user
      }
    }
    loadUser();
  }, []);

  // Application note state
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applyResult, setApplyResult] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const filteredJobs = jobs.filter((job) => {
    const matchesSector =
      sectorFilter === "all" ||
      (sectorFilter === "tech" && (job.sector || "").toLowerCase().includes("tech")) ||
      (sectorFilter === "health" && (job.sector || "").toLowerCase().includes("health"));

    const matchesType =
      typeFilter === "all" ||
      (typeFilter === "specialist" && job.visibility !== "published_gig" && !job.bounty_enabled && job.visibility !== "bounty") ||
      (typeFilter === "gig" && job.visibility === "published_gig") ||
      (typeFilter === "bounty" && (job.bounty_enabled || job.visibility === "bounty" || Number(job.bounty_amount) > 0));

    const query = searchTerm.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      job.title.toLowerCase().includes(query) ||
      (job.description || "").toLowerCase().includes(query) ||
      (job.location || "").toLowerCase().includes(query) ||
      (job.skills || []).some((s) => s.toLowerCase().includes(query));

    return matchesSector && matchesType && matchesSearch;
  });

  const handleApplyClick = (job: PublicJob) => {
    if (!currentUser) {
      router.push(`/login?callbackUrl=/jobs`);
      return;
    }
    setSelectedJob(job);
    setApplyResult(null);
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;

    if (!currentUser) {
      router.push(`/login?callbackUrl=/jobs`);
      return;
    }

    setIsSubmitting(true);
    setApplyResult(null);

    const res = await applyPublicJobAction(selectedJob.id, {
      full_name: currentUser.fullName || "Verified Candidate",
      email: currentUser.email || "",
      notes: notes.trim(),
    });

    setIsSubmitting(false);

    if (res.success) {
      setApplyResult({
        type: "success",
        text: "Application submitted successfully! Your verified profile and dossier have been attached to this requisition in the ATS.",
      });
      setNotes("");
    } else {
      setApplyResult({
        type: "error",
        text: res.error || "Failed to submit application. Please check your connection and try again.",
      });
    }
  };

  return (
    <div className="relative min-h-screen bg-canvas">
      {/* High-Fidelity PageHero with Ambient Grid, Pen-Curve Underline & Live Telemetry Cards */}
      <PageHero
        eyebrow="Verified Enterprise Openings"
        title="Production Engineering Teams &"
        highlightedText="Clinical Rotas"
        description="Join elite software engineering squads and compliance-cleared healthcare teams deployed with 7-day velocity, transparent compensation, and 100% verified contracts."
        stats={[
          {
            value: "2 to 7 Days",
            label: "Sprint Shortlist Velocity",
            icon: <Clock size={20} />,
          },
          {
            value: "100%",
            label: "Verified Contracts & Rates",
            icon: <ShieldCheck size={20} />,
          },
          {
            value: "Up to $2,000",
            label: "Community Referral Bounty",
            icon: <DollarSign size={20} />,
          },
        ]}
        actions={[
          {
            label: "Explore Openings",
            href: "#job-search",
            primary: true,
          },
          {
            label: "Submit Your Resume",
            href: "/register",
          },
        ]}
        proofPills={[
          "W2 & C2C Compliant",
          "4 to 8 Hrs Live Overlap",
          "90-Day Placement Guarantee",
          "HIPAA Title II Certified",
        ]}
      />

      {/* Main Content Area */}
      <div id="job-search" className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">

        {/* Search & Dual Filters */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mist" size={16} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by role title, skill (React, Go, FHIR, AWS), or location..."
              className="w-full rounded-2xl border border-[#bcd6fa] bg-white px-4 py-3 pl-10 text-xs sm:text-sm text-ink placeholder-mist focus:border-electric focus:outline-hidden shadow-xs"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            {/* Sector Tabs */}
            <div className="flex gap-1.5 flex-wrap bg-white p-1.5 rounded-2xl border border-[#bcd6fa]/60 shadow-2xs">
              {[
                { id: "all", label: "All Sectors" },
                { id: "tech", label: "Technology & SDLC" },
                { id: "health", label: "Healthcare & Clinical" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSectorFilter(tab.id)}
                  className={`rounded-xl px-3.5 py-1.5 font-display text-xs font-semibold transition-all cursor-pointer ${
                    sectorFilter === tab.id
                      ? "bg-ink text-white shadow-xs"
                      : "text-ink-soft hover:text-ink hover:bg-canvas"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Type Tabs */}
            <div className="flex gap-1.5 flex-wrap bg-white p-1.5 rounded-2xl border border-[#bcd6fa]/60 shadow-2xs">
              {[
                { id: "all", label: "All Openings" },
                { id: "specialist", label: "Full-Time Roles" },
                { id: "gig", label: "Contract Gigs" },
                { id: "bounty", label: "Bounty Roles" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setTypeFilter(tab.id)}
                  className={`rounded-xl px-3.5 py-1.5 font-display text-xs font-semibold transition-all cursor-pointer ${
                    typeFilter === tab.id
                      ? "bg-electric text-white shadow-xs"
                      : "text-ink-soft hover:text-ink hover:bg-canvas"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Jobs List */}
        {filteredJobs.length === 0 ? (
          <div className="rounded-3xl border border-[#bcd6fa] bg-white p-12 text-center shadow-xs">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-electric/10 text-electric">
              <Briefcase size={24} />
            </div>
            <h3 className="font-display text-lg font-bold text-ink">No Open Positions Match Your Search</h3>
            <p className="mt-1 text-xs text-ink-soft max-w-md mx-auto leading-relaxed">
              New enterprise requisitions and gigs are published regularly by our enterprise hiring partners. Try adjusting your search query or explore all sectors.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((job) => {
              const isHealth = (job.sector || "").toLowerCase().includes("health");
              const count = job.headcount || 1;
              const isSquad = count > 1;
              const isGig = job.visibility === "published_gig";
              const isBounty = job.bounty_enabled || job.visibility === "bounty" || Number(job.bounty_amount) > 0;

              return (
                <div
                  key={job.id}
                  className="rounded-2xl border border-[#bcd6fa] bg-white p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-electric transition-all"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Sector badge */}
                      <span
                        className={`rounded-full px-2.5 py-0.5 font-enterprise text-[10px] font-bold ${
                          isHealth
                            ? "bg-teal-50 text-teal-700 border border-teal-200"
                            : "bg-electric/10 text-electric border border-electric/30"
                        }`}
                      >
                        {isHealth ? "Healthcare Rota" : "Software Tech"}
                      </span>

                      {/* Role Tier Badge */}
                      <span className="rounded-full bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-0.5 font-enterprise text-[10px] font-bold">
                        {job.level || "Senior Tier"}
                      </span>

                      {/* Type badge */}
                      {isGig ? (
                        <span className="rounded-full bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-0.5 font-enterprise text-[10px] font-bold inline-flex items-center gap-1">
                          <Zap size={11} />
                          <span>Contract Gig</span>
                        </span>
                      ) : isBounty ? (
                        <span className="rounded-full bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 font-enterprise text-[10px] font-bold inline-flex items-center gap-1 shadow-2xs">
                          <DollarSign size={11} className="text-amber-600" />
                          <span>Referral Bounty: ${Number(job.bounty_amount || 1500).toLocaleString()}</span>
                        </span>
                      ) : (
                        <span className="rounded-full bg-canvas text-ink-soft border border-[#bcd6fa]/50 px-2.5 py-0.5 font-enterprise text-[10px] font-bold inline-flex items-center gap-1">
                          <Briefcase size={11} />
                          <span>Specialist Role</span>
                        </span>
                      )}

                      <span className="rounded-full bg-signal/10 px-2.5 py-0.5 font-enterprise text-[10px] font-bold text-signal inline-flex items-center gap-1">
                        <ShieldCheck size={11} />
                        <span>Verified Requisition</span>
                      </span>

                      <span className="font-enterprise text-xs text-mist">
                        {job.location || "100% Remote"}
                      </span>
                    </div>

                    <Link href={`/jobs/${job.id}`} className="block group">
                      <h2 className="font-display text-xl font-bold text-ink group-hover:text-electric transition-colors">
                        {cleanJobTitle(job.title)}
                      </h2>
                    </Link>

                    <p className="text-xs text-ink-soft line-clamp-2 max-w-2xl leading-relaxed">
                      {job.description ||
                        "Elite squad opening for senior talent. Proctor-free benchmark assessment and rapid 7-day deployment."}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {(job.skills || []).map((s) => (
                        <span
                          key={s}
                          className="rounded-md bg-canvas/60 border border-[#bcd6fa]/50 px-2.5 py-0.5 font-enterprise text-[11px] font-medium text-ink"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col md:items-end justify-between gap-3 shrink-0 border-t md:border-t-0 md:border-l border-[#bcd6fa]/40 pt-4 md:pt-0 md:pl-6">
                    <div>
                      <div className="font-enterprise text-xs text-mist">Compensation Rate</div>
                      <div className="font-display text-lg font-bold text-ink">
                        ${job.budget_min || 95} - ${job.budget_max || 135}
                        <span className="text-xs font-enterprise font-normal text-mist"> /hr</span>
                      </div>
                      <div className="font-enterprise text-[11px] text-signal font-semibold">
                        {job.engagement || (isGig ? "Contract Sprint" : "Direct Hire Specialist")}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/jobs/${job.id}`}
                        className="rounded-xl border border-[#bcd6fa] bg-white px-4 py-2.5 font-display text-xs font-semibold text-ink hover:border-electric hover:text-electric shadow-xs transition-colors cursor-pointer text-center"
                      >
                        View Details
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleApplyClick(job)}
                        className="rounded-xl bg-ink px-4 py-2.5 font-display text-xs font-semibold text-white hover:bg-electric shadow-xs transition-colors cursor-pointer text-center inline-flex items-center gap-1.5"
                      >
                        <span>Apply</span>
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Right-Side Sheet Drawer: Job Application */}
      {selectedJob && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-ink/40 backdrop-blur-xs animate-in fade-in-0 duration-150"
          onClick={() => setSelectedJob(null)}
        >
          <div
            className="w-full max-w-lg bg-white h-full shadow-2xl p-6 sm:p-8 flex flex-col justify-between overflow-y-auto thin-scrollbar animate-in slide-in-from-right duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-start justify-between border-b border-slate-200/80 pb-4">
                <div>
                  <span className="font-enterprise text-[10px] uppercase font-bold text-electric">
                    Application Dossier Submission
                  </span>
                  <h2 className="font-display text-xl font-bold text-ink mt-1">
                    {cleanJobTitle(selectedJob.title)}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {selectedJob.client_name || "Enterprise Partner"} · {selectedJob.location || "100% Remote"} · ${selectedJob.budget_min || 95} - ${selectedJob.budget_max || 135}/hr
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedJob(null)}
                  className="rounded-xl p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {applyResult ? (
                <div
                  className={`rounded-2xl p-5 border space-y-4 ${
                    applyResult.type === "success"
                      ? "border-emerald-200 bg-emerald-50/70 text-emerald-900"
                      : "border-rose-200 bg-rose-50 text-rose-900"
                  }`}
                >
                  <div className="flex items-center gap-2.5 font-display font-bold text-sm">
                    <CheckCircle size={18} className={applyResult.type === "success" ? "text-emerald-600" : "text-rose-600"} />
                    <span>{applyResult.type === "success" ? "Application Successfully Submitted!" : "Submission Error"}</span>
                  </div>
                  <p className="text-xs leading-relaxed text-slate-700">
                    {applyResult.text}
                  </p>
                  {applyResult.type === "success" && (
                    <div className="pt-2 flex flex-col sm:flex-row gap-2">
                      <Link
                        href="/candidate/applications"
                        className="rounded-xl bg-electric px-4 py-2.5 font-display text-xs font-bold text-white hover:bg-ink transition-colors text-center shadow-xs"
                      >
                        Track in Candidate Dashboard →
                      </Link>
                      <button
                        type="button"
                        onClick={() => setSelectedJob(null)}
                        className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 font-display text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer text-center"
                      >
                        Done
                      </button>
                    </div>
                  )}
                </div>
              ) : currentUser ? (
                <form onSubmit={handleApply} className="space-y-4 text-xs font-enterprise">
                  {/* Authenticated Candidate Profile Banner */}
                  <div className="rounded-2xl border border-electric/30 bg-electric/5 p-4 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-electric to-[#00D4FF] text-white font-bold flex items-center justify-center font-display text-sm shadow-xs">
                          {currentUser.fullName ? currentUser.fullName.slice(0, 2).toUpperCase() : "CA"}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-display font-bold text-ink text-sm">
                              {currentUser.fullName}
                            </h4>
                            <span className="rounded-full bg-signal/15 px-2 py-0.5 font-enterprise text-[9px] font-bold text-signal">
                              Verified Profile
                            </span>
                          </div>
                          <p className="font-enterprise text-xs text-ink-soft">{currentUser.email}</p>
                        </div>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-electric/15 text-[11px] text-slate-600 flex items-center gap-1.5">
                      <CheckCircle size={13} className="text-emerald-600 shrink-0" />
                      <span>Applying with your active candidate telemetry, skills, and uploaded CV dossier.</span>
                    </div>
                  </div>

                  {/* Target Opening Overview Card */}
                  <div className="rounded-2xl border border-[#bcd6fa]/60 bg-canvas/40 p-3.5 space-y-1">
                    <div className="text-[10px] uppercase font-bold text-mist tracking-wider">
                      Position Overview
                    </div>
                    <div className="font-bold text-sm text-ink">{cleanJobTitle(selectedJob.title)}</div>
                    <div className="text-xs text-ink-soft flex items-center gap-2 flex-wrap">
                      <span>{selectedJob.client_name || "Enterprise Partner"}</span>
                      <span>·</span>
                      <span>${selectedJob.budget_min || 95} - ${selectedJob.budget_max || 135}/hr</span>
                      <span>·</span>
                      <span>{selectedJob.location || "100% Remote"}</span>
                    </div>
                  </div>

                  {/* Candidate Note / Pitch */}
                  <div>
                    <label className="block font-enterprise text-xs font-semibold text-ink mb-1">
                      Candidate Note / Pitch (Optional)
                    </label>
                    <textarea
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Briefly highlight your experience with the required tech stack or immediate availability..."
                      className="w-full rounded-xl border border-[#bcd6fa] bg-white p-2.5 font-medium text-ink focus:border-electric focus:outline-hidden"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200/80">
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => setSelectedJob(null)}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2 font-display text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="rounded-xl bg-electric px-5 py-2 font-display text-xs font-bold text-white hover:bg-electric-bright shadow-xs transition-colors cursor-pointer disabled:opacity-50 inline-flex items-center gap-1.5"
                    >
                      <span>
                        {isSubmitting
                          ? "Submitting Application..."
                          : "Submit with Verified Profile"}
                      </span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </form>
              ) : (
                <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 space-y-3">
                  <div className="font-display font-bold text-sm text-amber-900">
                    Authentication Required
                  </div>
                  <p className="text-xs text-amber-800 leading-relaxed">
                    Please sign in to submit an application using your verified candidate profile and technical CV dossier.
                  </p>
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => router.push(`/login?callbackUrl=/jobs`)}
                      className="rounded-xl bg-ink px-4 py-2 font-display text-xs font-bold text-white hover:bg-electric transition-colors"
                    >
                      Sign In to Apply →
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-400 font-enterprise">
              <span>Ref: {selectedJob.id}</span>
              <button
                type="button"
                onClick={() => setSelectedJob(null)}
                className="hover:text-slate-700 cursor-pointer"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
