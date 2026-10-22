"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Users,
  Zap,
  ShieldCheck,
  Globe,
  User,
  UserPlus,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";
import { loginAction } from "@/actions/auth.actions";

export function CandidateLoginView() {
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

  const featurePills = [
    {
      icon: Users,
      label: "Access Global Talent Pool",
    },
    {
      icon: Zap,
      label: "Faster Hiring",
    },
    {
      icon: ShieldCheck,
      label: "Trusted & Compliant",
    },
    {
      icon: Globe,
      label: "Worldwide Reach",
    },
  ];

  const candidateAvatars = [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80",
  ];

  return (
    <main className="relative h-screen max-h-screen w-full bg-[#020b1c] text-white overflow-hidden selection:bg-[#00E5FF]/30 flex flex-col justify-between">
      {/* 1. Full Screen Digital Globe Skyline Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <Image
          src="/backgrounds/auth/candidate/candidate_globe_bg.png"
          alt="PepolTek Global Connectivity"
          fill
          sizes="100vw"
          priority
          className="object-cover object-center opacity-85"
        />
        {/* Soft Radial Ambient Lighting */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#020b1c]/90 via-[#020b1c]/60 to-transparent hidden lg:block" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#020b1c]/95 via-[#020b1c]/70 to-[#020b1c]/95 lg:hidden" />
        <div className="absolute top-10 left-10 w-[500px] h-[500px] rounded-full bg-cyan-400/10 blur-[150px]" />
        <div className="absolute bottom-10 left-1/3 w-[450px] h-[450px] rounded-full bg-blue-600/15 blur-[130px]" />
      </div>

      {/* 2. Main Content Row: Left Section | Middle Section (Character) | Right Section (Card) */}
      <div className="relative z-20 flex-1 w-full px-3 sm:px-6 lg:px-8 xl:px-10 pt-3 lg:pt-5 pb-2 flex flex-col lg:flex-row items-center justify-between gap-1 max-w-[1800px] mx-auto h-full max-h-[calc(100vh-32px)]">
        
        {/* ================= SECTION 1: LEFT 38% HERO INFORMATION ================= */}
        <div className="w-full lg:w-[38%] xl:w-[38%] flex flex-col justify-start py-1 shrink-0 h-full max-h-full">
             {/* PEPOLTek Brand Logo Div with Distinct Font Subtitle */}
            <div className="mb-3.5 xl:mb-5">
              <Link href="/" className="inline-block transition-opacity hover:opacity-90">
                <Image
                  src="/assets/pepoltek/white_logo.png"
                  alt="PEPOLTek Limited"
                  width={140}
                  height={38}
                  className="h-7 sm:h-8 w-auto object-contain"
                  priority
                />
                <p className="font-sans text-[11px] sm:text-xs text-slate-300 tracking-normal font-normal mt-0.5">
                  Global Talent. Strategic Growth.
                </p>
              </Link>
            </div>

          <div className="my-auto">
            {/* Eyebrow */}
            <p className="text-[10px] sm:text-[11px] font-bold tracking-[0.24em] uppercase text-slate-400 mb-2">
              GLOBAL STAFFING &amp; RPO SOLUTIONS
            </p>

            {/* Main Headline: Exactly 3 lines matching target */}
            <h1 className="text-2xl sm:text-3xl lg:text-[34px] xl:text-[44px] font-extrabold text-white tracking-tight leading-[1.08] font-display">
              Global Talent Hub <br />
              for a Stronger <br />
              <span className="bg-gradient-to-r from-[#00E5FF] via-[#00C2FF] to-[#0084FF] bg-clip-text text-transparent">
                Tomorrow
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-2.5 text-slate-200 text-xs sm:text-[13px] lg:text-[13.5px] leading-relaxed font-normal max-w-lg">
              Connect with top talent, build high-performing teams, and scale your business with our end-to-end RPO and global staffing solutions.
            </p>

            {/* 4 Feature Circular Badges */}
            <div className="grid grid-cols-4 gap-2 sm:gap-2.5 my-6 pt-0.5 max-w-xs">
              {featurePills.map((pill, idx) => {
                const Icon = pill.icon;
                return (
                  <div
                    key={idx}
                    className="flex flex-col items-center text-center group cursor-default"
                  >
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-blue-500/15 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(0,192,255,0.25)] group-hover:scale-105 group-hover:border-cyan-300 transition-all">
                      <Icon size={16} className="text-[#00E5FF]" />
                    </div>
                    <span className="text-[9.5px] sm:text-[10px] font-medium text-slate-200 mt-1.5 leading-tight">
                      {pill.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Row with 500+ Badge AND Your Hiring Partner Script directly on its right (No wrap) */}
            <div className="flex items-center gap-3 flex-nowrap shrink-0">
              {/* Trusted by 500+ Global Companies Pill */}
              <div className="inline-flex items-center gap-2.5 px-3.5 py-2.5 rounded-full bg-[#061533]/90 border border-blue-400/30 backdrop-blur-md shadow-lg shrink-0">
                <div className="w-7 h-7 rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-[#00E5FF] shrink-0">
                  <Globe size={17} />
                </div>
                <div className="leading-tight">
                  <p className="text-[12px] sm:text-[11.5px] font-semibold text-white">
                    Trusted by <span className="text-[#00E5FF] font-bold">500+</span> global companies
                  </p>
                  <p className="text-[10px] text-slate-400 font-normal">
                    From startups to Fortune 500
                  </p>
                </div>
              </div>

              {/* Your Hiring Partner Script firmly to the right of 500+ badge */}
              <div className="relative w-36 sm:w-40 xl:w-60 h-8 sm:h-18 shrink-0">
                <Image
                  src="/backgrounds/auth/candidate/candidate_script_borders.png"
                  alt="Your Hiring Partner Across Borders"
                  fill
                  sizes="180px"
                  priority
                  className="object-contain object-left"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ================= SECTION 2: MIDDLE 28% CHARACTER CENTERED IN FRONT OF GLOBE ================= */}
        <div className="hidden lg:flex lg:w-[28%] xl:w-[28%] h-full relative flex-col items-start justify-center pt-2 pb-1">
          
          {/* Floating Transparent Script: Global Opportunities Real People */}
          <div className="absolute top-1 xl:top-3 right-0 xl:right-2 w-36 xl:w-44 h-12 xl:h-16 z-20 pointer-events-none">
            <Image
              src="/backgrounds/auth/candidate/global_op.png"
              alt="Global Opportunities, Real People"
              fill
              sizes="(max-width: 1200px) 160px, 200px"
              priority
              className="object-contain object-right"
            />
          </div>

          {/* Professional Character Standing Cutout */}
          <div className="relative w-[250px] xl:w-[290px] 2xl:w-[330px] h-[380px] xl:h-[430px] 2xl:h-[470px] z-10 flex items-center justify-center pointer-events-none shrink-0">
            <Image
              src="/backgrounds/auth/candidate/candidate_hero_character.png"
              alt="PepolTek Professional"
              fill
              sizes="(max-width: 1200px) 290px, 340px"
              priority
              className="object-contain object-bottom drop-shadow-[0_20px_50px_rgba(0,10,35,0.95)]"
            />
          </div>

          {/* Floating 100,000+ Candidates Placed Badge positioned suitably AFTER (BELOW) the blue bottom line */}
         <div className="w-full flex justify-center">
           <div className="relative z-20 flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-[#061533]/95 border border-blue-400/35 backdrop-blur-md shadow-2xl whitespace-nowrap shrink-0">
            <div className="flex -space-x-1.5">
              {candidateAvatars.map((url, i) => (
                <div
                  key={i}
                  className="relative w-5 h-5 rounded-full overflow-hidden border border-white/80 shadow-xs"
                >
                  <img
                    src={url}
                    alt={`Candidate ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
            <div className="leading-tight text-left">
              <div className="flex items-center gap-1">
                <Users size={11} className="text-[#00E5FF]" />
                <span className="text-[11px] font-bold text-[#00E5FF]">100,000+</span>
              </div>
              <span className="text-[9px] text-slate-200 font-medium">Candidates Placed</span>
            </div>
          </div>
         </div>
        </div>

        {/* ================= SECTION 3: RIGHT 34% (FULL WIDTH & HEIGHT OF ITS PERCENT) ================= */}
        <div className="w-full lg:w-[34%] xl:w-[34%] h-full flex items-center justify-center lg:justify-end z-30">
          
          {/* Inner White Login Card on Separate Div */}
          <div className="w-full max-w-[390px] xl:max-w-[400px] bg-white text-slate-800 rounded-2xl shadow-[0_20px_70px_rgba(0,10,40,0.45)] p-4 sm:p-5 flex flex-col justify-between shrink-0">
            <div>
              {/* Top Tabs: Candidate Login (Active) & Register (Tab) */}
              <div className="flex items-center border-b border-slate-200 mb-3">
                <button
                  type="button"
                  className="flex items-center gap-1.5 pb-2 text-xs sm:text-[13px] font-bold text-[#0066FF] border-b-2 border-[#0066FF] cursor-pointer"
                >
                  <User size={14} className="text-[#0066FF]" />
                  <span>Candidate Login</span>
                </button>

                <Link
                  href="/register"
                  className="flex items-center gap-1.5 pb-2 ml-6 text-xs sm:text-[13px] font-medium text-slate-400 hover:text-slate-700 border-b-2 border-transparent transition-colors cursor-pointer"
                >
                  <UserPlus size={14} className="text-slate-400" />
                  <span>Register</span>
                </Link>
              </div>

              {/* Welcome Back Header */}
              <div className="mb-3">
                <h2 className="text-xl sm:text-[22px] font-extrabold text-slate-900 tracking-tight font-display">
                  Welcome Back!
                </h2>
                <p className="text-[11.5px] text-slate-500 mt-0.5 leading-normal font-normal">
                  Sign in to access your account and continue your journey with PepolTek.
                </p>
              </div>

              {/* Error Message */}
              {errorMsg && (
                <div className="mb-2.5 rounded-xl border border-rose-200 bg-rose-50 p-2 text-xs text-rose-700 font-medium flex items-start gap-2 shadow-xs">
                  <AlertCircle size={13} className="text-rose-600 shrink-0 mt-0.5" />
                  <div className="leading-relaxed">{errorMsg}</div>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-2.5">
                {/* Email Address */}
                <div>
                  <label className="block text-[10.5px] font-bold text-slate-800 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full rounded-xl border border-slate-200 bg-[#f8fbff] focus:bg-white pl-8.5 pr-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#0066FF] focus:ring-2 focus:ring-blue-500/10 transition-all outline-none"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[10.5px] font-bold text-slate-800">
                      Password
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-[10.5px] font-semibold text-[#0066FF] hover:underline"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full rounded-xl border border-slate-200 bg-[#f8fbff] focus:bg-white pl-8.5 pr-8.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#0066FF] focus:ring-2 focus:ring-blue-500/10 transition-all outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                {/* Keep me signed in */}
                <div className="flex items-center gap-2 pt-0.5">
                  <input
                    type="checkbox"
                    id="keep-signed-in"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-[#0066FF] focus:ring-blue-500 h-3.5 w-3.5 cursor-pointer"
                  />
                  <label
                    htmlFor="keep-signed-in"
                    className="text-[11px] font-medium text-slate-600 select-none cursor-pointer"
                  >
                    Keep me signed in
                  </label>
                </div>

                {/* Sign In Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#0066FF] hover:bg-[#0052cc] active:scale-[0.99] text-white font-bold py-2.5 px-4 rounded-xl shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60 text-xs"
                >
                  {loading ? (
                    <span className="flex items-center gap-1.5">
                      <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Authenticating...
                    </span>
                  ) : (
                    <>
                      <span>Sign In to Candidate Portal</span>
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </form>

              {/* OR Divider */}
              <div className="relative flex items-center justify-center my-2.5">
                <div className="border-t border-slate-200 w-full" />
                <span className="bg-white px-2.5 text-[9.5px] font-semibold text-slate-400 uppercase tracking-widest shrink-0">
                  OR
                </span>
                <div className="border-t border-slate-200 w-full" />
              </div>

              {/* Google OAuth Button */}
              <div>
                <GoogleAuthButton
                  variant="white"
                  label="Continue with Google"
                  className="py-1.5 text-xs font-semibold border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl"
                />
              </div>
            </div>

            {/* Bottom Card Footer */}
            <div className="pt-2.5 mt-2 border-t border-slate-100 text-center">
              <p className="text-[11px] text-slate-500 font-normal">
                New candidate?{" "}
                <Link href="/register" className="text-[#0066FF] font-bold hover:underline">
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* 3. Subtle Clean Bottom Space */}
      <div className="relative z-10 w-full py-1.5 text-center text-[10px] text-slate-400/80 font-mono">
        &copy; {new Date().getFullYear()} Pepoltek Limited. All rights reserved.
      </div>
    </main>
  );
}
