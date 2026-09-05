import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  Eye,
  EyeOff,
  HandHeart,
  KeyRound,
  Loader2,
  Phone,
  RefreshCw,
  ShieldCheck,
  UserPlus,
  UserRound,
} from "lucide-react";
import ErrorMessage from "@/components/ErrorMessage";
import Logo from "@/components/Logo";
import { DISTRICT_NAMES } from "@/data/districts";
import { bn, classNames } from "@/lib/utils";
import communityImg from "@/assets/community.jpg";
import myaxios from "@/utils/myaxios";

const ROLE_OPTIONS = [
  {
    value: "CITIZEN",
    label: "সাধারণ নাগরিক",
    hint: "রিপোর্ট ও সতর্কতা",
  },
  {
    value: "COMMUNITY_VOLUNTEER",
    label: "কমিউনিটি স্বেচ্ছাসেবক",
    hint: "যাচাই ও সহায়তা",
  },
  {
    value: "RESPONDER",
    label: "জরুরি সাড়া প্রদানকারী",
    hint: "দুর্যোগে দ্রুত সাড়া ও উদ্ধার",
  },
  {
    value: "LOCAL_AUTHORITY",
    label: "স্থানীয় কর্তৃপক্ষ",
    hint: "স্থানীয় পর্যায়ে সমন্বয় ও ব্যবস্থাপনা",
  },
  {
    value: "DISASTER_MANAGEMENT_OFFICER",
    label: "দুর্যোগ ব্যবস্থাপনা কর্মকর্তা",
    hint: "দুর্যোগ ব্যবস্থাপনা ও তদারকি",
  },
];

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState("form");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [district, setDistrict] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [terms, setTerms] = useState(false);
  const [otp, setOtp] = useState("");
  const [verificationId, setVerificationId] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMsg, setResendMsg] = useState("");

  const clearError = (key) =>
    setErrors((e) => ({
      ...e,
      [key]: undefined,
    }));

  // Step 1: Submit Form -> Call API (/auth/register/request/)
  const submit = async (e) => {
    e.preventDefault();
    const next = {};
    if (name.trim().length < 3) next.name = "পুরো নাম লিখুন";
    if (!/^01[3-9]\d{8}$/.test(phone))
      next.phone = "সঠিক ১১ সংখ্যার মোবাইল নম্বর দিন (01XXXXXXXXX)";
    if (!district) next.district = "আপনার জেলা নির্বাচন করুন";
    if (!role) next.role = "একটি ভূমিকা নির্বাচন করুন";
    if (password.length < 8)
      next.password = "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে";
    if (confirm !== password) next.confirm = "দুটি পাসওয়ার্ড মিলছে না";
    if (!terms) next.terms = "শর্তাবলীতে সম্মতি দিন";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setLoading(true);
    try {
      const response = await myaxios.post("auth/register/request/", {
        phone_number: phone,
        password: password,
        full_name: name,
        role: role,
        district: district,
      });

      if (response.data?.status) {
        setVerificationId(response.data.verification_id);
        setStep("otp");
        window.scrollTo({ top: 0 });
      }
    } catch (err) {
      const apiErrors = err.response?.data?.errors;
      const apiMsg = err.response?.data?.message;

      if (apiErrors) {
        const formattedErrors = {};
        if (apiErrors.phone_number) formattedErrors.phone = apiErrors.phone_number[0];
        if (apiErrors.password) formattedErrors.password = apiErrors.password[0];
        if (apiErrors.full_name) formattedErrors.name = apiErrors.full_name[0];
        if (apiErrors.role) formattedErrors.role = apiErrors.role[0];
        setErrors(formattedErrors);
      } else if (apiMsg) {
        setErrors({ form: apiMsg });
      } else {
        setErrors({ form: "একটি সমস্যা হয়েছে। আবার চেষ্টা করুন।" });
      }
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP -> Call API (/auth/register/verify/)
  const verifyOtp = async (e) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(otp)) {
      setErrors({
        otp: "৬ সংখ্যার যাচাইকরণ কোডটি দিন",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await myaxios.post("auth/register/verify/", {
        verification_id: verificationId,
        otp: otp,
      });

      if (response.data?.status) {
        // Save JWT Token to LocalStorage
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
        }
        setStep("done");
      }
    } catch (err) {
      const apiMsg = err.response?.data?.message;
      setErrors({
        otp: apiMsg || "যাচাইকরণ ব্যর্থ হয়েছে। সঠিক OTP দিন।",
      });
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Resend OTP -> Call API (/auth/register/resend/)
  const handleResendOtp = async () => {
    if (!verificationId) return;
    setResendLoading(true);
    setResendMsg("");
    try {
      const response = await myaxios.post("auth/register/resend/", {
        verification_id: verificationId,
      });
      if (response.data?.status) {
        setResendMsg("নতুন যাচাইকরণ কোড পাঠানো হয়েছে।");
      }
    } catch (err) {
      const apiMsg = err.response?.data?.message;
      setErrors({ otp: apiMsg || "নতুন কোড পাঠাতে ব্যর্থ হয়েছে।" });
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="site-container flex items-center justify-center py-10 md:py-16">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-black/5 bg-white shadow-2xl lg:grid-cols-[1fr_1.05fr]">
        {/* Visual */}
        <div className="relative hidden lg:block">
          <img
            src={communityImg}
            alt="উপকূলীয় স্কুল প্রাঙ্গণে দুর্যোগ সচেতনতা প্রশিক্ষণে অংশ নিচ্ছে স্থানীয় মানুষ"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div
            className="absolute inset-0 bg-deepsea-950/55"
            aria-hidden="true"
          />
          <div className="absolute inset-x-0 bottom-0 p-8 text-white">
            <p className="chip border-white/25 bg-white/10 text-white">
              <HandHeart className="h-3.5 w-3.5" aria-hidden="true" />
              কমিউনিটি নেটওয়ার্ক
            </p>
            <p className="font-display mt-3 text-[22px] leading-snug font-bold">
              নিবন্ধন মানেই দায়িত্ব — আপনার এলাকার নিরাপত্তায় অংশীদার হোন।
            </p>
            <ul className="mt-3 space-y-1.5 text-[13px] text-teal-100/85">
              <li className="flex items-center gap-2">
                <CheckCircle2
                  className="h-4 w-4 text-amber-300"
                  aria-hidden="true"
                />
                এলাকা-নির্দিষ্ট এসএমএস সতর্কতা
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2
                  className="h-4 w-4 text-amber-300"
                  aria-hidden="true"
                />
                স্বেচ্ছাসেবক প্রশিক্ষণে অংশ নেওয়ার সুযোগ
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2
                  className="h-4 w-4 text-amber-300"
                  aria-hidden="true"
                />
                নিজের রিপোর্টের অগ্রগতি ট্র্যাক করা
              </li>
            </ul>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-10">
          <Link
            to="/"
            className="inline-block rounded-lg"
            aria-label="হোমে ফিরে যান"
          >
            <Logo compact />
          </Link>

          {step === "form" && (
            <>
              <h1 className="font-display mt-6 text-2xl font-bold text-ink-950 sm:text-[27px]">
                নিবন্ধন করুন
              </h1>
              <p className="mt-1.5 text-[13.5px] text-ink-500">
                দুই মিনিটে অ্যাকাউন্ট তৈরি করুন — মোবাইল নম্বর যাচাই করা হবে।
              </p>

              <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
                <div>
                  <label htmlFor="reg-name" className="label">
                    পুরো নাম
                  </label>
                  <div className="relative">
                    <UserRound
                      className="pointer-events-none absolute top-1/2 left-3.5 h-4.5 w-4.5 -translate-y-1/2 text-ink-300"
                      aria-hidden="true"
                    />
                    <input
                      id="reg-name"
                      type="text"
                      autoComplete="name"
                      className={classNames(
                        "input pl-10!",
                        errors.name && "input-error",
                      )}
                      placeholder="যেমন: আব্দুল করিম"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        clearError("name");
                      }}
                    />
                  </div>
                  <ErrorMessage message={errors.name} />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="reg-phone" className="label">
                      মোবাইল নম্বর
                    </label>
                    <div className="relative">
                      <Phone
                        className="pointer-events-none absolute top-1/2 left-3.5 h-4.5 w-4.5 -translate-y-1/2 text-ink-300"
                        aria-hidden="true"
                      />
                      <input
                        id="reg-phone"
                        type="tel"
                        inputMode="numeric"
                        autoComplete="tel"
                        className={classNames(
                          "input pl-10!",
                          errors.phone && "input-error",
                        )}
                        placeholder="01XXXXXXXXX"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          clearError("phone");
                        }}
                      />
                    </div>
                    <ErrorMessage message={errors.phone} />
                  </div>
                  <div>
                    <label htmlFor="reg-district" className="label">
                      জেলা
                    </label>
                    <select
                      id="reg-district"
                      className={classNames(
                        "input",
                        errors.district && "input-error",
                      )}
                      value={district}
                      onChange={(e) => {
                        setDistrict(e.target.value);
                        clearError("district");
                      }}
                    >
                      <option value="">নির্বাচন করুন</option>
                      {DISTRICT_NAMES.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                    <ErrorMessage message={errors.district} />
                  </div>
                </div>

                <fieldset>
                  <legend className="label">আপনি যেভাবে যুক্ত হতে চান</legend>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {ROLE_OPTIONS.map((option) => (
                      <label
                        key={option.value}
                        className={classNames(
                          "cursor-pointer rounded-xl border-2 px-3 py-2.5 text-center transition-all",
                          role === option.value
                            ? "border-teal-600 bg-teal-50"
                            : "border-stone-200 hover:border-teal-600/40",
                        )}
                      >
                        <input
                          type="radio"
                          name="role"
                          value={option.value}
                          checked={role === option.value}
                          onChange={() => {
                            setRole(option.value);
                            clearError("role");
                          }}
                          className="sr-only"
                        />
                        <span
                          className={classNames(
                            "block text-[13.5px] font-bold",
                            role === option.value
                              ? "text-teal-900"
                              : "text-ink-900",
                          )}
                        >
                          {option.label}
                        </span>
                        <span className="block text-[11px] text-ink-500">
                          {option.hint}
                        </span>
                      </label>
                    ))}
                  </div>
                  <ErrorMessage message={errors.role} />
                </fieldset>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="reg-pass" className="label">
                      পাসওয়ার্ড
                    </label>
                    <div className="relative">
                      <KeyRound
                        className="pointer-events-none absolute top-1/2 left-3.5 h-4.5 w-4.5 -translate-y-1/2 text-ink-300"
                        aria-hidden="true"
                      />
                      <input
                        id="reg-pass"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        className={classNames(
                          "input px-10!",
                          errors.password && "input-error",
                        )}
                        placeholder="কমপক্ষে ৮ অক্ষর"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          clearError("password");
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
                  <div>
                    <label htmlFor="reg-confirm" className="label">
                      নিশ্চিত পাসওয়ার্ড
                    </label>
                    <input
                      id="reg-confirm"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      className={classNames(
                        "input",
                        errors.confirm && "input-error",
                      )}
                      placeholder="পাসওয়ার্ড আবার লিখুন"
                      value={confirm}
                      onChange={(e) => {
                        setConfirm(e.target.value);
                        clearError("confirm");
                      }}
                    />
                    <ErrorMessage message={errors.confirm} />
                  </div>
                </div>

                <div>
                  <label className="flex cursor-pointer items-start gap-2.5 text-[13px] leading-relaxed text-ink-700">
                    <input
                      type="checkbox"
                      className={classNames(
                        "control-check mt-0.5",
                        errors.terms &&
                          "outline-2 outline-red-500 outline-solid",
                      )}
                      checked={terms}
                      onChange={(e) => {
                        setTerms(e.target.checked);
                        clearError("terms");
                      }}
                    />
                    <span>
                      আমি সত্য তথ্য দেওয়ার প্রতিশ্রুতি দিচ্ছি এবং{" "}
                      <span className="font-semibold text-teal-700">
                        গোপনীয়তা নীতি
                      </span>{" "}
                      ও{" "}
                      <span className="font-semibold text-teal-700">
                        ব্যবহারের শর্তাবলী
                      </span>{" "}
                      মেনে নিচ্ছি।
                    </span>
                  </label>
                  <ErrorMessage message={errors.terms} />
                </div>

                {errors.form && <ErrorMessage message={errors.form} />}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary w-full py-3.5!"
                >
                  {loading ? (
                    <>
                      <Loader2
                        className="h-4.5 w-4.5 animate-spin"
                        aria-hidden="true"
                      />
                      অ্যাকাউন্ট তৈরি হচ্ছে…
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4.5 w-4.5" aria-hidden="true" />
                      অ্যাকাউন্ট তৈরি করুন
                    </>
                  )}
                </button>
              </form>
            </>
          )}

          {step === "otp" && (
            <div className="mt-6 text-center">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-teal-50 text-teal-700 ring-8 ring-teal-50/60">
                <ShieldCheck className="h-7 w-7" aria-hidden="true" />
              </span>
              <h1 className="font-display mt-4 text-2xl font-bold text-ink-950">
                মোবাইল যাচাইকরণ
              </h1>
              <p className="mx-auto mt-2 max-w-sm text-[13.5px] leading-relaxed text-ink-500">
                <span className="font-bold text-ink-900">{bn(phone)}</span>{" "}
                নম্বরে একটি ৬ সংখ্যার যাচাইকরণ কোড পাঠানো হয়েছে।
              </p>
              <form
                onSubmit={verifyOtp}
                className="mx-auto mt-6 max-w-xs space-y-4"
                noValidate
              >
                <div>
                  <label htmlFor="reg-otp" className="sr-only">
                    যাচাইকরণ কোড
                  </label>
                  <input
                    id="reg-otp"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    autoComplete="one-time-code"
                    className={classNames(
                      "input text-center font-mono text-2xl! font-bold! tracking-[0.5em]",
                      errors.otp && "input-error",
                    )}
                    placeholder="———"
                    value={otp}
                    onChange={(e) => {
                      setOtp(e.target.value.replace(/\D/g, ""));
                      clearError("otp");
                    }}
                  />
                  <ErrorMessage
                    message={errors.otp}
                    className="justify-center"
                  />
                  {resendMsg && (
                    <p className="mt-1 text-[12px] font-semibold text-emerald-600">
                      {resendMsg}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary w-full py-3.5!"
                >
                  {loading ? (
                    <>
                      <Loader2
                        className="h-4.5 w-4.5 animate-spin"
                        aria-hidden="true"
                      />
                      যাচাই হচ্ছে…
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="h-4.5 w-4.5" aria-hidden="true" />
                      নিশ্চিত করুন
                    </>
                  )}
                </button>

                <div className="flex flex-col gap-2 pt-2">
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resendLoading}
                    className="inline-flex items-center justify-center gap-1.5 text-[13px] font-semibold text-teal-700 hover:underline disabled:opacity-50"
                  >
                    {resendLoading ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <RefreshCw className="h-3.5 w-3.5" />
                    )}
                    পুনরায় OTP পাঠান
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep("form")}
                    className="text-[13px] font-semibold text-ink-500 hover:text-teal-700"
                  >
                    ভুল নম্বর? ফিরে গিয়ে ঠিক করুন →
                  </button>
                </div>
              </form>
            </div>
          )}

          {step === "done" && (
            <div className="mt-8 text-center">
              <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/60">
                <CheckCircle2 className="h-9 w-9" aria-hidden="true" />
              </span>
              <h1 className="font-display mt-5 text-2xl font-bold text-ink-950">
                স্বাগতম, {name.split(" ")[0] || "বন্ধু"}!
              </h1>
              <p className="mx-auto mt-2 max-w-sm text-[14px] leading-relaxed text-ink-500">
                আপনার নিবন্ধন সম্পন্ন হয়েছে।{" "}
                {district && (
                  <>
                    <span className="font-bold text-teal-800">{district}</span>{" "}
                    জেলার{" "}
                  </>
                )}
                সতর্কতা ও রিপোর্ট এখন থেকে আপনার অ্যাকাউন্টে জমা হবে।
              </p>
              <div className="mt-6 flex flex-col justify-center gap-2.5 sm:flex-row">
                <Link to="/report" className="btn btn-primary">
                  প্রথম রিপোর্ট করুন
                </Link>
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="btn btn-outline"
                >
                  হোমে যান
                </button>
              </div>
            </div>
          )}

          {step === "form" && (
            <p className="mt-6 border-t border-stone-100 pt-5 text-center text-[13.5px] text-ink-500">
              আগে থেকেই অ্যাকাউন্ট আছে?{" "}
              <Link
                to="/login"
                className="font-bold text-teal-700 hover:underline"
              >
                লগইন করুন
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}