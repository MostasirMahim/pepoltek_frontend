"use client";

import { useState } from "react";
import {
  Users,
  Search,
  ArrowRight,
  ShieldCheck,
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

export default function CandidateMessagesPage() {
  const [selectedThread, setSelectedThread] = useState<Thread>(THREADS[0]);
  const [messages, setMessages] = useState<ChatMessage[]>(CHAT_MESSAGES);
  const [replyText, setReplyText] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    const newMessage: ChatMessage = {
      id: `MSG-${Date.now()}`,
      senderName: "Alex Morgan",
      senderRole: "Lead Architect",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
      isSelf: true,
      timestamp: "Just now",
      content: replyText.trim(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setReplyText("");
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-electric/30 bg-electric/10 px-3 py-0.5 text-[11px] font-mono font-semibold text-electric uppercase tracking-widest">
          <span>Encrypted Sprint Channel</span>
        </div>
        <h1 className="mt-2 font-display text-2xl sm:text-3xl font-bold tracking-tight text-ink">
          Pod Sprints and Direct Communications
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-ink-soft max-w-2xl">
          Direct asynchronous and live standup messaging with designated Pod Leads and Technical Directors.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 rounded-3xl border border-[#bcd6fa] bg-white overflow-hidden shadow-xs h-[640px]">
        {/* Left List of Threads */}
        <div className="border-r border-[#bcd6fa]/50 flex flex-col">
          <div className="p-3.5 border-b border-[#bcd6fa]/40 bg-canvas/30 relative">
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full rounded-xl border border-[#bcd6fa] bg-white pl-8 pr-3 py-2 text-xs text-ink placeholder-mist focus:border-electric focus:outline-hidden"
            />
            <div className="absolute left-6 top-6 text-mist">
              <Search size={13} />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-[#bcd6fa]/20">
            {THREADS.map((th) => (
              <button
                key={th.id}
                type="button"
                onClick={() => setSelectedThread(th)}
                className={`w-full p-4 text-left transition-colors flex items-start gap-3 cursor-pointer ${
                  selectedThread.id === th.id
                    ? "bg-electric/5 border-l-4 border-l-electric"
                    : "hover:bg-canvas/40"
                }`}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ink font-display text-xs font-bold text-white shadow-xs">
                  {th.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-xs font-bold text-ink truncate">{th.name}</span>
                    <span className="font-mono text-[10px] text-mist">{th.time}</span>
                  </div>
                  <div className="font-mono text-[10px] text-electric truncate">{th.pod}</div>
                  <p className="text-xs text-ink-soft truncate mt-1">{th.lastMessage}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Active Message Chat Box */}
        <div className="lg:col-span-2 flex flex-col justify-between">
          {/* Active Chat Header */}
          <div className="p-4 border-b border-[#bcd6fa]/40 flex items-center justify-between bg-canvas/20">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink font-display text-xs font-bold text-white shadow-2xs">
                {selectedThread.avatar}
              </div>
              <div>
                <h3 className="font-display text-sm font-bold text-ink">{selectedThread.name}</h3>
                <span className="font-mono text-[11px] text-mist">
                  {selectedThread.role} • <span className="text-electric font-semibold">{selectedThread.pod}</span>
                </span>
              </div>
            </div>

            <span className="inline-flex items-center gap-1.5 rounded-full bg-signal/10 px-3 py-1 font-mono text-[10.5px] font-bold text-signal">
              <ShieldCheck size={13} />
              <span>Encrypted</span>
            </span>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-canvas/10">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.isSelf ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-md rounded-2xl p-4 text-xs leading-relaxed ${
                    m.isSelf
                      ? "bg-ink text-white rounded-br-none shadow-xs"
                      : "bg-white border border-[#bcd6fa] text-ink rounded-bl-none shadow-xs"
                  }`}
                >
                  <p>{m.content}</p>
                </div>
                <span className="mt-1 font-mono text-[10px] text-mist px-1.5">
                  {m.senderName} • {m.timestamp}
                </span>
              </div>
            ))}
          </div>

          {/* Reply Box */}
          <form onSubmit={handleSend} className="p-3.5 border-t border-[#bcd6fa]/40 bg-white flex gap-2.5">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={`Message ${selectedThread.name}...`}
              className="flex-1 rounded-xl border border-[#bcd6fa] bg-canvas/30 px-4 py-2.5 text-xs text-ink placeholder-mist focus:border-electric focus:bg-white focus:outline-hidden"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-xl bg-electric px-5 py-2.5 font-display text-xs font-bold text-white hover:bg-electric-bright transition-colors cursor-pointer shadow-xs"
            >
              <span>Send</span>
              <ArrowRight size={13} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
