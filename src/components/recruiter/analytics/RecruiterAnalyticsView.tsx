"use client";

import { RecruiterAnalyticsData } from "@/actions/recruiter.actions";

interface RecruiterAnalyticsViewProps {
  analytics?: RecruiterAnalyticsData;
}

export function RecruiterAnalyticsView({ analytics }: RecruiterAnalyticsViewProps) {
  const activePods = analytics?.activePodsCount ?? 0;
  const totalCandidates = analytics?.totalCandidates ?? 0;
  const interviewsCount = analytics?.interviewCount ?? 0;
  const passRate = analytics?.compliancePassRate ?? "100%";
  const avgDeployment = analytics?.avgDeploymentTime ?? "7.0";
  const reclaimedHours = analytics?.reclaimedHiringHours ?? "0.0";

  const metrics = [
    {
      title: "Active Open Requisitions",
      value: String(activePods),
      sub: `${activePods} sprint requisitions open`,
      badge: "Deployment SLA",
    },
    {
      title: "Vetted Specialists",
      value: String(totalCandidates),
      sub: "Benchmarked talent directory",
      badge: "Pre-Vetted Pool",
    },
    {
      title: "Compliance Pass Rate",
      value: passRate,
      sub: "Automated verification clear",
      badge: "Audit SLA",
    },
    {
      title: "Technical Interviews",
      value: String(interviewsCount),
      sub: "Scheduled sprint rounds",
      badge: "AI Evaluated",
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-electric/30 bg-electric/10 px-3 py-0.5 text-[11px] font-mono font-semibold text-electric uppercase tracking-widest">
          <span>Module 6: Recruiter Telemetry</span>
        </div>
        <h1 className="mt-1 font-display text-2xl font-bold text-ink">Talent &amp; Requisition Hiring Telemetry</h1>
        <p className="text-xs sm:text-sm text-ink-soft">
          Live velocity tracking, requisition SLA metrics, and technical assessment statistics.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <div key={i} className="rounded-2xl border border-[#bcd6fa] bg-white p-5 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-mist uppercase tracking-wider">{m.title}</span>
              <span className="rounded-full bg-signal/10 px-2 py-0.5 font-mono text-[10px] font-bold text-signal">
                {m.badge}
              </span>
            </div>
            <div className="font-display text-2xl sm:text-3xl font-bold text-ink">{m.value}</div>
            <p className="text-[11px] text-ink-soft">{m.sub}</p>
          </div>
        ))}
      </div>

      {/* SLA & Time-to-Deploy telemetry */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-[#bcd6fa] bg-white p-6 shadow-xs space-y-3">
          <div className="font-mono text-xs uppercase tracking-wider text-mist">Guaranteed Delivery Velocity</div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-4xl font-bold text-electric">{avgDeployment}</span>
            <span className="font-mono text-xs text-ink-soft">Days SLA to First Sprint</span>
          </div>
          <p className="text-xs text-ink-soft">
            Compared against 45+ day traditional enterprise recruiting cycles. 100% pre-vetted specialists deploy directly into production sprints.
          </p>
        </div>

        <div className="rounded-2xl border border-[#bcd6fa] bg-white p-6 shadow-xs space-y-3">
          <div className="font-mono text-xs uppercase tracking-wider text-mist">Reclaimed Engineering &amp; Hiring Hours</div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-4xl font-bold text-signal">{reclaimedHours}</span>
            <span className="font-mono text-xs text-ink-soft">Hours Saved</span>
          </div>
          <p className="text-xs text-ink-soft">
            Eliminates multi-stage technical screening fatigue via proctor-free benchmark test batteries and verified code telemetry.
          </p>
        </div>
      </div>
    </div>
  );
}
