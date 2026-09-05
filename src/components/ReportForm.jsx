import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  Crosshair,
  FileCheck2,
  Image as ImageIcon,
  Loader2,
  MapPinned,
  PhoneCall,
  Send,
  ShieldCheck,
  Video,
  X,
} from "lucide-react";
import ErrorMessage from "@/components/ErrorMessage";
import { DISASTER_TYPES } from "@/data/disasters";
import { DISTRICTS, findDistrict } from "@/data/districts";
import { bn, classNames } from "@/lib/utils";
import { HOTLINE_ITEMS } from "@/data/site";
import myaxios from "@/utils/myaxios";
import isLogin from "@/utils/isLogin";

// ----------------------------------------------------------------------
// Map UI damage labels to exact DB `DamageType.name` entries
// ----------------------------------------------------------------------
const DAMAGE_MAPPING = {
  "বাড়িঘর ক্ষতিগ্রস্ত": 1,
  "বেড়িবাঁধ ভাঙন/ফাটল": 4,
  "রাস্তাঘাট ডুবে গেছে": 6,
  "গাছপালা উঠে গেছে": 12,
  "ফসলের ক্ষতি": 8,
  "খাবার পানি দূষিত": 15,
  "বিদ্যুৎ সরবরাহ বিচ্ছিন্ন": 13,
  "যোগাযোগ ব্যবস্থা বিচ্ছিন্ন": 14,
};

const DAMAGE_OPTIONS = Object.keys(DAMAGE_MAPPING);

const SITUATIONS = [
  {
    key: "worsening",
    label: "পরিস্থিতি আরও খারাপ হচ্ছে",
    activeCls: "border-red-500 bg-red-50 text-red-800",
  },
  {
    key: "stable",
    label: "পরিস্থিতি স্থির আছে",
    activeCls: "border-amber-500 bg-amber-50 text-amber-800",
  },
  {
    key: "improving",
    label: "পরিস্থিতির উন্নতি হচ্ছে",
    activeCls: "border-emerald-500 bg-emerald-50 text-emerald-800",
  },
];

const INITIAL = {
  typeKey: "",
  district: "",
  upazila: "",
  village: "",
  date: "",
  time: "",
  description: "",
  damages: [],
  affectedPeople: "",
  affectedFamilies: "",
  situation: "",
  urgentRescue: false,
  reporterName: "",
  reporterPhone: "",
};

const inputCls = (hasError) => classNames("input", hasError && "input-error");
const todayISO = () => new Date().toISOString().slice(0, 10);

function SectionTitle({ number, title, hint }) {
  return (
    <div className="flex items-start gap-3 border-b border-stone-100 pb-3">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-teal-700 font-display text-sm font-bold text-white">
        {number}
      </span>
      <div>
        <h3 className="text-[16px] font-bold text-ink-950">{title}</h3>
        {hint && <p className="mt-0.5 text-[12.5px] text-ink-500">{hint}</p>}
      </div>
    </div>
  );
}

