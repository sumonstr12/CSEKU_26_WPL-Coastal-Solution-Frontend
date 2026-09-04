import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  ChevronDown,
  Layers,
  ListFilter,
  MapPinned,
  RotateCcw,
} from "lucide-react";
import MapView from "@/components/MapView";
import PageHeader from "@/components/PageHeader";
import {
  DISASTER_REPORTS,
  DISASTER_TYPES,
  RISK_LEVELS,
} from "@/data/disasters";
import { DISTRICT_NAMES, findDistrict } from "@/data/districts";
import { RESCUE_TEAMS, RISK_ZONES } from "@/data/map";
import { SHELTERS } from "@/data/shelters";
import { bn, classNames } from "@/lib/utils";
const DOT = {
  critical: "bg-red-600",
  high: "bg-orange-600",
  moderate: "bg-amber-500",
  low: "bg-emerald-600",
};
const TIME_OPTIONS = [
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
const selectCls = "input w-full";
export default function DisasterMap() {
  const location = useLocation();
  const preselectedDistrict = location.state?.district ?? "all";
  const [layers, setLayers] = useState({
    reports: true,
    shelters: true,
    rescues: true,
    zones: true,
  });
  const [district, setDistrict] = useState(preselectedDistrict);
  const [risk, setRisk] = useState("all");
  const [typeKey, setTypeKey] = useState("all");
  const [time, setTime] = useState("all");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const focus = useMemo(() => {
    if (district === "all") return null;
    const d = findDistrict(district);
    return d
      ? {
          center: [d.lat, d.lng],
          zoom: 10,
        }
      : null;
  }, [district]);
  const reports = useMemo(
    () =>
      DISASTER_REPORTS.filter((r) => {
        if (district !== "all" && r.district !== district) return false;
        if (risk !== "all" && r.severity !== risk) return false;
        if (typeKey !== "all" && r.typeKey !== typeKey) return false;
        if (time !== "all" && r.daysAgo > Number(time)) return false;
        return true;
      }),
    [district, risk, typeKey, time],
  );
  const zones = useMemo(
    () =>
      RISK_ZONES.filter((z) => {
        if (district !== "all" && z.district !== district) return false;
        if (risk !== "all" && z.risk !== risk) return false;
        return true;
      }),
    [district, risk],
  );
  const shelters = useMemo(
    () =>
      district === "all"
        ? SHELTERS
        : SHELTERS.filter((s) => s.district === district),
    [district],
  );
  const visibleMarkers =
    (layers.reports ? reports.length : 0) +
    (layers.shelters ? shelters.length : 0) +
    (layers.rescues ? RESCUE_TEAMS.length : 0);
  const reset = () => {
    setLayers({
      reports: true,
      shelters: true,
      rescues: true,
      zones: true,
    });
    setDistrict("all");
    setRisk("all");
    setTypeKey("all");
    setTime("all");
  };
  const filterBody = (
    <div className="space-y-5">
      <fieldset>
        <legend className="flex items-center gap-1.5 text-[13px] font-bold text-ink-900">
          <Layers className="h-4 w-4 text-teal-700" aria-hidden="true" />
          মানচিত্রের স্তর
        </legend>
        <div className="mt-2.5 space-y-2">
          {[
            ["reports", "নাগরিক রিপোর্ট ও ঘটনা", "bg-red-500"],
            ["shelters", "আশ্রয়কেন্দ্র", "bg-teal-700"],
            ["rescues", "উদ্ধারকারী দল", "bg-blue-700"],
            ["zones", "ঝুঁকিঅঞ্চল", "bg-amber-500"],
          ].map(([key, label, dot]) => (
            <label
              key={key}
              className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-[13.5px] font-medium text-ink-700 transition hover:bg-sand-50"
            >
              <input
                type="checkbox"
                className="control-check"
                checked={layers[key]}
                onChange={(e) =>
                  setLayers((l) => ({
                    ...l,
                    [key]: e.target.checked,
                  }))
                }
              />
              <span
                className={classNames("h-2.5 w-2.5 rounded-full", dot)}
                aria-hidden="true"
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="m-district" className="label">
          জেলা
        </label>
        <select
          id="m-district"
          className={selectCls}
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
        >
          <option value="all">সব জেলা (সম্পূর্ণ উপকূল)</option>
          {DISTRICT_NAMES.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="m-type" className="label">
          দুর্যোগের ধরন
        </label>
        <select
          id="m-type"
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
        <label htmlFor="m-risk" className="label">
          ঝুঁকির মাত্রা
        </label>
        <select
          id="m-risk"
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
        <label htmlFor="m-time" className="label">
          সময়
        </label>
        <select
          id="m-time"
          className={selectCls}
          value={time}
          onChange={(e) => setTime(e.target.value)}
        >
          {TIME_OPTIONS.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        onClick={reset}
        className="btn btn-outline w-full !py-2.5"
      >
        <RotateCcw className="h-4 w-4" aria-hidden="true" />
        ফিল্টার রিসেট
      </button>

      <div className="rounded-xl bg-sand-50 p-3.5 ring-1 ring-black/5 ring-inset">
        <p className="text-[12px] font-bold tracking-wide text-ink-500">
          চিহ্নের ব্যাখ্যা
        </p>
        <ul className="mt-2 space-y-1.5 text-[12px] text-ink-700">
          {RISK_LEVELS.map((r) => (
            <li key={r.key} className="flex items-center gap-2">
              <span
                className={classNames("h-2.5 w-2.5 rounded-full", DOT[r.key])}
                aria-hidden="true"
              />
              ঘটনা: {r.label}
            </li>
          ))}
          <li className="flex items-center gap-2">
            <span
              className="inline-block h-3 w-3 rounded-[4px] bg-teal-700"
              aria-hidden="true"
            />
            আশ্রয়কেন্দ্র
          </li>
          <li className="flex items-center gap-2">
            <span
              className="inline-block h-3 w-3 rounded-[4px] bg-blue-700"
              aria-hidden="true"
            />
            উদ্ধারকারী দল
          </li>
        </ul>
      </div>
    </div>
  );
  return (
    <>
      <PageHeader
        eyebrow="ইন্টারঅ্যাকটিভ মানচিত্র"
        title="দুর্যোগ মানচিত্র"
        description="উপকূলীয় বাংলাদেশের ঝুঁকিঅঞ্চল, সক্রিয় ঘটনা, আশ্রয়কেন্দ্র ও উদ্ধার ইউনিটের অবস্থান — মার্কারে চাপ দিয়ে বিস্তারিত জানুন।"
      >
        <p className="chip border-black/5 bg-sand-50 text-ink-700">
          <MapPinned className="h-3.5 w-3.5 text-teal-700" aria-hidden="true" />
          {bn(visibleMarkers)}টি পয়েন্ট দৃশ্যমান
        </p>
      </PageHeader>

      <div className="site-container py-6 md:py-8">
        {/* Mobile filter toggle */}
        <button
          type="button"
          className="btn btn-outline mb-4 w-full !justify-between lg:hidden"
          onClick={() => setFiltersOpen((v) => !v)}
          aria-expanded={filtersOpen}
        >
          <span className="inline-flex items-center gap-2">
            <ListFilter className="h-4.5 w-4.5" aria-hidden="true" />
            মানচিত্র ফিল্টার
          </span>
          <ChevronDown
            className={classNames(
              "h-4.5 w-4.5 transition-transform",
              filtersOpen && "rotate-180",
            )}
            aria-hidden="true"
          />
        </button>

        <div className="grid gap-5 lg:grid-cols-[300px_1fr]">
          <aside
            className={classNames(
              "card h-fit p-5 lg:sticky lg:top-28",
              !filtersOpen && "hidden lg:block",
            )}
          >
            {filterBody}
          </aside>

          <div className="card overflow-hidden p-2 shadow-md">
            <MapView
              className="h-[480px] w-full overflow-hidden rounded-xl lg:h-[620px]"
              reports={layers.reports ? reports : []}
              shelters={layers.shelters ? shelters : []}
              rescues={layers.rescues ? RESCUE_TEAMS : []}
              zones={layers.zones ? zones : []}
              focus={focus}
            />
          </div>
        </div>

        <p className="mt-4 text-center text-[12px] text-ink-300">
          মানচিত্র তথ্য: গত ৩০ দিনের যাচাইকৃত রিপোর্ট, আশ্রয়কেন্দ্র রেজিস্ট্রি
          ও ঝুঁকি মূল্যায়ন মডেল — ডেমো ডেটা সহ।
        </p>
      </div>
    </>
  );
}
