"use client";

import React, { useState } from "react";
import {
  Users,
  Search,
  ShieldCheck,
  CheckCircle,
  Activity,
  FileText,
  Briefcase,
  Award,
  Zap,
  X,
  Lock,
  Eye,
  Plus,
  Edit,
  Trash2,
  AlertTriangle,
  Ban,
} from "@/components/ui/Icons";
import { AdminUserRecord, AdminRole } from "@/types/admin.types";
import {
  inviteStaffAction,
  updateUserRolesAction,
  updateUserStatusAction,
  getRolesCatalogueAction,
  createRoleAction,
  updateRoleAction,
  deleteRoleAction,
  decommissionUserAction,
  RoleCapabilityItem,
} from "@/actions/admin.actions";


export const ROLE_PERMISSIONS_MAP: Record<
  string,
  { label: string; category: string; clearances: string[]; scope: string }
> = {
  Candidate: {
    label: "Talent Network Candidate",
    category: "Talent Network",
    scope: "Candidate Dashboard (/candidate/*), Applications & CV",
    clearances: [
      "Manage own candidate profile and tech/clinical specialties",
      "Toggle anonymous pitch authorization for recruiters",
      "Browse public job board and apply to sprint requisitions",
      "Inspect own assessment feedback and readiness index",
    ],
  },
  Recruiter: {
    label: "Talent Acquisition Operator",
    category: "Internal Staff",
    scope: "Recruiter Workspace (/recruiter/*), ATS APIs (/api/v1/ats/*)",
    clearances: [
      "Create, edit, and publish enterprise requisitions",
      "Access candidate directory and search vetted talent",
      "Manage 5-Stage ATS pipeline (Move, Advance, Reject)",
      "Schedule sprint technical and behavioral interviews",
      "Assemble and allocate specialists to requisitions",
    ],
  },
  "Technical Validator": {
    label: "Technical Assessment Officer",
    category: "Internal Staff",
    scope: "Staff Workspace (/recruiter/*), Vetting APIs (/api/v1/vetting/*)",
    clearances: [
      "Create, grade, and update candidate technical scorecards",
      "Evaluate coding tests, repo reviews and system design",
      "Override technical vetting scores (Code, Architecture, Tests)",
      "Inspect unmasked candidate repositories and dossiers",
    ],
  },
  "Business Analyst": {
    label: "Discovery & Requisitions Analyst",
    category: "Internal Staff",
    scope: "Staff Workspace (/recruiter/*), Leads APIs (/api/v1/leads/*)",
    clearances: [
      "Draft and document enterprise client discovery records",
      "Author requisition specifications and squad requirements",
      "Review candidate pool availability for enterprise briefs",
      "Inspect hiring velocity benchmarks and calculator telemetry",
    ],
  },
  "Credential Officer": {
    label: "Licensing & Compliance Officer",
    category: "Internal Staff",
    scope: "Staff Workspace (/recruiter/*), Vetting APIs (/api/v1/vetting/*)",
    clearances: [
      "Verify, approve, or reject healthcare state & national licenses",
      "Audit clinical certifications (BLS, ACLS, Board Certs)",
      "Manage automated daily license expiration scan logs",
      "Authorize clinical talent compliance sharecodes",
    ],
  },
  "Super Admin": {
    label: "Executive Platform Administrator",
    category: "Executive Governance",
    scope: "Global Platform Access (/admin/*, Django Admin, All APIs)",
    clearances: [
      "Unrestricted platform administration and system telemetry",
      "Assign, update, and revoke user roles across all personas",
      "Activate, suspend, or decommission platform accounts",
      "Approve double-entry bounty ledger payouts and escrow vault",
      "Inspect audit logs, security policies, and unmask PII",
    ],
  },
  "Platform Administrator": {
    label: "Platform Operations Administrator",
    category: "Platform Governance",
    scope: "Admin Portal (/admin/*), Config Center (/api/v1/config/*)",
    clearances: [
      "Manage user directory, role allocations, and staff invites",
      "Update hiring calculator parameters and pricing tables",
      "Monitor system uptime, telemetry, and delivery velocity",
      "Review platform audit logs and security events",
    ],
  },
};

interface AdminUsersViewProps {
  initialUsers?: AdminUserRecord[];
}

