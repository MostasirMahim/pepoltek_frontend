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
} from "@/components/ui/Icons";
import { ADMIN_USERS, AdminUserRecord, AdminRole } from "@/data/adminDashboardData";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUserRecord[]>(ADMIN_USERS);
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<AdminUserRecord | null>(null);
  const [dossierActiveTab, setDossierActiveTab] = useState<"cv" | "vetting" | "compliance" | "pod">("cv");
  const [showInviteModal, setShowInviteModal] = useState<boolean>(false);
  const [newUserName, setNewUserName] = useState<string>("");
  const [newUserEmail, setNewUserEmail] = useState<string>("");
  const [newUserRole, setNewUserRole] = useState<AdminRole>("Recruiter");
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  // Editable vetting score state for selected user
  const [codeQualityScore, setCodeQualityScore] = useState<number>(95);
  const [systemDesignScore, setSystemDesignScore] = useState<number>(92);
  const [testCoverageScore, setTestCoverageScore] = useState<number>(90);
  const [behavioralScore, setBehavioralScore] = useState<number>(95);
  const [validatorNotes, setValidatorNotes] = useState<string>("");

  // When a user is opened in dossier, sync their scores
  const handleOpenDossier = (user: AdminUserRecord) => {
    setSelectedUser(user);
    setDossierActiveTab("cv");
    if (user.dossier) {
      setCodeQualityScore(user.dossier.vettingSubscores.codeQuality);
      setSystemDesignScore(user.dossier.vettingSubscores.systemDesign);
      setTestCoverageScore(user.dossier.vettingSubscores.testCoverage);
      setBehavioralScore(user.dossier.vettingSubscores.behavioral);
      setValidatorNotes(user.dossier.validatorNotes);
    }
  };

  // Filter users based on tab and search
  const filteredUsers = users.filter((user) => {
    const matchesRole =
      roleFilter === "all" ||
      (roleFilter === "candidate" && user.role === "Candidate") ||
      (roleFilter === "recruiter" && user.role === "Recruiter") ||
      (roleFilter === "validator" && user.role === "Technical Validator") ||
      (roleFilter === "admin" && user.role === "Super Admin");

    const matchesSearch =
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.id.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesRole && matchesSearch;
  });

  // Toggle user status
  const handleToggleStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const newStatus = u.status === "Active" ? "Suspended" : "Active";
          setActionSuccessMessage(`User ${u.fullName} (${u.id}) status updated to ${newStatus}.`);
          setTimeout(() => setActionSuccessMessage(null), 3500);
          const updated = { ...u, status: newStatus as "Active" | "Suspended" };
          if (selectedUser && selectedUser.id === userId) {
            setSelectedUser(updated);
          }
          return updated;
        }
        return u;
      })
    );
  };

  // Change user role
  const handleChangeRole = (userId: string, newRole: AdminRole) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          setActionSuccessMessage(`User ${u.fullName} role updated to ${newRole}.`);
          setTimeout(() => setActionSuccessMessage(null), 3500);
          const updated = { ...u, role: newRole };
          if (selectedUser && selectedUser.id === userId) {
            setSelectedUser(updated);
          }
          return updated;
        }
        return u;
      })
    );
  };

  // Save Vetting Score
  const handleSaveVettingScore = () => {
    if (!selectedUser) return;
    const newAverage = Math.round(
      (codeQualityScore + systemDesignScore + testCoverageScore + behavioralScore) / 4
    );

    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === selectedUser.id) {
          const updatedDossier = u.dossier
            ? {
                ...u.dossier,
                vettingSubscores: {
                  codeQuality: codeQualityScore,
                  systemDesign: systemDesignScore,
                  testCoverage: testCoverageScore,
                  behavioral: behavioralScore,
                },
                validatorNotes,
              }
            : undefined;

          const updatedUser: AdminUserRecord = {
            ...u,
            vettingScore: newAverage,
            dossier: updatedDossier,
          };
          setSelectedUser(updatedUser);
          return updatedUser;
        }
        return u;
      })
    );

    setActionSuccessMessage(`Technical Vetting Score updated to ${newAverage} / 100 for ${selectedUser.fullName}.`);
    setTimeout(() => setActionSuccessMessage(null), 4000);
  };

  // Provision new user
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail) return;

    const newUser: AdminUserRecord = {
      id: `USR-${100 + users.length + 1}`,
      fullName: newUserName,
      email: newUserEmail,
      role: newUserRole,
      sector: newUserRole === "Candidate" ? "Technology & SDLC" : "Platform Operations",
      status: "Active",
      joinedDate: "Today",
      lastActive: "Just now",
      assignedPodsCount: 0,
    };

    setUsers([newUser, ...users]);
    setNewUserName("");
    setNewUserEmail("");
    setShowInviteModal(false);
    setActionSuccessMessage(`Successfully provisioned new ${newUserRole}: ${newUser.fullName}.`);
    setTimeout(() => setActionSuccessMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-electric/30 bg-electric/10 px-3 py-0.5 text-xs font-semibold text-electric">
            <Users size={13} />
            <span>ROLE-BASED ACCESS CONTROL (RBAC) GOVERNANCE</span>
          </div>
          <h1 className="mt-2 font-display text-2xl font-bold text-ink">User & Identity Management</h1>
          <p className="text-xs text-ink-soft">
            Manage candidates, view AI-parsed CVs, review technical scores, and configure administrative permissions.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowInviteModal(true)}
          className="rounded-xl bg-ink px-4 py-2.5 font-display text-xs font-semibold text-white shadow-xs hover:bg-electric transition-colors cursor-pointer"
        >
          + Provision Internal Staff
        </button>
      </div>

      {/* Success Notification Banner */}
      {actionSuccessMessage && (
        <div className="rounded-xl border border-signal/30 bg-signal/10 px-4 py-2.5 text-xs font-semibold text-signal flex items-center gap-2 animate-in fade-in-0 duration-200">
          <CheckCircle size={16} />
          <span>{actionSuccessMessage}</span>
        </div>
      )}

      {/* Filters & Search Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Role Tabs */}
        <div className="flex items-center gap-1 rounded-2xl border border-[#bcd6fa] bg-white p-1 text-xs overflow-x-auto">
          <button
            type="button"
            onClick={() => setRoleFilter("all")}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              roleFilter === "all" ? "bg-ink text-white shadow-xs" : "text-ink-soft hover:text-ink"
            }`}
          >
            All Users ({users.length})
          </button>
          <button
            type="button"
            onClick={() => setRoleFilter("candidate")}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              roleFilter === "candidate" ? "bg-ink text-white shadow-xs" : "text-ink-soft hover:text-ink"
            }`}
          >
            Candidates ({users.filter((u) => u.role === "Candidate").length})
          </button>
          <button
            type="button"
            onClick={() => setRoleFilter("recruiter")}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              roleFilter === "recruiter" ? "bg-ink text-white shadow-xs" : "text-ink-soft hover:text-ink"
            }`}
          >
            Recruiters ({users.filter((u) => u.role === "Recruiter").length})
          </button>
          <button
            type="button"
            onClick={() => setRoleFilter("validator")}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              roleFilter === "validator" ? "bg-ink text-white shadow-xs" : "text-ink-soft hover:text-ink"
            }`}
          >
            Validators ({users.filter((u) => u.role === "Technical Validator").length})
          </button>
          <button
            type="button"
            onClick={() => setRoleFilter("admin")}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              roleFilter === "admin" ? "bg-ink text-white shadow-xs" : "text-ink-soft hover:text-ink"
            }`}
          >
            Admins ({users.filter((u) => u.role === "Super Admin").length})
          </button>
        </div>

        {/* Search Box */}
        <div className="relative w-full sm:w-72">
          <Search size={14} className="absolute left-3.5 top-3 text-mist" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, or ID..."
            className="w-full rounded-xl border border-[#bcd6fa] bg-white py-2 pl-9 pr-3 text-xs text-ink placeholder-mist focus:border-electric focus:outline-hidden"
          />
        </div>
      </div>

      {/* Users Master Table */}
      <div className="rounded-2xl border border-[#bcd6fa] bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#bcd6fa]/60 bg-canvas/60 text-ink-soft">
              <tr>
                <th className="py-3 px-4 font-semibold">User Identity</th>
                <th className="py-3 px-4 font-semibold">RBAC Role</th>
                <th className="py-3 px-4 font-semibold">Sector Focus</th>
                <th className="py-3 px-4 font-semibold">Vetting Status</th>
                <th className="py-3 px-4 font-semibold">Account Status</th>
                <th className="py-3 px-4 font-semibold">Last Active</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#bcd6fa]/40">
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-canvas/40 transition-colors group cursor-pointer"
                  onClick={() => handleOpenDossier(user)}
                >
                  {/* User Identity */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-electric to-electric-bright font-display text-xs font-bold text-white shadow-2xs shrink-0">
                        {user.fullName.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <div className="font-semibold text-ink group-hover:text-electric transition-colors flex items-center gap-1.5">
                          <span>{user.fullName}</span>
                          {user.dossier && (
                            <span className="text-[10px] text-electric bg-electric/10 px-1.5 py-0.2 rounded-sm font-medium">
                              CV Ready
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-mist">{user.email} • <span className="font-mono text-[10px] text-electric">{user.id}</span></div>
                      </div>
                    </div>
                  </td>

                  {/* RBAC Role Select */}
                  <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={user.role}
                      onChange={(e) => handleChangeRole(user.id, e.target.value as AdminRole)}
                      className="rounded-lg border border-[#bcd6fa]/80 bg-white px-2 py-1 text-xs font-semibold text-ink focus:border-electric focus:outline-hidden cursor-pointer"
                    >
                      <option value="Candidate">Candidate</option>
                      <option value="Recruiter">Recruiter</option>
                      <option value="Technical Validator">Technical Validator</option>
                      <option value="Super Admin">Super Admin</option>
                    </select>
                  </td>

                  {/* Sector Focus */}
                  <td className="py-3 px-4 text-ink-soft">
                    {user.sector}
                  </td>

                  {/* Vetting Score */}
                  <td className="py-3 px-4">
                    {user.vettingScore ? (
                      <span className={`rounded-full px-2.5 py-0.5 text-[10.5px] font-semibold ${
                        user.vettingScore >= 85 ? "bg-signal/15 text-signal" : "bg-electric/10 text-electric"
                      }`}>
                        {user.vettingScore} / 100 Score
                      </span>
                    ) : (
                      <span className="text-[11px] text-mist">Not applicable</span>
                    )}
                  </td>

                  {/* Account Status Pill */}
                  <td className="py-3 px-4">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10.5px] font-semibold ${
                        user.status === "Active"
                          ? "bg-signal/15 text-signal"
                          : user.status === "Pending Vetting"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>

                  {/* Last Active */}
                  <td className="py-3 px-4 text-mist text-[11px]">
                    {user.lastActive}
                  </td>

                  {/* Actions: Prominent View Dossier & Suspend */}
                  <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenDossier(user)}
                        className="rounded-lg bg-electric/10 px-3 py-1 text-xs font-semibold text-electric hover:bg-electric hover:text-white transition-colors cursor-pointer shadow-2xs"
                      >
                        Inspect Dossier
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(user.id)}
                        className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors cursor-pointer ${
                          user.status === "Active"
                            ? "border border-rose-200 text-rose-600 hover:bg-rose-50"
                            : "border border-signal/40 text-signal hover:bg-signal/10"
                        }`}
                      >
                        {user.status === "Active" ? "Suspend" : "Activate"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-over Talent Dossier & CV Inspector Drawer */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex justify-end bg-ink/40 backdrop-blur-xs animate-in fade-in-0 duration-150">
          <div
            className="w-full max-w-2xl bg-white h-full shadow-2xl overflow-y-auto thin-scrollbar flex flex-col justify-between border-l border-[#bcd6fa]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div>
              <div className="p-6 border-b border-[#bcd6fa]/50 bg-canvas/30 flex items-start justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-gradient-to-tr from-electric to-electric-bright font-display text-lg font-bold text-white shadow-xs shrink-0">
                    {selectedUser.fullName.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-display text-lg font-bold text-ink">{selectedUser.fullName}</h2>
                      <span className="font-mono text-xs font-bold text-electric bg-electric/10 px-2 py-0.5 rounded-md">
                        {selectedUser.id}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                          selectedUser.status === "Active"
                            ? "bg-signal/15 text-signal"
                            : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        {selectedUser.status}
                      </span>
                    </div>
                    <p className="text-xs text-ink-soft mt-0.5">{selectedUser.email} • {selectedUser.sector}</p>
                    <div className="text-[11px] text-mist mt-0.5">
                      Joined: {selectedUser.joinedDate} • Last Active: {selectedUser.lastActive}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedUser(null)}
                  className="rounded-xl p-2 text-ink-soft hover:bg-canvas hover:text-ink transition-colors cursor-pointer"
                  aria-label="Close dossier"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Dossier Quick Telemetry Row */}
              {selectedUser.dossier && (
                <div className="grid grid-cols-4 gap-2 p-4 bg-canvas/60 border-b border-[#bcd6fa]/40 text-center text-xs">
                  <div>
                    <div className="text-[10px] text-mist font-semibold uppercase">Vetting Score</div>
                    <div className="font-display text-base font-bold text-signal">
                      {selectedUser.vettingScore} / 100
                    </div>
                    <div className="text-[10px] text-signal font-semibold">Tier 1 Squad</div>
                  </div>
                  <div className="border-l border-[#bcd6fa]/40">
                    <div className="text-[10px] text-mist font-semibold uppercase">Readiness</div>
                    <div className="font-display text-base font-bold text-electric">
                      {selectedUser.dossier.readinessIndex}%
                    </div>
                    <div className="text-[10px] text-ink-soft">Match Ready</div>
                  </div>
                  <div className="border-l border-[#bcd6fa]/40">
                    <div className="text-[10px] text-mist font-semibold uppercase">ATS Score</div>
                    <div className="font-display text-base font-bold text-ink">
                      {selectedUser.dossier.atsScore}%
                    </div>
                    <div className="text-[10px] text-ink-soft">Top 2% Talent</div>
                  </div>
                  <div className="border-l border-[#bcd6fa]/40">
                    <div className="text-[10px] text-mist font-semibold uppercase">Hourly Rate</div>
                    <div className="font-display text-base font-bold text-ink">
                      {selectedUser.dossier.hourlyRate}
                    </div>
                    <div className="text-[10px] text-ink-soft">Verified Rate</div>
                  </div>
                </div>
              )}

              {/* Dossier Navigation Tabs */}
              <div className="flex border-b border-[#bcd6fa]/50 px-6 bg-white gap-6 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setDossierActiveTab("cv")}
                  className={`py-3 border-b-2 transition-colors cursor-pointer ${
                    dossierActiveTab === "cv" ? "border-electric text-electric" : "border-transparent text-ink-soft hover:text-ink"
                  }`}
                >
                  AI-Parsed CV Profile
                </button>
                <button
                  type="button"
                  onClick={() => setDossierActiveTab("vetting")}
                  className={`py-3 border-b-2 transition-colors cursor-pointer ${
                    dossierActiveTab === "vetting" ? "border-electric text-electric" : "border-transparent text-ink-soft hover:text-ink"
                  }`}
                >
                  Vetting Scorecard & Review
                </button>
                <button
                  type="button"
                  onClick={() => setDossierActiveTab("compliance")}
                  className={`py-3 border-b-2 transition-colors cursor-pointer ${
                    dossierActiveTab === "compliance" ? "border-electric text-electric" : "border-transparent text-ink-soft hover:text-ink"
                  }`}
                >
                  Statutory Compliance
                </button>
                <button
                  type="button"
                  onClick={() => setDossierActiveTab("pod")}
                  className={`py-3 border-b-2 transition-colors cursor-pointer ${
                    dossierActiveTab === "pod" ? "border-electric text-electric" : "border-transparent text-ink-soft hover:text-ink"
                  }`}
                >
                  Pod Assignment
                </button>
              </div>

              {/* Dossier Body Content */}
              <div className="p-6 space-y-6">
                {/* TAB 1: AI-PARSED CV PROFILE */}
                {dossierActiveTab === "cv" && (
                  <div className="space-y-5">
                    {selectedUser.dossier ? (
                      <>
                        {/* Title & Bio */}
                        <div>
                          <h3 className="font-display text-sm font-bold text-ink">{selectedUser.dossier.title}</h3>
                          <div className="text-xs text-mist mt-0.5">{selectedUser.dossier.yearsExperience} Years Professional Industry Experience</div>
                          <p className="mt-2 text-xs text-ink-soft leading-relaxed bg-canvas/40 p-3 rounded-xl border border-[#bcd6fa]/50">
                            {selectedUser.dossier.summary}
                          </p>
                        </div>

                        {/* Verified Skills Matrix */}
                        <div>
                          <div className="text-xs font-bold text-ink mb-2">Verified Skill Matrix ({selectedUser.dossier.skills.length} Skills)</div>
                          <div className="flex flex-wrap gap-1.5">
                            {selectedUser.dossier.skills.map((skill) => (
                              <span
                                key={skill}
                                className="rounded-lg bg-white border border-[#bcd6fa] px-2.5 py-1 text-xs font-semibold text-ink shadow-2xs"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Work History */}
                        <div>
                          <div className="text-xs font-bold text-ink mb-2">Work History & Project Impacts</div>
                          <div className="space-y-3">
                            {selectedUser.dossier.workHistory.map((work, idx) => (
                              <div key={idx} className="rounded-xl border border-[#bcd6fa]/60 bg-white p-3.5 space-y-1.5">
                                <div className="flex items-center justify-between text-xs">
                                  <span className="font-bold text-ink">{work.role}</span>
                                  <span className="text-mist">{work.period}</span>
                                </div>
                                <div className="text-xs font-medium text-electric">{work.company}</div>
                                <ul className="list-disc list-inside space-y-1 text-xs text-ink-soft pt-1">
                                  {work.highlights.map((point, pIdx) => (
                                    <li key={pIdx}>{point}</li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Education */}
                        <div>
                          <div className="text-xs font-bold text-ink mb-1">Education & Degrees</div>
                          <div className="rounded-xl border border-[#bcd6fa]/50 bg-canvas/40 p-3 text-xs text-ink-soft">
                            {selectedUser.dossier.education}
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="p-8 text-center text-xs text-mist bg-canvas/30 rounded-xl">
                        This user is provisioned as internal platform staff ({selectedUser.role}). Standard candidate CV parsing is not attached.
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 2: TECHNICAL VETTING SCORECARD */}
                {dossierActiveTab === "vetting" && (
                  <div className="space-y-5">
                    <div className="rounded-xl border border-[#bcd6fa] bg-canvas/40 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-display text-sm font-bold text-ink">Technical Vetting Scorecard</h4>
                          <p className="text-xs text-ink-soft mt-0.5">In-house validator review and benchmark metrics.</p>
                        </div>
                        <div className="text-right">
                          <div className="font-display text-xl font-bold text-signal">
                            {Math.round((codeQualityScore + systemDesignScore + testCoverageScore + behavioralScore) / 4)} / 100
                          </div>
                          <span className="text-[10px] font-semibold text-signal bg-signal/15 px-2 py-0.5 rounded-full">
                            Tier 1 Elite
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Subscores Adjuster Sliders */}
                    <div className="space-y-4 text-xs">
                      <div>
                        <div className="flex justify-between font-semibold mb-1">
                          <span className="text-ink">Code Quality & Concurrency Standards</span>
                          <span className="font-bold text-electric">{codeQualityScore}%</span>
                        </div>
                        <input
                          type="range"
                          min="50"
                          max="100"
                          value={codeQualityScore}
                          onChange={(e) => setCodeQualityScore(Number(e.target.value))}
                          className="w-full accent-electric cursor-pointer"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between font-semibold mb-1">
                          <span className="text-ink">System Architecture & Scalability</span>
                          <span className="font-bold text-electric">{systemDesignScore}%</span>
                        </div>
                        <input
                          type="range"
                          min="50"
                          max="100"
                          value={systemDesignScore}
                          onChange={(e) => setSystemDesignScore(Number(e.target.value))}
                          className="w-full accent-electric cursor-pointer"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between font-semibold mb-1">
                          <span className="text-ink">Test Coverage & Security Verification</span>
                          <span className="font-bold text-electric">{testCoverageScore}%</span>
                        </div>
                        <input
                          type="range"
                          min="50"
                          max="100"
                          value={testCoverageScore}
                          onChange={(e) => setTestCoverageScore(Number(e.target.value))}
                          className="w-full accent-electric cursor-pointer"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between font-semibold mb-1">
                          <span className="text-ink">Behavioral & Agile Sprint Communication</span>
                          <span className="font-bold text-electric">{behavioralScore}%</span>
                        </div>
                        <input
                          type="range"
                          min="50"
                          max="100"
                          value={behavioralScore}
                          onChange={(e) => setBehavioralScore(Number(e.target.value))}
                          className="w-full accent-electric cursor-pointer"
                        />
                      </div>
                    </div>

                    {/* Validator Notes Textarea */}
                    <div>
                      <label className="block text-xs font-bold text-ink mb-1">In-House Validator Audit Notes</label>
                      <textarea
                        rows={3}
                        value={validatorNotes}
                        onChange={(e) => setValidatorNotes(e.target.value)}
                        placeholder="Add technical review notes or code benchmark observations..."
                        className="w-full rounded-xl border border-[#bcd6fa] p-3 text-xs text-ink placeholder-mist focus:border-electric focus:outline-hidden"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleSaveVettingScore}
                      className="w-full rounded-xl bg-electric py-2.5 text-xs font-semibold text-white hover:bg-electric-bright transition-colors cursor-pointer shadow-xs"
                    >
                      Persist Updated Vetting Score
                    </button>
                  </div>
                )}

                {/* TAB 3: STATUTORY COMPLIANCE */}
                {dossierActiveTab === "compliance" && (
                  <div className="space-y-4">
                    <div className="text-xs text-ink-soft">
                      Statutory clearances required prior to client sprint deployment:
                    </div>

                    {selectedUser.dossier?.complianceCertifications ? (
                      <div className="space-y-2.5">
                        {selectedUser.dossier.complianceCertifications.map((cert, cIdx) => (
                          <div
                            key={cIdx}
                            className="flex items-center justify-between p-3.5 rounded-xl border border-[#bcd6fa]/60 bg-canvas/30 text-xs"
                          >
                            <div className="flex items-center gap-2.5">
                              <ShieldCheck size={18} className="text-signal" />
                              <div>
                                <div className="font-semibold text-ink">{cert.name}</div>
                                <div className="text-[11px] text-mist">Audited: {cert.date}</div>
                              </div>
                            </div>
                            <span className="rounded-full bg-signal/15 px-2.5 py-0.5 text-[10px] font-semibold text-signal">
                              {cert.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 text-center text-xs text-mist bg-canvas/30 rounded-xl">
                        No special compliance certifications required for this user role.
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 4: POD ASSIGNMENT */}
                {dossierActiveTab === "pod" && (
                  <div className="space-y-4 text-xs">
                    {selectedUser.dossier?.currentPod ? (
                      <div className="rounded-xl border border-[#bcd6fa] bg-canvas/40 p-4 space-y-2">
                        <div className="text-mist text-[11px] uppercase font-semibold">Current Active Pod Squad</div>
                        <div className="font-display text-sm font-bold text-ink">{selectedUser.dossier.currentPod}</div>
                        <div className="flex items-center gap-3 pt-1">
                          <span className="font-semibold text-electric">Role: {selectedUser.dossier.podRole}</span>
                          <span className="text-mist">•</span>
                          <span className="font-semibold text-signal">Hourly: {selectedUser.dossier.hourlyRate}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="p-6 text-center text-xs text-mist bg-canvas/30 rounded-xl">
                        Candidate is not currently allocated to an active sprint pod. Ready for deployment.
                      </div>
                    )}

                    <div className="pt-2">
                      <label className="block font-bold text-ink mb-1">Re-Allocate or Assign to Client Pod</label>
                      <select className="w-full rounded-xl border border-[#bcd6fa] px-3 py-2 text-xs text-ink focus:border-electric focus:outline-hidden cursor-pointer">
                        <option value="POD-842">POD-842: FinTech High-Frequency Ledger Pod ($95 / hr)</option>
                        <option value="POD-719">POD-719: CarePulse Emergency ICU Specialist Rota (£78 / hr)</option>
                        <option value="POD-904">POD-904: Cloud Native Kubernetes Migration Pod ($88 / hr)</option>
                        <option value="POD-611">POD-611: AI Patient Triage Pipeline Pod ($92 / hr)</option>
                        <option value="NONE">Unassigned / Bench Available</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-6 border-t border-[#bcd6fa]/50 bg-canvas/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleToggleStatus(selectedUser.id)}
                  className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                    selectedUser.status === "Active"
                      ? "border border-rose-200 text-rose-600 hover:bg-rose-50"
                      : "border border-signal/40 text-signal hover:bg-signal/10"
                  }`}
                >
                  {selectedUser.status === "Active" ? "Suspend Account" : "Activate Account"}
                </button>
              </div>

              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="rounded-xl bg-ink px-4 py-2 text-xs font-semibold text-white hover:bg-electric transition-colors cursor-pointer shadow-xs"
              >
                Done / Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Provision Staff Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl border border-[#bcd6fa] bg-white p-6 shadow-xl animate-in zoom-in-95 duration-150">
            <h3 className="font-display text-base font-bold text-ink">Provision Internal Staff Account</h3>
            <p className="mt-1 text-xs text-ink-soft">
              Internal accounts are provisioned by administrators and granted scoped RBAC privileges.
            </p>

            <form onSubmit={handleCreateUser} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-ink mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jonathan Drake"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full rounded-xl border border-[#bcd6fa] px-3 py-2 text-xs text-ink placeholder-mist focus:border-electric focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink mb-1">Official Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. j.drake@pepoltek.com"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full rounded-xl border border-[#bcd6fa] px-3 py-2 text-xs text-ink placeholder-mist focus:border-electric focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink mb-1">Assigned RBAC Role</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as AdminRole)}
                  className="w-full rounded-xl border border-[#bcd6fa] px-3 py-2 text-xs text-ink focus:border-electric focus:outline-hidden"
                >
                  <option value="Recruiter">Recruiter (Candidate Screening & Matching)</option>
                  <option value="Technical Validator">Technical Validator (GitHub & Vetting Review)</option>
                  <option value="Super Admin">Super Admin (Full Root Platform Governance)</option>
                </select>
              </div>

              <div className="mt-5 flex items-center justify-end gap-2 pt-2 border-t border-[#bcd6fa]/40">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-ink-soft hover:bg-canvas transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-electric px-4 py-2 text-xs font-semibold text-white hover:bg-electric-bright transition-colors cursor-pointer shadow-xs"
                >
                  Confirm Provisioning
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
