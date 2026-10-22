"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-canvas font-sans text-ink antialiased">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-[#bcd6fa] bg-white">
        <div className="flex h-16 items-center justify-between border-b border-[#bcd6fa] px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="relative h-7 w-28">
              <Image
                src="/images/logo.png"
                alt="Pepoltek"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
            <span className="rounded-full bg-electric/10 px-2 py-0.5 text-[10px] font-mono font-semibold text-electric">
              CLIENT
            </span>
          </Link>
        </div>

        <div className="flex-1 space-y-1 p-4">
          <Link
            href="/client/dashboard"
            className="flex items-center gap-3 rounded-xl bg-ink px-3.5 py-2.5 text-xs font-semibold text-white shadow-xs"
          >
            <span>Enterprise Cockpit</span>
          </Link>
        </div>

        <div className="border-t border-[#bcd6fa] p-4">
          <Link
            href="/"
            className="block text-center text-xs font-medium text-ink-soft hover:text-ink transition-colors"
          >
            Back to Public Website
          </Link>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b border-[#bcd6fa] bg-white px-4 sm:px-6">
          <div className="text-xs text-ink-soft">Enterprise Client Command</div>
          <Link
            href="/login"
            className="rounded-xl bg-ink px-3 py-1.5 text-xs font-semibold text-white hover:bg-electric transition-colors"
          >
            Sign Out
          </Link>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
