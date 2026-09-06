import { ChartPie, MonitorCheck, Server, TrendingUp, Users } from "lucide-react";
import { Link } from "react-router-dom";
import ErrorState from "../../components/dashboard/ErrorState";
import Panel, { SeeAllLink } from "../../components/dashboard/Panel";
import RecentActivity from "../../components/dashboard/RecentActivity";
import { DashboardSkeleton } from "../../components/dashboard/Skeletons";
import { StatGrid } from "../../components/dashboard/StatCard";
import { BarList, ColumnChart, Donut } from "../../components/dashboard/Charts";
import { GenericPill } from "../../components/ui/Badge";
import { useDashboard } from "../../hooks/useDashboard";
import { dashboardService } from "../../services/dashboardService";
import { bnNum } from "../../utils/format";
import { WelcomeBanner } from "./Dashboard";

const HEALTH_TONE = { HEALTHY: "emerald", DEGRADED: "amber", DOWN: "red" };

export default function AdminDashboard({ user }) {
  const { data, loading, error, refetch } = useDashboard(dashboardService.getAdminOverview, []);

  if (loading) return <DashboardSkeleton statCount={8} />;
  if (error) return <ErrorState fullPage onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <WelcomeBanner
        user={user}
        subtitle="প্ল্যাটফর্মব্যাপী ব্যবহারকারী, রিপোর্ট, অবকাঠামো ও সিস্টেম স্বাস্থ্যের সম্পূর্ণ নজরদারি।"
        extra={
          <span className="chip bg-white/15 text-white backdrop-blur">
            <Server size={11} />
            সার্ভিস সচল: {bnNum(4)}/৫
          </span>
        }
      />

      <StatGrid stats={data.stats} columns={4} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        {/* user distribution */}
        <Panel className="xl:col-span-3" title="User Distribution" subtitle="ভূমিকা অনুযায়ী নিবন্ধিত ব্যবহারকারী" icon={Users} action={<SeeAllLink to="/dashboard/users" label="ব্যবহারকারী ব্যবস্থাপনা" />}>
          <BarList data={data.userDistribution} />
          <div className="mt-6 grid grid-cols-2 gap-3 border-t border-slate-100 pt-5 sm:grid-cols-3">
            {[
              { label: "গত সপ্তাহে যোগদান", value: 214 },
              { label: "আজ সক্রিয় সেশন", value: 486 },
              { label: "যাচাই বাকি", value: 11 },
            ].map((x) => (
              <div key={x.label} className="rounded-xl bg-sand-50/80 px-4 py-3">
                <p className="text-lg font-bold text-slate-800">{bnNum(x.value)}</p>
                <p className="text-[11px] font-medium text-slate-400">{x.label}</p>
              </div>
            ))}
          </div>
        </Panel>

        {/* recent system activity */}
        <Panel className="xl:col-span-2" title="Recent System Activity" subtitle="লাইভ প্ল্যাটফর্ম ইভেন্ট">
          <RecentActivity items={data.systemActivity} compact />
        </Panel>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Panel title="মাসিক ইনসিডেন্ট প্রবণতা" subtitle="প্ল্যাটফর্মজুড়ে মোট রিপোর্ট" icon={TrendingUp} className="lg:col-span-1">
          <ColumnChart data={data.monthlyTrend} height={150} />
        </Panel>

        <Panel title="ধরনভিত্তিক রিপোর্ট" subtitle="বন্টন (শতাংশ)" icon={ChartPie} className="lg:col-span-1">
          <Donut data={data.reportsByType} size={150} thickness={20} centerLabel="মোট" />
        </Panel>

        {/* system health summary */}
        <Panel title="System Monitoring" subtitle="মূল সার্ভিসগুলোর অবস্থা" icon={MonitorCheck} className="lg:col-span-1" action={<SeeAllLink to="/dashboard/system-monitoring" label="বিস্তারিত" />}>
          <ul className="space-y-3">
            {data.services.slice(0, 4).map((s) => (
              <li key={s.name} className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 px-3.5 py-2.5">
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-bold text-slate-700">{s.name}</p>
                  <p className="text-[11px] text-slate-400">আপটাইম {s.uptime} • {s.latency}</p>
                </div>
                <GenericPill tone={HEALTH_TONE[s.status]}>{s.status === "HEALTHY" ? "সচল" : "ধীরগতি"}</GenericPill>
              </li>
            ))}
          </ul>
          <Link to="/dashboard/system-monitoring" className="btn-soft mt-4 w-full !py-2 text-[13px]">
            সিস্টেম পর্যবেক্ষণ খুলুন
          </Link>
        </Panel>
      </div>
    </div>
  );
}
