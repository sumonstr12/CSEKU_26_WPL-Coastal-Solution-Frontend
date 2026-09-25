import { useState } from "react";
import { Link } from "react-router-dom";
import { Camera, CircleCheck, FilePlus, LoaderCircle, LocateFixed, MapPin, Megaphone, Upload, Users } from "lucide-react";
import ErrorState from "../../components/dashboard/ErrorState";
import Panel, { PageHeader } from "../../components/dashboard/Panel";
import { SEVERITY, DISASTER_TYPES } from "../../config/disasterTypes";
import { useAuth } from "../../context/AuthContext";
import myaxios from "../../../utils/myaxios";
import { bn } from "../../utils/format";
import { cn } from "../../utils/cn.js";

const SEVERITY_OPTS = [
  
  { key: "LOW", hint: "সাধারণ পর্যবেক্ষণযোগ্য ঘটনা" },
  { key: "MODERATE", hint: "ক্ষতি শুরু হয়েছে, নজরদারি প্রয়োজন" },
  { key: "HIGH", hint: "দ্রুত সাড়া প্রয়োজন" },
  { key: "CRITICAL", hint: "জীবন-সম্পদের তাৎক্ষণিক ঝুঁকি" },
];

export default function ReportDisasterPage() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    type: "surge",
    severity: "MODERATE",
    title: "",
    place: "",
    district: "",
    upazila: "",
    description: "",
    affected: "",
    photo: null,
  });
  const [locating, setLocating] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(null);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setError("আপনার browser location support করে না");
      return;
    }

    setLocating(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;

        set(
          "place",
          `GPS: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
        );

        setLocating(false);
      },
      () => {
        setError("GPS location পাওয়া যায়নি। অনুগ্রহ করে স্থানটি manually লিখুন।");
        setLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.title.trim()) return setError("রিপোর্টের শিরোনাম লিখুন");
    if (!form.place.trim()) return setError("ঘটনার স্থান লিখুন অথবা GPS ব্যবহার করুন");
    if (form.description.trim().length < 20) return setError("বর্ণনা কমপক্ষে ২০ অক্ষরের হতে হবে — সহায়তার জন্য যথেষ্ট তথ্য দিন");
    if (!form.district.trim()) {
      return setError("জেলার নাম লিখুন");
    }

    if (!form.upazila.trim()) {
      return setError("উপজেলার নাম লিখুন");
    }
    setBusy(true);
    try {
      const selectedType = DISASTER_TYPES[form.type];

    if (!selectedType?.backendId) {
      throw new Error("Invalid disaster type");
    }

    const formData = new FormData();

    formData.append("category", String(selectedType.backendId));
    formData.append("description", form.description.trim());
    formData.append("description_bn", form.description.trim());

    formData.append("situation", "stable");

    const fullAddress = [
      form.place.trim(),
      form.upazila.trim(),
      form.district.trim(),
    ]
      .filter(Boolean)
      .join(", ");

    formData.append("address", fullAddress);

    formData.append("district", form.district.trim());
    formData.append("upazila", form.upazila.trim());
    formData.append("village", form.place.trim());

    formData.append(
      "reporter_name",
      user?.name || user?.nameEn || ""
    );

    formData.append("is_anonymous", "false");

    formData.append(
      "affected_people_estimate",
      String(Number(form.affected) || 0)
    );

    formData.append("is_sos", "false");

    if (form.photo) {
      formData.append("files", form.photo);
    }

    const response = await myaxios.post(
      "incidents/create/",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    const report = response.data?.data || response.data;

    setDone(report);
    } catch {
      setError("রিপোর্ট জমা দেওয়া যায়নি — আবার চেষ্টা করুন");
    } finally {
      setBusy(false);
    }
  };

  /* ------- success screen ------- */
  if (done) {
    return (
      <div className="mx-auto max-w-xl">
        <div className="card flex flex-col items-center px-6 py-12 text-center">
          <span className="relative inline-flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
            <span className="absolute inset-0 animate-ping-soft rounded-full bg-emerald-200/60" />
            <CircleCheck size={40} className="relative" />
          </span>
          <h1 className="mt-5 text-xl font-bold text-slate-800">রিপোর্ট সফলভাবে জমা হয়েছে!</h1>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-500">
            আপনার রিপোর্ট নম্বর <b className="text-lagoon-700">{done.id}</b>। স্থানীয় স্বেচ্ছাসেবক ও প্রশাসনের কাছে যাচাইয়ের জন্য পাঠানো হয়েছে। অগ্রগতি "আমার রিপোর্ট" থেকে দেখুন।
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link to="/dashboard/my-reports" className="btn-primary">আমার রিপোর্ট দেখুন</Link>
            <button onClick={() => setDone(null)} className="btn-secondary">নতুন রিপোর্ট করুন</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="দুর্যোগ রিপোর্ট করুন"
        subtitle="সম্ভব হলে ছবিসহ সঠিক তথ্য দিন — মিথ্যা রিপোর্ট আইনানুগ ব্যবস্থার কারণ হতে পারে"
        crumbs="আমার কার্যক্রম / রিপোর্ট করুন"
      />

      {error && (
        <div className="mb-5">
          <ErrorState title={error} onRetry={null} className="card !py-6" />
        </div>
      )}

      <form onSubmit={submit} className="space-y-5">
        {/* disaster type */}
        <Panel title="দুর্যোগের ধরন নির্বাচন করুন" icon={Megaphone}>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {Object.entries(DISASTER_TYPES).map(([key, t]) => (
              <button
                type="button"
                key={key}
                onClick={() => set("type", key)}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition active:scale-[0.97]",
                  form.type === key ? "border-lagoon-500 bg-lagoon-50/60 shadow-sm" : "border-slate-100 bg-white hover:border-slate-200"
                )}
              >
                <span className={cn("inline-flex h-11 w-11 items-center justify-center rounded-xl", t.iconBox)}>
                  <t.icon size={21} />
                </span>
                <span className={cn("text-[13px] font-bold", form.type === key ? "text-lagoon-800" : "text-slate-600")}>{t.label}</span>
              </button>
            ))}
          </div>
        </Panel>

        {/* location */}
        <Panel title="ঘটনার অবস্থান" icon={MapPin}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="label">স্থান / এলাকা</label>
              <div className="relative">
                <input className="input pr-40" placeholder="যেমন: দক্ষিণ বেদকাশী বাজার সংলগ্ন" value={form.place} onChange={(e) => set("place", e.target.value)} />
                <button type="button" onClick={useMyLocation} disabled={locating} className="btn-soft absolute right-1.5 top-1/2 -translate-y-1/2 !px-3 !py-1.5 text-[12px]">
                  {locating ? <LoaderCircle size={13} className="animate-spin" /> : <LocateFixed size={13} />}
                  আমার অবস্থান
                </button>
              </div>
            </div>
            <div>
              <label className="label">জেলা</label>
              <div>
              <label className="label">জেলা *</label>
              <input
                className="input"
                placeholder="যেমন: সাতক্ষীরা"
                value={form.district}
                onChange={(e) => set("district", e.target.value)}
              />
            </div>
            </div>
            <div>
              <label className="label">উপজেলা</label>
              <div>
              <label className="label">উপজেলা *</label>
              <input
                className="input"
                placeholder="যেমন: শ্যামনগর"
                value={form.upazila}
                onChange={(e) => set("upazila", e.target.value)}
              />
            </div>
            </div>
          </div>
        </Panel>

        {/* details */}
        <Panel title="ঘটনার বিবরণ" icon={FilePlus}>
          <div className="space-y-4">
            <div>
              <label className="label">রিপোর্টের শিরোনাম</label>
              <input className="input" placeholder="যেমন: বাঁধ ভেঙে গ্রামে লবণ পানি ঢুকছে" value={form.title} onChange={(e) => set("title", e.target.value)} />
            </div>
            <div>
              <label className="label">গুরুত্ব নির্ধারণ করুন</label>
              <div className="grid gap-2 sm:grid-cols-2">
                {SEVERITY_OPTS.map((s) => (
                  <button
                    type="button"
                    key={s.key}
                    onClick={() => set("severity", s.key)}
                    className={cn(
                      "flex items-start gap-3 rounded-xl border-2 p-3 text-left transition active:scale-[0.98]",
                      form.severity === s.key ? "border-lagoon-500 bg-lagoon-50/60" : "border-slate-100 hover:border-slate-200"
                    )}
                  >
                    <span className={cn("mt-1 h-3.5 w-3.5 shrink-0 rounded-full", SEVERITY[s.key].dot)} />
                    <span>
                      <span className={cn("block text-[13px] font-bold", form.severity === s.key ? "text-lagoon-800" : "text-slate-700")}>{SEVERITY[s.key].label}</span>
                      <span className="block text-[11px] leading-snug text-slate-400">{s.hint}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="label">বিস্তারিত বর্ণনা</label>
              <textarea rows={4} className="input resize-none leading-relaxed" placeholder="কী ঘটেছে, কখন থেকে, কতজন ক্ষতিগ্রস্ত, বর্তমান অবস্থা — যত বিস্তারিত সম্ভব..." value={form.description} onChange={(e) => set("description", e.target.value)} />
              <p className="mt-1 text-right text-[11px] text-slate-400">{bn(form.description.length)} অক্ষর</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">আনুমানিক ক্ষতিগ্রস্ত মানুষ (ঐচ্ছিক)</label>
                <div className="relative">
                  <Users size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input inputMode="numeric" className="input pl-9" placeholder="যেমন: ৫০" value={form.affected} onChange={(e) => set("affected", e.target.value)} />
                </div>
              </div>
              <div>
                <label className="label">ছবি সংযুক্ত করুন (ঐচ্ছিক)</label>
                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 px-4 py-2.5 text-[13px] font-semibold text-slate-400 transition hover:border-lagoon-400 hover:text-lagoon-600">
                  {form.photo ? <Camera size={15} className="text-lagoon-500" /> : <Upload size={15} />}
                  {form.photo ? form.photo.name : "ছবি নির্বাচন করুন"}
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => set("photo", e.target.files?.[0] || null)} />
                </label>
              </div>
            </div>
          </div>
        </Panel>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-[12px] text-slate-400">
            রিপোর্টকারী: <b className="text-slate-600">{user.name}</b> • {user.phone} — যাচাইয়ের জন্য যোগাযোগ করা হতে পারে
          </p>
          <button type="submit" disabled={busy} className="btn-primary px-6">
            {busy ? <LoaderCircle size={16} className="animate-spin" /> : <Megaphone size={16} />}
            রিপোর্ট জমা দিন
          </button>
        </div>
      </form>
    </div>
  );
}
