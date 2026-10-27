"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Upload,
  FileText,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Code2,
  Stethoscope,
  ShieldCheck,
  Eye,
  EyeOff,
  Briefcase,
  Globe,
  DollarSign,
  Clock,
  Sparkles,
  Lock,
  RefreshCw,
} from "@/components/ui/Icons";
import {
  registerAction,
  resendOtpAction,
  verifyOtpAction,
  changeVerificationEmailAction,
} from "@/actions/auth.actions";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";
import { Mail, Edit3, X, Zap } from "lucide-react";
import { submitCandidateIntakeAction, parseCandidateCvAction } from "@/actions/candidate.actions";
import { getTaxonomiesAction } from "@/actions/taxonomy.actions";
import { TaxonomyMatrix } from "@/types/taxonomy.types";
import { CandidateBenchmarkScores } from "@/components/candidate/common/CandidateBenchmarkScores";

type TrackCode = "technology" | "healthcare";

// Robust fallback taxonomy in case network is delayed
const DEFAULT_FALLBACK_TAXONOMY: TaxonomyMatrix = {
  sectors: [
    {
      id: "sec-technology",
      code: "technology",
      label: "Technology & Software Engineering",
      headline: "Full-Stack, Cloud Architecture, AI/MLOps & Distributed Systems",
      badge: "Enterprise Roles",
      iconName: "Zap",
      description: "Deployment to high-frequency engineering teams with verified timezone overlap and 7-day velocity.",
    },
    {
      id: "sec-healthcare",
      code: "healthcare",
      label: "Healthcare & Clinical Specialists",
      headline: "Acute Care, Telehealth, ICU Specialties & EHR Systems",
      badge: "Clinical Rotas",
      iconName: "ShieldCheck",
      description: "Deployment to NHS trusts and private health networks with verified credentials, GMC/NMC and DBS audit clearance.",
    },
  ],
  domains: [
    {
      id: "dom-tech-fullstack",
      sectorId: "technology",
      label: "Full-Stack Systems & Applications",
      description: "Modern end-to-end web architecture, micro-frontends, and distributed backends.",
      recommendedSkills: ["React", "Next.js", "TypeScript", "Node.js", "PostgreSQL"],
    },
    {
      id: "dom-tech-backend",
      sectorId: "technology",
      label: "Backend & Distributed Systems",
      description: "High-throughput APIs, event streaming, caching, and database architecture.",
      recommendedSkills: ["Go", "Python", "Django", "Kafka", "Redis"],
    },
    {
      id: "dom-tech-frontend",
      sectorId: "technology",
      label: "Frontend Engineering & Design Systems",
      description: "Performance-optimized web applications, accessible design systems, and state management.",
      recommendedSkills: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
    },
    {
      id: "dom-tech-cloud-devops",
      sectorId: "technology",
      label: "Cloud Architecture, DevOps & SRE",
      description: "Infrastructure as Code, Kubernetes orchestration, CI/CD, and platform reliability.",
      recommendedSkills: ["AWS Cloud", "Kubernetes", "Terraform", "Docker"],
    },
    {
      id: "dom-tech-data-ai",
      sectorId: "technology",
      label: "Data Engineering & AI / MLOps",
      description: "LLM integration, data pipelines, vector search embeddings, and analytics lakes.",
      recommendedSkills: ["Python", "PyTorch", "FastAPI", "pgvector"],
    },
    {
      id: "dom-tech-cybersecurity",
      sectorId: "technology",
      label: "Cybersecurity & DevSecOps",
      description: "SOC 2 Type II compliance, vulnerability assessment, cryptography, and secure pipelines.",
      recommendedSkills: ["SOC 2", "Cryptography", "OWASP", "AWS Security"],
    },
    {
      id: "dom-health-physicians",
      sectorId: "healthcare",
      label: "Physicians & Medical Consultants",
      description: "Specialist medical practitioners, diagnostic physicians, and acute trauma consultants.",
      recommendedSkills: ["GMC Registered", "ATLS Trauma Care", "Acute Clinical Triage"],
    },
    {
      id: "dom-health-nursing-icu",
      sectorId: "healthcare",
      label: "Intensive Care & Emergency Nursing",
      description: "Critical care nurse specialists and acute telemetry leads.",
      recommendedSkills: ["NMC Registered", "ICU Critical Care", "BLS / ACLS", "Enhanced DBS"],
    },
    {
      id: "dom-health-ehr-operations",
      sectorId: "healthcare",
      label: "EMR / EHR Clinical Operations",
      description: "Hospital workflow modernization, clinical documentation, and health record governance.",
      recommendedSkills: ["Epic Systems EHR", "Cerner Millennium", "HL7 & FHIR"],
    },
    {
      id: "dom-health-admin-gov",
      sectorId: "healthcare",
      label: "Clinical Governance & Hospital Administration",
      description: "Healthcare compliance, CQC audit readiness, and hospital staffing operations.",
      recommendedSkills: ["Clinical Audit", "CQC Quality Governance", "Enhanced DBS"],
    },
  ],
  skills: [
    { id: "sk-1", label: "React", sectorId: "technology", isPopular: true },
    { id: "sk-2", label: "Next.js", sectorId: "technology", isPopular: true },
    { id: "sk-3", label: "TypeScript", sectorId: "technology", isPopular: true },
    { id: "sk-4", label: "Node.js", sectorId: "technology", isPopular: true },
    { id: "sk-5", label: "Python", sectorId: "technology", isPopular: true },
    { id: "sk-6", label: "Django REST Framework", sectorId: "technology", isPopular: true },
    { id: "sk-7", label: "Go (Golang)", sectorId: "technology", isPopular: true },
    { id: "sk-8", label: "PostgreSQL", sectorId: "technology", isPopular: true },
    { id: "sk-9", label: "Redis", sectorId: "technology", isPopular: true },
    { id: "sk-10", label: "Apache Kafka", sectorId: "technology", isPopular: false },
    { id: "sk-11", label: "AWS Cloud", sectorId: "technology", isPopular: true },
    { id: "sk-12", label: "Kubernetes", sectorId: "technology", isPopular: true },
    { id: "sk-13", label: "Docker Containers", sectorId: "technology", isPopular: true },
    { id: "sk-14", label: "Terraform (IaC)", sectorId: "technology", isPopular: false },
    { id: "sk-15", label: "Tailwind CSS", sectorId: "technology", isPopular: false },
    { id: "sk-16", label: "FastAPI", sectorId: "technology", isPopular: false },
    { id: "sk-17", label: "pgvector & Embeddings", sectorId: "technology", isPopular: false },
    { id: "sk-18", label: "GMC Registered (UK)", sectorId: "healthcare", isPopular: true },
    { id: "sk-19", label: "NMC Registered (Band 7/8)", sectorId: "healthcare", isPopular: true },
    { id: "sk-20", label: "Enhanced DBS Clearance", sectorId: "healthcare", isPopular: true },
    { id: "sk-21", label: "BLS & ACLS Certified", sectorId: "healthcare", isPopular: true },
    { id: "sk-22", label: "Intensive Care Unit (ICU)", sectorId: "healthcare", isPopular: true },
    { id: "sk-23", label: "Acute Clinical Triage", sectorId: "healthcare", isPopular: false },
    { id: "sk-24", label: "Epic Systems EHR", sectorId: "healthcare", isPopular: true },
    { id: "sk-25", label: "Cerner Millennium", sectorId: "healthcare", isPopular: false },
    { id: "sk-26", label: "HL7 & FHIR Standards", sectorId: "healthcare", isPopular: false },
  ],
  seniorities: [
    {
      id: "lvl-tech-junior",
      sectorId: "technology",
      label: "Junior Software Engineer",
      yearsRange: "1 to 2 Years",
      canonicalLevel: "junior",
      description: "Foundational software delivery and peer-reviewed code sprints.",
    },
    {
      id: "lvl-tech-mid",
      sectorId: "technology",
      label: "Mid-Level Software Engineer",
      yearsRange: "3 to 5 Years",
      canonicalLevel: "mid",
      description: "Independent feature implementation and robust modular architecture.",
    },
    {
      id: "lvl-tech-senior",
      sectorId: "technology",
      label: "Senior Engineer & Specialist",
      yearsRange: "5 to 8 Years",
      canonicalLevel: "senior",
      description: "Deep technical ownership, system design, and benchmark test coverage.",
    },
    {
      id: "lvl-tech-lead",
      sectorId: "technology",
      label: "Lead Architect & Technical Delivery Lead",
      yearsRange: "8+ Years",
      canonicalLevel: "lead",
      description: "Technical roadmap governance, architecture leadership, and cross-timezone sync.",
    },
    {
      id: "lvl-health-junior",
      sectorId: "healthcare",
      label: "Clinical Practitioner / Staff Nurse",
      yearsRange: "1 to 3 Years",
      canonicalLevel: "junior",
      description: "Direct patient care, vital assessments, and bedside protocol execution.",
    },
    {
      id: "lvl-health-senior",
      sectorId: "healthcare",
      label: "Advanced Specialist / NHS Band 7",
      yearsRange: "4 to 7 Years",
      canonicalLevel: "senior",
      description: "Specialized clinical decision making, acute ICU triage, and department shift coordination.",
    },
    {
      id: "lvl-health-lead",
      sectorId: "healthcare",
      label: "Clinical Consultant / Department Lead (Band 8+)",
      yearsRange: "8+ Years",
      canonicalLevel: "lead",
      description: "Clinical governance, senior panel reviews, and hospital department oversight.",
    },
  ],
  workAuths: [
    {
      id: "auth-us-citizen",
      label: "US Citizen",
      canonicalAuth: "us_citizen",
      region: "US",
      description: "Unrestricted authorization for any US-based hiring requisition.",
    },
    {
      id: "auth-green-card",
      label: "Permanent Resident (Green Card)",
      canonicalAuth: "green_card",
      region: "US",
      description: "Permanent US resident authorization.",
    },
    {
      id: "auth-h1b",
      label: "H-1B Specialty Occupation",
      canonicalAuth: "h1b",
      region: "US",
      description: "Available for H-1B transfer or cap-exempt enterprise allocation.",
    },
    {
      id: "auth-opt-stem",
      label: "OPT / STEM OPT Extension",
      canonicalAuth: "opt",
      region: "US",
      description: "Valid EAD work authorization with dedicated STEM extension.",
    },
    {
      id: "auth-intl-remote",
      label: "International Remote Specialist",
      canonicalAuth: "international_remote",
      region: "Global",
      description: "Autonomous cross-border B2B contractor with guaranteed timezone overlap.",
    },
  ],
  engagements: [
    {
      id: "eng-w2",
      label: "W2 Contract",
      canonicalEngagement: "w2",
      badge: "US Payroll",
      description: "Employee contract with hourly billing and employer payroll benefits.",
    },
    {
      id: "eng-c2c",
      label: "Corp-to-Corp (C2C)",
      canonicalEngagement: "c2c",
      badge: "B2B Vendor",
      description: "Invoicing through candidate incorporated legal business entity.",
    },
    {
      id: "eng-1099",
      label: "1099 Independent Contractor",
      canonicalEngagement: "1099",
      badge: "Direct Contract",
      description: "Direct contractual agreement for independent specialists.",
    },
    {
      id: "eng-direct-hire",
      label: "Direct Hire / Full-Time Placement",
      canonicalEngagement: "direct_hire",
      badge: "Permanent FTE",
      description: "Direct permanent placement on client internal executive payroll.",
    },
  ],
};

