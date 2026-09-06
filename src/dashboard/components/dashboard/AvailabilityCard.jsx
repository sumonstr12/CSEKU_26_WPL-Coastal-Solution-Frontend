import { Link } from "react-router-dom";
import { ArrowRight, UserCheck } from "lucide-react";
import { AVAILABILITY } from "../../config/roleConfig";
import { cn } from "../../utils/cn.js";

/** Prominent availability status block for volunteers & responders */
export default function AvailabilityCard({ user, onChangeLink = "/dashboard/availability" }) {
  const status = user?.availability || "AVAILABLE";
  const conf = AVAILABILITY[status];
  const isResponder = user?.role === "RESPONDER";

  const wrapper =
    status === "AVAILABLE"
      ? "from-emerald-500 to-teal-600"
      : status === "ON_MISSION"
        ? "from-amber-500 to-orange-600"
        : "from-slate-500 to-slate-600";

  return (
    <div className={cn("relative overflow-hidden rounded-2xl bg-linear-to-br p-5 text-white shadow-lift", wrapper)}>
      <div className="pointer-events-none absolute -right-8 -top-10 h-36 w-36 rounded-full bg-white/10 blur-xl" />
      <div className="pointer-events-none absolute -bottom-12 -left-6 h-32 w-32 rounded-full bg-black/10 blur-xl" />
      <div className="relative flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
            <UserCheck size={24} />
          </span>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-white/75">
              বর্তমান {isResponder ? "Availability" : "অবস্থা"} — {status}
            </p>
            <p className="mt-0.5 flex items-center gap-2 text-lg font-bold">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute h-full w-full animate-ping-soft rounded-full bg-white/80" />
                <span className="relative h-2.5 w-2.5 rounded-full bg-white" />
              </span>
              {conf.label}
            </p>
          </div>
        </div>
        <Link
          to={onChangeLink}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-white/15 px-3.5 py-2 text-[13px] font-bold backdrop-blur transition hover:bg-white/25 active:scale-[0.97]"
        >
          পরিবর্তন করুন
          <ArrowRight size={14} />
        </Link>
      </div>
      <p className="relative mt-3 text-[12px] leading-relaxed text-white/75">
        {status === "AVAILABLE" && "আপনি এখন জরুরি কার্যক্রমের জন্য উপলব্ধ। নতুন অনুরোধ এলে সাথে সাথে জানানো হবে।"}
        {status === "ON_MISSION" && `আপনি বর্তমানে মিশনে নিয়োজিত${user?.team ? ` — ${user.team}` : ""}।`}
        {status === "UNAVAILABLE" && "আপনি এখন অনুপলব্ধ হিসেবে চিহ্নিত। জরুরি অবস্থায় হলে অবস্থা পরিবর্তন করুন।"}
      </p>
    </div>
  );
}
