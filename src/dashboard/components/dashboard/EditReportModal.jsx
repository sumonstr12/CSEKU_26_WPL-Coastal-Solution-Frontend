import { useEffect, useMemo, useRef, useState } from "react";
import {
  CheckCircle2,
  Crosshair,
  FileCheck2,
  Image as ImageIcon,
  Loader2,
  Video,
  X,
} from "lucide-react";
import { DISASTER_TYPES } from "../../config/disasterTypes";
import { dashboardService } from "../../services/dashboardService";
import { cn } from "../../utils/cn.js";

/* Coastal districts — matches public report form */
const DISTRICTS = [
  { name: "খুলনা", upazilas: ["খুলনা সদর", "ডুমুরিয়া", "তেরখাদা", "দিঘলিয়া", "পাইকগাছা", "ফুলতলা", "বটিয়াঘাটা", "রূপসা", "কয়রা", "দাকোপ"] },
  { name: "সাতক্ষীরা", upazilas: ["সাতক্ষীরা সদর", "আশাশুনি", "কালীগঞ্জ", "কালিগঞ্জ", "তালা", "দেবহাটা", "শ্যামনগর"] },
  { name: "বাগেরহাট", upazilas: ["বাগেরহাট সদর", "মোংলা", "মোড়েলগঞ্জ", "রামপাল", "ফকিরহাট", "চিতলমারী", "কচুয়া", "মোল্লাহাট", "শরণখোলা"] },
  { name: "বরিশাল", upazilas: ["বরিশাল সদর", "বাকেরগঞ্জ", "বাবুগঞ্জ", "বানারীপাড়া", "গৌরনদী", "আগৈলঝাড়া", "মেহেন্দিগঞ্জ", "মুলাদী", "হিজলা", "উজিরপুর"] },
  { name: "পটুয়াখালী", upazilas: ["পটুয়াখালী সদর", "কলাপাড়া", "গলাচিপা", "দশমিনা", "মির্জাগঞ্জ", "বাউফল", "রাঙ্গাবালী", "দুমকি"] },
  { name: "বরগুনা", upazilas: ["বরগুনা সদর", "আমতলী", "তালতলী", "পাথরঘাটা", "বেতাগী", "বামনা"] },
  { name: "ভোলা", upazilas: ["ভোলা সদর", "চরফ্যাশন", "তজুমদ্দিন", "দাউলতখান", "মনপুরা", "লালমোহন", "বোরহানউদ্দিন"] },
  { name: "পিরোজপুর", upazilas: ["পিরোজপুর সদর", "নাজিরপুর", "কাউখালী", "ভান্ডারিয়া", "মঠবাড়িয়া", "নেছারাবাদ", "ইন্দুরকানী"] },
  { name: "ঝালকাঠি", upazilas: ["ঝালকাঠি সদর", "কাঠালিয়া", "নলছিটি", "রাজাপুর"] },
  { name: "চট্টগ্রাম", upazilas: ["চট্টগ্রাম সদর", "আনোয়ারা", "বাঁশখালী", "বোয়ালখালী", "চন্দনাইশ", "ফটিকছড়ি", "হাটহাজারী", "লোহাগাড়া", "মীরসরাই", "পটিয়া", "রাঙ্গুনিয়া", "রাউজান", "সন্দ্বীপ", "সাতকানিয়া", "সীতাকুণ্ড"] },
  { name: "কক্সবাজার", upazilas: ["কক্সবাজার সদর", "চকরিয়া", "কুতুবদিয়া", "মহেশখালী", "পেকুয়া", "রামু", "টেকনাফ", "উখিয়া"] },
  { name: "নোয়াখালী", upazilas: ["নোয়াখালী সদর", "বেগমগঞ্জ", "চাটখিল", "কোম্পানীগঞ্জ", "হাতিয়া", "সেনবাগ", "সুবর্ণচর", "সোনাইমুড়ী", "কবিরহাট"] },
];

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
const ID_TO_DAMAGE = Object.fromEntries(Object.entries(DAMAGE_MAPPING).map(([k, v]) => [v, k]));

