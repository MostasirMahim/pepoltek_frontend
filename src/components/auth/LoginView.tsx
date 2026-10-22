"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginAction } from "@/actions/auth.actions";
import {
  ArrowRight,
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";

export function LoginView() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const res = await loginAction({ email, password });
    setLoading(false);

    if (res.success) {
      const role = (res.user?.role || "").toUpperCase();
      if (role === "SUPER_ADMIN" || role === "ADMIN") {
        router.push("/admin/dashboard");
      } else if (role === "RECRUITER") {
        router.push("/recruiter/dashboard");
      } else {
        router.push("/candidate/dashboard");
      }
    } else {
      setErrorMsg(
        res.error?.message || "Invalid credentials. Please verify your email and password."
      );
    }
  };

  return (
    <div className="w-full max-w-[390px] mx-auto">
      {/* Outer Shell with Glassmorphism */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#060c19]/90 p-5 sm:p-6 text-white shadow-[0_20px_60px_-15px_rgba(0,102,255,0.25)] backdrop-blur-2xl">
        {/* Subtle Ambient Glow Overlays */}
        <div className="pointer-events-none absolute -top-20 -right-20 h-44 w-44 rounded-full bg-electric/20 blur-[70px]" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-44 w-44 rounded-full bg-signal/15 blur-[70px]" />
        <div className="pointer-events-none absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-electric-bright to-transparent opacity-80" />

        {/* Minimal Clean Header with Pepoltek Logo + Short Bio */}
        <div className="flex flex-col items-center justify-center mb-3.5 text-center">
          <Link href="/" className="mb-2 transition-transform hover:opacity-90 inline-block">
            <Image
              src="/assets/pepoltek/white_logo.png"
              alt="Pepoltek Limited"
              width={150}
              height={60}
              className="h-12 w-auto object-contain"
              priority
            />
          </Link>
          <p className="w-full text-center text-[11px] sm:text-xs text-gray-300 font-medium tracking-tight whitespace-nowrap">
            AI Driven Tech Talent & Enterprise RPO Solutions
          </p>
        </div>

        {errorMsg && (
          <div className="mb-3 rounded-xl border border-rose-500/40 bg-rose-500/10 p-2.5 text-xs text-rose-300 font-medium flex items-start gap-2">
            <AlertCircle size={15} className="text-rose-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">{errorMsg}</div>
          </div>
        )}

        {/* Google OAuth Quick Sign In */}
        <div className="mb-3 space-y-2.5">
          <GoogleAuthButton label="Continue with Google" className="py-2 text-xs" />
          <div className="relative flex items-center justify-center">
            <div className="border-t border-white/10 w-full" />
            <span className="bg-[#060c19] px-2.5 font-mono text-[9px] text-gray-400 uppercase tracking-wider shrink-0">
              Or sign in with email
            </span>
            <div className="border-t border-white/10 w-full" />
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block font-mono text-[10px] font-semibold uppercase tracking-wider text-gray-300 mb-1">
              Account Email
            </label>
            <div className="relative">
              <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="candidate@example.com"
                className="w-full rounded-xl border border-white/15 bg-[#040814] pl-9 pr-3 py-2 text-xs text-white placeholder:text-gray-500 focus:border-electric-bright focus:ring-1 focus:ring-electric-bright focus:outline-hidden transition-all font-mono"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block font-mono text-[10px] font-semibold uppercase tracking-wider text-gray-300">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-[11px] text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-xl border border-white/15 bg-[#040814] pl-9 pr-10 py-2 text-xs text-white placeholder:text-gray-500 focus:border-electric-bright focus:ring-1 focus:ring-electric-bright focus:outline-hidden transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
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
              <span className="text-xs text-gray-300">Keep me signed in</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-electric to-[#0052cc] py-2.5 font-display text-xs font-bold text-white shadow-md shadow-electric/30 hover:from-electric-bright hover:to-electric transition-all cursor-pointer disabled:opacity-50 active:scale-[0.99]"
          >
            <span>{loading ? "Authenticating..." : "Sign In to Candidate Portal"}</span>
            <ArrowRight size={14} />
          </button>
        </form>

        {/* Clean Minimal Footer */}
        <div className="mt-3.5 pt-3 border-t border-white/10 text-center space-y-1.5">
          <div className="text-xs text-gray-400">
            <span>New candidate joining Pepoltek? </span>
            <Link
              href="/register"
              className="font-semibold text-cyan-400 hover:text-cyan-300 hover:underline"
            >
              Start Intake Wizard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
