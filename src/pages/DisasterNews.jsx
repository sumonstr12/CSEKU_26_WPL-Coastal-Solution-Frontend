import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle2,
  Clock,
  FileSearch,
  Landmark,
  ListFilter,
  MapPin,
  MapPinned,
  RotateCcw,
  ShieldCheck,
  Tent,
  Users,
} from "lucide-react";
import DisasterCard from "@/components/DisasterCard";
import Modal from "@/components/Modal";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import { RiskBadge, StatusBadge } from "@/components/RiskBadge";
import {
  DISASTER_REPORTS,
  DISASTER_TYPES,
  RISK_LEVELS,
  disasterTypeLabel,
} from "@/data/disasters";
import { DISTRICT_NAMES, findDistrict } from "@/data/districts";
import { bn, classNames } from "@/lib/utils";
const TIME_FILTERS = [
  {
    value: "all",
    label: "সব সময়",
  },
  {
    value: "1",
    label: "সর্বশেষ ২৪ ঘণ্টা",
  },
  {
    value: "7",
    label: "সর্বশেষ ৭ দিন",
  },
  {
    value: "30",
    label: "সর্বশেষ ৩০ দিন",
  },
];
const selectCls =
  "input appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%23788499%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22%3E%3Cpath d=%22m6 9 6 6 6-6%22/%3E%3C/svg%3E')] bg-[length:16px] bg-[right_0.75rem_center] bg-no-repeat pr-9";
