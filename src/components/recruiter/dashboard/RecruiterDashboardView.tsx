"use client";

import Link from "next/link";
import { RecruiterPod, RecruiterShortlist } from "@/types/recruiter.types";
import { RecruiterAnalyticsData, RecruiterReferralsData } from "@/actions/recruiter.actions";
import {
  ShieldCheck,
  Award,
  Zap,
  ChevronRight,
} from "@/components/ui/Icons";

interface RecruiterDashboardViewProps {
  pods: RecruiterPod[];
  shortlists: RecruiterShortlist[];
  analytics?: RecruiterAnalyticsData;
  referralsData?: RecruiterReferralsData | null;
}

export function RecruiterDashboardView({
  pods,
  shortlists,
  analytics,
  referralsData,
}: RecruiterDashboardViewProps) {
  const activePodsCount = analytics ? analytics.activePodsCount : pods.length;
  const avgTime = analytics ? analytics.avgDeploymentTime : "7.0";
  const passRate = analytics ? analytics.compliancePassRate : "100%";
  const savedHours = analytics ? analytics.reclaimedHiringHours : "0.0";

  const activeReferralsCount = referralsData?.telemetry?.active_in_pipeline ?? 0;
  const placedReferralsCount = referralsData?.telemetry?.placed_specialists ?? 0;
  const totalBountiesUsd = referralsData?.telemetry?.total_bounties_usd ?? 0;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-[#bcd6fa] bg-white p-6 sm:p-8 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-electric/30 bg-electric/10 px-3 py-0.5 text-[11px] font-mono font-semibold text-electric uppercase tracking-widest">
            <span>HIRING OPERATIONS COCKPIT</span>
          </div>
          <h1 className="mt-2 font-display text-2xl sm:text-3xl font-bold tracking-tight text-ink">
            Recruiter Cockpit &amp; Requisition Management Hub
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-ink-soft">
            Manage your client hiring requisitions and healthcare specialists with zero operational overhead and guaranteed 7-day velocity.
          </p>
        </div>

        <div className="flex shrink-0 gap-2.5">
          <Link
            href="/recruiter/requisitions"
            className="rounded-xl bg-ink px-4 py-2.5 font-display text-xs font-semibold text-white shadow-xs hover:bg-electric transition-colors"
          >
            Create Requisition
          </Link>
          <Link
            href="/recruiter/candidates"
            className="rounded-xl border border-[#bcd6fa] bg-canvas/40 px-4 py-2.5 font-display text-xs font-semibold text-ink hover:bg-white transition-colors"
          >
            Search Talent Pool
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-2xl border border-[#bcd6fa] bg-white p-5 shadow-xs">
          <div className="font-mono text-xs text-mist uppercase tracking-wider">Active Open Requisitions</div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-display text-3xl font-bold text-ink">{activePodsCount}</span>
            <span className="text-xs font-semibold text-signal">
              {activePodsCount === 0 ? "Baseline" : "Active In Flight"}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-ink-soft">{activePodsCount} Requisitions Open</div>
        </div>

        <div className="rounded-2xl border border-[#bcd6fa] bg-white p-5 shadow-xs">
          <div className="font-mono text-xs text-mist uppercase tracking-wider">Avg Deployment Time</div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-display text-3xl font-bold text-electric">{avgTime}</span>
            <span className="text-xs font-mono text-mist">Days</span>
          </div>
          <div className="mt-2 text-[11px] text-signal font-semibold">Under 7-Day SLA Guarantee</div>
        </div>

        <div className="rounded-2xl border border-[#bcd6fa] bg-white p-5 shadow-xs">
          <div className="font-mono text-xs text-mist uppercase tracking-wider">Compliance Pass Rate</div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-display text-3xl font-bold text-signal">{passRate}</span>
          </div>
          <div className="mt-2 text-[11px] text-ink-soft">Zero compliance delays</div>
        </div>

        <div className="rounded-2xl border border-[#bcd6fa] bg-white p-5 shadow-xs">
          <div className="font-mono text-xs text-mist uppercase tracking-wider">Reclaimed Hiring Time</div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-display text-3xl font-bold text-ink">{savedHours}</span>
            <span className="text-xs font-mono text-mist">Hrs</span>
          </div>
          <div className="mt-2 text-[11px] text-ink-soft">Pre-vetted screening efficiency</div>
        </div>
      </div>

      {/* Active Requisitions Table & Pipeline */}
      <div className="rounded-2xl border border-[#bcd6fa] bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-bold text-ink">Active Requisitions &amp; Pipelines</h2>
            <p className="text-xs text-ink-soft">Real-time hiring progress, headcount, and delivery telemetry.</p>
          </div>
          <Link
            href="/recruiter/requisitions"
            className="font-mono text-xs font-semibold text-electric hover:underline"
          >
            Manage Requisitions →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#bcd6fa]/50 font-mono text-mist uppercase text-[11px]">
                <th className="pb-3 font-semibold">Requisition Details</th>
                <th className="pb-3 font-semibold">Hiring Lead</th>
                <th className="pb-3 font-semibold">Headcount</th>
                <th className="pb-3 font-semibold">Status &amp; Stage</th>
                <th className="pb-3 font-semibold">Sprint Velocity</th>
                <th className="pb-3 font-semibold text-right">Weekly Escrow</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#bcd6fa]/30">
              {pods.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-ink-soft">
                    <div className="font-display text-sm font-bold text-ink">No Active Requisitions</div>
                    <p className="text-xs text-mist mt-1 max-w-sm mx-auto">
                      There are currently zero open requisitions. Create a requisition to start hiring.
                    </p>
                  </td>
                </tr>
              ) : (
                pods.map((pod) => (
                  <tr key={pod.rawId || pod.id} className="hover:bg-canvas/40 transition-colors">
                    <td className="py-3.5 pr-3">
                      <div className="font-mono text-[10px] font-bold text-electric">{pod.id}</div>
                      <div className="font-display text-sm font-bold text-ink">{pod.name}</div>
                    </td>
                    <td className="py-3.5 font-medium text-ink">{pod.lead}</td>
                    <td className="py-3.5 font-mono text-ink-soft">{pod.size || "1 Specialist"}</td>
                    <td className="py-3.5">
                      <span className="rounded-full bg-signal/10 px-2.5 py-1 font-mono text-[10px] font-bold text-signal">
                        {pod.stage || pod.status}
                      </span>
                    </td>
                    <td className="py-3.5 font-mono font-semibold text-electric">{pod.velocity || "100%"}</td>
                    <td className="py-3.5 font-mono text-right font-bold text-ink">{pod.weeklyBudget}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Shortlisted Candidates Ready for Requisition Assignment */}
      <div className="rounded-2xl border border-[#bcd6fa] bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-bold text-ink">Ready-to-Deploy Talent Shortlist</h2>
            <p className="text-xs text-ink-soft">Pre-screened and benchmark-tested candidates matching your active requisitions.</p>
          </div>
          <Link
            href="/recruiter/candidates"
            className="font-mono text-xs font-semibold text-electric hover:underline"
          >
            Explore Full Pool →
          </Link>
        </div>

        {shortlists.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#bcd6fa] bg-canvas/30 p-8 text-center text-ink-soft">
            <div className="font-display text-sm font-bold text-ink">No Candidates Shortlisted</div>
            <p className="text-xs text-mist mt-1 max-w-sm mx-auto">
              Candidates matching your requisition specifications will appear here once vetted.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {shortlists.map((cand, i) => (
              <div
                key={i}
                className="rounded-xl border border-[#bcd6fa] bg-canvas/30 p-4 space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-display font-bold text-ink">{cand.name}</span>
                    <span className="rounded-md bg-signal/10 px-2 py-0.5 font-mono text-[10px] font-bold text-signal">
                      Match {cand.match}
                    </span>
                  </div>
                  <p className="text-xs text-ink-soft mt-0.5">{cand.role}</p>

                  <div className="mt-3 flex flex-wrap gap-1">
                    {cand.skills.map((s) => (
                      <span
                        key={s}
                        className="rounded-md bg-white border border-[#bcd6fa]/50 px-2 py-0.5 text-[10px] font-mono text-ink-soft"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-[#bcd6fa]/30">
                  <div className="font-mono text-[10px] text-mist mb-2">Status: {cand.status}</div>
                  <Link
                    href="/recruiter/candidates"
                    className="block text-center w-full rounded-lg bg-ink py-1.5 font-display text-[11px] font-semibold text-white hover:bg-electric transition-colors cursor-pointer shadow-xs"
                  >
                    {cand.action} →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Assessment Validation & Credential Auditing Hub Section */}
      <div className="rounded-3xl border border-[#bcd6fa] bg-gradient-to-r from-white via-canvas/40 to-white p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#bcd6fa]/40 pb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-electric/30 bg-electric/10 px-3 py-0.5 text-[10px] font-mono font-bold text-electric uppercase tracking-widest">
              <ShieldCheck size={12} />
              <span>ASSESSMENT &amp; CREDENTIAL AUDITING DESK</span>
            </div>
            <h2 className="mt-1 font-display text-xl font-bold text-ink">
              Validation &amp; Verification Operations
            </h2>
            <p className="text-xs text-ink-soft mt-0.5">
              Track candidate technical take-home grading, code architecture scorecards, and healthcare primary-source licensure audits.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 flex-wrap sm:flex-nowrap">
            <Link
              href="/recruiter/assessments"
              className="inline-flex items-center gap-2 rounded-xl bg-ink px-4 py-2 font-display text-xs font-bold text-white shadow-xs hover:bg-electric transition-colors"
            >
              <span>Vetting Templates Hub</span>
              <span className="text-electric-bright">→</span>
            </Link>
            <Link
              href="/validator/dashboard"
              className="inline-flex items-center gap-2 rounded-xl border border-electric/30 bg-electric/5 px-4 py-2 font-display text-xs font-bold text-electric shadow-xs hover:bg-electric hover:text-white transition-colors"
            >
              <Zap size={13} />
              <span>Assessor Cockpit</span>
            </Link>
          </div>
        </div>

        {/* Two Domain Cards: Technical Assessment & Healthcare Credential Desk */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Track 1: Technical Assessment Validation */}
          <div className="rounded-2xl border border-electric/25 bg-white p-5 shadow-xs flex flex-col justify-between hover:border-electric transition-colors">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="rounded-xl bg-electric/10 p-2 text-electric">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-bold text-ink">
                      Technical Assessment Validation
                    </h3>
                    <span className="font-mono text-[10px] text-electric font-semibold uppercase tracking-wider">
                      Technology Sector Track
                    </span>
                  </div>
                </div>
                <span className="rounded-full bg-electric/10 px-2 py-0.5 font-mono text-[10px] font-bold text-electric">
                  Code &amp; Architecture
                </span>
              </div>

              <p className="mt-3 text-xs text-ink-soft leading-relaxed">
                Manages algorithmic take-homes, distributed system architecture scorecards, and candidate GitHub repository reviews graded by verified staff validators.
              </p>

              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-xl bg-canvas p-2.5 border border-[#bcd6fa]/40">
                  <div className="font-mono text-[10px] text-mist uppercase">Grading SLA</div>
                  <div className="mt-0.5 font-display text-sm font-bold text-ink">12 Hours</div>
                  <div className="text-[10px] text-signal font-semibold">Fast-turnaround benchmark</div>
                </div>
                <div className="rounded-xl bg-canvas p-2.5 border border-[#bcd6fa]/40">
                  <div className="font-mono text-[10px] text-mist uppercase">Grading Protocol</div>
                  <div className="mt-0.5 font-display text-sm font-bold text-ink">Double-Blind</div>
                  <div className="text-[10px] text-ink-soft">Criterion-calibrated marks</div>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[#bcd6fa]/40 flex items-center justify-between">
              <span className="text-[11px] text-mist font-mono">Assigned to Technical Validators</span>
              <Link
                href="/recruiter/assessments?track=technology"
                className="inline-flex items-center gap-1 font-mono text-xs font-bold text-electric hover:underline"
              >
                <span>Open Tech Queue</span>
                <ChevronRight size={13} />
              </Link>
            </div>
          </div>

          {/* Track 2: Healthcare Credential Validators */}
          <div className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-xs flex flex-col justify-between hover:border-emerald-500 transition-colors">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="rounded-xl bg-emerald-50 p-2 text-emerald-700">
                    <Award size={18} />
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-bold text-ink">
                      Healthcare Credential Validators
                    </h3>
                    <span className="font-mono text-[10px] text-emerald-700 font-semibold uppercase tracking-wider">
                      Healthcare &amp; Clinical Track
                    </span>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-700 border border-emerald-200">
                  Primary Source Audit
                </span>
              </div>

              <p className="mt-3 text-xs text-ink-soft leading-relaxed">
                Authenticates state nursing licenses (Compact State RN, NP, PA), DEA registrations, BLS/ACLS/PALS certifications, and clinical compliance records via primary source lookup.
              </p>

              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-xl bg-canvas p-2.5 border border-[#bcd6fa]/40">
                  <div className="font-mono text-[10px] text-mist uppercase">Verification DB</div>
                  <div className="mt-0.5 font-display text-sm font-bold text-ink">NURSYS Live</div>
                  <div className="text-[10px] text-signal font-semibold">Primary source verification</div>
                </div>
                <div className="rounded-xl bg-canvas p-2.5 border border-[#bcd6fa]/40">
                  <div className="font-mono text-[10px] text-mist uppercase">Compliance Gate</div>
                  <div className="mt-0.5 font-display text-sm font-bold text-ink">100% Verified</div>
                  <div className="text-[10px] text-ink-soft">Before sprint deployment</div>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[#bcd6fa]/40 flex items-center justify-between">
              <span className="text-[11px] text-mist font-mono">Assigned to Credential Officers</span>
              <Link
                href="/recruiter/assessments?track=healthcare"
                className="inline-flex items-center gap-1 font-mono text-xs font-bold text-emerald-700 hover:underline"
              >
                <span>Open Clinical Queue</span>
                <ChevronRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Community Referral & Bounty Pipeline Section */}
      <div className="rounded-3xl border border-[#bcd6fa] bg-gradient-to-r from-white via-[#f7fbff] to-white p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#bcd6fa]/40 pb-5 mb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-signal/30 bg-signal/10 px-3 py-0.5 text-[10px] font-mono font-bold text-signal uppercase tracking-widest">
              <span className="h-1.5 w-1.5 rounded-full bg-signal animate-pulse" />
              <span>Sourcing Engine • Community Referrals</span>
            </div>
            <h2 className="mt-1 font-display text-xl font-bold text-ink">
              Community Talent &amp; Bounty Pipeline
            </h2>
            <p className="text-xs text-ink-soft mt-0.5">
              Review pre-attributed specialist candidates referred by our verified community scout network.
            </p>
          </div>

          <Link
            href="/recruiter/referrals"
            className="inline-flex items-center gap-2 rounded-xl bg-ink px-4 py-2.5 font-display text-xs font-bold text-white shadow-xs hover:bg-electric transition-colors shrink-0"
          >
            <span>Open Referral Network Console</span>
            <span className="text-electric-bright">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-[#bcd6fa] bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-mono text-mist uppercase text-[10px]">Active In Screening</span>
              <span className="rounded bg-blue-50 px-2 py-0.5 font-mono text-[10px] font-bold text-blue-700">High Priority</span>
            </div>
            <div className="font-display text-2xl font-bold text-ink mt-1">
              {activeReferralsCount} {activeReferralsCount === 1 ? "Specialist" : "Specialists"}
            </div>
            <p className="text-[11px] text-ink-soft mt-1">Referred candidates awaiting recruiter sprint qualification.</p>
            <Link href="/recruiter/referrals" className="mt-3 block font-mono text-xs font-semibold text-electric hover:underline">
              Review Queue →
            </Link>
          </div>

          <div className="rounded-2xl border border-[#bcd6fa] bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-mono text-mist uppercase text-[10px]">Placed &amp; Integrated</span>
              <span className="rounded bg-signal/15 px-2 py-0.5 font-mono text-[10px] font-bold text-signal">90d Guarantee</span>
            </div>
            <div className="font-display text-2xl font-bold text-signal mt-1">
              {placedReferralsCount} Placed
            </div>
            <p className="text-[11px] text-ink-soft mt-1">Successfully placed specialists in active enterprise requisitions.</p>
            <Link href="/recruiter/referrals" className="mt-3 block font-mono text-xs font-semibold text-electric hover:underline">
              View Placed Talent →
            </Link>
          </div>

          <div className="rounded-2xl border border-electric/40 bg-gradient-to-br from-[#0c1a33] to-[#081224] p-4 text-white shadow-xs">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-mono text-cyan-300 uppercase text-[10px]">Community Bounties</span>
              <span className="rounded bg-signal/20 px-2 py-0.5 font-mono text-[9px] font-bold text-signal border border-signal/30">Escrow</span>
            </div>
            <div className="font-display text-2xl font-bold text-white mt-1">
              ${totalBountiesUsd.toLocaleString()} USD
            </div>
            <p className="text-[11px] text-gray-300 mt-1">Earned bounties reconciled through double-entry payout ledger.</p>
            <Link href="/recruiter/referrals" className="mt-3 block font-mono text-xs font-semibold text-electric-bright hover:underline">
              Manage Bounties &amp; Escrow →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
