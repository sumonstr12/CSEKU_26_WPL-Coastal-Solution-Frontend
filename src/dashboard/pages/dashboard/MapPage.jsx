import { useMemo, useState } from "react";
import { Activity, Info, Map, MapPin } from "lucide-react";
import ErrorState from "../../components/dashboard/ErrorState";
import Panel, { PageHeader } from "../../components/dashboard/Panel";
import SchematicMap from "../../components/dashboard/SchematicMap";
import EmptyState from "../../components/dashboard/EmptyState";
import { SeverityPill, StatusPill } from "../../components/ui/Badge";
import { disasterType, DISASTER_TYPES } from "../../config/disasterTypes";
import { useDashboard } from "../../hooks/useDashboard";
import { dashboardService } from "../../services/dashboardService";
import { clockBn } from "../../utils/format";
import { cn } from "../../utils/cn.js";

export default function MapPage() {
  const { data, loading, error, refetch } = useDashboard(dashboardService.getMapData, []);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [typeFilter, setTypeFilter] = useState(new Set());

  const toggleType = (t) =>
    setTypeFilter((prev) => {
      const next = new Set(prev);
      next.has(t) ? next.delete(t) : next.add(t);
      return next;
    });

  const incidents = useMemo(() => {
    let rows = data?.reports?.filter((r) => r.status !== "RESOLVED") || [];
    if (typeFilter.size) rows = rows.filter((r) => typeFilter.has(r.type));
    if (selectedDistrict) rows = rows.filter((r) => r.district === selectedDistrict);
    return rows;
  }, [data, typeFilter, selectedDistrict]);

  return (
    <div>
      <PageHeader
        title="দুর্যোগ মানচিত্র"
        subtitle="উপকূলীয় জেলাভিত্তিক সক্রিয় ঘটনা, ঝুঁকি সূচক ও আশ্রয়কেন্দ্রের অবস্থান (স্কিমাটিক মানচিত্র — প্রকৃত GPS ডেটা API সংযোগের পর প্রতিস্থাপিত হবে)"
        crumbs="কার্যক্রম / দুর্যোগ মানচিত্র"
      />

      {/* type filters */}
      <div className="mb-5 flex flex-wrap items-center gap-1.5">
        {Object.entries(DISASTER_TYPES).filter(([k]) => k !== "other").map(([key, t]) => {
          const on = typeFilter.has(key);
          return (
            <button
              key={key}
              onClick={() => toggleType(key)}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12.5px] font-bold transition active:scale-95",
                on ? "bg-lagoon-600 text-white shadow-sm shadow-lagoon-600/25" : "bg-white text-slate-500 ring-1 ring-slate-200 hover:ring-lagoon-300 hover:text-lagoon-700"
              )}
            >
              <t.icon size={13} />
              {t.label}
            </button>
          );
        })}
        {(typeFilter.size > 0 || selectedDistrict) && (
          <button onClick={() => { setTypeFilter(new Set()); setSelectedDistrict(null); }} className="rounded-full bg-red-50 px-3.5 py-1.5 text-[12.5px] font-bold text-red-600 transition hover:bg-red-100 active:scale-95">
            ফিল্টার মুছুন
          </button>
        )}
      </div>

      {loading ? (
        <div className="grid gap-5 lg:grid-cols-[1fr_380px]">
          <div className="skeleton h-[560px] rounded-2xl" />
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton h-24 rounded-2xl" />
            ))}
          </div>
        </div>
      ) : error ? (
        <ErrorState onRetry={refetch} />
      ) : (
        <div className="grid items-start gap-5 lg:grid-cols-[1fr_380px]">
          <SchematicMap
            reports={data.reports}
            shelters={data.shelters}
            districts={data.mapDistricts}
            selectedDistrict={selectedDistrict}
            onSelectDistrict={setSelectedDistrict}
            typeFilter={typeFilter}
            className="w-full shadow-card"
          />

          <Panel
            title={selectedDistrict ? `${selectedDistrict} জেলার ঘটনা` : "সক্রিয় ঘটনাসমূহ"}
            subtitle={selectedDistrict ? "নির্বাচিত জেলার সর্বশেষ রিপোর্ট" : "জেলায় ক্লিক করে ফিল্টার করুন"}
            icon={selectedDistrict ? MapPin : Activity}
            bodyClassName="max-h-[540px] overflow-y-auto p-4"
          >
            {incidents.length === 0 ? (
              <EmptyState icon={Map} title="কোনো ঘটনা নেই" message="এই ফিল্টারে মানচিত্রে দেখানোর মতো কোনো সক্রিয় ঘটনা নেই।" />
            ) : (
              <ul className="space-y-2.5">
                {incidents.map((r) => {
                  const t = disasterType(r.type);
                  return (
                    <li key={r.id} className="cursor-pointer rounded-xl border border-slate-100 p-3.5 transition hover:border-lagoon-200 hover:shadow-card" onClick={() => setSelectedDistrict(r.district)}>
                      <div className="flex items-start gap-3">
                        <span className={cn("inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", t.iconBox)}>
                          <t.icon size={17} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="line-clamp-2 text-[13px] font-bold leading-snug text-slate-700">{r.title}</p>
                          <p className="mt-1 text-[11px] text-slate-400">
                            {r.upazila}, {r.district} • {clockBn(r.time)}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            <SeverityPill severity={r.severity} />
                            <StatusPill status={r.status} />
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </Panel>
        </div>
      )}

      <p className="mt-4 flex items-start gap-2 text-[11.5px] leading-relaxed text-slate-400">
        <Info size={13} className="mt-0.5 shrink-0" />
        মার্কারের সংখ্যাটি ওই জেলার সক্রিয় রিপোর্ট নির্দেশ করে; রঙ সর্বোচ্চ গুরুত্ব প্রকাশ করে। সবুজ-ছন্ন অঞ্চল সুন্দরবন; ড্যাশ-বৃত্ত উচ্চ ঝুঁকির জোন।
      </p>
    </div>
  );
}
