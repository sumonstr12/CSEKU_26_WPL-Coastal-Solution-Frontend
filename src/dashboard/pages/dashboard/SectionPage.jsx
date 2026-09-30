import { useMemo, useState } from "react";
import {
  BadgeCheck,
  BookOpen,
  CalendarDays,
  CircleCheck,
  Clock,
  Crosshair,
  Layers,
  LifeBuoy,
  MapPin,
  MapPinned,
  Phone,
  Radar,
  Search,
  Server,
  ShieldAlert,
  Siren,
  TrendingDown,
  TrendingUp,
  UserCheck,
  Users,
  UsersRound,
  Warehouse,
} from "lucide-react";
import ErrorState from "../../components/dashboard/ErrorState";
import Panel, { PageHeader } from "../../components/dashboard/Panel";
import EmptyState from "../../components/dashboard/EmptyState";
import RecentActivity from "../../components/dashboard/RecentActivity";
import ReportTable from "../../components/dashboard/ReportTable";
import { TableSkeleton } from "../../components/dashboard/Skeletons";
import { StatGrid } from "../../components/dashboard/StatCard";
import { BarList, Donut } from "../../components/dashboard/Charts";
import { GenericPill, SeverityPill } from "../../components/ui/Badge";
import { disasterType, SEVERITY } from "../../config/disasterTypes";
import { roleOf } from "../../config/roleConfig";
import { useAuth } from "../../context/AuthContext";
import { useDashboard } from "../../hooks/useDashboard";
import { dashboardService } from "../../services/dashboardService";
import { bn, bnNum, clockBn, timeAgoBn } from "../../utils/format";
import { cn } from "../../utils/cn.js";

/* ------------------------------------------------------------------ */
/* Section metadata (title / subtitle / icon per route key)            */
/* ------------------------------------------------------------------ */
const META = {
  missions: { title: "Assigned Missions", subtitle: "আপনার দলের জন্য বরাদ্দকৃত উদ্ধার মিশনসমূহ", icon: Crosshair },
  "rescue-requests": { title: "জরুরি অনুরোধ", subtitle: "বিপদাপন্ন মানুষের সরাসরি অনুরোধ — অগ্রাধিকার অনুযায়ী", icon: Siren },
  "rescue-operations": { title: "উদ্ধার কার্যক্রম", subtitle: "চলমান ও সম্পন্ন সমন্বিত উদ্ধার অভিযানসমূহ", icon: LifeBuoy },
  verification: { title: "রিপোর্ট যাচাই", subtitle: "নাগরিকদের রিপোর্ট যাচাই করে সঠিক তথ্য নিশ্চিত করুন", icon: BadgeCheck },
  assistance: { title: "সহায়তা কার্যক্রম", subtitle: "আপনার জন্য নির্ধারিত স্বেচ্ছাসেবী কাজের তালিকা", icon: UserCheck },
  "my-area": { title: "আমার এলাকা", subtitle: "দায়িত্বপূর্ণ এলাকার সার্বিক চিত্র", icon: MapPinned },
  awareness: { title: "সচেতনতা ও প্রস্তুতি", subtitle: "দুর্যোগের আগে-পরে করণীয় — পড়ুন, শিখুন, ছড়িয়ে দিন", icon: BookOpen },
  monitoring: { title: "দুর্যোগ পর্যবেক্ষণ", subtitle: "অঞ্চলব্যাপী সক্রিয় পরিস্থিতি ও সতর্কতার লাইভ চিত্র", icon: Radar },
  "risk-analysis": { title: "ঝুঁকি বিশ্লেষণ", subtitle: "জেলাভিত্তিক ঝুঁকি সূচক ও প্রবণতা — পরিকল্পনার ভিত্তি", icon: ShieldAlert },
  areas: { title: "প্রশাসনিক এলাকা", subtitle: "বিভাগ, জেলা ও উপজেলা ভিত্তিক দুর্যোগ-প্রশাসনিক কাঠামো", icon: MapPinned },
  users: { title: "ব্যবহারকারী", subtitle: "প্ল্যাটফর্মের নিবন্ধিত ব্যবহারকারী ও ভূমিকা ব্যবস্থাপনা", icon: UsersRound },
  "disaster-types": { title: "দুর্যোগের ধরন", subtitle: "সংজ্ঞায়িত দুর্যোগ শ্রেণি, মৌসুম ও নির্দেশিকা", icon: Layers },
  "rescue-teams": { title: "উদ্ধারকারী দল", subtitle: "নিবন্ধিত দল, সদস্য সংখ্যা ও প্রস্তুতির অবস্থা", icon: Users },
  "system-monitoring": { title: "System Monitoring", subtitle: "মূল সার্ভিসের স্বাস্থ্য, আপটাইম ও লেটেন্সি", icon: Server },
};

