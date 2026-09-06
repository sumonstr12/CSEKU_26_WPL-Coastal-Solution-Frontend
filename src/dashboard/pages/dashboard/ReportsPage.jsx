import { useMemo, useState } from "react";
import { FileText, Megaphone, Search } from "lucide-react";
import { Link } from "react-router-dom";
import ErrorState from "../../components/dashboard/ErrorState";
import Panel, { PageHeader } from "../../components/dashboard/Panel";
import ReportTable from "../../components/dashboard/ReportTable";
import { TableSkeleton } from "../../components/dashboard/Skeletons";
import { useAuth } from "../../context/AuthContext";
import { useDashboard } from "../../hooks/useDashboard";
import { dashboardService } from "../../services/dashboardService";
import { REPORT_STATUS } from "../../config/disasterTypes";
import { cn } from "../../utils/cn.js";

const TITLES = {
  mine: { title: "আমার রিপোর্ট", subtitle: "আপনার জমা দেওয়া সকল দুর্যোগ রিপোর্টের তালিকা ও অবস্থা", crumbs: "আমার কার্যক্রম / আমার রিপোর্ট" },
  all: { title: "দুর্যোগ রিপোর্ট", subtitle: "আপনার দৃষ্টিসীমার সকল রিপোর্ট — ফিল্টার করে দেখুন", crumbs: "কার্যক্রম / দুর্যোগ রিপোর্ট" },
  community: { title: "কমিউনিটি রিপোর্ট", subtitle: "আপনার এলাকার নাগরিকদের জমা দেওয়া রিপোর্ট", crumbs: "কার্যক্রম / কমিউনিটি রিপোর্ট" },
};

const FILTERS = [
  { key: "ALL", label: "সব" },
  { key: "PENDING", label: REPORT_STATUS.PENDING.label },
  { key: "VERIFIED", label: REPORT_STATUS.VERIFIED.label },
  { key: "IN_PROGRESS", label: REPORT_STATUS.IN_PROGRESS.label },
  { key: "RESOLVED", label: REPORT_STATUS.RESOLVED.label },
];

export default function ReportsPage({ mode = "all" }) {
  const { user } = useAuth();
  const meta = TITLES[mode];
  const scope = mode === "mine" ? "mine" : mode === "community" ? "community" : "all";
  const { data, loading, error, refetch } = useDashboard(() => dashboardService.getReports(scope, user), [scope]);
  const [filter, setFilter] = useState("ALL");
  const [query, setQuery] = useState("");

  const items = useMemo(() => {
    let rows = data || [];
    if (filter !== "ALL") rows = rows.filter((r) => r.status === filter);
    if (query.trim()) {
      const q = query.trim();
      rows = rows.filter((r) => `${r.title} ${r.district} ${r.upazila} ${r.id} ${r.place}`.includes(q));
    }
    return rows;
  }, [data, filter, query]);

  return (
    <div>
      <PageHeader title={meta.title} subtitle={meta.subtitle} crumbs={meta.crumbs}>
        {mode === "mine" && (
          <Link to="/dashboard/report-disaster" className="btn-primary">
            <Megaphone size={16} />
            নতুন রিপোর্ট করুন
          </Link>
        )}
      </PageHeader>

      {/* filter bar */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-[12.5px] font-bold transition active:scale-95",
                filter === f.key ? "bg-lagoon-600 text-white shadow-sm shadow-lagoon-600/25" : "bg-white text-slate-500 ring-1 ring-slate-200 hover:text-lagoon-700 hover:ring-lagoon-300"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="relative ml-auto w-full sm:w-64">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input className="input !py-2 pl-9 text-[13px]" placeholder="শিরোনাম, এলাকা বা আইডি খুঁজুন..." value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
      </div>

      {loading ? (
        <TableSkeleton rows={6} />
      ) : error ? (
        <ErrorState onRetry={refetch} />
      ) : (
        <Panel noPadding title={`মোট ${items.length}টি রিপোর্ট`} icon={FileText}>
          <ReportTable
            items={items}
            empty={{
              title: filter === "ALL" && mode === "mine" ? "এখনও কোনো রিপোর্ট নেই" : "কোনো রিপোর্ট পাওয়া যায়নি",
              message: mode === "mine" ? "দুর্যোগ দেখা দিলে দ্রুত রিপোর্ট করুন — প্রথম রিপোর্টই কাজে আসতে পারে।" : "এই ফিল্টারে কোনো ফলাফল নেই। অন্য ফিল্টার চেষ্টা করুন।",
              actionLabel: mode === "mine" ? "প্রথম রিপোর্ট করুন" : undefined,
              actionTo: "/dashboard/report-disaster",
            }}
          />
        </Panel>
      )}
    </div>
  );
}
