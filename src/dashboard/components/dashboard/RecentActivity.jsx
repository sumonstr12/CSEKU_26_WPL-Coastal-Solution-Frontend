import { CircleCheck, FileText, LifeBuoy, TriangleAlert, UserCheck, Warehouse, Server } from "lucide-react";
import { clockBn } from "../../utils/format";
import { cn } from "../../utils/cn.js";

const KIND = {
  alert: { icon: TriangleAlert, box: "bg-amber-50 text-amber-600 ring-amber-100" },
  report: { icon: FileText, box: "bg-lagoon-50 text-lagoon-600 ring-lagoon-100" },
  shelter: { icon: Warehouse, box: "bg-sky-50 text-sky-600 ring-sky-100" },
  mission: { icon: LifeBuoy, box: "bg-orange-50 text-orange-600 ring-orange-100" },
  verification: { icon: CircleCheck, box: "bg-emerald-50 text-emerald-600 ring-emerald-100" },
  user: { icon: UserCheck, box: "bg-cyan-50 text-cyan-700 ring-cyan-100" },
  system: { icon: Server, box: "bg-slate-100 text-slate-500 ring-slate-200" },
};

/**
 * Vertical activity timeline.
 * items: [{ kind, title, body?, place?, time }]
 */
export default function RecentActivity({ items, compact }) {
  if (!items?.length) return null;
  return (
    <ol className="relative space-y-0">
      {items.map((item, i) => {
        const k = KIND[item.kind] || KIND.system;
        const Icon = k.icon;
        const last = i === items.length - 1;
        return (
          <li key={item.id || i} className="relative flex gap-3.5 pb-5 last:pb-0">
            {!last && <span className="absolute left-[17px] top-9 h-[calc(100%-36px)] w-px bg-slate-200" />}
            <span className={cn("z-10 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full ring-4", k.box)}>
              <Icon size={16} />
            </span>
            <div className="min-w-0 flex-1 pt-0.5">
              <div className="flex items-baseline justify-between gap-3">
                <p className="truncate text-sm font-semibold text-slate-700">{item.title}</p>
                <time className="shrink-0 text-[11px] font-medium text-slate-400">{clockBn(item.time)}</time>
              </div>
              {(item.body || item.place) && !compact && (
                <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-slate-400">{item.body || item.place}</p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
