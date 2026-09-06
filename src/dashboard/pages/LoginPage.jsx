import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, CircleAlert, LoaderCircle, LockKeyhole, Phone } from "lucide-react";
import AuthAside from "../components/layout/AuthAside";
import { BrandMark } from "../components/dashboard/Sidebar";
import { useAuth } from "../context/AuthContext";
import { ROLES } from "../config/roleConfig";
import { cn } from "../utils/cn.js";

export default function LoginPage() {
  const { login, loginWithRole, isAuthed, status } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/dashboard";

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(null); // 'form' | role
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "authed") navigate(from, { replace: true });
  }, [status, isAuthed, navigate, from]);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!/^01[3-9]\d{8}$/.test(phone.trim())) {
      setError("সঠিক ১১ সংখ্যার মোবাইল নম্বর দিন (যেমন: 01712345678)");
      return;
    }
    if (!password) {
      setError("পাসওয়ার্ড দিন");
      return;
    }
    setBusy("form");
    try {
      await login(phone.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "লগইন করা যায়নি");
    } finally {
      setBusy(null);
    }
  };

  const demoLogin = async (role) => {
    setBusy(role);
    setError("");
    try {
      await loginWithRole(role);
      navigate(from, { replace: true });
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_520px]">
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
          <div className="w-full max-w-md animate-fade-up">
            <h1 className="text-2xl font-bold text-slate-800">আপনার অ্যাকাউন্টে লগইন করুন</h1>
            <p className="mt-1.5 text-sm text-slate-500">দুর্যোগ ব্যবস্থাপনার ভূমিকা অনুযায়ী ড্যাশবোর্ড স্বয়ংক্রিয়ভাবে খুলবে।</p>

            {error && (
              <p className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-[13px] font-medium text-red-700">
                <CircleAlert size={16} className="mt-0.5 shrink-0" />
                {error}
              </p>
            )}

            <form onSubmit={submit} className="mt-6 space-y-4">
              <div>
                <label className="label" htmlFor="phone">মোবাইল নম্বর</label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input id="phone" inputMode="numeric" className="input pl-10" placeholder="01712345678" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
              </div>
              <div>
                <label className="label" htmlFor="password">পাসওয়ার্ড</label>
                <div className="relative">
                  <LockKeyhole size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input id="password" type="password" className="input pl-10" placeholder="আপনার পাসওয়ার্ড" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
              </div>
              <button type="submit" disabled={!!busy} className="btn-primary w-full !py-3">
                {busy === "form" ? <LoaderCircle size={17} className="animate-spin" /> : null}
                লগইন করুন
              </button>
            </form>

            <div className="my-6 flex items-center gap-3 text-[11px] font-bold uppercase tracking-wider text-slate-300">
              <span className="h-px flex-1 bg-slate-200" />
              ডেমো ভূমিকায় এক ক্লিকে প্রবেশ
              <span className="h-px flex-1 bg-slate-200" />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {Object.values(ROLES).map((r) => (
                <button
                  key={r.key}
                  onClick={() => demoLogin(r.key)}
                  disabled={!!busy}
                  className={cn(
                    "group flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white p-2.5 text-left transition hover:-translate-y-0.5 hover:border-lagoon-300 hover:shadow-card active:scale-[0.98] disabled:opacity-60"
                  )}
                >
                  <span className={cn("inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-white", r.avatar)}>
                    {busy === r.key ? <LoaderCircle size={15} className="animate-spin" /> : <r.icon size={15} />}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[12px] font-bold text-slate-700 group-hover:text-lagoon-700">{r.label}</span>
                    <span className="block text-[10px] text-slate-400">{r.labelEn}</span>
                  </span>
                </button>
              ))}
            </div>

            <p className="mt-6 text-center text-[13px] text-slate-500">
              অ্যাকাউন্ট নেই?{" "}
              <Link to="/register" className="font-bold text-lagoon-600 hover:text-lagoon-700">
                নিবন্ধন করুন
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
