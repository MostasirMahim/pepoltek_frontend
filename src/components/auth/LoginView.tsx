"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginAction } from "@/actions/auth.actions";
import { ArrowRight, Lock, CheckCircle, ShieldCheck } from "@/components/ui/Icons";

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
      router.push("/candidate/dashboard");
    } else {
      setErrorMsg(
        res.error?.message || "Invalid credentials. Please verify your email and password."
      );
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="rounded-3xl border border-[#bcd6fa] bg-white/95 p-7 sm:p-9 shadow-[0_16px_50px_-15px_rgba(10,20,40,0.08)] backdrop-blur-md">
        {/* Top Header */}
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-electric/30 bg-electric/10 px-3 py-1 text-[11px] font-mono font-semibold text-electric uppercase tracking-widest">
            <span className="h-1.5 w-1.5 rounded-full bg-electric animate-pulse" />
            <span>Talent & Partner Access</span>
          </div>
          <h1 className="mt-3 font-display text-2xl sm:text-3xl font-bold tracking-tight text-ink">
            Sign In to Pepoltek
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-ink-soft">
            Access your sprint application pipelines, reverse search matches, and Talent Academy.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 rounded-xl border border-rose-300 bg-rose-50 p-3 text-xs text-rose-700 font-medium">
            {errorMsg}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-mono text-xs font-semibold uppercase tracking-wider text-ink-soft mb-1.5">
              Account Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="candidate@example.com"
              className="w-full rounded-xl border border-[#bcd6fa] bg-[#f8fbff] px-4 py-2.5 text-xs sm:text-sm text-ink placeholder:text-mist focus:border-electric focus:bg-white focus:outline-hidden transition-all"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block font-mono text-xs font-semibold uppercase tracking-wider text-ink-soft">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs text-electric hover:underline font-medium"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-xl border border-[#bcd6fa] bg-[#f8fbff] px-4 py-2.5 text-xs sm:text-sm text-ink placeholder:text-mist focus:border-electric focus:bg-white focus:outline-hidden transition-all pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-mist hover:text-ink text-xs font-mono"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-[#bcd6fa] text-electric focus:ring-electric"
              />
              <span className="text-xs text-ink-soft">Keep me signed in</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-ink py-3 font-display text-xs sm:text-sm font-semibold text-white shadow-xs hover:bg-electric transition-colors cursor-pointer disabled:opacity-50"
          >
            <span>{loading ? "Authenticating..." : "Sign In to Talent Portal"}</span>
            <ArrowRight size={15} />
          </button>
        </form>

        {/* Divider & Switch */}
        <div className="mt-6 pt-6 border-t border-[#bcd6fa]/40 space-y-4">
          <div className="text-center">
            <span className="text-xs text-ink-soft">New candidate joining Pepoltek? </span>
            <Link
              href="/register"
              className="text-xs font-semibold text-electric hover:underline"
            >
              Start Intake Wizard
            </Link>
          </div>

          {/* Internal Staff Gateway Callout */}
          <div className="rounded-2xl border border-dashed border-[#bcd6fa] bg-canvas/40 p-3.5 text-center">
            <div className="text-[11px] font-mono text-mist">
              Pepoltek Recruiter or Back-Office Administrator?
            </div>
            <Link
              href="/staff/login"
              className="mt-1 inline-flex items-center gap-1.5 text-xs font-bold text-ink hover:text-electric transition-colors"
            >
              <ShieldCheck size={14} className="text-electric" />
              <span>Enter Internal Staff Portal →</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
