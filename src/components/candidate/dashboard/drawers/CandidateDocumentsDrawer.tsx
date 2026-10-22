"use client";

import React, { useState, useRef } from "react";
import { X, FileText, Upload, Trash2, CheckCircle, AlertTriangle } from "@/components/ui/Icons";
import { useCandidatePersona } from "@/context/CandidatePersonaContext";

interface CandidateDocumentsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CandidateDocumentsDrawer({ isOpen, onClose }: CandidateDocumentsDrawerProps) {
  const { documents, uploadDocument, deleteDocument } = useCandidatePersona();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [docType, setDocType] = useState<string>("resume");
  const [isUploading, setIsUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validExtensions = [".pdf", ".docx", ".rtf"];
      const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
      if (!validExtensions.includes(ext)) {
        setErrorMessage("Invalid format. Only PDF, DOCX, and RTF documents are accepted (SRS PAR-01).");
        setSelectedFile(null);
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setErrorMessage("File exceeds 10 MB limit.");
        setSelectedFile(null);
        return;
      }
      setErrorMessage(null);
      setSelectedFile(file);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsUploading(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("doc_type", docType);

    const success = await uploadDocument(formData);
    setIsUploading(false);

    if (success) {
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setSuccessMessage("Document uploaded and cryptographic SHA-256 fingerprint verified.");
      setTimeout(() => setSuccessMessage(null), 3500);
    } else {
      setErrorMessage("Upload failed. Please verify network connection or file integrity.");
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    const success = await deleteDocument(id);
    setDeletingId(null);
    if (success) {
      setSuccessMessage("Document removed from candidate repository.");
      setTimeout(() => setSuccessMessage(null), 2500);
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
                SRS CAN-09 &bull; PAR-01
              </div>
              <h2 className="font-display text-lg font-bold text-ink">
                Documents &amp; Resume Versions
              </h2>
              <p className="text-xs text-ink-soft">
                Upload new resume versions, verification evidence, and audit-stamped files.
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

            {/* Existing Documents List */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display text-sm font-bold text-ink">
                  Uploaded Documents ({documents.length})
                </h3>
                <span className="text-[11px] font-mono text-mist">Version Controlled</span>
              </div>

              {documents.length === 0 ? (
                <div className="rounded-2xl border border-[#bcd6fa]/60 bg-canvas/30 p-6 text-center text-xs space-y-2">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-canvas text-mist">
                    <FileText size={20} />
                  </div>
                  <div className="font-display font-bold text-ink">No Documents Uploaded</div>
                  <p className="text-ink-soft text-[11px] leading-relaxed max-w-sm mx-auto">
                    Upload your latest CV or resume to enable automated AI parsing, skills extraction, and client requisition matching.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {documents.map((doc) => {
                    const rawName = doc.original_filename || (doc.file_url ? doc.file_url.split("/").pop() || "Document" : "Document");
                    const bytes = doc.size_bytes ?? doc.file_size;
                    const fileSizeKb = bytes ? `${Math.round(bytes / 1024)} KB` : "Standard";
                    return (
                      <div
                        key={doc.id}
                        className="rounded-2xl border border-[#bcd6fa] bg-white p-4 shadow-2xs flex items-start justify-between gap-3 transition-all hover:border-electric/60"
                      >
                        <div className="space-y-1 text-xs flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-display font-bold text-ink truncate max-w-xs">{rawName}</span>
                            <span className="rounded-md bg-electric/10 border border-electric/30 px-1.5 py-0.5 font-mono text-[9.5px] font-bold text-electric uppercase">
                              {doc.doc_type || "Resume"}
                            </span>
                            <span className="rounded-md bg-canvas border border-[#bcd6fa] px-1.5 py-0.5 font-mono text-[9.5px] font-semibold text-ink-soft">
                              v{doc.version || 1}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 text-[11px] text-ink-soft">
                            <span>Size: <strong className="text-ink">{fileSizeKb}</strong></span>
                            <span>Uploaded: <strong className="text-ink">{new Date(doc.created_at).toLocaleDateString()}</strong></span>
                          </div>

                          {doc.sha256_hash && (
                            <div className="font-mono text-[10px] text-mist truncate">
                              SHA-256: {doc.sha256_hash}
                            </div>
                          )}
                        </div>

                        <button
                          type="button"
                          disabled={deletingId === doc.id}
                          onClick={() => handleDelete(doc.id)}
                          className="rounded-lg p-1.5 text-mist hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer shrink-0 disabled:opacity-50"
                          title="Delete Document"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Upload New Version Section */}
            <div className="pt-4 border-t border-[#bcd6fa]/50">
              <h3 className="font-display text-sm font-bold text-ink mb-1">
                Upload New Document or Version
              </h3>
              <p className="text-xs text-ink-soft mb-4">
                Accepted formats: PDF, DOCX, RTF (Max 10 MB). Uploading a new resume version recalculates ATS compatibility.
              </p>

              <form onSubmit={handleUpload} className="space-y-4 rounded-2xl border border-[#bcd6fa] bg-canvas/30 p-4">
                <div>
                  <label className="block text-[11px] font-mono font-bold text-ink-soft uppercase tracking-wider mb-1">
                    Document Category
                  </label>
                  <select
                    value={docType}
                    onChange={(e) => setDocType(e.target.value)}
                    className="w-full rounded-xl border border-[#bcd6fa] bg-white px-3.5 py-2 text-xs font-semibold text-ink focus:border-electric focus:outline-none"
                  >
                    <option value="resume">Resume / Curriculum Vitae</option>
                    <option value="cover_letter">Cover / Motivation Letter</option>
                    <option value="certification">Licensure / Certification Evidence</option>
                    <option value="portfolio">Portfolio / Case Artifact</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-bold text-ink-soft uppercase tracking-wider mb-1">
                    Select File
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.docx,.rtf"
                    onChange={handleFileChange}
                    className="w-full text-xs text-ink file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-ink file:text-white hover:file:bg-electric cursor-pointer"
                  />
                  {selectedFile && (
                    <div className="mt-2 text-xs font-mono text-electric">
                      Selected: {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
                    </div>
                  )}
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={isUploading || !selectedFile}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-electric px-4 py-2 font-display text-xs font-semibold text-white shadow-xs hover:bg-electric-bright disabled:opacity-50 transition-colors cursor-pointer"
                  >
                    <Upload size={14} />
                    <span>{isUploading ? "Uploading..." : "Upload Document"}</span>
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
