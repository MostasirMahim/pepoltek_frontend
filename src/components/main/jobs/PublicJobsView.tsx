"use client";

import { useState } from "react";
import Link from "next/link";
import { applyPublicJobAction } from "@/actions/recruiter.actions";
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
} from "@/components/ui/Icons";

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
  const [jobs] = useState<PublicJob[]>(initialJobs);
  const [searchTerm, setSearchTerm] = useState("");
  const [sectorFilter, setSectorFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedJob, setSelectedJob] = useState<PublicJob | null>(null);

  // Application form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
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

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;

    if (!fullName.trim() || !email.trim()) {
      setApplyResult({ type: "error", text: "Please enter your Full Name and Email." });
      return;
    }

    setIsSubmitting(true);
    setApplyResult(null);

    const res = await applyPublicJobAction(selectedJob.id, {
      full_name: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      portfolio_url: portfolioUrl.trim(),
      notes: notes.trim(),
    });

    setIsSubmitting(false);

    if (res.success) {
      setApplyResult({
        type: "success",
        text: "Application submitted successfully. Our staffing team has logged your submission in the ATS pipeline.",
      });
      setFullName("");
      setEmail("");
      setPhone("");
      setPortfolioUrl("");
      setNotes("");
    } else {
      setApplyResult({
        type: "error",
        text: res.error || "Failed to submit application. Please check your information.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-canvas pt-24 pb-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl border border-[#bcd6fa] bg-gradient-to-br from-white via-white to-canvas/80 p-8 sm:p-12 shadow-sm">
          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-electric/30 bg-electric/10 px-3 py-1 font-mono text-xs font-semibold text-electric uppercase tracking-wider">
              <span>Verified Enterprise Openings</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-ink">
              Production Engineering Teams &amp; Clinical Rotas
            </h1>
            <p className="text-sm sm:text-base text-ink-soft leading-relaxed">
              Join elite software engineering squads and compliance-cleared healthcare teams deployed with 7-day velocity and transparent compensation.
            </p>
          </div>

          <div className="absolute -right-12 -bottom-12 h-64 w-64 rounded-full bg-electric/5 blur-3xl" />
        </div>

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
                        className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold ${
                          isHealth
                            ? "bg-teal-50 text-teal-700 border border-teal-200"
                            : "bg-electric/10 text-electric border border-electric/30"
                        }`}
                      >
                        {isHealth ? "Healthcare Rota" : "Software Tech"}
                      </span>

                      {/* Role Tier Badge */}
                      <span className="rounded-full bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-0.5 font-mono text-[10px] font-bold">
                        {job.level || "Senior Tier"}
                      </span>

                      {/* Type badge */}
                      {isGig ? (
                        <span className="rounded-full bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-0.5 font-mono text-[10px] font-bold inline-flex items-center gap-1">
                          <Zap size={11} />
                          <span>Contract Gig</span>
                        </span>
                      ) : isBounty ? (
                        <span className="rounded-full bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 font-mono text-[10px] font-bold inline-flex items-center gap-1">
                          <DollarSign size={11} />
                          <span>{job.bounty_type_name ? `${job.bounty_type_name}: ` : "Bounty: "}${Number(job.bounty_amount || 1500).toLocaleString()}</span>
                        </span>
                      ) : (
                        <span className="rounded-full bg-canvas text-ink-soft border border-[#bcd6fa]/50 px-2.5 py-0.5 font-mono text-[10px] font-bold inline-flex items-center gap-1">
                          <Briefcase size={11} />
                          <span>Specialist Role</span>
                        </span>
                      )}

                      <span className="rounded-full bg-signal/10 px-2.5 py-0.5 font-mono text-[10px] font-bold text-signal inline-flex items-center gap-1">
                        <ShieldCheck size={11} />
                        <span>Verified Requisition</span>
                      </span>

                      <span className="font-mono text-xs text-mist">
                        {job.location || "100% Remote"}
                      </span>
                    </div>

                    <Link href={`/jobs/${job.id}`} className="block group">
                      <h2 className="font-display text-xl font-bold text-ink group-hover:text-electric transition-colors">
                        {job.title}
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
                          className="rounded-md bg-canvas/60 border border-[#bcd6fa]/50 px-2.5 py-0.5 font-mono text-[11px] font-medium text-ink"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col md:items-end justify-between gap-3 shrink-0 border-t md:border-t-0 md:border-l border-[#bcd6fa]/40 pt-4 md:pt-0 md:pl-6">
                    <div>
                      <div className="font-mono text-xs text-mist">Compensation Rate</div>
                      <div className="font-display text-lg font-bold text-ink">
                        ${job.budget_min || 95} - ${job.budget_max || 135}
                        <span className="text-xs font-mono font-normal text-mist"> /hr</span>
                      </div>
                      <div className="font-mono text-[11px] text-signal font-semibold">
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
                        onClick={() => {
                          setSelectedJob(job);
                          setApplyResult(null);
                        }}
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

      {/* Application Drawer / Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl border border-[#bcd6fa] bg-white p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#bcd6fa]/40 pb-3">
              <div>
                <span className="font-mono text-[10px] uppercase font-bold text-electric">
                  Rapid Candidate Application
                </span>
                <h2 className="font-display text-lg font-bold text-ink">{selectedJob.title}</h2>
                <p className="text-xs text-ink-soft">
                  {selectedJob.location || "100% Remote"} | ${selectedJob.budget_min || 95} - ${selectedJob.budget_max || 135}/hr
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedJob(null)}
                className="text-mist hover:text-ink p-1 rounded-lg hover:bg-canvas transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {applyResult && (
              <div
                className={`rounded-xl border p-3.5 text-xs font-medium flex items-center justify-between ${
                  applyResult.type === "success"
                    ? "border-signal/30 bg-signal/10 text-signal"
                    : "border-red-200 bg-red-50 text-red-700"
                }`}
              >
                <div className="flex items-center gap-2">
                  <CheckCircle size={15} />
                  <span>{applyResult.text}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setApplyResult(null)}
                  className="p-1 hover:opacity-75 cursor-pointer ml-3 text-mist hover:text-ink"
                >
                  <X size={14} />
                </button>
              </div>
            )}

            <form onSubmit={handleApply} className="space-y-3 text-xs">
              <div>
                <label className="block font-mono text-[11px] uppercase tracking-wider text-mist mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Mahim Rahad"
                  className="w-full rounded-xl border border-[#bcd6fa] bg-white p-2.5 font-medium text-ink focus:border-electric focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-mono text-[11px] uppercase tracking-wider text-mist mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. specialist@pepoltek.com"
                  className="w-full rounded-xl border border-[#bcd6fa] bg-white p-2.5 font-medium text-ink focus:border-electric focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-mono text-[11px] uppercase tracking-wider text-mist mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full rounded-xl border border-[#bcd6fa] bg-white p-2.5 font-medium text-ink focus:border-electric focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-mono text-[11px] uppercase tracking-wider text-mist mb-1">
                  Portfolio / GitHub / LinkedIn URL
                </label>
                <input
                  type="url"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  placeholder="https://github.com/..."
                  className="w-full rounded-xl border border-[#bcd6fa] bg-white p-2.5 font-medium text-ink focus:border-electric focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-mono text-[11px] uppercase tracking-wider text-mist mb-1">
                  Candidate Note / Qualifications
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Briefly describe your experience with the required stack or clinical rota..."
                  className="w-full rounded-xl border border-[#bcd6fa] bg-white p-2.5 font-medium text-ink focus:border-electric focus:outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#bcd6fa]/40">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setSelectedJob(null)}
                  className="rounded-xl border border-[#bcd6fa] bg-white px-3.5 py-1.5 font-display text-xs font-semibold text-ink hover:bg-canvas transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-electric px-5 py-2 font-display text-xs font-semibold text-white hover:bg-electric-bright shadow-xs transition-colors cursor-pointer disabled:opacity-50 inline-flex items-center gap-1.5"
                >
                  <span>{isSubmitting ? "Submitting Application..." : "Submit Application to ATS"}</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