export default function ReportForm() {
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [refCode, setRefCode] = useState(null);
  const [gps, setGps] = useState(null);
  const [gpsCoords, setGpsCoords] = useState(null);
  const [gpsError, setGpsError] = useState(null);
  const [images, setImages] = useState([]);
  const [video, setVideo] = useState(null);
  const imgInputRef = useRef(null);
  const videoInputRef = useRef(null);

  // Check if user is logged in
  const isAuthenticated = isLogin();

  const set = (key, value) => {
    setForm((f) => ({
      ...f,
      [key]: value,
    }));
    setErrors((e) => ({
      ...e,
      [key]: undefined,
    }));
  };

  const selectedDistrictObj = form.district ? findDistrict(form.district) : null;
  const upazilaOptions = selectedDistrictObj?.upazilas ?? [];
  
  const locateGps = () => {
    setGpsError(null);
    if (!navigator.geolocation) {
      setGpsError(
        "আপনার ব্রাউজার GPS সমর্থন করে না — ঠিকানাটি লিখেই এগিয়ে যান।",
      );
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude.toFixed(6);
        const lng = pos.coords.longitude.toFixed(6);
        setGpsCoords({
          latitude: lat,
          longitude: lng,
          accuracy: pos.coords.accuracy ? pos.coords.accuracy.toFixed(1) : "10.0",
        });
        setGps(`${lat}, ${lng}`);
      },
      () =>
        setGpsError(
          "GPS অনুমতি পাওয়া যায়নি — গ্রাম/ওয়ার্ডের নাম বিস্তারিত লিখুন।",
        ),
      {
        timeout: 8000,
      },
    );
  };

  const validate = () => {
    const next = {};
    if (!form.typeKey) next.typeKey = "দুর্যোগের ধরন নির্বাচন করুন";
    if (!form.district) next.district = "জেলা নির্বাচন করুন";
    if (!form.upazila) next.upazila = "উপজেলা নির্বাচন করুন";
    if (!form.village.trim())
      next.village = "গ্রাম, ইউনিয়ন বা ওয়ার্ডের নাম লিখুন";
    if (!form.date) next.date = "ঘটনার তারিখ দিন";
    else if (form.date > todayISO())
      next.date = "ভবিষ্যতের তারিখ দেওয়া যাবে না";
    if (!form.time) next.time = "ঘটনার সময় দিন";
    if (form.description.trim().length < 30)
      next.description = "বিবরণ কমপক্ষে ৩০ অক্ষরের হতে হবে";
    if (!form.situation) next.situation = "বর্তমান পরিস্থিতি নির্বাচন করুন";
    if (form.affectedPeople && Number(form.affectedPeople) < 0)
      next.affectedPeople = "সংখ্যাটি সঠিক নয়";
    
    // Only validate phone if user is NOT logged in AND they provided a phone number
    // (optional for anonymous users)
    if (!isAuthenticated && form.reporterPhone && !/^01[3-9]\d{8}$/.test(form.reporterPhone)) {
      next.reporterPhone = "সঠিক ১১ সংখ্যার মোবাইল নম্বর দিন (যেমন 01XXXXXXXXX)";
    }
    
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      const firstError = document.querySelector("[data-invalid='true']");
      firstError?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();

      // 1. Incident Category Mapping (matches IncidentCategory DB fields/IDs)
      const selectedType = DISASTER_TYPES.find((t) => t.key === form.typeKey);
      if (!selectedType?.id) {throw new Error("Invalid disaster category selected.");}
      formData.append("category", String(selectedType.id));

      // 2. Text descriptions
      formData.append("description", form.description);
      formData.append("description_bn", form.description);

      // 3. Situation
      formData.append("situation", form.situation);
      console.log("Selected situation:", form.situation);

      // 4. Damage Types (mapped to DamageType DB `name` strings)
      form.damages.forEach((damageText) => {
        const damageId = DAMAGE_MAPPING[damageText];

        if (damageId) {
          formData.append("damage_types", String(damageId));
        }
      });

      // 5. Geolocation / Position
      if (gpsCoords) {
        formData.append("latitude", gpsCoords.latitude);
        formData.append("longitude", gpsCoords.longitude);
        formData.append("location_accuracy", gpsCoords.accuracy);
        formData.append("location_source", "gps");
      } else {
        formData.append("location_source", "manual");
      }

      // 6. Address Fields
      const fullAddress = `${form.village}, ${form.upazila}, ${form.district}`;
      formData.append("address", fullAddress);
      formData.append("village", form.village);
      formData.append("upazila", form.upazila);
      formData.append("district", form.district);
      if (selectedDistrictObj?.division) {
        formData.append("division", selectedDistrictObj.division);
      }

      // 7. Reporter Details & Anonymity
      formData.append("is_anonymous", isAuthenticated ? "false" : "true");

      // Only send reporter details if they are provided (always optional)
      if (form.reporterName.trim()) {
        formData.append("reporter_name", form.reporterName.trim());
      }
      if (form.reporterPhone.trim()) {
        formData.append("reporter_phone", form.reporterPhone.trim());
      }

      // 8. Incident Timestamp ISO format
      const incidentISO = new Date(`${form.date}T${form.time}:00`).toISOString();
      formData.append("incident_time", incidentISO);

      // 9. Estimates & Emergency Flags
      if (form.affectedPeople) {
        formData.append("affected_people_estimate", form.affectedPeople);
      }
      if (form.affectedFamilies) {
        formData.append(
          "affected_families_estimate",
          String(form.affectedFamilies)
        );
      }
      formData.append("is_sos", form.urgentRescue ? "true" : "false");



      // 10. File Attachments
      images.forEach((file) => formData.append("files", file));
      if (video) formData.append("files", video);

      // Post request
      const res = await myaxios.post("incidents/create/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const responseCode =
        res?.data?.reference_code ||
        res?.data?.id ||
        `CGBD-2026-${String(Math.floor(1000 + Math.random() * 9000))}`;

      setRefCode(responseCode);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (err) {
      console.error("Failed to submit incident report:", err);
      setErrors((prev) => ({
        ...prev,
        submit: "রিপোর্ট জমা দিতে সমস্যা হয়েছে। আবার চেষ্টা করুন।",
      }));
    } finally {
      setSubmitting(false);
    }
  };

  const resetAll = () => {
    setForm(INITIAL);
    setErrors({});
    setImages([]);
    setVideo(null);
    setGps(null);
    setGpsCoords(null);
    setGpsError(null);
    setRefCode(null);
  };

  /* ---------------- success state ---------------- */
  if (refCode) {
    return (
      <div className="card mx-auto max-w-2xl p-6 text-center sm:p-10">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/60">
          <CheckCircle2 className="h-9 w-9" aria-hidden="true" />
        </span>
        <h2 className="font-display mt-5 text-2xl font-bold text-ink-950">
          রিপোর্ট সফলভাবে জমা হয়েছে
        </h2>
        <p className="mx-auto mt-2 max-w-md text-[14px] leading-relaxed text-ink-500">
          ধন্যবাদ! আপনার তথ্যটি যাচাই দলের কাছে পাঠানো হয়েছে। জরুরি প্রয়োজনে
          নিকটস্থ নিয়ন্ত্রণ কক্ষ থেকে যোগাযোগ করা হতে পারে।
        </p>
        <div className="mx-auto mt-5 w-fit rounded-xl border border-teal-600/25 bg-teal-50 px-5 py-3">
          <p className="text-[11.5px] font-bold tracking-wide text-teal-800">
            আপনার রেফারেন্স নম্বর
          </p>
          <p className="font-mono text-xl font-bold tracking-wide text-teal-900">
            {refCode}
          </p>
        </div>

        <ol className="mx-auto mt-6 max-w-md space-y-2.5 text-left">
          {[
            "যাচাই দল তথ্যটি পর্যালোচনা করবে (সাধারণত ৩০ মিনিটের মধ্যে)",
            "ঝুঁকি নিশ্চিত হলে জেলা নিয়ন্ত্রণ কক্ষ ও উদ্ধার দলকে জানানো হবে",
            "যাচাই সম্পন্ন হলে রিপোর্টটি দুর্যোগের খবর ও মানচিত্রে প্রকাশিত হবে",
          ].map((step, i) => (
            <li
              key={step}
              className="flex items-start gap-2.5 rounded-xl bg-sand-50 px-3.5 py-2.5 text-[13px] text-ink-700"
            >
              <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-teal-700 text-[11px] font-bold text-white">
                {bn(i + 1)}
              </span>
              {step}
            </li>
          ))}
        </ol>

        <div className="mt-7 flex flex-col justify-center gap-2.5 sm:flex-row">
          <button type="button" onClick={resetAll} className="btn btn-primary">
            আরেকটি রিপোর্ট জমা দিন
          </button>
          <Link to="/" className="btn btn-outline">
            হোমে ফিরে যান
          </Link>
          <Link to="/map" className="btn btn-ghost text-teal-700">
            <MapPinned className="h-4 w-4" aria-hidden="true" />
            মানচিত্র দেখুন
          </Link>
        </div>
      </div>
    );
  }

  /* ---------------- form ---------------- */
  return (
    <form onSubmit={submit} className="card space-y-8 p-5 sm:p-8" noValidate>
      {/* Section 1 */}
      <Fieldset data-invalid={!!errors.typeKey}>
        <SectionTitle
          number="১"
          title="ঘটনার তথ্য"
          hint="কোন ধরনের দুর্যোগ ঘটছে, তারিখ-সময় ও যতটুকু জানা আছে বিবরণে লিখুন"
        />
        <div className="pt-4">
          <span id="type-label" className="label">
            দুর্যোগের ধরন <span className="text-red-600">*</span>
          </span>
          <div
            role="group"
            aria-labelledby="type-label"
            className="grid grid-cols-2 gap-2 sm:grid-cols-4"
          >
            {DISASTER_TYPES.map((type) => {
              const Icon = type.icon;
              const active = form.typeKey === type.key;
              return (
                <button
                  key={type.key}
                  type="button"
                  aria-pressed={active}
                  onClick={() => set("typeKey", type.key)}
                  className={classNames(
                    "flex cursor-pointer items-center gap-2.5 rounded-xl border-2 px-3 py-2.5 text-left text-[14px] font-semibold transition-all",
                    active
                      ? "border-teal-600 bg-teal-50 text-teal-900 shadow-sm"
                      : "border-stone-200 bg-white text-ink-700 hover:border-teal-600/40 hover:bg-sand-25",
                  )}
                >
                  <Icon
                    className={classNames(
                      "h-5 w-5 shrink-0",
                      active ? "text-teal-700" : "text-ink-300",
                    )}
                    aria-hidden="true"
                  />
                  {type.label}
                </button>
              );
            })}
          </div>
          <ErrorMessage message={errors.typeKey} />

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div data-invalid={!!errors.date}>
              <label htmlFor="ev-date" className="label">
                ঘটনার তারিখ <span className="text-red-600">*</span>
              </label>
              <input
                id="ev-date"
                type="date"
                max={todayISO()}
                className={inputCls(errors.date)}
                value={form.date}
                onChange={(e) => set("date", e.target.value)}
              />
              <ErrorMessage message={errors.date} />
            </div>
            <div data-invalid={!!errors.time}>
              <label htmlFor="ev-time" className="label">
                ঘটনার সময় <span className="text-red-600">*</span>
              </label>
              <input
                id="ev-time"
                type="time"
                className={inputCls(errors.time)}
                value={form.time}
                onChange={(e) => set("time", e.target.value)}
              />
              <ErrorMessage message={errors.time} />
            </div>
          </div>

          <div className="mt-4" data-invalid={!!errors.description}>
            <label htmlFor="ev-desc" className="label">
              বিবরণ <span className="text-red-600">*</span>
            </label>
            <textarea
              id="ev-desc"
              rows={4}
              className={inputCls(errors.description)}
              placeholder="যেমন: আজ ভোরে জোয়ারের পানি বাঁধ টপকে গ্রামের নিচু অংশে ঢুকছে। এখন পর্যন্ত প্রায় ৪০-৫০টি বাড়িতে পানি উঠেছে। স্থানীয়রা বালুর বস্তা ফেলছে…"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              aria-describedby="desc-hint"
            />
            <div className="mt-1 flex items-center justify-between">
              <p id="desc-hint" className="text-[12px] text-ink-300">
                কখন, কোথায়, কত বড়, কারা ক্ষতিগ্রস্ত — যতটুকু জানা আছে লিখুন
                (কমপক্ষে ৩০ অক্ষর)
              </p>
              <span
                className={classNames(
                  "text-[12px] font-semibold",
                  form.description.trim().length >= 30
                    ? "text-emerald-600"
                    : "text-ink-300",
                )}
              >
                {bn(form.description.trim().length)}/৩০
              </span>
            </div>
            <ErrorMessage message={errors.description} />
          </div>
        </div>
      </Fieldset>

      {/* Section 2 */}
      <Fieldset
        data-invalid={!!errors.district || !!errors.upazila || !!errors.village}
      >
        <SectionTitle
          number="২"
          title="অবস্থান"
          hint="দুর্যোগ কোথায় ঘটছে — জেলা, উপজেলা ও গ্রাম/ইউনিয়ন"
        />
        <div className="grid gap-4 pt-4 sm:grid-cols-2">
          <div data-invalid={!!errors.district}>
            <label htmlFor="ev-district" className="label">
              জেলা <span className="text-red-600">*</span>
            </label>
            <select
              id="ev-district"
              className={inputCls(errors.district)}
              value={form.district}
              onChange={(e) => {
                set("district", e.target.value);
                setForm((f) => ({
                  ...f,
                  district: e.target.value,
                  upazila: "",
                }));
              }}
            >
              <option value="">জেলা নির্বাচন করুন</option>
              {DISTRICTS.map((d) => (
                <option key={d.name} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
            <ErrorMessage message={errors.district} />
          </div>
          <div data-invalid={!!errors.upazila}>
            <label htmlFor="ev-upazila" className="label">
              উপজেলা <span className="text-red-600">*</span>
            </label>
            <select
              id="ev-upazila"
              className={classNames(
                inputCls(errors.upazila),
                !form.district && "opacity-60",
              )}
              value={form.upazila}
              disabled={!form.district}
              onChange={(e) => set("upazila", e.target.value)}
            >
              <option value="">
                {form.district
                  ? "উপজেলা নির্বাচন করুন"
                  : "আগে জেলা নির্বাচন করুন"}
              </option>
              {upazilaOptions.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
            <ErrorMessage message={errors.upazila} />
          </div>
          <div className="sm:col-span-2" data-invalid={!!errors.village}>
            <label htmlFor="ev-village" className="label">
              গ্রাম / ইউনিয়ন / ওয়ার্ড <span className="text-red-600">*</span>
            </label>
            <input
              id="ev-village"
              type="text"
              className={inputCls(errors.village)}
              placeholder="যেমন: উত্তর বেদকাশী ইউনিয়ন, ২ নম্বর ওয়ার্ড"
              value={form.village}
              onChange={(e) => set("village", e.target.value)}
            />
            <ErrorMessage message={errors.village} />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-dashed border-teal-600/35 bg-teal-50/50 px-4 py-3">
          <button
            type="button"
            onClick={locateGps}
            className="btn border! border-teal-700! bg-white! px-3.5! py-2! text-[13px]! font-bold! text-teal-800! hover:bg-teal-50!"
          >
            <Crosshair className="h-4 w-4" aria-hidden="true" />
            GPS অবস্থান নিন
          </button>
          <p className="text-[12.5px] text-ink-500">
            {gps ? (
              <span className="inline-flex items-center gap-1.5 font-bold text-teal-800">
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                সংযুক্ত হয়েছে: {gps}
              </span>
            ) : (
              "ঐচ্ছিক — মোবাইলের লোকেশন চালু থাকলে সঠিক অবস্থান স্বয়ংক্রিয়ভাবে যুক্ত হবে"
            )}
          </p>
          {gpsError && (
            <p className="w-full text-[12.5px] font-medium text-amber-700">
              {gpsError}
            </p>
          )}
        </div>
      </Fieldset>

      {/* Section 3 */}
      <Fieldset data-invalid={!!errors.situation}>
        <SectionTitle
          number="৩"
          title="ক্ষয়ক্ষতি ও বর্তমান পরিস্থিতি"
          hint="যা দেখেছেন তা নির্বাচন করুন — একাধিক হলেও সমস্যা নেই"
        />
        <div className="pt-4">
          <span className="label">ক্ষয়ক্ষতির ধরন (ঐচ্ছিক)</span>
          <div className="flex flex-wrap gap-2">
            {DAMAGE_OPTIONS.map((damage) => {
              const active = form.damages.includes(damage);
              return (
                <button
                  key={damage}
                  type="button"
                  aria-pressed={active}
                  onClick={() =>
                    set(
                      "damages",
                      active
                        ? form.damages.filter((d) => d !== damage)
                        : [...form.damages, damage],
                    )
                  }
                  className={classNames(
                    "cursor-pointer rounded-full border px-3.5 py-2 text-[13px] font-semibold transition-all",
                    active
                      ? "border-teal-700 bg-teal-700 text-white shadow-sm"
                      : "border-stone-200 bg-white text-ink-700 hover:border-teal-600/40",
                  )}
                >
                  {damage}
                </button>
              );
            })}
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="ev-affected" className="label">
                আহত/আক্রান্ত মানুষের সংখ্যা (অনুমানিক)
              </label>
              <input
                id="ev-affected"
                type="number"
                min={0}
                inputMode="numeric"
                className={inputCls(errors.affectedPeople)}
                placeholder="যেমন: ১৫০ জন"
                value={form.affectedPeople}
                onChange={(e) => set("affectedPeople", e.target.value)}
              />
              <ErrorMessage message={errors.affectedPeople} />
            </div>
            <div>
              <label className="label">
                আনুমানিক ক্ষতিগ্রস্ত পরিবার
              </label>

              <input
                type="number"
                min="0"
                value={form.affectedFamilies}
                onChange={(e) =>
                  set("affectedFamilies", e.target.value)
                }
                className={inputCls(errors.affectedFamilies)}
                placeholder="যেমন: 40"
              />

              {errors.affectedFamilies && (
                <ErrorMessage message={errors.affectedFamilies} />
              )}
            </div>
          </div>

          <fieldset className="mt-5">
            <legend className="label">
              বর্তমান পরিস্থিতি <span className="text-red-600">*</span>
            </legend>

            <div className="grid gap-2 sm:grid-cols-3">
              {SITUATIONS.map((s) => {
                const active = form.situation === s.key;

                return (
                  <label
                    key={s.key}
                    className={classNames(
                      "cursor-pointer rounded-xl border-2 px-3.5 py-3 text-center text-[13.5px] font-semibold transition-all",
                      active
                        ? s.activeCls
                        : "border-stone-200 text-ink-700 hover:border-teal-600/30",
                    )}
                  >
                    <input
                      type="radio"
                      name="situation"
                      value={s.key}
                      checked={active}
                      onChange={(e) => set("situation", e.target.value)}
                      className="sr-only"
                    />

                    {s.label}
                  </label>
                );
              })}
            </div>

            <ErrorMessage message={errors.situation} />
          </fieldset>

          <div
            className={classNames(
              "mt-5 rounded-xl border p-4 transition-colors",
              form.urgentRescue
                ? "border-red-300 bg-red-50"
                : "border-stone-200 bg-sand-25",
            )}
          >
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                className="control-check mt-1"
                checked={form.urgentRescue}
                onChange={(e) => set("urgentRescue", e.target.checked)}
              />
              <span>
                <span className="block text-[14px] font-bold text-ink-900">
                  জরুরি উদ্ধার প্রয়োজন
                </span>
                <span className="mt-0.5 block text-[12.5px] leading-relaxed text-ink-500">
                  কেউ পানিবন্দী হয়ে পড়লে, গাছে/ছাদে আটকা পড়লে বা গুরুতর আহত
                  হলে টিক দিন।
                </span>
                {form.urgentRescue && (
                  <a
                    href={`tel:${HOTLINE_ITEMS[0].digits}`}
                    className="mt-2.5 inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-2 text-[13px] font-bold text-white"
                  >
                    <PhoneCall className="h-4 w-4" aria-hidden="true" />
                    সাথে সাথে {HOTLINE_ITEMS[0].value}-এও কল করুন
                  </a>
                )}
              </span>
            </label>
          </div>
        </div>
      </Fieldset>

      {/* Section 4 */}
      <Fieldset>
        <SectionTitle
          number="৪"
          title="ছবি / ভিডিও প্রমাণ"
          hint="ঐচ্ছিক, তবে থাকলে যাচাই দ্রুত হয় — ঝুঁকি নিয়ে ছবি তুলবেন না"
        />
        <div className="grid gap-4 pt-4 sm:grid-cols-2">
          <div>
            <span className="label">ছবি আপলোড (সর্বোচ্চ ৫টি)</span>
            <button
              type="button"
              onClick={() => imgInputRef.current?.click()}
              className="flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-stone-300 bg-sand-25 px-4 py-6 text-center transition hover:border-teal-600/50 hover:bg-teal-50/40"
            >
              <ImageIcon className="h-7 w-7 text-ink-300" aria-hidden="true" />
              <span className="text-[13px] font-bold text-ink-700">
                ছবি নির্বাচন করুন
              </span>
              <span className="text-[11.5px] text-ink-300">
                JPG, PNG — প্রতিটি সর্বোচ্চ ৫ MB
              </span>
            </button>
            <input
              ref={imgInputRef}
              type="file"
              accept="image/*"
              multiple
              className="sr-only"
              aria-label="ছবি নির্বাচন"
              onChange={(e) => {
                const files = Array.from(e.target.files ?? []).slice(
                  0,
                  5 - images.length,
                );
                setImages((prev) => [...prev, ...files].slice(0, 5));
                e.target.value = "";
              }}
            />
            {images.length > 0 && (
              <ul className="mt-2.5 space-y-1.5">
                {images.map((file, i) => (
                  <li
                    key={`${file.name}-${i}`}
                    className="flex items-center justify-between gap-2 rounded-lg bg-sand-50 px-3 py-2 text-[12px]"
                  >
                    <span className="inline-flex min-w-0 items-center gap-2 font-medium text-ink-700">
                      <FileCheck2
                        className="h-4 w-4 shrink-0 text-teal-700"
                        aria-hidden="true"
                      />
                      <span className="truncate">{file.name}</span>
                    </span>
                    <button
                      type="button"
                      aria-label={`${file.name} সরান`}
                      onClick={() =>
                        setImages((prev) => prev.filter((_, idx) => idx !== i))
                      }
                      className="cursor-pointer rounded-md p-1 text-ink-400 hover:bg-white hover:text-red-600"
                    >
                      <X className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <span className="label">ভিডিও আপলোড (১টি)</span>
            <button
              type="button"
              onClick={() => videoInputRef.current?.click()}
              className="flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-stone-300 bg-sand-25 px-4 py-6 text-center transition hover:border-teal-600/50 hover:bg-teal-50/40"
            >
              <Video className="h-7 w-7 text-ink-300" aria-hidden="true" />
              <span className="text-[13px] font-bold text-ink-700">
                ভিডিও নির্বাচন করুন
              </span>
              <span className="text-[11.5px] text-ink-300">
                MP4 — সর্বোচ্চ ৫০ MB, ৩০ সেকেন্ড পর্যন্ত
              </span>
            </button>
            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              className="sr-only"
              aria-label="ভিডিও নির্বাচন"
              onChange={(e) => {
                setVideo(e.target.files?.[0] ?? null);
                e.target.value = "";
              }}
            />
            {video && (
              <div className="mt-2.5 flex items-center justify-between gap-2 rounded-lg bg-sand-50 px-3 py-2 text-[12px]">
                <span className="inline-flex min-w-0 items-center gap-2 font-medium text-ink-700">
                  <FileCheck2
                    className="h-4 w-4 shrink-0 text-teal-700"
                    aria-hidden="true"
                  />
                  <span className="truncate">{video.name}</span>
                </span>
                <button
                  type="button"
                  aria-label={`${video.name} সরান`}
                  onClick={() => setVideo(null)}
                  className="cursor-pointer rounded-md p-1 text-ink-400 hover:bg-white hover:text-red-600"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            )}
          </div>
        </div>
      </Fieldset>

      {/* Section 5 - Only show when user is NOT logged in (anonymous) */}
      {!isAuthenticated && (
        <Fieldset data-invalid={!!errors.reporterPhone}>
          <SectionTitle
            number="৫"
            title="যোগাযোগের তথ্য"
            hint="সম্পূর্ণ ঐচ্ছিক — যাচাইয়ের প্রয়োজনে ব্যবহারের বাইরে গোপন রাখা হয়"
          />
          <div className="grid gap-4 pt-4 sm:grid-cols-2">
            <div>
              <label htmlFor="ev-name" className="label">
                আপনার নাম (ঐচ্ছিক)
              </label>
              <input
                id="ev-name"
                type="text"
                autoComplete="name"
                className="input"
                placeholder="পুরো নাম"
                value={form.reporterName}
                onChange={(e) => set("reporterName", e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="ev-phone" className="label">
                মোবাইল নম্বর (ঐচ্ছিক)
              </label>
              <input
                id="ev-phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                className={inputCls(errors.reporterPhone)}
                placeholder="01XXXXXXXXX"
                value={form.reporterPhone}
                onChange={(e) => set("reporterPhone", e.target.value)}
                aria-describedby="phone-privacy"
              />
              <ErrorMessage message={errors.reporterPhone} />
            </div>
          </div>
          <p
            id="phone-privacy"
            className="mt-2.5 flex items-start gap-1.5 text-[12px] text-ink-300"
          >
            <ShieldCheck
              className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal-700"
              aria-hidden="true"
            />
            আপনার পরিচয় প্রকাশ করা হবে না; রিপোর্টে শুধু এলাকা ও ঘটনার তথ্য দেখা
            যাবে।
          </p>
        </Fieldset>
      )}

      {/* Error summary */}
      {(Object.values(errors).some(Boolean) || errors.submit) && (
        <div
          className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3"
          role="alert"
        >
          <CircleAlert
            className="mt-0.5 h-5 w-5 shrink-0 text-red-600"
            aria-hidden="true"
          />
          <p className="text-[13.5px] font-semibold text-red-800">
            {errors.submit ||
              "দয়া করে লাল চিহ্নিত ঘরগুলো পূরণ বা ঠিক করে আবার জমা দিন।"}
          </p>
        </div>
      )}

      <div className="flex flex-col gap-3 border-t border-stone-100 pt-5 sm:flex-row">
        <button
          type="submit"
          disabled={submitting}
          className="btn btn-primary flex-1 !py-3.5 !text-[15px]"
        >
          {submitting ? (
            <>
              <Loader2
                className="h-4.5 w-4.5 animate-spin"
                aria-hidden="true"
              />
              জমা হচ্ছে…
            </>
          ) : (
            <>
              <Send className="h-4.5 w-4.5" aria-hidden="true" />
              রিপোর্ট জমা দিন
            </>
          )}
        </button>
        <button
          type="button"
          disabled={submitting}
          onClick={resetAll}
          className="btn btn-outline sm:w-44"
        >
          বাতিল করুন
        </button>
      </div>

      <p className="flex items-start gap-2 text-[12.5px] text-ink-300">
        <ChevronRight className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        জমা দিলেই রিপোর্ট প্রকাশ হয় না — স্থানীয় যাচাই দল তথ্য যাচাই করার পরেই
        তা দুর্যোগের খবর ও মানচিত্রে যুক্ত হয়।
      </p>
    </form>
  );
}

function Fieldset({ children, ...rest }) {
  return <fieldset {...rest}>{children}</fieldset>;
}