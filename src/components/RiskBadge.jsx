import { riskLevelLabel } from "@/data/disasters";
import { classNames } from "@/lib/utils";
const RISK_STYLE = {
  low: {
    badge: "border-emerald-200 bg-emerald-50 text-emerald-800",
    dot: "bg-emerald-600",
  },
  moderate: {
    badge: "border-amber-200 bg-amber-50 text-amber-800",
    dot: "bg-amber-600",
  },
  high: {
    badge: "border-orange-200 bg-orange-50 text-orange-800",
    dot: "bg-orange-600",
  },
  critical: {
    badge: "border-red-200 bg-red-50 text-red-800",
    dot: "bg-red-600",
  },
};
export function RiskBadge({ level, className }) {
  const style = RISK_STYLE[level];
  return (
    <span className={classNames("chip", style.badge, className)}>
      <span
        className={classNames("h-1.5 w-1.5 rounded-full", style.dot)}
        aria-hidden="true"
      />
      {riskLevelLabel(level)}
    </span>
  );
}
const STATUS_STYLE = {
  active: {
    label: "সক্রিয়",
    badge: "border-orange-200 bg-orange-50 text-orange-800",
    dot: "bg-orange-600",
    pulse: true,
  },
  monitoring: {
    label: "পর্যবেক্ষণাধীন",
    badge: "border-sky-200 bg-sky-50 text-sky-800",
    dot: "bg-sky-600",
    pulse: false,
  },
  subsided: {
    label: "প্রশমিত",
    badge: "border-emerald-200 bg-emerald-50 text-emerald-800",
    dot: "bg-emerald-600",
    pulse: false,
  },
};
export function StatusBadge({ status, className }) {
  const style = STATUS_STYLE[status];
  return (
    <span className={classNames("chip", style.badge, className)}>
      <span
        className={classNames(
          "h-1.5 w-1.5 rounded-full",
          style.dot,
          style.pulse && "animate-pulse-dot",
        )}
        aria-hidden="true"
      />
      {style.label}
    </span>
  );
}
