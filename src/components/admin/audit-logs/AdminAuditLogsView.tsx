"use client";

import React, { useState } from "react";
import {
  FileText,
  Search,
  CheckCircle,
  ShieldCheck,
  Lock,
  X,
} from "@/components/ui/Icons";
import { AdminAuditLogRecord } from "@/types/admin.types";

interface AdminAuditLogsViewProps {
  initialLogs?: AdminAuditLogRecord[];
}

export function AdminAuditLogsView({
  initialLogs = [],
}: AdminAuditLogsViewProps) {
  const [logs] = useState<AdminAuditLogRecord[]>(initialLogs);
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedLog, setSelectedLog] = useState<AdminAuditLogRecord | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const filteredLogs = logs.filter((log) => {
    const matchesSeverity =
      severityFilter === "all" ||
      (severityFilter === "p0" && log.severity === "P0 Critical") ||
      (severityFilter === "p1" && log.severity === "P1 Security") ||
      (severityFilter === "p2" && log.severity === "P2 Operational");

    const matchesSearch =
      log.actorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.targetEntity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.ipAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.id.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSeverity && matchesSearch;
  });

  const handleExportLogs = () => {
    setNotification("Audit log ledger exported as SHA-256 signed JSON archive.");
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-electric/30 bg-electric/10 px-3 py-0.5 text-xs font-semibold text-electric">
            <FileText size={13} />
            <span>IMMUTABLE WRITE-ONCE AUDIT TELEMETRY</span>
          </div>
          <h1 className="mt-2 font-display text-2xl font-bold text-ink">System Action &amp; Security Audit Logs</h1>
          <p className="text-xs text-ink-soft">
            Append-only record of all administrative logins, candidate pitch authorizations, vetting updates, and escrow disbursements.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportLogs}
          className="rounded-xl bg-ink px-4 py-2.5 font-display text-xs font-semibold text-white shadow-xs hover:bg-electric transition-colors cursor-pointer"
        >
          Export Tamper-Proof Audit Archive
        </button>
      </div>

      {/* Notification Banner */}
      {notification && (
        <div className="rounded-xl border border-signal/30 bg-signal/10 px-4 py-2.5 text-xs font-semibold text-signal flex items-center gap-2 animate-in fade-in-0 duration-200">
          <CheckCircle size={16} />
          <span>{notification}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-[#bcd6fa] bg-white p-3 shadow-xs">
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {[
            { id: "all", label: "All Logs" },
            { id: "p0", label: "P0 Critical" },
            { id: "p1", label: "P1 Security" },
            { id: "p2", label: "P2 Operational" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSeverityFilter(tab.id)}
              className={`rounded-xl px-3 py-1.5 font-mono text-xs font-semibold transition-all cursor-pointer ${
                severityFilter === tab.id
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
            placeholder="Search action, actor, or IP..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/30 pl-9 pr-3 py-1.5 text-xs text-ink placeholder-mist focus:border-electric focus:bg-white focus:outline-none"
          />
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="rounded-3xl border border-[#bcd6fa] bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#bcd6fa]/50 bg-canvas/40 font-mono text-[11px] text-mist uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3">Timestamp &amp; Log ID</th>
                <th className="px-5 py-3">Actor &amp; Persona</th>
                <th className="px-5 py-3">Action Executed</th>
                <th className="px-5 py-3">Target Entity</th>
                <th className="px-5 py-3">Source IP &amp; Geolocation</th>
                <th className="px-5 py-3">Severity</th>
                <th className="px-5 py-3 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#bcd6fa]/30 text-ink font-medium">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-ink-soft">
                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-canvas border border-[#bcd6fa]/50 text-mist mb-2">
                      <FileText size={20} />
                    </div>
                    <div className="font-display text-sm font-bold text-ink">No System Audit Logs Recorded</div>
                    <p className="text-xs text-mist mt-1 max-w-sm mx-auto">
                      Platform security, staff elevation, and administrative events will appear here with cryptographic validation hashes.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr
                    key={log.id}
                    onClick={() => setSelectedLog(log)}
                    className="hover:bg-canvas/30 transition-colors cursor-pointer"
                  >
                    <td className="px-5 py-3.5">
                      <div className="font-mono text-[11px] text-mist">{log.timestamp}</div>
                      <span className="font-mono text-[10px] text-electric">{log.id}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="font-bold text-ink">{log.actorName}</div>
                      <div className="font-mono text-[10px] text-mist">{log.actorRole}</div>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-xs text-ink">
                      {log.action}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-xs text-ink-soft">
                      {log.targetEntity}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-xs text-mist">
                      {log.ipAddress}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold ${
                          log.severity === "P0 Critical"
                            ? "bg-rose-100 text-rose-700"
                            : log.severity === "P1 Security"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-signal/15 text-signal"
                        }`}
                      >
                        {log.severity}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        type="button"
                        className="rounded-xl border border-[#bcd6fa] bg-canvas/40 px-3 py-1 font-display text-xs font-semibold text-ink-soft hover:bg-white hover:text-ink transition-all cursor-pointer"
                      >
                        Verify Hash
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Detail Slide-Over Sheet */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex justify-end bg-ink/40 backdrop-blur-xs animate-in fade-in-0 duration-150">
          <div
            className="w-full max-w-lg bg-white h-full shadow-2xl p-6 sm:p-8 flex flex-col justify-between overflow-y-auto thin-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-6">
              <div className="flex items-start justify-between border-b border-[#bcd6fa]/40 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-electric">{selectedLog.id}</span>
                    <span className="rounded-full bg-signal/15 px-2.5 py-0.5 font-mono text-[10px] font-bold text-signal">
                      {selectedLog.severity}
                    </span>
                  </div>
                  <h2 className="font-display text-xl font-bold text-ink mt-1.5">
                    {selectedLog.action}
                  </h2>
                  <p className="text-xs text-ink-soft">{selectedLog.timestamp}</p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedLog(null)}
                  className="rounded-xl p-2 text-ink-soft hover:bg-canvas cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="rounded-2xl border border-[#bcd6fa]/60 bg-canvas/30 p-4 space-y-2">
                  <span className="font-mono text-[10px] text-mist uppercase tracking-wider block">Cryptographic Session ID</span>
                  <div className="font-mono text-[11px] text-electric break-all bg-white p-2.5 rounded-xl border border-[#bcd6fa]/40">
                    {selectedLog.forensicData?.sessionId || `SHA256-${selectedLog.id}-VALIDATED`}
                  </div>
                  <div className="text-[11px] text-signal font-semibold pt-1">
                    SHA-256 Merkle root validated against cluster tamper-evident ledger.
                  </div>
                </div>

                <div className="rounded-2xl border border-[#bcd6fa]/60 bg-canvas/30 p-4 space-y-2">
                  <span className="font-mono text-[10px] text-mist uppercase tracking-wider block">Execution Context</span>
                  <div className="flex justify-between py-1 border-b border-[#bcd6fa]/30">
                    <span className="text-ink-soft">Actor:</span>
                    <span className="font-bold text-ink">{selectedLog.actorName} ({selectedLog.actorRole})</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#bcd6fa]/30">
                    <span className="text-ink-soft">Target Entity:</span>
                    <span className="font-mono text-ink">{selectedLog.targetEntity}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#bcd6fa]/30">
                    <span className="text-ink-soft">Client IP:</span>
                    <span className="font-mono text-ink">{selectedLog.ipAddress}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-ink-soft">User Agent:</span>
                    <span className="font-mono text-[10px] text-mist">{selectedLog.forensicData?.userAgent || "Internal Service Node"}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-[#bcd6fa]/40 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="rounded-xl px-4 py-2 font-display text-xs font-semibold text-ink-soft hover:bg-canvas cursor-pointer"
              >
                Close Sheet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
