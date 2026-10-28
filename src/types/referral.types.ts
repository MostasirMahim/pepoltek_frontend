/**
 * Referral Program Domain Types
 * Pure TypeScript interfaces representing partner and candidate referral records,
 * bounty summaries, and leaderboard data. Zero mock data.
 */

export interface ReferralRecord {
  id: string;
  candidateName: string;
  candidateEmail?: string;
  role: string;
  sector: "Technology" | "Healthcare";
  stage: "Submitted" | "Screened" | "Interviewed" | "Placed & Deployed" | string;
  stageIndex: number; // 1 to 4
  bountyAmount: string;
  payoutStatus: "Cleared for Payout" | "Escrow Locked" | "Pending Placement" | "Paid" | string;
  submittedDate: string;
  payoutDate?: string;
  referralType?: string;
  paidReference?: string;
  notes?: string;
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
