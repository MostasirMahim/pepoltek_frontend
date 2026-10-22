import { Metadata } from "next";
import { AdminTaxonomyManager } from "@/components/admin/settings/AdminTaxonomyManager";
import { getTaxonomiesAction, getTaxonomyHistoryAction } from "@/actions/taxonomy.actions";

export const metadata: Metadata = {
  title: "Candidate Choice Matrix & Taxonomies | Pepoltek Admin",
  description: "Dynamic choice matrix for sectors, domains, skills, seniorities, visas, and engagement models.",
};

export default async function AdminTaxonomiesPage() {
  const [taxonomiesRes, historyRes] = await Promise.all([
    getTaxonomiesAction(),
    getTaxonomyHistoryAction(),
  ]);

  return (
    <AdminTaxonomyManager
      initialVersion={taxonomiesRes.version}
      initialMatrix={taxonomiesRes.data}
      initialHistory={historyRes.history || []}
      publishedAt={taxonomiesRes.published_at}
      author={taxonomiesRes.author}
    />
  );
}
