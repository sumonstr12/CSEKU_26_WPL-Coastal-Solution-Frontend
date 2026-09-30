import { useMemo, useState } from "react";
import { Bell, BellOff, CheckCheck, CircleCheck, FileText, LifeBuoy, Server, TriangleAlert, Warehouse } from "lucide-react";
import ErrorState from "../../components/dashboard/ErrorState";
import Panel, { PageHeader } from "../../components/dashboard/Panel";
import EmptyState from "../../components/dashboard/EmptyState";
import { PanelSkeleton } from "../../components/dashboard/Skeletons";
import { useAuth } from "../../context/AuthContext";
import { useDashboard } from "../../hooks/useDashboard";
import { dashboardService } from "../../services/dashboardService";
import { bn, timeAgoBn } from "../../utils/format";
import { cn } from "../../utils/cn.js";

const KIND = {
  alert: { icon: TriangleAlert, box: "bg-amber-50 text-amber-600" },
  report: { icon: FileText, box: "bg-lagoon-50 text-lagoon-600" },
  shelter: { icon: Warehouse, box: "bg-sky-50 text-sky-600" },
  mission: { icon: LifeBuoy, box: "bg-orange-50 text-orange-600" },
  verification: { icon: CircleCheck, box: "bg-emerald-50 text-emerald-600" },
  system: { icon: Server, box: "bg-slate-100 text-slate-500" },
};

export default function NotificationsPage() {
  const { user } = useAuth();
  const { data, loading, error, refetch, setData } = useDashboard(() => dashboardService.getNotifications(user.role), [user.role]);
  const [tab, setTab] = useState("ALL");

  const items = useMemo(() => {
    const rows = data || [];
    if (tab === "UNREAD") return rows.filter((n) => !n.read);
    if (tab === "READ") return rows.filter((n) => n.read);
    return rows;
  }, [data, tab]);

  const unreadCount = (data || []).filter((n) => !n.read).length;

  const markAllRead = async () => {
    await dashboardService.markAllNotificationsRead(user.role);
    setData((rows) => rows.map((n) => ({ ...n, read: true })));
  };

  const toggleRead = (id) => setData((rows) => rows.map((n) => (n.id === id ? { ...n, read: !n.read } : n)));

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="বিজ্ঞপ্তি" subtitle="আপনার কার্যক্রম ও এলাকার গুরুত্বপূর্ণ আপডেটসমূহ" crumbs="অ্যাকাউন্ট / বিজ্ঞপ্তি">
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="btn-secondary">
            <CheckCheck size={15} />
            সব পঠিত হিসেবে চিহ্নিত করুন
          </button>
        )}
      </PageHeader>

      <div className="mb-5 flex gap-1.5">
        {[
          { key: "ALL", label: "সব" },
          { key: "UNREAD", label: `অপঠিত${unreadCount ? ` (${bn(unreadCount)})` : ""}` },
          { key: "READ", label: "পঠিত" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-[12.5px] font-bold transition active:scale-95",
              tab === t.key ? "bg-lagoon-600 text-white shadow-sm shadow-lagoon-600/25" : "bg-white text-slate-500 ring-1 ring-slate-200 hover:text-lagoon-700 hover:ring-lagoon-300"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <PanelSkeleton lines={5} />
      ) : error ? (
        <ErrorState onRetry={refetch} />
      ) : items.length === 0 ? (
        <div className="card">
          <EmptyState icon={BellOff} title="কোনো বিজ্ঞপ্তি নেই" message={tab === "UNREAD" ? "সব বিজ্ঞপ্তি পঠিত হয়েছে। আপনি একদম আপ-টু-ডেট!" : "নতুন আপডেট এলে এখানে দেখাবে।"} />
        </div>
      ) : (
        <Panel noPadding bodyClassName="divide-y divide-slate-50">
          {items.map((n) => {
            const k = KIND[n.kind] || KIND.system;
            return (
              <button key={n.id} onClick={() => toggleRead(n.id)} className={cn("flex w-full items-start gap-3.5 px-5 py-4 text-left transition hover:bg-lagoon-50/40", !n.read && "bg-lagoon-50/30")}>
                <span className={cn("inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", k.box)}>
                  <k.icon size={18} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className={cn("truncate text-sm font-bold", n.read ? "text-slate-600" : "text-slate-800")}>{n.title}</span>
                    {!n.read && <span className="h-2 w-2 shrink-0 rounded-full bg-lagoon-500" />}
                  </span>
                  <span className="mt-0.5 block text-[12.5px] leading-relaxed text-slate-500">{n.body}</span>
                  <span className="mt-1 block text-[11px] font-medium text-slate-400">{timeAgoBn(n.time)}</span>
                </span>
                <Bell size={14} className={cn("mt-1 shrink-0", n.read ? "text-slate-200" : "text-lagoon-500")} />
              </button>
            );
          })}
        </Panel>
      )}
    </div>
  );
}
