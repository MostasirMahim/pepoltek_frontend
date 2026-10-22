import { Metadata } from "next";
import { AdminFinanceView } from "@/components/admin/finance/AdminFinanceView";
import { getAdminLedgerAction } from "@/actions/referral.actions";

export const metadata: Metadata = {
  title: "Financial Escrow & Payouts | Pepoltek Admin",
  description: "Double-entry escrow ledger, placement fee tracking, milestone releases, and referral bounties.",
};

export default async function AdminFinancePage() {
  const result = await getAdminLedgerAction("all");

  return (
    <AdminFinanceView
      initialRecords={result.data?.records || []}
      initialTelemetry={result.data?.telemetry}
    />
  );
}

