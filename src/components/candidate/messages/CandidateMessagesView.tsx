"use client";

import { useState } from "react";
import {
  Users,
  Search,
  ArrowRight,
  ShieldCheck,
  Video,
} from "@/components/ui/Icons";
import { CHAT_MESSAGES, ChatMessage } from "@/data/talentDashboardData";

interface Thread {
  id: string;
  name: string;
  role: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: boolean;
  pod: string;
}

const THREADS: Thread[] = [
  {
    id: "TH-1",
    name: "Marcus Vance",
    role: "Engineering Pod Director",
    avatar: "MV",
    lastMessage: "The repository invite and temporary credentials have been generated.",
    time: "10:15 AM",
    unread: true,
    pod: "FinTech Ledger Pod",
  },
  {
    id: "TH-2",
    name: "Dr. Rachel Higgins",
    role: "Clinical Operations Lead",
    avatar: "RH",
    lastMessage: "We have reviewed your compliance credentials for the emergency rota integration.",
    time: "Yesterday",
    unread: false,
    pod: "CarePulse NHS Trust",
  },
  {
    id: "TH-3",
    name: "Sarah Sterling",
    role: "Talent Delivery Director",
    avatar: "SS",
    lastMessage: "Your escrow milestone payment for Milestone #1 has been released.",
    time: "Oct 1",
    unread: false,
    pod: "Pepoltek Talent Support",
  },
];

