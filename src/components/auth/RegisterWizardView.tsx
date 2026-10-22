"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowRight,
  CheckCircle,
  FileText,
  ShieldCheck,
  Zap,
  Users,
  Clock,
  Award,
  Compass,
} from "@/components/ui/Icons";
import {
  INTAKE_SECTORS,
  INTAKE_DOMAINS,
  INTAKE_SKILLS,
  INTAKE_SENIORITIES,
  INTAKE_WORK_AUTH,
  INTAKE_ENGAGEMENT_PREFS,
  getDomainsForSector,
  getSkillsForSector,
  getSenioritiesForSector,
} from "@/data/intakeOptions";
import { registerAction } from "@/actions/auth.actions";

type SectorCode = "technology" | "healthcare";

export function RegisterWizardView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Stepper state: 1 to 5
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Form State
  const [sector, setSector] = useState<SectorCode>("technology");
  const [domainId, setDomainId] = useState<string>("dom-tech-fullstack");
  const [seniorityId, setSeniorityId] = useState<string>("lvl-tech-senior");

  // Skills & Comp
  const [selectedSkillIds, setSelectedSkillIds] = useState<string[]>([
    "sk-react",
    "sk-nextjs",
    "sk-typescript",
    "sk-nodejs",
  ]);
  const [skillSearchQuery, setSkillSearchQuery] = useState("");
  const [workAuthId, setWorkAuthId] = useState<string>("auth-us-citizen");
  const [engagementIds, setEngagementIds] = useState<string[]>(["eng-w2", "eng-c2c"]);
  const [compMin, setCompMin] = useState<string>("85");
  const [compMax, setCompMax] = useState<string>("115");
  const [compType, setCompType] = useState<"hourly" | "annual">("hourly");
  const [timezone, setTimezone] = useState<string>("EST (UTC-5)");

  // Documents & Credentials
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  // Healthcare license fields
  const [licenseType, setLicenseType] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [licenseJurisdiction, setLicenseJurisdiction] = useState("");
  const [licenseExpiry, setLicenseExpiry] = useState("");

  // Account details
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [referralCode, setReferralCode] = useState("");

  // Three explicit legal consents
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreeDataProcessing, setAgreeDataProcessing] = useState(false);

  // Validation & Submission
  const [attemptedStepNext, setAttemptedStepNext] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Auto-fill referral code from query params
  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) {
      setReferralCode(ref.toUpperCase());
    }
  }, [searchParams]);

  // Handle Sector Change (re-sync defaults)
  const handleSectorSelect = (code: SectorCode) => {
    setSector(code);
    if (code === "technology") {
      setDomainId("dom-tech-fullstack");
      setSeniorityId("lvl-tech-senior");
      setSelectedSkillIds(["sk-react", "sk-nextjs", "sk-typescript", "sk-nodejs"]);
    } else {
      setDomainId("dom-health-nursing-icu");
      setSeniorityId("lvl-health-specialist");
      setSelectedSkillIds(["sk-nmc-reg", "sk-icu-critical", "sk-bls-acls"]);
    }
  };

  const toggleSkill = (skillId: string) => {
    if (selectedSkillIds.includes(skillId)) {
      setSelectedSkillIds(selectedSkillIds.filter((id) => id !== skillId));
    } else {
      setSelectedSkillIds([...selectedSkillIds, skillId]);
    }
  };

  const toggleEngagement = (id: string) => {
    if (engagementIds.includes(id)) {
      if (engagementIds.length > 1) {
        setEngagementIds(engagementIds.filter((item) => item !== id));
      }
    } else {
      setEngagementIds([...engagementIds, id]);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validExtensions = [".pdf", ".docx", ".rtf"];
      const isExtValid = validExtensions.some((ext) => file.name.toLowerCase().endsWith(ext));
      if (isExtValid) {
        setUploadedFile(file);
      } else {
        alert("Please upload a PDF, DOCX, or RTF document.");
      }
    }
  };

  // Step Validation Check
  const validateCurrentStep = (): boolean => {
    setAttemptedStepNext(true);
    setErrorMessage(null);

    if (currentStep === 1) {
      return true;
    }
    if (currentStep === 2) {
      return Boolean(domainId && seniorityId);
    }
    if (currentStep === 3) {
      if (selectedSkillIds.length === 0) {
        setErrorMessage("Please select at least one primary skill or clinical specialty.");
        return false;
      }
      return true;
    }
    if (currentStep === 4) {
      if (!uploadedFile) {
        setErrorMessage("Please upload your CV / Resume file to continue.");
        return false;
      }
      if (sector === "healthcare" && (!licenseNumber || !licenseJurisdiction)) {
        setErrorMessage("Please supply your clinical license number and jurisdiction.");
        return false;
      }
      return true;
    }
    return true;
  };

  const handleNextStep = () => {
    if (validateCurrentStep()) {
      setAttemptedStepNext(false);
      setCurrentStep((prev) => Math.min(prev + 1, 5) as any);
    }
  };

  const handlePrevStep = () => {
    setErrorMessage(null);
    setAttemptedStepNext(false);
    setCurrentStep((prev) => Math.max(prev - 1, 1) as any);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAttemptedStepNext(true);
    setErrorMessage(null);

    if (!fullName || !email || !password) {
      setErrorMessage("Please fill in all mandatory account fields.");
      return;
    }

    if (!agreeTerms || !agreePrivacy || !agreeDataProcessing) {
      setErrorMessage("You must accept all three required legal and data processing consents.");
      return;
    }

    setLoading(true);

    const res = await registerAction({
      email,
      password,
      full_name: fullName,
      role: "candidate",
      sector,
      domain: domainId,
      level: seniorityId,
      work_auth: workAuthId,
    });

    setLoading(false);

    if (res.success) {
      router.push(`/verify?email=${encodeURIComponent(email)}`);
    } else {
      setErrorMessage(
        res.error?.message || "Failed to create account. Please verify your details."
      );
    }
  };

  const filteredSkills = getSkillsForSector(sector).filter((s) =>
    s.label.toLowerCase().includes(skillSearchQuery.toLowerCase())
  );

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="rounded-3xl border border-[#bcd6fa] bg-white/95 p-6 sm:p-10 shadow-[0_20px_60px_-15px_rgba(10,20,40,0.08)] backdrop-blur-md">
        {/* Top Progress & Stepper Bar */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-electric/30 bg-electric/10 px-3 py-0.5 text-[11px] font-mono font-semibold text-electric uppercase tracking-widest">
                <span>ONBOARDING STAGE {currentStep} OF 5</span>
              </div>
              <h1 className="mt-1 font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-ink">
                Candidate Intake & Talent Profile
              </h1>
            </div>

            <div className="font-mono text-xs text-mist">
              {currentStep === 1 && "Sector & Track"}
              {currentStep === 2 && "Domain & Experience"}
              {currentStep === 3 && "Skills & Compensation"}
              {currentStep === 4 && "Credentials & Documents"}
              {currentStep === 5 && "Account Security & Consents"}
            </div>
          </div>

          {/* Stepper Dots & Line */}
          <div className="relative">
            <div className="h-2 w-full rounded-full bg-canvas overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-electric to-electric-bright transition-all duration-300"
                style={{ width: `${(currentStep / 5) * 100}%` }}
              />
            </div>
            <div className="mt-2.5 flex justify-between text-[11px] font-mono text-ink-soft">
              <span className={currentStep >= 1 ? "font-bold text-electric" : "text-mist"}>
                1. Sector
              </span>
              <span className={currentStep >= 2 ? "font-bold text-electric" : "text-mist"}>
                2. Domain
              </span>
              <span className={currentStep >= 3 ? "font-bold text-electric" : "text-mist"}>
                3. Skills
              </span>
              <span className={currentStep >= 4 ? "font-bold text-electric" : "text-mist"}>
                4. Credentials
              </span>
              <span className={currentStep === 5 ? "font-bold text-electric" : "text-mist"}>
                5. Account
              </span>
            </div>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-6 rounded-2xl border border-rose-300 bg-rose-50 p-4 text-xs font-semibold text-rose-700 flex items-center justify-between">
            <span>{errorMessage}</span>
            <button onClick={() => setErrorMessage(null)} className="font-bold ml-2">
              ✕
            </button>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* STAGE 1: SECTOR SELECTION WITH 3D GLASS TRANSPARENT BADGES        */}
        {/* ------------------------------------------------------------------ */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-lg font-bold text-ink">
                Select Your Primary Professional Sector
              </h2>
              <p className="text-xs sm:text-sm text-ink-soft mt-0.5">
                Choose your field to load domain-specific interview pipelines, benchmarks, and sprint pods.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {INTAKE_SECTORS.map((sec) => {
                const isSelected = sector === sec.code;
                const badgeImage =
                  sec.code === "technology"
                    ? "/assets/auth/tech-sector.png"
                    : "/assets/auth/health-sector.png";

                return (
                  <div
                    key={sec.id}
                    onClick={() => handleSectorSelect(sec.code)}
                    className={`relative rounded-3xl p-6 border-2 transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "border-electric bg-gradient-to-br from-white via-[#f3f8fe] to-white shadow-md ring-2 ring-electric/20"
                        : "border-[#bcd6fa]/60 bg-white hover:border-electric/50 hover:bg-[#fafcff]"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span
                          className={`rounded-full px-3 py-0.5 text-[11px] font-mono font-bold ${
                            isSelected
                              ? "bg-electric text-white"
                              : "bg-canvas text-ink-soft border border-[#bcd6fa]"
                          }`}
                        >
                          {sec.badge}
                        </span>

                        <div className="relative h-16 w-16">
                          <Image
                            src={badgeImage}
                            alt={sec.label}
                            fill
                            className="object-contain"
                            priority
                          />
                        </div>
                      </div>

                      <h3 className="font-display text-lg font-bold text-ink">{sec.label}</h3>
                      <div className="font-mono text-xs text-electric font-semibold mt-1">
                        {sec.headline}
                      </div>
                      <p className="text-xs text-ink-soft mt-2 leading-relaxed">
                        {sec.description}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-[#bcd6fa]/40 flex items-center justify-between text-xs font-semibold">
                      <span className={isSelected ? "text-electric" : "text-mist"}>
                        {isSelected ? "✓ Track Selected" : "Click to Select Track"}
                      </span>
                      <span className="font-mono text-[11px] text-ink-soft">7-Day Deployment</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* STAGE 2: DOMAIN & SENIORITY SELECTION                             */}
        {/* ------------------------------------------------------------------ */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-lg font-bold text-ink">
                Domain Specialization & Seniority
              </h2>
              <p className="text-xs sm:text-sm text-ink-soft mt-0.5">
                Define your exact area of focus and tier bracket in {sector === "technology" ? "Technology" : "Healthcare"}.
              </p>
            </div>

            {/* Domains List */}
            <div>
              <label className="block font-mono text-xs font-semibold uppercase tracking-wider text-ink-soft mb-2">
                Specialization Domain
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {getDomainsForSector(sector).map((dom) => {
                  const isSelected = domainId === dom.id;
                  return (
                    <div
                      key={dom.id}
                      onClick={() => setDomainId(dom.id)}
                      className={`rounded-2xl border p-4 cursor-pointer transition-all ${
                        isSelected
                          ? "border-electric bg-[#f2f7fe] text-ink font-semibold shadow-xs"
                          : "border-[#bcd6fa]/70 bg-white hover:border-electric/50 text-ink-soft"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm font-bold text-ink">{dom.label}</span>
                        {isSelected && <CheckCircle size={16} className="text-electric" />}
                      </div>
                      {dom.description && (
                        <p className="mt-1 text-[11px] text-ink-soft leading-snug">
                          {dom.description}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Seniority */}
            <div>
              <label className="block font-mono text-xs font-semibold uppercase tracking-wider text-ink-soft mb-2">
                Experience Level & Seniority Tier
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {getSenioritiesForSector(sector).map((sen) => {
                  const isSelected = seniorityId === sen.id;
                  return (
                    <div
                      key={sen.id}
                      onClick={() => setSeniorityId(sen.id)}
                      className={`rounded-2xl border p-4 cursor-pointer transition-all ${
                        isSelected
                          ? "border-electric bg-[#f2f7fe] text-ink font-semibold shadow-xs"
                          : "border-[#bcd6fa]/70 bg-white hover:border-electric/50 text-ink-soft"
                      }`}
                    >
                      <div className="text-xs font-mono text-electric font-bold">{sen.yearsRange}</div>
                      <div className="font-display text-xs sm:text-sm font-bold text-ink mt-1">
                        {sen.label}
                      </div>
                      {sen.description && (
                        <p className="mt-1 text-[11px] text-ink-soft leading-snug">
                          {sen.description}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* STAGE 3: SKILLS, COMPENSATION & WORK AUTHORIZATION                 */}
        {/* ------------------------------------------------------------------ */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-lg font-bold text-ink">
                Verified Skills, Rate & Work Authorization
              </h2>
              <p className="text-xs sm:text-sm text-ink-soft mt-0.5">
                Highlight your verified tech stack or clinical credentials to power AI pod matching.
              </p>
            </div>

            {/* Skills selection */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="font-mono text-xs font-semibold uppercase tracking-wider text-ink-soft">
                  Select Skills & Specialties ({selectedSkillIds.length} selected)
                </label>
                <span className="text-xs text-mist font-mono">Min 1 required</span>
              </div>

              <input
                type="text"
                value={skillSearchQuery}
                onChange={(e) => setSkillSearchQuery(e.target.value)}
                placeholder="Filter skills (e.g. React, Go, Next.js, ICU, Epic)..."
                className="w-full rounded-xl border border-[#bcd6fa] bg-canvas px-4 py-2 text-xs text-ink placeholder:text-mist focus:border-electric focus:bg-white outline-hidden mb-3"
              />

              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1">
                {filteredSkills.map((sk) => {
                  const isSelected = selectedSkillIds.includes(sk.id);
                  return (
                    <button
                      key={sk.id}
                      type="button"
                      onClick={() => toggleSkill(sk.id)}
                      className={`rounded-xl px-3 py-1.5 text-xs font-mono transition-all cursor-pointer ${
                        isSelected
                          ? "bg-ink text-white font-bold shadow-xs ring-1 ring-electric"
                          : "bg-white border border-[#bcd6fa] text-ink-soft hover:border-electric"
                      }`}
                    >
                      {isSelected ? "✓ " : "+ "}
                      {sk.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Compensation Expectations & Timezone */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block font-mono text-xs font-semibold uppercase tracking-wider text-ink-soft mb-1">
                  Min Expected Rate ($/hr)
                </label>
                <input
                  type="number"
                  value={compMin}
                  onChange={(e) => setCompMin(e.target.value)}
                  className="w-full rounded-xl border border-[#bcd6fa] bg-canvas px-3.5 py-2 text-xs font-mono text-ink focus:border-electric focus:bg-white outline-hidden"
                />
              </div>

              <div>
                <label className="block font-mono text-xs font-semibold uppercase tracking-wider text-ink-soft mb-1">
                  Target Rate ($/hr)
                </label>
                <input
                  type="number"
                  value={compMax}
                  onChange={(e) => setCompMax(e.target.value)}
                  className="w-full rounded-xl border border-[#bcd6fa] bg-canvas px-3.5 py-2 text-xs font-mono text-ink focus:border-electric focus:bg-white outline-hidden"
                />
              </div>

              <div>
                <label className="block font-mono text-xs font-semibold uppercase tracking-wider text-ink-soft mb-1">
                  Primary Timezone
                </label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full rounded-xl border border-[#bcd6fa] bg-canvas px-3 py-2 text-xs text-ink focus:border-electric focus:bg-white outline-hidden"
                >
                  <option>EST (UTC-5)</option>
                  <option>CST (UTC-6)</option>
                  <option>PST (UTC-8)</option>
                  <option>BST / GMT (London)</option>
                  <option>CET (Central Europe)</option>
                  <option>IST (India UTC+5:30)</option>
                </select>
              </div>
            </div>

            {/* Work Authorization & Engagement */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block font-mono text-xs font-semibold uppercase tracking-wider text-ink-soft mb-1">
                  Work Authorization Status
                </label>
                <select
                  value={workAuthId}
                  onChange={(e) => setWorkAuthId(e.target.value)}
                  className="w-full rounded-xl border border-[#bcd6fa] bg-canvas px-3.5 py-2 text-xs text-ink focus:border-electric focus:bg-white outline-hidden"
                >
                  {INTAKE_WORK_AUTH.map((auth) => (
                    <option key={auth.id} value={auth.id}>
                      {auth.label} ({auth.region})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-mono text-xs font-semibold uppercase tracking-wider text-ink-soft mb-1">
                  Engagement Models (Multi-select)
                </label>
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {INTAKE_ENGAGEMENT_PREFS.map((eng) => {
                    const isSelected = engagementIds.includes(eng.id);
                    return (
                      <button
                        key={eng.id}
                        type="button"
                        onClick={() => toggleEngagement(eng.id)}
                        className={`rounded-lg px-2.5 py-1 text-[11px] font-mono transition-all cursor-pointer ${
                          isSelected
                            ? "bg-electric text-white font-semibold"
                            : "bg-canvas text-ink-soft border border-[#bcd6fa]/70"
                        }`}
                      >
                        {eng.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* STAGE 4: DOCUMENTS & CREDENTIALS                                   */}
        {/* ------------------------------------------------------------------ */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-lg font-bold text-ink">
                Upload CV / Resume & Professional Credentials
              </h2>
              <p className="text-xs sm:text-sm text-ink-soft mt-0.5">
                Our AI parser will extract your experience, stack benchmarks, and audit clearance.
              </p>
            </div>

            {/* Drag & Drop File Upload */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="rounded-3xl border-2 border-dashed border-[#bcd6fa] bg-canvas/30 p-8 text-center cursor-pointer hover:border-electric hover:bg-[#f6faff] transition-all"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.rtf"
                onChange={handleFileUpload}
                className="hidden"
              />
              <FileText className="mx-auto h-12 w-12 text-electric mb-2" />
              <div className="font-display text-sm font-bold text-ink">
                {uploadedFile ? uploadedFile.name : "Click or drag your CV / Resume here"}
              </div>
              <p className="text-xs text-mist mt-1">
                {uploadedFile
                  ? `Size: ${(uploadedFile.size / 1024 / 1024).toFixed(2)} MB - Ready for AI parser`
                  : "Supports PDF, DOCX, and RTF formats (Max 10MB)"}
              </p>
            </div>

            {/* Sector Specific Credentials */}
            {sector === "technology" ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-ink mb-1">GitHub Profile URL</label>
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/yourhandle"
                    className="w-full rounded-xl border border-[#bcd6fa] bg-canvas px-3.5 py-2 text-xs text-ink focus:border-electric focus:bg-white outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink mb-1">Portfolio / Website</label>
                  <input
                    type="url"
                    value={portfolioUrl}
                    onChange={(e) => setPortfolioUrl(e.target.value)}
                    placeholder="https://yourportfolio.com"
                    className="w-full rounded-xl border border-[#bcd6fa] bg-canvas px-3.5 py-2 text-xs text-ink focus:border-electric focus:bg-white outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink mb-1">LinkedIn Profile</label>
                  <input
                    type="url"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    placeholder="https://linkedin.com/in/handle"
                    className="w-full rounded-xl border border-[#bcd6fa] bg-canvas px-3.5 py-2 text-xs text-ink focus:border-electric focus:bg-white outline-hidden"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4 rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5">
                <div className="text-xs font-bold text-emerald-900 font-display">
                  Healthcare Compliance & Clinical Registration (SRS CAN-04)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-ink mb-1">
                      License Type / Governing Body
                    </label>
                    <input
                      type="text"
                      value={licenseType}
                      onChange={(e) => setLicenseType(e.target.value)}
                      placeholder="e.g. GMC Specialist Register or NMC Band 7"
                      className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3.5 py-2 text-xs text-ink focus:border-electric outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-ink mb-1">
                      License Registration Number
                    </label>
                    <input
                      type="text"
                      value={licenseNumber}
                      onChange={(e) => setLicenseNumber(e.target.value)}
                      placeholder="e.g. 7482910"
                      className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3.5 py-2 text-xs text-ink focus:border-electric outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-ink mb-1">
                      Issuing Jurisdiction (State / Country)
                    </label>
                    <input
                      type="text"
                      value={licenseJurisdiction}
                      onChange={(e) => setLicenseJurisdiction(e.target.value)}
                      placeholder="e.g. United Kingdom (GMC) or California"
                      className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3.5 py-2 text-xs text-ink focus:border-electric outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-ink mb-1">
                      License Expiry Date
                    </label>
                    <input
                      type="date"
                      value={licenseExpiry}
                      onChange={(e) => setLicenseExpiry(e.target.value)}
                      className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3.5 py-2 text-xs text-ink focus:border-electric outline-hidden"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* STAGE 5: ACCOUNT CREDENTIALS & 3 MANDATORY CONSENTS               */}
        {/* ------------------------------------------------------------------ */}
        {currentStep === 5 && (
          <form onSubmit={handleFinalSubmit} className="space-y-6">
            <div>
              <h2 className="font-display text-lg font-bold text-ink">
                Secure Account Credentials & Consent
              </h2>
              <p className="text-xs sm:text-sm text-ink-soft mt-0.5">
                Create your password and review mandatory data processing authorizations.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-ink mb-1">Candidate Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. David Kim"
                  className="w-full rounded-xl border border-[#bcd6fa] bg-canvas px-3.5 py-2 text-xs sm:text-sm text-ink focus:border-electric focus:bg-white outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink mb-1">Candidate Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="david@example.com"
                  className="w-full rounded-xl border border-[#bcd6fa] bg-canvas px-3.5 py-2 text-xs sm:text-sm text-ink focus:border-electric focus:bg-white outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink mb-1">Create Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 8 characters"
                  className="w-full rounded-xl border border-[#bcd6fa] bg-canvas px-3.5 py-2 text-xs sm:text-sm text-ink focus:border-electric focus:bg-white outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink mb-1">
                  Referral Tracking Code (Optional)
                </label>
                <input
                  type="text"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                  placeholder="e.g. PEP-ALEX-9042"
                  className="w-full rounded-xl border border-[#bcd6fa] bg-canvas px-3.5 py-2 text-xs font-mono font-bold text-ink focus:border-electric focus:bg-white outline-hidden"
                />
              </div>
            </div>

            {/* Three Explicit Consents (SRS CAN-07) */}
            <div className="rounded-2xl border border-[#bcd6fa] bg-canvas/40 p-4 space-y-3">
              <div className="font-mono text-[11px] font-bold text-ink uppercase tracking-wider">
                Mandatory Policy & Data Authorizations
              </div>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-[#bcd6fa] text-electric focus:ring-electric"
                />
                <span className="text-xs text-ink-soft">
                  I agree to the <strong className="text-ink">Pepoltek Terms of Service (v2026.1)</strong> and service delivery agreements.
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={agreePrivacy}
                  onChange={(e) => setAgreePrivacy(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-[#bcd6fa] text-electric focus:ring-electric"
                />
                <span className="text-xs text-ink-soft">
                  I agree to the <strong className="text-ink">Privacy Policy</strong> and encrypted PII storage.
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={agreeDataProcessing}
                  onChange={(e) => setAgreeDataProcessing(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-[#bcd6fa] text-electric focus:ring-electric"
                />
                <span className="text-xs text-ink-soft">
                  I consent to automated AI resume extraction, vector embedding, and anonymous matching for client pod shortlists.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-signal py-3.5 font-display text-xs sm:text-sm font-bold text-ink hover:bg-emerald-400 transition-colors cursor-pointer shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <span>{loading ? "Submitting Intake & Creating Account..." : "Complete Intake & Create Account"}</span>
              <ArrowRight size={16} />
            </button>
          </form>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* BOTTOM STEP NAVIGATION STRIP                                       */}
        {/* ------------------------------------------------------------------ */}
        {currentStep < 5 && (
          <div className="mt-8 pt-6 border-t border-[#bcd6fa]/40 flex items-center justify-between">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrevStep}
                className="rounded-xl border border-[#bcd6fa] bg-white px-4 py-2 font-display text-xs font-semibold text-ink-soft hover:text-ink hover:bg-canvas transition-colors"
              >
                ← Back
              </button>
            ) : (
              <div />
            )}

            <button
              type="button"
              onClick={handleNextStep}
              className="inline-flex items-center gap-2 rounded-xl bg-ink px-6 py-2.5 font-display text-xs font-semibold text-white hover:bg-electric transition-colors shadow-xs"
            >
              <span>Continue to Step {currentStep + 1}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
