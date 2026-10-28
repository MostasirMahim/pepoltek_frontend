"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { logoutAction } from "@/actions/auth.actions";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  return (
    <div className="h-screen max-h-screen overflow-hidden bg-canvas font-sans text-ink antialiased flex select-none">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 h-screen max-h-screen flex-col border-r border-[#bcd6fa] bg-white overflow-hidden z-30">
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-[#bcd6fa] px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex items-center">
              <Image
                src="/assets/pepoltek/black_logo.png"
                alt="Pepoltek Limited"
                width={120}
                height={28}
                className="h-6 w-auto object-contain"
                priority
              />
            </div>
            <span className="rounded-full bg-electric/10 px-2 py-0.5 text-[10px] font-mono font-semibold text-electric">
              CLIENT
            </span>
          </Link>
        </div>

        <div className="flex-1 min-h-0 space-y-1 p-4 overflow-y-auto thin-scrollbar">
          <Link
            href="/client/dashboard"
            className="flex items-center gap-3 rounded-xl bg-ink px-3.5 py-2.5 text-xs font-semibold text-white shadow-xs"
          >
            <span>Enterprise Cockpit</span>
          </Link>
        </div>

        <div className="shrink-0 border-t border-[#bcd6fa] p-4 bg-white">
          <Link
            href="/"
            className="block text-center text-xs font-medium text-ink-soft hover:text-ink transition-colors"
          >
            Back to Public Website
          </Link>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 min-h-0 flex flex-col h-screen max-h-screen overflow-hidden">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-[#bcd6fa] bg-white px-4 sm:px-6 z-20">
          <div className="text-xs text-ink-soft">Enterprise Client Command</div>
          <button
            type="button"
            onClick={async () => {
              await logoutAction();
              router.push("/login");
            }}
            className="rounded-xl bg-ink px-3 py-1.5 text-xs font-semibold text-white hover:bg-electric transition-colors cursor-pointer"
          >
            Sign Out
          </button>
        </header>

        <main className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 lg:p-8 thin-scrollbar">
          <div className="max-w-7xl w-full mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
