import { TrendingDown, TrendingUp } from "lucide-react";
import { iconOf } from "../../config/iconMap";
import { bn, bnNum } from "../../utils/format";
import { useCountUp } from "../../hooks/useDashboard";
import { cn } from "../../utils/cn.js";

const TONES = {
  lagoon: { box: "bg-lagoon-50 text-lagoon-600", ring: "group-hover:border-lagoon-300" },
  sky: { box: "bg-sky-50 text-sky-600", ring: "group-hover:border-sky-300" },
  amber: { box: "bg-amber-50 text-amber-600", ring: "group-hover:border-amber-300" },
  orange: { box: "bg-orange-50 text-orange-600", ring: "group-hover:border-orange-300" },
  red: { box: "bg-red-50 text-red-600", ring: "group-hover:border-red-300" },
  emerald: { box: "bg-emerald-50 text-emerald-600", ring: "group-hover:border-emerald-300" },
  sand: { box: "bg-sand-100 text-sand-700", ring: "group-hover:border-sand-300" },
};

function AnimatedValue({ value }) {
  const v = useCountUp(typeof value === "number" ? value : 0);
  return <>{bnNum(v)}</>;
}

/**
 * Reusable dashboard metric card.
 * props: { icon, label, value | valueText, hint, tone, delta:{dir,label}, onClick, to }
 */
export default function StatCard({ icon, label, value, valueText, hint, tone = "lagoon", delta, onClick, className }) {
  const Icon = typeof icon === "string" ? iconOf(icon) : icon;
  const t = TONES[tone] || TONES.lagoon;
  const Comp = onClick ? "button" : "div";

  return (
    <Comp
      onClick={onClick}
      className={cn(
        "card group relative flex flex-col gap-3 overflow-hidden p-4 text-left transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift",
        onClick && "cursor-pointer",
        t.ring,
        className
      )}
    >
      <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-linear-to-br from-lagoon-50 to-transparent opacity-70 transition-transform duration-500 group-hover:scale-150" />
      <div className="flex items-start justify-between">
        <span className={cn("inline-flex h-10 w-10 items-center justify-center rounded-xl", t.box)}>
          <Icon size={20} strokeWidth={2} />
        </span>
        {delta && (
          <span
            className={cn(
              "inline-flex items-center gap-1 text-[11px] font-semibold",
              delta.dir === "up" ? "text-emerald-600" : "text-slate-400"
            )}
          >
            {delta.dir === "up" ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
            {delta.label}
          </span>
        )}
      </div>
      <div>
        <p className="text-[13px] font-medium text-slate-500">{label}</p>
        <p className="mt-1 text-[26px] font-bold leading-8 text-slate-800">
          {valueText != null ? bn(valueText) : <AnimatedValue value={value} />}
        </p>
      </div>
      {hint && <p className="text-xs text-slate-400">{hint}</p>}
    </Comp>
  );
}

/** Grid of stat cards with responsive columns */
export function StatGrid({ stats, columns = 4, onStatClick }) {
  const cols =
    {
      3: "sm:grid-cols-2 lg:grid-cols-3",
      4: "sm:grid-cols-2 xl:grid-cols-4",
      5: "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5",
      6: "sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6",
    }[columns] || "sm:grid-cols-2 xl:grid-cols-4";

  return (
    <div className={cn("grid grid-cols-1 gap-4", cols)}>
      {stats.map((s, i) => (
        <StatCard key={s.label + i} {...s} onClick={onStatClick ? () => onStatClick(s) : undefined} />
      ))}
    </div>
  );
}
