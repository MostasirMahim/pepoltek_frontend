import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getInterviewDetailAction } from "@/actions/recruiter.actions";
import { InterviewDetailView } from "@/components/recruiter/interviews/InterviewDetailView";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const interview = await getInterviewDetailAction(id);
  return {
    title: interview ? `${interview.title} | Admin Mission Control` : "Interview Details | Admin",
    description: "Technical interview session details, Google Meet room coordinates, and evaluation scorecards.",
  };
}

export default async function AdminInterviewDetailPage({ params }: PageProps) {
  const { id } = await params;
  const interview = await getInterviewDetailAction(id);

  if (!interview) {
    notFound();
  }

  return <InterviewDetailView interview={interview} basePath="/admin/interviews" />;
}
