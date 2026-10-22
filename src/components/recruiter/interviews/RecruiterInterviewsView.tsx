"use client";

import { RecruiterInterview } from "@/data/mock";

interface RecruiterInterviewsViewProps {
  interviews: RecruiterInterview[];
}

export function RecruiterInterviewsView({
  interviews,
}: RecruiterInterviewsViewProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Sprint Technical Interviews</h1>
          <p className="text-xs sm:text-sm text-ink-soft">
            Live technical evaluations, clinical rota assessments, and client pod pitch sessions.
          </p>
        </div>
        <button className="rounded-xl bg-ink px-4 py-2 font-display text-xs font-semibold text-white hover:bg-electric transition-colors shadow-xs">
          + Schedule Sprint Interview
        </button>
      </div>

      <div className="space-y-4">
        {interviews.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-[#bcd6fa] bg-white p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-electric transition-all"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-electric">{item.id}</span>
                <span className="rounded-md bg-signal/10 px-2 py-0.5 font-mono text-[10px] font-bold text-signal">
                  {item.status}
                </span>
                <span className="text-xs font-mono text-mist">| {item.time}</span>
              </div>
              <h2 className="font-display text-base font-bold text-ink">
                {item.candidate} <span className="text-xs font-normal text-ink-soft font-mono">({item.role})</span>
              </h2>
              <p className="text-xs text-ink-soft">
                Target Pod: <strong className="text-ink">{item.pod}</strong>
              </p>
              <p className="text-[11px] font-mono text-mist">
                Evaluation: {item.type} | Panel: {item.panel}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button className="rounded-xl border border-[#bcd6fa] bg-white px-3.5 py-1.5 font-display text-xs font-semibold text-ink hover:bg-canvas">
                Review Rubric
              </button>
              <button className="rounded-xl bg-electric px-4 py-1.5 font-display text-xs font-semibold text-white hover:bg-electric-bright shadow-xs">
                Launch Live Room
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
