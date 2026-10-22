import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublicJobDetailAction } from "@/actions/recruiter.actions";
import { PublicJobDetailView } from "@/components/main/jobs/PublicJobDetailView";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const job = await getPublicJobDetailAction(id);

  if (!job) {
    return {
      title: "Job Not Found | Pepoltek Limited",
      description: "The requested job requisition is not available or has been filled.",
    };
  }

  const clientName = job.client_name || "Enterprise Partner";
  return {
    title: `${job.title} (${job.level || "Senior"}) | ${clientName} | Pepoltek`,
    description:
      job.description ||
      `Apply for ${job.title} at ${clientName}. 7-day deployment SLA, competitive compensation, and 100% remote flexibility.`,
  };
}

export default async function JobDetailPage({ params }: PageProps) {
  const { id } = await params;
  const job = await getPublicJobDetailAction(id);

  if (!job) {
    notFound();
  }

  return <PublicJobDetailView job={job} />;
}
