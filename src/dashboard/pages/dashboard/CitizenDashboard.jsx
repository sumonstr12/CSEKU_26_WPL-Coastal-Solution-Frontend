import { Map, Megaphone, Phone, Warehouse } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DisasterAlert from "../../components/dashboard/DisasterAlert";
import ErrorState from "../../components/dashboard/ErrorState";
import Panel, { SeeAllLink } from "../../components/dashboard/Panel";
import QuickActions from "../../components/dashboard/QuickActions";
import RecentActivity from "../../components/dashboard/RecentActivity";
import ReportTable from "../../components/dashboard/ReportTable";
import { DashboardSkeleton } from "../../components/dashboard/Skeletons";
import { StatGrid } from "../../components/dashboard/StatCard";
import { Meter } from "../../components/dashboard/Charts";
import { useDashboard } from "../../hooks/useDashboard";
import { dashboardService } from "../../services/dashboardService";
import { bn, bnNum } from "../../utils/format";
import { greetingBn } from "../../utils/format";
import { WelcomeBanner } from "./Dashboard";

export default function CitizenDashboard({ user }) {
  const { data, loading, error, refetch } = useDashboard(dashboardService.getCitizenOverview, []);
  const navigate = useNavigate();

  if (loading) return <DashboardSkeleton statCount={4} />;
  if (error) return <ErrorState fullPage onRetry={refetch} />;

  const clickMap = { myReports: "/dashboard/my-reports", active: "/dashboard/map", shelters: "/dashboard/shelters", warning: "/dashboard/notifications" };

  return (
    <div className="space-y-6">
      <WelcomeBanner
        user={user}
        subtitle={`${greetingBn()}! আপনার এলাকার বর্তমান দুর্যোগ পরিস্থিতি দেখুন এবং প্রয়োজনে দ্রুত রিপোর্ট করুন।`}
        extra={
          <span className="chip bg-white/15 text-white backdrop-blur">
            {user.upazila}, {user.district}
          </span>
        }
      />

      {data.alert && <DisasterAlert data={data.alert} />}

      <StatGrid stats={data.stats} columns={4} onStatClick={(s) => clickMap[s.key] && navigate(clickMap[s.key])} />

      <QuickActions
        actions={[
          { to: "/dashboard/report-disaster", icon: Megaphone, label: "দুর্যোগ রিপোর্ট করুন", desc: "মাত্র কয়েক ধাপে", tone: "primary" },
          { to: "/dashboard/shelters", icon: Warehouse, label: "আশ্রয়কেন্দ্র খুঁজুন", desc: "নিকটস্থ তালিকা ও ধারণক্ষমতা", tone: "soft" },
          { to: "/dashboard/map", icon: Map, label: "মানচিত্র দেখুন", desc: "লাইভ পরিস্থিতি", tone: "soft" },
        ]}
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Panel
          className="xl:col-span-2"
          title="আমার সাম্প্রতিক রিপোর্ট"
          subtitle="আপনার জমা দেওয়া রিপোর্টের সর্বশেষ অবস্থা"
          icon={Megaphone}
          noPadding
          action={<SeeAllLink to="/dashboard/my-reports" />}
        >
          <ReportTable
            items={data.myReports}
            empty={{ title: "এখনও কোনো রিপোর্ট নেই", message: "দুর্যোগ দেখা দিলে দ্রুত রিপোর্ট করুন — একই এলাকার সবাই উপকৃত হবে।", actionLabel: "প্রথম রিপোর্ট করুন", actionTo: "/dashboard/report-disaster" }}
          />
        </Panel>

        <div className="space-y-6">
          <Panel title="সাম্প্রতিক কার্যক্রম" subtitle="আপনার অঞ্চলের আপডেট">
            <RecentActivity items={data.activities} compact />
          </Panel>
        </div>
      </div>

      {/* nearby shelters */}
      <Panel title="নিকটস্থ আশ্রয়কেন্দ্র" subtitle="কয়রা অঞ্চলে খোলা আশ্রয়কেন্দ্রসমূহ" icon={Warehouse} action={<SeeAllLink to="/dashboard/shelters" />}>
        <div className="grid gap-4 md:grid-cols-3">
          {data.shelters.map((s) => (
            <div key={s.id} className="rounded-xl border border-slate-100 bg-sand-50/50 p-4 transition hover:border-lagoon-200 hover:bg-lagoon-50/40">
              <div className="flex items-start justify-between gap-2">
                <p className="line-clamp-2 min-h-[36px] text-[13px] font-bold text-slate-700">{s.name}</p>
                <span className="chip shrink-0 bg-sky-50 text-sky-700">{s.distance}</span>
              </div>
              <div className="mt-3">
                <div className="mb-1 flex justify-between text-[11px] font-medium text-slate-400">
                  <span>আশ্রিত {bnNum(s.occupied)}</span>
                  <span>ক্ষমতা {bnNum(s.capacity)}</span>
                </div>
                <Meter value={s.occupied} max={s.capacity} />
              </div>
            </div>
          ))}
        </div>
      </Panel>

      {/* emergency strip */}
      <div className="relative overflow-hidden rounded-2xl border border-red-100 bg-gradient-to-r from-red-50 via-orange-50 to-amber-50 p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <span className="relative inline-flex h-11 w-11 items-center justify-center rounded-xl bg-red-100 text-red-600">
              <span className="absolute h-full w-full animate-ping-soft rounded-xl bg-red-300/40" />
              <Phone size={19} className="relative" />
            </span>
            <div>
              <p className="text-sm font-bold text-slate-800">জীবনের ঝুঁকি থাকলে সাড়া দেওয়ার আগে কল করুন</p>
              <p className="text-xs text-slate-500">জাতীয় জরুরি সেবা — সার্বক্ষণিক, বিনামূল্যে</p>
            </div>
          </div>
          <div className="flex gap-2.5">
            <a href="tel:999" className="btn bg-red-500 px-4 py-2.5 font-bold text-white shadow-sm shadow-red-500/30 hover:bg-red-600 active:scale-[0.97]">
              <Phone size={15} /> ৯৯৯ কল করুন
            </a>
            <a href="tel:1090" className="btn-secondary !border-red-200 !text-red-600 hover:!bg-red-50 px-4 py-2.5">
              দুর্যোগ বার্তা {bn(1090)}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
