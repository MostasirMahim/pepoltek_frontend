"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Mail,
  Edit3,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Zap,
  RefreshCw,
  X,
} from "lucide-react";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";
import {
  resendOtpAction,
  verifyOtpAction,
  changeVerificationEmailAction,
} from "@/actions/auth.actions";

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") || "candidate@pepoltek.com";

  const DEMO_OTP = "749201";

  // Email State & Inline Editing
  const [currentEmail, setCurrentEmail] = useState<string>(initialEmail);
  const [isEditingEmail, setIsEditingEmail] = useState<boolean>(false);
  const [emailInput, setEmailInput] = useState<string>(initialEmail);
  const [emailSaving, setEmailSaving] = useState<boolean>(false);

  // OTP State (Zero auto-sent on load)
  const [otpDispatched, setOtpDispatched] = useState<boolean>(false);
  const [dispatchingOtp, setDispatchingOtp] = useState<boolean>(false);
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [verified, setVerified] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const qEmail = searchParams.get("email");
    if (qEmail && qEmail !== currentEmail) {
      setCurrentEmail(qEmail);
      setEmailInput(qEmail);
    }
  }, [searchParams]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleSaveEmail = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanEmail = emailInput.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      setErrorMessage("Enter a valid email address.");
      return;
    }

    if (cleanEmail === currentEmail) {
      setIsEditingEmail(false);
      return;
    }

    setEmailSaving(true);
    setErrorMessage(null);

    const res = await changeVerificationEmailAction({
      currentEmail,
      newEmail: cleanEmail,
    });

    setEmailSaving(false);

    if (res.success) {
      setCurrentEmail(cleanEmail);
      setIsEditingEmail(false);
      setStatusMessage("Email updated successfully.");
      if (otpDispatched) {
        setOtpDispatched(false);
        setOtp(["", "", "", "", "", ""]);
        setTimer(0);
      }
      if (typeof window !== "undefined") {
        const url = new URL(window.location.href);
        url.searchParams.set("email", cleanEmail);
        window.history.replaceState(null, "", url.toString());
      }
      setTimeout(() => setStatusMessage(null), 3500);
    } else {
      setErrorMessage(res.message || "Failed to update email.");
    }
  };

  const handleDispatchOtp = async () => {
    setDispatchingOtp(true);
    setErrorMessage(null);
    setStatusMessage("Dispatching 6-digit PIN...");

    const res = await resendOtpAction({
      email: currentEmail,
      full_name: "Talent Candidate",
    });

    setDispatchingOtp(false);

    if (res.success) {
      setOtpDispatched(true);
      setTimer(60);
      setStatusMessage(`PIN sent to ${currentEmail}`);
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
      setTimeout(() => setStatusMessage(null), 4500);
    } else {
      setErrorMessage(res.message || "Failed to send PIN.");
    }
  };

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

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) return;

    setLoading(true);
    setErrorMessage(null);

    const res = await verifyOtpAction({
      email: currentEmail,
      otp: code,
    });

    setLoading(false);

    if (res.success) {
      setVerified(true);
      setTimeout(() => {
        router.push("/candidate/dashboard?verified=true");
      }, 900);
    } else {
      setErrorMessage(res.message || "Invalid or expired verification PIN.");
    }
  };

  return (
    <div className="w-full max-w-[390px] mx-auto">
      {/* Outer Shell with Glassmorphism matching recruiter/staff login */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#060c19]/90 p-5 sm:p-6 text-white shadow-[0_20px_60px_-15px_rgba(0,102,255,0.25)] backdrop-blur-2xl">
        {/* Subtle ambient neon orbs */}
        <div className="pointer-events-none absolute -top-20 -right-20 h-44 w-44 rounded-full bg-electric/20 blur-[70px]" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-44 w-44 rounded-full bg-signal/15 blur-[70px]" />

        {/* Top edge accent gradient line */}
        <div className="pointer-events-none absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-electric-bright to-transparent opacity-80" />

        {/* Minimal Clean Header with Pepoltek Logo */}
        <div className="flex flex-col items-center justify-center mb-4 text-center">
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
          <h1 className="font-display text-base sm:text-lg font-bold tracking-tight text-white">
            Security Verification
          </h1>
          <p className="text-[11px] text-gray-400 mt-0.5 max-w-[280px]">
            Confirm your candidate identity to activate your profile.
          </p>
        </div>

        {/* Status & Error Alerts */}
        {statusMessage && (
          <div className="mb-3 flex items-center gap-1.5 rounded-lg bg-emerald-500/20 px-2.5 py-1.5 text-[11px] font-mono text-emerald-300 border border-emerald-500/40 animate-in fade-in-0 duration-200">
            <CheckCircle size={12} className="text-emerald-400 shrink-0" />
            <span className="truncate">{statusMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="mb-3 flex items-center gap-1.5 rounded-lg bg-rose-500/20 px-2.5 py-1.5 text-[11px] font-mono text-rose-300 border border-rose-500/40 animate-in fade-in-0 duration-200">
            <AlertCircle size={12} className="text-rose-400 shrink-0" />
            <span className="truncate">{errorMessage}</span>
          </div>
        )}

        {verified ? (
          <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-5 text-center text-emerald-300 animate-in zoom-in-95 duration-200">
            <CheckCircle size={32} className="mx-auto mb-2 text-emerald-400" />
            <div className="font-display text-sm font-bold text-white">Verified Successfully</div>
            <div className="text-[11px] text-gray-300 mt-1">Redirecting to candidate workspace...</div>
          </div>
        ) : (
          <div className="space-y-3">
            {/* OPTION 1: Instant Google Verification */}
            <div>
              <GoogleAuthButton
                label="Verify with Google"
                variant="transparent"
                previousEmail={currentEmail}
                className="py-2.5 text-xs font-semibold"
              />
              <p className="mt-1 text-[10px] text-gray-400 text-center">
                Auto-syncs profile if you select another Google account.
              </p>
            </div>

            {/* Subtle Divider */}
            <div className="relative flex items-center justify-center my-3">
              <div className="border-t border-white/10 w-full" />
              <span className="bg-[#060c19] px-2.5 font-mono text-[9.5px] text-gray-400 uppercase tracking-widest shrink-0">
                Or confirm with PIN
              </span>
              <div className="border-t border-white/10 w-full" />
            </div>

            {/* OPTION 2: Email PIN */}
            <div>
              {/* Target Email Box with Inline Edit */}
              <div className="mb-2.5 rounded-xl border border-white/10 bg-[#040814] p-2 sm:p-2.5">
                <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-gray-400 mb-0.5">
                  <span>Target Email</span>
                  {!isEditingEmail && (
                    <button
                      type="button"
                      onClick={() => {
                        setEmailInput(currentEmail);
                        setIsEditingEmail(true);
                      }}
                      className="inline-flex items-center gap-1 text-[10px] font-semibold text-cyan-400 hover:text-cyan-300 cursor-pointer"
                    >
                      <Edit3 size={10} />
                      <span>Edit</span>
                    </button>
                  )}
                </div>

                {isEditingEmail ? (
                  <form onSubmit={handleSaveEmail} className="mt-1 flex items-center gap-1.5">
                    <input
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="Enter new email"
                      className="flex-1 rounded-lg border border-white/15 bg-white/5 px-2 py-1 font-mono text-xs text-white placeholder:text-gray-500 focus:border-cyan-400 focus:outline-hidden"
                      autoFocus
                    />
                    <button
                      type="submit"
                      disabled={emailSaving}
                      className="rounded-lg bg-electric px-2 py-1 text-[10px] font-bold text-white hover:bg-electric-bright cursor-pointer disabled:opacity-50"
                    >
                      {emailSaving ? "..." : "Save"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEmailInput(currentEmail);
                        setIsEditingEmail(false);
                      }}
                      className="rounded-lg border border-white/15 p-1 text-gray-400 hover:text-white cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                  </form>
                ) : (
                  <div className="font-mono text-xs font-bold text-cyan-300 truncate">
                    {currentEmail}
                  </div>
                )}
              </div>

              {/* State A: Before PIN is sent */}
              {!otpDispatched ? (
                <button
                  type="button"
                  onClick={handleDispatchOtp}
                  disabled={dispatchingOtp || isEditingEmail}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-electric hover:bg-electric-bright py-2.5 text-xs font-bold text-white shadow-xs transition-all active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                >
                  {dispatchingOtp ? (
                    <>
                      <RefreshCw size={13} className="animate-spin" />
                      <span>Dispatching PIN...</span>
                    </>
                  ) : (
                    <>
                      <Mail size={13} />
                      <span>Send 6-Digit PIN to Email</span>
                    </>
                  )}
                </button>
              ) : (
                /* State B: After PIN is sent */
                <div className="space-y-2.5 animate-in fade-in-0 duration-200">
                  {/* Sandbox helper */}
                  <div className="flex items-center justify-between rounded-lg border border-cyan-500/30 bg-cyan-950/30 px-2.5 py-1 text-[10px] font-mono text-cyan-300">
                    <span className="flex items-center gap-1">
                      <Zap size={10} className="text-cyan-400" /> Test PIN: <strong className="text-white">{DEMO_OTP}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={handleFillOtp}
                      className="rounded bg-cyan-500/20 px-1.5 py-0.5 text-[9.5px] font-bold text-cyan-200 hover:bg-cyan-500/30 cursor-pointer"
                    >
                      Fill
                    </button>
                  </div>

                  <form onSubmit={handleVerify} className="space-y-2.5">
                    {/* 6 Digit PIN Inputs */}
                    <div className="flex justify-center gap-1.5 py-0.5">
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
                          className="h-10 w-9 rounded-lg border border-white/15 bg-[#040814] text-center font-mono text-base font-bold text-white transition-all focus:border-cyan-400 focus:outline-hidden focus:ring-1 focus:ring-cyan-400/40"
                        />
                      ))}
                    </div>

                    <button
                      type="submit"
                      disabled={loading || otp.join("").length < 6}
                      className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-electric hover:bg-electric-bright py-2.5 text-xs font-bold text-white shadow-xs transition-all active:scale-[0.99] disabled:opacity-40 cursor-pointer"
                    >
                      {loading ? (
                        <>
                          <RefreshCw size={13} className="animate-spin" />
                          <span>Verifying PIN...</span>
                        </>
                      ) : (
                        <>
                          <span>Verify & Enter Dashboard</span>
                          <ArrowRight size={13} />
                        </>
                      )}
                    </button>

                    <div className="flex items-center justify-between text-[10.5px] pt-0.5 text-gray-400 font-mono">
                      <button
                        type="button"
                        onClick={handleDispatchOtp}
                        disabled={timer > 0 || dispatchingOtp}
                        className={timer > 0 ? "text-gray-500 cursor-not-allowed" : "text-cyan-400 hover:underline cursor-pointer"}
                      >
                        {timer > 0 ? `Resend (${timer}s)` : "Resend PIN"}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setEmailInput(currentEmail);
                          setIsEditingEmail(true);
                        }}
                        className="text-gray-400 hover:text-white cursor-pointer"
                      >
                        Change email
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Minimal Footer */}
        <div className="mt-4 border-t border-white/10 pt-2.5 text-center">
          <p className="text-[10px] font-mono text-gray-500">
            Candidate verification backed by Pepoltek Identity Governance.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm font-mono text-gray-400">Loading verification gateway...</div>}>
      <VerifyContent />
    </Suspense>
  );
}
