"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Globe,
  FileText,
  Image,
  Link2,
  Zap,
  Check,
  Clock,
  Users,
  BarChart2,
  Phone,
  Layout,
  ArrowRight,
  ChevronRight,
  Stethoscope,
} from "@/components/ui/Icons";
import type { ContentBlockSummary } from "@/actions/content.actions";

// ---------------------------------------------------------------------------
// Content block metadata: icon, description, schema hint for each key
// ---------------------------------------------------------------------------

const BLOCK_META: Record<
  string,
  {
    icon: React.ReactNode;
    description: string;
    group: string;
    schemaHint: string;
  }
> = {
  homepage: {
    icon: <Globe size={18} />,
    description: "Complete 9-section homepage layout with real-time visual preview and instant editing.",
    group: "Homepage",
    schemaHint: "{ hero, specialist_tracks, sprint_matrix, hiring_velocity, commercial_terms, ai_hrms_portal, product_solutions, talent_ecosystem, cta_banner }",
  },
  homepage_hero: {
    icon: <Zap size={18} />,
    description: "Main headline, sub-headline, stats pills, and CTA buttons on the homepage.",
    group: "Homepage",
    schemaHint: "{ eyebrow, title, highlightedText, description, stats[], actions[], proofPills[] }",
  },
  homepage_stats: {
    icon: <BarChart2 size={18} />,
    description: "Key metric counters displayed across the homepage banner sections.",
    group: "Homepage",
    schemaHint: "{ stats: [{ value, label, description }] }",
  },
  homepage_sections: {
    icon: <Layout size={18} />,
    description: "Toggle visibility and edit copy for each homepage content section.",
    group: "Homepage",
    schemaHint: "{ sections: [{ id, visible, title, body }] }",
  },
  services_list: {
    icon: <FileText size={18} />,
    description: "Commercial workforce solutions suite: section hero header and interactive service cards.",
    group: "Services",
    schemaHint: "{ header: { eyebrow, title, description, stats[], specs[] }, services: [{ id, title, badge, desc, guarantee, features[] }] }",
  },
  case_studies: {
    icon: <BarChart2 size={18} />,
    description: "Technical case studies and architecture blueprints: hero header and production audit cards.",
    group: "Case Studies",
    schemaHint: "{ header: { eyebrow, title, description, stats[], specs[] }, studies: [{ slug, title, sector, client, timeline, summary, challenge, solution, metrics[] }] }",
  },
  healthcare_page: {
    icon: <Stethoscope size={18} />,
    description: "Regulated clinical staffing, healthcare operations, and health-tech EMR compliance practice.",
    group: "Healthcare",
    schemaHint: "{ header: { eyebrow, title, description, stats[], specs[] }, services: [{ id, title, badge, desc, guarantee, features[] }] }",
  },
  about_page: {
    icon: <Users size={18} />,
    description: "About page delivery pillars, team bios, and company mission statement.",
    group: "About",
    schemaHint: "{ mission, pillars: [{ role, focus, desc, badge }], values[] }",
  },
  site_navigation: {
    icon: <Link2 size={18} />,
    description: "Top navigation menu links and dropdown items.",
    group: "Site Config",
    schemaHint: "{ links: [{ label, href, children?: [{ label, href }] }] }",
  },
  contact_info: {
    icon: <Phone size={18} />,
    description: "Office address, phone numbers, email addresses, and business hours.",
    group: "Site Config",
    schemaHint: "{ email, phone, address, hours, social: { linkedin, twitter } }",
  },
  footer_content: {
    icon: <Globe size={18} />,
    description: "Footer columns, links, copyright text, and social media URLs.",
    group: "Site Config",
    schemaHint: "{ columns: [{ heading, links[] }], copyright, social: {} }",
  },
  cta_banners: {
    icon: <Image size={18} />,
    description: "Call-to-action banners used throughout the site.",
    group: "Marketing",
    schemaHint: "{ banners: [{ id, heading, body, primaryLabel, primaryHref, secondaryLabel, secondaryHref }] }",
  },
};

// Group order
const GROUP_ORDER = ["Homepage", "Services", "Case Studies", "Healthcare", "About", "Marketing", "Site Config"];

interface AdminContentOverviewProps {
  blocks: ContentBlockSummary[];
}