const SITUATIONS = [
  { key: "worsening", label: "পরিস্থিতি আরও খারাপ হচ্ছে", activeCls: "border-red-500 bg-red-50 text-red-800" },
  { key: "stable", label: "পরিস্থিতি স্থির আছে", activeCls: "border-amber-500 bg-amber-50 text-amber-800" },
  { key: "improving", label: "পরিস্থিতির উন্নতি হচ্ছে", activeCls: "border-emerald-500 bg-emerald-50 text-emerald-800" },
];

const TYPE_ENTRIES = Object.entries(DISASTER_TYPES).map(([key, t]) => ({
  key,
  label: t.label,
  icon: t.icon,
  backendId: t.backendId,
}));

const todayISO = () => new Date().toISOString().slice(0, 10);

function SectionTitle({ number, title, hint }) {
  return (
    <div className="flex items-start gap-3 border-b border-slate-100 pb-3">
      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-lagoon-600 text-[12px] font-bold text-white">
        {number}
      </span>
      <div>
        <h4 className="text-[14px] font-bold text-slate-800">{title}</h4>
        {hint && <p className="mt-0.5 text-[11.5px] text-slate-400">{hint}</p>}
      </div>
    </div>
  );
}

/**
 * Full edit modal — same fields/style as public ReportForm.
 */
