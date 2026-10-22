"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const SOLUTIONS_LINKS = [
  { label: "IT Staff Augmentation", href: "/services" },
  { label: "Multi-Seat Engineering Teams", href: "/services" },
  { label: "Employer of Record (EOR)", href: "/services" },
  { label: "Healthcare & Clinical Staffing", href: "/services" },
  { label: "Direct Hire Executive Search", href: "/services" },
];

const COMPANY_LINKS = [
  { label: "Careers & Open Jobs", href: "/jobs" },
  { label: "About In-House Delivery Engine", href: "/about" },
  { label: "Leadership & Track Record", href: "/about" },
  { label: "Technical Case Studies", href: "/case-studies" },
  { label: "Contact Execution Team", href: "/contact" },
  { label: "Hiring Velocity Calculator", href: "/#hiring" },
];

const ECOSYSTEM_LINKS = [
  { label: "Browse Job Board & Gigs", href: "/jobs" },
  { label: "Upload Your CV & AI Parse", href: "/career/upload_cv" },
  { label: "Talent Academy Bootcamps", href: "/ecosystem/academy" },
  { label: "Reverse Job Sourcing Search", href: "/talents/reverse-search" },
  { label: "Refer & Earn Bounty Network", href: "/ecosystem/referrals" },
  { label: "Candidate Portal Access", href: "/login" },
];

