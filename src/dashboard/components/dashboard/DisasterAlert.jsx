import { Link } from "react-router-dom";
import { ArrowRight, MapPin, TriangleAlert } from "lucide-react";
import { disasterType } from "../../config/disasterTypes";
import { timeAgoBn } from "../../utils/format";
import { SEVERITY } from "../../config/disasterTypes";
import { cn } from "../../utils/cn.js";

/**
 * Live disaster alert banner.
 * data: { title, areas[], severity, signal, startedAt, source, type }
 */
export default function DisasterAlert({ data, to = "/dashboard/map", compact }) {
  if (!data) return null;
  const sev = SEVERITY[data.severity] || SEVERITY.MODERATE;
  const TypeIcon = disasterType(data.type).icon;
  const isCritical = data.severity === "CRITICAL" || data.severity === "HIGH";

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border p-4 sm:p-5",
        isCritical ? "border-orange-200 bg-linear-to-r from-amber-50 via-orange-50/60 to-white" : "border-amber-200 bg-amber-50/70"
      )}
    >
      <div className="pointer-events-none absolute -right-10 -top-14 h-40 w-40 rounded-full bg-orange-200/30 blur-2xl" />
      <div className="relative flex flex-wrap items-center gap-4">
        <div className="relative">
          <span className={cn("inline-flex h-12 w-12 items-center justify-center rounded-2xl", isCritical ? "bg-orange-100 text-orange-600" : "bg-amber-100 text-amber-600")}>
            <TypeIcon size={24} />
          </span>
          <span className="absolute -right-1 -top-1 flex h-4 w-4">
            <span className={cn("absolute h-full w-full animate-ping-soft rounded-full", isCritical ? "bg-orange-400" : "bg-amber-400")} />
            <span className={cn("relative h-4 w-4 rounded-full border-2 border-white", isCritical ? "bg-orange-500" : "bg-amber-500")} />
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-[15px] font-bold text-slate-800 sm:text-base">{data.title}</h3>
            {!compact && (
              <span className={cn("chip", sev.chip)}>
                <TriangleAlert size={11} />
                ঝুঁকি: {sev.label}
              </span>
            )}
          </div>
          <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-slate-500">
            <span className="inline-flex items-center gap-1">
              <MapPin size={13} className="text-orange-500" />
              {(data.areas || []).join(", ")}
            </span>
            {data.signal && <span className="font-semibold text-orange-600">{data.signal}</span>}
            {data.startedAt && <span className="text-slate-400">জারি: {timeAgoBn(data.startedAt)}</span>}
          </p>
        </div>

        <Link
          to={to}
          className="inline-flex items-center gap-1.5 rounded-xl border border-orange-300/80 bg-white/80 px-3.5 py-2 text-[13px] font-bold text-orange-700 shadow-sm transition hover:bg-white hover:shadow active:scale-[0.97]"
        >
          বিস্তারিত দেখুন
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
