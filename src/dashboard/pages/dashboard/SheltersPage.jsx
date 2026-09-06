import { useMemo, useState } from "react";
import { CircleCheck, Droplet, MapPin, Navigation, Users, Warehouse, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import ErrorState from "../../components/dashboard/ErrorState";
import { PageHeader } from "../../components/dashboard/Panel";
import EmptyState from "../../components/dashboard/EmptyState";
import { StatGrid } from "../../components/dashboard/StatCard";
import { PanelSkeleton } from "../../components/dashboard/Skeletons";
import { Meter } from "../../components/dashboard/Charts";
import { GenericPill } from "../../components/ui/Badge";
import { useDashboard } from "../../hooks/useDashboard";
import { dashboardService } from "../../services/dashboardService";
import { bn, bnNum } from "../../utils/format";
import { cn } from "../../utils/cn.js";

const SHELTER_STATUS = {
  OPEN: { label: "খোলা আছে", tone: "emerald" },
  CROWDED: { label: "প্রায় পূর্ণ", tone: "amber" },
  READY: { label: "প্রস্তুত", tone: "sky" },
};

export default function SheltersPage() {
  const { data, loading, error, refetch } = useDashboard(dashboardService.getShelters, []);
  const [district, setDistrict] = useState("সব");

  const districts = useMemo(() => ["সব", ...new Set((data || []).map((s) => s.district))], [data]);
  const items = (data || []).filter((s) => district === "সব" || s.district === district);

  const stats = useMemo(() => {
    const rows = data || [];
    return [
      { label: "মোট আশ্রয়কেন্দ্র", value: rows.length, tone: "lagoon", icon: "Warehouse" },
      { label: "মোট ধারণক্ষমতা", value: rows.reduce((a, s) => a + s.capacity, 0), tone: "sky", icon: "Users" },
      { label: "বর্তমানে আশ্রিত", value: rows.reduce((a, s) => a + s.occupied, 0), tone: "amber", icon: "MapPinned" },
      { label: "পূর্ণতার হার", valueText: `${Math.round((rows.reduce((a, s) => a + s.occupied, 0) / Math.max(1, rows.reduce((a, s) => a + s.capacity, 0))) * 100)}%`, tone: "emerald", icon: "Gauge" },
    ];
  }, [data]);

  return (
    <div>
      <PageHeader title="আশ্রয়কেন্দ্র" subtitle="উপকূলীয় অঞ্চলের নিবন্ধিত আশ্রয়কেন্দ্র, ধারণক্ষমতা ও সুবিধাসমূহ" crumbs="কার্যক্রম / আশ্রয়কেন্দ্র">
        <Link to="/dashboard/map" className="btn-secondary">
          <Navigation size={15} />
          মানচিত্রে দেখুন
        </Link>
      </PageHeader>

      {loading ? (
        <>
          <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton h-[130px] rounded-2xl" />
            ))}
          </div>
          <PanelSkeleton lines={5} />
        </>
      ) : error ? (
        <ErrorState onRetry={refetch} />
      ) : (
        <>
          <StatGrid stats={stats} columns={4} />

          <div className="my-5 flex flex-wrap gap-1.5">
            {districts.map((d) => (
              <button
                key={d}
                onClick={() => setDistrict(d)}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-[12.5px] font-bold transition active:scale-95",
                  district === d ? "bg-lagoon-600 text-white shadow-sm shadow-lagoon-600/25" : "bg-white text-slate-500 ring-1 ring-slate-200 hover:ring-lagoon-300 hover:text-lagoon-700"
                )}
              >
                {d}
              </button>
            ))}
          </div>

          {items.length === 0 ? (
            <div className="card">
              <EmptyState icon={Warehouse} title="কোনো আশ্রয়কেন্দ্র পাওয়া যায়নি" message="এই জেলায় নিবন্ধিত কোনো আশ্রয়কেন্দ্র নেই।" />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {items.map((s) => {
                const st = SHELTER_STATUS[s.status] || SHELTER_STATUS.OPEN;
                return (
                  <div key={s.id} className="card group flex flex-col p-5 transition hover:-translate-y-0.5 hover:shadow-lift">
                    <div className="flex items-start justify-between gap-2">
                      <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                        <Warehouse size={21} />
                      </span>
                      <GenericPill tone={st.tone}>{st.label}</GenericPill>
                    </div>
                    <h3 className="mt-3 line-clamp-2 min-h-[40px] text-[14.5px] font-bold leading-snug text-slate-800 group-hover:text-lagoon-700">{s.name}</h3>
                    <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                      <MapPin size={12} />
                      {s.upazila}, {s.district} {s.distance ? `• আনুমানিক ${s.distance}` : ""}
                    </p>

                    <div className="mt-4">
                      <div className="mb-1.5 flex justify-between text-[11.5px] font-medium text-slate-500">
                        <span>আশ্রিত {bnNum(s.occupied)}</span>
                        <span>ধারণক্ষমতা {bnNum(s.capacity)}</span>
                      </div>
                      <Meter value={s.occupied} max={s.capacity} />
                    </div>

                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {s.facilities.slice(0, 3).map((f) => (
                        <span key={f} className="chip bg-slate-100 text-slate-500">{f}</span>
                      ))}
                      {s.facilities.length > 3 && <span className="chip bg-slate-100 text-slate-500">+{bn(s.facilities.length - 3)}</span>}
                    </div>

                    <div className="mt-4 flex items-center gap-3 border-t border-slate-100 pt-3.5 text-[11.5px] font-semibold text-slate-500">
                      <span className={cn("flex items-center gap-1", s.water ? "text-emerald-600" : "text-slate-300")}>
                        <Droplet size={13} /> পানি
                      </span>
                      <span className={cn("flex items-center gap-1", s.power ? "text-emerald-600" : "text-slate-300")}>
                        <Zap size={13} /> বিদ্যুৎ
                      </span>
                      <span className="ml-auto flex items-center gap-1 text-emerald-600">
                        <CircleCheck size={13} /> যাচাইকৃত
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