const HEALTH = {
  HEALTHY: { label: "সচল", tone: "emerald", bar: true },
  DEGRADED: { label: "ধীরগতি", tone: "amber" },
  DOWN: { label: "বন্ধ", tone: "red" },
};
const TEAM_STATUS = {
  READY: { label: "প্রস্তুত", tone: "emerald" },
  ON_MISSION: { label: "মিশনে", tone: "amber" },
  REST: { label: "বিশ্রামে", tone: "slate" },
};

/* ------------------------------------------------------------------ */
/* Block renderers                                                     */
/* ------------------------------------------------------------------ */

function MissionCards({ items }) {
  if (!items.length) return <EmptyState icon={Crosshair} title="কোনো মিশন নিদ্ধারিত নেই" message="বর্তমানে কোনো উদ্ধার কার্যক্রম আপনার জন্য নির্ধারিত নেই।" />;
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items.map((m) => (
        <div key={m.id} className={cn("rounded-xl border p-4 transition hover:shadow-card", m.priority === "CRITICAL" ? "border-red-200 bg-red-50/30" : "border-slate-100")}>
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-800">{m.title}</p>
              <p className="mt-1 flex flex-wrap gap-x-3 text-[11.5px] text-slate-400">
                <span className="inline-flex items-center gap-1"><MapPin size={11} />{m.place}</span>
                <span className="inline-flex items-center gap-1"><Clock size={11} />{clockBn(m.assignedAt)}</span>
              </p>
            </div>
            <SeverityPill severity={m.priority} />
          </div>
          <div className="mt-3 flex items-center gap-3">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-gradient-to-r from-lagoon-400 to-lagoon-600" style={{ width: `${m.progress}%` }} />
            </div>
            <span className="text-[11px] font-bold text-lagoon-700">{bnNum(m.progress)}%</span>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-slate-50 pt-3 text-[11.5px] text-slate-400">
            <span className="inline-flex items-center gap-1"><Users size={12} />{m.team}</span>
            <GenericPill tone={m.status === "DONE" ? "emerald" : m.status === "IN_PROGRESS" ? "sky" : "amber"}>
              {m.status === "DONE" ? "সম্পন্ন" : m.status === "IN_PROGRESS" ? "চলমান" : "বরাদ্দকৃত"}
            </GenericPill>
          </div>
        </div>
      ))}
    </div>
  );
}

