import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Lock,
  LogIn,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import ErrorMessage from "@/components/ErrorMessage";
import Logo from "@/components/Logo";
import { classNames } from "@/lib/utils";
import shelterImg from "@/assets/shelter.jpg";
export default function Login() {
  const navigate = useNavigate();
  const [identity, setIdentity] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const submit = (e) => {
    e.preventDefault();
    const next = {};
    if (!identity.trim()) next.identity = "মোবাইল নম্বর বা ইমেইল দিন";
    if (password.length < 6)
      next.password = "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে";
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      window.setTimeout(() => navigate("/"), 1200);
    }, 900);
  };
  return (
    <div className="site-container flex items-center justify-center py-10 md:py-16">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-3xl border border-black/5 bg-white shadow-2xl lg:grid-cols-2">
        {/* Form */}
        <div className="p-6 sm:p-10">
          <Link
            to="/"
            className="inline-block rounded-lg"
            aria-label="হোমে ফিরে যান"
          >
            <Logo compact />
          </Link>
          <h1 className="font-display mt-6 text-2xl font-bold text-ink-950 sm:text-[27px]">
            লগইন করুন
          </h1>
          <p className="mt-1.5 text-[13.5px] text-ink-500">
            আপনার রিপোর্ট, সংরক্ষিত আশ্রয়কেন্দ্র ও এলাকা-নির্দিষ্ট সতর্কতা
            দেখতে।
          </p>

          {success ? (
            <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
              <ShieldCheck
                className="mx-auto h-10 w-10 text-emerald-600"
                aria-hidden="true"
              />
              <p className="mt-3 text-[16px] font-bold text-emerald-900">
                লগইন সফল হয়েছে
              </p>
              <p className="mt-1 text-[13px] text-emerald-800/80">
                হোমপেজে নিয়ে যাওয়া হচ্ছে…
              </p>
              <Loader2
                className="mx-auto mt-4 h-5 w-5 animate-spin text-emerald-700"
                aria-hidden="true"
              />
            </div>
          ) : (
            <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
              <div>
                <label htmlFor="login-id" className="label">
                  মোবাইল নম্বর বা ইমেইল
                </label>
                <div className="relative">
                  <UserRound
                    className="pointer-events-none absolute top-1/2 left-3.5 h-4.5 w-4.5 -translate-y-1/2 text-ink-300"
                    aria-hidden="true"
                  />
                  <input
                    id="login-id"
                    type="text"
                    autoComplete="username"
                    className={classNames(
                      "input !pl-10",
                      errors.identity && "input-error",
                    )}
                    placeholder="01XXXXXXXXX অথবা name@email.com"
                    value={identity}
                    onChange={(e) => {
                      setIdentity(e.target.value);
                      setErrors((er) => ({
                        ...er,
                        identity: undefined,
                      }));
                    }}
                  />
                </div>
                <ErrorMessage message={errors.identity} />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="login-pass" className="label">
                    পাসওয়ার্ড
                  </label>
                  <span className="cursor-pointer text-[12.5px] font-semibold text-teal-700 hover:underline">
                    পাসওয়ার্ড ভুলে গেছেন?
                  </span>
                </div>
                <div className="relative">
                  <KeyRound
                    className="pointer-events-none absolute top-1/2 left-3.5 h-4.5 w-4.5 -translate-y-1/2 text-ink-300"
                    aria-hidden="true"
                  />
                  <input
                    id="login-pass"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    className={classNames(
                      "input !px-10",
                      errors.password && "input-error",
                    )}
                    placeholder="আপনার পাসওয়ার্ড"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrors((er) => ({
                        ...er,
                        password: undefined,
                      }));
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={
                      showPassword ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখান"
                    }
                    className="absolute top-1/2 right-2.5 -translate-y-1/2 cursor-pointer rounded-md p-1.5 text-ink-400 hover:bg-sand-100"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4.5 w-4.5" aria-hidden="true" />
                    ) : (
                      <Eye className="h-4.5 w-4.5" aria-hidden="true" />
                    )}
                  </button>
                </div>
                <ErrorMessage message={errors.password} />
              </div>

              <label className="flex cursor-pointer items-center gap-2.5 text-[13.5px] font-medium text-ink-700">
                <input
                  type="checkbox"
                  className="control-check"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                এই ডিভাইসে মনে রাখুন
              </label>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full !py-3.5"
              >
                {loading ? (
                  <>
                    <Loader2
                      className="h-4.5 w-4.5 animate-spin"
                      aria-hidden="true"
                    />
                    যাচাই করা হচ্ছে…
                  </>
                ) : (
                  <>
                    <LogIn className="h-4.5 w-4.5" aria-hidden="true" />
                    লগইন
                  </>
                )}
              </button>

              <p className="rounded-xl bg-sand-50 px-3.5 py-2.5 text-center text-[12px] text-ink-500">
                এটি একটি ডেমো সংস্করণ — যেকোনো মোবাইল/ইমেইল ও ৬+ অক্ষরের
                পাসওয়ার্ড দিয়ে প্রবেশ করা যাবে।
              </p>
            </form>
          )}

          {!success && (
            <p className="mt-6 border-t border-stone-100 pt-5 text-center text-[13.5px] text-ink-500">
              অ্যাকাউন্ট নেই?{" "}
              <Link
                to="/register"
                className="font-bold text-teal-700 hover:underline"
              >
                নিবন্ধন করুন
                <ArrowRight
                  className="ml-1 inline h-3.5 w-3.5"
                  aria-hidden="true"
                />
              </Link>
            </p>
          )}
        </div>

        {/* Visual */}
        <div className="relative hidden lg:block">
          <img
            src={shelterImg}
            alt="উপকূলীয় সাইক্লোন শেল্টারে নিরাপদে অবস্থান নিচ্ছে স্থানীয় মানুষ"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div
            className="absolute inset-0 bg-deepsea-950/55"
            aria-hidden="true"
          />
          <div className="absolute inset-x-0 bottom-0 p-8 text-white">
            <p className="chip border-white/25 bg-white/10 text-white">
              <Lock className="h-3.5 w-3.5" aria-hidden="true" />
              নিরাপদ অ্যাক্সেস
            </p>
            <p className="font-display mt-3 text-[22px] leading-snug font-bold">
              সঠিক তথ্য, সঠিক সময়ে — আপনার এলাকার জন্য।
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-teal-100/85">
              লগইন করে নিজ এলাকার সতর্কতা পছন্দ করুন, রিপোর্টের অগ্রগতি দেখুন ও
              স্বেচ্ছাসেবক দলের সাথে যুক্ত থাকুন।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
