import { ChevronRight } from "lucide-react";
import { AREA_LEVEL_LABELS, AREA_ORDER } from "@/components/profiles/data/administrativeAreas";
import { cn } from "@/components/profiles/lib/utils";
function AreaWithLevel(area) {
  return AREA_ORDER.map((level) => {
    const value = area[level];
    return value
      ? {
          level,
          value,
        }
      : null;
  }).filter((entry) => Boolean(entry));
}

/**
 * Renders a hierarchical administrative area either as an inline breadcrumb
 * (খুলনা → খুলনা → কয়রা → মহারাজপুর) or as stacked level rows.
 */
export default function AdministrativeAreaDisplay({
  area,
  variant = "breadcrumb",
  className,
}) {
  const parts = area ? AreaWithLevel(area) : [];
  if (parts.length === 0) return null;
  if (variant === "rows") {
    return (
      <dl className={cn("grid gap-2.5 sm:grid-cols-2", className)}>
        {parts.map(({ level, value }) => (
          <div
            key={level}
            className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/70 px-3.5 py-2.5"
          >
            <dt className="text-xs font-medium text-slate-500">
              {AREA_LEVEL_LABELS[level]}
            </dt>
            <dd className="text-sm font-semibold text-slate-800">{value}</dd>
          </div>
        ))}
      </dl>
    );
  }
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-y-1.5 text-sm sm:text-[15px]",
        className,
      )}
    >
      {parts.map(({ level, value }, index) => (
        <span key={`${level}-${index}`} className="flex items-center">
          {index > 0 && (
            <ChevronRight
              className="mx-1 size-3.5 shrink-0 text-teal-500"
              strokeWidth={2.4}
            />
          )}
          <span className="font-semibold text-slate-800">{value}</span>
          <span className="ml-1 text-xs font-medium text-slate-400">
            {AREA_LEVEL_LABELS[level]}
          </span>
        </span>
      ))}
    </div>
  );
}
