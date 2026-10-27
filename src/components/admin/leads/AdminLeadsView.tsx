"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Inbox,
  Briefcase,
  Mail,
  Search,
  Filter,
  ArrowUpRight,
  Calendar,
  Building2,
  User,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  TrendingUp,
  FileCheck,
} from "lucide-react";

interface AdminLeadsViewProps {
  initialLeads: any[];
  leadsMetrics: any;
  initialContacts: any[];
  contactsMetrics: any;
}

export default function AdminLeadsView({
  initialLeads,
  leadsMetrics,
  initialContacts,
  contactsMetrics,
}: AdminLeadsViewProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"leads" | "contacts">("leads");

  // Leads Filter states
  const [leadSearch, setLeadSearch] = useState("");
  const [leadStatusFilter, setLeadStatusFilter] = useState("all");
  const [leadSectorFilter, setLeadSectorFilter] = useState("all");

  // Contacts Filter states
  const [contactSearch, setContactSearch] = useState("");
  const [contactStatusFilter, setContactStatusFilter] = useState("all");
  const [contactCategoryFilter, setContactCategoryFilter] = useState("all");

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    return initialLeads.filter((lead) => {
      const matchesSearch =
        !leadSearch ||
        lead.company?.toLowerCase().includes(leadSearch.toLowerCase()) ||
        lead.contact_name?.toLowerCase().includes(leadSearch.toLowerCase()) ||
        lead.roles_needed?.toLowerCase().includes(leadSearch.toLowerCase());

      const matchesStatus =
        leadStatusFilter === "all" || lead.status === leadStatusFilter;

      const matchesSector =
        leadSectorFilter === "all" || lead.sector === leadSectorFilter;

      return matchesSearch && matchesStatus && matchesSector;
    });
  }, [initialLeads, leadSearch, leadStatusFilter, leadSectorFilter]);

  // Filtered Contacts
  const filteredContacts = useMemo(() => {
    return initialContacts.filter((item) => {
      const matchesSearch =
        !contactSearch ||
        item.name?.toLowerCase().includes(contactSearch.toLowerCase()) ||
        item.email?.toLowerCase().includes(contactSearch.toLowerCase()) ||
        item.subject?.toLowerCase().includes(contactSearch.toLowerCase()) ||
        item.message?.toLowerCase().includes(contactSearch.toLowerCase());

      const matchesStatus =
        contactStatusFilter === "all" || item.status === contactStatusFilter;

      const matchesCategory =
        contactCategoryFilter === "all" || item.category === contactCategoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [initialContacts, contactSearch, contactStatusFilter, contactCategoryFilter]);

  const getLeadStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-100 text-blue-700">NEW INBOUND</span>;
      case "contacted":
        return <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-100 text-purple-700">CONTACTED</span>;
      case "discovery_booked":
        return <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800">DISCOVERY BOOKED</span>;
      case "discovery_running":
        return <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">DISCOVERY RUNNING</span>;
      case "qualified":
        return <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800">QUALIFIED</span>;
      case "converted":
        return <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-200 text-emerald-950">CONVERTED (CLIENT)</span>;
      case "lost":
        return <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600">LOST</span>;
      default:
        return <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700">{status}</span>;
    }
  };

  const getContactStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-100 text-blue-700">NEW</span>;
      case "in_progress":
        return <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800">IN PROGRESS</span>;
      case "responded":
        return <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800">RESPONDED</span>;
      case "closed":
        return <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600">CLOSED</span>;
      default:
        return <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700">{status}</span>;
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "partnership":
        return <span className="text-[10.5px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded font-enterprise">PARTNERSHIP</span>;
      case "talent_support":
        return <span className="text-[10.5px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded font-enterprise">TALENT SUPPORT</span>;
      case "press_media":
        return <span className="text-[10.5px] font-bold text-pink-700 bg-pink-50 px-2 py-0.5 rounded font-enterprise">PRESS & MEDIA</span>;
      case "feedback":
        return <span className="text-[10.5px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-enterprise">FEEDBACK</span>;
      default:
        return <span className="text-[10.5px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded font-enterprise">GENERAL</span>;
    }
  };

  return (
    <div className="space-y-6 font-enterprise">
      {/* Top Banner / Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#bcd6fa]/50 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-md bg-electric/10 px-2 py-0.5 text-[10px] font-bold text-electric uppercase tracking-wider mb-1 font-enterprise">
            Commercial Pipeline & Communications
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-ink font-display">
            Inquiries & Employer Leads
          </h1>
          <p className="text-xs text-ink-soft">
            Manage commercial employer hiring requests, discovery consultations, conversion to ATS clients, and general inquiries.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="inline-flex rounded-xl border border-[#bcd6fa] bg-white p-1 shadow-2xs font-enterprise">
          <button
            type="button"
            onClick={() => setActiveTab("leads")}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "leads"
                ? "bg-ink text-white shadow-2xs"
                : "text-ink-soft hover:text-ink hover:bg-canvas"
            }`}
          >
            <Briefcase size={14} />
            <span>Employer Leads</span>
            <span className={`px-1.5 py-0.2 rounded text-[10px] font-semibold ${activeTab === "leads" ? "bg-white/20 text-white" : "bg-canvas text-ink-soft"}`}>
              {leadsMetrics?.total || initialLeads.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("contacts")}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "contacts"
                ? "bg-ink text-white shadow-2xs"
                : "text-ink-soft hover:text-ink hover:bg-canvas"
            }`}
          >
            <Mail size={14} />
            <span>Contact Messages</span>
            <span className={`px-1.5 py-0.2 rounded text-[10px] font-semibold ${activeTab === "contacts" ? "bg-white/20 text-white" : "bg-canvas text-ink-soft"}`}>
              {contactsMetrics?.total || initialContacts.length}
            </span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      {activeTab === "leads" ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 font-enterprise">
          <div className="rounded-2xl border border-[#bcd6fa] bg-white p-4 shadow-2xs">
            <div className="text-[11px] font-semibold text-ink-soft">Total Inbound Leads</div>
            <div className="mt-1 text-2xl font-bold text-ink font-display">
              {leadsMetrics?.total ?? initialLeads.length}
            </div>
            <div className="mt-1 text-[11px] font-medium text-mist">From website & calculator</div>
          </div>

          <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-4 shadow-2xs">
            <div className="text-[11px] font-semibold text-blue-900">New Inbound</div>
            <div className="mt-1 text-2xl font-bold text-blue-950 font-display">
              {leadsMetrics?.new ?? 0}
            </div>
            <div className="mt-1 text-[11px] font-medium text-blue-700">Awaiting contact review</div>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 shadow-2xs">
            <div className="text-[11px] font-semibold text-amber-900">In Discovery</div>
            <div className="mt-1 text-2xl font-bold text-amber-950 font-display">
              {leadsMetrics?.discovery ?? 0}
            </div>
            <div className="mt-1 text-[11px] font-medium text-amber-700">Consultation scheduled / active</div>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 shadow-2xs">
            <div className="text-[11px] font-semibold text-emerald-900">Converted Clients</div>
            <div className="mt-1 text-2xl font-bold text-emerald-950 font-display">
              {leadsMetrics?.converted ?? 0}
            </div>
            <div className="mt-1 text-[11px] font-medium text-emerald-700">Active ATS client entities</div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 font-enterprise">
          <div className="rounded-2xl border border-[#bcd6fa] bg-white p-4 shadow-2xs">
            <div className="text-[11px] font-semibold text-ink-soft">Total Inquiries</div>
            <div className="mt-1 text-2xl font-bold text-ink font-display">
              {contactsMetrics?.total ?? initialContacts.length}
            </div>
            <div className="mt-1 text-[11px] font-medium text-mist">General communication</div>
          </div>

          <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-4 shadow-2xs">
            <div className="text-[11px] font-semibold text-blue-900">New Unassigned</div>
            <div className="mt-1 text-2xl font-bold text-blue-950 font-display">
              {contactsMetrics?.new ?? 0}
            </div>
            <div className="mt-1 text-[11px] font-medium text-blue-700">Pending team triage</div>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 shadow-2xs">
            <div className="text-[11px] font-semibold text-amber-900">In Progress</div>
            <div className="mt-1 text-2xl font-bold text-amber-950 font-display">
              {contactsMetrics?.in_progress ?? 0}
            </div>
            <div className="mt-1 text-[11px] font-medium text-amber-700">Assigned to staff</div>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 shadow-2xs">
            <div className="text-[11px] font-semibold text-emerald-900">Responded & Closed</div>
            <div className="mt-1 text-2xl font-bold text-emerald-950 font-display">
              {(contactsMetrics?.responded || 0) + (contactsMetrics?.closed || 0)}
            </div>
            <div className="mt-1 text-[11px] font-medium text-emerald-700">Resolution dispatched</div>
          </div>
        </div>
      )}

      {/* TAB 1: Employer Leads Section */}
      {activeTab === "leads" && (
        <div className="rounded-3xl border border-[#bcd6fa] bg-white shadow-2xs overflow-hidden">
          {/* Controls Bar */}
          <div className="p-4 border-b border-[#bcd6fa]/50 bg-canvas/30 flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search size={14} className="absolute left-3 top-2.5 text-mist" />
              <input
                type="text"
                value={leadSearch}
                onChange={(e) => setLeadSearch(e.target.value)}
                placeholder="Search by company, name, role..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-[#bcd6fa] bg-white text-xs text-ink placeholder-mist focus:border-electric focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <div className="flex items-center gap-1.5 text-xs text-ink-soft">
                <Filter size={13} className="text-mist" />
                <span>Status:</span>
              </div>
              <select
                value={leadStatusFilter}
                onChange={(e) => setLeadStatusFilter(e.target.value)}
                className="rounded-xl border border-[#bcd6fa] bg-white px-2.5 py-1.5 text-xs text-ink focus:border-electric focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="new">New Inbound</option>
                <option value="contacted">Contacted</option>
                <option value="discovery_booked">Discovery Booked</option>
                <option value="discovery_running">Discovery Running</option>
                <option value="qualified">Qualified</option>
                <option value="converted">Converted to Client</option>
                <option value="lost">Lost</option>
              </select>

              <select
                value={leadSectorFilter}
                onChange={(e) => setLeadSectorFilter(e.target.value)}
                className="rounded-xl border border-[#bcd6fa] bg-white px-2.5 py-1.5 text-xs text-ink focus:border-electric focus:outline-none"
              >
                <option value="all">All Sectors</option>
                <option value="technology">Technology</option>
                <option value="healthcare">Healthcare</option>
                <option value="both">Both / Hybrid</option>
              </select>
            </div>
          </div>

          {/* Leads Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-enterprise">
              <thead>
                <tr className="border-b border-[#bcd6fa]/60 bg-canvas/40 text-[11px] font-bold uppercase tracking-wider text-ink-soft">
                  <th className="py-2.5 px-4">Organization & Contact</th>
                  <th className="py-2.5 px-4">Sector / Needs</th>
                  <th className="py-2.5 px-4">Headcount / Timeline</th>
                  <th className="py-2.5 px-4">Consultation Slot</th>
                  <th className="py-2.5 px-4">Owner</th>
                  <th className="py-2.5 px-4">Status</th>
                  <th className="py-2.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#bcd6fa]/40 text-xs">
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-ink-soft">
                      No employer leads match the current filters.
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => (
                    <tr
                      key={lead.id}
                      onClick={() => router.push(`/admin/leads/${lead.id}`)}
                      className="hover:bg-canvas/50 transition-colors cursor-pointer group"
                    >
                      <td className="py-3 px-4">
                        <div className="font-bold text-ink group-hover:text-electric transition-colors line-clamp-1">
                          {lead.company}
                        </div>
                        <div className="text-[11px] text-ink-soft line-clamp-1 font-medium">
                          {lead.contact_name}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-medium text-ink capitalize line-clamp-1">
                          {lead.sector || "General Tech"}
                        </div>
                        <div className="text-[11px] text-mist font-medium capitalize">
                          {lead.engagement_model?.replace("_", " ") || "Staff Aug"}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-medium text-ink">
                          {lead.headcount} {lead.headcount === 1 ? "Role" : "Roles"}
                        </div>
                        <div className="text-[11px] text-mist font-medium capitalize">
                          {lead.timeline?.replace("_", " ") || "Immediate"}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        {lead.booking_data?.selected_slot ? (
                          <div className="inline-flex items-center gap-1 text-[11px] text-electric font-semibold line-clamp-1">
                            <Calendar size={12} className="shrink-0" />
                            <span>{lead.booking_data.selected_slot}</span>
                          </div>
                        ) : (
                          <span className="text-[11px] text-mist font-medium">Direct Brief</span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <span className="text-[11px] text-ink line-clamp-1 font-medium">
                          {lead.owner_details?.full_name || "Unassigned"}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        {getLeadStatusBadge(lead.status)}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <Link
                          href={`/admin/leads/${lead.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-electric hover:underline"
                        >
                          <span>Review Dossier</span>
                          <ChevronRight size={14} />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: General Contact Inquiries Section */}
      {activeTab === "contacts" && (
        <div className="rounded-3xl border border-[#bcd6fa] bg-white shadow-2xs overflow-hidden">
          {/* Controls Bar */}
          <div className="p-4 border-b border-[#bcd6fa]/50 bg-canvas/30 flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search size={14} className="absolute left-3 top-2.5 text-mist" />
              <input
                type="text"
                value={contactSearch}
                onChange={(e) => setContactSearch(e.target.value)}
                placeholder="Search by sender, email, subject..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-[#bcd6fa] bg-white text-xs text-ink placeholder-mist focus:border-electric focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto font-enterprise">
              <div className="flex items-center gap-1.5 text-xs text-ink-soft">
                <Filter size={13} className="text-mist" />
                <span>Status:</span>
              </div>
              <select
                value={contactStatusFilter}
                onChange={(e) => setContactStatusFilter(e.target.value)}
                className="rounded-xl border border-[#bcd6fa] bg-white px-2.5 py-1.5 text-xs text-ink focus:border-electric focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="new">New</option>
                <option value="in_progress">In Progress</option>
                <option value="responded">Responded</option>
                <option value="closed">Closed</option>
              </select>

              <select
                value={contactCategoryFilter}
                onChange={(e) => setContactCategoryFilter(e.target.value)}
                className="rounded-xl border border-[#bcd6fa] bg-white px-2.5 py-1.5 text-xs text-ink focus:border-electric focus:outline-none"
              >
                <option value="all">All Categories</option>
                <option value="general">General</option>
                <option value="partnership">Strategic Partnership</option>
                <option value="talent_support">Talent Support</option>
                <option value="press_media">Press & Media</option>
                <option value="feedback">Feedback</option>
              </select>
            </div>
          </div>

          {/* Contact Inquiries Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-enterprise">
              <thead>
                <tr className="border-b border-[#bcd6fa]/60 bg-canvas/40 text-[11px] font-bold uppercase tracking-wider text-ink-soft">
                  <th className="py-2.5 px-4">Sender Details</th>
                  <th className="py-2.5 px-4">Category</th>
                  <th className="py-2.5 px-4">Subject</th>
                  <th className="py-2.5 px-4">Assigned Responder</th>
                  <th className="py-2.5 px-4">Status</th>
                  <th className="py-2.5 px-4">Received Date</th>
                  <th className="py-2.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#bcd6fa]/40 text-xs">
                {filteredContacts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-ink-soft">
                      No contact inquiries match the current filters.
                    </td>
                  </tr>
                ) : (
                  filteredContacts.map((item) => (
                    <tr
                      key={item.id}
                      onClick={() => router.push(`/admin/contacts/${item.id}`)}
                      className="hover:bg-canvas/50 transition-colors cursor-pointer group"
                    >
                      <td className="py-3 px-4">
                        <div className="font-bold text-ink group-hover:text-electric transition-colors line-clamp-1">
                          {item.name}
                        </div>
                        <div className="text-[11px] text-ink-soft line-clamp-1 font-medium">
                          {item.email}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        {getCategoryBadge(item.category)}
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-medium text-ink line-clamp-1 max-w-xs">
                          {item.subject}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="text-[11px] text-ink line-clamp-1">
                          {item.responder_details?.full_name || "Unassigned"}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        {getContactStatusBadge(item.status)}
                      </td>

                      <td className="py-3 px-4 text-[11px] text-mist font-medium">
                        {item.created_at ? new Date(item.created_at).toLocaleDateString() : "Recent"}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <Link
                          href={`/admin/contacts/${item.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-electric hover:underline"
                        >
                          <span>Review & Reply</span>
                          <ChevronRight size={14} />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
