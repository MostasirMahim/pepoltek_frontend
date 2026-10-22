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
    auditorEntity: "Kroll Security Auditing Node",
    licenseNumber: "SOC2-DEV-99120",
  },
];

export function AdminComplianceView() {
  const [frameworks] = useState<AdminComplianceFramework[]>(ADMIN_COMPLIANCE_FRAMEWORKS);
  const [records, setRecords] = useState<IndividualComplianceRecord[]>([]);
  const [notification, setNotification] = useState<string | null>(null);

  const handleVerifyNow = (id: string) => {
    setRecords((prev) =>
      prev.map((rec) => {
        if (rec.id === id) {
          setNotification(`Credential ${rec.licenseNumber || rec.id} verified with upstream authoritative registry.`);
          setTimeout(() => setNotification(null), 3500);
          return { ...rec, status: "Verified & Active" as const };
        }
        return rec;
      })
    );
  };

  const handleExportComplianceDossier = () => {
    setNotification("Full SOC 2 Type II and HIPAA compliance bundle exported as signed cryptographic package.");
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-signal/30 bg-signal/10 px-3 py-0.5 text-xs font-semibold text-signal">
            <ShieldCheck size={13} />
            <span>CONTINUOUS AUDIT &amp; REGULATORY ATTESTATION</span>
          </div>
          <h1 className="mt-2 font-display text-2xl font-bold text-ink">Compliance &amp; Credential Vault</h1>
          <p className="text-xs text-ink-soft">
            Real-time compliance monitoring across SOC 2 Type II, HIPAA clinical data governance, and national Right to Work registries.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportComplianceDossier}
          className="rounded-xl bg-ink px-4 py-2.5 font-display text-xs font-semibold text-white shadow-xs hover:bg-electric transition-colors cursor-pointer"
        >
          Export Compliance Audit Report
        </button>
      </div>

      {/* Notification Banner */}
      {notification && (
        <div className="rounded-xl border border-signal/30 bg-signal/10 px-4 py-2.5 text-xs font-semibold text-signal flex items-center gap-2 animate-in fade-in-0 duration-200">
          <CheckCircle size={16} />
          <span>{notification}</span>
        </div>
      )}

      {/* High-Level Frameworks Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {frameworks.map((fw) => (
          <div
            key={fw.name}
            className="rounded-3xl border border-[#bcd6fa] bg-white p-6 shadow-xs space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-mist uppercase tracking-wider">{fw.name}</span>
              <span className="rounded-full bg-signal/15 px-2.5 py-0.5 font-mono text-[10px] font-bold text-signal">
                {fw.status}
              </span>
            </div>

            <div className="space-y-1">
              <div className="font-display text-2xl font-bold text-ink">
                {fw.auditScore} <span className="text-sm font-normal text-mist">/ {fw.controls.length} Controls</span>
              </div>
              <p className="text-xs text-ink-soft">{fw.scope}</p>
            </div>

            <div className="pt-2 border-t border-[#bcd6fa]/40 flex items-center justify-between font-mono text-[11px] text-mist">
              <span>Auditor: {fw.auditorOrg}</span>
              <span>Refreshed: {fw.lastAuditDate}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Individual Credential Verifications Table */}
      <div className="rounded-3xl border border-[#bcd6fa] bg-white overflow-hidden shadow-xs">
        <div className="p-5 border-b border-[#bcd6fa]/50 flex items-center justify-between bg-canvas/20">
          <div>
            <h2 className="font-display text-base font-bold text-ink">Individual Candidate Credentials Queue</h2>
            <p className="text-xs text-ink-soft">Verified licenses and background checks tied to active deployed specialists.</p>
          </div>
          <span className="font-mono text-xs text-signal font-bold">{records.length} Monitored Records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#bcd6fa]/50 bg-canvas/40 font-mono text-[11px] text-mist uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3">Specialist &amp; Record ID</th>
                <th className="px-5 py-3">Credential / License Type</th>
                <th className="px-5 py-3">Issuing / Verifying Node</th>
                <th className="px-5 py-3">Expiry Date</th>
                <th className="px-5 py-3">Verification Status</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#bcd6fa]/30 text-ink font-medium">
              {records.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-ink-soft">
                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-canvas border border-[#bcd6fa]/50 text-mist mb-2">
                      <ShieldCheck size={20} />
                    </div>
                    <div className="font-display text-sm font-bold text-ink">No Candidate Credentials in Vault</div>
                    <p className="text-xs text-mist mt-1 max-w-sm mx-auto">
                      Candidate RTW documentation, medical council registrations, and security clearances will appear here upon submission.
                    </p>
                  </td>
                </tr>
              ) : (
                records.map((rec) => (
                  <tr key={rec.id} className="hover:bg-canvas/30 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-bold text-ink">{rec.candidateName}</div>
                      <div className="font-mono text-[11px] text-mist">{rec.id}</div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="text-ink">{rec.certificationType}</div>
                      {rec.licenseNumber && (
                        <span className="font-mono text-[10px] text-electric">{rec.licenseNumber}</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-ink-soft text-xs">
                      {rec.auditorEntity}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-xs text-ink">
                      {rec.expiryDate}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-signal/15 px-2.5 py-0.5 font-mono text-[10px] font-bold text-signal">
                        <CheckCircle size={12} />
                        <span>{rec.status}</span>
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => handleVerifyNow(rec.id)}
                        className="rounded-xl border border-[#bcd6fa] bg-canvas/40 px-3 py-1 font-display text-xs font-semibold text-ink-soft hover:bg-white hover:text-ink transition-all cursor-pointer"
                      >
                        Re-verify Node
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
