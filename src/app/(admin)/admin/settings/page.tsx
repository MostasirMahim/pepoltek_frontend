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

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<AdminSystemSettings>(ADMIN_SYSTEM_SETTINGS);
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
            <span>GLOBAL ENGINE & PRICING PARAMETERS</span>
          </div>
          <h1 className="mt-2 font-display text-2xl font-bold text-ink">System Configuration & Pricing Policy</h1>
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
        <div className="rounded-2xl border border-[#bcd6fa] bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-electric/10 text-electric border border-electric/20 shadow-2xs">
              <DollarSign size={16} />
            </div>
            <div>
              <h2 className="font-display text-sm font-bold text-ink">Fee Margins & Guarantee Terms</h2>
              <p className="text-[11px] text-ink-soft">Per SRS Section 5.3 velocity calculator parameters.</p>
            </div>
          </div>

          <div className="space-y-3 pt-2 text-xs">
            <div>
              <label className="block text-ink font-semibold mb-1">
                Direct-Hire Placement Fee Percentage
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="10"
                  max="30"
                  value={settings.directHirePlacementFeePercent}
                  onChange={(e) =>
                    setSettings({ ...settings, directHirePlacementFeePercent: Number(e.target.value) })
                  }
                  className="w-28 rounded-xl border border-[#bcd6fa] px-3 py-2 text-xs font-bold text-ink focus:border-electric focus:outline-hidden"
                />
                <span className="text-mist font-medium">Standard industry bracket: 15% to 20%</span>
              </div>
            </div>

            <div>
              <label className="block text-ink font-semibold mb-1">
                Risk-Free Trial Duration (Weeks)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="1"
                  max="4"
                  value={settings.riskFreeTrialDurationWeeks}
                  onChange={(e) =>
                    setSettings({ ...settings, riskFreeTrialDurationWeeks: Number(e.target.value) })
                  }
                  className="w-28 rounded-xl border border-[#bcd6fa] px-3 py-2 text-xs font-bold text-ink focus:border-electric focus:outline-hidden"
                />
                <span className="text-mist font-medium">SRS standard: 2-week risk-free trial</span>
              </div>
            </div>

            <div>
              <label className="block text-ink font-semibold mb-1">
                Referral Bounty Reward ($ per successful placement)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="100"
                  max="2000"
                  step="50"
                  value={settings.referralBountyRewardAmount}
                  onChange={(e) =>
                    setSettings({ ...settings, referralBountyRewardAmount: Number(e.target.value) })
                  }
                  className="w-28 rounded-xl border border-[#bcd6fa] px-3 py-2 text-xs font-bold text-ink focus:border-electric focus:outline-hidden"
                />
                <span className="text-mist font-medium">SRS standard: $500 milestone payout</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sprint Latency & Timezone Standards */}
        <div className="rounded-2xl border border-[#bcd6fa] bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-signal/10 text-signal border border-signal/20 shadow-2xs">
              <Zap size={16} />
            </div>
            <div>
              <h2 className="font-display text-sm font-bold text-ink">Sprint Velocity & Timezone SLAs</h2>
              <p className="text-[11px] text-ink-soft">Guaranteed delivery timelines for enterprise pod matches.</p>
            </div>
          </div>

          <div className="space-y-3 pt-2 text-xs">
            <div>
              <label className="block text-ink font-semibold mb-1">
                Guaranteed Sprint Deployment Latency Range (Days)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={settings.guaranteedSprintLatencyDaysMin}
                  onChange={(e) =>
                    setSettings({ ...settings, guaranteedSprintLatencyDaysMin: Number(e.target.value) })
                  }
                  className="w-20 rounded-xl border border-[#bcd6fa] px-3 py-2 text-xs font-bold text-ink focus:border-electric focus:outline-hidden"
                />
                <span className="text-mist">to</span>
                <input
                  type="number"
                  min="5"
                  max="14"
                  value={settings.guaranteedSprintLatencyDaysMax}
                  onChange={(e) =>
                    setSettings({ ...settings, guaranteedSprintLatencyDaysMax: Number(e.target.value) })
                  }
                  className="w-20 rounded-xl border border-[#bcd6fa] px-3 py-2 text-xs font-bold text-ink focus:border-electric focus:outline-hidden"
                />
                <span className="text-mist font-medium">SRS standard: 2 to 7 days SLA</span>
              </div>
            </div>

            <div>
              <label className="block text-ink font-semibold mb-1">
                Minimum Standup Timezone Overlap (Hours)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="2"
                  max="8"
                  value={settings.minimumTimezoneOverlapHours}
                  onChange={(e) =>
                    setSettings({ ...settings, minimumTimezoneOverlapHours: Number(e.target.value) })
                  }
                  className="w-28 rounded-xl border border-[#bcd6fa] px-3 py-2 text-xs font-bold text-ink focus:border-electric focus:outline-hidden"
                />
                <span className="text-mist font-medium">SRS standard: minimum 4 hours daily</span>
              </div>
            </div>

            <div>
              <label className="block text-ink font-semibold mb-1">
                Technical Vetting Auto-Pass Threshold (Score / 100)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="70"
                  max="95"
                  value={settings.autoVettingPassingScore}
                  onChange={(e) =>
                    setSettings({ ...settings, autoVettingPassingScore: Number(e.target.value) })
                  }
                  className="w-28 rounded-xl border border-[#bcd6fa] px-3 py-2 text-xs font-bold text-ink focus:border-electric focus:outline-hidden"
                />
                <span className="text-mist font-medium">Score required for Tier 1 squad admission</span>
              </div>
            </div>
          </div>
        </div>

        {/* Security & Authentication Policies */}
        <div className="rounded-2xl border border-[#bcd6fa] bg-white p-6 shadow-xs space-y-4 md:col-span-2">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-electric/10 text-electric border border-electric/20 shadow-2xs">
              <ShieldCheck size={16} />
            </div>
            <div>
              <h2 className="font-display text-sm font-bold text-ink">Administrative Security & Enforcement Policies</h2>
              <p className="text-[11px] text-ink-soft">SOC 2 Type II and HIPAA zero-leakage security settings.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
            <div className="flex items-center justify-between rounded-xl border border-[#bcd6fa]/60 bg-canvas/40 p-3.5">
              <div>
                <div className="font-semibold text-ink">Mandatory Hardware Token 2FA</div>
                <div className="text-[11px] text-mist">Enforced for all Recruiter and Admin roles</div>
              </div>
              <span className="rounded-full bg-signal/15 px-2.5 py-0.5 text-[10px] font-semibold text-signal">
                Enforced
              </span>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-[#bcd6fa]/60 bg-canvas/40 p-3.5">
              <div>
                <div className="font-semibold text-ink">Automated Escrow Holdback (7 Days)</div>
                <div className="text-[11px] text-mist">Automatic hold for client milestone signoff</div>
              </div>
              <span className="rounded-full bg-signal/15 px-2.5 py-0.5 text-[10px] font-semibold text-signal">
                Active
              </span>
            </div>
          </div>

          <div className="flex justify-end pt-3 border-t border-[#bcd6fa]/40">
            <button
              type="submit"
              className="rounded-xl bg-electric px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-electric-bright transition-colors cursor-pointer"
            >
              Persist System Configuration
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
