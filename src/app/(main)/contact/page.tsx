"use client";

import { useState } from "react";
import Link from "next/link";
import PageHero from "@/components/main/PageHero";
import { submitLeadAction, submitContactInquiryAction } from "@/actions/leads.actions";
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
  Mail,
  Phone,
  Building2,
  Calendar,
} from "@/components/ui/Icons";

export default function ContactPage() {
  const [activeTab, setActiveTab] = useState<"client" | "general" | "candidate">("client");

  // Client / Employer Lead states
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientCompany, setClientCompany] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [sector, setSector] = useState<"technology" | "healthcare" | "both">("technology");
  const [engagement, setEngagement] = useState("staff_aug");
  const [headcount, setHeadcount] = useState(1);
  const [timeline, setTimeline] = useState("immediate");
  const [rolesNeeded, setRolesNeeded] = useState("");
  const [estimatedBudget, setEstimatedBudget] = useState("");
  const [deliveryChannel, setDeliveryChannel] = useState("email");
  const [bookingSlot, setBookingSlot] = useState("Tomorrow at 10:00 AM EST");
  const [includeConsultation, setIncludeConsultation] = useState(true);

  const [clientSubmitting, setClientSubmitting] = useState(false);
  const [clientSubmitted, setClientSubmitted] = useState(false);
  const [clientError, setClientError] = useState<string | null>(null);

  // General Inquiry states
  const [inquiryName, setInquiryName] = useState("");
  const [inquiryEmail, setInquiryEmail] = useState("");
  const [inquiryPhone, setInquiryPhone] = useState("");
  const [inquiryCategory, setInquiryCategory] = useState<
    "general" | "partnership" | "talent_support" | "press_media" | "feedback"
  >("general");
  const [inquirySubject, setInquirySubject] = useState("");
  const [inquiryMessage, setInquiryMessage] = useState("");

  const [inquirySubmitting, setInquirySubmitting] = useState(false);
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const [inquiryError, setInquiryError] = useState<string | null>(null);

  const handleClientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setClientSubmitting(true);
    setClientError(null);

    const res = await submitLeadAction({
      contact_name: clientName,
      work_email: clientEmail,
      company: clientCompany,
      phone: clientPhone,
      sector,
      roles_needed: rolesNeeded || "Workforce augmentation",
      headcount,
      engagement_model: engagement,
      timeline,
      estimated_budget: estimatedBudget,
      preferred_delivery_channel: deliveryChannel,
      booking_slot: includeConsultation ? bookingSlot : undefined,
      source: "hire_form",
    });

    setClientSubmitting(false);
    if (res.success) {
      setClientSubmitted(true);
    } else {
      setClientError(res.error?.message || "Failed to submit consultation request.");
    }
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInquirySubmitting(true);
    setInquiryError(null);

    const res = await submitContactInquiryAction({
      name: inquiryName,
      email: inquiryEmail,
      phone: inquiryPhone,
      category: inquiryCategory,
      subject: inquirySubject,
      message: inquiryMessage,
    });

    setInquirySubmitting(false);
    if (res.success) {
      setInquirySubmitted(true);
    } else {
      setInquiryError(res.error?.message || "Failed to submit inquiry.");
    }
  };

  return (
    <div className="relative min-h-screen bg-canvas font-sans">
      {/* Hero Header */}
      <PageHero
        eyebrow="Direct Routing Gateway"
        title="Connect With Our In-House"
        highlightedText="Delivery Engine"
        description="Reach our specialized technical recruiters, workforce architects, and global delivery pods. Clients receive a verified candidate shortlist in 2 to 7 days flat."
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

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Triple Action Tabs */}
        <div className="flex w-full max-w-2xl rounded-2xl border border-[#bcd6fa] bg-white/90 p-1.5 shadow-xs backdrop-blur-sm">
          <button
            type="button"
            onClick={() => setActiveTab("client")}
            className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 rounded-xl py-2.5 sm:py-3 px-3 sm:px-4 font-display text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === "client"
                ? "bg-ink text-white shadow-xs"
                : "text-ink-soft hover:text-ink hover:bg-canvas"
            }`}
          >
            <Briefcase size={15} />
            <span>Hire Fast (Workforce)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("general")}
            className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 rounded-xl py-2.5 sm:py-3 px-3 sm:px-4 font-display text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === "general"
                ? "bg-ink text-white shadow-xs"
                : "text-ink-soft hover:text-ink hover:bg-canvas"
            }`}
          >
            <Mail size={15} />
            <span>General Inquiries</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("candidate")}
            className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 rounded-xl py-2.5 sm:py-3 px-3 sm:px-4 font-display text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === "candidate"
                ? "bg-ink text-white shadow-xs"
                : "text-ink-soft hover:text-ink hover:bg-canvas"
            }`}
          >
            <Users size={15} />
            <span>Talent Network</span>
          </button>
        </div>

        {/* Main Grid Content */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Interactive Form Column */}
          <div className="lg:col-span-7">
            {/* TAB 1: Employer Hire Fast Form */}
            {activeTab === "client" && (
              <div className="rounded-3xl border border-[#bcd6fa] bg-white p-6 sm:p-9 shadow-[0_15px_45px_-15px_rgba(10,20,40,0.08)]">
                {clientSubmitted ? (
                  <div className="py-12 text-center space-y-4">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-signal/15 text-signal border border-signal/30">
                      <Check size={28} />
                    </div>
                    <h3 className="font-display text-2xl font-bold text-ink">Requirement Profile Dispatched</h3>
                    <p className="text-xs sm:text-sm text-ink-soft max-w-md mx-auto leading-relaxed">
                      Thank you, <strong className="text-ink font-semibold">{clientName}</strong>. Our discovery engine has logged your brief for <strong className="text-ink font-semibold">{clientCompany}</strong>. A technical delivery lead will reach out with initial candidates.
                    </p>
                    <div className="pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setClientSubmitted(false);
                          setClientName("");
                          setClientEmail("");
                          setRolesNeeded("");
                        }}
                        className="rounded-xl border border-[#bcd6fa] bg-canvas px-4 py-2 font-display text-xs font-semibold text-ink hover:bg-white transition-colors cursor-pointer"
                      >
                        Submit Another Requirement
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleClientSubmit} className="space-y-4 font-enterprise">
                    <div className="border-b border-[#bcd6fa]/50 pb-3 mb-2">
                      <div className="inline-flex items-center gap-1.5 rounded-md bg-electric/10 px-2 py-0.5 font-mono text-[10px] font-bold text-electric uppercase tracking-wider mb-1">
                        High-Velocity Deployment
                      </div>
                      <h2 className="font-display text-lg font-bold text-ink">Workforce Requirement & Discovery</h2>
                      <p className="text-xs text-ink-soft">
                        Outline your technical requirements. We match and verify talent within 2 to 7 business days.
                      </p>
                    </div>

                    {clientError && (
                      <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
                        {clientError}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-ink-soft mb-1">
                          Your Full Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={clientName}
                          onChange={(e) => setClientName(e.target.value)}
                          placeholder="e.g. David Vance"
                          className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/40 px-3.5 py-2 text-xs sm:text-sm text-ink placeholder-mist focus:border-electric focus:bg-white focus:outline-none transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-ink-soft mb-1">
                          Work Email <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={clientEmail}
                          onChange={(e) => setClientEmail(e.target.value)}
                          placeholder="david@enterprise-client.com"
                          className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/40 px-3.5 py-2 text-xs sm:text-sm text-ink placeholder-mist focus:border-electric focus:bg-white focus:outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-ink-soft mb-1">
                          Organization / Company <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={clientCompany}
                          onChange={(e) => setClientCompany(e.target.value)}
                          placeholder="e.g. Meridian Health / Apex Labs"
                          className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/40 px-3.5 py-2 text-xs sm:text-sm text-ink placeholder-mist focus:border-electric focus:bg-white focus:outline-none transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-ink-soft mb-1">
                          Phone Number (Optional)
                        </label>
                        <input
                          type="tel"
                          value={clientPhone}
                          onChange={(e) => setClientPhone(e.target.value)}
                          placeholder="+1 (555) 019-2834"
                          className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/40 px-3.5 py-2 text-xs sm:text-sm text-ink placeholder-mist focus:border-electric focus:bg-white focus:outline-none transition-all"
                        />
                      </div>
                    </div>

                    {/* Sector Toggle */}
                    <div>
                      <label className="block text-xs font-semibold text-ink-soft mb-1.5">
                        Workforce Sector
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: "technology", label: "Technology & SDLC" },
                          { id: "healthcare", label: "Healthcare & Clinical" },
                          { id: "both", label: "Both / Hybrid" },
                        ].map((s) => (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => setSector(s.id as any)}
                            className={`py-2 px-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                              sector === s.id
                                ? "border-electric bg-electric/10 text-electric font-bold shadow-2xs"
                                : "border-[#bcd6fa]/70 bg-canvas/40 text-ink-soft hover:bg-canvas"
                            }`}
                          >
                            {s.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-ink-soft mb-1">
                          Engagement Model
                        </label>
                        <select
                          value={engagement}
                          onChange={(e) => setEngagement(e.target.value)}
                          className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/40 px-3 py-2 text-xs text-ink focus:border-electric focus:bg-white focus:outline-none cursor-pointer"
                        >
                          <option value="staff_aug">Staff Augmentation</option>
                          <option value="dedicated_pod">Dedicated Pod</option>
                          <option value="direct_hire">Direct Hire Search</option>
                          <option value="eor">Employer of Record (EOR)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-ink-soft mb-1">
                          Headcount
                        </label>
                        <select
                          value={headcount}
                          onChange={(e) => setHeadcount(Number(e.target.value))}
                          className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/40 px-3 py-2 text-xs text-ink focus:border-electric focus:bg-white focus:outline-none cursor-pointer"
                        >
                          <option value={1}>1 Specialist</option>
                          <option value={2}>2 Specialists</option>
                          <option value={5}>3 to 5 (Core Pod)</option>
                          <option value={10}>6 to 15 (Squad)</option>
                          <option value={25}>16+ (Enterprise)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-ink-soft mb-1">
                          Timeline
                        </label>
                        <select
                          value={timeline}
                          onChange={(e) => setTimeline(e.target.value)}
                          className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/40 px-3 py-2 text-xs text-ink focus:border-electric focus:bg-white focus:outline-none cursor-pointer"
                        >
                          <option value="immediate">Immediate (7 Days)</option>
                          <option value="two_weeks">2 Weeks</option>
                          <option value="one_month">1 Month</option>
                          <option value="flexible">Flexible</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-ink-soft mb-1">
                        Roles & Technical Stack Details <span className="text-rose-500">*</span>
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={rolesNeeded}
                        onChange={(e) => setRolesNeeded(e.target.value)}
                        placeholder="Detail the technical stacks, seniority expectations, timezone requirements, or clinical specialties required..."
                        className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/40 px-3.5 py-2 text-xs sm:text-sm text-ink placeholder-mist focus:border-electric focus:bg-white focus:outline-none transition-all"
                      />
                    </div>

                    {/* Discovery Consultation Slot Selection */}
                    <div className="rounded-2xl border border-electric/25 bg-electric/5 p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Calendar size={15} className="text-electric" />
                          <span className="text-xs font-bold text-ink">Free Discovery Consultation Slot</span>
                        </div>
                        <label className="flex items-center gap-2 text-xs text-ink-soft cursor-pointer">
                          <input
                            type="checkbox"
                            checked={includeConsultation}
                            onChange={(e) => setIncludeConsultation(e.target.checked)}
                            className="rounded border-[#bcd6fa] text-electric focus:ring-electric"
                          />
                          <span>Book Slot</span>
                        </label>
                      </div>
                      {includeConsultation && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                          {[
                            "Tomorrow at 10:00 AM EST",
                            "Tomorrow at 2:00 PM EST",
                            "Thursday at 11:30 AM EST",
                            "Thursday at 4:00 PM EST",
                            "Friday at 1:00 PM EST",
                            "Friday at 3:30 PM EST",
                          ].map((slot) => (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => setBookingSlot(slot)}
                              className={`p-2 rounded-lg border text-[11px] text-center transition-all cursor-pointer ${
                                bookingSlot === slot
                                  ? "border-electric bg-white text-electric font-bold shadow-2xs"
                                  : "border-[#bcd6fa]/60 bg-white/60 text-ink-soft hover:bg-white"
                              }`}
                            >
                              {slot}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={clientSubmitting}
                      className="mt-2 w-full rounded-xl bg-ink py-3.5 font-display text-sm font-semibold text-white shadow-[0_6px_20px_-4px_rgba(10,20,40,0.4)] transition-all hover:bg-electric hover:shadow-[0_8px_24px_-4px_rgba(10,132,255,0.5)] cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {clientSubmitting ? (
                        <span>Routing Brief to Delivery Pod...</span>
                      ) : (
                        <>
                          <span>Submit Workforce Brief & Request Discovery</span>
                          <ArrowRight size={15} />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* TAB 2: General Inquiries & Support */}
            {activeTab === "general" && (
              <div className="rounded-3xl border border-[#bcd6fa] bg-white p-6 sm:p-9 shadow-[0_15px_45px_-15px_rgba(10,20,40,0.08)]">
                {inquirySubmitted ? (
                  <div className="py-12 text-center space-y-4">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-signal/15 text-signal border border-signal/30">
                      <Check size={28} />
                    </div>
                    <h3 className="font-display text-2xl font-bold text-ink">Inquiry Dispatched</h3>
                    <p className="text-xs sm:text-sm text-ink-soft max-w-md mx-auto leading-relaxed">
                      Thank you, <strong className="text-ink font-semibold">{inquiryName}</strong>. Your inquiry has been routed to our operations team. We will review and reply within 1 business day.
                    </p>
                    <div className="pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setInquirySubmitted(false);
                          setInquirySubject("");
                          setInquiryMessage("");
                        }}
                        className="rounded-xl border border-[#bcd6fa] bg-canvas px-4 py-2 font-display text-xs font-semibold text-ink hover:bg-white transition-colors cursor-pointer"
                      >
                        Send Another Message
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleInquirySubmit} className="space-y-4 font-enterprise">
                    <div className="border-b border-[#bcd6fa]/50 pb-3 mb-2">
                      <div className="inline-flex items-center gap-1.5 rounded-md bg-electric/10 px-2 py-0.5 font-mono text-[10px] font-bold text-electric uppercase tracking-wider mb-1">
                        General Communications
                      </div>
                      <h2 className="font-display text-lg font-bold text-ink">General Inquiries & Strategic Contact</h2>
                      <p className="text-xs text-ink-soft">
                        For partnerships, press coverage, technical feedback, or general support inquiries.
                      </p>
                    </div>

                    {inquiryError && (
                      <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
                        {inquiryError}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-ink-soft mb-1">
                          Your Full Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={inquiryName}
                          onChange={(e) => setInquiryName(e.target.value)}
                          placeholder="e.g. Elena Rostova"
                          className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/40 px-3.5 py-2 text-xs sm:text-sm text-ink placeholder-mist focus:border-electric focus:bg-white focus:outline-none transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-ink-soft mb-1">
                          Email Address <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={inquiryEmail}
                          onChange={(e) => setInquiryEmail(e.target.value)}
                          placeholder="elena@organization.org"
                          className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/40 px-3.5 py-2 text-xs sm:text-sm text-ink placeholder-mist focus:border-electric focus:bg-white focus:outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-ink-soft mb-1">
                          Inquiry Category
                        </label>
                        <select
                          value={inquiryCategory}
                          onChange={(e) => setInquiryCategory(e.target.value as any)}
                          className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/40 px-3 py-2 text-xs text-ink focus:border-electric focus:bg-white focus:outline-none cursor-pointer"
                        >
                          <option value="general">General Inquiries</option>
                          <option value="partnership">Strategic Partnership</option>
                          <option value="talent_support">Talent & Candidate Support</option>
                          <option value="press_media">Press & Media</option>
                          <option value="feedback">Platform Feedback</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-ink-soft mb-1">
                          Phone Number (Optional)
                        </label>
                        <input
                          type="tel"
                          value={inquiryPhone}
                          onChange={(e) => setInquiryPhone(e.target.value)}
                          placeholder="+1 (555) 012-7890"
                          className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/40 px-3.5 py-2 text-xs sm:text-sm text-ink placeholder-mist focus:border-electric focus:bg-white focus:outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-ink-soft mb-1">
                        Subject <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={inquirySubject}
                        onChange={(e) => setInquirySubject(e.target.value)}
                        placeholder="Brief summary of inquiry"
                        className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/40 px-3.5 py-2 text-xs sm:text-sm text-ink placeholder-mist focus:border-electric focus:bg-white focus:outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-ink-soft mb-1">
                        Message Content <span className="text-rose-500">*</span>
                      </label>
                      <textarea
                        rows={4}
                        required
                        value={inquiryMessage}
                        onChange={(e) => setInquiryMessage(e.target.value)}
                        placeholder="Please write your message or question here..."
                        className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/40 px-3.5 py-2 text-xs sm:text-sm text-ink placeholder-mist focus:border-electric focus:bg-white focus:outline-none transition-all"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={inquirySubmitting}
                      className="mt-2 w-full rounded-xl bg-ink py-3.5 font-display text-sm font-semibold text-white shadow-[0_6px_20px_-4px_rgba(10,20,40,0.4)] transition-all hover:bg-electric hover:shadow-[0_8px_24px_-4px_rgba(10,132,255,0.5)] cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {inquirySubmitting ? (
                        <span>Sending Inquiry...</span>
                      ) : (
                        <>
                          <span>Transmit Message</span>
                          <ArrowRight size={15} />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* TAB 3: Talent Network */}
            {activeTab === "candidate" && (
              <div className="rounded-3xl border border-[#bcd6fa] bg-white p-6 sm:p-9 shadow-[0_15px_45px_-15px_rgba(10,20,40,0.08)] space-y-6">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-md bg-electric/10 px-2.5 py-1 font-mono text-xs font-bold text-electric uppercase">
                    For Job Seekers & Talent
                  </div>
                  <h2 className="mt-3 font-display text-2xl font-bold text-ink">
                    Join the Pepoltek Talent Ecosystem
                  </h2>
                  <p className="mt-2 text-xs sm:text-sm text-ink-soft leading-relaxed">
                    We do not use standard resume black holes. When you upload your CV to Pepoltek, our proprietary AI parses your stack and matches you privately with live enterprise client pipelines with zero public exposure.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-[#bcd6fa]/60 bg-canvas/40 p-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-electric/10 text-electric border border-electric/20">
                      <Zap size={20} />
                    </div>
                    <div className="font-display text-sm font-bold text-ink mt-3">Instant CV Intake</div>
                    <p className="text-xs text-ink-soft mt-1 leading-relaxed">
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
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-electric/10 text-electric border border-electric/20">
                      <ShieldCheck size={20} />
                    </div>
                    <div className="font-display text-sm font-bold text-ink mt-3">Candidate Dashboard</div>
                    <p className="text-xs text-ink-soft mt-1 leading-relaxed">
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
                      <div className="text-xs text-ink-soft">
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
            <div className="rounded-3xl border border-[#bcd6fa] bg-ink text-white p-6 sm:p-8 shadow-xl">
              <div className="font-mono text-xs text-electric-bright uppercase tracking-widest font-semibold">
                Operational Guarantee
              </div>
              <h3 className="mt-2 font-display text-xl font-bold">
                The Pepoltek Velocity Commitment
              </h3>
              <ul className="mt-5 space-y-3.5 text-xs sm:text-sm text-white/80">
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

            <div className="rounded-3xl border border-[#bcd6fa] bg-white p-6 sm:p-8 shadow-xs">
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
