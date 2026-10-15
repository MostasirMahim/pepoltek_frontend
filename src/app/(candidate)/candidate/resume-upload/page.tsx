"use client";

import { useState } from "react";
import {
  FileText,
  AlertTriangle,
  CheckCircle,
  Code2,
  Stethoscope,
  ArrowRight,
  ShieldCheck,
} from "@/components/ui/Icons";
import { INITIAL_PARSED_RESUME, ParsedResumePayload } from "@/data/talentDashboardData";

type Sector = "technology" | "healthcare";

export default function CandidateResumeUploadPage() {
  const [sector, setSector] = useState<Sector>("technology");
  const [file, setFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [parsedData, setParsedData] = useState<ParsedResumePayload>(INITIAL_PARSED_RESUME);
  const [submitted, setSubmitted] = useState(false);

  // Missing fields tracking
  const [governmentDocUploaded, setGovernmentDocUploaded] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setIsParsing(true);
      setSubmitted(false);

      // Simulate AI Parsing extraction
      setTimeout(() => {
        setIsParsing(false);
        if (sector === "technology") {
          setParsedData({
            ...INITIAL_PARSED_RESUME,
            sector: "technology",
            fullName: "Alex Morgan",
            email: "alex.morgan@engineer.com",
            phone: "+1 (415) 890-2341",
            primaryDomain: "Full Stack Systems & Real-Time Data Pipelines",
            experienceLevel: "Lead / Architect",
            skills: "Next.js 15, TypeScript, Node.js, Go, Redis, Kafka, Docker, Kubernetes, PostgreSQL",
            visaStatus: "US Citizen",
            hourlyExpectation: "$95 to $110 / hr",
            extractedYears: 9,
            missingFields: ["Right-to-Work or Government ID Attachment"],
            warnings: ["Provide your GitHub URL to increase technical vetting score to Tier 1."],
          });
        } else {
          setParsedData({
            fullName: "Dr. Rachel Higgins",
            email: "rachel.higgins@clinical.co.uk",
            phone: "+44 7922 654321",
            sector: "healthcare",
            primaryDomain: "Critical Care / ICU Clinical Specialist",
            experienceLevel: "Department Lead / Director",
            skills: "Critical Care, NHS Band 8, Clinical Governance, EHR Interoperability, FHIR",
            visaStatus: "UK Citizen",
            clinicalRegNumber: "GMC-7492019",
            hourlyExpectation: "£85 to £100 / hr",
            extractedYears: 12,
            missingFields: ["GMC Annual Practicing Certificate Verification Attachment"],
            warnings: ["Verify hospital trust references to unlock direct placement status."],
          });
        }
      }, 900);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-electric/30 bg-electric/10 px-3 py-0.5 text-[11px] font-mono font-semibold text-electric uppercase tracking-widest">
          <span>AI Parsing Engine v3.2</span>
        </div>
        <h1 className="mt-2 font-display text-2xl sm:text-3xl font-bold tracking-tight text-ink">
          CV Intake and AI Resume Extraction
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-ink-soft max-w-2xl">
          Upload your CV in PDF, DOCX, or RTF format. Our AI extraction model will parse your experience, stack, and certifications with soft yellow missing field treatment.
        </p>
      </div>

      {submitted && (
        <div className="rounded-3xl border border-signal/40 bg-gradient-to-br from-signal/10 via-canvas/40 to-white p-6 shadow-md space-y-3 animate-in fade-in-0 duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-signal text-white shrink-0 shadow-xs">
                <CheckCircle size={24} />
              </div>
              <div>
                <div className="font-display text-base font-bold text-ink">
                  Profile Telemetry Successfully Ingested & Synced
                </div>
                <div className="text-xs text-ink-soft">
                  Missing fields resolved. Live telemetry updated across all client matching pipelines.
                </div>
              </div>
            </div>

            <a
              href="/candidate/dashboard"
              className="inline-flex items-center gap-1.5 rounded-xl bg-ink px-4 py-2 font-display text-xs font-bold text-white hover:bg-electric transition-colors shadow-xs"
            >
              <span>View Dashboard Telemetry</span>
              <ArrowRight size={14} />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-signal/20 text-xs">
            <div className="rounded-xl bg-white p-3 border border-[#bcd6fa]/50">
              <span className="text-[10px] text-mist uppercase font-semibold block">Readiness Index</span>
              <div className="font-display text-lg font-bold text-signal">
                96% <span className="text-xs font-semibold text-signal">(+8% Boosted)</span>
              </div>
            </div>
            <div className="rounded-xl bg-white p-3 border border-[#bcd6fa]/50">
              <span className="text-[10px] text-mist uppercase font-semibold block">ATS Score</span>
              <div className="font-display text-lg font-bold text-ink">99% Verified</div>
            </div>
            <div className="rounded-xl bg-white p-3 border border-[#bcd6fa]/50">
              <span className="text-[10px] text-mist uppercase font-semibold block">Vetting Bracket</span>
              <div className="font-display text-lg font-bold text-electric">Tier 1 Elite</div>
            </div>
          </div>
        </div>
      )}

      {/* Step 1: Sector Track Selection */}
      <div className="rounded-3xl border border-[#bcd6fa] bg-white p-6 sm:p-7 shadow-xs space-y-4">
        <h2 className="font-display text-base font-bold text-ink">1. Choose Specialization Track</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setSector("technology")}
            className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
              sector === "technology"
                ? "border-electric bg-electric/5 ring-2 ring-electric/20 text-ink"
                : "border-[#bcd6fa]/70 bg-canvas/30 text-ink-soft hover:bg-canvas"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-electric/10 text-electric">
                  <Code2 size={18} />
                </div>
                <span className="font-display text-sm font-bold text-ink">Software & SDLC Pods</span>
              </div>
              <span className="font-mono text-xs font-bold text-electric">ENGINEERING</span>
            </div>
            <p className="mt-2 text-xs text-ink-soft leading-relaxed">
              Frontend, Backend, DevOps, Kubernetes, AI/MLOps, System Architecture, Distributed Messaging.
            </p>
          </button>

          <button
            type="button"
            onClick={() => setSector("healthcare")}
            className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
              sector === "healthcare"
                ? "border-electric bg-electric/5 ring-2 ring-electric/20 text-ink"
                : "border-[#bcd6fa]/70 bg-canvas/30 text-ink-soft hover:bg-canvas"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-signal/10 text-signal">
                  <Stethoscope size={18} />
                </div>
                <span className="font-display text-sm font-bold text-ink">Clinical & Healthcare Practice</span>
              </div>
              <span className="font-mono text-xs font-bold text-signal">CLINICAL</span>
            </div>
            <p className="mt-2 text-xs text-ink-soft leading-relaxed">
              Physicians, ICU and Emergency Registered Nurses, Health-Tech Engineers, EHR/EMR Interoperability.
            </p>
          </button>
        </div>
      </div>

      {/* Step 2: Upload Area */}
      <div className="rounded-3xl border-2 border-dashed border-[#bcd6fa] bg-white p-8 sm:p-10 text-center shadow-xs">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-electric/10 text-electric">
          <FileText size={26} />
        </div>
        <h3 className="font-display text-lg font-bold text-ink">Drag and drop your candidate CV</h3>
        <p className="mt-1 text-xs text-ink-soft">
          Supported file formats: <strong className="font-mono text-ink">PDF, DOCX, RTF</strong> (Up to 15MB)
        </p>

        <label className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-ink px-6 py-3 font-display text-xs sm:text-sm font-semibold text-white shadow-xs hover:bg-electric transition-colors cursor-pointer">
          <FileText size={16} />
          <span>Select Document from Computer</span>
          <input
            type="file"
            accept=".pdf,.docx,.rtf"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>

        {file && (
          <div className="mt-4 inline-flex items-center gap-2.5 rounded-xl bg-canvas px-3.5 py-1.5 font-mono text-xs font-semibold text-ink border border-[#bcd6fa]/60">
            <FileText size={14} className="text-electric" />
            <span>{file.name}</span>
            <span className="text-mist">({(file.size / 1024).toFixed(1)} KB)</span>
          </div>
        )}

        {isParsing && (
          <div className="mt-4 flex items-center justify-center gap-2 text-xs font-mono text-electric">
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-electric border-t-transparent" />
            <span>AI Parser extracting entities, tech stack, and clinical credentials...</span>
          </div>
        )}
      </div>

      {/* Step 3: Parsed Data Review Form with soft yellow missing field visual indicator (SRS FR-070) */}
      <form onSubmit={handleFormSubmit} className="rounded-3xl border border-[#bcd6fa] bg-white p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#bcd6fa]/40 pb-4">
          <div>
            <h2 className="font-display text-lg font-bold text-ink">2. Review and Refine Extracted Data</h2>
            <p className="text-xs text-ink-soft">
              Verify your extracted telemetry details. Any missing fields are highlighted in soft yellow for inline correction.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-xl bg-amber-50 border border-amber-300/80 px-3 py-1.5 font-mono text-[11px] text-amber-900 shadow-2xs">
            <AlertTriangle size={14} className="text-amber-600" />
            <span>Soft Yellow = Action Required</span>
          </div>
        </div>

        {/* Missing Document Alert if not yet verified */}
        {!governmentDocUploaded && parsedData.missingFields.length > 0 && (
          <div className="rounded-2xl border border-amber-300 bg-amber-50/80 p-4 text-xs text-amber-900 space-y-2">
            <div className="font-display font-bold flex items-center gap-2 text-amber-950">
              <AlertTriangle size={15} className="text-amber-600" />
              <span>Incomplete Field Detected by AI Parser (SRS FR-070)</span>
            </div>
            <p className="leading-relaxed">
              {parsedData.missingFields[0]}. Please confirm your eligibility below or upload the supporting document to complete priority vetting.
            </p>
            <button
              type="button"
              onClick={() => setGovernmentDocUploaded(true)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-amber-600 px-3 py-1.5 font-display text-[11px] font-bold text-white hover:bg-amber-700 transition-colors cursor-pointer"
            >
              <span>Attach Verification Document Now</span>
              <ArrowRight size={12} />
            </button>
          </div>
        )}

        {governmentDocUploaded && (
          <div className="rounded-2xl border border-signal/40 bg-signal/10 p-3.5 text-xs text-signal flex items-center gap-2">
            <ShieldCheck size={16} />
            <span className="font-semibold">Verification document successfully attached. All required fields satisfied.</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
          <div>
            <label className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-ink-soft mb-1.5">
              Full Legal Name
            </label>
            <input
              type="text"
              required
              value={parsedData.fullName}
              onChange={(e) => setParsedData({ ...parsedData, fullName: e.target.value })}
              className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/30 p-3 text-sm text-ink focus:border-electric focus:bg-white focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-ink-soft mb-1.5">
              Work Email Address
            </label>
            <input
              type="email"
              required
              value={parsedData.email}
              onChange={(e) => setParsedData({ ...parsedData, email: e.target.value })}
              className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/30 p-3 text-sm text-ink focus:border-electric focus:bg-white focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-ink-soft mb-1.5">
              Phone Number
            </label>
            <input
              type="text"
              required
              value={parsedData.phone}
              onChange={(e) => setParsedData({ ...parsedData, phone: e.target.value })}
              className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/30 p-3 text-sm text-ink focus:border-electric focus:bg-white focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-ink-soft mb-1.5">
              Experience Level
            </label>
            <input
              type="text"
              required
              value={parsedData.experienceLevel}
              onChange={(e) => setParsedData({ ...parsedData, experienceLevel: e.target.value })}
              className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/30 p-3 text-sm text-ink focus:border-electric focus:bg-white focus:outline-hidden"
            />
          </div>

          {/* Missing Field Example: Soft Yellow Amber Styling */}
          <div className={`sm:col-span-2 rounded-2xl p-4 transition-all ${
            !governmentDocUploaded
              ? "border border-amber-400 bg-amber-50/50"
              : "border border-[#bcd6fa] bg-canvas/20"
          }`}>
            <label className="block font-mono text-[11px] font-bold uppercase tracking-wider text-amber-950 mb-1">
              Right to Work & Visa Authorization Status
            </label>
            <input
              type="text"
              required
              value={parsedData.visaStatus}
              onChange={(e) => setParsedData({ ...parsedData, visaStatus: e.target.value })}
              className="w-full rounded-xl border border-[#bcd6fa] bg-white p-3 text-sm text-ink focus:border-electric focus:outline-hidden"
            />
            {!governmentDocUploaded && (
              <p className="mt-1.5 text-[11px] text-amber-800 font-medium">
                Attention: Supporting Right-to-Work documentation must be uploaded prior to final deployment sprint.
              </p>
            )}
          </div>

          <div className="sm:col-span-2">
            <label className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-ink-soft mb-1.5">
              Extracted Primary Skills & Tech Stack
            </label>
            <textarea
              rows={3}
              required
              value={parsedData.skills}
              onChange={(e) => setParsedData({ ...parsedData, skills: e.target.value })}
              className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/30 p-3 text-sm text-ink focus:border-electric focus:bg-white focus:outline-hidden leading-relaxed"
            />
          </div>

          <div>
            <label className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-ink-soft mb-1.5">
              Desired Hourly Rate / Salary Expectation
            </label>
            <input
              type="text"
              required
              value={parsedData.hourlyExpectation}
              onChange={(e) => setParsedData({ ...parsedData, hourlyExpectation: e.target.value })}
              className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/30 p-3 text-sm text-ink focus:border-electric focus:bg-white focus:outline-hidden font-medium"
            />
          </div>

          <div>
            <label className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-ink-soft mb-1.5">
              Primary Domain
            </label>
            <input
              type="text"
              required
              value={parsedData.primaryDomain}
              onChange={(e) => setParsedData({ ...parsedData, primaryDomain: e.target.value })}
              className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/30 p-3 text-sm text-ink focus:border-electric focus:bg-white focus:outline-hidden font-medium"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-[#bcd6fa]/40 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-ink-soft">
            Changes will immediately refresh your match scores in the Reverse Search engine.
          </span>
          <button
            type="submit"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-ink px-7 py-3 font-display text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-electric transition-all cursor-pointer"
          >
            <span>Save & Update Profile Telemetry</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </form>
    </div>
  );
}
