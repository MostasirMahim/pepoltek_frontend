/**
 * Pepoltek Referrals Mock Data & Typed Interfaces
 * Re-exports canonical referral records and supplies the partner leaderboard.
 *
 * Rules:
 * - Zero em dashes or en dashes throughout copy
 * - Enterprise-grade precision terminology
 */

import { ReferralRecord, BountySummary } from "../talentDashboardData";

export interface ReferralLeaderboardEntry {
  rank: number;
  referrerName: string;
  successfulDeployments: number;
  totalBounties: string;
  badge: string;
}

export const REFERRAL_LEADERBOARD: ReferralLeaderboardEntry[] = [
  {
    rank: 1,
    referrerName: "David Sterling",
    successfulDeployments: 12,
    totalBounties: "$24,500",
    badge: "Diamond Partner",
  },
  {
    rank: 2,
    referrerName: "Elena Rostova",
    successfulDeployments: 9,
    totalBounties: "$18,200",
    badge: "Platinum Partner",
  },
  {
    rank: 3,
    referrerName: "Alex Morgan",
    successfulDeployments: 4,
    totalBounties: "$6,250",
    badge: "Gold Referrer",
  },
  {
    rank: 4,
    referrerName: "Rachel Higgins",
    successfulDeployments: 3,
    totalBounties: "£4,500",
    badge: "Silver Referrer",
  },
];
