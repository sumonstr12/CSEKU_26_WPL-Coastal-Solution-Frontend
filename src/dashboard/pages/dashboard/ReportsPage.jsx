import { useMemo, useState } from "react";
import {
  FileText,
  Megaphone,
  Search,
  X,
  MapPin,
  Users,
  Phone,
  Mail,
  Image as ImageIcon,
  Film,
  ExternalLink,
} from "lucide-react";
import { Link } from "react-router-dom";
import ErrorState from "../../components/dashboard/ErrorState";
import Panel, { PageHeader } from "../../components/dashboard/Panel";
import ReportTable from "../../components/dashboard/ReportTable";
import EditReportModal from "../../components/dashboard/EditReportModal";
import VolunteerReportDetailModal from "../../components/dashboard/VolunteerReportDetailModal";
import { TableSkeleton } from "../../components/dashboard/Skeletons";
import { SeverityPill, StatusPill } from "../../components/ui/Badge";
import { useAuth } from "../../context/AuthContext";
import { useDashboard } from "../../hooks/useDashboard";
import { dashboardService } from "../../services/dashboardService";
import { REPORT_STATUS } from "../../config/disasterTypes";
import { bnNum, clockBn } from "../../utils/format";
import { cn } from "../../utils/cn.js";

const TITLES = {
  mine: {
    title: "আমার রিপোর্ট",
    subtitle: "আপনার জমা দেওয়া সকল দুর্যোগ রিপোর্টের তালিকা ও অবস্থা",
    crumbs: "আমার কার্যক্রম / আমার রিপোর্ট",
  },
  all: {
    title: "দুর্যোগ রিপোর্ট",
    subtitle: "আপনার দৃষ্টিসীমার সকল রিপোর্ট — ফিল্টার করে দেখুন",
    crumbs: "কার্যক্রম / দুর্যোগ রিপোর্ট",
  },
  community: {
    title: "কমিউনিটি রিপোর্ট",
    subtitle: "আপনার এলাকার নাগরিকদের জমা দেওয়া রিপোর্ট",
    crumbs: "কার্যক্রম / কমিউনিটি রিপোর্ট",
  },
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
  const { data, loading, error, refetch, silentRefetch } = useDashboard(
    () => dashboardService.getReports(scope, user),
    [scope]
  );
  const [filter, setFilter] = useState("ALL");
  const [query, setQuery] = useState("");
  const [actionBusy, setActionBusy] = useState(null);
  const [editId, setEditId] = useState(null);
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");

  const role = String(user?.role || "").toUpperCase();
  const isCitizenMine = mode === "mine" && role === "CITIZEN";
  const isAuthority = role === "LOCAL_AUTHORITY" || role === "AUTHORITY";
  const isVolunteer = role === "COMMUNITY_VOLUNTEER" || role === "VOLUNTEER";
  const [volunteerDetailId, setVolunteerDetailId] = useState(null);

  const openAuthorityDetail = async (row) => {
    if (!isAuthority) return;
    setDetailLoading(true);
    setDetailError("");
    setDetail(null);
    try {
      const data = await dashboardService.getAuthorityReportDetail(row.id);
      setDetail(data);
    } catch (err) {
      setDetailError(err?.response?.data?.detail || "বিস্তারিত লোড করা যায়নি");
      setDetail({ id: row.id, title: row.title });
    } finally {
      setDetailLoading(false);
    }
  };

  const items = useMemo(() => {
    let rows = data || [];
    if (filter !== "ALL") rows = rows.filter((r) => r.status === filter);
    if (query.trim()) {
      const q = query.trim();
      rows = rows.filter((r) =>
        `${r.title} ${r.district} ${r.upazila} ${r.id} ${r.place}`.includes(q)
      );
    }
    return rows;
  }, [data, filter, query]);

  const openEdit = (r) => setEditId(r.id);

  const onDelete = async (r) => {
    if (!window.confirm(`রিপোর্ট #${r.id} মুছে ফেলতে চান?`)) return;
    setActionBusy(r.id);
    try {
      await dashboardService.deleteCitizenReport(r.id);
      await (silentRefetch ? silentRefetch() : refetch());
    } catch (err) {
      alert(err?.response?.data?.detail || "মুছে ফেলা যায়নি");
    } finally {
      setActionBusy(null);
    }
  };

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

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-[12.5px] font-bold transition active:scale-95",
                filter === f.key
                  ? "bg-lagoon-600 text-white shadow-sm shadow-lagoon-600/25"
                  : "bg-white text-slate-500 ring-1 ring-slate-200 hover:text-lagoon-700 hover:ring-lagoon-300"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="relative ml-auto w-full sm:w-64">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="input !py-2 pl-9 text-[13px]"
            placeholder="শিরোনাম, এলাকা বা আইডি খুঁজুন..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
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
            onEdit={isCitizenMine ? openEdit : undefined}
            onDelete={isCitizenMine ? onDelete : undefined}
            actionBusy={actionBusy}
            onRowClick={
              isAuthority
                ? openAuthorityDetail
                : isVolunteer
                  ? (r) => setVolunteerDetailId(r.id)
                  : undefined
            }
            empty={{
              title:
                filter === "ALL" && mode === "mine"
                  ? "এখনও কোনো রিপোর্ট নেই"
                  : "কোনো রিপোর্ট পাওয়া যায়নি",
              message:
                mode === "mine"
                  ? "দুর্যোগ দেখা দিলে দ্রুত রিপোর্ট করুন — প্রথম রিপোর্টই কাজে আসতে পারে।"
                  : "এই ফিল্টারে কোনো ফলাফল নেই। অন্য ফিল্টার চেষ্টা করুন।",
              actionLabel: mode === "mine" ? "প্রথম রিপোর্ট করুন" : undefined,
              actionTo: "/dashboard/report-disaster",
            }}
          />
        </Panel>
      )}

      {/* Authority report detail modal */}
      {(detail || detailLoading) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-5 shadow-xl">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-800">
                  {detailLoading ? "লোড হচ্ছে..." : detail?.title || `রিপোর্ট #${detail?.id}`}
                </h3>
                {detail?.id && (
                  <p className="mt-0.5 text-[12px] text-slate-400">আইডি: {detail.id}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => {
                  setDetail(null);
                  setDetailError("");
                }}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            {detailLoading ? (
              <div className="space-y-3">
                <div className="skeleton h-20 rounded-xl" />
                <div className="skeleton h-32 rounded-xl" />
              </div>
            ) : detailError && !detail?.description ? (
              <p className="text-sm font-semibold text-red-600">{detailError}</p>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {detail.status && <StatusPill status={detail.status} />}
                  {detail.severity && <SeverityPill severity={detail.severity} />}
                  {detail.isSos && (
                    <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-[11px] font-bold text-red-700">
                      SOS
                    </span>
                  )}
                </div>

                <p className="whitespace-pre-wrap text-[13.5px] leading-relaxed text-slate-700">
                  {detail.description || "—"}
                </p>

                <div className="grid gap-2 rounded-xl bg-sand-50/80 p-3 text-[12.5px] text-slate-600 sm:grid-cols-2">
                  <p className="inline-flex items-center gap-1.5">
                    <MapPin size={13} className="text-slate-400" />
                    {[detail.place, detail.upazila, detail.district].filter(Boolean).join(", ") ||
                      "—"}
                  </p>
                  {detail.affected != null && (
                    <p className="inline-flex items-center gap-1.5">
                      <Users size={13} className="text-slate-400" />
                      ক্ষতিগ্রস্ত: <b>{bnNum(detail.affected)}</b> জন
                    </p>
                  )}
                  <p className="text-slate-400">
                    সময়: {clockBn(detail.incident_time || detail.time || detail.createdAt)}
                  </p>
                  {detail.latitude != null && detail.longitude != null && (
                    <p className="text-slate-400">
                      GPS: {detail.latitude}, {detail.longitude}
                    </p>
                  )}
                  {detail.reporter?.name && (
                    <p>
                      রিপোর্টার: <b className="text-slate-700">{detail.reporter.name}</b>
                    </p>
                  )}
                  {detail.reporterPhone && (
                    <p className="inline-flex items-center gap-1.5">
                      <Phone size={13} /> {detail.reporterPhone}
                    </p>
                  )}
                  {detail.reporterEmail && (
                    <p className="inline-flex items-center gap-1.5">
                      <Mail size={13} /> {detail.reporterEmail}
                    </p>
                  )}
                </div>

                <div>
                  <h4 className="mb-2 text-[13px] font-bold text-slate-700">প্রমাণ / Evidence</h4>
                  {!detail.evidence?.length ? (
                    <p className="rounded-xl border border-dashed border-slate-200 px-3 py-6 text-center text-[12.5px] text-slate-400">
                      কোনো ছবি/ভিডিও সংযুক্ত নেই
                    </p>
                  ) : (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {detail.evidence.map((ev, i) => {
                        const isImage =
                          ev.kind === "image" || /\.(jpe?g|png|gif|webp)$/i.test(ev.url || "");
                        const isVideo =
                          ev.kind === "video" || /\.(mp4|webm|mov)$/i.test(ev.url || "");
                        return (
                          <a
                            key={i}
                            href={ev.url}
                            target="_blank"
                            rel="noreferrer"
                            className="group relative overflow-hidden rounded-xl border border-slate-100 bg-slate-50"
                          >
                            {isImage ? (
                              <img
                                src={ev.url}
                                alt={ev.name || "evidence"}
                                className="h-28 w-full object-cover transition group-hover:opacity-90"
                              />
                            ) : isVideo ? (
                              <div className="flex h-28 flex-col items-center justify-center gap-1 text-slate-500">
                                <Film size={22} />
                                <span className="max-w-full truncate px-2 text-center text-[11px]">
                                  {ev.name || "ভিডিও"}
                                </span>
                              </div>
                            ) : (
                              <div className="flex h-28 flex-col items-center justify-center gap-1 text-slate-500">
                                <ImageIcon size={22} />
                                <span className="max-w-full truncate px-2 text-center text-[11px]">
                                  {ev.name || "ফাইল"}
                                </span>
                              </div>
                            )}
                            <span className="absolute bottom-1.5 right-1.5 rounded bg-black/50 p-1 text-white opacity-0 transition group-hover:opacity-100">
                              <ExternalLink size={12} />
                            </span>
                          </a>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {editId && (
        <EditReportModal
          reportId={editId}
          onClose={() => setEditId(null)}
          onSaved={() => (silentRefetch ? silentRefetch() : refetch())}
        />
      )}

      {volunteerDetailId && (
        <VolunteerReportDetailModal
          reportId={volunteerDetailId}
          onClose={() => setVolunteerDetailId(null)}
          onVerified={() => (silentRefetch ? silentRefetch() : refetch())}
        />
      )}
    </div>
  );
}