export default function EditReportModal({ reportId, onClose, onSaved }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});
  const [existingEvidence, setExistingEvidence] = useState([]);
  const [images, setImages] = useState([]);
  const [video, setVideo] = useState(null);
  const [gps, setGps] = useState(null);
  const [gpsCoords, setGpsCoords] = useState(null);
  const [gpsError, setGpsError] = useState(null);
  const imgRef = useRef(null);
  const videoRef = useRef(null);

  const [form, setForm] = useState({
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
  });

  const set = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const upazilaOptions = useMemo(() => {
    const d = DISTRICTS.find((x) => x.name === form.district);
    return d?.upazilas || [];
  }, [form.district]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const d = await dashboardService.getCitizenReportDetail(reportId);
        if (cancelled) return;

        const typeKey =
          Object.entries(DISASTER_TYPES).find(([, t]) => t.backendId === d.categoryId)?.[0] ||
          d.type ||
          "";

        const damages = (d.damageTypeIds || [])
          .map((id) => ID_TO_DAMAGE[id])
          .filter(Boolean);

        setForm({
          typeKey,
          district: d.district || "",
          upazila: d.upazila || "",
          village: d.village || d.place || "",
          date: d.incidentDate || "",
          time: d.incidentTimeOnly || "",
          description: d.description || "",
          damages,
          affectedPeople: d.affectedPeople != null ? String(d.affectedPeople) : "",
          affectedFamilies: d.affectedFamilies != null ? String(d.affectedFamilies) : "",
          situation: d.situation || "",
          urgentRescue: Boolean(d.isSos),
        });

        if (d.latitude != null && d.longitude != null) {
          setGpsCoords({
            latitude: String(d.latitude),
            longitude: String(d.longitude),
            accuracy: d.locationAccuracy != null ? String(d.locationAccuracy) : "10.0",
          });
          setGps(`${d.latitude}, ${d.longitude}`);
        }
        setExistingEvidence(d.evidence || []);
      } catch (err) {
        if (!cancelled) setError(err?.response?.data?.detail || "রিপোর্ট লোড করা যায়নি");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [reportId]);

  const locateGps = () => {
    setGpsError(null);
    if (!navigator.geolocation) {
      setGpsError("আপনার ব্রাউজার GPS সমর্থন করে না।");
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
      () => setGpsError("GPS অনুমতি পাওয়া যায়নি।"),
      { timeout: 8000 }
    );
  };

  const validate = () => {
    const next = {};
    if (!form.typeKey) next.typeKey = "দুর্যোগের ধরন নির্বাচন করুন";
    if (!form.district) next.district = "জেলা নির্বাচন করুন";
    if (!form.upazila) next.upazila = "উপজেলা নির্বাচন করুন";
    if (!form.village.trim()) next.village = "গ্রাম/ইউনিয়ন লিখুন";
    if (!form.date) next.date = "তারিখ দিন";
    else if (form.date > todayISO()) next.date = "ভবিষ্যতের তারিখ দেওয়া যাবে না";
    if (!form.time) next.time = "সময় দিন";
    if (form.description.trim().length < 30) next.description = "বিবরণ কমপক্ষে ৩০ অক্ষর";
    if (!form.situation) next.situation = "পরিস্থিতি নির্বাচন করুন";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    setError("");
    try {
      const selectedType = TYPE_ENTRIES.find((t) => t.key === form.typeKey);
      const fd = new FormData();

      if (selectedType?.backendId) fd.append("category", String(selectedType.backendId));
      fd.append("description", form.description.trim());
      fd.append("description_bn", form.description.trim());
      fd.append("situation", form.situation);

      form.damages.forEach((label) => {
        const id = DAMAGE_MAPPING[label];
        if (id) fd.append("damage_types", String(id));
      });

      if (gpsCoords) {
        fd.append("latitude", gpsCoords.latitude);
        fd.append("longitude", gpsCoords.longitude);
        fd.append("location_accuracy", gpsCoords.accuracy);
        fd.append("location_source", "gps");
      }

      const fullAddress = `${form.village}, ${form.upazila}, ${form.district}`;
      fd.append("address", fullAddress);
      fd.append("village", form.village.trim());
      fd.append("upazila", form.upazila);
      fd.append("district", form.district);

      const incidentISO = new Date(`${form.date}T${form.time}:00`).toISOString();
      fd.append("incident_time", incidentISO);
      fd.append("incident_date", form.date);
      fd.append("incident_time_only", form.time);

      if (form.affectedPeople) fd.append("affected_people_estimate", form.affectedPeople);
      if (form.affectedFamilies) fd.append("affected_families_estimate", form.affectedFamilies);
      fd.append("is_sos", form.urgentRescue ? "true" : "false");

      images.forEach((file) => fd.append("files", file));
      if (video) fd.append("files", video);

      await dashboardService.updateCitizenReport(reportId, fd);
      onSaved?.();
      onClose?.();
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          err?.response?.data?.message ||
          "আপডেট ব্যর্থ — আবার চেষ্টা করুন"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-3 sm:p-6">
      <div className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5">
          <div>
            <h3 className="text-base font-bold text-slate-800">রিপোর্ট সম্পাদনা</h3>
            <p className="text-[12px] text-slate-400">আইডি: {reportId} — শুধু যাচাই-পূর্ব রিপোর্ট সম্পাদনযোগ্য</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-16 text-slate-400">
              <Loader2 className="h-5 w-5 animate-spin" /> লোড হচ্ছে…
            </div>
          ) : (
            <form id="edit-report-form" onSubmit={submit} className="space-y-7" noValidate>
              {/* 1. Type + time + description */}
              <fieldset>
                <SectionTitle number="১" title="ঘটনার তথ্য" hint="ধরন, তারিখ-সময় ও বিবরণ" />
                <div className="pt-3">
                  <span className="mb-1.5 block text-[12px] font-bold text-slate-500">
                    দুর্যোগের ধরন <span className="text-red-500">*</span>
                  </span>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {TYPE_ENTRIES.map((type) => {
                      const Icon = type.icon;
                      const active = form.typeKey === type.key;
                      return (
                        <button
                          key={type.key}
                          type="button"
                          onClick={() => set("typeKey", type.key)}
                          className={cn(
                            "flex items-center gap-2 rounded-xl border-2 px-2.5 py-2 text-left text-[13px] font-semibold transition",
                            active
                              ? "border-lagoon-600 bg-lagoon-50 text-lagoon-900"
                              : "border-slate-200 bg-white text-slate-600 hover:border-lagoon-300"
                          )}
                        >
                          <Icon size={16} className={active ? "text-lagoon-600" : "text-slate-300"} />
                          {type.label}
                        </button>
                      );
                    })}
                  </div>
                  {errors.typeKey && <p className="mt-1 text-[12px] font-semibold text-red-600">{errors.typeKey}</p>}

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-[12px] font-bold text-slate-500">
                        তারিখ <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        max={todayISO()}
                        className="input text-[13px]"
                        value={form.date}
                        onChange={(e) => set("date", e.target.value)}
                      />
                      {errors.date && <p className="mt-1 text-[12px] font-semibold text-red-600">{errors.date}</p>}
                    </div>
                    <div>
                      <label className="mb-1 block text-[12px] font-bold text-slate-500">
                        সময় <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="time"
                        className="input text-[13px]"
                        value={form.time}
                        onChange={(e) => set("time", e.target.value)}
                      />
                      {errors.time && <p className="mt-1 text-[12px] font-semibold text-red-600">{errors.time}</p>}
                    </div>
                  </div>

                  <div className="mt-3">
                    <label className="mb-1 block text-[12px] font-bold text-slate-500">
                      বিবরণ <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={4}
                      className="input text-[13px]"
                      value={form.description}
                      onChange={(e) => set("description", e.target.value)}
                      placeholder="কখন, কোথায়, কত বড় — বিস্তারিত লিখুন (কমপক্ষে ৩০ অক্ষর)"
                    />
                    <p className="mt-1 text-right text-[11px] text-slate-400">
                      {form.description.trim().length}/৩০
                    </p>
                    {errors.description && (
                      <p className="text-[12px] font-semibold text-red-600">{errors.description}</p>
                    )}
                  </div>
                </div>
              </fieldset>

              {/* 2. Location */}
              <fieldset>
                <SectionTitle number="২" title="অবস্থান" hint="জেলা, উপজেলা ও গ্রাম/ইউনিয়ন" />
                <div className="grid gap-3 pt-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-[12px] font-bold text-slate-500">
                      জেলা <span className="text-red-500">*</span>
                    </label>
                    <select
                      className="input text-[13px]"
                      value={form.district}
                      onChange={(e) => {
                        set("district", e.target.value);
                        setForm((f) => ({ ...f, district: e.target.value, upazila: "" }));
                      }}
                    >
                      <option value="">জেলা নির্বাচন</option>
                      {DISTRICTS.map((d) => (
                        <option key={d.name} value={d.name}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                    {errors.district && <p className="mt-1 text-[12px] font-semibold text-red-600">{errors.district}</p>}
                  </div>
                  <div>
                    <label className="mb-1 block text-[12px] font-bold text-slate-500">
                      উপজেলা <span className="text-red-500">*</span>
                    </label>
                    <select
                      className="input text-[13px]"
                      value={form.upazila}
                      disabled={!form.district}
                      onChange={(e) => set("upazila", e.target.value)}
                    >
                      <option value="">{form.district ? "উপজেলা নির্বাচন" : "আগে জেলা বাছুন"}</option>
                      {upazilaOptions.map((u) => (
                        <option key={u} value={u}>
                          {u}
                        </option>
                      ))}
                    </select>
                    {errors.upazila && <p className="mt-1 text-[12px] font-semibold text-red-600">{errors.upazila}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-[12px] font-bold text-slate-500">
                      গ্রাম / ইউনিয়ন / ওয়ার্ড <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="input text-[13px]"
                      value={form.village}
                      onChange={(e) => set("village", e.target.value)}
                      placeholder="যেমন: উত্তর বেদকাশী ইউনিয়ন"
                    />
                    {errors.village && <p className="mt-1 text-[12px] font-semibold text-red-600">{errors.village}</p>}
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-3 rounded-xl border border-dashed border-lagoon-300/50 bg-lagoon-50/40 px-3 py-2.5">
                  <button
                    type="button"
                    onClick={locateGps}
                    className="btn-secondary inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-bold"
                  >
                    <Crosshair size={14} /> GPS নিন
                  </button>
                  <span className="text-[12px] text-slate-500">
                    {gps ? (
                      <span className="inline-flex items-center gap-1 font-semibold text-lagoon-700">
                        <CheckCircle2 size={14} /> {gps}
                      </span>
                    ) : (
                      "ঐচ্ছিক"
                    )}
                  </span>
                  {gpsError && <p className="w-full text-[12px] text-amber-700">{gpsError}</p>}
                </div>
              </fieldset>

              {/* 3. Damage + situation */}
              <fieldset>
                <SectionTitle number="৩" title="ক্ষয়ক্ষতি ও পরিস্থিতি" hint="যা দেখেছেন নির্বাচন করুন" />
                <div className="pt-3">
                  <span className="mb-1.5 block text-[12px] font-bold text-slate-500">ক্ষয়ক্ষতির ধরন</span>
                  <div className="flex flex-wrap gap-2">
                    {DAMAGE_OPTIONS.map((d) => {
                      const active = form.damages.includes(d);
                      return (
                        <button
                          key={d}
                          type="button"
                          onClick={() =>
                            set(
                              "damages",
                              active ? form.damages.filter((x) => x !== d) : [...form.damages, d]
                            )
                          }
                          className={cn(
                            "rounded-full border px-3 py-1.5 text-[12px] font-semibold transition",
                            active
                              ? "border-lagoon-700 bg-lagoon-600 text-white"
                              : "border-slate-200 bg-white text-slate-600 hover:border-lagoon-300"
                          )}
                        >
                          {d}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-[12px] font-bold text-slate-500">আক্রান্ত মানুষ</label>
                      <input
                        type="number"
                        min={0}
                        className="input text-[13px]"
                        value={form.affectedPeople}
                        onChange={(e) => set("affectedPeople", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[12px] font-bold text-slate-500">ক্ষতিগ্রস্ত পরিবার</label>
                      <input
                        type="number"
                        min={0}
                        className="input text-[13px]"
                        value={form.affectedFamilies}
                        onChange={(e) => set("affectedFamilies", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <span className="mb-1.5 block text-[12px] font-bold text-slate-500">
                      বর্তমান পরিস্থিতি <span className="text-red-500">*</span>
                    </span>
                    <div className="grid gap-2 sm:grid-cols-3">
                      {SITUATIONS.map((s) => {
                        const active = form.situation === s.key;
                        return (
                          <button
                            key={s.key}
                            type="button"
                            onClick={() => set("situation", s.key)}
                            className={cn(
                              "rounded-xl border-2 px-3 py-2.5 text-center text-[12.5px] font-semibold transition",
                              active ? s.activeCls : "border-slate-200 text-slate-600 hover:border-lagoon-300"
                            )}
                          >
                            {s.label}
                          </button>
                        );
                      })}
                    </div>
                    {errors.situation && (
                      <p className="mt-1 text-[12px] font-semibold text-red-600">{errors.situation}</p>
                    )}
                  </div>

                  <label
                    className={cn(
                      "mt-4 flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition",
                      form.urgentRescue ? "border-red-300 bg-red-50" : "border-slate-200 bg-slate-50/50"
                    )}
                  >
                    <input
                      type="checkbox"
                      className="mt-1"
                      checked={form.urgentRescue}
                      onChange={(e) => set("urgentRescue", e.target.checked)}
                    />
                    <span>
                      <span className="block text-[13px] font-bold text-slate-800">জরুরি উদ্ধার প্রয়োজন (SOS)</span>
                      <span className="mt-0.5 block text-[11.5px] text-slate-500">
                        কেউ পানিবন্দী/ছাদে আটকা পড়লে টিক দিন
                      </span>
                    </span>
                  </label>
                </div>
              </fieldset>

              {/* 4. Evidence */}
              <fieldset>
                <SectionTitle number="৪" title="ছবি / ভিডিও প্রমাণ" hint="নতুন ফাইল যোগ করা যাবে (আগেরগুলো থাকবে)" />
                {existingEvidence.length > 0 && (
                  <div className="mt-3">
                    <p className="mb-1.5 text-[11px] font-bold text-slate-400">বিদ্যমান প্রমাণ</p>
                    <div className="flex flex-wrap gap-2">
                      {existingEvidence.map((ev, i) => (
                        <a
                          key={i}
                          href={ev.url}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-lg border border-slate-100 bg-slate-50 px-2.5 py-1.5 text-[11px] font-medium text-lagoon-700 hover:bg-lagoon-50"
                        >
                          {ev.kind === "video" ? "ভিডিও" : "ছবি"}: {ev.name}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div>
                    <button
                      type="button"
                      onClick={() => imgRef.current?.click()}
                      className="flex w-full flex-col items-center gap-1.5 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/50 px-3 py-5 text-center hover:border-lagoon-400"
                    >
                      <ImageIcon className="text-slate-300" size={22} />
                      <span className="text-[12px] font-bold text-slate-600">ছবি যোগ (সর্বোচ্চ ৫)</span>
                    </button>
                    <input
                      ref={imgRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []).slice(0, 5 - images.length);
                        setImages((prev) => [...prev, ...files].slice(0, 5));
                        e.target.value = "";
                      }}
                    />
                    {images.map((f, i) => (
                      <div key={i} className="mt-1.5 flex items-center justify-between rounded-lg bg-slate-50 px-2.5 py-1.5 text-[11px]">
                        <span className="inline-flex items-center gap-1 truncate">
                          <FileCheck2 size={12} className="text-lagoon-600" /> {f.name}
                        </span>
                        <button type="button" onClick={() => setImages((p) => p.filter((_, idx) => idx !== i))}>
                          <X size={12} className="text-slate-400 hover:text-red-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => videoRef.current?.click()}
                      className="flex w-full flex-col items-center gap-1.5 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/50 px-3 py-5 text-center hover:border-lagoon-400"
                    >
                      <Video className="text-slate-300" size={22} />
                      <span className="text-[12px] font-bold text-slate-600">ভিডিও যোগ (১টি)</span>
                    </button>
                    <input
                      ref={videoRef}
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={(e) => {
                        setVideo(e.target.files?.[0] || null);
                        e.target.value = "";
                      }}
                    />
                    {video && (
                      <div className="mt-1.5 flex items-center justify-between rounded-lg bg-slate-50 px-2.5 py-1.5 text-[11px]">
                        <span className="truncate">{video.name}</span>
                        <button type="button" onClick={() => setVideo(null)}>
                          <X size={12} className="text-slate-400 hover:text-red-500" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </fieldset>

              {error && (
                <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-[13px] font-semibold text-red-700">
                  {error}
                </p>
              )}
            </form>
          )}
        </div>

        {!loading && (
          <div className="flex flex-col gap-2 border-t border-slate-100 px-5 py-3.5 sm:flex-row sm:justify-end">
            <button type="button" onClick={onClose} disabled={saving} className="btn-secondary px-4 py-2 text-[13px] font-bold">
              বাতিল
            </button>
            <button
              type="submit"
              form="edit-report-form"
              disabled={saving}
              className="btn-primary inline-flex items-center justify-center gap-2 px-5 py-2 text-[13px] font-bold disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Loader2 size={15} className="animate-spin" /> সংরক্ষণ হচ্ছে…
                </>
              ) : (
                "সংরক্ষণ করুন"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
