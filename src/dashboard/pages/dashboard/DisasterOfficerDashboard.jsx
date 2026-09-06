import { Activity, ChartColumn, LifeBuoy, Radar, ShieldAlert, TrendingUp } from "lucide-react";
import DisasterAlert from "../../components/dashboard/DisasterAlert";
import ErrorState from "../../components/dashboard/ErrorState";
import Panel, { SeeAllLink } from "../../components/dashboard/Panel";
import ReportTable from "../../components/dashboard/ReportTable";
import { DashboardSkeleton } from "../../components/dashboard/Skeletons";
import { StatGrid } from "../../components/dashboard/StatCard";
import { BarList, ColumnChart, Donut } from "../../components/dashboard/Charts";
import { useDashboard } from "../../hooks/useDashboard";
import { dashboardService } from "../../services/dashboardService";
import { bn, bnNum } from "../../utils/format";
import { WelcomeBanner } from "./Dashboard";

export default function DisasterOfficerDashboard({ user }) {
  const { data, loading, error, refetch } = useDashboard(dashboardService.getOfficerOverview, []);

  if (loading) return <DashboardSkeleton statCount={6} />;
  if (error) return <ErrorState fullPage onRetry={refetch} />;

  const r = data.region;

  return (
    <div className="space-y-6">
      <WelcomeBanner
        user={user}
        subtitle="আঞ্চলিক পর্যবেক্ষণ, ঝুঁকি বিশ্লেষণ ও সমন্বিত সাড়াদান — আপনার অঞ্চলের সার্বিক চিত্র।"
        extra={
          <span className="chip bg-white/15 text-white backdrop-blur">
            <Radar size={11} />
            {user.organization}
          </span>
        }
      />

      {data.alert && <DisasterAlert data={data.alert} />}

      <StatGrid stats={data.stats} columns={6} />

      {/* regional situation overview */}
      <div className="card relative overflow-hidden">
        <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-lagoon-50 blur-2xl" />
        <div className="grid lg:grid-cols-[340px_1fr]">
          <div className="relative border-b border-slate-100 p-6 lg:border-b-0 lg:border-r">
            <p className="text-xs font-bold uppercase tracking-wider text-lagoon-600">Regional Situation Overview</p>
            <h3 className="mt-1.5 text-xl font-bold text-slate-800">{r.name}</h3>
            <div className="mt-5 space-y-3.5">
              {[
                { label: "Active Alerts", value: r.alerts, tone: "text-red-600 bg-red-50" },
                { label: "High Risk Areas", value: r.highRisk, tone: "text-orange-600 bg-orange-50" },
                { label: "Pending Reports", value: r.pending, tone: "text-lagoon-700 bg-lagoon-50" },
              ].map((x) => (
                <div key={x.label} className="flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3">
                  <span className="text-[13px] font-semibold text-slate-600">{x.label}</span>
                  <span className={`inline-flex h-9 min-w-9 items-center justify-center rounded-lg text-base font-bold ${x.tone}`}>{bn(x.value)}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 flex items-center gap-1.5 text-[11.5px] text-slate-400">
              <ShieldAlert size={13} className="text-orange-500" />
              ঝুঁকি সূচক হালনাগাদ: প্রতি ৩০ মিনিটে পূর্বাভাস মডেল থেকে
            </p>
          </div>
          <div className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h4 className="text-[15px] font-bold text-slate-800">জেলাভিত্তিক ঝুঁকি সূচক</h4>
              <SeeAllLink to="/dashboard/risk-analysis" label="বিস্তারিত বিশ্লেষণ" />
            </div>
            <BarList data={r.districts.map((d) => ({ label: d.district, value: d.risk }))} suffix="%" />
          </div>
        </div>
      </div>

      {/* charts row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Panel title="ধরনভিত্তিক ঘটনা বন্টন" subtitle="চলতি মৌসুমে রিপোর্টের ধরন" icon={ChartColumn} action={<SeeAllLink to="/dashboard/risk-analysis" label="বিস্তারিত" />}>
          <Donut data={data.reportsByType} centerLabel="রিপোর্ট" />
        </Panel>
        <Panel title="মাসভিত্তিক ঘটনা প্রবণতা" subtitle="গত ৭ মাসের যাচাইকৃত রিপোর্ট" icon={TrendingUp}>
          <ColumnChart data={data.monthlyTrend} />
          <p className="mt-3 text-center text-[11.5px] text-slate-400">মে–জুন মাসে ঘূর্ণিঝড় মৌসুমের কারণে প্রবণতা ঊর্ধ্বগামী</p>
        </Panel>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Panel className="xl:col-span-2" title="উচ্চ অগ্রাধিকার রিপোর্ট" subtitle="তাৎক্ষণিক মনোযোগ প্রয়োজন" noPadding action={<SeeAllLink to="/dashboard/reports" />}>
          <ReportTable items={data.priorityReports} expandable={false} empty={{ title: "কোনো উচ্চ-ঝুঁকি রিপোর্ট নেই", message: "বর্তমানে সব অগ্রাধিকার রিপোর্ট প্রক্রিয়াধীন।" }} />
        </Panel>
        <Panel title="চলমান উদ্ধার অভিযান" icon={LifeBuoy} action={<SeeAllLink to="/dashboard/rescue-operations" />}>
          <ul className="space-y-3">
            {data.operations.map((o) => (
              <li key={o.id} className="flex items-start gap-3 rounded-xl border border-slate-100 p-3.5">
                <span className={`mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${o.status === "DONE" ? "bg-emerald-50 text-emerald-600" : "bg-sky-50 text-sky-600"}`}>
                  <Activity size={15} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-bold text-slate-700">{o.title}</p>
                  <p className="text-[11.5px] text-slate-400">
                    {o.district} • {bnNum(o.teams)}টি দল • {bnNum(o.rescued)} জন
                  </p>
                </div>
                <span className={`chip shrink-0 ${o.status === "DONE" ? "bg-emerald-50 text-emerald-700" : "bg-sky-50 text-sky-700"}`}>{o.status === "DONE" ? "সম্পন্ন" : "চলমান"}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
