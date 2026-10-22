"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, ArrowRight, Lock, CheckCircle, Zap } from "@/components/ui/Icons";

export function StaffLoginView() {
  const router = useRouter();
  const [step, setStep] = useState<"credentials" | "mfa">("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [targetWorkspace, setTargetWorkspace] = useState<"recruiter" | "admin">("recruiter");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setErrorMsg(null);

    // Simulate verified staff check, move to TOTP MFA step
    setTimeout(() => {
      setLoading(false);
      setStep("mfa");
    }, 700);
  };

  const handleMfaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!totpCode || totpCode.length < 6) {
      setErrorMsg("Please enter a valid 6-digit TOTP authenticator code.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    setTimeout(() => {
      setLoading(false);
      if (targetWorkspace === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/recruiter/dashboard");
      }
    }, 900);
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="relative overflow-hidden rounded-3xl border border-electric/40 bg-gradient-to-b from-[#0a1428] via-[#0d1e3d] to-[#0a1428] p-7 sm:p-9 text-white shadow-2xl">
        {/* Subtle decorative glow */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full bg-electric/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-signal/15 blur-3xl" />

        {/* Header with 3D Security Shield Badge */}
        <div className="flex flex-col sm:flex-row items-center gap-4 border-b border-electric/30 pb-6 mb-6">
          <div className="relative h-20 w-20 shrink-0">
            <Image
              src="/assets/auth/staff-security.png"
              alt="Security Shield"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-electric/50 bg-electric/20 px-3 py-0.5 text-[10px] font-mono font-semibold text-electric-bright uppercase tracking-widest">
              <span className="h-1.5 w-1.5 rounded-full bg-signal animate-pulse" />
              <span>STAFF OPERATIONS GATEWAY</span>
            </div>
            <h1 className="mt-1.5 font-display text-xl sm:text-2xl font-extrabold tracking-tight">
              Internal Back-Office Cockpit
            </h1>
            <p className="mt-0.5 text-xs text-gray-300">
              Authorized access for Recruiters, Technical Validators, and Platform Administrators.
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 rounded-xl border border-rose-500/40 bg-rose-500/10 p-3 text-xs text-rose-300 font-medium">
            {errorMsg}
          </div>
        )}

        {/* Step 1: Staff Credentials */}
        {step === "credentials" && (
          <form onSubmit={handleCredentialsSubmit} className="space-y-4">
            <div>
              <label className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                Staff Corporate Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="staff.name@pepoltek.com"
                className="w-full rounded-xl border border-electric/30 bg-[#081224] px-4 py-2.5 text-xs sm:text-sm text-white placeholder:text-gray-500 focus:border-electric-bright focus:outline-hidden transition-all font-mono"
              />
            </div>

            <div>
              <label className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-xl border border-electric/30 bg-[#081224] px-4 py-2.5 text-xs sm:text-sm text-white placeholder:text-gray-500 focus:border-electric-bright focus:outline-hidden transition-all"
              />
            </div>

            <div>
              <label className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                Target Operations Workspace
              </label>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <button
                  type="button"
                  onClick={() => setTargetWorkspace("recruiter")}
                  className={`rounded-xl border p-3 text-left transition-all cursor-pointer ${
                    targetWorkspace === "recruiter"
                      ? "border-electric bg-electric/20 text-white font-semibold"
                      : "border-white/10 bg-white/5 text-gray-400 hover:text-white"
                  }`}
                >
                  <div className="font-bold">Recruiter Cockpit</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">Pod & Candidate ATS</div>
                </button>

                <button
                  type="button"
                  onClick={() => setTargetWorkspace("admin")}
                  className={`rounded-xl border p-3 text-left transition-all cursor-pointer ${
                    targetWorkspace === "admin"
                      ? "border-electric bg-electric/20 text-white font-semibold"
                      : "border-white/10 bg-white/5 text-gray-400 hover:text-white"
                  }`}
                >
                  <div className="font-bold">Platform Admin</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">Executive Command</div>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-3 flex items-center justify-center gap-2 rounded-xl bg-electric py-3 font-display text-xs sm:text-sm font-bold text-white shadow-md hover:bg-electric-bright transition-colors cursor-pointer disabled:opacity-50"
            >
              <span>{loading ? "Verifying Credentials..." : "Proceed to MFA Verification"}</span>
              <ArrowRight size={15} />
            </button>
          </form>
        )}

        {/* Step 2: TOTP MFA Authenticator */}
        {step === "mfa" && (
          <form onSubmit={handleMfaSubmit} className="space-y-5">
            <div className="rounded-2xl border border-electric/30 bg-electric/10 p-4 text-center">
              <ShieldCheck className="mx-auto h-8 w-8 text-electric-bright" />
              <div className="mt-2 text-sm font-bold text-white">Two-Factor Authentication</div>
              <p className="mt-1 text-xs text-gray-300">
                Enter the 6-digit verification code from your Google Authenticator or hardware token.
              </p>
            </div>

            <div>
              <label className="block text-center font-mono text-xs uppercase tracking-wider text-gray-300 mb-2">
                6-Digit Security Token
              </label>
              <input
                type="text"
                maxLength={6}
                autoFocus
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ""))}
                placeholder="123456"
                className="w-full rounded-2xl border border-electric/40 bg-[#081224] py-3 text-center font-mono text-2xl font-bold tracking-widest text-electric-bright placeholder:text-gray-700 focus:border-electric-bright focus:outline-hidden"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep("credentials")}
                className="flex-1 rounded-xl border border-white/20 py-2.5 font-display text-xs font-semibold text-gray-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-2 rounded-xl bg-signal py-2.5 font-display text-xs font-bold text-ink shadow-md hover:bg-emerald-400 transition-colors cursor-pointer disabled:opacity-50"
              >
                {loading ? "Authorizing Token..." : "Authorize & Launch Workspace"}
              </button>
            </div>
          </form>
        )}

        {/* Footer info */}
        <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
          <Link href="/login" className="hover:text-electric-bright transition-colors">
            ← Switch to Public Talent Login
          </Link>
          <span className="font-mono text-[11px]">SOC 2 Enforced</span>
        </div>
      </div>
    </div>
  );
}
