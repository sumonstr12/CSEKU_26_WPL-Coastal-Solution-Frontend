import { CalendarDays, CircleCheck, ListChecks, MapPin } from "lucide-react";
import AvailabilityCard from "../../components/dashboard/AvailabilityCard";
import DisasterAlert from "../../components/dashboard/DisasterAlert";
import ErrorState from "../../components/dashboard/ErrorState";
import Panel, { SeeAllLink } from "../../components/dashboard/Panel";
import RecentActivity from "../../components/dashboard/RecentActivity";
import ReportTable from "../../components/dashboard/ReportTable";
import { DashboardSkeleton } from "../../components/dashboard/Skeletons";
import { StatGrid } from "../../components/dashboard/StatCard";
import { GenericPill } from "../../components/ui/Badge";
import { useDashboard } from "../../hooks/useDashboard";
import { dashboardService } from "../../services/dashboardService";
import { bn } from "../../utils/format";
import { cn } from "../../utils/cn.js";
import { WelcomeBanner } from "./Dashboard";

const TASK_CHIP = {
  PENDING: "bg-amber-50 text-amber-800 ring-1 ring-amber-200",
  ONGOING: "bg-sky-50 text-sky-700 ring-1 ring-sky-200",
  DONE: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
};

export default function VolunteerDashboard({ user }) {
  const { data, loading, error, refetch, setData } = useDashboard(dashboardService.getVolunteerOverview, []);

  if (loading) return <DashboardSkeleton statCount={4} />;
  if (error) return <ErrorState fullPage onRetry={refetch} />;

  const completeTask = async (id) => {
    await dashboardService.completeTask(id);
    setData((d) => ({ ...d, tasks: d.tasks.map((t) => (t.id === id ? { ...t, status: "DONE" } : t)) }));
  };

  return (
    <div className="space-y-6">
      <WelcomeBanner
        user={user}
        subtitle="আপনার এলাকার কার্যক্রম, রিপোর্ট ও সহায়তার সার্বিক চিত্র — সমন্বয়ের জন্য প্রস্তুত থাকুন।"
        extra={
          <span className="chip bg-white/15 text-white backdrop-blur">
            <MapPin size={11} />
            দায়িত্ব এলাকা: {data.area.upazila}, {data.area.district}
          </span>
        }
      />

      {/* prominent availability */}
      <AvailabilityCard user={user} />

      {data.alert && <DisasterAlert data={data.alert} />}

      <StatGrid stats={data.stats} columns={4} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* assigned tasks */}
        <Panel
          className="xl:col-span-2"
          title="নির্ধারিত সহায়তা কার্যক্রম"
          subtitle="দলনেতা কর্তৃক বরাদ্দকৃত কাজের তালিকা"
          icon={ListChecks}
          action={<SeeAllLink to="/dashboard/assistance" />}
        >
          <ul className="space-y-3">
            {data.tasks.map((t) => (
              <li key={t.id} className={cn("flex flex-wrap items-center gap-3.5 rounded-xl border p-3.5 transition", t.status === "DONE" ? "border-slate-100 bg-slate-50/60 opacity-70" : "border-slate-100 bg-white hover:border-lagoon-200 hover:shadow-card")}>
                <button
                  onClick={() => t.status !== "DONE" && completeTask(t.id)}
                  title={t.status === "DONE" ? "সম্পন্ন" : "সম্পন্ন হিসেবে চিহ্নিত করুন"}
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition active:scale-90",
                    t.status === "DONE" ? "border-emerald-500 bg-emerald-500 text-white" : "border-slate-300 text-transparent hover:border-lagoon-500"
                  )}
                >
                  <CircleCheck size={14} />
                </button>
                <div className="min-w-0 flex-1">
                  <p className={cn("text-sm font-bold text-slate-700", t.status === "DONE" && "line-through")}>{t.title}</p>
                  <p className="mt-0.5 flex flex-wrap gap-x-3 text-[11.5px] text-slate-400">
                    <span className="inline-flex items-center gap-1"><MapPin size={11} />{t.place}</span>
                    <span className="inline-flex items-center gap-1"><CalendarDays size={11} />{t.due}</span>
                  </p>
                </div>
                <GenericPill tone={t.status === "DONE" ? "emerald" : t.status === "ONGOING" ? "sky" : "amber"}>
                  {t.status === "DONE" ? "সম্পন্ন" : t.status === "ONGOING" ? "চলমান" : "বাকি আছে"}
                </GenericPill>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="সাম্প্রতিক কার্যক্রম">
          <RecentActivity items={data.activities} compact />
          <div className="mt-5 rounded-xl bg-lagoon-50/70 p-4 text-[12.5px] leading-relaxed text-lagoon-800">
            <b>পরবর্তী ব্রিফিং:</b> শুক্রবার সকাল {bn(10)}টা — কয়রা উপজেলা পরিষদ হলরুম। উপস্থিতি আবশ্যক।
          </div>
        </Panel>
      </div>

      <Panel
        title="কমিউনিটি রিপোর্ট"
        subtitle="আপনার এলাকার নাগরিকদের রিপোর্ট (খুলনা অঞ্চল)"
        noPadding
        action={<SeeAllLink to="/dashboard/community-reports" />}
      >
        <ReportTable items={data.communityReports} showReporter expandable={false} empty={{ title: "কোনো কমিউনিটি রিপোর্ট নেই", message: "নতুন রিপোর্ট জমা পড়লে এখানে দেখাবে।" }} />
      </Panel>
    </div>
  );
}
