"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";
import { resendOtpAction } from "@/actions/auth.actions";
import { Zap } from "@/components/ui/Icons";

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "alex.morgan@engineer.com";

  const DEMO_OTP = "749201";
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState<number>(59);
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [resendStatus, setResendStatus] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleFillOtp = () => {
    const digits = DEMO_OTP.split("");
    setOtp(digits);
    inputRefs.current[5]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pastedData) return;
    const newOtp = [...otp];
    pastedData.split("").forEach((char, idx) => {
      if (idx < 6) newOtp[idx] = char;
    });
    setOtp(newOtp);
    const focusIdx = Math.min(pastedData.length, 5);
    inputRefs.current[focusIdx]?.focus();
  };

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setVerified(true);
      setTimeout(() => {
        router.push("/candidate/dashboard");
      }, 900);
    }, 800);
  };

  const handleResend = async () => {
    if (timer === 0) {
      setTimer(60);
      setOtp(["", "", "", "", "", ""]);
      setResendStatus("Dispatching new security code via SMTP...");
      const res = await resendOtpAction({ email: emailParam });
      if (res.success) {
        setResendStatus("New 6-digit security PIN dispatched to your email!");
      } else {
        setResendStatus(res.message || "Failed to dispatch code.");
      }
      setTimeout(() => setResendStatus(null), 5000);
      inputRefs.current[0]?.focus();
    }
  };

  return (
    <div className="w-full rounded-2xl border border-[#bcd6fa] bg-white/95 p-7 sm:p-9 shadow-[0_12px_40px_-15px_rgba(10,20,40,0.1)] backdrop-blur-md">
      {/* Header */}
      <div className="mb-6 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-electric/30 bg-electric/10 text-electric">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-ink">
          Security Verification
        </h1>
        <p className="mt-1.5 text-xs sm:text-sm text-ink-soft">
          We&apos;ve sent a 6-digit authentication pin to:
        </p>
        <div className="mt-1 inline-block rounded-lg bg-canvas px-3 py-1 font-mono text-xs font-semibold text-ink border border-[#bcd6fa]/50">
          {emailParam}
        </div>

        {/* Sandbox Dev OTP Display & 1-Click Autofill */}
        <div className="mt-4 rounded-xl border border-electric/30 bg-[#eff6ff] p-3 text-left">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5">
            <div>
              <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-electric">
                <span className="h-2 w-2 rounded-full bg-signal animate-pulse" />
                <span>Verification OTP:</span>
                <span className="rounded-md border border-[#bcd6fa] bg-white px-2 py-0.5 font-mono text-xs font-bold text-ink tracking-widest shadow-xs">
                  {DEMO_OTP}
                </span>
              </div>
              <p className="text-[11px] text-ink-soft mt-0.5">
                Local testing mode active. Click the button to fill the code.
              </p>
            </div>
            <button
              type="button"
              onClick={handleFillOtp}
              className="inline-flex items-center gap-1.5 rounded-lg bg-electric px-3.5 py-1.5 font-display text-xs font-semibold text-white shadow-xs hover:bg-ink transition-all cursor-pointer active:scale-95 whitespace-nowrap"
            >
              <Zap size={12} />
              <span>Fill OTP</span>
            </button>
          </div>
        </div>
      </div>

      {/* Google Fast-Track Verification Section */}
      <div className="mb-6 rounded-2xl border border-electric/30 bg-[#eff6ff]/70 p-4 text-center space-y-2">
        <div className="text-xs font-bold text-ink font-display">
          Fast-Track Verification with Google
        </div>
        <p className="text-[11px] text-ink-soft">
          Verify your candidate identity and link your account instantly with Google OAuth.
        </p>
        <div className="max-w-xs mx-auto pt-1">
          <GoogleAuthButton label="Verify with Google" />
        </div>
      </div>

      <div className="relative flex items-center justify-center my-6">
        <div className="border-t border-[#bcd6fa]/50 w-full" />
        <span className="bg-white px-3 font-mono text-[10px] text-mist uppercase tracking-widest shrink-0">
          Or confirm with 6-digit PIN
        </span>
        <div className="border-t border-[#bcd6fa]/50 w-full" />
      </div>

      {resendStatus && (
        <div className="mb-4 rounded-xl border border-electric/30 bg-electric/10 p-3 text-center text-xs font-semibold text-electric animate-in fade-in-0 duration-200">
          {resendStatus}
        </div>
      )}

      {verified ? (
        <div className="rounded-xl border border-signal/30 bg-signal/10 p-5 text-center text-signal">
          <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-signal text-white">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="font-display text-sm font-bold">Identity Verified Successfully</div>
          <div className="text-xs text-ink-soft mt-1">Redirecting you to your enterprise workspace...</div>
        </div>
      ) : (
        <form onSubmit={handleVerify} className="space-y-6">
          {/* OTP Digit Inputs */}
          <div className="flex justify-center gap-2 sm:gap-3">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => {
                  inputRefs.current[idx] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onPaste={handlePaste}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="h-12 w-11 sm:h-14 sm:w-12 rounded-xl border border-[#bcd6fa] bg-canvas/40 text-center font-mono text-lg font-bold text-ink transition-all focus:border-electric focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-electric/30"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading || otp.join("").length < 6}
            className="w-full rounded-xl bg-ink py-3 font-display text-sm font-semibold text-white shadow-[0_6px_20px_-4px_rgba(10,20,40,0.4)] transition-all hover:bg-electric hover:shadow-[0_8px_24px_-4px_rgba(10,132,255,0.5)] active:scale-[0.99] disabled:opacity-40 cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <span>Authenticating Token...</span>
              </>
            ) : (
              <span>Verify & Continue →</span>
            )}
          </button>

          {/* Resend & Timer */}
          <div className="flex items-center justify-between text-xs pt-1">
            <button
              type="button"
              onClick={handleResend}
              disabled={timer > 0}
              className={`font-semibold transition-colors ${
                timer > 0 ? "text-mist cursor-not-allowed" : "text-electric hover:underline cursor-pointer"
              }`}
            >
              {timer > 0 ? `Resend code in ${timer}s` : "Resend Security Code"}
            </button>

            <Link href="/login" className="text-ink-soft hover:text-ink font-medium">
              Change email address
            </Link>
          </div>
        </form>
      )}

      {/* Footer Info */}
      <div className="mt-8 border-t border-[#bcd6fa]/40 pt-4 text-center">
        <p className="text-[11px] font-mono text-mist">
          Having trouble? Reach out to{" "}
          <a href="mailto:security@pepoltek.com" className="text-electric hover:underline">
            security@pepoltek.com
          </a>
        </p>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm font-mono text-mist">Loading verification gateway...</div>}>
      <VerifyContent />
    </Suspense>
  );
}
