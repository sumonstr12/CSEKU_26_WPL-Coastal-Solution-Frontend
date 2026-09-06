import { Link } from "react-router-dom";
import { cn } from "../../utils/cn.js";

/**
 * Quick action button grid — big, touch-friendly shortcut cards.
 * actions: [{ to, icon:Icon, label, desc, tone }]
 */
export default function QuickActions({ actions, title = "দ্রুত কার্যক্রম" }) {
  return (
    <div>
      {title && <h3 className="mb-3 text-[15px] font-bold text-slate-800">{title}</h3>}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {actions.map((a) => {
          const tones = {
            primary: "border-lagoon-200 bg-gradient-to-br from-lagoon-600 to-lagoon-700 text-white hover:from-lagoon-700 hover:to-lagoon-800 shadow-md shadow-lagoon-600/20",
            warning: "border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 text-amber-900 hover:shadow-lift",
            soft: "border-slate-200 bg-white text-slate-700 hover:border-lagoon-300 hover:shadow-lift",
          };
          const iconTones = {
            primary: "bg-white/15 text-white",
            warning: "bg-amber-100 text-amber-700",
            soft: "bg-lagoon-50 text-lagoon-600",
          };
          return (
            <Link
              key={a.label}
              to={a.to}
              className={cn(
                "group flex items-center gap-3.5 rounded-2xl border p-4 transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98]",
                tones[a.tone || "soft"]
              )}
            >
              <span className={cn("inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110", iconTones[a.tone || "soft"])}>
                <a.icon size={21} strokeWidth={2} />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-bold">{a.label}</span>
                {a.desc && <span className={cn("block truncate text-xs opacity-75")}>{a.desc}</span>}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
