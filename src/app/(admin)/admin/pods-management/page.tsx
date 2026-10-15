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

export default function AdminPodsManagementPage() {
  const [pods, setPods] = useState<AdminPodRecord[]>(ADMIN_PODS);
  const [requisitions, setRequisitions] = useState<AdminJobRequisition[]>(ADMIN_JOB_REQUISITIONS);
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
          setNotification(`Pod ${pod.id} (${pod.podName}) advanced to "${nextStage}".`);
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

  // Convert Job Requisition into an Active Pod
  const handleAssemblePodFromRequisition = (req: AdminJobRequisition) => {
    const newPodId = `POD-${Math.floor(100 + Math.random() * 900)}`;
    const newPod: AdminPodRecord = {
      id: newPodId,
      podName: `${req.title.split(" ")[0]} ${req.title.split(" ")[1]} Sprint Squad`,
      clientName: req.clientName,
      clientIndustry: req.clientIndustry,
      podLeadName: req.suggestedCandidateNames[0] || "Alex Morgan (Lead)",
      headcount: `${req.requiredHeadcount} Specialists`,
      sector: req.sector,
      slaScore: "100%",
      stage: "Sprint 1 Assembly",
      stageIndex: 1,
      hourlyRate: req.budgetHourlyRate,
      timezoneOverlap: req.timezoneRequirement,
      contractStatus: "Escrow Funded",
      squadMembers: [
        {
          userId: "USR-101",
          name: req.suggestedCandidateNames[0]?.split(" (")[0] || "Alex Morgan",
          role: "Lead Specialist",
          hourlyRate: req.budgetHourlyRate,
          weeklyHours: 40,
          avatarInitials: "AM",
          isLead: true,
          status: "Active on Sprint",
        },
      ],
      clientSponsor: {
        name: "Enterprise Client Sponsor",
        role: "Head of Engineering",
        email: "sponsor@client.com",
        monthlyContractValue: "$48,000.00 / month",
        channel: `#pepoltek-${req.id.toLowerCase()}-sprint`,
      },
    };

    setPods([newPod, ...pods]);
    setRequisitions(requisitions.map((r) => r.id === req.id ? { ...r, status: "Pod Assembled" } : r));
    setNotification(`Successfully assembled new pod ${newPod.id} from requisition ${req.id}!`);
    setTimeout(() => setNotification(null), 4000);
  };

  // Simulate 2-week risk-free replacement
  const handleSimulateReplacement = () => {
    if (!selectedPod) return;
    setNotification(`2-Week Guarantee Triggered: Requested replacement specialist for ${selectedPod.id}. 24-hour latency matching initiated.`);
    setTimeout(() => setNotification(null), 4500);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-electric/30 bg-electric/10 px-3 py-0.5 text-xs font-semibold text-electric">
            <Briefcase size={13} />
            <span>RAPID TEAM ASSEMBLY & SPRINT DELIVERABLES</span>
          </div>
          <h1 className="mt-2 font-display text-2xl font-bold text-ink">Global Pod Allocation & Job Engine</h1>
          <p className="text-xs text-ink-soft">
            Manage active client engineering squads, incoming enterprise job requisitions, and 5-stage sprint lifecycles.
          </p>
        </div>

        {/* Top Master Switcher Tabs */}
        <div className="flex items-center gap-1 rounded-2xl border border-[#bcd6fa] bg-white p-1 text-xs shadow-2xs">
          <button
            type="button"
            onClick={() => setActiveTab("pods")}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
              activeTab === "pods" ? "bg-ink text-white shadow-xs" : "text-ink-soft hover:text-ink"
            }`}
          >
            Active Sprint Pods ({pods.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("requisitions")}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
              activeTab === "requisitions" ? "bg-ink text-white shadow-xs" : "text-ink-soft hover:text-ink"
            }`}
          >
            Client Job Requisitions ({requisitions.length})
          </button>
        </div>
      </div>

      {/* Notification Banner */}
      {notification && (
        <div className="rounded-xl border border-signal/30 bg-signal/10 px-4 py-2.5 text-xs font-semibold text-signal flex items-center gap-2 animate-in fade-in-0 duration-200">
          <CheckCircle size={16} />
          <span>{notification}</span>
        </div>
      )}

      {/* Sub-Filters: Sector Filter */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 rounded-xl border border-[#bcd6fa]/80 bg-canvas/60 p-1 text-xs">
          <button
            type="button"
            onClick={() => setSectorFilter("all")}
            className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all cursor-pointer ${
              sectorFilter === "all" ? "bg-white text-ink shadow-2xs border border-[#bcd6fa]/60" : "text-ink-soft hover:text-ink"
            }`}
          >
            All Tracks
          </button>
          <button
            type="button"
            onClick={() => setSectorFilter("tech")}
            className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all cursor-pointer ${
              sectorFilter === "tech" ? "bg-white text-ink shadow-2xs border border-[#bcd6fa]/60" : "text-ink-soft hover:text-ink"
            }`}
          >
            Enterprise Tech
          </button>
          <button
            type="button"
            onClick={() => setSectorFilter("health")}
            className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all cursor-pointer ${
              sectorFilter === "health" ? "bg-white text-ink shadow-2xs border border-[#bcd6fa]/60" : "text-ink-soft hover:text-ink"
            }`}
          >
            Healthcare & Clinical
          </button>
        </div>

        <div className="text-xs text-mist font-medium">
          {activeTab === "pods" ? `${filteredPods.length} Active Squads Monitored` : `${filteredRequisitions.length} Open Enterprise Positions`}
        </div>
      </div>

      {/* VIEW 1: ACTIVE SPRINT PODS */}
      {activeTab === "pods" && (
        <div className="space-y-4">
          {filteredPods.map((pod) => (
            <div
              key={pod.id}
              onClick={() => setSelectedPod(pod)}
              className="rounded-2xl border border-[#bcd6fa] bg-white p-6 shadow-xs hover:border-electric/50 transition-all cursor-pointer group"
            >
              {/* Pod Top Meta */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-[#bcd6fa]/40 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-electric bg-electric/10 px-2.5 py-0.5 rounded-md">
                      {pod.id}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                        pod.sector === "Technology"
                          ? "bg-electric/10 text-electric"
                          : "bg-signal/15 text-signal"
                      }`}
                    >
                      {pod.sector}
                    </span>
                    <span className="rounded-full bg-canvas border border-[#bcd6fa] px-2.5 py-0.5 text-[10.5px] font-semibold text-ink-soft">
                      {pod.contractStatus}
                    </span>
                  </div>
                  <h3 className="font-display text-base font-bold text-ink group-hover:text-electric transition-colors">
                    {pod.podName}
                  </h3>
                  <div className="text-xs text-ink-soft">
                    Client: <span className="font-semibold text-ink">{pod.clientName}</span> ({pod.clientIndustry})
                  </div>
                </div>

                {/* Right Metrics & Inspect Button */}
                <div className="flex items-center gap-4 text-xs">
                  <div className="text-right">
                    <div className="text-[11px] text-mist font-medium">SLA Delivery Score</div>
                    <div className="font-display text-sm font-bold text-signal">{pod.slaScore}</div>
                  </div>
                  <div className="text-right border-l border-[#bcd6fa]/50 pl-4">
                    <div className="text-[11px] text-mist font-medium">Sprint Rate</div>
                    <div className="font-display text-sm font-bold text-ink">{pod.hourlyRate}</div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPod(pod);
                    }}
                    className="rounded-xl bg-electric/10 text-electric hover:bg-electric hover:text-white px-3.5 py-2 text-xs font-semibold transition-colors cursor-pointer ml-2 shadow-2xs"
                  >
                    Inspect Squad Roster →
                  </button>
                </div>
              </div>

              {/* Middle Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4 text-xs">
                <div className="rounded-xl bg-canvas/40 p-3 border border-[#bcd6fa]/40">
                  <div className="text-mist text-[11px]">Pod Lead Specialist</div>
                  <div className="font-semibold text-ink mt-0.5">{pod.podLeadName}</div>
                </div>
                <div className="rounded-xl bg-canvas/40 p-3 border border-[#bcd6fa]/40">
                  <div className="text-mist text-[11px]">Squad Capacity</div>
                  <div className="font-semibold text-ink mt-0.5">{pod.headcount}</div>
                </div>
                <div className="rounded-xl bg-canvas/40 p-3 border border-[#bcd6fa]/40">
                  <div className="text-mist text-[11px]">Mandatory Overlap</div>
                  <div className="font-semibold text-ink mt-0.5">{pod.timezoneOverlap}</div>
                </div>
              </div>

              {/* 5-Stage Stepper & Advance Action */}
              <div className="pt-2 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-ink-soft mb-1.5">
                    <span>Sprint Lifecycle Milestone</span>
                    <span className="text-electric">{pod.stage} ({pod.stageIndex}/5)</span>
                  </div>
                  <div className="grid grid-cols-5 gap-1.5">
                    {STAGES.map((s, idx) => (
                      <div
                        key={s}
                        className={`h-2 rounded-full transition-all ${
                          idx < pod.stageIndex
                            ? "bg-gradient-to-r from-electric to-electric-bright"
                            : "bg-[#bcd6fa]/40"
                        }`}
                        title={s}
                      />
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => handleAdvanceStage(pod.id, e)}
                  disabled={pod.stageIndex >= 5}
                  className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${
                    pod.stageIndex >= 5
                      ? "bg-canvas text-mist border border-[#bcd6fa]/60 cursor-not-allowed"
                      : "bg-ink text-white hover:bg-electric shadow-xs"
                  }`}
                >
                  {pod.stageIndex >= 5 ? "Fully Deployed (Max SLA)" : "Advance Sprint Stage →"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW 2: CLIENT JOB REQUISITIONS */}
      {activeTab === "requisitions" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRequisitions.map((req) => (
            <div
              key={req.id}
              className="rounded-2xl border border-[#bcd6fa] bg-white p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-electric/50 transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-2 border-b border-[#bcd6fa]/40 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-electric bg-electric/10 px-2 py-0.5 rounded-md">
                      {req.id}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                        req.sector === "Technology" ? "bg-electric/10 text-electric" : "bg-signal/15 text-signal"
                      }`}
                    >
                      {req.sector}
                    </span>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10.5px] font-semibold ${
                      req.status === "Pod Assembled"
                        ? "bg-signal/15 text-signal"
                        : req.status === "Panel Review"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-electric/10 text-electric"
                    }`}
                  >
                    {req.status}
                  </span>
                </div>

                <h3 className="font-display text-base font-bold text-ink mt-3">
                  {req.title}
                </h3>
                <div className="text-xs text-ink-soft mt-0.5">
                  Client: <span className="font-semibold text-ink">{req.clientName}</span> • {req.clientIndustry}
                </div>

                <p className="text-xs text-ink-soft mt-2 leading-relaxed bg-canvas/40 p-2.5 rounded-xl border border-[#bcd6fa]/40">
                  {req.description}
                </p>

                {/* Requirements Grid */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs mt-3 p-2.5 bg-canvas/30 rounded-xl border border-[#bcd6fa]/30">
                  <div>
                    <div className="text-[10px] text-mist font-semibold uppercase">Budget Rate</div>
                    <div className="font-display text-xs font-bold text-ink">{req.budgetHourlyRate}</div>
                  </div>
                  <div className="border-x border-[#bcd6fa]/40">
                    <div className="text-[10px] text-mist font-semibold uppercase">Headcount</div>
                    <div className="font-display text-xs font-bold text-electric">{req.requiredHeadcount} Specialists</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-mist font-semibold uppercase">Matches</div>
                    <div className="font-display text-xs font-bold text-signal">{req.matchedCandidatesCount} Candidates</div>
                  </div>
                </div>

                {/* Skills */}
                <div className="mt-3">
                  <div className="text-[11px] font-semibold text-ink mb-1.5">Required Tech / Clinical Skills:</div>
                  <div className="flex flex-wrap gap-1">
                    {req.requiredSkills.map((s) => (
                      <span key={s} className="rounded-md bg-white border border-[#bcd6fa] px-2 py-0.5 text-[11px] text-ink font-medium">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Suggested Matching Talent */}
                <div className="mt-3 pt-3 border-t border-[#bcd6fa]/40">
                  <div className="text-[11px] font-semibold text-ink mb-1">Pre-Vetted Matching Talent:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {req.suggestedCandidateNames.map((cand) => (
                      <span key={cand} className="rounded-full bg-signal/10 border border-signal/30 px-2.5 py-0.5 text-[10.5px] font-semibold text-signal flex items-center gap-1">
                        <CheckCircle size={11} className="text-signal shrink-0" />
                        <span>{cand}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => handleAssemblePodFromRequisition(req)}
                  disabled={req.status === "Pod Assembled"}
                  className={`w-full rounded-xl py-2.5 text-xs font-semibold transition-all cursor-pointer shadow-xs ${
                    req.status === "Pod Assembled"
                      ? "bg-canvas text-mist border border-[#bcd6fa]/60 cursor-not-allowed"
                      : "bg-ink text-white hover:bg-electric"
                  }`}
                >
                  {req.status === "Pod Assembled" ? "Pod Squad Already Assembled" : "+ Assemble Pod from Requisition"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pod Squad Detail Slide-Over Drawer */}
      {selectedPod && (
        <div className="fixed inset-0 z-50 flex justify-end bg-ink/40 backdrop-blur-xs animate-in fade-in-0 duration-150">
          <div
            className="w-full max-w-2xl bg-white h-full shadow-2xl overflow-y-auto thin-scrollbar flex flex-col justify-between border-l border-[#bcd6fa]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div>
              <div className="p-6 border-b border-[#bcd6fa]/50 bg-canvas/30 flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-electric bg-electric/10 px-2.5 py-0.5 rounded-md">
                      {selectedPod.id}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                        selectedPod.sector === "Technology" ? "bg-electric/10 text-electric" : "bg-signal/15 text-signal"
                      }`}
                    >
                      {selectedPod.sector}
                    </span>
                    <span className="rounded-full bg-signal/15 px-2.5 py-0.5 text-[10.5px] font-semibold text-signal">
                      {selectedPod.contractStatus}
                    </span>
                  </div>
                  <h2 className="font-display text-lg font-bold text-ink mt-1.5">{selectedPod.podName}</h2>
                  <p className="text-xs text-ink-soft">
                    Client: <span className="font-semibold text-ink">{selectedPod.clientName}</span> ({selectedPod.clientIndustry})
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedPod(null)}
                  className="rounded-xl p-2 text-ink-soft hover:bg-canvas hover:text-ink transition-colors cursor-pointer"
                  aria-label="Close pod details"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Pod Quick Telemetry */}
              <div className="grid grid-cols-4 gap-2 p-4 bg-canvas/60 border-b border-[#bcd6fa]/40 text-center text-xs">
                <div>
                  <div className="text-[10px] text-mist font-semibold uppercase">Delivery SLA</div>
                  <div className="font-display text-base font-bold text-signal">{selectedPod.slaScore}</div>
                  <div className="text-[10px] text-signal font-semibold">Optimal Speed</div>
                </div>
                <div className="border-l border-[#bcd6fa]/40">
                  <div className="text-[10px] text-mist font-semibold uppercase">Sprint Rate</div>
                  <div className="font-display text-base font-bold text-ink">{selectedPod.hourlyRate}</div>
                  <div className="text-[10px] text-ink-soft">Hourly Contract</div>
                </div>
                <div className="border-l border-[#bcd6fa]/40">
                  <div className="text-[10px] text-mist font-semibold uppercase">Timezone Overlap</div>
                  <div className="font-display text-xs font-bold text-electric">4 to 6 Hours</div>
                  <div className="text-[10px] text-ink-soft">Guaranteed Daily</div>
                </div>
                <div className="border-l border-[#bcd6fa]/40">
                  <div className="text-[10px] text-mist font-semibold uppercase">Stage</div>
                  <div className="font-display text-xs font-bold text-ink">{selectedPod.stageIndex} / 5</div>
                  <div className="text-[10px] text-electric">{selectedPod.stage}</div>
                </div>
              </div>

              {/* Drawer Content */}
              <div className="p-6 space-y-6">
                {/* 1. Squad Members Roster */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-display text-sm font-bold text-ink">
                      Active Squad Specialists ({selectedPod.squadMembers?.length || 1} Members)
                    </h3>
                    <span className="text-xs text-mist font-medium">{selectedPod.headcount}</span>
                  </div>

                  <div className="space-y-2.5">
                    {selectedPod.squadMembers ? (
                      selectedPod.squadMembers.map((member) => (
                        <div
                          key={member.userId}
                          className="flex items-center justify-between p-3.5 rounded-xl border border-[#bcd6fa]/60 bg-white shadow-2xs text-xs"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-electric to-electric-bright font-display text-xs font-bold text-white shadow-2xs">
                              {member.avatarInitials}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5 font-bold text-ink">
                                <span>{member.name}</span>
                                {member.isLead && (
                                  <span className="rounded-full bg-electric/10 px-2 py-0.2 text-[9.5px] font-semibold text-electric">
                                    Squad Lead
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-ink-soft">{member.role}</div>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="font-semibold text-ink">{member.hourlyRate}</div>
                            <div className="text-[10.5px] text-mist">{member.weeklyHours}h / week dedicated</div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 rounded-xl bg-canvas/40 border border-[#bcd6fa]/40 text-xs text-ink-soft">
                        Squad lead assigned: <span className="font-bold text-ink">{selectedPod.podLeadName}</span>. Full member roster synchronizing from client contract.
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. Sprint Milestones Burndown */}
                {selectedPod.milestones && (
                  <div>
                    <h3 className="font-display text-sm font-bold text-ink mb-3">
                      Sprint Delivery Milestones
                    </h3>
                    <div className="space-y-2.5">
                      {selectedPod.milestones.map((m) => (
                        <div
                          key={m.milestoneNumber}
                          className="p-3.5 rounded-xl border border-[#bcd6fa]/60 bg-canvas/30 space-y-1.5 text-xs"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-ink">
                              Milestone #{m.milestoneNumber}: {m.title}
                            </span>
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                m.status === "Completed"
                                  ? "bg-signal/15 text-signal"
                                  : "bg-electric/10 text-electric"
                              }`}
                            >
                              {m.status}
                            </span>
                          </div>
                          <div className="text-[11px] text-mist">Target Delivery Date: {m.targetDate}</div>
                          <ul className="list-disc list-inside space-y-0.5 text-[11px] text-ink-soft pt-1">
                            {m.deliverables.map((d, dIdx) => (
                              <li key={dIdx}>{d}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Client Enterprise Sponsor */}
                {selectedPod.clientSponsor && (
                  <div className="rounded-xl border border-[#bcd6fa] bg-canvas/40 p-4 space-y-2 text-xs">
                    <div className="text-[10px] font-semibold text-mist uppercase">Client Enterprise Sponsor</div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-ink">{selectedPod.clientSponsor.name}</div>
                        <div className="text-ink-soft text-[11px]">{selectedPod.clientSponsor.role} • {selectedPod.clientSponsor.email}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-display text-xs font-bold text-electric">{selectedPod.clientSponsor.monthlyContractValue}</div>
                        <div className="text-[10.5px] text-mist font-mono">{selectedPod.clientSponsor.channel}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. 2-Week Risk-Free Guarantee Simulator */}
                <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4 space-y-2 text-xs">
                  <div className="font-bold text-amber-900 flex items-center gap-1.5">
                    <ShieldCheck size={15} />
                    <span>2-Week Risk-Free Trial Replacement Guarantee</span>
                  </div>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    Per SRS Section 1.2, if any pod specialist is deemed misaligned during their initial 2-week trial sprint, administrators can initiate an immediate zero-friction specialist replacement within 24 to 48 hours.
                  </p>
                  <button
                    type="button"
                    onClick={handleSimulateReplacement}
                    className="mt-1 rounded-xl bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Simulate 24h Specialist Replacement
                  </button>
                </div>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-6 border-t border-[#bcd6fa]/50 bg-canvas/30 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleAdvanceStage(selectedPod.id)}
                disabled={selectedPod.stageIndex >= 5}
                className="rounded-xl bg-electric px-4 py-2 text-xs font-semibold text-white hover:bg-electric-bright transition-colors cursor-pointer shadow-xs disabled:opacity-50"
              >
                {selectedPod.stageIndex >= 5 ? "Fully Deployed" : "Advance Sprint Stage"}
              </button>

              <button
                type="button"
                onClick={() => setSelectedPod(null)}
                className="rounded-xl bg-ink px-4 py-2 text-xs font-semibold text-white hover:bg-electric transition-colors cursor-pointer shadow-xs"
              >
                Done / Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
