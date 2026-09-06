import { useMemo, useState } from "react";
import { Warehouse, X } from "lucide-react";
import { SEVERITY } from "../../config/disasterTypes";
import { bn, bnNum } from "../../utils/format";
import { cn } from "../../utils/cn.js";

const W = 420;
const H = 560;
const SEV_RANK = { LOW: 1, MODERATE: 2, HIGH: 3, CRITICAL: 4 };
const SEV_COLOR = { LOW: "#0ea5e9", MODERATE: "#f59e0b", HIGH: "#f97316", CRITICAL: "#dc2626" };

/* Stylized Bangladesh delta outline — schematic, not for navigation */
const BD_OUTLINE = `
M 95 25
C 110 20, 125 32, 140 30 C 155 28, 165 40, 180 38 C 195 36, 205 48, 218 44
C 232 40, 238 55, 250 52 C 262 49, 268 62, 280 60 C 295 57, 305 72, 312 84
C 322 92, 330 100, 328 112 C 326 124, 336 132, 332 146 C 328 158, 318 162, 322 174
C 326 186, 338 190, 340 202 C 342 214, 352 222, 354 236 C 356 250, 366 256, 372 268
C 380 278, 382 292, 384 304 C 386 318, 378 330, 382 344 C 386 358, 394 366, 396 380
C 398 394, 390 406, 392 420 C 394 434, 402 444, 398 458 C 394 472, 386 486, 380 500
C 374 514, 366 528, 356 540
C 350 530, 342 520, 338 506 C 332 492, 336 478, 326 466 C 316 454, 304 450, 296 442
C 286 432, 276 438, 268 430 C 258 420, 250 428, 242 420 C 234 412, 226 416, 220 408
C 212 400, 206 408, 198 402 C 190 396, 184 404, 176 398 C 168 392, 160 400, 152 394
C 144 388, 138 398, 130 392 C 122 386, 118 398, 110 394 C 100 390, 98 404, 90 398
C 82 392, 84 404, 76 396
C 74 380, 80 366, 74 352 C 68 338, 74 324, 66 310 C 58 296, 68 282, 60 268
C 52 254, 64 242, 56 228 C 48 214, 62 204, 54 190 C 46 176, 60 166, 52 152
C 44 138, 60 128, 54 114 C 48 100, 64 92, 60 78 C 56 64, 72 58, 74 46
C 76 34, 88 32, 95 25 Z`;

const SUNDARBANS = "M 66 366 C 90 372, 116 376, 136 380 C 134 394, 132 406, 130 416 C 110 412, 88 408, 72 404 C 70 392, 68 378, 66 366 Z";

const RIVERS = [
  "M 58 232 C 104 244, 148 268, 176 300 C 198 324, 214 344, 228 360 C 236 372, 240 388, 244 404",
  "M 62 140 C 96 176, 118 220, 134 262 C 144 288, 156 308, 170 324",
  "M 250 130 C 276 150, 300 170, 316 190 C 326 204, 336 214, 348 224",
];

const SHELTER_JITTER = [
  [4, -8], [-12, 6], [12, 8], [-8, -10], [8, 14], [-14, -2], [0, 12], [14, -4],
];

/**
 * Interactive schematic coastal map.
 * props: reports, shelters, districts, selectedDistrict, onSelectDistrict, showShelters, typeFilter(Set), className, compact
 */
