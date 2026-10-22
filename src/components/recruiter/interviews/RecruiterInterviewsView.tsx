"use client";

import { useState } from "react";
import { RecruiterInterview } from "@/types/recruiter.types";
import { scheduleInterviewAction } from "@/actions/recruiter.actions";

interface RecruiterInterviewsViewProps {
  interviews: RecruiterInterview[];
}

export function RecruiterInterviewsView({
  interviews: initialInterviews,
}: RecruiterInterviewsViewProps) {
  const [interviews, setInterviews] = useState<RecruiterInterview[]>(initialInterviews);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form fields
  const [candidateName, setCandidateName] = useState("");
  const [candidateEmail, setCandidateEmail] = useState("");
  const [role, setRole] = useState("Lead Healthcare AI Engineer");
  const [interviewType, setInterviewType] = useState("Technical Coding & System Design");
  const [scheduledTime, setScheduledTime] = useState("Tomorrow at 2:00 PM EST");
  const [panel, setPanel] = useState("Lead Systems Architect & Tech Validator");
  const [meetingLink, setMeetingLink] = useState("https://meet.google.com/pepoltek-sprint");

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateName.trim() || !candidateEmail.trim()) {
      setStatusMessage({ type: "error", text: "Candidate Name and Email are required." });
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);

    const res = await scheduleInterviewAction({
      candidate_name: candidateName.trim(),
      candidate_email: candidateEmail.trim(),
      role: role.trim(),
      interview_type: interviewType,
      scheduled_time: scheduledTime,
      panel,
      meeting_link: meetingLink,
    });

    setIsSubmitting(false);

    if (res.success && res.data) {
      const newInterview: RecruiterInterview = {
        id: res.data.id || `INT-2026-${String(interviews.length + 1).padStart(3, "0")}`,
        candidate: res.data.candidate || candidateName,
        role: res.data.role || role,
        pod: res.data.pod || role,
        time: res.data.time || scheduledTime,
        type: res.data.type || interviewType,
        panel: res.data.panel || panel,
        status: "Confirmed",
      };

      setInterviews([newInterview, ...interviews]);
      setStatusMessage({
        type: "success",
        text: `Sprint interview scheduled for ${candidateName}. Live invitation dispatched via SMTP to ${candidateEmail}.`,
      });

      // Reset form
      setCandidateName("");
      setCandidateEmail("");
      setShowModal(false);
    } else {
      setStatusMessage({
        type: "error",
        text: res.error || "Failed to schedule interview. Please check inputs.",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-electric/30 bg-electric/10 px-3 py-0.5 text-[11px] font-mono font-semibold text-electric uppercase tracking-widest">
            <span>Module 6: Technical Vetting</span>
          </div>
          <h1 className="mt-1 font-display text-2xl font-bold text-ink">Sprint Technical Interviews</h1>
          <p className="text-xs sm:text-sm text-ink-soft">
            Live technical evaluations, clinical rota assessments, and client panel sessions with automated email invitations.
          </p>
        </div>
        <button
          onClick={() => {
            setShowModal(true);
            setStatusMessage(null);
          }}
          className="rounded-xl bg-ink px-4 py-2 font-display text-xs font-semibold text-white hover:bg-electric transition-colors shadow-xs cursor-pointer"
        >
          + Schedule Sprint Interview
        </button>
      </div>

      {/* Status banner */}
      {statusMessage && (
        <div
          className={`rounded-xl border p-4 text-xs font-medium flex items-center justify-between ${
            statusMessage.type === "success"
              ? "border-signal/30 bg-signal/10 text-signal"
              : "border-scarlet/30 bg-scarlet/10 text-scarlet"
          }`}
        >
          <span>{statusMessage.text}</span>
          <button
            onClick={() => setStatusMessage(null)}
            className="font-mono text-xs font-bold hover:opacity-75 cursor-pointer ml-3"
          >
            ✕
          </button>
        </div>
      )}

      {/* Schedule Interview Modal / Drawer */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl border border-[#bcd6fa] bg-white p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#bcd6fa]/40 pb-3">
              <div>
                <h2 className="font-display text-lg font-bold text-ink">Schedule Technical Sprint Interview</h2>
                <p className="text-xs text-ink-soft">Automated calendar invitation dispatched via SMTP</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-mist hover:text-ink font-mono text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSchedule} className="space-y-3 text-xs">
              <div>
                <label className="block font-mono text-[11px] uppercase tracking-wider text-mist mb-1">
                  Candidate Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  placeholder="e.g. Dr. Sarah Jenkins"
                  className="w-full rounded-xl border border-[#bcd6fa] bg-white p-2.5 font-medium text-ink focus:border-electric focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-mono text-[11px] uppercase tracking-wider text-mist mb-1">
                  Candidate Email (SMTP Dispatched) *
                </label>
                <input
                  type="email"
                  required
                  value={candidateEmail}
                  onChange={(e) => setCandidateEmail(e.target.value)}
                  placeholder="e.g. specialist@domain.com"
                  className="w-full rounded-xl border border-[#bcd6fa] bg-white p-2.5 font-medium text-ink focus:border-electric focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-mono text-[11px] uppercase tracking-wider text-mist mb-1">
                  Target Requisition / Role Title
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Lead Healthcare AI Engineer"
                  className="w-full rounded-xl border border-[#bcd6fa] bg-white p-2.5 font-medium text-ink focus:border-electric focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-wider text-mist mb-1">
                    Evaluation Format
                  </label>
                  <select
                    value={interviewType}
                    onChange={(e) => setInterviewType(e.target.value)}
                    className="w-full rounded-xl border border-[#bcd6fa] bg-white p-2.5 font-medium text-ink focus:border-electric focus:outline-hidden"
                  >
                    <option value="Technical Coding & System Design">Technical Coding &amp; System Design</option>
                    <option value="Live Architecture Defense">Live Architecture Defense</option>
                    <option value="Clinical Competency & Patient Rota">Clinical Competency &amp; Patient Rota</option>
                    <option value="Client Interview Panel">Client Interview Panel</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-wider text-mist mb-1">
                    Scheduled Time
                  </label>
                  <input
                    type="text"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    placeholder="Tomorrow at 2:00 PM EST"
                    className="w-full rounded-xl border border-[#bcd6fa] bg-white p-2.5 font-medium text-ink focus:border-electric focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[11px] uppercase tracking-wider text-mist mb-1">
                  Evaluation Panel
                </label>
                <input
                  type="text"
                  value={panel}
                  onChange={(e) => setPanel(e.target.value)}
                  placeholder="Lead Systems Architect & Tech Validator"
                  className="w-full rounded-xl border border-[#bcd6fa] bg-white p-2.5 font-medium text-ink focus:border-electric focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-mono text-[11px] uppercase tracking-wider text-mist mb-1">
                  Google Meet / Room Link
                </label>
                <input
                  type="url"
                  value={meetingLink}
                  onChange={(e) => setMeetingLink(e.target.value)}
                  placeholder="https://meet.google.com/..."
                  className="w-full rounded-xl border border-[#bcd6fa] bg-white p-2.5 font-medium text-ink focus:border-electric focus:outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#bcd6fa]/40">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setShowModal(false)}
                  className="rounded-xl border border-[#bcd6fa] bg-white px-3.5 py-1.5 font-display text-xs font-semibold text-ink hover:bg-canvas transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-electric px-4 py-2 font-display text-xs font-semibold text-white hover:bg-electric-bright shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? "Dispatching Invitation..." : "Confirm & Send Invitation →"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Interviews List */}
      {interviews.length === 0 ? (
        <div className="rounded-3xl border border-[#bcd6fa] bg-white p-8 sm:p-12 text-center shadow-xs">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-electric/10 text-electric">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="font-display text-base font-bold text-ink">No Sprint Interviews Scheduled</h3>
          <p className="mt-1 text-xs text-ink-soft max-w-md mx-auto leading-relaxed">
            There are currently no candidate evaluations or client panel assessments on the calendar. Schedule an interview above to dispatch invitations and begin evaluations.
          </p>
        </div>
      ) : (
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
                  Requisition: <strong className="text-ink">{item.pod}</strong>
                </p>
                <p className="text-[11px] font-mono text-mist">
                  Evaluation: {item.type} | Panel: {item.panel}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href="https://meet.google.com/pepoltek-sprint"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl bg-electric px-4 py-1.5 font-display text-xs font-semibold text-white hover:bg-electric-bright shadow-xs transition-colors"
                >
                  Launch Live Room ↗
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
