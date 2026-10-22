"use client";

import React, { useState } from "react";
import {
  Briefcase,
  CheckCircle,
  Activity,
  ShieldCheck,
  Zap,
  Users,
  Search,
  X,
  ArrowRight,
} from "@/components/ui/Icons";
import {
  ADMIN_PODS,
  AdminPodRecord,
  ADMIN_JOB_REQUISITIONS,
  AdminJobRequisition,
} from "@/data/adminDashboardData";

const STAGES: AdminPodRecord["stage"][] = [
  "Sprint 1 Assembly",
  "Active Sprint 2",
  "Active Sprint 3",
  "Client Review",
  "Live Deployed",
];

interface AdminPodsViewProps {
  initialPods?: AdminPodRecord[];
  initialRequisitions?: AdminJobRequisition[];
}

export function AdminPodsView({
  initialPods = [],
  initialRequisitions = [],
}: AdminPodsViewProps) {
  const [pods, setPods] = useState<AdminPodRecord[]>(initialPods);
  const [requisitions, setRequisitions] = useState<AdminJobRequisition[]>(initialRequisitions);
  const [activeTab, setActiveTab] = useState<"pods" | "requisitions">("pods");
  const [sectorFilter, setSectorFilter] = useState<string>("all");
  const [selectedPod, setSelectedPod] = useState<AdminPodRecord | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const filteredPods = pods.filter((pod) => {
    if (sectorFilter === "tech") return pod.sector === "Technology";
    if (sectorFilter === "health") return pod.sector === "Healthcare";
    return true;
  });

  const filteredRequisitions = requisitions.filter((req) => {
    if (sectorFilter === "tech") return req.sector === "Technology";
    if (sectorFilter === "health") return req.sector === "Healthcare";
    return true;
  });

  const handleAdvanceStage = (podId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setPods((prev) =>
      prev.map((pod) => {
        if (pod.id === podId) {
          const nextIndex = Math.min(pod.stageIndex + 1, 5);
          const nextStage = STAGES[nextIndex - 1];
          setNotification(`Team ${pod.id} (${pod.podName}) advanced to "${nextStage}".`);
          setTimeout(() => setNotification(null), 3500);
          const updated = {
            ...pod,
            stageIndex: nextIndex,
            stage: nextStage,
          };
          if (selectedPod && selectedPod.id === podId) {
            setSelectedPod(updated);
          }
          return updated;
        }
        return pod;
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-electric/30 bg-electric/10 px-3 py-0.5 text-xs font-semibold text-electric">
            <Briefcase size={13} />
            <span>GLOBAL REQUISITION REGISTRY &amp; STAFFING</span>
          </div>
          <h1 className="mt-2 font-display text-2xl font-bold text-ink">Active Multi-Seat Teams &amp; SLAs</h1>
          <p className="text-xs text-ink-soft">
            Monitor weekly sprint burn, specialist headcount, SLA health, and milestone releases across all enterprise client accounts.
          </p>
        </div>
      </div>

      {/* Notification Banner */}
      {notification && (
        <div className="rounded-xl border border-signal/30 bg-signal/10 px-4 py-2.5 text-xs font-semibold text-signal flex items-center gap-2 animate-in fade-in-0 duration-200">
          <CheckCircle size={16} />
          <span>{notification}</span>
        </div>
      )}

      {/* Filter and Mode Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-[#bcd6fa] bg-white p-3 shadow-xs">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("pods")}
            className={`rounded-xl px-4 py-1.5 font-display text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "pods"
                ? "bg-ink text-white shadow-xs"
                : "text-ink-soft hover:bg-canvas hover:text-ink"
            }`}
          >
            Active Teams ({pods.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("requisitions")}
            className={`rounded-xl px-4 py-1.5 font-display text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "requisitions"
                ? "bg-ink text-white shadow-xs"
                : "text-ink-soft hover:bg-canvas hover:text-ink"
            }`}
          >
            Open Requisitions ({requisitions.length})
          </button>
        </div>

        <div className="flex items-center gap-1.5 font-mono text-xs">
          <span className="text-mist uppercase text-[10px] pr-1">Sector:</span>
          {["all", "tech", "health"].map((sec) => (
            <button
              key={sec}
              type="button"
              onClick={() => setSectorFilter(sec)}
              className={`rounded-lg px-2.5 py-1 font-semibold uppercase text-[10px] transition-all cursor-pointer ${
                sectorFilter === sec
                  ? "bg-canvas border border-[#bcd6fa] text-ink font-bold"
                  : "text-mist hover:text-ink"
              }`}
            >
              {sec}
            </button>
          ))}
        </div>
      </div>

      {/* Pods Grid */}
      {activeTab === "pods" && (
        filteredPods.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[#bcd6fa] bg-white p-12 text-center shadow-xs">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-canvas border border-[#bcd6fa]/60 text-mist">
              <Briefcase size={28} />
            </div>
            <h3 className="mt-4 font-display text-base font-bold text-ink">No Active Team Deployments</h3>
            <p className="mt-1.5 max-w-md mx-auto text-xs text-ink-soft leading-relaxed">
              There are currently zero active engineering or clinical teams deployed. As client requisitions are assembled, they will appear here with live SLA metrics.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPods.map((pod) => (
              <div
                key={pod.id}
                onClick={() => setSelectedPod(pod)}
                className="rounded-3xl border border-[#bcd6fa] bg-white p-6 shadow-xs hover:border-electric/70 hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-electric">{pod.id}</span>
                    <span className="rounded-full bg-signal/15 px-2.5 py-0.5 font-mono text-[10px] font-bold text-signal">
                      SLA: {pod.slaScore}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display text-base font-bold text-ink">{pod.podName}</h3>
                    <div className="text-xs text-ink-soft mt-0.5">
                      Client: <strong className="text-ink">{pod.clientName}</strong> ({pod.sector})
                    </div>
                  </div>

                  <div className="rounded-xl border border-[#bcd6fa]/50 bg-canvas/30 p-2.5 text-xs flex justify-between font-mono">
                    <div>
                      <span className="text-mist text-[10px] block">HOURLY RATE</span>
                      <span className="font-bold text-ink">{pod.hourlyRate}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-mist text-[10px] block">HEADCOUNT</span>
                      <span className="font-bold text-ink">{pod.headcount}</span>
                    </div>
                  </div>

                  {/* Stage Progression */}
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between font-mono text-[10px]">
                      <span className="text-ink font-semibold">{pod.stage}</span>
                      <span className="text-mist">Stage {pod.stageIndex} of 5</span>
                    </div>
                    <div className="grid grid-cols-5 gap-1">
                      {[1, 2, 3, 4, 5].map((step) => (
                        <div
                          key={step}
                          className={`h-1.5 rounded-full ${
                            step <= pod.stageIndex ? "bg-electric" : "bg-canvas border border-[#bcd6fa]/40"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#bcd6fa]/30 flex items-center justify-between text-xs">
                  <span className="text-mist font-mono text-[10px]">Lead: {pod.podLeadName}</span>
                  <button
                    type="button"
                    onClick={(e) => handleAdvanceStage(pod.id, e)}
                    disabled={pod.stageIndex >= 5}
                    className="rounded-lg bg-ink px-2.5 py-1 font-display text-[11px] font-semibold text-white hover:bg-electric disabled:opacity-40 transition-colors cursor-pointer"
                  >
                    {pod.stageIndex >= 5 ? "Deployed" : "Advance Stage →"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Open Requisitions Grid */}
      {activeTab === "requisitions" && (
        filteredRequisitions.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[#bcd6fa] bg-white p-12 text-center shadow-xs">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-canvas border border-[#bcd6fa]/60 text-mist">
              <Activity size={28} />
            </div>
            <h3 className="mt-4 font-display text-base font-bold text-ink">No Open Requisitions</h3>
            <p className="mt-1.5 max-w-md mx-auto text-xs text-ink-soft leading-relaxed">
              There are currently zero open client requisitions in the pipeline. Enterprise client hiring demands will be routed here for talent matchmaking.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredRequisitions.map((req) => (
              <div
                key={req.id}
                className="rounded-2xl border border-[#bcd6fa] bg-white p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-electric">{req.id}</span>
                    <span className="rounded-full bg-canvas border border-[#bcd6fa] px-2 py-0.5 font-mono text-[10px] text-ink-soft">
                      {req.sector}
                    </span>
                    <span className="rounded-full bg-signal/15 px-2 py-0.5 font-mono text-[10px] font-bold text-signal">
                      {req.status}
                    </span>
                  </div>
                  <h3 className="mt-1 font-display text-base font-bold text-ink">{req.title}</h3>
                  <p className="text-xs text-ink-soft">
                    Client: <strong className="text-ink">{req.clientName}</strong> • Target Rate: {req.budgetHourlyRate}
                  </p>
                </div>

                <div className="flex items-center gap-3 font-mono text-xs text-right">
                  <div>
                    <span className="text-mist text-[10px] block">MATCHED TALENT</span>
                    <span className="font-bold text-electric">{req.matchedCandidatesCount} Candidates Ready</span>
                  </div>
                  <button
                    type="button"
                    className="rounded-xl border border-[#bcd6fa] bg-canvas/40 px-3.5 py-2 font-display text-xs font-semibold text-ink hover:bg-white transition-all cursor-pointer"
                  >
                    View Matches
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Pod Detail Slide-Over Drawer */}
      {selectedPod && (
        <div className="fixed inset-0 z-50 flex justify-end bg-ink/40 backdrop-blur-xs animate-in fade-in-0 duration-150">
          <div
            className="w-full max-w-xl bg-white h-full shadow-2xl p-6 sm:p-8 flex flex-col justify-between overflow-y-auto thin-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-6">
              <div className="flex items-start justify-between border-b border-[#bcd6fa]/40 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-electric">{selectedPod.id}</span>
                    <span className="rounded-full bg-signal/15 px-2.5 py-0.5 font-mono text-[10px] font-bold text-signal">
                      {selectedPod.stage}
                    </span>
                  </div>
                  <h2 className="font-display text-xl font-bold text-ink mt-1.5">
                    {selectedPod.podName}
                  </h2>
                  <p className="text-xs text-ink-soft">
                    Client: {selectedPod.clientName} • Delivery Lead: {selectedPod.podLeadName}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedPod(null)}
                  className="rounded-xl p-2 text-ink-soft hover:bg-canvas cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* SLA & Burn Rate Overview */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-2xl border border-[#bcd6fa]/60 bg-canvas/30 p-4">
                  <span className="font-mono text-[10px] text-mist uppercase block mb-1">Weekly Escrow Rate</span>
                  <span className="font-display text-lg font-bold text-ink">{selectedPod.hourlyRate}</span>
                </div>
                <div className="rounded-2xl border border-[#bcd6fa]/60 bg-canvas/30 p-4">
                  <span className="font-mono text-[10px] text-mist uppercase block mb-1">SLA Health Score</span>
                  <span className="font-display text-lg font-bold text-signal">{selectedPod.slaScore}</span>
                </div>
              </div>

              {/* Team Composition */}
              <div className="space-y-3">
                <h4 className="font-display text-xs font-bold text-ink uppercase tracking-wider">
                  Team Specialist Roster ({selectedPod.headcount} Allocated)
                </h4>
                <div className="space-y-2 text-xs">
                  {selectedPod.squadMembers?.map((mem) => (
                    <div key={mem.userId} className="flex items-center justify-between rounded-xl border border-[#bcd6fa]/50 p-3 bg-canvas/20">
                      <div>
                        <div className="font-bold text-ink">{mem.name}</div>
                        <div className="text-[11px] text-ink-soft">{mem.role}</div>
                      </div>
                      <span className="font-mono text-xs font-bold text-electric">{mem.hourlyRate}</span>
                    </div>
                  )) || (
                    <p className="text-xs text-mist">Team staffing telemetry active.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-[#bcd6fa]/40 flex items-center justify-between text-xs">
              <span className="text-mist font-mono text-[11px]">Requisition: {selectedPod.id}</span>
              <button
                type="button"
                onClick={() => setSelectedPod(null)}
                className="rounded-xl px-4 py-2 font-display text-xs font-semibold text-ink-soft hover:bg-canvas cursor-pointer"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