export default function SchematicMap({ reports = [], shelters = [], districts = [], selectedDistrict, onSelectDistrict, showShelters = true, typeFilter, className, compact = false }) {
  const [hovered, setHovered] = useState(null);

  const incidents = useMemo(() => {
    return districts.map((d) => {
      const rows = reports.filter(
        (r) => r.district === d.name && r.status !== "RESOLVED" && (!typeFilter || typeFilter.size === 0 || typeFilter.has(r.type))
      );
      const top = rows.reduce((best, r) => (SEV_RANK[r.severity] > (SEV_RANK[best] || 0) ? r.severity : best), null);
      return { ...d, count: rows.length, severity: top };
    });
  }, [districts, reports, typeFilter]);

  const shelterMarkers = useMemo(() => {
    if (!showShelters) return [];
    return shelters
      .map((s, i) => {
        const d = districts.find((x) => x.name === s.district);
        if (!d) return null;
        const [jx, jy] = SHELTER_JITTER[i % SHELTER_JITTER.length];
        return { ...s, x: d.x + jx, y: d.y + jy };
      })
      .filter(Boolean);
  }, [shelters, districts, showShelters]);

  const selected = useMemo(() => incidents.find((d) => d.name === selectedDistrict), [incidents, selectedDistrict]);

  /* Danger zones from high-severity clusters */
  const zones = useMemo(() => {
    const highActive = incidents.filter((d) => d.severity === "CRITICAL" || d.severity === "HIGH");
    const groups = {};
    highActive.forEach((d) => {
      const g = Math.floor(d.x / 120) + "-" + Math.floor(d.y / 120);
      (groups[g] = groups[g] || []).push(d);
    });
    return Object.values(groups).map((g) => ({
      cx: g.reduce((a, d) => a + d.x, 0) / g.length,
      cy: g.reduce((a, d) => a + d.y, 0) / g.length,
      r: 34 + g.length * 14,
      critical: g.some((d) => d.severity === "CRITICAL"),
    }));
  }, [incidents]);

  const pct = (x, y) => ({ left: `${(x / W) * 100}%`, top: `${(y / H) * 100}%` });

  return (
    <div className={cn("relative select-none overflow-hidden rounded-2xl border border-lagoon-100 bg-linear-to-b from-sky-50/80 via-lagoon-50/30 to-sky-100/50", className)}>
      {/* graticule + landmass SVG */}
      <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full">
        <defs>
          <linearGradient id="landGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#eaf4f1" />
            <stop offset="60%" stopColor="#e6f0ec" />
            <stop offset="100%" stopColor="#f4ecdb" />
          </linearGradient>
        </defs>

        {/* graticule */}
        {[140, 280].map((x) => (
          <line key={x} x1={x} y1="0" x2={x} y2={H} stroke="#94a3b8" strokeOpacity="0.14" strokeDasharray="3 6" />
        ))}
        {[140, 280, 420].map((y) => (
          <line key={y} x1="0" y1={y} x2={W} y2={y} stroke="#94a3b8" strokeOpacity="0.14" strokeDasharray="3 6" />
        ))}

        {/* sea wave accents */}
        <path d="M 40 505 q 10 -8 20 0 t 20 0 t 20 0" fill="none" stroke="#7dd3fc" strokeWidth="1.6" strokeOpacity="0.55" />
        <path d="M 150 525 q 10 -8 20 0 t 20 0 t 20 0 t 20 0" fill="none" stroke="#7dd3fc" strokeWidth="1.6" strokeOpacity="0.55" />
        <path d="M 60 535 q 10 -8 20 0 t 20 0 t 20 0" fill="none" stroke="#7dd3fc" strokeWidth="1.6" strokeOpacity="0.4" />
        <text x="150" y="492" fontSize="13" fill="#38bdf8" fontWeight="600" letterSpacing="4" opacity="0.75" style={{ fontFamily: "inherit" }}>
          বঙ্গোপসাগর
        </text>

        {/* landmass */}
        <path d={BD_OUTLINE} fill="url(#landGrad)" stroke="#47abaa" strokeOpacity="0.55" strokeWidth="1.4" />

        {/* sundarbans */}
        <path d={SUNDARBANS} fill="#2f908f" fillOpacity="0.08" stroke="#2f908f" strokeOpacity="0.35" strokeWidth="1" strokeDasharray="4 3" />
        <text x="84" y="396" fontSize="10" fill="#277476" fontWeight="600" opacity="0.8" style={{ fontFamily: "inherit" }}>
          সুন্দরবন
        </text>

        {/* rivers */}
        {RIVERS.map((r, i) => (
          <path key={i} d={r} fill="none" stroke="#7dd3fc" strokeWidth="2" strokeOpacity="0.6" strokeLinecap="round" />
        ))}

        {/* danger zones */}
        {zones.map((z, i) => (
          <g key={i}>
            <circle cx={z.cx} cy={z.cy} r={z.r} fill={z.critical ? "#ef4444" : "#f59e0b"} opacity="0.09" />
            <circle cx={z.cx} cy={z.cy} r={z.r} fill="none" stroke={z.critical ? "#ef4444" : "#f59e0b"} strokeOpacity="0.4" strokeWidth="1.2" strokeDasharray="5 4">
              <animate attributeName="r" values={`${z.r - 4};${z.r + 4};${z.r - 4}`} dur="4.5s" repeatCount="indefinite" />
            </circle>
          </g>
        ))}
      </svg>

      {/* shelter markers (HTML layer) */}
      {shelterMarkers.map((s) => (
        <button
          key={s.id}
          onClick={() => onSelectDistrict?.(s.district)}
          className="group absolute z-10 -translate-x-1/2 -translate-y-1/2"
          style={pct(s.x, s.y)}
          title={`${s.name} — ধারণক্ষমতা ${bnNum(s.capacity)}`}
        >
          <span className="flex h-[18px] w-[18px] items-center justify-center rounded-md border border-lagoon-300 bg-white text-lagoon-600 shadow-sm transition group-hover:scale-110">
            <Warehouse size={11} />
          </span>
        </button>
      ))}

      {/* district incident markers */}
      {incidents.map((d) => {
        const active = selectedDistrict === d.name;
        const color = d.severity ? SEV_COLOR[d.severity] : "#94a3b8";
        const hot = d.severity === "CRITICAL" || d.severity === "HIGH";
        return (
          <div key={d.name} className="absolute z-20 -translate-x-1/2 -translate-y-1/2" style={pct(d.x, d.y)}>
            <button
              onClick={() => onSelectDistrict?.(active ? null : d.name)}
              onMouseEnter={() => setHovered(d.name)}
              onMouseLeave={() => setHovered(null)}
              className="relative flex items-center justify-center"
              aria-label={d.name}
            >
              {hot && (
                <span className="absolute h-5 w-5 animate-ping-soft rounded-full" style={{ background: color, opacity: 0.5 }} />
              )}
              <span
                className={cn("relative flex items-center justify-center rounded-full border-2 border-white shadow transition-all", active ? "h-5 w-5 scale-110" : "h-3.5 w-3.5 hover:scale-125")}
                style={{ background: color }}
              />
              {d.count > 0 && (
                <span className="absolute -right-2 -top-2 flex h-[15px] min-w-[15px] items-center justify-center rounded-full bg-slate-800 px-0.5 text-[9px] font-bold text-white shadow">
                  {bn(d.count)}
                </span>
              )}
            </button>
            {!compact && (
              <span
                className={cn(
                  "absolute left-1/2 top-2.5 -translate-x-1/2 whitespace-nowrap rounded-md px-1.5 py-px text-[10px] font-semibold shadow-sm transition-opacity",
                  active ? "bg-lagoon-700 text-white" : "bg-white/85 text-slate-600 backdrop-blur-sm",
                  hovered === d.name || active || d.count > 0 ? "opacity-100" : "opacity-60"
                )}
              >
                {d.name}
              </span>
            )}
          </div>
        );
      })}

      {/* selected tooltip card */}
      {selected && (
        <div
          className="absolute z-30 w-52 -translate-x-1/2 animate-pop-in rounded-xl border border-slate-200 bg-white/95 p-3.5 shadow-lift backdrop-blur"
          style={{
            left: `${Math.min(72, Math.max(28, (selected.x / W) * 100))}%`,
            top: `${(selected.y / H) * 100 < 22 ? (selected.y / H) * 100 + 6 : (selected.y / H) * 100 - 6}%`,
            transform: `translateX(-50%) ${(selected.y / H) * 100 < 22 ? "" : "translateY(-100%)"}`,
          }}
        >
          <button onClick={() => onSelectDistrict?.(null)} className="btn-icon absolute right-1 top-1 h-6 w-6 rounded-lg!">
            <X size={13} />
          </button>
          <p className="text-sm font-bold text-slate-800">{selected.name}</p>
          <div className="mt-2 space-y-1.5 text-[12px] text-slate-500">
            <p className="flex justify-between">
              <span>ঝুঁকি সূচক</span>
              <span className="font-bold text-slate-700">{bn(selected.risk)}%</span>
            </p>
            <p className="flex justify-between">
              <span>সক্রিয় রিপোর্ট</span>
              <span className="font-bold text-slate-700">{bn(selected.count)}</span>
            </p>
            <p className="flex items-center justify-between">
              <span>সর্বোচ্চ গুরুত্ব</span>
              {selected.severity ? (
                <span className="chip" style={{ background: `${SEV_COLOR[selected.severity]}14`, color: SEV_COLOR[selected.severity] }}>
                  {SEVERITY[selected.severity].label}
                </span>
              ) : (
                <span className="text-slate-400">—</span>
              )}
            </p>
          </div>
          <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full" style={{ width: `${selected.risk}%`, background: `linear-gradient(90deg,#47abaa,${selected.risk > 70 ? "#f97316" : "#277476"})` }} />
          </div>
        </div>
      )}

      {/* legend */}
      {!compact && (
        <div className="absolute bottom-2.5 left-2.5 flex flex-wrap gap-x-3 gap-y-1 rounded-lg bg-white/85 px-2.5 py-1.5 text-[10px] font-medium text-slate-500 shadow-sm backdrop-blur-sm">
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-red-500" /> সংকটাপন্ন</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-orange-500" /> উচ্চ</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-400" /> মাঝারি</span>
          <span className="flex items-center gap-1"><Warehouse size={10} className="text-lagoon-600" /> আশ্রয়কেন্দ্র</span>
        </div>
      )}
    </div>
  );
}
