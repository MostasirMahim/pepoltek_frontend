"use client";

import React, { useState, useEffect } from "react";
import { X, CheckCircle, Plus, Globe, DollarSign, Briefcase } from "@/components/ui/Icons";
import { useCandidatePersona } from "@/context/CandidatePersonaContext";

interface CandidateProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const TECH_DOMAINS = [
  "Full Stack Systems and Real-Time Data Pipelines",
  "Distributed Backend Microservices and Go",
  "Frontend Architecture and Next.js Performance",
  "DevOps, SRE and Cloud Native Kubernetes",
  "Data Engineering and AI/ML Pipelines",
  "Cybersecurity and Regulatory SOC 2 Compliance",
];

const HEALTHCARE_DOMAINS = [
  "Critical Care and Emergency ICU Medicine",
  "Emergency Clinical Triage and Acute Care",
  "EHR and FHIR Healthcare Interoperability",
  "Health-Tech Clinical Informatics and Safety",
  "Hospital Ward Administration and Clinical Governance",
  "Surgical Services and Anaesthetic Care",
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

export function CandidateProfileDrawer({ isOpen, onClose }: CandidateProfileDrawerProps) {
  const { currentProfile, updateCurrentProfile } = useCandidatePersona();

  const [fullName, setFullName] = useState(currentProfile.fullName || "");
  const [title, setTitle] = useState(currentProfile.title || "");
  const [seniority, setSeniority] = useState(currentProfile.seniority || "");
  const [sector, setSector] = useState<"technology" | "healthcare">(currentProfile.primaryTrack || "technology");
  const [desiredRate, setDesiredRate] = useState(currentProfile.desiredHourlyRate || "");
  const [phone, setPhone] = useState(currentProfile.phone || "");
  const [location, setLocation] = useState(currentProfile.location || "");
  const [bio, setBio] = useState(currentProfile.bio || "");
  const [portfolioUrl, setPortfolioUrl] = useState(currentProfile.githubUrl || "");
  const [linkedinUrl, setLinkedinUrl] = useState(currentProfile.linkedinUrl || "");
  const [skills, setSkills] = useState<string[]>(currentProfile.skills || []);
  const [newSkillInput, setNewSkillInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setFullName(currentProfile.fullName || "");
      setTitle(currentProfile.title || "");
      setSeniority(currentProfile.seniority || "");
      setSector(currentProfile.primaryTrack || "technology");
      setDesiredRate(currentProfile.desiredHourlyRate || "");
      setPhone(currentProfile.phone || "");
      setLocation(currentProfile.location || "");
      setBio(currentProfile.bio || "");
      setPortfolioUrl(currentProfile.githubUrl || "");
      setLinkedinUrl(currentProfile.linkedinUrl || "");
      setSkills(currentProfile.skills || []);
      setSuccessMessage(null);
    }
  }, [isOpen, currentProfile]);

  if (!isOpen) return null;

  const handleAddSkill = () => {
    const trimmed = newSkillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setNewSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage(null);

    const success = await updateCurrentProfile({
      fullName,
      title,
      seniority,
      primaryTrack: sector,
      desiredHourlyRate: desiredRate,
      phone,
      location,
      bio,
      githubUrl: portfolioUrl,
      linkedinUrl,
      skills,
    });

    setIsSubmitting(false);
    if (success) {
      setSuccessMessage("Candidate profile and readiness telemetry updated successfully.");
      setTimeout(() => {
        setSuccessMessage(null);
        onClose();
      }, 1400);
    }
  };

  const availableDomains = sector === "technology" ? TECH_DOMAINS : HEALTHCARE_DOMAINS;
  const availableSeniority = sector === "technology" ? TECH_SENIORITY : HEALTHCARE_SENIORITY;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-ink/60 backdrop-blur-xs transition-opacity animate-in fade-in-0 duration-200"
      />

      {/* Slide-Over Drawer Container */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10 z-50">
        <div className="w-screen max-w-xl md:max-w-2xl bg-white border-l border-[#bcd6fa] shadow-2xl flex flex-col animate-in slide-in-from-right duration-250 ease-out">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4.5 border-b border-[#bcd6fa]/50 bg-canvas/30 shrink-0">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-electric/10 px-2.5 py-0.5 text-[10px] font-mono font-bold text-electric uppercase tracking-wider mb-1">
                Candidate Profile
              </div>
              <h2 className="font-display text-lg font-bold text-ink">
                Quick Edit Profile &amp; Preferences
              </h2>
              <p className="text-xs text-ink-soft">
                Update your professional domain, rates, and skills across all client requisitions.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl p-2 text-ink-soft hover:text-ink hover:bg-canvas transition-colors cursor-pointer"
              title="Close Drawer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
            {successMessage && (
              <div className="rounded-2xl border border-signal/40 bg-signal/10 p-3.5 text-xs text-signal flex items-center gap-2 shadow-2xs">
                <CheckCircle size={16} className="shrink-0" />
                <span className="font-semibold">{successMessage}</span>
              </div>
            )}

            {/* Basic Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono font-bold text-ink-soft uppercase tracking-wider mb-1">
                  Full Legal Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3.5 py-2 text-xs font-semibold text-ink placeholder:text-mist focus:border-electric focus:outline-none"
                  placeholder="e.g. Alex Mercer"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold text-ink-soft uppercase tracking-wider mb-1">
                  Assigned Industry Path
                </label>
                <div className="w-full rounded-xl border border-[#bcd6fa] bg-slate-50 px-3.5 py-2 text-xs font-semibold text-ink flex items-center justify-between">
                  <span>{sector === "healthcare" ? "Healthcare & Clinical Track" : "Technology Specialist Track"}</span>
                  <span className="text-[10px] font-mono text-mist uppercase">Fixed at Intake</span>
                </div>
              </div>
            </div>

            {/* Title & Seniority */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono font-bold text-ink-soft uppercase tracking-wider mb-1">
                  Domain Specialty
                </label>
                <select
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3.5 py-2 text-xs font-semibold text-ink focus:border-electric focus:outline-none"
                >
                  <option value="">Select Domain</option>
                  {availableDomains.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold text-ink-soft uppercase tracking-wider mb-1">
                  Seniority Level
                </label>
                <select
                  value={seniority}
                  onChange={(e) => setSeniority(e.target.value)}
                  className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3.5 py-2 text-xs font-semibold text-ink focus:border-electric focus:outline-none"
                >
                  <option value="">Select Seniority</option>
                  {availableSeniority.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Hourly Rate & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono font-bold text-ink-soft uppercase tracking-wider mb-1">
                  Target Rate Bracket
                </label>
                <div className="relative">
                  <DollarSign size={14} className="absolute left-3 top-2.5 text-mist" />
                  <input
                    type="text"
                    value={desiredRate}
                    onChange={(e) => setDesiredRate(e.target.value)}
                    placeholder="e.g. $85 to $115 / hr"
                    className="w-full rounded-xl border border-[#bcd6fa] bg-white pl-8 pr-3.5 py-2 text-xs font-semibold text-ink placeholder:text-mist focus:border-electric focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold text-ink-soft uppercase tracking-wider mb-1">
                  Location &amp; Work Model
                </label>
                <div className="relative">
                  <Globe size={14} className="absolute left-3 top-2.5 text-mist" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Austin, TX (Remote / Hybrid)"
                    className="w-full rounded-xl border border-[#bcd6fa] bg-white pl-8 pr-3.5 py-2 text-xs font-semibold text-ink placeholder:text-mist focus:border-electric focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Contact & Links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono font-bold text-ink-soft uppercase tracking-wider mb-1">
                  Phone Contact (Optional)
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 019-2834"
                  className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3.5 py-2 text-xs font-semibold text-ink placeholder:text-mist focus:border-electric focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold text-ink-soft uppercase tracking-wider mb-1">
                  {sector === "technology" ? "GitHub or Portfolio URL" : "Clinical Registry URL"}
                </label>
                <input
                  type="url"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  placeholder="https://github.com/..."
                  className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3.5 py-2 text-xs font-semibold text-ink placeholder:text-mist focus:border-electric focus:outline-none"
                />
              </div>
            </div>

            {/* Bio / Summary */}
            <div>
              <label className="block text-[11px] font-mono font-bold text-ink-soft uppercase tracking-wider mb-1">
                Executive Bio &amp; Summary
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Brief summary of engineering or clinical accomplishments..."
                className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3.5 py-2 text-xs text-ink placeholder:text-mist focus:border-electric focus:outline-none"
              />
            </div>

            {/* Skills Taxonomy Tags */}
            <div>
              <label className="block text-[11px] font-mono font-bold text-ink-soft uppercase tracking-wider mb-1">
                Core Skills &amp; Stack Specialties
              </label>
              <div className="flex gap-2 mb-2">
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
                  placeholder="Add skill tag (e.g. Next.js, Kubernetes, ICU Triage)..."
                  className="flex-1 rounded-xl border border-[#bcd6fa] bg-white px-3.5 py-1.5 text-xs text-ink placeholder:text-mist focus:border-electric focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="inline-flex items-center gap-1 rounded-xl bg-ink px-3 py-1.5 text-xs font-semibold text-white hover:bg-electric transition-colors cursor-pointer"
                >
                  <Plus size={13} />
                  <span>Add</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 min-h-[36px] rounded-xl border border-[#bcd6fa]/60 bg-canvas/40 p-2">
                {skills.length === 0 ? (
                  <span className="text-[11px] text-mist italic">No skills listed yet. Add tags above.</span>
                ) : (
                  skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-[#bcd6fa] bg-white px-2.5 py-1 text-xs font-mono text-ink shadow-2xs"
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-mist hover:text-rose-500 cursor-pointer"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-4 border-t border-[#bcd6fa]/50 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl px-4 py-2 text-xs font-semibold text-ink-soft hover:bg-canvas transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-xl bg-electric px-5 py-2 font-display text-xs font-semibold text-white shadow-xs hover:bg-electric-bright disabled:opacity-50 transition-all cursor-pointer"
              >
                {isSubmitting ? "Saving..." : "Save Profile Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
