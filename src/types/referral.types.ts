/**
 * Referral Program Domain Types
 * Pure TypeScript interfaces representing partner and candidate referral records,
 * bounty summaries, and leaderboard data. Zero mock data.
 */

export interface ReferralRecord {
  id: string;
  candidateName: string;
  role: string;
  sector: "Technology" | "Healthcare";
  stage: "Submitted" | "Screened" | "Interviewed" | "Placed & Deployed";
  stageIndex: number; // 1 to 4
  bountyAmount: string;
  payoutStatus: "Cleared for Payout" | "Escrow Locked" | "Pending Placement";
  submittedDate: string;
  payoutDate?: string;
}

export interface BountySummary {
  totalEarned: string;
  clearedPayout: string;
  escrowLocked: string;
  pendingPipeline: string;
  referralLink: string;
  totalReferrals: number;
  placedCount: number;
}

export interface ReferralLeaderboardEntry {
  rank: number;
  referrerName: string;
  successfulDeployments: number;
  totalBounties: string;
  badge: string;
}