export function AdminUsersView({ initialUsers = [] }: AdminUsersViewProps) {
  const [users, setUsers] = useState<AdminUserRecord[]>(initialUsers);

  React.useEffect(() => {
    setUsers(initialUsers);
  }, [initialUsers]);

  // Roles catalogue state from backend API
  const [rolesCatalogue, setRolesCatalogue] = useState<RoleCapabilityItem[]>([]);
  const [showCreateRoleModal, setShowCreateRoleModal] = useState<boolean>(false);
  const [editingRole, setEditingRole] = useState<RoleCapabilityItem | null>(null);

  // New role creation form state
  const [newRoleName, setNewRoleName] = useState<string>("");
  const [newRoleCode, setNewRoleCode] = useState<string>("");
  const [newRoleCategory, setNewRoleCategory] = useState<string>("Internal Staff");
  const [newRoleScope, setNewRoleScope] = useState<string>("Staff Workspace (/recruiter/*)");
  const [newRoleDescription, setNewRoleDescription] = useState<string>("");
  const [newRoleClearances, setNewRoleClearances] = useState<string[]>([
    "Access assigned workspace modules",
    "Inspect assigned candidate records",
  ]);
  const [newClearanceInput, setNewClearanceInput] = useState<string>("");
  const [isSubmittingNewRole, setIsSubmittingNewRole] = useState<boolean>(false);

  // Role edit form state
  const [editRoleName, setEditRoleName] = useState<string>("");
  const [editRoleCategory, setEditRoleCategory] = useState<string>("Internal Staff");
  const [editRoleScope, setEditRoleScope] = useState<string>("");
  const [editRoleDescription, setEditRoleDescription] = useState<string>("");
  const [editRoleClearances, setEditRoleClearances] = useState<string[]>([]);
  const [editClearanceInput, setEditClearanceInput] = useState<string>("");
  const [isSavingRoleDef, setIsSavingRoleDef] = useState<boolean>(false);

  // Fetch live roles catalogue on mount
  React.useEffect(() => {
    async function loadRoles() {
      const data = await getRolesCatalogueAction();
      if (data && data.length > 0) {
        setRolesCatalogue(data);
      }
    }
    loadRoles();
  }, []);

  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<AdminUserRecord | null>(null);
  const [dossierActiveTab, setDossierActiveTab] = useState<"cv" | "vetting" | "security" | "compliance" | "pod">("cv");
  const [showInviteModal, setShowInviteModal] = useState<boolean>(false);
  const [newUserName, setNewUserName] = useState<string>("");
  const [newUserEmail, setNewUserEmail] = useState<string>("");
  const [newUserRole, setNewUserRole] = useState<AdminRole>("Recruiter");
  const [isSubmittingStaff, setIsSubmittingStaff] = useState<boolean>(false);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  // Role management & account status action states
  const [selectedUserRole, setSelectedUserRole] = useState<AdminRole>("Candidate");
  const [isUpdatingRole, setIsUpdatingRole] = useState<boolean>(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<boolean>(false);

  // Editable vetting score state for selected user
  const [codeQualityScore, setCodeQualityScore] = useState<number>(95);
  const [systemDesignScore, setSystemDesignScore] = useState<number>(92);
  const [testCoverageScore, setTestCoverageScore] = useState<number>(90);
  const [behavioralScore, setBehavioralScore] = useState<number>(95);
  const [validatorNotes, setValidatorNotes] = useState<string>("");

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName.trim()) return;

    setIsSubmittingNewRole(true);
    const res = await createRoleAction({
      name: newRoleName.trim(),
      code: newRoleCode.trim() || undefined,
      category: newRoleCategory.trim(),
      scope: newRoleScope.trim(),
      description: newRoleDescription.trim(),
      permissions: newRoleClearances,
    });
    setIsSubmittingNewRole(false);

    if (res.success && res.data) {
      setRolesCatalogue((prev) => [...prev, res.data!]);
      setShowCreateRoleModal(false);
      setNewRoleName("");
      setNewRoleCode("");
      setNewRoleDescription("");
      setNewRoleClearances(["Access assigned workspace modules"]);
      setActionSuccessMessage(`New platform role group "${res.data.name}" provisioned successfully.`);
      setTimeout(() => setActionSuccessMessage(null), 5000);
    } else {
      setActionSuccessMessage(res.error || "Failed to create new role.");
      setTimeout(() => setActionSuccessMessage(null), 5000);
    }
  };

  const handleOpenEditRole = (roleItem: RoleCapabilityItem) => {
    setEditingRole(roleItem);
    setEditRoleName(roleItem.name);
    setEditRoleCategory(roleItem.category);
    setEditRoleScope(roleItem.scope || "Staff Workspace (/recruiter/*)");
    setEditRoleDescription(roleItem.description);
    setEditRoleClearances([...roleItem.permissions]);
    setEditClearanceInput("");
  };

  const handleSaveRoleDefinition = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRole) return;

    setIsSavingRoleDef(true);
    const res = await updateRoleAction(editingRole.code, {
      name: editRoleName.trim(),
      category: editRoleCategory.trim(),
      scope: editRoleScope.trim(),
      description: editRoleDescription.trim(),
      permissions: editRoleClearances,
    });
    setIsSavingRoleDef(false);

    if (res.success && res.data) {
      const updated = res.data;
      setRolesCatalogue((prev) =>
        prev.map((r) => (r.code === updated.code ? updated : r))
      );
      setEditingRole(null);
      setActionSuccessMessage(`Role clearances for "${updated.name}" updated successfully.`);
      setTimeout(() => setActionSuccessMessage(null), 5000);
    } else {
      setActionSuccessMessage(res.error || "Failed to update role definition.");
      setTimeout(() => setActionSuccessMessage(null), 5000);
    }
  };

  const handleDeleteRole = async (roleCode: string) => {
    if (!confirm(`Are you sure you want to delete role ${roleCode}?`)) return;

    const res = await deleteRoleAction(roleCode);
    if (res.success) {
      setRolesCatalogue((prev) => prev.filter((r) => r.code !== roleCode));
      setActionSuccessMessage(`Role ${roleCode} deleted successfully.`);
      setTimeout(() => setActionSuccessMessage(null), 5000);
    } else {
      setActionSuccessMessage(res.error || "Failed to delete role.");
      setTimeout(() => setActionSuccessMessage(null), 5000);
    }
  };

  const handleOpenDossier = (user: AdminUserRecord) => {
    setSelectedUser(user);
    setSelectedUserRole(user.role);
    setDossierActiveTab("cv");
    const subscores = user.dossier?.vettingSubscores;
    setCodeQualityScore(subscores?.codeQuality ?? 94);
    setSystemDesignScore(subscores?.systemDesign ?? 92);
    setTestCoverageScore(subscores?.testCoverage ?? 90);
    setBehavioralScore(subscores?.behavioral ?? 95);
    setValidatorNotes(user.dossier?.validatorNotes || "");
  };

  const handleSaveRole = async () => {
    if (!selectedUser) return;
    setIsUpdatingRole(true);
    const userId = selectedUser.raw_id || selectedUser.id;
    const res = await updateUserRolesAction(userId, [selectedUserRole]);
    setIsUpdatingRole(false);

    if (res.success) {
      const updatedRole = selectedUserRole;
      setSelectedUser((prev) => (prev ? { ...prev, role: updatedRole } : null));
      setUsers((prev) =>
        prev.map((u) =>
          u.id === selectedUser.id || (u.raw_id && u.raw_id === selectedUser.raw_id)
            ? { ...u, role: updatedRole }
            : u
        )
      );
      setActionSuccessMessage(
        `Role clearance for ${selectedUser.fullName} updated to ${updatedRole}.`
      );
      setTimeout(() => setActionSuccessMessage(null), 5000);
    } else {
      setActionSuccessMessage(res.error || "Failed to update user role.");
      setTimeout(() => setActionSuccessMessage(null), 5000);
    }
  };

  const handleToggleUserStatus = async () => {
    if (!selectedUser) return;
    setIsUpdatingStatus(true);
    const userId = selectedUser.raw_id || selectedUser.id;
    const nextStatus: "active" | "suspended" =
      selectedUser.status === "Active" ? "suspended" : "active";
    const res = await updateUserStatusAction(userId, nextStatus);
    setIsUpdatingStatus(false);

    if (res.success) {
      const displayStatus = nextStatus === "active" ? "Active" : "Suspended";
      setSelectedUser((prev) => (prev ? { ...prev, status: displayStatus } : null));
      setUsers((prev) =>
        prev.map((u) =>
          u.id === selectedUser.id || (u.raw_id && u.raw_id === selectedUser.raw_id)
            ? { ...u, status: displayStatus }
            : u
        )
      );
      setActionSuccessMessage(
        `User account status for ${selectedUser.fullName} set to ${displayStatus}.`
      );
      setTimeout(() => setActionSuccessMessage(null), 5000);
    } else {
      setActionSuccessMessage(res.error || "Failed to update account status.");
      setTimeout(() => setActionSuccessMessage(null), 5000);
    }
  };

  const [isDecommissioning, setIsDecommissioning] = useState<boolean>(false);
  const [decommissionTarget, setDecommissionTarget] = useState<AdminUserRecord | null>(null);
  const [decommissionReason, setDecommissionReason] = useState<string>("");
  const [decommissionConfirmedPolicy, setDecommissionConfirmedPolicy] = useState<boolean>(false);
  const [showDecommissionSheet, setShowDecommissionSheet] = useState<boolean>(false);

  const handleRowToggleStatus = async (user: AdminUserRecord, e: React.MouseEvent) => {
    e.stopPropagation();
    const userId = user.raw_id || user.id;
    const nextStatus: "active" | "suspended" = user.status === "Active" ? "suspended" : "active";
    const res = await updateUserStatusAction(userId, nextStatus);

    if (res.success) {
      const displayStatus = nextStatus === "active" ? "Active" : "Suspended";
      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id || (u.raw_id && u.raw_id === user.raw_id)
            ? { ...u, status: displayStatus }
            : u
        )
      );
      if (selectedUser && (selectedUser.id === user.id || selectedUser.raw_id === user.raw_id)) {
        setSelectedUser((prev) => (prev ? { ...prev, status: displayStatus } : null));
      }
      setActionSuccessMessage(`Account for ${user.fullName} status set to ${displayStatus}.`);
      setTimeout(() => setActionSuccessMessage(null), 5000);
    } else {
      setActionSuccessMessage(res.error || "Failed to update account status.");
      setTimeout(() => setActionSuccessMessage(null), 5000);
    }
  };

  const handleOpenDecommission = (user: AdminUserRecord, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setDecommissionTarget(user);
    setDecommissionReason("");
    setDecommissionConfirmedPolicy(false);
    setShowDecommissionSheet(true);
  };

  const handleConfirmDecommission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!decommissionTarget) return;

    setIsDecommissioning(true);
    const userId = decommissionTarget.raw_id || decommissionTarget.id;
    const res = await decommissionUserAction(
      userId,
      decommissionReason.trim() || "Administrative account decommission"
    );
    setIsDecommissioning(false);

    if (res.success) {
      setUsers((prev) =>
        prev.filter((u) => u.id !== decommissionTarget.id && u.raw_id !== decommissionTarget.raw_id)
      );
      if (
        selectedUser &&
        (selectedUser.id === decommissionTarget.id || selectedUser.raw_id === decommissionTarget.raw_id)
      ) {
        setSelectedUser(null);
      }
      setShowDecommissionSheet(false);
      setDecommissionTarget(null);
      setActionSuccessMessage(
        `User account for ${decommissionTarget.fullName} permanently decommissioned and sessions revoked.`
      );
      setTimeout(() => setActionSuccessMessage(null), 5000);
    } else {
      setActionSuccessMessage(res.error || "Failed to decommission user account.");
      setTimeout(() => setActionSuccessMessage(null), 5000);
    }
  };


  const filteredUsers = users.filter((user) => {
    const userRole = (user.role || "").toLowerCase();
    const matchesRole =
      roleFilter === "all" ||
      (roleFilter === "candidate" && userRole === "candidate") ||
      (roleFilter === "recruiter" && userRole === "recruiter") ||
      (roleFilter === "validator" && (userRole.includes("validator") || userRole.includes("analyst") || userRole.includes("officer"))) ||
      (roleFilter === "admin" && (userRole.includes("admin") || userRole.includes("super")));

    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      user.fullName.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.id.toLowerCase().includes(query);

    return matchesRole && matchesSearch;
  });

  const handleUpdateVettingScores = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    const newOverallScore = Math.round(
      (codeQualityScore + systemDesignScore + testCoverageScore + behavioralScore) / 4
    );

    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === selectedUser.id && u.dossier) {
          const updatedDossier = {
            ...u.dossier,
            vettingSubscores: {
              codeQuality: codeQualityScore,
              systemDesign: systemDesignScore,
              testCoverage: testCoverageScore,
              behavioral: behavioralScore,
            },
            validatorNotes,
          };
          return {
            ...u,
            vettingScore: newOverallScore,
            dossier: updatedDossier,
          };
        }
        return u;
      })
    );

    setActionSuccessMessage(
      `Vetting score for ${selectedUser.fullName} updated to ${newOverallScore}/100 and logged to audit trail.`
    );
    setTimeout(() => setActionSuccessMessage(null), 4000);
  };

  const handleCreateStaffUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;

    setIsSubmittingStaff(true);
    const res = await inviteStaffAction({
      email: newUserEmail.trim(),
      full_name: newUserName.trim(),
      role: newUserRole,
    });
    setIsSubmittingStaff(false);

    if (res.success && res.data) {
      const newStaff: AdminUserRecord = {
        id: res.data.id || `USR-${Math.floor(1000 + Math.random() * 9000)}`,
        fullName: res.data.fullName || newUserName.trim(),
        email: res.data.email || newUserEmail.trim(),
        role: res.data.role || newUserRole,
        status: "Active",
        sector: "Technology & SDLC",
        joinedDate: "Today",
        lastActive: "Just now",
        assignedPodsCount: 0,
      };

      setUsers([newStaff, ...users]);
      setShowInviteModal(false);
      setNewUserName("");
      setNewUserEmail("");
      setActionSuccessMessage(
        `Staff access provisioned for ${newStaff.fullName} (${newStaff.role}). Onboarding email dispatched via SMTP to ${newStaff.email}.`
      );
      setTimeout(() => setActionSuccessMessage(null), 5000);
    } else {
      setActionSuccessMessage(res.error || "Failed to dispatch staff invitation.");
      setTimeout(() => setActionSuccessMessage(null), 5000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-electric/30 bg-electric/10 px-3 py-0.5 text-xs font-semibold text-electric">
            <Users size={13} />
            <span>ROLE-BASED ACCESS CONTROL (RBAC) &amp; DOSSIERS</span>
          </div>
          <h1 className="mt-2 font-display text-2xl font-bold text-ink">User Directory &amp; RBAC Control</h1>
          <p className="text-xs text-ink-soft">
            Manage candidates, recruiters, and platform administrators. Inspect unmasked candidate dossiers and update technical vetting scorecards.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowInviteModal(true)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-ink px-4 py-2.5 font-display text-xs font-semibold text-white shadow-xs hover:bg-electric active:scale-[0.98] transition-all whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Plus size={14} strokeWidth={2.5} />
          <span>Invite Staff</span>
        </button>
      </div>

      {/* Action Notification Alert */}
      {actionSuccessMessage && (
        <div className="rounded-xl border border-signal/30 bg-signal/10 px-4 py-3 text-xs font-semibold text-signal flex items-center gap-2 animate-in fade-in-0 duration-200">
          <CheckCircle size={16} />
          <span>{actionSuccessMessage}</span>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-[#bcd6fa] bg-white p-3 shadow-xs">
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {[
            { id: "all", label: "All Users" },
            { id: "candidate", label: "Candidates" },
            { id: "recruiter", label: "Recruiters" },
            { id: "validator", label: "Validators" },
            { id: "admin", label: "Super Admins" },
            { id: "roles_matrix", label: "Roles & Permissions Matrix" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setRoleFilter(tab.id)}
              className={`rounded-xl px-3 py-1.5 font-mono text-xs font-semibold transition-all cursor-pointer ${
                roleFilter === tab.id
                  ? "bg-ink text-white shadow-xs"
                  : "text-ink-soft hover:bg-canvas hover:text-ink"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search size={14} className="absolute left-3 top-2.5 text-mist" />
          <input
            type="text"
            placeholder="Search by name, email, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/30 pl-9 pr-3 py-1.5 text-xs text-ink placeholder-mist focus:border-electric focus:bg-white focus:outline-none"
          />
        </div>
      </div>

      {roleFilter === "roles_matrix" ? (
        /* Roles & Permissions Matrix View */
        <div className="space-y-4">
          <div className="rounded-2xl border border-electric/30 bg-electric/5 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="font-display font-bold text-sm text-ink flex items-center gap-2">
                <ShieldCheck size={16} className="text-electric" />
                <span>Enterprise RBAC Roles &amp; Capabilities Catalogue</span>
              </div>
              <p className="text-xs text-ink-soft mt-0.5">
                Configure platform roles, define what each staff member can do, and manage route permissions.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold text-electric bg-white px-3 py-1 rounded-xl border border-electric/30 shadow-2xs">
                {users.length} Total Accounts
              </span>
              <button
                type="button"
                onClick={() => setShowCreateRoleModal(true)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-ink px-3.5 py-1.5 font-display text-xs font-bold text-white shadow-xs hover:bg-electric active:scale-[0.98] transition-all cursor-pointer"
              >
                <Plus size={13} strokeWidth={2.5} />
                <span>Create Role Group</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(rolesCatalogue.length > 0 ? rolesCatalogue : Object.entries(ROLE_PERMISSIONS_MAP).map(([k, v]) => ({
              code: k.toUpperCase().replace(/\s+/g, "_"),
              name: k,
              category: v.category,
              description: "Standard platform role definition with configured clearances.",
              scope: v.scope,
              permissions: v.clearances,
              member_count: 0,
              is_system_role: true,
            }))).map((roleItem) => {
              const membersCount = users.filter((u) => {
                const r = (u.role || "").toLowerCase();
                return r === roleItem.name.toLowerCase() || r === roleItem.code.toLowerCase();
              }).length;

              return (
                <div
                  key={roleItem.code}
                  className="rounded-2xl border border-[#bcd6fa]/60 bg-white p-5 shadow-xs flex flex-col justify-between hover:border-electric/50 transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[10px] font-bold text-mist uppercase tracking-wider block">
                            {roleItem.category}
                          </span>
                          {roleItem.is_system_role && (
                            <span className="font-mono text-[9px] bg-canvas text-mist px-1.5 py-0.2 rounded font-semibold">
                              System Core
                            </span>
                          )}
                        </div>
                        <h3 className="font-display font-bold text-base text-ink mt-0.5">{roleItem.name}</h3>
                        <span className="font-mono text-[10px] text-ink-soft">{roleItem.code}</span>
                      </div>
                      <span className="rounded-full bg-canvas border border-[#bcd6fa]/60 px-2.5 py-0.5 font-mono text-[11px] font-bold text-ink-soft">
                        {membersCount} {membersCount === 1 ? "User" : "Users"}
                      </span>
                    </div>

                    <p className="text-xs text-ink-soft leading-relaxed line-clamp-2">
                      {roleItem.description || "Platform access role with configured route authorizations."}
                    </p>

                    <div className="rounded-xl border border-canvas bg-canvas/40 p-2.5">
                      <span className="font-mono text-[10px] font-bold text-electric uppercase tracking-wider block mb-0.5">
                        Protected Scope
                      </span>
                      <p className="font-mono text-[11px] text-ink-soft leading-snug">
                        {roleItem.scope || "Staff Workspace (/recruiter/*)"}
                      </p>
                    </div>

                    <div>
                      <span className="font-mono text-[10px] font-bold text-mist uppercase tracking-wider block mb-1.5">
                        Granted Clearances ({roleItem.permissions.length})
                      </span>
                      <ul className="space-y-1.5 text-xs text-ink">
                        {roleItem.permissions.map((c, i) => (
                          <li key={i} className="flex items-start gap-2 text-[11px] leading-tight">
                            <CheckCircle size={13} className="text-signal shrink-0 mt-0.5" />
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#bcd6fa]/30 mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEditRole(roleItem)}
                        className="inline-flex items-center gap-1 font-mono text-xs font-semibold text-ink-soft hover:text-electric transition-colors cursor-pointer"
                      >
                        <Edit size={12} />
                        <span>Edit Clearances</span>
                      </button>
                      {!roleItem.is_system_role && (
                        <button
                          type="button"
                          onClick={() => handleDeleteRole(roleItem.code)}
                          className="inline-flex items-center gap-1 font-mono text-xs font-semibold text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                        >
                          <Trash2 size={12} />
                          <span>Delete</span>
                        </button>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const low = roleItem.name.toLowerCase();
                        if (low === "candidate") setRoleFilter("candidate");
                        else if (low === "recruiter") setRoleFilter("recruiter");
                        else if (low.includes("validator") || low.includes("analyst") || low.includes("officer")) setRoleFilter("validator");
                        else if (low.includes("admin")) setRoleFilter("admin");
                        else {
                          setSearchQuery(roleItem.name);
                          setRoleFilter("all");
                        }
                      }}
                      className="text-xs font-display font-semibold text-electric hover:underline cursor-pointer"
                    >
                      Filter Directory &rarr;
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Users Table */
        <div className="rounded-2xl border border-[#bcd6fa]/70 bg-white overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="border-b border-[#bcd6fa]/60 bg-slate-50/80 font-mono text-[10px] text-slate-500 uppercase tracking-wider select-none">
                <tr>
                  <th className="px-4 py-2.5 align-middle font-semibold text-slate-600">User</th>
                  <th className="px-3.5 py-2.5 align-middle font-semibold text-slate-600 whitespace-nowrap w-[135px]">Account ID</th>
                  <th className="px-3.5 py-2.5 align-middle font-semibold text-slate-600 whitespace-nowrap w-[135px]">Platform Role</th>
                  <th className="px-3.5 py-2.5 align-middle font-semibold text-slate-600 whitespace-nowrap w-[95px]">Status</th>
                  <th className="px-3.5 py-2.5 align-middle font-semibold text-slate-600 whitespace-nowrap w-[110px]">Date Registered</th>
                  <th className="px-4 py-2.5 align-middle font-semibold text-slate-600 text-right whitespace-nowrap w-[125px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#bcd6fa]/30 text-ink">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-ink-soft">
                      <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-canvas border border-[#bcd6fa]/50 text-mist mb-2">
                        <Users size={18} />
                      </div>
                      <div className="font-display text-xs font-bold text-ink">No Registered Users Found</div>
                      <p className="text-[11px] text-mist mt-0.5 max-w-sm mx-auto">
                        No accounts match the current filter or search criteria.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={`${user.id}-${user.email}`} className="hover:bg-slate-50/70 transition-colors group">
                      <td className="px-4 py-2.5 align-middle">
                        <div className="font-display font-semibold text-[12.5px] text-ink leading-tight">{user.fullName}</div>
                        <div className="font-mono text-[10.5px] text-slate-500 mt-0.5 truncate max-w-[210px]" title={user.email}>
                          {user.email}
                        </div>
                      </td>
                      <td className="px-3.5 py-2.5 align-middle whitespace-nowrap">
                        <span className="font-mono text-[11px] text-slate-600 bg-slate-100/90 px-2 py-0.5 rounded border border-slate-200/80 font-medium inline-block">
                          {user.id}
                        </span>
                      </td>
                      <td className="px-3.5 py-2.5 align-middle whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-0.5 font-mono text-[10px] font-semibold rounded-md border tracking-tight ${
                          user.role === "Candidate"
                            ? "bg-sky-50 text-sky-700 border-sky-200/80"
                            : user.role === "Recruiter"
                            ? "bg-purple-50 text-purple-700 border-purple-200/80"
                            : user.role === "Technical Validator"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200/80"
                            : user.role === "Credential Officer"
                            ? "bg-amber-50 text-amber-700 border-amber-200/80"
                            : user.role === "Platform Administrator" || user.role === "Super Admin"
                            ? "bg-slate-900 text-white border-slate-900"
                            : "bg-slate-100 text-slate-700 border-slate-200"
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-3.5 py-2.5 align-middle whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 font-mono text-[10px] font-medium border ${
                          user.status === "Active"
                            ? "bg-emerald-50/80 text-emerald-700 border-emerald-200/80"
                            : user.status === "Suspended"
                            ? "bg-rose-50/80 text-rose-700 border-rose-200/80"
                            : "bg-slate-100 text-slate-600 border-slate-200"
                        }`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${user.status === "Active" ? "bg-emerald-500" : user.status === "Suspended" ? "bg-rose-500" : "bg-slate-400"}`} />
                          <span>{user.status || "Active"}</span>
                        </span>
                      </td>
                      <td className="px-3.5 py-2.5 align-middle font-mono text-[11px] text-slate-500 whitespace-nowrap">
                        {user.joinedDate || "Oct 2026"}
                      </td>
                      <td className="px-4 py-2.5 text-right align-middle whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenDossier(user)}
                            title="View Dossier & Clearances"
                            aria-label="View Dossier"
                            className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 hover:text-ink hover:border-slate-300 hover:bg-slate-50 active:scale-95 transition-all cursor-pointer shadow-2xs"
                          >
                            <Eye size={13} strokeWidth={1.75} />
                          </button>

                          <button
                            type="button"
                            onClick={(e) => handleRowToggleStatus(user, e)}
                            title={user.status === "Active" ? "Suspend Account" : "Activate Account"}
                            aria-label={user.status === "Active" ? "Suspend Account" : "Activate Account"}
                            className={`inline-flex h-7 px-2 items-center justify-center gap-1 rounded-md border text-[10px] font-mono font-medium transition-all cursor-pointer shadow-2xs active:scale-95 ${
                              user.status === "Active"
                                ? "border-amber-200 bg-amber-50/80 text-amber-700 hover:bg-amber-100 hover:border-amber-300"
                                : "border-emerald-200 bg-emerald-50/80 text-emerald-700 hover:bg-emerald-100 hover:border-emerald-300"
                            }`}
                          >
                            {user.status === "Active" ? (
                              <>
                                <Ban size={11} strokeWidth={1.8} />
                                <span>Suspend</span>
                              </>
                            ) : (
                              <>
                                <CheckCircle size={11} strokeWidth={1.8} />
                                <span>Activate</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={(e) => handleOpenDecommission(user, e)}
                            title="Decommission Account (GDPR Scrub)"
                            aria-label="Decommission Account"
                            className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-rose-200 bg-rose-50/60 text-rose-600 hover:bg-rose-100 hover:text-rose-700 hover:border-rose-300 active:scale-95 transition-all cursor-pointer shadow-2xs"
                          >
                            <Trash2 size={12} strokeWidth={1.75} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Candidate / Staff Dossier Slide-Over Sheet */}
      {selectedUser && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-ink/40 backdrop-blur-xs animate-in fade-in-0 duration-150 cursor-pointer"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="w-full md:w-1/2 lg:w-1/2 md:max-w-[50vw] bg-white h-full shadow-2xl p-6 sm:p-8 flex flex-col justify-between overflow-y-auto thin-scrollbar cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-start justify-between border-b border-[#bcd6fa]/40 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-electric whitespace-nowrap">{selectedUser.id}</span>
                    <span className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold whitespace-nowrap ${
                      selectedUser.role === "Candidate"
                        ? "bg-electric/15 text-electric"
                        : selectedUser.role === "Recruiter"
                        ? "bg-purple-100 text-purple-700"
                        : selectedUser.role === "Technical Validator"
                        ? "bg-signal/15 text-signal"
                        : "bg-ink text-white"
                    }`}>
                      {selectedUser.role}
                    </span>
                    <span className="rounded-full bg-canvas border border-[#bcd6fa]/50 px-2 py-0.5 font-mono text-[10px] text-ink-soft whitespace-nowrap">
                      {selectedUser.sector || "Technology & SDLC"}
                    </span>
                  </div>
                  <h2 className="font-display text-xl font-bold text-ink mt-1.5">
                    {selectedUser.fullName}
                  </h2>
                  <p className="text-xs text-ink-soft">{selectedUser.email}</p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedUser(null)}
                  className="rounded-xl p-2 text-ink-soft hover:bg-canvas cursor-pointer"
                  aria-label="Close dossier"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Dossier Tabs Navigation */}
              <div className="flex border-b border-[#bcd6fa]/40 gap-2 pb-2 overflow-x-auto">
                {[
                  { id: "cv", label: selectedUser.role === "Candidate" ? "CV & Experience" : "Staff Dossier" },
                  ...(selectedUser.role === "Candidate" ? [{ id: "vetting", label: "Vetting Scores" }] : []),
                  { id: "security", label: "Security & Status" },
                  { id: "compliance", label: "Compliance Docs" },
                  { id: "pod", label: selectedUser.role === "Candidate" ? "Assigned Requisition" : "Requisitions" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setDossierActiveTab(tab.id as any)}
                    className={`rounded-xl px-3 py-1 font-display text-xs font-semibold cursor-pointer transition-all whitespace-nowrap ${
                      dossierActiveTab === tab.id
                        ? "bg-ink text-white shadow-xs"
                        : "text-ink-soft hover:bg-canvas"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab: CV & Experience (or Staff Summary) */}
              {dossierActiveTab === "cv" && (
                <div className="space-y-4 text-xs">
                  <div className="rounded-2xl border border-[#bcd6fa]/60 bg-canvas/30 p-4 space-y-2">
                    <span className="font-mono text-[10px] text-mist uppercase tracking-wider block">
                      {selectedUser.role === "Candidate" ? "Candidate Profile Summary" : "Staff Account Overview"}
                    </span>
                    <p className="text-ink leading-relaxed">
                      {selectedUser.dossier?.summary || `Account verified on platform. Current authorization status: ${selectedUser.status}.`}
                    </p>
                  </div>

                  {/* Skills / Competencies */}
                  <div>
                    <span className="font-mono text-[10px] text-mist uppercase tracking-wider block mb-2">
                      {selectedUser.role === "Candidate" ? "Verified Technical Competencies" : "Operational Skills"}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {(selectedUser.dossier?.skills && selectedUser.dossier.skills.length > 0
                        ? selectedUser.dossier.skills
                        : ["Verified Platform Member", "Standard RBAC Access"]
                      ).map((sk) => (
                        <span
                          key={sk}
                          className="rounded-lg border border-[#bcd6fa]/60 bg-canvas px-2.5 py-1 font-mono text-xs font-medium text-ink"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Work History */}
                  <div>
                    <span className="font-mono text-[10px] text-mist uppercase tracking-wider block mb-2">
                      Experience History
                    </span>
                    <div className="space-y-2">
                      {(selectedUser.dossier?.workHistory && selectedUser.dossier.workHistory.length > 0
                        ? selectedUser.dossier.workHistory
                        : [
                            {
                              company: "Pepoltek Platform",
                              role: selectedUser.role,
                              period: `${selectedUser.joinedDate || "Oct 2026"} to Present`,
                              highlights: ["Authenticated platform participant", "Active verified status"],
                            },
                          ]
                      ).map((wh, idx) => (
                        <div key={idx} className="rounded-xl border border-[#bcd6fa]/40 bg-white p-3 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-ink">{wh.role}</span>
                            <span className="font-mono text-[10px] text-mist">{wh.period}</span>
                          </div>
                          <div className="text-xs text-electric font-semibold">{wh.company}</div>
                          {wh.highlights && wh.highlights.length > 0 && (
                            <ul className="list-disc list-inside text-ink-soft space-y-0.5 text-[11px] pt-1">
                              {wh.highlights.map((hl, hIdx) => (
                                <li key={hIdx}>{hl}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Education */}
                  {selectedUser.dossier?.education && (
                    <div className="rounded-xl border border-[#bcd6fa]/40 bg-canvas/20 p-3">
                      <span className="font-mono text-[10px] text-mist uppercase tracking-wider block mb-1">
                        Accreditation / Education
                      </span>
                      <p className="text-xs font-medium text-ink">{selectedUser.dossier.education}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Tab: Vetting Scorecard Editor (Candidates Only) */}
              {dossierActiveTab === "vetting" && selectedUser.role === "Candidate" && (
                <form onSubmit={handleUpdateVettingScores} className="space-y-4 text-xs">
                  <div className="rounded-2xl border border-electric/30 bg-electric/5 p-4 space-y-2">
                    <span className="font-mono text-[10px] text-electric uppercase font-bold">
                      Technical Validation Council Override
                    </span>
                    <p className="text-ink-soft text-xs leading-relaxed">
                      Adjust benchmark scores based on candidate live coding evaluations or clinical panel feedback.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-mono text-[11px] font-semibold text-ink block mb-1">
                        Code Quality Score (0 to 100)
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={codeQualityScore}
                        onChange={(e) => setCodeQualityScore(Number(e.target.value))}
                        className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/30 px-3 py-2 text-xs text-ink font-bold focus:border-electric focus:bg-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="font-mono text-[11px] font-semibold text-ink block mb-1">
                        System Architecture Score (0 to 100)
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={systemDesignScore}
                        onChange={(e) => setSystemDesignScore(Number(e.target.value))}
                        className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/30 px-3 py-2 text-xs text-ink font-bold focus:border-electric focus:bg-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="font-mono text-[11px] font-semibold text-ink block mb-1">
                        Test Coverage Benchmarking (0 to 100)
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={testCoverageScore}
                        onChange={(e) => setTestCoverageScore(Number(e.target.value))}
                        className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/30 px-3 py-2 text-xs text-ink font-bold focus:border-electric focus:bg-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="font-mono text-[11px] font-semibold text-ink block mb-1">
                        Behavioral / Communication (0 to 100)
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={behavioralScore}
                        onChange={(e) => setBehavioralScore(Number(e.target.value))}
                        className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/30 px-3 py-2 text-xs text-ink font-bold focus:border-electric focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-mono text-[11px] font-semibold text-ink block mb-1">
                      Validator Council Audit Notes
                    </label>
                    <textarea
                      rows={3}
                      value={validatorNotes}
                      onChange={(e) => setValidatorNotes(e.target.value)}
                      placeholder="Enter qualitative assessor notes regarding code efficiency, architectural reasoning, and communication..."
                      className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/30 px-3 py-2 text-xs text-ink focus:border-electric focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      className="rounded-xl bg-electric px-5 py-2 font-display text-xs font-bold text-white hover:bg-electric-bright cursor-pointer shadow-xs"
                    >
                      Save Vetting Scores
                    </button>
                  </div>
                </form>
              )}

              {/* Tab: Security & Access Status */}
              {dossierActiveTab === "security" && (
                <div className="space-y-4 text-xs">
                  <div className="rounded-2xl border border-electric/30 bg-electric/5 p-4 space-y-1">
                    <span className="font-mono text-[10px] text-electric uppercase font-bold">
                      Platform Security &amp; Access Clearance
                    </span>
                    <p className="text-ink-soft text-xs leading-relaxed">
                      Real-time identity verification, MFA status, authentication provider, and role permission assignments.
                    </p>
                  </div>

                  {/* Account Status and Security Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-[#bcd6fa]/40 bg-white p-3.5 space-y-2">
                      <span className="font-mono text-[10px] text-mist uppercase tracking-wider block">Account Status</span>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`h-2.5 w-2.5 rounded-full ${selectedUser.status === "Active" ? "bg-signal" : "bg-red-500"}`} />
                          <span className="font-bold text-ink text-sm">{selectedUser.status}</span>
                        </div>
                        <button
                          type="button"
                          onClick={handleToggleUserStatus}
                          disabled={isUpdatingStatus}
                          className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all cursor-pointer ${
                            selectedUser.status === "Active"
                              ? "border border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                              : "border border-signal/40 bg-signal/10 text-signal hover:bg-signal/20"
                          }`}
                        >
                          {isUpdatingStatus ? "Updating..." : selectedUser.status === "Active" ? "Suspend" : "Activate"}
                        </button>
                      </div>
                    </div>

                    <div className="rounded-xl border border-[#bcd6fa]/40 bg-white p-3.5 space-y-1">
                      <span className="font-mono text-[10px] text-mist uppercase tracking-wider block">MFA Protection</span>
                      <div className="flex items-center gap-1.5 pt-0.5">
                        <Lock size={13} className="text-electric" />
                        <span className="font-bold text-ink text-sm">
                          {selectedUser.role === "Super Admin" ? "Enforced & Active" : "Standard Policy"}
                        </span>
                      </div>
                    </div>

                    <div className="rounded-xl border border-[#bcd6fa]/40 bg-white p-3.5 space-y-1">
                      <span className="font-mono text-[10px] text-mist uppercase tracking-wider block">Password Cryptography</span>
                      <span className="font-mono text-xs font-semibold text-ink">Argon2 (Zero Plaintext)</span>
                    </div>

                    <div className="rounded-xl border border-[#bcd6fa]/40 bg-white p-3.5 space-y-1">
                      <span className="font-mono text-[10px] text-mist uppercase tracking-wider block">Last Active</span>
                      <span className="font-mono text-xs font-semibold text-ink">{selectedUser.lastActive || "Recently"}</span>
                    </div>
                  </div>

                  {/* Role Assignment & Clearances Editor */}
                  <div className="rounded-2xl border border-[#bcd6fa]/60 bg-white p-4 space-y-3 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-mono text-[10px] font-bold text-electric uppercase tracking-wider block">
                          Assigned Platform Role &amp; Clearances
                        </span>
                        <div className="text-xs font-bold text-ink mt-0.5">
                          Change Role Clearances for {selectedUser.fullName}
                        </div>
                      </div>
                      <span className={`whitespace-nowrap inline-flex items-center px-2.5 py-0.5 font-mono text-[10px] font-bold rounded-full ${
                        selectedUser.role === "Candidate"
                          ? "bg-electric/15 text-electric"
                          : selectedUser.role === "Recruiter"
                          ? "bg-purple-100 text-purple-700"
                          : selectedUser.role === "Technical Validator"
                          ? "bg-signal/15 text-signal"
                          : "bg-ink text-white"
                      }`}>
                        Current: {selectedUser.role}
                      </span>
                    </div>

                    {/* Dynamic Role Selection & Preview */}
                    {(() => {
                      const dynamicRoleOptions = rolesCatalogue.length > 0
                        ? rolesCatalogue.map((r) => ({ name: r.name, code: r.code, category: r.category, scope: r.scope, clearances: r.permissions }))
                        : Object.entries(ROLE_PERMISSIONS_MAP).map(([k, v]) => ({ name: k, code: k.toUpperCase().replace(/\s+/g, '_'), category: v.category, scope: v.scope, clearances: v.clearances }));

                      const currentRoleInfo = dynamicRoleOptions.find(
                        (r) => r.name === selectedUserRole || r.code === selectedUserRole || r.name.toLowerCase() === (selectedUserRole || '').toLowerCase()
                      ) || (ROLE_PERMISSIONS_MAP[selectedUserRole] ? {
                        name: selectedUserRole,
                        category: ROLE_PERMISSIONS_MAP[selectedUserRole].category,
                        scope: ROLE_PERMISSIONS_MAP[selectedUserRole].scope,
                        clearances: ROLE_PERMISSIONS_MAP[selectedUserRole].clearances,
                      } : null);

                      return (
                        <>
                          <div className="flex items-center gap-2">
                            <select
                              value={selectedUserRole}
                              onChange={(e) => setSelectedUserRole(e.target.value as AdminRole)}
                              className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/30 px-3 py-2 text-xs font-semibold text-ink focus:border-electric focus:bg-white focus:outline-none"
                            >
                              {dynamicRoleOptions.map((r) => (
                                <option key={r.code} value={r.name}>
                                  {r.name} ({r.category})
                                </option>
                              ))}
                            </select>

                            <button
                              type="button"
                              onClick={handleSaveRole}
                              disabled={isUpdatingRole || selectedUserRole === selectedUser.role}
                              className={`rounded-xl px-4 py-2 font-display text-xs font-bold whitespace-nowrap transition-all cursor-pointer shadow-xs ${
                                selectedUserRole === selectedUser.role
                                  ? "bg-canvas text-mist cursor-not-allowed border border-slate-200"
                                  : "bg-ink text-white hover:bg-electric"
                              }`}
                            >
                              {isUpdatingRole ? "Saving..." : "Update Role"}
                            </button>
                          </div>

                          {/* Dynamic Permissions Preview for the selected role */}
                          {currentRoleInfo && (
                            <div className="rounded-xl border border-canvas bg-canvas/30 p-3 space-y-2 mt-2">
                              <div className="flex items-center justify-between">
                                <span className="font-mono text-[10px] font-bold text-mist uppercase tracking-wider">
                                  Granted Permissions &amp; Route Clearances
                                </span>
                                <span className="font-mono text-[10px] text-electric">
                                  {currentRoleInfo.scope}
                                </span>
                              </div>
                              <ul className="space-y-1 text-xs text-ink">
                                {currentRoleInfo.clearances.map((c: string, i: number) => (
                                  <li key={i} className="flex items-center gap-2 text-[11px]">
                                    <CheckCircle size={12} className="text-signal shrink-0" />
                                    <span>{c}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>


                  {/* Danger Zone: Account Decommission & Session Revocation */}
                  <div className="rounded-2xl border border-red-200 bg-red-50/40 p-4 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-mono text-[10px] font-bold text-red-700 uppercase tracking-wider block">
                          Danger Zone: Account Decommission
                        </span>
                        <div className="text-xs font-bold text-ink mt-0.5">
                          Permanently decommission account and scrub PII
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleOpenDecommission(selectedUser)}
                        className="rounded-xl border border-red-300 bg-white px-3.5 py-1.5 font-display text-xs font-bold text-red-600 hover:bg-red-600 hover:text-white transition-all cursor-pointer shadow-2xs"
                      >
                        Decommission Account...
                      </button>
                    </div>
                    <p className="text-[11px] text-red-600/90 leading-relaxed">
                      Revokes all active JWT tokens and sessions immediately, anonymizes identifying information under GDPR compliance, and freezes platform access.
                    </p>
                  </div>
                </div>
              )}


              {/* Tab: Compliance Docs */}
              {dossierActiveTab === "compliance" && (
                <div className="space-y-4 text-xs">
                  <div className="rounded-2xl border border-signal/30 bg-signal/5 p-4 space-y-1">
                    <span className="font-mono text-[10px] text-signal uppercase font-bold">
                      Compliance & Legal Certifications
                    </span>
                    <p className="text-ink-soft text-xs leading-relaxed">
                      Identity documentation, Right to Work sharecodes, and mandatory operational agreements.
                    </p>
                  </div>

                  <div className="space-y-2">
                    {(selectedUser.dossier?.complianceCertifications && selectedUser.dossier.complianceCertifications.length > 0
                      ? selectedUser.dossier.complianceCertifications
                      : [
                          { name: "Identity & Right to Work Digital ShareCode", status: "Verified" as const, date: selectedUser.joinedDate || "Oct 2026" },
                          { name: "Enterprise IP & Proprietary Assignment", status: "Verified" as const, date: selectedUser.joinedDate || "Oct 2026" },
                          { name: "Non-Disclosure Agreement (NDA)", status: "Verified" as const, date: selectedUser.joinedDate || "Oct 2026" },
                        ]
                    ).map((cert, idx) => (
                      <div key={idx} className="flex items-center justify-between rounded-xl border border-[#bcd6fa]/40 bg-white p-3">
                        <div className="space-y-0.5">
                          <div className="font-bold text-ink">{cert.name}</div>
                          <div className="font-mono text-[10px] text-mist">Verified Date: {cert.date}</div>
                        </div>
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold ${
                          cert.status === "Verified" ? "bg-signal/15 text-signal" : "bg-purple-100 text-purple-700"
                        }`}>
                          {cert.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab: Assigned Requisition */}
              {dossierActiveTab === "pod" && (
                <div className="space-y-4 text-xs">
                  <div className="rounded-2xl border border-[#bcd6fa]/60 bg-canvas/30 p-4 space-y-2">
                    <span className="font-mono text-[10px] text-mist uppercase tracking-wider block">
                      Requisition Staffing Status
                    </span>
                    <div className="font-display text-sm font-bold text-ink">
                      {selectedUser.dossier?.currentPod || (selectedUser.role === "Candidate" ? "Available for Placement" : "Internal Platform (Operations)")}
                    </div>
                    <p className="text-xs text-ink-soft">
                      {selectedUser.dossier?.podRole ? `Assigned Role: ${selectedUser.dossier.podRole}` : "Cleared for placement in upcoming client requisitions."}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-[#bcd6fa]/40 bg-white p-3">
                      <span className="font-mono text-[10px] text-mist uppercase block mb-1">Billing Rate</span>
                      <span className="font-bold text-ink font-mono text-sm">{selectedUser.dossier?.hourlyRate || "$85/hr"}</span>
                    </div>
                    <div className="rounded-xl border border-[#bcd6fa]/40 bg-white p-3">
                      <span className="font-mono text-[10px] text-mist uppercase block mb-1">Requisitions Assigned</span>
                      <span className="font-bold text-ink font-mono text-sm">{selectedUser.assignedPodsCount || 0} Requisitions</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-[#bcd6fa]/40 flex items-center justify-between text-xs">
              <span className="text-mist font-mono text-[11px]">User ID: {selectedUser.id}</span>
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="rounded-xl px-4 py-2 font-display text-xs font-semibold text-ink-soft hover:bg-canvas cursor-pointer"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invite Internal Staff Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 backdrop-blur-xs p-4 animate-in fade-in-0 duration-150">
          <div
            className="w-full max-w-md rounded-3xl border border-[#bcd6fa] bg-white p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-[#bcd6fa]/40 pb-3">
              <div>
                <h3 className="font-display text-base font-bold text-ink">Invite Internal Platform Staff</h3>
                <p className="text-xs text-ink-soft">Assign RBAC persona and generate temporary credentials</p>
              </div>
              <button
                type="button"
                onClick={() => setShowInviteModal(false)}
                className="rounded-xl p-1 text-ink-soft hover:bg-canvas cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateStaffUser} className="space-y-3 text-xs">
              <div>
                <label className="font-mono text-[11px] font-semibold text-ink uppercase block mb-1">
                  Staff Full Name
                </label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="e.g. Rachel Sterling"
                  className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/30 px-3.5 py-2 text-xs text-ink focus:border-electric focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="font-mono text-[11px] font-semibold text-ink uppercase block mb-1">
                  Corporate Email
                </label>
                <input
                  type="email"
                  required
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="rachel@pepoltek.com"
                  className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/30 px-3.5 py-2 text-xs text-ink focus:border-electric focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="font-mono text-[11px] font-semibold text-ink uppercase block mb-1">
                  Assigned RBAC Role
                </label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as AdminRole)}
                  className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/30 px-3.5 py-2 text-xs text-ink font-semibold focus:border-electric focus:bg-white focus:outline-none"
                >
                  <option value="Recruiter">Recruiter (Requisition staffing &amp; candidate search)</option>
                  <option value="Technical Validator">Technical Validator (Code grading &amp; vetting)</option>
                  <option value="Super Admin">Super Admin (Global escrow, audit logs &amp; RBAC)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-[#bcd6fa]/40 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="rounded-xl px-4 py-2 font-display text-xs font-semibold text-ink-soft hover:bg-canvas cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingStaff}
                  className="rounded-xl bg-ink px-5 py-2 font-display text-xs font-bold text-white hover:bg-electric transition-all cursor-pointer shadow-xs disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isSubmittingStaff && <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />}
                  <span>{isSubmittingStaff ? "Dispatching Invitation..." : "Confirm & Dispatch Invite"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Custom Role Modal */}
      {showCreateRoleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in-0 duration-200">
          <div className="w-full max-w-lg rounded-3xl border border-[#bcd6fa] bg-white p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#bcd6fa]/40 pb-3">
              <div>
                <h3 className="font-display font-bold text-base text-ink">
                  Create Platform Role Group
                </h3>
                <p className="text-xs text-mist mt-0.5">
                  Define a new staff role, route clearance scope, and granted capabilities.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateRoleModal(false)}
                className="rounded-xl p-1 text-ink-soft hover:bg-canvas cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateRole} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-mono text-[11px] font-semibold text-ink uppercase block mb-1">
                    Role Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newRoleName}
                    onChange={(e) => {
                      setNewRoleName(e.target.value);
                      if (!newRoleCode) {
                        setNewRoleCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "_"));
                      }
                    }}
                    placeholder="e.g. Healthcare Auditor"
                    className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/30 px-3.5 py-2 text-xs text-ink focus:border-electric focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-mono text-[11px] font-semibold text-ink uppercase block mb-1">
                    Unique Code (Identifier)
                  </label>
                  <input
                    type="text"
                    value={newRoleCode}
                    onChange={(e) => setNewRoleCode(e.target.value.toUpperCase())}
                    placeholder="e.g. HEALTHCARE_AUDITOR"
                    className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/30 px-3.5 py-2 text-xs font-mono text-ink focus:border-electric focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-mono text-[11px] font-semibold text-ink uppercase block mb-1">
                    Persona Category
                  </label>
                  <select
                    value={newRoleCategory}
                    onChange={(e) => setNewRoleCategory(e.target.value)}
                    className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/30 px-3.5 py-2 text-xs text-ink font-semibold focus:border-electric focus:bg-white focus:outline-none"
                  >
                    <option value="Internal Staff">Internal Staff (Recruitment &amp; Ops)</option>
                    <option value="Platform Governance">Platform Governance (Admins)</option>
                    <option value="Talent Network">Talent Network (Candidates)</option>
                    <option value="Ecosystem Community">Ecosystem Community (Scouts)</option>
                  </select>
                </div>

                <div>
                  <label className="font-mono text-[11px] font-semibold text-ink uppercase block mb-1">
                    Protected Scope
                  </label>
                  <input
                    type="text"
                    value={newRoleScope}
                    onChange={(e) => setNewRoleScope(e.target.value)}
                    placeholder="e.g. Staff Workspace (/recruiter/*)"
                    className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/30 px-3.5 py-2 text-xs text-ink focus:border-electric focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-mono text-[11px] font-semibold text-ink uppercase block mb-1">
                  Role Description &amp; Responsibilities
                </label>
                <textarea
                  rows={2}
                  value={newRoleDescription}
                  onChange={(e) => setNewRoleDescription(e.target.value)}
                  placeholder="Summarize the core duties, access tier, and operational responsibilities for this role..."
                  className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/30 px-3.5 py-2 text-xs text-ink focus:border-electric focus:bg-white focus:outline-none"
                />
              </div>

              {/* Clearances Configuration */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-mono text-[11px] font-semibold text-ink uppercase block">
                    Granted Clearances ({newRoleClearances.length})
                  </label>
                  <span className="font-mono text-[10px] text-mist">What this staff member can do</span>
                </div>

                <div className="space-y-1.5 max-h-36 overflow-y-auto rounded-xl border border-[#bcd6fa]/50 bg-canvas/20 p-2">
                  {newRoleClearances.map((c, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-[#bcd6fa]/30 text-xs">
                      <div className="flex items-center gap-1.5 text-ink">
                        <CheckCircle size={12} className="text-signal shrink-0" />
                        <span>{c}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setNewRoleClearances(newRoleClearances.filter((_, i) => i !== idx))}
                        className="text-mist hover:text-red-500 cursor-pointer p-0.5"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Quick Add Clearance */}
                <div className="flex items-center gap-1.5 mt-2">
                  <input
                    type="text"
                    value={newClearanceInput}
                    onChange={(e) => setNewClearanceInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        if (newClearanceInput.trim()) {
                          setNewRoleClearances([...newRoleClearances, newClearanceInput.trim()]);
                          setNewClearanceInput("");
                        }
                      }
                    }}
                    placeholder="Type clearance e.g. Audit clinical licensing..."
                    className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3 py-1.5 text-xs text-ink focus:border-electric focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newClearanceInput.trim()) {
                        setNewRoleClearances([...newRoleClearances, newClearanceInput.trim()]);
                        setNewClearanceInput("");
                      }
                    }}
                    className="rounded-xl bg-canvas border border-[#bcd6fa] px-3 py-1.5 font-display text-xs font-semibold text-ink hover:bg-electric hover:text-white cursor-pointer whitespace-nowrap"
                  >
                    + Add
                  </button>
                </div>
              </div>

              <div className="pt-3 border-t border-[#bcd6fa]/40 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateRoleModal(false)}
                  className="rounded-xl px-4 py-2 font-display text-xs font-semibold text-ink-soft hover:bg-canvas cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingNewRole}
                  className="rounded-xl bg-ink px-5 py-2 font-display text-xs font-bold text-white hover:bg-electric transition-all cursor-pointer shadow-xs disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isSubmittingNewRole && <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />}
                  <span>{isSubmittingNewRole ? "Creating Role..." : "Create Role Group"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Role Definition Modal */}
      {editingRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in-0 duration-200">
          <div className="w-full max-w-lg rounded-3xl border border-[#bcd6fa] bg-white p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#bcd6fa]/40 pb-3">
              <div>
                <h3 className="font-display font-bold text-base text-ink">
                  Edit Role Clearances: {editingRole.name}
                </h3>
                <p className="text-xs text-mist mt-0.5">
                  Update permissions and capabilities for {editingRole.code}.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingRole(null)}
                className="rounded-xl p-1 text-ink-soft hover:bg-canvas cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveRoleDefinition} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-mono text-[11px] font-semibold text-ink uppercase block mb-1">
                    Role Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editRoleName}
                    onChange={(e) => setEditRoleName(e.target.value)}
                    className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/30 px-3.5 py-2 text-xs text-ink focus:border-electric focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-mono text-[11px] font-semibold text-ink uppercase block mb-1">
                    Persona Category
                  </label>
                  <select
                    value={editRoleCategory}
                    onChange={(e) => setEditRoleCategory(e.target.value)}
                    className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/30 px-3.5 py-2 text-xs text-ink font-semibold focus:border-electric focus:bg-white focus:outline-none"
                  >
                    <option value="Internal Staff">Internal Staff</option>
                    <option value="Platform Governance">Platform Governance</option>
                    <option value="Talent Network">Talent Network</option>
                    <option value="Ecosystem Community">Ecosystem Community</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-mono text-[11px] font-semibold text-ink uppercase block mb-1">
                  Protected Scope
                </label>
                <input
                  type="text"
                  value={editRoleScope}
                  onChange={(e) => setEditRoleScope(e.target.value)}
                  className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/30 px-3.5 py-2 text-xs text-ink focus:border-electric focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="font-mono text-[11px] font-semibold text-ink uppercase block mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={editRoleDescription}
                  onChange={(e) => setEditRoleDescription(e.target.value)}
                  className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/30 px-3.5 py-2 text-xs text-ink focus:border-electric focus:bg-white focus:outline-none"
                />
              </div>

              {/* Clearances Configuration */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-mono text-[11px] font-semibold text-ink uppercase block">
                    Configured Clearances ({editRoleClearances.length})
                  </label>
                  <span className="font-mono text-[10px] text-mist">Add or revoke clearances</span>
                </div>

                <div className="space-y-1.5 max-h-36 overflow-y-auto rounded-xl border border-[#bcd6fa]/50 bg-canvas/20 p-2">
                  {editRoleClearances.map((c, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-[#bcd6fa]/30 text-xs">
                      <div className="flex items-center gap-1.5 text-ink">
                        <CheckCircle size={12} className="text-signal shrink-0" />
                        <span>{c}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setEditRoleClearances(editRoleClearances.filter((_, i) => i !== idx))}
                        className="text-mist hover:text-red-500 cursor-pointer p-0.5"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add Clearance Input */}
                <div className="flex items-center gap-1.5 mt-2">
                  <input
                    type="text"
                    value={editClearanceInput}
                    onChange={(e) => setEditClearanceInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        if (editClearanceInput.trim()) {
                          setEditRoleClearances([...editRoleClearances, editClearanceInput.trim()]);
                          setEditClearanceInput("");
                        }
                      }
                    }}
                    placeholder="Add clearance e.g. Approve payouts..."
                    className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3 py-1.5 text-xs text-ink focus:border-electric focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (editClearanceInput.trim()) {
                        setEditRoleClearances([...editRoleClearances, editClearanceInput.trim()]);
                        setEditClearanceInput("");
                      }
                    }}
                    className="rounded-xl bg-canvas border border-[#bcd6fa] px-3 py-1.5 font-display text-xs font-semibold text-ink hover:bg-electric hover:text-white cursor-pointer whitespace-nowrap"
                  >
                    + Add
                  </button>
                </div>
              </div>

              <div className="pt-3 border-t border-[#bcd6fa]/40 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingRole(null)}
                  className="rounded-xl px-4 py-2 font-display text-xs font-semibold text-ink-soft hover:bg-canvas cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingRoleDef}
                  className="rounded-xl bg-ink px-5 py-2 font-display text-xs font-bold text-white hover:bg-electric transition-all cursor-pointer shadow-xs disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isSavingRoleDef && <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />}
                  <span>{isSavingRoleDef ? "Saving..." : "Save Role Clearances"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Decommission Account Right-Side Sheet (Dashboard UX & House Style Rule Compliant) */}
      {showDecommissionSheet && decommissionTarget && (

        <div
          className="fixed inset-0 z-50 flex justify-end bg-ink/50 backdrop-blur-xs animate-in fade-in-0 duration-150"
          onClick={() => {
            setShowDecommissionSheet(false);
            setDecommissionTarget(null);
          }}
        >
          <div
            className="w-full max-w-lg bg-white h-full shadow-2xl p-6 sm:p-8 flex flex-col justify-between overflow-y-auto thin-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-6">
              {/* Sheet Header */}
              <div className="flex items-start justify-between border-b border-[#bcd6fa]/40 pb-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-red-300 bg-red-50 px-2.5 py-0.5 text-[10px] font-mono font-bold text-red-700 uppercase tracking-wider">
                    <AlertTriangle size={12} />
                    <span>PERMANENT ACCOUNT DECOMMISSION</span>
                  </div>
                  <h2 className="font-display text-xl font-bold text-ink mt-2">
                    Decommission {decommissionTarget.fullName}
                  </h2>
                  <p className="font-mono text-xs text-mist mt-0.5">
                    {decommissionTarget.id} • {decommissionTarget.email}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowDecommissionSheet(false);
                    setDecommissionTarget(null);
                  }}
                  className="rounded-xl p-2 text-ink-soft hover:bg-canvas cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Security Alert Warning */}
              <div className="rounded-2xl border border-red-200 bg-red-50/70 p-4 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-red-800 font-bold">
                  <AlertTriangle size={16} />
                  <span>High-Privilege Security &amp; Compliance Action</span>
                </div>
                <p className="text-red-700 leading-relaxed text-[11px]">
                  Decommissioning this account immediately revokes all active JWT authentication sessions, blacklists refresh tokens, and pseudonymizes personal identifying information (PII) under GDPR compliance regulations. Historical records in escrow ledgers and audit logs remain intact for statutory retention.
                </p>
              </div>

              {/* User Dossier Summary Card */}
              <div className="rounded-2xl border border-[#bcd6fa]/60 bg-canvas/30 p-4 space-y-2 text-xs">
                <span className="font-mono text-[10px] text-mist uppercase tracking-wider block">
                  Target Account Summary
                </span>
                <div className="flex justify-between py-1 border-b border-[#bcd6fa]/30">
                  <span className="text-ink-soft">Full Name:</span>
                  <span className="font-bold text-ink">{decommissionTarget.fullName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#bcd6fa]/30">
                  <span className="text-ink-soft">Primary Email:</span>
                  <span className="font-mono text-ink">{decommissionTarget.email}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#bcd6fa]/30">
                  <span className="text-ink-soft">Assigned Role:</span>
                  <span className="font-semibold text-ink">{decommissionTarget.role}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-ink-soft">Current Status:</span>
                  <span className="font-bold text-ink">{decommissionTarget.status}</span>
                </div>
              </div>

              {/* Decommission Form */}
              <form id="decommission-form" onSubmit={handleConfirmDecommission} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-mono text-[11px] font-semibold text-ink block">
                    Audit Reason (Required for Compliance Log) *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={decommissionReason}
                    onChange={(e) => setDecommissionReason(e.target.value)}
                    placeholder="e.g. Candidate requested Right-to-be-Forgotten deletion under GDPR Article 17, or staff offboarding."
                    className="w-full rounded-xl border border-red-200 bg-white p-2.5 text-xs text-ink placeholder:text-mist focus:border-red-500 focus:outline-hidden"
                  />
                </div>

                <div className="flex items-start gap-2.5 pt-1">
                  <input
                    type="checkbox"
                    id="confirm-policy-check"
                    checked={decommissionConfirmedPolicy}
                    onChange={(e) => setDecommissionConfirmedPolicy(e.target.checked)}
                    className="mt-0.5 rounded border-red-300 text-red-600 focus:ring-red-500 cursor-pointer"
                  />
                  <label htmlFor="confirm-policy-check" className="font-mono text-[11px] text-ink cursor-pointer leading-tight">
                    I confirm that I have verified administrative authorization to permanently decommission this account and revoke all sessions.
                  </label>
                </div>
              </form>
            </div>

            {/* Sheet Footer */}
            <div className="pt-6 border-t border-[#bcd6fa]/40 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowDecommissionSheet(false);
                  setDecommissionTarget(null);
                }}
                className="rounded-xl px-4 py-2.5 font-display text-xs font-semibold text-ink-soft hover:bg-canvas cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="decommission-form"
                disabled={isDecommissioning || !decommissionConfirmedPolicy || !decommissionReason.trim()}
                className="rounded-xl bg-red-600 px-5 py-2.5 font-display text-xs font-bold text-white hover:bg-red-700 transition-all cursor-pointer shadow-xs disabled:opacity-40 flex items-center gap-1.5"
              >
                {isDecommissioning && <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />}
                <span>{isDecommissioning ? "Decommissioning..." : "Confirm Permanent Decommission"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