export function CandidateIntakeRegisterView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dynamic choice matrix loaded from backend
  const [taxonomies, setTaxonomies] = useState<TaxonomyMatrix>(DEFAULT_FALLBACK_TAXONOMY);
  const [loadingTaxonomies, setLoadingTaxonomies] = useState<boolean>(true);

  // Stepper state: 1: Track Selection, 2: CV Parsing & Benchmark Preview, 3: Profile Attributes Review, 4: Account Security
  const [currentStage, setCurrentStage] = useState<number>(1);

  // Stage 1: Track Selection
  const [selectedTrack, setSelectedTrack] = useState<TrackCode>("technology");

  // Stage 2: CV Upload & Ingestion State
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [isParsingCv, setIsParsingCv] = useState<boolean>(false);
  const [parsingProgress, setParsingProgress] = useState<number>(0);
  const [parsingStepText, setParsingStepText] = useState<string>("Analyzing document structure...");
  const [cvParsedSuccess, setCvParsedSuccess] = useState<boolean>(false);

  // Extracted telemetry metrics from parse
  const [parsedScores, setParsedScores] = useState({
    readinessIndex: 74,
    atsCompatibilityScore: 91,
    technicalVettingScore: 94,
    readinessTier: "Tier 2: Screened Specialist",
    requisitionFitScore: 86,
  });

  // Stage 3: Attributes & Domain Profile
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [currentJobTitle, setCurrentJobTitle] = useState<string>("");
  const [domainOrSpecialty, setDomainOrSpecialty] = useState<string>("");
  const [experienceLevel, setExperienceLevel] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [workAuth, setWorkAuth] = useState<string>("us_citizen");
  const [selectedEngagements, setSelectedEngagements] = useState<string[]>(["w2", "direct_hire"]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [customSkillInput, setCustomSkillInput] = useState<string>("");
  const [expectedComp, setExpectedComp] = useState<string>("");
  const [linkedinUrl, setLinkedinUrl] = useState<string>("");
  const [portfolioUrl, setPortfolioUrl] = useState<string>("");
  const [githubUrl, setGithubUrl] = useState<string>("");
  const [yearsExperience, setYearsExperience] = useState<number>(6);

  // Healthcare clinical credentials
  const [licenseNumber, setLicenseNumber] = useState<string>("");
  const [licenseType, setLicenseType] = useState<string>("");
  const [licenseState, setLicenseState] = useState<string>("");
  const [licenseExpiry, setLicenseExpiry] = useState<string>("");

  // Missing fields for CAN-06 soft-yellow highlight
  const [missingFields, setMissingFields] = useState<string[]>([]);

  // Stage 4: Account Security & Consents
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [agreeTerms, setAgreeTerms] = useState<boolean>(false);
  const [agreePrivacy, setAgreePrivacy] = useState<boolean>(false);
  const [agreeMatching, setAgreeMatching] = useState<boolean>(false);

  // Identity Verification State (Final Step)
  const [verificationMode, setVerificationMode] = useState<boolean>(false);
  const [accountCreated, setAccountCreated] = useState<boolean>(false);
  const [isEditingVerificationEmail, setIsEditingVerificationEmail] = useState<boolean>(false);
  const [newEmailInput, setNewEmailInput] = useState<string>("");
  const [emailSaving, setEmailSaving] = useState<boolean>(false);
  const [otpDispatched, setOtpDispatched] = useState<boolean>(false);
  const [dispatchingOtp, setDispatchingOtp] = useState<boolean>(false);
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [otpTimer, setOtpTimer] = useState<number>(0);
  const [verifyingOtp, setVerifyingOtp] = useState<boolean>(false);
  const [verifiedSuccess, setVerifiedSuccess] = useState<boolean>(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<string | null>(null);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (otpTimer > 0) {
      const interval = setInterval(() => setOtpTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [otpTimer]);

  // Stage 4 Pre-Submission Email Edit State
  const [isEditingPreSubmitEmail, setIsEditingPreSubmitEmail] = useState<boolean>(false);
  const [preSubmitEmailInput, setPreSubmitEmailInput] = useState<string>("");

  const handleSavePreSubmitEmail = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = preSubmitEmailInput.trim().toLowerCase();
    if (!clean || !clean.includes("@")) {
      showToast("Please enter a valid email address.", "error");
      return;
    }
    setEmail(clean);
    setIsEditingPreSubmitEmail(false);
    showToast("Contact email updated for dossier registration.", "info");
  };

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Toast state for AI quota warnings & provider alerts
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"warning" | "error" | "info">("warning");

  const showToast = (message: string, type: "warning" | "error" | "info" = "warning") => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 7000);
  };

  // Referral code from URL if present
  const referralCode = searchParams.get("ref") || "";

  // 1. Fetch dynamic choices from backend on mount
  useEffect(() => {
    let isMounted = true;
    async function loadTaxonomies() {
      try {
        const res = await getTaxonomiesAction();
        if (isMounted && res.success && res.data && res.data.sectors && res.data.sectors.length > 0) {
          setTaxonomies(res.data);
        }
      } catch (err) {
        console.warn("Using baseline taxonomy configuration:", err);
      } finally {
        if (isMounted) setLoadingTaxonomies(false);
      }
    }
    loadTaxonomies();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter dynamic options according to selectedTrack
  const availableDomains = (taxonomies.domains || []).filter(
    (d) => d.sectorId === selectedTrack || !d.sectorId
  );
  const availableSeniorities = (taxonomies.seniorities || []).filter(
    (s) => s.sectorId === selectedTrack || !s.sectorId
  );
  const availableSkills = (taxonomies.skills || []).filter(
    (sk) => sk.sectorId === selectedTrack || !sk.sectorId
  );

  // When track changes, update sensible defaults if fields are empty
  useEffect(() => {
    if (selectedTrack === "technology") {
      if (!domainOrSpecialty && availableDomains.length > 0) {
        setDomainOrSpecialty(availableDomains[0].label);
      }
      if (!experienceLevel && availableSeniorities.length > 0) {
        setExperienceLevel(availableSeniorities[2]?.label || availableSeniorities[0].label);
      }
      if (selectedSkills.length === 0) {
        setSelectedSkills(["React", "Next.js", "TypeScript", "Python", "AWS Cloud"]);
      }
    } else {
      if (!domainOrSpecialty && availableDomains.length > 0) {
        setDomainOrSpecialty(availableDomains[0].label);
      }
      if (!experienceLevel && availableSeniorities.length > 0) {
        setExperienceLevel(availableSeniorities[1]?.label || availableSeniorities[0].label);
      }
      if (selectedSkills.length === 0) {
        setSelectedSkills(["Clinical Governance", "Patient Safety Protocols", "EHR / EMR Integration"]);
      }
    }
  }, [selectedTrack, taxonomies]);

  // Handle CV File Upload and Real AI Backend Parsing
  const handleFileDrop = async (file: File) => {
    setCvFile(file);
    setIsParsingCv(true);
    setCvParsedSuccess(false);
    setParsingProgress(20);
    setParsingStepText("Uploading and extracting document structure...");

    const progressTimer = setInterval(() => {
      setParsingProgress((prev) => {
        if (prev >= 88) return prev;
        return prev + 12;
      });
    }, 300);

    try {
      const formData = new FormData();
      formData.append("file", file);

      setParsingStepText("Analyzing skills, experience, and domain taxonomy with AI...");
      const res = await parseCandidateCvAction(formData);

      clearInterval(progressTimer);
      setParsingProgress(100);
      setIsParsingCv(false);

      if (!res.success && !res.data) {
        showToast(
          res.ai_warning || res.error || "AI credits out of quota or parser unavailable. Switched to manual entry.",
          "warning"
        );
        setCvParsedSuccess(true);
        return;
      }

      // Check if AI services reported credits out or unavailable
      if (!res.ai_available || res.ai_warning) {
        showToast(
          res.ai_warning || "AI credits out of quota. Extracted profile using local rule engine; please review your details.",
          "warning"
        );
      }

      const d = res.data;
      if (d) {
        if (d.full_name) setFullName(d.full_name);
        if (d.email) setEmail(d.email);
        if (d.phone) setPhone(d.phone);
        if (d.location) setLocation(d.location);
        if (d.current_job_title) setCurrentJobTitle(d.current_job_title);
        if (d.domain) setDomainOrSpecialty(d.domain);
        if (d.years_experience) setYearsExperience(d.years_experience);
        if (d.expected_comp) setExpectedComp(d.expected_comp);
        if (d.detected_track) setSelectedTrack(d.detected_track as TrackCode);
        if (d.github_url) setGithubUrl(d.github_url);
        if (d.linkedin_url) setLinkedinUrl(d.linkedin_url);
        if (d.portfolio_url) setPortfolioUrl(d.portfolio_url);

        if (Array.isArray(d.skills) && d.skills.length > 0) {
          setSelectedSkills(d.skills);
        }

        if (d.benchmark_scores) {
          setParsedScores({
            readinessIndex: d.benchmark_scores.readiness_index || 76,
            atsCompatibilityScore: d.benchmark_scores.ats_compatibility_score || 92,
            technicalVettingScore: d.benchmark_scores.technical_vetting_score || 94,
            readinessTier: d.benchmark_scores.readiness_tier || "Tier 2: Screened Specialist",
            requisitionFitScore: d.benchmark_scores.requisition_fit_score || 88,
          });
        }
      }

      setCvParsedSuccess(true);
    } catch (err: any) {
      clearInterval(progressTimer);
      setIsParsingCv(false);
      showToast("AI credits out of quota or network connection error. You can fill details manually.", "warning");
      setCvParsedSuccess(true);
    }
  };

  // Re-upload and re-parse handler
  const handleTriggerReupload = () => {
    setCvFile(null);
    setCvParsedSuccess(false);
    setIsParsingCv(false);
    setParsingProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

// CV Upload is mandatory for candidate intake progression

  // Validation Check before moving to Stage 4 (CAN-06 Soft-Yellow Highlight)
  const validateStage3 = (): boolean => {
    const missing: string[] = [];
    if (!fullName.trim()) missing.push("Full Name");
    if (!email.trim() || !email.includes("@")) missing.push("Work Email");
    if (!phone.trim()) missing.push("Phone Number");
    if (!location.trim()) missing.push("Current Location");
    if (!domainOrSpecialty.trim()) missing.push("Specialized Domain / Track");
    if (!experienceLevel.trim()) missing.push("Experience Level");
    if (!workAuth.trim()) missing.push("Work Authorization Status");
    if (selectedSkills.length === 0) missing.push("Key Skills (at least 1)");

    if (selectedTrack === "healthcare" && !licenseNumber.trim()) {
      missing.push("Clinical License or Registration Number");
    }

    setMissingFields(missing);
    return missing.length === 0;
  };

  const handleProceedToSecurity = () => {
    if (!validateStage3()) {
      window.scrollTo({ top: 250, behavior: "smooth" });
      return;
    }
    setMissingFields([]);
    setCurrentStage(4);
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleAddCustomSkill = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ("key" in e && e.key !== "Enter") return;
    e.preventDefault();
    const trimmed = customSkillInput.trim();
    if (trimmed && !selectedSkills.includes(trimmed)) {
      setSelectedSkills((prev) => [...prev, trimmed]);
      setCustomSkillInput("");
    }
  };

  const toggleEngagement = (canonicalEngagement: string) => {
    setSelectedEngagements((prev) =>
      prev.includes(canonicalEngagement)
        ? prev.filter((e) => e !== canonicalEngagement)
        : [...prev, canonicalEngagement]
    );
  };

  // Verification Action Handlers
  const handleSaveVerificationEmail = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanEmail = newEmailInput.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      setVerificationError("Please enter a valid email address.");
      return;
    }
    if (cleanEmail === email) {
      setIsEditingVerificationEmail(false);
      return;
    }

    setEmailSaving(true);
    setVerificationError(null);

    const res = await changeVerificationEmailAction({
      currentEmail: email,
      newEmail: cleanEmail,
    });
    setEmailSaving(false);

    if (res.success) {
      setEmail(cleanEmail);
      setIsEditingVerificationEmail(false);
      setVerificationStatus("Target verification email updated successfully.");
      if (otpDispatched) {
        setOtpDispatched(false);
        setOtpDigits(["", "", "", "", "", ""]);
        setOtpTimer(0);
      }
      setTimeout(() => setVerificationStatus(null), 3500);
    } else {
      setVerificationError(res.message || "Failed to update email address.");
    }
  };

  const handleDispatchOtp = async () => {
    setDispatchingOtp(true);
    setVerificationError(null);
    setVerificationStatus("Dispatching 6-digit PIN...");

    const res = await resendOtpAction({
      email,
      full_name: fullName.trim() || "Candidate",
    });
    setDispatchingOtp(false);

    if (res.success) {
      setOtpDispatched(true);
      setOtpTimer(60);
      setVerificationStatus(`6-digit PIN dispatched to ${email}`);
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 100);
      setTimeout(() => setVerificationStatus(null), 4500);
    } else {
      setVerificationError(res.message || "Failed to dispatch verification PIN.");
    }
  };

  const handleFillTestOtp = () => {
    const demoOtp = "749201";
    setOtpDigits(demoOtp.split(""));
    otpInputRefs.current[5]?.focus();
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pastedData) return;
    const newOtp = [...otpDigits];
    pastedData.split("").forEach((char, idx) => {
      if (idx < 6) newOtp[idx] = char;
    });
    setOtpDigits(newOtp);
    const focusIdx = Math.min(pastedData.length, 5);
    otpInputRefs.current[focusIdx]?.focus();
  };

  const handleOtpChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const newOtp = [...otpDigits];
    newOtp[index] = val.slice(-1);
    setOtpDigits(newOtp);
    if (val && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otpDigits.join("");
    if (code.length < 6) return;

    setVerifyingOtp(true);
    setVerificationError(null);

    const res = await verifyOtpAction({
      email,
      otp: code,
    });
    setVerifyingOtp(false);

    if (res.success) {
      setVerifiedSuccess(true);
      setTimeout(() => {
        router.push("/candidate/dashboard?verified=true");
      }, 900);
    } else {
      setVerificationError(res.message || "Invalid or expired verification PIN.");
    }
  };

  // Final Registration Submission
  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }
    if (!agreeTerms || !agreePrivacy || !agreeMatching) {
      setErrorMessage("Please accept the terms of service, privacy policy, and candidate profile ingestion authorization.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Register User Account with strict backend policy_type mapping
      const authRes = await registerAction({
        email: email.trim().toLowerCase(),
        password,
        full_name: fullName.trim(),
        referral_code: referralCode.trim() || undefined,
        consents: [
          { policy_type: "terms", policy_version: "v2.1", agreed: true },
          { policy_type: "privacy", policy_version: "v2.1", agreed: true },
          { policy_type: "data_matching", policy_version: "v2.1", agreed: true },
        ],
      });

      if (!authRes.success) {
        setErrorMessage(authRes.error?.message || "Failed to create candidate account.");
        setIsSubmitting(false);
        return;
      }

      // Map experience level to canonical
      const canonicalLevel = experienceLevel.toLowerCase().includes("senior")
        ? "senior"
        : experienceLevel.toLowerCase().includes("lead")
        ? "lead"
        : experienceLevel.toLowerCase().includes("junior")
        ? "junior"
        : "mid";

      // 2. Persist Candidate Intake Profile & Attributes
      await submitCandidateIntakeAction({
        full_name: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        sector: selectedTrack,
        domain: domainOrSpecialty,
        current_job_title: currentJobTitle.trim() || domainOrSpecialty,
        current_location: location.trim(),
        level: canonicalLevel,
        work_auth: workAuth || "us_citizen",
        engagement_prefs: selectedEngagements,
        skills: selectedSkills,
        linkedin_profile: linkedinUrl.trim(),
        target_compensation: expectedComp.trim(),
        resume_text: `Extracted CV for ${fullName.trim()}. Track: ${selectedTrack}. Domain: ${domainOrSpecialty}. Level: ${experienceLevel}. Skills: ${selectedSkills.join(", ")}.`,
      });

      // 3. Transition to Stage 4 Verification Gateway
      setIsSubmitting(false);
      setAccountCreated(true);
      setVerificationMode(true);
      window.scrollTo({ top: 180, behavior: "smooth" });
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred during account creation.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-800">
      {/* Top Bar */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex shrink-0 items-center hover:opacity-80 transition-opacity">
            <Image
              src="/assets/pepoltek/black_logo.png"
              alt="Pepoltek Limited"
              width={140}
              height={36}
              className="h-7 w-auto object-contain"
              priority
            />
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 hidden sm:inline">Already registered?</span>
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>
{/* Floating Toast */}
      {toastMessage && (
        <div className="fixed top-16 right-4 sm:right-6 z-50 max-w-sm animate-in slide-in-from-top-3 fade-in duration-300">
          <div
            className={`rounded-2xl border p-4 shadow-xl flex items-start gap-3 ${
              toastType === "warning"
                ? "border-amber-300 bg-amber-50 text-amber-900"
                : toastType === "error"
                ? "border-red-300 bg-red-50 text-red-900"
                : "border-blue-300 bg-blue-50 text-blue-900"
            }`}
          >
            <AlertTriangle size={17} className={`shrink-0 mt-0.5 ${toastType === "warning" ? "text-amber-600" : "text-red-600"}`} />
            <div className="flex-1 text-xs">
              <strong className="block font-bold">{toastType === "warning" ? "AI Ingestion Notice" : "Parsing Notice"}</strong>
              <p className="mt-0.5 leading-relaxed">{toastMessage}</p>
            </div>
            <button type="button" onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-slate-600 font-bold ml-1 cursor-pointer">&times;</button>
          </div>
        </div>
      )}

      {/* Page Layout */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

        {/* Mobile top step pills */}
        <div className="flex items-center mb-6 lg:hidden">
          {[
            { n: 1, label: "Specialization" },
            { n: 2, label: "CV & Resume" },
            { n: 3, label: "Assessment" },
            { n: 4, label: "Completion" },
          ].map(({ n, label }, idx) => {
            const isDone = currentStage > n;
            const isActive = currentStage === n;
            return (
              <React.Fragment key={n}>
                <div className="flex items-center gap-1.5 shrink-0">
                  <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold transition-all ${isDone ? "bg-blue-600 text-white" : isActive ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm shadow-blue-500/25" : "border border-slate-300 text-slate-400 bg-white"}`}>
                    {isDone ? <CheckCircle size={12} /> : n}
                  </div>
                  <span className={`text-[10px] font-semibold hidden sm:block ${isActive ? "text-blue-600 font-bold" : isDone ? "text-blue-600" : "text-slate-400"}`}>{label}</span>
                </div>
                {idx < 3 && <div className={`flex-1 mx-1.5 h-px ${isDone ? "bg-blue-400" : "bg-slate-200"}`} />}
              </React.Fragment>
            );
          })}
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">

          {/* LEFT SIDEBAR: Bounded Sticky Progress & Stepper Panel */}
          <aside className="hidden lg:flex flex-col w-72 xl:w-80 shrink-0 lg:sticky lg:top-20 self-start space-y-4 max-h-full">
            <div className="rounded-xl border border-[#bcd6fa]/80 bg-gradient-to-b from-canvas/90 via-white to-canvas/40 p-5 sm:p-6 shadow-xs space-y-6">
              {/* Header & Progress */}
              <div>
                <h3 className="mt-2 text-base font-display font-bold text-slate-900">
                  Candidate Onboarding
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Complete your intake dossier to unlock direct client requisitions.
                </p>

                {/* Intake Progress Bar */}
                <div className="mt-4 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-enterprise">
                    <span className="font-semibold text-slate-600">
                      Step {currentStage} of 4
                    </span>
                    <span className="font-bold text-electric">
                      {currentStage * 25}% Complete
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden border border-[#bcd6fa]/40">
                    <div
                      className="h-full bg-gradient-to-r from-electric to-[#0052cc] rounded-full transition-all duration-500"
                      style={{ width: `${currentStage * 25}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Vertical Stepper */}
              <nav className="space-y-2">
                {[
                  { n: 1, label: "Specialization", sub: "Track & Career Focus" },
                  { n: 2, label: "CV & Resume", sub: "Upload & Deep Analysis" },
                  { n: 3, label: "Assessment", sub: "Review & Refine Profile" },
                  { n: 4, label: "Completion", sub: "Account & Verification" },
                ].map(({ n, label, sub }) => {
                  const isDone = currentStage > n;
                  const isActive = currentStage === n;
                  return (
                    <div
                      key={n}
                      className={`relative flex items-center gap-3 rounded-2xl p-3 transition-all duration-200 border ${
                        isActive
                          ? "border-electric bg-white shadow-xs ring-2 ring-electric/15"
                          : isDone
                          ? "border-emerald-200/80 bg-emerald-50/40 text-slate-700"
                          : "border-slate-200/70 bg-white/60 text-slate-400"
                      }`}
                    >
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold transition-all ${
                          isActive
                            ? "bg-gradient-to-r from-electric to-[#0052cc] text-white shadow-xs"
                            : isDone
                            ? "bg-emerald-600 text-white"
                            : "border border-slate-200 bg-canvas text-slate-400"
                        }`}
                      >
                        {isDone ? <CheckCircle size={15} /> : n}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div
                          className={`text-xs font-bold leading-tight ${
                            isActive
                              ? "text-slate-900"
                              : isDone
                              ? "text-slate-800"
                              : "text-slate-500 font-medium"
                          }`}
                        >
                          {label}
                        </div>
                        <div
                          className={`text-[10px] leading-tight mt-0.5 ${
                            isActive
                              ? "text-electric font-semibold"
                              : isDone
                              ? "text-emerald-700 font-medium"
                              : "text-slate-400"
                          }`}
                        >
                          {sub}
                        </div>
                      </div>
                      {isActive && (
                        <div className="h-2 w-2 rounded-full bg-electric animate-pulse shrink-0" />
                      )}
                    </div>
                  );
                })}
              </nav>

              {/* Enterprise Guarantee & Talent Trust Card
              <div className="pt-4 border-t border-[#bcd6fa]/50 space-y-2.5">
                <div className="text-[10px] font-enterprise font-bold uppercase tracking-wider text-slate-400">
                  Pepoltek Guarantee
                </div>
                <div className="space-y-2 text-[11px] text-slate-600">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-lg bg-electric/10 text-electric shrink-0 font-bold text-[10px]">
                      ⚡
                    </span>
                    <span>7-Day Rapid Placement SLA</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 shrink-0 font-bold text-[10px]">
                      🛡️
                    </span>
                    <span>PII Encrypted & Candidate Consent</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-lg bg-purple-50 text-purple-700 shrink-0 font-bold text-[10px]">
                      💼
                    </span>
                    <span>Transparent $85 - $150+/hr Rates</span>
                  </div>
                </div>
              </div> */}
            </div>
          </aside>

          {/* MAIN CONTENT: Independently scrollable */}
          <main className="flex-1 min-w-0 pb-16">

            {/* Global Error */}
            {errorMessage && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-800 flex items-start gap-2.5">
                <AlertTriangle size={15} className="text-red-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">Registration Alert</div>
                  <div className="mt-0.5 text-red-700">{errorMessage}</div>
                </div>
              </div>
            )}

            {/* ======================================================= */}
            {/* STAGE 1: Specialization Track Selection                   */}
            {/* ======================================================= */}
            {currentStage === 1 && (
              <div className="animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
                <div className="mb-6">
                  <p className="text-[11px] font-bold text-blue-600 uppercase tracking-widest mb-1.5">Stage 01 of 04</p>
                  <h1 className="text-[26px] sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                    Select Your Specialization Track
                  </h1>
                  <p className="mt-2 text-sm text-slate-500 max-w-lg leading-relaxed">
                    We've designed different tracks based on your career goals. Choose the one that matches your expertise and interest.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Technology */}
                  <button
                    type="button"
                    id="track-technology"
                    onClick={() => setSelectedTrack("technology")}
                    className={`text-left rounded-2xl border-2 p-6 transition-all duration-300 cursor-pointer flex flex-col min-h-[305px] relative overflow-hidden group ${
                      selectedTrack === "technology"
                        ? "border-blue-600 bg-white shadow-xl shadow-blue-500/10 ring-2 ring-blue-500/20"
                        : "border-slate-200/90 bg-white hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/5"
                    }`}
                  >
                    <div
                      className={`absolute top-0 inset-x-0 h-28 bg-[url('/assets/register/bg_card_top.png')] bg-cover bg-top pointer-events-none transition-opacity duration-300 ${selectedTrack === "technology" ? "opacity-85" : "opacity-50 group-hover:opacity-80"}`}
                    />
                    <div
                      className={`absolute bottom-0 inset-x-0 h-28 bg-[url('/assets/register/bg_card_bottom.png')] bg-cover bg-bottom pointer-events-none transition-opacity duration-300 ${selectedTrack === "technology" ? "opacity-90" : "opacity-60 group-hover:opacity-85"}`}
                    />
                    <div className="relative z-10 flex flex-col flex-1">
                      <div className="flex items-start justify-between mb-5">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-xl transition-all ${selectedTrack === "technology" ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25" : "bg-blue-50 text-blue-600"}`}>
                          <Code2 size={22} />
                        </div>
                        <div className="flex items-center gap-2">
                          {selectedTrack === "technology" && (
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white shadow-sm">
                              <CheckCircle size={14} />
                            </div>
                          )}
                          <span className="rounded-full bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide">Enterprise Roles</span>
                        </div>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-1.5">Technology</h3>
                      <p className="text-xs text-slate-500 leading-relaxed mb-4">Full-stack, cloud, DevOps, AI/ML, cybersecurity, and more.</p>
                      <div className="flex flex-wrap gap-1.5">
                        {["Full Stack", "DevOps", "AI/ML", "Cloud", "Cybersecurity"].map((tag) => (
                          <span key={tag} className={`rounded-md px-2 py-0.5 text-[10.5px] font-medium border transition-colors ${selectedTrack === "technology" ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-white/85 text-slate-600 border-slate-200"}`}>
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className={`mt-auto pt-5 border-t text-xs font-semibold transition-colors ${selectedTrack === "technology" ? "border-blue-100 text-blue-600" : "border-slate-100 text-slate-400"}`}>
                        {selectedTrack === "technology" ? "✓ Selected Track" : "Click to Select"}
                      </div>
                    </div>
                  </button>

                  {/* Healthcare */}
                  <button
                    type="button"
                    id="track-healthcare"
                    onClick={() => setSelectedTrack("healthcare")}
                    className={`text-left rounded-2xl border-2 p-6 transition-all duration-300 cursor-pointer flex flex-col min-h-[305px] relative overflow-hidden group ${
                      selectedTrack === "healthcare"
                        ? "border-blue-600 bg-white shadow-xl shadow-blue-500/10 ring-2 ring-blue-500/20"
                        : "border-slate-200/90 bg-white hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/5"
                    }`}
                  >
                    <div
                      className={`absolute top-0 inset-x-0 h-28 bg-[url('/assets/register/bg_card_top.png')] bg-cover bg-top pointer-events-none transition-opacity duration-300 ${selectedTrack === "healthcare" ? "opacity-85" : "opacity-50 group-hover:opacity-80"}`}
                    />
                    <div
                      className={`absolute bottom-0 inset-x-0 h-28 bg-[url('/assets/register/bg_card_bottom.png')] bg-cover bg-bottom pointer-events-none transition-opacity duration-300 ${selectedTrack === "healthcare" ? "opacity-90" : "opacity-60 group-hover:opacity-85"}`}
                    />
                    <div className="relative z-10 flex flex-col flex-1">
                      <div className="flex items-start justify-between mb-5">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-xl transition-all ${selectedTrack === "healthcare" ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25" : "bg-blue-50 text-blue-600"}`}>
                          <Stethoscope size={22} />
                        </div>
                        <div className="flex items-center gap-2">
                          {selectedTrack === "healthcare" && (
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white shadow-sm">
                              <CheckCircle size={14} />
                            </div>
                          )}
                          <span className="rounded-full bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide">Clinical Rotas</span>
                        </div>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-1.5">Healthcare</h3>
                      <p className="text-xs text-slate-500 leading-relaxed mb-4">Clinical specialists, nursing, ICU/ER, health informatics and more.</p>
                      <div className="flex flex-wrap gap-1.5">
                        {["ICU/ER", "Nursing", "Clinical", "EHR Systems", "FHR/HL7"].map((tag) => (
                          <span key={tag} className={`rounded-md px-2 py-0.5 text-[10.5px] font-medium border transition-colors ${selectedTrack === "healthcare" ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-white/85 text-slate-600 border-slate-200"}`}>
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className={`mt-auto pt-5 border-t text-xs font-semibold transition-colors ${selectedTrack === "healthcare" ? "border-blue-100 text-blue-600" : "border-slate-100 text-slate-400"}`}>
                        {selectedTrack === "healthcare" ? "✓ Selected Track" : "Click to Select"}
                      </div>
                    </div>
                  </button>
                </div>

                <div className="flex items-center justify-between mt-6">
                  <p className="text-xs text-slate-400">You can change this later in your profile settings</p>
                  <button
                    type="button"
                    id="stage1-next-btn"
                    onClick={() => setCurrentStage(2)}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98] px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-500/25 transition-all cursor-pointer"
                  >
                    Next <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* ======================================================= */}
            {/* STAGE 2: CV Upload & Ingestion                           */}
            {/* ======================================================= */}
            {currentStage === 2 && (
              <div className="animate-in fade-in-50 slide-in-from-bottom-2 duration-300 space-y-5">
                <div>
                  <p className="text-[11px] font-bold text-blue-600 uppercase tracking-widest mb-1.5">Stage 02 of 04</p>
                  <h1 className="text-[26px] sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                    Upload Your CV / Resume
                  </h1>
                  <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                    Our system will analyze your experience, skills and qualifications to match you with the right opportunities.
                  </p>
                </div>

                {/* Drop zone + info panel */}
                {!cvParsedSuccess && !isParsingCv && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div
                      className="lg:col-span-2"
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        if (e.dataTransfer.files && e.dataTransfer.files[0]) handleFileDrop(e.dataTransfer.files[0]);
                      }}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.docx,.doc,.rtf"
                        className="hidden"
                        onChange={(e) => { if (e.target.files && e.target.files[0]) handleFileDrop(e.target.files[0]); }}
                      />
                      <div className="rounded-2xl border-2 border-dashed border-blue-200 hover:border-blue-400 bg-white p-10 sm:p-14 text-center hover:bg-blue-50/20 transition-all cursor-pointer group flex flex-col items-center justify-center min-h-[250px] relative overflow-hidden shadow-sm hover:shadow-md">
                        <div
                          className="absolute top-0 inset-x-0 h-20 bg-[url('/assets/register/bg_card_top.png')] bg-cover bg-top pointer-events-none opacity-45"
                        />
                        <div
                          className="absolute bottom-0 inset-x-0 h-32 bg-[url('/assets/register/bg_card_bottom.png')] bg-cover bg-bottom pointer-events-none opacity-85"
                        />
                        <div className="relative z-10 flex flex-col items-center">
                          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50/95 text-blue-600 mb-5 group-hover:bg-blue-100 transition-colors shadow-xs">
                            <Upload size={26} />
                          </div>
                          <p className="text-sm font-bold text-slate-900">
                            Drag and drop your CV file here, or{" "}
                            <span className="text-blue-600 underline underline-offset-2">browse</span>
                          </p>
                          <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                            Supported formats: PDF, Word (DOCX), or RTF documents.<br />Maximum size: 10MB.
                          </p>
                          <div className="mt-5 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs">
                            <FileText size={13} /> Select File from Device
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Good to know */}
                    <div className="rounded-2xl border border-blue-100/90 bg-white p-6 space-y-4 relative overflow-hidden shadow-sm flex flex-col justify-between">
                  
                      <div className="relative z-10 space-y-4">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50/90 text-blue-600 shadow-xs border border-blue-100">
                          <FileText size={20} />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-slate-900">Good to know</h3>
                          <p className="text-[11px] text-slate-400 mt-0.5">Guidelines for automated extraction</p>
                        </div>
                        <div className="space-y-3 pt-1">
                          {[
                            { icon: <FileText size={14} />, text: "PDF, DOCX or RTF formats accepted" },
                            { icon: <AlertTriangle size={14} />, text: "Maximum file size up to 10MB" },
                            { icon: <CheckCircle size={14} />, text: "Make sure your name and contact details are visible" },
                            { icon: <CheckCircle size={14} />, text: "Ensure your latest experience and skills are included" },
                          ].map((item, idx) => (
                            <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-600">
                              <span className="text-blue-600 mt-0.5 shrink-0">{item.icon}</span>
                              <span className="leading-relaxed">{item.text}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Parsing animation */}
                {isParsingCv && (
                  <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
                    <div className="p-6 sm:p-8">
                      <div className="flex flex-col sm:flex-row gap-6">
                        <div className="flex-1 space-y-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                              <Sparkles size={20} className="animate-pulse" />
                            </div>
                            <div>
                              <div className="text-sm font-bold text-slate-900">Analyzing Your CV</div>
                              <div className="text-xs text-slate-500 mt-0.5">Extracting your details...</div>
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center justify-between text-xs mb-2">
                              <span className="text-slate-600">{parsingStepText}</span>
                              <span className="font-enterprise font-bold text-slate-800">{parsingProgress}%</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-blue-600 rounded-full transition-all duration-500 ease-out" style={{ width: `${parsingProgress}%` }} />
                            </div>
                            <p className="text-[10.5px] text-slate-400 font-enterprise mt-2 flex items-center gap-1.5">
                              <Sparkles size={10} className="text-blue-400" />
                              Analyzing skills, experience, and domain taxonomy with AI...
                            </p>
                          </div>
                        </div>
                        <div className="hidden sm:block shrink-0 w-48 rounded-xl border border-slate-100 bg-slate-50 p-4 space-y-2.5">
                          <div className="text-xs font-bold text-slate-700 mb-3">What we analyze</div>
                          {["Skills & Technologies", "Work Experience", "Education & Certifications", "Domain Expertise", "Career Preferences"].map((item) => (
                            <div key={item} className="flex items-center gap-2 text-[11px] text-slate-600">
                              <div className="h-1.5 w-1.5 rounded-full bg-blue-400 shrink-0" />
                              {item}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="h-1 bg-slate-100">
                      <div className="h-full bg-blue-600 transition-all duration-500 ease-out" style={{ width: `${parsingProgress}%` }} />
                    </div>
                  </div>
                )}

                {/* Post-parse: benchmarks + parsed card */}
                {cvParsedSuccess && (
                  <div className="space-y-4">
                    <CandidateBenchmarkScores
                      variant="reparse"
                      readinessIndex={parsedScores.readinessIndex}
                      atsCompatibilityScore={parsedScores.atsCompatibilityScore}
                      technicalVettingScore={parsedScores.technicalVettingScore}
                      readinessTier={parsedScores.readinessTier}
                      requisitionFitScore={parsedScores.requisitionFitScore}
                      track={selectedTrack}
                    />
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                            <FileText size={18} />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-slate-900">{cvFile?.name || "Candidate_Resume.pdf"}</div>
                            <div className="text-[11px] text-slate-500">{cvFile ? `${(cvFile.size / 1024).toFixed(1)} KB` : "Ready"} &bull; Document ingestion complete</div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleTriggerReupload}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shrink-0"
                        >
                          <RefreshCw size={13} className="text-slate-500" /> Re-upload &amp; Reparse CV
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div className="rounded-xl bg-slate-50 border border-slate-100 p-3">
                          <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Detected Candidate</span>
                          <div className="mt-1 font-bold text-slate-900">{fullName}</div>
                          <div className="text-slate-500 truncate">{email}</div>
                        </div>
                        <div className="rounded-xl bg-slate-50 border border-slate-100 p-3">
                          <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Classified Track & Level</span>
                          <div className="mt-1 font-bold text-slate-900 capitalize">{currentJobTitle || domainOrSpecialty}</div>
                          <div className="text-slate-500">{yearsExperience}+ Years Commercial Experience</div>
                        </div>
                        <div className="rounded-xl bg-slate-50 border border-slate-100 p-3">
                          <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Compensation Expectation</span>
                          <div className="mt-1 font-bold text-slate-900">{expectedComp || "Unspecified (Set in Review)"}</div>
                          <div className="text-slate-500">{location || "Location to verify"}</div>
                        </div>
                      </div>
                      {selectedSkills.length > 0 && (
                        <div>
                          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Extracted Key Skills ({selectedSkills.length})</span>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {selectedSkills.map((sk) => (
                              <span key={sk} className="rounded-md bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 text-xs font-medium">{sk}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex items-center justify-between pt-1">
                  <button type="button" onClick={() => setCurrentStage(1)} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                    <ArrowRight size={14} className="rotate-180" /> Back
                  </button>
                  {cvParsedSuccess ? (
                    <button type="button" id="stage2-next-btn" onClick={() => setCurrentStage(3)} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98] px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-500/25 transition-all cursor-pointer">
                      Next <ArrowRight size={16} />
                    </button>
                  ) : isParsingCv ? (
                    <button type="button" disabled className="inline-flex items-center gap-2 rounded-xl bg-blue-50 border border-blue-200 px-5 py-2.5 text-xs font-semibold text-blue-500 cursor-not-allowed">
                      <Sparkles size={14} className="animate-spin text-blue-500" /> Analyzing CV...
                    </button>
                  ) : (
                    <button type="button" disabled className="inline-flex items-center gap-2 rounded-xl bg-slate-100 border border-slate-200 px-5 py-2.5 text-xs font-semibold text-slate-400 cursor-not-allowed">
                      Upload CV to Continue <ArrowRight size={14} className="text-slate-300" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* ======================================================= */}
            {/* STAGE 3: Review & Refine Profile Attributes              */}
            {/* ======================================================= */}
            {currentStage === 3 && (
              <div className="animate-in fade-in-50 slide-in-from-bottom-2 duration-300 space-y-5">
                <div>
                  <p className="text-[11px] font-bold text-blue-600 uppercase tracking-widest mb-1.5">Stage 03 of 04</p>
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-[26px] sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                      Review &amp; Refine Extracted Attributes
                    </h1>
                    {cvParsedSuccess && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 text-xs font-semibold">
                        <CheckCircle size={12} /> CV Data Extracted
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                    Values pre-filled by our parsing engine. Verify your details, adjust domains and seniorities, and add any missing information.
                  </p>
                </div>

                {missingFields.length > 0 && (
                  <div className="rounded-xl border border-amber-300 bg-amber-50 p-4">
                    <div className="flex items-center gap-2 text-amber-900 font-bold text-xs mb-2">
                      <AlertTriangle size={14} className="text-amber-600 shrink-0" />
                      Required fields need your attention
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {missingFields.map((f) => (
                        <span key={f} className="rounded-md bg-amber-100 border border-amber-300 px-2 py-0.5 text-xs font-semibold text-amber-900">{f}</span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="rounded-2xl border border-slate-200 bg-white divide-y divide-slate-100">
                  {/* Contact */}
                  <div className="p-5 sm:p-6 space-y-4">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">1. Contact Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { label: "Full Legal Name *", value: fullName, setter: setFullName, type: "text", placeholder: "e.g. Alex Mitchell", missing: "Full Name" },
                        { label: "Work Email Address *", value: email, setter: setEmail, type: "email", placeholder: "e.g. alex@domain.com", missing: "Work Email" },
                        { label: "Primary Phone Number *", value: phone, setter: setPhone, type: "tel", placeholder: "e.g. +1 (555) 438-9210", missing: "Phone Number" },
                        { label: "Current Location (City, Country) *", value: location, setter: setLocation, type: "text", placeholder: "e.g. New York, NY, USA", missing: "Current Location" },
                      ].map((field) => (
                        <div key={field.label}>
                          <label className="block text-xs font-semibold text-slate-700 mb-1.5">{field.label}</label>
                          <input
                            type={field.type}
                            value={field.value}
                            onChange={(e) => field.setter(e.target.value)}
                            placeholder={field.placeholder}
                            className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all ${
                              !field.value.trim() && missingFields.includes(field.missing)
                                ? "border-amber-400 bg-amber-50/40"
                                : "border-slate-300 bg-white"
                            }`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Domain */}
                  <div className="p-5 sm:p-6 space-y-4">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">2. Domain & Seniority Level</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">Specialized Domain / Track *</label>
                        <select value={domainOrSpecialty} onChange={(e) => setDomainOrSpecialty(e.target.value)} className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all">
                          <option value="">Select specialized domain...</option>
                          {availableDomains.map((d) => <option key={d.id} value={d.label}>{d.label}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">Seniority Level *</label>
                        <select value={experienceLevel} onChange={(e) => setExperienceLevel(e.target.value)} className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all">
                          <option value="">Select seniority level...</option>
                          {availableSeniorities.map((s) => <option key={s.id} value={s.label}>{s.label} ({s.yearsRange})</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">Current Job Title</label>
                        <input type="text" value={currentJobTitle} onChange={(e) => setCurrentJobTitle(e.target.value)} placeholder="e.g. Senior Software Architect" className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">Target Compensation / Hourly Rate</label>
                        <input type="text" value={expectedComp} onChange={(e) => setExpectedComp(e.target.value)} placeholder="e.g. $110/hr or $160,000/yr" className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all" />
                      </div>
                    </div>
                  </div>

                  {/* Work Auth */}
                  <div className="p-5 sm:p-6 space-y-4">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">3. Work Authorization & Engagement</h3>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">Work Authorization Status *</label>
                      <select value={workAuth} onChange={(e) => setWorkAuth(e.target.value)} className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all">
                        {(taxonomies.workAuths || []).map((wa) => (
                          <option key={wa.id} value={wa.canonicalAuth}>{wa.label} [{wa.region}]</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-2">Accepted Engagement Formats</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {(taxonomies.engagements || []).map((eng) => {
                          const isSel = selectedEngagements.includes(eng.canonicalEngagement);
                          return (
                            <button key={eng.id} type="button" onClick={() => toggleEngagement(eng.canonicalEngagement)}
                              className={`rounded-xl border p-3 text-left transition-all ${isSel ? "border-blue-600 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm shadow-blue-500/25" : "border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50/40"}`}>
                              <div className="text-xs font-bold leading-tight">{eng.label}</div>
                              <div className={`text-[10px] mt-0.5 ${isSel ? "text-slate-300" : "text-slate-400"}`}>{eng.badge}</div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="p-5 sm:p-6 space-y-3">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">4. Skills & Capabilities</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {availableSkills.map((sk) => {
                        const isSel = selectedSkills.includes(sk.label);
                        return (
                          <button key={sk.id} type="button" onClick={() => toggleSkill(sk.label)}
                            className={`rounded-lg px-2.5 py-1.5 text-xs font-medium border transition-all ${isSel ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-600 shadow-sm shadow-blue-500/25" : "bg-white text-slate-600 border-slate-200 hover:border-blue-200 hover:bg-blue-50/40"}`}>
                            {sk.label}
                          </button>
                        );
                      })}
                    </div>
                    <div className="flex gap-2">
                      <input type="text" value={customSkillInput} onChange={(e) => setCustomSkillInput(e.target.value)} onKeyDown={handleAddCustomSkill}
                        placeholder="Add a custom skill (press Enter)..."
                        className="flex-1 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all" />
                      <button type="button" onClick={handleAddCustomSkill} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors">Add</button>
                    </div>
                  </div>

                  {/* Healthcare License */}
                  {selectedTrack === "healthcare" && (
                    <div className="p-5 sm:p-6 space-y-4">
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">5. Clinical License & Credentials</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1.5">License or Registration Number *</label>
                          <input type="text" value={licenseNumber} onChange={(e) => setLicenseNumber(e.target.value)} placeholder="e.g. RN-1029384 or GMC-789012"
                            className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all ${!licenseNumber.trim() && missingFields.includes("Clinical License or Registration Number") ? "border-amber-400 bg-amber-50/40" : "border-slate-300 bg-white"}`} />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Issuing Authority / State Board</label>
                          <input type="text" value={licenseState} onChange={(e) => setLicenseState(e.target.value)} placeholder="e.g. General Medical Council"
                            className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Technology Portfolio */}
                  {selectedTrack === "technology" && (
                    <div className="p-5 sm:p-6 space-y-4">
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">5. Portfolio & Public Profiles</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1.5">LinkedIn Profile</label>
                          <input type="url" value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} placeholder="https://linkedin.com/in/username"
                            className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1.5">GitHub Profile</label>
                          <input type="url" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} placeholder="https://github.com/username"
                            className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Portfolio / Personal Site</label>
                          <input type="url" value={portfolioUrl} onChange={(e) => setPortfolioUrl(e.target.value)} placeholder="https://myportfolio.dev"
                            className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button type="button" onClick={() => setCurrentStage(2)} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                    <ArrowRight size={14} className="rotate-180" /> Back
                  </button>
                  <button type="button" id="stage3-proceed-btn" onClick={handleProceedToSecurity} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98] px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-500/25 transition-all cursor-pointer">
                    Proceed to Account Security <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* ======================================================= */}
            {/* STAGE 4: Account Security & Identity Verification        */}
            {/* ======================================================= */}
            {currentStage === 4 && (
              <div className="animate-in fade-in-50 slide-in-from-bottom-2 duration-300 space-y-5">
                {!verificationMode ? (
                  <>
                    <div>
                      <p className="text-[11px] font-bold text-blue-600 uppercase tracking-widest mb-1.5">Stage 04 of 04</p>
                      <h1 className="text-[26px] sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                        Secure Your Candidate Dossier
                      </h1>
                      <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                        Create your password or fast-track with Google to activate your Pepoltek candidate profile.
                      </p>
                    </div>

                    {/* Profile confirmation card with inline email edit */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-base shadow-sm shrink-0">
                          {fullName ? fullName[0].toUpperCase() : "C"}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-bold text-slate-900">{fullName}</div>
                          {isEditingPreSubmitEmail ? (
                            <form onSubmit={handleSavePreSubmitEmail} className="mt-1 flex items-center gap-2">
                              <input
                                type="email"
                                value={preSubmitEmailInput}
                                onChange={(e) => setPreSubmitEmailInput(e.target.value)}
                                placeholder="Enter updated email"
                                className="rounded-lg border border-slate-300 px-2.5 py-1 text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden"
                                autoFocus
                              />
                              <button
                                type="submit"
                                className="rounded-lg bg-blue-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-blue-700 cursor-pointer"
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                onClick={() => setIsEditingPreSubmitEmail(false)}
                                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                              >
                                <X size={14} />
                              </button>
                            </form>
                          ) : (
                            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                              <span className="truncate">{email} &bull; {selectedTrack.toUpperCase()}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  setPreSubmitEmailInput(email);
                                  setIsEditingPreSubmitEmail(true);
                                }}
                                className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-700 cursor-pointer text-[11px]"
                              >
                                <Edit3 size={11} /> Change
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 text-xs font-semibold">{parsedScores.readinessTier}</span>
                        <span className="rounded-full bg-slate-100 text-slate-600 px-3 py-1 text-xs font-medium">{domainOrSpecialty}</span>
                      </div>
                    </div>

                    {/* Google fast track */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-bold text-slate-900">Instant Google Onboarding</h3>
                          <p className="text-xs text-slate-500 mt-0.5">Link your Google account to skip manual password creation and verify your profile instantly.</p>
                        </div>
                        <span className="hidden sm:inline-flex rounded-full bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 text-[10px] font-bold">Recommended</span>
                      </div>
                      <GoogleAuthButton label="Continue & Link with Google" previousEmail={email} variant="white" className="border-slate-300 text-slate-800 hover:bg-slate-50 py-2.5 text-sm font-semibold" />
                    </div>

                    <div className="relative flex items-center gap-3">
                      <div className="flex-1 border-t border-slate-200" />
                      <span className="text-[10px] font-enterprise text-slate-400 uppercase tracking-widest shrink-0">Or set password &amp; create credentials</span>
                      <div className="flex-1 border-t border-slate-200" />
                    </div>

                    <form onSubmit={handleFinalSubmit} className="rounded-2xl border border-slate-200 bg-white divide-y divide-slate-100">
                      {/* Password */}
                      <div className="p-5 sm:p-6 space-y-4">
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                          <Lock size={13} /> Account Credentials
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Choose Password *</label>
                            <div className="relative">
                              <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" required
                                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all" />
                              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer">
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                              </button>
                            </div>
                            {password && (
                              <p className={`mt-1.5 text-[11px] flex items-center gap-1.5 ${password.length >= 8 ? "text-emerald-600" : "text-amber-600"}`}>
                                <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${password.length >= 8 ? "bg-emerald-500" : "bg-amber-400"}`} />
                                {password.length >= 8 ? "Password length satisfied" : "Must be at least 8 characters"}
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Confirm Password *</label>
                            <input type={showPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Re-enter chosen password" required
                              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all" />
                          </div>
                        </div>
                      </div>

                      {/* Consents */}
                      <div className="p-5 sm:p-6 space-y-3">
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                          <ShieldCheck size={13} /> Statutory Consents &amp; Candidate Agreements
                        </h3>
                        {[
                          { checked: agreeTerms, setter: setAgreeTerms, title: "Terms of Service (v2.1)", desc: "I acknowledge and agree to the Pepoltek Talent Network Terms of Service governing candidate representation and placement workflows." },
                          { checked: agreePrivacy, setter: setAgreePrivacy, title: "Candidate Privacy & Encrypted Dossier (v2.1)", desc: "I authorize the secure processing of my encrypted professional dossier in compliance with GDPR, HIPAA, and data protection regulations." },
                          { checked: agreeMatching, setter: setAgreeMatching, title: "Automated Talent Matching & Placement Authorization (v2.1)", desc: "I authorize Pepoltek recruiters and algorithm match engines to index my verified credentials and submit my dossier to matching employer requisitions." },
                        ].map((item, idx) => (
                          <label key={idx} className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 cursor-pointer hover:bg-slate-50 transition-colors">
                            <input type="checkbox" checked={item.checked} onChange={(e) => item.setter(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 accent-blue-600" />
                            <div className="text-xs text-slate-700 leading-relaxed">
                              <strong className="text-slate-900 block font-semibold mb-0.5">{item.title}</strong>
                              {item.desc}
                            </div>
                          </label>
                        ))}
                      </div>

                      <div className="p-5 sm:p-6 flex items-center justify-between">
                        <button type="button" onClick={() => setCurrentStage(3)} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                          <ArrowRight size={14} className="rotate-180" /> Back
                        </button>
                        <button type="submit" id="stage4-submit-btn" disabled={isSubmitting} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98] px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-500/25 transition-all disabled:opacity-50 cursor-pointer">
                          {isSubmitting ? (
                            <><Sparkles size={15} className="animate-spin" /> Creating Account...</>
                          ) : (
                            <>Create Account &amp; Proceed to Verification <ArrowRight size={16} /></>
                          )}
                        </button>
                      </div>
                    </form>
                  </>
                ) : (
                  // Identity Verification Gateway
                  <div className="space-y-5">
                    <div>
                      <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 text-xs font-semibold mb-2">
                        <CheckCircle size={12} className="text-emerald-600" /> Dossier Ingested &bull; Identity Verification Gateway
                      </div>
                      <h1 className="text-[26px] sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">Confirm Candidate Identity</h1>
                      <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                        Merge with your Google account or confirm your email with a 6-digit PIN to activate your profile for client requisitions.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-base">{fullName ? fullName[0].toUpperCase() : "C"}</div>
                        <div>
                          <div className="text-sm font-bold text-slate-900">{fullName}</div>
                          <div className="text-xs text-slate-500 font-enterprise">{email} &bull; {domainOrSpecialty || selectedTrack.toUpperCase()}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 text-xs font-semibold">{parsedScores.readinessTier}</span>
                        <span className="rounded-full bg-slate-100 text-slate-600 px-3 py-1 text-xs font-medium">Pending Activation</span>
                      </div>
                    </div>

                    {verificationStatus && (
                      <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-xs font-enterprise text-emerald-800 animate-in fade-in-0 duration-200">
                        <CheckCircle size={14} className="text-emerald-600 shrink-0" /> {verificationStatus}
                      </div>
                    )}
                    {verificationError && (
                      <div className="flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 px-4 py-3 text-xs font-enterprise text-rose-800 animate-in fade-in-0 duration-200">
                        <AlertTriangle size={14} className="text-rose-600 shrink-0" /> {verificationError}
                      </div>
                    )}

                    {verifiedSuccess ? (
                      <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-10 text-center animate-in zoom-in-95 duration-300">
                        <CheckCircle size={44} className="mx-auto mb-3 text-emerald-600" />
                        <h2 className="text-xl font-bold text-slate-900">Identity Confirmed Successfully</h2>
                        <p className="text-sm text-slate-500 mt-1">Account activated. Redirecting to your candidate workspace...</p>
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-slate-200 bg-white divide-y divide-slate-100">
                        {/* Option 1: Google */}
                        <div className="p-5 sm:p-6 space-y-3">
                          <div>
                            <h3 className="text-sm font-bold text-slate-900">Option 1: Fast-Track Google Verification &amp; Merge</h3>
                            <p className="text-xs text-slate-500 mt-0.5">One-click confirmation. Auto-syncs profile if you select another Google account.</p>
                          </div>
                          <GoogleAuthButton label="Verify & Link with Google ID" previousEmail={email} variant="white" className="border-slate-300 text-slate-800 hover:bg-slate-50 py-3 text-sm font-semibold" />
                        </div>

                        <div className="px-6 py-3 flex items-center gap-3 bg-slate-50">
                          <div className="flex-1 border-t border-slate-200" />
                          <span className="text-[10px] font-enterprise text-slate-400 uppercase tracking-widest shrink-0">Or confirm with 6-digit email PIN</span>
                          <div className="flex-1 border-t border-slate-200" />
                        </div>

                        {/* Option 2: OTP */}
                        <div className="p-5 sm:p-6 space-y-4">
                          <div>
                            <h3 className="text-sm font-bold text-slate-900">Option 2: Email Verification (Manual OTP PIN)</h3>
                            <p className="text-xs text-slate-500 mt-0.5">We dispatch a secure 6-digit authentication code to verify ownership of your contact email.</p>
                          </div>

                          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
                            <div className="flex items-center justify-between text-[10px] font-enterprise uppercase tracking-wider text-slate-400 mb-1.5">
                              <span>Target Verification Email</span>
                              {!isEditingVerificationEmail && (
                                <button type="button" onClick={() => { setNewEmailInput(email); setIsEditingVerificationEmail(true); }} className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700 cursor-pointer">
                                  <Edit3 size={11} /> Change Email
                                </button>
                              )}
                            </div>
                            {isEditingVerificationEmail ? (
                              <form onSubmit={handleSaveVerificationEmail} className="flex items-center gap-2">
                                <input type="email" value={newEmailInput} onChange={(e) => setNewEmailInput(e.target.value)} placeholder="Enter updated email" autoFocus
                                  className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 font-enterprise text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none" />
                                <button type="submit" disabled={emailSaving} className="rounded-lg bg-blue-600 hover:bg-blue-700 px-3 py-1.5 text-xs font-bold text-white cursor-pointer disabled:opacity-50 shadow-xs">{emailSaving ? "Saving..." : "Save"}</button>
                                <button type="button" onClick={() => { setNewEmailInput(email); setIsEditingVerificationEmail(false); }} className="rounded-lg border border-slate-300 p-1.5 text-slate-500 hover:text-slate-800 cursor-pointer"><X size={14} /></button>
                              </form>
                            ) : (
                              <div className="font-enterprise text-sm font-bold text-blue-700 truncate">{email}</div>
                            )}
                          </div>

                          {!otpDispatched ? (
                            <button type="button" onClick={handleDispatchOtp} disabled={dispatchingOtp || isEditingVerificationEmail}
                              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 py-3 text-sm font-bold text-white transition-all active:scale-[0.99] disabled:opacity-50 cursor-pointer shadow-md shadow-blue-500/25">
                              {dispatchingOtp ? <><RefreshCw size={15} className="animate-spin" /> Dispatching PIN...</> : <><Mail size={15} /> Send 6-Digit PIN to Email</>}
                            </button>
                          ) : (
                            <div className="space-y-3 animate-in fade-in-0 duration-200">
                              <div className="flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-[11px] font-enterprise text-blue-800">
                                <span className="flex items-center gap-1.5"><Zap size={12} className="text-blue-500" /> Test Sandbox PIN: <strong className="text-slate-900">749201</strong></span>
                                <button type="button" onClick={handleFillTestOtp} className="rounded bg-blue-600 px-2 py-0.5 text-[10px] font-bold text-white hover:bg-blue-700 cursor-pointer">Auto-Fill</button>
                              </div>
                              <form onSubmit={handleVerifyOtp} className="space-y-4">
                                <div className="flex justify-center gap-2">
                                  {otpDigits.map((digit, idx) => (
                                    <input key={idx} ref={(el) => { otpInputRefs.current[idx] = el; }} type="text" inputMode="numeric" maxLength={1} value={digit}
                                      onPaste={handleOtpPaste} onChange={(e) => handleOtpChange(idx, e.target.value)} onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                                      className="h-12 w-11 rounded-xl border-2 border-slate-300 bg-white text-center font-enterprise text-lg font-bold text-slate-900 transition-all focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20" />
                                  ))}
                                </div>
                                <button type="submit" disabled={verifyingOtp || otpDigits.join("").length < 6}
                                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 py-3 text-sm font-bold text-white transition-all active:scale-[0.99] disabled:opacity-40 cursor-pointer shadow-md shadow-blue-500/25">
                                  {verifyingOtp ? <><RefreshCw size={15} className="animate-spin" /> Verifying PIN...</> : <>Verify PIN &amp; Activate Dossier <ArrowRight size={15} /></>}
                                </button>
                                <div className="flex items-center justify-between text-xs text-slate-500 font-enterprise">
                                  <button type="button" onClick={handleDispatchOtp} disabled={otpTimer > 0 || dispatchingOtp}
                                    className={otpTimer > 0 ? "text-slate-400 cursor-not-allowed" : "text-blue-600 hover:underline cursor-pointer"}>
                                    {otpTimer > 0 ? `Resend PIN (${otpTimer}s)` : "Resend PIN"}
                                  </button>
                                  <button type="button" onClick={() => { setNewEmailInput(email); setIsEditingVerificationEmail(true); }} className="text-slate-500 hover:text-slate-800 cursor-pointer">Change target email</button>
                                </div>
                              </form>
                            </div>
                          )}

                          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                            <button type="button" onClick={() => setVerificationMode(false)} className="text-xs font-medium text-slate-400 hover:text-slate-800 cursor-pointer">
                              &larr; Return to Credentials
                            </button>
                            <button type="button" onClick={() => router.push("/candidate/dashboard?registered=true")} className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 cursor-pointer">
                              Skip for now &amp; explore dashboard <ArrowRight size={13} />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

          </main>
        </div>
      </div>
    </div>
  );
}
