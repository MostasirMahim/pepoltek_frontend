"use client";

import React, { useState } from "react";
import { X, ShieldCheck, Plus, Trash2, CheckCircle, AlertTriangle, Clock } from "@/components/ui/Icons";
import { useCandidatePersona } from "@/context/CandidatePersonaContext";

interface CandidateCredentialsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CandidateCredentialsDrawer({ isOpen, onClose }: CandidateCredentialsDrawerProps) {
  const { credentials, createCredential, deleteCredential } = useCandidatePersona();

  const [name, setName] = useState("");
  const [authority, setAuthority] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddCredential = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    const success = await createCredential({
      name: name.trim(),
      jurisdiction: authority.trim() || undefined,
      issuing_authority: authority.trim() || undefined,
      license_number: licenseNumber.trim() || undefined,
      expires_on: expiresAt || undefined,
      expires_at: expiresAt || undefined,
    });

    setIsSubmitting(false);
    if (success) {
      setName("");
      setAuthority("");
      setLicenseNumber("");
      setExpiresAt("");
      setSuccessMessage("Credential registered into verification queue.");
      setTimeout(() => setSuccessMessage(null), 3500);
    } else {
      setErrorMessage("Failed to register credential. Please review inputs.");
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    const success = await deleteCredential(id);
    setDeletingId(null);
    if (success) {
      setSuccessMessage("Credential removed from candidate dossier.");
      setTimeout(() => setSuccessMessage(null), 2500);
    }
  };

  const getStatusBadge = (status?: string) => {
    const s = (status || "unverified").toLowerCase();
    if (s === "verified") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-signal/15 border border-signal/30 px-2 py-0.5 font-mono text-[10px] font-bold text-signal">
          <CheckCircle size={10} />
          <span>Verified</span>
        </span>
      );
    }
    if (s === "expired") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 border border-rose-200 px-2 py-0.5 font-mono text-[10px] font-bold text-rose-600">
          <AlertTriangle size={10} />
          <span>Expired</span>
        </span>
      );
    }
    if (s === "rejected") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 border border-rose-200 px-2 py-0.5 font-mono text-[10px] font-bold text-rose-600">
          <X size={10} />
          <span>Rejected</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 font-mono text-[10px] font-bold text-amber-600">
        <Clock size={10} />
        <span>In Review</span>
      </span>
    );
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
              <div className="inline-flex items-center gap-1.5 rounded-full bg-signal/15 px-2.5 py-0.5 text-[10px] font-mono font-bold text-signal uppercase tracking-wider mb-1">
                SRS CAN-04 &bull; VET-04
              </div>
              <h2 className="font-display text-lg font-bold text-ink">
                Licenses &amp; Professional Certifications
              </h2>
              <p className="text-xs text-ink-soft">
                Manage clinical practice licenses, cloud certs, and regulatory compliance records.
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

            {/* Active Credentials Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display text-sm font-bold text-ink">
                  Registered Credentials ({credentials.length})
                </h3>
                <span className="text-[11px] font-mono text-mist">Encrypted Storage</span>
              </div>

              {credentials.length === 0 ? (
                <div className="rounded-2xl border border-[#bcd6fa]/60 bg-canvas/30 p-6 text-center text-xs space-y-2">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-canvas text-mist">
                    <ShieldCheck size={20} />
                  </div>
                  <div className="font-display font-bold text-ink">No Credentials Recorded</div>
                  <p className="text-ink-soft text-[11px] leading-relaxed max-w-sm mx-auto">
                    Add state licenses, medical certifications, or cloud architecture badges to boost your readiness index and match priority.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {credentials.map((cred) => (
                    <div
                      key={cred.id}
                      className="rounded-2xl border border-[#bcd6fa] bg-white p-4 shadow-2xs flex items-start justify-between gap-3 transition-all hover:border-electric/60"
                    >
                      <div className="space-y-1 text-xs flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-display font-bold text-ink">{cred.name}</span>
                          {getStatusBadge(cred.status)}
                        </div>
                        <div className="text-[11.5px] text-ink-soft">
                          Authority: <span className="font-semibold text-ink">{cred.jurisdiction || cred.issuing_authority || "State / Board Registry"}</span>
                        </div>
                        {cred.license_number && (
                          <div className="font-mono text-[10.5px] text-mist">
                            License #: {cred.license_number}
                          </div>
                        )}
                        <div className="font-mono text-[10.5px] text-mist">
                          {cred.expires_on || cred.expires_at ? `Expires: ${new Date(cred.expires_on || cred.expires_at!).toLocaleDateString()}` : "No Expiration Date"}
                        </div>
                      </div>

                      <button
                        type="button"
                        disabled={deletingId === cred.id}
                        onClick={() => handleDelete(cred.id)}
                        className="rounded-lg p-1.5 text-mist hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer shrink-0 disabled:opacity-50"
                        title="Delete Credential"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Add New Credential Form */}
            <div className="pt-4 border-t border-[#bcd6fa]/50">
              <h3 className="font-display text-sm font-bold text-ink mb-1">
                Add New License or Certification
              </h3>
              <p className="text-xs text-ink-soft mb-4">
                Submitted credentials undergo automated verification and review by Pepoltek compliance officers.
              </p>

              <form onSubmit={handleAddCredential} className="space-y-4 rounded-2xl border border-[#bcd6fa] bg-canvas/30 p-4">
                <div>
                  <label className="block text-[11px] font-mono font-bold text-ink-soft uppercase tracking-wider mb-1">
                    Credential or License Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Registered Nurse (RN) or AWS Solutions Architect"
                    className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3.5 py-2 text-xs font-semibold text-ink placeholder:text-mist focus:border-electric focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono font-bold text-ink-soft uppercase tracking-wider mb-1">
                      Issuing Authority / State
                    </label>
                    <input
                      type="text"
                      value={authority}
                      onChange={(e) => setAuthority(e.target.value)}
                      placeholder="e.g. California Board of Nursing"
                      className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3.5 py-2 text-xs text-ink placeholder:text-mist focus:border-electric focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono font-bold text-ink-soft uppercase tracking-wider mb-1">
                      License / Certification Number
                    </label>
                    <input
                      type="text"
                      value={licenseNumber}
                      onChange={(e) => setLicenseNumber(e.target.value)}
                      placeholder="e.g. RN-98214820"
                      className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3.5 py-2 text-xs text-ink placeholder:text-mist focus:border-electric focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold text-ink-soft uppercase tracking-wider mb-1">
                    Expiration Date (If Applicable)
                  </label>
                  <input
                    type="date"
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                    className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3.5 py-2 text-xs text-ink focus:border-electric focus:outline-none font-mono"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-ink px-4 py-2 font-display text-xs font-semibold text-white shadow-xs hover:bg-electric disabled:opacity-50 transition-colors cursor-pointer"
                  >
                    <Plus size={13} />
                    <span>{isSubmitting ? "Adding..." : "Add Credential"}</span>
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
