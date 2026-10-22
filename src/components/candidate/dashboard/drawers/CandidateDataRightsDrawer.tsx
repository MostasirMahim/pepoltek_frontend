"use client";

import React, { useState } from "react";
import { X, ShieldCheck, Download, AlertTriangle, CheckCircle } from "@/components/ui/Icons";
import { useCandidatePersona } from "@/context/CandidatePersonaContext";

interface CandidateDataRightsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CandidateDataRightsDrawer({ isOpen, onClose }: CandidateDataRightsDrawerProps) {
  const { exportData, requestDeletion } = useCandidatePersona();

  const [isExporting, setIsExporting] = useState(false);
  const [deletionReason, setDeletionReason] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExport = async () => {
    try {
      setIsExporting(true);
      setSuccessMessage(null);
      setErrorMessage(null);

      const dossier = await exportData();
      if (!dossier) {
        setErrorMessage("Unable to generate data export bundle. Please try again.");
        setIsExporting(false);
        return;
      }

      // Trigger client-side JSON file download
      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(dossier, null, 2))}`;
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", jsonString);
      downloadAnchor.setAttribute("download", `pepoltek-candidate-dossier-${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      setSuccessMessage("Your personal candidate dossier has been exported as an authenticated JSON archive.");
    } catch {
      setErrorMessage("Failed to export data dossier.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleRequestDeletion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deletionReason.trim()) {
      setErrorMessage("Please specify a reason or feedback for your account deletion request.");
      return;
    }

    try {
      setIsDeleting(true);
      setSuccessMessage(null);
      setErrorMessage(null);

      const success = await requestDeletion(deletionReason.trim());
      if (success) {
        setSuccessMessage("Account closure request registered with Pepoltek Data Protection Officer. An audit record has been generated.");
        setDeletionReason("");
      } else {
        setErrorMessage("Failed to register deletion request. Please try again.");
      }
    } catch {
      setErrorMessage("An unexpected error occurred while processing the request.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-ink/60 backdrop-blur-xs transition-opacity animate-in fade-in-0 duration-200"
      />

      {/* Slide-Over Drawer Container */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10 z-50">
        <div className="w-screen max-w-xl md:max-w-2xl bg-white border-l border-[#bcd6fa] shadow-2xl flex flex-col animate-in slide-in-from-right duration-250 ease-out">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4.5 border-b border-[#bcd6fa]/50 bg-canvas/30 shrink-0">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-electric/10 px-2.5 py-0.5 text-[10px] font-mono font-bold text-electric uppercase tracking-wider mb-1">
                SRS CAN-09 &bull; GDPR &bull; CCPA
              </div>
              <h2 className="font-display text-lg font-bold text-ink">
                Data Rights &amp; Privacy Center
              </h2>
              <p className="text-xs text-ink-soft">
                Exercise your data portability and erasure rights under global data privacy regulations.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl p-2 text-ink-soft hover:text-ink hover:bg-canvas transition-colors cursor-pointer"
              title="Close Drawer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {successMessage && (
              <div className="rounded-2xl border border-signal/40 bg-signal/10 p-3.5 text-xs text-signal flex items-center gap-2 shadow-2xs">
                <CheckCircle size={16} className="shrink-0" />
                <span className="font-semibold">{successMessage}</span>
              </div>
            )}

            {errorMessage && (
              <div className="rounded-2xl border border-rose-300 bg-rose-50 p-3.5 text-xs text-rose-700 flex items-center gap-2 shadow-2xs">
                <AlertTriangle size={16} className="shrink-0" />
                <span className="font-semibold">{errorMessage}</span>
              </div>
            )}

            {/* GDPR Section 1: Data Portability & Export */}
            <div className="rounded-2xl border border-[#bcd6fa] bg-canvas/30 p-5 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-electric/15 text-electric">
                  <Download size={18} />
                </div>
                <div>
                  <h3 className="font-display text-sm font-bold text-ink">
                    Export Personal Data Dossier
                  </h3>
                  <p className="text-[11px] text-ink-soft">
                    Article 20 GDPR &bull; Right to Data Portability
                  </p>
                </div>
              </div>

              <p className="text-xs text-ink-soft leading-relaxed">
                Download a complete, machine-readable JSON archive of your candidate record. This dossier includes your contact information, track and domain selections, skills taxonomy, verified credentials, document metadata, application pipelines, and immutable audit events.
              </p>

              <div className="pt-2">
                <button
                  type="button"
                  disabled={isExporting}
                  onClick={handleExport}
                  className="inline-flex items-center gap-2 rounded-xl bg-ink px-4 py-2 font-display text-xs font-semibold text-white shadow-xs hover:bg-electric disabled:opacity-50 transition-colors cursor-pointer"
                >
                  <Download size={14} />
                  <span>{isExporting ? "Compiling Archive..." : "Download JSON Data Export"}</span>
                </button>
              </div>
            </div>

            {/* GDPR Section 2: Right to Erasure / Account Deletion */}
            <div className="rounded-2xl border border-rose-200 bg-rose-50/40 p-5 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
                  <AlertTriangle size={18} />
                </div>
                <div>
                  <h3 className="font-display text-sm font-bold text-rose-900">
                    Right to be Forgotten (Account Deletion)
                  </h3>
                  <p className="text-[11px] text-rose-700">
                    Article 17 GDPR &bull; Right to Erasure
                  </p>
                </div>
              </div>

              <p className="text-xs text-rose-700 leading-relaxed">
                Submitting a deletion request flags your profile for permanent de-indexing from all talent search algorithms. Your active applications will be closed, credentials unlinked, and personal data securely purged in compliance with statutory retention limits.
              </p>

              <form onSubmit={handleRequestDeletion} className="space-y-3 pt-2">
                <div>
                  <label className="block text-[11px] font-mono font-bold text-rose-800 uppercase tracking-wider mb-1">
                    Reason for Deletion *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={deletionReason}
                    onChange={(e) => setDeletionReason(e.target.value)}
                    placeholder="Please let us know why you wish to close your account..."
                    className="w-full rounded-xl border border-rose-300 bg-white px-3.5 py-2 text-xs text-ink placeholder:text-mist focus:border-rose-500 focus:outline-none"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isDeleting}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-rose-300 bg-white px-4 py-2 font-display text-xs font-bold text-rose-600 hover:bg-rose-100 disabled:opacity-50 transition-colors cursor-pointer shadow-2xs"
                  >
                    <span>{isDeleting ? "Submitting..." : "Submit Account Deletion Request"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
