"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  getClientsAction,
  createClientAction,
  updateClientAction,
  ClientItem,
  ClientCreatePayload,
} from "@/actions/recruiter.actions";
import {
  Building2,
  Search,
  Plus,
  ExternalLink,
  Users,
  Briefcase,
  Mail,
  Phone,
  ShieldCheck,
  CheckCircle,
  X,
  Edit,
  Globe,
  Filter,
  FileText,
  Clock,
  Sparkles,
  Zap,
} from "lucide-react";

interface ClientManagementViewProps {
  role?: "recruiter" | "admin";
}

export function ClientManagementView({ role = "recruiter" }: ClientManagementViewProps) {
  const [clients, setClients] = useState<ClientItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sectorFilter, setSectorFilter] = useState("all");
  const [channelFilter, setChannelFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Drawers
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [selectedClientForDossier, setSelectedClientForDossier] = useState<ClientItem | null>(null);
  const [dossierTab, setDossierTab] = useState<"overview" | "contacts" | "edit">("overview");

  // Create Form State
  const [newClientName, setNewClientName] = useState("");
  const [newClientSector, setNewClientSector] = useState("technology");
  const [newClientWebsite, setNewClientWebsite] = useState("");
  const [newClientChannel, setNewClientChannel] = useState("email");
  const [newClientNotes, setNewClientNotes] = useState("");
  const [newContactName, setNewContactName] = useState("");
  const [newContactEmail, setNewContactEmail] = useState("");
  const [newContactPhone, setNewContactPhone] = useState("");
  const [newContactRole, setNewContactRole] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  // Edit Form State
  const [editClientName, setEditClientName] = useState("");
  const [editClientSector, setEditClientSector] = useState("");
  const [editClientWebsite, setEditClientWebsite] = useState("");
  const [editClientChannel, setEditClientChannel] = useState("email");
  const [editClientNotes, setEditClientNotes] = useState("");
  const [editContactName, setEditContactName] = useState("");
  const [editContactEmail, setEditContactEmail] = useState("");
  const [editContactPhone, setEditContactPhone] = useState("");
  const [editContactRole, setEditContactRole] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Feedback Notification
  const [actionNotification, setActionNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const showNotification = (message: string, type: "success" | "error" = "success") => {
    setActionNotification({ type, message });
    setTimeout(() => setActionNotification(null), 4000);
  };

  const fetchClients = async () => {
    setIsLoading(true);
    try {
      const res = await getClientsAction();
      if (res.success && res.data) {
        setClients(res.data);
      }
    } catch {
      showNotification("Failed to retrieve client records.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // Filtered Clients
  const filteredClients = useMemo(() => {
    return clients.filter((c) => {
      const q = searchTerm.trim().toLowerCase();
      const matchesSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        (c.website && c.website.toLowerCase().includes(q)) ||
        c.contacts.some(
          (ct) =>
            ct.full_name.toLowerCase().includes(q) ||
            ct.email.toLowerCase().includes(q) ||
            (ct.role_title && ct.role_title.toLowerCase().includes(q))
        );

      const matchesSector =
        sectorFilter === "all" ||
        (c.sector && c.sector.toLowerCase().includes(sectorFilter.toLowerCase()));

      const matchesChannel =
        channelFilter === "all" ||
        c.delivery_channel.toLowerCase() === channelFilter.toLowerCase();

      return matchesSearch && matchesSector && matchesChannel;
    });
  }, [clients, searchTerm, sectorFilter, channelFilter]);

  // Telemetry Metrics
  const activePartnersCount = useMemo(() => {
    return clients.filter((c) => (c.active_requisitions_count || 0) > 0).length;
  }, [clients]);

  const totalOpenRequisitions = useMemo(() => {
    return clients.reduce((acc, c) => acc + (c.active_requisitions_count || 0), 0);
  }, [clients]);

  // Handle Create Client Submit
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName.trim()) return;

    setIsCreating(true);
    const payload: ClientCreatePayload = {
      name: newClientName.trim(),
      sector: newClientSector,
      website: newClientWebsite.trim() || undefined,
      delivery_channel: newClientChannel,
      terms: newClientNotes.trim() ? { notes: newClientNotes.trim() } : undefined,
      primary_contact_name: newContactName.trim() || undefined,
      primary_contact_email: newContactEmail.trim() || undefined,
      primary_contact_phone: newContactPhone.trim() || undefined,
      primary_contact_role: newContactRole.trim() || undefined,
    };

    const res = await createClientAction(payload);
    setIsCreating(false);

    if (res.success && res.data) {
      setClients((prev) => [res.data!, ...prev]);
      setIsCreateDrawerOpen(false);
      showNotification(`Client organization "${res.data.name}" registered successfully.`);
      // Reset form
      setNewClientName("");
      setNewClientWebsite("");
      setNewClientNotes("");
      setNewContactName("");
      setNewContactEmail("");
      setNewContactPhone("");
      setNewContactRole("");
    } else {
      showNotification(res.error || "Failed to register client organization.", "error");
    }
  };

  // Open Dossier Drawer
  const handleOpenDossier = (client: ClientItem, defaultTab: "overview" | "contacts" | "edit" = "overview") => {
    setSelectedClientForDossier(client);
    setDossierTab(defaultTab);
    // Prefill edit state
    setEditClientName(client.name);
    setEditClientSector(client.sector || "technology");
    setEditClientWebsite(client.website || "");
    setEditClientChannel(client.delivery_channel || "email");
    setEditClientNotes((client.terms as any)?.notes || "");

    const prim = client.contacts[0];
    if (prim) {
      setEditContactName(prim.full_name || "");
      setEditContactEmail(prim.email || "");
      setEditContactPhone(prim.phone || "");
      setEditContactRole(prim.role_title || "");
    } else {
      setEditContactName("");
      setEditContactEmail("");
      setEditContactPhone("");
      setEditContactRole("");
    }
  };

  // Handle Update Client Submit
  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClientForDossier) return;

    setIsUpdating(true);
    const payload: Partial<ClientCreatePayload> = {
      name: editClientName.trim(),
      sector: editClientSector,
      website: editClientWebsite.trim() || undefined,
      delivery_channel: editClientChannel,
      terms: editClientNotes.trim() ? { notes: editClientNotes.trim() } : undefined,
      primary_contact_name: editContactName.trim() || undefined,
      primary_contact_email: editContactEmail.trim() || undefined,
      primary_contact_phone: editContactPhone.trim() || undefined,
      primary_contact_role: editContactRole.trim() || undefined,
    };

    const res = await updateClientAction(selectedClientForDossier.id, payload);
    setIsUpdating(false);

    if (res.success && res.data) {
      setClients((prev) =>
        prev.map((c) => (c.id === selectedClientForDossier.id ? res.data! : c))
      );
      setSelectedClientForDossier(res.data);
      setDossierTab("overview");
      showNotification(`Client "${res.data.name}" updated successfully.`);
    } else {
      showNotification(res.error || "Failed to update client record.", "error");
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Action Notification Banner */}
      {actionNotification && (
        <div
          className={`fixed top-20 right-6 z-50 flex items-center gap-3 rounded-2xl px-5 py-3 shadow-xl backdrop-blur-md border animate-in slide-in-from-top-2 duration-200 ${
            actionNotification.type === "success"
              ? "bg-signal/15 border-signal/30 text-signal"
              : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          {actionNotification.type === "success" ? (
            <CheckCircle size={18} className="shrink-0 text-signal" />
          ) : (
            <X size={18} className="shrink-0 text-red-600" />
          )}
          <span className="font-display text-xs font-semibold">{actionNotification.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-electric/30 bg-electric/10 px-3 py-0.5 text-[11px] font-mono font-semibold text-electric uppercase tracking-widest">
            <Building2 size={12} />
            <span>ENTERPRISE CLIENT DIRECTORY &amp; DELIVERY CHANNELS</span>
          </div>
          <h1 className="mt-1 font-display text-2xl font-bold text-ink">
            Client Organizations &amp; Hiring Partners
          </h1>
          <p className="text-xs sm:text-sm text-ink-soft">
            Manage enterprise hiring clients, primary hiring managers, engagement terms, and delivery channels.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href={role === "admin" ? "/admin/pods-management" : "/recruiter/requisitions"}
            className="rounded-xl border border-[#bcd6fa] bg-white px-3.5 py-2 font-display text-xs font-semibold text-ink hover:bg-canvas transition-colors shadow-2xs inline-flex items-center gap-1.5"
          >
            <Briefcase size={13} className="text-electric" />
            <span>Linked Requisitions</span>
          </Link>

          <button
            type="button"
            onClick={() => setIsCreateDrawerOpen(true)}
            className="rounded-xl bg-ink px-4 py-2 font-display text-xs font-bold text-white shadow-xs hover:bg-electric transition-colors cursor-pointer inline-flex items-center gap-1.5"
          >
            <Plus size={14} />
            <span>Register Client</span>
          </button>
        </div>
      </div>

      {/* Telemetry Metric Ribbon */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        <div className="rounded-2xl border border-[#bcd6fa] bg-white p-4 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-mist uppercase tracking-wider font-semibold">
              Total Clients
            </span>
            <Building2 size={14} className="text-electric" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <div className="font-display text-2xl font-bold text-ink">{clients.length}</div>
            <span className="font-mono text-[10px] text-mist">Organizations</span>
          </div>
        </div>

        <div className="rounded-2xl border border-[#bcd6fa] bg-white p-4 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-mist uppercase tracking-wider font-semibold">
              Active Partners
            </span>
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <div className="font-display text-2xl font-bold text-ink">{activePartnersCount}</div>
            <span className="font-mono text-[10px] text-emerald-600 font-bold">With Active Jobs</span>
          </div>
        </div>

        <div className="rounded-2xl border border-[#bcd6fa] bg-white p-4 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-mist uppercase tracking-wider font-semibold">
              Open Requisitions
            </span>
            <Briefcase size={14} className="text-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <div className="font-display text-2xl font-bold text-ink">{totalOpenRequisitions}</div>
            <span className="font-mono text-[10px] text-mist">Total Roles</span>
          </div>
        </div>

        <div className="rounded-2xl border border-[#bcd6fa] bg-white p-4 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-mist uppercase tracking-wider font-semibold">
              Client Portal Status
            </span>
            <ShieldCheck size={14} className="text-signal" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <div className="font-display text-sm font-bold text-ink">Staff-Managed</div>
            <span className="rounded-full bg-signal/10 px-2 py-0.5 font-mono text-[9.5px] font-bold text-signal">
              ACTIVE PARTNER
            </span>
          </div>
        </div>
      </div>

      {/* Toolbar & Filters */}
      <div className="rounded-2xl border border-[#bcd6fa] bg-white p-3.5 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3.5 top-3 text-mist pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search client organization, domain, contact name, email..."
            className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/30 pl-9 pr-3.5 py-2 text-xs text-ink placeholder-mist focus:border-electric focus:bg-white focus:outline-hidden"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Sector Filter */}
          <select
            value={sectorFilter}
            onChange={(e) => setSectorFilter(e.target.value)}
            className="rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 text-xs text-ink font-display focus:border-electric focus:outline-hidden cursor-pointer"
          >
            <option value="all">All Sectors</option>
            <option value="technology">Technology &amp; SDLC</option>
            <option value="healthcare">Healthcare &amp; Clinical</option>
            <option value="financial">Financial Services</option>
          </select>

          {/* Delivery Channel Filter */}
          <select
            value={channelFilter}
            onChange={(e) => setChannelFilter(e.target.value)}
            className="rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 text-xs text-ink font-display focus:border-electric focus:outline-hidden cursor-pointer"
          >
            <option value="all">All Delivery Channels</option>
            <option value="email">Email Package</option>
            <option value="im">Slack Connect / IM</option>
            <option value="client_ats">Client ATS (Workday/Greenhouse)</option>
            <option value="portal">Client Portal</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex items-center rounded-xl border border-[#bcd6fa] bg-canvas/40 p-0.5">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`rounded-lg px-2.5 py-1 text-xs font-display font-semibold transition-colors cursor-pointer ${
                viewMode === "grid"
                  ? "bg-white text-ink shadow-2xs"
                  : "text-mist hover:text-ink"
              }`}
            >
              Cards
            </button>
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`rounded-lg px-2.5 py-1 text-xs font-display font-semibold transition-colors cursor-pointer ${
                viewMode === "table"
                  ? "bg-white text-ink shadow-2xs"
                  : "text-mist hover:text-ink"
              }`}
            >
              Table
            </button>
          </div>
        </div>
      </div>

      {/* Main Directory Area */}
      {isLoading ? (
        <div className="rounded-2xl border border-[#bcd6fa] bg-white p-12 text-center text-xs text-ink-soft">
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-electric border-t-transparent mb-2" />
          <p className="font-display font-semibold">Loading enterprise client records...</p>
        </div>
      ) : filteredClients.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#bcd6fa] bg-white p-12 text-center space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-canvas text-mist">
            <Building2 size={24} />
          </div>
          <h3 className="font-display font-bold text-ink text-sm">No Client Records Found</h3>
          <p className="text-xs text-ink-soft max-w-md mx-auto">
            {searchTerm || sectorFilter !== "all" || channelFilter !== "all"
              ? "No clients match your filter criteria. Try clearing filters or search terms."
              : "Register your first enterprise client organization to link with job posts and candidate shortlists."}
          </p>
          <button
            type="button"
            onClick={() => setIsCreateDrawerOpen(true)}
            className="rounded-xl bg-ink px-4 py-2 font-display text-xs font-bold text-white shadow-xs hover:bg-electric transition-colors cursor-pointer inline-flex items-center gap-1.5"
          >
            <Plus size={14} />
            <span>Register New Client</span>
          </button>
        </div>
      ) : viewMode === "grid" ? (
        /* Grid Cards View */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredClients.map((client) => {
            const primaryContact = client.contacts[0];
            return (
              <div
                key={client.id}
                className="group rounded-2xl border border-[#bcd6fa] bg-white p-5 shadow-2xs hover:shadow-md hover:border-electric transition-all flex flex-col justify-between space-y-4"
              >
                {/* Card Top */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-display font-bold text-ink text-base group-hover:text-electric transition-colors">
                          {client.name}
                        </h3>
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="rounded-full bg-slate-100 border border-slate-200 px-2 py-0.5 font-mono text-[9.5px] font-bold text-slate-700 uppercase">
                          {client.sector || "Tech"}
                        </span>
                        <span className="rounded-full bg-electric/10 text-electric border border-electric/25 px-2 py-0.5 font-mono text-[9.5px] font-bold uppercase">
                          {client.delivery_channel.replace("_", " ")}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-mono text-xs font-bold text-electric block">
                        {client.active_requisitions_count || 0}
                      </span>
                      <span className="font-mono text-[9px] text-mist uppercase">Active Roles</span>
                    </div>
                  </div>

                  {client.website && (
                    <a
                      href={client.website}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono text-[11px] text-mist hover:text-electric inline-flex items-center gap-1.5 transition-colors"
                    >
                      <Globe size={11} />
                      <span className="truncate max-w-[200px]">{client.website}</span>
                      <ExternalLink size={10} />
                    </a>
                  )}

                  {/* Primary Contact Capsule */}
                  <div className="rounded-xl border border-[#bcd6fa]/60 bg-canvas/30 p-3 space-y-1.5 text-xs">
                    <span className="font-mono text-[9.5px] text-mist uppercase font-semibold block">
                      Primary Hiring Contact
                    </span>
                    {primaryContact ? (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-display font-bold text-ink">
                            {primaryContact.full_name}
                          </span>
                          <span className="font-mono text-[10px] text-slate-500">
                            {primaryContact.role_title || "Lead"}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 font-mono text-[10.5px] text-mist">
                          <span className="inline-flex items-center gap-1 truncate max-w-[150px]">
                            <Mail size={10} className="text-electric" />
                            {primaryContact.email}
                          </span>
                          {primaryContact.phone && (
                            <span className="inline-flex items-center gap-1">
                              <Phone size={10} className="text-signal" />
                              {primaryContact.phone}
                            </span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <p className="font-mono text-[11px] text-mist italic">No contacts registered</p>
                    )}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-[#bcd6fa]/40 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenDossier(client, "overview")}
                    className="font-display text-xs font-semibold text-electric hover:underline cursor-pointer"
                  >
                    View Dossier
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleOpenDossier(client, "edit")}
                      className="rounded-lg border border-[#bcd6fa] bg-white px-2.5 py-1 text-xs font-display font-semibold text-ink-soft hover:bg-canvas hover:text-ink transition-colors cursor-pointer inline-flex items-center gap-1"
                    >
                      <Edit size={11} />
                      <span>Edit</span>
                    </button>

                    <Link
                      href={
                        role === "admin"
                          ? `/admin/pods-management?client=${encodeURIComponent(client.name)}`
                          : `/recruiter/requisitions?client=${encodeURIComponent(client.name)}`
                      }
                      className="rounded-lg bg-electric/10 hover:bg-electric hover:text-white text-electric px-2.5 py-1 text-xs font-display font-semibold transition-colors inline-flex items-center gap-1"
                    >
                      <Briefcase size={11} />
                      <span>Jobs</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* High-Density Table View */
        <div className="rounded-2xl border border-[#bcd6fa] bg-white overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#bcd6fa]/60 bg-canvas/40 font-mono text-[10px] text-mist uppercase font-semibold">
                  <th className="py-3 px-4">Client Organization</th>
                  <th className="py-3 px-4">Sector</th>
                  <th className="py-3 px-4">Delivery Channel</th>
                  <th className="py-3 px-4">Primary Contact</th>
                  <th className="py-3 px-4 text-center">Active Jobs</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#bcd6fa]/40">
                {filteredClients.map((client) => {
                  const primaryContact = client.contacts[0];
                  return (
                    <tr key={client.id} className="hover:bg-canvas/20 transition-colors">
                      <td className="py-3.5 px-4 font-display font-bold text-ink">
                        <div>
                          <span>{client.name}</span>
                          {client.website && (
                            <span className="block font-mono text-[10.5px] text-mist font-normal">
                              {client.website}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="rounded-full bg-slate-100 border border-slate-200 px-2 py-0.5 font-mono text-[9.5px] font-bold text-slate-700 uppercase">
                          {client.sector || "Tech"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="rounded-full bg-electric/10 text-electric border border-electric/25 px-2 py-0.5 font-mono text-[9.5px] font-bold uppercase">
                          {client.delivery_channel.replace("_", " ")}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        {primaryContact ? (
                          <div>
                            <span className="font-display font-semibold text-ink block">
                              {primaryContact.full_name}
                            </span>
                            <span className="font-mono text-[10px] text-mist">
                              {primaryContact.email}
                            </span>
                          </div>
                        ) : (
                          <span className="font-mono text-mist italic">None</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="font-mono font-bold text-electric">
                          {client.active_requisitions_count || 0}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenDossier(client, "overview")}
                            className="rounded-lg border border-[#bcd6fa] bg-white px-2.5 py-1 font-display text-xs font-semibold text-ink-soft hover:bg-canvas hover:text-ink transition-colors cursor-pointer"
                          >
                            Dossier
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenDossier(client, "edit")}
                            className="rounded-lg bg-electric/10 hover:bg-electric hover:text-white text-electric px-2.5 py-1 font-display text-xs font-semibold transition-colors cursor-pointer"
                          >
                            Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Right-Side Sheet Drawer: Register New Client (Dashboard UX Invariant) */}
      {isCreateDrawerOpen && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-ink/40 backdrop-blur-xs animate-in fade-in-0 duration-150"
          onClick={() => setIsCreateDrawerOpen(false)}
        >
          <div
            className="w-full md:w-1/2 lg:w-1/2 md:max-w-[50vw] bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto thin-scrollbar animate-in slide-in-from-right duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleCreateSubmit} className="flex-1 flex flex-col justify-between">
              <div>
                {/* Drawer Header */}
                <div className="p-6 border-b border-[#bcd6fa]/40 bg-canvas/30 flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-electric uppercase tracking-wider">
                        CLIENT ONBOARDING
                      </span>
                      <span className="rounded-full bg-signal/10 px-2 py-0.5 font-mono text-[10px] font-bold text-signal">
                        STAFF MANAGED
                      </span>
                    </div>
                    <h3 className="mt-1 font-display text-xl font-bold text-ink">
                      Register Enterprise Client
                    </h3>
                    <p className="text-xs text-ink-soft">
                      Create organization record, assign delivery channels, and designate primary hiring contact.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsCreateDrawerOpen(false)}
                    className="rounded-lg p-1.5 text-mist hover:text-ink hover:bg-canvas transition-colors cursor-pointer"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Form Fields */}
                <div className="p-6 space-y-4 text-xs">
                  <div className="space-y-1">
                    <label className="font-mono text-[10.5px] font-bold text-ink block">
                      Organization / Company Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={newClientName}
                      onChange={(e) => setNewClientName(e.target.value)}
                      placeholder="e.g. Apex Financial Cloud Systems"
                      className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/20 px-3.5 py-2.5 text-xs text-ink focus:border-electric focus:bg-white focus:outline-hidden"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-mono text-[10.5px] font-bold text-ink block">
                        Industry Sector Track
                      </label>
                      <select
                        value={newClientSector}
                        onChange={(e) => setNewClientSector(e.target.value)}
                        className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/20 px-3.5 py-2.5 text-xs text-ink focus:border-electric focus:bg-white focus:outline-hidden cursor-pointer"
                      >
                        <option value="technology">Technology &amp; Software SDLC</option>
                        <option value="healthcare">Healthcare &amp; Clinical Systems</option>
                        <option value="financial">Financial Services &amp; Banking</option>
                        <option value="energy">Clean Energy &amp; Infrastructure</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-mono text-[10.5px] font-bold text-ink block">
                        Website Domain URL
                      </label>
                      <input
                        type="url"
                        value={newClientWebsite}
                        onChange={(e) => setNewClientWebsite(e.target.value)}
                        placeholder="https://apexsystems.io"
                        className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/20 px-3.5 py-2.5 text-xs text-ink focus:border-electric focus:bg-white focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono text-[10.5px] font-bold text-ink block">
                      Preferred Shortlist Delivery Channel
                    </label>
                    <select
                      value={newClientChannel}
                      onChange={(e) => setNewClientChannel(e.target.value)}
                      className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/20 px-3.5 py-2.5 text-xs text-ink focus:border-electric focus:bg-white focus:outline-hidden cursor-pointer"
                    >
                      <option value="email">Email Submission Package (PDF &amp; Markdown Dossiers)</option>
                      <option value="im">Instant Messaging / Slack Connect Channel</option>
                      <option value="client_ats">Client ATS CSV Upload (Workday, Greenhouse, Lever)</option>
                      <option value="portal">Dedicated Client Portal (Post-GTM Single Tenant)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono text-[10.5px] font-bold text-ink block">
                      Engagement Terms &amp; Operational Notes
                    </label>
                    <textarea
                      rows={2}
                      value={newClientNotes}
                      onChange={(e) => setNewClientNotes(e.target.value)}
                      placeholder="e.g. Standard 15% placement fee, 90-day guarantee period, net-30 payment terms..."
                      className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/20 p-3 text-xs text-ink focus:border-electric focus:bg-white focus:outline-hidden leading-relaxed font-sans"
                    />
                  </div>

                  {/* Primary Hiring Contact Box */}
                  <div className="rounded-2xl border border-[#bcd6fa]/70 bg-canvas/30 p-4 space-y-3">
                    <span className="font-mono text-[10.5px] font-bold uppercase tracking-wider text-electric block">
                      Primary Hiring Contact Information
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="font-mono text-[10px] text-mist block mb-1">
                          Contact Name
                        </label>
                        <input
                          type="text"
                          value={newContactName}
                          onChange={(e) => setNewContactName(e.target.value)}
                          placeholder="e.g. Sarah Jenkins"
                          className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 text-xs text-ink focus:border-electric focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="font-mono text-[10px] text-mist block mb-1">
                          Official Work Email
                        </label>
                        <input
                          type="email"
                          value={newContactEmail}
                          onChange={(e) => setNewContactEmail(e.target.value)}
                          placeholder="sarah.jenkins@apexsystems.io"
                          className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 text-xs text-ink focus:border-electric focus:outline-hidden"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="font-mono text-[10px] text-mist block mb-1">
                          Direct Phone / WhatsApp
                        </label>
                        <input
                          type="tel"
                          value={newContactPhone}
                          onChange={(e) => setNewContactPhone(e.target.value)}
                          placeholder="+1 (555) 234-5678"
                          className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 text-xs text-ink focus:border-electric focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="font-mono text-[10px] text-mist block mb-1">
                          Role Title / Clearance
                        </label>
                        <input
                          type="text"
                          value={newContactRole}
                          onChange={(e) => setNewContactRole(e.target.value)}
                          placeholder="VP of Platform Engineering"
                          className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 text-xs text-ink focus:border-electric focus:outline-hidden"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Drawer Footer Actions */}
              <div className="p-6 border-t border-[#bcd6fa]/40 bg-canvas/30 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateDrawerOpen(false)}
                  className="rounded-xl border border-[#bcd6fa] px-4 py-2.5 font-display text-xs font-semibold text-ink-soft hover:bg-canvas transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isCreating || !newClientName.trim()}
                  className="rounded-xl bg-ink px-5 py-2.5 font-display text-xs font-bold text-white shadow-xs hover:bg-electric transition-colors disabled:opacity-50 cursor-pointer inline-flex items-center gap-1.5"
                >
                  {isCreating ? "Registering..." : "Create Client Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Right-Side Sheet Drawer: Client Dossier & Edit (Dashboard UX Invariant) */}
      {selectedClientForDossier && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-ink/40 backdrop-blur-xs animate-in fade-in-0 duration-150"
          onClick={() => setSelectedClientForDossier(null)}
        >
          <div
            className="w-full md:w-1/2 lg:w-1/2 md:max-w-[50vw] bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto thin-scrollbar animate-in slide-in-from-right duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              {/* Header */}
              <div className="p-6 border-b border-[#bcd6fa]/40 bg-canvas/30 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-electric uppercase tracking-wider">
                      CLIENT DOSSIER
                    </span>
                    <span className="rounded-full bg-signal/10 px-2 py-0.5 font-mono text-[10px] font-bold text-signal uppercase">
                      {selectedClientForDossier.delivery_channel.replace("_", " ")}
                    </span>
                  </div>
                  <h3 className="mt-1 font-display text-xl font-bold text-ink">
                    {selectedClientForDossier.name}
                  </h3>
                  <p className="text-xs text-ink-soft">
                    {selectedClientForDossier.sector || "Enterprise Sector"} ·{" "}
                    {selectedClientForDossier.active_requisitions_count || 0} Active Requisitions
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedClientForDossier(null)}
                  className="rounded-lg p-1.5 text-mist hover:text-ink hover:bg-canvas transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Sub-Tabs */}
              <div className="px-6 pt-3 border-b border-[#bcd6fa]/30 flex items-center gap-4 bg-canvas/10 text-xs font-display font-semibold">
                <button
                  type="button"
                  onClick={() => setDossierTab("overview")}
                  className={`pb-2.5 transition-colors border-b-2 cursor-pointer ${
                    dossierTab === "overview"
                      ? "border-electric text-electric"
                      : "border-transparent text-mist hover:text-ink"
                  }`}
                >
                  Overview &amp; Terms
                </button>
                <button
                  type="button"
                  onClick={() => setDossierTab("contacts")}
                  className={`pb-2.5 transition-colors border-b-2 cursor-pointer ${
                    dossierTab === "contacts"
                      ? "border-electric text-electric"
                      : "border-transparent text-mist hover:text-ink"
                  }`}
                >
                  Contacts ({selectedClientForDossier.contacts.length})
                </button>
                <button
                  type="button"
                  onClick={() => setDossierTab("edit")}
                  className={`pb-2.5 transition-colors border-b-2 cursor-pointer ${
                    dossierTab === "edit"
                      ? "border-electric text-electric"
                      : "border-transparent text-mist hover:text-ink"
                  }`}
                >
                  Edit Profile
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {dossierTab === "overview" && (
                  <div className="space-y-5 text-xs">
                    {/* Organization Details Grid */}
                    <div className="grid grid-cols-2 gap-3 rounded-2xl border border-[#bcd6fa]/70 bg-canvas/20 p-4 font-mono text-[11px]">
                      <div>
                        <span className="text-mist block text-[9.5px] uppercase">Industry Sector:</span>
                        <span className="text-ink font-semibold">
                          {selectedClientForDossier.sector || "Technology"}
                        </span>
                      </div>
                      <div>
                        <span className="text-mist block text-[9.5px] uppercase">Preferred Channel:</span>
                        <span className="text-electric font-semibold uppercase">
                          {selectedClientForDossier.delivery_channel.replace("_", " ")}
                        </span>
                      </div>
                      <div>
                        <span className="text-mist block text-[9.5px] uppercase">Website URL:</span>
                        {selectedClientForDossier.website ? (
                          <a
                            href={selectedClientForDossier.website}
                            target="_blank"
                            rel="noreferrer"
                            className="text-electric hover:underline inline-flex items-center gap-1"
                          >
                            <span>{selectedClientForDossier.website}</span>
                            <ExternalLink size={10} />
                          </a>
                        ) : (
                          <span className="text-mist">Not specified</span>
                        )}
                      </div>
                      <div>
                        <span className="text-mist block text-[9.5px] uppercase">Requisitions:</span>
                        <span className="text-emerald-600 font-bold">
                          {selectedClientForDossier.active_requisitions_count || 0} Open Positions
                        </span>
                      </div>
                    </div>

                    {/* Engagement Terms */}
                    <div className="rounded-2xl border border-[#bcd6fa]/60 bg-white p-4 space-y-2">
                      <span className="font-mono text-[10px] text-electric uppercase font-bold tracking-wider block">
                        Engagement Terms &amp; SLA Notes
                      </span>
                      <p className="text-xs text-ink leading-relaxed">
                        {(selectedClientForDossier.terms as any)?.notes ||
                          "Standard Master Services Agreement (MSA) on file. 90-day candidate guarantee period with net-30 settlement terms."}
                      </p>
                    </div>

                    {/* Primary Contact Capsule */}
                    <div className="rounded-2xl border border-[#bcd6fa]/60 bg-white p-4 space-y-2">
                      <span className="font-mono text-[10px] text-electric uppercase font-bold tracking-wider block">
                        Primary Key Stakeholder
                      </span>
                      {selectedClientForDossier.contacts[0] ? (
                        <div className="space-y-1.5 font-sans">
                          <div className="flex items-center justify-between">
                            <span className="font-display font-bold text-ink text-sm">
                              {selectedClientForDossier.contacts[0].full_name}
                            </span>
                            <span className="font-mono text-[10px] text-slate-500">
                              {selectedClientForDossier.contacts[0].role_title || "Lead"}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 font-mono text-[11px] text-mist pt-1">
                            <div className="flex items-center gap-1.5">
                              <Mail size={12} className="text-electric" />
                              <span className="text-ink">{selectedClientForDossier.contacts[0].email}</span>
                            </div>
                            {selectedClientForDossier.contacts[0].phone && (
                              <div className="flex items-center gap-1.5">
                                <Phone size={12} className="text-signal" />
                                <span className="text-ink">{selectedClientForDossier.contacts[0].phone}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <p className="text-mist italic">No primary contact recorded.</p>
                      )}
                    </div>
                  </div>
                )}

                {dossierTab === "contacts" && (
                  <div className="space-y-3">
                    {selectedClientForDossier.contacts.length === 0 ? (
                      <p className="text-center text-xs text-mist py-8">
                        No additional contacts registered for this client organization.
                      </p>
                    ) : (
                      selectedClientForDossier.contacts.map((contact) => (
                        <div
                          key={contact.id}
                          className="rounded-2xl border border-[#bcd6fa]/70 bg-white p-4 space-y-2 shadow-2xs"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-display font-bold text-ink text-sm">
                                {contact.full_name}
                              </h4>
                              <span className="font-mono text-[10px] text-mist">
                                {contact.role_title || "Stakeholder"}
                              </span>
                            </div>
                            {contact.is_primary && (
                              <span className="rounded-full bg-electric/10 text-electric border border-electric/20 px-2 py-0.5 font-mono text-[9px] font-bold uppercase">
                                Primary
                              </span>
                            )}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-[11px] text-mist pt-1">
                            <div className="flex items-center gap-1.5">
                              <Mail size={11} className="text-electric" />
                              <span className="text-ink truncate">{contact.email}</span>
                            </div>
                            {contact.phone && (
                              <div className="flex items-center gap-1.5">
                                <Phone size={11} className="text-signal" />
                                <span className="text-ink">{contact.phone}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {dossierTab === "edit" && (
                  <form onSubmit={handleUpdateSubmit} className="space-y-4 text-xs">
                    <div className="space-y-1">
                      <label className="font-mono text-[10.5px] font-bold text-ink block">
                        Organization Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={editClientName}
                        onChange={(e) => setEditClientName(e.target.value)}
                        className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/20 px-3.5 py-2.5 text-xs text-ink focus:border-electric focus:bg-white focus:outline-hidden"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="font-mono text-[10.5px] font-bold text-ink block">
                          Industry Sector
                        </label>
                        <select
                          value={editClientSector}
                          onChange={(e) => setEditClientSector(e.target.value)}
                          className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/20 px-3.5 py-2.5 text-xs text-ink focus:border-electric focus:bg-white focus:outline-hidden cursor-pointer"
                        >
                          <option value="technology">Technology &amp; Software SDLC</option>
                          <option value="healthcare">Healthcare &amp; Clinical Systems</option>
                          <option value="financial">Financial Services &amp; Banking</option>
                          <option value="energy">Clean Energy &amp; Infrastructure</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="font-mono text-[10.5px] font-bold text-ink block">
                          Website Domain URL
                        </label>
                        <input
                          type="url"
                          value={editClientWebsite}
                          onChange={(e) => setEditClientWebsite(e.target.value)}
                          className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/20 px-3.5 py-2.5 text-xs text-ink focus:border-electric focus:bg-white focus:outline-hidden"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="font-mono text-[10.5px] font-bold text-ink block">
                        Preferred Shortlist Delivery Channel
                      </label>
                      <select
                        value={editClientChannel}
                        onChange={(e) => setEditClientChannel(e.target.value)}
                        className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/20 px-3.5 py-2.5 text-xs text-ink focus:border-electric focus:bg-white focus:outline-hidden cursor-pointer"
                      >
                        <option value="email">Email Submission Package (PDF &amp; Markdown)</option>
                        <option value="im">Instant Messaging / Slack Connect Channel</option>
                        <option value="client_ats">Client ATS CSV Upload (Workday/Greenhouse)</option>
                        <option value="portal">Dedicated Client Portal</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-mono text-[10.5px] font-bold text-ink block">
                        Engagement Terms &amp; Operational Notes
                      </label>
                      <textarea
                        rows={3}
                        value={editClientNotes}
                        onChange={(e) => setEditClientNotes(e.target.value)}
                        className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/20 p-3 text-xs text-ink focus:border-electric focus:bg-white focus:outline-hidden leading-relaxed font-sans"
                      />
                    </div>

                    {/* Primary Contact Editing */}
                    <div className="rounded-2xl border border-[#bcd6fa]/70 bg-canvas/30 p-4 space-y-3">
                      <span className="font-mono text-[10.5px] font-bold uppercase tracking-wider text-electric block">
                        Primary Key Contact Details
                      </span>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="font-mono text-[10px] text-mist block mb-1">
                            Contact Name
                          </label>
                          <input
                            type="text"
                            value={editContactName}
                            onChange={(e) => setEditContactName(e.target.value)}
                            className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 text-xs text-ink focus:border-electric focus:outline-hidden"
                          />
                        </div>

                        <div>
                          <label className="font-mono text-[10px] text-mist block mb-1">
                            Email Address
                          </label>
                          <input
                            type="email"
                            value={editContactEmail}
                            onChange={(e) => setEditContactEmail(e.target.value)}
                            className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 text-xs text-ink focus:border-electric focus:outline-hidden"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="font-mono text-[10px] text-mist block mb-1">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            value={editContactPhone}
                            onChange={(e) => setEditContactPhone(e.target.value)}
                            className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 text-xs text-ink focus:border-electric focus:outline-hidden"
                          />
                        </div>

                        <div>
                          <label className="font-mono text-[10px] text-mist block mb-1">
                            Role Title
                          </label>
                          <input
                            type="text"
                            value={editContactRole}
                            onChange={(e) => setEditContactRole(e.target.value)}
                            className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3 py-2 text-xs text-ink focus:border-electric focus:outline-hidden"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 flex justify-end">
                      <button
                        type="submit"
                        disabled={isUpdating || !editClientName.trim()}
                        className="rounded-xl bg-ink px-5 py-2.5 font-display text-xs font-bold text-white shadow-xs hover:bg-electric transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        {isUpdating ? "Saving Changes..." : "Save Client Changes"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* Dossier Footer */}
            <div className="p-6 border-t border-[#bcd6fa]/40 bg-canvas/30 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setSelectedClientForDossier(null)}
                className="rounded-xl border border-[#bcd6fa] px-4 py-2 font-display text-xs font-semibold text-ink-soft hover:bg-canvas transition-colors cursor-pointer"
              >
                Close
              </button>

              <Link
                href={
                  role === "admin"
                    ? `/admin/pods-management?client=${encodeURIComponent(selectedClientForDossier.name)}`
                    : `/recruiter/requisitions?client=${encodeURIComponent(selectedClientForDossier.name)}`
                }
                className="rounded-xl bg-ink px-4 py-2 font-display text-xs font-bold text-white shadow-xs hover:bg-electric transition-colors inline-flex items-center gap-1.5"
              >
                <Briefcase size={12} />
                <span>View Linked Requisitions ({selectedClientForDossier.active_requisitions_count || 0})</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
