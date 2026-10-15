"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  CheckCircle,
  Activity,
  FileText,
  Lock,
  X,
} from "@/components/ui/Icons";
import {
  ADMIN_COMPLIANCE_FRAMEWORKS,
  AdminComplianceFramework,
} from "@/data/adminDashboardData";

interface IndividualComplianceRecord {
  id: string;
  candidateName: string;
  certificationType: string;
  status: "Verified & Active" | "Pending Annual Review";
  expiryDate: string;
  auditorEntity: string;
  licenseNumber?: string;
}

const INDIVIDUAL_RECORDS: IndividualComplianceRecord[] = [
  {
    id: "CMP-901",
    candidateName: "Dr. Rachel Higgins",
    certificationType: "GMC Full Registration & NHS Framework Clearance",
    status: "Verified & Active",
    expiryDate: "Dec 2027",
    auditorEntity: "Automated GMC Registry API Node",
    licenseNumber: "GMC-7402910",
  },
  {
    id: "CMP-902",
    candidateName: "Alex Morgan",
    certificationType: "UK Right to Work & Enterprise IP Assignment Agreement",
    status: "Verified & Active",
    expiryDate: "Aug 2028",
    auditorEntity: "Pepoltek Legal Verification Vault",
    licenseNumber: "RTW-UK-8849102",
  },
  {
    id: "CMP-903",
    candidateName: "Sarah Lindqvist",
    certificationType: "Enhanced DBS Disclosure & Safeguarding Band 7",
    status: "Verified & Active",
    expiryDate: "Jul 2027",
    auditorEntity: "UK Disclosure and Barring Service Gateway",
    licenseNumber: "DBS-ENH-3391029",
  },
  {
    id: "CMP-904",
    candidateName: "Carlos Mendez",
    certificationType: "SOC 2 Remote Node Security & Non-Compete Clearance",
    status: "Verified & Active",
    expiryDate: "Oct 2027",
    auditorEntity: "AICPA Remote Node Validator",
    licenseNumber: "SOC2-NODE-89104",
  },
];