export default function DisasterNews() {
  const [district, setDistrict] = useState("all");
  const [typeKey, setTypeKey] = useState("all");
  const [risk, setRisk] = useState("all");
  const [time, setTime] = useState("all");
  const [selected, setSelected] = useState(null);
  const filtered = useMemo(() => {
    return DISASTER_REPORTS.filter((report) => {
      if (district !== "all" && report.district !== district) return false;
      if (typeKey !== "all" && report.typeKey !== typeKey) return false;
      if (risk !== "all" && report.severity !== risk) return false;
      if (time !== "all" && report.daysAgo > Number(time)) return false;
      return true;
    });
  }, [district, typeKey, risk, time]);
  const hasFilter =
    district !== "all" || typeKey !== "all" || risk !== "all" || time !== "all";
  const reset = () => {
    setDistrict("all");
    setTypeKey("all");
    setRisk("all");
    setTime("all");
  };
  return (
    <>
      <PageHeader
        eyebrow="লাইভ আপডেট"
        title="দুর্যোগের খবর"
        description="যাচাইকৃত নাগরিক রিপোর্ট ও সরকারি বুলেটিন থেকে সংকলিত উপকূলীয় অঞ্চলের সর্বশেষ দুর্যোগ পরিস্থিতি। ফিল্টার ব্যবহার করে নিজের জেলা বা ধরন অনুযায়ী খুঁজুন।"
      >
        <p className="chip border-black/5 bg-sand-50 text-ink-700">
          <span
            className="h-2 w-2 animate-pulse-dot rounded-full bg-emerald-500"
            aria-hidden="true"
          />
          {bn(DISASTER_REPORTS.filter((r) => r.status === "active").length)}টি
          সক্রিয় ঘটনা এখন
        </p>
      </PageHeader>

      <div className="site-container py-8 md:py-10">
        {/* Filter panel */}
        <Reveal>
          <form
            className="card grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1fr_auto] sm:p-5"
            onSubmit={(e) => e.preventDefault()}
            aria-label="খবর ফিল্টার"
          >
            <div>
              <label htmlFor="f-district" className="label">
                জেলা
              </label>
              <select
                id="f-district"
                className={selectCls}
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
              >
                <option value="all">সব জেলা</option>
                {DISTRICT_NAMES.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="f-type" className="label">
                দুর্যোগের ধরন
              </label>
              <select
                id="f-type"
                className={selectCls}
                value={typeKey}
                onChange={(e) => setTypeKey(e.target.value)}
              >
                <option value="all">সব ধরন</option>
                {DISASTER_TYPES.map((t) => (
                  <option key={t.key} value={t.key}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="f-risk" className="label">
                ঝুঁকির মাত্রা
              </label>
              <select
                id="f-risk"
                className={selectCls}
                value={risk}
                onChange={(e) => setRisk(e.target.value)}
              >
                <option value="all">সব মাত্রা</option>
                {RISK_LEVELS.map((r) => (
                  <option key={r.key} value={r.key}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="f-time" className="label">
                সময়
              </label>
              <select
                id="f-time"
                className={selectCls}
                value={time}
                onChange={(e) => setTime(e.target.value)}
              >
                {TIME_FILTERS.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                type="button"
                onClick={reset}
                disabled={!hasFilter}
                className="btn btn-outline w-full !px-3 lg:w-auto"
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                রিসেট
              </button>
            </div>
          </form>
        </Reveal>

        <div className="mt-6 flex items-center justify-between">
          <p
            className="inline-flex items-center gap-2 text-[13.5px] font-semibold text-ink-500"
            aria-live="polite"
          >
            <ListFilter className="h-4 w-4 text-teal-700" aria-hidden="true" />
            {bn(filtered.length)}টি রিপোর্ট পাওয়া গেছে
            {hasFilter && " (ফিল্টার প্রয়োগ করা)"}
          </p>
        </div>

        {filtered.length > 0 ? (
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((report, i) => (
              <Reveal
                key={report.id}
                delay={Math.min(i, 5) * 60}
                className="h-full"
              >
                <DisasterCard report={report} onView={setSelected} />
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="card mt-5 flex flex-col items-center px-6 py-16 text-center">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-sand-100 text-ink-300">
              <FileSearch className="h-7 w-7" aria-hidden="true" />
            </span>
            <h3 className="mt-4 text-lg font-bold text-ink-900">
              কোনো ফলাফল পাওয়া যায়নি
            </h3>
            <p className="mt-1.5 max-w-sm text-sm text-ink-500">
              নির্বাচিত ফিল্টারের সাথে মিলে এমন কোনো রিপোর্ট নেই। ফিল্টার
              পরিবর্তন করে আবার চেষ্টা করুন।
            </p>
            <button
              type="button"
              onClick={reset}
              className="btn btn-primary mt-5"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              ফিল্টার রিসেট করুন
            </button>
          </div>
        )}
      </div>

      {/* Detail modal */}
      <Modal
        open={selected !== null}
        onClose={() => setSelected(null)}
        label="দুর্যোগ রিপোর্টের বিস্তারিত"
        wide
      >
        {selected && (
          <article>
            <div className="relative h-52 overflow-hidden sm:h-60">
              <img
                src={selected.image}
                alt={selected.imageAlt}
                className="h-full w-full object-cover"
              />
              <div
                className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/55 to-transparent"
                aria-hidden="true"
              />
              <div className="absolute bottom-3 left-4 flex flex-wrap gap-2">
                <RiskBadge level={selected.severity} />
                <StatusBadge status={selected.status} />
                <span className="chip border-white/30 bg-black/30 text-white backdrop-blur-sm">
                  {disasterTypeLabel(selected.typeKey)}
                </span>
              </div>
            </div>

            <div className="p-5 sm:p-7">
              <h2 className="font-display pr-10 text-xl leading-snug font-bold text-ink-950 sm:text-2xl">
                {selected.title}
              </h2>
              <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-ink-500">
                <span className="inline-flex items-center gap-1.5 font-bold text-ink-700">
                  <MapPin
                    className="h-4 w-4 text-teal-700"
                    aria-hidden="true"
                  />
                  {selected.district} • {selected.upazila}
                </span>
                <span>{selected.place}</span>
              </p>
              <p className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12.5px] text-ink-500">
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                  {selected.date} — {selected.time}
                </span>
                <span className="font-mono text-[12px] tracking-wide text-ink-300">
                  {selected.refCode}
                </span>
              </p>

              <div className="mt-5 border-t border-stone-100 pt-5">
                <h3 className="text-[14px] font-bold text-ink-900">
                  ঘটনার বিবরণ
                </h3>
                <p className="mt-2 text-[14px] leading-relaxed text-ink-700">
                  {selected.details}
                </p>
              </div>

              <dl className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl bg-sand-50 p-3 ring-1 ring-black/5 ring-inset">
                  <dt className="flex items-center gap-1.5 text-[11.5px] font-bold text-ink-500">
                    <Users className="h-3.5 w-3.5" aria-hidden="true" />
                    ক্ষতির চিত্র
                  </dt>
                  <dd className="mt-1 text-[13px] leading-snug font-semibold text-ink-900">
                    {selected.affected}
                  </dd>
                </div>
                <div className="rounded-xl bg-sand-50 p-3 ring-1 ring-black/5 ring-inset">
                  <dt className="flex items-center gap-1.5 text-[11.5px] font-bold text-ink-500">
                    <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                    যাচাইকারী
                  </dt>
                  <dd className="mt-1 text-[13px] leading-snug font-semibold text-ink-900">
                    {selected.verifiedBy}
                  </dd>
                </div>
                <div className="rounded-xl bg-sand-50 p-3 ring-1 ring-black/5 ring-inset">
                  <dt className="flex items-center gap-1.5 text-[11.5px] font-bold text-ink-500">
                    <Landmark className="h-3.5 w-3.5" aria-hidden="true" />
                    তথ্যসূত্র
                  </dt>
                  <dd className="mt-1 text-[13px] leading-snug font-semibold text-ink-900">
                    {selected.source}
                  </dd>
                </div>
              </dl>

              <div className="mt-5 rounded-xl border border-teal-600/20 bg-teal-50/60 p-4">
                <h3 className="text-[14px] font-bold text-teal-900">
                  এই অবস্থায় আপনার করণীয়
                </h3>
                <ul className="mt-2.5 space-y-2">
                  {selected.tips.map((tip) => (
                    <li
                      key={tip}
                      className="flex items-start gap-2 text-[13.5px] leading-relaxed text-ink-700"
                    >
                      <CheckCircle2
                        className="mt-0.5 h-4 w-4 shrink-0 text-teal-700"
                        aria-hidden="true"
                      />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
                <Link
                  to="/shelters"
                  className="btn btn-primary flex-1"
                  onClick={() => setSelected(null)}
                >
                  <Tent className="h-4 w-4" aria-hidden="true" />
                  আশেপাশের আশ্রয়কেন্দ্র
                </Link>
                <Link
                  to="/map"
                  className={classNames("btn btn-outline flex-1")}
                  state={{
                    district: findDistrict(selected.district)?.name,
                  }}
                  onClick={() => setSelected(null)}
                >
                  <MapPinned className="h-4 w-4" aria-hidden="true" />
                  মানচিত্রে দেখুন
                </Link>
              </div>
            </div>
          </article>
        )}
      </Modal>
    </>
  );
}
