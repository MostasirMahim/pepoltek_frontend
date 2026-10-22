"use client";

import React, { useEffect, useState } from "react";
import {
  Globe,
  Clock,
  DollarSign,
  ShieldCheck,
  CheckCircle,
  ArrowRight,
  Code2,
  Users,
  Briefcase,
  ExternalLink,
  Plus,
  X,
  FileText,
  AlertTriangle,
} from "@/components/ui/Icons";
import { CandidateProfile } from "@/data/talentDashboardData";
import { useCandidatePersona } from "@/context/CandidatePersonaContext";
import { updateCandidateProfileAction } from "@/actions/candidate.actions";

const TECH_DOMAINS = [
  "Full Stack Systems & Real-Time Data Pipelines",
  "Distributed Backend Microservices & Go",
  "Frontend Architecture & Next.js Performance",
  "DevOps, SRE & Cloud Native Kubernetes",
  "Data Engineering & AI/ML Pipelines",
  "Cybersecurity & Regulatory SOC 2 Compliance",
];

const HEALTHCARE_DOMAINS = [
  "Critical Care & Emergency ICU Medicine",
  "Emergency Clinical Triage & Acute Care",
  "EHR & FHIR Healthcare Interoperability",
  "Health-Tech Clinical Informatics & Safety",
  "Hospital Ward Administration & Clinical Governance",
  "Surgical Services & Anaesthetic Care",
];

const TECH_SENIORITY = [
  "Lead / Architect",
  "Senior Staff Engineer",
  "Mid-Level Engineer",
  "Junior Developer",
];

const HEALTHCARE_SENIORITY = [
  "Department Lead / Director",
  "Consultant Physician",
  "Advanced Specialist Lead",
  "Clinical Practice Nurse / Specialist",
];

interface CandidateProfileViewProps {
  initialProfile?: CandidateProfile;
}

