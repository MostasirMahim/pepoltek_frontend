"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  User,
  Mail,
  Phone,
  Calendar,
  Clock,
  ShieldCheck,
  CheckCircle2,
  FileCheck,
  Briefcase,
  TrendingUp,
  MessageSquare,
  X,
  UserCheck,
  Send,
  Zap,
} from "lucide-react";
import {
  updateAdminLeadAction,
  addAdminLeadNoteAction,
  convertAdminLeadAction,
} from "@/actions/leads.actions";

interface AdminLeadDetailViewProps {
  initialLead: any;
}

export default function AdminLeadDetailView({ initialLead }: AdminLeadDetailViewProps) {
  const router = useRouter();
  const [lead, setLead] = useState(initialLead);

  // Sheets state
  const [statusSheetOpen, setStatusSheetOpen] = useState(false);
  const [convertSheetOpen, setConvertSheetOpen] = useState(false);

  // Status sheet form
  const [selectedStatus, setSelectedStatus] = useState(lead.status || "new");
  const [statusNote, setStatusNote] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Quick note form
  const [newNote, setNewNote] = useState("");
  const [submittingNote, setSubmittingNote] = useState(false);

  // Conversion sheet form
  const [clientName, setClientName] = useState(lead.company || "");
  const [reqTitle, setReqTitle] = useState(lead.roles_needed || `Talent Requisition - ${lead.company}`);
  const [reqSector, setReqSector] = useState(lead.sector || "technology");
  const [reqHeadcount, setReqHeadcount] = useState(lead.headcount || 1);
  const [reqDeliveryChannel, setReqDeliveryChannel] = useState(lead.preferred_delivery_channel || "email");
  const [convertNote, setConvertNote] = useState("");
  const [converting, setConverting] = useState(false);
  const [convertError, setConvertError] = useState<string | null>(null);

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdatingStatus(true);
    const res = await updateAdminLeadAction(lead.id, {
      status: selectedStatus,
      note: statusNote,
    });
    setUpdatingStatus(false);
    if (res.success && res.data) {
      setLead(res.data);
      setStatusSheetOpen(false);
      setStatusNote("");
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setSubmittingNote(true);
    const res = await addAdminLeadNoteAction(lead.id, newNote);
    setSubmittingNote(false);
    if (res.success && res.data) {
      // Append activity log
      const updatedLogs = [res.data, ...(lead.activity_logs || [])];
      setLead({ ...lead, activity_logs: updatedLogs });
      setNewNote("");
    }
  };

  const handleConvertLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setConverting(true);
    setConvertError(null);

    const res = await convertAdminLeadAction(lead.id, {
      client_name: clientName,
      requisition_title: reqTitle,
      sector: reqSector,
      headcount: reqHeadcount,
      delivery_channel: reqDeliveryChannel,
      note: convertNote,
    });

    setConverting(false);
    if (res.success && res.data) {
      setLead({
        ...lead,
        status: "converted",
        converted_client: {
          id: res.data.client_id,
          name: res.data.client_name,
        },
      });
      setConvertSheetOpen(false);
    } else {
      setConvertError(res.error?.message || "Failed to convert lead.");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-blue-100 text-blue-800">NEW INBOUND</span>;
      case "contacted":
        return <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-purple-100 text-purple-800">CONTACTED</span>;
      case "discovery_booked":
        return <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-amber-100 text-amber-900">DISCOVERY BOOKED</span>;
      case "discovery_running":
        return <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-amber-200 text-amber-950 border border-amber-400">DISCOVERY RUNNING</span>;
      case "qualified":
        return <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-100 text-emerald-800">QUALIFIED</span>;
      case "converted":
        return <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-200 text-emerald-950">CONVERTED (ATS CLIENT)</span>;
      case "lost":
        return <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-700">LOST</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-800">{status}</span>;
    }
  };

  return (
    <div className="space-y-6 font-enterprise">
      {/* Back Navigation Bar */}
      <div className="flex items-center justify-between border-b border-[#bcd6fa]/50 pb-4">
        <Link
          href="/admin/leads"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-soft hover:text-ink transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Inquiries & Leads</span>
        </Link>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setStatusSheetOpen(true)}
            className="rounded-xl border border-[#bcd6fa] bg-white px-3.5 py-1.5 text-xs font-semibold text-ink shadow-2xs hover:bg-canvas transition-colors cursor-pointer"
          >
            Update Status / Assignment
          </button>

          {lead.status !== "converted" ? (
            <button
              type="button"
              onClick={() => setConvertSheetOpen(true)}
              className="rounded-xl bg-ink px-4 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-electric transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Zap size={14} />
              <span>Convert to Client & Requisition</span>
            </button>
          ) : (
            <div className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-xs font-semibold text-emerald-800">
              <CheckCircle2 size={14} />
              <span>Converted to Client Entity</span>
            </div>
          )}
        </div>
      </div>

      {/* Hero Dossier Header */}
      <div className="rounded-3xl border border-[#bcd6fa] bg-white p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-enterprise font-bold uppercase tracking-wider text-mist">
                Lead Source: {lead.source?.replace("_", " ") || "Hire Fast Form"}
              </span>
              <span className="text-mist">·</span>
              <span className="text-[10px] font-enterprise text-mist">
                ID: {lead.id}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-ink font-display flex items-center gap-3">
              <span>{lead.company}</span>
              {getStatusBadge(lead.status)}
            </h1>
            <p className="text-xs text-ink-soft mt-1">
              Registered on {lead.created_at ? new Date(lead.created_at).toLocaleString() : "Recent"}
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-enterprise">
            <div className="rounded-xl border border-[#bcd6fa]/60 bg-canvas/40 px-3 py-2">
              <div className="text-[10px] text-mist">Staff Owner</div>
              <div className="font-semibold text-ink">
                {lead.owner_details?.full_name || "Unassigned"}
              </div>
            </div>

            {lead.converted_client_details && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2">
                <div className="text-[10px] text-emerald-700">ATS Client</div>
                <div className="font-bold text-emerald-950">
                  {lead.converted_client_details.name}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2-Column Details Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Commercial Specs & Mandate (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Primary Contact Details */}
          <div className="rounded-3xl border border-[#bcd6fa] bg-white p-6 shadow-2xs space-y-4">
            <h2 className="text-sm font-bold text-ink font-display flex items-center gap-2 border-b border-[#bcd6fa]/50 pb-2.5">
              <User size={16} className="text-electric" />
              <span>Hiring Authority & Contact PII</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-[11px] text-mist font-enterprise font-medium">Contact Name</span>
                <p className="font-semibold text-ink mt-0.5">{lead.contact_name}</p>
              </div>

              <div>
                <span className="text-[11px] text-mist font-enterprise font-medium">Work Email</span>
                <p className="font-semibold text-ink mt-0.5 break-all">{lead.work_email}</p>
              </div>

              <div>
                <span className="text-[11px] text-mist font-enterprise font-medium">Phone</span>
                <p className="font-semibold text-ink mt-0.5">{lead.phone || "Not Provided"}</p>
              </div>
            </div>
          </div>

          {/* Hiring Scope & Specs */}
          <div className="rounded-3xl border border-[#bcd6fa] bg-white p-6 shadow-2xs space-y-4">
            <h2 className="text-sm font-bold text-ink font-display flex items-center gap-2 border-b border-[#bcd6fa]/50 pb-2.5">
              <Briefcase size={16} className="text-electric" />
              <span>Workforce Requirement Scope</span>
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-[10.5px] text-mist font-enterprise font-medium">Sector</span>
                <p className="font-bold text-ink capitalize mt-0.5">{lead.sector || "Technology"}</p>
              </div>

              <div>
                <span className="text-[10.5px] text-mist font-enterprise font-medium">Headcount</span>
                <p className="font-bold text-ink mt-0.5">{lead.headcount} Specialists</p>
              </div>

              <div>
                <span className="text-[10.5px] text-mist font-enterprise font-medium">Engagement</span>
                <p className="font-bold text-ink capitalize mt-0.5">
                  {lead.engagement_model?.replace("_", " ") || "Staff Aug"}
                </p>
              </div>

              <div>
                <span className="text-[10.5px] text-mist font-enterprise font-medium">Timeline</span>
                <p className="font-bold text-ink capitalize mt-0.5">
                  {lead.timeline?.replace("_", " ") || "Immediate"}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-[#bcd6fa]/30">
              <span className="text-[10.5px] text-mist font-enterprise font-medium">Roles & Technical Requirements</span>
              <p className="mt-1 text-xs text-ink bg-canvas/30 p-3 rounded-xl border border-[#bcd6fa]/50 leading-relaxed font-sans">
                {lead.roles_needed || "No specific stack notes recorded."}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <span className="text-[10.5px] text-mist font-enterprise font-medium">Estimated Budget</span>
                <p className="text-xs font-semibold text-ink mt-0.5">
                  {lead.estimated_budget || "Standard rate card"}
                </p>
              </div>

              <div>
                <span className="text-[10.5px] text-mist font-enterprise font-medium">Shortlist Delivery Channel</span>
                <p className="text-xs font-semibold text-ink uppercase mt-0.5">
                  {lead.preferred_delivery_channel || "Email"}
                </p>
              </div>
            </div>
          </div>

          {/* Consultation Slot / Calculator Snapshot */}
          {(lead.booking_data || lead.calculator_snapshot) && (
            <div className="rounded-3xl border border-[#bcd6fa] bg-white p-6 shadow-2xs space-y-4">
              <h2 className="text-sm font-bold text-ink font-display flex items-center gap-2 border-b border-[#bcd6fa]/50 pb-2.5">
                <Calendar size={16} className="text-electric" />
                <span>Discovery Booking & Proposal Telemetry</span>
              </h2>

              {lead.booking_data && (
                <div className="rounded-2xl border border-electric/30 bg-electric/5 p-4 text-xs space-y-1">
                  <div className="text-[10.5px] font-enterprise text-electric font-bold uppercase tracking-wider">
                    Requested Discovery Slot
                  </div>
                  <div className="text-sm font-bold text-ink">
                    {lead.booking_data.selected_slot || "Scheduled slot"}
                  </div>
                  {lead.booking_data.booking_notes && (
                    <div className="text-xs text-ink-soft mt-1">
                      Agenda Notes: {lead.booking_data.booking_notes}
                    </div>
                  )}
                </div>
              )}

              {lead.calculator_snapshot && (
                <div className="rounded-2xl border border-[#bcd6fa] bg-canvas/40 p-4 text-xs space-y-2">
                  <div className="text-[10.5px] font-enterprise text-mist uppercase font-bold">
                    Hiring Calculator Proposal Snapshot
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-enterprise">
                    <div>
                      <span className="text-mist">Target Role:</span>
                      <div className="font-semibold text-ink">{lead.calculator_snapshot.roleType || "Engineer"}</div>
                    </div>
                    <div>
                      <span className="text-mist">Headcount:</span>
                      <div className="font-semibold text-ink">{lead.calculator_snapshot.rolesCount || 1}</div>
                    </div>
                    <div>
                      <span className="text-mist">Est. Savings:</span>
                      <div className="font-bold text-signal">{lead.calculator_snapshot.estimatedSavings || "N/A"}</div>
                    </div>
                    <div>
                      <span className="text-mist">Velocity:</span>
                      <div className="font-semibold text-electric">{lead.calculator_snapshot.timeToDeploy || "14 Days"}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Activity Timeline & Staff Notes (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl border border-[#bcd6fa] bg-white p-6 shadow-2xs space-y-4">
            <h2 className="text-sm font-bold text-ink font-display flex items-center gap-2 border-b border-[#bcd6fa]/50 pb-2.5">
              <MessageSquare size={16} className="text-electric" />
              <span>Internal Notes & Audit Trail</span>
            </h2>

            {/* Quick Note Composer */}
            <form onSubmit={handleAddNote} className="space-y-2">
              <textarea
                rows={2}
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Log internal conversation, requirement clarification, or discovery notes..."
                className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/30 px-3 py-2 text-xs text-ink placeholder-mist focus:border-electric focus:bg-white focus:outline-none"
              />
              <button
                type="submit"
                disabled={submittingNote || !newNote.trim()}
                className="w-full rounded-xl bg-ink py-2 text-xs font-semibold text-white hover:bg-electric transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Send size={12} />
                <span>Append Note to Audit Trail</span>
              </button>
            </form>

            {/* Activity Stream */}
            <div className="pt-2 space-y-3">
              <div className="text-[10.5px] font-enterprise text-mist uppercase tracking-wider font-bold">
                Chronological Activity ({lead.activity_logs?.length || 0})
              </div>

              {(!lead.activity_logs || lead.activity_logs.length === 0) ? (
                <div className="text-xs text-mist py-4 text-center">
                  No activity logs recorded yet.
                </div>
              ) : (
                <div className="relative pl-4 space-y-4 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#bcd6fa]/60">
                  {lead.activity_logs.map((log: any, idx: number) => (
                    <div key={log.id || idx} className="relative text-xs">
                      {/* Node Bullet */}
                      <div className="absolute -left-4 top-1 h-2.5 w-2.5 rounded-full bg-electric border-2 border-white" />
                      <div className="flex items-center justify-between text-[10px] text-mist font-enterprise">
                        <span className="font-bold text-ink">{log.actor_name || "System"}</span>
                        <span>{log.created_at ? new Date(log.created_at).toLocaleString() : "Recent"}</span>
                      </div>
                      <div className="mt-0.5 font-medium text-ink bg-canvas/30 p-2.5 rounded-xl border border-[#bcd6fa]/40">
                        {log.note || `Action: ${log.action}`}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right-Side Sheet 1: Update Status / Owner */}
      {statusSheetOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-[#0a1428]/50 backdrop-blur-xs transition-opacity"
            onClick={() => setStatusSheetOpen(false)}
          />
          <div className="relative w-full max-w-md h-full bg-white shadow-2xl p-6 overflow-y-auto z-10 flex flex-col justify-between font-enterprise">
            <div>
              <div className="flex items-center justify-between border-b border-[#bcd6fa]/50 pb-4 mb-5">
                <div>
                  <h3 className="text-base font-bold text-ink font-display">
                    Update Lead Status
                  </h3>
                  <p className="text-xs text-ink-soft">
                    {lead.company}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setStatusSheetOpen(false)}
                  className="rounded-lg p-1.5 text-mist hover:bg-canvas transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleUpdateStatus} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-ink-soft mb-1">
                    Lifecycle Funnel Stage
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/30 px-3 py-2 text-xs text-ink focus:border-electric focus:bg-white focus:outline-none"
                  >
                    <option value="new">New Inbound</option>
                    <option value="contacted">Contacted</option>
                    <option value="discovery_booked">Discovery Booked</option>
                    <option value="discovery_running">Discovery Running</option>
                    <option value="qualified">Qualified</option>
                    <option value="converted">Converted to Client</option>
                    <option value="lost">Lost</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink-soft mb-1">
                    Reason Note (Logged in Audit Trail)
                  </label>
                  <textarea
                    rows={3}
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                    placeholder="e.g. Discovery call completed with VP of Engineering. Approved 2 technical leads."
                    className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/30 px-3 py-2 text-xs text-ink placeholder-mist focus:border-electric focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={updatingStatus}
                    className="w-full rounded-xl bg-ink py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-electric transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {updatingStatus ? "Saving Changes..." : "Commit Status Change"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Right-Side Sheet 2: Convert to ATS Client & Requisition */}
      {convertSheetOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-[#0a1428]/50 backdrop-blur-xs transition-opacity"
            onClick={() => setConvertSheetOpen(false)}
          />
          <div className="relative w-full max-w-lg h-full bg-white shadow-2xl p-6 overflow-y-auto z-10 flex flex-col justify-between font-enterprise">
            <div>
              <div className="flex items-center justify-between border-b border-[#bcd6fa]/50 pb-4 mb-5">
                <div>
                  <div className="inline-flex items-center gap-1.5 rounded-md bg-emerald-100 px-2 py-0.5 font-enterprise text-[10px] font-bold text-emerald-800 uppercase mb-1">
                    Conversion Engine
                  </div>
                  <h3 className="text-base font-bold text-ink font-display">
                    Convert Lead to Authentic ATS Client
                  </h3>
                  <p className="text-xs text-ink-soft">
                    Creates authentic Client entity, primary hiring contact, and initial Requisition.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setConvertSheetOpen(false)}
                  className="rounded-lg p-1.5 text-mist hover:bg-canvas transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {convertError && (
                <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
                  {convertError}
                </div>
              )}

              <form onSubmit={handleConvertLead} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-ink-soft mb-1">
                    Client Organization Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/30 px-3 py-2 text-ink focus:border-electric focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-ink-soft mb-1">
                    Initial ATS Requisition Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={reqTitle}
                    onChange={(e) => setReqTitle(e.target.value)}
                    className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/30 px-3 py-2 text-ink focus:border-electric focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-ink-soft mb-1">
                      Sector
                    </label>
                    <input
                      type="text"
                      value={reqSector}
                      onChange={(e) => setReqSector(e.target.value)}
                      className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/30 px-3 py-2 text-ink focus:border-electric focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-ink-soft mb-1">
                      Headcount
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={reqHeadcount}
                      onChange={(e) => setReqHeadcount(Number(e.target.value))}
                      className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/30 px-3 py-2 text-ink focus:border-electric focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-ink-soft mb-1">
                    Delivery Channel
                  </label>
                  <select
                    value={reqDeliveryChannel}
                    onChange={(e) => setReqDeliveryChannel(e.target.value)}
                    className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/30 px-3 py-2 text-ink focus:border-electric focus:bg-white focus:outline-none"
                  >
                    <option value="email">Email</option>
                    <option value="im">Instant Messaging (IM)</option>
                    <option value="client_ats">Client ATS Upload</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-ink-soft mb-1">
                    Conversion Notes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={convertNote}
                    onChange={(e) => setConvertNote(e.target.value)}
                    placeholder="e.g. Terms agreed at 15% placement fee. Kick-off sprint starts Monday."
                    className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/30 px-3 py-2 text-ink placeholder-mist focus:border-electric focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={converting}
                    className="w-full rounded-xl bg-ink py-2.5 font-semibold text-white shadow-xs hover:bg-electric transition-colors cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    <Zap size={14} />
                    <span>{converting ? "Provisioning Client & Requisition..." : "Confirm & Provision ATS Entities"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
