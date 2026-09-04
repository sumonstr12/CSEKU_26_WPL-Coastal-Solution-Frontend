import {
  ArrowRight,
  CalendarDays,
  Clock,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import { RiskBadge, StatusBadge } from "@/components/RiskBadge";
import { disasterTypeIcon, disasterTypeLabel } from "@/data/disasters";
export default function DisasterCard({ report, onView }) {
  const TypeIcon = disasterTypeIcon(report.typeKey);
  return (
    <article className="card group flex h-full flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-44 shrink-0 overflow-hidden">
        <img
          src={report.image}
          alt={report.imageAlt}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
        />
        <div
          className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/50 to-transparent"
          aria-hidden="true"
        />
        <div className="absolute top-3 right-3 left-3 flex items-start justify-between gap-2">
          <RiskBadge level={report.severity} className="backdrop-blur-sm" />
          <StatusBadge status={report.status} className="backdrop-blur-sm" />
        </div>
        <p className="absolute bottom-2.5 left-3 inline-flex items-center gap-1.5 text-xs font-semibold text-white">
          <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
          {report.district} • {report.upazila}
        </p>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="flex items-center gap-2.5 text-[16px] leading-snug font-bold text-ink-950">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-teal-50 text-teal-700 ring-1 ring-teal-600/15 ring-inset">
            <TypeIcon className="h-4 w-4" aria-hidden="true" />
          </span>
          {report.title}
        </h3>
        <p className="mt-2.5 line-clamp-3 text-[13.5px] leading-relaxed text-ink-500">
          {report.summary}
        </p>

        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-ink-500">
          <span className="inline-flex items-center gap-1">
            <CalendarDays
              className="h-3.5 w-3.5 text-ink-300"
              aria-hidden="true"
            />
            {report.date}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-ink-300" aria-hidden="true" />
            {report.time}
          </span>
        </div>
        <p className="mt-1.5 inline-flex items-center gap-1 text-[12px] font-medium text-teal-800">
          <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
          যাচাইকৃত — {report.verifiedBy}
        </p>

        <div className="mt-4 flex items-center justify-between border-t border-stone-100 pt-3">
          <span className="text-[12px] font-semibold text-ink-500">
            {disasterTypeLabel(report.typeKey)}
          </span>
          <button
            type="button"
            onClick={() => onView(report)}
            className="inline-flex cursor-pointer items-center gap-1 rounded-lg px-2 py-1 text-[13px] font-bold text-teal-700 transition hover:bg-teal-50"
          >
            বিস্তারিত দেখুন
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  );
}
