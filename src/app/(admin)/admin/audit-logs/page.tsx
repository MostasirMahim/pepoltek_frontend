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
import { ADMIN_AUDIT_LOGS, AdminAuditLogRecord } from "@/data/adminDashboardData";

export default function AdminAuditLogsPage() {
  const [logs] = useState<AdminAuditLogRecord[]>(ADMIN_AUDIT_LOGS);
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
          <h1 className="mt-2 font-display text-2xl font-bold text-ink">System Action & Security Audit Logs</h1>
          <p className="text-xs text-ink-soft">
            Append-only record of all administrative logins, candidate pitch authorizations, vetting updates, and escrow disbursements.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportLogs}
          className="rounded-xl bg-ink px-4 py-2.5 font-display text-xs font-semibold text-white shadow-xs hover:bg-electric transition-colors cursor-pointer"
        >
          Export Signed Audit Log
        </button>
      </div>

      {/* Notification Banner */}
      {notification && (
        <div className="rounded-xl border border-signal/30 bg-signal/10 px-4 py-2.5 text-xs font-semibold text-signal flex items-center gap-2 animate-in fade-in-0 duration-200">
          <CheckCircle size={16} />
          <span>{notification}</span>
        </div>
      )}

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Severity Tabs */}
        <div className="flex items-center gap-1 rounded-2xl border border-[#bcd6fa] bg-white p-1 text-xs overflow-x-auto">
          <button
            type="button"
            onClick={() => setSeverityFilter("all")}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              severityFilter === "all" ? "bg-ink text-white shadow-xs" : "text-ink-soft hover:text-ink"
            }`}
          >
            All Events ({logs.length})
          </button>
          <button
            type="button"
            onClick={() => setSeverityFilter("p0")}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              severityFilter === "p0" ? "bg-ink text-white shadow-xs" : "text-ink-soft hover:text-ink"
            }`}
          >
            P0 Critical ({logs.filter((l) => l.severity === "P0 Critical").length})
          </button>
          <button
            type="button"
            onClick={() => setSeverityFilter("p1")}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              severityFilter === "p1" ? "bg-ink text-white shadow-xs" : "text-ink-soft hover:text-ink"
            }`}
          >
            P1 Security ({logs.filter((l) => l.severity === "P1 Security").length})
          </button>
          <button
            type="button"
            onClick={() => setSeverityFilter("p2")}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              severityFilter === "p2" ? "bg-ink text-white shadow-xs" : "text-ink-soft hover:text-ink"
            }`}
          >
            P2 Operational ({logs.filter((l) => l.severity === "P2 Operational").length})
          </button>
        </div>

        {/* Live Search */}
        <div className="relative w-full sm:w-80">
          <Search size={14} className="absolute left-3.5 top-3 text-mist" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by actor, action, IP, or entity..."
            className="w-full rounded-xl border border-[#bcd6fa] bg-white py-2 pl-9 pr-3 text-xs text-ink placeholder-mist focus:border-electric focus:outline-hidden"
          />
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="rounded-2xl border border-[#bcd6fa] bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#bcd6fa]/60 bg-canvas/60 text-ink-soft">
              <tr>
                <th className="py-3 px-4 font-semibold">Event ID</th>
                <th className="py-3 px-4 font-semibold">Timestamp</th>
                <th className="py-3 px-4 font-semibold">Actor Identity</th>
                <th className="py-3 px-4 font-semibold">Action Executed</th>
                <th className="py-3 px-4 font-semibold">Target Entity</th>
                <th className="py-3 px-4 font-semibold">Severity</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Payload</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#bcd6fa]/40">
              {filteredLogs.map((log) => (
                <tr
                  key={log.id}
                  onClick={() => setSelectedLog(log)}
                  className="hover:bg-canvas/40 transition-colors group cursor-pointer"
                >
                  <td className="py-3 px-4 font-mono text-xs font-bold text-electric">
                    {log.id}
                  </td>
                  <td className="py-3 px-4 text-mist whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-ink group-hover:text-electric transition-colors">
                      {log.actorName}
                    </div>
                    <div className="text-[11px] text-mist">{log.actorRole}</div>
                  </td>
                  <td className="py-3 px-4 font-medium text-ink">
                    {log.action}
                  </td>
                  <td className="py-3 px-4 text-ink-soft font-mono text-[11px]">
                    {log.targetEntity}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                        log.severity === "P0 Critical"
                          ? "bg-rose-100 text-rose-700"
                          : log.severity === "P1 Security"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-electric/10 text-electric"
                      }`}
                    >
                      {log.severity}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                        log.status === "Success"
                          ? "bg-signal/15 text-signal"
                          : log.status === "Blocked"
                          ? "bg-rose-100 text-rose-700 font-bold"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {log.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => setSelectedLog(log)}
                      className="rounded-lg bg-electric/10 text-electric hover:bg-electric hover:text-white px-2.5 py-1 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Inspect Payload
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Forensic Audit Event Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-xs p-4 animate-in fade-in-0 duration-150">
          <div
            className="w-full max-w-2xl rounded-2xl border border-[#bcd6fa] bg-white p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto thin-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[#bcd6fa]/40 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-electric bg-electric/10 px-2 py-0.5 rounded-md">
                    {selectedLog.id}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                      selectedLog.severity === "P0 Critical"
                        ? "bg-rose-100 text-rose-700"
                        : "bg-signal/15 text-signal"
                    }`}
                  >
                    {selectedLog.severity}
                  </span>
                  <span className="text-xs text-mist">{selectedLog.timestamp}</span>
                </div>
                <h2 className="font-display text-lg font-bold text-ink mt-1.5">{selectedLog.action}</h2>
                <p className="text-xs text-ink-soft">Target: <span className="font-mono font-bold text-ink">{selectedLog.targetEntity}</span></p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="rounded-xl p-1.5 text-ink-soft hover:bg-canvas hover:text-ink cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Network & Session Metadata */}
            <div className="grid grid-cols-3 gap-2.5 text-xs">
              <div className="rounded-xl bg-canvas/40 p-3 border border-[#bcd6fa]/40">
                <div className="text-[10px] text-mist font-semibold uppercase">Actor</div>
                <div className="font-bold text-ink mt-0.5">{selectedLog.actorName}</div>
                <div className="text-[11px] text-mist">{selectedLog.actorRole}</div>
              </div>
              <div className="rounded-xl bg-canvas/40 p-3 border border-[#bcd6fa]/40">
                <div className="text-[10px] text-mist font-semibold uppercase">Network Origin</div>
                <div className="font-mono text-xs font-bold text-ink mt-0.5">{selectedLog.ipAddress}</div>
                <div className="text-[11px] text-mist">{selectedLog.forensicData?.geoIpCity || "Internal Mesh Network"}</div>
              </div>
              <div className="rounded-xl bg-canvas/40 p-3 border border-[#bcd6fa]/40">
                <div className="text-[10px] text-mist font-semibold uppercase">Session ID</div>
                <div className="font-mono text-[11px] text-electric mt-0.5 truncate">
                  {selectedLog.forensicData?.sessionId || "sess_authed_verified"}
                </div>
                <div className="text-[10px] text-signal font-semibold">Encrypted Wire</div>
              </div>
            </div>

            {/* User-Agent */}
            {selectedLog.forensicData?.userAgent && (
              <div className="text-xs">
                <div className="text-[10px] text-mist font-semibold uppercase mb-1">Client User-Agent</div>
                <div className="font-mono text-[11px] text-ink-soft bg-canvas/30 p-2.5 rounded-xl border border-[#bcd6fa]/40">
                  {selectedLog.forensicData.userAgent}
                </div>
              </div>
            )}

            {/* Raw JSON Event Payload */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-bold text-ink">Cryptographic Event Payload (JSON)</span>
                <span className="text-mist font-mono text-[10px]">SHA-256 Validated</span>
              </div>
              <pre className="rounded-xl border border-[#bcd6fa]/60 bg-ink p-4 font-mono text-[11px] text-emerald-400 overflow-x-auto thin-scrollbar leading-relaxed">
                {JSON.stringify(
                  selectedLog.forensicData?.rawPayload || {
                    event: selectedLog.action,
                    actor: selectedLog.actorName,
                    target: selectedLog.targetEntity,
                    severity: selectedLog.severity,
                    timestamp: selectedLog.timestamp,
                    status: selectedLog.status,
                  },
                  null,
                  2
                )}
              </pre>
            </div>

            {/* State Change Diff */}
            {selectedLog.forensicData?.beforeState && selectedLog.forensicData?.afterState && (
              <div className="text-xs space-y-1.5">
                <div className="font-bold text-ink">State Mutation Diff</div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-xl border border-rose-200 bg-rose-50/40 text-[11px] font-mono">
                    <span className="font-bold text-rose-800 block mb-1">Before State:</span>
                    {JSON.stringify(selectedLog.forensicData.beforeState)}
                  </div>
                  <div className="p-2.5 rounded-xl border border-signal/30 bg-signal/10 text-[11px] font-mono">
                    <span className="font-bold text-signal block mb-1">After State:</span>
                    {JSON.stringify(selectedLog.forensicData.afterState)}
                  </div>
                </div>
              </div>
            )}

            {/* Modal Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-[#bcd6fa]/40">
              <span className="text-xs text-mist">
                Record Status: <span className="font-semibold text-ink">{selectedLog.status}</span>
              </span>
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="rounded-xl bg-ink px-4 py-2 text-xs font-semibold text-white hover:bg-electric transition-colors cursor-pointer shadow-xs"
              >
                Close Forensic View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
