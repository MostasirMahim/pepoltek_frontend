import Link from "next/link";
import { ArrowLeft, Briefcase, Search } from "lucide-react";

export default function JobNotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-[#f8fbff]">
      <div className="max-w-md w-full bg-white rounded-3xl border border-[#bcd6fa] p-8 text-center shadow-xs">
        <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-[#bcd6fa] flex items-center justify-center mx-auto mb-5 text-electric">
          <Briefcase className="w-7 h-7" />
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full border border-signal/30 bg-signal/10 px-3 py-0.5 text-[11px] font-mono font-bold text-signal uppercase tracking-wider mb-3">
          Requisition Unavailable
        </span>

        <h1 className="font-display text-2xl font-bold text-ink">
          Job Requisition Not Found
        </h1>

        <p className="text-xs text-ink-soft mt-2 leading-relaxed">
          This requisition link may have expired, been filled, or refreshed during the latest platform database reset.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row gap-2.5">
          <Link
            href="/jobs"
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-ink px-4 py-2.5 font-display text-xs font-semibold text-white shadow-xs hover:bg-electric transition-colors"
          >
            <Search className="w-4 h-4" />
            <span>Browse Active Jobs</span>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#bcd6fa] bg-canvas/40 px-4 py-2.5 font-display text-xs font-semibold text-ink hover:bg-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
