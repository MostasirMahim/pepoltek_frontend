"use client";

import { useState } from "react";
import Link from "next/link";
import { RecruiterCandidate, RecruiterPod } from "@/data/mock";
import {
  createShortlistSubmissionAction,
  ShortlistSubmissionItemInput,
} from "@/actions/recruiter.actions";
import {
  Users,
  Search,
  Eye,
  X,
  CheckCircle,
  Clock,
  ShieldCheck,
  Zap,
  Award,
  ExternalLink,
  DollarSign,
  FileText,
} from "@/components/ui/Icons";

interface RecruiterCandidatesViewProps {
  candidates: RecruiterCandidate[];
  pods?: RecruiterPod[];
}

export function RecruiterCandidatesView({
  candidates,
  pods = [],
}: RecruiterCandidatesViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sectorFilter, setSectorFilter] = useState("All");

  // Candidate dossier drawer state
  const [selectedCandidate, setSelectedCandidate] = useState<RecruiterCandidate | null>(null);
  const [dossierTab, setDossierTab] = useState<"profile" | "vetting" | "compliance" | "actions">("profile");

  // Multi-selection state for Shortlist Builder (ATS-06, D-01)
  const [selectedCandidateIds, setSelectedCandidateIds] = useState<string[]>([]);
  const [isShortlistDrawerOpen, setIsShortlistDrawerOpen] = useState(false);
  const [shortlistTab, setShortlistTab] = useState<"setup" | "roster" | "preview">("setup");

  // Shortlist configuration state
  const [targetRequisitionId, setTargetRequisitionId] = useState<string>(
    pods.length > 0 ? pods[0].id : "REQ-FINTECH-01"
  );
  const [clientName, setClientName] = useState<string>("Enterprise Client Partner");
  const [deliveryChannel, setDeliveryChannel] = useState<"email" | "im" | "client_ats" | "portal">("email");
  const [pitchNotes, setPitchNotes] = useState<string>(
    "Pre-vetted engineering specialists with 5+ yrs production experience. 7-day sprint start availability with verified technical vetting scores."
  );

  // Data masking controls (ATS-06, AC-06)
  const [maskContact, setMaskContact] = useState<boolean>(true);
  const [includeVetting, setIncludeVetting] = useState<boolean>(true);
  const [includeRates, setIncludeRates] = useState<boolean>(true);

  // Submission execution state
  const [isSubmittingShortlist, setIsSubmittingShortlist] = useState<boolean>(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<{ id: string; timestamp: string } | null>(null);
  const [notification, setNotification] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setNotification({ type, text });
    setTimeout(() => setNotification(null), 4500);
  };

  const filteredCandidates = candidates.filter((c) => {
    const matchesSector = sectorFilter === "All" || c.sector === sectorFilter;
    const q = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.title.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q) ||
      (c.location && c.location.toLowerCase().includes(q)) ||
      c.skills.some((s) => s.toLowerCase().includes(q));
    return matchesSector && matchesSearch;
  });

  const selectedCandidates = candidates.filter((c) => selectedCandidateIds.includes(c.id));

  // Multi-selection handlers
  const toggleSelectCandidate = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedCandidateIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectAllFiltered = () => {
    setSelectedCandidateIds(filteredCandidates.map((c) => c.id));
    showToast(`Selected all ${filteredCandidates.length} filtered specialists.`);
  };

  const clearSelection = () => {
    setSelectedCandidateIds([]);
  };

  const handleAddToPod = (cand: RecruiterCandidate, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!selectedCandidateIds.includes(cand.id)) {
      setSelectedCandidateIds((prev) => [...prev, cand.id]);
    }
    showToast(`Added ${cand.name} (${cand.id}) to active shortlist.`);
  };

  // Generate shareable markdown text pitch (Zero em dashes house style)
  const generateShareablePitch = () => {
    const targetPodObj = pods.find((p) => p.id === targetRequisitionId);
    const targetTitle = targetPodObj ? targetPodObj.name : targetRequisitionId || "Direct Placement";

    const lines: string[] = [
      "# PEPOLTEK CANDIDATE SUBMISSION DOSSIER",
      `Target Requisition: ${targetTitle}`,
      `Client Partner: ${clientName}`,
      `Delivery Channel: ${deliveryChannel.toUpperCase()}`,
      `Generated: ${new Date().toUTCString()}`,
      "",
      `Executive Summary: ${pitchNotes}`,
      "",
      `## CANDIDATE SHORTLIST (${selectedCandidates.length} SPECIALISTS)`,
    ];

    selectedCandidates.forEach((c, idx) => {
      const skillsStr = c.skills.join(", ");
      const contactInfo = maskContact
        ? "[Contact details masked: Protected by Pepoltek Escrow]"
        : `${c.email || "specialist@pepoltek.com"} | ${c.phone || "+1 (555) 019-2834"}`;

      lines.push(
        `${idx + 1}. ${c.name} (${c.title})`,
        `   - Specialist ID: ${c.id}`,
        `   - Sector: ${c.sector}`,
        `   - Match Score: ${c.matchScore} (Verified Vetted)`,
        `   - Experience: ${c.experience}`,
        includeRates ? `   - Billing Rate: ${c.rate}` : "",
        `   - Core Skills: ${skillsStr}`,
        `   - Placement Contact: ${contactInfo}`,
        c.notes ? `   - Recruiter Notes: ${c.notes}` : "",
        ""
      );
    });

    lines.push(
      "---",
      "CONFIDENTIALITY NOTICE: This submission dossier contains proprietary vetted candidate assessments under Pepoltek staffing terms. Contact your Pepoltek staffing lead to schedule interviews."
    );

    return lines.filter(Boolean).join("\n");
  };

  const handleCopyPitch = async () => {
    const text = generateShareablePitch();
    try {
      await navigator.clipboard.writeText(text);
      showToast("Submission pitch copied to clipboard. Ready to paste into Email or Slack.");
    } catch {
      showToast("Unable to copy to clipboard automatically.", "error");
    }
  };

  const handleDownloadCsv = () => {
    const headers = [
      "Candidate_ID",
      "Full_Name",
      "Title",
      "Sector",
      "Experience",
      "Billing_Rate",
      "Match_Score",
      "Skills",
      "Contact_Protection",
      "Recruiter_Notes",
    ];

    const rows = selectedCandidates.map((c) => {
      const contactStr = maskContact
        ? "[Protected by Pepoltek Escrow]"
        : `${c.email || ""} ${c.phone || ""}`;
      return [
        `"${c.id}"`,
        `"${c.name}"`,
        `"${c.title}"`,
        `"${c.sector}"`,
        `"${c.experience}"`,
        includeRates ? `"${c.rate}"` : `"Confidential"`,
        `"${c.matchScore}"`,
        `"${c.skills.join(", ")}"`,
        `"${contactStr}"`,
        `"${c.notes || "Pre-vetted specialist"}"`,
      ].join(",");
    });

    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Pepoltek_Shortlist_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Downloaded standard ATS CSV for client import.");
  };

  const handleSubmitShortlist = async () => {
    if (selectedCandidates.length === 0) {
      showToast("Please select at least 1 specialist for the shortlist.", "error");
      return;
    }

    setIsSubmittingShortlist(true);

    const items: ShortlistSubmissionItemInput[] = selectedCandidates.map((c) => ({
      candidate_id: c.id,
      candidate_name: c.name,
      candidate_title: c.title,
      sector: c.sector,
      experience: c.experience,
      rate: includeRates ? c.rate : "Confidential",
      match_score: c.matchScore,
      skills: c.skills,
      revealed_fields: {
        show_contact: !maskContact,
        show_vetting: includeVetting,
        show_rates: includeRates,
      },
      masked_contact: {
        email: maskContact ? "[Protected by Pepoltek Escrow]" : c.email || "direct@pepoltek.com",
        phone: maskContact ? "[Protected by Pepoltek Escrow]" : c.phone || "+1 (555) 019-2834",
      },
      recruiter_notes: c.notes || pitchNotes,
    }));

    const res = await createShortlistSubmissionAction({
      requisition_id: targetRequisitionId || undefined,
      client_name: clientName,
      channel: deliveryChannel,
      pitch_notes: pitchNotes,
      items,
    });

    setIsSubmittingShortlist(false);

    if (res.success) {
      const cleanSubId = res.data?.id ? String(res.data.id).replace(/-/g, "") : "";
      const subId = cleanSubId ? cleanSubId.slice(-6).toUpperCase() : "SUB-LIVE";
      setSubmissionSuccess({
        id: subId,
        timestamp: new Date().toLocaleTimeString(),
      });
      showToast("Shortlist package logged to ATS. Candidates transitioned to Interview / Submitted to Client.");
    } else {
      showToast(res.error || "Failed to log submission package.", "error");
    }
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-electric/30 bg-electric/10 px-3 py-0.5 text-[11px] font-mono font-semibold text-electric uppercase tracking-widest">
            <Users size={12} />
            <span>MODULE 6: ATS TALENT DIRECTORY</span>
          </div>
          <h1 className="mt-2 font-display text-2xl font-bold text-ink">
            Pre-Vetted Talent Directory
          </h1>
          <p className="text-xs sm:text-sm text-ink-soft">
            Top 2% vetted software engineers and compliance-cleared healthcare professionals ready for rapid requisition deployment.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {selectedCandidateIds.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setIsShortlistDrawerOpen(true);
                setSubmissionSuccess(null);
              }}
              className="rounded-xl bg-electric px-3.5 py-2 font-display text-xs font-bold text-white shadow-xs hover:bg-electric-bright transition-colors inline-flex items-center gap-1.5 cursor-pointer animate-in fade-in-0"
            >
              <FileText size={13} />
              <span>Shortlist ({selectedCandidateIds.length})</span>
            </button>
          )}

          <Link
            href="/recruiter/interviews"
            className="rounded-xl border border-[#bcd6fa] bg-white px-3.5 py-2 font-display text-xs font-semibold text-ink shadow-2xs hover:bg-canvas transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Clock size={13} className="text-electric" />
            <span>Sprint Interviews</span>
          </Link>

          <div className="rounded-xl bg-ink px-4 py-2 font-mono text-xs font-bold text-white shadow-xs inline-flex items-center gap-1.5">
            <span>{candidates.length} Specialists Live</span>
          </div>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div
          className={`rounded-xl border px-4 py-2.5 text-xs font-semibold flex items-center gap-2 animate-in fade-in-0 duration-200 ${
            notification.type === "success"
              ? "border-signal/30 bg-signal/10 text-signal"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          <CheckCircle size={16} />
          <span>{notification.text}</span>
        </div>
      )}

      {/* Search, Filters & Bulk Actions */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-mist" size={14} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, skill (React, Go, Python, AWS), ID, or location..."
            className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3.5 py-2 pl-9 text-xs text-ink placeholder-mist focus:border-electric focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2">
          {["All", "Software Tech", "Healthcare"].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSectorFilter(s)}
              className={`rounded-xl px-3.5 py-2 font-display text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                sectorFilter === s
                  ? "bg-ink text-white shadow-xs"
                  : "bg-white border border-[#bcd6fa]/60 text-ink-soft hover:text-ink"
              }`}
            >
              {s}
            </button>
          ))}

          <div className="h-4 w-px bg-[#bcd6fa]/60 hidden sm:block mx-1" />

          <button
            type="button"
            onClick={selectAllFiltered}
            className="rounded-xl border border-[#bcd6fa]/60 bg-white px-3 py-2 font-display text-xs font-semibold text-ink hover:border-electric hover:text-electric transition-colors cursor-pointer whitespace-nowrap"
          >
            Select All ({filteredCandidates.length})
          </button>

          {selectedCandidateIds.length > 0 && (
            <button
              type="button"
              onClick={clearSelection}
              className="rounded-xl border border-red-200 bg-red-50/50 px-3 py-2 font-display text-xs font-semibold text-red-600 hover:bg-red-100 transition-colors cursor-pointer whitespace-nowrap"
            >
              Deselect ({selectedCandidateIds.length})
            </button>
          )}
        </div>
      </div>

      {/* Talent Grid */}
      {filteredCandidates.length === 0 ? (
        <div className="rounded-3xl border border-[#bcd6fa] bg-white p-8 sm:p-12 text-center shadow-xs">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-electric/10 text-electric">
            <Users size={24} />
          </div>
          <h3 className="font-display text-base font-bold text-ink">No Candidates in Directory</h3>
          <p className="mt-1 text-xs text-ink-soft max-w-md mx-auto leading-relaxed">
            There are currently no pre-vetted specialists matching your filter parameters. As candidates complete technical intake and vetting, they will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCandidates.map((cand) => {
            const isSelected = selectedCandidateIds.includes(cand.id);

            return (
              <div
                key={cand.id}
                onClick={() => {
                  setSelectedCandidate(cand);
                  setDossierTab("profile");
                }}
                className={`rounded-2xl border p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-4 transition-all cursor-pointer group ${
                  isSelected
                    ? "border-electric ring-2 ring-electric/25 bg-electric/[0.02]"
                    : "border-[#bcd6fa] bg-white hover:border-electric/70"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      {/* Selection Checkbox */}
                      <button
                        type="button"
                        onClick={(e) => toggleSelectCandidate(cand.id, e)}
                        title={isSelected ? "Deselect specialist" : "Select for shortlist"}
                        className={`h-5 w-5 rounded-md border flex items-center justify-center transition-all cursor-pointer ${
                          isSelected
                            ? "bg-electric border-electric text-white shadow-2xs"
                            : "bg-white border-[#bcd6fa] hover:border-electric/70 text-transparent"
                        }`}
                      >
                        <svg className="h-3 w-3 fill-current" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>

                      <span className="font-mono text-xs font-bold text-electric group-hover:underline">
                        {cand.id}
                      </span>
                      {cand.verified && (
                        <span className="flex items-center gap-1 rounded-full bg-signal/10 px-2.5 py-0.5 font-mono text-[10px] font-bold text-signal">
                          <CheckCircle size={10} />
                          <span>Verified Placement Ready</span>
                        </span>
                      )}
                    </div>
                    <span className="rounded-md bg-electric/10 px-2 py-0.5 font-mono text-xs font-bold text-electric">
                      Match {cand.matchScore}
                    </span>
                  </div>

                  <h2 className="mt-2 font-display text-base font-bold text-ink">
                    {cand.name}
                  </h2>
                  <p className="text-xs text-ink-soft">{cand.title}</p>

                  <div className="mt-2.5 flex flex-wrap items-center gap-3 text-xs font-mono text-mist">
                    <span>
                      Exp: <strong className="text-ink font-semibold">{cand.experience}</strong>
                    </span>
                    <span>
                      Rate: <strong className="text-ink font-semibold">{cand.rate}</strong>
                    </span>
                    <span>
                      Avail: <strong className="text-signal font-semibold">{cand.availability}</strong>
                    </span>
                  </div>

                  {/* Skills */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {cand.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-md bg-canvas px-2 py-0.5 font-mono text-[11px] font-medium text-ink border border-[#bcd6fa]/40"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div
                  className="border-t border-[#bcd6fa]/30 pt-3 flex items-center justify-between gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCandidate(cand);
                      setDossierTab("profile");
                    }}
                    className="rounded-xl border border-[#bcd6fa] bg-white px-3.5 py-1.5 font-display text-xs font-semibold text-ink hover:bg-canvas transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Eye size={12} className="text-electric" />
                    <span>View Dossier</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => toggleSelectCandidate(cand.id, e)}
                      className={`rounded-xl px-3 py-1.5 font-display text-xs font-semibold transition-colors cursor-pointer border ${
                        isSelected
                          ? "border-electric bg-electric/10 text-electric hover:bg-electric/20"
                          : "border-[#bcd6fa] bg-white text-ink hover:bg-canvas"
                      }`}
                    >
                      {isSelected ? "Selected ✓" : "+ Shortlist"}
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleAddToPod(cand, e)}
                      className="rounded-xl bg-ink px-3.5 py-1.5 font-display text-xs font-semibold text-white hover:bg-electric transition-colors shadow-xs cursor-pointer"
                    >
                      + Assign
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Floating Sticky Shortlist Action Bar */}
      {selectedCandidateIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-2xl px-4 animate-in slide-in-from-bottom-4 duration-200">
          <div className="rounded-2xl border border-electric/40 bg-ink/95 backdrop-blur-md p-3.5 sm:p-4 text-white shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-electric text-white font-mono text-sm font-bold shadow-xs">
                {selectedCandidateIds.length}
              </div>
              <div>
                <p className="font-display text-sm font-bold text-white">
                  {selectedCandidateIds.length} Specialist{selectedCandidateIds.length > 1 ? "s" : ""} Selected
                </p>
                <p className="text-[11px] text-white/70">
                  Ready for client delivery package (Email, IM, or ATS CSV)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={clearSelection}
                className="rounded-xl border border-white/20 bg-white/5 px-3 py-2 font-display text-xs font-semibold text-white/80 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsShortlistDrawerOpen(true);
                  setSubmissionSuccess(null);
                }}
                className="rounded-xl bg-electric px-4 py-2 font-display text-xs font-bold text-white hover:bg-electric-bright shadow-xs transition-colors inline-flex items-center gap-2 cursor-pointer"
              >
                <FileText size={14} />
                <span>Build Client Submission →</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Shortlist Builder & Client Submission Sheet Drawer (Right-Side Drawer UX Invariant) */}
      {isShortlistDrawerOpen && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-ink/40 backdrop-blur-xs animate-in fade-in-0 duration-150"
          onClick={() => setIsShortlistDrawerOpen(false)}
        >
          <div
            className="w-full md:w-1/2 lg:w-1/2 md:max-w-[50vw] bg-white h-full shadow-2xl p-6 sm:p-8 flex flex-col justify-between overflow-y-auto thin-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-start justify-between border-b border-[#bcd6fa]/40 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-electric uppercase tracking-wider">
                      MODULE 6: ATS CLIENT SUBMISSION (ATS-06 &amp; D-01)
                    </span>
                  </div>
                  <h2 className="mt-1 font-display text-xl font-bold text-ink">
                    Client Shortlist &amp; Submission Package
                  </h2>
                  <p className="text-xs text-ink-soft">
                    Assemble and export a branded dossier package for direct client transmission via Email, IM, or ATS upload.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsShortlistDrawerOpen(false)}
                  className="rounded-lg p-1.5 text-mist hover:text-ink hover:bg-canvas transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Submission Success Alert */}
              {submissionSuccess && (
                <div className="rounded-2xl border border-signal/30 bg-signal/10 p-4 text-xs text-signal space-y-1.5 animate-in fade-in-0">
                  <div className="flex items-center gap-2 font-bold font-display text-sm">
                    <CheckCircle size={16} />
                    <span>Submission Package Logged to ATS</span>
                  </div>
                  <p className="text-signal/90 leading-relaxed">
                    Submission package <strong>SUB-{submissionSuccess.id}</strong> recorded at {submissionSuccess.timestamp}. Candidates have been transitioned to <strong>Interview / Submitted to Client</strong> with audit logging.
                  </p>
                </div>
              )}

              {/* Navigation Tabs */}
              <div className="flex gap-2 border-b border-[#bcd6fa]/30 pb-2">
                {[
                  { id: "setup", label: "1. Package Setup & Privacy" },
                  { id: "roster", label: `2. Selected Roster (${selectedCandidates.length})` },
                  { id: "preview", label: "3. Live Client Preview" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setShortlistTab(tab.id as any)}
                    className={`rounded-xl px-3.5 py-1.5 font-display text-xs font-semibold transition-all cursor-pointer ${
                      shortlistTab === tab.id
                        ? "bg-ink text-white shadow-xs"
                        : "bg-white border border-[#bcd6fa]/60 text-ink-soft hover:text-ink hover:bg-canvas"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab 1: Package Setup & Privacy Masking */}
              {shortlistTab === "setup" && (
                <div className="space-y-5 text-xs">
                  {/* Requisition & Client */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-mono text-[11px] uppercase tracking-wider text-mist mb-1">
                        Target Requisition *
                      </label>
                      <select
                        value={targetRequisitionId}
                        onChange={(e) => setTargetRequisitionId(e.target.value)}
                        className="w-full rounded-xl border border-[#bcd6fa] bg-white p-2.5 font-medium text-ink focus:border-electric focus:outline-hidden"
                      >
                        {pods.length > 0 ? (
                          pods.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name} ({p.id})
                            </option>
                          ))
                        ) : (
                          <>
                            <option value="REQ-FINTECH-01">Fintech Core Architecture Requisition</option>
                            <option value="REQ-HEALTH-02">EMR FHIR Clinical Data Requisition</option>
                            <option value="REQ-CLOUD-03">AWS Multi-Region SRE Requisition</option>
                          </>
                        )}
                        <option value="custom">Custom Client Requisition</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-mono text-[11px] uppercase tracking-wider text-mist mb-1">
                        Client Organization Name *
                      </label>
                      <input
                        type="text"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="e.g. Apex Health Systems"
                        className="w-full rounded-xl border border-[#bcd6fa] bg-white p-2.5 font-medium text-ink focus:border-electric focus:outline-hidden"
                      />
                    </div>
                  </div>

                  {/* Delivery Channel */}
                  <div>
                    <label className="block font-mono text-[11px] uppercase tracking-wider text-mist mb-1.5">
                      Delivery Channel (per SRS D-01)
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: "email", label: "Email Pitch", icon: "✉" },
                        { id: "im", label: "Instant Msg (Slack)", icon: "💬" },
                        { id: "client_ats", label: "Client ATS (CSV)", icon: "📊" },
                        { id: "portal", label: "PDF Brief", icon: "📄" },
                      ].map((ch) => (
                        <button
                          key={ch.id}
                          type="button"
                          onClick={() => setDeliveryChannel(ch.id as any)}
                          className={`rounded-xl border p-2.5 text-center transition-all cursor-pointer ${
                            deliveryChannel === ch.id
                              ? "border-electric bg-electric/10 text-electric font-bold shadow-2xs"
                              : "border-[#bcd6fa]/60 bg-white text-ink-soft hover:bg-canvas"
                          }`}
                        >
                          <div className="text-base mb-1">{ch.icon}</div>
                          <div className="font-display text-[11px]">{ch.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Data Masking & Escrow Protection Toggles (ATS-06, AC-06) */}
                  <div className="rounded-2xl border border-[#bcd6fa]/80 bg-canvas/50 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ShieldCheck size={16} className="text-electric" />
                        <span className="font-display font-bold text-ink">
                          Privacy &amp; Escrow Contact Masking (ATS-06)
                        </span>
                      </div>
                      <span className="rounded-full bg-signal/10 px-2 py-0.5 font-mono text-[10px] font-bold text-signal">
                        Placement Safe
                      </span>
                    </div>

                    <p className="text-[11px] text-ink-soft leading-relaxed">
                      Mask direct candidate contact details (email and phone) to safeguard Pepoltek placement attribution and escrow terms until client approves interview slots.
                    </p>

                    <div className="space-y-2.5 pt-1">
                      <label className="flex items-center justify-between cursor-pointer rounded-xl bg-white p-2.5 border border-[#bcd6fa]/50">
                        <span className="font-medium text-ink">
                          Mask Direct Candidate Email &amp; Phone (Default ON)
                        </span>
                        <input
                          type="checkbox"
                          checked={maskContact}
                          onChange={(e) => setMaskContact(e.target.checked)}
                          className="h-4 w-4 rounded-sm border-mist text-electric focus:ring-electric cursor-pointer"
                        />
                      </label>

                      <label className="flex items-center justify-between cursor-pointer rounded-xl bg-white p-2.5 border border-[#bcd6fa]/50">
                        <span className="font-medium text-ink">
                          Include Verified Vetting Scores &amp; Rubrics
                        </span>
                        <input
                          type="checkbox"
                          checked={includeVetting}
                          onChange={(e) => setIncludeVetting(e.target.checked)}
                          className="h-4 w-4 rounded-sm border-mist text-electric focus:ring-electric cursor-pointer"
                        />
                      </label>

                      <label className="flex items-center justify-between cursor-pointer rounded-xl bg-white p-2.5 border border-[#bcd6fa]/50">
                        <span className="font-medium text-ink">
                          Include Hourly Billing Rates &amp; Sprint Budget
                        </span>
                        <input
                          type="checkbox"
                          checked={includeRates}
                          onChange={(e) => setIncludeRates(e.target.checked)}
                          className="h-4 w-4 rounded-sm border-mist text-electric focus:ring-electric cursor-pointer"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Pitch Notes */}
                  <div>
                    <label className="block font-mono text-[11px] uppercase tracking-wider text-mist mb-1">
                      Recruiter Executive Pitch Notes *
                    </label>
                    <textarea
                      rows={3}
                      value={pitchNotes}
                      onChange={(e) => setPitchNotes(e.target.value)}
                      placeholder="Add tailored pitch notes summarizing why this squad matches the client technical requirements..."
                      className="w-full rounded-xl border border-[#bcd6fa] bg-white p-2.5 font-medium text-ink focus:border-electric focus:outline-hidden"
                    />
                  </div>
                </div>
              )}

              {/* Tab 2: Selected Specialists Roster */}
              {shortlistTab === "roster" && (
                <div className="space-y-4 text-xs">
                  {/* Summary Bar */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-xl border border-[#bcd6fa]/60 bg-canvas/40 p-3">
                      <div className="font-mono text-[10px] text-mist uppercase">Headcount</div>
                      <div className="font-display text-lg font-bold text-ink">
                        {selectedCandidates.length} Specialists
                      </div>
                    </div>
                    <div className="rounded-xl border border-[#bcd6fa]/60 bg-canvas/40 p-3">
                      <div className="font-mono text-[10px] text-mist uppercase">Deployment SLA</div>
                      <div className="font-display text-lg font-bold text-signal">
                        7-Day Sprint
                      </div>
                    </div>
                    <div className="rounded-xl border border-[#bcd6fa]/60 bg-canvas/40 p-3">
                      <div className="font-mono text-[10px] text-mist uppercase">Guarantee</div>
                      <div className="font-display text-lg font-bold text-ink">
                        90 Days Replacement
                      </div>
                    </div>
                  </div>

                  {/* Candidate List */}
                  {selectedCandidates.length === 0 ? (
                    <div className="rounded-2xl border border-[#bcd6fa] bg-white p-8 text-center">
                      <p className="font-display font-semibold text-ink">No Specialists Selected</p>
                      <p className="text-mist text-xs mt-1">
                        Please check candidates from the directory to add them to this shortlist package.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {selectedCandidates.map((c) => (
                        <div
                          key={c.id}
                          className="rounded-xl border border-[#bcd6fa] bg-white p-3.5 shadow-2xs flex items-center justify-between gap-3"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-electric">
                                {c.id}
                              </span>
                              <span className="font-display font-bold text-ink text-sm">
                                {c.name}
                              </span>
                              <span className="rounded-md bg-electric/10 px-1.5 py-0.5 font-mono text-[10px] font-bold text-electric">
                                Match {c.matchScore}
                              </span>
                            </div>
                            <p className="text-xs text-ink-soft">
                              {c.title} • {c.experience} • {c.rate}
                            </p>
                            <div className="flex flex-wrap gap-1 pt-1">
                              {c.skills.slice(0, 4).map((s) => (
                                <span
                                  key={s}
                                  className="rounded-sm bg-canvas px-1.5 py-0.5 font-mono text-[10px] text-ink"
                                >
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => toggleSelectCandidate(c.id)}
                            className="rounded-lg p-1.5 text-mist hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            title="Remove from shortlist"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tab 3: Live Branded Client Preview */}
              {shortlistTab === "preview" && (
                <div className="space-y-4 text-xs">
                  <div className="rounded-2xl border border-[#bcd6fa] bg-canvas/30 p-5 space-y-4 font-sans">
                    {/* Branded Header */}
                    <div className="flex items-center justify-between border-b border-[#bcd6fa]/50 pb-3">
                      <div>
                        <div className="font-display text-sm font-bold tracking-tight text-ink">
                          PEPOLTEK LIMITED
                        </div>
                        <div className="font-mono text-[10px] text-mist">
                          Client Submission Package • Sprint SLA
                        </div>
                      </div>
                      <span className="rounded-md bg-ink px-2.5 py-1 font-mono text-[10px] font-bold text-white uppercase">
                        CONFIDENTIAL
                      </span>
                    </div>

                    {/* Metadata Summary */}
                    <div className="grid grid-cols-2 gap-3 text-xs bg-white p-3 rounded-xl border border-[#bcd6fa]/40">
                      <div>
                        <span className="text-mist block text-[10px] font-mono uppercase">
                          Target Requisition:
                        </span>
                        <span className="font-semibold text-ink">
                          {targetRequisitionId || "Sprint Requisition"}
                        </span>
                      </div>
                      <div>
                        <span className="text-mist block text-[10px] font-mono uppercase">
                          Client Organization:
                        </span>
                        <span className="font-semibold text-ink">{clientName}</span>
                      </div>
                    </div>

                    {/* Pitch Notes */}
                    <div className="bg-white p-3 rounded-xl border border-[#bcd6fa]/40 space-y-1">
                      <span className="text-mist block text-[10px] font-mono uppercase">
                        Recruiter Executive Pitch:
                      </span>
                      <p className="text-ink leading-relaxed font-medium">{pitchNotes}</p>
                    </div>

                    {/* Candidate Preview Cards */}
                    <div className="space-y-2">
                      <span className="text-mist block text-[10px] font-mono uppercase">
                        Shortlisted Specialists ({selectedCandidates.length}):
                      </span>

                      {selectedCandidates.map((c, idx) => (
                        <div
                          key={c.id}
                          className="bg-white p-3.5 rounded-xl border border-[#bcd6fa]/60 space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-display font-bold text-ink text-sm">
                                {idx + 1}. {c.name}
                              </span>
                              <span className="text-ink-soft text-xs ml-2">({c.title})</span>
                            </div>
                            {includeVetting && (
                              <span className="rounded-md bg-signal/10 px-2 py-0.5 font-mono text-[10px] font-bold text-signal">
                                Vetting: {c.matchScore} Pass
                              </span>
                            )}
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-mist font-mono">
                            <span>Exp: <strong className="text-ink">{c.experience}</strong></span>
                            {includeRates && (
                              <span>Rate: <strong className="text-ink">{c.rate}</strong></span>
                            )}
                            <span>Avail: <strong className="text-signal">{c.availability}</strong></span>
                          </div>

                          <div className="text-[11px]">
                            <span className="text-mist">Core Stack: </span>
                            <span className="font-medium text-ink">{c.skills.join(", ")}</span>
                          </div>

                          {/* Contact display */}
                          <div className="text-[11px] pt-1 border-t border-[#bcd6fa]/30">
                            <span className="text-mist">Contact: </span>
                            {maskContact ? (
                              <span className="font-mono text-electric font-semibold">
                                [Protected by Pepoltek Escrow • Schedule via Staffing Lead]
                              </span>
                            ) : (
                              <span className="font-mono text-ink">
                                {c.email || "direct@pepoltek.com"} • {c.phone || "+1 (555) 019-2834"}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Footer Guarantee */}
                    <div className="border-t border-[#bcd6fa]/40 pt-3 flex flex-wrap items-center justify-between text-[10px] font-mono text-mist">
                      <span>7-Day Sprint Deployment SLA</span>
                      <span>FDIC Insured Escrow</span>
                      <span>90-Day Replacement Guarantee</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Drawer Footer Actions */}
            <div className="pt-5 border-t border-[#bcd6fa]/40 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setIsShortlistDrawerOpen(false)}
                className="w-full sm:w-auto rounded-xl border border-[#bcd6fa] px-4 py-2 font-display text-xs font-semibold text-ink-soft hover:bg-canvas transition-colors cursor-pointer"
              >
                Close Drawer
              </button>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={handleCopyPitch}
                  className="rounded-xl border border-[#bcd6fa] bg-white px-3.5 py-2 font-display text-xs font-semibold text-ink hover:bg-canvas transition-colors cursor-pointer inline-flex items-center gap-1.5"
                >
                  <span>Copy IM / Text Pitch</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadCsv}
                  className="rounded-xl border border-[#bcd6fa] bg-white px-3.5 py-2 font-display text-xs font-semibold text-ink hover:bg-canvas transition-colors cursor-pointer inline-flex items-center gap-1.5"
                >
                  <span>Download ATS CSV</span>
                </button>

                <button
                  type="button"
                  disabled={isSubmittingShortlist || selectedCandidates.length === 0}
                  onClick={handleSubmitShortlist}
                  className="rounded-xl bg-electric px-5 py-2 font-display text-xs font-bold text-white shadow-xs hover:bg-electric-bright transition-colors cursor-pointer disabled:opacity-50 inline-flex items-center gap-2"
                >
                  {isSubmittingShortlist ? (
                    <span>Logging to ATS...</span>
                  ) : (
                    <span>Submit Shortlist to Client →</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Candidate Dossier Slide-Over Sheet (Right-Side Drawer UX Invariant) */}
      {selectedCandidate && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-ink/40 backdrop-blur-xs animate-in fade-in-0 duration-150"
          onClick={() => setSelectedCandidate(null)}
        >
          <div
            className="w-full md:w-1/2 lg:w-1/2 md:max-w-[50vw] bg-white h-full shadow-2xl p-6 sm:p-8 flex flex-col justify-between overflow-y-auto thin-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-6">
              {/* Dossier Header */}
              <div className="flex items-start justify-between border-b border-[#bcd6fa]/40 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-electric">
                      {selectedCandidate.id}
                    </span>
                    {selectedCandidate.verified && (
                      <span className="rounded-full bg-signal/10 px-2 py-0.5 font-mono text-[10px] font-bold text-signal">
                        Verified Vetted
                      </span>
                    )}
                  </div>
                  <h2 className="mt-1 font-display text-xl font-bold text-ink">
                    {selectedCandidate.name}
                  </h2>
                  <p className="text-xs text-ink-soft">
                    {selectedCandidate.title} • {selectedCandidate.sector}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedCandidate(null)}
                  className="rounded-lg p-1.5 text-mist hover:text-ink hover:bg-canvas transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Dossier Tabs */}
              <div className="flex gap-2 border-b border-[#bcd6fa]/30 pb-2">
                {[
                  { id: "profile", label: "Profile & CV" },
                  { id: "vetting", label: "Technical Vetting" },
                  { id: "compliance", label: "Compliance Vault" },
                  { id: "actions", label: "Requisition Assignment" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setDossierTab(tab.id as any)}
                    className={`rounded-xl px-3.5 py-1.5 font-display text-xs font-semibold transition-all cursor-pointer ${
                      dossierTab === tab.id
                        ? "bg-ink text-white shadow-xs"
                        : "bg-white border border-[#bcd6fa]/60 text-ink-soft hover:text-ink hover:bg-canvas"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab 1: Profile & CV */}
              {dossierTab === "profile" && (
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="rounded-xl border border-[#bcd6fa]/60 bg-canvas/40 p-3">
                      <div className="font-mono text-[10px] text-mist uppercase">Experience</div>
                      <div className="font-display font-bold text-ink mt-0.5">{selectedCandidate.experience}</div>
                    </div>
                    <div className="rounded-xl border border-[#bcd6fa]/60 bg-canvas/40 p-3">
                      <div className="font-mono text-[10px] text-mist uppercase">Hourly Rate</div>
                      <div className="font-display font-bold text-ink mt-0.5">{selectedCandidate.rate}</div>
                    </div>
                    <div className="rounded-xl border border-[#bcd6fa]/60 bg-canvas/40 p-3">
                      <div className="font-mono text-[10px] text-mist uppercase">Availability</div>
                      <div className="font-display font-bold text-signal mt-0.5">{selectedCandidate.availability}</div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-[#bcd6fa]/60 p-4 space-y-2">
                    <div className="font-mono text-[10px] text-mist uppercase tracking-wider">
                      Engagement &amp; Location
                    </div>
                    <p className="font-medium text-ink">
                      Location: {selectedCandidate.location || "100% Remote (US/EU/Global)"}
                    </p>
                    <p className="text-ink-soft">
                      Work Auth: W2 Contract, C2C Corp-to-Corp, 1099 Specialist
                    </p>
                  </div>

                  <div className="rounded-xl border border-[#bcd6fa]/60 p-4 space-y-2.5">
                    <div className="font-mono text-[10px] text-mist uppercase tracking-wider">
                      Verified Technical Skills
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedCandidate.skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-md bg-canvas px-2.5 py-1 font-mono text-xs font-medium text-ink border border-[#bcd6fa]/50"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl border border-[#bcd6fa]/60 p-4 space-y-2">
                    <div className="font-mono text-[10px] text-mist uppercase tracking-wider">
                      Recruiter Assessment Summary
                    </div>
                    <p className="text-ink-soft leading-relaxed">
                      {selectedCandidate.notes ||
                        "Candidate passed Pepoltek standardized technical vetting with top scores in distributed systems, real-time concurrency, and enterprise compliance."}
                    </p>
                  </div>
                </div>
              )}

              {/* Tab 2: Technical Vetting */}
              {dossierTab === "vetting" && (
                <div className="space-y-4 text-xs">
                  <div className="rounded-xl border border-electric/30 bg-electric/5 p-4 flex items-center justify-between">
                    <div>
                      <span className="font-mono text-[10px] uppercase font-bold text-electric">
                        Comprehensive Match Fit
                      </span>
                      <div className="font-display text-2xl font-bold text-ink">
                        {selectedCandidate.matchScore} Fit Score
                      </div>
                    </div>
                    <div className="rounded-full bg-signal/10 px-3 py-1 font-mono text-xs font-bold text-signal">
                      Passed Technical Screen
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    {[
                      { rubric: "System Architecture & Scalability", score: "96 / 100", status: "Verified" },
                      { rubric: "Concurrency & Core Algorithms", score: "94 / 100", status: "Verified" },
                      { rubric: "Enterprise Security & HIPAA/PCI", score: "100 / 100", status: "Verified" },
                      { rubric: "Team Collaboration & Agile Velocity", score: "92 / 100", status: "Verified" },
                    ].map((item) => (
                      <div
                        key={item.rubric}
                        className="rounded-xl border border-[#bcd6fa]/60 bg-white p-3 flex items-center justify-between"
                      >
                        <div>
                          <p className="font-display font-semibold text-ink">{item.rubric}</p>
                          <p className="text-[11px] text-mist font-mono">Assessed by Senior Lead Architect</p>
                        </div>
                        <div className="text-right">
                          <span className="font-mono font-bold text-electric">{item.score}</span>
                          <span className="block text-[10px] font-mono text-signal">{item.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 3: Compliance Vault */}
              {dossierTab === "compliance" && (
                <div className="space-y-4 text-xs">
                  <div className="rounded-xl border border-[#bcd6fa]/60 bg-canvas/30 p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={16} className="text-signal" />
                      <span className="font-display font-bold text-ink">
                        Enterprise Clearance Status
                      </span>
                    </div>
                    <p className="text-ink-soft text-[11px] leading-relaxed">
                      All identity verification, right-to-work checks, and background screening are secured in the Pepoltek encrypted vault.
                    </p>
                  </div>

                  <div className="space-y-2">
                    {[
                      { doc: "Government Issued Photo ID", state: "Verified Active", date: "Oct 2026" },
                      { doc: "Right to Work Verification (I-9 / Visa)", state: "Compliant W2/C2C", date: "Oct 2026" },
                      { doc: "HIPAA / Security Safeguards Attestation", state: "Signed", date: "Oct 2026" },
                      { doc: "Criminal Background & Direct Reference", state: "Cleared (Tier 1)", date: "Oct 2026" },
                    ].map((row) => (
                      <div
                        key={row.doc}
                        className="rounded-xl border border-[#bcd6fa]/60 p-3 flex items-center justify-between"
                      >
                        <div>
                          <p className="font-display font-semibold text-ink">{row.doc}</p>
                          <p className="text-[11px] text-mist font-mono">Recorded: {row.date}</p>
                        </div>
                        <span className="rounded-full bg-signal/10 px-2.5 py-0.5 font-mono text-[10px] font-bold text-signal">
                          {row.state}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 4: Requisition Assignment Actions */}
              {dossierTab === "actions" && (
                <div className="space-y-4 text-xs">
                  <div className="rounded-xl border border-[#bcd6fa]/60 p-4 space-y-3">
                    <div className="font-display font-bold text-ink text-sm">
                      Immediate Sprint Actions
                    </div>
                    <p className="text-ink-soft leading-relaxed">
                      Assign this candidate directly to an active client requisition or schedule a client interview.
                    </p>

                    <div className="space-y-2 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          handleAddToPod(selectedCandidate);
                          setSelectedCandidate(null);
                        }}
                        className="w-full rounded-xl bg-ink py-2.5 font-display text-xs font-bold text-white shadow-xs hover:bg-electric transition-colors cursor-pointer"
                      >
                        + Add to Active Shortlist
                      </button>

                      <Link
                        href="/recruiter/interviews"
                        className="block w-full text-center rounded-xl border border-[#bcd6fa] bg-white py-2.5 font-display text-xs font-semibold text-ink hover:bg-canvas transition-colors"
                      >
                        Schedule Client Interview Slot
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Dossier Footer */}
            <div className="pt-4 border-t border-[#bcd6fa]/40 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setSelectedCandidate(null)}
                className="rounded-xl border border-[#bcd6fa] px-4 py-2 font-display text-xs font-semibold text-ink-soft hover:bg-canvas transition-colors cursor-pointer"
              >
                Close
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    handleAddToPod(selectedCandidate);
                    setSelectedCandidate(null);
                  }}
                  className="rounded-xl bg-ink px-4 py-2 font-display text-xs font-semibold text-white shadow-xs hover:bg-electric transition-colors cursor-pointer"
                >
                  + Add to Shortlist
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
