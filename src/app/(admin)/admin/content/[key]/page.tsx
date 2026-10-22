import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getContentBlockDetailAction,
  getContentBlockHistoryAction,
} from "@/actions/content.actions";
import { AdminContentEditor } from "@/components/admin/content/AdminContentEditor";
import { AdminHomepageSplitEditor } from "@/components/admin/content/AdminHomepageSplitEditor";
import { AdminCollectionEditor } from "@/components/admin/content/AdminCollectionEditor";

// All valid content keys from the backend SiteContent.Key choices
const VALID_KEYS: Record<string, string> = {
  homepage: "Homepage Master Layout",
  homepage_hero: "Homepage Hero Section",
  homepage_stats: "Homepage Stats & Metrics",
  homepage_sections: "Homepage Section Blocks",
  services_list: "Services & Solutions Suite",
  case_studies: "Technical Case Studies",
  healthcare_page: "Healthcare & Compliance Practice",
  about_page: "About Page Content",
  site_navigation: "Site Navigation Links",
  contact_info: "Contact Information",
  footer_content: "Footer Content",
  cta_banners: "CTA Banners",
};

interface Props {
  params: Promise<{ key: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { key } = await params;
  const label = VALID_KEYS[key] ?? key;
  return {
    title: `Edit ${label} | Pepoltek Admin`,
    description: `Manage and publish the "${label}" content block from the Pepoltek admin panel.`,
  };
}

export default async function AdminContentEditorPage({ params }: Props) {
  const { key } = await params;

  if (!VALID_KEYS[key]) {
    notFound();
  }

  const [detailResult, historyResult] = await Promise.all([
    getContentBlockDetailAction(key),
    getContentBlockHistoryAction(key),
  ]);

  const blockDetail = detailResult.data ?? { published: null, latest: null };
  const history = historyResult.data ?? [];

  // Dedicated two-sided split-screen live editor for the full Homepage
  if (key === "homepage") {
    return <AdminHomepageSplitEditor blockDetail={blockDetail} history={history} />;
  }

  // Dedicated interactive Collection + PageHero editor for Services, Case Studies, and Healthcare
  if (key === "services_list" || key === "case_studies" || key === "healthcare_page") {
    return (
      <AdminCollectionEditor
        contentKey={key}
        keyLabel={VALID_KEYS[key]}
        blockDetail={blockDetail}
        history={history}
      />
    );
  }

  return (
    <AdminContentEditor
      contentKey={key}
      keyLabel={VALID_KEYS[key]}
      blockDetail={blockDetail}
      history={history}
    />
  );
}
