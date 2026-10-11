import { useEffect, useState } from "react";
import {
  BadgeCheck,
  ExternalLink,
  Film,
  Image as ImageIcon,
  Loader2,
  MapPin,
  Phone,
  Users,
  X,
} from "lucide-react";
import { SeverityPill, StatusPill } from "../ui/Badge";
import { dashboardService } from "../../services/dashboardService";
import { bnNum, clockBn } from "../../utils/format";

/**
 * Volunteer opens a report → sees full detail + Supabase image/video links,
 * then can VERIFY (creates rescue op + notifies district volunteers) or REJECT.
 */
export default function VolunteerReportDetailModal({
  reportId,
  onClose,
  onVerified,
}) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const d = await dashboardService.getVolunteerReportDetail(reportId);
        if (!cancelled) setDetail(d);
      } catch (err) {
        if (!cancelled) {
          const status = err?.response?.status;
          const apiDetail =
            err?.response?.data?.detail ||
            err?.response?.data?.message ||
            err?.message;
          setError(
            status
              ? `লোড ব্যর্থ (${status}): ${apiDetail || "বিস্তারিত পাওয়া যায়নি"}`
              : apiDetail || "বিস্তারিত লোড করা যায়নি — নেটওয়ার্ক/API চেক করুন"
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [reportId]);

  const act = async (action) => {
    setBusy(true);
    setMsg("");
    try {
      const res = await dashboardService.verifyReport(reportId, action);
      if (action === "VERIFY") {
        setMsg(
          res?.message ||
            "যাচাই সম্পন্ন। অফিসার ইভেন্ট ঘোষণা করলে আপনি উদ্ধার অভিযানে অংশ নিতে পারবেন।"
        );
      } else {
        setMsg("রিপোর্ট বাতিল করা হয়েছে।");
      }
      onVerified?.(action, res);
      setTimeout(() => onClose?.(), 1200);
    } catch (err) {
      setMsg(err?.response?.data?.detail || "অ্যাকশন ব্যর্থ");
    } finally {
      setBusy(false);
    }
  };

  const statusUp = String(detail?.status || "").toUpperCase();
  const canVerify =
    detail?.canVerify === true ||
    statusUp === "PENDING" ||
    statusUp === "SUBMITTED" ||
    statusUp === "UNDER_REVIEW";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-3 sm:p-6">
      <div className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-3.5">
          <div>
            <h3 className="text-base font-bold text-slate-800">
              {loading ? "লোড হচ্ছে..." : detail?.title || `রিপোর্ট #${reportId}`}
            </h3>
            <p className="mt-0.5 text-[12px] text-slate-400">আইডি: {reportId}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-16 text-slate-400">
              <Loader2 className="h-5 w-5 animate-spin" /> লোড হচ্ছে…
            </div>
          ) : error ? (
            <p className="text-sm font-semibold text-red-600">{error}</p>
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
                  {[detail.place || detail.village, detail.upazila, detail.district]
                    .filter(Boolean)
                    .join(", ") || "—"}
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
                {detail.situation && (
                  <p>
                    পরিস্থিতি: <b className="text-slate-700">{detail.situation}</b>
                  </p>
                )}
              </div>

              {/* Evidence — Supabase public URLs */}
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
                        ev.kind === "image" ||
                        /\.(jpe?g|png|gif|webp|bmp)(\?|$)/i.test(ev.url || "");
                      const isVideo =
                        ev.kind === "video" ||
                        /\.(mp4|webm|mov|avi)(\?|$)/i.test(ev.url || "");
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
                              <span className="max-w-full truncate px-2 text-[11px]">
                                {ev.name || "ভিডিও"}
                              </span>
                              <span className="text-[10px] text-lagoon-600">ক্লিক করে দেখুন</span>
                            </div>
                          ) : (
                            <div className="flex h-28 flex-col items-center justify-center gap-1 text-slate-500">
                              <ImageIcon size={22} />
                              <span className="max-w-full truncate px-2 text-[11px]">
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

              {msg && (
                <p className="rounded-xl border border-lagoon-200 bg-lagoon-50 px-3 py-2 text-[12.5px] font-semibold text-lagoon-800">
                  {msg}
                </p>
              )}
            </div>
          )}
        </div>

        {!loading && !error && (
          <div className="flex flex-col gap-2 border-t border-slate-100 px-5 py-3.5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={busy}
              className="btn-secondary px-4 py-2 text-[13px] font-bold"
            >
              বন্ধ করুন
            </button>
            {canVerify && (
              <>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => act("REJECT")}
                  className="btn bg-white px-4 py-2 text-[13px] font-bold text-slate-600 ring-1 ring-slate-200 hover:text-red-600 hover:ring-red-200 disabled:opacity-60"
                >
                  বাতিল / প্রত্যাখ্যান
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => act("VERIFY")}
                  className="btn inline-flex items-center justify-center gap-1.5 bg-emerald-500 px-4 py-2 text-[13px] font-bold text-white hover:bg-emerald-600 disabled:opacity-60"
                >
                  {busy ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : (
                    <BadgeCheck size={15} />
                  )}
                  যাচাই করুন
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}