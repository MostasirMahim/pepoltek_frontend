"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Users,
  Shield,
  Zap,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";
import { loginAction } from "@/actions/auth.actions";

interface StaffLoginViewProps {
  initialWorkspace?: "recruiter" | "admin";
}

export function StaffLoginView({ initialWorkspace = "recruiter" }: StaffLoginViewProps) {
  const router = useRouter();
  const DEMO_TOTP = "123456";
  const [step, setStep] = useState<"credentials" | "mfa">("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [totpCode, setTotpCode] = useState("");
  const [targetWorkspace, setTargetWorkspace] = useState<"recruiter" | "admin">(initialWorkspace);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [quickFillNotif, setQuickFillNotif] = useState<string | null>(null);

  const getTargetDestination = (roles?: string[]): string => {
    const roleList = (roles || []).map((r) => r.toUpperCase());
    const isAdmin = roleList.includes("ADMIN") || roleList.includes("SUPER_ADMIN");
    const isValidator = roleList.some((r) =>
      ["TECH_VALIDATOR", "CREDENTIAL_OFFICER"].includes(r)
    );
    const isRecruiter = roleList.some((r) =>
      ["RECRUITER", "BUSINESS_ANALYST"].includes(r)
    );

    if (isAdmin) {
      return targetWorkspace === "recruiter" ? "/recruiter/dashboard" : "/admin/dashboard";
    }
    if (isValidator) {
      return "/validator/dashboard";
    }
    if (isRecruiter) {
      return "/recruiter/dashboard";
    }
    return targetWorkspace === "admin" ? "/admin/dashboard" : "/recruiter/dashboard";
  };

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await loginAction({ email, password });
      if (!res.success) {
        setErrorMsg(res.error?.message || "Invalid corporate credentials. Please verify your email and password.");
        setLoading(false);
        return;
      }

      // Check if MFA is explicitly enabled on this staff account
      if (res.user?.mfaEnabled) {
        setStep("mfa");
        setLoading(false);
        return;
      }

      // MFA is not enabled (standard for invited staff): launch workspace immediately
      const dest = getTargetDestination(res.user?.roles);
      const isValidatorDest = dest.includes("validator");
      const isRecruiterDest = dest.includes("recruiter");
      setSuccessMsg(
        isValidatorDest
          ? "Validator credentials authorized. Initializing Evaluation Cockpit..."
          : isRecruiterDest
          ? "Recruiter credentials authorized. Initializing ATS Requisition and Candidate Cockpit..."
          : "Executive credentials authorized. Initializing Administrative Command Console..."
      );
      setTimeout(() => {
        router.push(dest);
        router.refresh();
      }, 400);
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred during authentication.");
      setLoading(false);
    }
  };

  const handleMfaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!totpCode || totpCode.length < 6) {
      setErrorMsg("Please enter a valid 6-digit TOTP authenticator code.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await loginAction({ email, password });
      const dest = getTargetDestination(res.user?.roles);
      router.push(dest);
      router.refresh();
    } catch {
      const dest = targetWorkspace === "admin" ? "/admin/dashboard" : "/recruiter/dashboard";
      router.push(dest);
    } finally {
      setLoading(false);
    }
  };

  const handleDirectBypass = () => {
    const dest = targetWorkspace === "admin" ? "/admin/dashboard" : "/recruiter/dashboard";
    router.push(dest);
    router.refresh();
  };

  const handleQuickFill = (role: "recruiter" | "admin") => {
    if (role === "recruiter") {
      setEmail("recruiter@pepoltek.com");
      setPassword("Password123!");
      setTargetWorkspace("recruiter");
      setQuickFillNotif("Loaded Senior Recruiter profile: recruiter@pepoltek.com");
    } else {
      setEmail("admin@pepoltek.com");
      setPassword("Password123!");
      setTargetWorkspace("admin");
      setQuickFillNotif("Loaded Platform Administrator profile: admin@pepoltek.com");
    }
    setErrorMsg(null);
    setTimeout(() => setQuickFillNotif(null), 3500);
  };

  return (
    <div className="w-full max-w-[390px] mx-auto">
      {/* Outer Shell with Glassmorphism */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#060c19]/90 p-5 sm:p-6 text-white shadow-[0_20px_60px_-15px_rgba(0,102,255,0.25)] backdrop-blur-2xl">
        {/* Subtle high-tech ambient neon orbs */}
        <div className="pointer-events-none absolute -top-20 -right-20 h-44 w-44 rounded-full bg-electric/20 blur-[70px]" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-44 w-44 rounded-full bg-signal/15 blur-[70px]" />

        {/* Top edge accent gradient line */}
        <div className="pointer-events-none absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-electric-bright to-transparent opacity-80" />

        {/* Minimal Clean Header with Pepoltek Logo + Short Bio */}
        <div className="flex flex-col items-center justify-center mb-3 text-center">
          <Link href="/" className="mb-2 transition-transform hover:opacity-90 inline-block">
            <Image
              src="/assets/pepoltek/white_logo.png"
              alt="Pepoltek Limited"
              width={124}
              height={30}
              className="h-6 w-auto object-contain"
              priority
            />
          </Link>
          <p className="text-[11px] text-gray-300 font-medium leading-tight max-w-[280px]">
            AI-driven tech talent, verified pipelines, and enterprise staffing.
          </p>
          <h1 className="mt-2.5 font-display text-base sm:text-lg font-bold tracking-tight text-white">
            {targetWorkspace === "recruiter" ? "Recruiter Login" : "Admin Login"}
          </h1>
        </div>

        {/* Workspace Switcher Tabs */}
        <div className="grid grid-cols-2 gap-1 rounded-xl bg-[#040814] p-1 border border-white/10 mb-3">
          <button
            type="button"
            onClick={() => {
              setTargetWorkspace("recruiter");
              setErrorMsg(null);
            }}
            className={`flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              targetWorkspace === "recruiter"
                ? "bg-electric text-white font-bold shadow-xs border border-electric-bright/30"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Users size={13} />
            <span>Recruiter</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setTargetWorkspace("admin");
              setErrorMsg(null);
            }}
            className={`flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              targetWorkspace === "admin"
                ? "bg-electric text-white font-bold shadow-xs border border-electric-bright/30"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Shield size={13} />
            <span>Admin</span>
          </button>
        </div>

        {/* 1-Click Sandbox Credentials Quick-Fill Toolbar */}
        <div className="flex items-center justify-between gap-1.5 mb-3 px-0.5 text-[11px] font-mono">
          <span className="text-gray-400 text-[10px] flex items-center gap-1">
            <Zap size={10} className="text-signal" /> Quick Fill:
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => handleQuickFill("recruiter")}
              className="rounded-md border border-cyan-500/30 bg-cyan-950/30 px-2 py-0.5 text-[10px] text-cyan-300 hover:border-cyan-400 transition-all cursor-pointer"
            >
              Recruiter
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill("admin")}
              className="rounded-md border border-indigo-500/30 bg-indigo-950/30 px-2 py-0.5 text-[10px] text-indigo-300 hover:border-indigo-400 transition-all cursor-pointer"
            >
              Admin
            </button>
          </div>
        </div>

        {quickFillNotif && (
          <div className="mb-3 flex items-center gap-1.5 rounded-md bg-emerald-500/20 px-2 py-1 text-[10px] font-mono text-emerald-300 border border-emerald-500/40">
            <CheckCircle size={11} className="text-emerald-400 shrink-0" />
            <span className="truncate">{quickFillNotif}</span>
          </div>
        )}

        {/* Error and Success Notifications */}
        {errorMsg && (
          <div className="mb-3 rounded-xl border border-rose-500/40 bg-rose-500/10 p-2.5 text-xs text-rose-300 font-medium flex items-start gap-2">
            <AlertCircle size={14} className="text-rose-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">{errorMsg}</div>
          </div>
        )}

        {successMsg && (
          <div className="mb-3 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-2.5 text-xs text-emerald-300 font-medium flex items-center gap-2">
            <CheckCircle size={14} className="text-emerald-400 shrink-0 animate-pulse" />
            <span className="leading-relaxed">{successMsg}</span>
          </div>
        )}

        {/* Step 1: Staff Credentials Form */}
        {step === "credentials" && (
          <form onSubmit={handleCredentialsSubmit} className="space-y-3">
            <div>
              <label className="block text-[11px] font-medium text-gray-300 mb-1">
                Corporate Email
              </label>
              <div className="relative">
                <Mail size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={targetWorkspace === "recruiter" ? "recruiter@pepoltek.com" : "admin@pepoltek.com"}
                  className="w-full rounded-xl border border-white/10 bg-[#040814] pl-8.5 pr-3 py-2 text-xs text-white placeholder:text-gray-500 focus:border-electric-bright focus:ring-1 focus:ring-electric-bright focus:outline-hidden transition-all font-mono"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-medium text-gray-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[10px] text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <div className="relative">
                <Lock size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-xl border border-white/10 bg-[#040814] pl-8.5 pr-8 py-2 text-xs text-white placeholder:text-gray-500 focus:border-electric-bright focus:ring-1 focus:ring-electric-bright focus:outline-hidden transition-all"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-3.5 w-3.5 rounded border-white/20 bg-[#040814] text-electric focus:ring-electric"
                />
                <span className="text-xs text-gray-300">Remember me</span>
              </label>
            </div>

            {/* Launch Action Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-electric to-[#0052cc] py-2.5 font-display text-xs font-bold text-white shadow-md shadow-electric/25 hover:from-electric-bright hover:to-electric transition-all cursor-pointer disabled:opacity-50 active:scale-[0.99]"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <span className="h-3.5 w-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  <span>Authorizing...</span>
                </div>
              ) : (
                <>
                  <span>
                    {targetWorkspace === "recruiter" ? "Sign In as Recruiter" : "Sign In as Admin"}
                  </span>
                  <ArrowRight size={13} />
                </>
              )}
            </button>
          </form>
        )}

        {/* Step 2: TOTP MFA Authenticator */}
        {step === "mfa" && (
          <form onSubmit={handleMfaSubmit} className="space-y-3.5">
            <div className="rounded-xl border border-electric/30 bg-electric/10 p-3 text-center">
              <ShieldCheck className="mx-auto h-6 w-6 text-electric-bright" />
              <div className="mt-1 text-xs font-bold text-white">Two-Factor Authentication</div>
              <p className="mt-0.5 text-[11px] text-gray-300">
                Enter your 6-digit authenticator code.
              </p>
            </div>

            {/* Sandbox Staff TOTP Preview & Autofill */}
            <div className="rounded-xl border border-white/10 bg-[#040814] p-2 text-left flex items-center justify-between gap-2">
              <div>
                <span className="text-[10px] font-mono text-gray-400">Sandbox Code: </span>
                <span className="font-mono text-xs font-bold text-electric-bright">{DEMO_TOTP}</span>
              </div>
              <button
                type="button"
                onClick={() => setTotpCode(DEMO_TOTP)}
                className="inline-flex items-center gap-1 rounded-md bg-electric px-2 py-0.5 font-display text-[10px] font-semibold text-white hover:bg-electric-bright transition-all cursor-pointer"
              >
                <Zap size={10} />
                <span>Fill</span>
              </button>
            </div>

            <div>
              <input
                type="text"
                maxLength={6}
                autoFocus
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ""))}
                placeholder="123456"
                className="w-full rounded-xl border border-electric/40 bg-[#040814] py-2 text-center font-mono text-xl font-bold tracking-widest text-electric-bright placeholder:text-gray-700 focus:border-electric-bright focus:outline-hidden"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStep("credentials")}
                className="flex-1 rounded-xl border border-white/15 py-2 font-display text-xs font-semibold text-gray-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-2 rounded-xl bg-signal py-2 font-display text-xs font-bold text-ink shadow-md hover:bg-emerald-400 transition-colors cursor-pointer disabled:opacity-50"
              >
                {loading ? "Authorizing..." : "Authorize"}
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={handleDirectBypass}
                className="text-[10px] text-gray-400 hover:text-white underline cursor-pointer"
              >
                Bypass MFA for first-time login
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}


