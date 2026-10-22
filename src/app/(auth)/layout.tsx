import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex flex-col justify-between bg-canvas text-ink selection:bg-electric selection:text-white">
      {/* High-tech Background Ambient Grid & Glows */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {/* Subtle grid lines */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `linear-gradient(#0a1428 1px, transparent 1px), linear-gradient(90deg, #0a1428 1px, transparent 1px)`,
            backgroundSize: "36px 36px",
          }}
        />
        {/* Ambient top light orb */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[450px] w-[700px] rounded-full bg-electric/15 blur-[120px]" />
        {/* Subtle bottom-right electric glow */}
        <div className="absolute bottom-[-100px] right-[-100px] h-[350px] w-[350px] rounded-full bg-electric-bright/10 blur-[100px]" />
      </div>

      {/* Top Header */}
      <header className="w-full border-b border-[#bcd6fa]/30 bg-canvas/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="group flex items-center gap-2 transition-transform hover:opacity-90">
            <Image
              src="/assets/pepoltek/black_logo.png"
              alt="Pepoltek Limited"
              width={150}
              height={38}
              className="h-8 w-auto object-contain"
              priority
            />
          </Link>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 rounded-full border border-[#bcd6fa]/60 bg-white/70 px-3 py-1 text-[11px] font-mono font-medium text-ink-soft shadow-xs backdrop-blur-xs">
              <span className="h-2 w-2 rounded-full bg-signal animate-pulse" />
              <span>256-BIT ENCRYPTED GATEWAY</span>
            </div>

            <Link
              href="/"
              className="flex items-center gap-1.5 rounded-xl border border-[#bcd6fa] bg-white/80 px-3.5 py-1.5 font-display text-xs font-semibold text-ink shadow-xs transition-all hover:border-electric hover:text-electric hover:bg-white"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Form Center */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8 w-full max-w-6xl mx-auto">
        <div className="w-full flex justify-center">{children}</div>
      </main>

      {/* Bottom Footer */}
      <footer className="w-full border-t border-[#bcd6fa]/30 bg-canvas/70 py-4 backdrop-blur-xs">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 text-center sm:flex-row sm:text-left text-xs font-mono text-mist">
          <p>© {new Date().getFullYear()} Pepoltek Limited. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#privacy" className="hover:text-ink transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#terms" className="hover:text-ink transition-colors">Terms of Service</a>
            <span>•</span>
            <a href="#security" className="hover:text-ink transition-colors">Security Audit</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
