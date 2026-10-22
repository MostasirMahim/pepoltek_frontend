"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import {
  Users,
  DollarSign,
  CheckCircle,
  Clock,
  AlertTriangle,
  Search,
  Eye,
  X,
  ChevronRight,
  Award,
  ExternalLink,
  ShieldCheck,
  Check,
} from "@/components/ui/Icons";

import {
  AdminReferralRecord,
  AdminReferralTelemetry,
  updateReferralStageAction,
  getAdminBountyTypesAction,
  createBountyTypeAction,
  updateBountyTypeAction,
  deleteBountyTypeAction,
  BountyTypeItem,
} from "@/actions/referral.actions";

interface AdminReferralsViewProps {
  initialRecords?: AdminReferralRecord[];
  initialTelemetry?: AdminReferralTelemetry;
}

export function AdminReferralsView({
  initialRecords = [],
  initialTelemetry,
}: AdminReferralsViewProps) {
  const [records, setRecords] = useState<AdminReferralRecord[]>(initialRecords);
  const [telemetry, setTelemetry] = useState<AdminReferralTelemetry | undefined>(initialTelemetry);
  const [stageFilter, setStageFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedRecord, setSelectedRecord] = useState<AdminReferralRecord | null>(null);
  const [notification, setNotification] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Stage Transition Sheet Form State
  const [targetStage, setTargetStage] = useState<string>("");
  const [bountyOverride, setBountyOverride] = useState<string>("1500.00");
  const [transitionNote, setTransitionNote] = useState<string>("");

  // Bounty Types Catalog Sheet Drawer State
  const [isBountyCatalogOpen, setIsBountyCatalogOpen] = useState(false);
  const [bountyTypes, setBountyTypes] = useState<BountyTypeItem[]>([]);
  const [isLoadingBountyTypes, setIsLoadingBountyTypes] = useState(false);
  const [editingBountyType, setEditingBountyType] = useState<BountyTypeItem | null>(null);

  // Bounty Type Form
  const [btName, setBtName] = useState("");
  const [btAmount, setBtAmount] = useState("1500");
  const [btValidityDays, setBtValidityDays] = useState("90");
  const [btDescription, setBtDescription] = useState("");
  const [btSortOrder, setBtSortOrder] = useState("0");
  const [isSavingBountyType, setIsSavingBountyType] = useState(false);

  const [isPending, startTransition] = useTransition();

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setNotification({ type, text });
    setTimeout(() => setNotification(null), 5000);
  };

  const loadBountyTypes = async () => {
    setIsLoadingBountyTypes(true);
    const res = await getAdminBountyTypesAction();
    setIsLoadingBountyTypes(false);
    if (res.success && res.data) {
      setBountyTypes(res.data);
    }
  };

  const handleOpenBountyCatalog = () => {
    setIsBountyCatalogOpen(true);
    resetBountyTypeForm();
    loadBountyTypes();
  };

  const resetBountyTypeForm = () => {
    setEditingBountyType(null);
    setBtName("");
    setBtAmount("1500");
    setBtValidityDays("90");
    setBtDescription("");
    setBtSortOrder("0");
  };

  const handleEditBountyType = (bt: BountyTypeItem) => {
    setEditingBountyType(bt);
    setBtName(bt.name);
    setBtAmount(String(bt.amount));
    setBtValidityDays(String(bt.validity_days));
    setBtDescription(bt.description || "");
    setBtSortOrder(String(bt.sort_order));
  };

  const handleSaveBountyType = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!btName.trim()) {
      showToast("Please enter a Bounty Type Name.", "error");
      return;
    }
    const amt = parseFloat(btAmount);
    if (isNaN(amt) || amt <= 0) {
      showToast("Please enter a valid positive bounty amount.", "error");
      return;
    }

    setIsSavingBountyType(true);

    if (editingBountyType) {
      const res = await updateBountyTypeAction(editingBountyType.id, {
        name: btName.trim(),
        amount: amt,
        validity_days: parseInt(btValidityDays) || 90,
        description: btDescription.trim(),
        sort_order: parseInt(btSortOrder) || 0,
      });
      setIsSavingBountyType(false);
      if (res.success && res.data) {
        showToast(`Bounty type "${res.data.name}" updated successfully.`);
        resetBountyTypeForm();
        loadBountyTypes();
      } else {
        showToast(res.error || "Failed to update bounty type.", "error");
      }
    } else {
      const res = await createBountyTypeAction({
        name: btName.trim(),
        amount: amt,
        validity_days: parseInt(btValidityDays) || 90,
        description: btDescription.trim(),
        sort_order: parseInt(btSortOrder) || 0,
      });
      setIsSavingBountyType(false);
      if (res.success && res.data) {
        showToast(`Bounty type "${res.data.name}" created successfully.`);
        resetBountyTypeForm();
        loadBountyTypes();
      } else {
        showToast(res.error || "Failed to create bounty type.", "error");
      }
    }
  };

  const handleToggleBountyTypeStatus = async (bt: BountyTypeItem) => {
    const nextStatus = !bt.is_active;
    const res = await updateBountyTypeAction(bt.id, { is_active: nextStatus });
    if (res.success) {
      showToast(`Bounty type "${bt.name}" is now ${nextStatus ? "Active" : "Inactive"}.`);
      loadBountyTypes();
    } else {
      showToast(res.error || "Failed to toggle status.", "error");
    }
  };

  const openDrawer = (record: AdminReferralRecord) => {
    setSelectedRecord(record);
    setTargetStage(record.stage);
    setBountyOverride(
      record.bounty?.has_bounty
        ? record.bounty.amount_usd.toFixed(2)
        : "1500.00"
    );
    setTransitionNote("");
  };

  const closeDrawer = () => {
    setSelectedRecord(null);
  };

  // Filter & Search Records
  const filteredRecords = records.filter((r) => {
    const matchesFilter =
      stageFilter === "all" ? true : r.stage.toLowerCase() === stageFilter.toLowerCase();
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      r.id.toLowerCase().includes(q) ||
      r.candidate_name.toLowerCase().includes(q) ||
      r.candidate_email.toLowerCase().includes(q) ||
      r.referrer.name.toLowerCase().includes(q) ||
      r.referrer.email.toLowerCase().includes(q) ||
      r.referrer.referral_code.toLowerCase().includes(q) ||
      r.track.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  const handleStageUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecord) return;
    if (!targetStage) {
      showToast("Please choose a target stage.", "error");
      return;
    }

    startTransition(async () => {
      const payload: { stage: string; bounty_amount?: number; note?: string } = {
        stage: targetStage,
        note: transitionNote.trim() || undefined,
      };

      if (targetStage === "placed") {
        const parsedBounty = parseFloat(bountyOverride);
        if (!isNaN(parsedBounty) && parsedBounty > 0) {
          payload.bounty_amount = parsedBounty;
        }
      }

      const res = await updateReferralStageAction(selectedRecord.raw_id, payload);
      if (res.success && res.data) {
        const updatedStage = res.data.stage;
        const updatedStageDisplay = res.data.stage_display;
        const createdLedger = res.data.created_ledger;

        // Update local state
        setRecords((prev) =>
          prev.map((r) => {
            if (r.raw_id === selectedRecord.raw_id) {
              const updatedBounty = createdLedger
                ? {
                    has_bounty: true,
                    amount_usd: createdLedger.amount,
                    amount_display: createdLedger.amount_display,
                    status: createdLedger.status,
                    status_display: "Pending Escrow Approval",
                    ledger_id: createdLedger.id,
                    raw_ledger_id: createdLedger.raw_id,
                    paid_reference: null,
                  }
                : r.bounty;

              return {
                ...r,
                stage: updatedStage,
                stage_display: updatedStageDisplay,
                bounty: updatedBounty,
              };
            }
            return r;
          })
        );

        setSelectedRecord((prev) => {
          if (!prev) return null;
          const updatedBounty = createdLedger
            ? {
                has_bounty: true,
                amount_usd: createdLedger.amount,
                amount_display: createdLedger.amount_display,
                status: createdLedger.status,
                status_display: "Pending Escrow Approval",
                ledger_id: createdLedger.id,
                raw_ledger_id: createdLedger.raw_id,
                paid_reference: null,
              }
            : prev.bounty;

          return {
            ...prev,
            stage: updatedStage,
            stage_display: updatedStageDisplay,
            bounty: updatedBounty,
          };
        });

        // Update telemetry counters
        if (telemetry) {
          const wasPlaced = selectedRecord.stage === "placed";
          const isNowPlaced = updatedStage === "placed";
          const newPlacedCount =
            telemetry.placed_count + (!wasPlaced && isNowPlaced ? 1 : wasPlaced && !isNowPlaced ? -1 : 0);
          const newConversionRate =
            telemetry.total_referrals > 0
              ? Math.round((newPlacedCount / telemetry.total_referrals) * 1000) / 10
              : 0;

          setTelemetry({
            ...telemetry,
            placed_count: newPlacedCount,
            conversion_rate: newConversionRate,
            stage_counts: {
              ...telemetry.stage_counts,
              [selectedRecord.stage]: Math.max(0, (telemetry.stage_counts[selectedRecord.stage] || 1) - 1),
              [updatedStage]: (telemetry.stage_counts[updatedStage] || 0) + 1,
            },
          });
        }

        if (createdLedger) {
          showToast(
            `Referral moved to Placed. Escrow payout of ${createdLedger.amount_display} (${createdLedger.id}) minted automatically.`
          );
        } else {
          showToast(`Referral stage updated to ${updatedStageDisplay}.`);
        }
      } else {
        showToast(res.error || "Failed to update referral stage.", "error");
      }
    });
  };

  const handleQuickAdvance = (record: AdminReferralRecord, nextStage: string, e: React.MouseEvent) => {
    e.stopPropagation();
    startTransition(async () => {
      const res = await updateReferralStageAction(record.raw_id, {
        stage: nextStage,
        note: `Quick advance to ${nextStage} via pipeline table.`,
      });

      if (res.success && res.data) {
        const updatedStage = res.data.stage;
        const updatedStageDisplay = res.data.stage_display;
        const createdLedger = res.data.created_ledger;

        setRecords((prev) =>
          prev.map((r) => {
            if (r.raw_id === record.raw_id) {
              const updatedBounty = createdLedger
                ? {
                    has_bounty: true,
                    amount_usd: createdLedger.amount,
                    amount_display: createdLedger.amount_display,
                    status: createdLedger.status,
                    status_display: "Pending Escrow Approval",
                    ledger_id: createdLedger.id,
                    raw_ledger_id: createdLedger.raw_id,
                    paid_reference: null,
                  }
                : r.bounty;

              return {
                ...r,
                stage: updatedStage,
                stage_display: updatedStageDisplay,
                bounty: updatedBounty,
              };
            }
            return r;
          })
        );

        if (createdLedger) {
          showToast(
            `Candidate placed! Escrow payout ${createdLedger.amount_display} (${createdLedger.id}) initialized.`
          );
        } else {
          showToast(`Referral advanced to ${updatedStageDisplay}.`);
        }
      } else {
        showToast(res.error || "Failed to advance stage.", "error");
      }
    });
  };

  const handleExportCSV = () => {
    const headers = [
      "Referral ID",
      "Date",
      "Talent Scout",
      "Scout Email",
      "Scout Code",
      "Candidate Name",
      "Candidate Email",
      "Track",
      "Stage",
      "Bounty Status",
      "Bounty Amount",
      "Ledger ID",
    ];

    const rows = filteredRecords.map((r) => [
      r.id,
      r.date,
      `"${r.referrer.name.replace(/"/g, '""')}"`,
      `"${r.referrer.email}"`,
      r.referrer.referral_code,
      `"${r.candidate_name.replace(/"/g, '""')}"`,
      `"${r.candidate_email}"`,
      `"${r.track.replace(/"/g, '""')}"`,
      r.stage_display,
      r.bounty?.has_bounty ? r.bounty.status_display : "Unminted",
      r.bounty?.amount_usd ? r.bounty.amount_usd.toFixed(2) : "1500.00",
      r.bounty?.ledger_id || "N/A",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `pepoltek_referrals_pipeline_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStageBadge = (stage: string, stageDisplay: string) => {
    switch (stage.toLowerCase()) {
      case "placed":
        return (
          <span className="font-mono text-[10.5px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 inline-flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {stageDisplay}
          </span>
        );
      case "interviewed":
        return (
          <span className="font-mono text-[10.5px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 inline-flex items-center">
            {stageDisplay}
          </span>
        );
      case "screened":
        return (
          <span className="font-mono text-[10.5px] font-semibold text-sky-800 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200 inline-flex items-center">
            {stageDisplay}
          </span>
        );
      case "submitted":
        return (
          <span className="font-mono text-[10.5px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200 inline-flex items-center">
            {stageDisplay}
          </span>
        );
      case "rejected":
        return (
          <span className="font-mono text-[10.5px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200 inline-flex items-center">
            {stageDisplay}
          </span>
        );
      case "duplicate":
        return (
          <span className="font-mono text-[10.5px] font-semibold text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded-full border border-neutral-200 inline-flex items-center">
            {stageDisplay}
          </span>
        );
      default:
        return (
          <span className="font-mono text-[10.5px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200 inline-flex items-center">
            {stageDisplay}
          </span>
        );
    }
  };

  const getBountyBadge = (bounty: AdminReferralRecord["bounty"], stage: string) => {
    if (stage === "placed" && bounty?.has_bounty) {
      if (bounty.status === "paid") {
        return (
          <div className="flex flex-col">
            <span className="font-display text-xs font-bold text-emerald-700">{bounty.amount_display}</span>
            <span className="font-mono text-[9.5px] text-emerald-600 font-medium">Cleared &amp; Disbursed</span>
          </div>
        );
      }
      if (bounty.status === "approved") {
        return (
          <div className="flex flex-col">
            <span className="font-display text-xs font-bold text-electric">{bounty.amount_display}</span>
            <span className="font-mono text-[9.5px] text-electric font-medium">Approved for Wire</span>
          </div>
        );
      }
      return (
        <div className="flex flex-col">
          <span className="font-display text-xs font-bold text-amber-700">{bounty.amount_display}</span>
          <span className="font-mono text-[9.5px] text-amber-600 font-medium">Pending Escrow Signoff</span>
        </div>
      );
    }

    if (stage === "rejected" || stage === "duplicate") {
      return (
        <div className="flex flex-col">
          <span className="font-mono text-xs text-slate-400 font-medium">$0.00</span>
          <span className="font-mono text-[9.5px] text-slate-400">Ineligible</span>
        </div>
      );
    }

    return (
      <div className="flex flex-col">
        <span className="font-display text-xs font-semibold text-slate-500">$1,500.00</span>
        <span className="font-mono text-[9.5px] text-mist">Earned on Placement</span>
      </div>
    );
  };

  const stageCounts = telemetry?.stage_counts || {
    all: records.length,
    submitted: records.filter((r) => r.stage === "submitted").length,
    screened: records.filter((r) => r.stage === "screened").length,
    interviewed: records.filter((r) => r.stage === "interviewed").length,
    placed: records.filter((r) => r.stage === "placed").length,
    rejected: records.filter((r) => r.stage === "rejected").length,
    duplicate: records.filter((r) => r.stage === "duplicate").length,
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-electric/30 bg-electric/10 px-3 py-0.5 text-xs font-semibold text-electric">
            <Users size={13} />
            <span>TALENT SCOUT FUNNEL &amp; ESCROW BOUNTY PIPELINE</span>
          </div>
          <h1 className="mt-2 font-display text-2xl font-bold text-ink">
            Candidate Referral Pipeline
          </h1>
          <p className="text-xs text-ink-soft">
            Track scout nominations through recruitment stages, qualify candidates for placement, and authorize escrow bounties.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleOpenBountyCatalog}
            className="rounded-xl border border-electric/30 bg-electric/10 px-3.5 py-2 font-display text-xs font-semibold text-electric shadow-2xs hover:bg-electric/20 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Award size={14} className="text-electric" />
            <span>Manage Bounty Catalog</span>
          </button>

          <Link
            href="/admin/finance"
            className="rounded-xl border border-[#bcd6fa] bg-white px-3.5 py-2 font-display text-xs font-semibold text-ink shadow-2xs hover:bg-canvas transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            <DollarSign size={13} className="text-signal" />
            <span>Open Escrow Vault</span>
          </Link>

          <button
            type="button"
            onClick={handleExportCSV}
            className="rounded-xl bg-ink px-4 py-2 font-display text-xs font-semibold text-white shadow-xs hover:bg-electric transition-colors cursor-pointer"
          >
            Export Pipeline (CSV)
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div
          className={`rounded-xl border px-4 py-2.5 text-xs font-semibold flex items-center gap-2 animate-in fade-in-0 duration-200 ${
            notification.type === "success"
              ? "border-signal/30 bg-signal/10 text-signal"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {notification.type === "success" ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
          <span>{notification.text}</span>
        </div>
      )}

      {/* Telemetry Funnel Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-3xl border border-[#bcd6fa] bg-white p-6 shadow-xs space-y-2">
          <span className="font-mono text-xs text-mist uppercase tracking-wider block">
            Total Nominations
          </span>
          <div className="font-display text-2xl sm:text-3xl font-extrabold text-ink">
            {telemetry?.total_referrals ?? records.length}
          </div>
          <p className="text-[11px] text-ink-soft font-medium">Platform-wide candidate referrals</p>
        </div>

        <div className="rounded-3xl border border-[#bcd6fa] bg-white p-6 shadow-xs space-y-2">
          <span className="font-mono text-xs text-mist uppercase tracking-wider block">
            Active Talent Scouts
          </span>
          <div className="font-display text-2xl sm:text-3xl font-extrabold text-ink">
            {telemetry?.active_scouts ?? 0}
          </div>
          <p className="text-[11px] text-signal font-semibold">Community and employee referrers</p>
        </div>

        <div className="rounded-3xl border border-[#bcd6fa] bg-white p-6 shadow-xs space-y-2">
          <span className="font-mono text-xs text-mist uppercase tracking-wider block">
            Placed Candidates
          </span>
          <div className="font-display text-2xl sm:text-3xl font-extrabold text-emerald-600">
            {telemetry?.placed_count ?? 0}
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold">
            {telemetry?.placed_count ?? 0} candidates earned $1,500 bounty
          </p>
        </div>

        <div className="rounded-3xl border border-[#bcd6fa] bg-white p-6 shadow-xs space-y-2">
          <span className="font-mono text-xs text-mist uppercase tracking-wider block">
            Funnel Win Rate
          </span>
          <div className="font-display text-2xl sm:text-3xl font-extrabold text-electric">
            {(telemetry?.conversion_rate ?? 0).toFixed(1)}%
          </div>
          <p className="text-[11px] text-ink-soft font-medium">Submission to placement conversion</p>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 rounded-2xl border border-[#bcd6fa]/70 bg-white p-2.5 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto thin-scrollbar pb-1 lg:pb-0">
          {[
            { id: "all", label: `All (${stageCounts.all ?? records.length})` },
            { id: "submitted", label: `Submitted (${stageCounts.submitted ?? 0})` },
            { id: "screened", label: `Screened (${stageCounts.screened ?? 0})` },
            { id: "interviewed", label: `Interviewed (${stageCounts.interviewed ?? 0})` },
            { id: "placed", label: `Placed (${stageCounts.placed ?? 0})` },
            { id: "rejected", label: `Rejected (${stageCounts.rejected ?? 0})` },
            { id: "duplicate", label: `Duplicate (${stageCounts.duplicate ?? 0})` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStageFilter(tab.id)}
              className={`rounded-lg px-2.5 py-1.5 font-mono text-[11px] font-medium whitespace-nowrap transition-all cursor-pointer ${
                stageFilter === tab.id
                  ? "bg-ink text-white shadow-xs"
                  : "text-ink-soft hover:bg-canvas hover:text-ink"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-mist" size={13} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search candidate, scout, track, ID..."
              className="w-52 sm:w-64 rounded-lg border border-[#bcd6fa]/70 bg-slate-50/60 pl-8 pr-3 py-1.5 font-mono text-xs text-ink placeholder:text-mist focus:border-electric focus:bg-white focus:outline-hidden"
            />
          </div>
          <span className="font-mono text-[10.5px] text-slate-400 whitespace-nowrap hidden sm:inline">
            Showing {filteredRecords.length} nominations
          </span>
        </div>
      </div>

      {/* Referral Pipeline Table: Strict Single-Line Rows & Compact Padding */}
      <div className="rounded-2xl border border-[#bcd6fa]/70 bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto thin-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="border-b border-[#bcd6fa]/60 bg-slate-50/80 font-mono text-[10px] text-slate-500 uppercase tracking-wider select-none">
              <tr>
                <th className="px-4 py-2.5 font-semibold text-slate-600 whitespace-nowrap w-[150px]">
                  ID &amp; Date
                </th>
                <th className="px-4 py-2.5 font-semibold text-slate-600 whitespace-nowrap">
                  Talent Scout (Referrer)
                </th>
                <th className="px-4 py-2.5 font-semibold text-slate-600 whitespace-nowrap">
                  Nominated Candidate
                </th>
                <th className="px-4 py-2.5 font-semibold text-slate-600 whitespace-nowrap">
                  Domain Track / Role
                </th>
                <th className="px-4 py-2.5 font-semibold text-slate-600 whitespace-nowrap">
                  Funnel Stage
                </th>
                <th className="px-4 py-2.5 font-semibold text-slate-600 whitespace-nowrap">
                  Escrow Bounty
                </th>
                <th className="px-4 py-2.5 font-semibold text-slate-600 whitespace-nowrap text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#bcd6fa]/40 font-mono text-xs">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-ink-soft">
                    <Users size={32} className="mx-auto text-mist mb-2" />
                    <p className="font-display font-medium text-sm text-ink">
                      No referrals found matching the filter criteria.
                    </p>
                    <p className="text-xs text-mist mt-0.5">
                      Adjust stage tabs or search terms to inspect entries.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredRecords.map((r) => (
                  <tr
                    key={r.raw_id}
                    onClick={() => openDrawer(r)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  >
                    {/* ID & Date */}
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <div className="font-mono text-xs font-bold text-electric group-hover:underline">
                        {r.id}
                      </div>
                      <div className="text-[10px] text-mist">{r.date}</div>
                    </td>

                    {/* Talent Scout (Referrer) */}
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <div className="font-semibold text-ink text-xs">{r.referrer.name}</div>
                      <div className="text-[10.5px] text-ink-soft flex items-center gap-1.5">
                        <span>{r.referrer.email}</span>
                        <span className="font-mono text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded border border-slate-200">
                          {r.referrer.referral_code}
                        </span>
                      </div>
                    </td>

                    {/* Nominated Candidate */}
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <div className="font-bold text-ink text-xs">{r.candidate_name}</div>
                      <div className="text-[10.5px] text-ink-soft">{r.candidate_email || "Direct Nomination"}</div>
                      <div className="flex items-center gap-1 mt-0.5">
                        {r.referral_scope === "specific_job" ? (
                          <span className="rounded px-1.5 py-0.2 font-mono text-[9px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                            Specific Job
                          </span>
                        ) : (
                          <span className="rounded px-1.5 py-0.2 font-mono text-[9px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            General Invite (1st Job)
                          </span>
                        )}
                        {r.bounty_locked && (
                          <span className="rounded px-1.5 py-0.2 font-mono text-[9px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                            Locked
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Track / Role */}
                    <td className="px-4 py-2.5 whitespace-nowrap text-ink-soft text-xs max-w-[200px] truncate">
                      {r.track}
                    </td>

                    {/* Funnel Stage */}
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      {getStageBadge(r.stage, r.stage_display)}
                    </td>

                    {/* Escrow Bounty */}
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      {getBountyBadge(r.bounty, r.stage)}
                    </td>

                    {/* Actions: Strict Single-Line View Button + Quick Stage Transitions */}
                    <td className="px-4 py-2.5 whitespace-nowrap text-right">
                      <div className="inline-flex items-center gap-1.5 justify-end" onClick={(e) => e.stopPropagation()}>
                        {/* Primary View Action Button */}
                        <button
                          type="button"
                          onClick={() => openDrawer(r)}
                          className="inline-flex h-7 items-center gap-1 px-2.5 rounded-md border border-[#bcd6fa] bg-white font-mono text-[11px] font-semibold text-ink hover:bg-canvas hover:border-electric transition-colors shadow-2xs cursor-pointer"
                        >
                          <Eye size={12} className="text-electric" />
                          <span>View</span>
                        </button>

                        {/* Quick Action Button based on current stage */}
                        {r.stage === "submitted" && (
                          <button
                            type="button"
                            disabled={isPending}
                            onClick={(e) => handleQuickAdvance(r, "screened", e)}
                            className="inline-flex h-7 items-center px-2 rounded-md bg-sky-50 font-mono text-[10.5px] font-semibold text-sky-800 border border-sky-200 hover:bg-sky-100 transition-colors cursor-pointer"
                          >
                            Screen
                          </button>
                        )}

                        {r.stage === "screened" && (
                          <button
                            type="button"
                            disabled={isPending}
                            onClick={(e) => handleQuickAdvance(r, "interviewed", e)}
                            className="inline-flex h-7 items-center px-2 rounded-md bg-amber-50 font-mono text-[10.5px] font-semibold text-amber-800 border border-amber-200 hover:bg-amber-100 transition-colors cursor-pointer"
                          >
                            Interview
                          </button>
                        )}

                        {r.stage === "interviewed" && (
                          <button
                            type="button"
                            disabled={isPending}
                            onClick={(e) => handleQuickAdvance(r, "placed", e)}
                            className="inline-flex h-7 items-center px-2.5 rounded-md bg-emerald-600 font-mono text-[10.5px] font-semibold text-white hover:bg-emerald-700 transition-colors shadow-2xs cursor-pointer"
                          >
                            Place Candidate
                          </button>
                        )}

                        {r.stage === "placed" && (
                          <Link
                            href="/admin/finance"
                            className="inline-flex h-7 items-center gap-1 px-2 rounded-md bg-slate-50 font-mono text-[10.5px] font-medium text-slate-700 border border-slate-200 hover:bg-canvas transition-colors cursor-pointer"
                          >
                            <DollarSign size={11} className="text-signal" />
                            <span>Escrow</span>
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right-Side Slide-Over Sheet Drawer (House Style Rule & Design Directive) */}
      {selectedRecord && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-ink/40 backdrop-blur-xs animate-in fade-in-0 duration-150"
          onClick={closeDrawer}
        >
          <div
            className="w-full md:w-1/2 lg:w-1/2 md:max-w-[50vw] bg-white h-full shadow-2xl p-6 sm:p-8 flex flex-col justify-between overflow-y-auto thin-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-6">
              {/* Sheet Header */}
              <div className="flex items-start justify-between border-b border-[#bcd6fa]/40 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-electric">
                      {selectedRecord.id}
                    </span>
                    {getStageBadge(selectedRecord.stage, selectedRecord.stage_display)}
                  </div>
                  <h2 className="font-display text-2xl font-bold text-ink mt-2">
                    {selectedRecord.candidate_name}
                  </h2>
                  <p className="text-xs text-ink-soft">
                    {selectedRecord.track}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeDrawer}
                  className="rounded-xl p-2 text-ink-soft hover:bg-canvas cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Talent Scout (Referrer) Dossier Card */}
              <div className="rounded-2xl border border-[#bcd6fa]/60 bg-canvas/30 p-4 space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-mist uppercase tracking-wider block">
                    Talent Scout Beneficiary
                  </span>
                  <span className="font-mono text-[10px] bg-electric/10 text-electric font-bold px-2 py-0.5 rounded-full border border-electric/25">
                    {selectedRecord.referrer.referral_code}
                  </span>
                </div>

                <div className="flex justify-between py-1 border-b border-[#bcd6fa]/30">
                  <span className="text-ink-soft">Scout Full Name:</span>
                  <span className="font-bold text-ink">{selectedRecord.referrer.name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#bcd6fa]/30">
                  <span className="text-ink-soft">Scout Contact:</span>
                  <span className="font-mono text-ink">{selectedRecord.referrer.email}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#bcd6fa]/30">
                  <span className="text-ink-soft">Attribution Source:</span>
                  <span className="font-medium text-ink">{selectedRecord.source_display}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#bcd6fa]/30">
                  <span className="text-ink-soft">Referral Scope:</span>
                  <span className="font-semibold text-ink">
                    {selectedRecord.referral_scope === "specific_job"
                      ? "Specific Job Referral"
                      : "General Candidate Invite (1st Job Only)"}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-ink-soft">Bounty Lock Status:</span>
                  <span
                    className={`font-mono font-semibold ${
                      selectedRecord.bounty_locked ? "text-amber-700" : "text-emerald-700"
                    }`}
                  >
                    {selectedRecord.bounty_locked
                      ? "Locked (1st Placement Earned)"
                      : "Eligible for Placement"}
                  </span>
                </div>
              </div>

              {/* Nominated Candidate Profile Card */}
              <div className="rounded-2xl border border-[#bcd6fa]/60 bg-white p-4 space-y-2.5 text-xs shadow-2xs">
                <span className="font-mono text-[10px] text-mist uppercase tracking-wider block">
                  Nominated Candidate Dossier
                </span>
                <div className="flex justify-between py-1 border-b border-[#bcd6fa]/30">
                  <span className="text-ink-soft">Candidate Name:</span>
                  <span className="font-bold text-ink">{selectedRecord.candidate_name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#bcd6fa]/30">
                  <span className="text-ink-soft">Candidate Email:</span>
                  <span className="font-mono text-ink">{selectedRecord.candidate_email || "Direct Entry"}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#bcd6fa]/30">
                  <span className="text-ink-soft">Domain Track:</span>
                  <span className="font-semibold text-ink">{selectedRecord.track}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-ink-soft">Nomination Date:</span>
                  <span className="font-mono text-ink">{selectedRecord.date}</span>
                </div>
              </div>

              {/* Escrow Bounty Status Card */}
              <div className="rounded-2xl border border-signal/30 bg-signal/5 p-4 space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-signal uppercase tracking-wider font-bold">
                    Escrow Bounty Entitlement
                  </span>
                  <span className="font-display text-sm font-bold text-ink">
                    {selectedRecord.bounty?.has_bounty
                      ? selectedRecord.bounty.amount_display
                      : "$1,500.00"}
                  </span>
                </div>

                <div className="flex justify-between py-1 border-b border-signal/20">
                  <span className="text-ink-soft">Payout Settlement Status:</span>
                  <span className="font-semibold text-ink">
                    {selectedRecord.bounty?.has_bounty
                      ? selectedRecord.bounty.status_display
                      : "Unminted (Pending Placement)"}
                  </span>
                </div>

                {selectedRecord.bounty?.ledger_id && (
                  <div className="flex justify-between items-center py-1 border-b border-signal/20">
                    <span className="text-ink-soft">Ledger Audit Reference:</span>
                    <span className="font-mono font-bold text-electric">
                      {selectedRecord.bounty.ledger_id}
                    </span>
                  </div>
                )}

                {selectedRecord.bounty?.has_bounty && (
                  <div className="pt-2">
                    <Link
                      href="/admin/finance"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-electric hover:underline"
                    >
                      <span>Authorize wire disbursement in Escrow Console</span>
                      <ExternalLink size={12} />
                    </Link>
                  </div>
                )}
              </div>

              {/* Stage Transition Control Engine */}
              <form onSubmit={handleStageUpdate} className="space-y-4 pt-2 border-t border-[#bcd6fa]/40">
                <div>
                  <label className="block font-mono text-[11px] font-semibold text-ink uppercase mb-1.5">
                    Transition Funnel Stage
                  </label>
                  <select
                    value={targetStage}
                    onChange={(e) => setTargetStage(e.target.value)}
                    className="w-full rounded-xl border border-[#bcd6fa] bg-slate-50/70 p-2.5 text-xs font-medium text-ink focus:border-electric focus:bg-white focus:outline-hidden"
                  >
                    <option value="submitted">Submitted (Awaiting Initial Screen)</option>
                    <option value="screened">Screened (Passed Recruiter Vetting)</option>
                    <option value="interviewed">Interviewed (Technical Screening)</option>
                    <option value="placed">Placed &amp; Integrated</option>
                    <option value="rejected">Rejected (Does Not Meet Bar)</option>
                    <option value="duplicate">Duplicate Claim (Prior Attribution Recorded)</option>
                  </select>
                </div>

                {/* If stage is placed and bounty locked: warn that no bounty will be minted */}
                {targetStage === "placed" && selectedRecord.bounty_locked && (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 space-y-1">
                    <div className="font-semibold flex items-center gap-1.5">
                      <AlertTriangle size={14} />
                      <span>Bounty Locked: First Job Placement Already Paid</span>
                    </div>
                    <p className="text-[11px] text-amber-700 leading-snug">
                      Per the refer and earn business rules, general candidate invitations earn a bounty only on their first placement. Subsequent placements do not mint additional bounties.
                    </p>
                  </div>
                )}

                {/* If stage is placed and not locked: allow bounty configuration */}
                {targetStage === "placed" && !selectedRecord.bounty_locked && (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-3.5 space-y-2 animate-in fade-in-0 duration-150">
                    <div className="flex items-center gap-2 text-emerald-800 font-semibold text-xs">
                      <Award size={14} />
                      <span>Automatic Escrow Bounty Minting</span>
                    </div>
                    <p className="text-[11px] text-emerald-700 leading-snug">
                      Placing this candidate will automatically mint an immutable Escrow Ledger entry for {selectedRecord.referrer.name}.
                    </p>
                    <div className="pt-1">
                      <label className="block font-mono text-[10px] text-emerald-900 uppercase font-semibold mb-1">
                        Bounty Amount (USD)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="100"
                        value={bountyOverride}
                        onChange={(e) => setBountyOverride(e.target.value)}
                        className="w-full rounded-lg border border-emerald-300 bg-white px-3 py-1.5 font-mono text-xs text-ink focus:border-emerald-500 focus:outline-hidden"
                      />
                    </div>
                  </div>
                )}

                {/* Admin Transition Note */}
                <div>
                  <label className="block font-mono text-[11px] font-semibold text-ink uppercase mb-1.5">
                    Admin Audit Rationale (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={transitionNote}
                    onChange={(e) => setTransitionNote(e.target.value)}
                    placeholder="Enter context, requisition code, or interview notes for audit logs..."
                    className="w-full rounded-xl border border-[#bcd6fa] bg-slate-50/70 p-2.5 text-xs text-ink placeholder:text-mist focus:border-electric focus:bg-white focus:outline-hidden"
                  />
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={closeDrawer}
                    className="rounded-xl border border-[#bcd6fa] px-4 py-2 font-display text-xs font-semibold text-ink-soft hover:bg-canvas transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    disabled={isPending || targetStage === selectedRecord.stage}
                    className="rounded-xl bg-ink px-5 py-2 font-display text-xs font-semibold text-white shadow-xs hover:bg-electric transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isPending ? "Updating Stage..." : "Save Stage Transition"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Right-Side Sheet Drawer: Bounty Types Catalog Management */}
      {isBountyCatalogOpen && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-ink/40 backdrop-blur-xs animate-in fade-in-0 duration-150"
          onClick={() => setIsBountyCatalogOpen(false)}
        >
          <div
            className="w-full md:w-1/2 lg:w-1/2 md:max-w-[50vw] bg-white h-full shadow-2xl p-6 sm:p-8 flex flex-col justify-between overflow-y-auto thin-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-6">
              {/* Sheet Header */}
              <div className="flex items-start justify-between border-b border-[#bcd6fa]/40 pb-4">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-electric/30 bg-electric/10 px-3 py-0.5 font-mono text-[11px] font-bold text-electric uppercase">
                    <Award size={13} />
                    <span>BOUNTY TYPES CATALOG</span>
                  </div>
                  <h2 className="font-display text-2xl font-bold text-ink mt-2">
                    Structured Referral Bounties
                  </h2>
                  <p className="text-xs text-ink-soft">
                    Manage standard catalog rewards recruiters attach to active job posts.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsBountyCatalogOpen(false)}
                  className="rounded-xl p-2 text-ink-soft hover:bg-canvas cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Bounty Types List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-sm font-bold text-ink">
                    Catalog Entries ({bountyTypes.length})
                  </h3>
                  <button
                    type="button"
                    onClick={resetBountyTypeForm}
                    className="font-mono text-xs text-electric hover:underline cursor-pointer"
                  >
                    + Add New
                  </button>
                </div>

                {isLoadingBountyTypes ? (
                  <div className="p-6 text-center text-xs text-mist font-mono">
                    Loading catalog entries...
                  </div>
                ) : bountyTypes.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-[#bcd6fa] p-6 text-center text-xs text-ink-soft">
                    No bounty types found. Create one below to enable recruiter job bounties.
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-60 overflow-y-auto thin-scrollbar pr-1">
                    {bountyTypes.map((bt) => (
                      <div
                        key={bt.id}
                        className={`rounded-xl border p-3.5 transition-all flex items-center justify-between gap-3 ${
                          editingBountyType?.id === bt.id
                            ? "border-electric bg-electric/5"
                            : "border-[#bcd6fa]/60 bg-white hover:border-electric"
                        }`}
                      >
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-display text-xs font-bold text-ink">
                              {bt.name}
                            </span>
                            <span
                              className={`rounded-full px-2 py-0.2 font-mono text-[9px] font-bold ${
                                bt.is_active
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : "bg-slate-100 text-slate-500 border border-slate-200"
                              }`}
                            >
                              {bt.is_active ? "Active" : "Inactive"}
                            </span>
                          </div>
                          {bt.description && (
                            <p className="text-[11px] text-ink-soft line-clamp-1">
                              {bt.description}
                            </p>
                          )}
                          <div className="flex items-center gap-3 font-mono text-[10.5px] text-mist">
                            <span className="font-bold text-ink">{bt.amount_display} USD</span>
                            <span>Validity: {bt.validity_days} days</span>
                            <span>Order: #{bt.sort_order}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleEditBountyType(bt)}
                            className="rounded-lg border border-[#bcd6fa] px-2.5 py-1 font-mono text-[10.5px] font-semibold text-ink hover:bg-canvas transition-colors cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleBountyTypeStatus(bt)}
                            className={`rounded-lg border px-2.5 py-1 font-mono text-[10.5px] font-semibold transition-colors cursor-pointer ${
                              bt.is_active
                                ? "border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100"
                                : "border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                            }`}
                          >
                            {bt.is_active ? "Deactivate" : "Activate"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Create / Edit Form */}
              <form onSubmit={handleSaveBountyType} className="rounded-2xl border border-[#bcd6fa]/70 bg-slate-50/60 p-4 space-y-3.5">
                <div className="flex items-center justify-between border-b border-[#bcd6fa]/40 pb-2">
                  <h3 className="font-display text-xs font-bold text-ink uppercase tracking-wider">
                    {editingBountyType ? `Edit: ${editingBountyType.name}` : "Create New Bounty Type"}
                  </h3>
                  {editingBountyType && (
                    <button
                      type="button"
                      onClick={resetBountyTypeForm}
                      className="font-mono text-[10.5px] text-mist hover:text-ink cursor-pointer"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-mono text-[10.5px] font-semibold text-ink uppercase mb-1">
                      Bounty Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={btName}
                      onChange={(e) => setBtName(e.target.value)}
                      placeholder="e.g. Senior Specialist Bounty"
                      className="w-full rounded-xl border border-[#bcd6fa] bg-white p-2 text-xs font-medium text-ink focus:border-electric focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[10.5px] font-semibold text-ink uppercase mb-1">
                      Reward Amount ($ USD) *
                    </label>
                    <input
                      type="number"
                      step="50"
                      min="100"
                      required
                      value={btAmount}
                      onChange={(e) => setBtAmount(e.target.value)}
                      placeholder="1500"
                      className="w-full rounded-xl border border-[#bcd6fa] bg-white p-2 text-xs font-mono font-semibold text-ink focus:border-electric focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-mono text-[10.5px] font-semibold text-ink uppercase mb-1">
                      Validity Window (Days)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={btValidityDays}
                      onChange={(e) => setBtValidityDays(e.target.value)}
                      placeholder="90"
                      className="w-full rounded-xl border border-[#bcd6fa] bg-white p-2 text-xs font-mono text-ink focus:border-electric focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[10.5px] font-semibold text-ink uppercase mb-1">
                      Sort Order
                    </label>
                    <input
                      type="number"
                      value={btSortOrder}
                      onChange={(e) => setBtSortOrder(e.target.value)}
                      placeholder="1"
                      className="w-full rounded-xl border border-[#bcd6fa] bg-white p-2 text-xs font-mono text-ink focus:border-electric focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-[10.5px] font-semibold text-ink uppercase mb-1">
                    Catalog Description
                  </label>
                  <textarea
                    rows={2}
                    value={btDescription}
                    onChange={(e) => setBtDescription(e.target.value)}
                    placeholder="Short description of eligible roles and candidate requirements..."
                    className="w-full rounded-xl border border-[#bcd6fa] bg-white p-2 text-xs text-ink focus:border-electric focus:outline-hidden"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSavingBountyType}
                    className="rounded-xl bg-electric px-4 py-2 font-display text-xs font-bold text-white shadow-xs hover:bg-electric-bright transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isSavingBountyType ? "Saving..." : editingBountyType ? "Update Bounty Type" : "Create Bounty Type"}
                  </button>
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-[#bcd6fa]/40 flex justify-end">
              <button
                type="button"
                onClick={() => setIsBountyCatalogOpen(false)}
                className="rounded-xl border border-[#bcd6fa] px-4 py-2 font-display text-xs font-semibold text-ink-soft hover:bg-canvas transition-colors cursor-pointer"
              >
                Close Catalog
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