export function CandidateMessagesView({
  initialThreads = [],
}: {
  initialThreads?: Thread[];
}) {
  const [threads, setThreads] = useState<Thread[]>(initialThreads);
  const [selectedThread, setSelectedThread] = useState<Thread | null>(initialThreads[0] || null);
  const [messages, setMessages] = useState<ChatMessage[]>(initialThreads.length > 0 ? CHAT_MESSAGES : []);
  const [replyText, setReplyText] = useState("");

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    const newMsg: ChatMessage = {
      id: `MSG-${Date.now()}`,
      senderName: "You",
      senderRole: "Candidate",
      avatarUrl: "AM",
      timestamp: "Just now",
      content: replyText.trim(),
      isSelf: true,
    };

    setMessages([...messages, newMsg]);
    setReplyText("");
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-electric/30 bg-gradient-to-r from-ink via-[#0d1f3d] to-ink p-6 sm:p-8 text-white shadow-md">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-signal/40 bg-signal/10 px-3 py-0.5 text-[11px] font-mono text-signal">
              <span className="h-2 w-2 rounded-full bg-signal animate-pulse" />
              <span>DIRECT SPRINT CHAT &amp; ROLE BRIEFINGS</span>
            </div>
            <h1 className="mt-2.5 font-display text-2xl sm:text-3xl font-bold tracking-tight">
              Sprint Communications &amp; Messages
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-gray-300 max-w-2xl leading-relaxed">
              Communicate directly with your assigned Hiring Lead, Recruiter, and Technical Evaluators under encrypted audit logs.
            </p>
          </div>
        </div>

        <div
          className="pointer-events-none absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: "20px 20px",
          }}
        />
      </div>

      {/* Main Messaging Interface */}
      {threads.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-[#bcd6fa] bg-white p-12 text-center shadow-xs">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-canvas border border-[#bcd6fa]/60 text-mist">
            <Users size={28} />
          </div>
          <h3 className="mt-4 font-display text-base font-bold text-ink">No Active Sprint Channels</h3>
          <p className="mt-1.5 max-w-md mx-auto text-xs text-ink-soft leading-relaxed">
            Direct communications with your assigned Hiring Lead and Technical Evaluators will appear here once you are assigned to an active requisition.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 rounded-3xl border border-[#bcd6fa] bg-white overflow-hidden shadow-xs min-h-[580px]">
          {/* Left: Threads List */}
          <div className="border-r border-[#bcd6fa]/50 p-4 space-y-3 bg-canvas/20">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-3 text-mist" />
              <input
                type="text"
                placeholder="Filter channels &amp; contacts..."
                className="w-full rounded-xl border border-[#bcd6fa] bg-white pl-9 pr-3 py-2 text-xs text-ink focus:border-electric focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              {threads.map((thread) => {
                const isSelected = selectedThread?.id === thread.id;
              return (
                <button
                  key={thread.id}
                  type="button"
                  onClick={() => setSelectedThread(thread)}
                  className={`w-full text-left p-3 rounded-2xl transition-all cursor-pointer ${
                    isSelected
                      ? "bg-white shadow-xs border border-electric/40 ring-1 ring-electric/20"
                      : "hover:bg-white border border-transparent"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink text-white font-mono text-xs font-bold">
                        {thread.avatar}
                      </div>
                      <div>
                        <div className="font-display text-xs font-bold text-ink">{thread.name}</div>
                        <div className="text-[10px] text-mist">{thread.role}</div>
                      </div>
                    </div>
                    <span className="font-mono text-[10px] text-mist">{thread.time}</span>
                  </div>

                  <p className="mt-2 text-xs text-ink-soft line-clamp-1">
                    {thread.lastMessage}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Active Chat Conversation */}
        <div className="lg:col-span-2 flex flex-col justify-between p-6">
          {!selectedThread ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-2">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-canvas text-mist">
                <ShieldCheck size={24} />
              </div>
              <h3 className="font-display text-sm font-bold text-ink">No Sprint Channel Selected</h3>
              <p className="text-xs text-ink-soft max-w-xs">
                Select a sprint channel or lead conversation from the list to view end-to-end encrypted messages.
              </p>
            </div>
          ) : (
            <>
              {/* Thread Header */}
              <div className="flex items-center justify-between border-b border-[#bcd6fa]/40 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-electric text-white font-display text-xs font-bold">
                    {selectedThread.avatar}
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-bold text-ink">{selectedThread.name}</h3>
                    <p className="text-xs text-ink-soft">{selectedThread.role} • <span className="font-semibold text-electric">{selectedThread.pod}</span></p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="rounded-full bg-signal/15 px-2.5 py-0.5 font-mono text-[10px] font-bold text-signal">
                    Online in Sprint Room
                  </span>
                </div>
              </div>

              {/* Messages Stream */}
              <div className="py-6 space-y-4 overflow-y-auto max-h-[380px] thin-scrollbar">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-3 text-xs ${msg.isSelf ? "justify-end" : "justify-start"}`}
                  >
                    {!msg.isSelf && (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-ink text-white font-mono text-[11px] font-bold">
                        {msg.avatarUrl.length <= 4 ? msg.avatarUrl : msg.senderName.slice(0, 2).toUpperCase()}
                      </div>
                    )}

                    <div
                      className={`max-w-md rounded-2xl p-3.5 space-y-1 ${
                        msg.isSelf
                          ? "bg-electric text-white rounded-br-xs shadow-xs"
                          : "border border-[#bcd6fa]/60 bg-canvas/40 text-ink rounded-bl-xs"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3 text-[10px] opacity-75 font-mono">
                        <span>{msg.senderName}</span>
                        <span>{msg.timestamp}</span>
                      </div>
                      <p className="leading-relaxed">{msg.content}</p>
                    </div>

                    {msg.isSelf && (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-electric text-white font-mono text-[11px] font-bold">
                        ME
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Message Reply Input */}
              <form onSubmit={handleSendReply} className="pt-4 border-t border-[#bcd6fa]/40 flex gap-2">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={`Message ${selectedThread.name}...`}
                  className="flex-1 rounded-xl border border-[#bcd6fa] bg-canvas/30 px-4 py-2.5 text-xs text-ink focus:border-electric focus:bg-white focus:outline-none"
                />
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-ink px-5 py-2.5 font-display text-xs font-bold text-white hover:bg-electric transition-all shadow-xs cursor-pointer"
                >
                  <span>Send</span>
                  <ArrowRight size={14} />
                </button>
              </form>
            </>
          )}
        </div>
      </div>
      )}
    </div>
  );
}