function RequestCards({ items: initial }) {
  const [items, setItems] = useState(initial);
  if (!items.length) return <EmptyState icon={Siren} title="কোনো খোলা অনুরোধ নেই" message="সব জরুরি অনুরোধ মোকাবিলা করা হয়েছে। অসাধারণ কাজ!" />;
  return (
    <ul className="grid gap-4 md:grid-cols-2">
      {items.map((r) => (
        <li key={r.id} className={cn("rounded-xl border p-4 transition hover:shadow-card", r.severity === "CRITICAL" ? "border-red-200 bg-red-50/40" : "border-slate-100")}>
          <div className="flex items-start justify-between gap-2">
            <p className="text-[13.5px] font-bold leading-snug text-slate-800">{r.need}</p>
            <SeverityPill severity={r.severity} />
          </div>
          <p className="mt-1.5 flex items-center gap-1 text-[11.5px] text-slate-400">
            <MapPin size={11} />
            {r.place}, {r.district} • {r.id} • {clockBn(r.time)}
          </p>
          <div className="mt-3 flex items-center justify-between border-t border-slate-50 pt-3">
            <a href={`tel:${r.contact}`} className="inline-flex items-center gap-1.5 text-[12px] font-bold text-lagoon-600 hover:underline">
              <Phone size={12} />
              {r.contact}
            </a>
            {r.status === "OPEN" ? (
              <button onClick={() => setItems((rows) => rows.map((x) => (x.id === r.id ? { ...x, status: "ASSIGNED" } : x)))} className="btn bg-red-500 px-3 py-1.5 text-[12px] font-bold text-white hover:bg-red-600 active:scale-95">
                গ্রহণ করুন
              </button>
            ) : (
              <GenericPill tone="amber">বরাদ্দ হয়েছে</GenericPill>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

function OperationCards({ items }) {
  if (!items.length) return <EmptyState icon={LifeBuoy} title="কোনো অভিযান নেই" message="বর্তমানে কোনো উদ্ধার অভিযান চলমান নেই।" />;
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items.map((o) => (
        <div key={o.id} className="rounded-xl border border-slate-100 p-4 transition hover:shadow-card">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-bold text-slate-800">{o.title}</p>
              <p className="mt-1 text-[11.5px] text-slate-400">{o.id} • {o.type} • {o.district}</p>
            </div>
            <GenericPill tone={o.status === "DONE" ? "emerald" : "sky"}>{o.status === "DONE" ? "সম্পন্ন" : "চলমান"}</GenericPill>
          </div>
          <div className="mt-3.5 grid grid-cols-3 gap-2 text-center">
            {[
              { label: "নিয়োজিত দল", value: o.teams },
              { label: "উদ্ধারকৃত", value: o.rescued },
              { label: "নেতৃত্ব", value: o.lead, raw: true },
            ].map((x, i) => (
              <div key={i} className="rounded-lg bg-sand-50/80 px-2 py-2">
                <p className={cn("font-bold text-slate-700", x.raw ? "truncate text-[11px]" : "text-sm")}>{x.raw ? x.value : bnNum(x.value)}</p>
                <p className="text-[10px] font-medium text-slate-400">{x.label}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 flex items-center gap-1 text-[11px] text-slate-400">
            <Clock size={11} />
            শুরু: {clockBn(o.startedAt)}
          </p>
        </div>
      ))}
    </div>
  );
}

function TaskCards({ items: initial }) {
  const [items, setItems] = useState(initial);
  const complete = (id) => {
    dashboardService.completeTask(id);
    setItems((rows) => rows.map((t) => (t.id === id ? { ...t, status: "DONE" } : t)));
  };
  if (!items.length) return <EmptyState icon={UserCheck} title="কোনো কার্যক্রম নেই" message="নতুন সহায়তা কার্যক্রম বরাদ্দ হলে এখানে দেখাবে।" />;
  return (
    <ul className="space-y-3">
      {items.map((t) => (
        <li key={t.id} className={cn("flex flex-wrap items-center gap-3.5 rounded-xl border p-4 transition", t.status === "DONE" ? "border-slate-100 bg-slate-50/60 opacity-70" : "border-slate-100 bg-white hover:border-lagoon-200 hover:shadow-card")}>
          <button
            onClick={() => t.status !== "DONE" && complete(t.id)}
            className={cn("flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition active:scale-90", t.status === "DONE" ? "border-emerald-500 bg-emerald-500 text-white" : "border-slate-300 text-transparent hover:border-lagoon-500")}
          >
            <CircleCheck size={14} />
          </button>
          <div className="min-w-0 flex-1">
            <p className={cn("text-sm font-bold text-slate-700", t.status === "DONE" && "line-through")}>{t.title}</p>
            <p className="mt-0.5 text-[12px] text-slate-400">{t.detail}</p>
            <p className="mt-1 flex flex-wrap gap-x-3 text-[11px] text-slate-400">
              <span className="inline-flex items-center gap-1"><MapPin size={10} />{t.place}</span>
              <span className="inline-flex items-center gap-1"><CalendarDays size={10} />{t.due}</span>
            </p>
          </div>
          <GenericPill tone={t.status === "DONE" ? "emerald" : t.status === "ONGOING" ? "sky" : "amber"}>{t.status === "DONE" ? "সম্পন্ন" : t.status === "ONGOING" ? "চলমান" : "বাকি আছে"}</GenericPill>
        </li>
      ))}
    </ul>
  );
}

function DisasterCards({ items }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items.map((d) => {
        const t = disasterType(d.type);
        const sev = SEVERITY[d.severity];
        return (
          <div key={d.id} className={cn("relative overflow-hidden rounded-xl border p-4", d.severity === "CRITICAL" ? "border-red-200 bg-gradient-to-br from-red-50/60 to-white" : "border-slate-100")}>
            <div className="flex items-start gap-3">
              <span className={cn("inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", t.iconBox)}>
                <t.icon size={19} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[13.5px] font-bold leading-snug text-slate-800">{d.title}</p>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {d.areas.map((a) => (
                    <span key={a} className="chip bg-slate-100 text-slate-500">{a}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100/80 pt-3 text-[11.5px] text-slate-400">
              <span className="inline-flex items-center gap-1.5 font-bold" style={{ color: sev.dot.replace("bg-", "") }}>
                <span className={cn("h-2 w-2 rounded-full", sev.dot)} />
                ঝুঁকি: {sev.label}
                {d.signal && <span className="ml-1 text-orange-600">• {d.signal}</span>}
              </span>
              <span>ক্ষতিগ্রস্ত: {d.affectedEstimate} • {timeAgoBn(d.startedAt)}</span>
            </div>
            <p className="mt-1 text-[10.5px] text-slate-300">{d.source}</p>
          </div>
        );
      })}
    </div>
  );
}

function RiskBars({ items }) {
  return (
    <BarList data={items.map((d) => ({ label: d.district, value: d.risk }))} suffix="%" />
  );
}

function AreaTreeCards({ items }) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {Object.entries(items).map(([division, districts]) => (
        <div key={division} className="rounded-2xl border border-lagoon-100 bg-lagoon-50/40 p-4">
          <p className="flex items-center gap-2 text-sm font-bold text-lagoon-800">
            <MapPinned size={15} />
            {division}
          </p>
          <div className="mt-3 space-y-2.5">
            {Object.entries(districts).map(([district, upazilas]) => (
              <div key={district} className="rounded-xl border border-slate-100 bg-white p-3">
                <p className="text-[13px] font-bold text-slate-700">{district} জেলা</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {upazilas.map((u) => (
                    <span key={u} className="chip bg-sand-100/70 text-sand-700">{u}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function UserTable({ items }) {
  const [query, setQuery] = useState("");
  const rows = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.trim();
    return items.filter((u) => `${u.name} ${u.district} ${u.upazila} ${roleOf(u.role).labelEn} ${roleOf(u.role).label}`.includes(q));
  }, [items, query]);

  return (
    <div>
      <div className="relative mb-4 w-full sm:w-72">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input className="input !py-2 pl-9 text-[13px]" placeholder="নাম, জেলা বা ভূমিকা খুঁজুন..." value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>
      <div className="overflow-x-auto rounded-xl border border-slate-100">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-sand-50/70">
            <tr className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <th className="px-4 py-3">ব্যবহারকারী</th>
              <th className="px-4 py-3">ভূমিকা</th>
              <th className="px-4 py-3">এলাকা</th>
              <th className="px-4 py-3">অবস্থা</th>
              <th className="px-4 py-3 text-right">যোগদান</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {rows.map((u) => {
              const r = roleOf(u.role);
              return (
                <tr key={u.id} className="border-t border-slate-50 transition hover:bg-lagoon-50/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className={cn("inline-flex h-8.5 w-8.5 h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br text-xs font-bold text-white", r.avatar)}>{u.name.slice(0, 1)}</span>
                      <div>
                        <p className="font-semibold text-slate-700">{u.name}</p>
                        <p className="text-[11px] text-slate-400">{u.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3"><span className={cn("chip", r.pill)}>{r.label}</span></td>
                  <td className="whitespace-nowrap px-4 py-3 text-[13px] text-slate-500">{u.upazila}, {u.district}</td>
                  <td className="px-4 py-3">
                    <span className={cn("chip", u.status === "সক্রিয়" ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" : "bg-slate-100 text-slate-500 ring-1 ring-slate-200")}>
                      <span className={cn("h-1.5 w-1.5 rounded-full", u.status === "সক্রিয়" ? "bg-emerald-500" : "bg-slate-400")} />
                      {u.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right text-xs text-slate-400">{timeAgoBn(u.joinedAt)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {rows.length === 0 && <EmptyState icon={UsersRound} title="কাউকে পাওয়া যায়নি" message="অনুসন্ধানের সাথে মিলে এমন কোনো ব্যবহারকারী নেই।" />}
    </div>
  );
}

function TypeCards({ items }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {items.map((t) => {
        const d = disasterType(t.key);
        return (
          <div key={t.key} className="rounded-2xl border border-slate-100 bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-card">
            <div className="flex items-center gap-3">
              <span className={cn("inline-flex h-11 w-11 items-center justify-center rounded-xl", d.iconBox)}>
                <d.icon size={20} />
              </span>
              <div>
                <p className="text-sm font-bold text-slate-800">{d.label}</p>
                <p className="text-[11px] text-slate-400">{t.season}</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-center">
              <div className="rounded-lg bg-sand-50/80 px-2 py-2">
                <p className="text-base font-bold text-slate-700">{bnNum(t.occurrences)}</p>
                <p className="text-[10px] text-slate-400">মোট ঘটনা</p>
              </div>
              <div className={cn("rounded-lg px-2 py-2", t.activeAlerts > 0 ? "bg-red-50" : "bg-emerald-50")}>
                <p className={cn("text-base font-bold", t.activeAlerts > 0 ? "text-red-600" : "text-emerald-600")}>{bnNum(t.activeAlerts)}</p>
                <p className="text-[10px] text-slate-400">সক্রিয় সতর্কতা</p>
              </div>
            </div>
            <p className="mt-3 border-t border-slate-50 pt-2.5 text-[11px] text-slate-400">নির্দেশিকা: {t.guideline}</p>
          </div>
        );
      })}
    </div>
  );
}

function TeamCards({ items }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items.map((t) => {
        const s = TEAM_STATUS[t.status];
        return (
          <div key={t.id} className="rounded-2xl border border-slate-100 bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-card">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-lagoon-50 text-lagoon-600">
                  <LifeBuoy size={20} />
                </span>
                <div>
                  <p className="text-sm font-bold text-slate-800">{t.name}</p>
                  <p className="text-[11px] text-slate-400">{t.id} • {t.type}</p>
                </div>
              </div>
              <GenericPill tone={s.tone}>{s.label}</GenericPill>
            </div>
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-[12px] text-slate-500">
              <span className="inline-flex items-center gap-1.5"><UserCheck size={13} className="text-lagoon-500" />দলনেতা: <b className="text-slate-700">{t.lead}</b></span>
              <span className="inline-flex items-center gap-1.5"><Users size={13} className="text-lagoon-500" />{bnNum(t.members)} জন সদস্য</span>
              <span className="inline-flex items-center gap-1.5"><MapPin size={13} className="text-lagoon-500" />{t.area}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function HealthList({ items }) {
  const ICONBOX = { Server: "bg-lagoon-50 text-lagoon-600", Database: "bg-sky-50 text-sky-600", MessageSquare: "bg-amber-50 text-amber-600", Map: "bg-emerald-50 text-emerald-600", Radio: "bg-cyan-50 text-cyan-700" };
  const ICONFALLBACK = Server;
  return (
    <ul className="space-y-3">
      {items.map((s) => {
        const h = HEALTH[s.status];
        const IconCmp = { Server, MessageSquare, Map }[s.icon] || (s.icon === "Database" ? Warehouse : s.icon === "Radio" ? Radar : ICONFALLBACK);
        return (
          <li key={s.name} className="flex items-center gap-3.5 rounded-xl border border-slate-100 p-3.5">
            <span className={cn("inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", ICONBOX[s.icon] || "bg-slate-100 text-slate-500")}>
              <IconCmp size={18} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-[13.5px] font-bold text-slate-700">{s.name}</p>
                <GenericPill tone={h.tone}>{h.label}</GenericPill>
              </div>
              <p className="mt-0.5 text-[11.5px] text-slate-400">{s.detail} • আপটাইম {s.uptime} • লেটেন্সি {s.latency}</p>
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-slate-100">
                <div className={cn("h-full rounded-full", s.status === "HEALTHY" ? "bg-emerald-400" : "bg-amber-400")} style={{ width: s.status === "HEALTHY" ? "99%" : "82%" }} />
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function AwarenessCards({ items }) {
  const toneMap = { sky: "bg-sky-50 text-sky-600 border-sky-100", blue: "bg-blue-50 text-blue-600 border-blue-100", emerald: "bg-emerald-50 text-emerald-600 border-emerald-100", cyan: "bg-cyan-50 text-cyan-700 border-cyan-100" };
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items.map((a) => (
        <div key={a.title} className={cn("rounded-2xl border bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-card", toneMap[a.tone] || "border-slate-100")}>
          <div className="flex items-center gap-3">
            <span className={cn("inline-flex h-11 w-11 items-center justify-center rounded-xl", toneMap[a.tone])}>
              {AwareIcon(a.icon)}
            </span>
            <p className="text-[15px] font-bold text-slate-800">{a.title}</p>
          </div>
          <ul className="mt-4 space-y-2.5">
            {a.points.map((p, i) => (
              <li key={i} className="flex items-start gap-2.5 text-[13px] leading-relaxed text-slate-600">
                <CircleCheck size={15} className="mt-0.5 shrink-0 text-emerald-500" />
                {p}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

import { CloudRain, Droplet, Phone as PhoneIcon, WavesArrowUp, Wind } from "lucide-react";
function AwareIcon(name) {
  const m = { Wind: <Wind size={20} />, WavesArrowUp: <WavesArrowUp size={20} />, Phone: <PhoneIcon size={20} />, Droplet: <Droplet size={20} /> };
  return m[name] || <CloudRain size={20} />;
}

function AreaPanel({ area, subtitle }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-lagoon-600 to-lagoon-800 p-5 text-white">
      <p className="text-[11px] font-bold uppercase tracking-wider text-lagoon-100/80">{subtitle || ""}</p>
      <div className="mt-4 grid grid-cols-3 gap-3 text-center">
        {[
          { label: "ইউনিয়ন", value: area.unions },
          { label: "গ্রাম", value: area.villages },
          { label: "জনসংখ্যা", value: area.population, raw: true },
        ].map((x) => (
          <div key={x.label} className="rounded-xl bg-white/10 py-3 backdrop-blur">
            <p className="text-lg font-bold">{x.raw ? x.value : bnNum(x.value)}</p>
            <p className="text-[10.5px] text-white/70">{x.label}</p>
          </div>
        ))}
      </div>
      {area.risk && (
        <div className="mt-4">
          <div className="mb-1.5 flex justify-between text-[11.5px] text-white/80">
            <span>এলাকার ঝুঁকি সূচক</span>
            <span className="font-bold">{bn(area.risk.risk)}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/20">
            <div className="h-full rounded-full bg-gradient-to-r from-amber-300 to-orange-400" style={{ width: `${area.risk.risk}%` }} />
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Renderer registry                                                   */
/* ------------------------------------------------------------------ */
const RENDERERS = {
  missionCards: MissionCards,
  requestCards: RequestCards,
  operationCards: OperationCards,
  taskCards: TaskCards,
  disasterCards: DisasterCards,
  riskBars: RiskBars,
  areaTreeCards: AreaTreeCards,
  userTable: UserTable,
  typeCards: TypeCards,
  teamCards: TeamCards,
  healthList: HealthList,
  awarenessCards: AwarenessCards,
  areaPanel: AreaPanel,
  typeDonut: (props) => <Donut data={props.items} centerLabel="ঘটনা" />,
  timeline: (props) => <RecentActivity items={props.items} />,
};

/* ------------------------------------------------------------------ */
/* The generic section page                                            */
/* ------------------------------------------------------------------ */
export default function SectionPage({ sectionKey }) {
  const { user } = useAuth();
  const meta = META[sectionKey] || { title: "সেকশন", subtitle: "", icon: BookOpen };
  const { data, loading, error, refetch, silentRefetch } = useDashboard(() => dashboardService.getSectionData(sectionKey, user), [sectionKey]);
  const [verifyBusy, setVerifyBusy] = useState(null);

  const onVerify = async (id, action) => {
    setVerifyBusy(id);
    await dashboardService.verifyReport(id, action);
    await silentRefetch();
    setVerifyBusy(null);
  };

  return (
    <div>
      <PageHeader title={meta.title} subtitle={meta.subtitle} crumbs={`ড্যাশবোর্ড / ${meta.title}`} />

      {loading ? (
        <>
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="skeleton h-[132px] rounded-2xl" />
            ))}
          </div>
          <TableSkeleton rows={5} />
        </>
      ) : error ? (
        <ErrorState fullPage onRetry={refetch} />
      ) : (
        <div className="space-y-6">
          {data.stats?.length > 0 && <StatGrid stats={data.stats} columns={Math.min(4, Math.max(3, data.stats.length))} />}

          {data.blocks.map((block, i) => {
            if (block.type === "reportTable" || block.type === "verificationTable") {
              return (
                <Panel key={i} title={block.title} noPadding icon={block.type === "verificationTable" ? BadgeCheck : undefined}>
                  <ReportTable
                    items={block.items}
                    showReporter
                    onVerify={block.type === "verificationTable" ? onVerify : undefined}
                    verifyBusy={verifyBusy}
                    empty={{ title: "তালিকা খালি", message: "দেখানোর মতো কোনো আইটেম নেই।" }}
                  />
                </Panel>
              );
            }
            const Cmp = RENDERERS[block.type];
            if (!Cmp) return null;
            const bare = ["areaPanel"].includes(block.type);
            if (bare) return <Cmp key={i} {...block} subtitle={block.subtitle} />;
            return (
              <Panel key={i} title={block.title} subtitle={block.subtitle}>
                <Cmp {...block} />
              </Panel>
            );
          })}
        </div>
      )}
    </div>
  );
}
