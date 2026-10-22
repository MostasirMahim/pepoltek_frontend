import { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/main/PageHero";
import { getPublicJobsAction } from "@/actions/recruiter.actions";
import { Zap, Users, Clock, ArrowRight, Upload, Briefcase } from "@/components/ui/Icons";

export const metadata: Metadata = {
  title: "Careers & Job Opportunities | Pepoltek Limited",
  description:
    "Browse open engineering pods, clinical staffing roles, and specialist positions at Pepoltek. 7-day deployment SLA with transparent compensation and remote-first opportunities.",
};

export default async function CareerPage() {
  const jobs = await getPublicJobsAction();
  const openCount = Array.isArray(jobs) ? jobs.length : 0;

  return (
    <div className="relative min-h-screen bg-canvas">
      <PageHero
        eyebrow="Open Opportunities"
        title="Join the Pepoltek"
        highlightedText="Talent Network"
        description="Work with elite engineering squads and clinical staffing teams. Remote-first, competitive compensation, and direct access to Tier-1 enterprise clients."
        stats={[
          {
            value: openCount > 0 ? `${openCount} Open` : "Active",
            label: "Live Positions",
            icon: <Briefcase size={20} />,
          },
          {
            value: "7 Days",
            label: "Avg Deployment SLA",
            icon: <Clock size={20} />,
          },
          {
            value: "Remote",
            label: "First Culture",
            icon: <Users size={20} />,
          },
        ]}
        actions={[
          {
            label: "Browse All Positions",
            href: "/jobs",
            primary: true,
          },
          {
            label: "Submit Your CV",
            href: "/career/upload_cv",
          },
        ]}
        proofPills={[
          "W2 & C2C Contracts",
          "4 to 8 Hrs Live Overlap",
          "Enterprise Clients Only",
          "Remote First",
        ]}
      />

      {/* Two paths */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Browse Jobs */}
          <Link
            href="/jobs"
            className="group flex flex-col justify-between rounded-3xl border border-[#bcd6fa] bg-white p-8 shadow-xs hover:border-electric/60 hover:shadow-lg transition-all duration-200"
          >
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-electric/10 text-electric border border-electric/25 group-hover:bg-electric group-hover:text-white transition-all">
                <Briefcase size={22} />
              </div>
              <h2 className="mt-5 font-display text-xl font-bold text-ink group-hover:text-electric transition-colors">
                Browse Open Positions
              </h2>
              <p className="mt-2.5 text-sm text-ink-soft leading-relaxed">
                Explore live engineering pods, clinical staffing roles, and specialist positions with full transparency on compensation and timelines.
              </p>
            </div>
            <div className="mt-8 flex items-center gap-2 text-sm font-bold text-electric">
              View All Jobs
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Upload CV */}
          <Link
            href="/career/upload_cv"
            className="group flex flex-col justify-between rounded-3xl border border-[#bcd6fa] bg-white p-8 shadow-xs hover:border-electric/60 hover:shadow-lg transition-all duration-200"
          >
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-signal/10 text-signal border border-signal/25 group-hover:bg-signal group-hover:text-white transition-all">
                <Upload size={22} />
              </div>
              <h2 className="mt-5 font-display text-xl font-bold text-ink group-hover:text-electric transition-colors">
                Submit Your CV
              </h2>
              <p className="mt-2.5 text-sm text-ink-soft leading-relaxed">
                No active role matching your profile? Submit your CV to our talent pool and get matched when the right opportunity arises.
              </p>
            </div>
            <div className="mt-8 flex items-center gap-2 text-sm font-bold text-signal">
              Upload CV Now
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
