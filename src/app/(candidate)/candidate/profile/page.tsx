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
} from "@/components/ui/Icons";
import { CandidateProfile } from "@/data/talentDashboardData";
import { useCandidatePersona } from "@/context/CandidatePersonaContext";

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

export default function CandidateProfilePage() {
  const { activePersona, currentProfile, updateCurrentProfile } = useCandidatePersona();
  const [activeTab, setActiveTab] = useState<"general" | "skills" | "compliance" | "preferences">("general");

  // Local form state cloned from active persona
  const [formData, setFormData] = useState<CandidateProfile>(currentProfile);
  const [newSkillInput, setNewSkillInput] = useState("");
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");

  // Keep local form in sync when user toggles persona in header
  useEffect(() => {
    setFormData(currentProfile);
  }, [currentProfile]);

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

  const handleGeneralSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentProfile(formData);
    setSavedMessage("Candidate profile, credentials, and telemetry synced across all active pods.");
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePreferencesSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentProfile(formData);
    setSavedMessage("Target pod deployment preferences and rate brackets updated.");
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
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

      {/* Tabs Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-[#bcd6fa]/40 pb-3">
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
          Verified Skill Radar ({formData.skills.length})
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
          Compliance &amp; Clearances (4)
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
          Deployment &amp; Pod Preferences
        </button>
      </div>

      {/* Tab 1: General Profile & Credentials (SRS Section 11.1 & FR-062 to FR-070) */}
      {activeTab === "general" && (
        <form onSubmit={handleGeneralSubmit} className="space-y-6">
          {/* Section A: Personal & Contact Information */}
          <div className="rounded-3xl border border-[#bcd6fa] bg-white p-6 sm:p-7 shadow-xs space-y-4">
            <div className="border-b border-[#bcd6fa]/40 pb-3 flex items-center justify-between">
              <div>
                <h2 className="font-display text-base font-bold text-ink">Personal &amp; Contact Information</h2>
                <p className="text-xs text-ink-soft">Direct contact and identity verified by Pepoltek legal operations.</p>
              </div>
              <span className="font-mono text-[11px] text-mist uppercase font-semibold">SRS Section 11.1</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-mono text-[11px] font-semibold uppercase text-ink-soft mb-1">
                  Candidate ID
                </label>
                <input
                  type="text"
                  disabled
                  value={formData.id}
                  className="w-full rounded-xl border border-[#bcd6fa]/60 bg-canvas/60 p-2.5 text-xs text-mist font-mono cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block font-mono text-[11px] font-semibold uppercase text-ink-soft mb-1">
                  Full Legal Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/30 p-2.5 text-xs text-ink font-semibold focus:border-electric focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-mono text-[11px] font-semibold uppercase text-ink-soft mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/30 p-2.5 text-xs text-ink font-medium focus:border-electric focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-mono text-[11px] font-semibold uppercase text-ink-soft mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/30 p-2.5 text-xs text-ink font-medium focus:border-electric focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-mono text-[11px] font-semibold uppercase text-ink-soft mb-1">
                  Location &amp; Base Timezone
                </label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/30 p-2.5 text-xs text-ink font-medium focus:border-electric focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-mono text-[11px] font-semibold uppercase text-ink-soft mb-1">
                  Professional Headline / Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/30 p-2.5 text-xs text-ink font-medium focus:border-electric focus:bg-white focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block font-mono text-[11px] font-semibold uppercase text-ink-soft mb-1">
                Executive Profile Summary / Bio
              </label>
              <textarea
                rows={3}
                value={
                  formData.bio ||
                  (activePersona === "alex"
                    ? "Principal Distributed Architect with 9+ years experience designing ultra-low-latency financial microservices, Next.js 15 enterprise web applications, Kafka event stream meshes, and automated Kubernetes multi-cluster rollouts."
                    : "Consultant Critical Care Physician & Clinical Director with 12+ years NHS trust and acute ICU leadership experience. Specialised in emergency resuscitation, clinical governance, EHR data interoperability, and tele-medicine clinical rotas.")
                }
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/30 p-2.5 text-xs text-ink leading-relaxed focus:border-electric focus:bg-white focus:outline-hidden font-sans"
              />
            </div>
          </div>

          {/* Section B: Sector, Specialization & Seniority (SRS FR-062, FR-063, FR-065, FR-066) */}
          <div className="rounded-3xl border border-[#bcd6fa] bg-white p-6 sm:p-7 shadow-xs space-y-4">
            <div className="border-b border-[#bcd6fa]/40 pb-3">
              <h2 className="font-display text-base font-bold text-ink">Specialization &amp; Seniority Level</h2>
              <p className="text-xs text-ink-soft">Configures in-house vetting rubric and automated reverse job search match criteria.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="block font-mono text-[11px] font-semibold uppercase text-ink-soft mb-1">
                  Sector Track (FR-062)
                </label>
                <select
                  value={formData.primaryTrack}
                  onChange={(e) => {
                    const newTrack = e.target.value as "technology" | "healthcare";
                    setFormData({
                      ...formData,
                      primaryTrack: newTrack,
                      primaryDomain: newTrack === "technology" ? TECH_DOMAINS[0] : HEALTHCARE_DOMAINS[0],
                      seniority: newTrack === "technology" ? TECH_SENIORITY[0] : HEALTHCARE_SENIORITY[0],
                    });
                  }}
                  className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/30 p-2.5 text-xs text-ink font-semibold focus:border-electric focus:bg-white focus:outline-hidden"
                >
                  <option value="technology">Technology &amp; Engineering</option>
                  <option value="healthcare">Healthcare &amp; Clinical</option>
                </select>
              </div>

              <div>
                <label className="block font-mono text-[11px] font-semibold uppercase text-ink-soft mb-1">
                  Primary Domain (FR-063 / FR-065)
                </label>
                <select
                  value={formData.primaryDomain}
                  onChange={(e) => setFormData({ ...formData, primaryDomain: e.target.value })}
                  className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/30 p-2.5 text-xs text-ink font-medium focus:border-electric focus:bg-white focus:outline-hidden"
                >
                  {availableDomains.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-mono text-[11px] font-semibold uppercase text-ink-soft mb-1">
                  Seniority Bracket (FR-066)
                </label>
                <select
                  value={formData.seniority}
                  onChange={(e) => setFormData({ ...formData, seniority: e.target.value })}
                  className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/30 p-2.5 text-xs text-ink font-medium focus:border-electric focus:bg-white focus:outline-hidden"
                >
                  {availableSeniority.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-mono text-[11px] font-semibold uppercase text-ink-soft mb-1">
                  Years of Verified Experience
                </label>
                <input
                  type="number"
                  min={1}
                  max={40}
                  value={formData.yearsExperience}
                  onChange={(e) => setFormData({ ...formData, yearsExperience: parseInt(e.target.value) || 1 })}
                  className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/30 p-2.5 text-xs text-ink font-semibold focus:border-electric focus:bg-white focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Section C: Portfolio & Statutory Registration Proofs */}
          <div className="rounded-3xl border border-[#bcd6fa] bg-white p-6 sm:p-7 shadow-xs space-y-4">
            <div className="border-b border-[#bcd6fa]/40 pb-3">
              <h2 className="font-display text-base font-bold text-ink">
                {formData.primaryTrack === "technology"
                  ? "Repository Portfolio & Proof of Work"
                  : "Clinical Registration & Regulatory Credentials"}
              </h2>
              <p className="text-xs text-ink-soft">
                {formData.primaryTrack === "technology"
                  ? "Required by in-house technical validators to assign official vetting scores."
                  : "Mandatory statutory verification against official health authority registries."}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {formData.primaryTrack === "technology" ? (
                <>
                  <div>
                    <label className="block font-mono text-[11px] font-semibold uppercase text-ink-soft mb-1">
                      GitHub Profile / Primary Repository URL
                    </label>
                    <input
                      type="url"
                      value={formData.githubUrl || "https://github.com/alexmorgan-dev"}
                      onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                      placeholder="https://github.com/username"
                      className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/30 p-2.5 text-xs text-ink font-mono focus:border-electric focus:bg-white focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[11px] font-semibold uppercase text-ink-soft mb-1">
                      Technical Architecture Portfolio / LinkedIn
                    </label>
                    <input
                      type="url"
                      value={formData.linkedinUrl || "https://linkedin.com/in/alexmorgan-architect"}
                      onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                      placeholder="https://linkedin.com/in/profile"
                      className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/30 p-2.5 text-xs text-ink font-mono focus:border-electric focus:bg-white focus:outline-hidden"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block font-mono text-[11px] font-semibold uppercase text-ink-soft mb-1">
                      GMC Doctor ID / NMC Nurse PIN Number
                    </label>
                    <input
                      type="text"
                      value={formData.clinicalRegistration || "GMC-7402910"}
                      onChange={(e) => setFormData({ ...formData, clinicalRegistration: e.target.value })}
                      placeholder="e.g. GMC-7402910 or NMC-99A1234E"
                      className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/30 p-2.5 text-xs text-ink font-mono focus:border-electric focus:bg-white focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[11px] font-semibold uppercase text-ink-soft mb-1">
                      NHS Framework / Hospital Trust Reference
                    </label>
                    <input
                      type="text"
                      value="Royal Free London NHS Trust (Critical Care)"
                      readOnly
                      className="w-full rounded-xl border border-[#bcd6fa]/60 bg-canvas/60 p-2.5 text-xs text-ink-soft font-mono cursor-not-allowed"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Section D: Core Skills & Tags Editor (SRS FR-064) */}
          <div className="rounded-3xl border border-[#bcd6fa] bg-white p-6 sm:p-7 shadow-xs space-y-4">
            <div className="border-b border-[#bcd6fa]/40 pb-3 flex items-center justify-between">
              <div>
                <h2 className="font-display text-base font-bold text-ink">Core Verified Skills &amp; Stack Tags</h2>
                <p className="text-xs text-ink-soft">Add or update competencies reflected in your AI ATS score and matching radar.</p>
              </div>
              <span className="font-mono text-xs text-electric font-bold">{formData.skills.length} Skills</span>
            </div>

            {/* Skill Chips */}
            <div className="flex flex-wrap gap-2">
              {formData.skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[#bcd6fa] bg-canvas px-3 py-1.5 text-xs font-mono text-ink shadow-2xs group"
                >
                  <Code2 size={13} className="text-electric shrink-0" />
                  <span className="font-semibold">{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="ml-1 text-mist hover:text-rose-600 transition-colors cursor-pointer"
                    title={`Remove ${skill}`}
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>

            {/* Add Skill Input */}
            <div className="flex gap-2 pt-2">
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
                placeholder="Type skill tag (e.g. Kafka, Next.js 15, Go, FHIR, Acute Triage)..."
                className="flex-1 rounded-xl border border-[#bcd6fa] bg-canvas/30 p-2.5 text-xs text-ink focus:border-electric focus:bg-white focus:outline-hidden"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="inline-flex items-center gap-1.5 rounded-xl bg-ink px-4 py-2.5 font-display text-xs font-bold text-white shadow-xs hover:bg-electric transition-colors cursor-pointer"
              >
                <Plus size={14} />
                <span>Add Skill</span>
              </button>
            </div>
          </div>

          {/* Form Submit Footer */}
          <div className="flex items-center justify-between pt-3">
            <p className="text-[11px] text-mist font-mono">
              Updates to skills or registration trigger instant ATS score re-calculation.
            </p>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-electric px-6 py-3 font-display text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-electric-bright transition-all cursor-pointer"
            >
              <span>Save &amp; Sync Profile</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Verified Skill Radar (Competency Ranks) */}
      {activeTab === "skills" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {formData.skills.map((skill, i) => (
            <div
              key={i}
              className="rounded-2xl border border-[#bcd6fa] bg-white p-4.5 shadow-xs flex items-center justify-between hover:border-electric transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-electric/10 text-electric">
                  <Code2 size={18} />
                </div>
                <div>
                  <h3 className="font-display text-sm font-bold text-ink">{skill}</h3>
                  <span className="font-mono text-[10.5px] text-mist">Verified via In-House Technical Audit</span>
                </div>
              </div>
              <span className="rounded-lg bg-signal/10 border border-signal/20 px-2.5 py-0.5 font-mono text-[11px] font-bold text-signal">
                98% Rank
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Compliance & Clearances */}
      {activeTab === "compliance" && (
        <div className="rounded-3xl border border-[#bcd6fa] bg-white p-6 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#bcd6fa]/30 pb-3">
            <div>
              <h2 className="font-display text-base font-bold text-ink">Background and Regulatory Dossier</h2>
              <p className="text-xs text-ink-soft">Verified legal credentials allowing instant zero-risk deployment.</p>
            </div>
            <span className="rounded-full bg-signal/15 px-3 py-1 font-mono text-xs font-bold text-signal">
              Audit Clear
            </span>
          </div>

          <div className="space-y-3">
            {complianceItems.map((item, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-[#bcd6fa]/60 bg-canvas/30 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-signal/10 text-signal">
                    <ShieldCheck size={16} />
                  </div>
                  <div>
                    <div className="font-display font-bold text-ink">{item.name}</div>
                    <div className="font-mono text-[10.5px] text-mist">{item.date}</div>
                  </div>
                </div>
                <span className="rounded-full bg-signal/10 text-signal font-mono font-bold text-[10px] px-2.5 py-0.5 self-start sm:self-auto">
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Deployment & Pod Preferences */}
      {activeTab === "preferences" && (
        <form onSubmit={handlePreferencesSubmit} className="rounded-3xl border border-[#bcd6fa] bg-white p-6 sm:p-8 shadow-xs space-y-5">
          <div className="border-b border-[#bcd6fa]/30 pb-3">
            <h2 className="font-display text-base font-bold text-ink">Target Pod Deployment Preferences</h2>
            <p className="text-xs text-ink-soft">Configure your live standup windows and contract structures.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-mono text-[11px] font-semibold uppercase text-ink-soft mb-1">
                Target Rate Range
              </label>
              <input
                type="text"
                value={formData.desiredHourlyRate}
                onChange={(e) => setFormData({ ...formData, desiredHourlyRate: e.target.value })}
                className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/30 p-2.5 text-sm text-ink focus:border-electric focus:bg-white focus:outline-hidden font-medium"
              />
            </div>

            <div>
              <label className="block font-mono text-[11px] font-semibold uppercase text-ink-soft mb-1">
                Preferred Engagement Contract
              </label>
              <input
                type="text"
                value={formData.engagementPreference}
                onChange={(e) => setFormData({ ...formData, engagementPreference: e.target.value })}
                className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/30 p-2.5 text-sm text-ink focus:border-electric focus:bg-white focus:outline-hidden font-medium"
              />
            </div>

            <div>
              <label className="block font-mono text-[11px] font-semibold uppercase text-ink-soft mb-1">
                Right-to-Work / Visa Authorization
              </label>
              <input
                type="text"
                value={formData.visaStatus}
                onChange={(e) => setFormData({ ...formData, visaStatus: e.target.value })}
                className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/30 p-2.5 text-sm text-ink focus:border-electric focus:bg-white focus:outline-hidden font-medium"
              />
            </div>

            <div>
              <label className="block font-mono text-[11px] font-semibold uppercase text-ink-soft mb-1">
                Mandatory Live Timezone Overlap
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={4}
                  max={8}
                  value={formData.timezoneOverlapHours}
                  onChange={(e) => setFormData({ ...formData, timezoneOverlapHours: parseInt(e.target.value) || 4 })}
                  className="w-24 rounded-xl border border-[#bcd6fa] bg-canvas/30 p-2.5 text-sm text-ink focus:border-electric focus:bg-white focus:outline-hidden font-semibold"
                />
                <span className="text-xs text-mist font-mono">Hours Daily Synchronous Overlap (4 to 6 required)</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#bcd6fa]/40 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-electric px-5 py-2.5 font-display text-xs font-bold text-white shadow-xs hover:bg-electric-bright transition-all cursor-pointer"
            >
              <span>Save Preferences</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
