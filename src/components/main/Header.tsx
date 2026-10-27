"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Briefcase,
  Sparkles,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  User,
  ArrowUpRight,
  Code,
  Users,
  Globe,
  ShieldCheck,
  Activity,
  Building2,
  Zap,
  DollarSign,
  FileCheck,
  Clock,
  CheckCircle2,
  Search,
} from "lucide-react";
import { AnimatedChevrons } from "@/components/ui/AnimatedChevrons";
import { logoutAction } from "@/actions/auth.actions";
import { getPublicSiteContentAction } from "@/actions/content.actions";
import HireFastModal from "@/components/main/HireFastModal";

interface DropdownItem {
  title: string;
  desc: string;
  href: string;
  badge?: string;
  icon: React.ReactNode;
}

interface NavSection {
  label: string;
  href: string;
  eyebrow: string;
  items: DropdownItem[];
  spotlight: {
    headline: string;
    sub: string;
    cta: string;
    href: string;
  };
  layout?: "single" | "dual";
}

const NAV_DATA: NavSection[] = [
  {
    label: "Services & Solutions",
    href: "/services",
    eyebrow: "01 · Regulated Delivery Models",
    layout: "dual",
    items: [
      {
        title: "IT Staff Augmentation",
        desc: "W2 & C2C senior engineering bandwidth with 2-week risk-free trial.",
        href: "/services",
        badge: "Elastic",
        icon: (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        ),
      },
      {
        title: "Multi-Seat Engineering Teams",
        desc: "Autonomous cross-functional delivery teams managed by in-house leads.",
        href: "/services",
        badge: "Turnkey",
        icon: (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" />
          </svg>
        ),
      },
      {
        title: "Employer of Record (EOR)",
        desc: "Global compliant payroll, taxation, and labor governance across 15+ countries.",
        href: "/services",
        badge: "15+ Countries",
        icon: (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
      },
      {
        title: "Direct Hire & Search",
        desc: "Contingent and retained executive recruitment with a 90-day replacement guarantee.",
        href: "/services",
        badge: "Permanent",
        icon: (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        ),
      },
      {
        title: "Training & Academy Readiness",
        desc: "Pre-deployment skill bootcamps, architectural vetting, and compliance readiness.",
        href: "/ecosystem/academy",
        badge: "Academy",
        icon: (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        ),
      },
      {
        title: "Technical Case Studies",
        desc: "Inspect microservices blueprints, data schemas, and hard-coded audit benchmarks.",
        href: "/case-studies",
        badge: "Proof",
        icon: (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        ),
      },
    ],
    spotlight: {
      headline: "7-Day Sprint Deployment",
      sub: "From technical brief to fully productive specialist in 7 days flat.",
      cta: "Explore Solutions",
      href: "/services",
    },
  },
  {
    label: "Healthcare & Compliance",
    href: "/healthcare",
    eyebrow: "02 · Regulated Clinical & Med-Tech",
    layout: "dual",
    items: [
      {
        title: "Clinical Medical Staffing",
        desc: "Licensed physicians, registered nurses for emergency, outpatient, and ICU.",
        href: "/healthcare",
        badge: "Clinical",
        icon: (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        ),
      },
      {
        title: "Non-Clinical Healthcare Staffing",
        desc: "Healthcare administrators, EMR and EHR directors, medical billing and coding.",
        href: "/healthcare",
        badge: "Operations",
        icon: (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        ),
      },
      {
        title: "Health-Tech Engineering",
        desc: "Interoperability engineers specializing in Epic, Cerner, FHIR, and HL7 protocols.",
        href: "/case-studies",
        badge: "Integration",
        icon: (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
          </svg>
        ),
      },
      {
        title: "HIPAA & PCI DSS Frameworks",
        desc: "Institutional data handling, encrypted remote setups, and signed BAA agreements.",
        href: "/healthcare",
        badge: "Audited",
        icon: (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        ),
      },
    ],
    spotlight: {
      headline: "100% HIPAA-Compliant Delivery",
      sub: "Pre-vetted clinical personnel and health-tech squads ready for hospital networks.",
      cta: "Explore Healthcare Practice",
      href: "/healthcare",
    },
  },
  {
    label: "Careers & Jobs",
    href: "/jobs",
    eyebrow: "03 · Live Opportunities & Openings",
    layout: "single",
    items: [
      {
        title: "Browse Open Positions",
        desc: "Explore live software engineering pods, clinical staffing squads, and contract gigs.",
        href: "/jobs",
        badge: "Live Reqs",
        icon: (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        ),
      },
      {
        title: "Careers Overview",
        desc: "Discover our remote-first culture, deployment standards, and guaranteed rates.",
        href: "/career",
        badge: "Culture",
        icon: (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        ),
      },
      {
        title: "Refer & Earn Bounty Network",
        desc: "Refer talented peers and earn cash bounties up to $3,500 upon placement.",
        href: "/ecosystem/referrals",
        badge: "Up to $3,500",
        icon: (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
      },
      {
        title: "Upload Your CV",
        desc: "Instant automated AI resume parsing and candidate telemetry profiling.",
        href: "/career/upload_cv",
        badge: "Intake",
        icon: (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
        ),
      },
    ],
    spotlight: {
      headline: "7-Day Sprint Deployment SLA",
      sub: "Explore verified enterprise openings with transparent hourly rates and escrow protection.",
      cta: "Explore Open Jobs",
      href: "/jobs",
    },
  },
  {
    label: "About Us",
    href: "/about",
    eyebrow: "04 · Core Infrastructure",
    layout: "single",
    items: [
      {
        title: "In-House Delivery Engine",
        desc: "Specialized recruiters, business analysts, and active software engineers.",
        href: "/about",
        badge: "In-House",
        icon: (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        ),
      },
      {
        title: "Chasing The Sun Matrix",
        desc: "Talent hubs across 4 longitudes for guaranteed live overlap.",
        href: "/about",
        badge: "4 Hubs",
        icon: (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
      },
      {
        title: "Operational Excellence",
        desc: "20+ combined years, 30+ enterprise clients, and 98% retention rate.",
        href: "/about",
        badge: "20+ Years",
        icon: (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
      },
      {
        title: "SOC 2 & HIPAA Governance",
        desc: "Institutional data security and BAA compliance across all client deployments.",
        href: "/about",
        badge: "Certified",
        icon: (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        ),
      },
    ],
    spotlight: {
      headline: "Zero-Risk Engineering Deployment",
      sub: "40+ hours reclaimed per hire with guaranteed 2-week risk-free trials.",
      cta: "Explore Our Model",
      href: "/about",
    },
  },
  {
    label: "For Talent",
    href: "/career/upload_cv",
    eyebrow: "05 · Global Talent Network",
    layout: "single",
    items: [
      {
        title: "Browse Open Positions",
        desc: "Live software engineering pods and clinical staffing squads with transparent pay.",
        href: "/jobs",
        badge: "Live Reqs",
        icon: (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        ),
      },
      {
        title: "Upload Your CV",
        desc: "Instant AI resume parsing and candidate telemetry profile builder.",
        href: "/career/upload_cv",
        badge: "Intake",
        icon: (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
        ),
      },
      {
        title: "Reverse Job Sourcing Search",
        desc: "Let venture-backed employers and hiring managers apply to hire you.",
        href: "/talents/reverse-search",
        badge: "Zero Exposure",
        icon: (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        ),
      },
      {
        title: "Talent Academy Bootcamps",
        desc: "Upskill in RAG architectures, HIPAA compliance, and enterprise standups.",
        href: "/ecosystem/academy",
        badge: "Upskilling",
        icon: (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        ),
      },
      {
        title: "Refer & Earn Bounty Network",
        desc: "Refer talented peers and earn up to $500 cash bounty per placement.",
        href: "/ecosystem/referrals",
        badge: "Up to $500",
        icon: (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
      },
      {
        title: "Candidate Talent Dashboard",
        desc: "Access your verified telemetry, ATS score, and application status.",
        href: "/candidate/dashboard",
        badge: "Portal",
        icon: (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        ),
      },
    ],
    spotlight: {
      headline: "Confidential Reverse Matching",
      sub: "Build your candidate profile and scan live client pipelines with zero exposure.",
      cta: "Upload Your CV",
      href: "/career/upload_cv",
    },
  },
];

function getDynamicIcon(iconName?: string) {
  switch (iconName) {
    case "Code":
      return <Code size={15} />;
    case "Users":
      return <Users size={15} />;
    case "Globe":
      return <Globe size={15} />;
    case "Briefcase":
      return <Briefcase size={15} />;
    case "Sparkles":
      return <Sparkles size={15} />;
    case "ShieldCheck":
      return <ShieldCheck size={15} />;
    case "Activity":
      return <Activity size={15} />;
    case "Building2":
      return <Building2 size={15} />;
    case "Zap":
      return <Zap size={15} />;
    case "DollarSign":
      return <DollarSign size={15} />;
    case "FileCheck":
      return <FileCheck size={15} />;
    case "Clock":
      return <Clock size={15} />;
    case "CheckCircle2":
      return <CheckCircle2 size={15} />;
    case "Search":
      return <Search size={15} />;
    case "User":
      return <User size={15} />;
    default:
      return <Briefcase size={15} />;
  }
}

export default function Header() {
  const [navData, setNavData] = useState<NavSection[]>(NAV_DATA);
  const [scrolled, setScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<number | null>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [currentUser, setCurrentUser] = useState<{
    fullName: string;
    role: string;
    email?: string;
  } | null>(null);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const [hireModalOpen, setHireModalOpen] = useState(false);

  useEffect(() => {
    async function loadDynamicNav() {
      try {
        const res = await getPublicSiteContentAction<any>("site_navigation");
        if (
          res.success &&
          res.data?.sections &&
          Array.isArray(res.data.sections) &&
          res.data.sections.length > 0
        ) {
          const transformed: NavSection[] = res.data.sections.map((sec: any) => ({
            label: sec.label,
            href: sec.href,
            eyebrow: sec.eyebrow,
            layout: sec.layout || "single",
            items: (sec.items || []).map((it: any) => ({
              title: it.title,
              desc: it.desc,
              href: it.href,
              badge: it.badge,
              icon: typeof it.icon === "string" ? getDynamicIcon(it.icon) : (it.icon || <Briefcase size={15} />),
            })),
            spotlight: sec.spotlight || {
              headline: "Enterprise Workforce Solutions",
              sub: "Verified candidates deployed in 2 to 7 days.",
              cta: "Explore Solutions",
              href: sec.href,
            },
          }));
          setNavData(transformed);
        }
      } catch {
        // Fallback to static NAV_DATA
      }
    }
    loadDynamicNav();
  }, []);

  useEffect(() => {
    async function checkAuth() {
      try {
        const { getCurrentUserAction } = await import("@/actions/auth.actions");
        const user = await getCurrentUserAction();
        if (user) {
          setCurrentUser({
            fullName: user.fullName || "Candidate",
            role: user.role || "CANDIDATE",
            email: user.email,
          });
        }
      } catch {
        // Guest user
      }
    }
    checkAuth();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logoutAction();
      setCurrentUser(null);
      setProfileDropdownOpen(false);
      window.location.href = "/";
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const getDashboardHref = (role?: string) => {
    if (role === "SUPER_ADMIN" || role === "ADMIN") return "/admin/dashboard";
    if (role === "RECRUITER") return "/recruiter/dashboard";
    return "/candidate/dashboard";
  };

  const getRoleLabel = (role?: string) => {
    if (role === "SUPER_ADMIN") return "Super Admin";
    if (role === "ADMIN") return "Administrator";
    if (role === "RECRUITER") return "Senior Recruiter";
    return "Verified Candidate";
  };

  const getNavOptions = (role?: string) => {
    if (role === "SUPER_ADMIN" || role === "ADMIN") {
      return [
        {
          label: "Admin Workspace",
          href: "/admin/dashboard",
          desc: "System KPIs, users & controls",
          icon: LayoutDashboard,
        },
        {
          label: "User Management",
          href: "/admin/users",
          desc: "Accounts & permissions",
          icon: User,
        },
        {
          label: "Audit Logs",
          href: "/admin/audit-logs",
          desc: "Security and compliance logs",
          icon: Briefcase,
        },
      ];
    }
    if (role === "RECRUITER") {
      return [
        {
          label: "Recruiter Workspace",
          href: "/recruiter/dashboard",
          desc: "Requisitions & pipeline",
          icon: LayoutDashboard,
        },
        {
          label: "Candidate Search",
          href: "/recruiter/candidates",
          desc: "Active talent dossiers",
          icon: User,
        },
        {
          label: "Client Mandates",
          href: "/recruiter/requisitions",
          desc: "Open positions",
          icon: Briefcase,
        },
      ];
    }
    return [
      {
        label: "Candidate Dashboard",
        href: "/candidate/dashboard",
        desc: "Profile status & job matches",
        icon: LayoutDashboard,
      },
      {
        label: "Profile & Dossier",
        href: "/candidate/profile",
        desc: "Skills, experience & CV",
        icon: User,
      },
      {
        label: "Active Applications",
        href: "/candidate/applications",
        desc: "Track interview stages",
        icon: Briefcase,
      },
    ];
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMouseEnter = (index: number) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setActiveMenu(index);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 180);
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-[#bcd6fa]/40 bg-canvas/95 shadow-[0_8px_30px_-6px_rgba(10,20,40,0.08)] backdrop-blur-md py-2.5"
          : "bg-transparent pt-3.5 pb-2.5"
      }`}
    >
      <div className="mx-auto flex max-w-7xl 2xl:max-w-[1360px] items-center justify-between gap-2 sm:gap-3 lg:gap-4 px-4 sm:px-6 lg:px-8">
        
        {/* Left: black logo */}
        <Link href="/" className="group flex shrink-0 items-center transition-transform hover:opacity-90">
          <Image
            src="/assets/pepoltek/black_logo.png"
            alt="Pepoltek Limited"
            width={160}
            height={40}
            className="h-8 w-auto object-contain sm:h-9"
            priority
          />
        </Link>

        {/* Middle: Desktop Nav with Interactive Mega Dropdowns */}
        <nav
          className="hidden items-center gap-0.5 xl:gap-1.5 lg:flex shrink-0"
          onMouseLeave={handleMouseLeave}
        >
          {navData.map((section, idx) => {
            const isOpen = activeMenu === idx;
            return (
              <div
                key={section.label}
                className={`relative ${idx >= 4 ? "hidden 2xl:block" : ""}`}
                onMouseEnter={() => handleMouseEnter(idx)}
              >
                {/* Top-level Nav Pill Button */}
                <Link
                  href={section.href}
                  className={`group inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 xl:px-4 py-1.5 xl:py-2 font-mono text-[10.5px] xl:text-[11px] font-semibold uppercase tracking-[0.07em] xl:tracking-[0.12em] transition-all duration-200 ${
                    isOpen
                      ? "bg-electric/[0.09] text-electric"
                      : "text-[#3d4c68] hover:bg-black/[0.04] hover:text-[#0a1428]"
                  }`}
                >
                  <span className="whitespace-nowrap">{section.label}</span>
                  <svg
                    className={`h-3 w-3 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-electric" : "text-[#7d91b0] group-hover:text-electric"
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </Link>

                {/* Dropdown Card */}
                {isOpen && (
                  <div
                    className={`absolute top-full pt-3 z-50 animate-in fade-in-0 zoom-in-95 duration-200 ${
                      idx === 3
                        ? "-right-12 sm:right-0 w-[540px]"
                        : idx === 2
                        ? "-left-20 sm:-left-12 w-[520px]"
                        : idx === 1
                        ? "-left-48 sm:-left-36 w-[660px]"
                        : "-left-12 sm:left-0 w-[680px]"
                    }`}
                  >
                    {/* Floating Glass Shell */}
                    <div className="relative overflow-hidden rounded-2xl border border-[#bcd6fa]/70 bg-white/95 p-6 shadow-[0_25px_70px_-15px_rgba(10,20,40,0.22)] backdrop-blur-xl">
                      
                      {/* Ambient corner highlights */}
                      <div className="pointer-events-none absolute -right-20 -top-20 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.2),transparent_70%)] blur-2xl" />
                      <div className="pointer-events-none absolute -bottom-20 -left-20 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(10,132,255,0.15),transparent_70%)] blur-2xl" />

                      {/* Header Eyebrow inside Dropdown */}
                      <div className="mb-4 flex items-center justify-between border-b border-[#e4eeff] pb-3">
                        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-electric">
                          {section.eyebrow}
                        </span>
                        <span className="font-mono text-[9.5px] uppercase tracking-[0.12em] text-[#8aa0c2]">
                          Pepoltek Engine
                        </span>
                      </div>

                      {/* Items Grid */}
                      <div
                        className={`grid gap-2.5 ${
                          section.layout === "dual" ? "grid-cols-2" : "grid-cols-1"
                        }`}
                      >
                        {section.items.map((item) => (
                          <Link
                            key={item.title}
                            href={item.href}
                            onClick={() => setActiveMenu(null)}
                            className="group/item flex items-start gap-3 rounded-xl p-2.5 transition-all duration-150 hover:bg-[#f2f7ff] hover:shadow-[0_2px_12px_-3px_rgba(10,132,255,0.15)]"
                          >
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-electric/10 text-electric transition-colors duration-150 group-hover/item:bg-electric group-hover/item:text-white">
                              {item.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-display text-[13px] font-bold leading-tight text-[#0a1428] group-hover/item:text-electric transition-colors">
                                  {item.title}
                                </span>
                                {item.badge && (
                                  <span className="rounded bg-electric/10 px-1.5 py-0.5 font-mono text-[9px] font-bold text-electric">
                                    {item.badge}
                                  </span>
                                )}
                              </div>
                              <p className="mt-0.5 text-[11.5px] leading-snug text-[#4f6485]">
                                {item.desc}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>

                      {/* Bottom Spotlight Bar */}
                      <div className="mt-5 rounded-xl border border-electric/20 bg-gradient-to-r from-electric/[0.07] to-transparent p-3.5">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <div className="font-display text-[12.5px] font-bold text-[#0a1428]">
                              {section.spotlight.headline}
                            </div>
                            <div className="mt-0.5 text-[11px] text-[#4f6485]">
                              {section.spotlight.sub}
                            </div>
                          </div>
                          <Link
                            href={section.spotlight.href}
                            onClick={() => setActiveMenu(null)}
                            className="group/cta inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-electric px-3 py-1.5 font-display text-[11.5px] font-semibold text-white shadow-[0_4px_12px_-2px_rgba(10,132,255,0.4)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-electric-bright hover:shadow-[0_6px_16px_-2px_rgba(56,189,248,0.5)]"
                          >
                            <span>{section.spotlight.cta}</span>
                            <span className="transition-transform duration-200 group-hover/cta:translate-x-0.5">→</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Right: Auth buttons & Mobile Hamburger */}
        {/* Right: Auth controls & Mobile Hamburger */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {currentUser ? (
            <div className="relative" ref={profileDropdownRef}>
              <button
                type="button"
                onClick={() => setProfileDropdownOpen((prev) => !prev)}
                aria-expanded={profileDropdownOpen}
                aria-haspopup="menu"
                aria-label={`User menu for ${currentUser.fullName}`}
                className="group/avatar flex items-center gap-2 rounded-full border border-[#bcd6fa]/80 bg-white/95 p-1 sm:pr-3 shadow-[0_2px_8px_-2px_rgba(10,20,40,0.06)] backdrop-blur-md transition-all duration-200 hover:border-[#0066FF]/60 hover:bg-white hover:shadow-[0_4px_16px_-2px_rgba(0,102,255,0.2)] focus:outline-none cursor-pointer"
              >
                {/* Circle Avatar with Initials + Online Dot */}
                <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-[#0066FF] via-[#0088FF] to-[#00D4FF] text-white font-display text-xs sm:text-sm font-extrabold shadow-[0_3px_12px_-2px_rgba(0,102,255,0.45)] ring-[2px] ring-white">
                  <span className="tracking-wide">{getInitials(currentUser.fullName)}</span>
                  <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white ring-1 ring-emerald-400 shadow-xs" />
                </div>

                {/* Name on Desktop */}
                <div className="hidden sm:flex flex-col text-left leading-tight pr-0.5">
                  <span className="font-display text-xs font-bold text-[#0a1428] max-w-[120px] lg:max-w-[150px] truncate group-hover/avatar:text-[#0066FF] transition-colors">
                    {currentUser.fullName}
                  </span>
                  <span className="font-mono text-[9px] font-semibold text-slate-500 uppercase tracking-wider">
                    {getRoleLabel(currentUser.role)}
                  </span>
                </div>

                {/* Dropdown Chevron */}
                <ChevronDown
                  size={14}
                  className={`text-slate-400 transition-transform duration-200 group-hover/avatar:text-[#0066FF] ${
                    profileDropdownOpen ? "rotate-180 text-[#0066FF]" : ""
                  }`}
                />
              </button>

              {/* Dropdown Panel */}
              {profileDropdownOpen && (
                <div
                  role="menu"
                  className="absolute top-full right-0 mt-2.5 w-72 rounded-2xl border border-[#bcd6fa]/80 bg-white/98 p-2.5 shadow-[0_20px_50px_-10px_rgba(10,20,40,0.18)] backdrop-blur-xl z-50 animate-in fade-in-0 zoom-in-95 duration-150 origin-top-right"
                >
                  {/* User Summary Card */}
                  <div className="flex items-center gap-3 rounded-xl bg-gradient-to-br from-[#f0f6ff] to-[#e6efff] p-3 border border-[#bcd6fa]/40 mb-2">
                    <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-[#0066FF] via-[#0088FF] to-[#00D4FF] text-white font-display text-sm font-bold shadow-sm">
                      <span>{getInitials(currentUser.fullName)}</span>
                      <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white ring-1 ring-emerald-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-display text-xs font-bold text-[#0a1428]">
                        {currentUser.fullName}
                      </p>
                      {currentUser.email && (
                        <p className="truncate font-mono text-[11px] text-slate-500">
                          {currentUser.email}
                        </p>
                      )}
                      <span className="mt-1 inline-flex items-center rounded-md bg-[#0066FF]/10 px-1.5 py-0.5 font-mono text-[9px] font-bold text-[#0066FF]">
                        {getRoleLabel(currentUser.role)}
                      </span>
                    </div>
                  </div>

                  {/* Nav Options */}
                  <div className="space-y-0.5">
                    {getNavOptions(currentUser.role).map((opt) => {
                      const Icon = opt.icon;
                      return (
                        <Link
                          key={opt.href}
                          href={opt.href}
                          onClick={() => setProfileDropdownOpen(false)}
                          className="group flex items-center gap-3 rounded-xl px-3 py-2 text-left transition-all hover:bg-[#0066FF]/5 hover:text-[#0066FF]"
                        >
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 group-hover:bg-[#0066FF]/10 group-hover:text-[#0066FF] transition-colors">
                            <Icon size={15} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-display text-xs font-semibold text-[#0a1428] group-hover:text-[#0066FF] transition-colors">
                              {opt.label}
                            </p>
                            <p className="truncate font-mono text-[10px] text-slate-500">
                              {opt.desc}
                            </p>
                          </div>
                          <ArrowUpRight
                            size={13}
                            className="text-slate-400 opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-[#0066FF]"
                          />
                        </Link>
                      );
                    })}
                  </div>

                  {/* Divider */}
                  <div className="my-1.5 border-t border-[#bcd6fa]/50" />

                  {/* Logout Action */}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-rose-600 transition-all hover:bg-rose-50 cursor-pointer"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-600 transition-colors">
                      <LogOut size={15} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-display text-xs font-semibold text-rose-600">
                        Sign out
                      </p>
                      <p className="font-mono text-[10px] text-rose-400">
                        End active session
                      </p>
                    </div>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden items-center justify-center whitespace-nowrap rounded-xl border border-[#bcd6fa] bg-white/80 px-3.5 py-1.5 sm:px-4 sm:py-2 font-display text-xs sm:text-sm font-semibold text-[#0a1428] shadow-[0_2px_8px_-2px_rgba(10,20,40,0.04)] backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-electric/50 hover:bg-white hover:text-electric sm:inline-flex"
              >
                Log in
              </Link>

              <button
                type="button"
                onClick={() => setHireModalOpen(true)}
                className="group inline-flex items-center gap-1.5 sm:gap-2 justify-center whitespace-nowrap rounded-xl bg-[#0a1428] px-3 py-1.5 xs:px-3.5 xs:py-2 sm:px-4.5 sm:py-2 font-display text-[11px] xs:text-xs sm:text-sm font-semibold text-white shadow-[0_6px_16px_-4px_rgba(10,20,40,0.4)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-electric hover:shadow-[0_8px_20px_-4px_rgba(10,132,255,0.5)] cursor-pointer"
              >
                <span>Hire & Deploy</span>
                <AnimatedChevrons size={11} count={3} />
              </button>
            </>
          )}

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#bcd6fa]/80 bg-white/90 text-[#0a1428] transition-colors hover:bg-electric/10 hover:text-electric lg:hidden focus:outline-none cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileOpen ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileOpen && (
        <div className="border-b border-[#bcd6fa]/50 bg-white/98 px-5 py-4 sm:px-6 sm:py-5 shadow-2xl backdrop-blur-2xl lg:hidden max-h-[calc(100vh-68px)] overflow-y-auto animate-in fade-in-0 slide-in-from-top-2 duration-200">
          
          {/* User Profile Card (if authenticated) */}
          {currentUser ? (
            <div className="mb-4 rounded-2xl border border-electric/30 bg-gradient-to-r from-[#f0f7ff] to-white p-3.5 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-[#0066FF] to-[#00D4FF] text-white font-display text-sm font-bold shadow-xs ring-2 ring-white">
                  <span>{getInitials(currentUser.fullName)}</span>
                  <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-display text-sm font-bold text-ink truncate">
                      {currentUser.fullName}
                    </span>
                    <span className="rounded bg-electric/10 px-1.5 py-0.5 font-mono text-[9px] font-bold text-electric uppercase">
                      {currentUser.role}
                    </span>
                  </div>
                  <p className="text-[11px] text-ink-soft truncate font-mono">
                    {currentUser.email || "Active User Session"}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2">
                <Link
                  href={getDashboardHref(currentUser.role)}
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-electric py-2 font-display text-xs font-semibold text-white shadow-xs hover:bg-ink transition-colors"
                >
                  <span>Open Dashboard</span>
                  <span className="font-mono text-[10px]">→</span>
                </Link>
                <button
                  type="button"
                  onClick={async () => {
                    await logoutAction();
                    setCurrentUser(null);
                    setMobileOpen(false);
                    window.location.href = "/";
                  }}
                  className="flex items-center justify-center rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer"
                  title="Sign out"
                >
                  <LogOut size={13} />
                </button>
              </div>
            </div>
          ) : (
            <div className="mb-4 grid grid-cols-2 gap-2">
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center rounded-xl border border-[#bcd6fa] bg-white py-2.5 font-display text-xs font-semibold text-ink shadow-xs hover:border-electric transition-colors"
              >
                Candidate Login
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center rounded-xl bg-electric py-2.5 font-display text-xs font-semibold text-white shadow-xs hover:bg-ink transition-colors"
              >
                Join as Talent
              </Link>
            </div>
          )}

          {/* Quick Action Pills for Mobile */}
          <div className="mb-3.5 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
            <Link
              href="/jobs"
              onClick={() => setMobileOpen(false)}
              className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-[#bcd6fa]/70 bg-canvas/60 px-2.5 py-1.5 font-mono text-[11px] font-semibold text-ink hover:border-electric hover:text-electric transition-colors"
            >
              <Briefcase size={12} className="text-electric" />
              <span>Explore Jobs</span>
            </Link>
            <Link
              href="/career/upload_cv"
              onClick={() => setMobileOpen(false)}
              className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-[#bcd6fa]/70 bg-canvas/60 px-2.5 py-1.5 font-mono text-[11px] font-semibold text-ink hover:border-electric hover:text-electric transition-colors"
            >
              <Sparkles size={12} className="text-electric" />
              <span>Upload CV</span>
            </Link>
            <Link
              href="/services"
              onClick={() => setMobileOpen(false)}
              className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-[#bcd6fa]/70 bg-canvas/60 px-2.5 py-1.5 font-mono text-[11px] font-semibold text-ink hover:border-electric hover:text-electric transition-colors"
            >
              <span>Solutions</span>
            </Link>
          </div>

          {/* Navigation Accordion Sections */}
          <div className="flex flex-col gap-1.5">
            {navData.map((section, sIdx) => {
              const isExpanded = mobileExpanded === sIdx;
              return (
                <div key={section.label} className="rounded-xl border border-[#bcd6fa]/40 bg-white/70 overflow-hidden">
                  <button
                    onClick={() => setMobileExpanded(isExpanded ? null : sIdx)}
                    className="flex w-full items-center justify-between p-3 text-left font-mono text-[11.5px] font-bold uppercase tracking-[0.12em] text-[#0a1428] transition-colors hover:bg-electric/5"
                  >
                    <span>{section.label}</span>
                    <svg
                      className={`h-4 w-4 transition-transform duration-200 ${
                        isExpanded ? "rotate-180 text-electric" : "text-[#7d91b0]"
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isExpanded && (
                    <div className="space-y-1.5 px-3 pb-3 pt-1 border-t border-[#bcd6fa]/30 bg-canvas/30">
                      {section.items.map((item) => (
                        <Link
                          key={item.title}
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-2.5 rounded-lg p-2 text-[12px] font-medium text-[#3d4c68] hover:bg-white hover:text-electric transition-colors shadow-2xs"
                        >
                          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-electric/10 text-electric">
                            {item.icon}
                          </div>
                          <span className="truncate">{item.title}</span>
                          {item.badge && (
                            <span className="ml-auto rounded bg-electric/10 px-1.5 py-0.5 font-mono text-[9px] font-bold text-electric">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom Primary CTA */}
          <div className="mt-4 pt-3 border-t border-[#bcd6fa]/40">
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                setHireModalOpen(true);
              }}
              className="group flex items-center justify-center gap-2 w-full rounded-xl bg-[#0a1428] py-3 font-display text-xs font-semibold text-white shadow-xs hover:bg-electric transition-colors cursor-pointer"
            >
              <span>I Want to Hire Fast</span>
              <AnimatedChevrons size={11} count={3} />
            </button>
          </div>
        </div>
      )}

      {/* Dynamic Hire Fast Modal */}
      <HireFastModal isOpen={hireModalOpen} onClose={() => setHireModalOpen(false)} />
    </header>
  );
}
