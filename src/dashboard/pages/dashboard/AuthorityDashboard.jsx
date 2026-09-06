import { useState } from "react";
import { BadgeCheck, Landmark, LifeBuoy, MapPin, Users, Warehouse } from "lucide-react";
import DisasterAlert from "../../components/dashboard/DisasterAlert";
import ErrorState from "../../components/dashboard/ErrorState";
import Panel, { SeeAllLink } from "../../components/dashboard/Panel";
import RecentActivity from "../../components/dashboard/RecentActivity";
import ReportTable from "../../components/dashboard/ReportTable";
import { DashboardSkeleton } from "../../components/dashboard/Skeletons";
import { StatGrid } from "../../components/dashboard/StatCard";
import { Meter } from "../../components/dashboard/Charts";
import { useDashboard } from "../../hooks/useDashboard";
import { dashboardService } from "../../services/dashboardService";
import { bnNum } from "../../utils/format";
import { WelcomeBanner } from "./Dashboard";

export default function AuthorityDashboard({ user }) {
  const { data, loading, error, refetch, silentRefetch } = useDashboard(dashboardService.getAuthorityOverview, []);
  const [verifyBusy, setVerifyBusy] = useState(null);

  if (loading) return <DashboardSkeleton statCount={5} />;
  if (error) return <ErrorState fullPage onRetry={refetch} />;

  const onVerify = async (id, action) => {
    setVerifyBusy(id);
    await dashboardService.verifyReport(id, action);
    await silentRefetch();
    setVerifyBusy(null);
  };

  return (
    <div className="space-y-6">
      <WelcomeBanner
        user={user}
        subtitle={`${user.designation} — এলাকার রিপোর্ট যাচাই, আশ্রয়কেন্দ্র ও উদ্ধার কার্যক্রমের সমন্বয় আপনার এখান থেকে।`}
        extra={
          <span className="chip bg-white/15 text-white backdrop-blur">
            <Landmark size={11} />
            {user.organization}
          </span>
        }
      />

      {/* administrative area card */}
      <div className="card relative overflow-hidden">
        <div className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-lagoon-400 to-lagoon-700" />
        <div className="flex flex-wrap items-center gap-5 p-5 pl-6">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-lagoon-50 text-lagoon-600">
            <Landmark size={24} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">আপনার প্রশাসনিক এলাকা</p>
            <p className="mt-0.5 text-lg font-bold text-slate-800">
              {data.area.district} <span className="font-normal text-slate-300">•</span> {data.area.upazila}
            </p>
          </div>
          <div className="flex flex-wrap gap-x-7 gap-y-3">
            {[
              { label: "ইউনিয়ন", value: data.area.unions },
              { label: "গ্রাম", value: data.area.villages },
              { label: "জনসংখ্যা", value: data.area.population, raw: true },
            ].map((x) => (
              <div key={x.label} className="text-center">
                <p className="text-lg font-bold text-lagoon-700">{x.raw ? x.value : bnNum(x.value)}</p>
                <p className="text-[11px] font-medium text-slate-400">{x.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {data.alert && <DisasterAlert data={data.alert} />}

      <StatGrid stats={data.stats} columns={5} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Panel
          className="xl:col-span-2"
          title="রিপোর্ট যাচাই সারি"
          subtitle="নাগরিকদের রিপোর্ট — যাচাই করুন অথবা বাতিল করুন"
          icon={BadgeCheck}
          noPadding
          action={<SeeAllLink to="/dashboard/verification" />}
        >
          <ReportTable
            items={data.verificationQueue}
            onVerify={onVerify}
            verifyBusy={verifyBusy}
            empty={{ title: "যাচাই সারি খালি", message: "সব রিপোর্ট যাচাই সম্পন্ন হয়েছে। চমৎকার কাজ!" }}
          />
        </Panel>

        <div className="space-y-6">
          <Panel title="আশ্রয়কেন্দ্র ধারণক্ষমতা" icon={Warehouse} action={<SeeAllLink to="/dashboard/shelters" />}>
            <div className="space-y-4">
              {data.shelters.map((s) => (
                <div key={s.id}>
                  <div className="mb-1.5 flex items-center justify-between gap-2">
                    <p className="truncate text-[12.5px] font-semibold text-slate-600">{s.name}</p>
                  </div>
                  <Meter value={s.occupied} max={s.capacity} />
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="সাম্প্রতিক কার্যক্রম">
            <RecentActivity items={data.activities} compact />
          </Panel>
        </div>
      </div>

      <Panel title="চলমান উদ্ধার অভিযান" subtitle="আপনার এলাকায় সমন্বয়াধীন অভিযানসমূহ" icon={LifeBuoy} action={<SeeAllLink to="/dashboard/rescue-operations" />}>
        <div className="grid gap-4 md:grid-cols-3">
          {data.operations.filter((o) => o.status === "IN_PROGRESS").map((o) => (
            <div key={o.id} className="rounded-xl border border-slate-100 p-4 transition hover:border-lagoon-200 hover:shadow-card">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[13px] font-bold text-slate-700">{o.title}</p>
                <span className="chip bg-sky-50 text-sky-700 ring-1 ring-sky-200">চলমান</span>
              </div>
              <p className="mt-1 flex items-center gap-1 text-[11.5px] text-slate-400">
                <MapPin size={11} />
                {o.district} • নেতৃত্বে {o.lead}
              </p>
              <div className="mt-3 flex items-center gap-4 text-[12px] font-semibold text-slate-600">
                <span className="inline-flex items-center gap-1.5"><Users size={13} className="text-lagoon-500" />{bnNum(o.teams)}টি দল</span>
                <span className="inline-flex items-center gap-1.5"><LifeBuoy size={13} className="text-emerald-500" />{bnNum(o.rescued)} জন উদ্ধার</span>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
