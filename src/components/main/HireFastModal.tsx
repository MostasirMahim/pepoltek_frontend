"use client";

import React, { useState } from "react";
import { X, Check, ArrowRight, Calendar, Building2, User, Mail, Phone, Briefcase, Clock, ShieldCheck } from "lucide-react";
import { submitLeadAction, bookConsultationAction } from "@/actions/leads.actions";

interface HireFastModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRoles?: string;
}

export default function HireFastModal({ isOpen, onClose, initialRoles = "" }: HireFastModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form states
  const [contactName, setContactName] = useState("");
  const [workEmail, setWorkEmail] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [sector, setSector] = useState<"technology" | "healthcare" | "both">("technology");
  const [rolesNeeded, setRolesNeeded] = useState(initialRoles);
  const [headcount, setHeadcount] = useState(1);
  const [engagementModel, setEngagementModel] = useState("staff_aug");
  const [timeline, setTimeline] = useState("immediate");
  const [estimatedBudget, setEstimatedBudget] = useState("");
  const [preferredDeliveryChannel, setPreferredDeliveryChannel] = useState("email");

  // Booking states
  const [createdLeadId, setCreatedLeadId] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState("Tomorrow at 10:00 AM EST");
  const [bookingNotes, setBookingNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const res = await submitLeadAction({
      contact_name: contactName,
      work_email: workEmail,
      company,
      phone,
      sector,
      roles_needed: rolesNeeded || "Fast deployment requisition",
      headcount,
      engagement_model: engagementModel,
      timeline,
      estimated_budget: estimatedBudget,
      preferred_delivery_channel: preferredDeliveryChannel,
      source: "hire_form",
    });

    setLoading(false);

    if (res.success && res.leadId) {
      setCreatedLeadId(res.leadId);
      setStep(2);
    } else {
      setErrorMsg(res.error?.message || "Failed to submit request. Please verify inputs.");
    }
  };

  const handleStep2Booking = async () => {
    if (!createdLeadId) {
      setStep(3);
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    const res = await bookConsultationAction(createdLeadId, selectedSlot, bookingNotes);
    setLoading(false);

    if (res.success) {
      setStep(3);
    } else {
      // Continue to final step even if booking API had issues, lead is already captured
      setStep(3);
    }
  };

  const handleResetAndClose = () => {
    setStep(1);
    setContactName("");
    setWorkEmail("");
    setCompany("");
    setPhone("");
    setRolesNeeded("");
    setCreatedLeadId(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0a1428]/60 backdrop-blur-sm transition-opacity"
        onClick={handleResetAndClose}
      />

      {/* Modal Surface */}
      <div className="relative w-full max-w-2xl rounded-3xl border border-[#bcd6fa] bg-white shadow-[0_20px_60px_-15px_rgba(10,20,40,0.25)] overflow-hidden my-auto z-10 font-enterprise">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-[#bcd6fa]/60 bg-gradient-to-r from-canvas to-surface px-6 py-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-electric/10 text-electric">
              <Clock size={16} />
            </span>
            <div>
              <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-electric">
                Fast-Track Employer Gateway
              </div>
              <h2 className="font-display text-base sm:text-lg font-bold text-ink">
                {step === 1 && "Deploy Workforce in 2 to 7 Days"}
                {step === 2 && "Schedule Discovery Consultation"}
                {step === 3 && "Request Dispatched to Delivery Engine"}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={handleResetAndClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-ink-soft hover:bg-canvas hover:text-ink transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 max-h-[82vh] overflow-y-auto">
          {errorMsg && (
            <div className="mb-5 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
              {errorMsg}
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleStep1Submit} className="space-y-4">
              <div className="rounded-2xl border border-electric/20 bg-electric/5 p-3.5 text-xs text-ink-soft flex items-center gap-3">
                <ShieldCheck size={20} className="text-electric shrink-0" />
                <span>
                  Zero commitment. Verified technical shortlists delivered in 2 to 7 days backed by a 2-week risk-free trial.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-ink-soft mb-1">
                    Your Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User size={15} className="absolute left-3 top-3 text-mist" />
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="e.g. David Vance"
                      className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/30 pl-9 pr-3 py-2 text-xs sm:text-sm text-ink placeholder-mist focus:border-electric focus:bg-white focus:outline-none focus:ring-2 focus:ring-electric/20 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink-soft mb-1">
                    Work Email <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3 top-3 text-mist" />
                    <input
                      type="email"
                      required
                      value={workEmail}
                      onChange={(e) => setWorkEmail(e.target.value)}
                      placeholder="david@enterprise.com"
                      className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/30 pl-9 pr-3 py-2 text-xs sm:text-sm text-ink placeholder-mist focus:border-electric focus:bg-white focus:outline-none focus:ring-2 focus:ring-electric/20 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-ink-soft mb-1">
                    Company / Organization <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Building2 size={15} className="absolute left-3 top-3 text-mist" />
                    <input
                      type="text"
                      required
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="e.g. Meridian Health / FinCorp"
                      className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/30 pl-9 pr-3 py-2 text-xs sm:text-sm text-ink placeholder-mist focus:border-electric focus:bg-white focus:outline-none focus:ring-2 focus:ring-electric/20 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink-soft mb-1">
                    Phone Number (Optional)
                  </label>
                  <div className="relative">
                    <Phone size={15} className="absolute left-3 top-3 text-mist" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 012-3456"
                      className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/30 pl-9 pr-3 py-2 text-xs sm:text-sm text-ink placeholder-mist focus:border-electric focus:bg-white focus:outline-none focus:ring-2 focus:ring-electric/20 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Sector selector */}
              <div>
                <label className="block text-xs font-semibold text-ink-soft mb-1.5">
                  Industry Focus
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "technology", label: "Technology" },
                    { id: "healthcare", label: "Healthcare" },
                    { id: "both", label: "Both / Hybrid" },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSector(s.id as any)}
                      className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                        sector === s.id
                          ? "border-electric bg-electric/10 text-electric shadow-xs font-bold"
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
                    Headcount
                  </label>
                  <select
                    value={headcount}
                    onChange={(e) => setHeadcount(Number(e.target.value))}
                    className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/30 px-3 py-2 text-xs text-ink focus:border-electric focus:bg-white focus:outline-none"
                  >
                    <option value={1}>1 Specialist</option>
                    <option value={2}>2 Specialists</option>
                    <option value={5}>3 to 5 (Core Pod)</option>
                    <option value={10}>6 to 15 (Squad)</option>
                    <option value={20}>16+ (Division)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink-soft mb-1">
                    Timeline
                  </label>
                  <select
                    value={timeline}
                    onChange={(e) => setTimeline(e.target.value)}
                    className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/30 px-3 py-2 text-xs text-ink focus:border-electric focus:bg-white focus:outline-none"
                  >
                    <option value="immediate">Immediate (7 Days)</option>
                    <option value="two_weeks">Within 2 Weeks</option>
                    <option value="one_month">Within 1 Month</option>
                    <option value="flexible">Flexible</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink-soft mb-1">
                    Engagement Model
                  </label>
                  <select
                    value={engagementModel}
                    onChange={(e) => setEngagementModel(e.target.value)}
                    className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/30 px-3 py-2 text-xs text-ink focus:border-electric focus:bg-white focus:outline-none"
                  >
                    <option value="staff_aug">Staff Augmentation</option>
                    <option value="dedicated_pod">Dedicated Pod</option>
                    <option value="direct_hire">Direct Hire Placement</option>
                    <option value="eor">Employer of Record</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-soft mb-1">
                  Roles & Technical Requirements
                </label>
                <textarea
                  rows={2}
                  required
                  value={rolesNeeded}
                  onChange={(e) => setRolesNeeded(e.target.value)}
                  placeholder="e.g. 2 Senior React/Node Engineers, 1 Clinical Data Analyst with FHIR experience..."
                  className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/30 px-3.5 py-2 text-xs sm:text-sm text-ink placeholder-mist focus:border-electric focus:bg-white focus:outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-ink-soft mb-1">
                    Target Budget (Optional)
                  </label>
                  <input
                    type="text"
                    value={estimatedBudget}
                    onChange={(e) => setEstimatedBudget(e.target.value)}
                    placeholder="e.g. $15k - $25k / mo"
                    className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/30 px-3 py-2 text-xs text-ink placeholder-mist focus:border-electric focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink-soft mb-1">
                    Shortlist Delivery Via
                  </label>
                  <select
                    value={preferredDeliveryChannel}
                    onChange={(e) => setPreferredDeliveryChannel(e.target.value)}
                    className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/30 px-3 py-2 text-xs text-ink focus:border-electric focus:bg-white focus:outline-none"
                  >
                    <option value="email">Email Packet</option>
                    <option value="im">Instant Messaging / Slack</option>
                    <option value="client_ats">Direct Upload to Our ATS</option>
                  </select>
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-ink py-3 font-display text-sm font-semibold text-white shadow-md hover:bg-electric transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <span>Registering Brief...</span>
                  ) : (
                    <>
                      <span>Continue to Free Consultation Slot</span>
                      <ArrowRight size={15} />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div className="rounded-2xl border border-[#bcd6fa]/60 bg-canvas/40 p-4">
                <div className="text-xs text-ink-soft font-medium">Brief Captured For</div>
                <div className="font-display text-base font-bold text-ink">{company}</div>
                <div className="text-xs text-mist">{contactName} ({workEmail})</div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-soft mb-2">
                  Select Discovery Consultation Window
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    "Today at 3:30 PM EST",
                    "Tomorrow at 10:00 AM EST",
                    "Tomorrow at 2:00 PM EST",
                    "Thursday at 11:30 AM EST",
                    "Thursday at 4:00 PM EST",
                    "Friday at 1:00 PM EST",
                  ].map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs text-left transition-all cursor-pointer ${
                        selectedSlot === slot
                          ? "border-electric bg-electric/10 text-electric font-bold shadow-xs"
                          : "border-[#bcd6fa]/70 bg-white text-ink hover:bg-canvas"
                      }`}
                    >
                      <Calendar size={14} className={selectedSlot === slot ? "text-electric" : "text-mist"} />
                      <span>{slot}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-soft mb-1">
                  Discovery Agenda or Specific Focus (Optional)
                </label>
                <textarea
                  rows={2}
                  value={bookingNotes}
                  onChange={(e) => setBookingNotes(e.target.value)}
                  placeholder="Any particular technical questions or NDA requirements to prepare ahead of time..."
                  className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/30 px-3.5 py-2 text-xs text-ink placeholder-mist focus:border-electric focus:bg-white focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex-1 rounded-xl border border-[#bcd6fa] py-3 text-xs font-semibold text-ink-soft hover:bg-canvas transition-colors cursor-pointer"
                >
                  Skip for Now (Contact Me via Email)
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleStep2Booking}
                  className="flex-1 rounded-xl bg-ink py-3 text-xs font-semibold text-white shadow-md hover:bg-electric transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {loading ? (
                    <span>Booking...</span>
                  ) : (
                    <>
                      <span>Confirm Slot & Launch Discovery</span>
                      <Check size={14} />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="py-8 text-center space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-signal/15 text-signal border border-signal/30 shadow-xs">
                <Check size={32} />
              </div>
              <h3 className="font-display text-2xl font-bold text-ink">
                Discovery Initiated
              </h3>
              <p className="text-xs sm:text-sm text-ink-soft max-w-md mx-auto leading-relaxed">
                Thank you, <strong className="text-ink font-semibold">{contactName}</strong>. Your requirement for{" "}
                <strong className="text-ink font-semibold">{company}</strong> is now logged in our delivery pipeline. A technical recruiter will prepare your custom candidate matrix.
              </p>
              <div className="rounded-2xl border border-[#bcd6fa]/50 bg-canvas/40 p-4 max-w-md mx-auto text-left space-y-1.5 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-mist">Consultation Window:</span>
                  <span className="text-ink font-semibold">{selectedSlot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-mist">Target Turnaround:</span>
                  <span className="text-electric font-semibold">2 to 7 Business Days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-mist">Delivery Channel:</span>
                  <span className="text-ink uppercase font-semibold">{preferredDeliveryChannel}</span>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="rounded-xl bg-ink px-6 py-2.5 font-display text-xs font-semibold text-white hover:bg-electric transition-colors cursor-pointer"
                >
                  Close & Return to Site
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
