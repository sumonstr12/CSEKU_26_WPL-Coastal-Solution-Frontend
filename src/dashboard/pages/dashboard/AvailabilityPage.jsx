import { useState } from "react";
import { CircleCheck, Clock, Info, LifeBuoy, LoaderCircle, UserCheck, UserX } from "lucide-react";
import ErrorState from "../../components/dashboard/ErrorState";
import Panel, { PageHeader } from "../../components/dashboard/Panel";
import { PanelSkeleton } from "../../components/dashboard/Skeletons";
import { AVAILABILITY } from "../../config/roleConfig";
import { useAuth } from "../../context/AuthContext";
import { useDashboard } from "../../hooks/useDashboard";
import { dashboardService } from "../../services/dashboardService";
import { timeAgoBn } from "../../utils/format";
import { cn } from "../../utils/cn.js";

const OPTS = {
  AVAILABLE: { icon: UserCheck, desc: "জরুরি কার্যক্রমে নিয়োজিত হতে প্রস্তুত আছেন", box: "peer-checked:border-emerald-500 peer-checked:bg-emerald-50/50" },
  ON_MISSION: { icon: LifeBuoy, desc: "বর্তমানে কোনো মিশন/অভিযানে কাজ করছেন", box: "peer-checked:border-amber-500 peer-checked:bg-amber-50/50" },
  UNAVAILABLE: { icon: UserX, desc: "ব্যক্তিগত কারণে এখন কার্যক্রমে যোগ দিতে পারছেন না", box: "peer-checked:border-slate-400 peer-checked:bg-slate-50" },
};

export default function AvailabilityPage() {
  const { user, updateUser } = useAuth();
  const isResponder = user.role === "RESPONDER";
  const options = isResponder ? ["AVAILABLE", "ON_MISSION", "UNAVAILABLE"] : ["AVAILABLE", "UNAVAILABLE"];

  const [status, setStatus] = useState(user.availability || "AVAILABLE");
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState("");
  const { data: history, loading, error, refetch, silentRefetch } = useDashboard(dashboardService.getAvailabilityHistory, []);

  const save = async () => {
    setBusy(true);
    setSaved("");
    await dashboardService.setAvailability(user, status);
    updateUser({ availability: status });
    await silentRefetch();
    setSaved("Availability সফলভাবে আপডেট হয়েছে");
    setBusy(false);
    setTimeout(() => setSaved(""), 4000);
  };

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Availability ব্যবস্থাপনা"
        subtitle={isResponder ? "আপনার বর্তমান নিয়োগ অবস্থা — সমন্বয়কারীরা এটি দেখে মিশন বরাদ্দ করেন" : "আপনি স্বেচ্ছাসেবক কার্যক্রমে অংশ নেওয়ার জন্য উপলব্ধ কি না তা এখানে নির্ধারণ করুন"}
        crumbs="অ্যাকাউন্ট / Availability"
      />

      <Panel title="বর্তমান অবস্থা পরিবর্তন করুন" icon={UserCheck}>
        <div className={cn("grid gap-3", options.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2")}>
          {options.map((key) => {
            const o = OPTS[key];
            const a = AVAILABILITY[key];
            return (
              <label key={key} className="cursor-pointer">
                <input type="radio" name="availability" className="peer sr-only" checked={status === key} onChange={() => setStatus(key)} />
                <span className={cn("flex h-full flex-col gap-2.5 rounded-xl border-2 border-slate-100 p-4 transition hover:border-slate-200 active:scale-[0.98]", o.box)}>
                  <span className={cn("inline-flex h-10 w-10 items-center justify-center rounded-xl", status === key ? a.chip : "bg-slate-100 text-slate-400")}>
                    <o.icon size={19} />
                  </span>
                  <span>
                    <span className="block text-sm font-bold text-slate-700">{a.label}</span>
                    <span className="mt-0.5 block text-[11.5px] leading-snug text-slate-400">{o.desc}</span>
                  </span>
                </span>
              </label>
            );
          })}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button onClick={save} disabled={busy || status === (user.availability || "AVAILABLE")} className="btn-primary">
            {busy ? <LoaderCircle size={16} className="animate-spin" /> : <CircleCheck size={16} />}
            অবস্থা সংরক্ষণ করুন
          </button>
          {saved && (
            <span className="chip animate-fade-in bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
              <CircleCheck size={12} />
              {saved}
            </span>
          )}
        </div>

        <p className="mt-4 flex items-start gap-2 rounded-xl bg-sand-50 px-4 py-3 text-[12px] leading-relaxed text-sand-700">
          <Info size={14} className="mt-0.5 shrink-0" />
          "অনুপলব্ধ" অবস্থায় থাকলে নতুন মিশন বা সহায়তা অনুরোধ আপনাকে পাঠানো হবে না — তবে জরুরি সতর্কবার্তা সবসময়ই পাবেন।
        </p>
      </Panel>

      <div className="mt-6">
        <Panel title="সাম্প্রতিক পরিবর্তনসমূহ" icon={Clock}>
          {loading ? (
            <PanelSkeleton lines={3} />
          ) : error ? (
            <ErrorState onRetry={refetch} />
          ) : (
            <ol className="relative space-y-5 border-l-2 border-slate-100 pl-6">
              {history.map((h, i) => {
                const a = AVAILABILITY[h.status];
                return (
                  <li key={i} className="relative">
                    <span className={cn("absolute -left-[31px] top-1 h-3 w-3 rounded-full border-2 border-white shadow", a.dot)} />
                    <p className="text-sm font-bold text-slate-700">{a.label}</p>
                    <p className="text-[12px] text-slate-400">{h.note} • {timeAgoBn(h.time)}</p>
                  </li>
                );
              })}
            </ol>
          )}
        </Panel>
      </div>
    </div>
  );
}
