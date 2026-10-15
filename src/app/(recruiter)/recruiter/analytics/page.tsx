"use client";

export default function RecruiterAnalyticsPage() {
  const metrics = [
    { title: "Average Time-to-Deploy", value: "6.8 Days", sub: "vs 45 days industry standard", badge: "-84% Faster" },
    { title: "Average Cost Per Pod Specialist", value: "$8,400/mo", sub: "vs $14,200 traditional agency", badge: "41% Savings" },
    { title: "90-Day Pod Retention", value: "98.2%", sub: "Zero mid-sprint dropouts", badge: "Industry Lead" },
    { title: "Hours Saved on Screening", value: "184 Hrs", sub: "Automated benchmark grading", badge: "Active ROI" },
  ];

  const sprintVelocity = [
    { sprint: "Sprint 1", target: 40, actual: 44, velocity: "110%" },
    { sprint: "Sprint 2", target: 45, actual: 46, velocity: "102%" },
    { sprint: "Sprint 3", target: 50, actual: 52, velocity: "104%" },
    { sprint: "Sprint 4 (Current)", target: 55, actual: 54, velocity: "98%" },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Talent & Pod Hiring Telemetry</h1>
        <p className="text-xs sm:text-sm text-ink-soft">
          Comprehensive velocity tracking, financial ROI metrics, and specialist retention statistics.
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

      {/* Sprint Velocity Burndown */}
      <div className="rounded-2xl border border-[#bcd6fa] bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-base font-bold text-ink">Pod Sprint Story Points & Velocity</h2>
            <p className="text-xs text-ink-soft">Delivered points vs committed sprint velocity across active pods.</p>
          </div>
          <span className="font-mono text-xs text-signal font-bold">104% Cumulative Efficiency</span>
        </div>

        <div className="space-y-3 pt-2">
          {sprintVelocity.map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-ink">{item.sprint}</span>
                <span className="font-mono text-mist text-[11px]">
                  {item.actual} / {item.target} pts ({item.velocity})
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-canvas overflow-hidden border border-[#bcd6fa]/40">
                <div
                  className="h-full rounded-full bg-electric"
                  style={{ width: `${Math.min(parseInt(item.velocity), 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