export function AdminContentOverview({ blocks }: AdminContentOverviewProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const filtered = blocks.filter((b) => {
    const meta = BLOCK_META[b.key];
    const label = (meta?.description || b.label || b.key).toLowerCase();
    return label.includes(search.toLowerCase()) || b.key.includes(search.toLowerCase());
  });

  // Group by category
  const grouped: Record<string, ContentBlockSummary[]> = {};
  for (const block of filtered) {
    const group = BLOCK_META[block.key]?.group ?? "Other";
    if (!grouped[group]) grouped[group] = [];
    grouped[group].push(block);
  }

  const publishedCount = blocks.filter((b) => b.has_published).length;
  const totalCount = blocks.length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-electric/30 bg-electric/10 px-3 py-0.5 text-xs font-semibold text-electric">
            <Globe size={13} />
            <span>PUBLIC SITE CONTENT MANAGEMENT</span>
          </div>
          <h1 className="mt-2 font-display text-2xl font-bold text-ink">
            Content Management Hub
          </h1>
          <p className="text-xs text-ink-soft mt-1">
            Manage all public website content without code deploys. Changes publish instantly.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-signal/30 bg-signal/5 px-4 py-2 text-center">
            <div className="font-display text-xl font-bold text-signal">{publishedCount}/{totalCount}</div>
            <div className="text-[10px] font-mono text-ink-soft uppercase tracking-wide">Blocks Published</div>
          </div>
        </div>
      </div>

      {/* Featured Split-Screen Homepage Editor Banner */}
      <div className="rounded-2xl border border-electric/40 bg-gradient-to-r from-electric/10 via-cyan-500/5 to-transparent p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-electric text-white shadow-md shadow-electric/25">
            <Globe size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-base font-bold text-ink">
                Visual Split-Screen Homepage Editor
              </span>
              <span className="rounded-full bg-electric/15 px-2.5 py-0.5 font-mono text-[10px] font-bold text-electric">
                LIVE PREVIEW
              </span>
            </div>
            <p className="text-xs text-ink-soft mt-1 max-w-2xl leading-relaxed">
              Edit all 9 visual homepage sections (Hero, Specialist Tracks, Sprint Matrix, Calculator, Terms, AI HRMS, Products, Talent Ecosystem, CTA) side-by-side with an instant desktop, tablet, and mobile preview before saving.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => router.push("/admin/content/homepage")}
          className="inline-flex items-center gap-2 rounded-xl bg-electric px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-electric-bright transition-all cursor-pointer whitespace-nowrap shrink-0"
        >
          <span>Launch Live Editor</span>
          <ChevronRight size={14} />
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <input
          type="text"
          placeholder="Search content blocks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-[#bcd6fa] bg-white px-4 py-2.5 pl-9 text-xs text-ink placeholder-ink-soft focus:border-electric focus:outline-none focus:ring-1 focus:ring-electric/30"
        />
        <FileText
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft"
        />
      </div>

      {/* Groups */}
      {GROUP_ORDER.filter((g) => grouped[g]?.length).map((group) => (
        <div key={group}>
          <div className="mb-3 flex items-center gap-2">
            <h2 className="font-display text-sm font-bold text-ink">{group}</h2>
            <div className="h-px flex-1 bg-[#bcd6fa]/50" />
            <span className="font-mono text-[10px] text-ink-soft">
              {grouped[group].length} block{grouped[group].length !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {grouped[group].map((block) => {
              const meta = BLOCK_META[block.key];
              return (
                <button
                  key={block.key}
                  onClick={() => router.push(`/admin/content/${block.key}`)}
                  className="group text-left rounded-2xl border border-[#bcd6fa] bg-white p-5 shadow-xs hover:border-electric/50 hover:shadow-md transition-all duration-200 cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-electric/10 text-electric border border-electric/20 group-hover:bg-electric group-hover:text-white transition-all shrink-0">
                      {meta?.icon ?? <FileText size={18} />}
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {block.has_published ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-signal/10 border border-signal/20 px-2 py-0.5 text-[10px] font-bold text-signal">
                          <Check size={9} />
                          LIVE v{block.published_version}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-bold text-amber-600">
                          <Clock size={9} />
                          NOT PUBLISHED
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-3">
                    <h3 className="font-display text-sm font-bold text-ink group-hover:text-electric transition-colors">
                      {block.label}
                    </h3>
                    <p className="mt-1 text-[11px] text-ink-soft leading-relaxed line-clamp-2">
                      {meta?.description ?? "Manage content for this block."}
                    </p>
                  </div>

                  {block.last_updated && (
                    <div className="mt-3 pt-3 border-t border-[#bcd6fa]/50 flex items-center justify-between">
                      <span className="text-[10px] text-ink-soft">
                        {block.last_author ?? "System"} &middot;{" "}
                        {new Date(block.last_updated).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                      <ArrowRight
                        size={14}
                        className="text-ink-soft group-hover:text-electric transition-colors"
                      />
                    </div>
                  )}
                  {!block.last_updated && (
                    <div className="mt-3 pt-3 border-t border-[#bcd6fa]/50 flex justify-end">
                      <ArrowRight
                        size={14}
                        className="text-ink-soft group-hover:text-electric transition-colors"
                      />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {filtered.length === 0 && (
        <div className="rounded-2xl border border-dashed border-[#bcd6fa] bg-white/50 py-16 text-center">
          <FileText size={32} className="mx-auto text-ink-soft/40 mb-3" />
          <p className="text-sm text-ink-soft">No content blocks match your search.</p>
        </div>
      )}
    </div>
  );
}
