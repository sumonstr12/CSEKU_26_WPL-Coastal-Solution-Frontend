import { useMemo } from "react";
import { bn, bnCompact, bnNum } from "../../utils/format";
import { cn } from "../../utils/cn.js";

/* ============ Lightweight hand-rolled charts (no heavy deps) ============ */

/** Vertical column chart — monthly trends etc. */
export function ColumnChart({ data, color = "#277476", height = 180, compact = false }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="w-full">
      <div className="flex items-end gap-2 sm:gap-3" style={{ height }}>
        {data.map((d, i) => (
          <div key={i} className="group flex h-full min-w-0 flex-1 flex-col justify-end">
            <div className="mb-1 text-center text-[11px] font-bold text-slate-600 opacity-0 transition-opacity group-hover:opacity-100">
              {bnNum(d.value)}
            </div>
            <div
              className="w-full rounded-t-lg transition-all duration-700 ease-out group-hover:brightness-110"
              style={{
                height: `${Math.max(4, (d.value / max) * 88)}%`,
                background: `linear-gradient(180deg, ${color}, ${color}cc)`,
                animation: `fade-up .5s ${i * 60}ms both`,
              }}
            />
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-2 border-t border-slate-100 pt-2 sm:gap-3">
        {data.map((d, i) => (
          <div key={i} className={cn("flex-1 truncate text-center text-[11px] font-medium text-slate-400")}>
            {d.label}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Horizontal bar list — distribution / rankings */
export function BarList({ data, max, suffix = "", showValue = true }) {
  const maxVal = max || Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="space-y-3.5">
      {data.map((d, i) => (
        <div key={i}>
          <div className="mb-1.5 flex items-center justify-between text-[13px]">
            <span className="flex items-center gap-2 font-medium text-slate-600">
              {d.color && <span className="h-2.5 w-2.5 rounded-sm" style={{ background: d.color }} />}
              {d.label}
            </span>
            {showValue && <span className="font-bold text-slate-700">{bnCompact(d.value)}{suffix}</span>}
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${Math.max(3, (d.value / maxVal) * 100)}%`, background: d.color || "linear-gradient(90deg,#47abaa,#277476)", animation: `fade-in .4s ${i * 50}ms both` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Donut chart with legend */
export function Donut({ data, size = 168, thickness = 22, centerLabel = "মোট" }) {
  const total = data.reduce((a, d) => a + d.value, 0) || 1;
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;

  const segments = useMemo(() => {
    let acc = 0;
    return data.map((d) => {
      const frac = d.value / total;
      const seg = { ...d, dash: `${frac * c} ${c}`, offset: -acc * c };
      acc += frac;
      return seg;
    });
  }, [data, total, c]);

  return (
    <div className="flex flex-wrap items-center justify-center gap-6">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#eef1f0" strokeWidth={thickness} />
          {segments.map((s, i) => (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={s.color}
              strokeWidth={thickness}
              strokeDasharray={s.dash}
              strokeDashoffset={s.offset}
              strokeLinecap="butt"
              style={{ transition: "stroke-dasharray .8s ease", animation: `fade-in .5s ${i * 80}ms both` }}
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-slate-800">{bnNum(total)}</span>
          <span className="text-[11px] font-medium text-slate-400">{centerLabel}</span>
        </div>
      </div>
      <ul className="min-w-[130px] space-y-2">
        {data.map((d, i) => (
          <li key={i} className="flex items-center justify-between gap-4 text-[13px]">
            <span className="flex items-center gap-2 text-slate-600">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: d.color }} />
              {d.label}
            </span>
            <span className="font-bold text-slate-700">{bn(Math.round((d.value / total) * 100))}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Capacity meter for shelters */
export function Meter({ value, max, tone }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  const color = pct >= 90 ? "#dc2626" : pct >= 70 ? "#d97706" : tone || "#277476";
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="w-9 shrink-0 text-right text-[11px] font-bold" style={{ color }}>{bn(pct)}%</span>
    </div>
  );
}
