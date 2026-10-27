"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Mail,
  User,
  Phone,
  Clock,
  CheckCircle2,
  AlertCircle,
  Send,
  MessageSquare,
  ShieldCheck,
  Tag,
} from "lucide-react";
import { updateAdminContactInquiryAction } from "@/actions/leads.actions";

interface AdminContactDetailViewProps {
  initialInquiry: any;
}

export default function AdminContactDetailView({ initialInquiry }: AdminContactDetailViewProps) {
  const router = useRouter();
  const [inquiry, setInquiry] = useState(initialInquiry);

  const [status, setStatus] = useState(inquiry.status || "new");
  const [responseNotes, setResponseNotes] = useState(inquiry.response_notes || "");
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(false);

    const res = await updateAdminContactInquiryAction(inquiry.id, {
      status,
      response_notes: responseNotes,
    });

    setSaving(false);
    if (res.success && res.data) {
      setInquiry(res.data);
      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 3000);
    } else {
      setErrorMsg(res.error?.message || "Failed to update inquiry.");
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "partnership":
        return <span className="text-xs font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2.5 py-1 rounded-md font-enterprise">STRATEGIC PARTNERSHIP</span>;
      case "talent_support":
        return <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-md font-enterprise">TALENT SUPPORT</span>;
      case "press_media":
        return <span className="text-xs font-bold text-pink-700 bg-pink-50 border border-pink-200 px-2.5 py-1 rounded-md font-enterprise">PRESS & MEDIA</span>;
      case "feedback":
        return <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md font-enterprise">PLATFORM FEEDBACK</span>;
      default:
        return <span className="text-xs font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md font-enterprise">GENERAL INQUIRY</span>;
    }
  };

  const getStatusBadge = (st: string) => {
    switch (st) {
      case "new":
        return <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-blue-100 text-blue-800 font-enterprise">NEW</span>;
      case "in_progress":
        return <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-amber-100 text-amber-800 font-enterprise">IN PROGRESS</span>;
      case "responded":
        return <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-100 text-emerald-800 font-enterprise">RESPONDED</span>;
      case "closed":
        return <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-600 font-enterprise">CLOSED</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-700 font-enterprise">{st}</span>;
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
        <div>
          {getStatusBadge(inquiry.status)}
        </div>
      </div>

      {/* Inquiry Dossier Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start font-enterprise">
        {/* Left Column: Message Content & Sender Info (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-3xl border border-[#bcd6fa] bg-white p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              {getCategoryBadge(inquiry.category)}
              <span className="text-[11px] font-medium text-mist">
                Received: {inquiry.created_at ? new Date(inquiry.created_at).toLocaleString() : "Recent"}
              </span>
            </div>

            <h1 className="text-xl font-bold text-ink font-display">
              {inquiry.subject}
            </h1>

            <div className="rounded-2xl border border-[#bcd6fa]/60 bg-canvas/30 p-4 text-xs sm:text-sm text-ink leading-relaxed whitespace-pre-wrap font-enterprise">
              {inquiry.message}
            </div>
          </div>

          {/* Sender Details */}
          <div className="rounded-3xl border border-[#bcd6fa] bg-white p-6 shadow-2xs space-y-4">
            <h2 className="text-sm font-bold text-ink font-display flex items-center gap-2 border-b border-[#bcd6fa]/50 pb-2.5">
              <User size={16} className="text-electric" />
              <span>Inquiry Originator</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-enterprise">
              <div>
                <span className="text-[11px] text-mist font-medium">Full Name</span>
                <p className="font-semibold text-ink mt-0.5">{inquiry.name}</p>
              </div>

              <div>
                <span className="text-[11px] text-mist font-medium">Email Address</span>
                <p className="font-semibold text-ink mt-0.5 break-all">{inquiry.email}</p>
              </div>

              <div>
                <span className="text-[11px] text-mist font-medium">Phone</span>
                <p className="font-semibold text-ink mt-0.5">{inquiry.phone || "Not Provided"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Triage & Response Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl border border-[#bcd6fa] bg-white p-6 shadow-2xs space-y-4">
            <h2 className="text-sm font-bold text-ink font-display flex items-center gap-2 border-b border-[#bcd6fa]/50 pb-2.5">
              <ShieldCheck size={16} className="text-electric" />
              <span>Triage & Resolution Workflow</span>
            </h2>

            {errorMsg && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
                {errorMsg}
              </div>
            )}

            {successMsg && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800">
                Inquiry resolution saved successfully.
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-ink-soft mb-1">
                  Inquiry Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/30 px-3 py-2 text-ink focus:border-electric focus:bg-white focus:outline-none"
                >
                  <option value="new">New Inbound</option>
                  <option value="in_progress">In Progress (Triage)</option>
                  <option value="responded">Responded</option>
                  <option value="closed">Closed / Resolved</option>
                </select>
              </div>

              <div className="rounded-xl border border-[#bcd6fa]/50 bg-canvas/30 p-3 font-enterprise text-[11px] space-y-1">
                <div className="text-mist">Assigned Responder:</div>
                <div className="font-semibold text-ink">
                  {inquiry.responder_details?.full_name || "Unassigned"}
                </div>
                {inquiry.responded_at && (
                  <div className="text-[10px] text-emerald-700 pt-1">
                    Responded at: {new Date(inquiry.responded_at).toLocaleString()}
                  </div>
                )}
              </div>

              <div>
                <label className="block font-semibold text-ink-soft mb-1">
                  Resolution / Response Notes
                </label>
                <textarea
                  rows={4}
                  value={responseNotes}
                  onChange={(e) => setResponseNotes(e.target.value)}
                  placeholder="Record summary of response sent, internal action items, or resolution details..."
                  className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/30 px-3 py-2 text-ink placeholder-mist focus:border-electric focus:bg-white focus:outline-none font-sans"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-xl bg-ink py-2.5 font-semibold text-white shadow-xs hover:bg-electric transition-colors cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <Send size={13} />
                <span>{saving ? "Saving Resolution..." : "Save Status & Resolution Notes"}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
