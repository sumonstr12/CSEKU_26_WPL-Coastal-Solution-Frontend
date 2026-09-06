import { REPORT_STATUS, SEVERITY } from "../../config/disasterTypes";
import { AVAILABILITY } from "../../config/roleConfig";
import { cn } from "../../utils/cn.js";

export function StatusPill({ status, className }) {
  const s = REPORT_STATUS[status] || { label: status, chip: "bg-slate-100 text-slate-600 ring-1 ring-slate-200" };
  return <span className={cn("chip whitespace-nowrap", s.chip, className)}>{s.label}</span>;
}

export function SeverityPill({ severity, className }) {
  const s = SEVERITY[severity] || SEVERITY.LOW;
  return (
    <span className={cn("chip whitespace-nowrap", s.chip, className)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", s.dot)} />
      {s.label}
    </span>
  );
}

export function GenericPill({ children, tone = "slate", className }) {
  const tones = {
    slate: "bg-slate-100 text-slate-600 ring-1 ring-slate-200",
    lagoon: "bg-lagoon-50 text-lagoon-700 ring-1 ring-lagoon-200",
    emerald: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    amber: "bg-amber-50 text-amber-800 ring-1 ring-amber-200",
    red: "bg-red-50 text-red-700 ring-1 ring-red-200",
    sky: "bg-sky-50 text-sky-700 ring-1 ring-sky-200",
  };
  return <span className={cn("chip whitespace-nowrap", tones[tone], className)}>{children}</span>;
}

export function AvailabilityPill({ status, className }) {
  const a = AVAILABILITY[status];
  if (!a) return null;
  return (
    <span className={cn("chip", a.chip, className)}>
      <span className="relative flex h-2 w-2">
        <span className={cn("absolute inline-flex h-full w-full animate-ping-soft rounded-full opacity-60", a.dot)} />
        <span className={cn("relative inline-flex h-2 w-2 rounded-full", a.dot)} />
      </span>
      {a.label}
    </span>
  );
}
