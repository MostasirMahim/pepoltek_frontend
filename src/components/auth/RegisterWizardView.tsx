"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowRight,
  ChevronDown,
  Eye,
  EyeOff,
  Check,
  UploadCloud,
  FileText,
  AlertCircle,
  X,
} from "lucide-react";
import { getTaxonomiesAction, TaxonomyMatrix } from "@/actions/taxonomy.actions";
import { registerAction } from "@/actions/auth.actions";

type SectorCode = "technology" | "healthcare";

export function RegisterWizardView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Progressive disclosure stages: 1, 2, or 3 unlocked
  const [unlockedStage, setUnlockedStage] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // ---------- STAGE 01: Candidate Information (ZERO auto-selects) ----------
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [sector, setSector] = useState<SectorCode | "">("");
  const [stage1Errors, setStage1Errors] = useState<Record<string, string>>({});

  // ---------- STAGE 02: Professional Details (ZERO auto-selects) ----------
  const [domainId, setDomainId] = useState<string>("");
  const [seniorityId, setSeniorityId] = useState<string>("");
  const [workAuthId, setWorkAuthId] = useState<string>("");
  const [engagementType, setEngagementType] = useState<string>("");
  const [compRate, setCompRate] = useState<string>("");
  const [timezone, setTimezone] = useState<string>("");
  const [selectedSkillIds, setSelectedSkillIds] = useState<string[]>([]);
  const [skillSearchQuery, setSkillSearchQuery] = useState("");
  // Healthcare specific
  const [licenseType, setLicenseType] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [licenseJurisdiction, setLicenseJurisdiction] = useState("");
  const [stage2Errors, setStage2Errors] = useState<Record<string, string>>({});

  // ---------- STAGE 03: Credentials & Account Security ----------
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [referralCode, setReferralCode] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreeDataProcessing, setAgreeDataProcessing] = useState(false);
  const [stage3Errors, setStage3Errors] = useState<Record<string, string>>({});

  // Auto-fill referral code from query params
  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) {
      setReferralCode(ref.toUpperCase());
    }
  }, [searchParams]);

  // Taxonomies loaded directly from Backend
  const [taxonomies, setTaxonomies] = useState<TaxonomyMatrix>({
    sectors: [],
    domains: [],
    skills: [],
    seniorities: [],
    workAuths: [],
    engagements: [],
  });

  useEffect(() => {
    getTaxonomiesAction().then((res) => {
      if (res.success && res.data) {
        setTaxonomies(res.data);
      }
    });
  }, []);

  // When sector changes, reset dependent fields with ZERO auto-selected dummy data
  const handleSectorChange = (newSector: SectorCode | "") => {
    setSector(newSector);
    setDomainId("");
    setSeniorityId("");
    setSelectedSkillIds([]);
    setStage1Errors((prev) => ({ ...prev, sector: "" }));
  };

  const toggleSkill = (id: string) => {
    if (selectedSkillIds.includes(id)) {
      setSelectedSkillIds(selectedSkillIds.filter((s) => s !== id));
    } else {
      setSelectedSkillIds([...selectedSkillIds, id]);
    }
    setStage2Errors((prev) => ({ ...prev, skills: "" }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validExtensions = [".pdf", ".docx", ".rtf"];
      const isExtValid = validExtensions.some((ext) => file.name.toLowerCase().endsWith(ext));
      if (isExtValid) {
        setUploadedFile(file);
        setStage3Errors((prev) => ({ ...prev, resume: "" }));
      } else {
        alert("Please upload a PDF, DOCX, or RTF document.");
      }
    }
  };

  // ---------- STAGE 1 VALIDATION & PROCEED ----------
  const handleStage1Next = () => {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) errs.fullName = "Full name is required.";
    if (!email.trim() || !email.includes("@")) errs.email = "Valid email address is required.";
    if (!phone.trim()) errs.phone = "Phone number is required.";
    if (!location.trim()) errs.location = "Location is required.";
    if (!jobTitle.trim()) errs.jobTitle = "Current title is required.";
    if (!sector) errs.sector = "Please select an industry / sector.";

    setStage1Errors(errs);
    if (Object.keys(errs).length === 0) {
      if (unlockedStage < 2) {
        setUnlockedStage(2);
      }
      setTimeout(() => {
        const el = document.getElementById("stage-02");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 80);
    }
  };

  // ---------- STAGE 2 VALIDATION & PROCEED ----------
  const handleStage2Next = () => {
    const errs: Record<string, string> = {};
    if (!domainId) errs.domain = "Please select your domain track.";
    if (!seniorityId) errs.seniority = "Please select your experience level.";
    if (!workAuthId) errs.workAuth = "Please select work authorization.";
    if (!engagementType) errs.engagementType = "Please select engagement type.";
    if (!timezone) errs.timezone = "Please select your preferred timezone.";
    if (selectedSkillIds.length === 0) errs.skills = "Select at least one skill.";

    if (sector === "healthcare") {
      if (!licenseNumber.trim()) errs.licenseNumber = "License number is required for healthcare.";
      if (!licenseJurisdiction.trim()) errs.licenseJurisdiction = "Jurisdiction is required.";
    }

    setStage2Errors(errs);
    if (Object.keys(errs).length === 0) {
      if (unlockedStage < 3) {
        setUnlockedStage(3);
      }
      setTimeout(() => {
        const el = document.getElementById("stage-03");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 80);
    }
  };

  // ---------- STAGE 3 FINAL SUBMISSION ----------
  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validate Stage 1 fields (even if edited while on Stage 3)
    const s1Errs: Record<string, string> = {};
    if (!fullName.trim()) s1Errs.fullName = "Full name is required.";
    if (!email.trim() || !email.includes("@")) s1Errs.email = "Valid email address is required.";
    if (!phone.trim()) s1Errs.phone = "Phone number is required.";
    if (!location.trim()) s1Errs.location = "Location is required.";
    if (!jobTitle.trim()) s1Errs.jobTitle = "Current title is required.";
    if (!sector) s1Errs.sector = "Please select an industry / sector.";
    setStage1Errors(s1Errs);

    // Validate Stage 2 fields
    const s2Errs: Record<string, string> = {};
    if (!domainId) s2Errs.domain = "Please select your domain track.";
    if (!seniorityId) s2Errs.seniority = "Please select your experience level.";
    if (!workAuthId) s2Errs.workAuth = "Please select work authorization.";
    if (!engagementType) s2Errs.engagementType = "Please select engagement type.";
    if (!timezone) s2Errs.timezone = "Please select preferred timezone.";
    if (selectedSkillIds.length === 0) s2Errs.skills = "Select at least one skill.";
    if (sector === "healthcare") {
      if (!licenseNumber.trim()) s2Errs.licenseNumber = "License number is required for healthcare.";
      if (!licenseJurisdiction.trim()) s2Errs.licenseJurisdiction = "Jurisdiction is required.";
    }
    setStage2Errors(s2Errs);

    // Validate Stage 3 fields
    const s3Errs: Record<string, string> = {};
    if (!uploadedFile) s3Errs.resume = "Please upload your resume / CV file.";
    if (!password || password.length < 4) s3Errs.password = "Password must be at least 4 characters.";
    if (password !== confirmPassword) s3Errs.confirmPassword = "Passwords do not match.";
    if (!agreeTerms || !agreePrivacy || !agreeDataProcessing) {
      s3Errs.consents = "Please accept all three legal agreements to proceed.";
    }
    setStage3Errors(s3Errs);

    if (Object.keys(s1Errs).length > 0) {
      document.getElementById("stage-01")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    if (Object.keys(s2Errs).length > 0) {
      document.getElementById("stage-02")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    if (Object.keys(s3Errs).length > 0) {
      return;
    }

    setLoading(true);

    const res = await registerAction({
      email,
      password,
      full_name: fullName,
      phone,
      location,
      title: jobTitle,
      referral_code: referralCode.trim() || undefined,
      role: "candidate",
      sector,
      domain: domainId,
      level: seniorityId,
      work_auth: workAuthId,
      engagement: engagementType,
      target_comp: compRate || undefined,
      timezone,
      skills: selectedSkillIds,
      linkedin_url: linkedinUrl || undefined,
      portfolio_url: portfolioUrl || undefined,
      additional_notes: additionalNotes || undefined,
      consents: [
        { policy_type: "terms_of_service", policy_version: "v2026.1", agreed: agreeTerms },
        { policy_type: "privacy_policy", policy_version: "v2026.1", agreed: agreePrivacy },
        { policy_type: "data_processing", policy_version: "v2026.1", agreed: agreeDataProcessing },
      ],
    });

    setLoading(false);

    if (res.success) {
      router.push(`/verify?email=${encodeURIComponent(email)}`);
    } else {
      if (res.error?.fields) {
        const fieldDetails = Object.entries(res.error.fields)
          .map(([k, msgs]) => `${k.replace("_", " ").toUpperCase()}: ${msgs.join(" ")}`)
          .join(" • ");
        setErrorMessage(fieldDetails || res.error.message || "Failed to create account.");
      } else {
        setErrorMessage(
          res.error?.message || "Failed to create account. Please verify your details."
        );
      }
    }
  };

  const filteredSkills = taxonomies.skills
    .filter((s) => !sector || s.sectorId === sector)
    .filter((s) => s.label.toLowerCase().includes(skillSearchQuery.toLowerCase()));

  const domainsForSector = taxonomies.domains.filter((d) => !sector || d.sectorId === sector);
  const senioritiesForSector = taxonomies.seniorities.filter((l) => !sector || l.sectorId === sector);

  return (
    <div className="min-h-screen w-full bg-white text-slate-800 flex flex-col justify-between selection:bg-blue-500 selection:text-white">
      {/* 1. Static Clean Header */}
      <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="inline-flex items-center transition-opacity hover:opacity-90">
              <Image
                src="/assets/pepoltek/black_logo.png"
                alt="PEPOLTek Limited"
                width={130}
                height={32}
                className="h-7 w-auto object-contain"
                priority
              />
            </Link>
            <span className="text-slate-300 font-light hidden sm:inline">|</span>
            <span className="text-xs sm:text-[13px] text-slate-500 font-normal tracking-wide hidden sm:inline">
              Global Talent. Strategic Growth.
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 text-xs">
            <span className="text-slate-500 hidden sm:inline">Already registered?</span>
            <Link
              href="/login"
              className="font-semibold text-blue-600 hover:text-blue-700 hover:underline px-2.5 py-1.5 rounded-md hover:bg-blue-50 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Main Enterprise Grade Form Flow (Zero card bg, zero dummy auto-selects) */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        
        {/* Global Error Banner if any */}
        {errorMessage && (
          <div className="mb-8 rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-800 font-medium flex items-start gap-2.5 shadow-xs">
            <AlertCircle size={16} className="text-rose-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed flex-1">{errorMessage}</div>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="text-rose-500 hover:text-rose-700 cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* ============================================================== */}
        {/* STAGE 01: Candidate Information                               */}
        {/* ============================================================== */}
        <section
          id="stage-01"
          className="pb-10 sm:pb-14 transition-all"
        >
          {/* Stage Header */}
          <div className="mb-6">
            <span className="text-xs sm:text-sm font-bold text-blue-600 font-mono tracking-wider">
              01
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1 font-display">
              Candidate Information
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
              Tell us about your background and contact info so we can match you with the right opportunities.
            </p>
          </div>

          {/* Double Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Full Name <span className="text-blue-600">*</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter full name"
                className={`w-full rounded-lg border ${
                  stage1Errors.fullName ? "border-rose-400 bg-rose-50/20" : "border-slate-200"
                } bg-white px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all`}
              />
              {stage1Errors.fullName && (
                <p className="text-[11px] text-rose-600 mt-1">{stage1Errors.fullName}</p>
              )}
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email Address <span className="text-blue-600">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                className={`w-full rounded-lg border ${
                  stage1Errors.email ? "border-rose-400 bg-rose-50/20" : "border-slate-200"
                } bg-white px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all`}
              />
              {stage1Errors.email && (
                <p className="text-[11px] text-rose-600 mt-1">{stage1Errors.email}</p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Phone Number <span className="text-blue-600">*</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (___) ___-____"
                className={`w-full rounded-lg border ${
                  stage1Errors.phone ? "border-rose-400 bg-rose-50/20" : "border-slate-200"
                } bg-white px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all`}
              />
              {stage1Errors.phone && (
                <p className="text-[11px] text-rose-600 mt-1">{stage1Errors.phone}</p>
              )}
            </div>

            {/* Current Job Title / Headline */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Current Job Title <span className="text-blue-600">*</span>
              </label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Senior Full-Stack Engineer"
                className={`w-full rounded-lg border ${
                  stage1Errors.jobTitle ? "border-rose-400 bg-rose-50/20" : "border-slate-200"
                } bg-white px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all`}
              />
              {stage1Errors.jobTitle && (
                <p className="text-[11px] text-rose-600 mt-1">{stage1Errors.jobTitle}</p>
              )}
            </div>

            {/* Industry / Sector Selector (No auto-select) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Primary Industry / Sector <span className="text-blue-600">*</span>
              </label>
              <div className="relative">
                <select
                  value={sector}
                  onChange={(e) => handleSectorChange(e.target.value as SectorCode | "")}
                  className={`w-full appearance-none rounded-lg border ${
                    stage1Errors.sector ? "border-rose-400 bg-rose-50/20" : "border-slate-200"
                  } bg-white px-3.5 py-2.5 pr-10 text-xs sm:text-sm ${
                    !sector ? "text-slate-400" : "text-slate-800"
                  } focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all cursor-pointer`}
                >
                  <option value="" disabled>
                    Select industry sector
                  </option>
                  {taxonomies.sectors.length > 0 ? (
                    taxonomies.sectors.map((s) => (
                      <option key={s.id || s.code} value={s.code} className="text-slate-800">
                        {s.label}
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="technology" className="text-slate-800">
                        Technology &amp; Software Engineering
                      </option>
                      <option value="healthcare" className="text-slate-800">
                        Healthcare &amp; Clinical Specialists
                      </option>
                    </>
                  )}
                </select>
                <ChevronDown
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  size={16}
                />
              </div>
              {stage1Errors.sector && (
                <p className="text-[11px] text-rose-600 mt-1">{stage1Errors.sector}</p>
              )}
            </div>

            {/* Current Location / Country */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Current Location (City, Country) <span className="text-blue-600">*</span>
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. New York, USA or London, UK"
                className={`w-full rounded-lg border ${
                  stage1Errors.location ? "border-rose-400 bg-rose-50/20" : "border-slate-200"
                } bg-white px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all`}
              />
              {stage1Errors.location && (
                <p className="text-[11px] text-rose-600 mt-1">{stage1Errors.location}</p>
              )}
            </div>
          </div>

          {/* Stage 01 Next Button (ONLY visible when Stage 1 is the active latest stage) */}
          {unlockedStage === 1 && (
            <div className="mt-8 flex items-center justify-end">
              <button
                type="button"
                onClick={handleStage1Next}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#e8f2ff] hover:bg-blue-600 hover:text-white text-blue-600 text-xs sm:text-sm font-semibold transition-all shadow-xs cursor-pointer active:scale-[0.99]"
              >
                <span>Next</span>
                <ArrowRight size={14} />
              </button>
            </div>
          )}
        </section>

        {/* ============================================================== */}
        {/* STAGE 02: Contact & Admin Details / Professional Profile      */}
        {/* ============================================================== */}
        {unlockedStage >= 2 && (
          <section
            id="stage-02"
            className="pt-10 sm:pt-14 pb-10 sm:pb-14 border-t border-slate-100 transition-all animate-in fade-in duration-300"
          >
            {/* Stage Header */}
            <div className="mb-6">
              <span className="text-xs sm:text-sm font-bold text-blue-600 font-mono tracking-wider">
                02
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1 font-display">
                Professional Experience &amp; Domain
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                Specify your specialized domain, seniority level, and employment preferences.
              </p>
            </div>

            {/* Double Column Grid (ZERO auto-selects, choices from backend) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              
              {/* Specialized Domain Track */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Specialized Domain / Track <span className="text-blue-600">*</span>
                </label>
                <div className="relative">
                  <select
                    value={domainId}
                    onChange={(e) => setDomainId(e.target.value)}
                    className={`w-full appearance-none rounded-lg border ${
                      stage2Errors.domain ? "border-rose-400 bg-rose-50/20" : "border-slate-200"
                    } bg-white px-3.5 py-2.5 pr-10 text-xs sm:text-sm ${
                      !domainId ? "text-slate-400" : "text-slate-800"
                    } focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all cursor-pointer`}
                  >
                    <option value="" disabled>
                      Select specialized domain / track
                    </option>
                    {domainsForSector.map((d) => (
                      <option key={d.id} value={d.id} className="text-slate-800">
                        {d.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    size={16}
                  />
                </div>
                {stage2Errors.domain && (
                  <p className="text-[11px] text-rose-600 mt-1">{stage2Errors.domain}</p>
                )}
              </div>

              {/* Experience Level / Seniority */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Experience Level / Seniority <span className="text-blue-600">*</span>
                </label>
                <div className="relative">
                  <select
                    value={seniorityId}
                    onChange={(e) => setSeniorityId(e.target.value)}
                    className={`w-full appearance-none rounded-lg border ${
                      stage2Errors.seniority ? "border-rose-400 bg-rose-50/20" : "border-slate-200"
                    } bg-white px-3.5 py-2.5 pr-10 text-xs sm:text-sm ${
                      !seniorityId ? "text-slate-400" : "text-slate-800"
                    } focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all cursor-pointer`}
                  >
                    <option value="" disabled>
                      Select experience level
                    </option>
                    {senioritiesForSector.map((lvl) => (
                      <option key={lvl.id} value={lvl.id} className="text-slate-800">
                        {lvl.label} {lvl.yearsRange ? `(${lvl.yearsRange})` : ""}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    size={16}
                  />
                </div>
                {stage2Errors.seniority && (
                  <p className="text-[11px] text-rose-600 mt-1">{stage2Errors.seniority}</p>
                )}
              </div>

              {/* Work Authorization Status */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Work Authorization Status <span className="text-blue-600">*</span>
                </label>
                <div className="relative">
                  <select
                    value={workAuthId}
                    onChange={(e) => setWorkAuthId(e.target.value)}
                    className={`w-full appearance-none rounded-lg border ${
                      stage2Errors.workAuth ? "border-rose-400 bg-rose-50/20" : "border-slate-200"
                    } bg-white px-3.5 py-2.5 pr-10 text-xs sm:text-sm ${
                      !workAuthId ? "text-slate-400" : "text-slate-800"
                    } focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all cursor-pointer`}
                  >
                    <option value="" disabled>
                      Select work authorization
                    </option>
                    {taxonomies.workAuths.map((auth) => (
                      <option key={auth.id} value={auth.id} className="text-slate-800">
                        {auth.label} {auth.region ? `(${auth.region})` : ""}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    size={16}
                  />
                </div>
                {stage2Errors.workAuth && (
                  <p className="text-[11px] text-rose-600 mt-1">{stage2Errors.workAuth}</p>
                )}
              </div>

              {/* Preferred Engagement Type */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Preferred Engagement Type <span className="text-blue-600">*</span>
                </label>
                <div className="relative">
                  <select
                    value={engagementType}
                    onChange={(e) => setEngagementType(e.target.value)}
                    className={`w-full appearance-none rounded-lg border ${
                      stage2Errors.engagementType ? "border-rose-400 bg-rose-50/20" : "border-slate-200"
                    } bg-white px-3.5 py-2.5 pr-10 text-xs sm:text-sm ${
                      !engagementType ? "text-slate-400" : "text-slate-800"
                    } focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all cursor-pointer`}
                  >
                    <option value="" disabled>
                      Select engagement type
                    </option>
                    {taxonomies.engagements.map((eng) => (
                      <option key={eng.id} value={eng.id} className="text-slate-800">
                        {eng.label} {eng.badge ? `(${eng.badge})` : ""}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    size={16}
                  />
                </div>
                {stage2Errors.engagementType && (
                  <p className="text-[11px] text-rose-600 mt-1">{stage2Errors.engagementType}</p>
                )}
              </div>

              {/* Target Hourly Rate / Compensation (Starts empty, placeholder only) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Target Compensation (Hourly / Annual)
                </label>
                <input
                  type="text"
                  value={compRate}
                  onChange={(e) => setCompRate(e.target.value)}
                  placeholder="e.g. $85 - $115 / hr"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                />
              </div>

              {/* Preferred Timezone & Availability */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Preferred Timezone <span className="text-blue-600">*</span>
                </label>
                <div className="relative">
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className={`w-full appearance-none rounded-lg border ${
                      stage2Errors.timezone ? "border-rose-400 bg-rose-50/20" : "border-slate-200"
                    } bg-white px-3.5 py-2.5 pr-10 text-xs sm:text-sm ${
                      !timezone ? "text-slate-400" : "text-slate-800"
                    } focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all cursor-pointer`}
                  >
                    <option value="" disabled>
                      Select preferred timezone
                    </option>
                    <option value="EST (UTC-5)" className="text-slate-800">
                      EST (US Eastern, UTC-5)
                    </option>
                    <option value="CST (UTC-6)" className="text-slate-800">
                      CST (US Central, UTC-6)
                    </option>
                    <option value="MST (UTC-7)" className="text-slate-800">
                      MST (US Mountain, UTC-7)
                    </option>
                    <option value="PST (UTC-8)" className="text-slate-800">
                      PST (US Pacific, UTC-8)
                    </option>
                    <option value="GMT (UTC+0)" className="text-slate-800">
                      GMT (London / UK, UTC+0)
                    </option>
                    <option value="CET (UTC+1)" className="text-slate-800">
                      CET (Central Europe, UTC+1)
                    </option>
                    <option value="Asia/Dhaka (UTC+6)" className="text-slate-800">
                      Asia/Dhaka (UTC+6)
                    </option>
                    <option value="IST (UTC+5:30)" className="text-slate-800">
                      IST (India Standard, UTC+5:30)
                    </option>
                  </select>
                  <ChevronDown
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    size={16}
                  />
                </div>
                {stage2Errors.timezone && (
                  <p className="text-[11px] text-rose-600 mt-1">{stage2Errors.timezone}</p>
                )}
              </div>

              {/* Healthcare specific credentials */}
              {sector === "healthcare" && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Clinical License Type <span className="text-blue-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={licenseType}
                      onChange={(e) => setLicenseType(e.target.value)}
                      placeholder="e.g. Registered Nurse (RN) / GMC Registered"
                      className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      License Number &amp; Jurisdiction <span className="text-blue-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={licenseNumber}
                      onChange={(e) => setLicenseNumber(e.target.value)}
                      placeholder="e.g. CA-RN-992144 (California)"
                      className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    />
                  </div>
                </>
              )}

              {/* Skills Multi-Selection Box (ZERO auto-selects, click to select) */}
              <div className="col-span-full">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold text-slate-700">
                    Key Technical Skills &amp; Clinical Specialties <span className="text-blue-600">*</span>
                  </label>
                  <span className="text-[11px] text-slate-400">
                    {selectedSkillIds.length} skills selected
                  </span>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3 sm:p-4">
                  <input
                    type="text"
                    value={skillSearchQuery}
                    onChange={(e) => setSkillSearchQuery(e.target.value)}
                    placeholder="Search or filter skills (e.g. React, Node, Python, ICU)..."
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none mb-3"
                  />

                  <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
                    {filteredSkills.map((s) => {
                      const isSelected = selectedSkillIds.includes(s.id);
                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => toggleSkill(s.id)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                            isSelected
                              ? "bg-blue-600 text-white shadow-xs"
                              : "bg-white border border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-blue-50/50"
                          }`}
                        >
                          {isSelected && <Check size={12} />}
                          <span>{s.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
                {stage2Errors.skills && (
                  <p className="text-[11px] text-rose-600 mt-1">{stage2Errors.skills}</p>
                )}
              </div>
            </div>

            {/* Stage 02 Next Button (ONLY visible when Stage 2 is the active latest stage) */}
            {unlockedStage === 2 && (
              <div className="mt-8 flex items-center justify-end">
                <button
                  type="button"
                  onClick={handleStage2Next}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#e8f2ff] hover:bg-blue-600 hover:text-white text-blue-600 text-xs sm:text-sm font-semibold transition-all shadow-xs cursor-pointer active:scale-[0.99]"
                >
                  <span>Next</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            )}
          </section>
        )}

        {/* ============================================================== */}
        {/* STAGE 03: Additional Information / Credentials & Account      */}
        {/* ============================================================== */}
        {unlockedStage >= 3 && (
          <form
            onSubmit={handleFinalSubmit}
            id="stage-03"
            className="pt-10 sm:pt-14 border-t border-slate-100 transition-all animate-in fade-in duration-300"
          >
            {/* Stage Header */}
            <div className="mb-6">
              <span className="text-xs sm:text-sm font-bold text-blue-600 font-mono tracking-wider">
                03
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1 font-display">
                Credentials &amp; Account Security
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                Upload your resume, set up your secure password, and finalize your enterprise intake.
              </p>
            </div>

            {/* Double Column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              
              {/* CV / Resume Upload Box (Col-span full) */}
              <div className="col-span-full">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Upload CV / Resume <span className="text-blue-600">*</span>
                </label>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.rtf"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed ${
                    stage3Errors.resume ? "border-rose-400 bg-rose-50/20" : "border-slate-200 hover:border-blue-400"
                  } rounded-xl p-6 text-center cursor-pointer transition-colors bg-slate-50/40 hover:bg-blue-50/20`}
                >
                  <div className="w-10 h-10 rounded-full bg-blue-100/80 text-blue-600 flex items-center justify-center mx-auto mb-2">
                    <UploadCloud size={20} />
                  </div>
                  {uploadedFile ? (
                    <div className="flex items-center justify-center gap-2 text-slate-800 font-medium text-xs sm:text-sm">
                      <FileText size={16} className="text-blue-600" />
                      <span className="font-semibold">{uploadedFile.name}</span>
                      <span className="text-slate-400 text-xs">
                        ({(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                  ) : (
                    <>
                      <p className="text-xs sm:text-sm font-semibold text-slate-700">
                        Click to upload your CV / Resume or drag &amp; drop
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Supported formats: PDF, DOCX, RTF (Max size 10MB)
                      </p>
                    </>
                  )}
                </div>
                {stage3Errors.resume && (
                  <p className="text-[11px] text-rose-600 mt-1">{stage3Errors.resume}</p>
                )}
              </div>

              {/* LinkedIn URL */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  LinkedIn Profile URL (Optional)
                </label>
                <input
                  type="url"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                />
              </div>

              {/* GitHub / Portfolio URL */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  GitHub / Portfolio URL (Optional)
                </label>
                <input
                  type="url"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  placeholder="https://github.com/username or your portfolio"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                />
              </div>

              {/* Create Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Create Password <span className="text-blue-600">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong password"
                    className={`w-full rounded-lg border ${
                      stage3Errors.password ? "border-rose-400 bg-rose-50/20" : "border-slate-200"
                    } bg-white px-3.5 py-2.5 pr-10 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {stage3Errors.password && (
                  <p className="text-[11px] text-rose-600 mt-1">{stage3Errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Confirm Password <span className="text-blue-600">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your password"
                    className={`w-full rounded-lg border ${
                      stage3Errors.confirmPassword ? "border-rose-400 bg-rose-50/20" : "border-slate-200"
                    } bg-white px-3.5 py-2.5 pr-10 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {stage3Errors.confirmPassword && (
                  <p className="text-[11px] text-rose-600 mt-1">{stage3Errors.confirmPassword}</p>
                )}
              </div>

              {/* Referral Code */}
              <div className="col-span-full md:col-span-1">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Referral Code (Optional)
                </label>
                <input
                  type="text"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                  placeholder="e.g. PEPOL-REF-100"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 font-mono uppercase focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                />
              </div>

              {/* Additional Notes */}
              <div className="col-span-full">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Additional Notes (Optional)
                  </label>
                  <span className="text-[11px] text-slate-400">{additionalNotes.length}/500</span>
                </div>
                <textarea
                  rows={3}
                  maxLength={500}
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  placeholder="Tell us anything else we should know regarding your availability or target roles..."
                  className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
                />
              </div>

              {/* Legal Consents (Col-span full, starts unchecked) */}
              <div className="col-span-full pt-2 space-y-2 border-t border-slate-100">
                <label className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-3.5 w-3.5 cursor-pointer"
                  />
                  <span>
                    I accept the{" "}
                    <Link href="/terms" target="_blank" className="text-blue-600 underline font-medium">
                      Terms of Service
                    </Link>{" "}
                    governing candidate representation.
                  </span>
                </label>

                <label className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreePrivacy}
                    onChange={(e) => setAgreePrivacy(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-3.5 w-3.5 cursor-pointer"
                  />
                  <span>
                    I accept the{" "}
                    <Link href="/privacy" target="_blank" className="text-blue-600 underline font-medium">
                      Privacy Policy
                    </Link>{" "}
                    regarding candidate data protection.
                  </span>
                </label>

                <label className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeDataProcessing}
                    onChange={(e) => setAgreeDataProcessing(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-3.5 w-3.5 cursor-pointer"
                  />
                  <span>
                    I consent to automated RPO talent matching and cross-border profile processing.
                  </span>
                </label>

                {stage3Errors.consents && (
                  <p className="text-[11px] text-rose-600 mt-1">{stage3Errors.consents}</p>
                )}
              </div>
            </div>

            {/* Stage 03 Submit Button */}
            <div className="mt-8 flex items-center justify-end">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 px-7 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold transition-all shadow-md shadow-blue-500/20 cursor-pointer disabled:opacity-60 active:scale-[0.99]"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Submitting Application...</span>
                  </>
                ) : (
                  <>
                    <span>Complete Registration</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </main>

      {/* 3. Subtle Clean Bottom Space */}
      <footer className="w-full py-4 text-center text-xs text-slate-400 font-sans border-t border-slate-100 bg-white">
        &copy; {new Date().getFullYear()} Pepoltek Limited. All rights reserved.
      </footer>
    </div>
  );
}
