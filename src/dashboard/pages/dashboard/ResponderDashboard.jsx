import { useState } from "react";
import { Activity, Clock, Crosshair, MapPin, Phone, Siren, Target, Users } from "lucide-react";
import AvailabilityCard from "../../components/dashboard/AvailabilityCard";
import DisasterAlert from "../../components/dashboard/DisasterAlert";
import ErrorState from "../../components/dashboard/ErrorState";
import Panel, { SeeAllLink } from "../../components/dashboard/Panel";
import RecentActivity from "../../components/dashboard/RecentActivity";
import { DashboardSkeleton } from "../../components/dashboard/Skeletons";
import { StatGrid } from "../../components/dashboard/StatCard";
import { SeverityPill, GenericPill } from "../../components/ui/Badge";
import { useDashboard } from "../../hooks/useDashboard";
import { dashboardService } from "../../services/dashboardService";
import { bnNum, clockBn } from "../../utils/format";
import { cn } from "../../utils/cn.js";
import { WelcomeBanner } from "./Dashboard";

const MISSION_STATUS = {
  ASSIGNED: { label: "বরাদ্দকৃত", chip: "bg-amber-50 text-amber-800 ring-1 ring-amber-200" },
  IN_PROGRESS: { label: "চলমান", chip: "bg-sky-50 text-sky-700 ring-1 ring-sky-200" },
  DONE: { label: "সম্পন্ন", chip: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" },
};

export default function ResponderDashboard({ user }) {
  const { data, loading, error, refetch, setData } = useDashboard(dashboardService.getResponderOverview, []);
  const [accepting, setAccepting] = useState(null);

  if (loading) return <DashboardSkeleton statCount={4} />;
  if (error) return <ErrorState fullPage onRetry={refetch} />;

  const acceptRequest = (id) => {
    setAccepting(id);
    setTimeout(() => {
      setData((d) => ({ ...d, requests: d.requests.map((r) => (r.id === id ? { ...r, status: "ASSIGNED" } : r)) }));
      setAccepting(null);
    }, 500);
  };

  return (
    <div className="space-y-6">
      <WelcomeBanner
        user={user}
        subtitle="জরুরি সাড়াদানই আপনার প্রথম দায় — বর্তমান মিশন, জরুরি অনুরোধ এবং এলাকার পরিস্থিতি এক নজরে।"
        extra={
          <span className="chip bg-white/15 text-white backdrop-blur">
            <Crosshair size={11} />
            {user.team}
          </span>
        }
      />

      <AvailabilityCard user={user} />

      {data.alert && <DisasterAlert data={data.alert} />}

      <StatGrid stats={data.stats} columns={4} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* missions */}
        <Panel className="xl:col-span-2" title="বরাদ্দকৃত মিশন" subtitle="অগ্রাধিকার অনুযায়ী সাজানো" icon={Target} action={<SeeAllLink to="/dashboard/missions" />}>
          <div className="space-y-3.5">
            {data.missions.filter((m) => m.status !== "DONE").map((m) => {
              const s = MISSION_STATUS[m.status];
              return (
                <div key={m.id} className="rounded-xl border border-slate-100 p-4 transition hover:border-lagoon-200 hover:shadow-card">
                  <div className="flex flex-wrap items-start justify-between gap-2.5">
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-800">{m.title}</p>
                      <p className="mt-1 flex flex-wrap gap-x-3 text-[11.5px] text-slate-400">
                        <span className="inline-flex items-center gap-1"><MapPin size={11} />{m.place}</span>
                        <span className="inline-flex items-center gap-1"><Clock size={11} />বরাদ্দ: {clockBn(m.assignedAt)}</span>
                        {m.people != null && <span className="inline-flex items-center gap-1"><Users size={11} />{bnNum(m.people)} জন সংশ্লিষ্ট</span>}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <SeverityPill severity={m.priority} />
                      <span className={cn("chip", s.chip)}>{s.label}</span>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full rounded-full bg-gradient-to-r from-lagoon-400 to-lagoon-600 transition-all duration-700" style={{ width: `${m.progress}%` }} />
                    </div>
                    <span className="text-[11px] font-bold text-lagoon-700">{bnNum(m.progress)}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>

        {/* rescue requests + activity */}
        <div className="space-y-6">
          <Panel title="জরুরি অনুরোধ" subtitle="সাড়া প্রয়োজন" icon={Siren} action={<SeeAllLink to="/dashboard/rescue-requests" label="সব দেখুন" />}>
            <ul className="space-y-3">
              {data.requests.slice(0, 4).map((r) => (
                <li key={r.id} className={cn("rounded-xl border p-3.5", r.severity === "CRITICAL" ? "border-red-200 bg-red-50/40" : "border-slate-100")}>
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[13px] font-bold leading-snug text-slate-700">{r.need}</p>
                    <SeverityPill severity={r.severity} className="shrink-0" />
                  </div>
                  <p className="mt-1.5 flex items-center gap-1 text-[11.5px] text-slate-400">
                    <MapPin size={11} />
                    {r.place} • {clockBn(r.time)}
                  </p>
                  <div className="mt-2.5 flex items-center justify-between gap-2">
                    <a href={`tel:${r.contact}`} className="inline-flex items-center gap-1 text-[11.5px] font-bold text-lagoon-600 hover:underline">
                      <Phone size={11} />
                      {r.contact}
                    </a>
                    {r.status === "OPEN" ? (
                      <button onClick={() => acceptRequest(r.id)} disabled={accepting === r.id} className="btn bg-red-500 px-2.5 py-1.5 text-[11px] font-bold text-white hover:bg-red-600 active:scale-95 disabled:opacity-60">
                        {accepting === r.id ? "..." : "গ্রহণ করুন"}
                      </button>
                    ) : (
                      <GenericPill tone="amber">বরাদ্দ হয়েছে</GenericPill>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="সাম্প্রতিক কার্যক্রম" icon={Activity}>
            <RecentActivity items={data.activities} compact />
          </Panel>
        </div>
      </div>
    </div>
  );
}
