import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, CircleAlert, CircleCheck, LoaderCircle } from "lucide-react";
import AuthAside from "../components/layout/AuthAside";
import { BrandMark } from "../components/dashboard/Sidebar";
import { useAuth } from "../context/AuthContext";
import { areaTree } from "../services/mock/mockData";
import { bn } from "../utils/format";
import { cn } from "../utils/cn.js";

const ROLE_OPTIONS = [
  { value: "CITIZEN", label: "নাগরিক — আমি দুর্যোগ রিপোর্ট করতে চাই" },
  { value: "COMMUNITY_VOLUNTEER", label: "কমিউনিটি স্বেচ্ছাসেবক — স্থানীয় কার্যক্রম সহায়তা করতে চাই" },
];

export default function RegisterPage() {
  const { register, isAuthed } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", phoneRaw: "", role: "CITIZEN", division: "", district: "", upazila: "", password: "", confirm: "" });
  const [agree, setAgree] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthed) navigate("/dashboard", { replace: true });
  }, [isAuthed, navigate]);

  const divisions = Object.keys(areaTree);
  const districts = useMemo(() => (form.division ? Object.keys(areaTree[form.division]) : []), [form.division]);
  const upazilas = useMemo(() => (form.district ? areaTree[form.division][form.district] : []), [form.division, form.district]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v, ...(k === "division" ? { district: "", upazila: "" } : {}), ...(k === "district" ? { upazila: "" } : {}) }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.name.trim().length < 3) return setError("আপনার পূর্ণ নাম লিখুন");
    if (!/^01[3-9]\d{8}$/.test(form.phoneRaw.trim())) return setError("সঠিক ১১ সংখ্যার মোবাইল নম্বর দিন");
    if (!form.division || !form.district || !form.upazila) return setError("আপনার এলাকা নির্বাচন করুন");
    if (form.password.length < 6) return setError("পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে");
    if (form.password !== form.confirm) return setError("দুটি পাসওয়ার্ড মিলছে না");
    if (!agree) return setError("শর্তাবলীতে সম্মতি দিন");

    setBusy(true);
    try {
      await register({
        name: form.name.trim(),
        phoneRaw: form.phoneRaw.trim(),
        phoneDisplay: bn(form.phoneRaw.trim().replace(/(\d{5})(\d{6})/, "$1-$2")),
        role: form.role,
        division: form.division.replace(" বিভাগ", ""),
        district: form.district,
        upazila: form.upazila,
      });
      navigate("/dashboard", { replace: true });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_560px]">
      <AuthAside />
      <div className="flex flex-col bg-white">
        <div className="flex items-center justify-between px-5 py-4 sm:px-8">
          <BrandMark />
          <Link to="/" className="btn-ghost text-[13px]">
            <ArrowLeft size={15} />
            হোমে ফিরুন
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center px-5 pb-12 sm:px-8">
          <div className="w-full max-w-lg animate-fade-up">
            <h1 className="text-2xl font-bold text-slate-800">নতুন অ্যাকাউন্ট তৈরি করুন</h1>
            <p className="mt-1.5 text-sm text-slate-500">উপকূলীয় দুর্যোগ নেটওয়ার্কে যুক্ত হোন — রিপোর্ট করুন, সহায়তা পান, প্রতিবেশীকে জানান।</p>

            {error && (
              <p className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-[13px] font-medium text-red-700">
                <CircleAlert size={16} className="mt-0.5 shrink-0" />
                {error}
              </p>
            )}

            <form onSubmit={submit} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="label">পূর্ণ নাম</label>
                  <input className="input" placeholder="যেমন: রাশেদা খাতুন" value={form.name} onChange={(e) => set("name", e.target.value)} />
                </div>
                <div className="sm:col-span-2">
                  <label className="label">মোবাইল নম্বর</label>
                  <input inputMode="numeric" className="input" placeholder="01XXXXXXXXX" value={form.phoneRaw} onChange={(e) => set("phoneRaw", e.target.value)} />
                </div>
                <div className="sm:col-span-2">
                  <label className="label">আপনি যেভাবে যুক্ত হতে চান</label>
                  <div className="grid gap-2">
                    {ROLE_OPTIONS.map((r) => (
                      <label key={r.value} className={cn("flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-[13px] font-semibold transition", form.role === r.value ? "border-lagoon-400 bg-lagoon-50/60 text-lagoon-800" : "border-slate-200 text-slate-500 hover:border-slate-300")}>
                        <input type="radio" name="role" className="hidden" checked={form.role === r.value} onChange={() => set("role", r.value)} />
                        <span className={cn("flex h-4.5 w-4.5 h-[18px] w-[18px] items-center justify-center rounded-full border-2", form.role === r.value ? "border-lagoon-600" : "border-slate-300")}>
                          {form.role === r.value && <span className="h-2.5 w-2.5 rounded-full bg-lagoon-600" />}
                        </span>
                        {r.label}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="label">বিভাগ</label>
                  <select className="input" value={form.division} onChange={(e) => set("division", e.target.value)}>
                    <option value="">নির্বাচন করুন</option>
                    {divisions.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">জেলা</label>
                  <select className="input" value={form.district} onChange={(e) => set("district", e.target.value)} disabled={!form.division}>
                    <option value="">নির্বাচন করুন</option>
                    {districts.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="label">উপজেলা</label>
                  <select className="input" value={form.upazila} onChange={(e) => set("upazila", e.target.value)} disabled={!form.district}>
                    <option value="">নির্বাচন করুন</option>
                    {upazilas.map((u) => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">পাসওয়ার্ড</label>
                  <input type="password" className="input" placeholder="কমপক্ষে ৬ অক্ষর" value={form.password} onChange={(e) => set("password", e.target.value)} />
                </div>
                <div>
                  <label className="label">পাসওয়ার্ড নিশ্চিত করুন</label>
                  <input type="password" className="input" placeholder="আবার লিখুন" value={form.confirm} onChange={(e) => set("confirm", e.target.value)} />
                </div>
              </div>

              <label className="flex cursor-pointer items-start gap-2.5 text-[12.5px] text-slate-500">
                <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-lagoon-600" />
                আমি প্ল্যাটফর্মের ব্যবহারের শর্তাবলী মেনে নিচ্ছি এবং সত্য তথ্য রিপোর্ট করার অঙ্গীকার করছি। মিথ্যা তথ্য দেওয়া দণ্ডনীয় অপরাধ।
              </label>

              <button type="submit" disabled={busy} className="btn-primary w-full !py-3">
                {busy ? <LoaderCircle size={17} className="animate-spin" /> : <CircleCheck size={17} />}
                নিবন্ধন সম্পন্ন করুন
              </button>
            </form>

            <p className="mt-6 text-center text-[13px] text-slate-500">
              ইতোমধ্যে অ্যাকাউন্ট আছে?{" "}
              <Link to="/login" className="font-bold text-lagoon-600 hover:text-lagoon-700">
                লগইন করুন
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
