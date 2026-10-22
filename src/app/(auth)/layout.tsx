import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronsRight } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden bg-[#050b17] bg-[url('/backgrounds/auth/auth_bg.png')] bg-cover bg-center bg-no-repeat text-white selection:bg-electric selection:text-white">
      {/* High-tech Ambient Glow Overlays */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-[350px] w-[600px] rounded-full bg-electric/20 blur-[130px]" />
        <div className="absolute bottom-[-80px] right-[-80px] h-[300px] w-[300px] rounded-full bg-electric-bright/15 blur-[110px]" />
      </div>

      {/* Top Header */}
      <header className="w-full shrink-0 border-b border-white/10 bg-[#060c1a]/70 backdrop-blur-xl z-20">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <Link href="/" className="group flex items-center gap-2 transition-transform hover:opacity-90">
            <Image
              src="/assets/pepoltek/white_logo.png"
              alt="Pepoltek Limited"
              width={140}
              height={34}
              className="h-7 w-auto object-contain"
              priority
            />
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/10 px-3.5 py-1.5 font-display text-xs font-semibold text-white/90 shadow-xs backdrop-blur-md transition-all hover:bg-white/20 hover:text-white hover:border-white/30"
            >
              <ChevronsRight size={14} className="text-white/80" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Form Center (responsive scroll container, never clipped) */}
      <main className="flex-1 flex items-center justify-center p-3 sm:p-5 sm:py-6 overflow-y-auto w-full max-w-6xl mx-auto z-10 my-auto">
        <div className="w-full flex justify-center py-2">{children}</div>
      </main>

      {/* Bottom Footer */}
      <footer className="w-full shrink-0 border-t border-white/10 bg-[#060c1a]/70 py-2.5 backdrop-blur-xl z-20">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 text-center sm:flex-row sm:text-left text-xs font-mono text-gray-400">
          <p>© {new Date().getFullYear()} Pepoltek Limited. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#terms" className="hover:text-white transition-colors">Terms of Service</a>
            <span>•</span>
            <a href="#security" className="hover:text-white transition-colors">Security Audit</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

