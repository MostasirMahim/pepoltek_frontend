import { getPublicSiteContentAction } from "@/actions/content.actions";
import type { HomepageMasterData } from "@/components/admin/content/AdminHomepageSplitEditor";
import Hero from "@/components/main/sections/Hero";
import SpecialistDeliveryTracks from "@/components/main/sections/SpecialistDeliveryTracks";
import HiringVelocity from "@/components/main/sections/HiringVelocity";
import CommercialTerms from "@/components/main/sections/CommercialTerms";
import SprintExecutionMatrix from "@/components/main/sections/SprintExecutionMatrix";
import AiHrmsPortal from "@/components/main/sections/AiHrmsPortal";
import ProductSolutions from "@/components/main/sections/ProductSolutions";
import TalentEcosystem from "@/components/main/sections/TalentEcosystem";
import CtaBanner from "@/components/main/sections/CtaBanner";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function MainPage() {
  const contentRes = await getPublicSiteContentAction<HomepageMasterData>("homepage");
  const data = contentRes.success ? contentRes.data : undefined;

  return (
    <>
      <Hero content={data?.hero} />
      <SpecialistDeliveryTracks content={data?.specialist_tracks} />
      <SprintExecutionMatrix content={data?.sprint_matrix} />
      <HiringVelocity content={data?.hiring_velocity} />
      <CommercialTerms content={data?.commercial_terms} />
      <AiHrmsPortal content={data?.ai_hrms_portal} />
      <ProductSolutions content={data?.product_solutions} />
      <TalentEcosystem content={data?.talent_ecosystem} />
      <CtaBanner content={data?.cta_banner} />
    </>
  );
}