export default function AdminCompliancePage() {
  const [frameworks] = useState<AdminComplianceFramework[]>(ADMIN_COMPLIANCE_FRAMEWORKS);
  const [records] = useState<IndividualComplianceRecord[]>(INDIVIDUAL_RECORDS);
  const [selectedFramework, setSelectedFramework] = useState<AdminComplianceFramework | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<IndividualComplianceRecord | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const handleRevalidate = (recordId: string, name: string) => {
    setNotification(`Successfully pinged registry node. ${name} (${recordId}) verified compliant.`);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleExportAuditDossier = () => {
    setNotification("Compliance Audit Dossier exported as encrypted PDF package.");
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-electric/30 bg-electric/10 px-3 py-0.5 text-xs font-semibold text-electric">
            <ShieldCheck size={13} />
            <span>IMMUTABLE SECURITY & STATUTORY COMPLIANCE</span>
          </div>
          <h1 className="mt-2 font-display text-2xl font-bold text-ink">Compliance & Regulatory Vault</h1>
          <p className="text-xs text-ink-soft">
            Enterprise governance across SOC 2 Type II, HIPAA PHI agreements, PCI DSS tokenization, and UK GMC registrations.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportAuditDossier}
          className="rounded-xl bg-ink px-4 py-2.5 font-display text-xs font-semibold text-white shadow-xs hover:bg-electric transition-colors cursor-pointer"
        >
          Export Compliance Audit Package
        </button>
      </div>

      {/* Notification Banner */}
      {notification && (
        <div className="rounded-xl border border-signal/30 bg-signal/10 px-4 py-2.5 text-xs font-semibold text-signal flex items-center gap-2 animate-in fade-in-0 duration-200">
          <CheckCircle size={16} />
          <span>{notification}</span>
        </div>
      )}

      {/* 4 Regulatory Framework Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {frameworks.map((fw) => (
          <div
            key={fw.id}
            onClick={() => setSelectedFramework(fw)}
            className="rounded-2xl border border-[#bcd6fa] bg-white p-5 shadow-xs flex flex-col justify-between hover:border-electric/50 transition-all cursor-pointer group"
          >
            <div>
              <div className="flex items-center justify-between gap-2 border-b border-[#bcd6fa]/40 pb-3">
                <span className="font-mono text-xs font-bold text-electric bg-electric/10 px-2 py-0.5 rounded-md">
                  {fw.id}
                </span>
                <span className="rounded-full bg-signal/15 px-2 py-0.5 text-[10px] font-semibold text-signal">
                  {fw.status}
                </span>
              </div>

              <h3 className="mt-3 font-display text-sm font-bold text-ink group-hover:text-electric transition-colors">
                {fw.name}
              </h3>
              <p className="mt-1 text-xs text-ink-soft">{fw.governingBody}</p>

              <div className="mt-3 rounded-xl bg-canvas/40 p-2.5 text-xs border border-[#bcd6fa]/40">
                <div className="text-[10px] text-mist font-semibold uppercase">Audit Score</div>
                <div className="font-display text-sm font-bold text-signal mt-0.5">{fw.auditScore}</div>
                <div className="text-[10.5px] text-ink-soft mt-1">Auditor: {fw.auditorOrg}</div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#bcd6fa]/40 flex items-center justify-between text-[11px] text-electric font-semibold group-hover:underline">
              <span>Inspect Security Controls</span>
              <span>→</span>
            </div>
          </div>
        ))}
      </div>

      {/* Individual Talent Statutory Clearance Checklist */}
      <div className="rounded-2xl border border-[#bcd6fa] bg-white shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#bcd6fa]/50 bg-canvas/30 flex items-center justify-between">
          <div>
            <h3 className="font-display text-sm font-bold text-ink">Specialist Deployment Clearance Register</h3>
            <p className="text-xs text-ink-soft">Real-time verification of specialists currently active or allocated to client pods.</p>
          </div>
          <span className="text-xs font-semibold text-signal bg-signal/10 px-3 py-1 rounded-full border border-signal/20">
            100% Pre-Screened Compliance
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#bcd6fa]/60 bg-canvas/60 text-ink-soft">
              <tr>
                <th className="py-3 px-4 font-semibold">Clearance ID</th>
                <th className="py-3 px-4 font-semibold">Specialist Candidate</th>
                <th className="py-3 px-4 font-semibold">Certification & License Type</th>
                <th className="py-3 px-4 font-semibold">Registry Status</th>
                <th className="py-3 px-4 font-semibold">Validity</th>
                <th className="py-3 px-4 font-semibold text-right">Verification Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#bcd6fa]/40">
              {records.map((r) => (
                <tr key={r.id} className="hover:bg-canvas/40 transition-colors">
                  <td className="py-3 px-4 font-mono text-xs font-bold text-electric">{r.id}</td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-ink">{r.candidateName}</div>
                    <div className="text-[11px] text-mist">{r.licenseNumber}</div>
                  </td>
                  <td className="py-3 px-4 text-ink-soft max-w-xs">{r.certificationType}</td>
                  <td className="py-3 px-4">
                    <span className="rounded-full bg-signal/15 px-2.5 py-0.5 text-[10.5px] font-semibold text-signal flex items-center gap-1 w-fit">
                      <CheckCircle size={12} />
                      <span>{r.status}</span>
                    </span>
                  </td>
                  <td className="py-3 px-4 text-ink-soft">{r.expiryDate}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedRecord(r)}
                        className="rounded-lg bg-electric/10 text-electric hover:bg-electric hover:text-white px-2.5 py-1 text-xs font-semibold transition-colors cursor-pointer"
                      >
                        Inspect License
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRevalidate(r.id, r.candidateName)}
                        className="rounded-lg border border-[#bcd6fa] bg-white px-2.5 py-1 text-xs font-semibold text-ink hover:bg-canvas transition-colors cursor-pointer"
                      >
                        Re-Validate Node
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Framework Security Controls Modal */}
      {selectedFramework && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-xs p-4 animate-in fade-in-0 duration-150">
          <div
            className="w-full max-w-2xl rounded-2xl border border-[#bcd6fa] bg-white p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto thin-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between border-b border-[#bcd6fa]/40 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-electric bg-electric/10 px-2 py-0.5 rounded-md">
                    {selectedFramework.id}
                  </span>
                  <span className="rounded-full bg-signal/15 px-2.5 py-0.5 text-[10px] font-semibold text-signal">
                    {selectedFramework.status}
                  </span>
                </div>
                <h2 className="font-display text-lg font-bold text-ink mt-1.5">{selectedFramework.name}</h2>
                <p className="text-xs text-ink-soft">Governing Body: {selectedFramework.governingBody} • Auditor: {selectedFramework.auditorOrg}</p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedFramework(null)}
                className="rounded-xl p-1.5 text-ink-soft hover:bg-canvas hover:text-ink cursor-pointer"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Cryptographic SHA-256 Fingerprint */}
            <div className="rounded-xl bg-canvas/60 p-3.5 border border-[#bcd6fa]/50 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-ink flex items-center gap-1.5">
                  <Lock size={14} className="text-electric" />
                  <span>Immutable Certificate Proof ID</span>
                </span>
                <span className="font-mono text-[10px] text-mist">{selectedFramework.certificateId}</span>
              </div>
              <div className="font-mono text-[10px] text-ink-soft break-all bg-white p-2 rounded-lg border border-[#bcd6fa]/40">
                SHA256: {selectedFramework.sha256Fingerprint}
              </div>
            </div>

            {/* Audit Scope */}
            <div className="text-xs">
              <div className="font-semibold text-ink mb-1">Official Audit Scope</div>
              <p className="text-ink-soft bg-canvas/30 p-3 rounded-xl border border-[#bcd6fa]/40 leading-relaxed">
                {selectedFramework.scope}
              </p>
            </div>

            {/* Controls Checklist */}
            <div>
              <h3 className="font-display text-sm font-bold text-ink mb-2.5">
                Enforced Cryptographic & Access Controls ({selectedFramework.controls.length} Verified)
              </h3>
              <div className="space-y-2">
                {selectedFramework.controls.map((ctrl) => (
                  <div key={ctrl.code} className="p-3 rounded-xl border border-[#bcd6fa]/60 bg-white space-y-1 text-xs shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-ink">
                        [{ctrl.code}] {ctrl.title}
                      </span>
                      <span className="rounded-full bg-signal/15 px-2 py-0.2 text-[10px] font-semibold text-signal">
                        {ctrl.status}
                      </span>
                    </div>
                    <p className="text-ink-soft text-[11px]">{ctrl.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-[#bcd6fa]/40">
              <span className="text-[11px] text-mist">
                Next Renewal Audit: {selectedFramework.nextRenewalDate}
              </span>
              <button
                type="button"
                onClick={() => setSelectedFramework(null)}
                className="rounded-xl bg-ink px-4 py-2 text-xs font-semibold text-white hover:bg-electric transition-colors cursor-pointer shadow-xs"
              >
                Close Certificate View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Individual License Inspection Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-xs p-4 animate-in fade-in-0 duration-150">
          <div
            className="w-full max-w-md rounded-2xl border border-[#bcd6fa] bg-white p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#bcd6fa]/40 pb-3">
              <h3 className="font-display text-base font-bold text-ink">Statutory License Clearance</h3>
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="rounded-lg p-1 text-ink-soft hover:bg-canvas cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="rounded-xl bg-canvas/40 p-3 border border-[#bcd6fa]/40">
                <div className="text-mist text-[10px] uppercase font-semibold">Specialist</div>
                <div className="font-bold text-ink text-sm">{selectedRecord.candidateName}</div>
                <div className="font-mono text-electric text-[11px] mt-0.5">{selectedRecord.licenseNumber}</div>
              </div>

              <div>
                <div className="text-mist text-[10px] uppercase font-semibold mb-1">Certification Scope</div>
                <div className="text-ink font-semibold">{selectedRecord.certificationType}</div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center p-2.5 bg-canvas/30 rounded-xl border border-[#bcd6fa]/40">
                <div>
                  <div className="text-mist text-[10px]">Verification Node</div>
                  <div className="font-semibold text-ink mt-0.5">{selectedRecord.auditorEntity}</div>
                </div>
                <div>
                  <div className="text-mist text-[10px]">Expiration</div>
                  <div className="font-semibold text-signal mt-0.5">{selectedRecord.expiryDate}</div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#bcd6fa]/40">
              <button
                type="button"
                onClick={() => {
                  handleRevalidate(selectedRecord.id, selectedRecord.candidateName);
                  setSelectedRecord(null);
                }}
                className="rounded-xl bg-electric px-4 py-2 text-xs font-semibold text-white hover:bg-electric-bright cursor-pointer"
              >
                Ping Live Registry & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
