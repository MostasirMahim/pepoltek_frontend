"use client";

import React, { useState } from "react";
import {
  Settings,
  ShieldCheck,
  CheckCircle,
  Zap,
  DollarSign,
} from "@/components/ui/Icons";
import {
  ADMIN_SYSTEM_SETTINGS,
  AdminSystemSettings,
} from "@/data/adminDashboardData";

interface AdminSettingsViewProps {
  initialSettings?: AdminSystemSettings;
}

export function AdminSettingsView({
  initialSettings = ADMIN_SYSTEM_SETTINGS,
}: AdminSettingsViewProps) {
  const [settings, setSettings] = useState<AdminSystemSettings>(initialSettings);
  const [notification, setNotification] = useState<string | null>(null);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setNotification("Global platform configurations successfully persisted to AdminOS cluster.");
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-electric/30 bg-electric/10 px-3 py-0.5 text-xs font-semibold text-electric">
            <Settings size={13} />
            <span>GLOBAL ENGINE &amp; PRICING PARAMETERS</span>
          </div>
          <h1 className="mt-2 font-display text-2xl font-bold text-ink">System Configuration &amp; Pricing Policy</h1>
          <p className="text-xs text-ink-soft">
            Direct administrative control over direct-hire fee percentages, 2-week trial durations, sprint velocity latency, and timezone guarantees.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSaveSettings}
          className="rounded-xl bg-ink px-4 py-2.5 font-display text-xs font-semibold text-white shadow-xs hover:bg-electric transition-colors cursor-pointer"
        >
          Save All Changes
        </button>
      </div>

      {/* Notification Banner */}
      {notification && (
        <div className="rounded-xl border border-signal/30 bg-signal/10 px-4 py-2.5 text-xs font-semibold text-signal flex items-center gap-2 animate-in fade-in-0 duration-200">
          <CheckCircle size={16} />
          <span>{notification}</span>
        </div>
      )}

      {/* Settings Grid Form */}
      <form onSubmit={handleSaveSettings} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Placement Fee & Guarantee Policies */}
        <div className="rounded-3xl border border-[#bcd6fa] bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-[#bcd6fa]/40 pb-3">
            <DollarSign size={18} className="text-signal" />
            <h2 className="font-display text-base font-bold text-ink">Commercial Placement &amp; Guarantee Policies</h2>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-mono text-[11px] font-semibold text-ink uppercase block mb-1">
                Direct-Hire Placement Fee (%)
              </label>
              <input
                type="number"
                value={settings.directHirePlacementFeePercent}
                onChange={(e) => setSettings({ ...settings, directHirePlacementFeePercent: Number(e.target.value) })}
                className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/30 px-3.5 py-2 text-xs text-ink font-bold focus:border-electric focus:bg-white focus:outline-none"
              />
              <span className="text-[10px] text-mist block mt-0.5">Applied to first-year base salary upon client buyout.</span>
            </div>

            <div>
              <label className="font-mono text-[11px] font-semibold text-ink uppercase block mb-1">
                Risk-Free Client Trial Duration (Weeks)
              </label>
              <input
                type="number"
                value={settings.riskFreeTrialDurationWeeks}
                onChange={(e) => setSettings({ ...settings, riskFreeTrialDurationWeeks: Number(e.target.value) })}
                className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/30 px-3.5 py-2 text-xs text-ink font-bold focus:border-electric focus:bg-white focus:outline-none"
              />
              <span className="text-[10px] text-mist block mt-0.5">Client invoices are 100% credited if specialist is returned during this window.</span>
            </div>

            <div>
              <label className="font-mono text-[11px] font-semibold text-ink uppercase block mb-1">
                Referral Bounty Reward Amount ($)
              </label>
              <input
                type="number"
                value={settings.referralBountyRewardAmount}
                onChange={(e) => setSettings({ ...settings, referralBountyRewardAmount: Number(e.target.value) })}
                className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/30 px-3.5 py-2 text-xs text-ink font-bold focus:border-electric focus:bg-white focus:outline-none"
              />
              <span className="text-[10px] text-mist block mt-0.5">Automatic escrow allocation upon completed candidate milestone.</span>
            </div>
          </div>
        </div>

        {/* Operational SLAs & Matching Thresholds */}
        <div className="rounded-3xl border border-[#bcd6fa] bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-[#bcd6fa]/40 pb-3">
            <Zap size={18} className="text-electric" />
            <h2 className="font-display text-base font-bold text-ink">Operational SLAs &amp; Match Thresholds</h2>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-mono text-[11px] font-semibold text-ink uppercase block mb-1">
                Deployment SLA Guarantee Max (Days)
              </label>
              <input
                type="number"
                value={settings.guaranteedSprintLatencyDaysMax}
                onChange={(e) => setSettings({ ...settings, guaranteedSprintLatencyDaysMax: Number(e.target.value) })}
                className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/30 px-3.5 py-2 text-xs text-ink font-bold focus:border-electric focus:bg-white focus:outline-none"
              />
              <span className="text-[10px] text-mist block mt-0.5">Time from requisition signoff to full live kickoff.</span>
            </div>

            <div>
              <label className="font-mono text-[11px] font-semibold text-ink uppercase block mb-1">
                Minimum Guaranteed Standup Overlap (Hours)
              </label>
              <input
                type="number"
                value={settings.minimumTimezoneOverlapHours}
                onChange={(e) => setSettings({ ...settings, minimumTimezoneOverlapHours: Number(e.target.value) })}
                className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/30 px-3.5 py-2 text-xs text-ink font-bold focus:border-electric focus:bg-white focus:outline-none"
              />
              <span className="text-[10px] text-mist block mt-0.5">Mandatory live overlap window required for remote placement.</span>
            </div>

            <div>
              <label className="font-mono text-[11px] font-semibold text-ink uppercase block mb-1">
                AI-HRMS Automated Vetting Cutoff Score
              </label>
              <input
                type="number"
                value={settings.autoVettingPassingScore}
                onChange={(e) => setSettings({ ...settings, autoVettingPassingScore: Number(e.target.value) })}
                className="w-full rounded-xl border border-[#bcd6fa] bg-canvas/30 px-3.5 py-2 text-xs text-ink font-bold focus:border-electric focus:bg-white focus:outline-none"
              />
              <span className="text-[10px] text-mist block mt-0.5">Candidates below this score will not receive reverse search notifications.</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
