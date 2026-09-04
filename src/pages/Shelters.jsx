import { useMemo, useState } from "react";
import {
  CircleAlert,
  LocateFixed,
  Map as MapIcon,
  RotateCcw,
  Search,
  Tent,
} from "lucide-react";
import MapView from "@/components/MapView";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import ShelterCard from "@/components/ShelterCard";
import { DISTRICT_NAMES } from "@/data/districts";
import { SHELTERS } from "@/data/shelters";
import { bn, classNames, distanceKm } from "@/lib/utils";
export default function Shelters() {
  const [query, setQuery] = useState("");
  const [district, setDistrict] = useState("all");
  const [status, setStatus] = useState("all");
  const [showMap, setShowMap] = useState(false);
  const [near, setNear] = useState(null);
  const [geoError, setGeoError] = useState(null);
  const [locating, setLocating] = useState(false);
  const filtered = useMemo(() => {
    let list = SHELTERS.filter((shelter) => {
      if (district !== "all" && shelter.district !== district) return false;
      if (status !== "all" && shelter.status !== status) return false;
      if (query.trim()) {
        const q = query.trim();
        const haystack = `${shelter.name} ${shelter.district} ${shelter.upazila} ${shelter.address}`;
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
    if (near) {
      list = [...list].sort(
        (a, b) => (near[a.id] ?? 9999) - (near[b.id] ?? 9999),
      );
    }
    return list;
  }, [query, district, status, near]);
  const locateMe = () => {
    setGeoError(null);
    if (!navigator.geolocation) {
      setGeoError(
        "আপনার ব্রাউজার অবস্থান শেয়ার সমর্থন করে না — জেলা নির্বাচন করে খুঁজুন।",
      );
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const me = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        const next = {};
        SHELTERS.forEach((shelter) => {
          next[shelter.id] =
            Math.round(
              distanceKm(me, {
                lat: shelter.lat,
                lng: shelter.lng,
              }) * 10,
            ) / 10;
        });
        setNear(next);
        setLocating(false);
      },
      () => {
        setGeoError(
          "অবস্থানের অনুমতি দেওয়া হয়নি — নিচে জেলা নির্বাচন করে আশ্রয়কেন্দ্র খুঁজুন।",
        );
        setLocating(false);
      },
      {
        timeout: 9000,
      },
    );
  };
  const clearNear = () => {
    setNear(null);
    setGeoError(null);
  };
  const nearDisplayed = near ? filtered.slice(0, 3) : [];
  const totalCapacity = SHELTERS.reduce((sum, s) => sum + s.capacity, 0);
  return (
    <>
      <PageHeader
        eyebrow="নিরাপদ আশ্রয়"
        title="আশ্রয়কেন্দ্র খুঁজুন"
        description="উপকূলীয় ১১ জেলার সরকারি ও বহুমুখী আশ্রয়কেন্দ্রের সার্চযোগ্য তালিকা — ধারণক্ষমতা, বর্তমান অবস্থা ও সুবিধাসমূহ একসাথে দেখুন।"
      >
        <p className="chip border-black/5 bg-sand-50 text-ink-700">
          <Tent className="h-3.5 w-3.5 text-teal-700" aria-hidden="true" />
          মোট ধারণক্ষমতা {bn(totalCapacity.toLocaleString("en-IN"))}+ জন
        </p>
      </PageHeader>

      <div className="site-container py-8 md:py-10">
        {/* Controls */}
        <Reveal>
          <div className="card space-y-4 p-4 sm:p-5">
            <div className="grid gap-3 lg:grid-cols-[1fr_210px_190px]">
              <div className="relative">
                <label htmlFor="s-query" className="sr-only">
                  নাম বা ঠিকানা দিয়ে খুঁজুন
                </label>
                <Search
                  className="pointer-events-none absolute top-1/2 left-3.5 h-4.5 w-4.5 -translate-y-1/2 text-ink-300"
                  aria-hidden="true"
                />
                <input
                  id="s-query"
                  type="search"
                  className="input !pl-10"
                  placeholder="আশ্রয়কেন্দ্রের নাম, জেলা বা ঠিকানা লিখে খুঁজুন…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="s-district" className="sr-only">
                  জেলা
                </label>
                <select
                  id="s-district"
                  className="input"
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
                <label htmlFor="s-status" className="sr-only">
                  বর্তমান অবস্থা
                </label>
                <select
                  id="s-status"
                  className="input"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="all">সব অবস্থা</option>
                  <option value="খোলা">খোলা</option>
                  <option value="প্রস্তুত">প্রস্তুত</option>
                  <option value="সীমিত">সীমিত</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 border-t border-stone-100 pt-4 sm:flex-row">
              <button
                type="button"
                onClick={locateMe}
                disabled={locating}
                className="btn btn-primary !py-2.5"
              >
                <LocateFixed
                  className={classNames(
                    "h-4.5 w-4.5",
                    locating && "animate-spin",
                  )}
                  aria-hidden="true"
                />
                {locating
                  ? "অবস্থান খোঁজা হচ্ছে…"
                  : "আমার কাছাকাছি আশ্রয়কেন্দ্র"}
              </button>
              <button
                type="button"
                onClick={() => setShowMap((v) => !v)}
                aria-expanded={showMap}
                className="btn btn-outline !py-2.5"
              >
                <MapIcon className="h-4.5 w-4.5" aria-hidden="true" />
                {showMap ? "মানচিত্র লুকান" : "মানচিত্রে দেখুন"}
              </button>
              {near && (
                <button
                  type="button"
                  onClick={clearNear}
                  className="btn btn-ghost !py-2.5 text-ink-500"
                >
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                  কাছাকাছি মোড বন্ধ
                </button>
              )}
            </div>

            {geoError && (
              <p
                className="flex items-start gap-2 rounded-xl bg-amber-50 px-3.5 py-2.5 text-[13px] font-medium text-amber-800 ring-1 ring-amber-200 ring-inset"
                role="alert"
              >
                <CircleAlert
                  className="mt-0.5 h-4 w-4 shrink-0"
                  aria-hidden="true"
                />
                {geoError}
              </p>
            )}
          </div>
        </Reveal>

        {/* Nearby summary */}
        {near && nearDisplayed.length > 0 && (
          <Reveal className="mt-5">
            <div className="rounded-2xl border border-teal-600/20 bg-teal-50/70 p-4">
              <p className="text-[13.5px] font-bold text-teal-900">
                আপনার অবস্থানের কাছাকাছি ৩টি আশ্রয়কেন্দ্র সবার উপরে দেখানো
                হচ্ছে (আনুমানিক সরলরৈখিক দূরত্ব)।
              </p>
              <p className="mt-1 text-[12.5px] text-teal-800/80">
                যাওয়ার আগে অবশ্যই যোগাযোগ নম্বরে ফোন করে অবস্থা নিশ্চিত করুন।
              </p>
            </div>
          </Reveal>
        )}

        {/* Map */}
        {showMap && (
          <Reveal className="mt-5">
            <div className="card overflow-hidden p-2">
              <MapView
                className="h-[380px] w-full overflow-hidden rounded-xl sm:h-[430px]"
                shelters={filtered}
                zones={[]}
              />
            </div>
          </Reveal>
        )}

        {/* Results */}
        <p
          className="mt-6 text-[13.5px] font-semibold text-ink-500"
          aria-live="polite"
        >
          {bn(filtered.length)}টি আশ্রয়কেন্দ্র পাওয়া গেছে
        </p>
        {filtered.length > 0 ? (
          <div className="mt-4 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((shelter, i) => (
              <Reveal
                key={shelter.id}
                delay={Math.min(i, 5) * 60}
                className="h-full"
              >
                <ShelterCard
                  shelter={shelter}
                  distanceKm={near?.[shelter.id]}
                />
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="card mt-4 flex flex-col items-center px-6 py-14 text-center">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-sand-100 text-ink-300">
              <Tent className="h-7 w-7" aria-hidden="true" />
            </span>
            <h3 className="mt-4 text-lg font-bold text-ink-900">
              কোনো আশ্রয়কেন্দ্র পাওয়া যায়নি
            </h3>
            <p className="mt-1.5 max-w-sm text-sm text-ink-500">
              অন্য নাম, জেলা বা অবস্থা দিয়ে আবার চেষ্টা করুন।
            </p>
            <button
              type="button"
              className="btn btn-primary mt-5"
              onClick={() => {
                setQuery("");
                setDistrict("all");
                setStatus("all");
                clearNear();
              }}
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              সব দেখুন
            </button>
          </div>
        )}

        {/* guidance */}
        <Reveal className="mt-10">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="card p-5">
              <h3 className="text-[15px] font-bold text-ink-950">
                আশ্রয়কেন্দ্রে যাওয়ার আগে
              </h3>
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[13.5px] leading-relaxed text-ink-700 marker:text-teal-700">
                <li>কেন্দ্রটি খোলা আছে কিনা ফোনে নিশ্চিত হন</li>
                <li>জরুরি ব্যাগ, খাবার-পানি ও প্রয়োজনীয় ওষুধ সঙ্গে নিন</li>
                <li>নারী-শিশু ও প্রতিবন্ধী সদস্যদের আগে পাঠান</li>
                <li>গবাদিপশুর জন্য আলাদা ব্যবস্থা সম্পর্কে জেনে নিন</li>
              </ul>
            </div>
            <div className="card p-5">
              <h3 className="text-[15px] font-bold text-ink-950">
                আপনার এলাকায় শেল্টার তালিকাভুক্ত নয়?
              </h3>
              <p className="mt-3 text-[13.5px] leading-relaxed text-ink-700">
                স্কুল, মাদ্রাসা বা কমিউনিটি ভবন যা দুর্যোগের সময় আশ্রয়কেন্দ্র
                হিসেবে ব্যবহারযোগ্য — সেই তথ্য আমাদের জানান। যাচাই শেষে তা
                তালিকায় যুক্ত করা হবে।
              </p>
              <p className="mt-3 text-[13.5px] font-bold text-teal-800">
                ইমেইল: shelter@coastalguard-bd.org
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </>
  );
}