const TRUST_PILLS = [
  { name: "SOC 2 Type II", tag: "Certified" },
  { name: "HIPAA Title II", tag: "Compliant" },
  { name: "ISO 27001", tag: "Security" },
  { name: "GDPR", tag: "Aligned" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail("");
      setSubscribed(false);
    }, 4000);
  };

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="relative w-full overflow-hidden border-t border-[#1c2d4a] bg-[#070e1d] text-[#a9b9d3]">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[380px] w-[1100px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(10,132,255,0.12),transparent_70%)] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 right-0 h-[340px] w-[600px] rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.08),transparent_65%)] blur-3xl" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:radial-gradient(rgba(255,255,255,0.4)_1px,transparent_1.4px)] [background-size:24px_24px]" />

      {/* Main footer content */}
      <div className="relative mx-auto max-w-7xl 2xl:max-w-[1360px] px-6 pt-16 pb-12 sm:px-10 lg:pt-20 lg:pb-14">
        
        {/* Top bar: Brand + Newsletter Advisory */}
        <div className="grid grid-cols-1 gap-12 pb-14 border-b border-[#182946] lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
          {/* Brand & mission */}
          <div className="flex flex-col items-start">
            <Link href="/" className="group flex items-center transition-transform hover:opacity-90">
              <Image
                src="/assets/pepoltek/white_logo.png"
                alt="Pepoltek Limited"
                width={170}
                height={42}
                className="h-9 w-auto object-contain sm:h-10"
              />
            </Link>
            <p className="mt-5 max-w-lg text-[14.5px] leading-relaxed text-[#8ca1c2]">
              Precision workforce delivery engine for regulated technology &amp; healthcare enterprises.
              We assemble, vet in house, and deploy high velocity engineering teams and clinical informatics specialists in 7 day sprints.
            </p>

            {/* Global delivery live indicator */}
            <div className="mt-6 inline-flex flex-wrap items-center gap-2.5 rounded-full border border-electric/30 bg-electric/[0.08] px-4 py-1.5 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-electric-bright opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-electric" />
              </span>
              <span className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-white">
                Live Delivery Hubs: Americas · UK · Europe · GCC
              </span>
            </div>

            {/* Trust compliance badges */}
            <div className="mt-5 flex flex-wrap items-center gap-2">
              {TRUST_PILLS.map((pill) => (
                <div
                  key={pill.name}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#1f355a] bg-[#0c1830] px-3 py-1 font-mono text-[10.5px] text-[#c2d3ed]"
                >
                  <span className="font-bold text-white">{pill.name}</span>
                  <span className="text-[9.5px] text-electric-bright">({pill.tag})</span>
                </div>
              ))}
            </div>
          </div>

          {/* Newsletter / Executive Talent Advisory */}
          <div className="flex flex-col justify-center rounded-2xl border border-[#1c3054] bg-[#0b1730]/80 p-6 sm:p-7 shadow-[0_20px_50px_-20px_rgba(10,20,40,0.8)] backdrop-blur-md">
            <div className="inline-flex items-center gap-2 font-mono text-[10.5px] font-600 uppercase tracking-[0.16em] text-electric">
              <span className="h-1.5 w-1.5 rounded-full bg-electric" />
              Executive Workforce Dispatch
            </div>
            <h3 className="mt-2 font-display text-lg font-bold tracking-tight text-white sm:text-xl">
              Stay ahead of talent velocity benchmarks.
            </h3>
            <p className="mt-1.5 text-[13px] leading-relaxed text-[#879cb8]">
              Bi-weekly briefings on engineering rate indexes, clinical IT compliance frameworks, and specialist staffing strategies.
            </p>

            <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-2.5 sm:flex-row">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter executive work email"
                required
                className="w-full rounded-xl border border-[#233d69] bg-[#071022] px-4 py-3 font-sans text-sm text-white placeholder:text-[#526a8d] focus:border-electric focus:outline-none focus:ring-1 focus:ring-electric transition-colors"
              />
              <button
                type="submit"
                className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-electric px-6 py-3 font-display text-sm font-semibold text-white shadow-[0_8px_20px_-4px_rgba(10,132,255,0.4)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-electric-bright hover:shadow-[0_12px_26px_-4px_rgba(56,189,248,0.5)] cursor-pointer"
              >
                {subscribed ? (
                  <span className="text-white font-medium">Subscribed!</span>
                ) : (
                  <>
                    <span>Subscribe</span>
                    <svg className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </button>
            </form>
            <span className="mt-2 text-[11px] text-[#556d8f]">
              Zero spam. Verified leadership insights only. Unsubscribe anytime.
            </span>
          </div>
        </div>

        {/* Middle row: 3 link directories (hidden) */}
        <div className="hidden">
          <div className="grid grid-cols-1 gap-10 py-12 sm:grid-cols-2 lg:grid-cols-3 border-b border-[#182946]">
            {/* Col 1: Workforce Solutions */}
            <div>
              <div className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-white">
                Workforce Solutions
              </div>
              <ul className="mt-4 space-y-2.5">
                {SOLUTIONS_LINKS.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="group inline-flex items-center gap-2 text-[13.5px] text-[#8ea4c4] transition-colors hover:text-electric"
                    >
                      <span className="h-1 w-1 rounded-full bg-[#27426e] transition-colors group-hover:bg-electric" />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 2: Company & Governance */}
            <div>
              <div className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-white">
                Company &amp; Governance
              </div>
              <ul className="mt-4 space-y-2.5">
                {COMPANY_LINKS.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="group inline-flex items-center gap-2 text-[13.5px] text-[#8ea4c4] transition-colors hover:text-electric"
                    >
                      <span className="h-1 w-1 rounded-full bg-[#27426e] transition-colors group-hover:bg-electric" />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3: Talent Ecosystem */}
            <div>
              <div className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-white">
                Talent Ecosystem
              </div>
              <ul className="mt-4 space-y-2.5">
                {ECOSYSTEM_LINKS.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="group inline-flex items-center gap-2 text-[13.5px] text-[#8ea4c4] transition-colors hover:text-electric"
                    >
                      <span className="h-1 w-1 rounded-full bg-[#27426e] transition-colors group-hover:bg-electric" />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar: Legal, Socials, Scroll-to-Top */}
        <div className="mt-8 flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex flex-col gap-1 text-center sm:text-left">
            <p className="font-mono text-[11.5px] text-[#6d84a7]">
              &copy; {new Date().getFullYear()} Pepoltek Limited. All rights reserved.
            </p>
            <p className="text-[11px] text-[#4f6485]">
              Regulated workforce infrastructure. Dedicated healthcare specialist deployments strictly adhere to HIPAA Title II and BAA standards.
            </p>
          </div>

          {/* Right actions: socials & scroll-to-top */}
          <div className="flex items-center gap-4">
            {/* Social icons */}
            <div className="flex items-center gap-2">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Pepoltek on LinkedIn"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#1e3458] bg-[#0c1830] text-[#8ea4c4] transition-all duration-200 hover:-translate-y-0.5 hover:border-electric/60 hover:bg-[#122344] hover:text-white"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28Z" />
                </svg>
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Pepoltek on GitHub"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#1e3458] bg-[#0c1830] text-[#8ea4c4] transition-all duration-200 hover:-translate-y-0.5 hover:border-electric/60 hover:bg-[#122344] hover:text-white"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Pepoltek on X"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#1e3458] bg-[#0c1830] text-[#8ea4c4] transition-all duration-200 hover:-translate-y-0.5 hover:border-electric/60 hover:bg-[#122344] hover:text-white"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>

            {/* Back to top button */}
            <button
              onClick={scrollToTop}
              aria-label="Back to top of page"
              className="group flex h-9 w-9 items-center justify-center rounded-xl border border-[#1e3458] bg-[#0c1830] text-electric transition-all duration-200 hover:-translate-y-0.5 hover:border-electric hover:bg-electric hover:text-white cursor-pointer"
            >
              <svg className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 15l7-7 7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
