"use client";

import { useState } from "react";
import Link from "next/link";
import PageHero from "@/components/main/PageHero";
import { submitLeadAction } from "@/actions/leads.actions";
import {
  Clock,
  Zap,
  Globe,
  Check,
  ArrowRight,
  DollarSign,
  Users,
  Briefcase,
  ShieldCheck,
} from "@/components/ui/Icons";

export default function ContactPage() {
  const [activeTab, setActiveTab] = useState<"client" | "candidate">("client");

  // Client form states
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientCompany, setClientCompany] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [sector, setSector] = useState<"Technology & SDLC" | "Healthcare & Clinical">("Technology & SDLC");
  const [engagement, setEngagement] = useState("Staff Augmentation (W2 / C2C)");
  const [squadSize, setSquadSize] = useState("1 to 5 Specialists");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage(null);

    const res = await submitLeadAction({
      contact_name: clientName,
      work_email: clientEmail,
      company: clientCompany,
      phone: clientPhone,
      sector: sector === "Technology & SDLC" ? "technology" : "healthcare",
      engagement_model: engagement,
      roles_needed: squadSize,
      notes: message,
      source: "contact_form",
    });

    setSubmitting(false);
    if (res.success) {
      setSubmitted(true);
    } else {
      setErrorMessage(res.error?.message || "Failed to submit request.");
    }
  };

  return (
    <div className="relative min-h-screen bg-canvas">
      {/* Hero Header */}
      <PageHero
        eyebrow="Direct Routing Gateway"
        title="Connect With Our In-House"
        highlightedText="Delivery Engine"
        description="Reach our specialized technical recruiters, business analysts, and active software engineers. Clients receive a verified candidate shortlist in 2 to 7 days flat."
        stats={[
          {
            value: "2 to 7 Days",
            label: "Shortlist Turnaround",
            icon: <Clock size={20} />,
          },
          {
            value: "< 2 Hours",
            label: "Initial Brief Response",
            icon: <Zap size={20} />,
          },
          {
            value: "4 Longitudes",
            label: "Live Timezone Overlap",
            icon: <Globe size={20} />,
          },
        ]}
        proofPills={[
          "Direct Lead Routing",
          "No Legacy Agency Delays",
          "Synchronous Standup Overlap",
          "2-Week Risk-Free Trial",
        ]}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-18">
        {/* Dual Contact Tabs (SRS FR-072) */}
        <div className="flex w-full max-w-xl sm:max-w-2xl rounded-2xl border border-[#bcd6fa] bg-white/90 p-1.5 shadow-xs backdrop-blur-sm">
          <button
            type="button"
            onClick={() => setActiveTab("client")}
            className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-3 px-5 sm:px-6 font-display text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === "client"
                ? "bg-ink text-white shadow-xs"
                : "text-ink-soft hover:text-ink hover:bg-canvas"
            }`}
          >
            <Briefcase size={16} />
            <span>I Need Workforce Solutions</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("candidate")}
            className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-3 px-5 sm:px-6 font-display text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === "candidate"
                ? "bg-ink text-white shadow-xs"
                : "text-ink-soft hover:text-ink hover:bg-canvas"
            }`}
          >
            <Users size={16} />
            <span>Join Talent Network</span>
          </button>
        </div>

        {/* Main Grid Content */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form Side */}
          <div className="lg:col-span-7">
            {activeTab === "client" ? (
              <div className="rounded-3xl border border-[#bcd6fa] bg-white p-6 sm:p-9 shadow-[0_15px_45px_-15px_rgba(10,20,40,0.08)]">
                {submitted ? (
                  <div className="py-12 text-center space-y-4">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-signal/15 text-signal border border-signal/30">
                      <Check size={28} />
                    </div>
                    <h3 className="font-display text-2xl font-bold text-ink">Requirement Profile Dispatched</h3>
                    <p className="text-xs sm:text-sm text-ink-soft max-w-md mx-auto leading-relaxed font-normal">
                      Thank you, <strong className="text-ink font-semibold">{clientName}</strong>. Our business analysis pod has received your brief. A technical delivery lead will reach out within 2 hours with initial profiles.
                    </p>
                    <div className="pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setSubmitted(false);
                          setClientName("");
                          setClientEmail("");
                          setMessage("");
                        }}
                        className="rounded-xl border border-[#bcd6fa] bg-canvas px-4 py-2 font-display text-xs font-semibold text-ink hover:bg-white transition-colors cursor-pointer"
                      >
                        Submit Another Requirement
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="border-b border-[#bcd6fa]/50 pb-3 mb-2">
                      <h2 className="font-display text-lg font-bold text-ink">Workforce Requirement Brief</h2>
                      <p className="text-xs sm:text-sm text-ink-soft font-normal">
                        Fill out your team specifications to initiate technical and compliance discovery.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-mono text-xs font-semibold uppercase tracking-wider text-ink-soft mb-1.5">
                          Your Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={clientName}
                          onChange={(e) => setClientName(e.target.value)}
                          placeholder="e.g. David Vance"
                          className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/40 px-3.5 py-2.5 text-sm text-ink placeholder-mist focus:border-electric focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-electric/20 transition-all font-sans"
                        />
                      </div>

                      <div>
                        <label className="block font-mono text-xs font-semibold uppercase tracking-wider text-ink-soft mb-1.5">
                          Work Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={clientEmail}
                          onChange={(e) => setClientEmail(e.target.value)}
                          placeholder="david@enterprise-client.com"
                          className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/40 px-3.5 py-2.5 text-sm text-ink placeholder-mist focus:border-electric focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-electric/20 transition-all font-sans"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-mono text-xs font-semibold uppercase tracking-wider text-ink-soft mb-1.5">
                          Organization / Company <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={clientCompany}
                          onChange={(e) => setClientCompany(e.target.value)}
                          placeholder="e.g. Acorn Health / Meridian Tech"
                          className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/40 px-3.5 py-2.5 text-sm text-ink placeholder-mist focus:border-electric focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-electric/20 transition-all font-sans"
                        />
                      </div>

                      <div>
                        <label className="block font-mono text-xs font-semibold uppercase tracking-wider text-ink-soft mb-1.5">
                          Phone Number (Optional)
                        </label>
                        <input
                          type="tel"
                          value={clientPhone}
                          onChange={(e) => setClientPhone(e.target.value)}
                          placeholder="+1 (555) 019-2834"
                          className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/40 px-3.5 py-2.5 text-sm text-ink placeholder-mist focus:border-electric focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-electric/20 transition-all font-sans"
                        />
                      </div>
                    </div>

                    {/* Sector Toggle */}
                    <div>
                      <label className="block font-mono text-xs font-semibold uppercase tracking-wider text-ink-soft mb-1.5">
                        Target Workforce Sector
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {(["Technology & SDLC", "Healthcare & Clinical"] as const).map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setSector(s)}
                            className={`py-2 px-3 rounded-xl border text-xs font-display font-semibold transition-all cursor-pointer ${
                              sector === s
                                ? "border-electric bg-electric/10 text-electric font-bold shadow-2xs"
                                : "border-[#bcd6fa]/70 bg-canvas/40 text-ink-soft hover:bg-canvas"
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-mono text-xs font-semibold uppercase tracking-wider text-ink-soft mb-1.5">
                          Engagement Model
                        </label>
                        <select
                          value={engagement}
                          onChange={(e) => setEngagement(e.target.value)}
                          className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/40 px-3.5 py-2.5 text-sm text-ink focus:border-electric focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-electric/20 transition-all cursor-pointer font-sans"
                        >
                          <option>Staff Augmentation (W2 / C2C)</option>
                          <option>Dedicated Offshore Engineering Pod</option>
                          <option>Direct Hire & Executive Search</option>
                          <option>Employer of Record (EOR across 15+ countries)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-mono text-xs font-semibold uppercase tracking-wider text-ink-soft mb-1.5">
                          Target Squad Size
                        </label>
                        <select
                          value={squadSize}
                          onChange={(e) => setSquadSize(e.target.value)}
                          className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/40 px-3.5 py-2.5 text-sm text-ink focus:border-electric focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-electric/20 transition-all cursor-pointer font-sans"
                        >
                          <option>1 to 2 Individual Specialists</option>
                          <option>3 to 5 Specialists (Core Pod)</option>
                          <option>6 to 15 Specialists (Full Squad)</option>
                          <option>16 to 50+ Specialists (Enterprise Division)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block font-mono text-xs font-semibold uppercase tracking-wider text-ink-soft mb-1.5">
                        Role Requirements & Technical Details
                      </label>
                      <textarea
                        rows={4}
                        required
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Detail the technical stacks, seniority expectations, timezone requirements, or clinical specialties required..."
                        className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/40 px-3.5 py-2.5 text-sm text-ink placeholder-mist focus:border-electric focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-electric/20 transition-all font-sans"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="mt-3 w-full rounded-xl bg-ink py-3.5 font-display text-sm font-semibold text-white shadow-[0_6px_20px_-4px_rgba(10,20,40,0.4)] transition-all hover:bg-electric hover:shadow-[0_8px_24px_-4px_rgba(10,132,255,0.5)] active:scale-[0.99] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                          </svg>
                          <span>Routing to Execution Pod...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Brief & Request 1-on-1 Consultation</span>
                          <ArrowRight size={15} />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            ) : (
              <div className="rounded-3xl border border-[#bcd6fa] bg-white p-6 sm:p-9 shadow-[0_15px_45px_-15px_rgba(10,20,40,0.08)] space-y-6">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-md bg-electric/10 px-2.5 py-1 font-mono text-xs font-bold text-electric uppercase">
                    For Job Seekers & Talent
                  </div>
                  <h2 className="mt-3 font-display text-2xl font-bold text-ink">
                    Join the Pepoltek Talent Ecosystem
                  </h2>
                  {/* Clean readable Inter text */}
                  <p className="mt-2 text-xs sm:text-sm text-ink-soft font-normal leading-relaxed">
                    We do not use standard resume black holes. When you upload your CV to Pepoltek, our proprietary AI parses your stack and matches you privately with live enterprise client pipelines with zero public exposure.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-[#bcd6fa]/60 bg-canvas/40 p-5">
                    {/* Prominent Lucide Icon */}
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-electric/10 text-electric border border-electric/20">
                      <Zap size={20} />
                    </div>
                    <div className="font-display text-sm font-bold text-ink mt-3">Instant CV Intake</div>
                    <p className="text-xs text-ink-soft mt-1 font-normal leading-relaxed">
                      Upload your PDF or DOCX file to auto-populate your skills and generate your initial ATS score.
                    </p>
                    <Link
                      href="/career/upload_cv"
                      className="mt-4 inline-flex items-center gap-1 font-display text-xs font-bold text-electric hover:underline"
                    >
                      <span>Upload CV Now</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>

                  <div className="rounded-2xl border border-[#bcd6fa]/60 bg-canvas/40 p-5">
                    {/* Prominent Lucide Icon */}
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-electric/10 text-electric border border-electric/20">
                      <ShieldCheck size={20} />
                    </div>
                    <div className="font-display text-sm font-bold text-ink mt-3">Candidate Dashboard</div>
                    <p className="text-xs text-ink-soft mt-1 font-normal leading-relaxed">
                      Already registered? Access your application telemetry, readiness index, and Talent Academy.
                    </p>
                    <Link
                      href="/login"
                      className="mt-4 inline-flex items-center gap-1 font-display text-xs font-bold text-electric hover:underline"
                    >
                      <span>Sign In to Portal</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>

                <div className="rounded-2xl border border-signal/30 bg-gradient-to-r from-signal/5 to-transparent p-5">
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-signal/15 text-signal border border-signal/30">
                      <DollarSign size={20} />
                    </div>
                    <div>
                      <div className="font-display text-sm font-bold text-ink">Refer & Earn Up to $500</div>
                      <div className="text-xs text-ink-soft font-normal">
                        Know exceptional software engineers or registered nurses? Submit their profile and earn cash bounties.
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 text-right">
                    <Link
                      href="/ecosystem/referrals"
                      className="font-display text-xs font-bold text-signal hover:underline inline-flex items-center gap-1"
                    >
                      <span>View Referral Program</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Side: SLAs & Global Footprint */}
          <div className="lg:col-span-5 space-y-6">
            {/* Delivery Engine SLA Card */}
            <div className="rounded-3xl border border-[#bcd6fa] bg-ink text-white p-6 sm:p-8 shadow-xl">
              <div className="font-mono text-xs text-electric-bright uppercase tracking-widest font-semibold">
                Operational Guarantee
              </div>
              <h3 className="mt-2 font-display text-xl font-bold">
                The Pepoltek Velocity Commitment
              </h3>
              <ul className="mt-5 space-y-3.5 text-xs sm:text-sm text-white/80 font-normal">
                <li className="flex items-start gap-2.5">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-signal/20 text-signal mt-0.5">
                    <Check size={11} />
                  </span>
                  <span>2 to 7 days from technical brief to verified shortlist.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-signal/20 text-signal mt-0.5">
                    <Check size={11} />
                  </span>
                  <span>2-week risk-free trial on all staff augmentation contracts.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-signal/20 text-signal mt-0.5">
                    <Check size={11} />
                  </span>
                  <span>90-day free replacement guarantee on direct placements.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-signal/20 text-signal mt-0.5">
                    <Check size={11} />
                  </span>
                  <span>Hard-coded technical validation by in-house software engineers.</span>
                </li>
              </ul>
            </div>

            {/* Global Longitudes */}
            <div className="rounded-3xl border border-[#bcd6fa] bg-white p-6 sm:p-8 shadow-sm">
              <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-ink-soft mb-4">
                Global Delivery Footprint
              </h4>
              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between border-b border-[#bcd6fa]/40 pb-2">
                  <span className="text-ink font-semibold">North America</span>
                  <span className="text-electric">4 to 6 hrs Live Standups</span>
                </div>
                <div className="flex justify-between border-b border-[#bcd6fa]/40 pb-2">
                  <span className="text-ink font-semibold">United Kingdom & Europe</span>
                  <span className="text-electric">6 to 8 hrs Live Overlap</span>
                </div>
                <div className="flex justify-between border-b border-[#bcd6fa]/40 pb-2">
                  <span className="text-ink font-semibold">GCC Region</span>
                  <span className="text-electric">6 to 7 hrs Live Overlap</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-ink font-semibold">South Asia / APAC</span>
                  <span className="text-electric">Continuous Async Sprints</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