export function CandidateProfileView({ initialProfile }: CandidateProfileViewProps) {
  const { activePersona, currentProfile, updateCurrentProfile } = useCandidatePersona();
  const [activeTab, setActiveTab] = useState<"general" | "skills" | "compliance" | "preferences">("general");

  const [formData, setFormData] = useState<CandidateProfile>(initialProfile || currentProfile);
  const [newSkillInput, setNewSkillInput] = useState("");
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");
  const [isDataRightsModalOpen, setIsDataRightsModalOpen] = useState(false);
  const [dataRightsSuccessMessage, setDataRightsSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (initialProfile) {
      setFormData(initialProfile);
    } else {
      setFormData(currentProfile);
    }
  }, [initialProfile, currentProfile]);

  const complianceItems = [
    { name: "Right to Work Verification (US Citizen / Global)", status: "Active and Verified", date: "Valid until Dec 2027" },
    { name: "Enhanced Background and Security Check", status: "Active and Verified", date: "Completed Aug 2026" },
    { name: "IP Assignment and NDA Agreement", status: "Digitally Executed", date: "On File with Pepoltek Legal" },
    { name: "SOC 2 Type II and HIPAA Data Compliance Certification", status: "Certified", date: "Annual Refresh Complete" },
  ];

  const handleAddSkill = () => {
    const trimmed = newSkillInput.trim();
    if (trimmed && !formData.skills.includes(trimmed)) {
      setFormData({
        ...formData,
        skills: [...formData.skills, trimmed],
      });
      setNewSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((s) => s !== skillToRemove),
    });
  };

  const handleGeneralSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentProfile(formData);
    setSavedMessage("Candidate profile, credentials, and telemetry synced across all active requisitions.");
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);

    // Call live server action
    await updateCandidateProfileAction({
      full_name: formData.fullName,
      phone: formData.phone,
      location: formData.location,
      sector: formData.primaryTrack,
      domain: formData.primaryDomain,
      level: formData.seniority,
      work_auth: formData.visaStatus,
      skills: formData.skills,
      open_to_work: formData.isOpenToPods,
      portfolio_url: formData.githubUrl,
      linkedin_url: formData.linkedinUrl,
    });
  };

  const handlePreferencesSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentProfile(formData);
    setSavedMessage("Target placement preferences and rate brackets updated.");
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);

    await updateCandidateProfileAction({
      open_to_work: formData.isOpenToPods,
      skills: formData.skills,
    });
  };

  const handleRequestDataExport = () => {
    setDataRightsSuccessMessage("A complete JSON bundle of your candidate profile, telemetry, and audit trail has been queued for email delivery.");
    setTimeout(() => setDataRightsSuccessMessage(null), 4500);
    setIsDataRightsModalOpen(false);
  };

  const availableDomains = formData.primaryTrack === "technology" ? TECH_DOMAINS : HEALTHCARE_DOMAINS;
  const availableSeniority = formData.primaryTrack === "technology" ? TECH_SENIORITY : HEALTHCARE_SENIORITY;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Top Profile Header Banner */}
      <div className="rounded-3xl border border-[#bcd6fa] bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="relative">
              <div
                className={`flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-3xl font-display text-2xl sm:text-3xl font-extrabold text-white shadow-md ${
                  activePersona === "alex"
                    ? "bg-gradient-to-tr from-electric to-electric-bright"
                    : "bg-gradient-to-tr from-signal to-emerald-400"
                }`}
              >
                {activePersona === "alex" ? "AM" : "RH"}
              </div>
              <span className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-3 border-white bg-signal" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink">
                  {formData.fullName}
                </h1>
                <span className="rounded-full bg-signal/15 border border-signal/30 px-2.5 py-0.5 font-mono text-[10px] font-bold text-signal">
                  {formData.vettingTier}
                </span>
                <span className="rounded-full bg-canvas border border-[#bcd6fa] px-2.5 py-0.5 font-mono text-[10px] font-semibold text-ink-soft">
                  ID: {formData.id}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-ink-soft mt-0.5">
                {formData.title}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-mist">
                <span className="flex items-center gap-1.5 text-ink-soft">
                  <Globe size={13} className="text-electric" />
                  <span>{formData.location}</span>
                </span>
                <span className="flex items-center gap-1.5 text-ink-soft">
                  <Clock size={13} className="text-electric" />
                  <span>{formData.timezoneOverlapHours} Hours Live Overlap</span>
                </span>
                <span className="flex items-center gap-1.5 text-ink-soft">
                  <DollarSign size={13} className="text-signal" />
                  <span>{formData.desiredHourlyRate}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="text-right shrink-0 flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-0 border-[#bcd6fa]/40">
            <div>
              <div className="font-mono text-[10.5px] uppercase tracking-wider text-mist">
                {activePersona === "alex" ? "Technical Vetting" : "Clinical Vetting"}
              </div>
              <div className="font-display text-2xl font-extrabold text-electric">
                {formData.technicalVettingScore} <span className="text-xs font-normal text-mist">/ 100</span>
              </div>
            </div>
            <div className="text-xs font-mono text-signal font-semibold">
              Readiness: {formData.readinessIndex}%
            </div>
          </div>
        </div>
      </div>

      {/* Save Success Alert Banner */}
      {savedSuccess && (
        <div className="rounded-2xl border border-signal/40 bg-signal/10 p-4 text-xs text-signal flex items-center gap-2.5 shadow-2xs animate-in fade-in-0 duration-200">
          <CheckCircle size={18} className="shrink-0 text-signal" />
          <span className="font-semibold">{savedMessage}</span>
        </div>
      )}

      {/* Data Rights Notification */}
      {dataRightsSuccessMessage && (
        <div className="rounded-2xl border border-electric/40 bg-electric/10 p-4 text-xs text-ink flex items-center gap-2.5 shadow-2xs animate-in fade-in-0 duration-200">
          <ShieldCheck size={18} className="shrink-0 text-electric" />
          <span className="font-semibold">{dataRightsSuccessMessage}</span>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#bcd6fa]/40 pb-3">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("general")}
            className={`rounded-xl px-4 py-2 font-display text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "general"
                ? "bg-ink text-white shadow-xs"
                : "bg-white border border-[#bcd6fa]/60 text-ink-soft hover:text-ink"
            }`}
          >
            General Profile &amp; Credentials
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("skills")}
            className={`rounded-xl px-4 py-2 font-display text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "skills"
                ? "bg-ink text-white shadow-xs"
                : "bg-white border border-[#bcd6fa]/60 text-ink-soft hover:text-ink"
            }`}
          >
            Skills, Badges &amp; Domains
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("compliance")}
            className={`rounded-xl px-4 py-2 font-display text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "compliance"
                ? "bg-ink text-white shadow-xs"
                : "bg-white border border-[#bcd6fa]/60 text-ink-soft hover:text-ink"
            }`}
          >
            Compliance, Work Auth &amp; Legal
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("preferences")}
            className={`rounded-xl px-4 py-2 font-display text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "preferences"
                ? "bg-ink text-white shadow-xs"
                : "bg-white border border-[#bcd6fa]/60 text-ink-soft hover:text-ink"
            }`}
          >
            Role Preferences &amp; Rate Brackets
          </button>
        </div>

        <button
          type="button"
          onClick={() => setIsDataRightsModalOpen(true)}
          className="rounded-xl border border-[#bcd6fa] bg-canvas/30 px-3 py-1.5 font-display text-xs font-semibold text-ink-soft hover:bg-white hover:text-ink transition-all cursor-pointer"
        >
          Data Rights &amp; Privacy
        </button>
      </div>

      {/* Tab 1: General Profile */}
      {activeTab === "general" && (
        <form onSubmit={handleGeneralSubmit} className="space-y-6">
          <div className="rounded-3xl border border-[#bcd6fa] bg-white p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h2 className="font-display text-lg font-bold text-ink">Legal Identity &amp; Contact Information</h2>
              <p className="text-xs text-ink-soft mt-0.5">
                Managed under strict SOC 2 Type II controls. PII is encrypted at rest and never revealed to clients without your explicit 1-Click Pitch authorization.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-mono text-[11px] font-semibold text-ink uppercase block mb-1">
                  Full Legal Name
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/30 px-3.5 py-2.5 text-xs text-ink font-medium focus:border-electric focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="font-mono text-[11px] font-semibold text-ink uppercase block mb-1">
                  Professional Headline
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/30 px-3.5 py-2.5 text-xs text-ink font-medium focus:border-electric focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="font-mono text-[11px] font-semibold text-ink uppercase block mb-1">
                  Primary Contact Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/30 px-3.5 py-2.5 text-xs text-ink font-medium focus:border-electric focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="font-mono text-[11px] font-semibold text-ink uppercase block mb-1">
                  Secure Phone Number
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/30 px-3.5 py-2.5 text-xs text-ink font-medium focus:border-electric focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="font-mono text-[11px] font-semibold text-ink uppercase block mb-1">
                  Primary Location / Timezone
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/30 px-3.5 py-2.5 text-xs text-ink font-medium focus:border-electric focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="font-mono text-[11px] font-semibold text-ink uppercase block mb-1">
                  Seniority Level
                </label>
                <select
                  value={formData.seniority}
                  onChange={(e) => setFormData({ ...formData, seniority: e.target.value })}
                  className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/30 px-3.5 py-2.5 text-xs text-ink font-medium focus:border-electric focus:bg-white focus:outline-none"
                >
                  {availableSeniority.map((sen) => (
                    <option key={sen} value={sen}>{sen}</option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="font-mono text-[11px] font-semibold text-ink uppercase block mb-1">
                  Primary Domain Specialization
                </label>
                <select
                  value={formData.primaryDomain}
                  onChange={(e) => setFormData({ ...formData, primaryDomain: e.target.value })}
                  className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/30 px-3.5 py-2.5 text-xs text-ink font-medium focus:border-electric focus:bg-white focus:outline-none"
                >
                  {availableDomains.map((dom) => (
                    <option key={dom} value={dom}>{dom}</option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="font-mono text-[11px] font-semibold text-ink uppercase block mb-1">
                  Candidate Bio &amp; Production Summary
                </label>
                <textarea
                  rows={4}
                  value={formData.bio || ""}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/30 px-3.5 py-2.5 text-xs text-ink font-medium focus:border-electric focus:bg-white focus:outline-none"
                  placeholder="Summarize your architecture philosophy, verified squad impact, and primary strengths..."
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#bcd6fa]/40 flex justify-end">
              <button
                type="submit"
                className="rounded-xl bg-ink px-6 py-2.5 font-display text-xs font-bold text-white hover:bg-electric transition-all shadow-xs cursor-pointer"
              >
                Save General Profile
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Tab 2: Skills & Badges */}
      {activeTab === "skills" && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-[#bcd6fa] bg-white p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h2 className="font-display text-lg font-bold text-ink">Verified Skills &amp; Competency Tags</h2>
              <p className="text-xs text-ink-soft mt-0.5">
                Skills are evaluated during your live technical evaluation and used to match with enterprise requisitions.
              </p>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
                placeholder="Enter skill or framework (e.g. Next.js 15, Go, Kafka, DICOM)..."
                className="flex-1 rounded-xl border border-[#bcd6fa] bg-canvas/30 px-3.5 py-2 text-xs text-ink focus:border-electric focus:bg-white focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="inline-flex items-center gap-1.5 rounded-xl bg-electric px-4 py-2 font-display text-xs font-semibold text-white hover:bg-electric-bright cursor-pointer"
              >
                <Plus size={14} />
                <span>Add Skill</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {formData.skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[#bcd6fa] bg-canvas/50 px-3 py-1.5 font-mono text-xs font-semibold text-ink"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-mist hover:text-rose-600 cursor-pointer"
                  >
                    <X size={13} />
                  </button>
                </span>
              ))}
            </div>

            <div className="pt-4 border-t border-[#bcd6fa]/40 flex justify-end">
              <button
                type="button"
                onClick={handleGeneralSubmit}
                className="rounded-xl bg-ink px-6 py-2.5 font-display text-xs font-bold text-white hover:bg-electric transition-all shadow-xs cursor-pointer"
              >
                Save Verified Skills
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Compliance & Legal */}
      {activeTab === "compliance" && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-[#bcd6fa] bg-white p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h2 className="font-display text-lg font-bold text-ink">Compliance, Work Auth &amp; Legal Dossier</h2>
              <p className="text-xs text-ink-soft mt-0.5">
                Every candidate placed into client teams has passed mandatory background, work authorization, and data confidentiality checks.
              </p>
            </div>

            <div className="space-y-3">
              {complianceItems.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-2xl border border-[#bcd6fa]/60 bg-canvas/30 p-4 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-signal/15 text-signal">
                      <ShieldCheck size={18} />
                    </div>
                    <div>
                      <div className="font-display text-xs font-bold text-ink">{item.name}</div>
                      <div className="text-[11px] text-ink-soft">{item.date}</div>
                    </div>
                  </div>

                  <span className="rounded-full bg-signal/15 border border-signal/30 px-3 py-1 font-mono text-[10px] font-bold text-signal">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Preferences & Rate */}
      {activeTab === "preferences" && (
        <form onSubmit={handlePreferencesSubmit} className="space-y-6">
          <div className="rounded-3xl border border-[#bcd6fa] bg-white p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h2 className="font-display text-lg font-bold text-ink">Target Placement &amp; Engagement Preferences</h2>
              <p className="text-xs text-ink-soft mt-0.5">
                Tune your minimum rate requirements, work model, and availability.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-mono text-[11px] font-semibold text-ink uppercase block mb-1">
                  Desired Hourly Compensation
                </label>
                <input
                  type="text"
                  value={formData.desiredHourlyRate}
                  onChange={(e) => setFormData({ ...formData, desiredHourlyRate: e.target.value })}
                  className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/30 px-3.5 py-2.5 text-xs text-ink font-medium focus:border-electric focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="font-mono text-[11px] font-semibold text-ink uppercase block mb-1">
                  Guaranteed Timezone Overlap (Hours)
                </label>
                <input
                  type="number"
                  min={2}
                  max={8}
                  value={formData.timezoneOverlapHours}
                  onChange={(e) => setFormData({ ...formData, timezoneOverlapHours: Number(e.target.value) })}
                  className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/30 px-3.5 py-2.5 text-xs text-ink font-medium focus:border-electric focus:bg-white focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="flex items-center gap-3 p-4 rounded-2xl border border-electric/30 bg-electric/5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isOpenToPods}
                    onChange={(e) => setFormData({ ...formData, isOpenToPods: e.target.checked })}
                    className="h-4 w-4 rounded-md accent-electric"
                  />
                  <div>
                    <span className="font-display text-xs font-bold text-ink block">
                      Actively Open to Fast-Track Enterprise Placements (7-Day Kickoff)
                    </span>
                    <span className="text-[11px] text-ink-soft block">
                      Enables the Reverse Search matching engine to index your anonymized dossier for enterprise client requisitions.
                    </span>
                  </div>
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-[#bcd6fa]/40 flex justify-end">
              <button
                type="submit"
                className="rounded-xl bg-ink px-6 py-2.5 font-display text-xs font-bold text-white hover:bg-electric transition-all shadow-xs cursor-pointer"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Data Rights & GDPR/CCPA Modal */}
      {isDataRightsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 backdrop-blur-xs p-4 animate-in fade-in-0 duration-150">
          <div
            className="w-full max-w-lg rounded-3xl border border-[#bcd6fa] bg-white p-6 sm:p-7 shadow-2xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-[#bcd6fa]/40 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-electric/15 text-electric">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-ink">Data Rights &amp; Privacy Center</h3>
                  <p className="text-xs text-ink-soft">GDPR, CCPA &amp; SOC 2 Compliance Controls</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsDataRightsModalOpen(false)}
                className="rounded-xl p-1.5 text-ink-soft hover:bg-canvas cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="rounded-2xl border border-[#bcd6fa]/60 bg-canvas/30 p-4 space-y-2">
                <div className="font-display font-bold text-ink">Export Personal Data Dossier</div>
                <p className="text-ink-soft text-[11px] leading-relaxed">
                  Request an immutable cryptographic archive of your candidate record, including all submitted documents, interview feedback, and reverse search logs.
                </p>
                <button
                  type="button"
                  onClick={handleRequestDataExport}
                  className="rounded-xl bg-ink px-4 py-2 font-display text-xs font-semibold text-white hover:bg-electric transition-all cursor-pointer shadow-xs"
                >
                  Generate Data Export Bundle
                </button>
              </div>

              <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-4 space-y-2">
                <div className="font-display font-bold text-rose-800">Right to be Forgotten (Account Deletion)</div>
                <p className="text-rose-700 text-[11px] leading-relaxed">
                  Permanently purge your candidate profile, unenroll from active talent academy courses, and remove all reverse search indexing.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsDataRightsModalOpen(false);
                    setDataRightsSuccessMessage("Account closure request registered with Pepoltek Data Protection Officer. Audit confirmation sent.");
                  }}
                  className="rounded-xl border border-rose-300 bg-white px-4 py-2 font-display text-xs font-bold text-rose-600 hover:bg-rose-100 transition-all cursor-pointer shadow-xs"
                >
                  Request Account &amp; Record Deletion
                </button>
              </div>
            </div>

            <div className="pt-3 border-t border-[#bcd6fa]/40 flex justify-end">
              <button
                type="button"
                onClick={() => setIsDataRightsModalOpen(false)}
                className="rounded-xl px-4 py-2 font-display text-xs font-semibold text-ink-soft hover:bg-canvas cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
